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

import logging
import secrets
import time
from collections import deque

import aiohttp
from aiohttp import web
from homeassistant.components import webhook
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
