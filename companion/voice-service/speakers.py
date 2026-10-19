"""Speaker profiles: enrolled embeddings per person, cosine-centroid matching.

Everything tunable lives in profiles.json next to the embeddings, not in code:
similarity thresholds drift with microphones and room acoustics, so they are a
calibration knob, not a constant.
"""

from __future__ import annotations

import json
import os
import time
from pathlib import Path

import numpy as np

# learn: everyday speech scoring this high joins the speaker's profile.
# margin: and it must beat every other profile by this much.
# same_voice: two single clips this alike are one stranger, not two. Clip to
# clip runs lower than clip to centroid (Scott's own pairs: median 0.69); 0.75
# would have asked ~9 times in two weeks of real traffic, mostly Scott's own
# mumbled clips, which then join his profile when he answers.
DEFAULT_THRESHOLDS = {"confident": 0.75, "uncertain": 0.60,
                      "learn": 0.78, "margin": 0.10, "same_voice": 0.75}
MAX_SAMPLES = 40  # per person; oldest dropped first
MIN_LEARN_SECONDS = 1.5  # a "yes" is too short to say much about a voice
# Unrecognized clips are kept in memory only - a restart forgets strangers,
# which costs one extra utterance before the house asks who they are.
STRANGER_SECONDS = 7 * 86400
MAX_STRANGERS = 100
UNLEARN_SECONDS = 600  # "that wasn't me" reaches back this far


def _unit(e) -> np.ndarray:
    e = np.asarray(e, dtype=np.float32)
    return e / (np.linalg.norm(e) or 1.0)


class Profiles:
    def __init__(self, data_dir: Path) -> None:
        self.dir = Path(data_dir).expanduser()
        self.dir.mkdir(parents=True, exist_ok=True)
        self.path = self.dir / "profiles.json"
        raw = {}
        if self.path.exists():
            raw = json.loads(self.path.read_text())
        self.thresholds = {**DEFAULT_THRESHOLDS, **raw.get("thresholds", {})}
        self.people: dict[str, list[np.ndarray]] = {
            person: [np.asarray(e, dtype=np.float32) for e in embeddings]
            for person, embeddings in raw.get("people", {}).items()
        }
        self.strangers: list[tuple[float, np.ndarray]] = []
        self.learned: list[tuple[float, str, np.ndarray]] = []

    def save(self) -> None:
        data = {
            "thresholds": self.thresholds,
            "people": {
                person: [e.tolist() for e in embeddings]
                for person, embeddings in self.people.items()
            },
        }
        tmp = self.path.with_suffix(".tmp")
        tmp.write_text(json.dumps(data))
        os.replace(tmp, self.path)  # atomic: a crash mid-write loses nothing

    def add(self, person: str, embedding: np.ndarray) -> int:
        samples = self.people.setdefault(person, [])
        samples.append(np.asarray(embedding, dtype=np.float32))
        del samples[:-MAX_SAMPLES]
        self.save()
        return len(samples)

    def learn(self, person, similarity, candidates, embedding,
              seconds: float) -> bool:
        """Grow a profile from speech it already recognizes with confidence.

        Only sure matches count: one wrong guess saved (the TV, a guest) pulls
        the centroid toward them and every later match gets worse. Live
        speech at the puck is exactly what enrollment lacks, so the profile
        drifts toward how people really sound there.
        """
        if person is None or embedding is None or seconds < MIN_LEARN_SECONDS:
            return False
        if similarity < self.thresholds["learn"]:
            return False
        rivals = [s for p, s in candidates.items() if p != person]
        if rivals and similarity - max(rivals) < self.thresholds["margin"]:
            return False
        sample = np.asarray(embedding, dtype=np.float32)
        self.add(person, sample)
        now = time.time()
        self.learned = [x for x in self.learned
                        if now - x[0] < UNLEARN_SECONDS] + [(now, person, sample)]
        return True

    def unlearn(self, before: float) -> str | None:
        """Drop the newest clip auto-learned before `before` ("that wasn't me").

        `before` is the complaint's own timestamp: the complaint was learned
        too if it sounded confidently like someone, and it is not the clip
        being disowned.
        """
        for i in range(len(self.learned) - 1, -1, -1):
            ts, person, sample = self.learned[i]
            if ts >= before or before - ts > UNLEARN_SECONDS:
                continue
            del self.learned[i]
            samples = self.people.get(person, [])
            for j, s in enumerate(samples):
                if s is sample:
                    del samples[j]
                    if not samples:
                        del self.people[person]
                    self.save()
                    return person
            return None  # already rotated out by newer samples
        return None

    def stranger(self, embedding, seconds: float) -> bool:
        """Remember a voice nobody's profile matched; True if heard before.

        Asking on the first unknown clip would quiz the television; a voice
        that comes back is a person worth asking.
        """
        if embedding is None or seconds < MIN_LEARN_SECONDS:
            return False
        now = time.time()
        self.strangers = [x for x in self.strangers
                          if now - x[0] < STRANGER_SECONDS][-MAX_STRANGERS:]
        e = _unit(embedding)
        same = self.thresholds["same_voice"]
        heard = any(float(e @ s) >= same for _, s in self.strangers)
        self.strangers.append((now, e))
        return heard

    def claim(self, person: str, anchor) -> tuple[int, bool]:
        """Give every remembered stranger clip that sounds like `anchor` to
        `person` - a new profile, or more samples for an existing one.
        -> (clips added, whether the profile is new)."""
        a = _unit(anchor)
        same = self.thresholds["same_voice"]
        mine = [s for _, s in self.strangers if float(a @ s) >= same] or [a]
        self.strangers = [x for x in self.strangers if float(a @ x[1]) < same]
        new = person not in self.people
        samples = self.people.setdefault(person, [])
        samples.extend(mine)
        del samples[:-MAX_SAMPLES]
        self.save()
        return len(mine), new

    def delete(self, person: str) -> bool:
        if person not in self.people:
            return False
        del self.people[person]
        self.save()
        return True

    def counts(self) -> dict[str, int]:
        return {person: len(v) for person, v in self.people.items()}

    def match(self, embedding: np.ndarray | None):
        """-> (person or None, confidence, {person: similarity}).

        person is None below the "uncertain" threshold; candidates are still
        reported so the caller can ask "was that Scott?" instead of guessing.
        """
        if embedding is None or not self.people:
            return None, 0.0, {}
        e = np.asarray(embedding, dtype=np.float32)
        e = e / (np.linalg.norm(e) or 1.0)
        candidates = {}
        for person, samples in self.people.items():
            centroid = np.mean(samples, axis=0)
            centroid = centroid / (np.linalg.norm(centroid) or 1.0)
            candidates[person] = round(float(np.dot(e, centroid)), 4)
        best = max(candidates, key=candidates.get)
        similarity = candidates[best]
        person = best if similarity >= self.thresholds["uncertain"] else None
        return person, similarity, candidates
