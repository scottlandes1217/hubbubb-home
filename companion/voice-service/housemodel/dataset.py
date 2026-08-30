"""Training data for the house model, generated from the house itself.

Reads Home Assistant's registries (read-only) for every assist-exposed
entity and synthesizes command -> tool-call conversations in the exact
shape the serving stack uses: ollama's llama3.2 template expects the model
to answer a tool-worthy request with nothing but

    {"name": "HassTurnOn", "parameters": {"name": "Lamp"}}

and to speak plainly otherwise. That behavioural contract - right tool,
right entity name, plain speech everywhere else, never JSON in prose - is
what these pairs teach. Live device state is deliberately absent: state
changes by the minute and stays in the prompt at inference time.

Output: train.jsonl / valid.jsonl in mlx_lm chat format
({"messages": [...], "tools": [...]}) under ~/.hubbubb-voice/housemodel/data/.
"""

import argparse
import json
import os
import random

STORAGE = os.path.expanduser("~/.hamounts/config/.storage")
PAIRS = os.path.expanduser("~/.claude/hooks/finetune/pairs.jsonl")
OUT = os.path.expanduser("~/.hubbubb-voice/housemodel/data")

SYSTEM = (
    "You are the house voice assistant. Your replies are spoken aloud "
    "through a speaker: short plain sentences, never JSON, code, or tool "
    "syntax in prose. Use the provided tools for anything touching the "
    "house; call a tool rather than describing it. If a transcript is "
    "garbled or clearly not addressed to you, briefly ask them to say it "
    "again."
)

def _tool(name, desc, props, required):
    return {"type": "function", "function": {
        "name": name, "description": desc,
        "parameters": {"type": "object", "properties": props,
                       "required": required}}}

NAME_ARG = {"name": {"type": "string", "description": "Device name"}}
AREA_ARG = {"area": {"type": "string", "description": "Area name"}}

TOOLS = [
    _tool("HassTurnOn", "Turn a device or scene on", {**NAME_ARG, **AREA_ARG}, ["name"]),
    _tool("HassTurnOff", "Turn a device off", {**NAME_ARG, **AREA_ARG}, ["name"]),
    _tool("HassLightSet", "Set a light's brightness",
          {**NAME_ARG, "brightness": {"type": "integer",
                                      "description": "Percent 0-100"}},
          ["name", "brightness"]),
    _tool("HassMediaPause", "Pause a media player", NAME_ARG, ["name"]),
    _tool("HassMediaUnpause", "Resume a media player", NAME_ARG, ["name"]),
    _tool("GetLiveContext", "Current state of devices in the house", {}, []),
    _tool("hand_to_companion",
          "Hand a request to the much more capable coding agent: multi-step "
          "jobs, coding, research, anything beyond these tools",
          {"request": {"type": "string"}}, ["request"]),
]


def _call(_fn, **params):
    """The assistant turn, exactly as ollama's template wants it emitted."""
    return json.dumps({"name": _fn, "parameters": params})


def _load(name):
    with open(os.path.join(STORAGE, name)) as handle:
        return json.load(handle)["data"]


def exposed_entities():
    """(spoken name, domain, area name) for everything assist can see."""
    reg = _load("core.entity_registry")["entities"]
    devices = {d["id"]: d for d in _load("core.device_registry")["devices"]}
    areas = {a["id"]: a["name"] for a in _load("core.area_registry")["areas"]}
    exposed = _load("homeassistant.exposed_entities")["exposed_entities"]

    out = []
    for e in reg:
        flag = (exposed.get(e["entity_id"], {}).get("assistants", {})
                .get("conversation", {}).get("should_expose"))
        if not flag or e.get("disabled_by") or e.get("hidden_by"):
            continue
        device = devices.get(e.get("device_id") or "", {})
        name = (e.get("name") or e.get("original_name")
                or device.get("name_by_user") or device.get("name"))
        if not name:
            continue
        area = areas.get(e.get("area_id") or device.get("area_id") or "")
        out.append((name.strip(), e["entity_id"].split(".")[0], area))
    return out


