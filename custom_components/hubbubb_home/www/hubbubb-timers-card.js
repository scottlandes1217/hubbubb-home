var p=Object.defineProperty;var d=Object.getOwnPropertySymbols;var u=Object.prototype.hasOwnProperty,b=Object.prototype.propertyIsEnumerable;var c=(s,t,e)=>t in s?p(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e,l=(s,t)=>{for(var e in t||(t={}))u.call(t,e)&&c(s,e,t[e]);if(d)for(var e of d(t))b.call(t,e)&&c(s,e,t[e]);return s};var o=class extends HTMLElement{setConfig(t){if(!t||!t.entity)throw new Error("hubbubb-timers-card: you need to define an `entity`");this._config=l({},t)}static getStubConfig(t){var a;let e=Object.keys((a=t==null?void 0:t.states)!=null?a:{}).find(r=>r.startsWith("sensor.")&&r.endsWith("_timers"));return{type:"custom:hubbubb-timers-card",entity:e!=null?e:""}}set hass(t){this._hass=t,this._render()}connectedCallback(){this._tick=setInterval(()=>this._render(),500)}disconnectedCallback(){clearInterval(this._tick)}getCardSize(){return 2}_timers(){var a,r,n;let t=(r=(a=this._hass)==null?void 0:a.states)==null?void 0:r[this._config.entity],e=(n=t==null?void 0:t.attributes)==null?void 0:n.timers;return Array.isArray(e)?e.map(i=>({id:i.id,label:i.name||"Timer",durationS:Number(i.duration)||0,remainingS:i.paused?Number(i.remaining)||0:Math.max(0,(new Date(i.finishes_at)-Date.now())/1e3),paused:!!i.paused})):[]}_fmt(t){t=Math.ceil(t);let e=Math.floor(t/3600),a=Math.floor(t%3600/60),r=Math.floor(t%60),n=e?String(a).padStart(2,"0"):String(a);return(e?`${e}:${n}:`:`${a}:`)+String(r).padStart(2,"0")}_render(){if(!this._hass)return;let t=this._timers(),e=t.map(a=>a.entity+a.label+a.paused).join("|")||"empty";e!==this._sig&&(this._sig=e,this._build(t));for(let a of t){let r=this.querySelector(`[data-timer="${a.id}"]`);if(!r)continue;r.querySelector(".jt-time").textContent=a.paused?`${this._fmt(a.remainingS)} \u23F8`:this._fmt(a.remainingS);let n=a.durationS?Math.min(100,a.remainingS/a.durationS*100):0;r.querySelector(".jt-fill").style.width=`${n}%`}}_build(t){let e=t.map(r=>`
      <div class="jt-row" data-timer="${r.id}">
        <div class="jt-top">
          <span class="jt-label">${this._esc(r.label)}</span>
          <span class="jt-time"></span>
        </div>
        <div class="jt-bar"><div class="jt-fill"></div></div>
        <div class="jt-actions">
          <button class="jt-btn" data-add="60">+1 min</button>
          <button class="jt-btn" data-add="300">+5 min</button>
          <button class="jt-btn jt-cancel" data-cancel>Cancel</button>
        </div>
      </div>`).join("");this.innerHTML=`
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
        ${e||'<div class="jt-empty">No timers running \u2014 ask out loud, or start one below.</div>'}
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
      </ha-card>`,this.querySelectorAll(".jt-row").forEach(r=>{let n=r.dataset.timer;r.querySelectorAll("[data-add]").forEach(i=>i.addEventListener("click",()=>this._hass.callService("hubbubb_home","timer_add",{timer_id:n,seconds:Number(i.dataset.add)}))),r.querySelector("[data-cancel]").addEventListener("click",()=>this._hass.callService("hubbubb_home","timer_cancel",{timer_id:n}))});let a=r=>{!r||r<=0||this._hass.callService("hubbubb_home","timer_start",{name:this.querySelector("[data-name]").value.trim(),minutes:r})};this.querySelector("[data-start]").addEventListener("click",()=>a(Number(this.querySelector("[data-min]").value))),this.querySelector("[data-min]").addEventListener("keydown",r=>{r.key==="Enter"&&a(Number(r.target.value))}),this.querySelectorAll("[data-preset]").forEach(r=>r.addEventListener("click",()=>a(Number(r.dataset.preset))))}_esc(t){return t.replace(/[&<>"']/g,e=>`&#${e.charCodeAt(0)};`)}};customElements.define("hubbubb-timers-card",o);window.customCards=window.customCards||[];window.customCards.push({type:"hubbubb-timers-card",name:"Hubbubb Timers",description:"Live countdowns for the voice timer pool"});
