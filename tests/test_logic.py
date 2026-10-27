"""Runnable check for the parts that have real logic in them.

Home Assistant is not installed to run this - the modules under test import a
handful of names from it, so those are stubbed here. That keeps the check to
`python3 tests/test_logic.py` with nothing but voluptuous installed, which is
the only version of a test anybody runs.
"""

import json
import sys
import types
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PKG = ROOT / "custom_components" / "hubbubb_home"


# --- the smallest Home Assistant that these modules will accept --------------

def _stub(name, **attrs):
    module = types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module
    return module


_NOW = datetime(2026, 8, 26, 12, 0, tzinfo=timezone.utc)
_scheduled = []


def _track_point_in_time(hass, action, when):
    entry = [action, when]
    _scheduled.append(entry)

    def _cancel():
        if entry in _scheduled:
            _scheduled.remove(entry)

    return _cancel


try:  # speakers.py imports aiohttp; absent here, only names are needed
    import aiohttp  # noqa: F401
except ImportError:
    _stub(
        "aiohttp",
        web=types.SimpleNamespace(Request=object),
        ClientTimeout=lambda **k: None,
        ClientError=Exception,
        ContentTypeError=ValueError,
    )

_stub("homeassistant")
_stub("homeassistant.exceptions", HomeAssistantError=Exception)
_components = _stub("homeassistant.components")
_components.webhook = _stub(
    "homeassistant.components.webhook",
    async_register=lambda *a, **k: None,
    async_unregister=lambda *a, **k: None,
)
_components.http = _stub("homeassistant.components.http", HomeAssistantView=object)
_stub(
    "homeassistant.components.recorder",
    get_instance=lambda hass: hass,
    history=types.SimpleNamespace(get_significant_states=lambda *a, **k: {}),
)
_stub(
    "homeassistant.core",
    Context=type("Context", (), {"__init__": lambda self, parent_id=None: (
        setattr(self, "id", f"ctx{id(self)}"), setattr(self, "parent_id", parent_id))[0]}),
    Event=object,
    HomeAssistant=object,
    CALLBACK_TYPE=object,
    callback=lambda f: f,
    ServiceCall=object,
    ServiceResponse=object,
    SupportsResponse=object,
)
class _IntentHandler:
    pass


try:  # slot schemas are built at class-definition time, but never run here
    import voluptuous  # noqa: F401
except ImportError:
    _stub(
        "voluptuous",
        Required=lambda key, **k: ("req", key),
        Optional=lambda key, **k: ("opt", key),
        In=lambda values: values,
        Coerce=lambda kind: kind,
        Schema=lambda *a, **k: None,
        All=lambda *a, **k: None,
        Length=lambda *a, **k: None,
        Range=lambda *a, **k: None,
        Any=lambda *a, **k: None,
        Invalid=Exception,
    )

class _LLMAPI:
    def __init__(self, **kwargs):
        pass


_helpers = _stub("homeassistant.helpers")
_stub(
    "homeassistant.helpers.event",
    async_track_point_in_time=_track_point_in_time,
    async_call_later=None,
    async_track_state_change_event=None,
)
_stub(
    "homeassistant.helpers.llm",
    API=_LLMAPI,
    Tool=object,
    APIInstance=object,
    LLMContext=object,
    ToolInput=object,
    async_register_api=lambda *a, **k: (lambda: None),
)
for _name, _attrs in {
    "area_registry": {},
    "device_registry": {},
    "entity_registry": {"async_get": None},
    "config_validation": {"string": str, "SCRIPT_SCHEMA": lambda v: v, "boolean": bool, "entity_id": str},
    "intent": {"IntentHandler": _IntentHandler, "async_register": lambda *a: None},
    "aiohttp_client": {"async_get_clientsession": lambda hass: None},
    "issue_registry": {
        "IssueSeverity": types.SimpleNamespace(WARNING="warning"),
        "async_create_issue": lambda *a, **k: None,
        "async_delete_issue": lambda *a, **k: None,
        "async_get": lambda hass: None,
    },
}.items():
    setattr(_helpers, _name, _stub(f"homeassistant.helpers.{_name}", **_attrs))


class _Store:
    """The one behaviour that matters here: it survives being reconstructed."""

    _disk = {}

    def __init__(self, hass, version, key):
        self._key = key

    async def async_load(self):
        return _Store._disk.get(self._key)

    async def async_save(self, data):
        _Store._disk[self._key] = data


_stub("homeassistant.helpers.storage", Store=_Store)
_stub(
    "homeassistant.helpers.script",
    SCRIPT_MODE_PARALLEL="parallel",
    Script=object,
    async_validate_actions_config=None,
)
_stub("homeassistant.util")
_stub(
    "homeassistant.util.dt",
    utcnow=lambda: _NOW,
    now=lambda: _NOW,
    as_local=lambda d: d,
    as_utc=lambda d: d,
    start_of_local_day=lambda d: _NOW,
)
_stub("homeassistant.util.json", JsonObjectType=dict)

# The package's __init__ imports most of Home Assistant, and none of it is
# needed to exercise the logic. Register hubbubb_home as a package by path so
# the relative imports inside each module resolve without running it.
_pkg = types.ModuleType("hubbubb_home")
_pkg.__path__ = [str(PKG)]
sys.modules["hubbubb_home"] = _pkg

from hubbubb_home.memory import Memory  # noqa: E402
from hubbubb_home.recipes import Recipes, as_lines, recipe_from_html  # noqa: E402
from hubbubb_home.speakers import SpeakerBook  # noqa: E402
from hubbubb_home import eyes  # noqa: E402
from hubbubb_home.eyes import gesture_allowed, mood_for, pet_message  # noqa: E402
from hubbubb_home.timers import TimerPool  # noqa: E402
from hubbubb_home.nightly import FindingsReport, _days  # noqa: E402
from hubbubb_home.review import ReviewReport, parse_proposals  # noqa: E402
from hubbubb_home.appletv import _TEMPLATE, _match_source, decide_plan  # noqa: E402
from hubbubb_home.companion import relevant_text  # noqa: E402
from hubbubb_home.grounding import same_request, trim_by_turns, ungrounded  # noqa: E402


# --- memory: spoken question -> FTS5 query -----------------------------------

def test_match_strips_punctuation_and_stop_words():
    # Bare punctuation is FTS5 syntax and raises; a question mark must not
    # reach the database.
    q = Memory._to_match("what do you remember about the pool guy?")
    assert "?" not in q, q
    assert '"pool"' in q and '"guy"' in q, q
    # "what", "do", "you", "remember", "about", "the" are all stop words.
    assert '"remember"' not in q, q


def test_match_falls_back_when_everything_is_a_stop_word():
    # "what do you know about me" is entirely stop words. Returning "" would
    # silently answer "I don't know anything" to every such question.
    q = Memory._to_match("what does the dog know")
    assert q, "an all-stop-word question must still produce a query"


def test_match_empty_input_is_empty():
    assert Memory._to_match("?? !!") == ""


def test_memory_round_trip_against_a_real_database():
    """The one that catches a bad MATCH: sqlite raises, it does not shrug."""
    import asyncio
    import tempfile

    class _MemHass:
        def __init__(self, path):
            self.config = types.SimpleNamespace(path=lambda *p: path)

        async def async_add_executor_job(self, fn, *args):
            return fn(*args)

    with tempfile.TemporaryDirectory() as tmp:
        store = Memory(_MemHass(str(Path(tmp) / "m.db")))

        async def _run():
            await store.async_setup()
            await store.async_add("the pool guy comes on tuesdays")
            await store.async_add("the bin men come on wednesday mornings")

            # Asked in the words of the question, not the words of the fact.
            hits = await store.async_search("when does the pool guy come?")
            assert hits and "pool" in hits[0], hits

            # Punctuation and apostrophes must not reach FTS5 as syntax.
            assert await store.async_search("what's the bin day??") != []
            assert await store.async_search("*") == []
            assert await store.async_search("") == []

            gone = await store.async_forget("pool")
            assert gone and "pool" in gone
            assert await store.async_search("pool") == []
            assert len(await store.async_all()) == 1

        asyncio.run(_run())


def test_recipes_round_trip_against_a_real_database():
    """Save, find by ingredient, edit in place, delete - on the real schema."""
    import asyncio
    import tempfile

    fired = []

    class _MemHass:
        def __init__(self, path):
            self.config = types.SimpleNamespace(path=lambda *p: path)
            self.bus = types.SimpleNamespace(async_fire=lambda ev, data: fired.append(ev))

        async def async_add_executor_job(self, fn, *args):
            return fn(*args)

    assert as_lines(["a", " ", "b "]) == "a\nb"
    assert as_lines("x\n\n y") == "x\ny"

    with tempfile.TemporaryDirectory() as tmp:
        book = Recipes(_MemHass(str(Path(tmp) / "m.db")))

        async def _run():
            await book.async_setup()
            parm = await book.async_save(
                "Chicken parmesan", ["2 chicken breasts", "mozzarella"], ["bread", "fry", "bake"], "https://x"
            )
            await book.async_save("Pancakes", "flour\neggs", ["mix", "fry"])
            assert parm["id"] == 1 and parm["ingredients"] == ["2 chicken breasts", "mozzarella"]

            hits = await book.async_search("how do I make chicken parm?")
            assert hits and hits[0]["title"] == "Chicken parmesan", hits
            hits = await book.async_search("anything with eggs")
            assert [h["title"] for h in hits] == ["Pancakes"], hits
            assert await book.async_search("??") == []

            again = await book.async_save("Pancakes", ["flour", "eggs", "milk"], ["mix", "fry"], recipe_id=2)
            assert again["ingredients"][-1] == "milk"
            assert [r["title"] for r in await book.async_all()] == ["Chicken parmesan", "Pancakes"]

            try:
                await book.async_save("", ["x"], ["y"])
            except ValueError:
                pass
            else:
                raise AssertionError("empty title saved")

            assert await book.async_delete(1) is True

            assert fired and set(fired) == {"hubbubb_home_recipes"}, fired
            assert await book.async_delete(1) is False
            assert len(await book.async_all()) == 1

        asyncio.run(_run())


def test_recipe_from_html_reads_schema_org():
    ld = {
        "@graph": [
            {"@type": "WebPage", "name": "not this"},
            {
                "@type": ["Recipe", "NewsArticle"],
                "name": "Dal &amp; rice",
                "recipeIngredient": ["1 cup <b>lentils</b>", " "],
                "recipeInstructions": [
                    {"@type": "HowToSection", "itemListElement": [
                        {"@type": "HowToStep", "text": "Rinse."},
                        {"@type": "HowToStep", "text": "Simmer."},
                    ]},
                    "Serve.",
                ],
                "image": [{"url": "https://x/a.jpg"}],
                "totalTime": "PT1H35M",
                "recipeYield": ["4", "4 bowls"],
                "aggregateRating": {"ratingValue": 4.873, "ratingCount": "12"},
            },
        ]
    }
    page = '<script>{}</script><script type="application/ld+json">%s</script>' % json.dumps(ld)
    r = recipe_from_html(page, "https://www.example.com/dal")
    assert r["title"] == "Dal & rice", r
    assert r["ingredients"] == ["1 cup lentils"], r
    assert r["steps"] == ["Rinse.", "Simmer.", "Serve."], r
    assert (r["image"], r["time"], r["serves"], r["rating"], r["site"]) == (
        "https://x/a.jpg", "1 h 35 min", "4", "4.87", "example.com"), r
    assert recipe_from_html("<p>no data</p>", "https://x") is None
    assert recipe_from_html('<script type="application/ld+json">{bad</script>', "u") is None


def test_memory_migrates_a_pre_person_database():
    """A 0.17 database (no person column) must rebuild, keeping every row
    as the household's, or the update eats everyone's memories."""
    import asyncio
    import sqlite3
    import tempfile

    class _MemHass:
        def __init__(self, path):
            self.config = types.SimpleNamespace(path=lambda *p: path)

        async def async_add_executor_job(self, fn, *args):
            return fn(*args)

    with tempfile.TemporaryDirectory() as tmp:
        path = str(Path(tmp) / "old.db")
        old = sqlite3.connect(path)
        old.execute("CREATE VIRTUAL TABLE memories USING fts5(text, created)")
        old.execute(
            "INSERT INTO memories VALUES ('the gate code is 4321', '2026-01-01')"
        )
        old.commit()
        old.close()

        store = Memory(_MemHass(path))

        async def _run():
            await store.async_setup()
            rows = await store.async_all()
            assert rows == [("the gate code is 4321", "")], rows
            # And the rebuilt table still matches like an FTS index.
            hits = await store.async_search("what's the gate code?")
            assert hits and "4321" in hits[0], hits

        asyncio.run(_run())


