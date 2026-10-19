/* Hubbubb calendar — every calendar.* entity in one view, for the ring card's
   Calendar pop-up.

   Built because the core Calendar panel has no "now": this one draws a line
   at the current minute, scrolls to it, and says what is on now and what is
   next, so a glance answers "what's my next meeting". Day, week and month.
   Reads the core REST endpoint /api/calendars/<entity>, so it needs nothing
   from the integration. Its own shadow root, so the ring card's styles stay
   out; the accent comes in through --jr-color. The pure parts are exported
   for test/calendar.mjs. */
import { LitElement, css, html, nothing } from "lit";

const HOUR_PX = 52;
// bright enough to read on the pop-up's near-black glass
const COLORS = ["#38b6ff", "#ff9f43", "#2ed3a0", "#c77dff", "#ffd166", "#4dd6e0", "#ff6b8b"];

const dayStart = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/* "2026-10-19" is a local date, not UTC midnight (which new Date() would make it). */
const parseWhen = (w) => {
  if (w.dateTime) return new Date(w.dateTime);
  const [y, m, d] = w.date.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/* A REST event -> {title, start, end, allDay, location, description, cal}. */
export const parseEvent = (e, cal) => ({
  title: e.summary || "(no title)",
  start: parseWhen(e.start),
  end: parseWhen(e.end),
  allDay: !e.start.dateTime,
  location: e.location || "",
  description: e.description || "",
  cal,
});

/* The days a view covers: [from, to). Weeks start on Sunday; a month is the
   six whole weeks around it, so the grid never changes height. */
export const viewRange = (view, anchor) => {
  const a = dayStart(anchor);
  if (view === "day") return [a, addDays(a, 1)];
  if (view === "week") {
    const from = addDays(a, -a.getDay());
    return [from, addDays(from, 7)];
  }
  const first = new Date(a.getFullYear(), a.getMonth(), 1);
  const from = addDays(first, -first.getDay());
  return [from, addDays(from, 42)];
};

/* One page back or forward. */
export const step = (view, anchor, dir) =>
  view === "month"
    ? new Date(anchor.getFullYear(), anchor.getMonth() + dir, 1)
    : addDays(anchor, dir * (view === "week" ? 7 : 1));

/* Side-by-side lanes for one day's timed events: each gets lane and lanes,
   where lanes is the width of the overlapping cluster it belongs to. */
export const layoutDay = (events) => {
  const sorted = events.slice().sort((a, b) => a.start - b.start || b.end - a.end);
  const out = [];
  let cluster = [];
  let laneEnds = [];
  let clusterEnd = 0;
  const close = () => {
    for (const c of cluster) c.lanes = laneEnds.length;
    cluster = [];
    laneEnds = [];
  };
  for (const e of sorted) {
    if (cluster.length && e.start >= clusterEnd) close();
    let lane = laneEnds.findIndex((end) => end <= e.start);
    if (lane < 0) lane = laneEnds.length;
    laneEnds[lane] = e.end;
    clusterEnd = cluster.length ? Math.max(clusterEnd, +e.end) : +e.end;
    const placed = { ...e, lane, lanes: 1 };
    cluster.push(placed);
    out.push(placed);
  }
  close();
  return out;
};

/* What is on right now, and the next timed event to start after now. */
export const nowNext = (events, now) => {
  const timed = events.filter((e) => !e.allDay).sort((a, b) => a.start - b.start);
  return {
    current: timed.filter((e) => e.start <= now && e.end > now),
    next: timed.find((e) => e.start > now) || null,
  };
};

/* 95 min -> "1 h 35 min"; 0 -> "now". */
export const until = (ms) => {
  const m = Math.max(0, Math.round(ms / 60000));
  if (!m) return "now";
  const h = Math.floor(m / 60);
  return h ? `${h} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`;
};

const fmtTime = (d) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
// hex + alpha: color-mix() is newer than the wall tablet's browser
const tint = (c) => `--c:${c};--cb:${c}2e`;
const onDay = (e, d) => e.start < addDays(d, 1) && e.end > d;

const store = {
  get(k, dflt) {
    try { return JSON.parse(localStorage.getItem(k)) ?? dflt; } catch (_) { return dflt; }
  },
  set(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) { /* private mode */ }
  },
};

class HubbubbCalendar extends LitElement {
  static properties = {
    hass: { attribute: false },
    _events: { state: true },
    _now: { state: true },
    _view: { state: true },
    _anchor: { state: true },
    _hidden: { state: true },
    _sel: { state: true },
    _err: { state: true },
  };

