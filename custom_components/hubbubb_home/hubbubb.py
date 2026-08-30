"""Hubbubb client: OAuth2 client-credentials, then the REST runs API.

Hubbubb's entire external surface is one agent-runs API; its MCP endpoint is
a thin wrapper over the same service, so this speaks REST directly and gains
the part MCP hides: the run id. A slow answer can be handed to a background
poll and spoken through the house when it lands, instead of the voice
pipeline holding its breath for a minute.

Hubbubb issues bearer tokens that live an hour and publishes no .well-known
discovery, so the token is minted here and re-minted when the server refuses
one. That is the whole reason a desktop MCP client needs a shim in front of
Hubbubb and Home Assistant does not: this process is long-lived and can hold
the credentials itself.
"""

from __future__ import annotations

import asyncio
import logging
import time
from typing import Any, Awaitable, Callable
from urllib.parse import urlsplit

import aiohttp

_LOGGER = logging.getLogger(__name__)

# Sixty seconds of slack so a token cannot expire in flight between the check
# and the request that uses it.
_SKEW = 60
# The API's server-side wait caps at 60s; polling picks up from there.
_MAX_WAIT = 60
_POLL_SECONDS = 3
_TIMEOUT = aiohttp.ClientTimeout(total=120)

# API error codes -> something a voice can say.
_SPEAKABLE = {
    "too_many_active_runs": "Hubbubb has too many requests running; try again in a minute",
    "ai_not_configured": "Hubbubb's AI is not set up for this organisation",
    "empty_instruction": "there was nothing to ask Hubbubb",
    "run_as_user_required": "this Hubbubb connection has no acting user",
    "run_as_user_inactive": "this Hubbubb connection's user is no longer active",
    "insufficient_scope": "this Hubbubb connection is not allowed to do that",
}


class HubbubbError(Exception):
    """Hubbubb refused or could not be reached."""


class HubbubbPending(HubbubbError):
    """The run is still going; poll `run_id` for the answer."""

    def __init__(self, run_id: str) -> None:
        super().__init__("Hubbubb is still working on it")
        self.run_id = run_id


