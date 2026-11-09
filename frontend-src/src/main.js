import { LitElement, html, css } from "lit";
import "./overview.js";
import "./entities.js";
import "./progress.js";
import "./history.js";
import "./inspect.js";
import { FACET_LABELS, fmtAge, fmtBytes, fmtPeriod, prefs } from "./util.js";

const DAY_CHOICES = [1, 3, 5, 7, "default"];

class DbStoragePanel extends LitElement {
  static properties = {
    all: { state: true }, window: { state: true }, chipsIn: { state: true }, inspect: { state: true }, job: { state: true }, modal: { state: true }, actionsList: { state: true }, live: { state: true }, menuOpen: { state: true }, reclaim: { state: true }, now: { state: true }, hass: { attribute: false }, narrow: { type: Boolean }, tab: { state: true }, data: { state: true }, history: { state: true },
    days: { state: true }, filters: { state: true }, search: { state: true }, sort: { state: true }, selected: { state: true },
    shown: { state: true }, usage: { state: true }, resync: { state: true }, expand: { state: true }, hideAuto: { state: true }, ret: { state: true }, notice: { state: true }, retBusy: { state: true }, progress: { state: true }, error: { state: true },
  };
  static styles = css`
    :host{display:block;height:100%;overflow:auto;box-sizing:border-box;padding:16px;color:var(--primary-text-color);background:var(--primary-background-color)}
    .wrap{max-width:1280px;margin:0 auto} h2{margin:0 0 8px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .tabs{display:flex;gap:4px;border-bottom:1px solid var(--divider-color);margin-bottom:12px}
    .tabs button{font:inherit;background:none;border:none;border-bottom:3px solid transparent;padding:8px 14px;color:var(--secondary-text-color);cursor:pointer}
    .tabs button.on{color:var(--primary-text-color);border-bottom-color:var(--primary-color)}
    .err{background:var(--error-color,#c33);color:#fff;border-radius:8px;padding:8px 12px;margin-bottom:10px}
    .chips{display:inline-flex;gap:6px;flex-wrap:wrap;margin-left:10px;font-weight:400}.chips.pending .fchip{opacity:0}.chips.in .fchip{animation:chipin .5s ease-out}
    .fchip{font-size:12px;border:1px solid var(--primary-color);border-radius:12px;padding:1px 10px;cursor:pointer;white-space:nowrap}.chips:hover .fchip{animation:none;opacity:1}
    @keyframes chipin{from{opacity:0;transform:translateY(-4px) scale(.92);box-shadow:0 0 0 4px color-mix(in srgb,var(--primary-color) 45%,transparent)}to{opacity:1;transform:none;box-shadow:0 0 0 0 transparent}}
    .fchip:hover{background:color-mix(in srgb,var(--primary-color) 15%,transparent)}.fchip.clear{border-color:var(--secondary-text-color);color:var(--secondary-text-color)}
.scan{margin-left:auto;display:inline-flex;align-items:center;gap:10px;font-size:13px;font-weight:400}
    .lastscan{color:var(--secondary-text-color);cursor:help;white-space:nowrap}
    .lastscan.need{color:var(--success-color,#43a047);font-weight:700}
    .rescan.need{background:var(--success-color,#43a047);border-color:var(--success-color,#43a047);color:#fff}
    .split{position:relative;display:inline-flex}
    .rescan{font:inherit;padding:5px 8px;border:1px solid var(--primary-color);background:transparent;color:var(--primary-text-color);cursor:pointer;display:inline-flex;align-items:center}
    .rescan.main{border-radius:8px 0 0 8px;border-right-width:0} .rescan.arrow{border-radius:0 8px 8px 0;padding:5px 4px}
    .rescan[disabled]{opacity:.5;cursor:default} .spin{animation:rot 1s linear infinite} @keyframes rot{to{transform:rotate(360deg)}}
    .menu-pop{position:absolute;right:0;top:calc(100% + 4px);z-index:10;width:280px;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.3);padding:4px}
    .menu-pop button{display:block;width:100%;text-align:left;font:inherit;background:none;border:none;color:var(--primary-text-color);padding:8px 10px;border-radius:8px;cursor:pointer}
    .menu-pop button:hover{background:var(--secondary-background-color)} .menu-pop span{display:block;font-size:12px;color:var(--secondary-text-color);margin-top:2px}
    .menu-pop a{display:block;font-size:12px;color:var(--primary-color);padding:0 10px 6px;text-decoration:none;cursor:pointer} .menu-pop a:hover{text-decoration:underline}
    .dlg .seg{display:inline-flex;margin:6px 0} .dlg .seg button{border-radius:0;margin-left:-1px;padding:5px 12px} .dlg .seg button:first-child{border-radius:8px 0 0 8px;margin-left:0} .dlg .seg button:last-child{border-radius:0 8px 8px 0}
    .dlg .seg button.on{background:var(--primary-color);color:var(--text-primary-color,#fff)}
    .modal{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:20;padding:16px}
    .dlg{background:var(--card-background-color);border-radius:14px;padding:18px 20px;max-width:460px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.4)} .dlg h3{margin:0 0 8px} .dlg ul{margin:8px 0;padding-left:18px;font-size:13px}
    .dlg.wide{max-width:560px;max-height:90vh;overflow:auto} .chk{display:block;margin:10px 0;font-size:13px} .warnbox{background:var(--secondary-background-color);border-left:3px solid var(--warning-color,orange);padding:6px 10px;margin:8px 0;font-size:13px;border-radius:4px}
    .pl{margin:8px 0;padding-left:18px;font-size:13px} .muted{color:var(--secondary-text-color);font-size:12px} .conf{width:80px;font:inherit;padding:2px 6px}
    .dlg button.go.danger{background:var(--error-color,#db4437);border-color:var(--error-color,#db4437)} .dlg button[disabled]{opacity:.45;cursor:not-allowed}
    .dlg .row{display:flex;gap:8px;justify-content:flex-end;margin-top:14px} .dlg button{font:inherit;padding:6px 14px;border-radius:8px;border:1px solid var(--primary-color);background:transparent;color:var(--primary-text-color);cursor:pointer} .dlg button.go{background:var(--primary-color);color:var(--text-primary-color,#fff)}
    .rcard{border:1px solid var(--primary-color);border-radius:12px;padding:12px 16px;margin-bottom:12px;background:var(--card-background-color)} .rcard h3{margin:0 0 4px;font-size:15px} .rcard .sub{font-size:12px;color:var(--secondary-text-color)}
    .menu{background:none;border:none;color:var(--primary-text-color);font-size:22px;cursor:pointer;padding:0 6px}`;

