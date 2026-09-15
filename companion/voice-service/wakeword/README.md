# Local wake-word training

Trains a microWakeWord model for any phrase entirely on this machine — the
same recipe as the official Colab notebook (piper-generated positives,
augmented spectrograms, mixednet, quantized streaming tflite), as one
non-interactive command.

## Setup (once)

```sh
cd companion/voice-service/wakeword
uv venv --python 3.12 .venv          # system 3.14 has no tensorflow wheels
uv pip install --python .venv/bin/python -r requirements.txt
git clone https://github.com/kahrendt/microWakeWord \
    ~/.hubbubb-voice/wakewords/cache/microWakeWord
uv pip install --python .venv/bin/python -e ~/.hubbubb-voice/wakewords/cache/microWakeWord
```

The editable install matters: the PyPI/git wheel of microwakeword omits the
`microwakeword.audio` subpackage. `datasets<3.0` (pinned via microWakeWord's
own deps plus our requirements) is needed because newer `datasets` wants
torchcodec+ffmpeg to decode audio.

## Usage

```sh
.venv/bin/python train.py "athena" --smoke      # minutes: proves the pipeline
.venv/bin/python train.py "athena"              # real model, hours + ~3 GB downloads
```

Success prints `TRAINED <path>.json` last and exits 0. The `.json` manifest +
`.tflite` land in `~/.hubbubb-voice/wakewords/<slug>/` (override with
`--out`). Host both files somewhere the puck can fetch (a GitHub raw URL
works) and reference the manifest from the Voice PE's ESPHome config —
see ../WAKEWORD.md.

Everything downloadable (piper + its voice model, the official negative
feature sets, background audio) is cached once under
`~/.hubbubb-voice/wakewords/cache/`; generated positives are cached per
phrase, so retraining with different `--steps` is incremental.

## What --smoke skips

- 40 positive clips instead of 1000, 250 training steps instead of 10000.
- The official negative feature sets (speech, dinner_party, no_speech,
  ~3 GB) — it piper-speaks a dozen household sentences as negatives and
  synthesizes noise for the ambient sets instead.
- Background-noise augmentation (audioset download); room impulses still
  apply (piper-sample-generator ships them).

A smoke model detects *something* but false-triggers freely — never ship it.

## Fixing a model the television keeps waking

The wrong instinct is to slice an evening of telly into the negatives and
retrain. Almost every one of those clips is already scored near zero, so the
model is right about them and learns nothing; on 2 September that produced a
model that tested at 0.18 false accepts an hour and then woke 3.3 times an
hour in the room.

Two things actually matter: train on the moments that nearly fired, and
measure on audio the model has never seen.

```sh
# 1. Record from the puck itself, telly on, an evening of it. Hours, not
#    minutes: at 3 wakes an hour, 20 minutes holds about one example.
.venv/bin/python record.py 36000 ~/.hubbubb-voice/room/tv-long.wav --puck 192.168.0.200
.venv/bin/python record.py 3600  ~/.hubbubb-voice/room/tv-heldout.wav --puck 192.168.0.200

# 2. Mine the near-misses out of it with the model you are trying to beat.
.venv/bin/python harvest.py hard ~/.hubbubb-voice/room/tv-long.wav     ~/.hubbubb-voice/room/hard_negatives/ ~/.claude/hooks/voice-pe/jarvis.tflite
.venv/bin/python harvest.py chunks ~/.hubbubb-voice/room/tv-heldout.wav     ~/.hubbubb-voice/room/eval_negatives/

# 3. Retrain on those, scored against the hour that was held back.
.venv/bin/python train.py "jarvis" --out ~/.hubbubb-voice/wakewords/jarvis3     --extra-positives ~/.hubbubb-voice/room/positive_clips     --extra-negatives ~/.hubbubb-voice/room/hard_negatives     --eval-negatives  ~/.hubbubb-voice/room/eval_negatives
```

`harvest.py hard` runs the model over the recording with the puck's own rule
(a moving average over 5 slices, 25 slices of refractory) and keeps the 1.5 s
ending at every moment that scored above 0.4 — a few hundred windows out of
ten hours. It prints what the recording would have cost you at each cutoff,
which is the same number you can measure from `assist_satellite` history, so
the two are comparable.

Without `--eval-negatives` the cutoff table at the end of a run is scored on
the training negatives; `train.py` now says so in a warning rather than
printing a flattering number silently.

Keep real positives in the loop (`--extra-positives`) and watch the
false-reject column too: pushing false accepts down without them buys a quiet
television and a wake word that no longer hears you.

**Record everything from the same microphone.** Puck audio comes in around
six times quieter than the laptop's, because it is the raw far-field level
the wake model actually works at rather than something an AGC has flattered.
That is what makes it the better training data, and it is also why a set
mixing the two teaches the model that loudness predicts the wake word. If you
switch to `--puck`, re-record the positives with it too.

## Full-quality runs and tuning

The full run matches the notebook's defaults. Honest expectations: the
notebook's own author warns first attempts often need iteration. The knobs:

- `--samples 2000` and more phonetic spellings of the phrase (edit the call:
  piper handles "khum_puter"-style spellings better than unusual real words).
- `--steps 20000` for a firmer decision boundary.
- `--cutoff` sets the manifest's probability_cutoff (default 0.97). After a
  run, the streaming-quantized test in `<out>/work/trained/` prints
  false-reject / false-accept-per-hour at each cutoff — raise it if the puck
  false-triggers, lower if it misses wakes.
- Single-word phrases false-trigger far more than two-word ones; start them
  at the puck's lower sensitivity.
- Mixing real recordings of the household into `work/positive_clips/` before
  the feature step biases the model toward the voices that live here.

Quality versus the official notebook: same code, same data sources, so a
full run here should match a Colab run with the same settings — this CPU is
simply slower per step, and the notebook's GPU invites more experimentation
per evening.
