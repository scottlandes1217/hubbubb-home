"""Hubbubb Home.

Everything the assistant needs is created here rather than asked of the user:
the toggles, the timer pool, the memory database, the voice sentences and the
dashboard cards. The one thing that cannot be created is the language model,
and that is deliberate - Home Assistant already ships good LLM integrations,
so this registers an LLM API for them to merge in instead of shipping a
fourteenth way to hold an API key.
"""

from __future__ import annotations

import logging
import shutil
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import voluptuous as vol
from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import (
    HomeAssistant,
    ServiceCall,
    ServiceResponse,
    SupportsResponse,
)
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import intent as intent_helper, llm
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.entity_registry import async_get as async_get_entities
from homeassistant.helpers.event import async_track_time_change
from homeassistant.loader import async_get_integration
from homeassistant.util import dt as dt_util

from .companion import NOT_CONFIGURED, CompanionClient, CompanionError
from .const import (
    CARDS,
    CONF_ASSISTANT_NAME,
    CONF_BRIEFING_ENABLED,
    CONF_BRIEFING_TARGET,
    CONF_BRIEFING_TIME,
    CONF_CALENDARS,
    CONF_COMPANION,
    CONF_COMPANION_TOKEN,
    CONF_COMPANION_URL,
    CONF_HUBBUBB,
    CONF_HUBBUBB_ID,
    CONF_HUBBUBB_SECRET,
    CONF_HUBBUBB_URL,
    CONF_IGNORE,
    CONF_NIGHTLY_ENABLED,
    CONF_NIGHTLY_TIME,
    CONF_PROMPT,
    CONF_WEATHER,
    DEFAULT_BRIEFING_TIME,
    DEFAULT_NAME,
    DEFAULT_NIGHTLY_TIME,
    DEFAULT_PROMPT,
    DOMAIN,
    PLATFORMS,
)
from .hubbubb import HubbubbClient, HubbubbError
from .intents import ALL_INTENTS, async_register_all
from .llm_api import HubbubbAPI
from .memory import Memory
from .nightly import FindingsReport, async_sweep
from .timers import TimerPool

_LOGGER = logging.getLogger(__name__)

# Card URLs carry the integration version, so a HACS update changes the path
# and the browser cannot serve a stale bundle from cache. This is the whole
# reason the cards are shipped by the integration rather than dropped in www/.
URL_BASE = f"/{DOMAIN}"

# service name -> (companion endpoint, HTTP method)
AGENT_SERVICES = {
    "agent_status": ("status", "GET"),
    "agent_transcript": ("transcript", "GET"),
    "agent_prompt_direct": ("prompt", "POST"),
    "agent_start_session": ("session", "POST"),
    "agent_target_window": ("target", "POST"),
    "agent_upload": ("upload", "POST"),
    "agent_key": ("key", "POST"),
    "agent_kill": ("kill", "POST"),
}


