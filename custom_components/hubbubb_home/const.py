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
# One line per person: "Person Name: client_id : client_secret". Each maps to
# that person's own Hubbubb user, so the CRM's permissions are the boundary.
CONF_HUBBUBB_PEOPLE = "people"
# {client_id: "Full Name, email"} - who Hubbubb said each linked credential
# is, as shown in the Voice Studio. A top-level key, not a fourth field on
# the people line and not a key inside the hubbubb section: parse_people
# reads the line and the options form rewrites the section wholesale.
CONF_HUBBUBB_IDENTITIES = "hubbubb_identities"
# The house's one OAuth client at Hubbubb, for "Sign in with Hubbubb": an
# administrator registers it there once, with this Home Assistant's
# /api/hubbubb_home/oauth/callback as its redirect URI. Blank = the button
# is not offered and linking is by pasted key only.
CONF_HUBBUBB_OAUTH_ID = "oauth_client_id"
CONF_HUBBUBB_OAUTH_SECRET = "oauth_client_secret"
# {person (lowercased): {"access_token", "refresh_token", "expires",
# "identity", "needs_reauth"}} - what a person's own sign-in earned. Beside
# the identities and apart from the people map for the same reason: the map
# stays a text field that parse_people reads unchanged, and the options form
# rewrites the hubbubb section wholesale. A consented token outranks a pasted
# line for the same name.
CONF_HUBBUBB_TOKENS = "hubbubb_tokens"

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
# Quiet hours: between these times, webhook announcements are never spoken or
# put on the bus - they fall through to the passive phone push instead. Timers
# and the scheduled briefing are unaffected: a 3am timer was set on purpose.
CONF_QUIET_START = "quiet_start"
CONF_QUIET_END = "quiet_end"
DEFAULT_QUIET_START = "22:00:00"
DEFAULT_QUIET_END = "08:00:00"


def in_quiet_window(minute: int, start: tuple, end: tuple) -> bool:
    """Is minute-of-day inside the (h, m, s) window? It may cross midnight."""
    begin = start[0] * 60 + start[1]
    finish = end[0] * 60 + end[1]
    if begin == finish:  # a zero-length window means quiet hours are off
        return False
    if begin < finish:
        return begin <= minute < finish
    return minute >= begin or minute < finish

# Legacy single toggle (pre-0.17); read as the default for all three below.
CONF_SENTENCES = "install_sentences"
# Per-file opt-outs, so a house whose own intents already answer "remember
# that..." can still take the timer or house sentences (section "sentences").
CONF_SENTENCES_SECTION = "sentences"
SENTENCE_FILES = ("house", "memory", "timers")

# Options section for speaker identity. The voice service URL doubles as the
# on/off switch: blank means no speaker identification anywhere.
CONF_VOICE = "voice"
CONF_VOICE_URL = "voice_service_url"
CONF_SPEAKER_MAP = "speaker_map"
# "Person Name: notify.mobile_app_xyz" lines - each person's own device, for
# tap-to-approve. Blank = the approval gate is off entirely.
CONF_APPROVERS = "approvers"
# Shared secret with the voice service: speaker events must carry it, and
# calls to the service send it back. Blank = no verification.
CONF_VOICE_TOKEN = "token"
# "Person Name: todo.their_list" lines - "my list" resolves to the speaker's
# own to-do entity. Anything unresolved falls back to the household list.
CONF_PERSON_LISTS = "person_lists"
CONF_HOUSEHOLD_LIST = "household_list"

CONF_ATV = "apple_tv"
CONF_ATV_ENTITIES = "apple_tvs"
CONF_NIGHTLY_TIME = "nightly_time"
CONF_NIGHTLY_ENABLED = "nightly_enabled"
# Off: only hard failures (unavailable/unknown) are reported; the
# went-quiet detector still runs but its findings are dropped - some houses
# find "changed most days, now doesn't" more noise than signal.
CONF_QUIET_FINDINGS = "quiet_findings"
CONF_IGNORE = "ignore"
CONF_DRIFT_FINDINGS = "drift_findings"
CONF_DRIFT_REPAIR = "drift_repair"
CONF_BRIEFING_TIME = "briefing_time"
CONF_BRIEFING_ENABLED = "briefing_enabled"
CONF_BRIEFING_TARGET = "briefing_target"
CONF_TTS = "tts_entity"
CONF_WEATHER = "weather_entity"
CONF_CALENDARS = "calendars"
# "Person Name: calendar.a, calendar.b" lines - the briefing reads each
# person their own day, and "what's my day" answers with theirs.
CONF_PERSON_CALENDARS = "person_calendars"

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

# The voice service on the companion machine POSTs one event here per
# utterance: {"person", "confidence", "ts", "text", "candidates"}.
WEBHOOK_SPEAKER = f"{DOMAIN}_speaker"

CARDS = (
    "hubbubb-ring-card.js",
    "hubbubb-remote-card.js",
    "hubbubb-timers-card.js",
)
# The Voice Studio sidebar panel. Served from the same versioned URL as the
# cards but not registered as a Lovelace resource: a panel loads its own
# module, and every dashboard would otherwise pull the studio in too.
PANEL_FILE = "hubbubb-voice-studio.js"
PANEL_PATH = "hubbubb-voice"

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


# Where a finished message goes. Pure, so the policy can be checked without a
# Home Assistant: the package's __init__ imports half of core, which is exactly
# why this decision used to be untested.
#
#   "announce" - out loud on the satellites (the room the speaker is in)
#   "event"    - fired for whatever dashboards are open to speak
#   "push"     - passive phone notification, no sound, no banner
#   "nothing"  - there was no message
def delivery_for(data: dict, announcements_on: bool, quiet: bool) -> str:
    """Decide how to deliver one finished message.

    The announcements toggle stops *unsolicited* chatter from typed sessions.
    It must never silence one half of a conversation already in progress:
    "ask" is a session putting a question to the user, "voice" is a turn the
    user began by speaking to a puck. Both are answers somebody is waiting on,
    so both are spoken whatever the toggle says - and spoken through the
    satellite, not the dashboards, because that is where the speaker is.

    Quiet hours outrank all of it. An answer arriving at 3am is answering a
    question asked hours ago.
    """
    if not data.get("message"):
        return "nothing"
    if quiet:
        return "push"
    if data.get("ask") or data.get("voice"):
        return "announce"
    return "event" if announcements_on else "push"
