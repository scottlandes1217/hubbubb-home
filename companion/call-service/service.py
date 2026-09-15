"""Twilio Media Streams <-> the house voice stack.

Twilio opens one websocket per call and streams 8 kHz mu-law in 20 ms frames.
We buffer the caller until they stop talking, transcribe on the Wyoming STT
already serving the speakers (10300), hand the text to Home Assistant's
conversation API, and stream the reply back through Kokoro (10201). A call is
just a very long-distance microphone, so it reuses both services as they are.

The brain is the Anthropic API called directly, NOT an HA conversation agent.
Measured on this house: the same question took 61.5s through conversation.ollama_mac
and 17.9s through conversation.claude_conversation, because HA hands the model
every entity in the house on every turn - against 2.0s calling the API here with
a prompt that only knows it is on a phone. Latency is prompt size. A caller does
not need to know the state of the lights.
"""

from __future__ import annotations

import argparse
import asyncio
import audioop
import base64
import json
import logging
import re
from dataclasses import dataclass, field
from pathlib import Path

import websockets
from anthropic import AsyncAnthropic
from wyoming.asr import Transcribe, Transcript
from wyoming.audio import AudioChunk, AudioStart, AudioStop
from wyoming.client import AsyncTcpClient
from wyoming.tts import Synthesize, SynthesizeVoice

_LOGGER = logging.getLogger("calls")

RATE = 8000          # Twilio is 8 kHz mu-law, both directions
FRAME = 160          # 20 ms of it
STT_RATE = 16000     # what faster-whisper wants

# Speech vs silence on a phone line. Tuned against mu-law decoded to PCM16:
# a live line idles near 100-300 RMS, speech runs well over 1000.
SPEECH_RMS = 700
HANG_MS = 700        # silence this long ends the caller's turn
MIN_SPEECH_MS = 300  # shorter than this is a cough, not a sentence

# A sentence ends at .!? plus any closing quote/bracket, then whitespace. Each
# completed sentence goes to the voice while the model is still writing the
# next, so the caller hears the first clause instead of the whole reply.
# ponytail: good enough for speech; the abbreviation-aware splitter lives in
# kokoro/server.py if a "Dr. Smith" ever gets cut in half mid-word.
# Everything the model is told. Short on purpose - see the module docstring.
SYSTEM = (
    "You are Scott's assistant, speaking out loud on his telephone. Everything "
    "you write is read aloud by a voice, so reply in one or two short spoken "
    "sentences - no lists, no markdown, no stage directions. You are on a phone "
    "line with a real person who is waiting, so be brief and natural, and never "
    "invent commitments on Scott's behalf: you can take a message, not agree to "
    "one. If you have what you need, close the call politely."
)

SENTENCE_END = re.compile(r"[.!?][\'\")\]]*\s")


def mulaw_to_stt(payload: bytes) -> bytes:
    """Twilio's 8 kHz mu-law -> the 16 kHz PCM16 the STT expects."""
    pcm = audioop.ulaw2lin(payload, 2)
    converted, _ = audioop.ratecv(pcm, 2, 1, RATE, STT_RATE, None)
    return converted


def pcm_to_mulaw(pcm: bytes, rate: int) -> bytes:
    """Kokoro's 24 kHz PCM16 -> Twilio's 8 kHz mu-law."""
    converted, _ = audioop.ratecv(pcm, 2, 1, rate, RATE, None)
    return audioop.lin2ulaw(converted, 2)


@dataclass
class Turn:
    """Rolling voice-activity state for one direction of one call."""

    speech: bytearray = field(default_factory=bytearray)
    silence_ms: int = 0
    speaking: bool = False

    def feed(self, frame: bytes) -> bytes | None:
        """Add 20 ms of PCM16. Returns the utterance once the caller stops."""
        loud = audioop.rms(frame, 2) > SPEECH_RMS
        if loud:
            self.speaking = True
            self.silence_ms = 0
            self.speech.extend(frame)
            return None
        if not self.speaking:
            return None
        # Trailing silence is still part of the utterance until we call it.
        self.speech.extend(frame)
        self.silence_ms += 20
        if self.silence_ms < HANG_MS:
            return None
        utterance = bytes(self.speech)
        self.speech.clear()
        self.silence_ms = 0
        self.speaking = False
        spoken_ms = (len(utterance) / 2 / STT_RATE) * 1000 - HANG_MS
        return utterance if spoken_ms >= MIN_SPEECH_MS else None


