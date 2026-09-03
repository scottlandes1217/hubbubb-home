#!/usr/bin/env python
"""Train a microWakeWord model for one phrase, entirely on this machine.

The official path is a Colab notebook run by hand; this is the same recipe -
piper-generated positives, augmented spectrograms, the mixednet architecture,
a quantized streaming tflite - as one non-interactive command:

    .venv/bin/python train.py "athena" --out ~/.hubbubb-voice/wakewords/athena

Success prints `TRAINED <manifest.json>` as the last line and exits 0. The
manifest + tflite pair is what ESPHome's micro_wake_word loads.

--smoke trains a deliberately tiny model in minutes with no large downloads,
to prove the pipeline end to end. A real model wants the defaults (an
overnight run on this CPU) and the negative feature sets, which download once
into the cache (~3 GB).
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
CACHE = Path.home() / ".hubbubb-voice" / "wakewords" / "cache"
PIPER = CACHE / "piper-sample-generator"
PIPER_MODEL_URL = (
    "https://github.com/rhasspy/piper-sample-generator/releases/download/"
    "v2.0.0/en_US-libritts_r-medium.pt"
)
MWW_REPO = CACHE / "microWakeWord"
NEGATIVE_ROOT = "https://huggingface.co/datasets/kahrendt/microwakeword/resolve/main/"
NEGATIVE_ZIPS = ["dinner_party.zip", "dinner_party_eval.zip", "no_speech.zip", "speech.zip"]
# One shard of ambient clips. The dataset dropped its tar layout for parquet
# (the old data/bal_trainNN.tar URLs 404 as of 2026-08); each shard holds
# a couple thousand flac clips, plenty for augmentation noise.
AUDIOSET_URL = (
    "https://huggingface.co/datasets/agkphysics/AudioSet/resolve/main/data/bal_train/09.parquet"
)

# Spoken by piper as the negative/ambient set in smoke mode - anything that is
# not the wake phrase.
SMOKE_NEGATIVES = [
    "turn on the kitchen lights", "what is the weather like today",
    "set a timer for ten minutes", "play some music in the living room",
    "good morning everyone", "the quick brown fox jumps over the lazy dog",
    "remember that the pool guy comes on tuesdays", "what time is it",
    "lock the front door please", "how many emails do I have",
    "it is rather cold in here", "dim the bedroom lights to half",
]


def run(cmd: list, **kw) -> None:
    print("+", " ".join(str(c) for c in cmd), flush=True)
    subprocess.run([str(c) for c in cmd], check=True, **kw)


def ensure_piper() -> None:
    if not PIPER.exists():
        run(["git", "clone", "-b", "mps-support", "--depth", "1",
             "https://github.com/kahrendt/piper-sample-generator", PIPER])
        # torch >= 2.6 refuses full-model pickles by default; the released
        # .pt is one, and we trust its source.
        script = (PIPER / "generate_samples.py")
        script.write_text(script.read_text().replace(
            "torch.load(model_path)", "torch.load(model_path, weights_only=False)"))
    model = PIPER / "models" / "en_US-libritts_r-medium.pt"
    if not model.exists():
        run(["curl", "-fsSL", "-o", model, PIPER_MODEL_URL])


def generate_clips(phrases: list[str], out_dir: Path, per_phrase: int, batch: int) -> None:
    """Piper-speak each phrase many ways into out_dir (cached: skips if full)."""
    out_dir.mkdir(parents=True, exist_ok=True)
    have = len(list(out_dir.glob("*.wav")))
    want = per_phrase * len(phrases)
    if have >= want:
        print(f"reusing {have} cached clips in {out_dir}", flush=True)
        return
    for i, phrase in enumerate(phrases):
        sub = out_dir / f"p{i}"
        sub.mkdir(exist_ok=True)
        if len(list(sub.glob("*.wav"))) >= per_phrase:
            continue
        run([sys.executable, PIPER / "generate_samples.py", phrase,
             "--max-samples", per_phrase, "--batch-size", min(batch, per_phrase),
             "--output-dir", sub], cwd=CACHE)


def write_noise_clips(out_dir: Path, count: int, seconds: int) -> None:
    """Long colored-noise wavs; the ambient set that catches false accepts."""
    out_dir.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(1234)
    for i in range(count):
        path = out_dir / f"noise_{i}.wav"
        if path.exists():
            continue
        white = rng.normal(0, 0.05, 16000 * seconds)
        # A cheap pink-ish tilt so it is not pure hiss.
        kernel = np.exp(-np.arange(50) / 12.0)
        pink = np.convolve(white, kernel / kernel.sum(), mode="same")
        pcm = np.clip(pink * 3, -1, 1)
        with wave.open(str(path), "wb") as f:
            f.setnchannels(1)
            f.setsampwidth(2)
            f.setframerate(16000)
            f.writeframes((pcm * 32767).astype(np.int16).tobytes())


def copy_clips(src: Path, dest: Path) -> int:
    """Real recordings into the clip tree. Returns how many landed there."""
    wavs = sorted(src.glob("**/*.wav"))
    if not wavs:
        raise SystemExit(f"no .wav files under {src}")
    dest.mkdir(parents=True, exist_ok=True)
    for wav in wavs:
        target = dest / wav.name
        if not target.exists():
            shutil.copy2(wav, target)
    print(f"{len(wavs)} real clips from {src}")
    return len(wavs)


def build_features(clip_dir: Path, feature_dir: Path, augmenter, splits: dict,
                   split_seed: int | None = 10) -> None:
    """Wav clips -> ragged-mmap spectrogram sets microWakeWord trains from.

    split_seed None = too few clips to carve train/val/test from (ambient
    noise, smoke negatives); every set then draws from all clips.
    """
    from microwakeword.audio.clips import Clips
    from microwakeword.audio.spectrograms import SpectrogramGeneration
    from mmap_ninja.ragged import RaggedMmap

    clips = Clips(input_directory=str(clip_dir), file_pattern="**/*.wav",
                  max_clip_duration_s=None, remove_silence=False,
                  random_split_seed=split_seed, split_count=0.1)
    for set_name, (split_name, repetition, slide) in splits.items():
        # data.py discovers feature dirs by globbing "**/*_mmap/" - the
        # trailing "_mmap" in the name is load-bearing.
        out = feature_dir / set_name / "wakeword_mmap"
        if out.exists():
            continue
        out.parent.mkdir(parents=True, exist_ok=True)
        spectrograms = SpectrogramGeneration(
            clips=clips, augmenter=augmenter, slide_frames=slide, step_ms=10)
        # Build under a scratch name: a crashed run must not leave a
        # half-written mmap that the exists-check above then trusts forever.
        building = out.parent / "building_mmap"
        if building.exists():
            shutil.rmtree(building)
        RaggedMmap.from_generator(
            out_dir=str(building),
            sample_generator=spectrograms.spectrogram_generator(
                split=split_name if split_seed is not None else None,
                repeat=repetition),
            batch_size=50, verbose=True)
        building.rename(out)


def ensure_negative_features() -> Path:
    """The official pre-computed negative sets (~3 GB once, cached)."""
    dest = CACHE / "negative_datasets"
    dest.mkdir(parents=True, exist_ok=True)
    for name in NEGATIVE_ZIPS:
        marker = dest / name.replace(".zip", "")
        if marker.exists():
            continue
        zip_path = dest / name
        run(["curl", "-fsSL", "-o", zip_path, NEGATIVE_ROOT + name])
        run(["unzip", "-q", "-o", zip_path, "-d", dest])
        zip_path.unlink()
    return dest


def ensure_background() -> Path:
    """Background audio for augmentation (parquet flacs -> the augmenter reads wav)."""
    import io

    import pyarrow.parquet as pq
    import soundfile

    wav_dir = CACHE / "audioset_16k"
    if wav_dir.exists() and any(wav_dir.iterdir()):
        return wav_dir
    shard = CACHE / "bal_train_09.parquet"
    if not shard.exists():
        run(["curl", "-fsSL", "-o", shard, AUDIOSET_URL])
    wav_dir.mkdir()
    i = 0
    # Streamed in batches: the shard is 650MB of audio bytes, and a whole-table
    # read plus decode would double it in memory.
    for batch in pq.ParquetFile(shard).iter_batches(
            batch_size=64, columns=["audio"]):
        for row in batch.column("audio").to_pylist():
            try:
                audio, rate = soundfile.read(io.BytesIO(row["bytes"]))
            except Exception:
                continue  # one undecodable clip is not worth the run
            if audio.ndim > 1:
                audio = audio.mean(axis=1)
            if rate != 16000:
                idx = np.linspace(0, len(audio),
                                  int(len(audio) * 16000 / rate),
                                  endpoint=False)
                audio = np.interp(idx, np.arange(len(audio)), audio)
            soundfile.write(wav_dir / f"{i}.wav",
                            audio.astype(np.float32), 16000)
            i += 1
    if not i:
        raise RuntimeError("background shard yielded no decodable clips")
    return wav_dir


def make_augmenter(background: Path | None, impulses: Path | None):
    from microwakeword.audio.augmentation import Augmentation

    probabilities = {
        "SevenBandParametricEQ": 0.1, "TanhDistortion": 0.1, "PitchShift": 0.1,
        "BandStopFilter": 0.1, "AddColorNoise": 0.25, "Gain": 1.0,
    }
    if background is not None:
        probabilities["AddBackgroundNoise"] = 0.75
    if impulses is not None:
        probabilities["RIR"] = 0.5
    return Augmentation(
        augmentation_duration_s=3.2,
        augmentation_probabilities=probabilities,
        impulse_paths=[str(impulses)] if impulses else [],
        background_paths=[str(background)] if background else [],
        background_min_snr_db=-5, background_max_snr_db=10,
        min_jitter_s=0.195, max_jitter_s=0.205)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("phrase")
    parser.add_argument("--out", default=None, help="output dir (default ~/.hubbubb-voice/wakewords/<slug>)")
    parser.add_argument("--steps", type=int, default=10000, help="training steps")
    parser.add_argument("--samples", type=int, default=1000, help="positive clips to generate")
    parser.add_argument("--cutoff", type=float, default=0.97, help="manifest probability cutoff; raise if it false-triggers, lower if it misses wakes")
    parser.add_argument("--extra-positives", default=None,
                        help="directory of real recordings of the phrase (this "
                             "room, this microphone) to train on alongside the "
                             "generated ones")
    parser.add_argument("--extra-negatives", default=None,
                        help="directory of real audio the model must sit "
                             "through - the television, Jarvis's own replies. "
                             "Used for training and for the false-accept "
                             "measurement the cutoff table is read from")
    parser.add_argument("--smoke", action="store_true", help="tiny fast run proving the pipeline; the model itself will be poor")
    args = parser.parse_args()

    slug = "_".join(args.phrase.lower().split())
    out_dir = Path(args.out or Path.home() / ".hubbubb-voice" / "wakewords" / slug).expanduser()
    work = out_dir / "work"
    work.mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(parents=True, exist_ok=True)

    if args.smoke:
        args.samples, args.steps = 40, 250

    ensure_piper()

    # --- audio -> features ---------------------------------------------------
    generate_clips([args.phrase], work / "positive_clips", args.samples, 50)
    if args.extra_positives:
        # Straight into the generated pile: same augmentation, same split.
        copy_clips(Path(args.extra_positives).expanduser(),
                   work / "positive_clips" / "real")

    if args.smoke:
        background, impulses = None, PIPER / "impulses"
        generate_clips(SMOKE_NEGATIVES, work / "negative_clips", 4, 4)
        write_noise_clips(work / "ambient_clips", count=2, seconds=30)
    else:
        background, impulses = ensure_background(), PIPER / "impulses"

    augmenter = make_augmenter(background, impulses)
    plain = make_augmenter(None, None)

    build_features(work / "positive_clips", work / "features" / "positive", augmenter, {
        "training": ("train", 2, 10),
        "validation": ("validation", 1, 10),
        "testing": ("test", 1, 1),
    })

    features: list[dict] = [{
        "features_dir": str(work / "features" / "positive"),
        "sampling_weight": 2.0, "penalty_weight": 1.0, "truth": True,
        "truncation_strategy": "truncate_start", "type": "mmap",
    }]

    if args.smoke:
        build_features(work / "negative_clips", work / "features" / "negative", plain, {
            "training": ("train", 1, 10),
            "validation": ("validation", 1, 10),
            "testing": ("test", 1, 1),
        }, split_seed=None)
        build_features(work / "ambient_clips", work / "features" / "ambient", plain, {
            "validation_ambient": ("train", 1, 1),
            "testing_ambient": ("train", 1, 1),
        }, split_seed=None)
        features += [
            {"features_dir": str(work / "features" / "negative"),
             "sampling_weight": 10.0, "penalty_weight": 1.0, "truth": False,
             "truncation_strategy": "random", "type": "mmap"},
            {"features_dir": str(work / "features" / "ambient"),
             "sampling_weight": 0.0, "penalty_weight": 1.0, "truth": False,
             "truncation_strategy": "split", "type": "mmap"},
        ]
    else:
        negatives = ensure_negative_features()
        for name, weight in [("speech", 10.0), ("dinner_party", 10.0), ("no_speech", 5.0)]:
            features.append({
                "features_dir": str(negatives / name), "sampling_weight": weight,
                "penalty_weight": 1.0, "truth": False,
                "truncation_strategy": "random", "type": "mmap"})
        features.append({
            "features_dir": str(negatives / "dinner_party_eval"),
            "sampling_weight": 0.0, "penalty_weight": 1.0, "truth": False,
            "truncation_strategy": "split", "type": "mmap"})

    if args.extra_negatives:
        # Twice over: as training negatives, and as an ambient set, so the
        # false-accepts-per-hour table at the end is measured against this
        # room's own television rather than a stranger's dinner party.
        house = work / "house_negative_clips"
        copy_clips(Path(args.extra_negatives).expanduser(), house)
        build_features(house, work / "features" / "house_negative", plain, {
            "training": ("train", 1, 10),
            "validation": ("validation", 1, 10),
            "testing": ("test", 1, 1),
            "validation_ambient": ("train", 1, 1),
            "testing_ambient": ("train", 1, 1),
        }, split_seed=None)
        features.append({
            "features_dir": str(work / "features" / "house_negative"),
            "sampling_weight": 20.0, "penalty_weight": 1.0, "truth": False,
            "truncation_strategy": "random", "type": "mmap"})

    # --- train ---------------------------------------------------------------
    import yaml

    train_dir = work / "trained"
    config = {
        "window_step_ms": 10,
        "train_dir": str(train_dir),
        "features": features,
        "training_steps": [args.steps],
        "positive_class_weight": [1],
        "negative_class_weight": [20],
        "learning_rates": [0.001],
        "batch_size": 128,
        "time_mask_max_size": [0], "time_mask_count": [0],
        "freq_mask_max_size": [0], "freq_mask_count": [0],
        "eval_step_interval": max(50, min(500, args.steps // 5)),
        "clip_duration_ms": 1500,
        "target_minimization": 0.9,
        "minimization_metric": None,
        "maximization_metric": "average_viable_recall",
    }
    config_path = work / "training_parameters.yaml"
    config_path.write_text(yaml.dump(config))

    run([sys.executable, "-m", "microwakeword.model_train_eval",
         f"--training_config={config_path}",
         "--train", "1", "--restore_checkpoint", "1",
         "--test_tf_nonstreaming", "0", "--test_tflite_nonstreaming", "0",
         "--test_tflite_nonstreaming_quantized", "0", "--test_tflite_streaming", "0",
         "--test_tflite_streaming_quantized", "1",
         "--use_weights", "best_weights",
         "mixednet",
         "--pointwise_filters", "64,64,64,64",
         "--repeat_in_block", "1, 1, 1, 1",
         "--mixconv_kernel_sizes", "[5], [7,11], [9,15], [23]",
         "--residual_connection", "0,0,0,0",
         "--first_conv_filters", "32",
         "--first_conv_kernel_size", "5",
         "--stride", "3"],
        cwd=work)

    # --- package -------------------------------------------------------------
    tflite = train_dir / "tflite_stream_state_internal_quant" / "stream_state_internal_quant.tflite"
    if not tflite.exists():
        sys.exit(f"training finished but {tflite} is missing")
    shutil.copyfile(tflite, out_dir / f"{slug}.tflite")

    manifest = {
        "type": "micro",
        "wake_word": args.phrase,
        "author": "hubbubb-home wakeword trainer",
        "website": "https://github.com/kahrendt/microWakeWord",
        "model": f"{slug}.tflite",
        "trained_languages": ["en"],
        "version": 2,
        "micro": {
            # ponytail: static cutoff; the streaming-quant test report in
            # work/trained/ has the recall/FAH curve - tune from there.
            "probability_cutoff": args.cutoff,
            "sliding_window_size": 5,
            "feature_step_size": 10,
            "tensor_arena_size": 22860,
            "minimum_esphome_version": "2024.7.0",
        },
    }
    manifest_path = out_dir / f"{slug}.json"
    manifest_path.write_text(json.dumps(manifest, indent=2))
    print(f"TRAINED {manifest_path}", flush=True)


if __name__ == "__main__":
    main()
