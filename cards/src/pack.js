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
