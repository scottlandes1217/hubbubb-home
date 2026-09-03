#!/usr/bin/env python3
"""Cut a room recording into the clips the trainer eats.

    harvest.py bursts recording.wav out/    # one clip per utterance
    harvest.py chunks  telly.wav     out/   # fixed slices of ambient audio

`bursts` finds each spoken word by energy and writes it padded to 1.5 s with
the speech at the END: microWakeWord's positive sets use
truncation_strategy "truncate_start", which keeps the tail of a clip, so a
word sitting at the front would be trimmed away and the model would train on
silence. `chunks` just slices - negatives are truncated at random, so where
the sound falls does not matter.
"""

from __future__ import annotations

import sys
import wave
from pathlib import Path

import numpy as np

RATE = 16000
CLIP = 1.5  # seconds, matching the trainer's clip_duration_ms


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
    floor = max(np.percentile(level, 40) * 3, level.max() * 0.12, 0.006)
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


def demo() -> None:
    """Three beeps in silence must come back as three clips, word at the end."""
    import tempfile

    tone = (np.sin(np.arange(int(0.4 * RATE)) * 0.1) * 12000).astype(np.int16)
    audio = np.zeros(int(6 * RATE), dtype=np.int16)
    for at in (1.0, 3.0, 4.5):
        audio[int(at * RATE):int(at * RATE) + len(tone)] = tone
    tmp = Path(tempfile.mkdtemp())
    assert bursts(audio, tmp / "b") == 3, "three tones, three clips"
    clip = read(tmp / "b" / "burst_0000.wav")
    assert len(clip) == int(CLIP * RATE), "padded to the trainer's clip length"
    assert np.abs(clip[:int(0.5 * RATE)]).max() == 0, "leading silence"
    assert np.abs(clip[-int(0.3 * RATE):]).max() > 0, "sound at the end"
    assert chunks(audio, tmp / "c", seconds=2.0) == 2
    print("harvest self-check ok")


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "demo":
        demo()
    elif len(sys.argv) >= 4 and sys.argv[1] in ("bursts", "chunks"):
        source = read(Path(sys.argv[2]).expanduser())
        target = Path(sys.argv[3]).expanduser()
        made = (bursts(source, target) if sys.argv[1] == "bursts"
                else chunks(source, target))
        print(f"{made} clips in {target}")
    else:
        raise SystemExit(__doc__)
