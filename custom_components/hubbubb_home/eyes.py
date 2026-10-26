"""The camera on the companion's Mac, as Home Assistant sees it.

The Mac does the seeing - USB camera, Apple Vision, the vision model - and
serves it on CAMERA_PORT beside the companion, behind the companion's token.
This side holds everything a person configures: what each gesture does is a
list of ordinary Home Assistant actions, run as a script, so a gesture can do
anything an automation can. The Mac never needs Home Assistant credentials:
it only answers, and this side listens to its event feed (a long poll).
"""

from __future__ import annotations

import asyncio
import logging
import time
from datetime import datetime, timedelta
from collections.abc import Callable
from urllib.parse import urlsplit

import aiohttp
import voluptuous as vol
from homeassistant.core import Context, HomeAssistant, ServiceCall, SupportsResponse, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import async_call_later, async_track_state_change_event
from homeassistant.helpers.script import SCRIPT_MODE_PARALLEL, Script, async_validate_actions_config
from homeassistant.helpers.storage import Store

from .companion import CAMERA_PORT
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

GESTURE_EVENT = f"{DOMAIN}_gesture"

# id, title, how to make it, icon. The Mac recognizes exactly these.
GESTURES = (
    ("thumbs_up", "Thumbs up", "Thumb raised, other fingers curled", "mdi:thumb-up"),
    ("thumbs_down", "Thumbs down", "Thumb pointing down, fingers curled", "mdi:thumb-down"),
    ("open_palm", "Open palm", "All five fingers spread, palm to the camera", "mdi:hand-back-right"),
    ("number_1", "One finger", "Index finger up", "mdi:numeric-1-circle"),
    ("number_2", "Two fingers", "Index and middle fingers up", "mdi:numeric-2-circle"),
    ("number_3", "Three fingers", "Index, middle and ring fingers up", "mdi:numeric-3-circle"),
)
TITLES = {g[0]: g[1] for g in GESTURES}

# Panel calls passed straight to the Mac: service -> (method, path).
PASSTHROUGH = {
    "camera_state": ("GET", "state"),
    "camera_settings": ("POST", "settings"),
    "camera_pan": ("POST", "pan"),
    "camera_enroll": ("POST", "enroll"),
    "camera_forget_person": ("POST", "forget_person"),
    "camera_items": ("GET", "items"),
    "camera_forget_item": ("POST", "forget_item"),
    "camera_learn": ("POST", "learn"),
    "camera_room_reset": ("POST", "room_reset"),
    "camera_look": ("POST", "look"),
}

GESTURE_SCHEMA = vol.Schema(
    {
        vol.Required("gesture"): vol.In(TITLES),
        vol.Optional("enabled", default=True): bool,
        vol.Optional("repeat", default=False): bool,
        vol.Optional("people", default=[]): [str],
        vol.Optional("actions", default=[]): list,
    }
)


# The puck's states, as the camera's moods.
SATELLITE_MOODS = {"listening": "listening", "processing": "thinking", "responding": "speaking"}
MOOD_ORDER = ("speaking", "thinking", "listening")
MOOD_COLORS = {"listening": [0, 120, 255], "thinking": [255, 150, 0], "speaking": [0, 220, 200]}
SNAPSHOT_SCENE = "hubbubb_jarvis_lights_before"

JARVIS_SCHEMA = vol.Schema(
    {
        vol.Optional("move", default=True): bool,
        vol.Optional("satellites", default=[]): [cv.entity_id],
        vol.Optional("strength", default=0.6): vol.All(vol.Coerce(float), vol.Range(0, 1)),
        vol.Optional("lights", default=False): bool,
        vol.Optional("light_entities", default=[]): [cv.entity_id],
        vol.Optional("pause_while"): vol.Any(None, cv.entity_id),
        vol.Optional("brightness", default=80): vol.All(vol.Coerce(int), vol.Range(1, 100)),
        vol.Optional("colors", default=MOOD_COLORS): {
            vol.In(tuple(MOOD_COLORS)): vol.All([vol.All(vol.Coerce(int), vol.Range(0, 255))], vol.Length(3, 3))
        },
    }
)


