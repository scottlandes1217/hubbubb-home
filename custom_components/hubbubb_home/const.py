"""Shared constants for Hubbubb Home."""

from __future__ import annotations

DOMAIN = "hubbubb_home"

# --- config entry keys -------------------------------------------------------
CONF_ASSISTANT_NAME = "assistant_name"
CONF_PROMPT = "prompt"

CONF_HUBBUBB = "hubbubb"
CONF_HUBBUBB_URL = "hubbubb_url"
CONF_HUBBUBB_ID = "hubbubb_client_id"
CONF_HUBBUBB_SECRET = "hubbubb_client_secret"

CONF_COMPANION = "companion"
CONF_COMPANION_URL = "companion_url"
CONF_COMPANION_TOKEN = "companion_token"
# Options section for how agent turns reach people (distinct from the
# companion section, whose credentials live on entry data, not options).
CONF_ANNOUNCE = "announcements"
# Where a finished agent turn goes when the announcement switch is off: a
# notify service ("notify.mobile_app_...") for a quiet phone push. Blank = drop.
CONF_NOTIFY = "notify_service"
# Spoken the moment a prompt is handed to the companion; the real answer
# arrives later through the message webhook. "" = silent handoff.
CONF_ACK = "ack"
DEFAULT_ACK = "On it."

# Legacy single toggle (pre-0.17); read as the default for all three below.
CONF_SENTENCES = "install_sentences"
# Per-file opt-outs, so a house whose own intents already answer "remember
# that..." can still take the timer or house sentences (section "sentences").
CONF_SENTENCES_SECTION = "sentences"
SENTENCE_FILES = ("house", "memory", "timers")

CONF_ATV = "apple_tv"
CONF_ATV_ENTITIES = "apple_tvs"
CONF_NIGHTLY_TIME = "nightly_time"
CONF_NIGHTLY_ENABLED = "nightly_enabled"
CONF_IGNORE = "ignore"
CONF_BRIEFING_TIME = "briefing_time"
CONF_BRIEFING_ENABLED = "briefing_enabled"
CONF_BRIEFING_TARGET = "briefing_target"
CONF_TTS = "tts_entity"
CONF_WEATHER = "weather_entity"
CONF_CALENDARS = "calendars"

# --- defaults ----------------------------------------------------------------
DEFAULT_NAME = "Hubbubb"
# Half three: late enough that the house has settled, early enough that the
# findings are ready before anyone asks for them.
DEFAULT_NIGHTLY_TIME = "03:30:00"
DEFAULT_BRIEFING_TIME = "09:00:00"

TIMER_SLOTS = 5

# --- storage / runtime -------------------------------------------------------
MEMORY_DB = "hubbubb_home_memory.db"

# POST {"message": "..."} to /api/webhook/hubbubb_home_message and every open
# dashboard hears the event of the same name; the ring cards elect one screen
# to speak it. This is how a companion announces a finished agent turn.
WEBHOOK_MESSAGE = f"{DOMAIN}_message"
EVENT_MESSAGE = f"{DOMAIN}_message"

CARDS = (
    "hubbubb-ring-card.js",
    "hubbubb-remote-card.js",
    "hubbubb-timers-card.js",
)

PLATFORMS = ["switch", "sensor", "conversation"]

# Injected into whichever language model the user has pointed at the house, as
# the Hubbubb Home half of its instructions. It carries the assistant's name,
# which is the whole point of the setting.
DEFAULT_PROMPT = (
    "You are {name}, the voice of this home.\n"
    "\n"
    "You are speaking aloud, so answer the way a person would: one or two "
    "sentences, no lists, no markdown, no code, no file paths, no emoji. Give "
    "the answer first and the reasoning only if asked.\n"
    "\n"
    "You control this house through your tools. When someone asks for "
    "something you can do, do it and say briefly what you did - never describe "
    "what you are about to do and then not do it. If a request is ambiguous "
    "between two rooms or two devices, ask which one in a short question.\n"
    "\n"
    "You remember things about this household. Use recall_memory before "
    "answering anything about people's preferences, schedules, or past "
    "decisions, and use remember when you are told something durable and "
    "worth keeping. Do not narrate that you are searching your memory.\n"
    "\n"
    "If you genuinely cannot do something, say so plainly in one sentence and "
    "say what you can do instead. Never invent a device, a state, or an event."
)
