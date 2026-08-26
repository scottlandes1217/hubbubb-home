var c=[["","",""],["mdi:chevron-up","up","Up"],["","",""],["mdi:chevron-left","left","Left"],["","select","OK"],["mdi:chevron-right","right","Right"],["","",""],["mdi:chevron-down","down","Down"],["","",""]],d=class extends HTMLElement{setConfig(t){if(!t.entity)throw new Error("hubbubb-remote-card: entity is required");this._config=t,this._built=!1}set hass(t){this._hass=t,this._built||this._build(),this._update()}disconnectedCallback(){clearTimeout(this._holdDelay),clearInterval(this._holdRepeat)}getCardSize(){return 6}getGridOptions(){return{rows:6,columns:6,min_rows:5,min_columns:4}}_entity(t){if(this._siblings||(this._siblings={}),t in this._siblings)return this._siblings[t];let s=this._hass.entities?.[this._config.entity],e=s?.device_id?Object.values(this._hass.entities).find(n=>n.device_id===s.device_id&&n.entity_id.startsWith(t+"."))?.entity_id:void 0;return this._siblings[t]=e}get _remote(){return this._config.remote||this._remoteId||(this._remoteId=this._entity("remote"))}_send(t){if(!this._remote)return;let s=Date.now();s-(this._lastPress||0)>5e3&&this._hass.callService("remote","send_command",{entity_id:this._remote,command:"wakeup"}),this._lastPress=s,this._hass.callService("remote","send_command",{entity_id:this._remote,command:t})}_mp(t,s){this._hass.callService("media_player",t,{entity_id:this._config.entity,...s})}_hid(t){this._hass.callService("apple_tv_hid","press",{entity_id:this._config.entity,command:t})}_mute(){let t=this._hass.states[this._config.volume_entity]?.attributes.is_volume_muted;this._hass.callService("media_player","volume_mute",{entity_id:this._config.volume_entity,is_volume_muted:!t})}async _type(t){this._entryId||(this._entryId=(await this._hass.callWS({type:"config/entity_registry/get",entity_id:this._config.entity})).config_entry_id),await this._hass.callService("apple_tv","set_keyboard_text",{config_entry_id:this._entryId,text:t})}_button(t,s,e,n="",o=!1){let i=document.createElement("button");if(i.className=n,i.title=s,i.setAttribute("aria-label",s),t&&(i.innerHTML=`<ha-icon icon="${t}"></ha-icon>`),!o)return i.addEventListener("click",e),i;let r=()=>{clearTimeout(this._holdDelay),clearInterval(this._holdRepeat)};i.addEventListener("pointerdown",a=>{a.preventDefault(),r(),e(),this._holdDelay=setTimeout(()=>{this._holdRepeat=setInterval(e,150)},420)});for(let a of["pointerup","pointerleave","pointercancel"])i.addEventListener(a,r);return i.addEventListener("click",a=>{a.detail===0&&e()}),i}_build(){this._built=!0,this.innerHTML=`
      <ha-card>
        <style>
          .atv { padding: 10px 12px 12px; }
          .head { display: flex; align-items: center; gap: 8px; height: 26px;
                  color: var(--secondary-text-color); }
          .head ha-icon { --mdc-icon-size: 18px; flex: none; }
          .app { font-size: 13px;
                 overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .body { max-width: 168px; margin: 0 auto; display: flex;
                  flex-direction: column; align-items: center; gap: 7px;
                  padding: 10px; border-radius: 26px;
                  background: var(--secondary-background-color); }
          .row { display: flex; justify-content: space-between;
                 align-items: center; gap: 8px; width: 100%; }
          button {
            display: flex; align-items: center; justify-content: center;
            width: 36px; height: 36px; padding: 0; border: none;
            border-radius: 50%; cursor: pointer;
            color: var(--primary-text-color);
            background: var(--card-background-color);
          }
          button:active { filter: brightness(1.35); }
          button ha-icon { --mdc-icon-size: 20px; }
          .pad {
            display: grid; grid-template-columns: repeat(3, 1fr);
            width: 100%; max-width: 132px; aspect-ratio: 1; border-radius: 50%;
            background: var(--card-background-color); place-items: center;
          }
          .pad button { width: 100%; height: 100%; background: none; }
          .pad button ha-icon { opacity: .45; }
          .pad .ok {
            width: 62%; height: 62%; border-radius: 50%;
            background: var(--secondary-background-color);
          }
          .pad span { pointer-events: none; }
          .vol { display: flex; align-items: center; justify-content: center;
                 width: 100%; border-radius: 18px;
                 background: var(--card-background-color); }
          .vol button { flex: 1; background: none; }
          .kb { display: none; align-items: center; gap: 6px; margin-top: 10px; }
          .kb.live { display: flex; }
          .kb ha-icon { color: var(--primary-color); --mdc-icon-size: 20px; }
          .kb input {
            flex: 1; min-width: 0; height: 34px; padding: 0 10px;
            border-radius: 10px; border: 1px solid var(--divider-color);
            background: var(--card-background-color);
            color: var(--primary-text-color); font: inherit; font-size: 14px;
          }
          .kb input:focus { outline: none; border-color: var(--primary-color); }
        </style>
        <div class="atv">
          <div class="head">
            <ha-icon icon="mdi:apple"></ha-icon>
            <span class="app"></span>
          </div>
          <div class="body">
            <div class="row top"></div>
            <div class="pad"></div>
            <div class="row bottom"></div>
            <div class="vol"></div>
          </div>
          <div class="kb">
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
            <input type="text" placeholder="Type on Apple TV" autocomplete="off"
                   autocapitalize="off" autocorrect="off" spellcheck="false">
          </div>
        </div>
      </ha-card>`;let t=this.querySelector(".pad");for(let[i,r,a]of c){if(!r){t.appendChild(document.createElement("span"));continue}t.appendChild(this._button(i,a,()=>this._send(r),r==="select"?"ok":"",r!=="select"))}this.querySelector(".top").append(this._button("mdi:arrow-u-left-top","Back",()=>this._send("menu")),this._button("mdi:power","Power",()=>this._mp("toggle")));let e=this.querySelector(".vol");e.append(this._button("mdi:minus","Volume down",()=>this._hid("volume_down"),"",!0)),this._config.volume_entity&&e.append(this._muteBtn=this._button("mdi:volume-off","Mute",()=>this._mute())),e.append(this._button("mdi:plus","Volume up",()=>this._hid("volume_up"),"",!0)),this.querySelector(".bottom").append(this._button("mdi:television","TV",()=>this._send("home")),this._button("mdi:play-pause","Play/Pause",()=>this._send("play_pause")));let o=this.querySelector("input");o.addEventListener("input",()=>{clearTimeout(this._debounce),this._debounce=setTimeout(()=>this._type(o.value),200)}),o.addEventListener("keydown",i=>{i.key==="Enter"&&(clearTimeout(this._debounce),this._type(o.value).then(()=>{this._send("select"),o.value=""}))})}_update(){let t=this._hass.states[this._config.entity]?.attributes||{};if(this.querySelector(".app").textContent=t.app_name||"",this._muteBtn){let o=this._hass.states[this._config.volume_entity]?.attributes.is_volume_muted;this._muteBtn.querySelector("ha-icon").setAttribute("icon",o?"mdi:volume-high":"mdi:volume-off")}let e=this._hass.states[this._entity("binary_sensor")||""]?.state==="on",n=this.querySelector(".kb");e!==n.classList.contains("live")&&(n.classList.toggle("live",e),e||(this.querySelector("input").value=""))}};customElements.define("hubbubb-remote-card",d);window.customCards=window.customCards||[];window.customCards.push({type:"hubbubb-remote-card",name:"Hubbubb Remote",description:"Siri Remote with keyboard text entry"});
