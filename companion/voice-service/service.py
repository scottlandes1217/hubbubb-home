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
import re
import secrets
import time
import wave
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

from library import (
    KINDS, UPLOAD_MAX_BYTES, Library, Recorder, parse_upload, split_take,
)
from speakers import Profiles
from wakeword import harvest

_LOGGER = logging.getLogger("hubbubb-voice")

RATE = 16000
# Below this much audio resemblyzer's VAD can return nothing; skip the
# fingerprint rather than crash the transcription that rode in with it.
MIN_EMBED_SECONDS = 0.5


def _words(text: str) -> list[str]:
    return "".join(
        c.lower() if c.isalnum() or c.isspace() else " " for c in text
    ).split()


# Say one of these (alone, filler aside) and Jarvis goes quiet: the pipeline
# gets an empty transcript, so nothing downstream ever composes a reply.
_KILL_FILLER = {"jarvis", "no", "please", "okay", "ok", "now", "just", "oh"}
_KILL_PHRASES = {
    "cancel", "cancel that", "cancel request", "never mind", "nevermind",
    "forget it", "shut up", "shut the fuck up", "stop", "stop it",
    "stop talking", "be quiet", "quiet",
}


def _is_kill_phrase(text: str) -> bool:
    meaningful = [w for w in _words(text) if w not in _KILL_FILLER]
    return " ".join(meaningful) in _KILL_PHRASES


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
        self._vocab: tuple[float, str] = (0.0, "")

    def vocabulary(self) -> str:
        """Whisper priming text from the household's proper nouns.

        One name per line in vocabulary.txt beside the profiles; whisper
        biases decoding toward words it has just 'heard', which fixes the
        chronic mishearings of names no model was trained on. Re-read when
        the file changes, so the nightly pass can grow it without a restart.
        """
        path = Path(self.args.data_dir).expanduser() / "vocabulary.txt"
        try:
            mtime = path.stat().st_mtime
        except OSError:
            return ""
        if mtime != self._vocab[0]:
            words = [w.strip() for w in path.read_text().splitlines()
                     if w.strip() and not w.startswith("#")]
            prompt = ("Household words: " + ", ".join(words[:50]) + "."
                      if words else "")
            self._vocab = (mtime, prompt)
        return self._vocab[1]

    async def process(self, pcm: bytes, language: str | None) -> dict:
        audio = np.frombuffer(pcm, dtype=np.int16).astype(np.float32) / 32768.0
        loop = asyncio.get_running_loop()
        async with self.lock:
            started = time.monotonic()
            text, embedding = await loop.run_in_executor(
                None, self._transcribe_and_embed, audio, language
            )
            elapsed = time.monotonic() - started
        if self.args.capture_dir:
            self._capture(pcm, text)
        if self._is_self_echo(text, len(audio) / RATE):
            _LOGGER.info("self-echo dropped: %r", text)
            return {"person": None, "confidence": 0.0, "ts": time.time(),
                    "text": "", "candidates": [], "token": self.args.token}
        if _is_kill_phrase(text):
            _LOGGER.info("kill phrase heard, staying quiet: %r", text)
            return {"person": None, "confidence": 0.0, "ts": time.time(),
                    "text": "", "candidates": [], "token": self.args.token}
        person, confidence, candidates = self.profiles.match(embedding)
        event = {
            "person": person,
            "confidence": confidence,
            "ts": time.time(),
            "text": text,
            "candidates": candidates,
            # Lets the integration reject speaker events forged by something
            # else on the LAN; stripped before the event is stored there.
            "token": self.args.token,
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

    def _capture(self, pcm: bytes, text: str) -> None:
        """Keep the clip, as the puck's own microphone heard it.

        Wake-word training data that no amount of synthetic speech can
        stand in for: this room, this microphone, this distance - and,
        more valuable than the hits, the television and Jarvis's own
        replies that the model must learn to sit through. Saved before
        the self-echo and kill-phrase gates for exactly that reason.
        """
        try:
            out = Path(self.args.capture_dir).expanduser()
            out.mkdir(parents=True, exist_ok=True)
            slug = re.sub(r"[^a-z0-9]+", "-", text.lower())[:40].strip("-")
            name = f"{time.strftime('%Y%m%d-%H%M%S')}_{slug or 'silence'}.wav"
            with wave.open(str(out / name), "wb") as handle:
                handle.setnchannels(1)
                handle.setsampwidth(2)
                handle.setframerate(RATE)
                handle.writeframes(pcm)
        except OSError as err:  # a full disk must never cost us the answer
            _LOGGER.warning("capture failed: %s", err)

    def _is_self_echo(self, text: str, audio_seconds: float) -> bool:
        """True when the transcript is the mic hearing our own TTS.

        The puck's echo canceller does not cover a speaker on its line-out
        jack, so Jarvis's replies come straight back into the mic and it
        answers itself forever. The kokoro server notes what it synthesized
        and for how long; a capture that overlaps that playback window and
        whose words mostly come from it is our own voice, not the household's.
        """
        heard = _words(text)
        if len(heard) < 3:
            return False  # barge-ins like "stop" must survive
        path = Path(self.args.data_dir).expanduser() / "last-tts.json"
        try:
            entries = json.loads(path.read_text())
        except (OSError, ValueError):
            return False
        capture_start = time.time() - audio_seconds
        for entry in entries:
            # 3s margin for HA fetching the audio and the puck starting it.
            if capture_start > entry["ts"] + entry.get("duration", 0.0) + 3.0:
                continue
            spoken = set(_words(entry.get("text", "")))
            if not spoken:
                continue
            overlap = sum(w in spoken for w in heard) / len(heard)
            # ponytail: bag-of-words at 0.6; swap in a real alignment if a
            # genuinely echoed-back human answer ever gets eaten.
            if overlap >= 0.6:
                return True
        return False

    def _transcribe_and_embed(self, audio: np.ndarray, language: str | None):
        return self.transcribe(audio, language), self.embed(audio)

    def transcribe(self, audio: np.ndarray, language: str | None = None) -> str:
        """Blocking; run under self.lock in an executor. audio is float32."""
        # Pipelines send a locale ("en-US"); whisper wants the bare code.
        language = (language or self.args.language).split("-")[0]
        segments, _info = self.model.transcribe(
            audio, language=language, beam_size=1,
            initial_prompt=self.vocabulary() or None,
        )
        return " ".join(s.text.strip() for s in segments).strip()

    def embed(self, audio: np.ndarray) -> np.ndarray | None:
        """Blocking, like transcribe(); None when there is too little to fingerprint."""
        if len(audio) < RATE * MIN_EMBED_SECONDS:
            return None
        try:
            wav = preprocess_wav(audio, source_sr=RATE)
            if len(wav) >= RATE * MIN_EMBED_SECONDS:
                return self.encoder.embed_utterance(wav)
        except Exception:
            _LOGGER.exception("speaker embedding failed; transcript stands")
        return None

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


def _float(pcm: np.ndarray) -> np.ndarray:
    """int16 samples as the float32 the models take."""
    return pcm.astype(np.float32) / 32768.0


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


# --- wake word training -------------------------------------------------------


class Trainer:
    """One wake-word training run at a time, announced when it lands.

    The heavy lifting is wakeword/train.py in its own venv; this only spawns
    it detached, remembers what is running, and tells the house - through the
    same message webhook the finished-turn announcements use - when the model
    is ready or the run failed.
    """

    def __init__(self, args, library: Library) -> None:
        self.args = args
        self.library = library
        self.proc: asyncio.subprocess.Process | None = None
        self.status: dict = {"running": False}

    @property
    def script(self) -> Path:
        return Path(__file__).parent / "wakeword" / "train.py"

    @property
    def python(self) -> Path:
        return Path(__file__).parent / "wakeword" / ".venv" / "bin" / "python"

    def start(self, phrase: str) -> dict:
        if self.status.get("running"):
            raise RuntimeError(
                f"already training {self.status.get('phrase')!r}"
            )
        if not self.python.exists():
            raise RuntimeError("the trainer is not installed (wakeword/.venv)")
        slug = "_".join(phrase.lower().split())
        out = Path(self.args.data_dir).expanduser() / "wakewords" / slug
        out.mkdir(parents=True, exist_ok=True)
        log = open(out / "train.log", "ab")
        self.status = {
            "running": True, "phrase": phrase, "started": time.time(),
            "out": str(out),
        }
        asyncio.ensure_future(self._run(phrase, out, log))
        return self.status

    async def _run(self, phrase: str, out: Path, log) -> None:
        argv = [str(self.python), str(self.script), phrase, "--out", str(out)]
        # The library's shelves are laid out the way train.py's copy_clips
        # walks them (recursive glob), so point it at them directly. Only when
        # a shelf has something on it: an empty --extra-* dir aborts the run.
        positives = self.library.dir("wake", phrase)
        negatives = self.library.dir("ambient")
        if any(positives.glob("**/*.wav")):
            argv += ["--extra-positives", str(positives)]
        if any(negatives.glob("**/*.wav")):
            argv += ["--extra-negatives", str(negatives)]
        try:
            self.proc = await asyncio.create_subprocess_exec(
                *argv, stdout=log, stderr=log, cwd=str(self.script.parent),
            )
            code = await self.proc.wait()
        except Exception as err:
            code = -1
            _LOGGER.exception("wake word training did not start: %s", err)
        finally:
            log.close()
        manifest = next(iter(out.glob("*.json")), None)
        ok = code == 0 and manifest is not None
        self.status = {
            "running": False, "phrase": phrase, "ok": ok,
            "returncode": code, "manifest": str(manifest) if manifest else None,
            "out": str(out),
        }
        _LOGGER.info("wake word %r training finished: ok=%s", phrase, ok)
        message = (
            f"The {phrase} wake word has finished training and is ready to "
            "load onto a puck."
            if ok else
            f"Training the {phrase} wake word failed - the log is in "
            f"{out}/train.log."
        )
        await self._announce(message)

    async def _announce(self, message: str) -> None:
        if not self.args.message_webhook:
            return
        try:
            async with ClientSession(timeout=ClientTimeout(total=5)) as http:
                await http.post(
                    self.args.message_webhook,
                    json={"message": message, "ask": True},
                )
        except Exception as err:
            _LOGGER.warning("training announcement not delivered: %s", err)


# --- admin HTTP ---------------------------------------------------------------


def admin_app(service: Service) -> web.Application:
    def authorize(req) -> None:
        """Mutating routes need the shared token; reads stay open.

        Anything on the LAN can reach this port, and enrolling a voice or
        starting an hours-long training run is not a thing a stray device
        gets to do. Callers: the integration (token from its options) and
        the Mac listener (reads the token file beside the profiles).
        """
        supplied = req.headers.get("X-Voice-Service-Token", "")
        if not secrets.compare_digest(supplied, service.args.token):
            raise web.HTTPUnauthorized(text="bad or missing token")

    async def health(_req):
        return web.json_response(
            {"ok": True, "model": service.args.model,
             "people": service.profiles.counts()}
        )

    async def last(_req):
        return web.json_response(service.last or {})

    def person_name(data: dict) -> str:
        person = str(data.get("person") or "").strip()
        if not person:
            raise web.HTTPBadRequest(text="person is required")
        # A name is a few words; a whole mis-captured transcript is not, and
        # once enrolled it haunts every later match. Refuse rather than trim -
        # only the caller knows which words were the name.
        if len(person) > 40 or len(person.split()) > 3:
            raise web.HTTPBadRequest(text="that does not look like a name")
        # "This is I..." STT garbles enroll a pronoun that then outbids every
        # real profile (an "I" profile beat Scott's on 2026-08-30). This is the
        # one door every enrollment path walks through - refuse them here.
        if person.lower() in ("i", "me", "you", "it", "we", "us", "he", "she",
                              "they", "who", "someone", "somebody", "nobody",
                              "yes", "no", "okay", "ok"):
            raise web.HTTPBadRequest(text=f"{person!r} is not a name")
        return person

    async def label(req):
        authorize(req)
        person = person_name(await req.json())
        try:
            return web.json_response(service.label(person))
        except ValueError as err:
            raise web.HTTPBadRequest(text=str(err))

    async def people(_req):
        return web.json_response(service.profiles.counts())

    async def people_delete(req):
        authorize(req)
        data = await req.json()
        person = str(data.get("person") or "").strip()
        if not service.profiles.delete(person):
            raise web.HTTPNotFound(text=f"no profile named {person!r}")
        return web.json_response(service.profiles.counts())

    library = Library(Path(service.args.data_dir).expanduser() / "library")
    recorder = Recorder()

    async def record_status(_req):
        return web.json_response(recorder.status())

    async def record_start(req):
        authorize(req)
        data = await req.json()
        kind = data.get("kind")
        label = " ".join(str(data.get("label") or "").split())
        if kind not in KINDS or not label:
            raise web.HTTPBadRequest(
                text=f"kind must be one of {', '.join(KINDS)}; label is required"
            )
        try:
            recorder.start(kind, label)
        except RuntimeError as err:
            raise web.HTTPConflict(text=str(err))
        return web.json_response({"kind": kind, "label": label})

    async def record_stop(req):
        authorize(req)
        loop = asyncio.get_running_loop()
        try:
            audio = await loop.run_in_executor(None, recorder.stop)
        except RuntimeError as err:
            raise web.HTTPConflict(text=str(err))
        except OSError as err:
            raise web.HTTPInternalServerError(text=f"microphone: {err}")
        kind, label = recorder.kind, recorder.label
        clips = []
        for piece in split_take(kind, audio):
            text = ""
            if kind != "ambient":  # dozens of chunks nobody will read
                async with service.lock:  # the puck's utterances take turns with ours
                    text = await loop.run_in_executor(
                        None, service.transcribe, _float(piece)
                    )
            clips.append(library.add(kind, label, piece, text))
        return web.json_response(
            {"seconds": round(len(audio) / RATE, 1), "clips": clips}
        )

    async def clips(req):
        return web.json_response(
            {"clips": library.list(req.query.get("kind"), req.query.get("label"))}
        )

    async def clip_upload(req):
        """A take recorded in the browser, filed as if the Mac had taken it.

        Speaker enrolment is about the person's voice, not the room, and the
        person may be nowhere near the Mac - so the panel records on the
        device in hand and sends the wav here. Only ?kind=voice: the other
        kinds need the puck's microphone, and parse_upload says so.
        """
        authorize(req)
        kind = req.query.get("kind") or ""
        label = " ".join((req.query.get("label") or "").split())
        if not label:
            raise web.HTTPBadRequest(text="label is required")
        try:
            audio = parse_upload(kind, await req.read())
        except ValueError as err:
            raise web.HTTPBadRequest(text=str(err))
        loop = asyncio.get_running_loop()
        async with service.lock:
            text = await loop.run_in_executor(None, service.transcribe, _float(audio))
        return web.json_response({"clip": library.add(kind, label, audio, text)})

    def clip_or_404(req) -> dict:
        clip = library.get(req.match_info["id"])
        if clip is None:
            raise web.HTTPNotFound(text="no such clip")
        return clip

    async def clip_audio(req):
        authorize(req)
        return web.Response(
            body=library.path(clip_or_404(req)).read_bytes(),
            content_type="audio/wav",
        )

    async def clip_delete(req):
        authorize(req)
        clip_id = req.match_info["id"]
        if not library.delete(clip_id):
            raise web.HTTPNotFound(text="no such clip")
        return web.json_response({"deleted": clip_id})

    async def clip_refile(req):
        authorize(req)
        clip = clip_or_404(req)
        data = await req.json()
        kind = data.get("kind") or clip["kind"]
        label = " ".join(str(data.get("label") or "").split()) or clip["label"]
        if kind not in KINDS:
            raise web.HTTPBadRequest(text=f"kind must be one of {', '.join(KINDS)}")
        return web.json_response({"clip": library.refile(clip["id"], kind, label)})

    async def people_enroll(req):
        authorize(req)
        data = await req.json()
        person = person_name(data)
        ids = data.get("clips") or []
        if not isinstance(ids, list) or not ids:
            raise web.HTTPBadRequest(text="clips is a non-empty list of ids")
        found = [library.get(str(i)) for i in ids]
        if None in found:
            raise web.HTTPNotFound(text="no such clip")
        loop = asyncio.get_running_loop()
        count = samples = 0
        for clip in found:
            audio = _float(harvest.read(library.path(clip)))
            async with service.lock:
                embedding = await loop.run_in_executor(None, service.embed, audio)
            if embedding is None:
                continue  # silence, or too short to fingerprint
            samples = service.profiles.add(person, embedding)
            count += 1
        return web.json_response(
            {"person": person, "count": count, "samples": samples}
        )

    trainer = Trainer(service.args, library)

    async def train(req):
        authorize(req)
        data = await req.json()
        phrase = " ".join(str(data.get("phrase") or "").split())
        if not phrase or len(phrase) > 40 or len(phrase.split()) > 4 \
                or not all(w.isalpha() for w in phrase.split()):
            raise web.HTTPBadRequest(text="a wake phrase is one to four words")
        try:
            return web.json_response(trainer.start(phrase))
        except RuntimeError as err:
            raise web.HTTPConflict(text=str(err))

    async def train_status(_req):
        return web.json_response(trainer.status)

    # aiohttp's default body limit is 1 MB, under a full-length voice sample.
    app = web.Application(client_max_size=UPLOAD_MAX_BYTES)
    app.add_routes(
        [
            web.get("/health", health),
            web.get("/last", last),
            web.post("/label", label),
            web.get("/people", people),
            web.post("/people/delete", people_delete),
            web.post("/train", train),
            web.get("/train/status", train_status),
            web.get("/record/status", record_status),
            web.post("/record/start", record_start),
            web.post("/record/stop", record_stop),
            web.get("/clips", clips),
            # Before /clips/{id}: "upload" is a verb here, never an id.
            web.post("/clips/upload", clip_upload),
            web.get("/clips/{id}/audio", clip_audio),
            web.post("/clips/{id}", clip_refile),
            web.delete("/clips/{id}", clip_delete),
            web.post("/people/enroll", people_enroll),
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
        "--capture-dir",
        default="",
        help="save every wake-triggered clip here as 16 kHz mono wav, for "
        "wake-word retraining; off unless set",
    )
    parser.add_argument(
        "--webhook",
        default="",
        help="HA speaker webhook, e.g. http://192.168.0.62/api/webhook/hubbubb_home_speaker",
    )
    parser.add_argument(
        "--message-webhook",
        default="",
        help="HA announcement webhook for training results; derived from "
        "--webhook when left blank",
    )
    args = parser.parse_args(argv)
    if not args.message_webhook and args.webhook.endswith("_speaker"):
        args.message_webhook = args.webhook[: -len("_speaker")] + "_message"
    # The shared secret between this service, the integration and the Mac
    # listener. Created on first run; paste it into the integration's voice
    # options. 0600 in a directory only this user reads.
    token_path = Path(args.data_dir).expanduser() / "token"
    if not token_path.exists():
        token_path.parent.mkdir(parents=True, exist_ok=True)
        token_path.write_text(secrets.token_hex(24))
        token_path.chmod(0o600)
    args.token = token_path.read_text().strip()
    return args


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
