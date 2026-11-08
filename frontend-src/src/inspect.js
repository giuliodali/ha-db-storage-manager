import { LitElement, html, css, nothing } from "lit";
import { fmtBytes, entityIcon } from "./util.js";

const TABS = [["states", "State history"], ["statistics", "Hourly statistics"], ["short_term", "5-minute statistics"]];
const SIZES = [25, 50, 100];

export class DbInspect extends LitElement {
  static properties = {
    entityId: { type: String }, name: { type: String }, hass: { attribute: false }, ws: { attribute: false },
    kind: { state: true }, size: { state: true }, page: { state: true }, data: { state: true }, loading: { state: true },
    sel: { state: true }, _all: { state: true }, error: { state: true },
  };
  static styles = css`
    :host{position:fixed;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);padding:12px}
    .dlg{background:var(--card-background-color);color:var(--primary-text-color);border-radius:14px;width:min(1240px,100%);max-height:92vh;display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,.4)}
    header{display:flex;align-items:center;gap:10px;padding:14px 18px 8px} header .t{flex:1;min-width:0} header b{font-size:17px} .muted{color:var(--secondary-text-color);font-size:12px}
    .ico{display:inline-flex;--mdc-icon-size:26px;color:var(--secondary-text-color)}
    button{font:inherit;padding:4px 12px;border-radius:8px;border:1px solid var(--primary-color);background:transparent;color:var(--primary-text-color);cursor:pointer}
    button[disabled]{opacity:.4;cursor:not-allowed} button.x{border-color:var(--divider-color);padding:0 9px;line-height:26px;border-radius:50%}
    .tabs{display:flex;gap:4px;padding:0 18px;border-bottom:1px solid var(--divider-color)}
    .tabs button{border:none;border-bottom:3px solid transparent;border-radius:0;color:var(--secondary-text-color);padding:8px 12px}
    .tabs button.on{color:var(--primary-text-color);border-bottom-color:var(--primary-color)}
    .body{flex:1;min-height:260px;display:grid;grid-template-columns:minmax(260px,38%) minmax(0,1fr);overflow:hidden;border-bottom:1px solid var(--divider-color)}
    .list{overflow:auto;padding:0 0 0 18px;outline:none} .detail{overflow:auto;padding:12px 18px;border-left:1px solid var(--divider-color)}
    table{width:100%;border-collapse:collapse;font-size:13px} th{position:sticky;top:0;background:var(--card-background-color);text-align:left;font-weight:500;color:var(--secondary-text-color);font-size:12px;padding:8px 6px;border-bottom:1px solid var(--divider-color)}
    td{padding:6px;border-bottom:1px solid var(--divider-color);vertical-align:top} tr.r{cursor:pointer} tr.r:hover{background:var(--secondary-background-color)}
    tr.r.on{background:color-mix(in srgb,var(--primary-color) 16%,transparent);box-shadow:inset 3px 0 0 var(--primary-color)}
    td.time{white-space:nowrap;color:var(--secondary-text-color);font-variant-numeric:tabular-nums} td.num{text-align:right;font-variant-numeric:tabular-nums}
    .st{font-weight:600} .st.dim{color:var(--secondary-text-color);font-weight:400;font-style:italic}
    .kv{display:grid;grid-template-columns:minmax(110px,200px) minmax(0,1fr);gap:4px 14px;font-size:13px} .kv i{color:var(--secondary-text-color);font-style:normal;word-break:break-all} .kv span{word-break:break-word}
    .kv .sep{grid-column:1/-1;border-top:1px solid var(--divider-color);margin:4px 0}
    table.grid{width:auto;min-width:min(720px,100%)} table.grid th,table.grid td{padding-right:28px}
    details{margin:0} summary{cursor:pointer;list-style-position:outside} .jc{margin-left:14px;border-left:1px solid var(--divider-color);padding-left:10px}
    .jk{color:var(--primary-color)} .j-string{color:var(--success-color,#43a047)} .j-number,.j-boolean{color:var(--warning-color,#e65100)} .j-null{color:var(--secondary-text-color)}
    .jall{font:inherit;font-size:11px;float:right;border:1px solid var(--divider-color);background:transparent;color:var(--secondary-text-color);border-radius:8px;padding:0 8px;cursor:pointer}
    .detail h4{margin:0 0 8px;font-size:14px}
    footer{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 18px 14px;border-top:1px solid var(--divider-color)}
    select{font:inherit;padding:3px 6px;border-radius:6px;border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color)} select option{background:var(--card-background-color);color:var(--primary-text-color)}
    .empty{padding:30px;text-align:center;color:var(--secondary-text-color)}
    @media (max-width:800px){.body{grid-template-columns:1fr;overflow:auto}.list{max-height:40vh;padding:0 12px}.detail{border-left:none;border-top:1px solid var(--divider-color)}}`;