  constructor() {
    super();
    this._events = [];
    this._now = new Date();
    this._view = store.get("hubbubb-calendar-view", window.innerWidth < 700 ? "day" : "week");
    this._anchor = dayStart(this._now);
    this._hidden = store.get("hubbubb-calendar-hidden", []);
    this._sel = null;
    this._err = "";
  }

  /* Every opening starts on today, scrolled to now: that is the glance. */
  connectedCallback() {
    super.connectedCallback();
    this._now = new Date();
    this._anchor = dayStart(this._now);
    this._sel = null;
    this._tick = setInterval(() => {
      const before = this._now;
      this._now = new Date();
      if (dayStart(before) - dayStart(this._now)) this._load(); // midnight rolled
    }, 30000);
    this._poll = setInterval(() => this._load(), 5 * 60000);
    if (this.hasUpdated) this._load(true); // reopened; the first load waits for hass
  }

  // connected before anyone handed it hass: load the moment it arrives
  willUpdate(changed) {
    if (changed.has("hass") && !changed.get("hass") && this.hass) this._load(true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._tick);
    clearInterval(this._poll);
  }

  _calendars() {
    return Object.keys(this.hass?.states || {})
      .filter((id) => id.startsWith("calendar."))
      .sort()
      .map((id, i) => ({
        id,
        name: this.hass.states[id].attributes.friendly_name || id,
        color: COLORS[i % COLORS.length],
      }));
  }

  async _load(scrollToNow = false) {
    if (!this.hass) return;
    const [from, to] = viewRange(this._view, this._anchor);
    const q = `start=${encodeURIComponent(from.toISOString())}&end=${encodeURIComponent(to.toISOString())}`;
    const seq = (this._seq = (this._seq || 0) + 1);
    const results = await Promise.allSettled(
      this._calendars().map((cal) =>
        this.hass.callApi("GET", `calendars/${cal.id}?${q}`).then((rows) => rows.map((e) => parseEvent(e, cal)))
      )
    );
    if (seq !== this._seq) return; // a newer load (paging, view switch) already started
    const failed = results.filter((r) => r.status === "rejected").length;
    this._err = failed ? `${failed} calendar${failed > 1 ? "s" : ""} failed to load` : "";
    this._events = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
    if (scrollToNow) {
      await this.updateComplete;
      const grid = this.renderRoot.querySelector(".scroll");
      const n = this._now;
      const y = this._view === "month" ? 0 : (n.getHours() + n.getMinutes() / 60 - 1.5) * HOUR_PX;
      if (grid) grid.scrollTop = Math.max(0, y);
    }
  }

  _go(view, anchor) {
    if (view !== this._view) store.set("hubbubb-calendar-view", view);
    this._view = view;
    this._anchor = anchor;
    this._events = [];
    this._load(true);
  }

  _toggle(id) {
    this._hidden = this._hidden.includes(id) ? this._hidden.filter((h) => h !== id) : [...this._hidden, id];
    store.set("hubbubb-calendar-hidden", this._hidden);
  }

  _title() {
    const a = this._anchor;
    if (this._view === "month") return a.toLocaleDateString([], { month: "long", year: "numeric" });
    if (this._view === "day") return a.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
    const [from, to] = viewRange("week", a);
    const last = addDays(to, -1);
    const f = (d, o) => d.toLocaleDateString([], o);
    return from.getMonth() === last.getMonth()
      ? `${f(from, { month: "long" })} ${from.getDate()} – ${last.getDate()}`
      : `${f(from, { month: "short", day: "numeric" })} – ${f(last, { month: "short", day: "numeric" })}`;
  }

