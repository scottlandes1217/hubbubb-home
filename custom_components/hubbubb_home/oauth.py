"""Sign in with Hubbubb: linking a person by their own consent, not a pasted key.

The pasted path in links.py hands the house a client id and secret and asks
Hubbubb afterwards whose they are. This one runs the other way round: the
panel asks here for an authorize URL, the person signs in to Hubbubb in a new
window and approves, and Hubbubb sends the browser back to the callback with
a code that is swapped for that person's own tokens. Nothing is typed into
Home Assistant, and the CRM's own login is the proof of who they are.

Two views, one of them open. /oauth/start is behind Home Assistant's login
like everything else in the studio. /oauth/callback cannot be: Hubbubb
redirects a browser to it, and that browser carries no Home Assistant
session on a cross-site navigation - so the `state` does the work a session
would. It is unguessable, single-use, gone in ten minutes, and the only thing
that ties a callback to a person and a PKCE verifier.
"""

from __future__ import annotations

import base64
import hashlib
import html
import logging
import secrets
import time
from urllib.parse import urlencode

import aiohttp
from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import (
    CONF_HUBBUBB,
    CONF_HUBBUBB_OAUTH_ID,
    CONF_HUBBUBB_OAUTH_SECRET,
    CONF_HUBBUBB_TOKENS,
    CONF_HUBBUBB_URL,
    DOMAIN,
)
from .hubbubb import HubbubbUserClient, fresh_record, origin
from .links import _hubbubb_entry, _identity, _json, _plain
from .speakers import refusal

_LOGGER = logging.getLogger(__name__)

START_URL = f"/api/{DOMAIN}/oauth/start"
CALLBACK_PATH = f"/api/{DOMAIN}/oauth/callback"

# A code is good for ten minutes at Hubbubb, so a flow that has not come back
# by then cannot succeed anyway. Kept in memory on purpose: a restart in the
# middle of a sign-in only costs the person one more press of the button, and
# nothing half-done ever reaches the config entry.
FLOW_SECONDS = 600
_pending: dict[str, dict] = {}


def pkce() -> tuple[str, str]:
    """(verifier, S256 challenge). 86 and 43 chars of base64url, no padding."""
    verifier = secrets.token_urlsafe(64)
    digest = hashlib.sha256(verifier.encode("ascii")).digest()
    return verifier, base64.urlsafe_b64encode(digest).rstrip(b"=").decode("ascii")


def redirect_uri(scheme: str, host: str) -> str:
    """Where Hubbubb sends the browser back: this house, as the browser reached it.

    Taken from the request that started the flow rather than from a setting,
    because the window Hubbubb redirects is the one the panel opened - the
    address it used to reach Home Assistant is by definition one that works
    from there. It must be registered on the client at Hubbubb byte for byte,
    so it is also handed back to the panel for the administrator to copy.
    """
    return f"{scheme}://{host}{CALLBACK_PATH}"


def begin(person: str, redirect: str, now: float | None = None) -> tuple[str, str]:
    """Remember a flow for this person; -> (state, challenge). The verifier stays here."""
    now = time.time() if now is None else now
    for state in [s for s, flow in _pending.items() if flow["deadline"] <= now]:
        del _pending[state]
    state = secrets.token_urlsafe(32)
    verifier, challenge = pkce()
    _pending[state] = {
        "person": person,
        "verifier": verifier,
        "challenge": challenge,
        "redirect_uri": redirect,
        "deadline": now + FLOW_SECONDS,
    }
    return state, challenge


def take(state: str, now: float | None = None) -> dict | None:
    """The flow behind a state, once. A second look, or a late one, finds nothing."""
    now = time.time() if now is None else now
    flow = _pending.pop(state or "", None)
    return flow if flow and flow["deadline"] > now else None


def authorize_url(base: str, client_id: str, redirect: str, state: str, challenge: str) -> str:
    return f"{base}/oauth/authorize?" + urlencode(
        {
            "response_type": "code",
            "client_id": client_id,
            "redirect_uri": redirect,
            "state": state,
            "code_challenge": challenge,
            "code_challenge_method": "S256",
        }
    )


