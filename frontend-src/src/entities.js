import { LitElement, html, css, nothing } from "lit";
import { fmtBytes, fmtAge, FACET_LABELS, STATUS_HELP, SUGGEST_HELP, fmtDay, entityIcon, COLOR_STATS } from "./util.js";

const SUG_CLASS = { "Remove history": "rm", Disable: "dis", "Remove from YAML": "dis", Review: "rev", Keep: "keep" };
const SORTS = { size: "Size", name: "Name", age: "Last update" };

export class DbEntities extends LitElement {
  static properties = {
    data: { attribute: false }, filters: { attribute: false }, search: { type: String },
    sort: { type: String }, selected: { attribute: false }, shown: { type: Number }, usage: { attribute: false },
    busy: { type: Boolean }, growth: { type: Number }, hass: { attribute: false }, expand: { attribute: false }, hideAuto: { type: Boolean },
  };
  static styles = css`
    :host{display:block}
    select option{background:var(--card-background-color,#fff);color:var(--primary-text-color,#000)}
    .bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px}
    input[type=search]{flex:1 1 220px;padding:8px 10px;border-radius:8px;border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color);font:inherit;min-width:0}
    button,select{font:inherit;padding:6px 12px;border-radius:8px;border:1px solid var(--primary-color);background:transparent;color:var(--primary-text-color);cursor:pointer}
    button[disabled]{opacity:.45;cursor:not-allowed} button.primary{background:var(--primary-color);color:var(--text-primary-color,#fff)}
    .muted{color:var(--secondary-text-color);font-size:12px}
    .layout{display:grid;grid-template-columns:300px minmax(0,1fr);gap:12px;align-items:start}
    .facets{display:grid;gap:8px} .facet{border:1px solid var(--divider-color);border-radius:10px;padding:8px 10px;background:var(--card-background-color)}
    .facet b{font-size:13px}
    .fr{position:relative;display:grid;grid-template-columns:22px minmax(0,1fr) auto;align-items:center;gap:4px;padding:3px 6px;margin:2px 0;border-radius:6px;overflow:hidden;font-size:13px;min-height:22px;cursor:pointer}
    .fr i{position:absolute;left:0;top:0;bottom:0;background:var(--primary-color);opacity:.22;border-radius:6px}
    .fr>*:not(i){position:relative} .fr input{margin:0} .lbl{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .val{white-space:nowrap;font-variant-numeric:tabular-nums} small{color:var(--secondary-text-color);margin-left:4px}
    .help{display:inline-block;width:16px;height:16px;line-height:16px;text-align:center;border-radius:50%;border:1px solid var(--secondary-text-color);font-size:11px;cursor:help}
    .tablewrap{border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color)} .tablewrap .head{border-radius:11px 11px 0 0}
    .head,.row{display:grid;grid-template-columns:32px minmax(0,3.5fr) minmax(0,.7fr) minmax(0,.55fr) minmax(0,.55fr) 112px 110px;gap:8px;align-items:center;padding:6px 10px;white-space:nowrap}
    .head{font-size:12px;color:var(--secondary-text-color);border-bottom:1px solid var(--divider-color);background:var(--secondary-background-color)}
    .row{border-bottom:1px solid var(--divider-color);position:relative} .row:hover{background:color-mix(in srgb,var(--primary-text-color) 5%,transparent)} .row.sel:hover{background:color-mix(in srgb,var(--primary-color) 15%,transparent)} .row.sel{background:color-mix(in srgb,var(--primary-color) 10%,transparent)}
    .row>span,.row>a{overflow:hidden;text-overflow:ellipsis;min-width:0} .eid{font-weight:600;text-decoration:none;color:var(--primary-text-color)} .eid:hover{color:var(--primary-color)}
    .size{position:relative;text-align:right;font-variant-numeric:tabular-nums;font-weight:600} .size i{position:absolute;right:0;top:-2px;bottom:-2px;background:var(--primary-color);opacity:.2;border-radius:4px}
    .size span{position:relative}
    .size i.bar2{display:flex;background:none;opacity:1;overflow:hidden} .seg{display:block;height:100%;min-width:0} .seg.st{background:var(--ha-color-primary-20,#488fc2)} .seg.hs{background:var(--ha-color-border-primary-loud,#8353d1)}
    .tip{position:relative;display:inline-flex;vertical-align:middle;margin-left:4px} .tip .pop{display:none;position:absolute;right:0;top:calc(100% + 6px);z-index:15;width:250px;text-align:left;white-space:normal;font-weight:400;font-size:12px;line-height:1.45;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.35);padding:10px 12px}
    .tip:hover .pop,.tip:focus .pop{display:block} .pop i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:-1px} .pop div{margin:3px 0}
    .info{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;border:1px solid var(--secondary-text-color);color:var(--secondary-text-color);font-size:11px;font-style:italic;font-family:serif;cursor:help;flex:0 0 auto}
    .inspect{flex:0 0 auto;display:inline-flex;align-items:center;padding:2px 5px;border-radius:6px;border-color:var(--divider-color);color:var(--secondary-text-color)} .inspect:hover{color:var(--primary-text-color);border-color:var(--primary-color)}
    .chip{font-size:12px;padding:1px 7px;border-radius:12px;margin:0;white-space:nowrap} .chip.none{border-color:var(--warning-color,orange)} .chip.used{border-color:var(--success-color,green)}
    .selbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:0 0 10px;padding:8px 14px;border-radius:12px;background:var(--card-background-color);border:1px solid var(--primary-color)}
    .selbar .x{padding:0 8px;line-height:24px;border-radius:50%;border-color:var(--divider-color)}
    .banner{display:flex;align-items:center;gap:8px;border:1px solid var(--primary-color);border-radius:10px;padding:6px 12px;margin:0 0 10px;font-size:13px;background:var(--card-background-color)} .banner .x{padding:0 8px;line-height:22px;border-radius:50%;border-color:var(--divider-color)}
    .row>.c-status{overflow:visible;display:flex;align-items:center}
    .sugg{display:inline-block;font-size:12px;line-height:18px;border:1px solid var(--secondary-text-color);border-radius:10px;padding:0 8px;white-space:nowrap;box-sizing:border-box}
    .sugg.rev{border-color:var(--secondary-text-color);color:var(--primary-text-color)}
    .sugg.rm{border-color:var(--error-color,#db4437);color:var(--error-color,#db4437)} .sugg.dis{border-color:var(--warning-color,orange);color:var(--warning-color,orange)} .sugg.keep{border-color:var(--success-color,green);color:var(--success-color,green)}
    .cnt{font-size:11px;border:1px solid var(--divider-color);border-radius:8px;padding:0 6px;color:var(--secondary-text-color);cursor:help} .tabicon{--mdc-icon-size:18px;vertical-align:middle;margin-right:4px;color:var(--secondary-text-color)}
    .ico{flex:0 0 auto;display:inline-flex;color:var(--secondary-text-color);--mdc-icon-size:20px} .ico.off{color:var(--warning-color,#ff9800)}
    .fr.zero{opacity:.45} .fr.more{color:var(--primary-color)} .fr.more:hover{background:color-mix(in srgb,var(--primary-color) 12%,transparent)}
    .detail{border:1px solid var(--primary-color);border-radius:10px;padding:8px 12px;margin:10px 0;background:var(--card-background-color)} .detail ul{margin:6px 0;padding-left:18px}
    .kind{font-size:11px;border:1px solid var(--divider-color);border-radius:8px;padding:0 6px;margin-right:4px} .warn{background:var(--secondary-background-color);border-radius:8px;padding:6px 10px;margin:6px 0;font-size:12px}
    a{color:var(--primary-color)} .chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px} .fchip{font-size:12px;border:1px solid var(--primary-color);border-radius:12px;padding:1px 8px;cursor:pointer}
    .ret{flex:0 0 auto;font-size:11px;border:1px solid var(--primary-color);color:var(--primary-color);border-radius:8px;padding:0 6px;line-height:16px;cursor:help}
    .hideauto{display:inline-flex;align-items:center;gap:6px;font-size:13px;white-space:nowrap;cursor:pointer} .hideauto input{margin:0}
    .filtertoggle{display:none}
    @media (max-width:900px){.layout{grid-template-columns:1fr}.filtertoggle{display:inline-block}.facets.closed{display:none}
      .head,.row{grid-template-columns:32px minmax(0,1fr) auto auto}.c-int,.c-dev,.c-age,.c-status{display:none}}`;