  render() {
    const now = this._now;
    const cals = this._calendars();
    const shown = this._events.filter((e) => !this._hidden.includes(e.cal.id));
    const [from, to] = viewRange(this._view, this._anchor);
    const hasToday = now >= from && now < to;
    // a page without today on it answers nothing, rather than "next in 9 days"
    const { current, next } = hasToday ? nowNext(shown, now) : { current: [], next: null };

    return html`
      <div class="top">
        <div class="clock">
          <div class="time">${fmtTime(now)}</div>
          <div class="date">${now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</div>
        </div>
        <div class="glance">
          ${current.map(
            (e) => html`<button class="now" style=${tint(e.cal.color)} @click=${() => (this._sel = e)}>
              <b>Now</b> ${e.title} <span>· ends in ${until(e.end - now)}</span>
            </button>`
          )}
          ${next
            ? html`<button class="next" style=${tint(next.cal.color)} @click=${() => (this._sel = next)}>
                <b>Next in ${until(next.start - now)}</b> ${next.title} <span>· ${fmtTime(next.start)}</span>
              </button>`
            : current.length || !hasToday
              ? nothing
              : html`<div class="free">Nothing else on today</div>`}
        </div>
      </div>

      <div class="tools">
        <div class="seg">
          ${["day", "week", "month"].map(
            (v) => html`<button class=${this._view === v ? "on" : ""} @click=${() => this._go(v, this._anchor)}>
              ${v[0].toUpperCase() + v.slice(1)}
            </button>`
          )}
        </div>
        <span class="navs">
          <button class="nav" aria-label="Previous" @click=${() => this._go(this._view, step(this._view, this._anchor, -1))}>‹</button>
          <button class="nav ${hasToday ? "dim" : ""}" @click=${() => this._go(this._view, dayStart(new Date()))}>Today</button>
          <button class="nav" aria-label="Next" @click=${() => this._go(this._view, step(this._view, this._anchor, 1))}>›</button>
        </span>
        <span class="title">${this._title()}</span>
        ${this._err ? html`<span class="err">${this._err}</span>` : nothing}
      </div>
      <div class="chips">
        ${cals.map(
          (c) => html`<button class="chip ${this._hidden.includes(c.id) ? "off" : ""}" style=${tint(c.color)} @click=${() => this._toggle(c.id)}>
            ${c.name}
          </button>`
        )}
      </div>

      ${this._view === "month" ? this._month(from, shown, now) : this._grid(from, to, shown, now)}
      ${this._sel ? this._detail(this._sel) : nothing}
    `;
  }

  _grid(from, to, shown, now) {
    const days = [];
    for (let d = from; d < to; d = addDays(d, 1)) days.push(d);
    const today = +dayStart(now);
    const nowY = (now.getHours() + now.getMinutes() / 60) * HOUR_PX;
    return html`<div class="scroll">
      <div class="heads" style="--days:${days.length}">
        <div></div>
        ${days.map(
          (d) => html`<div class="head ${+d === today ? "today" : ""}">
            <div class="dname">${d.toLocaleDateString([], { weekday: "short" })} <span>${d.getDate()}</span></div>
            ${shown
              .filter((e) => e.allDay && onDay(e, d))
              .map((e) => html`<button class="allday" style=${tint(e.cal.color)} @click=${() => (this._sel = e)}>${e.title}</button>`)}
          </div>`
        )}
      </div>
      <div class="grid" style="--days:${days.length}; height:${24 * HOUR_PX}px">
        <div class="gutter">
          ${Array.from({ length: 23 }, (_, h) => html`<div class="hour" style="top:${(h + 1) * HOUR_PX}px">
            ${new Date(2000, 0, 1, h + 1).toLocaleTimeString([], { hour: "numeric" })}
          </div>`)}
        </div>
        ${days.map((d) => this._column(d, shown, now, +d === today ? nowY : null))}
      </div>
    </div>`;
  }

  _column(d, shown, now, nowY) {
    const end = addDays(d, 1);
    const timed = layoutDay(shown.filter((e) => !e.allDay && onDay(e, d)));
    return html`<div class="col ${nowY == null ? "" : "today"}">
      ${timed.map((e) => {
        // clipped to this day, so a late-night event shows on both sides of midnight
        const s = Math.max(e.start, d);
        const f = Math.min(e.end, end);
        const top = ((s - d) / 3600000) * HOUR_PX;
        const h = Math.max(((f - s) / 3600000) * HOUR_PX, 20);
        return html`<button
          class="ev ${e.end <= now ? "past" : ""} ${e.start <= now && e.end > now ? "live" : ""}"
          style="${tint(e.cal.color)}; top:${top}px; height:${h - 2}px;
                 left:calc(${(e.lane / e.lanes) * 100}% + 2px); width:calc(${100 / e.lanes}% - 4px)"
          @click=${() => (this._sel = e)}
        >
          <div class="t">${e.title}</div>
          ${h > 34 ? html`<div class="w">${fmtTime(e.start)} – ${fmtTime(e.end)}</div>` : nothing}
        </button>`;
      })}
      ${nowY == null ? nothing : html`<div class="nowline" style="top:${nowY}px"></div>`}
    </div>`;
  }

