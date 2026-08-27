/* Keep a heap of circles from overlapping, and let them stick together.

   Split out of the card because it is the one piece of the bubble field with
   an invariant worth asserting: after it runs, no two held bubbles intersect.
   Everything else in there is taste; this is either true or it is not.

   Position-based rather than force-based. Pushing overlapping circles apart
   directly settles in a frame or two, where a repulsion force overshoots and
   the heap jitters for as long as you watch it. */
export function separate(bubbles, passes = 2, relax = 1) {
  for (let pass = 0; pass < passes; pass++) {
    for (let i = 0; i < bubbles.length; i++) {
      const a = bubbles[i];
      if (!a.held || a.pop >= 0) continue;
      for (let j = i + 1; j < bubbles.length; j++) {
        const c = bubbles[j];
        if (!c.held || c.pop >= 0) continue;
        let dx = c.x - a.x;
        let dy = c.y - a.y;
        let d = Math.hypot(dx, dy);
        // Exactly coincident centres have no direction to separate along;
        // any direction will do, so long as it is not NaN.
        if (d < 1e-3) {
          dx = 0.1;
          dy = 0;
          d = 0.1;
        }
        const touch = a.r + c.r;
        const ux = dx / d;
        const uy = dy / d;
        if (d < touch) {
          const push = (touch - d) * 0.5 * relax;
          a.x -= ux * push;
          a.y -= uy * push;
          c.x += ux * push;
          c.y += uy * push;
        } else if (d > touch * 1.04 && d < touch * 1.5) {
          /* Close but not touching: draw them into contact, so the field
             gathers into clumps instead of spacing itself evenly.

             The dead zone just above contact matters. Without it cohesion
             keeps tugging at a pair already resting against each other, the
             separation pass pushes them back, and the two settle into a
             permanent overlap of a percent or two - small in a number, plainly
             visible as bubbles that have sunk into one another. */
          const grab = (d - touch) * 0.06;
          a.x += ux * grab;
          a.y += uy * grab;
          c.x -= ux * grab;
          c.y -= uy * grab;
        }
      }
    }
  }
  return bubbles;
}

/* Keep the field outside the core bubble.

   The anchors are sprung to the core's surface, but a spring is a suggestion:
   riders shove anchors, anchors shove each other, and anything pushed inward
   sinks straight through the core because separate() only knows about pairs.
   This is the hard constraint that the spring is not - after it runs, nothing
   held is inside the core, whatever the forces wanted.

   Inward velocity is cancelled at the same time. Snapping a bubble back to the
   surface while it still carries speed towards the middle makes it buzz
   against the boundary for as long as the force lasts. */
export function clearCore(bubbles, cx, cy, coreR) {
  for (const b of bubbles) {
    if (!b.held || b.pop >= 0) continue;
    let dx = b.x - cx;
    let dy = b.y - cy;
    let d = Math.hypot(dx, dy);
    if (d < 1e-3) {
      dx = 1;
      dy = 0;
      d = 1;
    }
    const min = coreR + b.r;
    if (d < min) {
      const nx = dx / d;
      const ny = dy / d;
      b.x = cx + nx * min;
      b.y = cy + ny * min;
      const vn = b.vx * nx + b.vy * ny;
      if (vn < 0) {
        b.vx -= vn * nx;
        b.vy -= vn * ny;
      }
    }
  }
  return bubbles;
}

/* Hold the big bubbles onto the core.

   clearCore only stops things sinking *into* the core - it is a floor, not a
   rail. An anchor with a rider settling on it gets pushed outward instead, and
   drifts off the surface it is supposed to be stuck to. This pins the anchors
   to exactly the core's skin, so they can slide around it but never leave it.

   Only the radial part of the velocity is stripped. The tangential part is
   what lets a nudged anchor roll round the core rather than stopping dead,
   and taking it would freeze the whole field solid. */
