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


_stub("homeassistant")
_stub("homeassistant.components")
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
_stub("homeassistant.helpers")
_stub("homeassistant.helpers.event", async_track_point_in_time=_track_point_in_time)
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
from hubbubb_home.timers import TimerPool  # noqa: E402
from hubbubb_home.nightly import FindingsReport, _days  # noqa: E402


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
    report = FindingsReport()
    assert "Nothing" in report.spoken("Athena")
    report.update(
        [
            {"kind": "dead", "detail": "x"},
            {"kind": "quiet", "detail": "y"},
            {"kind": "quiet", "detail": "z"},
        ],
        "",
    )
    speech = report.spoken("Athena")
    assert "1 thing offline" in speech, speech
    assert "2 have gone quiet" in speech, speech


def test_days_reads_as_speech_not_as_a_clock():
    assert _days(0.25) == "6 hours"
    assert _days(1) == "1 day"
    assert _days(3.4) == "3 days"


if __name__ == "__main__":
    passed = 0
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
            passed += 1
    print(f"{passed} checks passed")