def tokens_only_change(old: dict, new: dict) -> bool:
    """Did an entry update touch nothing but existing people's token records?

    A refreshed token is persisted through the same async_update_entry the
    options form uses, and that reloads the integration - which cancels every
    running timer and rebuilds the panel. Rotation happens hourly per person,
    so the reload listener asks this first. A person appearing or leaving the
    token map still reloads: that is how their client comes and goes.
    """
    strip = lambda data: {k: v for k, v in data.items() if k != CONF_HUBBUBB_TOKENS}
    same_people = set(old.get(CONF_HUBBUBB_TOKENS) or {}) == set(
        new.get(CONF_HUBBUBB_TOKENS) or {}
    )
    return same_people and strip(old) == strip(new)


def token_io(hass: HomeAssistant, entry, person: str):
    """(load, save) for one person's record, reading the entry live."""

    def load() -> dict | None:
        return (entry.data.get(CONF_HUBBUBB_TOKENS) or {}).get(person)

    def save(record: dict) -> None:
        tokens = {**(entry.data.get(CONF_HUBBUBB_TOKENS) or {}), person: record}
        hass.config_entries.async_update_entry(
            entry, data={**entry.data, CONF_HUBBUBB_TOKENS: tokens}
        )

    return load, save


def oauth_client(entry) -> tuple[str, str, str] | None:
    """(base, client id, secret) when the house has an OAuth client, else None."""
    hub = (entry.data.get(CONF_HUBBUBB) or {}) if entry else {}
    if hub.get(CONF_HUBBUBB_OAUTH_ID) and hub.get(CONF_HUBBUBB_OAUTH_SECRET):
        return (
            origin(hub[CONF_HUBBUBB_URL]),
            hub[CONF_HUBBUBB_OAUTH_ID],
            hub[CONF_HUBBUBB_OAUTH_SECRET],
        )
    return None


async def async_start(
    hass: HomeAssistant,
    user_name: str | None,
    is_admin: bool,
    person: str | None,
    scheme: str,
    host: str,
) -> tuple[int, str, bytes]:
    """Mint a flow and answer with the URL to open. -> (status, type, body).

    The URL comes back as JSON rather than as a redirect: the panel asks from
    an XHR, and a redirect there would be followed by fetch and thrown away.
    An administrator can start a flow for anyone; anybody else only for the
    name on their own Home Assistant account, which is the one sign-in that
    cannot attach somebody else's Hubbubb user to their voice.
    """
    entry = _hubbubb_entry(hass)
    if entry is None:
        return refusal(503, "Hubbubb is not configured")
    client = oauth_client(entry)
    if client is None:
        return refusal(503, "Sign in with Hubbubb is not set up: add the OAuth client id and secret in the Hubbubb options")
    person = (person or "").strip()
    if not person or len(person) > 80:
        return _plain(400, "which person?")
    if not is_admin and person.lower() != (user_name or "").strip().lower():
        return _plain(403, "only an administrator can sign somebody else in")
    base, client_id, _ = client
    redirect = redirect_uri(scheme, host)
    state, challenge = begin(person, redirect)
    return _json(
        {
            "person": person,
            "url": authorize_url(base, client_id, redirect, state, challenge),
            "redirect_uri": redirect,
        }
    )