def test_memory_person_scoping():
    """A person sees their own memories plus the household's - never
    somebody else's - and an unscoped search still sees everything."""
    import asyncio
    import tempfile

    class _MemHass:
        def __init__(self, path):
            self.config = types.SimpleNamespace(path=lambda *p: path)

        async def async_add_executor_job(self, fn, *args):
            return fn(*args)

    with tempfile.TemporaryDirectory() as tmp:
        store = Memory(_MemHass(str(Path(tmp) / "m.db")))

        async def _run():
            await store.async_setup()
            await store.async_add("the bins go out on wednesday")  # household
            await store.async_add("my dentist is doctor lee", "Scott")
            await store.async_add("my dentist is doctor patel", "Vega")

            scott = await store.async_search("who is my dentist?", person="Scott")
            assert any("lee" in h for h in scott), scott
            assert not any("patel" in h for h in scott), scott

            # Household facts reach everyone.
            assert await store.async_search("bins", person="Vega")

            # Unscoped (service calls, pre-0.18 behaviour) sees the lot.
            both = await store.async_search("dentist", limit=5)
            assert len(both) == 2, both

            # Forgetting scoped to Vega cannot delete Scott's row.
            gone = await store.async_forget("dentist", person="Vega")
            assert gone and "patel" in gone, gone

        asyncio.run(_run())


# --- speakers ----------------------------------------------------------------

def test_speaker_resolution_precedence():
    import time as _time

    book = SpeakerBook(None, "", "puck-bedroom: Vega")
    now = _time.time()

    # Nothing known at all.
    assert book.resolve() == (None, 0.0, None)

    # Device default is a lean, not an identification.
    assert book.resolve("puck-bedroom") == ("Vega", 0.5, "device")
    assert book.resolve("puck-unknown") == (None, 0.0, None)

    # A stale voice event explains nothing (the 20 second window).
    book.record({"person": "Scott", "confidence": 0.9, "ts": now - 25})
    assert book.resolve("puck-bedroom")[2] == "device"

    # A fresh one beats the device default.
    book.record({"person": "Scott", "confidence": 0.9, "ts": now - 2})
    assert book.resolve("puck-bedroom") == ("Scott", 0.9, "voice")

    # A fresh but unsure event (person null) falls through to the device.
    book.record({"person": None, "confidence": 0.0, "ts": now - 1,
                 "candidates": {"Scott": 0.6, "Vega": 0.55}})
    assert book.resolve("puck-bedroom")[2] == "device"

    # Saying who you are beats everything.
    book.set_override("Dana")
    assert book.resolve("puck-bedroom") == ("Dana", 1.0, "told")


def test_camera_presence_sits_between_sure_and_unsure_voice():
    import time as _time
    from hubbubb_home.speakers import CAMERA_WINDOW

    book = SpeakerBook(None, "", "puck-bedroom: Vega")
    now = _time.time()

    # One known face in view beats the room default, as a lean.
    book.saw(["Anna"])
    assert book.resolve("puck-bedroom") == ("Anna", 0.7, "camera")
    assert book.last_known == "Anna"

    # It beats an unsure voice naming someone else...
    book.record({"person": "Scott", "confidence": 0.6, "ts": now - 1})
    assert book.resolve()[2] == "camera"
    # ...but never a sure one.
    book.record({"person": "Scott", "confidence": 0.9, "ts": now - 1})
    assert book.resolve() == ("Scott", 0.9, "voice")

    # Two people in view says nothing about which one spoke.
    book.events.clear()
    book.saw(["Anna", "Scott"])
    assert book.resolve("puck-bedroom")[2] == "device"

    # A camera that stopped reporting is no evidence.
    book.saw(["Anna"])
    book.in_view = (["Anna"], now - CAMERA_WINDOW - 1)
    assert book.resolve() == (None, 0.0, None)

    # Junk in the event is dropped, not stored.
    book.saw(["", None, 3, "Scott"])
    assert book.in_view[0] == ["Scott"]


def test_gesture_runs_only_when_its_settings_allow():
    volume = {"enabled": True, "repeat": True, "people": [], "actions": [{"action": "x"}]}
    once = {**volume, "repeat": False}
    assert gesture_allowed(volume, "Scott", held=False)
    assert gesture_allowed(volume, None, held=True)  # held repeats step the volume
    assert not gesture_allowed(once, "Scott", held=True)  # a one-shot fires once
    assert gesture_allowed(once, "Scott", held=False)
    # Limited to some people: names match loosely, strangers never.
    mine = {**once, "people": ["scott"]}
    assert gesture_allowed(mine, "Scott", held=False)
    assert not gesture_allowed(mine, "Anna", held=False)
    assert not gesture_allowed(mine, None, held=False)
    # Off, empty or unknown does nothing.
    assert not gesture_allowed({**once, "enabled": False}, "Scott", held=False)
    assert not gesture_allowed({**once, "actions": []}, "Scott", held=False)
    assert not gesture_allowed(None, "Scott", held=False)


def test_jarvis_mood_follows_the_busiest_puck():
    assert mood_for([]) == "idle"
    assert mood_for(["idle", "unavailable"]) == "idle"
    assert mood_for(["listening"]) == "listening"
    assert mood_for(["processing"]) == "thinking"
    assert mood_for(["listening", "responding"]) == "speaking"
    assert mood_for(["processing", "listening", "idle"]) == "thinking"


def test_jarvis_lights_survive_a_follow_up_question():
    """idle -> listening within a second must not re-snapshot Jarvis's colour."""
    import asyncio

    calls, timers = [], []

    class Services:
        async def async_call(self, domain, service, data, blocking=False, context=None):
            calls.append(f"{domain}.{service}")

    class Hass:
        services = Services()
        bus = types.SimpleNamespace(async_listen=lambda *a: (lambda: None))
        states = types.SimpleNamespace(is_state=lambda *a: False, get=lambda e: None, async_all=lambda d: [])

        def async_create_background_task(self, coro, name):
            return asyncio.ensure_future(coro)

    def call_later(hass, delay, action):
        timers.append(action)
        return lambda: timers.remove(action)

    eyes.async_call_later = call_later
    eyes.async_track_state_change_event = lambda *a: (lambda: None)
    link = types.SimpleNamespace(jarvis={"move": False, "lights": True, "light_entities": ["light.bar"]})
    presence = eyes.JarvisPresence(Hass(), link)

    async def run():
        for mood in ("listening", "thinking", "speaking", "idle", "listening", "speaking", "idle"):
            await presence.async_apply(mood)
        restore = [t for t in timers if getattr(t, "__name__", "") == "_restore"]
        assert len(restore) == 1, timers  # one pending restore, after the last idle
        restore[0]()
        await asyncio.sleep(0)

    asyncio.run(run())
    assert calls.count("scene.create") == 1, calls  # saved once, before any colour
    assert calls[-1] == "scene.turn_on", calls  # and put back once, at the end
    assert calls.count("scene.turn_on") == 1, calls


def test_jarvis_puts_back_the_scene_the_lights_were_in():
    from datetime import datetime, timedelta, timezone

    t = datetime(2026, 10, 26, 20, 0, tzinfo=timezone.utc)
    scenes = [
        ("scene.all_movie", "All", t - timedelta(hours=3), None),
        ("scene.all_bright", "All", t, None),
        ("scene.outside_bright", "Outside", t + timedelta(minutes=5), None),  # not their group
        ("scene.all_natural_light", "All", None, False),
        ("scene.mine", None, t, None),  # a snapshot, no group
    ]
    groups = {"All", "Home", "Living room"}
    # The latest scene of their groups, when it is what last changed them.
    assert eyes.scene_to_restore(scenes, groups, t + timedelta(seconds=2)) == "scene.all_bright"
    # Changed by hand since: no scene, use the colour snapshot.
    assert eyes.scene_to_restore(scenes, groups, t + timedelta(minutes=10)) is None
    # An active smart scene (Natural light) wins outright.
    natural = scenes[:3] + [("scene.all_natural_light", "All", None, True)]
    assert eyes.scene_to_restore(natural, groups, t + timedelta(minutes=10)) == "scene.all_natural_light"
    assert eyes.scene_to_restore([], groups, t) is None


def test_a_light_command_during_the_conversation_wins():
    """'Set my lights to natural' mid-conversation: no tint over it, and no
    restoring the old colour afterwards."""
    import asyncio

    calls, timers = [], []

    class Services:
        async def async_call(self, domain, service, data, blocking=False, context=None):
            calls.append((f"{domain}.{service}", data))

    class Hass:
        services = Services()
        bus = types.SimpleNamespace(async_listen=lambda *a: (lambda: None))
        states = types.SimpleNamespace(is_state=lambda *a: False, get=lambda e: None, async_all=lambda d: [])

        def async_create_background_task(self, coro, name):
            return asyncio.ensure_future(coro)

    def call_later(hass, delay, action):
        timers.append(action)
        return lambda: timers.remove(action)

    eyes.async_call_later = call_later
    eyes.async_track_state_change_event = lambda *a: (lambda: None)
    link = types.SimpleNamespace(jarvis={"move": False, "lights": True, "light_entities": ["light.bar"]})
    presence = eyes.JarvisPresence(Hass(), link)
    natural = types.SimpleNamespace(entity_id="light.bar", state="on",
                                    attributes={"color_mode": "color_temp", "color_temp_kelvin": 4000, "brightness": 200, "rgb_color": [255, 210, 170]})

    async def run():
        await presence.async_apply("listening")
        await presence.async_apply("thinking")
        # Jarvis runs the command: the bar changes under someone else's context.
        presence._lights_changed(types.SimpleNamespace(data={"new_state": natural}, context=eyes.Context()))
        # Our own echo (our context) never counts as theirs.
        mine = presence._context()
        presence._lights_changed(types.SimpleNamespace(data={"new_state": natural}, context=mine))
        tints_before = sum(1 for c, _ in calls if c == "light.turn_on")
        await presence.async_apply("speaking")
        assert sum(1 for c, _ in calls if c == "light.turn_on") == tints_before, "no tint over their command"
        await presence.async_apply("idle")
        [t for t in timers if getattr(t, "__name__", "") == "_restore"][0]()
        await asyncio.sleep(0)

    asyncio.run(run())
    last, data = calls[-1]
    assert last == "light.turn_on" and data["color_temp_kelvin"] == 4000, calls[-1]  # what they asked for
    assert not any(c == "scene.turn_on" for c, _ in calls), "never back to the old snapshot"


def test_a_light_command_survives_a_quick_next_conversation():
    """Green, 'make it red', then another question within 15 s: back to red, not green."""
    import asyncio

    calls, timers = [], []

    class Services:
        async def async_call(self, domain, service, data, blocking=False, context=None):
            calls.append((f"{domain}.{service}", data))

    class Hass:
        services = Services()
        bus = types.SimpleNamespace(async_listen=lambda *a: (lambda: None))
        states = types.SimpleNamespace(is_state=lambda *a: False, get=lambda e: None, async_all=lambda d: [])

        def async_create_background_task(self, coro, name):
            return asyncio.ensure_future(coro)

    def call_later(hass, delay, action):
        timers.append(action)
        return lambda: timers.remove(action)

    eyes.async_call_later = call_later
    eyes.async_track_state_change_event = lambda *a: (lambda: None)
    link = types.SimpleNamespace(jarvis={"move": False, "lights": True, "light_entities": ["light.bar"]})
    presence = eyes.JarvisPresence(Hass(), link)
    red = types.SimpleNamespace(entity_id="light.bar", state="on", attributes={"color_mode": "xy", "xy_color": [0.7, 0.3], "brightness": 255})

    async def restore():
        [t for t in timers if getattr(t, "__name__", "") == "_restore"][0]()
        await asyncio.sleep(0)

    async def run():
        await presence.async_apply("listening")
        presence._lights_changed(types.SimpleNamespace(data={"new_state": red}, context=eyes.Context()))
        await presence.async_apply("idle")
        await restore()
        for mood in ("listening", "speaking", "idle"):  # the next question, seconds later
            await presence.async_apply(mood)
        await restore()

    asyncio.run(run())
    last, data = calls[-1]
    assert last == "light.turn_on" and data["xy_color"] == [0.7, 0.3], calls[-1]
    assert not any(c == "scene.turn_on" for c, _ in calls), "never back to the old green"


def test_a_group_command_wins_even_under_our_context():
    """'Change my lights' hits the Hue room; the lamp's new colour arrives
    under our tint's context. It is still their command."""
    import asyncio

    calls, timers = [], []

    class Services:
        async def async_call(self, domain, service, data, blocking=False, context=None):
            calls.append((f"{domain}.{service}", data))

    room = types.SimpleNamespace(entity_id="light.room", attributes={"entity_id": ["light.bar", "light.other"]})

    class Hass:
        services = Services()
        bus = types.SimpleNamespace(async_listen=lambda *a: (lambda: None))
        states = types.SimpleNamespace(is_state=lambda *a: False, get=lambda e: None, async_all=lambda d: [room] if d == "light" else [])

        def async_create_background_task(self, coro, name):
            return asyncio.ensure_future(coro)

    def call_later(hass, delay, action):
        timers.append(action)
        return lambda: timers.remove(action)

    eyes.async_call_later = call_later
    eyes.async_track_state_change_event = lambda *a: (lambda: None)
    link = types.SimpleNamespace(jarvis={"move": False, "lights": True, "light_entities": ["light.bar"]})
    presence = eyes.JarvisPresence(Hass(), link)
    red = types.SimpleNamespace(entity_id="light.bar", state="on", attributes={"color_mode": "xy", "xy_color": [0.7, 0.3], "rgb_color": [255, 0, 0], "brightness": 255})

    async def run():
        await presence.async_apply("listening")
        await presence.async_apply("thinking")
        ours = presence._context()
        # Someone else's (unrelated) light call doesn't count.
        presence._light_call(types.SimpleNamespace(data={"domain": "light", "service": "turn_on", "service_data": {"entity_id": "light.porch"}}, context=eyes.Context()))
        presence._lights_changed(types.SimpleNamespace(data={"new_state": red}, context=ours))
        assert not presence._foreign
        # The command to the room, then the lamp turning red under our context.
        presence._light_call(types.SimpleNamespace(data={"domain": "light", "service": "turn_on", "service_data": {"entity_id": "light.room"}}, context=eyes.Context()))
        presence._lights_changed(types.SimpleNamespace(data={"new_state": red}, context=ours))
        tints = sum(1 for c, _ in calls if c == "light.turn_on")
        await presence.async_apply("speaking")
        assert sum(1 for c, _ in calls if c == "light.turn_on") == tints, "no tint over their command"
        await presence.async_apply("idle")
        [t for t in timers if getattr(t, "__name__", "") == "_restore"][0]()
        await asyncio.sleep(0)

    asyncio.run(run())
    last, data = calls[-1]
    assert last == "light.turn_on" and data["xy_color"] == [0.7, 0.3], calls[-1]
    assert not any(c == "scene.turn_on" for c, _ in calls), "never back to the old green"


