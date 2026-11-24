"""The Claude fallback around training - never leave Jarvis without a brain.

  python3 test_train_house.py
"""

import train_house as t

state = {}


def fake_ha(command):
    if command["type"] == "assist_pipeline/pipeline/get":
        return {"id": t.PIPELINE, "name": "Jarvis", "conversation_engine": state["engine"]}
    assert "id" not in command and command["pipeline_id"] == t.PIPELINE
    assert command["name"] == "Jarvis"  # every other field is carried over
    state["engine"] = command["conversation_engine"]
    state["log"].append(state["engine"])


def scenario(engine, ollama_answers=True, fail=False):
    state.update(engine=engine, log=[])
    t.ha = fake_ha
    t.ollama_down = lambda: state["log"].append("down")
    t.ollama_up = lambda: state["log"].append("up") or ollama_answers
    try:
        with t.ollama_offline():
            assert state["engine"] == t.CLAUDE_AGENT  # Claude while training
            if fail:
                raise RuntimeError("training died")
    except RuntimeError:
        pass
    return state["engine"], state["log"]


# local brain: Claude for the window, local again once ollama answers
assert scenario("conversation.ollama_mac") == (
    "conversation.ollama_mac", [t.CLAUDE_AGENT, "down", "up", "conversation.ollama_mac"])
# training raises: restored all the same
assert scenario("conversation.ollama_mac", fail=True)[0] == "conversation.ollama_mac"
# ollama never came back: stay on Claude rather than point at a dead agent
assert scenario("conversation.ollama_mac", ollama_answers=False)[0] == t.CLAUDE_AGENT
# already on Claude: no writes at all
assert scenario(t.CLAUDE_AGENT) == (t.CLAUDE_AGENT, ["down", "up"])
# Promotion: the agent's settings all survive, only the model changes.
sent = []
form = {"flow_id": "f1", "data_schema": [
    {"name": "model", "description": {"suggested_value": "qwen3.6:35b-a3b"}},
    {"name": "think", "description": {"suggested_value": True}},
    {"name": "num_ctx", "description": {"suggested_value": 262144.0}},
    {"name": "prompt"},  # no suggestion offered: left out, HA keeps it
]}


def fake_rest(path, payload):
    sent.append((path, payload))
    return form if path.endswith("/subentries/flow") else {"reason": "reconfigure_successful"}


t.ha_rest = fake_rest
t.set_agent_model("jarvis-house:latest")
assert sent[0][1]["subentry_id"] == t.JARVIS_AGENT
assert sent[1] == ("/api/config/config_entries/subentries/flow/f1",
                   {"model": "jarvis-house:latest", "think": True, "num_ctx": 262144.0})
t.ha_rest = lambda path, payload: form if path.endswith("/flow") else {"reason": "nope"}
try:
    t.set_agent_model("x")
    raise AssertionError("a refused switch must raise")
except RuntimeError:
    pass
# Local Claude sessions follow onto the promoted model; nothing else changes.
import json, pathlib, tempfile
t.BRAIN_SETTINGS = pathlib.Path(tempfile.mkdtemp()) / "s.json"
t.BRAIN_SETTINGS.write_text(json.dumps({"env": {
    "ANTHROPIC_MODEL": t.SERVING_BASE, "ANTHROPIC_DEFAULT_OPUS_MODEL": t.SERVING_BASE,
    "ANTHROPIC_BASE_URL": "http://localhost:11434"}, "permissions": {}}))
t.set_brain_settings("jarvis-house:latest")
assert json.loads(t.BRAIN_SETTINGS.read_text()) == {"env": {
    "ANTHROPIC_MODEL": "jarvis-house:latest", "ANTHROPIC_DEFAULT_OPUS_MODEL": "jarvis-house:latest",
    "ANTHROPIC_BASE_URL": "http://localhost:11434"}, "permissions": {}}
# After the eval only the serving brain stays resident.
calls = []
t.api = lambda path, payload, **kw: (calls.append((path, payload)) or
    {"models": [{"name": "jarvis-house:latest"}, {"name": t.SERVING_BASE}]})
t.unload_all_but("jarvis-house:latest")
assert calls[1:] == [("/api/generate", {"model": t.SERVING_BASE, "keep_alive": 0})]
# Repeats teach answers, never a handoff for a device the model can work.
import dataset
dataset.pair_lines = lambda: [json.dumps(r) + "\n" for r in (
    {"kind": "escalation", "prompt": "is the heater on", "response": "Yes sir.", "note": "repeat"},
    {"kind": "escalation", "prompt": "an octopus fact", "response": "Three hearts.", "note": "repeat"},
    {"kind": "escalation", "prompt": "is the heater on", "response": "", "note": ""})]
got = dataset.harvested_samples({"heater"})
assert [m["messages"][-1].get("content") for m in got][0] == "Three hearts." and len(got) == 2, got
print("ok")
