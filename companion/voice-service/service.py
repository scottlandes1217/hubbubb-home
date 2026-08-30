"""Local speech-to-text with speaker identification, spoken Wyoming.

One process, two ports: Wyoming STT for Home Assistant's pipeline (10300) and
a small admin HTTP API (10301) for enrollment and status. Every utterance is
transcribed with faster-whisper and fingerprinted with resemblyzer; the match
result is written to last.json in the data dir and POSTed to a Home Assistant
webhook, so both the Mac listener and the integration know who just spoke.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import os
import time
from functools import partial
from pathlib import Path

import numpy as np
from aiohttp import ClientSession, ClientTimeout, web
from faster_whisper import WhisperModel
from resemblyzer import VoiceEncoder, preprocess_wav
from wyoming.asr import Transcribe, Transcript
from wyoming.audio import AudioChunk, AudioStart, AudioStop
from wyoming.event import Event
from wyoming.info import AsrModel, AsrProgram, Attribution, Describe, Info
from wyoming.server import AsyncEventHandler, AsyncTcpServer

from speakers import Profiles

_LOGGER = logging.getLogger("hubbubb-voice")

RATE = 16000
# Below this much audio resemblyzer's VAD can return nothing; skip the
# fingerprint rather than crash the transcription that rode in with it.
MIN_EMBED_SECONDS = 0.5


class Service:
    """Shared models and state; one instance for every connection."""

    def __init__(self, args) -> None:
        self.args = args
        self.profiles = Profiles(Path(args.data_dir))
        _LOGGER.info("loading whisper %r (int8, cpu)...", args.model)
        self.model = WhisperModel(args.model, device="cpu", compute_type="int8")
        _LOGGER.info("loading voice encoder...")
        self.encoder = VoiceEncoder("cpu")
        # ponytail: one utterance at a time - a single house, mostly one puck.
        # Shard per-connection executors if satellites ever pile up.
        self.lock = asyncio.Lock()
        self.last: dict | None = None
        self.last_embedding: np.ndarray | None = None
        self.http: ClientSession | None = None

    async def process(self, pcm: bytes, language: str | None) -> dict:
        audio = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0
        loop = asyncio.get_running_loop()
        async with self.lock:
            started = time.monotonic()
            text, embedding = await loop.run_in_executor(
                None, self._transcribe_and_embed, audio, language
            )
            elapsed = time.monotonic() - started
        person, confidence, candidates = self.profiles.match(embedding)
        event = {
            "person": person,
            "confidence": confidence,
            "ts": time.time(),
            "text": text,
            "candidates": candidates,
        }
        self.last = event
        self.last_embedding = embedding
        _LOGGER.info(
            "%.1fs audio -> %r in %.2fs, speaker=%s (%.2f)",
            len(audio) / RATE, text, elapsed, person, confidence,
        )
        self._write_last(event)
        if self.args.webhook:
            asyncio.ensure_future(self._post_webhook(event))
        return event

    def _transcribe_and_embed(self, audio: np.ndarray, language: str | None):
        # Pipelines send a locale ("en-US"); whisper wants the bare code.
        language = (language or self.args.language).split("-")[0]
        segments, _info = self.model.transcribe(
            audio, language=language, beam_size=1
        )
        text = " ".join(s.text.strip() for s in segments).strip()
        embedding = None
        if len(audio) >= RATE * MIN_EMBED_SECONDS:
            try:
                wav = preprocess_wav(audio, source_sr=RATE)
                if len(wav) >= RATE * MIN_EMBED_SECONDS:
                    embedding = self.encoder.embed_utterance(wav)
            except Exception:
                _LOGGER.exception("speaker embedding failed; transcript stands")
        return text, embedding

    def label(self, person: str) -> dict:
        """Enroll the last utterance's fingerprint as this person's voice."""
        if self.last_embedding is None:
            raise ValueError("no recent utterance to label")
        count = self.profiles.add(person, self.last_embedding)
        if self.last is not None:
            self.last = {**self.last, "person": person, "confidence": 1.0}
            self._write_last(self.last)
        return {"person": person, "samples": count}

    def _write_last(self, event: dict) -> None:
        path = self.profiles.dir / "last.json"
        tmp = path.with_suffix(".tmp")
        tmp.write_text(json.dumps(event))
        os.replace(tmp, path)

    async def _post_webhook(self, event: dict) -> None:
        """Best effort: an unreachable webhook must never break transcription."""
        try:
            if self.http is None or self.http.closed:
                self.http = ClientSession(timeout=ClientTimeout(total=3))
            await self.http.post(self.args.webhook, json=event)
        except Exception as err:
            _LOGGER.debug("speaker webhook not delivered: %s", err)


class SttHandler(AsyncEventHandler):
    """One Wyoming connection: buffer audio, answer with a Transcript."""

    def __init__(self, service: Service, wyoming_info: Info, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.service = service
        self.wyoming_info = wyoming_info
        self.audio = bytearray()
        self.language: str | None = None

    async def handle_event(self, event: Event) -> bool:
        if Describe.is_type(event.type):
            await self.write_event(self.wyoming_info.event())
            return True
        if Transcribe.is_type(event.type):
            self.language = Transcribe.from_event(event).language
            return True
        if AudioStart.is_type(event.type):
            self.audio.clear()
            return True
        if AudioChunk.is_type(event.type):
            chunk = AudioChunk.from_event(event)
            self.audio.extend(_to_16k_mono(chunk))
            return True
        if AudioStop.is_type(event.type):
            result = await self.service.process(bytes(self.audio), self.language)
            await self.write_event(Transcript(text=result["text"]).event())
            return False
        return True


def _to_16k_mono(chunk: AudioChunk) -> bytes:
    """HA streams 16k/16-bit/mono; anything else gets a cheap linear resample."""
    if chunk.rate == RATE and chunk.channels == 1 and chunk.width == 2:
        return chunk.audio
    samples = np.frombuffer(chunk.audio, dtype=np.int16)
    if chunk.channels > 1:
        samples = samples.reshape(-1, chunk.channels).mean(axis=1)
    if chunk.rate != RATE:
        target = int(len(samples) * RATE / chunk.rate)
        samples = np.interp(
            np.linspace(0, len(samples), target, endpoint=False),
            np.arange(len(samples)),
            samples,
        )
    return samples.astype(np.int16).tobytes()


# --- admin HTTP ---------------------------------------------------------------


def admin_app(service: Service) -> web.Application:
    async def health(_req):
        return web.json_response(
            {"ok": True, "model": service.args.model,
             "people": service.profiles.counts()}
        )

    async def last(_req):
        return web.json_response(service.last or {})

    async def label(req):
        data = await req.json()
        person = str(data.get("person") or "").strip()
        if not person:
            raise web.HTTPBadRequest(text="person is required")
        try:
            return web.json_response(service.label(person))
        except ValueError as err:
            raise web.HTTPBadRequest(text=str(err))

    async def people(_req):
        return web.json_response(service.profiles.counts())

    async def people_delete(req):
        data = await req.json()
        person = str(data.get("person") or "").strip()
        if not service.profiles.delete(person):
            raise web.HTTPNotFound(text=f"no profile named {person!r}")
        return web.json_response(service.profiles.counts())

    app = web.Application()
    app.add_routes(
        [
            web.get("/health", health),
            web.get("/last", last),
            web.post("/label", label),
            web.get("/people", people),
            web.post("/people/delete", people_delete),
        ]
    )
    return app


# --- entry point --------------------------------------------------------------


def make_info(args) -> Info:
    attribution = Attribution(
        name="hubbubb-home", url="https://github.com/scottlandes/hubbubb-home"
    )
    return Info(
        asr=[
            AsrProgram(
                name="hubbubb-voice",
                description="faster-whisper with speaker identification",
                attribution=attribution,
                installed=True,
                version="1.0.0",
                models=[
                    AsrModel(
                        name=args.model,
                        description="faster-whisper (int8, cpu)",
                        attribution=attribution,
                        installed=True,
                        version="1.0.0",
                        # Home Assistant matches the pipeline's locale against
                        # this list verbatim, so the bare code alone gets every
                        # request refused as unsupported metadata.
                        languages=[args.language] + [
                            f"{args.language}-{region}"
                            for region in ("US", "GB", "AU", "CA", "NZ", "IN", "IE", "ZA")
                        ],
                    )
                ],
            )
        ]
    )


def parse_args(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=10300, help="Wyoming STT")
    parser.add_argument("--admin-port", type=int, default=10301)
    parser.add_argument("--model", default="base", help="faster-whisper model")
    parser.add_argument("--language", default="en")
    parser.add_argument(
        "--data-dir", default="~/.hubbubb-voice", help="profiles + last.json"
    )
    parser.add_argument(
        "--webhook",
        default="",
        help="HA speaker webhook, e.g. http://192.168.0.62/api/webhook/hubbubb_home_speaker",
    )
    return parser.parse_args(argv)


async def main() -> None:
    logging.basicConfig(level=logging.INFO)
    args = parse_args()
    service = Service(args)
    wyoming_info = make_info(args)

    runner = web.AppRunner(admin_app(service))
    await runner.setup()
    await web.TCPSite(runner, args.host, args.admin_port).start()
    _LOGGER.info("admin on :%d, wyoming on :%d", args.admin_port, args.port)

    server = AsyncTcpServer(args.host, args.port)
    await server.run(partial(SttHandler, service, wyoming_info))


if __name__ == "__main__":
    asyncio.run(main())
