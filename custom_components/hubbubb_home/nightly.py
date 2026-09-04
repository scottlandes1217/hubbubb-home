"""The overnight sweep and the morning briefing.

The failure this looks for is not a thing breaking loudly. It is a thing going
quiet - a television that reports `off` rather than `unavailable` when its
token dies, a sensor that keeps returning its last value after the battery
goes. Nothing alerts on those, and they are noticed days later.

Three checks. The first two survive being moved to somebody else's house;
the third is this house's own configuration, and only fires where those files
exist:

  dead   Parked at unavailable/unknown for longer than a few hours.
  quiet  Used to change on most days and now changes on none.
  drift  Configuration that has to hold a value and no longer does. Ported
         from the Mac's jarvis-watchdog on 2026-09-04 - it ran the identical
         dead/quiet thresholds on the same 03:30 schedule, so one house had
         two sweeps reporting two different numbers.

Aggregation happens in Python rather than SQL because a recorder can be
SQLite, MariaDB or PostgreSQL, and date bucketing is spelled differently in
all three. It runs once a night in an executor - the extra rows cost less than
three dialects of the same query.

Nothing here changes anything. It proposes, and the morning says what is
waiting.
"""

from __future__ import annotations

import fnmatch
import logging
import re
from collections import defaultdict
from datetime import timedelta
from typing import Any

from homeassistant.components.recorder import get_instance, history
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

# Entities parked in a bad state for less than this are mid-restart, not dead.
DEAD_HOURS = 6
# How far back "used to vary" reaches, and how recently "now" starts.
WINDOW_DAYS = 14
RECENT_DAYS = 2
# Fewer varied days than this and there was never a pattern to lose.
MIN_VARIED_DAYS = 3

# Domains that are *supposed* to sit still, or whose state is a timestamp that
# moves for reasons that say nothing about the health of anything.
QUIET_SKIP = (
    "automation.", "script.", "scene.", "button.", "input_", "timer.",
    "person.", "device_tracker.", "zone.", "update.", "todo.", "tag.",
    "conversation.", "schedule.", "sensor.sun_", "sensor.backup_",
    "assist_satellite.", "stt.", "tts.", "wake_word.",
)


class FindingsReport:
    """What the sweep turned up, kept across nights and across restarts.

    Holding this in memory only was a real defect: every sweep overwrote the
    last, a restart erased it, and a fault found on Tuesday and not acted on
    was gone by Wednesday - which teaches people to stop listening. Findings
    now persist, and one that is still true keeps the date it was first seen,
    so "offline since the twentieth" is sayable instead of a fresh alarm every
    single night about the same dead bulb.
    """

    def __init__(self, hass: HomeAssistant) -> None:
        self._store = Store(hass, 1, f"{DOMAIN}.findings")
        self._listeners: list[CALLBACK_TYPE] = []
        self.items: list[dict] = []
        self.last_run: str | None = None

    @property
    def summary(self) -> str:
        return self.spoken("")

    @staticmethod
    def _key(finding: dict) -> tuple:
        return (finding.get("kind"), finding.get("entity_id"))

    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        self.items = data.get("items", [])
        self.last_run = data.get("last_run")

    @callback
    def async_add_listener(self, update: CALLBACK_TYPE) -> CALLBACK_TYPE:
        self._listeners.append(update)

        def _remove() -> None:
            self._listeners.remove(update)

        return _remove

    async def async_update(self, items: list[dict]) -> None:
        """Replace the findings, carrying first_seen forward for survivors."""
        previous = {self._key(f): f for f in self.items}
        today = dt_util.now().date().isoformat()
        for finding in items:
            old = previous.get(self._key(finding))
            finding["first_seen"] = (old or {}).get("first_seen") or today

        self.items = items
        self.last_run = dt_util.now().isoformat()
        await self._store.async_save(
            {"items": self.items, "last_run": self.last_run}
        )
        for listener in self._listeners:
            listener()

    def spoken(self, name: str) -> str:
        """One sentence, for the briefing."""
        if not self.items:
            return "Nothing went quiet overnight."
        dead = sum(1 for f in self.items if f["kind"] == "dead")
        quiet = sum(1 for f in self.items if f["kind"] == "quiet")
        drift = sum(1 for f in self.items if f["kind"] == "drift")
        parts = []
        if dead:
            parts.append(f"{dead} {'thing' if dead == 1 else 'things'} offline")
        if quiet:
            parts.append(
                f"{quiet} {'has' if quiet == 1 else 'have'} gone quiet"
            )
        if drift:
            parts.append(
                f"{drift} configuration {'problem' if drift == 1 else 'problems'}"
            )
        sentence = "Overnight I found " + " and ".join(parts) + "."
        # Anything carried over is the more useful fact: it says nobody has
        # dealt with it, which a nightly count never does.
        today = dt_util.now().date().isoformat()
        carried = sum(
            1 for f in self.items if f.get("first_seen") and f["first_seen"] != today
        )
        if carried:
            sentence += f" {carried} of them {'was' if carried == 1 else 'were'} there yesterday too."
        return sentence


