/* Hubbubb recipes — the household cookbook as a sidebar panel.

   List on the left, one recipe on the right; a form for adding or editing.
   Everything goes through the integration's recipe_* services with a
   response, so the panel needs nothing but a Home Assistant session. The
   pure parts (line splitting, filtering, the form -> service data shape) are
   exported so test/recipes.mjs can assert them without a browser. */
import { LitElement, css, html, nothing } from "lit";

const BUILD =
  ((new Error().stack || "").match(/\/(\d+\.\d+\.\d+)\//) || [])[1] || "dev";
console.info(`hubbubb-recipes ${BUILD}`);

/* Textarea text -> one item per entry, blanks and list bullets dropped. */
export const parseLines = (text) =>
  String(text || "")
    .split("\n")
    .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);

/* Case-insensitive match on title or any ingredient, alphabetical. */
export const filterRecipes = (recipes, q) => {
  const needle = (q || "").trim().toLowerCase();
  const rows = needle
    ? recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(needle) ||
          (r.ingredients || []).some((i) => i.toLowerCase().includes(needle))
      )
    : recipes.slice();
  return rows.sort((a, b) => a.title.localeCompare(b.title));
};

/* The form's fields -> recipe_save's service data. */
export const formData = (f) => ({
  ...(f.id ? { id: f.id } : {}),
  title: (f.title || "").trim(),
  ingredients: parseLines(f.ingredients),
  steps: parseLines(f.steps),
  source: (f.source || "").trim(),
});

const blankForm = () => ({ id: null, title: "", ingredients: "", steps: "", source: "" });