  constructor() { super(); this.kind = "states"; this.size = 25; this.page = 0; this._cursors = [null]; this.sel = null; this._all = new Set(); }
  connectedCallback() { super.connectedCallback(); this._load(0); }

  async _load(page) {
    this.loading = true; this.error = null;
    try {
      const res = await this.ws("entity_rows", { entity_id: this.entityId, kind: this.kind, limit: this.size, ...(this._cursors[page] ? { cursor: this._cursors[page] } : {}) });
      if (page === 0) this._total = res.total;
      this._cursors[page + 1] = res.next;
      this.data = res; this.page = page; this.sel = res.rows[0]?.id ?? null;
    } catch (e) { this.error = e.message || JSON.stringify(e); }
    this.loading = false;
  }
  _tab(kind) { this.kind = kind; this._cursors = [null]; this.data = null; this._load(0); }
  _resize(n) { this.size = n; this._cursors = [null]; this._load(0); }
  _t(ts) { return ts == null ? "" : new Date(ts * 1000).toLocaleString([], { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }); }
  _n(v) { return v == null ? "" : Math.abs(v) >= 1000 ? v.toLocaleString(undefined, { maximumFractionDigits: 2 }) : String(Math.round(v * 1000) / 1000); }
  _v(v, key) {
    if (v === null || typeof v !== "object") return String(v);
    const all = this._all.has(key);
    return html`<button class="jall" @click=${() => { const s = new Set(this._all); all ? s.delete(key) : s.add(key); this._all = s; }}>${all ? "Collapse all" : "Expand all"}</button>${this._jv(v, all, 0, true)}`;
  }
  // Collapsible JSON: the top level and its first item start open; "Expand all" opens everything.
  _jv(v, all, depth, first) {
    if (v === null || typeof v !== "object") return html`<span class="j-${v === null ? "null" : typeof v}">${JSON.stringify(v)}</span>`;
    const arr = Array.isArray(v), ent = arr ? v.map((x, i) => [i, x]) : Object.entries(v);
    if (!ent.length) return html`<span class="j-null">${arr ? "[]" : "{}"}</span>`;
    const brief = ent.slice(0, 3).map(([k, x]) => (arr ? "" : `${k}: `) + (typeof x === "object" && x ? (Array.isArray(x) ? "[…]" : "{…}") : JSON.stringify(x))).join(", ");
    return html`<details ?open=${all || depth === 0 || (depth === 1 && first)}><summary>${arr ? `Array(${ent.length})` : `Object(${ent.length})`} <span class="muted">${brief}${ent.length > 3 ? ", …" : ""}</span></summary>
      <div class="jc">${ent.map(([k, x], i) => html`<div><span class="jk">${k}</span>: ${this._jv(x, all, depth + 1, i === 0)}</div>`)}</div></details>`;
  }
  _pick(id) { this.sel = id; }
  _key(e) {
    const rows = this.data?.rows || [];
    const i = rows.findIndex((r) => r.id === this.sel);
    const j = e.key === "ArrowDown" ? Math.min(rows.length - 1, i + 1) : e.key === "ArrowUp" ? Math.max(0, i - 1) : -1;
    if (j >= 0) { e.preventDefault(); this.sel = rows[j].id; this.updateComplete.then(() => this.renderRoot.querySelector("tr.on")?.scrollIntoView({ block: "nearest" })); }
  }

