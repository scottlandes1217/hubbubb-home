"""Everything Hubbubb Home puts on the dashboard hangs off one device.

The device carries the assistant's name, so entity ids personalise themselves:
call it Athena and you get switch.athena_build_mode without anybody editing a
line of YAML.
"""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import Entity

from .const import DOMAIN


class HubbubbEntity(Entity):
    """Base for every entity this integration owns."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, entry: ConfigEntry, name: str) -> None:
        self._entry = entry
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name=name,
            manufacturer="Hubbubb",
            model="Hubbubb Home",
            entry_type=None,
        )
