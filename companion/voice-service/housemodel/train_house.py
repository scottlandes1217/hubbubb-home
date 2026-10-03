"""LoRA-tune the local brain on this house, audition it, maybe promote it.

The serving model is qwen3.6:35b-a3b (a 35B mixture-of-experts). The chain:

  1. dataset.py regenerates train/valid from the registries + escalations.
  2. mlx_lm LoRA on the 4-bit MLX build (~36 GB peak). Every linear layer
     except the routed experts: mlx stacks the experts into `switch_mlp`,
     which has no 1:1 tensor in the original checkpoint.
  3. The LoRA deltas are added straight onto the ORIGINAL bf16 checkpoint
     (Qwen/Qwen3.6-35B-A3B). Every adapted tensor there has the same name
     and layout mlx trained on - mlx only renames the prefix - so the
     merge is exact and ollama's own converter does the rest. (Shorter
     routes measured dead on ollama 0.33: mlx_lm fuse writes mlx tensor
     names that ollama's quantizer rejects; safetensors ADAPTER import says
     "unsupported architecture" for qwen35moe.)
  4. `ollama create jarvis-house-candidate --quantize q4_K_M`.
  5. eval_house.py auditions candidate vs the serving model; only a clean
     win becomes `jarvis-house`. Pointing Home Assistant at jarvis-house is
     a separate, deliberate step.

  train_house.py            full run
  train_house.py --smoke    tiny dataset, 20 iterations - proves the chain
  train_house.py --nightly  skip unless 20+ new escalations since last run

Writes ~/.hubbubb-voice/housemodel/last-run.json either way.
"""

import argparse
import datetime
import json
import os
import shutil
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

HERE = Path(__file__).parent
# mlx steps only. dataset/eval read the HA share, which launchd lets only
# /usr/bin/python3 (Full Disk Access) see - they run under sys.executable.
PYTHON = HERE / ".venv" / "bin" / "python"
BASE = "mlx-community/Qwen3.6-35B-A3B-4bit"
HF_BASE = "Qwen/Qwen3.6-35B-A3B"
SERVING_BASE = "qwen3.6:35b-a3b"
WORK = Path(os.path.expanduser("~/.hubbubb-voice/housemodel"))
DATA = WORK / "data"
ADAPTER = WORK / "adapter"
MERGED = WORK / "merged"
LAST_RUN = WORK / "last-run.json"
PAIRS = Path(os.path.expanduser("~/.claude/hooks/finetune/pairs.jsonl"))
OLLAMA = shutil.which("ollama") or "/opt/homebrew/bin/ollama"
API = "http://127.0.0.1:11434"
MIN_NEW = 20
# The 03:20 voicecheck wants ollama back; a run still going at 03:00 dies.
STOP_AT = datetime.time(3, 0)
LORA_KEYS = [
    "self_attn.q_proj", "self_attn.k_proj", "self_attn.v_proj", "self_attn.o_proj",
    "linear_attn.in_proj_qkv", "linear_attn.in_proj_z", "linear_attn.in_proj_a",
    "linear_attn.in_proj_b", "linear_attn.out_proj",
    "mlp.shared_expert.gate_proj", "mlp.shared_expert.up_proj",
    "mlp.shared_expert.down_proj",
]
RANK, SCALE, LAYERS = 8, 20.0, 16

deadline = None


def run(cmd, **kw):
    print("+", " ".join(str(c)[:80] for c in cmd), flush=True)
    left = None if deadline is None else max(1, deadline - time.time())
    subprocess.run([str(c) for c in cmd], check=True, timeout=left, **kw)