class HubbubbClient:
    """Minimal runs-API client for one Hubbubb organisation."""

    def __init__(
        self,
        session: aiohttp.ClientSession,
        url: str,
        client_id: str,
        client_secret: str,
    ) -> None:
        self._session = session
        # The configured URL has historically been the MCP endpoint
        # (…/api/v1/<org>/mcp); the runs API lives beside it, so accept
        # either form and strip the /mcp suffix.
        base = url.rstrip("/")
        if base.endswith("/mcp"):
            base = base[: -len("/mcp")]
        self._runs_url = f"{base}/ai/runs"
        self._id = client_id
        self._secret = client_secret
        parts = urlsplit(url)
        self._token_url = f"{parts.scheme}://{parts.netloc}/oauth/token"
        self._token: str | None = None
        self._expires = 0.0
        self._lock = asyncio.Lock()
        self._tasks: set[asyncio.Task] = set()

    async def _bearer(self, force: bool = False) -> str:
        async with self._lock:
            if not force and self._token and time.time() < self._expires - _SKEW:
                return self._token
            try:
                async with self._session.post(
                    self._token_url,
                    json={
                        "grant_type": "client_credentials",
                        "client_id": self._id,
                        "client_secret": self._secret,
                    },
                    timeout=_TIMEOUT,
                ) as resp:
                    if resp.status != 200:
                        raise HubbubbError(
                            f"token endpoint returned {resp.status}"
                        )
                    data = await resp.json()
            except aiohttp.ClientError as err:
                raise HubbubbError(f"cannot reach Hubbubb: {err}") from err
            self._token = data["access_token"]
            self._expires = time.time() + int(data.get("expires_in", 3600))
            return self._token

    async def _request(
        self, method: str, url: str, body: dict | None = None
    ) -> dict:
        """One authenticated call, with a single re-mint on 401."""
        for attempt in (0, 1):
            token = await self._bearer(force=attempt == 1)
            try:
                async with self._session.request(
                    method,
                    url,
                    json=body,
                    headers={"Authorization": f"Bearer {token}"},
                    timeout=_TIMEOUT,
                ) as resp:
                    # A token revoked or expired early reads as 401 here.
                    if resp.status == 401 and attempt == 0:
                        continue
                    payload = None
                    try:
                        payload = await resp.json()
                    except (aiohttp.ContentTypeError, ValueError):
                        pass
                    if resp.status >= 400:
                        code = (payload or {}).get("error", "")
                        raise HubbubbError(
                            _SPEAKABLE.get(
                                code, f"Hubbubb HTTP {resp.status}: {code}"
                            )
                        )
                    return payload or {}
            except aiohttp.ClientError as err:
                raise HubbubbError(f"Hubbubb unreachable: {err}") from err
        raise HubbubbError("Hubbubb rejected the credentials")

    async def async_verify(self) -> None:
        """Mint a token. Raises HubbubbError if the credentials are bad."""
        await self._bearer(force=True)

    async def async_ask(
        self, question: str, wait: int = 25, timeout: float = 90
    ) -> str:
        """Put a plain-English request to Hubbubb's own agent, blocking.

        Waits server-side first (capped at the API's 60s), then polls. Past
        `timeout` the run is NOT cancelled - HubbubbPending carries its id so
        the caller can keep polling in the background and speak the answer
        when it lands.
        """
        deadline = time.monotonic() + timeout
        run = await self._request(
            "POST",
            self._runs_url,
            {"message": question, "wait": min(int(wait), _MAX_WAIT)},
        )
        while not run.get("finished"):
            if time.monotonic() >= deadline:
                raise HubbubbPending(str(run.get("id")))
            await asyncio.sleep(_POLL_SECONDS)
            run = await self._request("GET", f"{self._runs_url}/{run['id']}")
        return self._summary_of(run)

    def async_wait_background(
        self,
        run_id: str,
        on_done: Callable[[str, bool], Awaitable[None]],
        timeout: float = 300,
    ) -> None:
        """Keep polling an unfinished run; call on_done(text, ok) at the end.

        Never raises into the void: every failure becomes on_done(text, False).
        Tasks are tracked so unload can cancel them.
        """

        async def _poll() -> None:
            deadline = time.monotonic() + timeout
            try:
                while time.monotonic() < deadline:
                    await asyncio.sleep(_POLL_SECONDS)
                    run = await self._request(
                        "GET", f"{self._runs_url}/{run_id}"
                    )
                    if run.get("finished"):
                        await on_done(self._summary_of(run), True)
                        return
                await on_done("it took too long and was given up on", False)
            except asyncio.CancelledError:
                raise
            except HubbubbError as err:
                await on_done(str(err), False)
            except Exception:  # a broken callback must not crash the loop
                _LOGGER.exception("background Hubbubb poll failed")

        task = asyncio.get_running_loop().create_task(_poll())
        self._tasks.add(task)
        task.add_done_callback(self._tasks.discard)

    def cancel_background(self) -> None:
        for task in self._tasks:
            task.cancel()

    @staticmethod
    def _summary_of(run: dict) -> str:
        if run.get("status") == "failed" or run.get("error"):
            raise HubbubbError(str(run.get("error") or "the Hubbubb run failed"))
        return str(run.get("summary") or "").strip()


def parse_people(text: str) -> dict[str, tuple[str, str]]:
    """'Person Name: client_id : client_secret' lines -> {person: (id, secret)}.

    Split at the first two colons only - Hubbubb secrets may themselves
    contain colons. Names are lowercased for lookup; bad lines are skipped.
    """
    out: dict[str, tuple[str, str]] = {}
    for line in (text or "").splitlines():
        person, _, rest = line.partition(":")
        client_id, sep, secret = rest.partition(":")
        if person.strip() and client_id.strip() and sep and secret.strip():
            out[person.strip().lower()] = (client_id.strip(), secret.strip())
    return out
