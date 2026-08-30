"""Sentences the house answers itself, without waking a language model.

"Set a timer for ten minutes" does not need a round trip to a frontier model,
and paying for one makes the house feel slower than the cheap speaker it
replaced. These handle the phrasings people actually repeat; everything else
falls through to whichever conversation agent is configured.
"""

from __future__ import annotations

import logging
import re
from datetime import timedelta

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv, intent
from homeassistant.util import dt as dt_util

from .const import CONF_PERSON_CALENDARS, DOMAIN
from .hubbubb import HubbubbError
from .speakers import CONFIDENT, SpeakerServiceError, parse_map

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
INTENT_IDENTIFY = "HubbubbIdentify"
INTENT_WHO = "HubbubbWhoAmI"
INTENT_MY_DAY = "HubbubbMyDay"
INTENT_INTERCOM = "HubbubbIntercom"

ALL_INTENTS = (
    INTENT_REMEMBER, INTENT_RECALL, INTENT_FORGET,
    INTENT_TIMER_START, INTENT_TIMER_CANCEL, INTENT_TIMER_ADD,
    INTENT_TIMER_STATUS, INTENT_BUILD_ON, INTENT_BUILD_OFF,
    INTENT_FINDINGS, INTENT_HUBBUBB, INTENT_IDENTIFY, INTENT_WHO,
    INTENT_MY_DAY, INTENT_INTERCOM,
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
        IdentifyHandler(runtime),
        WhoAmIHandler(runtime),
        MyDayHandler(runtime),
        IntercomHandler(runtime),
    ):
        intent.async_register(hass, handler)


def parse_calendar_map(text: str) -> dict[str, list[str]]:
    """'Person: calendar.a, calendar.b' lines -> {person(lower): [entities]}."""
    return {
        person.lower(): [c.strip() for c in cals.split(",") if c.strip()]
        for person, cals in parse_map(text or "").items()
    }


async def async_today_events(hass: HomeAssistant, calendars: list[str]) -> list[str]:
    """The rest of today's event titles across some calendars, at most four."""
    try:
        events = await hass.services.async_call(
            "calendar",
            "get_events",
            {
                "entity_id": calendars,
                "start_date_time": dt_util.now().isoformat(),
                # End of today, not twenty-four hours out: a duration window
                # announces tomorrow morning's dentist as "today".
                "end_date_time": (
                    dt_util.start_of_local_day() + timedelta(days=1)
                ).isoformat(),
            },
            blocking=True,
            return_response=True,
        )
    except HomeAssistantError as err:
        _LOGGER.debug("no calendar answer: %s", err)
        events = {}
    return [
        e["summary"]
        for cal in (events or {}).values()
        for e in cal.get("events", [])
    ][:4]


def satellites_in_area(area_name: str, areas, entities, device_areas) -> list[str]:
    """assist_satellite entities whose entity or device sits in the named area."""
    wanted = " ".join(area_name.lower().split())
    area_id = next(
        (a.id for a in areas if " ".join(a.name.lower().split()) == wanted),
        None,
    )
    if area_id is None:
        return []
    return [
        e.entity_id
        for e in entities
        if e.entity_id.startswith("assist_satellite.")
        and (e.area_id or device_areas.get(e.device_id)) == area_id
    ]


class _Handler(intent.IntentHandler):
    """Base: carries the runtime and turns a string into a spoken response."""

    def __init__(self, runtime) -> None:
        self._runtime = runtime

    @staticmethod
    def _say(intent_obj: intent.Intent, speech: str) -> intent.IntentResponse:
        response = intent_obj.create_response()
        response.async_set_speech(speech)
        return response

    def _speaker(self, intent_obj: intent.Intent):
        return self._runtime.speakers.resolve(
            getattr(intent_obj, "device_id", None)
        )


def _sounds_personal(fact: str) -> bool:
    """Whether a spoken fact is about the speaker rather than the house.

    ponytail: pronoun sniff - "I like...", "my dentist..." reads personal,
    everything else is the household's. A language-model agent decides this
    properly; the sentence intent only has the words.
    """
    words = fact.lower().split()
    return bool(words) and (
        words[0] in ("i", "my", "i'm", "i've") or "my" in words[1:3]
    )


class RememberHandler(_Handler):
    intent_type = INTENT_REMEMBER
    slot_schema = {vol.Required("fact"): cv.string}
    description = "Store one durable fact about the household"

    async def async_handle(self, intent_obj: intent.Intent):
        slots = self.async_validate_slots(intent_obj.slots)
        fact = slots["fact"]["value"]
        person, _, _ = self._speaker(intent_obj)
        try:
            await self._runtime.memory.async_add(
                fact, person if person and _sounds_personal(fact) else ""
            )
        except ValueError:
            return self._say(intent_obj, "There was nothing to remember.")
        return self._say(intent_obj, "I'll remember that.")


