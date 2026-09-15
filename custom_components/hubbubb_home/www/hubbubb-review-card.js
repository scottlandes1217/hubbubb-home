var m=Object.defineProperty;var l=Object.getOwnPropertySymbols;var x=Object.prototype.hasOwnProperty,w=Object.prototype.propertyIsEnumerable;var p=(s,e,r)=>e in s?m(s,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):s[e]=r,g=(s,e)=>{for(var r in e||(e={}))x.call(e,r)&&p(s,r,e[r]);if(l)for(var r of l(e))w.call(e,r)&&p(s,r,e[r]);return s};function u(s){let e={pending:[],accepted:[],decided:[]};for(let t of Array.isArray(s)?s:[])t.status==="pending"?e.pending.push(t):t.status==="accepted"?e.accepted.push(t):e.decided.push(t);let r=t=>(t.last_seen||"")+(t.first_seen||"")+t.id;for(let t of Object.values(e))t.sort((i,a)=>r(i)<r(a)?1:-1);return e}function h(s,e){return e(s||"").replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/`([^`\n]+)`/g,"<code>$1</code>").replace(/\n/g,"<br>")}var c=class extends HTMLElement{setConfig(e){if(!e||!e.entity)throw new Error("hubbubb-review-card: you need to define an `entity`");this._config=g({},e),this._showDecided=!1}static getStubConfig(e){var t;let r=Object.keys((t=e==null?void 0:e.states)!=null?t:{}).find(i=>i.startsWith("sensor.")&&i.endsWith("_review"));return{type:"custom:hubbubb-review-card",entity:r!=null?r:""}}set hass(e){this._hass=e,this._render()}getCardSize(){return 6}_decide(e,r){this._hass.callService("hubbubb_home","review_decide",{id:e,decision:r})}_item(e,r){let t=e.yaml?`<pre class="jr-yaml">${this._esc(e.yaml)}</pre>`:"";return`
      <div class="jr-item" data-id="${this._esc(e.id)}">
        <div class="jr-head">
          <span class="jr-kind jr-${e.kind}">${e.kind}</span>
          <span class="jr-title">${this._esc(e.title)}</span>
        </div>
        <div class="jr-body">${h(e.body,i=>this._esc(i))}${t}</div>
        <div class="jr-actions">
          <span class="jr-seen">${e.status==="pending"?"first seen":e.status} ${this._esc(e.first_seen||"")}</span>
          ${r}
        </div>
      </div>`}_render(){var d;if(!this._hass)return;let e=this._hass.states[this._config.entity],r=(d=e==null?void 0:e.attributes)!=null?d:{},t=u(r.proposals),i=JSON.stringify([r.last_run,r.proposals,this._showDecided]);if(i===this._sig)return;this._sig=i;let a=(o,n,f="")=>`<button class="jr-btn ${f}" data-decide="${n}">${o}</button>`,b=t.pending.map(o=>this._item(o,a("Reject","rejected","jr-no")+a("Accept","accepted","jr-yes"))).join(""),v=t.accepted.map(o=>this._item(o,a("Undo","pending")+a("Mark done","done"))).join(""),y=t.decided.map(o=>this._item(o,a("Reopen","pending"))).join(""),j=r.last_run?new Date(r.last_run).toLocaleString():"never";this.innerHTML=`
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
          <span class="jr-sub">last run ${this._esc(j)}${r.detail?" \u2014 "+this._esc(r.detail):""}</span>
          <button class="jr-btn" data-run>Run now</button>
        </div>
        <div class="jr-section">Waiting for you (${t.pending.length})</div>
        ${b||'<div class="jr-empty">Nothing waiting. The review runs at 04:00.</div>'}
        <div class="jr-section">Accepted \u2014 say "apply the nightly findings" (${t.accepted.length})</div>
        ${v||'<div class="jr-empty">Nothing accepted yet.</div>'}
        <div class="jr-section">
          <button class="jr-toggle" data-toggle>${this._showDecided?"Hide":"Show"} decided (${t.decided.length})</button>
        </div>
        ${this._showDecided?y:""}
      </ha-card>`,this.querySelectorAll(".jr-item").forEach(o=>o.querySelectorAll("[data-decide]").forEach(n=>n.addEventListener("click",()=>this._decide(o.dataset.id,n.dataset.decide)))),this.querySelector("[data-toggle]").addEventListener("click",()=>{this._showDecided=!this._showDecided,this._render()}),this.querySelector("[data-run]").addEventListener("click",o=>{o.target.disabled=!0,o.target.textContent="Running\u2026",this._hass.callService("hubbubb_home","run_review",{})})}_esc(e){return String(e).replace(/[&<>"']/g,r=>`&#${r.charCodeAt(0)};`)}};customElements.define("hubbubb-review-card",c);window.customCards=window.customCards||[];window.customCards.push({type:"hubbubb-review-card",name:"Hubbubb Review",description:"Accept or reject what the nightly review proposed"});
