"""Hubbubb client: OAuth2 client-credentials, then MCP over Streamable HTTP.

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
from typing import Any
from urllib.parse import urlsplit

import aiohttp

_LOGGER = logging.getLogger(__name__)

# Sixty seconds of slack so a token cannot expire in flight between the check
# and the request that uses it.
_SKEW = 60
_TIMEOUT = aiohttp.ClientTimeout(total=120)


class HubbubbError(Exception):
    """Hubbubb refused or could not be reached."""


class HubbubbClient:
    """Minimal MCP client for one Hubbubb organisation."""

    def __init__(
        self,
        session: aiohttp.ClientSession,
        url: str,
        client_id: str,
        client_secret: str,
    ) -> None:
        self._session = session
        self._url = url
        self._id = client_id
        self._secret = client_secret
        parts = urlsplit(url)
        self._token_url = f"{parts.scheme}://{parts.netloc}/oauth/token"
        self._token: str | None = None
        self._expires = 0.0
        self._lock = asyncio.Lock()
        self._msg_id = 0

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

    async def _rpc(self, method: str, params: dict | None = None) -> Any:
        self._msg_id += 1
        message = {"jsonrpc": "2.0", "id": self._msg_id, "method": method}
        if params is not None:
            message["params"] = params

        for attempt in (0, 1):
            token = await self._bearer(force=attempt == 1)
            try:
                async with self._session.post(
                    self._url,
                    json=message,
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Accept": "application/json, text/event-stream",
                    },
                    timeout=_TIMEOUT,
                ) as resp:
                    # A token revoked or expired early reads as 401 here.
                    if resp.status == 401 and attempt == 0:
                        continue
                    body = await resp.text()
                    if resp.status >= 400:
                        raise HubbubbError(
                            f"Hubbubb HTTP {resp.status}: {body[:200]}"
                        )
            except aiohttp.ClientError as err:
                raise HubbubbError(f"Hubbubb unreachable: {err}") from err

            if not body.strip():
                return None
            payload = _parse(body)
            if isinstance(payload, dict) and "error" in payload:
                raise HubbubbError(str(payload["error"].get("message", payload)))
            return (payload or {}).get("result")
        raise HubbubbError("Hubbubb rejected the credentials")

    async def async_verify(self) -> None:
        """Mint a token and shake hands. Raises HubbubbError if either fails."""
        await self._rpc(
            "initialize",
            {
                "protocolVersion": "2025-06-18",
                "capabilities": {},
                "clientInfo": {"name": "hubbubb-home", "version": "0.1.0"},
            },
        )

    async def async_ask(self, question: str) -> str:
        """Put a plain-English request to Hubbubb's own agent."""
        result = await self._rpc(
            "tools/call",
            {"name": "ask_hubbubb", "arguments": {"query": question}},
        )
        return _text_of(result)


def _parse(body: str) -> dict | None:
    """Read a JSON body, or the first data: frame of an SSE response."""
    import json

    body = body.strip()
    if body.startswith("{"):
        return json.loads(body)
    for line in body.splitlines():
        if line.startswith("data:"):
            chunk = line[5:].strip()
            if chunk and chunk != "[DONE]":
                return json.loads(chunk)
    return None


def _text_of(result: Any) -> str:
    """Flatten an MCP tool result into something speakable."""
    if result is None:
        return ""
    if isinstance(result, str):
        return result
    content = result.get("content") if isinstance(result, dict) else None
    if not content:
        return str(result)
    parts = [
        block.get("text", "")
        for block in content
        if isinstance(block, dict) and block.get("type") == "text"
    ]
    return "\n".join(p for p in parts if p).strip()
