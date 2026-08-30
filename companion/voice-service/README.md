# Voice service: local STT + speaker identification

One process on the household computer, two ports:

- **10300** — Wyoming speech-to-text for Home Assistant's voice pipeline
  (faster-whisper, int8, on-CPU; a short utterance transcribes in ~0.3s on
  Apple Silicon).
- **10301** — admin HTTP: `GET /health`, `GET /last` (last utterance: text,
  matched person, confidence, per-person similarities), `POST /label
  {"person": "Scott"}` (enroll the last utterance as that person's voice),
  `GET /people`, `POST /people/delete {"person": "..."}`.

Every utterance is also fingerprinted (resemblyzer) and matched against the
enrolled voices. The result is written to `~/.hubbubb-voice/last.json` and
POSTed to the Home Assistant webhook `hubbubb_home_speaker`, so the
integration knows who spoke without the audio ever leaving the house.

Thresholds live in `~/.hubbubb-voice/profiles.json` (`confident` 0.75,
`uncertain` 0.60 by default) — tune them there, not in code; microphones and
rooms differ.

## Install

```sh
cd companion/voice-service
uv venv --python 3.12 .venv          # torch/ctranslate2 want <=3.12
uv pip install --python .venv/bin/python -r requirements.txt
.venv/bin/python tests/self_check.py # optional; proves STT + speaker matching
```

Run it once by hand to download the models:

```sh
.venv/bin/python service.py --webhook http://YOUR_HA_HOST/api/webhook/hubbubb_home_speaker
```

### As a launchd service (macOS)

Copy `com.hubbubb.voice-service.plist` to `~/Library/LaunchAgents/`, fix the
two `YOURNAME` paths and the webhook host, then:

```sh
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.hubbubb.voice-service.plist
```

## Point Home Assistant at it

1. Settings → Devices & Services → Add integration → **Wyoming Protocol** →
   host = this computer's IP, port = **10300**.
2. Settings → Voice assistants → your pipeline → Speech-to-text → pick the
   new **hubbubb-voice** entry.

That's the whole switch; setting the pipeline back to its old STT undoes it.

## Enrolling voices

Speak to any satellite, then either say the enrollment phrase (the
integration's "this is Scott" intent calls `POST /label`), or by hand:

```sh
curl -s localhost:10301/last                                  # what it heard
curl -s -X POST localhost:10301/label -d '{"person":"Scott"}' # that was Scott
```

A handful of utterances per person is enough to start; each person keeps
their latest 40 fingerprints and the centroid tracks their voice over time.
