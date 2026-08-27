/* The bubble field's one real invariant: held bubbles must not overlap. */
import assert from "node:assert";
import { clearCore, pinToCore, separate, widestGap } from "../src/pack.js";

const bubble = (x, y, r, extra = {}) => ({ x, y, r, held: true, pop: -1, ...extra });
const gap = (a, b) => Math.hypot(b.x - a.x, b.y - a.y) - (a.r + b.r);

// Two circles sitting on top of each other end up touching, not merged.
{
  const f = [bubble(0, 0, 10), bubble(4, 0, 10)];
  separate(f, 4);
  assert.ok(gap(f[0], f[1]) > -0.01, `still overlapping by ${-gap(f[0], f[1])}`);
}

// Perfectly coincident centres have no direction to separate along. Without a
// guard this is a divide by zero and every coordinate becomes NaN, which
// paints nothing at all and looks like the card is broken.
{
  const f = [bubble(50, 50, 8), bubble(50, 50, 8)];
  separate(f, 6);
  assert.ok(Number.isFinite(f[0].x) && Number.isFinite(f[1].x), "NaN from coincident centres");
  assert.ok(gap(f[0], f[1]) > -0.01, "coincident bubbles never separated");
}

// A heap settles with nothing intersecting. The box is sized so the circles
// occupy about a fifth of it - pack them tighter than the ~68% random-packing
// limit and no algorithm can separate them, which tests arithmetic rather
// than code. The real field is looser still: bubbles sit along a ring.
{
  const f = [];
  let seed = 7;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  for (let i = 0; i < 30; i++) f.push(bubble(rnd() * 260, rnd() * 260, 6 + rnd() * 10));
  for (let step = 0; step < 60; step++) separate(f, 2);
  let worst = 0;
  for (let i = 0; i < f.length; i++)
    for (let j = i + 1; j < f.length; j++) worst = Math.min(worst, gap(f[i], f[j]));
  assert.ok(worst > -0.5, `heap still overlaps by ${-worst}`);
}

// Bubbles close but not touching are drawn together — that is what makes them
// clump instead of spreading evenly.
{
  const f = [bubble(0, 0, 10), bubble(26, 0, 10)];
  const before = gap(f[0], f[1]);
  for (let i = 0; i < 20; i++) separate(f, 1);
  assert.ok(gap(f[0], f[1]) < before, "near bubbles did not pull together");
}

// Released and popping bubbles are out of the simulation: a bubble floating
// away must pass straight through the ring, not shoulder its way out.
{
  const f = [bubble(0, 0, 10), bubble(2, 0, 10, { held: false })];
  const x = f[1].x;
  separate(f, 4);
  assert.strictEqual(f[1].x, x, "a released bubble was pushed by the field");
}

// --- nothing may sit inside the core bubble --------------------------------
{
  const core = 40;
  const f = [
    bubble(0, 0, 8, { vx: -50, vy: 0 }),      // right on the centre
    bubble(10, 5, 6, { vx: 0, vy: 0 }),       // buried in the core
    bubble(200, 0, 6, { vx: 0, vy: 0 }),      // well outside, must not move
  ];
  const before = f[2].x;
  clearCore(f, 0, 0, core);
  for (const b of f.slice(0, 2)) {
    const d = Math.hypot(b.x, b.y);
    assert.ok(d >= core + b.r - 0.001, `bubble still inside the core at ${d}`);
    assert.ok(Number.isFinite(b.x) && Number.isFinite(b.y), "NaN from a centred bubble");
  }
  assert.strictEqual(f[2].x, before, "a bubble outside the core was moved");
  // inward speed is cancelled, or it buzzes against the boundary
  assert.ok(f[0].vx >= -0.001, `still driving inward at ${f[0].vx}`);
}

// A released bubble passes straight through the core - it is on its way out.
{
  const f = [bubble(5, 0, 6, { held: false })];
  clearCore(f, 0, 0, 40);
  assert.strictEqual(f[0].x, 5, "a released bubble was pushed out of the core");
}

// --- anchors stay stuck to the core ----------------------------------------
// A rider settling on an anchor pushes it outward, and clearCore is only a
// floor - it stops things sinking in, not drifting off. This is the rail.
{
  const core = 40;
  const a = bubble(80, 0, 10, { anchor: true, vx: 60, vy: 20 });
  pinToCore([a], 0, 0, core);
  assert.ok(Math.abs(Math.hypot(a.x, a.y) - (core + a.r)) < 0.001,
    `anchor sits at ${Math.hypot(a.x, a.y)}, wanted ${core + a.r}`);
  // radial speed gone, tangential kept - take both and the field freezes
  assert.ok(Math.abs(a.vx) < 0.001, "outward velocity survived");
  assert.ok(Math.abs(a.vy - 20) < 0.001, "tangential velocity was taken too");

  // pulled inward as well as pushed out
  const b = bubble(12, 0, 10, { anchor: true, vx: 0, vy: 0 });
  pinToCore([b], 0, 0, core);
  assert.ok(Math.abs(Math.hypot(b.x, b.y) - (core + b.r)) < 0.001, "not pulled back out");

  // riders are not pinned - they belong to their anchor, not the core
  const r = bubble(200, 0, 5, { anchor: false });
  pinToCore([r], 0, 0, core);
  assert.strictEqual(r.x, 200, "a rider was pinned to the core");
}

// --- new bubbles go where the room is --------------------------------------
{
  const TAU = Math.PI * 2;
  const at = (deg, r = 10) =>
    bubble(Math.cos((deg * Math.PI) / 180) * 50, Math.sin((deg * Math.PI) / 180) * 50, r, { anchor: true });

  // a ring with a hole between 90 and 270 degrees
  const { angle, gap } = widestGap([at(0), at(45), at(90), at(270), at(315)], 0, 0);
  const deg = ((angle * 180) / Math.PI + 360) % 360;
  assert.ok(Math.abs(deg - 180) < 1, `filled at ${deg}, expected the hole at 180`);
  assert.ok(Math.abs(gap - Math.PI) < 0.01, `gap ${gap}, expected pi`);

  // the wrap-around gap counts: bubbles clustered near zero leave the rest bare
  const w = widestGap([at(0), at(10), at(20)], 0, 0);
  assert.ok(w.gap > Math.PI, `wrap-around gap missed, got ${w.gap}`);

  // an empty ring is all gap, and must not divide by anything
  const e = widestGap([], 0, 0);
  assert.ok(Math.abs(e.gap - TAU) < 0.001 && Number.isFinite(e.angle), "empty ring");
}

console.log("pack ok");