  _list(rows) {
    return html`<table><thead><tr><th>Updated</th><th>State</th><th class="num" title="How many attributes are stored with this row">Attrs</th></tr></thead><tbody>
      ${rows.map((r) => {
        const dim = r.state === "unavailable" || r.state === "unknown";
        return html`<tr class="r ${r.id === this.sel ? "on" : ""}" @click=${() => this._pick(r.id)}>
          <td class="time">${this._t(r.ts)}</td><td><span class="st ${dim ? "dim" : ""}">${r.state}</span></td><td class="num">${Object.keys(r.attributes).length}</td></tr>`;
      })}</tbody></table>`;
  }
  _grid(rows) {
    return html`<table class="grid"><thead><tr><th>${this.kind === "short_term" ? "Period start" : "Hour"}</th><th class="num">Mean</th><th class="num">Min</th><th class="num">Max</th><th class="num">State</th><th class="num">Sum</th></tr></thead><tbody>
      ${rows.map((r) => html`<tr><td class="time">${this._t(r.ts)}</td><td class="num">${this._n(r.mean)}</td><td class="num">${this._n(r.min)}</td><td class="num">${this._n(r.max)}</td><td class="num">${this._n(r.state)}</td><td class="num">${this._n(r.sum)}</td></tr>`)}</tbody></table>`;
  }
  _detail(r) {
    if (!r) return html`<div class="muted">Select a row to see everything stored for it.</div>`;
    if (this.kind === "states") {
      const keys = Object.keys(r.attributes);
      return html`<h4>${this._t(r.ts)}</h4><div class="kv">
        <i>state</i><span class="st">${r.state}</span>
        <i>last_updated</i><span>${this._t(r.ts)}</span>
        <i>last_changed</i><span>${this._t(r.changed_ts)}</span>
        <div class="sep"></div>
        ${keys.length ? keys.map((k) => html`<i>${k}</i><span>${this._v(r.attributes[k], `${r.id}:${k}`)}</span>`) : html`<i>attributes</i><span class="muted">none</span>`}
        <div class="sep"></div>
        <i>stored attribute size</i><span>${fmtBytes(r.attr_bytes)} <span class="muted">(shared with other rows that have the same attributes)</span></span>
        <i>row id</i><span>${r.id}</span></div>`;
    }
  }

  render() {
    const d = this.data, rows = d?.rows || [];
    const from = this.page * this.size + 1, to = this.page * this.size + rows.length;
    return html`<div class="dlg" @click=${(e) => e.stopPropagation()}>
      <header><span class="ico">${entityIcon(this.hass, this.entityId)}</span>
        <div class="t"><b>${this.name || this.entityId}</b><div class="muted">${this.entityId} · what the recorder has stored, newest first${this.kind === "states" ? ". Pick a row to see all of it." : ""}</div></div>
        <button class="x" title="Close" @click=${() => this.dispatchEvent(new CustomEvent("close"))}>✕</button></header>
      <div class="tabs">${TABS.map(([k, v]) => html`<button class=${this.kind === k ? "on" : ""} @click=${() => this._tab(k)}>${v}</button>`)}</div>
      ${this.error || !d || !rows.length
        ? html`<div class="body" style="display:block"><div class="empty">${this.error ? this.error : !d ? "Loading…" : this.kind === "states" ? "No state history is stored for this entity (it may be older than the recorder retention, or excluded)." : "No statistics are stored for this entity."}</div></div>`
        : this.kind !== "states" ? html`<div class="body" style="display:block;overflow:auto"><div style="padding:0 18px">${this._grid(rows)}</div></div>`
        : html`<div class="body"><div class="list" tabindex="0" @keydown=${(e) => this._key(e)}>${this._list(rows)}</div><div class="detail">${this._detail(rows.find((r) => r.id === this.sel))}</div></div>`}
      <footer>
        <button ?disabled=${this.page === 0 || this.loading} @click=${() => this._load(this.page - 1)}>‹ Newer</button>
        <button ?disabled=${!d?.next || this.loading} @click=${() => this._load(this.page + 1)}>Older ›</button>
        <span class="muted">${rows.length ? `Rows ${from.toLocaleString()}–${to.toLocaleString()}` : ""}${this._total != null ? ` of ${this._total.toLocaleString()}` : ""}${this.loading ? " · loading…" : ""}</span>
        <span style="flex:1"></span><span class="muted">Rows per page</span>
        <select @change=${(e) => this._resize(+e.target.value)}>${SIZES.map((n) => html`<option value=${n} ?selected=${this.size === n}>${n}</option>`)}</select></footer>
    </div>`;
  }
}
customElements.define("db-inspect", DbInspect);