def entity_samples(name, domain, area):
    lower = name.lower()
    s = []

    def sample(user, assistant):
        s.append({"messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": user},
            {"role": "assistant", "content": assistant},
        ], "tools": TOOLS})

    if domain == "scene":
        verb = random.choice(["activate", "run", "turn on"])
        sample(f"{verb} the {lower} scene", _call("HassTurnOn", name=name))
        return s

    on = random.choice([f"turn on the {lower}", f"switch the {lower} on",
                        f"turn the {lower} on"])
    off = random.choice([f"turn off the {lower}", f"switch off the {lower}",
                         f"turn the {lower} off"])
    sample(on, _call("HassTurnOn", name=name))
    sample(off, _call("HassTurnOff", name=name))
    if area:
        sample(f"turn off the {lower} in the {area.lower()}",
               _call("HassTurnOff", name=name, area=area))

    if domain == "light":
        pct = random.randrange(10, 95, 5)
        phrasing = random.choice([
            f"turn the {lower} to {pct} percent",
            f"set the {lower} to {pct} percent",
            f"set the {lower} brightness to {pct} percent",
            f"dim the {lower} to {pct} percent",
        ])
        sample(phrasing, _call("HassLightSet", name=name, brightness=pct))

    if domain == "media_player":
        sample(f"pause the {lower}", _call("HassMediaPause", name=name))
        sample(f"resume the {lower}", _call("HassMediaUnpause", name=name))

    # Status: the call, then - separate sample - speaking the tool's answer.
    state = random.choice(["on", "off"])
    ask = f"is the {lower} {random.choice(['on', 'on or off'])}"
    sample(ask, _call("GetLiveContext"))
    s.append({"messages": [
        {"role": "system", "content": SYSTEM},
        {"role": "user", "content": ask},
        {"role": "assistant", "content": _call("GetLiveContext")},
        {"role": "tool", "content": f"{name}: {state}"},
        {"role": "assistant", "content": f"The {lower} is {state}."},
    ], "tools": TOOLS})
    return s


# Not tool-worthy: garbled fragments, dismissals, and small talk must come
# back as brief plain speech - this is the anti-"json structure" lesson.
PLAIN = [
    ("nothing, cancel the request", "Understood."),
    ("never mind", "Very well."),
    ("uh", "Sorry, could you say that again?"),
    ("el", "Sorry, could you say that again?"),
    ("he literally walked by his cycles", "Sorry, could you say that again?"),
    ("that was so funny you know what I used to", "Sorry, I didn't catch that - say it again?"),
    ("baby buddy", "Sorry, could you say that again?"),
    ("thank you", "You're welcome."),
    ("okay great", "Glad to help."),
    ("what did you say", "I said nothing worth repeating - what do you need?"),
]

ESCALATE = [
    "ask claude to review the sprinkler schedule",
    "write a script that renames my photo files",
    "research which heat pump we should buy",
    "look into why the camera keeps going offline",
]


def plain_samples():
    out = []
    for user, reply in PLAIN:
        out.append({"messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": user},
            {"role": "assistant", "content": reply}], "tools": TOOLS})
    for req in ESCALATE:
        out.append({"messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": req},
            {"role": "assistant",
             "content": _call("hand_to_companion", request=req)}],
            "tools": TOOLS})
    return out


def harvested_samples():
    """Escalations the nightly pass curated from real speech, when present."""
    out = []
    try:
        for line in open(PAIRS):
            try:
                pair = json.loads(line)
            except ValueError:
                continue
            if pair.get("kind") == "escalation" and pair.get("prompt"):
                out.append({"messages": [
                    {"role": "system", "content": SYSTEM},
                    {"role": "user", "content": pair["prompt"]},
                    {"role": "assistant",
                     "content": _call("hand_to_companion",
                                      request=pair["prompt"])}],
                    "tools": TOOLS})
    except OSError:
        pass
    return out


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--smoke", action="store_true",
                        help="tiny dataset, just to prove the pipeline")
    args = parser.parse_args()
    random.seed(29)  # regeneration is deterministic for a given house

    samples = []
    for name, domain, area in exposed_entities():
        samples += entity_samples(name, domain, area)
    samples += plain_samples() + harvested_samples()
    random.shuffle(samples)
    if args.smoke:
        samples = samples[:60]

    valid_n = max(8, len(samples) // 10)
    os.makedirs(OUT, exist_ok=True)
    for split, rows in (("valid", samples[:valid_n]),
                        ("train", samples[valid_n:])):
        with open(os.path.join(OUT, f"{split}.jsonl"), "w") as handle:
            for row in rows:
                handle.write(json.dumps(row) + "\n")
    print(f"wrote {len(samples) - valid_n} train / {valid_n} valid -> {OUT}")


if __name__ == "__main__":
    main()
