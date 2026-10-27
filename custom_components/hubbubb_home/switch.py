"""The three toggles the ring card reads."""

from __future__ import annotations

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.restore_state import RestoreEntity

from .const import DOMAIN
from .entity import HubbubbEntity

# Settings that live on the Mac camera: key, display name, icon.
CAMERA_SWITCHES = (
    ("follow", "Camera following", "mdi:account-arrow-right"),
    ("auto_zoom", "Camera auto-zoom", "mdi:magnify-plus-outline"),
)

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
    if runtime.camera is not None:
        async_add_entities(
            CameraSwitch(entry, runtime, key, label, icon)
            for key, label, icon in CAMERA_SWITCHES
        )
        async_add_entities([GesturesSwitch(entry, runtime)])


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


class CameraSwitch(HubbubbEntity, SwitchEntity):
    """A camera setting, read from and written to the Mac."""

    def __init__(self, entry: ConfigEntry, runtime, key: str, label: str, icon: str) -> None:
        super().__init__(entry, runtime.name)
        self._link = runtime.camera
        self._key = key
        self._attr_unique_id = f"{entry.entry_id}_camera_{key}"
        self._attr_name = label
        self._attr_icon = icon

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self._link.async_add_listener(self.async_write_ha_state))

    @property
    def available(self) -> bool:
        return self._link.connected

    @property
    def is_on(self) -> bool:
        return bool((self._link.state.get("settings") or {}).get(self._key))

    async def async_turn_on(self, **kwargs) -> None:
        await self._link.async_settings({self._key: True})

    async def async_turn_off(self, **kwargs) -> None:
        await self._link.async_settings({self._key: False})


class GesturesSwitch(HubbubbEntity, SwitchEntity):
    """Every camera gesture on or off - off for meetings. Kept in Home Assistant."""

    _attr_name = "Camera gestures"
    _attr_icon = "mdi:hand-wave"

    def __init__(self, entry: ConfigEntry, runtime) -> None:
        super().__init__(entry, runtime.name)
        self._link = runtime.camera
        self._attr_unique_id = f"{entry.entry_id}_camera_gestures"

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self._link.async_add_listener(self.async_write_ha_state))

    @property
    def is_on(self) -> bool:
        return self._link.gestures_on

    async def async_turn_on(self, **kwargs) -> None:
        await self._link.async_set_gestures_on(True)

    async def async_turn_off(self, **kwargs) -> None:
        await self._link.async_set_gestures_on(False)
