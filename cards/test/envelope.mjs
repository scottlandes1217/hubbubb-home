/* node test/envelope.mjs — the one bit of the audio path that is pure maths.
   A 1s tone at half amplitude then 1s of silence must come out as a second
   of 1s followed by a second of 0s, read back at the right bin. */
import assert from "node:assert/strict";
import { rmsEnvelope } from "../src/envelope.js";

const RATE = 8000, HZ = 50;
const ch = new Float32Array(RATE * 2);
for (let i = 0; i < RATE; i++) ch[i] = 0.5 * Math.sin((i / RATE) * 440 * 6.283);
const env = rmsEnvelope(ch, RATE, HZ);

assert.equal(env.length, 2 * HZ);
assert.ok(env[10] > 0.99, `loudest bin normalises to 1, got ${env[10]}`);
assert.equal(env[env.length - 10], 0, "silence reads as zero");
// how the card reads it back: seconds -> bin index
assert.ok(env[Math.round(0.5 * HZ)] > 0.99 && env[Math.round(1.5 * HZ)] === 0);
console.log("envelope ok");
