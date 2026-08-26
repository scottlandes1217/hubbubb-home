var u=Object.defineProperty;var b=(s,e,i)=>e in s?u(s,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):s[e]=i;var l=(s,e,i)=>b(s,typeof e!="symbol"?e+"":e,i);var d=class d extends HTMLElement{setConfig(e){this._config={prefix:"hubbubb_timer",...e}}set hass(e){this._hass=e,this._render()}connectedCallback(){this._tick=setInterval(()=>this._render(),500)}disconnectedCallback(){clearInterval(this._tick)}getCardSize(){return 2}_timers(){let e=[];for(let i=1;i<=d.SLOTS;i++){let t=this._hass.states[`timer.${this._config.prefix}_${i}`];if(!t||t.state!=="active"&&t.state!=="paused")continue;let a=this._hass.states[`input_text.${this._config.prefix}_${i}_name`],r=(a&&a.state&&!["unknown","unavailable"].includes(a.state)?a.state:"").trim(),o=this._hms(t.attributes.duration),n;t.state==="active"&&t.attributes.finishes_at?n=Math.max(0,(new Date(t.attributes.finishes_at)-Date.now())/1e3):n=this._hms(t.attributes.remaining),e.push({entity:t.entity_id,label:r||"Timer",remainingS:n,durationS:o,paused:t.state==="paused"})}return e}_hms(e){return e?String(e).split(":").reduce((i,t)=>i*60+Number(t),0):0}_fmt(e){e=Math.ceil(e);let i=Math.floor(e/3600),t=Math.floor(e%3600/60),a=Math.floor(e%60),r=i?String(t).padStart(2,"0"):String(t);return(i?`${i}:${r}:`:`${t}:`)+String(a).padStart(2,"0")}_render(){if(!this._hass)return;let e=this._timers(),i=e.map(t=>t.entity+t.label+t.paused).join("|")||"empty";i!==this._sig&&(this._sig=i,this._build(e));for(let t of e){let a=this.querySelector(`[data-entity="${t.entity}"]`);if(!a)continue;a.querySelector(".jt-time").textContent=t.paused?`${this._fmt(t.remainingS)} \u23F8`:this._fmt(t.remainingS);let r=t.durationS?Math.min(100,t.remainingS/t.durationS*100):0;a.querySelector(".jt-fill").style.width=`${r}%`}}_build(e){let i=e.map(a=>`
      <div class="jt-row" data-entity="${a.entity}">
        <div class="jt-top">
          <span class="jt-label">${this._esc(a.label)}</span>
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
        ${i||'<div class="jt-empty">No timers running \u2014 ask for ono set one, or start one below.</div>'}
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
      </ha-card>`,this.querySelectorAll(".jt-row").forEach(a=>{let r=a.dataset.entity;a.querySelectorAll("[data-add]").forEach(o=>o.addEventListener("click",()=>{let n=this._timers().find(p=>p.entity===r);n&&this._hass.callService("timer","start",{entity_id:r,duration:Math.max(0,Math.round(n.remainingS))+Number(o.dataset.add)})})),a.querySelector("[data-cancel]").addEventListener("click",()=>this._hass.callService("timer","cancel",{entity_id:r}))});let t=a=>{!a||a<=0||this._hass.callService("hubbubb_home","timer_start",{jt_name:this.querySelector("[data-name]").value.trim(),jt_hours:0,jt_minutes:a,jt_seconds:0})};this.querySelector("[data-start]").addEventListener("click",()=>t(Number(this.querySelector("[data-min]").value))),this.querySelector("[data-min]").addEventListener("keydown",a=>{a.key==="Enter"&&t(Number(a.target.value))}),this.querySelectorAll("[data-preset]").forEach(a=>a.addEventListener("click",()=>t(Number(a.dataset.preset))))}_esc(e){return e.replace(/[&<>"']/g,i=>`&#${i.charCodeAt(0)};`)}};l(d,"SLOTS",5);var c=d;customElements.define("hubbubb-timers-card",c);window.customCards=window.customCards||[];window.customCards.push({type:"hubbubb-timers-card",name:"Hubbubb Timers",description:"Live countdowns for the voice timer pool"});
