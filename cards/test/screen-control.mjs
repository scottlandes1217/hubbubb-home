import assert from "node:assert/strict";
import { screenPoint, screenFieldAt, screenKeyboardPose, ScreenGesture } from "../src/screen-control.js";

const box = { left: 20, top: 10, width: 800, height: 400 };
assert.deepEqual(screenPoint(box, 2880, 1800, 420, 210), { x: .5, y: .5 });
assert.equal(screenPoint(box, 2880, 1800, 30, 210), null); // left black bar
assert.equal(screenPoint(box, 2880, 1800, 810, 210), null); // right black bar
assert.deepEqual(screenPoint(box, 2880, 1800, 100, 10), { x: 0, y: 0 });
assert.deepEqual(screenPoint(box, 2880, 1800, 740, 410), { x: 1, y: 1 });
const portrait = { left: 0, top: 0, width: 400, height: 800 };
assert.equal(screenPoint(portrait, 1920, 1080, 200, 20), null);
assert.deepEqual(screenPoint(portrait, 1920, 1080, 200, 400), { x: .5, y: .5 });
assert.equal(screenPoint(box, 0, 0, 420, 210), null); // image not decoded
assert.equal(screenPoint(box, 1920, 1080, NaN, 210), null);
console.log("screen control coordinates ok");

const gesture = new ScreenGesture();
gesture.down(1, 300, 200, 800, 400);
gesture.down(2, 500, 200, 800, 400);
gesture.move(1, 200, 200);
gesture.move(2, 600, 200);
assert.deepEqual(gesture.pose, { x: -400, y: -200, z: 2 });
assert.equal(gesture.up(2), false);
assert.equal(gesture.up(1), false, "lifting the last pinch finger must not click");
// The center still maps to the center of the Mac after a focal-point pinch.
assert.deepEqual(screenPoint({ left: -400, top: -200, width: 1600, height: 800 },
  2880, 1800, 400, 200), { x: .5, y: .5 });
gesture.down(3, 400, 200, 800, 400);
gesture.move(3, 500, 250);
assert.deepEqual(gesture.pose, { x: -300, y: -150, z: 2 });
assert.equal(gesture.up(3), false, "panning must not click");
gesture.down(4, 500, 250, 800, 400);
gesture.move(4, 501, 251);
assert.equal(gesture.up(4), true, "a stationary tap remains a click while zoomed");
gesture.down(5, 500, 250, 800, 400);
assert.equal(gesture.up(5, true), false, "cancelled touches must not click");
gesture.down(6, 400, 200, 800, 400);
gesture.move(6, 10000, 10000);
assert.deepEqual(gesture.pose, { x: 0, y: 0, z: 2 }, "pan cannot lose the screen");
gesture.up(6);
const drag = new ScreenGesture();
drag.down(1, 100, 100, 800, 400);
drag.move(1, 200, 100);
assert.equal(drag.up(1), false, "a swipe at fit size must not click either");
assert.equal(drag.up(1), false, "lost capture after release must not double-click");
console.log("screen pinch, pan, tap and cancellation ok");

const fields = [{ x: .1, y: .6, width: .4, height: .1 }];
assert.equal(screenFieldAt(fields, { x: .3, y: .65 }), true);
assert.equal(screenFieldAt(fields, { x: .8, y: .65 }), false);
assert.equal(screenFieldAt(undefined, { x: .3, y: .65 }), false);
const pose = screenKeyboardPose({ width: 800, height: 400 },
  { width: 800, height: 160 }, { width: 1600, height: 900 }, { x: .5, y: .75 }, 2);
assert.equal(pose.z, 2, "opening keyboard must preserve existing zoom");
assert.equal(2 * (400 * .75) + pose.y, 80, "tapped field stays centered above keyboard");
const keyboardPan = new ScreenGesture();
keyboardPan.down(1, 400, 80, 800, 160, 800, 400);
keyboardPan.move(1, 400, -20);
assert.equal(keyboardPan.pose.y, -100, "can pan a clipped screen even at 1x");
assert.equal(keyboardPan.up(1), false, "keyboard panning must not click");
console.log("screen input hit testing and keyboard crop/pan ok");
