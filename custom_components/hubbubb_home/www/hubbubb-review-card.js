var k=Object.defineProperty;var g=Object.getOwnPropertySymbols;var $=Object.prototype.hasOwnProperty,S=Object.prototype.propertyIsEnumerable;var b=(n,e,t)=>e in n?k(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,_=(n,e)=>{for(var t in e||(e={}))$.call(e,t)&&b(n,t,e[t]);if(g)for(var t of g(e))S.call(e,t)&&b(n,t,e[t]);return n};function v(n){let e={pending:[],accepted:[],decided:[]};for(let r of Array.isArray(n)?n:[])r.status==="pending"?e.pending.push(r):r.status==="accepted"?e.accepted.push(r):e.decided.push(r);let t=r=>(r.last_seen||"")+(r.first_seen||"")+r.id;for(let r of Object.values(e))r.sort((i,s)=>t(i)<t(s)?1:-1);return e}function y(n,e){return e(n||"").replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/`([^`\n]+)`/g,"<code>$1</code>").replace(/\n/g,"<br>")}var c="running \u2014 the review takes a few minutes",d="re-checking against the current code \u2014 a few minutes",l=class extends HTMLElement{setConfig(e){if(!e||!e.entity)throw new Error("hubbubb-review-card: you need to define an `entity`");this._config=_({},e),this._showDecided=!1}static getStubConfig(e){var r;let t=Object.keys((r=e==null?void 0:e.states)!=null?r:{}).find(i=>i.startsWith("sensor.")&&i.endsWith("_review"));return{type:"custom:hubbubb-review-card",entity:t!=null?t:""}}set hass(e){this._hass=e,this._render()}getCardSize(){return 6}_call(e,t,r,i){this._track(this._hass.callService("hubbubb_home",e,t),r,i,e)}_track(e,t,r,i){this._note=t,this._render(),e.then(s=>{this._note=typeof r=="function"?r(s):r,this._render()},s=>{this._note=`${i} failed: ${(s==null?void 0:s.message)||s}`,this._render()})}_recheck(){let e=this._hass.callWS({type:"call_service",domain:"hubbubb_home",service:"review_recheck",service_data:{},return_response:!0});this._track(e,d,t=>{var r,i,s;return`re-check: ${(s=(i=(r=t==null?void 0:t.response)==null?void 0:r.fixed)==null?void 0:i.length)!=null?s:0} already fixed, closed`},"re-check")}_decide(e,t){this._call("review_decide",{id:e,decision:t},"saving\u2026",`saved: ${t}`)}_acceptAll(e){let t=r=>this._hass.callService("hubbubb_home","review_decide",{id:r,decision:"accepted"});this._track(Promise.all(e.map(t)),`accepting ${e.length}\u2026`,`accepted ${e.length}`,"accept all")}_item(e,t){let r=e.yaml?`<pre class="jr-yaml">${this._esc(e.yaml)}</pre>`:"";return`
      <div class="jr-item" data-id="${this._esc(e.id)}">
        <div class="jr-head">
          <span class="jr-kind jr-${e.kind}">${e.kind}</span>
          <span class="jr-title">${this._esc(e.title)}</span>
        </div>
        <div class="jr-body">${y(e.body,i=>this._esc(i))}${r}</div>
        <div class="jr-actions">
          <span class="jr-seen">${e.resolved?this._esc(e.resolved):`${e.status==="pending"?"first seen":e.status} ${this._esc(e.first_seen||"")}`}</span>
          ${t}
        </div>
      </div>`}_render(){var h,u;if(!this._hass)return;let e=this._hass.states[this._config.entity],t=(h=e==null?void 0:e.attributes)!=null?h:{},r=v(t.proposals),i=JSON.stringify([t.last_run,t.proposals,this._showDecided,this._note]);if(i===this._sig)return;this._sig=i;let s=(a,o,x="")=>`<button class="jr-btn ${x}" data-decide="${o}">${a}</button>`,f=r.pending.map(a=>this._item(a,s("Reject","rejected","jr-no")+s("Accept","accepted","jr-yes"))).join(""),m=r.accepted.map(a=>this._item(a,s("Undo","pending")+s("Mark done","done"))).join(""),j=r.decided.map(a=>this._item(a,s("Reopen","pending"))).join(""),p=this._note===c||this._note===d,w=t.last_run?new Date(t.last_run).toLocaleString():"never";this.innerHTML=`
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
          <span class="jr-sub">last run ${this._esc(w)}${t.detail?" \u2014 "+this._esc(t.detail):""}${this._note?" \xB7 "+this._esc(this._note):""}</span>
          <button class="jr-btn" data-recheck ${p?"disabled":""}>${this._note===d?"Checking\u2026":"Re-check open"}</button>
          <button class="jr-btn" data-run ${p?"disabled":""}>${this._note===c?"Running\u2026":"Run now"}</button>
        </div>
        <div class="jr-section">Waiting for you (${r.pending.length})
          ${r.pending.length>1?'<button class="jr-btn jr-yes" data-accept-all>Accept all</button>':""}
        </div>
        ${f||'<div class="jr-empty">Nothing waiting. The review runs at 04:00.</div>'}
        <div class="jr-section">Accepted \u2014 say "apply the nightly findings" (${r.accepted.length})</div>
        ${m||'<div class="jr-empty">Nothing accepted yet.</div>'}
        <div class="jr-section">
          <button class="jr-toggle" data-toggle>${this._showDecided?"Hide":"Show"} decided (${r.decided.length})</button>
        </div>
        ${this._showDecided?j:""}
      </ha-card>`,this.querySelectorAll(".jr-item").forEach(a=>a.querySelectorAll("[data-decide]").forEach(o=>o.addEventListener("click",()=>this._decide(a.dataset.id,o.dataset.decide)))),(u=this.querySelector("[data-accept-all]"))==null||u.addEventListener("click",()=>this._acceptAll(r.pending.map(a=>a.id))),this.querySelector("[data-toggle]").addEventListener("click",()=>{this._showDecided=!this._showDecided,this._render()}),this.querySelector("[data-recheck]").addEventListener("click",()=>this._recheck()),this.querySelector("[data-run]").addEventListener("click",()=>this._call("run_review",{},c,"review finished"))}_esc(e){return String(e).replace(/[&<>"']/g,t=>`&#${t.charCodeAt(0)};`)}};customElements.define("hubbubb-review-card",l);window.customCards=window.customCards||[];window.customCards.push({type:"hubbubb-review-card",name:"Hubbubb Review",description:"Accept or reject what the nightly review proposed"});
