import { LitElement, html, css } from "lit";
import "./chart.js";
import { fmtBytes, entityIcon, COLOR_STATS, COLOR_UNDO, themeColor } from "./util.js";

export class DbOverview extends LitElement {
  static properties = { data: { attribute: false }, history: { attribute: false }, days: { type: Number }, window: { attribute: false }, hass: { attribute: false }, live: { attribute: false } };
  static styles = css`
    :host{display:block}
    select option{background:var(--card-background-color,#fff);color:var(--primary-text-color,#000)}
    .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:12px}
    .kpi{border:1px solid var(--divider-color);border-radius:12px;padding:10px 14px;background:var(--card-background-color)}
    .kpi.click{cursor:pointer} .kpi.click:hover{border-color:var(--primary-color)}
    .kpi b{display:block;font-size:22px;margin-top:2px} .kpi span{font-size:12px;color:var(--secondary-text-color)}
    .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:340px;gap:12px}
    .tree{grid-column:span 2;grid-row:span 2}
    .card{border:1px solid var(--divider-color);border-radius:12px;padding:10px 14px;background:var(--card-background-color);min-width:0;display:flex;flex-direction:column}
    .card h3{margin:0 0 4px;font-size:15px} .hint{font-size:12px;color:var(--secondary-text-color);margin-bottom:4px}
    .toplist{flex:1;overflow:auto;padding:1px 4px 1px 1px;display:grid;align-content:start;gap:3px}
    .tl{position:relative;display:grid;grid-template-columns:24px minmax(0,1fr) auto;align-items:center;gap:6px;padding:3px 8px;border-radius:6px;overflow:hidden;cursor:pointer;font-size:13px;min-height:24px}
    .tl i{position:absolute;left:0;top:0;bottom:0;background:var(--primary-color);opacity:.22;border-radius:6px} .tl i.un{background:var(--accent-color,#ff9800);opacity:.3}
    .tl>*:not(i){position:relative} .tl .nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap} .tl .sz{font-variant-numeric:tabular-nums;color:var(--secondary-text-color)}
    .tl .ico{display:inline-flex;--mdc-icon-size:20px;color:var(--secondary-text-color)} .tl:hover{box-shadow:inset 0 0 0 1px var(--primary-color)}
    .key{display:flex;gap:14px;font-size:12px;color:var(--secondary-text-color);margin:2px 0 6px} .key i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:-1px}
    .tip{position:relative;display:inline-flex;vertical-align:middle;margin-left:6px;font-weight:400} .tip .pop{display:none;position:absolute;right:0;top:calc(100% + 6px);z-index:15;width:260px;text-align:left;white-space:normal;font-size:12px;line-height:1.45;color:var(--primary-text-color);background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.35);padding:10px 12px}
    .tip:hover .pop,.tip:focus .pop{display:block} .pop div{margin:5px 0} .pop i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:-1px}
    .info{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;border:1px solid var(--secondary-text-color);color:var(--secondary-text-color);font-size:11px;font-style:normal;cursor:help}
    select{font:inherit;padding:2px 6px;border-radius:6px;border:1px solid var(--divider-color);background:var(--card-background-color);color:var(--primary-text-color)}
    @media (max-width:1000px){.grid{grid-template-columns:1fr;grid-auto-rows:auto}.tree{grid-column:auto;grid-row:auto}}`;

  // History inside the selected window (0 = everything we have).
  _windowed() {
    const h = this.history || [];
    if (!this.days || !h.length) return h;
    const from = h.at(-1).ts - this.days * 86400;
    return h.filter((r) => r.ts >= from);
  }