def _ignored(entity_id: str, patterns: list[str]) -> bool:
    return any(fnmatch.fnmatch(entity_id, p) for p in patterns)


async def async_sweep(
    hass: HomeAssistant,
    ignore: list[str] | None = None,
    drift: bool = True,
    repair: bool = True,
) -> list[dict]:
    """Run all three checks. Returns findings worst-first.

    Read-only except for one repair: a newly paired Hue bulb missing from the
    all-lights group is added to it, because that failure is silent - "turn
    off all the lights" leaves the new bulb burning and still says it turned
    everything off.
    """
    ignore = ignore or []
    findings = _check_dead(hass, ignore)
    findings.extend(await _check_quiet(hass, ignore))
    if drift:
        findings.extend(await _check_drift(hass, ignore, repair))
    return findings


# The all-lights group's entity list, so a newly paired bulb can be merged in.
GROUP_ENTITIES = re.compile(
    r"(unique_id: jarvis_all_lights\n\s*entities:\n)((?:\s*- light\.\S+\n)+)"
)


def group_with(conf: str, missing: list[str]) -> str | None:
    """configuration.yaml with `missing` merged into the all_lights group.

    None if the entity list is not where we expect. Pure text, so it is
    testable without a Home Assistant or a reload.
    """
    match = GROUP_ENTITIES.search(conf)
    if not match:
        return None
    indent = re.match(r"\s*", match.group(2)).group(0)
    merged = sorted(
        set(re.findall(r"- (light\.\S+)", match.group(2))) | set(missing)
    )
    block = "".join(f"{indent}- {entity}\n" for entity in merged)
    return conf[: match.start(2)] + block + conf[match.end(2) :]


async def _check_drift(
    hass: HomeAssistant, ignore: list[str], repair: bool = True
) -> list[dict]:
    """Configuration that has to hold a value. Each of these has burned us.

    `repair` is the only thing in this module that writes to the config
    directory, so it is a setting rather than an assumption.
    """
    out: list[dict] = []

    # Arlo cameras cannot be read by go2rtc natively; the option is the only
    # thing keeping live view working.
    for entry in hass.config_entries.async_entries("eisenberg"):
        if entry.options.get("ffmpeg_stream"):
            continue
        out.append(
            {
                "kind": "drift",
                "entity_id": f"config_entry.{entry.entry_id}",
                "name": "Eisenberg live stream",
                "state": "off",
                "days": 0,
                "detail": (
                    "Eisenberg's 'route live stream through ffmpeg' is off. "
                    "go2rtc cannot read these Arlo cameras natively, so live "
                    "view will break."
                ),
            }
        )

    # Every Hue bulb belongs in light.all_lights, or "all the lights" quietly
    # stops meaning all of them.
    entities = er.async_get(hass)
    devices = dr.async_get(hass)
    bulbs = set()
    for entry in entities.entities.values():
        if not entry.entity_id.startswith("light.") or entry.platform != "hue":
            continue
        device = devices.async_get(entry.device_id) if entry.device_id else None
        if device and device.model in ("Room", "Zone"):   # containers, not bulbs
            continue
        if not _ignored(entry.entity_id, ignore):
            bulbs.add(entry.entity_id)

    path = hass.config.path("configuration.yaml")

    def _read() -> str:
        with open(path, encoding="utf-8") as handle:
            return handle.read()

    try:
        conf = await hass.async_add_executor_job(_read)
    except OSError as err:
        _LOGGER.debug("drift: cannot read configuration.yaml (%s)", err)
        return out

    missing = sorted(bulb for bulb in bulbs if bulb not in conf)
    if not missing:
        return out

    detail = "Hue bulbs missing from light.all_lights: " + ", ".join(missing)
    fixed = group_with(conf, missing) if repair else None
    if not repair:
        detail += " (repair is switched off)"
    if fixed is None and repair:
        detail += " (could not find the group's entity list to repair it)"
    elif fixed is not None:
        def _write() -> None:
            with open(path, "w", encoding="utf-8") as handle:
                handle.write(fixed)

        try:
            await hass.async_add_executor_job(_write)
            await hass.services.async_call(
                "homeassistant", "reload_all", blocking=False
            )
            detail = (
                "Added " + ", ".join(missing) + " to light.all_lights and "
                "reloaded - a newly paired Hue bulb was not in the group."
            )
        except (OSError, HomeAssistantError) as err:
            detail += f" (repair failed: {err})"

    out.append(
        {
            "kind": "drift",
            "entity_id": "light.all_lights",
            "name": "All lights group",
            "state": "incomplete",
            "days": 0,
            "detail": detail,
        }
    )
    return out


