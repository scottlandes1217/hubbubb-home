"""The household cookbook, in the same SQLite file as the memories.

One FTS5 table, so "do we have anything with chicken and lemon" finds a recipe
by any word of its title or ingredients, ranked - not by an exact title. The
id is the FTS rowid. Ingredients and steps are stored one item per line, which
is what the panel edits and what a spoken recipe reads out. Every call runs in
the executor, as memory.py does and for the same reason.
"""

from __future__ import annotations

import html as _html
import json
import logging
import re
import sqlite3
from datetime import date
from urllib.parse import urlsplit

from homeassistant.core import HomeAssistant

from .const import MEMORY_DB
from .memory import Memory

_LOGGER = logging.getLogger(__name__)


def as_lines(value) -> str:
    """A list or a newline/comma-free block of text -> one item per line."""
    if isinstance(value, (list, tuple)):
        items = [str(v) for v in value]
    else:
        items = str(value or "").splitlines()
    return "\n".join(line for line in (i.strip() for i in items) if line)


_LD_JSON = re.compile(
    r"<script[^>]+application/ld\+json[^>]*>(.*?)</script>", re.S | re.I
)
_TAG = re.compile(r"<[^>]+>")


def _clean(value) -> str:
    return " ".join(_TAG.sub(" ", _html.unescape(str(value or ""))).split())


def _walk(node):
    """Every dict in a JSON-LD blob: lists, @graph and nesting included."""
    if isinstance(node, list):
        for item in node:
            yield from _walk(item)
    elif isinstance(node, dict):
        yield node
        for value in node.values():
            if isinstance(value, (list, dict)):
                yield from _walk(value)


def _steps(node) -> list[str]:
    """recipeInstructions: a string, HowToSteps, or HowToSections of them."""
    if isinstance(node, str):
        return [line for line in (_clean(x) for x in re.split(r"\n|<br\s*/?>", node)) if line]
    if isinstance(node, list):
        return [s for item in node for s in _steps(item)]
    if isinstance(node, dict):
        if "itemListElement" in node:
            return _steps(node["itemListElement"])
        return _steps(node.get("text") or node.get("name") or "")
    return []


def _minutes(iso) -> str:
    """PT1H30M -> '1 h 30 min'; anything unparseable -> ''."""
    m = re.fullmatch(r"P(?:\d+D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:\d+S)?", str(iso or ""))
    if not m or not any(m.groups()):
        return ""
    h, mins = divmod(int(m[1] or 0) * 60 + int(m[2] or 0), 60)
    return " ".join(p for p in (f"{h} h" if h else "", f"{mins} min" if mins else "") if p)


def recipe_from_html(page: str, url: str) -> dict | None:
    """The schema.org Recipe a recipe site embeds for search engines, or None.

    Nearly every recipe site publishes one, so no model reads the page.
    """
    for block in _LD_JSON.findall(page or ""):
        try:
            data = json.loads(block.strip())
        except ValueError:
            continue
        for node in _walk(data):
            kind = node.get("@type")
            if "Recipe" not in (kind if isinstance(kind, list) else [kind]):
                continue
            ingredients = [i for i in map(_clean, node.get("recipeIngredient") or []) if i]
            steps = _steps(node.get("recipeInstructions"))
            title = _clean(node.get("name"))
            if not title or not (ingredients or steps):
                continue
            image = node.get("image")
            while isinstance(image, (list, dict)):
                image = (image[0] if image else "") if isinstance(image, list) else image.get("url")
            rating = node.get("aggregateRating")
            rating = rating if isinstance(rating, dict) else {}
            yld = node.get("recipeYield")
            if isinstance(yld, list):
                yld = yld[0] if yld else ""
            return {
                "title": title,
                "ingredients": ingredients,
                "steps": steps,
                "source": url,
                "site": (urlsplit(url).hostname or "").removeprefix("www."),
                "image": image if isinstance(image, str) else "",
                "time": _minutes(node.get("totalTime") or node.get("cookTime")),
                "serves": _clean(yld),
                "rating": _clean(rating.get("ratingValue"))[:4],
                "reviews": _clean(rating.get("ratingCount") or rating.get("reviewCount")),
            }
    return None


EVENT_RECIPES = "hubbubb_home_recipes"  # fired after any save or delete