async def async_callback(hass: HomeAssistant, query: dict) -> tuple[int, str, bytes]:
    """Hubbubb's redirect, code in hand. -> (status, type, html body).

    Whatever happens, the answer is a page for a person, not JSON for a
    panel: the browser landing here is the one they signed in with.
    """
    flow = take(query.get("state"))
    if flow is None:
        return _page(
            400,
            "That sign-in link is not one this house asked for, or it has expired.",
            "Go back to the Voice Studio and press Sign in with Hubbubb again.",
        )
    person = flow["person"]
    if query.get("error"):
        reason = "was declined" if query["error"] == "access_denied" else f"failed ({query['error']})"
        return _page(200, f"The Hubbubb sign-in for {person} {reason}.", "Nothing was linked. You can close this window.")
    code = query.get("code")
    entry = _hubbubb_entry(hass)
    client = oauth_client(entry)
    if not code or client is None:
        return _page(503, f"Hubbubb sent {person} back without a code, or the house lost its OAuth client meanwhile.", "Nothing was linked. Try again from the Voice Studio.")
    base, client_id, secret = client
    session = async_get_clientsession(hass)
    try:
        async with session.post(
            f"{base}/oauth/token",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": flow["redirect_uri"],
                "code_verifier": flow["verifier"],
                "client_id": client_id,
                "client_secret": secret,
            },
            timeout=aiohttp.ClientTimeout(total=30),
        ) as resp:
            payload = await _json_or_none(resp) or {}
            grant = payload if resp.status == 200 and payload.get("access_token") else None
            error = str(payload.get("error") or resp.status)
    except aiohttp.ClientError as err:
        _LOGGER.debug("Hubbubb token exchange for %s did not connect: %s", person, err)
        return _page(502, f"Hubbubb could not be reached to finish signing {person} in.", "Nothing was linked. Try again from the Voice Studio.")
    if grant is None:
        # The error word only - never the code or anything Hubbubb minted.
        _LOGGER.debug("Hubbubb refused the token exchange for %s: %s", person, error)
        return _page(400, f"Hubbubb refused to finish signing {person} in ({error}).", "Nothing was linked. Try again from the Voice Studio.")

    record = fresh_record({"person": person}, grant)
    # The same "who am I?" the pasted path asks, on the new token: the sign-in
    # proves the credential is theirs, the answer puts the name on the row.
    hub_url = entry.data[CONF_HUBBUBB][CONF_HUBBUBB_URL]
    asker = HubbubbUserClient(session, hub_url, client_id, secret, lambda: record, record.update)
    record["identity"] = await _identity(asker)
    tokens = {**(entry.data.get(CONF_HUBBUBB_TOKENS) or {}), person.lower(): record}
    hass.config_entries.async_update_entry(
        entry, data={**entry.data, CONF_HUBBUBB_TOKENS: tokens}
    )
    who = f" as {record['identity']}" if record["identity"] else ""
    return _page(
        200,
        f"Signed in. {person}'s voice is now linked to Hubbubb{who}.",
        "You can close this window and go back to the Voice Studio.",
        close=True,
    )


async def _json_or_none(resp) -> dict | None:
    try:
        return await resp.json()
    except (aiohttp.ContentTypeError, ValueError):
        return None


def _page(status: int, headline: str, detail: str, close: bool = False) -> tuple[int, str, bytes]:
    """A short page for the person in the popup. Closes itself when it can:
    the panel opened this window, so window.close() is allowed to work."""
    body = (
        "<!doctype html><meta charset=utf-8><title>Hubbubb Home</title>"
        "<body style='font:16px/1.5 system-ui,sans-serif;max-width:32em;margin:3em auto;padding:0 1em'>"
        f"<p><strong>{html.escape(headline)}</strong></p><p>{html.escape(detail)}</p>"
        + ("<script>setTimeout(function(){window.close()},2500)</script>" if close else "")
    )
    return status, "text/html; charset=utf-8", body.encode()


class OAuthStartView(HomeAssistantView):
    """GET /api/hubbubb_home/oauth/start?person=Name -> {"url", "redirect_uri"}."""

    url = START_URL
    name = f"{DOMAIN}:oauth-start"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def get(self, request: web.Request) -> web.Response:
        user = request["hass_user"]
        status, content_type, payload = await async_start(
            self._hass,
            getattr(user, "name", None),
            bool(user.is_admin),
            request.query.get("person"),
            request.scheme,
            request.host,
        )
        return web.Response(status=status, body=payload, headers={"Content-Type": content_type})


class OAuthCallbackView(HomeAssistantView):
    """GET /api/hubbubb_home/oauth/callback?code=&state= - Hubbubb's redirect.

    Open on purpose: the browser arriving here has just come from another
    site and carries no Home Assistant token. See the module docstring for
    what the state does instead.
    """

    url = CALLBACK_PATH
    name = f"{DOMAIN}:oauth-callback"
    requires_auth = False

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def get(self, request: web.Request) -> web.Response:
        status, content_type, payload = await async_callback(self._hass, dict(request.query))
        return web.Response(status=status, body=payload, headers={"Content-Type": content_type})