  constructor() { super(); this.tab = "overview"; this.window = null; this.days = 0; this.filters = {}; this.search = ""; this.sort = "size"; this.selected = new Set(); this.shown = 100; this.usage = null; this.history = []; this.expand = []; this.hideAuto = true; }

  _ws(type, extra = {}) { return this.hass.connection.sendMessagePromise({ type: `db_storage/${type}`, ...extra }); }
  updated(ch) { if (ch.has("hass") && this.hass && !this._started) { this._started = true; this._loadAll(); } }
  connectedCallback() { super.connectedCallback(); this._tick = setInterval(() => (this.now = Date.now()), 30000); this._close = () => { this.menuOpen = false; }; window.addEventListener("click", this._close); }
  disconnectedCallback() { super.disconnectedCallback(); clearInterval(this._tick); window.removeEventListener("click", this._close); }
  _scanLabel() {
    const src = this.all || this.data;
    if (!src) return "";
    const age = Math.max(0, Math.round(Date.now() / 1000 - this._scanTs));
    return `Last scanned ${fmtAge(age)}`;
  }
  // True after an action or undo until the next scan: the sizes on screen no longer match the database.
  _needsResync() { return !!this.resync || (this.all?.stale_count || this.data?.stale_count || 0) > 0; }
  _scanTip() {
    const d = this.data || this.all;
    if (!d) return "";
    const when = new Date(this._scanTs * 1000).toLocaleString();
    if (this.resync && !(this.all?.stale_count || this.data?.stale_count)) return `Retention deleted old states since the last scan at ${when}, so sizes are out of date. Press Re-Scan to refresh them.`;
    if (this._needsResync()) return `${(this.all || this.data).stale_count} entit${(this.all || this.data).stale_count === 1 ? "y was" : "ies were"} changed by an action since the last scan at ${when}, so their sizes show ⟳. Re-Scan refreshes just those and anything new.`;
    return `Last scanned ${when}${d.from_disk ? " (saved from before the last restart)" : ""}\n` +
      `${d.match_count.toLocaleString()} entities match the current filters · ${fmtBytes(d.match_bytes)} estimated\n` +
      `The scan took ${(d.timings_ms.total_ms / 1000).toFixed(1)} s`;
  }
  async _openReclaim() {
    this.reclaim = { phase: "confirm", before: null };
    try { this.reclaim = { phase: "confirm", before: await this._ws("db_size") }; } catch (e) { this.error = e.message; this.reclaim = null; }
  }
  async _startReclaim() {
    const before = this.reclaim.before;
    this.reclaim = { phase: "running", before, now: before, started: Date.now() };
    try { await this._ws("reclaim", { confirm: true }); } catch (e) { this.error = e.message || JSON.stringify(e); this.reclaim = null; return; }
    // The repack runs inside the recorder. Wait until the empty space is gone from the database
    // (the repack has committed), tolerating the recorder being too busy to answer for a while.
    const target = Math.max(1048576, before.free_bytes * 0.05);
    for (let i = 0; i < 300; i++) {
      await new Promise((r) => setTimeout(r, 4000));
      try {
        const now = await this._ws("db_size");
        this.reclaim = { ...this.reclaim, now };
        if ((now.free_bytes ?? 0) <= target) break;
      } catch (e) { /* busy */ }
    }
    // Fold the write-ahead log into the main file so the file on disk matches the database size.
    let after = this.reclaim.now;
    try { after = await this._ws("db_size", { checkpoint: true }); await this._ws("sample_now"); await this._loadHistory(); } catch (e) { /* shown at the next snapshot */ }
    this.live = after;
    this.reclaim = { ...this.reclaim, now: after, phase: "done" };
  }
  _reclaimUi() {
    const r = this.reclaim;
    if (!r) return "";
    const freed = r.before && r.now ? r.before.file_bytes - r.now.file_bytes : 0;
    const nothing = r.before && (r.before.free_bytes ?? 0) < 1048576;
    if (r.phase === "confirm") return html`<div class="modal" @click=${() => (this.reclaim = null)}><div class="dlg" @click=${(e) => e.stopPropagation()}>
      <h3>Reclaim free space</h3>
      <div>${r.before ? html`The database file is <b>${fmtBytes(r.before.file_bytes)}</b> and at least <b>${fmtBytes(r.before.free_bytes)}</b> of it is empty space left behind by deleted data.` : "Checking the file…"}
        ${nothing ? "That is too little to be worth a repack." : "Reclaiming rewrites the file so that space goes back to the disk. You usually get back a little more than that, because the rest of the file is packed tighter and the recorder clears anything past its keep-days limit first."}</div>
      <ul><li>It can take several minutes on a small device, and recorder writes queue up meanwhile (nothing is lost).</li>
        <li>It needs free disk space roughly equal to the database size while it runs.</li>
        <li>Only do this when little else is going on; Home Assistant keeps running.</li></ul>
      <div class="row"><button @click=${() => (this.reclaim = null)}>Cancel</button><button class="go" ?disabled=${!r.before || nothing} @click=${() => this._startReclaim()}>Reclaim</button></div></div></div>`;
    return html`<div class="rcard"><h3>${r.phase === "running" ? "Reclaiming free space…" : freed > 0 ? `Reclaimed ${fmtBytes(freed)}` : "Finished: nothing was left to reclaim"}</h3>
      <div class="sub">Database size ${fmtBytes(r.before.file_bytes)} → ${fmtBytes(r.now.file_bytes)} · empty space ${fmtBytes(r.before.free_bytes)} → ${fmtBytes(r.now.free_bytes)}${r.phase === "running" ? ` · ${Math.round((Date.now() - r.started) / 1000)} s. This page keeps working; the numbers update when the repack finishes.` : ""}</div>
      ${r.phase === "done" ? html`<button style="margin-top:8px" class="rescan" @click=${() => (this.reclaim = null)}>Dismiss</button>` : ""}</div>`;
  }

