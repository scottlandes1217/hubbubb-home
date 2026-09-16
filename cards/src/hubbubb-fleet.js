/* Hubbubb Fleet — drop coding agents onto a project's features.

   A sidebar panel. Pick a project, see its features as nodes on a grid,
   drag an agent from the bay onto a node and a Claude session opens in that
   project with a brief for that area. Tap an agent to read what it has done,
   what it is doing, and to give it orders. Every agent in a project shares
   one fleet/<date> branch; the bar at the top commits and pushes all of it.

   All traffic is the companion's /fleet endpoint through hubbubb_home
   services, plus agent_transcript for the open agent. The pure parts are
   exported so test/fleet.mjs can assert them without a browser. */
import { LitElement, css, html, nothing } from "lit";

const BUILD =
  ((new Error().stack || "").match(/\/(\d+\.\d+\.\d+)\//) || [])[1] || "dev";
console.info(`hubbubb-fleet ${BUILD}`);

/* Agents grouped by feature id, in drop order. */
export const byFeature = (agents) => {
  const out = {};
  for (const a of agents || []) (out[a.feature] = out[a.feature] || []).push(a);
  return out;
};

/* "3m 12s" / "48s" for an elapsed number of seconds. */
export const fmtElapsed = (s) => {
  if (s == null) return "";
  const n = Math.max(0, Math.round(s));
  return n < 60 ? `${n}s` : `${Math.floor(n / 60)}m ${n % 60}s`;
};

/* One line of status for an agent chip. */
export const agentState = (a) => {
  if (!a.alive) return "offline";
  if (a.busy) return `working ${fmtElapsed(a.elapsed)}`;
  return a.edits && a.edits.length ? "idle · reported" : "idle";
};

/* The next callsign the companion will hand out is its business; the bay
   sprite only needs a label. Count of live agents, for the top bar. */
export const liveCount = (agents) => (agents || []).filter((a) => a.alive).length;

/* Transcript rows -> what the drawer shows: prompts, replies, tools. */
export const roleClass = (role) =>
  ({ user: "u", assistant: "a", tool: "t", out: "o", err: "e", think: "k", cmd: "c", screen: "s" }[role] || "o");

class HubbubbFleet extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    _projects: { state: true },
    _project: { state: true },
    _fleet: { state: true },
    _open: { state: true },
    _trans: { state: true },
    _drag: { state: true },
    _armed: { state: true },
    _hover: { state: true },
    _err: { state: true },
    _busy: { state: true },
    _ship: { state: true },
    _msg: { state: true },
    _order: { state: true },
    _deploying: { state: true },
    _shipNote: { state: true },
  };

  static styles = css`
    :host {
      --bg: #050912;
      --bg2: #0a1220;
      --line: rgba(0, 229, 255, 0.18);
      --cyan: #00e5ff;
      --mag: #ff2fd6;
      --amber: #ffb020;
      --green: #3dff9a;
      --red: #ff4d6d;
      --ink: #d8f4ff;
      --dim: #6f8ba3;
      --mono: "JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace;
      display: block;
      height: 100vh;
      height: 100dvh;
      color: var(--ink);
      font: 14px/1.4 var(--mono);
      background: radial-gradient(ellipse at 50% -20%, #0c2a44 0%, var(--bg) 55%);
      overflow: hidden;
      position: relative;
      user-select: none;
      -webkit-user-select: none;
      box-sizing: border-box;
    }
    :host::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image: linear-gradient(var(--line) 1px, transparent 1px),
        linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 44px 44px;
      mask-image: radial-gradient(ellipse at center, #000 30%, transparent 85%);
      -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 85%);
    }
    :host::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.18) 0 2px, transparent 2px 4px);
      z-index: 5;
      opacity: 0.6;
    }
    * { box-sizing: border-box; }
    button {
      font: inherit;
      color: var(--cyan);
      background: rgba(0, 229, 255, 0.06);
      border: 1px solid var(--line);
      padding: 6px 12px;
      cursor: pointer;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      font-size: 12px;
      transition: background 0.15s, box-shadow 0.15s;
    }
    button:hover { background: rgba(0, 229, 255, 0.14); box-shadow: 0 0 12px rgba(0, 229, 255, 0.25); }
    button:disabled { opacity: 0.4; cursor: default; box-shadow: none; }
    button.hot { color: var(--mag); border-color: rgba(255, 47, 214, 0.4); background: rgba(255, 47, 214, 0.08); }
    button.hot:hover { box-shadow: 0 0 12px rgba(255, 47, 214, 0.35); }
    button.go { color: #061a10; background: var(--green); border-color: var(--green); font-weight: 700; }
    button.go:hover { box-shadow: 0 0 16px rgba(61, 255, 154, 0.5); }
    input, textarea {
      font: inherit;
      color: var(--ink);
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid var(--line);
      padding: 8px 10px;
      width: 100%;
      outline: none;
    }
    input:focus, textarea:focus { border-color: var(--cyan); box-shadow: 0 0 8px rgba(0, 229, 255, 0.25); }
    .wrap { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; }

    /* top bar */
    .bar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      padding-top: calc(10px + env(safe-area-inset-top, 0px));
      border-bottom: 1px solid var(--line);
      background: rgba(5, 9, 18, 0.7);
      backdrop-filter: blur(6px);
      flex-wrap: wrap;
    }
    .bar .menu { display: flex; align-items: center; }
    .bar h1 {
      margin: 0;
      font-size: 15px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: var(--cyan);
      text-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
      white-space: nowrap;
    }
    .bar h1 small { color: var(--dim); letter-spacing: 0.1em; font-size: 11px; margin-left: 8px; }
    .bar .spacer { flex: 1; }
    .pill {
      padding: 4px 10px;
      border: 1px solid var(--line);
      font-size: 11px;
      letter-spacing: 0.08em;
      color: var(--dim);
      white-space: nowrap;
    }
    .pill b { color: var(--ink); font-weight: 600; }
    .pill.warn { border-color: rgba(255, 176, 32, 0.5); color: var(--amber); }
    .pill.warn b { color: var(--amber); }
    .err {
      color: var(--red);
      font-size: 12px;
      padding: 6px 16px;
      border-bottom: 1px solid rgba(255, 77, 109, 0.3);
      background: rgba(255, 77, 109, 0.08);
    }

    /* project picker */
    .projects {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
      padding: 24px 16px;
      align-content: start;
      overflow: auto;
    }
    .proj {
      border: 1px solid var(--line);
      background: linear-gradient(160deg, rgba(0, 229, 255, 0.07), rgba(0, 0, 0, 0.3));
      padding: 18px;
      cursor: pointer;
      position: relative;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .proj:hover { transform: translateY(-2px); box-shadow: 0 0 24px rgba(0, 229, 255, 0.25); border-color: var(--cyan); }
    .proj h2 { margin: 0 0 6px; font-size: 18px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--cyan); }
    .proj .path { color: var(--dim); font-size: 11px; word-break: break-all; }
    .proj .n { position: absolute; top: 10px; right: 12px; color: var(--green); font-size: 12px; }
    .proj::before { content: "▸"; position: absolute; right: 12px; bottom: 10px; color: var(--dim); }

    /* map */
    .stage { flex: 1; display: flex; min-height: 0; position: relative; }
    .left { flex: 1; display: flex; flex-direction: column; min-width: 0; min-height: 0; }
    .left[hidden] { display: none; }
    .map {
      flex: 1;
      overflow: auto;
      padding: 18px 16px 24px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
      gap: 14px;
      align-content: start;
    }
    .node {
      position: relative;
      min-height: 120px;
      padding: 12px 12px 34px;
      border: 1px solid var(--line);
      background: linear-gradient(180deg, rgba(10, 18, 32, 0.9), rgba(5, 9, 18, 0.9));
      clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
      transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s;
      cursor: pointer;
    }
    .node::after {
      content: "";
      position: absolute;
      left: 0; right: 0; top: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--cyan), transparent);
      opacity: 0.35;
    }
    .node.live { border-color: rgba(61, 255, 154, 0.45); }
    .node.live::after { background: linear-gradient(90deg, transparent, var(--green), transparent); opacity: 0.8; }
    .node.busy { animation: nodepulse 2.2s ease-in-out infinite; }
    .node.target { border-color: var(--mag); box-shadow: 0 0 0 2px rgba(255, 47, 214, 0.5), 0 0 30px rgba(255, 47, 214, 0.45); transform: scale(1.03); }
    .node.armed { border-color: rgba(255, 47, 214, 0.6); box-shadow: 0 0 16px rgba(255, 47, 214, 0.25); }
    @keyframes nodepulse {
      0%, 100% { box-shadow: 0 0 6px rgba(61, 255, 154, 0.15); }
      50% { box-shadow: 0 0 22px rgba(61, 255, 154, 0.45); }
    }
    .node h3 { margin: 0 0 4px; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink); }
    .node p { margin: 0; font-size: 11px; color: var(--dim); line-height: 1.35; }
    .crew { position: absolute; left: 10px; right: 10px; bottom: 8px; display: flex; gap: 6px; flex-wrap: wrap; }
    .bot {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 2px 7px 2px 4px;
      font-size: 10px;
      letter-spacing: 0.06em;
      border: 1px solid rgba(61, 255, 154, 0.4);
      background: rgba(61, 255, 154, 0.08);
      color: var(--green);
      cursor: pointer;
      text-transform: uppercase;
    }
    .bot:hover { background: rgba(61, 255, 154, 0.2); box-shadow: 0 0 10px rgba(61, 255, 154, 0.35); }
    .bot .eye { width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); }
    .bot.busy .eye { background: var(--amber); box-shadow: 0 0 8px var(--amber); animation: blink 0.9s ease-in-out infinite; }
    .bot.busy { border-color: rgba(255, 176, 32, 0.5); color: var(--amber); background: rgba(255, 176, 32, 0.08); }
    .bot.off { opacity: 0.45; border-style: dashed; }
    .bot .n { color: var(--ink); opacity: 0.7; }
    @keyframes blink { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }

    /* agent bay */
    .bay {
      flex: none;
      padding: 10px 16px;
      padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
      border-top: 1px solid var(--line);
      background: linear-gradient(0deg, rgba(5, 9, 18, 0.98), rgba(5, 9, 18, 0.8));
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .bay .label { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--dim); }
    .sprite {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 2px solid var(--mag);
      background: radial-gradient(circle at 35% 30%, #ff9de9, var(--mag) 45%, #4a0a3f 100%);
      box-shadow: 0 0 18px rgba(255, 47, 214, 0.6), inset 0 0 12px rgba(0, 0, 0, 0.5);
      cursor: grab;
      touch-action: none;
      display: grid;
      place-items: center;
      color: #fff;
      font-size: 20px;
      animation: hover 2.6s ease-in-out infinite;
      flex: none;
    }
    .sprite.armed { box-shadow: 0 0 0 4px rgba(255, 47, 214, 0.4), 0 0 30px rgba(255, 47, 214, 0.9); animation: none; }
    .sprite:active { cursor: grabbing; }
    @keyframes hover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    .ghost {
      position: fixed;
      width: 56px;
      height: 56px;
      margin: -28px 0 0 -28px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 30%, #ff9de9, var(--mag) 45%, #4a0a3f 100%);
      box-shadow: 0 0 24px rgba(255, 47, 214, 0.8);
      pointer-events: none;
      z-index: 50;
    }
    .bay .hint { font-size: 11px; color: var(--dim); line-height: 1.4; }
    .bay .hint b { color: var(--mag); }
    .bay .mission { flex: 1; min-width: 160px; }
    .bay .mission input { font-size: 12px; }
    .deploying { color: var(--mag); font-size: 12px; animation: blink 1s infinite; }

    /* agent drawer */
    .drawer {
      width: min(520px, 100%);
      border-left: 1px solid var(--line);
      background: rgba(5, 9, 18, 0.96);
      display: flex;
      flex-direction: column;
      min-height: 0;
      z-index: 4;
    }
    .drawer.full { position: absolute; inset: 0; width: 100%; }
    .drawer .head { padding: 12px 14px; border-bottom: 1px solid var(--line); display: flex; align-items: center; gap: 10px; }
    .drawer .head h2 { margin: 0; font-size: 15px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--green); text-shadow: 0 0 10px rgba(61, 255, 154, 0.5); }
    .drawer .head .sub { font-size: 11px; color: var(--dim); }
    .drawer .head .x { margin-left: auto; }
    .stat { display: flex; gap: 8px; padding: 8px 14px; flex-wrap: wrap; border-bottom: 1px solid var(--line); }
    .sec { padding: 10px 14px; border-bottom: 1px solid var(--line); }
    .sec h4 { margin: 0 0 6px; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--dim); }
    .sec ul { margin: 0; padding: 0; list-style: none; font-size: 12px; }
    .sec li { padding: 2px 0; color: var(--ink); word-break: break-all; }
    .sec li::before { content: "◆ "; color: var(--green); }
    .sec .now { color: var(--amber); font-size: 12px; }
    .sec .mission { color: var(--dim); font-size: 11px; white-space: pre-wrap; }
    .log { flex: 1; overflow: auto; padding: 8px 14px; font-size: 12px; min-height: 120px; }
    .row { margin: 0 0 8px; white-space: pre-wrap; word-break: break-word; padding-left: 10px; border-left: 2px solid transparent; }
    .row.u { border-color: var(--mag); color: var(--ink); }
    .row.a { border-color: var(--green); }
    .row.t { border-color: var(--cyan); color: var(--cyan); opacity: 0.85; font-size: 11px; }
    .row.o, .row.s { color: var(--dim); font-size: 11px; max-height: 120px; overflow: hidden; }
    .row.e { color: var(--red); font-size: 11px; }
    .row.k { color: var(--dim); font-style: italic; font-size: 11px; }
    .row.c { color: var(--amber); font-size: 11px; }
    .orders { padding: 10px 14px; padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px)); border-top: 1px solid var(--line); display: flex; gap: 8px; flex-wrap: wrap; }
    .orders textarea { flex: 1 1 200px; min-height: 44px; resize: vertical; }

    /* ship panel */
    .shipbox {
      position: absolute;
      top: 0; right: 0;
      width: min(420px, 100%);
      max-height: 100%;
      overflow: auto;
      background: rgba(5, 9, 18, 0.97);
      border-left: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
      padding: 14px;
      z-index: 6;
    }
    .shipbox h3 { margin: 0 0 8px; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--cyan); }
    .shipbox .files { font-size: 11px; color: var(--dim); max-height: 200px; overflow: auto; margin: 8px 0; }
    .shipbox .files div::before { content: "± "; color: var(--amber); }
    .shipbox .btns { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
    .shipbox .ok { color: var(--green); font-size: 12px; margin-top: 8px; }
    .empty { color: var(--dim); font-size: 12px; padding: 24px; text-align: center; }
  `;

  constructor() {
    super();
    this._projects = null;
    this._project = null;
    this._fleet = null;
    this._open = null;
    this._trans = null;
    this._drag = null;
    this._armed = false;
    this._hover = null;
    this._err = "";
    this._busy = false;
    this._ship = false;
    this._msg = "";
    this._order = "";
    this._mission = "";
    this._deploying = null;
    this._have = 0;
    this._shipNote = "";
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadProjects();
    this._timer = setInterval(() => this._tick(), 3000);
    this._ttimer = setInterval(() => this._pollTranscript(), 2000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
    clearInterval(this._ttimer);
  }

  /* All companion traffic rides through hubbubb_home services, the same as
     the ring card: no CORS, and the token stays on the HA box. */
  async _api(service, data = {}) {
    const res = await this.hass.callWS({
      type: "call_service",
      domain: "hubbubb_home",
      service,
      service_data: data,
      return_response: true,
    });
    let content = res?.response?.content;
    if (typeof content === "string") {
      try { content = JSON.parse(content); } catch { /* keep */ }
    }
    const status = res?.response?.status ?? 0;
    if (status < 200 || status >= 300 || content?.ok === false) {
      throw new Error(content?.detail || content?.error || `HTTP ${status}`);
    }
    return content || {};
  }

  async _try(fn) {
    this._err = "";
    try {
      return await fn();
    } catch (e) {
      this._err = e?.message || String(e);
      return undefined;
    }
  }

  async _loadProjects() {
    const res = await this._try(() => this._api("agent_fleet"));
    if (res) this._projects = res.projects || [];
  }

  async _tick() {
    if (!this.hass) return;
    if (this._project) {
      if (this._polling) return;
      this._polling = true;
      try {
        const res = await this._api("agent_fleet", { project: this._project });
        this._fleet = res;
        if (this._err.startsWith("companion")) this._err = "";
      } catch (e) {
        this._err = e?.message || String(e);
      } finally {
        this._polling = false;
      }
    } else {
      this._loadProjects();
    }
  }

  async _pollTranscript() {
    if (!this._open || !this.hass || this._tpolling) return;
    this._tpolling = true;
    try {
      const res = await this._api("agent_transcript", { id: this._open, have: String(this._have) });
      if (res.messages) {
        this._trans = { messages: res.messages, activity: res.activity, ask: res.ask };
        this._have = res.bytes || 0;
        this.updateComplete.then(() => {
          const log = this.shadowRoot?.querySelector(".log");
          if (log) log.scrollTop = log.scrollHeight;
        });
      } else if (this._trans) {
        this._trans = { ...this._trans, activity: res.activity, ask: res.ask };
      }
    } catch (e) {
      /* the session may be gone; the fleet poll shows that */
    } finally {
      this._tpolling = false;
    }
  }

  _enter(name) {
    this._project = name;
    this._fleet = null;
    this._open = null;
    this._ship = false;
    this._tick();
  }

  _leave() {
    this._project = null;
    this._fleet = null;
    this._open = null;
    this._loadProjects();
  }

  _openAgent(id) {
    this._open = id;
    this._trans = null;
    this._have = 0;
    this._order = "";
    this._pollTranscript();
  }

  /* --- deploying ---------------------------------------------------- */

  async _deploy(featureId) {
    if (this._deploying) return;
    this._armed = false;
    this._deploying = featureId;
    const mission = (this._mission || "").trim();
    const res = await this._try(() =>
      this._api("agent_fleet_act", {
        action: "drop",
        project: this._project,
        feature: featureId,
        ...(mission ? { mission } : {}),
      })
    );
    this._deploying = null;
    if (res) {
      this._mission = "";
      const input = this.shadowRoot?.querySelector(".mission input");
      if (input) input.value = "";
      await this._tick();
      if (res.agent?.id) this._openAgent(res.agent.id);
    }
  }

  _nodeAt(x, y) {
    const el = this.shadowRoot?.elementFromPoint(x, y);
    return el ? el.closest(".node") : null;
  }

  _dragStart(e) {
    if (this._deploying) return;
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* no live pointer */ }
    this._drag = { x: e.clientX, y: e.clientY, moved: false };
  }

  _dragMove(e) {
    if (!this._drag) return;
    const moved = this._drag.moved || Math.hypot(e.clientX - this._drag.x, e.clientY - this._drag.y) > 6;
    this._drag = { x: e.clientX, y: e.clientY, moved };
    const node = moved ? this._nodeAt(e.clientX, e.clientY) : null;
    this._hover = node ? node.dataset.id : null;
  }

  _dragEnd(e) {
    if (!this._drag) return;
    const { moved } = this._drag;
    const node = moved ? this._nodeAt(e.clientX, e.clientY) : null;
    this._drag = null;
    this._hover = null;
    if (node) this._deploy(node.dataset.id);
    // A tap (no drag) arms the sprite: the next node tapped gets the agent.
    else if (!moved) this._armed = !this._armed;
  }

  _nodeTap(f) {
    if (this._armed) this._deploy(f.id);
  }

  /* --- orders ------------------------------------------------------- */

  async _sendOrder() {
    const text = (this._order || "").trim();
    if (!text || !this._open) return;
    this._busy = true;
    const res = await this._try(() =>
      this._api("agent_fleet_act", { action: "task", id: this._open, text })
    );
    this._busy = false;
    if (res) {
      this._order = "";
      const box = this.shadowRoot?.querySelector(".orders textarea");
      if (box) box.value = "";
      this._pollTranscript();
    }
  }

  async _answer(key) {
    await this._try(() => this._api("agent_key", { id: this._open, key }));
    this._pollTranscript();
  }

  async _recall() {
    if (!this._open) return;
    this._busy = true;
    await this._try(() => this._api("agent_fleet_act", { action: "recall", id: this._open }));
    this._busy = false;
    this._open = null;
    this._tick();
  }

  /* --- shipping ----------------------------------------------------- */

  async _commit(push) {
    const message = (this._msg || "").trim();
    if (!message) {
      this._err = "a commit needs a message";
      return;
    }
    this._busy = true;
    this._shipNote = "";
    const res = await this._try(() =>
      this._api("agent_fleet_act", { action: "commit", project: this._project, message })
    );
    if (res) {
      this._shipNote = res.detail || "committed";
      this._msg = "";
      const input = this.shadowRoot?.querySelector(".shipbox input");
      if (input) input.value = "";
      if (push) await this._push();
    }
    this._busy = false;
    this._tick();
  }

  async _push() {
    this._busy = true;
    const res = await this._try(() => this._api("agent_fleet_act", { action: "push", project: this._project }));
    if (res) this._shipNote = res.detail || "pushed";
    this._busy = false;
    this._tick();
  }

  /* --- render ------------------------------------------------------- */

  render() {
    const f = this._fleet;
    const git = f?.git || {};
    return html`
      <div class="wrap">
        <div class="bar">
          ${this.narrow
            ? html`<div class="menu"><ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button></div>`
            : nothing}
          <h1>
            Fleet
            ${this._project ? html`<small>/ ${this._project}</small>` : nothing}
          </h1>
          ${this._project
            ? html`
                <button @click=${this._leave}>◂ Projects</button>
                <span class="spacer"></span>
                <span class="pill">agents <b>${liveCount(f?.agents)}</b></span>
                <span class="pill">branch <b>${git.branch || "…"}</b></span>
                <span class="pill ${git.changed ? "warn" : ""}">
                  changed <b>${git.changed ?? "…"}</b>${git.ahead ? html` · ahead <b>${git.ahead}</b>` : nothing}
                </span>
                <button class=${git.changed ? "go" : ""} @click=${() => (this._ship = !this._ship)}>
                  ${this._ship ? "Close" : "Ship"}
                </button>
              `
            : html`<span class="spacer"></span><span class="pill">${BUILD}</span>`}
        </div>
        ${this._err ? html`<div class="err">${this._err}</div>` : nothing}
        ${this._project ? this._renderStage(f) : this._renderProjects()}
      </div>
      ${this._drag && this._drag.moved
        ? html`<div class="ghost" style="left:${this._drag.x}px;top:${this._drag.y}px"></div>`
        : nothing}
    `;
  }

  _renderProjects() {
    if (!this._projects) return html`<div class="empty">scanning…</div>`;
    if (!this._projects.length) return html`<div class="empty">no git projects in the voice allowlist</div>`;
    return html`<div class="projects">
      ${this._projects.map(
        (p) => html`
          <div class="proj" @click=${() => this._enter(p.name)}>
            <h2>${p.name}</h2>
            <div class="path">${p.path.replace(/^\/Users\/[^/]+/, "~")}</div>
            ${p.agents ? html`<div class="n">● ${p.agents} live</div>` : nothing}
          </div>
        `
      )}
    </div>`;
  }

  _renderStage(f) {
    const crews = byFeature(f?.agents);
    const open = f?.agents?.find((a) => a.id === this._open);
    const showDrawer = !!this._open;
    return html`
      <div class="stage">
        <div class="left" ?hidden=${showDrawer && this.narrow}>
          <div class="map">
            ${!f
              ? html`<div class="empty">mapping ${this._project}…</div>`
              : f.features.map((feat) => this._renderNode(feat, crews[feat.id] || []))}
          </div>
          ${this._renderBay()}
        </div>
        ${showDrawer
          ? html`<div class="drawer ${this.narrow ? "full" : ""}">${this._renderDrawer(open)}</div>`
          : nothing}
        ${this._ship ? this._renderShip(f?.git || {}) : nothing}
      </div>
    `;
  }

  _renderNode(feat, crew) {
    const busy = crew.some((a) => a.busy);
    const cls = [
      "node",
      crew.length ? "live" : "",
      busy ? "busy" : "",
      this._hover === feat.id || this._deploying === feat.id ? "target" : "",
      this._armed ? "armed" : "",
    ].join(" ");
    return html`
      <div class=${cls} data-id=${feat.id} @click=${() => this._nodeTap(feat)}>
        <h3>${feat.name}</h3>
        <p>${this._deploying === feat.id ? html`<span class="deploying">deploying…</span>` : feat.blurb}</p>
        <div class="crew">
          ${crew.map(
            (a) => html`
              <span
                class="bot ${a.busy ? "busy" : ""} ${a.alive ? "" : "off"}"
                title=${agentState(a)}
                @click=${(e) => { e.stopPropagation(); this._openAgent(a.id); }}
              >
                <span class="eye"></span>${a.callsign}
                ${a.edits?.length ? html`<span class="n">${a.edits.length}</span>` : nothing}
              </span>
            `
          )}
        </div>
      </div>
    `;
  }

  _renderBay() {
    return html`
      <div class="bay">
        <div class="label">Agent<br />bay</div>
        <div
          class="sprite ${this._armed ? "armed" : ""}"
          @pointerdown=${this._dragStart}
          @pointermove=${this._dragMove}
          @pointerup=${this._dragEnd}
          @pointercancel=${() => { this._drag = null; this._hover = null; }}
        >
          ⬢
        </div>
        <div class="hint">
          ${this._deploying
            ? html`<span class="deploying">opening a session…</span>`
            : this._armed
              ? html`<b>armed</b> — tap a feature to deploy`
              : html`<b>drag</b> onto a feature to deploy an agent<br />default mission: hunt bugs, suggest features`}
        </div>
        <label class="mission">
          <input
            placeholder="custom mission (optional)"
            .value=${this._mission || ""}
            @input=${(e) => (this._mission = e.target.value)}
          />
        </label>
      </div>
    `;
  }

  _renderDrawer(a) {
    if (!a) return html`<div class="head"><h2>signal lost</h2><button class="x" @click=${() => (this._open = null)}>✕</button></div>`;
    const feat = this._fleet?.features.find((f) => f.id === a.feature);
    const t = this._trans;
    const now = a.busy ? t?.activity || `working for ${fmtElapsed(a.elapsed)}` : a.alive ? "idle — awaiting orders" : "offline";
    return html`
      <div class="head">
        <h2>${a.callsign}</h2>
        <div class="sub">${feat?.name || a.feature}<br />${a.id}</div>
        <button class="x" @click=${() => (this._open = null)}>✕</button>
      </div>
      <div class="stat">
        <span class="pill ${a.busy ? "warn" : ""}">${agentState(a)}</span>
        <span class="pill">edits <b>${a.edits?.length || 0}</b></span>
        <button class="hot" ?disabled=${this._busy} @click=${this._recall}>Recall</button>
      </div>
      <div class="sec">
        <h4>Working on</h4>
        <div class="now">${now}</div>
      </div>
      <div class="sec">
        <h4>Done · files touched</h4>
        ${a.edits?.length ? html`<ul>${a.edits.map((f) => html`<li>${f}</li>`)}</ul>` : html`<div class="mission">nothing written yet</div>`}
      </div>
      <div class="sec">
        <h4>Mission</h4>
        <div class="mission">${a.mission}</div>
      </div>
      <div class="log">
        ${!t
          ? html`<div class="empty">reading transcript…</div>`
          : t.messages.map((m) => html`<div class="row ${roleClass(m.role)}">${m.text}</div>`)}
        ${t?.ask?.options?.length
          ? html`<div class="orders" style="border:0;padding:0">
              ${t.ask.options.map((o) => html`<button @click=${() => this._answer(String(o.key))}>${o.key} · ${o.label}</button>`)}
            </div>`
          : nothing}
      </div>
      <div class="orders">
        <textarea
          placeholder="orders for ${a.callsign}…"
          .value=${this._order}
          @input=${(e) => (this._order = e.target.value)}
          @keydown=${(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); this._sendOrder(); } }}
        ></textarea>
        <button class="go" ?disabled=${this._busy || !(this._order || "").trim()} @click=${this._sendOrder}>Send</button>
      </div>
    `;
  }

  _renderShip(git) {
    return html`
      <div class="shipbox">
        <h3>Ship · ${git.branch || "?"}</h3>
        ${git.error ? html`<div class="err">${git.error}</div>` : nothing}
        <div class="mission">${git.last_commit || ""}</div>
        <div class="files">
          ${git.files?.length ? git.files.map((f) => html`<div>${f}</div>`) : html`<div style="opacity:.6">working tree clean</div>`}
        </div>
        <input
          placeholder="commit message"
          .value=${this._msg}
          @input=${(e) => (this._msg = e.target.value)}
          @keydown=${(e) => { if (e.key === "Enter") this._commit(false); }}
        />
        <div class="btns">
          <button ?disabled=${this._busy || !git.changed} @click=${() => this._commit(false)}>Commit</button>
          <button class="go" ?disabled=${this._busy || !git.changed} @click=${() => this._commit(true)}>Commit &amp; push</button>
          <button ?disabled=${this._busy || !git.ahead} @click=${this._push}>Push${git.ahead ? ` (${git.ahead})` : ""}</button>
        </div>
        ${this._shipNote ? html`<div class="ok">${this._shipNote}</div>` : nothing}
      </div>
    `;
  }
}

customElements.define("hubbubb-fleet", HubbubbFleet);
