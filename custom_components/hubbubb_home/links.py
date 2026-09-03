"""Linking a person to their own Hubbubb user, from the Voice Studio.

The people map is one line per person on the config entry - "Name: id :
secret" - and until now the only way at it was the options form. The studio
already lists the people the voice service knows, so this puts the link
beside the name: read the map back with the secrets withheld, verify a new
pair against Hubbubb before it is kept, and rewrite one line without
disturbing the others. Saving goes through async_update_entry, so the same
update listener that serves the options form reloads the entry; there is no
second path for a change to take effect.
"""

from __future__ import annotations

import json
import logging

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import CONF_HUBBUBB, CONF_HUBBUBB_PEOPLE, CONF_HUBBUBB_URL, DOMAIN
from .hubbubb import HubbubbClient, HubbubbError
from .speakers import refusal

_LOGGER = logging.getLogger(__name__)

LINKS_URL = f"/api/{DOMAIN}/people/links"


def split_line(line: str) -> tuple[str, str, str] | None:
    """One 'Name: id : secret' line -> (name, id, secret); None for chaff.

    The rule parse_people reads by - split at the first two colons only -
    but the name keeps its case, because it is going back on screen.
    """
    person, _, rest = line.partition(":")
    client_id, sep, secret = rest.partition(":")
    if person.strip() and client_id.strip() and sep and secret.strip():
        return person.strip(), client_id.strip(), secret.strip()
    return None


def _same(a: str, b: str) -> bool:
    return a.strip().lower() == b.strip().lower()


def set_line(text: str, person: str, client_id: str, secret: str) -> str:
    """The map with this person's line replaced, or added if they are new.

    Every other line - blank, oddly spaced, half-written - comes back byte
    for byte. A second line for the same person would win on read (the
    parser keeps the last), so any duplicate goes too.
    """
    lines: list[str | None] = list((text or "").splitlines())
    new = f"{person}: {client_id} : {secret}"
    done = False
    for i, line in enumerate(lines):
        parsed = split_line(line)
        if parsed and _same(parsed[0], person):
            lines[i] = None if done else new
            done = True
    if not done:
        lines.append(new)
    return _join(lines, text)


def remove_line(text: str, person: str) -> str:
    lines = [
        None if (p := split_line(line)) and _same(p[0], person) else line
        for line in (text or "").splitlines()
    ]
    return _join(lines, text)


def _join(lines: list, original: str) -> str:
    out = "\n".join(line for line in lines if line is not None)
    return out + "\n" if (original or "").endswith("\n") and out else out


def hint(client_id: str) -> str:
    """Enough of a client id to recognise on screen, not enough to use."""
    return f"{client_id[:6]}… ({len(client_id)} characters)"


def _hubbubb_entry(hass: HomeAssistant):
    """The entry whose people map this edits: the one with a Hubbubb URL.

    Read from the config entries rather than the runtime, so the answer is
    the same during the reload that a save sets off.
    """
    for entry in hass.config_entries.async_entries(DOMAIN):
        if (entry.data.get(CONF_HUBBUBB) or {}).get(CONF_HUBBUBB_URL):
            return entry
    return None


async def _voice_people(hass: HomeAssistant) -> list[str]:
    """Names the voice service knows, or none if it is absent or down."""
    runtimes = hass.data.get(DOMAIN, {}).values()
    book = next((r.speakers for r in runtimes if r.speakers.configured), None)
    if book is None:
        return []
    status, _, body = await book.async_proxy("GET", "people", "", b"", "")
    try:
        return list(json.loads(body)) if status == 200 else []
    except ValueError:
        return []


def _plain(status: int, text: str) -> tuple[int, str, bytes]:
    return status, "text/plain; charset=utf-8", text.encode()


def _json(payload: dict) -> tuple[int, str, bytes]:
    return 200, "application/json", json.dumps(payload).encode()