  async _loadActions() { try { this.actionsList = await this._ws("actions", { limit: 200 }); } catch (e) { this.error = e.message; } this._loadRet(); }
  async _loadRet() { try { this.ret = await this._ws("retention_status"); } catch (e) { /* not essential */ } }
  // Runs the automation this integration maintains (or the job directly if the automation could not be created).
  async _runRetention() {
    this.menuOpen = false; this.retBusy = true;
    try {
      const r = await this._ws("retention_run", { confirm: true });
      this.notice = r.rows ? `Retention ran: ${r.rows.toLocaleString()} old states deleted for ${r.entities} entit${r.entities === 1 ? "y" : "ies"}.` : "Retention ran: nothing was older than its limit.";
      if (r.rows) this.resync = true;
      await this._loadActions();
    } catch (e) { this.error = e.message || JSON.stringify(e); }
    this.retBusy = false;
  }

  // --- actions: preview, confirm, run in the background, undo -------------------------------
  async _askAction(kind) {
    const ids = [...this.selected];
    try {
      const days = prefs.get("days", 1), applyNow = prefs.get("applyNow", true), states = prefs.get("states", true);
      const retention = kind === "reduce_retention";
      const pv = await this._ws("preview_action", { kind: retention && days === "default" ? "reset_retention" : kind, entity_ids: ids, states, ...(retention && days !== "default" ? { keep_days: days, apply_now: applyNow } : {}) });
      this.modal = { kind, ids, pv, states, text: "", days, applyNow };
    } catch (e) { this.error = e.message || JSON.stringify(e); }
  }
  // Change-retention dialog: refresh the preview after the days or the "delete now" choice changes. Choices stick.
  async _retChange(patch) {
    this.modal = { ...this.modal, ...patch };
    for (const k of ["days", "applyNow"]) if (k in patch) prefs.set(k, patch[k]);
    const m = this.modal, seq = (this._rseq = (this._rseq || 0) + 1), def = m.days === "default";
    try {
      const pv = await this._ws("preview_action", { kind: def ? "reset_retention" : "reduce_retention", entity_ids: m.ids, ...(def ? {} : { keep_days: m.days, apply_now: m.applyNow }) });
      if (seq === this._rseq && this.modal) this.modal = { ...this.modal, pv };
    } catch (e) { this.error = e.message || JSON.stringify(e); }
  }
  async _setStates(on) {
    prefs.set("states", on);
    this.modal = { ...this.modal, states: on, pv: await this._ws("preview_action", { kind: this.modal.kind, entity_ids: this.modal.ids, states: on }) };
  }
  async _runAction() {
    const { kind: asked, ids, states, days, applyNow } = this.modal;
    const kind = asked === "reduce_retention" && days === "default" ? "reset_retention" : asked;
    this.modal = null;
    const ret = kind === "reduce_retention" ? { keep_days: days, apply_now: applyNow } : kind === "reset_retention" ? { apply_now: false } : {};
    try { await this._ws("apply_action", { kind, entity_ids: ids, confirm: true, states, ...ret }); } catch (e) { this.error = e.message || JSON.stringify(e); return; }
    this.selected = new Set();
    this._pollJob();
  }
  _askUndo(a) {
    this.modal = { undo: a };
  }
  async _runUndo() {
    const { undo: a } = this.modal;
    this.modal = null;
    try { await this._ws("undo_action", { action_id: a.id, confirm: true }); } catch (e) { this.error = e.message || JSON.stringify(e); return; }
    this._pollJob();
  }
  async _pollJob() {
    if (this._jobPolling) return;
    this._jobPolling = true;
    try {
      for (;;) {
        this.job = await this._ws("action_status");
        if (!this.job.running) break;
        await new Promise((r) => setTimeout(r, 700));
      }
      await this._loadActions();
      if (this.job.error) this.error = "Action failed: " + this.job.error;
      this._loadEntities(false);
    } catch (e) { this.error = e.message || JSON.stringify(e); }
    this._jobPolling = false;
  }
  _jobUi() {
    const j = this.job;
    if (!j) return "";
    const pct = j.total ? Math.round((j.done / j.total) * 100) : 5;
    if (j.running) return html`<div class="rcard"><h3>${j.label}…</h3><div class="sub">${j.phase} · ${j.done} of ${j.total} · ${Math.round(j.elapsed_s)} s</div>
      <div style="height:6px;border-radius:3px;background:var(--divider-color);margin-top:8px;overflow:hidden"><div style="height:100%;width:${Math.max(5, pct)}%;background:var(--primary-color);transition:width .4s"></div></div></div>`;
    const res = j.result;
    return html`<div class="rcard"><h3>${j.error ? "Something went wrong" : j.label === "Undo" ? "Undo finished" : "Done"}</h3>
      <div class="sub">${j.error || (j.label === "Undo" ? `Status: ${res?.status}.` : `Recorded in History, where you can undo it. Sizes of the changed entities are refreshed.`)}</div>
      <div style="margin-top:8px"><button class="rescan" @click=${() => { this.tab = "history"; this._loadActions(); this.job = null; }}>View in History</button>
        <button class="rescan" @click=${() => (this.job = null)}>Dismiss</button></div></div>`;
  }
  _modalUi() {
    const m = this.modal;
    if (!m) return "";
    if (m.undo) {
      const a = m.undo;
      return html`<div class="modal" @click=${() => (this.modal = null)}><div class="dlg" @click=${(e) => e.stopPropagation()}>
        <h3>Undo this action?</h3>
        <div>${a.summary}. This turns disabled entities back on, puts retention rules back as they were, and restores what was cleared (statistics and state history) from the saved backup. The backup file is deleted afterwards.</div>
        ${a.entities.some((e) => e.steps?.states?.purged) ? html`<ul><li>Cleared state history is restored from the same backup.</li></ul>` : ""}
        <div class="row"><button @click=${() => (this.modal = null)}>Cancel</button><button class="go" @click=${() => this._runUndo()}>Undo</button></div></div></div>`;
    }
    const pv = m.pv, n = pv.entities.length;
    const reduce = m.kind === "reduce_retention", reset = reduce && m.days === "default", retention = reduce;
    const clears = m.kind !== "disable" && !retention;
    const shown = pv.entities.slice(0, 8);
    return html`<div class="modal" @click=${() => (this.modal = null)}><div class="dlg wide" @click=${(e) => e.stopPropagation()}>
      <h3>${pv.label}: ${n} entit${n === 1 ? "y" : "ies"}</h3>
      ${reduce ? html`<div>Keep detailed <b>states</b> for</div>
        <div class="seg">${DAY_CHOICES.map((c) => html`<button class=${m.days === c ? "on" : ""} @click=${() => this._retChange({ days: c })}>${c === "default" ? `default (${pv.default_days}d)` : `${c}d`}</button>`)}</div>
        <div class="muted" style="margin:0 0 8px">Long-term statistics (history graphs, Energy) are not touched.</div>
        ${reset ? html`<div>Back to Home Assistant's default. Nothing is deleted.</div>`
          : html`<label class="chk" title="Saved in a backup first, so it can be undone. If unticked, the nightly automation deletes them without a backup."><input type="checkbox" .checked=${m.applyNow} @change=${(e) => this._retChange({ applyNow: e.target.checked })}>
          Delete older states now${pv.est_bytes ? ` (${pv.entities.reduce((s, e) => s + (e.rows || 0), 0).toLocaleString()} states, ${fmtBytes(pv.est_bytes)})` : ""}</label>`}`
        : clears ? html`<div>Frees about <b>${fmtBytes(pv.est_bytes)}</b> of database space${m.states ? "" : html` (state history not included)`}. A compressed backup of everything cleared is saved first.</div>` : html`<div>Nothing is deleted. These entities stop recording new data.</div>`}
      ${clears ? html`<label class="chk"><input type="checkbox" .checked=${m.states} @change=${(e) => this._setStates(e.target.checked)}>
        Also clear recorded state history${pv.est_states_bytes ? ` (${fmtBytes(pv.est_states_bytes)})` : ""}. It is saved in the backup too, so it can be restored.</label>` : ""}
      ${pv.warnings.includes("no_stats") ? html`<div class="warnbox">${pv.entities.filter((e) => e.no_stats).length} of these have no long-term statistics, so deleted states are gone for good.</div>` : ""}
      ${pv.warnings.includes("no_effect") ? html`<div class="warnbox">Home Assistant already keeps this few days, so the rule changes nothing.</div>` : ""}
      ${pv.warnings.includes("referenced") ? html`<div class="warnbox">Some of these are used in your automations, dashboards or helpers. They will keep working only if the entity stays enabled.</div>` : ""}
      ${pv.warnings.includes("active") ? html`<div class="warnbox">Some are still active and will start recording again within minutes. Use "Disable + clear" to stop that.</div>` : ""}
      <ul class="pl">${shown.map((e) => html`<li><b>${e.name}</b>${e.does.length ? html` <span class="muted">${e.does.join(", ")}</span>` : ""}${e.notes.map((t) => html`<div class="muted">${t}</div>`)}</li>`)}
        ${n > shown.length ? html`<li class="muted">and ${n - shown.length} more</li>` : ""}</ul>
      ${retention ? "" : html`<div class="muted">${pv.undo}</div>`}
      ${n > 25 ? html`<div class="muted" style="margin-top:8px">Type <b>${n}</b> to confirm: <input class="conf" .value=${m.text} @input=${(e) => (this.modal = { ...this.modal, text: e.target.value })}></div>` : ""}
      <div class="row"><button @click=${() => (this.modal = null)}>Cancel</button>
        <button class="go ${clears ? "danger" : ""}" ?disabled=${(n > 25 && m.text.trim() !== String(n)) || (reduce && !reset && pv.warnings.includes("no_effect"))} @click=${() => this._runAction()}>${pv.label}</button></div></div></div>`;
  }