  _month(from, shown, now) {
    const today = +dayStart(now);
    const month = this._anchor.getMonth();
    const cells = Array.from({ length: 42 }, (_, i) => addDays(from, i));
    return html`<div class="scroll">
      <div class="mhead">
        ${cells.slice(0, 7).map((d) => html`<div>${d.toLocaleDateString([], { weekday: "short" })}</div>`)}
      </div>
      <div class="month">
        ${cells.map((d) => {
          const evs = shown
            .filter((e) => onDay(e, d))
            .sort((a, b) => b.allDay - a.allDay || a.start - b.start);
          return html`<div
            class="cell ${d.getMonth() === month ? "" : "out"} ${+d === today ? "today" : ""}"
            @click=${() => this._go("day", d)}
          >
            <div class="num">${d.getDate()}</div>
            ${evs.slice(0, 3).map(
              (e) => html`<div class="pill ${e.allDay ? "all" : ""} ${e.end <= now ? "past" : ""}" style=${tint(e.cal.color)}>
                ${e.allDay ? "" : html`<i>${fmtTime(e.start)}</i>`}${e.title}
              </div>`
            )}
            ${evs.length > 3 ? html`<div class="more">+${evs.length - 3} more</div>` : nothing}
          </div>`;
        })}
      </div>
    </div>`;
  }

