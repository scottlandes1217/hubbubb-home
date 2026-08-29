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
from datetime import timedelta
from pathlib import Path
from typing import Any

import voluptuous as vol
from homeassistant.components import frontend, webhook
from aiohttp import web

from homeassistant.components.http import HomeAssistantView
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
    CONF_SENTENCES,
    CONF_TTS,
    CONF_WEATHER,
    DEFAULT_BRIEFING_TIME,
    DEFAULT_NAME,
    DEFAULT_NIGHTLY_TIME,
    DEFAULT_PROMPT,
    DOMAIN,
    EVENT_MESSAGE,
    PLATFORMS,
    WEBHOOK_MESSAGE,
)
from . import appletv
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
    "agent_model": ("model", "POST"),
    "agent_permission": ("permission", "POST"),
    "agent_models": ("models", "GET"),
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

    findings = FindingsReport(hass)
    await findings.async_load()

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
        findings=findings,
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
    await _async_install_sentences(
        hass,
        entry.options.get(CONF_SENTENCES, True),
        appletv.sentence_yaml(hass, runtime),
    )

    async_register_all(hass, runtime)
    appletv.async_register_all(hass, runtime)
    runtime.unsubscribe.append(llm.async_register_api(hass, HubbubbAPI(hass, runtime)))

    _async_register_services(hass, runtime)
    _async_register_webhook(hass, runtime)
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
    for intent_type in (*ALL_INTENTS, *appletv.ATV_INTENTS):
        intent_helper.async_remove(hass, intent_type)
    for service in (*AGENT_SERVICES, *SERVICE_SCHEMAS):
        hass.services.async_remove(DOMAIN, service)
    return True


# --- frontend ----------------------------------------------------------------


class _CardsView(HomeAssistantView):
    """Serve the card bundles under ANY version segment.

    The version in the URL is cache-busting for freshly served frontends, but
    an app with a cached shell keeps asking for the version it was served —
    possibly weeks old. Answering 404 there bricks that screen's cards until
    someone clears the app cache (measured: a wall tablet stuck on "custom
    element doesn't exist" after an update, while every other device was
    fine). So the version segment is accepted and ignored: every version
    serves the current file, with no-cache so a bumped bundle is picked up on
    the next load rather than pinned for a year by immutable headers.
    """

    requires_auth = False
    url = f"{URL_BASE}/{{version}}/{{filename}}"
    name = f"{DOMAIN}:cards"

    async def get(
        self, request: web.Request, version: str, filename: str
    ) -> web.StreamResponse:
        if filename not in CARDS:  # also forecloses path traversal
            raise web.HTTPNotFound
        return web.FileResponse(
            Path(__file__).parent / "www" / filename,
            headers={"Cache-Control": "no-cache"},
        )


async def _async_serve_cards(hass: HomeAssistant) -> None:
    """Publish the cards and register them as Lovelace resources.

    add_extra_js_url is fire-and-forget: the frontend does not wait for it
    before rendering, so a slow device can paint the dashboard first and show
    "custom element doesn't exist" - a coin flip on every load of the wall
    tablet. Registered resources are awaited before the first card renders.
    """
    if hass.data.get(f"{DOMAIN}_cards"):
        return
    hass.data[f"{DOMAIN}_cards"] = True

    integration = await async_get_integration(hass, DOMAIN)
    base = f"{URL_BASE}/{integration.version or 'dev'}"

    hass.http.register_view(_CardsView())

    resources = getattr(hass.data.get("lovelace"), "resources", None)
    if resources is None or not hasattr(resources, "async_create_item"):
        # YAML-mode dashboards keep their own resource list; the unawaited
        # load is all there is.
        for card in CARDS:
            frontend.add_extra_js_url(hass, f"{base}/{card}")
        return

    if not resources.loaded:
        await resources.async_load()
        resources.loaded = True

    have = {item["url"]: item["id"] for item in resources.async_items()}
    for card in CARDS:
        url = f"{base}/{card}"
        if url not in have:
            await resources.async_create_item({"res_type": "module", "url": url})
        # An entry left at an older version would import stale code next to
        # the current bundle; drop any that are not this release's URL.
        for old_url, item_id in have.items():
            if old_url.endswith(f"/{card}") and old_url != url:
                await resources.async_delete_item(item_id)