def scene_to_restore(scenes: list[tuple], groups: set[str], lights_changed: datetime | None) -> str | None:
    """The scene the lights are in, if one is: re-activating it beats a colour snapshot.

    scenes: (entity_id, group_name, last activated or None, is_active or None).
    A smart scene that says it is active wins; otherwise the latest-activated
    scene of a group the lights belong to, if that activation is what last
    changed them (later changes mean someone has moved on from it).
    """
    mine = [s for s in scenes if s[1] in groups]
    for entity_id, _group, _when, active in mine:
        if active:
            return entity_id
    dated = [(when, entity_id) for entity_id, _g, when, _a in mine if when]
    if not dated:
        return None
    when, entity_id = max(dated)
    if lights_changed is None or when >= lights_changed - timedelta(seconds=15):
        return entity_id
    return None


def mood_for(states: list[str]) -> str:
    """The mood for several pucks at once: the busiest one wins."""
    moods = {SATELLITE_MOODS.get(s) for s in states}
    return next((m for m in MOOD_ORDER if m in moods), "idle")


def gesture_allowed(config: dict | None, person: str | None, held: bool) -> bool:
    """Whether a recognized gesture should run its actions.

    A held repeat only counts for gestures set to repeat (volume); a gesture
    limited to some people ignores everyone else, including the unrecognized.
    """
    if not config or not config.get("enabled", True) or not config.get("actions"):
        return False
    if held and not config.get("repeat"):
        return False
    people = [p.lower() for p in config.get("people") or []]
    return not people or (person or "").lower() in people