  _detail(e) {
    const when = e.allDay
      ? e.start.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })
      : `${e.start.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}, ${fmtTime(e.start)} – ${fmtTime(e.end)}`;
    return html`<div class="scrim" @click=${(ev) => ev.target === ev.currentTarget && (this._sel = null)}>
      <div class="sheet" style=${tint(e.cal.color)}>
        <div class="stitle">${e.title}</div>
        <div class="srow">${when}</div>
        ${e.location ? html`<div class="srow">${e.location}</div>` : nothing}
        <div class="srow cal">${e.cal.name}</div>
        ${e.description ? html`<div class="desc">${e.description}</div>` : nothing}
        <button @click=${() => (this._sel = null)}>Close</button>
      </div>
    </div>`;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 0;
      height: 100%;
      color: #d6eef2;
      font-family: "Avenir Next", "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      --acc: var(--jr-color, #2e9df5);
      --line: rgba(255, 255, 255, 0.08);
      --red: #ff4d5e;
      position: relative;
    }
    button {
      font: inherit;
      color: inherit;
      cursor: pointer;
      text-align: left;
    }
    .top {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 4px 14px 10px;
      flex-wrap: wrap;
    }
    .clock .time {
      font-size: 38px;
      font-weight: 300;
      line-height: 1;
      font-variant-numeric: tabular-nums;
      color: var(--acc);
      text-shadow: 0 0 14px var(--acc);
    }
    .clock .date { font-size: 12px; opacity: 0.65; margin-top: 4px; letter-spacing: 0.04em; }
    .glance { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 220px; }
    .glance > * {
      border: 1px solid var(--line);
      border-left: 3px solid var(--c, var(--line));
      background: var(--cb, transparent);
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 15px;
    }
    .glance span { opacity: 0.65; }
    .glance .now b { color: var(--red); }
    .glance .next b { color: var(--acc); }
    .glance .free { opacity: 0.6; }
    .tools {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 14px 8px;
      flex-wrap: wrap;
    }
    .seg { display: flex; border: 1px solid var(--line); border-radius: 18px; overflow: hidden; margin-right: 6px; }
    .seg button, .nav {
      background: none;
      border: none;
      padding: 6px 14px;
      min-height: 36px;
    }
    .seg button.on {
      background: rgba(255, 255, 255, 0.06);
      color: var(--acc);
      box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.05);
    }
    .nav { border: 1px solid var(--line); border-radius: 18px; }
    /* back / today / forward never split across lines */
    .navs { display: flex; gap: 6px; flex: none; }
    .nav.dim { opacity: 0.45; }
    .title { margin-left: 6px; font-weight: 600; letter-spacing: 0.04em; color: var(--acc); }
    .err { color: var(--red); font-size: 12px; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; padding: 0 14px 8px; }
    .chip {
      border: 1px solid var(--c);
      background: var(--cb);
      border-radius: 14px;
      padding: 2px 10px;
      font-size: 12px;
    }
    .chip.off { background: none; opacity: 0.4; text-decoration: line-through; }
    .scroll {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      border-top: 1px solid var(--line);
    }
    .heads, .grid { display: grid; grid-template-columns: 46px repeat(var(--days), minmax(0, 1fr)); }
    /* sticky inside the scroller, so the columns line up with or without a scrollbar */
    .heads {
      position: sticky;
      top: 0;
      z-index: 4;
      background: #061014;
      border-bottom: 1px solid var(--line);
    }
    .head { padding: 6px 3px; border-left: 1px solid var(--line); min-width: 0; }
    .dname { font-size: 12px; opacity: 0.6; padding: 0 3px 3px; white-space: nowrap; }
    .dname span { font-size: 18px; font-weight: 500; }
    .head.today .dname { opacity: 1; color: var(--acc); }
    .head.today .dname span { text-shadow: 0 0 10px var(--acc); }
    .allday {
      display: block;
      width: 100%;
      background: var(--cb);
      border: none;
      border-left: 3px solid var(--c);
      border-radius: 3px;
      padding: 1px 6px;
      margin-top: 2px;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .grid {
      position: relative;
      background-image: linear-gradient(var(--line) 1px, transparent 1px);
      background-size: 100% ${HOUR_PX}px;
    }
    .gutter { position: relative; }
    .hour {
      position: absolute;
      right: 6px;
      transform: translateY(-50%);
      font-size: 10px;
      opacity: 0.5;
      white-space: nowrap;
    }
    .col { position: relative; border-left: 1px solid var(--line); min-width: 0; }
    .col.today { background: rgba(255, 255, 255, 0.025); }
    .ev {
      position: absolute;
      box-sizing: border-box;
      background: var(--cb);
      border: 1px solid transparent;
      border-left: 3px solid var(--c);
      border-radius: 4px;
      padding: 2px 6px;
      overflow: hidden;
      font-size: 12px;
      line-height: 1.3;
    }
    .ev .t { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ev .w { opacity: 0.7; font-size: 11px; }
    .ev.past, .pill.past { opacity: 0.4; }
    .ev.live { border-color: var(--c); box-shadow: 0 0 10px var(--c); }
    .nowline {
      position: absolute;
      left: -5px;
      right: 0;
      height: 2px;
      background: var(--red);
      box-shadow: 0 0 8px var(--red);
      z-index: 3;
      pointer-events: none;
    }
    .nowline::before {
      content: "";
      position: absolute;
      left: 0;
      top: -4px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--red);
    }
    .mhead, .month { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); }
    .mhead {
      position: sticky;
      top: 0;
      z-index: 2;
      background: #061014;
      font-size: 11px;
      opacity: 0.6;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .mhead div { padding: 6px 8px; }
    .cell {
      min-height: 92px;
      border-top: 1px solid var(--line);
      border-left: 1px solid var(--line);
      padding: 4px;
      cursor: pointer;
      min-width: 0;
    }
    .cell.out { opacity: 0.35; }
    .num { font-size: 13px; padding: 0 2px 3px; }
    .cell.today { background: rgba(255, 255, 255, 0.04); box-shadow: inset 0 0 0 1px var(--acc); }
    .cell.today .num { color: var(--acc); font-weight: 700; text-shadow: 0 0 8px var(--acc); }
    .pill {
      font-size: 11px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-left: 2px solid var(--c);
      padding: 0 4px;
      margin-bottom: 2px;
    }
    .pill.all { background: var(--cb); border-radius: 2px; }
    .pill i { font-style: normal; opacity: 0.6; margin-right: 4px; }
    .more { font-size: 11px; opacity: 0.55; padding-left: 4px; }
    .scrim {
      position: absolute;
      inset: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.55);
      padding: 16px;
    }
    .sheet {
      background: #061014;
      border: 1px solid var(--c);
      box-shadow: 0 0 24px rgba(0, 0, 0, 0.6), 0 0 12px var(--cb);
      border-radius: 12px;
      padding: 16px 18px;
      width: min(420px, 100%);
      max-height: 80%;
      overflow-y: auto;
      box-sizing: border-box;
    }
    .stitle { font-size: 19px; font-weight: 600; margin-bottom: 8px; color: var(--c); }
    .srow { margin: 4px 0; }
    .srow.cal { opacity: 0.55; font-size: 12px; }
    .desc { white-space: pre-wrap; margin-top: 10px; font-size: 13px; opacity: 0.8; overflow-wrap: anywhere; }
    .sheet button {
      margin-top: 14px;
      border: 1px solid var(--acc);
      background: none;
      color: var(--acc);
      border-radius: 18px;
      padding: 6px 18px;
      min-height: 36px;
    }
    @media (max-width: 600px) {
      .clock .time { font-size: 30px; }
      /* phone: views on the left, back / today / forward on the right, the
         title on its own line under them */
      .tools { justify-content: space-between; gap: 8px; padding: 0 10px 8px; }
      .seg { margin-right: 0; }
      .seg button, .nav { padding: 6px 11px; min-height: 40px; }
      .nav[aria-label] { min-width: 40px; font-size: 18px; }
      .title { flex-basis: 100%; margin-left: 2px; }
      .top { gap: 12px; padding: 4px 10px 10px; }
      .glance { min-width: 0; }
      .chips { padding: 0 10px 8px; }
      .cell { min-height: 64px; padding: 2px; }
      .pill i { display: none; }
    }
  `;
}

if (!customElements.get("hubbubb-calendar")) customElements.define("hubbubb-calendar", HubbubbCalendar);
