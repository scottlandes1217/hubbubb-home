/* Regression coverage for actual card audio ownership and projected membrane geometry. */
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
    assert.equal(sheets.length, 2, 'exactly two smoke shells');
    // Compare actual projected silhouettes, including the front and back
    // folds. Interior veils may overlap: the two outside edges must not merge.
    for (let b = 0; b < 360; b += 9) {
      const th=b/360*Math.PI*2;
      const edges=sheets.map(st=>{
        let max=0;
        for(let j=-24;j<=24;j++) {
          c._sheetPoint(st,th,j/24,0,p);
          max=Math.max(max,Math.hypot(p[0],p[1]));
        }
        return max;
      });
      assert.ok(edges[0]-edges[1]>.025,'bubble silhouettes stay distinct');
      assert.ok(edges[1]>.68,'inner silhouette leaves room for the core and sessions');
    }
    for (const st of sheets) {
      for (let b = 0; b < 360; b += 3) for (const v of [-1,-.75,-.5,-.25,0,.25,.5,.75,1]) {
        const th = b/360 * 2*Math.PI;
        c._sheetPoint(st, th, v, 0, p);
        maxRadius = Math.max(maxRadius, Math.hypot(p[0],p[1]));
        assert.ok(p.every(Number.isFinite));
      }
      c._sheetPoint(st, 0, 0.7, 0.8, p);
      c._sheetPoint(st, Math.PI*2, 0.7, 0.8, q);
      assert.ok(Math.hypot(p[0]-q[0],p[1]-q[1]) < 1e-6, 'closed bubble has no seam');
      c._sheetPoint(st, 0.3, 0.4, 0, p);
      c._sheetPoint(st, 0.3, 0.4, Math.PI/2, q);
      assert.ok(Math.hypot(-p[1]-q[0],p[0]-q[1]) < 1e-6, 'projected surface rotates consistently');
    }
  }
  assert.ok(maxRadius < 1.0, `speech and burst stay inside canvas: ${maxRadius}`);
  const st=c._sheetState[0];
  c._sheetPoint(st,0,0,0,p); const rim=Math.hypot(p[0],p[1]);
  c._sheetPoint(st,0,.7,0,p);
  assert.ok(Math.hypot(p[0],p[1])<rim*.5,'front surface projects into the bubble interior');
  c._sheetPoint(st,0,1,0,p);
  assert.ok(Math.hypot(p[0],p[1])<1e-6,'pole projects to center instead of another ring');
}
console.log('ring audio ownership, silence, onset timing, and membrane bounds ok');

{
  const c = make();
  c._sessions = [
    {id:'active', context:64000, context_max:200000, busy:true},
    {id:'empty', context:0, context_max:200000},
    {id:'done', context:158000, context_max:200000, done:true},
  ];
  for(let i=0;i<180;i++) c._segTick(1/60);
  assert.equal(c._segMap.size,3, 'every open session retains a segment');
  assert.ok(Math.abs(c._segMap.get('active').frac - 0.32) < 0.01);
  assert.equal(c._segMap.get('empty').frac,0);
  assert.ok(Math.abs(c._segMap.get('done').frac - 0.79) < 0.02);
  const arcs=[];
  const ctx={globalAlpha:1,beginPath(){},stroke(){},arc(x,y,r,a,z){arcs.push([r,a,z]);}};
  c._drawIm3Rings(ctx,0,0,200,95,232,220,1/60);
  assert.equal(arcs.filter(a=>a[0]===200*0.465).length,5,'three capacity arcs and two nonempty context fills');
  c._sessions=[];
  for(let i=0;i<240;i++) c._segTick(1/60);
  assert.equal(c._segMap.size,0,'closed sessions disappear');
}
console.log('two-shell spacing and session context display ok');

