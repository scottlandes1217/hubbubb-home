"""Two sensors: the running timers, and what last night's sweep turned up."""

from __future__ import annotations

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .entity import HubbubbEntity


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
        ]
    )


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
