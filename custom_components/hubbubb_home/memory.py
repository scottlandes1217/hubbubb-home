"""House memory: one short sentence per row, searched with SQLite FTS5.

FTS5 rather than LIKE because recall is asked in the words of the question
("what do you remember about the pool") and not in the words of the fact ("the
pool guy comes on tuesdays"); bm25 ranking finds that, a substring match does
not. Every call runs in the executor - sqlite3 blocks, and this is the event
loop that also drives the lights.
"""

from __future__ import annotations

import logging
import re
import sqlite3
from datetime import date

from homeassistant.core import HomeAssistant

from .const import MEMORY_DB

_LOGGER = logging.getLogger(__name__)

# FTS5 reads bare punctuation as query syntax and raises on it, so a spoken
# question ("what's the wifi password?") has to be reduced to plain terms
# before it can be a MATCH. Anything that isn't a word character goes.
_WORD = re.compile(r"[A-Za-z0-9']+")

# Words that match half the table and rank nothing usefully.
_STOP = frozenset(
    "a an the is are was were do does did what whats when where who whom whose "
    "why how about of for to in on at my our your their his her its me we you "
    "i tell remind know remember recall again please".split()
)


class Memory:
    """Durable household facts, shared by the voice intents and the agent."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._path = hass.config.path(MEMORY_DB)

    _SCHEMA = (
        "CREATE VIRTUAL TABLE IF NOT EXISTS memories "
        "USING fts5(text, created UNINDEXED, person UNINDEXED)"
    )

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self._path, timeout=10)
        conn.execute(self._SCHEMA)
        # Pre-0.18 databases have no person column, and FTS5 cannot ALTER a
        # column in - so rebuild once, with every old row owned by the
        # household ('').
        cols = [row[1] for row in conn.execute("PRAGMA table_info(memories)")]
        if "person" not in cols:
            with conn:
                conn.execute("ALTER TABLE memories RENAME TO memories_v1")
                conn.execute(self._SCHEMA)
                conn.execute(
                    "INSERT INTO memories (text, created, person) "
                    "SELECT text, created, '' FROM memories_v1"
                )
                conn.execute("DROP TABLE memories_v1")
        return conn

    async def async_setup(self) -> None:
        def _init() -> None:
            self._connect().close()

        await self._hass.async_add_executor_job(_init)

    # --- writes --------------------------------------------------------------

    async def async_add(self, text: str, person: str = "") -> str:
        """Store one fact. Returns what was stored, for the spoken reply.

        person is who the fact belongs to; "" is the household's.
        """
        text = " ".join(text.split())
        if not text:
            raise ValueError("nothing to remember")

        def _add() -> None:
            conn = self._connect()
            with conn:
                conn.execute(
                    "INSERT INTO memories (text, created, person) "
                    "VALUES (?, ?, ?)",
                    (text, date.today().isoformat(), person.strip()),
                )
            conn.close()

        await self._hass.async_add_executor_job(_add)
        _LOGGER.debug("remembered: %s", text)
        return text

    async def async_forget(self, query: str, person: str | None = None) -> str | None:
        """Delete the single best match. Returns it, or None if nothing hit."""
        hits = await self.async_search(query, limit=1, person=person)
        if not hits:
            return None
        target = hits[0]

        def _forget() -> None:
            conn = self._connect()
            with conn:
                conn.execute("DELETE FROM memories WHERE text = ?", (target,))
            conn.close()

        await self._hass.async_add_executor_job(_forget)
        return target

    # --- reads ---------------------------------------------------------------

    async def async_search(
        self, query: str, limit: int = 3, person: str | None = None
    ) -> list[str]:
        """Best matches. person scopes to that person's rows plus the
        household's (''); None searches everything, as before 0.18."""
        match = self._to_match(query)
        if not match:
            return []

        def _search() -> list[str]:
            conn = self._connect()
            sql = (
                "SELECT text FROM memories WHERE memories MATCH ? "
                "{scope}ORDER BY bm25(memories) LIMIT ?"
            )
            args: tuple = (match, limit)
            if person:
                sql = sql.format(scope="AND person IN (?, '') ")
                args = (match, person, limit)
            else:
                sql = sql.format(scope="")
            try:
                rows = conn.execute(sql, args).fetchall()
            except sqlite3.OperationalError:
                # A query that survived _to_match but still isn't valid FTS5
                # should return nothing, not take the intent down with it.
                _LOGGER.debug("unusable memory query: %r", match)
                return []
            finally:
                conn.close()
            return [r[0] for r in rows]

        return await self._hass.async_add_executor_job(_search)

    async def async_all(self) -> list[tuple[str, str]]:
        """Every (text, person) pair, newest first."""

        def _all() -> list[tuple[str, str]]:
            conn = self._connect()
            rows = conn.execute(
                "SELECT text, person FROM memories ORDER BY rowid DESC"
            ).fetchall()
            conn.close()
            return [(r[0], r[1]) for r in rows]

        return await self._hass.async_add_executor_job(_all)

    @staticmethod
    def _to_match(query: str) -> str:
        """Spoken question -> an FTS5 OR-query over its content words."""
        words = [w.lower() for w in _WORD.findall(query)]
        terms = [w for w in words if w not in _STOP and len(w) > 2]
        # Every word was a stop word ("what do you know about me") - fall back
        # to the raw words rather than matching nothing at all.
        if not terms:
            terms = [w for w in words if len(w) > 2]
        return " OR ".join(f'"{t}"' for t in terms)
