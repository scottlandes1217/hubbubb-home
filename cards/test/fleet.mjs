/* node cards/test/fleet.mjs — the Fleet panel's pure parts. */
import assert from "node:assert/strict";
import { agentState, byFeature, fmtElapsed, liveCount, roleClass } from "../src/hubbubb-fleet.js";

const agents = [
  { id: "@1", feature: "flows", alive: true, busy: true, elapsed: 75, edits: [] },
  { id: "@2", feature: "flows", alive: true, busy: false, elapsed: null, edits: ["a.rb"] },
  { id: "@3", feature: "ai", alive: false, busy: false, edits: [] },
];
assert.deepEqual(Object.keys(byFeature(agents)), ["flows", "ai"]);
assert.equal(byFeature(agents).flows.length, 2);
assert.deepEqual(byFeature([]), {});
assert.equal(fmtElapsed(75), "1m 15s");
assert.equal(fmtElapsed(9.4), "9s");
assert.equal(fmtElapsed(null), "");
assert.equal(agentState(agents[0]), "working 1m 15s");
assert.equal(agentState(agents[1]), "idle · reported");
assert.equal(agentState(agents[2]), "offline");
assert.equal(liveCount(agents), 2);
assert.equal(liveCount(undefined), 0);
assert.equal(roleClass("assistant"), "a");
assert.equal(roleClass("mystery"), "o");
console.log("fleet ok");

import { layout, splitName, W, H } from "../src/hubbubb-fleet.js";
const feats = "abcdefghij".split("").map((id) => ({ id, name: id }));
const links = [["a", "b"], ["b", "c"], ["c", "d"], ["a", "e"], ["f", "g"]];
const pos = layout(feats, links);
assert.equal(Object.keys(pos).length, 10);
for (const { x, y } of Object.values(pos)) assert.ok(x >= 0 && x <= W && y >= 0 && y <= H, "inside the map");
const ids = Object.keys(pos);
for (let i = 0; i < ids.length; i++)
  for (let j = i + 1; j < ids.length; j++)
    assert.ok(Math.hypot(pos[ids[i]].x - pos[ids[j]].x, pos[ids[i]].y - pos[ids[j]].y) >= 140, "hubs apart");
assert.deepEqual(layout(feats, links), pos, "deterministic");
const linked = Math.hypot(pos.a.x - pos.b.x, pos.a.y - pos.b.y);
const far = Math.hypot(pos.a.x - pos.j.x, pos.a.y - pos.j.y);
assert.ok(linked < far, "linked nodes sit closer than strangers");
assert.deepEqual(splitName("Flows"), ["Flows"]);
assert.deepEqual(splitName("Records & Objects"), ["Records &", "Objects"]);
assert.deepEqual(splitName("Email Templates & Sending"), ["Email Templates &", "Sending"]);
console.log("layout ok");
