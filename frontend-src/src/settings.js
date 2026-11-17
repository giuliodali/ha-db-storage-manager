import { LitElement, html, css, nothing } from "lit";
import { fmtBytes } from "./util.js";

// Settings: display options, Home Assistant's default state retention (recorder purge_keep_days in YAML),
// and long-term statistics retention (applied monthly by the nightly job). Everything loads as configured now.
const fmtMonths = (m) => (m == null ? "Indefinitely" : m < 12 ? `${m} months` : m % 12 ? `${(m / 12).toFixed(1)} years` : `${m / 12} year${m === 12 ? "" : "s"}`);
const fmtRows = (n) => `${Math.round(n).toLocaleString()} rows`;
const tip = (body) => html`<span class="tip" tabindex="0"><span class="info">?</span><span class="pop">${body}</span></span>`;
const sumFrom = (h, i) => (h || []).slice(Math.max(0, i)).reduce((s, n) => s + n, 0);

export class DbSettings extends LitElement {
  static properties = {
    hass: { attribute: false }, ws: { attribute: false }, cfg: { attribute: false },
    pred: { state: true }, days: { state: true }, stats: { state: true }, energy: { state: true }, ask: { state: true }, busy: { state: true }, msg: { state: true }, err: { state: true },
  };
  static styles = css`
    :host{display:block}
    .card{border:1px solid var(--divider-color);border-radius:12px;padding:12px 16px;margin-bottom:12px;background:var(--card-background-color)}
    h3{margin:0 0 6px;font-size:15px} .muted{color:var(--secondary-text-color);font-size:12px} p{margin:6px 0;font-size:13px}
    .row{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:8px 0}
    input[type=range]{flex:1;min-width:200px;accent-color:var(--primary-color)}
    .val{font-size:18px;font-weight:600;min-width:110px;font-variant-numeric:tabular-nums}
    .pred{font-size:13px;padding:6px 10px;border-radius:8px;background:var(--secondary-background-color)}
    .pred.free{border-left:3px solid var(--success-color,#43a047)} .pred.grow{border-left:3px solid var(--warning-color,orange)}
    .step{display:inline-flex;align-items:center;border:1px solid var(--divider-color);border-radius:8px;overflow:hidden}
    .step button{font:inherit;font-size:18px;width:34px;height:32px;border:none;background:none;color:var(--primary-text-color);cursor:pointer}
    .step button[disabled]{opacity:.35;cursor:default} .step span{min-width:120px;text-align:center;font-weight:600}
    .lab{min-width:220px;font-size:13px}
    button.b{font:inherit;padding:6px 14px;border-radius:8px;border:1px solid var(--primary-color);background:transparent;color:var(--primary-text-color);cursor:pointer}
    button.b.go{background:var(--primary-color);color:var(--text-primary-color,#fff)} button.b[disabled]{opacity:.45;cursor:not-allowed}
    .warn{background:var(--secondary-background-color);border-left:3px solid var(--warning-color,orange);padding:6px 10px;margin:8px 0;font-size:13px;border-radius:4px}
    .ok{border-left-color:var(--success-color,#43a047)} .err{border-left-color:var(--error-color,#db4437)}
    .chk{display:flex;gap:8px;align-items:flex-start;font-size:13px} code{font-size:12px}
    .modal{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:20;padding:16px}
    .dlg{background:var(--card-background-color);border-radius:14px;padding:18px 20px;max-width:480px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.4)} .dlg h3{margin:0 0 8px}
    .dlg .row{justify-content:flex-end}
    .tip{position:relative;display:inline-flex;vertical-align:middle;margin-left:6px;font-weight:400} .tip .pop{display:none;position:absolute;left:0;top:calc(100% + 6px);z-index:15;width:300px;text-align:left;white-space:normal;font-size:12px;line-height:1.45;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.35);padding:10px 12px}
    .tip:hover .pop,.tip:focus .pop{display:block} .pop p{margin:0 0 6px}
    .info{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;border:1px solid var(--secondary-text-color);color:var(--secondary-text-color);font-size:11px;cursor:help}
    a.link{color:var(--primary-color);cursor:pointer;text-decoration:none} a.link:hover{text-decoration:underline}`;