def test_speaker_prompt_line_three_cases():
    import time as _time

    book = SpeakerBook(None, "", "")
    line = book.prompt_line()
    assert "do not know who is speaking" in line, line

    book.record({"person": "Scott", "confidence": 0.5, "ts": _time.time()})
    assert "probably Scott" in book.prompt_line()

    book.record({"person": "Scott", "confidence": 0.92, "ts": _time.time()})
    assert book.prompt_line() == "The person speaking is Scott."


def test_titles_replace_sir():
    from hubbubb_home.speakers import address, spoken_name

    book = SpeakerBook(None, "", "", titles="scott: sir\nAnna: ma'am")
    assert book.title_for("Scott") == "sir"
    assert book.title_for("anna") == "ma'am"
    assert book.title_for("Vega") == "Vega"  # known, no line: by name
    assert book.title_for(None) == ""
    assert SpeakerBook(None, "", "").title_for(None) == "sir"  # unconfigured

    assert address("On it sir.", "sir") == "On it sir."
    assert address("On it sir.", "Vega") == "On it Vega."
    assert address("Sir, the door is open.", "ma'am") == "Ma'am, the door is open."
    assert address("On it sir.", "") == "On it."
    assert address("Yes, sir. Done.", "") == "Yes. Done."
    assert address("Sir, the door is open.", "") == "The door is open."
    assert address("I desire coffee sir", "") == "I desire coffee"

    assert spoken_name("It's Anna.") == "Anna"
    assert spoken_name("this is vega") == "Vega"
    assert spoken_name("Hi, I'm Mary Jane") == "Mary Jane"
    assert spoken_name("scott") == "Scott"
    assert spoken_name("no") is None
    assert spoken_name("I'd rather not say who I am today") is None
    assert spoken_name("Jarvis", "Jarvis") is None


def test_voice_event_for_matches_text_not_recency():
    import asyncio
    import time as _t

    book = SpeakerBook(None, "", "")
    book.record({"text": "turn on the lights", "ts": _t.time(), "ask": True,
                 "person": None})
    run = asyncio.run
    assert run(book.async_event_for("Turn on the lights "))["ask"]
    assert run(book.async_event_for("something else", wait=0.1)) is None
    book.record({"text": "hello", "ts": _t.time(), "person": "Vega"})
    assert book.last_known == "Vega"


def test_speaker_map_parses_forgivingly():
    book = SpeakerBook(
        None, "", "a1: Scott\n\nnot a mapping line\n b2 :  Vega  \n: nobody\n"
    )
    assert book.resolve("a1")[0] == "Scott"
    assert book.resolve("b2")[0] == "Vega"


def test_speaker_events_need_the_token_when_one_is_set():
    import time as _time

    book = SpeakerBook(None, "", "", token="s3cret")
    book.record({"person": "Mallory", "confidence": 0.99, "ts": _time.time()})
    book.record({"person": "Mallory", "confidence": 0.99, "ts": _time.time(),
                 "token": "wrong"})
    assert book.resolve() == (None, 0.0, None)

    book.record({"person": "Scott", "confidence": 0.9, "ts": _time.time(),
                 "token": "s3cret"})
    assert book.resolve()[0] == "Scott"
    # The secret has no business sitting in the stored event.
    assert "token" not in book.events[-1]

    # No token configured: open as before, still stripped.
    open_book = SpeakerBook(None, "", "")
    open_book.record({"person": "Vega", "confidence": 0.9, "ts": _time.time(),
                      "token": "anything"})
    assert open_book.resolve()[0] == "Vega"
    assert "token" not in open_book.events[-1]


class _ProxyResp:
    def __init__(self, status, content_type, body):
        self.status, self.headers, self._body = status, {"Content-Type": content_type}, body

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        return False

    async def read(self):
        return self._body


class _ProxySession:
    """The voice service as the proxy sees it: records the call, answers once."""

    def __init__(self, answer):
        self.answer, self.calls = answer, []

    def request(self, method, url, **kwargs):
        self.calls.append((method, url, kwargs))
        if isinstance(self.answer, Exception):
            raise self.answer
        return _ProxyResp(*self.answer)


def test_voice_proxy_routing():
    import asyncio
    import json

    from hubbubb_home.speakers import VoiceProxyView, upstream_url

    def call(book, method, path, query="", body=b"", ctype="application/json"):
        return asyncio.run(book.async_proxy(method, path, query, body, ctype))

    # The view opens exactly the methods the studio needs; aiohttp 405s the rest.
    assert all(hasattr(VoiceProxyView, m) for m in ("get", "post", "delete"))
    assert not any(hasattr(VoiceProxyView, m) for m in ("put", "patch"))
    assert VoiceProxyView.requires_auth is True

    # Nothing configured: a 503 the panel can show, and no call goes out.
    status, ctype, body = call(SpeakerBook(None, "", ""), "GET", "clips")
    assert status == 503 and ctype == "application/json"
    assert json.loads(body) == {"ok": False, "detail": "no voice service is configured"}

    # Path joining: base without a trailing slash, segments re-quoted, the
    # token on the way out, query string kept but authSig (HA's signed-path
    # credential for <audio src>) dropped before it reaches the LAN service.
    session = _ProxySession((200, "application/json", b'{"clips": []}'))
    book = SpeakerBook(session, "http://mac:10301/", "", token="s3cret")
    assert call(book, "GET", "clips", "limit=5&authSig=abc") == (
        200, "application/json", b'{"clips": []}'
    )
    method, url, kwargs = session.calls[-1]
    assert (method, url) == ("GET", "http://mac:10301/clips?limit=5")
    assert kwargs["headers"] == {"X-Voice-Service-Token": "s3cret"}
    assert kwargs["data"] is None, "a bodiless GET must not send an empty body"

    # A POST carries its body and content type through untouched.
    call(book, "POST", "clips/2026-09-02T10:00:00", body=b'{"person": "Scott"}')
    method, url, kwargs = session.calls[-1]
    assert (method, url) == ("POST", "http://mac:10301/clips/2026-09-02T10%3A00%3A00")
    assert kwargs["data"] == b'{"person": "Scott"}'
    assert kwargs["headers"]["Content-Type"] == "application/json"

    # Audio comes back as audio, bytes and content type alike.
    wav = _ProxySession((200, "audio/wav", b"RIFF...."))
    status, ctype, body = call(SpeakerBook(wav, "http://mac:10301", ""), "GET", "clips/7/audio")
    assert (status, ctype, body) == (200, "audio/wav", b"RIFF....")
    assert wav.calls[-1][2]["headers"] == {}, "no token configured, none sent"

    # Upstream errors pass through with their own status; ours stay 405/404/503.
    bad = _ProxySession((404, "application/json", b'{"detail": "no clip"}'))
    assert call(SpeakerBook(bad, "http://mac:10301", ""), "DELETE", "clips/9")[0] == 404
    assert call(book, "PUT", "clips/9")[0] == 405
    assert len(session.calls) == 2, "a refused method never reaches the service"
    down = _ProxySession(sys.modules["aiohttp"].ClientError("refused"))
    status, ctype, body = call(SpeakerBook(down, "http://mac:10301", ""), "GET", "people")
    assert status == 503 and "unreachable" in json.loads(body)["detail"]

    # Nothing in a path may leave the configured base.
    base = "http://mac:10301"
    for escape in ("", "/", "../train", "clips/../../etc", "./clips", "clips//x", "clips/."):
        assert upstream_url(base, escape) is None, escape
        assert call(book, "GET", escape)[0] == 404, escape
    assert upstream_url(base, "record/status") == f"{base}/record/status"
    # Separators and schemes inside a segment are quoted, not interpreted.
    assert upstream_url(base, "clips/http:%2F%2Fevil/audio").startswith(f"{base}/clips/http%3A%252F")
    assert upstream_url(base, "clips/a b#c", "x=1&y=") == f"{base}/clips/a%20b%23c?x=1&y="


# --- approvals: the phone-tap gate -------------------------------------------

class _Bus:
    def __init__(self):
        self.handlers = []

    def async_listen(self, event, handler):
        self.handlers.append(handler)
        return lambda: self.handlers.remove(handler)

    def fire(self, action):
        for handler in list(self.handlers):
            handler(types.SimpleNamespace(data={"action": action}))


class _TapHass:
    """A hass whose notify service is answered by an instant tap (or never)."""

    def __init__(self, answer):
        self.answer = answer  # True=approve, False=deny, None=no tap
        self.bus = _Bus()
        self.sent = []
        outer = self

        class _Services:
            async def async_call(self, domain, service, data, blocking=False):
                outer.sent.append((f"{domain}.{service}", data))
                if outer.answer is None:
                    return
                actions = data["data"]["actions"]
                outer.bus.fire(actions[0 if outer.answer else 1]["action"])

        self.services = _Services()


def test_approver_lookup_is_case_insensitive():
    from hubbubb_home.approvals import Approvals

    appr = Approvals(None, "Jarvis", "Scott: notify.mobile_app_x\nbad line\n")
    assert appr.configured
    assert appr.approver_for("scott") == "notify.mobile_app_x"
    assert appr.approver_for("Vega") is None
    assert not Approvals(None, "Jarvis", "").configured


def test_approval_tap_deny_timeout_and_cache():
    import asyncio
    import time as _time

    from hubbubb_home import approvals as approvals_mod
    from hubbubb_home.approvals import Approvals

    lines = "Scott: notify.mobile_app_scott"

    # Approve: granted, notification carried both buttons, listener removed.
    hass = _TapHass(answer=True)
    appr = Approvals(hass, "Jarvis", lines)
    assert asyncio.run(appr.async_request("Scott", "Hubbubb request: inbox"))
    service, payload = hass.sent[0]
    assert service == "notify.mobile_app_scott"
    assert [a["title"] for a in payload["data"]["actions"]] == ["Approve", "Deny"]
    assert hass.bus.handlers == []

    # Cached: a second ask inside the window never rings the phone.
    hass.answer = False
    assert asyncio.run(appr.async_request("Scott", "again"))
    assert len(hass.sent) == 1

    # Expired: the deny now reaches the phone and fails closed.
    appr._approved["Scott"] -= 601
    assert not asyncio.run(appr.async_request("Scott", "later"))
    assert len(hass.sent) == 2

    # Timeout: nobody taps, fails closed.
    hass2 = _TapHass(answer=None)
    appr2 = Approvals(hass2, "Jarvis", lines)
    approvals_mod.REQUEST_TIMEOUT = 0.01
    try:
        assert not asyncio.run(appr2.async_request("Scott", "quiet"))
    finally:
        approvals_mod.REQUEST_TIMEOUT = 45
    assert hass2.bus.handlers == []

    # No device configured for the person: fails closed without a call.
    assert not asyncio.run(appr.async_request("Vega", "who?"))