async def transcribe(uri: str, pcm: bytes) -> str:
    host, port = uri.rsplit(":", 1)
    async with AsyncTcpClient(host, int(port)) as client:
        # "call" tells the STT this is a phone line, not the puck in the
        # living room: no echo fence, no speaker id, no house webhook.
        await client.write_event(Transcribe(name="call", language="en").event())
        await client.write_event(AudioStart(rate=STT_RATE, width=2, channels=1).event())
        for i in range(0, len(pcm), 2048):
            chunk = AudioChunk(rate=STT_RATE, width=2, channels=1, audio=pcm[i:i + 2048])
            await client.write_event(chunk.event())
        await client.write_event(AudioStop().event())
        while (event := await client.read_event()) is not None:
            if Transcript.is_type(event.type):
                return Transcript.from_event(event).text.strip()
    return ""


async def synthesize(uri: str, text: str, voice: str):
    """Yield mu-law frames as Kokoro produces them - it streams by sentence,
    so the caller hears the first clause while the rest is still rendering."""
    host, port = uri.rsplit(":", 1)
    async with AsyncTcpClient(host, int(port)) as client:
        await client.write_event(
            Synthesize(text=text, voice=SynthesizeVoice(name=voice)).event()
        )
        tail = b""
        while (event := await client.read_event()) is not None:
            if AudioStop.is_type(event.type):
                break
            if not AudioChunk.is_type(event.type):
                continue
            chunk = AudioChunk.from_event(event)
            audio = tail + pcm_to_mulaw(chunk.audio, chunk.rate)
            for i in range(0, len(audio) - FRAME + 1, FRAME):
                yield audio[i:i + FRAME]
            tail = audio[len(audio) - len(audio) % FRAME:]


async def reply(client, model: str, system: str, history: list) -> "asyncio.Iterator":
    """Stream the model, yielding each finished sentence the moment it lands."""
    # Haiku has no effort control; the Opus family defaults to a deep think we
    # cannot afford with a caller holding the line.
    extra = {} if "haiku" in model else {"output_config": {"effort": "low"}}
    spoken, buffer = "", ""
    async with client.messages.stream(
        model=model, max_tokens=300, system=system, messages=history, **extra
    ) as stream:
        async for piece in stream.text_stream:
            buffer += piece
            while (end := SENTENCE_END.search(buffer)):
                sentence = buffer[:end.end()].strip()
                buffer = buffer[end.end():]
                spoken += sentence + " "
                yield sentence
    if buffer.strip():
        spoken += buffer.strip()
        yield buffer.strip()
    history.append({"role": "assistant", "content": spoken.strip()})


