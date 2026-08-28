"""Apple TV by voice: transport, app launching, and native Music playback.

Ported from a battle-tested intent_script setup. The shape it takes needs a
word of explanation, because most of it exists to work around things the
Apple TV will not do politely:

- Transport never consults state. The device reports `playing` only about a
  quarter of the time it is genuinely playing (Netflix barely publishes
  now-playing over MediaRemote), so commands are sent regardless and the
  device sorts it out.
- Music is played NATIVELY in the tvOS Music app: an iTunes catalog search
  resolves what was said to a music.apple.com link, the Apple TV opens it,
  and remote keypresses do what autoplay will not (tvOS never autoplays a
  song or album deep link). Playback is controllable with the physical
  remote afterwards and Apple Music autoplay continues when the song ends.
- Playback starts only after the voice pipeline has finished answering, or
  the first seconds of the song play underneath the spoken confirmation.

Rooms come from Home Assistant areas: put each Apple TV in an area and its
name becomes the spoken room ("... on the bedroom apple tv"). With no room
spoken, the first configured Apple TV answers.
"""

from __future__ import annotations

import asyncio
import logging
from urllib.parse import quote

import voluptuous as vol
from homeassistant.core import HomeAssistant
from homeassistant.helpers import (
    area_registry as ar,
    config_validation as cv,
    device_registry as dr,
    entity_registry as er,
    intent,
)
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import CONF_ATV, CONF_ATV_ENTITIES

_LOGGER = logging.getLogger(__name__)

INTENT_ATV_TRANSPORT = "HubbubbAtvTransport"
INTENT_ATV_WATCH = "HubbubbAtvWatchShow"
INTENT_ATV_MUSIC = "HubbubbAtvPlayMusic"
INTENT_ATV_APP = "HubbubbAtvOpenApp"

ATV_INTENTS = (
    INTENT_ATV_TRANSPORT,
    INTENT_ATV_WATCH,
    INTENT_ATV_MUSIC,
    INTENT_ATV_APP,
)

ITUNES_SEARCH = (
    "https://itunes.apple.com/search"
    "?media=music&entity={entity}&limit=1&term={term}"
)


def configured_entities(runtime) -> list[str]:
    return runtime.option(CONF_ATV, CONF_ATV_ENTITIES) or []


def rooms(hass: HomeAssistant, entities: list[str]) -> dict[str, str]:
    """{'living room': 'media_player.living_room_apple_tv', ...}

    The room is the entity's area name, lowercased - the same word the
    sentences are generated with, so what hassil matched is what is looked
    up here. An Apple TV without an area falls back to its friendly name,
    so every configured box is speakable somehow.
    """
    ent_reg = er.async_get(hass)
    dev_reg = dr.async_get(hass)
    area_reg = ar.async_get(hass)
    out: dict[str, str] = {}
    for entity_id in entities:
        entry = ent_reg.async_get(entity_id)
        if entry is None:
            continue
        area_id = entry.area_id
        if not area_id and entry.device_id:
            device = dev_reg.async_get(entry.device_id)
            area_id = device.area_id if device else None
        area = area_reg.async_get_area(area_id) if area_id else None
        if area:
            out[area.name.lower()] = entity_id
            continue
        state = hass.states.get(entity_id)
        name = (state and state.name) or entity_id.split(".", 1)[1]
        out[name.lower().removesuffix("apple tv").strip()
            or name.lower()] = entity_id
    return out


def sentence_yaml(hass: HomeAssistant, runtime) -> str | None:
    """The apple_tv sentence file, with this house's room names in it.

    Generated rather than static because hassil needs the room list as fixed
    values - a wildcard room would eat the trailing words of every sentence.
    None (= do not install the file) when no Apple TV is configured: the
    bare "play {ma_query}" wildcard must not exist on a house with nothing
    to play on.
    """
    entities = configured_entities(runtime)
    if not entities:
        return None
    names = sorted(rooms(hass, entities))
    room_lines = "".join(f'      - "{n}"\n' for n in names)
    return _TEMPLATE.replace("__ROOMS__\n", room_lines)


def async_register_all(hass: HomeAssistant, runtime) -> None:
    for handler in (
        TransportHandler(runtime),
        WatchShowHandler(runtime),
        PlayMusicHandler(runtime),
        OpenAppHandler(runtime),
    ):
        intent.async_register(hass, handler)


