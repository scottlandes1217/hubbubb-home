"""The eval gate's scoring - the part that decides promotion.  python3 test_eval_house.py"""

from eval_house import score


def call(name):
    return [{"function": {"name": name, "arguments": {}}}]


assert score("tool", "HassTurnOn", "", call("HassTurnOn")) == (True, None)
assert score("tool", "HassTurnOn", "", call("HassTurnOff")) == (False, None)
assert score("tool", "HassTurnOn", "Turning it on.", call("HassTurnOn"))[1] == "narrated a tool call"
assert score("plain", None, '{"name": "HassTurnOn"}', [])[1] == "tool syntax in speech"
assert score("plain", None, "<tool_call>x", [])[1] == "tool syntax in speech"
assert score("no_tool", None, "I can't check the cameras.", []) == (True, None)
assert score("no_tool", None, "There's a timer for the pasta.", [])[1]
assert score("no_tool", None, "", call("HassTurnOn")) == (False, None)
assert score("no_tool", None, "", call("hand_to_companion")) == (True, None)
assert score("plain", None, "Very well.", []) == (True, None)
assert score("plain", None, "", call("HassTurnOff")) == (False, None)
assert score("clarify", None, "Which one?", []) == (True, None)
assert score("escalate", None, "", call("hand_to_companion")) == (True, None)
assert score("escalate", None, "Here's a script.", []) == (True, None)
print("ok")
