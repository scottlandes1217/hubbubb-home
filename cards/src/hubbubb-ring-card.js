import { LitElement, css, html, nothing } from "lit";
import { rmsEnvelope } from "./envelope.js";

const CARD_VERSION = "4.11.1";

const SATELLITE_DOMAIN = "assist_satellite";

/* States come from homeassistant/components/assist_satellite/entity.py
   (AssistSatelliteState): idle | listening | processing | responding.
   Anything else (unavailable/unknown) falls back to the "offline" look. */
const KNOWN_STATES = ["idle", "listening", "processing", "responding"];

const DEFAULTS = {
  size: 240,
  background: "dark", // dark | card | transparent
  particles: 0, // 0 = auto (scales with size)
  particle_size: 1, // multiplier on the mote size
  follow_media_player: true, // also treat device playback as speech
  /* Fine-tune only: speech now follows the device's media_player, which
     already lines up with the sound. Negative holds the animation back
     further if your speaker still runs ahead of what you hear. */
  audio_offset: 0,
  idle_color: "#2e9df5",
  listening_color: "#00ff88",
  processing_color: "#ffaa33",
  responding_color: "#00e5ff",
  offline_color: "#4a5560",
  /* Build mode: the ring docks to the side and a Claude-session console
     appears, driven by the optional companion (see docs/companion.md). */
  build_entity: "", // input_boolean mirrored by the voice intents
  build_dashboard: "", // when set, build mode navigates to this path instead
  build_page: false, // this card IS the dedicated build dashboard
  build_return: "/", // where the build page's exit button goes back to
  build_projects: [], // chip allowlist for "+ New"; empty = all known projects
  assistant_name: "Assistant", // what your AI is called, used in every message
  tap_message: "Yes?", // what the assistant says when the ring is tapped
  /* Helper gating the "Claude Code finished" announcement on the puck (and
     with it the media pause/mute that the announcement sets off). The
     bell only renders when the entity actually exists. */
  announce_entity: "input_boolean.hubbubb_announce_agent",
  /* Helper arming the Hubbubb inbox watch: on, Home Assistant asks Hubbubb
     every few minutes what is new and reads it out here. The bell only renders
     when the entity actually exists. */
  messages_entity: "input_boolean.hubbubb_messages",
};

/* Loudness at time t, in seconds. Outside the file is silence, NOT "no
   idea": answering null there hands the moment back to the synthetic
   generator, which is exactly the ring talking when he is not. */
const sample = (env, t) => {
  const i = Math.round(t * ENV_HZ);
  return i < 0 || i >= env.length ? 0 : env[i];
};

/* Opacity steps the mote field is batched into: 16 is past the point where
   the banding shows against a soft field, and costs 16 fills a frame. */
const MOTE_ALPHAS = 16;

/* Sample rate of the decoded loudness envelope, in bins per second. */
const ENV_HZ = 50;

const COLOR_KEY = {
  idle: "idle_color",
  listening: "listening_color",
  processing: "processing_color",
  responding: "responding_color",
};

/* Per-state behaviour of the veil. Every value is lerped, so the field
   accelerates/brightens into a state instead of snapping.
   amp = wave height, sweep = travelling crest (thinking), ripple = outward wave. */
const ENERGY = {
  idle: { swirl: 0.95, bright: 1.75, radius: 0, amp: 1, turb: 0.4, sweep: 0, speech: 0 },
  listening: { swirl: 1.8, bright: 1.8, radius: -0.012, amp: 1.15, turb: 0.6, sweep: 0.35, speech: 0 },
  processing: { swirl: 0.95, bright: 1.5, radius: 0, amp: 1, turb: 0.3, sweep: 1, speech: 0 },
  responding: { swirl: 1.5, bright: 1.55, radius: 0.006, amp: 1.15, turb: 1, sweep: 0.12, speech: 1 },
  offline: { swirl: 0.3, bright: 0.4, radius: -0.012, amp: 0.5, turb: 0.15, sweep: 0, speech: 0 },
};

/* Transcript colour. The card is not a terminal — the messages arrive as
   plain text, so an ANSI palette or a zsh theme has nothing to travel in.
   Colour comes from what a line looks like instead, which is the same signal
   the terminal is using: shell prompts, ± diff lines, errors, warnings. */
const MONO_ROLES = new Set(["tool", "out", "err", "screen", "cmd"]);

const lineClass = (t) => {
  if (/^\$ /.test(t)) return "l-cmd";
  if (/^\+/.test(t)) return "l-add";
  if (/^- /.test(t) || /^--- /.test(t)) return "l-del";
  if (/\b(error|errno|failed|failure|fatal|traceback|exception|refused|denied|not found|no such)\b/i.test(t))
    return "l-err";
  if (/\b(warn|warning|deprecat\w+|skipped)\b/i.test(t)) return "l-warn";
  if (/^(Edit|Write|Read|Grep|Glob|Agent|Task|WebFetch|WebSearch|TodoWrite|Skill)\b/.test(t))
    return "l-tool";
  return "";
};

/* Claude writes `code` and **bold** into its replies and the terminal styles
   them; without this they arrive as literal punctuation. */
