/* Hubbubb voice studio — a recording desk for wake-word and speaker data.

   A full panel rather than a card, because a recording session is a sit-down
   job: pick what you are recording, say it thirty times, listen back, throw
   out the coughs, file the good ones. Everything goes through the
   integration's proxy at /api/hubbubb_home/voice/<path>, so the browser only
   ever holds a Home Assistant session - the voice service's own token stays
   on the server.

   The pure parts (URL building, filtering, the meter maths, the blob
   lifecycle) are exported so test/voice-studio.mjs can assert them without a
   browser. */
import { LitElement, css, html, nothing } from "lit";

/* Not import.meta.url: the build targets es2017 for the wall tablet's old
   webview and esbuild lowers import.meta to `{}` below es2020. */
const BUILD =
  ((new Error().stack || "").match(/\/(\d+\.\d+\.\d+)\//) || [])[1] || "dev";
console.info(`hubbubb-voice-studio ${BUILD}`);

export const API_BASE = "/api/hubbubb_home/voice/";
/* The integration's own endpoint, not the voice service's: who is linked to
   their own Hubbubb user. Given whole, so _api can tell it from a proxied path. */
export const LINKS_PATH = "/api/hubbubb_home/people/links";
/* Sign in with Hubbubb: mints a flow and hands back the URL to open. */
export const SIGNIN_PATH = "/api/hubbubb_home/oauth/start";

export const KINDS = [
  { id: "wake", name: "Wake word", hint: "the phrase, said the way you say it" },
  { id: "ambient", name: "Room noise", hint: "what it must not wake to" },
  { id: "voice", name: "Voice", hint: "a person, for speaker matching" },
];

const enc = encodeURIComponent;
const query = (params = {}) => {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${enc(k)}=${enc(v)}`)
    .join("&");
  return q ? `?${q}` : "";
};

/* Every upstream call as [method, path, body]. One table, so the test can
   check the wire shape of each without a fetch in sight. */
export const api = {
  status: () => ["GET", "record/status"],
  start: (kind, label) => ["POST", "record/start", { kind, label }],
  stop: () => ["POST", "record/stop"],
  clips: (filter) => ["GET", `clips${query(filter)}`],
  deleteClip: (id) => ["DELETE", `clips/${enc(id)}`],
  refile: (id, patch) => ["POST", `clips/${enc(id)}`, patch],
  people: () => ["GET", "people"],
  enroll: (person, clips) => ["POST", "people/enroll", { person, clips }],
  deletePerson: (person) => ["POST", "people/delete", { person }],
  train: (phrase) => ["POST", "train", { phrase }],
  trainStatus: () => ["GET", "train/status"],
  /* Raw wav, not JSON: the fourth slot is the content type _api sends it as.
     Voice only - the service refuses the other kinds, and so does this. */
  upload: (label, wav) => ["POST", `clips/upload${query({ kind: "voice", label })}`, wav, "audio/wav"],
  links: () => ["GET", LINKS_PATH],
  link: (person, client_id, client_secret) => ["POST", LINKS_PATH, { person, client_id, client_secret }],
  unlink: (person) => ["DELETE", `${LINKS_PATH}/${enc(person)}`],
  signIn: (person) => ["GET", `${SIGNIN_PATH}${query({ person })}`],
};

export const audioPath = (id) => `${API_BASE}clips/${enc(id)}/audio`;

/* What to tell the user when a call fails. The proxy answers 503 with a
   short JSON message when the voice service is unreachable; aiohttp's own
   errors are plain text. Either way the words are more use than the code. */
export function errMessage(status, body) {
  let text = typeof body === "string" ? body : "";
  try {
    const j = typeof body === "string" ? JSON.parse(body) : body;
    // Parsed JSON with no message is worth nothing to a person; fall through
    // to the status rather than print braces.
    text = j?.message || j?.error || j?.detail || "";
  } catch (e) {}
  text = (text || "").trim();
  if (!text) text = status === 503 ? "the voice service is not reachable" : `request failed (${status})`;
  return text;
}

/* created comes back as epoch seconds; tolerate ms and ISO too, because
   "newest first" silently becomes "random order" if this guesses wrong. */
export const clipTime = (created) => {
  if (typeof created === "number") return created < 1e12 ? created * 1000 : created;
  const t = Date.parse(created);
  return Number.isFinite(t) ? t : 0;
};

/* Newest first, narrowed by kind, label and a since-time (ms). */
export function filterClips(clips, { kind, label, since } = {}) {
  return (clips || [])
    .filter((c) => !kind || c.kind === kind)
    .filter((c) => !label || c.label === label)
    .filter((c) => !since || clipTime(c.created) >= since)
    .sort((a, b) => clipTime(b.created) - clipTime(a.created));
}

/* Labels in use for a kind, most clips first - the filter chips. */
/* The People card's rows: everyone the voice service has samples for and
   everyone with a Hubbubb line, matched by name case-blind. `links` is null
   when Hubbubb is not set up, and then no row says anything about it. */
export function peopleRows(people, links) {
  const rows = new Map();
  for (const [name, n] of Object.entries(people || {})) rows.set(name.toLowerCase(), { name, samples: n, link: null });
  for (const [name, row] of Object.entries(links || {})) {
    const key = name.toLowerCase();
    const have = rows.get(key) || { name, samples: 0, link: null };
    have.link = row?.linked
      ? { linked: true, via: row.via === "signin" ? "signin" : "key", hint: row.client_id_hint || "", identity: row.identity || null, needsReauth: Boolean(row.needs_reauth) }
      : { linked: false };
    rows.set(key, have);
  }
  return [...rows.values()].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

/* What a row says about Hubbubb. A linked person reads as who Hubbubb says
   the credential is - a tick proves the pair works, the name proves it is
   theirs - and only falls back to the client-id hint when Hubbubb could not
   say. The identity is stored as "Name, email"; shown as "Name (email)". */
export function linkText(link) {
  if (!link) return "";
  if (!link.linked) return "Hubbubb: not linked";
  if (link.needsReauth) return "Hubbubb: sign-in lapsed, sign in again";
  const how = link.via === "signin" ? " · signed in" : link.via === "key" ? " · pasted key" : "";
  if (!link.identity) return link.via === "signin" ? `Hubbubb: linked${how}` : `Hubbubb: linked · ${link.hint}`;
  const at = link.identity.lastIndexOf(",");
  if (at < 0) return `Hubbubb: ${link.identity}${how}`;
  return `Hubbubb: ${link.identity.slice(0, at).trim()} (${link.identity.slice(at + 1).trim()})${how}`;
}

/* Has this person's sign-in landed? What the poll after "Sign in with
   Hubbubb" waits for: a row that says signed in and is not lapsed - a pasted
   key already there does not count, nor does the old, expired sign-in. */
export const signedIn = (row) => Boolean(row?.linked && row.via === "signin" && !row.needs_reauth);

export function labelsOf(clips, kind) {
  const n = new Map();
  for (const c of clips || []) {
    if (kind && c.kind !== kind) continue;
    if (c.label) n.set(c.label, (n.get(c.label) || 0) + 1);
  }
  return [...n.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([l]) => l);
}

/* Level (linear 0..1 RMS) to a bar width. Square root so that ordinary
   room speech, which sits around 0.05, shows as a quarter of the bar and
   not a sliver you cannot tell from silence. */
export const meterPct = (level) => {
  const v = Number(level);
  if (!Number.isFinite(v) || v <= 0) return 0;
  return Math.round(Math.min(1, Math.sqrt(v)) * 100);
};

/* A dead microphone reports a level too - a very small one, forever. Six
   polls at two a second is three seconds of nothing, which is longer than
   any pause between takes and shorter than a wasted session. */
export const DEAD_FLOOR = 0.002;
export function deadMic(levels, floor = DEAD_FLOOR, n = 6) {
  if (!levels || levels.length < n) return false;
  return levels.slice(-n).every((l) => !(Number(l) > floor));
}

export function fmtElapsed(s) {
  s = Math.max(0, Math.floor(Number(s) || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h ? String(m).padStart(2, "0") : String(m);
  return (h ? `${h}:${mm}:` : `${m}:`) + String(sec).padStart(2, "0");
}

/* The trainer's own rule, mirrored so the button can stay disabled rather
   than bounce a 400 after the fact. */
export const validPhrase = (phrase) => {
  const words = String(phrase || "").trim().split(/\s+/).filter(Boolean);
  return words.length >= 1 && words.length <= 4 && words.every((w) => /^[a-z]+$/i.test(w));
};

/* ---- recording on this device, for voice enrolment only ----
   The Mac's microphone sits beside the puck, which is right for wake-word
   takes: they need the room and the distance in them. A voice sample is
   about the person, who may be anywhere - so it can come from the device in
   hand instead. */

export const WAV_RATE = 16000;
export const MAX_TAKE_SECONDS = 60;

/* getUserMedia exists only in a secure context - the https Nabu Casa address,
   not the plain-http LAN one - and a browser that hides it is not one to ask. */
export const canRecordHere = (win) =>
  Boolean(win?.isSecureContext && typeof win.navigator?.mediaDevices?.getUserMedia === "function");

/* Which microphone a Voice take will use, and the sentence that says so
   before anything is pressed: a person who thought the puck was listening
   and finds the laptop was has wasted their enrolment. `choice` is whether
   there is anything to pick. */
export function micPlan(pref, can, denied) {
  if (!can) {
    return { source: "mac", choice: false, text: "This device cannot record over a plain http:// address, so the Mac's microphone beside the puck will be used." };
  }
  if (denied) {
    return { source: "mac", choice: false, text: "This device refused microphone permission, so the Mac's microphone beside the puck will be used." };
  }
  return pref === "mac"
    ? { source: "mac", choice: true, text: "The Mac's microphone beside the puck will record. You need to be in that room." }
    : { source: "device", choice: true, text: "This device's microphone will record. Speak from wherever you are." };
}

/* Linear interpolation, the same cheap resample the service does for a puck
   streaming at the wrong rate. The context is asked for 16 kHz first, so this
   is usually the identity; it is for the browsers that ignore the ask.
   ponytail: no low-pass before decimating; add one if enrolment quality
   from a 48 kHz browser ever measures worse than from the Mac. */
export function downsample(samples, from, to = WAV_RATE) {
  if (from === to) return samples;
  const n = Math.floor((samples.length * to) / from);
  const out = new Float32Array(n);
  const step = from / to;
  for (let i = 0; i < n; i++) {
    const pos = i * step;
    const lo = Math.floor(pos);
    const hi = Math.min(lo + 1, samples.length - 1);
    out[i] = samples[lo] + (samples[hi] - samples[lo]) * (pos - lo);
  }
  return out;
}

/* Float samples to a 16-bit mono wav: the 44-byte canonical header and
   nothing else. By hand because it is twenty lines, and the service refuses
   anything fancier anyway. */
export function encodeWav(samples, rate = WAV_RATE) {
  const n = samples.length;
  const buf = new ArrayBuffer(44 + n * 2);
  const v = new DataView(buf);
  const tag = (at, s) => {
    for (let i = 0; i < s.length; i++) v.setUint8(at + i, s.charCodeAt(i));
  };
  tag(0, "RIFF");
  v.setUint32(4, 36 + n * 2, true);
  tag(8, "WAVE");
  tag(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); // PCM
  v.setUint16(22, 1, true); // mono
  v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true); // bytes per second
  v.setUint16(32, 2, true); // bytes per frame
  v.setUint16(34, 16, true);
  tag(36, "data");
  v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    v.setInt16(44 + i * 2, s < 0 ? s * 32768 : s * 32767, true);
  }
  return buf;
}

/* One blob at a time, revoked when the next starts, when playback ends, and
   on dispose. `urls` and `audio` are injectable so the balance can be
   asserted in node. */
export function makePlayer({ fetchBytes, audio, urls = URL, onstate = () => {} }) {
  let cur = null;
  let id = null;
  const drop = () => {
    if (cur) urls.revokeObjectURL(cur);
    cur = null;
    id = null;
  };
  audio.onended = () => {
    drop();
    onstate(null);
  };
  return {
    async play(clipId) {
      audio.pause();
      drop();
      const blob = await fetchBytes(clipId);
      drop(); // a second tap landed while this one was loading
      cur = urls.createObjectURL(blob);
      id = clipId;
      audio.src = cur;
      onstate(clipId);
      try {
        await audio.play();
      } catch (e) {
        drop();
        onstate(null);
        throw e;
      }
    },
    stop() {
      audio.pause();
      drop();
      onstate(null);
    },
    dispose() {
      audio.pause();
      audio.onended = null;
      drop();
    },
    get playing() {
      return id;
    },
  };
}

const POLL_MS = 500;
const TRAIN_POLL_MS = 60000;
/* The sign-in poll: a Hubbubb code lives ten minutes, so past that the other
   window cannot finish and the wait is called off rather than spun forever. */
const SIGNIN_POLL_MS = 2000;
export const SIGNIN_SECONDS = 600;

class HubbubbVoiceStudio extends LitElement {
  static build = BUILD;

  static properties = {
    /* hass arrives on every state change in the house; nothing here reads
       it except the transport, so it must not redraw a long list each time. */
    hass: { attribute: false, hasChanged: () => false },
    narrow: { type: Boolean },
    panel: {},
    route: {},
    _status: { state: true },
    _levels: { state: true },
    _elapsed: { state: true },
    _clips: { state: true },
    _people: { state: true },
    _links: { state: true },
    _linking: { state: true },
    _linkId: { state: true },
    _linkSecret: { state: true },
    _linkErr: { state: true },
    _linkNote: { state: true },
    _signin: { state: true },
    _signing: { state: true },
    _signUrl: { state: true },
    _signRedirect: { state: true },
    _signErr: { state: true },
    _train: { state: true },
    _kind: { state: true },
    _label: { state: true },
    _fKind: { state: true },
    _fLabel: { state: true },
    _sel: { state: true },
    _err: { state: true },
    _busy: { state: true },
    _playing: { state: true },
    _since: { state: true },
    _refileKind: { state: true },
    _refileLabel: { state: true },
    _enrolTo: { state: true },
    _phrase: { state: true },
    _armed: { state: true },
    _loaded: { state: true },
    _source: { state: true },
    _micDenied: { state: true },
  };

  constructor() {
    super();
    this._status = null;
    this._levels = [];
    this._elapsed = 0;
    this._clips = [];
    this._people = {};
    this._links = null;
    this._linking = "";
    this._linkId = "";
    this._linkSecret = "";
    this._linkErr = "";
    this._linkNote = null;
    this._signin = false;
    this._signing = "";
    this._signUrl = "";
    this._signRedirect = "";
    this._signErr = "";
    this._train = null;
    this._kind = "wake";
    this._label = "";
    this._fKind = "";
    this._fLabel = "";
    this._sel = new Set();
    this._err = "";
    this._busy = false;
    this._playing = null;
    this._since = 0;
    this._refileKind = "";
    this._refileLabel = "";
    this._enrolTo = "";
    this._phrase = "";
    this._armed = false;
    this._loaded = false;
    this._source = "device";
    this._micDenied = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._player = makePlayer({
      audio: new Audio(),
      fetchBytes: (id) => this._fetchAudio(id),
      onstate: (id) => (this._playing = id),
    });
    this._load();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._releaseMic(); // the take goes with the page; a stream left open lights the tab forever
    this._stopPolling();
    clearInterval(this._trainTimer);
    this._cancelSignIn();
    this._trainTimer = null;
    this._player?.dispose();
    this._player = null;
  }

  /* ---------------- transport ---------------- */

  async _api([method, path, body, type]) {
    const init = {
      method,
      headers: body ? { "Content-Type": type || "application/json" } : {},
      // A typed body (a wav) goes as it is; everything else is JSON.
      body: !body ? undefined : type ? body : JSON.stringify(body),
    };
    const url = path.startsWith("/") ? path : API_BASE + path;
    // fetchWithAuth refreshes an expired token; the bearer fallback is for a
    // hass object that predates it.
    const res = this.hass?.fetchWithAuth
      ? await this.hass.fetchWithAuth(url, init)
      : await fetch(url, {
          ...init,
          headers: { ...init.headers, Authorization: `Bearer ${this.hass?.auth?.data?.access_token}` },
        });
    const text = await res.text();
    if (!res.ok) throw new Error(errMessage(res.status, text));
    try {
      return text ? JSON.parse(text) : null;
    } catch (e) {
      return null;
    }
  }

  async _fetchAudio(id) {
    const url = audioPath(id);
    const res = this.hass?.fetchWithAuth
      ? await this.hass.fetchWithAuth(url)
      : await fetch(url, { headers: { Authorization: `Bearer ${this.hass?.auth?.data?.access_token}` } });
    if (!res.ok) throw new Error(errMessage(res.status, await res.text()));
    const buf = await res.arrayBuffer();
    return new Blob([buf], { type: res.headers.get("content-type") || "audio/wav" });
  }

  /* Run a call, park the failure in the banner, never leave _busy stuck. */
  async _try(fn) {
    this._busy = true;
    this._err = "";
    try {
      return await fn();
    } catch (e) {
      this._err = e?.message || String(e);
      return undefined;
    } finally {
      this._busy = false;
    }
  }

  /* ---------------- loading and polling ---------------- */

  async _load() {
    // A recording may already be running - a phone that fell asleep on the
    // start button, a second screen. Believe the service, not the page.
    await this._try(async () => {
      const st = await this._api(api.status());
      this._applyStatus(st);
      if (st?.recording) {
        this._kind = st.kind || this._kind;
        this._label = st.label || this._label;
        this._since = this._since || Date.now();
        this._startPolling();
      }
    });
    this._loaded = true;
    await Promise.all([this._loadClips(), this._loadPeople(), this._loadLinks(), this._loadTrain()]);
  }

  async _loadClips() {
    const clips = await this._try(() => this._api(api.clips(this._fKind ? { kind: this._fKind } : {})));
    if (Array.isArray(clips)) this._clips = clips;
    else if (clips && Array.isArray(clips.clips)) this._clips = clips.clips;
  }

  async _loadPeople() {
    const p = await this._try(() => this._api(api.people()));
    if (p && typeof p === "object") this._people = p;
  }

  async _loadLinks() {
    // 503 means no Hubbubb: not an error, just nothing to show. Not _try -
    // the banner is for things that went wrong.
    try {
      const r = await this._api(api.links());
      this._links = r?.people || {};
      this._signin = Boolean(r?.signin);
    } catch (e) {
      this._links = null;
      this._signin = false;
    }
  }

  async _loadTrain() {
    const t = await this._try(() => this._api(api.trainStatus()));
    if (t) this._train = t;
    const running = Boolean(t?.running);
    if (running && !this._trainTimer) {
      this._trainTimer = setInterval(() => this._loadTrain(), TRAIN_POLL_MS);
    } else if (!running && this._trainTimer) {
      clearInterval(this._trainTimer);
      this._trainTimer = null;
    }
  }

  _applyStatus(st) {
    this._status = st || { recording: false };
    if (st?.recording) {
      this._levels = [...this._levels.slice(-11), Number(st.level) || 0];
      this._elapsed =
        st.seconds != null ? Number(st.seconds) : st.started ? Date.now() / 1000 - Number(st.started) : this._elapsed + POLL_MS / 1000;
    } else {
      this._levels = [];
      this._elapsed = 0;
    }
  }

  _startPolling() {
    if (this._poll) return;
    this._poll = setInterval(async () => {
      try {
        const st = await this._api(api.status());
        this._applyStatus(st);
        if (!st?.recording) this._recordingEnded();
      } catch (e) {
        // One missed poll is nothing; a service that has gone away is not.
        this._err = e?.message || String(e);
        this._stopPolling();
        this._status = { recording: false };
      }
    }, POLL_MS);
  }

  _stopPolling() {
    clearInterval(this._poll);
    this._poll = null;
  }

  _recordingEnded() {
    this._stopPolling();
    this._levels = [];
    // The library is fetched per kind, and "just recorded" is drawn from the
    // same list - so show the kind that was just recorded.
    this._fKind = this._kind;
    this._fLabel = "";
    this._loadClips();
  }

  /* ---------------- actions ---------------- */

  async _toggleRecord() {
    if (this._status?.recording) {
      if (this._take) return this._stopLocal();
      await this._try(() => this._api(api.stop()));
      this._status = { recording: false };
      this._recordingEnded();
      return;
    }
    const label = this._label.trim();
    if (!label) {
      this._err = this._kind === "voice" ? "whose voice is this?" : "give the recording a label first";
      return;
    }
    if (this._kind === "voice" && this._mic().source === "device") return this._startLocal(label);
    const st = await this._try(() => this._api(api.start(this._kind, label)));
    if (st === undefined) return;
    this._since = Date.now();
    this._levels = [];
    this._elapsed = 0;
    this._status = { recording: true, kind: this._kind, label, ...(st || {}) };
    this._startPolling();
  }

  /* ---------------- this device's microphone ---------------- */

  _mic() {
    return micPlan(this._source, canRecordHere(window), this._micDenied);
  }

  async _startLocal(label) {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1 } });
    } catch (e) {
      // Refused, or no microphone. The browser remembers a refusal, so
      // asking again would only fail again: say so and hand over to the Mac.
      this._micDenied = true;
      this._err = `This device's microphone is not available (${e?.name || e}), so the Mac's will be used instead.`;
      return;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    let ctx;
    try {
      ctx = new Ctx({ sampleRate: WAV_RATE }); // resampled by the browser, where the ask is honoured
    } catch (e) {
      ctx = new Ctx();
    }
    // ponytail: ScriptProcessorNode is deprecated but needs no worklet file
    // to serve; move to AudioWorklet when a browser drops it.
    const proc = ctx.createScriptProcessor(4096, 1, 1);
    const take = { ctx, stream, proc, chunks: [], samples: 0, peak: 0 };
    proc.onaudioprocess = (e) => {
      const block = new Float32Array(e.inputBuffer.getChannelData(0));
      take.chunks.push(block);
      take.samples += block.length;
      let sq = 0;
      for (let i = 0; i < block.length; i++) sq += block[i] * block[i];
      take.peak = Math.max(take.peak, Math.sqrt(sq / block.length));
      // The service refuses anything longer; stop rather than lose the take.
      if (this._take === take && take.samples >= MAX_TAKE_SECONDS * ctx.sampleRate) this._stopLocal();
    };
    ctx.createMediaStreamSource(stream).connect(proc);
    // The output buffer is never written, so this plays silence; Safari
    // does not run a processor that is connected to nothing.
    proc.connect(ctx.destination);
    this._take = take;
    this._since = Date.now();
    this._levels = [];
    this._elapsed = 0;
    this._status = { recording: true, kind: "voice", label, local: true };
    // The Mac path is polled twice a second and the meter and dead-mic rule
    // are tuned to that pace, so this device reports at the same one.
    this._poll = setInterval(() => {
      this._levels = [...this._levels.slice(-11), take.peak];
      take.peak = 0;
      this._elapsed = take.samples / ctx.sampleRate;
    }, POLL_MS);
  }

  async _stopLocal() {
    const take = this._take;
    const label = this._status?.label;
    this._stopPolling();
    this._releaseMic();
    this._status = { recording: false };
    if (!take) return;
    const all = new Float32Array(take.samples);
    let at = 0;
    for (const c of take.chunks) {
      all.set(c, at);
      at += c.length;
    }
    const wav = encodeWav(downsample(all, take.ctx.sampleRate));
    await this._try(() => this._api(api.upload(label, wav)));
    this._recordingEnded();
  }

  /* The tracks must be stopped, not just dropped: one left running keeps
     the browser's recording light on until the tab dies. */
  _releaseMic() {
    const take = this._take;
    this._take = null;
    if (!take) return;
    take.proc.onaudioprocess = null;
    take.proc.disconnect();
    take.stream.getTracks().forEach((t) => t.stop());
    Promise.resolve(take.ctx.close()).catch(() => {});
  }

  async _delete(ids) {
    if (!ids.length) return;
    this._player?.stop();
    // Sequential, on purpose: one failure stops the run with the survivors
    // still listed, instead of a fan-out that half-succeeds in silence.
    await this._try(async () => {
      for (const id of ids) {
        await this._api(api.deleteClip(id));
        this._clips = this._clips.filter((c) => c.id !== id);
        this._sel.delete(id);
      }
    });
    this._sel = new Set(this._sel);
  }

  async _refile() {
    const ids = [...this._sel];
    const patch = {};
    if (this._refileKind) patch.kind = this._refileKind;
    if (this._refileLabel.trim()) patch.label = this._refileLabel.trim();
    if (!ids.length || !Object.keys(patch).length) return;
    await this._try(async () => {
      for (const id of ids) {
        await this._api(api.refile(id, patch));
        this._clips = this._clips.map((c) => (c.id === id ? { ...c, ...patch } : c));
      }
    });
    this._sel = new Set();
    this._refileLabel = "";
    if (this._fKind && patch.kind && patch.kind !== this._fKind) this._loadClips();
  }

  async _enrol() {
    const person = this._enrolTo.trim();
    const clips = [...this._sel].filter((id) => this._clips.find((c) => c.id === id)?.kind === "voice");
    if (!person || !clips.length) return;
    const ok = await this._try(() => this._api(api.enroll(person, clips)));
    if (ok === undefined) return;
    this._sel = new Set();
    this._loadPeople();
  }

  async _deletePerson(person) {
    // The one destructive thing here that is not one listed clip: a person
    // is every sample ever enrolled, and voice matching stops for them.
    if (!confirm(`Forget ${person}'s voice? Their enrolled samples go too.`)) return;
    const p = await this._try(() => this._api(api.deletePerson(person)));
    if (p && typeof p === "object") this._people = p;
    else this._loadPeople();
  }

  _openLink(name) {
    this._linking = name;
    this._linkId = "";
    this._linkSecret = "";
    this._linkErr = "";
    this._linkNote = null;
  }

  async _link() {
    const person = this._linking;
    const id = this._linkId.trim();
    if (!person || !id || !this._linkSecret) return;
    this._busy = true;
    this._linkErr = "";
    try {
      // The endpoint asks Hubbubb for a token before it keeps anything, so
      // a refusal here means the pair is wrong, not that it was saved badly.
      const row = await this._api(api.link(person, id, this._linkSecret));
      this._links = { ...(this._links || {}), [row.person]: { linked: true, client_id_hint: row.client_id_hint, identity: row.identity || null } };
      this._linking = "";
      // The confirmation is about who, not whether: the pair worked, now
      // the administrator checks the name Hubbubb gave is the right person.
      this._linkNote = {
        person: row.person,
        text: row.identity
          ? `Hubbubb says this credential belongs to ${linkText({ linked: true, identity: row.identity }).slice("Hubbubb: ".length)}. If that is not ${row.person}, unlink it.`
          : `Linked, but Hubbubb did not say whose credential this is. Ask it later, or unlink if unsure.`,
      };
    } catch (e) {
      this._linkErr = e?.message || String(e);
    } finally {
      // Whatever happened, the secret does not stay in memory.
      this._linkSecret = "";
      this._busy = false;
    }
  }

  /* Sign in with Hubbubb. The window is opened before the first await: a
     browser only lets a click open one, and the click is over by the time
     the URL arrives. Then poll the links until the row says signed in. */
  async _signIn(name) {
    this._cancelSignIn();
    const win = window.open("about:blank", "_blank");
    this._signing = name;
    this._signErr = "";
    this._signUrl = "";
    this._linkNote = null;
    let r;
    try {
      r = await this._api(api.signIn(name));
    } catch (e) {
      win?.close();
      this._signing = "";
      this._signErr = e?.message || String(e);
      return;
    }
    this._signUrl = r?.url || "";
    this._signRedirect = r?.redirect_uri || "";
    if (win) win.location = this._signUrl;
    this._signStarted = Date.now();
    this._signTimer = setInterval(() => this._checkSignIn(), SIGNIN_POLL_MS);
  }

  async _checkSignIn() {
    const name = this._signing;
    if (!name) return;
    await this._loadLinks();
    const row = Object.entries(this._links || {}).find(([k]) => k.toLowerCase() === name.toLowerCase())?.[1];
    if (signedIn(row)) {
      this._cancelSignIn();
      this._linkNote = {
        person: name,
        text: row.identity
          ? `${name} signed in to Hubbubb as ${linkText({ linked: true, identity: row.identity }).slice("Hubbubb: ".length)}.`
          : `${name} signed in to Hubbubb, but it did not say as whom.`,
      };
    } else if (Date.now() - this._signStarted > SIGNIN_SECONDS * 1000) {
      this._cancelSignIn();
      this._signErr = `Hubbubb did not come back within ten minutes for ${name}. Press Sign in with Hubbubb to try again.`;
    }
  }

  _cancelSignIn() {
    clearInterval(this._signTimer);
    this._signTimer = null;
    this._signing = "";
    this._signUrl = "";
  }

  async _unlink(name) {
    if (!confirm(`Unlink ${name} from Hubbubb? The house stops acting as them there.`)) return;
    const row = await this._try(() => this._api(api.unlink(name)));
    if (!row) return;
    this._linkNote = null;
    const links = { ...(this._links || {}) };
    for (const key of Object.keys(links)) if (key.toLowerCase() === name.toLowerCase()) links[key] = { linked: false };
    this._links = links;
  }

  async _train() {
    const phrase = this._phrase.trim();
    if (!this._armed || !validPhrase(phrase) || this._train?.running) return;
    const st = await this._try(() => this._api(api.train(phrase)));
    this._armed = false;
    if (st) this._train = st;
    this._loadTrain();
  }

  _play(id) {
    if (this._playing === id) return this._player.stop();
    this._player.play(id).catch((e) => (this._err = e?.message || String(e)));
  }

  _toggleSel(id, on) {
    const s = new Set(this._sel);
    on ? s.add(id) : s.delete(id);
    this._sel = s;
  }

  _setFilterKind(kind) {
    this._fKind = kind;
    this._fLabel = "";
    this._sel = new Set();
    this._loadClips();
  }

  /* ---------------- render ---------------- */

  render() {
    const rec = Boolean(this._status?.recording);
    return html`
      <div class="bar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Voice studio</div>
      </div>
      ${this._err
        ? html`<div class="err" @click=${() => (this._err = "")}>${this._err}<span class="x">dismiss</span></div>`
        : nothing}
      <div class="cols">
        <div class="col side">
          ${this._renderRecord(rec)}
          ${this._renderPeople()}
          ${this._renderTrain()}
        </div>
        <div class="col main">
          ${this._since ? this._renderList("Just recorded", filterClips(this._clips, { since: this._since }), true) : nothing}
          ${this._renderLibrary()}
        </div>
      </div>
    `;
  }

  _renderRecord(rec) {
    const people = Object.keys(this._people);
    const suggestions = this._kind === "voice" ? people : labelsOf(this._clips, this._kind);
    const dead = rec && deadMic(this._levels);
    const level = this._levels[this._levels.length - 1] || 0;
    return html`
      <ha-card class="card">
        <div class="h">Record</div>
        <div class="seg">
          ${KINDS.map(
            (k) => html`<button
              class="segb ${this._kind === k.id ? "on" : ""}"
              ?disabled=${rec}
              @click=${() => {
                this._kind = k.id;
                this._label = "";
              }}
            >${k.name}</button>`
          )}
        </div>
        <div class="hint">${KINDS.find((k) => k.id === this._kind)?.hint}</div>
        ${this._kind === "voice" ? this._renderMic(rec) : nothing}
        <input
          class="input"
          list="vs-labels"
          .value=${this._label}
          ?disabled=${rec}
          placeholder=${this._kind === "wake" ? "wake phrase, e.g. hey jarvis" : this._kind === "voice" ? "who is speaking" : "what it is, e.g. dishwasher"}
          @input=${(e) => (this._label = e.target.value)}
        />
        <datalist id="vs-labels">${suggestions.map((s) => html`<option value=${s}></option>`)}</datalist>
        <button class="big ${rec ? "stop" : "start"}" ?disabled=${this._busy || !this._loaded} @click=${this._toggleRecord}>
          ${rec ? "Stop" : "Start recording"}
        </button>
        ${rec
          ? html`
              <div class="live">
                <span class="elapsed">${fmtElapsed(this._elapsed)}</span>
                <span class="what">${this._status.kind} · ${this._status.label}${this._status.local ? " · this device" : ""}</span>
              </div>
              <div class="meter ${dead ? "dead" : ""}"><div class="fill" style="width:${meterPct(level)}%"></div></div>
              ${dead
                ? html`<div class="warn">Nothing is coming from the microphone. Check it before you carry on.</div>`
                : html`<div class="hint">Level ${meterPct(level)}%</div>`}
            `
          : nothing}
      </ha-card>
    `;
  }

  /* Which microphone a Voice take uses - picked, and said, before the button. */
  _renderMic(rec) {
    const mic = this._mic();
    return html`
      ${mic.choice
        ? html`<div class="seg">
            ${[["device", "This device"], ["mac", "The Mac by the puck"]].map(
              ([id, name]) => html`<button class="segb ${mic.source === id ? "on" : ""}" ?disabled=${rec} @click=${() => (this._source = id)}>${name}</button>`
            )}
          </div>`
        : nothing}
      <div class="hint">${mic.text}</div>
    `;
  }

  _renderLibrary() {
    const labels = labelsOf(this._clips, this._fKind);
    const list = filterClips(this._clips, { kind: this._fKind, label: this._fLabel });
    return html`
      <ha-card class="card">
        <div class="h">Library <span class="count">${list.length}</span></div>
        <div class="chips">
          <button class="chip ${!this._fKind ? "on" : ""}" @click=${() => this._setFilterKind("")}>All</button>
          ${KINDS.map(
            (k) => html`<button class="chip ${this._fKind === k.id ? "on" : ""}" @click=${() => this._setFilterKind(k.id)}>${k.name}</button>`
          )}
        </div>
        ${labels.length
          ? html`<div class="chips">
              ${labels.map(
                (l) => html`<button
                  class="chip ${this._fLabel === l ? "on" : ""}"
                  @click=${() => (this._fLabel = this._fLabel === l ? "" : l)}
                >${l}</button>`
              )}
            </div>`
          : nothing}
        ${this._renderSelBar(list)}
        ${list.length
          ? list.map((c) => this._renderRow(c))
          : html`<div class="empty">${this._loaded ? "Nothing here yet. Record something." : "Loading…"}</div>`}
      </ha-card>
    `;
  }

  _renderList(title, list, hideEmpty) {
    if (hideEmpty && !list.length) return nothing;
    return html`
      <ha-card class="card">
        <div class="h">${title} <span class="count">${list.length}</span></div>
        ${list.map((c) => this._renderRow(c))}
      </ha-card>
    `;
  }

  _renderSelBar(list) {
    const n = this._sel.size;
    const all = list.length && list.every((c) => this._sel.has(c.id));
    const voice = n && [...this._sel].every((id) => this._clips.find((c) => c.id === id)?.kind === "voice");
    const people = Object.keys(this._people);
    return html`
      <div class="selbar">
        <label class="sel-all">
          <input type="checkbox" .checked=${Boolean(all)} ?disabled=${!list.length}
            @change=${(e) => (this._sel = e.target.checked ? new Set([...this._sel, ...list.map((c) => c.id)]) : new Set())} />
          ${n ? `${n} selected` : "Select all"}
        </label>
        ${n
          ? html`
              <button class="btn danger" ?disabled=${this._busy} @click=${() => this._delete([...this._sel])}>Delete ${n}</button>
              <span class="grp">
                <select class="input sm" .value=${this._refileKind} @change=${(e) => (this._refileKind = e.target.value)}>
                  <option value="">keep kind</option>
                  ${KINDS.map((k) => html`<option value=${k.id}>${k.name}</option>`)}
                </select>
                <input class="input sm" placeholder="new label" .value=${this._refileLabel} @input=${(e) => (this._refileLabel = e.target.value)} />
                <button class="btn" ?disabled=${this._busy || (!this._refileKind && !this._refileLabel.trim())} @click=${this._refile}>Re-file</button>
              </span>
              ${voice
                ? html`<span class="grp">
                    <input class="input sm" list="vs-people" placeholder="enrol into…" .value=${this._enrolTo} @input=${(e) => (this._enrolTo = e.target.value)} />
                    <datalist id="vs-people">${people.map((p) => html`<option value=${p}></option>`)}</datalist>
                    <button class="btn" ?disabled=${this._busy || !this._enrolTo.trim()} @click=${this._enrol}>Enrol</button>
                  </span>`
                : nothing}
            `
          : nothing}
      </div>
    `;
  }

  _renderRow(c) {
    const on = this._sel.has(c.id);
    const playing = this._playing === c.id;
    const when = clipTime(c.created);
    return html`
      <div class="row ${on ? "on" : ""}">
        <input type="checkbox" .checked=${on} @change=${(e) => this._toggleSel(c.id, e.target.checked)} />
        <div class="body" @click=${() => this._toggleSel(c.id, !on)}>
          <div class="text ${c.transcript ? "" : "none"}">${c.transcript || "no transcript"}</div>
          <div class="meta">
            ${c.kind} · ${c.label} · ${Number(c.seconds || 0).toFixed(1)}s
            ${when ? html` · ${new Date(when).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}` : nothing}
          </div>
        </div>
        <button class="btn icon" title=${playing ? "Stop" : "Play"} @click=${() => this._play(c.id)}>${playing ? "■" : "▶"}</button>
        <button class="btn icon danger" title="Delete" ?disabled=${this._busy} @click=${() => this._delete([c.id])}>✕</button>
      </div>
    `;
  }

  _renderPeople() {
    const rows = peopleRows(this._people, this._links);
    const admin = Boolean(this.hass?.user?.is_admin);
    return html`
      <ha-card class="card">
        <div class="h">People</div>
        ${rows.length
          ? rows.map((r) => this._renderPerson(r, admin))
          : html`<div class="empty">Nobody enrolled. Record "Voice" clips, select them, and enrol.</div>`}
      </ha-card>
    `;
  }

  /* One person: their samples, and - when Hubbubb is set up - whether they
     are linked to their own Hubbubb user. The link controls are for
     administrators; everyone else sees the state and nothing to press. */
  _renderPerson({ name, samples, link }, admin) {
    const open = admin && this._linking === name;
    const waiting = admin && this._signing === name;
    const state = linkText(link);
    const note = this._linkNote?.person === name ? this._linkNote.text : "";
    const signErr = this._signErr && !this._signing && this._signErr.includes(name) ? this._signErr : "";
    // The button, when the house has an OAuth client: for anyone not signed
    // in, and again for a sign-in that lapsed. A pasted key can be upgraded.
    const offerSignIn = admin && link && this._signin && !(link.linked && link.via === "signin" && !link.needsReauth);
    return html`<div class="row">
        <div class="body">
          <div class="text">${name}</div>
          <div class="meta">${samples ? `${samples} sample${samples === 1 ? "" : "s"}` : "no voice samples"}${link ? html` · ${state}` : nothing}</div>
        </div>
        ${admin && link && !open && !waiting
          ? html`${offerSignIn
                ? html`<button class="btn" ?disabled=${this._busy} @click=${() => this._signIn(name)}>${link.needsReauth ? "Sign in again" : "Sign in with Hubbubb"}</button>`
                : nothing}
              ${link.linked
                ? html`<button class="btn" ?disabled=${this._busy} @click=${() => this._unlink(name)}>Unlink</button>`
                : html`<button class="btn ${this._signin ? "quiet" : ""}" ?disabled=${this._busy} @click=${() => this._openLink(name)}>${this._signin ? "Paste a key instead" : "Link"}</button>`}`
          : nothing}
        ${samples
          ? html`<button class="btn icon danger" title="Forget" ?disabled=${this._busy} @click=${() => this._deletePerson(name)}>✕</button>`
          : nothing}
      </div>
      ${note ? html`<div class="linkform"><div class="hint">${note}</div></div>` : nothing}
      ${signErr ? html`<div class="linkform"><div class="warn">${signErr}</div></div>` : nothing}
      ${waiting
        ? html`<div class="linkform">
            <div class="hint">Waiting for ${name} to sign in to Hubbubb in the other window…</div>
            ${this._signUrl ? html`<div class="hint">If no window opened, <a href=${this._signUrl} target="_blank" rel="noopener">open the Hubbubb sign-in</a>.</div>` : nothing}
            ${this._signRedirect ? html`<div class="hint">If Hubbubb rejects the redirect address, register <code>${this._signRedirect}</code> on the house's OAuth client.</div>` : nothing}
            <div class="chips">
              <button class="btn" @click=${() => this._checkSignIn()}>Check now</button>
              <button class="btn" @click=${() => this._cancelSignIn()}>Cancel</button>
            </div>
          </div>`
        : nothing}
      ${open
        ? html`<div class="linkform">
            <div class="hint">${name}'s own Hubbubb API client${this._signin ? " - the older way; signing in needs no key" : ""}. The pair is checked against Hubbubb before it is kept; the secret is never shown again.</div>
            <input class="input" placeholder="client id" autocomplete="off" .value=${this._linkId} @input=${(e) => (this._linkId = e.target.value)} />
            <input class="input" type="password" placeholder="client secret" autocomplete="new-password" .value=${this._linkSecret} @input=${(e) => (this._linkSecret = e.target.value)} />
            ${this._linkErr ? html`<div class="warn">${this._linkErr}</div>` : nothing}
            <div class="chips">
              <button class="btn" ?disabled=${this._busy || !this._linkId.trim() || !this._linkSecret} @click=${() => this._link()}>${this._busy ? "Checking…" : "Verify and link"}</button>
              <button class="btn" ?disabled=${this._busy} @click=${() => this._openLink("")}>Cancel</button>
            </div>
          </div>`
        : nothing}`;
  }

  _renderTrain() {
    const t = this._train || {};
    const running = Boolean(t.running);
    const phrase = this._phrase || (this._kind === "wake" ? this._label : "");
    const state = running
      ? `Training "${t.phrase}" since ${t.started ? new Date(Number(t.started) * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "earlier"}. The house will say when it is done.`
      : t.phrase
        ? `Last run: "${t.phrase}" ${t.ok ? "finished and is ready to load onto a puck" : `failed (see ${t.out || "the log"})`}.`
        : "No training run yet.";
    return html`
      <ha-card class="card">
        <div class="h">Train wake word</div>
        <div class="hint">${state}</div>
        <input class="input" placeholder="phrase, one to four words" .value=${phrase} ?disabled=${running}
          @input=${(e) => (this._phrase = e.target.value)} />
        <label class="arm">
          <input type="checkbox" .checked=${this._armed} ?disabled=${running} @change=${(e) => (this._armed = e.target.checked)} />
          <span>This takes hours and ties up the Mac. Start it now.</span>
        </label>
        <button class="btn wide" ?disabled=${running || !this._armed || !validPhrase(phrase) || this._busy}
          @click=${() => {
            this._phrase = phrase;
            this._train();
          }}>
          ${running ? "Training…" : "Train"}
        </button>
      </ha-card>
    `;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      color: var(--primary-text-color);
      background: var(--primary-background-color);
      font-size: 14px;
    }
    .bar {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 56px;
      padding: 0 12px;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, var(--text-primary-color, #fff));
      position: sticky;
      top: 0;
      z-index: 2;
    }
    .title {
      font-size: 20px;
      font-weight: 400;
    }
    .err {
      margin: 12px 16px 0;
      padding: 10px 14px;
      border-radius: 8px;
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.14);
      color: var(--error-color, #db4437);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    .err .x {
      opacity: 0.7;
      font-size: 12px;
      white-space: nowrap;
    }
    .cols {
      display: grid;
      grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
      gap: 16px;
      padding: 16px;
      max-width: 1280px;
      margin: 0 auto;
      box-sizing: border-box;
    }
    @media (max-width: 760px) {
      .cols {
        grid-template-columns: minmax(0, 1fr);
        padding: 12px;
      }
    }
    .col {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 0;
    }
    .card {
      padding: 14px 16px;
    }
    .h {
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .count {
      font-weight: 400;
      color: var(--secondary-text-color);
      font-size: 13px;
    }
    .hint,
    .empty {
      color: var(--secondary-text-color);
      font-size: 13px;
      line-height: 1.4;
      margin: 6px 0;
    }
    .empty {
      padding: 12px 0 4px;
    }
    .seg {
      display: flex;
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      overflow: hidden;
    }
    .segb {
      flex: 1;
      min-height: 44px;
      border: none;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      cursor: pointer;
    }
    .segb + .segb {
      border-left: 1px solid var(--divider-color);
    }
    .segb.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .input {
      width: 100%;
      box-sizing: border-box;
      min-height: 44px;
      margin: 8px 0;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 6px 10px;
      font: inherit;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }
    .input.sm {
      width: auto;
      min-height: 36px;
      margin: 0;
      flex: 1 1 110px;
      min-width: 0;
    }
    .big {
      width: 100%;
      min-height: 64px;
      border: none;
      border-radius: 12px;
      font: inherit;
      font-size: 18px;
      font-weight: 500;
      cursor: pointer;
      color: var(--text-primary-color, #fff);
      background: var(--primary-color);
    }
    .big.stop {
      background: var(--error-color, #db4437);
    }
    .big:disabled,
    .btn:disabled,
    .segb:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .live {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-top: 12px;
    }
    .elapsed {
      font-size: 28px;
      font-variant-numeric: tabular-nums;
    }
    .what {
      color: var(--secondary-text-color);
      font-size: 13px;
      text-transform: capitalize;
    }
    .meter {
      height: 14px;
      border-radius: 7px;
      background: var(--divider-color);
      overflow: hidden;
      margin-top: 8px;
    }
    .meter .fill {
      height: 100%;
      background: var(--primary-color);
      transition: width 0.25s linear;
    }
    .meter.dead {
      outline: 2px solid var(--error-color, #db4437);
    }
    .warn {
      margin-top: 8px;
      color: var(--error-color, #db4437);
      font-weight: 500;
      line-height: 1.4;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 8px;
    }
    .chip,
    .btn {
      border: none;
      border-radius: 16px;
      min-height: 36px;
      padding: 6px 14px;
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12);
      color: var(--primary-color);
    }
    .chip.on {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .btn.danger {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.12);
      color: var(--error-color, #db4437);
    }
    /* The lesser path: there when wanted, not competing with the sign-in. */
    .btn.quiet {
      border-color: transparent;
      color: var(--secondary-text-color);
    }
    .btn.icon {
      min-width: 44px;
      min-height: 44px;
      padding: 0;
      border-radius: 22px;
      font-size: 16px;
    }
    .btn.wide {
      width: 100%;
      min-height: 44px;
    }
    .selbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--divider-color);
      min-height: 44px;
    }
    .sel-all {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--secondary-text-color);
      font-size: 13px;
      min-height: 36px;
    }
    .grp {
      display: flex;
      gap: 6px;
      align-items: center;
      flex: 1 1 260px;
    }
    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      margin: 0;
      flex: none;
      accent-color: var(--primary-color);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      min-height: 52px;
    }
    .row + .row {
      border-top: 1px solid var(--divider-color);
    }
    .row.on {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.06);
    }
    .body {
      flex: 1;
      min-width: 0;
      cursor: pointer;
    }
    .text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .text.none {
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .meta {
      color: var(--secondary-text-color);
      font-size: 12px;
      margin-top: 2px;
    }
    .linkform {
      padding: 4px 0 10px;
      border-top: 1px dashed var(--divider-color);
    }
    .linkform + .row {
      border-top: 1px solid var(--divider-color);
    }
    .arm {
      display: flex;
      gap: 10px;
      align-items: center;
      margin: 8px 0 10px;
      line-height: 1.4;
      cursor: pointer;
    }
  `;
}

customElements.define("hubbubb-voice-studio", HubbubbVoiceStudio);
