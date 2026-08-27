/* The bubble field's one real invariant: held bubbles must not overlap. */
import assert from "node:assert";
import { separate } from "../src/pack.js";

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

console.log("pack ok");
