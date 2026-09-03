"""Who is speaking.

The voice pipeline hands every agent a transcript and nothing else - the audio
is gone by then. So the companion machine's voice service, which does hear the
audio, POSTs one event per utterance to a webhook here (who it sounded like,
how sure), and this keeps the last few of those plus two cheaper signals: a
spoken "this is Scott", and a per-device default for pucks that live in one
person's room. Resolution is best-signal-first; everything degrades to "no
idea" rather than to a guess presented as fact.
"""

from __future__ import annotations

import asyncio
import json
import logging
import secrets
import time
from collections import deque
from urllib.parse import parse_qsl, quote, urlencode

import aiohttp
from aiohttp import web
from homeassistant.components import webhook
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant

from .const import DOMAIN, WEBHOOK_SPEAKER

_LOGGER = logging.getLogger(__name__)

# A voice event only explains an utterance from moments ago.
# ponytail: single-puck timestamp matching; correlate events to devices when
# several pucks can stream at once.
EVENT_WINDOW = 20.0
# A spoken "this is Scott" holds until someone else is likely to have wandered
# up to the microphone.
OVERRIDE_WINDOW = 300.0
# Below this, a voice match is a lean, not an identification.
CONFIDENT = 0.75

# The Voice Studio panel drives the voice service's admin API through Home
# Assistant, so the browser never holds the shared token or talks to a second
# origin. Only what the studio needs; PUT/PATCH stay closed.
PROXY_URL = f"/api/{DOMAIN}/voice"
PROXY_METHODS = ("GET", "POST", "DELETE")


class SpeakerServiceError(Exception):
    """The voice service is absent, unreachable, or refused the call."""


class SpeakerBook:
    """Recent speaker events, one manual override, per-device defaults."""

    def __init__(
        self,
        session,
        url: str | None,
        device_map: str | None,
        token: str | None = None,
    ) -> None:
        self._session = session
        self._url = (url or "").rstrip("/")
        self._devices = parse_map(device_map or "")
        self._token = token or ""
        self.events: deque[dict] = deque(maxlen=10)
        self._override: tuple[str, float] | None = None

    @property
    def configured(self) -> bool:
        return bool(self._url)

    def record(self, event: dict) -> None:
        # The webhook is unauthenticated LAN plumbing; with a shared token
        # configured, an event that doesn't carry it is a forgery, not a
        # speaker. Stripped either way - it has no business being stored.
        supplied = event.pop("token", None)
        if self._token and not (
            isinstance(supplied, str)
            and secrets.compare_digest(supplied, self._token)
        ):
            _LOGGER.debug("dropped speaker event with a missing or bad token")
            return
        self.events.append(event)

    def set_override(self, person: str) -> None:
        """Someone said who they are; believe them for a while."""
        self._override = (person, time.time())

    def resolve(
        self, device_id: str | None = None
    ) -> tuple[str | None, float, str | None]:
        """-> (person or None, confidence 0..1, source: told|voice|device)."""
        now = time.time()
        if self._override and now - self._override[1] < OVERRIDE_WINDOW:
            return self._override[0], 1.0, "told"
        # Only the newest event can describe the current utterance; an older
        # one was somebody's previous sentence, not this one.
        if self.events:
            event = self.events[-1]
            fresh = now - float(event.get("ts") or 0) <= EVENT_WINDOW
            if fresh and (person := event.get("person")):
                return str(person), float(event.get("confidence") or 0), "voice"
        if device_id and device_id in self._devices:
            return self._devices[device_id], 0.5, "device"
        return None, 0.0, None

    def prompt_line(self, device_id: str | None = None) -> str:
        """One sentence about the speaker, for a language model's prompt."""
        person, confidence, source = self.resolve(device_id)
        if person and (source == "told" or confidence >= CONFIDENT):
            return f"The person speaking is {person}."
        if person:
            # Say the name plainly. "(not confirmed by voice)" read to a small
            # model as an instruction to go and confirm it, so a middling score
            # - which is most of them, the profile is thin - turned every other
            # exchange into "who am I speaking to?". The uncertainty is handled
            # by the tools that care, not by nagging in the prompt.
            return (
                f"The person speaking is probably {person}. Address them as "
                f"{person} and act normally; do not ask them to confirm who "
                "they are. The few tools that need certainty will say so."
            )
        if self.configured:
            # Speaker ID is on and heard nobody it knows: treat them as a
            # guest until they say who they are.
            #
            # Device control is deliberately spelled out as allowed. The older
            # wording ("do not touch anything personal, or act on their
            # behalf") read to a small model as covering "turn on MY misters",
            # so a marginal confidence score - the same sentence scores 0.52
            # one minute and 0.70 the next - turned into a refusal to work a
            # valve, and the model invented "you need to enroll your voice" to
            # explain itself. Anyone standing in the house can already reach
            # the physical switch; the things that genuinely need a person
            # attached (memories, lists, calendar, Hubbubb) are still refused
            # here and still separately gated by the 0.90 verify threshold and
            # the phone-tap approval.
            return (
                "You do not recognize this speaker - treat them as a guest. "
                "Introduce yourself when it feels natural, and answer "
                "questions and house basics freely. Control lights, valves, "
                "switches, media and timers for them normally - anyone in the "
                "house may do that, and never ask them to enroll or identify "
                "their voice first. Do not open the conversation by asking who "
                "is speaking. Only when a tool refuses because it needs a "
                "person - storing a memory, or someone's own lists, calendar "
                "or Hubbubb data - say so and ask them to tell you their name "
                "('this is ...')."
            )
        return (
            "You do not know who is speaking. That is fine for questions and "
            "commands - answer them normally. Only before storing a personal "
            "memory (a preference or fact about the speaker themselves) ask "
            "who is speaking."
        )

    async def async_label(self, person: str) -> None:
        """Tell the voice service the last utterance was this person's."""
        await self._post("/label", {"person": person})

    async def async_train(self, phrase: str) -> None:
        """Start training a wake word model on the voice service's machine."""
        await self._post("/train", {"phrase": phrase})

    async def async_proxy(
        self, method: str, path: str, query: str, body: bytes, content_type: str
    ) -> tuple[int, str, bytes]:
        """Forward one Voice Studio request. -> (status, content type, body).

        Plain values rather than a web.Response, so every decision here - the
        method, the path, the unconfigured and unreachable cases - runs in the
        test without aiohttp. Whatever the service answers is passed through
        with its own content type; a JSON error and a WAV clip take the same
        road.
        """
        if not self._url:
            return _refusal(503, "no voice service is configured")
        if method not in PROXY_METHODS:
            return _refusal(405, f"{method} is not allowed here")
        url = upstream_url(self._url, path, query)
        if url is None:
            return _refusal(404, "no such path")
        headers = {"Content-Type": content_type} if body else {}
        if self._token:
            headers["X-Voice-Service-Token"] = self._token
        try:
            async with self._session.request(
                method,
                url,
                data=body or None,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as resp:
                return (
                    resp.status,
                    resp.headers.get("Content-Type", "application/octet-stream"),
                    await resp.read(),
                )
        except (aiohttp.ClientError, asyncio.TimeoutError) as err:
            return _refusal(503, f"voice service unreachable: {err}")

    async def _post(self, route: str, body: dict) -> None:
        if not self._url:
            raise SpeakerServiceError("no voice service is configured")
        headers = (
            {"X-Voice-Service-Token": self._token} if self._token else None
        )
        try:
            async with self._session.post(
                f"{self._url}{route}",
                json=body,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=10),
            ) as resp:
                if resp.status >= 400:
                    raise SpeakerServiceError(
                        (await resp.text())[:200]
                        or f"voice service returned {resp.status}"
                    )
        except aiohttp.ClientError as err:
            raise SpeakerServiceError(
                f"voice service unreachable: {err}"
            ) from err