class RecallHandler(_Handler):
    intent_type = INTENT_RECALL
    slot_schema = {vol.Required("query"): cv.string}
    description = "Search the household's memories"

    async def async_handle(self, intent_obj: intent.Intent):
        slots = self.async_validate_slots(intent_obj.slots)
        person, _, _ = self._speaker(intent_obj)
        hits = await self._runtime.memory.async_search(
            slots["query"]["value"], person=person
        )
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


class IdentifyHandler(_Handler):
    intent_type = INTENT_IDENTIFY
    slot_schema = {vol.Required("person"): cv.string}
    description = "The speaker says who they are"

    async def async_handle(self, intent_obj: intent.Intent):
        slots = self.async_validate_slots(intent_obj.slots)
        # STT hands names over lowercase; store them like names. An open mic
        # appends trailing speech to the wildcard ("scott. i'm very lucky
        # that..."), and enrolling that as a name haunts every later match -
        # keep the opening sentence, at most three words.
        raw = str(slots["person"]["value"])
        person = " ".join(re.split(r"[.,!?;]", raw)[0].split()[:3]).title()
        if not person:
            return self._say(intent_obj, "I didn't catch the name.")
        self._runtime.speakers.set_override(person)
        # The override is personalization and stays immediate; the profile is
        # what verification leans on, so a listed person's own device must
        # approve before their voice enrolls. No device entry = train
        # directly, or first-time setup would be impossible.
        approvals = self._runtime.approvals
        if approvals.configured and approvals.approver_for(person):
            if not await approvals.async_request(
                person, f"Enroll this voice as {person}?"
            ):
                return self._say(
                    intent_obj,
                    f"Hello {person}. Enrolling your voice needs approval "
                    "from your device, and it wasn't approved.",
                )
        try:
            await self._runtime.speakers.async_label(person)
        except SpeakerServiceError as err:
            _LOGGER.debug("could not train the voice profile: %s", err)
            return self._say(intent_obj, f"Hello {person}.")
        return self._say(
            intent_obj, f"Hello {person}. I'll know your voice better now."
        )


class WhoAmIHandler(_Handler):
    intent_type = INTENT_WHO
    slot_schema = {}
    description = "Say who the house thinks is speaking"

    async def async_handle(self, intent_obj: intent.Intent):
        person, confidence, source = self._speaker(intent_obj)
        if person is None:
            return self._say(
                intent_obj,
                "I don't know yet. Tell me by saying: this is, and your name.",
            )
        if source == "told" or (source == "voice" and confidence >= CONFIDENT):
            return self._say(intent_obj, f"You're {person}.")
        return self._say(
            intent_obj, f"Probably {person}, but I haven't heard enough "
            "of your voice to be sure."
        )


class MyDayHandler(_Handler):
    intent_type = INTENT_MY_DAY
    slot_schema = {}
    description = "Read the speaker their own calendar for today"

    async def async_handle(self, intent_obj: intent.Intent):
        person, _, _ = self._speaker(intent_obj)
        if person is None:
            return self._say(
                intent_obj,
                "I'm not sure who's asking. Say: this is, and your name, "
                "and I'll read yours.",
            )
        people = parse_calendar_map(
            self._runtime.option("briefing", CONF_PERSON_CALENDARS, "")
        )
        calendars = people.get(person.lower())
        if not calendars:
            return self._say(
                intent_obj, f"I don't have a calendar set up for {person}."
            )
        titles = await async_today_events(intent_obj.hass, calendars)
        if not titles:
            return self._say(
                intent_obj, f"Nothing left on your calendar today, {person}."
            )
        return self._say(intent_obj, "Today: " + ", then ".join(titles) + ".")


class IntercomHandler(_Handler):
    intent_type = INTENT_INTERCOM
    # "room", not "area": hassil has a built-in {area} list and a wildcard
    # of the same name would fight it.
    slot_schema = {
        vol.Required("room"): cv.string,
        vol.Required("message"): cv.string,
    }
    description = "Announce a message on another room's voice satellite"

    async def async_handle(self, intent_obj: intent.Intent):
        from homeassistant.helpers import (
            area_registry as ar,
            device_registry as dr,
            entity_registry as er,
        )

        slots = self.async_validate_slots(intent_obj.slots)
        area = str(slots["room"]["value"]).strip()
        message = str(slots["message"]["value"]).strip()
        hass = intent_obj.hass
        satellites = satellites_in_area(
            area,
            ar.async_get(hass).async_list_areas(),
            er.async_get(hass).entities.values(),
            {d.id: d.area_id for d in dr.async_get(hass).devices.values()},
        )
        if not satellites:
            return self._say(
                intent_obj, f"There's no voice satellite in the {area}."
            )
        person, _, _ = self._speaker(intent_obj)
        spoken = f"{person} says: {message}" if person else message
        try:
            await hass.services.async_call(
                "assist_satellite",
                "announce",
                {"entity_id": satellites, "message": spoken},
                blocking=False,
            )
        except HomeAssistantError as err:
            _LOGGER.warning("intercom to %s failed: %s", area, err)
            return self._say(intent_obj, "I couldn't reach that room.")
        return self._say(intent_obj, "Passed along.")


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
