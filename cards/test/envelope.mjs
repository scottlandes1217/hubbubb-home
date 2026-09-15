/* node test/envelope.mjs — the one bit of the audio path that is pure maths.
   A 1s tone at half amplitude then 1s of silence must come out as a second
   of 1s followed by a second of 0s, read back at the right bin. */
import assert from "node:assert/strict";
import { downsampler, rmsEnvelope } from "../src/envelope.js";

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

// downsampler: a 48k sine fed in 2048-sample buffers comes out as the same
// sine at 16k — right length, right pitch, no seams between buffers.
{
  const FROM = 48000, TO = 16000, HZ = 440, SECS = 1;
  const src = new Float32Array(FROM * SECS);
  for (let i = 0; i < src.length; i++) src[i] = 0.5 * Math.sin((2 * Math.PI * HZ * i) / FROM);
  const down = downsampler(FROM, TO);
  const parts = [];
  for (let i = 0; i < src.length; i += 2048) parts.push(down(src.subarray(i, i + 2048)));
  const total = parts.reduce((n, p) => n + p.length, 0);
  assert.equal(total, TO * SECS);
  let worst = 0, k = 0;
  for (const p of parts)
    for (const v of p) {
      const want = 0.5 * Math.sin((2 * Math.PI * HZ * k++) / TO) * 0x7fff;
      worst = Math.max(worst, Math.abs(v - want));
    }
  assert.ok(worst < 0x7fff * 0.01, `resample error ${worst}`);
  // identity rate is a straight int16 conversion
  const same = downsampler(16000, 16000)(new Float32Array([0, 1, -1]));
  assert.deepEqual([...same], [0, 0x7fff, -0x8000]);
}
console.log("downsampler ok");