@dataclass
class Runtime:
    """Everything one config entry owns while it is loaded."""

    entry: ConfigEntry
    hass: HomeAssistant
    name: str
    memory: Memory
    timers: TimerPool
    findings: FindingsReport
    hubbubb: HubbubbClient | None
    companion: CompanionClient
    unsubscribe: list = field(default_factory=list)

    def option(self, section: str, key: str, default: Any = None) -> Any:
        return (self.entry.options.get(section) or {}).get(key, default)

    def persona(self) -> str:
        prompt = self.entry.options.get(CONF_PROMPT) or DEFAULT_PROMPT
        try:
            return prompt.format(name=self.name)
        except (KeyError, IndexError):
            # Somebody put a stray brace in their own prompt; their words are
            # worth more than our substitution.
            return prompt

    def entity_id(self, key: str) -> str | None:
        registry = async_get_entities(self.hass)
        return registry.async_get_entity_id(
            "switch", DOMAIN, f"{self.entry.entry_id}_{key}"
        )


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Stand the assistant up."""
    session = async_get_clientsession(hass)
    name = entry.data.get(CONF_ASSISTANT_NAME) or DEFAULT_NAME

    memory = Memory(hass)
    await memory.async_setup()

    hub_conf = entry.data.get(CONF_HUBBUBB) or {}
    hubbubb = None
    if all(
        hub_conf.get(k)
        for k in (CONF_HUBBUBB_URL, CONF_HUBBUBB_ID, CONF_HUBBUBB_SECRET)
    ):
        hubbubb = HubbubbClient(
            session,
            hub_conf[CONF_HUBBUBB_URL],
            hub_conf[CONF_HUBBUBB_ID],
            hub_conf[CONF_HUBBUBB_SECRET],
        )

    companion_conf = entry.data.get(CONF_COMPANION) or {}
    companion = CompanionClient(
        session,
        companion_conf.get(CONF_COMPANION_URL),
        companion_conf.get(CONF_COMPANION_TOKEN),
    )

    runtime = Runtime(
        entry=entry,
        hass=hass,
        name=name,
        memory=memory,
        timers=None,  # set below; the pool needs a callback that needs runtime
        findings=FindingsReport(),
        hubbubb=hubbubb,
        companion=companion,
    )

    async def _timer_finished(timer) -> None:
        await _announce(
            runtime,
            f"{timer.name} is up." if timer.name != "Timer" else "Time's up.",
        )

    runtime.timers = TimerPool(hass, _timer_finished)

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = runtime

    await _async_serve_cards(hass)
    await _async_install_sentences(hass)

    async_register_all(hass, runtime)
    runtime.unsubscribe.append(llm.async_register_api(hass, HubbubbAPI(hass, runtime)))

    _async_register_services(hass, runtime)
    _async_schedule(hass, runtime)

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_reload))
    return True


async def _async_reload(hass: HomeAssistant, entry: ConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Take it back down without leaving timers armed or an API registered."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if not unloaded:
        return False

    runtime: Runtime = hass.data[DOMAIN].pop(entry.entry_id)
    runtime.timers.cancel_all()
    for unsub in runtime.unsubscribe:
        unsub()
    for intent_type in ALL_INTENTS:
        intent_helper.async_remove(hass, intent_type)
    for service in (*AGENT_SERVICES, *SERVICE_SCHEMAS):
        hass.services.async_remove(DOMAIN, service)
    return True


# --- frontend ----------------------------------------------------------------


async def _async_serve_cards(hass: HomeAssistant) -> None:
    """Publish the cards and load them, so nobody registers a resource by hand."""
    if hass.data.get(f"{DOMAIN}_cards"):
        return
    hass.data[f"{DOMAIN}_cards"] = True

    integration = await async_get_integration(hass, DOMAIN)
    base = f"{URL_BASE}/{integration.version or 'dev'}"
    www = Path(__file__).parent / "www"

    await hass.http.async_register_static_paths(
        [StaticPathConfig(base, str(www), cache_headers=True)]
    )
    for card in CARDS:
        frontend.add_extra_js_url(hass, f"{base}/{card}")


async def _async_install_sentences(hass: HomeAssistant) -> None:
    """Copy the sentence files where the conversation agent looks for them.

    custom_sentences is read from the configuration directory at startup and
    nowhere else, so an integration cannot register sentences at runtime - it
    can only put the files there and say a restart is needed.
    """
    source = Path(__file__).parent / "sentences" / "en"
    target = Path(hass.config.path("custom_sentences", "en"))

    def _copy() -> bool:
        target.mkdir(parents=True, exist_ok=True)
        changed = False
        for path in sorted(source.glob("*.yaml")):
            dest = target / f"{DOMAIN}_{path.name}"
            if dest.exists() and dest.read_bytes() == path.read_bytes():
                continue
            shutil.copyfile(path, dest)
            changed = True
        return changed

    try:
        changed = await hass.async_add_executor_job(_copy)
    except OSError as err:
        _LOGGER.warning("could not install voice sentences: %s", err)
        return

    if changed:
        from homeassistant.components import persistent_notification

        persistent_notification.async_create(
            hass,
            "Hubbubb Home installed its voice sentences. Restart Home "
            "Assistant to start using them - everything else already works.",
            title="Hubbubb Home: restart to finish",
            notification_id=f"{DOMAIN}_sentences",
        )


# --- services ----------------------------------------------------------------

SERVICE_SCHEMAS: dict[str, vol.Schema] = {
    "remember": vol.Schema({vol.Required("fact"): str}),
    "recall": vol.Schema(
        {
            vol.Required("query"): str,
            vol.Optional("limit", default=3): vol.All(int, vol.Range(1, 25)),
        }
    ),
    "forget": vol.Schema({vol.Required("query"): str}),
    "timer_start": vol.Schema(
        {
            vol.Optional("name", default=""): str,
            vol.Optional("hours", default=0): vol.Coerce(int),
            vol.Optional("minutes", default=0): vol.Coerce(int),
            vol.Optional("seconds", default=0): vol.Coerce(int),
        }
    ),
    "timer_cancel": vol.Schema({vol.Optional("timer_id"): str, vol.Optional("name"): str}),
    "timer_add": vol.Schema(
        {
            vol.Optional("timer_id"): str,
            vol.Optional("name"): str,
            vol.Required("seconds"): vol.Coerce(int),
        }
    ),
    "ask_hubbubb": vol.Schema({vol.Required("request"): str}),
    "run_sweep": vol.Schema({}),
    "speak_briefing": vol.Schema({vol.Optional("target"): str}),
}


def _async_register_services(hass: HomeAssistant, runtime: Runtime) -> None:
    """Register everything twice-over: for automations and for the cards."""

    async def remember(call: ServiceCall) -> ServiceResponse:
        return {"stored": await runtime.memory.async_add(call.data["fact"])}

    async def recall(call: ServiceCall) -> ServiceResponse:
        hits = await runtime.memory.async_search(
            call.data["query"], call.data.get("limit", 3)
        )
        return {"memories": hits}

    async def forget(call: ServiceCall) -> ServiceResponse:
        return {"forgot": await runtime.memory.async_forget(call.data["query"])}

    async def timer_start(call: ServiceCall) -> ServiceResponse:
        total = (
            call.data.get("hours", 0) * 3600
            + call.data.get("minutes", 0) * 60
            + call.data.get("seconds", 0)
        )
        try:
            timer = runtime.timers.start(call.data.get("name", ""), total)
        except ValueError as err:
            raise HomeAssistantError(str(err)) from err
        return {"timer": timer.as_dict()}

    async def timer_cancel(call: ServiceCall) -> ServiceResponse:
        timer = _resolve_timer(runtime, call)
        runtime.timers.cancel(timer)
        return {"cancelled": timer.id}

    async def timer_add(call: ServiceCall) -> ServiceResponse:
        timer = _resolve_timer(runtime, call)
        runtime.timers.add_time(timer, call.data["seconds"])
        return {"timer": timer.as_dict()}

    async def ask_hubbubb(call: ServiceCall) -> ServiceResponse:
        if runtime.hubbubb is None:
            raise HomeAssistantError("Hubbubb is not connected")
        try:
            return {"answer": await runtime.hubbubb.async_ask(call.data["request"])}
        except HubbubbError as err:
            raise HomeAssistantError(str(err)) from err

    async def run_sweep(call: ServiceCall) -> ServiceResponse:
        await _sweep(runtime)
        return {"findings": runtime.findings.items}

    async def speak_briefing(call: ServiceCall) -> ServiceResponse:
        text = await _briefing_text(runtime)
        await _announce(runtime, text, call.data.get("target"))
        return {"spoken": text}

    handlers = {
        "remember": remember,
        "recall": recall,
        "forget": forget,
        "timer_start": timer_start,
        "timer_cancel": timer_cancel,
        "timer_add": timer_add,
        "ask_hubbubb": ask_hubbubb,
        "run_sweep": run_sweep,
        "speak_briefing": speak_briefing,
    }
    for name, handler in handlers.items():
        hass.services.async_register(
            DOMAIN,
            name,
            handler,
            schema=SERVICE_SCHEMAS[name],
            supports_response=SupportsResponse.OPTIONAL,
        )

    # The build screen's calls, forwarded verbatim. They answer in the shape
    # the card already expects, so the card needed no special case for them.
    for service, (endpoint, method) in AGENT_SERVICES.items():

        def _make(endpoint: str, method: str):
            async def _call(call: ServiceCall) -> ServiceResponse:
                try:
                    content = await runtime.companion.async_call(
                        endpoint, dict(call.data), method=method
                    )
                except CompanionError as err:
                    return {"status": 503, "content": {"ok": False, "detail": str(err)}}
                return {"status": 200, "content": content}

            return _call

        hass.services.async_register(
            DOMAIN,
            service,
            _make(endpoint, method),
            supports_response=SupportsResponse.ONLY,
        )


def _resolve_timer(runtime: Runtime, call: ServiceCall):
    timer = None
    if timer_id := call.data.get("timer_id"):
        timer = runtime.timers.get(timer_id)
    if timer is None:
        timer = runtime.timers.find(call.data.get("name"))
    if timer is None:
        raise HomeAssistantError("no such timer is running")
    return timer


# --- scheduled work ----------------------------------------------------------


def _async_schedule(hass: HomeAssistant, runtime: Runtime) -> None:
    """Arm the overnight sweep and the morning briefing."""
    if runtime.option("overnight", CONF_NIGHTLY_ENABLED, True):
        hour, minute, second = _hms(
            runtime.option("overnight", CONF_NIGHTLY_TIME, DEFAULT_NIGHTLY_TIME)
        )

        async def _nightly(_now) -> None:
            await _sweep(runtime)

        runtime.unsubscribe.append(
            async_track_time_change(
                hass, _nightly, hour=hour, minute=minute, second=second
            )
        )

    if runtime.option("briefing", CONF_BRIEFING_ENABLED, False):
        hour, minute, second = _hms(
            runtime.option("briefing", CONF_BRIEFING_TIME, DEFAULT_BRIEFING_TIME)
        )

        async def _morning(_now) -> None:
            await _announce(runtime, await _briefing_text(runtime))

        runtime.unsubscribe.append(
            async_track_time_change(
                hass, _morning, hour=hour, minute=minute, second=second
            )
        )


def _hms(value: str) -> tuple[int, int, int]:
    parts = (str(value).split(":") + ["0", "0", "0"])[:3]
    try:
        return tuple(int(p) for p in parts)  # type: ignore[return-value]
    except ValueError:
        return (3, 30, 0)


async def _sweep(runtime: Runtime) -> None:
    """Look the house over and record what it found. Changes nothing."""
    raw = runtime.option("overnight", CONF_IGNORE, "") or ""
    ignore = [line.strip() for line in raw.replace(",", "\n").splitlines() if line.strip()]
    findings = await async_sweep(runtime.hass, ignore)
    runtime.findings.update(findings, runtime.findings.spoken(runtime.name))
    _LOGGER.info("overnight sweep: %d finding(s)", len(findings))

    if findings:
        from homeassistant.components import persistent_notification

        body = "\n".join(f"- {f['detail']}" for f in findings[:20])
        if len(findings) > 20:
            body += f"\n- ...and {len(findings) - 20} more."
        persistent_notification.async_create(
            runtime.hass,
            body,
            title=f"{runtime.name}: {len(findings)} thing(s) worth a look",
            notification_id=f"{DOMAIN}_findings",
        )


async def _briefing_text(runtime: Runtime) -> str:
    """Weather, the day's calendar, and what went quiet overnight."""
    hass = runtime.hass
    parts = [f"Good morning. It's {dt_util.now().strftime('%A the %d').lstrip('0')}."]

    if weather := runtime.option("briefing", CONF_WEATHER):
        if (state := hass.states.get(weather)) is not None:
            temp = state.attributes.get("temperature")
            unit = state.attributes.get("temperature_unit", "")
            summary = str(state.state).replace("-", " ")
            parts.append(
                f"It's {summary}"
                + (f", {round(temp)} {unit}." if temp is not None else ".")
            )

    calendars = runtime.option("briefing", CONF_CALENDARS) or []
    if calendars:
        try:
            events = await hass.services.async_call(
                "calendar",
                "get_events",
                {
                    "entity_id": calendars,
                    "start_date_time": dt_util.now().isoformat(),
                    "duration": {"hours": 24},
                },
                blocking=True,
                return_response=True,
            )
        except HomeAssistantError as err:
            _LOGGER.debug("no calendar for the briefing: %s", err)
            events = {}
        titles = [
            e["summary"]
            for cal in (events or {}).values()
            for e in cal.get("events", [])
        ][:4]
        if titles:
            parts.append("Today: " + ", then ".join(titles) + ".")
        else:
            parts.append("Nothing in the calendar today.")

    parts.append(runtime.findings.spoken(runtime.name))
    return " ".join(parts)


async def _announce(runtime: Runtime, text: str, target: str | None = None) -> None:
    """Say something out loud through a voice satellite.

    Only assist_satellite, deliberately. Every other way of making a house
    talk - a speaker group, a phone notification, a specific TTS voice - is
    one automation away, and `speak_briefing` returns the text so that
    automation has something to say. Guessing at the rest would mean owning
    a media-player routing problem that Home Assistant already solves.
    """
    target = target or runtime.option("briefing", CONF_BRIEFING_TARGET)
    if not target:
        _LOGGER.info("%s had nothing to speak through: %s", runtime.name, text)
        return
    try:
        await runtime.hass.services.async_call(
            "assist_satellite",
            "announce",
            {"entity_id": target, "message": text},
            blocking=False,
        )
    except HomeAssistantError as err:
        _LOGGER.warning("could not speak the announcement: %s", err)
