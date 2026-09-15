var w=Object.defineProperty;var h=Object.getOwnPropertySymbols;var x=Object.prototype.hasOwnProperty,$=Object.prototype.propertyIsEnumerable;var g=(s,e,t)=>e in s?w(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,u=(s,e)=>{for(var t in e||(e={}))x.call(e,t)&&g(s,t,e[t]);if(h)for(var t of h(e))$.call(e,t)&&g(s,t,e[t]);return s};function b(s){let e={pending:[],accepted:[],decided:[]};for(let r of Array.isArray(s)?s:[])r.status==="pending"?e.pending.push(r):r.status==="accepted"?e.accepted.push(r):e.decided.push(r);let t=r=>(r.last_seen||"")+(r.first_seen||"")+r.id;for(let r of Object.values(e))r.sort((i,a)=>t(i)<t(a)?1:-1);return e}function v(s,e){return e(s||"").replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/`([^`\n]+)`/g,"<code>$1</code>").replace(/\n/g,"<br>")}var c="running \u2014 the review takes a few minutes",d=class extends HTMLElement{setConfig(e){if(!e||!e.entity)throw new Error("hubbubb-review-card: you need to define an `entity`");this._config=u({},e),this._showDecided=!1}static getStubConfig(e){var r;let t=Object.keys((r=e==null?void 0:e.states)!=null?r:{}).find(i=>i.startsWith("sensor.")&&i.endsWith("_review"));return{type:"custom:hubbubb-review-card",entity:t!=null?t:""}}set hass(e){this._hass=e,this._render()}getCardSize(){return 6}_call(e,t,r,i){this._track(this._hass.callService("hubbubb_home",e,t),r,i,e)}_track(e,t,r,i){this._note=t,this._render(),e.then(()=>{this._note=r,this._render()},a=>{this._note=`${i} failed: ${(a==null?void 0:a.message)||a}`,this._render()})}_decide(e,t){this._call("review_decide",{id:e,decision:t},"saving\u2026",`saved: ${t}`)}_acceptAll(e){let t=r=>this._hass.callService("hubbubb_home","review_decide",{id:r,decision:"accepted"});this._track(Promise.all(e.map(t)),`accepting ${e.length}\u2026`,`accepted ${e.length}`,"accept all")}_item(e,t){let r=e.yaml?`<pre class="jr-yaml">${this._esc(e.yaml)}</pre>`:"";return`
      <div class="jr-item" data-id="${this._esc(e.id)}">
        <div class="jr-head">
          <span class="jr-kind jr-${e.kind}">${e.kind}</span>
          <span class="jr-title">${this._esc(e.title)}</span>
        </div>
        <div class="jr-body">${v(e.body,i=>this._esc(i))}${r}</div>
        <div class="jr-actions">
          <span class="jr-seen">${e.status==="pending"?"first seen":e.status} ${this._esc(e.first_seen||"")}</span>
          ${t}
        </div>
      </div>`}_render(){var l,p;if(!this._hass)return;let e=this._hass.states[this._config.entity],t=(l=e==null?void 0:e.attributes)!=null?l:{},r=b(t.proposals),i=JSON.stringify([t.last_run,t.proposals,this._showDecided,this._note]);if(i===this._sig)return;this._sig=i;let a=(n,o,m="")=>`<button class="jr-btn ${m}" data-decide="${o}">${n}</button>`,_=r.pending.map(n=>this._item(n,a("Reject","rejected","jr-no")+a("Accept","accepted","jr-yes"))).join(""),y=r.accepted.map(n=>this._item(n,a("Undo","pending")+a("Mark done","done"))).join(""),f=r.decided.map(n=>this._item(n,a("Reopen","pending"))).join(""),j=t.last_run?new Date(t.last_run).toLocaleString():"never";this.innerHTML=`
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
          <span class="jr-sub">last run ${this._esc(j)}${t.detail?" \u2014 "+this._esc(t.detail):""}${this._note?" \xB7 "+this._esc(this._note):""}</span>
          <button class="jr-btn" data-run ${this._note===c?"disabled":""}>${this._note===c?"Running\u2026":"Run now"}</button>
        </div>
        <div class="jr-section">Waiting for you (${r.pending.length})
          ${r.pending.length>1?'<button class="jr-btn jr-yes" data-accept-all>Accept all</button>':""}
        </div>
        ${_||'<div class="jr-empty">Nothing waiting. The review runs at 04:00.</div>'}
        <div class="jr-section">Accepted \u2014 say "apply the nightly findings" (${r.accepted.length})</div>
        ${y||'<div class="jr-empty">Nothing accepted yet.</div>'}
        <div class="jr-section">
          <button class="jr-toggle" data-toggle>${this._showDecided?"Hide":"Show"} decided (${r.decided.length})</button>
        </div>
        ${this._showDecided?f:""}
      </ha-card>`,this.querySelectorAll(".jr-item").forEach(n=>n.querySelectorAll("[data-decide]").forEach(o=>o.addEventListener("click",()=>this._decide(n.dataset.id,o.dataset.decide)))),(p=this.querySelector("[data-accept-all]"))==null||p.addEventListener("click",()=>this._acceptAll(r.pending.map(n=>n.id))),this.querySelector("[data-toggle]").addEventListener("click",()=>{this._showDecided=!this._showDecided,this._render()}),this.querySelector("[data-run]").addEventListener("click",()=>this._call("run_review",{},c,"review finished"))}_esc(e){return String(e).replace(/[&<>"']/g,t=>`&#${t.charCodeAt(0)};`)}};customElements.define("hubbubb-review-card",d);window.customCards=window.customCards||[];window.customCards.push({type:"hubbubb-review-card",name:"Hubbubb Review",description:"Accept or reject what the nightly review proposed"});
