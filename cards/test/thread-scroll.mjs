import assert from 'node:assert/strict';
const registry = new Map();
globalThis.window = {};
globalThis.customElements = {get: n => registry.get(n), define: (n,c) => registry.set(n,c)};
await import('../src/hubbubb-ring-card.js');
const Card = registry.get('hubbubb-ring-card');
let id = 0;
const frames = new Map(), timers = new Map();
globalThis.requestAnimationFrame = fn => { frames.set(++id, fn); return id; };
globalThis.cancelAnimationFrame = n => frames.delete(n);
globalThis.setTimeout = fn => { timers.set(++id, fn); return id; };
globalThis.clearTimeout = n => timers.delete(n);
const flush = queue => { const work = [...queue.values()]; queue.clear(); work.forEach(fn => fn()); };
function setup() {
  frames.clear(); timers.clear();
  const card = new Card();
  const log = {scrollHeight: 3000, scrollTop: 2500, clientHeight: 500};
  card.renderRoot = {querySelector: () => log};
  card._sel = 'session-a'; card._stick = true;
  card._unscroll = () => { throw Error('Transcript must never scroll ancestors'); };
  return {card, log, e: {currentTarget: log}};
}
{
  const {card,log,e} = setup();
  card._toBottom(); card._toBottom();
  assert.equal(frames.size, 1, 'stream updates coalesce into a single frame');
  card._logTouchStart();
  assert.equal(frames.size, 0, 'touch cancels pending scroll');
  log.scrollTop = 2470; card._logScroll(e);
  assert.equal(card._stick, false, 'near-bottom swipe must not reactivate following');
  card._logTouchEnd(e);
  log.scrollTop = 2300; card._logScroll(e); // momentum after touchend
  log.scrollHeight = 3300; card._toBottom(); flush(frames); flush(timers);
  assert.equal(log.scrollTop, 2300, 'streaming content does not move the reader');
  assert.equal(card._stick, false);
  log.scrollTop = 2800; card._logScroll(e);
  assert.equal(card._stick, false, 'wait until momentum ends');
  flush(timers); assert.equal(card._stick, true);
  log.scrollHeight = 3400; card._toBottom(); flush(frames);
  assert.equal(log.scrollTop, 3400, 'follow new content after returning to bottom');
}
{
  const {card,log,e} = setup();
  card._logTouchStart(); card._logScroll(e); flush(timers);
  assert.equal(card._stick, false, 'never follow with a finger still on the log');
  card._logTouchEnd(e); card._sel = 'session-b'; flush(timers);
  assert.equal(card._stick, false, 'old session timer cannot change new session state');
  card._stick = true; card._toBottom(); card._sel = 'session-c';
  log.scrollTop = 800; flush(frames); assert.equal(log.scrollTop, 800);
}
{
  const {card,log,e} = setup();
  card._toBottom(); card._logWheel(e); log.scrollTop = 2400;
  flush(frames); flush(timers);
  assert.equal(log.scrollTop, 2400); assert.equal(card._stick, false);
}
console.log('Thread scroll: swipe/momentum ownership, streaming, local follow and session isolation passed');
{
  const {card,log,e} = setup();
  const original = Array.from({length:110}, (_, i) => ({role:'assistant', text:`Message ${i}`}));
  card._msgs = original;
  card._logTouchStart(); log.scrollTop = 700;
  const next = [...original.slice(1), {role:'assistant',text:'New message'}];
  card._receiveMsgs(next);
  assert.equal(card._msgs, original, 'rolling API window cannot replace rows under the reader');
  const latest = [...next.slice(1), {role:'assistant',text:'Another new message'}];
  card._receiveMsgs(latest); card._receiveMsgs(null);
  assert.equal(card._pendingMsgs, latest, 'keep latest snapshot across unchanged polls');
  card._logTouchEnd(e); flush(timers); assert.equal(card._msgs, original);
  log.scrollTop = 2500; card._logScroll(e); flush(timers);
  assert.equal(card._msgs, latest, 'apply latest window only after returning to bottom');
  assert.equal(card._pendingMsgs, null);
}
console.log('Rolling transcript window stays stable while reading; catches up at bottom');
{
  const {card,log,e} = setup();
  log.scrollHeight += 300;
  card._logScroll(e); // content/layout event, no user gesture
  assert.equal(card._stick, true, 'layout-generated scrolling cannot cancel following');
  card._toBottom(); flush(frames); assert.equal(log.scrollTop, 3300);
}
