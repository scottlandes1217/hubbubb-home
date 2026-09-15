#!/usr/bin/env python3
"""Cut a room recording into the clips the trainer eats.

    harvest.py bursts recording.wav out/    # one clip per utterance
    harvest.py chunks  telly.wav     out/   # fixed slices of ambient audio
    harvest.py hard    telly.wav     out/ jarvis.tflite   # what actually fooled it

`bursts` finds each spoken word by energy and writes it padded to 1.5 s with
the speech at the END: microWakeWord's positive sets use
truncation_strategy "truncate_start", which keeps the tail of a clip, so a
word sitting at the front would be trimmed away and the model would train on
silence. `chunks` just slices - negatives are truncated at random, so where
the sound falls does not matter.

`hard` is the one that moves the needle. Slicing an evening of television
gives thousands of clips the model already scores near zero: it is right
about all of them, so it learns nothing and the gradient goes nowhere. This
runs the current model over the recording with the puck's own decision rule
and keeps only the moments that came close to firing - a few hundred windows
out of ten hours, and the only ones on the boundary. Feed those back as
negatives at a raised penalty weight.
"""

from __future__ import annotations

import sys
import wave
from pathlib import Path

import numpy as np

RATE = 16000
CLIP = 1.5  # seconds, matching the trainer's clip_duration_ms

# The puck's rule, from home-assistant-voice.yaml: a moving average over
# `sliding_window_size` probabilities, and 25 slices of deafness after a fire
# so one word cannot count twice.
WINDOW = 5
REFRACTORY = 25
# Below this the model was never in danger of firing, so the clip teaches it
# nothing it does not already know. Well under any cutoff worth shipping -
# the near misses are the point, not just the hits.
NEAR = 0.4
# One predict_clip over ten hours would build a spectrogram for ten hours of
# audio in one go. Read the file in pieces, overlapping by more than a clip
# so a trigger straddling a seam is still seen whole.
PIECE = 300.0
OVERLAP = 2.0


def read(path: Path) -> np.ndarray:
    with wave.open(str(path)) as handle:
        if handle.getframerate() != RATE or handle.getnchannels() != 1:
            raise SystemExit(f"{path}: want 16 kHz mono")
        return np.frombuffer(handle.readframes(handle.getnframes()), np.int16)


