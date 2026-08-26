/* RMS loudness envelope of a decoded audio buffer: one bin every 1/hz of a
   second, normalised so the loudest bin is 1. Split out from the card only
   so it can be asserted without a browser — see test/envelope.mjs. */
export function rmsEnvelope(ch, sampleRate, hz) {
  const step = Math.max(1, Math.round(sampleRate / hz));
  const env = new Float32Array(Math.ceil(ch.length / step));
  let peak = 1e-6;
  for (let i = 0, k = 0; i < ch.length; i += step, k++) {
    const end = Math.min(ch.length, i + step);
    let sum = 0;
    for (let j = i; j < end; j++) sum += ch[j] * ch[j];
    const v = Math.sqrt(sum / (end - i));
    env[k] = v;
    if (v > peak) peak = v;
  }
  for (let i = 0; i < env.length; i++) env[i] = Math.min(1, env[i] / peak);
  return env;
}