export function pinToCore(bubbles, cx, cy, coreR, relax = 1) {
  for (const b of bubbles) {
    if (!b.held || b.pop >= 0 || !b.anchor) continue;
    let dx = b.x - cx;
    let dy = b.y - cy;
    let d = Math.hypot(dx, dy);
    if (d < 1e-3) {
      dx = 1;
      dy = 0;
      d = 1;
    }
    const nx = dx / d;
    const ny = dy / d;
    const rest = coreR + b.r;
    /* Eased, not snapped. Moving a bubble the whole way to where the
       constraint wants it in one frame is a teleport, and a field full of
       them reads as jitter however slowly anything is actually drifting.
       relax = 1 is the hard version, used to settle the field before the
       first paint. */
    b.x += (cx + nx * rest - b.x) * relax;
    b.y += (cy + ny * rest - b.y) * relax;
    const vn = b.vx * nx + b.vy * ny;
    b.vx -= vn * nx;
    b.vy -= vn * ny;
  }
  return bubbles;
}

/* The widest bare stretch of the core's surface, and how wide it is.

   New bubbles go here rather than at a random angle, and take their size from
   the room available - which is what makes a refilling ring look like it is
   healing over rather than like circles appearing on top of each other. */
export function widestGap(anchors, cx, cy) {
  const TAU = Math.PI * 2;
  if (!anchors.length) return { angle: 0, gap: TAU };
  const angles = anchors
    .map((b) => Math.atan2(b.y - cy, b.x - cx))
    .sort((p, q) => p - q);
  let gap = -1;
  let angle = 0;
  for (let i = 0; i < angles.length; i++) {
    const a0 = angles[i];
    // The last gap wraps past pi back to the first bubble.
    const a1 = i + 1 < angles.length ? angles[i + 1] : angles[0] + TAU;
    const g = a1 - a0;
    if (g > gap) {
      gap = g;
      angle = a0 + g / 2;
    }
  }
  return { angle, gap };
}

/* Bubbles of a like size that touch for long enough become one bubble.

   Area is conserved, so the survivor's radius is the root of the sum of
   squares - two equal bubbles make one about 1.41 times the radius, not twice
   it. Doubling the radius quadruples the area and the foam visibly gains
   substance out of nowhere.

   Only near-equals merge. Real foam does this too, but the reason here is
   legibility: let a big one swallow a small one and the field converges on a
   few giants within seconds, and the small bubbles that make it read as foam
   are gone. `rate` is per second and the roll is per frame, so merging looks
   like something that happens rather than something that is switched on. */
export function coalesce(bubbles, opts) {
  const { dt, rate, maxRatio, maxR, sizeBias = 0, rand = Math.random } = opts;
  let merged = 0;
  for (let i = 0; i < bubbles.length; i++) {
    const a = bubbles[i];
    if (!a.held || a.pop >= 0 || a.gone) continue;
    for (let j = i + 1; j < bubbles.length; j++) {
      const b = bubbles[j];
      if (!b.held || b.pop >= 0 || b.gone) continue;
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      if (d > a.r + b.r + 1) continue;
      const ratio = a.r >= b.r ? a.r / b.r : b.r / a.r;
      if (ratio > maxRatio) continue;
      const grown = Math.sqrt(a.r * a.r + b.r * b.r);
      if (grown > maxR) continue;
      /* Size bias: the smaller of the pair decides how eagerly they fuse, so
         two specks linger and two half-grown bubbles join readily. Without it
         a flat rate makes the small ones disappear on contact and the field
         never looks fine-grained. */
      const small = Math.min(a.r, b.r);
      const eager = sizeBias
        ? Math.pow(Math.min(1, small / maxR), 1 / sizeBias)
        : 1;
      if (rand() > rate * eager * dt) continue;

      const keep = a.r >= b.r ? a : b;
      const lost = keep === a ? b : a;
      const wk = keep.r * keep.r;
      const wl = lost.r * lost.r;
      const tot = wk + wl;
      keep.x = (keep.x * wk + lost.x * wl) / tot;
      keep.y = (keep.y * wk + lost.y * wl) / tot;
      keep.vx = (keep.vx * wk + lost.vx * wl) / tot;
      keep.vy = (keep.vy * wk + lost.vy * wl) / tot;
      keep.r = grown;
      keep.full = grown;
      // A fused bubble is a new bubble: a fresh lease on life, rather than
      // inheriting whichever parent happened to be closest to bursting.
      keep.age = 0;
      lost.gone = true;
      merged++;
      if (keep === a) continue;
      break;
    }
  }
  if (merged) {
    for (let i = bubbles.length - 1; i >= 0; i--) {
      if (bubbles[i].gone) bubbles.splice(i, 1);
    }
  }
  return merged;
}