def api(path, payload, timeout=300):
    req = urllib.request.Request(f"{API}{path}", data=json.dumps(payload).encode(),
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.load(resp)


def escalation_count():
    try:
        return sum('"escalation"' in line for line in open(PAIRS))
    except OSError:
        return 0


def serving_model():
    """jarvis-house once one of ours was promoted; the retired llama-3B
    jarvis-house of the same name does not count."""
    try:
        family = api("/api/show", {"model": "jarvis-house"})["details"]["family"]
    except OSError:  # HTTPError (404: never promoted) is an OSError
        return SERVING_BASE
    return "jarvis-house:latest" if family == "qwen35moe" else SERVING_BASE


OLLAMA_JOB = "com.scottlandes.ollama"
OLLAMA_PLIST = Path(os.path.expanduser(f"~/Library/LaunchAgents/{OLLAMA_JOB}.plist"))


def ollama_down():
    """Training (~36 GB) and a resident 22 GB model do not both fit, and any
    voice request mid-run reloads one (KEEP_ALIVE=-1) and kills training
    with a Metal OOM. Off entirely; requests in the window fail fast."""
    subprocess.run(["launchctl", "bootout", f"gui/{os.getuid()}/{OLLAMA_JOB}"])
    time.sleep(3)


def ollama_up():
    subprocess.run(["launchctl", "bootstrap", f"gui/{os.getuid()}", str(OLLAMA_PLIST)],
                   stderr=subprocess.DEVNULL)  # "already loaded" is fine
    for _ in range(60):
        try:
            urllib.request.urlopen(f"{API}/api/tags", timeout=2)
            return
        except OSError:
            time.sleep(1)


def prune_blobs():
    """A failed `ollama create` strands ~140 GB of blobs no manifest names,
    and ollama 0.33 no longer prunes them on start. Two bad nights would
    fill the disk, so sweep them - only unreferenced, only once our create
    is over."""
    store = Path(os.path.expanduser("~/.ollama/models"))
    used = set()
    for m in (store / "manifests").rglob("*"):
        if m.is_file():
            d = json.loads(m.read_text())
            used |= {l["digest"].replace(":", "-")
                     for l in d.get("layers", []) + [d.get("config", {})] if l.get("digest")}
    for blob in (store / "blobs").iterdir():
        if blob.name not in used and time.time() - blob.stat().st_mtime > 60:
            blob.unlink()


def base_modelfile_tail():
    """Renderer, parser and sampling from the stock model - not its draft head."""
    show = subprocess.run([OLLAMA, "show", SERVING_BASE, "--modelfile"],
                          capture_output=True, text=True, check=True).stdout
    keep = ("TEMPLATE", "RENDERER", "PARSER", "PARAMETER")
    return "\n".join(l for l in show.splitlines()
                     if l.startswith(keep) and "draft_" not in l)


def merge(adapter_file, hf_dir):
    """Original checkpoint + LoRA deltas -> MERGED (untouched files hard-linked)."""
    run([PYTHON, "-c", MERGE_SCRIPT, adapter_file, hf_dir, MERGED, str(SCALE)])


# Runs inside the venv (mlx lives there, not in the launchd python).
MERGE_SCRIPT = r"""
import json, os, sys, mlx.core as mx
adapter, src, out, scale = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
lora = mx.load(adapter)
delta = {}
for k in lora:
    if k.endswith(".lora_a"):
        mod = k[: -len(".lora_a")]
        hf = mod.replace("language_model.model.", "model.language_model.", 1) + ".weight"
        a, b = lora[k].astype(mx.float32), lora[mod + ".lora_b"].astype(mx.float32)
        delta[hf] = (scale * (a @ b)).T
index = json.load(open(os.path.join(src, "model.safetensors.index.json")))
missing = set(delta) - set(index["weight_map"])
assert not missing, f"no such tensors in the checkpoint: {sorted(missing)[:3]}"
os.makedirs(out, exist_ok=True)
by_shard = {}
for name in delta:
    by_shard.setdefault(index["weight_map"][name], []).append(name)
for f in os.listdir(src):
    dst = os.path.join(out, f)
    if f in by_shard:
        w = mx.load(os.path.join(src, f))
        for name in by_shard[f]:
            assert w[name].shape == delta[name].shape, (name, w[name].shape, delta[name].shape)
            w[name] = (w[name].astype(mx.float32) + delta[name]).astype(w[name].dtype)
        mx.save_safetensors(dst, w, metadata={"format": "pt"})
        del w
    elif not f.startswith("."):
        # Hard link, not symlink: ollama create refuses paths that leave the
        # directory ("insecure path"); same volume, so it costs no disk.
        os.link(os.path.realpath(os.path.join(src, f)), dst)
print(f"merged {len(delta)} tensors into {len(by_shard)} shards")
"""


def main():
    global deadline
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--smoke", action="store_true")
    parser.add_argument("--nightly", action="store_true")
    parser.add_argument("--iters", type=int, default=None,
                        help="training iterations (default 400, smoke 20)")
    args = parser.parse_args()
    iters = args.iters or (20 if args.smoke else 400)

    # A SIGKILLed run skips `finally` and leaves the service booted out;
    # whichever run comes next puts it back first.
    ollama_up()
    escalations = escalation_count()
    last = json.loads(LAST_RUN.read_text()) if LAST_RUN.exists() else {}
    record = {"started": datetime.datetime.now().isoformat(timespec="seconds"),
              "escalations": escalations, "iters": iters}
    if args.nightly:
        new = escalations - last.get("escalations", 0)
        if new < MIN_NEW:
            print(f"skip: {new} new escalations (< {MIN_NEW})")
            return
        now = datetime.datetime.now()
        stop = datetime.datetime.combine(now.date(), STOP_AT)
        deadline = (stop if stop > now else stop + datetime.timedelta(days=1)).timestamp()

    current = serving_model()
    try:
        run([sys.executable, HERE / "dataset.py"] + (["--smoke"] if args.smoke else []))
        hf_dir = subprocess.run(
            [str(PYTHON), "-c", "import sys; from huggingface_hub import snapshot_download as s; "
             f"s('{BASE}'); print(s('{HF_BASE}'))"],
            capture_output=True, text=True, check=True).stdout.strip().splitlines()[-1]

        ollama_down()
        for path in (ADAPTER, MERGED):
            shutil.rmtree(path, ignore_errors=True)
        config = WORK / "lora.yaml"  # JSON is YAML; mlx_lm -c takes either
        config.write_text(json.dumps({"lora_parameters": {
            "keys": LORA_KEYS, "rank": RANK, "scale": SCALE, "dropout": 0.0}}))
        started = time.time()
        run([PYTHON, "-m", "mlx_lm", "lora", "-c", config,
             "--model", BASE, "--train", "--data", DATA,
             "--adapter-path", ADAPTER, "--batch-size", "1",
             "--num-layers", str(LAYERS), "--iters", str(iters),
             "--steps-per-report", "10", "--save-every", str(iters),
             "--grad-checkpoint"])
        record["train_seconds"] = round(time.time() - started)
        ollama_up()

        merge(ADAPTER / "adapters.safetensors", hf_dir)
        modelfile = WORK / "Modelfile"
        modelfile.write_text(f"FROM {MERGED}\n{base_modelfile_tail()}\n")
        run([OLLAMA, "create", "jarvis-house-candidate", "-f", modelfile,
             "--quantize", "q4_K_M"])
        shutil.rmtree(MERGED, ignore_errors=True)  # tens of GB, rebuilt each run

        verdict = subprocess.run(
            [sys.executable, HERE / "eval_house.py", "jarvis-house-candidate", current],
            capture_output=True, text=True, cwd=HERE,
            timeout=None if deadline is None else max(1, deadline - time.time()))
        result = json.loads(verdict.stdout)
        record.update(eval=result, promoted=result["promote"])
        if result["promote"]:
            run([OLLAMA, "cp", "jarvis-house-candidate", "jarvis-house"])
        print(json.dumps({k: record[k] for k in ("promoted", "train_seconds")}),
              result["candidate"]["score"], "vs", result["current"]["score"])
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, ValueError) as err:
        # A failed run must not use up the escalations it never learned from.
        record.update(promoted=False, failed=str(err)[:300],
                      escalations=last.get("escalations", 0))
        print(f"FAILED: {err}", file=sys.stderr)
    finally:
        ollama_up()
        shutil.rmtree(MERGED, ignore_errors=True)
        prune_blobs()
        record["finished"] = datetime.datetime.now().isoformat(timespec="seconds")
        WORK.mkdir(parents=True, exist_ok=True)
        LAST_RUN.write_text(json.dumps(record, indent=1))
        # Put the serving model back in memory so the house isn't cold at dawn.
        try:
            api("/api/generate", {"model": serving_model(), "keep_alive": -1})
        except OSError:
            pass
    if record.get("failed"):
        sys.exit(1)


if __name__ == "__main__":
    main()
