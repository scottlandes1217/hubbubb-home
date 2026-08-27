/* The foam must never stop moving.

   This is a regression test for a real failure: an earlier version looked
   right for about thirty seconds and then froze completely - no merging, no
   bursting, nothing created - because the only thing that could end a bubble
   was growing into the ceiling, and once the packing settles nothing is
   pressed hard enough against anything else to grow. The bug is invisible in
   any short run and obvious after a minute, so the check is a long run that
   asserts the *last* window is still busy, not the total.
*/
import assert from "node:assert";
import { clearCore, coalesce, pinToCore, separate, shouldBurst, spreadOnCore, widestGap }
  from "../src/pack.js";

const half = 235;
const core = half * 0.42;
const minAnchor = half * 0.058;
const maxR = half * 0.13;
const MAX = 22;
const dt = 1 / 60;

// deterministic, so a failure is reproducible rather than a bad afternoon
let seed = 20260827;
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const newR = () => half * (0.03 + Math.pow(rnd(), 1.6) * 0.028);

const spawn = (a, r) => {
  const rad = r ?? newR();
  return {
    x: Math.cos(a) * (core + rad), y: Math.sin(a) * (core + rad),
    vx: 0, vy: 0, r: rad, full: rad, anchor: rad >= minAnchor,
    held: true, pop: -1, life: 0, age: 0, span: 22 + rnd() * 30,
  };
};

const bub = [];
for (let i = 0; i < MAX; i++) bub.push(spawn((i / MAX) * Math.PI * 2, Math.min(newR() * (1 + rnd() * 2.2), maxR)));

const windows = [];
let merges = 0, bursts = 0, spawns = 0;
for (let step = 0; step < 60 * 150; step++) {
  for (const b of bub) if (b.held && b.pop < 0) b.anchor = b.r >= minAnchor;
  for (const b of bub) {
    if (b.pop >= 0) { b.pop += dt; continue; }
    const d = Math.hypot(b.x, b.y) || 1;
    if (b.held) {
      const rest = core + b.r;
      b.vx += ((b.x / d) * (rest - d) * 8 - (b.y / d) * half * 0.2) * dt;
      b.vy += ((b.y / d) * (rest - d) * 8 + (b.x / d) * half * 0.2) * dt;
      b.vx *= Math.exp(-dt * 3.4); b.vy *= Math.exp(-dt * 3.4);
    } else {
      b.life += dt; b.vy -= half * 0.85 * dt; b.vx *= Math.exp(-dt * 0.9);
      if (b.life > 1.4) { b.pop = 0; }
    }
    b.x += b.vx * dt; b.y += b.vy * dt;
  }
  separate(bub, 2);
  clearCore(bub, 0, 0, core);
  pinToCore(bub, 0, 0, core);
  spreadOnCore(bub, 0, 0, core, 2);
  merges += coalesce(bub, { dt, rate: 0.2, sizeBias: 3, maxRatio: 2.1, maxR, rand: rnd });

  for (const b of bub) {
    if (!b.held || b.pop >= 0) continue;
    b.age += dt;
    if (shouldBurst(b, { dt, maxR, rand: rnd })) { b.held = false; b.pop = 0; bursts++; }
  }
  for (let i = bub.length - 1; i >= 0; i--) if (bub[i].pop > 0.62) bub.splice(i, 1);

  let guard = 0;
  while (guard++ < 4) {
    const held = bub.filter((b) => b.held && b.pop < 0);
    const onCore = held.filter((b) => Math.hypot(b.x, b.y) <= core + b.r * 1.7);
    const { angle, gap } = widestGap(onCore, 0, 0);
    const room = Math.sin(Math.min(gap, Math.PI) / 2) * core;
    if (onCore.length > 1 && room < newR() * 1.4) break;
    const bare = room > minAnchor * 1.5;
    if (held.length >= MAX && !bare) break;
    if (held.length >= MAX * 1.7) break;
    bub.push(spawn(angle)); spawns++;
  }

  if (step > 0 && step % (60 * 30) === 0) {
    windows.push({ merges, bursts, spawns, n: bub.filter((b) => b.held && b.pop < 0).length });
    merges = bursts = spawns = 0;
  }
}

const last = windows[windows.length - 1];
assert.ok(windows.length >= 4, "not enough windows measured");
assert.ok(last.bursts > 0, "the foam stopped bursting - it has frozen");
assert.ok(last.spawns > 0, "nothing new is being made - it has frozen");
assert.ok(last.n > 5, `population collapsed to ${last.n}`);
assert.ok(last.n < MAX * 2, `population ran away to ${last.n}`);
// and it must not have quietly died at any point after the first window
for (const w of windows.slice(1)) {
  assert.ok(w.bursts + w.spawns > 0, "a window with no activity at all");
}
assert.ok(bub.every((b) => Number.isFinite(b.x) && Number.isFinite(b.r)), "NaN in the field");

console.log(`foam ok - still busy after 150s (last 30s: ${last.bursts} bursts, ${last.spawns} new, ${last.n} bubbles)`);
