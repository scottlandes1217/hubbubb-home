/* Caption timing, pure so test/captions.mjs can assert it without a browser. */

/* Split a reply into caption cards of at most `max` words, cutting after a
   sentence end where one is near, else after a comma, else at the limit. */
export function captionChunks(text, max = 12) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  const chunks = [];
  let cur = [];
  for (let i = 0; i < words.length; i++) {
    cur.push(words[i]);
    const w = words[i];
    const left = words.length - i - 1;
    const end = /[.!?…]["')\]]*$/.test(w);
    const pause = /[,;:—–]$/.test(w);
    // A cut that would leave one or two orphan words is not worth it.
    const fine = left === 0 || left > 2;
    // over the limit, but a sentence that ends within three words keeps going
    const ending = words.slice(i + 1, i + 4).some((x) => /[.!?…]["')\]]*$/.test(x));
    if (
      left === 0 ||
      (cur.length >= max && !(ending && cur.length < max + 3)) ||
      (fine && end && cur.length >= 3) ||
      (fine && pause && cur.length >= max * 0.6)
    ) {
      chunks.push(cur);
      cur = [];
    }
  }
  return chunks;
}

/* Where the voice is, as [chunk, words shown in it], for progress 0-1.
   Words are weighted by length so a long word takes longer to say. */
export function captionAt(chunks, p) {
  const flat = chunks.flat();
  if (!flat.length) return [0, 0];
  const total = flat.reduce((s, w) => s + w.length + 1, 0);
  let budget = Math.max(0, Math.min(1, p)) * total;
  let n = 0;
  for (const w of flat) {
    if (budget <= 0) break;
    budget -= w.length + 1;
    n++;
  }
  if (p >= 1) n = flat.length;
  for (let c = 0; c < chunks.length; c++) {
    if (n <= chunks[c].length || c === chunks.length - 1)
      return [c, Math.min(n, chunks[c].length)];
    n -= chunks[c].length;
  }
  return [0, 0];
}
