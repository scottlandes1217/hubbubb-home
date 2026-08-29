"""Sentences the house answers itself, without waking a language model.

"Set a timer for ten minutes" does not need a round trip to a frontier model,
and paying for one makes the house feel slower than the cheap speaker it
replaced. These handle the phrasings people actually repeat; everything else
falls through to whichever conversation agent is configured.
"""

from __future__ import annotations

import logging

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv, intent

from .const import DOMAIN
from .hubbubb import HubbubbError

_LOGGER = logging.getLogger(__name__)

INTENT_REMEMBER = "HubbubbRemember"
INTENT_RECALL = "HubbubbRecall"
INTENT_FORGET = "HubbubbForget"
INTENT_TIMER_START = "HubbubbTimerStart"
INTENT_TIMER_CANCEL = "HubbubbTimerCancel"
INTENT_TIMER_ADD = "HubbubbTimerAdd"
INTENT_TIMER_STATUS = "HubbubbTimerStatus"
INTENT_BUILD_ON = "HubbubbBuildOn"
INTENT_BUILD_OFF = "HubbubbBuildOff"
INTENT_FINDINGS = "HubbubbFindings"
INTENT_HUBBUBB = "HubbubbAsk"

ALL_INTENTS = (
    INTENT_REMEMBER, INTENT_RECALL, INTENT_FORGET,
    INTENT_TIMER_START, INTENT_TIMER_CANCEL, INTENT_TIMER_ADD,
    INTENT_TIMER_STATUS, INTENT_BUILD_ON, INTENT_BUILD_OFF,
    INTENT_FINDINGS, INTENT_HUBBUBB,
)


def async_register_all(hass: HomeAssistant, runtime) -> None:
    """Register every Hubbubb Home intent against one config entry."""
    for handler in (
        RememberHandler(runtime),
        RecallHandler(runtime),
        ForgetHandler(runtime),
        TimerStartHandler(runtime),
        TimerCancelHandler(runtime),
        TimerAddHandler(runtime),
        TimerStatusHandler(runtime),
        BuildModeHandler(runtime, INTENT_BUILD_ON, True),
        BuildModeHandler(runtime, INTENT_BUILD_OFF, False),
        FindingsHandler(runtime),
        AskHubbubbHandler(runtime),
    ):
        intent.async_register(hass, handler)


class _Handler(intent.IntentHandler):
    """Base: carries the runtime and turns a string into a spoken response."""

    def __init__(self, runtime) -> None:
        self._runtime = runtime

    @staticmethod
    def _say(intent_obj: intent.Intent, speech: str) -> intent.IntentResponse:
        response = intent_obj.create_response()
        response.async_set_speech(speech)
        return response


class RememberHandler(_Handler):
    intent_type = INTENT_REMEMBER
    slot_schema = {vol.Required("fact"): cv.string}
    description = "Store one durable fact about the household"

    async def async_handle(self, intent_obj: intent.Intent):
        slots = self.async_validate_slots(intent_obj.slots)
        try:
            await self._runtime.memory.async_add(slots["fact"]["value"])
        except ValueError:
            return self._say(intent_obj, "There was nothing to remember.")
        return self._say(intent_obj, "I'll remember that.")


class RecallHandler(_Handler):
    intent_type = INTENT_RECALL
    slot_schema = {vol.Required("query"): cv.string}
    description = "Search the household's memories"

    async def async_handle(self, intent_obj: intent.Intent):
        slots = self.async_validate_slots(intent_obj.slots)
        hits = await self._runtime.memory.async_search(slots["query"]["value"])
        if not hits:
            return self._say(
                intent_obj, "I don't have anything about that."
            )
        # Spoken, so at most two - a list read aloud stops being an answer.
        return self._say(intent_obj, ". ".join(h.rstrip(".") for h in hits[:2]) + ".")


class ForgetHandler(_Handler):
    intent_type = INTENT_FORGET
    slot_schema = {vol.Required("query"): cv.string}
    description = "Delete the memory that best matches a description"

    async def async_handle(self, intent_obj: intent.Intent):
        slots = self.async_validate_slots(intent_obj.slots)
        gone = await self._runtime.memory.async_forget(slots["query"]["value"])
        if gone is None:
            return self._say(intent_obj, "I couldn't find that one.")
        return self._say(intent_obj, f"Forgotten: {gone}")


class TimerStartHandler(_Handler):
    intent_type = INTENT_TIMER_START
    slot_schema = {
        vol.Optional("name"): cv.string,
        vol.Optional("hours"): vol.Coerce(int),
        vol.Optional("minutes"): vol.Coerce(int),
        vol.Optional("seconds"): vol.Coerce(int),
    }
    description = "Start a named countdown"

    async def async_handle(self, intent_obj: intent.Intent):
        slots = self.async_validate_slots(intent_obj.slots)
        total = (
            _slot(slots, "hours") * 3600
            + _slot(slots, "minutes") * 60
            + _slot(slots, "seconds")
        )
        name = str(slots.get("name", {}).get("value", "") or "").strip()
        try:
            timer = self._runtime.timers.start(name, total)
        except ValueError as err:
            return self._say(intent_obj, str(err).capitalize() + ".")
        label = f" for {timer.name}" if timer.name != "Timer" else ""
        return self._say(
            intent_obj, f"{_spoken(total).capitalize()}{label}, starting now."
        )


