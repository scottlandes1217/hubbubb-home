"""Optional companion bridge.

Everything the build screen does - listing coding-agent sessions, reading a
transcript, sending a prompt, uploading a screenshot - is a call to a small
HTTP daemon on the machine where that agent runs. Home Assistant cannot host
it: it drives a terminal. So it is optional, and when no URL is configured the
services answer with a clear error rather than timing out.
"""

from __future__ import annotations

import asyncio
import logging
import re
from html.parser import HTMLParser
from typing import Any

import aiohttp
from urllib.parse import urlsplit

_LOGGER = logging.getLogger(__name__)

_TIMEOUT = aiohttp.ClientTimeout(total=90)
SEARCH_PORT = 8888
PAGES_READ = 2


class _PageText(HTMLParser):
    """Visible text lines of a page, minus scripts, styles and chrome."""

    SKIP = {"script", "style", "noscript", "svg", "nav", "footer", "header"}

    def __init__(self) -> None:
        super().__init__()
        self.lines: list[str] = []
        self._skipping = 0

    def handle_starttag(self, tag, attrs) -> None:
        self._skipping += tag in self.SKIP

    def handle_endtag(self, tag) -> None:
        if tag in self.SKIP and self._skipping:
            self._skipping -= 1

    def handle_data(self, data) -> None:
        if not self._skipping and data.strip():
            self.lines.append(data.strip())


def relevant_text(html: str, query: str, limit: int = 1500) -> str:
    """The parts of a page that mention the query, each with a line of context.

    Snippets alone rarely hold the answer, and a small model fills the gap
    from stale training. A whole page is too long to hand it every turn.
    """
    # ponytail: keyword overlap, so "most recent" style questions can miss the
    # right line on long tables; upgrade to embedding rank if that bites.
    parser = _PageText()
    parser.feed(html)
    lines = parser.lines
    terms = {w for w in re.findall(r"[a-z0-9]+", query.lower()) if len(w) > 2}
    hits = [i for i, line in enumerate(lines) if any(t in line.lower() for t in terms)]
    hits.sort(key=lambda i: -sum(t in lines[i].lower() for t in terms))
    text = " | ".join(" ".join(lines[max(0, i - 1) : i + 2]) for i in sorted(hits[:40]))
    return text[:limit]

NOT_CONFIGURED = (
    "No companion is set up, so there is no coding agent to talk to. Add one "
    "in the Hubbubb Home options if you run one."
)


class CompanionError(Exception):
    """The companion is absent, unreachable, or refused the call."""


class CompanionClient:
    """Thin typed wrapper over the companion's HTTP endpoints."""

    def __init__(
        self,
        session: aiohttp.ClientSession,
        url: str | None,
        token: str | None,
    ) -> None:
        self._session = session
        self._url = (url or "").rstrip("/")
        self._token = token

    @property
    def configured(self) -> bool:
        return bool(self._url)

    async def async_call(
        self,
        endpoint: str,
        payload: dict | None = None,
        method: str = "POST",
        timeout: int | None = None,
    ) -> Any:
        if not self._url:
            raise CompanionError(NOT_CONFIGURED)
        headers = {}
        if self._token:
            headers["Authorization"] = f"Bearer {self._token}"
        # Reads are GETs with query parameters, writes are POSTs with a body.
        # The nightly review runs a coding agent over a day of transcripts;
        # 90 seconds is right for a keypress and nowhere near enough for that.
        kwargs: dict = {
            "headers": headers,
            "timeout": aiohttp.ClientTimeout(total=timeout) if timeout else _TIMEOUT,
        }
        if method == "GET":
            kwargs["params"] = {
                k: str(v) for k, v in (payload or {}).items() if v is not None
            }
        else:
            kwargs["json"] = payload or {}
        try:
            async with self._session.request(
                method,
                f"{self._url}/{endpoint.lstrip('/')}",
                **kwargs,
            ) as resp:
                body = await resp.text()
                if resp.status >= 400:
                    raise CompanionError(
                        f"companion returned {resp.status}: {body[:200]}"
                    )
                if not body.strip():
                    return {}
                import json

                try:
                    return json.loads(body)
                except ValueError:
                    return {"content": body}
        except aiohttp.ClientError as err:
            raise CompanionError(f"companion unreachable: {err}") from err

    async def async_search(self, query: str, limit: int) -> list[dict]:
        """Web results from the SearXNG instance on the companion's machine.

        It runs beside the companion (port 8888) so its address follows the
        companion URL rather than being one more setting to keep in step.
        """
        if not self._url:
            raise CompanionError(NOT_CONFIGURED)
        url = f"http://{urlsplit(self._url).hostname}:{SEARCH_PORT}/search"
        try:
            async with self._session.get(
                url,
                params={"q": query, "format": "json"},
                timeout=aiohttp.ClientTimeout(total=20),
            ) as resp:
                if resp.status >= 400:
                    raise CompanionError(f"web search returned {resp.status}")
                data = await resp.json(content_type=None)
        except aiohttp.ClientError as err:
            raise CompanionError(f"web search unreachable: {err}") from err
        results = [
            {
                "title": r.get("title", ""),
                "url": r.get("url", ""),
                "snippet": (r.get("content") or "")[:400],
            }
            for r in data.get("results", [])[:limit]
        ]
        pages = await asyncio.gather(
            *(self._page_text(r["url"], query) for r in results[:PAGES_READ])
        )
        for result, text in zip(results, pages):
            if text:
                result["page_text"] = text
        return results

    async def _page_text(self, url: str, query: str) -> str:
        """Best effort: a page that is slow, huge or not HTML just adds nothing."""
        try:
            async with self._session.get(
                url,
                headers={"User-Agent": "Mozilla/5.0"},
                timeout=aiohttp.ClientTimeout(total=5),
            ) as resp:
                if resp.status >= 400 or "html" not in resp.content_type:
                    return ""
                html = (await resp.content.read(3_000_000)).decode("utf-8", "replace")
        except (aiohttp.ClientError, asyncio.TimeoutError):
            return ""
        return relevant_text(html, query)

    async def async_available(self) -> bool:
        """True when a companion is configured and answering."""
        if not self._url:
            return False
        try:
            await self.async_call("health", method="GET")
        except CompanionError:
            return False
        return True