class Recipes:
    """Saved recipes, shared by the panel, the services and the agent."""

    _SCHEMA = (
        "CREATE VIRTUAL TABLE IF NOT EXISTS recipes USING fts5("
        "title, ingredients, steps, source UNINDEXED, created UNINDEXED)"
    )
    _SELECT = "SELECT rowid, title, ingredients, steps, source, created FROM recipes"

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._path = hass.config.path(MEMORY_DB)

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self._path, timeout=10)
        conn.execute(self._SCHEMA)
        return conn

    async def async_setup(self) -> None:
        await self._hass.async_add_executor_job(lambda: self._connect().close())

    @staticmethod
    def _row(r) -> dict:
        return {
            "id": r[0],
            "title": r[1],
            "ingredients": r[2].split("\n") if r[2] else [],
            "steps": r[3].split("\n") if r[3] else [],
            "source": r[4],
            "created": r[5],
        }

    # --- writes --------------------------------------------------------------

    async def async_save(
        self,
        title: str,
        ingredients,
        steps,
        source: str = "",
        recipe_id: int | None = None,
    ) -> dict:
        """Insert, or with recipe_id replace. Returns the stored recipe."""
        title = " ".join(str(title or "").split())
        ingredients = as_lines(ingredients)
        steps = as_lines(steps)
        if not title:
            raise ValueError("a recipe needs a title")
        if not ingredients and not steps:
            raise ValueError("a recipe needs ingredients or steps")
        source = str(source or "").strip()

        def _save() -> dict:
            conn = self._connect()
            with conn:
                if recipe_id is None:
                    cur = conn.execute(
                        "INSERT INTO recipes (title, ingredients, steps, source, "
                        "created) VALUES (?, ?, ?, ?, ?)",
                        (title, ingredients, steps, source, date.today().isoformat()),
                    )
                    rid = cur.lastrowid
                else:
                    cur = conn.execute(
                        "UPDATE recipes SET title = ?, ingredients = ?, steps = ?, "
                        "source = ? WHERE rowid = ?",
                        (title, ingredients, steps, source, recipe_id),
                    )
                    if cur.rowcount == 0:
                        raise ValueError(f"no recipe {recipe_id}")
                    rid = recipe_id
                row = conn.execute(f"{self._SELECT} WHERE rowid = ?", (rid,)).fetchone()
            conn.close()
            return self._row(row)

        stored = await self._hass.async_add_executor_job(_save)
        _LOGGER.debug("recipe saved: %s", title)
        # Both write paths (service and agent tool) end here, so this is the
        # one place the Recipes panel needs to hear about a change.
        self._hass.bus.async_fire(EVENT_RECIPES, {"id": stored["id"]})
        return stored

    async def async_delete(self, recipe_id: int) -> bool:
        def _delete() -> bool:
            conn = self._connect()
            with conn:
                cur = conn.execute("DELETE FROM recipes WHERE rowid = ?", (recipe_id,))
            conn.close()
            return cur.rowcount > 0

        gone = await self._hass.async_add_executor_job(_delete)
        if gone:
            self._hass.bus.async_fire(EVENT_RECIPES, {"id": recipe_id})
        return gone

    # --- reads ---------------------------------------------------------------

    async def async_search(self, query: str, limit: int = 3) -> list[dict]:
        """Best matches, title words counting most, then ingredients."""
        match = Memory._to_match(query)
        if not match:
            return []

        def _search() -> list[dict]:
            conn = self._connect()
            try:
                rows = conn.execute(
                    f"{self._SELECT} WHERE recipes MATCH ? "
                    "ORDER BY bm25(recipes, 10.0, 3.0, 1.0) LIMIT ?",
                    (match, limit),
                ).fetchall()
            except sqlite3.OperationalError:
                _LOGGER.debug("unusable recipe query: %r", match)
                return []
            finally:
                conn.close()
            return [self._row(r) for r in rows]

        return await self._hass.async_add_executor_job(_search)

    async def async_all(self) -> list[dict]:
        """Every recipe, alphabetical - the panel's list."""

        def _all() -> list[dict]:
            conn = self._connect()
            rows = conn.execute(f"{self._SELECT} ORDER BY title COLLATE NOCASE").fetchall()
            conn.close()
            return [self._row(r) for r in rows]

        return await self._hass.async_add_executor_job(_all)