class CameraLink:
    """One Mac camera: its latest state, its event feed, and the gestures' actions."""

    def __init__(self, hass: HomeAssistant, session, companion_url: str, token: str | None, speakers) -> None:
        self.hass = hass
        self._session = session
        self._base = f"http://{urlsplit(companion_url).hostname}:{CAMERA_PORT}"
        self.headers = {"Authorization": f"Bearer {token}"} if token else {}
        self._speakers = speakers
        self._store = Store(hass, 1, f"{DOMAIN}.gestures")
        self.gestures: dict[str, dict] = {}
        self._scripts: dict[str, Script] = {}
        self.state: dict = {}
        self.connected = False
        self.last_gesture: dict | None = None
        self._listeners: list[Callable[[], None]] = []
        self.jarvis: dict = {}

    def url(self, path: str) -> str:
        return f"{self._base}/{path.lstrip('/')}"

    @property
    def session(self):
        return self._session

    @callback
    def async_add_listener(self, listener: Callable[[], None]) -> Callable[[], None]:
        self._listeners.append(listener)
        return lambda: self._listeners.remove(listener)

    @callback
    def _changed(self) -> None:
        for listener in list(self._listeners):
            listener()

    async def async_request(self, method: str, path: str, payload: dict | None = None, timeout: float = 15) -> dict:
        try:
            async with self._session.request(
                method,
                self.url(path),
                json=payload if method != "GET" else None,
                headers=self.headers,
                timeout=aiohttp.ClientTimeout(total=timeout),
            ) as resp:
                data = await resp.json(content_type=None)
                if resp.status >= 400:
                    raise HomeAssistantError(
                        (data or {}).get("detail") or f"the camera answered {resp.status}"
                    )
                return data if isinstance(data, dict) else {}
        except (aiohttp.ClientError, asyncio.TimeoutError, ValueError) as err:
            raise HomeAssistantError(
                "The camera on the Mac is not answering - is Hubbubb Local Camera running?"
            ) from err

    async def async_settings(self, changes: dict) -> None:
        self.state = await self.async_request("POST", "settings", changes)
        self._changed()

    # --- the gestures' actions ------------------------------------------------

    async def async_load(self) -> None:
        stored = await self._store.async_load() or {}
        self.gestures = stored.get("gestures") or {}
        self.jarvis = JARVIS_SCHEMA(stored.get("jarvis") or {})
        if "pause_while" not in (stored.get("jarvis") or {}):
            # A Hue Sync Box owns its lights while syncing; stay out of its way.
            self.jarvis["pause_while"] = next(
                (e.entity_id for e in er.async_get(self.hass).entities.values()
                 if e.platform == "huesyncbox" and e.entity_id.endswith("_light_sync")),
                None,
            )
        if stored.get("imported"):
            return
        # First run: bring over what the old windowed app had hard-coded, so
        # nothing changes until someone edits it.
        try:
            legacy = await self.async_request("GET", "legacy_actions")
        except HomeAssistantError:
            return  # try again next start
        for gesture, config in (legacy.get("gestures") or {}).items():
            if gesture in TITLES and gesture not in self.gestures:
                self.gestures[gesture] = {"enabled": True, "people": [], **config}
        await self._save()

    async def async_save_gesture(self, data: dict) -> dict:
        data = GESTURE_SCHEMA(data)
        try:
            actions = await async_validate_actions_config(self.hass, cv.SCRIPT_SCHEMA(data["actions"]))
        except vol.Invalid as err:
            raise HomeAssistantError(f"Those actions are not valid: {err}") from err
        del actions  # validated; the raw form is what the editor round-trips
        config = {k: data[k] for k in ("enabled", "repeat", "people", "actions")}
        self.gestures[data["gesture"]] = config
        self._scripts.pop(data["gesture"], None)
        await self._save()
        return config

    async def _save(self) -> None:
        await self._store.async_save({"gestures": self.gestures, "imported": True, "jarvis": self.jarvis})

    async def _script(self, gesture: str) -> Script | None:
        if gesture not in self._scripts:
            config = self.gestures.get(gesture) or {}
            if not config.get("actions"):
                return None
            actions = await async_validate_actions_config(self.hass, cv.SCRIPT_SCHEMA(config["actions"]))
            self._scripts[gesture] = Script(
                self.hass,
                actions,
                f"Gesture: {TITLES.get(gesture, gesture)}",
                DOMAIN,
                script_mode=SCRIPT_MODE_PARALLEL,
                max_runs=10,
                logger=_LOGGER,
            )
        return self._scripts[gesture]

    async def async_run_gesture(self, gesture: str, person: str | None = None, held: bool = False) -> None:
        script = await self._script(gesture)
        if script is None:
            return
        # Background, so a slow action (a Sync Box switch, screen mirroring)
        # never holds up the next gesture in the feed.
        self.hass.async_create_background_task(
            script.async_run(
                run_variables={"gesture": gesture, "person": person, "held": held},
                context=Context(),
            ),
            f"{DOMAIN} gesture {gesture}",
        )

    async def _gesture(self, event: dict) -> None:
        gesture = event.get("gesture")
        if gesture not in TITLES:
            return
        person = event.get("person") or None
        held = bool(event.get("held"))
        # Every recognition is also a plain event, for anyone who would rather
        # write an automation than use the panel.
        self.hass.bus.async_fire(GESTURE_EVENT, {"gesture": gesture, "person": person, "held": held})
        if not held:
            self.last_gesture = {"gesture": gesture, "person": person, "ts": event.get("ts")}
            self._changed()
        if gesture_allowed(self.gestures.get(gesture), person, held):
            await self.async_run_gesture(gesture, person, held)

    # --- the feed -------------------------------------------------------------

    async def async_run(self) -> None:
        """Follow the Mac's event feed for as long as the entry is loaded."""
        seq = 0
        while True:
            try:
                if not self.connected:
                    self.state = await self.async_request("GET", "state")
                    self.connected = True
                    self._changed()
                feed = await self.async_request("GET", f"events?after={seq}", timeout=40)
            except HomeAssistantError:
                if self.connected:
                    self.connected = False
                    self._changed()
                await asyncio.sleep(10)
                continue
            seq = int(feed.get("seq") or 0)
            for event in feed.get("events") or []:
                kind = event.get("type")
                if kind == "gesture":
                    await self._gesture(event)
                elif kind == "presence":
                    self._speakers.saw(event.get("people") or [])
                    self.state = {**self.state, "people": event.get("people") or [], "animals": event.get("animals") or []}
                    self._changed()
                elif kind == "settings":
                    try:
                        self.state = await self.async_request("GET", "state")
                    except HomeAssistantError:
                        pass
                    self._changed()


