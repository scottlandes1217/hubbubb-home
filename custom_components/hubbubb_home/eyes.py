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
import math
import re
import time
from array import array
from datetime import UTC, datetime, timedelta
from collections.abc import Awaitable, Callable
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
from homeassistant.util.ulid import ulid_now

from .companion import CAMERA_PORT
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

GESTURE_EVENT = f"{DOMAIN}_gesture"
PET_EVENT = f"{DOMAIN}_pet_waiting"

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
# Gestures someone taught the camera from scratch: "custom_peace_sign".
CUSTOM_GESTURE = re.compile(r"^custom_[a-z0-9_]{1,40}$")


def valid_gesture(gesture) -> str:
    """A built-in gesture id or a taught custom one, for schemas."""
    if gesture in TITLES or (isinstance(gesture, str) and CUSTOM_GESTURE.match(gesture)):
        return gesture
    raise vol.Invalid(f"unknown gesture {gesture!r}")

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
    "camera_gesture_teach": ("POST", "gesture_teach"),
    "camera_gesture_forget": ("POST", "gesture_forget"),
    "camera_drag": ("POST", "drag"),
    "camera_focus": ("POST", "focus"),
    "camera_pets": ("GET", "pets"),
    "camera_pets_save": ("POST", "pets"),
    "camera_pet_spot": ("POST", "pet_spot"),
}

GESTURE_SCHEMA = vol.Schema(
    {
        vol.Required("gesture"): valid_gesture,
        vol.Optional("enabled", default=True): bool,
        vol.Optional("repeat", default=False): bool,
        vol.Optional("people", default=[]): [str],
        vol.Optional("actions", default=[]): list,
    }
)


# The puck's states, as the camera's moods.
SATELLITE_MOODS = {"listening": "listening", "processing": "thinking", "responding": "speaking"}
MOOD_ORDER = ("speaking", "thinking", "listening")
# No colour, ever: a tint that leaked into a snapshot or restore came back as
# a green lamp minutes later. Listening dims, thinking breathes, speaking
# follows the loudness of Jarvis's own voice; the lamp keeps its colour.
PULSE_SECONDS = 0.7
VOICE_STEP = 0.2  # one lamp change per 200 ms of speech - the Hue bridge takes ~10 commands/s
# Calibration knobs: from the reply being ready (TTS_END) to sound out of the
# puck; announcements play the 2.1 s preannounce chime first. Tune by eye.
VOICE_DELAY = 0.4
PREANNOUNCE_SECONDS = 2.1
TTS_TOKEN = re.compile(r"(?:tts_proxy|-stream-)/([A-Za-z0-9_-]+)")
SNAPSHOT_SCENE = "hubbubb_jarvis_lights_before"

