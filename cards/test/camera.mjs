/* node cards/test/camera.mjs — the camera panel's pure parts. */
import assert from "node:assert/strict";
import { KNOBS, ago, changed, gestureForm, summarizeActions } from "../src/hubbubb-camera.js";

assert.equal(summarizeActions([]), "Does nothing yet");
assert.equal(summarizeActions(undefined), "Does nothing yet");
assert.equal(
  summarizeActions([
    { action: "select.select_option", data: { option: "Apple TV" } },
    { action: "hubbubb_home.mac_screen_sharing", data: { on: true } },
  ]),
  "Select option, Start Mac screen mirroring"
);
assert.equal(summarizeActions([{ service: "media_player.volume_up" }, { delay: "00:00:01" }]), "Volume up, Delay");

const now = 1_000_000;
assert.equal(ago(now - 10, now), "just now");
assert.equal(ago(now - 300, now), "5 min ago");
assert.equal(ago(now - 7200, now), "2 h ago");
assert.equal(ago(now - 3 * 86400, now), "3 days ago");
assert.equal(ago(null, now), "");

assert.deepEqual(gestureForm(undefined), { enabled: true, repeat: false, people: [], actions: [] });
const saved = { enabled: true, repeat: true, people: ["Scott"], actions: [{ action: "x.y" }] };
assert.equal(changed(gestureForm(saved), saved), false);
assert.equal(changed({ ...gestureForm(saved), repeat: false }, saved), true);

// Every knob has a label, helper text and a slider step.
for (const knob of KNOBS) assert.equal(knob.length, 4);
console.log("camera ok");

import { jarvisConfig, jarvisForm } from "../src/hubbubb-camera.js";
// The flat form round-trips the stored settings, colours included.
const stored = { move: true, satellites: ["assist_satellite.puck"], strength: 0.5, lights: true, light_entities: ["light.bar"], brightness: 70, pause_while: "switch.sync", colors: { listening: [0, 0, 255], thinking: [255, 150, 0], speaking: [0, 220, 200] } };
assert.deepEqual(jarvisConfig(jarvisForm(stored)), stored);
// Defaults: moving on, lights off, no colours sent until chosen.
assert.deepEqual(jarvisConfig(jarvisForm({})), { move: true, satellites: [], strength: 0.6, lights: false, light_entities: [], brightness: 80, pause_while: null });
console.log("jarvis form ok");
