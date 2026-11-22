"""Texts and calls: the person's own iPhone, through the companion's Mac.

Messages and the call history sync from the iPhone to the Mac, where
jarvis-phone.py reads them and sends from the person's number. Everything
here is a person's private data, so it follows approvals.py: voice or the
logged-in user only says *who* to ask, and a tap on that person's own phone
is what opens it (one tap covers the next few minutes).

A call's audio belongs on the phone, so place_call never dials from the Mac:
it leaves the number in PHONE_CALL_STATE and the phone Shortcut that asked
dials it.
"""

from __future__ import annotations

import asyncio
import logging
import time
from urllib.parse import urlsplit

import aiohttp
import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.helpers import llm
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.util.json import JsonObjectType

from .speakers import CAMERA_WINDOW, CONFIDENT, EVENT_WINDOW

_LOGGER = logging.getLogger(__name__)

PHONE_PORT = 8792
# Read by the phone Shortcut right after Jarvis answers; it dials a number set
# in the last 30 seconds ("at"), then sets it back to "none".
PHONE_CALL_STATE = "hubbubb_home.phone_call"
# A drafted text must be confirmed within this long, or it is drafted again.
DRAFT_WINDOW = 180
# ...and no sooner than this: a spoken yes needs the question read aloud and
# an answer, so a confirm this fast is the model answering for the speaker.
# ponytail: a time floor, not a turn check; key drafts to the chat turn if
# a model ever manages it slower than this.
DRAFT_MIN_AGE = 4
# person -> (to, text, when drafted). Module-level because the tool list is
# rebuilt for every request. The confirmation has to match a draft the
# speaker heard, so a model that skips the read-back can't send anything.
_DRAFTS: dict[str, tuple[str, str, float]] = {}

_NOBODY = (
    "I can't tell whose phone this is. Texts and calls only open for a "
    "recognized person - ask who is speaking (identify_speaker) first."
)


def _person(hass: HomeAssistant, runtime, llm_context) -> tuple[str | None, bool]:
    """Whose texts these are: the logged-in HA user (the phone Shortcut and
    the app carry one), else a confident voice, else the only approver.

    -> (person, trusted). Trusted - their own login, or their voice with the
    camera seeing them - needs no tap; anything else is only a name to
    challenge, and the tap on their phone is the authority."""
    user_id = getattr(getattr(llm_context, "context", None), "user_id", None)
    if user_id:
        for state in hass.states.async_all("person"):
            if state.attributes.get("user_id") == user_id:
                # The person entity says "Scott Landes"; approvers and voice
                # profiles say "Scott".
                full = state.name
                return next(
                    (name for name in (full, full.split()[0])
                     if runtime.approvals.approver_for(name)),
                    full,
                ), True
    # Voice alone can be a recording or the TV, and the camera only says who
    # is in the room - but a sure voice the camera also sees is the person.
    speakers, now = runtime.speakers, time.time()
    event = speakers.events[-1] if speakers.events else {}
    heard = event.get("person") if (
        now - float(event.get("ts") or 0) <= EVENT_WINDOW
        and float(event.get("confidence") or 0) >= CONFIDENT
    ) else None
    seen, at = speakers.in_view
    if heard and heard in seen and now - at <= CAMERA_WINDOW:
        return str(heard), True
    person, confidence, source = speakers.resolve(
        getattr(llm_context, "device_id", None)
    )
    if person and source == "voice" and confidence >= CONFIDENT:
        return person, False
    # Nobody recognized - the puck with an unsure voice. With one approver
    # there is only one phone to ask, and a stranger asking just gets a
    # request on that phone to deny.
    approvers = list(runtime.approvals._map)  # noqa: SLF001
    return (approvers[0] if len(approvers) == 1 else None), False


async def _mac(hass: HomeAssistant, runtime, endpoint: str, payload: dict) -> dict:
    url = runtime.companion._url  # noqa: SLF001 - same host as the camera app
    if not url:
        return {"error": "no companion Mac is set up"}
    token = runtime.companion._token  # noqa: SLF001
    try:
        async with async_get_clientsession(hass).post(
            f"http://{urlsplit(url).hostname}:{PHONE_PORT}/{endpoint}",
            json=payload,
            headers={"Authorization": f"Bearer {token}"} if token else {},
            timeout=aiohttp.ClientTimeout(total=40),
        ) as resp:
            data = await resp.json(content_type=None)
            if resp.status >= 400:
                return {"error": (data or {}).get("detail", f"Mac returned {resp.status}")}
            return data if isinstance(data, dict) else {}
    except (aiohttp.ClientError, asyncio.TimeoutError, ValueError) as err:
        return {"error": f"the Mac's phone service is not answering ({err or 'timed out'})"}


class _PhoneTool(llm.Tool):
    summary = ""  # what the approval notification says is being opened

    def __init__(self, runtime) -> None:
        self._runtime = runtime

    async def _approved(self, hass, llm_context) -> tuple[str | None, dict | None]:
        """-> (person, None) when opened, else (None, the error to return)."""
        person, trusted = _person(hass, self._runtime, llm_context)
        if not person:
            _LOGGER.info("%s: nobody recognized", self.name)
            return None, {"error": _NOBODY}
        # The texts on the Mac are an approver's own; anyone else recognized
        # is still only a name to challenge.
        trusted = trusted and bool(self._runtime.approvals.approver_for(person))
        granted = trusted or await self._runtime.approvals.async_request(
            person, self.summary
        )
        _LOGGER.info("%s for %s: %s", self.name, person,
                     "trusted" if trusted else "approved" if granted else "not approved")
        if not granted:
            return None, {
                "error": f"{person} didn't approve this on their phone, so it stays closed."
            }
        return person, None


