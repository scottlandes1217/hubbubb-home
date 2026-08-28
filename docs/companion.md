# The companion protocol

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

Answer with JSON. A non-2xx status, or a body carrying `{"ok": false,
"detail": "..."}`, is surfaced to the card as an error rather than a blank
screen. Anything that is not JSON comes back as `{"content": "<the body>"}`.

## Spoken announcements

When an agent turn finishes and should be spoken aloud, POST it to Home
Assistant:

    POST http://<home-assistant>/api/webhook/hubbubb_home_message
    {"message": "The build finished. Tests pass."}

No token needed — webhooks are unauthenticated, which is why the integration
registers this one **local-only**. The integration relays it onto the event
bus and every open dashboard hears it; the ring cards elect exactly one
screen (the least-idle one) to speak, so the same sentence does not come out
of every panel in the house at once.

## The announcement toggle

`switch.<name>_agent_announcements` is owned by the integration but enforced by
the companion — Hubbubb Home never sees an agent turn finish, so it cannot
decide whether to speak one. Read the switch and honour it: post to the
webhook only while it is on.

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
