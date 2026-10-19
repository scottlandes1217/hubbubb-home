var E=Object.defineProperty;var v=Object.getOwnPropertySymbols;var z=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable;var m=(n,e,t)=>e in n?E(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,j=(n,e)=>{for(var t in e||(e={}))z.call(e,t)&&m(n,t,e[t]);if(v)for(var t of v(e))L.call(e,t)&&m(n,t,e[t]);return n};function u(n){let e={pending:[],accepted:[],decided:[]};for(let s of Array.isArray(n)?n:[])s.status==="pending"?e.pending.push(s):s.status==="accepted"?e.accepted.push(s):e.decided.push(s);let t=s=>(s.last_seen||"")+(s.first_seen||"")+s.id;for(let s of Object.values(e))s.sort((r,i)=>t(r)<t(i)?1:-1);return e}function w(n,e){return e(n||"").replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/`([^`\n]+)`/g,"<code>$1</code>").replace(/\n/g,"<br>")}var l="running \u2014 the review takes a few minutes",p="re-checking against the current code \u2014 a few minutes",g=class extends HTMLElement{setConfig(e){if(!e||!e.entity)throw new Error("hubbubb-review-card: you need to define an `entity`");this._config=j({apply_automation:"automation.jarvis_apply_accepted_nightly_findings"},e),this._showDecided=!1,this._open=new Set}static getStubConfig(e){var s;let t=Object.keys((s=e==null?void 0:e.states)!=null?s:{}).find(r=>r.startsWith("sensor.")&&r.endsWith("_review"));return{type:"custom:hubbubb-review-card",entity:t!=null?t:""}}set hass(e){this._hass=e,this._render()}getCardSize(){return 6}_call(e,t,s,r){this._track(this._hass.callService("hubbubb_home",e,t),s,r,e)}_track(e,t,s,r){this._note=t,this._render(),e.then(i=>{this._note=typeof s=="function"?s(i):s,this._render()},i=>{this._note=`${r} failed: ${(i==null?void 0:i.message)||i}`,this._render()})}_recheck(){let e=this._hass.callWS({type:"call_service",domain:"hubbubb_home",service:"review_recheck",service_data:{},return_response:!0});this._track(e,p,t=>{var s,r,i;return`re-check: ${(i=(r=(s=t==null?void 0:t.response)==null?void 0:s.fixed)==null?void 0:r.length)!=null?i:0} already fixed, closed`},"re-check")}_decide(e,t){this._call("review_decide",{id:e,decision:t},"saving\u2026",`saved: ${t}`)}_acceptAll(e){let t=s=>this._hass.callService("hubbubb_home","review_decide",{id:s,decision:"accepted"});this._track(Promise.all(e.map(t)),`accepting ${e.length}\u2026`,`accepted ${e.length}`,"accept all")}async _apply(){var s,r,i;let e=(r=(s=this._hass.states[this._config.entity])==null?void 0:s.attributes)==null?void 0:r.proposals,t=this._hass.states[this._config.apply_automation];if(!(this._applying||((i=t==null?void 0:t.attributes)==null?void 0:i.current)>0||!t||["unavailable","unknown"].includes(t.state)||!u(e).accepted.length||this._note===l||this._note===p)){this._applying=!0,this._note="requesting application of accepted findings\u2026",this._render();try{await this._hass.callService("automation","trigger",{entity_id:this._config.apply_automation,skip_condition:!0}),this._note="apply request sent \u2014 findings will be marked done as they finish"}catch(o){this._note=`Apply Findings failed: ${(o==null?void 0:o.message)||o}`}finally{this._applying=!1,this._render()}}}_item(e,t){let s=e.yaml?`<pre class="jr-yaml">${this._esc(e.yaml)}</pre>`:"";return`
      <details class="jr-item" data-id="${this._esc(e.id)}" ${this._open.has(e.id)?"open":""}>
        <summary class="jr-head">
          <span class="jr-kind jr-${e.kind}">${e.kind}</span>
          <span class="jr-title">${this._esc(e.title)}</span>
        </summary>
        <div class="jr-body">${w(e.body,r=>this._esc(r))}${s}</div>
        <div class="jr-actions">
          <span class="jr-seen">${e.resolved?this._esc(e.resolved):`${e.status==="pending"?"first seen":e.status} ${this._esc(e.first_seen||"")}`}</span>
          ${t}
        </div>
      </details>`}_render(){var b,y,f;if(!this._hass)return;let e=this._hass.states[this._config.entity],t=(b=e==null?void 0:e.attributes)!=null?b:{},s=u(t.proposals),r=this._hass.states[this._config.apply_automation],i=this._applying||((y=r==null?void 0:r.attributes)==null?void 0:y.current)>0,o=r&&!["unavailable","unknown"].includes(r.state),_=JSON.stringify([t.last_run,t.detail,t.proposals,this._showDecided,this._note,i,o]);if(_===this._sig)return;this._sig=_;let c=(a,d,A="")=>`<button class="jr-btn ${A}" data-decide="${d}">${a}</button>`,x=s.pending.map(a=>this._item(a,c("Reject","rejected","jr-no")+c("Accept","accepted","jr-yes"))).join(""),k=s.accepted.map(a=>this._item(a,c("Undo","pending")+c("Mark done","done"))).join(""),$=s.decided.map(a=>this._item(a,c("Reopen","pending"))).join(""),h=i||this._note===l||this._note===p,S=t.last_run?new Date(t.last_run).toLocaleString():"never";this.innerHTML=`
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
        .jr-head::after { content: "\u203A"; margin-left: auto; padding-left: 8px; color: var(--secondary-text-color);
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
          <span class="jr-sub" role="status">last run ${this._esc(S)}${t.detail?" \u2014 "+this._esc(t.detail):""}${this._note?" \xB7 "+this._esc(this._note):""}</span>
          <button class="jr-btn" data-recheck ${h?"disabled":""}>${this._note===p?"Checking\u2026":"Re-check open"}</button>
          <button class="jr-btn" data-run ${h?"disabled":""}>${this._note===l?"Running\u2026":"Run now"}</button>
        </div>
        <div class="jr-section">Waiting for you (${s.pending.length})
          ${s.pending.length>1?'<button class="jr-btn jr-yes" data-accept-all>Accept all</button>':""}
        </div>
        ${x||'<div class="jr-empty">Nothing waiting. The review runs at 04:00.</div>'}
        <div class="jr-section"><span>Accepted (${s.accepted.length})</span>
          <button class="jr-btn jr-yes" data-apply ${h||!o||!s.accepted.length?"disabled":""}
            title="${o?"Apply accepted findings":"Applying findings is unavailable"}">${i?"Applying\u2026":"Apply Findings"}</button>
        </div>
        ${k||'<div class="jr-empty">Nothing accepted yet.</div>'}
        <div class="jr-section">
          <button class="jr-toggle" data-toggle>${this._showDecided?"Hide":"Show"} decided (${s.decided.length})</button>
        </div>
        ${this._showDecided?$:""}
      </ha-card>`,this.querySelectorAll(".jr-item").forEach(a=>{a.addEventListener("toggle",()=>a.open?this._open.add(a.dataset.id):this._open.delete(a.dataset.id)),a.querySelectorAll("[data-decide]").forEach(d=>d.addEventListener("click",()=>this._decide(a.dataset.id,d.dataset.decide)))}),(f=this.querySelector("[data-accept-all]"))==null||f.addEventListener("click",()=>this._acceptAll(s.pending.map(a=>a.id))),this.querySelector("[data-toggle]").addEventListener("click",()=>{this._showDecided=!this._showDecided,this._render()}),this.querySelector("[data-recheck]").addEventListener("click",()=>this._recheck()),this.querySelector("[data-apply]").addEventListener("click",()=>this._apply()),this.querySelector("[data-run]").addEventListener("click",()=>this._call("run_review",{},l,"review finished"))}_esc(e){return String(e).replace(/[&<>"']/g,t=>`&#${t.charCodeAt(0)};`)}};customElements.define("hubbubb-review-card",g);window.customCards=window.customCards||[];window.customCards.push({type:"hubbubb-review-card",name:"Hubbubb Review",description:"Accept or reject what the nightly review proposed"});