class JarvisPresence:
    """The camera's body language and the room's lights, following the pucks.

    Listening, thinking and speaking move the camera a few degrees and, when
    chosen, tint some lights; idle puts both back. The lights are snapshotted
    into a scene first and restored from it, so they return to exactly what
    they were - including off.
    """

    def __init__(self, hass: HomeAssistant, link: CameraLink) -> None:
        self.hass = hass
        self.link = link
        self.mood = "idle"
        self._unsub: Callable[[], None] | None = None
        self._watchdog: Callable[[], None] | None = None
        self._snapshot = False
        # A restore waiting out the gap between Jarvis finishing and listening
        # again for a follow-up; and one mood change at a time.
        self._pending_restore: Callable[[], None] | None = None
        self._lock = asyncio.Lock()
        # What to put back: a scene to re-activate, else the colour snapshot.
        self._scene: str | None = None
        self._restored_at = 0.0

    @property
    def satellites(self) -> list[str]:
        return self.link.jarvis.get("satellites") or self.hass.states.async_entity_ids("assist_satellite")

    @callback
    def async_start(self) -> Callable[[], None]:
        """(Re)subscribe to the chosen pucks. Returns the unsubscribe."""
        self.async_stop()
        if self.satellites:
            self._unsub = async_track_state_change_event(self.hass, self.satellites, self._changed)
        return self.async_stop

    @callback
    def async_stop(self) -> None:
        if self._unsub:
            self._unsub()
            self._unsub = None

    @callback
    def _changed(self, event) -> None:
        states = [getattr(self.hass.states.get(e), "state", "") for e in self.satellites]
        mood = mood_for(states)
        if mood != self.mood:
            self.hass.async_create_background_task(self.async_apply(mood), f"{DOMAIN} jarvis {mood}")

    async def async_apply(self, mood: str) -> None:
        async with self._lock:
            await self._apply(mood)

    async def _apply(self, mood: str) -> None:
        self.mood = mood
        if self._watchdog:
            self._watchdog()
            self._watchdog = None
        if mood != "idle":
            # A missed "idle" (puck rebooted) must not leave the room tinted.
            self._watchdog = async_call_later(self.hass, 90, self._reset)
        config = self.link.jarvis
        if config.get("move"):
            try:
                await self.link.async_request("POST", "mood", {"mood": mood, "strength": config.get("strength", 0.6)}, timeout=5)
            except HomeAssistantError:
                pass  # the camera being away must never hold up the lights
        if config.get("lights") and config.get("light_entities"):
            await self._lights(mood, config)

    @callback
    def _restore(self, _now=None) -> None:
        self._pending_restore = None
        if self.mood != "idle" or not self._snapshot:
            return
        self._snapshot = False
        self._restored_at = time.monotonic()
        # A scene comes back as a scene (an animated one starts animating
        # again); otherwise the colours exactly as they were.
        target = self._scene or f"scene.{SNAPSHOT_SCENE}"
        self.hass.async_create_background_task(
            self.hass.services.async_call("scene", "turn_on", {"entity_id": target, "transition": 1}),
            f"{DOMAIN} jarvis lights restore",
        )

    def _active_scene(self, entities: list[str]) -> str | None:
        """Which scene the lights are in now, from the scenes Home Assistant knows."""
        states = self.hass.states
        lights = [states.get(e) for e in entities]
        changed = max((l.last_changed for l in lights if l), default=None)
        # Hue rooms and zones containing any of these lights, by name - the
        # same name a Hue scene gives as its group_name.
        groups = {
            g.name for g in states.async_all("light")
            if g.attributes.get("is_hue_group") and set(g.attributes.get("entity_id") or []) & set(entities)
        }
        scenes = []
        for st in states.async_all("scene"):
            when = None
            if st.state not in ("unknown", "unavailable", ""):
                try:
                    when = datetime.fromisoformat(st.state)
                except ValueError:
                    pass
            scenes.append((st.entity_id, st.attributes.get("group_name"), when, st.attributes.get("is_active")))
        return scene_to_restore(scenes, groups, changed)

    @callback
    def _reset(self, _now=None) -> None:
        self._watchdog = None
        self.hass.async_create_background_task(self.async_apply("idle"), f"{DOMAIN} jarvis reset")

    async def _lights(self, mood: str, config: dict) -> None:
        entities = config["light_entities"]
        if mood == "idle":
            # Not yet: a follow-up question goes idle -> listening within a
            # second. Restoring then and re-snapshotting would save Jarvis's
            # own colour as "before" - the lights would never come back.
            if self._snapshot and not self._pending_restore:
                self._pending_restore = async_call_later(self.hass, 2.5, self._restore)
            return
        if self._pending_restore:
            self._pending_restore()  # still the same conversation
            self._pending_restore = None
        pause = config.get("pause_while")
        if pause and self.hass.states.is_state(pause, "on"):
            return
        if not self._snapshot:
            # Back within 15 s of putting them back: they may still be fading
            # from Jarvis's colour, so keep what was saved rather than save that.
            if time.monotonic() - self._restored_at > 15:
                self._scene = self._active_scene(entities)
                await self.hass.services.async_call(
                    "scene", "create", {"scene_id": SNAPSHOT_SCENE, "snapshot_entities": entities}, blocking=True
                )
            self._snapshot = True
        await self.hass.services.async_call(
            "light",
            "turn_on",
            {
                "entity_id": entities,
                "rgb_color": (config.get("colors") or MOOD_COLORS).get(mood, MOOD_COLORS[mood]),
                "brightness_pct": config.get("brightness", 80),
                "transition": 0.4,
            },
            blocking=False,
        )