{
  const {membranePoint}=await import('../src/im3-membrane.js');
  const quiet=[0,0,0], speaking=[0,0,0];
  let rimMotion=0;
  for(let shell=0;shell<2;shell++) for(let t=0;t<12;t+=.7) for(let a=0;a<Math.PI*2;a+=.2) {
    for(const latitude of [-1.2,-.7,.7,1.2]) {
      membranePoint(a,latitude,t,0,shell,quiet);
      membranePoint(a,latitude,t,1,shell,speaking);
      assert.deepEqual(speaking,quiet,'speech leaves the front/back faces calm');
    }
    membranePoint(a,0,t,0,shell,quiet);
    membranePoint(a,0,t,1,shell,speaking);
    rimMotion=Math.max(rimMotion,Math.hypot(...speaking.map((v,i)=>v-quiet[i])));
  }
  assert.ok(rimMotion>.025,'the rim still visibly responds to speech');
}
{
  const c=make(), schedule=new Map();let next=1;
  const realSet=globalThis.setTimeout, realClear=globalThis.clearTimeout;
  globalThis.setTimeout=(fn,ms)=>{const id=next++;schedule.set(id,{fn,ms});return id;};
  globalThis.clearTimeout=id=>schedule.delete(id);
  try {
    const old=c._startIntroVisuals();
    const stale=[...schedule.values()].filter(t=>t.ms<10000);
    assert.equal(stale.length,7,'corner toggles and all five dock entrances scheduled');
    const run=c._startIntroVisuals();
    assert.notEqual(old,run);
    assert.equal(schedule.size,8,'replay clears previous icon and completion timers');
    stale.forEach(t=>t.fn());
    assert.equal(c._landed.size,0,'old callbacks cannot land icons in the new run');
    [...schedule.values()].filter(t=>t.ms<10000).forEach(t=>t.fn());
    assert.equal(c._landed.size,7,'all slots become available even without animation support');
    let removed=0,cancelled=0;
    c._introOverlays=new Set([{getAnimations:()=>[{cancel:()=>cancelled++}],remove:()=>removed++}]);
    c._stopIntroVisuals();
    assert.equal(schedule.size,0);
    assert.equal(removed,1);assert.equal(cancelled,1);
    assert.equal(c._introRun,null);assert.equal(c._landed,null);assert.equal(c._booting,false);
  } finally {globalThis.setTimeout=realSet;globalThis.clearTimeout=realClear;}
}
console.log('rim-only speech deformation and entrance lifecycle ok');

{
  const c=make();
  const run=c._introRun={};
  c._boot={t:12,waitForPreferences:true};
  c._booting=true;
  for(let i=0;i<1200;i++) c._im3Boot(1/60);
  assert.ok(c._boot.t<12.2,'even a 20-second speech delay cannot finish preferences before narration');
  assert.notEqual(c._im3Boot(0).phase,'import');
  assert.equal(c._beginIntroPreferences({}),false,'stale playback cannot release current hold');
  c._trackSpeech=()=>{};c._releaseSpeech=()=>{};
  const el={play:async()=>{}};
  const playback=c._playHere(el,'blob:test',run,()=>c._beginIntroPreferences(run));
  assert.equal(c._boot.waitForPreferences,true,'play request alone does not release the animation');
  el.onplaying();
  assert.equal(c._boot.t,12.2);
  assert.equal(c._im3Boot(0).phase,'import');
  assert.equal(c._im3Boot(0).u,0,'spoken cue starts at zero progress');
  c._im3Boot(.5);
  assert.equal(c._beginIntroPreferences(run),false,'repeat playback events cannot restart the import');
  el.onended();await playback;
  c._stopIntroVisuals();
  assert.equal(el.onplaying,null,'playback cue is cleaned up');
}
{
  const c=make(),run=c._introRun={};
  c._boot={t:12.199,waitForPreferences:true};
  c._introPreferenceCue=()=>c._beginIntroPreferences(run);
  c._audioSync({state:'idle'});
  assert.equal(c._boot.waitForPreferences,true);
  c._audioSync({state:'playing',attributes:{}});
  assert.equal(c._boot.waitForPreferences,false,'satellite playback releases the same cue');
  c._stopIntroVisuals();
}
console.log('preferences wait for actual local or satellite playback');
