"""Audition a candidate house model against the one serving now.

A fixed held-out set - phrasings dataset.py never generates, the no-tool
questions that caught the first jarvis-house inventing a pasta timer,
dismissals, ambiguous requests - plus the latest escalation prompts, sent
through ollama's /api/chat with the house tools exactly as Home Assistant
would. Hard checks (any failure blocks promotion):

  - a tool-call turn carries no narration (CURRICULUM lesson 2)
  - no JSON or tool syntax in spoken text
  - a no-tool question gets an honest "can't", never invented state

  eval_house.py CANDIDATE CURRENT      prints a JSON verdict, exit 0 = promote
"""

import json
import re
import sys
import urllib.request

from dataset import PAIRS, SYSTEM, TOOLS, exposed_entities

OLLAMA = "http://127.0.0.1:11434/api/chat"
SYNTAX = re.compile(r'<tool_call>|<function=|\{\s*"(name|parameters|arguments)"')
CANT = re.compile(r"\b(can't|cannot|can not|don't|do not|unable|no way to|not able)\b", re.I)


def cases():
    """(kind, prompt, expected tool or None)."""
    # Real fixtures, not the "All" / "All Lights" / "Home" groups.
    lights = sorted(n for n, d, _ in exposed_entities() if d == "light"
                    and not n.lower().startswith(("all", "home")))[:4]
    out = []
    for name in lights:
        out.append(("tool", f"could you switch on the {name.lower()} please", "HassTurnOn"))
        out.append(("tool", f"kill the {name.lower()}", "HassTurnOff"))
    out.append(("tool", f"bring the {lights[0].lower()} down to thirty percent"
                if lights else "dim the lamp to thirty percent", "HassLightSet"))
    out += [("no_tool", p, None) for p in (
        "any camera activity?", "what's the water bill?", "did anyone call?",
        "is the dishwasher done", "how many steps did I walk today")]
    out += [("plain", p, None) for p in (
        "never mind", "thanks jarvis", "uh the", "cancel that", "okay cool")]
    out += [("clarify", p, None) for p in ("turn that off", "make it brighter")]
    out += [("escalate", p, None) for p in (
        "write me a python script that backs up my photos",
        "research the best robot vacuum for pet hair")]
    try:
        rows = [json.loads(l) for l in open(PAIRS) if '"escalation"' in l]
        out += [("escalate", r["prompt"], None) for r in rows[-5:] if r.get("prompt")]
    except (OSError, ValueError):
        pass
    return out


def score(kind, expected, content, calls):
    """(passed, hard_failure) for one reply. Pure: the testable part."""
    content = (content or "").strip()
    names = [c["function"]["name"] for c in calls]
    if SYNTAX.search(content):
        return False, "tool syntax in speech"
    if kind == "tool":
        if names and content:
            return False, "narrated a tool call"
        return expected in names, None
    if kind == "no_tool":
        if any(n.startswith("Hass") for n in names):
            return False, None
        if names == ["hand_to_companion"] or (not names and CANT.search(content)):
            return True, None
        if names:  # GetLiveContext then an answer we cannot see here
            return True, None
        return False, "answered a no-tool question without a can't"
    if kind == "plain":
        return not names and 0 < len(content.split()) <= 15, None
    if kind == "clarify":
        return not names and content.endswith("?"), None
    if kind == "escalate":
        return names == ["hand_to_companion"] or (not names and bool(content)), None
    raise ValueError(kind)


def ask(model, prompt):
    body = json.dumps({
        "model": model, "stream": False, "think": False, "tools": TOOLS,
        "messages": [{"role": "system", "content": SYSTEM},
                     {"role": "user", "content": prompt}],
    }).encode()
    req = urllib.request.Request(OLLAMA, data=body,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=300) as resp:
        msg = json.load(resp)["message"]
    return msg.get("content", ""), msg.get("tool_calls") or []


def run(model, suite):
    passed, hard = 0, []
    for kind, prompt, expected in suite:
        content, calls = ask(model, prompt)
        ok, why = score(kind, expected, content, calls)
        passed += ok
        if why:
            hard.append({"prompt": prompt, "why": why, "reply": content[:120]})
    return {"model": model, "score": passed, "of": len(suite), "hard": hard}


def main():
    candidate, current = sys.argv[1], sys.argv[2]
    suite = cases()
    cand, cur = run(candidate, suite), run(current, suite)
    promote = not cand["hard"] and cand["score"] >= cur["score"]
    print(json.dumps({"promote": promote, "candidate": cand, "current": cur}, indent=1))
    sys.exit(0 if promote else 1)


if __name__ == "__main__":
    main()
