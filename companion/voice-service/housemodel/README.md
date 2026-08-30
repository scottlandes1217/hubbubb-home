# The house model

LoRA-tunes the local 3B on *this* house — its device names, rooms,
command phrasings, tool-call discipline, and the dismissal manners the
stock model fumbles — and installs the result in ollama as
**`jarvis-house`**. The stock `llama3.2:3b` is never modified.

    .venv/bin/python train_house.py --smoke   # prove the chain, minutes
    .venv/bin/python train_house.py           # the real run

`--smoke` runs the entire chain — dataset from the live registries, a
~20-iteration adapter, fuse + dequantize, GGUF export, `ollama create`,
one answered chat — so every moving part is proven before you spend an
hour on a real run. A full run (600 iterations over a few hundred
house-generated conversations) is roughly **45–90 minutes** on an
Apple-Silicon 16GB machine, most of it in training and the fp16
fuse/quantize shuffle. Expect several GB of temporary disk under
`~/.hubbubb-voice/housemodel/`.

## What the data teaches

`dataset.py` reads the registries (read-only) and synthesizes, for every
assist-exposed entity: on/off phrasings, brightness in both "turn X to 20
percent" and "set X brightness" forms, area-qualified commands, and
status question→tool→spoken-answer conversations — each assistant turn in
the exact `{"name": ..., "parameters": ...}` shape ollama's llama3.2
template parses into native tool calls. Plus plain-speech pairs (garbled
fragments → "say that again", dismissals → brief acknowledgement — the
anti-JSON-in-prose lesson) and escalation examples routed to
`hand_to_companion`, including any the nightly pass has curated into
`~/.claude/hooks/finetune/pairs.jsonl`.

## Switching the house over

Point the Home Assistant Ollama conversation subentry's model at
`jarvis-house`. That is a deliberate manual step: test first.

## Retraining

Re-run `train_house.py` after renaming or adding devices, or once the
nightly's curated pairs have grown meaningfully. The dataset regenerates
from the live registries every run, so retraining *is* the sync.

## Honest quality notes

- LoRA on synthetic pairs teaches **form**: right tool, right argument
  shape, house names spelled the house's way, plain speech for non-tool
  turns. This is exactly where the stock 3B fails (leaked tool syntax,
  fumbled brightness calls), so it is worth teaching.
- It does not add reasoning, and it cannot know **live state** — that
  still rides the prompt from Home Assistant on every turn. The speed win
  is indirect: a model that needs less hand-holding tolerates a leaner
  prompt and fewer retry round-trips, not a smaller state payload.
- Overfitting is the real risk at this dataset size: the model may get
  worse at everything that is not the house. Before switching the
  pipeline over, ask `jarvis-house` a dozen off-script things (weather
  chat, a math question, a Hubbubb-ish request) next to `llama3.2:3b`
  and compare; if it parrots tool calls at small talk, lower `--iters`
  and retrain.
- Judge it live for a few days with the pipeline pointed at it; the
  stock model is one dropdown away the whole time.