async def async_links(
    hass: HomeAssistant,
    is_admin: bool,
    method: str,
    person: str | None = None,
    body: dict | None = None,
) -> tuple[int, str, bytes]:
    """Every decision behind the view. -> (status, content type, body).

    Plain values, as the voice proxy does it, so the whole thing runs in the
    test with a fake hass and no aiohttp. Reading is open to anyone logged
    in - the panel shows every household member who is linked, and a hint is
    all it gets. Writing is for administrators: a credential pair is what
    lets the house act as that person in the CRM, and attaching one to
    somebody else's name must not be a thing a shared login can do.
    """
    entry = _hubbubb_entry(hass)
    if entry is None:
        return refusal(503, "Hubbubb is not configured")
    hub = entry.data[CONF_HUBBUBB]
    text = hub.get(CONF_HUBBUBB_PEOPLE) or ""

    if method == "GET":
        people = {}
        for line in text.splitlines():
            if parsed := split_line(line):
                people[parsed[0]] = {"linked": True, "client_id_hint": hint(parsed[1])}
        for name in await _voice_people(hass):
            if not any(_same(name, known) for known in people):
                people[name] = {"linked": False}
        return _json({"people": people})

    if not is_admin:
        return _plain(403, "only an administrator can link people to Hubbubb")

    def _save(new_text: str) -> None:
        hass.config_entries.async_update_entry(
            entry,
            data={**entry.data, CONF_HUBBUBB: {**hub, CONF_HUBBUBB_PEOPLE: new_text}},
        )

    if method == "DELETE":
        if not (person or "").strip():
            return _plain(400, "which person?")
        _save(remove_line(text, person))
        return _json({"person": person.strip(), "linked": False})

    if method != "POST":
        return _plain(405, f"{method} is not allowed here")
    fields = {
        key: (body or {}).get(key) if isinstance(body, dict) else None
        for key in ("person", "client_id", "client_secret")
    }
    if not all(isinstance(v, str) and v.strip() for v in fields.values()):
        return _plain(400, "person, client_id and client_secret are all needed")
    person, client_id, secret = (v.strip() for v in fields.values())
    # The line format has two separators; a name holding either would read
    # back as somebody else's credentials.
    if ":" in person or "\n" in person:
        return _plain(400, "a person's name cannot contain a colon")
    client = HubbubbClient(
        async_get_clientsession(hass), hub[CONF_HUBBUBB_URL], client_id, secret
    )
    try:
        await client.async_verify()
    except HubbubbError as err:
        # The words, not the id or secret - this goes to the browser.
        _LOGGER.debug("Hubbubb refused a link for %s: %s", person, err)
        return _plain(400, f"Hubbubb refused these credentials: {err}")
    _save(set_line(text, person, client_id, secret))
    return _json({"person": person, "linked": True, "client_id_hint": hint(client_id)})


class PeopleLinksView(HomeAssistantView):
    """/api/hubbubb_home/people/links[/<person>] - the people map, minus secrets.

    Registered once beside the voice proxy and never unregistered; it finds
    the entry afresh on every request.
    """

    url = LINKS_URL
    extra_urls = [f"{LINKS_URL}/{{person}}"]
    name = f"{DOMAIN}:people-links"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    async def get(self, request: web.Request, person: str | None = None) -> web.Response:
        return await self._answer(request)

    async def post(self, request: web.Request, person: str | None = None) -> web.Response:
        try:
            body = await request.json()
        except ValueError:
            body = None
        return await self._answer(request, body=body)

    async def delete(self, request: web.Request, person: str | None = None) -> web.Response:
        return await self._answer(request, person=person)

    async def _answer(self, request, person=None, body=None) -> web.Response:
        status, content_type, payload = await async_links(
            self._hass,
            bool(request["hass_user"].is_admin),
            request.method,
            person,
            body,
        )
        return web.Response(
            status=status, body=payload, headers={"Content-Type": content_type}
        )
