/* Paths in a reply become links. A path is at least one slash, and either
   rooted (~, /, ./) or ending in an extension, so "and/or", "24/7" and URLs
   stay text. A trailing :line rides along; trailing sentence punctuation does
   not. No lookbehind on purpose: the wall tablet's webview rejects it at parse
   time, which takes the whole module down. */
const PATH_RE =
  /(^|[^\w:/@.~-])((?:~|\.{1,2})?\/[\w.@~-]+(?:\/[\w.@~-]+)*|[\w.@-]+(?:\/[\w.@-]+)+\.\w+)(:\d+)?/g;

/* "see a/b.js:12." -> ["see ", {path: "a/b.js", line: ":12"}, "."] */
export function splitPaths(text) {
  const out = [];
  let i = 0;
  for (const hit of text.matchAll(PATH_RE)) {
    let path = hit[2];
    const line = hit[3] || "";
    const start = hit.index + hit[1].length;
    while (/[.,;]$/.test(path)) path = path.slice(0, -1);
    if (start > i) out.push(text.slice(i, start));
    out.push({ path, line });
    i = start + path.length + line.length;
  }
  if (i < text.length) out.push(text.slice(i));
  return out;
}

/* What a sent prompt looks like once Claude Code records it: attached paths
   turn into "[Image #n]" or vanish, and long messages are capped. So the
   key for "has the transcript got this yet" is the words alone, capped. */
export function promptKey(text) {
  return splitPaths(text.replace(/\[Image #\d+\]/g, " "))
    .filter((p) => typeof p === "string")
    .join(" ")
    .split(/\s+/)
    .join(" ")
    .trim()
    .slice(0, 200);
}