class _AtvHandler(intent.IntentHandler):
    def __init__(self, runtime) -> None:
        self._runtime = runtime

    @staticmethod
    def _say(intent_obj: intent.Intent, speech: str) -> intent.IntentResponse:
        response = intent_obj.create_response()
        response.async_set_speech(speech)
        return response

    def _resolve(self, hass: HomeAssistant, slots: dict) -> tuple[str, str]:
        """(entity_id, spoken room label) - or ValueError with the apology."""
        entities = configured_entities(self._runtime)
        if not entities:
            raise ValueError("No Apple TV is set up in my options.")
        by_room = rooms(hass, entities)
        spoken = str(slots.get("atv_room", {}).get("value", "") or "").lower()
        if spoken:
            if spoken not in by_room:
                raise ValueError(
                    f"I don't know an Apple TV in the {spoken}."
                )
            return by_room[spoken], spoken
        entity_id = entities[0]
        label = next(
            (room for room, e in by_room.items() if e == entity_id), ""
        )
        return entity_id, label

    @staticmethod
    def _remote(hass: HomeAssistant, entity_id: str) -> str | None:
        """The remote.* sibling on the same device, for keypresses."""
        ent_reg = er.async_get(hass)
        entry = ent_reg.async_get(entity_id)
        if entry is None or entry.device_id is None:
            return None
        for other in er.async_entries_for_device(ent_reg, entry.device_id):
            if other.domain == "remote":
                return other.entity_id
        return None


async def _wake_and_list_sources(hass: HomeAssistant, entity_id: str) -> list:
    """Wake the box, then wait for its app list.

    source_list only exists while the Apple TV is awake - matching against
    it from standby fails every single launch, so the wake comes first and
    the wait is on the list itself, not the power state.
    """
    await hass.services.async_call(
        "media_player", "turn_on", {"entity_id": entity_id}, blocking=False
    )
    for _ in range(30):  # 15s, matching the original wait_template timeout
        state = hass.states.get(entity_id)
        sources = (state and state.attributes.get("source_list")) or []
        if sources:
            return sources
        await asyncio.sleep(0.5)
    return []


def _match_source(want: str, sources: list) -> str | None:
    """Case/space/plus-insensitive app match against the live app list."""
    flatten = lambda s: s.lower().replace(" ", "").replace("+", "plus")  # noqa: E731
    want = flatten(want)
    hit = None
    for source in sources:
        flat = flatten(source)
        if flat == want:
            return source
        if hit is None and want in flat:
            hit = source
    return hit


class TransportHandler(_AtvHandler):
    intent_type = INTENT_ATV_TRANSPORT
    slot_schema = {
        vol.Required("atv_cmd"): vol.In(
            ["media_pause", "media_play", "media_stop"]
        ),
        vol.Optional("atv_room"): cv.string,
    }
    description = "Pause, resume or stop an Apple TV"

    async def async_handle(self, intent_obj: intent.Intent):
        slots = self.async_validate_slots(intent_obj.slots)
        try:
            entity_id, room = self._resolve(intent_obj.hass, slots)
        except ValueError as err:
            return self._say(intent_obj, str(err))
        command = slots["atv_cmd"]["value"]
        # Straight out, never gated on state: this device under-reports
        # `playing`, and it accepts the command regardless of what HA heard.
        try:
            await intent_obj.hass.services.async_call(
                "media_player", command, {"entity_id": entity_id}, blocking=True
            )
        except Exception as err:  # noqa: BLE001 - spoken, not raised
            _LOGGER.warning("Apple TV %s failed: %s", command, err)
        said = {
            "media_pause": "Paused",
            "media_play": "Playing",
            "media_stop": "Stopped",
        }.get(command, "Done")
        where = f" the {room} Apple TV" if room else " the Apple TV"
        return self._say(intent_obj, f"{said}{where}.")


class _AppLauncher(_AtvHandler):
    """Shared "open this app" flow for OpenApp and WatchShow."""

    async def _open(self, intent_obj: intent.Intent, slots: dict, wanted: str):
        try:
            entity_id, _ = self._resolve(intent_obj.hass, slots)
        except ValueError as err:
            return self._say(intent_obj, str(err))
        sources = await _wake_and_list_sources(intent_obj.hass, entity_id)
        source = _match_source(wanted, sources)
        if not source:
            return self._say(
                intent_obj,
                f"I couldn't find an app called {wanted} on that Apple TV.",
            )
        await intent_obj.hass.services.async_call(
            "media_player",
            "select_source",
            {"entity_id": entity_id, "source": source},
            blocking=True,
        )
        return self._say(intent_obj, f"Opening {source}.")