async def _async_install_sentences(
    hass: HomeAssistant, install: bool, atv_yaml: str | None = None
) -> None:
    """Put the sentence files where the conversation agent looks for them.

    custom_sentences is read from the configuration directory at startup and
    nowhere else, so an integration cannot register sentences at runtime - it
    can only put the files there and say a restart is needed.

    Turning this off is not a nicety. Home Assistant merges every file in that
    directory, so a house that already answers "remember that ..." with its own
    intent gets two claiming the same phrase, and whichever wins, one of them
    is writing somebody's memory into the wrong database with nothing to say
    so. When the setting is off the files are removed again rather than merely
    not written, or turning it off would do nothing until a reinstall.
    """
    source = Path(__file__).parent / "sentences" / "en"
    target = Path(hass.config.path("custom_sentences", "en"))

    def _sync() -> bool:
        changed = False
        target.mkdir(parents=True, exist_ok=True)
        for path in sorted(source.glob("*.yaml")):
            dest = target / f"{DOMAIN}_{path.name}"
            if not install:
                if dest.exists():
                    dest.unlink()
                    changed = True
                continue
            if dest.exists() and dest.read_bytes() == path.read_bytes():
                continue
            shutil.copyfile(path, dest)
            changed = True
        # The Apple TV file is generated, not copied - it carries this
        # house's room names - and follows its own switch: picking Apple TVs
        # in the options IS the opt-in, so it installs even when the general
        # sentence toggle is off (that toggle exists for houses whose own
        # intents already answer "remember that..." - which says nothing
        # about their Apple TVs). It exists only while Apple TVs are
        # configured: its bare "play {ma_query}" wildcard must not sit on a
        # house with nothing to play on.
        atv_dest = target / f"{DOMAIN}_apple_tv.yaml"
        if atv_yaml is None:
            if atv_dest.exists():
                atv_dest.unlink()
                changed = True
        elif not atv_dest.exists() or atv_dest.read_text() != atv_yaml:
            atv_dest.write_text(atv_yaml)
            changed = True
        return changed

    try:
        changed = await hass.async_add_executor_job(_sync)
    except OSError as err:
        _LOGGER.warning("could not sync voice sentences: %s", err)
        return

    if changed:
        from homeassistant.components import persistent_notification

        persistent_notification.async_create(
            hass,
            (
                "Hubbubb Home installed its voice sentences. Restart Home "
                "Assistant to start using them - everything else already works."
                if install
                else "Hubbubb Home removed its voice sentences. They stop "
                "being matched after the next restart."
            ),
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
    "speak_briefing": vol.Schema(
        {vol.Optional("target"): vol.Any(str, [str])}
    ),
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


def _async_register_webhook(hass: HomeAssistant, runtime: Runtime) -> None:
    """The inbound half of spoken announcements.

    A companion has no Home Assistant credentials, so it cannot fire a bus
    event itself. It POSTs {"message": "..."} to
    /api/webhook/hubbubb_home_message instead, and this relays it onto the bus
    as the event the ring cards listen for - each open dashboard then elects
    one screen to speak it. Local-only: the poster is a machine on the LAN,
    and an unauthenticated path that makes the house talk should not face the
    internet.
    """

    async def _handle(
        hass: HomeAssistant, webhook_id: str, request: web.Request
    ) -> None:
        try:
            data = await request.json()
        except ValueError:
            data = {"message": (await request.text()).strip()}
        if not isinstance(data, dict):
            data = {"message": str(data)}
        if data.get("message"):
            hass.bus.async_fire(EVENT_MESSAGE, data)

    webhook.async_register(
        hass,
        DOMAIN,
        f"{runtime.name} announcements",
        WEBHOOK_MESSAGE,
        _handle,
        local_only=True,
        allowed_methods=["POST"],
    )
    runtime.unsubscribe.append(
        lambda: webhook.async_unregister(hass, WEBHOOK_MESSAGE)
    )


def _since(finding: dict) -> str:
    """' (since 20 August)' - only when it is not the first night."""
    first = finding.get("first_seen")
    today = dt_util.now().date().isoformat()
    if not first or first == today:
        return ""
    return f" (since {dt_util.parse_date(first).strftime('%d %B').lstrip('0')})"


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
    await runtime.findings.async_update(findings)
    _LOGGER.info("overnight sweep: %d finding(s)", len(findings))

    if findings:
        from homeassistant.components import persistent_notification

        body = "\n".join(
            f"- {f['detail']}" + _since(f) for f in findings[:20]
        )
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
                    # End of today, not twenty-four hours out: a duration
                    # window announces tomorrow morning's dentist as "today".
                    "end_date_time": (
                        dt_util.start_of_local_day() + timedelta(days=1)
                    ).isoformat(),
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


async def _announce(
    runtime: Runtime, text: str, target: str | list[str] | None = None
) -> None:
    """Say something out loud, in every room that was asked for.

    Satellites and speakers are announced differently - a satellite ducks and
    resumes whatever it was doing, a media player needs a text-to-speech
    entity to render through - so they are grouped by domain and sent as two
    calls rather than one. Rooms are independent: one unplugged speaker must
    not swallow the announcement everywhere else, so each group is awaited
    separately and a failure is logged rather than raised.
    """
    chosen = target if target is not None else runtime.option(
        "briefing", CONF_BRIEFING_TARGET
    )
    if isinstance(chosen, str):
        chosen = [chosen]
    chosen = [e for e in (chosen or []) if e]
    if not chosen:
        _LOGGER.info("%s had nothing to speak through: %s", runtime.name, text)
        return

    satellites = [e for e in chosen if e.startswith("assist_satellite.")]
    players = [e for e in chosen if e.startswith("media_player.")]

    if satellites:
        await _speak(
            runtime, "assist_satellite", "announce",
            {"entity_id": satellites, "message": text},
        )

    if players:
        engine = runtime.option("briefing", CONF_TTS)
        if not engine:
            _LOGGER.warning(
                "%s cannot speak through %s: no text-to-speech entity is "
                "chosen in the options",
                runtime.name, ", ".join(players),
            )
        else:
            await _speak(
                runtime, "tts", "speak",
                {
                    "entity_id": engine,
                    "media_player_entity_id": players,
                    "message": text,
                },
            )


async def _speak(runtime: Runtime, domain: str, service: str, data: dict) -> None:
    try:
        await runtime.hass.services.async_call(
            domain, service, data, blocking=False
        )
    except HomeAssistantError as err:
        _LOGGER.warning("could not speak through %s: %s", domain, err)
