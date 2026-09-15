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
console.log("review ok");
