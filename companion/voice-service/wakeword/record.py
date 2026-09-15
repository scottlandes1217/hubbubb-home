#!/usr/bin/env python3
"""Record room audio for wake-word training, from this Mac or from the puck.

    record.py 240  ~/.hubbubb-voice/room/jarvis.wav     # positives, walk about
    record.py 1200 ~/.hubbubb-voice/room/tv.wav         # negatives, telly on
    record.py 36000 ~/.hubbubb-voice/room/tv-long.wav --puck 192.168.0.200

The Mac's own microphone is the fallback: put the laptop beside the puck and
it hears roughly what the puck hears. Roughly is the problem - a different
microphone, a different gain and a different AGC, and the model is being
trained on audio it will never actually meet.

--puck reads the real thing, through the mic_tap component in
~/.claude/hooks/voice-pe/components/. That is a passive tap on the same
processed stream micro_wake_word listens to, so what lands here is what the
wake model hears, gain and channel included. The puck sends nothing until
this connects and stops when it disconnects.

16 kHz mono, which is what the trainer wants. Prints a level every few
seconds so a dead microphone is obvious while there is still time to fix it.
"""

from __future__ import annotations

import socket
import sys
import wave
from pathlib import Path

import numpy as np

RATE = 16000
TAP_PORT = 6055


def mac_blocks(seconds: float):
    """One second of audio at a time from this machine's own microphone."""
    import sounddevice as sd  # only needed for the local microphone

    with sd.InputStream(samplerate=RATE, channels=1, dtype="int16") as stream:
        for _ in range(int(seconds)):
            block, overflowed = stream.read(RATE)
            if overflowed:
                print("  (dropped audio)", flush=True)
            yield block.reshape(-1)


def puck_blocks(seconds: float, host: str):
    """One second at a time from the puck's mic_tap.

    A short read is a stall, not the end: the socket is left blocking with a
    timeout so an evening's recording survives a wifi wobble, and anything
    truly broken raises rather than quietly writing silence for six hours.
    """
    want = RATE * 2  # int16
    with socket.create_connection((host, TAP_PORT), timeout=30) as tap:
        tap.settimeout(30)
        print(f"connected to {host}:{TAP_PORT}", flush=True)
        for _ in range(int(seconds)):
            chunk = bytearray()
            while len(chunk) < want:
                piece = tap.recv(want - len(chunk))
                if not piece:
                    print("\npuck closed the stream", flush=True)
                    return
                chunk += piece
            yield np.frombuffer(bytes(chunk), np.int16)


def record(seconds: float, out: Path, host: str | None = None) -> None:
    """Write straight to the wav as it arrives.

    An overnight negatives run is hours long and a gigabyte of int16; held in
    a list until the end, a crash at hour nine costs the whole night and the
    only cure is doing it again tomorrow. Written as it goes, an interrupted
    run still leaves usable audio - Ctrl-C is a valid way to stop early.
    """
    out.parent.mkdir(parents=True, exist_ok=True)
    peak = 0.0
    written = 0
    blocks = (puck_blocks(seconds, host) if host else mac_blocks(seconds))
    with wave.open(str(out), "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(RATE)
        try:
            for tick, block in enumerate(blocks):
                handle.writeframes(block.tobytes())
                written += len(block)
                scaled = np.abs(block.astype(np.float32) / 32768)
                peak = max(peak, float(scaled.max()))
                if tick % 5 == 0:
                    level = float(scaled.mean())
                    bar = "#" * min(40, int(level * 400))
                    hms = f"{tick // 3600:d}:{tick // 60 % 60:02d}:{tick % 60:02d}"
                    print(f"{hms} {level:.4f} {bar}", flush=True)
        except KeyboardInterrupt:
            print("\nstopped early", flush=True)
    print(f"WROTE {out} {written/RATE:.0f}s peak={peak:.3f}")
    if peak < 0.02:
        raise SystemExit("that is silence - check the microphone and its permission")


if __name__ == "__main__":
    args = sys.argv[1:]
    host = None
    if "--puck" in args:
        at = args.index("--puck")
        host = args[at + 1] if len(args) > at + 1 else "192.168.0.200"
        del args[at:at + 2]
    if len(args) != 2:
        raise SystemExit(__doc__)
    record(float(args[0]), Path(args[1]).expanduser(), host)
