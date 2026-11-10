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

import dataclasses
import logging
import re
import time

from homeassistant.components import conversation
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import MATCH_ALL
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.intent import IntentResponse, IntentResponseType

from .companion import CompanionError
from .grounding import same_request
from .const import (
    CONF_ACK,
    CONF_ANNOUNCE,
    CONF_FRONT_DOOR,
    CONF_VOICE,
    DEFAULT_ACK,
    DOMAIN,
)
from .speakers import SpeakerServiceError, address, spoken_name

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
    entities: list[conversation.ConversationEntity] = []
    if runtime.companion.configured:
        entities.append(CompanionConversationEntity(entry, runtime))
    brain = runtime.option(CONF_VOICE, CONF_FRONT_DOOR)
    if brain and runtime.speakers.configured:
        entities.append(FrontDoorConversationEntity(entry, runtime, brain))
    async_add_entities(entities)


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


ASK = "I don't think we've met. Who am I speaking with?"
# However many strangers, one question per half hour: a television that keeps
# waking the puck should not turn the house into a receptionist.
ASK_COOLDOWN = 1800.0
# An answer to the question must come back this soon to count as one.
ANSWER_WINDOW = 120.0
# The pipeline hands these to an agent with house control rather than
# answering them locally (assist_pipeline's local fallback filter).
LLM_INTENTS = ("HassGetState", "HassMediaSearchAndPlay")
# Asking the local brain the same thing again this soon means its first answer
# did not do it. The repeat goes to Claude, which does it now, and a coding
# session is opened to teach the local brain - Claude stays the fallback.
REPEAT_WINDOW = 300.0
FALLBACK_AGENT = "conversation.claude_conversation"
FIX_PROJECT = "jarvis"
FIX_BRIEF = (
    "Jarvis's local model failed a voice request and Scott had to repeat it. "
    "Claude ({agent}) has already carried out the repeat, so do not perform it "
    "again. Fix the LOCAL model so it handles this kind of request itself next "
    "time: tools, tool descriptions, exposed entities, its prompt (see the "
    "memories jarvis-stays-local-first and intent-script-tools-starve-local-"
    "model). Never point Jarvis at Claude instead. Diagnose with chat_log debug "
    "logging and POST /api/conversation/process to {brain}, verify the fix the "
    "same way, then commit with ha-git. If the local model was in fact right, "
    "change nothing and say so. First ask: {first!r}, local reply: {reply!r}. "
    "Repeat: {repeat!r}. Claude's reply: {fixed!r}."
)