  _historyOpt = (t) => {
    const h = this._windowed();
    const states = themeColor(this, "--ha-color-primary-20", t.primary);
    const stats = themeColor(this, "--ha-color-border-primary-loud", COLOR_STATS);
    const day = (v) => new Date(v).toLocaleDateString([], { day: "numeric", month: "short" });
    // Stacked bottom to top: free space + undo backups, long-term statistics, everything else (the top edge is the file size plus the undo backups kept beside it).
    return {
      grid: { left: 8, right: 16, top: 12, bottom: 8, containLabel: true },
      tooltip: { trigger: "axis", valueFormatter: (v) => fmtBytes(v) },
      xAxis: { type: "time", minInterval: 86400000, axisLabel: { color: t.muted, formatter: day, hideOverlap: true }, axisLine: { lineStyle: { color: t.line } } },
      yAxis: { type: "value", min: 0, axisLabel: { color: t.muted, formatter: (v) => fmtBytes(v) }, splitLine: { lineStyle: { color: t.line } } },
      legend: { show: false },
      series: [
        { name: "Free Space/Undo Data", type: "line", stack: "size", showSymbol: false, itemStyle: { color: COLOR_UNDO }, lineStyle: { width: 1, color: COLOR_UNDO }, areaStyle: { color: COLOR_UNDO, opacity: 0.55 }, data: h.map((r) => [r.ts * 1000, (r.undo_bytes || 0) + (r.free_bytes || 0)]) },
        { name: "Long-term statistics", type: "line", stack: "size", showSymbol: false, itemStyle: { color: stats }, lineStyle: { width: 1, color: stats }, areaStyle: { color: stats, opacity: 0.7 }, data: h.map((r) => [r.ts * 1000, r.stats_bytes || 0]) },
        { name: "Everything else", type: "line", stack: "size", showSymbol: h.length < 40, itemStyle: { color: states }, lineStyle: { width: 1, color: states }, areaStyle: { color: states, opacity: 0.45 }, data: h.map((r) => [r.ts * 1000, Math.max(0, r.file_bytes - (r.stats_bytes || 0) - (r.free_bytes || 0))]),
          markArea: this.window ? { silent: true, itemStyle: { color: t.primary, opacity: 0.18 }, data: [[{ xAxis: this.window[0] * 1000 }, { xAxis: this.window[1] * 1000 }]] } : undefined },
      ],
    };
  };

  _treemap = (t) => {
    const by = {};
    for (const i of this.data?.items || []) {
      const a = (by[i.integration] ||= {});
      a[i.domain] = (a[i.domain] || 0) + i.total_bytes;
    }
    const data = Object.entries(by).map(([integ, doms]) => ({
      name: integ, children: Object.entries(doms).map(([d, v]) => ({ name: d, value: v, integration: integ, domain: d })),
    }));
    return {
      tooltip: { formatter: (p) => `${p.treePathInfo.map((x) => x.name).filter(Boolean).join(" / ")}<br>${fmtBytes(p.value)}` },
      series: [{ type: "treemap", roam: false, nodeClick: false, breadcrumb: { show: false }, width: "100%", height: "100%",
        label: { color: "#fff", overflow: "truncate" }, upperLabel: { show: true, height: 20, color: "#fff" },
        itemStyle: { borderColor: t.line, gapWidth: 1 }, levels: [{ itemStyle: { borderWidth: 2, gapWidth: 2 } }, { colorSaturation: [0.35, 0.6] }], data }],
    };
  };