def _check_dead(hass: HomeAssistant, ignore: list[str]) -> list[dict]:
    """Entities sitting at unavailable/unknown, straight off the state machine.

    No database needed for this one - Home Assistant already knows, and
    last_changed tells us how long it has been true.
    """
    cutoff = dt_util.utcnow() - timedelta(hours=DEAD_HOURS)
    out = []
    for state in hass.states.async_all():
        if state.state not in ("unavailable", "unknown"):
            continue
        if state.last_changed > cutoff or _ignored(state.entity_id, ignore):
            continue
        days = (dt_util.utcnow() - state.last_changed).total_seconds() / 86400
        out.append(
            {
                "kind": "dead",
                "entity_id": state.entity_id,
                "name": state.name,
                "state": state.state,
                "days": round(days, 1),
                "detail": (
                    f"{state.name} has been {state.state} for "
                    f"{_days(days)}."
                ),
            }
        )
    return sorted(out, key=lambda f: -f["days"])


async def _check_quiet(hass: HomeAssistant, ignore: list[str]) -> list[dict]:
    """Entities that varied on most days and now vary on none.

    Counted as days-with-more-than-one-state, never as row counts: a restart
    writes a row for every entity at once, so any threshold on rows measures
    how often Home Assistant restarted, not how alive anything is.
    """
    now = dt_util.utcnow()
    start = now - timedelta(days=WINDOW_DAYS)
    recent_from = now - timedelta(days=RECENT_DAYS)

    candidates = [
        s.entity_id
        for s in hass.states.async_all()
        if not s.entity_id.startswith(QUIET_SKIP)
        and not _ignored(s.entity_id, ignore)
        and s.state not in ("unavailable", "unknown")
    ]
    if not candidates:
        return []

    def _load() -> dict[str, Any]:
        return history.get_significant_states(
            hass,
            start,
            now,
            entity_ids=candidates,
            include_start_time_state=False,
            minimal_response=True,
            no_attributes=True,
        )

    try:
        rows = await get_instance(hass).async_add_executor_job(_load)
    except Exception:  # recorder unavailable or mid-migration
        _LOGGER.exception("could not read history for the overnight sweep")
        return []

    out = []
    for entity_id, states in rows.items():
        # minimal_response returns a State object for the first entry and a
        # bare dict for every one after it - and that dict is keyed
        # `last_changed`, not `last_updated`. Reading only the latter finds
        # nothing at all, silently, which is the exact failure this check
        # exists to catch.
        by_day: dict[Any, set] = defaultdict(set)
        recent_varied = 0
        before_varied = 0
        for item in states:
            if isinstance(item, dict):
                when = item.get("last_changed") or item.get("last_updated")
                value = item.get("state")
            else:
                when = item.last_changed or item.last_updated
                value = item.state
            if when is None or value is None:
                continue
            if isinstance(when, str):
                when = dt_util.parse_datetime(when)
                if when is None:
                    continue
            when = dt_util.as_local(dt_util.as_utc(when))
            by_day[when.date()].add(value)

        for day, values in by_day.items():
            if len(values) < 2:
                continue
            day_start = dt_util.as_utc(
                dt_util.start_of_local_day(day)
            )
            if day_start >= recent_from:
                recent_varied += 1
            else:
                before_varied += 1

        if recent_varied or before_varied < MIN_VARIED_DAYS:
            continue
        state = hass.states.get(entity_id)
        name = state.name if state else entity_id
        out.append(
            {
                "kind": "quiet",
                "entity_id": entity_id,
                "name": name,
                "state": state.state if state else "?",
                "days": before_varied,
                "detail": (
                    f"{name} changed on {before_varied} of the last "
                    f"{WINDOW_DAYS} days and has not changed at all in the "
                    f"last {RECENT_DAYS}. It currently reads "
                    f"{state.state if state else 'nothing'}."
                ),
            }
        )
    return sorted(out, key=lambda f: -f["days"])


def _days(value: float) -> str:
    if value < 1:
        hours = max(1, round(value * 24))
        return f"{hours} hour{'s' if hours != 1 else ''}"
    whole = round(value)
    return f"{whole} day{'s' if whole != 1 else ''}"
