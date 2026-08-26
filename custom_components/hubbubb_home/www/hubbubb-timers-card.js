var n=class extends HTMLElement{setConfig(e){if(!e||!e.entity)throw new Error("hubbubb-timers-card: you need to define an `entity`");this._config={...e}}static getStubConfig(e){return{type:"custom:hubbubb-timers-card",entity:Object.keys(e?.states??{}).find(t=>t.startsWith("sensor.")&&t.endsWith("_timers"))??""}}set hass(e){this._hass=e,this._render()}connectedCallback(){this._tick=setInterval(()=>this._render(),500)}disconnectedCallback(){clearInterval(this._tick)}getCardSize(){return 2}_timers(){let a=this._hass?.states?.[this._config.entity]?.attributes?.timers;return Array.isArray(a)?a.map(t=>({id:t.id,label:t.name||"Timer",durationS:Number(t.duration)||0,remainingS:t.paused?Number(t.remaining)||0:Math.max(0,(new Date(t.finishes_at)-Date.now())/1e3),paused:!!t.paused})):[]}_fmt(e){e=Math.ceil(e);let a=Math.floor(e/3600),t=Math.floor(e%3600/60),r=Math.floor(e%60),i=a?String(t).padStart(2,"0"):String(t);return(a?`${a}:${i}:`:`${t}:`)+String(r).padStart(2,"0")}_render(){if(!this._hass)return;let e=this._timers(),a=e.map(t=>t.entity+t.label+t.paused).join("|")||"empty";a!==this._sig&&(this._sig=a,this._build(e));for(let t of e){let r=this.querySelector(`[data-timer="${t.id}"]`);if(!r)continue;r.querySelector(".jt-time").textContent=t.paused?`${this._fmt(t.remainingS)} \u23F8`:this._fmt(t.remainingS);let i=t.durationS?Math.min(100,t.remainingS/t.durationS*100):0;r.querySelector(".jt-fill").style.width=`${i}%`}}_build(e){let a=e.map(r=>`
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
        ${a||'<div class="jt-empty">No timers running \u2014 ask out loud, or start one below.</div>'}
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
      </ha-card>`,this.querySelectorAll(".jt-row").forEach(r=>{let i=r.dataset.timer;r.querySelectorAll("[data-add]").forEach(s=>s.addEventListener("click",()=>this._hass.callService("hubbubb_home","timer_add",{timer_id:i,seconds:Number(s.dataset.add)}))),r.querySelector("[data-cancel]").addEventListener("click",()=>this._hass.callService("hubbubb_home","timer_cancel",{timer_id:i}))});let t=r=>{!r||r<=0||this._hass.callService("hubbubb_home","timer_start",{name:this.querySelector("[data-name]").value.trim(),minutes:r})};this.querySelector("[data-start]").addEventListener("click",()=>t(Number(this.querySelector("[data-min]").value))),this.querySelector("[data-min]").addEventListener("keydown",r=>{r.key==="Enter"&&t(Number(r.target.value))}),this.querySelectorAll("[data-preset]").forEach(r=>r.addEventListener("click",()=>t(Number(r.dataset.preset))))}_esc(e){return e.replace(/[&<>"']/g,a=>`&#${a.charCodeAt(0)};`)}};customElements.define("hubbubb-timers-card",n);window.customCards=window.customCards||[];window.customCards.push({type:"hubbubb-timers-card",name:"Hubbubb Timers",description:"Live countdowns for the voice timer pool"});
