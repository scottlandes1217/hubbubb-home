/* node cards/test/captions.mjs - subtitle chunking and word timing. */
import assert from "node:assert/strict";
import { captionAt, captionChunks } from "../src/caption-text.js";

const short = captionChunks("Turning on the heater, sir.");
assert.deepEqual(short, [["Turning", "on", "the", "heater,", "sir."]]);

// sentence ends cut, but never leave an orphan of one or two words
const two = captionChunks("The heater is on. It should warm up in about ten minutes. Okay?");
assert.deepEqual(two.map((c) => c.join(" ")), [
  "The heater is on.",
  "It should warm up in about ten minutes. Okay?",
]);

// a sentence a little over the limit is kept whole
const over = captionChunks("The heater is on, sir, and the living room lights are at thirty percent. It should be warm in about ten minutes.");
assert.equal(over[0].join(" "), "The heater is on, sir, and the living room lights are at thirty percent.");

// a long run-on breaks at the word limit
const long = captionChunks(Array.from({ length: 30 }, (_, i) => `w${i}`).join(" "), 12);
assert.deepEqual(long.map((c) => c.length), [12, 12, 6]);
assert.ok(long.every((c) => c.length <= 12));

// timing walks through the chunks and lands on every word at the end
assert.deepEqual(captionAt(two, 0), [0, 0]);
assert.deepEqual(captionAt(two, 1), [1, 9]);
const mid = captionAt(two, 0.5);
assert.equal(mid[0], 1, "halfway through is into the second sentence");
let last = -1;
for (let p = 0; p <= 1.0001; p += 0.01) {
  const [c, n] = captionAt(two, p);
  const flat = (c ? two[0].length : 0) + n;
  assert.ok(flat >= last, "words never un-reveal");
  last = flat;
}
assert.deepEqual(captionAt([], 0.5), [0, 0]);
assert.deepEqual(captionChunks(""), []);
console.log("captions ok");
