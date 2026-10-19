/* Regression coverage for actual card audio ownership and mesh geometry. */
import assert from 'node:assert/strict';
const registry = new Map();
globalThis.window = {};
globalThis.customElements = { get: n => registry.get(n), define: (n, c) => registry.set(n, c) };
await import('../src/hubbubb-ring-card.js');
const Card = registry.get('hubbubb-ring-card');
const make = () => {
  const c = new Card();
  c._config = { animation: 'jarvis-im3', audio_offset: 0 };
  c._speech = { t: 0, next: 0, env: 0, count: 0, pulses: [], spikes: [] };
  c._t = 0;
  return c;
};
const audio = () => ({ currentTime: 0.2, paused: false, ended: false, readyState: 4 });
{
  const c = make(), el = audio(), wave = new Float32Array(50).fill(0.7);
  c._envEl = el; c._env = wave; c._envUrl = 'blob:local';
  for (const state of ['idle', 'playing', 'paused']) {
    c._audioSync({ state, attributes: {media_content_id: '/other'} });
    assert.equal(c._env, wave, 'satellite updates cannot steal local waveform');
    assert.equal(c._envUrl, 'blob:local');
  }
  assert.ok(c._audioLevel() > 0.69);
  for (const [key, value] of [['paused', true], ['ended', true], ['readyState', 2], ['currentTime', 0]]) {
    const old = el[key]; el[key] = value;
    assert.equal(c._audioLevel(), 0, `${key} means silence`); el[key] = old;
  }
  el.currentTime = 1.1;
  assert.equal(c._audioLevel(), 0, 'past audio end stays silent');
  c._env = null; c._decodePending = true;
  assert.equal(c._audioLevel(), 0, 'decode gap does not invent syllables');
}
{
  const c = make(), wave = new Float32Array([0.5]);
  c._state = 'responding'; c._env = wave; c._envUrl = '/prefetched';
  c._audioSync({state: 'idle'});
  assert.equal(c._env, wave, 'prefetch survives waiting for speaker');
  c._audioSync({state:'playing', attributes:{}, last_changed:new Date().toISOString()});
  assert.equal(c._env, wave, 'player without URL uses prefetched waveform');
  c._audioSync({state:'idle'});
  assert.equal(c._env, null, 'finished remote audio is cleared');
}
{
  const c = make();
  let rejectOld, finishNew;
  window.AudioContext = class {decodeAudioData(bytes) {
    return new Promise((resolve, reject) => { if (bytes === 'old') rejectOld = reject; else finishNew = resolve; });
  }};
  c._envUrl = '/same';
  const old = c._decodeAudio('/same', 'old');
  const newer = c._decodeAudio('/same', 'new');
  finishNew({sampleRate: 100, getChannelData: () => new Float32Array(100).fill(0.5)});
  await newer;
  const wave = c._env;
  rejectOld(new Error('old decode failed')); await old;
  assert.equal(c._env, wave, 'late failed decode cannot wipe a newer one, even at same URL');
  assert.equal(c._decodePending, false);
}
{
  const c = make(); let decoded;
  c._decodeAudio = (url, bytes) => { decoded = [url, bytes]; };
  const el = audio(); c._trackSpeech(el, '/local', 'bytes');
  assert.equal(c._envEl, el); assert.deepEqual(decoded, ['/local','bytes']);
  assert.equal(c._voiceState, 'responding');
  c._releaseSpeech({}); assert.equal(c._envEl, el, 'stale player cannot clear current one');
  c._releaseSpeech(el); assert.equal(c._voiceState, null); assert.equal(c._envUrl, null);
}
{
  const c = make(), el = { ...audio(), play: async () => {} };
  c._speechAudio = el; c._hass = {}; c._ttsUrl = async () => '/announcement';
  const fetchOriginal = globalThis.fetch;
  let decoded;
  c._decodeAudio = (url, bytes) => { decoded = [url, bytes]; };
  globalThis.fetch = async () => ({ arrayBuffer: async () => new ArrayBuffer(8) });
  try {
    await c._speakHere('A test announcement');
    assert.equal(c._envEl, el, 'ordinary announcements connect to the ring');
    assert.equal(c._voiceState, 'responding');
    assert.equal(decoded[1].byteLength, 8, 'decode reuses downloaded audio');
    el.onended();
    assert.equal(c._envEl, null);
    assert.equal(c._speechBlob, null, 'announcement releases its blob');
    el.play = async () => { throw new Error('autoplay'); };
    c._toast = () => {};
    await c._speakHere('Blocked test announcement');
    assert.equal(c._envEl, null, 'failed playback releases waveform ownership');
    assert.equal(c._voiceState, null);
  } finally { globalThis.fetch = fetchOriginal; }
}
{
  // A short real syllable must fold promptly and let go during the next gap.
  const c = make(); let level = 0.8;
  c._audioLevel = () => level;
  const cur = {speech: 1};
  for (let i = 0; i < 5; i++) { c._speechTick(1/60); c._sheetTables(1/60, cur, 0); }
  assert.ok(c._crumple > 0.8, 'fold attacks within 84ms');
  assert.equal(c._speech.count, 1, 'one sustained onset does not repeatedly reseed');
  level = 0;
  for (let i = 0; i < 12; i++) { c._speechTick(1/60); c._sheetTables(1/60, cur, 0); }
  assert.ok(c._crumple < 0.09, `silence settles within 200ms: ${c._crumple}`);
  c._audioLevel = () => null;
  for (let i = 0; i < 60; i++) c._speechTick(1/60);
  assert.equal(c._speech.count, 1, 'missing waveform never generates fake words');
}
{
  const c = make(), p = [0,0], q = [0,0]; let maxRadius = 0;
  for (let i = 0; i < 1200; i++) {
    c._t += 1/60;
    c._speech.env = Math.max(0, Math.sin(i * 0.19));
    c._speech.count = Math.floor(i/14);
    const sheets = c._sheetTables(1/60, {speech:1}, i < 20 ? 1.2 : 0);
    for (const st of sheets) {
      for (let b = 0; b < 360; b += 3) for (const v of [-1,0,1]) {
        const th = b/360 * 2*Math.PI;
        c._sheetPoint(st, th, v, 0, p);
        maxRadius = Math.max(maxRadius, Math.hypot(...p));
        assert.ok(p.every(Number.isFinite));
      }
      c._sheetPoint(st, 0, 0.7, 0.8, p);
      c._sheetPoint(st, Math.PI*2, 0.7, 0.8, q);
      assert.ok(Math.hypot(p[0]-q[0],p[1]-q[1]) < 1e-6, 'closed mesh has no seam');
      c._sheetPoint(st, 0.3, 1, 0, p);
      c._sheetPoint(st, 0.3, 1, Math.PI/2, q);
      assert.ok(Math.hypot(-p[1]-q[0],p[0]-q[1]) < 1e-6, 'mesh and grains rotate in same space');
    }
  }
  assert.ok(maxRadius < 0.99, `speech and burst stay inside canvas: ${maxRadius}`);
}
console.log('ring audio ownership, silence, onset timing, and mesh geometry ok');
