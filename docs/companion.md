# The companion protocol

*A complete reference implementation — Claude Code over tmux on a Mac —
lives in [`companion/`](../companion/README.md).*

The build screen shows a real coding-agent session — a terminal transcript,
the tool calls, a prompt box, screenshot upload. Home Assistant cannot host
that: it drives a terminal on a developer's machine. So it lives behind a
small HTTP daemon, and Hubbubb Home forwards to it.

**None of this is required.** With no companion configured, every other
feature works and the build screen says so instead of hanging.

## Configuring

Options → Companion → URL, and a bearer token if the daemon wants one. Setup
makes two calls: `GET /health` to prove something is listening, then
`GET /status` to prove it will actually talk to you. `/health` is deliberately
unauthenticated — it is the reachability check — so it is `/status` that
catches a wrong token, and it catches it on the form rather than as a 503 in
the build panel an hour later.

Both are GETs. They are reads, and a companion that only answers POST on
those paths will be reported as unreachable.

Put it on a private address. It executes things.

## Endpoints

Hubbubb Home exposes each of these as a service that returns
`{status, content}`, which is the shape the ring card reads.

| Service | Method | Endpoint | Body |
|---|---|---|---|
| — | `GET` | `/health` | — |
| `hubbubb_home.agent_status` | `GET` | `/status` | — |
| `hubbubb_home.agent_transcript` | `GET` | `/transcript` | `window` |
| `hubbubb_home.agent_prompt_direct` | `POST` | `/prompt` | `text` |
| `hubbubb_home.agent_start_session` | `POST` | `/session` | `project` |
| `hubbubb_home.agent_target_window` | `POST` | `/target` | `id` |
| `hubbubb_home.agent_upload` | `POST` | `/upload` | `name`, `data` (base64) |
| `hubbubb_home.agent_key` | `POST` | `/key` | `key` |
| `hubbubb_home.agent_kill` | `POST` | `/kill` | `window` |
| — | `POST` | `/review` | `brief`, `hours`, `projects` |

Answer with JSON. A non-2xx status, or a body carrying `{"ok": false,
"detail": "..."}`, is surfaced to the card as an error rather than a blank
screen. Anything that is not JSON comes back as `{"content": "<the body>"}`.

## The nightly review

`/review` is the one endpoint Hubbubb Home calls on a schedule rather than
because somebody tapped something. It exists because two things live on the
developer's machine and cannot be moved: the transcripts of your coding
sessions, and the agent CLI itself.

Everything else about the review belongs in Home Assistant - when it runs,
whether it runs, what the model is asked, what is kept, what is spoken. So
the request carries the whole brief, including the house inventory, and the
companion adds only what it alone can supply:

    POST /review
    {"brief": "<task, rules and inventory>", "hours": 24,
     "projects": ["jarvis", "claude-hooks"]}

    -> {"ok": true, "detail": "ok", "report": "<the reply>",
        "digest_chars": 11369}

The companion appends `--- digest of the last N hours ---` and the digest to
the brief, runs it through the agent, and returns the reply verbatim. It does
not parse the report: staging drafts, counting findings and storing history
are Home Assistant's job, so changing any of that is a Hubbubb Home update
rather than a companion one.

`projects` filters which transcript folders are read; omit it for all of them.
Lines that look like pasted credentials are dropped from the digest, and the
count of dropped lines is reported in it.

Answer `{"ok": false, "detail": "..."}` if there is no agent CLI to run - the
review is then recorded as skipped, with the reason, rather than as a night
with no findings.

## Projects

`/status` answers `{"sessions": [...], "projects": [...]}`. `projects` is the
list of project names a session may be started in — the folders on your
machine you are willing to have an agent work in. It is the companion's to
decide (a config file next to the daemon, a scan of a projects directory,
whatever suits), because only the companion knows what is on that disk.

The card shows every project the companion offers as a chip under **+ New**.
To show only some of them on a particular dashboard — the wall tablet gets
two, your desk gets everything — set `build_projects` on the card (in the
visual editor, or YAML), which narrows the companion's list without touching
it. `/session` receives the chosen name back as `project`.

## Spoken announcements

When an agent turn finishes, POST it to Home Assistant:

    POST http://<home-assistant>/api/webhook/hubbubb_home_message
    {"message": "The build finished. Tests pass."}
    {"message": "Should I delete the old table?", "ask": true}

No token needed — webhooks are unauthenticated, which is why the integration
registers this one **local-only**. Post every finished turn; the integration
owns the routing:

- **`ask: true`** — the turn is the answer to a question somebody asked a
  voice satellite, so it is announced on the satellites: that is where they
  were standing when they asked. This is the one case that ignores the
  announcement switch. Mark only a prompt that opened its own session as an
  ask — in a spoken working session every turn is dictated, and marking
  those narrates the whole afternoon.
- **`switch.<name>_agent_announcements` on** — the message goes to every
  open dashboard and the ring cards elect exactly one screen (the least-idle
  one) to speak it, so the same sentence does not come out of every panel in
  the house at once.
- **Switch off** — a quiet push through the notify service configured in
  the options, so silence in the house does not mean the message was lost.

## The conversation agent

The integration also registers a conversation agent (named after the
assistant) whenever a companion URL is configured. Point a voice pipeline at
it — with "prefer handling commands locally" on — and whatever Home
Assistant's own intent engine cannot parse is POSTed to `/prompt` as
`{"text": ...}`. Answer 2xx quickly and type the sentence into the agent;
the spoken reply is whatever short acknowledgement is configured, and the
real answer arrives later through the webhook above.

Two things should override it, both learned the hard way:

- **The agent is waiting on the user** — a permission prompt. Nobody hearing
  it means nobody acts, and the session sits there.
- **The agent asked a question and cannot continue** without an answer.

What should *not* override it is "the turn was dictated". In a spoken working
session every turn is dictated, so yielding to that narrates the whole
afternoon with the bell switched off.

## Errors

A companion that is configured but unreachable answers `status: 503` with a
readable `detail`. That is deliberate: the build screen should say what is
wrong, not spin.