const MD_RE = /`([^`\n]+)`|\*\*([^*\n]+)\*\*/g;

const fireEvent = (node, type, detail) =>
  node.dispatchEvent(
    new CustomEvent(type, { detail, bubbles: true, composed: true })
  );

/* home-assistant-js-websocket ERR_* codes, which it throws as bare numbers. */
const WS_ERRORS = {
  1: "can't reach Home Assistant",
  2: "invalid authentication",
  3: "connection lost — reconnecting",
  4: "no Home Assistant host",
  5: "https/http mismatch",
};

/* Everything is drawn in a 200x200 viewBox centred on (100,100). */
const CX = 100;
const CY = 100;
const RAD = Math.PI / 180;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const r2 = (n) => Math.round(n * 100) / 100;

const seeded = (seed) => {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

/* ------------------------------------------------------------------ *
 * Geodesic sphere: subdivided icosahedron, so every triangle is the
 * same size and the silhouette is a true circle. Built once, rotated
 * in 3D on the canvas each frame.
 * ------------------------------------------------------------------ */
const buildIcosphere = (subdivisions) => {
  const t = (1 + Math.sqrt(5)) / 2;
  const verts = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map(([x, y, z]) => {
    const l = Math.hypot(x, y, z);
    return [x / l, y / l, z / l];
  });
  let faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  const cache = new Map();
  const midpoint = (a, b) => {
    const key = a < b ? `${a}_${b}` : `${b}_${a}`;
    const hit = cache.get(key);
    if (hit !== undefined) return hit;
    const [ax, ay, az] = verts[a];
    const [bx, by, bz] = verts[b];
    const x = (ax + bx) / 2, y = (ay + by) / 2, z = (az + bz) / 2;
    const l = Math.hypot(x, y, z);
    verts.push([x / l, y / l, z / l]);
    cache.set(key, verts.length - 1);
    return verts.length - 1;
  };

  for (let s = 0; s < subdivisions; s++) {
    const next = [];
    for (const [a, b, c] of faces) {
      const ab = midpoint(a, b), bc = midpoint(b, c), ca = midpoint(c, a);
      next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = next;
  }

  const seen = new Set();
  const edges = [];
  for (const f of faces) {
    for (let i = 0; i < 3; i++) {
      const a = f[i], b = f[(i + 1) % 3];
      const key = a < b ? a * 100000 + b : b * 100000 + a;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push(a, b);
    }
  }
  return { verts, edges };
};

const SPHERE = buildIcosphere(3); // 1280 faces / 1920 edges: fine, dense mesh
const SPARKS = (() => {
  const rand = seeded(0x2b41);
  const n = SPHERE.verts.length;
  const out = [];
  for (let i = 0; i < 16; i++) {
    out.push({ v: Math.floor(rand() * n), tw: 0.5 + rand() * 1.6, ph: rand() * 6.28 });
  }
  return out;
})();

const PULSE_BINS = 96;
const PULSE_LO = 0.55;
const PULSE_SPAN = 0.45;

/* ------------------------------------------------------------------ *
 * Particle veil: a few overlapping ribbons, each an undulating closed
 * band. Waves travel around each ribbon at its own frequency and
 * direction, which is what reads as "flowing" rather than "spinning".
 * ------------------------------------------------------------------ */
const RIBBONS = [
  // inner bubble (revolves the other way, so the two shells slide past
  // each other and read as separate skins)
  { r: 0.625, amp: 0.068, thick: 0.007, rev: -0.8, share: 0.21, glow: 0.72 },
  { r: 0.655, amp: 0.075, thick: 0.008, rev: -0.8, share: 0.21, glow: 0.85 },
  // outer bubble
  { r: 0.845, amp: 0.082, thick: 0.009, rev: 1, share: 0.30, glow: 1.2 },
  { r: 0.875, amp: 0.09, thick: 0.008, rev: 1, share: 0.28, glow: 1.4 },
];

/* Travelling peaks: a handful of localized bulges that drift around the
   band and breathe. Gentle at idle; when the voice talks they surge taller
   and brighter, which is the reference-GIF look — a circle with flowing
   crests, not a circle whose whole outline waves. Heights are sampled into
   angular bins once per frame so the per-particle cost is one lookup. */
const PEAK_BINS = 128;
const PEAKS = (() => {
  const rand = seeded(0xca11);
  const out = [];
  for (let i = 0; i < 5; i++) {
    out.push({
      a: rand() * Math.PI * 2,
      w: (0.08 + rand() * 0.22) * (i % 2 ? -1 : 1), // drift speed/direction
      sg: 0.2 + rand() * 0.3, // angular width
      h: 0.6 + rand() * 0.7,
      f: 0.25 + rand() * 0.6, // breathing rate
      ph: rand() * Math.PI * 2,
    });
  }
  return out;
})();

/* Honeycomb tile behind the block ring (flat-top hexes, size 5). */
const HEX_PATH = (() => {
  const s = 5;
  const h = Math.sqrt(3) * s;
  const hex = (cx, cy) => {
    let d = "";
    for (let i = 0; i < 6; i++) {
      const a = (i * 60 * Math.PI) / 180;
      d += `${i === 0 ? "M" : "L"}${r2(cx + s * Math.cos(a))} ${r2(cy + s * Math.sin(a))}`;
    }
    return d + "Z";
  };
  return [hex(0, 0), hex(3 * s, 0), hex(0, h), hex(3 * s, h), hex(1.5 * s, h / 2)].join("");
})();
const HEX_TILE = { w: 15, h: r2(Math.sqrt(3) * 5) };

/* The block ring is drawn on canvas as dynamic "dataset" segments —
   see _segTick / _drawSegs. */

const parseColor = (c) => {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(c).trim());
  if (m) {
    let hex = m[1];
    if (hex.length === 3) hex = hex.split("").map((ch) => ch + ch).join("");
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const rgb = /rgba?\(([^)]+)\)/i.exec(String(c));
  if (rgb) {
    const p = rgb[1].split(",").map((v) => parseFloat(v));
    return [p[0] | 0, p[1] | 0, p[2] | 0];
  }
  return [53, 224, 255];
};

class HubbubbRingCard extends LitElement {
  static properties = {
    _config: { state: true },
    _state: { state: true },
    _mp: { state: true },
    _build: { state: true },
    _sessions: { state: true },
    _projects: { state: true },
    _sel: { state: true },
    _msgs: { state: true },
    _ask: { state: true },
    _askSent: { state: true },
    _activity: { state: true },
    _queue: { state: true },
    _swipe: { state: true },
    _details: { state: true },
    _files: { state: true },
    _dragging: { state: true },
    _uploading: { state: true },
    _err: { state: true },
    _confirmKill: { state: true },
    _picking: { state: true },
    _pending: { state: true },
    _voiceState: { state: true },
    _announce: { state: true },
    _messages: { state: true },
    _dictating: { state: true },
  };

  /* hass is deliberately NOT a reactive property: we take the whole state
     machine on every tick but only re-render when our entity changes. */
  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    const stateObj = hass?.states?.[this._config.entity];
    const state = stateObj ? stateObj.state : "unavailable";
    const prevState = this._state;
    if (state !== this._state) this._state = state;

    // Build mode follows the helper when one is configured, so "<name>, turn
    // on build mode" and the on-card toggle stay in sync.
    if (this._config.build_entity) {
      const on = hass?.states?.[this._config.build_entity]?.state === "on";
      if (this._config.build_page) {
        // The dedicated page: console is always up; helper off = leave.
        if (this._entityOn && !on) this._navigate(this._config.build_return);
        this._entityOn = on;
      } else if (on !== this._build) {
        this._setBuild(on, false);
      }
    }

    /* The bell mirrors its helper. hass is not reactive, so without this the
       bell would only repaint when the satellite state happened to change -
       tapping it looked like nothing happened. Also the confirmation that
       lands after an optimistic tap, and how a toggle from anywhere else
       (the more-info dialog, an automation) reaches the ring. */
    const speaker = hass?.states?.[this._config.announce_entity];
    const announce = speaker ? speaker.state === "on" : null;
    if (announce !== this._announce) this._announce = announce;

    const bell = hass?.states?.[this._config.messages_entity];
    const messages = bell ? bell.state === "on" : null;
    if (messages !== this._messages) this._messages = messages;

    /* Not every spoken response runs through the pipeline: announcements
       pushed straight at the device (tts.speak / play_media) leave
       assist_satellite at `idle` for the whole utterance, and a long reply
       can outlast `responding` by a few seconds. Watching the device's own
       media_player covers both. */
    const mpId = this._config.follow_media_player
      ? this._resolveMediaPlayer(hass)
      : null;
    const mp = mpId ? hass?.states?.[mpId]?.state : undefined;
    if (mp !== this._mp) this._mp = mp;
    this._audioSync(mpId ? hass?.states?.[mpId] : null);
    // `responding` is the earliest warning that a file is about to be spoken
    if (this._state === "responding" && prevState !== "responding") {
      this._grabTtsUrl();
    }

    // Slow background poll: the ring's plates mirror live sessions even
    // outside build mode. Silently stays ambient if the endpoint is absent.
    if (!this._sessTimer) {
      this._sessTimer = setInterval(() => this._pollSessions(), 12000);
      this._pollSessions();
    }
  }

  /* "Finished and you have not looked at it yet" is not something the
     listener knows — it is about this screen. So the card watches for the
     busy -> idle edge and remembers the ids, surviving a reload in
     localStorage; opening a session clears its flag. A session you are
     already reading never lights up. */
  _trackDone(list) {
    if (!this._unread) {
      this._unread = new Set(this._recall("unread", 24 * 3600 * 1000) || []);
      this._wasBusy = new Map();
    }
    const live = new Set();
    for (const s of list) {
      live.add(s.id);
      const open = this._build && this._sel === s.id;
      if (s.busy || open) this._unread.delete(s.id);
      else if (this._wasBusy.get(s.id)) this._unread.add(s.id);
      this._wasBusy.set(s.id, !!s.busy);
      s.done = this._unread.has(s.id);
    }
    for (const id of [...this._unread]) if (!live.has(id)) this._unread.delete(id);
    for (const id of [...this._wasBusy.keys()]) if (!live.has(id)) this._wasBusy.delete(id);
    this._store("unread", [...this._unread]);
    return list;
  }

  async _pollSessions() {
    if (this._build || this._onScreen === false || !this._hass) return;
    try {
      const st = await this._api("agent_status");
      this._sessions = this._trackDone(st.sessions || []);
      if (st.projects) this._projects = st.projects;
    } catch {
      /* no listener reachable: the ambient animation keeps the ring alive */
    }
  }

  _resolveMediaPlayer(hass) {
    if (this._config.media_player) return this._config.media_player;
    if (this._mpResolved !== undefined) return this._mpResolved;
    let found = null;
    // same device in the entity registry
    const deviceId = hass?.entities?.[this._config.entity]?.device_id;
    if (deviceId && hass.entities) {
      for (const id in hass.entities) {
        if (
          id.startsWith("media_player.") &&
          hass.entities[id].device_id === deviceId
        ) {
          found = id;
          break;
        }
      }
    }
    // fall back to the ESPHome naming convention
    if (!found) {
      const base = this._config.entity
        .split(".")[1]
        .replace(/_assist_satellite$/, "");
      const guess = `media_player.${base}_media_player`;
      if (hass?.states?.[guess]) found = guess;
    }
    this._mpResolved = found;
    return found;
  }

  /* Satellite state, except that device playback while the satellite is idle
     counts as speech. Playback during listening/processing is the wake-word
     chime, so those states are left alone. */
  _effectiveState() {
    if (this._voiceState) {
      /* The reply is decoded and queued but the element has not produced a
         sample yet: hold the thinking look. `_voiceState` itself has to stay
         `responding` from tts-end onwards or run-end tears the session down,
         so the wait lives here instead. */
      if (
        this._voiceState === "responding" &&
        this._envEl &&
        !this._envEl.currentTime
      ) {
        return "processing";
      }
      return this._voiceState; // local conversation
    }
    const s = KNOWN_STATES.includes(this._state) ? this._state : "offline";
    const raw = this._speechRaw(s);
    if (this._speaking(raw)) return "responding";
    /* HA says he is talking but the sound has not left the speaker yet —
       hold the thinking look rather than mouthing words to silence. That
       covers `responding` itself, which is exactly the state that arrives
       early, so it must never be returned as-is. */
    return raw || s === "responding" ? "processing" : s;
  }

  /* Is sound actually coming out of the puck right now? `responding` is not
     the answer: measured on this device it fires 1.18s before the speaker
     makes a noise, because HA is still generating and streaming the reply
     while the satellite already says it is responding. The device's own
     media_player flips to `playing` when playback really starts and back to
     `idle` when it ends, so that is the signal — except during `listening`,
     when the wake-word chime would otherwise hijack the ring, and except
     when there is no player worth watching (follow_media_player off, none
     resolved, or unavailable), where `responding` is all we have. */
  _speechRaw(s) {
    const mp = this._mp;
    if (mp === "playing") return s !== "listening";
    if (mp === "idle" || mp === "paused") return false;
    return s === "responding";
  }

  /* Whatever lag is left between the device reporting playback and the sound
     reaching your ears is `audio_offset`, applied as a delay line on that
     boolean — both edges move, so the whole speech window slides late
     instead of just its start. */
  _speaking(raw) {
    const d = Math.max(0, -(Number(this._config.audio_offset) || 0));
    if (!d) return raw;
    const now = performance.now() / 1000;
    if (raw !== this._spkRaw) {
      this._spkRaw = raw;
      this._spkAt = now;
    }
    return now - (this._spkAt ?? -1e9) < d ? !raw : raw;
  }

  get hass() {
    return this._hass;
  }

  get _name() {
    return this._config?.assistant_name || "Assistant";
  }

  setConfig(config) {
    if (!config || !config.entity) {
      throw new Error("hubbubb-ring-card: you need to define an `entity`");
    }
    if (config.entity.split(".")[0] !== SATELLITE_DOMAIN) {
      throw new Error(
        `hubbubb-ring-card: entity must be in the ${SATELLITE_DOMAIN} domain`
      );
    }
    this._config = { ...DEFAULTS, ...config };
    this._particles = null; // rebuild the field on the next frame
    this._mpResolved = undefined;
    if (config.build_page) this._setBuild(true, false);
    if (this._hass) this.hass = this._hass;
  }

  getCardSize() {
    return Math.max(2, Math.ceil(Number(this._config?.size ?? 240) / 50));
  }

  getGridOptions() {
    const rows = Math.max(2, Math.ceil(Number(this._config?.size ?? 240) / 56));
    return { rows, columns: 12, min_rows: 2, min_columns: 6 };
  }

  static getConfigElement() {
    return document.createElement("hubbubb-ring-card-editor");
  }

  static getStubConfig(hass) {
    const entity = Object.keys(hass?.states ?? {}).find(
      (id) => id.split(".")[0] === SATELLITE_DOMAIN
    );
    return { type: "custom:hubbubb-ring-card", entity: entity ?? "" };
  }

  /* ---------------- canvas veil + 3D core ---------------- */

  connectedCallback() {
    super.connectedCallback();
    this._onVisibility = () => this._pump();
    document.addEventListener?.("visibilitychange", this._onVisibility);
    // The app can be killed without a single event firing, so save on the way
    // out too — pagehide is the one iOS actually delivers.
    this._onHide = () => {
      this._saveDraft();
      this._saveQueue();
    };
    window.addEventListener?.("pagehide", this._onHide);
    this._restoreQueue();
    if (this._build) this._setBuild(true, false); // resume polling after re-attach
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._saveDraft();
    this._saveQueue();
    this._lockScroll(false);
    document.removeEventListener?.("visibilitychange", this._onVisibility);
    window.removeEventListener?.("pagehide", this._onHide);
    this._stop();
    this._stopPolling();
    this._stopLocalVoice();
    clearInterval(this._sessTimer);
    this._sessTimer = null;
    this._io?.disconnect();
    this._ro?.disconnect();
    this._io = this._ro = null;
    this._canvas = null;
    this._ctx = null;
  }

  /* ---------------- build mode: Claude session console ---------------- */

  _navigate(path) {
    if (!path || location.pathname.startsWith(path.split("?")[0])) return;
    history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed"));
  }

  /* Paint the new state immediately, then let the helper confirm it on the
     next hass tick. A wall panel over wifi takes a beat to round-trip, and a
     toggle that does nothing for half a second reads as broken. If the call
     fails the mirror in `set hass` puts it back. */
  _toggleAnnounce() {
    this._toggleHelper(
      this._config.announce_entity,
      "_announce",
      "Claude finishes: spoken on the puck",
      "Claude finishes: phone only"
    );
  }

  _toggleMessages() {
    this._toggleHelper(
      this._config.messages_entity,
      "_messages",
      "Hubbubb messages: read out as they arrive",
      "Hubbubb messages: quiet"
    );
  }

  /* Both corner toggles are the same helper flip; only the wording differs. */
  _toggleHelper(id, key, onToast, offToast) {
    const on = this[key] === true;
    this[key] = !on;
    this._hass.callService("input_boolean", on ? "turn_off" : "turn_on", {
      entity_id: id,
    });
    this._toast(on ? offToast : onToast);
  }

  _setBuild(on, pushToHass = true) {
    if (pushToHass && this._config.build_entity && this._hass) {
      this._hass.callService("input_boolean", on ? "turn_on" : "turn_off", {
        entity_id: this._config.build_entity,
      });
    }
    // A dedicated build dashboard: this card only hands over to it.
    if (this._config.build_dashboard) {
      const was = this._build;
      this._build = on;
      // Only hand over on a real off->on edge (or a tap here). Landing on this
      // dashboard while build mode is already on - clicking J.A.R.V.I.S. in the
      // sidebar to leave the build page - must stay put, not bounce back.
      if (on && (pushToHass || was === false))
        this._navigate(this._config.build_dashboard);
      return;
    }
    // The build page itself: exiting means going back, not collapsing.
    if (this._config.build_page && !on) {
      this._navigate(this._config.build_return);
      return;
    }
    this._build = on;
    if (on) {
      this._err = "";
      this._poll();
      this._startPolling();
      if (!this._vvHandler && window.visualViewport) {
        this._vvHandler = () => this._vvSync();
        window.visualViewport.addEventListener("resize", this._vvHandler);
        window.visualViewport.addEventListener("scroll", this._vvHandler);
      }
      this._vvSync();
      this._lockScroll(true);
    } else {
      this._stopPolling();
      this._lockScroll(false);
      this._sel = null;
      this._msgs = null;
      this._ask = null;
      this._activity = null;
      this._confirmKill = null;
      this._picking = false;
      this._details = false;
      this._swipe = null;
      if (this._vvHandler && window.visualViewport) {
        window.visualViewport.removeEventListener("resize", this._vvHandler);
        window.visualViewport.removeEventListener("scroll", this._vvHandler);
        this._vvHandler = null;
      }
    }
  }

  /* The panel covers the screen, so the page behind it has no business
     scrolling — rubber-banding the list or the transcript out from under the
     panel is only ever an annoyance. Lock the document while build mode is up
     and put back exactly what was there on the way out. */
  _lockScroll(on) {
    if (!this._config?.build_page) return;
    const html = document.documentElement;
    const body = document.body;
    if (!body) return;
    if (on) {
      if (this._prevOverflow === undefined) {
        this._prevOverflow = body.style.overflow;
        this._prevOverscroll = html.style.overscrollBehavior;
        this._prevHtmlOverflow = html.style.overflow;
      }
      body.style.overflow = "hidden";
      // The document itself has to be pinned too, not just the body: the
      // keyboard makes iOS scroll the document, and that scroll is what drags
      // fixed-position elements around.
      html.style.overflow = "hidden";
      html.style.overscrollBehavior = "none";
    } else if (this._prevOverflow !== undefined) {
      body.style.overflow = this._prevOverflow;
      html.style.overflow = this._prevHtmlOverflow;
      html.style.overscrollBehavior = this._prevOverscroll;
      this._prevOverflow = this._prevOverscroll = undefined;
      this._prevHtmlOverflow = undefined;
    }
  }

  /* The bottom corners need two different radii, because the panel's bottom
     edge is two different things. With the keyboard up it is the keyboard's
     straight top edge, where a big curve would look absurd. With the keyboard
     down it is the physical bottom of the screen, where the display's own
     rounded corners will shear off anything squarer than they are.

     The web exposes no env() for the display corner radius — safe-area-inset-*
     are the only device metrics available — so the flush value is a constant
     chosen to clear the roundest current iPhones (~55px) rather than measured.
     Erring large only opens a hairline of background at the corner; erring
     small is what clips the border off.

     Which case we are in is decided by comparing against the tallest viewport
     seen, NOT window.innerHeight, which shrinks with the keyboard in a
     WKWebView and silently breaks the comparison. Rotation changes the width,
     and that resets the baseline. */
  _syncCorner(h) {
    if (window.innerWidth !== this._vvW) {
      this._vvW = window.innerWidth;
      this._vvMax = h;
    }
    this._vvMax = Math.max(this._vvMax || 0, h);
    const flushToScreen = h >= this._vvMax - 4;
    this.style.setProperty("--jr-botr", flushToScreen ? "56px" : "16px");
  }

  /* Pin the phone overlay to the VISIBLE viewport: when the keyboard opens,
     the panel shrinks to the space above it and the composer stays put. */
  _vvSync() {
    const vv = window.visualViewport;
    if (!vv) return;
    const h = Math.round(vv.height);
    const top = Math.round(vv.offsetTop);
    const resized = h !== this._vvH;
    if (resized) {
      this._vvH = h;
      this.style.setProperty("--jr-vvh", `${h}px`);
      this._syncCorner(h);
    }
    // WebKit #191204: with the keyboard up iOS makes the document scrollable
    // and position:fixed elements ride that scroll, so the panel's offset has
    // to be compensated. But holding space to drag the cursor generates a
    // stream of those scroll events, and re-pinning on each one slid the panel
    // — and the text with it — out from under the finger doing the dragging.
    // The offset only genuinely changes when the keyboard appears or goes
    // away, which always resizes the viewport too. So only re-pin on a resize,
    // and never on a bare scroll.
    if (resized || this._vvT == null) {
      this._vvT = top;
      this.style.setProperty("--jr-vvt", `${top}px`);
      // ...but iOS scrolls the document to reveal the input AFTER it reports
      // the resize, so the offset read right now is already stale and the
      // panel gets dragged off the top of the screen. Re-read it a couple of
      // times while the keyboard animation settles. Bounded passes, not a
      // continuous chase, so a cursor drag still sees a motionless panel.
      if (resized) this._settlePin();
    }
    // This fires on visualViewport SCROLL as well as resize, and iOS emits a
    // stream of those while you type. Doing work on every one of them is what
    // made the transcript twitch mid-sentence, so anything below here only
    // runs when the viewport actually changed size.
    const delta = this._vvPrev == null ? 0 : Math.abs(h - this._vvPrev);
    const first = this._vvPrev == null;
    this._vvPrev = h;
    if (!first && delta < 12) return;
    // Re-measure only when the ceiling actually moved. The suggestion bar
    // toggling is a viewport resize like any other, and remeasuring the box on
    // every one of those is what disturbed the cursor mid-drag.
    const cap = this._growCap();
    if (cap !== this._lastCap) {
      this._lastCap = cap;
      this._autoGrow(this._composerEl());
    }
    if (this._stick) {
      requestAnimationFrame(() => {
        const log = this.renderRoot?.querySelector(".log");
        if (log) log.scrollTop = log.scrollHeight;
      });
    }
  }

  /* Put the document back at the top and re-read the viewport offset, a few
     times, while the keyboard finishes animating. This is the ONLY thing that
     repositions the panel besides a resize — deliberately a short burst with
     an end, because it was the endless chasing that made the cursor skid. */
  _settlePin() {
    clearTimeout(this._settleA);
    clearTimeout(this._settleB);
    const pin = () => {
      this._unscroll();
      const vv = window.visualViewport;
      if (!vv) return;
      const top = Math.round(vv.offsetTop);
      if (top !== this._vvT) {
        this._vvT = top;
        this.style.setProperty("--jr-vvt", `${top}px`);
      }
    };
    requestAnimationFrame(pin);
    this._settleA = setTimeout(pin, 200);
    this._settleB = setTimeout(pin, 500);
  }

  /* Safety net for whatever the browser scrolled to reveal the composer. iOS
     picks an arbitrary ancestor and HA nests its own scrollers, so walk up and
     reset all of them; the panel owns the whole screen in build mode, so the
     top is always right. */
  _unscroll() {
    if (!this._build) return;
    window.scrollTo(0, 0);
    if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
    let node = this.parentNode;
    while (node) {
      if (node.scrollTop > 0) node.scrollTop = 0;
      node = node.parentNode || node.host;
    }
  }

  /* Inside a session the panel is showing live spinner text, a dialog and
     queued messages, so it polls harder than the session list does. */
  _startPolling() {
    const ms = this._sel ? 1200 : 2500;
    if (this._pollTimer && this._pollMs === ms) return;
    if (this._pollTimer) clearInterval(this._pollTimer);
    this._pollMs = ms;
    this._pollTimer = setInterval(() => this._poll(), ms);
  }

  _stopPolling() {
    if (this._pollTimer) clearInterval(this._pollTimer);
    this._pollTimer = null;
    this._pollMs = null;
  }

  /* home-assistant-js-websocket rejects with a bare numeric code, which
     otherwise reaches the user as a naked "3". */
  _errText(e) {
    if (typeof e === "number") return WS_ERRORS[e] || `websocket error ${e}`;
    return String(e?.message || e);
  }

  /* All companion traffic rides through hubbubb_home services over the normal
     websocket: no CORS, no mixed content on https, and it works from
     anywhere the dashboard does — the token stays in secrets.yaml. */
  async _api(service, data = {}) {
    const res = await this._hass.callWS({
      type: "call_service",
      domain: "hubbubb_home",
      service,
      service_data: data,
      return_response: true,
    });
    let content = res?.response?.content;
    if (typeof content === "string") {
      try {
        content = JSON.parse(content);
      } catch {
        /* keep the string */
      }
    }
    const status = res?.response?.status ?? 0;
    if (status < 200 || status >= 300 || content?.ok === false) {
      throw new Error(content?.detail || content?.error || `HTTP ${status}`);
    }
    return content || {};
  }

  async _poll() {
    if (!this._build || !this._hass) return;
    // A poll asked for mid-flight runs straight after, so a tap never waits
    // out a whole interval for its result.
    if (this._polling) {
      this._pollAgain = true;
      return;
    }
    this._polling = true;
    try {
      const status = await this._api("agent_status");
      this._sessions = this._trackDone(status.sessions || []);
      this._projects = status.projects || [];
      if (this._sel && !this._sessions.some((s) => s.id === this._sel)) {
        this._sel = null; // it ended underneath us
        this._msgs = null;
        this._store("sel", null);
      } else if (!this._sel && !this._restored) {
        // First list after a fresh mount: reopen whatever you were reading,
        // provided that session is still running.
        this._restored = true;
        const saved = this._recall("sel", 12 * 3600 * 1000);
        if (saved && this._sessions.some((s) => s.id === saved)) {
          // No early return: _sel is set now, so the block below fetches this
          // session's transcript in this same pass.
          this._select(saved);
        }
      }
      if (this._sel) {
        // The transcript carries every tool call and its output now, which is
        // tens of KB — far too much to pull down twice a second. `have` is the
        // transcript size we already rendered; unchanged, the listener sends
        // messages: null and we keep what we have. Dialog and spinner still
        // come back on every poll.
        const t = await this._api("agent_transcript", {
          id: this._sel,
          have: this._msgs == null ? 0 : this._tbytes || 0,
        });
        this._tbytes = t.bytes || 0;
        // Reassigning an identical transcript re-renders the log and yanks it
        // back to the bottom every poll, which reads as the view twitching
        // while you type. Only take it when something actually moved.
        const next = t.messages;
        if (next != null && !this._sameMsgs(next, this._msgs)) this._msgs = next;
        this._activity = t.activity || null;
        // Only a genuinely different dialog clears the "you picked this"
        // marker — the same one lingering for a poll or two is just the
        // terminal not having repainted yet, and blanking it there is the
        // flash-and-come-back we're avoiding.
        const sig = t.ask
          ? JSON.stringify(t.ask.options.map((o) => o.label))
          : null;
        if (sig !== this._askSig) {
          this._askSig = sig;
          this._askSent = null;
        }
        this._ask = t.ask || null;

        // A dispatched message is done once the transcript records it.
        if (this._queue?.length) {
          const seen = new Set(
            (this._msgs || [])
              .filter((m) => m.role === "user")
              .map((m) => this._collapse(m.text))
          );
          const before = this._queue.length;
          this._queue = this._queue.filter(
            (q) =>
              q.state !== "sent" ||
              (!seen.has(this._collapse(q.text)) && Date.now() - q.at < 600000)
          );
          if (this._queue.length !== before) this._saveQueue();
        }
      }
      this._err = "";
    } catch (e) {
      this._err = this._errText(e);
    }
    this._polling = false;
    if (this._pollAgain) {
      this._pollAgain = false;
      return this._poll();
    }
    this._drainQueue();
  }

  /* Held messages go out the moment the session frees up, in order: one at a
     time, since sending makes it busy again until that turn finishes. */
  _drainQueue() {
    if (!this._sel || this._pending) return;
    const q = (this._queue || []).filter((x) => x.id === this._sel);
    if (q.some((x) => x.state === "sent")) return; // one in flight already
    const next = q.find((x) => x.state === "held");
    if (!next) return;
    if ((this._sessions || []).find((s) => s.id === this._sel)?.busy) return;
    this._dispatch(next);
  }

  _select(id) {
    // Hold on to the draft in the box before this render swaps it out.
    if (this._sel && this._sel !== id) this._saveDraft();
    this._sel = id;
    this._restored = true; // an explicit choice; don't second-guess it later
    if (id && this._unread?.delete(id)) {
      this._store("unread", [...this._unread]);
      const s = (this._sessions || []).find((x) => x.id === id);
      if (s) s.done = false;
    }
    this._store("sel", id || null);
    this._msgs = null;
    this._ask = null;
    this._askSent = null;
    this._askSig = undefined;
    this._activity = null;
    this._startPolling();
    this._confirmKill = null;
    this._details = false;
    this._swipe = null;
    this._stick = true;
    this._poll();
    // Opening a session makes it the voice target: while build mode is up,
    // whatever you say to the assistant lands in the session you're looking at.
    if (id) this._api("agent_target_window", { id }).catch(() => {});
  }

  /* Leaving the companion app and coming back tears the frontend down and
     builds a fresh card, so anything held only in memory — which session was
     open, what you had half-typed, what was still queued — is gone and you
     land back on the list. Park it in localStorage instead. Everything is
     stamped and expires, so a selection from yesterday never hijacks today.
     Every access is wrapped: private mode and blocked site data both throw. */
  _store(key, value) {
    try {
      const k = `jrc:${key}`;
      if (value == null) localStorage.removeItem(k);
      else localStorage.setItem(k, JSON.stringify({ v: value, at: Date.now() }));
    } catch {
      /* storage unavailable — persistence is a nicety, never a requirement */
    }
  }

  _recall(key, maxAgeMs) {
    try {
      const raw = localStorage.getItem(`jrc:${key}`);
      if (!raw) return null;
      const { v, at } = JSON.parse(raw);
      if (!at || Date.now() - at > maxAgeMs) {
        localStorage.removeItem(`jrc:${key}`);
        return null;
      }
      return v;
    } catch {
      return null;
    }
  }

  /* Terminal-ish output gets one element per line so each can be coloured;
     prose gets its inline code and bold picked out. */
  _body(m) {
    if (MONO_ROLES.has(m.role))
      return m.text
        .split("\n")
        .map((l) => html`<div class="${lineClass(l)}">${l || " "}</div>`);
    if (m.role !== "assistant") return m.text;
    const out = [];
    let i = 0;
    for (const hit of m.text.matchAll(MD_RE)) {
      if (hit.index > i) out.push(m.text.slice(i, hit.index));
      out.push(hit[1] ? html`<code>${hit[1]}</code>` : html`<b>${hit[2]}</b>`);
      i = hit.index + hit[0].length;
    }
    out.push(m.text.slice(i));
    return out;
  }

  /* Cheap equality for a transcript: same length and an unchanged last entry.
     A new turn changes the count and a streaming reply grows the last text, so
     both show up; stringifying 80 messages every 1.2s would not. */
  _sameMsgs(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    const x = a[a.length - 1];
    const y = b[b.length - 1];
    return x?.role === y?.role && x?.text === y?.text;
  }

  /* The listener collapses whitespace before typing, so transcript matching
     has to compare the collapsed form. */
  _collapse(text) {
    return text.split(/\s+/).join(" ");
  }

  _composerEl() {
    return this.renderRoot?.querySelector(".composer textarea");
  }

  /* A long message must never grow the box so tall that the buttons under it
     are pushed off the bottom of the panel and behind the keyboard. With the
     keyboard up the visible viewport is small, so the ceiling is a share of
     that rather than a fixed number. */
  _growCap() {
    const vh = this._vvH || window.visualViewport?.height || window.innerHeight;
    return Math.max(56, Math.min(190, Math.round(vh * 0.32)));
  }

  /* Measuring the natural height means collapsing to `auto` first, and that
     throws away the textarea's own scroll position. On a message long enough
     to scroll, losing it snaps the view back to the first line — which is
     exactly what holding space to drag the cursor looks like, because entering
     cursor-drag mode hides the keyboard's suggestion bar and so resizes the
     viewport. Put the scroll back, and skip the work entirely when the height
     would not actually change. */
  _autoGrow(box) {
    if (!box) return;
    const target = box.style.height;
    const top = box.scrollTop;
    box.style.height = "auto";
    const next = Math.min(box.scrollHeight, this._growCap()) + "px";
    box.style.height = next;
    if (box.scrollTop !== top) box.scrollTop = top;
    return next !== target;
  }

  _saveDraft(id = this._sel) {
    if (!id) return;
    const box = this._composerEl();
    if (box) this._store(`draft:${id}`, box.value || null);
    // An attachment is part of the half-written message, so it is keyed by
    // session exactly like the text — otherwise it follows you into the next
    // session you open.
    this._store(`files:${id}`, this._files?.length ? this._files : null);
  }

  /* Drafts and held messages belong to a session, so they are keyed by it —
     reopening a different session must not inherit the last one's half-typed
     message. */
  _restoreDraft() {
    if (!this._sel) return;
    // Ahead of the composer guard below: the attachments have to be swapped
    // for this session's whether or not there is text in the box.
    this._files = this._recall(`files:${this._sel}`, 12 * 3600 * 1000) || [];
    const box = this._composerEl();
    if (!box || box.value) return;
    const draft = this._recall(`draft:${this._sel}`, 12 * 3600 * 1000);
    if (draft) {
      box.value = draft;
      this._autoGrow(box);
    }
  }

  _saveQueue() {
    // Only "held" survives a reload. A "sent" entry already went to the
    // terminal, so restoring it would risk sending the same message twice.
    const held = (this._queue || []).filter((q) => q.state === "held");
    this._store("queue", held.length ? held : null);
  }

  _restoreQueue() {
    const saved = this._recall("queue", 6 * 3600 * 1000);
    if (Array.isArray(saved) && saved.length) {
      this._queue = saved.map((q) => ({ ...q, state: "held" }));
    }
  }

  async _send(ev) {
    ev.preventDefault();
    const box = this._composerEl();
    const typed = box?.value.trim();
    const attached = this._files || [];
    if ((!typed && !attached.length) || this._sel == null) return;
    // Paths first, then whatever you wrote about them — that reads to Claude
    // Code the same way dragging a file into the terminal would.
    const text = [...attached.map((f) => f.path), typed].filter(Boolean).join(" ");
    box.value = "";
    box.style.height = "";
    this._files = [];
    this._saveDraft();
    const item = { id: this._sel, text, at: Date.now(), state: "held" };
    this._queue = [...(this._queue || []), item];
    this._saveQueue();
    this._stick = true;
    // Busy means the terminal would swallow it into Claude's own queue, where
    // it can no longer be edited or taken back. Hold it here instead and let
    // _drainQueue send it the moment the turn ends; "Send now" overrides.
    if (!(this._sessions || []).find((s) => s.id === this._sel)?.busy) {
      this._dispatch(item);
    }
  }

  async _dispatch(item) {
    if (this._pending) return;
    this._pending = true;
    item.state = "sent";
    this._queue = [...this._queue];
    this._saveQueue();
    try {
      await this._api("agent_prompt_direct", { id: item.id, text: item.text });
      this._err = "";
    } catch (e) {
      this._err = this._errText(e);
      item.state = "held"; // keep it visible and retryable
      this._queue = [...this._queue];
      this._saveQueue();
    }
    this._pending = false;
    this._poll();
  }

  _editQueued(item) {
    const box = this._composerEl();
    if (!box) return;
    box.value = box.value.trim() ? `${box.value.trim()} ${item.text}` : item.text;
    this._dropQueued(item);
    box.focus();
    this._autoGrow(box);
    this._saveDraft();
  }

  _dropQueued(item) {
    this._queue = (this._queue || []).filter((q) => q !== item);
    this._saveQueue();
  }

  /* Files ride to the companion as base64 through the same service bridge
     as everything else, land on disk there, and go into the prompt as a path —
     which is how Claude Code reads a screenshot. Images are downscaled first:
     a phone screenshot is several megabytes of detail nobody needs, and the
     model does not see more than ~1568px anyway. */
  async _attach(ev) {
    const picked = [...(ev.target.files || [])];
    ev.target.value = ""; // let the same file be chosen again later
    return this._ingest(picked);
  }

  async _ingest(picked) {
    if (!picked.length || !this._sel) return;
    this._uploading = true;
    for (const file of picked) {
      try {
        const { name, data } = await this._encodeFile(file);
        const res = await this._api("agent_upload", { name, data });
        if (!res?.path) throw new Error(res?.detail || "upload refused");
        this._files = [...(this._files || []), { name: file.name, path: res.path }];
        this._err = "";
      } catch (e) {
        this._err = `${file.name}: ${this._errText(e)}`;
      }
    }
    this._uploading = false;
    this._saveDraft();
  }

  _encodeFile(file) {
    const toB64 = (blob) =>
      new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onerror = () => reject(new Error("could not read that file"));
        fr.onload = () => resolve(String(fr.result).split(",")[1] || "");
        fr.readAsDataURL(blob);
      });
    if (!file.type.startsWith("image/")) {
      return toB64(file).then((data) => ({ name: file.name, data }));
    }
    const MAX = 1568;
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onerror = () => {
        URL.revokeObjectURL(url);
        // Not decodable here — send the original and let Claude deal with it.
        toB64(file).then((data) => resolve({ name: file.name, data }), reject);
      };
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        if (scale === 1 && file.size < 900000) {
          return toB64(file).then((data) => resolve({ name: file.name, data }), reject);
        }
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("could not encode that image"));
            const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
            toB64(blob).then((data) => resolve({ name, data }), reject);
          },
          "image/jpeg",
          0.85
        );
      };
      img.src = url;
    });
  }

  _dropFile(f) {
    this._files = (this._files || []).filter((x) => x !== f);
    this._saveDraft();
  }

  async _sendKey(key) {
    if (!this._sel) return;
    // Mark the choice instead of blanking the dialog: the terminal takes a
    // beat to repaint, and clearing early makes it flash back.
    this._askSent = key;
    try {
      await this._api("agent_key", { id: this._sel, key });
      this._err = "";
    } catch (e) {
      this._err = this._errText(e);
      this._askSent = null;
      return;
    }
    this._poll();
  }

  /* Ending is destructive and there is no undo, so the first press only arms
     it. _confirmKill holds the id being confirmed, so arming a row in the list
     cannot arm a different one. */
  async _killSession(id) {
    if (!id) return;
    if (this._confirmKill !== id) {
      this._confirmKill = id;
      clearTimeout(this._confirmT);
      this._confirmT = setTimeout(() => (this._confirmKill = null), 4000);
      return;
    }
    clearTimeout(this._confirmT);
    this._confirmKill = null;
    try {
      await this._api("agent_kill", { id });
      this._swipe = null;
      this._store(`draft:${id}`, null);
      this._queue = (this._queue || []).filter((q) => q.id !== id);
      this._saveQueue();
      if (this._sel === id) {
        this._sel = null;
        this._msgs = null;
        this._store("sel", null);
      }
      this._poll();
    } catch (e) {
      this._err = this._errText(e);
    }
  }

  /* Swipe left on a row to reveal End. A row that is already open swallows the
     next tap to close itself, so you cannot open a session by accident while
     dismissing the action. */
  _rowTap(id) {
    if (this._swipe === id) {
      this._swipe = null;
      this._confirmKill = null;
      return;
    }
    if (this._swipe) {
      this._swipe = null;
      this._confirmKill = null;
      return;
    }
    if (this._swiped) return; // this "tap" was the end of a drag
    this._select(id);
  }

  _swipeStart(e, id) {
    const t = e.touches?.[0];
    if (!t) return;
    this._sx = t.clientX;
    this._sy = t.clientY;
    this._swiped = false;
  }

  _swipeMove(e, id) {
    const t = e.touches?.[0];
    if (!t || this._sx == null) return;
    const dx = t.clientX - this._sx;
    const dy = t.clientY - this._sy;
    // Vertical wins: let the list scroll rather than fighting it.
    if (Math.abs(dy) > Math.abs(dx)) return;
    if (dx < -12) {
      this._swiped = true;
      if (this._swipe !== id) this._swipe = id;
    } else if (dx > 12 && this._swipe === id) {
      this._swiped = true;
      this._swipe = null;
      this._confirmKill = null;
    }
  }

  _swipeEnd() {
    this._sx = this._sy = null;
    // Let the click that follows touchend see _swiped, then clear it.
    setTimeout(() => (this._swiped = false), 50);
  }

  async _newSession(project) {
    this._picking = false;
    this._pending = true;
    try {
      await this._api("agent_start_session", { project });
      this._err = "";
      // Claude takes a beat to boot and the listener only lists windows with a
      // live Claude in them, so the new session isn't in the very next status.
      // Starting it moved the voice target onto it, so wait for the session
      // wearing the target and open that.
      for (let i = 0; i < 20; i++) {
        await this._poll();
        const fresh = (this._sessions || []).find((s) => s.target);
        if (fresh) {
          this._select(fresh.id);
          break;
        }
        await new Promise((r) => setTimeout(r, 600));
      }
    } catch (e) {
      this._err = this._errText(e);
    }
    this._pending = false;
  }

  /* Assist on THIS device. Inside the companion app, ask the app to open its
     native Assist (phone mic + phone speaker — works over plain http, which
     the in-page dialog's mic never does). In a regular browser, open the
     frontend's voice dialog. */
  _openAssist() {
    const external = this._hass?.auth?.external;
    if (external?.config?.hasAssist) {
      external.fireMessage({ type: "assist/show" });
      return;
    }
    fireEvent(this, "show-dialog", {
      dialogTag: "ha-voice-command-dialog",
      dialogImport: () => customElements.whenDefined("ha-voice-command-dialog"),
      dialogParams: { pipeline_id: "last_used", start_listening: true },
    });
  }

  /* Wake the puck: it answers out loud and starts listening. start_message
     is REQUIRED by the service, hence the spoken reply; notifyOnError=false
     keeps HA's error toast quiet so the dialog fallback can take over. */
  _wakePuck() {
    let call;
    try {
      call = this._hass?.callService(
        "assist_satellite",
        "start_conversation",
        {
          entity_id: this._config.entity,
          start_message: this._config.tap_message,
          preannounce: false,
        },
        undefined,
        false
      );
    } catch {
      return this._openAssist();
    }
    Promise.resolve(call).catch(() => this._openAssist());
  }

  /* ---------------- in-card voice: the ring IS the interface ------------
     Stream this device's microphone into HA's assist pipeline over the
     normal websocket and play the reply on this device's speaker, driving
     the ring through listening/processing/responding locally. Needs a
     secure context (https) for the mic; on plain http we fall back. */

  async _startLocalVoice(mode = "converse") {
    if (this._voice) return true;
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      return "microphone permission denied";
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    let ctx;
    try {
      ctx = new Ctx({ sampleRate: 16000 });
    } catch {
      ctx = new Ctx();
    }
    /* Unlock audio output while we're still inside the tap gesture, so the
       TTS reply is allowed to play seconds later (iOS autoplay rules).
       Dictation never plays audio, so it skips the unlock. */
    let audio = null;
    if (mode === "converse") {
      audio = new Audio(
        "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="
      );
      audio.play().catch(() => {});
    }

    const voice = (this._voice = {
      mode,
      stream,
      ctx,
      audio,
      proc: null,
      src: null,
      handlerId: null,
      unsub: null,
    });
    if (mode === "converse") this._voiceState = "listening";
    else this._dictating = true;

    /* Without this every tap is a fresh conversation and he has no idea what
       you just said to him. HA drops a conversation after about five minutes
       of silence, so an older id is not worth sending — the agent would
       start over anyway. */
    const convId = this._recall("conv", 5 * 60 * 1000);
    try {
      voice.unsub = await this._hass.connection.subscribeMessage(
        (ev) => this._voiceEvent(ev),
        {
          type: "assist_pipeline/run",
          start_stage: "stt",
          end_stage: mode === "dictate" ? "stt" : "tts",
          input: { sample_rate: ctx.sampleRate },
          ...(convId ? { conversation_id: convId } : {}),
        }
      );
    } catch {
      this._stopLocalVoice();
      return "assist pipeline refused the run";
    }

    const src = (voice.src = ctx.createMediaStreamSource(stream));
    const proc = (voice.proc = ctx.createScriptProcessor(2048, 1, 1));
    proc.onaudioprocess = (e) => {
      if (voice.handlerId == null) return;
      const f = e.inputBuffer.getChannelData(0);
      const out = new Uint8Array(1 + f.length * 2);
      out[0] = voice.handlerId;
      const dv = new DataView(out.buffer, 1);
      for (let i = 0; i < f.length; i++) {
        const v = Math.max(-1, Math.min(1, f[i]));
        dv.setInt16(i * 2, v < 0 ? v * 0x8000 : v * 0x7fff, true);
      }
      try {
        this._hass.connection.socket.send(out);
      } catch {
        /* socket hiccup: the pipeline will time out and clean us up */
      }
    };
    src.connect(proc);
    proc.connect(ctx.destination);
    return true;
  }

  _voiceEvent(ev) {
    const v = this._voice;
    if (!v) return;
    switch (ev.type) {
      case "run-start":
        v.handlerId = ev.data?.runner_data?.stt_binary_handler_id ?? null;
        break;
      case "intent-end": {
        // remember the thread so the next tap continues it
        const id = ev.data?.intent_output?.conversation_id;
        if (id) this._store("conv", id);
        break;
      }
      case "stt-end":
        if (v.mode === "dictate") {
          // dictation: drop the words into the message box, nothing more
          const text = ev.data?.stt_output?.text || "";
          const input = this.renderRoot?.querySelector(".composer textarea");
          if (input && text) {
            input.value = (input.value ? input.value.trim() + " " : "") + text;
            input.focus();
          }
          if (!text) this._toast("Didn't catch that.");
          this._stopLocalVoice();
        } else {
          this._closeMic(); // heard you; stop capturing while it thinks
          this._voiceState = "processing";
        }
        break;
      case "tts-end": {
        const url = ev.data?.tts_output?.url;
        if (!url) return this._stopLocalVoice();
        /* Set here and NOT on the element's `playing` event: `run-end`
           lands immediately after this and tears the session down unless the
           state already says responding, so deferring it silences the reply.
           The mouth does not run early anyway — the envelope below is read
           at audio.currentTime, which is still 0 while the file loads. */
        this._voiceState = "responding";
        v.audio.onended = () => this._stopLocalVoice();
        v.audio.onerror = () => this._stopLocalVoice();
        /* The reply is coming out of this device, so its own element is the
           clock: decode the same file and read the envelope at
           audio.currentTime. Nothing to predict and nothing to calibrate.
           (Tapping the element with an AnalyserNode would measure the true
           output, but routing it through an AudioContext silences playback
           on iOS whenever the context will not resume — not a trade worth
           making for his actual voice.) */
        this._envEl = v.audio;
        this._envUrl = url;
        this._env = null;
        this._decodeAudio(url);
        v.audio.src = url;
        v.audio.play().catch(() => this._stopLocalVoice());
        break;
      }
      case "error":
        if (v.mode === "dictate") this._toast("Didn't catch that.");
        this._stopLocalVoice();
        break;
      case "run-end":
        // keep the reply playing; if we never got TTS, wrap up
        if (this._voiceState !== "responding") this._stopLocalVoice();
        break;
    }
  }

  _closeMic() {
    const v = this._voice;
    if (!v) return;
    v.proc?.disconnect();
    v.src?.disconnect();
    v.stream?.getTracks().forEach((t) => t.stop());
    v.ctx?.close().catch(() => {});
    v.proc = v.src = null;
  }

  _stopLocalVoice() {
    const v = this._voice;
    if (!v) return;
    this._closeMic();
    this._dictating = false;
    try {
      v.audio?.pause();
    } catch {
      /* already stopped */
    }
    try {
      v.unsub?.();
    } catch {
      /* subscription already closed by run-end */
    }
    this._voice = null;
    this._voiceState = null;
    this._envEl = null;
    this._env = null;
    this._envUrl = null;
  }

  _toast(message) {
    fireEvent(this, "hass-notification", { message });
  }

  /* The composer mic is pure dictation: what you say lands in the message
     box for you to review and send. It never wakes the assistant. Auto-stops on
     silence; tapping again stops it early and transcribes what it heard. */
  /* getUserMedia only exists in a secure context, so over http://<lan-ip> the
     browser refuses the microphone no matter what we do. Nabu Casa's https URL
     (or localhost) is the way in. */
  get _canMic() {
    return !!(window.isSecureContext && navigator.mediaDevices?.getUserMedia);
  }

  async _composerMic() {
    if (this._voice) {
      if (this._voice.mode === "dictate") return this._endSpeech();
      return this._stopLocalVoice();
    }
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      this._toast("Voice input needs the https (Nabu Casa) URL.");
      return;
    }
    const result = await this._startLocalVoice("dictate");
    if (result !== true) this._toast(`Couldn't start voice input (${result}).`);
  }

  /* Stop feeding audio and send the end-of-stream marker (a bare handler-id
     byte) so STT transcribes what it heard so far. Same gesture for both
     modes: dictation lands the words in the box, conversation moves on to
     processing. Not a cancel — the run continues. */
  _endSpeech() {
    const v = this._voice;
    if (!v || v.handlerId == null) return this._stopLocalVoice();
    v.proc?.disconnect();
    v.src?.disconnect();
    // Flip the ring now rather than waiting on stt-end, so the tap feels
    // answered — and so a second quick tap can't send the marker twice.
    if (v.mode === "converse") this._voiceState = "processing";
    try {
      this._hass.connection.socket.send(new Uint8Array([v.handlerId]));
    } catch {
      this._stopLocalVoice();
    }
  }

  /* Tap the ring:
     - listening to you on this device -> that's the end of your sentence
     - otherwise mid-run on this device -> cut it short (interrupts his reply)
     - the assistant talking through the puck -> interrupt it
     - device has a mic (needs https)  -> converse right here
     - otherwise                       -> wake the puck */
  async _ringTap() {
    if (this._voice) {
      if (this._voiceState === "listening") return this._endSpeech();
      return this._stopLocalVoice();
    }

    // Interrupt: he's mid-reply (or mid-announcement) — cut the audio.
    if (this._effectiveState() === "responding") {
      const mp = this._resolveMediaPlayer(this._hass);
      if (mp) {
        this._hass.callService("media_player", "media_stop", { entity_id: mp });
        return;
      }
    }

    if (!window.isSecureContext) {
      // plain http (the wall panel): no mic API exists — puck, silently
      this._wakePuck();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      this._toast(`This browser exposes no microphone — waking ${this._name} instead.`);
      this._wakePuck();
      return;
    }
    const result = await this._startLocalVoice();
    if (result !== true) {
      this._toast(`Couldn't use this device's mic (${result}) — waking ${this._name} instead.`);
      this._wakePuck();
    }
  }

  firstUpdated() {
    this._setupCanvas();
  }

  updated(changed) {
    this._setupCanvas();
    if (changed.has("_sel") && this._sel) this._restoreDraft();
    if (changed.has("_msgs") && this._stick) {
      const log = this.renderRoot.querySelector(".log");
      if (log) log.scrollTop = log.scrollHeight;
    }
  }

  _setupCanvas() {
    const canvas = this.renderRoot?.querySelector("canvas");
    if (!canvas) {
      this._stop();
      this._canvas = null;
      return;
    }
    if (canvas !== this._canvas) {
      this._canvas = canvas;
      try {
        this._ctx = canvas.getContext("2d");
      } catch {
        this._ctx = null;
      }
      if (!this._ctx) return; // no canvas support: the SVG scene still runs
      this._t = 0;
      this._waveT = 0;
      this._churnT = 0;
      this._peaks = PEAKS.map((pk) => ({ ...pk }));
      this._spin = 0;
      this._head = 0;
      this._speech = { t: 0, next: 0, env: 0, count: 0, syl: null, pulses: [], spikes: [] };
      this._cur = { ...ENERGY.idle };
      this._rgb = parseColor(this._config?.idle_color ?? "#3db4c8");
      this._observe();
    }
    if (!this._ctx) return;
    this._measure();
    this._pump();
  }

  _observe() {
    if (typeof ResizeObserver !== "undefined") {
      this._ro?.disconnect();
      this._ro = new ResizeObserver(() => this._measure());
      this._ro.observe(this._canvas);
    }
    if (typeof IntersectionObserver !== "undefined") {
      this._io?.disconnect();
      this._io = new IntersectionObserver((entries) => {
        this._onScreen = entries.some((e) => e.isIntersecting);
        this._pump();
      });
      this._io.observe(this._canvas);
    } else {
      this._onScreen = true;
    }
  }

  _measure() {
    const c = this._canvas;
    if (!c || !this._ctx) return;
    const w = c.clientWidth || Number(this._config?.size) || 240;
    const h = c.clientHeight || w;
    // below ~0.75 quality the halved backing store is a bigger win than
    // the sharpness it costs — weak GPUs are usually fill-rate bound
    const dprCap = (this._perf?.q ?? 1) < 0.75 ? 1 : 2;
    const dpr = clamp(window.devicePixelRatio || 1, 1, dprCap);
    if (this._w === w && this._h === h && this._dpr === dpr && this._particles)
      return;
    this._w = w;
    this._h = h;
    this._dpr = dpr;
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this._buildField();
  }

  _buildField() {
    const configured = Number(this._config?.particles) || 0;
    const auto = clamp(Math.round((this._w || 240) * 32), 9000, 20000);
    const base = configured > 0 ? clamp(configured, 0, 8000) : auto;
    const count = Math.max(400, Math.round(base * (this._perf?.q ?? 1)));
    const rand = seeded(0x5eed);
    const p = new Array(count);
    let ri = 0;
    let quota = Math.round(count * RIBBONS[0].share);
    for (let i = 0; i < count; i++) {
      if (quota-- <= 0 && ri < RIBBONS.length - 1) {
        ri++;
        quota = Math.round(count * RIBBONS[ri].share);
      }
      // triangular distribution: dense along the ribbon, sparse spray outside
      const off = (rand() + rand() - 1) * (rand() < 0.04 ? 4 : 1);
      // triangular latitude: dense equatorial band, thinning wisps that
      // wrap toward the poles and close the bubble
      const lat = (rand() + rand() - 1) * 1.05;
      p[i] = {
        ri,
        lon: rand() * Math.PI * 2,
        sinLat: Math.sin(lat),
        cosLat: Math.cos(lat),
        off,
        drift: (rand() - 0.5) * 0.13,
        tw: 0.5 + rand() * 2,
        ph: rand() * Math.PI * 2,
        // bob = wander across the ribbon, wob = slide along it. Without these
        // every mote keeps a fixed slot and the veil reads as a rigid pattern.
        bobA: 0.1 + rand() * 0.25,
        bobW: 0.25 + rand() * 0.85,
        bobP: rand() * Math.PI * 2,
        wobA: 0.006 + rand() * 0.02,
        wobW: 0.4 + rand() * 1.2,
        wobP: rand() * Math.PI * 2,
        // smoke life-cycle: each mote condenses in, drifts outward, dissolves
        lf: 5 + rand() * 7,
        lt: rand() * 12,
        sz: rand() < 0.03 ? 2.1 + rand() * 1.1 : 0.8 + rand() * 0.85,
        halo: rand() < 0.05, // a few motes carry a soft volumetric glow
        br: rand() < 0.04 ? 1 : 0.45 + rand() * 0.55,
      };
    }
    this._particles = p;
  }

  /* ---------------- real speech envelope ----------------
     The sound comes out of the puck, not this browser, so there is nothing
     here to listen to (and on plain http there is no mic API at all).
     Instead: fetch the exact file HA is playing, decode it once, keep an
     RMS envelope at ENV_HZ, and read that envelope at the player's own
     reported position — so the motes move with the real waveform. Anything
     missing (no URL, cross-origin, an undecodable codec) falls back to the
     synthetic generator below without a word. */
  _audioSync(st) {
    if (!st || st.state !== "playing") {
      this._env = null;
      this._envUrl = null;
      return;
    }
    const a = st.attributes || {};
    const raw = String(a.media_content_id || "");
    // playable as-is: absolute, or a path on this same HA (tts_proxy, /local)
    const url = /^https?:\/\//.test(raw) || raw.startsWith("/") ? raw : null;
    // where playback had got to, and when that reading was taken
    const at = Date.parse(a.media_position_updated_at || st.last_changed || "");
    this._envAt = Number.isFinite(at) ? at : Date.now();
    this._envPos = Number(a.media_position) || 0;
    // No URL advertised does NOT mean no audio: the ESPHome player never
    // advertises one, and _grabTtsUrl fills the envelope from the pipeline
    // instead. Only a genuinely different file invalidates what we hold.
    if (!url || url === this._envUrl) return;
    this._envUrl = url;
    this._env = null; // whatever was decoded belongs to the previous file
    // A spoken reply is seconds long; minutes means music, and fetching a
    // whole album just to draw with it is not worth it.
    if (url && !(Number(a.media_duration) > 60)) this._decodeAudio(url);
  }

  /* Which pipeline this satellite runs, so its debug log can be read. The
     device's own select names it; "preferred" and anything unrecognised fall
     back to the preferred pipeline. */
  async _pipelineId(hass) {
    if (this._pipeId !== undefined) return this._pipeId;
    this._pipeId = null;
    const list = await hass.connection.sendMessagePromise({
      type: "assist_pipeline/pipeline/list",
    });
    const devices = await hass.connection.sendMessagePromise({
      type: "assist_pipeline/device/list",
    });
    const dev = hass.entities?.[this._config.entity]?.device_id;
    const sel = devices?.find((d) => d.device_id === dev)?.pipeline_entity;
    const name = sel ? hass.states?.[sel]?.state : null;
    const pipes = list?.pipelines || [];
    const pipe =
      pipes.find((p) => p.name === name) ||
      pipes.find((p) => p.id === list?.preferred_pipeline);
    this._pipeId = pipe?.id || null;
    return this._pipeId;
  }

  /* The Voice PE's media_player advertises no media_content_id, so the file
     it is about to speak has to come from the pipeline itself: the same
     debug log the Voice assistants settings page reads keeps the recent runs
     per pipeline, and this run's `tts-end` event carries the tts_proxy URL.
     Worth the round trip because the satellite reports `responding` about
     1.2s before the speaker starts, and fetching plus decoding measures
     ~40ms. Any failure — older HA, no permission, an announcement that never
     ran through a pipeline — just leaves the synthetic generator in place. */
  async _grabTtsUrl() {
    const hass = this._hass;
    if (!hass?.connection || this._grabbing) return;
    this._grabbing = true;
    try {
      const pipeline_id = await this._pipelineId(hass);
      if (!pipeline_id) return;
      for (let attempt = 0; attempt < 3; attempt++) {
        const list = await hass.connection.sendMessagePromise({
          type: "assist_pipeline/pipeline_debug/list",
          pipeline_id,
        });
        // newest run, and only if it is this conversation rather than a
        // leftover whose audio has nothing to do with what is playing now
        const run = (list?.pipeline_runs || []).reduce(
          (a, b) => (!a || b.timestamp > a.timestamp ? b : a),
          null
        );
        if (run && Date.now() - Date.parse(run.timestamp) < 60000) {
          const got = await hass.connection.sendMessagePromise({
            type: "assist_pipeline/pipeline_debug/get",
            pipeline_id,
            pipeline_run_id: run.pipeline_run_id,
          });
          const events = got?.events || [];
          for (let i = events.length - 1; i >= 0; i--) {
            const url =
              events[i]?.type === "tts-end" && events[i]?.data?.tts_output?.url;
            if (url) {
              this._envUrl = url;
              this._env = null;
              await this._decodeAudio(url);
              return;
            }
          }
        }
        // tts-end may not have been written yet on the first look
        await new Promise((r) => setTimeout(r, 250));
      }
    } catch {
      this._pipeId = undefined; // re-resolve next time; maybe it moved
    } finally {
      this._grabbing = false;
    }
  }

  async _decodeAudio(url) {
    try {
      const buf = await (await fetch(url)).arrayBuffer();
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const actx = this._actx || (this._actx = new AC());
      const audio = await actx.decodeAudioData(buf);
      if (url !== this._envUrl) return; // playback moved on while decoding
      this._env = rmsEnvelope(audio.getChannelData(0), audio.sampleRate, ENV_HZ);
    } catch {
      this._env = null; // unreachable, cross-origin or undecodable
    }
  }

  /* Loudness right now, 0-1, or null when no decoded audio is playing.
     ponytail: the puck's own buffering puts the sound a little behind the
     position it reports — `audio_offset` is the knob to line them up. */
  _audioLevel() {
    const env = this._env;
    const el = this._envEl;
    /* Playing out of this device: the element knows exactly where it is, so
       there is no clock to drift and no offset to calibrate. Crucially this
       answers 0 rather than null while the file is still loading — null
       means "no idea", which hands the gap between tts-end and the first
       sample to the generator, and that gap is audible as the ring talking
       before he does. Only a failed decode falls back. */
    if (el) {
      // nothing has left the speaker yet: silence we KNOW about, whether or
      // not the decode landed. Only once samples are flowing does a missing
      // envelope mean "no idea" and hand over to the generator.
      if (!el.currentTime) return 0;
      return env ? sample(env, el.currentTime) : null;
    }
    if (!env || this._mp !== "playing") return null;
    const t =
      this._envPos +
      (Date.now() - this._envAt) / 1000 +
      (Number(this._config.audio_offset) || 0);
    return sample(env, t);
  }

  /* Each syllable throws shapes onto the fabric: a consonant — one narrow
     sharp jab with a hard attack — then the vowel nucleus, a broader swell
     that rides out the rest of the syllable. Fired by both the synthetic
     generator and real-audio onsets. */
  _sylShapes(peak, dur) {
    const sp = this._speech;
    sp.pulses.push({ born: sp.t, amp: peak });
    if (sp.pulses.length > 6) sp.pulses.shift();
    const ang = Math.random() * 6.283185;
    sp.spikes.push(
      {
        a: ang,
        sg: 0.1 + Math.random() * 0.08,
        h: 0.06 + peak * 0.06,
        born: sp.t,
        dur: 0.12 + Math.random() * 0.08,
      },
      {
        a: ang + (Math.random() - 0.5) * 0.6,
        sg: 0.22 + Math.random() * 0.18,
        h: 0.04 + peak * 0.05,
        born: sp.t + 0.04,
        dur: dur * (0.9 + Math.random() * 0.4),
      }
    );
    if (sp.spikes.length > 14) sp.spikes.splice(0, sp.spikes.length - 14);
  }

  /* ---------------- synthetic speech envelope ----------------
     assist_satellite exposes no audio level, so `responding` drives a
     syllable generator instead: bursts of 110-250ms with a fast attack and
     a longer decay, short gaps between syllables and a longer pause every
     few of them, which is roughly the amplitude envelope of speech. Each
     syllable also launches an impulse that travels outward through the
     ribbons. */
  _speechTick(dt) {
    const sp = this._speech;
    sp.t += dt;

    /* Real audio wins whenever it is available: drive the envelope straight
       from the decoded waveform and treat every climb out of a quiet patch
       as a syllable onset, so the crests fire on the actual consonants. */
    const live = this._audioLevel();
    if (live != null) {
      if (live > 0.2 && live > (sp.last || 0) * 1.4) {
        sp.count++;
        sp.syl = { start: sp.t, dur: 0.22, peak: live, f: 5 + live * 4 };
        this._sylShapes(live, 0.22);
      }
      sp.last = live;
      sp.live = true;
      // the envelope IS the signal here, so barely smooth it
      const tauL = live > sp.env ? 0.05 : 0.14;
      sp.env += (live - sp.env) * (1 - Math.exp(-dt / tauL));
      if (sp.env > 1) sp.env = 1;
      return;
    }

    sp.live = false;
    if (sp.t >= sp.next) {
      const dur = 0.22 + Math.random() * 0.26;
      const peak = 0.5 + Math.random() * 0.5;
      sp.syl = { start: sp.t, dur, peak, f: 5 + Math.random() * 4 };
      sp.count++;
      let gap = 0.02 + Math.random() * 0.05;
      // a gentle phrase break now and then, not a hard stop
      if (sp.count % (5 + Math.floor(Math.random() * 6)) === 0) {
        gap += 0.14 + Math.random() * 0.26;
      }
      sp.next = sp.t + dur + gap;
      this._sylShapes(peak, dur);
    }

    let raw = 0;
    const syl = sp.syl;
    if (syl) {
      const u = (sp.t - syl.start) / syl.dur;
      if (u >= 0 && u <= 1) {
        // raised cosine: symmetric, no corners, so the swell reads as a
        // breath rather than a hit
        raw = syl.peak * 1.2 * (0.5 - 0.5 * Math.cos(2 * Math.PI * u));
      }
    }
    // one-pole smoothing: fast attack, slower release, like a real envelope
    const tau = raw > sp.env ? 0.22 : 0.5;
    sp.env += (raw - sp.env) * (1 - Math.exp(-dt / tau));
    if (sp.env > 1) sp.env = 1;
  }

  /* Impulse strength per radius, sampled into bins so the per-particle cost
     is one array lookup instead of one exp() per pulse. */
  _pulseTable(speech) {
    const T = this._ptab || (this._ptab = new Float32Array(PULSE_BINS));
    T.fill(0);
    if (speech < 0.01) return T;
    const sp = this._speech;
    for (const p of sp.pulses) {
      const age = sp.t - p.born;
      if (age > 2.4) continue;
      const front = 0.58 + age * 0.26;
      const amp = p.amp * Math.exp(-age / 1) * speech;
      for (let i = 0; i < PULSE_BINS; i++) {
        const d = PULSE_LO + (i / (PULSE_BINS - 1)) * PULSE_SPAN - front;
        T[i] += amp * Math.exp(-(d * d) / 0.0055);
      }
    }
    return T;
  }

  /* Bulge height per angle bin. Peaks drift with the swirl, breathe on
     their own clocks, and swell hard with the speech envelope. */
  _peakTable(dt, cur, env) {
    const T = this._ktab || (this._ktab = new Float32Array(PEAK_BINS));
    T.fill(0);
    const t = this._t;
    const lift = 0.05 * cur.amp + 0.08 * env;
    for (const pk of this._peaks) {
      pk.a += dt * pk.w * (0.6 + cur.swirl);
      const osc = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * pk.f + pk.ph));
      const h = pk.h * osc * lift;
      if (h < 0.002) continue;
      const sgE = pk.sg * (1 - 0.4 * env); // narrower = sharper while talking
      const s2 = 2 * sgE * sgE;
      for (let i = 0; i < PEAK_BINS; i++) {
        let d = (i / PEAK_BINS) * 6.283185 - pk.a;
        d = ((d % 6.283185) + 6.283185) % 6.283185;
        if (d > 3.141593) d -= 6.283185;
        T[i] += h * Math.exp(-(d * d) / s2);
      }
    }

    // transient speech spikes: fast attack, exponential release
    const sp = this._speech;
    for (let n = sp.spikes.length - 1; n >= 0; n--) {
      const k = sp.spikes[n];
      const age = sp.t - k.born;
      if (age > k.dur + 0.3) {
        sp.spikes.splice(n, 1);
        continue;
      }
      if (age < 0) continue;
      const eAtt = age < 0.12 ? age / 0.12 : 1;
      const eRel = age > k.dur ? Math.exp(-(age - k.dur) / 0.3) : 1;
      const h = k.h * eAtt * eRel * cur.speech;
      if (h < 0.003) continue;
      const s2 = 2 * k.sg * k.sg;
      for (let i = 0; i < PEAK_BINS; i++) {
        let d = (i / PEAK_BINS) * 6.283185 - k.a;
        d = ((d % 6.283185) + 6.283185) % 6.283185;
        if (d > 3.141593) d -= 6.283185;
        T[i] += h * Math.exp(-(d * d) / s2);
      }
    }
    return T;
  }

  _sprite(R, G, B) {
    const key = (R << 16) | (G << 8) | B;
    if (this._sprKey === key) return this._spr;
    const c = this._spr || (this._spr = document.createElement("canvas"));
    c.width = c.height = 32;
    const g = c.getContext("2d");
    g.clearRect(0, 0, 32, 32);
    const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, `rgba(${R},${G},${B},0.75)`);
    grad.addColorStop(0.4, `rgba(${R},${G},${B},0.3)`);
    grad.addColorStop(1, `rgba(${R},${G},${B},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, 32, 32);
    this._sprKey = key;
    return c;
  }

  /* ---------------- session ring: live Claude sessions -----------------
     Once session data arrives, every plate IS a session: arc length grows
     with the conversation's size (log of transcript bytes). The ring holds
     one hue — working plates are simply brighter, with a comet sweeping
     through them — and green is reserved for a session that has finished
     and not been opened yet. Plates grow in when a session starts and
     dissolve when it ends. Until data arrives, the ambient animation below
     fills in. */
  _segTick(dt) {
    if (this._segRot === undefined) this._segRot = -Math.PI / 2;
    this._segRot += dt * 0.019;
    // Shading wash: a soft band that slides up and down the ring. Because it
    // is a smooth function of angle the plates blend into one another, and
    // because it sways instead of circling it never wraps back to a seam.
    this._segWave = (this._segWave || 0) + dt * 0.5;
    if (this._sessions == null) return this._ambientTick(dt);
    const S = this._segMap || (this._segMap = new Map());
    const ease = 1 - Math.exp(-dt / 0.7);
    const seen = new Set();
    for (const sess of this._sessions) {
      seen.add(sess.id);
      let g = S.get(sess.id);
      if (!g) {
        g = {
          size: 0.02,
          fill: Math.random(),
          pulse: Math.random() * 6.28,
          rgb: [46, 157, 245],
          gone: false,
        };
        S.set(sess.id, g);
      }
      g.weight = Math.max(0.8, Math.log10((sess.bytes || 0) + 1e4) - 3.2);
      g.busy = !!sess.busy;
      g.done = !!sess.done;
      g.gone = false;
    }
    for (const [id, g] of S) {
      if (!seen.has(id)) g.gone = true;
      g.size += ((g.gone ? 0 : g.weight) - g.size) * ease;
      if (g.gone && g.size < 0.03) {
        S.delete(id);
        continue;
      }
      g.pulse += dt * (g.busy ? 2.4 : 0.9);
      if (g.busy) g.fill = (g.fill + dt * 0.3) % 1;
      /* One hue for the whole ring — running or idle, a session is blue and
         you read it by brightness. Green means one thing only: it finished
         and you have not opened it yet. */
      const tgt = g.done ? [40, 226, 138] : [46, 157, 245];
      for (let i = 0; i < 3; i++) g.rgb[i] += (tgt[i] - g.rgb[i]) * ease;
    }
  }

  /* Brightness of the wash at a given ring angle: 1 in the middle of the
     band, easing to 0 a full radius away. Canvas y grows downward, so -sin
     puts +1 at the top. */
  _segBand(mid) {
    const d = Math.abs(-Math.sin(mid) - Math.sin(this._segWave || 0));
    return d > 1 ? 0 : 0.5 + 0.5 * Math.cos(d * Math.PI);
  }

  /* Fills one plate with that wash. A plate is painted as a handful of
     sub-slices, each shaded at its own angle, so the gradient runs on
     across the plate boundaries — one flat fill per plate would step at
     every gap, which is the "you can see the separate bars" look. The
     sub-slices meet exactly, which on a dark ground reads seamless. */
  _wash(ctx, cx, cy, r0, r1, a0, a1, alpha) {
    const n = Math.max(2, Math.min(12, Math.ceil((a1 - a0) / 0.1)));
    const step = (a1 - a0) / n;
    for (let i = 0; i < n; i++) {
      const s = a0 + i * step;
      const e = Math.min(a1, s + step);
      ctx.globalAlpha = alpha * (0.5 + 1.15 * this._segBand(s + step / 2));
      ctx.beginPath();
      ctx.arc(cx, cy, r1, s, e);
      ctx.arc(cx, cy, r0, e, s, true);
      ctx.closePath();
      ctx.fill();
    }
  }

  _drawSegs(ctx, cx, cy, half, R, G, B) {
    if (this._sessions == null) {
      return this._drawAmbientSegs(ctx, cx, cy, half, R, G, B);
    }
    const TAU = 6.283185;
    const rIn = half * 0.475;
    const rOut = half * 0.655;
    const seg = (a0, a1, r0, r1) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r1, a0, a1);
      ctx.arc(cx, cy, r0, a1, a0, true);
      ctx.closePath();
    };
    const S = this._segMap;
    let sum = 0;
    if (S) for (const g of S.values()) sum += g.size;
    if (!S || !S.size || sum <= 0) {
      // nothing running: one quiet, empty band
      ctx.fillStyle = `rgb(${R},${G},${B})`;
      ctx.globalAlpha = 0.05;
      seg(0, TAU, rIn, rOut);
      ctx.fill();
      ctx.globalAlpha = 1;
      return;
    }
    let a = this._segRot;
    for (const g of S.values()) {
      const slot = (g.size / sum) * TAU;
      const gap = Math.min(0.035, slot);
      const a0 = a + gap / 2;
      const a1 = a + slot - gap / 2;
      a += slot;
      const w = a1 - a0;
      if (w < 0.004) continue;
      ctx.fillStyle = `rgb(${Math.round(g.rgb[0])},${Math.round(g.rgb[1])},${Math.round(g.rgb[2])})`;
      this._wash(ctx, cx, cy, rIn, rOut, a0, a1, (g.busy ? 0.22 : 0.1) + (g.done ? 0.07 : 0));
      if (g.busy) {
        // a comet circulating through the plate: work you can see moving
        const len = Math.max(0.1, w * 0.35);
        const head = a0 + g.fill * w;
        const steps = 14;
        for (let k = 0; k < steps; k++) {
          const t1 = head - (k * len) / steps;
          const t0 = Math.max(a0, t1 - len / steps);
          if (t1 <= a0) break;
          ctx.globalAlpha = 0.3 * Math.pow(1 - k / steps, 1.6);
          seg(t0, t1, rIn, rOut);
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---------------- dataset ring (the old block ring, reborn) ----------
     Segments behave like loading bars: a new one grows in, pushing its
     neighbours around the ring; it fills with a bright progress sweep;
     finished plates settle dim. When the ring is crowded an old plate
     unloads and shrinks away, making room for the next. */
  _ambientTick(dt) {
    let S = this._segs;
    if (!S) {
      S = this._segs = [];
      this._segRot = -Math.PI / 2;
      for (let i = 0; i < 22; i++) {
        const settled = Math.random() < 0.75;
        S.push({
          size: 0.5 + Math.random() * 1.4,
          fill: settled ? 1 : Math.random() * 0.7,
          rate: 0.12 + Math.random() * 0.3,
          state: settled ? "done" : "load",
          doneT: Math.random() * 9,
        });
      }
    }

    let growing = 0,
      dying = 0;
    for (const g of S) {
      if (g.state === "grow") growing++;
      else if (g.state === "die") dying++;
    }
    // a new dataset arrives now and then, growing in from nothing
    if (!growing && S.length < 26 && Math.random() < dt * 0.5) {
      S.splice(Math.floor(Math.random() * (S.length + 1)), 0, {
        size: 0.02,
        target: 0.5 + Math.random() * 1.4,
        fill: 0,
        rate: 0.12 + Math.random() * 0.3,
        state: "grow",
        doneT: 0,
      });
    }
    // and occasionally the oldest settled one is retired
    if (dying < 2 && S.length > 16) {
      let oldest = null;
      for (const g of S)
        if (
          g.state === "done" &&
          g.doneT > 8 &&
          (!oldest || g.doneT > oldest.doneT)
        )
          oldest = g;
      if (oldest && Math.random() < dt * 0.25) oldest.state = "die";
    }

    for (let i = S.length - 1; i >= 0; i--) {
      const g = S[i];
      if (g.state === "grow") {
        g.size += dt * 0.5;
        if (g.size >= g.target) {
          g.size = g.target;
          g.state = "load";
        }
      } else if (g.state === "load") {
        g.fill += dt * g.rate;
        if (g.fill >= 1) {
          g.fill = 1;
          g.state = "done";
          g.doneT = 0;
        }
      } else if (g.state === "done") {
        g.doneT += dt;
      } else {
        // die: drain, shrink, vanish — neighbours absorb the share
        g.size -= dt * 0.12;
        g.fill = Math.max(0, g.fill - dt * 0.25);
        if (g.size <= 0.02) S.splice(i, 1);
      }
    }

  }

  /* Layout is NORMALIZED every frame: each bar's angular slot is its share
     of the sum of sizes, so the bars always tile exactly 360 degrees — a
     gap or an overlap is impossible by construction. As one bar shrinks,
     every other bar widens proportionally to take up its space. */
  _drawAmbientSegs(ctx, cx, cy, half, R, G, B) {
    const S = this._segs;
    if (!S || !S.length) return;
    let sum = 0;
    for (const g of S) sum += g.size;
    if (sum <= 0) return;
    const rIn = half * 0.475;
    const rOut = half * 0.655;
    // steel-blue tint, like the old hue-rotated plates
    const bR = (R * 0.5 + 74) | 0;
    const bG = (G * 0.72 + 48) | 0;
    const bB = (B * 0.8 + 82) | 0;
    ctx.fillStyle = `rgb(${bR},${bG},${bB})`;
    const seg = (a0, a1, r0, r1) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r1, a0, a1);
      ctx.arc(cx, cy, r0, a1, a0, true);
      ctx.closePath();
    };
    const TAU = 6.283185;
    let a = this._segRot;
    for (let i = 0; i < S.length; i++) {
      const g = S[i];
      const slot = (g.size / sum) * TAU;
      // the gap holds at full width for as long as the bar exists — a
      // shrinking bar becomes all gap at the end, so its neighbours stay
      // separated the whole way through
      const gap = Math.min(0.028, slot);
      const a0 = a + gap / 2;
      const a1 = a + slot - gap / 2;
      a += slot;
      const w = a1 - a0;
      if (w < 0.004) continue;
      // the same wash that shades the session ring: one continuous gradient
      this._wash(ctx, cx, cy, rIn, rOut, a0, a1, 0.13);
      // loaded portion: bright while filling, settling dim once done
      if (g.fill > 0.01) {
        const lit =
          g.state === "done" ? 0.14 + 0.2 * Math.exp(-g.doneT / 2.2) : 0.34;
        this._wash(ctx, cx, cy, rIn, rOut, a0, a0 + w * g.fill, lit * 0.8);
      }
    }
    ctx.globalAlpha = 1;
  }

  _pump() {
    const running =
      this._ctx &&
      this.isConnected &&
      this._onScreen !== false &&
      !document.hidden;
    if (running) this._start();
    else this._stop();
  }

  _start() {
    if (this._raf) return;
    this._last = performance.now();
    const frame = (now) => {
      this._raf = requestAnimationFrame(frame);
      const raw = now - this._last;
      const dt = Math.min(0.05, raw / 1000);
      this._last = now;
      this._perfTick(raw);
      this._draw(dt);
    };
    this._raf = requestAnimationFrame(frame);
  }

  /* Adaptive quality: watch real frame times and thin the particle field
     (and the backing-store resolution) until the device keeps up. Steps
     down fast, creeps back up slowly, with a hold after every change so
     the new level can settle before being judged. */
  _perfTick(raw) {
    if (raw <= 0 || raw > 250) return; // tab-resume glitches, not real frames
    const P =
      this._perf || (this._perf = { q: 1, acc: 0, n: 0, hold: 40 });
    if (P.hold > 0) {
      P.hold--; // also swallows startup/JIT-warmup jank
      return;
    }
    P.acc += raw;
    if (++P.n < 45) return;
    const avg = P.acc / P.n;
    P.acc = 0;
    P.n = 0;
    // hysteresis: down under ~38fps, back up only when comfortably fast
    if (avg > 26 && P.q > 0.2) this._setQuality(Math.max(0.2, P.q * 0.65));
    else if (avg < 14 && P.q < 1) this._setQuality(Math.min(1, P.q * 1.2));
  }

  _setQuality(q) {
    const P = this._perf;
    if (q === P.q) return;
    P.q = q;
    P.hold = 40;
    this._particles = null; // rebuild the field at the new density
    this._measure();
  }

  _stop() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = 0;
  }

  _targets() {
    const state = this._effectiveState();
    const color =
      state === "offline"
        ? this._config.offline_color
        : this._config[COLOR_KEY[state]];
    return { energy: ENERGY[state], rgb: parseColor(color) };
  }

  _draw(dt) {
    const ctx = this._ctx;
    if (!ctx || !this._particles) return;
    const W = this._w, H = this._h;
    const cx = W / 2, cy = H / 2;
    const half = Math.min(W, H) / 2;

    const { energy, rgb } = this._targets();
    const k = 1 - Math.exp(-dt / 0.55);
    // Speech falls away faster than it arrives. Easing out over the same
    // 0.55s as everything else left the ring surging for a good second after
    // he stopped talking, which reads as the animation overrunning him.
    const kOff = 1 - Math.exp(-dt / 0.16);
    const cur = this._cur;
    for (const key of Object.keys(energy)) {
      const rate = key === "speech" && energy[key] < cur[key] ? kOff : k;
      cur[key] += (energy[key] - cur[key]) * rate;
    }
    for (let i = 0; i < 3; i++) this._rgb[i] += (rgb[i] - this._rgb[i]) * k;
    const R = Math.round(this._rgb[0]);
    const G = Math.round(this._rgb[1]);
    const B = Math.round(this._rgb[2]);

    this._t += dt;
    this._waveT += dt * (0.5 + cur.swirl * 0.9); // waves travel faster when busy
    this._spin += dt * (0.09 + cur.swirl * 0.05);
    this._head += dt * (1.1 + cur.swirl * 1.4);

    // restart the generator on the way into `responding` so speech begins
    // at a syllable onset rather than mid-word
    if (energy.speech > 0.5 && this._cur.speech < 0.05) {
      this._speech.next = this._speech.t;
      this._speech.pulses.length = 0;
    }
    if (cur.speech > 0.005) this._speechTick(dt);
    else this._speech.env += (0 - this._speech.env) * k;
    const sp = this._speech;
    const flow =
      0.5 +
      0.5 * Math.sin(sp.t * 0.5 + 0.8 * Math.sin(sp.t * 0.21));
    // real audio needs no help from the idle flow term — let it dominate
    const m = sp.live ? 0.88 : 0.62;
    const env = (m * sp.env + (1 - m) * flow) * cur.speech;
    const chopF = this._speech.syl ? this._speech.syl.f : 11;
    /* Per-mote churn runs on its own clock so speeding it up (busy state, loud
       syllable) never jumps the phase the way scaling `t` inline would. */
    this._churnT += dt * (0.55 + cur.swirl * 0.85 + env * 0.7);
    this._waveT += dt * env * 0.8; // crests run while the voice is up
    const ct = this._churnT;
    const ptab = this._pulseTable(cur.speech);
    const ktab = this._peakTable(dt, cur, env);

    ctx.clearRect(0, 0, W, H);

    const t = this._t;
    const wt = this._waveT;
    // each shell revolves slowly at its own rate, tilted like the core
    const gAng0 = this._spin * 0.6;
    const cosTt = 0.955, sinTt = 0.296; // fixed 0.3 rad camera tilt
    /* Sea state for this frame: two slow incommensurate sines gust the whole
       ocean between glassy and stormy over tens of seconds, and the bubble
       itself breathes slightly. The GIF's life is mostly this: waves FORM,
       crest, and die — they are not a constant texture. */
    const gust = 0.72 + 0.28 * Math.sin(t * 0.21 + 1.3) * Math.sin(t * 0.093 + 4.1);
    const breathe = 0.012 * Math.sin(t * 0.16 + 0.7);
    // the globe occludes the bubbles: motes fade out over its face
    const occOut = half * 0.38 * 1.16;
    const occIn = half * 0.38 * 0.7;
    const occOut2 = occOut * occOut;
    const occSpan = occOut - occIn;
    const KNEE = 0.92, SPAN = 0.075; // soft ceiling = 0.995
    ctx.fillStyle = `rgb(${R},${G},${B})`;
    const spr = this._sprite(R, G, B);
    /* Motes are circles, batched by opacity: one Path2D per alpha bucket
       collects every mote at that brightness and is filled once, so the
       whole field costs MOTE_ALPHAS fills instead of one per mote — cheaper
       than the fillRect-per-mote it replaces. */
    const bins = this._bins || (this._bins = []);
    for (let i = 0; i < MOTE_ALPHAS; i++) bins[i] = new Path2D();
    /* Quality compensation: a thinned field keeps its apparent mass by
       drawing fewer-but-heavier motes; halos (scaled drawImage, the most
       expensive blit) drop out entirely on struggling hardware. */
    const q = this._perf?.q ?? 1;
    const qBoost = 1 + (1 - q) * 0.6;
    const halos = q >= 0.5;
    // motes keep their apparent weight across card sizes
    const szMul =
      (Number(this._config.particle_size) || 1) *
      clamp(half / 220, 0.75, 1.8) *
      (1 + (1 - q) * 0.35);

    for (const p of this._particles) {
      const rb = RIBBONS[p.ri];

      // longitude: shell revolve + personal drift + curling two-octave wander
      const lon =
        p.lon + gAng0 * rb.rev + p.drift * ct +
        p.wobA * (1 + env * 1) *
          (Math.sin(ct * p.wobW + p.wobP) +
            0.6 * Math.sin(ct * p.wobW * 2.3 + p.wobP * 2.1));
      const cl = Math.cos(lon), sl = Math.sin(lon);
      const dx = p.cosLat * cl;
      const dy = p.sinLat;
      const dz = p.cosLat * sl;

      /* Coherent deformation, dominated by ROTATING waves: crests that
         circulate around the ring at fixed angular speed (m·lon − ω·t), so
         you watch them chase each other along the rim instead of the shell
         breathing in place — a plane wave stalls wherever it hits the rim
         head-on, which is exactly the pulled-in-and-out look. The dy terms
         tilt the crests diagonally so they still read as 3D fabric. */
      const W =
        0.45 * Math.sin(5 * lon - wt * 1.4 + dy * 2.3) +
        0.3 * Math.sin(8 * lon + wt * 1.05 - dy * 3.1) +
        0.3 * Math.sin((dx * 0.9 + dy * 0.32 + dz * 0.28) * 3.1 + wt * 0.9) +
        0.2 * Math.sin(13 * lon - wt * 2.1 + dy * 1.8);
      /* Quadrature of the rotating components: water-wave orbits. A passing
         crest carries material sideways (cos leads sin by 90°), so waves
         ROLL along the rim. */
      const Wq =
        0.45 * Math.cos(5 * lon - wt * 1.4 + dy * 2.3) +
        0.3 * Math.cos(8 * lon + wt * 1.05 - dy * 3.1);

      /* A storm region drifts around each shell: inside it the folds run
         much deeper and a fine chop rides on top, outside it the skin goes
         nearly calm — so you watch waves build and dissipate as it travels. */
      const agS = 0.5 + 0.5 * Math.sin(lon - ct * (0.5 + p.ri * 0.13) + p.ri * 2.1);
      let agit = gust * (0.45 + 1.3 * agS * agS) * (cur.turb + env * 0.6);
      if (agit > 1.1) agit = 1.1;
      const chop = Math.sin((dx * 0.7 - dy * 0.6 + dz * 0.4) * 7.3 + wt * 1.8);
      const We = W * (0.4 + agit) + chop * 0.38 * agit;

      // wander across the skin thickness; storms fling extra spray
      const off =
        p.off +
        p.bobA * (0.7 + 0.6 * agit) *
          (Math.sin(ct * p.bobW + p.bobP) +
            0.55 * Math.sin(ct * p.bobW * 2.7 + p.bobP * 1.9));
      const edgeLift = 1 - Math.min(1, Math.abs(off));

      const ampMul = cur.amp * (1 + env * 0.4);
      let rf =
        rb.r + cur.radius + breathe + env * 0.015 +
        rb.amp * ampMul * We + off * rb.thick;
      if (We > 0.75) rf += (We - 0.75) * 0.04 * agit; // whitecap spray

      // camera tilt: screen direction + depth
      const px = dx;
      const py = dy * cosTt - dz * sinTt;
      const zd = dy * sinTt + dz * cosTt; // -1 back … +1 front
      const plen = Math.sqrt(px * px + py * py) || 1e-4;

      // flowing peaks live in screen space, on the silhouette
      const sa = Math.atan2(py, px);
      let abin = (sa * 0.15915494) % 1; // sa / 2pi
      if (abin < 0) abin += 1;
      const pkv = ktab[(abin * PEAK_BINS) | 0];
      rf += pkv * (0.35 + 0.65 * edgeLift);

      // life envelope: 0 at birth and death, 1 mid-life, drifting outward
      let u = (t + p.lt) % p.lf;
      u /= p.lf;
      rf += (u - 0.5) * 0.008;
      let life = 6 * u * (1 - u); // fade only near birth/death, full between
      if (life > 1) life = 1;

      // ridge: motes at the skin's core are brighter than the haze
      const ridge = 0.24 + 0.76 * edgeLift * edgeLift;
      let alpha =
        p.br * rb.glow * ridge * life *
        (0.55 + 0.45 * Math.abs(Math.sin(t * p.tw * 0.6 + p.ph))) * cur.bright;
      // drifting dense/sparse patches make the band cloudy, not uniform
      alpha *= 0.68 + 0.32 * Math.sin(lon * 2.7 + ct * 0.45 + p.ph * 3);
      // limb brightening: edge-on sheet glows, face-on sheet is faint mist —
      // THIS is what makes the two shells read as two crisp rings
      const pl2 = plen * plen;
      alpha *= 0.09 + 1.6 * pl2 * pl2 * pl2;
      // light catches the outward folds; stormy stretches glow brighter
      alpha *= 0.62 + 0.5 * Math.max(0, We);
      alpha *= 0.85 + 0.3 * agit;
      alpha *= 1 + pkv * (4 + env * 6); // crests glow, hard while speaking

      // thinking: a bright crest sweeps around the veil
      if (cur.sweep > 0.01) {
        let d = ((sa - this._head) % 6.283185) ;
        if (d < 0) d += 6.283185;
        if (d > 3.141593) d -= 6.283185;
        alpha *= 1 + Math.exp(-(d * d) / 0.25) * cur.sweep * 2.4;
      }
      // responding: each syllable sends an impulse outward through the veil
      let g = 0;
      if (cur.speech > 0.01) {
        let bin = ((rf - PULSE_LO) / PULSE_SPAN) * (PULSE_BINS - 1);
        bin = bin < 0 ? 0 : bin > PULSE_BINS - 1 ? PULSE_BINS - 1 : bin | 0;
        g = ptab[bin];
        rf += g * 0.07;
        alpha *= 1 + g * 1.1 + env * 0.7;
      }

      if (rf > KNEE) rf = KNEE + SPAN * Math.tanh((rf - KNEE) / SPAN);
      const r = rf * half;
      const depth = zd * 0.5 + 0.5;
      // motes swell on the impulse front, so the wave is visible as mass too
      const sz =
        p.sz * szMul * (0.78 + 0.32 * depth) *
        (1 + env * 0.25 + g * 0.5 + pkv * (0.8 + env * 2));
      const orb = half * rb.amp * ampMul * Wq * (0.5 + agit * 0.45);
      const rx = r * px - (py / plen) * orb;
      const ry = r * py + (px / plen) * orb;
      // only the rim survives over the globe: fade to nothing on its face
      let occ = 1;
      const rho2 = rx * rx + ry * ry;
      if (rho2 < occOut2) {
        occ = (Math.sqrt(rho2) - occIn) / occSpan;
        if (occ < 0.02) continue;
        occ *= occ;
      }
      const ga = clamp(alpha * qBoost * (0.45 + 0.65 * depth) * occ, 0, 1);
      if (p.halo && halos) {
        // sparse soft under-glow: the haze the grains float in
        const blob = sz * 8;
        ctx.globalAlpha = ga * 0.22;
        ctx.drawImage(spr, cx + rx - blob / 2, cy + ry - blob / 2, blob, blob);
      }
      // a disc covers ~78% of the square it replaces, so nudge the radius up
      // to keep the field's apparent mass
      const r2 = sz * 0.56;
      const mx = cx + rx, my = cy + ry;
      const path = bins[Math.min(MOTE_ALPHAS - 1, (ga * MOTE_ALPHAS) | 0)];
      path.moveTo(mx + r2, my);
      path.arc(mx, my, r2, 0, 6.283185);
    }
    for (let i = 0; i < MOTE_ALPHAS; i++) {
      ctx.globalAlpha = (i + 0.5) / MOTE_ALPHAS;
      ctx.fill(bins[i]);
    }
    ctx.globalAlpha = 1;

    /* ---- dataset ring: segments load, settle, retire, and shove ---- */
    this._segTick(dt);
    this._drawSegs(ctx, cx, cy, half, R, G, B);

    /* ---- geodesic core, rotated in 3D, clipped to a true circle ---- */
    const SR = half * 0.38;
    const cosS = Math.cos(this._spin), sinS = Math.sin(this._spin);
    const cosT = Math.cos(0.35), sinT = Math.sin(0.35);
    const verts = SPHERE.verts;
    const n = verts.length;
    if (!this._proj || this._proj.length !== n * 3) this._proj = new Float64Array(n * 3);
    const proj = this._proj;
    for (let i = 0; i < n; i++) {
      const v = verts[i];
      const x1 = v[0] * cosS + v[2] * sinS;
      const z1 = -v[0] * sinS + v[2] * cosS;
      const y2 = v[1] * cosT - z1 * sinT;
      proj[i * 3] = cx + x1 * SR;
      proj[i * 3 + 1] = cy - y2 * SR;
      proj[i * 3 + 2] = v[1] * sinT + z1 * cosT;
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, SR, 0, Math.PI * 2);
    ctx.clip();

    const edges = SPHERE.edges;
    const glow = clamp(cur.bright * (1 + env * 0.45), 0.3, 1.9);
    for (let pass = 0; pass < 2; pass++) {
      const front = pass === 1;
      ctx.beginPath();
      for (let e = 0; e < edges.length; e += 2) {
        const i = edges[e] * 3, j = edges[e + 1] * 3;
        if (proj[i + 2] + proj[j + 2] > 0 !== front) continue;
        ctx.moveTo(proj[i], proj[i + 1]);
        ctx.lineTo(proj[j], proj[j + 1]);
      }
      ctx.strokeStyle = front
        ? `rgba(220,246,255,${0.4 * glow})`
        : `rgba(${R},${G},${B},${0.13 * glow})`;
      ctx.lineWidth = Math.max(0.35, half * (front ? 0.0032 : 0.0024));
      ctx.stroke();
    }

    // vertex sparkles on the front face
    ctx.fillStyle = `rgba(235,252,255,1)`;
    for (const s of SPARKS) {
      const i = s.v * 3;
      if (proj[i + 2] <= 0.15) continue;
      const a = Math.pow(Math.abs(Math.sin(t * s.tw + s.ph)), 6) * glow;
      if (a < 0.04) continue;
      ctx.globalAlpha = clamp(a, 0, 1);
      const w = Math.max(1, half * 0.008);
      ctx.fillRect(proj[i] - w / 2, proj[i + 1] - w / 2, w, w);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /* ------------------------------- view ------------------------------- */

  _fmtElapsed(s) {
    if (s == null) return "";
    const m = Math.floor(s / 60);
    if (m < 1) return `${Math.floor(s)}s`;
    if (m < 60) return `${m}m`;
    return `${Math.floor(m / 60)}h ${m % 60}m`;
  }

  /* The "+ New" chips: the configured shortlist, or everything the listener
     knows when no shortlist is set. Entries are either a project name or
     {project, label} when the display name should differ from the spoken one. */
  _chipProjects() {
    const pretty = (p) => p.replace(/\b\w/g, (c) => c.toUpperCase());
    const norm = (e) =>
      typeof e === "string" ? { project: e, label: pretty(e) } : e;
    const wanted = this._config.build_projects;
    const known = this._projects || [];
    if (Array.isArray(wanted) && wanted.length) {
      return wanted
        .map(norm)
        .filter((e) => !known.length || known.includes(e.project));
    }
    return known.map(norm);
  }

  _renderList() {
    const sessions = this._sessions;
    return html`
      <div class="phead">
        <button
          class="hbtn hex"
          data-ai="toggle-build-mode"
          title="Exit build mode"
          @click=${() => this._setBuild(false)}
        >
          <svg viewBox="0 0 24 24"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 12h7M12 8.5v7" stroke="currentColor" stroke-width="1.5"/></svg>
        </button>
        <span class="ptitle">J.A.R.V.I.S. Agents</span>
        <button
          class="hbtn"
          data-ai="create-session"
          @click=${() => (this._picking = !this._picking)}
        >+ New</button>
      </div>
      ${this._picking
        ? html`<div class="chips">
            ${this._chipProjects().map(
              (p) => html`<button class="chip" @click=${() => this._newSession(p.project)}>
                ${p.label}
              </button>`
            )}
          </div>`
        : nothing}
      <div class="list">
        ${sessions == null
          ? html`<div class="dim pad">Scanning…</div>`
          : sessions.length === 0
            ? html`<div class="dim pad">No sessions running.</div>`
            : sessions.map(
                (s) => html`
                  <div class="rowwrap ${this._swipe === s.id ? "open" : ""}">
                    <button
                      class="rowkill"
                      data-ai="swipe-end-session"
                      @click=${() => this._killSession(s.id)}
                    >${this._confirmKill === s.id ? "Sure?" : "End"}</button>
                    <button
                      class="row"
                      data-ai="open-session"
                      @click=${() => this._rowTap(s.id)}
                      @touchstart=${(e) => this._swipeStart(e, s.id)}
                      @touchmove=${(e) => this._swipeMove(e, s.id)}
                      @touchend=${() => this._swipeEnd(s.id)}
                      @touchcancel=${() => this._swipeEnd(s.id)}
                    >
                      <span
                        class="dot ${s.busy ? "busy" : s.done ? "done" : "idle"}"
                        title=${s.done ? "finished — not opened yet" : nothing}
                      ></span>
                      <span class="rmain">
                        <span class="rlabel">
                          ${s.title || s.label}
                          ${s.busy
                            ? html`<span class="rtime">${this._fmtElapsed(s.elapsed)}</span>`
                            : nothing}
                        </span>
                        ${s.last_message
                          ? html`<span class="rsnip">${s.last_message}</span>`
                          : nothing}
                        <span class="rmeta">
                          <span class="pill">${s.project}</span>
                          ${s.label !== s.project
                            ? html`<span class="pill alt">${s.label.replace(`${s.project}, `, "")}</span>`
                            : nothing}
                        </span>
                      </span>
                      <span class="chev">›</span>
                    </button>
                  </div>
                `
              )}
      </div>
    `;
  }

  _renderSession() {
    const s = (this._sessions || []).find((x) => x.id === this._sel);
    return html`
      <div class="phead">
        <button class="hbtn" data-ai="close-session-view" @click=${() => this._select(null)}>‹</button>
        <button
          class="ptitle tappable"
          data-ai="session-details"
          title="What is this session?"
          @click=${() => (this._details = !this._details)}
        >
          ${s?.title || s?.label || "session"}
          ${s?.busy
            ? html`<span class="livedot"></span> working ${this._fmtElapsed(s.elapsed)}`
            : nothing}
          <span class="caret">${this._details ? "▴" : "▾"}</span>
        </button>
        <button
          class="hbtn danger ${this._confirmKill === this._sel ? "armed" : ""}"
          data-ai="end-session"
          @click=${() => this._killSession(this._sel)}
        >${this._confirmKill === this._sel ? "Confirm?" : "End"}</button>
      </div>
      ${this._details
        ? html`<div class="details">
            <div class="drow">
              <span class="dkey">Project</span>
              <span class="pill">${s?.project || "unknown"}</span>
              ${s?.label && s.label !== s.project
                ? html`<span class="pill alt">${s.label.replace(`${s.project}, `, "")}</span>`
                : nothing}
            </div>
            <div class="drow col">
              <span class="dkey">You opened with</span>
              <span class="dfirst">${s?.first_message || "Nothing recorded yet."}</span>
            </div>
          </div>`
        : nothing}
      <div
        class="log"
        @scroll=${(e) => {
          const el = e.target;
          this._stick = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
        }}
      >
        ${this._msgs == null
          ? html`<div class="dim pad">Loading transcript…</div>`
          : this._msgs.length === 0
            ? html`<div class="dim pad">Nothing here yet.</div>`
            : this._msgs.map(
                (m) => html`<div class="msg ${m.role}">${this._body(m)}</div>`
              )}
        ${this._activity && s?.busy
          ? html`<div class="activity">${this._activity}</div>`
          : nothing}
        ${this._ask
          ? html`<div class="askbox ${this._askSent ? "answered" : ""}">
              ${this._ask.text
                ? html`<div class="asktext">${this._ask.text}</div>`
                : nothing}
              ${this._ask.options.map(
                (o) => html`<button
                  class="askopt ${this._askSent === o.key ? "picked" : ""}"
                  data-ai="pick-option"
                  ?disabled=${!!this._askSent}
                  @click=${() => this._sendKey(o.key)}
                >
                  <span class="asknum">${o.key}</span>
                  <span class="asklabel">${o.label}</span>
                  ${this._askSent === o.key
                    ? html`<span class="asktick">✓</span>`
                    : nothing}
                </button>`
              )}
              <div class="askrow">
                ${this._askSent
                  ? html`<span class="dim">sending…</span>`
                  : nothing}
                <button class="askmini" @click=${() => this._sendKey("Enter")}>⏎ confirm</button>
                <button class="askmini" @click=${() => this._sendKey("Escape")}>esc</button>
              </div>
            </div>`
          : nothing}
        ${(this._queue || [])
          .filter((q) => q.id === this._sel)
          .map(
            (q) => html`<div class="qitem ${q.state}">
              <button
                class="qtext"
                data-ai="edit-queued"
                ?disabled=${q.state === "sent"}
                title=${q.state === "held" ? "Tap to edit" : ""}
                @click=${() => q.state === "held" && this._editQueued(q)}
              >${q.text}</button>
              <div class="qbar">
                <span class="qtag">
                  ${q.state === "sent"
                    ? "sending…"
                    : s?.busy
                      ? "queued · sends when this turn ends"
                      : "queued"}
                </span>
                ${q.state === "held"
                  ? html`
                      <button class="qbtn" @click=${() => this._editQueued(q)}>edit</button>
                      <button class="qbtn" @click=${() => this._dispatch(q)}>send now</button>
                      <button class="qbtn del" @click=${() => this._dropQueued(q)}>✕</button>
                    `
                  : nothing}
              </div>
            </div>`
          )}
      </div>
      <form
        class="composer ${this._dragging ? "drag" : ""}"
        @submit=${this._send}
        @dragover=${(e) => {
          if (![...(e.dataTransfer?.types || [])].includes("Files")) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
          this._dragging = true;
        }}
        @dragleave=${(e) => {
          // Fires on every child boundary; only the one that leaves the form
          // for good means the drag is gone.
          if (e.currentTarget.contains(e.relatedTarget)) return;
          this._dragging = false;
        }}
        @drop=${(e) => {
          // Without this the browser navigates away to the dropped file.
          e.preventDefault();
          this._dragging = false;
          this._ingest([...(e.dataTransfer?.files || [])]);
        }}
      >
        ${(this._files || []).length || this._uploading
          ? html`<div class="atts">
              ${(this._files || []).map(
                (f) => html`<span class="att">
                  <span class="attname">${f.name}</span>
                  <button
                    class="attx"
                    title="Remove"
                    @click=${() => this._dropFile(f)}
                  >✕</button>
                </span>`
              )}
              ${this._uploading
                ? html`<span class="att pendingatt">sending…</span>`
                : nothing}
            </div>`
          : nothing}
        <div
          class="cbox"
          @pointerdown=${(e) => {
            // The button row and the box's padding are dead space otherwise.
            // Tapping anywhere in the box should put the cursor in the input.
            if (e.target.closest("button, input, textarea")) return;
            e.preventDefault(); // keep the tap from blurring what we focus
            this._composerEl()?.focus();
          }}
        >
        <div class="cbtns">
          <input
            class="filepick"
            type="file"
            multiple
            accept="image/*,.txt,.md,.log,.json,.csv,.yaml,.yml,.pdf"
            @change=${this._attach}
          />
          <button
            type="button"
            class="hbtn clip"
            data-ai="attach-file"
            title="Attach a file or screenshot"
            ?disabled=${this._uploading}
            @click=${() => this.renderRoot.querySelector(".filepick")?.click()}
          >
            <svg viewBox="0 0 24 24"><path d="M21 11.5l-8.5 8.5a5 5 0 0 1-7-7l8.5-8.5a3.5 3.5 0 0 1 5 5L10.5 18a2 2 0 0 1-3-3l8-8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button
            type="button"
            class="hbtn mic ${this._dictating ? "rec" : ""} ${this._canMic ? "" : "off"}"
            data-ai="dictate-prompt"
            title=${this._canMic
              ? "Dictate"
              : "Dictation needs the https (Nabu Casa) address"}
            @click=${this._composerMic}
          >
            <svg viewBox="0 0 24 24"><path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>
          <button class="hbtn send" data-ai="send-prompt" ?disabled=${this._pending}>
            ${this._pending ? "…" : "Send"}
          </button>
        </div>
        <textarea
          data-ai="compose-prompt"
          rows="2"
          placeholder="Message J.A.R.V.I.S.…"
          autocomplete="off"
          ?disabled=${this._pending}
          @keydown=${(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              this._send(e);
            }
          }}
          @focus=${() => this._settlePin()}
          @input=${(e) => {
            this._autoGrow(e.target);
            this._saveDraft();
          }}
        ></textarea>
        </div>
      </form>
    `;
  }

  render() {
    if (!this._config) return nothing;

    const stateObj = this._hass?.states?.[this._config.entity];
    if (!stateObj) {
      return html`
        <ha-card>
          <div class="missing">
            Entity <code>${this._config.entity}</code> not found
          </div>
        </ha-card>
      `;
    }

    const state = this._effectiveState();
    const color =
      state === "offline"
        ? this._config.offline_color
        : this._config[COLOR_KEY[state]];
    const build = !!this._build;
    // null = no such helper, so the bell stays out of the way entirely.
    const announce = this._announce ?? null;
    const messages = this._messages ?? null;

    return html`
      <ha-card class="bg-${this._config.background}">
        <div
          class="wrap state-${state} ${build && !this._config.build_dashboard ? "build" : ""} ${this._config.build_page ? "page" : ""}"
          style=${`--jr-size:${Number(this._config.size)}px;--jr-color:${color};`}
        >
          <button
            class="mode ${build ? "on" : ""}"
            data-ai="toggle-build-mode"
            title="Build mode"
            @click=${() => this._setBuild(!build)}
          >
            <svg viewBox="0 0 24 24"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 12h7M12 8.5v7" stroke="currentColor" stroke-width="1.5"/></svg>
          </button>
          ${announce === null
            ? nothing
            : html`<button
                class="mode speaker ${announce ? "on" : ""}"
                data-ai="toggle-agent-announcements"
                title=${announce
                  ? "Claude finishes out loud - tap to send to your phone instead"
                  : "Claude finishes go to your phone - tap to hear them here"}
                @click=${this._toggleAnnounce}
              >
                <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
                  <path
                    d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4v-5z"
                    fill=${announce ? "currentColor" : "none"}
                  />
                  <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5" fill="none" />
                  <path d="M18 7a7 7 0 0 1 0 10" fill="none" />
                </svg>
              </button>`}
          ${messages === null
            ? nothing
            : html`<button
                class="mode bell ${messages ? "on" : ""}"
                data-ai="toggle-hubbubb-messages"
                title=${messages
                  ? "New Hubbubb messages are read out here - tap to go quiet"
                  : "Hubbubb messages stay quiet - tap to hear new ones here"}
                @click=${this._toggleMessages}
              >
                <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
                  <path
                    d="M18 15V10a6 6 0 1 0-12 0v5l-1.5 2.5h15L18 15z"
                    fill=${messages ? "currentColor" : "none"}
                  />
                  <path d="M10 19a2 2 0 0 0 4 0" fill="none" />
                </svg>
              </button>`}
          ${build && !this._config.build_dashboard
            ? html`<div class="panel">
                ${this._sel ? this._renderSession() : this._renderList()}
                ${this._err ? html`<div class="perr">${this._err}</div>` : nothing}
              </div>`
            : nothing}
          <div class="ring" data-ai="activate-assistant" @click=${this._ringTap}>
            <canvas></canvas>
            <svg viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <radialGradient id="jrCore">
                  <stop offset="0%" stop-color="currentColor" stop-opacity="0.4" />
                  <stop offset="45%" stop-color="currentColor" stop-opacity="0.09" />
                  <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
                </radialGradient>
                <radialGradient id="jrSphere">
                  <stop offset="0%" stop-color="currentColor" stop-opacity="0.26" />
                  <stop offset="100%" stop-color="currentColor" stop-opacity="0.05" />
                </radialGradient>
                <pattern
                  id="jrHex"
                  width=${HEX_TILE.w}
                  height=${HEX_TILE.h}
                  patternUnits="userSpaceOnUse"
                >
                  <path d=${HEX_PATH} class="hex" />
                </pattern>
                <radialGradient id="jrHexFade">
                  <stop offset="0%" stop-color="#fff" />
                  <stop offset="78%" stop-color="#fff" />
                  <stop offset="100%" stop-color="#000" />
                </radialGradient>
                <mask id="jrHexMask">
                  <circle cx="100" cy="100" r="124" fill="url(#jrHexFade)" />
                  <circle cx="100" cy="100" r="40" fill="#000" />
                </mask>
              </defs>

              <g class="honeycomb-bg">
                <rect x="-150" y="-150" width="500" height="500" fill="url(#jrHex)" />
              </g>

              <circle class="core" cx="100" cy="100" r="92" fill="url(#jrCore)" />

              <g class="scene">
                <g class="honeycomb" mask="url(#jrHexMask)">
                  <rect x="0" y="0" width="200" height="200" fill="url(#jrHex)" />
                </g>

                <circle class="sphere-fill" cx="100" cy="100" r="38" fill="url(#jrSphere)" />
                <circle class="rim" cx="100" cy="100" r="38" />
                <circle class="rim-outer" cx="100" cy="100" r="40.5" />
              </g>
            </svg>
          </div>
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      overflow: hidden;
      line-height: 0;
    }
    ha-card.bg-dark {
      background: radial-gradient(circle at 50% 45%, #0a181c 0%, #030709 72%);
      border: none;
    }
    ha-card.bg-transparent {
      background: none;
      border: none;
      box-shadow: none;
    }
    .missing {
      padding: 16px;
      color: var(--error-color, #db4437);
      text-align: center;
      line-height: 1.4;
    }
    .wrap {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 100%;
      width: 100%;
    }
    .ring {
      position: relative;
      width: var(--jr-size, 240px);
      max-width: 100%;
      aspect-ratio: 1 / 1;
      cursor: pointer;
      transition: width 0.45s cubic-bezier(0.4, 0, 0.2, 1);
      -webkit-tap-highlight-color: transparent;
    }
    .ring:active {
      filter: brightness(1.25);
    }

    /* ---------------- build mode ---------------- */
    .wrap.build {
      flex-direction: row;
      align-items: stretch;
      gap: 12px;
      padding: 12px;
      box-sizing: border-box;
      height: clamp(280px, var(--jr-size), 480px);
    }
    /* The dedicated build dashboard fills the view. Sized off the VISIBLE
       viewport, not dvh: dvh ignores the keyboard, so the page stayed taller
       than the screen and the browser scrolled the header away to reach the
       composer. --jr-vvh shrinks with the keyboard, so the page always fits
       and there is never anything to scroll. */
    .wrap.build.page {
      /* HA's header is the only thing above the panel view — read its own
         variable instead of guessing, or the leftover shows as a black bar
         under the card. */
      height: calc(100vh - var(--header-height, 56px));
      height: calc(var(--jr-vvh, 100dvh) - var(--header-height, 56px));
    }
    .wrap.build .ring {
      order: 1;
      width: clamp(90px, 24%, 170px);
      align-self: center;
      flex: none;
    }
    .mode {
      position: absolute;
      top: 8px;
      left: 8px;
      z-index: 3;
      width: 32px;
      height: 32px;
      padding: 5px;
      background: none;
      border: none;
      color: var(--jr-color);
      opacity: 0.45;
      cursor: pointer;
      transition: opacity 0.3s, filter 0.3s;
    }
    .mode:hover {
      opacity: 0.9;
    }
    .mode.on {
      opacity: 1;
      filter: drop-shadow(0 0 6px var(--jr-color));
    }
    .mode svg {
      position: static;
      width: 100%;
      height: 100%;
    }
    /* Opposite corner from the build hexagon: the speaker on the edge where
       the bell used to sit, the Hubbubb bell tucked inboard of it. Solid when
       that channel speaks here, hollow when it does not - .mode/.mode.on
       supply the rest. */
    .mode.speaker {
      left: auto;
      right: 8px;
    }
    .mode.bell {
      left: auto;
      right: 44px;
    }
    /* fill is set as a presentation attribute on the path, which still takes
       part in the cascade - so the swap eases instead of snapping. */
    .mode.speaker svg path,
    .mode.bell svg path {
      transition: fill 0.25s;
    }

    .panel {
      order: 2;
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      background: linear-gradient(160deg, rgba(10, 24, 32, 0.92), rgba(4, 10, 14, 0.96));
      border: 1px solid rgba(53, 154, 210, 0.35);
      border-radius: 10px;
      box-shadow: inset 0 0 28px rgba(46, 157, 245, 0.08);
      padding: 10px 12px;
      color: #cfe9f7;
      font-family: "Avenir Next", "Segoe UI", Roboto, sans-serif;
      line-height: 1.4;
      text-align: left;
      overscroll-behavior: contain;
    }
    .phead {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 8px;
      margin-bottom: 8px;
      border-bottom: 1px solid rgba(53, 154, 210, 0.3);
      flex: none;
    }
    .ptitle {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--jr-color);
      text-shadow: 0 0 8px rgba(46, 157, 245, 0.5);
    }
    .hbtn {
      flex: none;
      background: rgba(46, 157, 245, 0.06);
      border: 1px solid rgba(53, 154, 210, 0.45);
      color: #bfe3f5;
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 4px 10px;
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }
    .hbtn:hover {
      background: rgba(46, 157, 245, 0.18);
      box-shadow: 0 0 10px rgba(46, 157, 245, 0.35);
    }
    .hbtn.danger {
      border-color: rgba(255, 90, 100, 0.5);
      color: #ffb3b8;
    }
    .hbtn.danger.armed {
      background: rgba(255, 70, 80, 0.25);
      box-shadow: 0 0 10px rgba(255, 70, 80, 0.5);
      color: #fff;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding-bottom: 8px;
      flex: none;
    }
    .chip {
      background: none;
      border: 1px solid rgba(53, 154, 210, 0.4);
      border-radius: 4px;
      color: #b8dff2;
      font-size: 11.5px;
      padding: 4px 10px;
      cursor: pointer;
      font-family: inherit;
      letter-spacing: 0.05em;
    }
    .chip:hover {
      background: rgba(46, 157, 245, 0.15);
    }
    .list {
      flex: 1;
      overflow-y: auto;
      min-height: 0;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      background: none;
      border: none;
      border-bottom: 1px solid rgba(53, 154, 210, 0.14);
      padding: 8px 4px;
      cursor: pointer;
      color: inherit;
      font-family: inherit;
      text-align: left;
    }
    .row:hover {
      background: rgba(46, 157, 245, 0.08);
    }
    .dot {
      flex: none;
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .dot.idle {
      background: var(--jr-color);
      box-shadow: 0 0 6px var(--jr-color);
    }
    /* same meaning as a green plate on the ring: finished, not opened yet */
    .dot.done {
      background: #28e28a;
      box-shadow: 0 0 8px #28e28a;
    }
    .dot.busy {
      background: #ffaa33;
      box-shadow: 0 0 8px #ffaa33;
      animation: jr-blink 1.1s ease-in-out infinite;
    }
    .livedot {
      display: inline-block;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #ffaa33;
      box-shadow: 0 0 8px #ffaa33;
      animation: jr-blink 1.1s ease-in-out infinite;
      margin: 0 2px 0 6px;
      vertical-align: middle;
    }
    @keyframes jr-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.35; }
    }
    .rmain {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .rlabel {
      font-size: 13px;
      letter-spacing: 0.04em;
      color: #e4f4fd;
    }
    .rtime {
      font-size: 10px;
      color: #ffaa33;
      letter-spacing: 0.1em;
      margin-left: 8px;
    }
    .rsnip {
      font-size: 11px;
      color: rgba(160, 200, 220, 0.55);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .rmeta {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
      margin-top: 3px;
    }
    .pill {
      font-size: 9.5px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--jr-color);
      background: rgba(46, 157, 245, 0.12);
      border: 1px solid rgba(53, 154, 210, 0.35);
      border-radius: 999px;
      padding: 2px 8px;
      white-space: nowrap;
    }
    .pill.alt {
      color: #ffc477;
      background: rgba(255, 170, 51, 0.1);
      border-color: rgba(255, 170, 51, 0.35);
    }

    /* Swipe left to reveal End. The kill button sits underneath and the row
       slides off it. */
    .rowwrap {
      position: relative;
      overflow: hidden;
    }
    .rowwrap .row {
      position: relative;
      z-index: 1;
      background: linear-gradient(160deg, #0b1a22 0%, #070f15 100%);
      transition: transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
      touch-action: pan-y;
    }
    .rowwrap.open .row {
      transform: translateX(-84px);
    }
    .rowkill {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 84px;
      border: none;
      background: rgba(255, 70, 80, 0.22);
      color: #ff8a92;
      font-family: inherit;
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
    }
    .rowkill:hover {
      background: rgba(255, 70, 80, 0.32);
    }

    /* Tap the title for what this session actually is. */
    .ptitle.tappable {
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      padding: 0;
      font: inherit;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--jr-color);
    }
    .caret {
      font-size: 9px;
      opacity: 0.7;
      margin-left: 4px;
    }
    .details {
      flex: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 8px;
      padding: 9px 10px;
      background: rgba(46, 157, 245, 0.06);
      border: 1px solid rgba(53, 154, 210, 0.28);
      border-radius: 8px;
    }
    .drow {
      display: flex;
      align-items: center;
      gap: 7px;
      flex-wrap: wrap;
    }
    .drow.col {
      flex-direction: column;
      align-items: flex-start;
      gap: 3px;
    }
    .dkey {
      font-size: 9.5px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(160, 200, 220, 0.6);
    }
    .dfirst {
      font-size: 12px;
      line-height: 1.45;
      color: #d6edf9;
      max-height: 5.9em;
      overflow-y: auto;
    }
    .chev {
      flex: none;
      color: rgba(120, 180, 215, 0.5);
      font-size: 16px;
    }
    .log {
      flex: 1;
      overflow-y: auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 2px 2px 8px;
      scrollbar-width: thin;
      scrollbar-color: rgba(53, 154, 210, 0.4) transparent;
      overscroll-behavior: contain;
    }
    /* The page around us (the companion app's webview especially) turns
       selection off to feel native. The conversation is text worth copying. */
    .log,
    .msg {
      user-select: text;
      -webkit-user-select: text;
      -webkit-touch-callout: default;
    }
    .msg {
      max-width: 94%;
      font-size: 14.5px;
      line-height: 1.5;
      white-space: pre-wrap;
      overflow-wrap: break-word;
    }
    .msg.assistant {
      align-self: flex-start;
      border-left: 2px solid var(--jr-color);
      padding-left: 9px;
      color: #d6edf9;
    }
    .msg.user {
      align-self: flex-end;
      background: rgba(46, 157, 245, 0.12);
      border: 1px solid rgba(53, 154, 210, 0.25);
      padding: 5px 9px;
      color: #a8d8f0;
    }
    .msg.screen {
      max-width: 100%;
      font-family: "SF Mono", Menlo, monospace;
      font-size: 11.5px;
      opacity: 0.85;
      background: rgba(0, 0, 0, 0.35);
      padding: 8px;
      border: 1px solid rgba(53, 154, 210, 0.18);
    }
    /* Everything the terminal shows: what Claude thought, every tool call
       and every result. Tools and their output are full-width mono blocks —
       they are terminal output, not a chat bubble. */
    .msg.think {
      align-self: flex-start;
      font-style: italic;
      font-size: 13px;
      color: rgba(178, 160, 220, 0.8);
      border-left: 2px solid rgba(150, 120, 220, 0.45);
      padding-left: 9px;
    }
    .msg.tool,
    .msg.out,
    .msg.err {
      align-self: stretch;
      max-width: 100%;
      font-family: "SF Mono", Menlo, monospace;
      font-size: 11.5px;
      line-height: 1.45;
      padding: 5px 8px;
      background: rgba(0, 0, 0, 0.32);
      border-left: 2px solid rgba(53, 154, 210, 0.35);
      color: #9fb4c4;
    }
    .msg.tool {
      border-left-color: rgba(126, 231, 135, 0.55);
      color: #cfe6d6;
    }
    .msg.err {
      border-left-color: rgba(255, 123, 114, 0.7);
      background: rgba(255, 60, 60, 0.07);
      color: #ffb3ae;
    }
    /* Line colouring, shared by every mono block. */
    .l-cmd {
      color: #7ee787;
    }
    .l-add {
      color: #7ee787;
    }
    .l-del {
      color: #ff7b72;
    }
    .l-err {
      color: #ff9d95;
    }
    .l-warn {
      color: #e3b341;
    }
    .l-tool {
      color: #ffd9a0;
    }
    .msg code {
      font-family: "SF Mono", Menlo, monospace;
      font-size: 0.92em;
      color: #8fd0ff;
      background: rgba(46, 157, 245, 0.13);
      border-radius: 3px;
      padding: 0 3px;
    }
    .msg b {
      color: #ffffff;
      font-weight: 600;
    }
    .composer {
      display: block;
      flex: none;
      padding-top: 8px;
      border-top: 1px solid rgba(53, 154, 210, 0.3);
    }
    /* The box owns the border and background; the textarea and the button row
       stack inside it. The buttons used to be positioned over the textarea,
       which meant long text scrolled underneath and hid them — a row of their
       own cannot be covered. */
    .cbox {
      display: flex;
      flex-direction: column;
      background: rgba(0, 10, 16, 0.6);
      border: 1px solid rgba(53, 154, 210, 0.4);
      border-radius: 6px;
      overflow: hidden;
    }
    .cbox:focus-within,
    .composer.drag .cbox {
      border-color: var(--jr-color);
      box-shadow: 0 0 10px rgba(46, 157, 245, 0.35);
    }
    .composer.drag .cbox {
      border-style: dashed;
    }
    .composer textarea {
      display: block;
      width: 100%;
      box-sizing: border-box;
      background: none;
      border: none;
      color: #e4f4fd;
      font-family: inherit;
      font-size: 13px;
      line-height: 1.4;
      /* The textarea is now the bottom of the box, so its last line is what
         the rounded bottom corners would clip. Scale the gap off the same
         variable that sets that radius. */
      padding: 2px 10px max(8px, calc(var(--jr-botr, 16px) * 0.3));
      outline: none;
      resize: none;
      /* Mirrors _growCap(): never more than a third of the visible viewport,
         so the send row stays on screen when the keyboard is up. */
      max-height: min(190px, calc(var(--jr-vvh, 100dvh) * 0.32));
      overflow-y: auto;
      scrollbar-width: thin;
    }
    /* Buttons along the top of the box, input underneath. The top corners are
       a plain 6px, so nothing up here has a curve to dodge — the clearance
       that used to live on this row now belongs to the textarea below. */
    .cbtns {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
      padding: 6px 6px 2px;
    }
    .filepick {
      display: none;
    }
    .hbtn.clip {
      padding: 3px 8px;
      display: inline-flex;
      align-items: center;
    }
    .hbtn.clip svg {
      position: static;
      width: 18px;
      height: 18px;
      color: var(--jr-color);
      display: block;
    }
    .hbtn.clip[disabled] {
      opacity: 0.45;
    }
    .atts {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding-bottom: 7px;
    }
    .att {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      max-width: 100%;
      font-size: 11px;
      color: #d6edf9;
      background: rgba(46, 157, 245, 0.12);
      border: 1px solid rgba(53, 154, 210, 0.35);
      border-radius: 999px;
      padding: 3px 5px 3px 10px;
    }
    .attname {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 190px;
    }
    .attx {
      flex: none;
      background: none;
      border: none;
      color: #ff8a92;
      font-family: inherit;
      font-size: 11px;
      line-height: 1;
      padding: 2px 4px;
      cursor: pointer;
    }
    .pendingatt {
      color: #ffaa33;
      border-color: rgba(255, 170, 51, 0.4);
      background: rgba(255, 170, 51, 0.1);
      padding-right: 10px;
      animation: jr-blink 1.4s ease-in-out infinite;
    }
    .msg.cmd {
      align-self: center;
      max-width: 100%;
      font-family: "SF Mono", Menlo, monospace;
      font-size: 11.5px;
      line-height: 1.5;
      color: rgba(150, 195, 220, 0.75);
      background: rgba(53, 154, 210, 0.07);
      border-left: 2px solid rgba(53, 154, 210, 0.4);
      padding: 4px 9px;
    }

    /* Queued: still ours, not yet Claude's. Editable until it goes out. */
    .qitem {
      align-self: flex-end;
      max-width: 94%;
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: rgba(255, 170, 51, 0.07);
      border: 1px dashed rgba(255, 170, 51, 0.5);
      border-radius: 8px;
      padding: 7px 9px;
    }
    .qitem.sent {
      border-style: solid;
      border-color: rgba(53, 154, 210, 0.35);
      background: rgba(46, 157, 245, 0.1);
      opacity: 0.75;
    }
    .qtext {
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      text-align: left;
      font-family: inherit;
      font-size: 12.5px;
      line-height: 1.4;
      color: #f0dcbe;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      cursor: pointer;
    }
    .qitem.sent .qtext {
      color: #a8d8f0;
      cursor: default;
    }
    .qbar {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .qtag {
      flex: 1;
      min-width: 0;
      font-size: 9px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #ffaa33;
    }
    .qitem.sent .qtag {
      color: rgba(160, 200, 220, 0.7);
      animation: jr-blink 1.4s ease-in-out infinite;
    }
    .qbtn {
      flex: none;
      background: none;
      border: 1px solid rgba(255, 170, 51, 0.4);
      color: #ffc477;
      font-family: inherit;
      font-size: 10px;
      padding: 3px 7px;
      border-radius: 4px;
      cursor: pointer;
    }
    .qbtn:hover {
      border-color: #ffaa33;
      background: rgba(255, 170, 51, 0.12);
    }
    .qbtn.del {
      border-color: rgba(255, 120, 130, 0.4);
      color: #ff8a92;
    }
    .activity {
      align-self: flex-start;
      font-family: "SF Mono", Menlo, monospace;
      font-size: 11px;
      color: rgba(160, 200, 220, 0.7);
      animation: jr-blink 1.6s ease-in-out infinite;
    }
    .askbox {
      align-self: stretch;
      display: flex;
      flex-direction: column;
      gap: 6px;
      border: 1px solid rgba(255, 170, 51, 0.45);
      background: rgba(255, 170, 51, 0.06);
      padding: 10px;
    }
    .asktext {
      font-size: 12px;
      color: #ffd9a0;
      white-space: pre-wrap;
    }
    .askopt {
      display: flex;
      align-items: center;
      gap: 8px;
      text-align: left;
      background: rgba(0, 10, 16, 0.6);
      border: 1px solid rgba(53, 154, 210, 0.4);
      color: #e4f4fd;
      font-family: inherit;
      font-size: 12.5px;
      padding: 8px 10px;
      cursor: pointer;
    }
    .askopt:hover:not([disabled]) {
      border-color: var(--jr-color);
    }
    .askopt[disabled] {
      opacity: 0.4;
      cursor: default;
    }
    .askopt.picked {
      opacity: 1;
      border-color: #ffaa33;
      background: rgba(255, 170, 51, 0.14);
      color: #ffd9a0;
    }
    .asklabel {
      flex: 1;
      min-width: 0;
    }
    .asktick {
      flex: none;
      color: #ffaa33;
    }
    .asknum {
      flex: none;
      color: #ffaa33;
      font-size: 11px;
    }
    .askrow {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
    }
    .askrow .dim {
      margin-right: auto;
      font-size: 10px;
      animation: jr-blink 1.4s ease-in-out infinite;
    }
    .askmini {
      background: none;
      border: 1px solid rgba(53, 154, 210, 0.3);
      color: rgba(160, 200, 220, 0.7);
      font-family: inherit;
      font-size: 11px;
      padding: 3px 8px;
      cursor: pointer;
    }
    /* In build mode the toggle lives in the panel header, not floating. */
    .wrap.build .mode {
      display: none;
    }
    .hbtn.hex {
      padding: 3px 7px;
    }
    .hbtn.hex svg,
    .hbtn.mic svg {
      position: static;
      width: 18px;
      height: 18px;
      color: var(--jr-color);
      display: block;
    }
    /* Shown everywhere, not just on phones — dictating into a session is just
       as useful from a laptop or a tablet. */
    .hbtn.mic {
      display: inline-flex;
      align-items: center;
      padding: 3px 8px;
    }
    /* The browser only grants microphone access in a secure context, so over
       the plain-http LAN address it cannot work at all. Dim rather than hide,
       and let the click explain why. */
    .hbtn.mic.off svg {
      color: rgba(160, 200, 220, 0.5);
    }
    .hbtn.mic.off {
      opacity: 0.55;
    }
    .hbtn.mic.rec {
      border-color: rgba(255, 90, 100, 0.7);
      background: rgba(255, 70, 80, 0.12);
    }
    .hbtn.mic.rec svg {
      color: #ff5a64;
      animation: jr-blink 1s ease-in-out infinite;
    }

    /* Phones: build mode is a full-screen overlay pinned to the visual
       viewport — the keyboard shrinks it instead of scrolling the dashboard,
       so the composer always sits right on top of the keyboard. */
    @media (max-width: 620px) {
      .wrap.build .ring {
        display: none;
      }
      .wrap.build {
        /* inline build mode: the fixed overlay below is the real UI */
        height: 140px;
      }
      .wrap.build .panel {
        /* opaque: the HA header must not ghost through the overlay */
        background: linear-gradient(160deg, #0b1a22 0%, #05090d 100%);
      }
      /* home dashboard: the ring owns the first screenful */
      .wrap:not(.build) {
        min-height: calc(100vh - 150px);
        min-height: calc(100dvh - 150px);
        justify-content: center;
      }
      .wrap.build:not(.page) .panel {
        position: fixed;
        /* Flush to the sides, inset vertically by the safe area. There is no
           CSS env() for the display's corner radius — safe-area-inset-* are
           the only device metrics exposed — but Apple's insets already ACCOUNT
           for the rounded corners, so the top and bottom edges land where the
           screen is straight. That is why the corners stopped being clipped:
           the panel no longer reaches into the curve, rather than trying to
           guess a radius that matches it. In portrait the left/right insets
           are 0, so the sides sit truly flush with no gap. */
        left: env(safe-area-inset-left, 0px);
        right: env(safe-area-inset-right, 0px);
        top: calc(var(--jr-vvt, 0px) + env(safe-area-inset-top, 0px));
        /* Runs all the way to the bottom of the visible viewport: with the
           keyboard up that is the keyboard's top edge, so the composer sits
           flush against it. Subtracting the bottom safe-area inset here left a
           dead band under the message box instead. */
        height: calc(var(--jr-vvh, 100dvh) - env(safe-area-inset-top, 0px));
        /* or the padding is added to the height and the composer ends up
           below the fold, behind the keyboard */
        box-sizing: border-box;
        z-index: 20;
        /* Cosmetic now, not corner-clearance: both horizontal edges are
           already outside the curve, so a modest radius is enough. */
        border-radius: 18px 18px var(--jr-botr, 56px) var(--jr-botr, 56px);
        /* Tight at the bottom: the composer is the last thing in the panel and
           a full 12px under it read as dead space. The sides and top keep
           their breathing room. */
        padding: 12px 14px 10px;
      }
      /* The dedicated build page: no overlay tricks — the panel is a normal
         element sized to exactly fill the screen below HA's header, so the
         page has nothing to scroll and nothing to cut off. */
      .wrap.build.page {
        height: calc(100vh - 56px);
        height: calc(var(--jr-vvh, 100dvh) - 56px);
        padding: 8px;
      }
      /* Pinned to the visible viewport, exactly like the overlay above. On a
         phone this is the only thing that survives iOS: whatever the browser
         scrolls to chase the focused input, the panel still sits over the
         visible area with the composer directly above the keyboard. Sizing
         alone was not enough — the page kept the scroll iOS gave it and left a
         screen of nothing above the keyboard. */
      .wrap.build.page .panel {
        position: fixed;
        /* Flush to the sides, inset vertically by the safe area. There is no
           CSS env() for the display's corner radius — safe-area-inset-* are
           the only device metrics exposed — but Apple's insets already ACCOUNT
           for the rounded corners, so the top and bottom edges land where the
           screen is straight. That is why the corners stopped being clipped:
           the panel no longer reaches into the curve, rather than trying to
           guess a radius that matches it. In portrait the left/right insets
           are 0, so the sides sit truly flush with no gap. */
        left: env(safe-area-inset-left, 0px);
        right: env(safe-area-inset-right, 0px);
        top: calc(var(--jr-vvt, 0px) + env(safe-area-inset-top, 0px));
        /* Runs all the way to the bottom of the visible viewport: with the
           keyboard up that is the keyboard's top edge, so the composer sits
           flush against it. Subtracting the bottom safe-area inset here left a
           dead band under the message box instead. */
        height: calc(var(--jr-vvh, 100dvh) - env(safe-area-inset-top, 0px));
        box-sizing: border-box;
        z-index: 20;
        /* Cosmetic now, not corner-clearance: both horizontal edges are
           already outside the curve, so a modest radius is enough. */
        border-radius: 18px 18px var(--jr-botr, 56px) var(--jr-botr, 56px);
        /* Tight at the bottom: the composer is the last thing in the panel and
           a full 12px under it read as dead space. The sides and top keep
           their breathing room. */
        padding: 12px 14px 10px;
      }
      .composer textarea {
        font-size: 16px; /* anything smaller makes iOS zoom the page */
      }
      /* The message box is the last thing in the panel, so its bottom corners
         sit inside the panel's. Follow that curve, minus the panel's side
         padding, or a 56px panel corner wraps around a 6px box corner and the
         gap between them looks like a mistake. */
      .cbox {
        border-radius: 6px 6px
          max(6px, calc(var(--jr-botr, 16px) - 14px))
          max(6px, calc(var(--jr-botr, 16px) - 14px));
      }
    }

    .dim {
      color: rgba(160, 200, 220, 0.55);
      font-size: 12px;
    }
    .pad {
      padding: 10px 4px;
    }
    .perr {
      flex: none;
      color: #ff8a92;
      font-size: 11px;
      padding-top: 6px;
    }
    canvas,
    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
    svg {
      overflow: visible;
      color: var(--jr-color);
      transition: color 900ms ease;
      pointer-events: none;
    }
    circle,
    path,
    rect,
    g {
      transform-origin: 100px 100px;
      transform-box: view-box;
    }
    circle {
      fill: none;
      stroke: currentColor;
    }

    .core {
      stroke: none;
      opacity: 0.5;
      animation: jr-breathe 7s ease-in-out infinite;
      transition: opacity 900ms ease;
    }
    .scene {
      opacity: var(--jr-scene, 0.78);
      transition: opacity 900ms ease;
    }

    .hex {
      fill: none;
      stroke: currentColor;
      stroke-width: 0.35;
    }
    .honeycomb {
      opacity: 0.2;
    }
    /* faint substrate across the whole card, fading out past the ring */
    .honeycomb-bg {
      opacity: 0.055;
      transition: opacity 900ms ease;
    }

    .sphere-fill {
      stroke: none;
    }
    .rim {
      stroke: #eafaff;
      stroke-width: 1.7;
      opacity: 0.92;
    }
    .rim-outer {
      stroke: #eafaff;
      stroke-width: 0.6;
      opacity: 0.4;
      animation: jr-rim 7s ease-in-out infinite;
    }

    .state-idle {
      --jr-scene: 0.72;
    }
    .state-listening {
      --jr-scene: 1;
    }
    .state-processing {
      --jr-scene: 0.95;
    }
    .state-responding {
      --jr-scene: 0.95;
    }
    .state-offline {
      --jr-scene: 0.25;
    }
    .state-offline .core {
      opacity: 0.06;
    }
    .state-offline .honeycomb-bg {
      opacity: 0.015;
    }
    .state-listening .core {
      opacity: 0.9;
    }
    .state-processing .core,
    .state-responding .core {
      opacity: 0.75;
    }

    @keyframes jr-breathe {
      0%,
      100% {
        transform: scale(0.99);
      }
      50% {
        transform: scale(1.015);
      }
    }
    @keyframes jr-rim {
      0%,
      100% {
        opacity: 0.22;
      }
      50% {
        opacity: 0.65;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .core,
      .rim-outer {
        animation-duration: 24s;
      }
    }
  `;
}

const EDITOR_SCHEMA = [
  {
    name: "entity",
    required: true,
    selector: { entity: { domain: SATELLITE_DOMAIN } },
  },
  {
    name: "size",
    selector: { number: { min: 80, max: 600, step: 10, mode: "slider" } },
  },
  {
    name: "background",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { value: "dark", label: "Deep space (dark)" },
          { value: "card", label: "Normal card background" },
          { value: "transparent", label: "Transparent" },
        ],
      },
    },
  },
  {
    name: "particles",
    selector: { number: { min: 0, max: 4000, step: 20, mode: "box" } },
  },
  {
    name: "particle_size",
    selector: { number: { min: 0.5, max: 3, step: 0.1, mode: "slider" } },
  },
  { name: "tap_message", selector: { text: {} } },
  { name: "follow_media_player", selector: { boolean: {} } },
  {
    name: "audio_offset",
    selector: { number: { min: -2, max: 2, step: 0.05, mode: "box" } },
  },
  {
    name: "media_player",
    selector: { entity: { domain: "media_player" } },
  },
  {
    name: "",
    type: "expandable",
    title: "Build mode",
    icon: "mdi:hexagon-multiple-outline",
    schema: [
      {
        name: "build_entity",
        selector: { entity: { domain: "input_boolean" } },
      },
    ],
  },
  {
    name: "announce_entity",
    selector: { entity: { domain: "input_boolean" } },
  },
  {
    name: "messages_entity",
    selector: { entity: { domain: "input_boolean" } },
  },
  {
    name: "",
    type: "expandable",
    title: "Colors",
    icon: "mdi:palette",
    schema: [
      { name: "idle_color", selector: { text: {} } },
      { name: "listening_color", selector: { text: {} } },
      { name: "processing_color", selector: { text: {} } },
      { name: "responding_color", selector: { text: {} } },
      { name: "offline_color", selector: { text: {} } },
    ],
  },
];

const EDITOR_LABELS = {
  entity: "Assist satellite",
  size: "Ring size (px)",
  background: "Card background",
  particles: "Particle count (0 = auto)",
  particle_size: "Particle size",
  follow_media_player: "Animate while the device is playing audio",
  audio_offset: "Audio sync offset (seconds)",
  media_player: "Speaker entity (blank = same device)",
  tap_message: "Spoken reply when the ring is tapped",
  build_entity: "Build mode toggle helper (optional)",
  announce_entity: "Claude announcement toggle helper",
  messages_entity: "Hubbubb message announcement toggle helper",
  idle_color: "Idle",
  listening_color: "Listening",
  processing_color: "Processing",
  responding_color: "Responding",
  offline_color: "Unavailable",
};

class HubbubbRingCardEditor extends LitElement {
  static properties = {
    hass: {},
    _config: { state: true },
  };

  setConfig(config) {
    this._config = { ...DEFAULTS, ...config };
  }

  render() {
    if (!this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${EDITOR_SCHEMA}
        .computeLabel=${(schema) => EDITOR_LABELS[schema.name] ?? schema.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  /* Only write what differs from the defaults, so the saved YAML stays the
     few lines the user actually chose. */
  _valueChanged(ev) {
    ev.stopPropagation();
    const value = { ...ev.detail.value };
    for (const [key, dflt] of Object.entries(DEFAULTS)) {
      if (value[key] === dflt) delete value[key];
    }
    // v1.x wrote these into saved configs; strip them so no card keeps a label
    delete value.name;
    delete value.show_state;
    fireEvent(this, "config-changed", { config: value });
  }
}

customElements.define("hubbubb-ring-card", HubbubbRingCard);
customElements.define("hubbubb-ring-card-editor", HubbubbRingCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "hubbubb-ring-card",
  name: "Hubbubb Ring",
  description:
    "Animated glowing ring that reacts to an Assist satellite's state.",
  preview: true,
});

console.info(
  `%c HUBBUBB-RING-CARD %c v${CARD_VERSION} `,
  "color:#0b1620;background:#35e0ff;font-weight:700",
  "color:#35e0ff;background:#0b1620"
);
