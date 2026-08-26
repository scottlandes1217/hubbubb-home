"""The three toggles the ring card reads."""

from __future__ import annotations

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.restore_state import RestoreEntity

from .const import DOMAIN
from .entity import HubbubbEntity

# key, display name, icon, default
SWITCHES = (
    (
        "build_mode",
        "Build mode",
        "mdi:hammer-wrench",
        False,
    ),
    (
        "agent_announcements",
        "Agent announcements",
        "mdi:bullhorn",
        True,
    ),
    (
        "message_watch",
        "Message watch",
        "mdi:bell-ring",
        False,
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    runtime = hass.data[DOMAIN][entry.entry_id]
    async_add_entities(
        HubbubbSwitch(entry, runtime.name, key, label, icon, default)
        for key, label, icon, default in SWITCHES
    )


class HubbubbSwitch(HubbubbEntity, SwitchEntity, RestoreEntity):
    """A plain remembered toggle - survives a restart, nothing else."""

    def __init__(
        self,
        entry: ConfigEntry,
        device_name: str,
        key: str,
        label: str,
        icon: str,
        default: bool,
    ) -> None:
        super().__init__(entry, device_name)
        self._attr_unique_id = f"{entry.entry_id}_{key}"
        self._attr_name = label
        self._attr_icon = icon
        self._attr_is_on = default

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        if (last := await self.async_get_last_state()) is not None:
            self._attr_is_on = last.state == "on"

    async def async_turn_on(self, **kwargs) -> None:
        self._attr_is_on = True
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs) -> None:
        self._attr_is_on = False
        self.async_write_ha_state()
