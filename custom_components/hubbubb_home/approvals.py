"""Phone-tap authorization for actions that act as a person.

Voice identification says who is *probably* speaking - a recording, the
television, or a decent impression can all pass it, so it opens nothing by
itself. Anything that touches a person's data is authorized by something they
actually possess: an actionable notification on their own device, answered
with a tap. Voice picks who to challenge; the tap is the authority, and both
failure modes land safely - a spoofed or misidentified request shows up on
the real person's device, who sees a request they never made and denies it.
"""

from __future__ import annotations

import asyncio
import logging
import secrets
import time

from .speakers import parse_map

_LOGGER = logging.getLogger(__name__)

# Only a voice match at least this sure (or a spoken "this is X") is worth
# challenging; anything weaker and the house asks who is speaking instead of
# guessing whose device to ring.
VERIFY_CONFIDENCE = 0.90
# How long a tap is awaited before the request fails closed.
REQUEST_TIMEOUT = 45
# One approval covers follow-ups for a few minutes, or every second question
# becomes a phone tap. ponytail: one window per person; per-action re-auth
# when writes get riskier than reads.
SESSION_WINDOW = 600
# Fired by the companion app when a notification action button is tapped.
ACTION_EVENT = "mobile_app_notification_action"


class Approvals:
    """Ask a person's own device to approve an action, and remember a yes."""

    def __init__(self, hass, name: str, approvers: str | None) -> None:
        self._hass = hass
        self._name = name
        self._map = parse_map(approvers or "")
        self._approved: dict[str, float] = {}

    @property
    def configured(self) -> bool:
        return bool(self._map)

    def approver_for(self, person: str) -> str | None:
        """The notify service that reaches this person's own device."""
        for name, service in self._map.items():
            if name.lower() == person.lower():
                return service
        return None

    async def async_request(self, person: str, summary: str) -> bool:
        """True only when this person's device approves (or recently did).

        Everything else - denied, timed out, no device configured, notify
        service missing - is False: a security gate fails closed.
        """
        if time.time() - self._approved.get(person, 0) < SESSION_WINDOW:
            return True
        service = self.approver_for(person)
        if not service or "." not in service:
            return False

        nonce = secrets.token_hex(4)
        approve = f"HUBBUBB_APPROVE_{nonce}"
        deny = f"HUBBUBB_DENY_{nonce}"
        future: asyncio.Future = asyncio.get_running_loop().create_future()

        def _on_action(event) -> None:
            action = (getattr(event, "data", None) or {}).get("action")
            if action in (approve, deny) and not future.done():
                future.set_result(action == approve)

        unsub = self._hass.bus.async_listen(ACTION_EVENT, _on_action)
        try:
            domain, service_name = service.split(".", 1)
            await self._hass.services.async_call(
                domain,
                service_name,
                {
                    "title": f"{self._name} authorization",
                    "message": summary,
                    "data": {
                        "actions": [
                            {"action": approve, "title": "Approve"},
                            {"action": deny, "title": "Deny"},
                        ]
                    },
                },
                blocking=True,
            )
            granted = bool(await asyncio.wait_for(future, REQUEST_TIMEOUT))
        except Exception as err:  # any failure on this path fails closed
            _LOGGER.info(
                "authorization for %s did not complete: %s", person, err
            )
            granted = False
        finally:
            unsub()

        if granted:
            self._approved[person] = time.time()
        return granted
