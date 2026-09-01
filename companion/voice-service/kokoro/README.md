# Kokoro TTS (Wyoming, port 10201)

Kokoro 82M over ONNX, wrapped in a small Wyoming server (`server.py`) —
no wyoming-kokoro bridge is published, so this is the bridge. Runs as
launchd agent `com.hubbubb.kokoro`, logs to
`~/.claude/hooks/hubbubb-kokoro.{out,err}.log`.

- **Port**: 10201 (Piper stays on 10200; both can serve at once, so the
  cloud voice, Piper and Kokoro are all one dropdown apart in HA).
- **Model**: `~/.hubbubb-voice/kokoro/kokoro-v1.0.onnx` + `voices-v1.0.bin`
  (downloaded from the kokoro-onnx model-files release).
- **Voices**: all 54 in the v1.0 pack are advertised; the British males are
  `bm_george` (default), `bm_fable`, `bm_lewis`, `bm_daniel`.
- **Default voice / pace**: `--voice` and `--speed` (>1 is faster) in the
  plist's ProgramArguments. Edit, then `launchctl bootout gui/501/com.hubbubb.kokoro
  && launchctl bootstrap gui/501 ~/Library/LaunchAgents/com.hubbubb.kokoro.plist`
  — a plain kickstart reuses the old arguments.
- **Latency vs Piper**: ~1.0–1.2s warm for a sentence at 24kHz mono
  (first synthesis ~2s), vs Piper's ~0.8s at 22.05kHz. The trade is
  noticeably warmer, more natural speech for a few hundred milliseconds.

- **Streamed by sentence**: a reply is split into sentences and each one is
  synthesized and sent as the previous one is still arriving, inside a single
  audio-start/audio-stop. Total synthesis time is unchanged; time to the first
  word drops to the first sentence's share of it (2.5s → 0.8s on a
  three-sentence reply). The splitter refuses to break on decimals,
  abbreviations, times, initials and ellipses, and merges a short trailing
  fragment into the sentence before it.

`probe.py` is the self-check: Describe + a full sentence through each
British male, asserting audio length and level.
`../tests/sentence_check.py` checks the sentence splitter on its own
(`kokoro/.venv/bin/python tests/sentence_check.py` from `voice-service/`).
