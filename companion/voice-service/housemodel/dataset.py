"""Training data for the house model, generated from the house itself.

Reads Home Assistant's registries (read-only) for every assist-exposed
entity and synthesizes command -> tool-call conversations in the shape the
serving stack uses: native Qwen tool calls (an assistant turn with EMPTY
content and a `tool_calls` list - the chat template renders the
<tool_call> block, ollama parses it back). That behavioural contract -
right tool, right entity name, plain speech everywhere else, never JSON in
prose, no narrating the call - is what these pairs teach. Live device state
is deliberately absent: a status answer only ever follows a tool result in
the same conversation (CURRICULUM.md, lesson 1).

Escalations the companion logged (`kind: "escalation"` in pairs.jsonl)
become direct answers when Claude's response is there - that is how the
local model learns the subject - and a hand_to_companion call when it is
not.

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
    """The tool-call turn: empty content, the call is the whole turn."""
    return {"role": "assistant", "content": "", "tool_calls": [
        {"type": "function", "function": {"name": _fn, "arguments": params}}]}


def _say(text):
    return {"role": "assistant", "content": text}


def _convo(user, *turns):
    return {"messages": [{"role": "system", "content": SYSTEM},
                         {"role": "user", "content": user}, *turns],
            "tools": TOOLS}


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

    if domain == "scene":
        verb = random.choice(["activate", "run", "turn on"])
        s.append(_convo(f"{verb} the {lower} scene", _call("HassTurnOn", name=name)))
        return s

    on = random.choice([f"turn on the {lower}", f"switch the {lower} on",
                        f"turn the {lower} on"])
    off = random.choice([f"turn off the {lower}", f"switch off the {lower}",
                         f"turn the {lower} off"])
    s.append(_convo(on, _call("HassTurnOn", name=name)))
    s.append(_convo(off, _call("HassTurnOff", name=name)))
    if area:
        s.append(_convo(f"turn off the {lower} in the {area.lower()}",
                        _call("HassTurnOff", name=name, area=area)))

    if domain == "light":
        pct = random.randrange(10, 95, 5)
        phrasing = random.choice([
            f"turn the {lower} to {pct} percent",
            f"set the {lower} to {pct} percent",
            f"set the {lower} brightness to {pct} percent",
            f"dim the {lower} to {pct} percent",
        ])
        s.append(_convo(phrasing, _call("HassLightSet", name=name, brightness=pct)))

    if domain == "media_player":
        s.append(_convo(f"pause the {lower}", _call("HassMediaPause", name=name)))
        s.append(_convo(f"resume the {lower}", _call("HassMediaUnpause", name=name)))

    # Status is always grounded: the call, its result, then the spoken answer.
    state = random.choice(["on", "off"])
    ask = f"is the {lower} {random.choice(['on', 'on or off'])}"
    s.append(_convo(ask, _call("GetLiveContext")))
    s.append(_convo(ask, _call("GetLiveContext"),
                    {"role": "tool", "content": f"{name}: {state}"},
                    _say(f"The {lower} is {state}.")))
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

# Things no tool here can see. The first jarvis-house invented a pasta timer
# when asked about cameras; the right answer is a short honest "can't".
NO_TOOL = [
    ("any camera activity?", "I can't check the cameras from here."),
    ("what's the water bill?", "I can't check that."),
    ("did anyone call?", "I can't check calls."),
    ("how much is in the bank account", "I can't check that."),
    ("what did the doctor say", "I don't have that."),
    ("is the mail here yet", "I can't tell from here."),
]

# One clarifying question, ending in "?", when the request is ambiguous.
CLARIFY = [
    ("turn it off", "Which one should I turn off?"),
    ("set it to fifty", "Which light should I set to fifty percent?"),
    ("turn on the light", "Which light?"),
]

ESCALATE = [
    "ask claude to review the sprinkler schedule",
    "write a script that renames my photo files",
    "research which heat pump we should buy",
    "look into why the camera keeps going offline",
]


def plain_samples():
    out = [_convo(u, _say(r)) for u, r in PLAIN + NO_TOOL + CLARIFY]
    out += [_convo(r, _call("hand_to_companion", request=r)) for r in ESCALATE]
    return out


def harvested_samples(names):
    """Escalations the companion logged: Claude's answer, or the handoff."""
    out = []
    try:
        lines = open(PAIRS).readlines()
    except OSError:
        return out
    for line in lines:
        try:
            pair = json.loads(line)
        except ValueError:
            continue
        prompt = (pair.get("prompt") or "").strip()
        if pair.get("kind") != "escalation" or not prompt:
            continue
        response = (pair.get("response") or "").strip()
        # ponytail: name match, not real state detection. Claude's answer to
        # "is the porch light on" is a snapshot; training on it teaches state
        # as fact (CURRICULUM lesson 1), so anything naming a device hands off.
        mentions_device = any(n in prompt.lower() for n in names)
        if response and not mentions_device:
            out.append(_convo(prompt, _say(response)))
        else:
            out.append(_convo(prompt, _call("hand_to_companion", request=prompt)))
    return out


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--smoke", action="store_true",
                        help="tiny dataset, just to prove the pipeline")
    args = parser.parse_args()
    random.seed(29)  # regeneration is deterministic for a given house

    entities = exposed_entities()
    samples = []
    for name, domain, area in entities:
        samples += entity_samples(name, domain, area)
    names = {n.lower() for n, _, _ in entities if len(n) > 3}
    samples += plain_samples() + harvested_samples(names)
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