def write(path: Path, audio: np.ndarray) -> None:
    with wave.open(str(path), "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(RATE)
        handle.writeframes(audio.astype(np.int16).tobytes())


def bursts(audio: np.ndarray, out: Path) -> int:
    """Every run of speech, padded to CLIP seconds with the word at the end."""
    window = int(0.02 * RATE)
    frames = len(audio) // window
    level = np.array([
        np.sqrt((audio[i * window:(i + 1) * window].astype(np.float32) / 32768) ** 2).mean()
        for i in range(frames)
    ])
    # A floor well above the room's own hiss, and a share of the loudest word:
    # a fixed threshold either drowns in a noisy room or splits every breath.
    # Both terms are relative on purpose. There used to be a 0.006 absolute
    # floor as well, which was invisible on laptop audio (the relative terms
    # sit five times higher) and silently ate puck audio, which arrives six
    # times quieter: 18000 frames of speech came back as 108. Any constant
    # here is a constant about one microphone.
    floor = max(np.percentile(level, 40) * 3, level.max() * 0.12)
    voiced = level > floor
    spans, start = [], None
    for i, on in enumerate(voiced):
        if on and start is None:
            start = i
        elif not on and start is not None:
            spans.append((start, i))
            start = None
    if start is not None:
        spans.append((start, frames))
    merged: list[tuple[int, int]] = []
    for span in spans:
        if merged and span[0] - merged[-1][1] < 8:  # < 160 ms apart: one word
            merged[-1] = (merged[-1][0], span[1])
        else:
            merged.append(span)

    out.mkdir(parents=True, exist_ok=True)
    kept = 0
    for first, last in merged:
        seconds = (last - first) * 0.02
        if not 0.15 <= seconds <= 1.2:  # a breath, or a whole sentence
            continue
        begin = max(0, int((first * 0.02 - 0.12) * RATE))
        end = min(len(audio), int((last * 0.02 + 0.25) * RATE))
        word = audio[begin:end]
        clip = np.zeros(int(CLIP * RATE), dtype=np.int16)
        word = word[-len(clip):]
        clip[-len(word):] = word  # word at the end, ahead of truncate_start
        write(out / f"burst_{kept:04d}.wav", clip)
        kept += 1
    return kept


def chunks(audio: np.ndarray, out: Path, seconds: float = 10.0) -> int:
    out.mkdir(parents=True, exist_ok=True)
    size = int(seconds * RATE)
    count = 0
    for start in range(0, len(audio) - size, size):
        write(out / f"chunk_{count:04d}.wav", audio[start:start + size])
        count += 1
    return count


def moving(probabilities: np.ndarray) -> np.ndarray:
    """The puck's moving average over the raw per-step probabilities."""
    from numpy.lib.stride_tricks import sliding_window_view

    if len(probabilities) < WINDOW:
        return np.zeros(0)
    return sliding_window_view(probabilities, WINDOW).mean(axis=-1)


def fires(averaged: np.ndarray, cutoff: float) -> list[tuple[int, float]]:
    """Detections as (index, peak), respecting the refractory period.

    The peak is the highest average reached during the detection, not the
    value at the moment it crossed the threshold. Reporting the crossing
    instead understates every detection to roughly the cutoff: mining at 0.4
    logged a clip that actually reached 1.000 as 0.45, which made real wakes
    look like distant near misses and hid them from the review list.
    """
    hits, i = [], 0
    while i < len(averaged):
        if averaged[i] >= cutoff:
            window = averaged[i:i + REFRACTORY]
            hits.append((i + int(window.argmax()), float(window.max())))
            i += REFRACTORY
        else:
            i += 1
    return hits


def hard(source: Path, out: Path, tflite: Path, near: float = NEAR) -> int:
    """Keep the windows of `source` that came within `near` of waking the model.

    The clip ends just after the moment of detection: microWakeWord scores a
    phrase at its end, so the audio that caused the spike is what precedes it.
    """
    from microwakeword.inference import Model

    # stride=3 is the mixednet's own training stride. Left at the default the
    # model scores everything like noise and every measurement built on it is
    # quietly worthless.
    model = Model(str(tflite), stride=3)
    out.mkdir(parents=True, exist_ok=True)

    kept = 0
    peaks: list[float] = []
    seen: list[int] = []
    with wave.open(str(source)) as handle:
        if handle.getframerate() != RATE or handle.getnchannels() != 1:
            raise SystemExit(f"{source}: want 16 kHz mono")
        total = handle.getnframes()
        # The whole file is scanned exactly once; the overlap below only keeps
        # detection continuous across the seams and adds no audio, so the
        # duration is simply the file's own length.
        hours = total / RATE / 3600
        step = int((PIECE - OVERLAP) * RATE)
        for start in range(0, total, step):
            handle.setpos(start)
            piece = np.frombuffer(
                handle.readframes(int(PIECE * RATE)), np.int16)
            if len(piece) < int(CLIP * RATE):
                break
            averaged = moving(
                np.array(model.predict_clip(piece, step_ms=10)).flatten())
            if not len(averaged):
                continue
            # predict_clip's output rate follows the stride, so derive
            # samples-per-step from the piece rather than assuming 30 ms.
            per_step = len(piece) / len(averaged)
            for index, peak in fires(averaged, near):
                at = start + int((index + WINDOW) * per_step)
                # A trigger inside the seam is scored by both pieces. Keeping
                # it twice would double-count it in the rate below and feed
                # the trainer the same second of television twice over.
                if any(abs(at - before) < CLIP * RATE for before in seen):
                    continue
                seen.append(at)
                end = min(total, at + int(0.1 * RATE))
                begin = end - int(CLIP * RATE)
                if begin < 0:
                    continue
                handle.setpos(begin)
                clip = np.frombuffer(
                    handle.readframes(int(CLIP * RATE)), np.int16)
                # The offset is in the name because the review below needs it:
                # a clip scoring 1.000 is more likely to be somebody actually
                # saying the wake word than a near miss, and the only way to
                # tell is to look up what was happening at that moment.
                at_s = at // RATE
                stamp = f"{at_s // 3600:02d}h{at_s // 60 % 60:02d}m{at_s % 60:02d}s"
                write(out / f"hard_{kept:04d}_{stamp}.wav", clip)
                peaks.append((peak, stamp))
                kept += 1
            done = min(total, start + len(piece)) / RATE / 3600
            print(f"  {done:5.2f}h / {hours:.2f}h  {kept} kept", flush=True)

    print(f"\n{kept} hard negatives from {hours:.2f}h in {out}")
    if peaks:
        scored = np.array([score for score, _ in peaks])
        print("\n cutoff   would have woken the puck (per hour)")
        for cut in (0.5, 0.7, 0.9, 0.95, 0.97):
            print(f"  {cut:.2f}   {(scored >= cut).sum() / hours:8.2f}")
        # Anything at or above the shipped cutoff really did wake the puck at
        # that moment. If one of them was you, it is a positive sitting in the
        # negatives, and training on it teaches the model to ignore you.
        loud = sorted((s, t) for s, t in peaks if s >= 0.9)
        if loud:
            print(f"\n{len(loud)} clips would have woken it - CHECK THESE "
                  "before training, any that were you must be deleted:")
            for score, stamp in reversed(loud):
                print(f"  {score:.3f}  at {stamp}")
    if kept < 30:
        print("\nthin: record more hours, or lower the threshold, before training")
    return kept


def demo() -> None:
    """Three beeps in silence must come back as three clips, word at the end."""
    import tempfile

    tone = (np.sin(np.arange(int(0.4 * RATE)) * 0.1) * 12000).astype(np.int16)
    audio = np.zeros(int(6 * RATE), dtype=np.int16)
    for at in (1.0, 3.0, 4.5):
        audio[int(at * RATE):int(at * RATE) + len(tone)] = tone
    tmp = Path(tempfile.mkdtemp())
    assert bursts(audio, tmp / "b") == 3, "three tones, three clips"
    # The same three tones at the puck's quieter level must still be found:
    # nothing in here may be calibrated to one microphone's loudness.
    assert bursts((audio / 8).astype(np.int16), tmp / "q") == 3, \
        "quiet audio must burst the same as loud"
    clip = read(tmp / "b" / "burst_0000.wav")
    assert len(clip) == int(CLIP * RATE), "padded to the trainer's clip length"
    assert np.abs(clip[:int(0.5 * RATE)]).max() == 0, "leading silence"
    assert np.abs(clip[-int(0.3 * RATE):]).max() > 0, "sound at the end"
    assert chunks(audio, tmp / "c", seconds=2.0) == 2

    # The puck's rule: a lone spike must not fire where a sustained one does,
    # and one long spike must count once, not once per slice.
    spike = np.zeros(60); spike[10] = 1.0
    assert moving(spike).max() < 0.9, "a single slice must not carry the average"
    held = np.zeros(60); held[10:20] = 1.0
    assert moving(held).max() == 1.0, "a sustained spike clears the cutoff"
    assert len(fires(moving(held), 0.9)) == 1, "refractory: one word, one wake"
    assert len(fires(np.ones(REFRACTORY * 3), 0.9)) == 3, "one per refractory"
    assert fires(np.zeros(60), 0.9) == [], "silence never fires"
    # The score reported must be the top of the detection, not the threshold
    # it crossed on the way up - the whole review list depends on it.
    ramp = np.zeros(60)
    ramp[10:20] = np.linspace(0.45, 1.0, 10)
    index, peak = fires(ramp, 0.4)[0]
    assert peak == 1.0, f"reported the crossing ({peak}) instead of the peak"
    assert index == 19, "index must point at the peak"
    print("harvest self-check ok")


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "demo":
        demo()
    elif len(sys.argv) >= 5 and sys.argv[1] == "hard":
        hard(Path(sys.argv[2]).expanduser(), Path(sys.argv[3]).expanduser(),
             Path(sys.argv[4]).expanduser(),
             float(sys.argv[5]) if len(sys.argv) > 5 else NEAR)
    elif len(sys.argv) >= 4 and sys.argv[1] in ("bursts", "chunks"):
        source = read(Path(sys.argv[2]).expanduser())
        target = Path(sys.argv[3]).expanduser()
        made = (bursts(source, target) if sys.argv[1] == "bursts"
                else chunks(source, target))
        print(f"{made} clips in {target}")
    else:
        raise SystemExit(__doc__)
