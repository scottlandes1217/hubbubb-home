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