class OpenAppHandler(_AppLauncher):
    intent_type = INTENT_ATV_APP
    slot_schema = {
        vol.Required("atv_app"): cv.string,
        vol.Optional("atv_room"): cv.string,
    }
    description = "Open an app on an Apple TV"

    async def async_handle(self, intent_obj: intent.Intent):
        slots = self.async_validate_slots(intent_obj.slots)
        return await self._open(intent_obj, slots, slots["atv_app"]["value"])


class WatchShowHandler(_AppLauncher):
    """"Watch <show> on <service>" opens that streaming app.

    Deep-linking the title itself needs per-service catalog IDs no public
    API provides, so the show name is heard and dropped; opening the right
    app is the useful 90%.
    """

    intent_type = INTENT_ATV_WATCH
    slot_schema = {
        vol.Required("atv_service"): cv.string,
        vol.Optional("atv_show"): cv.string,
        vol.Optional("atv_room"): cv.string,
    }
    description = "Open a streaming service on an Apple TV"

    async def async_handle(self, intent_obj: intent.Intent):
        slots = self.async_validate_slots(intent_obj.slots)
        return await self._open(
            intent_obj, slots, slots["atv_service"]["value"]
        )


class PlayMusicHandler(_AtvHandler):
    intent_type = INTENT_ATV_MUSIC
    slot_schema = {
        vol.Optional("ma_query"): cv.string,
        vol.Optional("ma_song"): cv.string,
        vol.Optional("ma_artist"): cv.string,
        vol.Optional("atv_room"): cv.string,
        vol.Optional("station"): vol.Coerce(bool),
    }
    description = "Play music, or start a station, on an Apple TV"

    async def async_handle(self, intent_obj: intent.Intent):
        hass = intent_obj.hass
        slots = self.async_validate_slots(intent_obj.slots)
        try:
            entity_id, room = self._resolve(hass, slots)
        except ValueError as err:
            return self._say(intent_obj, str(err))

        song = str(slots.get("ma_song", {}).get("value", "") or "")
        artist = str(slots.get("ma_artist", {}).get("value", "") or "")
        query = str(slots.get("ma_query", {}).get("value", "") or "")
        term = f"{song} {artist}".strip() if song else query
        wants_station = bool(slots.get("station", {}).get("value"))

        await hass.services.async_call(
            "media_player", "turn_on", {"entity_id": entity_id}, blocking=False
        )
        artist_hit, song_hit = await asyncio.gather(
            self._search(hass, term, "musicArtist"),
            self._search(hass, term, "song"),
        )
        plan = decide_plan(artist_hit, song_hit, term, bool(song), wants_station)
        if plan is None:
            return self._say(
                intent_obj, f"I couldn't find {term} on Apple Music."
            )
        hass.async_create_task(
            _run_plan(hass, entity_id, self._remote(hass, entity_id), plan)
        )
        where = f" on the {room} Apple TV" if room else ""
        if wants_station:
            speech = f"Starting a {term} station{where}."
        elif song:
            speech = f"Playing {song} by {artist}{where}."
        else:
            speech = f"Playing {query}{where}."
        return self._say(intent_obj, speech)

    @staticmethod
    async def _search(
        hass: HomeAssistant, term: str, entity: str
    ) -> dict | None:
        """Top iTunes catalog hit for the term, or None. Best-effort."""
        session = async_get_clientsession(hass)
        url = ITUNES_SEARCH.format(entity=entity, term=quote(term))
        try:
            async with asyncio.timeout(10):
                resp = await session.get(url)
                payload = await resp.json(content_type=None)
        except Exception as err:  # noqa: BLE001 - catalog search is best-effort
            _LOGGER.warning("iTunes search failed: %s", err)
            return None
        results = (payload or {}).get("results") or []
        return results[0] if results else None