JARVIS_SCHEMA = vol.Schema(
    {
        vol.Optional("move", default=True): bool,
        vol.Optional("satellites", default=[]): [cv.entity_id],
        vol.Optional("strength", default=0.6): vol.All(vol.Coerce(float), vol.Range(0, 1)),
        vol.Optional("lights", default=False): bool,
        vol.Optional("light_entities", default=[]): [cv.entity_id],
        vol.Optional("pause_while"): vol.Any(None, cv.entity_id),
        # Only used when the light was off: the level it comes on at.
        vol.Optional("brightness", default=80): vol.All(vol.Coerce(int), vol.Range(1, 100)),
    },
    extra=vol.REMOVE_EXTRA,  # stored configs still carry the old "colors"
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


def reapply(entity_id: str, state: str, attributes: dict) -> tuple[str, dict]:
    """The light service call that puts a light back to a recorded state."""
    if state != "on":
        return "turn_off", {"entity_id": entity_id}
    data: dict = {"entity_id": entity_id, "transition": 0.5}
    if attributes.get("brightness") is not None:
        data["brightness"] = attributes["brightness"]
    mode = attributes.get("color_mode")
    if mode == "color_temp" and attributes.get("color_temp_kelvin"):
        data["color_temp_kelvin"] = attributes["color_temp_kelvin"]
    elif attributes.get("xy_color"):
        data["xy_color"] = attributes["xy_color"]
    elif attributes.get("rgb_color"):
        data["rgb_color"] = attributes["rgb_color"]
    return "turn_on", data


def envelope(pcm: bytes, rate: int, step: float = VOICE_STEP) -> list[float]:
    """Loudness 0..1 per step of 16-bit mono PCM, against the clip's own loud
    parts (90th percentile), so a quiet voice still swings the lamp fully."""
    n = int(rate * step) * 2
    rms = []
    for i in range(0, len(pcm) - 1, n):
        chunk = array("h", pcm[i:i + n - (len(pcm[i:i + n]) % 2)])
        rms.append(math.sqrt(sum(x * x for x in chunk) / len(chunk)) if chunk else 0.0)
    loud = sorted(rms)[int(len(rms) * 0.9)] if rms else 0
    return [min(1.0, r / loud) if loud else 0.0 for r in rms]


def mood_levels(base: int) -> tuple[int, int]:
    """(bright, dim) brightness_pct around the light's own level, so a lamp
    dimmed for the night stays dim-ish and a bright one still visibly moves."""
    return min(100, base + 30), max(5, base // 2)


def commands_lights(data: dict, targets: set[str]) -> bool:
    """Whether a call_service event's call can change these lights."""
    if data.get("domain") == "scene":
        return data.get("service") in ("turn_on", "apply")
    service_data = data.get("service_data") or {}
    ids = service_data.get("entity_id")
    if not ids:
        return True  # an area, a device, or every light
    ids = {ids} if isinstance(ids, str) else set(ids)
    return bool(ids & targets) or "all" in ids


def is_adaptive_lighting(context) -> bool:
    """Adaptive Lighting marks its own calls with ':al:' in the context id."""
    return ":al:" in (context.id or "")


def hands_back(data: dict) -> bool:
    """Whether an adaptive_lighting call gives lights back to it ("natural")."""
    service_data = data.get("service_data") or {}
    if data.get("service") == "set_manual_control":
        return service_data.get("manual_control") is False
    return data.get("service") == "apply"


def adaptive_calls(switch: str, lights: list[str]) -> list[tuple]:
    """Take lights off manual and let Adaptive Lighting set them now."""
    return [
        ("adaptive_lighting", "set_manual_control", {"entity_id": switch, "lights": lights, "manual_control": False}),
        ("adaptive_lighting", "apply", {"entity_id": switch, "lights": lights, "transition": 1}),
    ]


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


def pet_message(pet: str, spot: str, minutes) -> str:
    """What Jarvis says when a pet has waited at a marked spot (a door)."""
    place = spot.strip()
    if not place.lower().startswith("the "):
        place = f"the {place}"
    waited = f" for {minutes} minutes" if minutes else ""
    return f"{pet} has been waiting at {place}{waited}. {pet} may need to go out."


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
        # Master switch: off (a meeting, talking with your hands) ignores every gesture.
        self.gestures_on = True
        self._scripts: dict[str, Script] = {}
        self.state: dict = {}
        self.connected = False
        self.last_gesture: dict | None = None
        self._listeners: list[Callable[[], None]] = []
        self.jarvis: dict = {}
        # Speaks through the house's announcement policy; set by the entry.
        self.announce: Callable[[str], Awaitable[None]] | None = None

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
        self.gestures_on = stored.get("gestures_on", True)
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

    async def async_set_gestures_on(self, on: bool) -> None:
        self.gestures_on = on
        await self._save()
        self._changed()

    async def _save(self) -> None:
        await self._store.async_save(
            {"gestures": self.gestures, "gestures_on": self.gestures_on, "imported": True, "jarvis": self.jarvis}
        )

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
        if not self.gestures_on:
            return
        try:
            valid_gesture(gesture)
        except vol.Invalid:
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

    async def _pet_waiting(self, event: dict) -> None:
        pet, spot = event.get("pet") or "Your pet", event.get("spot") or "door"
        self.hass.bus.async_fire(PET_EVENT, {"pet": pet, "spot": spot, "minutes": event.get("minutes")})
        if self.announce:
            await self.announce(pet_message(pet, spot, event.get("minutes")))

    # --- the feed -------------------------------------------------------------

    async def async_run(self) -> None:
        """Follow the Mac's event feed for as long as the entry is loaded."""
        seq = 0
        failures = 0
        while True:
            try:
                if not self.connected:
                    self.state = await self.async_request("GET", "state")
                    self.connected = True
                    self._changed()
                feed = await self.async_request("GET", f"events?after={seq}", timeout=40)
                failures = 0
            except HomeAssistantError as err:
                failures += 1
                _LOGGER.debug("camera feed dropped (%s), attempt %d", err.__cause__ or err, failures)
                # Straight back: a dropped long poll is routine, and every second
                # waiting is a held thumbs-up that steps the volume late, all at
                # once. Only a camera that stays away gets the slow retry.
                if failures >= 3 and self.connected:
                    self.connected = False
                    self._changed()
                await asyncio.sleep(0.2 if failures < 3 else 10)
                continue
            seq = int(feed.get("seq") or 0)
            for event in feed.get("events") or []:
                kind = event.get("type")
                if kind == "gesture":
                    await self._gesture(event)
                elif kind == "presence":
                    self._speakers.saw(event.get("people") or [])
                    self.state = {**self.state, "people": event.get("people") or [], "animals": event.get("animals") or [],
                                  "pets_at": event.get("pets_at") or {}}
                    self._changed()
                elif kind == "pet_waiting":
                    await self._pet_waiting(event)
                elif kind == "settings":
                    try:
                        self.state = await self.async_request("GET", "state")
                    except HomeAssistantError:
                        pass
                    self._changed()


class JarvisPresence:
    """The camera's body language and the room's lights, following the pucks.

    Listening, thinking and speaking move the camera a few degrees and, when
    chosen, dim and brighten some lights (never their colour); idle puts both
    back. The lights are snapshotted into a scene first and restored from it,
    so they return to exactly what they were - including off.
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
        # The calls that put the lights back to "before". A restore replaces
        # them, so a follow-up within 15 s returns to what the last one set.
        self._before: list[tuple] = []
        self._restored_at = 0.0
        # During a conversation: when it began, our own calls (by context), and
        # anything else that changed the lights - a command to them wins.
        self._started: datetime | None = None
        self._ours: set[str] = set()
        self._base = 80  # the lights' brightness_pct when the conversation began
        self._pulse_task: asyncio.Task | None = None
        self._voice_task: asyncio.Task | None = None
        self._foreign: dict = {}
        self._commanded = False
        self._handback = False  # "natural": they gave the lights back to Adaptive Lighting
        self._watch_lights: Callable[[], None] | None = None

    @property
    def satellites(self) -> list[str]:
        return self.link.jarvis.get("satellites") or self.hass.states.async_entity_ids("assist_satellite")

    @callback
    def async_start(self) -> Callable[[], None]:
        """(Re)subscribe to the chosen pucks. Returns the unsubscribe.

        "Every puck" listens by domain: an ESPHome puck can connect after
        Home Assistant has started, and a list taken then would be empty.
        """
        self.async_stop()
        if chosen := self.link.jarvis.get("satellites"):
            self._unsub = async_track_state_change_event(self.hass, chosen, self._changed)
        else:
            self._unsub = self.hass.bus.async_listen(
                "state_changed", self._changed,
                event_filter=callback(lambda data: data["entity_id"].startswith("assist_satellite.")),
            )
        return self.async_stop

    @callback
    def async_stop(self) -> None:
        if self._unsub:
            self._unsub()
            self._unsub = None

    @callback
    def _hook_voices(self) -> None:
        """Hear each puck's replies and announcements as they are handed over.

        Core has no event carrying the reply's audio, so the satellite
        entity's two hand-over methods are wrapped. ponytail: a monkeypatch
        on core's entity, the clean seam if core ever fires a TTS event. The
        wrapper looks up the live JarvisPresence on the entity, so a reload of
        this integration re-points it instead of stacking wrappers.
        """
        from homeassistant.components.assist_pipeline import PipelineEventType
        from homeassistant.helpers.entity_component import DATA_INSTANCES

        component = self.hass.data.get(DATA_INSTANCES, {}).get("assist_satellite")
        for entity_id in self.satellites:
            entity = component.get_entity(entity_id) if component else None
            if entity is None:
                continue
            already = hasattr(entity, "_hubbubb_presence")
            entity._hubbubb_presence = self
            if already:
                continue
            on_event, announce = entity.on_pipeline_event, entity.async_announce

            def on_pipeline_event(event, entity=entity, on_event=on_event):
                output = (event.data or {}).get("tts_output") if event.type is PipelineEventType.TTS_END else None
                if output and output.get("token"):
                    entity._hubbubb_presence.voice(output["token"], VOICE_DELAY)
                on_event(event)

            async def async_announce(announcement, entity=entity, announce=announce):
                token = announcement.tts_token or next(iter(TTS_TOKEN.findall(announcement.media_id or "")), None)
                if token:
                    chime = PREANNOUNCE_SECONDS if announcement.preannounce_media_id else 0
                    entity._hubbubb_presence.voice(token, VOICE_DELAY + chime)
                await announce(announcement)

            entity.on_pipeline_event = on_pipeline_event
            entity.async_announce = async_announce

    @callback
    def voice(self, token: str, delay: float) -> None:
        """Jarvis's reply is about to play: follow its loudness on the lights."""
        if self._voice_task:
            self._voice_task.cancel()
        self._voice_task = self.hass.async_create_background_task(
            self._follow_voice(token, time.monotonic() + delay), f"{DOMAIN} jarvis lights voice")

    async def _follow_voice(self, token: str, start: float) -> None:
        from homeassistant.components import tts
        from homeassistant.components.ffmpeg import get_ffmpeg_manager

        stream = tts.async_get_stream(self.hass, token)
        entities = self.link.jarvis.get("light_entities") or []
        if stream is None or not entities or not self.link.jarvis.get("lights"):
            return
        # ponytail: waits for the whole clip; a long streamed reply skips the
        # steps already played (the pulse covers them). Decode chunk by chunk if that shows.
        audio = b"".join([chunk async for chunk in stream.async_stream_result()])
        proc = await asyncio.create_subprocess_exec(
            get_ffmpeg_manager(self.hass).binary, "-v", "error", "-i", "pipe:0",
            "-f", "s16le", "-ac", "1", "-ar", "8000", "pipe:1",
            stdin=asyncio.subprocess.PIPE, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.DEVNULL,
        )
        pcm, _ = await proc.communicate(audio)
        levels = await self.hass.async_add_executor_job(envelope, pcm, 8000)
        last = None
        for i, loudness in enumerate(levels):
            wait = start + i * VOICE_STEP - time.monotonic()
            if wait < 0:
                continue
            await asyncio.sleep(wait)
            if self._left_alone():
                return  # someone took the lights
            if not self._snapshot:
                continue  # not saved yet (an announcement's first moments), or paused
            bright, dim = mood_levels(self._base)
            if self._pulse_task:  # the voice takes over from the thinking pulse
                self._pulse_task.cancel()
                self._pulse_task = None
            level = round((dim + (bright - dim) * loudness) / 5) * 5  # 5 % steps: fewer repeat calls
            if level != last:
                await self._set_level(entities, level, VOICE_STEP)
                last = level
        if self._snapshot and not self._left_alone():
            await self._set_level(entities, mood_levels(self._base)[1], VOICE_STEP)

    @callback
    def _changed(self, event) -> None:
        self._hook_voices()  # the pucks exist by the time they change state
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
        self._stop_pulse()
        if self._watch_lights:
            self._watch_lights()
            self._watch_lights = None
        entities = self.link.jarvis.get("light_entities") or []
        # What the person asked for during the conversation beats what was
        # there before: a scene they started (Natural light), else the state a
        # command set. Otherwise the scene they were in, else the colours.
        asked = self._active_scene(entities, since=self._started) if self._started else None
        if asked:
            calls = [("scene", "turn_on", {"entity_id": asked, "transition": 0.5})]
        elif self._handback:
            calls = self._adaptive(entities)
        elif self._foreign:
            calls = [("light", *reapply(e, st.state, dict(st.attributes))) for e, st in self._foreign.items()]
        else:
            calls = self._before
        self._before = calls

        async def _run() -> None:
            for domain, service, data in calls:
                await self.hass.services.async_call(domain, service, data, context=self._context())

        self.hass.async_create_background_task(_run(), f"{DOMAIN} jarvis lights restore")

    def _context(self) -> Context:
        """A context for our own light calls, remembered so their echoes are ours.

        ':jv:' in the id (like Adaptive Lighting's ':al:') lets the
        brightness-pauses-Adaptive-Lighting automation skip our calls.
        """
        context = Context(id=f"{ulid_now()[:22]}:jv:")
        self._ours.add(context.id)
        if len(self._ours) > 200:
            self._ours = set(list(self._ours)[-100:])
        return context

    @callback
    def _light_call(self, event) -> None:
        """Someone else's light or scene command during the conversation."""
        data = event.data
        context = event.context
        if context.id in self._ours or context.parent_id in self._ours or is_adaptive_lighting(context):
            return
        if data.get("domain") == "adaptive_lighting":
            if hands_back(data):
                self._handback, self._commanded, self._foreign = True, False, {}
        elif data.get("domain") in ("light", "scene") and commands_lights(data, self._light_targets()):
            self._commanded, self._handback = True, False

    def _adaptive(self, entities: list[str], unpaused_only: bool = False) -> list[tuple]:
        """Calls that hand these lights back to Adaptive Lighting.

        unpaused_only: just the ones it is running right now (not on manual).
        """
        entries = self.hass.config_entries.async_entries("adaptive_lighting")
        if not entries:
            return []
        registry = er.async_get(self.hass)
        calls = []
        for entry in entries:
            lights = set(entry.options.get("lights") or entry.data.get("lights") or []) & set(entities)
            switch = next((
                e.entity_id for e in er.async_entries_for_config_entry(registry, entry.entry_id)
                if e.domain == "switch" and not e.entity_id.endswith(("_sleep_mode", "_adapt_color", "_adapt_brightness"))
            ), None)
            state = self.hass.states.get(switch) if switch else None
            if not lights or state is None or state.state != "on":
                continue
            if unpaused_only:
                lights -= set(state.attributes.get("manual_control") or [])
            if lights:
                calls += adaptive_calls(switch, sorted(lights))
        return calls

    def _light_targets(self) -> set[str]:
        """Our lights and the Hue groups holding them - a group command changes them too."""
        entities = set(self.link.jarvis.get("light_entities") or [])
        groups = {
            g.entity_id for g in self.hass.states.async_all("light")
            if set(g.attributes.get("entity_id") or []) & entities
        }
        return entities | groups

    @callback
    def _lights_changed(self, event) -> None:
        """A light we tint changed. Ours, or someone's command?"""
        new = event.data.get("new_state")
        context = event.context
        if new is None or is_adaptive_lighting(context):
            return  # gone, or Adaptive Lighting's routine pass
        # A group command's change reaches the light under the context of our
        # last call to it (HA keeps an entity's context for 5 s), so after a
        # command a change under our context is theirs.
        if not self._commanded and (context.id in self._ours or context.parent_id in self._ours):
            return
        self._foreign[new.entity_id] = new

    def _active_scene(self, entities: list[str], since: datetime | None = None) -> str | None:
        """Which scene the lights are in now, from the scenes Home Assistant knows.

        With `since`, only a scene started after then (or one that says it is
        active) - what someone asked for during the conversation.
        """
        states = self.hass.states
        lights = [states.get(e) for e in entities]
        changed = since or max((l.last_changed for l in lights if l), default=None)
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
            # Not yet: a follow-up question goes idle -> listening within the
            # same second (a later one is caught by the 15 s rule below). Restoring then and re-snapshotting would save Jarvis's
            # own colour as "before" - the lights would never come back.
            if self._snapshot and not self._pending_restore:
                self._pending_restore = async_call_later(self.hass, 1.0, self._restore)
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
                scene = self._active_scene(entities) or f"scene.{SNAPSHOT_SCENE}"
                # Lights Adaptive Lighting was running go back to it, not to a
                # frozen copy - and skip the scene if it has them all, since
                # activating a scene pauses Adaptive Lighting.
                adaptive = self._adaptive(entities, unpaused_only=True)
                covered = {light for _d, _s, data in adaptive for light in data["lights"]}
                scene_call = [] if covered >= set(entities) else [("scene", "turn_on", {"entity_id": scene, "transition": 0.5})]
                self._before = scene_call + adaptive
                await self.hass.services.async_call(
                    "scene", "create", {"scene_id": SNAPSHOT_SCENE, "snapshot_entities": entities},
                    blocking=True, context=self._context(),
                )
                # ponytail: one level for all the lights (the first one on), per-light if several differ a lot
                lit = next((st for st in map(self.hass.states.get, entities)
                            if st and st.state == "on" and st.attributes.get("brightness")), None)
                self._base = round(lit.attributes["brightness"] * 100 / 255) if lit else config.get("brightness", 80)
            self._snapshot = True
            self._started = datetime.now(UTC)
            self._foreign = {}
            self._commanded = False
            self._handback = False
            unsubs = (
                async_track_state_change_event(self.hass, entities, self._lights_changed),
                self.hass.bus.async_listen("call_service", self._light_call),
            )
            self._watch_lights = lambda: [u() for u in unsubs]
        if self._left_alone():
            return  # they changed these lights mid-conversation; leave them be
        bright, dim = mood_levels(self._base)
        if mood == "listening":
            self._stop_pulse()
            await self._set_level(entities, dim)
        elif not self._pulse_task and not self._voice_task:
            # Thinking breathes; so does speaking until the voice itself
            # arrives and takes over (see _follow_voice).
            self._pulse_task = self.hass.async_create_background_task(
                self._pulse(entities, bright, dim), f"{DOMAIN} jarvis lights pulse")

    def _left_alone(self) -> bool:
        return bool(self._foreign or self._handback)

    async def _set_level(self, entities: list[str], pct: int, transition: float = PULSE_SECONDS - 0.1) -> None:
        await self.hass.services.async_call(
            "light", "turn_on", {"entity_id": entities, "brightness_pct": pct, "transition": transition},
            blocking=False, context=self._context(),
        )

    async def _pulse(self, entities: list[str], bright: int, dim: int) -> None:
        """Breathe while Jarvis speaks, until the mood changes or someone takes the lights."""
        level = bright
        while not self._left_alone():
            await self._set_level(entities, level)
            level = dim if level == bright else bright
            await asyncio.sleep(PULSE_SECONDS)

    def _stop_pulse(self) -> None:
        """Stop the breathing and the voice-following."""
        for task in (self._pulse_task, self._voice_task):
            if task:
                task.cancel()
        self._pulse_task = self._voice_task = None

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
            "on": link.gestures_on,
        }

    async def gestures_enable(call: ServiceCall):
        await link.async_set_gestures_on(call.data["on"])

    async def gesture_save(call: ServiceCall):
        return {"saved": await link.async_save_gesture(dict(call.data))}

    async def gesture_test(call: ServiceCall):
        await link.async_run_gesture(call.data["gesture"], call.data.get("person"))

    async def mac_screen_sharing(call: ServiceCall):
        reply = await link.async_request("POST", "screen_sharing", dict(call.data), timeout=60)
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
        DOMAIN, "gestures_enable", gestures_enable, schema=vol.Schema({vol.Required("on"): cv.boolean})
    )
    hass.services.async_register(
        DOMAIN, "gesture_test", gesture_test,
        schema=vol.Schema({vol.Required("gesture"): valid_gesture, vol.Optional("person"): str}),
    )
    hass.services.async_register(
        DOMAIN, "mac_screen_sharing", mac_screen_sharing,
        # airplay: an Apple TV's Screen Mirroring ID (the UUID after "AirPlay:");
        # without it, the Samsung over HDMI is extended.
        schema=vol.Schema({vol.Required("on"): cv.boolean, vol.Optional("airplay"): vol.Match(r"^[0-9A-Fa-f-]{36}$")}),
        supports_response=SupportsResponse.OPTIONAL,
    )
    return [*PASSTHROUGH, "gestures_get", "gesture_save", "gestures_enable", "gesture_test", "mac_screen_sharing",
            "jarvis_presence_get", "jarvis_presence_save", "jarvis_presence_test"]
