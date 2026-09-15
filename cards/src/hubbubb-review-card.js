/* Hubbubb review card — the nightly review's proposals, decided here.
 *
 * Reads sensor.<assistant>_review: every defect and suggestion the overnight
 * review has raised, each with a status. Accept and Reject write back through
 * hubbubb_home.review_decide, the same call the Repairs panel makes, so the
 * two front ends never disagree. Accepted items wait for "apply the nightly
 * findings"; the session that applies them marks them done.
 *
 *   type: custom:hubbubb-review-card
 *   entity: sensor.jarvis_review
 */
import { groupProposals, markup } from "./review-groups.js";

const RUNNING = "running — the review takes a few minutes";

class HubbubbReviewCard extends HTMLElement {
  setConfig(config) {
    if (!config || !config.entity) {
      throw new Error("hubbubb-review-card: you need to define an `entity`");
    }
    this._config = { ...config };
    this._showDecided = false;
  }

  static getStubConfig(hass) {
    const entity = Object.keys(hass?.states ?? {}).find((e) =>
      e.startsWith("sensor.") && e.endsWith("_review")
    );
    return { type: "custom:hubbubb-review-card", entity: entity ?? "" };
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  getCardSize() {
    return 6;
  }

  /* Every call reports back in the header: "saving…" until HA answers, then
     "saved" or the error text. A card that swallows a failed call just looks
     like a button that does nothing. */
  _call(service, data, busy, done) {
    this._note = busy;
    this._render();
    this._hass.callService("hubbubb_home", service, data).then(
      () => { this._note = done; this._render(); },
      (e) => { this._note = `${service} failed: ${e?.message || e}`; this._render(); }
    );
  }

  _decide(id, decision) {
    this._call("review_decide", { id, decision }, "saving…", `saved: ${decision}`);
  }

  _item(p, buttons) {
    const yaml = p.yaml ? `<pre class="jr-yaml">${this._esc(p.yaml)}</pre>` : "";
    return `
      <div class="jr-item" data-id="${this._esc(p.id)}">
        <div class="jr-head">
          <span class="jr-kind jr-${p.kind}">${p.kind}</span>
          <span class="jr-title">${this._esc(p.title)}</span>
        </div>
        <div class="jr-body">${markup(p.body, (s) => this._esc(s))}${yaml}</div>
        <div class="jr-actions">
          <span class="jr-seen">${p.status === "pending" ? "first seen" : p.status} ${this._esc(p.first_seen || "")}</span>
          ${buttons}
        </div>
      </div>`;
  }

  _render() {
    if (!this._hass) return;
    const st = this._hass.states[this._config.entity];
    const attrs = st?.attributes ?? {};
    const groups = groupProposals(attrs.proposals);
    const sig = JSON.stringify([attrs.last_run, attrs.proposals, this._showDecided, this._note]);
    if (sig === this._sig) return;
    this._sig = sig;

    const btn = (label, decision, cls = "") =>
      `<button class="jr-btn ${cls}" data-decide="${decision}">${label}</button>`;
    const pending = groups.pending.map((p) =>
      this._item(p, btn("Reject", "rejected", "jr-no") + btn("Accept", "accepted", "jr-yes"))).join("");
    const accepted = groups.accepted.map((p) =>
      this._item(p, btn("Undo", "pending") + btn("Mark done", "done"))).join("");
    const decided = groups.decided.map((p) => this._item(p, btn("Reopen", "pending"))).join("");
    const lastRun = attrs.last_run ? new Date(attrs.last_run).toLocaleString() : "never";

    this.innerHTML = `
      <style>
        hubbubb-review-card { display: block; }
        .jr-card { padding: 12px 16px; }
        .jr-top { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; flex-wrap: wrap; }
        .jr-h { font-size: 14px; font-weight: 500; color: var(--secondary-text-color); }
        .jr-sub { font-size: 12px; color: var(--secondary-text-color); }
        .jr-section { margin-top: 12px; font-size: 13px; font-weight: 500; color: var(--primary-text-color); }
        .jr-item { padding: 10px 0; border-top: 1px solid var(--divider-color); }
        .jr-head { display: flex; gap: 8px; align-items: baseline; }
        .jr-kind { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; border-radius: 8px; padding: 1px 7px;
                   background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12); color: var(--primary-color); white-space: nowrap; }
        .jr-suggestion { background: rgba(var(--rgb-warning-color, 255, 152, 0), 0.15); color: var(--warning-color, #ff9800); }
        .jr-title { font-weight: 500; color: var(--primary-text-color); }
        .jr-body { font-size: 13px; color: var(--secondary-text-color); margin: 6px 0; line-height: 1.4; overflow-wrap: anywhere; }
        .jr-body code, .jr-yaml { font-family: ui-monospace, Menlo, monospace; font-size: 12px; }
        .jr-yaml { background: var(--secondary-background-color); border-radius: 8px; padding: 8px; overflow-x: auto; margin: 6px 0 0; }
        .jr-actions { display: flex; gap: 8px; align-items: center; }
        .jr-seen { font-size: 11px; color: var(--secondary-text-color); margin-right: auto; }
        .jr-btn { border: none; border-radius: 12px; padding: 4px 12px; cursor: pointer; font: inherit; font-size: 12px;
                  background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12); color: var(--primary-color); }
        .jr-yes { background: rgba(var(--rgb-success-color, 67, 160, 71), 0.15); color: var(--success-color, #43a047); }
        .jr-no { background: rgba(var(--rgb-error-color, 219, 68, 55), 0.12); color: var(--error-color, #db4437); }
        .jr-empty { color: var(--secondary-text-color); font-size: 13px; padding: 6px 0; }
        .jr-toggle { background: none; border: none; color: var(--primary-color); cursor: pointer; font: inherit; font-size: 12px; padding: 0; }
      </style>
      <ha-card class="jr-card">
        <div class="jr-top">
          <span class="jr-h">Nightly review</span>
          <span class="jr-sub">last run ${this._esc(lastRun)}${attrs.detail ? " — " + this._esc(attrs.detail) : ""}${this._note ? " · " + this._esc(this._note) : ""}</span>
          <button class="jr-btn" data-run ${this._note === RUNNING ? "disabled" : ""}>${this._note === RUNNING ? "Running…" : "Run now"}</button>
        </div>
        <div class="jr-section">Waiting for you (${groups.pending.length})</div>
        ${pending || `<div class="jr-empty">Nothing waiting. The review runs at 04:00.</div>`}
        <div class="jr-section">Accepted — say "apply the nightly findings" (${groups.accepted.length})</div>
        ${accepted || `<div class="jr-empty">Nothing accepted yet.</div>`}
        <div class="jr-section">
          <button class="jr-toggle" data-toggle>${this._showDecided ? "Hide" : "Show"} decided (${groups.decided.length})</button>
        </div>
        ${this._showDecided ? decided : ""}
      </ha-card>`;

    this.querySelectorAll(".jr-item").forEach((item) =>
      item.querySelectorAll("[data-decide]").forEach((b) =>
        b.addEventListener("click", () => this._decide(item.dataset.id, b.dataset.decide))
      )
    );
    this.querySelector("[data-toggle]").addEventListener("click", () => {
      this._showDecided = !this._showDecided;
      this._render();
    });
    this.querySelector("[data-run]").addEventListener("click", () =>
      this._call("run_review", {}, RUNNING, "review finished")
    );
  }

  _esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  }
}

customElements.define("hubbubb-review-card", HubbubbReviewCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "hubbubb-review-card",
  name: "Hubbubb Review",
  description: "Accept or reject what the nightly review proposed",
});
