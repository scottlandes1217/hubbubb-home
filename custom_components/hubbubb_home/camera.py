"""The Mac camera's annotated live view, as a Home Assistant camera.

Home Assistant proxies the stream, so a browser never needs the Mac's token
or address; the panel and any dashboard use the usual camera proxy URLs.
"""

from __future__ import annotations

import aiohttp
from homeassistant.components.camera import Camera
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.aiohttp_client import async_aiohttp_proxy_web
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .entity import HubbubbEntity


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    runtime = hass.data[DOMAIN][entry.entry_id]
    if runtime.camera is not None:
        async_add_entities([HubbubbCamera(entry, runtime)])


class HubbubbCamera(HubbubbEntity, Camera):
    """Live view with people, names and animals boxed."""

    _attr_name = "Camera"
    _attr_icon = "mdi:cctv"

    def __init__(self, entry: ConfigEntry, runtime) -> None:
        HubbubbEntity.__init__(self, entry, runtime.name)
        Camera.__init__(self)
        self._link = runtime.camera
        self._attr_unique_id = f"{entry.entry_id}_camera"

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        self.async_on_remove(self._link.async_add_listener(self._changed))

    @callback
    def _changed(self) -> None:
        self.async_write_ha_state()

    @property
    def available(self) -> bool:
        return self._link.connected

    @property
    def extra_state_attributes(self) -> dict:
        return {
            "people": self._link.state.get("people") or [],
            "animals": self._link.state.get("animals") or [],
        }

    async def async_camera_image(self, width: int | None = None, height: int | None = None) -> bytes | None:
        try:
            async with self._link.session.get(
                self._link.url("snapshot"), headers=self._link.headers, timeout=aiohttp.ClientTimeout(total=10)
            ) as resp:
                return await resp.read() if resp.status == 200 else None
        except (aiohttp.ClientError, TimeoutError):
            return None

    async def handle_async_mjpeg_stream(self, request):
        if not self._link.connected:
            raise HomeAssistantError("The camera on the Mac is not connected")
        stream = self._link.session.get(
            self._link.url("stream"),
            headers=self._link.headers,
            timeout=aiohttp.ClientTimeout(total=None, sock_connect=5),
        )
        return await async_aiohttp_proxy_web(self.hass, request, stream)
