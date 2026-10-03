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
print("ok")
