# The house model

LoRA-tunes the local brain (`qwen3.6:35b-a3b`, a 35B mixture-of-experts)
on *this* house - its device names, rooms, tool-call discipline, the
dismissal manners - and on what Claude answered when the local model
escalated. The result is auditioned against the model serving now and
only a clean win is installed in ollama as **`jarvis-house`**. The stock
`qwen3.6:35b-a3b` is never modified.

    uv venv .venv && VIRTUAL_ENV=.venv uv pip install mlx-lm==0.32.0   # once
    /usr/bin/python3 train_house.py --smoke   # prove the chain, ~30 min
    /usr/bin/python3 train_house.py           # the real run
    /usr/bin/python3 train_house.py --nightly # what launchd runs at 01:30
    python3 test_eval_house.py                # the gate's scoring

Run it with `/usr/bin/python3`: dataset and eval read the Home Assistant
share, which launchd lets only that binary see (Full Disk Access). The mlx
steps run in `.venv` on their own.

## The chain, and why it is shaped like this

1. `dataset.py` - native Qwen tool calls (empty content + `tool_calls`),
   CURRICULUM.md's fixes (grounded status answers, a no-tool slice,
   clarifying questions), and `kind: "escalation"` rows from
   `~/.claude/hooks/finetune/pairs.jsonl`: Claude's answer becomes the
   training target; rows that name a device, or have no answer, teach the
   handoff instead.
2. mlx_lm LoRA on `mlx-community/Qwen3.6-35B-A3B-4bit` - every linear layer
   in the last 8 blocks except the routed experts. ~36 GB peak; ollama's
   models are unloaded first, so Jarvis is offline while it trains.
3. The deltas are added to the original bf16 checkpoint
   (`Qwen/Qwen3.6-35B-A3B`, ~70 GB in the HF cache). Measured dead ends on
   ollama 0.33: `mlx_lm fuse` output carries mlx tensor names the
   quantizer rejects, and safetensors `ADAPTER` import does not support
   qwen35moe. The routed experts are excluded because mlx restacks them;
   every other adapted tensor maps 1:1.
4. `ollama create jarvis-house-candidate --quantize q4_K_M`.
5. `eval_house.py` - 20+ held-out prompts through `/api/chat` with the
   tools, candidate vs serving model. Hard checks: no narration on a
   tool-call turn, no tool syntax in speech, no invented state on a
   no-tool question. Promote = `ollama cp jarvis-house-candidate jarvis-house`.

Every run writes `~/.hubbubb-voice/housemodel/last-run.json` (scores,
failures, the escalation watermark). `--nightly` skips unless 20+ new
escalations arrived and hard-stops at 03:00, ahead of the 03:20 voicecheck.

## Switching the house over

Point the Home Assistant Ollama "Ollama (Mac)" agent's model at
`jarvis-house`. Deliberate and manual: the stock model is one dropdown away.

## Installing the nightly job

    cp com.hubbubb.housemodel-nightly.plist ~/Library/LaunchAgents/
    launchctl bootstrap gui/$UID ~/Library/LaunchAgents/com.hubbubb.housemodel-nightly.plist

## Honest quality notes

- LoRA teaches **form** and recurring answers, not reasoning. It cannot
  know live state; that rides the prompt from Home Assistant.
- Overfitting is the real risk. The gate compares against the serving
  model on prompts the dataset never generates; keep adding to its
  held-out set whenever a live failure slips past it.
- The llama3.2:3b path is retired; it is in git history (4bd65cc).
