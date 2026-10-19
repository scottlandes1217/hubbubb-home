/* Hubbubb review card — the nightly review's proposals, decided here.
 *
 * Reads sensor.<assistant>_review: every defect and suggestion the overnight
 * review has raised, each with a status. Accept and Reject write back through
 * hubbubb_home.review_decide, the same call the Repairs panel makes, so the
 * two front ends never disagree. Apply Findings triggers the same automation
 * as accepting an item; the session that applies them marks them done.
 *
 *   type: custom:hubbubb-review-card
 *   entity: sensor.jarvis_review
 *   apply_automation: automation.jarvis_apply_accepted_nightly_findings
 */
import { groupProposals, markup } from "./review-groups.js";

const RUNNING = "running — the review takes a few minutes";
const CHECKING = "re-checking against the current code — a few minutes";

class HubbubbReviewCard extends HTMLElement {
  setConfig(config) {
    if (!config || !config.entity) {
      throw new Error("hubbubb-review-card: you need to define an `entity`");
    }
    this._config = { apply_automation: "automation.jarvis_apply_accepted_nightly_findings", ...config };
    this._showDecided = false;
    // which items are open: every hass update rewrites the card, and the
    // ones you opened have to stay open through it
    this._open = new Set();
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
    this._track(this._hass.callService("hubbubb_home", service, data), busy, done, service);
  }

  _track(promise, busy, done, label) {
    this._note = busy;
    this._render();
    promise.then(
      (r) => { this._note = typeof done === "function" ? done(r) : done; this._render(); },
      (e) => { this._note = `${label} failed: ${e?.message || e}`; this._render(); }
    );
  }

  /* Closes the open items the code no longer has; says how many. */
  _recheck() {
    const call = this._hass.callWS({ type: "call_service", domain: "hubbubb_home",
      service: "review_recheck", service_data: {}, return_response: true });
    this._track(call, CHECKING,
      (r) => `re-check: ${r?.response?.fixed?.length ?? 0} already fixed, closed`, "re-check");
  }

  _decide(id, decision) {
    this._call("review_decide", { id, decision }, "saving…", `saved: ${decision}`);
  }

  _acceptAll(ids) {
    const one = (id) =>
      this._hass.callService("hubbubb_home", "review_decide", { id, decision: "accepted" });
    this._track(Promise.all(ids.map(one)), `accepting ${ids.length}…`, `accepted ${ids.length}`, "accept all");
  }

  async _apply() {
    const proposals = this._hass.states[this._config.entity]?.attributes?.proposals;
    const automation = this._hass.states[this._config.apply_automation];
    if (this._applying || automation?.attributes?.current > 0 ||
        !automation || ["unavailable", "unknown"].includes(automation.state) ||
        !groupProposals(proposals).accepted.length ||
        this._note === RUNNING || this._note === CHECKING) return;
    this._applying = true;
    this._note = "requesting application of accepted findings…";
    this._render();
    try {
      // Reuse the existing single-run automation, including its debounce, so
      // clicking during an automatic acceptance run cannot launch a second one.
      await this._hass.callService("automation", "trigger", {
        entity_id: this._config.apply_automation, skip_condition: true,
      });
      this._note = "apply request sent — findings will be marked done as they finish";
    } catch (e) {
      this._note = `Apply Findings failed: ${e?.message || e}`;
    } finally {
      this._applying = false;
      this._render();
    }
  }

  _item(p, buttons) {
    const yaml = p.yaml ? `<pre class="jr-yaml">${this._esc(p.yaml)}</pre>` : "";
    // collapsed to its title; tap to read the details and decide
    return `
      <details class="jr-item" data-id="${this._esc(p.id)}" ${this._open.has(p.id) ? "open" : ""}>
        <summary class="jr-head">
          <span class="jr-kind jr-${p.kind}">${p.kind}</span>
          <span class="jr-title">${this._esc(p.title)}</span>
        </summary>
        <div class="jr-body">${markup(p.body, (s) => this._esc(s))}${yaml}</div>
        <div class="jr-actions">
          <span class="jr-seen">${p.resolved ? this._esc(p.resolved) : `${p.status === "pending" ? "first seen" : p.status} ${this._esc(p.first_seen || "")}`}</span>
          ${buttons}
        </div>
      </details>`;
  }

