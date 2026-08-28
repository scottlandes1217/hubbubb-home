/* Hubbubb remote card — the Siri Remote as one card, plus a text field that
 * types straight onto the Apple TV.
 *
 * config:  type: custom:hubbubb-remote-card
 *          entity: media_player.YOUR_APPLE_TV
 *          remote: remote.YOUR_APPLE_TV   # optional, found via device
 *          volume_entity: media_player.YOUR_TV   # optional
 *
 * Volume up/down prefer the apple_tv_hid custom component (a separate install:
 * it presses the same Companion HID key the Siri Remote does, because core's
 * volume_up waits on a volume level the Apple TV never reports over HDMI).
 * Without it, volume falls back to media_player volume on volume_entity — most
 * TVs take that fine; it is only the Apple TV itself that cannot. There is no
 * HID mute key (the remote's mute button is CEC/IR straight to the TV), so the
 * mute button only appears when volume_entity names something that can mute.
 *
 * Buttons go through remote.send_command, and the text field through
 * apple_tv.set_keyboard_text — which targets a config entry rather than an
 * entity, looked up once from the entity registry.
 */

const PAD = [
  ["", "", ""],
  ["mdi:chevron-up", "up", "Up"],
  ["", "", ""],
  ["mdi:chevron-left", "left", "Left"],
  ["", "select", "OK"],
  ["mdi:chevron-right", "right", "Right"],
  ["", "", ""],
  ["mdi:chevron-down", "down", "Down"],
  ["", "", ""],
];

class HubbubbRemoteCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) throw new Error("hubbubb-remote-card: entity is required");
    this._config = config;
    this._built = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) this._build();
    this._update();
  }

  disconnectedCallback() {
    clearTimeout(this._holdDelay);
    clearInterval(this._holdRepeat);
  }

  getCardSize() {
    return 6;
  }

  // Sections view: half a column wide, tall enough for the whole remote.
  getGridOptions() {
    return { rows: 6, columns: 6, min_rows: 5, min_columns: 4 };
  }

  _entity(domain) {
    // Sibling entity on the same device — survives entity_id renames.
    this._siblings ||= {};
    if (domain in this._siblings) return this._siblings[domain];
    const me = this._hass.entities?.[this._config.entity];
    const found = me?.device_id
      ? Object.values(this._hass.entities).find(
          (e) =>
            e.device_id === me.device_id && e.entity_id.startsWith(domain + ".")
        )?.entity_id
      : undefined;
    return (this._siblings[domain] = found);
  }

  get _remote() {
    return this._config.remote || (this._remoteId ||= this._entity("remote"));
  }

  _send(command) {
    if (!this._remote) return;
    // Any press on the physical remote wakes the Apple TV and clears the
    // screensaver; a key sent cold does not. State is no help here (this Apple
    // TV under-reports), so go by silence instead: the first press after a
    // lull gets a wake in front of it, which is harmless when already awake.
    const now = Date.now();
    if (now - (this._lastPress || 0) > 5000) {
      this._hass.callService("remote", "send_command", {
        entity_id: this._remote,
        command: "wakeup",
      });
    }
    this._lastPress = now;
    this._hass.callService("remote", "send_command", {
      entity_id: this._remote,
      command,
    });
  }

  _mp(service, data) {
    this._hass.callService("media_player", service, {
      entity_id: this._config.entity,
      ...data,
    });
  }

  _volume(direction) {
    // The Siri Remote's volume keys, when apple_tv_hid is installed (see the
    // header); otherwise plain media_player volume on whatever will take it.
    if (this._hass.services?.apple_tv_hid) {
      this._hass.callService("apple_tv_hid", "press", {
        entity_id: this._config.entity,
        command: `volume_${direction}`,
      });
      return;
    }
    this._hass.callService("media_player", `volume_${direction}`, {
      entity_id: this._config.volume_entity || this._config.entity,
    });
  }

  _mute() {
    const muted =
      this._hass.states[this._config.volume_entity]?.attributes.is_volume_muted;
    this._hass.callService("media_player", "volume_mute", {
      entity_id: this._config.volume_entity,
      is_volume_muted: !muted,
    });
  }

  async _type(text) {
    // apple_tv keyboard services take a config_entry_id, not a target entity.
    this._entryId ||= (
      await this._hass.callWS({
        type: "config/entity_registry/get",
        entity_id: this._config.entity,
      })
    ).config_entry_id;
    await this._hass.callService("apple_tv", "set_keyboard_text", {
      config_entry_id: this._entryId,
      text,
    });
  }

  _button(icon, label, onClick, cls = "", repeat = false) {
    const b = document.createElement("button");
    b.className = cls;
    b.title = label;
    b.setAttribute("aria-label", label);
    if (icon) b.innerHTML = `<ha-icon icon="${icon}"></ha-icon>`;
    if (!repeat) {
      b.addEventListener("click", onClick);
      return b;
    }
    // Holding an arrow or the volume rocker repeats, the way the remote does:
    // fire at once, pause, then stream until the finger lifts.
    const stop = () => {
      clearTimeout(this._holdDelay);
      clearInterval(this._holdRepeat);
    };
    b.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      stop();
      onClick();
      this._holdDelay = setTimeout(() => {
        this._holdRepeat = setInterval(onClick, 150);
      }, 420);
    });
    for (const ev of ["pointerup", "pointerleave", "pointercancel"]) {
      b.addEventListener(ev, stop);
    }
    // pointerdown already fired, so only take keyboard-generated clicks
    // (Enter/Space report detail 0) — otherwise every tap counts twice.
    b.addEventListener("click", (e) => {
      if (e.detail === 0) onClick();
    });
    return b;
  }

  _build() {
    this._built = true;
    this.innerHTML = `
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
      </ha-card>`;

    const pad = this.querySelector(".pad");
    for (const [icon, command, label] of PAD) {
      if (!command) {
        pad.appendChild(document.createElement("span"));
        continue;
      }
      pad.appendChild(
        this._button(
          icon,
          label,
          () => this._send(command),
          command === "select" ? "ok" : "",
          command !== "select"
        )
      );
    }

    const top = this.querySelector(".top");
    top.append(
      this._button("mdi:arrow-u-left-top", "Back", () => this._send("menu")),
      this._button("mdi:power", "Power", () => this._mp("toggle"))
    );

    const vol = this.querySelector(".vol");
    vol.append(
      this._button("mdi:minus", "Volume down", () => this._volume("down"), "", true)
    );
    if (this._config.volume_entity) {
      vol.append(
        (this._muteBtn = this._button("mdi:volume-off", "Mute", () => this._mute()))
      );
    }
    vol.append(
      this._button("mdi:plus", "Volume up", () => this._volume("up"), "", true)
    );

    const bottom = this.querySelector(".bottom");
    bottom.append(
      this._button("mdi:television", "TV", () => this._send("home")),
      this._button("mdi:play-pause", "Play/Pause", () => this._send("play_pause"))
    );

    const input = this.querySelector("input");
    input.addEventListener("input", () => {
      // set_keyboard_text replaces the whole field, so debounce and send it all.
      clearTimeout(this._debounce);
      this._debounce = setTimeout(() => this._type(input.value), 200);
    });
    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      clearTimeout(this._debounce);
      this._type(input.value).then(() => {
        this._send("select");
        input.value = "";
      });
    });
  }

  _update() {
    // ponytail: state is only shown, never gated on — this Apple TV under-reports
    // `playing`. Gate on it only once the integration stops lying.
    const attrs = this._hass.states[this._config.entity]?.attributes || {};
    this.querySelector(".app").textContent = attrs.app_name || "";
    if (this._muteBtn) {
      const muted =
        this._hass.states[this._config.volume_entity]?.attributes
          .is_volume_muted;
      this._muteBtn
        .querySelector("ha-icon")
        .setAttribute("icon", muted ? "mdi:volume-high" : "mdi:volume-off");
    }

    // The text field only exists while the Apple TV has a field focused.
    const focus = this._hass.states[this._entity("binary_sensor") || ""];
    const live = focus?.state === "on";
    const kb = this.querySelector(".kb");
    if (live === kb.classList.contains("live")) return;
    kb.classList.toggle("live", live);
    if (!live) this.querySelector("input").value = "";
  }
}

customElements.define("hubbubb-remote-card", HubbubbRemoteCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "hubbubb-remote-card",
  name: "Hubbubb Remote",
  description: "Siri Remote with keyboard text entry",
});
