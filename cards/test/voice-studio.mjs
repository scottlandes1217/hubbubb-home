/* node cards/test/voice-studio.mjs — the studio without a browser: the wire
   shape of each call, the library's ordering and filters, the meter and the
   dead-mic rule, the clock, the phrase rule, and that blobs are revoked. */
import assert from "node:assert/strict";
import {
  api,
  audioPath,
  clipTime,
  deadMic,
  errMessage,
  filterClips,
  fmtElapsed,
  labelsOf,
  makePlayer,
  meterPct,
  peopleRows,
  validPhrase,
} from "../src/hubbubb-voice-studio.js";

// --- URL and body for every call ---
assert.deepEqual(api.status(), ["GET", "record/status"]);
assert.deepEqual(api.start("wake", "hey jarvis"), ["POST", "record/start", { kind: "wake", label: "hey jarvis" }]);
assert.deepEqual(api.stop(), ["POST", "record/stop"]);
assert.deepEqual(api.clips(), ["GET", "clips"]);
assert.deepEqual(api.clips({ kind: "wake", label: "jarvis" }), ["GET", "clips?kind=wake&label=jarvis"]);
assert.deepEqual(api.clips({ kind: "", label: "a b&c" }), ["GET", "clips?label=a%20b%26c"], "empty filters dropped, values encoded");
assert.deepEqual(api.deleteClip("c/1"), ["DELETE", "clips/c%2F1"]);
assert.deepEqual(api.refile("c1", { label: "tv" }), ["POST", "clips/c1", { label: "tv" }]);
assert.deepEqual(api.people(), ["GET", "people"]);
assert.deepEqual(api.enroll("Scott", ["a", "b"]), ["POST", "people/enroll", { person: "Scott", clips: ["a", "b"] }]);
assert.deepEqual(api.deletePerson("Scott"), ["POST", "people/delete", { person: "Scott" }]);
assert.deepEqual(api.train("hey jarvis"), ["POST", "train", { phrase: "hey jarvis" }]);
assert.deepEqual(api.trainStatus(), ["GET", "train/status"]);
assert.equal(audioPath("c 1"), "/api/hubbubb_home/voice/clips/c%201/audio");
// The Hubbubb link calls go to the integration itself, not through the voice proxy.
assert.deepEqual(api.links(), ["GET", "/api/hubbubb_home/people/links"]);
assert.deepEqual(api.link("Scott", "hbbc_x", "s3cret"), ["POST", "/api/hubbubb_home/people/links", { person: "Scott", client_id: "hbbc_x", client_secret: "s3cret" }]);
assert.deepEqual(api.unlink("Scott Landes"), ["DELETE", "/api/hubbubb_home/people/links/Scott%20Landes"]);

// --- error text: the proxy's JSON message wins, then plain text, then the code ---
assert.equal(errMessage(503, '{"message":"voice service unreachable"}'), "voice service unreachable");
assert.equal(errMessage(400, "a wake phrase is one to four words"), "a wake phrase is one to four words");
assert.equal(errMessage(503, ""), "the voice service is not reachable");
assert.equal(errMessage(500, "{}"), "request failed (500)");
assert.equal(errMessage(503, '{"ok":false,"detail":"Hubbubb is not configured"}'), "Hubbubb is not configured", "the integration's own refusals say detail");
assert.equal(errMessage(400, "Hubbubb refused these credentials: token endpoint returned 401"), "Hubbubb refused these credentials: token endpoint returned 401");

// --- the People card's rows: voice samples and Hubbubb links, matched by name ---
{
  const people = { scott: 4, Vega: 2 };
  const links = { Scott: { linked: true, client_id_hint: "hbbc_s… (10 characters)" }, Guest: { linked: false } };
  assert.deepEqual(peopleRows(people, links), [
    { name: "Guest", samples: 0, link: { linked: false } },
    { name: "scott", samples: 4, link: { linked: true, hint: "hbbc_s… (10 characters)" } },
    { name: "Vega", samples: 2, link: null },
  ], "case-blind match, map-only people listed, sorted by name");
  assert.deepEqual(peopleRows(people, null), [
    { name: "scott", samples: 4, link: null },
    { name: "Vega", samples: 2, link: null },
  ], "no Hubbubb: nothing said about links");
  assert.deepEqual(peopleRows(null, null), []);
  assert.deepEqual(peopleRows({}, { Scott: { linked: true } })[0].link, { linked: true, hint: "" }, "a hint is never undefined");
}