def test_hubbubb_tool_gate_matrix():
    """A phone tap only for: shared puck, several linked accounts, unsure who."""
    import asyncio
    import time as _time

    from hubbubb_home.approvals import Approvals
    from hubbubb_home.llm_api import AskHubbubbTool

    class _Client:
        def __init__(self, who):
            self.who = who

        async def async_ask(self, request, **kwargs):
            return self.who

    class _Auth:
        async def async_get_user(self, user_id):
            return {
                "u-scott": types.SimpleNamespace(
                    name="Scott Landes", system_generated=False),
                "u-system": types.SimpleNamespace(
                    name="Supervisor", system_generated=True),
            }.get(user_id)

    hass = types.SimpleNamespace(auth=_Auth())

    def call(runtime, device_id=None, user_id=None):
        ctx = types.SimpleNamespace(
            device_id=device_id,
            context=types.SimpleNamespace(user_id=user_id),
        )
        return asyncio.run(
            AskHubbubbTool(runtime).async_call(
                hass, types.SimpleNamespace(tool_args={"request": "inbox?"}), ctx
            )
        )

    def house(people, answer=True):
        taps = _TapHass(answer=answer)
        return taps, types.SimpleNamespace(
            hubbubb=_Client("shared"),
            hubbubb_people={p: _Client(p) for p in people},
            speakers=SpeakerBook(None, "", "puck-bedroom: Scott"),
            approvals=Approvals(taps, "Jarvis",
                                "Scott: notify.mobile_app_scott\n"
                                "Vega: notify.mobile_app_vega"),
        )

    # Phone app, signed in as Scott: his own account, no tap - even with a
    # stranger's voice event lying around and two accounts linked.
    taps, rt = house(["scott", "vega"])
    rt.speakers.record({"person": None, "confidence": 0.1, "ts": _time.time()})
    assert call(rt, user_id="u-scott") == {"answer": "scott"}
    assert taps.sent == []

    # A system user is not a person; falls through to the puck rules.
    assert call(rt, user_id="u-system")["error"] == "speaker_not_verified"

    # Bedroom puck mapped to Scott: his room, no tap.
    taps, rt = house(["scott", "vega"])
    assert call(rt, device_id="puck-bedroom") == {"answer": "scott"}
    assert taps.sent == []

    # Shared puck, one linked account: nobody to confuse them with, no tap.
    taps, rt = house(["scott"])
    assert call(rt, device_id="puck-kitchen") == {"answer": "scott"}
    taps, rt = house([])
    assert call(rt, device_id="puck-kitchen") == {"answer": "shared"}
    assert taps.sent == []

    # Shared puck, two accounts, confident voice or "this is Scott": no tap.
    taps, rt = house(["scott", "vega"])
    rt.speakers.record({"person": "Scott", "confidence": 0.8, "ts": _time.time()})
    assert call(rt, device_id="puck-kitchen") == {"answer": "scott"}
    rt.speakers.set_override("Vega")
    assert call(rt, device_id="puck-kitchen") == {"answer": "vega"}
    assert taps.sent == []

    # Shared puck, two accounts, only a lean: ring the leaned-on phone.
    taps, rt = house(["scott", "vega"])
    rt.speakers.record({"person": "Scott", "confidence": 0.6, "ts": _time.time()})
    assert call(rt, device_id="puck-kitchen") == {"answer": "scott"}
    assert [s for s, _ in taps.sent] == ["notify.mobile_app_scott"]

    # ...denied: final.
    taps, rt = house(["scott", "vega"], answer=False)
    rt.speakers.record({"person": "Scott", "confidence": 0.6, "ts": _time.time()})
    assert "did not approve" in call(rt, device_id="puck-kitchen")["error"]

    # ...no idea at all, or a lean with no approvers to ring: ask who.
    taps, rt = house(["scott", "vega"])
    assert call(rt, device_id="puck-kitchen")["error"] == "speaker_not_verified"
    rt.approvals = Approvals(None, "Jarvis", "")
    rt.speakers.record({"person": "Scott", "confidence": 0.6, "ts": _time.time()})
    assert call(rt, device_id="puck-kitchen")["error"] == "speaker_not_verified"
    assert taps.sent == []


def test_people_lines_split_on_the_first_two_colons_only():
    from hubbubb_home.hubbubb import parse_people

    people = parse_people(
        "Scott Landes: hbbc_abc : s3cr3t:with:colons\n"
        "vega:id2:sec2\n"
        "no secret here: just_an_id\n"
        "\n",
    )
    assert people == {
        "scott landes": ("hbbc_abc", "s3cr3t:with:colons"),
        "vega": ("id2", "sec2"),
    }
    assert parse_people("") == {}


def test_people_map_rewrites_one_line_and_leaves_the_rest_alone():
    from hubbubb_home.links import hint, remove_line, set_line

    before = (
        "Scott Landes:  hbbc_abc :s3cr3t:with:colons\n"
        "\n"
        "   vega : id2 : sec2   \n"
        "no secret here: just_an_id\n"
    )
    # Change one: only that line moves, case-blind; the trailing newline stays.
    after = set_line(before, "scott landes", "hbbc_new", "n3w")
    assert after == (
        "scott landes: hbbc_new : n3w\n"
        "\n"
        "   vega : id2 : sec2   \n"
        "no secret here: just_an_id\n"
    )
    # Add one: appended, nothing else touched.
    assert set_line(before, "Guest", "gid", "gsec") == before + "Guest: gid : gsec\n"
    assert set_line("", "Guest", "gid", "gsec") == "Guest: gid : gsec"
    assert set_line("Vega: a : b", "Guest", "gid", "gsec") == "Vega: a : b\nGuest: gid : gsec"
    # Remove one: the line goes, the blank and the half-written line do not.
    assert remove_line(before, "VEGA") == (
        "Scott Landes:  hbbc_abc :s3cr3t:with:colons\n"
        "\n"
        "no secret here: just_an_id\n"
    )
    assert remove_line(before, "nobody") == before
    # A duplicate would win on read (the parser keeps the last), so it goes.
    assert set_line("a: 1 : x\na: 2 : y\n", "a", "3", "z") == "a: 3 : z\n"
    # The hint gives away a prefix and a length, never the id.
    assert hint("hbbc_abcdefghijklmnop") == "hbbc_a… (21 characters)"
    assert hint("ab") == "ab… (2 characters)"


def test_people_links_endpoint_decisions():
    import asyncio
    import json

    from hubbubb_home import links as links_mod
    from hubbubb_home.hubbubb import HubbubbError, parse_people
    from hubbubb_home.links import PeopleLinksView, async_links

    assert PeopleLinksView.requires_auth is True
    assert all(hasattr(PeopleLinksView, m) for m in ("get", "post", "delete"))

    class _Verify:
        """HubbubbClient as the endpoint sees it: one secret is right."""

        made = []
        # What the agent says to "who am I?": a string, or an exception.
        answer = "Vega Landes, vega@example.com"

        def __init__(self, session, url, client_id, secret):
            _Verify.made.append((url, client_id, secret))
            self._ok = secret == "right"

        async def async_verify(self):
            if not self._ok:
                raise HubbubbError("token endpoint returned 401")

        async def async_ask(self, question, wait=25, timeout=90):
            assert "Which Hubbubb user am I" in question
            assert wait <= 10 and timeout <= 10, "the identity ask has its own short clock"
            if isinstance(_Verify.answer, Exception):
                raise _Verify.answer
            if _Verify.answer == "hang":
                await asyncio.sleep(3600)
            return _Verify.answer

    links_mod.HubbubbClient = _Verify

    writes = []

    def _hass(entries, speakers=None):
        def update(entry, data):
            writes.append(data)
            entry.data = data

        return types.SimpleNamespace(
            config_entries=types.SimpleNamespace(
                async_entries=lambda domain: entries, async_update_entry=update
            ),
            data={"hubbubb_home": {"e": types.SimpleNamespace(speakers=speakers)}}
            if speakers
            else {},
        )

    def call(hass, admin, method, person=None, body=None):
        status, ctype, payload = asyncio.run(
            async_links(hass, admin, method, person, body)
        )
        return status, (json.loads(payload) if "json" in ctype else payload.decode())

    # No Hubbubb configured: a 503 the panel hides the controls on, no write.
    bare = types.SimpleNamespace(data={"hubbubb": {}}, options={})
    assert call(_hass([bare]), True, "GET") == (
        503, {"ok": False, "detail": "Hubbubb is not configured"}
    )
    assert call(_hass([]), True, "POST", body={"person": "a", "client_id": "b", "client_secret": "right"})[0] == 503
    assert writes == []

    entry = types.SimpleNamespace(
        data={
            "hubbubb": {
                "hubbubb_url": "https://hub.example/api/v1/org/mcp",
                "hubbubb_client_id": "house",
                "hubbubb_client_secret": "hs",
                "people": "Scott: hbbc_scott : sekrit\n",
            },
            "assistant_name": "Jarvis",
        },
        options={"voice": {}},
    )
    # The voice service knows Scott (as "scott") and Vega; the map knows Scott.
    voice = SpeakerBook(
        _ProxySession((200, "application/json", b'{"scott": 4, "Vega": 2}')),
        "http://mac:10301",
        "",
    )
    hass = _hass([entry], voice)

    # Reading is for anyone logged in, and never carries a secret or an id.
    status, listed = call(hass, False, "GET")
    assert status == 200
    assert listed == {
        "people": {
            "Scott": {"linked": True, "via": "key", "client_id_hint": "hbbc_s… (10 characters)", "identity": None},
            "Vega": {"linked": False},
        },
        "signin": False,
    }
    assert "sekrit" not in json.dumps(listed) and "hbbc_scott" not in json.dumps(listed)

    # Writing is not: a non-admin is refused before anything is checked.
    assert call(hass, False, "POST", body={"person": "Vega", "client_id": "hbbc_vega", "client_secret": "right"})[0] == 403
    assert call(hass, False, "DELETE", person="Scott")[0] == 403
    assert writes == [] and _Verify.made == []

    # A bad pair is refused by Hubbubb, with the reason, and nothing is kept.
    status, text = call(hass, True, "POST", body={"person": "Vega", "client_id": "hbbc_vega", "client_secret": "wrong"})
    assert status == 400 and "401" in text
    assert writes == []
    # Half a body, or a name the line format cannot hold, never reaches Hubbubb.
    assert call(hass, True, "POST", body={"person": "Vega", "client_id": "x"})[0] == 400
    assert call(hass, True, "POST", body="junk")[0] == 400
    assert call(hass, True, "POST", body={"person": "a:b", "client_id": "x", "client_secret": "right"})[0] == 400
    assert len(_Verify.made) == 1

    # A good pair is checked against the configured URL, then written into
    # the entry's data with every other key intact and Scott's line untouched.
    status, row = call(hass, True, "POST", body={"person": " Vega ", "client_id": "hbbc_vega", "client_secret": "right"})
    assert status == 200
    assert row == {
        "person": "Vega",
        "linked": True,
        "client_id_hint": "hbbc_v… (9 characters)",
        "identity": "Vega Landes, vega@example.com",
    }
    assert writes[0].get("hubbubb_tokens") == {}, "the pasted path never invents a token record"
    assert _Verify.made[-1] == ("https://hub.example/api/v1/org/mcp", "hbbc_vega", "right")
    assert len(writes) == 1
    assert writes[0]["assistant_name"] == "Jarvis"
    assert writes[0]["hubbubb"]["hubbubb_client_id"] == "house"
    assert writes[0]["hubbubb"]["people"] == "Scott: hbbc_scott : sekrit\nVega: hbbc_vega : right\n"
    # The identity lives beside the map, keyed by credential, so the map
    # itself still parses exactly as it always has.
    assert writes[0]["hubbubb_identities"] == {"hbbc_vega": "Vega Landes, vega@example.com"}
    assert parse_people(writes[0]["hubbubb"]["people"]) == {
        "scott": ("hbbc_scott", "sekrit"),
        "vega": ("hbbc_vega", "right"),
    }
    vega = call(hass, True, "GET")[1]["people"]["Vega"]
    assert vega["linked"] is True and vega["identity"] == "Vega Landes, vega@example.com"

    # Unlinking removes only that line, and whatever Hubbubb said about it.
    assert call(hass, True, "DELETE", person="scott") == (200, {"person": "scott", "linked": False})
    assert writes[-1]["hubbubb"]["people"] == "Vega: hbbc_vega : right\n"
    assert call(hass, True, "DELETE", person="VEGA")[0] == 200
    assert writes[-1]["hubbubb"]["people"] == ""
    assert writes[-1]["hubbubb_identities"] == {}
    call(hass, True, "POST", body={"person": "Vega", "client_id": "hbbc_vega", "client_secret": "right"})
    assert call(hass, True, "DELETE")[0] == 400
    assert call(hass, True, "PUT")[0] == 405

    # The voice service being down only shortens the list; it is not an error.
    down = SpeakerBook(_ProxySession(sys.modules["aiohttp"].ClientError("refused")), "http://mac:10301", "")
    assert call(_hass([entry], down), False, "GET")[1] == {
        "people": {"Vega": {"linked": True, "via": "key", "client_id_hint": "hbbc_v… (9 characters)", "identity": "Vega Landes, vega@example.com"}},
        "signin": False,
    }

    # The identity is a nicety, never a gate: whatever the ask does - fails,
    # is still running, hangs past its clock, or answers nonsense - the pair
    # is kept and the row simply has no name.
    from hubbubb_home.hubbubb import HubbubbPending
    from hubbubb_home import links as _links

    _links._IDENTITY_SECONDS = -4  # the hard cap is this plus five: one second, not fifteen
    for answer in (
        HubbubbError("Hubbubb HTTP 500: ai_not_configured"),
        HubbubbPending("run-1"),
        "hang",
        "I'm sorry, I cannot determine which user you are authenticated as.",
        "",
        None,
    ):
        _Verify.answer = answer
        status, row = call(hass, True, "POST", body={"person": "Guest", "client_id": "hbbc_guest", "client_secret": "right"})
        assert status == 200 and row["linked"] is True and row["identity"] is None, answer
        assert "hbbc_guest" not in writes[-1]["hubbubb_identities"]
        assert parse_people(writes[-1]["hubbubb"]["people"])["guest"] == ("hbbc_guest", "right")
        assert call(hass, True, "GET")[1]["people"]["Guest"]["identity"] is None
    # Re-linking a person with a new pair forgets what was said about the old one.
    _Verify.answer = "Guest Person, guest@example.com"
    call(hass, True, "POST", body={"person": "Guest", "client_id": "hbbc_guest", "client_secret": "right"})
    assert writes[-1]["hubbubb_identities"]["hbbc_guest"] == "Guest Person, guest@example.com"
    call(hass, True, "POST", body={"person": "guest", "client_id": "hbbc_other", "client_secret": "right"})
    assert writes[-1]["hubbubb_identities"] == {
        "hbbc_vega": "Vega Landes, vega@example.com",
        "hbbc_other": "Guest Person, guest@example.com",
    }

    # What counts as an identity: one line naming a person, with or without
    # their address. A name alone counts because a live run does not always
    # have the email to hand - measured against the local instance, which
    # answers with the name in bold and an apology about the address.
    from hubbubb_home.links import identity_of

    assert identity_of("Scott Scott, scott@thehubbubb.com") == "Scott Scott, scott@thehubbubb.com"
    assert identity_of("  Scott Scott,scott@thehubbubb.com\n") == "Scott Scott,scott@thehubbubb.com"
    assert identity_of("Scott Landes") == "Scott Landes"
    assert identity_of("**Scott Landes**") == "Scott Landes"
    assert identity_of("Scott Landes\nand some waffle after it") == "Scott Landes"
    for junk in (
        "scott@thehubbubb.com",
        "You are Scott. Email: scott@x.com",
        "**Scott Landes** - but I cannot retrieve your email address from the tools I have",
        "I'm sorry, I cannot determine that",
        "a, b",
        "x, y@z",
        None,
        3,
    ):
        assert identity_of(junk) is None, junk


