"""What Hubbubb Home lends to whichever language model runs the house.

Home Assistant already ships an excellent Anthropic integration - streaming,
adaptive thinking, prompt caching, model updates - and its own Assist API
already exposes every light, lock and thermostat the user has chosen to
expose. Re-implementing either would mean re-implementing them forever.

So this registers an LLM API instead. Home Assistant merges the selected APIs
into one tool list, which means picking "Assist" and "Hubbubb Home" together
gives the model the house *and* everything below, with no second API key, no
model setting, and no opinion from us about which provider anyone uses.
"""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.helpers import llm
from homeassistant.util.json import JsonObjectType

from .approvals import VERIFY_CONFIDENCE
from .companion import CompanionError
from .const import DOMAIN
from .hubbubb import HubbubbError, HubbubbPending
from .speakers import SpeakerServiceError

_LOGGER = logging.getLogger(__name__)

API_ID = DOMAIN


class HubbubbAPI(llm.API):
    """Memory, timers, Hubbubb and the overnight findings, as tools."""

    def __init__(self, hass: HomeAssistant, runtime) -> None:
        super().__init__(hass=hass, id=API_ID, name="Hubbubb Home")
        self._runtime = runtime

    async def async_get_api_instance(
        self, llm_context: llm.LLMContext
    ) -> llm.APIInstance:
        runtime = self._runtime
        tools: list[llm.Tool] = [
            RememberTool(runtime),
            RecallTool(runtime),
            ForgetTool(runtime),
            SetSpeakerTool(runtime),
            StartTimerTool(runtime),
            CancelTimerTool(runtime),
            TimerStatusTool(runtime),
            FindingsTool(runtime),
        ]
        if runtime.hubbubb is not None:
            tools.append(AskHubbubbTool(runtime))
        if runtime.companion.configured:
            tools.append(EscalateTool(runtime))
        if runtime.speakers.configured:
            tools.append(TrainWakeWordTool(runtime))

        speaker = runtime.speakers.prompt_line(
            getattr(llm_context, "device_id", None)
        )
        return llm.APIInstance(
            api=self,
            api_prompt=f"{runtime.persona()}\n\n{speaker}",
            llm_context=llm_context,
            tools=tools,
        )


class _RuntimeTool(llm.Tool):
    """Base: every tool here needs the entry's runtime data."""

    def __init__(self, runtime) -> None:
        self._runtime = runtime

    def _speaker(self, llm_context) -> str | None:
        person, _, _ = self._runtime.speakers.resolve(
            getattr(llm_context, "device_id", None)
        )
        return person

    def _guest(self, llm_context) -> bool:
        """Speaker ID is on and heard nobody it knows - a guest, not a blank.

        Without speaker ID configured there are no guests, only a house that
        never knows who speaks; everything keeps its old open behavior.
        """
        return (
            self._runtime.speakers.configured
            and self._speaker(llm_context) is None
        )


_GUEST_ERROR = (
    "The speaker is not recognized, so this stays closed to guests. Ask who "
    "is speaking; once they say (identify_speaker), try again."
)


class RememberTool(_RuntimeTool):
    name = "remember"
    description = (
        "Store one durable fact about this household - a preference, a "
        "schedule, a code, a name, a past decision. Use it whenever you are "
        "told something worth knowing next week. Write one short "
        "self-contained sentence; do not store passwords or anything the "
        "speaker asked you to keep out of memory. personal=true files it "
        "under whoever is speaking (their preferences, their schedule); "
        "personal=false makes it a household fact everyone shares."
    )
    parameters = vol.Schema(
        {
            vol.Required("fact"): vol.All(str, vol.Length(min=3, max=500)),
            vol.Optional("personal", default=True): bool,
        }
    )

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        # A guest must not write to the house's memory - household facts
        # included, or "the wifi password is hunter2" from a stranger sticks.
        if self._guest(llm_context):
            return {"error": _GUEST_ERROR}
        person = self._speaker(llm_context) or ""
        if not tool_input.tool_args.get("personal", True):
            person = ""
        try:
            stored = await self._runtime.memory.async_add(
                tool_input.tool_args["fact"], person
            )
        except ValueError as err:
            return {"error": str(err)}
        return {"stored": stored, "for": person or "the household"}


