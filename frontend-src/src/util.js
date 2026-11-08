import { html } from "lit";
export const fmtBytes = (b) =>
  b == null ? "n/a" : b >= 1073741824 ? (b / 1073741824).toFixed(2) + " GB" : b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : b >= 1024 ? Math.round(b / 1024) + " KB" : b + " B";
export const FACET_LABELS = { suggestion: "Suggestion", integration: "Integration", device: "Device", domain: "Type", status: "Status", defined_in: "Defined in", used_in: "Referenced In 🔗", retention: "Retention", age: "Last update" };
export const STATUS_HELP = "Active = exists and is enabled. Disabled = turned off in Settings > Entities. Orphaned = history exists but no entity matches. External = statistics from another source.";
export const fmtAge = (s) => (s < 90 ? `${s}s` : s < 5400 ? `${Math.round(s / 60)} min` : s < 129600 ? `${Math.round(s / 3600)} h` : `${Math.round(s / 86400)} days`) + " ago";
export const fmtMs = (ms) => (ms == null ? "" : ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s`);
export const SUGGEST_HELP = "Remove history = no entity exists, it is disabled, or it is imported statistics that stopped updating, so the history is leftover. Disable = still exists but looks unused and stale, or is unavailable and no longer updating. Remove from YAML = defined in YAML without a unique ID, so it cannot be disabled here. Review = might be unused, check before acting. Keep = referenced in your config. Suggestions are advice from a text scan and cannot see dynamic templates or outside systems.";
export const fmtPeriod = (a, b) => {
  const o = { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" };
  return `${new Date(a * 1000).toLocaleString([], o)} to ${new Date(b * 1000).toLocaleString([], o)}`;
};

const DOMAIN_ICON = { sensor: "mdi:eye", binary_sensor: "mdi:radiobox-blank", light: "mdi:lightbulb", switch: "mdi:toggle-switch", cover: "mdi:window-shutter", climate: "mdi:thermostat", number: "mdi:ray-vertex", select: "mdi:format-list-bulleted", input_boolean: "mdi:toggle-switch-outline", device_tracker: "mdi:account", media_player: "mdi:cast", camera: "mdi:video", update: "mdi:package-up" };
// The entity's icon as Home Assistant shows it. Disabled and orphaned entities have no live
// state, so a stand-in state lets ha-state-icon still pick the registry or domain icon.
export const entityIcon = (hass, eid) => {
  const reg = hass?.entities?.[eid];
  if (customElements.get("ha-state-icon")) {
    const st = hass?.states?.[eid] ?? { entity_id: eid, state: "unknown", attributes: {}, context: {} };
    return html`<ha-state-icon .hass=${hass} .stateObj=${st} .icon=${reg?.icon}></ha-state-icon>`;
  }
  return html`<ha-icon .icon=${reg?.icon || hass?.states?.[eid]?.attributes?.icon || DOMAIN_ICON[eid.split(".")[0]] || "mdi:help-circle-outline"}></ha-icon>`;
};

// Colours shared by the entity size bars and the size chart: states (blue) against long-term statistics (amber).
export const COLOR_STATS = "#8353d1";
// States and long-term statistics use Home Assistant theme colours, so the theme decides.
export const VAR_STATES = "var(--ha-color-primary-20, #488fc2)";
export const VAR_STATS = "var(--ha-color-border-primary-loud, #8353d1)";
export const themeColor = (el, name, fallback) => (el && getComputedStyle(el).getPropertyValue(name).trim()) || fallback;
export const COLOR_UNDO = "#b5b5b5";
export const fmtDay = (ts) => new Date(ts * 1000).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

// Dialog choices the user made last time, remembered in this browser (never needed to work).
export const prefs = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem("db_storage.prefs") || "{}")[k]; return v === undefined ? d : v; } catch (e) { return d; } },
  set(k, v) { try { const o = JSON.parse(localStorage.getItem("db_storage.prefs") || "{}"); o[k] = v; localStorage.setItem("db_storage.prefs", JSON.stringify(o)); } catch (e) { /* storage unavailable */ } },
};