def async_register_services(hass: HomeAssistant, link: CameraLink, presence: JarvisPresence) -> list[str]:
    """The panel's calls, plus the two actions a gesture or automation may use."""

    def _passthrough(method: str, path: str):
        async def _call(call: ServiceCall):
            # Looking and learning ask the vision model, which takes a while.
            return await link.async_request(method, path, dict(call.data), timeout=150)

        return _call

    for service, (method, path) in PASSTHROUGH.items():
        hass.services.async_register(DOMAIN, service, _passthrough(method, path), supports_response=SupportsResponse.ONLY)

    async def gestures_get(call: ServiceCall):
        return {
            "catalog": [{"id": g, "title": t, "how": how, "icon": icon} for g, t, how, icon in GESTURES],
            "gestures": link.gestures,
            "last": link.last_gesture,
        }

    async def gesture_save(call: ServiceCall):
        return {"saved": await link.async_save_gesture(dict(call.data))}

    async def gesture_test(call: ServiceCall):
        await link.async_run_gesture(call.data["gesture"], call.data.get("person"))

    async def mac_screen_sharing(call: ServiceCall):
        reply = await link.async_request("POST", "screen_sharing", {"on": call.data["on"]}, timeout=60)
        if reply.get("ok") is False:
            raise HomeAssistantError(reply.get("detail") or "Screen mirroring did not change")
        return reply

    async def jarvis_get(call: ServiceCall):
        return {"config": link.jarvis, "satellites": presence.satellites, "mood": presence.mood}

    async def jarvis_save(call: ServiceCall):
        try:
            link.jarvis = JARVIS_SCHEMA(dict(call.data))
        except vol.Invalid as err:
            raise HomeAssistantError(f"Not a valid setting: {err}") from err
        await link._save()
        presence.async_start()
        return {"config": link.jarvis}

    async def jarvis_test(call: ServiceCall):
        """Play one mood for a few seconds, then put everything back."""
        await presence.async_apply(call.data["mood"])
        async_call_later(hass, 4, presence._reset)

    hass.services.async_register(DOMAIN, "jarvis_presence_get", jarvis_get, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, "jarvis_presence_save", jarvis_save, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(
        DOMAIN, "jarvis_presence_test", jarvis_test,
        schema=vol.Schema({vol.Required("mood"): vol.In(MOOD_ORDER)}),
    )
    hass.services.async_register(DOMAIN, "gestures_get", gestures_get, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(DOMAIN, "gesture_save", gesture_save, supports_response=SupportsResponse.ONLY)
    hass.services.async_register(
        DOMAIN, "gesture_test", gesture_test,
        schema=vol.Schema({vol.Required("gesture"): vol.In(TITLES), vol.Optional("person"): str}),
    )
    hass.services.async_register(
        DOMAIN, "mac_screen_sharing", mac_screen_sharing,
        schema=vol.Schema({vol.Required("on"): cv.boolean}),
        supports_response=SupportsResponse.OPTIONAL,
    )
    return [*PASSTHROUGH, "gestures_get", "gesture_save", "gesture_test", "mac_screen_sharing",
            "jarvis_presence_get", "jarvis_presence_save", "jarvis_presence_test"]
