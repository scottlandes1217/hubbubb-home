"""LoRA-tune the local 3B on this house, and hand the result to ollama.

One command: regenerate the dataset from the registries, train an adapter
with mlx_lm (QLoRA on the 4-bit base - this is a 16GB machine that is also
running whisper and ollama), fuse and dequantize, export GGUF, and
`ollama create jarvis-house` with the stock llama3.2 template so ollama's
native tool-call parsing keeps working. The stock llama3.2:3b model is
never touched; a re-run replaces jarvis-house, which is the whole
retrain-when-needed story: rename devices, re-run this, done.

  train_house.py           full run
  train_house.py --smoke   tiny dataset, ~20 iterations, minutes - proves
                           the chain end to end including ollama create

Prints `TRAINED jarvis-house` on success.
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
import urllib.request
from pathlib import Path

HERE = Path(__file__).parent
PYTHON = HERE / ".venv" / "bin" / "python"
BASE = "mlx-community/Llama-3.2-3B-Instruct-4bit"
WORK = Path(os.path.expanduser("~/.hubbubb-voice/housemodel"))
DATA = WORK / "data"
ADAPTER = WORK / "adapter"
FUSED = WORK / "fused"
OLLAMA = shutil.which("ollama") or "/opt/homebrew/bin/ollama"


def run(cmd, **kw):
    print("+", " ".join(str(c) for c in cmd), flush=True)
    subprocess.run([str(c) for c in cmd], check=True, **kw)


def stock_modelfile_tail():
    """TEMPLATE and PARAMETER lines from the stock model, FROM replaced.

    The template is the part that matters: it is what turns the model's
    {"name": ..., "parameters": ...} output back into native tool calls.
    """
    show = subprocess.run([OLLAMA, "show", "llama3.2:3b", "--modelfile"],
                          capture_output=True, text=True, check=True).stdout
    keep, recording = [], False
    for line in show.splitlines():
        if line.startswith(("TEMPLATE", "PARAMETER", "LICENSE")):
            recording = line.startswith(("TEMPLATE", "PARAMETER"))
        elif line.startswith(("FROM", "#")):
            recording = False
        if recording:
            keep.append(line)
    return "\n".join(keep)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--smoke", action="store_true")
    parser.add_argument("--iters", type=int, default=None,
                        help="training iterations (default 600, smoke 20)")
    args = parser.parse_args()
    iters = args.iters or (20 if args.smoke else 600)

    run([PYTHON, HERE / "dataset.py"] + (["--smoke"] if args.smoke else []))

    for path in (ADAPTER, FUSED):
        shutil.rmtree(path, ignore_errors=True)
    run([PYTHON, "-m", "mlx_lm", "lora",
         "--model", BASE, "--train",
         "--data", DATA,
         "--adapter-path", ADAPTER,
         "--batch-size", "1",
         "--num-layers", "8",
         "--iters", str(iters),
         "--steps-per-report", "10",
         "--save-every", str(iters)])

    gguf = "ggml-model-f16.gguf"
    run([PYTHON, "-m", "mlx_lm", "fuse",
         "--model", BASE, "--adapter-path", ADAPTER,
         "--save-path", FUSED, "--dequantize",
         "--export-gguf", "--gguf-path", gguf])

    modelfile = WORK / "Modelfile"
    modelfile.write_text(
        f"FROM {FUSED / gguf}\n" + stock_modelfile_tail() + "\n")
    # fp16 import; quantize back down so it serves at llama3.2:3b speeds.
    try:
        run([OLLAMA, "create", "jarvis-house", "-f", modelfile,
             "--quantize", "q4_K_M"])
    except subprocess.CalledProcessError:
        # older ollama: no --quantize on create; fp16 still works, just fatter
        run([OLLAMA, "create", "jarvis-house", "-f", modelfile])

    body = json.dumps({
        "model": "jarvis-house", "stream": False,
        "messages": [{"role": "user", "content": "Say only: ok"}],
    }).encode()
    request = urllib.request.Request(
        "http://127.0.0.1:11434/api/chat", data=body,
        headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(request, timeout=180) as resp:
        reply = json.load(resp)["message"]["content"]
    print("smoke reply:", reply[:80])

    print("TRAINED jarvis-house")


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as err:
        print(f"FAILED at: {err.cmd[0] if err.cmd else err}", file=sys.stderr)
        sys.exit(1)