  _toggleMenu() { this.dispatchEvent(new Event("hass-toggle-menu", { bubbles: true, composed: true })); }

  async _loadAll() { await Promise.all([this._loadEntities(false), this._loadHistory(), this._loadLive(), this._loadRet()]); }
  async _loadLive() { try { this.live = await this._ws("db_size"); } catch (e) { /* recorder busy: the snapshot is shown instead */ } }
  async _loadHistory() { try { this.history = await this._ws("size_history", { days: 3650 }); } catch (e) { this.error = e.message; } }
  async _loadEntities(refresh) {
    try {
      const res = await this._ws("entities", { filters: this.filters, search: this.search, expand: this.expand, exclude_domains: this._exclude(), refresh, limit: 5000, ...(this.window ? { window: this.window } : {}) });
      this.error = null;
      if (res.no_data) { this.data = null; this.all = null; } else {
        this.data = res;
        this._scanTs = Date.now() / 1000 - res.scan_age_s;
        if (!Object.values(this.filters).some((v) => v.length) && !this.search && !this.window && !this._exclude().length) this.all = res;
        else this.all = await this._ws("entities", { filters: {}, search: "", refresh: false, limit: 5000 });
      }
      if (res.no_data || res.scanning || refresh) this._poll();
      await this.updateComplete;
      requestAnimationFrame(() => (this.chipsIn = true));
    } catch (e) { this.error = e.message || JSON.stringify(e); }
  }
  // Polls scan progress until the background scan finishes, then reloads the results.
  async _poll() {
    if (this._polling) return;
    this._polling = true;
    try {
      for (;;) {
        const st = await this._ws("scan_status");
        this.progress = st;
        if (!st.running) break;
        await new Promise((r) => setTimeout(r, 700));
      }
      if (this.progress?.error) { this.error = "Scan failed: " + this.progress.error; }
      else { this.progress = null; this.error = null; this.resync = false; await this._loadEntities(false); await this._loadHistory(); await this._loadLive(); }
    } catch (e) { this.error = e.message || JSON.stringify(e); this.progress = null; }
    this._polling = false;
  }
  // The "Referenced in" panel shows one entity, or the combined places of everything ticked while it is open.
  // Automations are hidden from the Entities view unless switched on, or picked in the Type filter.
  _exclude() { return this.hideAuto && !(this.filters.domain || []).includes("automation") ? ["automation"] : []; }
  async _loadUsage(eid) {
    if (eid !== undefined) this._usageFor = eid;
    if (!this._usageFor && !this.usage) { this.usage = null; return; }
    if (eid === null) { this._usageFor = null; this.usage = null; return; }
    try {
      this.usage = this.selected.size
        ? await this._ws("usage", { entity_ids: [...this.selected] })
        : await this._ws("usage", { entity_id: this._usageFor });
    } catch (e) { this.error = e.message; }
  }
  _filters(f) { this.filters = f; this.shown = 100; this._loadEntities(false); }
  _go(href) { history.pushState(null, "", href); window.dispatchEvent(new Event("location-changed")); }

