"""Kokoro TTS spoken Wyoming, for the voice pipeline.

Same shape as the sibling STT service: one process, one port, models loaded
once. Kokoro is an 82M ONNX model - a big step up from Piper in warmth at a
modest latency cost - and this wrapper only exists because no wyoming-kokoro
bridge is published on PyPI.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import os
import re
import time
from functools import partial
from pathlib import Path

import numpy as np
from kokoro_onnx import Kokoro
from wyoming.audio import AudioChunk, AudioStart, AudioStop
from wyoming.event import Event
from wyoming.info import Attribution, Describe, Info, TtsProgram, TtsVoice
from wyoming.server import AsyncEventHandler, AsyncTcpServer
from wyoming.tts import Synthesize

_LOGGER = logging.getLogger("hubbubb-kokoro")

# HA matches the pipeline's locale against this list verbatim (the same
# lesson the STT service learned): bare "en" alone gets every request
# refused as unsupported.
LANGUAGES = ["en", "en-GB", "en-US", "en-AU", "en-CA", "en-NZ", "en-IE"]
CHUNK = 4096

# The sibling STT service reads this to drop the mic's echo of our own
# playback - the puck's echo canceller does not cover a speaker on its
# line-out jack, so without it Jarvis hears its replies and answers itself.
LAST_TTS = Path("~/.hubbubb-voice/last-tts.json").expanduser()


def note_playback(text: str, duration: float) -> None:
    try:
        entries = json.loads(LAST_TTS.read_text())[-2:]
    except (OSError, ValueError):
        entries = []
    entries.append({"ts": time.time(), "duration": duration, "text": text})
    tmp = LAST_TTS.with_suffix(".tmp")
    tmp.write_text(json.dumps(entries))
    os.replace(tmp, LAST_TTS)


# Periods that end a word rather than a sentence. Lowercased, no final dot.
_ABBREVIATIONS = {
    "mr", "mrs", "ms", "dr", "prof", "sr", "jr", "st", "mt", "rd", "ave",
    "vs", "etc", "approx", "no", "dept", "inc", "ltd", "co", "fig",
    "a.m", "p.m", "u.s", "e.g", "i.e", "min", "mins", "sec", "secs", "hr",
    "hrs", "temp", "est", "gmt",
}
# A closer, any closing quote or bracket, then the gap before the next word.
_BOUNDARY = re.compile(r"[.!?][\"'”’)\]]*(\s+)")
_WORD_BEFORE = re.compile(r"([A-Za-z][A-Za-z.]*)$")


def _is_boundary(text: str, dot: int, after: int) -> bool:
    """True when text[dot] really ends a sentence."""
    nxt = text[after: after + 1]
    # Sentences start with a capital, a digit or an opening quote. Anything
    # else ("e.g. the hall") is mid-sentence whatever the punctuation says.
    if not nxt or not (nxt.isupper() or nxt.isdigit() or nxt in "\"'“‘"):
        return False
    if text[dot] != ".":
        return True  # ! and ? are never abbreviations or decimals
    if text[dot - 1: dot] == ".":
        return False  # ellipsis
    if text[dot - 1: dot].isdigit() and nxt.isdigit():
        return False  # a spaced decimal or a numbered list
    word = _WORD_BEFORE.search(text[:dot])
    if word:
        stem = word.group(1).lower()
        # "Dr.", "p.m.", and initials like "J. K. Rowling".
        if stem in _ABBREVIATIONS or len(stem) == 1:
            return False
    return True


def _append(parts: list[str], piece: str, min_words: int) -> None:
    if not piece:
        return
    # A stub on its own is a clipped little bark of audio; it belongs on the
    # end of the sentence before it.
    if parts and len(piece.split()) < min_words:
        parts[-1] += " " + piece
    else:
        parts.append(piece)


def split_sentences(text: str, min_words: int = 3) -> list[str]:
    """Split into speakable sentences, erring towards leaving text joined.

    Only used to get the first sentence playing sooner - a missed split costs
    nothing but latency, a wrong one is heard as a stutter in the middle of a
    number or a name.
    """
    text = text.strip()
    parts: list[str] = []
    start = 0
    for match in _BOUNDARY.finditer(text):
        if not _is_boundary(text, match.start(), match.end()):
            continue
        _append(parts, text[start: match.start(1)].strip(), min_words)
        start = match.end()
    _append(parts, text[start:].strip(), min_words)
    return parts


class KokoroHandler(AsyncEventHandler):
    def __init__(self, service, info: Info, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.service = service
        self.info = info

    async def handle_event(self, event: Event) -> bool:
        if Describe.is_type(event.type):
            await self.write_event(self.info.event())
            return True
        if not Synthesize.is_type(event.type):
            return True

        synthesize = Synthesize.from_event(event)
        voice = self.service.args.voice
        if synthesize.voice and synthesize.voice.name:
            voice = synthesize.voice.name
        loop = asyncio.get_running_loop()
        # One sentence at a time, so the first one is playing while the rest
        # are still being synthesized: total time is the same, time to the
        # first word is not.
        sentences = split_sentences(synthesize.text) or [synthesize.text]
        rate, spoken_bytes = 0, 0
        # ponytail: one synthesis at a time - one house, one puck. Held across
        # the writes too, so two replies cannot interleave chunks between the
        # single audio-start and audio-stop. Shard if satellites ever queue up.
        async with self.service.lock:
            try:
                for sentence in sentences:
                    samples, sentence_rate = await loop.run_in_executor(
                        None, self.service.synthesize, sentence, voice
                    )
                    pcm = (np.clip(samples, -1.0, 1.0) * 32767).astype(
                        "<i2"
                    ).tobytes()
                    if not rate:
                        rate = sentence_rate
                        await self.write_event(
                            AudioStart(rate=rate, width=2, channels=1).event()
                        )
                    elif sentence_rate != rate:
                        # One format per utterance is the protocol; kokoro has
                        # only ever answered 24kHz, so this is a shout, not a
                        # plan.
                        _LOGGER.error(
                            "rate changed mid-utterance: %s -> %s, stopping",
                            rate, sentence_rate,
                        )
                        break
                    spoken_bytes += len(pcm)
                    for i in range(0, len(pcm), CHUNK):
                        await self.write_event(
                            AudioChunk(
                                rate=rate, width=2, channels=1,
                                audio=pcm[i : i + CHUNK],
                            ).event()
                        )
            finally:
                # Once audio-start is out the utterance must be closed, even
                # if a later sentence blew up mid-reply.
                if rate:
                    await self.write_event(AudioStop().event())
        # One entry for the whole reply, written when the last chunk is out -
        # same text and same total duration the self-echo fence saw before,
        # within a few milliseconds of the same timestamp.
        note_playback(synthesize.text, spoken_bytes / (2 * rate) if rate else 0)
        return True


class Service:
    def __init__(self, args) -> None:
        self.args = args
        _LOGGER.info("loading kokoro...")
        self.kokoro = Kokoro(args.model, args.voices)
        self.lock = asyncio.Lock()

    def synthesize(self, text: str, voice: str):
        return self.kokoro.create(text, voice=voice, speed=self.args.speed)

    def voice_names(self) -> list[str]:
        return sorted(self.kokoro.get_voices())


def make_info(service: Service) -> Info:
    attribution = Attribution(
        name="hubbubb-home", url="https://github.com/scottlandes/hubbubb-home"
    )
    return Info(
        tts=[
            TtsProgram(
                name="hubbubb-kokoro",
                description="Kokoro 82M",
                attribution=attribution,
                installed=True,
                version="1.0.0",
                voices=[
                    TtsVoice(
                        name=name,
                        description=name,
                        attribution=attribution,
                        installed=True,
                        version="1.0.0",
                        languages=LANGUAGES,
                    )
                    for name in service.voice_names()
                ],
            )
        ]
    )


def parse_args(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=10201)
    parser.add_argument(
        "--model",
        default="/Users/scottlandes/.hubbubb-voice/kokoro/kokoro-v1.0.onnx",
    )
    parser.add_argument(
        "--voices",
        default="/Users/scottlandes/.hubbubb-voice/kokoro/voices-v1.0.bin",
    )
    parser.add_argument("--voice", default="bm_george", help="default voice")
    parser.add_argument(
        "--speed", type=float, default=1.0,
        help="pace multiplier; >1 is faster (the calibration knob)",
    )
    return parser.parse_args(argv)


async def main() -> None:
    logging.basicConfig(level=logging.INFO)
    args = parse_args()
    service = Service(args)
    info = make_info(service)
    _LOGGER.info(
        "kokoro on :%d, default voice %s, speed %.2f",
        args.port, args.voice, args.speed,
    )
    server = AsyncTcpServer(args.host, args.port)
    await server.run(partial(KokoroHandler, service, info))


if __name__ == "__main__":
    asyncio.run(main())