def upstream_url(base: str, path: str, query: str = "") -> str | None:
    """Where one proxied request goes, or None if it would leave the service.

    Each segment is re-quoted on its own, so nothing inside a clip id can
    become a separator, a host or a scheme on the way out; dot segments are
    refused outright rather than trusted to a normaliser somewhere upstream.
    """
    segments = path.split("/")
    if any(seg in ("", ".", "..") for seg in segments):
        return None
    url = f"{base}/" + "/".join(quote(seg, safe="") for seg in segments)
    # authSig is Home Assistant's own signed-path credential - how an <audio>
    # element gets past requires_auth. The voice service has no use for it.
    pairs = [
        (key, value)
        for key, value in parse_qsl(query, keep_blank_values=True)
        if key != "authSig"
    ]
    return f"{url}?{urlencode(pairs)}" if pairs else url


def _refusal(status: int, detail: str) -> tuple[int, str, bytes]:
    # The shape the companion services already fail in, so the panel has one
    # error to understand.
    body = json.dumps({"ok": False, "detail": detail}).encode()
    return status, "application/json", body


class VoiceProxyView(HomeAssistantView):
    """/api/hubbubb_home/voice/<path> -> <voice service>/<path>.

    Behind Home Assistant's own login; the shared token is added here. A view
    cannot be unregistered, so this is registered once and finds the live
    SpeakerBook on every request - after an unload it answers "not
    configured" instead of holding on to a dead one.
    """

    url = f"{PROXY_URL}/{{path:.*}}"
    name = f"{DOMAIN}:voice"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def get(self, request: web.Request, path: str) -> web.Response:
        runtimes = self._hass.data.get(DOMAIN, {}).values()
        book = next(
            (r.speakers for r in runtimes if r.speakers.configured), None
        ) or SpeakerBook(None, None, None)
        status, content_type, body = await book.async_proxy(
            request.method,
            path,
            request.query_string,
            await request.read(),
            request.content_type,
        )
        return web.Response(
            status=status, body=body, headers={"Content-Type": content_type}
        )

    post = delete = get


def parse_map(text: str) -> dict[str, str]:
    """'key: value' lines -> dict. Bad lines skipped. Shared with approvals."""
    out: dict[str, str] = {}
    for line in text.splitlines():
        device, sep, person = line.partition(":")
        if sep and device.strip() and person.strip():
            out[device.strip()] = person.strip()
    return out


def async_register_webhook(hass: HomeAssistant, runtime) -> None:
    """The inbound half of speaker identification.

    Registered unconditionally, like the message webhook: an event arriving
    while no voice service is configured is recorded and harmless.
    """

    async def _handle(
        hass: HomeAssistant, webhook_id: str, request: web.Request
    ) -> None:
        try:
            data = await request.json()
        except ValueError:
            return
        if isinstance(data, dict):
            runtime.speakers.record(data)

    webhook.async_register(
        hass,
        DOMAIN,
        f"{runtime.name} speaker events",
        WEBHOOK_SPEAKER,
        _handle,
        local_only=True,
        allowed_methods=["POST"],
    )
    runtime.unsubscribe.append(
        lambda: webhook.async_unregister(hass, WEBHOOK_SPEAKER)
    )
