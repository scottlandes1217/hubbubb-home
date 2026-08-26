"""Voice timers.

Home Assistant's built-in timer intents keep their state inside the
conversation component, where a dashboard card cannot see it, and `timer`
helper entities cannot be created by an integration. So the pool lives here
and is published as the attributes of one sensor - which is also why the card
needs a single entity instead of ten.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime, timedelta

from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.event import async_track_point_in_time
from homeassistant.util import dt as dt_util

from .const import TIMER_SLOTS

_LOGGER = logging.getLogger(__name__)


@dataclass
class Timer:
    """One running countdown."""

    id: str
    name: str
    duration: float
    finishes_at: datetime
    paused_with: float | None = None
    _cancel: CALLBACK_TYPE | None = field(default=None, repr=False)

    @property
    def paused(self) -> bool:
        return self.paused_with is not None

    def remaining(self, now: datetime | None = None) -> float:
        if self.paused_with is not None:
            return self.paused_with
        now = now or dt_util.utcnow()
        return max(0.0, (self.finishes_at - now).total_seconds())

    def as_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "duration": round(self.duration),
            "remaining": round(self.remaining()),
            "finishes_at": self.finishes_at.isoformat(),
            "paused": self.paused,
        }


class TimerPool:
    """Every timer this assistant is holding, and what happens when one ends."""

    def __init__(self, hass: HomeAssistant, on_finish) -> None:
        self._hass = hass
        self._on_finish = on_finish
        self._timers: dict[str, Timer] = {}
        self._listeners: list[CALLBACK_TYPE] = []
        self._seq = 0

    # --- observation ---------------------------------------------------------

    @property
    def timers(self) -> list[Timer]:
        return sorted(self._timers.values(), key=lambda t: t.remaining())

    def as_list(self) -> list[dict]:
        return [t.as_dict() for t in self.timers]

    @callback
    def async_add_listener(self, update: CALLBACK_TYPE) -> CALLBACK_TYPE:
        self._listeners.append(update)

        def _remove() -> None:
            self._listeners.remove(update)

        return _remove

    @callback
    def _notify(self) -> None:
        for update in self._listeners:
            update()

    # --- lookup --------------------------------------------------------------

    def find(self, name: str | None) -> Timer | None:
        """Resolve a spoken reference: a name if given, else the next to end."""
        running = self.timers
        if not running:
            return None
        if not name:
            return running[0]
        wanted = name.strip().lower()
        for timer in running:
            if timer.name.lower() == wanted:
                return timer
        for timer in running:
            if wanted in timer.name.lower():
                return timer
        return None

    def get(self, timer_id: str) -> Timer | None:
        return self._timers.get(timer_id)

    # --- mutation ------------------------------------------------------------

    def start(self, name: str, seconds: float) -> Timer:
        if seconds <= 0:
            raise ValueError("a timer needs a duration")
        if len(self._timers) >= TIMER_SLOTS:
            raise ValueError(
                f"there are already {TIMER_SLOTS} timers running"
            )
        self._seq += 1
        timer = Timer(
            id=f"t{self._seq}",
            name=(name or "").strip() or "Timer",
            duration=seconds,
            finishes_at=dt_util.utcnow() + timedelta(seconds=seconds),
        )
        self._timers[timer.id] = timer
        self._arm(timer)
        self._notify()
        return timer

    def cancel(self, timer: Timer) -> None:
        self._disarm(timer)
        self._timers.pop(timer.id, None)
        self._notify()

    def add_time(self, timer: Timer, seconds: float) -> Timer:
        if timer.paused_with is not None:
            timer.paused_with = max(0.0, timer.paused_with + seconds)
        else:
            remaining = max(0.0, timer.remaining() + seconds)
            timer.finishes_at = dt_util.utcnow() + timedelta(seconds=remaining)
            self._arm(timer)
        timer.duration = max(timer.duration, timer.remaining())
        self._notify()
        return timer

    def pause(self, timer: Timer) -> Timer:
        if timer.paused_with is None:
            timer.paused_with = timer.remaining()
            self._disarm(timer)
            self._notify()
        return timer

    def resume(self, timer: Timer) -> Timer:
        if timer.paused_with is not None:
            timer.finishes_at = dt_util.utcnow() + timedelta(
                seconds=timer.paused_with
            )
            timer.paused_with = None
            self._arm(timer)
            self._notify()
        return timer

    def cancel_all(self) -> int:
        count = len(self._timers)
        for timer in list(self._timers.values()):
            self._disarm(timer)
        self._timers.clear()
        self._notify()
        return count

    # --- scheduling ----------------------------------------------------------

    def _arm(self, timer: Timer) -> None:
        self._disarm(timer)

        @callback
        def _fire(_now: datetime) -> None:
            timer._cancel = None
            self._timers.pop(timer.id, None)
            self._notify()
            self._hass.async_create_task(self._on_finish(timer))

        timer._cancel = async_track_point_in_time(
            self._hass, _fire, timer.finishes_at
        )

    @staticmethod
    def _disarm(timer: Timer) -> None:
        if timer._cancel is not None:
            timer._cancel()
            timer._cancel = None
