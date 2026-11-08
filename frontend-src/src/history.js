import { LitElement, html, css, nothing } from "lit";
import { fmtBytes } from "./util.js";

const KIND = { disable: "Disable", delete_history: "Clear history", disable_and_clear: "Disable and clear history", reduce_retention: "Change retention", reset_retention: "Change retention (default)", retention_run: "Retention rules (nightly)" };
const STATUS = { applied: "Applied", partial: "Partly applied", failed: "Failed", undone: "Undone", undo_partial: "Partly undone", running: "Running", interrupted: "Interrupted" };

const HELP_TOP = `Every change made from this panel is recorded here.
Each action that clears history saves one compressed backup file holding everything it cleared (long-term statistics and any state history, with attributes) for all its entities. Undo restores the whole batch, turns disabled entities back on, and removes the file.
Est. freed is the database space the action should free. The Backup size is that same data compressed, so it is normally much smaller.
The database file on disk only shrinks after "Reclaim free space".`;
const KNOWN_NOTE = /^(No long-term statistics to clear|State history cleared|Was already disabled|Not in the entity registry)/;

const n = (v) => (v || 0).toLocaleString();

// One short, comparable phrase per entity for each thing an action can do.
const cellDisabled = (e) => { const d = e.steps?.disabled; return !d ? "" : d.changed ? "Disabled" : "Was already off"; };
const cellStats = (e) => {
  const s = e.steps?.statistics;
  if (!s) return "";
  return s.snapshot === null || s.snapshot === undefined ? "None to clear" : s.deleted ? `Cleared · ${n(s.statistics)} rows` : "Not cleared";
};
const cellStates = (e) => { const s = e.steps?.states; return !s?.purged ? "" : s.rows ? `Cleared · ${n(s.rows)} rows` : "None to clear"; };
const cellRule = (e) => { const r = e.steps?.retention; return !r ? "" : r.new ? `Keep ${r.new} days${r.old ? ` (was ${r.old})` : ""}` : `Default${r.old ? ` (was ${r.old} days)` : ""}`; };
const cellUndo = (e) => (e.undo_notes || [])
  .filter((t) => !/^(Backup file removed|State history cannot)/.test(t))
  .map((t) => t.replace(/^Restored (\d+) long-term and (\d+) short-term rows\.$/, (_m, a, b) => `Restored ${n(+a)} rows`).replace("Enabled again.", "Re-enabled"))
  .join(" · ");
const cellNotes = (e) => (e.notes || []).filter((t) => !KNOWN_NOTE.test(t)).join(" ");

const COLS = [
  ["rule", "Retention rule", cellRule, "Detailed states are kept for this many days. Statistics are not affected."],
  ["disabled", "Disabled", cellDisabled, "Turned off in Home Assistant so it stops recording."],
  ["stats", "Long-term statistics", cellStats, "Hourly summaries behind history graphs and the Energy dashboard. Backed up before clearing."],
  ["states", "State history", cellStates, "Every recorded state change, with its attributes. Backed up before clearing."],
  ["undo", "Undo result", cellUndo, "What the undo did for this entity."],
];
const WHY = {
  disabled: { Disabled: "Disabled: turned off in Home Assistant so they stop recording. Undo turns them back on.", "Was already off": "They were already disabled, so nothing changed there." },
  stats: { "None to clear": "No long-term statistics existed to clear, so there is nothing to back up or restore." },
  states: { "None to clear": "No state history was stored for these entities." },
};