class RecallTool(_RuntimeTool):
    name = "recall"
    description = (
        "Search what you know about this household. Call this before "
        "answering anything about people's preferences, schedules, codes, or "
        "past decisions - your own guess is not a memory."
    )
    parameters = vol.Schema(
        {
            vol.Required("query"): str,
            vol.Optional("limit", default=3): vol.All(
                int, vol.Range(min=1, max=10)
            ),
        }
    )

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        hits = await self._runtime.memory.async_search(
            tool_input.tool_args["query"],
            tool_input.tool_args.get("limit", 3),
            person=self._speaker(llm_context),
        )
        return {"memories": hits, "found": len(hits)}


class ForgetTool(_RuntimeTool):
    name = "forget"
    description = (
        "Delete the single memory that best matches a description. Only when "
        "asked to forget something, and say what was removed."
    )
    parameters = vol.Schema({vol.Required("query"): str})

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        gone = await self._runtime.memory.async_forget(
            tool_input.tool_args["query"]
        )
        if gone is None:
            return {"forgot": None, "detail": "nothing matched"}
        return {"forgot": gone}


class SetSpeakerTool(_RuntimeTool):
    name = "identify_speaker"
    description = (
        "Record who is speaking, when they tell you ('this is Scott') or "
        "answer your question about who they are. This also teaches the "
        "house their voice for next time. Use the name they gave, nothing "
        "invented."
    )
    parameters = vol.Schema(
        {vol.Required("person"): vol.All(str, vol.Length(min=1, max=100))}
    )

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        person = tool_input.tool_args["person"].strip()
        self._runtime.speakers.set_override(person)
        result: JsonObjectType = {"speaker": person}
        # The override is the personalization tier and stays immediate; the
        # voice profile is what verification later leans on, so a listed
        # person's device must approve before their profile learns. A person
        # with no device entry trains directly - they cannot be phone-verified
        # anyway, and blocking them would make first-time setup impossible.
        approvals = self._runtime.approvals
        if approvals.configured and approvals.approver_for(person):
            if not await approvals.async_request(
                person, f"Enroll this voice as {person}?"
            ):
                result["training"] = (
                    "not approved from their device; the voice was not enrolled"
                )
                return result
        try:
            await self._runtime.speakers.async_label(person)
        except SpeakerServiceError as err:
            # The override still holds for this conversation; only the
            # voice-profile training was missed.
            result["training"] = f"not recorded: {err}"
        return result


class EscalateTool(_RuntimeTool):
    name = "hand_to_companion"
    description = (
        "Hand a request to the much more capable coding agent on the "
        "companion computer. Use it when the request is beyond you: "
        "multi-step jobs, coding, research, anything needing files or the "
        "web. The agent answers aloud later, so after calling this just "
        "acknowledge that it's being worked on."
    )
    parameters = vol.Schema(
        {vol.Required("request"): vol.All(str, vol.Length(min=3, max=2000))}
    )

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        # Guests don't drive the coding agent.
        if self._guest(llm_context):
            return {"error": _GUEST_ERROR}
        text = tool_input.tool_args["request"]
        if person := self._speaker(llm_context):
            text = f"[{person}] {text}"
        try:
            await self._runtime.companion.async_call("prompt", {"text": text})
        except CompanionError as err:
            return {"error": str(err)}
        return {"handed_off": True}


class TrainWakeWordTool(_RuntimeTool):
    name = "train_wake_word"
    description = (
        "Start training a new wake word - the phrase that wakes the voice "
        "pucks - on the companion computer. Use it when asked to learn, "
        "train, or change the assistant's wake word or name. Training runs "
        "for hours and the house announces out loud when the model is ready "
        "to load; loading it onto a puck is a separate, human-approved step. "
        "Only one training runs at a time."
    )
    parameters = vol.Schema(
        {vol.Required("phrase"): vol.All(str, vol.Length(min=2, max=40))}
    )

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        phrase = tool_input.tool_args["phrase"]
        try:
            await self._runtime.speakers.async_train(phrase)
        except SpeakerServiceError as err:
            return {"error": str(err)}
        return {
            "training": phrase,
            "detail": "started; the house will announce when it is ready",
        }


class StartTimerTool(_RuntimeTool):
    name = "start_timer"
    description = (
        "Start a named countdown. Give it a name when the speaker named one "
        "('the pasta'), otherwise leave the name out."
    )
    parameters = vol.Schema(
        {
            vol.Optional("name", default=""): str,
            vol.Optional("hours", default=0): vol.All(int, vol.Range(min=0, max=24)),
            vol.Optional("minutes", default=0): vol.All(int, vol.Range(min=0, max=600)),
            vol.Optional("seconds", default=0): vol.All(int, vol.Range(min=0, max=600)),
        }
    )

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        args = tool_input.tool_args
        total = (
            args.get("hours", 0) * 3600
            + args.get("minutes", 0) * 60
            + args.get("seconds", 0)
        )
        try:
            timer = self._runtime.timers.start(args.get("name", ""), total)
        except ValueError as err:
            return {"error": str(err)}
        return {"started": timer.as_dict()}


