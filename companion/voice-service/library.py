"""Clips the house records of itself: wake-word takes, ambient noise, voices.

A front end presses record, talks (or lets the telly run), presses stop; the
take is cut into clips and shelved as <root>/<kind>/<label-slug>/<id>.wav
with one index.json of records beside them. That layout is deliberately the
one wakeword/train.py already walks, so a training run points straight at a
shelf rather than at a copy of it.
"""

from __future__ import annotations

import json
import os
import re
import secrets
import tempfile
import threading
import time
from pathlib import Path

import numpy as np

from wakeword import harvest
from wakeword.harvest import RATE

KINDS = ("wake", "ambient", "voice")


def slug(label: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-") or "misc"


def split_take(kind: str, audio: np.ndarray) -> list[np.ndarray]:
    """Cut a finished take into the clips its consumer wants."""
    if len(audio) < RATE:
        return []  # a stop straight after start; nothing worth shelving
    if kind == "voice":
        # One clip per take. The encoder averages its embedding over the whole
        # utterance and the profile averages over clips, so chopping a reading
        # into pieces buys nothing - and harvest's 1.5 s bursts are too short
        # to embed at all. Re-record the take if part of it was bad.
        return [audio]
    with tempfile.TemporaryDirectory() as tmp:
        out = Path(tmp)
        (harvest.bursts if kind == "wake" else harvest.chunks)(audio, out)
        return [harvest.read(path) for path in sorted(out.glob("*.wav"))]


class Library:
    def __init__(self, root: Path) -> None:
        self.root = Path(root).expanduser()
        self.root.mkdir(parents=True, exist_ok=True)
        self.index = self.root / "index.json"
        try:
            self.clips: dict[str, dict] = json.loads(self.index.read_text())
        except (OSError, ValueError):
            self.clips = {}

    def save(self) -> None:
        tmp = self.index.with_suffix(".tmp")
        tmp.write_text(json.dumps(self.clips))
        os.replace(tmp, self.index)  # atomic: a crash mid-write keeps the old index

    def dir(self, kind: str, label: str | None = None) -> Path:
        return self.root / kind / slug(label) if label else self.root / kind

    def path(self, clip: dict) -> Path:
        return self.dir(clip["kind"], clip["label"]) / f"{clip['id']}.wav"

    def add(self, kind: str, label: str, audio: np.ndarray,
            transcript: str = "") -> dict:
        clip = {
            "id": secrets.token_hex(6), "kind": kind, "label": label,
            "seconds": round(len(audio) / RATE, 2), "transcript": transcript,
            "created": time.time(),
        }
        path = self.path(clip)
        path.parent.mkdir(parents=True, exist_ok=True)
        harvest.write(path, audio)
        self.clips[clip["id"]] = clip
        self.save()
        return clip

    def get(self, clip_id: str) -> dict | None:
        clip = self.clips.get(clip_id)
        return clip if clip and self.path(clip).exists() else None

    def list(self, kind: str | None = None, label: str | None = None) -> list[dict]:
        found = [
            c for c in self.clips.values()
            if (not kind or c["kind"] == kind)
            and (not label or slug(c["label"]) == slug(label))
            # A wav deleted by hand is not a reason to break the listing.
            and self.path(c).exists()
        ]
        return sorted(found, key=lambda c: c["created"], reverse=True)

    def delete(self, clip_id: str) -> bool:
        clip = self.clips.pop(clip_id, None)
        if clip is None:
            return False
        self.path(clip).unlink(missing_ok=True)
        self.save()
        return True

    def refile(self, clip_id: str, kind: str, label: str) -> dict:
        old = self.clips[clip_id]
        new = {**old, "kind": kind, "label": label}
        self.path(new).parent.mkdir(parents=True, exist_ok=True)
        os.replace(self.path(old), self.path(new))
        self.clips[clip_id] = new
        self.save()
        return new


def microphone(stop: threading.Event):
    """The Mac's own microphone in 100 ms blocks until told to stop.

    wakeword/record.py records a fixed number of seconds; a front end wants
    a stop button, hence a generator here rather than a call over there.
    """
    import sounddevice as sd  # lazy: tests and mic-less boxes never load PortAudio

    with sd.InputStream(samplerate=RATE, channels=1, dtype="int16") as stream:
        while not stop.is_set():
            block, _overflowed = stream.read(RATE // 10)
            yield block[:, 0].copy()


class Recorder:
    """One take at a time on its own thread; the event loop never waits on the mic.

    `source(stop_event)` yields int16 blocks - the microphone by default, a
    canned array in tests.
    """

    def __init__(self, source=microphone) -> None:
        self.source = source
        self.kind: str | None = None
        self.label: str | None = None
        self.level = 0.0
        self.samples = 0
        self.error: str | None = None
        self._blocks: list[np.ndarray] = []
        self._stop = threading.Event()
        self._thread: threading.Thread | None = None

    @property
    def recording(self) -> bool:
        return self._thread is not None and self._thread.is_alive()

    def status(self) -> dict:
        return {
            "recording": self.recording, "kind": self.kind, "label": self.label,
            "seconds": round(self.samples / RATE, 1),
            "level": round(self.level, 3), "error": self.error,
        }

    def start(self, kind: str, label: str) -> None:
        if self.recording:
            raise RuntimeError(f"already recording {self.kind} {self.label!r}")
        self.kind, self.label = kind, label
        self.level, self.samples, self.error, self._blocks = 0.0, 0, None, []
        self._stop.clear()
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()

    def _run(self) -> None:
        try:
            for block in self.source(self._stop):
                self._blocks.append(block)
                self.samples += len(block)
                self.level = float(np.sqrt(np.mean((block / 32768.0) ** 2)))
        except Exception as err:  # no mic, no permission: surfaced by stop()
            self.error = f"{type(err).__name__}: {err}"

    def stop(self) -> np.ndarray:
        """Blocks for at most one microphone block; call it off the event loop."""
        if self._thread is None:
            raise RuntimeError("nothing is recording")
        self._stop.set()
        self._thread.join()
        self._thread = None
        if self.error:
            raise OSError(self.error)
        return (np.concatenate(self._blocks) if self._blocks
                else np.zeros(0, dtype=np.int16))
