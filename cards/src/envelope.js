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


/* Linear resampler for a live mic stream: makes a Downsampler that turns
   successive Float32 buffers at `from` Hz into int16 PCM at `to` Hz. It keeps
   its fractional position and the last sample across calls, so buffer seams
   do not click. Lives here so it can be asserted without a browser. */
export function downsampler(from, to) {
  const step = from / to;
  let pos = 0; // read position in the current buffer, may start below 0
  let last = 0; // final sample of the previous buffer, for pos < 0
  return (f) => {
    const n = f.length;
    const out = new Int16Array(Math.max(0, Math.ceil((n - pos) / step)));
    let k = 0;
    for (; pos < n; pos += step) {
      const i = Math.floor(pos);
      const a = i < 0 ? last : f[i];
      const b = i + 1 < n ? f[i + 1] : a;
      const v = Math.max(-1, Math.min(1, a + (b - a) * (pos - i)));
      out[k++] = v < 0 ? v * 0x8000 : v * 0x7fff;
    }
    pos -= n;
    last = n ? f[n - 1] : last;
    return k === out.length ? out : out.subarray(0, k);
  };
}