export class DbHistory extends LitElement {
  static properties = {
    actions: { attribute: false }, ret: { attribute: false }, busy: { type: Boolean }, ws: { attribute: false },
    open: { state: true }, sel: { state: true }, usage: { state: true }, dlg: { state: true }, err: { state: true },
  };
  static styles = css`
    :host{display:block}
    .muted{color:var(--secondary-text-color);font-size:12px}
    .info{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;border:1px solid var(--secondary-text-color);color:var(--secondary-text-color);font-size:11px;font-style:italic;font-family:serif;cursor:help;vertical-align:middle}
    .card{border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color);padding:10px 14px;margin-bottom:10px;font-size:13px;display:flex;gap:14px;flex-wrap:wrap;align-items:center}
    .card .sp{flex:1}
    .tablewrap{border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color);overflow:hidden}
    .row{display:grid;grid-template-columns:28px 140px minmax(0,1fr) 100px 110px 120px 80px;gap:8px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--divider-color)}
    .row.head{font-size:12px;color:var(--secondary-text-color);background:var(--secondary-background-color)}
    .row.item{cursor:pointer} .row.item:hover{background:var(--secondary-background-color)} .row.sel{background:color-mix(in srgb,var(--primary-color) 10%,transparent)}
    .r{text-align:right;font-variant-numeric:tabular-nums}
    .chip{font-size:12px;border:1px solid var(--divider-color);border-radius:10px;padding:0 8px;line-height:18px;white-space:nowrap;display:inline-block}
    .chip.applied{border-color:var(--success-color,green);color:var(--success-color,green)} .chip.undone{border-color:var(--secondary-text-color)}
    .chip.partial,.chip.undo_partial,.chip.interrupted{border-color:var(--warning-color,orange);color:var(--warning-color,orange)} .chip.failed{border-color:var(--error-color,#db4437);color:var(--error-color,#db4437)}
    button{font:inherit;padding:4px 12px;border-radius:8px;border:1px solid var(--primary-color);background:transparent;color:var(--primary-text-color);cursor:pointer}
    button.danger{background:var(--error-color,#db4437);border-color:var(--error-color,#db4437);color:#fff}
    button[disabled]{opacity:.45;cursor:not-allowed}
    .detail{padding:8px 12px 12px 48px;border-bottom:1px solid var(--divider-color);background:var(--card-background-color)}
    .gsum{font-size:12px;color:var(--secondary-text-color);margin:0 0 6px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}
    table{border-collapse:collapse;width:100%;font-size:13px} th{font-weight:400;font-size:12px;color:var(--secondary-text-color);text-align:left;padding:2px 10px 4px 0;white-space:nowrap}
    td{padding:3px 10px 3px 0;border-top:1px solid var(--divider-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px}
    td.ent{max-width:340px} td.ent .id{color:var(--secondary-text-color);font-size:12px;margin-left:6px}
    th.r,td.r{text-align:right}
    .empty{padding:24px;text-align:center;color:var(--secondary-text-color)}
    .selbar{display:flex;gap:10px;align-items:center;margin-bottom:10px;padding:8px 14px;border-radius:12px;border:1px solid var(--primary-color);background:var(--card-background-color);font-size:13px}
    .modal{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:20;padding:16px}
    .dlg{background:var(--card-background-color);border-radius:14px;padding:18px 20px;max-width:460px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.4);font-size:14px} .dlg h3{margin:0 0 8px}
    .dlg .btns{display:flex;gap:8px;justify-content:flex-end;margin-top:14px} .dlg ul{margin:8px 0;padding-left:18px;font-size:13px}
    .warnbox{background:var(--secondary-background-color);border-left:3px solid var(--warning-color,orange);padding:6px 10px;margin:8px 0;font-size:13px;border-radius:4px}
    .card a{color:var(--primary-color);text-decoration:none} .card a:hover{text-decoration:underline}
    .err{color:var(--error-color,#db4437);margin-bottom:8px}
    @media (max-width:760px){.row{grid-template-columns:28px minmax(0,1fr) auto}.c3,.c4,.c5{display:none}}`;

  constructor() { super(); this.sel = new Set(); this.open = null; }

