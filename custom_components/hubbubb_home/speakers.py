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

    def __init__(self, session, url: str | None, device_map: str | None) -> None:
        self._session = session
        self._url = (url or "").rstrip("/")
        self._devices = _parse_map(device_map or "")
        self.events: deque[dict] = deque(maxlen=10)
        self._override: tuple[str, float] | None = None

    @property
    def configured(self) -> bool:
        return bool(self._url)

    def record(self, event: dict) -> None:
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
            return f"The speaker is probably {person} (not confirmed by voice)."
        return (
            "You do not know who is speaking. Before storing a personal "
            "memory or answering a personal question, ask who is speaking."
        )

    async def async_label(self, person: str) -> None:
        """Tell the voice service the last utterance was this person's."""
        if not self._url:
            raise SpeakerServiceError("no voice service is configured")
        try:
            async with self._session.post(
                f"{self._url}/label",
                json={"person": person},
                timeout=aiohttp.ClientTimeout(total=10),
            ) as resp:
                if resp.status >= 400:
                    raise SpeakerServiceError(
                        f"voice service returned {resp.status}"
                    )
        except aiohttp.ClientError as err:
            raise SpeakerServiceError(
                f"voice service unreachable: {err}"
            ) from err


def _parse_map(text: str) -> dict[str, str]:
    """'device_id: Person Name' lines -> {device_id: name}. Bad lines skipped."""
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