  _render() {
    if (!this._hass) return;
    const st = this._hass.states[this._config.entity];
    const attrs = st?.attributes ?? {};
    const groups = groupProposals(attrs.proposals);
    const automation = this._hass.states[this._config.apply_automation];
    const applying = this._applying || automation?.attributes?.current > 0;
    const applyAvailable = automation && !["unavailable", "unknown"].includes(automation.state);
    const sig = JSON.stringify([attrs.last_run, attrs.detail, attrs.proposals,
      this._showDecided, this._note, applying, applyAvailable]);
    if (sig === this._sig) return;
    this._sig = sig;

    const btn = (label, decision, cls = "") =>
      `<button class="jr-btn ${cls}" data-decide="${decision}">${label}</button>`;
    const pending = groups.pending.map((p) =>
      this._item(p, btn("Reject", "rejected", "jr-no") + btn("Accept", "accepted", "jr-yes"))).join("");
    const accepted = groups.accepted.map((p) =>
      this._item(p, btn("Undo", "pending") + btn("Mark done", "done"))).join("");
    const decided = groups.decided.map((p) => this._item(p, btn("Reopen", "pending"))).join("");
    const busy = applying || this._note === RUNNING || this._note === CHECKING;
    const lastRun = attrs.last_run ? new Date(attrs.last_run).toLocaleString() : "never";

    this.innerHTML = `
      <style>
        hubbubb-review-card { display: block; }
        .jr-card { padding: 12px 16px; }
        .jr-top { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; flex-wrap: wrap; }
        .jr-h { font-size: 14px; font-weight: 500; color: var(--secondary-text-color); }
        .jr-sub { font-size: 12px; color: var(--secondary-text-color); }
        .jr-section { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;
                      margin-top: 12px; font-size: 13px; font-weight: 500; color: var(--primary-text-color); }
        .jr-item { padding: 10px 0; border-top: 1px solid var(--divider-color); }
        .jr-head { display: flex; gap: 8px; align-items: baseline; cursor: pointer; list-style: none; }
        .jr-head::-webkit-details-marker { display: none; }
        .jr-head::after { content: "›"; margin-left: auto; padding-left: 8px; color: var(--secondary-text-color);
                          font-size: 18px; line-height: 1; transition: transform .2s; }
        .jr-item[open] > .jr-head::after { transform: rotate(90deg); }
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
        .jr-btn:disabled { opacity: 0.5; cursor: default; }
        .jr-no { background: rgba(var(--rgb-error-color, 219, 68, 55), 0.12); color: var(--error-color, #db4437); }
        .jr-empty { color: var(--secondary-text-color); font-size: 13px; padding: 6px 0; }
        .jr-toggle { background: none; border: none; color: var(--primary-color); cursor: pointer; font: inherit; font-size: 12px; padding: 0; }
      </style>
      <ha-card class="jr-card">
        <div class="jr-top">
          <span class="jr-h">Nightly review</span>
          <span class="jr-sub" role="status">last run ${this._esc(lastRun)}${attrs.detail ? " — " + this._esc(attrs.detail) : ""}${this._note ? " · " + this._esc(this._note) : ""}</span>
          <button class="jr-btn" data-recheck ${busy ? "disabled" : ""}>${this._note === CHECKING ? "Checking…" : "Re-check open"}</button>
          <button class="jr-btn" data-run ${busy ? "disabled" : ""}>${this._note === RUNNING ? "Running…" : "Run now"}</button>
        </div>
        <div class="jr-section">Waiting for you (${groups.pending.length})
          ${groups.pending.length > 1 ? `<button class="jr-btn jr-yes" data-accept-all>Accept all</button>` : ""}
        </div>
        ${pending || `<div class="jr-empty">Nothing waiting. The review runs at 04:00.</div>`}
        <div class="jr-section"><span>Accepted (${groups.accepted.length})</span>
          <button class="jr-btn jr-yes" data-apply ${busy || !applyAvailable || !groups.accepted.length ? "disabled" : ""}
            title="${!applyAvailable ? "Applying findings is unavailable" : "Apply accepted findings"}">${applying ? "Applying…" : "Apply Findings"}</button>
        </div>
        ${accepted || `<div class="jr-empty">Nothing accepted yet.</div>`}
        <div class="jr-section">
          <button class="jr-toggle" data-toggle>${this._showDecided ? "Hide" : "Show"} decided (${groups.decided.length})</button>
        </div>
        ${this._showDecided ? decided : ""}
      </ha-card>`;

    this.querySelectorAll(".jr-item").forEach((item) => {
      item.addEventListener("toggle", () =>
        item.open ? this._open.add(item.dataset.id) : this._open.delete(item.dataset.id)
      );
      item.querySelectorAll("[data-decide]").forEach((b) =>
        b.addEventListener("click", () => this._decide(item.dataset.id, b.dataset.decide))
      );
    });
    this.querySelector("[data-accept-all]")?.addEventListener("click", () =>
      this._acceptAll(groups.pending.map((p) => p.id))
    );
    this.querySelector("[data-toggle]").addEventListener("click", () => {
      this._showDecided = !this._showDecided;
      this._render();
    });
    this.querySelector("[data-recheck]").addEventListener("click", () => this._recheck());
    this.querySelector("[data-apply]").addEventListener("click", () => this._apply());
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
