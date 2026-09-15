import assert from "node:assert";
import { promptKey, splitPaths } from "../src/paths.js";

const paths = (t) => splitPaths(t).filter((p) => typeof p !== "string").map((p) => p.path + p.line);

assert.deepStrictEqual(paths("look at cards/src/hubbubb-ring-card.js:1408 and ~/.hamounts/config/scenes.yaml."),
  ["cards/src/hubbubb-ring-card.js:1408", "~/.hamounts/config/scenes.yaml"]);
assert.deepStrictEqual(paths("/Users/scott/x/y.txt, then ./local/thing"), ["/Users/scott/x/y.txt", "./local/thing"]);
assert.deepStrictEqual(paths("and/or 24/7 http://192.168.0.62/hubbubb_home/0.25.0/x.js"), []);
assert.deepStrictEqual(paths("(see docs/README.md)"), ["docs/README.md"]);
assert.deepStrictEqual(paths("cards/src/*.js nothing"), []);
// the text round-trips: pieces concatenate back to the original
const t = "edit ~/.claude/hooks/ha-git; then cards/src/a.js:3.";
assert.strictEqual(splitPaths(t).map((p) => (typeof p === "string" ? p : p.path + p.line)).join(""), t);
// a sent prompt matches its transcript record even though the attached paths were rewritten
const sent = "/Users/s/.claude/hooks/uploads/a.jpg /Users/s/.claude/hooks/uploads/b.jpg Okay, this looks\ngood";
assert.strictEqual(promptKey(sent), "Okay, this looks good");
assert.strictEqual(promptKey("[Image #1] [Image #2]/Users/s/.claude/hooks/uploads/b.jpg Okay, this looks good"), promptKey(sent));
assert.strictEqual(promptKey("[Image #1]"), "");
assert.strictEqual(promptKey("x".repeat(300)).length, 200);
console.log("paths ok");