def test_hubbubb_tool_uses_the_verified_persons_own_client():
    import asyncio
    import time as _time

    from hubbubb_home.approvals import Approvals
    from hubbubb_home.llm_api import AskHubbubbTool

    class _Client:
        def __init__(self, who):
            self.who = who
            self.calls = 0

        async def async_ask(self, request, **kwargs):
            self.calls += 1
            return f"answered as {self.who}"

    def call(runtime):
        return asyncio.run(
            AskHubbubbTool(runtime).async_call(
                None,
                types.SimpleNamespace(tool_args={"request": "inbox?"}),
                None,
            )
        )

    shared, scotts = _Client("shared"), _Client("scott")
    book = SpeakerBook(None, "", "")
    runtime = types.SimpleNamespace(
        hubbubb=shared,
        hubbubb_people={"scott": scotts},
        speakers=book,
        approvals=Approvals(_TapHass(answer=True), "Jarvis",
                            "Scott: notify.mobile_app_scott"),
    )

    # Verified Scott gets Scott's client, never the shared one.
    book.record({"person": "Scott", "confidence": 0.95, "ts": _time.time()})
    assert call(runtime) == {"answer": "answered as scott"}
    assert (shared.calls, scotts.calls) == (0, 1)

    # A verified person with no linked account: refused, shared NOT used.
    vega = SpeakerBook(None, "", "")
    vega.set_override("Vega")
    runtime.speakers = vega
    runtime.approvals = Approvals(_TapHass(answer=True), "Jarvis",
                                  "Vega: notify.mobile_app_vega")
    result = call(runtime)
    assert "No Hubbubb account is linked for Vega" in result["error"]
    assert shared.calls == 0

    # Two accounts linked and no approvers: identity is still demanded...
    lone = types.SimpleNamespace(
        hubbubb=shared,
        hubbubb_people={"scott": scotts, "vega": _Client("vega")},
        speakers=SpeakerBook(None, "", ""),
        approvals=Approvals(None, "Jarvis", ""),
    )
    assert call(lone)["error"] == "speaker_not_verified"
    # ...and a told identity picks their client without any tap.
    lone.speakers.set_override("Scott")
    assert call(lone) == {"answer": "answered as scott"}
    assert shared.calls == 0


# --- hubbubb: the REST runs transport ----------------------------------------

class _RunsResp:
    def __init__(self, status, payload):
        self.status = status
        self._payload = payload

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        return False

    async def json(self):
        return self._payload


class _RunsSession:
    """Answers /oauth/token from one queue and everything else from another."""

    def __init__(self, tokens, runs):
        self.tokens, self.runs = list(tokens), list(runs)
        self.calls = []

    def post(self, url, **kwargs):
        self.calls.append(("POST", url))
        return _RunsResp(*self.tokens.pop(0))

    def request(self, method, url, **kwargs):
        self.calls.append((method, url))
        return _RunsResp(*self.runs.pop(0))


def test_hubbubb_url_derivation():
    from hubbubb_home.hubbubb import HubbubbClient

    for url in ("https://h.example/api/v1/org7/mcp",
                "https://h.example/api/v1/org7",
                "https://h.example/api/v1/org7/mcp/"):
        client = HubbubbClient(None, url, "id", "secret")
        assert client._runs_url == "https://h.example/api/v1/org7/ai/runs", url
        assert client._token_url == "https://h.example/oauth/token"


def test_hubbubb_token_cache_and_remint_on_401():
    import asyncio

    from hubbubb_home.hubbubb import HubbubbClient

    token = (200, {"access_token": "t", "expires_in": 3600})
    session = _RunsSession(
        tokens=[token, token],
        runs=[
            (401, {"error": "invalid_token"}),  # stale -> one re-mint
            (200, {"id": "r1", "finished": True, "summary": "hello"}),
            (200, {"id": "r2", "finished": True, "summary": "again"}),
        ],
    )
    client = HubbubbClient(session, "https://h.example/api/v1/o/mcp", "i", "s")
    assert asyncio.run(client.async_ask("hi")) == "hello"
    # Second ask: cached token, no third mint.
    assert asyncio.run(client.async_ask("hi")) == "again"
    assert sum(1 for m, u in session.calls if u.endswith("/oauth/token")) == 2


def test_hubbubb_ask_polls_to_the_answer_or_raises_pending():
    import asyncio

    from hubbubb_home import hubbubb as hubbubb_mod
    from hubbubb_home.hubbubb import HubbubbClient, HubbubbError, HubbubbPending

    token = (200, {"access_token": "t", "expires_in": 3600})
    hubbubb_mod._POLL_SECONDS = 0
    try:
        # Not finished at first, finished on the poll.
        session = _RunsSession(
            tokens=[token],
            runs=[(200, {"id": "r9", "finished": False}),
                  (200, {"id": "r9", "finished": True, "summary": "done"})],
        )
        client = HubbubbClient(session, "https://h/api/v1/o/mcp", "i", "s")
        assert asyncio.run(client.async_ask("slow", wait=0)) == "done"
        assert ("GET", "https://h/api/v1/o/ai/runs/r9") in session.calls

        # Past the deadline: pending carries the run id, run not abandoned.
        session2 = _RunsSession(
            tokens=[token], runs=[(200, {"id": "r10", "finished": False})]
        )
        client2 = HubbubbClient(session2, "https://h/api/v1/o", "i", "s")
        try:
            asyncio.run(client2.async_ask("slower", wait=0, timeout=0))
            raise AssertionError("expected HubbubbPending")
        except HubbubbPending as pending:
            assert pending.run_id == "r10"

        # API error codes come back speakable.
        session3 = _RunsSession(
            tokens=[token], runs=[(429, {"error": "too_many_active_runs"})]
        )
        client3 = HubbubbClient(session3, "https://h/api/v1/o", "i", "s")
        try:
            asyncio.run(client3.async_ask("busy"))
            raise AssertionError("expected HubbubbError")
        except HubbubbPending:
            raise AssertionError("a 429 is an error, not pending")
        except HubbubbError as err:
            assert "too many requests" in str(err)
    finally:
        hubbubb_mod._POLL_SECONDS = 3


def test_hubbubb_tool_pending_hands_off_and_announces():
    import asyncio
    import time as _time

    from hubbubb_home.approvals import Approvals
    from hubbubb_home.hubbubb import HubbubbPending
    from hubbubb_home.llm_api import AskHubbubbTool

    class _SlowClient:
        def __init__(self):
            self.background = None

        async def async_ask(self, request, **kwargs):
            raise HubbubbPending("r42")

        def async_wait_background(self, run_id, on_done, timeout=300):
            self.background = (run_id, on_done)

    spoken = []

    async def announce(text):
        spoken.append(text)

    client = _SlowClient()
    book = SpeakerBook(None, "", "")
    book.record({"person": "Scott", "confidence": 0.95, "ts": _time.time()})
    runtime = types.SimpleNamespace(
        hubbubb=client,
        hubbubb_people={},
        speakers=book,
        approvals=Approvals(None, "Jarvis", ""),
        announce_message=announce,
    )
    result = asyncio.run(
        AskHubbubbTool(runtime).async_call(
            None, types.SimpleNamespace(tool_args={"request": "audit"}), None
        )
    )
    assert result["pending"] is True
    run_id, on_done = client.background
    assert run_id == "r42"
    asyncio.run(on_done("3 unread", True))
    asyncio.run(on_done("it broke", False))
    assert spoken == ["Hubbubb says: 3 unread",
                      "Hubbubb couldn't finish that: it broke"]


# --- timers ------------------------------------------------------------------

class _Hass:
    def async_create_task(self, coro):
        coro.close()


async def _noop(_timer):
    pass


def test_timer_start_cancel_and_lookup():
    pool = TimerPool(_Hass(), _noop)
    pasta = pool.start("pasta", 600)
    eggs = pool.start("eggs", 300)

    # No name means the one finishing soonest, not the one started first.
    assert pool.find(None).id == eggs.id
    assert pool.find("pasta").id == pasta.id
    # Partial matches count: people say "the egg timer".
    assert pool.find("egg").id == eggs.id
    assert pool.find("lasagne") is None

    pool.cancel(eggs)
    assert [t.id for t in pool.timers] == [pasta.id]
    assert pool.find(None).id == pasta.id


def test_timer_slot_limit_and_zero_duration():
    pool = TimerPool(_Hass(), _noop)
    for i in range(5):
        pool.start(f"t{i}", 60 * (i + 1))
    try:
        pool.start("one too many", 60)
    except ValueError as err:
        assert "already" in str(err)
    else:
        raise AssertionError("the sixth timer should have been refused")

    try:
        TimerPool(_Hass(), _noop).start("instant", 0)
    except ValueError:
        pass
    else:
        raise AssertionError("a zero-length timer should have been refused")


def test_adding_time_moves_the_finish_and_keeps_the_bar_honest():
    pool = TimerPool(_Hass(), _noop)
    timer = pool.start("bread", 600)
    pool.add_time(timer, 300)
    assert round(timer.remaining()) == 900
    # duration must grow too, or the card's progress bar renders over 100%.
    assert timer.duration >= 900

    pool.add_time(timer, -800)
    assert round(timer.remaining()) == 100
    # Never negative: the bar and the spoken "time left" both read this.
    pool.add_time(timer, -9999)
    assert timer.remaining() == 0


def test_pause_and_resume_hold_the_remainder():
    pool = TimerPool(_Hass(), _noop)
    timer = pool.start("rest", 600)
    pool.pause(timer)
    assert timer.paused and round(timer.remaining()) == 600
    # Nothing armed while paused, or it fires anyway.
    assert timer._cancel is None
    pool.resume(timer)
    assert not timer.paused and round(timer.remaining()) == 600


def test_cancel_all_disarms_everything():
    pool = TimerPool(_Hass(), _noop)
    _scheduled.clear()
    for i in range(3):
        pool.start(f"t{i}", 60)
    assert len(_scheduled) == 3
    assert pool.cancel_all() == 3
    assert _scheduled == [], "a cancelled timer must not still be scheduled"


def test_builtin_timer_slot_resolution():
    from hubbubb_home.intents import _meant

    pool = TimerPool(_Hass(), _noop)
    pasta = pool.start("pasta", 600)
    eggs = pool.start("eggs", 300)

    assert _meant(pool, {"name": {"value": "pasta"}}).id == pasta.id
    # "cancel the five minute timer" arrives as start_* slots, no name.
    assert _meant(pool, {"start_minutes": {"value": 5}}).id == eggs.id
    assert _meant(pool, {"start_minutes": {"value": 7}}) is None
    # Bare reference: the next timer to finish.
    assert _meant(pool, {}).id == eggs.id


# --- findings ----------------------------------------------------------------

def test_findings_speech_only_mentions_what_was_repaired():
    """Offline and gone-quiet counts are kept, not read out - they were the
    morning's least useful sentence for a month."""
    import asyncio

    report = FindingsReport(None)
    assert report.spoken("Athena") == ""
    asyncio.run(
        report.async_update(
            [
                {"kind": "dead", "entity_id": "a", "detail": "x"},
                {"kind": "quiet", "entity_id": "b", "detail": "y"},
                {"kind": "quiet", "entity_id": "c", "detail": "z"},
            ]
        )
    )
    assert report.spoken("Athena") == "", report.spoken("Athena")
    assert len(report.items) == 3
    asyncio.run(
        report.async_update([{"kind": "drift", "entity_id": "light.all_lights", "detail": "d"}])
    )
    assert "1 configuration problem" in report.spoken("Athena")


# --- review: every proposal kept, and decided on separately ------------------

_REPORT = """# Nightly review

## Defects

**1. The digest re-ingests its own brief**
Digest bullet 2 begins with the PREAMBLE. Skip it.

**2. Whisper hears lights as weights.**
"Turn all weights to 50%" three times.

## SUGGESTIONS

**1. Named timers by voice**
Asked a dozen times.

```yaml-draft
- id: jarvis_draft_named_timers
  alias: "Jarvis draft - named timers"
  initial_state: false
```

FINDINGS: 2
"""


