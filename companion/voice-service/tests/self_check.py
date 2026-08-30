"""The one runnable check: full Wyoming handler path, two real (synthetic) voices.

macOS `say` renders two distinct voices; each clip runs through SttHandler's
actual event sequence (Transcribe/AudioStart/chunks/AudioStop), not a shortcut
to the model. Passing means: transcription round-trips, enrollment stores
fingerprints, and the centroid matcher tells the voices apart.

Run from voice-service/:  .venv/bin/python tests/self_check.py
First run downloads the whisper and encoder models.
"""

import asyncio
import subprocess
import sys
import tempfile
import time
import wave
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from wyoming.asr import Transcribe, Transcript
from wyoming.audio import AudioChunk, AudioStart, AudioStop

import service as svc

PHRASES = [
    "The pool guy comes on Tuesdays.",
    "Please set a timer for ten minutes.",
    "What is the weather like this afternoon?",
]
TEST_PHRASE = "Turn on the kitchen lights."


def pick_voices() -> list[str]:
    out = subprocess.run(
        ["say", "-v", "?"], capture_output=True, text=True, check=True
    ).stdout
    installed = {line.split()[0] for line in out.splitlines() if line.split()}
    preferred = ["Samantha", "Daniel", "Karen", "Moira", "Rishi", "Fred"]
    voices = [v for v in preferred if v in installed]
    assert len(voices) >= 2, f"need two of {preferred}, found {sorted(installed)}"
    return voices[:2]


def render(voice: str, text: str, workdir: Path) -> bytes:
    """say -> aiff -> afconvert -> 16k mono s16 wav -> raw PCM bytes."""
    aiff = workdir / f"{voice}-{abs(hash(text))}.aiff"
    wav = aiff.with_suffix(".wav")
    subprocess.run(["say", "-v", voice, "-o", str(aiff), text], check=True)
    subprocess.run(
        ["afconvert", "-f", "WAVE", "-d", "LEI16@16000", "-c", "1",
         str(aiff), str(wav)],
        check=True,
    )
    with wave.open(str(wav), "rb") as f:
        assert f.getframerate() == 16000 and f.getnchannels() == 1
        return f.readframes(f.getnframes())


async def through_handler(service: svc.Service, info, pcm: bytes) -> str:
    """Drive the real handler with the real event sequence; capture Transcript."""
    handler = svc.SttHandler.__new__(svc.SttHandler)
    handler.service = service
    handler.wyoming_info = info
    handler.audio = bytearray()
    handler.language = None
    written = []

    async def capture(event):
        written.append(event)

    handler.write_event = capture

    await handler.handle_event(Transcribe(language="en").event())
    await handler.handle_event(AudioStart(rate=16000, width=2, channels=1).event())
    for i in range(0, len(pcm), 4096):
        await handler.handle_event(
            AudioChunk(rate=16000, width=2, channels=1, audio=pcm[i:i + 4096]).event()
        )
    more = await handler.handle_event(AudioStop().event())
    assert more is False, "handler should close after AudioStop"
    transcripts = [e for e in written if Transcript.is_type(e.type)]
    assert len(transcripts) == 1, f"expected one Transcript, got {written}"
    return Transcript.from_event(transcripts[0]).text


async def run() -> None:
    voice_a, voice_b = pick_voices()
    print(f"voices: {voice_a} vs {voice_b}")
    workdir = Path(tempfile.mkdtemp(prefix="voice-check-"))
    data_dir = workdir / "data"

    args = svc.parse_args(
        ["--data-dir", str(data_dir), "--webhook", "", "--model", "base"]
    )
    service = svc.Service(args)
    info = svc.make_info(args)

    # Enroll both voices through the full handler path + the label endpoint's
    # own logic (service.label is exactly what POST /label calls).
    for voice in (voice_a, voice_b):
        for phrase in PHRASES:
            text = await through_handler(service, info, render(voice, phrase, workdir))
            assert text, f"empty transcript for {voice}: {phrase!r}"
            service.label(voice)
    counts = service.profiles.counts()
    assert counts == {voice_a: len(PHRASES), voice_b: len(PHRASES)}, counts

    # Fresh clips: transcription round-trips and the matcher picks the speaker.
    for voice, other in ((voice_a, voice_b), (voice_b, voice_a)):
        pcm = render(voice, TEST_PHRASE, workdir)
        started = time.monotonic()
        text = await through_handler(service, info, pcm)
        elapsed = time.monotonic() - started
        event = service.last
        normalized = "".join(c for c in text.lower() if c.isalpha() or c == " ")
        assert "kitchen lights" in normalized, f"{voice} transcript: {text!r}"
        assert event["person"] == voice, f"matched {event} expected {voice}"
        same = event["candidates"][voice]
        cross = event["candidates"][other]
        assert same > cross, f"{voice}: same {same} !> cross {cross}"
        print(
            f"  {voice}: {text!r} in {elapsed:.2f}s, "
            f"same={same:.3f} cross={cross:.3f}"
        )

    # An unknown result still reports candidates: raise the bar impossibly.
    service.profiles.thresholds["uncertain"] = 1.01
    person, confidence, candidates = service.profiles.match(service.last_embedding)
    assert person is None and candidates, (person, candidates)

    print("self-check passed")


if __name__ == "__main__":
    asyncio.run(run())
