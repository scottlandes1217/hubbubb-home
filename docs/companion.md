# The companion protocol

The build screen shows a real coding-agent session — a terminal transcript,
the tool calls, a prompt box, screenshot upload. Home Assistant cannot host
that: it drives a terminal on a developer's machine. So it lives behind a
small HTTP daemon, and Hubbubb Home forwards to it.

**None of this is required.** With no companion configured, every other
feature works and the build screen says so instead of hanging.

## Configuring

Options → Companion → URL, and a bearer token if the daemon wants one. It is
checked at setup: a URL that does not answer `GET /health` is rejected on the
form rather than failing silently at three in the morning.

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

## Errors

A companion that is configured but unreachable answers `status: 503` with a
readable `detail`. That is deliberate: the build screen should say what is
wrong, not spin.