  // How much the database file changed across the selected period, from the hourly/daily samples.
  _growth() {
    const h = this.history || [];
    if (!this.window || h.length < 2) return null;
    const [a, b] = this.window;
    const before = [...h].reverse().find((r) => r.ts <= a) || h[0];
    const after = h.find((r) => r.ts >= b) || h.at(-1);
    return after.ts > before.ts ? after.file_bytes - before.file_bytes : null;
  }

  _chips() {
    const active = Object.entries(this.filters).flatMap(([f, vs]) => vs.map((v) => [f, v]));
    if (!active.length && !this.search && !this.window) return "";
    return html`<span class="chips ${this.chipsIn ? "in" : "pending"}" title="Filters apply to the Entities tab">
      ${this.window ? html`<span class="fchip" title="Only entities that wrote data in this period" @click=${() => { this.window = null; this.shown = 100; this._loadEntities(false); }}>Period: ${fmtPeriod(...this.window)}${this._growth() != null ? ` (${this._growth() >= 0 ? "+" : "-"}${fmtBytes(Math.abs(this._growth()))})` : ""} ✕</span>` : ""}
      ${this.search ? html`<span class="fchip" @click=${() => { this.search = ""; this.shown = 100; this._loadEntities(false); }}>Search: ${this.search} ✕</span>` : ""}
      ${active.map(([f, v]) => html`<span class="fchip" @click=${() => { this._filters({ ...this.filters, [f]: this.filters[f].filter((x) => x !== v) }); }}>${FACET_LABELS[f] || f}: ${v} ✕</span>`)}
      <span class="fchip clear" @click=${() => { this.search = ""; this.window = null; this._filters({}); }}>Clear all</span></span>`;
  }

