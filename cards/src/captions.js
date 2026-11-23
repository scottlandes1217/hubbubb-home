import { LitElement, css, html, nothing } from "lit";
import { keyed } from "lit/directives/keyed.js";
import { captionAt, captionChunks } from "./caption-text.js";

/* Subtitles under the ring: what you said, small and dim, and what he is
   saying, revealed word by word in step with the voice. The card owns the
   clock and sets `progress` every frame; only this element re-renders. */

class HubbubbCaption extends LitElement {
  static properties = {
    you: {},
    say: {},
    who: {},
    progress: { type: Number },
    fading: { type: Boolean, reflect: true },
  };

  willUpdate(changed) {
    if (changed.has("say")) this._chunks = captionChunks(this.say);
  }

  shouldUpdate(changed) {
    // progress arrives every frame; only redraw when a new word shows
    if (changed.size === 1 && changed.has("progress")) {
      const at = captionAt(this._chunks || [], this.progress).join();
      if (at === this._at) return false;
    }
    return true;
  }

  render() {
    const chunks = this._chunks || [];
    const [c, n] = captionAt(chunks, this.progress || 0);
    this._at = [c, n].join();
    const words = chunks[c] || [];
    return html`
      ${this.you ? html`<div class="you">“${this.you}”</div>` : nothing}
      ${words.length
        ? html`<div class="who">${this.who}</div>
            ${keyed(c, html`<div class="say">${words.map(
              (w, i) => html`<span class="w ${i < n ? "on" : ""}">${w}</span> `
            )}</div>`)}`
        : nothing}
      <div class="sr" aria-live="polite">${this.say || ""}</div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      padding: 14px 22px 12px;
      text-align: center;
      line-height: 1.35;
      pointer-events: none;
      /* a soft pool of dark rather than a box: legible over the bright ring
         without hiding it. No backdrop-filter - see the build panel. */
      background: radial-gradient(ellipse 62% 70% at 50% 58%, rgba(0, 6, 10, 0.72), rgba(0, 6, 10, 0.38) 55%, transparent 78%);
      transition: opacity 700ms ease, transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
      animation: in 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    :host([fading]) {
      opacity: 0;
      transform: translateY(6px);
    }
    .you {
      margin: 0 auto 8px;
      max-width: 34em;
      font: italic 400 13px/1.35 system-ui, -apple-system, sans-serif;
      color: rgba(214, 236, 245, 0.62);
      text-shadow: 0 1px 2px #000;
      animation: in 360ms ease both;
    }
    .who {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      margin-bottom: 5px;
      font: italic 700 10px/1 "Eurostile", "Orbitron", system-ui, sans-serif;
      letter-spacing: 0.34em;
      text-indent: 0.34em;
      text-transform: uppercase;
      color: var(--jr-color, #5fd4ff);
      text-shadow: 0 0 8px var(--jr-color, #5fd4ff);
    }
    .who::before,
    .who::after {
      content: "";
      width: 26px;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--jr-color, #5fd4ff));
      box-shadow: 0 0 6px var(--jr-color, #5fd4ff);
    }
    .who::after {
      transform: scaleX(-1);
    }
    .say {
      max-width: 26em;
      margin: 0 auto;
      font: 500 clamp(15px, 4.4vw, 20px)/1.38 system-ui, -apple-system, "Segoe UI", sans-serif;
      letter-spacing: 0.01em;
      color: #effcff;
      text-shadow: 0 0 14px rgba(var(--jr-glow, 46, 157, 245), 0.55), 0 1px 2px rgba(0, 0, 0, 0.95);
      text-wrap: balance;
      animation: in 320ms ease both;
    }
    .w {
      display: inline-block;
      opacity: 0.3;
      filter: blur(1.5px);
      transform: translateY(0.18em);
      transition: opacity 260ms ease, filter 260ms ease, transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    .w.on {
      opacity: 1;
      filter: none;
      transform: none;
    }
    .sr {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
    }
    @keyframes in {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      :host, .you, .say { animation: none; }
      .w { filter: none; transform: none; transition: opacity 160ms linear; }
    }
  `;
}

if (!customElements.get("hubbubb-caption"))
  customElements.define("hubbubb-caption", HubbubbCaption);
