# Hubbubb Home

A voice assistant for Home Assistant that you name yourself.

An animated ring that listens and answers. House memory that survives
restarts. Voice timers. An overnight sweep that finds the things that break
quietly. A Hubbubb connection for your records and correspondence. And, if you
run a coding agent somewhere, a build screen that drives it from the wall.

Call it Athena, or Jeeves, or your dog's name. Nothing in it is branded with
an assistant's name until you type one.

---

## Install

1. **HACS → Integrations → ⋮ → Custom repositories.** Add this repository as
   an *Integration*, then install it and restart Home Assistant.
2. **Settings → Devices & Services → Add Integration → Hubbubb Home.**
3. Type a name. Everything else on that screen is optional.
4. Restart once more so the voice sentences load.

That is the whole setup. No YAML, no Lovelace resources to register, no
helpers to create — the integration makes its own and serves its own cards.

### Give it a brain

Hubbubb Home does not talk to a language model itself, on purpose. Home
Assistant already ships good LLM integrations, so instead of shipping a
fourteenth way to hold an API key, this registers an **LLM API** that they
merge in.

Set up **Anthropic** (Settings → Devices & Services → Add Integration →
Anthropic), then in its conversation options tick **both**:

- **Assist** — gives the model your lights, locks and thermostats
- **Hubbubb Home** — gives it memory, timers, Hubbubb, and its name

Point your voice pipeline at that conversation agent and you are done. Any
provider works; the tools are the same.

---

## What you get

| | |
|---|---|
| **`switch.<name>_build_mode`** | Hands the dashboard over to the build screen |
| **`switch.<name>_agent_announcements`** | Whether finished agent turns are spoken aloud |
| **`switch.<name>_message_watch`** | Whether Hubbubb's inbox is watched |
| **`sensor.<name>_timers`** | Every running countdown, in its attributes |
| **`sensor.<name>_findings`** | What last night's sweep turned up |

Entity IDs take the name you chose, so an assistant called Athena gets
`switch.athena_build_mode`.

### Cards

| Card | Type |
|---|---|
| Animated listening ring, with the build screen | `custom:hubbubb-ring-card` |
| Apple TV / Siri Remote | `custom:hubbubb-remote-card` |
| Voice timer countdowns | `custom:hubbubb-timers-card` |

They are served by the integration at a versioned URL, so a HACS update can
never leave a stale bundle in someone's browser cache. There is nothing to add
to your Lovelace resources.

The build panel takes a height, or floats over the whole dashboard. Panel and
terminal colours are settable, as are the five state colours of the ring.

A starter dashboard is in [`docs/dashboard.yaml`](docs/dashboard.yaml).

### Voice

Eleven sentence intents are answered locally, without waking a language model
— because "set a timer for ten minutes" should not cost a frontier model call,
and paying for one makes the house feel slower than the speaker it replaced.

> "Remember that the pool guy comes on Tuesdays"
> "What do you remember about the pool?"
> "Set a timer for ten minutes" · "How long's left?" · "Add five minutes"
> "How's the house?" · "Did anything go quiet?"
> "Build mode on"

Everything else falls through to your conversation agent.

### Memory

One short sentence per fact, in SQLite FTS5 next to your configuration. Recall
is asked in the words of the question ("what do you remember about the pool")
and not the words of the fact ("the pool guy comes on tuesdays"), which is why
it is a ranked full-text search rather than a substring match.

Reachable three ways: by voice, as `hubbubb_home.remember` / `.recall` /
`.forget` services, and as tools your language model can call on its own.

### The overnight sweep

At half three each morning, two checks:

- **dead** — anything parked at `unavailable`/`unknown` for more than six hours
- **quiet** — anything that used to change on most days and now changes on none

The second one is the point. The failure this catches is not a thing breaking
loudly; it is a television that reports `off` rather than `unavailable` when
its token dies, and is noticed four days later. Nothing else alerts on that.

It only ever reports — a notification, a sensor, and a line in the morning
briefing. It changes nothing. Silence expected findings in the options, never
in code.

### Hubbubb

Standard OAuth2 client-credentials, then MCP over Streamable HTTP. Create a
client ID and secret in Hubbubb, paste them into the setup screen, and the
model gets an `ask_hubbubb` tool it can put plain-English questions to.

### The companion (optional)

The build screen drives a real coding agent in a real terminal, which Home
Assistant cannot host. If you run the companion daemon on the machine where
that agent lives, put its URL in the options and the build screen lights up.

Without one, everything else works exactly the same. See
[`docs/companion.md`](docs/companion.md) for the protocol.

---

## Development

    npm install
    npm run build     # cards -> custom_components/hubbubb_home/www/
    npm test          # card unit tests + the integration's logic checks

## Licence

MIT
