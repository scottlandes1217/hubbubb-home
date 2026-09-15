/* The nightly review's proposals, split the way the card shows them: what is
   waiting for a decision, what is accepted and waiting to be applied, and
   what is already decided (kept, so nothing is ever silently lost). */
export function groupProposals(list) {
  const out = { pending: [], accepted: [], decided: [] };
  for (const p of Array.isArray(list) ? list : []) {
    if (p.status === "pending") out.pending.push(p);
    else if (p.status === "accepted") out.accepted.push(p);
    else out.decided.push(p);
  }
  // Newest first within a group; the id keeps ties stable.
  const key = (p) => (p.last_seen || "") + (p.first_seen || "") + p.id;
  for (const g of Object.values(out)) g.sort((a, b) => (key(a) < key(b) ? 1 : -1));
  return out;
}

/* Just enough of the report's markdown to read: bold, code, line breaks. The
   input is escaped first; nothing in it can become a tag. */
export function markup(text, esc) {
  return esc(text || "")
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/`([^`\n]+)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");
}
