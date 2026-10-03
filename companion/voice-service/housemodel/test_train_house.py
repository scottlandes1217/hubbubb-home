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
print("ok")