  constructor() { super(); this.filters = {}; this.selected = new Set(); this.shown = 100; this.sort = "size"; this.search = ""; this._facetsOpen = false; }

  // Search as you type (short delay), and at once when the box is emptied with the x or by hand.
  _onSearch(v, now = false) {
    clearTimeout(this._st);
    const q = v.trim();
    if (q === this.search) return;
    const go = () => this._emit("search", q);
    now || q === "" ? go() : (this._st = setTimeout(go, 350));
  }
  _emit(name, detail) { this.dispatchEvent(new CustomEvent(name, { detail })); }
  _toggleFilter(f, v, on) {
    const cur = new Set(this.filters[f] || []);
    on ? cur.add(v) : cur.delete(v);
    this._emit("filters", { ...this.filters, [f]: [...cur] });
  }
  _rows() {
    const items = [...(this.data?.items || [])];
    const sz = (i) => (this.data?.window ? i.win_bytes : i.total_bytes);
    if (this.sort === "name") items.sort((a, b) => a.entity_id.localeCompare(b.entity_id));
    else if (this.sort === "age") items.sort((a, b) => (b.last_ts || 0) - (a.last_ts || 0));
    else items.sort((a, b) => sz(b) - sz(a));
    return items;
  }
  _toggleSel(id, on) { const s = new Set(this.selected); on ? s.add(id) : s.delete(id); this._emit("selected", s); }
  _selectAll(rows, on) { const s = new Set(this.selected); rows.forEach((r) => on ? s.add(r.entity_id) : s.delete(r.entity_id)); this._emit("selected", s); }
  _moreInfo(entityId) { this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true })); }

  _facet(name, rows) {
    const max = Math.max(...rows.map((r) => r.bytes), 1);
    return html`<div class="facet"><b>${FACET_LABELS[name] || name}</b>
      ${name === "status" ? html` <span class="help" title=${STATUS_HELP}>?</span>` : nothing}
      ${name === "suggestion" ? html` <span class="help" title=${SUGGEST_HELP}>?</span>` : nothing}
      ${rows.map((r) => {
        const on = (this.filters[name] || []).includes(r.value);
        if (r.other) return html`<div class="fr more" title="Show all of them" @click=${() => this._emit("expand", { facet: name, on: true })}><i style="width:${Math.max(1, (r.bytes / max) * 100)}%"></i><span></span><span class="lbl">${r.value} ▾</span><span class="val">${fmtBytes(r.bytes)}<small>${r.count}</small></span></div>`;
        return html`<label class="fr ${r.count === 0 && !on ? "zero" : ""}"><i style="width:${Math.max(1, (r.bytes / max) * 100)}%"></i>
          ${r.other ? html`<span></span>` : html`<input type="checkbox" .checked=${on} @change=${(e) => this._toggleFilter(name, r.value, e.target.checked)}>`}
          <span class="lbl" title=${r.value}>${r.value}</span><span class="val">${fmtBytes(r.bytes)}<small>${r.count}</small></span></label>`;
      })}
      ${(this.expand || []).includes(name) && rows.length > 8 ? html`<div class="fr more" @click=${() => this._emit("expand", { facet: name, on: false })}><span></span><span class="lbl">Show fewer ▴</span><span></span></div>` : nothing}
      ${name === "used_in" ? html`<div class="muted">An entity can appear under several kinds.</div>` : nothing}</div>`;
  }

  _link(href, text, icon) {
    return html`<a href=${href} @click=${(e) => { e.preventDefault(); this._emit("navigate", href); }}>${icon ? html`<ha-icon class="tabicon" .icon=${icon}></ha-icon>` : nothing}${text}</a>`;
  }

  // Dashboards: "Main > <tab link> card gauge", so the tab itself is the link. Others link the item name.
  _locText(l) {
    const m = l.kind === "Dashboard" && l.link ? /^(view "[^"]*")(?:, )?(.*)$/.exec(l.where) : null;
    if (m) return html`${l.name} <span class="muted">›</span> ${this._link(l.link, m[1].slice(6, -1), l.icon)}${m[2] ? html` <span class="muted">${m[2]}</span>` : nothing}`;
    return html`${l.link ? this._link(l.link, l.name) : l.name} <span class="muted">${l.where}</span>`;
  }

  _usageDetail() {
    const u = this.usage;
    if (!u) return nothing;
    const dyn = u.dynamic_possible?.length ? html`<div class="warn">These templates loop over every entity of this type, so they may use it without naming it: ${u.dynamic_possible.join(", ")}.</div>` : nothing;
    const head = u.entity_ids
      ? html`<b>${u.entity_ids.length} selected entit${u.entity_ids.length === 1 ? "y" : "ies"}</b> appear in these places (a number shows how many of them are in a place):`
      : html`<span class="ico" style="vertical-align:middle">${entityIcon(this.hass, u.entity_id)}</span> <b>${this.data?.items?.find((i) => i.entity_id === u.entity_id)?.name || u.entity_id}</b> is referenced in:`;
    return html`<div class="detail">${head}
      <ul>${u.locations.length ? u.locations.map((l) => html`<li><span class="kind">${l.kind}</span>
        ${this._locText(l)}${l.count > 1 ? html` <span class="cnt" title=${l.entities.join("\n")}>×${l.count}</span>` : nothing}</li>`) : html`<li class="muted">No literal reference found in automations, scripts, scenes, dashboards, helpers, the Energy dashboard or YAML files.</li>`}</ul>
      ${dyn}<details><summary>What this scan can miss</summary><ul>${(this.data?.caveats || []).map((c) => html`<li>${c}</li>`)}</ul></details>
      <button @click=${() => this._emit("usage", null)}>Close</button></div>`;
  }

  render() {
    const d = this.data;
    if (!d) return html`<div class="muted">Waiting for the first scan to finish.</div>`;
    const rows = this._rows();
    const vis = rows.slice(0, this.shown);
    const win = !!d.window;
    const sz = (r) => (win ? r.win_bytes : r.total_bytes);
    const maxB = Math.max(...vis.map(sz), 1);
    const allOn = vis.length > 0 && vis.every((r) => this.selected.has(r.entity_id));
    const selBytes = (d.items || []).filter((i) => this.selected.has(i.entity_id)).reduce((s, i) => s + sz(i), 0);
    const active = Object.entries(this.filters).flatMap(([f, vs]) => vs.map((v) => [f, v]));
    return html`
      <div class="bar">
        <input type="search" placeholder="Search name or entity id" .value=${this.search} @input=${(e) => this._onSearch(e.target.value)} @change=${(e) => this._onSearch(e.target.value, true)}>
        <select @change=${(e) => this._emit("sort", e.target.value)} title="Sort">${Object.entries(SORTS).map(([k, v]) => html`<option value=${k} ?selected=${this.sort === k}>Sort: ${v}</option>`)}</select>
        <label class="hideauto" title="Automation entities are hidden by default. Untick to include them."><input type="checkbox" .checked=${this.hideAuto} @change=${(e) => this._emit("hideauto", e.target.checked)}> Hide automations</label>
        <button class="filtertoggle" @click=${() => { this._facetsOpen = !this._facetsOpen; this.requestUpdate(); }}>Filters${active.length ? ` (${active.length})` : ""}</button>
      </div>
      ${this.selected.size ? html`<div class="selbar"><b>${this.selected.size} selected</b>
        <button class="x" title="Clear selection" aria-label="Clear selection" @click=${() => this._emit("selected", new Set())}>✕</button>
        <span class="muted">≈ ${fmtBytes(selBytes)} of ${win ? "data written in this period" : "entity data"}</span>
        ${this.selected.size < d.items.length ? html`<button @click=${() => this._emit("selected", new Set(d.items.map((i) => i.entity_id)))}>Select all ${d.items.length.toLocaleString()} matching</button>` : nothing}
        <span style="flex:1"></span>
        <button title="Turns these entities off in Home Assistant so they stop recording. Nothing is deleted and it can be undone from the History tab. Entities defined in your YAML files stay in those files; remove them there to get rid of them for good." @click=${() => this._emit("action", "disable")}>Disable</button>
        <button title="Deletes their long-term statistics, and optionally their recorded state history. Everything deleted is first saved in one compressed backup, so the whole action can be undone from the History tab." @click=${() => this._emit("action", "delete_history")}>Clear history</button>
        <button title="Disables them first so nothing is recorded again, then clears their history. Everything deleted is first saved in one compressed backup, and undoing from the History tab restores it and turns them back on." @click=${() => this._emit("action", "disable_and_clear")}>Disable + clear</button>
        <button title="Choose how many days of detailed states to keep (1, 3, 5, 7 or Home Assistant's default). Long-term statistics (graphs, Energy) are kept." @click=${() => this._emit("action", "reduce_retention")}>Change retention</button></div>` : nothing}
      ${win ? html`<div class="banner"><span>≈ <b>${fmtBytes((d.items || []).reduce((t, i) => t + (i.win_bytes || 0), 0))}</b> of <b>${(d.items || []).length.toLocaleString()}</b> entities changed between <b>${fmtDay(d.window.from)}</b> and <b>${fmtDay(d.window.to)}</b>.</span>
        <span class="info" title=${`Entities that wrote data in this period, with the estimated size of what they wrote.${this.growth != null ? `\nThe database file changed by ${this.growth >= 0 ? "+" : "-"}${fmtBytes(Math.abs(this.growth))} across it.` : ""}\nState history is only kept for ${d.window.keep_days} days, so older periods show long-term statistics only.`}>i</span>
        <span style="flex:1"></span><button class="x" title="Clear the period filter" aria-label="Clear the period filter" @click=${() => this._emit("clearwindow")}>✕</button></div>` : nothing}
      <div class="layout">
        <div class="facets ${this._facetsOpen ? "" : "closed"}">${Object.entries(d.facets).map(([n, r]) => this._facet(n, r))}</div>
        <div>
          ${this._usageDetail()}
          <div class="tablewrap">
            <div class="head"><input type="checkbox" .checked=${allOn} @change=${(e) => this._selectAll(vis, e.target.checked)} title="Select all shown">
              <span>Entity</span><span class="c-int">Integration</span><span class="c-dev">Device</span><span class="c-age">Last update</span><span class="c-status">Suggestion</span><span style="text-align:right">${win ? "In period" : "Size"}<span class="tip" tabindex="0"><span class="info" style="font-style:normal">?</span><span class="pop"><div><b>${win ? "Estimated size of what each entity wrote in the period" : "Estimated size of all its stored data"}</b></div>
              <div><i style="background:var(--ha-color-primary-20,#488fc2)"></i>States and attributes</div><div><i style="background:var(--ha-color-border-primary-loud,#8353d1)"></i>Long-term statistics (hourly and 5-minute)</div>
              <div class="muted">The bar splits each entity's size between the two. Hover a size for the exact split.</div></span></span></span></div>
            ${vis.map((r) => this._row(r, maxB, sz))}
          </div>
          ${rows.length > this.shown ? html`<button style="margin-top:8px" @click=${() => this._emit("more")}>Show ${Math.min(100, rows.length - this.shown)} more of ${rows.length - this.shown} remaining</button>` : nothing}
        </div>
      </div>
`;
  }

  // Share of an entity's storage that is detailed states (with attributes) rather than long-term statistics.
  _split(r) {
    const st = (r.states_bytes || 0) + (r.attrs_bytes || 0), h = r.stats_bytes || 0;
    return st + h > 0 ? st / (st + h) : 1;
  }
  _splitTip(r, size) {
    const f = this._split(r);
    return `States ${fmtBytes(size * f)} · Long-term statistics ${fmtBytes(size * (1 - f))}`;
  }

  _row(r, maxB, sz) {
    const none = r.used_in[0] === "Not referenced";
    const dyn = r.dynamic_possible ? ` +${r.dynamic_possible} dyn` : "";
    const meta = `${r.integration} · ${r.device} · ${r.status} · ${r.age}`;
    return html`<div class="row ${this.selected.has(r.entity_id) ? "sel" : ""}">
      <input type="checkbox" .checked=${this.selected.has(r.entity_id)} @change=${(e) => this._toggleSel(r.entity_id, e.target.checked)}>
      <span style="display:flex;gap:8px;align-items:center;min-width:0">${r.status === "Disabled" ? html`<span class="ico off" title="Disabled in Home Assistant"><ha-icon icon="mdi:cancel"></ha-icon></span>` : html`<span class="ico">${entityIcon(this.hass, r.entity_id)}</span>`}<a class="eid" href="#" title=${`${r.entity_id}\n${meta}`} style="overflow:hidden;text-overflow:ellipsis" @click=${(e) => { e.preventDefault(); this._moreInfo(r.entity_id); }}>${r.name || r.entity_id}</a>
        ${r.retention_days ? html`<span class="ret" title=${`Retention rule: state history is kept for ${r.retention_days} days (Home Assistant's default is longer). Rows older than that are deleted every night.`}>${r.retention_days}d</span>` : nothing}
        <button class="inspect" title="Inspect the raw data stored for this entity (states, attributes, statistics)" aria-label="Inspect stored data" @click=${() => this._emit("inspect", r)}><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m1 2v3h16V5H4m0 5v4h5v-4H4m7 0v4h9v-4h-9m-7 6v3h5v-3H4m7 0v3h9v-3h-9z"/></svg></button><button class="chip ${none ? "none" : "used"}" title=${none ? "No literal reference found in config" : `${r.used_count} reference${r.used_count === 1 ? "" : "s"}: ${r.used_in.join(", ")}`} @click=${() => this._emit("usage", r.entity_id)}>${none ? "0" : r.used_count} 🔗${dyn}</button></span>
      <span class="c-int muted">${r.integration}</span><span class="c-dev muted">${r.device}</span><span class="c-age muted">${r.age}</span><span class="c-status"><span class="sugg ${SUG_CLASS[r.suggestion] || ""}" title=${`${r.suggestion} (${(r.confidence || "").toLowerCase()} confidence)\n${(r.reasons || []).join("\n")}`}>${r.suggestion}</span></span>
      <span class="size" title=${this._splitTip(r, sz(r))}><i class="bar2" style="width:${Math.max(2, (sz(r) / maxB) * 100)}%"><b class="seg st" style="flex:${this._split(r)}"></b><b class="seg hs" style="flex:${1 - this._split(r)}"></b></i><span>${fmtBytes(sz(r))}</span></span></div>`;
  }
}
customElements.define("db-entities", DbEntities);