class CancelTimerTool(_RuntimeTool):
    name = "cancel_timer"
    description = (
        "Cancel a running countdown. With no name, cancels the one due to "
        "finish next."
    )
    parameters = vol.Schema({vol.Optional("name", default=""): str})

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        timer = self._runtime.timers.find(tool_input.tool_args.get("name") or None)
        if timer is None:
            return {"error": "no timer like that is running"}
        self._runtime.timers.cancel(timer)
        return {"cancelled": timer.name}


class TimerStatusTool(_RuntimeTool):
    name = "timer_status"
    description = "List every countdown that is currently running."
    parameters = vol.Schema({})

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        return {"timers": self._runtime.timers.as_list()}


class FindingsTool(_RuntimeTool):
    name = "house_findings"
    description = (
        "What last night's sweep of the house turned up - things that went "
        "offline or stopped changing. Use it when asked how the house is, or "
        "whether anything is broken."
    )
    parameters = vol.Schema({})

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        report = self._runtime.findings
        return {
            "findings": report.items,
            "last_run": report.last_run,
        }


class AskHubbubbTool(_RuntimeTool):
    name = "ask_hubbubb"
    description = (
        "Put a plain-English request to Hubbubb, the household's CRM - "
        "records, correspondence, the inbox. Hubbubb's own agent plans and "
        "runs it, so ask in ordinary words; you do not need field names. "
        "Answers can take a few seconds; a slow one comes back as pending and "
        "the house announces the real answer aloud when it is ready - relay "
        "that and stop, do not retry. When verified people are configured "
        "this may need the speaker to approve on their own device; a denial "
        "is final for that request - do not retry it."
    )
    parameters = vol.Schema({vol.Required("request"): str})

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        request = tool_input.tool_args["request"]
        approvals = self._runtime.approvals
        people = self._runtime.hubbubb_people
        person = None
        # Per-person credentials need a person even with no approvers set;
        # otherwise the call would silently fall back to the shared account.
        if approvals.configured or people:
            person, confidence, source = self._runtime.speakers.resolve(
                getattr(llm_context, "device_id", None)
            )
            # Voice picks who to challenge; below the bar the house must ask,
            # not guess whose device to ring.
            if not person or (
                source != "told" and confidence < VERIFY_CONFIDENCE
            ):
                return {
                    "error": "speaker_not_verified",
                    "detail": (
                        "You are not sure who is speaking. Ask who is "
                        "speaking, wait for their answer (identify_speaker), "
                        "then call this again."
                    ),
                }
        if approvals.configured:
            if not await approvals.async_request(
                person, f"Hubbubb request: {request[:100]}"
            ):
                return {
                    "error": (
                        f"{person} did not approve this from their device "
                        "(denied, timed out, or no device is configured for "
                        "them). Denial is final - do not retry."
                    )
                }
        client = self._runtime.hubbubb
        if people:
            # The verified speaker acts as themselves in Hubbubb, so the
            # CRM's own permissions are the boundary. The shared account is
            # never a fallback here - "no account" must not become "someone
            # else's account".
            client = people.get(person.lower())
            if client is None:
                return {
                    "error": (
                        f"No Hubbubb account is linked for {person}. Say so; "
                        "an administrator can add one in the integration's "
                        "Hubbubb options."
                    )
                }
        try:
            # One short blocking try; past it the run keeps going and the
            # answer arrives through the announcement policy (quiet hours
            # included) instead of the pipeline holding its breath.
            answer = await client.async_ask(request, wait=20, timeout=22)
        except HubbubbPending as pending:
            announce = self._runtime.announce_message

            async def _done(text: str, ok: bool) -> None:
                await announce(
                    f"Hubbubb says: {text}" if ok
                    else f"Hubbubb couldn't finish that: {text}"
                )

            client.async_wait_background(pending.run_id, _done)
            return {
                "pending": True,
                "detail": (
                    "Hubbubb is working on it; the answer will be announced "
                    "when it is ready. Say so and stop."
                ),
            }
        except HubbubbError as err:
            return {"error": str(err)}
        return {"answer": answer}
