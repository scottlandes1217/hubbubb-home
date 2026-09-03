#!/usr/bin/env python3
"""Record room audio on this machine for wake-word training.

The puck cannot supply it: it only streams after a wake, and a second wake
word mid-stream cancels the session, so one wake is worth one sample no
matter how many times you say the word. This records straight from the
Mac's own microphone instead - put the laptop beside the puck and it hears
roughly what the puck hears.

    record.py 240 ~/.hubbubb-voice/room/jarvis.wav      # positives, walk about
    record.py 1200 ~/.hubbubb-voice/room/tv.wav         # negatives, telly on

16 kHz mono, which is what the trainer wants. Prints a level every few
seconds so a dead microphone is obvious while there is still time to fix it.
"""

from __future__ import annotations

import sys
import wave
from pathlib import Path

import numpy as np
import sounddevice as sd

RATE = 16000


def record(seconds: float, out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    blocks: list[np.ndarray] = []
    with sd.InputStream(samplerate=RATE, channels=1, dtype="int16") as stream:
        for tick in range(int(seconds)):
            block, overflowed = stream.read(RATE)
            if overflowed:
                print("  (dropped audio)", flush=True)
            blocks.append(block.copy())
            if tick % 5 == 0:
                level = float(np.abs(block.astype(np.float32) / 32768).mean())
                bar = "#" * min(40, int(level * 400))
                print(f"{tick:4d}s {level:.4f} {bar}", flush=True)
    audio = np.concatenate(blocks)
    with wave.open(str(out), "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(RATE)
        handle.writeframes(audio.tobytes())
    peak = float(np.abs(audio.astype(np.float32) / 32768).max())
    print(f"WROTE {out} {len(audio)/RATE:.0f}s peak={peak:.3f}")
    if peak < 0.02:
        raise SystemExit("that is silence - check the microphone and its permission")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    record(float(sys.argv[1]), Path(sys.argv[2]).expanduser())
