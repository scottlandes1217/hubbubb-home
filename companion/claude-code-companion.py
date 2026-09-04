#!/usr/bin/env python3
"""Receive a voice-dictated prompt from Home Assistant and type it into a
running Claude Code session via tmux.

  POST /prompt   {"text": "fix the SLA bug", "token": "..."}
  GET  /health

The token is read from ~/.claude/hooks/.voice-token (created on first run).
Binds to the LAN so Home Assistant can reach it; every request must carry the
token, and only private-network clients are accepted.
"""
import base64
import datetime
import glob
import importlib.util
import ipaddress
import json
import os
import plistlib
import re
import secrets
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HOST = os.environ.get("CLAUDE_VOICE_HOST", "0.0.0.0")
PORT = int(os.environ.get("CLAUDE_VOICE_PORT", "8787"))
TMUX = "/opt/homebrew/bin/tmux"
PASTE_BUFFER = "jarvis-prompt"  # named, so we never clobber the user's tmux buffer 0

# Which tmux session dictated prompts go to. Sessions run side by side; this
# just names the one currently being spoken to.
TARGET_PATH = os.path.expanduser("~/.claude/hooks/.voice-target")
# Spoken project name -> directory. An allowlist, so a mis-heard project name
# can never start a session somewhere arbitrary.
PROJECTS_PATH = os.path.expanduser("~/.claude/hooks/voice-projects.json")
# Written by ha-notify.py: per-directory busy flag and last spoken summary.
NOTIFY_STATE_PATH = os.path.expanduser("~/.claude/hooks/.ha-notify-state.json")
SESSION_PREFIX = "claude-"
# A prompt held back because its session was mid-turn, waiting to be told
# whether to start a new session or join the queue.
PENDING_PATH = os.path.expanduser("~/.claude/hooks/.voice-pending-prompt")
PENDING_TTL = 600
# A session that has asked the user a yes/no question and is waiting to hear
# back. Tracked here so "yes" has a known addressee: without it a bare yes has
# to be routed by guesswork, and every confirmation in the house fights for it.
AWAIT_PATH = os.path.expanduser("~/.claude/hooks/.voice-awaiting")
AWAIT_TTL = 900
# The session opened for the last spoken question. A question opens its own
# session so its answer is owed out loud - but that meant every follow-up
# opened another one, and "yes, show me the results" arrived in a Claude that
# had never said "would you like to see the results". This is how a chain of
# spoken questions stays one conversation.
ASK_PATH = os.path.expanduser("~/.claude/hooks/.voice-ask-target")
# How long a spoken exchange stays "the same conversation". Tune by feel: too
# short and follow-ups lose the thread again, too long and an unrelated
# question in the morning lands in last night's session.
ASK_TTL = 1800
# Small .command launchers used to open a terminal on an unwatched session.
ATTACH_DIR = os.path.expanduser("~/.claude/hooks/attach")
TOKEN_PATH = os.path.expanduser("~/.claude/hooks/.voice-token")
LOG_PATH = os.path.expanduser("~/.claude/hooks/claude-voice.log")
# Dropped on every successful send and claimed by ha-notify.py's
# UserPromptSubmit hook, so it knows the turn came from the puck and should be
# spoken back no matter how quickly it finishes.
VOICE_MARK_PATH = os.path.expanduser("~/.claude/hooks/.voice-pending")
# Generous: a plan handed over by voice is a whole brief, not a sentence.
MAX_BODY = 262144
# Screenshots and files sent from the phone. Claude Code reads them off disk by
# path, so all the card has to do is get the bytes here and be told where they
# landed. Base64 inflates by a third, hence the larger ceiling on this one
# route; the card downscales images before sending so this is a backstop.
UPLOAD_DIR = os.path.expanduser("~/.claude/hooks/uploads")
MAX_UPLOAD_BODY = 12 * 1024 * 1024
UPLOAD_KEEP = 40
# AirPlay screen mirroring. macOS has no API to start it - mirroring is always
# initiated from the Mac and an Apple TV cannot pull a session - so the work is
# done by an AppleScript that drives Control Center. Accessibility permission
# has to be granted to THIS process (/usr/bin/python3): the grant follows
# whoever runs osascript. Wrapping the script in an osacompile'd .app for a
# friendlier permission name was tried and abandoned - ad-hoc signatures would
# not hold a TCC grant.
MIRROR_SCRIPT = os.path.expanduser("~/.claude/hooks/jarvis-screen-mirror.applescript")
MIRROR_DEFAULT_DEVICE = "Living Room"  # the living room Apple TV's AirPlay name
MIRROR_TIMEOUT = 45


def load_token():
    """Read the shared secret, minting one on first run."""
    if os.path.exists(TOKEN_PATH):
        token = open(TOKEN_PATH).read().strip()
        if token:
            return token
    token = secrets.token_urlsafe(24)
    old = os.umask(0o077)
    try:
        with open(TOKEN_PATH, "w") as handle:
            handle.write(token + "\n")
    finally:
        os.umask(old)
    return token


TOKEN = load_token()


def log(message):
    try:
        with open(LOG_PATH, "a") as handle:
            handle.write(message + "\n")
    except Exception:
        pass


def is_private(address):
    try:
        return ipaddress.ip_address(address).is_private
    except ValueError:
        return False


# ------------------------------------------------------------- projects ----
def load_projects():
    try:
        with open(PROJECTS_PATH) as handle:
            data = json.load(handle)
    except Exception:
        return {}
    projects = data.get("projects", {})
    return {k.lower(): v for k, v in projects.items() if isinstance(v, str)}


def resolve_project(name):
    """Spoken name -> (canonical name, directory), or (None, None).

    Matching is forgiving because this arrives from speech-to-text: case and
    separators are normalised, and a unique prefix match is accepted.
    """
    if not name:
        return None, None
    projects = load_projects()
    key = " ".join(name.lower().replace("-", " ").replace("_", " ").split())
    if key in projects:
        return key, projects[key]
    squashed = key.replace(" ", "")
    for candidate, path in projects.items():
        if candidate.replace(" ", "") == squashed:
            return candidate, path
    hits = [c for c in projects if c.replace(" ", "").startswith(squashed)]
    if len(hits) == 1:
        return hits[0], projects[hits[0]]
    return None, None


# --------------------------------------------------------------- target ----
def read_target():
    """The tmux window id (e.g. '@3') dictated prompts go to.

    Window ids rather than session names: each Claude gets its own tmux
    session, and a window id identifies one of them no matter how the sessions
    are named or how many share a project directory.
    """
    try:
        target = open(TARGET_PATH).read().strip()
    except Exception:
        target = ""
    # The attachment check belongs on this branch, not only on the fallback
    # below: the ordinary case is a target saved before its terminal was
    # closed, and routing to it puts the prompt in a session build mode hides.
    if (target and window_exists(target)
            and pane_var(target, "session_name") in attached_sessions()):
        return target
    # Prefer a session someone still has a terminal open on. Closing the window
    # only detaches - tmux keeps the session alive - so without this filter a
    # dictated prompt lands in a session build mode deliberately hides, and the
    # reply surfaces nowhere. Fall back to any live Claude rather than nothing,
    # since a hidden session is still better than dropping the prompt.
    windows = list_claude_windows()
    attached = attached_sessions()
    on_screen = [w for w in windows if w["session"] in attached]
    for candidate in (on_screen, windows):
        if candidate:
            return candidate[0]["id"]
    return ""


def write_target(target):
    try:
        with open(TARGET_PATH, "w") as handle:
            handle.write(target + "\n")
    except Exception:
        pass


def session_exists(name):
    return subprocess.run(
        [TMUX, "has-session", "-t", name],
        capture_output=True,
    ).returncode == 0


def window_exists(target):
    """Whether tmux can still resolve this target to a live window.

    The output has to be checked, not just the exit status: asked about a
    window that no longer exists, `tmux display-message -p -t @999` exits 0
    and prints nothing. Testing the return code alone therefore answered True
    for every id ever passed to it, alive or dead - which meant read_target()
    kept handing prompts to a saved window long after its session had gone.
    """
    if not target:
        return False
    result = subprocess.run(
        [TMUX, "display-message", "-p", "-t", target, "#{window_id}"],
        capture_output=True, text=True,
    )
    return result.returncode == 0 and bool(result.stdout.strip())


def all_windows():
    """Every tmux window, with the details needed to identify it."""
    result = subprocess.run(
        [TMUX, "list-windows", "-a", "-F",
         "#{window_id}\t#{session_name}\t#{window_index}\t#{pane_current_path}\t#{pane_pid}"],
        capture_output=True, text=True,
    )
    out = []
    for line in result.stdout.splitlines():
        parts = line.split("\t")
        if len(parts) == 5:
            out.append({
                "id": parts[0], "session": parts[1],
                "index": parts[2], "path": parts[3], "pid": parts[4],
            })
    return out


def list_claude_windows(tree=None):
    """Every tmux window that currently has a live Claude in it.

    `ps -e` costs ~100ms and the pane pid is already in the window listing, so
    both come from one call each rather than two per window. /status is polled
    every 1.2s by the card; per-window subprocesses made it an 800ms request.
    """
    tree = tree or ps_tree()
    return [w for w in all_windows() if find_claude(w["id"], tree, w["pid"])]


def attached_sessions():
    """Session names with a terminal window still open on them.

    Closing the window only detaches — tmux keeps the session alive — so this
    is what "still on screen" means, and it is what build mode lists.
    """
    out = subprocess.run(
        [TMUX, "list-sessions", "-F", "#{session_attached}\t#{session_name}"],
        capture_output=True, text=True,
    ).stdout
    return {line.split("\t", 1)[1] for line in out.splitlines()
            if not line.startswith("0\t")}


def session_for(project_dir):
    """The tmux session name that owns a project."""
    for name, path in load_projects().items():
        if os.path.normpath(path) == os.path.normpath(project_dir):
            return SESSION_PREFIX + name.replace(" ", "-")
    return SESSION_PREFIX + os.path.basename(project_dir.rstrip("/")).lower()


# Claude Code runs under node; refuse to type into a bare shell, where a
# dictated prompt would execute as a shell command instead of a prompt.
CLAUDE_COMMANDS = {"claude", "node"}

# Home control that only reached us because Home Assistant could not resolve the
# device — an unexposed entity looks identical to a sentence it cannot parse, so
# it falls through to the coding agent. Typing "turn off kitchen lights" into a
# coding session helps nobody, so bounce it with a reason the puck reads aloud.
# Deliberately narrow: a control verb up front AND a household noun close by, so
# "turn off the debug logging" or "stop the server" still get through.
_VERBS = (
    r"turn|switch|toggle|dim|brighten|open|close|lock|unlock|"
    r"set|play|pause|resume|arm|disarm|start|stop"
)
_NOUNS = (
    r"light|lights|lamp|lamps|thermostat|temperature|heat|heating|ac|"
    r"air conditioning|fan|fans|door|doors|garage|blind|blinds|curtain|"
    r"curtains|shade|shades|tv|television|speaker|speakers|volume|music|"
    r"plug|plugs|outlet|outlets|vacuum|alarm|scene|sprinkler|thermostat"
)
HOME_CONTROL = re.compile(
    rf"^\W*(?:{_VERBS})\b.{{0,40}}?\b(?:{_NOUNS})\b", re.IGNORECASE
)


