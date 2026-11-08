import { LitElement, html, css } from "lit";
import { fmtMs } from "./util.js";

export class DbProgress extends LitElement {
  static properties = { status: { attribute: false }, first: { type: Boolean } };
  static styles = css`
    :host{display:block}
    .card{border:1px solid var(--primary-color);border-radius:12px;padding:12px 16px;margin-bottom:12px;background:var(--card-background-color)}
    h3{margin:0 0 2px;font-size:15px} .sub{font-size:12px;color:var(--secondary-text-color);margin-bottom:8px}
    .track{height:6px;border-radius:3px;background:var(--divider-color);overflow:hidden;margin:6px 0 10px}
    .fill{height:100%;background:var(--primary-color);transition:width .4s}
    .fill.run{background-image:linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent);background-size:60px 100%;animation:sh 1s linear infinite;background-color:var(--primary-color)}
    @keyframes sh{from{background-position:-60px 0}to{background-position:200px 0}}
    .st{display:grid;grid-template-columns:22px 1fr auto;gap:6px;font-size:13px;padding:2px 0;color:var(--secondary-text-color)}
    .st.done{color:var(--primary-text-color)} .st.running{color:var(--primary-text-color);font-weight:600}
    .spin{display:inline-block;width:11px;height:11px;border:2px solid var(--divider-color);border-top-color:var(--primary-color);border-radius:50%;animation:r .8s linear infinite}
    @keyframes r{to{transform:rotate(360deg)}}
    .err{color:var(--error-color,#c33);margin-top:6px}`;
  render() {
    const s = this.status;
    if (!s || !s.steps?.length) return html`<div class="card"><h3>Starting scan…</h3><div class="track"><div class="fill run" style="width:5%"></div></div></div>`;
    const done = s.steps.filter((x) => x.status === "done").length;
    const pct = Math.max(5, Math.round(((done + (s.steps.some((x) => x.status === "running") ? 0.5 : 0)) / s.steps.length) * 100));
    return html`<div class="card">
      <h3>${this.first ? "First scan, building the inventory" : "Refreshing"} · ${Math.round(s.elapsed_s)} s</h3>
      <div class="sub">${this.first ? "This only happens once; results are saved and reloaded instantly after a restart. " : "You can keep browsing the previous results. "}Step ${Math.min(done + 1, s.steps.length)} of ${s.steps.length}.</div>
      <div class="track"><div class="fill ${s.running ? "run" : ""}" style="width:${pct}%"></div></div>
      ${s.steps.map((x) => html`<div class="st ${x.status}"><span>${x.status === "done" ? "✓" : x.status === "running" ? html`<span class="spin"></span>` : "○"}</span><span>${x.label}</span><span>${fmtMs(x.ms)}</span></div>`)}
      ${s.error ? html`<div class="err">${s.error}</div>` : ""}</div>`;
  }
}
customElements.define("db-progress", DbProgress);