  render() {
    const d = this.data;
    if (!d) return html`<div class="hint">Waiting for the first scan to finish.</div>`;
    const last = (this.history || []).at(-1);
    const cur = this.live || last;  // live reading when we have it; the latest snapshot otherwise
    const sizeTip = cur ? `Database size = pages × page size, the figure SQLite tools report.\n` +
      (cur.main_bytes != null ? `On disk: main file ${fmtBytes(cur.main_bytes)} + write-ahead log ${fmtBytes(cur.wal_bytes || 0)}.\n` : "") +
      `Exact: ${cur.file_bytes.toLocaleString()} bytes (1 MB here = 1,048,576 bytes).` : "";
    const notRef = d.items.filter((i) => i.used_in[0] === "Not referenced");
    const notRefBytes = notRef.reduce((s, i) => s + i.total_bytes, 0);
    const clean = d.items.filter((i) => i.suggestion === "Remove history" || i.suggestion === "Disable");
    const cleanBytes = clean.reduce((s, i) => s + i.total_bytes, 0);
    const h = this.history || [];
    const spanDays = h.length > 1 ? (h.at(-1).ts - h[0].ts) / 86400 : 0;
    const since = h.length ? new Date(h[0].ts * 1000).toLocaleDateString([], { dateStyle: "medium" }) : null;
    const whole = Math.floor(spanDays);
    const subtitle = !h.length ? "No data collected yet."
      : whole < 1 ? `Under 1 day of data since first collection on ${since}`
      : `${whole} day${whole === 1 ? "" : "s"} of data since first collection on ${since}`;
    // Only offer windows the data can fill, plus "All data".
    const periods = [7, 30, 90, 365].filter((n) => n <= spanDays);
    return html`
      <div class="kpis">
        <div class="kpi" title=${sizeTip}><span>Database size</span><b>${fmtBytes(cur?.file_bytes ?? d.total_bytes)}</b></div>
        <div class="kpi" title="Empty space inside the database file left behind by deleted data. Reclaim free space (the arrow beside Re-Scan) returns it to the disk."><span>Free inside database</span><b>${fmtBytes(cur?.free_bytes ?? null)}</b></div>
        <div class="kpi click" title="Entities with no literal reference in your config. Click to review them."
          @click=${() => this.dispatchEvent(new CustomEvent("goto-filter", { detail: { used_in: ["Not referenced"] } }))}>
          <span>Not referenced in config</span><b>${fmtBytes(notRefBytes)}</b><span>${notRef.length} entities</span></div>
        <div class="kpi click" title="Entities whose history is leftover (orphaned or disabled) or that look unused and stale. Click to review them."
          @click=${() => this.dispatchEvent(new CustomEvent("goto-filter", { detail: { suggestion: ["Remove history", "Disable"] } }))}>
          <span>Cleanup candidates</span><b>${fmtBytes(cleanBytes)}</b><span>${clean.length} entities</span></div>
      </div>
      <div class="grid">
        <div class="card tree"><h3>By integration and type</h3>
          <db-chart style="--h:420px" .rev=${d} .build=${this._treemap} @point=${this._treeClick}></db-chart></div>
        <div class="card"><h3>Largest entities</h3>
          <div class="key"><span><i style="background:var(--primary-color)"></i>Used in config</span><span><i style="background:var(--accent-color,#ff9800)"></i>Not referenced</span></div>
          <div class="toplist">${this._top(d)}</div></div>
        <div class="card"><h3>Database size over time
            <select @change=${(e) => this.dispatchEvent(new CustomEvent("days", { detail: +e.target.value }))}>
              <option value="0" ?selected=${!this.days || !periods.includes(this.days)}>All data</option>
              ${periods.map((n) => html`<option value=${n} ?selected=${this.days === n}>Last ${n} days</option>`)}</select>
            <span class="tip" tabindex="0"><span class="info">?</span><span class="pop"><div>${subtitle}</div>
              <div>Drag across the chart to drill into a period.</div>
              <div><i style="background:var(--ha-color-primary-20,#488fc2)"></i><b>Everything else</b><br>States, attributes, events and the rest of the data in the database.</div>
              <div><i style="background:var(--ha-color-border-primary-loud,${COLOR_STATS})"></i><b>Long-term statistics</b><br>Hourly and 5-minute statistics behind history graphs and Energy.</div>
              <div><i style="background:${COLOR_UNDO}"></i><b>Free Space/Undo Data</b><br>Empty space inside the database file left by deleted data (returned to the disk by a repack), plus the compressed backups that let actions be undone, which are kept beside the database.</div></span></span></h3>
          <div class="key"><span><i style="background:var(--ha-color-primary-20,#488fc2)"></i>Everything else</span><span><i style="background:var(--ha-color-border-primary-loud,${COLOR_STATS})"></i>Long-term statistics</span><span><i style="background:${COLOR_UNDO}"></i>Free Space/Undo Data</span></div>
          <db-chart style="--h:250px" brush .rev=${[this.history, this.days, this.window]} .build=${this._historyOpt}
            @range=${(e) => this.dispatchEvent(new CustomEvent("goto-window", { detail: e.detail }))}></db-chart></div>
      </div>`;
  }

  // Clicking a box filters Entities to that integration and type; clicking a title, to the integration.
  _top(d) {
    const rows = [...d.items].sort((a, b) => b.total_bytes - a.total_bytes).slice(0, 12);
    const max = Math.max(...rows.map((r) => r.total_bytes), 1);
    return rows.map((r) => {
      const none = r.used_in[0] === "Not referenced";
      return html`<div class="tl" title=${`${r.entity_id}\n${none ? "Not referenced in config" : r.used_count + " places"}`}
        @click=${() => this.dispatchEvent(new CustomEvent("goto-entity", { detail: r.entity_id }))}>
        <i class=${none ? "un" : ""} style="width:${Math.max(2, (r.total_bytes / max) * 100)}%"></i>
        <span class="ico">${entityIcon(this.hass, r.entity_id)}</span><span class="nm">${r.name || r.entity_id}</span><span class="sz">${fmtBytes(r.total_bytes)}</span></div>`;
    });
  }

  _treeClick = (e) => {
    const n = e.detail;
    if (!n) return;
    const filters = n.children ? { integration: [n.name] } : { integration: [n.integration], domain: [n.domain] };
    this.dispatchEvent(new CustomEvent("goto-filter", { detail: filters }));
  };
}
customElements.define("db-overview", DbOverview);