def test_review_parses_items_and_keeps_decisions_across_nights():
    import asyncio

    items = parse_proposals(_REPORT)
    assert [i["id"] for i in items] == [
        "defect_the_digest_re_ingests_its_own_brief",
        "defect_whisper_hears_lights_as_weights",
        "suggestion_named_timers_by_voice",
    ], items
    assert items[0]["body"] == "Digest bullet 2 begins with the PREAMBLE. Skip it."
    assert "FINDINGS" not in items[2]["body"]
    assert items[2]["yaml"].startswith("- id: jarvis_draft_named_timers")
    assert items[1]["yaml"] == ""

    report = ReviewReport(None)
    asyncio.run(report.async_update(report=_REPORT, findings=2, drafts=[], detail=""))
    assert len(report.by_status("pending")) == 3
    asyncio.run(report.async_decide("defect_whisper_hears_lights_as_weights", "rejected"))
    asyncio.run(report.async_decide("suggestion_named_timers_by_voice", "accepted"))
    # The same report the next night neither duplicates nor resets anything.
    asyncio.run(report.async_update(report=_REPORT, findings=2, drafts=[], detail=""))
    assert len(report.proposals) == 3
    assert report.get("suggestion_named_timers_by_voice")["status"] == "accepted"
    speech = report.spoken()
    assert "1 proposal is waiting" in speech, speech
    assert "1 accepted one is ready" in speech, speech
    try:
        asyncio.run(report.async_decide("nope", "accepted"))
        raise AssertionError("unknown proposal must raise")
    except ValueError:
        pass

    # A store reloaded after a restart still has every decision.
    again = ReviewReport(None)
    asyncio.run(again.async_load())
    assert again.get("defect_whisper_hears_lights_as_weights")["status"] == "rejected"


def test_review_says_so_when_it_has_stopped_running():
    import asyncio

    report = ReviewReport(None)
    assert report.spoken() == "The overnight review has not run since never sir."
    asyncio.run(report.async_update(report=_REPORT, findings=2, drafts=[], detail=""))
    assert report.spoken().startswith("Also sir - overnight I left 2 defects.")
    report.last_run = "2026-08-01T04:00:00+00:00"
    assert report.spoken() == "The overnight review has not run since August 1 sir."


def test_findings_survive_a_restart_and_keep_their_first_seen():
    """The defect this guards: a fault found on Tuesday and not acted on
    vanishing by Wednesday, which teaches people to stop listening."""
    import asyncio

    _Store._disk.clear()
    report = FindingsReport(None)

    async def _first_night():
        await report.async_load()
        await report.async_update(
            [{"kind": "quiet", "entity_id": "media_player.tv", "detail": "tv"}]
        )

    asyncio.run(_first_night())
    first_seen = report.items[0]["first_seen"]
    assert first_seen

    # Home Assistant restarts: a brand-new report object, same store.
    revived = FindingsReport(None)
    asyncio.run(revived.async_load())
    assert revived.items and revived.items[0]["entity_id"] == "media_player.tv"
    assert revived.last_run

    # Tonight finds the same fault again. It must not read as new.
    async def _second_night():
        await revived.async_update(
            [
                {"kind": "quiet", "entity_id": "media_player.tv", "detail": "tv"},
                {"kind": "dead", "entity_id": "light.hall", "detail": "hall"},
            ]
        )

    asyncio.run(_second_night())
    carried = {f["entity_id"]: f["first_seen"] for f in revived.items}
    assert carried["media_player.tv"] == first_seen, "first_seen must carry forward"
    assert carried["light.hall"] != "", "a new finding still gets a date"

    # And a fixed fault must actually leave.
    asyncio.run(revived.async_update([]))
    assert revived.items == []


def test_days_reads_as_speech_not_as_a_clock():
    assert _days(0.25) == "6 hours"
    assert _days(1) == "1 day"
    assert _days(3.4) == "3 days"


# --- apple tv: which music plan a query becomes ------------------------------

_ADELE = {"artistName": "Adele", "artistId": 262836961,
          "artistLinkUrl": "https://music.apple.com/us/artist/adele/262836961"}
_HELLO = {"trackName": "Hello", "trackId": 1051394215, "trackNumber": 1,
          "trackViewUrl": "https://music.apple.com/us/album/hello/1?i=2"}


def test_bare_artist_query_shuffles_the_artist_page():
    plan = decide_plan(_ADELE, _HELLO, "adele", song_said=False, station=False)
    assert plan["kind"] == "artist" and "adele" in plan["url"]


def test_famous_song_beats_obscure_artist_of_the_same_name():
    # An artist literally named "Thriller" exists; the song must win.
    thriller_artist = {"artistName": "Thriller", "artistId": 1}
    thriller_song = {"trackName": "Thriller", "trackId": 2, "trackNumber": 4,
                     "trackViewUrl": "https://music.apple.com/x?i=4"}
    plan = decide_plan(
        thriller_artist, thriller_song, "thriller",
        song_said=False, station=False,
    )
    assert plan["kind"] == "song" and plan["row"] == 4


def test_explicit_song_by_artist_never_becomes_the_artist_page():
    plan = decide_plan(_ADELE, _HELLO, "hello adele", song_said=True, station=False)
    assert plan["kind"] == "song"


def test_station_request_seeds_from_the_artist_when_it_is_one():
    plan = decide_plan(_ADELE, _HELLO, "adele", song_said=False, station=True)
    assert plan["kind"] == "radio" and str(_ADELE["artistId"]) in plan["url"]


def test_station_request_seeds_from_the_song_otherwise():
    plan = decide_plan(None, _HELLO, "hello", song_said=False, station=True)
    assert plan["kind"] == "radio" and str(_HELLO["trackId"]) in plan["url"]


def test_no_hits_is_a_spoken_apology_not_a_crash():
    assert decide_plan(None, None, "xyzzy", song_said=False, station=False) is None
    assert decide_plan(None, None, "xyzzy", song_said=False, station=True) is None


def test_app_matching_forgives_spacing_case_and_plus():
    apps = ["Netflix", "Disney+", "Prime Video", "YouTube"]
    assert _match_source("disney plus", apps) == "Disney+"
    assert _match_source("NETFLIX", apps) == "Netflix"
    assert _match_source("prime", apps) == "Prime Video"
    assert _match_source("plex", apps) is None


def test_sentence_template_takes_the_room_list():
    rooms = '      - "den"\n      - "loft"\n'
    out = _TEMPLATE.replace("__ROOMS__\n", rooms)
    assert "__ROOMS__" not in out
    assert '- "den"' in out and '- "loft"' in out
    # The greedy wildcards stay declared, or hassil refuses the whole file.
    for wildcard in ("ma_query", "ma_song", "ma_artist", "atv_app", "atv_show"):
        assert f"{wildcard}:\n    wildcard: true" in out, wildcard


def test_guest_tier_refusal_matrix():
    import asyncio
    import time as _time

    from hubbubb_home.llm_api import EscalateTool, RememberTool

    class _Memory:
        def __init__(self):
            self.added = []

        async def async_add(self, fact, person=""):
            self.added.append((fact, person))
            return fact

    class _Companion:
        def __init__(self):
            self.sent = []
            self.configured = True

        async def async_call(self, endpoint, payload, method="POST"):
            self.sent.append(payload["text"])

    def runtime(book):
        return types.SimpleNamespace(
            memory=_Memory(), companion=_Companion(), speakers=book
        )

    def remember(rt):
        return asyncio.run(RememberTool(rt).async_call(
            None, types.SimpleNamespace(tool_args={"fact": "the gate code is 4"}),
            None))

    def escalate(rt):
        return asyncio.run(EscalateTool(rt).async_call(
            None, types.SimpleNamespace(tool_args={"request": "refactor it"}),
            None))

    # Speaker ID on, nobody recognized: a guest. Memory stays closed - an
    # unrecognized voice must not write durable facts, and the television
    # scores as high as a real but noisy utterance.
    guest = runtime(SpeakerBook(None, "http://svc:10301", ""))
    assert "error" in remember(guest) and guest.memory.added == []
    # Escalation is deliberately OPEN to guests since 2026-09-01. It is the
    # local model's only route out of a request it cannot serve, and "guest"
    # in practice means Scott on a noisy utterance about half the time, so
    # gating it made the house refuse its owner and demand he identify
    # himself. Unattributed here, prefixed with the name when one is known.
    assert escalate(guest) == {"handed_off": True}
    assert guest.companion.sent == ["refactor it"]

    # Speaker ID on and the voice known: both open, escalation attributed.
    known_book = SpeakerBook(None, "http://svc:10301", "")
    known_book.record({"person": "Scott", "confidence": 0.9, "ts": _time.time()})
    known = runtime(known_book)
    assert remember(known)["stored"]
    assert escalate(known) == {"handed_off": True}
    assert known.companion.sent == ["[Scott] refactor it"]

    # Speaker ID off: exactly the old open behavior, household memory.
    off = runtime(SpeakerBook(None, "", ""))
    assert remember(off)["for"] == "the household"
    assert escalate(off) == {"handed_off": True}
    # And the guest prompt line only exists when speaker ID is on.
    assert "guest" in SpeakerBook(None, "http://svc:10301", "").prompt_line()
    assert "guest" not in SpeakerBook(None, "", "").prompt_line()

    # No prompt line may invite the model to challenge the speaker. A middling
    # score is the common case with a thin profile, and "(not confirmed by
    # voice)" read to a 4B model as an instruction to go and confirm, which is
    # what turned every other exchange into "who am I speaking to?".
    unsure = SpeakerBook(None, "http://svc:10301", "")
    unsure.record({"person": "Scott", "confidence": 0.66, "ts": _time.time()})
    line = unsure.prompt_line()
    assert "Scott" in line and "not confirmed" not in line, line
    assert "do not ask them to confirm" in line, line

    sure = SpeakerBook(None, "http://svc:10301", "")
    sure.record({"person": "Scott", "confidence": 0.95, "ts": _time.time()})
    assert sure.prompt_line() == "The person speaking is Scott."

    # The guest line must not open with an identity demand either.
    guest_line = SpeakerBook(None, "http://svc:10301", "").prompt_line()
    assert "Do not open the conversation by asking who is speaking" in guest_line


def test_person_calendar_map_parses_lines():
    from hubbubb_home.intents import parse_calendar_map

    people = parse_calendar_map(
        "Scott: calendar.scott_work, calendar.family\n"
        "bad line\n"
        "Vega: calendar.vega\n"
    )
    assert people == {
        "scott": ["calendar.scott_work", "calendar.family"],
        "vega": ["calendar.vega"],
    }
    assert parse_calendar_map("") == {}


def test_intercom_finds_satellites_by_area():
    from hubbubb_home.intents import satellites_in_area

    areas = [types.SimpleNamespace(id="a1", name="Bedroom"),
             types.SimpleNamespace(id="a2", name="Living Room")]
    entities = [
        # In the area through its device.
        types.SimpleNamespace(entity_id="assist_satellite.puck",
                              area_id=None, device_id="d1"),
        # Pinned to the area directly, overriding its device.
        types.SimpleNamespace(entity_id="assist_satellite.puck2",
                              area_id="a2", device_id="d1"),
        # Right area, wrong domain.
        types.SimpleNamespace(entity_id="light.bedroom",
                              area_id="a1", device_id=None),
    ]
    devices = {"d1": "a1"}
    assert satellites_in_area("bedroom", areas, entities, devices) == [
        "assist_satellite.puck"
    ]
    assert satellites_in_area("living  room", areas, entities, devices) == [
        "assist_satellite.puck2"
    ]
    assert satellites_in_area("garage", areas, entities, devices) == []


def test_quiet_window_crosses_midnight():
    from hubbubb_home.const import in_quiet_window
    ten_pm, eight_am = (22, 0, 0), (8, 0, 0)
    assert in_quiet_window(23 * 60, ten_pm, eight_am)           # 11pm
    assert in_quiet_window(3 * 60, ten_pm, eight_am)            # 3am
    assert not in_quiet_window(12 * 60, ten_pm, eight_am)       # noon
    assert not in_quiet_window(8 * 60, ten_pm, eight_am)        # 8am sharp: morning
    assert in_quiet_window(22 * 60, ten_pm, eight_am)           # 10pm sharp: quiet
    # A daytime window works too, and equal times mean "off".
    assert in_quiet_window(13 * 60, (12, 0, 0), (14, 0, 0))
    assert not in_quiet_window(3 * 60, (8, 0, 0), (8, 0, 0))


def test_list_resolution_precedence():
    from hubbubb_home.intents import resolve_list

    options = {
        "voice": {
            "person_lists": "Scott: todo.scott\nVega: todo.vega",
            "household_list": "todo.shopping",
        }
    }
    runtime = types.SimpleNamespace(
        option=lambda s, k, d=None: options.get(s, {}).get(k, d)
    )
    # A mapped speaker gets their own list, case-insensitively.
    assert resolve_list(runtime, "scott") == ("todo.scott", "mine")
    assert resolve_list(runtime, "Vega") == ("todo.vega", "mine")
    # Unknown or unmapped speakers fall to the household list.
    assert resolve_list(runtime, None) == ("todo.shopping", "house")
    assert resolve_list(runtime, "Guest") == ("todo.shopping", "house")
    # An explicitly household request ignores the personal mapping.
    assert resolve_list(runtime, "Scott", personal=False) == (
        "todo.shopping", "house",
    )
    # No household list and nothing mapped: there is no list to land on.
    bare = types.SimpleNamespace(option=lambda s, k, d=None: "")
    assert resolve_list(bare, "Scott") == (None, None)


