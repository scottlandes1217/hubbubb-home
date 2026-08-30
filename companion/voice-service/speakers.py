"""Speaker profiles: enrolled embeddings per person, cosine-centroid matching.

Everything tunable lives in profiles.json next to the embeddings, not in code:
similarity thresholds drift with microphones and room acoustics, so they are a
calibration knob, not a constant.
"""

from __future__ import annotations

import json
import os
from pathlib import Path

import numpy as np

DEFAULT_THRESHOLDS = {"confident": 0.75, "uncertain": 0.60}
MAX_SAMPLES = 40  # per person; oldest dropped first


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