class FrontDoorConversationEntity(conversation.ConversationEntity):
    """Asks a returning unrecognized voice who it is, then does what it asked.

    Sits in front of the pipeline's real agent. The pipeline's "prefer
    handling commands locally" must be off: this does that step itself, after
    the question - otherwise "turn on the lights" from a stranger would be
    handled before it ever got here. Every reply also passes through
    address(), so the "sir" written into replies becomes the speaker's title.
    """

    _attr_should_poll = False

    def __init__(self, entry: ConfigEntry, runtime, brain: str) -> None:
        self._runtime = runtime
        self._brain = brain
        self._attr_name = f"{runtime.name} front door"
        self._attr_unique_id = f"{entry.entry_id}_front_door"
        self._pending: dict[str, tuple[str, float]] = {}
        # The brain keeps its own conversation ids. Sharing ours would hand
        # it the pipeline's chat log, whose streaming listener speaks the
        # brain's words straight to TTS - past the title swap.
        self._brain_ids: dict[str, str] = {}
        self._asked = 0.0
        # (when, text, reply) for each request the local brain answered.
        self._tries: list[tuple[float, str, str]] = []

    @property
    def supported_languages(self) -> list[str] | str:
        return MATCH_ALL

    async def _async_handle_message(
        self,
        user_input: conversation.ConversationInput,
        chat_log: conversation.ChatLog,
    ) -> conversation.ConversationResult:
        cid = chat_log.conversation_id
        speakers = self._runtime.speakers
        greeting = ""
        pending = self._pending.pop(cid, None)
        if pending and time.time() - pending[1] < ANSWER_WINDOW:
            # This is the answer; what they first asked for runs now.
            greeting = await self._meet(user_input.text)
            user_input = dataclasses.replace(user_input, text=pending[0])
        elif self._should_ask(
            chat_log,
            # Only a satellite's speech has a voice event coming; typed text
            # would just wait out the timeout.
            await speakers.async_event_for(user_input.text)
            if user_input.device_id else None,
        ):
            self._pending[cid] = (user_input.text, time.time())
            self._asked = time.time()
            return self._reply(user_input, chat_log, ASK, ask=True)

        earlier = self._repeat_of(user_input.text)
        if earlier and self.hass.states.get(FALLBACK_AGENT):
            result = await self._escalate(user_input, chat_log, earlier)
        else:
            result, by_brain = await self._answer(user_input, chat_log)
            if by_brain:
                self._tries.append((
                    time.time(),
                    user_input.text,
                    result.response.speech.get("plain", {}).get("speech", ""),
                ))
        speech = result.response.speech.get("plain", {}).get("speech", "")
        person, _, _ = speakers.resolve(user_input.device_id)
        speech = address(
            " ".join(p for p in (greeting, speech) if p),
            speakers.title_for(person),
        )
        result.response.async_set_speech(speech)
        return conversation.ConversationResult(
            response=result.response,
            conversation_id=cid,
            continue_conversation=result.continue_conversation,
        )

    def _should_ask(self, chat_log, event: dict | None) -> bool:
        if not event or not event.get("ask"):
            return False
        if time.time() - self._asked < ASK_COOLDOWN:
            return False
        # Never in the middle of a conversation: a "yes" to a question the
        # house just asked is not the moment for introductions.
        return not any(c.role == "assistant" for c in chat_log.content)

    def _repeat_of(self, text: str) -> tuple[float, str, str] | None:
        """The recent local-brain try this request repeats, taken off the list."""
        now = time.time()
        self._tries = [t for t in self._tries if now - t[0] < REPEAT_WINDOW]
        # The brain just asked something, so this is the answer.
        if self._tries and self._tries[-1][2].rstrip().endswith("?"):
            return None
        for i, t in enumerate(self._tries):
            if same_request(t[1], text):
                return self._tries.pop(i)
        return None

    async def _escalate(
        self,
        user_input: conversation.ConversationInput,
        chat_log: conversation.ChatLog,
        earlier: tuple[float, str, str],
    ) -> conversation.ConversationResult:
        """Claude does the repeated request now; a session fixes the local brain."""
        result = await conversation.async_converse(
            hass=self.hass,
            text=user_input.text,
            conversation_id=None,
            context=user_input.context,
            language=user_input.language,
            agent_id=FALLBACK_AGENT,
            device_id=user_input.device_id,
            satellite_id=user_input.satellite_id,
        )
        fixed = result.response.speech.get("plain", {}).get("speech", "")
        chat_log.async_add_assistant_content_without_tools(
            conversation.AssistantContent(agent_id=self.entity_id, content=fixed)
        )
        _LOGGER.info("repeat of %r went to %s", earlier[1], FALLBACK_AGENT)
        if (
            result.response.response_type != IntentResponseType.ERROR
            and self._runtime.companion.configured
        ):
            brief = FIX_BRIEF.format(
                agent=FALLBACK_AGENT, brain=self._brain, first=earlier[1],
                reply=earlier[2], repeat=user_input.text, fixed=fixed,
            )
            self.hass.async_create_background_task(
                self._file_fix(brief), "hubbubb_home fix local brain"
            )
        return result

    async def _file_fix(self, brief: str) -> None:
        try:
            await self._runtime.companion.async_call("prompt", {
                "text": brief, "project": FIX_PROJECT,
                "new_session": True, "fresh": True, "force": True,
            })
        except CompanionError as err:
            _LOGGER.warning("could not open a session to fix the local brain: %s", err)

    async def _meet(self, answer: str) -> str:
        """File the voice under the name given; -> the greeting to lead with."""
        name = spoken_name(answer, self._runtime.name)
        if not name:
            return ""
        speakers = self._runtime.speakers
        speakers.set_override(name)
        try:
            info = await speakers.async_claim(name)
        except SpeakerServiceError as err:
            _LOGGER.warning("could not file the new voice as %s: %s", name, err)
            return f"Hello {name}."
        _LOGGER.info("voice filed as %s: %s", name, info)
        if info.get("new"):
            return f"Nice to meet you {name}."
        return f"Thanks {name}, I'll know your voice better now."

    async def _answer(
        self,
        user_input: conversation.ConversationInput,
        chat_log: conversation.ChatLog,
    ) -> tuple[conversation.ConversationResult, bool]:
        """What the pipeline would have done: local intents, then the brain.

        -> (result, whether the brain answered it).
        """
        cid = chat_log.conversation_id
        # The brain just asked a question, so "yes" answers it - not the
        # Mac-session question the JarvisAnswerYes sentence is waiting for.
        last = next((c for c in reversed(chat_log.content)
                     if c.role == "assistant" and c.content), None)
        asked = cid in self._brain_ids and last and last.content.rstrip().endswith("?")
        response = None if asked else await conversation.async_handle_intents(
            self.hass,
            user_input,
            chat_log,
            intent_filter=lambda r: r.intent.name in LLM_INTENTS,
        )
        if response is not None:
            speech = response.speech.get("plain", {}).get("speech", "")
            chat_log.async_add_assistant_content_without_tools(
                conversation.AssistantContent(
                    agent_id=self.entity_id, content=speech
                )
            )
            return conversation.ConversationResult(
                response=response, conversation_id=chat_log.conversation_id
            ), False
        result = await conversation.async_converse(
            hass=self.hass,
            text=user_input.text,
            conversation_id=self._brain_ids.get(cid),
            context=user_input.context,
            language=user_input.language,
            agent_id=self._brain,
            device_id=user_input.device_id,
            satellite_id=user_input.satellite_id,
            extra_system_prompt=user_input.extra_system_prompt,
        )
        self._brain_ids[cid] = result.conversation_id
        while len(self._brain_ids) > 50:
            self._brain_ids.pop(next(iter(self._brain_ids)))
        chat_log.async_add_assistant_content_without_tools(
            conversation.AssistantContent(
                agent_id=self.entity_id,
                content=result.response.speech.get("plain", {}).get("speech", ""),
            )
        )
        return result, True

    def _reply(self, user_input, chat_log, speech: str, ask: bool = False):
        response = IntentResponse(language=user_input.language)
        response.async_set_speech(speech)
        chat_log.async_add_assistant_content_without_tools(
            conversation.AssistantContent(agent_id=self.entity_id, content=speech)
        )
        return conversation.ConversationResult(
            response=response,
            conversation_id=chat_log.conversation_id,
            continue_conversation=ask,
        )
