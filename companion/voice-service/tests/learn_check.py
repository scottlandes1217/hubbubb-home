"""Auto-learn gate: only confident, unambiguous, long-enough speech joins a profile.

Run from voice-service/:  .venv/bin/python tests/learn_check.py
"""
import sys
import tempfile
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from speakers import Profiles

rng = np.random.default_rng(0)
unit = lambda v: v / np.linalg.norm(v)
scott, other = unit(rng.normal(size=256)), unit(rng.normal(size=256))

p = Profiles(Path(tempfile.mkdtemp()))
p.add("Scott", scott)

def learn(e, seconds=3.0):
    person, sim, cands = p.match(e)
    return p.learn(person, sim, cands, e, seconds)

near = unit(scott + 0.2 * unit(rng.normal(size=256)))   # ~0.98
far = unit(scott + 1.2 * unit(rng.normal(size=256)))    # ~0.64: a guess, not sure
assert learn(near) and p.counts()["Scott"] == 2
assert not learn(near, seconds=0.8), "too short"
assert not learn(far), "below the learn bar"
assert not learn(other), "a stranger"
p.add("Twin", unit(scott + 0.05 * unit(rng.normal(size=256))))
assert not learn(near), "two profiles too close to call"
assert Profiles(p.dir).counts() == {"Scott": 2, "Twin": 1}, "persisted"
print("learn_check ok")

# --- strangers: heard twice -> ask; the answer files their clips -------------
import time

p = Profiles(Path(tempfile.mkdtemp()))
p.add("Scott", scott)
anna = unit(rng.normal(size=256))
like_anna = lambda: unit(anna + 0.3 * unit(rng.normal(size=256)))
assert not p.stranger(like_anna(), 3.0), "first time: just remember"
assert not p.stranger(other, 3.0), "a different stranger is not her"
assert not p.stranger(like_anna(), 1.0), "too short to count"
a2 = like_anna()
assert p.stranger(a2, 3.0), "second time: ask"
added, new = p.claim("Anna", a2)
assert (added, new) == (2, True) and p.counts()["Anna"] == 2
assert len(p.strangers) == 1, "the other stranger stays unclaimed"
person, _, _ = p.match(like_anna())
assert person == "Anna"
added, new = p.claim("Scott", scott)  # nobody pooled sounds like him
assert (added, new) == (1, False) and p.counts()["Scott"] == 2

# --- "that wasn't me" drops the clip before the complaint, not the complaint --
p.learned.clear()
before = p.counts()["Scott"]
assert learn(near)
t = time.time()
assert learn(near)  # the complaint itself, also confidently Scott
assert p.unlearn(t) == "Scott" and p.counts()["Scott"] == before + 1
assert p.unlearn(t) is None, "only one clip was learned before the complaint"
print("stranger/claim/unlearn ok")