class Session:
    def __init__(self, socket, client, args) -> None:
        self.socket = socket
        self.client = client
        self.args = args
        self.stream_sid = ""
        self.call_sid = ""
        self.turn = Turn()
        self.speaking: asyncio.Task | None = None
        self.history: list[dict] = []
        self.system = ""

    async def send(self, text: str) -> None:
        _LOGGER.info("jarvis: %s", text)
        async for frame in synthesize(self.args.tts, text, self.args.voice):
            await self.socket.send(json.dumps({
                "event": "media",
                "streamSid": self.stream_sid,
                "media": {"payload": base64.b64encode(frame).decode()},
            }))

    async def answer(self) -> None:
        """Think and talk at once: each sentence is voiced while the model is
        still writing the next one, so the caller waits for a clause, not a
        paragraph."""
        async for sentence in reply(self.client, self.args.model,
                                    self.system, self.history):
            await self.send(sentence)

    def start(self, coro) -> None:
        """Run the mouth as a task, so a caller talking over it can cancel."""
        self.speaking = asyncio.create_task(coro)

    async def interrupt(self) -> None:
        """Caller talked over us: drop what Twilio has buffered and shut up."""
        if self.speaking and not self.speaking.done():
            self.speaking.cancel()
            await self.socket.send(json.dumps(
                {"event": "clear", "streamSid": self.stream_sid}
            ))

    async def handle(self, message: str) -> None:
        event = json.loads(message)
        kind = event.get("event")

        if kind == "start":
            start = event["start"]
            self.stream_sid = start["streamSid"]
            self.call_sid = start["callSid"]
            # Outbound calls carry their instructions as a <Parameter>; an
            # incoming call has none and is just answering the phone.
            brief = (start.get("customParameters") or {}).get("brief", "")
            _LOGGER.info("call %s up (brief=%r)", self.call_sid, brief)
            self.system = SYSTEM + (
                f"\n\nYou placed this call. Your purpose: {brief}"
                if brief else
                "\n\nSomeone is calling Scott and he cannot pick up. Find out "
                "who it is and what they need, then let them go."
            )
            if brief:
                # We called them, so we speak first and the model opens.
                self.history.append({"role": "user",
                                     "content": "[the line just connected]"})
                self.start(self.answer())
            else:
                # Incoming: a fixed greeting costs no model call at all.
                self.start(self.send(self.args.greeting))

        elif kind == "media":
            frame = mulaw_to_stt(base64.b64decode(event["media"]["payload"]))
            if audioop.rms(frame, 2) > SPEECH_RMS and self.speaking:
                await self.interrupt()
            utterance = self.turn.feed(frame)
            if utterance is None:
                return
            # The hangover silence is dead weight for whisper - it is 700 ms of
            # nothing on every single turn.
            speech = utterance[:-(HANG_MS * STT_RATE * 2 // 1000)]
            text = await transcribe(self.args.stt, speech)
            if not text:
                return
            _LOGGER.info("caller: %s", text)
            self.history.append({"role": "user", "content": text})
            self.start(self.answer())

        elif kind == "stop":
            _LOGGER.info("call %s down", self.call_sid)
            await self.interrupt()


async def serve(args) -> None:
    client = AsyncAnthropic(api_key=args.api_key)

    async def connection(socket) -> None:
        session = Session(socket, client, args)
        try:
            async for message in socket:
                await session.handle(message)
        except websockets.ConnectionClosed:
            pass
        finally:
            await session.interrupt()

    async with websockets.serve(connection, args.host, args.port):
        _LOGGER.info("listening on ws://%s:%s", args.host, args.port)
        await asyncio.Future()


def ha_api_key() -> str:
    """Reuse the key HA's own Anthropic integration holds - one key, one place
    to rotate it. Overridable with --api-key."""
    store = (Path.home() /
             ".hamounts/config/.storage/core.config_entries")
    try:
        entries = json.loads(store.read_text())["data"]["entries"]
        return next(e["data"]["api_key"] for e in entries
                    if e["domain"] == "anthropic")
    except (OSError, ValueError, KeyError, StopIteration):
        return ""


def parse_args(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=8790)
    parser.add_argument("--stt", default="localhost:10300", help="Wyoming STT")
    parser.add_argument("--tts", default="localhost:10201", help="Wyoming TTS")
    parser.add_argument("--voice", default="bm_george")
    parser.add_argument("--model", default="claude-opus-5",
                        help="claude-haiku-4-5 answers ~1.4s sooner; "
                             "claude-opus-5 at effort low is the better talker")
    parser.add_argument("--api-key", default=ha_api_key(),
                        help="defaults to the key the HA Anthropic entry uses")
    parser.add_argument("--greeting",
                        default="Hello, this is Scott's assistant. He can't take "
                                "the call right now - can I take a message?")
    parser.add_argument("--self-check", action="store_true")
    return parser.parse_args(argv)


def self_check() -> None:
    """No network: the audio maths and the turn detector, which is where the
    bugs actually live."""
    import math

    tone = b"".join(
        int(8000 * math.sin(i * 0.35)).to_bytes(2, "little", signed=True)
        for i in range(STT_RATE // 2)          # 500 ms of loud PCM16 at 16 kHz
    )
    quiet = b"\x00\x00" * STT_RATE            # a full second, past HANG_MS

    # Round trip: 16 kHz PCM -> Twilio mu-law -> back, keeping duration.
    mulaw = pcm_to_mulaw(tone, STT_RATE)
    assert len(mulaw) == len(tone) // 2 // 2, len(mulaw)   # half rate, 1 byte/sample
    back = mulaw_to_stt(mulaw)
    assert abs(len(back) - len(tone)) < 64, (len(back), len(tone))
    assert audioop.rms(back, 2) > SPEECH_RMS, audioop.rms(back, 2)

    # A full utterance: speech, then enough silence to end the turn.
    turn = Turn()
    frames = [tone[i:i + 640] for i in range(0, len(tone), 640)]      # 20 ms each
    assert all(turn.feed(f) is None for f in frames), "speech ended the turn early"
    silence = [quiet[i:i + 640] for i in range(0, len(quiet), 640)]
    ended = [turn.feed(f) for f in silence]
    assert sum(x is not None for x in ended) == 1, "turn did not end exactly once"
    utterance = next(x for x in ended if x is not None)
    assert len(utterance) > len(tone), "utterance lost its speech"

    # Silence alone is never a turn, and neither is a cough.
    assert all(Turn().feed(f) is None for f in silence)
    cough = Turn()
    assert cough.feed(tone[:640]) is None
    assert all(cough.feed(f) is None for f in silence), "a 20 ms blip became a turn"

    print("self-check ok")


def main() -> None:
    args = parse_args()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
    if args.self_check:
        self_check()
        return
    asyncio.run(serve(args))


if __name__ == "__main__":
    main()
