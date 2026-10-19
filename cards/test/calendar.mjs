/* node cards/test/calendar.mjs — the calendar's pure parts. */
import assert from "node:assert/strict";
globalThis.customElements = { get: () => true }; // skip define(); no DOM in node
globalThis.HTMLElement = class {};
const { layoutDay, nowNext, parseEvent, step, until, viewRange } = await import("../src/hubbubb-calendar.js");

const t = (h, m = 0) => new Date(2026, 9, 19, h, m);
const ev = (title, s, e) => ({ title, start: s, end: e, allDay: false });

// all-day dates are local, not UTC midnight
const ad = parseEvent({ summary: "Off", start: { date: "2026-10-19" }, end: { date: "2026-10-20" } }, {});
assert.equal(ad.allDay, true);
assert.equal(+ad.start, +new Date(2026, 9, 19));

// overlaps share a cluster's width; a later free event gets the full column
const lay = layoutDay([ev("a", t(9), t(10)), ev("b", t(9, 30), t(11)), ev("c", t(10), t(10, 30)), ev("d", t(12), t(13))]);
const by = Object.fromEntries(lay.map((e) => [e.title, [e.lane, e.lanes]]));
assert.deepEqual(by, { a: [0, 2], b: [1, 2], c: [0, 2], d: [0, 1] });

const { current, next } = nowNext([ev("a", t(9), t(10)), ev("b", t(11), t(12)), { ...ev("x", t(0), t(23)), allDay: true }], t(9, 30));
assert.deepEqual(current.map((e) => e.title), ["a"]);
assert.equal(next.title, "b");
assert.equal(nowNext([ev("a", t(9), t(10))], t(11)).next, null);

assert.equal(until(95 * 60000), "1 h 35 min");
assert.equal(until(60 * 60000), "1 h");
assert.equal(until(20000), "now");

// 2026-10-19 is a Monday: its week starts Sunday the 18th; October's grid starts Sep 27
assert.deepEqual(viewRange("week", t(15)).map((d) => d.getDate()), [18, 25]);
const [mFrom, mTo] = viewRange("month", t(15));
assert.deepEqual([mFrom.getMonth(), mFrom.getDate(), (mTo - mFrom) / 86400000 | 0], [8, 27, 42]);
assert.equal(step("month", new Date(2026, 0, 31), 1).getMonth(), 1); // Jan 31 -> Feb, not March
assert.equal(step("week", t(1), -1).getDate(), 12);
console.log("calendar ok");
