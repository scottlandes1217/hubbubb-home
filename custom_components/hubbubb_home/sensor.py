"""Two sensors: the running timers, and what last night's sweep turned up."""

from __future__ import annotations

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .entity import HubbubbEntity
from .eyes import TITLES


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    runtime = hass.data[DOMAIN][entry.entry_id]
    async_add_entities(
        [
            TimersSensor(entry, runtime),
            FindingsSensor(entry, runtime),
            ReviewSensor(entry, runtime),
        ]
    )
    if runtime.camera is not None:
        async_add_entities([InViewSensor(entry, runtime), GestureSensor(entry, runtime)])


class TimersSensor(HubbubbEntity, SensorEntity):
    """State is how many timers are running; the list is in the attributes."""

    _attr_name = "Timers"
    _attr_icon = "mdi:timer-outline"

    def __init__(self, entry: ConfigEntry, runtime) -> None:
        super().__init__(entry, runtime.name)
        self._runtime = runtime
        self._attr_unique_id = f"{entry.entry_id}_timers"

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            self._runtime.timers.async_add_listener(self._changed)
        )

    @callback
    def _changed(self) -> None:
        self.async_write_ha_state()

    @property
    def native_value(self) -> int:
        return len(self._runtime.timers.timers)

    @property
    def extra_state_attributes(self) -> dict:
        return {"timers": self._runtime.timers.as_list()}


class FindingsSensor(HubbubbEntity, SensorEntity):
    """What the overnight sweep found, ready for the morning briefing."""

    _attr_name = "Findings"
    _attr_icon = "mdi:clipboard-search-outline"

    def __init__(self, entry: ConfigEntry, runtime) -> None:
        super().__init__(entry, runtime.name)
        self._runtime = runtime
        self._attr_unique_id = f"{entry.entry_id}_findings"

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            self._runtime.findings.async_add_listener(self._changed)
        )

    @callback
    def _changed(self) -> None:
        self.async_write_ha_state()

    @property
    def native_value(self) -> int:
        return len(self._runtime.findings.items)

    @property
    def extra_state_attributes(self) -> dict:
        report = self._runtime.findings
        return {
            "findings": report.items,
            "last_run": report.last_run,
            "summary": report.summary,
        }


class ReviewSensor(HubbubbEntity, SensorEntity):
    """What the nightly review of the code found, and what it staged."""

    _attr_name = "Review"
    _attr_icon = "mdi:clipboard-text-search-outline"

    def __init__(self, entry: ConfigEntry, runtime) -> None:
        super().__init__(entry, runtime.name)
        self._runtime = runtime
        self._attr_unique_id = f"{entry.entry_id}_review"

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            self._runtime.review.async_add_listener(self._changed)
        )

    @callback
    def _changed(self) -> None:
        self.async_write_ha_state()

    @property
    def native_value(self) -> int | None:
        return self._runtime.review.findings

    @property
    def extra_state_attributes(self) -> dict:
        review = self._runtime.review
        return {
            "report": review.report,
            "drafts": review.drafts,
            "draft_count": len(review.drafts),
            "last_run": review.last_run,
            "detail": review.detail,
            "summary": review.spoken(),
            # A copy, not the live list: decisions mutate it in place, and HA
            # diffs new attributes against the ones it already holds. Handing
            # it the same object made every decision invisible to dashboards
            # until a reload (the counters changed, the list "did not").
            "proposals": [dict(p) for p in review.proposals],
            "pending": len(review.by_status("pending")),
            "accepted": len(review.by_status("accepted")),
        }


class InViewSensor(HubbubbEntity, SensorEntity):
    """Who the camera recognizes right now; animals in the attributes."""

    _attr_name = "In view"
    _attr_icon = "mdi:account-eye"

    def __init__(self, entry: ConfigEntry, runtime) -> None:
        super().__init__(entry, runtime.name)
        self._link = runtime.camera
        self._attr_unique_id = f"{entry.entry_id}_camera_in_view"

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self._link.async_add_listener(self.async_write_ha_state))

    @property
    def available(self) -> bool:
        return self._link.connected

    @property
    def native_value(self) -> str:
        return ", ".join(self._link.state.get("people") or []) or "nobody"

    @property
    def extra_state_attributes(self) -> dict:
        return {
            "people": self._link.state.get("people") or [],
            "animals": self._link.state.get("animals") or [],
        }


class GestureSensor(HubbubbEntity, SensorEntity):
    """The last gesture recognized, and who made it."""

    _attr_name = "Last gesture"
    _attr_icon = "mdi:hand-wave"

    def __init__(self, entry: ConfigEntry, runtime) -> None:
        super().__init__(entry, runtime.name)
        self._link = runtime.camera
        self._attr_unique_id = f"{entry.entry_id}_camera_last_gesture"

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self._link.async_add_listener(self.async_write_ha_state))

    @property
    def native_value(self) -> str | None:
        last = self._link.last_gesture
        return TITLES.get(last["gesture"]) if last else None

    @property
    def extra_state_attributes(self) -> dict:
        last = self._link.last_gesture or {}
        return {"gesture": last.get("gesture"), "person": last.get("person")}