  updated(ch) { if (ch.has("actions") && this.actions && this.ws) this._loadUsage(); }
  async _loadUsage() {
    try { this.usage = await this.ws("backup_usage"); } catch (e) { /* shown elsewhere */ }
  }
  _when(ts) { return new Date(ts * 1000).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); }
  _undoable(a) {
    return ["applied", "partial", "failed", "undo_partial"].includes(a.status) &&
      a.entities.some((e) => e.steps?.disabled?.changed || e.steps?.retention ||
        (e.steps?.statistics?.deleted && e.steps.statistics.snapshot && !e.steps.statistics.snapshot_removed) ||
        (e.steps?.states?.purged && e.steps.states.backup && !e.steps.states.backup_removed));
  }
  _toggle(id, on) { const s = new Set(this.sel); on ? s.add(id) : s.delete(id); this.sel = s; }
  _chosen() { return (this.actions || []).filter((a) => this.sel.has(a.id) && a.status !== "running"); }

  async _delete() {
    const ids = this._chosen().map((a) => a.id);
    this.err = null;
    try {
      const r = await this.ws("delete_actions", { action_ids: ids, confirm: true });
      this.dlg = null; this.sel = new Set(); this.open = null;
      this.dispatchEvent(new CustomEvent("changed"));
      this.freedMsg = `Deleted ${r.deleted} record${r.deleted === 1 ? "" : "s"} and ${r.files_removed} backup file${r.files_removed === 1 ? "" : "s"}, recovering ${fmtBytes(r.bytes_freed)}.`;
      this.requestUpdate();
    } catch (e) { this.err = e.message || JSON.stringify(e); }
  }

  _dlg() {
    if (!this.dlg) return nothing;
    const list = this._chosen();
    const bytes = list.reduce((s, a) => s + (a.backup_bytes || 0), 0);
    const files = list.reduce((s, a) => s + (a.backup_files || 0), 0);
    const live = list.filter((a) => this._undoable(a));
    return html`<div class="modal" @click=${() => (this.dlg = null)}><div class="dlg" @click=${(e) => e.stopPropagation()}>
      <h3>Delete ${list.length} history record${list.length === 1 ? "" : "s"}?</h3>
      <div>This removes the records and ${files} backup file${files === 1 ? "" : "s"}, recovering <b>${fmtBytes(bytes)}</b> of disk space.</div>
      ${live.length ? html`<div class="warnbox"><b>${live.length}</b> of them can still be undone. Once deleted, their statistics can no longer be restored and disabled entities will not be turned back on.</div>` : nothing}
      ${this.err ? html`<div class="err">${this.err}</div>` : nothing}
      <div class="btns"><button @click=${() => (this.dlg = null)}>Cancel</button><button class="danger" @click=${() => this._delete()}>Delete</button></div></div></div>`;
  }

  _detail(a) {
    const ents = a.entities;
    const vals = (fn) => ents.map(fn);
    const uniform = (fn) => { const v = vals(fn); return v.every((x) => x === v[0]) ? v[0] : undefined; };
    const shown = [], sum = [], why = [];
    for (const [key, label, fn, tip] of COLS) {
      const u = uniform(fn);
      if (u === undefined) shown.push([key, label, fn, tip]);
      else if (u) { sum.push(key === "disabled" ? u : `${label}: ${u}`); if (WHY[key]?.[u]) why.push(WHY[key][u]); else if (key === "undo") why.push("Undo result: " + u); }
    }
    const notesUniform = uniform(cellNotes);
    const showNotes = notesUniform === undefined;
    if (notesUniform) { sum.push(notesUniform); why.push(notesUniform); }
    const info = [...why, ...(a.error ? [a.error] : [])].join("\n");
    const hasBackup = ents.some((e) => e.steps?.statistics?.snapshot || e.steps?.states?.backup);
    const file = a.backup_names?.[0];
    return html`<div class="detail">
      ${a.undone_ts ? html`<div class="muted" style="margin-bottom:4px">Undone ${this._when(a.undone_ts)}</div>` : nothing}
      ${a.error ? html`<div class="muted" style="margin-bottom:4px">${a.error}</div>` : nothing}
      ${hasBackup ? html`<div class="gsum">Backup: <b>${a.backup_files ? fmtBytes(a.backup_bytes) : "no file on disk"}</b> ${file ? html`<span title=${file}>(${file})</span>` : nothing} <span class="muted">compressed, one file for the whole action</span></div>` : nothing}
      ${sum.length ? html`<div class="gsum">${ents.length > 1 ? "Same for all:" : "Result:"} ${sum.join(" · ")} <span class="info" title=${info}>i</span></div>` : nothing}
      <table><tr><th>Entity</th>${shown.map(([, l, , tip]) => html`<th title=${tip}>${l}</th>`)}<th class="r" title="Estimated database space freed: long-term statistics plus any state history cleared. Not the size of the backup.">Est. freed</th>${hasBackup ? html`<th class="r" title="Rows of this entity saved in the action's backup file">Backed up</th>` : nothing}${showNotes ? html`<th>Notes</th>` : nothing}</tr>
        ${ents.map((e) => {
          const st = e.steps?.statistics;
          const brk = e.est_stats_bytes != null ? `Long-term statistics ${fmtBytes(e.est_stats_bytes)}${e.est_states_bytes ? ` + state history ${fmtBytes(e.est_states_bytes)}` : ""}` : "";
          const sh = e.steps?.states;
          const rowsSaved = (st?.statistics || 0) + (st?.short_term || 0) + (sh?.rows || 0);
          const bk = !(st?.snapshot || sh?.backup) ? "" : (st?.exists ?? sh?.exists) === false ? ((st?.snapshot_removed || sh?.backup_removed) ? "removed" : "missing") : `${n(rowsSaved)} rows`;
          return html`<tr><td class="ent" title=${e.entity_id}>${e.name}<span class="id">${e.entity_id}</span></td>
            ${shown.map(([, , fn]) => html`<td title=${fn(e)}>${fn(e) || "–"}</td>`)}
            <td class="r" title=${brk}>${e.est_bytes ? fmtBytes(e.est_bytes) : "–"}</td>
            ${hasBackup ? html`<td class="r" title=${(st?.snapshot || sh?.backup) ? `${n(st?.statistics)} long-term, ${n(st?.short_term)} 5-minute statistics rows and ${n(sh?.rows)} state rows saved in ${st?.snapshot || sh?.backup}${(st?.exists ?? sh?.exists) === false ? ((st?.snapshot_removed || sh?.backup_removed) ? "\nRemoved after the undo restored it" : "\nThe file is no longer on disk") : ""}` : "Nothing needed backing up"}>${bk || "–"}</td>` : nothing}
            ${showNotes ? html`<td title=${cellNotes(e)}>${cellNotes(e) || "–"}</td>` : nothing}</tr>`;
        })}</table></div>`;
  }

  render() {
    const list = this.actions;
    if (!list) return html`<div class="muted">Loading…</div>`;
    const u = this.usage;
    const chosen = this._chosen();
    const chosenBytes = chosen.reduce((s, a) => s + (a.backup_bytes || 0), 0);
    const all = list.length > 0 && list.every((a) => this.sel.has(a.id));
    return html`
      <div class="card"><b>Undo data</b>
        <span title=${u ? `Backup files: ${u.path}\nHistory records: ${u.journal_path}` : ""}>${u ? html`<b>${fmtBytes(u.bytes + u.journal_bytes)}</b> in use: ${u.files} backup file${u.files === 1 ? "" : "s"} (${fmtBytes(u.bytes)}) and the record database (${fmtBytes(u.journal_bytes)})` : "Checking…"}</span>
        ${u ? html`<span class="muted">Stored in ${u.path.replace(/\/snapshots$/, "")}</span>` : nothing}
        ${u?.unlinked_files ? html`<span class="muted" title="Backup files in the folder that no history record points to, for example from records deleted by hand. They are safe to delete from the folder.">${u.unlinked_files} file${u.unlinked_files === 1 ? "" : "s"} not linked to any record (${fmtBytes(u.unlinked_bytes)})</span>` : nothing}
        <span class="sp"></span><span class="info" title=${HELP_TOP}>i</span></div>
      ${this.ret?.rules ? html`<div class="card"><b>Retention rules</b><span>${this.ret.rules} entit${this.ret.rules === 1 ? "y" : "ies"} keep less than Home Assistant's ${this.ret.default_days} days of state history.
          ${this.ret.last_run ? `Last run ${this._when(this.ret.last_run.ts)}: ${this.ret.last_run.rows.toLocaleString()} rows deleted.` : "Has not run yet."}
          ${this.ret.run_at ? `Runs nightly at ${this.ret.run_at}${this.ret.automation ? " by an automation" : ""}.` : "Nightly run is off (see the integration options)."}</span>
        ${this.ret.automation ? html`<a href=${this.ret.automation.link} @click=${(e) => { e.preventDefault(); this.dispatchEvent(new CustomEvent("navigate", { detail: this.ret.automation.link })); }}>Open the automation ↗</a>` : nothing}
        <span class="sp"></span><span class="info" title="The nightly job is a normal Home Assistant automation, kept up to date by this integration (category DB Storage). Change its time or turn it off in the integration options. Use Run retention now in the menu beside Re-Scan to run it immediately. Rows it deletes are not backed up.">i</span></div>` : nothing}
      ${this.freedMsg ? html`<div class="card" style="border-color:var(--success-color,green)">${this.freedMsg} <span class="sp"></span><button @click=${() => { this.freedMsg = null; this.requestUpdate(); }}>Dismiss</button></div>` : nothing}
      ${!list.length ? html`<div class="tablewrap"><div class="empty">No actions yet. Select entities on the Entities tab and choose an action; every change is recorded here so it can be undone.</div></div>` : html`
      ${chosen.length ? html`<div class="selbar"><b>${chosen.length} selected</b><span class="muted">${fmtBytes(chosenBytes)} of backup files would be recovered</span><span style="flex:1"></span>
        <button @click=${() => (this.sel = new Set())}>Clear</button><button class="danger" @click=${() => { this.err = null; this.dlg = true; }}>Delete selected…</button></div>` : nothing}
      <div class="tablewrap"><div class="row head"><input type="checkbox" .checked=${all} @change=${(e) => (this.sel = e.target.checked ? new Set(list.map((a) => a.id)) : new Set())} title="Select all"><span>When</span><span class="c2">Action</span><span class="c3 r" title="Estimated database space freed, not the size of the backup">Est. freed</span><span class="c4 r" title="Compressed backup file for this action">Backup</span><span class="c5">Status</span><span></span></div>
      ${list.map((a) => html`
        <div class="row item ${this.sel.has(a.id) ? "sel" : ""}" @click=${() => (this.open = this.open === a.id ? null : a.id)}>
          <input type="checkbox" .checked=${this.sel.has(a.id)} @click=${(e) => e.stopPropagation()} @change=${(e) => this._toggle(a.id, e.target.checked)}>
          <span>${this._when(a.ts)}</span><span class="c2"><b>${KIND[a.kind] || a.kind}</b> · ${a.entities.length} entit${a.entities.length === 1 ? "y" : "ies"}</span>
          <span class="c3 r muted">${(a.kind === "disable" || a.kind === "reset_retention") ? "n/a" : fmtBytes(a.est_bytes)}</span>
          <span class="c4 r muted" title=${a.backup_files ? `${a.backup_files} backup file${a.backup_files === 1 ? "" : "s"} on disk` : "No backup files on disk for this action"}>${a.backup_files ? fmtBytes(a.backup_bytes) : "–"}</span>
          <span class="c5"><span class="chip ${a.status}">${STATUS[a.status] || a.status}</span></span>
          <span>${this._undoable(a) ? html`<button ?disabled=${this.busy} @click=${(e) => { e.stopPropagation(); this.dispatchEvent(new CustomEvent("undo", { detail: a })); }}>Undo</button>` : nothing}</span></div>
        ${this.open === a.id ? this._detail(a) : nothing}`)}</div>`}
      ${this._dlg()}`;
  }
}
customElements.define("db-history", DbHistory);