/* Slide bubbles apart along the core's surface.

   separate() pushes overlapping circles apart in a straight line, and then
   pinToCore drags anything on the core straight back onto it - undoing most
   of what separate just did and leaving the big ones visibly interpenetrating.
   The two constraints fight because they pull in different directions.

   The fix is to resolve those overlaps the only way that does not break the
   pin: tangentially. Neighbours slide around the core rather than off it, so
   both constraints hold at once. Angles are compared with the shortest signed
   difference, or a pair either side of pi push each other the wrong way round
   and swap places every frame. */
export function spreadOnCore(bubbles, cx, cy, coreR, passes = 2, relax = 1) {
  const on = bubbles.filter((b) => b.held && b.pop >= 0 === false && b.anchor);
  if (on.length < 2) return bubbles;
  for (let pass = 0; pass < passes; pass++) {
    for (let i = 0; i < on.length; i++) {
      for (let j = i + 1; j < on.length; j++) {
        const a = on[i];
        const b = on[j];
        const da = coreR + a.r;
        const db = coreR + b.r;
        const aa = Math.atan2(a.y - cy, a.x - cx);
        const ab = Math.atan2(b.y - cy, b.x - cx);
        let diff = ab - aa;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        // Straight-line distance between two points at their own radii.
        const d = Math.sqrt(
          da * da + db * db - 2 * da * db * Math.cos(diff)
        );
        const touch = a.r + b.r;
        if (d >= touch) continue;
        // Convert the shortfall into an angle at the mean radius and split it.
        const mean = (da + db) / 2;
        const push = ((touch - d) / mean) * 0.5 * relax;
        const dir = diff >= 0 ? 1 : -1;
        const na = aa - dir * push;
        const nb = ab + dir * push;
        a.x = cx + Math.cos(na) * da;
        a.y = cy + Math.sin(na) * da;
        b.x = cx + Math.cos(nb) * db;
        b.y = cy + Math.sin(nb) * db;
      }
    }
  }
  return bubbles;
}

/* Whether a bubble's time is up.

   Two clocks, and the reason for both is a failure worth remembering: with
   only the size rule, the field ran for half a minute and then froze solid.
   Once the packing settles nothing is pressed hard enough against anything
   else to merge, so nothing grows, so nothing ever reaches the size that
   bursts, so no gaps open and nothing new is made. A foam that can only
   change by luck eventually stops changing.

   Age is the floor that cannot stall. Size scales it - a big bubble lives
   longer than a small one and then goes suddenly - because a flat lifespan
   killed the little ones before they could merge their way up, leaving the
   field uniformly small and making merging pointless. */
export function shouldBurst(b, opts) {
  const { dt, maxR, rand = Math.random } = opts;
  const t = b.r / maxR;
  if (b.r >= maxR * 0.995) return true;
  if (b.age > b.span * (0.55 + 1.7 * t)) return true;
  const chance = t > 0.7 ? 0.5 * Math.pow(t, 6) : 0;
  return chance > 0 && rand() < chance * dt;
}
