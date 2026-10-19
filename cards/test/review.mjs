import assert from "node:assert";
import { groupProposals, markup } from "../src/review-groups.js";

const g = groupProposals([
  { id: "a", status: "pending", last_seen: "2026-09-13" },
  { id: "b", status: "done", last_seen: "2026-09-14" },
  { id: "c", status: "pending", last_seen: "2026-09-14" },
  { id: "d", status: "accepted", last_seen: "2026-09-14" },
  { id: "e", status: "rejected", last_seen: "2026-09-12" },
]);
assert.deepStrictEqual(g.pending.map((p) => p.id), ["c", "a"]);
assert.deepStrictEqual(g.accepted.map((p) => p.id), ["d"]);
assert.deepStrictEqual(g.decided.map((p) => p.id), ["b", "e"]);
assert.deepStrictEqual(groupProposals(undefined), { pending: [], accepted: [], decided: [] });

const esc = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
assert.strictEqual(markup("say **hi** to `x<y`\nnow", esc), "say <b>hi</b> to <code>x&#60;y</code><br>now");
assert.strictEqual(markup("<script>", esc), "&#60;script&#62;");

// Exercise the actual modal card's button and service call without applying
// real household findings. HA supplies the DOM and automation in production.
let ReviewCard;
globalThis.HTMLElement = class {
  querySelectorAll() { return []; }
  querySelector(selector) {
    return { addEventListener: (event, fn) => { this.handlers ??= {}; this.handlers[selector] = fn; } };
  }
};
globalThis.customElements = { define: (_, cls) => { ReviewCard = cls; } };
globalThis.window = {};
await import("../src/hubbubb-review-card.js");
const automationId = "automation.jarvis_apply_accepted_nightly_findings";
const card = new ReviewCard();
card.setConfig({ entity: "sensor.jarvis_review" });
const calls = [];
let resolveCall, rejectCall;
const hass = {
  states: {
    "sensor.jarvis_review": { attributes: { proposals: [] } },
    [automationId]: { state: "on", attributes: { current: 0 } },
  },
  callService: (...args) => {
    calls.push(args);
    return new Promise((resolve, reject) => { resolveCall = resolve; rejectCall = reject; });
  },
};
const button = () => card.innerHTML.match(/<button[^>]*data-apply[^>]*>[\s\S]*?<\/button>/)[0];
card.hass = hass;
assert.match(button(), /disabled/, "nothing accepted cannot be applied");
await card._apply();
assert.equal(calls.length, 0);
hass.states["sensor.jarvis_review"].attributes.proposals = [
  { id: "accepted", status: "accepted", kind: "defect", title: "Accepted fix" },
  { id: "pending", status: "pending", kind: "suggestion", title: "Pending idea" },
];
card.hass = hass;
assert.doesNotMatch(button(), /disabled/);
assert.match(button(), />Apply Findings</);
const applying = card.handlers["[data-apply]"]();
assert.deepStrictEqual(calls, [["automation", "trigger", { entity_id: automationId, skip_condition: true }]]);
assert.match(button(), /disabled/);
assert.match(button(), /Applying…/);
await card._apply();
assert.equal(calls.length, 1, "double click cannot send twice");
resolveCall(); await applying;
assert.match(card.innerHTML, /apply request sent/);
assert.doesNotMatch(button(), /disabled/);
assert.equal(hass.states["sensor.jarvis_review"].attributes.proposals[0].status, "accepted",
  "request acknowledgement does not falsely mark a finding done");

hass.states[automationId].attributes.current = 1;
card.hass = hass;
assert.match(button(), /disabled/);
assert.match(button(), /Applying…/);
await card._apply();
assert.equal(calls.length, 1, "automatic acceptance run prevents manual duplicates");
hass.states[automationId].attributes.current = 0;
card.hass = hass;
const failing = card.handlers["[data-apply]"]();
rejectCall(new Error("Connection lost")); await failing;
assert.match(card.innerHTML, /Apply Findings failed: Connection lost/);
assert.doesNotMatch(button(), /disabled/, "failed request can be retried");

const customId = "automation.other_review_apply";
card.setConfig({ entity: "sensor.jarvis_review", apply_automation: customId });
card.hass = hass;
assert.match(button(), /disabled/, "missing automation cannot be called");
await card._apply();
assert.equal(calls.length, 2);
hass.states[customId] = { state: "unavailable", attributes: {} };
card.hass = hass;
await card._apply();
assert.equal(calls.length, 2);
hass.states[customId].state = "on";
card.hass = hass;
const customApply = card.handlers["[data-apply]"]();
assert.equal(calls.at(-1)[2].entity_id, customId, "respects configured apply workflow");
resolveCall(); await customApply;
console.log("review grouping, markup, and Apply Findings actions ok");
