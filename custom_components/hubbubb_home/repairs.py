"""Repairs: a nightly proposal is an issue, and its fix is a yes.

The Repairs panel already lists issues, keeps them across restarts, and offers
Ignore on each - which is everything a review queue needs. Submitting the fix
marks the proposal accepted; the session that later runs "apply the nightly
findings" reads the accepted ones off the review sensor and marks them done.
"""

from __future__ import annotations

import voluptuous as vol
from homeassistant.components.repairs import RepairsFlow
from homeassistant.core import HomeAssistant

from .const import DOMAIN


class ProposalFlow(RepairsFlow):
    """Show the proposal; confirm to accept it."""

    def __init__(self, review, proposal: dict) -> None:
        self._review = review
        self._proposal = proposal

    async def async_step_init(self, user_input=None):
        return await self.async_step_confirm()

    async def async_step_confirm(self, user_input=None):
        if user_input is not None:
            await self._review.async_decide(self._proposal["id"], "accepted")
            return self.async_create_entry(data={})
        return self.async_show_form(
            step_id="confirm",
            data_schema=vol.Schema({}),
            description_placeholders={
                "kind": self._proposal["kind"],
                "title": self._proposal["title"],
                "body": self._proposal["body"],
            },
        )


async def async_create_fix_flow(hass: HomeAssistant, issue_id: str, data) -> RepairsFlow:
    proposal_id = issue_id.removeprefix("proposal_")
    for runtime in hass.data.get(DOMAIN, {}).values():
        if proposal := runtime.review.get(proposal_id):
            return ProposalFlow(runtime.review, proposal)
    raise ValueError(f"no proposal behind {issue_id}")