  render() {
    const tabs = [["overview", "Overview"], ["entities", "Entities"], ["history", "History"]];
    return html`<div class="wrap">
      <h2>${this.narrow ? html`<button class="menu" @click=${this._toggleMenu}>☰</button>` : ""}DB Storage${this._chips()}
        ${this.all || this.data ? html`<span class="scan"><span class="lastscan ${this._needsResync() ? "need" : ""}" title=${this._scanTip()}>${this._needsResync() ? "Re-Scan needed" : this._scanLabel()}</span>
          <span class="split">
            <button class="rescan main ${this._needsResync() ? "need" : ""}" ?disabled=${!!this.progress?.running} aria-label="Re-Scan"
              title="Re-Scan: re-reads the database and your configuration from scratch (table and entity sizes, last update times, new entities, and where each entity is used). Takes several seconds; the page keeps working meanwhile. After an action only the entities it changed are refreshed, automatically."
              @click=${() => this._loadEntities(true)}>
              <svg viewBox="0 0 24 24" width="18" height="18" class=${this.progress?.running ? "spin" : ""}><path fill="currentColor" d="M17.65 6.35A7.96 7.96 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"/></svg></button>
            <button class="rescan arrow" aria-label="More actions" title="More actions" @click=${(e) => { e.stopPropagation(); this.menuOpen = !this.menuOpen; }}>
              <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg></button>
            ${this.menuOpen ? html`<div class="menu-pop" @click=${(e) => e.stopPropagation()}>
              <button @click=${() => { this.menuOpen = false; this._loadEntities(true); }}><b>Re-Scan</b><span>Refresh the sizes and where entities are used.</span></button>
              <div><button ?disabled=${!this.ret?.rules || this.retBusy || this.job?.running} @click=${() => this._runRetention()}><b>Run retention now</b><span>${!this.ret?.rules ? "No retention rules yet." : this.ret?.automation ? "Runs the DB Storage automation in Home Assistant now." : "Deletes states older than each rule now."}</span></button>
                ${this.ret?.automation ? html`<a @click=${() => { this.menuOpen = false; this._go(this.ret.automation.link); }}>Open the automation ↗</a>` : ""}</div>
              <button @click=${() => { this.menuOpen = false; this._openReclaim(); }}><b>Reclaim free space…</b><span>Repack the database so space freed by deletions goes back to the disk.</span></button></div>` : ""}</span></span>` : ""}</h2>
      <div class="tabs">${tabs.map(([k, v]) => html`<button class=${this.tab === k ? "on" : ""} @click=${() => { this.tab = k; if (k === "history") this._loadActions(); }}>${v}</button>`)}</div>
      ${this.error ? html`<div class="err">${this.error}</div>` : ""}
      ${this._reclaimUi()}
      ${this.notice ? html`<div class="rcard"><h3>Retention</h3><div class="sub">${this.notice}</div><div style="margin-top:8px"><button class="rescan" @click=${() => (this.notice = null)}>Dismiss</button></div></div>` : ""}
      ${this._jobUi()}
      ${this._modalUi()}
      ${this.inspect ? html`<db-inspect .hass=${this.hass} .ws=${(t, x) => this._ws(t, x)} .entityId=${this.inspect.entity_id} .name=${this.inspect.name} @close=${() => (this.inspect = null)} @click=${() => (this.inspect = null)}></db-inspect>` : ""}
      ${this.progress ? html`<db-progress .status=${this.progress} .first=${!this.data}></db-progress>` : ""}
      ${this.tab === "overview" ? html`<db-overview .live=${this.live} .hass=${this.hass} .data=${this.all} .history=${this.history} .days=${this.days} .window=${this.window}
          @days=${(e) => { this.days = e.detail; }}
          @goto-entity=${(e) => { this.search = e.detail; this.filters = {}; this.window = null; this.tab = "entities"; this.shown = 100; this.chipsIn = false; this._loadEntities(false); }}
          @goto-window=${(e) => { this.window = e.detail; this.search = ""; this.filters = {}; this.tab = "entities"; this.shown = 100; this.chipsIn = false; this._loadEntities(false); }}
          @goto-filter=${(e) => { this.search = ""; this.window = null; this.filters = e.detail; this.tab = "entities"; this.shown = 100; this.chipsIn = false; this._loadEntities(false); }}></db-overview>` : ""}
      ${this.tab === "entities" ? html`<db-entities .hass=${this.hass} .data=${this.data} .filters=${this.filters} .search=${this.search} .sort=${this.sort} .expand=${this.expand} .hideAuto=${this.hideAuto && !(this.filters.domain || []).includes("automation")}
          .selected=${this.selected} .shown=${this.shown} .usage=${this.usage} .growth=${this._growth()} .busy=${!!this.progress?.running}
          @clearwindow=${() => { this.window = null; this.shown = 100; this._loadEntities(false); }} @filters=${(e) => this._filters(e.detail)} @hideauto=${(e) => { this.hideAuto = e.detail; this.shown = 100; this._loadEntities(false); }} @expand=${(e) => { const s = new Set(this.expand); e.detail.on ? s.add(e.detail.facet) : s.delete(e.detail.facet); this.expand = [...s]; this._loadEntities(false); }} @search=${(e) => { this.search = e.detail; this.shown = 100; this._loadEntities(false); }}
          @sort=${(e) => (this.sort = e.detail)} @selected=${(e) => { this.selected = e.detail; if (this.usage) this._loadUsage(); }} @more=${() => (this.shown += 100)}
          @action=${(e) => this._askAction(e.detail)} @inspect=${(e) => (this.inspect = e.detail)} @refresh=${() => this._loadEntities(true)} @usage=${(e) => this._loadUsage(e.detail)} @navigate=${(e) => this._go(e.detail)}></db-entities>` : ""}
      ${this.tab === "history" ? html`<db-history .actions=${this.actionsList} .ret=${this.ret} @navigate=${(e) => this._go(e.detail)} .ws=${(t, x) => this._ws(t, x)} .busy=${!!this.job?.running} @changed=${() => this._loadActions()} @undo=${(e) => this._askUndo(e.detail)}></db-history>` : ""}
    </div>`;
  }
}
customElements.define("db-storage-panel", DbStoragePanel);
