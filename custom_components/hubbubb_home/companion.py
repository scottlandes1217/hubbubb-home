"""Optional companion bridge.

Everything the build screen does - listing coding-agent sessions, reading a
transcript, sending a prompt, uploading a screenshot - is a call to a small
HTTP daemon on the machine where that agent runs. Home Assistant cannot host
it: it drives a terminal. So it is optional, and when no URL is configured the
services answer with a clear error rather than timing out.
"""

from __future__ import annotations

import logging
from typing import Any

import aiohttp

_LOGGER = logging.getLogger(__name__)

_TIMEOUT = aiohttp.ClientTimeout(total=90)

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

    async def async_available(self) -> bool:
        """True when a companion is configured and answering."""
        if not self._url:
            return False
        try:
            await self.async_call("health", method="GET")
        except CompanionError:
            return False
        return True
