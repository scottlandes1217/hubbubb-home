"""Wake word on the Mac: the puck's own microphone, judged twice.

The puck's wake models have to fit on an ESP32, and three retrains traded
missed wakes against television wakes without getting rid of either. The
Mac can afford to look twice:

  stage 1  the puck's own models - the trained `jarvis` and the stock
           `hey_jarvis` - under the puck's own rule, but at a permissive
           cutoff, so a far-field "Jarvis" scoring 0.6 still gets a hearing;
  stage 2  Whisper (large-v3-turbo) on the 2.4 s around it. The
           television's near misses ("Service!", "Sorry, miss.", "from
           George") never transcribe as anything like Jarvis.

Measured on puck audio (2026-11-23): 77 min of television, where the puck's
own rule would have woken about 3 times an hour, gave 0 false wakes; 60
"Jarvis"/"Hey Jarvis" phrases from 15 voices mixed over the same television
gave 82% recall, the same as the puck running both models.

Audio comes from the puck's mic_tap (TCP 6055): exactly what its own wake
model hears, including the second before the word, which the stock firmware
never sends. The tap takes one client, so stop this before record.py.

Shadow mode (the only mode yet) decides and logs, and triggers nothing: a
day of decisions beside what the puck actually did is the measurement that
decides whether this takes over.

    .venv/bin/python listen.py --puck 192.168.1.200
    .venv/bin/python listen.py --file recording.wav     # replay, fast
"""

from __future__ import annotations

import argparse
import concurrent.futures
import difflib
import json
import re
import socket
import sys
import time
import wave
from datetime import datetime
from pathlib import Path

import numpy as np

from harvest import RATE, moving

TAP_PORT = 6055
MODELS = {
    "jarvis": Path.home() / ".hubbubb-voice/wakewords/jarvis3/jarvis.tflite",
    "hey_jarvis": Path.home()
    / ".claude/hooks/voice-pe/.esphome/micro_wake_word/db6fafef/hey_jarvis.tflite",
}
# Stage 1's bar. The puck itself fires at 0.9 (jarvis) / 0.92 (hey_jarvis);
# this lets the quieter, farther ones through to be judged by stage 2.
LOW = 0.5
WINDOW_S = 2.5  # scored every HOP_S, newest audio last
HOP_S = 0.5
BEFORE_S, AFTER_S = 2.0, 0.4  # the clip stage 2 hears around a candidate
DEAF_S = 1.5  # one word is one candidate
# Whisper spells a far-field Jarvis many ways ("Javas", "Arvis", "Jervis");
# a fixed list missed a third of them. Any word this close to "jarvis"
# counts. 0.7 keeps "Travis" (0.67), "Service" and "Charges" (0.46) out.
CLOSE = 0.7
# The puck's own cutoffs: a fire this sure with no words heard at all is a
# word Whisper could not make out, not television (television has words).
PUCK = {"jarvis": 0.9, "hey_jarvis": 0.92}
WHISPER = "mlx-community/whisper-large-v3-turbo"


def says_jarvis(text: str) -> bool:
    words = re.findall(r"[a-z]+", text.lower())
    return any(difflib.SequenceMatcher(None, w, "jarvis").ratio() >= CLOSE
               for w in words)


