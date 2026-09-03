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
    import asyncio
    import time as _time

    from hubbubb_home.approvals import Approvals
    from hubbubb_home.llm_api import AskHubbubbTool

    class _Hubbubb:
        async def async_ask(self, request, **kwargs):
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

    # With an approver device configured, a 0.7 lean is enough to CHALLENGE.
    # The tap is the gate: a wrong guess rings the wrong person's phone, shows
    # them the request, and they decline. Requiring 0.90 first made this tool
    # unusable - all 8 of Scott's own enrolment samples score under 0.90
    # against his own profile, so it asked "who is speaking?" every time.
    book.record({"person": "Scott", "confidence": 0.7, "ts": _time.time()})
    assert call(runtime) == {"answer": "42"}

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

    # Per-person credentials but NO approver device: nothing catches a wrong
    # guess, because voice alone decides whose Hubbubb account gets spent. This
    # is the one case that still demands VERIFY_CONFIDENCE, and lowering the
    # bar for the tap path above must not have lowered it here.
    creds = SpeakerBook(None, "", "")
    creds_runtime = types.SimpleNamespace(
        hubbubb=_Hubbubb(),
        hubbubb_people={"scott": _Hubbubb()},
        speakers=creds,
        approvals=Approvals(None, "Jarvis", ""),
    )
    creds.record({"person": "Scott", "confidence": 0.7, "ts": _time.time()})
    assert call(creds_runtime)["error"] == "speaker_not_verified"
    creds.record({"person": "Scott", "confidence": 0.92, "ts": _time.time()})
    assert call(creds_runtime) == {"answer": "42"}


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
            "Scott": {"linked": True, "client_id_hint": "hbbc_s… (10 characters)", "identity": None},
            "Vega": {"linked": False},
        }
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
        "people": {"Vega": {"linked": True, "client_id_hint": "hbbc_v… (9 characters)", "identity": "Vega Landes, vega@example.com"}}
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

    # What counts as an identity: one line, a name, a comma, an address.
    from hubbubb_home.links import identity_of

    assert identity_of("Scott Scott, scott@thehubbubb.com") == "Scott Scott, scott@thehubbubb.com"
    assert identity_of("  Scott Scott,scott@thehubbubb.com\n") == "Scott Scott,scott@thehubbubb.com"
    for junk in ("Scott Scott", "scott@thehubbubb.com", "You are Scott. Email: scott@x.com", "a, b", "x, y@z", None, 3):
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


if __name__ == "__main__":
    passed = 0
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            passed += 1
    print(f"{passed} checks passed")
