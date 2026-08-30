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
