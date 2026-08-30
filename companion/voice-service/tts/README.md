# Local text-to-speech

Piper voices behind a Wyoming server, so replies are spoken without a cloud
round-trip: lower latency (~0.8s for a full sentence on this machine, and it
streams — playback starts sooner), works offline, costs nothing per use. The
cloud voice stays selectable in Home Assistant's pipeline whenever wanted.

## What runs

- launchd agent **`com.hubbubb.tts`** (plist in `~/Library/LaunchAgents/`),
  logs to `~/.claude/hooks/hubbubb-tts.{out,err}.log`.
- `wyoming-piper` (own uv venv in this directory) serving Wyoming TTS on
  **port 10200**, voices in `~/.hubbubb-voice/tts-voices/`.
- Wire-up: Home Assistant → Wyoming integration → host `192.168.0.201`,
  port `10200` → pick the new TTS entity in the voice pipeline.

## Voices

Downloaded and ready (British, male — the butler shelf):

| Voice | Character |
|---|---|
| `en_GB-alan-medium` (default) | measured RP-ish |
| `en_GB-northern_english_male-medium` | warmer, northern |
| `en_GB-aru-medium` | deeper |

Change the default: edit `--voice` in the plist, then
`launchctl kickstart -k gui/501/com.hubbubb.tts`. Per-utterance voices can
also be chosen by the caller, and HA's TTS entity exposes the voice picker.

Add a voice: the server advertises the whole official Piper catalog and
downloads a voice on first use into the data dir — or fetch
`.onnx` + `.onnx.json` from `huggingface.co/rhasspy/piper-voices` by hand.

Restart after changes: `launchctl kickstart -k gui/501/com.hubbubb.tts`.
