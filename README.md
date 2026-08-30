# Hubbubb Home

A voice assistant for Home Assistant that you name yourself.

An animated ring that listens and answers. House memory that survives
restarts. Voice timers. An overnight sweep that finds the things that break
quietly. A Hubbubb connection for your records and correspondence. And, if you
run a coding agent somewhere, a build screen that drives it from the wall.

Give it a companion machine and it goes further: speech-to-text that never
leaves the house, voice fingerprints so it knows who is talking and keeps
memories per person, tap-on-your-phone verification before anything sensitive,
a small local model as the everyday brain with your coding agent as the
escape hatch — and wake words it trains for itself when you ask for a new
name out loud.

Call it Athena, or Jeeves, or your dog's name. Nothing in it is branded with
an assistant's name until you type one.

![The ring on a dashboard](docs/images/ring.png)

---

## Install

1. **HACS → Integrations → ⋮ → Custom repositories.** Add this repository as
   an *Integration*, then install it and restart Home Assistant.
   *(Not in HACS's own list yet — see [`docs/hacs-submission.md`](docs/hacs-submission.md).)*
2. **Settings → Devices & Services → Add Integration → Hubbubb Home.**
3. Type a name. Everything else on that screen is optional.
4. Restart once more so the voice sentences load.

That is the whole setup. No YAML, no Lovelace resources to register, no
helpers to create — the integration makes its own and serves its own cards.

### What needs what

Everything degrades gracefully: each row below is off (and harmless) until
its requirement is configured, and the core works with nothing but Home
Assistant.

| Feature | Needs |
|---|---|
| Ring, timers, memory, sentences, sweep, briefing | Home Assistant only |
| A conversational brain | Any HA LLM integration (Anthropic, Ollama, …) with the **Assist** + **Hubbubb Home** APIs ticked |
| Hubbubb records and inbox | A Hubbubb OAuth2 client ID + secret |
| Apple TV voice, native Music | HA's `apple_tv` integration; Apple Music subscription for music |
| Build screen, coding-agent handoff | The companion daemon on the machine running your coding agent |
| Local speech-to-text + speaker identification | The voice service (`companion/voice-service/`) on a machine with a few GB free — Apple Silicon or any modern x86; Python 3.12 via `uv` |
| A local model as the brain | [Ollama](https://ollama.com) on that same machine (a 3B model wants ~4 GB RAM), reachable from HA (`OLLAMA_HOST=0.0.0.0`) |
| Custom wake words, trained by voice | The voice service + its `wakeword/` trainer (~3 GB of cached audio the first run) |
| Verified people (tap-to-approve) | The HA companion app on each person's phone, or any actionable-notification target |

<p align="center">
  <img src="docs/images/setup.png" alt="Naming your assistant" width="49%">
  <img src="docs/images/editor.png" alt="The card editor" width="49%">
</p>

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

The remote card's volume keys use plain `media_player` volume on its
`volume_entity` (usually your TV). Point them at the Apple TV itself and
you will want the separate `apple_tv_hid` custom component, which the card
prefers automatically when installed — the Apple TV ignores core's volume
services over HDMI.

Add the ring card from the dashboard editor and it wires itself up: it finds
your voice satellite and the three switches, and reads the assistant's name
out of them. Everything else has a sensible default.

<p align="center">
  <img src="docs/images/build.png" alt="Build mode" width="49%">
  <img src="docs/images/timers.png" alt="Voice timers" width="49%">
</p>

### Two animations

**Hubbubb** (the default) is a foam. A core bubble with smaller ones stuck to
its skin, and smaller ones again riding those. It is a small physics toy
rather than a loop: bubbles never overlap, they stick where they touch, ones
of a like size fuse into bigger ones, and a bubble that grows too big bursts
and leaves a gap that new ones grow into. Speaking releases bubbles, which
float off and pop — so the ring empties while your assistant talks and fills
back in when it stops.

**Jarvis v1** is the original: block segments, a wireframe core and a field of
motes. Pick either in the card editor.

The slider marked *how many bubbles* sets the population — and doubles as the
mote size for Jarvis v1, since the two never run at once.

The build panel takes a height, or floats over the whole dashboard. Panel and
terminal colours are settable, as are the five state colours of the ring.

They are served by the integration at a versioned URL, so a HACS update can
never leave a stale bundle in someone's browser cache. There is nothing to add
to your Lovelace resources.

A starter dashboard is in [`docs/dashboard.yaml`](docs/dashboard.yaml).

### Voice

A family of sentence intents is answered locally, without waking a language
model — because "set a timer for ten minutes" should not cost a frontier model
call, and paying for one makes the house feel slower than the speaker it
replaced.

> "Remember that the pool guy comes on Tuesdays"
> "What do you remember about the pool?"
> "Set a timer for ten minutes" · "How long's left?" · "Add five minutes"
> "How's the house?" · "Did anything go quiet?"
> "This is Scott" · "Who am I?"
> "Build mode on"

Everything else falls through to your conversation agent.

### Announcements and quiet hours

Finished agent turns, training results, and anything else POSTed to the
message webhook follow one policy: an answer to a spoken question goes back
to the satellite you asked from; with the announcements switch on, other
messages go to whichever dashboard screen you're actually at; with it off,
they become a silent phone push. Between the **quiet hours** (announcement
options, 22:00–08:00 by default, set both times equal to disable) nothing is
spoken or shown at all — only the silent push. Timers and the scheduled
morning briefing ignore quiet hours on purpose: a 3am timer was set on
purpose.

The **morning briefing** (its own options section) speaks the weather, the
day's calendar and the overnight sweep's count at a time you pick, through
the satellites or speakers you pick.

### Apple TV, including music

Pick your Apple TVs in the options (they come from Home Assistant's own
`apple_tv` integration) and four more spoken things start working, answered
locally like the rest:

> "Play Hello by Adele" · "Play a Fleetwood Mac station"
> "Watch something on Netflix" · "Open YouTube on the bedroom apple tv"
> "Pause the apple tv"

Music plays **natively in the tvOS Music app** — an iTunes catalog search
resolves what you said to a music.apple.com link, the Apple TV opens it, and
a few remote keypresses handle what tvOS will not autoplay. The result is a
real Music-app session: the physical remote controls it and Apple Music
autoplay carries on when the song ends. Needs an Apple Music subscription on
the Apple TV.

Each box's spoken room name is its Home Assistant area ("…on the bedroom
apple tv"); with one Apple TV you never need to say a room. The sentence
file is generated from your list, so changing it needs the usual restart.

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
[`docs/companion.md`](docs/companion.md) for the protocol, and
[`companion/`](companion/README.md) for a complete reference daemon
(Claude Code over tmux). With a companion configured the integration also
registers a **conversation agent** named after your assistant: point a
voice pipeline at it and anything Home Assistant cannot answer itself is
typed straight into your coding agent, with the reply spoken when the turn
actually finishes.

### Speaker identification (optional)

The voice pipeline hands every agent a transcript with no idea who said it.
The companion machine's **voice service** (see `companion/voice-service/`)
does hear the audio: it transcribes locally and compares each utterance to
the household's enrolled voices, then posts who it heard to the
`hubbubb_home_speaker` webhook. Put the service's URL in the *Speaker
identification* options section and:

- memories become **per-person** — "remember that I like the heat at 68"
  files under whoever said it, house facts stay shared;
- the language model is told who is speaking (or told to ask, when the house
  isn't sure — "this is Scott" answers it and trains the voice profile);
- coding-agent handoffs are prefixed with the speaker's name.

The *device owners* map is the no-ML fallback: an assist device in someone's
own room probably hears them. Leave the URL blank and all of this is off —
memory is household-wide, exactly as before.

### Verified people (optional)

Voice identification says who is *probably* speaking — a recording, the TV,
or a good impression can pass it — so by itself it authorizes nothing. Fill
in the *verified people* map (`Scott: notify.mobile_app_scotts_iphone`, one
person per line) and anything touching Hubbubb data by voice becomes a
two-step: voice identifies, a tap on that person's own device authorizes.
When the house is at least 90% sure who is asking (or they have just said
who they are), it sends an Approve/Deny notification to their device and
waits; any less sure and it asks who is speaking instead of guessing whose
device to ring. Denials, timeouts and unknown devices all fail closed, one
approval covers follow-ups for ten minutes, and enrolling a listed person's
voice takes the same tap — so a stranger cannot train themselves into
someone else's profile. The *shared token* closes the plumbing: speaker
events that do not carry it are dropped.

And people can act as **themselves** in Hubbubb: give each person their own
client in the Hubbubb options (one line per person,
`Name: client_id : client_secret` — each client belongs to that person's own
Hubbubb user). With any line set, voice requests to Hubbubb run only as the
verified speaker — someone with no linked account gets a polite no rather
than the shared client, so the CRM's own permissions are the boundary and a
reply sent by voice is sent as the person who asked. The dashboard's inbox
watch and the `ask_hubbubb` service stay on the shared client: they sit
behind Home Assistant's own login, with no speaker to attribute a call to.

### A local model as the house brain (optional)

Small local models are enough for most of a house's day. Run one with
[Ollama](https://ollama.com), add Home Assistant's own Ollama integration,
and give it both the **Assist** and **Hubbubb Home** APIs: it gets the house,
the memories, the timers — and a `hand_to_companion` tool, so anything beyond
it (multi-step work, coding, research) is handed to the coding agent, which
answers aloud later through the message webhook. Point your voice pipeline at
the Ollama agent to keep everyday requests fast, private and free, with the
frontier model as the escape hatch rather than the default.

### Wake words, including ones it trains itself (optional)

The wake word lives on the satellite, before any audio leaves it, so it is
set per device — each puck can answer to a different name, and a Voice PE
runs two wake-word models at once. The stock choices are a dropdown on the
device page; a custom phrase means training a small on-device model, and the
voice service can do that **by voice**: say "train yourself a new wake word
called Athena" and the `train_wake_word` tool starts the run on the
companion machine — synthetic voices speak the phrase thousands of ways, a
model trains against real negative corpora, and the house announces out loud
when the finished model is ready to load. One run at a time, an hour or two
each, ~3 GB of audio cached after the first. Loading the model onto a puck
is deliberately a human step: an ESPHome reflash, walked through in
[`companion/voice-service/WAKEWORD.md`](companion/voice-service/WAKEWORD.md),
along with honest advice about single-word wake words and phrases the
training voices cannot pronounce.

---

## Development

    npm install
    npm run build     # cards -> custom_components/hubbubb_home/www/
    npm test          # card unit tests + the integration's logic checks

Two of those checks guard bugs that are invisible in a short run:

`cards/test/pack.mjs` asserts the foam's geometric invariants — after the
solver runs, no two bubbles intersect, nothing sits inside the core, and a
merge conserves area rather than radius.

`cards/test/foam.mjs` runs the whole life cycle for 150 simulated seconds and
asserts the **last** window is still busy. An early version looked right for
thirty seconds and then froze solid, because the only thing that could end a
bubble was growing into the ceiling — and once the packing settles, nothing is
pressed hard enough against anything else to grow.

## Licence

MIT — see [LICENSE](LICENSE).
