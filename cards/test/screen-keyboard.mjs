import assert from "node:assert/strict";
const registry = new Map();
globalThis.window = {};
globalThis.customElements = { get: n => registry.get(n), define: (n, c) => registry.set(n, c) };
await import("../src/hubbubb-ring-card.js");
const Card = registry.get("hubbubb-ring-card");
function setup() {
  const card = new Card(), input = { value: "", isConnected: true }, calls = [];
  card._view = { screen: true };
  card._screenRun = {};
  card.renderRoot = { querySelector: () => input };
  card._toast = () => {};
  card._api = async (service, data) => { calls.push({ service, data }); return { ok: true }; };
  return { card, input, calls };
}
function event(input, extra = {}) {
  return { currentTarget: input, key: "Backspace", defaultPrevented: false,
    preventDefault() { this.defaultPrevented = true; }, ...extra };
}
{
  const { card, input, calls } = setup();
  input.value = "hello";
  await card._screenSend();
  assert.equal(input.value, "");
  // Reopening an already-sent field leaves the draft empty.
  const e = event(input);
  card._screenKeyDown(e);
  assert.equal(e.defaultPrevented, true);
  await card._screenCommandTail;
  assert.deepEqual(calls.map(c => c.data), [{ text: "hello" }, { key: "backspace" }]);
  const mobile = event(input, { inputType: "deleteContentBackward", key: undefined });
  card._screenBeforeInput(mobile);
  await card._screenCommandTail;
  assert.equal(mobile.defaultPrevented, true);
  assert.deepEqual(calls.at(-1).data, { key: "backspace" });
  input.value = "unsent";
  const local = event(input);
  card._screenKeyDown(local);
  card._screenBeforeInput(event(input, { inputType: "deleteContentBackward" }));
  assert.equal(local.defaultPrevented, false, "draft deletion remains native");
  assert.equal(calls.length, 3, "draft deletion must not erase Mac text");
}
{
  const { card, input, calls } = setup();
  let release;
  card._api = async (service, data) => {
    calls.push({ service, data });
    if (service === "agent_screen_click") await new Promise(r => { release = r; });
    return { ok: true };
  };
  const click = card._screenCommand("agent_screen_click", { x: .5, y: .5 });
  await Promise.resolve();
  for (let i = 0; i < 5; i++) card._screenKeyDown(event(input, { repeat: i > 0 }));
  assert.equal(calls.length, 1, "Backspace waits for the Mac click");
  release(); await click; await card._screenCommandTail;
  assert.equal(calls.length, 6, "all five repeated deletes arrive in order");
  assert.ok(calls.slice(1).every(c => c.data.key === "backspace"));
}
{
  const { card, input, calls } = setup();
  let release;
  card._api = async (service, data) => {
    calls.push({ service, data });
    if (data.text) await new Promise(r => { release = r; });
    return { ok: true };
  };
  input.value = "abc";
  const send = card._screenSend();
  assert.equal(input.value, "", "submitted text leaves the local draft immediately");
  await Promise.resolve();
  card._screenKeyDown(event(input));
  release(); await send; await card._screenCommandTail;
  assert.deepEqual(calls.map(c => c.data), [{ text: "abc" }, { key: "backspace" }]);
}
{
  const { card, calls } = setup();
  card._api = async (service, data) => {
    calls.push({ service, data });
    if (service === "agent_screen_click") throw new Error("Click failed");
  };
  const click = card._screenCommand("agent_screen_click", {});
  const key = card._screenCommand("agent_screen_input", { key: "backspace" });
  await assert.rejects(click, /Click failed/);
  await assert.rejects(key, /Tap the Mac input again/);
  assert.equal(calls.length, 1, "failed focus must not delete in the previous field");
}
console.log("screen keyboard: refocus deletion, mobile input, repeats, ordering and failed focus ok");
{
  const { card, input, calls } = setup();
  input.selectionStart = input.selectionEnd = 0;
  input.setSelectionRange = (a, b) => { input.selectionStart = a; input.selectionEnd = b; };
  Object.defineProperty(card, 'updateComplete', { value: Promise.resolve() });
  await card._loadScreenEditor({ editor: { value: 'Existing text', target: 'field', start: 4, end: 8 } });
  assert.equal(input.value, 'Existing text');
  assert.equal(input.selectionStart, 4);
  const backspace = event(input); card._screenKeyDown(backspace);
  assert.equal(backspace.defaultPrevented, false);
  input.value = ''; input.selectionStart = input.selectionEnd = 0;
  await card._screenSend();
  assert.deepEqual(calls[0].data, { text: '', original: 'Existing text', target: 'field', start: 0, end: 0 });
  assert.equal(card._screenEditor.value, '');
  await card._loadScreenEditor({editor: {value: 'Reopened text', target: 'field', start: 13, end: 13}});
  assert.equal(input.value, 'Reopened text');
  await card._loadScreenEditor({editor: {secure: true}});
  assert.equal(input.value, '', 'never populate password contents');
}
{
  const { card } = setup();
  const steps = [];
  Object.defineProperty(card, 'updateComplete', { value: Promise.resolve() });
  card._hideScreenKeyboard = () => steps.push('blur');
  card._vvSync = () => steps.push('viewport');
  card._settlePin = () => steps.push('settle');
  card._screenRun.wake = () => steps.push('wake');
  card._screenScrollPending = {dy: 10};
  await card._closeViewer();
  assert.deepEqual(steps, ['blur', 'wake', 'viewport', 'settle']);
  assert.equal(card._view, null); assert.equal(card._screenRun, null);
  assert.equal(card._screenScrollPending, null); assert.equal(card._vvH, null);
}
{
  const { card, calls } = setup();
  card._screenScrollPending = {x: .5, y: .5, dx: 3.1, dy: -4000};
  await card._flushScreenScroll();
  assert.deepEqual(calls[0].data, {scroll: {x: .5, y: .5, dx: 3, dy: -2000}});
}
console.log('Existing field text, selection, clearing, password privacy, scroll bounds and close cleanup ok');
{
  const { card } = setup();
  const scrolls = [], taps = [];
  const box = { getBoundingClientRect: () => ({left: 0, top: 0, width: 300, height: 200}),
    setPointerCapture() {}, querySelector: () => ({}) };
  card._queueScreenScroll = (...args) => scrolls.push(args.slice(-2));
  card._screenClick = e => taps.push(e);
  const pointer = (id, x, y, type) => ({pointerId: id, clientX: x, clientY: y, type, button: 0,
    currentTarget: box, preventDefault() {}});
  card._screenPointerDown(pointer(1, 150, 150, 'pointerdown'));
  card._screenPointerMove(pointer(1, 150, 80, 'pointermove'));
  card._screenPointerUp(pointer(1, 150, 80, 'pointerup'));
  assert.ok(scrolls.some(([dx,dy]) => dy === -70)); assert.equal(taps.length, 0);
  scrolls.length = 0;
  card._screenPointerDown(pointer(1, 100, 100, 'pointerdown'));
  card._screenPointerDown(pointer(2, 200, 100, 'pointerdown'));
  card._screenPointerMove(pointer(2, 250, 100, 'pointermove'));
  card._screenPointerUp(pointer(2, 250, 100, 'pointerup'));
  card._screenPointerMove(pointer(1, 90, 100, 'pointermove'));
  card._screenPointerUp(pointer(1, 90, 100, 'pointerup'));
  assert.equal(scrolls.length, 0, 'pinch and remaining finger never scroll Mac');
  assert.ok(card._screenPose.z > 1); assert.equal(taps.length, 0);
  card._screenPan = true;
  card._screenPointerDown(pointer(1, 100, 100, 'pointerdown'));
  card._screenPointerMove(pointer(1, 80, 100, 'pointermove'));
  card._screenPointerUp(pointer(1, 80, 100, 'pointerup'));
  assert.equal(scrolls.length, 0, 'Pan mode only moves the local image');
}
console.log('Touch scroll, pinch isolation and zoomed pan passed');
{
  const {card,calls} = setup();
  let release, woke = false, hidden = false;
  card._screenRun.focusFailed = true;
  card._screenRun.wake = () => { woke = true; };
  card._hideScreenKeyboard = () => { hidden = true; };
  card._screenPose = {x:-100,y:-100,z:3};
  card._api = async (service,data) => {calls.push({service,data});await new Promise(r=>{release=r});return {ok:true};};
  const open = card._screenMissionControl();
  await Promise.resolve(); await card._screenMissionControl();
  assert.equal(calls.length,1,'repeated taps do not toggle Mission Control twice');
  assert.deepEqual(calls[0].data,{action:'mission_control'});
  assert.equal(hidden,true);assert.equal(card._screenPose.z,1);
  release();await open;
  assert.equal(woke,true);assert.equal(card._screenMissionBusy,false);
}
console.log('Mission Control queues once, resets zoom, hides keyboard and refreshes screen');