class TimerCancelHandler(_Handler):
    intent_type = INTENT_TIMER_CANCEL
    slot_schema = {
        vol.Optional("name"): cv.string,
        vol.Optional("all"): vol.Coerce(bool),
    }
    description = "Cancel a running countdown, or all of them"

    async def async_handle(self, intent_obj: intent.Intent):
        slots = self.async_validate_slots(intent_obj.slots)
        if slots.get("all", {}).get("value"):
            count = self._runtime.timers.cancel_all()
            if not count:
                return self._say(intent_obj, "No timers are running.")
            plural = "s" if count != 1 else ""
            return self._say(intent_obj, f"Cancelled {count} timer{plural}.")
        name = str(slots.get("name", {}).get("value", "") or "").strip()
        timer = self._runtime.timers.find(name or None)
        if timer is None:
            return self._say(intent_obj, "Nothing like that is running.")
        self._runtime.timers.cancel(timer)
        return self._say(intent_obj, "Cancelled.")


class TimerAddHandler(_Handler):
    intent_type = INTENT_TIMER_ADD
    slot_schema = {
        vol.Optional("name"): cv.string,
        vol.Optional("hours"): vol.Coerce(int),
        vol.Optional("minutes"): vol.Coerce(int),
        vol.Optional("seconds"): vol.Coerce(int),
    }
    description = "Add time to a running countdown"

    async def async_handle(self, intent_obj: intent.Intent):
        slots = self.async_validate_slots(intent_obj.slots)
        extra = (
            _slot(slots, "hours") * 3600
            + _slot(slots, "minutes") * 60
            + _slot(slots, "seconds")
        )
        name = str(slots.get("name", {}).get("value", "") or "").strip()
        timer = self._runtime.timers.find(name or None)
        if timer is None:
            return self._say(intent_obj, "Nothing like that is running.")
        if not extra:
            return self._say(intent_obj, "How much time?")
        self._runtime.timers.add_time(timer, extra)
        return self._say(
            intent_obj,
            f"{_spoken(extra).capitalize()} added. "
            f"{_spoken(timer.remaining())} left.",
        )


class TimerStatusHandler(_Handler):
    intent_type = INTENT_TIMER_STATUS
    slot_schema = {vol.Optional("name"): cv.string}
    description = "Say how long is left on the running countdowns"

    async def async_handle(self, intent_obj: intent.Intent):
        running = self._runtime.timers.timers
        if not running:
            return self._say(intent_obj, "No timers are running.")
        parts = []
        for timer in running[:3]:
            label = "" if timer.name == "Timer" else f"{timer.name}, "
            parts.append(f"{label}{_spoken(timer.remaining())}")
        return self._say(intent_obj, "; ".join(parts) + ".")


class BuildModeHandler(_Handler):
    slot_schema = {}

    def __init__(self, runtime, intent_type: str, turn_on: bool) -> None:
        super().__init__(runtime)
        self.intent_type = intent_type
        self.description = (
            "Show the build screen" if turn_on else "Leave the build screen"
        )
        self._on = turn_on

    async def async_handle(self, intent_obj: intent.Intent):
        entity_id = self._runtime.entity_id("build_mode")
        if entity_id is None:
            return self._say(intent_obj, "The build screen isn't set up.")
        await intent_obj.hass.services.async_call(
            "switch",
            "turn_on" if self._on else "turn_off",
            {"entity_id": entity_id},
            blocking=True,
        )
        return self._say(
            intent_obj, "Build mode on." if self._on else "Back to normal."
        )


class FindingsHandler(_Handler):
    intent_type = INTENT_FINDINGS
    slot_schema = {}
    description = "Say what the overnight sweep of the house found"

    async def async_handle(self, intent_obj: intent.Intent):
        report = self._runtime.findings
        if report.last_run is None:
            return self._say(
                intent_obj, "I haven't swept the house yet."
            )
        speech = report.spoken(self._runtime.name)
        if report.items:
            speech += " " + report.items[0]["detail"]
        return self._say(intent_obj, speech)


class AskHubbubbHandler(_Handler):
    intent_type = INTENT_HUBBUBB
    slot_schema = {vol.Required("request"): cv.string}
    description = "Put a question to Hubbubb"

    async def async_handle(self, intent_obj: intent.Intent):
        slots = self.async_validate_slots(intent_obj.slots)
        if self._runtime.hubbubb is None:
            return self._say(intent_obj, "Hubbubb isn't connected.")
        try:
            answer = await self._runtime.hubbubb.async_ask(
                slots["request"]["value"]
            )
        except HubbubbError as err:
            _LOGGER.warning("Hubbubb refused: %s", err)
            return self._say(intent_obj, "Hubbubb didn't answer.")
        return self._say(intent_obj, answer or "Hubbubb had nothing to say.")


def _slot(slots: dict, key: str) -> int:
    try:
        return int(slots.get(key, {}).get("value") or 0)
    except (TypeError, ValueError):
        return 0


def _spoken(seconds: float) -> str:
    """Seconds -> something a speaker can say without sounding like a clock."""
    seconds = int(round(seconds))
    if seconds < 60:
        return f"{seconds} second{'s' if seconds != 1 else ''}"
    minutes, secs = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    parts = []
    if hours:
        parts.append(f"{hours} hour{'s' if hours != 1 else ''}")
    if minutes:
        parts.append(f"{minutes} minute{'s' if minutes != 1 else ''}")
    # Trailing seconds only matter when they are the whole of what is left.
    if secs and not hours:
        parts.append(f"{secs} second{'s' if secs != 1 else ''}")
    return " and ".join(parts) if parts else "no time"