def decide_plan(
    artist_hit: dict | None,
    song_hit: dict | None,
    term: str,
    song_said: bool,
    station: bool,
) -> dict | None:
    """What to open and how to start it. Pure, so the tests can lean on it.

    A bare query becomes the artist's page (shuffled) only when it is
    exactly an artist's name AND not exactly the top song's title - an
    obscure artist named "Thriller" exists, so an artist match alone
    hijacks famous songs. Anything else plays the exact top song.
    Stations only on request: artist station when the query is an artist,
    otherwise the top song's station (seeded similar music).
    """
    flat = term.lower().replace(" ", "")
    is_artist = bool(
        artist_hit
        and (artist_hit.get("artistName", "").lower().replace(" ", "")) == flat
    )
    is_song_title = bool(
        song_hit
        and (song_hit.get("trackName", "").lower().replace(" ", "")) == flat
    )

    if station:
        if artist_hit and is_artist and not is_song_title:
            seed = artist_hit["artistId"]
        elif song_hit:
            seed = song_hit["trackId"]
        elif artist_hit:
            seed = artist_hit["artistId"]
        else:
            return None
        return {
            "kind": "radio",
            "url": f"https://music.apple.com/us/station/ra.{seed}",
        }
    if artist_hit and not song_said and is_artist and not is_song_title:
        url = artist_hit.get("artistLinkUrl") or (
            f"https://music.apple.com/us/artist/{artist_hit['artistId']}"
        )
        return {"kind": "artist", "url": url}
    if song_hit:
        return {
            "kind": "song",
            "url": song_hit["trackViewUrl"],
            "row": song_hit.get("trackNumber") or 1,
        }
    if artist_hit:
        return {
            "kind": "radio",
            "url": f"https://music.apple.com/us/station/ra.{artist_hit['artistId']}",
        }
    return None


async def _run_plan(
    hass: HomeAssistant, entity_id: str, remote_id: str | None, plan: dict
) -> None:
    """Open the link and press whatever tvOS will not press itself.

    Runs AFTER the intent has answered: the pipeline cannot wait for its own
    text-to-speech, and starting the song during the announcement plays its
    first seconds underneath the spoken reply - so wait for every satellite
    to fall quiet first, then a beat more for the room's audio to settle.
    """

    def satellites_busy() -> bool:
        return any(
            state.state == "responding"
            for state in hass.states.async_all("assist_satellite")
        )

    for _ in range(30):
        if not satellites_busy():
            break
        await asyncio.sleep(1)
    await asyncio.sleep(2)

    for _ in range(30):  # up to 15s for the box to finish waking
        state = hass.states.get(entity_id)
        if state and state.state not in ("off", "unavailable", "unknown"):
            break
        await asyncio.sleep(0.5)

    async def open_url() -> None:
        await hass.services.async_call(
            "media_player",
            "play_media",
            {
                "entity_id": entity_id,
                "media_content_type": "url",
                "media_content_id": plan["url"],
            },
            blocking=True,
        )

    async def press(command: str, repeats: int = 1, delay: float = 0.0) -> None:
        if remote_id is None:
            return
        data: dict = {"entity_id": remote_id, "command": command}
        if repeats > 1:
            data["num_repeats"] = repeats
            data["delay_secs"] = delay
        try:
            await hass.services.async_call(
                "remote", "send_command", data, blocking=True
            )
        except Exception as err:  # noqa: BLE001 - keypresses are best-effort
            _LOGGER.debug("Apple TV keypress %s failed: %s", command, err)

    async def playing(timeout: float) -> bool:
        for _ in range(int(timeout * 2)):
            state = hass.states.get(entity_id)
            if state and state.state == "playing":
                return True
            await asyncio.sleep(0.5)
        return False

    try:
        await open_url()
    except Exception as err:  # noqa: BLE001
        _LOGGER.warning("Apple TV would not open %s: %s", plan["url"], err)
        return

    kind = plan.get("kind")
    if kind == "song":
        # tvOS never autoplays a song/album deep link. The album?i= link
        # opens the album page focused on Play; each "down" walks one track
        # row, so down x trackNumber + select plays exactly that track.
        # ponytail: trackNumber is per-disc - disc 2+ songs land wrong; fix
        # with an iTunes album lookup if it ever matters.
        await asyncio.sleep(3)
        await press("down", plan.get("row", 1), 0.25)
        await press("select")
    elif kind == "artist":
        # The artist page opens with Shuffle focused - select shuffles the
        # catalog; retry once on a slow page load.
        await asyncio.sleep(3)
        await press("select")
        if not await playing(6):
            await press("select")
    elif kind == "radio":
        # Stations autoplay (select the Play button if not); which screen
        # autoplay lands on is nondeterministic, so re-open the station URL
        # (reliably the station page; restarting a seconds-old stream is
        # free), then hop to Now Playing: up x3 to the tab bar, right x8
        # anchors on Search - focus never activates - and one left is
        # always Now Playing.
        if not await playing(8):
            await press("select")
            await playing(5)
        state = hass.states.get(entity_id)
        if state and state.state == "playing":
            try:
                await open_url()
            except Exception:  # noqa: BLE001
                return
            await asyncio.sleep(2)
            await press("up", 3, 0.15)
            await press("right", 8, 0.15)
            await press("left")
            await press("select")


