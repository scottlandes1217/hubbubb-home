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

from .companion import CompanionError
from .const import DOMAIN
from .hubbubb import HubbubbError

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
            StartTimerTool(runtime),
            CancelTimerTool(runtime),
            TimerStatusTool(runtime),
            FindingsTool(runtime),
        ]
        if runtime.hubbubb is not None:
            tools.append(AskHubbubbTool(runtime))

        return llm.APIInstance(
            api=self,
            api_prompt=runtime.persona(),
            llm_context=llm_context,
            tools=tools,
        )


class _RuntimeTool(llm.Tool):
    """Base: every tool here needs the entry's runtime data."""

    def __init__(self, runtime) -> None:
        self._runtime = runtime


class RememberTool(_RuntimeTool):
    name = "remember"
    description = (
        "Store one durable fact about this household - a preference, a "
        "schedule, a code, a name, a past decision. Use it whenever you are "
        "told something worth knowing next week. Write one short "
        "self-contained sentence; do not store passwords or anything the "
        "speaker asked you to keep out of memory."
    )
    parameters = vol.Schema(
        {vol.Required("fact"): vol.All(str, vol.Length(min=3, max=500))}
    )

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        try:
            stored = await self._runtime.memory.async_add(
                tool_input.tool_args["fact"]
            )
        except ValueError as err:
            return {"error": str(err)}
        return {"stored": stored}


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
        "Answers can take a few seconds, so only call it when the question is "
        "really about Hubbubb data."
    )
    parameters = vol.Schema({vol.Required("request"): str})

    async def async_call(
        self, hass: HomeAssistant, tool_input: llm.ToolInput, llm_context
    ) -> JsonObjectType:
        try:
            answer = await self._runtime.hubbubb.async_ask(
                tool_input.tool_args["request"]
            )
        except HubbubbError as err:
            return {"error": str(err)}
        return {"answer": answer}
