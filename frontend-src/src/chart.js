import { LitElement, html, css } from "lit";
import * as echarts from "echarts/core";
import { BarChart, LineChart, TreemapChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent, DatasetComponent, BrushComponent, MarkAreaComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([BarChart, LineChart, TreemapChart, GridComponent, LegendComponent, TooltipComponent, DatasetComponent, BrushComponent, MarkAreaComponent, CanvasRenderer]);

// Thin ECharts wrapper. `option` is a function of theme colours so dark mode just works.
export class DbChart extends LitElement {
  static properties = { build: { attribute: false }, height: { type: Number }, brush: { type: Boolean }, rev: { attribute: false } };
  static styles = css`:host{display:block;position:relative;flex:1 1 auto;min-height:var(--h,240px)} div.c{position:absolute;inset:0}`;
  height = 260;
  render() { return html`<div class="c"></div>`; }
  firstUpdated() {
    this._chart = echarts.init(this.renderRoot.querySelector("div.c"));
    this._ro = new ResizeObserver(() => this._chart.resize());
    this._ro.observe(this);
    this._chart.on("click", (p) => this.dispatchEvent(new CustomEvent("point", { detail: p.data, bubbles: true, composed: true })));
    // Drag-select a time range (used by the size-over-time chart).
    this._chart.on("brushEnd", (p) => {
      const r = p.areas?.[0]?.coordRange;
      if (r) this.dispatchEvent(new CustomEvent("range", { detail: [Math.round(r[0] / 1000), Math.round(r[1] / 1000)], bubbles: true, composed: true }));
      // The page filter (and the shaded band from the window) now shows the period, so drop the drag rectangle.
      setTimeout(() => this._chart?.dispatchAction({ type: "brush", areas: [] }), 0);
    });
    this._apply();
  }
  // Re-render only when the chart's inputs changed. Home Assistant updates `hass` constantly, which
  // re-renders the panel; redrawing then would wipe a drag-selection in progress.
  updated() {
    const key = [this.build, ...(Array.isArray(this.rev) ? this.rev : [this.rev]), this.brush];
    if (this._key && key.length === this._key.length && key.every((v, i) => v === this._key[i])) return;
    this._key = key;
    this._apply();
  }
  disconnectedCallback() { super.disconnectedCallback(); this._ro?.disconnect(); this._chart?.dispose(); }
  _apply() {
    if (!this._chart || !this.build) return;
    const cs = getComputedStyle(this);
    const theme = {
      text: cs.getPropertyValue("--primary-text-color").trim() || "#444",
      muted: cs.getPropertyValue("--secondary-text-color").trim() || "#888",
      line: cs.getPropertyValue("--divider-color").trim() || "#ddd",
      primary: cs.getPropertyValue("--primary-color").trim() || "#03a9f4",
      accent: cs.getPropertyValue("--accent-color").trim() || "#ff9800",
    };
    const opt = this.build(theme);
    // One tooltip style for every chart: small, theme-coloured, kept inside the card.
    const card = cs.getPropertyValue("--card-background-color").trim() || "#fff";
    opt.tooltip = {
      confine: true, backgroundColor: card, borderColor: theme.line, borderWidth: 1, padding: [4, 8],
      textStyle: { color: theme.text, fontSize: 12, fontWeight: "normal" },
      extraCssText: "box-shadow:0 2px 8px rgba(0,0,0,.25);border-radius:8px;",
      ...opt.tooltip,
    };
    if (this.brush) {
      opt.brush = { xAxisIndex: 0, brushType: "lineX", brushMode: "single", throttleType: "debounce", throttleDelay: 100, removeOnClick: false,
        brushStyle: { color: theme.primary + "33", borderColor: theme.primary, borderWidth: 1 } };
    }
    this._chart.setOption(opt, true);
    if (this.brush) this._chart.dispatchAction({ type: "takeGlobalCursor", key: "brush", brushOption: { brushType: "lineX", brushMode: "single" } });
  }
}
customElements.define("db-chart", DbChart);
