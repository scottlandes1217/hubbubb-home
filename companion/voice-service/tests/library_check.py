"""The library end to end with a canned microphone: no mic, no whisper.

Run from voice-service/:  .venv/bin/python tests/library_check.py
"""

import io
import sys
import tempfile
import time
import wave
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from library import (  # noqa: E402
    RATE, UPLOAD_MAX_BYTES, Library, Recorder, parse_upload, split_take,
)


def wav_bytes(rate=RATE, channels=1, width=2, seconds=2.0) -> bytes:
    """What a browser (or anyone else) might POST to /clips/upload."""
    out = io.BytesIO()
    with wave.open(out, "wb") as handle:
        handle.setnchannels(channels)
        handle.setsampwidth(width)
        handle.setframerate(rate)
        handle.writeframes(bytes(int(seconds * rate) * channels * width))
    return out.getvalue()


def refused(kind: str, body: bytes, why: str) -> None:
    try:
        parse_upload(kind, body)
    except ValueError as err:
        assert why in str(err), (why, str(err))
        return
    raise AssertionError(f"accepted an upload that should fail: {why}")


def canned(audio: np.ndarray):
    """A source that plays its take and then waits for the stop button."""
    def source(stop):
        for i in range(0, len(audio), RATE // 10):
            yield audio[i:i + RATE // 10]
        stop.wait()
    return source


def tone_take(beeps=(1.0, 3.0, 4.5), seconds=6.0) -> np.ndarray:
    tone = (np.sin(np.arange(int(0.4 * RATE)) * 0.1) * 12000).astype(np.int16)
    audio = np.zeros(int(seconds * RATE), dtype=np.int16)
    for at in beeps:
        audio[int(at * RATE):int(at * RATE) + len(tone)] = tone
    return audio


def take(lib: Library, kind: str, label: str, audio: np.ndarray) -> list[dict]:
    """What POST /record/start + /record/stop do, minus whisper."""
    rec = Recorder(canned(audio))
    rec.start(kind, label)
    try:
        rec.start(kind, label)
        raise AssertionError("second start must refuse")
    except RuntimeError:
        pass
    deadline = time.monotonic() + 5
    while rec.samples < len(audio) and time.monotonic() < deadline:
        time.sleep(0.01)
    status = rec.status()
    assert status["recording"] and status["kind"] == kind, status
    assert status["seconds"] == round(len(audio) / RATE, 1), status
    got = rec.stop()
    assert not rec.recording and len(got) == len(audio)
    try:
        rec.stop()
        raise AssertionError("stop with nothing recording must refuse")
    except RuntimeError:
        pass
    return [lib.add(kind, label, piece, "heard") for piece in split_take(kind, got)]


def run() -> None:
    root = Path(tempfile.mkdtemp(prefix="library-check-"))
    lib = Library(root)

    wake = take(lib, "wake", "Hey Jarvis", tone_take())
    assert len(wake) == 3, wake
    assert all(c["seconds"] == 1.5 for c in wake), wake
    assert (root / "wake" / "hey-jarvis" / f"{wake[0]['id']}.wav").exists()

    ambient = take(lib, "ambient", "telly", tone_take(beeps=(), seconds=25.0))
    assert len(ambient) == 2 and ambient[0]["seconds"] == 10.0, ambient

    voice = take(lib, "voice", "Scott", tone_take(seconds=5.0))
    assert len(voice) == 1 and voice[0]["seconds"] == 5.0, voice
    assert split_take("wake", np.zeros(100, np.int16)) == []

    # Newest first, filters by kind and by label (case and punctuation aside).
    listing = lib.list()
    assert [c["id"] for c in listing][:1] == [voice[0]["id"]], listing
    assert len(lib.list(kind="wake")) == 3
    assert len(lib.list(label="hey jarvis!")) == 3

    # The index survives a restart, and only a real write leaves index.json.
    again = Library(root)
    assert again.clips == lib.clips and not (root / "index.tmp").exists()

    # Delete: record and wav both go.
    path = lib.path(wake[0])
    assert lib.delete(wake[0]["id"]) and not path.exists()
    assert lib.get(wake[0]["id"]) is None and not lib.delete(wake[0]["id"])
    assert len(Library(root).list(kind="wake")) == 2

    # Re-file: a bad wake take becomes ambient, file follows the record.
    moved = lib.refile(wake[1]["id"], "ambient", "telly")
    assert moved["kind"] == "ambient" and lib.path(moved).exists()
    assert not path.parent.joinpath(f"{wake[1]['id']}.wav").exists()
    assert len(lib.list(kind="wake")) == 1 and len(lib.list(kind="ambient")) == 3
    assert lib.dir("wake", "hey jarvis") == root / "wake" / "hey-jarvis"

    # A wav removed by hand drops out of listings instead of breaking them.
    lib.path(voice[0]).unlink()
    assert lib.get(voice[0]["id"]) is None
    assert voice[0]["id"] not in {c["id"] for c in lib.list()}
    assert voice[0]["id"] in lib.clips  # the record stays until deleted

    # The meter is the latest block's RMS: a full-scale square wave reads 1.0.
    rec = Recorder(canned(np.full(RATE // 10, 32767, np.int16)))
    rec.start("voice", "meter")
    while rec.samples < RATE // 10:
        time.sleep(0.01)
    assert rec.status()["level"] == 1.0, rec.status()
    rec.stop()

    # A source that dies (no microphone) reports through stop().
    def broken(_stop):
        raise ValueError("no input device")
        yield
    rec = Recorder(broken)
    rec.start("wake", "x")
    try:
        rec.stop()
        raise AssertionError("a dead source must surface")
    except OSError as err:
        assert "no input device" in str(err)

    # A browser upload: the header is checked against the bytes, not believed.
    good = wav_bytes(seconds=2.0)
    audio = parse_upload("voice", good)
    assert audio.dtype == np.int16 and len(audio) == 2 * RATE, len(audio)
    filed = lib.add("voice", "Scott", audio, "heard")
    assert filed["seconds"] == 2.0 and lib.get(filed["id"]) is not None
    assert len(parse_upload("voice", wav_bytes(seconds=1.0))) == RATE, "one second is the floor"
    assert len(parse_upload("voice", wav_bytes(seconds=60.0))) == 60 * RATE, "a minute is the ceiling"
    refused("wake", good, "only voice")
    refused("ambient", good, "only voice")
    refused("", good, "only voice")
    refused("voice", wav_bytes(rate=44100), "want 16 kHz")
    refused("voice", wav_bytes(channels=2), "want 16 kHz mono")
    refused("voice", wav_bytes(width=1), "8-bit")
    refused("voice", good[:-1000], "truncated")
    refused("voice", good[:30], "not a wav")
    refused("voice", wav_bytes(seconds=0), "1 to 60 seconds")
    refused("voice", wav_bytes(seconds=0.9), "1 to 60 seconds")
    refused("voice", wav_bytes(seconds=61), "1 to 60 seconds")
    refused("voice", wav_bytes(seconds=140), "over 4 MB")
    assert len(wav_bytes(seconds=140)) > UPLOAD_MAX_BYTES
    refused("voice", b"", "not a wav")
    refused("voice", b"hello there " * 1000, "not a wav")
    refused("voice", b"RIFF\0\0\0\0WAVE" + b"\0" * 100, "not a wav")

    print("library self-check ok")


if __name__ == "__main__":
    run()
