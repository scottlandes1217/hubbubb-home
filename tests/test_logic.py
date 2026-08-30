"""Runnable check for the parts that have real logic in them.

Home Assistant is not installed to run this - the modules under test import a
handful of names from it, so those are stubbed here. That keeps the check to
`python3 tests/test_logic.py` with nothing but voluptuous installed, which is
the only version of a test anybody runs.
"""

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
    )

_stub("homeassistant")
_components = _stub("homeassistant.components")
_components.webhook = _stub(
    "homeassistant.components.webhook",
    async_register=lambda *a, **k: None,
    async_unregister=lambda *a, **k: None,
)
_stub(
    "homeassistant.components.recorder",
    get_instance=lambda hass: hass,
    history=types.SimpleNamespace(get_significant_states=lambda *a, **k: {}),
)
_stub(
    "homeassistant.core",
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
        Length=lambda **k: None,
        Range=lambda **k: None,
    )

class _LLMAPI:
    def __init__(self, **kwargs):
        pass


_helpers = _stub("homeassistant.helpers")
_stub("homeassistant.helpers.event", async_track_point_in_time=_track_point_in_time)
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
    "entity_registry": {},
    "config_validation": {"string": str},
    "intent": {"IntentHandler": _IntentHandler, "async_register": lambda *a: None},
    "aiohttp_client": {"async_get_clientsession": lambda hass: None},
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
from hubbubb_home.speakers import SpeakerBook  # noqa: E402
from hubbubb_home.timers import TimerPool  # noqa: E402
from hubbubb_home.nightly import FindingsReport, _days  # noqa: E402
from hubbubb_home.appletv import _TEMPLATE, _match_source, decide_plan  # noqa: E402


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


def test_speaker_prompt_line_three_cases():
    import time as _time

    book = SpeakerBook(None, "", "")
    line = book.prompt_line()
    assert "do not know who is speaking" in line, line

    book.record({"person": "Scott", "confidence": 0.5, "ts": _time.time()})
    assert "probably Scott" in book.prompt_line()

    book.record({"person": "Scott", "confidence": 0.92, "ts": _time.time()})
    assert book.prompt_line() == "The person speaking is Scott."


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
    import asyncio
    import time as _time

    from hubbubb_home.approvals import Approvals
    from hubbubb_home.llm_api import AskHubbubbTool

    class _Hubbubb:
        async def async_ask(self, request):
            return "42"

    def call(runtime):
        return asyncio.run(
            AskHubbubbTool(runtime).async_call(
                None,
                types.SimpleNamespace(tool_args={"request": "what's new?"}),
                None,
            )
        )

    book = SpeakerBook(None, "", "")
    runtime = types.SimpleNamespace(
        hubbubb=_Hubbubb(),
        hubbubb_people={},
        speakers=book,
        approvals=Approvals(_TapHass(answer=True), "Jarvis",
                            "Scott: notify.mobile_app_scott"),
    )

    # Nobody known: refused with ask-who guidance, no notification sent.
    assert call(runtime)["error"] == "speaker_not_verified"

    # A 0.7 voice match is a lean, not a verification.
    book.record({"person": "Scott", "confidence": 0.7, "ts": _time.time()})
    assert call(runtime)["error"] == "speaker_not_verified"

    # 0.92 voice: challenge the device, approved, answered.
    book.record({"person": "Scott", "confidence": 0.92, "ts": _time.time()})
    assert call(runtime) == {"answer": "42"}

    # "This is Scott": challenged too (cache makes it instant here).
    told = SpeakerBook(None, "", "")
    told.set_override("Scott")
    runtime.speakers = told
    assert call(runtime) == {"answer": "42"}

    # Denied from the device: error, and the tool is told not to retry.
    denied = types.SimpleNamespace(
        hubbubb=_Hubbubb(),
        hubbubb_people={},
        speakers=told,
        approvals=Approvals(_TapHass(answer=False), "Jarvis",
                            "Scott: notify.mobile_app_scott"),
    )
    assert "did not approve" in call(denied)["error"]

    # Blank approvers map: exactly the old behavior, no identity needed.
    open_runtime = types.SimpleNamespace(
        hubbubb=_Hubbubb(),
        hubbubb_people={},
        speakers=SpeakerBook(None, "", ""),
        approvals=Approvals(None, "Jarvis", ""),
    )
    assert call(open_runtime) == {"answer": "42"}


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


def test_hubbubb_tool_uses_the_verified_persons_own_client():
    import asyncio
    import time as _time

    from hubbubb_home.approvals import Approvals
    from hubbubb_home.llm_api import AskHubbubbTool

    class _Client:
        def __init__(self, who):
            self.who = who
            self.calls = 0

        async def async_ask(self, request):
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

    # People map set but no approvers: identity is still demanded...
    lone = types.SimpleNamespace(
        hubbubb=shared,
        hubbubb_people={"scott": scotts},
        speakers=SpeakerBook(None, "", ""),
        approvals=Approvals(None, "Jarvis", ""),
    )
    assert call(lone)["error"] == "speaker_not_verified"
    # ...and a told identity picks their client without any tap.
    lone.speakers.set_override("Scott")
    assert call(lone) == {"answer": "answered as scott"}
    assert shared.calls == 0


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


# --- findings ----------------------------------------------------------------

def test_findings_speech_counts_both_kinds():
    import asyncio

    report = FindingsReport(None)
    assert "Nothing" in report.spoken("Athena")
    asyncio.run(
        report.async_update(
            [
                {"kind": "dead", "entity_id": "a", "detail": "x"},
                {"kind": "quiet", "entity_id": "b", "detail": "y"},
                {"kind": "quiet", "entity_id": "c", "detail": "z"},
            ]
        )
    )
    speech = report.spoken("Athena")
    assert "1 thing offline" in speech, speech
    assert "2 have gone quiet" in speech, speech


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


if __name__ == "__main__":
    passed = 0
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            passed += 1
    print(f"{passed} checks passed")