# The room list is substituted at install time - see sentence_yaml().
_TEMPLATE = """\
# Launch apps, watch shows, and play music on the Apple TVs by voice.
# Generated by Hubbubb Home from the configured Apple TVs' areas; edits are
# overwritten. INTENT ORDER MATTERS: hassil returns the first match, so
# Transport (needs the literal words "apple tv") comes first, WatchShow
# before PlayMusic ("play X on netflix" must not be heard as a song called
# "X on netflix"), and PlayMusic before OpenApp (the station forms share
# "start" with app launches but require the literal word "station").
language: en
intents:
  HubbubbAtvTransport:
    data:
      - sentences:
          - "{atv_cmd} [the|my] apple tv [in the {atv_room}]"
          - "{atv_cmd} [the|my] {atv_room} apple tv"
  HubbubbAtvWatchShow:
    data:
      - sentences:
          - "(watch|play) {atv_show} on {atv_service} [in the {atv_room}]"
  HubbubbAtvPlayMusic:
    data:
      - sentences:
          - "[can you] [please] (create|start|make|build|play) [me] [a] [(new|music|radio)] station (for|from|of|with|about|based on|based off [of]) {ma_query} on the [{atv_room}] apple tv"
          - "[can you] [please] (create|start|make|build|play) [me] [a] [(new|music|radio)] station (for|from|of|with|about|based on|based off [of]) {ma_query} on the {atv_room} tv"
          - "[can you] [please] (create|start|make|build|play) [me] [a] [(new|music|radio)] station (for|from|of|with|about|based on|based off [of]) {ma_query}"
          - "[can you] [please] (create|start|make|build|play) [me] [a] {ma_query} [(music|radio)] station on the [{atv_room}] apple tv"
          - "[can you] [please] (create|start|make|build|play) [me] [a] {ma_query} [(music|radio)] station"
        slots:
          station: true
      - sentences:
          - "play {ma_song} by {ma_artist} on the [{atv_room}] apple tv"
          - "play {ma_song} by {ma_artist} on the {atv_room} tv"
          - "play {ma_song} by {ma_artist}"
          - "play {ma_query} on the [{atv_room}] apple tv"
          - "play {ma_query} on the {atv_room} tv"
          - "play {ma_query}"
  HubbubbAtvOpenApp:
    data:
      - sentences:
          - "(open|launch|start) {atv_app} on the [{atv_room}] apple tv"
          - "(open|launch|start) {atv_app} on the {atv_room} tv"
lists:
  atv_app:
    wildcard: true
  ma_query:
    wildcard: true
  ma_song:
    wildcard: true
  ma_artist:
    wildcard: true
  atv_show:
    wildcard: true
  atv_service:
    values:
      - in: "netflix"
        out: "Netflix"
      - in: "disney [plus]"
        out: "Disney"
      - in: "hulu"
        out: "Hulu"
      - in: "youtube"
        out: "YouTube"
      - in: "[hbo] max"
        out: "Max"
      - in: "prime [video]"
        out: "Prime Video"
      - in: "paramount [plus]"
        out: "Paramount"
      - in: "peacock"
        out: "Peacock"
  atv_room:
    values:
__ROOMS__
  atv_cmd:
    values:
      - in: "(pause|hold)"
        out: "media_pause"
      - in: "(resume|unpause|continue|play|start)"
        out: "media_play"
      - in: "stop"
        out: "media_stop"
"""
