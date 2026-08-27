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