class ReadMessagesTool(_PhoneTool):
    name = "read_messages"
    summary = "read your texts"
    description = (
        "Read the speaker's own text messages (iMessage and SMS, synced from "
        "their iPhone). contact narrows it to one person ('what did Mom "
        "say'); unread=true for 'any new texts'. Each message has when, from "
        "('me' is the speaker), text, and group for group chats. Summarize "
        "or read them out as asked; never invent one. The speaker approves "
        "on their phone the first time - say so if it's taking a moment."
    )
    parameters = vol.Schema(
        {
            vol.Optional("contact"): vol.All(str, vol.Length(min=1, max=80)),
            vol.Optional("unread", default=False): bool,
            vol.Optional("limit", default=8): vol.All(int, vol.Range(min=1, max=30)),
        }
    )

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        _, error = await self._approved(hass, llm_context)
        return error or await _mac(hass, self._runtime, "messages", tool_input.tool_args)


class SendMessageTool(_PhoneTool):
    name = "send_message"
    summary = "send a text from your number"
    description = (
        "Send a text from the speaker's own number, in two calls. First "
        "call with to and text: nothing is sent - it returns the question "
        "to ask, which you say word for word. When the speaker says yes, "
        "call again with confirmed=true and it sends exactly that draft. "
        "Never say a text was sent unless the result says sent: true. to "
        "is a contact name as spoken or a phone number."
    )
    parameters = vol.Schema(
        {
            vol.Required("to"): vol.All(str, vol.Length(min=1, max=80)),
            vol.Required("text"): vol.All(str, vol.Length(min=1, max=1000)),
            vol.Optional("confirmed", default=False): bool,
        }
    )

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        person, error = await self._approved(hass, llm_context)
        if error:
            return error
        draft = _DRAFTS.pop(person, None)
        if tool_input.tool_args.get("confirmed"):
            if not draft or time.time() - draft[2] >= DRAFT_WINDOW:
                return {"sent": False, "error": "nothing is drafted - draft it first"}
            if time.time() - draft[2] < DRAFT_MIN_AGE:
                _DRAFTS[person] = draft
                return {"sent": False, "error": "not sent - ask the speaker first and wait for their yes"}
            # Exactly what was read back, whatever the model passes now.
            return await _mac(hass, self._runtime, "send", {"to": draft[0], "text": draft[1]})
        to, text = tool_input.tool_args["to"].strip(), tool_input.tool_args["text"].strip()
        who = await _mac(hass, self._runtime, "contact", {"name": to})
        names = [c["name"] for c in who.get("contacts", [])]
        if not names and not any(ch.isdigit() for ch in to):
            return {"sent": False, "error": f"no contact matches {to!r}"}
        if len(set(names)) > 1:
            return {"sent": False, "error": "more than one contact matches - ask which",
                    "candidates": names}
        _DRAFTS[person] = (to, text, time.time())
        return {
            "sent": False,
            "say": f'Send "{text}" to {names[0] if names else to}?',
            "next": "Say that question. Only after a yes, call send_message with confirmed=true.",
        }


class RecentCallsTool(_PhoneTool):
    name = "recent_calls"
    summary = "see your recent calls"
    description = (
        "The speaker's recent phone calls from their iPhone: when, who, kind "
        "(missed, answered, outgoing) and minutes. missed=true for 'any "
        "missed calls' or 'who called me'."
    )
    parameters = vol.Schema(
        {
            vol.Optional("missed", default=False): bool,
            vol.Optional("limit", default=5): vol.All(int, vol.Range(min=1, max=20)),
        }
    )

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        _, error = await self._approved(hass, llm_context)
        return error or await _mac(hass, self._runtime, "calls", tool_input.tool_args)


class PlaceCallTool(_PhoneTool):
    name = "place_call"
    summary = "start a call from your phone"
    description = (
        "Call someone from the speaker's iPhone ('call Mom'). Works only when "
        "they are talking to you on their phone; from a speaker in the house "
        "it says so. who is a contact name as spoken or a number. After it "
        "succeeds just say 'Calling <name>.' - the phone dials."
    )
    parameters = vol.Schema({vol.Required("who"): vol.All(str, vol.Length(min=1, max=80))})

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        if getattr(llm_context, "device_id", None):
            return {"error": "I can only start calls when you ask from your phone."}
        _, error = await self._approved(hass, llm_context)
        if error:
            return error
        who = tool_input.tool_args["who"].strip()
        if sum(ch.isdigit() for ch in who) >= 7:
            name, number = who, who
        else:
            found = (await _mac(hass, self._runtime, "contact", {"name": who})).get("contacts", [])
            if not found:
                return {"error": f"no contact matches {who!r}"}
            if len({c["name"] for c in found}) > 1:
                return {"error": "more than one contact matches - ask which",
                        "candidates": [c["name"] for c in found]}
            phones = [n for n in found[0]["numbers"] if "@" not in n]
            if not phones:
                return {"error": f"{found[0]['name']} has no phone number"}
            name, number = found[0]["name"], phones[0]
        dial = "".join(ch for ch in number if ch.isdigit() or ch == "+")
        hass.states.async_set(PHONE_CALL_STATE, dial, {"name": name, "at": time.time()})
        return {"calling": name}


def phone_tools(runtime) -> list[llm.Tool]:
    """Only with a companion Mac and someone whose phone can approve."""
    if not (runtime.companion.configured and runtime.approvals.configured):
        return []
    return [ReadMessagesTool(runtime), SendMessageTool(runtime),
            RecentCallsTool(runtime), PlaceCallTool(runtime)]