def pane_var(session, name):
    result = subprocess.run(
        [TMUX, "display-message", "-p", "-t", session, "#{%s}" % name],
        capture_output=True, text=True,
    )
    return result.stdout.strip()


def pane_command(session):
    return pane_var(session, "pane_current_command")


def ps_tree():
    """Every process as (pid -> children, pid -> (stat, name, argv)).

    argv rides along because it is the only way to tell whether a Claude was
    started in bypass mode, and it costs nothing extra here — asking per session
    would be another whole-machine `ps` each time.
    """
    listing = subprocess.run(
        ["/bin/ps", "-eo", "pid=,ppid=,stat=,comm=,args="],
        capture_output=True, text=True,
    ).stdout
    children, info = {}, {}
    for line in listing.splitlines():
        fields = line.split(None, 4)
        if len(fields) < 5:
            continue
        pid, ppid, stat, comm, args = fields
        children.setdefault(ppid, []).append(pid)
        info[pid] = (stat, os.path.basename(comm.strip()), args)
    return children, info


def find_claude(session, tree=None, root=None):
    """Return the pid of a live claude/node process running inside the pane.

    Callers only ever test this for truthiness; the pid is returned rather than
    the command name so the caller can also read that process's argv.

    pane_current_command is not enough on its own: Claude Code keeps a
    persistent login shell as a child, so the pane reports 'zsh' from the
    first Bash tool call onward even though Claude is very much running.
    Walk the pane's whole process tree instead, and skip stopped (Ctrl-Z)
    processes, since a suspended Claude would leave the shell in front.
    """
    if root is None:
        root = pane_var(session, "pane_pid")
    if not root:
        return None

    children, info = tree if tree else ps_tree()

    pending, seen = [root], set()
    while pending:
        pid = pending.pop()
        if pid in seen:
            continue
        seen.add(pid)
        stat, name, _args = info.get(pid, ("", "", ""))
        if name in CLAUDE_COMMANDS and not stat.startswith("T"):
            return pid
        pending.extend(children.get(pid, []))
    return None


def send_to_claude(text, force=False, project=None, new_session=False):
    """Type text into the tmux pane, then press Enter.

    Uses argument lists (never a shell) and tmux's -l literal flag, so the
    dictated text can never be interpreted as a command or a tmux key name.
    """
    if not force and HOME_CONTROL.match(text):
        # Deliberately vague about the cause: reaching here only proves Home
        # Assistant did not recognise the sentence, which is as often a garbled
        # transcription as an unexposed or misfiled device.
        return False, (
            "That sounded like a home command, so I left it alone. "
            "Home Assistant did not recognise it."
        )

    if new_session:
        return start_and_send(project, text)

    session = session_for_project(project) if project else read_target()
    if not window_exists(session):
        return False, "no Claude session is running."

    if not find_claude(session):
        return False, (
            f"Claude is not running in that pane (found '{pane_command(session)}')"
        )

    # Mid-turn: hold the prompt rather than queue it behind running work, and
    # let the caller choose. A new session in the same project is the default.
    busy, elapsed = session_busy(session)
    if busy:
        where = project_name_for(pane_var(session, "pane_current_path"))
        hold_prompt(text, where)
        duration = spoken_duration(elapsed) if elapsed else "a moment"
        return False, (
            f"Claude is already working in {where}, for {duration}. "
            f"Say start a new one, or add it anyway."
        )

    return deliver(text, session)


def mark_voice_prompt(session, ask=False):
    """Leave a one-shot marker so *that* session's answer is announced aloud.

    The window has to be recorded. This used to write a bare timestamp to one
    global file, claimed by whichever session submitted a prompt next - so with
    several Claudes running, a dictated question would routinely hand its
    "speak this" marker to an unrelated session, which then narrated its own
    unrelated work through the puck.

    `ask` is the part the puck actually needs. Every prompt the listener types
    is dictated, so "was it spoken" cannot decide whether to answer out loud:
    it is true of a question asked from the kitchen and equally true of the
    ninetieth turn of an afternoon's work. What separates them is that a
    question opens its own session and a working turn is appended to one that
    is already running. Only the first is somebody waiting on an answer.
    """
    try:
        with open(VOICE_MARK_PATH, "w") as handle:
            json.dump({"id": session, "at": time.time(), "ask": bool(ask)},
                      handle)
    except Exception:
        pass  # a missed announcement must never fail the send


# --------------------------------------------------------------- status ----
def notify_state(bucket="projects"):
    try:
        with open(NOTIFY_STATE_PATH) as handle:
            return json.load(handle).get(bucket, {}) or {}
    except Exception:
        return {}


def status_for(session, path, sharing=1):
    """Per-tmux-session status, falling back to per-directory.

    The pane entry is exact. The directory entry is shared by every session in
    that project, so it is only trusted when this is the only session there —
    otherwise a session that has never run a turn would report its neighbour's
    state as its own.
    """
    pane_entry = notify_state("panes").get(session)
    if pane_entry is not None:
        return pane_entry
    if sharing > 1:
        return {}
    return notify_state("projects").get(path, {})