  updated(ch) {
    if (ch.has("cfg") && this.cfg && !this._init) {
      this._init = true;
      this._reset();
      this._predict();
    }
  }
  _reset() {
    const c = this.cfg;
    this.days = c.recorder.effective_days;
    this.stats = c.stats_keep_months;
    this.energy = c.energy_stats_keep_months;
  }
  async _predict() { try { this.pred = await this.ws("settings_predict"); } catch (e) { this.err = e.message || JSON.stringify(e); } }
  async _save(patch, done) {
    this.busy = true; this.err = null;
    try {
      const cfg = await this.ws("settings_set", patch);
      this.dispatchEvent(new CustomEvent("saved", { detail: cfg }));
      this.cfg = cfg; this.msg = done;
      if ("keep_days" in patch) this.days = cfg.recorder.effective_days;  // other unsaved choices stay as they are
      if ("stats_keep_months" in patch) { this.stats = cfg.stats_keep_months; this.energy = cfg.energy_stats_keep_months; }
    } catch (e) { this.err = e.message || JSON.stringify(e); }
    this.busy = false; this.ask = null;
  }

  // --- state history -------------------------------------------------------------------------
  _statesPred(n) {
    const p = this.pred?.states, run = this.cfg.recorder.running_days;
    if (!p) return html`<div class="pred">Working out what this would change…</div>`;
    const bpr = p.bytes_per_row;
    const amt = (rows) => (bpr ? `about ${fmtBytes(rows * bpr)} (${fmtRows(rows)})` : fmtRows(rows));
    if (n < run) {
      const rows = sumFrom(p.hist, n);
      return html`<div class="pred free">Frees ${amt(rows)}: the states older than ${n} day${n === 1 ? "" : "s"}. They are deleted by Home Assistant's nightly purge after the restart; Reclaim free space then returns the room to the disk.</div>`;
    }
    if (n > run) {
      const rows = p.rate_per_day * (n - run);
      return html`<div class="pred grow">Grows by ${amt(rows)} over the next ${n - run} days, at the last week's pace (${fmtRows(p.rate_per_day)} a day), then stays about level.</div>`;
    }
    return html`<div class="pred">No change from what Home Assistant keeps now (${fmtRows(p.rows)}${bpr ? `, about ${fmtBytes(p.rows * bpr)}` : ""}).</div>`;
  }
  _statesCard() {
    const r = this.cfg.recorder, max = Math.max(30, r.effective_days, r.running_days);  // 1 to 30 days (further only if already set higher)
    const where = html`<code>recorder: purge_keep_days</code> in <code>${r.file}</code>`;
    const locked = r.kind === "unsupported";
    return html`<div class="card"><h3>State history (default retention)${tip(html`<p>How many days of detailed states Home Assistant keeps for every entity: its <code>recorder: purge_keep_days</code> setting.</p>
        <p>Saving writes that one line in your YAML (the old file is kept as a .dbs_backup copy) and takes effect when Home Assistant restarts.</p>
        <p>Entities with their own retention rule keep their rule when it is shorter.</p>`)}</h3>
      <p class="muted">${r.configured_days == null ? html`Now ${r.effective_days} days: Home Assistant's default, because <code>${r.file}</code> has no <code>purge_keep_days</code> yet. Saving adds it.` : html`Now ${r.configured_days} days, set by ${where}.`}</p>
      ${r.restart_needed ? html`<div class="warn">Your configuration says <b>${r.effective_days} days</b>, but Home Assistant is running with <b>${r.running_days}</b>. Restart Home Assistant to apply it.
        <button class="b" style="margin-left:8px" @click=${() => (this.ask = { restart: true })}>Restart…</button></div>` : nothing}
      ${locked ? html`<div class="warn err">${r.reason}</div>` : nothing}
      <div class="row"><input type="range" min="1" max=${max} .value=${String(this.days)} ?disabled=${locked} @input=${(e) => (this.days = +e.target.value)}>
        <span class="val">${this.days} day${this.days === 1 ? "" : "s"}</span></div>
      ${this._statesPred(this.days)}
      <div class="row"><button class="b" ?disabled=${this.days === r.effective_days} @click=${() => (this.days = r.effective_days)}>Undo change</button>
        <button class="b go" ?disabled=${locked || this.busy || this.days === r.effective_days} @click=${() => (this.ask = { days: this.days })}>Save…</button></div></div>`;
  }

  // --- long-term statistics ------------------------------------------------------------------
  _steps() { return [...this.cfg.month_steps, null]; }
  _stepper(val, set) {
    const s = this._steps(), i = s.indexOf(val);
    return html`<span class="step"><button ?disabled=${i <= 0} aria-label="Shorter" @click=${() => set(s[i - 1])}>−</button><span>${fmtMonths(val)}</span>
      <button ?disabled=${i >= s.length - 1} aria-label="Longer" @click=${() => set(s[i + 1])}>+</button></span>`;
  }
  _statsPred(h, months) {
    const p = this.pred?.statistics;
    if (!p) return html`<div class="pred">Working out what this would change…</div>`;
    const bpr = p.bytes_per_row, all = sumFrom(h, 0);
    const amt = (rows) => (bpr ? `about ${fmtBytes(rows * bpr)}` : fmtRows(rows));
    const perMonth = h?.length > 1 ? h[1] : h?.[0] || 0;  // last whole month
    if (months == null) return html`<div class="pred">Keeps everything: ${amt(all)} now, growing by ${amt(perMonth * 12)} a year.</div>`;
    const freed = sumFrom(h, months), kept = all - freed;
    return html`<div class="pred ${freed ? "free" : ""}">${freed ? html`Frees ${amt(freed)} at the next monthly run, keeping ${amt(kept)}.` : html`Frees nothing yet: you have less than ${fmtMonths(months)} of these (${amt(all)}).`}
      Will likely grow to around ${perMonth && bpr ? fmtBytes(perMonth * months * bpr) : fmtRows(perMonth * months)}.</div>`;
  }
  _statsCard() {
    const c = this.cfg, p = this.pred?.statistics, ret = c.retention, changed = this.stats !== c.stats_keep_months || this.energy !== c.energy_stats_keep_months;
    const last = c.last_stats_trim;
    return html`<div class="card"><h3>Long-term statistics${tip(html`<p>Hourly averages and totals behind history graphs beyond the state history, and the Energy dashboard. Home Assistant keeps them forever.</p>
        <p>A limit here deletes older hourly rows once a month, in the first nightly retention run of the month${ret.run_at ? ` (at ${ret.run_at})` : ""}. Deleted rows are not backed up.</p>
        <p>Energy dashboard statistics have their own setting, so you can keep them longer to compare years.</p>`)}</h3>
      ${!ret.run_at ? html`<div class="warn">The nightly retention run is off in the integration options, so limits here are only applied by Run retention now.</div>` : nothing}
      <div class="row"><span class="lab"><b>All other statistics</b></span>${this._stepper(this.stats, (v) => (this.stats = v))}</div>
      ${this._statsPred(p?.other, this.stats)}
      <div class="row" style="margin-top:14px"><span class="lab"><b>Energy dashboard statistics</b><div class="muted">${p ? html`<a class="link" title="List them on the Entities tab" @click=${() => this.dispatchEvent(new CustomEvent("goto-filter", { detail: { used_in: ["Energy dashboard"] } }))}>${p.energy_count} statistic${p.energy_count === 1 ? "" : "s"} used by the Energy dashboard</a>` : ""}</div></span>${this._stepper(this.energy, (v) => (this.energy = v))}</div>
      ${this._statsPred(p?.energy, this.energy)}
      ${last ? html`<p class="muted">Last applied ${new Date(last.ts * 1000).toLocaleString()}: ${last.rows.toLocaleString()} rows deleted.</p>` : nothing}
      <div class="row"><button class="b" ?disabled=${!changed} @click=${() => { this.stats = c.stats_keep_months; this.energy = c.energy_stats_keep_months; }}>Undo change</button>
        <button class="b go" ?disabled=${this.busy || !changed} @click=${() => (this.ask = { stats: this.stats, energy: this.energy })}>Save…</button></div></div>`;
  }

  _dialog() {
    const a = this.ask;
    if (!a) return nothing;
    const r = this.cfg.recorder, ret = this.cfg.retention;
    let title, body, go, label = "Save", danger = false;
    if (a.restart) {
      title = "Restart Home Assistant?"; body = html`Home Assistant restarts now and is unavailable for a minute or two.`; label = "Restart";
      go = async () => { this.ask = null; await this.hass.callService("homeassistant", "restart"); };
    } else if (a.days != null) {
      title = `Keep ${a.days} days of state history?`;
      body = html`Writes <code>purge_keep_days: ${a.days}</code> under <code>recorder:</code> in <code>${r.file}</code>. The current file is copied to <code>${r.file}.dbs_backup</code> first. It takes effect when Home Assistant restarts.`;
      go = () => this._save({ keep_days: a.days }, "Saved. Restart Home Assistant to apply the new state retention.");
    } else {
      const next = ret.next_run ? new Date(ret.next_run * 1000).toLocaleString() : "the next Run retention now";
      const less = (a.stats != null && (this.cfg.stats_keep_months == null || a.stats < this.cfg.stats_keep_months)) || (a.energy != null && (this.cfg.energy_stats_keep_months == null || a.energy < this.cfg.energy_stats_keep_months));
      danger = less;
      title = "Change long-term statistics retention?";
      body = html`All other statistics: <b>${fmtMonths(a.stats)}</b>. Energy dashboard statistics: <b>${fmtMonths(a.energy)}</b>.<br>
        ${less ? html`Older hourly statistics are <b>deleted permanently</b> (no backup) at ${next}, then once a month.` : html`Nothing is deleted by this change.`}`;
      go = () => this._save({ stats_keep_months: a.stats, energy_stats_keep_months: a.energy }, "Saved long-term statistics retention.");
    }
    return html`<div class="modal" @click=${() => (this.ask = null)}><div class="dlg" @click=${(e) => e.stopPropagation()}><h3>${title}</h3><div style="font-size:13px">${body}</div>
      <div class="row"><button class="b" @click=${() => (this.ask = null)}>Cancel</button><button class="b go" style=${danger ? "background:var(--error-color,#db4437);border-color:var(--error-color,#db4437)" : ""} ?disabled=${this.busy} @click=${go}>${label}</button></div></div></div>`;
  }

  render() {
    const c = this.cfg;
    if (!c) return html`<div class="muted">Loading settings…</div>`;
    return html`
      ${this.err ? html`<div class="warn err">${this.err}</div>` : nothing}
      ${this.msg ? html`<div class="warn ok">${this.msg} <button class="b" style="margin-left:8px" @click=${() => (this.msg = null)}>Dismiss</button></div>` : nothing}
      <div class="card"><h3>Display</h3>
        <label class="chk"><input type="checkbox" .checked=${c.hide_automations} ?disabled=${this.busy}
          @change=${(e) => this._save({ hide_automations: e.target.checked }, null)}>
          <span><b>Hide automations</b>${tip(html`Leaves automation entities out of the Overview figures and charts and the Entities list. Pick Automation in the Type filter to list them anyway.`)}</span></label></div>
      ${this._statesCard()}
      ${this._statsCard()}
      ${this._dialog()}`;
  }
}
customElements.define("db-settings", DbSettings);