class HubbubbRecipes extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    _recipes: { state: true },
    _q: { state: true },
    _sel: { state: true },
    _form: { state: true },
    _err: { state: true },
    _busy: { state: true },
    _confirm: { state: true },
  };

  constructor() {
    super();
    this._recipes = [];
    this._q = "";
    this._sel = null; // selected recipe id
    this._form = null; // open form, or null
    this._err = "";
    this._busy = false;
    this._confirm = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  async _call(service, data = {}) {
    const res = await this.hass.callWS({
      type: "call_service",
      domain: "hubbubb_home",
      service,
      service_data: data,
      return_response: true,
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

  async _load() {
    const res = await this._try(() => this._call("recipe_list"));
    if (res) this._recipes = res.recipes || [];
  }

  get _current() {
    return this._recipes.find((r) => r.id === this._sel) || null;
  }

  _open(r) {
    this._sel = r.id;
    this._form = null;
    this._confirm = false;
  }

  _edit(r) {
    this._form = r
      ? { id: r.id, title: r.title, ingredients: r.ingredients.join("\n"), steps: r.steps.join("\n"), source: r.source }
      : blankForm();
    this._confirm = false;
  }

  async _save() {
    const data = formData(this._form);
    if (!data.title) return (this._err = "Give it a title.");
    const res = await this._try(() => this._call("recipe_save", data));
    if (!res) return;
    await this._load();
    this._sel = res.recipe.id;
    this._form = null;
  }

  async _delete(r) {
    if (!this._confirm) return (this._confirm = true);
    const res = await this._try(() => this._call("recipe_delete", { id: r.id }));
    if (!res) return;
    this._sel = null;
    this._confirm = false;
    await this._load();
  }

  _set(field) {
    return (e) => (this._form = { ...this._form, [field]: e.target.value });
  }

  render() {
    const rows = filterRecipes(this._recipes, this._q);
    // Narrow screens show one pane: the list, or whatever is open.
    const showList = !this.narrow || (!this._current && !this._form);
    const showMain = !this.narrow || this._current || this._form;
    return html`
      <div class="bar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        ${this.narrow && showMain
          ? html`<button class="back" @click=${() => { this._sel = null; this._form = null; }}>‹</button>`
          : nothing}
        <div class="title">Recipes</div>
        <button class="add" ?disabled=${this._busy} @click=${() => this._edit(null)}>+ Add</button>
      </div>
      ${this._err
        ? html`<div class="err" @click=${() => (this._err = "")}>${this._err}<span class="x">dismiss</span></div>`
        : nothing}
      <div class="cols">
        ${showList
          ? html`<div class="col side">
              <input class="search" type="search" placeholder="Search recipes or ingredients" .value=${this._q} @input=${(e) => (this._q = e.target.value)} />
              ${rows.length
                ? rows.map(
                    (r) => html`<div class="row ${r.id === this._sel ? "on" : ""}" @click=${() => this._open(r)}>
                      <div class="name">${r.title}</div>
                      <div class="meta">${r.ingredients.length} ingredients · ${r.steps.length} steps</div>
                    </div>`
                  )
                : html`<div class="empty">${this._recipes.length ? "Nothing matches." : "No recipes yet. Add one, or ask the house for a dish and say yes when it offers to save it."}</div>`}
            </div>`
          : nothing}
        ${showMain
          ? html`<div class="col main">${this._form ? this._renderForm() : this._current ? this._renderRecipe(this._current) : html`<div class="empty">Pick a recipe.</div>`}</div>`
          : nothing}
      </div>
    `;
  }

  _renderRecipe(r) {
    return html`
      <div class="card">
        <div class="head">
          <h2>${r.title}</h2>
          <div class="actions">
            <button ?disabled=${this._busy} @click=${() => this._edit(r)}>Edit</button>
            <button class="danger" ?disabled=${this._busy} @click=${() => this._delete(r)}>
              ${this._confirm ? "Really delete?" : "Delete"}
            </button>
          </div>
        </div>
        ${r.source
          ? html`<div class="source">${/^https?:\/\//.test(r.source) ? html`<a href=${r.source} target="_blank" rel="noopener">${r.source}</a>` : r.source}</div>`
          : nothing}
        <h3>Ingredients</h3>
        <ul>${r.ingredients.map((i) => html`<li>${i}</li>`)}</ul>
        <h3>Steps</h3>
        <ol>${r.steps.map((s) => html`<li>${s}</li>`)}</ol>
        <div class="meta">Saved ${r.created}</div>
      </div>
    `;
  }

  _renderForm() {
    const f = this._form;
    return html`
      <div class="card">
        <h2>${f.id ? "Edit recipe" : "New recipe"}</h2>
        <label>Title<input .value=${f.title} @input=${this._set("title")} /></label>
        <label>Source<input .value=${f.source} placeholder="URL or where it came from" @input=${this._set("source")} /></label>
        <label>Ingredients <span class="hint">one per line</span><textarea rows="8" .value=${f.ingredients} @input=${this._set("ingredients")}></textarea></label>
        <label>Steps <span class="hint">one per line</span><textarea rows="10" .value=${f.steps} @input=${this._set("steps")}></textarea></label>
        <div class="actions">
          <button class="primary" ?disabled=${this._busy} @click=${() => this._save()}>Save</button>
          <button ?disabled=${this._busy} @click=${() => (this._form = null)}>Cancel</button>
        </div>
      </div>
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
    .title { font-size: 20px; font-weight: 400; flex: 1; }
    .bar button {
      background: rgba(255, 255, 255, 0.16);
      color: inherit;
      border: 0;
      border-radius: 6px;
      padding: 6px 12px;
      font: inherit;
      cursor: pointer;
    }
    .bar .back { font-size: 22px; line-height: 1; padding: 2px 10px; }
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
    .err .x { opacity: 0.7; font-size: 12px; white-space: nowrap; }
    .cols {
      display: grid;
      grid-template-columns: minmax(240px, 320px) minmax(0, 1fr);
      gap: 16px;
      padding: 16px;
      max-width: 1100px;
      margin: 0 auto;
      box-sizing: border-box;
    }
    @media (max-width: 760px) {
      .cols { grid-template-columns: minmax(0, 1fr); padding: 12px; }
    }
    .search {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 12px;
      margin-bottom: 8px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: inherit;
      font: inherit;
    }
    .row {
      padding: 10px 12px;
      border-radius: 8px;
      cursor: pointer;
      background: var(--card-background-color);
      margin-bottom: 6px;
      border: 1px solid transparent;
    }
    .row:hover { border-color: var(--divider-color); }
    .row.on { border-color: var(--primary-color); }
    .name { font-weight: 500; }
    .meta { font-size: 12px; opacity: 0.65; margin-top: 2px; }
    .empty { opacity: 0.65; padding: 24px 12px; text-align: center; }
    .card {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 20px 24px;
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    h2 { margin: 0 0 8px; font-size: 22px; font-weight: 500; }
    h3 { margin: 18px 0 6px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.04em; opacity: 0.7; }
    ul, ol { margin: 0; padding-left: 22px; line-height: 1.7; }
    .source { font-size: 13px; opacity: 0.8; word-break: break-all; }
    .source a { color: var(--primary-color); }
    label { display: block; margin: 10px 0 0; font-size: 13px; opacity: 0.9; }
    .hint { opacity: 0.6; }
    input, textarea {
      display: block;
      width: 100%;
      box-sizing: border-box;
      margin-top: 4px;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
    }
    .actions { display: flex; gap: 8px; margin-top: 16px; }
    .actions button {
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    .actions .primary { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
    .actions .danger { color: var(--error-color, #db4437); }
    button:disabled { opacity: 0.5; cursor: default; }
  `;
}

customElements.define("hubbubb-recipes", HubbubbRecipes);