def spoken_duration(seconds):
    minutes = int(seconds // 60)
    if minutes < 1:
        return "less than a minute"
    if minutes == 1:
        return "a minute"
    if minutes < 60:
        return f"{minutes} minutes"
    hours = minutes // 60
    return "an hour" if hours == 1 else f"{hours} hours"


def project_name_for(path):
    """Prefer the spoken name from the allowlist, else the directory name."""
    for name, directory in load_projects().items():
        if os.path.normpath(directory) == os.path.normpath(path or ""):
            return name
    return os.path.basename(path.rstrip("/")) if path else "an unknown project"


def collect_status():
    target = read_target()
    now = time.time()
    out = []
    seen_projects = {}

    attached = attached_sessions()
    # One process listing for the whole pass: it identifies the Claudes and then
    # answers which permission modes each of them can reach.
    tree = ps_tree()
    windows = [w for w in list_claude_windows(tree) if w["session"] in attached]
    per_path = {}
    for w in windows:
        per_path[w["path"]] = per_path.get(w["path"], 0) + 1

    for w in windows:
        path = w["path"]
        info = status_for(w["id"], path, per_path.get(path, 1))
        busy = bool(info.get("busy"))
        started = info.get("turn_start")
        project = project_name_for(path)
        # Two windows in one project would otherwise both be called "hubbubb",
        # which is useless out loud. Number the later ones.
        seen_projects[project] = seen_projects.get(project, 0) + 1
        label = project if seen_projects[project] == 1 else \
            f"{project}, session {seen_projects[project]}"
        out.append({
            "id": w["id"],
            "session": w["session"],
            "window": w["index"],
            "project": project,
            "label": label,
            "title": session_title(w["id"]),
            "first_message": first_user_message(w["id"]),
            "bytes": transcript_bytes(w["id"]),
            "path": path,
            "busy": busy,
            "elapsed": (now - started) if (busy and started) else None,
            "last_message": info.get("last_message") or "",
            "activity": last_activity(w["id"], info),
            "target": w["id"] == target,
            "modes": modes_for(w["id"], tree, w["pid"]),
            "model": session_model(w["id"]),
            "owner": session_owner(w["id"]),
        })
    # Most recently active first. Labels were numbered in window order above,
    # so a session keeps its name no matter where sorting puts it.
    out.sort(key=lambda s: s["activity"], reverse=True)
    return out


def last_activity(window, info):
    """When this session last did anything, as a unix timestamp.

    ha-notify.py stamps `seen` on every hook event, which is the truest signal.
    A session that has not run a turn yet has no pane entry at all, so fall
    back to its transcript's mtime and finally to 0 (bottom of the list).
    """
    seen = info.get("seen")
    if seen:
        try:
            return float(seen)
        except (TypeError, ValueError):
            pass
    path = notify_state("panes").get(window, {}).get("transcript")
    try:
        return os.path.getmtime(path) if path else 0.0
    except OSError:
        return 0.0


def status_sentence(sessions=None):
    """One speakable line covering every running session."""
    if sessions is None:
        sessions = collect_status()
    if not sessions:
        return "No Claude sessions are running."

    parts = []
    for s in sessions:
        label = s.get("label") or s["project"]
        if s["busy"]:
            duration = spoken_duration(s["elapsed"]) if s["elapsed"] else "a moment"
            line = f"Claude is working in {label}, for {duration}."
        else:
            line = f"Claude is idle in {label}."
        # Only the session you're talking to reads its last message out; with
        # several running, reading all of them is a wall of speech.
        if s["last_message"] and (s["target"] or len(sessions) == 1):
            line += f" Last thing it said: {s['last_message']}"
        parts.append(line)

    if len(sessions) > 1:
        target = next((s.get("label") for s in sessions if s["target"]), None)
        if target:
            parts.append(f"You are currently talking to {target}.")
    return " ".join(parts)


# ------------------------------------------------------------ transcript ----
IGNORED_USER_PREFIXES = ("<command-", "<local-command", "Caveat:")

# Slash-command turns carry terminal styling and tag wrappers.
ANSI_RE = re.compile(r"\x1b\[[0-9;]*[A-Za-z]")
CMD_NAME_RE = re.compile(r"<command-name>(.*?)</command-name>", re.S)
CMD_ARGS_RE = re.compile(r"<command-args>(.*?)</command-args>", re.S)
CMD_OUT_RE = re.compile(r"<local-command-stdout>(.*?)</local-command-stdout>", re.S)

# Transcript path -> display title. Titles are immutable once derived (the
# opening of a conversation never changes), so cache them forever.
_TITLE_CACHE = {}


def session_title(window):
    """A meaningful name for a session: its summary line, else its first
    real user prompt. None when the session has no recorded transcript yet."""
    path = notify_state("panes").get(window, {}).get("transcript")
    if not path or not os.path.exists(path):
        return None
    if path in _TITLE_CACHE:
        return _TITLE_CACHE[path]
    title = None
    try:
        with open(path) as handle:
            for i, line in enumerate(handle):
                if i > 300:
                    break
                try:
                    rec = json.loads(line)
                except Exception:
                    continue
                if rec.get("type") == "summary" and rec.get("summary"):
                    title = rec["summary"]
                    break
                if rec.get("type") == "user" and not rec.get("isMeta"):
                    content = (rec.get("message") or {}).get("content")
                    if isinstance(content, str):
                        text = content
                    else:
                        text = " ".join(
                            part.get("text", "")
                            for part in (content or [])
                            if isinstance(part, dict) and part.get("type") == "text"
                        )
                    text = text.strip()
                    if text and not text.startswith(IGNORED_USER_PREFIXES):
                        title = text
                        break
    except Exception:
        return None
    if title:
        title = " ".join(title.split())
        if len(title) > 60:
            title = title[:57].rsplit(" ", 1)[0] + "…"
    _TITLE_CACHE[path] = title
    return title


_FIRST_CACHE = {}


def first_user_message(window, limit=320):
    """The opening prompt of a session, verbatim rather than summarised.

    session_title() prefers Claude's own summary and truncates hard, which is
    right for a list row but loses what you actually asked. This is what the
    card shows when you tap the title. Immutable once written, so cache it.
    """
    path = notify_state("panes").get(window, {}).get("transcript")
    if not path or not os.path.exists(path):
        return None
    if path in _FIRST_CACHE:
        return _FIRST_CACHE[path]
    found = None
    try:
        with open(path) as handle:
            for i, line in enumerate(handle):
                if i > 300:
                    break
                try:
                    rec = json.loads(line)
                except Exception:
                    continue
                if rec.get("type") != "user" or rec.get("isMeta"):
                    continue
                content = (rec.get("message") or {}).get("content")
                if isinstance(content, str):
                    text = content
                else:
                    text = " ".join(
                        part.get("text", "")
                        for part in (content or [])
                        if isinstance(part, dict) and part.get("type") == "text"
                    )
                text = ANSI_RE.sub("", text).strip()
                if not text or text.startswith(IGNORED_USER_PREFIXES) or text.startswith("<"):
                    continue
                found = " ".join(text.split())
                break
    except Exception:
        return None
    if found and len(found) > limit:
        found = found[: limit - 1].rsplit(" ", 1)[0] + "…"
    _FIRST_CACHE[path] = found
    return found


TOOL_CAP = 700
OUT_CAP = 900
# Prose - what you actually read back in the build-mode UI. Measured over 4293
# real messages: p95 is 2.2k and p99 is 4.5k, so 4000 was severing roughly one
# message in a hundred, always a long final answer. 12k clears p99.6 while
# still capping the pathological case (a pasted file can reach 690k).
TEXT_CAP = 12000
HOME = os.path.expanduser("~")


def _cap(text, n):
    """Trim to n characters on a word boundary, so a cut never lands mid-word."""
    if len(text) <= n:
        return text
    head = text[:n]
    # Only back up to the last space if one is near the end; a long unbroken
    # run (a base64 blob, a minified bundle) has none and must still be cut.
    space = head.rfind(" ")
    if space != -1 and space > n - 120:
        head = head[:space]
    return head.rstrip() + "…"


def _tool_line(name, inp):
    """A tool call as the terminal shows it: the command, or the edit itself."""
    inp = inp or {}
    path = (inp.get("file_path") or inp.get("notebook_path")
            or inp.get("path") or "").replace(HOME, "~")
    if name == "Bash":
        return "$ " + (inp.get("command") or "")
    if name == "Edit":
        old = (inp.get("old_string") or "").splitlines()
        new = (inp.get("new_string") or "").splitlines()
        diff = ["- " + l for l in old[:20]] + ["+ " + l for l in new[:20]]
        return "Edit %s\n%s" % (path, "\n".join(diff))
    if name == "Write":
        body = (inp.get("content") or "").splitlines()[:25]
        return "Write %s\n%s" % (path, "\n".join("+ " + l for l in body))
    if name in ("Grep", "Glob"):
        return " ".join(x for x in (name, inp.get("pattern"), path) if x)
    if name in ("Task", "Agent"):
        return "Agent " + (inp.get("description") or inp.get("subagent_type") or "")
    return " ".join(x for x in (
        name, path or inp.get("description") or inp.get("query")
        or inp.get("url") or "") if x)


def read_transcript(window, limit=110):
    """The conversation in a window, as [{role, text}] for the build-mode UI.

    Everything the terminal puts on screen: prompts, replies, visible
    thinking, every tool call (an Edit as its own ± diff) and its output.
    The exact transcript path is recorded per pane by ha-notify.py on every
    hook event. A session that has never run a turn has no recording yet, so
    fall back to the literal tmux screen — truthful, if unstyled.
    """
    path = notify_state("panes").get(window, {}).get("transcript")
    if path and os.path.exists(path):
        out = []
        try:
            with open(path) as handle:
                for line in handle:
                    try:
                        rec = json.loads(line)
                    except Exception:
                        continue
                    role = rec.get("type")
                    if role not in ("user", "assistant") or rec.get("isMeta"):
                        continue
                    content = (rec.get("message") or {}).get("content")
                    if isinstance(content, str):
                        content = [{"type": "text", "text": content}]
                    for part in content or []:
                        if not isinstance(part, dict):
                            continue
                        kind = part.get("type")

                        if kind == "thinking":
                            text = ANSI_RE.sub("", part.get("thinking") or "").strip()
                            if text:
                                out.append({"role": "think", "text": _cap(text, OUT_CAP)})
                            continue

                        if kind == "tool_use":
                            text = _tool_line(part.get("name"), part.get("input")).strip()
                            if text:
                                out.append({"role": "tool", "text": _cap(text, TOOL_CAP)})
                            continue

                        if kind == "tool_result":
                            body = part.get("content")
                            if isinstance(body, list):
                                body = "\n".join(
                                    b.get("text", "") for b in body
                                    if isinstance(b, dict) and b.get("type") == "text"
                                )
                            text = ANSI_RE.sub("", str(body or "")).strip()
                            if not text:
                                continue
                            out.append({
                                "role": "err" if part.get("is_error") else "out",
                                "text": _cap(text, OUT_CAP),
                            })
                            continue

                        if kind != "text":
                            continue
                        text = ANSI_RE.sub("", part.get("text") or "").strip()
                        if not text:
                            continue

                        # Slash commands and their output are recorded as
                        # ordinary user turns wrapped in tags. They are real
                        # terminal context ("/model -> Set model to Opus 5"),
                        # so surface them as their own role instead of
                        # dropping them.
                        name = CMD_NAME_RE.search(text)
                        if name:
                            label = name.group(1).strip()
                            args = CMD_ARGS_RE.search(text)
                            if args and args.group(1).strip():
                                label += " " + args.group(1).strip()
                            out.append({"role": "cmd", "text": label[:400]})
                            continue
                        stdout = CMD_OUT_RE.search(text)
                        if stdout:
                            body = " ".join(stdout.group(1).split())
                            if not body:
                                continue
                            if out and out[-1]["role"] == "cmd" and "\n" not in out[-1]["text"]:
                                out[-1]["text"] += "\n" + body[:400]
                            else:
                                out.append({"role": "cmd", "text": body[:400]})
                            continue
                        if text.startswith(IGNORED_USER_PREFIXES) or text.startswith("<"):
                            continue
                        out.append({"role": role, "text": _cap(text, TEXT_CAP)})
        except Exception:
            out = []
        if out:
            return out[-limit:]

    screen = subprocess.run(
        [TMUX, "capture-pane", "-p", "-t", window, "-S", "-60"],
        capture_output=True, text=True,
    ).stdout.rstrip()
    return [{"role": "screen", "text": screen}] if screen else []


def transcript_ask(window):
    """The question Claude is actually waiting on, read from the transcript.

    The pane scrape below can only see what fits on the terminal: a long
    question is cut off, option help is truncated, and — the one that really
    matters — there is no way to tell a single-choice dialog (a digit answers
    it) from a multi-select one (digits toggle, Enter submits). The transcript
    records the AskUserQuestion tool call verbatim, so read it there and use the
    screen only to know the dialog is still up.

    Returns the unanswered call as {"questions": [...]} or None.
    """
    path = notify_state("panes").get(window, {}).get("transcript")
    if not path or not os.path.exists(path):
        return None

    try:
        with open(path, errors="replace") as handle:
            lines = handle.readlines()[-400:]
    except Exception:
        return None

    pending = None      # the most recent AskUserQuestion and its tool_use id
    answered = set()    # tool_use ids that already have a result
    for line in lines:
        try:
            rec = json.loads(line)
        except Exception:
            continue
        message = rec.get("message") or {}
        content = message.get("content")
        if not isinstance(content, list):
            continue
        for block in content:
            if not isinstance(block, dict):
                continue
            if block.get("type") == "tool_use" and block.get("name") == "AskUserQuestion":
                pending = (block.get("id"), block.get("input") or {})
            elif block.get("type") == "tool_result":
                answered.add(block.get("tool_use_id"))

    if not pending or pending[0] in answered:
        return None
    questions = pending[1].get("questions")
    return {"questions": questions} if isinstance(questions, list) and questions else None


def merge_ask(scraped, structured):
    """Marry the on-screen dialog to the question that produced it.

    The screen owns the option NUMBERS (what to press) and whether the dialog is
    still up; the transcript owns the wording and multiSelect. A single
    AskUserQuestion can carry several questions asked one after another, so the
    right one is whichever question's option labels match what is on screen.
    """
    if not scraped:
        return None
    if not structured:
        return scraped

    questions = structured["questions"]
    shown = [o["label"].strip().lower() for o in scraped["options"]]

    def score(q):
        labels = [str(o.get("label", "")).strip().lower() for o in (q.get("options") or [])]
        # Screen labels are truncated to the pane width, so compare by prefix.
        return sum(1 for s in shown if any(l.startswith(s[:18]) or s.startswith(l[:18])
                                           for l in labels))

    best_i, best = 0, -1
    for i, q in enumerate(questions):
        hit = score(q)
        if hit > best:
            best_i, best = i, hit
    if best <= 0:
        return scraped      # not this call's dialog (a permission prompt, say)

    question = questions[best_i]
    by_label = {str(o.get("label", "")).strip().lower(): o for o in (question.get("options") or [])}

    options = []
    for opt in scraped["options"]:
        shown_label = opt["label"].strip()
        full = by_label.get(shown_label.lower())
        if full is None:      # truncated on screen — match on prefix
            for label, o in by_label.items():
                if label.startswith(shown_label.lower()[:18]):
                    full = o
                    break
        options.append({
            "key": opt["key"],
            "label": str(full.get("label")) if full else shown_label,
            "desc": (str(full.get("description")) if full and full.get("description")
                     else opt.get("desc", "")),
            "on": opt.get("on", False),
        })

    return {
        "text": str(question.get("question") or scraped["text"]),
        "header": str(question.get("header") or ""),
        # THE fix for "sometimes I have to press submit": say which kind it is.
        "multi": bool(question.get("multiSelect")),
        "index": best_i + 1,
        "total": len(questions),
        "options": options,
    }


def pane_extras(window, screen=None):
    """(ask, activity) scraped off the live tmux screen.

    Claude Code renders every choice UI (AskUserQuestion, permission prompts,
    trust dialogs) as numbered options with a ❯ pointer, and answering is a
    single digit keypress — so the card can offer real buttons. The spinner
    line ("✢ Hyperspacing… (3m 6s · ↓ 9.2k tokens)") is the thinking status.
    """
    if screen is None:
        screen = capture_pane(window, 30)
    cleaned = []
    for raw in screen.splitlines():
        line = raw.strip()
        line = line.strip("│┃").strip()
        cleaned.append(line)

    activity = None
    for line in cleaned:
        m = re.match(r"^\S{1,2}\s+.{1,60}…\s+\((.+)\)$", line)
        if m and re.search(r"token|esc|\ds", m.group(1)):
            activity = line

    # The last run of options numbered 1,2,3… with the ❯ pointer on one of
    # them is a live dialog. Plain numbered lists in output never carry ❯.
    run = []
    for i, line in enumerate(cleaned):
        m = re.match(r"^(❯\s+)?(\d+)\.\s+(.*\S)", line)
        if not m:
            continue
        label = m.group(3)
        # Multi-select rows carry a checkbox; keep its state and drop the glyph
        # so the label matches the transcript's.
        box = re.match(r"^([\u2610\u2611\u2612\u25a1\u25a0\u2713\u2714]|\[[ xX\u2713]\])\s*(.*)$", label)
        on = False
        if box:
            on = box.group(1) not in ("\u2610", "\u25a1", "[ ]")
            label = box.group(2)
        opt = {"i": i, "n": int(m.group(2)), "sel": bool(m.group(1)),
               "on": on, "label": label}
        if opt["n"] == 1:
            run = [opt]
        elif run and opt["n"] == run[-1]["n"] + 1:
            run.append(opt)
    ask = None
    if len(run) >= 2 and any(o["sel"] for o in run):
        first = run[0]["i"]
        # AskUserQuestion puts a blank line between the question and option 1,
        # so a blank only ends the question once something has been collected.
        context = []
        for l in reversed(cleaned[max(0, first - 10):first]):
            if l.startswith("╭"):  # top of the dialog box
                break
            if not l:
                if context:
                    break
                continue
            if set(l) <= set("─╭╮╰╯━┄╌ "):
                continue
            context.insert(0, l)
        # Every line under an option up to the next one is its help text.
        bounds = [o["i"] for o in run] + [len(cleaned)]
        for k, o in enumerate(run):
            desc = []
            for l in cleaned[o["i"] + 1:bounds[k + 1]]:
                if (not l or set(l) <= set("─╭╮╰╯━┄╌ ")
                        or re.search(r"Enter to (select|confirm)|Esc to ", l)):
                    break
                desc.append(l)
            o["desc"] = " ".join(desc)[:300]
        ask = {
            "text": "\n".join(context[-6:]),
            "options": [{"key": str(o["n"]), "label": o["label"],
                         "desc": o["desc"], "on": o["on"]} for o in run],
        }
    return ask, activity


# Aliases Claude Code always understands, whatever the API says today. They are
# the floor the picker falls back to and are always offered alongside the live
# list, because "opus" tracks the newest Opus without anyone editing a file.
MODEL_ALIASES = [
    ("default", "Default"),
    ("opus", "Opus (latest)"),
    ("sonnet", "Sonnet (latest)"),
    ("haiku", "Haiku (latest)"),
    ("fable", "Fable (latest)"),
]

MODELS_CACHE = os.path.expanduser("~/.claude/hooks/.models-cache.json")
MODELS_TTL = 6 * 3600


def _oauth_token():
    """Claude Code's own credential, which it keeps refreshed in the keychain."""
    out = subprocess.run(
        ["/usr/bin/security", "find-generic-password",
         "-s", "Claude Code-credentials", "-w"],
        capture_output=True, text=True,
    ).stdout.strip()
    try:
        return json.loads(out)["claudeAiOauth"]["accessToken"]
    except Exception:
        return None


def _fetch_models():
    """The live model list, newest first, from the Models API."""
    token = _oauth_token()
    if not token:
        return None
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/models?limit=100",
        headers={"Authorization": f"Bearer {token}",
                 "anthropic-beta": "oauth-2025-04-20",
                 "anthropic-version": "2023-06-01"},
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.load(resp)
    return [{"id": m["id"], "name": m.get("display_name") or m["id"]}
            for m in data.get("data", []) if m.get("id")]


def model_list():
    """Every model the account can pick, cached so the picker is not an API call.

    Hardcoding this list means it is wrong the week a model ships. The Models
    API is the only source that is right by construction, so it is the source —
    with a cache so opening the card costs nothing, and a fall back through the
    stale cache to the aliases so the picker still works offline.
    """
    try:
        age = time.time() - os.path.getmtime(MODELS_CACHE)
        cached = json.load(open(MODELS_CACHE))
    except Exception:
        age, cached = None, None

    if cached and age is not None and age < MODELS_TTL:
        return cached

    try:
        fresh = _fetch_models()
        if fresh:
            with open(MODELS_CACHE, "w") as handle:
                json.dump(fresh, handle)
            return fresh
    except Exception as exc:
        log(f"model list fetch failed: {type(exc).__name__}: {exc}")

    # A stale list beats no list; an empty one would empty the dropdown.
    return cached or []


def model_choices():
    """What the picker shows: the aliases first, then every live model."""
    live = model_list()
    seen = {key for key, _ in MODEL_ALIASES}
    out = [{"id": key, "name": label} for key, label in MODEL_ALIASES]
    out += [m for m in live if m["id"] not in seen]
    return out


def valid_model(name):
    """Refuse anything not on the list: this route types into a live session."""
    name = (name or "").strip()
    return name if any(c["id"] == name for c in model_choices()) else None


# Claude Code cycles permission modes with shift-tab; there is no slash command
# that sets one directly, so the chip cycles and reads the result back off the
# status line rather than pretending to know better.
# The modes Claude Code cycles through with shift-tab, in cycle order. There is
# no slash command that sets one directly, so the picker presses until the
# status line agrees, and reports that line rather than pretending to know.
PERMISSION_MODES = ["bypass", "auto", "manual", "accept edits", "plan"]

# Matched on the status line's exact wording, not loose keywords. A bare
# /bypass/ also matched the command that launched the session - `claude
# --permission-mode bypassPermissions` sits in the scrollback - so a fresh
# session read as "bypass" whatever mode it was really in. "auto mode" and
# "manual mode" had no pattern at all and both came back as "ask".
PERMISSION_HINTS = [
    (r"bypass permissions on", "bypass"),
    (r"auto mode on", "auto"),
    (r"manual mode on", "manual"),
    (r"accept edits on", "accept edits"),
    (r"plan mode on", "plan"),
]


def capture_pane(window, lines=30):
    """The visible pane plus a little scrollback, as text."""
    return subprocess.run(
        [TMUX, "capture-pane", "-p", "-t", window, "-S", f"-{lines}"],
        capture_output=True, text=True,
    ).stdout


def modes_for(window, tree=None, root=None):
    """The permission modes this session can actually reach.

    Shift-tab will not cycle into bypass: Claude Code only offers it when the
    session was launched in it, so a hand-started `claude` cycles four modes and
    one started by us cycles five. Offering a mode the session cannot reach means
    the picker either does nothing or lands somewhere nobody asked for.
    """
    tree = tree or ps_tree()
    pid = find_claude(window, tree, root)
    argv = tree[1].get(pid, ("", "", ""))[2] if pid else ""
    if "bypasspermissions" in argv.replace("-", "").replace("_", "").lower():
        return PERMISSION_MODES
    return [m for m in PERMISSION_MODES if m != "bypass"]


def permission_mode(window, screen=None):
    """Whichever mode the status line is advertising, or None if it is silent.

    Unknown is reported as unknown. Claiming a mode the line did not say would
    be the one wrong guess that matters — someone would believe they'd be
    prompted before an edit while the session is on bypass.

    Only the last few lines are considered. The caller may hand over a deeper
    capture it already made, and an older banner sitting further up the
    scrollback would otherwise outrank the one that is current.
    """
    if screen is None:
        screen = capture_pane(window, 12)
    tail = "\n".join(
        [line for line in screen.splitlines() if line.strip()][-6:]
    ).lower()
    for pattern, name in PERMISSION_HINTS:
        if re.search(pattern, tail):
            return name
    # Every mode prints its own banner, so nothing matching means the status
    # line was not readable - not that we are in some safe default. Claiming
    # a mode we did not read is the one wrong guess that matters.
    return None


def session_model(window):
    """The model this session last replied with, read off the transcript tail.

    Claude Code stamps every assistant record with the model id, so the tail is
    the truth — a /model switch shows up on the very next reply. A session with
    no reply yet returns None and the card keeps its placeholder, rather than
    guessing the account default and being wrong the day it changes.
    """
    path = notify_state("panes").get(window, {}).get("transcript")
    if not path:
        return None
    try:
        with open(path, "rb") as handle:
            handle.seek(0, os.SEEK_END)
            handle.seek(max(0, handle.tell() - 262144))
            tail = handle.read().decode("utf-8", "replace")
    except Exception:
        return None
    for line in reversed(tail.splitlines()):
        if '"assistant"' not in line:
            continue
        try:
            rec = json.loads(line)
        except Exception:
            continue
        if rec.get("type") == "assistant":
            model = (rec.get("message") or {}).get("model")
            if model:
                return model
    return None


def transcript_bytes(window):
    """Rough conversation mass for the ring visual: transcript file size."""
    path = notify_state("panes").get(window, {}).get("transcript")
    try:
        return os.path.getsize(path) if path else 0
    except Exception:
        return 0


def save_upload(name, b64):
    """Write a file sent from the phone and hand back its path on disk.

    The name is rebuilt from scratch rather than sanitised in place: anything
    outside a small allow-list is dropped, so no separator, dotdot or control
    character can survive to steer the write out of UPLOAD_DIR.
    """
    stem, ext = os.path.splitext(os.path.basename(name or "upload"))
    stem = re.sub(r"[^A-Za-z0-9._-]", "-", stem).strip("-.") or "upload"
    ext = re.sub(r"[^A-Za-z0-9.]", "", ext)[:12]
    try:
        blob = base64.b64decode(b64 or "", validate=True)
    except Exception:
        return None, "that file did not decode."
    if not blob:
        return None, "that file was empty."

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    path = os.path.join(UPLOAD_DIR, f"{time.strftime('%Y%m%d-%H%M%S')}-{stem}{ext}")
    # Belt and braces: confirm the resolved path really is inside UPLOAD_DIR.
    if os.path.dirname(os.path.realpath(path)) != os.path.realpath(UPLOAD_DIR):
        return None, "bad file name."
    with open(path, "wb") as handle:
        handle.write(blob)

    # Keep the directory from growing without bound; these are throwaway.
    try:
        files = sorted(
            (os.path.join(UPLOAD_DIR, f) for f in os.listdir(UPLOAD_DIR)),
            key=os.path.getmtime,
        )
        for old in files[:-UPLOAD_KEEP]:
            os.remove(old)
    except OSError:
        pass
    return path, f"{len(blob)} bytes"


def kill_window(window):
    """End the Claude session living in a tmux window."""
    if not window_exists(window):
        return False, "that session is already gone."
    label = project_name_for(pane_var(window, "pane_current_path"))
    result = subprocess.run(
        [TMUX, "kill-window", "-t", window], capture_output=True, text=True
    )
    if result.returncode != 0:
        return False, result.stderr.strip() or "tmux refused to close it."
    return True, f"Ended the {label} session."


def current_project():
    """The project the window you're talking to is sitting in."""
    return project_name_for(pane_var(read_target(), "pane_current_path"))


def session_busy(target):
    """True when the Claude in this tmux window is mid-turn."""
    path = pane_var(target, "pane_current_path")
    info = status_for(target, path, sharing=2)  # exact entry only
    if not info.get("busy"):
        return False, None
    started = info.get("turn_start")
    return True, (time.time() - started) if started else None


def open_terminal_for(session):
    """Open a Terminal.app window attached to a session, which closes itself
    when that session ends.

    Opened with `-g` so the window appears behind whatever you are working in
    instead of stealing focus.

    A .terminal settings file opened with `open`, not AppleScript. Driving
    Terminal with osascript needs Automation permission that a launchd agent
    cannot get — the AppleEvent just times out (-1712) — so the window has to
    manage its own lifetime. shellExitAction 0 is "close the window when the
    shell exits": `tmux attach` returns the moment the session is killed, the
    shell exits, and Terminal disposes of the window with nobody driving it.
    """
    if os.environ.get("CLAUDE_VOICE_TERMINAL", "").lower() == "none":
        return None
    app = "Terminal"
    try:
        os.makedirs(ATTACH_DIR, exist_ok=True)
        path = os.path.join(ATTACH_DIR, f"{session}.terminal")
        with open(path, "wb") as handle:
            plistlib.dump({
                "name": f"Jarvis {session}",
                "type": "Window Settings",
                "CommandString": f"{TMUX} attach -t {session}",
                "RunCommandAsShell": True,
                "shellExitAction": 0,  # close the window when the shell exits
            }, handle)
        subprocess.run(["/usr/bin/open", "-g", "-a", app, path],
                       capture_output=True, timeout=20, check=True)
        return app
    except Exception as exc:
        log(f"could not open a terminal for {session}: {exc}")
        return None


def next_session_name(project_name):
    """A tmux session name nothing is using yet: claude-hubbubb, then -2, -3."""
    base = SESSION_PREFIX + project_name.replace(" ", "-")
    if not session_exists(base):
        return base
    for suffix in range(2, 100):
        candidate = f"{base}-{suffix}"
        if not session_exists(candidate):
            return candidate
    return f"{base}-{int(time.time())}"


def open_claude_window(project_name, path):
    """A new Claude, in a tmux session and a terminal window of its own.

    One session per Claude rather than one per project. `tmux new-window` in a
    session someone is attached to drags every attached client over to the new
    window, so starting a second Claude looked like the conversation you were
    watching had vanished. A brand new session leaves existing terminals exactly
    where they were, and gets its own terminal window to live in.
    """
    session = next_session_name(project_name)
    created = subprocess.run(
        [TMUX, "new-session", "-d", "-s", session, "-c", path,
         "-P", "-F", "#{window_id}"],
        capture_output=True, text=True, check=True,
    ).stdout.strip()

    # bypassPermissions, not the default auto mode: a voice session has nobody
    # sitting in front of it to answer a prompt, and auto mode's classifier
    # refuses actions outright ("Blocked by classifier") with no way to say yes.
    subprocess.run([TMUX, "send-keys", "-t", created, "-l",
                    "claude --permission-mode bypassPermissions"], check=True)
    subprocess.run([TMUX, "send-keys", "-t", created, "Enter"], check=True)

    opened = open_terminal_for(session)
    return created, (opened or "detached"), session


# -------------------------------------------------------------- pending ----
def hold_prompt(text, project):
    try:
        with open(PENDING_PATH, "w") as handle:
            json.dump({"text": text, "project": project, "at": time.time()}, handle)
    except Exception:
        pass


def set_awaiting(window, question):
    """Record that this window asked something and is waiting for an answer."""
    try:
        with open(AWAIT_PATH, "w") as handle:
            json.dump({"id": window, "question": question[:400],
                       "at": time.time()}, handle)
    except Exception:
        pass


def peek_awaiting():
    """The window waiting on an answer, or None. Does not clear it."""
    try:
        with open(AWAIT_PATH) as handle:
            data = json.load(handle)
    except Exception:
        return None
    if time.time() - float(data.get("at", 0)) > AWAIT_TTL:
        clear_awaiting()
        return None
    if not window_exists(data.get("id") or ""):
        # The session closed before answering; nothing is waiting any more.
        clear_awaiting()
        return None
    return data


def clear_awaiting():
    try:
        os.remove(AWAIT_PATH)
    except Exception:
        pass


def answer_awaiting(reply):
    """Send a yes/no back to whichever session asked. One shot."""
    waiting = peek_awaiting()
    if not waiting:
        # Nothing registered, but the puck may still have asked out loud: a
        # bare "yes" then belongs to the session that just spoke, not nowhere.
        recent = read_ask_target()
        if recent and not session_busy(recent["id"])[0]:
            ok, _ = deliver(reply, recent["id"], ask=True)
            if ok:
                write_ask_target(recent["id"], recent.get("path") or "")
                return True, "On it sir." if reply == "yes" else "Leaving it sir."
        return False, "I don't have a question waiting sir."
    clear_awaiting()
    # ask=True: this is the reply to a question the puck itself asked, so its
    # answer is owed out loud whatever the sound toggle says. clear_awaiting()
    # has already run, so is_important() cannot rescue it later.
    ok, detail = deliver(reply, waiting["id"], ask=True)
    if not ok:
        return False, detail
    # The session speaks its own result when it finishes; this is only the
    # acknowledgement, so keep it to the length of a nod.
    return True, "On it sir." if reply == "yes" else "Leaving it sir."


def take_prompt():
    """Read and clear the held prompt, ignoring a stale one."""
    try:
        with open(PENDING_PATH) as handle:
            data = json.load(handle)
    except Exception:
        return None
    try:
        os.remove(PENDING_PATH)
    except Exception:
        pass
    if time.time() - float(data.get("at", 0)) > PENDING_TTL:
        return None
    return data


def resolve_pending(action, project=None):
    held = take_prompt()
    if not held:
        # Nothing waiting. "start a new one" then just means what it says, so
        # the overlap with ClaudeStartSession's project-less form is harmless.
        if action == "new":
            # Speech only wants the sentence; the window id is for /session.
            return start_session(project or "")[:2]
        return False, "I don't have a prompt waiting sir."

    text = held.get("text") or ""
    if action == "discard":
        return True, "Dropped it."

    if action == "append":
        ok, detail = deliver(text, session_for_project(held.get("project")))
        return ok, ("Added it to the current session." if ok else detail)

    # Default: a new session, in the same project unless told otherwise.
    return start_and_send(project or held.get("project"), text)


def start_and_send(project, text):
    """Open a fresh Claude session and hand it the text.

    Used for build/plan handoffs, which want their own session rather than
    being appended to whatever conversation is already running.
    """
    name, path = resolve_project(project or current_project())
    if not name:
        return False, f"I don't know a project called {project}."

    # A follow-up belongs in the session that answered the question before it.
    recent = read_ask_target()
    if (recent
            and os.path.normpath(recent.get("path") or "") == os.path.normpath(path)
            and not session_busy(recent["id"])[0]):
        ok, detail = deliver(text, recent["id"], ask=True)
        if ok:
            write_target(recent["id"])
            write_ask_target(recent["id"], path)
            return True, ("Looking into this for you sir. "
                          "I will speak the answer as soon as it is ready.")

    created, placement, session = open_claude_window(name, path)
    write_target(created)
    # Claude needs a moment to come up before it will accept typed input.
    for _ in range(30):
        time.sleep(1)
        if find_claude(created):
            break
    # find_claude only proves the process exists; the TUI is not ready to accept
    # input for another second or two, and an Enter that lands early is
    # swallowed — leaving the prompt typed but never submitted.
    time.sleep(4)
    # A fresh session means somebody asked rather than continued: its answer
    # is owed out loud whatever the bell says.
    ok, detail = deliver(text, created, ask=True)
    if not ok:
        return False, f"Started a new {name} session but could not send it. {detail}"
    write_ask_target(created, path)
    # Spoken (or narrated by the Jarvis agent) the moment the handoff lands,
    # so it must promise the follow-up: the answer arrives by itself through
    # the Stop hook, and "started a session, no response yet" invites the
    # agent to tell the user to check back.
    where = ("I could not open a terminal for it, so run tmux attach -t "
             f"{session} to see it. " if placement == "detached" else "")
    return True, (f"{where}Looking into this for you sir. "
                  "I will speak the answer as soon as it is ready.")


def windows_in(path):
    """Claude windows sitting in a directory, in tmux listing order."""
    return [
        w for w in list_claude_windows()
        if os.path.normpath(w["path"]) == os.path.normpath(path)
    ]


def session_for_project(project):
    """The running window for a project, preferring the current target."""
    name, path = resolve_project(project)
    if not name:
        return read_target()
    target = read_target()
    if os.path.normpath(pane_var(target, "pane_current_path")) == os.path.normpath(path):
        return target
    matches = windows_in(path)
    return matches[0]["id"] if matches else target


def read_ask_target():
    """The session that answered the last spoken question, if it can take another.

    Alive, on screen, idle and recent - anything else and a follow-up is better
    off in a fresh session than appended to a stranger.
    """
    try:
        with open(ASK_PATH) as handle:
            data = json.load(handle)
    except Exception:
        return None
    if time.time() - float(data.get("at", 0)) > ASK_TTL:
        return None
    window = data.get("id") or ""
    if not window_exists(window) or not find_claude(window):
        return None
    if pane_var(window, "session_name") not in attached_sessions():
        return None
    return data


def write_ask_target(window, path):
    try:
        with open(ASK_PATH, "w") as handle:
            json.dump({"id": window, "path": path, "at": time.time()}, handle)
    except Exception:
        pass  # continuity is a convenience; never fail a send for it


def deliver(text, session, ask=False):
    """Type text into a specific window, with no busy check.

    `ask` marks a prompt that opened its own session - a question, whose answer
    the puck owes the user out loud. It is passed through to the marker.
    """
    if not window_exists(session):
        return False, "that Claude session is gone."
    if not find_claude(session):
        return False, "Claude is not running there."
    # Bracketed paste rather than send-keys -l: a literal newline is Enter to
    # the TUI, so a multi-line message would submit at its first line break.
    # Claude shows this as a paste placeholder and expands it on Enter, exactly
    # like a real paste, so the formatting survives.
    subprocess.run([TMUX, "load-buffer", "-b", PASTE_BUFFER, "-"],
                   input=text.encode(), check=True)
    subprocess.run([TMUX, "paste-buffer", "-p", "-d", "-b", PASTE_BUFFER,
                    "-t", session], check=True)
    # A long brief takes a moment to render; Enter sent in the same instant can
    # be dropped.
    time.sleep(0.4)
    subprocess.run([TMUX, "send-keys", "-t", session, "Enter"], check=True)
    mark_voice_prompt(session, ask=ask)
    tag_owner(session)
    return True, "sent"


def start_session(project):
    """Create a tmux session running Claude in an allowlisted directory.

    With no project named, start another session in the one you're already in —
    "start a new working session" almost always means "another one of these".
    """
    if not project:
        project = current_project()
    name, path = resolve_project(project)
    if not name:
        return False, f"I don't know a project called {project}."
    if not os.path.isdir(path):
        return False, f"The {name} folder is missing."

    created, placement, session = open_claude_window(name, path)
    write_target(created)
    # Say plainly that the target moved and the new session is empty. Without
    # this it is very easy to keep talking and wonder why Claude lost the thread.
    where = ("I could not open a terminal for it, so run tmux attach -t "
             f"{session} to see it." if placement == "detached"
             else f"I opened it in a new {placement} window.")
    # The window id goes back to the caller too. Until Claude has finished
    # booting the new window holds no live Claude, so read_target() falls back
    # to an already-running session — a caller waiting for "the one wearing the
    # target" would open somebody else's session instead of this one.
    return True, (
        f"Started a new Claude session in {name}. "
        f"You are now talking to it, and it starts with no history. {where}"
    ), created


def switch_session(project):
    name, path = resolve_project(project)
    if not name:
        return False, f"I don't know a project called {project}."
    # Match on the directory a window is actually sitting in, in listing order,
    # so the original window wins over any later one in the same project.
    matches = windows_in(path)
    if not matches:
        return False, f"No Claude session is running in {name}."

    write_target(matches[0]["id"])
    extra = "" if len(matches) == 1 else f" There are {len(matches)}; this is the first."
    return True, f"You are now talking to {name}.{extra}"


# --- Who is speaking ---------------------------------------------------------
# The voice service (companion/voice-service in hubbubb-home, same Mac) writes
# its verdict on every utterance to last.json and takes enrollment labels on
# its admin port. This end only ever reads the file and forwards labels.
SPEAKER_STATE = os.path.expanduser("~/.hubbubb-voice/last.json")
VOICE_ADMIN = "http://127.0.0.1:10301"
OWNERS_PATH = os.path.expanduser("~/.claude/hooks/.session-owners.json")
DEFAULT_OWNER = "Scott"
# An utterance verdict older than this says nothing about who is talking now.
SPEAKER_FRESH = 120


def speaker_guess():
    """(person, confidence) from the voice service's last utterance, or (None, 0)."""
    try:
        with open(SPEAKER_STATE) as handle:
            data = json.load(handle)
        if time.time() - float(data.get("ts", 0)) > SPEAKER_FRESH:
            return None, 0.0
        return data.get("person"), float(data.get("confidence") or 0)
    except Exception:
        return None, 0.0


def current_speaker():
    """Best name for who is talking right now; the house default when unknown."""
    person, _ = speaker_guess()
    return person or DEFAULT_OWNER


def label_speaker(name):
    """Tell the voice service the last utterance belonged to `name`."""
    body = json.dumps({"person": name}).encode()
    headers = {"Content-Type": "application/json"}
    try:
        headers["X-Voice-Service-Token"] = open(
            os.path.expanduser("~/.hubbubb-voice/token")).read().strip()
    except OSError:
        pass  # an old service without a token still accepts the call
    request = urllib.request.Request(
        f"{VOICE_ADMIN}/label", data=body, headers=headers, method="POST")
    with urllib.request.urlopen(request, timeout=5):
        pass


# Enrollment approvals: saying "this is Scott" trains Scott's voice profile,
# so the claim is confirmed on Scott's computer (this Mac) first - a spoken
# assertion alone must not be able to poison a profile. One approval covers
# ten minutes, so a round of enrollment sentences is one dialog, not five.
# ponytail: single shared window, per-person windows when a second person
# actually enrolls here.
APPROVAL_WINDOW = 600
_approval = {"name": "", "at": 0.0}


def enrollment_approved(name):
    if _approval["name"] == name and time.time() - _approval["at"] < APPROVAL_WINDOW:
        return True
    try:
        run = subprocess.run(
            ["/usr/bin/osascript", "-e",
             'display dialog "Enroll the voice that just spoke as %s?" '
             'with title "Jarvis voice enrollment" '
             'buttons {"Deny", "Approve"} default button "Approve" '
             'giving up after 30' % name.replace('"', "")],
            capture_output=True, text=True, timeout=40)
    except Exception:
        return False
    approved = ("Approve" in run.stdout and "gave up:true" not in run.stdout
                and run.returncode == 0)
    if approved:
        _approval.update(name=name, at=time.time())
    return approved


def tag_owner(session):
    """Record who a session belongs to: first voice contact claims it."""
    try:
        try:
            with open(OWNERS_PATH) as handle:
                owners = json.load(handle)
        except Exception:
            owners = {}
        entry = owners.get(session) or {"owner": current_speaker()}
        entry["last"] = current_speaker()
        entry["at"] = time.time()
        owners[session] = entry
        if len(owners) > 50:  # windows come and go; keep the newest
            for stale in sorted(owners, key=lambda s: owners[s].get("at", 0))[:-50]:
                del owners[stale]
        with open(OWNERS_PATH, "w") as handle:
            json.dump(owners, handle)
    except Exception:
        pass  # attribution is a convenience; never fail a send for it


def session_owner(session):
    try:
        with open(OWNERS_PATH) as handle:
            return (json.load(handle).get(session) or {}).get("owner") or ""
    except Exception:
        return ""


# --- House memory ------------------------------------------------------------
# Moved 2026-08-31: the hubbubb_home integration on Home Assistant owns the
# house memory store (hubbubb_home_memory.db in the HA config dir), written
# only by HA - voice via the Hubbubb* memory intents and the agent's tools,
# the Mac via the "Jarvis - remember webhook" automation. This listener keeps
# only the speaker actions (identify/whoami) on /memory.


def screen_mirror(action, device):
    """Start or stop AirPlay screen mirroring from this Mac."""
    action = (action or "start").strip().lower()
    if action not in ("start", "stop"):
        return False, "I can only start or stop screen mirroring sir."
    device = (device or "").strip() or MIRROR_DEFAULT_DEVICE

    try:
        run = subprocess.run(
            ["/usr/bin/osascript", MIRROR_SCRIPT, action, device],
            capture_output=True, text=True, timeout=MIRROR_TIMEOUT,
        )
    except subprocess.TimeoutExpired:
        return False, "The MacBook took too long to answer sir."
    except Exception as exc:
        return False, "%s: %s" % (type(exc).__name__, exc)

    if run.returncode == 0:
        return True, run.stdout.strip() or "Done."

    err = (run.stderr or "").strip()
    # -1719 is the Accessibility case; osascript also spells it out in words.
    if "-1719" in err or "assistive access" in err or "not allowed" in err:
        return False, ("I need Accessibility permission on the MacBook. Add "
                       "/usr/bin/python3 under System Settings, Privacy and "
                       "Security, Accessibility.")
    # AppleScript prefixes the script path and offsets; keep only the sentence.
    return False, err.split("execution error:")[-1].strip() or "The screen mirroring script failed."


# --- Nightly review ----------------------------------------------------------
#
# The transcripts of your coding sessions live on this machine, and so does the
# Claude Code CLI. Everything else about the nightly review - when it runs,
# whether it runs, what it is asked, what is kept - belongs in Home Assistant,
# so this endpoint is deliberately thin: it turns a brief into a report and
# gives it back. Hubbubb Home sends the task and the house inventory; this adds
# the one thing only this machine can supply.

CLAUDE_BIN = os.environ.get(
    "CLAUDE_BIN", os.path.expanduser("~/.local/bin/claude"))
REVIEW_TIMEOUT = int(os.environ.get("REVIEW_TIMEOUT", "1800"))
PROJECTS_DIR = os.path.expanduser("~/.claude/projects")
MAX_DIGEST = 60_000

# Redacted rather than withheld wholesale: the digest is otherwise a verbatim
# copy of what was typed, and it ends up in a prompt and in stored findings.
SECRET = re.compile(
    r"client[_ ]?secret|consumer[_ ]?secret|api[_ ]?key|secret[_ ]?key"
    r"|access[_ ]?token|bearer\s+[A-Za-z0-9._-]{16}|password\s*[:=]"
    r"|hbb[cs]_[A-Za-z0-9]|sk-[A-Za-z0-9]{16}|ghp_[A-Za-z0-9]{16}"
    r"|-----BEGIN [A-Z ]*PRIVATE KEY", re.I)


def _recent(stamp, cutoff):
    """True if an ISO-8601 record timestamp falls inside the window.

    Per message, never per file: a session touched today carries months of
    older messages, and filtering on the file's mtime let all of them through
    as "the last 24 hours".
    """
    if not stamp:
        return True
    try:
        when = datetime.datetime.fromisoformat(str(stamp).replace("Z", "+00:00"))
    except ValueError:
        return True
    return when.timestamp() >= cutoff


def build_digest(hours=24, projects=()):
    """The user's own words and every tool error, from the local transcripts.

    Assistant prose is dropped entirely - it is the model's account of events,
    and feeding a model its own reasoning back is how a mistake gets confirmed
    rather than caught.
    """
    cutoff = time.time() - hours * 3600
    users, errors, withheld = [], [], 0
    wanted = tuple(p.lower() for p in projects if p)
    for path in glob.glob(os.path.join(PROJECTS_DIR, "*", "*.jsonl")):
        project = os.path.basename(os.path.dirname(path))
        if wanted and not any(w in project.lower() for w in wanted):
            continue
        try:
            handle = open(path, errors="ignore")
        except OSError:
            continue
        with handle:
            for line in handle:
                try:
                    rec = json.loads(line)
                except ValueError:
                    continue
                if rec.get("type") != "user" or not _recent(
                        rec.get("timestamp"), cutoff):
                    continue
                content = rec.get("message", {}).get("content")
                if isinstance(content, str):
                    text = content.strip()
                    # Hook output and system reminders are not the user talking.
                    if text and not text.startswith("<"):
                        if SECRET.search(text):
                            withheld += 1
                            continue
                        users.append("[%s] %s" % (project[-28:], text))
                elif isinstance(content, list):
                    for chunk in content:
                        if not isinstance(chunk, dict) or not chunk.get("is_error"):
                            continue
                        body = chunk.get("content")
                        if isinstance(body, list):
                            body = " ".join(b.get("text", "") for b in body
                                            if isinstance(b, dict))
                        body = str(body or "")[:300]
                        if SECRET.search(body):
                            withheld += 1
                            continue
                        errors.append(body)

    out = ["## What the user said (%d)" % len(users)]
    out += ["- " + u.replace("\n", " ")[:600] for u in users]
    out += ["", "## Tool errors (%d)" % len(errors)]
    out += ["- " + e.replace("\n", " ") for e in errors]
    if withheld:
        out += ["", "(%d line(s) withheld: they look like pasted credentials.)"
                % withheld]
    return "\n".join(out)[:MAX_DIGEST]


def run_review(brief, hours=24, projects=()):
    """Assemble the brief with this machine's digest and run it through Claude."""
    if not os.path.exists(CLAUDE_BIN):
        return False, "no Claude Code CLI at %s" % CLAUDE_BIN, "", 0
    digest = build_digest(hours, projects)
    prompt = "%s\n--- digest of the last %d hours ---\n%s" % (
        brief, hours, digest)
    try:
        result = subprocess.run(
            [CLAUDE_BIN, "-p", prompt, "--permission-mode", "plan"],
            capture_output=True, text=True, timeout=REVIEW_TIMEOUT)
    except subprocess.TimeoutExpired:
        return False, "Claude did not finish within %ds" % REVIEW_TIMEOUT, "", len(digest)
    except OSError as exc:
        return False, "could not run Claude: %s" % exc, "", len(digest)
    report = (result.stdout or result.stderr or "").strip()
    if not report:
        return False, "Claude returned nothing", "", len(digest)
    return True, "ok", report, len(digest)


# -------------------------------------------------------------- hubbubb ----
# The Hubbubb inbox read out loud, armed by the bell on the ring card. Home
# Assistant owns the schedule and the on/off helper; this end only ever answers
# one question - anything new since last time? - and hands back a sentence for
# the puck to say.
HUBBUBB_SHIM = os.path.expanduser("~/.claude/hooks/hubbubb-mcp.py")
# When the last answer came back, so nothing is ever announced twice. A
# timestamp and not a set of ids: Hubbubb's agent replies in prose, and a
# parser that digs ids back out of prose is a parser nobody wants to own.
HUBBUBB_STATE = os.path.expanduser("~/.claude/hooks/.hubbubb-unread.json")
# Turning the bell on reads out what is new, not a backlog of everything ever
# received - so a first run only looks this far back.
HUBBUBB_BACKLOG = 3600
HUBBUBB_NONE = "NONE"  # what the agent answers when there is nothing new
HUBBUBB_SHAPE = (
    "This is read aloud to me, so: two sentences at most, say who wrote and "
    "what they want, no markdown, no ids, no links. If there are none, reply "
    "with exactly {none}."
)
HUBBUBB_ASK = (
    "Summarise my unread Hubbubb inbox messages - email threads, direct "
    "messages and channels - that arrived after {since}. " + HUBBUBB_SHAPE
)
# Flipping the bell on is a question - "anything waiting for me?" - so that
# one asks about everything unread, not just what landed since the last poll,
# and always answers out loud even when the answer is nothing.
HUBBUBB_ASK_ALL = (
    "Summarise every unread message in my Hubbubb inbox - email threads, "
    "direct messages and channels - however old. " + HUBBUBB_SHAPE
)
HUBBUBB_EMPTY = "Nothing unread in Hubbubb sir."
# How the answer is collected. `wait_seconds` holds the connection open to its
# deadline even when the run finished seconds ago, so it is asked for no wait
# at all and the run is collected instead: a real run lands in about five
# seconds, and the difference is five seconds of silence after a tap instead
# of a minute of it.
HUBBUBB_POLL = 1.5
HUBBUBB_DEADLINE = 45
HUBBUBB_WAIT = "Hubbubb is still looking sir. I'll speak up when it answers."
_hubbubb_mod = None


def hubbubb_shim():
    """hubbubb-mcp.py as a module.

    Its filename has a hyphen so it cannot be imported by name, and it is
    worth importing rather than copying: minting the OAuth bearer, re-minting
    it on a 401, and shaping transport errors all already live in there.
    """
    global _hubbubb_mod
    if _hubbubb_mod is None:
        spec = importlib.util.spec_from_file_location("hubbubb_mcp", HUBBUBB_SHIM)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        _hubbubb_mod = module
    return _hubbubb_mod


def hubbubb_since():
    try:
        return float(json.load(open(HUBBUBB_STATE))["since"])
    except Exception:
        return time.time() - HUBBUBB_BACKLOG


def hubbubb_call(name, args):
    reply = hubbubb_shim().forward({
        "jsonrpc": "2.0", "id": 1, "method": "tools/call",
        "params": {"name": name, "arguments": args},
    }) or {}
    if reply.get("error"):
        raise RuntimeError(str(reply["error"].get("message"))[:120])
    return " ".join(
        part.get("text", "") for part in reply.get("result", {}).get("content", [])
    ).strip()


def hubbubb_answer(query):
    """Ask, then collect. Comes back with the answer, or with whatever "still
    working" line was last seen if the run outlives the deadline - which the
    caller already knows how to read."""
    text = hubbubb_call("ask_hubbubb", {"query": query, "wait_seconds": 0})
    run = re.search(r"run id:\s*(\d+)", text)
    if not run:
        return text
    deadline = time.time() + HUBBUBB_DEADLINE
    while time.time() < deadline:
        time.sleep(HUBBUBB_POLL)
        text = hubbubb_call("hubbubb_run_status", {"run_id": int(run.group(1))})
        if not text.lower().startswith("still working"):
            break
    return text


def hubbubb_unread(arm=False):
    """(ok, detail, speak) - what is new in the Hubbubb inbox as a sentence to
    say out loud, or "" when there is nothing to say.

    `arm` is the bell being switched on rather than the five-minute poll: it
    asks after everything unread, and answers out loud either way. A poll that
    finds nothing has nothing to say; a question always deserves an answer.
    """
    since = hubbubb_since()
    asked = time.time()
    query = HUBBUBB_ASK_ALL.format(none=HUBBUBB_NONE) if arm else HUBBUBB_ASK.format(
        since=time.strftime("%Y-%m-%d %H:%M:%S %Z", time.localtime(since)),
        none=HUBBUBB_NONE,
    )
    try:
        text = hubbubb_answer(query)
    except Exception as exc:
        return False, f"{type(exc).__name__}: {exc}"[:120], ""
    # Waited out the deadline and it still has not finished, so this is
    # "Still working (run 87)", not an answer. Leave the mark where it is and
    # say nothing: the next poll asks over the same window again.
    if text.lower().startswith("still working"):
        return True, "still working", HUBBUBB_WAIT if arm else ""
    # Only move the mark once an answer is actually in hand: a failed poll has
    # to leave the window open, or whatever arrived during it is never spoken.
    try:
        with open(HUBBUBB_STATE, "w") as handle:
            json.dump({"since": asked}, handle)
    except Exception as exc:
        log(f"hubbubb: could not save state: {exc}")
    if hubbubb_quiet(text):
        return True, "nothing new", HUBBUBB_EMPTY if arm else ""
    return True, text[:80], text


def hubbubb_quiet(text):
    """Whether that answer means "nothing new".

    The sentinel first, stripped of the punctuation and bold markers an LLM
    decorates it with. The second test is the backstop for the day it answers
    in its own words instead - checked as a prefix, so a real summary that
    happens to contain "no unread" further in still gets spoken.
    """
    plain = text.strip().strip("*_`.! \"'").lower()
    return not plain or plain == HUBBUBB_NONE.lower() or plain.startswith("no unread")


class Handler(BaseHTTPRequestHandler):
    def reply(self, code, payload):
        body = json.dumps(payload).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        # The Jarvis ring card fetches these endpoints straight from the Home
        # Assistant dashboard. Private-network + token still gate everything;
        # CORS only lets the browser see the responses it already got.
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Voice-Token")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/health":
            self.reply(200, {"ok": True, "tmux_session": session_exists(read_target())})
        elif parsed.path == "/status":
            # Read-only and harmless, so it skips the token: Home Assistant
            # polls it on a timer and a REST sensor cannot send headers as
            # conveniently as a rest_command can.
            if not is_private(self.client_address[0]):
                return self.reply(403, {"error": "non-private client"})
            sessions = collect_status()
            self.reply(200, {
                "ok": True,
                "summary": status_sentence(sessions),
                "sessions": sessions,
                "projects": sorted(load_projects()),
            })
        elif parsed.path == "/transcript":
            # Same trust level as /status (which already exposes last_message):
            # read-only, private clients only.
            if not is_private(self.client_address[0]):
                return self.reply(403, {"error": "non-private client"})
            query = urllib.parse.parse_qs(parsed.query)
            window = (query.get("id") or [""])[0]
            if not window_exists(window):
                return self.reply(404, {"ok": False, "error": "no such session"})
            try:
                # The transcript is now every tool call and its output, which
                # is tens of KB — too much to re-ship on a 1.2s poll. The file
                # only grows, so an unchanged size means an unchanged
                # conversation: send null and let the card keep what it has.
                # The live dialog and spinner still come back every time.
                size = transcript_bytes(window)
                have = (query.get("have") or [""])[0]
                messages = None if size and have == str(size) else read_transcript(window)
                # One capture for both reads: this runs on every fast poll and
                # each capture-pane is a subprocess.
                screen = capture_pane(window, 30)
                ask, activity = pane_extras(window, screen)
                # The screen says WHICH keys; the transcript says what was
                # actually asked and whether it is multi-select.
                ask = merge_ask(ask, transcript_ask(window))
            except Exception as exc:
                return self.reply(503, {"ok": False, "error": f"{type(exc).__name__}: {exc}"})
            self.reply(200, {"ok": True, "id": window, "messages": messages,
                             "bytes": size, "ask": ask, "activity": activity,
                             "permission": permission_mode(window, screen)})
        elif parsed.path == "/models":
            # Read-only and private-only, like /status: the card fetches it to
            # fill the model picker.
            if not is_private(self.client_address[0]):
                return self.reply(403, {"error": "non-private client"})
            self.reply(200, {"ok": True, "models": model_choices(),
                             "modes": PERMISSION_MODES})
        else:
            self.reply(404, {"error": "not found"})

    def do_POST(self):
        if self.path not in ("/prompt", "/session", "/target", "/pending", "/memory",
                             "/kill", "/key", "/upload", "/mirror", "/hubbubb",
                             "/await", "/answer", "/model", "/permission",
                             "/review"):
            return self.reply(404, {"error": "not found"})
        if not is_private(self.client_address[0]):
            return self.reply(403, {"error": "non-private client"})

        # Only the upload route gets the big ceiling; everything else stays on
        # the small one, so a stray oversized body cannot tie up the listener.
        cap = (MAX_UPLOAD_BODY if self.path in ("/upload", "/review")
               else MAX_BODY)
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0 or length > cap:
            return self.reply(400, {"error": "bad length"})
        try:
            data = json.loads(self.rfile.read(length))
        except Exception:
            return self.reply(400, {"error": "bad json"})

        # hubbubb_home sends the token as a bearer; the rest_commands and
        # the conversation agent send X-Voice-Token. Accept either.
        supplied = (data.get("token") or self.headers.get("X-Voice-Token")
                    or self.headers.get("Authorization", "").removeprefix("Bearer ").strip())
        if not secrets.compare_digest(str(supplied), TOKEN):
            log(f"rejected {self.client_address[0]}: bad token")
            return self.reply(401, {"error": "bad token"})

        if self.path in ("/session", "/target"):
            # Build mode points the voice target at the exact window it has
            # open, so "hey Jarvis, ..." lands in the session on screen.
            window = (data.get("id") or "").strip()
            if self.path == "/target" and window:
                if not window_exists(window):
                    return self.reply(404, {"ok": False, "detail": "that session is gone."})
                write_target(window)
                log(f"{self.client_address[0]} /target -> {window}")
                return self.reply(200, {"ok": True, "detail": "target moved."})
            project = (data.get("project") or "").strip()
            action = start_session if self.path == "/session" else switch_session
            created = None
            try:
                ok, detail, *rest = action(project)
                created = rest[0] if rest else None
            except Exception as exc:
                ok, detail = False, f"{type(exc).__name__}: {exc}"
            log(f"{self.client_address[0]} {self.path} {project!r} [{detail}]")
            body = {"ok": ok, "detail": detail}
            if created:
                body["id"] = created
            return self.reply(200 if ok else 503, body)

        if self.path == "/mirror":
            try:
                ok, detail = screen_mirror(data.get("action"), data.get("device"))
            except Exception as exc:
                ok, detail = False, "%s: %s" % (type(exc).__name__, exc)
            log("%s /mirror %r %r [%s]" % (self.client_address[0],
                                           data.get("action"), data.get("device"), detail[:80]))
            return self.reply(200 if ok else 503, {"ok": ok, "detail": detail})

        if self.path == "/memory":
            action = (data.get("action") or "search").strip().lower()
            text = (data.get("text") or "").strip()
            try:
                if action == "identify":
                    # "This is Scott" - label the last utterance for training.
                    # An open mic appends whatever else was audible to the
                    # wildcard capture ("Scott. I'm very lucky that..."), so
                    # keep only the opening sentence and at most three words -
                    # a name is never longer than that.
                    # STT often runs sentences together with no punctuation
                    # ("scott how are you doing"), so also stop at the first
                    # word that cannot be part of a name.
                    words = re.split(r"[.,!?;]", text)[0].split()
                    for stop, w in enumerate(words):
                        if w.lower() in ("how", "are", "is", "the", "and",
                                         "what", "can", "you", "i", "my",
                                         "please", "turn", "set", "hey"):
                            words = words[:stop]
                            break
                    name = " ".join(words[:3]).title()
                    if not name:
                        ok, detail = False, "I didn't catch the name sir."
                    elif name.lower() == "jarvis":
                        # A mis-split wake word ("Jarvis, this is Scott")
                        # captures the assistant's own name; a profile called
                        # Jarvis then swallows everybody's matches.
                        ok, detail = True, "That's my name sir - tell me yours."
                    elif not enrollment_approved(name):
                        ok, detail = True, (
                            f"I need approval on the MacBook to learn a voice "
                            f"as {name}, and it wasn't given.")
                    else:
                        try:
                            label_speaker(name)
                            ok, detail = True, (
                                f"Understood {name}. I'll learn your voice as we talk.")
                        except Exception:
                            ok, detail = True, (
                                f"Noted {name}, but the voice trainer isn't "
                                "running, so I couldn't save this sample.")
                elif action == "whoami":
                    person, confidence = speaker_guess()
                    if person and confidence >= 0.75:
                        ok, detail = True, f"You are {person} sir."
                    elif person:
                        ok, detail = True, f"I believe you're {person} but I'm not certain."
                    else:
                        ok, detail = True, (
                            "I don't recognize this voice yet. "
                            "Tell me who you are by saying, this is, and your name.")
                else:
                    # add/search/forget moved to the hubbubb_home store on
                    # Home Assistant on 2026-08-31; answer honestly instead
                    # of consulting a database that no longer exists here.
                    ok, detail = True, (
                        "House memory lives with Home Assistant now sir - "
                        "just ask Jarvis to remember, recall or forget it.")
            except Exception as exc:
                ok, detail = False, f"{type(exc).__name__}: {exc}"
            log(f"{self.client_address[0]} /memory {action} {text[:80]!r} [{detail[:80]}]")
            return self.reply(200 if ok else 503, {"ok": ok, "detail": detail})

        if self.path == "/review":
            brief = (data.get("brief") or "").strip()
            if not brief:
                return self.reply(400, {"ok": False, "detail": "empty brief"})
            hours = int(data.get("hours") or 24)
            projects = data.get("projects") or []
            if isinstance(projects, str):
                projects = [p.strip() for p in projects.split(",") if p.strip()]
            log(f"{self.client_address[0]} /review hours={hours} "
                f"projects={projects or 'all'}")
            try:
                ok, detail, report, size = run_review(brief, hours, projects)
            except Exception as exc:
                ok, detail, report, size = (
                    False, f"{type(exc).__name__}: {exc}", "", 0)
            log(f"  /review [{detail}] digest={size} report={len(report)}")
            return self.reply(200 if ok else 503,
                              {"ok": ok, "detail": detail,
                               "report": report, "digest_chars": size})

        if self.path == "/hubbubb":
            try:
                ok, detail, speak = hubbubb_unread(arm=bool(data.get("arm")))
            except Exception as exc:
                ok, detail, speak = False, f"{type(exc).__name__}: {exc}", ""
            log(f"{self.client_address[0]} /hubbubb arm={int(bool(data.get('arm')))} [{detail}]")
            return self.reply(200 if ok else 503,
                              {"ok": ok, "detail": detail, "speak": speak})

        if self.path == "/upload":
            try:
                path, detail = save_upload(data.get("name"), data.get("data"))
            except Exception as exc:
                path, detail = None, f"{type(exc).__name__}: {exc}"
            log(f"{self.client_address[0]} /upload {str(data.get('name'))[:60]!r} [{detail}]")
            if not path:
                return self.reply(503, {"ok": False, "detail": detail})
            return self.reply(200, {"ok": True, "path": path, "detail": detail})

        if self.path == "/model":
            # Typed as the real slash command so Claude Code owns the meaning of
            # a model name; the allowlist is only here so this route can never
            # be used to type arbitrary text into a session.
            window = (data.get("id") or "").strip()
            model = valid_model(data.get("model"))
            if not model:
                return self.reply(400, {"ok": False, "detail": "unknown model"})
            if not window_exists(window):
                return self.reply(404, {"ok": False, "detail": "that session is gone."})
            try:
                subprocess.run([TMUX, "send-keys", "-t", window, "-l", f"/model {model}"], check=True)
                subprocess.run([TMUX, "send-keys", "-t", window, "Enter"], check=True)
                ok, detail = True, model
            except Exception as exc:
                ok, detail = False, f"{type(exc).__name__}: {exc}"
            log(f"{self.client_address[0]} /model {window} {model} [{detail}]")
            return self.reply(200 if ok else 503, {"ok": ok, "detail": detail})

        if self.path == "/permission":
            # Shift-tab cycles the mode; Claude Code has no command that sets one
            # directly. With a target mode, press until the status line agrees —
            # so a picker is one tap instead of the user cycling by hand. Report
            # what the status line actually says, never what we aimed for.
            window = (data.get("id") or "").strip()
            want = (data.get("mode") or "").strip().lower() or None
            if want and want not in PERMISSION_MODES:
                return self.reply(400, {"ok": False, "detail": "unknown mode"})
            if not window_exists(window):
                return self.reply(404, {"ok": False, "detail": "that session is gone."})
            allowed = modes_for(window)
            if want and want not in allowed:
                # Refuse before touching the session rather than cycling a lap
                # and putting it back. The card hides these, so reaching here
                # means a stale list or a direct call.
                detail = f"this session cannot reach {want}."
                if want == "bypass":
                    detail += (" Bypass is only available in a session that was "
                               "started in it.")
                return self.reply(409, {"ok": False, "detail": detail,
                                        "mode": permission_mode(window),
                                        "modes": allowed})
            try:
                started = permission_mode(window)
                if want and started == want:
                    # Already there. Cycling a full lap back to the same mode
                    # would flicker the session through three others first.
                    return self.reply(200, {"ok": True, "detail": started,
                                            "mode": started})
                # One press for a bare cycle; otherwise at most one full lap, so
                # an unreadable status line cannot spin this forever.
                for _ in range(len(PERMISSION_MODES) if want else 1):
                    subprocess.run([TMUX, "send-keys", "-t", window, "BTab"], check=True)
                    time.sleep(0.25)
                    mode = permission_mode(window)
                    if not want or mode == want:
                        break
                else:
                    # A full lap without reaching it means this session cannot
                    # get there: `bypass` is only in the cycle when the session
                    # was launched with --permission-mode bypassPermissions, so
                    # a hand-started `claude` cycles four modes, not five. Put it
                    # back where it was — leaving a session in a permission mode
                    # nobody asked for is worse than refusing.
                    for _ in range(len(PERMISSION_MODES)):
                        if permission_mode(window) == started:
                            break
                        subprocess.run([TMUX, "send-keys", "-t", window, "BTab"], check=True)
                        time.sleep(0.25)
                    mode = permission_mode(window)
                    detail = (f"this session cannot reach {want} — "
                              f"it is still on {mode}.")
                    if want == "bypass":
                        detail += (" Bypass is only available in a session that "
                                   "was started in it.")
                    log(f"{self.client_address[0]} /permission {window} [{detail}]")
                    return self.reply(409, {"ok": False, "detail": detail,
                                            "mode": mode})
                ok, detail = True, mode
            except Exception as exc:
                ok, detail = False, f"{type(exc).__name__}: {exc}"
            log(f"{self.client_address[0]} /permission {window} [{detail}]")
            return self.reply(200 if ok else 503, {"ok": ok, "detail": detail, "mode": detail})

        if self.path == "/key":
            # One keystroke into a session's dialog (option digit, Enter, Esc).
            # Allowlisted so this can never type arbitrary commands.
            window = (data.get("id") or "").strip()
            key = (data.get("key") or "").strip()
            allowed = {str(n) for n in range(1, 10)} | {
                "Enter", "Escape", "Up", "Down", "Space", "Tab"}
            if key not in allowed:
                return self.reply(400, {"ok": False, "detail": "key not allowed"})
            if not window_exists(window):
                return self.reply(404, {"ok": False, "detail": "that session is gone."})
            try:
                subprocess.run([TMUX, "send-keys", "-t", window, key], check=True)
                ok, detail = True, "sent"
            except Exception as exc:
                ok, detail = False, f"{type(exc).__name__}: {exc}"
            log(f"{self.client_address[0]} /key {window} {key} [{detail}]")
            return self.reply(200 if ok else 503, {"ok": ok, "detail": detail})

        if self.path == "/await":
            # A session registering that it has asked a question. The window is
            # taken from the request rather than the target, so a session that
            # is not currently the target can still be answered.
            window = (data.get("id") or "").strip()
            question = (data.get("question") or "").strip()
            if not window_exists(window):
                return self.reply(200, {"ok": False,
                                        "detail": "that session is gone."})
            set_awaiting(window, question)
            log(f"{self.client_address[0]} /await {window} {question[:60]!r}")
            return self.reply(200, {"ok": True, "detail": "waiting."})

        if self.path == "/answer":
            reply = (data.get("reply") or "").strip().lower()
            if reply not in ("yes", "no"):
                return self.reply(400, {"ok": False,
                                        "detail": "answer must be yes or no."})
            try:
                ok, detail = answer_awaiting(reply)
            except Exception as exc:
                ok, detail = False, f"{type(exc).__name__}: {exc}"
            log(f"{self.client_address[0]} /answer {reply} [{detail}]")
            # 200 either way: "nothing is waiting" is an answer, not a fault.
            return self.reply(200, {"ok": ok, "detail": detail})

        if self.path == "/kill":
            window = (data.get("id") or "").strip()
            try:
                ok, detail = kill_window(window)
            except Exception as exc:
                ok, detail = False, f"{type(exc).__name__}: {exc}"
            log(f"{self.client_address[0]} /kill {window!r} [{detail}]")
            return self.reply(200 if ok else 503, {"ok": ok, "detail": detail})

        if self.path == "/pending":
            choice = (data.get("action") or "new").strip().lower()
            project = (data.get("project") or "").strip() or None
            try:
                ok, detail = resolve_pending(choice, project)
            except Exception as exc:
                ok, detail = False, f"{type(exc).__name__}: {exc}"
            log(f"{self.client_address[0]} /pending {choice} [{detail}]")
            return self.reply(200 if ok else 503, {"ok": ok, "detail": detail})

        text = (data.get("text") or "").strip()
        if not text:
            return self.reply(400, {"error": "empty text"})

        # The build-mode UI addresses a window directly by id: the user is
        # looking at that exact session, so skip the routing and guards.
        window = (data.get("id") or "").strip()
        if window:
            try:
                ok, detail = deliver(text, window)
                # The session you just messaged is the one you're working in:
                # follow it with the voice target too.
                if ok:
                    write_target(window)
            except Exception as exc:
                ok, detail = False, f"{type(exc).__name__}: {exc}"
            log(f"{self.client_address[0]} -> {window} {text[:120]!r} [{detail}]")
            return self.reply(200, {"ok": ok, "detail": detail})

        # "code ..." / "claude ..." is an explicit instruction to use the
        # coding session, so it skips the home-control guard.
        try:
            ok, detail = send_to_claude(
                text,
                force=bool(data.get("force")),
                project=(data.get("project") or "").strip() or None,
                new_session=bool(data.get("new_session")),
            )
        except Exception as exc:
            ok, detail = False, f"{type(exc).__name__}: {exc}"

        log(f"{self.client_address[0]} -> {text[:120]!r} [{detail}]")
        # 200 whatever the outcome. "Claude is already working, say start a new
        # one or add it anyway" is not a server fault - it is a question, and
        # the prompt has been held pending the answer. Reporting it as 503 made
        # Home Assistant's conversation agent treat it as a failed call and
        # retry: on 26 August it sent the same prompt five times in twelve
        # seconds, re-parking it and speaking an acknowledgement each time.
        # The `ok` field carries the outcome; the status code carries transport
        # health, and only that.
        self.reply(200, {"ok": ok, "detail": detail})

    def log_message(self, *args):
        pass  # keep stdout clean; we log ourselves


def main():
    if not os.path.exists(TMUX):
        sys.exit(f"tmux not found at {TMUX}")
    log(f"listening on {HOST}:{PORT}, target session '{read_target()}'")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()


if __name__ == "__main__":
    main()