class Judge:
    def __init__(self, out: Path):
        from microwakeword.inference import Model

        # stride=3 is the mixednet's training stride; anything else scores noise
        self.models = {k: Model(str(v), stride=3) for k, v in MODELS.items()}
        self.out = out
        (out / "clips").mkdir(parents=True, exist_ok=True)

    def stage1(self, window: np.ndarray) -> dict[str, float]:
        """Peak score per model over the newest HOP of the window."""
        peaks = {}
        for name, model in self.models.items():
            avg = moving(np.array(model.predict_clip(window, step_ms=10)).flatten())
            if not len(avg):
                continue
            newest = max(1, int(len(avg) * (HOP_S + 0.1) / WINDOW_S))
            peaks[name] = round(float(avg[-newest:].max()), 3)
        return peaks

    def stage2(self, clip: np.ndarray) -> str:
        audio = clip.astype(np.float32) / 32768
        # far-field puck audio is ~6x quieter than a laptop's; level it
        audio = audio / (np.abs(audio).max() or 1) * 0.5
        import mlx_whisper

        # No initial_prompt: hinting "Jarvis" raised recall by a point and
        # made it hear Jarvis in five television clips out of nineteen.
        return mlx_whisper.transcribe(
            audio, path_or_hf_repo=WHISPER, language="en",
            condition_on_previous_text=False)["text"].strip()

    def decide(self, when: float, peaks: dict, clip: np.ndarray) -> dict:
        start = time.monotonic()
        text = self.stage2(clip)
        sure = any(peaks.get(k, 0) >= cut for k, cut in PUCK.items())
        accept = says_jarvis(text) or (sure and not text)
        stamp = datetime.fromtimestamp(when)
        name = f"{stamp:%Y%m%d-%H%M%S}_{'yes' if accept else 'no'}.wav"
        with wave.open(str(self.out / "clips" / name), "wb") as handle:
            handle.setnchannels(1)
            handle.setsampwidth(2)
            handle.setframerate(RATE)
            handle.writeframes(clip.tobytes())
        row = {"time": stamp.isoformat(timespec="milliseconds"), "peaks": peaks,
               "text": text, "accept": accept, "clip": name,
               "verify_ms": round((time.monotonic() - start) * 1000)}
        with open(self.out / "decisions.jsonl", "a") as log:
            log.write(json.dumps(row) + "\n")
        print(("WAKE  " if accept else "no    ") + json.dumps(row), flush=True)
        return row


def run(blocks, judge: Judge, clock) -> None:
    """Score the stream every HOP; hand candidates to stage 2 off-thread."""
    keep = int((WINDOW_S + AFTER_S + 0.5) * RATE)
    buf = np.zeros(0, np.int16)
    fresh = 0
    deaf_until = 0.0
    pending: list[tuple[float, dict, int]] = []  # (when, peaks, samples to wait)
    pool = concurrent.futures.ThreadPoolExecutor(1)
    for block in blocks:
        buf = np.concatenate([buf, block])[-keep:]
        fresh += len(block)
        for item in list(pending):
            when, peaks, wait = item
            pending.remove(item)
            wait -= len(block)
            if wait > 0:
                pending.append((when, peaks, wait))
                continue
            clip = buf[-int((BEFORE_S + AFTER_S) * RATE):].copy()
            pool.submit(judge.decide, when, peaks, clip)
        if fresh < HOP_S * RATE or len(buf) < WINDOW_S * RATE:
            continue
        fresh = 0
        window = buf[-int(WINDOW_S * RATE):]
        peaks = judge.stage1(window)
        now = clock()
        if max(peaks.values(), default=0) >= LOW and now >= deaf_until:
            deaf_until = now + DEAF_S
            pending.append((now, peaks, int(AFTER_S * RATE)))
    pool.shutdown(wait=True)


def puck_blocks(host: str):
    """Tenths of a second from the tap, forever; reconnects after a drop."""
    want = RATE // 10 * 2
    while True:
        try:
            with socket.create_connection((host, TAP_PORT), timeout=10) as tap:
                tap.settimeout(10)
                print(f"listening to {host}:{TAP_PORT}", flush=True)
                while True:
                    chunk = b""
                    while len(chunk) < want:
                        got = tap.recv(want - len(chunk))
                        if not got:
                            raise ConnectionError("tap closed")
                        chunk += got
                    yield np.frombuffer(chunk, np.int16)
        except OSError as err:
            print(f"tap: {err}; retrying in 5 s", flush=True)
            time.sleep(5)


def file_blocks(path: Path, clock: list[float]):
    """A recording as if it were live, as fast as it scores."""
    with wave.open(str(path)) as handle:
        if handle.getframerate() != RATE or handle.getnchannels() != 1:
            raise SystemExit(f"{path}: want 16 kHz mono")
        while frames := handle.readframes(RATE // 10):
            clock[0] += len(frames) / 2 / RATE
            yield np.frombuffer(frames, np.int16)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--puck", help="puck address (mic_tap on 6055)")
    parser.add_argument("--file", type=Path, help="replay a 16 kHz mono wav")
    parser.add_argument("--out", type=Path,
                        default=Path.home() / ".hubbubb-voice/wake-shadow")
    args = parser.parse_args()
    if bool(args.puck) == bool(args.file):
        parser.error("give exactly one of --puck or --file")
    judge = Judge(args.out)
    if args.file:
        clock = [0.0]  # replay: decision times are offsets into the file
        run(file_blocks(args.file, clock), judge, lambda: clock[0])
    else:
        run(puck_blocks(args.puck), judge, time.time)


if __name__ == "__main__":
    sys.exit(main())
