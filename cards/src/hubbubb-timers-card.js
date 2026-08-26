/* Hubbubb timers card — live countdowns for the voice timer pool.
 *
 * Shows every running timer.hubbubb_timer_1..5 with the spoken name from its
 * input_text.hubbubb_timer_N_name sidecar, a draining progress bar, +1m/+5m
 * extend buttons (timer.change) and a cancel button (timer.cancel — the
 * announce automation clears the name sidecar on the cancelled event).
 * Idle slots are hidden. New timers start from the card too: preset chips
 * and an optional-name + minutes row, both through hubbubb_home.timer_startrt
 * so slot assignment, naming, and the finish announcement stay in one place.
 *
 * Deploy like hubbubb-ring-card: copy here, bump ?v= in the lovelace resource.
 */

class HubbubbTimersCard extends HTMLElement {
  static SLOTS = 5;

  setConfig(config) {
    this._config = { prefix: "hubbubb_timer", ...config };
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  connectedCallback() {
    // 500ms tick keeps the countdown text moving between state updates.
    this._tick = setInterval(() => this._render(), 500);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
  }

  getCardSize() {
    return 2;
  }

  _timers() {
    const out = [];
    for (let i = 1; i <= HubbubbTimersCard.SLOTS; i++) {
      const t = this._hass.states[`timer.${this._config.prefix}_${i}`];
      if (!t || (t.state !== "active" && t.state !== "paused")) continue;
      const nameSt = this._hass.states[`input_text.${this._config.prefix}_${i}_name`];
      const label = (nameSt && nameSt.state && !["unknown", "unavailable"].includes(nameSt.state) ? nameSt.state : "").trim();
      const durationS = this._hms(t.attributes.duration);
      let remainingS;
      if (t.state === "active" && t.attributes.finishes_at) {
        remainingS = Math.max(0, (new Date(t.attributes.finishes_at) - Date.now()) / 1000);
      } else {
        remainingS = this._hms(t.attributes.remaining);
      }
      out.push({ entity: t.entity_id, label: label || "Timer", remainingS, durationS, paused: t.state === "paused" });
    }
    return out;
  }

  _hms(str) {
    if (!str) return 0;
    return String(str).split(":").reduce((acc, p) => acc * 60 + Number(p), 0);
  }

  _fmt(s) {
    s = Math.ceil(s);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    const mm = h ? String(m).padStart(2, "0") : String(m);
    return (h ? `${h}:${mm}:` : `${m}:`) + String(sec).padStart(2, "0");
  }

  _render() {
    if (!this._hass) return;
    const timers = this._timers();
    // Rebuild the DOM only when the set of rows changes; ticks just retext.
    const sig = timers.map((t) => t.entity + t.label + t.paused).join("|") || "empty";
    if (sig !== this._sig) {
      this._sig = sig;
      this._build(timers);
    }
    for (const t of timers) {
      const row = this.querySelector(`[data-entity="${t.entity}"]`);
      if (!row) continue;
      row.querySelector(".jt-time").textContent = t.paused ? `${this._fmt(t.remainingS)} ⏸` : this._fmt(t.remainingS);
      const pct = t.durationS ? Math.min(100, (t.remainingS / t.durationS) * 100) : 0;
      row.querySelector(".jt-fill").style.width = `${pct}%`;
    }
  }

  _build(timers) {
    const rows = timers
      .map(
        (t) => `
      <div class="jt-row" data-entity="${t.entity}">
        <div class="jt-top">
          <span class="jt-label">${this._esc(t.label)}</span>
          <span class="jt-time"></span>
        </div>
        <div class="jt-bar"><div class="jt-fill"></div></div>
        <div class="jt-actions">
          <button class="jt-btn" data-add="60">+1 min</button>
          <button class="jt-btn" data-add="300">+5 min</button>
          <button class="jt-btn jt-cancel" data-cancel>Cancel</button>
        </div>
      </div>`
      )
      .join("");

    this.innerHTML = `
      <style>
        /* Light-DOM card, so style the tag itself: lift it above the
           hubbubb-ring-card when many timers overflow the grid cell. */
        hubbubb-timers-card { position: relative; z-index: 5; display: block; }
        .jt-card { padding: 12px 16px; }
        .jt-title { font-size: 14px; font-weight: 500; color: var(--secondary-text-color); margin-bottom: 4px; }
        .jt-row { padding: 8px 0; }
        .jt-row + .jt-row { border-top: 1px solid var(--divider-color); }
        .jt-top { display: flex; justify-content: space-between; align-items: baseline; }
        .jt-label { font-weight: 500; text-transform: capitalize; color: var(--primary-text-color); }
        .jt-time { font-size: 22px; font-variant-numeric: tabular-nums; color: var(--primary-text-color); }
        .jt-bar { height: 6px; border-radius: 3px; background: var(--divider-color); margin: 6px 0 8px; overflow: hidden; }
        .jt-fill { height: 100%; border-radius: 3px; background: var(--primary-color); transition: width 0.5s linear; }
        .jt-actions { display: flex; gap: 8px; }
        .jt-btn { border: none; border-radius: 12px; padding: 4px 12px; cursor: pointer; font: inherit; font-size: 12px;
                  background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12); color: var(--primary-color); }
        .jt-cancel { margin-left: auto; background: rgba(var(--rgb-error-color, 219, 68, 55), 0.12); color: var(--error-color, #db4437); }
        .jt-empty { color: var(--secondary-text-color); font-size: 13px; padding: 4px 0 8px; }
        .jt-new { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; padding-top: 10px; }
        .jt-row + .jt-new, .jt-empty + .jt-new { border-top: 1px solid var(--divider-color); }
        .jt-presets { display: flex; gap: 6px; flex-wrap: wrap; padding-top: 8px; }
        .jt-input { border: 1px solid var(--divider-color); border-radius: 8px; padding: 5px 8px; font: inherit; font-size: 13px;
                    background: var(--card-background-color); color: var(--primary-text-color); min-width: 0; }
        .jt-name-input { flex: 1 1 90px; }
        .jt-min-input { width: 52px; }
      </style>
      <ha-card class="jt-card">
        <div class="jt-title">Timers</div>
        ${rows || `<div class="jt-empty">No timers running — ask for ono set one, or start one below.</div>`}
        <div class="jt-new">
          <input class="jt-input jt-name-input" data-name placeholder="Name (optional)">
          <input class="jt-input jt-min-input" data-min type="number" min="1" max="1440" placeholder="min">
          <button class="jt-btn" data-start>Start</button>
        </div>
        <div class="jt-presets">
          <button class="jt-btn" data-preset="5">5m</button>
          <button class="jt-btn" data-preset="10">10m</button>
          <button class="jt-btn" data-preset="15">15m</button>
          <button class="jt-btn" data-preset="30">30m</button>
          <button class="jt-btn" data-preset="45">45m</button>
          <button class="jt-btn" data-preset="60">1h</button>
        </div>
      </ha-card>`;

    this.querySelectorAll(".jt-row").forEach((row) => {
      const entity = row.dataset.entity;
      // timer.change can't extend past the original duration, so "+N min"
      // restarts the timer at remaining + N instead.
      row.querySelectorAll("[data-add]").forEach((b) =>
        b.addEventListener("click", () => {
          const t = this._timers().find((x) => x.entity === entity);
          if (!t) return;
          this._hass.callService("timer", "start", {
            entity_id: entity,
            duration: Math.max(0, Math.round(t.remainingS)) + Number(b.dataset.add),
          });
        })
      );
      row.querySelector("[data-cancel]").addEventListener("click", () =>
        this._hass.callService("timer", "cancel", { entity_id: entity })
      );
    });

    const start = (minutes) => {
      if (!minutes || minutes <= 0) return;
      this._hass.callService("hubbubb_home", "timer_start", {
        jt_name: this.querySelector("[data-name]").value.trim(),
        jt_hours: 0,
        jt_minutes: minutes,
        jt_seconds: 0,
      });
    };
    this.querySelector("[data-start]").addEventListener("click", () =>
      start(Number(this.querySelector("[data-min]").value))
    );
    this.querySelector("[data-min]").addEventListener("keydown", (e) => {
      if (e.key === "Enter") start(Number(e.target.value));
    });
    this.querySelectorAll("[data-preset]").forEach((b) =>
      b.addEventListener("click", () => start(Number(b.dataset.preset)))
    );
  }

  _esc(s) {
    return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  }
}

customElements.define("hubbubb-timers-card", HubbubbTimersCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "hubbubb-timers-card",
  name: "Hubbubb Timers",
  description: "Live countdowns for the voice timer pool",
});
