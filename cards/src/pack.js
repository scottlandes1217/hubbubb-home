/* Keep a heap of circles from overlapping, and let them stick together.

   Split out of the card because it is the one piece of the bubble field with
   an invariant worth asserting: after it runs, no two held bubbles intersect.
   Everything else in there is taste; this is either true or it is not.

   Position-based rather than force-based. Pushing overlapping circles apart
   directly settles in a frame or two, where a repulsion force overshoots and
   the heap jitters for as long as you watch it. */
export function separate(bubbles, passes = 2) {
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
          const push = (touch - d) * 0.5;
          a.x -= ux * push;
          a.y -= uy * push;
          c.x += ux * push;
          c.y += uy * push;
        } else if (d < touch * 1.5) {
          // Close but not touching: draw them into contact, so the field
          // gathers into clumps instead of spacing itself evenly.
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
export function pinToCore(bubbles, cx, cy, coreR) {
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
    b.x = cx + nx * rest;
    b.y = cy + ny * rest;
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