// --- filtering and grouping ---
const clips = [
  { id: "a", kind: "wake", label: "jarvis", seconds: 1.2, created: 1000 },
  { id: "b", kind: "ambient", label: "tv", seconds: 5, created: 3000 },
  { id: "c", kind: "wake", label: "jarvis", seconds: 1.1, created: 2000 },
  { id: "d", kind: "voice", label: "Scott", seconds: 2, created: "1970-01-01T01:06:40Z" }, // 4000s
  { id: "e", kind: "wake", label: "athena", seconds: 1, created: 500 },
];
assert.deepEqual(filterClips(clips).map((c) => c.id), ["d", "b", "c", "a", "e"], "newest first, ISO and epoch alike");
assert.deepEqual(filterClips(clips, { kind: "wake" }).map((c) => c.id), ["c", "a", "e"]);
assert.deepEqual(filterClips(clips, { kind: "wake", label: "jarvis" }).map((c) => c.id), ["c", "a"]);
assert.deepEqual(filterClips(clips, { since: 2000 * 1000 }).map((c) => c.id), ["d", "b", "c"], "since is ms");
assert.deepEqual(filterClips(null), []);
assert.deepEqual(labelsOf(clips, "wake"), ["jarvis", "athena"], "most clips first");
assert.deepEqual(labelsOf(clips), ["jarvis", "athena", "Scott", "tv"], "ties by name, case ignored");
assert.equal(clipTime(1700000000), 1700000000 * 1000, "epoch seconds");
assert.equal(clipTime(1700000000000), 1700000000000, "already ms");
assert.equal(clipTime("garbage"), 0);

// --- level to meter ---
assert.equal(meterPct(0), 0);
assert.equal(meterPct(1), 100);
assert.equal(meterPct(0.25), 50, "square-root curve");
assert.equal(meterPct(4), 100, "clamped");
assert.equal(meterPct("nope"), 0);
assert.equal(meterPct(-1), 0);

// --- dead microphone: six flat polls in a row, and not before ---
assert.equal(deadMic([0, 0, 0]), false, "too early to say");
assert.equal(deadMic([0, 0, 0, 0, 0, 0]), true);
assert.equal(deadMic([0.3, 0, 0, 0, 0, 0, 0]), true, "only the recent window counts");
assert.equal(deadMic([0, 0, 0, 0, 0, 0.05]), false, "one real sample clears it");
assert.equal(deadMic([0.001, 0.0015, 0.001, 0.001, 0.001, 0.001]), true, "noise floor is still dead");
assert.equal(deadMic([undefined, null, NaN, 0, 0, 0]), true, "missing levels are not a live mic");

// --- elapsed clock ---
assert.equal(fmtElapsed(0), "0:00");
assert.equal(fmtElapsed(7.9), "0:07");
assert.equal(fmtElapsed(63), "1:03");
assert.equal(fmtElapsed(3787), "1:03:07");
assert.equal(fmtElapsed(-3), "0:00");
assert.equal(fmtElapsed(NaN), "0:00");

// --- the trainer's phrase rule, mirrored ---
assert.equal(validPhrase("hey jarvis"), true);
assert.equal(validPhrase("  Athena "), true);
assert.equal(validPhrase(""), false);
assert.equal(validPhrase("one two three four five"), false);
assert.equal(validPhrase("hey jarvis2"), false);

// --- blob lifecycle: one live URL at most, none after the music stops ---
{
  const made = [];
  const revoked = [];
  const urls = {
    createObjectURL: (b) => {
      const u = `blob:${made.length}`;
      made.push(u);
      return u;
    },
    revokeObjectURL: (u) => revoked.push(u),
  };
  const audio = { src: "", onended: null, pause() {}, async play() {} };
  const states = [];
  const player = makePlayer({
    fetchBytes: async (id) => ({ id }),
    audio,
    urls,
    onstate: (s) => states.push(s),
  });

  await player.play("a");
  assert.equal(audio.src, "blob:0");
  assert.equal(player.playing, "a");
  assert.deepEqual(revoked, [], "nothing to revoke yet");

  await player.play("b");
  assert.deepEqual(revoked, ["blob:0"], "starting the next revokes the last");
  assert.equal(audio.src, "blob:1");

  audio.onended();
  assert.deepEqual(revoked, ["blob:0", "blob:1"], "ending revokes");
  assert.equal(player.playing, null);
  assert.deepEqual(states, ["a", "b", null]);

  // Two taps before the first fetch lands: still every URL revoked exactly once.
  const p1 = player.play("c");
  const p2 = player.play("d");
  await Promise.all([p1, p2]);
  audio.onended();
  player.stop();
  player.dispose();
  assert.equal(made.length, 4);
  assert.deepEqual([...revoked].sort(), [...made].sort(), "every blob made was revoked");
  assert.equal(new Set(revoked).size, revoked.length, "and only once");

  // play() refusing (no user gesture yet) must not leave a blob behind.
  const bad = { src: "", onended: null, pause() {}, async play() { throw new Error("NotAllowedError"); } };
  const p = makePlayer({ fetchBytes: async () => ({}), audio: bad, urls });
  await assert.rejects(p.play("e"));
  assert.equal(made.length, 5);
  assert.equal(revoked.length, 5, "refused playback still revoked");
}

console.log("voice-studio ok");
