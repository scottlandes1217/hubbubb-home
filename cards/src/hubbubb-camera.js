/* Hubbubb camera — the Mac camera's whole interface, as a sidebar panel.

   Live view and controls; gestures, each with any Home Assistant actions;
   the people it knows; the things it has been shown; and tuning. The Mac
   does the seeing, the integration relays every call (camera_* services), so
   this needs nothing but a Home Assistant session. Inputs are Home
   Assistant's own ha-form, which also brings the full action editor the
   automation editor uses. Pure helpers are exported for test/camera.mjs. */
import { LitElement, css, html, nothing } from "lit";

const BUILD =
  ((new Error().stack || "").match(/\/(\d+\.\d+\.\d+)\//) || [])[1] || "dev";
console.info(`hubbubb-camera ${BUILD}`);

const TABS = [
  ["live", "Live", "mdi:cctv"],
  ["gestures", "Gestures", "mdi:hand-wave"],
  ["people", "People", "mdi:account-multiple"],
  ["things", "Things", "mdi:package-variant-closed"],
  ["jarvis", "Jarvis", "mdi:account-voice"],
  ["tuning", "Tuning", "mdi:tune-variant"],
];

/* What each knob means, in the words a person would use. */
export const KNOBS = [
  ["gestureMatch", "Gesture match strictness", "How close a hand must be to the gestures you taught it. Lower is stricter (fewer accidents); raise it if taught gestures are missed.", 0.01],
  ["framingFill", "Framing", "How much of the frame one person's upper body fills when auto-zoom is on. Lower shows more of the room; the face never fills more than a quarter.", 0.05],
  ["holdSeconds", "Hold time", "Seconds a gesture must be held before it counts. Longer means fewer accidents.", 0.1],
  ["handConfidence", "Hand clarity", "How clearly every finger must be seen. Higher ignores hands holding a phone or petting the dog.", 0.05],
  ["lookTurn", "Looking at the camera", "How far your face may turn from the camera and still count as looking (0 = straight at it, 0.5 = side-on). Works with your head tilted, lying down. Raise it if you're refused while looking at the camera; lower it if glancing at your phone counts.", 0.01],
  ["followGain", "Following speed", "How quickly the camera turns to keep you centred. Higher is snappier; too high and it wobbles.", 0.05],
  ["gestureReach", "Gesture height", "A hand counts as raised when its wrist is above its elbow, or when it is no more than this many face-heights below your chin. Raise it if chest-height gestures are missed; lower it if a phone or keyboard sets gestures off.", 0.1],
  ["hairReach", "Head zone: above the face", "Hands this far above your face (hair) pause gestures, in face-heights.", 0.1],
  ["chinReach", "Head zone: below the chin", "Hands this far below your chin (eating, drinking) pause gestures, in face-heights.", 0.1],
  ["steadiness", "Hold-still tolerance", "How still a hand must be for a gesture to count. Lower is stricter.", 0.05],
  ["faceMatchThreshold", "Face match strictness", "Lower is stricter. Raise it if you're not recognized; lower it if people get mixed up.", 0.02],
  ["searchDegrees", "Search width", "Degrees either side of the last sighting to search, until the room is learned.", 1],
  ["searchTilt", "Search tilt", "Degrees up (+) or down (−) to search at, until the room is learned.", 1],
];

/* "Select option, Mac screen mirroring" for a card's one-line summary. */
export const summarizeActions = (actions) => {
  const list = Array.isArray(actions) ? actions : [];
  if (!list.length) return "Does nothing yet";
  const names = list.map((a) => {
    const id = a.action || a.service || (a.choose && "choose") || (a.delay && "delay") || (a.event && "event") || "";
    if (id === "hubbubb_home.mac_screen_sharing") return a.data?.on ? "Start Mac screen mirroring" : "Stop Mac screen mirroring";
    if (!id.includes(".")) return id ? id[0].toUpperCase() + id.slice(1) : "Step";
    const [, verb] = id.split(".");
    return verb.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
  });
  return names.join(", ");
};

/* Seconds-since-epoch -> "just now", "5 min ago", "3 h ago", "2 days ago". */
export const ago = (ts, now = Date.now() / 1000) => {
  if (!ts) return "";
  const s = Math.max(0, now - ts);
  if (s < 45) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} days ago`;
};

/* A gesture's editable form, with defaults filled in. */
export const gestureForm = (config) => ({
  enabled: config?.enabled ?? true,
  repeat: config?.repeat ?? false,
  people: config?.people ?? [],
  actions: config?.actions ?? [],
});

/* Whether the form differs from what is saved. */
export const changed = (form, config) => JSON.stringify(form) !== JSON.stringify(gestureForm(config));

const MOODS = [
  ["listening", "Listening", "mdi:ear-hearing"],
  ["thinking", "Thinking", "mdi:head-cog-outline"],
  ["speaking", "Speaking", "mdi:account-voice"],
];

/* The stored Jarvis settings <-> a flat form (ha-form has no nested colours). */
export const jarvisForm = (config = {}) => ({
  move: config.move ?? true,
  satellites: config.satellites ?? [],
  strength: config.strength ?? 0.6,
  lights: config.lights ?? false,
  light_entities: config.light_entities ?? [],
  brightness: config.brightness ?? 80,
  pause_while: config.pause_while ?? "",
  ...Object.fromEntries(MOODS.map(([m]) => [`${m}_color`, config.colors?.[m] ?? null])),
});

export const jarvisConfig = (form) => {
  const { listening_color, thinking_color, speaking_color, pause_while, ...rest } = form;
  const colors = Object.fromEntries(
    [["listening", listening_color], ["thinking", thinking_color], ["speaking", speaking_color]].filter(([, c]) => Array.isArray(c))
  );
  return { ...rest, pause_while: pause_while || null, ...(Object.keys(colors).length ? { colors } : {}) };
};

/* ha-form is lazy-loaded by Home Assistant. A custom panel can be the first
   thing on screen, so pull it in the way card editors do. */
let formReady;
const loadForm = () =>
  (formReady ||= (async () => {
    if (customElements.get("ha-form") && customElements.get("ha-selector")) return;
    const helpers = await window.loadCardHelpers?.();
    const card = await helpers?.createCardElement({ type: "entities", entities: [] });
    await card?.constructor?.getConfigElement?.();
    await customElements.whenDefined("ha-form");
  })());

class HubbubbCamera extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    _tab: { state: true },
    _state: { state: true },
    _err: { state: true },
    _busy: { state: true },
    _gestures: { state: true },
    _open: { state: true },
    _form: { state: true },
    _flash: { state: true },
    _items: { state: true },
    _enrollName: { state: true },
    _confirm: { state: true },
    _ask: { state: true },
    _teach: { state: true },
    _formReady: { state: true },
    _viewKey: { state: true },
    _jarvis: { state: true },
    _jarvisForm: { state: true },
  };

  constructor() {
    super();
    this._tab = (() => {
      try { return localStorage.getItem("hubbubb-camera-tab") || "live"; } catch { return "live"; }
    })();
    this._state = null;
    this._err = "";
    this._busy = false;
    this._gestures = null; // { catalog, gestures, last }
    this._open = null; // gesture id being edited
    this._form = null;
    this._flash = null; // { gesture, person } briefly after one fires
    this._items = null;
    this._enrollName = "";
    this._confirm = null; // what a second click will delete
    this._ask = { q: "", answer: null, busy: false };
    this._teach = { name: "", where: "", result: null, busy: false };
    this._formReady = false;
    this._viewKey = 0; // bumped to reconnect the live view
    this._jarvis = null; // { config, satellites, mood }
    this._jarvisForm = null;
  }

  connectedCallback() {
    super.connectedCallback();
    loadForm().then(() => (this._formReady = true)).catch(() => (this._formReady = true));
    this._onVisible = () => document.visibilityState === "visible" && this._poll();
    document.addEventListener("visibilitychange", this._onVisible);
    this._unsub = this.hass.connection.subscribeEvents((e) => this._fired(e.data), "hubbubb_home_gesture");
    this._poll();
    this._loadGestures();
  }

  disconnectedCallback() {
    clearTimeout(this._timer);
    document.removeEventListener("visibilitychange", this._onVisible);
    this._unsub?.then((u) => u()).catch(() => {});
    super.disconnectedCallback();
  }

  async _call(service, data = {}, response = true) {
    const res = await this.hass.callWS({
      type: "call_service",
      domain: "hubbubb_home",
      service,
      service_data: data,
      ...(response ? { return_response: true } : {}),
    });
    return res?.response || {};
  }

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

  /* State every 1.5 s while someone is looking at a live tab, else every 6 s;
     nothing while the page is hidden. */
  async _poll() {
    clearTimeout(this._timer);
    if (document.visibilityState !== "visible" || !this.isConnected) return;
    const wasConnected = this._state?.connected;
    try {
      this._state = await this._call("camera_state");
      // Back from offline (Mac asleep, Home Assistant restarted): the stream
      // that failed meanwhile won't come back by itself.
      if (wasConnected === false && this._state.connected) this._viewKey++;
      if (this._err.startsWith("The camera")) this._err = "";
    } catch (e) {
      this._state = { connected: false, status: e?.message || String(e) };
    }
    if (this._tab === "jarvis") this._loadJarvis(false);
    const fast = ["live", "people", "jarvis"].includes(this._tab) || this._state?.enrolling || this._state?.gestures?.teaching;
    this._timer = setTimeout(() => this._poll(), fast ? 1500 : 6000);
  }

  async _loadGestures() {
    const res = await this._try(() => this._call("gestures_get"));
    if (res) this._gestures = res;
  }

  async _loadJarvis(resetForm) {
    try {
      this._jarvis = await this._call("jarvis_presence_get");
      if (resetForm || !this._jarvisForm) this._jarvisForm = jarvisForm(this._jarvis.config);
    } catch (e) {
      this._err = e?.message || String(e);
    }
  }

  async _loadItems() {
    const res = await this._try(() => this._call("camera_items"));
    if (res) this._items = res.items || [];
  }

  _fired(data) {
    if (data.held) return;
    this._flash = data;
    clearTimeout(this._flashTimer);
    this._flashTimer = setTimeout(() => (this._flash = null), 2500);
    if (this._gestures) this._gestures = { ...this._gestures, last: { ...data, ts: Date.now() / 1000 } };
  }

  _go(tab) {
    this._tab = tab;
    this._confirm = null;
    try { localStorage.setItem("hubbubb-camera-tab", tab); } catch {}
    if (tab === "things" && !this._items) this._loadItems();
    if (tab === "jarvis") this._loadJarvis(true);
    this._poll();
  }

  get _cameraEntity() {
    return Object.values(this.hass.entities || {}).find(
      (e) => e.platform === "hubbubb_home" && e.entity_id.startsWith("camera.")
    )?.entity_id;
  }

  async _settings(changes) {
    const res = await this._try(() => this._call("camera_settings", changes));
    if (res) this._state = res;
  }

  render() {
    const s = this._state;
    return html`
      <div class="bar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Camera</div>
        <span class="pill ${s?.connected ? "ok" : "off"}">
          <span class="dot"></span>${s === null ? "Connecting…" : s.connected ? "Connected" : "Offline"}
        </span>
      </div>
      <nav class="tabs" role="tablist">
        ${TABS.map(
          ([id, label, icon]) => html`<button role="tab" aria-selected=${this._tab === id} class=${this._tab === id ? "on" : ""} @click=${() => this._go(id)}>
            <ha-icon .icon=${icon}></ha-icon><span>${label}</span>
          </button>`
        )}
      </nav>
      ${this._err ? html`<div class="err" @click=${() => (this._err = "")}>${this._err}<span class="x">dismiss</span></div>` : nothing}
      ${s && !s.connected && s.status
        ? html`<div class="notice"><ha-icon icon="mdi:lan-disconnect"></ha-icon><div><b>The camera isn't reachable.</b><br />${s.status}<br /><span class="muted">It runs as Hubbubb Local Camera on the Mac and starts at login.</span></div></div>`
        : nothing}
      <main>
        ${{ live: () => this._renderLive(), gestures: () => this._renderGestures(), people: () => this._renderPeople(), things: () => this._renderThings(), jarvis: () => this._renderJarvis(), tuning: () => this._renderTuning() }[this._tab]?.() ?? nothing}
      </main>
    `;
  }

  _renderView(small = false) {
    const id = this._cameraEntity;
    const token = id && this.hass.states[id]?.attributes?.access_token;
    if (!id || !token) return html`<div class="view empty ${small ? "small" : ""}">No live view yet.</div>`;
    return html`<div class="view ${small ? "small" : ""}">
      <img
        alt="Live camera view"
        src=${`/api/camera_proxy_stream/${id}?token=${token}&v=${this._viewKey}`}
        @error=${() => { clearTimeout(this._retry); this._retry = setTimeout(() => this._viewKey++, 2000); }}
      />
      ${this._flash
        ? html`<div class="toast"><ha-icon .icon=${this._iconFor(this._flash.gesture)}></ha-icon>${this._titleFor(this._flash.gesture)}${this._flash.person ? html` · ${this._flash.person}` : nothing}</div>`
        : nothing}
    </div>`;
  }

  _titleFor(id) {
    return this._gestures?.catalog?.find((g) => g.id === id)?.title || id;
  }

  _iconFor(id) {
    return this._gestures?.catalog?.find((g) => g.id === id)?.icon || "mdi:hand-wave";
  }

  _renderLive() {
    const s = this._state || {};
    const settings = s.settings || {};
    const people = s.people || [];
    const animals = s.animals || [];
    return html`
      <div class="live">
        <div>
          ${this._renderView()}
          <div class="status">${s.status || ""}</div>
        </div>
        <div class="side">
          <section class="card">
            <h3>In view</h3>
            <div class="chips">
              ${people.map((p) => html`<span class="chip person"><ha-icon icon="mdi:account"></ha-icon>${p}</span>`)}
              ${animals.map((a) => html`<span class="chip animal"><ha-icon icon="mdi:paw"></ha-icon>${a}</span>`)}
              ${!people.length && !animals.length ? html`<span class="muted">Nobody recognized</span>` : nothing}
            </div>
          </section>
          <section class="card">
            <h3>Camera</h3>
            <div class="pan">
              <button class="round" title="Pan left" aria-label="Pan left" @click=${() => this._try(() => this._call("camera_pan", { direction: -1 }))}><ha-icon icon="mdi:chevron-left"></ha-icon></button>
              <span class="muted">Pan</span>
              <button class="round" title="Pan right" aria-label="Pan right" @click=${() => this._try(() => this._call("camera_pan", { direction: 1 }))}><ha-icon icon="mdi:chevron-right"></ha-icon></button>
            </div>
            ${this._formReady
              ? html`<ha-form
                  .hass=${this.hass}
                  .data=${{ follow: settings.follow, auto_zoom: settings.auto_zoom, zoom: settings.zoom ?? 1 }}
                  .schema=${[
                    { name: "follow", selector: { boolean: {} } },
                    { name: "auto_zoom", selector: { boolean: {} } },
                    ...(settings.auto_zoom ? [] : [{ name: "zoom", selector: { number: { min: 1, max: 4, step: 0.1, mode: "slider" } } }]),
                  ]}
                  .computeLabel=${(f) => ({ follow: "Follow people", auto_zoom: "Zoom to fit automatically", zoom: "Zoom" })[f.name]}
                  @value-changed=${(e) => this._settingsFrom(e.detail.value, settings)}
                ></ha-form>`
              : nothing}
          </section>
          <section class="card">
            <h3>Ask the camera</h3>
            <form class="inline" @submit=${(e) => { e.preventDefault(); this._askCamera(); }}>
              <input placeholder="Where are my keys?" .value=${this._ask.q} @input=${(e) => (this._ask = { ...this._ask, q: e.target.value })} />
              <button class="primary" ?disabled=${this._ask.busy || !this._ask.q.trim()}>${this._ask.busy ? "Looking…" : "Ask"}</button>
            </form>
            ${this._ask.answer ? html`<p class="answer">${this._ask.answer}</p>` : nothing}
          </section>
        </div>
      </div>
    `;
  }

  _settingsFrom(value, current) {
    const changes = {};
    for (const k of ["follow", "auto_zoom", "zoom"]) if (value[k] !== undefined && value[k] !== current[k]) changes[k] = value[k];
    if (Object.keys(changes).length) this._settings(changes);
  }

  async _askCamera() {
    this._ask = { ...this._ask, busy: true, answer: null };
    try {
      const res = await this._call("camera_look", { question: this._ask.q.trim() });
      const extra = !res.found && res.last_seen ? ` Last seen ${res.last_seen}` : "";
      this._ask = { ...this._ask, busy: false, answer: (res.answer || res.error || "No answer.") + extra };
    } catch (e) {
      this._ask = { ...this._ask, busy: false, answer: e?.message || String(e) };
    }
  }

  /* --- gestures --- */

  _renderGestures() {
    const g = this._gestures;
    if (!g) return html`<div class="empty">Loading gestures…</div>`;
    return html`
      <p class="intro">Look at the camera and hold a gesture steady at chest height for about a second. Assign each one any Home Assistant actions — the same editor automations use. Hands at the keyboard, near your face, or while you look elsewhere never count.</p>
      <div class="gestures">
        ${g.catalog.map((c) => this._renderGesture(c, g.gestures[c.id]))}
      </div>
    `;
  }

  _renderGesture(c, config) {
    const open = this._open === c.id;
    const form = open ? this._form : gestureForm(config);
    const lit = this._flash?.gesture === c.id;
    const taught = this._state?.gestures?.taught?.[c.id];
    const last = this._gestures.last?.gesture === c.id ? this._gestures.last : null;
    return html`
      <section class="card gesture ${open ? "open" : ""} ${lit ? "lit" : ""} ${form.enabled ? "" : "disabled"}">
        <button class="ghead" aria-expanded=${open} @click=${() => this._toggleGesture(c.id, config)}>
          <span class="gicon"><ha-icon .icon=${c.icon}></ha-icon></span>
          <span class="gtext">
            <span class="name">${c.title} <span class="badge ${taught ? "on" : ""}">${taught ? "Taught" : "Built-in shape"}</span></span>
            <span class="muted">${c.how}</span>
            <span class="summary">${form.enabled ? summarizeActions(config?.actions) : "Turned off"}${config?.repeat ? " · repeats while held" : ""}${config?.people?.length ? ` · only ${config.people.join(", ")}` : ""}</span>
          </span>
          ${last ? html`<span class="muted when">${last.person ? `${last.person}, ` : ""}${ago(last.ts)}</span>` : nothing}
          <ha-icon class="chev" icon=${open ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
        </button>
        ${open ? this._renderGestureEditor(c) : nothing}
      </section>
    `;
  }

  _toggleGesture(id, config) {
    if (this._open === id) {
      this._open = null;
      this._form = null;
      return;
    }
    this._open = id;
    this._form = gestureForm(config);
  }

  _renderTeach(c) {
    const training = this._state?.gestures || {};
    const now = training.teaching;
    const taught = training.taught?.[c.id];
    if (now?.gesture === c.id)
      return html`<div class="teach-box">
        <div class="teach-row">
          <div class="teach-view">${this._renderView(true)}</div>
          <div>
            <div class="name">Teaching ${c.title}…</div>
            <div class="progress"><div style=${`width:${Math.round((100 * now.samples) / now.target)}%`}></div></div>
            <p class="muted">${this._state?.status || ""}</p>
            <p class="muted small">Look at the camera, hold ${c.title.toLowerCase()} at chest height, and move it around a little — closer, further, tilted — so it learns your hand from every angle.</p>
          </div>
        </div>
      </div>`;
    return html`<div class="teach-box">
      <div class="teach-row-inline">
        <div class="grow">
          <div class="name">${taught ? `Taught from your hand (${taught} samples)` : "Using the built-in shape"}</div>
          <div class="muted small">${taught ? "Re-teach it if it's being missed or mistaken for another gesture." : "Teach it your way of doing it — it takes 3 seconds and makes it far more reliable."}</div>
        </div>
        <button class="primary" ?disabled=${this._busy || !!now} @click=${() => this._try(() => this._call("camera_gesture_teach", { gesture: c.id })).then(() => this._poll())}>${taught ? "Re-teach" : "Teach it"}</button>
        ${taught ? html`<button ?disabled=${this._busy || !!now} @click=${() => this._forgetTeach(c.id)}>${this._confirm === `g:${c.id}` ? "Really forget?" : "Forget"}</button>` : nothing}
      </div>
    </div>`;
  }

  async _forgetTeach(id) {
    if (this._confirm !== `g:${id}`) return (this._confirm = `g:${id}`);
    this._confirm = null;
    await this._try(() => this._call("camera_gesture_forget", { gesture: id }));
    this._poll();
  }

  _renderGestureEditor(c) {
    const enrolled = (this._state?.enrolled || []).map((p) => p.name);
    const config = this._gestures.gestures[c.id];
    const dirty = changed(this._form, config);
    if (!this._formReady) return html`<div class="empty">Loading the editor…</div>`;
    return html`
      <div class="editor">
        ${this._renderTeach(c)}
        <ha-form
          .hass=${this.hass}
          .data=${this._form}
          .schema=${[
            { name: "enabled", selector: { boolean: {} } },
            { name: "repeat", selector: { boolean: {} } },
            ...(enrolled.length
              ? [{ name: "people", selector: { select: { multiple: true, mode: "list", options: enrolled.map((n) => ({ value: n, label: n })) } } }]
              : []),
          ]}
          .computeLabel=${(f) => ({ enabled: "On", repeat: "Repeat while held", people: "Only for these people" })[f.name]}
          .computeHelper=${(f) => ({ repeat: "Runs again every ⅓ second while you hold it — for things like volume.", people: "Leave all unticked to let anyone use it." })[f.name]}
          @value-changed=${(e) => (this._form = { ...this._form, ...e.detail.value })}
        ></ha-form>
        <h4>Then do</h4>
        <ha-form
          .hass=${this.hass}
          .data=${{ actions: this._form.actions }}
          .schema=${[{ name: "actions", selector: { action: {} } }]}
          .computeLabel=${() => ""}
          @value-changed=${(e) => (this._form = { ...this._form, actions: e.detail.value.actions || [] })}
        ></ha-form>
        <p class="muted small">Actions can use <code>{{ person }}</code> — who made the gesture, if recognized.</p>
        <div class="actions">
          <button class="primary" ?disabled=${this._busy || !dirty} @click=${() => this._saveGesture(c.id)}>${dirty ? "Save" : "Saved"}</button>
          <button ?disabled=${this._busy || !this._form.actions.length} @click=${() => this._testGesture(c.id, dirty)}>Test</button>
          ${dirty ? html`<button ?disabled=${this._busy} @click=${() => (this._form = gestureForm(config))}>Undo changes</button>` : nothing}
        </div>
      </div>
    `;
  }

  async _saveGesture(id) {
    const res = await this._try(() => this._call("gesture_save", { gesture: id, ...this._form }));
    if (!res) return;
    this._gestures = { ...this._gestures, gestures: { ...this._gestures.gestures, [id]: res.saved } };
    this._form = gestureForm(res.saved);
  }

  async _testGesture(id, dirty) {
    if (dirty) await this._saveGesture(id);
    if (this._err) return;
    await this._try(() => this._call("gesture_test", { gesture: id }, false));
  }

  /* --- people --- */

  _renderPeople() {
    const s = this._state || {};
    const enrolled = s.enrolled || [];
    const enrolling = s.enrolling;
    return html`
      <div class="two">
        <section class="card">
          <h3>Who the camera knows</h3>
          ${enrolled.length
            ? enrolled.map(
                (p) => html`<div class="row">
                  <ha-icon icon="mdi:account-circle"></ha-icon>
                  <div class="grow"><div class="name">${p.name}</div><div class="muted">${p.samples} face samples${(s.people || []).includes(p.name) ? " · in view now" : ""}</div></div>
                  <button ?disabled=${this._busy || enrolling} @click=${() => this._enroll(p.name)}>Re-enroll</button>
                  <button class="danger" ?disabled=${this._busy} @click=${() => this._forgetPerson(p.name)}>${this._confirm === `p:${p.name}` ? "Really forget?" : "Forget"}</button>
                </div>`
              )
            : html`<p class="muted">Nobody yet. Enroll each person once so the camera — and Jarvis — knows who's who.</p>`}
          <h3>Enroll someone</h3>
          ${enrolling
            ? html`<div class="enrolling">
                <div class="name">Enrolling ${enrolling.name}…</div>
                <div class="progress"><div style=${`width:${Math.round((100 * enrolling.samples) / enrolling.target)}%`}></div></div>
                <p class="muted">${s.status}</p>
              </div>`
            : html`<form class="inline" @submit=${(e) => { e.preventDefault(); this._enroll(this._enrollName.trim()); }}>
                <input placeholder="Their name, as Jarvis should say it" .value=${this._enrollName} @input=${(e) => (this._enrollName = e.target.value)} />
                <button class="primary" ?disabled=${this._busy || !this._enrollName.trim()}>Start</button>
              </form>
              <ol class="steps">
                <li>Only that person in view, facing the camera, a few steps away.</li>
                <li>Press Start and slowly turn the head left, right, up and down.</li>
                <li>Done in a few seconds. Face samples stay on the Mac.</li>
              </ol>`}
        </section>
        <div>${this._renderView(true)}<div class="status">${s.status || ""}</div></div>
      </div>
    `;
  }

  async _enroll(name) {
    if (!name) return;
    const res = await this._try(() => this._call("camera_enroll", { name }));
    if (res) {
      this._enrollName = "";
      this._poll();
    }
  }

  async _forgetPerson(name) {
    if (this._confirm !== `p:${name}`) return (this._confirm = `p:${name}`);
    this._confirm = null;
    await this._try(() => this._call("camera_forget_person", { name }));
    this._poll();
  }

  /* --- things --- */

  _renderThings() {
    const t = this._teach;
    return html`
      <section class="card teach">
        <h3>Teach it something</h3>
        <p class="muted">Hold the thing up to the camera and name it — or say where it is. Next time you ask Jarvis where it is, the camera knows what to look for. You can also just say "Jarvis, this is my …" while holding it.</p>
        <form class="inline wrap" @submit=${(e) => { e.preventDefault(); this._learn(); }}>
          <input placeholder="Name, e.g. AirPods case" .value=${t.name} @input=${(e) => (this._teach = { ...t, name: e.target.value })} />
          <input placeholder="Where (optional), e.g. on the shelf by the door" .value=${t.where} @input=${(e) => (this._teach = { ...t, where: e.target.value })} />
          <button class="primary" ?disabled=${t.busy || !t.name.trim()}>${t.busy ? "Looking…" : "Teach"}</button>
        </form>
        ${t.result ? html`<p class="answer">${t.result}</p>` : nothing}
      </section>
      ${this._items === null
        ? html`<div class="empty">Loading…</div>`
        : this._items.length
          ? html`<div class="items">
              ${this._items.map(
                (i) => html`<section class="card item">
                  ${i.photo ? html`<img alt=${i.name} src=${`data:image/jpeg;base64,${i.photo}`} />` : html`<div class="noimg"><ha-icon icon="mdi:image-off-outline"></ha-icon></div>`}
                  <div class="name">${i.name}</div>
                  <div class="muted">${i.description}</div>
                  <div class="seen">${i.last_seen_at ? html`<ha-icon icon="mdi:map-marker-outline"></ha-icon>${ago(i.last_seen_at)}: ${i.last_seen}` : html`<span class="muted">Not spotted yet</span>`}</div>
                  <button class="danger" ?disabled=${this._busy} @click=${() => this._forgetItem(i.name)}>${this._confirm === `i:${i.name}` ? "Really forget?" : "Forget"}</button>
                </section>`
              )}
            </div>`
          : html`<div class="empty">Nothing taught yet.</div>`}
    `;
  }

  async _learn() {
    const t = this._teach;
    this._teach = { ...t, busy: true, result: null };
    try {
      const res = await this._call("camera_learn", { name: t.name.trim(), hint: t.where.trim() });
      this._teach = res.learned
        ? { name: "", where: "", busy: false, result: `Got it — ${res.learned}: ${res.looks_like}` }
        : { ...t, busy: false, result: res.error || "It couldn't make that out." };
      if (res.learned) this._loadItems();
    } catch (e) {
      this._teach = { ...t, busy: false, result: e?.message || String(e) };
    }
  }

  async _forgetItem(name) {
    if (this._confirm !== `i:${name}`) return (this._confirm = `i:${name}`);
    this._confirm = null;
    await this._try(() => this._call("camera_forget_item", { name }));
    this._loadItems();
  }

  /* --- Jarvis --- */

  _renderJarvis() {
    const j = this._jarvis;
    const f = this._jarvisForm;
    if (!j || !f || !this._formReady) return html`<div class="empty">Loading…</div>`;
    const dirty = JSON.stringify(jarvisConfig(f)) !== JSON.stringify(jarvisConfig(jarvisForm(j.config)));
    const mood = MOODS.find(([m]) => m === j.mood);
    return html`
      <p class="intro">While Jarvis listens, thinks and talks through your Voice puck, the camera can move like it's paying attention, and lights can glow to show what it's doing. Both go back to normal when Jarvis is done.</p>
      <div class="two">
        <section class="card">
          <h3>Now</h3>
          <div class="mood ${j.mood}">
            <ha-icon .icon=${mood?.[2] || "mdi:sleep"}></ha-icon>
            <span>${mood ? mood[1] : "Idle"}</span>
          </div>
          <h3>Preview</h3>
          <div class="actions">
            ${MOODS.map(([m, label, icon]) => html`<button ?disabled=${this._busy || dirty} title=${dirty ? "Save first" : ""} @click=${() => this._try(() => this._call("jarvis_presence_test", { mood: m }, false))}><ha-icon .icon=${icon}></ha-icon> ${label}</button>`)}
          </div>
          <p class="muted small">Plays for 4 seconds, then puts the camera and lights back.</p>
        </section>
        <section class="card">
          <h3>Camera movement</h3>
          <ha-form
            .hass=${this.hass}
            .data=${f}
            .schema=${[
              { name: "move", selector: { boolean: {} } },
              ...(f.move ? [{ name: "strength", selector: { number: { min: 0.1, max: 1, step: 0.05, mode: "slider" } } }] : []),
              { name: "satellites", selector: { entity: { domain: "assist_satellite", multiple: true } } },
            ]}
            .computeLabel=${(x) => ({ move: "Move the camera while Jarvis talks", strength: "How much it moves", satellites: "Which pucks" })[x.name]}
            .computeHelper=${(x) => ({ strength: "A perk-up when listening, a glance while thinking, gentle nods while speaking.", satellites: "Leave empty to follow every voice puck." })[x.name]}
            @value-changed=${(e) => (this._jarvisForm = { ...this._jarvisForm, ...e.detail.value })}
          ></ha-form>
          <h3>Lights</h3>
          <ha-form
            .hass=${this.hass}
            .data=${f}
            .schema=${[
              { name: "lights", selector: { boolean: {} } },
              ...(f.lights
                ? [
                    { name: "light_entities", selector: { entity: { domain: "light", multiple: true } } },
                    { name: "brightness", selector: { number: { min: 1, max: 100, step: 1, mode: "slider", unit_of_measurement: "%" } } },
                    ...MOODS.map(([m]) => ({ name: `${m}_color`, selector: { color_rgb: {} } })),
                    { name: "pause_while", selector: { entity: {} } },
                  ]
                : []),
            ]}
            .computeLabel=${(x) =>
              ({ lights: "Tint lights while Jarvis talks", light_entities: "Which lights", brightness: "Brightness", listening_color: "Listening colour", thinking_color: "Thinking colour", speaking_color: "Speaking colour", pause_while: "Leave the lights alone while this is on" })[x.name]}
            .computeHelper=${(x) => ({ light_entities: "Coloured lights near the TV work best, like the Hue Play bars.", pause_while: "For example the Sync Box's light sync, which owns those lights while it runs." })[x.name]}
            @value-changed=${(e) => (this._jarvisForm = { ...this._jarvisForm, ...e.detail.value })}
          ></ha-form>
          <div class="actions">
            <button class="primary" ?disabled=${this._busy || !dirty} @click=${() => this._saveJarvis()}>${dirty ? "Save" : "Saved"}</button>
            ${dirty ? html`<button ?disabled=${this._busy} @click=${() => (this._jarvisForm = jarvisForm(j.config))}>Undo changes</button>` : nothing}
          </div>
        </section>
      </div>
    `;
  }

  async _saveJarvis() {
    const res = await this._try(() => this._call("jarvis_presence_save", jarvisConfig(this._jarvisForm)));
    if (!res) return;
    this._jarvis = { ...this._jarvis, config: res.config };
    this._jarvisForm = jarvisForm(res.config);
  }

  /* --- tuning --- */

  _renderTuning() {
    const s = this._state || {};
    const settings = s.settings || {};
    const knobs = s.knobs || {};
    const room = s.room || {};
    const data = { require_looking: settings.require_looking, ...Object.fromEntries(KNOBS.map(([k]) => [k, settings[k]])) };
    return html`
      <div class="two">
        <section class="card">
          <h3>Tuning</h3>
          ${this._formReady && Object.keys(knobs).length
            ? html`<ha-form
                .hass=${this.hass}
                .data=${data}
                .schema=${[
                  { name: "require_looking", selector: { boolean: {} } },
                  ...KNOBS.filter(([k]) => knobs[k]).map(([k, , , step]) => ({ name: k, selector: { number: { min: knobs[k].min, max: knobs[k].max, step, mode: "slider" } } })),
                ]}
                .computeLabel=${(f) => (f.name === "require_looking" ? "Only when looking at the camera" : KNOBS.find(([k]) => k === f.name)?.[1])}
                .computeHelper=${(f) =>
                  f.name === "require_looking"
                    ? "Gestures only count while the person faces the camera. The live view marks them \u201clooking\u201d."
                    : KNOBS.find(([k]) => k === f.name)?.[2]}
                @value-changed=${(e) => this._knobs(e.detail.value, data)}
              ></ha-form>
              <div class="actions">
                <button ?disabled=${this._busy} @click=${() => this._settings({ require_looking: true, ...Object.fromEntries(Object.entries(knobs).map(([k, v]) => [k, v.default])) })}>Reset to defaults</button>
              </div>`
            : html`<div class="empty">Waiting for the camera…</div>`}
        </section>
        <section class="card">
          <h3>Room map</h3>
          ${room.learned
            ? html`<p>The camera has learned where people spend time: <b>${Math.round(room.low)}° to ${Math.round(room.high)}°</b> of pan, from ${room.sightings} sightings. Searches stay inside that span, skipping walls, corners and the back of the TV.</p>`
            : html`<p>Still learning where people spend time: ${room.sightings ?? 0} of ${room.needed ?? 30} sightings. Until then it searches around where it last saw someone.</p>`}
          <div class="actions">
            <button class="danger" ?disabled=${this._busy} @click=${() => this._resetRoom()}>${this._confirm === "room" ? "Really relearn?" : "Relearn the room"}</button>
          </div>
          <p class="muted small">Relearn after moving the camera or the furniture.</p>
        </section>
      </div>
    `;
  }

  _knobs(value, current) {
    const changes = Object.fromEntries(Object.entries(value).filter(([k, v]) => v !== undefined && v !== current[k]));
    clearTimeout(this._knobTimer);
    // Sliders fire while dragging; send the value once it settles.
    if (Object.keys(changes).length) this._knobTimer = setTimeout(() => this._settings(changes), 300);
  }

  async _resetRoom() {
    if (this._confirm !== "room") return (this._confirm = "room");
    this._confirm = null;
    await this._try(() => this._call("camera_room_reset"));
    this._poll();
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
      z-index: 3;
    }
    .title { font-size: 20px; font-weight: 400; flex: 1; }
    .pill { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; padding: 4px 10px; border-radius: 999px; background: rgba(255, 255, 255, 0.16); }
    .pill .dot { width: 8px; height: 8px; border-radius: 50%; background: #9e9e9e; }
    .pill.ok .dot { background: var(--success-color, #43a047); }
    .pill.off .dot { background: var(--error-color, #db4437); }
    .tabs {
      display: flex;
      gap: 4px;
      padding: 0 12px;
      background: var(--card-background-color);
      border-bottom: 1px solid var(--divider-color);
      position: sticky;
      top: 56px;
      z-index: 2;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tabs button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 12px 14px;
      border: 0;
      border-bottom: 2px solid transparent;
      background: none;
      color: var(--secondary-text-color);
      font: inherit;
      cursor: pointer;
      white-space: nowrap;
    }
    .tabs button.on { color: var(--primary-color); border-bottom-color: var(--primary-color); }
    .tabs ha-icon { --mdc-icon-size: 20px; }
    main { padding: 16px; max-width: 1200px; margin: 0 auto; box-sizing: border-box; }
    .err, .notice {
      margin: 12px 16px 0;
      padding: 10px 14px;
      border-radius: 8px;
    }
    .err {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.14);
      color: var(--error-color, #db4437);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      gap: 12px;
    }
    .err .x { opacity: 0.7; font-size: 12px; white-space: nowrap; }
    .notice { display: flex; gap: 12px; align-items: flex-start; background: rgba(var(--rgb-warning-color, 255, 166, 0), 0.14); max-width: 1168px; margin-left: auto; margin-right: auto; }
    .card {
      background: var(--card-background-color);
      border-radius: var(--ha-card-border-radius, 12px);
      border: 1px solid var(--divider-color);
      padding: 16px 20px;
      box-sizing: border-box;
    }
    h3 { margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--secondary-text-color); font-weight: 500; }
    h3:not(:first-child) { margin-top: 24px; }
    h4 { margin: 16px 0 4px; font-size: 14px; font-weight: 500; }
    .muted { color: var(--secondary-text-color); }
    .small { font-size: 12px; }
    .name { font-weight: 500; }
    .empty { color: var(--secondary-text-color); padding: 32px 12px; text-align: center; }
    .intro { color: var(--secondary-text-color); margin: 0 0 16px; max-width: 70ch; line-height: 1.5; }

    .live { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 16px; align-items: start; }
    .two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .side { display: grid; gap: 16px; }
    @media (max-width: 900px) {
      .live, .two { grid-template-columns: minmax(0, 1fr); }
      main { padding: 12px; }
    }
    .view { position: relative; aspect-ratio: 16 / 9; background: #000; border-radius: var(--ha-card-border-radius, 12px); overflow: hidden; }
    .view img { width: 100%; height: 100%; object-fit: contain; display: block; }
    .view.empty { display: flex; align-items: center; justify-content: center; color: #bbb; padding: 0; }
    .status { color: var(--secondary-text-color); padding: 8px 4px 0; min-height: 20px; }
    .toast {
      position: absolute;
      left: 50%;
      top: 16px;
      transform: translateX(-50%);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 999px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-weight: 500;
      animation: pop 160ms ease-out;
    }
    @keyframes pop { from { opacity: 0; transform: translate(-50%, -6px); } }
    @media (prefers-reduced-motion: reduce) { .toast { animation: none; } }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px 4px 8px; border-radius: 999px; background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.14); }
    .chip.animal { background: rgba(var(--rgb-warning-color, 255, 166, 0), 0.18); }
    .chip ha-icon { --mdc-icon-size: 18px; }
    .pan { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 8px; }
    .round {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: inherit;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .round:hover { border-color: var(--primary-color); color: var(--primary-color); }

    input {
      flex: 1;
      min-width: 0;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font: inherit;
    }
    input:focus-visible, button:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .inline { display: flex; gap: 8px; }
    .inline.wrap { flex-wrap: wrap; }
    .inline.wrap input { flex: 1 1 220px; }
    button {
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    button.primary { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    button.danger { color: var(--error-color, #db4437); }
    button:disabled { opacity: 0.5; cursor: default; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
    .answer { margin: 12px 0 0; padding: 10px 12px; border-radius: 8px; background: var(--primary-background-color); line-height: 1.5; }

    .gestures { display: grid; gap: 12px; }
    .gesture { padding: 0; transition: border-color 160ms; }
    .gesture.lit { border-color: var(--primary-color); box-shadow: 0 0 0 2px rgba(var(--rgb-primary-color, 3, 169, 244), 0.3); }
    .gesture.disabled .gicon { opacity: 0.4; }
    .ghead {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border: 0;
      background: none;
      text-align: left;
      border-radius: inherit;
    }
    .gicon {
      flex: none;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.14);
      color: var(--primary-color);
    }
    .gtext { flex: 1; min-width: 0; display: grid; gap: 2px; }
    .summary { font-size: 13px; }
    .when { font-size: 12px; white-space: nowrap; }
    .chev { color: var(--secondary-text-color); }
    .badge { font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 999px; margin-left: 6px; background: var(--divider-color); color: var(--secondary-text-color); vertical-align: 1px; }
    .badge.on { background: rgba(var(--rgb-success-color, 67, 160, 71), 0.18); color: var(--success-color, #43a047); }
    .teach-box { margin-bottom: 12px; padding: 12px; border-radius: 10px; background: var(--primary-background-color); }
    .teach-row { display: grid; grid-template-columns: minmax(0, 260px) minmax(0, 1fr); gap: 16px; align-items: start; }
    .teach-row-inline { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    @media (max-width: 600px) { .teach-row { grid-template-columns: minmax(0, 1fr); } }
    .editor { padding: 0 16px 16px; border-top: 1px solid var(--divider-color); padding-top: 12px; }
    code { font-size: 12px; background: var(--primary-background-color); padding: 1px 4px; border-radius: 4px; }

    .row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--divider-color); }
    .row:last-of-type { border-bottom: 0; }
    .row ha-icon { color: var(--secondary-text-color); --mdc-icon-size: 32px; }
    .grow { flex: 1; min-width: 0; }
    .steps { color: var(--secondary-text-color); padding-left: 20px; line-height: 1.7; margin: 12px 0 0; }
    .progress { height: 8px; border-radius: 4px; background: var(--divider-color); overflow: hidden; margin: 8px 0; }
    .progress div { height: 100%; background: var(--primary-color); transition: width 300ms; }
    .view.small { max-width: 100%; }

    .mood { display: inline-flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 500; padding: 10px 16px; border-radius: 12px; background: var(--primary-background-color); }
    .mood ha-icon { --mdc-icon-size: 28px; color: var(--secondary-text-color); }
    .mood.listening ha-icon { color: rgb(0, 120, 255); }
    .mood.thinking ha-icon { color: rgb(255, 150, 0); }
    .mood.speaking ha-icon { color: rgb(0, 200, 180); }
    .actions button ha-icon { --mdc-icon-size: 18px; vertical-align: -3px; }
    .teach { margin-bottom: 16px; }
    .teach p { margin: 0 0 12px; line-height: 1.5; }
    .items { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .item { display: grid; gap: 6px; align-content: start; }
    .item img, .item .noimg { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 8px; background: var(--primary-background-color); }
    .item .noimg { display: flex; align-items: center; justify-content: center; color: var(--secondary-text-color); }
    .item .seen { font-size: 13px; display: flex; gap: 4px; align-items: flex-start; }
    .item .seen ha-icon { --mdc-icon-size: 16px; flex: none; margin-top: 1px; }
    .item button { justify-self: start; margin-top: 4px; }
  `;
}

customElements.define("hubbubb-camera", HubbubbCamera);
