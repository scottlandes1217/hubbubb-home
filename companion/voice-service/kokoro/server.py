"""Kokoro TTS spoken Wyoming, for the voice pipeline.

Same shape as the sibling STT service: one process, one port, models loaded
once. Kokoro is an 82M ONNX model - a big step up from Piper in warmth at a
modest latency cost - and this wrapper only exists because no wyoming-kokoro
bridge is published on PyPI.
"""

from __future__ import annotations

import argparse
import asyncio
import logging
from functools import partial

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
        # ponytail: one synthesis at a time - one house, one puck. Shard if
        # satellites ever queue up here.
        async with self.service.lock:
            samples, rate = await loop.run_in_executor(
                None, self.service.synthesize, synthesize.text, voice
            )
        pcm = (np.clip(samples, -1.0, 1.0) * 32767).astype("<i2").tobytes()
        await self.write_event(
            AudioStart(rate=rate, width=2, channels=1).event()
        )
        for i in range(0, len(pcm), CHUNK):
            await self.write_event(
                AudioChunk(
                    rate=rate, width=2, channels=1, audio=pcm[i : i + CHUNK]
                ).event()
            )
        await self.write_event(AudioStop().event())
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