def test_list_item_fuzzy_match():
    from hubbubb_home.intents import match_item

    items = ["Whole milk", "Eggs", "Dish soap"]
    assert match_item(items, "milk") == "Whole milk"
    assert match_item(items, "the eggs") == "Eggs"
    assert match_item(items, "DISH SOAP") == "Dish soap"
    assert match_item(items, "butter") is None
    assert match_item([], "milk") is None


def test_spoken_questions_are_answered_out_loud_whatever_the_toggle():
    """A reply to something the user just said must never be silenced.

    The announcements toggle exists to stop unsolicited chatter from typed
    sessions. With it off, a question asked at the puck fell through to a
    passive phone push - no sound, no banner - so the answer vanished while
    every log said "sent". ha-notify.py had always sent the "voice" flag for
    exactly this case; nothing read it.
    """
    from hubbubb_home.const import delivery_for

    spoken = {"message": "done sir", "voice": True}
    asked = {"message": "shall I?", "ask": True}
    typed = {"message": "background job finished"}

    # The reported bug. Toggle off must not silence an answer to speech.
    assert delivery_for(spoken, announcements_on=False, quiet=False) == "announce"
    assert delivery_for(spoken, announcements_on=True, quiet=False) == "announce"

    # A session asking the user something already worked; keep it working.
    assert delivery_for(asked, announcements_on=False, quiet=False) == "announce"

    # What the toggle is actually for: unsolicited output from a typed session.
    assert delivery_for(typed, announcements_on=False, quiet=False) == "push"
    assert delivery_for(typed, announcements_on=True, quiet=False) == "event"

    # Quiet hours outrank everything audible, spoken questions included.
    for data in (spoken, asked, typed):
        assert delivery_for(data, announcements_on=True, quiet=True) == "push"

    # No message is a no-op rather than an empty announcement.
    assert delivery_for({"voice": True}, announcements_on=True, quiet=False) == "nothing"
    assert delivery_for({"message": ""}, announcements_on=True, quiet=False) == "nothing"


# --- sign in with Hubbubb: PKCE, state, the two views, tokens and refresh ---

class _TokenResp:
    """One answer from an OAuth token endpoint."""

    def __init__(self, status, payload):
        self.status, self._payload = status, payload

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        return False

    async def json(self):
        if self._payload is None:
            raise ValueError("not json")
        return self._payload


class _TokenSession:
    """Records every POST, answers from a queue (an Exception is raised)."""

    def __init__(self, *answers):
        self.answers, self.posts = list(answers), []

    def post(self, url, **kwargs):
        self.posts.append((url, kwargs))
        answer = self.answers.pop(0)
        if isinstance(answer, Exception):
            raise answer
        return _TokenResp(*answer)


def test_pkce_and_state_are_what_hubbubb_expects():
    import base64
    import hashlib
    import re

    from hubbubb_home import oauth

    verifier, challenge = oauth.pkce()
    b64url = re.compile(r"^[A-Za-z0-9_-]+$")
    assert 43 <= len(verifier) <= 128 and b64url.match(verifier), "RFC 7636 verifier"
    assert len(challenge) == 43 and b64url.match(challenge), "unpadded base64url of a SHA-256"
    digest = hashlib.sha256(verifier.encode()).digest()
    assert challenge == base64.urlsafe_b64encode(digest).rstrip(b"=").decode()
    assert oauth.pkce()[0] != verifier, "fresh every time"

    # A state is single-use, and not for keeps.
    oauth._pending.clear()
    state, chal = oauth.begin("Scott", "http://ha:8123/api/hubbubb_home/oauth/callback", now=1000.0)
    assert len(state) >= 40 and b64url.match(state)
    assert oauth.take("nope", now=1001.0) is None
    assert oauth.take(None, now=1001.0) is None
    flow = oauth.take(state, now=1001.0)
    assert flow["person"] == "Scott" and flow["challenge"] == chal
    assert flow["redirect_uri"] == "http://ha:8123/api/hubbubb_home/oauth/callback"
    assert hashlib.sha256(flow["verifier"].encode()).digest() == base64.urlsafe_b64decode(chal + "=")
    assert oauth.take(state, now=1001.0) is None, "a replay finds nothing"
    late, _ = oauth.begin("Scott", "r", now=1000.0)
    assert oauth.take(late, now=1000.0 + oauth.FLOW_SECONDS) is None, "a code lives ten minutes; so does the flow"
    stale, _ = oauth.begin("Scott", "r", now=1000.0)
    oauth.begin("Vega", "r", now=1000.0 + oauth.FLOW_SECONDS + 1)
    assert stale not in oauth._pending, "starting a flow sweeps the dead ones"
    oauth._pending.clear()

    url = oauth.authorize_url("https://hub.example", "hbbo_house", "http://ha:8123/cb", "st", "ch")
    assert url == (
        "https://hub.example/oauth/authorize?response_type=code&client_id=hbbo_house"
        "&redirect_uri=http%3A%2F%2Fha%3A8123%2Fcb&state=st&code_challenge=ch&code_challenge_method=S256"
    )
    assert oauth.redirect_uri("https", "home.example:8123") == "https://home.example:8123/api/hubbubb_home/oauth/callback"

    # What a reload listener may ignore: one existing person's record changing.
    before = {"hubbubb": {"a": 1}, "hubbubb_tokens": {"scott": {"access_token": "x"}}}
    assert oauth.tokens_only_change(before, {"hubbubb": {"a": 1}, "hubbubb_tokens": {"scott": {"access_token": "y", "needs_reauth": True}}})
    assert oauth.tokens_only_change(before, before)
    assert not oauth.tokens_only_change(before, {"hubbubb": {"a": 1}, "hubbubb_tokens": {}}), "a person leaving reloads"
    assert not oauth.tokens_only_change(before, {"hubbubb": {"a": 1}, "hubbubb_tokens": {"scott": {}, "vega": {}}}), "a person arriving reloads"
    assert not oauth.tokens_only_change(before, {"hubbubb": {"a": 2}, "hubbubb_tokens": before["hubbubb_tokens"]}), "anything else reloads"
    assert oauth.tokens_only_change({"hubbubb": {}}, {"hubbubb": {}, "hubbubb_tokens": {}})


def test_sign_in_start_and_callback_decisions():
    import asyncio
    import json

    from hubbubb_home import oauth
    from hubbubb_home.hubbubb import parse_people
    from hubbubb_home.links import async_links
    from hubbubb_home.oauth import OAuthCallbackView, OAuthStartView, async_callback, async_start

    assert OAuthStartView.requires_auth is True
    assert OAuthCallbackView.requires_auth is False, "Hubbubb redirects a browser here; the state is the credential"
    assert OAuthCallbackView.url == "/api/hubbubb_home/oauth/callback"

    writes = []

    def _hass(entries, session=None):
        def update(entry, data):
            writes.append(data)
            entry.data = data

        return types.SimpleNamespace(
            config_entries=types.SimpleNamespace(async_entries=lambda d: entries, async_update_entry=update),
            data={},
            session=session,
        )

    oauth.async_get_clientsession = lambda hass: hass.session
    identity_asked = []

    async def _identity(client):
        identity_asked.append(client._load())
        return "Scott Scott, scott@thehubbubb.com"

    oauth._identity = _identity

    def start(hass, user, admin, person, scheme="http", host="ha.local:8123"):
        status, ctype, payload = asyncio.run(async_start(hass, user, admin, person, scheme, host))
        return status, (json.loads(payload) if "json" in ctype else payload.decode())

    def callback(hass, **query):
        status, ctype, payload = asyncio.run(async_callback(hass, query))
        assert ctype.startswith("text/html")
        return status, payload.decode()

    people_text = "Scott: hbbc_scott : sekrit\nVega : hbbc_vega:with:colons\n"
    entry = types.SimpleNamespace(
        data={"hubbubb": {"hubbubb_url": "https://hub.example/api/v1/1/mcp", "hubbubb_client_id": "house", "hubbubb_client_secret": "hs", "people": people_text}},
        options={},
    )
    # No Hubbubb at all, then Hubbubb without an OAuth client: the panel gets
    # a refusal it can hide the button on, and nothing is minted.
    assert start(_hass([]), "Scott", True, "Scott")[0] == 503
    status, body = start(_hass([entry]), "Scott", True, "Scott")
    assert status == 503 and "OAuth client id" in body["detail"]
    assert oauth._pending == {}
    assert asyncio.run(async_links(_hass([entry]), False, "GET"))[2].endswith(b'"signin": false}')

    entry.data["hubbubb"].update({"oauth_client_id": "hbbo_house", "oauth_client_secret": "hbbo_secret"})
    hass = _hass([entry])
    assert asyncio.run(async_links(hass, False, "GET"))[2].endswith(b'"signin": true}')

    # Who may start a flow: an administrator for anyone, anyone for themselves.
    assert start(hass, "Vega", False, "Scott")[0] == 403
    assert start(hass, None, False, "Scott")[0] == 403
    assert start(hass, "Scott", True, "")[0] == 400
    assert start(hass, "Scott", True, "x" * 81)[0] == 400
    status, own = start(hass, "scott", False, " Scott ")
    assert status == 200 and own["person"] == "Scott"
    status, body = start(hass, "Admin", True, "Vega", scheme="https", host="home.example")
    assert status == 200
    assert body["redirect_uri"] == "https://home.example/api/hubbubb_home/oauth/callback"
    assert body["url"].startswith("https://hub.example/oauth/authorize?response_type=code&client_id=hbbo_house&redirect_uri=https%3A%2F%2Fhome.example%2Fapi%2Fhubbubb_home%2Foauth%2Fcallback&state=")
    assert "code_challenge_method=S256" in body["url"]
    assert "hbbo_secret" not in body["url"], "the secret never leaves the server"
    [state] = [s for s, f in oauth._pending.items() if f["person"] == "Vega"]
    verifier = oauth._pending[state]["verifier"]
    assert "state" not in body, "the state travels only through Hubbubb"

    # A callback nobody asked for, or asked for twice, links nobody.
    status, page = callback(hass, code="hbba_x", state="forged")
    assert status == 400 and "not one this house asked for" in page and writes == []
    status, page = callback(hass, state=state, error="access_denied")
    assert status == 200 and "was declined" in page and "Nothing was linked" in page
    assert writes == [] and oauth.take(state) is None, "a denial spends the state too"

    # The real thing: code for tokens, then who, then kept beside the map.
    oauth._pending.clear()
    status, body = start(hass, "Admin", True, "Vega")
    [state] = list(oauth._pending)
    verifier = oauth._pending[state]["verifier"]
    hass.session = _TokenSession((200, {"access_token": "hbbt_1", "token_type": "Bearer", "expires_in": 3600, "refresh_token": "hbbr_1", "scope": "member"}))
    status, page = callback(hass, code="hbba_code", state=state)
    assert status == 200, page
    assert "Signed in" in page and "Vega" in page and "Scott Scott (scott@thehubbubb.com)" not in page
    assert "Scott Scott, scott@thehubbubb.com" in page and "close this window" in page and "window.close()" in page
    [(url, kwargs)] = hass.session.posts
    assert url == "https://hub.example/oauth/token"
    assert kwargs["data"] == {
        "grant_type": "authorization_code",
        "code": "hbba_code",
        "redirect_uri": "http://ha.local:8123/api/hubbubb_home/oauth/callback",
        "code_verifier": verifier,
        "client_id": "hbbo_house",
        "client_secret": "hbbo_secret",
    }
    assert identity_asked[-1]["access_token"] == "hbbt_1", "who-am-I is asked on the new token"
    assert len(writes) == 1
    record = writes[0]["hubbubb_tokens"]["vega"]
    assert record["person"] == "Vega" and record["access_token"] == "hbbt_1" and record["refresh_token"] == "hbbr_1"
    assert record["identity"] == "Scott Scott, scott@thehubbubb.com" and record["needs_reauth"] is False
    assert record["expires"] > _time_now() + 3000
    # The map is untouched, byte for byte, and parses as it always did.
    assert writes[0]["hubbubb"]["people"] == people_text
    assert parse_people(writes[0]["hubbubb"]["people"]) == {"scott": ("hbbc_scott", "sekrit"), "vega": ("hbbc_vega", "with:colons")}
    assert "hbbt_1" not in page and "hbbr_1" not in page and "hbba_code" not in page
    assert callback(hass, code="hbba_code", state=state)[0] == 400, "a replayed callback is a stranger"

    # The panel now sees Vega as signed in - over her pasted line - and never a token.
    status, ctype, payload = asyncio.run(async_links(hass, False, "GET"))
    listed = json.loads(payload)
    assert listed["people"]["Vega"] == {"linked": True, "via": "signin", "identity": "Scott Scott, scott@thehubbubb.com", "needs_reauth": False}
    assert listed["people"]["Scott"]["via"] == "key"
    assert "hbbt_1" not in payload.decode() and "hbbr_1" not in payload.decode()

    # Hubbubb refusing the exchange, or being away, links nobody and says so.
    for answer, status_wanted, words in (
        ((400, {"error": "invalid_grant"}), 400, "invalid_grant"),
        ((502, None), 400, "502"),
        (sys.modules["aiohttp"].ClientError("refused"), 502, "could not be reached"),
    ):
        start(hass, "Admin", True, "Guest")
        [state] = list(oauth._pending)
        hass.session = _TokenSession(answer)
        status, page = callback(hass, code="hbba_bad", state=state)
        assert status == status_wanted and words in page and "Nothing was linked" in page, (answer, page)
    assert len(writes) == 1

    # A person's name goes on the page as text, never as markup.
    start(hass, "Admin", True, "<b>Eve</b>")
    [state] = list(oauth._pending)
    hass.session = _TokenSession((200, {"access_token": "t", "expires_in": 60, "refresh_token": "r"}))
    assert "&lt;b&gt;Eve&lt;/b&gt;" in callback(hass, code="c", state=state)[1]
    writes.clear()

    # Unlinking a signed-in person takes the token record with the line.
    status, ctype, payload = asyncio.run(async_links(hass, True, "DELETE", "vega"))
    assert status == 200
    assert "vega" not in writes[-1]["hubbubb_tokens"] and "<b>eve</b>" in writes[-1]["hubbubb_tokens"]
    assert writes[-1]["hubbubb"]["people"] == "Scott: hbbc_scott : sekrit\n"
    oauth._pending.clear()


