"""A conversation agent that hands unmatched speech to the companion.

Point a voice pipeline at this agent (with "prefer handling commands
locally" on, or house commands come here too) and whatever Home Assistant's
own intent engine cannot parse gets typed into the coding agent the
companion fronts. The reply is deliberately not awaited: a coding turn runs
for seconds to minutes, far longer than a voice pipeline will hold the
floor, so this acknowledges the handoff and the companion speaks the real
answer later through the message webhook.

The entity exists only while a companion URL is configured - without one
there is nothing to hand speech to, and an agent that always answers "I
can't reach anything" is worse than no agent.
"""

from __future__ import annotations

import logging
import re

from homeassistant.components import conversation
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import MATCH_ALL
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.intent import IntentResponse, IntentResponseType

from .companion import CompanionError
from .const import CONF_ACK, CONF_ANNOUNCE, DEFAULT_ACK, DOMAIN

_LOGGER = logging.getLogger(__name__)

# Home Assistant's own agent, retried against below.
HOME_AGENT = "conversation.home_assistant"

# An opening sentence followed by more speech. Speech-to-text on an open mic
# regularly appends whatever else was audible - someone talking, a television -
# to the command, and the combined string matches no intent at all.
TRAILING_SPEECH = re.compile(r"^(.+?[.!?])\s+\S")


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    runtime = hass.data[DOMAIN][entry.entry_id]
    if not runtime.companion.configured:
        return
    async_add_entities([CompanionConversationEntity(entry, runtime)])


class CompanionConversationEntity(conversation.ConversationEntity):
    """Types whatever Home Assistant could not answer into the coding agent.

    Implements _async_handle_message, not the older async_process: the base
    class owns the chat session and calls this, so overriding async_process
    instead would sidestep the chat log entirely.
    """

    _attr_should_poll = False

    def __init__(self, entry: ConfigEntry, runtime) -> None:
        self.entry = entry
        self._runtime = runtime
        self._attr_name = runtime.name
        self._attr_unique_id = f"{entry.entry_id}_conversation"

    @property
    def supported_languages(self) -> list[str] | str:
        # The agent reads whatever the speech-to-text produced; no list to
        # filter.
        return MATCH_ALL

    async def _async_handle_message(
        self,
        user_input: conversation.ConversationInput,
        chat_log: conversation.ChatLog,
    ) -> conversation.ConversationResult:
        # Reaching here means Home Assistant could not parse the whole
        # utterance. Before treating it as a coding prompt, give it one more
        # chance at just the opening sentence.
        salvaged = await self._retry_opening_sentence(user_input, chat_log)
        if salvaged is not None:
            return salvaged

        response = IntentResponse(language=user_input.language)
        # The coding agent gets the speaker's name when the house knows it,
        # so its sessions and replies can be theirs.
        person, _, _ = self._runtime.speakers.resolve(user_input.device_id)
        text = f"[{person}] {user_input.text}" if person else user_input.text
        try:
            await self._runtime.companion.async_call("prompt", {"text": text})
        except CompanionError as err:
            _LOGGER.warning(
                "companion refused %r: %s", user_input.text, err
            )
            response.async_set_speech(f"That didn't get through. {err}")
        else:
            ack = self._runtime.option(CONF_ANNOUNCE, CONF_ACK, DEFAULT_ACK)
            if ack:
                response.async_set_speech(ack)

        return conversation.ConversationResult(
            response=response, conversation_id=chat_log.conversation_id
        )

    async def _retry_opening_sentence(
        self, user_input: conversation.ConversationInput, chat_log
    ) -> conversation.ConversationResult | None:
        """Re-run just the first sentence through Home Assistant's own agent.

        "Turn on kitchen lights. Common interests will let you chat with..."
        is a real transcription of one command plus a television. Trimming to
        the opening sentence turns that back into something HA can act on.
        Returns None whenever the trimmed sentence is no better, so the
        caller falls through to the companion exactly as before.
        """
        match = TRAILING_SPEECH.match(user_input.text.strip())
        if not match:
            return None
        opening = match.group(1).strip()

        try:
            result = await conversation.async_converse(
                hass=self.hass,
                text=opening,
                conversation_id=None,
                context=user_input.context,
                language=user_input.language,
                agent_id=HOME_AGENT,
                device_id=user_input.device_id,
            )
        except Exception:  # never let a salvage attempt break the handoff
            _LOGGER.debug("local retry of %r failed", opening, exc_info=True)
            return None

        if result.response.response_type == IntentResponseType.ERROR:
            return None

        _LOGGER.info(
            "handled %r locally after dropping trailing speech from %r",
            opening,
            user_input.text,
        )
        return conversation.ConversationResult(
            response=result.response, conversation_id=chat_log.conversation_id
        )
