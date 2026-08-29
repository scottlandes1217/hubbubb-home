# Reference companion: Claude Code over tmux

This is a complete, battle-tested companion daemon — the one the build
screen was developed against. It types voice-dictated and build-screen
prompts into Claude Code sessions running in tmux on a Mac, and implements
the whole protocol in [`docs/companion.md`](../docs/companion.md): session
list, transcripts, prompts, uploads, keypresses, model and permission
switching.

It is a **reference**, not a dependency. Hubbubb Home only speaks the HTTP
protocol; if your coding agent lives somewhere else — a Linux box, a
container, a different agent entirely — implement the endpoints and ignore
this file.

## Running it

    python3 claude-code-companion.py

- Listens on `0.0.0.0:8787` (`CLAUDE_VOICE_HOST` / `CLAUDE_VOICE_PORT`).
- A bearer token is created at `~/.claude/hooks/.voice-token` on first run;
  paste it into Hubbubb Home's companion options along with the URL.
- Only private-network clients are accepted, token or not.
- Projects offered for "+ New" live in `~/.claude/hooks/voice-projects.json`:
  `{"projects": {"my-app": "~/Projects/my-app"}}`.
- Expects `tmux` (path at the top of the file) with Claude Code sessions
  running inside it; a prompt targets the window the listener last targeted,
  or opens a new one per project.

Announcing finished turns back to the house is the other half: a Claude Code
Stop hook that POSTs `{"message": ...}` to
`http://<home-assistant>/api/webhook/hubbubb_home_message` (see
"Spoken announcements" in the protocol doc). Keep it to one or two spoken
sentences; honour `switch.<name>_agent_announcements`.

Run it at login however your platform likes; on macOS a `launchd` agent
pointed at the script is enough. Give the Python binary Full Disk Access if
your setup reads network volumes from launchd.