def _time_now():
    import time

    return time.time()


def test_user_client_refreshes_rotates_and_marks_reauth():
    import asyncio

    from hubbubb_home.hubbubb import NEEDS_SIGN_IN, HubbubbError, HubbubbUserClient
    from hubbubb_home.oauth import token_io

    saved = []
    record = {"person": "Scott", "access_token": "old", "refresh_token": "hbbr_1", "expires": _time_now() + 3600, "identity": "S, s@x.com", "needs_reauth": False}

    def make(session, rec=None):
        rec = rec if rec is not None else record
        return HubbubbUserClient(session, "https://hub.example/api/v1/1/mcp", "hbbo_house", "hbbo_secret", lambda: rec, saved.append)

    # A live token is used as it is; nothing is posted.
    session = _TokenSession()
    assert asyncio.run(make(session)._bearer()) == "old" and session.posts == [] and saved == []

    # An expiring one is refreshed, and the rotated refresh token is kept at
    # once - the old one is dead the moment the new one exists.
    stale = {**record, "expires": _time_now() + 10}
    session = _TokenSession((200, {"access_token": "hbbt_2", "refresh_token": "hbbr_2", "expires_in": 3600, "token_type": "Bearer", "scope": "member"}))
    assert asyncio.run(make(session, stale)._bearer()) == "hbbt_2"
    [(url, kwargs)] = session.posts
    assert url == "https://hub.example/oauth/token"
    assert kwargs["data"] == {"grant_type": "refresh_token", "refresh_token": "hbbr_1", "client_id": "hbbo_house", "client_secret": "hbbo_secret"}
    assert len(saved) == 1
    assert saved[0]["refresh_token"] == "hbbr_2" and saved[0]["access_token"] == "hbbt_2"
    assert saved[0]["identity"] == "S, s@x.com" and saved[0]["person"] == "Scott", "the rest of the record survives"
    assert saved[0]["needs_reauth"] is False and saved[0]["expires"] > _time_now() + 3000
    # A 401 mid-request forces a refresh even on a token that looked fine.
    session = _TokenSession((200, {"access_token": "hbbt_3", "refresh_token": "hbbr_3", "expires_in": 3600}))
    assert asyncio.run(make(session)._bearer(force=True)) == "hbbt_3"

    # A dead refresh token: marked, said, not raised as a crash - and not
    # tried again until somebody signs in.
    session = _TokenSession((400, {"error": "invalid_grant"}))
    try:
        asyncio.run(make(session, stale)._bearer())
    except HubbubbError as err:
        assert str(err) == NEEDS_SIGN_IN
    else:
        raise AssertionError("a dead token must be a speakable error")
    assert saved[-1]["needs_reauth"] is True and saved[-1]["refresh_token"] == "hbbr_1"
    marked = saved[-1]
    session = _TokenSession()
    try:
        asyncio.run(make(session, marked)._bearer())
    except HubbubbError as err:
        assert str(err) == NEEDS_SIGN_IN and session.posts == []
    else:
        raise AssertionError()
    # Hubbubb being down or broken is not a revocation: nothing is marked.
    n = len(saved)
    for answer in ((503, None), sys.modules["aiohttp"].ClientError("refused")):
        session = _TokenSession(answer)
        try:
            asyncio.run(make(session, stale)._bearer())
        except HubbubbError as err:
            assert NEEDS_SIGN_IN not in str(err), answer
        else:
            raise AssertionError()
    assert len(saved) == n
    # No record at all (unlinked under a running client) is the same answer.
    try:
        asyncio.run(make(_TokenSession(), {})._bearer())
    except HubbubbError as err:
        assert str(err) == NEEDS_SIGN_IN

    # token_io reads the entry live and writes one person's record back with
    # everything else in the entry intact.
    entry = types.SimpleNamespace(data={"hubbubb": {"people": "Scott: a : b\n"}, "hubbubb_tokens": {"scott": {"access_token": "x"}, "vega": {"access_token": "v"}}})
    writes = []

    def update(e, data):
        writes.append(data)
        e.data = data

    hass = types.SimpleNamespace(config_entries=types.SimpleNamespace(async_update_entry=update))
    load, save = token_io(hass, entry, "scott")
    assert load() == {"access_token": "x"}
    save({"access_token": "y"})
    assert load() == {"access_token": "y"}
    assert writes[-1] == {"hubbubb": {"people": "Scott: a : b\n"}, "hubbubb_tokens": {"scott": {"access_token": "y"}, "vega": {"access_token": "v"}}}
    assert token_io(hass, entry, "nobody")[0]() is None


def test_relevant_text():
    # Matching lines come back with a line of context; scripts, nav and
    # unrelated lines do not, and the length cap holds.
    html = (
        "<html><head><script>var hours = 'x';</script></head><body>"
        "<nav>Costco hours menu</nav><p>Bend Warehouse</p><p>Open until 7PM</p>"
        "<p>Saturday hours 9:30 AM - 6:00 PM</p><p>Gas prices vary</p></body></html>"
    )
    text = relevant_text(html, "costco saturday hours")
    assert "Saturday hours 9:30 AM - 6:00 PM" in text
    assert "Open until 7PM" in text
    assert "var hours" not in text and "menu" not in text
    assert "Gas prices" in text  # context line after the hit
    assert relevant_text(html, "zebra") == ""
    assert len(relevant_text("<p>hours</p>" * 2000, "hours", limit=100)) == 100


def test_calculate_and_dates():
    from hubbubb_home.llm_api import calculate, date_facts

    assert calculate("84 * 0.17") == 14.28
    assert calculate("300 / 4 * 6") == 450
    assert calculate("1,200 x 3") == 3600
    for bad in ("__import__('os')", "2 ** 1000", "1 / 0", "abs(-1)"):
        try:
            calculate(bad)
        except (ValueError, SyntaxError, ZeroDivisionError):
            continue
        raise AssertionError(bad)

    now = datetime(2026, 10, 4, 18, 0, tzinfo=timezone.utc)  # a Sunday
    halloween = date_facts("2026-10-31", 0, 0, now)
    assert halloween["weekday"] == "Saturday"
    assert halloween["spoken"] == "Saturday October 31st"
    assert date_facts("2026-12-25", 0, 0, now)["days_from_today"] == 82
    # The flight: lands 11:50pm, 40 minutes home - 12:30 the next day.
    flight = date_facts("2026-10-04 23:50", 0, 40, now)
    assert flight["spoken"] == "Monday October 5th at 12:30 AM", flight
    assert date_facts("", 7, 0, now)["spoken"] == "Sunday October 11th"
    assert date_facts("2027-01-01", 0, 0, now)["spoken"] == "Friday January 1st, 2027"
    assert date_facts("2026-10-11", 0, 0, now)["spoken"].endswith("11th")



def test_recheck_closes_only_what_the_agent_calls_fixed():
    """The defect this guards: findings the user had already fixed piling up
    as pending every night, because the digest holds complaints, not fixes."""
    import asyncio
    from hubbubb_home.review import async_recheck, build_brief

    report = ReviewReport(None)
    asyncio.run(report.async_update(report=_REPORT, findings=2, drafts=[], detail=""))
    asyncio.run(report.async_decide("suggestion_named_timers_by_voice", "rejected"))

    class _Companion:
        async def async_call(self, endpoint, payload, method, timeout):
            assert "defect_whisper_hears_lights_as_weights" in payload["brief"]
            assert "suggestion_named_timers_by_voice" not in payload["brief"]
            return {"ok": True, "report": (
                "FIXED defect_the_digest_re_ingests_its_own_brief\n"
                "- OPEN defect_whisper_hears_lights_as_weights\n"
                "FIXED suggestion_named_timers_by_voice\n"  # not open: ignored
                "FIXED defect_made_up\n")}

    fixed = asyncio.run(async_recheck(None, _Companion(), report))
    assert fixed == ["defect_the_digest_re_ingests_its_own_brief"], fixed
    assert report.get(fixed[0])["status"] == "done"
    assert report.get("defect_whisper_hears_lights_as_weights")["status"] == "pending"
    assert report.get("suggestion_named_timers_by_voice")["status"] == "rejected"

    class _Hass:
        class states:
            @staticmethod
            def async_all():
                return []

    brief = build_brief(_Hass(), "", report.proposals)
    assert "done: The digest re-ingests its own brief" in brief, brief
    assert "confirm it is" in brief



# --- grounding: the local model may not claim what no tool did ---------------

class UserContent:
    def __init__(self, content):
        self.content = content


class AssistantContent:
    def __init__(self, content="", tools=()):
        self.content = content
        self.tool_calls = [types.SimpleNamespace(tool_name=n) for n in tools]


def _turn(reply, *tools):
    calls = [AssistantContent(tools=tools)] if tools else []
    return [UserContent("x"), *calls, AssistantContent(reply)]


def test_grounding_catches_tonights_claims_with_no_tool_behind_them():
    # 15 October: each of these was spoken with no tool call at all.
    for reply in (
        "The Natural light scene is being applied to the house now sir. "
        "I'll let you know once it's set.",
        "I'll set them to natural scene now which will lower the brightness "
        "for evening sir. Done.",
        "You're right sir - I should have created a fresh session. I've now "
        "sent the request to Claude Code in a new session.",
    ):
        assert ungrounded(_turn(reply)), reply
    # A look is not a deed.
    assert ungrounded(_turn("Done sir, the fan is on.", "assist__GetLiveContext"))


def test_grounding_lets_real_actions_and_plain_answers_through():
    assert not ungrounded(_turn(
        "I've sent your concern to Claude Code sir.",
        "hubbubb-home__hand_to_companion",
    ))
    assert not ungrounded(_turn("Natural scene on sir.", "assist__JarvisAllLightsScene"))
    # Reading a state back from the house is how a state should be said.
    assert not ungrounded(_turn(
        "The fan has been running all evening sir.", "assist__GetLiveContext"
    ))
    assert not ungrounded(_turn("It's 75 degrees in the living room sir."))
    assert not ungrounded(_turn("Would you like me to dim them?"))
    # Only the turn since the speaker's last message counts.
    old = _turn("Natural scene on sir.", "assist__JarvisAllLightsScene")
    assert ungrounded(old + _turn("Done sir."))


def test_history_trim_counts_turns_not_tool_messages():
    m = lambda role: types.SimpleNamespace(role=role)
    sys_ = m("system")
    turn = lambda: [m("user"), m("assistant"), m("tool"), m("tool"), m("assistant")]
    a, b, c, now = turn(), turn(), turn(), [m("user")]
    kept = trim_by_turns([sys_, *a, *b, *c, *now], 2)
    assert kept == [sys_, *b, *c, *now], len(kept)
    short = [sys_, *c, *now]
    assert trim_by_turns(short, 2) == short
    assert trim_by_turns([sys_, *a, *b, *c, *now], 0) == [sys_, *a, *b, *c, *now]


def test_same_request_spots_a_repeat_not_a_new_command():
    assert same_request("set my lights to my bright scene", "set the lights to bright")
    assert same_request("can I get the movie lighting", "I said movie lighting")
    assert not same_request("turn on the bedroom fan", "turn off the bedroom fan")
    assert not same_request("add milk to my list", "add eggs to my list")
    assert not same_request("what is the weather", "turn on the bedroom fan")
    assert not same_request("the", "a")


def test_named_list_match():
    from hubbubb_home.intents import match_list

    names = {"todo.shopping_list": "Shopping List",
             "todo.house_projects": "House Projects"}
    assert match_list(names, None) == ""                  # no name: default
    assert match_list(names, "my") == ""                  # "my list"
    assert match_list(names, "the house") == ""           # "the house list"
    assert match_list(names, "shopping") == "todo.shopping_list"
    assert match_list(names, "house projects list") == "todo.house_projects"
    assert match_list(names, "my project") == "todo.house_projects"
    assert match_list(names, "christmas") is None


def test_pet_message_reads_naturally():
    assert pet_message("Vader", "back door", 3) == "Vader has been waiting at the back door for 3 minutes. Vader may need to go out."
    assert pet_message("Vader", "The front door", None) == "Vader has been waiting at The front door. Vader may need to go out."


if __name__ == "__main__":
    passed = 0
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            passed += 1
    print(f"{passed} checks passed")
