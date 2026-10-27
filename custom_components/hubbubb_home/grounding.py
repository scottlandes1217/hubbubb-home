"""Hold the local house model to what its tools actually did.

A non-thinking local model will say "Done sir" or "I've sent it in a new
session" on a turn where it called nothing at all, and the house then speaks
a lie. Prompt rules did not stop it, so this checks the turn itself: when the
final reply claims an action and no tool that changes anything ran since the
speaker's last message, the model is told so and run again inside the same
turn; if it still does nothing, the reply becomes an honest "I didn't".

Home Assistant gives an integration no hook between an agent's tool loop and
its spoken result, so this wraps the Ollama conversation entity's own loop -
only for agents whose LLM API list includes this integration's API. Streaming
is turned off for those agents, or the pipeline starts speaking the first
sixty characters before the check can run.

The same wrapper fixes the history trim: Ollama's own counts every message as
half a turn, so one tool-heavy turn pushes the speaker's previous request out
of a two-turn window entirely.
"""

from __future__ import annotations

import importlib
import logging
import re

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

# Tools that only look. A turn whose only calls are these has changed nothing,
# so "done" after them is still a claim with nothing behind it.
READ_ONLY = {
    "GetLiveContext", "GetDateTime", "recall", "find_recipe", "read_list",
    "timer_status", "house_findings", "camera_activity", "calculate",
    "date_info", "web_search", "look_around",
}

# ponytail: phrase heuristic for "it's done". It misses a claim worded some
# other way and costs one extra model call on a false hit; feed the guard's
# catches to the nightly fine-tune if either starts to matter.
#
# The model's own deed ("I've sent it", "Done") needs a tool that acts.
DEED = re.compile(
    r"\b(?:done|all set"
    r"|i(?:'ve| have)\s+(?:now\s+|just\s+|also\s+)?\w+(?:ed|t|n)\b"
    r"|i(?:'ll| will)\s+(?:now\s+|go\s+ahead\s+and\s+)?(?:set|turn|switch|dim|"
    r"send|start|open|apply|put|change|let you know|pass|hand|create|run)\b)",
    re.IGNORECASE,
)
# A state ("the lights are now on") only needs some tool, a look included -
# reading it back from GetLiveContext is the honest way to say it.
STATE = re.compile(
    r"\b(?:(?:is|are)\s+(?:now|being)|(?:has|have)\s+been"
    r"|(?:sent|started|created|applied|switched|turned)\b)",
    re.IGNORECASE,
)

RETRY = (
    "Your last reply said something was done, but you called no tool that "
    "does anything, so nothing happened. Call the tool now if one fits; if "
    "none does, say in one short sentence that you did not do it, without "
    "mentioning tools. Never say something "
    "happened unless a tool result in this turn shows it."
)
FALLBACK = "I didn't actually manage to do that sir."


def turn_tools(content) -> list[str]:
    """Tool names called since the speaker last spoke, API prefix stripped."""
    names: list[str] = []
    for item in reversed(content):
        kind = type(item).__name__
        if kind == "UserContent":
            break
        if kind == "AssistantContent":
            names += [c.tool_name.split("__")[-1] for c in item.tool_calls or ()]
    return names


def ungrounded(content) -> bool:
    """The last reply claims an action that no acting tool backs up."""
    if not content or type(content[-1]).__name__ != "AssistantContent":
        return False
    tools = turn_tools(content)
    text = content[-1].content or ""
    if DEED.search(text) and all(name in READ_ONLY for name in tools):
        return True
    return bool(STATE.search(text)) and not tools


def trim_by_turns(messages: list, turns: int) -> list:
    """System prompt + the last `turns` exchanges + the message in progress."""
    if turns < 1:
        return messages
    users = [i for i, m in enumerate(messages) if m.role == "user"]
    if len(users) <= turns + 1:
        return messages
    return [messages[0], *messages[users[-(turns + 1)] :]]


_original: dict = {}


async def async_install(hass) -> None:
    """Wrap the Ollama agent class once; a no-op if Ollama isn't loadable."""
    if _original:
        return
    from homeassistant.components import conversation

    try:
        # Importing ollama reads package metadata from disk - not on the loop.
        module = await hass.async_add_import_executor_job(
            importlib.import_module, "homeassistant.components.ollama.conversation"
        )
    except ImportError:
        return
    Entity = module.OllamaConversationEntity
    if not all(hasattr(Entity, a) for a in ("_async_handle_chat_log", "_trim_history")):
        _LOGGER.warning("Ollama agent changed shape; Jarvis grounding is off")
        return

    loop, trim = Entity._async_handle_chat_log, Entity._trim_history
    streaming = Entity.__dict__.get("_attr_supports_streaming", False)

    def ours(entity) -> bool:
        return DOMAIN in (entity.subentry.data.get("llm_hass_api") or ())

    async def grounded(self, chat_log, structure=None):
        await loop(self, chat_log, structure)
        if structure is not None or not ours(self) or not ungrounded(chat_log.content):
            return
        _LOGGER.info("Ungrounded claim, retrying: %r", chat_log.content[-1].content)
        chat_log.content.append(conversation.SystemContent(content=RETRY))
        await loop(self, chat_log, structure)
        if ungrounded(chat_log.content):
            chat_log.async_add_assistant_content_without_tools(
                conversation.AssistantContent(agent_id=self.entity_id, content=FALLBACK)
            )

    def trimmed(self, message_history, max_messages):
        if not ours(self):
            return trim(self, message_history, max_messages)
        message_history.messages = trim_by_turns(
            message_history.messages, int(max_messages)
        )

    _original.update(
        cls=Entity, loop=loop, trim=trim, streaming=Entity.__dict__.get("supports_streaming")
    )
    Entity._async_handle_chat_log = grounded
    Entity._trim_history = trimmed
    Entity.supports_streaming = property(lambda self: streaming and not ours(self))


def async_uninstall() -> None:
    if not _original:
        return
    cls = _original["cls"]
    cls._async_handle_chat_log = _original["loop"]
    cls._trim_history = _original["trim"]
    if _original["streaming"] is None:
        del cls.supports_streaming
    else:
        cls.supports_streaming = _original["streaming"]
    _original.clear()


# Words that carry no request of their own, so "set my lights to my bright
# scene" and "set the lights to bright" read as the same ask. "on/off/up/down"
# are kept on purpose: they are the whole difference between two commands.
_FILLER = frozenset(
    "a an the my our your to please can could would you i me it in of for "
    "just said again now jarvis hey ok okay so".split()
)
# Share of the shorter request's words the longer one must contain. The
# tuning knob: lower catches looser rewordings, and more false repeats.
SAME_REQUEST = 0.8


def same_request(a: str, b: str) -> bool:
    """Whether b is the speaker asking for a again, perhaps reworded."""
    words = [
        {w for w in re.findall(r"[a-z0-9']+", t.lower()) if w not in _FILLER}
        for t in (a, b)
    ]
    # One word ("yes", "no", "blue") is an answer, never a repeat of anything.
    if min(map(len, words)) < 2:
        return False
    return len(words[0] & words[1]) / min(map(len, words)) >= SAME_REQUEST
