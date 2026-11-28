var Qb = Object.defineProperty;
var Jb = (r, t, e) => t in r ? Qb(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var kt = (r, t, e) => Jb(r, typeof t != "symbol" ? t + "" : t, e);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Yo = globalThis, Mc = Yo.ShadowRoot && (Yo.ShadyCSS === void 0 || Yo.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Dc = Symbol(), Jf = /* @__PURE__ */ new WeakMap();
let zy = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Dc) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Mc && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = Jf.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Jf.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const t1 = (r) => new zy(typeof r == "string" ? r : r + "", void 0, Dc), Ir = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((i, n, a) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + r[a + 1], r[0]);
  return new zy(e, r, Dc);
}, e1 = (r, t) => {
  if (Mc) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), n = Yo.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = e.cssText, r.appendChild(i);
  }
}, td = Mc ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return t1(e);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: r1, defineProperty: i1, getOwnPropertyDescriptor: n1, getOwnPropertyNames: a1, getOwnPropertySymbols: o1, getPrototypeOf: s1 } = Object, xr = globalThis, ed = xr.trustedTypes, l1 = ed ? ed.emptyScript : "", wl = xr.reactiveElementPolyfillSupport, la = (r, t) => r, ih = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? l1 : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, Fy = (r, t) => !r1(r, t), rd = { attribute: !0, type: String, converter: ih, reflect: !1, useDefault: !1, hasChanged: Fy };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), xr.litPropertyMetadata ?? (xr.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let Ui = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = rd) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(t, i, e);
      n !== void 0 && i1(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: n, set: a } = n1(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: n, set(o) {
      const s = n == null ? void 0 : n.call(this);
      a == null || a.call(this, o), this.requestUpdate(t, s, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? rd;
  }
  static _$Ei() {
    if (this.hasOwnProperty(la("elementProperties"))) return;
    const t = s1(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(la("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(la("properties"))) {
      const e = this.properties, i = [...a1(e), ...o1(e)];
      for (const n of i) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, n] of e) this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const n = this._$Eu(e, i);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const n of i) e.unshift(td(n));
    } else t !== void 0 && e.push(td(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return e1(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var a;
    const i = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, i);
    if (n !== void 0 && i.reflect === !0) {
      const o = (((a = i.converter) == null ? void 0 : a.toAttribute) !== void 0 ? i.converter : ih).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var a, o;
    const i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const s = i.getPropertyOptions(n), l = typeof s.converter == "function" ? { fromAttribute: s.converter } : ((a = s.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? s.converter : ih;
      this._$Em = n;
      const u = l.fromAttribute(e, s.type);
      this[n] = u ?? ((o = this._$Ej) == null ? void 0 : o.get(n)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, n = !1, a) {
    var o;
    if (t !== void 0) {
      const s = this.constructor;
      if (n === !1 && (a = this[t]), i ?? (i = s.getPropertyOptions(t)), !((i.hasChanged ?? Fy)(a, e) || i.useDefault && i.reflect && a === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(s._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: n, wrapped: a }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), a !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [a, o] of this._$Ep) this[a] = o;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [a, o] of n) {
        const { wrapped: s } = o, l = this[a];
        s !== !0 || this._$AL.has(a) || l === void 0 || this.C(a, void 0, o, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((n) => {
        var a;
        return (a = n.hostUpdate) == null ? void 0 : a.call(n);
      }), this.update(e)) : this._$EM();
    } catch (n) {
      throw t = !1, this._$EM(), n;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var n;
      return (n = i.hostUpdated) == null ? void 0 : n.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
Ui.elementStyles = [], Ui.shadowRootOptions = { mode: "open" }, Ui[la("elementProperties")] = /* @__PURE__ */ new Map(), Ui[la("finalized")] = /* @__PURE__ */ new Map(), wl == null || wl({ ReactiveElement: Ui }), (xr.reactiveElementVersions ?? (xr.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ua = globalThis, id = (r) => r, ls = ua.trustedTypes, nd = ls ? ls.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, Hy = "$lit$", yr = `lit$${Math.random().toFixed(9).slice(2)}$`, Vy = "?" + yr, u1 = `<${Vy}>`, pi = document, Ta = () => pi.createComment(""), Ca = (r) => r === null || typeof r != "object" && typeof r != "function", kc = Array.isArray, h1 = (r) => kc(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", Sl = `[ 	
\f\r]`, An = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ad = /-->/g, od = />/g, Pr = RegExp(`>|${Sl}(?:([^\\s"'>=/]+)(${Sl}*=${Sl}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), sd = /'/g, ld = /"/g, Gy = /^(?:script|style|textarea|title)$/i, c1 = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), k = c1(1), sn = Symbol.for("lit-noChange"), G = Symbol.for("lit-nothing"), ud = /* @__PURE__ */ new WeakMap(), ii = pi.createTreeWalker(pi, 129);
function Wy(r, t) {
  if (!kc(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return nd !== void 0 ? nd.createHTML(t) : t;
}
const f1 = (r, t) => {
  const e = r.length - 1, i = [];
  let n, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = An;
  for (let s = 0; s < e; s++) {
    const l = r[s];
    let u, h, c = -1, f = 0;
    for (; f < l.length && (o.lastIndex = f, h = o.exec(l), h !== null); ) f = o.lastIndex, o === An ? h[1] === "!--" ? o = ad : h[1] !== void 0 ? o = od : h[2] !== void 0 ? (Gy.test(h[2]) && (n = RegExp("</" + h[2], "g")), o = Pr) : h[3] !== void 0 && (o = Pr) : o === Pr ? h[0] === ">" ? (o = n ?? An, c = -1) : h[1] === void 0 ? c = -2 : (c = o.lastIndex - h[2].length, u = h[1], o = h[3] === void 0 ? Pr : h[3] === '"' ? ld : sd) : o === ld || o === sd ? o = Pr : o === ad || o === od ? o = An : (o = Pr, n = void 0);
    const d = o === Pr && r[s + 1].startsWith("/>") ? " " : "";
    a += o === An ? l + u1 : c >= 0 ? (i.push(u), l.slice(0, c) + Hy + l.slice(c) + yr + d) : l + yr + (c === -2 ? s : d);
  }
  return [Wy(r, a + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Aa {
  constructor({ strings: t, _$litType$: e }, i) {
    let n;
    this.parts = [];
    let a = 0, o = 0;
    const s = t.length - 1, l = this.parts, [u, h] = f1(t, e);
    if (this.el = Aa.createElement(u, i), ii.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (n = ii.nextNode()) !== null && l.length < s; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const c of n.getAttributeNames()) if (c.endsWith(Hy)) {
          const f = h[o++], d = n.getAttribute(c).split(yr), v = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: a, name: v[2], strings: d, ctor: v[1] === "." ? v1 : v[1] === "?" ? p1 : v[1] === "@" ? g1 : Gs }), n.removeAttribute(c);
        } else c.startsWith(yr) && (l.push({ type: 6, index: a }), n.removeAttribute(c));
        if (Gy.test(n.tagName)) {
          const c = n.textContent.split(yr), f = c.length - 1;
          if (f > 0) {
            n.textContent = ls ? ls.emptyScript : "";
            for (let d = 0; d < f; d++) n.append(c[d], Ta()), ii.nextNode(), l.push({ type: 2, index: ++a });
            n.append(c[f], Ta());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Vy) l.push({ type: 2, index: a });
      else {
        let c = -1;
        for (; (c = n.data.indexOf(yr, c + 1)) !== -1; ) l.push({ type: 7, index: a }), c += yr.length - 1;
      }
      a++;
    }
  }
  static createElement(t, e) {
    const i = pi.createElement("template");
    return i.innerHTML = t, i;
  }
}
function ln(r, t, e = r, i) {
  var o, s;
  if (t === sn) return t;
  let n = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const a = Ca(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== a && ((s = n == null ? void 0 : n._$AO) == null || s.call(n, !1), a === void 0 ? n = void 0 : (n = new a(r), n._$AT(r, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = n : e._$Cl = n), n !== void 0 && (t = ln(r, n._$AS(r, t.values), n, i)), t;
}
class d1 {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? pi).importNode(e, !0);
    ii.currentNode = n;
    let a = ii.nextNode(), o = 0, s = 0, l = i[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let u;
        l.type === 2 ? u = new Ua(a, a.nextSibling, this, t) : l.type === 1 ? u = new l.ctor(a, l.name, l.strings, this, t) : l.type === 6 && (u = new y1(a, this, t)), this._$AV.push(u), l = i[++s];
      }
      o !== (l == null ? void 0 : l.index) && (a = ii.nextNode(), o++);
    }
    return ii.currentNode = pi, n;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class Ua {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, n) {
    this.type = 2, this._$AH = G, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = ln(this, t, e), Ca(t) ? t === G || t == null || t === "" ? (this._$AH !== G && this._$AR(), this._$AH = G) : t !== this._$AH && t !== sn && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : h1(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== G && Ca(this._$AH) ? this._$AA.nextSibling.data = t : this.T(pi.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var a;
    const { values: e, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Aa.createElement(Wy(i.h, i.h[0]), this.options)), i);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === n) this._$AH.p(e);
    else {
      const o = new d1(n, this), s = o.u(this.options);
      o.p(e), this.T(s), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = ud.get(t.strings);
    return e === void 0 && ud.set(t.strings, e = new Aa(t)), e;
  }
  k(t) {
    kc(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, n = 0;
    for (const a of t) n === e.length ? e.push(i = new Ua(this.O(Ta()), this.O(Ta()), this, this.options)) : i = e[n], i._$AI(a), n++;
    n < e.length && (this._$AR(i && i._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const n = id(t).nextSibling;
      id(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class Gs {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, n, a) {
    this.type = 1, this._$AH = G, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = G;
  }
  _$AI(t, e = this, i, n) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) t = ln(this, t, e, 0), o = !Ca(t) || t !== this._$AH && t !== sn, o && (this._$AH = t);
    else {
      const s = t;
      let l, u;
      for (t = a[0], l = 0; l < a.length - 1; l++) u = ln(this, s[i + l], e, l), u === sn && (u = this._$AH[l]), o || (o = !Ca(u) || u !== this._$AH[l]), u === G ? t = G : t !== G && (t += (u ?? "") + a[l + 1]), this._$AH[l] = u;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === G ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class v1 extends Gs {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === G ? void 0 : t;
  }
}
class p1 extends Gs {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== G);
  }
}
class g1 extends Gs {
  constructor(t, e, i, n, a) {
    super(t, e, i, n, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = ln(this, t, e, 0) ?? G) === sn) return;
    const i = this._$AH, n = t === G && i !== G || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== G && (i === G || n);
    n && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class y1 {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    ln(this, t);
  }
}
const Tl = ua.litHtmlPolyfillSupport;
Tl == null || Tl(Aa, Ua), (ua.litHtmlVersions ?? (ua.litHtmlVersions = [])).push("3.3.3");
const m1 = (r, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let n = i._$litPart$;
  if (n === void 0) {
    const a = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = n = new Ua(t.insertBefore(Ta(), a), a, void 0, e ?? {});
  }
  return n._$AI(r), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const li = globalThis;
class pe extends Ui {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = m1(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return sn;
  }
}
var By;
pe._$litElement$ = !0, pe.finalized = !0, (By = li.litElementHydrateSupport) == null || By.call(li, { LitElement: pe });
const Cl = li.litElementPolyfillSupport;
Cl == null || Cl({ LitElement: pe });
(li.litElementVersions ?? (li.litElementVersions = [])).push("4.2.2");
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var nh = function(r, t) {
  return nh = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e, i) {
    e.__proto__ = i;
  } || function(e, i) {
    for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && (e[n] = i[n]);
  }, nh(r, t);
};
function N(r, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
  nh(r, t);
  function e() {
    this.constructor = r;
  }
  r.prototype = t === null ? Object.create(t) : (e.prototype = t.prototype, new e());
}
var _1 = /* @__PURE__ */ function() {
  function r() {
    this.firefox = !1, this.ie = !1, this.edge = !1, this.newEdge = !1, this.weChat = !1;
  }
  return r;
}(), b1 = /* @__PURE__ */ function() {
  function r() {
    this.browser = new _1(), this.node = !1, this.wxa = !1, this.worker = !1, this.svgSupported = !1, this.touchEventsSupported = !1, this.pointerEventsSupported = !1, this.domSupported = !1, this.transformSupported = !1, this.transform3dSupported = !1, this.hasGlobalWindow = typeof window < "u";
  }
  return r;
}(), j = new b1();
typeof wx == "object" && typeof wx.getSystemInfoSync == "function" ? (j.wxa = !0, j.touchEventsSupported = !0) : typeof document > "u" && typeof self < "u" ? j.worker = !0 : !j.hasGlobalWindow || "Deno" in window ? (j.node = !0, j.svgSupported = !0) : x1(navigator.userAgent, j);
function x1(r, t) {
  var e = t.browser, i = r.match(/Firefox\/([\d.]+)/), n = r.match(/MSIE\s([\d.]+)/) || r.match(/Trident\/.+?rv:(([\d.]+))/), a = r.match(/Edge?\/([\d.]+)/), o = /micromessenger/i.test(r);
  i && (e.firefox = !0, e.version = i[1]), n && (e.ie = !0, e.version = n[1]), a && (e.edge = !0, e.version = a[1], e.newEdge = +a[1].split(".")[0] > 18), o && (e.weChat = !0), t.svgSupported = typeof SVGRect < "u", t.touchEventsSupported = "ontouchstart" in window && !e.ie && !e.edge, t.pointerEventsSupported = "onpointerdown" in window && (e.edge || e.ie && +e.version >= 11), t.domSupported = typeof document < "u";
  var s = document.documentElement.style;
  t.transform3dSupported = (e.ie && "transition" in s || e.edge || "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix() || "MozPerspective" in s) && !("OTransition" in s), t.transformSupported = t.transform3dSupported || e.ie && +e.version >= 9;
}
var Ic = 12, w1 = "sans-serif", gi = Ic + "px " + w1, S1 = 20, T1 = 100, C1 = "007LLmW'55;N0500LLLLLLLLLL00NNNLzWW\\\\WQb\\0FWLg\\bWb\\WQ\\WrWWQ000CL5LLFLL0LL**F*gLLLL5F0LF\\FFF5.5N";
function A1(r) {
  var t = {};
  if (typeof JSON > "u")
    return t;
  for (var e = 0; e < r.length; e++) {
    var i = String.fromCharCode(e + 32), n = (r.charCodeAt(e) - S1) / T1;
    t[i] = n;
  }
  return t;
}
var M1 = A1(C1), gn = {
  createCanvas: function() {
    return typeof document < "u" && document.createElement("canvas");
  },
  measureText: /* @__PURE__ */ function() {
    var r, t;
    return function(e, i) {
      if (!r) {
        var n = gn.createCanvas();
        r = n && n.getContext("2d");
      }
      if (r)
        return t !== i && (t = r.font = i || gi), r.measureText(e);
      e = e || "", i = i || gi;
      var a = /((?:\d+)?\.?\d*)px/.exec(i), o = a && +a[1] || Ic, s = 0;
      if (i.indexOf("mono") >= 0)
        s = o * e.length;
      else
        for (var l = 0; l < e.length; l++) {
          var u = M1[e[l]];
          s += u == null ? o : u * o;
        }
      return { width: s };
    };
  }(),
  loadImage: function(r, t, e) {
    var i = new Image();
    return i.onload = t, i.onerror = e, i.src = r, i;
  }
}, Uy = yn([
  "Function",
  "RegExp",
  "Date",
  "Error",
  "CanvasGradient",
  "CanvasPattern",
  "Image",
  "Canvas"
], function(r, t) {
  return r["[object " + t + "]"] = !0, r;
}, {}), Yy = yn([
  "Int8",
  "Uint8",
  "Uint8Clamped",
  "Int16",
  "Uint16",
  "Int32",
  "Uint32",
  "Float32",
  "Float64"
], function(r, t) {
  return r["[object " + t + "Array]"] = !0, r;
}, {}), Ya = Object.prototype.toString, Ws = Array.prototype, D1 = Ws.forEach, k1 = Ws.filter, Lc = Ws.slice, I1 = Ws.map, hd = (function() {
}).constructor, Ja = hd ? hd.prototype : null, Pc = "__proto__", L1 = 2311;
function Xy() {
  return L1++;
}
function Ec() {
  for (var r = [], t = 0; t < arguments.length; t++)
    r[t] = arguments[t];
  typeof console < "u" && console.error.apply(console, r);
}
function K(r) {
  if (r == null || typeof r != "object")
    return r;
  var t = r, e = Ya.call(r);
  if (e === "[object Array]") {
    if (!ha(r)) {
      t = [];
      for (var i = 0, n = r.length; i < n; i++)
        t[i] = K(r[i]);
    }
  } else if (Yy[e]) {
    if (!ha(r)) {
      var a = r.constructor;
      if (a.from)
        t = a.from(r);
      else {
        t = new a(r.length);
        for (var i = 0, n = r.length; i < n; i++)
          t[i] = r[i];
      }
    }
  } else if (!Uy[e] && !ha(r) && !Ma(r)) {
    t = {};
    for (var o in r)
      r.hasOwnProperty(o) && o !== Pc && (t[o] = K(r[o]));
  }
  return t;
}
function ut(r, t, e) {
  if (!U(t) || !U(r))
    return e ? K(t) : r;
  for (var i in t)
    if (t.hasOwnProperty(i) && i !== Pc) {
      var n = r[i], a = t[i];
      U(a) && U(n) && !B(a) && !B(n) && !Ma(a) && !Ma(n) && !cd(a) && !cd(n) && !ha(a) && !ha(n) ? ut(n, a, e) : (e || !(i in r)) && (r[i] = K(t[i]));
    }
  return r;
}
function P1(r, t) {
  for (var e = r[0], i = 1, n = r.length; i < n; i++)
    e = ut(e, r[i], t);
  return e;
}
function $(r, t) {
  if (Object.assign)
    Object.assign(r, t);
  else
    for (var e in t)
      t.hasOwnProperty(e) && e !== Pc && (r[e] = t[e]);
  return r;
}
function ht(r, t, e) {
  for (var i = xt(t), n = 0, a = i.length; n < a; n++) {
    var o = i[n];
    r[o] == null && (r[o] = t[o]);
  }
  return r;
}
function rt(r, t) {
  if (r) {
    if (r.indexOf)
      return r.indexOf(t);
    for (var e = 0, i = r.length; e < i; e++)
      if (r[e] === t)
        return e;
  }
  return -1;
}
function E1(r, t) {
  var e = r.prototype;
  function i() {
  }
  i.prototype = t.prototype, r.prototype = new i();
  for (var n in e)
    e.hasOwnProperty(n) && (r.prototype[n] = e[n]);
  r.prototype.constructor = r, r.superClass = t;
}
function Le(r, t, e) {
  if (r = "prototype" in r ? r.prototype : r, t = "prototype" in t ? t.prototype : t, Object.getOwnPropertyNames)
    for (var i = Object.getOwnPropertyNames(t), n = 0; n < i.length; n++) {
      var a = i[n];
      a !== "constructor" && r[a] == null && (r[a] = t[a]);
    }
  else
    ht(r, t);
}
function qt(r) {
  return !r || typeof r == "string" ? !1 : typeof r.length == "number";
}
function T(r, t, e) {
  if (r && t)
    if (r.forEach && r.forEach === D1)
      r.forEach(t, e);
    else if (r.length === +r.length)
      for (var i = 0, n = r.length; i < n; i++)
        t.call(e, r[i], i, r);
    else
      for (var a in r)
        r.hasOwnProperty(a) && t.call(e, r[a], a, r);
}
function H(r, t, e) {
  if (!r)
    return [];
  if (!t)
    return Rc(r);
  if (r.map && r.map === I1)
    return r.map(t, e);
  for (var i = [], n = 0, a = r.length; n < a; n++)
    i.push(t.call(e, r[n], n, r));
  return i;
}
function yn(r, t, e, i) {
  if (r && t) {
    for (var n = 0, a = r.length; n < a; n++)
      e = t.call(i, e, r[n], n, r);
    return e;
  }
}
function Pt(r, t, e) {
  if (!r)
    return [];
  if (!t)
    return Rc(r);
  if (r.filter && r.filter === k1)
    return r.filter(t, e);
  for (var i = [], n = 0, a = r.length; n < a; n++)
    t.call(e, r[n], n, r) && i.push(r[n]);
  return i;
}
function xt(r) {
  if (!r)
    return [];
  if (Object.keys)
    return Object.keys(r);
  var t = [];
  for (var e in r)
    r.hasOwnProperty(e) && t.push(e);
  return t;
}
function R1(r, t) {
  for (var e = [], i = 2; i < arguments.length; i++)
    e[i - 2] = arguments[i];
  return function() {
    return r.apply(t, e.concat(Lc.call(arguments)));
  };
}
var at = Ja && Q(Ja.bind) ? Ja.call.bind(Ja.bind) : R1;
function et(r) {
  for (var t = [], e = 1; e < arguments.length; e++)
    t[e - 1] = arguments[e];
  return function() {
    return r.apply(this, t.concat(Lc.call(arguments)));
  };
}
function B(r) {
  return Array.isArray ? Array.isArray(r) : Ya.call(r) === "[object Array]";
}
function Q(r) {
  return typeof r == "function";
}
function V(r) {
  return typeof r == "string";
}
function ah(r) {
  return Ya.call(r) === "[object String]";
}
function wt(r) {
  return typeof r == "number";
}
function U(r) {
  var t = typeof r;
  return t === "function" || !!r && t === "object";
}
function cd(r) {
  return !!Uy[Ya.call(r)];
}
function Kt(r) {
  return !!Yy[Ya.call(r)];
}
function Ma(r) {
  return typeof r == "object" && typeof r.nodeType == "number" && typeof r.ownerDocument == "object";
}
function Us(r) {
  return r.colorStops != null;
}
function $1(r) {
  return r.image != null;
}
function us(r) {
  return r !== r;
}
function Be() {
  for (var r = [], t = 0; t < arguments.length; t++)
    r[t] = arguments[t];
  for (var e = 0, i = r.length; e < i; e++)
    if (r[e] != null)
      return r[e];
}
function st(r, t) {
  return r ?? t;
}
function Xo(r, t, e) {
  return r ?? t ?? e;
}
function Rc(r) {
  for (var t = [], e = 1; e < arguments.length; e++)
    t[e - 1] = arguments[e];
  return Lc.apply(r, t);
}
function $c(r) {
  if (typeof r == "number")
    return [r, r, r, r];
  var t = r.length;
  return t === 2 ? [r[0], r[1], r[0], r[1]] : t === 3 ? [r[0], r[1], r[2], r[1]] : r;
}
function ke(r, t) {
  if (!r)
    throw new Error(t);
}
function ze(r) {
  return r == null ? null : typeof r.trim == "function" ? r.trim() : r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}
var Zy = "__ec_primitive__";
function hs(r) {
  r[Zy] = !0;
}
function ha(r) {
  return r[Zy];
}
var O1 = function() {
  function r() {
    this.data = {};
  }
  return r.prototype.delete = function(t) {
    var e = this.has(t);
    return e && delete this.data[t], e;
  }, r.prototype.has = function(t) {
    return this.data.hasOwnProperty(t);
  }, r.prototype.get = function(t) {
    return this.data[t];
  }, r.prototype.set = function(t, e) {
    return this.data[t] = e, this;
  }, r.prototype.keys = function() {
    return xt(this.data);
  }, r.prototype.forEach = function(t) {
    var e = this.data;
    for (var i in e)
      e.hasOwnProperty(i) && t(e[i], i);
  }, r;
}(), qy = typeof Map == "function";
function N1() {
  return qy ? /* @__PURE__ */ new Map() : new O1();
}
var B1 = function() {
  function r(t) {
    var e = B(t);
    this.data = N1();
    var i = this;
    t instanceof r ? t.each(n) : t && T(t, n);
    function n(a, o) {
      e ? i.set(a, o) : i.set(o, a);
    }
  }
  return r.prototype.hasKey = function(t) {
    return this.data.has(t);
  }, r.prototype.get = function(t) {
    return this.data.get(t);
  }, r.prototype.set = function(t, e) {
    return this.data.set(t, e), e;
  }, r.prototype.each = function(t, e) {
    this.data.forEach(function(i, n) {
      t.call(e, i, n);
    });
  }, r.prototype.keys = function() {
    var t = this.data.keys();
    return qy ? Array.from(t) : t;
  }, r.prototype.removeKey = function(t) {
    this.data.delete(t);
  }, r;
}();
function tt(r) {
  return new B1(r);
}
function z1(r, t) {
  for (var e = new r.constructor(r.length + t.length), i = 0; i < r.length; i++)
    e[i] = r[i];
  for (var n = r.length, i = 0; i < t.length; i++)
    e[i + n] = t[i];
  return e;
}
function Ys(r, t) {
  var e;
  if (Object.create)
    e = Object.create(r);
  else {
    var i = function() {
    };
    i.prototype = r, e = new i();
  }
  return t && $(e, t), e;
}
function Ky(r) {
  var t = r.style;
  t.webkitUserSelect = "none", t.userSelect = "none", t.webkitTapHighlightColor = "rgba(0,0,0,0)", t["-webkit-touch-callout"] = "none";
}
function yi(r, t) {
  return r.hasOwnProperty(t);
}
function Et() {
}
var F1 = 180 / Math.PI;
function mn(r, t) {
  return r == null && (r = 0), t == null && (t = 0), [r, t];
}
function H1(r) {
  return [r[0], r[1]];
}
function fd(r, t, e) {
  return r[0] = t[0] + e[0], r[1] = t[1] + e[1], r;
}
function V1(r, t, e) {
  return r[0] = t[0] - e[0], r[1] = t[1] - e[1], r;
}
function G1(r) {
  return Math.sqrt(W1(r));
}
function W1(r) {
  return r[0] * r[0] + r[1] * r[1];
}
function Al(r, t, e) {
  return r[0] = t[0] * e, r[1] = t[1] * e, r;
}
function U1(r, t) {
  var e = G1(t);
  return e === 0 ? (r[0] = 0, r[1] = 0) : (r[0] = t[0] / e, r[1] = t[1] / e), r;
}
function oh(r, t) {
  return Math.sqrt((r[0] - t[0]) * (r[0] - t[0]) + (r[1] - t[1]) * (r[1] - t[1]));
}
var Y1 = oh;
function X1(r, t) {
  return (r[0] - t[0]) * (r[0] - t[0]) + (r[1] - t[1]) * (r[1] - t[1]);
}
var Ji = X1;
function ge(r, t, e) {
  var i = t[0], n = t[1];
  return r[0] = e[0] * i + e[2] * n + e[4], r[1] = e[1] * i + e[3] * n + e[5], r;
}
function Zi(r, t, e) {
  return r[0] = Math.min(t[0], e[0]), r[1] = Math.min(t[1], e[1]), r;
}
function qi(r, t, e) {
  return r[0] = Math.max(t[0], e[0]), r[1] = Math.max(t[1], e[1]), r;
}
var ki = /* @__PURE__ */ function() {
  function r(t, e) {
    this.target = t, this.topTarget = e && e.topTarget;
  }
  return r;
}(), Z1 = function() {
  function r(t) {
    this.handler = t, t.on("mousedown", this._dragStart, this), t.on("mousemove", this._drag, this), t.on("mouseup", this._dragEnd, this);
  }
  return r.prototype._dragStart = function(t) {
    for (var e = t.target; e && !e.draggable; )
      e = e.parent || e.__hostTarget;
    e && (this._draggingTarget = e, e.dragging = !0, this._x = t.offsetX, this._y = t.offsetY, this.handler.dispatchToElement(new ki(e, t), "dragstart", t.event));
  }, r.prototype._drag = function(t) {
    var e = this._draggingTarget;
    if (e) {
      var i = t.offsetX, n = t.offsetY, a = i - this._x, o = n - this._y;
      this._x = i, this._y = n, e.drift(a, o, t), this.handler.dispatchToElement(new ki(e, t), "drag", t.event);
      var s = this.handler.findHover(i, n, e).target, l = this._dropTarget;
      this._dropTarget = s, e !== s && (l && s !== l && this.handler.dispatchToElement(new ki(l, t), "dragleave", t.event), s && s !== l && this.handler.dispatchToElement(new ki(s, t), "dragenter", t.event));
    }
  }, r.prototype._dragEnd = function(t) {
    var e = this._draggingTarget;
    e && (e.dragging = !1), this.handler.dispatchToElement(new ki(e, t), "dragend", t.event), this._dropTarget && this.handler.dispatchToElement(new ki(this._dropTarget, t), "drop", t.event), this._draggingTarget = null, this._dropTarget = null;
  }, r;
}(), be = function() {
  function r(t) {
    t && (this._$eventProcessor = t);
  }
  return r.prototype.on = function(t, e, i, n) {
    this._$handlers || (this._$handlers = {});
    var a = this._$handlers;
    if (typeof e == "function" && (n = i, i = e, e = null), !i || !t)
      return this;
    var o = this._$eventProcessor;
    e != null && o && o.normalizeQuery && (e = o.normalizeQuery(e)), a[t] || (a[t] = []);
    for (var s = 0; s < a[t].length; s++)
      if (a[t][s].h === i)
        return this;
    var l = {
      h: i,
      query: e,
      ctx: n || this,
      callAtLast: i.zrEventfulCallAtLast
    }, u = a[t].length - 1, h = a[t][u];
    return h && h.callAtLast ? a[t].splice(u, 0, l) : a[t].push(l), this;
  }, r.prototype.isSilent = function(t) {
    var e = this._$handlers;
    return !e || !e[t] || !e[t].length;
  }, r.prototype.off = function(t, e) {
    var i = this._$handlers;
    if (!i)
      return this;
    if (!t)
      return this._$handlers = {}, this;
    if (e) {
      if (i[t]) {
        for (var n = [], a = 0, o = i[t].length; a < o; a++)
          i[t][a].h !== e && n.push(i[t][a]);
        i[t] = n;
      }
      i[t] && i[t].length === 0 && delete i[t];
    } else
      delete i[t];
    return this;
  }, r.prototype.trigger = function(t) {
    for (var e = [], i = 1; i < arguments.length; i++)
      e[i - 1] = arguments[i];
    if (!this._$handlers)
      return this;
    var n = this._$handlers[t], a = this._$eventProcessor;
    if (n)
      for (var o = e.length, s = n.length, l = 0; l < s; l++) {
        var u = n[l];
        if (!(a && a.filter && u.query != null && !a.filter(t, u.query)))
          switch (o) {
            case 0:
              u.h.call(u.ctx);
              break;
            case 1:
              u.h.call(u.ctx, e[0]);
              break;
            case 2:
              u.h.call(u.ctx, e[0], e[1]);
              break;
            default:
              u.h.apply(u.ctx, e);
              break;
          }
      }
    return a && a.afterTrigger && a.afterTrigger(t), this;
  }, r.prototype.triggerWithContext = function(t) {
    for (var e = [], i = 1; i < arguments.length; i++)
      e[i - 1] = arguments[i];
    if (!this._$handlers)
      return this;
    var n = this._$handlers[t], a = this._$eventProcessor;
    if (n)
      for (var o = e.length, s = e[o - 1], l = n.length, u = 0; u < l; u++) {
        var h = n[u];
        if (!(a && a.filter && h.query != null && !a.filter(t, h.query)))
          switch (o) {
            case 0:
              h.h.call(s);
              break;
            case 1:
              h.h.call(s, e[0]);
              break;
            case 2:
              h.h.call(s, e[0], e[1]);
              break;
            default:
              h.h.apply(s, e.slice(1, o - 1));
              break;
          }
      }
    return a && a.afterTrigger && a.afterTrigger(t), this;
  }, r;
}(), q1 = Math.log(2);
function sh(r, t, e, i, n, a) {
  var o = i + "-" + n, s = r.length;
  if (a.hasOwnProperty(o))
    return a[o];
  if (t === 1) {
    var l = Math.round(Math.log((1 << s) - 1 & ~n) / q1);
    return r[e][l];
  }
  for (var u = i | 1 << e, h = e + 1; i & 1 << h; )
    h++;
  for (var c = 0, f = 0, d = 0; f < s; f++) {
    var v = 1 << f;
    v & n || (c += (d % 2 ? -1 : 1) * r[e][f] * sh(r, t - 1, h, u, n | v, a), d++);
  }
  return a[o] = c, c;
}
function dd(r, t) {
  var e = [
    [r[0], r[1], 1, 0, 0, 0, -t[0] * r[0], -t[0] * r[1]],
    [0, 0, 0, r[0], r[1], 1, -t[1] * r[0], -t[1] * r[1]],
    [r[2], r[3], 1, 0, 0, 0, -t[2] * r[2], -t[2] * r[3]],
    [0, 0, 0, r[2], r[3], 1, -t[3] * r[2], -t[3] * r[3]],
    [r[4], r[5], 1, 0, 0, 0, -t[4] * r[4], -t[4] * r[5]],
    [0, 0, 0, r[4], r[5], 1, -t[5] * r[4], -t[5] * r[5]],
    [r[6], r[7], 1, 0, 0, 0, -t[6] * r[6], -t[6] * r[7]],
    [0, 0, 0, r[6], r[7], 1, -t[7] * r[6], -t[7] * r[7]]
  ], i = {}, n = sh(e, 8, 0, 0, 0, i);
  if (n !== 0) {
    for (var a = [], o = 0; o < 8; o++)
      for (var s = 0; s < 8; s++)
        a[s] == null && (a[s] = 0), a[s] += ((o + s) % 2 ? -1 : 1) * sh(e, 7, o === 0 ? 1 : 0, 1 << o, 1 << s, i) / n * t[o];
    return function(l, u, h) {
      var c = u * a[6] + h * a[7] + 1;
      l[0] = (u * a[0] + h * a[1] + a[2]) / c, l[1] = (u * a[3] + h * a[4] + a[5]) / c;
    };
  }
}
var vd = "___zrEVENTSAVED", Ml = [];
function K1(r, t, e, i, n) {
  return lh(Ml, t, i, n, !0) && lh(r, e, Ml[0], Ml[1]);
}
function lh(r, t, e, i, n) {
  if (t.getBoundingClientRect && j.domSupported && !jy(t)) {
    var a = t[vd] || (t[vd] = {}), o = j1(t, a), s = Q1(o, a, n);
    if (s)
      return s(r, e, i), !0;
  }
  return !1;
}
function j1(r, t) {
  var e = t.markers;
  if (e)
    return e;
  e = t.markers = [];
  for (var i = ["left", "right"], n = ["top", "bottom"], a = 0; a < 4; a++) {
    var o = document.createElement("div"), s = o.style, l = a % 2, u = (a >> 1) % 2;
    s.cssText = [
      "position: absolute",
      "visibility: hidden",
      "padding: 0",
      "margin: 0",
      "border-width: 0",
      "user-select: none",
      "width:0",
      "height:0",
      i[l] + ":0",
      n[u] + ":0",
      i[1 - l] + ":auto",
      n[1 - u] + ":auto",
      ""
    ].join("!important;"), r.appendChild(o), e.push(o);
  }
  return e;
}
function Q1(r, t, e) {
  for (var i = e ? "invTrans" : "trans", n = t[i], a = t.srcCoords, o = [], s = [], l = !0, u = 0; u < 4; u++) {
    var h = r[u].getBoundingClientRect(), c = 2 * u, f = h.left, d = h.top;
    o.push(f, d), l = l && a && f === a[c] && d === a[c + 1], s.push(r[u].offsetLeft, r[u].offsetTop);
  }
  return l && n ? n : (t.srcCoords = o, t[i] = e ? dd(s, o) : dd(o, s));
}
function jy(r) {
  return r.nodeName.toUpperCase() === "CANVAS";
}
var J1 = /([&<>"'])/g, tx = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function Ut(r) {
  return r == null ? "" : (r + "").replace(J1, function(t, e) {
    return tx[e];
  });
}
var ex = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, Dl = [], rx = j.browser.firefox && +j.browser.version.split(".")[0] < 39;
function uh(r, t, e, i) {
  return e = e || {}, i ? pd(r, t, e) : rx && t.layerX != null && t.layerX !== t.offsetX ? (e.zrX = t.layerX, e.zrY = t.layerY) : t.offsetX != null ? (e.zrX = t.offsetX, e.zrY = t.offsetY) : pd(r, t, e), e;
}
function pd(r, t, e) {
  if (j.domSupported && r.getBoundingClientRect) {
    var i = t.clientX, n = t.clientY;
    if (jy(r)) {
      var a = r.getBoundingClientRect();
      e.zrX = i - a.left, e.zrY = n - a.top;
      return;
    } else if (lh(Dl, r, i, n)) {
      e.zrX = Dl[0], e.zrY = Dl[1];
      return;
    }
  }
  e.zrX = e.zrY = 0;
}
function Oc(r) {
  return r || window.event;
}
function le(r, t, e) {
  if (t = Oc(t), t.zrX != null)
    return t;
  var i = t.type, n = i && i.indexOf("touch") >= 0;
  if (n) {
    var o = i !== "touchend" ? t.targetTouches[0] : t.changedTouches[0];
    o && uh(r, o, t, e);
  } else {
    uh(r, t, t, e);
    var a = ix(t);
    t.zrDelta = a ? a / 120 : -(t.detail || 0) / 3;
  }
  var s = t.button;
  return t.which == null && s !== void 0 && ex.test(t.type) && (t.which = s & 1 ? 1 : s & 2 ? 3 : s & 4 ? 2 : 0), t;
}
function ix(r) {
  var t = r.wheelDelta;
  if (t)
    return t;
  var e = r.deltaX, i = r.deltaY;
  if (e == null || i == null)
    return t;
  var n = Math.abs(i !== 0 ? i : e), a = i > 0 ? -1 : i < 0 ? 1 : e > 0 ? -1 : 1;
  return 3 * n * a;
}
function nx(r, t, e, i) {
  r.addEventListener(t, e, i);
}
function ax(r, t, e, i) {
  r.removeEventListener(t, e, i);
}
var Xs = function(r) {
  r.preventDefault(), r.stopPropagation(), r.cancelBubble = !0;
};
function gd(r) {
  return r.which === 2 || r.which === 3;
}
var ox = function() {
  function r() {
    this._track = [];
  }
  return r.prototype.recognize = function(t, e, i) {
    return this._doTrack(t, e, i), this._recognize(t);
  }, r.prototype.clear = function() {
    return this._track.length = 0, this;
  }, r.prototype._doTrack = function(t, e, i) {
    var n = t.touches;
    if (n) {
      for (var a = {
        points: [],
        touches: [],
        target: e,
        event: t
      }, o = 0, s = n.length; o < s; o++) {
        var l = n[o], u = uh(i, l, {});
        a.points.push([u.zrX, u.zrY]), a.touches.push(l);
      }
      this._track.push(a);
    }
  }, r.prototype._recognize = function(t) {
    for (var e in kl)
      if (kl.hasOwnProperty(e)) {
        var i = kl[e](this._track, t);
        if (i)
          return i;
      }
  }, r;
}();
function yd(r) {
  var t = r[1][0] - r[0][0], e = r[1][1] - r[0][1];
  return Math.sqrt(t * t + e * e);
}
function sx(r) {
  return [
    (r[0][0] + r[1][0]) / 2,
    (r[0][1] + r[1][1]) / 2
  ];
}
var kl = {
  pinch: function(r, t) {
    var e = r.length;
    if (e) {
      var i = (r[e - 1] || {}).points, n = (r[e - 2] || {}).points || i;
      if (n && n.length > 1 && i && i.length > 1) {
        var a = yd(i) / yd(n);
        !isFinite(a) && (a = 1), t.pinchScale = a;
        var o = sx(i);
        return t.pinchX = o[0], t.pinchY = o[1], {
          type: "pinch",
          target: r[0].target,
          event: t
        };
      }
    }
  }
};
function ui() {
  return [1, 0, 0, 1, 0, 0];
}
function Nc(r) {
  return r[0] = 1, r[1] = 0, r[2] = 0, r[3] = 1, r[4] = 0, r[5] = 0, r;
}
function lx(r, t) {
  return r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = t[3], r[4] = t[4], r[5] = t[5], r;
}
function tn(r, t, e) {
  var i = t[0] * e[0] + t[2] * e[1], n = t[1] * e[0] + t[3] * e[1], a = t[0] * e[2] + t[2] * e[3], o = t[1] * e[2] + t[3] * e[3], s = t[0] * e[4] + t[2] * e[5] + t[4], l = t[1] * e[4] + t[3] * e[5] + t[5];
  return r[0] = i, r[1] = n, r[2] = a, r[3] = o, r[4] = s, r[5] = l, r;
}
function Da(r, t, e) {
  return r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = t[3], r[4] = t[4] + e[0], r[5] = t[5] + e[1], r;
}
function Bc(r, t, e, i) {
  i === void 0 && (i = [0, 0]);
  var n = t[0], a = t[2], o = t[4], s = t[1], l = t[3], u = t[5], h = Math.sin(e), c = Math.cos(e);
  return r[0] = n * c + s * h, r[1] = -n * h + s * c, r[2] = a * c + l * h, r[3] = -a * h + c * l, r[4] = c * (o - i[0]) + h * (u - i[1]) + i[0], r[5] = c * (u - i[1]) - h * (o - i[0]) + i[1], r;
}
function Qy(r, t, e) {
  var i = e[0], n = e[1];
  return r[0] = t[0] * i, r[1] = t[1] * n, r[2] = t[2] * i, r[3] = t[3] * n, r[4] = t[4] * i, r[5] = t[5] * n, r;
}
function zc(r, t) {
  var e = t[0], i = t[2], n = t[4], a = t[1], o = t[3], s = t[5], l = e * o - a * i;
  return l ? (l = 1 / l, r[0] = o * l, r[1] = -a * l, r[2] = -i * l, r[3] = e * l, r[4] = (i * s - o * n) * l, r[5] = (a * n - e * s) * l, r) : null;
}
var mt = function() {
  function r(t, e) {
    this.x = t || 0, this.y = e || 0;
  }
  return r.prototype.copy = function(t) {
    return this.x = t.x, this.y = t.y, this;
  }, r.prototype.clone = function() {
    return new r(this.x, this.y);
  }, r.prototype.set = function(t, e) {
    return this.x = t, this.y = e, this;
  }, r.prototype.equal = function(t) {
    return t.x === this.x && t.y === this.y;
  }, r.prototype.add = function(t) {
    return this.x += t.x, this.y += t.y, this;
  }, r.prototype.scale = function(t) {
    this.x *= t, this.y *= t;
  }, r.prototype.scaleAndAdd = function(t, e) {
    this.x += t.x * e, this.y += t.y * e;
  }, r.prototype.sub = function(t) {
    return this.x -= t.x, this.y -= t.y, this;
  }, r.prototype.dot = function(t) {
    return this.x * t.x + this.y * t.y;
  }, r.prototype.len = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }, r.prototype.lenSquare = function() {
    return this.x * this.x + this.y * this.y;
  }, r.prototype.normalize = function() {
    var t = this.len();
    return this.x /= t, this.y /= t, this;
  }, r.prototype.distance = function(t) {
    var e = this.x - t.x, i = this.y - t.y;
    return Math.sqrt(e * e + i * i);
  }, r.prototype.distanceSquare = function(t) {
    var e = this.x - t.x, i = this.y - t.y;
    return e * e + i * i;
  }, r.prototype.negate = function() {
    return this.x = -this.x, this.y = -this.y, this;
  }, r.prototype.transform = function(t) {
    if (t) {
      var e = this.x, i = this.y;
      return this.x = t[0] * e + t[2] * i + t[4], this.y = t[1] * e + t[3] * i + t[5], this;
    }
  }, r.prototype.toArray = function(t) {
    return t[0] = this.x, t[1] = this.y, t;
  }, r.prototype.fromArray = function(t) {
    this.x = t[0], this.y = t[1];
  }, r.set = function(t, e, i) {
    t.x = e, t.y = i;
  }, r.copy = function(t, e) {
    t.x = e.x, t.y = e.y;
  }, r.len = function(t) {
    return Math.sqrt(t.x * t.x + t.y * t.y);
  }, r.lenSquare = function(t) {
    return t.x * t.x + t.y * t.y;
  }, r.dot = function(t, e) {
    return t.x * e.x + t.y * e.y;
  }, r.add = function(t, e, i) {
    t.x = e.x + i.x, t.y = e.y + i.y;
  }, r.sub = function(t, e, i) {
    t.x = e.x - i.x, t.y = e.y - i.y;
  }, r.scale = function(t, e, i) {
    t.x = e.x * i, t.y = e.y * i;
  }, r.scaleAndAdd = function(t, e, i, n) {
    t.x = e.x + i.x * n, t.y = e.y + i.y * n;
  }, r.lerp = function(t, e, i, n) {
    var a = 1 - n;
    t.x = a * e.x + n * i.x, t.y = a * e.y + n * i.y;
  }, r;
}(), to = Math.min, eo = Math.max, Er = new mt(), Rr = new mt(), $r = new mt(), Or = new mt(), Mn = new mt(), Dn = new mt(), ot = function() {
  function r(t, e, i, n) {
    i < 0 && (t = t + i, i = -i), n < 0 && (e = e + n, n = -n), this.x = t, this.y = e, this.width = i, this.height = n;
  }
  return r.prototype.union = function(t) {
    var e = to(t.x, this.x), i = to(t.y, this.y);
    isFinite(this.x) && isFinite(this.width) ? this.width = eo(t.x + t.width, this.x + this.width) - e : this.width = t.width, isFinite(this.y) && isFinite(this.height) ? this.height = eo(t.y + t.height, this.y + this.height) - i : this.height = t.height, this.x = e, this.y = i;
  }, r.prototype.applyTransform = function(t) {
    r.applyTransform(this, this, t);
  }, r.prototype.calculateTransform = function(t) {
    var e = this, i = t.width / e.width, n = t.height / e.height, a = ui();
    return Da(a, a, [-e.x, -e.y]), Qy(a, a, [i, n]), Da(a, a, [t.x, t.y]), a;
  }, r.prototype.intersect = function(t, e) {
    if (!t)
      return !1;
    t instanceof r || (t = r.create(t));
    var i = this, n = i.x, a = i.x + i.width, o = i.y, s = i.y + i.height, l = t.x, u = t.x + t.width, h = t.y, c = t.y + t.height, f = !(a < l || u < n || s < h || c < o);
    if (e) {
      var d = 1 / 0, v = 0, g = Math.abs(a - l), p = Math.abs(u - n), y = Math.abs(s - h), m = Math.abs(c - o), _ = Math.min(g, p), b = Math.min(y, m);
      a < l || u < n ? _ > v && (v = _, g < p ? mt.set(Dn, -g, 0) : mt.set(Dn, p, 0)) : _ < d && (d = _, g < p ? mt.set(Mn, g, 0) : mt.set(Mn, -p, 0)), s < h || c < o ? b > v && (v = b, y < m ? mt.set(Dn, 0, -y) : mt.set(Dn, 0, m)) : _ < d && (d = _, y < m ? mt.set(Mn, 0, y) : mt.set(Mn, 0, -m));
    }
    return e && mt.copy(e, f ? Mn : Dn), f;
  }, r.prototype.contain = function(t, e) {
    var i = this;
    return t >= i.x && t <= i.x + i.width && e >= i.y && e <= i.y + i.height;
  }, r.prototype.clone = function() {
    return new r(this.x, this.y, this.width, this.height);
  }, r.prototype.copy = function(t) {
    r.copy(this, t);
  }, r.prototype.plain = function() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }, r.prototype.isFinite = function() {
    return isFinite(this.x) && isFinite(this.y) && isFinite(this.width) && isFinite(this.height);
  }, r.prototype.isZero = function() {
    return this.width === 0 || this.height === 0;
  }, r.create = function(t) {
    return new r(t.x, t.y, t.width, t.height);
  }, r.copy = function(t, e) {
    t.x = e.x, t.y = e.y, t.width = e.width, t.height = e.height;
  }, r.applyTransform = function(t, e, i) {
    if (!i) {
      t !== e && r.copy(t, e);
      return;
    }
    if (i[1] < 1e-5 && i[1] > -1e-5 && i[2] < 1e-5 && i[2] > -1e-5) {
      var n = i[0], a = i[3], o = i[4], s = i[5];
      t.x = e.x * n + o, t.y = e.y * a + s, t.width = e.width * n, t.height = e.height * a, t.width < 0 && (t.x += t.width, t.width = -t.width), t.height < 0 && (t.y += t.height, t.height = -t.height);
      return;
    }
    Er.x = $r.x = e.x, Er.y = Or.y = e.y, Rr.x = Or.x = e.x + e.width, Rr.y = $r.y = e.y + e.height, Er.transform(i), Or.transform(i), Rr.transform(i), $r.transform(i), t.x = to(Er.x, Rr.x, $r.x, Or.x), t.y = to(Er.y, Rr.y, $r.y, Or.y);
    var l = eo(Er.x, Rr.x, $r.x, Or.x), u = eo(Er.y, Rr.y, $r.y, Or.y);
    t.width = l - t.x, t.height = u - t.y;
  }, r;
}(), Jy = "silent";
function ux(r, t, e) {
  return {
    type: r,
    event: e,
    target: t.target,
    topTarget: t.topTarget,
    cancelBubble: !1,
    offsetX: e.zrX,
    offsetY: e.zrY,
    gestureEvent: e.gestureEvent,
    pinchX: e.pinchX,
    pinchY: e.pinchY,
    pinchScale: e.pinchScale,
    wheelDelta: e.zrDelta,
    zrByTouch: e.zrByTouch,
    which: e.which,
    stop: hx
  };
}
function hx() {
  Xs(this.event);
}
var cx = function(r) {
  N(t, r);
  function t() {
    var e = r !== null && r.apply(this, arguments) || this;
    return e.handler = null, e;
  }
  return t.prototype.dispose = function() {
  }, t.prototype.setCursor = function() {
  }, t;
}(be), kn = /* @__PURE__ */ function() {
  function r(t, e) {
    this.x = t, this.y = e;
  }
  return r;
}(), fx = [
  "click",
  "dblclick",
  "mousewheel",
  "mouseout",
  "mouseup",
  "mousedown",
  "mousemove",
  "contextmenu"
], Il = new ot(0, 0, 0, 0), tm = function(r) {
  N(t, r);
  function t(e, i, n, a, o) {
    var s = r.call(this) || this;
    return s._hovered = new kn(0, 0), s.storage = e, s.painter = i, s.painterRoot = a, s._pointerSize = o, n = n || new cx(), s.proxy = null, s.setHandlerProxy(n), s._draggingMgr = new Z1(s), s;
  }
  return t.prototype.setHandlerProxy = function(e) {
    this.proxy && this.proxy.dispose(), e && (T(fx, function(i) {
      e.on && e.on(i, this[i], this);
    }, this), e.handler = this), this.proxy = e;
  }, t.prototype.mousemove = function(e) {
    var i = e.zrX, n = e.zrY, a = em(this, i, n), o = this._hovered, s = o.target;
    s && !s.__zr && (o = this.findHover(o.x, o.y), s = o.target);
    var l = this._hovered = a ? new kn(i, n) : this.findHover(i, n), u = l.target, h = this.proxy;
    h.setCursor && h.setCursor(u ? u.cursor : "default"), s && u !== s && this.dispatchToElement(o, "mouseout", e), this.dispatchToElement(l, "mousemove", e), u && u !== s && this.dispatchToElement(l, "mouseover", e);
  }, t.prototype.mouseout = function(e) {
    var i = e.zrEventControl;
    i !== "only_globalout" && this.dispatchToElement(this._hovered, "mouseout", e), i !== "no_globalout" && this.trigger("globalout", { type: "globalout", event: e });
  }, t.prototype.resize = function() {
    this._hovered = new kn(0, 0);
  }, t.prototype.dispatch = function(e, i) {
    var n = this[e];
    n && n.call(this, i);
  }, t.prototype.dispose = function() {
    this.proxy.dispose(), this.storage = null, this.proxy = null, this.painter = null;
  }, t.prototype.setCursorStyle = function(e) {
    var i = this.proxy;
    i.setCursor && i.setCursor(e);
  }, t.prototype.dispatchToElement = function(e, i, n) {
    e = e || {};
    var a = e.target;
    if (!(a && a.silent)) {
      for (var o = "on" + i, s = ux(i, e, n); a && (a[o] && (s.cancelBubble = !!a[o].call(a, s)), a.trigger(i, s), a = a.__hostTarget ? a.__hostTarget : a.parent, !s.cancelBubble); )
        ;
      s.cancelBubble || (this.trigger(i, s), this.painter && this.painter.eachOtherLayer && this.painter.eachOtherLayer(function(l) {
        typeof l[o] == "function" && l[o].call(l, s), l.trigger && l.trigger(i, s);
      }));
    }
  }, t.prototype.findHover = function(e, i, n) {
    var a = this.storage.getDisplayList(), o = new kn(e, i);
    if (md(a, o, e, i, n), this._pointerSize && !o.target) {
      for (var s = [], l = this._pointerSize, u = l / 2, h = new ot(e - u, i - u, l, l), c = a.length - 1; c >= 0; c--) {
        var f = a[c];
        f !== n && !f.ignore && !f.ignoreCoarsePointer && (!f.parent || !f.parent.ignoreCoarsePointer) && (Il.copy(f.getBoundingRect()), f.transform && Il.applyTransform(f.transform), Il.intersect(h) && s.push(f));
      }
      if (s.length)
        for (var d = 4, v = Math.PI / 12, g = Math.PI * 2, p = 0; p < u; p += d)
          for (var y = 0; y < g; y += v) {
            var m = e + p * Math.cos(y), _ = i + p * Math.sin(y);
            if (md(s, o, m, _, n), o.target)
              return o;
          }
    }
    return o;
  }, t.prototype.processGesture = function(e, i) {
    this._gestureMgr || (this._gestureMgr = new ox());
    var n = this._gestureMgr;
    i === "start" && n.clear();
    var a = n.recognize(e, this.findHover(e.zrX, e.zrY, null).target, this.proxy.dom);
    if (i === "end" && n.clear(), a) {
      var o = a.type;
      e.gestureEvent = o;
      var s = new kn();
      s.target = a.target, this.dispatchToElement(s, o, a.event);
    }
  }, t;
}(be);
T(["click", "mousedown", "mouseup", "mousewheel", "dblclick", "contextmenu"], function(r) {
  tm.prototype[r] = function(t) {
    var e = t.zrX, i = t.zrY, n = em(this, e, i), a, o;
    if ((r !== "mouseup" || !n) && (a = this.findHover(e, i), o = a.target), r === "mousedown")
      this._downEl = o, this._downPoint = [t.zrX, t.zrY], this._upEl = o;
    else if (r === "mouseup")
      this._upEl = o;
    else if (r === "click") {
      if (this._downEl !== this._upEl || !this._downPoint || Y1(this._downPoint, [t.zrX, t.zrY]) > 4)
        return;
      this._downPoint = null;
    }
    this.dispatchToElement(a, r, t);
  };
});
function dx(r, t, e) {
  if (r[r.rectHover ? "rectContain" : "contain"](t, e)) {
    for (var i = r, n = void 0, a = !1; i; ) {
      if (i.ignoreClip && (a = !0), !a) {
        var o = i.getClipPath();
        if (o && !o.contain(t, e))
          return !1;
      }
      i.silent && (n = !0);
      var s = i.__hostTarget;
      i = s || i.parent;
    }
    return n ? Jy : !0;
  }
  return !1;
}
function md(r, t, e, i, n) {
  for (var a = r.length - 1; a >= 0; a--) {
    var o = r[a], s = void 0;
    if (o !== n && !o.ignore && (s = dx(o, e, i)) && (!t.topTarget && (t.topTarget = o), s !== Jy)) {
      t.target = o;
      break;
    }
  }
}
function em(r, t, e) {
  var i = r.painter;
  return t < 0 || t > i.getWidth() || e < 0 || e > i.getHeight();
}
var rm = 32, In = 7;
function vx(r) {
  for (var t = 0; r >= rm; )
    t |= r & 1, r >>= 1;
  return r + t;
}
function _d(r, t, e, i) {
  var n = t + 1;
  if (n === e)
    return 1;
  if (i(r[n++], r[t]) < 0) {
    for (; n < e && i(r[n], r[n - 1]) < 0; )
      n++;
    px(r, t, n);
  } else
    for (; n < e && i(r[n], r[n - 1]) >= 0; )
      n++;
  return n - t;
}
function px(r, t, e) {
  for (e--; t < e; ) {
    var i = r[t];
    r[t++] = r[e], r[e--] = i;
  }
}
function bd(r, t, e, i, n) {
  for (i === t && i++; i < e; i++) {
    for (var a = r[i], o = t, s = i, l; o < s; )
      l = o + s >>> 1, n(a, r[l]) < 0 ? s = l : o = l + 1;
    var u = i - o;
    switch (u) {
      case 3:
        r[o + 3] = r[o + 2];
      case 2:
        r[o + 2] = r[o + 1];
      case 1:
        r[o + 1] = r[o];
        break;
      default:
        for (; u > 0; )
          r[o + u] = r[o + u - 1], u--;
    }
    r[o] = a;
  }
}
function Ll(r, t, e, i, n, a) {
  var o = 0, s = 0, l = 1;
  if (a(r, t[e + n]) > 0) {
    for (s = i - n; l < s && a(r, t[e + n + l]) > 0; )
      o = l, l = (l << 1) + 1, l <= 0 && (l = s);
    l > s && (l = s), o += n, l += n;
  } else {
    for (s = n + 1; l < s && a(r, t[e + n - l]) <= 0; )
      o = l, l = (l << 1) + 1, l <= 0 && (l = s);
    l > s && (l = s);
    var u = o;
    o = n - l, l = n - u;
  }
  for (o++; o < l; ) {
    var h = o + (l - o >>> 1);
    a(r, t[e + h]) > 0 ? o = h + 1 : l = h;
  }
  return l;
}
function Pl(r, t, e, i, n, a) {
  var o = 0, s = 0, l = 1;
  if (a(r, t[e + n]) < 0) {
    for (s = n + 1; l < s && a(r, t[e + n - l]) < 0; )
      o = l, l = (l << 1) + 1, l <= 0 && (l = s);
    l > s && (l = s);
    var u = o;
    o = n - l, l = n - u;
  } else {
    for (s = i - n; l < s && a(r, t[e + n + l]) >= 0; )
      o = l, l = (l << 1) + 1, l <= 0 && (l = s);
    l > s && (l = s), o += n, l += n;
  }
  for (o++; o < l; ) {
    var h = o + (l - o >>> 1);
    a(r, t[e + h]) < 0 ? l = h : o = h + 1;
  }
  return l;
}
function gx(r, t) {
  var e = In, i, n, a = 0, o = [];
  i = [], n = [];
  function s(d, v) {
    i[a] = d, n[a] = v, a += 1;
  }
  function l() {
    for (; a > 1; ) {
      var d = a - 2;
      if (d >= 1 && n[d - 1] <= n[d] + n[d + 1] || d >= 2 && n[d - 2] <= n[d] + n[d - 1])
        n[d - 1] < n[d + 1] && d--;
      else if (n[d] > n[d + 1])
        break;
      h(d);
    }
  }
  function u() {
    for (; a > 1; ) {
      var d = a - 2;
      d > 0 && n[d - 1] < n[d + 1] && d--, h(d);
    }
  }
  function h(d) {
    var v = i[d], g = n[d], p = i[d + 1], y = n[d + 1];
    n[d] = g + y, d === a - 3 && (i[d + 1] = i[d + 2], n[d + 1] = n[d + 2]), a--;
    var m = Pl(r[p], r, v, g, 0, t);
    v += m, g -= m, g !== 0 && (y = Ll(r[v + g - 1], r, p, y, y - 1, t), y !== 0 && (g <= y ? c(v, g, p, y) : f(v, g, p, y)));
  }
  function c(d, v, g, p) {
    var y = 0;
    for (y = 0; y < v; y++)
      o[y] = r[d + y];
    var m = 0, _ = g, b = d;
    if (r[b++] = r[_++], --p === 0) {
      for (y = 0; y < v; y++)
        r[b + y] = o[m + y];
      return;
    }
    if (v === 1) {
      for (y = 0; y < p; y++)
        r[b + y] = r[_ + y];
      r[b + p] = o[m];
      return;
    }
    for (var w = e, x, S, A; ; ) {
      x = 0, S = 0, A = !1;
      do
        if (t(r[_], o[m]) < 0) {
          if (r[b++] = r[_++], S++, x = 0, --p === 0) {
            A = !0;
            break;
          }
        } else if (r[b++] = o[m++], x++, S = 0, --v === 1) {
          A = !0;
          break;
        }
      while ((x | S) < w);
      if (A)
        break;
      do {
        if (x = Pl(r[_], o, m, v, 0, t), x !== 0) {
          for (y = 0; y < x; y++)
            r[b + y] = o[m + y];
          if (b += x, m += x, v -= x, v <= 1) {
            A = !0;
            break;
          }
        }
        if (r[b++] = r[_++], --p === 0) {
          A = !0;
          break;
        }
        if (S = Ll(o[m], r, _, p, 0, t), S !== 0) {
          for (y = 0; y < S; y++)
            r[b + y] = r[_ + y];
          if (b += S, _ += S, p -= S, p === 0) {
            A = !0;
            break;
          }
        }
        if (r[b++] = o[m++], --v === 1) {
          A = !0;
          break;
        }
        w--;
      } while (x >= In || S >= In);
      if (A)
        break;
      w < 0 && (w = 0), w += 2;
    }
    if (e = w, e < 1 && (e = 1), v === 1) {
      for (y = 0; y < p; y++)
        r[b + y] = r[_ + y];
      r[b + p] = o[m];
    } else {
      if (v === 0)
        throw new Error();
      for (y = 0; y < v; y++)
        r[b + y] = o[m + y];
    }
  }
  function f(d, v, g, p) {
    var y = 0;
    for (y = 0; y < p; y++)
      o[y] = r[g + y];
    var m = d + v - 1, _ = p - 1, b = g + p - 1, w = 0, x = 0;
    if (r[b--] = r[m--], --v === 0) {
      for (w = b - (p - 1), y = 0; y < p; y++)
        r[w + y] = o[y];
      return;
    }
    if (p === 1) {
      for (b -= v, m -= v, x = b + 1, w = m + 1, y = v - 1; y >= 0; y--)
        r[x + y] = r[w + y];
      r[b] = o[_];
      return;
    }
    for (var S = e; ; ) {
      var A = 0, M = 0, D = !1;
      do
        if (t(o[_], r[m]) < 0) {
          if (r[b--] = r[m--], A++, M = 0, --v === 0) {
            D = !0;
            break;
          }
        } else if (r[b--] = o[_--], M++, A = 0, --p === 1) {
          D = !0;
          break;
        }
      while ((A | M) < S);
      if (D)
        break;
      do {
        if (A = v - Pl(o[_], r, d, v, v - 1, t), A !== 0) {
          for (b -= A, m -= A, v -= A, x = b + 1, w = m + 1, y = A - 1; y >= 0; y--)
            r[x + y] = r[w + y];
          if (v === 0) {
            D = !0;
            break;
          }
        }
        if (r[b--] = o[_--], --p === 1) {
          D = !0;
          break;
        }
        if (M = p - Ll(r[m], o, 0, p, p - 1, t), M !== 0) {
          for (b -= M, _ -= M, p -= M, x = b + 1, w = _ + 1, y = 0; y < M; y++)
            r[x + y] = o[w + y];
          if (p <= 1) {
            D = !0;
            break;
          }
        }
        if (r[b--] = r[m--], --v === 0) {
          D = !0;
          break;
        }
        S--;
      } while (A >= In || M >= In);
      if (D)
        break;
      S < 0 && (S = 0), S += 2;
    }
    if (e = S, e < 1 && (e = 1), p === 1) {
      for (b -= v, m -= v, x = b + 1, w = m + 1, y = v - 1; y >= 0; y--)
        r[x + y] = r[w + y];
      r[b] = o[_];
    } else {
      if (p === 0)
        throw new Error();
      for (w = b - (p - 1), y = 0; y < p; y++)
        r[w + y] = o[y];
    }
  }
  return {
    mergeRuns: l,
    forceMergeRuns: u,
    pushRun: s
  };
}
function Zo(r, t, e, i) {
  e || (e = 0), i || (i = r.length);
  var n = i - e;
  if (!(n < 2)) {
    var a = 0;
    if (n < rm) {
      a = _d(r, e, i, t), bd(r, e, i, e + a, t);
      return;
    }
    var o = gx(r, t), s = vx(n);
    do {
      if (a = _d(r, e, i, t), a < s) {
        var l = n;
        l > s && (l = s), bd(r, e, e + l, e + a, t), a = l;
      }
      o.pushRun(e, a), o.mergeRuns(), n -= a, e += a;
    } while (n !== 0);
    o.forceMergeRuns();
  }
}
var ee = 1, Jn = 2, Yi = 4, xd = !1;
function El() {
  xd || (xd = !0, console.warn("z / z2 / zlevel of displayable is invalid, which may cause unexpected errors"));
}
function wd(r, t) {
  return r.zlevel === t.zlevel ? r.z === t.z ? r.z2 - t.z2 : r.z - t.z : r.zlevel - t.zlevel;
}
var yx = function() {
  function r() {
    this._roots = [], this._displayList = [], this._displayListLen = 0, this.displayableSortFunc = wd;
  }
  return r.prototype.traverse = function(t, e) {
    for (var i = 0; i < this._roots.length; i++)
      this._roots[i].traverse(t, e);
  }, r.prototype.getDisplayList = function(t, e) {
    e = e || !1;
    var i = this._displayList;
    return (t || !i.length) && this.updateDisplayList(e), i;
  }, r.prototype.updateDisplayList = function(t) {
    this._displayListLen = 0;
    for (var e = this._roots, i = this._displayList, n = 0, a = e.length; n < a; n++)
      this._updateAndAddDisplayable(e[n], null, t);
    i.length = this._displayListLen, Zo(i, wd);
  }, r.prototype._updateAndAddDisplayable = function(t, e, i) {
    if (!(t.ignore && !i)) {
      t.beforeUpdate(), t.update(), t.afterUpdate();
      var n = t.getClipPath();
      if (t.ignoreClip)
        e = null;
      else if (n) {
        e ? e = e.slice() : e = [];
        for (var a = n, o = t; a; )
          a.parent = o, a.updateTransform(), e.push(a), o = a, a = a.getClipPath();
      }
      if (t.childrenRef) {
        for (var s = t.childrenRef(), l = 0; l < s.length; l++) {
          var u = s[l];
          t.__dirty && (u.__dirty |= ee), this._updateAndAddDisplayable(u, e, i);
        }
        t.__dirty = 0;
      } else {
        var h = t;
        e && e.length ? h.__clipPaths = e : h.__clipPaths && h.__clipPaths.length > 0 && (h.__clipPaths = []), isNaN(h.z) && (El(), h.z = 0), isNaN(h.z2) && (El(), h.z2 = 0), isNaN(h.zlevel) && (El(), h.zlevel = 0), this._displayList[this._displayListLen++] = h;
      }
      var c = t.getDecalElement && t.getDecalElement();
      c && this._updateAndAddDisplayable(c, e, i);
      var f = t.getTextGuideLine();
      f && this._updateAndAddDisplayable(f, e, i);
      var d = t.getTextContent();
      d && this._updateAndAddDisplayable(d, e, i);
    }
  }, r.prototype.addRoot = function(t) {
    t.__zr && t.__zr.storage === this || this._roots.push(t);
  }, r.prototype.delRoot = function(t) {
    if (t instanceof Array) {
      for (var e = 0, i = t.length; e < i; e++)
        this.delRoot(t[e]);
      return;
    }
    var n = rt(this._roots, t);
    n >= 0 && this._roots.splice(n, 1);
  }, r.prototype.delAllRoots = function() {
    this._roots = [], this._displayList = [], this._displayListLen = 0;
  }, r.prototype.getRoots = function() {
    return this._roots;
  }, r.prototype.dispose = function() {
    this._displayList = null, this._roots = null;
  }, r;
}(), cs;
cs = j.hasGlobalWindow && (window.requestAnimationFrame && window.requestAnimationFrame.bind(window) || window.msRequestAnimationFrame && window.msRequestAnimationFrame.bind(window) || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame) || function(r) {
  return setTimeout(r, 16);
};
var ca = {
  linear: function(r) {
    return r;
  },
  quadraticIn: function(r) {
    return r * r;
  },
  quadraticOut: function(r) {
    return r * (2 - r);
  },
  quadraticInOut: function(r) {
    return (r *= 2) < 1 ? 0.5 * r * r : -0.5 * (--r * (r - 2) - 1);
  },
  cubicIn: function(r) {
    return r * r * r;
  },
  cubicOut: function(r) {
    return --r * r * r + 1;
  },
  cubicInOut: function(r) {
    return (r *= 2) < 1 ? 0.5 * r * r * r : 0.5 * ((r -= 2) * r * r + 2);
  },
  quarticIn: function(r) {
    return r * r * r * r;
  },
  quarticOut: function(r) {
    return 1 - --r * r * r * r;
  },
  quarticInOut: function(r) {
    return (r *= 2) < 1 ? 0.5 * r * r * r * r : -0.5 * ((r -= 2) * r * r * r - 2);
  },
  quinticIn: function(r) {
    return r * r * r * r * r;
  },
  quinticOut: function(r) {
    return --r * r * r * r * r + 1;
  },
  quinticInOut: function(r) {
    return (r *= 2) < 1 ? 0.5 * r * r * r * r * r : 0.5 * ((r -= 2) * r * r * r * r + 2);
  },
  sinusoidalIn: function(r) {
    return 1 - Math.cos(r * Math.PI / 2);
  },
  sinusoidalOut: function(r) {
    return Math.sin(r * Math.PI / 2);
  },
  sinusoidalInOut: function(r) {
    return 0.5 * (1 - Math.cos(Math.PI * r));
  },
  exponentialIn: function(r) {
    return r === 0 ? 0 : Math.pow(1024, r - 1);
  },
  exponentialOut: function(r) {
    return r === 1 ? 1 : 1 - Math.pow(2, -10 * r);
  },
  exponentialInOut: function(r) {
    return r === 0 ? 0 : r === 1 ? 1 : (r *= 2) < 1 ? 0.5 * Math.pow(1024, r - 1) : 0.5 * (-Math.pow(2, -10 * (r - 1)) + 2);
  },
  circularIn: function(r) {
    return 1 - Math.sqrt(1 - r * r);
  },
  circularOut: function(r) {
    return Math.sqrt(1 - --r * r);
  },
  circularInOut: function(r) {
    return (r *= 2) < 1 ? -0.5 * (Math.sqrt(1 - r * r) - 1) : 0.5 * (Math.sqrt(1 - (r -= 2) * r) + 1);
  },
  elasticIn: function(r) {
    var t, e = 0.1, i = 0.4;
    return r === 0 ? 0 : r === 1 ? 1 : (!e || e < 1 ? (e = 1, t = i / 4) : t = i * Math.asin(1 / e) / (2 * Math.PI), -(e * Math.pow(2, 10 * (r -= 1)) * Math.sin((r - t) * (2 * Math.PI) / i)));
  },
  elasticOut: function(r) {
    var t, e = 0.1, i = 0.4;
    return r === 0 ? 0 : r === 1 ? 1 : (!e || e < 1 ? (e = 1, t = i / 4) : t = i * Math.asin(1 / e) / (2 * Math.PI), e * Math.pow(2, -10 * r) * Math.sin((r - t) * (2 * Math.PI) / i) + 1);
  },
  elasticInOut: function(r) {
    var t, e = 0.1, i = 0.4;
    return r === 0 ? 0 : r === 1 ? 1 : (!e || e < 1 ? (e = 1, t = i / 4) : t = i * Math.asin(1 / e) / (2 * Math.PI), (r *= 2) < 1 ? -0.5 * (e * Math.pow(2, 10 * (r -= 1)) * Math.sin((r - t) * (2 * Math.PI) / i)) : e * Math.pow(2, -10 * (r -= 1)) * Math.sin((r - t) * (2 * Math.PI) / i) * 0.5 + 1);
  },
  backIn: function(r) {
    var t = 1.70158;
    return r * r * ((t + 1) * r - t);
  },
  backOut: function(r) {
    var t = 1.70158;
    return --r * r * ((t + 1) * r + t) + 1;
  },
  backInOut: function(r) {
    var t = 2.5949095;
    return (r *= 2) < 1 ? 0.5 * (r * r * ((t + 1) * r - t)) : 0.5 * ((r -= 2) * r * ((t + 1) * r + t) + 2);
  },
  bounceIn: function(r) {
    return 1 - ca.bounceOut(1 - r);
  },
  bounceOut: function(r) {
    return r < 1 / 2.75 ? 7.5625 * r * r : r < 2 / 2.75 ? 7.5625 * (r -= 1.5 / 2.75) * r + 0.75 : r < 2.5 / 2.75 ? 7.5625 * (r -= 2.25 / 2.75) * r + 0.9375 : 7.5625 * (r -= 2.625 / 2.75) * r + 0.984375;
  },
  bounceInOut: function(r) {
    return r < 0.5 ? ca.bounceIn(r * 2) * 0.5 : ca.bounceOut(r * 2 - 1) * 0.5 + 0.5;
  }
}, ro = Math.pow, wr = Math.sqrt, fs = 1e-8, im = 1e-4, Sd = wr(3), io = 1 / 3, Ne = mn(), ce = mn(), en = mn();
function mr(r) {
  return r > -fs && r < fs;
}
function nm(r) {
  return r > fs || r < -fs;
}
function $t(r, t, e, i, n) {
  var a = 1 - n;
  return a * a * (a * r + 3 * n * t) + n * n * (n * i + 3 * a * e);
}
function Td(r, t, e, i, n) {
  var a = 1 - n;
  return 3 * (((t - r) * a + 2 * (e - t) * n) * a + (i - e) * n * n);
}
function ds(r, t, e, i, n, a) {
  var o = i + 3 * (t - e) - r, s = 3 * (e - t * 2 + r), l = 3 * (t - r), u = r - n, h = s * s - 3 * o * l, c = s * l - 9 * o * u, f = l * l - 3 * s * u, d = 0;
  if (mr(h) && mr(c))
    if (mr(s))
      a[0] = 0;
    else {
      var v = -l / s;
      v >= 0 && v <= 1 && (a[d++] = v);
    }
  else {
    var g = c * c - 4 * h * f;
    if (mr(g)) {
      var p = c / h, v = -s / o + p, y = -p / 2;
      v >= 0 && v <= 1 && (a[d++] = v), y >= 0 && y <= 1 && (a[d++] = y);
    } else if (g > 0) {
      var m = wr(g), _ = h * s + 1.5 * o * (-c + m), b = h * s + 1.5 * o * (-c - m);
      _ < 0 ? _ = -ro(-_, io) : _ = ro(_, io), b < 0 ? b = -ro(-b, io) : b = ro(b, io);
      var v = (-s - (_ + b)) / (3 * o);
      v >= 0 && v <= 1 && (a[d++] = v);
    } else {
      var w = (2 * h * s - 3 * o * c) / (2 * wr(h * h * h)), x = Math.acos(w) / 3, S = wr(h), A = Math.cos(x), v = (-s - 2 * S * A) / (3 * o), y = (-s + S * (A + Sd * Math.sin(x))) / (3 * o), M = (-s + S * (A - Sd * Math.sin(x))) / (3 * o);
      v >= 0 && v <= 1 && (a[d++] = v), y >= 0 && y <= 1 && (a[d++] = y), M >= 0 && M <= 1 && (a[d++] = M);
    }
  }
  return d;
}
function am(r, t, e, i, n) {
  var a = 6 * e - 12 * t + 6 * r, o = 9 * t + 3 * i - 3 * r - 9 * e, s = 3 * t - 3 * r, l = 0;
  if (mr(o)) {
    if (nm(a)) {
      var u = -s / a;
      u >= 0 && u <= 1 && (n[l++] = u);
    }
  } else {
    var h = a * a - 4 * o * s;
    if (mr(h))
      n[0] = -a / (2 * o);
    else if (h > 0) {
      var c = wr(h), u = (-a + c) / (2 * o), f = (-a - c) / (2 * o);
      u >= 0 && u <= 1 && (n[l++] = u), f >= 0 && f <= 1 && (n[l++] = f);
    }
  }
  return l;
}
function vs(r, t, e, i, n, a) {
  var o = (t - r) * n + r, s = (e - t) * n + t, l = (i - e) * n + e, u = (s - o) * n + o, h = (l - s) * n + s, c = (h - u) * n + u;
  a[0] = r, a[1] = o, a[2] = u, a[3] = c, a[4] = c, a[5] = h, a[6] = l, a[7] = i;
}
function mx(r, t, e, i, n, a, o, s, l, u, h) {
  var c, f = 5e-3, d = 1 / 0, v, g, p, y;
  Ne[0] = l, Ne[1] = u;
  for (var m = 0; m < 1; m += 0.05)
    ce[0] = $t(r, e, n, o, m), ce[1] = $t(t, i, a, s, m), p = Ji(Ne, ce), p < d && (c = m, d = p);
  d = 1 / 0;
  for (var _ = 0; _ < 32 && !(f < im); _++)
    v = c - f, g = c + f, ce[0] = $t(r, e, n, o, v), ce[1] = $t(t, i, a, s, v), p = Ji(ce, Ne), v >= 0 && p < d ? (c = v, d = p) : (en[0] = $t(r, e, n, o, g), en[1] = $t(t, i, a, s, g), y = Ji(en, Ne), g <= 1 && y < d ? (c = g, d = y) : f *= 0.5);
  return wr(d);
}
function _x(r, t, e, i, n, a, o, s, l) {
  for (var u = r, h = t, c = 0, f = 1 / l, d = 1; d <= l; d++) {
    var v = d * f, g = $t(r, e, n, o, v), p = $t(t, i, a, s, v), y = g - u, m = p - h;
    c += Math.sqrt(y * y + m * m), u = g, h = p;
  }
  return c;
}
function Yt(r, t, e, i) {
  var n = 1 - i;
  return n * (n * r + 2 * i * t) + i * i * e;
}
function Cd(r, t, e, i) {
  return 2 * ((1 - i) * (t - r) + i * (e - t));
}
function bx(r, t, e, i, n) {
  var a = r - 2 * t + e, o = 2 * (t - r), s = r - i, l = 0;
  if (mr(a)) {
    if (nm(o)) {
      var u = -s / o;
      u >= 0 && u <= 1 && (n[l++] = u);
    }
  } else {
    var h = o * o - 4 * a * s;
    if (mr(h)) {
      var u = -o / (2 * a);
      u >= 0 && u <= 1 && (n[l++] = u);
    } else if (h > 0) {
      var c = wr(h), u = (-o + c) / (2 * a), f = (-o - c) / (2 * a);
      u >= 0 && u <= 1 && (n[l++] = u), f >= 0 && f <= 1 && (n[l++] = f);
    }
  }
  return l;
}
function om(r, t, e) {
  var i = r + e - 2 * t;
  return i === 0 ? 0.5 : (r - t) / i;
}
function ps(r, t, e, i, n) {
  var a = (t - r) * i + r, o = (e - t) * i + t, s = (o - a) * i + a;
  n[0] = r, n[1] = a, n[2] = s, n[3] = s, n[4] = o, n[5] = e;
}
function xx(r, t, e, i, n, a, o, s, l) {
  var u, h = 5e-3, c = 1 / 0;
  Ne[0] = o, Ne[1] = s;
  for (var f = 0; f < 1; f += 0.05) {
    ce[0] = Yt(r, e, n, f), ce[1] = Yt(t, i, a, f);
    var d = Ji(Ne, ce);
    d < c && (u = f, c = d);
  }
  c = 1 / 0;
  for (var v = 0; v < 32 && !(h < im); v++) {
    var g = u - h, p = u + h;
    ce[0] = Yt(r, e, n, g), ce[1] = Yt(t, i, a, g);
    var d = Ji(ce, Ne);
    if (g >= 0 && d < c)
      u = g, c = d;
    else {
      en[0] = Yt(r, e, n, p), en[1] = Yt(t, i, a, p);
      var y = Ji(en, Ne);
      p <= 1 && y < c ? (u = p, c = y) : h *= 0.5;
    }
  }
  return wr(c);
}
function Sx(r, t, e, i, n, a, o) {
  for (var s = r, l = t, u = 0, h = 1 / o, c = 1; c <= o; c++) {
    var f = c * h, d = Yt(r, e, n, f), v = Yt(t, i, a, f), g = d - s, p = v - l;
    u += Math.sqrt(g * g + p * p), s = d, l = v;
  }
  return u;
}
var Tx = /cubic-bezier\(([0-9,\.e ]+)\)/;
function sm(r) {
  var t = r && Tx.exec(r);
  if (t) {
    var e = t[1].split(","), i = +ze(e[0]), n = +ze(e[1]), a = +ze(e[2]), o = +ze(e[3]);
    if (isNaN(i + n + a + o))
      return;
    var s = [];
    return function(l) {
      return l <= 0 ? 0 : l >= 1 ? 1 : ds(0, i, a, 1, l, s) && $t(0, n, o, 1, s[0]);
    };
  }
}
var Cx = function() {
  function r(t) {
    this._inited = !1, this._startTime = 0, this._pausedTime = 0, this._paused = !1, this._life = t.life || 1e3, this._delay = t.delay || 0, this.loop = t.loop || !1, this.onframe = t.onframe || Et, this.ondestroy = t.ondestroy || Et, this.onrestart = t.onrestart || Et, t.easing && this.setEasing(t.easing);
  }
  return r.prototype.step = function(t, e) {
    if (this._inited || (this._startTime = t + this._delay, this._inited = !0), this._paused) {
      this._pausedTime += e;
      return;
    }
    var i = this._life, n = t - this._startTime - this._pausedTime, a = n / i;
    a < 0 && (a = 0), a = Math.min(a, 1);
    var o = this.easingFunc, s = o ? o(a) : a;
    if (this.onframe(s), a === 1)
      if (this.loop) {
        var l = n % i;
        this._startTime = t - l, this._pausedTime = 0, this.onrestart();
      } else
        return !0;
    return !1;
  }, r.prototype.pause = function() {
    this._paused = !0;
  }, r.prototype.resume = function() {
    this._paused = !1;
  }, r.prototype.setEasing = function(t) {
    this.easing = t, this.easingFunc = Q(t) ? t : ca[t] || sm(t);
  }, r;
}(), lm = /* @__PURE__ */ function() {
  function r(t) {
    this.value = t;
  }
  return r;
}(), Ax = function() {
  function r() {
    this._len = 0;
  }
  return r.prototype.insert = function(t) {
    var e = new lm(t);
    return this.insertEntry(e), e;
  }, r.prototype.insertEntry = function(t) {
    this.head ? (this.tail.next = t, t.prev = this.tail, t.next = null, this.tail = t) : this.head = this.tail = t, this._len++;
  }, r.prototype.remove = function(t) {
    var e = t.prev, i = t.next;
    e ? e.next = i : this.head = i, i ? i.prev = e : this.tail = e, t.next = t.prev = null, this._len--;
  }, r.prototype.len = function() {
    return this._len;
  }, r.prototype.clear = function() {
    this.head = this.tail = null, this._len = 0;
  }, r;
}(), Xa = function() {
  function r(t) {
    this._list = new Ax(), this._maxSize = 10, this._map = {}, this._maxSize = t;
  }
  return r.prototype.put = function(t, e) {
    var i = this._list, n = this._map, a = null;
    if (n[t] == null) {
      var o = i.len(), s = this._lastRemovedEntry;
      if (o >= this._maxSize && o > 0) {
        var l = i.head;
        i.remove(l), delete n[l.key], a = l.value, this._lastRemovedEntry = l;
      }
      s ? s.value = e : s = new lm(e), s.key = t, i.insertEntry(s), n[t] = s;
    }
    return a;
  }, r.prototype.get = function(t) {
    var e = this._map[t], i = this._list;
    if (e != null)
      return e !== i.tail && (i.remove(e), i.insertEntry(e)), e.value;
  }, r.prototype.clear = function() {
    this._list.clear(), this._map = {};
  }, r.prototype.len = function() {
    return this._list.len();
  }, r;
}(), Ad = {
  transparent: [0, 0, 0, 0],
  aliceblue: [240, 248, 255, 1],
  antiquewhite: [250, 235, 215, 1],
  aqua: [0, 255, 255, 1],
  aquamarine: [127, 255, 212, 1],
  azure: [240, 255, 255, 1],
  beige: [245, 245, 220, 1],
  bisque: [255, 228, 196, 1],
  black: [0, 0, 0, 1],
  blanchedalmond: [255, 235, 205, 1],
  blue: [0, 0, 255, 1],
  blueviolet: [138, 43, 226, 1],
  brown: [165, 42, 42, 1],
  burlywood: [222, 184, 135, 1],
  cadetblue: [95, 158, 160, 1],
  chartreuse: [127, 255, 0, 1],
  chocolate: [210, 105, 30, 1],
  coral: [255, 127, 80, 1],
  cornflowerblue: [100, 149, 237, 1],
  cornsilk: [255, 248, 220, 1],
  crimson: [220, 20, 60, 1],
  cyan: [0, 255, 255, 1],
  darkblue: [0, 0, 139, 1],
  darkcyan: [0, 139, 139, 1],
  darkgoldenrod: [184, 134, 11, 1],
  darkgray: [169, 169, 169, 1],
  darkgreen: [0, 100, 0, 1],
  darkgrey: [169, 169, 169, 1],
  darkkhaki: [189, 183, 107, 1],
  darkmagenta: [139, 0, 139, 1],
  darkolivegreen: [85, 107, 47, 1],
  darkorange: [255, 140, 0, 1],
  darkorchid: [153, 50, 204, 1],
  darkred: [139, 0, 0, 1],
  darksalmon: [233, 150, 122, 1],
  darkseagreen: [143, 188, 143, 1],
  darkslateblue: [72, 61, 139, 1],
  darkslategray: [47, 79, 79, 1],
  darkslategrey: [47, 79, 79, 1],
  darkturquoise: [0, 206, 209, 1],
  darkviolet: [148, 0, 211, 1],
  deeppink: [255, 20, 147, 1],
  deepskyblue: [0, 191, 255, 1],
  dimgray: [105, 105, 105, 1],
  dimgrey: [105, 105, 105, 1],
  dodgerblue: [30, 144, 255, 1],
  firebrick: [178, 34, 34, 1],
  floralwhite: [255, 250, 240, 1],
  forestgreen: [34, 139, 34, 1],
  fuchsia: [255, 0, 255, 1],
  gainsboro: [220, 220, 220, 1],
  ghostwhite: [248, 248, 255, 1],
  gold: [255, 215, 0, 1],
  goldenrod: [218, 165, 32, 1],
  gray: [128, 128, 128, 1],
  green: [0, 128, 0, 1],
  greenyellow: [173, 255, 47, 1],
  grey: [128, 128, 128, 1],
  honeydew: [240, 255, 240, 1],
  hotpink: [255, 105, 180, 1],
  indianred: [205, 92, 92, 1],
  indigo: [75, 0, 130, 1],
  ivory: [255, 255, 240, 1],
  khaki: [240, 230, 140, 1],
  lavender: [230, 230, 250, 1],
  lavenderblush: [255, 240, 245, 1],
  lawngreen: [124, 252, 0, 1],
  lemonchiffon: [255, 250, 205, 1],
  lightblue: [173, 216, 230, 1],
  lightcoral: [240, 128, 128, 1],
  lightcyan: [224, 255, 255, 1],
  lightgoldenrodyellow: [250, 250, 210, 1],
  lightgray: [211, 211, 211, 1],
  lightgreen: [144, 238, 144, 1],
  lightgrey: [211, 211, 211, 1],
  lightpink: [255, 182, 193, 1],
  lightsalmon: [255, 160, 122, 1],
  lightseagreen: [32, 178, 170, 1],
  lightskyblue: [135, 206, 250, 1],
  lightslategray: [119, 136, 153, 1],
  lightslategrey: [119, 136, 153, 1],
  lightsteelblue: [176, 196, 222, 1],
  lightyellow: [255, 255, 224, 1],
  lime: [0, 255, 0, 1],
  limegreen: [50, 205, 50, 1],
  linen: [250, 240, 230, 1],
  magenta: [255, 0, 255, 1],
  maroon: [128, 0, 0, 1],
  mediumaquamarine: [102, 205, 170, 1],
  mediumblue: [0, 0, 205, 1],
  mediumorchid: [186, 85, 211, 1],
  mediumpurple: [147, 112, 219, 1],
  mediumseagreen: [60, 179, 113, 1],
  mediumslateblue: [123, 104, 238, 1],
  mediumspringgreen: [0, 250, 154, 1],
  mediumturquoise: [72, 209, 204, 1],
  mediumvioletred: [199, 21, 133, 1],
  midnightblue: [25, 25, 112, 1],
  mintcream: [245, 255, 250, 1],
  mistyrose: [255, 228, 225, 1],
  moccasin: [255, 228, 181, 1],
  navajowhite: [255, 222, 173, 1],
  navy: [0, 0, 128, 1],
  oldlace: [253, 245, 230, 1],
  olive: [128, 128, 0, 1],
  olivedrab: [107, 142, 35, 1],
  orange: [255, 165, 0, 1],
  orangered: [255, 69, 0, 1],
  orchid: [218, 112, 214, 1],
  palegoldenrod: [238, 232, 170, 1],
  palegreen: [152, 251, 152, 1],
  paleturquoise: [175, 238, 238, 1],
  palevioletred: [219, 112, 147, 1],
  papayawhip: [255, 239, 213, 1],
  peachpuff: [255, 218, 185, 1],
  peru: [205, 133, 63, 1],
  pink: [255, 192, 203, 1],
  plum: [221, 160, 221, 1],
  powderblue: [176, 224, 230, 1],
  purple: [128, 0, 128, 1],
  red: [255, 0, 0, 1],
  rosybrown: [188, 143, 143, 1],
  royalblue: [65, 105, 225, 1],
  saddlebrown: [139, 69, 19, 1],
  salmon: [250, 128, 114, 1],
  sandybrown: [244, 164, 96, 1],
  seagreen: [46, 139, 87, 1],
  seashell: [255, 245, 238, 1],
  sienna: [160, 82, 45, 1],
  silver: [192, 192, 192, 1],
  skyblue: [135, 206, 235, 1],
  slateblue: [106, 90, 205, 1],
  slategray: [112, 128, 144, 1],
  slategrey: [112, 128, 144, 1],
  snow: [255, 250, 250, 1],
  springgreen: [0, 255, 127, 1],
  steelblue: [70, 130, 180, 1],
  tan: [210, 180, 140, 1],
  teal: [0, 128, 128, 1],
  thistle: [216, 191, 216, 1],
  tomato: [255, 99, 71, 1],
  turquoise: [64, 224, 208, 1],
  violet: [238, 130, 238, 1],
  wheat: [245, 222, 179, 1],
  white: [255, 255, 255, 1],
  whitesmoke: [245, 245, 245, 1],
  yellow: [255, 255, 0, 1],
  yellowgreen: [154, 205, 50, 1]
};
function De(r) {
  return r = Math.round(r), r < 0 ? 0 : r > 255 ? 255 : r;
}
function Mx(r) {
  return r = Math.round(r), r < 0 ? 0 : r > 360 ? 360 : r;
}
function ka(r) {
  return r < 0 ? 0 : r > 1 ? 1 : r;
}
function Rl(r) {
  var t = r;
  return t.length && t.charAt(t.length - 1) === "%" ? De(parseFloat(t) / 100 * 255) : De(parseInt(t, 10));
}
function hi(r) {
  var t = r;
  return t.length && t.charAt(t.length - 1) === "%" ? ka(parseFloat(t) / 100) : ka(parseFloat(t));
}
function $l(r, t, e) {
  return e < 0 ? e += 1 : e > 1 && (e -= 1), e * 6 < 1 ? r + (t - r) * e * 6 : e * 2 < 1 ? t : e * 3 < 2 ? r + (t - r) * (2 / 3 - e) * 6 : r;
}
function _r(r, t, e) {
  return r + (t - r) * e;
}
function se(r, t, e, i, n) {
  return r[0] = t, r[1] = e, r[2] = i, r[3] = n, r;
}
function hh(r, t) {
  return r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = t[3], r;
}
var um = new Xa(20), no = null;
function Ii(r, t) {
  no && hh(no, t), no = um.put(r, no || t.slice());
}
function ye(r, t) {
  if (r) {
    t = t || [];
    var e = um.get(r);
    if (e)
      return hh(t, e);
    r = r + "";
    var i = r.replace(/ /g, "").toLowerCase();
    if (i in Ad)
      return hh(t, Ad[i]), Ii(r, t), t;
    var n = i.length;
    if (i.charAt(0) === "#") {
      if (n === 4 || n === 5) {
        var a = parseInt(i.slice(1, 4), 16);
        if (!(a >= 0 && a <= 4095)) {
          se(t, 0, 0, 0, 1);
          return;
        }
        return se(t, (a & 3840) >> 4 | (a & 3840) >> 8, a & 240 | (a & 240) >> 4, a & 15 | (a & 15) << 4, n === 5 ? parseInt(i.slice(4), 16) / 15 : 1), Ii(r, t), t;
      } else if (n === 7 || n === 9) {
        var a = parseInt(i.slice(1, 7), 16);
        if (!(a >= 0 && a <= 16777215)) {
          se(t, 0, 0, 0, 1);
          return;
        }
        return se(t, (a & 16711680) >> 16, (a & 65280) >> 8, a & 255, n === 9 ? parseInt(i.slice(7), 16) / 255 : 1), Ii(r, t), t;
      }
      return;
    }
    var o = i.indexOf("("), s = i.indexOf(")");
    if (o !== -1 && s + 1 === n) {
      var l = i.substr(0, o), u = i.substr(o + 1, s - (o + 1)).split(","), h = 1;
      switch (l) {
        case "rgba":
          if (u.length !== 4)
            return u.length === 3 ? se(t, +u[0], +u[1], +u[2], 1) : se(t, 0, 0, 0, 1);
          h = hi(u.pop());
        case "rgb":
          if (u.length >= 3)
            return se(t, Rl(u[0]), Rl(u[1]), Rl(u[2]), u.length === 3 ? h : hi(u[3])), Ii(r, t), t;
          se(t, 0, 0, 0, 1);
          return;
        case "hsla":
          if (u.length !== 4) {
            se(t, 0, 0, 0, 1);
            return;
          }
          return u[3] = hi(u[3]), ch(u, t), Ii(r, t), t;
        case "hsl":
          if (u.length !== 3) {
            se(t, 0, 0, 0, 1);
            return;
          }
          return ch(u, t), Ii(r, t), t;
        default:
          return;
      }
    }
    se(t, 0, 0, 0, 1);
  }
}
function ch(r, t) {
  var e = (parseFloat(r[0]) % 360 + 360) % 360 / 360, i = hi(r[1]), n = hi(r[2]), a = n <= 0.5 ? n * (i + 1) : n + i - n * i, o = n * 2 - a;
  return t = t || [], se(t, De($l(o, a, e + 1 / 3) * 255), De($l(o, a, e) * 255), De($l(o, a, e - 1 / 3) * 255), 1), r.length === 4 && (t[3] = r[3]), t;
}
function Dx(r) {
  if (r) {
    var t = r[0] / 255, e = r[1] / 255, i = r[2] / 255, n = Math.min(t, e, i), a = Math.max(t, e, i), o = a - n, s = (a + n) / 2, l, u;
    if (o === 0)
      l = 0, u = 0;
    else {
      s < 0.5 ? u = o / (a + n) : u = o / (2 - a - n);
      var h = ((a - t) / 6 + o / 2) / o, c = ((a - e) / 6 + o / 2) / o, f = ((a - i) / 6 + o / 2) / o;
      t === a ? l = f - c : e === a ? l = 1 / 3 + h - f : i === a && (l = 2 / 3 + c - h), l < 0 && (l += 1), l > 1 && (l -= 1);
    }
    var d = [l * 360, u, s];
    return r[3] != null && d.push(r[3]), d;
  }
}
function Md(r, t) {
  var e = ye(r);
  if (e) {
    for (var i = 0; i < 3; i++)
      e[i] = e[i] * (1 - t) | 0, e[i] > 255 ? e[i] = 255 : e[i] < 0 && (e[i] = 0);
    return er(e, e.length === 4 ? "rgba" : "rgb");
  }
}
function Ol(r, t, e) {
  if (!(!(t && t.length) || !(r >= 0 && r <= 1))) {
    e = e || [];
    var i = r * (t.length - 1), n = Math.floor(i), a = Math.ceil(i), o = t[n], s = t[a], l = i - n;
    return e[0] = De(_r(o[0], s[0], l)), e[1] = De(_r(o[1], s[1], l)), e[2] = De(_r(o[2], s[2], l)), e[3] = ka(_r(o[3], s[3], l)), e;
  }
}
function kx(r, t, e) {
  if (!(!(t && t.length) || !(r >= 0 && r <= 1))) {
    var i = r * (t.length - 1), n = Math.floor(i), a = Math.ceil(i), o = ye(t[n]), s = ye(t[a]), l = i - n, u = er([
      De(_r(o[0], s[0], l)),
      De(_r(o[1], s[1], l)),
      De(_r(o[2], s[2], l)),
      ka(_r(o[3], s[3], l))
    ], "rgba");
    return e ? {
      color: u,
      leftIndex: n,
      rightIndex: a,
      value: i
    } : u;
  }
}
function fa(r, t, e, i) {
  var n = ye(r);
  if (r)
    return n = Dx(n), t != null && (n[0] = Mx(t)), e != null && (n[1] = hi(e)), i != null && (n[2] = hi(i)), er(ch(n), "rgba");
}
function gs(r, t) {
  var e = ye(r);
  if (e && t != null)
    return e[3] = ka(t), er(e, "rgba");
}
function er(r, t) {
  if (!(!r || !r.length)) {
    var e = r[0] + "," + r[1] + "," + r[2];
    return (t === "rgba" || t === "hsva" || t === "hsla") && (e += "," + r[3]), t + "(" + e + ")";
  }
}
function ys(r, t) {
  var e = ye(r);
  return e ? (0.299 * e[0] + 0.587 * e[1] + 0.114 * e[2]) * e[3] / 255 + (1 - e[3]) * t : 0;
}
var Dd = new Xa(100);
function kd(r) {
  if (V(r)) {
    var t = Dd.get(r);
    return t || (t = Md(r, -0.1), Dd.put(r, t)), t;
  } else if (Us(r)) {
    var e = $({}, r);
    return e.colorStops = H(r.colorStops, function(i) {
      return {
        offset: i.offset,
        color: Md(i.color, -0.1)
      };
    }), e;
  }
  return r;
}
function Ix(r) {
  return r.type === "linear";
}
function Lx(r) {
  return r.type === "radial";
}
(function() {
  return j.hasGlobalWindow && Q(window.btoa) ? function(r) {
    return window.btoa(unescape(encodeURIComponent(r)));
  } : typeof Buffer < "u" ? function(r) {
    return Buffer.from(r).toString("base64");
  } : function(r) {
    return null;
  };
})();
var fh = Array.prototype.slice;
function je(r, t, e) {
  return (t - r) * e + r;
}
function Nl(r, t, e, i) {
  for (var n = t.length, a = 0; a < n; a++)
    r[a] = je(t[a], e[a], i);
  return r;
}
function Px(r, t, e, i) {
  for (var n = t.length, a = n && t[0].length, o = 0; o < n; o++) {
    r[o] || (r[o] = []);
    for (var s = 0; s < a; s++)
      r[o][s] = je(t[o][s], e[o][s], i);
  }
  return r;
}
function ao(r, t, e, i) {
  for (var n = t.length, a = 0; a < n; a++)
    r[a] = t[a] + e[a] * i;
  return r;
}
function Id(r, t, e, i) {
  for (var n = t.length, a = n && t[0].length, o = 0; o < n; o++) {
    r[o] || (r[o] = []);
    for (var s = 0; s < a; s++)
      r[o][s] = t[o][s] + e[o][s] * i;
  }
  return r;
}
function Ex(r, t) {
  for (var e = r.length, i = t.length, n = e > i ? t : r, a = Math.min(e, i), o = n[a - 1] || { color: [0, 0, 0, 0], offset: 0 }, s = a; s < Math.max(e, i); s++)
    n.push({
      offset: o.offset,
      color: o.color.slice()
    });
}
function Rx(r, t, e) {
  var i = r, n = t;
  if (!(!i.push || !n.push)) {
    var a = i.length, o = n.length;
    if (a !== o) {
      var s = a > o;
      if (s)
        i.length = o;
      else
        for (var l = a; l < o; l++)
          i.push(e === 1 ? n[l] : fh.call(n[l]));
    }
    for (var u = i[0] && i[0].length, l = 0; l < i.length; l++)
      if (e === 1)
        isNaN(i[l]) && (i[l] = n[l]);
      else
        for (var h = 0; h < u; h++)
          isNaN(i[l][h]) && (i[l][h] = n[l][h]);
  }
}
function qo(r) {
  if (qt(r)) {
    var t = r.length;
    if (qt(r[0])) {
      for (var e = [], i = 0; i < t; i++)
        e.push(fh.call(r[i]));
      return e;
    }
    return fh.call(r);
  }
  return r;
}
function Ko(r) {
  return r[0] = Math.floor(r[0]) || 0, r[1] = Math.floor(r[1]) || 0, r[2] = Math.floor(r[2]) || 0, r[3] = r[3] == null ? 1 : r[3], "rgba(" + r.join(",") + ")";
}
function $x(r) {
  return qt(r && r[0]) ? 2 : 1;
}
var oo = 0, jo = 1, hm = 2, ta = 3, dh = 4, vh = 5, Ld = 6;
function Pd(r) {
  return r === dh || r === vh;
}
function so(r) {
  return r === jo || r === hm;
}
var Ln = [0, 0, 0, 0], Ox = function() {
  function r(t) {
    this.keyframes = [], this.discrete = !1, this._invalid = !1, this._needsSort = !1, this._lastFr = 0, this._lastFrP = 0, this.propName = t;
  }
  return r.prototype.isFinished = function() {
    return this._finished;
  }, r.prototype.setFinished = function() {
    this._finished = !0, this._additiveTrack && this._additiveTrack.setFinished();
  }, r.prototype.needsAnimate = function() {
    return this.keyframes.length >= 1;
  }, r.prototype.getAdditiveTrack = function() {
    return this._additiveTrack;
  }, r.prototype.addKeyframe = function(t, e, i) {
    this._needsSort = !0;
    var n = this.keyframes, a = n.length, o = !1, s = Ld, l = e;
    if (qt(e)) {
      var u = $x(e);
      s = u, (u === 1 && !wt(e[0]) || u === 2 && !wt(e[0][0])) && (o = !0);
    } else if (wt(e) && !us(e))
      s = oo;
    else if (V(e))
      if (!isNaN(+e))
        s = oo;
      else {
        var h = ye(e);
        h && (l = h, s = ta);
      }
    else if (Us(e)) {
      var c = $({}, l);
      c.colorStops = H(e.colorStops, function(d) {
        return {
          offset: d.offset,
          color: ye(d.color)
        };
      }), Ix(e) ? s = dh : Lx(e) && (s = vh), l = c;
    }
    a === 0 ? this.valType = s : (s !== this.valType || s === Ld) && (o = !0), this.discrete = this.discrete || o;
    var f = {
      time: t,
      value: l,
      rawValue: e,
      percent: 0
    };
    return i && (f.easing = i, f.easingFunc = Q(i) ? i : ca[i] || sm(i)), n.push(f), f;
  }, r.prototype.prepare = function(t, e) {
    var i = this.keyframes;
    this._needsSort && i.sort(function(g, p) {
      return g.time - p.time;
    });
    for (var n = this.valType, a = i.length, o = i[a - 1], s = this.discrete, l = so(n), u = Pd(n), h = 0; h < a; h++) {
      var c = i[h], f = c.value, d = o.value;
      c.percent = c.time / t, s || (l && h !== a - 1 ? Rx(f, d, n) : u && Ex(f.colorStops, d.colorStops));
    }
    if (!s && n !== vh && e && this.needsAnimate() && e.needsAnimate() && n === e.valType && !e._finished) {
      this._additiveTrack = e;
      for (var v = i[0].value, h = 0; h < a; h++)
        n === oo ? i[h].additiveValue = i[h].value - v : n === ta ? i[h].additiveValue = ao([], i[h].value, v, -1) : so(n) && (i[h].additiveValue = n === jo ? ao([], i[h].value, v, -1) : Id([], i[h].value, v, -1));
    }
  }, r.prototype.step = function(t, e) {
    if (!this._finished) {
      this._additiveTrack && this._additiveTrack._finished && (this._additiveTrack = null);
      var i = this._additiveTrack != null, n = i ? "additiveValue" : "value", a = this.valType, o = this.keyframes, s = o.length, l = this.propName, u = a === ta, h, c = this._lastFr, f = Math.min, d, v;
      if (s === 1)
        d = v = o[0];
      else {
        if (e < 0)
          h = 0;
        else if (e < this._lastFrP) {
          var g = f(c + 1, s - 1);
          for (h = g; h >= 0 && !(o[h].percent <= e); h--)
            ;
          h = f(h, s - 2);
        } else {
          for (h = c; h < s && !(o[h].percent > e); h++)
            ;
          h = f(h - 1, s - 2);
        }
        v = o[h + 1], d = o[h];
      }
      if (d && v) {
        this._lastFr = h, this._lastFrP = e;
        var p = v.percent - d.percent, y = p === 0 ? 1 : f((e - d.percent) / p, 1);
        v.easingFunc && (y = v.easingFunc(y));
        var m = i ? this._additiveValue : u ? Ln : t[l];
        if ((so(a) || u) && !m && (m = this._additiveValue = []), this.discrete)
          t[l] = y < 1 ? d.rawValue : v.rawValue;
        else if (so(a))
          a === jo ? Nl(m, d[n], v[n], y) : Px(m, d[n], v[n], y);
        else if (Pd(a)) {
          var _ = d[n], b = v[n], w = a === dh;
          t[l] = {
            type: w ? "linear" : "radial",
            x: je(_.x, b.x, y),
            y: je(_.y, b.y, y),
            colorStops: H(_.colorStops, function(S, A) {
              var M = b.colorStops[A];
              return {
                offset: je(S.offset, M.offset, y),
                color: Ko(Nl([], S.color, M.color, y))
              };
            }),
            global: b.global
          }, w ? (t[l].x2 = je(_.x2, b.x2, y), t[l].y2 = je(_.y2, b.y2, y)) : t[l].r = je(_.r, b.r, y);
        } else if (u)
          Nl(m, d[n], v[n], y), i || (t[l] = Ko(m));
        else {
          var x = je(d[n], v[n], y);
          i ? this._additiveValue = x : t[l] = x;
        }
        i && this._addToTarget(t);
      }
    }
  }, r.prototype._addToTarget = function(t) {
    var e = this.valType, i = this.propName, n = this._additiveValue;
    e === oo ? t[i] = t[i] + n : e === ta ? (ye(t[i], Ln), ao(Ln, Ln, n, 1), t[i] = Ko(Ln)) : e === jo ? ao(t[i], t[i], n, 1) : e === hm && Id(t[i], t[i], n, 1);
  }, r;
}(), Fc = function() {
  function r(t, e, i, n) {
    if (this._tracks = {}, this._trackKeys = [], this._maxTime = 0, this._started = 0, this._clip = null, this._target = t, this._loop = e, e && n) {
      Ec("Can' use additive animation on looped animation.");
      return;
    }
    this._additiveAnimators = n, this._allowDiscrete = i;
  }
  return r.prototype.getMaxTime = function() {
    return this._maxTime;
  }, r.prototype.getDelay = function() {
    return this._delay;
  }, r.prototype.getLoop = function() {
    return this._loop;
  }, r.prototype.getTarget = function() {
    return this._target;
  }, r.prototype.changeTarget = function(t) {
    this._target = t;
  }, r.prototype.when = function(t, e, i) {
    return this.whenWithKeys(t, e, xt(e), i);
  }, r.prototype.whenWithKeys = function(t, e, i, n) {
    for (var a = this._tracks, o = 0; o < i.length; o++) {
      var s = i[o], l = a[s];
      if (!l) {
        l = a[s] = new Ox(s);
        var u = void 0, h = this._getAdditiveTrack(s);
        if (h) {
          var c = h.keyframes, f = c[c.length - 1];
          u = f && f.value, h.valType === ta && u && (u = Ko(u));
        } else
          u = this._target[s];
        if (u == null)
          continue;
        t > 0 && l.addKeyframe(0, qo(u), n), this._trackKeys.push(s);
      }
      l.addKeyframe(t, qo(e[s]), n);
    }
    return this._maxTime = Math.max(this._maxTime, t), this;
  }, r.prototype.pause = function() {
    this._clip.pause(), this._paused = !0;
  }, r.prototype.resume = function() {
    this._clip.resume(), this._paused = !1;
  }, r.prototype.isPaused = function() {
    return !!this._paused;
  }, r.prototype.duration = function(t) {
    return this._maxTime = t, this._force = !0, this;
  }, r.prototype._doneCallback = function() {
    this._setTracksFinished(), this._clip = null;
    var t = this._doneCbs;
    if (t)
      for (var e = t.length, i = 0; i < e; i++)
        t[i].call(this);
  }, r.prototype._abortedCallback = function() {
    this._setTracksFinished();
    var t = this.animation, e = this._abortedCbs;
    if (t && t.removeClip(this._clip), this._clip = null, e)
      for (var i = 0; i < e.length; i++)
        e[i].call(this);
  }, r.prototype._setTracksFinished = function() {
    for (var t = this._tracks, e = this._trackKeys, i = 0; i < e.length; i++)
      t[e[i]].setFinished();
  }, r.prototype._getAdditiveTrack = function(t) {
    var e, i = this._additiveAnimators;
    if (i)
      for (var n = 0; n < i.length; n++) {
        var a = i[n].getTrack(t);
        a && (e = a);
      }
    return e;
  }, r.prototype.start = function(t) {
    if (!(this._started > 0)) {
      this._started = 1;
      for (var e = this, i = [], n = this._maxTime || 0, a = 0; a < this._trackKeys.length; a++) {
        var o = this._trackKeys[a], s = this._tracks[o], l = this._getAdditiveTrack(o), u = s.keyframes, h = u.length;
        if (s.prepare(n, l), s.needsAnimate())
          if (!this._allowDiscrete && s.discrete) {
            var c = u[h - 1];
            c && (e._target[s.propName] = c.rawValue), s.setFinished();
          } else
            i.push(s);
      }
      if (i.length || this._force) {
        var f = new Cx({
          life: n,
          loop: this._loop,
          delay: this._delay || 0,
          onframe: function(d) {
            e._started = 2;
            var v = e._additiveAnimators;
            if (v) {
              for (var g = !1, p = 0; p < v.length; p++)
                if (v[p]._clip) {
                  g = !0;
                  break;
                }
              g || (e._additiveAnimators = null);
            }
            for (var p = 0; p < i.length; p++)
              i[p].step(e._target, d);
            var y = e._onframeCbs;
            if (y)
              for (var p = 0; p < y.length; p++)
                y[p](e._target, d);
          },
          ondestroy: function() {
            e._doneCallback();
          }
        });
        this._clip = f, this.animation && this.animation.addClip(f), t && f.setEasing(t);
      } else
        this._doneCallback();
      return this;
    }
  }, r.prototype.stop = function(t) {
    if (this._clip) {
      var e = this._clip;
      t && e.onframe(1), this._abortedCallback();
    }
  }, r.prototype.delay = function(t) {
    return this._delay = t, this;
  }, r.prototype.during = function(t) {
    return t && (this._onframeCbs || (this._onframeCbs = []), this._onframeCbs.push(t)), this;
  }, r.prototype.done = function(t) {
    return t && (this._doneCbs || (this._doneCbs = []), this._doneCbs.push(t)), this;
  }, r.prototype.aborted = function(t) {
    return t && (this._abortedCbs || (this._abortedCbs = []), this._abortedCbs.push(t)), this;
  }, r.prototype.getClip = function() {
    return this._clip;
  }, r.prototype.getTrack = function(t) {
    return this._tracks[t];
  }, r.prototype.getTracks = function() {
    var t = this;
    return H(this._trackKeys, function(e) {
      return t._tracks[e];
    });
  }, r.prototype.stopTracks = function(t, e) {
    if (!t.length || !this._clip)
      return !0;
    for (var i = this._tracks, n = this._trackKeys, a = 0; a < t.length; a++) {
      var o = i[t[a]];
      o && !o.isFinished() && (e ? o.step(this._target, 1) : this._started === 1 && o.step(this._target, 0), o.setFinished());
    }
    for (var s = !0, a = 0; a < n.length; a++)
      if (!i[n[a]].isFinished()) {
        s = !1;
        break;
      }
    return s && this._abortedCallback(), s;
  }, r.prototype.saveTo = function(t, e, i) {
    if (t) {
      e = e || this._trackKeys;
      for (var n = 0; n < e.length; n++) {
        var a = e[n], o = this._tracks[a];
        if (!(!o || o.isFinished())) {
          var s = o.keyframes, l = s[i ? 0 : s.length - 1];
          l && (t[a] = qo(l.rawValue));
        }
      }
    }
  }, r.prototype.__changeFinalValue = function(t, e) {
    e = e || xt(t);
    for (var i = 0; i < e.length; i++) {
      var n = e[i], a = this._tracks[n];
      if (a) {
        var o = a.keyframes;
        if (o.length > 1) {
          var s = o.pop();
          a.addKeyframe(s.time, t[n]), a.prepare(this._maxTime, a.getAdditiveTrack());
        }
      }
    }
  }, r;
}();
function Ki() {
  return (/* @__PURE__ */ new Date()).getTime();
}
var Nx = function(r) {
  N(t, r);
  function t(e) {
    var i = r.call(this) || this;
    return i._running = !1, i._time = 0, i._pausedTime = 0, i._pauseStart = 0, i._paused = !1, e = e || {}, i.stage = e.stage || {}, i;
  }
  return t.prototype.addClip = function(e) {
    e.animation && this.removeClip(e), this._head ? (this._tail.next = e, e.prev = this._tail, e.next = null, this._tail = e) : this._head = this._tail = e, e.animation = this;
  }, t.prototype.addAnimator = function(e) {
    e.animation = this;
    var i = e.getClip();
    i && this.addClip(i);
  }, t.prototype.removeClip = function(e) {
    if (e.animation) {
      var i = e.prev, n = e.next;
      i ? i.next = n : this._head = n, n ? n.prev = i : this._tail = i, e.next = e.prev = e.animation = null;
    }
  }, t.prototype.removeAnimator = function(e) {
    var i = e.getClip();
    i && this.removeClip(i), e.animation = null;
  }, t.prototype.update = function(e) {
    for (var i = Ki() - this._pausedTime, n = i - this._time, a = this._head; a; ) {
      var o = a.next, s = a.step(i, n);
      s && (a.ondestroy(), this.removeClip(a)), a = o;
    }
    this._time = i, e || (this.trigger("frame", n), this.stage.update && this.stage.update());
  }, t.prototype._startLoop = function() {
    var e = this;
    this._running = !0;
    function i() {
      e._running && (cs(i), !e._paused && e.update());
    }
    cs(i);
  }, t.prototype.start = function() {
    this._running || (this._time = Ki(), this._pausedTime = 0, this._startLoop());
  }, t.prototype.stop = function() {
    this._running = !1;
  }, t.prototype.pause = function() {
    this._paused || (this._pauseStart = Ki(), this._paused = !0);
  }, t.prototype.resume = function() {
    this._paused && (this._pausedTime += Ki() - this._pauseStart, this._paused = !1);
  }, t.prototype.clear = function() {
    for (var e = this._head; e; ) {
      var i = e.next;
      e.prev = e.next = e.animation = null, e = i;
    }
    this._head = this._tail = null;
  }, t.prototype.isFinished = function() {
    return this._head == null;
  }, t.prototype.animate = function(e, i) {
    i = i || {}, this.start();
    var n = new Fc(e, i.loop);
    return this.addAnimator(n), n;
  }, t;
}(be), Bx = 300, Bl = j.domSupported, zl = function() {
  var r = [
    "click",
    "dblclick",
    "mousewheel",
    "wheel",
    "mouseout",
    "mouseup",
    "mousedown",
    "mousemove",
    "contextmenu"
  ], t = [
    "touchstart",
    "touchend",
    "touchmove"
  ], e = {
    pointerdown: 1,
    pointerup: 1,
    pointermove: 1,
    pointerout: 1
  }, i = H(r, function(n) {
    var a = n.replace("mouse", "pointer");
    return e.hasOwnProperty(a) ? a : n;
  });
  return {
    mouse: r,
    touch: t,
    pointer: i
  };
}(), Ed = {
  mouse: ["mousemove", "mouseup"],
  pointer: ["pointermove", "pointerup"]
}, Rd = !1;
function ph(r) {
  var t = r.pointerType;
  return t === "pen" || t === "touch";
}
function zx(r) {
  r.touching = !0, r.touchTimer != null && (clearTimeout(r.touchTimer), r.touchTimer = null), r.touchTimer = setTimeout(function() {
    r.touching = !1, r.touchTimer = null;
  }, 700);
}
function Fl(r) {
  r && (r.zrByTouch = !0);
}
function Fx(r, t) {
  return le(r.dom, new Hx(r, t), !0);
}
function cm(r, t) {
  for (var e = t, i = !1; e && e.nodeType !== 9 && !(i = e.domBelongToZr || e !== t && e === r.painterRoot); )
    e = e.parentNode;
  return i;
}
var Hx = /* @__PURE__ */ function() {
  function r(t, e) {
    this.stopPropagation = Et, this.stopImmediatePropagation = Et, this.preventDefault = Et, this.type = e.type, this.target = this.currentTarget = t.dom, this.pointerType = e.pointerType, this.clientX = e.clientX, this.clientY = e.clientY;
  }
  return r;
}(), Ce = {
  mousedown: function(r) {
    r = le(this.dom, r), this.__mayPointerCapture = [r.zrX, r.zrY], this.trigger("mousedown", r);
  },
  mousemove: function(r) {
    r = le(this.dom, r);
    var t = this.__mayPointerCapture;
    t && (r.zrX !== t[0] || r.zrY !== t[1]) && this.__togglePointerCapture(!0), this.trigger("mousemove", r);
  },
  mouseup: function(r) {
    r = le(this.dom, r), this.__togglePointerCapture(!1), this.trigger("mouseup", r);
  },
  mouseout: function(r) {
    r = le(this.dom, r);
    var t = r.toElement || r.relatedTarget;
    cm(this, t) || (this.__pointerCapturing && (r.zrEventControl = "no_globalout"), this.trigger("mouseout", r));
  },
  wheel: function(r) {
    Rd = !0, r = le(this.dom, r), this.trigger("mousewheel", r);
  },
  mousewheel: function(r) {
    Rd || (r = le(this.dom, r), this.trigger("mousewheel", r));
  },
  touchstart: function(r) {
    r = le(this.dom, r), Fl(r), this.__lastTouchMoment = /* @__PURE__ */ new Date(), this.handler.processGesture(r, "start"), Ce.mousemove.call(this, r), Ce.mousedown.call(this, r);
  },
  touchmove: function(r) {
    r = le(this.dom, r), Fl(r), this.handler.processGesture(r, "change"), Ce.mousemove.call(this, r);
  },
  touchend: function(r) {
    r = le(this.dom, r), Fl(r), this.handler.processGesture(r, "end"), Ce.mouseup.call(this, r), +/* @__PURE__ */ new Date() - +this.__lastTouchMoment < Bx && Ce.click.call(this, r);
  },
  pointerdown: function(r) {
    Ce.mousedown.call(this, r);
  },
  pointermove: function(r) {
    ph(r) || Ce.mousemove.call(this, r);
  },
  pointerup: function(r) {
    Ce.mouseup.call(this, r);
  },
  pointerout: function(r) {
    ph(r) || Ce.mouseout.call(this, r);
  }
};
T(["click", "dblclick", "contextmenu"], function(r) {
  Ce[r] = function(t) {
    t = le(this.dom, t), this.trigger(r, t);
  };
});
var gh = {
  pointermove: function(r) {
    ph(r) || gh.mousemove.call(this, r);
  },
  pointerup: function(r) {
    gh.mouseup.call(this, r);
  },
  mousemove: function(r) {
    this.trigger("mousemove", r);
  },
  mouseup: function(r) {
    var t = this.__pointerCapturing;
    this.__togglePointerCapture(!1), this.trigger("mouseup", r), t && (r.zrEventControl = "only_globalout", this.trigger("mouseout", r));
  }
};
function Vx(r, t) {
  var e = t.domHandlers;
  j.pointerEventsSupported ? T(zl.pointer, function(i) {
    Qo(t, i, function(n) {
      e[i].call(r, n);
    });
  }) : (j.touchEventsSupported && T(zl.touch, function(i) {
    Qo(t, i, function(n) {
      e[i].call(r, n), zx(t);
    });
  }), T(zl.mouse, function(i) {
    Qo(t, i, function(n) {
      n = Oc(n), t.touching || e[i].call(r, n);
    });
  }));
}
function Gx(r, t) {
  j.pointerEventsSupported ? T(Ed.pointer, e) : j.touchEventsSupported || T(Ed.mouse, e);
  function e(i) {
    function n(a) {
      a = Oc(a), cm(r, a.target) || (a = Fx(r, a), t.domHandlers[i].call(r, a));
    }
    Qo(t, i, n, { capture: !0 });
  }
}
function Qo(r, t, e, i) {
  r.mounted[t] = e, r.listenerOpts[t] = i, nx(r.domTarget, t, e, i);
}
function Hl(r) {
  var t = r.mounted;
  for (var e in t)
    t.hasOwnProperty(e) && ax(r.domTarget, e, t[e], r.listenerOpts[e]);
  r.mounted = {};
}
var $d = /* @__PURE__ */ function() {
  function r(t, e) {
    this.mounted = {}, this.listenerOpts = {}, this.touching = !1, this.domTarget = t, this.domHandlers = e;
  }
  return r;
}(), Wx = function(r) {
  N(t, r);
  function t(e, i) {
    var n = r.call(this) || this;
    return n.__pointerCapturing = !1, n.dom = e, n.painterRoot = i, n._localHandlerScope = new $d(e, Ce), Bl && (n._globalHandlerScope = new $d(document, gh)), Vx(n, n._localHandlerScope), n;
  }
  return t.prototype.dispose = function() {
    Hl(this._localHandlerScope), Bl && Hl(this._globalHandlerScope);
  }, t.prototype.setCursor = function(e) {
    this.dom.style && (this.dom.style.cursor = e || "default");
  }, t.prototype.__togglePointerCapture = function(e) {
    if (this.__mayPointerCapture = null, Bl && +this.__pointerCapturing ^ +e) {
      this.__pointerCapturing = e;
      var i = this._globalHandlerScope;
      e ? Gx(this, i) : Hl(i);
    }
  }, t;
}(be), fm = 1;
j.hasGlobalWindow && (fm = Math.max(window.devicePixelRatio || window.screen && window.screen.deviceXDPI / window.screen.logicalXDPI || 1, 1));
var ms = fm, yh = 0.4, mh = "#333", _h = "#ccc", Ux = "#eee", Od = Nc, Nd = 5e-5;
function Nr(r) {
  return r > Nd || r < -Nd;
}
var Br = [], Li = [], Vl = ui(), Gl = Math.abs, Hc = function() {
  function r() {
  }
  return r.prototype.getLocalTransform = function(t) {
    return r.getLocalTransform(this, t);
  }, r.prototype.setPosition = function(t) {
    this.x = t[0], this.y = t[1];
  }, r.prototype.setScale = function(t) {
    this.scaleX = t[0], this.scaleY = t[1];
  }, r.prototype.setSkew = function(t) {
    this.skewX = t[0], this.skewY = t[1];
  }, r.prototype.setOrigin = function(t) {
    this.originX = t[0], this.originY = t[1];
  }, r.prototype.needLocalTransform = function() {
    return Nr(this.rotation) || Nr(this.x) || Nr(this.y) || Nr(this.scaleX - 1) || Nr(this.scaleY - 1) || Nr(this.skewX) || Nr(this.skewY);
  }, r.prototype.updateTransform = function() {
    var t = this.parent && this.parent.transform, e = this.needLocalTransform(), i = this.transform;
    if (!(e || t)) {
      i && (Od(i), this.invTransform = null);
      return;
    }
    i = i || ui(), e ? this.getLocalTransform(i) : Od(i), t && (e ? tn(i, t, i) : lx(i, t)), this.transform = i, this._resolveGlobalScaleRatio(i);
  }, r.prototype._resolveGlobalScaleRatio = function(t) {
    var e = this.globalScaleRatio;
    if (e != null && e !== 1) {
      this.getGlobalScale(Br);
      var i = Br[0] < 0 ? -1 : 1, n = Br[1] < 0 ? -1 : 1, a = ((Br[0] - i) * e + i) / Br[0] || 0, o = ((Br[1] - n) * e + n) / Br[1] || 0;
      t[0] *= a, t[1] *= a, t[2] *= o, t[3] *= o;
    }
    this.invTransform = this.invTransform || ui(), zc(this.invTransform, t);
  }, r.prototype.getComputedTransform = function() {
    for (var t = this, e = []; t; )
      e.push(t), t = t.parent;
    for (; t = e.pop(); )
      t.updateTransform();
    return this.transform;
  }, r.prototype.setLocalTransform = function(t) {
    if (t) {
      var e = t[0] * t[0] + t[1] * t[1], i = t[2] * t[2] + t[3] * t[3], n = Math.atan2(t[1], t[0]), a = Math.PI / 2 + n - Math.atan2(t[3], t[2]);
      i = Math.sqrt(i) * Math.cos(a), e = Math.sqrt(e), this.skewX = a, this.skewY = 0, this.rotation = -n, this.x = +t[4], this.y = +t[5], this.scaleX = e, this.scaleY = i, this.originX = 0, this.originY = 0;
    }
  }, r.prototype.decomposeTransform = function() {
    if (this.transform) {
      var t = this.parent, e = this.transform;
      t && t.transform && (t.invTransform = t.invTransform || ui(), tn(Li, t.invTransform, e), e = Li);
      var i = this.originX, n = this.originY;
      (i || n) && (Vl[4] = i, Vl[5] = n, tn(Li, e, Vl), Li[4] -= i, Li[5] -= n, e = Li), this.setLocalTransform(e);
    }
  }, r.prototype.getGlobalScale = function(t) {
    var e = this.transform;
    return t = t || [], e ? (t[0] = Math.sqrt(e[0] * e[0] + e[1] * e[1]), t[1] = Math.sqrt(e[2] * e[2] + e[3] * e[3]), e[0] < 0 && (t[0] = -t[0]), e[3] < 0 && (t[1] = -t[1]), t) : (t[0] = 1, t[1] = 1, t);
  }, r.prototype.transformCoordToLocal = function(t, e) {
    var i = [t, e], n = this.invTransform;
    return n && ge(i, i, n), i;
  }, r.prototype.transformCoordToGlobal = function(t, e) {
    var i = [t, e], n = this.transform;
    return n && ge(i, i, n), i;
  }, r.prototype.getLineScale = function() {
    var t = this.transform;
    return t && Gl(t[0] - 1) > 1e-10 && Gl(t[3] - 1) > 1e-10 ? Math.sqrt(Gl(t[0] * t[3] - t[2] * t[1])) : 1;
  }, r.prototype.copyTransform = function(t) {
    Yx(this, t);
  }, r.getLocalTransform = function(t, e) {
    e = e || [];
    var i = t.originX || 0, n = t.originY || 0, a = t.scaleX, o = t.scaleY, s = t.anchorX, l = t.anchorY, u = t.rotation || 0, h = t.x, c = t.y, f = t.skewX ? Math.tan(t.skewX) : 0, d = t.skewY ? Math.tan(-t.skewY) : 0;
    if (i || n || s || l) {
      var v = i + s, g = n + l;
      e[4] = -v * a - f * g * o, e[5] = -g * o - d * v * a;
    } else
      e[4] = e[5] = 0;
    return e[0] = a, e[3] = o, e[1] = d * a, e[2] = f * o, u && Bc(e, e, u), e[4] += i + h, e[5] += n + c, e;
  }, r.initDefaultProps = function() {
    var t = r.prototype;
    t.scaleX = t.scaleY = t.globalScaleRatio = 1, t.x = t.y = t.originX = t.originY = t.skewX = t.skewY = t.rotation = t.anchorX = t.anchorY = 0;
  }(), r;
}(), Ia = [
  "x",
  "y",
  "originX",
  "originY",
  "anchorX",
  "anchorY",
  "rotation",
  "scaleX",
  "scaleY",
  "skewX",
  "skewY"
];
function Yx(r, t) {
  for (var e = 0; e < Ia.length; e++) {
    var i = Ia[e];
    r[i] = t[i];
  }
}
var Bd = {};
function re(r, t) {
  t = t || gi;
  var e = Bd[t];
  e || (e = Bd[t] = new Xa(500));
  var i = e.get(r);
  return i == null && (i = gn.measureText(r, t).width, e.put(r, i)), i;
}
function zd(r, t, e, i) {
  var n = re(r, t), a = Gc(t), o = ea(0, n, e), s = Xi(0, a, i), l = new ot(o, s, n, a);
  return l;
}
function Vc(r, t, e, i) {
  var n = ((r || "") + "").split(`
`), a = n.length;
  if (a === 1)
    return zd(n[0], t, e, i);
  for (var o = new ot(0, 0, 0, 0), s = 0; s < n.length; s++) {
    var l = zd(n[s], t, e, i);
    s === 0 ? o.copy(l) : o.union(l);
  }
  return o;
}
function ea(r, t, e) {
  return e === "right" ? r -= t : e === "center" && (r -= t / 2), r;
}
function Xi(r, t, e) {
  return e === "middle" ? r -= t / 2 : e === "bottom" && (r -= t), r;
}
function Gc(r) {
  return re("国", r);
}
function Cr(r, t) {
  return typeof r == "string" ? r.lastIndexOf("%") >= 0 ? parseFloat(r) / 100 * t : parseFloat(r) : r;
}
function _s(r, t, e) {
  var i = t.position || "inside", n = t.distance != null ? t.distance : 5, a = e.height, o = e.width, s = a / 2, l = e.x, u = e.y, h = "left", c = "top";
  if (i instanceof Array)
    l += Cr(i[0], e.width), u += Cr(i[1], e.height), h = null, c = null;
  else
    switch (i) {
      case "left":
        l -= n, u += s, h = "right", c = "middle";
        break;
      case "right":
        l += n + o, u += s, c = "middle";
        break;
      case "top":
        l += o / 2, u -= n, h = "center", c = "bottom";
        break;
      case "bottom":
        l += o / 2, u += a + n, h = "center";
        break;
      case "inside":
        l += o / 2, u += s, h = "center", c = "middle";
        break;
      case "insideLeft":
        l += n, u += s, c = "middle";
        break;
      case "insideRight":
        l += o - n, u += s, h = "right", c = "middle";
        break;
      case "insideTop":
        l += o / 2, u += n, h = "center";
        break;
      case "insideBottom":
        l += o / 2, u += a - n, h = "center", c = "bottom";
        break;
      case "insideTopLeft":
        l += n, u += n;
        break;
      case "insideTopRight":
        l += o - n, u += n, h = "right";
        break;
      case "insideBottomLeft":
        l += n, u += a - n, c = "bottom";
        break;
      case "insideBottomRight":
        l += o - n, u += a - n, h = "right", c = "bottom";
        break;
    }
  return r = r || {}, r.x = l, r.y = u, r.align = h, r.verticalAlign = c, r;
}
var Wl = "__zr_normal__", Ul = Ia.concat(["ignore"]), Xx = yn(Ia, function(r, t) {
  return r[t] = !0, r;
}, { ignore: !1 }), Pi = {}, Zx = new ot(0, 0, 0, 0), Zs = function() {
  function r(t) {
    this.id = Xy(), this.animators = [], this.currentStates = [], this.states = {}, this._init(t);
  }
  return r.prototype._init = function(t) {
    this.attr(t);
  }, r.prototype.drift = function(t, e, i) {
    switch (this.draggable) {
      case "horizontal":
        e = 0;
        break;
      case "vertical":
        t = 0;
        break;
    }
    var n = this.transform;
    n || (n = this.transform = [1, 0, 0, 1, 0, 0]), n[4] += t, n[5] += e, this.decomposeTransform(), this.markRedraw();
  }, r.prototype.beforeUpdate = function() {
  }, r.prototype.afterUpdate = function() {
  }, r.prototype.update = function() {
    this.updateTransform(), this.__dirty && this.updateInnerText();
  }, r.prototype.updateInnerText = function(t) {
    var e = this._textContent;
    if (e && (!e.ignore || t)) {
      this.textConfig || (this.textConfig = {});
      var i = this.textConfig, n = i.local, a = e.innerTransformable, o = void 0, s = void 0, l = !1;
      a.parent = n ? this : null;
      var u = !1;
      if (a.copyTransform(e), i.position != null) {
        var h = Zx;
        i.layoutRect ? h.copy(i.layoutRect) : h.copy(this.getBoundingRect()), n || h.applyTransform(this.transform), this.calculateTextPosition ? this.calculateTextPosition(Pi, i, h) : _s(Pi, i, h), a.x = Pi.x, a.y = Pi.y, o = Pi.align, s = Pi.verticalAlign;
        var c = i.origin;
        if (c && i.rotation != null) {
          var f = void 0, d = void 0;
          c === "center" ? (f = h.width * 0.5, d = h.height * 0.5) : (f = Cr(c[0], h.width), d = Cr(c[1], h.height)), u = !0, a.originX = -a.x + f + (n ? 0 : h.x), a.originY = -a.y + d + (n ? 0 : h.y);
        }
      }
      i.rotation != null && (a.rotation = i.rotation);
      var v = i.offset;
      v && (a.x += v[0], a.y += v[1], u || (a.originX = -v[0], a.originY = -v[1]));
      var g = i.inside == null ? typeof i.position == "string" && i.position.indexOf("inside") >= 0 : i.inside, p = this._innerTextDefaultStyle || (this._innerTextDefaultStyle = {}), y = void 0, m = void 0, _ = void 0;
      g && this.canBeInsideText() ? (y = i.insideFill, m = i.insideStroke, (y == null || y === "auto") && (y = this.getInsideTextFill()), (m == null || m === "auto") && (m = this.getInsideTextStroke(y), _ = !0)) : (y = i.outsideFill, m = i.outsideStroke, (y == null || y === "auto") && (y = this.getOutsideFill()), (m == null || m === "auto") && (m = this.getOutsideStroke(y), _ = !0)), y = y || "#000", (y !== p.fill || m !== p.stroke || _ !== p.autoStroke || o !== p.align || s !== p.verticalAlign) && (l = !0, p.fill = y, p.stroke = m, p.autoStroke = _, p.align = o, p.verticalAlign = s, e.setDefaultTextStyle(p)), e.__dirty |= ee, l && e.dirtyStyle(!0);
    }
  }, r.prototype.canBeInsideText = function() {
    return !0;
  }, r.prototype.getInsideTextFill = function() {
    return "#fff";
  }, r.prototype.getInsideTextStroke = function(t) {
    return "#000";
  }, r.prototype.getOutsideFill = function() {
    return this.__zr && this.__zr.isDarkMode() ? _h : mh;
  }, r.prototype.getOutsideStroke = function(t) {
    var e = this.__zr && this.__zr.getBackgroundColor(), i = typeof e == "string" && ye(e);
    i || (i = [255, 255, 255, 1]);
    for (var n = i[3], a = this.__zr.isDarkMode(), o = 0; o < 3; o++)
      i[o] = i[o] * n + (a ? 0 : 255) * (1 - n);
    return i[3] = 1, er(i, "rgba");
  }, r.prototype.traverse = function(t, e) {
  }, r.prototype.attrKV = function(t, e) {
    t === "textConfig" ? this.setTextConfig(e) : t === "textContent" ? this.setTextContent(e) : t === "clipPath" ? this.setClipPath(e) : t === "extra" ? (this.extra = this.extra || {}, $(this.extra, e)) : this[t] = e;
  }, r.prototype.hide = function() {
    this.ignore = !0, this.markRedraw();
  }, r.prototype.show = function() {
    this.ignore = !1, this.markRedraw();
  }, r.prototype.attr = function(t, e) {
    if (typeof t == "string")
      this.attrKV(t, e);
    else if (U(t))
      for (var i = t, n = xt(i), a = 0; a < n.length; a++) {
        var o = n[a];
        this.attrKV(o, t[o]);
      }
    return this.markRedraw(), this;
  }, r.prototype.saveCurrentToNormalState = function(t) {
    this._innerSaveToNormal(t);
    for (var e = this._normalState, i = 0; i < this.animators.length; i++) {
      var n = this.animators[i], a = n.__fromStateTransition;
      if (!(n.getLoop() || a && a !== Wl)) {
        var o = n.targetName, s = o ? e[o] : e;
        n.saveTo(s);
      }
    }
  }, r.prototype._innerSaveToNormal = function(t) {
    var e = this._normalState;
    e || (e = this._normalState = {}), t.textConfig && !e.textConfig && (e.textConfig = this.textConfig), this._savePrimaryToNormal(t, e, Ul);
  }, r.prototype._savePrimaryToNormal = function(t, e, i) {
    for (var n = 0; n < i.length; n++) {
      var a = i[n];
      t[a] != null && !(a in e) && (e[a] = this[a]);
    }
  }, r.prototype.hasState = function() {
    return this.currentStates.length > 0;
  }, r.prototype.getState = function(t) {
    return this.states[t];
  }, r.prototype.ensureState = function(t) {
    var e = this.states;
    return e[t] || (e[t] = {}), e[t];
  }, r.prototype.clearStates = function(t) {
    this.useState(Wl, !1, t);
  }, r.prototype.useState = function(t, e, i, n) {
    var a = t === Wl, o = this.hasState();
    if (!(!o && a)) {
      var s = this.currentStates, l = this.stateTransition;
      if (!(rt(s, t) >= 0 && (e || s.length === 1))) {
        var u;
        if (this.stateProxy && !a && (u = this.stateProxy(t)), u || (u = this.states && this.states[t]), !u && !a) {
          Ec("State " + t + " not exists.");
          return;
        }
        a || this.saveCurrentToNormalState(u);
        var h = !!(u && u.hoverLayer || n);
        h && this._toggleHoverLayerFlag(!0), this._applyStateObj(t, u, this._normalState, e, !i && !this.__inHover && l && l.duration > 0, l);
        var c = this._textContent, f = this._textGuide;
        return c && c.useState(t, e, i, h), f && f.useState(t, e, i, h), a ? (this.currentStates = [], this._normalState = {}) : e ? this.currentStates.push(t) : this.currentStates = [t], this._updateAnimationTargets(), this.markRedraw(), !h && this.__inHover && (this._toggleHoverLayerFlag(!1), this.__dirty &= ~ee), u;
      }
    }
  }, r.prototype.useStates = function(t, e, i) {
    if (!t.length)
      this.clearStates();
    else {
      var n = [], a = this.currentStates, o = t.length, s = o === a.length;
      if (s) {
        for (var l = 0; l < o; l++)
          if (t[l] !== a[l]) {
            s = !1;
            break;
          }
      }
      if (s)
        return;
      for (var l = 0; l < o; l++) {
        var u = t[l], h = void 0;
        this.stateProxy && (h = this.stateProxy(u, t)), h || (h = this.states[u]), h && n.push(h);
      }
      var c = n[o - 1], f = !!(c && c.hoverLayer || i);
      f && this._toggleHoverLayerFlag(!0);
      var d = this._mergeStates(n), v = this.stateTransition;
      this.saveCurrentToNormalState(d), this._applyStateObj(t.join(","), d, this._normalState, !1, !e && !this.__inHover && v && v.duration > 0, v);
      var g = this._textContent, p = this._textGuide;
      g && g.useStates(t, e, f), p && p.useStates(t, e, f), this._updateAnimationTargets(), this.currentStates = t.slice(), this.markRedraw(), !f && this.__inHover && (this._toggleHoverLayerFlag(!1), this.__dirty &= ~ee);
    }
  }, r.prototype.isSilent = function() {
    for (var t = this.silent, e = this.parent; !t && e; ) {
      if (e.silent) {
        t = !0;
        break;
      }
      e = e.parent;
    }
    return t;
  }, r.prototype._updateAnimationTargets = function() {
    for (var t = 0; t < this.animators.length; t++) {
      var e = this.animators[t];
      e.targetName && e.changeTarget(this[e.targetName]);
    }
  }, r.prototype.removeState = function(t) {
    var e = rt(this.currentStates, t);
    if (e >= 0) {
      var i = this.currentStates.slice();
      i.splice(e, 1), this.useStates(i);
    }
  }, r.prototype.replaceState = function(t, e, i) {
    var n = this.currentStates.slice(), a = rt(n, t), o = rt(n, e) >= 0;
    a >= 0 ? o ? n.splice(a, 1) : n[a] = e : i && !o && n.push(e), this.useStates(n);
  }, r.prototype.toggleState = function(t, e) {
    e ? this.useState(t, !0) : this.removeState(t);
  }, r.prototype._mergeStates = function(t) {
    for (var e = {}, i, n = 0; n < t.length; n++) {
      var a = t[n];
      $(e, a), a.textConfig && (i = i || {}, $(i, a.textConfig));
    }
    return i && (e.textConfig = i), e;
  }, r.prototype._applyStateObj = function(t, e, i, n, a, o) {
    var s = !(e && n);
    e && e.textConfig ? (this.textConfig = $({}, n ? this.textConfig : i.textConfig), $(this.textConfig, e.textConfig)) : s && i.textConfig && (this.textConfig = i.textConfig);
    for (var l = {}, u = !1, h = 0; h < Ul.length; h++) {
      var c = Ul[h], f = a && Xx[c];
      e && e[c] != null ? f ? (u = !0, l[c] = e[c]) : this[c] = e[c] : s && i[c] != null && (f ? (u = !0, l[c] = i[c]) : this[c] = i[c]);
    }
    if (!a)
      for (var h = 0; h < this.animators.length; h++) {
        var d = this.animators[h], v = d.targetName;
        d.getLoop() || d.__changeFinalValue(v ? (e || i)[v] : e || i);
      }
    u && this._transitionState(t, l, o);
  }, r.prototype._attachComponent = function(t) {
    if (!(t.__zr && !t.__hostTarget) && t !== this) {
      var e = this.__zr;
      e && t.addSelfToZr(e), t.__zr = e, t.__hostTarget = this;
    }
  }, r.prototype._detachComponent = function(t) {
    t.__zr && t.removeSelfFromZr(t.__zr), t.__zr = null, t.__hostTarget = null;
  }, r.prototype.getClipPath = function() {
    return this._clipPath;
  }, r.prototype.setClipPath = function(t) {
    this._clipPath && this._clipPath !== t && this.removeClipPath(), this._attachComponent(t), this._clipPath = t, this.markRedraw();
  }, r.prototype.removeClipPath = function() {
    var t = this._clipPath;
    t && (this._detachComponent(t), this._clipPath = null, this.markRedraw());
  }, r.prototype.getTextContent = function() {
    return this._textContent;
  }, r.prototype.setTextContent = function(t) {
    var e = this._textContent;
    e !== t && (e && e !== t && this.removeTextContent(), t.innerTransformable = new Hc(), this._attachComponent(t), this._textContent = t, this.markRedraw());
  }, r.prototype.setTextConfig = function(t) {
    this.textConfig || (this.textConfig = {}), $(this.textConfig, t), this.markRedraw();
  }, r.prototype.removeTextConfig = function() {
    this.textConfig = null, this.markRedraw();
  }, r.prototype.removeTextContent = function() {
    var t = this._textContent;
    t && (t.innerTransformable = null, this._detachComponent(t), this._textContent = null, this._innerTextDefaultStyle = null, this.markRedraw());
  }, r.prototype.getTextGuideLine = function() {
    return this._textGuide;
  }, r.prototype.setTextGuideLine = function(t) {
    this._textGuide && this._textGuide !== t && this.removeTextGuideLine(), this._attachComponent(t), this._textGuide = t, this.markRedraw();
  }, r.prototype.removeTextGuideLine = function() {
    var t = this._textGuide;
    t && (this._detachComponent(t), this._textGuide = null, this.markRedraw());
  }, r.prototype.markRedraw = function() {
    this.__dirty |= ee;
    var t = this.__zr;
    t && (this.__inHover ? t.refreshHover() : t.refresh()), this.__hostTarget && this.__hostTarget.markRedraw();
  }, r.prototype.dirty = function() {
    this.markRedraw();
  }, r.prototype._toggleHoverLayerFlag = function(t) {
    this.__inHover = t;
    var e = this._textContent, i = this._textGuide;
    e && (e.__inHover = t), i && (i.__inHover = t);
  }, r.prototype.addSelfToZr = function(t) {
    if (this.__zr !== t) {
      this.__zr = t;
      var e = this.animators;
      if (e)
        for (var i = 0; i < e.length; i++)
          t.animation.addAnimator(e[i]);
      this._clipPath && this._clipPath.addSelfToZr(t), this._textContent && this._textContent.addSelfToZr(t), this._textGuide && this._textGuide.addSelfToZr(t);
    }
  }, r.prototype.removeSelfFromZr = function(t) {
    if (this.__zr) {
      this.__zr = null;
      var e = this.animators;
      if (e)
        for (var i = 0; i < e.length; i++)
          t.animation.removeAnimator(e[i]);
      this._clipPath && this._clipPath.removeSelfFromZr(t), this._textContent && this._textContent.removeSelfFromZr(t), this._textGuide && this._textGuide.removeSelfFromZr(t);
    }
  }, r.prototype.animate = function(t, e, i) {
    var n = t ? this[t] : this, a = new Fc(n, e, i);
    return t && (a.targetName = t), this.addAnimator(a, t), a;
  }, r.prototype.addAnimator = function(t, e) {
    var i = this.__zr, n = this;
    t.during(function() {
      n.updateDuringAnimation(e);
    }).done(function() {
      var a = n.animators, o = rt(a, t);
      o >= 0 && a.splice(o, 1);
    }), this.animators.push(t), i && i.animation.addAnimator(t), i && i.wakeUp();
  }, r.prototype.updateDuringAnimation = function(t) {
    this.markRedraw();
  }, r.prototype.stopAnimation = function(t, e) {
    for (var i = this.animators, n = i.length, a = [], o = 0; o < n; o++) {
      var s = i[o];
      !t || t === s.scope ? s.stop(e) : a.push(s);
    }
    return this.animators = a, this;
  }, r.prototype.animateTo = function(t, e, i) {
    Yl(this, t, e, i);
  }, r.prototype.animateFrom = function(t, e, i) {
    Yl(this, t, e, i, !0);
  }, r.prototype._transitionState = function(t, e, i, n) {
    for (var a = Yl(this, e, i, n), o = 0; o < a.length; o++)
      a[o].__fromStateTransition = t;
  }, r.prototype.getBoundingRect = function() {
    return null;
  }, r.prototype.getPaintRect = function() {
    return null;
  }, r.initDefaultProps = function() {
    var t = r.prototype;
    t.type = "element", t.name = "", t.ignore = t.silent = t.isGroup = t.draggable = t.dragging = t.ignoreClip = t.__inHover = !1, t.__dirty = ee;
    function e(i, n, a, o) {
      Object.defineProperty(t, i, {
        get: function() {
          if (!this[n]) {
            var l = this[n] = [];
            s(this, l);
          }
          return this[n];
        },
        set: function(l) {
          this[a] = l[0], this[o] = l[1], this[n] = l, s(this, l);
        }
      });
      function s(l, u) {
        Object.defineProperty(u, 0, {
          get: function() {
            return l[a];
          },
          set: function(h) {
            l[a] = h;
          }
        }), Object.defineProperty(u, 1, {
          get: function() {
            return l[o];
          },
          set: function(h) {
            l[o] = h;
          }
        });
      }
    }
    Object.defineProperty && (e("position", "_legacyPos", "x", "y"), e("scale", "_legacyScale", "scaleX", "scaleY"), e("origin", "_legacyOrigin", "originX", "originY"));
  }(), r;
}();
Le(Zs, be);
Le(Zs, Hc);
function Yl(r, t, e, i, n) {
  e = e || {};
  var a = [];
  dm(r, "", r, t, e, i, a, n);
  var o = a.length, s = !1, l = e.done, u = e.aborted, h = function() {
    s = !0, o--, o <= 0 && (s ? l && l() : u && u());
  }, c = function() {
    o--, o <= 0 && (s ? l && l() : u && u());
  };
  o || l && l(), a.length > 0 && e.during && a[0].during(function(v, g) {
    e.during(g);
  });
  for (var f = 0; f < a.length; f++) {
    var d = a[f];
    h && d.done(h), c && d.aborted(c), e.force && d.duration(e.duration), d.start(e.easing);
  }
  return a;
}
function Xl(r, t, e) {
  for (var i = 0; i < e; i++)
    r[i] = t[i];
}
function qx(r) {
  return qt(r[0]);
}
function Kx(r, t, e) {
  if (qt(t[e]))
    if (qt(r[e]) || (r[e] = []), Kt(t[e])) {
      var i = t[e].length;
      r[e].length !== i && (r[e] = new t[e].constructor(i), Xl(r[e], t[e], i));
    } else {
      var n = t[e], a = r[e], o = n.length;
      if (qx(n))
        for (var s = n[0].length, l = 0; l < o; l++)
          a[l] ? Xl(a[l], n[l], s) : a[l] = Array.prototype.slice.call(n[l]);
      else
        Xl(a, n, o);
      a.length = n.length;
    }
  else
    r[e] = t[e];
}
function jx(r, t) {
  return r === t || qt(r) && qt(t) && Qx(r, t);
}
function Qx(r, t) {
  var e = r.length;
  if (e !== t.length)
    return !1;
  for (var i = 0; i < e; i++)
    if (r[i] !== t[i])
      return !1;
  return !0;
}
function dm(r, t, e, i, n, a, o, s) {
  for (var l = xt(i), u = n.duration, h = n.delay, c = n.additive, f = n.setToFinal, d = !U(a), v = r.animators, g = [], p = 0; p < l.length; p++) {
    var y = l[p], m = i[y];
    if (m != null && e[y] != null && (d || a[y]))
      if (U(m) && !qt(m) && !Us(m)) {
        if (t) {
          s || (e[y] = m, r.updateDuringAnimation(t));
          continue;
        }
        dm(r, y, e[y], m, n, a && a[y], o, s);
      } else
        g.push(y);
    else s || (e[y] = m, r.updateDuringAnimation(t), g.push(y));
  }
  var _ = g.length;
  if (!c && _)
    for (var b = 0; b < v.length; b++) {
      var w = v[b];
      if (w.targetName === t) {
        var x = w.stopTracks(g);
        if (x) {
          var S = rt(v, w);
          v.splice(S, 1);
        }
      }
    }
  if (n.force || (g = Pt(g, function(C) {
    return !jx(i[C], e[C]);
  }), _ = g.length), _ > 0 || n.force && !o.length) {
    var A = void 0, M = void 0, D = void 0;
    if (s) {
      M = {}, f && (A = {});
      for (var b = 0; b < _; b++) {
        var y = g[b];
        M[y] = e[y], f ? A[y] = i[y] : e[y] = i[y];
      }
    } else if (f) {
      D = {};
      for (var b = 0; b < _; b++) {
        var y = g[b];
        D[y] = qo(e[y]), Kx(e, i, y);
      }
    }
    var w = new Fc(e, !1, !1, c ? Pt(v, function(I) {
      return I.targetName === t;
    }) : null);
    w.targetName = t, n.scope && (w.scope = n.scope), f && A && w.whenWithKeys(0, A, g), D && w.whenWithKeys(0, D, g), w.whenWithKeys(u ?? 500, s ? M : i, g).delay(h || 0), r.addAnimator(w, t), o.push(w);
  }
}
var St = function(r) {
  N(t, r);
  function t(e) {
    var i = r.call(this) || this;
    return i.isGroup = !0, i._children = [], i.attr(e), i;
  }
  return t.prototype.childrenRef = function() {
    return this._children;
  }, t.prototype.children = function() {
    return this._children.slice();
  }, t.prototype.childAt = function(e) {
    return this._children[e];
  }, t.prototype.childOfName = function(e) {
    for (var i = this._children, n = 0; n < i.length; n++)
      if (i[n].name === e)
        return i[n];
  }, t.prototype.childCount = function() {
    return this._children.length;
  }, t.prototype.add = function(e) {
    return e && e !== this && e.parent !== this && (this._children.push(e), this._doAdd(e)), this;
  }, t.prototype.addBefore = function(e, i) {
    if (e && e !== this && e.parent !== this && i && i.parent === this) {
      var n = this._children, a = n.indexOf(i);
      a >= 0 && (n.splice(a, 0, e), this._doAdd(e));
    }
    return this;
  }, t.prototype.replace = function(e, i) {
    var n = rt(this._children, e);
    return n >= 0 && this.replaceAt(i, n), this;
  }, t.prototype.replaceAt = function(e, i) {
    var n = this._children, a = n[i];
    if (e && e !== this && e.parent !== this && e !== a) {
      n[i] = e, a.parent = null;
      var o = this.__zr;
      o && a.removeSelfFromZr(o), this._doAdd(e);
    }
    return this;
  }, t.prototype._doAdd = function(e) {
    e.parent && e.parent.remove(e), e.parent = this;
    var i = this.__zr;
    i && i !== e.__zr && e.addSelfToZr(i), i && i.refresh();
  }, t.prototype.remove = function(e) {
    var i = this.__zr, n = this._children, a = rt(n, e);
    return a < 0 ? this : (n.splice(a, 1), e.parent = null, i && e.removeSelfFromZr(i), i && i.refresh(), this);
  }, t.prototype.removeAll = function() {
    for (var e = this._children, i = this.__zr, n = 0; n < e.length; n++) {
      var a = e[n];
      i && a.removeSelfFromZr(i), a.parent = null;
    }
    return e.length = 0, this;
  }, t.prototype.eachChild = function(e, i) {
    for (var n = this._children, a = 0; a < n.length; a++) {
      var o = n[a];
      e.call(i, o, a);
    }
    return this;
  }, t.prototype.traverse = function(e, i) {
    for (var n = 0; n < this._children.length; n++) {
      var a = this._children[n], o = e.call(i, a);
      a.isGroup && !o && a.traverse(e, i);
    }
    return this;
  }, t.prototype.addSelfToZr = function(e) {
    r.prototype.addSelfToZr.call(this, e);
    for (var i = 0; i < this._children.length; i++) {
      var n = this._children[i];
      n.addSelfToZr(e);
    }
  }, t.prototype.removeSelfFromZr = function(e) {
    r.prototype.removeSelfFromZr.call(this, e);
    for (var i = 0; i < this._children.length; i++) {
      var n = this._children[i];
      n.removeSelfFromZr(e);
    }
  }, t.prototype.getBoundingRect = function(e) {
    for (var i = new ot(0, 0, 0, 0), n = e || this._children, a = [], o = null, s = 0; s < n.length; s++) {
      var l = n[s];
      if (!(l.ignore || l.invisible)) {
        var u = l.getBoundingRect(), h = l.getLocalTransform(a);
        h ? (ot.applyTransform(i, u, h), o = o || i.clone(), o.union(i)) : (o = o || u.clone(), o.union(u));
      }
    }
    return o || i;
  }, t;
}(Zs);
St.prototype.type = "group";
/*!
* ZRender, a high performance 2d drawing library.
*
* Copyright (c) 2013, Baidu Inc.
* All rights reserved.
*
* LICENSE
* https://github.com/ecomfe/zrender/blob/master/LICENSE.txt
*/
var Jo = {}, vm = {};
function Jx(r) {
  delete vm[r];
}
function tw(r) {
  if (!r)
    return !1;
  if (typeof r == "string")
    return ys(r, 1) < yh;
  if (r.colorStops) {
    for (var t = r.colorStops, e = 0, i = t.length, n = 0; n < i; n++)
      e += ys(t[n].color, 1);
    return e /= i, e < yh;
  }
  return !1;
}
var ew = function() {
  function r(t, e, i) {
    var n = this;
    this._sleepAfterStill = 10, this._stillFrameAccum = 0, this._needsRefresh = !0, this._needsRefreshHover = !0, this._darkMode = !1, i = i || {}, this.dom = e, this.id = t;
    var a = new yx(), o = i.renderer || "canvas";
    Jo[o] || (o = xt(Jo)[0]), i.useDirtyRect = i.useDirtyRect == null ? !1 : i.useDirtyRect;
    var s = new Jo[o](e, a, i, t), l = i.ssr || s.ssrOnly;
    this.storage = a, this.painter = s;
    var u = !j.node && !j.worker && !l ? new Wx(s.getViewportRoot(), s.root) : null, h = i.useCoarsePointer, c = h == null || h === "auto" ? j.touchEventsSupported : !!h, f = 44, d;
    c && (d = st(i.pointerSize, f)), this.handler = new tm(a, s, u, s.root, d), this.animation = new Nx({
      stage: {
        update: l ? null : function() {
          return n._flush(!0);
        }
      }
    }), l || this.animation.start();
  }
  return r.prototype.add = function(t) {
    this._disposed || !t || (this.storage.addRoot(t), t.addSelfToZr(this), this.refresh());
  }, r.prototype.remove = function(t) {
    this._disposed || !t || (this.storage.delRoot(t), t.removeSelfFromZr(this), this.refresh());
  }, r.prototype.configLayer = function(t, e) {
    this._disposed || (this.painter.configLayer && this.painter.configLayer(t, e), this.refresh());
  }, r.prototype.setBackgroundColor = function(t) {
    this._disposed || (this.painter.setBackgroundColor && this.painter.setBackgroundColor(t), this.refresh(), this._backgroundColor = t, this._darkMode = tw(t));
  }, r.prototype.getBackgroundColor = function() {
    return this._backgroundColor;
  }, r.prototype.setDarkMode = function(t) {
    this._darkMode = t;
  }, r.prototype.isDarkMode = function() {
    return this._darkMode;
  }, r.prototype.refreshImmediately = function(t) {
    this._disposed || (t || this.animation.update(!0), this._needsRefresh = !1, this.painter.refresh(), this._needsRefresh = !1);
  }, r.prototype.refresh = function() {
    this._disposed || (this._needsRefresh = !0, this.animation.start());
  }, r.prototype.flush = function() {
    this._disposed || this._flush(!1);
  }, r.prototype._flush = function(t) {
    var e, i = Ki();
    this._needsRefresh && (e = !0, this.refreshImmediately(t)), this._needsRefreshHover && (e = !0, this.refreshHoverImmediately());
    var n = Ki();
    e ? (this._stillFrameAccum = 0, this.trigger("rendered", {
      elapsedTime: n - i
    })) : this._sleepAfterStill > 0 && (this._stillFrameAccum++, this._stillFrameAccum > this._sleepAfterStill && this.animation.stop());
  }, r.prototype.setSleepAfterStill = function(t) {
    this._sleepAfterStill = t;
  }, r.prototype.wakeUp = function() {
    this._disposed || (this.animation.start(), this._stillFrameAccum = 0);
  }, r.prototype.refreshHover = function() {
    this._needsRefreshHover = !0;
  }, r.prototype.refreshHoverImmediately = function() {
    this._disposed || (this._needsRefreshHover = !1, this.painter.refreshHover && this.painter.getType() === "canvas" && this.painter.refreshHover());
  }, r.prototype.resize = function(t) {
    this._disposed || (t = t || {}, this.painter.resize(t.width, t.height), this.handler.resize());
  }, r.prototype.clearAnimation = function() {
    this._disposed || this.animation.clear();
  }, r.prototype.getWidth = function() {
    if (!this._disposed)
      return this.painter.getWidth();
  }, r.prototype.getHeight = function() {
    if (!this._disposed)
      return this.painter.getHeight();
  }, r.prototype.setCursorStyle = function(t) {
    this._disposed || this.handler.setCursorStyle(t);
  }, r.prototype.findHover = function(t, e) {
    if (!this._disposed)
      return this.handler.findHover(t, e);
  }, r.prototype.on = function(t, e, i) {
    return this._disposed || this.handler.on(t, e, i), this;
  }, r.prototype.off = function(t, e) {
    this._disposed || this.handler.off(t, e);
  }, r.prototype.trigger = function(t, e) {
    this._disposed || this.handler.trigger(t, e);
  }, r.prototype.clear = function() {
    if (!this._disposed) {
      for (var t = this.storage.getRoots(), e = 0; e < t.length; e++)
        t[e] instanceof St && t[e].removeSelfFromZr(this);
      this.storage.delAllRoots(), this.painter.clear();
    }
  }, r.prototype.dispose = function() {
    this._disposed || (this.animation.stop(), this.clear(), this.storage.dispose(), this.painter.dispose(), this.handler.dispose(), this.animation = this.storage = this.painter = this.handler = null, this._disposed = !0, Jx(this.id));
  }, r;
}();
function Fd(r, t) {
  var e = new ew(Xy(), r, t);
  return vm[e.id] = e, e;
}
function rw(r, t) {
  Jo[r] = t;
}
var Hd = 1e-4, pm = 20;
function iw(r) {
  return r.replace(/^\s+|\s+$/g, "");
}
function mi(r, t, e, i) {
  var n = t[0], a = t[1], o = e[0], s = e[1], l = a - n, u = s - o;
  if (l === 0)
    return u === 0 ? o : (o + s) / 2;
  if (i)
    if (l > 0) {
      if (r <= n)
        return o;
      if (r >= a)
        return s;
    } else {
      if (r >= n)
        return o;
      if (r <= a)
        return s;
    }
  else {
    if (r === n)
      return o;
    if (r === a)
      return s;
  }
  return (r - n) / l * u + o;
}
function Ct(r, t) {
  switch (r) {
    case "center":
    case "middle":
      r = "50%";
      break;
    case "left":
    case "top":
      r = "0%";
      break;
    case "right":
    case "bottom":
      r = "100%";
      break;
  }
  return V(r) ? iw(r).match(/%$/) ? parseFloat(r) / 100 * t : parseFloat(r) : r == null ? NaN : +r;
}
function Lt(r, t, e) {
  return t == null && (t = 10), t = Math.min(Math.max(0, t), pm), r = (+r).toFixed(t), e ? r : +r;
}
function Vd(r) {
  return r.sort(function(t, e) {
    return t - e;
  }), r;
}
function Fe(r) {
  if (r = +r, isNaN(r))
    return 0;
  if (r > 1e-14) {
    for (var t = 1, e = 0; e < 15; e++, t *= 10)
      if (Math.round(r * t) / t === r)
        return e;
  }
  return nw(r);
}
function nw(r) {
  var t = r.toString().toLowerCase(), e = t.indexOf("e"), i = e > 0 ? +t.slice(e + 1) : 0, n = e > 0 ? e : t.length, a = t.indexOf("."), o = a < 0 ? 0 : n - 1 - a;
  return Math.max(0, o - i);
}
function aw(r, t) {
  var e = Math.log, i = Math.LN10, n = Math.floor(e(r[1] - r[0]) / i), a = Math.round(e(Math.abs(t[1] - t[0])) / i), o = Math.min(Math.max(-n + a, 0), 20);
  return isFinite(o) ? o : 20;
}
function ow(r, t) {
  var e = Math.max(Fe(r), Fe(t)), i = r + t;
  return e > pm ? i : Lt(i, e);
}
var Gd = 9007199254740991;
function gm(r) {
  var t = Math.PI * 2;
  return (r % t + t) % t;
}
function bs(r) {
  return r > -Hd && r < Hd;
}
var sw = /^(?:(\d{4})(?:[-\/](\d{1,2})(?:[-\/](\d{1,2})(?:[T ](\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[.,](\d+))?)?)?(Z|[\+\-]\d\d:?\d\d)?)?)?)?)?$/;
function rr(r) {
  if (r instanceof Date)
    return r;
  if (V(r)) {
    var t = sw.exec(r);
    if (!t)
      return /* @__PURE__ */ new Date(NaN);
    if (t[8]) {
      var e = +t[4] || 0;
      return t[8].toUpperCase() !== "Z" && (e -= +t[8].slice(0, 3)), new Date(Date.UTC(+t[1], +(t[2] || 1) - 1, +t[3] || 1, e, +(t[5] || 0), +t[6] || 0, t[7] ? +t[7].substring(0, 3) : 0));
    } else
      return new Date(+t[1], +(t[2] || 1) - 1, +t[3] || 1, +t[4] || 0, +(t[5] || 0), +t[6] || 0, t[7] ? +t[7].substring(0, 3) : 0);
  } else if (r == null)
    return /* @__PURE__ */ new Date(NaN);
  return new Date(Math.round(r));
}
function lw(r) {
  return Math.pow(10, Wc(r));
}
function Wc(r) {
  if (r === 0)
    return 0;
  var t = Math.floor(Math.log(r) / Math.LN10);
  return r / Math.pow(10, t) >= 10 && t++, t;
}
function ym(r, t) {
  var e = Wc(r), i = Math.pow(10, e), n = r / i, a;
  return n < 1.5 ? a = 1 : n < 2.5 ? a = 2 : n < 4 ? a = 3 : n < 7 ? a = 5 : a = 10, r = a * i, e >= -20 ? +r.toFixed(e < 0 ? -e : 0) : r;
}
function xs(r) {
  var t = parseFloat(r);
  return t == r && (t !== 0 || !V(r) || r.indexOf("x") <= 0) ? t : NaN;
}
function uw(r) {
  return !isNaN(xs(r));
}
function mm() {
  return Math.round(Math.random() * 9);
}
function _m(r, t) {
  return t === 0 ? r : _m(t, r % t);
}
function Wd(r, t) {
  return r == null ? t : t == null ? r : r * t / _m(r, t);
}
function Xt(r) {
  throw new Error(r);
}
function Ud(r, t, e) {
  return (t - r) * e + r;
}
var bm = "series\0", hw = "\0_ec_\0";
function Rt(r) {
  return r instanceof Array ? r : r == null ? [] : [r];
}
function bh(r, t, e) {
  if (r) {
    r[t] = r[t] || {}, r.emphasis = r.emphasis || {}, r.emphasis[t] = r.emphasis[t] || {};
    for (var i = 0, n = e.length; i < n; i++) {
      var a = e[i];
      !r.emphasis[t].hasOwnProperty(a) && r[t].hasOwnProperty(a) && (r.emphasis[t][a] = r[t][a]);
    }
  }
}
var Yd = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "rich", "tag", "color", "textBorderColor", "textBorderWidth", "width", "height", "lineHeight", "align", "verticalAlign", "baseline", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY", "textShadowColor", "textShadowBlur", "textShadowOffsetX", "textShadowOffsetY", "backgroundColor", "borderColor", "borderWidth", "borderRadius", "padding"];
function Za(r) {
  return U(r) && !B(r) && !(r instanceof Date) ? r.value : r;
}
function cw(r) {
  return U(r) && !(r instanceof Array);
}
function fw(r, t, e) {
  var i = e === "normalMerge", n = e === "replaceMerge", a = e === "replaceAll";
  r = r || [], t = (t || []).slice();
  var o = tt();
  T(t, function(l, u) {
    if (!U(l)) {
      t[u] = null;
      return;
    }
  });
  var s = dw(r, o, e);
  return (i || n) && vw(s, r, o, t), i && pw(s, t), i || n ? gw(s, t, n) : a && yw(s, t), mw(s), s;
}
function dw(r, t, e) {
  var i = [];
  if (e === "replaceAll")
    return i;
  for (var n = 0; n < r.length; n++) {
    var a = r[n];
    a && a.id != null && t.set(a.id, n), i.push({
      existing: e === "replaceMerge" || La(a) ? null : a,
      newOption: null,
      keyInfo: null,
      brandNew: null
    });
  }
  return i;
}
function vw(r, t, e, i) {
  T(i, function(n, a) {
    if (!(!n || n.id == null)) {
      var o = da(n.id), s = e.get(o);
      if (s != null) {
        var l = r[s];
        ke(!l.newOption, 'Duplicated option on id "' + o + '".'), l.newOption = n, l.existing = t[s], i[a] = null;
      }
    }
  });
}
function pw(r, t) {
  T(t, function(e, i) {
    if (!(!e || e.name == null))
      for (var n = 0; n < r.length; n++) {
        var a = r[n].existing;
        if (!r[n].newOption && a && (a.id == null || e.id == null) && !La(e) && !La(a) && xm("name", a, e)) {
          r[n].newOption = e, t[i] = null;
          return;
        }
      }
  });
}
function gw(r, t, e) {
  T(t, function(i) {
    if (i) {
      for (
        var n, a = 0;
        // Be `!resultItem` only when `nextIdx >= result.length`.
        (n = r[a]) && (n.newOption || La(n.existing) || // In mode "replaceMerge", here no not-mapped-non-internal-existing.
        n.existing && i.id != null && !xm("id", i, n.existing));
      )
        a++;
      n ? (n.newOption = i, n.brandNew = e) : r.push({
        newOption: i,
        brandNew: e,
        existing: null,
        keyInfo: null
      }), a++;
    }
  });
}
function yw(r, t) {
  T(t, function(e) {
    r.push({
      newOption: e,
      brandNew: !0,
      existing: null,
      keyInfo: null
    });
  });
}
function mw(r) {
  var t = tt();
  T(r, function(e) {
    var i = e.existing;
    i && t.set(i.id, e);
  }), T(r, function(e) {
    var i = e.newOption;
    ke(!i || i.id == null || !t.get(i.id) || t.get(i.id) === e, "id duplicates: " + (i && i.id)), i && i.id != null && t.set(i.id, e), !e.keyInfo && (e.keyInfo = {});
  }), T(r, function(e, i) {
    var n = e.existing, a = e.newOption, o = e.keyInfo;
    if (U(a)) {
      if (o.name = a.name != null ? da(a.name) : n ? n.name : bm + i, n)
        o.id = da(n.id);
      else if (a.id != null)
        o.id = da(a.id);
      else {
        var s = 0;
        do
          o.id = "\0" + o.name + "\0" + s++;
        while (t.get(o.id));
      }
      t.set(o.id, e);
    }
  });
}
function xm(r, t, e) {
  var i = ie(t[r], null), n = ie(e[r], null);
  return i != null && n != null && i === n;
}
function da(r) {
  return ie(r, "");
}
function ie(r, t) {
  return r == null ? t : V(r) ? r : wt(r) || ah(r) ? r + "" : t;
}
function Uc(r) {
  var t = r.name;
  return !!(t && t.indexOf(bm));
}
function La(r) {
  return r && r.id != null && da(r.id).indexOf(hw) === 0;
}
function _w(r, t, e) {
  T(r, function(i) {
    var n = i.newOption;
    U(n) && (i.keyInfo.mainType = t, i.keyInfo.subType = bw(t, n, i.existing, e));
  });
}
function bw(r, t, e, i) {
  var n = t.type ? t.type : e ? e.subType : i.determineSubType(r, t);
  return n;
}
function _i(r, t) {
  if (t.dataIndexInside != null)
    return t.dataIndexInside;
  if (t.dataIndex != null)
    return B(t.dataIndex) ? H(t.dataIndex, function(e) {
      return r.indexOfRawIndex(e);
    }) : r.indexOfRawIndex(t.dataIndex);
  if (t.name != null)
    return B(t.name) ? H(t.name, function(e) {
      return r.indexOfName(e);
    }) : r.indexOfName(t.name);
}
function Tt() {
  var r = "__ec_inner_" + xw++;
  return function(t) {
    return t[r] || (t[r] = {});
  };
}
var xw = mm();
function ts(r, t, e) {
  var i = Yc(t, e), n = i.mainTypeSpecified, a = i.queryOptionMap, o = i.others, s = o, l = e ? e.defaultMainType : null;
  return !n && l && a.set(l, {}), a.each(function(u, h) {
    var c = qa(r, h, u, {
      useDefault: l === h,
      enableAll: e && e.enableAll != null ? e.enableAll : !0,
      enableNone: e && e.enableNone != null ? e.enableNone : !0
    });
    s[h + "Models"] = c.models, s[h + "Model"] = c.models[0];
  }), s;
}
function Yc(r, t) {
  var e;
  if (V(r)) {
    var i = {};
    i[r + "Index"] = 0, e = i;
  } else
    e = r;
  var n = tt(), a = {}, o = !1;
  return T(e, function(s, l) {
    if (l === "dataIndex" || l === "dataIndexInside") {
      a[l] = s;
      return;
    }
    var u = l.match(/^(\w+)(Index|Id|Name)$/) || [], h = u[1], c = (u[2] || "").toLowerCase();
    if (!(!h || !c || t && t.includeMainTypes && rt(t.includeMainTypes, h) < 0)) {
      o = o || !!h;
      var f = n.get(h) || n.set(h, {});
      f[c] = s;
    }
  }), {
    mainTypeSpecified: o,
    queryOptionMap: n,
    others: a
  };
}
var Me = {
  useDefault: !0,
  enableAll: !1,
  enableNone: !1
};
function qa(r, t, e, i) {
  i = i || Me;
  var n = e.index, a = e.id, o = e.name, s = {
    models: null,
    specified: n != null || a != null || o != null
  };
  if (!s.specified) {
    var l = void 0;
    return s.models = i.useDefault && (l = r.getComponent(t)) ? [l] : [], s;
  }
  return n === "none" || n === !1 ? (ke(i.enableNone, '`"none"` or `false` is not a valid value on index option.'), s.models = [], s) : (n === "all" && (ke(i.enableAll, '`"all"` is not a valid value on index option.'), n = a = o = null), s.models = r.queryComponents({
    mainType: t,
    index: n,
    id: a,
    name: o
  }), s);
}
function wm(r, t, e) {
  r.setAttribute ? r.setAttribute(t, e) : r[t] = e;
}
function ww(r, t) {
  return r.getAttribute ? r.getAttribute(t) : r[t];
}
function Sw(r) {
  return r === "auto" ? j.domSupported ? "html" : "richText" : r || "html";
}
function Tw(r, t, e, i, n) {
  var a = t == null || t === "auto";
  if (i == null)
    return i;
  if (wt(i)) {
    var o = Ud(e || 0, i, n);
    return Lt(o, a ? Math.max(Fe(e || 0), Fe(i)) : t);
  } else {
    if (V(i))
      return n < 1 ? e : i;
    for (var s = [], l = e, u = i, h = Math.max(l ? l.length : 0, u.length), c = 0; c < h; ++c) {
      var f = r.getDimensionInfo(c);
      if (f && f.type === "ordinal")
        s[c] = (n < 1 && l ? l : u)[c];
      else {
        var d = l && l[c] ? l[c] : 0, v = u[c], o = Ud(d, v, n);
        s[c] = Lt(o, a ? Math.max(Fe(d), Fe(v)) : t);
      }
    }
    return s;
  }
}
var Cw = ".", zr = "___EC__COMPONENT__CONTAINER___", Sm = "___EC__EXTENDED_CLASS___";
function He(r) {
  var t = {
    main: "",
    sub: ""
  };
  if (r) {
    var e = r.split(Cw);
    t.main = e[0] || "", t.sub = e[1] || "";
  }
  return t;
}
function Aw(r) {
  ke(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)?$/.test(r), 'componentType "' + r + '" illegal');
}
function Mw(r) {
  return !!(r && r[Sm]);
}
function Xc(r, t) {
  r.$constructor = r, r.extend = function(e) {
    var i = this, n;
    return Dw(i) ? n = /** @class */
    function(a) {
      N(o, a);
      function o() {
        return a.apply(this, arguments) || this;
      }
      return o;
    }(i) : (n = function() {
      (e.$constructor || i).apply(this, arguments);
    }, E1(n, this)), $(n.prototype, e), n[Sm] = !0, n.extend = this.extend, n.superCall = Lw, n.superApply = Pw, n.superClass = i, n;
  };
}
function Dw(r) {
  return Q(r) && /^class\s/.test(Function.prototype.toString.call(r));
}
function Tm(r, t) {
  r.extend = t.extend;
}
var kw = Math.round(Math.random() * 10);
function Iw(r) {
  var t = ["__\0is_clz", kw++].join("_");
  r.prototype[t] = !0, r.isInstance = function(e) {
    return !!(e && e[t]);
  };
}
function Lw(r, t) {
  for (var e = [], i = 2; i < arguments.length; i++)
    e[i - 2] = arguments[i];
  return this.superClass.prototype[t].apply(r, e);
}
function Pw(r, t, e) {
  return this.superClass.prototype[t].apply(r, e);
}
function qs(r) {
  var t = {};
  r.registerClass = function(i) {
    var n = i.type || i.prototype.type;
    if (n) {
      Aw(n), i.prototype.type = n;
      var a = He(n);
      if (!a.sub)
        t[a.main] = i;
      else if (a.sub !== zr) {
        var o = e(a);
        o[a.sub] = i;
      }
    }
    return i;
  }, r.getClass = function(i, n, a) {
    var o = t[i];
    if (o && o[zr] && (o = n ? o[n] : null), a && !o)
      throw new Error(n ? "Component " + i + "." + (n || "") + " is used but not imported." : i + ".type should be specified.");
    return o;
  }, r.getClassesByMainType = function(i) {
    var n = He(i), a = [], o = t[n.main];
    return o && o[zr] ? T(o, function(s, l) {
      l !== zr && a.push(s);
    }) : a.push(o), a;
  }, r.hasClass = function(i) {
    var n = He(i);
    return !!t[n.main];
  }, r.getAllClassMainTypes = function() {
    var i = [];
    return T(t, function(n, a) {
      i.push(a);
    }), i;
  }, r.hasSubTypes = function(i) {
    var n = He(i), a = t[n.main];
    return a && a[zr];
  };
  function e(i) {
    var n = t[i.main];
    return (!n || !n[zr]) && (n = t[i.main] = {}, n[zr] = !0), n;
  }
}
function un(r, t) {
  for (var e = 0; e < r.length; e++)
    r[e][1] || (r[e][1] = r[e][0]);
  return t = t || !1, function(i, n, a) {
    for (var o = {}, s = 0; s < r.length; s++) {
      var l = r[s][1];
      if (!(n && rt(n, l) >= 0 || a && rt(a, l) < 0)) {
        var u = i.getShallow(l, t);
        u != null && (o[r[s][0]] = u);
      }
    }
    return o;
  };
}
var Ew = [
  ["fill", "color"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["opacity"],
  ["shadowColor"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
], Rw = un(Ew), $w = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.getAreaStyle = function(t, e) {
      return Rw(this, t, e);
    }, r;
  }()
), xh = new Xa(50);
function Ow(r) {
  if (typeof r == "string") {
    var t = xh.get(r);
    return t && t.image;
  } else
    return r;
}
function Cm(r, t, e, i, n) {
  if (r)
    if (typeof r == "string") {
      if (t && t.__zrImageSrc === r || !e)
        return t;
      var a = xh.get(r), o = { hostEl: e, cb: i, cbPayload: n };
      return a ? (t = a.image, !Ks(t) && a.pending.push(o)) : (t = gn.loadImage(r, Xd, Xd), t.__zrImageSrc = r, xh.put(r, t.__cachedImgObj = {
        image: t,
        pending: [o]
      })), t;
    } else
      return r;
  else return t;
}
function Xd() {
  var r = this.__cachedImgObj;
  this.onload = this.onerror = this.__cachedImgObj = null;
  for (var t = 0; t < r.pending.length; t++) {
    var e = r.pending[t], i = e.cb;
    i && i(this, e.cbPayload), e.hostEl.dirty();
  }
  r.pending.length = 0;
}
function Ks(r) {
  return r && r.width && r.height;
}
var Zl = /\{([a-zA-Z0-9_]+)\|([^}]*)\}/g;
function Nw(r, t, e, i, n, a) {
  if (!e) {
    r.text = "", r.isTruncated = !1;
    return;
  }
  var o = (t + "").split(`
`);
  a = Am(e, i, n, a);
  for (var s = !1, l = {}, u = 0, h = o.length; u < h; u++)
    Mm(l, o[u], a), o[u] = l.textLine, s = s || l.isTruncated;
  r.text = o.join(`
`), r.isTruncated = s;
}
function Am(r, t, e, i) {
  i = i || {};
  var n = $({}, i);
  n.font = t, e = st(e, "..."), n.maxIterations = st(i.maxIterations, 2);
  var a = n.minChar = st(i.minChar, 0);
  n.cnCharWidth = re("国", t);
  var o = n.ascCharWidth = re("a", t);
  n.placeholder = st(i.placeholder, "");
  for (var s = r = Math.max(0, r - 1), l = 0; l < a && s >= o; l++)
    s -= o;
  var u = re(e, t);
  return u > s && (e = "", u = 0), s = r - u, n.ellipsis = e, n.ellipsisWidth = u, n.contentWidth = s, n.containerWidth = r, n;
}
function Mm(r, t, e) {
  var i = e.containerWidth, n = e.font, a = e.contentWidth;
  if (!i) {
    r.textLine = "", r.isTruncated = !1;
    return;
  }
  var o = re(t, n);
  if (o <= i) {
    r.textLine = t, r.isTruncated = !1;
    return;
  }
  for (var s = 0; ; s++) {
    if (o <= a || s >= e.maxIterations) {
      t += e.ellipsis;
      break;
    }
    var l = s === 0 ? Bw(t, a, e.ascCharWidth, e.cnCharWidth) : o > 0 ? Math.floor(t.length * a / o) : 0;
    t = t.substr(0, l), o = re(t, n);
  }
  t === "" && (t = e.placeholder), r.textLine = t, r.isTruncated = !0;
}
function Bw(r, t, e, i) {
  for (var n = 0, a = 0, o = r.length; a < o && n < t; a++) {
    var s = r.charCodeAt(a);
    n += 0 <= s && s <= 127 ? e : i;
  }
  return a;
}
function zw(r, t) {
  r != null && (r += "");
  var e = t.overflow, i = t.padding, n = t.font, a = e === "truncate", o = Gc(n), s = st(t.lineHeight, o), l = !!t.backgroundColor, u = t.lineOverflow === "truncate", h = !1, c = t.width, f;
  c != null && (e === "break" || e === "breakAll") ? f = r ? Dm(r, t.font, c, e === "breakAll", 0).lines : [] : f = r ? r.split(`
`) : [];
  var d = f.length * s, v = st(t.height, d);
  if (d > v && u) {
    var g = Math.floor(v / s);
    h = h || f.length > g, f = f.slice(0, g);
  }
  if (r && a && c != null)
    for (var p = Am(c, n, t.ellipsis, {
      minChar: t.truncateMinChar,
      placeholder: t.placeholder
    }), y = {}, m = 0; m < f.length; m++)
      Mm(y, f[m], p), f[m] = y.textLine, h = h || y.isTruncated;
  for (var _ = v, b = 0, m = 0; m < f.length; m++)
    b = Math.max(re(f[m], n), b);
  c == null && (c = b);
  var w = b;
  return i && (_ += i[0] + i[2], w += i[1] + i[3], c += i[1] + i[3]), l && (w = c), {
    lines: f,
    height: v,
    outerWidth: w,
    outerHeight: _,
    lineHeight: s,
    calculatedLineHeight: o,
    contentWidth: b,
    contentHeight: d,
    width: c,
    isTruncated: h
  };
}
var Fw = /* @__PURE__ */ function() {
  function r() {
  }
  return r;
}(), Zd = /* @__PURE__ */ function() {
  function r(t) {
    this.tokens = [], t && (this.tokens = t);
  }
  return r;
}(), Hw = /* @__PURE__ */ function() {
  function r() {
    this.width = 0, this.height = 0, this.contentWidth = 0, this.contentHeight = 0, this.outerWidth = 0, this.outerHeight = 0, this.lines = [], this.isTruncated = !1;
  }
  return r;
}();
function Vw(r, t) {
  var e = new Hw();
  if (r != null && (r += ""), !r)
    return e;
  for (var i = t.width, n = t.height, a = t.overflow, o = (a === "break" || a === "breakAll") && i != null ? { width: i, accumWidth: 0, breakAll: a === "breakAll" } : null, s = Zl.lastIndex = 0, l; (l = Zl.exec(r)) != null; ) {
    var u = l.index;
    u > s && ql(e, r.substring(s, u), t, o), ql(e, l[2], t, o, l[1]), s = Zl.lastIndex;
  }
  s < r.length && ql(e, r.substring(s, r.length), t, o);
  var h = [], c = 0, f = 0, d = t.padding, v = a === "truncate", g = t.lineOverflow === "truncate", p = {};
  function y(Z, J, it) {
    Z.width = J, Z.lineHeight = it, c += it, f = Math.max(f, J);
  }
  t: for (var m = 0; m < e.lines.length; m++) {
    for (var _ = e.lines[m], b = 0, w = 0, x = 0; x < _.tokens.length; x++) {
      var S = _.tokens[x], A = S.styleName && t.rich[S.styleName] || {}, M = S.textPadding = A.padding, D = M ? M[1] + M[3] : 0, C = S.font = A.font || t.font;
      S.contentHeight = Gc(C);
      var I = st(A.height, S.contentHeight);
      if (S.innerHeight = I, M && (I += M[0] + M[2]), S.height = I, S.lineHeight = Xo(A.lineHeight, t.lineHeight, I), S.align = A && A.align || t.align, S.verticalAlign = A && A.verticalAlign || "middle", g && n != null && c + S.lineHeight > n) {
        var L = e.lines.length;
        x > 0 ? (_.tokens = _.tokens.slice(0, x), y(_, w, b), e.lines = e.lines.slice(0, m + 1)) : e.lines = e.lines.slice(0, m), e.isTruncated = e.isTruncated || e.lines.length < L;
        break t;
      }
      var P = A.width, E = P == null || P === "auto";
      if (typeof P == "string" && P.charAt(P.length - 1) === "%")
        S.percentWidth = P, h.push(S), S.contentWidth = re(S.text, C);
      else {
        if (E) {
          var R = A.backgroundColor, Y = R && R.image;
          Y && (Y = Ow(Y), Ks(Y) && (S.width = Math.max(S.width, Y.width * I / Y.height)));
        }
        var O = v && i != null ? i - w : null;
        O != null && O < S.width ? !E || O < D ? (S.text = "", S.width = S.contentWidth = 0) : (Nw(p, S.text, O - D, C, t.ellipsis, { minChar: t.truncateMinChar }), S.text = p.text, e.isTruncated = e.isTruncated || p.isTruncated, S.width = S.contentWidth = re(S.text, C)) : S.contentWidth = re(S.text, C);
      }
      S.width += D, w += S.width, A && (b = Math.max(b, S.lineHeight));
    }
    y(_, w, b);
  }
  e.outerWidth = e.width = st(i, f), e.outerHeight = e.height = st(n, c), e.contentHeight = c, e.contentWidth = f, d && (e.outerWidth += d[1] + d[3], e.outerHeight += d[0] + d[2]);
  for (var m = 0; m < h.length; m++) {
    var S = h[m], z = S.percentWidth;
    S.width = parseInt(z, 10) / 100 * e.width;
  }
  return e;
}
function ql(r, t, e, i, n) {
  var a = t === "", o = n && e.rich[n] || {}, s = r.lines, l = o.font || e.font, u = !1, h, c;
  if (i) {
    var f = o.padding, d = f ? f[1] + f[3] : 0;
    if (o.width != null && o.width !== "auto") {
      var v = Cr(o.width, i.width) + d;
      s.length > 0 && v + i.accumWidth > i.width && (h = t.split(`
`), u = !0), i.accumWidth = v;
    } else {
      var g = Dm(t, l, i.width, i.breakAll, i.accumWidth);
      i.accumWidth = g.accumWidth + d, c = g.linesWidths, h = g.lines;
    }
  } else
    h = t.split(`
`);
  for (var p = 0; p < h.length; p++) {
    var y = h[p], m = new Fw();
    if (m.styleName = n, m.text = y, m.isLineHolder = !y && !a, typeof o.width == "number" ? m.width = o.width : m.width = c ? c[p] : re(y, l), !p && !u) {
      var _ = (s[s.length - 1] || (s[0] = new Zd())).tokens, b = _.length;
      b === 1 && _[0].isLineHolder ? _[0] = m : (y || !b || a) && _.push(m);
    } else
      s.push(new Zd([m]));
  }
}
function Gw(r) {
  var t = r.charCodeAt(0);
  return t >= 32 && t <= 591 || t >= 880 && t <= 4351 || t >= 4608 && t <= 5119 || t >= 7680 && t <= 8303;
}
var Ww = yn(",&?/;] ".split(""), function(r, t) {
  return r[t] = !0, r;
}, {});
function Uw(r) {
  return Gw(r) ? !!Ww[r] : !0;
}
function Dm(r, t, e, i, n) {
  for (var a = [], o = [], s = "", l = "", u = 0, h = 0, c = 0; c < r.length; c++) {
    var f = r.charAt(c);
    if (f === `
`) {
      l && (s += l, h += u), a.push(s), o.push(h), s = "", l = "", u = 0, h = 0;
      continue;
    }
    var d = re(f, t), v = i ? !1 : !Uw(f);
    if (a.length ? h + d > e : n + h + d > e) {
      h ? (s || l) && (v ? (s || (s = l, l = "", u = 0, h = u), a.push(s), o.push(h - u), l += f, u += d, s = "", h = u) : (l && (s += l, l = "", u = 0), a.push(s), o.push(h), s = f, h = d)) : v ? (a.push(l), o.push(u), l = f, u = d) : (a.push(f), o.push(d));
      continue;
    }
    h += d, v ? (l += f, u += d) : (l && (s += l, l = "", u = 0), s += f);
  }
  return !a.length && !s && (s = r, l = "", u = 0), l && (s += l), s && (a.push(s), o.push(h)), a.length === 1 && (h += n), {
    accumWidth: h,
    lines: a,
    linesWidths: o
  };
}
var wh = "__zr_style_" + Math.round(Math.random() * 10), ci = {
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowColor: "#000",
  opacity: 1,
  blend: "source-over"
}, js = {
  style: {
    shadowBlur: !0,
    shadowOffsetX: !0,
    shadowOffsetY: !0,
    shadowColor: !0,
    opacity: !0
  }
};
ci[wh] = !0;
var qd = ["z", "z2", "invisible"], Yw = ["invisible"], _n = function(r) {
  N(t, r);
  function t(e) {
    return r.call(this, e) || this;
  }
  return t.prototype._init = function(e) {
    for (var i = xt(e), n = 0; n < i.length; n++) {
      var a = i[n];
      a === "style" ? this.useStyle(e[a]) : r.prototype.attrKV.call(this, a, e[a]);
    }
    this.style || this.useStyle({});
  }, t.prototype.beforeBrush = function() {
  }, t.prototype.afterBrush = function() {
  }, t.prototype.innerBeforeBrush = function() {
  }, t.prototype.innerAfterBrush = function() {
  }, t.prototype.shouldBePainted = function(e, i, n, a) {
    var o = this.transform;
    if (this.ignore || this.invisible || this.style.opacity === 0 || this.culling && Xw(this, e, i) || o && !o[0] && !o[3])
      return !1;
    if (n && this.__clipPaths) {
      for (var s = 0; s < this.__clipPaths.length; ++s)
        if (this.__clipPaths[s].isZeroArea())
          return !1;
    }
    if (a && this.parent)
      for (var l = this.parent; l; ) {
        if (l.ignore)
          return !1;
        l = l.parent;
      }
    return !0;
  }, t.prototype.contain = function(e, i) {
    return this.rectContain(e, i);
  }, t.prototype.traverse = function(e, i) {
    e.call(i, this);
  }, t.prototype.rectContain = function(e, i) {
    var n = this.transformCoordToLocal(e, i), a = this.getBoundingRect();
    return a.contain(n[0], n[1]);
  }, t.prototype.getPaintRect = function() {
    var e = this._paintRect;
    if (!this._paintRect || this.__dirty) {
      var i = this.transform, n = this.getBoundingRect(), a = this.style, o = a.shadowBlur || 0, s = a.shadowOffsetX || 0, l = a.shadowOffsetY || 0;
      e = this._paintRect || (this._paintRect = new ot(0, 0, 0, 0)), i ? ot.applyTransform(e, n, i) : e.copy(n), (o || s || l) && (e.width += o * 2 + Math.abs(s), e.height += o * 2 + Math.abs(l), e.x = Math.min(e.x, e.x + s - o), e.y = Math.min(e.y, e.y + l - o));
      var u = this.dirtyRectTolerance;
      e.isZero() || (e.x = Math.floor(e.x - u), e.y = Math.floor(e.y - u), e.width = Math.ceil(e.width + 1 + u * 2), e.height = Math.ceil(e.height + 1 + u * 2));
    }
    return e;
  }, t.prototype.setPrevPaintRect = function(e) {
    e ? (this._prevPaintRect = this._prevPaintRect || new ot(0, 0, 0, 0), this._prevPaintRect.copy(e)) : this._prevPaintRect = null;
  }, t.prototype.getPrevPaintRect = function() {
    return this._prevPaintRect;
  }, t.prototype.animateStyle = function(e) {
    return this.animate("style", e);
  }, t.prototype.updateDuringAnimation = function(e) {
    e === "style" ? this.dirtyStyle() : this.markRedraw();
  }, t.prototype.attrKV = function(e, i) {
    e !== "style" ? r.prototype.attrKV.call(this, e, i) : this.style ? this.setStyle(i) : this.useStyle(i);
  }, t.prototype.setStyle = function(e, i) {
    return typeof e == "string" ? this.style[e] = i : $(this.style, e), this.dirtyStyle(), this;
  }, t.prototype.dirtyStyle = function(e) {
    e || this.markRedraw(), this.__dirty |= Jn, this._rect && (this._rect = null);
  }, t.prototype.dirty = function() {
    this.dirtyStyle();
  }, t.prototype.styleChanged = function() {
    return !!(this.__dirty & Jn);
  }, t.prototype.styleUpdated = function() {
    this.__dirty &= ~Jn;
  }, t.prototype.createStyle = function(e) {
    return Ys(ci, e);
  }, t.prototype.useStyle = function(e) {
    e[wh] || (e = this.createStyle(e)), this.__inHover ? this.__hoverStyle = e : this.style = e, this.dirtyStyle();
  }, t.prototype.isStyleObject = function(e) {
    return e[wh];
  }, t.prototype._innerSaveToNormal = function(e) {
    r.prototype._innerSaveToNormal.call(this, e);
    var i = this._normalState;
    e.style && !i.style && (i.style = this._mergeStyle(this.createStyle(), this.style)), this._savePrimaryToNormal(e, i, qd);
  }, t.prototype._applyStateObj = function(e, i, n, a, o, s) {
    r.prototype._applyStateObj.call(this, e, i, n, a, o, s);
    var l = !(i && a), u;
    if (i && i.style ? o ? a ? u = i.style : (u = this._mergeStyle(this.createStyle(), n.style), this._mergeStyle(u, i.style)) : (u = this._mergeStyle(this.createStyle(), a ? this.style : n.style), this._mergeStyle(u, i.style)) : l && (u = n.style), u)
      if (o) {
        var h = this.style;
        if (this.style = this.createStyle(l ? {} : h), l)
          for (var c = xt(h), f = 0; f < c.length; f++) {
            var d = c[f];
            d in u && (u[d] = u[d], this.style[d] = h[d]);
          }
        for (var v = xt(u), f = 0; f < v.length; f++) {
          var d = v[f];
          this.style[d] = this.style[d];
        }
        this._transitionState(e, {
          style: u
        }, s, this.getAnimationStyleProps());
      } else
        this.useStyle(u);
    for (var g = this.__inHover ? Yw : qd, f = 0; f < g.length; f++) {
      var d = g[f];
      i && i[d] != null ? this[d] = i[d] : l && n[d] != null && (this[d] = n[d]);
    }
  }, t.prototype._mergeStates = function(e) {
    for (var i = r.prototype._mergeStates.call(this, e), n, a = 0; a < e.length; a++) {
      var o = e[a];
      o.style && (n = n || {}, this._mergeStyle(n, o.style));
    }
    return n && (i.style = n), i;
  }, t.prototype._mergeStyle = function(e, i) {
    return $(e, i), e;
  }, t.prototype.getAnimationStyleProps = function() {
    return js;
  }, t.initDefaultProps = function() {
    var e = t.prototype;
    e.type = "displayable", e.invisible = !1, e.z = 0, e.z2 = 0, e.zlevel = 0, e.culling = !1, e.cursor = "pointer", e.rectHover = !1, e.incremental = !1, e._rect = null, e.dirtyRectTolerance = 0, e.__dirty = ee | Jn;
  }(), t;
}(Zs), Kl = new ot(0, 0, 0, 0), jl = new ot(0, 0, 0, 0);
function Xw(r, t, e) {
  return Kl.copy(r.getBoundingRect()), r.transform && Kl.applyTransform(r.transform), jl.width = t, jl.height = e, !Kl.intersect(jl);
}
var fe = Math.min, de = Math.max, Ql = Math.sin, Jl = Math.cos, Fr = Math.PI * 2, lo = mn(), uo = mn(), ho = mn();
function Kd(r, t, e, i, n, a) {
  n[0] = fe(r, e), n[1] = fe(t, i), a[0] = de(r, e), a[1] = de(t, i);
}
var jd = [], Qd = [];
function Zw(r, t, e, i, n, a, o, s, l, u) {
  var h = am, c = $t, f = h(r, e, n, o, jd);
  l[0] = 1 / 0, l[1] = 1 / 0, u[0] = -1 / 0, u[1] = -1 / 0;
  for (var d = 0; d < f; d++) {
    var v = c(r, e, n, o, jd[d]);
    l[0] = fe(v, l[0]), u[0] = de(v, u[0]);
  }
  f = h(t, i, a, s, Qd);
  for (var d = 0; d < f; d++) {
    var g = c(t, i, a, s, Qd[d]);
    l[1] = fe(g, l[1]), u[1] = de(g, u[1]);
  }
  l[0] = fe(r, l[0]), u[0] = de(r, u[0]), l[0] = fe(o, l[0]), u[0] = de(o, u[0]), l[1] = fe(t, l[1]), u[1] = de(t, u[1]), l[1] = fe(s, l[1]), u[1] = de(s, u[1]);
}
function qw(r, t, e, i, n, a, o, s) {
  var l = om, u = Yt, h = de(fe(l(r, e, n), 1), 0), c = de(fe(l(t, i, a), 1), 0), f = u(r, e, n, h), d = u(t, i, a, c);
  o[0] = fe(r, n, f), o[1] = fe(t, a, d), s[0] = de(r, n, f), s[1] = de(t, a, d);
}
function Kw(r, t, e, i, n, a, o, s, l) {
  var u = Zi, h = qi, c = Math.abs(n - a);
  if (c % Fr < 1e-4 && c > 1e-4) {
    s[0] = r - e, s[1] = t - i, l[0] = r + e, l[1] = t + i;
    return;
  }
  if (lo[0] = Jl(n) * e + r, lo[1] = Ql(n) * i + t, uo[0] = Jl(a) * e + r, uo[1] = Ql(a) * i + t, u(s, lo, uo), h(l, lo, uo), n = n % Fr, n < 0 && (n = n + Fr), a = a % Fr, a < 0 && (a = a + Fr), n > a && !o ? a += Fr : n < a && o && (n += Fr), o) {
    var f = a;
    a = n, n = f;
  }
  for (var d = 0; d < a; d += Math.PI / 2)
    d > n && (ho[0] = Jl(d) * e + r, ho[1] = Ql(d) * i + t, u(s, ho, s), h(l, ho, l));
}
var vt = {
  M: 1,
  L: 2,
  C: 3,
  Q: 4,
  A: 5,
  Z: 6,
  R: 7
}, Hr = [], Vr = [], Ee = [], or = [], Re = [], $e = [], tu = Math.min, eu = Math.max, Gr = Math.cos, Wr = Math.sin, Ze = Math.abs, Sh = Math.PI, pr = Sh * 2, ru = typeof Float32Array < "u", Pn = [];
function iu(r) {
  var t = Math.round(r / Sh * 1e8) / 1e8;
  return t % 2 * Sh;
}
function jw(r, t) {
  var e = iu(r[0]);
  e < 0 && (e += pr);
  var i = e - r[0], n = r[1];
  n += i, !t && n - e >= pr ? n = e + pr : t && e - n >= pr ? n = e - pr : !t && e > n ? n = e + (pr - iu(e - n)) : t && e < n && (n = e - (pr - iu(n - e))), r[0] = e, r[1] = n;
}
var bi = function() {
  function r(t) {
    this.dpr = 1, this._xi = 0, this._yi = 0, this._x0 = 0, this._y0 = 0, this._len = 0, t && (this._saveData = !1), this._saveData && (this.data = []);
  }
  return r.prototype.increaseVersion = function() {
    this._version++;
  }, r.prototype.getVersion = function() {
    return this._version;
  }, r.prototype.setScale = function(t, e, i) {
    i = i || 0, i > 0 && (this._ux = Ze(i / ms / t) || 0, this._uy = Ze(i / ms / e) || 0);
  }, r.prototype.setDPR = function(t) {
    this.dpr = t;
  }, r.prototype.setContext = function(t) {
    this._ctx = t;
  }, r.prototype.getContext = function() {
    return this._ctx;
  }, r.prototype.beginPath = function() {
    return this._ctx && this._ctx.beginPath(), this.reset(), this;
  }, r.prototype.reset = function() {
    this._saveData && (this._len = 0), this._pathSegLen && (this._pathSegLen = null, this._pathLen = 0), this._version++;
  }, r.prototype.moveTo = function(t, e) {
    return this._drawPendingPt(), this.addData(vt.M, t, e), this._ctx && this._ctx.moveTo(t, e), this._x0 = t, this._y0 = e, this._xi = t, this._yi = e, this;
  }, r.prototype.lineTo = function(t, e) {
    var i = Ze(t - this._xi), n = Ze(e - this._yi), a = i > this._ux || n > this._uy;
    if (this.addData(vt.L, t, e), this._ctx && a && this._ctx.lineTo(t, e), a)
      this._xi = t, this._yi = e, this._pendingPtDist = 0;
    else {
      var o = i * i + n * n;
      o > this._pendingPtDist && (this._pendingPtX = t, this._pendingPtY = e, this._pendingPtDist = o);
    }
    return this;
  }, r.prototype.bezierCurveTo = function(t, e, i, n, a, o) {
    return this._drawPendingPt(), this.addData(vt.C, t, e, i, n, a, o), this._ctx && this._ctx.bezierCurveTo(t, e, i, n, a, o), this._xi = a, this._yi = o, this;
  }, r.prototype.quadraticCurveTo = function(t, e, i, n) {
    return this._drawPendingPt(), this.addData(vt.Q, t, e, i, n), this._ctx && this._ctx.quadraticCurveTo(t, e, i, n), this._xi = i, this._yi = n, this;
  }, r.prototype.arc = function(t, e, i, n, a, o) {
    this._drawPendingPt(), Pn[0] = n, Pn[1] = a, jw(Pn, o), n = Pn[0], a = Pn[1];
    var s = a - n;
    return this.addData(vt.A, t, e, i, i, n, s, 0, o ? 0 : 1), this._ctx && this._ctx.arc(t, e, i, n, a, o), this._xi = Gr(a) * i + t, this._yi = Wr(a) * i + e, this;
  }, r.prototype.arcTo = function(t, e, i, n, a) {
    return this._drawPendingPt(), this._ctx && this._ctx.arcTo(t, e, i, n, a), this;
  }, r.prototype.rect = function(t, e, i, n) {
    return this._drawPendingPt(), this._ctx && this._ctx.rect(t, e, i, n), this.addData(vt.R, t, e, i, n), this;
  }, r.prototype.closePath = function() {
    this._drawPendingPt(), this.addData(vt.Z);
    var t = this._ctx, e = this._x0, i = this._y0;
    return t && t.closePath(), this._xi = e, this._yi = i, this;
  }, r.prototype.fill = function(t) {
    t && t.fill(), this.toStatic();
  }, r.prototype.stroke = function(t) {
    t && t.stroke(), this.toStatic();
  }, r.prototype.len = function() {
    return this._len;
  }, r.prototype.setData = function(t) {
    var e = t.length;
    !(this.data && this.data.length === e) && ru && (this.data = new Float32Array(e));
    for (var i = 0; i < e; i++)
      this.data[i] = t[i];
    this._len = e;
  }, r.prototype.appendPath = function(t) {
    t instanceof Array || (t = [t]);
    for (var e = t.length, i = 0, n = this._len, a = 0; a < e; a++)
      i += t[a].len();
    ru && this.data instanceof Float32Array && (this.data = new Float32Array(n + i));
    for (var a = 0; a < e; a++)
      for (var o = t[a].data, s = 0; s < o.length; s++)
        this.data[n++] = o[s];
    this._len = n;
  }, r.prototype.addData = function(t, e, i, n, a, o, s, l, u) {
    if (this._saveData) {
      var h = this.data;
      this._len + arguments.length > h.length && (this._expandData(), h = this.data);
      for (var c = 0; c < arguments.length; c++)
        h[this._len++] = arguments[c];
    }
  }, r.prototype._drawPendingPt = function() {
    this._pendingPtDist > 0 && (this._ctx && this._ctx.lineTo(this._pendingPtX, this._pendingPtY), this._pendingPtDist = 0);
  }, r.prototype._expandData = function() {
    if (!(this.data instanceof Array)) {
      for (var t = [], e = 0; e < this._len; e++)
        t[e] = this.data[e];
      this.data = t;
    }
  }, r.prototype.toStatic = function() {
    if (this._saveData) {
      this._drawPendingPt();
      var t = this.data;
      t instanceof Array && (t.length = this._len, ru && this._len > 11 && (this.data = new Float32Array(t)));
    }
  }, r.prototype.getBoundingRect = function() {
    Ee[0] = Ee[1] = Re[0] = Re[1] = Number.MAX_VALUE, or[0] = or[1] = $e[0] = $e[1] = -Number.MAX_VALUE;
    var t = this.data, e = 0, i = 0, n = 0, a = 0, o;
    for (o = 0; o < this._len; ) {
      var s = t[o++], l = o === 1;
      switch (l && (e = t[o], i = t[o + 1], n = e, a = i), s) {
        case vt.M:
          e = n = t[o++], i = a = t[o++], Re[0] = n, Re[1] = a, $e[0] = n, $e[1] = a;
          break;
        case vt.L:
          Kd(e, i, t[o], t[o + 1], Re, $e), e = t[o++], i = t[o++];
          break;
        case vt.C:
          Zw(e, i, t[o++], t[o++], t[o++], t[o++], t[o], t[o + 1], Re, $e), e = t[o++], i = t[o++];
          break;
        case vt.Q:
          qw(e, i, t[o++], t[o++], t[o], t[o + 1], Re, $e), e = t[o++], i = t[o++];
          break;
        case vt.A:
          var u = t[o++], h = t[o++], c = t[o++], f = t[o++], d = t[o++], v = t[o++] + d;
          o += 1;
          var g = !t[o++];
          l && (n = Gr(d) * c + u, a = Wr(d) * f + h), Kw(u, h, c, f, d, v, g, Re, $e), e = Gr(v) * c + u, i = Wr(v) * f + h;
          break;
        case vt.R:
          n = e = t[o++], a = i = t[o++];
          var p = t[o++], y = t[o++];
          Kd(n, a, n + p, a + y, Re, $e);
          break;
        case vt.Z:
          e = n, i = a;
          break;
      }
      Zi(Ee, Ee, Re), qi(or, or, $e);
    }
    return o === 0 && (Ee[0] = Ee[1] = or[0] = or[1] = 0), new ot(Ee[0], Ee[1], or[0] - Ee[0], or[1] - Ee[1]);
  }, r.prototype._calculateLength = function() {
    var t = this.data, e = this._len, i = this._ux, n = this._uy, a = 0, o = 0, s = 0, l = 0;
    this._pathSegLen || (this._pathSegLen = []);
    for (var u = this._pathSegLen, h = 0, c = 0, f = 0; f < e; ) {
      var d = t[f++], v = f === 1;
      v && (a = t[f], o = t[f + 1], s = a, l = o);
      var g = -1;
      switch (d) {
        case vt.M:
          a = s = t[f++], o = l = t[f++];
          break;
        case vt.L: {
          var p = t[f++], y = t[f++], m = p - a, _ = y - o;
          (Ze(m) > i || Ze(_) > n || f === e - 1) && (g = Math.sqrt(m * m + _ * _), a = p, o = y);
          break;
        }
        case vt.C: {
          var b = t[f++], w = t[f++], p = t[f++], y = t[f++], x = t[f++], S = t[f++];
          g = _x(a, o, b, w, p, y, x, S, 10), a = x, o = S;
          break;
        }
        case vt.Q: {
          var b = t[f++], w = t[f++], p = t[f++], y = t[f++];
          g = Sx(a, o, b, w, p, y, 10), a = p, o = y;
          break;
        }
        case vt.A:
          var A = t[f++], M = t[f++], D = t[f++], C = t[f++], I = t[f++], L = t[f++], P = L + I;
          f += 1, v && (s = Gr(I) * D + A, l = Wr(I) * C + M), g = eu(D, C) * tu(pr, Math.abs(L)), a = Gr(P) * D + A, o = Wr(P) * C + M;
          break;
        case vt.R: {
          s = a = t[f++], l = o = t[f++];
          var E = t[f++], R = t[f++];
          g = E * 2 + R * 2;
          break;
        }
        case vt.Z: {
          var m = s - a, _ = l - o;
          g = Math.sqrt(m * m + _ * _), a = s, o = l;
          break;
        }
      }
      g >= 0 && (u[c++] = g, h += g);
    }
    return this._pathLen = h, h;
  }, r.prototype.rebuildPath = function(t, e) {
    var i = this.data, n = this._ux, a = this._uy, o = this._len, s, l, u, h, c, f, d = e < 1, v, g, p = 0, y = 0, m, _ = 0, b, w;
    if (!(d && (this._pathSegLen || this._calculateLength(), v = this._pathSegLen, g = this._pathLen, m = e * g, !m)))
      t: for (var x = 0; x < o; ) {
        var S = i[x++], A = x === 1;
        switch (A && (u = i[x], h = i[x + 1], s = u, l = h), S !== vt.L && _ > 0 && (t.lineTo(b, w), _ = 0), S) {
          case vt.M:
            s = u = i[x++], l = h = i[x++], t.moveTo(u, h);
            break;
          case vt.L: {
            c = i[x++], f = i[x++];
            var M = Ze(c - u), D = Ze(f - h);
            if (M > n || D > a) {
              if (d) {
                var C = v[y++];
                if (p + C > m) {
                  var I = (m - p) / C;
                  t.lineTo(u * (1 - I) + c * I, h * (1 - I) + f * I);
                  break t;
                }
                p += C;
              }
              t.lineTo(c, f), u = c, h = f, _ = 0;
            } else {
              var L = M * M + D * D;
              L > _ && (b = c, w = f, _ = L);
            }
            break;
          }
          case vt.C: {
            var P = i[x++], E = i[x++], R = i[x++], Y = i[x++], O = i[x++], z = i[x++];
            if (d) {
              var C = v[y++];
              if (p + C > m) {
                var I = (m - p) / C;
                vs(u, P, R, O, I, Hr), vs(h, E, Y, z, I, Vr), t.bezierCurveTo(Hr[1], Vr[1], Hr[2], Vr[2], Hr[3], Vr[3]);
                break t;
              }
              p += C;
            }
            t.bezierCurveTo(P, E, R, Y, O, z), u = O, h = z;
            break;
          }
          case vt.Q: {
            var P = i[x++], E = i[x++], R = i[x++], Y = i[x++];
            if (d) {
              var C = v[y++];
              if (p + C > m) {
                var I = (m - p) / C;
                ps(u, P, R, I, Hr), ps(h, E, Y, I, Vr), t.quadraticCurveTo(Hr[1], Vr[1], Hr[2], Vr[2]);
                break t;
              }
              p += C;
            }
            t.quadraticCurveTo(P, E, R, Y), u = R, h = Y;
            break;
          }
          case vt.A:
            var Z = i[x++], J = i[x++], it = i[x++], ft = i[x++], gt = i[x++], _t = i[x++], Jt = i[x++], Ye = !i[x++], ct = it > ft ? it : ft, X = Ze(it - ft) > 1e-3, nt = gt + _t, F = !1;
            if (d) {
              var C = v[y++];
              p + C > m && (nt = gt + _t * (m - p) / C, F = !0), p += C;
            }
            if (X && t.ellipse ? t.ellipse(Z, J, it, ft, Jt, gt, nt, Ye) : t.arc(Z, J, ct, gt, nt, Ye), F)
              break t;
            A && (s = Gr(gt) * it + Z, l = Wr(gt) * ft + J), u = Gr(nt) * it + Z, h = Wr(nt) * ft + J;
            break;
          case vt.R:
            s = u = i[x], l = h = i[x + 1], c = i[x++], f = i[x++];
            var W = i[x++], At = i[x++];
            if (d) {
              var C = v[y++];
              if (p + C > m) {
                var yt = m - p;
                t.moveTo(c, f), t.lineTo(c + tu(yt, W), f), yt -= W, yt > 0 && t.lineTo(c + W, f + tu(yt, At)), yt -= At, yt > 0 && t.lineTo(c + eu(W - yt, 0), f + At), yt -= W, yt > 0 && t.lineTo(c, f + eu(At - yt, 0));
                break t;
              }
              p += C;
            }
            t.rect(c, f, W, At);
            break;
          case vt.Z:
            if (d) {
              var C = v[y++];
              if (p + C > m) {
                var I = (m - p) / C;
                t.lineTo(u * (1 - I) + s * I, h * (1 - I) + l * I);
                break t;
              }
              p += C;
            }
            t.closePath(), u = s, h = l;
        }
      }
  }, r.prototype.clone = function() {
    var t = new r(), e = this.data;
    return t.data = e.slice ? e.slice() : Array.prototype.slice.call(e), t._len = this._len, t;
  }, r.CMD = vt, r.initDefaultProps = function() {
    var t = r.prototype;
    t._saveData = !0, t._ux = 0, t._uy = 0, t._pendingPtDist = 0, t._version = 0;
  }(), r;
}();
function Ei(r, t, e, i, n, a, o) {
  if (n === 0)
    return !1;
  var s = n, l = 0, u = r;
  if (o > t + s && o > i + s || o < t - s && o < i - s || a > r + s && a > e + s || a < r - s && a < e - s)
    return !1;
  if (r !== e)
    l = (t - i) / (r - e), u = (r * i - e * t) / (r - e);
  else
    return Math.abs(a - r) <= s / 2;
  var h = l * a - o + u, c = h * h / (l * l + 1);
  return c <= s / 2 * s / 2;
}
function Qw(r, t, e, i, n, a, o, s, l, u, h) {
  if (l === 0)
    return !1;
  var c = l;
  if (h > t + c && h > i + c && h > a + c && h > s + c || h < t - c && h < i - c && h < a - c && h < s - c || u > r + c && u > e + c && u > n + c && u > o + c || u < r - c && u < e - c && u < n - c && u < o - c)
    return !1;
  var f = mx(r, t, e, i, n, a, o, s, u, h);
  return f <= c / 2;
}
function Jw(r, t, e, i, n, a, o, s, l) {
  if (o === 0)
    return !1;
  var u = o;
  if (l > t + u && l > i + u && l > a + u || l < t - u && l < i - u && l < a - u || s > r + u && s > e + u && s > n + u || s < r - u && s < e - u && s < n - u)
    return !1;
  var h = xx(r, t, e, i, n, a, s, l);
  return h <= u / 2;
}
var Jd = Math.PI * 2;
function co(r) {
  return r %= Jd, r < 0 && (r += Jd), r;
}
var En = Math.PI * 2;
function tS(r, t, e, i, n, a, o, s, l) {
  if (o === 0)
    return !1;
  var u = o;
  s -= r, l -= t;
  var h = Math.sqrt(s * s + l * l);
  if (h - u > e || h + u < e)
    return !1;
  if (Math.abs(i - n) % En < 1e-4)
    return !0;
  if (a) {
    var c = i;
    i = co(n), n = co(c);
  } else
    i = co(i), n = co(n);
  i > n && (n += En);
  var f = Math.atan2(l, s);
  return f < 0 && (f += En), f >= i && f <= n || f + En >= i && f + En <= n;
}
function Qe(r, t, e, i, n, a) {
  if (a > t && a > i || a < t && a < i || i === t)
    return 0;
  var o = (a - t) / (i - t), s = i < t ? 1 : -1;
  (o === 1 || o === 0) && (s = i < t ? 0.5 : -0.5);
  var l = o * (e - r) + r;
  return l === n ? 1 / 0 : l > n ? s : 0;
}
var sr = bi.CMD, Ur = Math.PI * 2, eS = 1e-4;
function rS(r, t) {
  return Math.abs(r - t) < eS;
}
var Ft = [-1, -1, -1], he = [-1, -1];
function iS() {
  var r = he[0];
  he[0] = he[1], he[1] = r;
}
function nS(r, t, e, i, n, a, o, s, l, u) {
  if (u > t && u > i && u > a && u > s || u < t && u < i && u < a && u < s)
    return 0;
  var h = ds(t, i, a, s, u, Ft);
  if (h === 0)
    return 0;
  for (var c = 0, f = -1, d = void 0, v = void 0, g = 0; g < h; g++) {
    var p = Ft[g], y = p === 0 || p === 1 ? 0.5 : 1, m = $t(r, e, n, o, p);
    m < l || (f < 0 && (f = am(t, i, a, s, he), he[1] < he[0] && f > 1 && iS(), d = $t(t, i, a, s, he[0]), f > 1 && (v = $t(t, i, a, s, he[1]))), f === 2 ? p < he[0] ? c += d < t ? y : -y : p < he[1] ? c += v < d ? y : -y : c += s < v ? y : -y : p < he[0] ? c += d < t ? y : -y : c += s < d ? y : -y);
  }
  return c;
}
function aS(r, t, e, i, n, a, o, s) {
  if (s > t && s > i && s > a || s < t && s < i && s < a)
    return 0;
  var l = bx(t, i, a, s, Ft);
  if (l === 0)
    return 0;
  var u = om(t, i, a);
  if (u >= 0 && u <= 1) {
    for (var h = 0, c = Yt(t, i, a, u), f = 0; f < l; f++) {
      var d = Ft[f] === 0 || Ft[f] === 1 ? 0.5 : 1, v = Yt(r, e, n, Ft[f]);
      v < o || (Ft[f] < u ? h += c < t ? d : -d : h += a < c ? d : -d);
    }
    return h;
  } else {
    var d = Ft[0] === 0 || Ft[0] === 1 ? 0.5 : 1, v = Yt(r, e, n, Ft[0]);
    return v < o ? 0 : a < t ? d : -d;
  }
}
function oS(r, t, e, i, n, a, o, s) {
  if (s -= t, s > e || s < -e)
    return 0;
  var l = Math.sqrt(e * e - s * s);
  Ft[0] = -l, Ft[1] = l;
  var u = Math.abs(i - n);
  if (u < 1e-4)
    return 0;
  if (u >= Ur - 1e-4) {
    i = 0, n = Ur;
    var h = a ? 1 : -1;
    return o >= Ft[0] + r && o <= Ft[1] + r ? h : 0;
  }
  if (i > n) {
    var c = i;
    i = n, n = c;
  }
  i < 0 && (i += Ur, n += Ur);
  for (var f = 0, d = 0; d < 2; d++) {
    var v = Ft[d];
    if (v + r > o) {
      var g = Math.atan2(s, v), h = a ? 1 : -1;
      g < 0 && (g = Ur + g), (g >= i && g <= n || g + Ur >= i && g + Ur <= n) && (g > Math.PI / 2 && g < Math.PI * 1.5 && (h = -h), f += h);
    }
  }
  return f;
}
function km(r, t, e, i, n) {
  for (var a = r.data, o = r.len(), s = 0, l = 0, u = 0, h = 0, c = 0, f, d, v = 0; v < o; ) {
    var g = a[v++], p = v === 1;
    switch (g === sr.M && v > 1 && (e || (s += Qe(l, u, h, c, i, n))), p && (l = a[v], u = a[v + 1], h = l, c = u), g) {
      case sr.M:
        h = a[v++], c = a[v++], l = h, u = c;
        break;
      case sr.L:
        if (e) {
          if (Ei(l, u, a[v], a[v + 1], t, i, n))
            return !0;
        } else
          s += Qe(l, u, a[v], a[v + 1], i, n) || 0;
        l = a[v++], u = a[v++];
        break;
      case sr.C:
        if (e) {
          if (Qw(l, u, a[v++], a[v++], a[v++], a[v++], a[v], a[v + 1], t, i, n))
            return !0;
        } else
          s += nS(l, u, a[v++], a[v++], a[v++], a[v++], a[v], a[v + 1], i, n) || 0;
        l = a[v++], u = a[v++];
        break;
      case sr.Q:
        if (e) {
          if (Jw(l, u, a[v++], a[v++], a[v], a[v + 1], t, i, n))
            return !0;
        } else
          s += aS(l, u, a[v++], a[v++], a[v], a[v + 1], i, n) || 0;
        l = a[v++], u = a[v++];
        break;
      case sr.A:
        var y = a[v++], m = a[v++], _ = a[v++], b = a[v++], w = a[v++], x = a[v++];
        v += 1;
        var S = !!(1 - a[v++]);
        f = Math.cos(w) * _ + y, d = Math.sin(w) * b + m, p ? (h = f, c = d) : s += Qe(l, u, f, d, i, n);
        var A = (i - y) * b / _ + y;
        if (e) {
          if (tS(y, m, b, w, w + x, S, t, A, n))
            return !0;
        } else
          s += oS(y, m, b, w, w + x, S, A, n);
        l = Math.cos(w + x) * _ + y, u = Math.sin(w + x) * b + m;
        break;
      case sr.R:
        h = l = a[v++], c = u = a[v++];
        var M = a[v++], D = a[v++];
        if (f = h + M, d = c + D, e) {
          if (Ei(h, c, f, c, t, i, n) || Ei(f, c, f, d, t, i, n) || Ei(f, d, h, d, t, i, n) || Ei(h, d, h, c, t, i, n))
            return !0;
        } else
          s += Qe(f, c, f, d, i, n), s += Qe(h, d, h, c, i, n);
        break;
      case sr.Z:
        if (e) {
          if (Ei(l, u, h, c, t, i, n))
            return !0;
        } else
          s += Qe(l, u, h, c, i, n);
        l = h, u = c;
        break;
    }
  }
  return !e && !rS(u, c) && (s += Qe(l, u, h, c, i, n) || 0), s !== 0;
}
function sS(r, t, e) {
  return km(r, 0, !1, t, e);
}
function lS(r, t, e, i) {
  return km(r, t, !0, e, i);
}
var Im = ht({
  fill: "#000",
  stroke: null,
  strokePercent: 1,
  fillOpacity: 1,
  strokeOpacity: 1,
  lineDashOffset: 0,
  lineWidth: 1,
  lineCap: "butt",
  miterLimit: 10,
  strokeNoScale: !1,
  strokeFirst: !1
}, ci), uS = {
  style: ht({
    fill: !0,
    stroke: !0,
    strokePercent: !0,
    fillOpacity: !0,
    strokeOpacity: !0,
    lineDashOffset: !0,
    lineWidth: !0,
    miterLimit: !0
  }, js.style)
}, nu = Ia.concat([
  "invisible",
  "culling",
  "z",
  "z2",
  "zlevel",
  "parent"
]), pt = function(r) {
  N(t, r);
  function t(e) {
    return r.call(this, e) || this;
  }
  return t.prototype.update = function() {
    var e = this;
    r.prototype.update.call(this);
    var i = this.style;
    if (i.decal) {
      var n = this._decalEl = this._decalEl || new t();
      n.buildPath === t.prototype.buildPath && (n.buildPath = function(l) {
        e.buildPath(l, e.shape);
      }), n.silent = !0;
      var a = n.style;
      for (var o in i)
        a[o] !== i[o] && (a[o] = i[o]);
      a.fill = i.fill ? i.decal : null, a.decal = null, a.shadowColor = null, i.strokeFirst && (a.stroke = null);
      for (var s = 0; s < nu.length; ++s)
        n[nu[s]] = this[nu[s]];
      n.__dirty |= ee;
    } else this._decalEl && (this._decalEl = null);
  }, t.prototype.getDecalElement = function() {
    return this._decalEl;
  }, t.prototype._init = function(e) {
    var i = xt(e);
    this.shape = this.getDefaultShape();
    var n = this.getDefaultStyle();
    n && this.useStyle(n);
    for (var a = 0; a < i.length; a++) {
      var o = i[a], s = e[o];
      o === "style" ? this.style ? $(this.style, s) : this.useStyle(s) : o === "shape" ? $(this.shape, s) : r.prototype.attrKV.call(this, o, s);
    }
    this.style || this.useStyle({});
  }, t.prototype.getDefaultStyle = function() {
    return null;
  }, t.prototype.getDefaultShape = function() {
    return {};
  }, t.prototype.canBeInsideText = function() {
    return this.hasFill();
  }, t.prototype.getInsideTextFill = function() {
    var e = this.style.fill;
    if (e !== "none") {
      if (V(e)) {
        var i = ys(e, 0);
        return i > 0.5 ? mh : i > 0.2 ? Ux : _h;
      } else if (e)
        return _h;
    }
    return mh;
  }, t.prototype.getInsideTextStroke = function(e) {
    var i = this.style.fill;
    if (V(i)) {
      var n = this.__zr, a = !!(n && n.isDarkMode()), o = ys(e, 0) < yh;
      if (a === o)
        return i;
    }
  }, t.prototype.buildPath = function(e, i, n) {
  }, t.prototype.pathUpdated = function() {
    this.__dirty &= ~Yi;
  }, t.prototype.getUpdatedPathProxy = function(e) {
    return !this.path && this.createPathProxy(), this.path.beginPath(), this.buildPath(this.path, this.shape, e), this.path;
  }, t.prototype.createPathProxy = function() {
    this.path = new bi(!1);
  }, t.prototype.hasStroke = function() {
    var e = this.style, i = e.stroke;
    return !(i == null || i === "none" || !(e.lineWidth > 0));
  }, t.prototype.hasFill = function() {
    var e = this.style, i = e.fill;
    return i != null && i !== "none";
  }, t.prototype.getBoundingRect = function() {
    var e = this._rect, i = this.style, n = !e;
    if (n) {
      var a = !1;
      this.path || (a = !0, this.createPathProxy());
      var o = this.path;
      (a || this.__dirty & Yi) && (o.beginPath(), this.buildPath(o, this.shape, !1), this.pathUpdated()), e = o.getBoundingRect();
    }
    if (this._rect = e, this.hasStroke() && this.path && this.path.len() > 0) {
      var s = this._rectStroke || (this._rectStroke = e.clone());
      if (this.__dirty || n) {
        s.copy(e);
        var l = i.strokeNoScale ? this.getLineScale() : 1, u = i.lineWidth;
        if (!this.hasFill()) {
          var h = this.strokeContainThreshold;
          u = Math.max(u, h ?? 4);
        }
        l > 1e-10 && (s.width += u / l, s.height += u / l, s.x -= u / l / 2, s.y -= u / l / 2);
      }
      return s;
    }
    return e;
  }, t.prototype.contain = function(e, i) {
    var n = this.transformCoordToLocal(e, i), a = this.getBoundingRect(), o = this.style;
    if (e = n[0], i = n[1], a.contain(e, i)) {
      var s = this.path;
      if (this.hasStroke()) {
        var l = o.lineWidth, u = o.strokeNoScale ? this.getLineScale() : 1;
        if (u > 1e-10 && (this.hasFill() || (l = Math.max(l, this.strokeContainThreshold)), lS(s, l / u, e, i)))
          return !0;
      }
      if (this.hasFill())
        return sS(s, e, i);
    }
    return !1;
  }, t.prototype.dirtyShape = function() {
    this.__dirty |= Yi, this._rect && (this._rect = null), this._decalEl && this._decalEl.dirtyShape(), this.markRedraw();
  }, t.prototype.dirty = function() {
    this.dirtyStyle(), this.dirtyShape();
  }, t.prototype.animateShape = function(e) {
    return this.animate("shape", e);
  }, t.prototype.updateDuringAnimation = function(e) {
    e === "style" ? this.dirtyStyle() : e === "shape" ? this.dirtyShape() : this.markRedraw();
  }, t.prototype.attrKV = function(e, i) {
    e === "shape" ? this.setShape(i) : r.prototype.attrKV.call(this, e, i);
  }, t.prototype.setShape = function(e, i) {
    var n = this.shape;
    return n || (n = this.shape = {}), typeof e == "string" ? n[e] = i : $(n, e), this.dirtyShape(), this;
  }, t.prototype.shapeChanged = function() {
    return !!(this.__dirty & Yi);
  }, t.prototype.createStyle = function(e) {
    return Ys(Im, e);
  }, t.prototype._innerSaveToNormal = function(e) {
    r.prototype._innerSaveToNormal.call(this, e);
    var i = this._normalState;
    e.shape && !i.shape && (i.shape = $({}, this.shape));
  }, t.prototype._applyStateObj = function(e, i, n, a, o, s) {
    r.prototype._applyStateObj.call(this, e, i, n, a, o, s);
    var l = !(i && a), u;
    if (i && i.shape ? o ? a ? u = i.shape : (u = $({}, n.shape), $(u, i.shape)) : (u = $({}, a ? this.shape : n.shape), $(u, i.shape)) : l && (u = n.shape), u)
      if (o) {
        this.shape = $({}, this.shape);
        for (var h = {}, c = xt(u), f = 0; f < c.length; f++) {
          var d = c[f];
          typeof u[d] == "object" ? this.shape[d] = u[d] : h[d] = u[d];
        }
        this._transitionState(e, {
          shape: h
        }, s);
      } else
        this.shape = u, this.dirtyShape();
  }, t.prototype._mergeStates = function(e) {
    for (var i = r.prototype._mergeStates.call(this, e), n, a = 0; a < e.length; a++) {
      var o = e[a];
      o.shape && (n = n || {}, this._mergeStyle(n, o.shape));
    }
    return n && (i.shape = n), i;
  }, t.prototype.getAnimationStyleProps = function() {
    return uS;
  }, t.prototype.isZeroArea = function() {
    return !1;
  }, t.extend = function(e) {
    var i = function(a) {
      N(o, a);
      function o(s) {
        var l = a.call(this, s) || this;
        return e.init && e.init.call(l, s), l;
      }
      return o.prototype.getDefaultStyle = function() {
        return K(e.style);
      }, o.prototype.getDefaultShape = function() {
        return K(e.shape);
      }, o;
    }(t);
    for (var n in e)
      typeof e[n] == "function" && (i.prototype[n] = e[n]);
    return i;
  }, t.initDefaultProps = function() {
    var e = t.prototype;
    e.type = "path", e.strokeContainThreshold = 5, e.segmentIgnoreThreshold = 0, e.subPixelOptimize = !1, e.autoBatch = !1, e.__dirty = ee | Jn | Yi;
  }(), t;
}(_n), hS = ht({
  strokeFirst: !0,
  font: gi,
  x: 0,
  y: 0,
  textAlign: "left",
  textBaseline: "top",
  miterLimit: 2
}, Im), ws = function(r) {
  N(t, r);
  function t() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return t.prototype.hasStroke = function() {
    var e = this.style, i = e.stroke;
    return i != null && i !== "none" && e.lineWidth > 0;
  }, t.prototype.hasFill = function() {
    var e = this.style, i = e.fill;
    return i != null && i !== "none";
  }, t.prototype.createStyle = function(e) {
    return Ys(hS, e);
  }, t.prototype.setBoundingRect = function(e) {
    this._rect = e;
  }, t.prototype.getBoundingRect = function() {
    var e = this.style;
    if (!this._rect) {
      var i = e.text;
      i != null ? i += "" : i = "";
      var n = Vc(i, e.font, e.textAlign, e.textBaseline);
      if (n.x += e.x || 0, n.y += e.y || 0, this.hasStroke()) {
        var a = e.lineWidth;
        n.x -= a / 2, n.y -= a / 2, n.width += a, n.height += a;
      }
      this._rect = n;
    }
    return this._rect;
  }, t.initDefaultProps = function() {
    var e = t.prototype;
    e.dirtyRectTolerance = 10;
  }(), t;
}(_n);
ws.prototype.type = "tspan";
var cS = ht({
  x: 0,
  y: 0
}, ci), fS = {
  style: ht({
    x: !0,
    y: !0,
    width: !0,
    height: !0,
    sx: !0,
    sy: !0,
    sWidth: !0,
    sHeight: !0
  }, js.style)
};
function dS(r) {
  return !!(r && typeof r != "string" && r.width && r.height);
}
var Lr = function(r) {
  N(t, r);
  function t() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return t.prototype.createStyle = function(e) {
    return Ys(cS, e);
  }, t.prototype._getSize = function(e) {
    var i = this.style, n = i[e];
    if (n != null)
      return n;
    var a = dS(i.image) ? i.image : this.__image;
    if (!a)
      return 0;
    var o = e === "width" ? "height" : "width", s = i[o];
    return s == null ? a[e] : a[e] / a[o] * s;
  }, t.prototype.getWidth = function() {
    return this._getSize("width");
  }, t.prototype.getHeight = function() {
    return this._getSize("height");
  }, t.prototype.getAnimationStyleProps = function() {
    return fS;
  }, t.prototype.getBoundingRect = function() {
    var e = this.style;
    return this._rect || (this._rect = new ot(e.x || 0, e.y || 0, this.getWidth(), this.getHeight())), this._rect;
  }, t;
}(_n);
Lr.prototype.type = "image";
function vS(r, t) {
  var e = t.x, i = t.y, n = t.width, a = t.height, o = t.r, s, l, u, h;
  n < 0 && (e = e + n, n = -n), a < 0 && (i = i + a, a = -a), typeof o == "number" ? s = l = u = h = o : o instanceof Array ? o.length === 1 ? s = l = u = h = o[0] : o.length === 2 ? (s = u = o[0], l = h = o[1]) : o.length === 3 ? (s = o[0], l = h = o[1], u = o[2]) : (s = o[0], l = o[1], u = o[2], h = o[3]) : s = l = u = h = 0;
  var c;
  s + l > n && (c = s + l, s *= n / c, l *= n / c), u + h > n && (c = u + h, u *= n / c, h *= n / c), l + u > a && (c = l + u, l *= a / c, u *= a / c), s + h > a && (c = s + h, s *= a / c, h *= a / c), r.moveTo(e + s, i), r.lineTo(e + n - l, i), l !== 0 && r.arc(e + n - l, i + l, l, -Math.PI / 2, 0), r.lineTo(e + n, i + a - u), u !== 0 && r.arc(e + n - u, i + a - u, u, 0, Math.PI / 2), r.lineTo(e + h, i + a), h !== 0 && r.arc(e + h, i + a - h, h, Math.PI / 2, Math.PI), r.lineTo(e, i + s), s !== 0 && r.arc(e + s, i + s, s, Math.PI, Math.PI * 1.5);
}
var ji = Math.round;
function Lm(r, t, e) {
  if (t) {
    var i = t.x1, n = t.x2, a = t.y1, o = t.y2;
    r.x1 = i, r.x2 = n, r.y1 = a, r.y2 = o;
    var s = e && e.lineWidth;
    return s && (ji(i * 2) === ji(n * 2) && (r.x1 = r.x2 = ni(i, s, !0)), ji(a * 2) === ji(o * 2) && (r.y1 = r.y2 = ni(a, s, !0))), r;
  }
}
function Pm(r, t, e) {
  if (t) {
    var i = t.x, n = t.y, a = t.width, o = t.height;
    r.x = i, r.y = n, r.width = a, r.height = o;
    var s = e && e.lineWidth;
    return s && (r.x = ni(i, s, !0), r.y = ni(n, s, !0), r.width = Math.max(ni(i + a, s, !1) - r.x, a === 0 ? 0 : 1), r.height = Math.max(ni(n + o, s, !1) - r.y, o === 0 ? 0 : 1)), r;
  }
}
function ni(r, t, e) {
  if (!t)
    return r;
  var i = ji(r * 2);
  return (i + ji(t)) % 2 === 0 ? i / 2 : (i + (e ? 1 : -1)) / 2;
}
var pS = /* @__PURE__ */ function() {
  function r() {
    this.x = 0, this.y = 0, this.width = 0, this.height = 0;
  }
  return r;
}(), gS = {}, Mt = function(r) {
  N(t, r);
  function t(e) {
    return r.call(this, e) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new pS();
  }, t.prototype.buildPath = function(e, i) {
    var n, a, o, s;
    if (this.subPixelOptimize) {
      var l = Pm(gS, i, this.style);
      n = l.x, a = l.y, o = l.width, s = l.height, l.r = i.r, i = l;
    } else
      n = i.x, a = i.y, o = i.width, s = i.height;
    i.r ? vS(e, i) : e.rect(n, a, o, s);
  }, t.prototype.isZeroArea = function() {
    return !this.shape.width || !this.shape.height;
  }, t;
}(pt);
Mt.prototype.type = "rect";
var tv = {
  fill: "#000"
}, ev = 2, yS = {
  style: ht({
    fill: !0,
    stroke: !0,
    fillOpacity: !0,
    strokeOpacity: !0,
    lineWidth: !0,
    fontSize: !0,
    lineHeight: !0,
    width: !0,
    height: !0,
    textShadowColor: !0,
    textShadowBlur: !0,
    textShadowOffsetX: !0,
    textShadowOffsetY: !0,
    backgroundColor: !0,
    padding: !0,
    borderColor: !0,
    borderWidth: !0,
    borderRadius: !0
  }, js.style)
}, Ht = function(r) {
  N(t, r);
  function t(e) {
    var i = r.call(this) || this;
    return i.type = "text", i._children = [], i._defaultStyle = tv, i.attr(e), i;
  }
  return t.prototype.childrenRef = function() {
    return this._children;
  }, t.prototype.update = function() {
    r.prototype.update.call(this), this.styleChanged() && this._updateSubTexts();
    for (var e = 0; e < this._children.length; e++) {
      var i = this._children[e];
      i.zlevel = this.zlevel, i.z = this.z, i.z2 = this.z2, i.culling = this.culling, i.cursor = this.cursor, i.invisible = this.invisible;
    }
  }, t.prototype.updateTransform = function() {
    var e = this.innerTransformable;
    e ? (e.updateTransform(), e.transform && (this.transform = e.transform)) : r.prototype.updateTransform.call(this);
  }, t.prototype.getLocalTransform = function(e) {
    var i = this.innerTransformable;
    return i ? i.getLocalTransform(e) : r.prototype.getLocalTransform.call(this, e);
  }, t.prototype.getComputedTransform = function() {
    return this.__hostTarget && (this.__hostTarget.getComputedTransform(), this.__hostTarget.updateInnerText(!0)), r.prototype.getComputedTransform.call(this);
  }, t.prototype._updateSubTexts = function() {
    this._childCursor = 0, wS(this.style), this.style.rich ? this._updateRichTexts() : this._updatePlainTexts(), this._children.length = this._childCursor, this.styleUpdated();
  }, t.prototype.addSelfToZr = function(e) {
    r.prototype.addSelfToZr.call(this, e);
    for (var i = 0; i < this._children.length; i++)
      this._children[i].__zr = e;
  }, t.prototype.removeSelfFromZr = function(e) {
    r.prototype.removeSelfFromZr.call(this, e);
    for (var i = 0; i < this._children.length; i++)
      this._children[i].__zr = null;
  }, t.prototype.getBoundingRect = function() {
    if (this.styleChanged() && this._updateSubTexts(), !this._rect) {
      for (var e = new ot(0, 0, 0, 0), i = this._children, n = [], a = null, o = 0; o < i.length; o++) {
        var s = i[o], l = s.getBoundingRect(), u = s.getLocalTransform(n);
        u ? (e.copy(l), e.applyTransform(u), a = a || e.clone(), a.union(e)) : (a = a || l.clone(), a.union(l));
      }
      this._rect = a || e;
    }
    return this._rect;
  }, t.prototype.setDefaultTextStyle = function(e) {
    this._defaultStyle = e || tv;
  }, t.prototype.setTextContent = function(e) {
  }, t.prototype._mergeStyle = function(e, i) {
    if (!i)
      return e;
    var n = i.rich, a = e.rich || n && {};
    return $(e, i), n && a ? (this._mergeRich(a, n), e.rich = a) : a && (e.rich = a), e;
  }, t.prototype._mergeRich = function(e, i) {
    for (var n = xt(i), a = 0; a < n.length; a++) {
      var o = n[a];
      e[o] = e[o] || {}, $(e[o], i[o]);
    }
  }, t.prototype.getAnimationStyleProps = function() {
    return yS;
  }, t.prototype._getOrCreateChild = function(e) {
    var i = this._children[this._childCursor];
    return (!i || !(i instanceof e)) && (i = new e()), this._children[this._childCursor++] = i, i.__zr = this.__zr, i.parent = this, i;
  }, t.prototype._updatePlainTexts = function() {
    var e = this.style, i = e.font || gi, n = e.padding, a = lv(e), o = zw(a, e), s = au(e), l = !!e.backgroundColor, u = o.outerHeight, h = o.outerWidth, c = o.contentWidth, f = o.lines, d = o.lineHeight, v = this._defaultStyle;
    this.isTruncated = !!o.isTruncated;
    var g = e.x || 0, p = e.y || 0, y = e.align || v.align || "left", m = e.verticalAlign || v.verticalAlign || "top", _ = g, b = Xi(p, o.contentHeight, m);
    if (s || n) {
      var w = ea(g, h, y), x = Xi(p, u, m);
      s && this._renderBackground(e, e, w, x, h, u);
    }
    b += d / 2, n && (_ = sv(g, y, n), m === "top" ? b += n[0] : m === "bottom" && (b -= n[2]));
    for (var S = 0, A = !1, M = ov("fill" in e ? e.fill : (A = !0, v.fill)), D = av("stroke" in e ? e.stroke : !l && (!v.autoStroke || A) ? (S = ev, v.stroke) : null), C = e.textShadowBlur > 0, I = e.width != null && (e.overflow === "truncate" || e.overflow === "break" || e.overflow === "breakAll"), L = o.calculatedLineHeight, P = 0; P < f.length; P++) {
      var E = this._getOrCreateChild(ws), R = E.createStyle();
      E.useStyle(R), R.text = f[P], R.x = _, R.y = b, R.textAlign = y, R.textBaseline = "middle", R.opacity = e.opacity, R.strokeFirst = !0, C && (R.shadowBlur = e.textShadowBlur || 0, R.shadowColor = e.textShadowColor || "transparent", R.shadowOffsetX = e.textShadowOffsetX || 0, R.shadowOffsetY = e.textShadowOffsetY || 0), R.stroke = D, R.fill = M, D && (R.lineWidth = e.lineWidth || S, R.lineDash = e.lineDash, R.lineDashOffset = e.lineDashOffset || 0), R.font = i, iv(R, e), b += d, I && E.setBoundingRect(new ot(ea(R.x, c, R.textAlign), Xi(R.y, L, R.textBaseline), c, L));
    }
  }, t.prototype._updateRichTexts = function() {
    var e = this.style, i = lv(e), n = Vw(i, e), a = n.width, o = n.outerWidth, s = n.outerHeight, l = e.padding, u = e.x || 0, h = e.y || 0, c = this._defaultStyle, f = e.align || c.align, d = e.verticalAlign || c.verticalAlign;
    this.isTruncated = !!n.isTruncated;
    var v = ea(u, o, f), g = Xi(h, s, d), p = v, y = g;
    l && (p += l[3], y += l[0]);
    var m = p + a;
    au(e) && this._renderBackground(e, e, v, g, o, s);
    for (var _ = !!e.backgroundColor, b = 0; b < n.lines.length; b++) {
      for (var w = n.lines[b], x = w.tokens, S = x.length, A = w.lineHeight, M = w.width, D = 0, C = p, I = m, L = S - 1, P = void 0; D < S && (P = x[D], !P.align || P.align === "left"); )
        this._placeToken(P, e, A, y, C, "left", _), M -= P.width, C += P.width, D++;
      for (; L >= 0 && (P = x[L], P.align === "right"); )
        this._placeToken(P, e, A, y, I, "right", _), M -= P.width, I -= P.width, L--;
      for (C += (a - (C - p) - (m - I) - M) / 2; D <= L; )
        P = x[D], this._placeToken(P, e, A, y, C + P.width / 2, "center", _), C += P.width, D++;
      y += A;
    }
  }, t.prototype._placeToken = function(e, i, n, a, o, s, l) {
    var u = i.rich[e.styleName] || {};
    u.text = e.text;
    var h = e.verticalAlign, c = a + n / 2;
    h === "top" ? c = a + e.height / 2 : h === "bottom" && (c = a + n - e.height / 2);
    var f = !e.isLineHolder && au(u);
    f && this._renderBackground(u, i, s === "right" ? o - e.width : s === "center" ? o - e.width / 2 : o, c - e.height / 2, e.width, e.height);
    var d = !!u.backgroundColor, v = e.textPadding;
    v && (o = sv(o, s, v), c -= e.height / 2 - v[0] - e.innerHeight / 2);
    var g = this._getOrCreateChild(ws), p = g.createStyle();
    g.useStyle(p);
    var y = this._defaultStyle, m = !1, _ = 0, b = ov("fill" in u ? u.fill : "fill" in i ? i.fill : (m = !0, y.fill)), w = av("stroke" in u ? u.stroke : "stroke" in i ? i.stroke : !d && !l && (!y.autoStroke || m) ? (_ = ev, y.stroke) : null), x = u.textShadowBlur > 0 || i.textShadowBlur > 0;
    p.text = e.text, p.x = o, p.y = c, x && (p.shadowBlur = u.textShadowBlur || i.textShadowBlur || 0, p.shadowColor = u.textShadowColor || i.textShadowColor || "transparent", p.shadowOffsetX = u.textShadowOffsetX || i.textShadowOffsetX || 0, p.shadowOffsetY = u.textShadowOffsetY || i.textShadowOffsetY || 0), p.textAlign = s, p.textBaseline = "middle", p.font = e.font || gi, p.opacity = Xo(u.opacity, i.opacity, 1), iv(p, u), w && (p.lineWidth = Xo(u.lineWidth, i.lineWidth, _), p.lineDash = st(u.lineDash, i.lineDash), p.lineDashOffset = i.lineDashOffset || 0, p.stroke = w), b && (p.fill = b);
    var S = e.contentWidth, A = e.contentHeight;
    g.setBoundingRect(new ot(ea(p.x, S, p.textAlign), Xi(p.y, A, p.textBaseline), S, A));
  }, t.prototype._renderBackground = function(e, i, n, a, o, s) {
    var l = e.backgroundColor, u = e.borderWidth, h = e.borderColor, c = l && l.image, f = l && !c, d = e.borderRadius, v = this, g, p;
    if (f || e.lineHeight || u && h) {
      g = this._getOrCreateChild(Mt), g.useStyle(g.createStyle()), g.style.fill = null;
      var y = g.shape;
      y.x = n, y.y = a, y.width = o, y.height = s, y.r = d, g.dirtyShape();
    }
    if (f) {
      var m = g.style;
      m.fill = l || null, m.fillOpacity = st(e.fillOpacity, 1);
    } else if (c) {
      p = this._getOrCreateChild(Lr), p.onload = function() {
        v.dirtyStyle();
      };
      var _ = p.style;
      _.image = l.image, _.x = n, _.y = a, _.width = o, _.height = s;
    }
    if (u && h) {
      var m = g.style;
      m.lineWidth = u, m.stroke = h, m.strokeOpacity = st(e.strokeOpacity, 1), m.lineDash = e.borderDash, m.lineDashOffset = e.borderDashOffset || 0, g.strokeContainThreshold = 0, g.hasFill() && g.hasStroke() && (m.strokeFirst = !0, m.lineWidth *= 2);
    }
    var b = (g || p).style;
    b.shadowBlur = e.shadowBlur || 0, b.shadowColor = e.shadowColor || "transparent", b.shadowOffsetX = e.shadowOffsetX || 0, b.shadowOffsetY = e.shadowOffsetY || 0, b.opacity = Xo(e.opacity, i.opacity, 1);
  }, t.makeFont = function(e) {
    var i = "";
    return xS(e) && (i = [
      e.fontStyle,
      e.fontWeight,
      bS(e.fontSize),
      e.fontFamily || "sans-serif"
    ].join(" ")), i && ze(i) || e.textFont || e.font;
  }, t;
}(_n), mS = { left: !0, right: 1, center: 1 }, _S = { top: 1, bottom: 1, middle: 1 }, rv = ["fontStyle", "fontWeight", "fontSize", "fontFamily"];
function bS(r) {
  return typeof r == "string" && (r.indexOf("px") !== -1 || r.indexOf("rem") !== -1 || r.indexOf("em") !== -1) ? r : isNaN(+r) ? Ic + "px" : r + "px";
}
function iv(r, t) {
  for (var e = 0; e < rv.length; e++) {
    var i = rv[e], n = t[i];
    n != null && (r[i] = n);
  }
}
function xS(r) {
  return r.fontSize != null || r.fontFamily || r.fontWeight;
}
function wS(r) {
  return nv(r), T(r.rich, nv), r;
}
function nv(r) {
  if (r) {
    r.font = Ht.makeFont(r);
    var t = r.align;
    t === "middle" && (t = "center"), r.align = t == null || mS[t] ? t : "left";
    var e = r.verticalAlign;
    e === "center" && (e = "middle"), r.verticalAlign = e == null || _S[e] ? e : "top";
    var i = r.padding;
    i && (r.padding = $c(r.padding));
  }
}
function av(r, t) {
  return r == null || t <= 0 || r === "transparent" || r === "none" ? null : r.image || r.colorStops ? "#000" : r;
}
function ov(r) {
  return r == null || r === "none" ? null : r.image || r.colorStops ? "#000" : r;
}
function sv(r, t, e) {
  return t === "right" ? r - e[1] : t === "center" ? r + e[3] / 2 - e[1] / 2 : r + e[3];
}
function lv(r) {
  var t = r.text;
  return t != null && (t += ""), t;
}
function au(r) {
  return !!(r.backgroundColor || r.lineHeight || r.borderWidth && r.borderColor);
}
var lt = Tt(), SS = function(r, t, e, i) {
  if (i) {
    var n = lt(i);
    n.dataIndex = e, n.dataType = t, n.seriesIndex = r, n.ssrType = "chart", i.type === "group" && i.traverse(function(a) {
      var o = lt(a);
      o.seriesIndex = r, o.dataIndex = e, o.dataType = t, o.ssrType = "chart";
    });
  }
}, uv = 1, hv = {}, Em = Tt(), Zc = Tt(), qc = 0, Qs = 1, Js = 2, Ge = ["emphasis", "blur", "select"], cv = ["normal", "emphasis", "blur", "select"], Ka = 10, TS = 9, fi = "highlight", es = "downplay", va = "select", rs = "unselect", pa = "toggleSelect";
function Ri(r) {
  return r != null && r !== "none";
}
function tl(r, t, e) {
  r.onHoverStateChange && (r.hoverState || 0) !== e && r.onHoverStateChange(t), r.hoverState = e;
}
function Rm(r) {
  tl(r, "emphasis", Js);
}
function $m(r) {
  r.hoverState === Js && tl(r, "normal", qc);
}
function Kc(r) {
  tl(r, "blur", Qs);
}
function Om(r) {
  r.hoverState === Qs && tl(r, "normal", qc);
}
function CS(r) {
  r.selected = !0;
}
function AS(r) {
  r.selected = !1;
}
function fv(r, t, e) {
  t(r, e);
}
function nr(r, t, e) {
  fv(r, t, e), r.isGroup && r.traverse(function(i) {
    fv(i, t, e);
  });
}
function dv(r, t) {
  switch (t) {
    case "emphasis":
      r.hoverState = Js;
      break;
    case "normal":
      r.hoverState = qc;
      break;
    case "blur":
      r.hoverState = Qs;
      break;
    case "select":
      r.selected = !0;
  }
}
function MS(r, t, e, i) {
  for (var n = r.style, a = {}, o = 0; o < t.length; o++) {
    var s = t[o], l = n[s];
    a[s] = l ?? (i && i[s]);
  }
  for (var o = 0; o < r.animators.length; o++) {
    var u = r.animators[o];
    u.__fromStateTransition && u.__fromStateTransition.indexOf(e) < 0 && u.targetName === "style" && u.saveTo(a, t);
  }
  return a;
}
function DS(r, t, e, i) {
  var n = e && rt(e, "select") >= 0, a = !1;
  if (r instanceof pt) {
    var o = Em(r), s = n && o.selectFill || o.normalFill, l = n && o.selectStroke || o.normalStroke;
    if (Ri(s) || Ri(l)) {
      i = i || {};
      var u = i.style || {};
      u.fill === "inherit" ? (a = !0, i = $({}, i), u = $({}, u), u.fill = s) : !Ri(u.fill) && Ri(s) ? (a = !0, i = $({}, i), u = $({}, u), u.fill = kd(s)) : !Ri(u.stroke) && Ri(l) && (a || (i = $({}, i), u = $({}, u)), u.stroke = kd(l)), i.style = u;
    }
  }
  if (i && i.z2 == null) {
    a || (i = $({}, i));
    var h = r.z2EmphasisLift;
    i.z2 = r.z2 + (h ?? Ka);
  }
  return i;
}
function kS(r, t, e) {
  if (e && e.z2 == null) {
    e = $({}, e);
    var i = r.z2SelectLift;
    e.z2 = r.z2 + (i ?? TS);
  }
  return e;
}
function IS(r, t, e) {
  var i = rt(r.currentStates, t) >= 0, n = r.style.opacity, a = i ? null : MS(r, ["opacity"], t, {
    opacity: 1
  });
  e = e || {};
  var o = e.style || {};
  return o.opacity == null && (e = $({}, e), o = $({
    // Already being applied 'emphasis'. DON'T mul opacity multiple times.
    opacity: i ? n : a.opacity * 0.1
  }, o), e.style = o), e;
}
function ou(r, t) {
  var e = this.states[r];
  if (this.style) {
    if (r === "emphasis")
      return DS(this, r, t, e);
    if (r === "blur")
      return IS(this, r, e);
    if (r === "select")
      return kS(this, r, e);
  }
  return e;
}
function Th(r) {
  r.stateProxy = ou;
  var t = r.getTextContent(), e = r.getTextGuideLine();
  t && (t.stateProxy = ou), e && (e.stateProxy = ou);
}
function vv(r, t) {
  !Fm(r, t) && !r.__highByOuter && nr(r, Rm);
}
function pv(r, t) {
  !Fm(r, t) && !r.__highByOuter && nr(r, $m);
}
function Ss(r, t) {
  r.__highByOuter |= 1 << (t || 0), nr(r, Rm);
}
function Ts(r, t) {
  !(r.__highByOuter &= ~(1 << (t || 0))) && nr(r, $m);
}
function Nm(r) {
  nr(r, Kc);
}
function jc(r) {
  nr(r, Om);
}
function Bm(r) {
  nr(r, CS);
}
function zm(r) {
  nr(r, AS);
}
function Fm(r, t) {
  return r.__highDownSilentOnTouch && t.zrByTouch;
}
function Hm(r) {
  var t = r.getModel(), e = [], i = [];
  t.eachComponent(function(n, a) {
    var o = Zc(a), s = n === "series", l = s ? r.getViewOfSeriesModel(a) : r.getViewOfComponentModel(a);
    !s && i.push(l), o.isBlured && (l.group.traverse(function(u) {
      Om(u);
    }), s && e.push(a)), o.isBlured = !1;
  }), T(i, function(n) {
    n && n.toggleBlurSeries && n.toggleBlurSeries(e, !1, t);
  });
}
function Ch(r, t, e, i) {
  var n = i.getModel();
  e = e || "coordinateSystem";
  function a(u, h) {
    for (var c = 0; c < h.length; c++) {
      var f = u.getItemGraphicEl(h[c]);
      f && jc(f);
    }
  }
  if (r != null && !(!t || t === "none")) {
    var o = n.getSeriesByIndex(r), s = o.coordinateSystem;
    s && s.master && (s = s.master);
    var l = [];
    n.eachSeries(function(u) {
      var h = o === u, c = u.coordinateSystem;
      c && c.master && (c = c.master);
      var f = c && s ? c === s : h;
      if (!// Not blur other series if blurScope series
      (e === "series" && !h || e === "coordinateSystem" && !f || t === "series" && h)) {
        var d = i.getViewOfSeriesModel(u);
        if (d.group.traverse(function(p) {
          p.__highByOuter && h && t === "self" || Kc(p);
        }), qt(t))
          a(u.getData(), t);
        else if (U(t))
          for (var v = xt(t), g = 0; g < v.length; g++)
            a(u.getData(v[g]), t[v[g]]);
        l.push(u), Zc(u).isBlured = !0;
      }
    }), n.eachComponent(function(u, h) {
      if (u !== "series") {
        var c = i.getViewOfComponentModel(h);
        c && c.toggleBlurSeries && c.toggleBlurSeries(l, !0, n);
      }
    });
  }
}
function Ah(r, t, e) {
  if (!(r == null || t == null)) {
    var i = e.getModel().getComponent(r, t);
    if (i) {
      Zc(i).isBlured = !0;
      var n = e.getViewOfComponentModel(i);
      !n || !n.focusBlurEnabled || n.group.traverse(function(a) {
        Kc(a);
      });
    }
  }
}
function LS(r, t, e) {
  var i = r.seriesIndex, n = r.getData(t.dataType);
  if (n) {
    var a = _i(n, t);
    a = (B(a) ? a[0] : a) || 0;
    var o = n.getItemGraphicEl(a);
    if (!o)
      for (var s = n.count(), l = 0; !o && l < s; )
        o = n.getItemGraphicEl(l++);
    if (o) {
      var u = lt(o);
      Ch(i, u.focus, u.blurScope, e);
    } else {
      var h = r.get(["emphasis", "focus"]), c = r.get(["emphasis", "blurScope"]);
      h != null && Ch(i, h, c, e);
    }
  }
}
function Qc(r, t, e, i) {
  var n = {
    focusSelf: !1,
    dispatchers: null
  };
  if (r == null || r === "series" || t == null || e == null)
    return n;
  var a = i.getModel().getComponent(r, t);
  if (!a)
    return n;
  var o = i.getViewOfComponentModel(a);
  if (!o || !o.findHighDownDispatchers)
    return n;
  for (var s = o.findHighDownDispatchers(e), l, u = 0; u < s.length; u++)
    if (lt(s[u]).focus === "self") {
      l = !0;
      break;
    }
  return {
    focusSelf: l,
    dispatchers: s
  };
}
function PS(r, t, e) {
  var i = lt(r), n = Qc(i.componentMainType, i.componentIndex, i.componentHighDownName, e), a = n.dispatchers, o = n.focusSelf;
  a ? (o && Ah(i.componentMainType, i.componentIndex, e), T(a, function(s) {
    return vv(s, t);
  })) : (Ch(i.seriesIndex, i.focus, i.blurScope, e), i.focus === "self" && Ah(i.componentMainType, i.componentIndex, e), vv(r, t));
}
function ES(r, t, e) {
  Hm(e);
  var i = lt(r), n = Qc(i.componentMainType, i.componentIndex, i.componentHighDownName, e).dispatchers;
  n ? T(n, function(a) {
    return pv(a, t);
  }) : pv(r, t);
}
function RS(r, t, e) {
  if (kh(t)) {
    var i = t.dataType, n = r.getData(i), a = _i(n, t);
    B(a) || (a = [a]), r[t.type === pa ? "toggleSelect" : t.type === va ? "select" : "unselect"](a, i);
  }
}
function gv(r) {
  var t = r.getAllData();
  T(t, function(e) {
    var i = e.data, n = e.type;
    i.eachItemGraphicEl(function(a, o) {
      r.isSelected(o, n) ? Bm(a) : zm(a);
    });
  });
}
function $S(r) {
  var t = [];
  return r.eachSeries(function(e) {
    var i = e.getAllData();
    T(i, function(n) {
      n.data;
      var a = n.type, o = e.getSelectedDataIndices();
      if (o.length > 0) {
        var s = {
          dataIndex: o,
          seriesIndex: e.seriesIndex
        };
        a != null && (s.dataType = a), t.push(s);
      }
    });
  }), t;
}
function Mh(r, t, e) {
  Qi(r, !0), nr(r, Th), Dh(r, t, e);
}
function OS(r) {
  Qi(r, !1);
}
function hn(r, t, e, i) {
  i ? OS(r) : Mh(r, t, e);
}
function Dh(r, t, e) {
  var i = lt(r);
  t != null ? (i.focus = t, i.blurScope = e) : i.focus && (i.focus = null);
}
var yv = ["emphasis", "blur", "select"], NS = {
  itemStyle: "getItemStyle",
  lineStyle: "getLineStyle",
  areaStyle: "getAreaStyle"
};
function Cs(r, t, e, i) {
  e = e || "itemStyle";
  for (var n = 0; n < yv.length; n++) {
    var a = yv[n], o = t.getModel([a, e]), s = r.ensureState(a);
    s.style = o[NS[e]]();
  }
}
function Qi(r, t) {
  var e = t === !1, i = r;
  r.highDownSilentOnTouch && (i.__highDownSilentOnTouch = r.highDownSilentOnTouch), (!e || i.__highDownDispatcher) && (i.__highByOuter = i.__highByOuter || 0, i.__highDownDispatcher = !e);
}
function Pa(r) {
  return !!(r && r.__highDownDispatcher);
}
function BS(r) {
  var t = hv[r];
  return t == null && uv <= 32 && (t = hv[r] = uv++), t;
}
function kh(r) {
  var t = r.type;
  return t === va || t === rs || t === pa;
}
function mv(r) {
  var t = r.type;
  return t === fi || t === es;
}
function zS(r) {
  var t = Em(r);
  t.normalFill = r.style.fill, t.normalStroke = r.style.stroke;
  var e = r.states.select || {};
  t.selectFill = e.style && e.style.fill || null, t.selectStroke = e.style && e.style.stroke || null;
}
var $i = bi.CMD, FS = [[], [], []], _v = Math.sqrt, HS = Math.atan2;
function VS(r, t) {
  if (t) {
    var e = r.data, i = r.len(), n, a, o, s, l, u, h = $i.M, c = $i.C, f = $i.L, d = $i.R, v = $i.A, g = $i.Q;
    for (o = 0, s = 0; o < i; ) {
      switch (n = e[o++], s = o, a = 0, n) {
        case h:
          a = 1;
          break;
        case f:
          a = 1;
          break;
        case c:
          a = 3;
          break;
        case g:
          a = 2;
          break;
        case v:
          var p = t[4], y = t[5], m = _v(t[0] * t[0] + t[1] * t[1]), _ = _v(t[2] * t[2] + t[3] * t[3]), b = HS(-t[1] / _, t[0] / m);
          e[o] *= m, e[o++] += p, e[o] *= _, e[o++] += y, e[o++] *= m, e[o++] *= _, e[o++] += b, e[o++] += b, o += 2, s = o;
          break;
        case d:
          u[0] = e[o++], u[1] = e[o++], ge(u, u, t), e[s++] = u[0], e[s++] = u[1], u[0] += e[o++], u[1] += e[o++], ge(u, u, t), e[s++] = u[0], e[s++] = u[1];
      }
      for (l = 0; l < a; l++) {
        var w = FS[l];
        w[0] = e[o++], w[1] = e[o++], ge(w, w, t), e[s++] = w[0], e[s++] = w[1];
      }
    }
    r.increaseVersion();
  }
}
var su = Math.sqrt, fo = Math.sin, vo = Math.cos, Rn = Math.PI;
function bv(r) {
  return Math.sqrt(r[0] * r[0] + r[1] * r[1]);
}
function Ih(r, t) {
  return (r[0] * t[0] + r[1] * t[1]) / (bv(r) * bv(t));
}
function xv(r, t) {
  return (r[0] * t[1] < r[1] * t[0] ? -1 : 1) * Math.acos(Ih(r, t));
}
function wv(r, t, e, i, n, a, o, s, l, u, h) {
  var c = l * (Rn / 180), f = vo(c) * (r - e) / 2 + fo(c) * (t - i) / 2, d = -1 * fo(c) * (r - e) / 2 + vo(c) * (t - i) / 2, v = f * f / (o * o) + d * d / (s * s);
  v > 1 && (o *= su(v), s *= su(v));
  var g = (n === a ? -1 : 1) * su((o * o * (s * s) - o * o * (d * d) - s * s * (f * f)) / (o * o * (d * d) + s * s * (f * f))) || 0, p = g * o * d / s, y = g * -s * f / o, m = (r + e) / 2 + vo(c) * p - fo(c) * y, _ = (t + i) / 2 + fo(c) * p + vo(c) * y, b = xv([1, 0], [(f - p) / o, (d - y) / s]), w = [(f - p) / o, (d - y) / s], x = [(-1 * f - p) / o, (-1 * d - y) / s], S = xv(w, x);
  if (Ih(w, x) <= -1 && (S = Rn), Ih(w, x) >= 1 && (S = 0), S < 0) {
    var A = Math.round(S / Rn * 1e6) / 1e6;
    S = Rn * 2 + A % 2 * Rn;
  }
  h.addData(u, m, _, o, s, b, S, c, a);
}
var GS = /([mlvhzcqtsa])([^mlvhzcqtsa]*)/ig, WS = /-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g;
function US(r) {
  var t = new bi();
  if (!r)
    return t;
  var e = 0, i = 0, n = e, a = i, o, s = bi.CMD, l = r.match(GS);
  if (!l)
    return t;
  for (var u = 0; u < l.length; u++) {
    for (var h = l[u], c = h.charAt(0), f = void 0, d = h.match(WS) || [], v = d.length, g = 0; g < v; g++)
      d[g] = parseFloat(d[g]);
    for (var p = 0; p < v; ) {
      var y = void 0, m = void 0, _ = void 0, b = void 0, w = void 0, x = void 0, S = void 0, A = e, M = i, D = void 0, C = void 0;
      switch (c) {
        case "l":
          e += d[p++], i += d[p++], f = s.L, t.addData(f, e, i);
          break;
        case "L":
          e = d[p++], i = d[p++], f = s.L, t.addData(f, e, i);
          break;
        case "m":
          e += d[p++], i += d[p++], f = s.M, t.addData(f, e, i), n = e, a = i, c = "l";
          break;
        case "M":
          e = d[p++], i = d[p++], f = s.M, t.addData(f, e, i), n = e, a = i, c = "L";
          break;
        case "h":
          e += d[p++], f = s.L, t.addData(f, e, i);
          break;
        case "H":
          e = d[p++], f = s.L, t.addData(f, e, i);
          break;
        case "v":
          i += d[p++], f = s.L, t.addData(f, e, i);
          break;
        case "V":
          i = d[p++], f = s.L, t.addData(f, e, i);
          break;
        case "C":
          f = s.C, t.addData(f, d[p++], d[p++], d[p++], d[p++], d[p++], d[p++]), e = d[p - 2], i = d[p - 1];
          break;
        case "c":
          f = s.C, t.addData(f, d[p++] + e, d[p++] + i, d[p++] + e, d[p++] + i, d[p++] + e, d[p++] + i), e += d[p - 2], i += d[p - 1];
          break;
        case "S":
          y = e, m = i, D = t.len(), C = t.data, o === s.C && (y += e - C[D - 4], m += i - C[D - 3]), f = s.C, A = d[p++], M = d[p++], e = d[p++], i = d[p++], t.addData(f, y, m, A, M, e, i);
          break;
        case "s":
          y = e, m = i, D = t.len(), C = t.data, o === s.C && (y += e - C[D - 4], m += i - C[D - 3]), f = s.C, A = e + d[p++], M = i + d[p++], e += d[p++], i += d[p++], t.addData(f, y, m, A, M, e, i);
          break;
        case "Q":
          A = d[p++], M = d[p++], e = d[p++], i = d[p++], f = s.Q, t.addData(f, A, M, e, i);
          break;
        case "q":
          A = d[p++] + e, M = d[p++] + i, e += d[p++], i += d[p++], f = s.Q, t.addData(f, A, M, e, i);
          break;
        case "T":
          y = e, m = i, D = t.len(), C = t.data, o === s.Q && (y += e - C[D - 4], m += i - C[D - 3]), e = d[p++], i = d[p++], f = s.Q, t.addData(f, y, m, e, i);
          break;
        case "t":
          y = e, m = i, D = t.len(), C = t.data, o === s.Q && (y += e - C[D - 4], m += i - C[D - 3]), e += d[p++], i += d[p++], f = s.Q, t.addData(f, y, m, e, i);
          break;
        case "A":
          _ = d[p++], b = d[p++], w = d[p++], x = d[p++], S = d[p++], A = e, M = i, e = d[p++], i = d[p++], f = s.A, wv(A, M, e, i, x, S, _, b, w, f, t);
          break;
        case "a":
          _ = d[p++], b = d[p++], w = d[p++], x = d[p++], S = d[p++], A = e, M = i, e += d[p++], i += d[p++], f = s.A, wv(A, M, e, i, x, S, _, b, w, f, t);
          break;
      }
    }
    (c === "z" || c === "Z") && (f = s.Z, t.addData(f), e = n, i = a), o = f;
  }
  return t.toStatic(), t;
}
var Vm = function(r) {
  N(t, r);
  function t() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return t.prototype.applyTransform = function(e) {
  }, t;
}(pt);
function Gm(r) {
  return r.setData != null;
}
function Wm(r, t) {
  var e = US(r), i = $({}, t);
  return i.buildPath = function(n) {
    if (Gm(n)) {
      n.setData(e.data);
      var a = n.getContext();
      a && n.rebuildPath(a, 1);
    } else {
      var a = n;
      e.rebuildPath(a, 1);
    }
  }, i.applyTransform = function(n) {
    VS(e, n), this.dirtyShape();
  }, i;
}
function YS(r, t) {
  return new Vm(Wm(r, t));
}
function XS(r, t) {
  var e = Wm(r, t), i = function(n) {
    N(a, n);
    function a(o) {
      var s = n.call(this, o) || this;
      return s.applyTransform = e.applyTransform, s.buildPath = e.buildPath, s;
    }
    return a;
  }(Vm);
  return i;
}
function ZS(r, t) {
  for (var e = [], i = r.length, n = 0; n < i; n++) {
    var a = r[n];
    e.push(a.getUpdatedPathProxy(!0));
  }
  var o = new pt(t);
  return o.createPathProxy(), o.buildPath = function(s) {
    if (Gm(s)) {
      s.appendPath(e);
      var l = s.getContext();
      l && s.rebuildPath(l, 1);
    }
  }, o;
}
var qS = /* @__PURE__ */ function() {
  function r() {
    this.cx = 0, this.cy = 0, this.r = 0;
  }
  return r;
}(), el = function(r) {
  N(t, r);
  function t(e) {
    return r.call(this, e) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new qS();
  }, t.prototype.buildPath = function(e, i) {
    e.moveTo(i.cx + i.r, i.cy), e.arc(i.cx, i.cy, i.r, 0, Math.PI * 2);
  }, t;
}(pt);
el.prototype.type = "circle";
var KS = /* @__PURE__ */ function() {
  function r() {
    this.cx = 0, this.cy = 0, this.rx = 0, this.ry = 0;
  }
  return r;
}(), Jc = function(r) {
  N(t, r);
  function t(e) {
    return r.call(this, e) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new KS();
  }, t.prototype.buildPath = function(e, i) {
    var n = 0.5522848, a = i.cx, o = i.cy, s = i.rx, l = i.ry, u = s * n, h = l * n;
    e.moveTo(a - s, o), e.bezierCurveTo(a - s, o - h, a - u, o - l, a, o - l), e.bezierCurveTo(a + u, o - l, a + s, o - h, a + s, o), e.bezierCurveTo(a + s, o + h, a + u, o + l, a, o + l), e.bezierCurveTo(a - u, o + l, a - s, o + h, a - s, o), e.closePath();
  }, t;
}(pt);
Jc.prototype.type = "ellipse";
var Um = Math.PI, lu = Um * 2, Yr = Math.sin, Oi = Math.cos, jS = Math.acos, Ot = Math.atan2, Sv = Math.abs, ga = Math.sqrt, ra = Math.max, Oe = Math.min, Te = 1e-4;
function QS(r, t, e, i, n, a, o, s) {
  var l = e - r, u = i - t, h = o - n, c = s - a, f = c * l - h * u;
  if (!(f * f < Te))
    return f = (h * (t - a) - c * (r - n)) / f, [r + f * l, t + f * u];
}
function po(r, t, e, i, n, a, o) {
  var s = r - e, l = t - i, u = (o ? a : -a) / ga(s * s + l * l), h = u * l, c = -u * s, f = r + h, d = t + c, v = e + h, g = i + c, p = (f + v) / 2, y = (d + g) / 2, m = v - f, _ = g - d, b = m * m + _ * _, w = n - a, x = f * g - v * d, S = (_ < 0 ? -1 : 1) * ga(ra(0, w * w * b - x * x)), A = (x * _ - m * S) / b, M = (-x * m - _ * S) / b, D = (x * _ + m * S) / b, C = (-x * m + _ * S) / b, I = A - p, L = M - y, P = D - p, E = C - y;
  return I * I + L * L > P * P + E * E && (A = D, M = C), {
    cx: A,
    cy: M,
    x0: -h,
    y0: -c,
    x1: A * (n / w - 1),
    y1: M * (n / w - 1)
  };
}
function JS(r) {
  var t;
  if (B(r)) {
    var e = r.length;
    if (!e)
      return r;
    e === 1 ? t = [r[0], r[0], 0, 0] : e === 2 ? t = [r[0], r[0], r[1], r[1]] : e === 3 ? t = r.concat(r[2]) : t = r;
  } else
    t = [r, r, r, r];
  return t;
}
function tT(r, t) {
  var e, i = ra(t.r, 0), n = ra(t.r0 || 0, 0), a = i > 0, o = n > 0;
  if (!(!a && !o)) {
    if (a || (i = n, n = 0), n > i) {
      var s = i;
      i = n, n = s;
    }
    var l = t.startAngle, u = t.endAngle;
    if (!(isNaN(l) || isNaN(u))) {
      var h = t.cx, c = t.cy, f = !!t.clockwise, d = Sv(u - l), v = d > lu && d % lu;
      if (v > Te && (d = v), !(i > Te))
        r.moveTo(h, c);
      else if (d > lu - Te)
        r.moveTo(h + i * Oi(l), c + i * Yr(l)), r.arc(h, c, i, l, u, !f), n > Te && (r.moveTo(h + n * Oi(u), c + n * Yr(u)), r.arc(h, c, n, u, l, f));
      else {
        var g = void 0, p = void 0, y = void 0, m = void 0, _ = void 0, b = void 0, w = void 0, x = void 0, S = void 0, A = void 0, M = void 0, D = void 0, C = void 0, I = void 0, L = void 0, P = void 0, E = i * Oi(l), R = i * Yr(l), Y = n * Oi(u), O = n * Yr(u), z = d > Te;
        if (z) {
          var Z = t.cornerRadius;
          Z && (e = JS(Z), g = e[0], p = e[1], y = e[2], m = e[3]);
          var J = Sv(i - n) / 2;
          if (_ = Oe(J, y), b = Oe(J, m), w = Oe(J, g), x = Oe(J, p), M = S = ra(_, b), D = A = ra(w, x), (S > Te || A > Te) && (C = i * Oi(u), I = i * Yr(u), L = n * Oi(l), P = n * Yr(l), d < Um)) {
            var it = QS(E, R, L, P, C, I, Y, O);
            if (it) {
              var ft = E - it[0], gt = R - it[1], _t = C - it[0], Jt = I - it[1], Ye = 1 / Yr(jS((ft * _t + gt * Jt) / (ga(ft * ft + gt * gt) * ga(_t * _t + Jt * Jt))) / 2), ct = ga(it[0] * it[0] + it[1] * it[1]);
              M = Oe(S, (i - ct) / (Ye + 1)), D = Oe(A, (n - ct) / (Ye - 1));
            }
          }
        }
        if (!z)
          r.moveTo(h + E, c + R);
        else if (M > Te) {
          var X = Oe(y, M), nt = Oe(m, M), F = po(L, P, E, R, i, X, f), W = po(C, I, Y, O, i, nt, f);
          r.moveTo(h + F.cx + F.x0, c + F.cy + F.y0), M < S && X === nt ? r.arc(h + F.cx, c + F.cy, M, Ot(F.y0, F.x0), Ot(W.y0, W.x0), !f) : (X > 0 && r.arc(h + F.cx, c + F.cy, X, Ot(F.y0, F.x0), Ot(F.y1, F.x1), !f), r.arc(h, c, i, Ot(F.cy + F.y1, F.cx + F.x1), Ot(W.cy + W.y1, W.cx + W.x1), !f), nt > 0 && r.arc(h + W.cx, c + W.cy, nt, Ot(W.y1, W.x1), Ot(W.y0, W.x0), !f));
        } else
          r.moveTo(h + E, c + R), r.arc(h, c, i, l, u, !f);
        if (!(n > Te) || !z)
          r.lineTo(h + Y, c + O);
        else if (D > Te) {
          var X = Oe(g, D), nt = Oe(p, D), F = po(Y, O, C, I, n, -nt, f), W = po(E, R, L, P, n, -X, f);
          r.lineTo(h + F.cx + F.x0, c + F.cy + F.y0), D < A && X === nt ? r.arc(h + F.cx, c + F.cy, D, Ot(F.y0, F.x0), Ot(W.y0, W.x0), !f) : (nt > 0 && r.arc(h + F.cx, c + F.cy, nt, Ot(F.y0, F.x0), Ot(F.y1, F.x1), !f), r.arc(h, c, n, Ot(F.cy + F.y1, F.cx + F.x1), Ot(W.cy + W.y1, W.cx + W.x1), f), X > 0 && r.arc(h + W.cx, c + W.cy, X, Ot(W.y1, W.x1), Ot(W.y0, W.x0), !f));
        } else
          r.lineTo(h + Y, c + O), r.arc(h, c, n, u, l, f);
      }
      r.closePath();
    }
  }
}
var eT = /* @__PURE__ */ function() {
  function r() {
    this.cx = 0, this.cy = 0, this.r0 = 0, this.r = 0, this.startAngle = 0, this.endAngle = Math.PI * 2, this.clockwise = !0, this.cornerRadius = 0;
  }
  return r;
}(), bn = function(r) {
  N(t, r);
  function t(e) {
    return r.call(this, e) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new eT();
  }, t.prototype.buildPath = function(e, i) {
    tT(e, i);
  }, t.prototype.isZeroArea = function() {
    return this.shape.startAngle === this.shape.endAngle || this.shape.r === this.shape.r0;
  }, t;
}(pt);
bn.prototype.type = "sector";
var rT = /* @__PURE__ */ function() {
  function r() {
    this.cx = 0, this.cy = 0, this.r = 0, this.r0 = 0;
  }
  return r;
}(), tf = function(r) {
  N(t, r);
  function t(e) {
    return r.call(this, e) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new rT();
  }, t.prototype.buildPath = function(e, i) {
    var n = i.cx, a = i.cy, o = Math.PI * 2;
    e.moveTo(n + i.r, a), e.arc(n, a, i.r, 0, o, !1), e.moveTo(n + i.r0, a), e.arc(n, a, i.r0, 0, o, !0);
  }, t;
}(pt);
tf.prototype.type = "ring";
function iT(r, t, e, i) {
  var n = [], a = [], o = [], s = [], l, u, h, c;
  if (i) {
    h = [1 / 0, 1 / 0], c = [-1 / 0, -1 / 0];
    for (var f = 0, d = r.length; f < d; f++)
      Zi(h, h, r[f]), qi(c, c, r[f]);
    Zi(h, h, i[0]), qi(c, c, i[1]);
  }
  for (var f = 0, d = r.length; f < d; f++) {
    var v = r[f];
    if (e)
      l = r[f ? f - 1 : d - 1], u = r[(f + 1) % d];
    else if (f === 0 || f === d - 1) {
      n.push(H1(r[f]));
      continue;
    } else
      l = r[f - 1], u = r[f + 1];
    V1(a, u, l), Al(a, a, t);
    var g = oh(v, l), p = oh(v, u), y = g + p;
    y !== 0 && (g /= y, p /= y), Al(o, a, -g), Al(s, a, p);
    var m = fd([], v, o), _ = fd([], v, s);
    i && (qi(m, m, h), Zi(m, m, c), qi(_, _, h), Zi(_, _, c)), n.push(m), n.push(_);
  }
  return e && n.push(n.shift()), n;
}
function Ym(r, t, e) {
  var i = t.smooth, n = t.points;
  if (n && n.length >= 2) {
    if (i) {
      var a = iT(n, i, e, t.smoothConstraint);
      r.moveTo(n[0][0], n[0][1]);
      for (var o = n.length, s = 0; s < (e ? o : o - 1); s++) {
        var l = a[s * 2], u = a[s * 2 + 1], h = n[(s + 1) % o];
        r.bezierCurveTo(l[0], l[1], u[0], u[1], h[0], h[1]);
      }
    } else {
      r.moveTo(n[0][0], n[0][1]);
      for (var s = 1, c = n.length; s < c; s++)
        r.lineTo(n[s][0], n[s][1]);
    }
    e && r.closePath();
  }
}
var nT = /* @__PURE__ */ function() {
  function r() {
    this.points = null, this.smooth = 0, this.smoothConstraint = null;
  }
  return r;
}(), xi = function(r) {
  N(t, r);
  function t(e) {
    return r.call(this, e) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new nT();
  }, t.prototype.buildPath = function(e, i) {
    Ym(e, i, !0);
  }, t;
}(pt);
xi.prototype.type = "polygon";
var aT = /* @__PURE__ */ function() {
  function r() {
    this.points = null, this.percent = 1, this.smooth = 0, this.smoothConstraint = null;
  }
  return r;
}(), rl = function(r) {
  N(t, r);
  function t(e) {
    return r.call(this, e) || this;
  }
  return t.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  }, t.prototype.getDefaultShape = function() {
    return new aT();
  }, t.prototype.buildPath = function(e, i) {
    Ym(e, i, !1);
  }, t;
}(pt);
rl.prototype.type = "polyline";
var oT = {}, sT = /* @__PURE__ */ function() {
  function r() {
    this.x1 = 0, this.y1 = 0, this.x2 = 0, this.y2 = 0, this.percent = 1;
  }
  return r;
}(), Ar = function(r) {
  N(t, r);
  function t(e) {
    return r.call(this, e) || this;
  }
  return t.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  }, t.prototype.getDefaultShape = function() {
    return new sT();
  }, t.prototype.buildPath = function(e, i) {
    var n, a, o, s;
    if (this.subPixelOptimize) {
      var l = Lm(oT, i, this.style);
      n = l.x1, a = l.y1, o = l.x2, s = l.y2;
    } else
      n = i.x1, a = i.y1, o = i.x2, s = i.y2;
    var u = i.percent;
    u !== 0 && (e.moveTo(n, a), u < 1 && (o = n * (1 - u) + o * u, s = a * (1 - u) + s * u), e.lineTo(o, s));
  }, t.prototype.pointAt = function(e) {
    var i = this.shape;
    return [
      i.x1 * (1 - e) + i.x2 * e,
      i.y1 * (1 - e) + i.y2 * e
    ];
  }, t;
}(pt);
Ar.prototype.type = "line";
var Gt = [], lT = /* @__PURE__ */ function() {
  function r() {
    this.x1 = 0, this.y1 = 0, this.x2 = 0, this.y2 = 0, this.cpx1 = 0, this.cpy1 = 0, this.percent = 1;
  }
  return r;
}();
function Tv(r, t, e) {
  var i = r.cpx2, n = r.cpy2;
  return i != null || n != null ? [
    (e ? Td : $t)(r.x1, r.cpx1, r.cpx2, r.x2, t),
    (e ? Td : $t)(r.y1, r.cpy1, r.cpy2, r.y2, t)
  ] : [
    (e ? Cd : Yt)(r.x1, r.cpx1, r.x2, t),
    (e ? Cd : Yt)(r.y1, r.cpy1, r.y2, t)
  ];
}
var ef = function(r) {
  N(t, r);
  function t(e) {
    return r.call(this, e) || this;
  }
  return t.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  }, t.prototype.getDefaultShape = function() {
    return new lT();
  }, t.prototype.buildPath = function(e, i) {
    var n = i.x1, a = i.y1, o = i.x2, s = i.y2, l = i.cpx1, u = i.cpy1, h = i.cpx2, c = i.cpy2, f = i.percent;
    f !== 0 && (e.moveTo(n, a), h == null || c == null ? (f < 1 && (ps(n, l, o, f, Gt), l = Gt[1], o = Gt[2], ps(a, u, s, f, Gt), u = Gt[1], s = Gt[2]), e.quadraticCurveTo(l, u, o, s)) : (f < 1 && (vs(n, l, h, o, f, Gt), l = Gt[1], h = Gt[2], o = Gt[3], vs(a, u, c, s, f, Gt), u = Gt[1], c = Gt[2], s = Gt[3]), e.bezierCurveTo(l, u, h, c, o, s)));
  }, t.prototype.pointAt = function(e) {
    return Tv(this.shape, e, !1);
  }, t.prototype.tangentAt = function(e) {
    var i = Tv(this.shape, e, !0);
    return U1(i, i);
  }, t;
}(pt);
ef.prototype.type = "bezier-curve";
var uT = /* @__PURE__ */ function() {
  function r() {
    this.cx = 0, this.cy = 0, this.r = 0, this.startAngle = 0, this.endAngle = Math.PI * 2, this.clockwise = !0;
  }
  return r;
}(), il = function(r) {
  N(t, r);
  function t(e) {
    return r.call(this, e) || this;
  }
  return t.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  }, t.prototype.getDefaultShape = function() {
    return new uT();
  }, t.prototype.buildPath = function(e, i) {
    var n = i.cx, a = i.cy, o = Math.max(i.r, 0), s = i.startAngle, l = i.endAngle, u = i.clockwise, h = Math.cos(s), c = Math.sin(s);
    e.moveTo(h * o + n, c * o + a), e.arc(n, a, o, s, l, !u);
  }, t;
}(pt);
il.prototype.type = "arc";
var hT = function(r) {
  N(t, r);
  function t() {
    var e = r !== null && r.apply(this, arguments) || this;
    return e.type = "compound", e;
  }
  return t.prototype._updatePathDirty = function() {
    for (var e = this.shape.paths, i = this.shapeChanged(), n = 0; n < e.length; n++)
      i = i || e[n].shapeChanged();
    i && this.dirtyShape();
  }, t.prototype.beforeBrush = function() {
    this._updatePathDirty();
    for (var e = this.shape.paths || [], i = this.getGlobalScale(), n = 0; n < e.length; n++)
      e[n].path || e[n].createPathProxy(), e[n].path.setScale(i[0], i[1], e[n].segmentIgnoreThreshold);
  }, t.prototype.buildPath = function(e, i) {
    for (var n = i.paths || [], a = 0; a < n.length; a++)
      n[a].buildPath(e, n[a].shape, !0);
  }, t.prototype.afterBrush = function() {
    for (var e = this.shape.paths || [], i = 0; i < e.length; i++)
      e[i].pathUpdated();
  }, t.prototype.getBoundingRect = function() {
    return this._updatePathDirty.call(this), pt.prototype.getBoundingRect.call(this);
  }, t;
}(pt), Xm = function() {
  function r(t) {
    this.colorStops = t || [];
  }
  return r.prototype.addColorStop = function(t, e) {
    this.colorStops.push({
      offset: t,
      color: e
    });
  }, r;
}(), Zm = function(r) {
  N(t, r);
  function t(e, i, n, a, o, s) {
    var l = r.call(this, o) || this;
    return l.x = e ?? 0, l.y = i ?? 0, l.x2 = n ?? 1, l.y2 = a ?? 0, l.type = "linear", l.global = s || !1, l;
  }
  return t;
}(Xm), cT = function(r) {
  N(t, r);
  function t(e, i, n, a, o) {
    var s = r.call(this, a) || this;
    return s.x = e ?? 0.5, s.y = i ?? 0.5, s.r = n ?? 0.5, s.type = "radial", s.global = o || !1, s;
  }
  return t;
}(Xm), Xr = [0, 0], Zr = [0, 0], go = new mt(), yo = new mt(), As = function() {
  function r(t, e) {
    this._corners = [], this._axes = [], this._origin = [0, 0];
    for (var i = 0; i < 4; i++)
      this._corners[i] = new mt();
    for (var i = 0; i < 2; i++)
      this._axes[i] = new mt();
    t && this.fromBoundingRect(t, e);
  }
  return r.prototype.fromBoundingRect = function(t, e) {
    var i = this._corners, n = this._axes, a = t.x, o = t.y, s = a + t.width, l = o + t.height;
    if (i[0].set(a, o), i[1].set(s, o), i[2].set(s, l), i[3].set(a, l), e)
      for (var u = 0; u < 4; u++)
        i[u].transform(e);
    mt.sub(n[0], i[1], i[0]), mt.sub(n[1], i[3], i[0]), n[0].normalize(), n[1].normalize();
    for (var u = 0; u < 2; u++)
      this._origin[u] = n[u].dot(i[0]);
  }, r.prototype.intersect = function(t, e) {
    var i = !0, n = !e;
    return go.set(1 / 0, 1 / 0), yo.set(0, 0), !this._intersectCheckOneSide(this, t, go, yo, n, 1) && (i = !1, n) || !this._intersectCheckOneSide(t, this, go, yo, n, -1) && (i = !1, n) || n || mt.copy(e, i ? go : yo), i;
  }, r.prototype._intersectCheckOneSide = function(t, e, i, n, a, o) {
    for (var s = !0, l = 0; l < 2; l++) {
      var u = this._axes[l];
      if (this._getProjMinMaxOnAxis(l, t._corners, Xr), this._getProjMinMaxOnAxis(l, e._corners, Zr), Xr[1] < Zr[0] || Xr[0] > Zr[1]) {
        if (s = !1, a)
          return s;
        var h = Math.abs(Zr[0] - Xr[1]), c = Math.abs(Xr[0] - Zr[1]);
        Math.min(h, c) > n.len() && (h < c ? mt.scale(n, u, -h * o) : mt.scale(n, u, c * o));
      } else if (i) {
        var h = Math.abs(Zr[0] - Xr[1]), c = Math.abs(Xr[0] - Zr[1]);
        Math.min(h, c) < i.len() && (h < c ? mt.scale(i, u, h * o) : mt.scale(i, u, -c * o));
      }
    }
    return s;
  }, r.prototype._getProjMinMaxOnAxis = function(t, e, i) {
    for (var n = this._axes[t], a = this._origin, o = e[0].dot(n) + a[t], s = o, l = o, u = 1; u < e.length; u++) {
      var h = e[u].dot(n) + a[t];
      s = Math.min(h, s), l = Math.max(h, l);
    }
    i[0] = s, i[1] = l;
  }, r;
}(), fT = [], dT = function(r) {
  N(t, r);
  function t() {
    var e = r !== null && r.apply(this, arguments) || this;
    return e.notClear = !0, e.incremental = !0, e._displayables = [], e._temporaryDisplayables = [], e._cursor = 0, e;
  }
  return t.prototype.traverse = function(e, i) {
    e.call(i, this);
  }, t.prototype.useStyle = function() {
    this.style = {};
  }, t.prototype.getCursor = function() {
    return this._cursor;
  }, t.prototype.innerAfterBrush = function() {
    this._cursor = this._displayables.length;
  }, t.prototype.clearDisplaybles = function() {
    this._displayables = [], this._temporaryDisplayables = [], this._cursor = 0, this.markRedraw(), this.notClear = !1;
  }, t.prototype.clearTemporalDisplayables = function() {
    this._temporaryDisplayables = [];
  }, t.prototype.addDisplayable = function(e, i) {
    i ? this._temporaryDisplayables.push(e) : this._displayables.push(e), this.markRedraw();
  }, t.prototype.addDisplayables = function(e, i) {
    i = i || !1;
    for (var n = 0; n < e.length; n++)
      this.addDisplayable(e[n], i);
  }, t.prototype.getDisplayables = function() {
    return this._displayables;
  }, t.prototype.getTemporalDisplayables = function() {
    return this._temporaryDisplayables;
  }, t.prototype.eachPendingDisplayable = function(e) {
    for (var i = this._cursor; i < this._displayables.length; i++)
      e && e(this._displayables[i]);
    for (var i = 0; i < this._temporaryDisplayables.length; i++)
      e && e(this._temporaryDisplayables[i]);
  }, t.prototype.update = function() {
    this.updateTransform();
    for (var e = this._cursor; e < this._displayables.length; e++) {
      var i = this._displayables[e];
      i.parent = this, i.update(), i.parent = null;
    }
    for (var e = 0; e < this._temporaryDisplayables.length; e++) {
      var i = this._temporaryDisplayables[e];
      i.parent = this, i.update(), i.parent = null;
    }
  }, t.prototype.getBoundingRect = function() {
    if (!this._rect) {
      for (var e = new ot(1 / 0, 1 / 0, -1 / 0, -1 / 0), i = 0; i < this._displayables.length; i++) {
        var n = this._displayables[i], a = n.getBoundingRect().clone();
        n.needLocalTransform() && a.applyTransform(n.getLocalTransform(fT)), e.union(a);
      }
      this._rect = e;
    }
    return this._rect;
  }, t.prototype.contain = function(e, i) {
    var n = this.transformCoordToLocal(e, i), a = this.getBoundingRect();
    if (a.contain(n[0], n[1]))
      for (var o = 0; o < this._displayables.length; o++) {
        var s = this._displayables[o];
        if (s.contain(e, i))
          return !0;
      }
    return !1;
  }, t;
}(_n), vT = Tt();
function pT(r, t, e, i, n) {
  var a;
  if (t && t.ecModel) {
    var o = t.ecModel.getUpdatePayload();
    a = o && o.animation;
  }
  var s = t && t.isAnimationEnabled(), l = r === "update";
  if (s) {
    var u = void 0, h = void 0, c = void 0;
    i ? (u = st(i.duration, 200), h = st(i.easing, "cubicOut"), c = 0) : (u = t.getShallow(l ? "animationDurationUpdate" : "animationDuration"), h = t.getShallow(l ? "animationEasingUpdate" : "animationEasing"), c = t.getShallow(l ? "animationDelayUpdate" : "animationDelay")), a && (a.duration != null && (u = a.duration), a.easing != null && (h = a.easing), a.delay != null && (c = a.delay)), Q(c) && (c = c(e, n)), Q(u) && (u = u(e));
    var f = {
      duration: u || 0,
      delay: c,
      easing: h
    };
    return f;
  } else
    return null;
}
function rf(r, t, e, i, n, a, o) {
  var s = !1, l;
  Q(n) ? (o = a, a = n, n = null) : U(n) && (a = n.cb, o = n.during, s = n.isFrom, l = n.removeOpt, n = n.dataIndex);
  var u = r === "leave";
  u || t.stopAnimation("leave");
  var h = pT(r, i, n, u ? l || {} : null, i && i.getAnimationDelayParams ? i.getAnimationDelayParams(t, n) : null);
  if (h && h.duration > 0) {
    var c = h.duration, f = h.delay, d = h.easing, v = {
      duration: c,
      delay: f || 0,
      easing: d,
      done: a,
      force: !!a || !!o,
      // Set to final state in update/init animation.
      // So the post processing based on the path shape can be done correctly.
      setToFinal: !u,
      scope: r,
      during: o
    };
    s ? t.animateFrom(e, v) : t.animateTo(e, v);
  } else
    t.stopAnimation(), !s && t.attr(e), o && o(1), a && a();
}
function jt(r, t, e, i, n, a) {
  rf("update", r, t, e, i, n, a);
}
function ir(r, t, e, i, n, a) {
  rf("enter", r, t, e, i, n, a);
}
function ya(r) {
  if (!r.__zr)
    return !0;
  for (var t = 0; t < r.animators.length; t++) {
    var e = r.animators[t];
    if (e.scope === "leave")
      return !0;
  }
  return !1;
}
function Ms(r, t, e, i, n, a) {
  ya(r) || rf("leave", r, t, e, i, n, a);
}
function Cv(r, t, e, i) {
  r.removeTextContent(), r.removeTextGuideLine(), Ms(r, {
    style: {
      opacity: 0
    }
  }, t, e, i);
}
function Lh(r, t, e) {
  function i() {
    r.parent && r.parent.remove(r);
  }
  r.isGroup ? r.traverse(function(n) {
    n.isGroup || Cv(n, t, e, i);
  }) : Cv(r, t, e, i);
}
function qm(r) {
  vT(r).oldStyle = r.style;
}
var Ds = Math.max, ks = Math.min, Ph = {};
function gT(r) {
  return pt.extend(r);
}
var yT = XS;
function mT(r, t) {
  return yT(r, t);
}
function Pe(r, t) {
  Ph[r] = t;
}
function _T(r) {
  if (Ph.hasOwnProperty(r))
    return Ph[r];
}
function nf(r, t, e, i) {
  var n = YS(r, t);
  return e && (i === "center" && (e = jm(e, n.getBoundingRect())), Qm(n, e)), n;
}
function Km(r, t, e) {
  var i = new Lr({
    style: {
      image: r,
      x: t.x,
      y: t.y,
      width: t.width,
      height: t.height
    },
    onload: function(n) {
      if (e === "center") {
        var a = {
          width: n.width,
          height: n.height
        };
        i.setStyle(jm(t, a));
      }
    }
  });
  return i;
}
function jm(r, t) {
  var e = t.width / t.height, i = r.height * e, n;
  i <= r.width ? n = r.height : (i = r.width, n = i / e);
  var a = r.x + r.width / 2, o = r.y + r.height / 2;
  return {
    x: a - i / 2,
    y: o - n / 2,
    width: i,
    height: n
  };
}
var bT = ZS;
function Qm(r, t) {
  if (r.applyTransform) {
    var e = r.getBoundingRect(), i = e.calculateTransform(t);
    r.applyTransform(i);
  }
}
function Ea(r, t) {
  return Lm(r, r, {
    lineWidth: t
  }), r;
}
function xT(r) {
  return Pm(r.shape, r.shape, r.style), r;
}
var wT = ni;
function af(r, t) {
  for (var e = Nc([]); r && r !== t; )
    tn(e, r.getLocalTransform(), e), r = r.parent;
  return e;
}
function of(r, t, e) {
  return t && !qt(t) && (t = Hc.getLocalTransform(t)), e && (t = zc([], t)), ge([], r, t);
}
function Jm(r, t, e) {
  var i = t[4] === 0 || t[5] === 0 || t[0] === 0 ? 1 : Math.abs(2 * t[4] / t[0]), n = t[4] === 0 || t[5] === 0 || t[2] === 0 ? 1 : Math.abs(2 * t[4] / t[2]), a = [r === "left" ? -i : r === "right" ? i : 0, r === "top" ? -n : r === "bottom" ? n : 0];
  return a = of(a, t, e), Math.abs(a[0]) > Math.abs(a[1]) ? a[0] > 0 ? "right" : "left" : a[1] > 0 ? "bottom" : "top";
}
function Av(r) {
  return !r.isGroup;
}
function ST(r) {
  return r.shape != null;
}
function t0(r, t, e) {
  if (!r || !t)
    return;
  function i(o) {
    var s = {};
    return o.traverse(function(l) {
      Av(l) && l.anid && (s[l.anid] = l);
    }), s;
  }
  function n(o) {
    var s = {
      x: o.x,
      y: o.y,
      rotation: o.rotation
    };
    return ST(o) && (s.shape = $({}, o.shape)), s;
  }
  var a = i(r);
  t.traverse(function(o) {
    if (Av(o) && o.anid) {
      var s = a[o.anid];
      if (s) {
        var l = n(o);
        o.attr(n(s)), jt(o, l, e, lt(o).dataIndex);
      }
    }
  });
}
function e0(r, t) {
  return H(r, function(e) {
    var i = e[0];
    i = Ds(i, t.x), i = ks(i, t.x + t.width);
    var n = e[1];
    return n = Ds(n, t.y), n = ks(n, t.y + t.height), [i, n];
  });
}
function TT(r, t) {
  var e = Ds(r.x, t.x), i = ks(r.x + r.width, t.x + t.width), n = Ds(r.y, t.y), a = ks(r.y + r.height, t.y + t.height);
  if (i >= e && a >= n)
    return {
      x: e,
      y: n,
      width: i - e,
      height: a - n
    };
}
function sf(r, t, e) {
  var i = $({
    rectHover: !0
  }, t), n = i.style = {
    strokeNoScale: !0
  };
  if (e = e || {
    x: -1,
    y: -1,
    width: 2,
    height: 2
  }, r)
    return r.indexOf("image://") === 0 ? (n.image = r.slice(8), ht(n, e), new Lr(i)) : nf(r.replace("path://", ""), i, e, "center");
}
function ia(r, t, e, i, n) {
  for (var a = 0, o = n[n.length - 1]; a < n.length; a++) {
    var s = n[a];
    if (r0(r, t, e, i, s[0], s[1], o[0], o[1]))
      return !0;
    o = s;
  }
}
function r0(r, t, e, i, n, a, o, s) {
  var l = e - r, u = i - t, h = o - n, c = s - a, f = uu(h, c, l, u);
  if (CT(f))
    return !1;
  var d = r - n, v = t - a, g = uu(d, v, l, u) / f;
  if (g < 0 || g > 1)
    return !1;
  var p = uu(d, v, h, c) / f;
  return !(p < 0 || p > 1);
}
function uu(r, t, e, i) {
  return r * i - e * t;
}
function CT(r) {
  return r <= 1e-6 && r >= -1e-6;
}
function nl(r) {
  var t = r.itemTooltipOption, e = r.componentModel, i = r.itemName, n = V(t) ? {
    formatter: t
  } : t, a = e.mainType, o = e.componentIndex, s = {
    componentType: a,
    name: i,
    $vars: ["name"]
  };
  s[a + "Index"] = o;
  var l = r.formatterParamsExtra;
  l && T(xt(l), function(h) {
    yi(s, h) || (s[h] = l[h], s.$vars.push(h));
  });
  var u = lt(r.el);
  u.componentMainType = a, u.componentIndex = o, u.tooltipConfig = {
    name: i,
    option: ht({
      content: i,
      encodeHTMLContent: !0,
      formatterParams: s
    }, n)
  };
}
function Mv(r, t) {
  var e;
  r.isGroup && (e = t(r)), e || r.traverse(t);
}
function al(r, t) {
  if (r)
    if (B(r))
      for (var e = 0; e < r.length; e++)
        Mv(r[e], t);
    else
      Mv(r, t);
}
Pe("circle", el);
Pe("ellipse", Jc);
Pe("sector", bn);
Pe("ring", tf);
Pe("polygon", xi);
Pe("polyline", rl);
Pe("rect", Mt);
Pe("line", Ar);
Pe("bezierCurve", ef);
Pe("arc", il);
const AT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Arc: il,
  BezierCurve: ef,
  BoundingRect: ot,
  Circle: el,
  CompoundPath: hT,
  Ellipse: Jc,
  Group: St,
  Image: Lr,
  IncrementalDisplayable: dT,
  Line: Ar,
  LinearGradient: Zm,
  OrientedBoundingRect: As,
  Path: pt,
  Point: mt,
  Polygon: xi,
  Polyline: rl,
  RadialGradient: cT,
  Rect: Mt,
  Ring: tf,
  Sector: bn,
  Text: Ht,
  applyTransform: of,
  clipPointsByRect: e0,
  clipRectByRect: TT,
  createIcon: sf,
  extendPath: mT,
  extendShape: gT,
  getShapeClass: _T,
  getTransform: af,
  groupTransition: t0,
  initProps: ir,
  isElementRemoved: ya,
  lineLineIntersect: r0,
  linePolygonIntersect: ia,
  makeImage: Km,
  makePath: nf,
  mergePath: bT,
  registerShape: Pe,
  removeElement: Ms,
  removeElementWithFadeOut: Lh,
  resizePath: Qm,
  setTooltipConfig: nl,
  subPixelOptimize: wT,
  subPixelOptimizeLine: Ea,
  subPixelOptimizeRect: xT,
  transformDirection: Jm,
  traverseElements: al,
  updateProps: jt
}, Symbol.toStringTag, { value: "Module" }));
var ol = {};
function MT(r, t) {
  for (var e = 0; e < Ge.length; e++) {
    var i = Ge[e], n = t[i], a = r.ensureState(i);
    a.style = a.style || {}, a.style.text = n;
  }
  var o = r.currentStates.slice();
  r.clearStates(!0), r.setStyle({
    text: t.normal
  }), r.useStates(o, !0);
}
function Dv(r, t, e) {
  var i = r.labelFetcher, n = r.labelDataIndex, a = r.labelDimIndex, o = t.normal, s;
  i && (s = i.getFormattedLabel(n, "normal", null, a, o && o.get("formatter"), e != null ? {
    interpolatedValue: e
  } : null)), s == null && (s = Q(r.defaultText) ? r.defaultText(n, r, e) : r.defaultText);
  for (var l = {
    normal: s
  }, u = 0; u < Ge.length; u++) {
    var h = Ge[u], c = t[h];
    l[h] = st(i ? i.getFormattedLabel(n, h, null, a, c && c.get("formatter")) : null, s);
  }
  return l;
}
function xn(r, t, e, i) {
  e = e || ol;
  for (var n = r instanceof Ht, a = !1, o = 0; o < cv.length; o++) {
    var s = t[cv[o]];
    if (s && s.getShallow("show")) {
      a = !0;
      break;
    }
  }
  var l = n ? r : r.getTextContent();
  if (a) {
    n || (l || (l = new Ht(), r.setTextContent(l)), r.stateProxy && (l.stateProxy = r.stateProxy));
    var u = Dv(e, t), h = t.normal, c = !!h.getShallow("show"), f = Mr(h, i && i.normal, e, !1, !n);
    f.text = u.normal, n || r.setTextConfig(kv(h, e, !1));
    for (var o = 0; o < Ge.length; o++) {
      var d = Ge[o], s = t[d];
      if (s) {
        var v = l.ensureState(d), g = !!st(s.getShallow("show"), c);
        if (g !== c && (v.ignore = !g), v.style = Mr(s, i && i[d], e, !0, !n), v.style.text = u[d], !n) {
          var p = r.ensureState(d);
          p.textConfig = kv(s, e, !0);
        }
      }
    }
    l.silent = !!h.getShallow("silent"), l.style.x != null && (f.x = l.style.x), l.style.y != null && (f.y = l.style.y), l.ignore = !c, l.useStyle(f), l.dirty(), e.enableTextSetter && (sl(l).setLabelText = function(y) {
      var m = Dv(e, t, y);
      MT(l, m);
    });
  } else l && (l.ignore = !0);
  r.dirty();
}
function wn(r, t) {
  t = t || "label";
  for (var e = {
    normal: r.getModel(t)
  }, i = 0; i < Ge.length; i++) {
    var n = Ge[i];
    e[n] = r.getModel([n, t]);
  }
  return e;
}
function Mr(r, t, e, i, n) {
  var a = {};
  return DT(a, r, e, i, n), t && $(a, t), a;
}
function kv(r, t, e) {
  t = t || {};
  var i = {}, n, a = r.getShallow("rotate"), o = st(r.getShallow("distance"), e ? null : 5), s = r.getShallow("offset");
  return n = r.getShallow("position") || (e ? null : "inside"), n === "outside" && (n = t.defaultOutsidePosition || "top"), n != null && (i.position = n), s != null && (i.offset = s), a != null && (a *= Math.PI / 180, i.rotation = a), o != null && (i.distance = o), i.outsideFill = r.get("color") === "inherit" ? t.inheritColor || null : "auto", i;
}
function DT(r, t, e, i, n) {
  e = e || ol;
  var a = t.ecModel, o = a && a.option.textStyle, s = kT(t), l;
  if (s) {
    l = {};
    for (var u in s)
      if (s.hasOwnProperty(u)) {
        var h = t.getModel(["rich", u]);
        Ev(l[u] = {}, h, o, e, i, n, !1, !0);
      }
  }
  l && (r.rich = l);
  var c = t.get("overflow");
  c && (r.overflow = c);
  var f = t.get("minMargin");
  f != null && (r.margin = f), Ev(r, t, o, e, i, n, !0, !1);
}
function kT(r) {
  for (var t; r && r !== r.ecModel; ) {
    var e = (r.option || ol).rich;
    if (e) {
      t = t || {};
      for (var i = xt(e), n = 0; n < i.length; n++) {
        var a = i[n];
        t[a] = 1;
      }
    }
    r = r.parentModel;
  }
  return t;
}
var Iv = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "textShadowColor", "textShadowBlur", "textShadowOffsetX", "textShadowOffsetY"], Lv = ["align", "lineHeight", "width", "height", "tag", "verticalAlign", "ellipsis"], Pv = ["padding", "borderWidth", "borderRadius", "borderDashOffset", "backgroundColor", "borderColor", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY"];
function Ev(r, t, e, i, n, a, o, s) {
  e = !n && e || ol;
  var l = i && i.inheritColor, u = t.getShallow("color"), h = t.getShallow("textBorderColor"), c = st(t.getShallow("opacity"), e.opacity);
  (u === "inherit" || u === "auto") && (l ? u = l : u = null), (h === "inherit" || h === "auto") && (l ? h = l : h = null), a || (u = u || e.color, h = h || e.textBorderColor), u != null && (r.fill = u), h != null && (r.stroke = h);
  var f = st(t.getShallow("textBorderWidth"), e.textBorderWidth);
  f != null && (r.lineWidth = f);
  var d = st(t.getShallow("textBorderType"), e.textBorderType);
  d != null && (r.lineDash = d);
  var v = st(t.getShallow("textBorderDashOffset"), e.textBorderDashOffset);
  v != null && (r.lineDashOffset = v), !n && c == null && !s && (c = i && i.defaultOpacity), c != null && (r.opacity = c), !n && !a && r.fill == null && i.inheritColor && (r.fill = i.inheritColor);
  for (var g = 0; g < Iv.length; g++) {
    var p = Iv[g], y = st(t.getShallow(p), e[p]);
    y != null && (r[p] = y);
  }
  for (var g = 0; g < Lv.length; g++) {
    var p = Lv[g], y = t.getShallow(p);
    y != null && (r[p] = y);
  }
  if (r.verticalAlign == null) {
    var m = t.getShallow("baseline");
    m != null && (r.verticalAlign = m);
  }
  if (!o || !i.disableBox) {
    for (var g = 0; g < Pv.length; g++) {
      var p = Pv[g], y = t.getShallow(p);
      y != null && (r[p] = y);
    }
    var _ = t.getShallow("borderType");
    _ != null && (r.borderDash = _), (r.backgroundColor === "auto" || r.backgroundColor === "inherit") && l && (r.backgroundColor = l), (r.borderColor === "auto" || r.borderColor === "inherit") && l && (r.borderColor = l);
  }
}
function IT(r, t) {
  var e = t && t.getModel("textStyle");
  return ze([
    // FIXME in node-canvas fontWeight is before fontStyle
    r.fontStyle || e && e.getShallow("fontStyle") || "",
    r.fontWeight || e && e.getShallow("fontWeight") || "",
    (r.fontSize || e && e.getShallow("fontSize") || 12) + "px",
    r.fontFamily || e && e.getShallow("fontFamily") || "sans-serif"
  ].join(" "));
}
var sl = Tt();
function LT(r, t, e, i) {
  if (r) {
    var n = sl(r);
    n.prevValue = n.value, n.value = e;
    var a = t.normal;
    n.valueAnimation = a.get("valueAnimation"), n.valueAnimation && (n.precision = a.get("precision"), n.defaultInterpolatedText = i, n.statesModels = t);
  }
}
var PT = ["textStyle", "color"], hu = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "padding", "lineHeight", "rich", "width", "height", "overflow"], cu = new Ht(), ET = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.getTextColor = function(t) {
      var e = this.ecModel;
      return this.getShallow("color") || (!t && e ? e.get(PT) : null);
    }, r.prototype.getFont = function() {
      return IT({
        fontStyle: this.getShallow("fontStyle"),
        fontWeight: this.getShallow("fontWeight"),
        fontSize: this.getShallow("fontSize"),
        fontFamily: this.getShallow("fontFamily")
      }, this.ecModel);
    }, r.prototype.getTextRect = function(t) {
      for (var e = {
        text: t,
        verticalAlign: this.getShallow("verticalAlign") || this.getShallow("baseline")
      }, i = 0; i < hu.length; i++)
        e[hu[i]] = this.getShallow(hu[i]);
      return cu.useStyle(e), cu.update(), cu.getBoundingRect();
    }, r;
  }()
), i0 = [
  ["lineWidth", "width"],
  ["stroke", "color"],
  ["opacity"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["shadowColor"],
  ["lineDash", "type"],
  ["lineDashOffset", "dashOffset"],
  ["lineCap", "cap"],
  ["lineJoin", "join"],
  ["miterLimit"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
], RT = un(i0), $T = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.getLineStyle = function(t) {
      return RT(this, t);
    }, r;
  }()
), n0 = [
  ["fill", "color"],
  ["stroke", "borderColor"],
  ["lineWidth", "borderWidth"],
  ["opacity"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["shadowColor"],
  ["lineDash", "borderType"],
  ["lineDashOffset", "borderDashOffset"],
  ["lineCap", "borderCap"],
  ["lineJoin", "borderJoin"],
  ["miterLimit", "borderMiterLimit"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
], OT = un(n0), NT = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.getItemStyle = function(t, e) {
      return OT(this, t, e);
    }, r;
  }()
), bt = (
  /** @class */
  function() {
    function r(t, e, i) {
      this.parentModel = e, this.ecModel = i, this.option = t;
    }
    return r.prototype.init = function(t, e, i) {
    }, r.prototype.mergeOption = function(t, e) {
      ut(this.option, t, !0);
    }, r.prototype.get = function(t, e) {
      return t == null ? this.option : this._doGet(this.parsePath(t), !e && this.parentModel);
    }, r.prototype.getShallow = function(t, e) {
      var i = this.option, n = i == null ? i : i[t];
      if (n == null && !e) {
        var a = this.parentModel;
        a && (n = a.getShallow(t));
      }
      return n;
    }, r.prototype.getModel = function(t, e) {
      var i = t != null, n = i ? this.parsePath(t) : null, a = i ? this._doGet(n) : this.option;
      return e = e || this.parentModel && this.parentModel.getModel(this.resolveParentPath(n)), new r(a, e, this.ecModel);
    }, r.prototype.isEmpty = function() {
      return this.option == null;
    }, r.prototype.restoreData = function() {
    }, r.prototype.clone = function() {
      var t = this.constructor;
      return new t(K(this.option));
    }, r.prototype.parsePath = function(t) {
      return typeof t == "string" ? t.split(".") : t;
    }, r.prototype.resolveParentPath = function(t) {
      return t;
    }, r.prototype.isAnimationEnabled = function() {
      if (!j.node && this.option) {
        if (this.option.animation != null)
          return !!this.option.animation;
        if (this.parentModel)
          return this.parentModel.isAnimationEnabled();
      }
    }, r.prototype._doGet = function(t, e) {
      var i = this.option;
      if (!t)
        return i;
      for (var n = 0; n < t.length && !(t[n] && (i = i && typeof i == "object" ? i[t[n]] : null, i == null)); n++)
        ;
      return i == null && e && (i = e._doGet(this.resolveParentPath(t), e.parentModel)), i;
    }, r;
  }()
);
Xc(bt);
Iw(bt);
Le(bt, $T);
Le(bt, NT);
Le(bt, $w);
Le(bt, ET);
var BT = Math.round(Math.random() * 10);
function ll(r) {
  return [r || "", BT++].join("_");
}
function zT(r) {
  var t = {};
  r.registerSubTypeDefaulter = function(e, i) {
    var n = He(e);
    t[n.main] = i;
  }, r.determineSubType = function(e, i) {
    var n = i.type;
    if (!n) {
      var a = He(e).main;
      r.hasSubTypes(e) && t[a] && (n = t[a](i));
    }
    return n;
  };
}
function FT(r, t) {
  r.topologicalTravel = function(a, o, s, l) {
    if (!a.length)
      return;
    var u = e(o), h = u.graph, c = u.noEntryList, f = {};
    for (T(a, function(m) {
      f[m] = !0;
    }); c.length; ) {
      var d = c.pop(), v = h[d], g = !!f[d];
      g && (s.call(l, d, v.originalDeps.slice()), delete f[d]), T(v.successor, g ? y : p);
    }
    T(f, function() {
      var m = "";
      throw new Error(m);
    });
    function p(m) {
      h[m].entryCount--, h[m].entryCount === 0 && c.push(m);
    }
    function y(m) {
      f[m] = !0, p(m);
    }
  };
  function e(a) {
    var o = {}, s = [];
    return T(a, function(l) {
      var u = i(o, l), h = u.originalDeps = t(l), c = n(h, a);
      u.entryCount = c.length, u.entryCount === 0 && s.push(l), T(c, function(f) {
        rt(u.predecessor, f) < 0 && u.predecessor.push(f);
        var d = i(o, f);
        rt(d.successor, f) < 0 && d.successor.push(l);
      });
    }), {
      graph: o,
      noEntryList: s
    };
  }
  function i(a, o) {
    return a[o] || (a[o] = {
      predecessor: [],
      successor: []
    }), a[o];
  }
  function n(a, o) {
    var s = [];
    return T(a, function(l) {
      rt(o, l) >= 0 && s.push(l);
    }), s;
  }
}
function a0(r, t) {
  return ut(ut({}, r, !0), t, !0);
}
const HT = {
  time: {
    month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayOfWeekAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  },
  legend: {
    selector: {
      all: "All",
      inverse: "Inv"
    }
  },
  toolbox: {
    brush: {
      title: {
        rect: "Box Select",
        polygon: "Lasso Select",
        lineX: "Horizontally Select",
        lineY: "Vertically Select",
        keep: "Keep Selections",
        clear: "Clear Selections"
      }
    },
    dataView: {
      title: "Data View",
      lang: ["Data View", "Close", "Refresh"]
    },
    dataZoom: {
      title: {
        zoom: "Zoom",
        back: "Zoom Reset"
      }
    },
    magicType: {
      title: {
        line: "Switch to Line Chart",
        bar: "Switch to Bar Chart",
        stack: "Stack",
        tiled: "Tile"
      }
    },
    restore: {
      title: "Restore"
    },
    saveAsImage: {
      title: "Save as Image",
      lang: ["Right Click to Save Image"]
    }
  },
  series: {
    typeNames: {
      pie: "Pie chart",
      bar: "Bar chart",
      line: "Line chart",
      scatter: "Scatter plot",
      effectScatter: "Ripple scatter plot",
      radar: "Radar chart",
      tree: "Tree",
      treemap: "Treemap",
      boxplot: "Boxplot",
      candlestick: "Candlestick",
      k: "K line chart",
      heatmap: "Heat map",
      map: "Map",
      parallel: "Parallel coordinate map",
      lines: "Line graph",
      graph: "Relationship graph",
      sankey: "Sankey diagram",
      funnel: "Funnel chart",
      gauge: "Gauge",
      pictorialBar: "Pictorial bar",
      themeRiver: "Theme River Map",
      sunburst: "Sunburst",
      custom: "Custom chart",
      chart: "Chart"
    }
  },
  aria: {
    general: {
      withTitle: 'This is a chart about "{title}"',
      withoutTitle: "This is a chart"
    },
    series: {
      single: {
        prefix: "",
        withName: " with type {seriesType} named {seriesName}.",
        withoutName: " with type {seriesType}."
      },
      multiple: {
        prefix: ". It consists of {seriesCount} series count.",
        withName: " The {seriesId} series is a {seriesType} representing {seriesName}.",
        withoutName: " The {seriesId} series is a {seriesType}.",
        separator: {
          middle: "",
          end: ""
        }
      }
    },
    data: {
      allData: "The data is as follows: ",
      partialData: "The first {displayCnt} items are: ",
      withName: "the data for {name} is {value}",
      withoutName: "{value}",
      separator: {
        middle: ", ",
        end: ". "
      }
    }
  }
}, VT = {
  time: {
    month: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthAbbr: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    dayOfWeek: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    dayOfWeekAbbr: ["日", "一", "二", "三", "四", "五", "六"]
  },
  legend: {
    selector: {
      all: "全选",
      inverse: "反选"
    }
  },
  toolbox: {
    brush: {
      title: {
        rect: "矩形选择",
        polygon: "圈选",
        lineX: "横向选择",
        lineY: "纵向选择",
        keep: "保持选择",
        clear: "清除选择"
      }
    },
    dataView: {
      title: "数据视图",
      lang: ["数据视图", "关闭", "刷新"]
    },
    dataZoom: {
      title: {
        zoom: "区域缩放",
        back: "区域缩放还原"
      }
    },
    magicType: {
      title: {
        line: "切换为折线图",
        bar: "切换为柱状图",
        stack: "切换为堆叠",
        tiled: "切换为平铺"
      }
    },
    restore: {
      title: "还原"
    },
    saveAsImage: {
      title: "保存为图片",
      lang: ["右键另存为图片"]
    }
  },
  series: {
    typeNames: {
      pie: "饼图",
      bar: "柱状图",
      line: "折线图",
      scatter: "散点图",
      effectScatter: "涟漪散点图",
      radar: "雷达图",
      tree: "树图",
      treemap: "矩形树图",
      boxplot: "箱型图",
      candlestick: "K线图",
      k: "K线图",
      heatmap: "热力图",
      map: "地图",
      parallel: "平行坐标图",
      lines: "线图",
      graph: "关系图",
      sankey: "桑基图",
      funnel: "漏斗图",
      gauge: "仪表盘图",
      pictorialBar: "象形柱图",
      themeRiver: "主题河流图",
      sunburst: "旭日图",
      custom: "自定义图表",
      chart: "图表"
    }
  },
  aria: {
    general: {
      withTitle: "这是一个关于“{title}”的图表。",
      withoutTitle: "这是一个图表，"
    },
    series: {
      single: {
        prefix: "",
        withName: "图表类型是{seriesType}，表示{seriesName}。",
        withoutName: "图表类型是{seriesType}。"
      },
      multiple: {
        prefix: "它由{seriesCount}个图表系列组成。",
        withName: "第{seriesId}个系列是一个表示{seriesName}的{seriesType}，",
        withoutName: "第{seriesId}个系列是一个{seriesType}，",
        separator: {
          middle: "；",
          end: "。"
        }
      }
    },
    data: {
      allData: "其数据是——",
      partialData: "其中，前{displayCnt}项是——",
      withName: "{name}的数据是{value}",
      withoutName: "{value}",
      separator: {
        middle: "，",
        end: ""
      }
    }
  }
};
var Is = "ZH", lf = "EN", rn = lf, is = {}, uf = {}, o0 = j.domSupported ? function() {
  var r = (
    /* eslint-disable-next-line */
    (document.documentElement.lang || navigator.language || navigator.browserLanguage || rn).toUpperCase()
  );
  return r.indexOf(Is) > -1 ? Is : rn;
}() : rn;
function s0(r, t) {
  r = r.toUpperCase(), uf[r] = new bt(t), is[r] = t;
}
function GT(r) {
  if (V(r)) {
    var t = is[r.toUpperCase()] || {};
    return r === Is || r === lf ? K(t) : ut(K(t), K(is[rn]), !1);
  } else
    return ut(K(r), K(is[rn]), !1);
}
function WT(r) {
  return uf[r];
}
function UT() {
  return uf[rn];
}
s0(lf, HT);
s0(Is, VT);
var hf = 1e3, cf = hf * 60, ma = cf * 60, ve = ma * 24, Rv = ve * 365, na = {
  year: "{yyyy}",
  month: "{MMM}",
  day: "{d}",
  hour: "{HH}:{mm}",
  minute: "{HH}:{mm}",
  second: "{HH}:{mm}:{ss}",
  millisecond: "{HH}:{mm}:{ss} {SSS}",
  none: "{yyyy}-{MM}-{dd} {HH}:{mm}:{ss} {SSS}"
}, mo = "{yyyy}-{MM}-{dd}", $v = {
  year: "{yyyy}",
  month: "{yyyy}-{MM}",
  day: mo,
  hour: mo + " " + na.hour,
  minute: mo + " " + na.minute,
  second: mo + " " + na.second,
  millisecond: na.none
}, fu = ["year", "month", "day", "hour", "minute", "second", "millisecond"], l0 = ["year", "half-year", "quarter", "month", "week", "half-week", "day", "half-day", "quarter-day", "hour", "minute", "second", "millisecond"];
function lr(r, t) {
  return r += "", "0000".substr(0, t - r.length) + r;
}
function nn(r) {
  switch (r) {
    case "half-year":
    case "quarter":
      return "month";
    case "week":
    case "half-week":
      return "day";
    case "half-day":
    case "quarter-day":
      return "hour";
    default:
      return r;
  }
}
function YT(r) {
  return r === nn(r);
}
function XT(r) {
  switch (r) {
    case "year":
    case "month":
      return "day";
    case "millisecond":
      return "millisecond";
    default:
      return "second";
  }
}
function ul(r, t, e, i) {
  var n = rr(r), a = n[ff(e)](), o = n[an(e)]() + 1, s = Math.floor((o - 1) / 3) + 1, l = n[hl(e)](), u = n["get" + (e ? "UTC" : "") + "Day"](), h = n[Ra(e)](), c = (h - 1) % 12 + 1, f = n[cl(e)](), d = n[fl(e)](), v = n[dl(e)](), g = h >= 12 ? "pm" : "am", p = g.toUpperCase(), y = i instanceof bt ? i : WT(i || o0) || UT(), m = y.getModel("time"), _ = m.get("month"), b = m.get("monthAbbr"), w = m.get("dayOfWeek"), x = m.get("dayOfWeekAbbr");
  return (t || "").replace(/{a}/g, g + "").replace(/{A}/g, p + "").replace(/{yyyy}/g, a + "").replace(/{yy}/g, lr(a % 100 + "", 2)).replace(/{Q}/g, s + "").replace(/{MMMM}/g, _[o - 1]).replace(/{MMM}/g, b[o - 1]).replace(/{MM}/g, lr(o, 2)).replace(/{M}/g, o + "").replace(/{dd}/g, lr(l, 2)).replace(/{d}/g, l + "").replace(/{eeee}/g, w[u]).replace(/{ee}/g, x[u]).replace(/{e}/g, u + "").replace(/{HH}/g, lr(h, 2)).replace(/{H}/g, h + "").replace(/{hh}/g, lr(c + "", 2)).replace(/{h}/g, c + "").replace(/{mm}/g, lr(f, 2)).replace(/{m}/g, f + "").replace(/{ss}/g, lr(d, 2)).replace(/{s}/g, d + "").replace(/{SSS}/g, lr(v, 3)).replace(/{S}/g, v + "");
}
function ZT(r, t, e, i, n) {
  var a = null;
  if (V(e))
    a = e;
  else if (Q(e))
    a = e(r.value, t, {
      level: r.level
    });
  else {
    var o = $({}, na);
    if (r.level > 0)
      for (var s = 0; s < fu.length; ++s)
        o[fu[s]] = "{primary|" + o[fu[s]] + "}";
    var l = e ? e.inherit === !1 ? e : ht(e, o) : o, u = u0(r.value, n);
    if (l[u])
      a = l[u];
    else if (l.inherit) {
      for (var h = l0.indexOf(u), s = h - 1; s >= 0; --s)
        if (l[u]) {
          a = l[u];
          break;
        }
      a = a || o.none;
    }
    if (B(a)) {
      var c = r.level == null ? 0 : r.level >= 0 ? r.level : a.length + r.level;
      c = Math.min(c, a.length - 1), a = a[c];
    }
  }
  return ul(new Date(r.value), a, n, i);
}
function u0(r, t) {
  var e = rr(r), i = e[an(t)]() + 1, n = e[hl(t)](), a = e[Ra(t)](), o = e[cl(t)](), s = e[fl(t)](), l = e[dl(t)](), u = l === 0, h = u && s === 0, c = h && o === 0, f = c && a === 0, d = f && n === 1, v = d && i === 1;
  return v ? "year" : d ? "month" : f ? "day" : c ? "hour" : h ? "minute" : u ? "second" : "millisecond";
}
function Ov(r, t, e) {
  var i = wt(r) ? rr(r) : r;
  switch (t = t || u0(r, e), t) {
    case "year":
      return i[ff(e)]();
    case "half-year":
      return i[an(e)]() >= 6 ? 1 : 0;
    case "quarter":
      return Math.floor((i[an(e)]() + 1) / 4);
    case "month":
      return i[an(e)]();
    case "day":
      return i[hl(e)]();
    case "half-day":
      return i[Ra(e)]() / 24;
    case "hour":
      return i[Ra(e)]();
    case "minute":
      return i[cl(e)]();
    case "second":
      return i[fl(e)]();
    case "millisecond":
      return i[dl(e)]();
  }
}
function ff(r) {
  return r ? "getUTCFullYear" : "getFullYear";
}
function an(r) {
  return r ? "getUTCMonth" : "getMonth";
}
function hl(r) {
  return r ? "getUTCDate" : "getDate";
}
function Ra(r) {
  return r ? "getUTCHours" : "getHours";
}
function cl(r) {
  return r ? "getUTCMinutes" : "getMinutes";
}
function fl(r) {
  return r ? "getUTCSeconds" : "getSeconds";
}
function dl(r) {
  return r ? "getUTCMilliseconds" : "getMilliseconds";
}
function qT(r) {
  return r ? "setUTCFullYear" : "setFullYear";
}
function h0(r) {
  return r ? "setUTCMonth" : "setMonth";
}
function c0(r) {
  return r ? "setUTCDate" : "setDate";
}
function f0(r) {
  return r ? "setUTCHours" : "setHours";
}
function d0(r) {
  return r ? "setUTCMinutes" : "setMinutes";
}
function v0(r) {
  return r ? "setUTCSeconds" : "setSeconds";
}
function p0(r) {
  return r ? "setUTCMilliseconds" : "setMilliseconds";
}
function g0(r) {
  if (!uw(r))
    return V(r) ? r : "-";
  var t = (r + "").split(".");
  return t[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,") + (t.length > 1 ? "." + t[1] : "");
}
function y0(r, t) {
  return r = (r || "").toLowerCase().replace(/-(.)/g, function(e, i) {
    return i.toUpperCase();
  }), t && r && (r = r.charAt(0).toUpperCase() + r.slice(1)), r;
}
var ja = $c;
function Eh(r, t, e) {
  var i = "{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}";
  function n(h) {
    return h && ze(h) ? h : "-";
  }
  function a(h) {
    return !!(h != null && !isNaN(h) && isFinite(h));
  }
  var o = t === "time", s = r instanceof Date;
  if (o || s) {
    var l = o ? rr(r) : r;
    if (isNaN(+l)) {
      if (s)
        return "-";
    } else return ul(l, i, e);
  }
  if (t === "ordinal")
    return ah(r) ? n(r) : wt(r) && a(r) ? r + "" : "-";
  var u = xs(r);
  return a(u) ? g0(u) : ah(r) ? n(r) : typeof r == "boolean" ? r + "" : "-";
}
var Nv = ["a", "b", "c", "d", "e", "f", "g"], du = function(r, t) {
  return "{" + r + (t ?? "") + "}";
};
function m0(r, t, e) {
  B(t) || (t = [t]);
  var i = t.length;
  if (!i)
    return "";
  for (var n = t[0].$vars || [], a = 0; a < n.length; a++) {
    var o = Nv[a];
    r = r.replace(du(o), du(o, 0));
  }
  for (var s = 0; s < i; s++)
    for (var l = 0; l < n.length; l++) {
      var u = t[s][n[l]];
      r = r.replace(du(Nv[l], s), e ? Ut(u) : u);
    }
  return r;
}
function KT(r, t) {
  var e = V(r) ? {
    color: r,
    extraCssText: t
  } : r || {}, i = e.color, n = e.type;
  t = e.extraCssText;
  var a = e.renderMode || "html";
  if (!i)
    return "";
  if (a === "html")
    return n === "subItem" ? '<span style="display:inline-block;vertical-align:middle;margin-right:8px;margin-left:3px;border-radius:4px;width:4px;height:4px;background-color:' + Ut(i) + ";" + (t || "") + '"></span>' : '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' + Ut(i) + ";" + (t || "") + '"></span>';
  var o = e.markerId || "markerX";
  return {
    renderMode: a,
    content: "{" + o + "|}  ",
    style: n === "subItem" ? {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: i
    } : {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: i
    }
  };
}
function wi(r, t) {
  return t = t || "transparent", V(r) ? r : U(r) && r.colorStops && (r.colorStops[0] || {}).color || t;
}
function jT(r, t) {
  if (t === "_blank" || t === "blank") {
    var e = window.open();
    e.opener = null, e.location.href = r;
  } else
    window.open(r, t);
}
var ns = T, QT = ["left", "right", "top", "bottom", "width", "height"], _o = [["width", "left", "right"], ["height", "top", "bottom"]];
function df(r, t, e, i, n) {
  var a = 0, o = 0;
  i == null && (i = 1 / 0), n == null && (n = 1 / 0);
  var s = 0;
  t.eachChild(function(l, u) {
    var h = l.getBoundingRect(), c = t.childAt(u + 1), f = c && c.getBoundingRect(), d, v;
    if (r === "horizontal") {
      var g = h.width + (f ? -f.x + h.x : 0);
      d = a + g, d > i || l.newline ? (a = 0, d = g, o += s + e, s = h.height) : s = Math.max(s, h.height);
    } else {
      var p = h.height + (f ? -f.y + h.y : 0);
      v = o + p, v > n || l.newline ? (a += s + e, o = 0, v = p, s = h.width) : s = Math.max(s, h.width);
    }
    l.newline || (l.x = a, l.y = o, l.markRedraw(), r === "horizontal" ? a = d + e : o = v + e);
  });
}
var _a = df;
et(df, "vertical");
et(df, "horizontal");
function JT(r, t, e) {
  var i = t.width, n = t.height, a = Ct(r.left, i), o = Ct(r.top, n), s = Ct(r.right, i), l = Ct(r.bottom, n);
  return (isNaN(a) || isNaN(parseFloat(r.left))) && (a = 0), (isNaN(s) || isNaN(parseFloat(r.right))) && (s = i), (isNaN(o) || isNaN(parseFloat(r.top))) && (o = 0), (isNaN(l) || isNaN(parseFloat(r.bottom))) && (l = n), e = ja(e || 0), {
    width: Math.max(s - a - e[1] - e[3], 0),
    height: Math.max(l - o - e[0] - e[2], 0)
  };
}
function cn(r, t, e) {
  e = ja(e || 0);
  var i = t.width, n = t.height, a = Ct(r.left, i), o = Ct(r.top, n), s = Ct(r.right, i), l = Ct(r.bottom, n), u = Ct(r.width, i), h = Ct(r.height, n), c = e[2] + e[0], f = e[1] + e[3], d = r.aspect;
  switch (isNaN(u) && (u = i - s - f - a), isNaN(h) && (h = n - l - c - o), d != null && (isNaN(u) && isNaN(h) && (d > i / n ? u = i * 0.8 : h = n * 0.8), isNaN(u) && (u = d * h), isNaN(h) && (h = u / d)), isNaN(a) && (a = i - s - u - f), isNaN(o) && (o = n - l - h - c), r.left || r.right) {
    case "center":
      a = i / 2 - u / 2 - e[3];
      break;
    case "right":
      a = i - u - f;
      break;
  }
  switch (r.top || r.bottom) {
    case "middle":
    case "center":
      o = n / 2 - h / 2 - e[0];
      break;
    case "bottom":
      o = n - h - c;
      break;
  }
  a = a || 0, o = o || 0, isNaN(u) && (u = i - f - a - (s || 0)), isNaN(h) && (h = n - c - o - (l || 0));
  var v = new ot(a + e[3], o + e[0], u, h);
  return v.margin = e, v;
}
function tC(r, t, e, i, n, a) {
  a = a || r, a.x = r.x, a.y = r.y;
  var o;
  if (o = r.getBoundingRect(), r.needLocalTransform()) {
    var s = r.getLocalTransform();
    o = o.clone(), o.applyTransform(s);
  }
  var l = cn(ht({
    width: o.width,
    height: o.height
  }, t), e, i), u = l.x - o.x, h = l.y - o.y;
  return a.x += u, a.y += h, a === r && r.markRedraw(), !0;
}
function $a(r) {
  var t = r.layoutMode || r.constructor.layoutMode;
  return U(t) ? t : t ? {
    type: t
  } : null;
}
function fn(r, t, e) {
  var i = e && e.ignoreSize;
  !B(i) && (i = [i, i]);
  var n = o(_o[0], 0), a = o(_o[1], 1);
  u(_o[0], r, n), u(_o[1], r, a);
  function o(h, c) {
    var f = {}, d = 0, v = {}, g = 0, p = 2;
    if (ns(h, function(_) {
      v[_] = r[_];
    }), ns(h, function(_) {
      s(t, _) && (f[_] = v[_] = t[_]), l(f, _) && d++, l(v, _) && g++;
    }), i[c])
      return l(t, h[1]) ? v[h[2]] = null : l(t, h[2]) && (v[h[1]] = null), v;
    if (g === p || !d)
      return v;
    if (d >= p)
      return f;
    for (var y = 0; y < h.length; y++) {
      var m = h[y];
      if (!s(f, m) && s(r, m)) {
        f[m] = r[m];
        break;
      }
    }
    return f;
  }
  function s(h, c) {
    return h.hasOwnProperty(c);
  }
  function l(h, c) {
    return h[c] != null && h[c] !== "auto";
  }
  function u(h, c, f) {
    ns(h, function(d) {
      c[d] = f[d];
    });
  }
}
function vl(r) {
  return eC({}, r);
}
function eC(r, t) {
  return t && r && ns(QT, function(e) {
    t.hasOwnProperty(e) && (r[e] = t[e]);
  }), r;
}
var rC = Tt(), dt = (
  /** @class */
  function(r) {
    N(t, r);
    function t(e, i, n) {
      var a = r.call(this, e, i, n) || this;
      return a.uid = ll("ec_cpt_model"), a;
    }
    return t.prototype.init = function(e, i, n) {
      this.mergeDefaultAndTheme(e, n);
    }, t.prototype.mergeDefaultAndTheme = function(e, i) {
      var n = $a(this), a = n ? vl(e) : {}, o = i.getTheme();
      ut(e, o.get(this.mainType)), ut(e, this.getDefaultOption()), n && fn(e, a, n);
    }, t.prototype.mergeOption = function(e, i) {
      ut(this.option, e, !0);
      var n = $a(this);
      n && fn(this.option, e, n);
    }, t.prototype.optionUpdated = function(e, i) {
    }, t.prototype.getDefaultOption = function() {
      var e = this.constructor;
      if (!Mw(e))
        return e.defaultOption;
      var i = rC(this);
      if (!i.defaultOption) {
        for (var n = [], a = e; a; ) {
          var o = a.prototype.defaultOption;
          o && n.push(o), a = a.superClass;
        }
        for (var s = {}, l = n.length - 1; l >= 0; l--)
          s = ut(s, n[l], !0);
        i.defaultOption = s;
      }
      return i.defaultOption;
    }, t.prototype.getReferringComponents = function(e, i) {
      var n = e + "Index", a = e + "Id";
      return qa(this.ecModel, e, {
        index: this.get(n, !0),
        id: this.get(a, !0)
      }, i);
    }, t.prototype.getBoxLayoutParams = function() {
      var e = this;
      return {
        left: e.get("left"),
        top: e.get("top"),
        right: e.get("right"),
        bottom: e.get("bottom"),
        width: e.get("width"),
        height: e.get("height")
      };
    }, t.prototype.getZLevelKey = function() {
      return "";
    }, t.prototype.setZLevel = function(e) {
      this.option.zlevel = e;
    }, t.protoInitialize = function() {
      var e = t.prototype;
      e.type = "component", e.id = "", e.name = "", e.mainType = "", e.subType = "", e.componentIndex = 0;
    }(), t;
  }(bt)
);
Tm(dt, bt);
qs(dt);
zT(dt);
FT(dt, iC);
function iC(r) {
  var t = [];
  return T(dt.getClassesByMainType(r), function(e) {
    t = t.concat(e.dependencies || e.prototype.dependencies || []);
  }), t = H(t, function(e) {
    return He(e).main;
  }), r !== "dataset" && rt(t, "dataset") <= 0 && t.unshift("dataset"), t;
}
var _0 = "";
typeof navigator < "u" && (_0 = navigator.platform || "");
var Ni = "rgba(0, 0, 0, 0.2)";
const nC = {
  darkMode: "auto",
  // backgroundColor: 'rgba(0,0,0,0)',
  colorBy: "series",
  color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
  gradientColor: ["#f6efa6", "#d88273", "#bf444c"],
  aria: {
    decal: {
      decals: [{
        color: Ni,
        dashArrayX: [1, 0],
        dashArrayY: [2, 5],
        symbolSize: 1,
        rotation: Math.PI / 6
      }, {
        color: Ni,
        symbol: "circle",
        dashArrayX: [[8, 8], [0, 8, 8, 0]],
        dashArrayY: [6, 0],
        symbolSize: 0.8
      }, {
        color: Ni,
        dashArrayX: [1, 0],
        dashArrayY: [4, 3],
        rotation: -Math.PI / 4
      }, {
        color: Ni,
        dashArrayX: [[6, 6], [0, 6, 6, 0]],
        dashArrayY: [6, 0]
      }, {
        color: Ni,
        dashArrayX: [[1, 0], [1, 6]],
        dashArrayY: [1, 0, 6, 0],
        rotation: Math.PI / 4
      }, {
        color: Ni,
        symbol: "triangle",
        dashArrayX: [[9, 9], [0, 9, 9, 0]],
        dashArrayY: [7, 2],
        symbolSize: 0.75
      }]
    }
  },
  // If xAxis and yAxis declared, grid is created by default.
  // grid: {},
  textStyle: {
    // color: '#000',
    // decoration: 'none',
    // PENDING
    fontFamily: _0.match(/^Win/) ? "Microsoft YaHei" : "sans-serif",
    // fontFamily: 'Arial, Verdana, sans-serif',
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal"
  },
  // http://blogs.adobe.com/webplatform/2014/02/24/using-blend-modes-in-html-canvas/
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
  // Default is source-over
  blendMode: null,
  stateAnimation: {
    duration: 300,
    easing: "cubicOut"
  },
  animation: "auto",
  animationDuration: 1e3,
  animationDurationUpdate: 500,
  animationEasing: "cubicInOut",
  animationEasingUpdate: "cubicInOut",
  animationThreshold: 2e3,
  // Configuration for progressive/incremental rendering
  progressiveThreshold: 3e3,
  progressive: 400,
  // Threshold of if use single hover layer to optimize.
  // It is recommended that `hoverLayerThreshold` is equivalent to or less than
  // `progressiveThreshold`, otherwise hover will cause restart of progressive,
  // which is unexpected.
  // see example <echarts/test/heatmap-large.html>.
  hoverLayerThreshold: 3e3,
  // See: module:echarts/scale/Time
  useUTC: !1
};
var b0 = tt(["tooltip", "label", "itemName", "itemId", "itemGroupId", "itemChildGroupId", "seriesName"]), xe = "original", Qt = "arrayRows", We = "objectRows", ar = "keyedColumns", Sr = "typedArray", x0 = "unknown", Ve = "column", Sn = "row", te = {
  Must: 1,
  Might: 2,
  Not: 3
  // Other cases
}, w0 = Tt();
function aC(r) {
  w0(r).datasetMap = tt();
}
function oC(r, t, e) {
  var i = {}, n = S0(t);
  if (!n || !r)
    return i;
  var a = [], o = [], s = t.ecModel, l = w0(s).datasetMap, u = n.uid + "_" + e.seriesLayoutBy, h, c;
  r = r.slice(), T(r, function(g, p) {
    var y = U(g) ? g : r[p] = {
      name: g
    };
    y.type === "ordinal" && h == null && (h = p, c = v(y)), i[y.name] = [];
  });
  var f = l.get(u) || l.set(u, {
    categoryWayDim: c,
    valueWayDim: 0
  });
  T(r, function(g, p) {
    var y = g.name, m = v(g);
    if (h == null) {
      var _ = f.valueWayDim;
      d(i[y], _, m), d(o, _, m), f.valueWayDim += m;
    } else if (h === p)
      d(i[y], 0, m), d(a, 0, m);
    else {
      var _ = f.categoryWayDim;
      d(i[y], _, m), d(o, _, m), f.categoryWayDim += m;
    }
  });
  function d(g, p, y) {
    for (var m = 0; m < y; m++)
      g.push(p + m);
  }
  function v(g) {
    var p = g.dimsDef;
    return p ? p.length : 1;
  }
  return a.length && (i.itemName = a), o.length && (i.seriesName = o), i;
}
function S0(r) {
  var t = r.get("data", !0);
  if (!t)
    return qa(r.ecModel, "dataset", {
      index: r.get("datasetIndex", !0),
      id: r.get("datasetId", !0)
    }, Me).models[0];
}
function sC(r) {
  return !r.get("transform", !0) && !r.get("fromTransformResult", !0) ? [] : qa(r.ecModel, "dataset", {
    index: r.get("fromDatasetIndex", !0),
    id: r.get("fromDatasetId", !0)
  }, Me).models;
}
function T0(r, t) {
  return lC(r.data, r.sourceFormat, r.seriesLayoutBy, r.dimensionsDefine, r.startIndex, t);
}
function lC(r, t, e, i, n, a) {
  var o, s = 5;
  if (Kt(r))
    return te.Not;
  var l, u;
  if (i) {
    var h = i[a];
    U(h) ? (l = h.name, u = h.type) : V(h) && (l = h);
  }
  if (u != null)
    return u === "ordinal" ? te.Must : te.Not;
  if (t === Qt) {
    var c = r;
    if (e === Sn) {
      for (var f = c[a], d = 0; d < (f || []).length && d < s; d++)
        if ((o = b(f[n + d])) != null)
          return o;
    } else
      for (var d = 0; d < c.length && d < s; d++) {
        var v = c[n + d];
        if (v && (o = b(v[a])) != null)
          return o;
      }
  } else if (t === We) {
    var g = r;
    if (!l)
      return te.Not;
    for (var d = 0; d < g.length && d < s; d++) {
      var p = g[d];
      if (p && (o = b(p[l])) != null)
        return o;
    }
  } else if (t === ar) {
    var y = r;
    if (!l)
      return te.Not;
    var f = y[l];
    if (!f || Kt(f))
      return te.Not;
    for (var d = 0; d < f.length && d < s; d++)
      if ((o = b(f[d])) != null)
        return o;
  } else if (t === xe)
    for (var m = r, d = 0; d < m.length && d < s; d++) {
      var p = m[d], _ = Za(p);
      if (!B(_))
        return te.Not;
      if ((o = b(_[a])) != null)
        return o;
    }
  function b(w) {
    var x = V(w);
    if (w != null && Number.isFinite(Number(w)) && w !== "")
      return x ? te.Might : te.Not;
    if (x && w !== "-")
      return te.Must;
  }
  return te.Not;
}
var uC = tt();
function hC(r, t, e) {
  var i = uC.get(t);
  if (!i)
    return e;
  var n = i(r);
  return n ? e.concat(n) : e;
}
var Bv = Tt(), cC = Tt(), vf = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.getColorFromPalette = function(t, e, i) {
      var n = Rt(this.get("color", !0)), a = this.get("colorLayer", !0);
      return C0(this, Bv, n, a, t, e, i);
    }, r.prototype.clearColorPalette = function() {
      vC(this, Bv);
    }, r;
  }()
);
function fC(r, t, e, i) {
  var n = Rt(r.get(["aria", "decal", "decals"]));
  return C0(r, cC, n, null, t, e, i);
}
function dC(r, t) {
  for (var e = r.length, i = 0; i < e; i++)
    if (r[i].length > t)
      return r[i];
  return r[e - 1];
}
function C0(r, t, e, i, n, a, o) {
  a = a || r;
  var s = t(a), l = s.paletteIdx || 0, u = s.paletteNameMap = s.paletteNameMap || {};
  if (u.hasOwnProperty(n))
    return u[n];
  var h = o == null || !i ? e : dC(i, o);
  if (h = h || e, !(!h || !h.length)) {
    var c = h[l];
    return n && (u[n] = c), s.paletteIdx = (l + 1) % h.length, c;
  }
}
function vC(r, t) {
  t(r).paletteIdx = 0, t(r).paletteNameMap = {};
}
var bo, $n, zv, Fv = "\0_ec_inner", pC = 1, pf = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.prototype.init = function(e, i, n, a, o, s) {
      a = a || {}, this.option = null, this._theme = new bt(a), this._locale = new bt(o), this._optionManager = s;
    }, t.prototype.setOption = function(e, i, n) {
      var a = Gv(i);
      this._optionManager.setOption(e, n, a), this._resetOption(null, a);
    }, t.prototype.resetOption = function(e, i) {
      return this._resetOption(e, Gv(i));
    }, t.prototype._resetOption = function(e, i) {
      var n = !1, a = this._optionManager;
      if (!e || e === "recreate") {
        var o = a.mountOption(e === "recreate");
        !this.option || e === "recreate" ? zv(this, o) : (this.restoreData(), this._mergeOption(o, i)), n = !0;
      }
      if ((e === "timeline" || e === "media") && this.restoreData(), !e || e === "recreate" || e === "timeline") {
        var s = a.getTimelineOption(this);
        s && (n = !0, this._mergeOption(s, i));
      }
      if (!e || e === "recreate" || e === "media") {
        var l = a.getMediaOption(this);
        l.length && T(l, function(u) {
          n = !0, this._mergeOption(u, i);
        }, this);
      }
      return n;
    }, t.prototype.mergeOption = function(e) {
      this._mergeOption(e, null);
    }, t.prototype._mergeOption = function(e, i) {
      var n = this.option, a = this._componentsMap, o = this._componentsCount, s = [], l = tt(), u = i && i.replaceMergeMainTypeMap;
      aC(this), T(e, function(c, f) {
        c != null && (dt.hasClass(f) ? f && (s.push(f), l.set(f, !0)) : n[f] = n[f] == null ? K(c) : ut(n[f], c, !0));
      }), u && u.each(function(c, f) {
        dt.hasClass(f) && !l.get(f) && (s.push(f), l.set(f, !0));
      }), dt.topologicalTravel(s, dt.getAllClassMainTypes(), h, this);
      function h(c) {
        var f = hC(this, c, Rt(e[c])), d = a.get(c), v = (
          // `!oldCmptList` means init. See the comment in `mappingToExists`
          d ? u && u.get(c) ? "replaceMerge" : "normalMerge" : "replaceAll"
        ), g = fw(d, f, v);
        _w(g, c, dt), n[c] = null, a.set(c, null), o.set(c, 0);
        var p = [], y = [], m = 0, _;
        T(g, function(b, w) {
          var x = b.existing, S = b.newOption;
          if (!S)
            x && (x.mergeOption({}, this), x.optionUpdated({}, !1));
          else {
            var A = c === "series", M = dt.getClass(
              c,
              b.keyInfo.subType,
              !A
              // Give a more detailed warn later if series don't exists
            );
            if (!M)
              return;
            if (c === "tooltip") {
              if (_)
                return;
              _ = !0;
            }
            if (x && x.constructor === M)
              x.name = b.keyInfo.name, x.mergeOption(S, this), x.optionUpdated(S, !1);
            else {
              var D = $({
                componentIndex: w
              }, b.keyInfo);
              x = new M(S, this, this, D), $(x, D), b.brandNew && (x.__requireNewView = !0), x.init(S, this, this), x.optionUpdated(null, !0);
            }
          }
          x ? (p.push(x.option), y.push(x), m++) : (p.push(void 0), y.push(void 0));
        }, this), n[c] = p, a.set(c, y), o.set(c, m), c === "series" && bo(this);
      }
      this._seriesIndices || bo(this);
    }, t.prototype.getOption = function() {
      var e = K(this.option);
      return T(e, function(i, n) {
        if (dt.hasClass(n)) {
          for (var a = Rt(i), o = a.length, s = !1, l = o - 1; l >= 0; l--)
            a[l] && !La(a[l]) ? s = !0 : (a[l] = null, !s && o--);
          a.length = o, e[n] = a;
        }
      }), delete e[Fv], e;
    }, t.prototype.getTheme = function() {
      return this._theme;
    }, t.prototype.getLocaleModel = function() {
      return this._locale;
    }, t.prototype.setUpdatePayload = function(e) {
      this._payload = e;
    }, t.prototype.getUpdatePayload = function() {
      return this._payload;
    }, t.prototype.getComponent = function(e, i) {
      var n = this._componentsMap.get(e);
      if (n) {
        var a = n[i || 0];
        if (a)
          return a;
        if (i == null) {
          for (var o = 0; o < n.length; o++)
            if (n[o])
              return n[o];
        }
      }
    }, t.prototype.queryComponents = function(e) {
      var i = e.mainType;
      if (!i)
        return [];
      var n = e.index, a = e.id, o = e.name, s = this._componentsMap.get(i);
      if (!s || !s.length)
        return [];
      var l;
      return n != null ? (l = [], T(Rt(n), function(u) {
        s[u] && l.push(s[u]);
      })) : a != null ? l = Hv("id", a, s) : o != null ? l = Hv("name", o, s) : l = Pt(s, function(u) {
        return !!u;
      }), Vv(l, e);
    }, t.prototype.findComponents = function(e) {
      var i = e.query, n = e.mainType, a = s(i), o = a ? this.queryComponents(a) : Pt(this._componentsMap.get(n), function(u) {
        return !!u;
      });
      return l(Vv(o, e));
      function s(u) {
        var h = n + "Index", c = n + "Id", f = n + "Name";
        return u && (u[h] != null || u[c] != null || u[f] != null) ? {
          mainType: n,
          // subType will be filtered finally.
          index: u[h],
          id: u[c],
          name: u[f]
        } : null;
      }
      function l(u) {
        return e.filter ? Pt(u, e.filter) : u;
      }
    }, t.prototype.eachComponent = function(e, i, n) {
      var a = this._componentsMap;
      if (Q(e)) {
        var o = i, s = e;
        a.each(function(c, f) {
          for (var d = 0; c && d < c.length; d++) {
            var v = c[d];
            v && s.call(o, f, v, v.componentIndex);
          }
        });
      } else
        for (var l = V(e) ? a.get(e) : U(e) ? this.findComponents(e) : null, u = 0; l && u < l.length; u++) {
          var h = l[u];
          h && i.call(n, h, h.componentIndex);
        }
    }, t.prototype.getSeriesByName = function(e) {
      var i = ie(e, null);
      return Pt(this._componentsMap.get("series"), function(n) {
        return !!n && i != null && n.name === i;
      });
    }, t.prototype.getSeriesByIndex = function(e) {
      return this._componentsMap.get("series")[e];
    }, t.prototype.getSeriesByType = function(e) {
      return Pt(this._componentsMap.get("series"), function(i) {
        return !!i && i.subType === e;
      });
    }, t.prototype.getSeries = function() {
      return Pt(this._componentsMap.get("series"), function(e) {
        return !!e;
      });
    }, t.prototype.getSeriesCount = function() {
      return this._componentsCount.get("series");
    }, t.prototype.eachSeries = function(e, i) {
      $n(this), T(this._seriesIndices, function(n) {
        var a = this._componentsMap.get("series")[n];
        e.call(i, a, n);
      }, this);
    }, t.prototype.eachRawSeries = function(e, i) {
      T(this._componentsMap.get("series"), function(n) {
        n && e.call(i, n, n.componentIndex);
      });
    }, t.prototype.eachSeriesByType = function(e, i, n) {
      $n(this), T(this._seriesIndices, function(a) {
        var o = this._componentsMap.get("series")[a];
        o.subType === e && i.call(n, o, a);
      }, this);
    }, t.prototype.eachRawSeriesByType = function(e, i, n) {
      return T(this.getSeriesByType(e), i, n);
    }, t.prototype.isSeriesFiltered = function(e) {
      return $n(this), this._seriesIndicesMap.get(e.componentIndex) == null;
    }, t.prototype.getCurrentSeriesIndices = function() {
      return (this._seriesIndices || []).slice();
    }, t.prototype.filterSeries = function(e, i) {
      $n(this);
      var n = [];
      T(this._seriesIndices, function(a) {
        var o = this._componentsMap.get("series")[a];
        e.call(i, o, a) && n.push(a);
      }, this), this._seriesIndices = n, this._seriesIndicesMap = tt(n);
    }, t.prototype.restoreData = function(e) {
      bo(this);
      var i = this._componentsMap, n = [];
      i.each(function(a, o) {
        dt.hasClass(o) && n.push(o);
      }), dt.topologicalTravel(n, dt.getAllClassMainTypes(), function(a) {
        T(i.get(a), function(o) {
          o && (a !== "series" || !gC(o, e)) && o.restoreData();
        });
      });
    }, t.internalField = function() {
      bo = function(e) {
        var i = e._seriesIndices = [];
        T(e._componentsMap.get("series"), function(n) {
          n && i.push(n.componentIndex);
        }), e._seriesIndicesMap = tt(i);
      }, $n = function(e) {
      }, zv = function(e, i) {
        e.option = {}, e.option[Fv] = pC, e._componentsMap = tt({
          series: []
        }), e._componentsCount = tt();
        var n = i.aria;
        U(n) && n.enabled == null && (n.enabled = !0), yC(i, e._theme.option), ut(i, nC, !1), e._mergeOption(i, null);
      };
    }(), t;
  }(bt)
);
function gC(r, t) {
  if (t) {
    var e = t.seriesIndex, i = t.seriesId, n = t.seriesName;
    return e != null && r.componentIndex !== e || i != null && r.id !== i || n != null && r.name !== n;
  }
}
function yC(r, t) {
  var e = r.color && !r.colorLayer;
  T(t, function(i, n) {
    n === "colorLayer" && e || dt.hasClass(n) || (typeof i == "object" ? r[n] = r[n] ? ut(r[n], i, !1) : K(i) : r[n] == null && (r[n] = i));
  });
}
function Hv(r, t, e) {
  if (B(t)) {
    var i = tt();
    return T(t, function(a) {
      if (a != null) {
        var o = ie(a, null);
        o != null && i.set(a, !0);
      }
    }), Pt(e, function(a) {
      return a && i.get(a[r]);
    });
  } else {
    var n = ie(t, null);
    return Pt(e, function(a) {
      return a && n != null && a[r] === n;
    });
  }
}
function Vv(r, t) {
  return t.hasOwnProperty("subType") ? Pt(r, function(e) {
    return e && e.subType === t.subType;
  }) : r;
}
function Gv(r) {
  var t = tt();
  return r && T(Rt(r.replaceMerge), function(e) {
    t.set(e, !0);
  }), {
    replaceMergeMainTypeMap: t
  };
}
Le(pf, vf);
var mC = [
  "getDom",
  "getZr",
  "getWidth",
  "getHeight",
  "getDevicePixelRatio",
  "dispatchAction",
  "isSSR",
  "isDisposed",
  "on",
  "off",
  "getDataURL",
  "getConnectedDataURL",
  // 'getModel',
  "getOption",
  // 'getViewOfComponentModel',
  // 'getViewOfSeriesModel',
  "getId",
  "updateLabelLayout"
], A0 = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(t) {
      T(mC, function(e) {
        this[e] = at(t[e], t);
      }, this);
    }
    return r;
  }()
), vu = {}, gf = (
  /** @class */
  function() {
    function r() {
      this._coordinateSystems = [];
    }
    return r.prototype.create = function(t, e) {
      var i = [];
      T(vu, function(n, a) {
        var o = n.create(t, e);
        i = i.concat(o || []);
      }), this._coordinateSystems = i;
    }, r.prototype.update = function(t, e) {
      T(this._coordinateSystems, function(i) {
        i.update && i.update(t, e);
      });
    }, r.prototype.getCoordinateSystems = function() {
      return this._coordinateSystems.slice();
    }, r.register = function(t, e) {
      vu[t] = e;
    }, r.get = function(t) {
      return vu[t];
    }, r;
  }()
), _C = /^(min|max)?(.+)$/, bC = (
  /** @class */
  function() {
    function r(t) {
      this._timelineOptions = [], this._mediaList = [], this._currentMediaIndices = [], this._api = t;
    }
    return r.prototype.setOption = function(t, e, i) {
      t && (T(Rt(t.series), function(o) {
        o && o.data && Kt(o.data) && hs(o.data);
      }), T(Rt(t.dataset), function(o) {
        o && o.source && Kt(o.source) && hs(o.source);
      })), t = K(t);
      var n = this._optionBackup, a = xC(t, e, !n);
      this._newBaseOption = a.baseOption, n ? (a.timelineOptions.length && (n.timelineOptions = a.timelineOptions), a.mediaList.length && (n.mediaList = a.mediaList), a.mediaDefault && (n.mediaDefault = a.mediaDefault)) : this._optionBackup = a;
    }, r.prototype.mountOption = function(t) {
      var e = this._optionBackup;
      return this._timelineOptions = e.timelineOptions, this._mediaList = e.mediaList, this._mediaDefault = e.mediaDefault, this._currentMediaIndices = [], K(t ? e.baseOption : this._newBaseOption);
    }, r.prototype.getTimelineOption = function(t) {
      var e, i = this._timelineOptions;
      if (i.length) {
        var n = t.getComponent("timeline");
        n && (e = K(
          // FIXME:TS as TimelineModel or quivlant interface
          i[n.getCurrentIndex()]
        ));
      }
      return e;
    }, r.prototype.getMediaOption = function(t) {
      var e = this._api.getWidth(), i = this._api.getHeight(), n = this._mediaList, a = this._mediaDefault, o = [], s = [];
      if (!n.length && !a)
        return s;
      for (var l = 0, u = n.length; l < u; l++)
        wC(n[l].query, e, i) && o.push(l);
      return !o.length && a && (o = [-1]), o.length && !TC(o, this._currentMediaIndices) && (s = H(o, function(h) {
        return K(h === -1 ? a.option : n[h].option);
      })), this._currentMediaIndices = o, s;
    }, r;
  }()
);
function xC(r, t, e) {
  var i = [], n, a, o = r.baseOption, s = r.timeline, l = r.options, u = r.media, h = !!r.media, c = !!(l || s || o && o.timeline);
  o ? (a = o, a.timeline || (a.timeline = s)) : ((c || h) && (r.options = r.media = null), a = r), h && B(u) && T(u, function(d) {
    d && d.option && (d.query ? i.push(d) : n || (n = d));
  }), f(a), T(l, function(d) {
    return f(d);
  }), T(i, function(d) {
    return f(d.option);
  });
  function f(d) {
    T(t, function(v) {
      v(d, e);
    });
  }
  return {
    baseOption: a,
    timelineOptions: l || [],
    mediaDefault: n,
    mediaList: i
  };
}
function wC(r, t, e) {
  var i = {
    width: t,
    height: e,
    aspectratio: t / e
    // lower case for convenience.
  }, n = !0;
  return T(r, function(a, o) {
    var s = o.match(_C);
    if (!(!s || !s[1] || !s[2])) {
      var l = s[1], u = s[2].toLowerCase();
      SC(i[u], a, l) || (n = !1);
    }
  }), n;
}
function SC(r, t, e) {
  return e === "min" ? r >= t : e === "max" ? r <= t : r === t;
}
function TC(r, t) {
  return r.join(",") === t.join(",");
}
var we = T, Oa = U, Wv = ["areaStyle", "lineStyle", "nodeStyle", "linkStyle", "chordStyle", "label", "labelLine"];
function pu(r) {
  var t = r && r.itemStyle;
  if (t)
    for (var e = 0, i = Wv.length; e < i; e++) {
      var n = Wv[e], a = t.normal, o = t.emphasis;
      a && a[n] && (r[n] = r[n] || {}, r[n].normal ? ut(r[n].normal, a[n]) : r[n].normal = a[n], a[n] = null), o && o[n] && (r[n] = r[n] || {}, r[n].emphasis ? ut(r[n].emphasis, o[n]) : r[n].emphasis = o[n], o[n] = null);
    }
}
function zt(r, t, e) {
  if (r && r[t] && (r[t].normal || r[t].emphasis)) {
    var i = r[t].normal, n = r[t].emphasis;
    i && (e ? (r[t].normal = r[t].emphasis = null, ht(r[t], i)) : r[t] = i), n && (r.emphasis = r.emphasis || {}, r.emphasis[t] = n, n.focus && (r.emphasis.focus = n.focus), n.blurScope && (r.emphasis.blurScope = n.blurScope));
  }
}
function aa(r) {
  zt(r, "itemStyle"), zt(r, "lineStyle"), zt(r, "areaStyle"), zt(r, "label"), zt(r, "labelLine"), zt(r, "upperLabel"), zt(r, "edgeLabel");
}
function It(r, t) {
  var e = Oa(r) && r[t], i = Oa(e) && e.textStyle;
  if (i)
    for (var n = 0, a = Yd.length; n < a; n++) {
      var o = Yd[n];
      i.hasOwnProperty(o) && (e[o] = i[o]);
    }
}
function ue(r) {
  r && (aa(r), It(r, "label"), r.emphasis && It(r.emphasis, "label"));
}
function CC(r) {
  if (Oa(r)) {
    pu(r), aa(r), It(r, "label"), It(r, "upperLabel"), It(r, "edgeLabel"), r.emphasis && (It(r.emphasis, "label"), It(r.emphasis, "upperLabel"), It(r.emphasis, "edgeLabel"));
    var t = r.markPoint;
    t && (pu(t), ue(t));
    var e = r.markLine;
    e && (pu(e), ue(e));
    var i = r.markArea;
    i && ue(i);
    var n = r.data;
    if (r.type === "graph") {
      n = n || r.nodes;
      var a = r.links || r.edges;
      if (a && !Kt(a))
        for (var o = 0; o < a.length; o++)
          ue(a[o]);
      T(r.categories, function(u) {
        aa(u);
      });
    }
    if (n && !Kt(n))
      for (var o = 0; o < n.length; o++)
        ue(n[o]);
    if (t = r.markPoint, t && t.data)
      for (var s = t.data, o = 0; o < s.length; o++)
        ue(s[o]);
    if (e = r.markLine, e && e.data)
      for (var l = e.data, o = 0; o < l.length; o++)
        B(l[o]) ? (ue(l[o][0]), ue(l[o][1])) : ue(l[o]);
    r.type === "gauge" ? (It(r, "axisLabel"), It(r, "title"), It(r, "detail")) : r.type === "treemap" ? (zt(r.breadcrumb, "itemStyle"), T(r.levels, function(u) {
      aa(u);
    })) : r.type === "tree" && aa(r.leaves);
  }
}
function qe(r) {
  return B(r) ? r : r ? [r] : [];
}
function Uv(r) {
  return (B(r) ? r[0] : r) || {};
}
function AC(r, t) {
  we(qe(r.series), function(i) {
    Oa(i) && CC(i);
  });
  var e = ["xAxis", "yAxis", "radiusAxis", "angleAxis", "singleAxis", "parallelAxis", "radar"];
  t && e.push("valueAxis", "categoryAxis", "logAxis", "timeAxis"), we(e, function(i) {
    we(qe(r[i]), function(n) {
      n && (It(n, "axisLabel"), It(n.axisPointer, "label"));
    });
  }), we(qe(r.parallel), function(i) {
    var n = i && i.parallelAxisDefault;
    It(n, "axisLabel"), It(n && n.axisPointer, "label");
  }), we(qe(r.calendar), function(i) {
    zt(i, "itemStyle"), It(i, "dayLabel"), It(i, "monthLabel"), It(i, "yearLabel");
  }), we(qe(r.radar), function(i) {
    It(i, "name"), i.name && i.axisName == null && (i.axisName = i.name, delete i.name), i.nameGap != null && i.axisNameGap == null && (i.axisNameGap = i.nameGap, delete i.nameGap);
  }), we(qe(r.geo), function(i) {
    Oa(i) && (ue(i), we(qe(i.regions), function(n) {
      ue(n);
    }));
  }), we(qe(r.timeline), function(i) {
    ue(i), zt(i, "label"), zt(i, "itemStyle"), zt(i, "controlStyle", !0);
    var n = i.data;
    B(n) && T(n, function(a) {
      U(a) && (zt(a, "label"), zt(a, "itemStyle"));
    });
  }), we(qe(r.toolbox), function(i) {
    zt(i, "iconStyle"), we(i.feature, function(n) {
      zt(n, "iconStyle");
    });
  }), It(Uv(r.axisPointer), "label"), It(Uv(r.tooltip).axisPointer, "label");
}
function MC(r, t) {
  for (var e = t.split(","), i = r, n = 0; n < e.length && (i = i && i[e[n]], i != null); n++)
    ;
  return i;
}
function DC(r, t, e, i) {
  for (var n = t.split(","), a = r, o, s = 0; s < n.length - 1; s++)
    o = n[s], a[o] == null && (a[o] = {}), a = a[o];
  a[n[s]] == null && (a[n[s]] = e);
}
function Yv(r) {
  r && T(kC, function(t) {
    t[0] in r && !(t[1] in r) && (r[t[1]] = r[t[0]]);
  });
}
var kC = [["x", "left"], ["y", "top"], ["x2", "right"], ["y2", "bottom"]], IC = ["grid", "geo", "parallel", "legend", "toolbox", "title", "visualMap", "dataZoom", "timeline"], gu = [["borderRadius", "barBorderRadius"], ["borderColor", "barBorderColor"], ["borderWidth", "barBorderWidth"]];
function On(r) {
  var t = r && r.itemStyle;
  if (t)
    for (var e = 0; e < gu.length; e++) {
      var i = gu[e][1], n = gu[e][0];
      t[i] != null && (t[n] = t[i]);
    }
}
function Xv(r) {
  r && r.alignTo === "edge" && r.margin != null && r.edgeDistance == null && (r.edgeDistance = r.margin);
}
function Zv(r) {
  r && r.downplay && !r.blur && (r.blur = r.downplay);
}
function LC(r) {
  r && r.focusNodeAdjacency != null && (r.emphasis = r.emphasis || {}, r.emphasis.focus == null && (r.emphasis.focus = "adjacency"));
}
function M0(r, t) {
  if (r)
    for (var e = 0; e < r.length; e++)
      t(r[e]), r[e] && M0(r[e].children, t);
}
function D0(r, t) {
  AC(r, t), r.series = Rt(r.series), T(r.series, function(e) {
    if (U(e)) {
      var i = e.type;
      if (i === "line")
        e.clipOverflow != null && (e.clip = e.clipOverflow);
      else if (i === "pie" || i === "gauge") {
        e.clockWise != null && (e.clockwise = e.clockWise), Xv(e.label);
        var n = e.data;
        if (n && !Kt(n))
          for (var a = 0; a < n.length; a++)
            Xv(n[a]);
        e.hoverOffset != null && (e.emphasis = e.emphasis || {}, (e.emphasis.scaleSize = null) && (e.emphasis.scaleSize = e.hoverOffset));
      } else if (i === "gauge") {
        var o = MC(e, "pointer.color");
        o != null && DC(e, "itemStyle.color", o);
      } else if (i === "bar") {
        On(e), On(e.backgroundStyle), On(e.emphasis);
        var n = e.data;
        if (n && !Kt(n))
          for (var a = 0; a < n.length; a++)
            typeof n[a] == "object" && (On(n[a]), On(n[a] && n[a].emphasis));
      } else if (i === "sunburst") {
        var s = e.highlightPolicy;
        s && (e.emphasis = e.emphasis || {}, e.emphasis.focus || (e.emphasis.focus = s)), Zv(e), M0(e.data, Zv);
      } else i === "graph" || i === "sankey" ? LC(e) : i === "map" && (e.mapType && !e.map && (e.map = e.mapType), e.mapLocation && ht(e, e.mapLocation));
      e.hoverAnimation != null && (e.emphasis = e.emphasis || {}, e.emphasis && e.emphasis.scale == null && (e.emphasis.scale = e.hoverAnimation)), Yv(e);
    }
  }), r.dataRange && (r.visualMap = r.dataRange), T(IC, function(e) {
    var i = r[e];
    i && (B(i) || (i = [i]), T(i, function(n) {
      Yv(n);
    }));
  });
}
function PC(r) {
  var t = tt();
  r.eachSeries(function(e) {
    var i = e.get("stack");
    if (i) {
      var n = t.get(i) || t.set(i, []), a = e.getData(), o = {
        // Used for calculate axis extent automatically.
        // TODO: Type getCalculationInfo return more specific type?
        stackResultDimension: a.getCalculationInfo("stackResultDimension"),
        stackedOverDimension: a.getCalculationInfo("stackedOverDimension"),
        stackedDimension: a.getCalculationInfo("stackedDimension"),
        stackedByDimension: a.getCalculationInfo("stackedByDimension"),
        isStackedByIndex: a.getCalculationInfo("isStackedByIndex"),
        data: a,
        seriesModel: e
      };
      if (!o.stackedDimension || !(o.isStackedByIndex || o.stackedByDimension))
        return;
      n.length && a.setCalculationInfo("stackedOnSeries", n[n.length - 1].seriesModel), n.push(o);
    }
  }), t.each(EC);
}
function EC(r) {
  T(r, function(t, e) {
    var i = [], n = [NaN, NaN], a = [t.stackResultDimension, t.stackedOverDimension], o = t.data, s = t.isStackedByIndex, l = t.seriesModel.get("stackStrategy") || "samesign";
    o.modify(a, function(u, h, c) {
      var f = o.get(t.stackedDimension, c);
      if (isNaN(f))
        return n;
      var d, v;
      s ? v = o.getRawIndex(c) : d = o.get(t.stackedByDimension, c);
      for (var g = NaN, p = e - 1; p >= 0; p--) {
        var y = r[p];
        if (s || (v = y.data.rawIndexOf(y.stackedByDimension, d)), v >= 0) {
          var m = y.data.getByRawIndex(y.stackResultDimension, v);
          if (l === "all" || l === "positive" && m > 0 || l === "negative" && m < 0 || l === "samesign" && f >= 0 && m > 0 || l === "samesign" && f <= 0 && m < 0) {
            f = ow(f, m), g = m;
            break;
          }
        }
      }
      return i[0] = f, i[1] = g, i;
    });
  });
}
var pl = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(t) {
      this.data = t.data || (t.sourceFormat === ar ? {} : []), this.sourceFormat = t.sourceFormat || x0, this.seriesLayoutBy = t.seriesLayoutBy || Ve, this.startIndex = t.startIndex || 0, this.dimensionsDetectedCount = t.dimensionsDetectedCount, this.metaRawOption = t.metaRawOption;
      var e = this.dimensionsDefine = t.dimensionsDefine;
      if (e)
        for (var i = 0; i < e.length; i++) {
          var n = e[i];
          n.type == null && T0(this, i) === te.Must && (n.type = "ordinal");
        }
    }
    return r;
  }()
);
function yf(r) {
  return r instanceof pl;
}
function Rh(r, t, e) {
  e = e || I0(r);
  var i = t.seriesLayoutBy, n = $C(r, e, i, t.sourceHeader, t.dimensions), a = new pl({
    data: r,
    sourceFormat: e,
    seriesLayoutBy: i,
    dimensionsDefine: n.dimensionsDefine,
    startIndex: n.startIndex,
    dimensionsDetectedCount: n.dimensionsDetectedCount,
    metaRawOption: K(t)
  });
  return a;
}
function k0(r) {
  return new pl({
    data: r,
    sourceFormat: Kt(r) ? Sr : xe
  });
}
function RC(r) {
  return new pl({
    data: r.data,
    sourceFormat: r.sourceFormat,
    seriesLayoutBy: r.seriesLayoutBy,
    dimensionsDefine: K(r.dimensionsDefine),
    startIndex: r.startIndex,
    dimensionsDetectedCount: r.dimensionsDetectedCount
  });
}
function I0(r) {
  var t = x0;
  if (Kt(r))
    t = Sr;
  else if (B(r)) {
    r.length === 0 && (t = Qt);
    for (var e = 0, i = r.length; e < i; e++) {
      var n = r[e];
      if (n != null) {
        if (B(n) || Kt(n)) {
          t = Qt;
          break;
        } else if (U(n)) {
          t = We;
          break;
        }
      }
    }
  } else if (U(r)) {
    for (var a in r)
      if (yi(r, a) && qt(r[a])) {
        t = ar;
        break;
      }
  }
  return t;
}
function $C(r, t, e, i, n) {
  var a, o;
  if (!r)
    return {
      dimensionsDefine: qv(n),
      startIndex: o,
      dimensionsDetectedCount: a
    };
  if (t === Qt) {
    var s = r;
    i === "auto" || i == null ? Kv(function(u) {
      u != null && u !== "-" && (V(u) ? o == null && (o = 1) : o = 0);
    }, e, s, 10) : o = wt(i) ? i : i ? 1 : 0, !n && o === 1 && (n = [], Kv(function(u, h) {
      n[h] = u != null ? u + "" : "";
    }, e, s, 1 / 0)), a = n ? n.length : e === Sn ? s.length : s[0] ? s[0].length : null;
  } else if (t === We)
    n || (n = OC(r));
  else if (t === ar)
    n || (n = [], T(r, function(u, h) {
      n.push(h);
    }));
  else if (t === xe) {
    var l = Za(r[0]);
    a = B(l) && l.length || 1;
  }
  return {
    startIndex: o,
    dimensionsDefine: qv(n),
    dimensionsDetectedCount: a
  };
}
function OC(r) {
  for (var t = 0, e; t < r.length && !(e = r[t++]); )
    ;
  if (e)
    return xt(e);
}
function qv(r) {
  if (r) {
    var t = tt();
    return H(r, function(e, i) {
      e = U(e) ? e : {
        name: e
      };
      var n = {
        name: e.name,
        displayName: e.displayName,
        type: e.type
      };
      if (n.name == null)
        return n;
      n.name += "", n.displayName == null && (n.displayName = n.name);
      var a = t.get(n.name);
      return a ? n.name += "-" + a.count++ : t.set(n.name, {
        count: 1
      }), n;
    });
  }
}
function Kv(r, t, e, i) {
  if (t === Sn)
    for (var n = 0; n < e.length && n < i; n++)
      r(e[n] ? e[n][0] : null, n);
  else
    for (var a = e[0] || [], n = 0; n < a.length && n < i; n++)
      r(a[n], n);
}
function L0(r) {
  var t = r.sourceFormat;
  return t === We || t === ar;
}
var qr, Kr, jr, jv, Qv, P0 = (
  /** @class */
  function() {
    function r(t, e) {
      var i = yf(t) ? t : k0(t);
      this._source = i;
      var n = this._data = i.data;
      i.sourceFormat === Sr && (this._offset = 0, this._dimSize = e, this._data = n), Qv(this, n, i);
    }
    return r.prototype.getSource = function() {
      return this._source;
    }, r.prototype.count = function() {
      return 0;
    }, r.prototype.getItem = function(t, e) {
    }, r.prototype.appendData = function(t) {
    }, r.prototype.clean = function() {
    }, r.protoInitialize = function() {
      var t = r.prototype;
      t.pure = !1, t.persistent = !0;
    }(), r.internalField = function() {
      var t;
      Qv = function(o, s, l) {
        var u = l.sourceFormat, h = l.seriesLayoutBy, c = l.startIndex, f = l.dimensionsDefine, d = jv[mf(u, h)];
        if ($(o, d), u === Sr)
          o.getItem = e, o.count = n, o.fillStorage = i;
        else {
          var v = E0(u, h);
          o.getItem = at(v, null, s, c, f);
          var g = R0(u, h);
          o.count = at(g, null, s, c, f);
        }
      };
      var e = function(o, s) {
        o = o - this._offset, s = s || [];
        for (var l = this._data, u = this._dimSize, h = u * o, c = 0; c < u; c++)
          s[c] = l[h + c];
        return s;
      }, i = function(o, s, l, u) {
        for (var h = this._data, c = this._dimSize, f = 0; f < c; f++) {
          for (var d = u[f], v = d[0] == null ? 1 / 0 : d[0], g = d[1] == null ? -1 / 0 : d[1], p = s - o, y = l[f], m = 0; m < p; m++) {
            var _ = h[m * c + f];
            y[o + m] = _, _ < v && (v = _), _ > g && (g = _);
          }
          d[0] = v, d[1] = g;
        }
      }, n = function() {
        return this._data ? this._data.length / this._dimSize : 0;
      };
      jv = (t = {}, t[Qt + "_" + Ve] = {
        pure: !0,
        appendData: a
      }, t[Qt + "_" + Sn] = {
        pure: !0,
        appendData: function() {
          throw new Error('Do not support appendData when set seriesLayoutBy: "row".');
        }
      }, t[We] = {
        pure: !0,
        appendData: a
      }, t[ar] = {
        pure: !0,
        appendData: function(o) {
          var s = this._data;
          T(o, function(l, u) {
            for (var h = s[u] || (s[u] = []), c = 0; c < (l || []).length; c++)
              h.push(l[c]);
          });
        }
      }, t[xe] = {
        appendData: a
      }, t[Sr] = {
        persistent: !1,
        pure: !0,
        appendData: function(o) {
          this._data = o;
        },
        // Clean self if data is already used.
        clean: function() {
          this._offset += this.count(), this._data = null;
        }
      }, t);
      function a(o) {
        for (var s = 0; s < o.length; s++)
          this._data.push(o[s]);
      }
    }(), r;
  }()
), Jv = function(r, t, e, i) {
  return r[i];
}, NC = (qr = {}, qr[Qt + "_" + Ve] = function(r, t, e, i) {
  return r[i + t];
}, qr[Qt + "_" + Sn] = function(r, t, e, i, n) {
  i += t;
  for (var a = n || [], o = r, s = 0; s < o.length; s++) {
    var l = o[s];
    a[s] = l ? l[i] : null;
  }
  return a;
}, qr[We] = Jv, qr[ar] = function(r, t, e, i, n) {
  for (var a = n || [], o = 0; o < e.length; o++) {
    var s = e[o].name, l = r[s];
    a[o] = l ? l[i] : null;
  }
  return a;
}, qr[xe] = Jv, qr);
function E0(r, t) {
  var e = NC[mf(r, t)];
  return e;
}
var tp = function(r, t, e) {
  return r.length;
}, BC = (Kr = {}, Kr[Qt + "_" + Ve] = function(r, t, e) {
  return Math.max(0, r.length - t);
}, Kr[Qt + "_" + Sn] = function(r, t, e) {
  var i = r[0];
  return i ? Math.max(0, i.length - t) : 0;
}, Kr[We] = tp, Kr[ar] = function(r, t, e) {
  var i = e[0].name, n = r[i];
  return n ? n.length : 0;
}, Kr[xe] = tp, Kr);
function R0(r, t) {
  var e = BC[mf(r, t)];
  return e;
}
var yu = function(r, t, e) {
  return r[t];
}, zC = (jr = {}, jr[Qt] = yu, jr[We] = function(r, t, e) {
  return r[e];
}, jr[ar] = yu, jr[xe] = function(r, t, e) {
  var i = Za(r);
  return i instanceof Array ? i[t] : i;
}, jr[Sr] = yu, jr);
function $0(r) {
  var t = zC[r];
  return t;
}
function mf(r, t) {
  return r === Qt ? r + "_" + t : r;
}
function dn(r, t, e) {
  if (r) {
    var i = r.getRawDataItem(t);
    if (i != null) {
      var n = r.getStore(), a = n.getSource().sourceFormat;
      if (e != null) {
        var o = r.getDimensionIndex(e), s = n.getDimensionProperty(o);
        return $0(a)(i, o, s);
      } else {
        var l = i;
        return a === xe && (l = Za(i)), l;
      }
    }
  }
}
var FC = /\{@(.+?)\}/g, _f = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.getDataParams = function(t, e) {
      var i = this.getData(e), n = this.getRawValue(t, e), a = i.getRawIndex(t), o = i.getName(t), s = i.getRawDataItem(t), l = i.getItemVisual(t, "style"), u = l && l[i.getItemVisual(t, "drawType") || "fill"], h = l && l.stroke, c = this.mainType, f = c === "series", d = i.userOutput && i.userOutput.get();
      return {
        componentType: c,
        componentSubType: this.subType,
        componentIndex: this.componentIndex,
        seriesType: f ? this.subType : null,
        seriesIndex: this.seriesIndex,
        seriesId: f ? this.id : null,
        seriesName: f ? this.name : null,
        name: o,
        dataIndex: a,
        data: s,
        dataType: e,
        value: n,
        color: u,
        borderColor: h,
        dimensionNames: d ? d.fullDimensions : null,
        encode: d ? d.encode : null,
        // Param name list for mapping `a`, `b`, `c`, `d`, `e`
        $vars: ["seriesName", "name", "value"]
      };
    }, r.prototype.getFormattedLabel = function(t, e, i, n, a, o) {
      e = e || "normal";
      var s = this.getData(i), l = this.getDataParams(t, i);
      if (o && (l.value = o.interpolatedValue), n != null && B(l.value) && (l.value = l.value[n]), !a) {
        var u = s.getItemModel(t);
        a = u.get(e === "normal" ? ["label", "formatter"] : [e, "label", "formatter"]);
      }
      if (Q(a))
        return l.status = e, l.dimensionIndex = n, a(l);
      if (V(a)) {
        var h = m0(a, l);
        return h.replace(FC, function(c, f) {
          var d = f.length, v = f;
          v.charAt(0) === "[" && v.charAt(d - 1) === "]" && (v = +v.slice(1, d - 1));
          var g = dn(s, t, v);
          if (o && B(o.interpolatedValue)) {
            var p = s.getDimensionIndex(v);
            p >= 0 && (g = o.interpolatedValue[p]);
          }
          return g != null ? g + "" : "";
        });
      }
    }, r.prototype.getRawValue = function(t, e) {
      return dn(this.getData(e), t);
    }, r.prototype.formatTooltip = function(t, e, i) {
    }, r;
  }()
);
function ep(r) {
  var t, e;
  return U(r) ? r.type && (e = r) : t = r, {
    text: t,
    // markers: markers || markersExisting,
    frag: e
  };
}
function ba(r) {
  return new HC(r);
}
var HC = (
  /** @class */
  function() {
    function r(t) {
      t = t || {}, this._reset = t.reset, this._plan = t.plan, this._count = t.count, this._onDirty = t.onDirty, this._dirty = !0;
    }
    return r.prototype.perform = function(t) {
      var e = this._upstream, i = t && t.skip;
      if (this._dirty && e) {
        var n = this.context;
        n.data = n.outputData = e.context.outputData;
      }
      this.__pipeline && (this.__pipeline.currentTask = this);
      var a;
      this._plan && !i && (a = this._plan(this.context));
      var o = h(this._modBy), s = this._modDataCount || 0, l = h(t && t.modBy), u = t && t.modDataCount || 0;
      (o !== l || s !== u) && (a = "reset");
      function h(m) {
        return !(m >= 1) && (m = 1), m;
      }
      var c;
      (this._dirty || a === "reset") && (this._dirty = !1, c = this._doReset(i)), this._modBy = l, this._modDataCount = u;
      var f = t && t.step;
      if (e ? this._dueEnd = e._outputDueEnd : this._dueEnd = this._count ? this._count(this.context) : 1 / 0, this._progress) {
        var d = this._dueIndex, v = Math.min(f != null ? this._dueIndex + f : 1 / 0, this._dueEnd);
        if (!i && (c || d < v)) {
          var g = this._progress;
          if (B(g))
            for (var p = 0; p < g.length; p++)
              this._doProgress(g[p], d, v, l, u);
          else
            this._doProgress(g, d, v, l, u);
        }
        this._dueIndex = v;
        var y = this._settedOutputEnd != null ? this._settedOutputEnd : v;
        this._outputDueEnd = y;
      } else
        this._dueIndex = this._outputDueEnd = this._settedOutputEnd != null ? this._settedOutputEnd : this._dueEnd;
      return this.unfinished();
    }, r.prototype.dirty = function() {
      this._dirty = !0, this._onDirty && this._onDirty(this.context);
    }, r.prototype._doProgress = function(t, e, i, n, a) {
      rp.reset(e, i, n, a), this._callingProgress = t, this._callingProgress({
        start: e,
        end: i,
        count: i - e,
        next: rp.next
      }, this.context);
    }, r.prototype._doReset = function(t) {
      this._dueIndex = this._outputDueEnd = this._dueEnd = 0, this._settedOutputEnd = null;
      var e, i;
      !t && this._reset && (e = this._reset(this.context), e && e.progress && (i = e.forceFirstProgress, e = e.progress), B(e) && !e.length && (e = null)), this._progress = e, this._modBy = this._modDataCount = null;
      var n = this._downstream;
      return n && n.dirty(), i;
    }, r.prototype.unfinished = function() {
      return this._progress && this._dueIndex < this._dueEnd;
    }, r.prototype.pipe = function(t) {
      (this._downstream !== t || this._dirty) && (this._downstream = t, t._upstream = this, t.dirty());
    }, r.prototype.dispose = function() {
      this._disposed || (this._upstream && (this._upstream._downstream = null), this._downstream && (this._downstream._upstream = null), this._dirty = !1, this._disposed = !0);
    }, r.prototype.getUpstream = function() {
      return this._upstream;
    }, r.prototype.getDownstream = function() {
      return this._downstream;
    }, r.prototype.setOutputEnd = function(t) {
      this._outputDueEnd = this._settedOutputEnd = t;
    }, r;
  }()
), rp = /* @__PURE__ */ function() {
  var r, t, e, i, n, a = {
    reset: function(l, u, h, c) {
      t = l, r = u, e = h, i = c, n = Math.ceil(i / e), a.next = e > 1 && i > 0 ? s : o;
    }
  };
  return a;
  function o() {
    return t < r ? t++ : null;
  }
  function s() {
    var l = t % n * e + Math.ceil(t / n), u = t >= r ? null : l < i ? l : t;
    return t++, u;
  }
}();
function on(r, t) {
  var e = t && t.type;
  return e === "ordinal" ? r : (e === "time" && !wt(r) && r != null && r !== "-" && (r = +rr(r)), r == null || r === "" ? NaN : Number(r));
}
tt({
  number: function(r) {
    return parseFloat(r);
  },
  time: function(r) {
    return +rr(r);
  },
  trim: function(r) {
    return V(r) ? ze(r) : r;
  }
});
var VC = (
  /** @class */
  function() {
    function r(t, e) {
      var i = t === "desc";
      this._resultLT = i ? 1 : -1, e == null && (e = i ? "min" : "max"), this._incomparable = e === "min" ? -1 / 0 : 1 / 0;
    }
    return r.prototype.evaluate = function(t, e) {
      var i = wt(t) ? t : xs(t), n = wt(e) ? e : xs(e), a = isNaN(i), o = isNaN(n);
      if (a && (i = this._incomparable), o && (n = this._incomparable), a && o) {
        var s = V(t), l = V(e);
        s && (i = l ? t : 0), l && (n = s ? e : 0);
      }
      return i < n ? this._resultLT : i > n ? -this._resultLT : 0;
    }, r;
  }()
), GC = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.getRawData = function() {
      throw new Error("not supported");
    }, r.prototype.getRawDataItem = function(t) {
      throw new Error("not supported");
    }, r.prototype.cloneRawData = function() {
    }, r.prototype.getDimensionInfo = function(t) {
    }, r.prototype.cloneAllDimensionInfo = function() {
    }, r.prototype.count = function() {
    }, r.prototype.retrieveValue = function(t, e) {
    }, r.prototype.retrieveValueFromItem = function(t, e) {
    }, r.prototype.convertValue = function(t, e) {
      return on(t, e);
    }, r;
  }()
);
function WC(r, t) {
  var e = new GC(), i = r.data, n = e.sourceFormat = r.sourceFormat, a = r.startIndex, o = "";
  r.seriesLayoutBy !== Ve && Xt(o);
  var s = [], l = {}, u = r.dimensionsDefine;
  if (u)
    T(u, function(g, p) {
      var y = g.name, m = {
        index: p,
        name: y,
        displayName: g.displayName
      };
      if (s.push(m), y != null) {
        var _ = "";
        yi(l, y) && Xt(_), l[y] = m;
      }
    });
  else
    for (var h = 0; h < r.dimensionsDetectedCount; h++)
      s.push({
        index: h
      });
  var c = E0(n, Ve);
  t.__isBuiltIn && (e.getRawDataItem = function(g) {
    return c(i, a, s, g);
  }, e.getRawData = at(UC, null, r)), e.cloneRawData = at(YC, null, r);
  var f = R0(n, Ve);
  e.count = at(f, null, i, a, s);
  var d = $0(n);
  e.retrieveValue = function(g, p) {
    var y = c(i, a, s, g);
    return v(y, p);
  };
  var v = e.retrieveValueFromItem = function(g, p) {
    if (g != null) {
      var y = s[p];
      if (y)
        return d(g, p, y.name);
    }
  };
  return e.getDimensionInfo = at(XC, null, s, l), e.cloneAllDimensionInfo = at(ZC, null, s), e;
}
function UC(r) {
  var t = r.sourceFormat;
  if (!bf(t)) {
    var e = "";
    Xt(e);
  }
  return r.data;
}
function YC(r) {
  var t = r.sourceFormat, e = r.data;
  if (!bf(t)) {
    var i = "";
    Xt(i);
  }
  if (t === Qt) {
    for (var n = [], a = 0, o = e.length; a < o; a++)
      n.push(e[a].slice());
    return n;
  } else if (t === We) {
    for (var n = [], a = 0, o = e.length; a < o; a++)
      n.push($({}, e[a]));
    return n;
  }
}
function XC(r, t, e) {
  if (e != null) {
    if (wt(e) || !isNaN(e) && !yi(t, e))
      return r[e];
    if (yi(t, e))
      return t[e];
  }
}
function ZC(r) {
  return K(r);
}
var O0 = tt();
function qC(r) {
  r = K(r);
  var t = r.type, e = "";
  t || Xt(e);
  var i = t.split(":");
  i.length !== 2 && Xt(e);
  var n = !1;
  i[0] === "echarts" && (t = i[1], n = !0), r.__isBuiltIn = n, O0.set(t, r);
}
function KC(r, t, e) {
  var i = Rt(r), n = i.length, a = "";
  n || Xt(a);
  for (var o = 0, s = n; o < s; o++) {
    var l = i[o];
    t = jC(l, t), o !== s - 1 && (t.length = Math.max(t.length, 1));
  }
  return t;
}
function jC(r, t, e, i) {
  var n = "";
  t.length || Xt(n), U(r) || Xt(n);
  var a = r.type, o = O0.get(a);
  o || Xt(n);
  var s = H(t, function(u) {
    return WC(u, o);
  }), l = Rt(o.transform({
    upstream: s[0],
    upstreamList: s,
    config: K(r.config)
  }));
  return H(l, function(u, h) {
    var c = "";
    U(u) || Xt(c), u.data || Xt(c);
    var f = I0(u.data);
    bf(f) || Xt(c);
    var d, v = t[0];
    if (v && h === 0 && !u.dimensions) {
      var g = v.startIndex;
      g && (u.data = v.data.slice(0, g).concat(u.data)), d = {
        seriesLayoutBy: Ve,
        sourceHeader: g,
        dimensions: v.metaRawOption.dimensions
      };
    } else
      d = {
        seriesLayoutBy: Ve,
        sourceHeader: 0,
        dimensions: u.dimensions
      };
    return Rh(u.data, d, null);
  });
}
function bf(r) {
  return r === Qt || r === We;
}
var gl = "undefined", QC = typeof Uint32Array === gl ? Array : Uint32Array, JC = typeof Uint16Array === gl ? Array : Uint16Array, N0 = typeof Int32Array === gl ? Array : Int32Array, ip = typeof Float64Array === gl ? Array : Float64Array, B0 = {
  float: ip,
  int: N0,
  // Ordinal data type can be string or int
  ordinal: Array,
  number: Array,
  time: ip
}, mu;
function Bi(r) {
  return r > 65535 ? QC : JC;
}
function zi() {
  return [1 / 0, -1 / 0];
}
function tA(r) {
  var t = r.constructor;
  return t === Array ? r.slice() : new t(r);
}
function np(r, t, e, i, n) {
  var a = B0[e || "float"];
  if (n) {
    var o = r[t], s = o && o.length;
    if (s !== i) {
      for (var l = new a(i), u = 0; u < s; u++)
        l[u] = o[u];
      r[t] = l;
    }
  } else
    r[t] = new a(i);
}
var $h = (
  /** @class */
  function() {
    function r() {
      this._chunks = [], this._rawExtent = [], this._extent = [], this._count = 0, this._rawCount = 0, this._calcDimNameToIdx = tt();
    }
    return r.prototype.initData = function(t, e, i) {
      this._provider = t, this._chunks = [], this._indices = null, this.getRawIndex = this._getRawIdxIdentity;
      var n = t.getSource(), a = this.defaultDimValueGetter = mu[n.sourceFormat];
      this._dimValueGetter = i || a, this._rawExtent = [], L0(n), this._dimensions = H(e, function(o) {
        return {
          // Only pick these two props. Not leak other properties like orderMeta.
          type: o.type,
          property: o.property
        };
      }), this._initDataFromProvider(0, t.count());
    }, r.prototype.getProvider = function() {
      return this._provider;
    }, r.prototype.getSource = function() {
      return this._provider.getSource();
    }, r.prototype.ensureCalculationDimension = function(t, e) {
      var i = this._calcDimNameToIdx, n = this._dimensions, a = i.get(t);
      if (a != null) {
        if (n[a].type === e)
          return a;
      } else
        a = n.length;
      return n[a] = {
        type: e
      }, i.set(t, a), this._chunks[a] = new B0[e || "float"](this._rawCount), this._rawExtent[a] = zi(), a;
    }, r.prototype.collectOrdinalMeta = function(t, e) {
      var i = this._chunks[t], n = this._dimensions[t], a = this._rawExtent, o = n.ordinalOffset || 0, s = i.length;
      o === 0 && (a[t] = zi());
      for (var l = a[t], u = o; u < s; u++) {
        var h = i[u] = e.parseAndCollect(i[u]);
        isNaN(h) || (l[0] = Math.min(h, l[0]), l[1] = Math.max(h, l[1]));
      }
      n.ordinalMeta = e, n.ordinalOffset = s, n.type = "ordinal";
    }, r.prototype.getOrdinalMeta = function(t) {
      var e = this._dimensions[t], i = e.ordinalMeta;
      return i;
    }, r.prototype.getDimensionProperty = function(t) {
      var e = this._dimensions[t];
      return e && e.property;
    }, r.prototype.appendData = function(t) {
      var e = this._provider, i = this.count();
      e.appendData(t);
      var n = e.count();
      return e.persistent || (n += i), i < n && this._initDataFromProvider(i, n, !0), [i, n];
    }, r.prototype.appendValues = function(t, e) {
      for (var i = this._chunks, n = this._dimensions, a = n.length, o = this._rawExtent, s = this.count(), l = s + Math.max(t.length, e || 0), u = 0; u < a; u++) {
        var h = n[u];
        np(i, u, h.type, l, !0);
      }
      for (var c = [], f = s; f < l; f++)
        for (var d = f - s, v = 0; v < a; v++) {
          var h = n[v], g = mu.arrayRows.call(this, t[d] || c, h.property, d, v);
          i[v][f] = g;
          var p = o[v];
          g < p[0] && (p[0] = g), g > p[1] && (p[1] = g);
        }
      return this._rawCount = this._count = l, {
        start: s,
        end: l
      };
    }, r.prototype._initDataFromProvider = function(t, e, i) {
      for (var n = this._provider, a = this._chunks, o = this._dimensions, s = o.length, l = this._rawExtent, u = H(o, function(m) {
        return m.property;
      }), h = 0; h < s; h++) {
        var c = o[h];
        l[h] || (l[h] = zi()), np(a, h, c.type, e, i);
      }
      if (n.fillStorage)
        n.fillStorage(t, e, a, l);
      else
        for (var f = [], d = t; d < e; d++) {
          f = n.getItem(d, f);
          for (var v = 0; v < s; v++) {
            var g = a[v], p = this._dimValueGetter(f, u[v], d, v);
            g[d] = p;
            var y = l[v];
            p < y[0] && (y[0] = p), p > y[1] && (y[1] = p);
          }
        }
      !n.persistent && n.clean && n.clean(), this._rawCount = this._count = e, this._extent = [];
    }, r.prototype.count = function() {
      return this._count;
    }, r.prototype.get = function(t, e) {
      if (!(e >= 0 && e < this._count))
        return NaN;
      var i = this._chunks[t];
      return i ? i[this.getRawIndex(e)] : NaN;
    }, r.prototype.getValues = function(t, e) {
      var i = [], n = [];
      if (e == null) {
        e = t, t = [];
        for (var a = 0; a < this._dimensions.length; a++)
          n.push(a);
      } else
        n = t;
      for (var a = 0, o = n.length; a < o; a++)
        i.push(this.get(n[a], e));
      return i;
    }, r.prototype.getByRawIndex = function(t, e) {
      if (!(e >= 0 && e < this._rawCount))
        return NaN;
      var i = this._chunks[t];
      return i ? i[e] : NaN;
    }, r.prototype.getSum = function(t) {
      var e = this._chunks[t], i = 0;
      if (e)
        for (var n = 0, a = this.count(); n < a; n++) {
          var o = this.get(t, n);
          isNaN(o) || (i += o);
        }
      return i;
    }, r.prototype.getMedian = function(t) {
      var e = [];
      this.each([t], function(a) {
        isNaN(a) || e.push(a);
      });
      var i = e.sort(function(a, o) {
        return a - o;
      }), n = this.count();
      return n === 0 ? 0 : n % 2 === 1 ? i[(n - 1) / 2] : (i[n / 2] + i[n / 2 - 1]) / 2;
    }, r.prototype.indexOfRawIndex = function(t) {
      if (t >= this._rawCount || t < 0)
        return -1;
      if (!this._indices)
        return t;
      var e = this._indices, i = e[t];
      if (i != null && i < this._count && i === t)
        return t;
      for (var n = 0, a = this._count - 1; n <= a; ) {
        var o = (n + a) / 2 | 0;
        if (e[o] < t)
          n = o + 1;
        else if (e[o] > t)
          a = o - 1;
        else
          return o;
      }
      return -1;
    }, r.prototype.indicesOfNearest = function(t, e, i) {
      var n = this._chunks, a = n[t], o = [];
      if (!a)
        return o;
      i == null && (i = 1 / 0);
      for (var s = 1 / 0, l = -1, u = 0, h = 0, c = this.count(); h < c; h++) {
        var f = this.getRawIndex(h), d = e - a[f], v = Math.abs(d);
        v <= i && ((v < s || v === s && d >= 0 && l < 0) && (s = v, l = d, u = 0), d === l && (o[u++] = h));
      }
      return o.length = u, o;
    }, r.prototype.getIndices = function() {
      var t, e = this._indices;
      if (e) {
        var i = e.constructor, n = this._count;
        if (i === Array) {
          t = new i(n);
          for (var a = 0; a < n; a++)
            t[a] = e[a];
        } else
          t = new i(e.buffer, 0, n);
      } else {
        var i = Bi(this._rawCount);
        t = new i(this.count());
        for (var a = 0; a < t.length; a++)
          t[a] = a;
      }
      return t;
    }, r.prototype.filter = function(t, e) {
      if (!this._count)
        return this;
      for (var i = this.clone(), n = i.count(), a = Bi(i._rawCount), o = new a(n), s = [], l = t.length, u = 0, h = t[0], c = i._chunks, f = 0; f < n; f++) {
        var d = void 0, v = i.getRawIndex(f);
        if (l === 0)
          d = e(f);
        else if (l === 1) {
          var g = c[h][v];
          d = e(g, f);
        } else {
          for (var p = 0; p < l; p++)
            s[p] = c[t[p]][v];
          s[p] = f, d = e.apply(null, s);
        }
        d && (o[u++] = v);
      }
      return u < n && (i._indices = o), i._count = u, i._extent = [], i._updateGetRawIdx(), i;
    }, r.prototype.selectRange = function(t) {
      var e = this.clone(), i = e._count;
      if (!i)
        return this;
      var n = xt(t), a = n.length;
      if (!a)
        return this;
      var o = e.count(), s = Bi(e._rawCount), l = new s(o), u = 0, h = n[0], c = t[h][0], f = t[h][1], d = e._chunks, v = !1;
      if (!e._indices) {
        var g = 0;
        if (a === 1) {
          for (var p = d[n[0]], y = 0; y < i; y++) {
            var m = p[y];
            (m >= c && m <= f || isNaN(m)) && (l[u++] = g), g++;
          }
          v = !0;
        } else if (a === 2) {
          for (var p = d[n[0]], _ = d[n[1]], b = t[n[1]][0], w = t[n[1]][1], y = 0; y < i; y++) {
            var m = p[y], x = _[y];
            (m >= c && m <= f || isNaN(m)) && (x >= b && x <= w || isNaN(x)) && (l[u++] = g), g++;
          }
          v = !0;
        }
      }
      if (!v)
        if (a === 1)
          for (var y = 0; y < o; y++) {
            var S = e.getRawIndex(y), m = d[n[0]][S];
            (m >= c && m <= f || isNaN(m)) && (l[u++] = S);
          }
        else
          for (var y = 0; y < o; y++) {
            for (var A = !0, S = e.getRawIndex(y), M = 0; M < a; M++) {
              var D = n[M], m = d[D][S];
              (m < t[D][0] || m > t[D][1]) && (A = !1);
            }
            A && (l[u++] = e.getRawIndex(y));
          }
      return u < o && (e._indices = l), e._count = u, e._extent = [], e._updateGetRawIdx(), e;
    }, r.prototype.map = function(t, e) {
      var i = this.clone(t);
      return this._updateDims(i, t, e), i;
    }, r.prototype.modify = function(t, e) {
      this._updateDims(this, t, e);
    }, r.prototype._updateDims = function(t, e, i) {
      for (var n = t._chunks, a = [], o = e.length, s = t.count(), l = [], u = t._rawExtent, h = 0; h < e.length; h++)
        u[e[h]] = zi();
      for (var c = 0; c < s; c++) {
        for (var f = t.getRawIndex(c), d = 0; d < o; d++)
          l[d] = n[e[d]][f];
        l[o] = c;
        var v = i && i.apply(null, l);
        if (v != null) {
          typeof v != "object" && (a[0] = v, v = a);
          for (var h = 0; h < v.length; h++) {
            var g = e[h], p = v[h], y = u[g], m = n[g];
            m && (m[f] = p), p < y[0] && (y[0] = p), p > y[1] && (y[1] = p);
          }
        }
      }
    }, r.prototype.lttbDownSample = function(t, e) {
      var i = this.clone([t], !0), n = i._chunks, a = n[t], o = this.count(), s = 0, l = Math.floor(1 / e), u = this.getRawIndex(0), h, c, f, d = new (Bi(this._rawCount))(Math.min((Math.ceil(o / l) + 2) * 2, o));
      d[s++] = u;
      for (var v = 1; v < o - 1; v += l) {
        for (var g = Math.min(v + l, o - 1), p = Math.min(v + l * 2, o), y = (p + g) / 2, m = 0, _ = g; _ < p; _++) {
          var b = this.getRawIndex(_), w = a[b];
          isNaN(w) || (m += w);
        }
        m /= p - g;
        var x = v, S = Math.min(v + l, o), A = v - 1, M = a[u];
        h = -1, f = x;
        for (var D = -1, C = 0, _ = x; _ < S; _++) {
          var b = this.getRawIndex(_), w = a[b];
          if (isNaN(w)) {
            C++, D < 0 && (D = b);
            continue;
          }
          c = Math.abs((A - y) * (w - M) - (A - _) * (m - M)), c > h && (h = c, f = b);
        }
        C > 0 && C < S - x && (d[s++] = Math.min(D, f), f = Math.max(D, f)), d[s++] = f, u = f;
      }
      return d[s++] = this.getRawIndex(o - 1), i._count = s, i._indices = d, i.getRawIndex = this._getRawIdx, i;
    }, r.prototype.minmaxDownSample = function(t, e) {
      for (var i = this.clone([t], !0), n = i._chunks, a = Math.floor(1 / e), o = n[t], s = this.count(), l = new (Bi(this._rawCount))(Math.ceil(s / a) * 2), u = 0, h = 0; h < s; h += a) {
        var c = h, f = o[this.getRawIndex(c)], d = h, v = o[this.getRawIndex(d)], g = a;
        h + a > s && (g = s - h);
        for (var p = 0; p < g; p++) {
          var y = this.getRawIndex(h + p), m = o[y];
          m < f && (f = m, c = h + p), m > v && (v = m, d = h + p);
        }
        var _ = this.getRawIndex(c), b = this.getRawIndex(d);
        c < d ? (l[u++] = _, l[u++] = b) : (l[u++] = b, l[u++] = _);
      }
      return i._count = u, i._indices = l, i._updateGetRawIdx(), i;
    }, r.prototype.downSample = function(t, e, i, n) {
      for (var a = this.clone([t], !0), o = a._chunks, s = [], l = Math.floor(1 / e), u = o[t], h = this.count(), c = a._rawExtent[t] = zi(), f = new (Bi(this._rawCount))(Math.ceil(h / l)), d = 0, v = 0; v < h; v += l) {
        l > h - v && (l = h - v, s.length = l);
        for (var g = 0; g < l; g++) {
          var p = this.getRawIndex(v + g);
          s[g] = u[p];
        }
        var y = i(s), m = this.getRawIndex(Math.min(v + n(s, y) || 0, h - 1));
        u[m] = y, y < c[0] && (c[0] = y), y > c[1] && (c[1] = y), f[d++] = m;
      }
      return a._count = d, a._indices = f, a._updateGetRawIdx(), a;
    }, r.prototype.each = function(t, e) {
      if (this._count)
        for (var i = t.length, n = this._chunks, a = 0, o = this.count(); a < o; a++) {
          var s = this.getRawIndex(a);
          switch (i) {
            case 0:
              e(a);
              break;
            case 1:
              e(n[t[0]][s], a);
              break;
            case 2:
              e(n[t[0]][s], n[t[1]][s], a);
              break;
            default:
              for (var l = 0, u = []; l < i; l++)
                u[l] = n[t[l]][s];
              u[l] = a, e.apply(null, u);
          }
        }
    }, r.prototype.getDataExtent = function(t) {
      var e = this._chunks[t], i = zi();
      if (!e)
        return i;
      var n = this.count(), a = !this._indices, o;
      if (a)
        return this._rawExtent[t].slice();
      if (o = this._extent[t], o)
        return o.slice();
      o = i;
      for (var s = o[0], l = o[1], u = 0; u < n; u++) {
        var h = this.getRawIndex(u), c = e[h];
        c < s && (s = c), c > l && (l = c);
      }
      return o = [s, l], this._extent[t] = o, o;
    }, r.prototype.getRawDataItem = function(t) {
      var e = this.getRawIndex(t);
      if (this._provider.persistent)
        return this._provider.getItem(e);
      for (var i = [], n = this._chunks, a = 0; a < n.length; a++)
        i.push(n[a][e]);
      return i;
    }, r.prototype.clone = function(t, e) {
      var i = new r(), n = this._chunks, a = t && yn(t, function(s, l) {
        return s[l] = !0, s;
      }, {});
      if (a)
        for (var o = 0; o < n.length; o++)
          i._chunks[o] = a[o] ? tA(n[o]) : n[o];
      else
        i._chunks = n;
      return this._copyCommonProps(i), e || (i._indices = this._cloneIndices()), i._updateGetRawIdx(), i;
    }, r.prototype._copyCommonProps = function(t) {
      t._count = this._count, t._rawCount = this._rawCount, t._provider = this._provider, t._dimensions = this._dimensions, t._extent = K(this._extent), t._rawExtent = K(this._rawExtent);
    }, r.prototype._cloneIndices = function() {
      if (this._indices) {
        var t = this._indices.constructor, e = void 0;
        if (t === Array) {
          var i = this._indices.length;
          e = new t(i);
          for (var n = 0; n < i; n++)
            e[n] = this._indices[n];
        } else
          e = new t(this._indices);
        return e;
      }
      return null;
    }, r.prototype._getRawIdxIdentity = function(t) {
      return t;
    }, r.prototype._getRawIdx = function(t) {
      return t < this._count && t >= 0 ? this._indices[t] : -1;
    }, r.prototype._updateGetRawIdx = function() {
      this.getRawIndex = this._indices ? this._getRawIdx : this._getRawIdxIdentity;
    }, r.internalField = function() {
      function t(e, i, n, a) {
        return on(e[a], this._dimensions[a]);
      }
      mu = {
        arrayRows: t,
        objectRows: function(e, i, n, a) {
          return on(e[i], this._dimensions[a]);
        },
        keyedColumns: t,
        original: function(e, i, n, a) {
          var o = e && (e.value == null ? e : e.value);
          return on(o instanceof Array ? o[a] : o, this._dimensions[a]);
        },
        typedArray: function(e, i, n, a) {
          return e[a];
        }
      };
    }(), r;
  }()
), z0 = (
  /** @class */
  function() {
    function r(t) {
      this._sourceList = [], this._storeList = [], this._upstreamSignList = [], this._versionSignBase = 0, this._dirty = !0, this._sourceHost = t;
    }
    return r.prototype.dirty = function() {
      this._setLocalSource([], []), this._storeList = [], this._dirty = !0;
    }, r.prototype._setLocalSource = function(t, e) {
      this._sourceList = t, this._upstreamSignList = e, this._versionSignBase++, this._versionSignBase > 9e10 && (this._versionSignBase = 0);
    }, r.prototype._getVersionSign = function() {
      return this._sourceHost.uid + "_" + this._versionSignBase;
    }, r.prototype.prepareSource = function() {
      this._isDirty() && (this._createSource(), this._dirty = !1);
    }, r.prototype._createSource = function() {
      this._setLocalSource([], []);
      var t = this._sourceHost, e = this._getUpstreamSourceManagers(), i = !!e.length, n, a;
      if (xo(t)) {
        var o = t, s = void 0, l = void 0, u = void 0;
        if (i) {
          var h = e[0];
          h.prepareSource(), u = h.getSource(), s = u.data, l = u.sourceFormat, a = [h._getVersionSign()];
        } else
          s = o.get("data", !0), l = Kt(s) ? Sr : xe, a = [];
        var c = this._getSourceMetaRawOption() || {}, f = u && u.metaRawOption || {}, d = st(c.seriesLayoutBy, f.seriesLayoutBy) || null, v = st(c.sourceHeader, f.sourceHeader), g = st(c.dimensions, f.dimensions), p = d !== f.seriesLayoutBy || !!v != !!f.sourceHeader || g;
        n = p ? [Rh(s, {
          seriesLayoutBy: d,
          sourceHeader: v,
          dimensions: g
        }, l)] : [];
      } else {
        var y = t;
        if (i) {
          var m = this._applyTransform(e);
          n = m.sourceList, a = m.upstreamSignList;
        } else {
          var _ = y.get("source", !0);
          n = [Rh(_, this._getSourceMetaRawOption(), null)], a = [];
        }
      }
      this._setLocalSource(n, a);
    }, r.prototype._applyTransform = function(t) {
      var e = this._sourceHost, i = e.get("transform", !0), n = e.get("fromTransformResult", !0);
      if (n != null) {
        var a = "";
        t.length !== 1 && op(a);
      }
      var o, s = [], l = [];
      return T(t, function(u) {
        u.prepareSource();
        var h = u.getSource(n || 0), c = "";
        n != null && !h && op(c), s.push(h), l.push(u._getVersionSign());
      }), i ? o = KC(i, s, {
        datasetIndex: e.componentIndex
      }) : n != null && (o = [RC(s[0])]), {
        sourceList: o,
        upstreamSignList: l
      };
    }, r.prototype._isDirty = function() {
      if (this._dirty)
        return !0;
      for (var t = this._getUpstreamSourceManagers(), e = 0; e < t.length; e++) {
        var i = t[e];
        if (
          // Consider the case that there is ancestor diry, call it recursively.
          // The performance is probably not an issue because usually the chain is not long.
          i._isDirty() || this._upstreamSignList[e] !== i._getVersionSign()
        )
          return !0;
      }
    }, r.prototype.getSource = function(t) {
      t = t || 0;
      var e = this._sourceList[t];
      if (!e) {
        var i = this._getUpstreamSourceManagers();
        return i[0] && i[0].getSource(t);
      }
      return e;
    }, r.prototype.getSharedDataStore = function(t) {
      var e = t.makeStoreSchema();
      return this._innerGetDataStore(e.dimensions, t.source, e.hash);
    }, r.prototype._innerGetDataStore = function(t, e, i) {
      var n = 0, a = this._storeList, o = a[n];
      o || (o = a[n] = {});
      var s = o[i];
      if (!s) {
        var l = this._getUpstreamSourceManagers()[0];
        xo(this._sourceHost) && l ? s = l._innerGetDataStore(t, e, i) : (s = new $h(), s.initData(new P0(e, t.length), t)), o[i] = s;
      }
      return s;
    }, r.prototype._getUpstreamSourceManagers = function() {
      var t = this._sourceHost;
      if (xo(t)) {
        var e = S0(t);
        return e ? [e.getSourceManager()] : [];
      } else
        return H(sC(t), function(i) {
          return i.getSourceManager();
        });
    }, r.prototype._getSourceMetaRawOption = function() {
      var t = this._sourceHost, e, i, n;
      if (xo(t))
        e = t.get("seriesLayoutBy", !0), i = t.get("sourceHeader", !0), n = t.get("dimensions", !0);
      else if (!this._getUpstreamSourceManagers().length) {
        var a = t;
        e = a.get("seriesLayoutBy", !0), i = a.get("sourceHeader", !0), n = a.get("dimensions", !0);
      }
      return {
        seriesLayoutBy: e,
        sourceHeader: i,
        dimensions: n
      };
    }, r;
  }()
);
function ap(r) {
  var t = r.option.transform;
  t && hs(r.option.transform);
}
function xo(r) {
  return r.mainType === "series";
}
function op(r) {
  throw new Error(r);
}
var eA = "line-height:1";
function F0(r) {
  var t = r.lineHeight;
  return t == null ? eA : "line-height:" + Ut(t + "") + "px";
}
function H0(r, t) {
  var e = r.color || "#6e7079", i = r.fontSize || 12, n = r.fontWeight || "400", a = r.color || "#464646", o = r.fontSize || 14, s = r.fontWeight || "900";
  return t === "html" ? {
    // eslint-disable-next-line max-len
    nameStyle: "font-size:" + Ut(i + "") + "px;color:" + Ut(e) + ";font-weight:" + Ut(n + ""),
    // eslint-disable-next-line max-len
    valueStyle: "font-size:" + Ut(o + "") + "px;color:" + Ut(a) + ";font-weight:" + Ut(s + "")
  } : {
    nameStyle: {
      fontSize: i,
      fill: e,
      fontWeight: n
    },
    valueStyle: {
      fontSize: o,
      fill: a,
      fontWeight: s
    }
  };
}
var rA = [0, 10, 20, 30], iA = ["", `
`, `

`, `


`];
function Dr(r, t) {
  return t.type = r, t;
}
function Oh(r) {
  return r.type === "section";
}
function V0(r) {
  return Oh(r) ? nA : aA;
}
function G0(r) {
  if (Oh(r)) {
    var t = 0, e = r.blocks.length, i = e > 1 || e > 0 && !r.noHeader;
    return T(r.blocks, function(n) {
      var a = G0(n);
      a >= t && (t = a + +(i && // 0 always can not be readable gap level.
      (!a || Oh(n) && !n.noHeader)));
    }), t;
  }
  return 0;
}
function nA(r, t, e, i) {
  var n = t.noHeader, a = oA(G0(t)), o = [], s = t.blocks || [];
  ke(!s || B(s)), s = s || [];
  var l = r.orderMode;
  if (t.sortBlocks && l) {
    s = s.slice();
    var u = {
      valueAsc: "asc",
      valueDesc: "desc"
    };
    if (yi(u, l)) {
      var h = new VC(u[l], null);
      s.sort(function(g, p) {
        return h.evaluate(g.sortParam, p.sortParam);
      });
    } else l === "seriesDesc" && s.reverse();
  }
  T(s, function(g, p) {
    var y = t.valueFormatter, m = V0(g)(
      // Inherit valueFormatter
      y ? $($({}, r), {
        valueFormatter: y
      }) : r,
      g,
      p > 0 ? a.html : 0,
      i
    );
    m != null && o.push(m);
  });
  var c = r.renderMode === "richText" ? o.join(a.richText) : Nh(i, o.join(""), n ? e : a.html);
  if (n)
    return c;
  var f = Eh(t.header, "ordinal", r.useUTC), d = H0(i, r.renderMode).nameStyle, v = F0(i);
  return r.renderMode === "richText" ? W0(r, f, d) + a.richText + c : Nh(i, '<div style="' + d + ";" + v + ';">' + Ut(f) + "</div>" + c, e);
}
function aA(r, t, e, i) {
  var n = r.renderMode, a = t.noName, o = t.noValue, s = !t.markerType, l = t.name, u = r.useUTC, h = t.valueFormatter || r.valueFormatter || function(b) {
    return b = B(b) ? b : [b], H(b, function(w, x) {
      return Eh(w, B(d) ? d[x] : d, u);
    });
  };
  if (!(a && o)) {
    var c = s ? "" : r.markupStyleCreator.makeTooltipMarker(t.markerType, t.markerColor || "#333", n), f = a ? "" : Eh(l, "ordinal", u), d = t.valueType, v = o ? [] : h(t.value, t.dataIndex), g = !s || !a, p = !s && a, y = H0(i, n), m = y.nameStyle, _ = y.valueStyle;
    return n === "richText" ? (s ? "" : c) + (a ? "" : W0(r, f, m)) + (o ? "" : uA(r, v, g, p, _)) : Nh(i, (s ? "" : c) + (a ? "" : sA(f, !s, m)) + (o ? "" : lA(v, g, p, _)), e);
  }
}
function sp(r, t, e, i, n, a) {
  if (r) {
    var o = V0(r), s = {
      useUTC: n,
      renderMode: e,
      orderMode: i,
      markupStyleCreator: t,
      valueFormatter: r.valueFormatter
    };
    return o(s, r, 0, a);
  }
}
function oA(r) {
  return {
    html: rA[r],
    richText: iA[r]
  };
}
function Nh(r, t, e) {
  var i = '<div style="clear:both"></div>', n = "margin: " + e + "px 0 0", a = F0(r);
  return '<div style="' + n + ";" + a + ';">' + t + i + "</div>";
}
function sA(r, t, e) {
  var i = t ? "margin-left:2px" : "";
  return '<span style="' + e + ";" + i + '">' + Ut(r) + "</span>";
}
function lA(r, t, e, i) {
  var n = e ? "10px" : "20px", a = t ? "float:right;margin-left:" + n : "";
  return r = B(r) ? r : [r], '<span style="' + a + ";" + i + '">' + H(r, function(o) {
    return Ut(o);
  }).join("&nbsp;&nbsp;") + "</span>";
}
function W0(r, t, e) {
  return r.markupStyleCreator.wrapRichTextStyle(t, e);
}
function uA(r, t, e, i, n) {
  var a = [n], o = i ? 10 : 20;
  return e && a.push({
    padding: [0, 0, 0, o],
    align: "right"
  }), r.markupStyleCreator.wrapRichTextStyle(B(t) ? t.join("  ") : t, a);
}
function hA(r, t) {
  var e = r.getData().getItemVisual(t, "style"), i = e[r.visualDrawType];
  return wi(i);
}
function U0(r, t) {
  var e = r.get("padding");
  return e ?? (t === "richText" ? [8, 10] : 10);
}
var _u = (
  /** @class */
  function() {
    function r() {
      this.richTextStyles = {}, this._nextStyleNameId = mm();
    }
    return r.prototype._generateStyleName = function() {
      return "__EC_aUTo_" + this._nextStyleNameId++;
    }, r.prototype.makeTooltipMarker = function(t, e, i) {
      var n = i === "richText" ? this._generateStyleName() : null, a = KT({
        color: e,
        type: t,
        renderMode: i,
        markerId: n
      });
      return V(a) ? a : (this.richTextStyles[n] = a.style, a.content);
    }, r.prototype.wrapRichTextStyle = function(t, e) {
      var i = {};
      B(e) ? T(e, function(a) {
        return $(i, a);
      }) : $(i, e);
      var n = this._generateStyleName();
      return this.richTextStyles[n] = i, "{" + n + "|" + t + "}";
    }, r;
  }()
);
function cA(r) {
  var t = r.series, e = r.dataIndex, i = r.multipleSeries, n = t.getData(), a = n.mapDimensionsAll("defaultedTooltip"), o = a.length, s = t.getRawValue(e), l = B(s), u = hA(t, e), h, c, f, d;
  if (o > 1 || l && !o) {
    var v = fA(s, t, e, a, u);
    h = v.inlineValues, c = v.inlineValueTypes, f = v.blocks, d = v.inlineValues[0];
  } else if (o) {
    var g = n.getDimensionInfo(a[0]);
    d = h = dn(n, e, a[0]), c = g.type;
  } else
    d = h = l ? s[0] : s;
  var p = Uc(t), y = p && t.name || "", m = n.getName(e), _ = i ? y : m;
  return Dr("section", {
    header: y,
    // When series name is not specified, do not show a header line with only '-'.
    // This case always happens in tooltip.trigger: 'item'.
    noHeader: i || !p,
    sortParam: d,
    blocks: [Dr("nameValue", {
      markerType: "item",
      markerColor: u,
      // Do not mix display seriesName and itemName in one tooltip,
      // which might confuses users.
      name: _,
      // name dimension might be auto assigned, where the name might
      // be not readable. So we check trim here.
      noName: !ze(_),
      value: h,
      valueType: c,
      dataIndex: e
    })].concat(f || [])
  });
}
function fA(r, t, e, i, n) {
  var a = t.getData(), o = yn(r, function(c, f, d) {
    var v = a.getDimensionInfo(d);
    return c = c || v && v.tooltip !== !1 && v.displayName != null;
  }, !1), s = [], l = [], u = [];
  i.length ? T(i, function(c) {
    h(dn(a, e, c), c);
  }) : T(r, h);
  function h(c, f) {
    var d = a.getDimensionInfo(f);
    !d || d.otherDims.tooltip === !1 || (o ? u.push(Dr("nameValue", {
      markerType: "subItem",
      markerColor: n,
      name: d.displayName,
      value: c,
      valueType: d.type
    })) : (s.push(c), l.push(d.type)));
  }
  return {
    inlineValues: s,
    inlineValueTypes: l,
    blocks: u
  };
}
var ur = Tt();
function wo(r, t) {
  return r.getName(t) || r.getId(t);
}
var dA = "__universalTransitionEnabled", Ie = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e._selectedDataIndicesMap = {}, e;
    }
    return t.prototype.init = function(e, i, n) {
      this.seriesIndex = this.componentIndex, this.dataTask = ba({
        count: pA,
        reset: gA
      }), this.dataTask.context = {
        model: this
      }, this.mergeDefaultAndTheme(e, n);
      var a = ur(this).sourceManager = new z0(this);
      a.prepareSource();
      var o = this.getInitialData(e, n);
      up(o, this), this.dataTask.context.data = o, ur(this).dataBeforeProcessed = o, lp(this), this._initSelectedMapFromData(o);
    }, t.prototype.mergeDefaultAndTheme = function(e, i) {
      var n = $a(this), a = n ? vl(e) : {}, o = this.subType;
      dt.hasClass(o) && (o += "Series"), ut(e, i.getTheme().get(this.subType)), ut(e, this.getDefaultOption()), bh(e, "label", ["show"]), this.fillDataTextStyle(e.data), n && fn(e, a, n);
    }, t.prototype.mergeOption = function(e, i) {
      e = ut(this.option, e, !0), this.fillDataTextStyle(e.data);
      var n = $a(this);
      n && fn(this.option, e, n);
      var a = ur(this).sourceManager;
      a.dirty(), a.prepareSource();
      var o = this.getInitialData(e, i);
      up(o, this), this.dataTask.dirty(), this.dataTask.context.data = o, ur(this).dataBeforeProcessed = o, lp(this), this._initSelectedMapFromData(o);
    }, t.prototype.fillDataTextStyle = function(e) {
      if (e && !Kt(e))
        for (var i = ["show"], n = 0; n < e.length; n++)
          e[n] && e[n].label && bh(e[n], "label", i);
    }, t.prototype.getInitialData = function(e, i) {
    }, t.prototype.appendData = function(e) {
      var i = this.getRawData();
      i.appendData(e.data);
    }, t.prototype.getData = function(e) {
      var i = Bh(this);
      if (i) {
        var n = i.context.data;
        return e == null || !n.getLinkedData ? n : n.getLinkedData(e);
      } else
        return ur(this).data;
    }, t.prototype.getAllData = function() {
      var e = this.getData();
      return e && e.getLinkedDataAll ? e.getLinkedDataAll() : [{
        data: e
      }];
    }, t.prototype.setData = function(e) {
      var i = Bh(this);
      if (i) {
        var n = i.context;
        n.outputData = e, i !== this.dataTask && (n.data = e);
      }
      ur(this).data = e;
    }, t.prototype.getEncode = function() {
      var e = this.get("encode", !0);
      if (e)
        return tt(e);
    }, t.prototype.getSourceManager = function() {
      return ur(this).sourceManager;
    }, t.prototype.getSource = function() {
      return this.getSourceManager().getSource();
    }, t.prototype.getRawData = function() {
      return ur(this).dataBeforeProcessed;
    }, t.prototype.getColorBy = function() {
      var e = this.get("colorBy");
      return e || "series";
    }, t.prototype.isColorBySeries = function() {
      return this.getColorBy() === "series";
    }, t.prototype.getBaseAxis = function() {
      var e = this.coordinateSystem;
      return e && e.getBaseAxis && e.getBaseAxis();
    }, t.prototype.formatTooltip = function(e, i, n) {
      return cA({
        series: this,
        dataIndex: e,
        multipleSeries: i
      });
    }, t.prototype.isAnimationEnabled = function() {
      var e = this.ecModel;
      if (j.node && !(e && e.ssr))
        return !1;
      var i = this.getShallow("animation");
      return i && this.getData().count() > this.getShallow("animationThreshold") && (i = !1), !!i;
    }, t.prototype.restoreData = function() {
      this.dataTask.dirty();
    }, t.prototype.getColorFromPalette = function(e, i, n) {
      var a = this.ecModel, o = vf.prototype.getColorFromPalette.call(this, e, i, n);
      return o || (o = a.getColorFromPalette(e, i, n)), o;
    }, t.prototype.coordDimToDataDim = function(e) {
      return this.getRawData().mapDimensionsAll(e);
    }, t.prototype.getProgressive = function() {
      return this.get("progressive");
    }, t.prototype.getProgressiveThreshold = function() {
      return this.get("progressiveThreshold");
    }, t.prototype.select = function(e, i) {
      this._innerSelect(this.getData(i), e);
    }, t.prototype.unselect = function(e, i) {
      var n = this.option.selectedMap;
      if (n) {
        var a = this.option.selectedMode, o = this.getData(i);
        if (a === "series" || n === "all") {
          this.option.selectedMap = {}, this._selectedDataIndicesMap = {};
          return;
        }
        for (var s = 0; s < e.length; s++) {
          var l = e[s], u = wo(o, l);
          n[u] = !1, this._selectedDataIndicesMap[u] = -1;
        }
      }
    }, t.prototype.toggleSelect = function(e, i) {
      for (var n = [], a = 0; a < e.length; a++)
        n[0] = e[a], this.isSelected(e[a], i) ? this.unselect(n, i) : this.select(n, i);
    }, t.prototype.getSelectedDataIndices = function() {
      if (this.option.selectedMap === "all")
        return [].slice.call(this.getData().getIndices());
      for (var e = this._selectedDataIndicesMap, i = xt(e), n = [], a = 0; a < i.length; a++) {
        var o = e[i[a]];
        o >= 0 && n.push(o);
      }
      return n;
    }, t.prototype.isSelected = function(e, i) {
      var n = this.option.selectedMap;
      if (!n)
        return !1;
      var a = this.getData(i);
      return (n === "all" || n[wo(a, e)]) && !a.getItemModel(e).get(["select", "disabled"]);
    }, t.prototype.isUniversalTransitionEnabled = function() {
      if (this[dA])
        return !0;
      var e = this.option.universalTransition;
      return e ? e === !0 ? !0 : e && e.enabled : !1;
    }, t.prototype._innerSelect = function(e, i) {
      var n, a, o = this.option, s = o.selectedMode, l = i.length;
      if (!(!s || !l)) {
        if (s === "series")
          o.selectedMap = "all";
        else if (s === "multiple") {
          U(o.selectedMap) || (o.selectedMap = {});
          for (var u = o.selectedMap, h = 0; h < l; h++) {
            var c = i[h], f = wo(e, c);
            u[f] = !0, this._selectedDataIndicesMap[f] = e.getRawIndex(c);
          }
        } else if (s === "single" || s === !0) {
          var d = i[l - 1], f = wo(e, d);
          o.selectedMap = (n = {}, n[f] = !0, n), this._selectedDataIndicesMap = (a = {}, a[f] = e.getRawIndex(d), a);
        }
      }
    }, t.prototype._initSelectedMapFromData = function(e) {
      if (!this.option.selectedMap) {
        var i = [];
        e.hasItemOption && e.each(function(n) {
          var a = e.getRawDataItem(n);
          a && a.selected && i.push(n);
        }), i.length > 0 && this._innerSelect(e, i);
      }
    }, t.registerClass = function(e) {
      return dt.registerClass(e);
    }, t.protoInitialize = function() {
      var e = t.prototype;
      e.type = "series.__base__", e.seriesIndex = 0, e.ignoreStyleOnData = !1, e.hasSymbolVisual = !1, e.defaultSymbol = "circle", e.visualStyleAccessPath = "itemStyle", e.visualDrawType = "fill";
    }(), t;
  }(dt)
);
Le(Ie, _f);
Le(Ie, vf);
Tm(Ie, dt);
function lp(r) {
  var t = r.name;
  Uc(r) || (r.name = vA(r) || t);
}
function vA(r) {
  var t = r.getRawData(), e = t.mapDimensionsAll("seriesName"), i = [];
  return T(e, function(n) {
    var a = t.getDimensionInfo(n);
    a.displayName && i.push(a.displayName);
  }), i.join(" ");
}
function pA(r) {
  return r.model.getRawData().count();
}
function gA(r) {
  var t = r.model;
  return t.setData(t.getRawData().cloneShallow()), yA;
}
function yA(r, t) {
  t.outputData && r.end > t.outputData.count() && t.model.getRawData().cloneShallow(t.outputData);
}
function up(r, t) {
  T(z1(r.CHANGABLE_METHODS, r.DOWNSAMPLE_METHODS), function(e) {
    r.wrapMethod(e, et(mA, t));
  });
}
function mA(r, t) {
  var e = Bh(r);
  return e && e.setOutputEnd((t || this).count()), t;
}
function Bh(r) {
  var t = (r.ecModel || {}).scheduler, e = t && t.getPipeline(r.uid);
  if (e) {
    var i = e.currentTask;
    if (i) {
      var n = i.agentStubMap;
      n && (i = n.get(r.uid));
    }
    return i;
  }
}
var ne = (
  /** @class */
  function() {
    function r() {
      this.group = new St(), this.uid = ll("viewComponent");
    }
    return r.prototype.init = function(t, e) {
    }, r.prototype.render = function(t, e, i, n) {
    }, r.prototype.dispose = function(t, e) {
    }, r.prototype.updateView = function(t, e, i, n) {
    }, r.prototype.updateLayout = function(t, e, i, n) {
    }, r.prototype.updateVisual = function(t, e, i, n) {
    }, r.prototype.toggleBlurSeries = function(t, e, i) {
    }, r.prototype.eachRendered = function(t) {
      var e = this.group;
      e && e.traverse(t);
    }, r;
  }()
);
Xc(ne);
qs(ne);
function xf() {
  var r = Tt();
  return function(t) {
    var e = r(t), i = t.pipelineContext, n = !!e.large, a = !!e.progressiveRender, o = e.large = !!(i && i.large), s = e.progressiveRender = !!(i && i.progressiveRender);
    return (n !== o || a !== s) && "reset";
  };
}
var Y0 = Tt(), _A = xf(), me = (
  /** @class */
  function() {
    function r() {
      this.group = new St(), this.uid = ll("viewChart"), this.renderTask = ba({
        plan: bA,
        reset: xA
      }), this.renderTask.context = {
        view: this
      };
    }
    return r.prototype.init = function(t, e) {
    }, r.prototype.render = function(t, e, i, n) {
    }, r.prototype.highlight = function(t, e, i, n) {
      var a = t.getData(n && n.dataType);
      a && cp(a, n, "emphasis");
    }, r.prototype.downplay = function(t, e, i, n) {
      var a = t.getData(n && n.dataType);
      a && cp(a, n, "normal");
    }, r.prototype.remove = function(t, e) {
      this.group.removeAll();
    }, r.prototype.dispose = function(t, e) {
    }, r.prototype.updateView = function(t, e, i, n) {
      this.render(t, e, i, n);
    }, r.prototype.updateLayout = function(t, e, i, n) {
      this.render(t, e, i, n);
    }, r.prototype.updateVisual = function(t, e, i, n) {
      this.render(t, e, i, n);
    }, r.prototype.eachRendered = function(t) {
      al(this.group, t);
    }, r.markUpdateMethod = function(t, e) {
      Y0(t).updateMethod = e;
    }, r.protoInitialize = function() {
      var t = r.prototype;
      t.type = "chart";
    }(), r;
  }()
);
function hp(r, t, e) {
  r && Pa(r) && (t === "emphasis" ? Ss : Ts)(r, e);
}
function cp(r, t, e) {
  var i = _i(r, t), n = t && t.highlightKey != null ? BS(t.highlightKey) : null;
  i != null ? T(Rt(i), function(a) {
    hp(r.getItemGraphicEl(a), e, n);
  }) : r.eachItemGraphicEl(function(a) {
    hp(a, e, n);
  });
}
Xc(me);
qs(me);
function bA(r) {
  return _A(r.model);
}
function xA(r) {
  var t = r.model, e = r.ecModel, i = r.api, n = r.payload, a = t.pipelineContext.progressiveRender, o = r.view, s = n && Y0(n).updateMethod, l = a ? "incrementalPrepareRender" : s && o[s] ? s : "render";
  return l !== "render" && o[l](t, e, i, n), wA[l];
}
var wA = {
  incrementalPrepareRender: {
    progress: function(r, t) {
      t.view.incrementalRender(r, t.model, t.ecModel, t.api, t.payload);
    }
  },
  render: {
    // Put view.render in `progress` to support appendData. But in this case
    // view.render should not be called in reset, otherwise it will be called
    // twise. Use `forceFirstProgress` to make sure that view.render is called
    // in any cases.
    forceFirstProgress: !0,
    progress: function(r, t) {
      t.view.render(t.model, t.ecModel, t.api, t.payload);
    }
  }
}, Ls = "\0__throttleOriginMethod", fp = "\0__throttleRate", dp = "\0__throttleType";
function wf(r, t, e) {
  var i, n = 0, a = 0, o = null, s, l, u, h;
  t = t || 0;
  function c() {
    a = (/* @__PURE__ */ new Date()).getTime(), o = null, r.apply(l, u || []);
  }
  var f = function() {
    for (var d = [], v = 0; v < arguments.length; v++)
      d[v] = arguments[v];
    i = (/* @__PURE__ */ new Date()).getTime(), l = this, u = d;
    var g = h || t, p = h || e;
    h = null, s = i - (p ? n : a) - g, clearTimeout(o), p ? o = setTimeout(c, g) : s >= 0 ? c() : o = setTimeout(c, -s), n = i;
  };
  return f.clear = function() {
    o && (clearTimeout(o), o = null);
  }, f.debounceNextCall = function(d) {
    h = d;
  }, f;
}
function Sf(r, t, e, i) {
  var n = r[t];
  if (n) {
    var a = n[Ls] || n, o = n[dp], s = n[fp];
    if (s !== e || o !== i) {
      if (e == null || !i)
        return r[t] = a;
      n = r[t] = wf(a, e, i === "debounce"), n[Ls] = a, n[dp] = i, n[fp] = e;
    }
    return n;
  }
}
function zh(r, t) {
  var e = r[t];
  e && e[Ls] && (e.clear && e.clear(), r[t] = e[Ls]);
}
var vp = Tt(), pp = {
  itemStyle: un(n0, !0),
  lineStyle: un(i0, !0)
}, SA = {
  lineStyle: "stroke",
  itemStyle: "fill"
};
function X0(r, t) {
  var e = r.visualStyleMapper || pp[t];
  return e || (console.warn("Unknown style type '" + t + "'."), pp.itemStyle);
}
function Z0(r, t) {
  var e = r.visualDrawType || SA[t];
  return e || (console.warn("Unknown style type '" + t + "'."), "fill");
}
var TA = {
  createOnAllSeries: !0,
  performRawSeries: !0,
  reset: function(r, t) {
    var e = r.getData(), i = r.visualStyleAccessPath || "itemStyle", n = r.getModel(i), a = X0(r, i), o = a(n), s = n.getShallow("decal");
    s && (e.setVisual("decal", s), s.dirty = !0);
    var l = Z0(r, i), u = o[l], h = Q(u) ? u : null, c = o.fill === "auto" || o.stroke === "auto";
    if (!o[l] || h || c) {
      var f = r.getColorFromPalette(
        // TODO series count changed.
        r.name,
        null,
        t.getSeriesCount()
      );
      o[l] || (o[l] = f, e.setVisual("colorFromPalette", !0)), o.fill = o.fill === "auto" || Q(o.fill) ? f : o.fill, o.stroke = o.stroke === "auto" || Q(o.stroke) ? f : o.stroke;
    }
    if (e.setVisual("style", o), e.setVisual("drawType", l), !t.isSeriesFiltered(r) && h)
      return e.setVisual("colorFromPalette", !1), {
        dataEach: function(d, v) {
          var g = r.getDataParams(v), p = $({}, o);
          p[l] = h(g), d.setItemVisual(v, "style", p);
        }
      };
  }
}, Nn = new bt(), CA = {
  createOnAllSeries: !0,
  performRawSeries: !0,
  reset: function(r, t) {
    if (!(r.ignoreStyleOnData || t.isSeriesFiltered(r))) {
      var e = r.getData(), i = r.visualStyleAccessPath || "itemStyle", n = X0(r, i), a = e.getVisual("drawType");
      return {
        dataEach: e.hasItemOption ? function(o, s) {
          var l = o.getRawDataItem(s);
          if (l && l[i]) {
            Nn.option = l[i];
            var u = n(Nn), h = o.ensureUniqueItemVisual(s, "style");
            $(h, u), Nn.option.decal && (o.setItemVisual(s, "decal", Nn.option.decal), Nn.option.decal.dirty = !0), a in u && o.setItemVisual(s, "colorFromPalette", !1);
          }
        } : null
      };
    }
  }
}, AA = {
  performRawSeries: !0,
  overallReset: function(r) {
    var t = tt();
    r.eachSeries(function(e) {
      var i = e.getColorBy();
      if (!e.isColorBySeries()) {
        var n = e.type + "-" + i, a = t.get(n);
        a || (a = {}, t.set(n, a)), vp(e).scope = a;
      }
    }), r.eachSeries(function(e) {
      if (!(e.isColorBySeries() || r.isSeriesFiltered(e))) {
        var i = e.getRawData(), n = {}, a = e.getData(), o = vp(e).scope, s = e.visualStyleAccessPath || "itemStyle", l = Z0(e, s);
        a.each(function(u) {
          var h = a.getRawIndex(u);
          n[h] = u;
        }), i.each(function(u) {
          var h = n[u], c = a.getItemVisual(h, "colorFromPalette");
          if (c) {
            var f = a.ensureUniqueItemVisual(h, "style"), d = i.getName(u) || u + "", v = i.count();
            f[l] = e.getColorFromPalette(d, o, v);
          }
        });
      }
    });
  }
}, So = Math.PI;
function MA(r, t) {
  t = t || {}, ht(t, {
    text: "loading",
    textColor: "#000",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    fontFamily: "sans-serif",
    maskColor: "rgba(255, 255, 255, 0.8)",
    showSpinner: !0,
    color: "#5470c6",
    spinnerRadius: 10,
    lineWidth: 5,
    zlevel: 0
  });
  var e = new St(), i = new Mt({
    style: {
      fill: t.maskColor
    },
    zlevel: t.zlevel,
    z: 1e4
  });
  e.add(i);
  var n = new Ht({
    style: {
      text: t.text,
      fill: t.textColor,
      fontSize: t.fontSize,
      fontWeight: t.fontWeight,
      fontStyle: t.fontStyle,
      fontFamily: t.fontFamily
    },
    zlevel: t.zlevel,
    z: 10001
  }), a = new Mt({
    style: {
      fill: "none"
    },
    textContent: n,
    textConfig: {
      position: "right",
      distance: 10
    },
    zlevel: t.zlevel,
    z: 10001
  });
  e.add(a);
  var o;
  return t.showSpinner && (o = new il({
    shape: {
      startAngle: -So / 2,
      endAngle: -So / 2 + 0.1,
      r: t.spinnerRadius
    },
    style: {
      stroke: t.color,
      lineCap: "round",
      lineWidth: t.lineWidth
    },
    zlevel: t.zlevel,
    z: 10001
  }), o.animateShape(!0).when(1e3, {
    endAngle: So * 3 / 2
  }).start("circularInOut"), o.animateShape(!0).when(1e3, {
    startAngle: So * 3 / 2
  }).delay(300).start("circularInOut"), e.add(o)), e.resize = function() {
    var s = n.getBoundingRect().width, l = t.showSpinner ? t.spinnerRadius : 0, u = (r.getWidth() - l * 2 - (t.showSpinner && s ? 10 : 0) - s) / 2 - (t.showSpinner && s ? 0 : 5 + s / 2) + (t.showSpinner ? 0 : s / 2) + (s ? 0 : l), h = r.getHeight() / 2;
    t.showSpinner && o.setShape({
      cx: u,
      cy: h
    }), a.setShape({
      x: u - l,
      y: h - l,
      width: l * 2,
      height: l * 2
    }), i.setShape({
      x: 0,
      y: 0,
      width: r.getWidth(),
      height: r.getHeight()
    });
  }, e.resize(), e;
}
var q0 = (
  /** @class */
  function() {
    function r(t, e, i, n) {
      this._stageTaskMap = tt(), this.ecInstance = t, this.api = e, i = this._dataProcessorHandlers = i.slice(), n = this._visualHandlers = n.slice(), this._allHandlers = i.concat(n);
    }
    return r.prototype.restoreData = function(t, e) {
      t.restoreData(e), this._stageTaskMap.each(function(i) {
        var n = i.overallTask;
        n && n.dirty();
      });
    }, r.prototype.getPerformArgs = function(t, e) {
      if (t.__pipeline) {
        var i = this._pipelineMap.get(t.__pipeline.id), n = i.context, a = !e && i.progressiveEnabled && (!n || n.progressiveRender) && t.__idxInPipeline > i.blockIndex, o = a ? i.step : null, s = n && n.modDataCount, l = s != null ? Math.ceil(s / o) : null;
        return {
          step: o,
          modBy: l,
          modDataCount: s
        };
      }
    }, r.prototype.getPipeline = function(t) {
      return this._pipelineMap.get(t);
    }, r.prototype.updateStreamModes = function(t, e) {
      var i = this._pipelineMap.get(t.uid), n = t.getData(), a = n.count(), o = i.progressiveEnabled && e.incrementalPrepareRender && a >= i.threshold, s = t.get("large") && a >= t.get("largeThreshold"), l = t.get("progressiveChunkMode") === "mod" ? a : null;
      t.pipelineContext = i.context = {
        progressiveRender: o,
        modDataCount: l,
        large: s
      };
    }, r.prototype.restorePipelines = function(t) {
      var e = this, i = e._pipelineMap = tt();
      t.eachSeries(function(n) {
        var a = n.getProgressive(), o = n.uid;
        i.set(o, {
          id: o,
          head: null,
          tail: null,
          threshold: n.getProgressiveThreshold(),
          progressiveEnabled: a && !(n.preventIncremental && n.preventIncremental()),
          blockIndex: -1,
          step: Math.round(a || 700),
          count: 0
        }), e._pipe(n, n.dataTask);
      });
    }, r.prototype.prepareStageTasks = function() {
      var t = this._stageTaskMap, e = this.api.getModel(), i = this.api;
      T(this._allHandlers, function(n) {
        var a = t.get(n.uid) || t.set(n.uid, {}), o = "";
        ke(!(n.reset && n.overallReset), o), n.reset && this._createSeriesStageTask(n, a, e, i), n.overallReset && this._createOverallStageTask(n, a, e, i);
      }, this);
    }, r.prototype.prepareView = function(t, e, i, n) {
      var a = t.renderTask, o = a.context;
      o.model = e, o.ecModel = i, o.api = n, a.__block = !t.incrementalPrepareRender, this._pipe(e, a);
    }, r.prototype.performDataProcessorTasks = function(t, e) {
      this._performStageTasks(this._dataProcessorHandlers, t, e, {
        block: !0
      });
    }, r.prototype.performVisualTasks = function(t, e, i) {
      this._performStageTasks(this._visualHandlers, t, e, i);
    }, r.prototype._performStageTasks = function(t, e, i, n) {
      n = n || {};
      var a = !1, o = this;
      T(t, function(l, u) {
        if (!(n.visualType && n.visualType !== l.visualType)) {
          var h = o._stageTaskMap.get(l.uid), c = h.seriesTaskMap, f = h.overallTask;
          if (f) {
            var d, v = f.agentStubMap;
            v.each(function(p) {
              s(n, p) && (p.dirty(), d = !0);
            }), d && f.dirty(), o.updatePayload(f, i);
            var g = o.getPerformArgs(f, n.block);
            v.each(function(p) {
              p.perform(g);
            }), f.perform(g) && (a = !0);
          } else c && c.each(function(p, y) {
            s(n, p) && p.dirty();
            var m = o.getPerformArgs(p, n.block);
            m.skip = !l.performRawSeries && e.isSeriesFiltered(p.context.model), o.updatePayload(p, i), p.perform(m) && (a = !0);
          });
        }
      });
      function s(l, u) {
        return l.setDirty && (!l.dirtyMap || l.dirtyMap.get(u.__pipeline.id));
      }
      this.unfinished = a || this.unfinished;
    }, r.prototype.performSeriesTasks = function(t) {
      var e;
      t.eachSeries(function(i) {
        e = i.dataTask.perform() || e;
      }), this.unfinished = e || this.unfinished;
    }, r.prototype.plan = function() {
      this._pipelineMap.each(function(t) {
        var e = t.tail;
        do {
          if (e.__block) {
            t.blockIndex = e.__idxInPipeline;
            break;
          }
          e = e.getUpstream();
        } while (e);
      });
    }, r.prototype.updatePayload = function(t, e) {
      e !== "remain" && (t.context.payload = e);
    }, r.prototype._createSeriesStageTask = function(t, e, i, n) {
      var a = this, o = e.seriesTaskMap, s = e.seriesTaskMap = tt(), l = t.seriesType, u = t.getTargetSeries;
      t.createOnAllSeries ? i.eachRawSeries(h) : l ? i.eachRawSeriesByType(l, h) : u && u(i, n).each(h);
      function h(c) {
        var f = c.uid, d = s.set(f, o && o.get(f) || ba({
          plan: PA,
          reset: EA,
          count: $A
        }));
        d.context = {
          model: c,
          ecModel: i,
          api: n,
          // PENDING: `useClearVisual` not used?
          useClearVisual: t.isVisual && !t.isLayout,
          plan: t.plan,
          reset: t.reset,
          scheduler: a
        }, a._pipe(c, d);
      }
    }, r.prototype._createOverallStageTask = function(t, e, i, n) {
      var a = this, o = e.overallTask = e.overallTask || ba({
        reset: DA
      });
      o.context = {
        ecModel: i,
        api: n,
        overallReset: t.overallReset,
        scheduler: a
      };
      var s = o.agentStubMap, l = o.agentStubMap = tt(), u = t.seriesType, h = t.getTargetSeries, c = !0, f = !1, d = "";
      ke(!t.createOnAllSeries, d), u ? i.eachRawSeriesByType(u, v) : h ? h(i, n).each(v) : (c = !1, T(i.getSeries(), v));
      function v(g) {
        var p = g.uid, y = l.set(p, s && s.get(p) || // When the result of `getTargetSeries` changed, the overallTask
        // should be set as dirty and re-performed.
        (f = !0, ba({
          reset: kA,
          onDirty: LA
        })));
        y.context = {
          model: g,
          overallProgress: c
          // FIXME:TS never used, so comment it
          // modifyOutputEnd: modifyOutputEnd
        }, y.agent = o, y.__block = c, a._pipe(g, y);
      }
      f && o.dirty();
    }, r.prototype._pipe = function(t, e) {
      var i = t.uid, n = this._pipelineMap.get(i);
      !n.head && (n.head = e), n.tail && n.tail.pipe(e), n.tail = e, e.__idxInPipeline = n.count++, e.__pipeline = n;
    }, r.wrapStageHandler = function(t, e) {
      return Q(t) && (t = {
        overallReset: t,
        seriesType: OA(t)
      }), t.uid = ll("stageHandler"), e && (t.visualType = e), t;
    }, r;
  }()
);
function DA(r) {
  r.overallReset(r.ecModel, r.api, r.payload);
}
function kA(r) {
  return r.overallProgress && IA;
}
function IA() {
  this.agent.dirty(), this.getDownstream().dirty();
}
function LA() {
  this.agent && this.agent.dirty();
}
function PA(r) {
  return r.plan ? r.plan(r.model, r.ecModel, r.api, r.payload) : null;
}
function EA(r) {
  r.useClearVisual && r.data.clearAllVisual();
  var t = r.resetDefines = Rt(r.reset(r.model, r.ecModel, r.api, r.payload));
  return t.length > 1 ? H(t, function(e, i) {
    return K0(i);
  }) : RA;
}
var RA = K0(0);
function K0(r) {
  return function(t, e) {
    var i = e.data, n = e.resetDefines[r];
    if (n && n.dataEach)
      for (var a = t.start; a < t.end; a++)
        n.dataEach(i, a);
    else n && n.progress && n.progress(t, i);
  };
}
function $A(r) {
  return r.data.count();
}
function OA(r) {
  Ps = null;
  try {
    r(Na, j0);
  } catch {
  }
  return Ps;
}
var Na = {}, j0 = {}, Ps;
Q0(Na, pf);
Q0(j0, A0);
Na.eachSeriesByType = Na.eachRawSeriesByType = function(r) {
  Ps = r;
};
Na.eachComponent = function(r) {
  r.mainType === "series" && r.subType && (Ps = r.subType);
};
function Q0(r, t) {
  for (var e in t.prototype)
    r[e] = Et;
}
var gp = ["#37A2DA", "#32C5E9", "#67E0E3", "#9FE6B8", "#FFDB5C", "#ff9f7f", "#fb7293", "#E062AE", "#E690D1", "#e7bcf3", "#9d96f5", "#8378EA", "#96BFFF"];
const NA = {
  color: gp,
  colorLayer: [["#37A2DA", "#ffd85c", "#fd7b5f"], ["#37A2DA", "#67E0E3", "#FFDB5C", "#ff9f7f", "#E062AE", "#9d96f5"], ["#37A2DA", "#32C5E9", "#9FE6B8", "#FFDB5C", "#ff9f7f", "#fb7293", "#e7bcf3", "#8378EA", "#96BFFF"], gp]
};
var Bt = "#B9B8CE", yp = "#100C2A", To = function() {
  return {
    axisLine: {
      lineStyle: {
        color: Bt
      }
    },
    splitLine: {
      lineStyle: {
        color: "#484753"
      }
    },
    splitArea: {
      areaStyle: {
        color: ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.05)"]
      }
    },
    minorSplitLine: {
      lineStyle: {
        color: "#20203B"
      }
    }
  };
}, mp = ["#4992ff", "#7cffb2", "#fddd60", "#ff6e76", "#58d9f9", "#05c091", "#ff8a45", "#8d48e3", "#dd79ff"], J0 = {
  darkMode: !0,
  color: mp,
  backgroundColor: yp,
  axisPointer: {
    lineStyle: {
      color: "#817f91"
    },
    crossStyle: {
      color: "#817f91"
    },
    label: {
      // TODO Contrast of label backgorundColor
      color: "#fff"
    }
  },
  legend: {
    textStyle: {
      color: Bt
    },
    pageTextStyle: {
      color: Bt
    }
  },
  textStyle: {
    color: Bt
  },
  title: {
    textStyle: {
      color: "#EEF1FA"
    },
    subtextStyle: {
      color: "#B9B8CE"
    }
  },
  toolbox: {
    iconStyle: {
      borderColor: Bt
    }
  },
  dataZoom: {
    borderColor: "#71708A",
    textStyle: {
      color: Bt
    },
    brushStyle: {
      color: "rgba(135,163,206,0.3)"
    },
    handleStyle: {
      color: "#353450",
      borderColor: "#C5CBE3"
    },
    moveHandleStyle: {
      color: "#B0B6C3",
      opacity: 0.3
    },
    fillerColor: "rgba(135,163,206,0.2)",
    emphasis: {
      handleStyle: {
        borderColor: "#91B7F2",
        color: "#4D587D"
      },
      moveHandleStyle: {
        color: "#636D9A",
        opacity: 0.7
      }
    },
    dataBackground: {
      lineStyle: {
        color: "#71708A",
        width: 1
      },
      areaStyle: {
        color: "#71708A"
      }
    },
    selectedDataBackground: {
      lineStyle: {
        color: "#87A3CE"
      },
      areaStyle: {
        color: "#87A3CE"
      }
    }
  },
  visualMap: {
    textStyle: {
      color: Bt
    }
  },
  timeline: {
    lineStyle: {
      color: Bt
    },
    label: {
      color: Bt
    },
    controlStyle: {
      color: Bt,
      borderColor: Bt
    }
  },
  calendar: {
    itemStyle: {
      color: yp
    },
    dayLabel: {
      color: Bt
    },
    monthLabel: {
      color: Bt
    },
    yearLabel: {
      color: Bt
    }
  },
  timeAxis: To(),
  logAxis: To(),
  valueAxis: To(),
  categoryAxis: To(),
  line: {
    symbol: "circle"
  },
  graph: {
    color: mp
  },
  gauge: {
    title: {
      color: Bt
    },
    axisLine: {
      lineStyle: {
        color: [[1, "rgba(207,212,219,0.2)"]]
      }
    },
    axisLabel: {
      color: Bt
    },
    detail: {
      color: "#EEF1FA"
    }
  },
  candlestick: {
    itemStyle: {
      color: "#f64e56",
      color0: "#54ea92",
      borderColor: "#f64e56",
      borderColor0: "#54ea92"
      // borderColor: '#ca2824',
      // borderColor0: '#09a443'
    }
  }
};
J0.categoryAxis.splitLine.show = !1;
var BA = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.normalizeQuery = function(t) {
      var e = {}, i = {}, n = {};
      if (V(t)) {
        var a = He(t);
        e.mainType = a.main || null, e.subType = a.sub || null;
      } else {
        var o = ["Index", "Name", "Id"], s = {
          name: 1,
          dataIndex: 1,
          dataType: 1
        };
        T(t, function(l, u) {
          for (var h = !1, c = 0; c < o.length; c++) {
            var f = o[c], d = u.lastIndexOf(f);
            if (d > 0 && d === u.length - f.length) {
              var v = u.slice(0, d);
              v !== "data" && (e.mainType = v, e[f.toLowerCase()] = l, h = !0);
            }
          }
          s.hasOwnProperty(u) && (i[u] = l, h = !0), h || (n[u] = l);
        });
      }
      return {
        cptQuery: e,
        dataQuery: i,
        otherQuery: n
      };
    }, r.prototype.filter = function(t, e) {
      var i = this.eventInfo;
      if (!i)
        return !0;
      var n = i.targetEl, a = i.packedEvent, o = i.model, s = i.view;
      if (!o || !s)
        return !0;
      var l = e.cptQuery, u = e.dataQuery;
      return h(l, o, "mainType") && h(l, o, "subType") && h(l, o, "index", "componentIndex") && h(l, o, "name") && h(l, o, "id") && h(u, a, "name") && h(u, a, "dataIndex") && h(u, a, "dataType") && (!s.filterForExposedEvent || s.filterForExposedEvent(t, e.otherQuery, n, a));
      function h(c, f, d, v) {
        return c[d] == null || f[v || d] === c[d];
      }
    }, r.prototype.afterTrigger = function() {
      this.eventInfo = null;
    }, r;
  }()
), Fh = ["symbol", "symbolSize", "symbolRotate", "symbolOffset"], _p = Fh.concat(["symbolKeepAspect"]), zA = {
  createOnAllSeries: !0,
  // For legend.
  performRawSeries: !0,
  reset: function(r, t) {
    var e = r.getData();
    if (r.legendIcon && e.setVisual("legendIcon", r.legendIcon), !r.hasSymbolVisual)
      return;
    for (var i = {}, n = {}, a = !1, o = 0; o < Fh.length; o++) {
      var s = Fh[o], l = r.get(s);
      Q(l) ? (a = !0, n[s] = l) : i[s] = l;
    }
    if (i.symbol = i.symbol || r.defaultSymbol, e.setVisual($({
      legendIcon: r.legendIcon || i.symbol,
      symbolKeepAspect: r.get("symbolKeepAspect")
    }, i)), t.isSeriesFiltered(r))
      return;
    var u = xt(n);
    function h(c, f) {
      for (var d = r.getRawValue(f), v = r.getDataParams(f), g = 0; g < u.length; g++) {
        var p = u[g];
        c.setItemVisual(f, p, n[p](d, v));
      }
    }
    return {
      dataEach: a ? h : null
    };
  }
}, FA = {
  createOnAllSeries: !0,
  // For legend.
  performRawSeries: !0,
  reset: function(r, t) {
    if (!r.hasSymbolVisual || t.isSeriesFiltered(r))
      return;
    var e = r.getData();
    function i(n, a) {
      for (var o = n.getItemModel(a), s = 0; s < _p.length; s++) {
        var l = _p[s], u = o.getShallow(l, !0);
        u != null && n.setItemVisual(a, l, u);
      }
    }
    return {
      dataEach: e.hasItemOption ? i : null
    };
  }
};
function t_(r, t, e) {
  switch (e) {
    case "color":
      var i = r.getItemVisual(t, "style");
      return i[r.getVisual("drawType")];
    case "opacity":
      return r.getItemVisual(t, "style").opacity;
    case "symbol":
    case "symbolSize":
    case "liftZ":
      return r.getItemVisual(t, e);
  }
}
function e_(r, t) {
  switch (t) {
    case "color":
      var e = r.getVisual("style");
      return e[r.getVisual("drawType")];
    case "opacity":
      return r.getVisual("style").opacity;
    case "symbol":
    case "symbolSize":
    case "liftZ":
      return r.getVisual(t);
  }
}
function HA(r, t, e, i) {
  switch (e) {
    case "color":
      var n = r.ensureUniqueItemVisual(t, "style");
      n[r.getVisual("drawType")] = i, r.setItemVisual(t, "colorFromPalette", !1);
      break;
    case "opacity":
      r.ensureUniqueItemVisual(t, "style").opacity = i;
      break;
    case "symbol":
    case "symbolSize":
    case "liftZ":
      r.setItemVisual(t, e, i);
      break;
  }
}
function Fi(r, t, e, i, n) {
  var a = r + t;
  e.isSilent(a) || i.eachComponent({
    mainType: "series",
    subType: "pie"
  }, function(o) {
    for (var s = o.seriesIndex, l = o.option.selectedMap, u = n.selected, h = 0; h < u.length; h++)
      if (u[h].seriesIndex === s) {
        var c = o.getData(), f = _i(c, n.fromActionPayload);
        e.trigger(a, {
          type: a,
          seriesId: o.id,
          name: B(f) ? c.getName(f[0]) : c.getName(f),
          selected: V(l) ? l : $({}, l)
        });
      }
  });
}
function VA(r, t, e) {
  r.on("selectchanged", function(i) {
    var n = e.getModel();
    i.isFromClick ? (Fi("map", "selectchanged", t, n, i), Fi("pie", "selectchanged", t, n, i)) : i.fromAction === "select" ? (Fi("map", "selected", t, n, i), Fi("pie", "selected", t, n, i)) : i.fromAction === "unselect" && (Fi("map", "unselected", t, n, i), Fi("pie", "unselected", t, n, i));
  });
}
function oa(r, t, e) {
  for (var i; r && !(t(r) && (i = r, e)); )
    r = r.__hostTarget || r.parent;
  return i;
}
var GA = Math.round(Math.random() * 9), WA = typeof Object.defineProperty == "function", UA = function() {
  function r() {
    this._id = "__ec_inner_" + GA++;
  }
  return r.prototype.get = function(t) {
    return this._guard(t)[this._id];
  }, r.prototype.set = function(t, e) {
    var i = this._guard(t);
    return WA ? Object.defineProperty(i, this._id, {
      value: e,
      enumerable: !1,
      configurable: !0
    }) : i[this._id] = e, this;
  }, r.prototype.delete = function(t) {
    return this.has(t) ? (delete this._guard(t)[this._id], !0) : !1;
  }, r.prototype.has = function(t) {
    return !!this._guard(t)[this._id];
  }, r.prototype._guard = function(t) {
    if (t !== Object(t))
      throw TypeError("Value of WeakMap is not a non-null object.");
    return t;
  }, r;
}(), YA = pt.extend({
  type: "triangle",
  shape: {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
  },
  buildPath: function(r, t) {
    var e = t.cx, i = t.cy, n = t.width / 2, a = t.height / 2;
    r.moveTo(e, i - a), r.lineTo(e + n, i + a), r.lineTo(e - n, i + a), r.closePath();
  }
}), XA = pt.extend({
  type: "diamond",
  shape: {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
  },
  buildPath: function(r, t) {
    var e = t.cx, i = t.cy, n = t.width / 2, a = t.height / 2;
    r.moveTo(e, i - a), r.lineTo(e + n, i), r.lineTo(e, i + a), r.lineTo(e - n, i), r.closePath();
  }
}), ZA = pt.extend({
  type: "pin",
  shape: {
    // x, y on the cusp
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  buildPath: function(r, t) {
    var e = t.x, i = t.y, n = t.width / 5 * 3, a = Math.max(n, t.height), o = n / 2, s = o * o / (a - o), l = i - a + o + s, u = Math.asin(s / o), h = Math.cos(u) * o, c = Math.sin(u), f = Math.cos(u), d = o * 0.6, v = o * 0.7;
    r.moveTo(e - h, l + s), r.arc(e, l, o, Math.PI - u, Math.PI * 2 + u), r.bezierCurveTo(e + h - c * d, l + s + f * d, e, i - v, e, i), r.bezierCurveTo(e, i - v, e - h + c * d, l + s + f * d, e - h, l + s), r.closePath();
  }
}), qA = pt.extend({
  type: "arrow",
  shape: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  buildPath: function(r, t) {
    var e = t.height, i = t.width, n = t.x, a = t.y, o = i / 3 * 2;
    r.moveTo(n, a), r.lineTo(n + o, a + e), r.lineTo(n, a + e / 4 * 3), r.lineTo(n - o, a + e), r.lineTo(n, a), r.closePath();
  }
}), KA = {
  line: Ar,
  rect: Mt,
  roundRect: Mt,
  square: Mt,
  circle: el,
  diamond: XA,
  pin: ZA,
  arrow: qA,
  triangle: YA
}, jA = {
  line: function(r, t, e, i, n) {
    n.x1 = r, n.y1 = t + i / 2, n.x2 = r + e, n.y2 = t + i / 2;
  },
  rect: function(r, t, e, i, n) {
    n.x = r, n.y = t, n.width = e, n.height = i;
  },
  roundRect: function(r, t, e, i, n) {
    n.x = r, n.y = t, n.width = e, n.height = i, n.r = Math.min(e, i) / 4;
  },
  square: function(r, t, e, i, n) {
    var a = Math.min(e, i);
    n.x = r, n.y = t, n.width = a, n.height = a;
  },
  circle: function(r, t, e, i, n) {
    n.cx = r + e / 2, n.cy = t + i / 2, n.r = Math.min(e, i) / 2;
  },
  diamond: function(r, t, e, i, n) {
    n.cx = r + e / 2, n.cy = t + i / 2, n.width = e, n.height = i;
  },
  pin: function(r, t, e, i, n) {
    n.x = r + e / 2, n.y = t + i / 2, n.width = e, n.height = i;
  },
  arrow: function(r, t, e, i, n) {
    n.x = r + e / 2, n.y = t + i / 2, n.width = e, n.height = i;
  },
  triangle: function(r, t, e, i, n) {
    n.cx = r + e / 2, n.cy = t + i / 2, n.width = e, n.height = i;
  }
}, Hh = {};
T(KA, function(r, t) {
  Hh[t] = new r();
});
var QA = pt.extend({
  type: "symbol",
  shape: {
    symbolType: "",
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  calculateTextPosition: function(r, t, e) {
    var i = _s(r, t, e), n = this.shape;
    return n && n.symbolType === "pin" && t.position === "inside" && (i.y = e.y + e.height * 0.4), i;
  },
  buildPath: function(r, t, e) {
    var i = t.symbolType;
    if (i !== "none") {
      var n = Hh[i];
      n || (i = "rect", n = Hh[i]), jA[i](t.x, t.y, t.width, t.height, n.shape), n.buildPath(r, n.shape, e);
    }
  }
});
function JA(r, t) {
  if (this.type !== "image") {
    var e = this.style;
    this.__isEmptyBrush ? (e.stroke = r, e.fill = t || "#fff", e.lineWidth = 2) : this.shape.symbolType === "line" ? e.stroke = r : e.fill = r, this.markRedraw();
  }
}
function vn(r, t, e, i, n, a, o) {
  var s = r.indexOf("empty") === 0;
  s && (r = r.substr(5, 1).toLowerCase() + r.substr(6));
  var l;
  return r.indexOf("image://") === 0 ? l = Km(r.slice(8), new ot(t, e, i, n), o ? "center" : "cover") : r.indexOf("path://") === 0 ? l = nf(r.slice(7), {}, new ot(t, e, i, n), o ? "center" : "cover") : l = new QA({
    shape: {
      symbolType: r,
      x: t,
      y: e,
      width: i,
      height: n
    }
  }), l.__isEmptyBrush = s, l.setColor = JA, a && l.setColor(a), l;
}
function tM(r) {
  return B(r) || (r = [+r, +r]), [r[0] || 0, r[1] || 0];
}
function r_(r, t) {
  if (r != null)
    return B(r) || (r = [r, r]), [Ct(r[0], t[0]) || 0, Ct(st(r[1], r[0]), t[1]) || 0];
}
function ai(r) {
  return isFinite(r);
}
function eM(r, t, e) {
  var i = t.x == null ? 0 : t.x, n = t.x2 == null ? 1 : t.x2, a = t.y == null ? 0 : t.y, o = t.y2 == null ? 0 : t.y2;
  t.global || (i = i * e.width + e.x, n = n * e.width + e.x, a = a * e.height + e.y, o = o * e.height + e.y), i = ai(i) ? i : 0, n = ai(n) ? n : 1, a = ai(a) ? a : 0, o = ai(o) ? o : 0;
  var s = r.createLinearGradient(i, a, n, o);
  return s;
}
function rM(r, t, e) {
  var i = e.width, n = e.height, a = Math.min(i, n), o = t.x == null ? 0.5 : t.x, s = t.y == null ? 0.5 : t.y, l = t.r == null ? 0.5 : t.r;
  t.global || (o = o * i + e.x, s = s * n + e.y, l = l * a), o = ai(o) ? o : 0.5, s = ai(s) ? s : 0.5, l = l >= 0 && ai(l) ? l : 0.5;
  var u = r.createRadialGradient(o, s, 0, o, s, l);
  return u;
}
function Vh(r, t, e) {
  for (var i = t.type === "radial" ? rM(r, t, e) : eM(r, t, e), n = t.colorStops, a = 0; a < n.length; a++)
    i.addColorStop(n[a].offset, n[a].color);
  return i;
}
function iM(r, t) {
  if (r === t || !r && !t)
    return !1;
  if (!r || !t || r.length !== t.length)
    return !0;
  for (var e = 0; e < r.length; e++)
    if (r[e] !== t[e])
      return !0;
  return !1;
}
function Co(r) {
  return parseInt(r, 10);
}
function Ao(r, t, e) {
  var i = ["width", "height"][t], n = ["clientWidth", "clientHeight"][t], a = ["paddingLeft", "paddingTop"][t], o = ["paddingRight", "paddingBottom"][t];
  if (e[i] != null && e[i] !== "auto")
    return parseFloat(e[i]);
  var s = document.defaultView.getComputedStyle(r);
  return (r[n] || Co(s[i]) || Co(r.style[i])) - (Co(s[a]) || 0) - (Co(s[o]) || 0) | 0;
}
function nM(r, t) {
  return !r || r === "solid" || !(t > 0) ? null : r === "dashed" ? [4 * t, 2 * t] : r === "dotted" ? [t] : wt(r) ? [r] : B(r) ? r : null;
}
function i_(r) {
  var t = r.style, e = t.lineDash && t.lineWidth > 0 && nM(t.lineDash, t.lineWidth), i = t.lineDashOffset;
  if (e) {
    var n = t.strokeNoScale && r.getLineScale ? r.getLineScale() : 1;
    n && n !== 1 && (e = H(e, function(a) {
      return a / n;
    }), i /= n);
  }
  return [e, i];
}
var aM = new bi(!0);
function Es(r) {
  var t = r.stroke;
  return !(t == null || t === "none" || !(r.lineWidth > 0));
}
function bp(r) {
  return typeof r == "string" && r !== "none";
}
function Rs(r) {
  var t = r.fill;
  return t != null && t !== "none";
}
function xp(r, t) {
  if (t.fillOpacity != null && t.fillOpacity !== 1) {
    var e = r.globalAlpha;
    r.globalAlpha = t.fillOpacity * t.opacity, r.fill(), r.globalAlpha = e;
  } else
    r.fill();
}
function wp(r, t) {
  if (t.strokeOpacity != null && t.strokeOpacity !== 1) {
    var e = r.globalAlpha;
    r.globalAlpha = t.strokeOpacity * t.opacity, r.stroke(), r.globalAlpha = e;
  } else
    r.stroke();
}
function Gh(r, t, e) {
  var i = Cm(t.image, t.__image, e);
  if (Ks(i)) {
    var n = r.createPattern(i, t.repeat || "repeat");
    if (typeof DOMMatrix == "function" && n && n.setTransform) {
      var a = new DOMMatrix();
      a.translateSelf(t.x || 0, t.y || 0), a.rotateSelf(0, 0, (t.rotation || 0) * F1), a.scaleSelf(t.scaleX || 1, t.scaleY || 1), n.setTransform(a);
    }
    return n;
  }
}
function oM(r, t, e, i) {
  var n, a = Es(e), o = Rs(e), s = e.strokePercent, l = s < 1, u = !t.path;
  (!t.silent || l) && u && t.createPathProxy();
  var h = t.path || aM, c = t.__dirty;
  if (!i) {
    var f = e.fill, d = e.stroke, v = o && !!f.colorStops, g = a && !!d.colorStops, p = o && !!f.image, y = a && !!d.image, m = void 0, _ = void 0, b = void 0, w = void 0, x = void 0;
    (v || g) && (x = t.getBoundingRect()), v && (m = c ? Vh(r, f, x) : t.__canvasFillGradient, t.__canvasFillGradient = m), g && (_ = c ? Vh(r, d, x) : t.__canvasStrokeGradient, t.__canvasStrokeGradient = _), p && (b = c || !t.__canvasFillPattern ? Gh(r, f, t) : t.__canvasFillPattern, t.__canvasFillPattern = b), y && (w = c || !t.__canvasStrokePattern ? Gh(r, d, t) : t.__canvasStrokePattern, t.__canvasStrokePattern = b), v ? r.fillStyle = m : p && (b ? r.fillStyle = b : o = !1), g ? r.strokeStyle = _ : y && (w ? r.strokeStyle = w : a = !1);
  }
  var S = t.getGlobalScale();
  h.setScale(S[0], S[1], t.segmentIgnoreThreshold);
  var A, M;
  r.setLineDash && e.lineDash && (n = i_(t), A = n[0], M = n[1]);
  var D = !0;
  (u || c & Yi) && (h.setDPR(r.dpr), l ? h.setContext(null) : (h.setContext(r), D = !1), h.reset(), t.buildPath(h, t.shape, i), h.toStatic(), t.pathUpdated()), D && h.rebuildPath(r, l ? s : 1), A && (r.setLineDash(A), r.lineDashOffset = M), i || (e.strokeFirst ? (a && wp(r, e), o && xp(r, e)) : (o && xp(r, e), a && wp(r, e))), A && r.setLineDash([]);
}
function sM(r, t, e) {
  var i = t.__image = Cm(e.image, t.__image, t, t.onload);
  if (!(!i || !Ks(i))) {
    var n = e.x || 0, a = e.y || 0, o = t.getWidth(), s = t.getHeight(), l = i.width / i.height;
    if (o == null && s != null ? o = s * l : s == null && o != null ? s = o / l : o == null && s == null && (o = i.width, s = i.height), e.sWidth && e.sHeight) {
      var u = e.sx || 0, h = e.sy || 0;
      r.drawImage(i, u, h, e.sWidth, e.sHeight, n, a, o, s);
    } else if (e.sx && e.sy) {
      var u = e.sx, h = e.sy, c = o - u, f = s - h;
      r.drawImage(i, u, h, c, f, n, a, o, s);
    } else
      r.drawImage(i, n, a, o, s);
  }
}
function lM(r, t, e) {
  var i, n = e.text;
  if (n != null && (n += ""), n) {
    r.font = e.font || gi, r.textAlign = e.textAlign, r.textBaseline = e.textBaseline;
    var a = void 0, o = void 0;
    r.setLineDash && e.lineDash && (i = i_(t), a = i[0], o = i[1]), a && (r.setLineDash(a), r.lineDashOffset = o), e.strokeFirst ? (Es(e) && r.strokeText(n, e.x, e.y), Rs(e) && r.fillText(n, e.x, e.y)) : (Rs(e) && r.fillText(n, e.x, e.y), Es(e) && r.strokeText(n, e.x, e.y)), a && r.setLineDash([]);
  }
}
var Sp = ["shadowBlur", "shadowOffsetX", "shadowOffsetY"], Tp = [
  ["lineCap", "butt"],
  ["lineJoin", "miter"],
  ["miterLimit", 10]
];
function n_(r, t, e, i, n) {
  var a = !1;
  if (!i && (e = e || {}, t === e))
    return !1;
  if (i || t.opacity !== e.opacity) {
    Zt(r, n), a = !0;
    var o = Math.max(Math.min(t.opacity, 1), 0);
    r.globalAlpha = isNaN(o) ? ci.opacity : o;
  }
  (i || t.blend !== e.blend) && (a || (Zt(r, n), a = !0), r.globalCompositeOperation = t.blend || ci.blend);
  for (var s = 0; s < Sp.length; s++) {
    var l = Sp[s];
    (i || t[l] !== e[l]) && (a || (Zt(r, n), a = !0), r[l] = r.dpr * (t[l] || 0));
  }
  return (i || t.shadowColor !== e.shadowColor) && (a || (Zt(r, n), a = !0), r.shadowColor = t.shadowColor || ci.shadowColor), a;
}
function Cp(r, t, e, i, n) {
  var a = Ba(t, n.inHover), o = i ? null : e && Ba(e, n.inHover) || {};
  if (a === o)
    return !1;
  var s = n_(r, a, o, i, n);
  if ((i || a.fill !== o.fill) && (s || (Zt(r, n), s = !0), bp(a.fill) && (r.fillStyle = a.fill)), (i || a.stroke !== o.stroke) && (s || (Zt(r, n), s = !0), bp(a.stroke) && (r.strokeStyle = a.stroke)), (i || a.opacity !== o.opacity) && (s || (Zt(r, n), s = !0), r.globalAlpha = a.opacity == null ? 1 : a.opacity), t.hasStroke()) {
    var l = a.lineWidth, u = l / (a.strokeNoScale && t.getLineScale ? t.getLineScale() : 1);
    r.lineWidth !== u && (s || (Zt(r, n), s = !0), r.lineWidth = u);
  }
  for (var h = 0; h < Tp.length; h++) {
    var c = Tp[h], f = c[0];
    (i || a[f] !== o[f]) && (s || (Zt(r, n), s = !0), r[f] = a[f] || c[1]);
  }
  return s;
}
function uM(r, t, e, i, n) {
  return n_(r, Ba(t, n.inHover), e && Ba(e, n.inHover), i, n);
}
function a_(r, t) {
  var e = t.transform, i = r.dpr || 1;
  e ? r.setTransform(i * e[0], i * e[1], i * e[2], i * e[3], i * e[4], i * e[5]) : r.setTransform(i, 0, 0, i, 0, 0);
}
function hM(r, t, e) {
  for (var i = !1, n = 0; n < r.length; n++) {
    var a = r[n];
    i = i || a.isZeroArea(), a_(t, a), t.beginPath(), a.buildPath(t, a.shape), t.clip();
  }
  e.allClipped = i;
}
function cM(r, t) {
  return r && t ? r[0] !== t[0] || r[1] !== t[1] || r[2] !== t[2] || r[3] !== t[3] || r[4] !== t[4] || r[5] !== t[5] : !(!r && !t);
}
var Ap = 1, Mp = 2, Dp = 3, kp = 4;
function fM(r) {
  var t = Rs(r), e = Es(r);
  return !(r.lineDash || !(+t ^ +e) || t && typeof r.fill != "string" || e && typeof r.stroke != "string" || r.strokePercent < 1 || r.strokeOpacity < 1 || r.fillOpacity < 1);
}
function Zt(r, t) {
  t.batchFill && r.fill(), t.batchStroke && r.stroke(), t.batchFill = "", t.batchStroke = "";
}
function Ba(r, t) {
  return t && r.__hoverStyle || r.style;
}
function o_(r, t) {
  oi(r, t, { inHover: !1, viewWidth: 0, viewHeight: 0 }, !0);
}
function oi(r, t, e, i) {
  var n = t.transform;
  if (!t.shouldBePainted(e.viewWidth, e.viewHeight, !1, !1)) {
    t.__dirty &= ~ee, t.__isRendered = !1;
    return;
  }
  var a = t.__clipPaths, o = e.prevElClipPaths, s = !1, l = !1;
  if ((!o || iM(a, o)) && (o && o.length && (Zt(r, e), r.restore(), l = s = !0, e.prevElClipPaths = null, e.allClipped = !1, e.prevEl = null), a && a.length && (Zt(r, e), r.save(), hM(a, r, e), s = !0), e.prevElClipPaths = a), e.allClipped) {
    t.__isRendered = !1;
    return;
  }
  t.beforeBrush && t.beforeBrush(), t.innerBeforeBrush();
  var u = e.prevEl;
  u || (l = s = !0);
  var h = t instanceof pt && t.autoBatch && fM(t.style);
  s || cM(n, u.transform) ? (Zt(r, e), a_(r, t)) : h || Zt(r, e);
  var c = Ba(t, e.inHover);
  t instanceof pt ? (e.lastDrawType !== Ap && (l = !0, e.lastDrawType = Ap), Cp(r, t, u, l, e), (!h || !e.batchFill && !e.batchStroke) && r.beginPath(), oM(r, t, c, h), h && (e.batchFill = c.fill || "", e.batchStroke = c.stroke || "")) : t instanceof ws ? (e.lastDrawType !== Dp && (l = !0, e.lastDrawType = Dp), Cp(r, t, u, l, e), lM(r, t, c)) : t instanceof Lr ? (e.lastDrawType !== Mp && (l = !0, e.lastDrawType = Mp), uM(r, t, u, l, e), sM(r, t, c)) : t.getTemporalDisplayables && (e.lastDrawType !== kp && (l = !0, e.lastDrawType = kp), dM(r, t, e)), h && i && Zt(r, e), t.innerAfterBrush(), t.afterBrush && t.afterBrush(), e.prevEl = t, t.__dirty = 0, t.__isRendered = !0;
}
function dM(r, t, e) {
  var i = t.getDisplayables(), n = t.getTemporalDisplayables();
  r.save();
  var a = {
    prevElClipPaths: null,
    prevEl: null,
    allClipped: !1,
    viewWidth: e.viewWidth,
    viewHeight: e.viewHeight,
    inHover: e.inHover
  }, o, s;
  for (o = t.getCursor(), s = i.length; o < s; o++) {
    var l = i[o];
    l.beforeBrush && l.beforeBrush(), l.innerBeforeBrush(), oi(r, l, a, o === s - 1), l.innerAfterBrush(), l.afterBrush && l.afterBrush(), a.prevEl = l;
  }
  for (var u = 0, h = n.length; u < h; u++) {
    var l = n[u];
    l.beforeBrush && l.beforeBrush(), l.innerBeforeBrush(), oi(r, l, a, u === h - 1), l.innerAfterBrush(), l.afterBrush && l.afterBrush(), a.prevEl = l;
  }
  t.clearTemporalDisplayables(), t.notClear = !0, r.restore();
}
var bu = new UA(), Ip = new Xa(100), Lp = ["symbol", "symbolSize", "symbolKeepAspect", "color", "backgroundColor", "dashArrayX", "dashArrayY", "maxTileWidth", "maxTileHeight"];
function Wh(r, t) {
  if (r === "none")
    return null;
  var e = t.getDevicePixelRatio(), i = t.getZr(), n = i.painter.type === "svg";
  r.dirty && bu.delete(r);
  var a = bu.get(r);
  if (a)
    return a;
  var o = ht(r, {
    symbol: "rect",
    symbolSize: 1,
    symbolKeepAspect: !0,
    color: "rgba(0, 0, 0, 0.2)",
    backgroundColor: null,
    dashArrayX: 5,
    dashArrayY: 5,
    rotation: 0,
    maxTileWidth: 512,
    maxTileHeight: 512
  });
  o.backgroundColor === "none" && (o.backgroundColor = null);
  var s = {
    repeat: "repeat"
  };
  return l(s), s.rotation = o.rotation, s.scaleX = s.scaleY = n ? 1 : 1 / e, bu.set(r, s), r.dirty = !1, s;
  function l(u) {
    for (var h = [e], c = !0, f = 0; f < Lp.length; ++f) {
      var d = o[Lp[f]];
      if (d != null && !B(d) && !V(d) && !wt(d) && typeof d != "boolean") {
        c = !1;
        break;
      }
      h.push(d);
    }
    var v;
    if (c) {
      v = h.join(",") + (n ? "-svg" : "");
      var g = Ip.get(v);
      g && (n ? u.svgElement = g : u.image = g);
    }
    var p = l_(o.dashArrayX), y = vM(o.dashArrayY), m = s_(o.symbol), _ = pM(p), b = u_(y), w = !n && gn.createCanvas(), x = n && {
      tag: "g",
      attrs: {},
      key: "dcl",
      children: []
    }, S = M(), A;
    w && (w.width = S.width * e, w.height = S.height * e, A = w.getContext("2d")), D(), c && Ip.put(v, w || x), u.image = w, u.svgElement = x, u.svgWidth = S.width, u.svgHeight = S.height;
    function M() {
      for (var C = 1, I = 0, L = _.length; I < L; ++I)
        C = Wd(C, _[I]);
      for (var P = 1, I = 0, L = m.length; I < L; ++I)
        P = Wd(P, m[I].length);
      C *= P;
      var E = b * _.length * m.length;
      return {
        width: Math.max(1, Math.min(C, o.maxTileWidth)),
        height: Math.max(1, Math.min(E, o.maxTileHeight))
      };
    }
    function D() {
      A && (A.clearRect(0, 0, w.width, w.height), o.backgroundColor && (A.fillStyle = o.backgroundColor, A.fillRect(0, 0, w.width, w.height)));
      for (var C = 0, I = 0; I < y.length; ++I)
        C += y[I];
      if (C <= 0)
        return;
      for (var L = -b, P = 0, E = 0, R = 0; L < S.height; ) {
        if (P % 2 === 0) {
          for (var Y = E / 2 % m.length, O = 0, z = 0, Z = 0; O < S.width * 2; ) {
            for (var J = 0, I = 0; I < p[R].length; ++I)
              J += p[R][I];
            if (J <= 0)
              break;
            if (z % 2 === 0) {
              var it = (1 - o.symbolSize) * 0.5, ft = O + p[R][z] * it, gt = L + y[P] * it, _t = p[R][z] * o.symbolSize, Jt = y[P] * o.symbolSize, Ye = Z / 2 % m[Y].length;
              ct(ft, gt, _t, Jt, m[Y][Ye]);
            }
            O += p[R][z], ++Z, ++z, z === p[R].length && (z = 0);
          }
          ++R, R === p.length && (R = 0);
        }
        L += y[P], ++E, ++P, P === y.length && (P = 0);
      }
      function ct(X, nt, F, W, At) {
        var yt = n ? 1 : e, Dt = vn(At, X * yt, nt * yt, F * yt, W * yt, o.color, o.symbolKeepAspect);
        if (n) {
          var Vt = i.painter.renderOneToVNode(Dt);
          Vt && x.children.push(Vt);
        } else
          o_(A, Dt);
      }
    }
  }
}
function s_(r) {
  if (!r || r.length === 0)
    return [["rect"]];
  if (V(r))
    return [[r]];
  for (var t = !0, e = 0; e < r.length; ++e)
    if (!V(r[e])) {
      t = !1;
      break;
    }
  if (t)
    return s_([r]);
  for (var i = [], e = 0; e < r.length; ++e)
    V(r[e]) ? i.push([r[e]]) : i.push(r[e]);
  return i;
}
function l_(r) {
  if (!r || r.length === 0)
    return [[0, 0]];
  if (wt(r)) {
    var t = Math.ceil(r);
    return [[t, t]];
  }
  for (var e = !0, i = 0; i < r.length; ++i)
    if (!wt(r[i])) {
      e = !1;
      break;
    }
  if (e)
    return l_([r]);
  for (var n = [], i = 0; i < r.length; ++i)
    if (wt(r[i])) {
      var t = Math.ceil(r[i]);
      n.push([t, t]);
    } else {
      var t = H(r[i], function(s) {
        return Math.ceil(s);
      });
      t.length % 2 === 1 ? n.push(t.concat(t)) : n.push(t);
    }
  return n;
}
function vM(r) {
  if (!r || typeof r == "object" && r.length === 0)
    return [0, 0];
  if (wt(r)) {
    var t = Math.ceil(r);
    return [t, t];
  }
  var e = H(r, function(i) {
    return Math.ceil(i);
  });
  return r.length % 2 ? e.concat(e) : e;
}
function pM(r) {
  return H(r, function(t) {
    return u_(t);
  });
}
function u_(r) {
  for (var t = 0, e = 0; e < r.length; ++e)
    t += r[e];
  return r.length % 2 === 1 ? t * 2 : t;
}
function gM(r, t) {
  r.eachRawSeries(function(e) {
    if (!r.isSeriesFiltered(e)) {
      var i = e.getData();
      i.hasItemVisual() && i.each(function(o) {
        var s = i.getItemVisual(o, "decal");
        if (s) {
          var l = i.ensureUniqueItemVisual(o, "style");
          l.decal = Wh(s, t);
        }
      });
      var n = i.getVisual("decal");
      if (n) {
        var a = i.getVisual("style");
        a.decal = Wh(n, t);
      }
    }
  });
}
var Ae = new be(), h_ = {};
function yM(r, t) {
  h_[r] = t;
}
function mM(r) {
  return h_[r];
}
var _M = 1, bM = 800, xM = 900, wM = 1e3, SM = 2e3, TM = 5e3, c_ = 1e3, CM = 1100, Tf = 2e3, f_ = 3e3, AM = 4e3, yl = 4500, MM = 4600, DM = 5e3, kM = 6e3, d_ = 7e3, IM = {
  PROCESSOR: {
    FILTER: wM,
    SERIES_FILTER: bM,
    STATISTIC: TM
  },
  VISUAL: {
    LAYOUT: c_,
    PROGRESSIVE_LAYOUT: CM,
    GLOBAL: Tf,
    CHART: f_,
    POST_CHART_LAYOUT: MM,
    COMPONENT: AM,
    BRUSH: DM,
    CHART_ITEM: yl,
    ARIA: kM,
    DECAL: d_
  }
}, Nt = "__flagInMainProcess", Wt = "__pendingUpdate", xu = "__needsUpdateStatus", Pp = /^[a-zA-Z0-9_]+$/, wu = "__connectUpdateStatus", Ep = 0, LM = 1, PM = 2;
function v_(r) {
  return function() {
    for (var t = [], e = 0; e < arguments.length; e++)
      t[e] = arguments[e];
    if (this.isDisposed()) {
      this.id;
      return;
    }
    return g_(this, r, t);
  };
}
function p_(r) {
  return function() {
    for (var t = [], e = 0; e < arguments.length; e++)
      t[e] = arguments[e];
    return g_(this, r, t);
  };
}
function g_(r, t, e) {
  return e[0] = e[0] && e[0].toLowerCase(), be.prototype[t].apply(r, e);
}
var y_ = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t;
  }(be)
), m_ = y_.prototype;
m_.on = p_("on");
m_.off = p_("off");
var Hi, Su, Mo, hr, Tu, Cu, Au, Bn, zn, Rp, $p, Mu, Op, Do, Np, __, ae, Bp, b_ = (
  /** @class */
  function(r) {
    N(t, r);
    function t(e, i, n) {
      var a = r.call(this, new BA()) || this;
      a._chartsViews = [], a._chartsMap = {}, a._componentsViews = [], a._componentsMap = {}, a._pendingActions = [], n = n || {}, V(i) && (i = x_[i]), a._dom = e;
      var o = "canvas", s = "auto", l = !1;
      n.ssr;
      var u = a._zr = Fd(e, {
        renderer: n.renderer || o,
        devicePixelRatio: n.devicePixelRatio,
        width: n.width,
        height: n.height,
        ssr: n.ssr,
        useDirtyRect: st(n.useDirtyRect, l),
        useCoarsePointer: st(n.useCoarsePointer, s),
        pointerSize: n.pointerSize
      });
      a._ssr = n.ssr, a._throttledZrFlush = wf(at(u.flush, u), 17), i = K(i), i && D0(i, !0), a._theme = i, a._locale = GT(n.locale || o0), a._coordSysMgr = new gf();
      var h = a._api = Np(a);
      function c(f, d) {
        return f.__prio - d.__prio;
      }
      return Zo(Os, c), Zo(Uh, c), a._scheduler = new q0(a, h, Uh, Os), a._messageCenter = new y_(), a._initEvents(), a.resize = at(a.resize, a), u.animation.on("frame", a._onframe, a), Rp(u, a), $p(u, a), hs(a), a;
    }
    return t.prototype._onframe = function() {
      if (!this._disposed) {
        Bp(this);
        var e = this._scheduler;
        if (this[Wt]) {
          var i = this[Wt].silent;
          this[Nt] = !0;
          try {
            Hi(this), hr.update.call(this, null, this[Wt].updateParams);
          } catch (l) {
            throw this[Nt] = !1, this[Wt] = null, l;
          }
          this._zr.flush(), this[Nt] = !1, this[Wt] = null, Bn.call(this, i), zn.call(this, i);
        } else if (e.unfinished) {
          var n = _M, a = this._model, o = this._api;
          e.unfinished = !1;
          do {
            var s = +/* @__PURE__ */ new Date();
            e.performSeriesTasks(a), e.performDataProcessorTasks(a), Cu(this, a), e.performVisualTasks(a), Do(this, this._model, o, "remain", {}), n -= +/* @__PURE__ */ new Date() - s;
          } while (n > 0 && e.unfinished);
          e.unfinished || this._zr.flush();
        }
      }
    }, t.prototype.getDom = function() {
      return this._dom;
    }, t.prototype.getId = function() {
      return this.id;
    }, t.prototype.getZr = function() {
      return this._zr;
    }, t.prototype.isSSR = function() {
      return this._ssr;
    }, t.prototype.setOption = function(e, i, n) {
      if (!this[Nt]) {
        if (this._disposed) {
          this.id;
          return;
        }
        var a, o, s;
        if (U(i) && (n = i.lazyUpdate, a = i.silent, o = i.replaceMerge, s = i.transition, i = i.notMerge), this[Nt] = !0, !this._model || i) {
          var l = new bC(this._api), u = this._theme, h = this._model = new pf();
          h.scheduler = this._scheduler, h.ssr = this._ssr, h.init(null, null, null, u, this._locale, l);
        }
        this._model.setOption(e, {
          replaceMerge: o
        }, Yh);
        var c = {
          seriesTransition: s,
          optionChanged: !0
        };
        if (n)
          this[Wt] = {
            silent: a,
            updateParams: c
          }, this[Nt] = !1, this.getZr().wakeUp();
        else {
          try {
            Hi(this), hr.update.call(this, null, c);
          } catch (f) {
            throw this[Wt] = null, this[Nt] = !1, f;
          }
          this._ssr || this._zr.flush(), this[Wt] = null, this[Nt] = !1, Bn.call(this, a), zn.call(this, a);
        }
      }
    }, t.prototype.setTheme = function() {
    }, t.prototype.getModel = function() {
      return this._model;
    }, t.prototype.getOption = function() {
      return this._model && this._model.getOption();
    }, t.prototype.getWidth = function() {
      return this._zr.getWidth();
    }, t.prototype.getHeight = function() {
      return this._zr.getHeight();
    }, t.prototype.getDevicePixelRatio = function() {
      return this._zr.painter.dpr || j.hasGlobalWindow && window.devicePixelRatio || 1;
    }, t.prototype.getRenderedCanvas = function(e) {
      return this.renderToCanvas(e);
    }, t.prototype.renderToCanvas = function(e) {
      e = e || {};
      var i = this._zr.painter;
      return i.getRenderedCanvas({
        backgroundColor: e.backgroundColor || this._model.get("backgroundColor"),
        pixelRatio: e.pixelRatio || this.getDevicePixelRatio()
      });
    }, t.prototype.renderToSVGString = function(e) {
      e = e || {};
      var i = this._zr.painter;
      return i.renderToString({
        useViewBox: e.useViewBox
      });
    }, t.prototype.getSvgDataURL = function() {
      if (j.svgSupported) {
        var e = this._zr, i = e.storage.getDisplayList();
        return T(i, function(n) {
          n.stopAnimation(null, !0);
        }), e.painter.toDataURL();
      }
    }, t.prototype.getDataURL = function(e) {
      if (this._disposed) {
        this.id;
        return;
      }
      e = e || {};
      var i = e.excludeComponents, n = this._model, a = [], o = this;
      T(i, function(l) {
        n.eachComponent({
          mainType: l
        }, function(u) {
          var h = o._componentsMap[u.__viewId];
          h.group.ignore || (a.push(h), h.group.ignore = !0);
        });
      });
      var s = this._zr.painter.getType() === "svg" ? this.getSvgDataURL() : this.renderToCanvas(e).toDataURL("image/" + (e && e.type || "png"));
      return T(a, function(l) {
        l.group.ignore = !1;
      }), s;
    }, t.prototype.getConnectedDataURL = function(e) {
      if (this._disposed) {
        this.id;
        return;
      }
      var i = e.type === "svg", n = this.group, a = Math.min, o = Math.max, s = 1 / 0;
      if (zp[n]) {
        var l = s, u = s, h = -s, c = -s, f = [], d = e && e.pixelRatio || this.getDevicePixelRatio();
        T(wa, function(_, b) {
          if (_.group === n) {
            var w = i ? _.getZr().painter.getSvgDom().innerHTML : _.renderToCanvas(K(e)), x = _.getDom().getBoundingClientRect();
            l = a(x.left, l), u = a(x.top, u), h = o(x.right, h), c = o(x.bottom, c), f.push({
              dom: w,
              left: x.left,
              top: x.top
            });
          }
        }), l *= d, u *= d, h *= d, c *= d;
        var v = h - l, g = c - u, p = gn.createCanvas(), y = Fd(p, {
          renderer: i ? "svg" : "canvas"
        });
        if (y.resize({
          width: v,
          height: g
        }), i) {
          var m = "";
          return T(f, function(_) {
            var b = _.left - l, w = _.top - u;
            m += '<g transform="translate(' + b + "," + w + ')">' + _.dom + "</g>";
          }), y.painter.getSvgRoot().innerHTML = m, e.connectedBackgroundColor && y.painter.setBackgroundColor(e.connectedBackgroundColor), y.refreshImmediately(), y.painter.toDataURL();
        } else
          return e.connectedBackgroundColor && y.add(new Mt({
            shape: {
              x: 0,
              y: 0,
              width: v,
              height: g
            },
            style: {
              fill: e.connectedBackgroundColor
            }
          })), T(f, function(_) {
            var b = new Lr({
              style: {
                x: _.left * d - l,
                y: _.top * d - u,
                image: _.dom
              }
            });
            y.add(b);
          }), y.refreshImmediately(), p.toDataURL("image/" + (e && e.type || "png"));
      } else
        return this.getDataURL(e);
    }, t.prototype.convertToPixel = function(e, i) {
      return Tu(this, "convertToPixel", e, i);
    }, t.prototype.convertFromPixel = function(e, i) {
      return Tu(this, "convertFromPixel", e, i);
    }, t.prototype.containPixel = function(e, i) {
      if (this._disposed) {
        this.id;
        return;
      }
      var n = this._model, a, o = ts(n, e);
      return T(o, function(s, l) {
        l.indexOf("Models") >= 0 && T(s, function(u) {
          var h = u.coordinateSystem;
          if (h && h.containPoint)
            a = a || !!h.containPoint(i);
          else if (l === "seriesModels") {
            var c = this._chartsMap[u.__viewId];
            c && c.containPoint && (a = a || c.containPoint(i, u));
          }
        }, this);
      }, this), !!a;
    }, t.prototype.getVisual = function(e, i) {
      var n = this._model, a = ts(n, e, {
        defaultMainType: "series"
      }), o = a.seriesModel, s = o.getData(), l = a.hasOwnProperty("dataIndexInside") ? a.dataIndexInside : a.hasOwnProperty("dataIndex") ? s.indexOfRawIndex(a.dataIndex) : null;
      return l != null ? t_(s, l, i) : e_(s, i);
    }, t.prototype.getViewOfComponentModel = function(e) {
      return this._componentsMap[e.__viewId];
    }, t.prototype.getViewOfSeriesModel = function(e) {
      return this._chartsMap[e.__viewId];
    }, t.prototype._initEvents = function() {
      var e = this;
      T(EM, function(i) {
        var n = function(a) {
          var o = e.getModel(), s = a.target, l, u = i === "globalout";
          if (u ? l = {} : s && oa(s, function(v) {
            var g = lt(v);
            if (g && g.dataIndex != null) {
              var p = g.dataModel || o.getSeriesByIndex(g.seriesIndex);
              return l = p && p.getDataParams(g.dataIndex, g.dataType, s) || {}, !0;
            } else if (g.eventData)
              return l = $({}, g.eventData), !0;
          }, !0), l) {
            var h = l.componentType, c = l.componentIndex;
            (h === "markLine" || h === "markPoint" || h === "markArea") && (h = "series", c = l.seriesIndex);
            var f = h && c != null && o.getComponent(h, c), d = f && e[f.mainType === "series" ? "_chartsMap" : "_componentsMap"][f.__viewId];
            l.event = a, l.type = i, e._$eventProcessor.eventInfo = {
              targetEl: s,
              packedEvent: l,
              model: f,
              view: d
            }, e.trigger(i, l);
          }
        };
        n.zrEventfulCallAtLast = !0, e._zr.on(i, n, e);
      }), T(xa, function(i, n) {
        e._messageCenter.on(n, function(a) {
          this.trigger(n, a);
        }, e);
      }), T(["selectchanged"], function(i) {
        e._messageCenter.on(i, function(n) {
          this.trigger(i, n);
        }, e);
      }), VA(this._messageCenter, this, this._api);
    }, t.prototype.isDisposed = function() {
      return this._disposed;
    }, t.prototype.clear = function() {
      if (this._disposed) {
        this.id;
        return;
      }
      this.setOption({
        series: []
      }, !0);
    }, t.prototype.dispose = function() {
      if (this._disposed) {
        this.id;
        return;
      }
      this._disposed = !0;
      var e = this.getDom();
      e && wm(this.getDom(), Af, "");
      var i = this, n = i._api, a = i._model;
      T(i._componentsViews, function(o) {
        o.dispose(a, n);
      }), T(i._chartsViews, function(o) {
        o.dispose(a, n);
      }), i._zr.dispose(), i._dom = i._model = i._chartsMap = i._componentsMap = i._chartsViews = i._componentsViews = i._scheduler = i._api = i._zr = i._throttledZrFlush = i._theme = i._coordSysMgr = i._messageCenter = null, delete wa[i.id];
    }, t.prototype.resize = function(e) {
      if (!this[Nt]) {
        if (this._disposed) {
          this.id;
          return;
        }
        this._zr.resize(e);
        var i = this._model;
        if (this._loadingFX && this._loadingFX.resize(), !!i) {
          var n = i.resetOption("media"), a = e && e.silent;
          this[Wt] && (a == null && (a = this[Wt].silent), n = !0, this[Wt] = null), this[Nt] = !0;
          try {
            n && Hi(this), hr.update.call(this, {
              type: "resize",
              animation: $({
                // Disable animation
                duration: 0
              }, e && e.animation)
            });
          } catch (o) {
            throw this[Nt] = !1, o;
          }
          this[Nt] = !1, Bn.call(this, a), zn.call(this, a);
        }
      }
    }, t.prototype.showLoading = function(e, i) {
      if (this._disposed) {
        this.id;
        return;
      }
      if (U(e) && (i = e, e = ""), e = e || "default", this.hideLoading(), !!Xh[e]) {
        var n = Xh[e](this._api, i), a = this._zr;
        this._loadingFX = n, a.add(n);
      }
    }, t.prototype.hideLoading = function() {
      if (this._disposed) {
        this.id;
        return;
      }
      this._loadingFX && this._zr.remove(this._loadingFX), this._loadingFX = null;
    }, t.prototype.makeActionFromEvent = function(e) {
      var i = $({}, e);
      return i.type = xa[e.type], i;
    }, t.prototype.dispatchAction = function(e, i) {
      if (this._disposed) {
        this.id;
        return;
      }
      if (U(i) || (i = {
        silent: !!i
      }), !!$s[e.type] && this._model) {
        if (this[Nt]) {
          this._pendingActions.push(e);
          return;
        }
        var n = i.silent;
        Au.call(this, e, n);
        var a = i.flush;
        a ? this._zr.flush() : a !== !1 && j.browser.weChat && this._throttledZrFlush(), Bn.call(this, n), zn.call(this, n);
      }
    }, t.prototype.updateLabelLayout = function() {
      Ae.trigger("series:layoutlabels", this._model, this._api, {
        // Not adding series labels.
        // TODO
        updatedSeries: []
      });
    }, t.prototype.appendData = function(e) {
      if (this._disposed) {
        this.id;
        return;
      }
      var i = e.seriesIndex, n = this.getModel(), a = n.getSeriesByIndex(i);
      a.appendData(e), this._scheduler.unfinished = !0, this.getZr().wakeUp();
    }, t.internalField = function() {
      Hi = function(c) {
        var f = c._scheduler;
        f.restorePipelines(c._model), f.prepareStageTasks(), Su(c, !0), Su(c, !1), f.plan();
      }, Su = function(c, f) {
        for (var d = c._model, v = c._scheduler, g = f ? c._componentsViews : c._chartsViews, p = f ? c._componentsMap : c._chartsMap, y = c._zr, m = c._api, _ = 0; _ < g.length; _++)
          g[_].__alive = !1;
        f ? d.eachComponent(function(x, S) {
          x !== "series" && b(S);
        }) : d.eachSeries(b);
        function b(x) {
          var S = x.__requireNewView;
          x.__requireNewView = !1;
          var A = "_ec_" + x.id + "_" + x.type, M = !S && p[A];
          if (!M) {
            var D = He(x.type), C = f ? ne.getClass(D.main, D.sub) : (
              // FIXME:TS
              // (ChartView as ChartViewConstructor).getClass('series', classType.sub)
              // For backward compat, still support a chart type declared as only subType
              // like "liquidfill", but recommend "series.liquidfill"
              // But need a base class to make a type series.
              me.getClass(D.sub)
            );
            M = new C(), M.init(d, m), p[A] = M, g.push(M), y.add(M.group);
          }
          x.__viewId = M.__id = A, M.__alive = !0, M.__model = x, M.group.__ecComponentInfo = {
            mainType: x.mainType,
            index: x.componentIndex
          }, !f && v.prepareView(M, x, d, m);
        }
        for (var _ = 0; _ < g.length; ) {
          var w = g[_];
          w.__alive ? _++ : (!f && w.renderTask.dispose(), y.remove(w.group), w.dispose(d, m), g.splice(_, 1), p[w.__id] === w && delete p[w.__id], w.__id = w.group.__ecComponentInfo = null);
        }
      }, Mo = function(c, f, d, v, g) {
        var p = c._model;
        if (p.setUpdatePayload(d), !v) {
          T([].concat(c._componentsViews).concat(c._chartsViews), w);
          return;
        }
        var y = {};
        y[v + "Id"] = d[v + "Id"], y[v + "Index"] = d[v + "Index"], y[v + "Name"] = d[v + "Name"];
        var m = {
          mainType: v,
          query: y
        };
        g && (m.subType = g);
        var _ = d.excludeSeriesId, b;
        _ != null && (b = tt(), T(Rt(_), function(x) {
          var S = ie(x, null);
          S != null && b.set(S, !0);
        })), p && p.eachComponent(m, function(x) {
          var S = b && b.get(x.id) != null;
          if (!S)
            if (mv(d))
              if (x instanceof Ie)
                d.type === fi && !d.notBlur && !x.get(["emphasis", "disabled"]) && LS(x, d, c._api);
              else {
                var A = Qc(x.mainType, x.componentIndex, d.name, c._api), M = A.focusSelf, D = A.dispatchers;
                d.type === fi && M && !d.notBlur && Ah(x.mainType, x.componentIndex, c._api), D && T(D, function(C) {
                  d.type === fi ? Ss(C) : Ts(C);
                });
              }
            else kh(d) && x instanceof Ie && (RS(x, d, c._api), gv(x), ae(c));
        }, c), p && p.eachComponent(m, function(x) {
          var S = b && b.get(x.id) != null;
          S || w(c[v === "series" ? "_chartsMap" : "_componentsMap"][x.__viewId]);
        }, c);
        function w(x) {
          x && x.__alive && x[f] && x[f](x.__model, p, c._api, d);
        }
      }, hr = {
        prepareAndUpdate: function(c) {
          Hi(this), hr.update.call(this, c, {
            // Needs to mark option changed if newOption is given.
            // It's from MagicType.
            // TODO If use a separate flag optionChanged in payload?
            optionChanged: c.newOption != null
          });
        },
        update: function(c, f) {
          var d = this._model, v = this._api, g = this._zr, p = this._coordSysMgr, y = this._scheduler;
          if (d) {
            d.setUpdatePayload(c), y.restoreData(d, c), y.performSeriesTasks(d), p.create(d, v), y.performDataProcessorTasks(d, c), Cu(this, d), p.update(d, v), e(d), y.performVisualTasks(d, c), Mu(this, d, v, c, f);
            var m = d.get("backgroundColor") || "transparent", _ = d.get("darkMode");
            g.setBackgroundColor(m), _ != null && _ !== "auto" && g.setDarkMode(_), Ae.trigger("afterupdate", d, v);
          }
        },
        updateTransform: function(c) {
          var f = this, d = this._model, v = this._api;
          if (d) {
            d.setUpdatePayload(c);
            var g = [];
            d.eachComponent(function(y, m) {
              if (y !== "series") {
                var _ = f.getViewOfComponentModel(m);
                if (_ && _.__alive)
                  if (_.updateTransform) {
                    var b = _.updateTransform(m, d, v, c);
                    b && b.update && g.push(_);
                  } else
                    g.push(_);
              }
            });
            var p = tt();
            d.eachSeries(function(y) {
              var m = f._chartsMap[y.__viewId];
              if (m.updateTransform) {
                var _ = m.updateTransform(y, d, v, c);
                _ && _.update && p.set(y.uid, 1);
              } else
                p.set(y.uid, 1);
            }), e(d), this._scheduler.performVisualTasks(d, c, {
              setDirty: !0,
              dirtyMap: p
            }), Do(this, d, v, c, {}, p), Ae.trigger("afterupdate", d, v);
          }
        },
        updateView: function(c) {
          var f = this._model;
          f && (f.setUpdatePayload(c), me.markUpdateMethod(c, "updateView"), e(f), this._scheduler.performVisualTasks(f, c, {
            setDirty: !0
          }), Mu(this, f, this._api, c, {}), Ae.trigger("afterupdate", f, this._api));
        },
        updateVisual: function(c) {
          var f = this, d = this._model;
          d && (d.setUpdatePayload(c), d.eachSeries(function(v) {
            v.getData().clearAllVisual();
          }), me.markUpdateMethod(c, "updateVisual"), e(d), this._scheduler.performVisualTasks(d, c, {
            visualType: "visual",
            setDirty: !0
          }), d.eachComponent(function(v, g) {
            if (v !== "series") {
              var p = f.getViewOfComponentModel(g);
              p && p.__alive && p.updateVisual(g, d, f._api, c);
            }
          }), d.eachSeries(function(v) {
            var g = f._chartsMap[v.__viewId];
            g.updateVisual(v, d, f._api, c);
          }), Ae.trigger("afterupdate", d, this._api));
        },
        updateLayout: function(c) {
          hr.update.call(this, c);
        }
      }, Tu = function(c, f, d, v) {
        if (c._disposed) {
          c.id;
          return;
        }
        for (var g = c._model, p = c._coordSysMgr.getCoordinateSystems(), y, m = ts(g, d), _ = 0; _ < p.length; _++) {
          var b = p[_];
          if (b[f] && (y = b[f](g, m, v)) != null)
            return y;
        }
      }, Cu = function(c, f) {
        var d = c._chartsMap, v = c._scheduler;
        f.eachSeries(function(g) {
          v.updateStreamModes(g, d[g.__viewId]);
        });
      }, Au = function(c, f) {
        var d = this, v = this.getModel(), g = c.type, p = c.escapeConnect, y = $s[g], m = y.actionInfo, _ = (m.update || "update").split(":"), b = _.pop(), w = _[0] != null && He(_[0]);
        this[Nt] = !0;
        var x = [c], S = !1;
        c.batch && (S = !0, x = H(c.batch, function(P) {
          return P = ht($({}, P), c), P.batch = null, P;
        }));
        var A = [], M, D = kh(c), C = mv(c);
        if (C && Hm(this._api), T(x, function(P) {
          if (M = y.action(P, d._model, d._api), M = M || $({}, P), M.type = m.event || M.type, A.push(M), C) {
            var E = Yc(c), R = E.queryOptionMap, Y = E.mainTypeSpecified, O = Y ? R.keys()[0] : "series";
            Mo(d, b, P, O), ae(d);
          } else D ? (Mo(d, b, P, "series"), ae(d)) : w && Mo(d, b, P, w.main, w.sub);
        }), b !== "none" && !C && !D && !w)
          try {
            this[Wt] ? (Hi(this), hr.update.call(this, c), this[Wt] = null) : hr[b].call(this, c);
          } catch (P) {
            throw this[Nt] = !1, P;
          }
        if (S ? M = {
          type: m.event || g,
          escapeConnect: p,
          batch: A
        } : M = A[0], this[Nt] = !1, !f) {
          var I = this._messageCenter;
          if (I.trigger(M.type, M), D) {
            var L = {
              type: "selectchanged",
              escapeConnect: p,
              selected: $S(v),
              isFromClick: c.isFromClick || !1,
              fromAction: c.type,
              fromActionPayload: c
            };
            I.trigger(L.type, L);
          }
        }
      }, Bn = function(c) {
        for (var f = this._pendingActions; f.length; ) {
          var d = f.shift();
          Au.call(this, d, c);
        }
      }, zn = function(c) {
        !c && this.trigger("updated");
      }, Rp = function(c, f) {
        c.on("rendered", function(d) {
          f.trigger("rendered", d), // Although zr is dirty if initial animation is not finished
          // and this checking is called on frame, we also check
          // animation finished for robustness.
          c.animation.isFinished() && !f[Wt] && !f._scheduler.unfinished && !f._pendingActions.length && f.trigger("finished");
        });
      }, $p = function(c, f) {
        c.on("mouseover", function(d) {
          var v = d.target, g = oa(v, Pa);
          g && (PS(g, d, f._api), ae(f));
        }).on("mouseout", function(d) {
          var v = d.target, g = oa(v, Pa);
          g && (ES(g, d, f._api), ae(f));
        }).on("click", function(d) {
          var v = d.target, g = oa(v, function(m) {
            return lt(m).dataIndex != null;
          }, !0);
          if (g) {
            var p = g.selected ? "unselect" : "select", y = lt(g);
            f._api.dispatchAction({
              type: p,
              dataType: y.dataType,
              dataIndexInside: y.dataIndex,
              seriesIndex: y.seriesIndex,
              isFromClick: !0
            });
          }
        });
      };
      function e(c) {
        c.clearColorPalette(), c.eachSeries(function(f) {
          f.clearColorPalette();
        });
      }
      function i(c) {
        var f = [], d = [], v = !1;
        if (c.eachComponent(function(m, _) {
          var b = _.get("zlevel") || 0, w = _.get("z") || 0, x = _.getZLevelKey();
          v = v || !!x, (m === "series" ? d : f).push({
            zlevel: b,
            z: w,
            idx: _.componentIndex,
            type: m,
            key: x
          });
        }), v) {
          var g = f.concat(d), p, y;
          Zo(g, function(m, _) {
            return m.zlevel === _.zlevel ? m.z - _.z : m.zlevel - _.zlevel;
          }), T(g, function(m) {
            var _ = c.getComponent(m.type, m.idx), b = m.zlevel, w = m.key;
            p != null && (b = Math.max(p, b)), w ? (b === p && w !== y && b++, y = w) : y && (b === p && b++, y = ""), p = b, _.setZLevel(b);
          });
        }
      }
      Mu = function(c, f, d, v, g) {
        i(f), Op(c, f, d, v, g), T(c._chartsViews, function(p) {
          p.__alive = !1;
        }), Do(c, f, d, v, g), T(c._chartsViews, function(p) {
          p.__alive || p.remove(f, d);
        });
      }, Op = function(c, f, d, v, g, p) {
        T(p || c._componentsViews, function(y) {
          var m = y.__model;
          u(m, y), y.render(m, f, d, v), s(m, y), h(m, y);
        });
      }, Do = function(c, f, d, v, g, p) {
        var y = c._scheduler;
        g = $(g || {}, {
          updatedSeries: f.getSeries()
        }), Ae.trigger("series:beforeupdate", f, d, g);
        var m = !1;
        f.eachSeries(function(_) {
          var b = c._chartsMap[_.__viewId];
          b.__alive = !0;
          var w = b.renderTask;
          y.updatePayload(w, v), u(_, b), p && p.get(_.uid) && w.dirty(), w.perform(y.getPerformArgs(w)) && (m = !0), b.group.silent = !!_.get("silent"), o(_, b), gv(_);
        }), y.unfinished = m || y.unfinished, Ae.trigger("series:layoutlabels", f, d, g), Ae.trigger("series:transition", f, d, g), f.eachSeries(function(_) {
          var b = c._chartsMap[_.__viewId];
          s(_, b), h(_, b);
        }), a(c, f), Ae.trigger("series:afterupdate", f, d, g);
      }, ae = function(c) {
        c[xu] = !0, c.getZr().wakeUp();
      }, Bp = function(c) {
        c[xu] && (c.getZr().storage.traverse(function(f) {
          ya(f) || n(f);
        }), c[xu] = !1);
      };
      function n(c) {
        for (var f = [], d = c.currentStates, v = 0; v < d.length; v++) {
          var g = d[v];
          g === "emphasis" || g === "blur" || g === "select" || f.push(g);
        }
        c.selected && c.states.select && f.push("select"), c.hoverState === Js && c.states.emphasis ? f.push("emphasis") : c.hoverState === Qs && c.states.blur && f.push("blur"), c.useStates(f);
      }
      function a(c, f) {
        var d = c._zr, v = d.storage, g = 0;
        v.traverse(function(p) {
          p.isGroup || g++;
        }), g > f.get("hoverLayerThreshold") && !j.node && !j.worker && f.eachSeries(function(p) {
          if (!p.preventUsingHoverLayer) {
            var y = c._chartsMap[p.__viewId];
            y.__alive && y.eachRendered(function(m) {
              m.states.emphasis && (m.states.emphasis.hoverLayer = !0);
            });
          }
        });
      }
      function o(c, f) {
        var d = c.get("blendMode") || null;
        f.eachRendered(function(v) {
          v.isGroup || (v.style.blend = d);
        });
      }
      function s(c, f) {
        if (!c.preventAutoZ) {
          var d = c.get("z") || 0, v = c.get("zlevel") || 0;
          f.eachRendered(function(g) {
            return l(g, d, v, -1 / 0), !0;
          });
        }
      }
      function l(c, f, d, v) {
        var g = c.getTextContent(), p = c.getTextGuideLine(), y = c.isGroup;
        if (y)
          for (var m = c.childrenRef(), _ = 0; _ < m.length; _++)
            v = Math.max(l(m[_], f, d, v), v);
        else
          c.z = f, c.zlevel = d, v = Math.max(c.z2, v);
        if (g && (g.z = f, g.zlevel = d, isFinite(v) && (g.z2 = v + 2)), p) {
          var b = c.textGuideLineConfig;
          p.z = f, p.zlevel = d, isFinite(v) && (p.z2 = v + (b && b.showAbove ? 1 : -1));
        }
        return v;
      }
      function u(c, f) {
        f.eachRendered(function(d) {
          if (!ya(d)) {
            var v = d.getTextContent(), g = d.getTextGuideLine();
            d.stateTransition && (d.stateTransition = null), v && v.stateTransition && (v.stateTransition = null), g && g.stateTransition && (g.stateTransition = null), d.hasState() ? (d.prevStates = d.currentStates, d.clearStates()) : d.prevStates && (d.prevStates = null);
          }
        });
      }
      function h(c, f) {
        var d = c.getModel("stateAnimation"), v = c.isAnimationEnabled(), g = d.get("duration"), p = g > 0 ? {
          duration: g,
          delay: d.get("delay"),
          easing: d.get("easing")
          // additive: stateAnimationModel.get('additive')
        } : null;
        f.eachRendered(function(y) {
          if (y.states && y.states.emphasis) {
            if (ya(y))
              return;
            if (y instanceof pt && zS(y), y.__dirty) {
              var m = y.prevStates;
              m && y.useStates(m);
            }
            if (v) {
              y.stateTransition = p;
              var _ = y.getTextContent(), b = y.getTextGuideLine();
              _ && (_.stateTransition = p), b && (b.stateTransition = p);
            }
            y.__dirty && n(y);
          }
        });
      }
      Np = function(c) {
        return new /** @class */
        (function(f) {
          N(d, f);
          function d() {
            return f !== null && f.apply(this, arguments) || this;
          }
          return d.prototype.getCoordinateSystems = function() {
            return c._coordSysMgr.getCoordinateSystems();
          }, d.prototype.getComponentByElement = function(v) {
            for (; v; ) {
              var g = v.__ecComponentInfo;
              if (g != null)
                return c._model.getComponent(g.mainType, g.index);
              v = v.parent;
            }
          }, d.prototype.enterEmphasis = function(v, g) {
            Ss(v, g), ae(c);
          }, d.prototype.leaveEmphasis = function(v, g) {
            Ts(v, g), ae(c);
          }, d.prototype.enterBlur = function(v) {
            Nm(v), ae(c);
          }, d.prototype.leaveBlur = function(v) {
            jc(v), ae(c);
          }, d.prototype.enterSelect = function(v) {
            Bm(v), ae(c);
          }, d.prototype.leaveSelect = function(v) {
            zm(v), ae(c);
          }, d.prototype.getModel = function() {
            return c.getModel();
          }, d.prototype.getViewOfComponentModel = function(v) {
            return c.getViewOfComponentModel(v);
          }, d.prototype.getViewOfSeriesModel = function(v) {
            return c.getViewOfSeriesModel(v);
          }, d;
        }(A0))(c);
      }, __ = function(c) {
        function f(d, v) {
          for (var g = 0; g < d.length; g++) {
            var p = d[g];
            p[wu] = v;
          }
        }
        T(xa, function(d, v) {
          c._messageCenter.on(v, function(g) {
            if (zp[c.group] && c[wu] !== Ep) {
              if (g && g.escapeConnect)
                return;
              var p = c.makeActionFromEvent(g), y = [];
              T(wa, function(m) {
                m !== c && m.group === c.group && y.push(m);
              }), f(y, Ep), T(y, function(m) {
                m[wu] !== LM && m.dispatchAction(p);
              }), f(y, PM);
            }
          });
        });
      };
    }(), t;
  }(be)
), Cf = b_.prototype;
Cf.on = v_("on");
Cf.off = v_("off");
Cf.one = function(r, t, e) {
  var i = this;
  function n() {
    for (var a = [], o = 0; o < arguments.length; o++)
      a[o] = arguments[o];
    t && t.apply && t.apply(this, a), i.off(r, n);
  }
  this.on.call(this, r, n, e);
};
var EM = ["click", "dblclick", "mouseover", "mouseout", "mousemove", "mousedown", "mouseup", "globalout", "contextmenu"];
var $s = {}, xa = {}, Uh = [], Yh = [], Os = [], x_ = {}, Xh = {}, wa = {}, zp = {}, RM = +/* @__PURE__ */ new Date() - 0, Af = "_echarts_instance_";
function $M(r, t, e) {
  {
    var i = OM(r);
    if (i)
      return i;
  }
  var n = new b_(r, t, e);
  return n.id = "ec_" + RM++, wa[n.id] = n, wm(r, Af, n.id), __(n), Ae.trigger("afterinit", n), n;
}
function OM(r) {
  return wa[ww(r, Af)];
}
function w_(r, t) {
  x_[r] = t;
}
function S_(r) {
  rt(Yh, r) < 0 && Yh.push(r);
}
function T_(r, t) {
  Df(Uh, r, t, SM);
}
function NM(r) {
  Mf("afterinit", r);
}
function BM(r) {
  Mf("afterupdate", r);
}
function Mf(r, t) {
  Ae.on(r, t);
}
function Ai(r, t, e) {
  Q(t) && (e = t, t = "");
  var i = U(r) ? r.type : [r, r = {
    event: t
  }][0];
  r.event = (r.event || i).toLowerCase(), t = r.event, !xa[t] && (ke(Pp.test(i) && Pp.test(t)), $s[i] || ($s[i] = {
    action: e,
    actionInfo: r
  }), xa[t] = i);
}
function zM(r, t) {
  gf.register(r, t);
}
function FM(r, t) {
  Df(Os, r, t, c_, "layout");
}
function Mi(r, t) {
  Df(Os, r, t, f_, "visual");
}
var Fp = [];
function Df(r, t, e, i, n) {
  if ((Q(t) || U(t)) && (e = t, t = i), !(rt(Fp, e) >= 0)) {
    Fp.push(e);
    var a = q0.wrapStageHandler(e, n);
    a.__prio = t, a.__raw = e, r.push(a);
  }
}
function C_(r, t) {
  Xh[r] = t;
}
function HM(r, t, e) {
  var i = mM("registerMap");
  i && i(r, t, e);
}
var VM = qC;
Mi(Tf, TA);
Mi(yl, CA);
Mi(yl, AA);
Mi(Tf, zA);
Mi(yl, FA);
Mi(d_, gM);
S_(D0);
T_(xM, PC);
C_("default", MA);
Ai({
  type: fi,
  event: fi,
  update: fi
}, Et);
Ai({
  type: es,
  event: es,
  update: es
}, Et);
Ai({
  type: va,
  event: va,
  update: va
}, Et);
Ai({
  type: rs,
  event: rs,
  update: rs
}, Et);
Ai({
  type: pa,
  event: pa,
  update: pa
}, Et);
w_("light", NA);
w_("dark", J0);
function Fn(r) {
  return r == null ? 0 : r.length || 1;
}
function Hp(r) {
  return r;
}
var kf = (
  /** @class */
  function() {
    function r(t, e, i, n, a, o) {
      this._old = t, this._new = e, this._oldKeyGetter = i || Hp, this._newKeyGetter = n || Hp, this.context = a, this._diffModeMultiple = o === "multiple";
    }
    return r.prototype.add = function(t) {
      return this._add = t, this;
    }, r.prototype.update = function(t) {
      return this._update = t, this;
    }, r.prototype.updateManyToOne = function(t) {
      return this._updateManyToOne = t, this;
    }, r.prototype.updateOneToMany = function(t) {
      return this._updateOneToMany = t, this;
    }, r.prototype.updateManyToMany = function(t) {
      return this._updateManyToMany = t, this;
    }, r.prototype.remove = function(t) {
      return this._remove = t, this;
    }, r.prototype.execute = function() {
      this[this._diffModeMultiple ? "_executeMultiple" : "_executeOneToOne"]();
    }, r.prototype._executeOneToOne = function() {
      var t = this._old, e = this._new, i = {}, n = new Array(t.length), a = new Array(e.length);
      this._initIndexMap(t, null, n, "_oldKeyGetter"), this._initIndexMap(e, i, a, "_newKeyGetter");
      for (var o = 0; o < t.length; o++) {
        var s = n[o], l = i[s], u = Fn(l);
        if (u > 1) {
          var h = l.shift();
          l.length === 1 && (i[s] = l[0]), this._update && this._update(h, o);
        } else u === 1 ? (i[s] = null, this._update && this._update(l, o)) : this._remove && this._remove(o);
      }
      this._performRestAdd(a, i);
    }, r.prototype._executeMultiple = function() {
      var t = this._old, e = this._new, i = {}, n = {}, a = [], o = [];
      this._initIndexMap(t, i, a, "_oldKeyGetter"), this._initIndexMap(e, n, o, "_newKeyGetter");
      for (var s = 0; s < a.length; s++) {
        var l = a[s], u = i[l], h = n[l], c = Fn(u), f = Fn(h);
        if (c > 1 && f === 1)
          this._updateManyToOne && this._updateManyToOne(h, u), n[l] = null;
        else if (c === 1 && f > 1)
          this._updateOneToMany && this._updateOneToMany(h, u), n[l] = null;
        else if (c === 1 && f === 1)
          this._update && this._update(h, u), n[l] = null;
        else if (c > 1 && f > 1)
          this._updateManyToMany && this._updateManyToMany(h, u), n[l] = null;
        else if (c > 1)
          for (var d = 0; d < c; d++)
            this._remove && this._remove(u[d]);
        else
          this._remove && this._remove(u);
      }
      this._performRestAdd(o, n);
    }, r.prototype._performRestAdd = function(t, e) {
      for (var i = 0; i < t.length; i++) {
        var n = t[i], a = e[n], o = Fn(a);
        if (o > 1)
          for (var s = 0; s < o; s++)
            this._add && this._add(a[s]);
        else o === 1 && this._add && this._add(a);
        e[n] = null;
      }
    }, r.prototype._initIndexMap = function(t, e, i, n) {
      for (var a = this._diffModeMultiple, o = 0; o < t.length; o++) {
        var s = "_ec_" + this[n](t[o], o);
        if (a || (i[o] = s), !!e) {
          var l = e[s], u = Fn(l);
          u === 0 ? (e[s] = o, a && i.push(s)) : u === 1 ? e[s] = [l, o] : l.push(o);
        }
      }
    }, r;
  }()
), GM = (
  /** @class */
  function() {
    function r(t, e) {
      this._encode = t, this._schema = e;
    }
    return r.prototype.get = function() {
      return {
        // Do not generate full dimension name until fist used.
        fullDimensions: this._getFullDimensionNames(),
        encode: this._encode
      };
    }, r.prototype._getFullDimensionNames = function() {
      return this._cachedDimNames || (this._cachedDimNames = this._schema ? this._schema.makeOutputDimensionNames() : []), this._cachedDimNames;
    }, r;
  }()
);
function WM(r, t) {
  var e = {}, i = e.encode = {}, n = tt(), a = [], o = [], s = {};
  T(r.dimensions, function(f) {
    var d = r.getDimensionInfo(f), v = d.coordDim;
    if (v) {
      var g = d.coordDimIndex;
      Du(i, v)[g] = f, d.isExtraCoord || (n.set(v, 1), YM(d.type) && (a[0] = f), Du(s, v)[g] = r.getDimensionIndex(d.name)), d.defaultTooltip && o.push(f);
    }
    b0.each(function(p, y) {
      var m = Du(i, y), _ = d.otherDims[y];
      _ != null && _ !== !1 && (m[_] = d.name);
    });
  });
  var l = [], u = {};
  n.each(function(f, d) {
    var v = i[d];
    u[d] = v[0], l = l.concat(v);
  }), e.dataDimsOnCoord = l, e.dataDimIndicesOnCoord = H(l, function(f) {
    return r.getDimensionInfo(f).storeDimIndex;
  }), e.encodeFirstDimNotExtra = u;
  var h = i.label;
  h && h.length && (a = h.slice());
  var c = i.tooltip;
  return c && c.length ? o = c.slice() : o.length || (o = a.slice()), i.defaultedLabel = a, i.defaultedTooltip = o, e.userOutput = new GM(s, t), e;
}
function Du(r, t) {
  return r.hasOwnProperty(t) || (r[t] = []), r[t];
}
function UM(r) {
  return r === "category" ? "ordinal" : r === "time" ? "time" : "float";
}
function YM(r) {
  return !(r === "ordinal" || r === "time");
}
var as = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(t) {
      this.otherDims = {}, t != null && $(this, t);
    }
    return r;
  }()
), XM = Tt(), ZM = {
  float: "f",
  int: "i",
  ordinal: "o",
  number: "n",
  time: "t"
}, A_ = (
  /** @class */
  function() {
    function r(t) {
      this.dimensions = t.dimensions, this._dimOmitted = t.dimensionOmitted, this.source = t.source, this._fullDimCount = t.fullDimensionCount, this._updateDimOmitted(t.dimensionOmitted);
    }
    return r.prototype.isDimensionOmitted = function() {
      return this._dimOmitted;
    }, r.prototype._updateDimOmitted = function(t) {
      this._dimOmitted = t, t && (this._dimNameMap || (this._dimNameMap = k_(this.source)));
    }, r.prototype.getSourceDimensionIndex = function(t) {
      return st(this._dimNameMap.get(t), -1);
    }, r.prototype.getSourceDimension = function(t) {
      var e = this.source.dimensionsDefine;
      if (e)
        return e[t];
    }, r.prototype.makeStoreSchema = function() {
      for (var t = this._fullDimCount, e = L0(this.source), i = !I_(t), n = "", a = [], o = 0, s = 0; o < t; o++) {
        var l = void 0, u = void 0, h = void 0, c = this.dimensions[s];
        if (c && c.storeDimIndex === o)
          l = e ? c.name : null, u = c.type, h = c.ordinalMeta, s++;
        else {
          var f = this.getSourceDimension(o);
          f && (l = e ? f.name : null, u = f.type);
        }
        a.push({
          property: l,
          type: u,
          ordinalMeta: h
        }), e && l != null && (!c || !c.isCalculationCoord) && (n += i ? l.replace(/\`/g, "`1").replace(/\$/g, "`2") : l), n += "$", n += ZM[u] || "f", h && (n += h.uid), n += "$";
      }
      var d = this.source, v = [d.seriesLayoutBy, d.startIndex, n].join("$$");
      return {
        dimensions: a,
        hash: v
      };
    }, r.prototype.makeOutputDimensionNames = function() {
      for (var t = [], e = 0, i = 0; e < this._fullDimCount; e++) {
        var n = void 0, a = this.dimensions[i];
        if (a && a.storeDimIndex === e)
          a.isCalculationCoord || (n = a.name), i++;
        else {
          var o = this.getSourceDimension(e);
          o && (n = o.name);
        }
        t.push(n);
      }
      return t;
    }, r.prototype.appendCalculationDimension = function(t) {
      this.dimensions.push(t), t.isCalculationCoord = !0, this._fullDimCount++, this._updateDimOmitted(!0);
    }, r;
  }()
);
function M_(r) {
  return r instanceof A_;
}
function D_(r) {
  for (var t = tt(), e = 0; e < (r || []).length; e++) {
    var i = r[e], n = U(i) ? i.name : i;
    n != null && t.get(n) == null && t.set(n, e);
  }
  return t;
}
function k_(r) {
  var t = XM(r);
  return t.dimNameMap || (t.dimNameMap = D_(r.dimensionsDefine));
}
function I_(r) {
  return r > 30;
}
var Hn = U, cr = H, qM = typeof Int32Array > "u" ? Array : Int32Array, KM = "e\0\0", Vp = -1, jM = ["hasItemOption", "_nameList", "_idList", "_invertedIndicesMap", "_dimSummary", "userOutput", "_rawData", "_dimValueGetter", "_nameDimIdx", "_idDimIdx", "_nameRepeatCount"], QM = ["_approximateExtent"], Gp, ko, Vn, Gn, ku, Wn, Iu, Ns = (
  /** @class */
  function() {
    function r(t, e) {
      this.type = "list", this._dimOmitted = !1, this._nameList = [], this._idList = [], this._visual = {}, this._layout = {}, this._itemVisuals = [], this._itemLayouts = [], this._graphicEls = [], this._approximateExtent = {}, this._calculationInfo = {}, this.hasItemOption = !1, this.TRANSFERABLE_METHODS = ["cloneShallow", "downSample", "minmaxDownSample", "lttbDownSample", "map"], this.CHANGABLE_METHODS = ["filterSelf", "selectRange"], this.DOWNSAMPLE_METHODS = ["downSample", "minmaxDownSample", "lttbDownSample"];
      var i, n = !1;
      M_(t) ? (i = t.dimensions, this._dimOmitted = t.isDimensionOmitted(), this._schema = t) : (n = !0, i = t), i = i || ["x", "y"];
      for (var a = {}, o = [], s = {}, l = !1, u = {}, h = 0; h < i.length; h++) {
        var c = i[h], f = V(c) ? new as({
          name: c
        }) : c instanceof as ? c : new as(c), d = f.name;
        f.type = f.type || "float", f.coordDim || (f.coordDim = d, f.coordDimIndex = 0);
        var v = f.otherDims = f.otherDims || {};
        o.push(d), a[d] = f, u[d] != null && (l = !0), f.createInvertedIndices && (s[d] = []), v.itemName === 0 && (this._nameDimIdx = h), v.itemId === 0 && (this._idDimIdx = h), n && (f.storeDimIndex = h);
      }
      if (this.dimensions = o, this._dimInfos = a, this._initGetDimensionInfo(l), this.hostModel = e, this._invertedIndicesMap = s, this._dimOmitted) {
        var g = this._dimIdxToName = tt();
        T(o, function(p) {
          g.set(a[p].storeDimIndex, p);
        });
      }
    }
    return r.prototype.getDimension = function(t) {
      var e = this._recognizeDimIndex(t);
      if (e == null)
        return t;
      if (e = t, !this._dimOmitted)
        return this.dimensions[e];
      var i = this._dimIdxToName.get(e);
      if (i != null)
        return i;
      var n = this._schema.getSourceDimension(e);
      if (n)
        return n.name;
    }, r.prototype.getDimensionIndex = function(t) {
      var e = this._recognizeDimIndex(t);
      if (e != null)
        return e;
      if (t == null)
        return -1;
      var i = this._getDimInfo(t);
      return i ? i.storeDimIndex : this._dimOmitted ? this._schema.getSourceDimensionIndex(t) : -1;
    }, r.prototype._recognizeDimIndex = function(t) {
      if (wt(t) || t != null && !isNaN(t) && !this._getDimInfo(t) && (!this._dimOmitted || this._schema.getSourceDimensionIndex(t) < 0))
        return +t;
    }, r.prototype._getStoreDimIndex = function(t) {
      var e = this.getDimensionIndex(t);
      return e;
    }, r.prototype.getDimensionInfo = function(t) {
      return this._getDimInfo(this.getDimension(t));
    }, r.prototype._initGetDimensionInfo = function(t) {
      var e = this._dimInfos;
      this._getDimInfo = t ? function(i) {
        return e.hasOwnProperty(i) ? e[i] : void 0;
      } : function(i) {
        return e[i];
      };
    }, r.prototype.getDimensionsOnCoord = function() {
      return this._dimSummary.dataDimsOnCoord.slice();
    }, r.prototype.mapDimension = function(t, e) {
      var i = this._dimSummary;
      if (e == null)
        return i.encodeFirstDimNotExtra[t];
      var n = i.encode[t];
      return n ? n[e] : null;
    }, r.prototype.mapDimensionsAll = function(t) {
      var e = this._dimSummary, i = e.encode[t];
      return (i || []).slice();
    }, r.prototype.getStore = function() {
      return this._store;
    }, r.prototype.initData = function(t, e, i) {
      var n = this, a;
      if (t instanceof $h && (a = t), !a) {
        var o = this.dimensions, s = yf(t) || qt(t) ? new P0(t, o.length) : t;
        a = new $h();
        var l = cr(o, function(u) {
          return {
            type: n._dimInfos[u].type,
            property: u
          };
        });
        a.initData(s, l, i);
      }
      this._store = a, this._nameList = (e || []).slice(), this._idList = [], this._nameRepeatCount = {}, this._doInit(0, a.count()), this._dimSummary = WM(this, this._schema), this.userOutput = this._dimSummary.userOutput;
    }, r.prototype.appendData = function(t) {
      var e = this._store.appendData(t);
      this._doInit(e[0], e[1]);
    }, r.prototype.appendValues = function(t, e) {
      var i = this._store.appendValues(t, e && e.length), n = i.start, a = i.end, o = this._shouldMakeIdFromName();
      if (this._updateOrdinalMeta(), e)
        for (var s = n; s < a; s++) {
          var l = s - n;
          this._nameList[s] = e[l], o && Iu(this, s);
        }
    }, r.prototype._updateOrdinalMeta = function() {
      for (var t = this._store, e = this.dimensions, i = 0; i < e.length; i++) {
        var n = this._dimInfos[e[i]];
        n.ordinalMeta && t.collectOrdinalMeta(n.storeDimIndex, n.ordinalMeta);
      }
    }, r.prototype._shouldMakeIdFromName = function() {
      var t = this._store.getProvider();
      return this._idDimIdx == null && t.getSource().sourceFormat !== Sr && !t.fillStorage;
    }, r.prototype._doInit = function(t, e) {
      if (!(t >= e)) {
        var i = this._store, n = i.getProvider();
        this._updateOrdinalMeta();
        var a = this._nameList, o = this._idList, s = n.getSource().sourceFormat, l = s === xe;
        if (l && !n.pure)
          for (var u = [], h = t; h < e; h++) {
            var c = n.getItem(h, u);
            if (!this.hasItemOption && cw(c) && (this.hasItemOption = !0), c) {
              var f = c.name;
              a[h] == null && f != null && (a[h] = ie(f, null));
              var d = c.id;
              o[h] == null && d != null && (o[h] = ie(d, null));
            }
          }
        if (this._shouldMakeIdFromName())
          for (var h = t; h < e; h++)
            Iu(this, h);
        Gp(this);
      }
    }, r.prototype.getApproximateExtent = function(t) {
      return this._approximateExtent[t] || this._store.getDataExtent(this._getStoreDimIndex(t));
    }, r.prototype.setApproximateExtent = function(t, e) {
      e = this.getDimension(e), this._approximateExtent[e] = t.slice();
    }, r.prototype.getCalculationInfo = function(t) {
      return this._calculationInfo[t];
    }, r.prototype.setCalculationInfo = function(t, e) {
      Hn(t) ? $(this._calculationInfo, t) : this._calculationInfo[t] = e;
    }, r.prototype.getName = function(t) {
      var e = this.getRawIndex(t), i = this._nameList[e];
      return i == null && this._nameDimIdx != null && (i = Vn(this, this._nameDimIdx, e)), i == null && (i = ""), i;
    }, r.prototype._getCategory = function(t, e) {
      var i = this._store.get(t, e), n = this._store.getOrdinalMeta(t);
      return n ? n.categories[i] : i;
    }, r.prototype.getId = function(t) {
      return ko(this, this.getRawIndex(t));
    }, r.prototype.count = function() {
      return this._store.count();
    }, r.prototype.get = function(t, e) {
      var i = this._store, n = this._dimInfos[t];
      if (n)
        return i.get(n.storeDimIndex, e);
    }, r.prototype.getByRawIndex = function(t, e) {
      var i = this._store, n = this._dimInfos[t];
      if (n)
        return i.getByRawIndex(n.storeDimIndex, e);
    }, r.prototype.getIndices = function() {
      return this._store.getIndices();
    }, r.prototype.getDataExtent = function(t) {
      return this._store.getDataExtent(this._getStoreDimIndex(t));
    }, r.prototype.getSum = function(t) {
      return this._store.getSum(this._getStoreDimIndex(t));
    }, r.prototype.getMedian = function(t) {
      return this._store.getMedian(this._getStoreDimIndex(t));
    }, r.prototype.getValues = function(t, e) {
      var i = this, n = this._store;
      return B(t) ? n.getValues(cr(t, function(a) {
        return i._getStoreDimIndex(a);
      }), e) : n.getValues(t);
    }, r.prototype.hasValue = function(t) {
      for (var e = this._dimSummary.dataDimIndicesOnCoord, i = 0, n = e.length; i < n; i++)
        if (isNaN(this._store.get(e[i], t)))
          return !1;
      return !0;
    }, r.prototype.indexOfName = function(t) {
      for (var e = 0, i = this._store.count(); e < i; e++)
        if (this.getName(e) === t)
          return e;
      return -1;
    }, r.prototype.getRawIndex = function(t) {
      return this._store.getRawIndex(t);
    }, r.prototype.indexOfRawIndex = function(t) {
      return this._store.indexOfRawIndex(t);
    }, r.prototype.rawIndexOf = function(t, e) {
      var i = t && this._invertedIndicesMap[t], n = i && i[e];
      return n == null || isNaN(n) ? Vp : n;
    }, r.prototype.indicesOfNearest = function(t, e, i) {
      return this._store.indicesOfNearest(this._getStoreDimIndex(t), e, i);
    }, r.prototype.each = function(t, e, i) {
      Q(t) && (i = e, e = t, t = []);
      var n = i || this, a = cr(Gn(t), this._getStoreDimIndex, this);
      this._store.each(a, n ? at(e, n) : e);
    }, r.prototype.filterSelf = function(t, e, i) {
      Q(t) && (i = e, e = t, t = []);
      var n = i || this, a = cr(Gn(t), this._getStoreDimIndex, this);
      return this._store = this._store.filter(a, n ? at(e, n) : e), this;
    }, r.prototype.selectRange = function(t) {
      var e = this, i = {}, n = xt(t);
      return T(n, function(a) {
        var o = e._getStoreDimIndex(a);
        i[o] = t[a];
      }), this._store = this._store.selectRange(i), this;
    }, r.prototype.mapArray = function(t, e, i) {
      Q(t) && (i = e, e = t, t = []), i = i || this;
      var n = [];
      return this.each(t, function() {
        n.push(e && e.apply(this, arguments));
      }, i), n;
    }, r.prototype.map = function(t, e, i, n) {
      var a = i || n || this, o = cr(Gn(t), this._getStoreDimIndex, this), s = Wn(this);
      return s._store = this._store.map(o, a ? at(e, a) : e), s;
    }, r.prototype.modify = function(t, e, i, n) {
      var a = i || n || this, o = cr(Gn(t), this._getStoreDimIndex, this);
      this._store.modify(o, a ? at(e, a) : e);
    }, r.prototype.downSample = function(t, e, i, n) {
      var a = Wn(this);
      return a._store = this._store.downSample(this._getStoreDimIndex(t), e, i, n), a;
    }, r.prototype.minmaxDownSample = function(t, e) {
      var i = Wn(this);
      return i._store = this._store.minmaxDownSample(this._getStoreDimIndex(t), e), i;
    }, r.prototype.lttbDownSample = function(t, e) {
      var i = Wn(this);
      return i._store = this._store.lttbDownSample(this._getStoreDimIndex(t), e), i;
    }, r.prototype.getRawDataItem = function(t) {
      return this._store.getRawDataItem(t);
    }, r.prototype.getItemModel = function(t) {
      var e = this.hostModel, i = this.getRawDataItem(t);
      return new bt(i, e, e && e.ecModel);
    }, r.prototype.diff = function(t) {
      var e = this;
      return new kf(t ? t.getStore().getIndices() : [], this.getStore().getIndices(), function(i) {
        return ko(t, i);
      }, function(i) {
        return ko(e, i);
      });
    }, r.prototype.getVisual = function(t) {
      var e = this._visual;
      return e && e[t];
    }, r.prototype.setVisual = function(t, e) {
      this._visual = this._visual || {}, Hn(t) ? $(this._visual, t) : this._visual[t] = e;
    }, r.prototype.getItemVisual = function(t, e) {
      var i = this._itemVisuals[t], n = i && i[e];
      return n ?? this.getVisual(e);
    }, r.prototype.hasItemVisual = function() {
      return this._itemVisuals.length > 0;
    }, r.prototype.ensureUniqueItemVisual = function(t, e) {
      var i = this._itemVisuals, n = i[t];
      n || (n = i[t] = {});
      var a = n[e];
      return a == null && (a = this.getVisual(e), B(a) ? a = a.slice() : Hn(a) && (a = $({}, a)), n[e] = a), a;
    }, r.prototype.setItemVisual = function(t, e, i) {
      var n = this._itemVisuals[t] || {};
      this._itemVisuals[t] = n, Hn(e) ? $(n, e) : n[e] = i;
    }, r.prototype.clearAllVisual = function() {
      this._visual = {}, this._itemVisuals = [];
    }, r.prototype.setLayout = function(t, e) {
      Hn(t) ? $(this._layout, t) : this._layout[t] = e;
    }, r.prototype.getLayout = function(t) {
      return this._layout[t];
    }, r.prototype.getItemLayout = function(t) {
      return this._itemLayouts[t];
    }, r.prototype.setItemLayout = function(t, e, i) {
      this._itemLayouts[t] = i ? $(this._itemLayouts[t] || {}, e) : e;
    }, r.prototype.clearItemLayouts = function() {
      this._itemLayouts.length = 0;
    }, r.prototype.setItemGraphicEl = function(t, e) {
      var i = this.hostModel && this.hostModel.seriesIndex;
      SS(i, this.dataType, t, e), this._graphicEls[t] = e;
    }, r.prototype.getItemGraphicEl = function(t) {
      return this._graphicEls[t];
    }, r.prototype.eachItemGraphicEl = function(t, e) {
      T(this._graphicEls, function(i, n) {
        i && t && t.call(e, i, n);
      });
    }, r.prototype.cloneShallow = function(t) {
      return t || (t = new r(this._schema ? this._schema : cr(this.dimensions, this._getDimInfo, this), this.hostModel)), ku(t, this), t._store = this._store, t;
    }, r.prototype.wrapMethod = function(t, e) {
      var i = this[t];
      Q(i) && (this.__wrappedMethods = this.__wrappedMethods || [], this.__wrappedMethods.push(t), this[t] = function() {
        var n = i.apply(this, arguments);
        return e.apply(this, [n].concat(Rc(arguments)));
      });
    }, r.internalField = function() {
      Gp = function(t) {
        var e = t._invertedIndicesMap;
        T(e, function(i, n) {
          var a = t._dimInfos[n], o = a.ordinalMeta, s = t._store;
          if (o) {
            i = e[n] = new qM(o.categories.length);
            for (var l = 0; l < i.length; l++)
              i[l] = Vp;
            for (var l = 0; l < s.count(); l++)
              i[s.get(a.storeDimIndex, l)] = l;
          }
        });
      }, Vn = function(t, e, i) {
        return ie(t._getCategory(e, i), null);
      }, ko = function(t, e) {
        var i = t._idList[e];
        return i == null && t._idDimIdx != null && (i = Vn(t, t._idDimIdx, e)), i == null && (i = KM + e), i;
      }, Gn = function(t) {
        return B(t) || (t = t != null ? [t] : []), t;
      }, Wn = function(t) {
        var e = new r(t._schema ? t._schema : cr(t.dimensions, t._getDimInfo, t), t.hostModel);
        return ku(e, t), e;
      }, ku = function(t, e) {
        T(jM.concat(e.__wrappedMethods || []), function(i) {
          e.hasOwnProperty(i) && (t[i] = e[i]);
        }), t.__wrappedMethods = e.__wrappedMethods, T(QM, function(i) {
          t[i] = K(e[i]);
        }), t._calculationInfo = $({}, e._calculationInfo);
      }, Iu = function(t, e) {
        var i = t._nameList, n = t._idList, a = t._nameDimIdx, o = t._idDimIdx, s = i[e], l = n[e];
        if (s == null && a != null && (i[e] = s = Vn(t, a, e)), l == null && o != null && (n[e] = l = Vn(t, o, e)), l == null && s != null) {
          var u = t._nameRepeatCount, h = u[s] = (u[s] || 0) + 1;
          l = s, h > 1 && (l += "__ec__" + h), n[e] = l;
        }
      };
    }(), r;
  }()
);
function L_(r, t) {
  yf(r) || (r = k0(r)), t = t || {};
  var e = t.coordDimensions || [], i = t.dimensionsDefine || r.dimensionsDefine || [], n = tt(), a = [], o = tD(r, e, i, t.dimensionsCount), s = t.canOmitUnusedDimensions && I_(o), l = i === r.dimensionsDefine, u = l ? k_(r) : D_(i), h = t.encodeDefine;
  !h && t.encodeDefaulter && (h = t.encodeDefaulter(r, o));
  for (var c = tt(h), f = new N0(o), d = 0; d < f.length; d++)
    f[d] = -1;
  function v(M) {
    var D = f[M];
    if (D < 0) {
      var C = i[M], I = U(C) ? C : {
        name: C
      }, L = new as(), P = I.name;
      P != null && u.get(P) != null && (L.name = L.displayName = P), I.type != null && (L.type = I.type), I.displayName != null && (L.displayName = I.displayName);
      var E = a.length;
      return f[M] = E, L.storeDimIndex = M, a.push(L), L;
    }
    return a[D];
  }
  if (!s)
    for (var d = 0; d < o; d++)
      v(d);
  c.each(function(M, D) {
    var C = Rt(M).slice();
    if (C.length === 1 && !V(C[0]) && C[0] < 0) {
      c.set(D, !1);
      return;
    }
    var I = c.set(D, []);
    T(C, function(L, P) {
      var E = V(L) ? u.get(L) : L;
      E != null && E < o && (I[P] = E, p(v(E), D, P));
    });
  });
  var g = 0;
  T(e, function(M) {
    var D, C, I, L;
    if (V(M))
      D = M, L = {};
    else {
      L = M, D = L.name;
      var P = L.ordinalMeta;
      L.ordinalMeta = null, L = $({}, L), L.ordinalMeta = P, C = L.dimsDef, I = L.otherDims, L.name = L.coordDim = L.coordDimIndex = L.dimsDef = L.otherDims = null;
    }
    var E = c.get(D);
    if (E !== !1) {
      if (E = Rt(E), !E.length)
        for (var R = 0; R < (C && C.length || 1); R++) {
          for (; g < o && v(g).coordDim != null; )
            g++;
          g < o && E.push(g++);
        }
      T(E, function(Y, O) {
        var z = v(Y);
        if (l && L.type != null && (z.type = L.type), p(ht(z, L), D, O), z.name == null && C) {
          var Z = C[O];
          !U(Z) && (Z = {
            name: Z
          }), z.name = z.displayName = Z.name, z.defaultTooltip = Z.defaultTooltip;
        }
        I && ht(z.otherDims, I);
      });
    }
  });
  function p(M, D, C) {
    b0.get(D) != null ? M.otherDims[D] = C : (M.coordDim = D, M.coordDimIndex = C, n.set(D, !0));
  }
  var y = t.generateCoord, m = t.generateCoordCount, _ = m != null;
  m = y ? m || 1 : 0;
  var b = y || "value";
  function w(M) {
    M.name == null && (M.name = M.coordDim);
  }
  if (s)
    T(a, function(M) {
      w(M);
    }), a.sort(function(M, D) {
      return M.storeDimIndex - D.storeDimIndex;
    });
  else
    for (var x = 0; x < o; x++) {
      var S = v(x), A = S.coordDim;
      A == null && (S.coordDim = eD(b, n, _), S.coordDimIndex = 0, (!y || m <= 0) && (S.isExtraCoord = !0), m--), w(S), S.type == null && (T0(r, x) === te.Must || S.isExtraCoord && (S.otherDims.itemName != null || S.otherDims.seriesName != null)) && (S.type = "ordinal");
    }
  return JM(a), new A_({
    source: r,
    dimensions: a,
    fullDimensionCount: o,
    dimensionOmitted: s
  });
}
function JM(r) {
  for (var t = tt(), e = 0; e < r.length; e++) {
    var i = r[e], n = i.name, a = t.get(n) || 0;
    a > 0 && (i.name = n + (a - 1)), a++, t.set(n, a);
  }
}
function tD(r, t, e, i) {
  var n = Math.max(r.dimensionsDetectedCount || 1, t.length, e.length, i || 0);
  return T(t, function(a) {
    var o;
    U(a) && (o = a.dimsDef) && (n = Math.max(n, o.length));
  }), n;
}
function eD(r, t, e) {
  if (e || t.hasKey(r)) {
    for (var i = 0; t.hasKey(r + i); )
      i++;
    r += i;
  }
  return t.set(r, !0), r;
}
var rD = (
  /** @class */
  /* @__PURE__ */ function() {
    function r(t) {
      this.coordSysDims = [], this.axisMap = tt(), this.categoryAxisMap = tt(), this.coordSysName = t;
    }
    return r;
  }()
);
function iD(r) {
  var t = r.get("coordinateSystem"), e = new rD(t), i = nD[t];
  if (i)
    return i(r, e, e.axisMap, e.categoryAxisMap), e;
}
var nD = {
  cartesian2d: function(r, t, e, i) {
    var n = r.getReferringComponents("xAxis", Me).models[0], a = r.getReferringComponents("yAxis", Me).models[0];
    t.coordSysDims = ["x", "y"], e.set("x", n), e.set("y", a), Vi(n) && (i.set("x", n), t.firstCategoryDimIndex = 0), Vi(a) && (i.set("y", a), t.firstCategoryDimIndex == null && (t.firstCategoryDimIndex = 1));
  },
  singleAxis: function(r, t, e, i) {
    var n = r.getReferringComponents("singleAxis", Me).models[0];
    t.coordSysDims = ["single"], e.set("single", n), Vi(n) && (i.set("single", n), t.firstCategoryDimIndex = 0);
  },
  polar: function(r, t, e, i) {
    var n = r.getReferringComponents("polar", Me).models[0], a = n.findAxisModel("radiusAxis"), o = n.findAxisModel("angleAxis");
    t.coordSysDims = ["radius", "angle"], e.set("radius", a), e.set("angle", o), Vi(a) && (i.set("radius", a), t.firstCategoryDimIndex = 0), Vi(o) && (i.set("angle", o), t.firstCategoryDimIndex == null && (t.firstCategoryDimIndex = 1));
  },
  geo: function(r, t, e, i) {
    t.coordSysDims = ["lng", "lat"];
  },
  parallel: function(r, t, e, i) {
    var n = r.ecModel, a = n.getComponent("parallel", r.get("parallelIndex")), o = t.coordSysDims = a.dimensions.slice();
    T(a.parallelAxisIndex, function(s, l) {
      var u = n.getComponent("parallelAxis", s), h = o[l];
      e.set(h, u), Vi(u) && (i.set(h, u), t.firstCategoryDimIndex == null && (t.firstCategoryDimIndex = l));
    });
  }
};
function Vi(r) {
  return r.get("type") === "category";
}
function aD(r, t, e) {
  e = e || {};
  var i = e.byIndex, n = e.stackedCoordDimension, a, o, s;
  oD(t) ? a = t : (o = t.schema, a = o.dimensions, s = t.store);
  var l = !!(r && r.get("stack")), u, h, c, f;
  if (T(a, function(m, _) {
    V(m) && (a[_] = m = {
      name: m
    }), l && !m.isExtraCoord && (!i && !u && m.ordinalMeta && (u = m), !h && m.type !== "ordinal" && m.type !== "time" && (!n || n === m.coordDim) && (h = m));
  }), h && !i && !u && (i = !0), h) {
    c = "__\0ecstackresult_" + r.id, f = "__\0ecstackedover_" + r.id, u && (u.createInvertedIndices = !0);
    var d = h.coordDim, v = h.type, g = 0;
    T(a, function(m) {
      m.coordDim === d && g++;
    });
    var p = {
      name: c,
      coordDim: d,
      coordDimIndex: g,
      type: v,
      isExtraCoord: !0,
      isCalculationCoord: !0,
      storeDimIndex: a.length
    }, y = {
      name: f,
      // This dimension contains stack base (generally, 0), so do not set it as
      // `stackedDimCoordDim` to avoid extent calculation, consider log scale.
      coordDim: f,
      coordDimIndex: g + 1,
      type: v,
      isExtraCoord: !0,
      isCalculationCoord: !0,
      storeDimIndex: a.length + 1
    };
    o ? (s && (p.storeDimIndex = s.ensureCalculationDimension(f, v), y.storeDimIndex = s.ensureCalculationDimension(c, v)), o.appendCalculationDimension(p), o.appendCalculationDimension(y)) : (a.push(p), a.push(y));
  }
  return {
    stackedDimension: h && h.name,
    stackedByDimension: u && u.name,
    isStackedByIndex: i,
    stackedOverDimension: f,
    stackResultDimension: c
  };
}
function oD(r) {
  return !M_(r.schema);
}
function Si(r, t) {
  return !!t && t === r.getCalculationInfo("stackedDimension");
}
function sD(r, t) {
  return Si(r, t) ? r.getCalculationInfo("stackResultDimension") : t;
}
function lD(r, t) {
  var e = r.get("coordinateSystem"), i = gf.get(e), n;
  return t && t.coordSysDims && (n = H(t.coordSysDims, function(a) {
    var o = {
      name: a
    }, s = t.axisMap.get(a);
    if (s) {
      var l = s.get("type");
      o.type = UM(l);
    }
    return o;
  })), n || (n = i && (i.getDimensionsInfo ? i.getDimensionsInfo() : i.dimensions.slice()) || ["x", "y"]), n;
}
function uD(r, t, e) {
  var i, n;
  return e && T(r, function(a, o) {
    var s = a.coordDim, l = e.categoryAxisMap.get(s);
    l && (i == null && (i = o), a.ordinalMeta = l.getOrdinalMeta(), t && (a.createInvertedIndices = !0)), a.otherDims.itemName != null && (n = !0);
  }), !n && i != null && (r[i].otherDims.itemName = 0), i;
}
function If(r, t, e) {
  e = e || {};
  var i = t.getSourceManager(), n, a = !1;
  n = i.getSource(), a = n.sourceFormat === xe;
  var o = iD(t), s = lD(t, o), l = e.useEncodeDefaulter, u = Q(l) ? l : l ? et(oC, s, t) : null, h = {
    coordDimensions: s,
    generateCoord: e.generateCoord,
    encodeDefine: t.getEncode(),
    encodeDefaulter: u,
    canOmitUnusedDimensions: !a
  }, c = L_(n, h), f = uD(c.dimensions, e.createInvertedIndices, o), d = a ? null : i.getSharedDataStore(c), v = aD(t, {
    schema: c,
    store: d
  }), g = new Ns(c, t);
  g.setCalculationInfo(v);
  var p = f != null && hD(n) ? function(y, m, _, b) {
    return b === f ? _ : this.defaultDimValueGetter(y, m, _, b);
  } : null;
  return g.hasItemOption = !1, g.initData(
    // Try to reuse the data store in sourceManager if using dataset.
    a ? n : d,
    null,
    p
  ), g;
}
function hD(r) {
  if (r.sourceFormat === xe) {
    var t = cD(r.data || []);
    return !B(Za(t));
  }
}
function cD(r) {
  for (var t = 0; t < r.length && r[t] == null; )
    t++;
  return r[t];
}
var Ue = (
  /** @class */
  function() {
    function r(t) {
      this._setting = t || {}, this._extent = [1 / 0, -1 / 0];
    }
    return r.prototype.getSetting = function(t) {
      return this._setting[t];
    }, r.prototype.unionExtent = function(t) {
      var e = this._extent;
      t[0] < e[0] && (e[0] = t[0]), t[1] > e[1] && (e[1] = t[1]);
    }, r.prototype.unionExtentFromData = function(t, e) {
      this.unionExtent(t.getApproximateExtent(e));
    }, r.prototype.getExtent = function() {
      return this._extent.slice();
    }, r.prototype.setExtent = function(t, e) {
      var i = this._extent;
      isNaN(t) || (i[0] = t), isNaN(e) || (i[1] = e);
    }, r.prototype.isInExtentRange = function(t) {
      return this._extent[0] <= t && this._extent[1] >= t;
    }, r.prototype.isBlank = function() {
      return this._isBlank;
    }, r.prototype.setBlank = function(t) {
      this._isBlank = t;
    }, r;
  }()
);
qs(Ue);
var fD = 0, Zh = (
  /** @class */
  function() {
    function r(t) {
      this.categories = t.categories || [], this._needCollect = t.needCollect, this._deduplication = t.deduplication, this.uid = ++fD;
    }
    return r.createByAxisModel = function(t) {
      var e = t.option, i = e.data, n = i && H(i, dD);
      return new r({
        categories: n,
        needCollect: !n,
        // deduplication is default in axis.
        deduplication: e.dedplication !== !1
      });
    }, r.prototype.getOrdinal = function(t) {
      return this._getOrCreateMap().get(t);
    }, r.prototype.parseAndCollect = function(t) {
      var e, i = this._needCollect;
      if (!V(t) && !i)
        return t;
      if (i && !this._deduplication)
        return e = this.categories.length, this.categories[e] = t, e;
      var n = this._getOrCreateMap();
      return e = n.get(t), e == null && (i ? (e = this.categories.length, this.categories[e] = t, n.set(t, e)) : e = NaN), e;
    }, r.prototype._getOrCreateMap = function() {
      return this._map || (this._map = tt(this.categories));
    }, r;
  }()
);
function dD(r) {
  return U(r) && r.value != null ? r.value : r + "";
}
function qh(r) {
  return r.type === "interval" || r.type === "log";
}
function vD(r, t, e, i) {
  var n = {}, a = r[1] - r[0], o = n.interval = ym(a / t);
  e != null && o < e && (o = n.interval = e), i != null && o > i && (o = n.interval = i);
  var s = n.intervalPrecision = P_(o), l = n.niceTickExtent = [Lt(Math.ceil(r[0] / o) * o, s), Lt(Math.floor(r[1] / o) * o, s)];
  return pD(l, r), n;
}
function Lu(r) {
  var t = Math.pow(10, Wc(r)), e = r / t;
  return e ? e === 2 ? e = 3 : e === 3 ? e = 5 : e *= 2 : e = 1, Lt(e * t);
}
function P_(r) {
  return Fe(r) + 2;
}
function Wp(r, t, e) {
  r[t] = Math.max(Math.min(r[t], e[1]), e[0]);
}
function pD(r, t) {
  !isFinite(r[0]) && (r[0] = t[0]), !isFinite(r[1]) && (r[1] = t[1]), Wp(r, 0, t), Wp(r, 1, t), r[0] > r[1] && (r[0] = r[1]);
}
function ml(r, t) {
  return r >= t[0] && r <= t[1];
}
function _l(r, t) {
  return t[1] === t[0] ? 0.5 : (r - t[0]) / (t[1] - t[0]);
}
function bl(r, t) {
  return r * (t[1] - t[0]) + t[0];
}
var Lf = (
  /** @class */
  function(r) {
    N(t, r);
    function t(e) {
      var i = r.call(this, e) || this;
      i.type = "ordinal";
      var n = i.getSetting("ordinalMeta");
      return n || (n = new Zh({})), B(n) && (n = new Zh({
        categories: H(n, function(a) {
          return U(a) ? a.value : a;
        })
      })), i._ordinalMeta = n, i._extent = i.getSetting("extent") || [0, n.categories.length - 1], i;
    }
    return t.prototype.parse = function(e) {
      return e == null ? NaN : V(e) ? this._ordinalMeta.getOrdinal(e) : Math.round(e);
    }, t.prototype.contain = function(e) {
      return e = this.parse(e), ml(e, this._extent) && this._ordinalMeta.categories[e] != null;
    }, t.prototype.normalize = function(e) {
      return e = this._getTickNumber(this.parse(e)), _l(e, this._extent);
    }, t.prototype.scale = function(e) {
      return e = Math.round(bl(e, this._extent)), this.getRawOrdinalNumber(e);
    }, t.prototype.getTicks = function() {
      for (var e = [], i = this._extent, n = i[0]; n <= i[1]; )
        e.push({
          value: n
        }), n++;
      return e;
    }, t.prototype.getMinorTicks = function(e) {
    }, t.prototype.setSortInfo = function(e) {
      if (e == null) {
        this._ordinalNumbersByTick = this._ticksByOrdinalNumber = null;
        return;
      }
      for (var i = e.ordinalNumbers, n = this._ordinalNumbersByTick = [], a = this._ticksByOrdinalNumber = [], o = 0, s = this._ordinalMeta.categories.length, l = Math.min(s, i.length); o < l; ++o) {
        var u = i[o];
        n[o] = u, a[u] = o;
      }
      for (var h = 0; o < s; ++o) {
        for (; a[h] != null; )
          h++;
        n.push(h), a[h] = o;
      }
    }, t.prototype._getTickNumber = function(e) {
      var i = this._ticksByOrdinalNumber;
      return i && e >= 0 && e < i.length ? i[e] : e;
    }, t.prototype.getRawOrdinalNumber = function(e) {
      var i = this._ordinalNumbersByTick;
      return i && e >= 0 && e < i.length ? i[e] : e;
    }, t.prototype.getLabel = function(e) {
      if (!this.isBlank()) {
        var i = this.getRawOrdinalNumber(e.value), n = this._ordinalMeta.categories[i];
        return n == null ? "" : n + "";
      }
    }, t.prototype.count = function() {
      return this._extent[1] - this._extent[0] + 1;
    }, t.prototype.unionExtentFromData = function(e, i) {
      this.unionExtent(e.getApproximateExtent(i));
    }, t.prototype.isInExtentRange = function(e) {
      return e = this._getTickNumber(e), this._extent[0] <= e && this._extent[1] >= e;
    }, t.prototype.getOrdinalMeta = function() {
      return this._ordinalMeta;
    }, t.prototype.calcNiceTicks = function() {
    }, t.prototype.calcNiceExtent = function() {
    }, t.type = "ordinal", t;
  }(Ue)
);
Ue.registerClass(Lf);
var Qr = Lt, Tn = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = "interval", e._interval = 0, e._intervalPrecision = 2, e;
    }
    return t.prototype.parse = function(e) {
      return e;
    }, t.prototype.contain = function(e) {
      return ml(e, this._extent);
    }, t.prototype.normalize = function(e) {
      return _l(e, this._extent);
    }, t.prototype.scale = function(e) {
      return bl(e, this._extent);
    }, t.prototype.setExtent = function(e, i) {
      var n = this._extent;
      isNaN(e) || (n[0] = parseFloat(e)), isNaN(i) || (n[1] = parseFloat(i));
    }, t.prototype.unionExtent = function(e) {
      var i = this._extent;
      e[0] < i[0] && (i[0] = e[0]), e[1] > i[1] && (i[1] = e[1]), this.setExtent(i[0], i[1]);
    }, t.prototype.getInterval = function() {
      return this._interval;
    }, t.prototype.setInterval = function(e) {
      this._interval = e, this._niceExtent = this._extent.slice(), this._intervalPrecision = P_(e);
    }, t.prototype.getTicks = function(e) {
      var i = this._interval, n = this._extent, a = this._niceExtent, o = this._intervalPrecision, s = [];
      if (!i)
        return s;
      var l = 1e4;
      n[0] < a[0] && (e ? s.push({
        value: Qr(a[0] - i, o)
      }) : s.push({
        value: n[0]
      }));
      for (var u = a[0]; u <= a[1] && (s.push({
        value: u
      }), u = Qr(u + i, o), u !== s[s.length - 1].value); )
        if (s.length > l)
          return [];
      var h = s.length ? s[s.length - 1].value : a[1];
      return n[1] > h && (e ? s.push({
        value: Qr(h + i, o)
      }) : s.push({
        value: n[1]
      })), s;
    }, t.prototype.getMinorTicks = function(e) {
      for (var i = this.getTicks(!0), n = [], a = this.getExtent(), o = 1; o < i.length; o++) {
        for (var s = i[o], l = i[o - 1], u = 0, h = [], c = s.value - l.value, f = c / e; u < e - 1; ) {
          var d = Qr(l.value + (u + 1) * f);
          d > a[0] && d < a[1] && h.push(d), u++;
        }
        n.push(h);
      }
      return n;
    }, t.prototype.getLabel = function(e, i) {
      if (e == null)
        return "";
      var n = i && i.precision;
      n == null ? n = Fe(e.value) || 0 : n === "auto" && (n = this._intervalPrecision);
      var a = Qr(e.value, n, !0);
      return g0(a);
    }, t.prototype.calcNiceTicks = function(e, i, n) {
      e = e || 5;
      var a = this._extent, o = a[1] - a[0];
      if (isFinite(o)) {
        o < 0 && (o = -o, a.reverse());
        var s = vD(a, e, i, n);
        this._intervalPrecision = s.intervalPrecision, this._interval = s.interval, this._niceExtent = s.niceTickExtent;
      }
    }, t.prototype.calcNiceExtent = function(e) {
      var i = this._extent;
      if (i[0] === i[1])
        if (i[0] !== 0) {
          var n = Math.abs(i[0]);
          e.fixMax || (i[1] += n / 2), i[0] -= n / 2;
        } else
          i[1] = 1;
      var a = i[1] - i[0];
      isFinite(a) || (i[0] = 0, i[1] = 1), this.calcNiceTicks(e.splitNumber, e.minInterval, e.maxInterval);
      var o = this._interval;
      e.fixMin || (i[0] = Qr(Math.floor(i[0] / o) * o)), e.fixMax || (i[1] = Qr(Math.ceil(i[1] / o) * o));
    }, t.prototype.setNiceExtent = function(e, i) {
      this._niceExtent = [e, i];
    }, t.type = "interval", t;
  }(Ue)
);
Ue.registerClass(Tn);
var E_ = typeof Float32Array < "u", gD = E_ ? Float32Array : Array;
function Je(r) {
  return B(r) ? E_ ? new Float32Array(r) : r : new gD(r);
}
var yD = "__ec_stack_";
function R_(r) {
  return r.get("stack") || yD + r.seriesIndex;
}
function Pf(r) {
  return r.dim + r.index;
}
function $_(r, t) {
  var e = [];
  return t.eachSeriesByType(r, function(i) {
    N_(i) && e.push(i);
  }), e;
}
function mD(r) {
  var t = {};
  T(r, function(l) {
    var u = l.coordinateSystem, h = u.getBaseAxis();
    if (!(h.type !== "time" && h.type !== "value"))
      for (var c = l.getData(), f = h.dim + "_" + h.index, d = c.getDimensionIndex(c.mapDimension(h.dim)), v = c.getStore(), g = 0, p = v.count(); g < p; ++g) {
        var y = v.get(d, g);
        t[f] ? t[f].push(y) : t[f] = [y];
      }
  });
  var e = {};
  for (var i in t)
    if (t.hasOwnProperty(i)) {
      var n = t[i];
      if (n) {
        n.sort(function(l, u) {
          return l - u;
        });
        for (var a = null, o = 1; o < n.length; ++o) {
          var s = n[o] - n[o - 1];
          s > 0 && (a = a === null ? s : Math.min(a, s));
        }
        e[i] = a;
      }
    }
  return e;
}
function O_(r) {
  var t = mD(r), e = [];
  return T(r, function(i) {
    var n = i.coordinateSystem, a = n.getBaseAxis(), o = a.getExtent(), s;
    if (a.type === "category")
      s = a.getBandWidth();
    else if (a.type === "value" || a.type === "time") {
      var l = a.dim + "_" + a.index, u = t[l], h = Math.abs(o[1] - o[0]), c = a.scale.getExtent(), f = Math.abs(c[1] - c[0]);
      s = u ? h / f * u : h;
    } else {
      var d = i.getData();
      s = Math.abs(o[1] - o[0]) / d.count();
    }
    var v = Ct(i.get("barWidth"), s), g = Ct(i.get("barMaxWidth"), s), p = Ct(
      // barMinWidth by default is 0.5 / 1 in cartesian. Because in value axis,
      // the auto-calculated bar width might be less than 0.5 / 1.
      i.get("barMinWidth") || (B_(i) ? 0.5 : 1),
      s
    ), y = i.get("barGap"), m = i.get("barCategoryGap");
    e.push({
      bandWidth: s,
      barWidth: v,
      barMaxWidth: g,
      barMinWidth: p,
      barGap: y,
      barCategoryGap: m,
      axisKey: Pf(a),
      stackId: R_(i)
    });
  }), _D(e);
}
function _D(r) {
  var t = {};
  T(r, function(i, n) {
    var a = i.axisKey, o = i.bandWidth, s = t[a] || {
      bandWidth: o,
      remainedWidth: o,
      autoWidthCount: 0,
      categoryGap: null,
      gap: "20%",
      stacks: {}
    }, l = s.stacks;
    t[a] = s;
    var u = i.stackId;
    l[u] || s.autoWidthCount++, l[u] = l[u] || {
      width: 0,
      maxWidth: 0
    };
    var h = i.barWidth;
    h && !l[u].width && (l[u].width = h, h = Math.min(s.remainedWidth, h), s.remainedWidth -= h);
    var c = i.barMaxWidth;
    c && (l[u].maxWidth = c);
    var f = i.barMinWidth;
    f && (l[u].minWidth = f);
    var d = i.barGap;
    d != null && (s.gap = d);
    var v = i.barCategoryGap;
    v != null && (s.categoryGap = v);
  });
  var e = {};
  return T(t, function(i, n) {
    e[n] = {};
    var a = i.stacks, o = i.bandWidth, s = i.categoryGap;
    if (s == null) {
      var l = xt(a).length;
      s = Math.max(35 - l * 4, 15) + "%";
    }
    var u = Ct(s, o), h = Ct(i.gap, 1), c = i.remainedWidth, f = i.autoWidthCount, d = (c - u) / (f + (f - 1) * h);
    d = Math.max(d, 0), T(a, function(y) {
      var m = y.maxWidth, _ = y.minWidth;
      if (y.width) {
        var b = y.width;
        m && (b = Math.min(b, m)), _ && (b = Math.max(b, _)), y.width = b, c -= b + h * b, f--;
      } else {
        var b = d;
        m && m < b && (b = Math.min(m, c)), _ && _ > b && (b = _), b !== d && (y.width = b, c -= b + h * b, f--);
      }
    }), d = (c - u) / (f + (f - 1) * h), d = Math.max(d, 0);
    var v = 0, g;
    T(a, function(y, m) {
      y.width || (y.width = d), g = y, v += y.width * (1 + h);
    }), g && (v -= g.width * h);
    var p = -v / 2;
    T(a, function(y, m) {
      e[n][m] = e[n][m] || {
        bandWidth: o,
        offset: p,
        width: y.width
      }, p += y.width * (1 + h);
    });
  }), e;
}
function bD(r, t, e) {
  if (r && t) {
    var i = r[Pf(t)];
    return i;
  }
}
function xD(r, t) {
  var e = $_(r, t), i = O_(e);
  T(e, function(n) {
    var a = n.getData(), o = n.coordinateSystem, s = o.getBaseAxis(), l = R_(n), u = i[Pf(s)][l], h = u.offset, c = u.width;
    a.setLayout({
      bandWidth: u.bandWidth,
      offset: h,
      size: c
    });
  });
}
function wD(r) {
  return {
    seriesType: r,
    plan: xf(),
    reset: function(t) {
      if (N_(t)) {
        var e = t.getData(), i = t.coordinateSystem, n = i.getBaseAxis(), a = i.getOtherAxis(n), o = e.getDimensionIndex(e.mapDimension(a.dim)), s = e.getDimensionIndex(e.mapDimension(n.dim)), l = t.get("showBackground", !0), u = e.mapDimension(a.dim), h = e.getCalculationInfo("stackResultDimension"), c = Si(e, u) && !!e.getCalculationInfo("stackedOnSeries"), f = a.isHorizontal(), d = SD(n, a), v = B_(t), g = t.get("barMinHeight") || 0, p = h && e.getDimensionIndex(h), y = e.getLayout("size"), m = e.getLayout("offset");
        return {
          progress: function(_, b) {
            for (var w = _.count, x = v && Je(w * 3), S = v && l && Je(w * 3), A = v && Je(w), M = i.master.getRect(), D = f ? M.width : M.height, C, I = b.getStore(), L = 0; (C = _.next()) != null; ) {
              var P = I.get(c ? p : o, C), E = I.get(s, C), R = d, Y = void 0;
              c && (Y = +P - I.get(o, C));
              var O = void 0, z = void 0, Z = void 0, J = void 0;
              if (f) {
                var it = i.dataToPoint([P, E]);
                if (c) {
                  var ft = i.dataToPoint([Y, E]);
                  R = ft[0];
                }
                O = R, z = it[1] + m, Z = it[0] - R, J = y, Math.abs(Z) < g && (Z = (Z < 0 ? -1 : 1) * g);
              } else {
                var it = i.dataToPoint([E, P]);
                if (c) {
                  var ft = i.dataToPoint([E, Y]);
                  R = ft[1];
                }
                O = it[0] + m, z = R, Z = y, J = it[1] - R, Math.abs(J) < g && (J = (J <= 0 ? -1 : 1) * g);
              }
              v ? (x[L] = O, x[L + 1] = z, x[L + 2] = f ? Z : J, S && (S[L] = f ? M.x : O, S[L + 1] = f ? z : M.y, S[L + 2] = D), A[C] = C) : b.setItemLayout(C, {
                x: O,
                y: z,
                width: Z,
                height: J
              }), L += 3;
            }
            v && b.setLayout({
              largePoints: x,
              largeDataIndices: A,
              largeBackgroundPoints: S,
              valueAxisHorizontal: f
            });
          }
        };
      }
    }
  };
}
function N_(r) {
  return r.coordinateSystem && r.coordinateSystem.type === "cartesian2d";
}
function B_(r) {
  return r.pipelineContext && r.pipelineContext.large;
}
function SD(r, t) {
  var e = t.model.get("startValue");
  return e || (e = 0), t.toGlobalCoord(t.dataToCoord(t.type === "log" ? e > 0 ? e : 1 : e));
}
var TD = function(r, t, e, i) {
  for (; e < i; ) {
    var n = e + i >>> 1;
    r[n][1] < t ? e = n + 1 : i = n;
  }
  return e;
}, z_ = (
  /** @class */
  function(r) {
    N(t, r);
    function t(e) {
      var i = r.call(this, e) || this;
      return i.type = "time", i;
    }
    return t.prototype.getLabel = function(e) {
      var i = this.getSetting("useUTC");
      return ul(e.value, $v[XT(nn(this._minLevelUnit))] || $v.second, i, this.getSetting("locale"));
    }, t.prototype.getFormattedLabel = function(e, i, n) {
      var a = this.getSetting("useUTC"), o = this.getSetting("locale");
      return ZT(e, i, n, o, a);
    }, t.prototype.getTicks = function() {
      var e = this._interval, i = this._extent, n = [];
      if (!e)
        return n;
      n.push({
        value: i[0],
        level: 0
      });
      var a = this.getSetting("useUTC"), o = LD(this._minLevelUnit, this._approxInterval, a, i);
      return n = n.concat(o), n.push({
        value: i[1],
        level: 0
      }), n;
    }, t.prototype.calcNiceExtent = function(e) {
      var i = this._extent;
      if (i[0] === i[1] && (i[0] -= ve, i[1] += ve), i[1] === -1 / 0 && i[0] === 1 / 0) {
        var n = /* @__PURE__ */ new Date();
        i[1] = +new Date(n.getFullYear(), n.getMonth(), n.getDate()), i[0] = i[1] - ve;
      }
      this.calcNiceTicks(e.splitNumber, e.minInterval, e.maxInterval);
    }, t.prototype.calcNiceTicks = function(e, i, n) {
      e = e || 10;
      var a = this._extent, o = a[1] - a[0];
      this._approxInterval = o / e, i != null && this._approxInterval < i && (this._approxInterval = i), n != null && this._approxInterval > n && (this._approxInterval = n);
      var s = Io.length, l = Math.min(TD(Io, this._approxInterval, 0, s), s - 1);
      this._interval = Io[l][1], this._minLevelUnit = Io[Math.max(l - 1, 0)][0];
    }, t.prototype.parse = function(e) {
      return wt(e) ? e : +rr(e);
    }, t.prototype.contain = function(e) {
      return ml(this.parse(e), this._extent);
    }, t.prototype.normalize = function(e) {
      return _l(this.parse(e), this._extent);
    }, t.prototype.scale = function(e) {
      return bl(e, this._extent);
    }, t.type = "time", t;
  }(Tn)
), Io = [
  // Format                           interval
  ["second", hf],
  ["minute", cf],
  ["hour", ma],
  ["quarter-day", ma * 6],
  ["half-day", ma * 12],
  ["day", ve * 1.2],
  ["half-week", ve * 3.5],
  ["week", ve * 7],
  ["month", ve * 31],
  ["quarter", ve * 95],
  ["half-year", Rv / 2],
  ["year", Rv]
  // 1Y
];
function CD(r, t, e, i) {
  var n = rr(t), a = rr(e), o = function(v) {
    return Ov(n, v, i) === Ov(a, v, i);
  }, s = function() {
    return o("year");
  }, l = function() {
    return s() && o("month");
  }, u = function() {
    return l() && o("day");
  }, h = function() {
    return u() && o("hour");
  }, c = function() {
    return h() && o("minute");
  }, f = function() {
    return c() && o("second");
  }, d = function() {
    return f() && o("millisecond");
  };
  switch (r) {
    case "year":
      return s();
    case "month":
      return l();
    case "day":
      return u();
    case "hour":
      return h();
    case "minute":
      return c();
    case "second":
      return f();
    case "millisecond":
      return d();
  }
}
function AD(r, t) {
  return r /= ve, r > 16 ? 16 : r > 7.5 ? 7 : r > 3.5 ? 4 : r > 1.5 ? 2 : 1;
}
function MD(r) {
  var t = 30 * ve;
  return r /= t, r > 6 ? 6 : r > 3 ? 3 : r > 2 ? 2 : 1;
}
function DD(r) {
  return r /= ma, r > 12 ? 12 : r > 6 ? 6 : r > 3.5 ? 4 : r > 2 ? 2 : 1;
}
function Up(r, t) {
  return r /= t ? cf : hf, r > 30 ? 30 : r > 20 ? 20 : r > 15 ? 15 : r > 10 ? 10 : r > 5 ? 5 : r > 2 ? 2 : 1;
}
function kD(r) {
  return ym(r);
}
function ID(r, t, e) {
  var i = new Date(r);
  switch (nn(t)) {
    case "year":
    case "month":
      i[h0(e)](0);
    case "day":
      i[c0(e)](1);
    case "hour":
      i[f0(e)](0);
    case "minute":
      i[d0(e)](0);
    case "second":
      i[v0(e)](0), i[p0(e)](0);
  }
  return i.getTime();
}
function LD(r, t, e, i) {
  var n = 1e4, a = l0, o = 0;
  function s(D, C, I, L, P, E, R) {
    for (var Y = new Date(C), O = C, z = Y[L](); O < I && O <= i[1]; )
      R.push({
        value: O
      }), z += D, Y[P](z), O = Y.getTime();
    R.push({
      value: O,
      notAdd: !0
    });
  }
  function l(D, C, I) {
    var L = [], P = !C.length;
    if (!CD(nn(D), i[0], i[1], e)) {
      P && (C = [{
        // TODO Optimize. Not include so may ticks.
        value: ID(new Date(i[0]), D, e)
      }, {
        value: i[1]
      }]);
      for (var E = 0; E < C.length - 1; E++) {
        var R = C[E].value, Y = C[E + 1].value;
        if (R !== Y) {
          var O = void 0, z = void 0, Z = void 0, J = !1;
          switch (D) {
            case "year":
              O = Math.max(1, Math.round(t / ve / 365)), z = ff(e), Z = qT(e);
              break;
            case "half-year":
            case "quarter":
            case "month":
              O = MD(t), z = an(e), Z = h0(e);
              break;
            case "week":
            case "half-week":
            case "day":
              O = AD(t), z = hl(e), Z = c0(e), J = !0;
              break;
            case "half-day":
            case "quarter-day":
            case "hour":
              O = DD(t), z = Ra(e), Z = f0(e);
              break;
            case "minute":
              O = Up(t, !0), z = cl(e), Z = d0(e);
              break;
            case "second":
              O = Up(t, !1), z = fl(e), Z = v0(e);
              break;
            case "millisecond":
              O = kD(t), z = dl(e), Z = p0(e);
              break;
          }
          s(O, R, Y, z, Z, J, L), D === "year" && I.length > 1 && E === 0 && I.unshift({
            value: I[0].value - O
          });
        }
      }
      for (var E = 0; E < L.length; E++)
        I.push(L[E]);
      return L;
    }
  }
  for (var u = [], h = [], c = 0, f = 0, d = 0; d < a.length && o++ < n; ++d) {
    var v = nn(a[d]);
    if (YT(a[d])) {
      l(a[d], u[u.length - 1] || [], h);
      var g = a[d + 1] ? nn(a[d + 1]) : null;
      if (v !== g) {
        if (h.length) {
          f = c, h.sort(function(D, C) {
            return D.value - C.value;
          });
          for (var p = [], y = 0; y < h.length; ++y) {
            var m = h[y].value;
            (y === 0 || h[y - 1].value !== m) && (p.push(h[y]), m >= i[0] && m <= i[1] && c++);
          }
          var _ = (i[1] - i[0]) / t;
          if (c > _ * 1.5 && f > _ / 1.5 || (u.push(p), c > _ || r === a[d]))
            break;
        }
        h = [];
      }
    }
  }
  for (var b = Pt(H(u, function(D) {
    return Pt(D, function(C) {
      return C.value >= i[0] && C.value <= i[1] && !C.notAdd;
    });
  }), function(D) {
    return D.length > 0;
  }), w = [], x = b.length - 1, d = 0; d < b.length; ++d)
    for (var S = b[d], A = 0; A < S.length; ++A)
      w.push({
        value: S[A].value,
        level: x - d
      });
  w.sort(function(D, C) {
    return D.value - C.value;
  });
  for (var M = [], d = 0; d < w.length; ++d)
    (d === 0 || w[d].value !== w[d - 1].value) && M.push(w[d]);
  return M;
}
Ue.registerClass(z_);
var Yp = Ue.prototype, Sa = Tn.prototype, PD = Lt, ED = Math.floor, RD = Math.ceil, Lo = Math.pow, Se = Math.log, Ef = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = "log", e.base = 10, e._originalScale = new Tn(), e._interval = 0, e;
    }
    return t.prototype.getTicks = function(e) {
      var i = this._originalScale, n = this._extent, a = i.getExtent(), o = Sa.getTicks.call(this, e);
      return H(o, function(s) {
        var l = s.value, u = Lt(Lo(this.base, l));
        return u = l === n[0] && this._fixMin ? Po(u, a[0]) : u, u = l === n[1] && this._fixMax ? Po(u, a[1]) : u, {
          value: u
        };
      }, this);
    }, t.prototype.setExtent = function(e, i) {
      var n = Se(this.base);
      e = Se(Math.max(0, e)) / n, i = Se(Math.max(0, i)) / n, Sa.setExtent.call(this, e, i);
    }, t.prototype.getExtent = function() {
      var e = this.base, i = Yp.getExtent.call(this);
      i[0] = Lo(e, i[0]), i[1] = Lo(e, i[1]);
      var n = this._originalScale, a = n.getExtent();
      return this._fixMin && (i[0] = Po(i[0], a[0])), this._fixMax && (i[1] = Po(i[1], a[1])), i;
    }, t.prototype.unionExtent = function(e) {
      this._originalScale.unionExtent(e);
      var i = this.base;
      e[0] = Se(e[0]) / Se(i), e[1] = Se(e[1]) / Se(i), Yp.unionExtent.call(this, e);
    }, t.prototype.unionExtentFromData = function(e, i) {
      this.unionExtent(e.getApproximateExtent(i));
    }, t.prototype.calcNiceTicks = function(e) {
      e = e || 10;
      var i = this._extent, n = i[1] - i[0];
      if (!(n === 1 / 0 || n <= 0)) {
        var a = lw(n), o = e / n * a;
        for (o <= 0.5 && (a *= 10); !isNaN(a) && Math.abs(a) < 1 && Math.abs(a) > 0; )
          a *= 10;
        var s = [Lt(RD(i[0] / a) * a), Lt(ED(i[1] / a) * a)];
        this._interval = a, this._niceExtent = s;
      }
    }, t.prototype.calcNiceExtent = function(e) {
      Sa.calcNiceExtent.call(this, e), this._fixMin = e.fixMin, this._fixMax = e.fixMax;
    }, t.prototype.parse = function(e) {
      return e;
    }, t.prototype.contain = function(e) {
      return e = Se(e) / Se(this.base), ml(e, this._extent);
    }, t.prototype.normalize = function(e) {
      return e = Se(e) / Se(this.base), _l(e, this._extent);
    }, t.prototype.scale = function(e) {
      return e = bl(e, this._extent), Lo(this.base, e);
    }, t.type = "log", t;
  }(Ue)
), F_ = Ef.prototype;
F_.getMinorTicks = Sa.getMinorTicks;
F_.getLabel = Sa.getLabel;
function Po(r, t) {
  return PD(r, Fe(t));
}
Ue.registerClass(Ef);
var $D = (
  /** @class */
  function() {
    function r(t, e, i) {
      this._prepareParams(t, e, i);
    }
    return r.prototype._prepareParams = function(t, e, i) {
      i[1] < i[0] && (i = [NaN, NaN]), this._dataMin = i[0], this._dataMax = i[1];
      var n = this._isOrdinal = t.type === "ordinal";
      this._needCrossZero = t.type === "interval" && e.getNeedCrossZero && e.getNeedCrossZero();
      var a = e.get("min", !0);
      a == null && (a = e.get("startValue", !0));
      var o = this._modelMinRaw = a;
      Q(o) ? this._modelMinNum = Eo(t, o({
        min: i[0],
        max: i[1]
      })) : o !== "dataMin" && (this._modelMinNum = Eo(t, o));
      var s = this._modelMaxRaw = e.get("max", !0);
      if (Q(s) ? this._modelMaxNum = Eo(t, s({
        min: i[0],
        max: i[1]
      })) : s !== "dataMax" && (this._modelMaxNum = Eo(t, s)), n)
        this._axisDataLen = e.getCategories().length;
      else {
        var l = e.get("boundaryGap"), u = B(l) ? l : [l || 0, l || 0];
        typeof u[0] == "boolean" || typeof u[1] == "boolean" ? this._boundaryGapInner = [0, 0] : this._boundaryGapInner = [Cr(u[0], 1), Cr(u[1], 1)];
      }
    }, r.prototype.calculate = function() {
      var t = this._isOrdinal, e = this._dataMin, i = this._dataMax, n = this._axisDataLen, a = this._boundaryGapInner, o = t ? null : i - e || Math.abs(e), s = this._modelMinRaw === "dataMin" ? e : this._modelMinNum, l = this._modelMaxRaw === "dataMax" ? i : this._modelMaxNum, u = s != null, h = l != null;
      s == null && (s = t ? n ? 0 : NaN : e - a[0] * o), l == null && (l = t ? n ? n - 1 : NaN : i + a[1] * o), (s == null || !isFinite(s)) && (s = NaN), (l == null || !isFinite(l)) && (l = NaN);
      var c = us(s) || us(l) || t && !n;
      this._needCrossZero && (s > 0 && l > 0 && !u && (s = 0), s < 0 && l < 0 && !h && (l = 0));
      var f = this._determinedMin, d = this._determinedMax;
      return f != null && (s = f, u = !0), d != null && (l = d, h = !0), {
        min: s,
        max: l,
        minFixed: u,
        maxFixed: h,
        isBlank: c
      };
    }, r.prototype.modifyDataMinMax = function(t, e) {
      this[ND[t]] = e;
    }, r.prototype.setDeterminedMinMax = function(t, e) {
      var i = OD[t];
      this[i] = e;
    }, r.prototype.freeze = function() {
      this.frozen = !0;
    }, r;
  }()
), OD = {
  min: "_determinedMin",
  max: "_determinedMax"
}, ND = {
  min: "_dataMin",
  max: "_dataMax"
};
function BD(r, t, e) {
  var i = r.rawExtentInfo;
  return i || (i = new $D(r, t, e), r.rawExtentInfo = i, i);
}
function Eo(r, t) {
  return t == null ? null : us(t) ? NaN : r.parse(t);
}
function H_(r, t) {
  var e = r.type, i = BD(r, t, r.getExtent()).calculate();
  r.setBlank(i.isBlank);
  var n = i.min, a = i.max, o = t.ecModel;
  if (o && e === "time") {
    var s = $_("bar", o), l = !1;
    if (T(s, function(c) {
      l = l || c.getBaseAxis() === t.axis;
    }), l) {
      var u = O_(s), h = zD(n, a, t, u);
      n = h.min, a = h.max;
    }
  }
  return {
    extent: [n, a],
    // "fix" means "fixed", the value should not be
    // changed in the subsequent steps.
    fixMin: i.minFixed,
    fixMax: i.maxFixed
  };
}
function zD(r, t, e, i) {
  var n = e.axis.getExtent(), a = Math.abs(n[1] - n[0]), o = bD(i, e.axis);
  if (o === void 0)
    return {
      min: r,
      max: t
    };
  var s = 1 / 0;
  T(o, function(d) {
    s = Math.min(d.offset, s);
  });
  var l = -1 / 0;
  T(o, function(d) {
    l = Math.max(d.offset + d.width, l);
  }), s = Math.abs(s), l = Math.abs(l);
  var u = s + l, h = t - r, c = 1 - (s + l) / a, f = h / c - h;
  return t += f * (l / u), r -= f * (s / u), {
    min: r,
    max: t
  };
}
function Xp(r, t) {
  var e = t, i = H_(r, e), n = i.extent, a = e.get("splitNumber");
  r instanceof Ef && (r.base = e.get("logBase"));
  var o = r.type, s = e.get("interval"), l = o === "interval" || o === "time";
  r.setExtent(n[0], n[1]), r.calcNiceExtent({
    splitNumber: a,
    fixMin: i.fixMin,
    fixMax: i.fixMax,
    minInterval: l ? e.get("minInterval") : null,
    maxInterval: l ? e.get("maxInterval") : null
  }), s != null && r.setInterval && r.setInterval(s);
}
function FD(r, t) {
  if (t = t || r.get("type"), t)
    switch (t) {
      case "category":
        return new Lf({
          ordinalMeta: r.getOrdinalMeta ? r.getOrdinalMeta() : r.getCategories(),
          extent: [1 / 0, -1 / 0]
        });
      case "time":
        return new z_({
          locale: r.ecModel.getLocaleModel(),
          useUTC: r.ecModel.get("useUTC")
        });
      default:
        return new (Ue.getClass(t) || Tn)();
    }
}
function HD(r) {
  var t = r.scale.getExtent(), e = t[0], i = t[1];
  return !(e > 0 && i > 0 || e < 0 && i < 0);
}
function Cn(r) {
  var t = r.getLabelModel().get("formatter"), e = r.type === "category" ? r.scale.getExtent()[0] : null;
  return r.scale.type === "time" ? /* @__PURE__ */ function(i) {
    return function(n, a) {
      return r.scale.getFormattedLabel(n, a, i);
    };
  }(t) : V(t) ? /* @__PURE__ */ function(i) {
    return function(n) {
      var a = r.scale.getLabel(n), o = i.replace("{value}", a ?? "");
      return o;
    };
  }(t) : Q(t) ? /* @__PURE__ */ function(i) {
    return function(n, a) {
      return e != null && (a = n.value - e), i(Rf(r, n), a, n.level != null ? {
        level: n.level
      } : null);
    };
  }(t) : function(i) {
    return r.scale.getLabel(i);
  };
}
function Rf(r, t) {
  return r.type === "category" ? r.scale.getLabel(t) : t.value;
}
function VD(r) {
  var t = r.model, e = r.scale;
  if (!(!t.get(["axisLabel", "show"]) || e.isBlank())) {
    var i, n, a = e.getExtent();
    e instanceof Lf ? n = e.count() : (i = e.getTicks(), n = i.length);
    var o = r.getLabelModel(), s = Cn(r), l, u = 1;
    n > 40 && (u = Math.ceil(n / 40));
    for (var h = 0; h < n; h += u) {
      var c = i ? i[h] : {
        value: a[0] + h
      }, f = s(c, h), d = o.getTextRect(f), v = GD(d, o.get("rotate") || 0);
      l ? l.union(v) : l = v;
    }
    return l;
  }
}
function GD(r, t) {
  var e = t * Math.PI / 180, i = r.width, n = r.height, a = i * Math.abs(Math.cos(e)) + Math.abs(n * Math.sin(e)), o = i * Math.abs(Math.sin(e)) + Math.abs(n * Math.cos(e)), s = new ot(r.x, r.y, a, o);
  return s;
}
function $f(r) {
  var t = r.get("interval");
  return t ?? "auto";
}
function V_(r) {
  return r.type === "category" && $f(r.getLabelModel()) === 0;
}
function WD(r, t) {
  var e = {};
  return T(r.mapDimensionsAll(t), function(i) {
    e[sD(r, i)] = !0;
  }), xt(e);
}
var UD = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.getNeedCrossZero = function() {
      var t = this.option;
      return !t.scale;
    }, r.prototype.getCoordSysModel = function() {
    }, r;
  }()
), Zp = [], YD = {
  registerPreprocessor: S_,
  registerProcessor: T_,
  registerPostInit: NM,
  registerPostUpdate: BM,
  registerUpdateLifecycle: Mf,
  registerAction: Ai,
  registerCoordinateSystem: zM,
  registerLayout: FM,
  registerVisual: Mi,
  registerTransform: VM,
  registerLoading: C_,
  registerMap: HM,
  registerImpl: yM,
  PRIORITY: IM,
  ComponentModel: dt,
  ComponentView: ne,
  SeriesModel: Ie,
  ChartView: me,
  // TODO Use ComponentModel and SeriesModel instead of Constructor
  registerComponentModel: function(r) {
    dt.registerClass(r);
  },
  registerComponentView: function(r) {
    ne.registerClass(r);
  },
  registerSeriesModel: function(r) {
    Ie.registerClass(r);
  },
  registerChartView: function(r) {
    me.registerClass(r);
  },
  registerSubTypeDefaulter: function(r, t) {
    dt.registerSubTypeDefaulter(r, t);
  },
  registerPainter: function(r, t) {
    rw(r, t);
  }
};
function kr(r) {
  if (B(r)) {
    T(r, function(t) {
      kr(t);
    });
    return;
  }
  rt(Zp, r) >= 0 || (Zp.push(r), Q(r) && (r = {
    install: r
  }), r.install(YD));
}
var XD = 1e-8;
function qp(r, t) {
  return Math.abs(r - t) < XD;
}
function Un(r, t, e) {
  var i = 0, n = r[0];
  if (!n)
    return !1;
  for (var a = 1; a < r.length; a++) {
    var o = r[a];
    i += Qe(n[0], n[1], o[0], o[1], t, e), n = o;
  }
  var s = r[0];
  return (!qp(n[0], s[0]) || !qp(n[1], s[1])) && (i += Qe(n[0], n[1], s[0], s[1], t, e)), i !== 0;
}
var za = Tt();
function G_(r, t) {
  var e = H(t, function(i) {
    return r.scale.parse(i);
  });
  return r.type === "time" && e.length > 0 && (e.sort(), e.unshift(e[0]), e.push(e[e.length - 1])), e;
}
function ZD(r) {
  var t = r.getLabelModel().get("customValues");
  if (t) {
    var e = Cn(r), i = r.scale.getExtent(), n = G_(r, t), a = Pt(n, function(o) {
      return o >= i[0] && o <= i[1];
    });
    return {
      labels: H(a, function(o) {
        var s = {
          value: o
        };
        return {
          formattedLabel: e(s),
          rawLabel: r.scale.getLabel(s),
          tickValue: o
        };
      })
    };
  }
  return r.type === "category" ? KD(r) : QD(r);
}
function qD(r, t) {
  var e = r.getTickModel().get("customValues");
  if (e) {
    var i = r.scale.getExtent(), n = G_(r, e);
    return {
      ticks: Pt(n, function(a) {
        return a >= i[0] && a <= i[1];
      })
    };
  }
  return r.type === "category" ? jD(r, t) : {
    ticks: H(r.scale.getTicks(), function(a) {
      return a.value;
    })
  };
}
function KD(r) {
  var t = r.getLabelModel(), e = W_(r, t);
  return !t.get("show") || r.scale.isBlank() ? {
    labels: [],
    labelCategoryInterval: e.labelCategoryInterval
  } : e;
}
function W_(r, t) {
  var e = U_(r, "labels"), i = $f(t), n = Y_(e, i);
  if (n)
    return n;
  var a, o;
  return Q(i) ? a = q_(r, i) : (o = i === "auto" ? JD(r) : i, a = Z_(r, o)), X_(e, i, {
    labels: a,
    labelCategoryInterval: o
  });
}
function jD(r, t) {
  var e = U_(r, "ticks"), i = $f(t), n = Y_(e, i);
  if (n)
    return n;
  var a, o;
  if ((!t.get("show") || r.scale.isBlank()) && (a = []), Q(i))
    a = q_(r, i, !0);
  else if (i === "auto") {
    var s = W_(r, r.getLabelModel());
    o = s.labelCategoryInterval, a = H(s.labels, function(l) {
      return l.tickValue;
    });
  } else
    o = i, a = Z_(r, o, !0);
  return X_(e, i, {
    ticks: a,
    tickCategoryInterval: o
  });
}
function QD(r) {
  var t = r.scale.getTicks(), e = Cn(r);
  return {
    labels: H(t, function(i, n) {
      return {
        level: i.level,
        formattedLabel: e(i, n),
        rawLabel: r.scale.getLabel(i),
        tickValue: i.value
      };
    })
  };
}
function U_(r, t) {
  return za(r)[t] || (za(r)[t] = []);
}
function Y_(r, t) {
  for (var e = 0; e < r.length; e++)
    if (r[e].key === t)
      return r[e].value;
}
function X_(r, t, e) {
  return r.push({
    key: t,
    value: e
  }), e;
}
function JD(r) {
  var t = za(r).autoInterval;
  return t ?? (za(r).autoInterval = r.calculateCategoryInterval());
}
function tk(r) {
  var t = ek(r), e = Cn(r), i = (t.axisRotate - t.labelRotate) / 180 * Math.PI, n = r.scale, a = n.getExtent(), o = n.count();
  if (a[1] - a[0] < 1)
    return 0;
  var s = 1;
  o > 40 && (s = Math.max(1, Math.floor(o / 40)));
  for (var l = a[0], u = r.dataToCoord(l + 1) - r.dataToCoord(l), h = Math.abs(u * Math.cos(i)), c = Math.abs(u * Math.sin(i)), f = 0, d = 0; l <= a[1]; l += s) {
    var v = 0, g = 0, p = Vc(e({
      value: l
    }), t.font, "center", "top");
    v = p.width * 1.3, g = p.height * 1.3, f = Math.max(f, v, 7), d = Math.max(d, g, 7);
  }
  var y = f / h, m = d / c;
  isNaN(y) && (y = 1 / 0), isNaN(m) && (m = 1 / 0);
  var _ = Math.max(0, Math.floor(Math.min(y, m))), b = za(r.model), w = r.getExtent(), x = b.lastAutoInterval, S = b.lastTickCount;
  return x != null && S != null && Math.abs(x - _) <= 1 && Math.abs(S - o) <= 1 && x > _ && b.axisExtent0 === w[0] && b.axisExtent1 === w[1] ? _ = x : (b.lastTickCount = o, b.lastAutoInterval = _, b.axisExtent0 = w[0], b.axisExtent1 = w[1]), _;
}
function ek(r) {
  var t = r.getLabelModel();
  return {
    axisRotate: r.getRotate ? r.getRotate() : r.isHorizontal && !r.isHorizontal() ? 90 : 0,
    labelRotate: t.get("rotate") || 0,
    font: t.getFont()
  };
}
function Z_(r, t, e) {
  var i = Cn(r), n = r.scale, a = n.getExtent(), o = r.getLabelModel(), s = [], l = Math.max((t || 0) + 1, 1), u = a[0], h = n.count();
  u !== 0 && l > 1 && h / l > 2 && (u = Math.round(Math.ceil(u / l) * l));
  var c = V_(r), f = o.get("showMinLabel") || c, d = o.get("showMaxLabel") || c;
  f && u !== a[0] && g(a[0]);
  for (var v = u; v <= a[1]; v += l)
    g(v);
  d && v - l !== a[1] && g(a[1]);
  function g(p) {
    var y = {
      value: p
    };
    s.push(e ? p : {
      formattedLabel: i(y),
      rawLabel: n.getLabel(y),
      tickValue: p
    });
  }
  return s;
}
function q_(r, t, e) {
  var i = r.scale, n = Cn(r), a = [];
  return T(i.getTicks(), function(o) {
    var s = i.getLabel(o), l = o.value;
    t(o.value, s) && a.push(e ? l : {
      formattedLabel: n(o),
      rawLabel: s,
      tickValue: l
    });
  }), a;
}
var Kp = [0, 1], rk = (
  /** @class */
  function() {
    function r(t, e, i) {
      this.onBand = !1, this.inverse = !1, this.dim = t, this.scale = e, this._extent = i || [0, 0];
    }
    return r.prototype.contain = function(t) {
      var e = this._extent, i = Math.min(e[0], e[1]), n = Math.max(e[0], e[1]);
      return t >= i && t <= n;
    }, r.prototype.containData = function(t) {
      return this.scale.contain(t);
    }, r.prototype.getExtent = function() {
      return this._extent.slice();
    }, r.prototype.getPixelPrecision = function(t) {
      return aw(t || this.scale.getExtent(), this._extent);
    }, r.prototype.setExtent = function(t, e) {
      var i = this._extent;
      i[0] = t, i[1] = e;
    }, r.prototype.dataToCoord = function(t, e) {
      var i = this._extent, n = this.scale;
      return t = n.normalize(t), this.onBand && n.type === "ordinal" && (i = i.slice(), jp(i, n.count())), mi(t, Kp, i, e);
    }, r.prototype.coordToData = function(t, e) {
      var i = this._extent, n = this.scale;
      this.onBand && n.type === "ordinal" && (i = i.slice(), jp(i, n.count()));
      var a = mi(t, i, Kp, e);
      return this.scale.scale(a);
    }, r.prototype.pointToData = function(t, e) {
    }, r.prototype.getTicksCoords = function(t) {
      t = t || {};
      var e = t.tickModel || this.getTickModel(), i = qD(this, e), n = i.ticks, a = H(n, function(s) {
        return {
          coord: this.dataToCoord(this.scale.type === "ordinal" ? this.scale.getRawOrdinalNumber(s) : s),
          tickValue: s
        };
      }, this), o = e.get("alignWithLabel");
      return ik(this, a, o, t.clamp), a;
    }, r.prototype.getMinorTicksCoords = function() {
      if (this.scale.type === "ordinal")
        return [];
      var t = this.model.getModel("minorTick"), e = t.get("splitNumber");
      e > 0 && e < 100 || (e = 5);
      var i = this.scale.getMinorTicks(e), n = H(i, function(a) {
        return H(a, function(o) {
          return {
            coord: this.dataToCoord(o),
            tickValue: o
          };
        }, this);
      }, this);
      return n;
    }, r.prototype.getViewLabels = function() {
      return ZD(this).labels;
    }, r.prototype.getLabelModel = function() {
      return this.model.getModel("axisLabel");
    }, r.prototype.getTickModel = function() {
      return this.model.getModel("axisTick");
    }, r.prototype.getBandWidth = function() {
      var t = this._extent, e = this.scale.getExtent(), i = e[1] - e[0] + (this.onBand ? 1 : 0);
      i === 0 && (i = 1);
      var n = Math.abs(t[1] - t[0]);
      return Math.abs(n) / i;
    }, r.prototype.calculateCategoryInterval = function() {
      return tk(this);
    }, r;
  }()
);
function jp(r, t) {
  var e = r[1] - r[0], i = t, n = e / i / 2;
  r[0] += n, r[1] -= n;
}
function ik(r, t, e, i) {
  var n = t.length;
  if (!r.onBand || e || !n)
    return;
  var a = r.getExtent(), o, s;
  if (n === 1)
    t[0].coord = a[0], o = t[1] = {
      coord: a[1],
      tickValue: t[0].tickValue
    };
  else {
    var l = t[n - 1].tickValue - t[0].tickValue, u = (t[n - 1].coord - t[0].coord) / l;
    T(t, function(d) {
      d.coord -= u / 2;
    });
    var h = r.scale.getExtent();
    s = 1 + h[1] - t[n - 1].tickValue, o = {
      coord: t[n - 1].coord + u * s,
      tickValue: h[1] + 1
    }, t.push(o);
  }
  var c = a[0] > a[1];
  f(t[0].coord, a[0]) && (i ? t[0].coord = a[0] : t.shift()), i && f(a[0], t[0].coord) && t.unshift({
    coord: a[0]
  }), f(a[1], o.coord) && (i ? o.coord = a[1] : t.pop()), i && f(o.coord, a[1]) && t.push({
    coord: a[1]
  });
  function f(d, v) {
    return d = Lt(d), v = Lt(v), c ? d > v : d < v;
  }
}
function nk(r) {
  for (var t = [], e = 0; e < r.length; e++) {
    var i = r[e];
    if (!i.defaultAttr.ignore) {
      var n = i.label, a = n.getComputedTransform(), o = n.getBoundingRect(), s = !a || a[1] < 1e-5 && a[2] < 1e-5, l = n.style.margin || 0, u = o.clone();
      u.applyTransform(a), u.x -= l / 2, u.y -= l / 2, u.width += l, u.height += l;
      var h = s ? new As(o, a) : null;
      t.push({
        label: n,
        labelLine: i.labelLine,
        rect: u,
        localRect: o,
        obb: h,
        priority: i.priority,
        defaultAttr: i.defaultAttr,
        layoutOption: i.computedLayoutOption,
        axisAligned: s,
        transform: a
      });
    }
  }
  return t;
}
function ak(r) {
  var t = [];
  r.sort(function(g, p) {
    return p.priority - g.priority;
  });
  var e = new ot(0, 0, 0, 0);
  function i(g) {
    if (!g.ignore) {
      var p = g.ensureState("emphasis");
      p.ignore == null && (p.ignore = !1);
    }
    g.ignore = !0;
  }
  for (var n = 0; n < r.length; n++) {
    var a = r[n], o = a.axisAligned, s = a.localRect, l = a.transform, u = a.label, h = a.labelLine;
    e.copy(a.rect), e.width -= 0.1, e.height -= 0.1, e.x += 0.05, e.y += 0.05;
    for (var c = a.obb, f = !1, d = 0; d < t.length; d++) {
      var v = t[d];
      if (e.intersect(v.rect)) {
        if (o && v.axisAligned) {
          f = !0;
          break;
        }
        if (v.obb || (v.obb = new As(v.localRect, v.transform)), c || (c = new As(s, l)), c.intersect(v.obb)) {
          f = !0;
          break;
        }
      }
    }
    f ? (i(u), h && i(h)) : (u.attr("ignore", a.defaultAttr.ignore), h && h.attr("ignore", a.defaultAttr.labelGuideIgnore), t.push(a));
  }
}
var ok = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e.hasSymbolVisual = !0, e;
    }
    return t.prototype.getInitialData = function(e) {
      return If(null, this, {
        useEncodeDefaulter: !0
      });
    }, t.prototype.getLegendIcon = function(e) {
      var i = new St(), n = vn("line", 0, e.itemHeight / 2, e.itemWidth, 0, e.lineStyle.stroke, !1);
      i.add(n), n.setStyle(e.lineStyle);
      var a = this.getData().getVisual("symbol"), o = this.getData().getVisual("symbolRotate"), s = a === "none" ? "circle" : a, l = e.itemHeight * 0.8, u = vn(s, (e.itemWidth - l) / 2, (e.itemHeight - l) / 2, l, l, e.itemStyle.fill);
      i.add(u), u.setStyle(e.itemStyle);
      var h = e.iconRotate === "inherit" ? o : e.iconRotate || 0;
      return u.rotation = h * Math.PI / 180, u.setOrigin([e.itemWidth / 2, e.itemHeight / 2]), s.indexOf("empty") > -1 && (u.style.stroke = u.style.fill, u.style.fill = "#fff", u.style.lineWidth = 2), i;
    }, t.type = "series.line", t.dependencies = ["grid", "polar"], t.defaultOption = {
      // zlevel: 0,
      z: 3,
      coordinateSystem: "cartesian2d",
      legendHoverLink: !0,
      clip: !0,
      label: {
        position: "top"
      },
      // itemStyle: {
      // },
      endLabel: {
        show: !1,
        valueAnimation: !0,
        distance: 8
      },
      lineStyle: {
        width: 2,
        type: "solid"
      },
      emphasis: {
        scale: !0
      },
      // areaStyle: {
      // origin of areaStyle. Valid values:
      // `'auto'/null/undefined`: from axisLine to data
      // `'start'`: from min to data
      // `'end'`: from data to max
      // origin: 'auto'
      // },
      // false, 'start', 'end', 'middle'
      step: !1,
      // Disabled if step is true
      smooth: !1,
      smoothMonotone: null,
      symbol: "emptyCircle",
      symbolSize: 4,
      symbolRotate: null,
      showSymbol: !0,
      // `false`: follow the label interval strategy.
      // `true`: show all symbols.
      // `'auto'`: If possible, show all symbols, otherwise
      //           follow the label interval strategy.
      showAllSymbol: "auto",
      // Whether to connect break point.
      connectNulls: !1,
      // Sampling for large data. Can be: 'average', 'max', 'min', 'sum', 'lttb'.
      sampling: "none",
      animationEasing: "linear",
      // Disable progressive
      progressive: 0,
      hoverLayerThreshold: 1 / 0,
      universalTransition: {
        divideShape: "clone"
      },
      triggerLineEvent: !1
    }, t;
  }(Ie)
);
function Of(r, t) {
  var e = r.mapDimensionsAll("defaultedLabel"), i = e.length;
  if (i === 1) {
    var n = dn(r, t, e[0]);
    return n != null ? n + "" : null;
  } else if (i) {
    for (var a = [], o = 0; o < e.length; o++)
      a.push(dn(r, t, e[o]));
    return a.join(" ");
  }
}
function K_(r, t) {
  var e = r.mapDimensionsAll("defaultedLabel");
  if (!B(t))
    return t + "";
  for (var i = [], n = 0; n < e.length; n++) {
    var a = r.getDimensionIndex(e[n]);
    a >= 0 && i.push(t[a]);
  }
  return i.join(" ");
}
var Nf = (
  /** @class */
  function(r) {
    N(t, r);
    function t(e, i, n, a) {
      var o = r.call(this) || this;
      return o.updateData(e, i, n, a), o;
    }
    return t.prototype._createSymbol = function(e, i, n, a, o) {
      this.removeAll();
      var s = vn(e, -1, -1, 2, 2, null, o);
      s.attr({
        z2: 100,
        culling: !0,
        scaleX: a[0] / 2,
        scaleY: a[1] / 2
      }), s.drift = sk, this._symbolType = e, this.add(s);
    }, t.prototype.stopSymbolAnimation = function(e) {
      this.childAt(0).stopAnimation(null, e);
    }, t.prototype.getSymbolType = function() {
      return this._symbolType;
    }, t.prototype.getSymbolPath = function() {
      return this.childAt(0);
    }, t.prototype.highlight = function() {
      Ss(this.childAt(0));
    }, t.prototype.downplay = function() {
      Ts(this.childAt(0));
    }, t.prototype.setZ = function(e, i) {
      var n = this.childAt(0);
      n.zlevel = e, n.z = i;
    }, t.prototype.setDraggable = function(e, i) {
      var n = this.childAt(0);
      n.draggable = e, n.cursor = !i && e ? "move" : n.cursor;
    }, t.prototype.updateData = function(e, i, n, a) {
      this.silent = !1;
      var o = e.getItemVisual(i, "symbol") || "circle", s = e.hostModel, l = t.getSymbolSize(e, i), u = o !== this._symbolType, h = a && a.disableAnimation;
      if (u) {
        var c = e.getItemVisual(i, "symbolKeepAspect");
        this._createSymbol(o, e, i, l, c);
      } else {
        var f = this.childAt(0);
        f.silent = !1;
        var d = {
          scaleX: l[0] / 2,
          scaleY: l[1] / 2
        };
        h ? f.attr(d) : jt(f, d, s, i), qm(f);
      }
      if (this._updateCommon(e, i, l, n, a), u) {
        var f = this.childAt(0);
        if (!h) {
          var d = {
            scaleX: this._sizeX,
            scaleY: this._sizeY,
            style: {
              // Always fadeIn. Because it has fadeOut animation when symbol is removed..
              opacity: f.style.opacity
            }
          };
          f.scaleX = f.scaleY = 0, f.style.opacity = 0, ir(f, d, s, i);
        }
      }
      h && this.childAt(0).stopAnimation("leave");
    }, t.prototype._updateCommon = function(e, i, n, a, o) {
      var s = this.childAt(0), l = e.hostModel, u, h, c, f, d, v, g, p, y;
      if (a && (u = a.emphasisItemStyle, h = a.blurItemStyle, c = a.selectItemStyle, f = a.focus, d = a.blurScope, g = a.labelStatesModels, p = a.hoverScale, y = a.cursorStyle, v = a.emphasisDisabled), !a || e.hasItemOption) {
        var m = a && a.itemModel ? a.itemModel : e.getItemModel(i), _ = m.getModel("emphasis");
        u = _.getModel("itemStyle").getItemStyle(), c = m.getModel(["select", "itemStyle"]).getItemStyle(), h = m.getModel(["blur", "itemStyle"]).getItemStyle(), f = _.get("focus"), d = _.get("blurScope"), v = _.get("disabled"), g = wn(m), p = _.getShallow("scale"), y = m.getShallow("cursor");
      }
      var b = e.getItemVisual(i, "symbolRotate");
      s.attr("rotation", (b || 0) * Math.PI / 180 || 0);
      var w = r_(e.getItemVisual(i, "symbolOffset"), n);
      w && (s.x = w[0], s.y = w[1]), y && s.attr("cursor", y);
      var x = e.getItemVisual(i, "style"), S = x.fill;
      if (s instanceof Lr) {
        var A = s.style;
        s.useStyle($({
          // TODO other properties like x, y ?
          image: A.image,
          x: A.x,
          y: A.y,
          width: A.width,
          height: A.height
        }, x));
      } else
        s.__isEmptyBrush ? s.useStyle($({}, x)) : s.useStyle(x), s.style.decal = null, s.setColor(S, o && o.symbolInnerColor), s.style.strokeNoScale = !0;
      var M = e.getItemVisual(i, "liftZ"), D = this._z2;
      M != null ? D == null && (this._z2 = s.z2, s.z2 += M) : D != null && (s.z2 = D, this._z2 = null);
      var C = o && o.useNameLabel;
      xn(s, g, {
        labelFetcher: l,
        labelDataIndex: i,
        defaultText: I,
        inheritColor: S,
        defaultOpacity: x.opacity
      });
      function I(E) {
        return C ? e.getName(E) : Of(e, E);
      }
      this._sizeX = n[0] / 2, this._sizeY = n[1] / 2;
      var L = s.ensureState("emphasis");
      L.style = u, s.ensureState("select").style = c, s.ensureState("blur").style = h;
      var P = p == null || p === !0 ? Math.max(1.1, 3 / this._sizeY) : isFinite(p) && p > 0 ? +p : 1;
      L.scaleX = this._sizeX * P, L.scaleY = this._sizeY * P, this.setSymbolScale(1), hn(this, f, d, v);
    }, t.prototype.setSymbolScale = function(e) {
      this.scaleX = this.scaleY = e;
    }, t.prototype.fadeOut = function(e, i, n) {
      var a = this.childAt(0), o = lt(this).dataIndex, s = n && n.animation;
      if (this.silent = a.silent = !0, n && n.fadeLabel) {
        var l = a.getTextContent();
        l && Ms(l, {
          style: {
            opacity: 0
          }
        }, i, {
          dataIndex: o,
          removeOpt: s,
          cb: function() {
            a.removeTextContent();
          }
        });
      } else
        a.removeTextContent();
      Ms(a, {
        style: {
          opacity: 0
        },
        scaleX: 0,
        scaleY: 0
      }, i, {
        dataIndex: o,
        cb: e,
        removeOpt: s
      });
    }, t.getSymbolSize = function(e, i) {
      return tM(e.getItemVisual(i, "symbolSize"));
    }, t;
  }(St)
);
function sk(r, t) {
  this.parent.drift(r, t);
}
function Pu(r, t, e, i) {
  return t && !isNaN(t[0]) && !isNaN(t[1]) && !(i.isIgnore && i.isIgnore(e)) && !(i.clipShape && !i.clipShape.contain(t[0], t[1])) && r.getItemVisual(e, "symbol") !== "none";
}
function Qp(r) {
  return r != null && !U(r) && (r = {
    isIgnore: r
  }), r || {};
}
function Jp(r) {
  var t = r.hostModel, e = t.getModel("emphasis");
  return {
    emphasisItemStyle: e.getModel("itemStyle").getItemStyle(),
    blurItemStyle: t.getModel(["blur", "itemStyle"]).getItemStyle(),
    selectItemStyle: t.getModel(["select", "itemStyle"]).getItemStyle(),
    focus: e.get("focus"),
    blurScope: e.get("blurScope"),
    emphasisDisabled: e.get("disabled"),
    hoverScale: e.get("scale"),
    labelStatesModels: wn(t),
    cursorStyle: t.get("cursor")
  };
}
var lk = (
  /** @class */
  function() {
    function r(t) {
      this.group = new St(), this._SymbolCtor = t || Nf;
    }
    return r.prototype.updateData = function(t, e) {
      this._progressiveEls = null, e = Qp(e);
      var i = this.group, n = t.hostModel, a = this._data, o = this._SymbolCtor, s = e.disableAnimation, l = Jp(t), u = {
        disableAnimation: s
      }, h = e.getSymbolPoint || function(c) {
        return t.getItemLayout(c);
      };
      a || i.removeAll(), t.diff(a).add(function(c) {
        var f = h(c);
        if (Pu(t, f, c, e)) {
          var d = new o(t, c, l, u);
          d.setPosition(f), t.setItemGraphicEl(c, d), i.add(d);
        }
      }).update(function(c, f) {
        var d = a.getItemGraphicEl(f), v = h(c);
        if (!Pu(t, v, c, e)) {
          i.remove(d);
          return;
        }
        var g = t.getItemVisual(c, "symbol") || "circle", p = d && d.getSymbolType && d.getSymbolType();
        if (!d || p && p !== g)
          i.remove(d), d = new o(t, c, l, u), d.setPosition(v);
        else {
          d.updateData(t, c, l, u);
          var y = {
            x: v[0],
            y: v[1]
          };
          s ? d.attr(y) : jt(d, y, n);
        }
        i.add(d), t.setItemGraphicEl(c, d);
      }).remove(function(c) {
        var f = a.getItemGraphicEl(c);
        f && f.fadeOut(function() {
          i.remove(f);
        }, n);
      }).execute(), this._getSymbolPoint = h, this._data = t;
    }, r.prototype.updateLayout = function() {
      var t = this, e = this._data;
      e && e.eachItemGraphicEl(function(i, n) {
        var a = t._getSymbolPoint(n);
        i.setPosition(a), i.markRedraw();
      });
    }, r.prototype.incrementalPrepareUpdate = function(t) {
      this._seriesScope = Jp(t), this._data = null, this.group.removeAll();
    }, r.prototype.incrementalUpdate = function(t, e, i) {
      this._progressiveEls = [], i = Qp(i);
      function n(l) {
        l.isGroup || (l.incremental = !0, l.ensureState("emphasis").hoverLayer = !0);
      }
      for (var a = t.start; a < t.end; a++) {
        var o = e.getItemLayout(a);
        if (Pu(e, o, a, i)) {
          var s = new this._SymbolCtor(e, a, this._seriesScope);
          s.traverse(n), s.setPosition(o), this.group.add(s), e.setItemGraphicEl(a, s), this._progressiveEls.push(s);
        }
      }
    }, r.prototype.eachRendered = function(t) {
      al(this._progressiveEls || this.group, t);
    }, r.prototype.remove = function(t) {
      var e = this.group, i = this._data;
      i && t ? i.eachItemGraphicEl(function(n) {
        n.fadeOut(function() {
          e.remove(n);
        }, i.hostModel);
      }) : e.removeAll();
    }, r;
  }()
);
function j_(r, t, e) {
  var i = r.getBaseAxis(), n = r.getOtherAxis(i), a = uk(n, e), o = i.dim, s = n.dim, l = t.mapDimension(s), u = t.mapDimension(o), h = s === "x" || s === "radius" ? 1 : 0, c = H(r.dimensions, function(v) {
    return t.mapDimension(v);
  }), f = !1, d = t.getCalculationInfo("stackResultDimension");
  return Si(
    t,
    c[0]
    /* , dims[1] */
  ) && (f = !0, c[0] = d), Si(
    t,
    c[1]
    /* , dims[0] */
  ) && (f = !0, c[1] = d), {
    dataDimsForPoint: c,
    valueStart: a,
    valueAxisDim: s,
    baseAxisDim: o,
    stacked: !!f,
    valueDim: l,
    baseDim: u,
    baseDataOffset: h,
    stackedOverDimension: t.getCalculationInfo("stackedOverDimension")
  };
}
function uk(r, t) {
  var e = 0, i = r.scale.getExtent();
  return t === "start" ? e = i[0] : t === "end" ? e = i[1] : wt(t) && !isNaN(t) ? e = t : i[0] > 0 ? e = i[0] : i[1] < 0 && (e = i[1]), e;
}
function Q_(r, t, e, i) {
  var n = NaN;
  r.stacked && (n = e.get(e.getCalculationInfo("stackedOverDimension"), i)), isNaN(n) && (n = r.valueStart);
  var a = r.baseDataOffset, o = [];
  return o[a] = e.get(r.baseDim, i), o[1 - a] = n, t.dataToPoint(o);
}
function hk(r, t) {
  var e = [];
  return t.diff(r).add(function(i) {
    e.push({
      cmd: "+",
      idx: i
    });
  }).update(function(i, n) {
    e.push({
      cmd: "=",
      idx: n,
      idx1: i
    });
  }).remove(function(i) {
    e.push({
      cmd: "-",
      idx: i
    });
  }).execute(), e;
}
function ck(r, t, e, i, n, a, o, s) {
  for (var l = hk(r, t), u = [], h = [], c = [], f = [], d = [], v = [], g = [], p = j_(n, t, o), y = r.getLayout("points") || [], m = t.getLayout("points") || [], _ = 0; _ < l.length; _++) {
    var b = l[_], w = !0, x = void 0, S = void 0;
    switch (b.cmd) {
      case "=":
        x = b.idx * 2, S = b.idx1 * 2;
        var A = y[x], M = y[x + 1], D = m[S], C = m[S + 1];
        (isNaN(A) || isNaN(M)) && (A = D, M = C), u.push(A, M), h.push(D, C), c.push(e[x], e[x + 1]), f.push(i[S], i[S + 1]), g.push(t.getRawIndex(b.idx1));
        break;
      case "+":
        var I = b.idx, L = p.dataDimsForPoint, P = n.dataToPoint([t.get(L[0], I), t.get(L[1], I)]);
        S = I * 2, u.push(P[0], P[1]), h.push(m[S], m[S + 1]);
        var E = Q_(p, n, t, I);
        c.push(E[0], E[1]), f.push(i[S], i[S + 1]), g.push(t.getRawIndex(I));
        break;
      case "-":
        w = !1;
    }
    w && (d.push(b), v.push(v.length));
  }
  v.sort(function(_t, Jt) {
    return g[_t] - g[Jt];
  });
  for (var R = u.length, Y = Je(R), O = Je(R), z = Je(R), Z = Je(R), J = [], _ = 0; _ < v.length; _++) {
    var it = v[_], ft = _ * 2, gt = it * 2;
    Y[ft] = u[gt], Y[ft + 1] = u[gt + 1], O[ft] = h[gt], O[ft + 1] = h[gt + 1], z[ft] = c[gt], z[ft + 1] = c[gt + 1], Z[ft] = f[gt], Z[ft + 1] = f[gt + 1], J[_] = d[it];
  }
  return {
    current: Y,
    next: O,
    stackedOnCurrent: z,
    stackedOnNext: Z,
    status: J
  };
}
var fr = Math.min, dr = Math.max;
function di(r, t) {
  return isNaN(r) || isNaN(t);
}
function Kh(r, t, e, i, n, a, o, s, l) {
  for (var u, h, c, f, d, v, g = e, p = 0; p < i; p++) {
    var y = t[g * 2], m = t[g * 2 + 1];
    if (g >= n || g < 0)
      break;
    if (di(y, m)) {
      if (l) {
        g += a;
        continue;
      }
      break;
    }
    if (g === e)
      r[a > 0 ? "moveTo" : "lineTo"](y, m), c = y, f = m;
    else {
      var _ = y - u, b = m - h;
      if (_ * _ + b * b < 0.5) {
        g += a;
        continue;
      }
      if (o > 0) {
        for (var w = g + a, x = t[w * 2], S = t[w * 2 + 1]; x === y && S === m && p < i; )
          p++, w += a, g += a, x = t[w * 2], S = t[w * 2 + 1], y = t[g * 2], m = t[g * 2 + 1], _ = y - u, b = m - h;
        var A = p + 1;
        if (l)
          for (; di(x, S) && A < i; )
            A++, w += a, x = t[w * 2], S = t[w * 2 + 1];
        var M = 0.5, D = 0, C = 0, I = void 0, L = void 0;
        if (A >= i || di(x, S))
          d = y, v = m;
        else {
          D = x - u, C = S - h;
          var P = y - u, E = x - y, R = m - h, Y = S - m, O = void 0, z = void 0;
          if (s === "x") {
            O = Math.abs(P), z = Math.abs(E);
            var Z = D > 0 ? 1 : -1;
            d = y - Z * O * o, v = m, I = y + Z * z * o, L = m;
          } else if (s === "y") {
            O = Math.abs(R), z = Math.abs(Y);
            var J = C > 0 ? 1 : -1;
            d = y, v = m - J * O * o, I = y, L = m + J * z * o;
          } else
            O = Math.sqrt(P * P + R * R), z = Math.sqrt(E * E + Y * Y), M = z / (z + O), d = y - D * o * (1 - M), v = m - C * o * (1 - M), I = y + D * o * M, L = m + C * o * M, I = fr(I, dr(x, y)), L = fr(L, dr(S, m)), I = dr(I, fr(x, y)), L = dr(L, fr(S, m)), D = I - y, C = L - m, d = y - D * O / z, v = m - C * O / z, d = fr(d, dr(u, y)), v = fr(v, dr(h, m)), d = dr(d, fr(u, y)), v = dr(v, fr(h, m)), D = y - d, C = m - v, I = y + D * z / O, L = m + C * z / O;
        }
        r.bezierCurveTo(c, f, d, v, y, m), c = I, f = L;
      } else
        r.lineTo(y, m);
    }
    u = y, h = m, g += a;
  }
  return p;
}
var J_ = (
  /** @class */
  /* @__PURE__ */ function() {
    function r() {
      this.smooth = 0, this.smoothConstraint = !0;
    }
    return r;
  }()
), fk = (
  /** @class */
  function(r) {
    N(t, r);
    function t(e) {
      var i = r.call(this, e) || this;
      return i.type = "ec-polyline", i;
    }
    return t.prototype.getDefaultStyle = function() {
      return {
        stroke: "#000",
        fill: null
      };
    }, t.prototype.getDefaultShape = function() {
      return new J_();
    }, t.prototype.buildPath = function(e, i) {
      var n = i.points, a = 0, o = n.length / 2;
      if (i.connectNulls) {
        for (; o > 0 && di(n[o * 2 - 2], n[o * 2 - 1]); o--)
          ;
        for (; a < o && di(n[a * 2], n[a * 2 + 1]); a++)
          ;
      }
      for (; a < o; )
        a += Kh(e, n, a, o, o, 1, i.smooth, i.smoothMonotone, i.connectNulls) + 1;
    }, t.prototype.getPointOn = function(e, i) {
      this.path || (this.createPathProxy(), this.buildPath(this.path, this.shape));
      for (var n = this.path, a = n.data, o = bi.CMD, s, l, u = i === "x", h = [], c = 0; c < a.length; ) {
        var f = a[c++], d = void 0, v = void 0, g = void 0, p = void 0, y = void 0, m = void 0, _ = void 0;
        switch (f) {
          case o.M:
            s = a[c++], l = a[c++];
            break;
          case o.L:
            if (d = a[c++], v = a[c++], _ = u ? (e - s) / (d - s) : (e - l) / (v - l), _ <= 1 && _ >= 0) {
              var b = u ? (v - l) * _ + l : (d - s) * _ + s;
              return u ? [e, b] : [b, e];
            }
            s = d, l = v;
            break;
          case o.C:
            d = a[c++], v = a[c++], g = a[c++], p = a[c++], y = a[c++], m = a[c++];
            var w = u ? ds(s, d, g, y, e, h) : ds(l, v, p, m, e, h);
            if (w > 0)
              for (var x = 0; x < w; x++) {
                var S = h[x];
                if (S <= 1 && S >= 0) {
                  var b = u ? $t(l, v, p, m, S) : $t(s, d, g, y, S);
                  return u ? [e, b] : [b, e];
                }
              }
            s = y, l = m;
            break;
        }
      }
    }, t;
  }(pt)
), dk = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t;
  }(J_)
), vk = (
  /** @class */
  function(r) {
    N(t, r);
    function t(e) {
      var i = r.call(this, e) || this;
      return i.type = "ec-polygon", i;
    }
    return t.prototype.getDefaultShape = function() {
      return new dk();
    }, t.prototype.buildPath = function(e, i) {
      var n = i.points, a = i.stackedOnPoints, o = 0, s = n.length / 2, l = i.smoothMonotone;
      if (i.connectNulls) {
        for (; s > 0 && di(n[s * 2 - 2], n[s * 2 - 1]); s--)
          ;
        for (; o < s && di(n[o * 2], n[o * 2 + 1]); o++)
          ;
      }
      for (; o < s; ) {
        var u = Kh(e, n, o, s, s, 1, i.smooth, l, i.connectNulls);
        Kh(e, a, o + u - 1, u, s, -1, i.stackedOnSmooth, l, i.connectNulls), o += u + 1, e.closePath();
      }
    }, t;
  }(pt)
);
function tb(r, t, e, i, n) {
  var a = r.getArea(), o = a.x, s = a.y, l = a.width, u = a.height, h = e.get(["lineStyle", "width"]) || 0;
  o -= h / 2, s -= h / 2, l += h, u += h, l = Math.ceil(l), o !== Math.floor(o) && (o = Math.floor(o), l++);
  var c = new Mt({
    shape: {
      x: o,
      y: s,
      width: l,
      height: u
    }
  });
  if (t) {
    var f = r.getBaseAxis(), d = f.isHorizontal(), v = f.inverse;
    d ? (v && (c.shape.x += l), c.shape.width = 0) : (v || (c.shape.y += u), c.shape.height = 0);
    var g = Q(n) ? function(p) {
      n(p, c);
    } : null;
    ir(c, {
      shape: {
        width: l,
        height: u,
        x: o,
        y: s
      }
    }, e, null, i, g);
  }
  return c;
}
function eb(r, t, e) {
  var i = r.getArea(), n = Lt(i.r0, 1), a = Lt(i.r, 1), o = new bn({
    shape: {
      cx: Lt(r.cx, 1),
      cy: Lt(r.cy, 1),
      r0: n,
      r: a,
      startAngle: i.startAngle,
      endAngle: i.endAngle,
      clockwise: i.clockwise
    }
  });
  if (t) {
    var s = r.getBaseAxis().dim === "angle";
    s ? o.shape.endAngle = i.startAngle : o.shape.r = n, ir(o, {
      shape: {
        endAngle: i.endAngle,
        r: a
      }
    }, e);
  }
  return o;
}
function pk(r, t, e, i, n) {
  if (r) {
    if (r.type === "polar")
      return eb(r, t, e);
    if (r.type === "cartesian2d")
      return tb(r, t, e, i, n);
  } else return null;
  return null;
}
function Qa(r, t) {
  return r.type === t;
}
function tg(r, t) {
  if (r.length === t.length) {
    for (var e = 0; e < r.length; e++)
      if (r[e] !== t[e])
        return;
    return !0;
  }
}
function eg(r) {
  for (var t = 1 / 0, e = 1 / 0, i = -1 / 0, n = -1 / 0, a = 0; a < r.length; ) {
    var o = r[a++], s = r[a++];
    isNaN(o) || (t = Math.min(o, t), i = Math.max(o, i)), isNaN(s) || (e = Math.min(s, e), n = Math.max(s, n));
  }
  return [[t, e], [i, n]];
}
function rg(r, t) {
  var e = eg(r), i = e[0], n = e[1], a = eg(t), o = a[0], s = a[1];
  return Math.max(Math.abs(i[0] - o[0]), Math.abs(i[1] - o[1]), Math.abs(n[0] - s[0]), Math.abs(n[1] - s[1]));
}
function ig(r) {
  return wt(r) ? r : r ? 0.5 : 0;
}
function gk(r, t, e) {
  if (!e.valueDim)
    return [];
  for (var i = t.count(), n = Je(i * 2), a = 0; a < i; a++) {
    var o = Q_(e, r, t, a);
    n[a * 2] = o[0], n[a * 2 + 1] = o[1];
  }
  return n;
}
function vr(r, t, e, i, n) {
  var a = e.getBaseAxis(), o = a.dim === "x" || a.dim === "radius" ? 0 : 1, s = [], l = 0, u = [], h = [], c = [], f = [];
  if (n) {
    for (l = 0; l < r.length; l += 2) {
      var d = t || r;
      !isNaN(d[l]) && !isNaN(d[l + 1]) && f.push(r[l], r[l + 1]);
    }
    r = f;
  }
  for (l = 0; l < r.length - 2; l += 2)
    switch (c[0] = r[l + 2], c[1] = r[l + 3], h[0] = r[l], h[1] = r[l + 1], s.push(h[0], h[1]), i) {
      case "end":
        u[o] = c[o], u[1 - o] = h[1 - o], s.push(u[0], u[1]);
        break;
      case "middle":
        var v = (h[o] + c[o]) / 2, g = [];
        u[o] = g[o] = v, u[1 - o] = h[1 - o], g[1 - o] = c[1 - o], s.push(u[0], u[1]), s.push(g[0], g[1]);
        break;
      default:
        u[o] = h[o], u[1 - o] = c[1 - o], s.push(u[0], u[1]);
    }
  return s.push(r[l++], r[l++]), s;
}
function yk(r, t) {
  var e = [], i = r.length, n, a;
  function o(h, c, f) {
    var d = h.coord, v = (f - d) / (c.coord - d), g = kx(v, [h.color, c.color]);
    return {
      coord: f,
      color: g
    };
  }
  for (var s = 0; s < i; s++) {
    var l = r[s], u = l.coord;
    if (u < 0)
      n = l;
    else if (u > t) {
      a ? e.push(o(a, l, t)) : n && e.push(o(n, l, 0), o(n, l, t));
      break;
    } else
      n && (e.push(o(n, l, 0)), n = null), e.push(l), a = l;
  }
  return e;
}
function mk(r, t, e) {
  var i = r.getVisual("visualMeta");
  if (!(!i || !i.length || !r.count()) && t.type === "cartesian2d") {
    for (var n, a, o = i.length - 1; o >= 0; o--) {
      var s = r.getDimensionInfo(i[o].dimension);
      if (n = s && s.coordDim, n === "x" || n === "y") {
        a = i[o];
        break;
      }
    }
    if (a) {
      var l = t.getAxis(n), u = H(a.stops, function(_) {
        return {
          coord: l.toGlobalCoord(l.dataToCoord(_.value)),
          color: _.color
        };
      }), h = u.length, c = a.outerColors.slice();
      h && u[0].coord > u[h - 1].coord && (u.reverse(), c.reverse());
      var f = yk(u, n === "x" ? e.getWidth() : e.getHeight()), d = f.length;
      if (!d && h)
        return u[0].coord < 0 ? c[1] ? c[1] : u[h - 1].color : c[0] ? c[0] : u[0].color;
      var v = 10, g = f[0].coord - v, p = f[d - 1].coord + v, y = p - g;
      if (y < 1e-3)
        return "transparent";
      T(f, function(_) {
        _.offset = (_.coord - g) / y;
      }), f.push({
        // NOTE: inRangeStopLen may still be 0 if stoplen is zero.
        offset: d ? f[d - 1].offset : 0.5,
        color: c[1] || "transparent"
      }), f.unshift({
        offset: d ? f[0].offset : 0.5,
        color: c[0] || "transparent"
      });
      var m = new Zm(0, 0, 0, 0, f, !0);
      return m[n] = g, m[n + "2"] = p, m;
    }
  }
}
function _k(r, t, e) {
  var i = r.get("showAllSymbol"), n = i === "auto";
  if (!(i && !n)) {
    var a = e.getAxesByScale("ordinal")[0];
    if (a && !(n && bk(a, t))) {
      var o = t.mapDimension(a.dim), s = {};
      return T(a.getViewLabels(), function(l) {
        var u = a.scale.getRawOrdinalNumber(l.tickValue);
        s[u] = 1;
      }), function(l) {
        return !s.hasOwnProperty(t.get(o, l));
      };
    }
  }
}
function bk(r, t) {
  var e = r.getExtent(), i = Math.abs(e[1] - e[0]) / r.scale.count();
  isNaN(i) && (i = 0);
  for (var n = t.count(), a = Math.max(1, Math.round(n / 5)), o = 0; o < n; o += a)
    if (Nf.getSymbolSize(
      t,
      o
      // Only for cartesian, where `isHorizontal` exists.
    )[r.isHorizontal() ? 1 : 0] * 1.5 > i)
      return !1;
  return !0;
}
function xk(r, t) {
  return isNaN(r) || isNaN(t);
}
function wk(r) {
  for (var t = r.length / 2; t > 0 && xk(r[t * 2 - 2], r[t * 2 - 1]); t--)
    ;
  return t - 1;
}
function ng(r, t) {
  return [r[t * 2], r[t * 2 + 1]];
}
function Sk(r, t, e) {
  for (var i = r.length / 2, n = e === "x" ? 0 : 1, a, o, s = 0, l = -1, u = 0; u < i; u++)
    if (o = r[u * 2 + n], !(isNaN(o) || isNaN(r[u * 2 + 1 - n]))) {
      if (u === 0) {
        a = o;
        continue;
      }
      if (a <= t && o >= t || a >= t && o <= t) {
        l = u;
        break;
      }
      s = u, a = o;
    }
  return {
    range: [s, l],
    t: (t - a) / (o - a)
  };
}
function rb(r) {
  if (r.get(["endLabel", "show"]))
    return !0;
  for (var t = 0; t < Ge.length; t++)
    if (r.get([Ge[t], "endLabel", "show"]))
      return !0;
  return !1;
}
function Eu(r, t, e, i) {
  if (Qa(t, "cartesian2d")) {
    var n = i.getModel("endLabel"), a = n.get("valueAnimation"), o = i.getData(), s = {
      lastFrameIndex: 0
    }, l = rb(i) ? function(d, v) {
      r._endLabelOnDuring(d, v, o, s, a, n, t);
    } : null, u = t.getBaseAxis().isHorizontal(), h = tb(t, e, i, function() {
      var d = r._endLabel;
      d && e && s.originalX != null && d.attr({
        x: s.originalX,
        y: s.originalY
      });
    }, l);
    if (!i.get("clip", !0)) {
      var c = h.shape, f = Math.max(c.width, c.height);
      u ? (c.y -= f, c.height += f * 2) : (c.x -= f, c.width += f * 2);
    }
    return l && l(1, h), h;
  } else
    return eb(t, e, i);
}
function Tk(r, t) {
  var e = t.getBaseAxis(), i = e.isHorizontal(), n = e.inverse, a = i ? n ? "right" : "left" : "center", o = i ? "middle" : n ? "top" : "bottom";
  return {
    normal: {
      align: r.get("align") || a,
      verticalAlign: r.get("verticalAlign") || o
    }
  };
}
var Ck = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.prototype.init = function() {
      var e = new St(), i = new lk();
      this.group.add(i.group), this._symbolDraw = i, this._lineGroup = e, this._changePolyState = at(this._changePolyState, this);
    }, t.prototype.render = function(e, i, n) {
      var a = e.coordinateSystem, o = this.group, s = e.getData(), l = e.getModel("lineStyle"), u = e.getModel("areaStyle"), h = s.getLayout("points") || [], c = a.type === "polar", f = this._coordSys, d = this._symbolDraw, v = this._polyline, g = this._polygon, p = this._lineGroup, y = !i.ssr && e.get("animation"), m = !u.isEmpty(), _ = u.get("origin"), b = j_(a, s, _), w = m && gk(a, s, b), x = e.get("showSymbol"), S = e.get("connectNulls"), A = x && !c && _k(e, s, a), M = this._data;
      M && M.eachItemGraphicEl(function(_t, Jt) {
        _t.__temp && (o.remove(_t), M.setItemGraphicEl(Jt, null));
      }), x || d.remove(), o.add(p);
      var D = c ? !1 : e.get("step"), C;
      a && a.getArea && e.get("clip", !0) && (C = a.getArea(), C.width != null ? (C.x -= 0.1, C.y -= 0.1, C.width += 0.2, C.height += 0.2) : C.r0 && (C.r0 -= 0.5, C.r += 0.5)), this._clipShapeForSymbol = C;
      var I = mk(s, a, n) || s.getVisual("style")[s.getVisual("drawType")];
      if (!(v && f.type === a.type && D === this._step))
        x && d.updateData(s, {
          isIgnore: A,
          clipShape: C,
          disableAnimation: !0,
          getSymbolPoint: function(_t) {
            return [h[_t * 2], h[_t * 2 + 1]];
          }
        }), y && this._initSymbolLabelAnimation(s, a, C), D && (w && (w = vr(w, h, a, D, S)), h = vr(h, null, a, D, S)), v = this._newPolyline(h), m ? g = this._newPolygon(h, w) : g && (p.remove(g), g = this._polygon = null), c || this._initOrUpdateEndLabel(e, a, wi(I)), p.setClipPath(Eu(this, a, !0, e));
      else {
        m && !g ? g = this._newPolygon(h, w) : g && !m && (p.remove(g), g = this._polygon = null), c || this._initOrUpdateEndLabel(e, a, wi(I));
        var L = p.getClipPath();
        if (L) {
          var P = Eu(this, a, !1, e);
          ir(L, {
            shape: P.shape
          }, e);
        } else
          p.setClipPath(Eu(this, a, !0, e));
        x && d.updateData(s, {
          isIgnore: A,
          clipShape: C,
          disableAnimation: !0,
          getSymbolPoint: function(_t) {
            return [h[_t * 2], h[_t * 2 + 1]];
          }
        }), (!tg(this._stackedOnPoints, w) || !tg(this._points, h)) && (y ? this._doUpdateAnimation(s, w, a, n, D, _, S) : (D && (w && (w = vr(w, h, a, D, S)), h = vr(h, null, a, D, S)), v.setShape({
          points: h
        }), g && g.setShape({
          points: h,
          stackedOnPoints: w
        })));
      }
      var E = e.getModel("emphasis"), R = E.get("focus"), Y = E.get("blurScope"), O = E.get("disabled");
      if (v.useStyle(ht(
        // Use color in lineStyle first
        l.getLineStyle(),
        {
          fill: "none",
          stroke: I,
          lineJoin: "bevel"
        }
      )), Cs(v, e, "lineStyle"), v.style.lineWidth > 0 && e.get(["emphasis", "lineStyle", "width"]) === "bolder") {
        var z = v.getState("emphasis").style;
        z.lineWidth = +v.style.lineWidth + 1;
      }
      lt(v).seriesIndex = e.seriesIndex, hn(v, R, Y, O);
      var Z = ig(e.get("smooth")), J = e.get("smoothMonotone");
      if (v.setShape({
        smooth: Z,
        smoothMonotone: J,
        connectNulls: S
      }), g) {
        var it = s.getCalculationInfo("stackedOnSeries"), ft = 0;
        g.useStyle(ht(u.getAreaStyle(), {
          fill: I,
          opacity: 0.7,
          lineJoin: "bevel",
          decal: s.getVisual("style").decal
        })), it && (ft = ig(it.get("smooth"))), g.setShape({
          smooth: Z,
          stackedOnSmooth: ft,
          smoothMonotone: J,
          connectNulls: S
        }), Cs(g, e, "areaStyle"), lt(g).seriesIndex = e.seriesIndex, hn(g, R, Y, O);
      }
      var gt = this._changePolyState;
      s.eachItemGraphicEl(function(_t) {
        _t && (_t.onHoverStateChange = gt);
      }), this._polyline.onHoverStateChange = gt, this._data = s, this._coordSys = a, this._stackedOnPoints = w, this._points = h, this._step = D, this._valueOrigin = _, e.get("triggerLineEvent") && (this.packEventData(e, v), g && this.packEventData(e, g));
    }, t.prototype.packEventData = function(e, i) {
      lt(i).eventData = {
        componentType: "series",
        componentSubType: "line",
        componentIndex: e.componentIndex,
        seriesIndex: e.seriesIndex,
        seriesName: e.name,
        seriesType: "line"
      };
    }, t.prototype.highlight = function(e, i, n, a) {
      var o = e.getData(), s = _i(o, a);
      if (this._changePolyState("emphasis"), !(s instanceof Array) && s != null && s >= 0) {
        var l = o.getLayout("points"), u = o.getItemGraphicEl(s);
        if (!u) {
          var h = l[s * 2], c = l[s * 2 + 1];
          if (isNaN(h) || isNaN(c) || this._clipShapeForSymbol && !this._clipShapeForSymbol.contain(h, c))
            return;
          var f = e.get("zlevel") || 0, d = e.get("z") || 0;
          u = new Nf(o, s), u.x = h, u.y = c, u.setZ(f, d);
          var v = u.getSymbolPath().getTextContent();
          v && (v.zlevel = f, v.z = d, v.z2 = this._polyline.z2 + 1), u.__temp = !0, o.setItemGraphicEl(s, u), u.stopSymbolAnimation(!0), this.group.add(u);
        }
        u.highlight();
      } else
        me.prototype.highlight.call(this, e, i, n, a);
    }, t.prototype.downplay = function(e, i, n, a) {
      var o = e.getData(), s = _i(o, a);
      if (this._changePolyState("normal"), s != null && s >= 0) {
        var l = o.getItemGraphicEl(s);
        l && (l.__temp ? (o.setItemGraphicEl(s, null), this.group.remove(l)) : l.downplay());
      } else
        me.prototype.downplay.call(this, e, i, n, a);
    }, t.prototype._changePolyState = function(e) {
      var i = this._polygon;
      dv(this._polyline, e), i && dv(i, e);
    }, t.prototype._newPolyline = function(e) {
      var i = this._polyline;
      return i && this._lineGroup.remove(i), i = new fk({
        shape: {
          points: e
        },
        segmentIgnoreThreshold: 2,
        z2: 10
      }), this._lineGroup.add(i), this._polyline = i, i;
    }, t.prototype._newPolygon = function(e, i) {
      var n = this._polygon;
      return n && this._lineGroup.remove(n), n = new vk({
        shape: {
          points: e,
          stackedOnPoints: i
        },
        segmentIgnoreThreshold: 2
      }), this._lineGroup.add(n), this._polygon = n, n;
    }, t.prototype._initSymbolLabelAnimation = function(e, i, n) {
      var a, o, s = i.getBaseAxis(), l = s.inverse;
      i.type === "cartesian2d" ? (a = s.isHorizontal(), o = !1) : i.type === "polar" && (a = s.dim === "angle", o = !0);
      var u = e.hostModel, h = u.get("animationDuration");
      Q(h) && (h = h(null));
      var c = u.get("animationDelay") || 0, f = Q(c) ? c(null) : c;
      e.eachItemGraphicEl(function(d, v) {
        var g = d;
        if (g) {
          var p = [d.x, d.y], y = void 0, m = void 0, _ = void 0;
          if (n)
            if (o) {
              var b = n, w = i.pointToCoord(p);
              a ? (y = b.startAngle, m = b.endAngle, _ = -w[1] / 180 * Math.PI) : (y = b.r0, m = b.r, _ = w[0]);
            } else {
              var x = n;
              a ? (y = x.x, m = x.x + x.width, _ = d.x) : (y = x.y + x.height, m = x.y, _ = d.y);
            }
          var S = m === y ? 0 : (_ - y) / (m - y);
          l && (S = 1 - S);
          var A = Q(c) ? c(v) : h * S + f, M = g.getSymbolPath(), D = M.getTextContent();
          g.attr({
            scaleX: 0,
            scaleY: 0
          }), g.animateTo({
            scaleX: 1,
            scaleY: 1
          }, {
            duration: 200,
            setToFinal: !0,
            delay: A
          }), D && D.animateFrom({
            style: {
              opacity: 0
            }
          }, {
            duration: 300,
            delay: A
          }), M.disableLabelAnimation = !0;
        }
      });
    }, t.prototype._initOrUpdateEndLabel = function(e, i, n) {
      var a = e.getModel("endLabel");
      if (rb(e)) {
        var o = e.getData(), s = this._polyline, l = o.getLayout("points");
        if (!l) {
          s.removeTextContent(), this._endLabel = null;
          return;
        }
        var u = this._endLabel;
        u || (u = this._endLabel = new Ht({
          z2: 200
          // should be higher than item symbol
        }), u.ignoreClip = !0, s.setTextContent(this._endLabel), s.disableLabelAnimation = !0);
        var h = wk(l);
        h >= 0 && (xn(s, wn(e, "endLabel"), {
          inheritColor: n,
          labelFetcher: e,
          labelDataIndex: h,
          defaultText: function(c, f, d) {
            return d != null ? K_(o, d) : Of(o, c);
          },
          enableTextSetter: !0
        }, Tk(a, i)), s.textConfig.position = null);
      } else this._endLabel && (this._polyline.removeTextContent(), this._endLabel = null);
    }, t.prototype._endLabelOnDuring = function(e, i, n, a, o, s, l) {
      var u = this._endLabel, h = this._polyline;
      if (u) {
        e < 1 && a.originalX == null && (a.originalX = u.x, a.originalY = u.y);
        var c = n.getLayout("points"), f = n.hostModel, d = f.get("connectNulls"), v = s.get("precision"), g = s.get("distance") || 0, p = l.getBaseAxis(), y = p.isHorizontal(), m = p.inverse, _ = i.shape, b = m ? y ? _.x : _.y + _.height : y ? _.x + _.width : _.y, w = (y ? g : 0) * (m ? -1 : 1), x = (y ? 0 : -g) * (m ? -1 : 1), S = y ? "x" : "y", A = Sk(c, b, S), M = A.range, D = M[1] - M[0], C = void 0;
        if (D >= 1) {
          if (D > 1 && !d) {
            var I = ng(c, M[0]);
            u.attr({
              x: I[0] + w,
              y: I[1] + x
            }), o && (C = f.getRawValue(M[0]));
          } else {
            var I = h.getPointOn(b, S);
            I && u.attr({
              x: I[0] + w,
              y: I[1] + x
            });
            var L = f.getRawValue(M[0]), P = f.getRawValue(M[1]);
            o && (C = Tw(n, v, L, P, A.t));
          }
          a.lastFrameIndex = M[0];
        } else {
          var E = e === 1 || a.lastFrameIndex > 0 ? M[0] : 0, I = ng(c, E);
          o && (C = f.getRawValue(E)), u.attr({
            x: I[0] + w,
            y: I[1] + x
          });
        }
        if (o) {
          var R = sl(u);
          typeof R.setLabelText == "function" && R.setLabelText(C);
        }
      }
    }, t.prototype._doUpdateAnimation = function(e, i, n, a, o, s, l) {
      var u = this._polyline, h = this._polygon, c = e.hostModel, f = ck(this._data, e, this._stackedOnPoints, i, this._coordSys, n, this._valueOrigin), d = f.current, v = f.stackedOnCurrent, g = f.next, p = f.stackedOnNext;
      if (o && (v = vr(f.stackedOnCurrent, f.current, n, o, l), d = vr(f.current, null, n, o, l), p = vr(f.stackedOnNext, f.next, n, o, l), g = vr(f.next, null, n, o, l)), rg(d, g) > 3e3 || h && rg(v, p) > 3e3) {
        u.stopAnimation(), u.setShape({
          points: g
        }), h && (h.stopAnimation(), h.setShape({
          points: g,
          stackedOnPoints: p
        }));
        return;
      }
      u.shape.__points = f.current, u.shape.points = d;
      var y = {
        shape: {
          points: g
        }
      };
      f.current !== d && (y.shape.__points = f.next), u.stopAnimation(), jt(u, y, c), h && (h.setShape({
        // Reuse the points with polyline.
        points: d,
        stackedOnPoints: v
      }), h.stopAnimation(), jt(h, {
        shape: {
          stackedOnPoints: p
        }
      }, c), u.shape.points !== h.shape.points && (h.shape.points = u.shape.points));
      for (var m = [], _ = f.status, b = 0; b < _.length; b++) {
        var w = _[b].cmd;
        if (w === "=") {
          var x = e.getItemGraphicEl(_[b].idx1);
          x && m.push({
            el: x,
            ptIdx: b
            // Index of points
          });
        }
      }
      u.animators && u.animators.length && u.animators[0].during(function() {
        h && h.dirtyShape();
        for (var S = u.shape.__points, A = 0; A < m.length; A++) {
          var M = m[A].el, D = m[A].ptIdx * 2;
          M.x = S[D], M.y = S[D + 1], M.markRedraw();
        }
      });
    }, t.prototype.remove = function(e) {
      var i = this.group, n = this._data;
      this._lineGroup.removeAll(), this._symbolDraw.remove(!0), n && n.eachItemGraphicEl(function(a, o) {
        a.__temp && (i.remove(a), n.setItemGraphicEl(o, null));
      }), this._polyline = this._polygon = this._coordSys = this._points = this._stackedOnPoints = this._endLabel = this._data = null;
    }, t.type = "line", t;
  }(me)
);
function Ak(r, t) {
  return {
    seriesType: r,
    plan: xf(),
    reset: function(e) {
      var i = e.getData(), n = e.coordinateSystem;
      if (e.pipelineContext, !!n) {
        var a = H(n.dimensions, function(c) {
          return i.mapDimension(c);
        }).slice(0, 2), o = a.length, s = i.getCalculationInfo("stackResultDimension");
        Si(i, a[0]) && (a[0] = s), Si(i, a[1]) && (a[1] = s);
        var l = i.getStore(), u = i.getDimensionIndex(a[0]), h = i.getDimensionIndex(a[1]);
        return o && {
          progress: function(c, f) {
            for (var d = c.end - c.start, v = Je(d * o), g = [], p = [], y = c.start, m = 0; y < c.end; y++) {
              var _ = void 0;
              if (o === 1) {
                var b = l.get(u, y);
                _ = n.dataToPoint(b, null, p);
              } else
                g[0] = l.get(u, y), g[1] = l.get(h, y), _ = n.dataToPoint(g, null, p);
              v[m++] = _[0], v[m++] = _[1];
            }
            f.setLayout("points", v);
          }
        };
      }
    }
  };
}
var Mk = {
  average: function(r) {
    for (var t = 0, e = 0, i = 0; i < r.length; i++)
      isNaN(r[i]) || (t += r[i], e++);
    return e === 0 ? NaN : t / e;
  },
  sum: function(r) {
    for (var t = 0, e = 0; e < r.length; e++)
      t += r[e] || 0;
    return t;
  },
  max: function(r) {
    for (var t = -1 / 0, e = 0; e < r.length; e++)
      r[e] > t && (t = r[e]);
    return isFinite(t) ? t : NaN;
  },
  min: function(r) {
    for (var t = 1 / 0, e = 0; e < r.length; e++)
      r[e] < t && (t = r[e]);
    return isFinite(t) ? t : NaN;
  },
  // TODO
  // Median
  nearest: function(r) {
    return r[0];
  }
}, Dk = function(r) {
  return Math.round(r.length / 2);
};
function ib(r) {
  return {
    seriesType: r,
    // FIXME:TS never used, so comment it
    // modifyOutputEnd: true,
    reset: function(t, e, i) {
      var n = t.getData(), a = t.get("sampling"), o = t.coordinateSystem, s = n.count();
      if (s > 10 && o.type === "cartesian2d" && a) {
        var l = o.getBaseAxis(), u = o.getOtherAxis(l), h = l.getExtent(), c = i.getDevicePixelRatio(), f = Math.abs(h[1] - h[0]) * (c || 1), d = Math.round(s / f);
        if (isFinite(d) && d > 1) {
          a === "lttb" ? t.setData(n.lttbDownSample(n.mapDimension(u.dim), 1 / d)) : a === "minmax" && t.setData(n.minmaxDownSample(n.mapDimension(u.dim), 1 / d));
          var v = void 0;
          V(a) ? v = Mk[a] : Q(a) && (v = a), v && t.setData(n.downSample(n.mapDimension(u.dim), 1 / d, v, Dk));
        }
      }
    }
  };
}
function kk(r) {
  r.registerChartView(Ck), r.registerSeriesModel(ok), r.registerLayout(Ak("line")), r.registerVisual({
    seriesType: "line",
    reset: function(t) {
      var e = t.getData(), i = t.getModel("lineStyle").getLineStyle();
      i && !i.stroke && (i.stroke = e.getVisual("style").fill), e.setVisual("legendLineStyle", i);
    }
  }), r.registerProcessor(r.PRIORITY.PROCESSOR.STATISTIC, ib("line"));
}
var jh = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e;
    }
    return t.prototype.getInitialData = function(e, i) {
      return If(null, this, {
        useEncodeDefaulter: !0
      });
    }, t.prototype.getMarkerPosition = function(e, i, n) {
      var a = this.coordinateSystem;
      if (a && a.clampData) {
        var o = a.clampData(e), s = a.dataToPoint(o);
        if (n)
          T(a.getAxes(), function(f, d) {
            if (f.type === "category" && i != null) {
              var v = f.getTicksCoords(), g = f.getTickModel().get("alignWithLabel"), p = o[d], y = i[d] === "x1" || i[d] === "y1";
              if (y && !g && (p += 1), v.length < 2)
                return;
              if (v.length === 2) {
                s[d] = f.toGlobalCoord(f.getExtent()[y ? 1 : 0]);
                return;
              }
              for (var m = void 0, _ = void 0, b = 1, w = 0; w < v.length; w++) {
                var x = v[w].coord, S = w === v.length - 1 ? v[w - 1].tickValue + b : v[w].tickValue;
                if (S === p) {
                  _ = x;
                  break;
                } else if (S < p)
                  m = x;
                else if (m != null && S > p) {
                  _ = (x + m) / 2;
                  break;
                }
                w === 1 && (b = S - v[0].tickValue);
              }
              _ == null && (m ? m && (_ = v[v.length - 1].coord) : _ = v[0].coord), s[d] = f.toGlobalCoord(_);
            }
          });
        else {
          var l = this.getData(), u = l.getLayout("offset"), h = l.getLayout("size"), c = a.getBaseAxis().isHorizontal() ? 0 : 1;
          s[c] += u + h / 2;
        }
        return s;
      }
      return [NaN, NaN];
    }, t.type = "series.__base_bar__", t.defaultOption = {
      // zlevel: 0,
      z: 2,
      coordinateSystem: "cartesian2d",
      legendHoverLink: !0,
      // stack: null
      // Cartesian coordinate system
      // xAxisIndex: 0,
      // yAxisIndex: 0,
      barMinHeight: 0,
      barMinAngle: 0,
      // cursor: null,
      large: !1,
      largeThreshold: 400,
      progressive: 3e3,
      progressiveChunkMode: "mod"
    }, t;
  }(Ie)
);
Ie.registerClass(jh);
var Ik = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e;
    }
    return t.prototype.getInitialData = function() {
      return If(null, this, {
        useEncodeDefaulter: !0,
        createInvertedIndices: !!this.get("realtimeSort", !0) || null
      });
    }, t.prototype.getProgressive = function() {
      return this.get("large") ? this.get("progressive") : !1;
    }, t.prototype.getProgressiveThreshold = function() {
      var e = this.get("progressiveThreshold"), i = this.get("largeThreshold");
      return i > e && (e = i), e;
    }, t.prototype.brushSelector = function(e, i, n) {
      return n.rect(i.getItemLayout(e));
    }, t.type = "series.bar", t.dependencies = ["grid", "polar"], t.defaultOption = a0(jh.defaultOption, {
      // If clipped
      // Only available on cartesian2d
      clip: !0,
      roundCap: !1,
      showBackground: !1,
      backgroundStyle: {
        color: "rgba(180, 180, 180, 0.2)",
        borderColor: null,
        borderWidth: 0,
        borderType: "solid",
        borderRadius: 0,
        shadowBlur: 0,
        shadowColor: null,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        opacity: 1
      },
      select: {
        itemStyle: {
          borderColor: "#212121"
        }
      },
      realtimeSort: !1
    }), t;
  }(jh)
), Lk = (
  /** @class */
  /* @__PURE__ */ function() {
    function r() {
      this.cx = 0, this.cy = 0, this.r0 = 0, this.r = 0, this.startAngle = 0, this.endAngle = Math.PI * 2, this.clockwise = !0;
    }
    return r;
  }()
), ag = (
  /** @class */
  function(r) {
    N(t, r);
    function t(e) {
      var i = r.call(this, e) || this;
      return i.type = "sausage", i;
    }
    return t.prototype.getDefaultShape = function() {
      return new Lk();
    }, t.prototype.buildPath = function(e, i) {
      var n = i.cx, a = i.cy, o = Math.max(i.r0 || 0, 0), s = Math.max(i.r, 0), l = (s - o) * 0.5, u = o + l, h = i.startAngle, c = i.endAngle, f = i.clockwise, d = Math.PI * 2, v = f ? c - h < d : h - c < d;
      v || (h = c - (f ? d : -d));
      var g = Math.cos(h), p = Math.sin(h), y = Math.cos(c), m = Math.sin(c);
      v ? (e.moveTo(g * o + n, p * o + a), e.arc(g * u + n, p * u + a, l, -Math.PI + h, h, !f)) : e.moveTo(g * s + n, p * s + a), e.arc(n, a, s, h, c, !f), e.arc(y * u + n, m * u + a, l, c - Math.PI * 2, c - Math.PI, !f), o !== 0 && e.arc(n, a, o, c, h, f);
    }, t;
  }(pt)
);
function Pk(r, t) {
  t = t || {};
  var e = t.isRoundCap;
  return function(i, n, a) {
    var o = n.position;
    if (!o || o instanceof Array)
      return _s(i, n, a);
    var s = r(o), l = n.distance != null ? n.distance : 5, u = this.shape, h = u.cx, c = u.cy, f = u.r, d = u.r0, v = (f + d) / 2, g = u.startAngle, p = u.endAngle, y = (g + p) / 2, m = e ? Math.abs(f - d) / 2 : 0, _ = Math.cos, b = Math.sin, w = h + f * _(g), x = c + f * b(g), S = "left", A = "top";
    switch (s) {
      case "startArc":
        w = h + (d - l) * _(y), x = c + (d - l) * b(y), S = "center", A = "top";
        break;
      case "insideStartArc":
        w = h + (d + l) * _(y), x = c + (d + l) * b(y), S = "center", A = "bottom";
        break;
      case "startAngle":
        w = h + v * _(g) + Ro(g, l + m, !1), x = c + v * b(g) + $o(g, l + m, !1), S = "right", A = "middle";
        break;
      case "insideStartAngle":
        w = h + v * _(g) + Ro(g, -l + m, !1), x = c + v * b(g) + $o(g, -l + m, !1), S = "left", A = "middle";
        break;
      case "middle":
        w = h + v * _(y), x = c + v * b(y), S = "center", A = "middle";
        break;
      case "endArc":
        w = h + (f + l) * _(y), x = c + (f + l) * b(y), S = "center", A = "bottom";
        break;
      case "insideEndArc":
        w = h + (f - l) * _(y), x = c + (f - l) * b(y), S = "center", A = "top";
        break;
      case "endAngle":
        w = h + v * _(p) + Ro(p, l + m, !0), x = c + v * b(p) + $o(p, l + m, !0), S = "left", A = "middle";
        break;
      case "insideEndAngle":
        w = h + v * _(p) + Ro(p, -l + m, !0), x = c + v * b(p) + $o(p, -l + m, !0), S = "right", A = "middle";
        break;
      default:
        return _s(i, n, a);
    }
    return i = i || {}, i.x = w, i.y = x, i.align = S, i.verticalAlign = A, i;
  };
}
function Ek(r, t, e, i) {
  if (wt(i)) {
    r.setTextConfig({
      rotation: i
    });
    return;
  } else if (B(t)) {
    r.setTextConfig({
      rotation: 0
    });
    return;
  }
  var n = r.shape, a = n.clockwise ? n.startAngle : n.endAngle, o = n.clockwise ? n.endAngle : n.startAngle, s = (a + o) / 2, l, u = e(t);
  switch (u) {
    case "startArc":
    case "insideStartArc":
    case "middle":
    case "insideEndArc":
    case "endArc":
      l = s;
      break;
    case "startAngle":
    case "insideStartAngle":
      l = a;
      break;
    case "endAngle":
    case "insideEndAngle":
      l = o;
      break;
    default:
      r.setTextConfig({
        rotation: 0
      });
      return;
  }
  var h = Math.PI * 1.5 - l;
  u === "middle" && h > Math.PI / 2 && h < Math.PI * 1.5 && (h -= Math.PI), r.setTextConfig({
    rotation: h
  });
}
function Ro(r, t, e) {
  return t * Math.sin(r) * (e ? -1 : 1);
}
function $o(r, t, e) {
  return t * Math.cos(r) * (e ? 1 : -1);
}
function Rk(r, t, e) {
  var i = r.get("borderRadius");
  if (i == null)
    return {
      cornerRadius: 0
    };
  B(i) || (i = [i, i, i, i]);
  var n = Math.abs(t.r || 0 - t.r0 || 0);
  return {
    cornerRadius: H(i, function(a) {
      return Cr(a, n);
    })
  };
}
var Ru = Math.max, $u = Math.min;
function $k(r, t) {
  var e = r.getArea && r.getArea();
  if (Qa(r, "cartesian2d")) {
    var i = r.getBaseAxis();
    if (i.type !== "category" || !i.onBand) {
      var n = t.getLayout("bandWidth");
      i.isHorizontal() ? (e.x -= n, e.width += n * 2) : (e.y -= n, e.height += n * 2);
    }
  }
  return e;
}
var Ok = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r.call(this) || this;
      return e.type = t.type, e._isFirstFrame = !0, e;
    }
    return t.prototype.render = function(e, i, n, a) {
      this._model = e, this._removeOnRenderedListener(n), this._updateDrawMode(e);
      var o = e.get("coordinateSystem");
      (o === "cartesian2d" || o === "polar") && (this._progressiveEls = null, this._isLargeDraw ? this._renderLarge(e, i, n) : this._renderNormal(e, i, n, a));
    }, t.prototype.incrementalPrepareRender = function(e) {
      this._clear(), this._updateDrawMode(e), this._updateLargeClip(e);
    }, t.prototype.incrementalRender = function(e, i) {
      this._progressiveEls = [], this._incrementalRenderLarge(e, i);
    }, t.prototype.eachRendered = function(e) {
      al(this._progressiveEls || this.group, e);
    }, t.prototype._updateDrawMode = function(e) {
      var i = e.pipelineContext.large;
      (this._isLargeDraw == null || i !== this._isLargeDraw) && (this._isLargeDraw = i, this._clear());
    }, t.prototype._renderNormal = function(e, i, n, a) {
      var o = this.group, s = e.getData(), l = this._data, u = e.coordinateSystem, h = u.getBaseAxis(), c;
      u.type === "cartesian2d" ? c = h.isHorizontal() : u.type === "polar" && (c = h.dim === "angle");
      var f = e.isAnimationEnabled() ? e : null, d = Nk(e, u);
      d && this._enableRealtimeSort(d, s, n);
      var v = e.get("clip", !0) || d, g = $k(u, s);
      o.removeClipPath();
      var p = e.get("roundCap", !0), y = e.get("showBackground", !0), m = e.getModel("backgroundStyle"), _ = m.get("borderRadius") || 0, b = [], w = this._backgroundEls, x = a && a.isInitSort, S = a && a.type === "changeAxisOrder";
      function A(C) {
        var I = Oo[u.type](s, C), L = Wk(u, c, I);
        return L.useStyle(m.getItemStyle()), u.type === "cartesian2d" ? L.setShape("r", _) : L.setShape("cornerRadius", _), b[C] = L, L;
      }
      s.diff(l).add(function(C) {
        var I = s.getItemModel(C), L = Oo[u.type](s, C, I);
        if (y && A(C), !(!s.hasValue(C) || !hg[u.type](L))) {
          var P = !1;
          v && (P = og[u.type](g, L));
          var E = sg[u.type](e, s, C, L, c, f, h.model, !1, p);
          d && (E.forceLabelAnimation = !0), cg(E, s, C, I, L, e, c, u.type === "polar"), x ? E.attr({
            shape: L
          }) : d ? lg(d, f, E, L, C, c, !1, !1) : ir(E, {
            shape: L
          }, e, C), s.setItemGraphicEl(C, E), o.add(E), E.ignore = P;
        }
      }).update(function(C, I) {
        var L = s.getItemModel(C), P = Oo[u.type](s, C, L);
        if (y) {
          var E = void 0;
          w.length === 0 ? E = A(I) : (E = w[I], E.useStyle(m.getItemStyle()), u.type === "cartesian2d" ? E.setShape("r", _) : E.setShape("cornerRadius", _), b[C] = E);
          var R = Oo[u.type](s, C), Y = ab(c, R, u);
          jt(E, {
            shape: Y
          }, f, C);
        }
        var O = l.getItemGraphicEl(I);
        if (!s.hasValue(C) || !hg[u.type](P)) {
          o.remove(O);
          return;
        }
        var z = !1;
        if (v && (z = og[u.type](g, P), z && o.remove(O)), O ? qm(O) : O = sg[u.type](e, s, C, P, c, f, h.model, !!O, p), d && (O.forceLabelAnimation = !0), S) {
          var Z = O.getTextContent();
          if (Z) {
            var J = sl(Z);
            J.prevValue != null && (J.prevValue = J.value);
          }
        } else
          cg(O, s, C, L, P, e, c, u.type === "polar");
        x ? O.attr({
          shape: P
        }) : d ? lg(d, f, O, P, C, c, !0, S) : jt(O, {
          shape: P
        }, e, C, null), s.setItemGraphicEl(C, O), O.ignore = z, o.add(O);
      }).remove(function(C) {
        var I = l.getItemGraphicEl(C);
        I && Lh(I, e, C);
      }).execute();
      var M = this._backgroundGroup || (this._backgroundGroup = new St());
      M.removeAll();
      for (var D = 0; D < b.length; ++D)
        M.add(b[D]);
      o.add(M), this._backgroundEls = b, this._data = s;
    }, t.prototype._renderLarge = function(e, i, n) {
      this._clear(), dg(e, this.group), this._updateLargeClip(e);
    }, t.prototype._incrementalRenderLarge = function(e, i) {
      this._removeBackground(), dg(i, this.group, this._progressiveEls, !0);
    }, t.prototype._updateLargeClip = function(e) {
      var i = e.get("clip", !0) && pk(e.coordinateSystem, !1, e), n = this.group;
      i ? n.setClipPath(i) : n.removeClipPath();
    }, t.prototype._enableRealtimeSort = function(e, i, n) {
      var a = this;
      if (i.count()) {
        var o = e.baseAxis;
        if (this._isFirstFrame)
          this._dispatchInitSort(i, e, n), this._isFirstFrame = !1;
        else {
          var s = function(l) {
            var u = i.getItemGraphicEl(l), h = u && u.shape;
            return h && // The result should be consistent with the initial sort by data value.
            // Do not support the case that both positive and negative exist.
            Math.abs(o.isHorizontal() ? h.height : h.width) || 0;
          };
          this._onRendered = function() {
            a._updateSortWithinSameData(i, s, o, n);
          }, n.getZr().on("rendered", this._onRendered);
        }
      }
    }, t.prototype._dataSort = function(e, i, n) {
      var a = [];
      return e.each(e.mapDimension(i.dim), function(o, s) {
        var l = n(s);
        l = l ?? NaN, a.push({
          dataIndex: s,
          mappedValue: l,
          ordinalNumber: o
        });
      }), a.sort(function(o, s) {
        return s.mappedValue - o.mappedValue;
      }), {
        ordinalNumbers: H(a, function(o) {
          return o.ordinalNumber;
        })
      };
    }, t.prototype._isOrderChangedWithinSameData = function(e, i, n) {
      for (var a = n.scale, o = e.mapDimension(n.dim), s = Number.MAX_VALUE, l = 0, u = a.getOrdinalMeta().categories.length; l < u; ++l) {
        var h = e.rawIndexOf(o, a.getRawOrdinalNumber(l)), c = h < 0 ? Number.MIN_VALUE : i(e.indexOfRawIndex(h));
        if (c > s)
          return !0;
        s = c;
      }
      return !1;
    }, t.prototype._isOrderDifferentInView = function(e, i) {
      for (var n = i.scale, a = n.getExtent(), o = Math.max(0, a[0]), s = Math.min(a[1], n.getOrdinalMeta().categories.length - 1); o <= s; ++o)
        if (e.ordinalNumbers[o] !== n.getRawOrdinalNumber(o))
          return !0;
    }, t.prototype._updateSortWithinSameData = function(e, i, n, a) {
      if (this._isOrderChangedWithinSameData(e, i, n)) {
        var o = this._dataSort(e, n, i);
        this._isOrderDifferentInView(o, n) && (this._removeOnRenderedListener(a), a.dispatchAction({
          type: "changeAxisOrder",
          componentType: n.dim + "Axis",
          axisId: n.index,
          sortInfo: o
        }));
      }
    }, t.prototype._dispatchInitSort = function(e, i, n) {
      var a = i.baseAxis, o = this._dataSort(e, a, function(s) {
        return e.get(e.mapDimension(i.otherAxis.dim), s);
      });
      n.dispatchAction({
        type: "changeAxisOrder",
        componentType: a.dim + "Axis",
        isInitSort: !0,
        axisId: a.index,
        sortInfo: o
      });
    }, t.prototype.remove = function(e, i) {
      this._clear(this._model), this._removeOnRenderedListener(i);
    }, t.prototype.dispose = function(e, i) {
      this._removeOnRenderedListener(i);
    }, t.prototype._removeOnRenderedListener = function(e) {
      this._onRendered && (e.getZr().off("rendered", this._onRendered), this._onRendered = null);
    }, t.prototype._clear = function(e) {
      var i = this.group, n = this._data;
      e && e.isAnimationEnabled() && n && !this._isLargeDraw ? (this._removeBackground(), this._backgroundEls = [], n.eachItemGraphicEl(function(a) {
        Lh(a, e, lt(a).dataIndex);
      })) : i.removeAll(), this._data = null, this._isFirstFrame = !0;
    }, t.prototype._removeBackground = function() {
      this.group.remove(this._backgroundGroup), this._backgroundGroup = null;
    }, t.type = "bar", t;
  }(me)
), og = {
  cartesian2d: function(r, t) {
    var e = t.width < 0 ? -1 : 1, i = t.height < 0 ? -1 : 1;
    e < 0 && (t.x += t.width, t.width = -t.width), i < 0 && (t.y += t.height, t.height = -t.height);
    var n = r.x + r.width, a = r.y + r.height, o = Ru(t.x, r.x), s = $u(t.x + t.width, n), l = Ru(t.y, r.y), u = $u(t.y + t.height, a), h = s < o, c = u < l;
    return t.x = h && o > n ? s : o, t.y = c && l > a ? u : l, t.width = h ? 0 : s - o, t.height = c ? 0 : u - l, e < 0 && (t.x += t.width, t.width = -t.width), i < 0 && (t.y += t.height, t.height = -t.height), h || c;
  },
  polar: function(r, t) {
    var e = t.r0 <= t.r ? 1 : -1;
    if (e < 0) {
      var i = t.r;
      t.r = t.r0, t.r0 = i;
    }
    var n = $u(t.r, r.r), a = Ru(t.r0, r.r0);
    t.r = n, t.r0 = a;
    var o = n - a < 0;
    if (e < 0) {
      var i = t.r;
      t.r = t.r0, t.r0 = i;
    }
    return o;
  }
}, sg = {
  cartesian2d: function(r, t, e, i, n, a, o, s, l) {
    var u = new Mt({
      shape: $({}, i),
      z2: 1
    });
    if (u.__dataIndex = e, u.name = "item", a) {
      var h = u.shape, c = n ? "height" : "width";
      h[c] = 0;
    }
    return u;
  },
  polar: function(r, t, e, i, n, a, o, s, l) {
    var u = !n && l ? ag : bn, h = new u({
      shape: i,
      z2: 1
    });
    h.name = "item";
    var c = nb(n);
    if (h.calculateTextPosition = Pk(c, {
      isRoundCap: u === ag
    }), a) {
      var f = h.shape, d = n ? "r" : "endAngle", v = {};
      f[d] = n ? i.r0 : i.startAngle, v[d] = i[d], (s ? jt : ir)(h, {
        shape: v
        // __value: typeof dataValue === 'string' ? parseInt(dataValue, 10) : dataValue
      }, a);
    }
    return h;
  }
};
function Nk(r, t) {
  var e = r.get("realtimeSort", !0), i = t.getBaseAxis();
  if (e && i.type === "category" && t.type === "cartesian2d")
    return {
      baseAxis: i,
      otherAxis: t.getOtherAxis(i)
    };
}
function lg(r, t, e, i, n, a, o, s) {
  var l, u;
  a ? (u = {
    x: i.x,
    width: i.width
  }, l = {
    y: i.y,
    height: i.height
  }) : (u = {
    y: i.y,
    height: i.height
  }, l = {
    x: i.x,
    width: i.width
  }), s || (o ? jt : ir)(e, {
    shape: l
  }, t, n, null);
  var h = t ? r.baseAxis.model : null;
  (o ? jt : ir)(e, {
    shape: u
  }, h, n);
}
function ug(r, t) {
  for (var e = 0; e < t.length; e++)
    if (!isFinite(r[t[e]]))
      return !0;
  return !1;
}
var Bk = ["x", "y", "width", "height"], zk = ["cx", "cy", "r", "startAngle", "endAngle"], hg = {
  cartesian2d: function(r) {
    return !ug(r, Bk);
  },
  polar: function(r) {
    return !ug(r, zk);
  }
}, Oo = {
  // itemModel is only used to get borderWidth, which is not needed
  // when calculating bar background layout.
  cartesian2d: function(r, t, e) {
    var i = r.getItemLayout(t), n = e ? Hk(e, i) : 0, a = i.width > 0 ? 1 : -1, o = i.height > 0 ? 1 : -1;
    return {
      x: i.x + a * n / 2,
      y: i.y + o * n / 2,
      width: i.width - a * n,
      height: i.height - o * n
    };
  },
  polar: function(r, t, e) {
    var i = r.getItemLayout(t);
    return {
      cx: i.cx,
      cy: i.cy,
      r0: i.r0,
      r: i.r,
      startAngle: i.startAngle,
      endAngle: i.endAngle,
      clockwise: i.clockwise
    };
  }
};
function Fk(r) {
  return r.startAngle != null && r.endAngle != null && r.startAngle === r.endAngle;
}
function nb(r) {
  return /* @__PURE__ */ function(t) {
    var e = t ? "Arc" : "Angle";
    return function(i) {
      switch (i) {
        case "start":
        case "insideStart":
        case "end":
        case "insideEnd":
          return i + e;
        default:
          return i;
      }
    };
  }(r);
}
function cg(r, t, e, i, n, a, o, s) {
  var l = t.getItemVisual(e, "style");
  if (s) {
    if (!a.get("roundCap")) {
      var h = r.shape, c = Rk(i.getModel("itemStyle"), h);
      $(h, c), r.setShape(h);
    }
  } else {
    var u = i.get(["itemStyle", "borderRadius"]) || 0;
    r.setShape("r", u);
  }
  r.useStyle(l);
  var f = i.getShallow("cursor");
  f && r.attr("cursor", f);
  var d = s ? o ? n.r >= n.r0 ? "endArc" : "startArc" : n.endAngle >= n.startAngle ? "endAngle" : "startAngle" : o ? n.height >= 0 ? "bottom" : "top" : n.width >= 0 ? "right" : "left", v = wn(i);
  xn(r, v, {
    labelFetcher: a,
    labelDataIndex: e,
    defaultText: Of(a.getData(), e),
    inheritColor: l.fill,
    defaultOpacity: l.opacity,
    defaultOutsidePosition: d
  });
  var g = r.getTextContent();
  if (s && g) {
    var p = i.get(["label", "position"]);
    r.textConfig.inside = p === "middle" ? !0 : null, Ek(r, p === "outside" ? d : p, nb(o), i.get(["label", "rotate"]));
  }
  LT(g, v, a.getRawValue(e), function(m) {
    return K_(t, m);
  });
  var y = i.getModel(["emphasis"]);
  hn(r, y.get("focus"), y.get("blurScope"), y.get("disabled")), Cs(r, i), Fk(n) && (r.style.fill = "none", r.style.stroke = "none", T(r.states, function(m) {
    m.style && (m.style.fill = m.style.stroke = "none");
  }));
}
function Hk(r, t) {
  var e = r.get(["itemStyle", "borderColor"]);
  if (!e || e === "none")
    return 0;
  var i = r.get(["itemStyle", "borderWidth"]) || 0, n = isNaN(t.width) ? Number.MAX_VALUE : Math.abs(t.width), a = isNaN(t.height) ? Number.MAX_VALUE : Math.abs(t.height);
  return Math.min(i, n, a);
}
var Vk = (
  /** @class */
  /* @__PURE__ */ function() {
    function r() {
    }
    return r;
  }()
), fg = (
  /** @class */
  function(r) {
    N(t, r);
    function t(e) {
      var i = r.call(this, e) || this;
      return i.type = "largeBar", i;
    }
    return t.prototype.getDefaultShape = function() {
      return new Vk();
    }, t.prototype.buildPath = function(e, i) {
      for (var n = i.points, a = this.baseDimIdx, o = 1 - this.baseDimIdx, s = [], l = [], u = this.barWidth, h = 0; h < n.length; h += 3)
        l[a] = u, l[o] = n[h + 2], s[a] = n[h + a], s[o] = n[h + o], e.rect(s[0], s[1], l[0], l[1]);
    }, t;
  }(pt)
);
function dg(r, t, e, i) {
  var n = r.getData(), a = n.getLayout("valueAxisHorizontal") ? 1 : 0, o = n.getLayout("largeDataIndices"), s = n.getLayout("size"), l = r.getModel("backgroundStyle"), u = n.getLayout("largeBackgroundPoints");
  if (u) {
    var h = new fg({
      shape: {
        points: u
      },
      incremental: !!i,
      silent: !0,
      z2: 0
    });
    h.baseDimIdx = a, h.largeDataIndices = o, h.barWidth = s, h.useStyle(l.getItemStyle()), t.add(h), e && e.push(h);
  }
  var c = new fg({
    shape: {
      points: n.getLayout("largePoints")
    },
    incremental: !!i,
    ignoreCoarsePointer: !0,
    z2: 1
  });
  c.baseDimIdx = a, c.largeDataIndices = o, c.barWidth = s, t.add(c), c.useStyle(n.getVisual("style")), c.style.stroke = null, lt(c).seriesIndex = r.seriesIndex, r.get("silent") || (c.on("mousedown", vg), c.on("mousemove", vg)), e && e.push(c);
}
var vg = wf(function(r) {
  var t = this, e = Gk(t, r.offsetX, r.offsetY);
  lt(t).dataIndex = e >= 0 ? e : null;
}, 30, !1);
function Gk(r, t, e) {
  for (var i = r.baseDimIdx, n = 1 - i, a = r.shape.points, o = r.largeDataIndices, s = [], l = [], u = r.barWidth, h = 0, c = a.length / 3; h < c; h++) {
    var f = h * 3;
    if (l[i] = u, l[n] = a[f + 2], s[i] = a[f + i], s[n] = a[f + n], l[n] < 0 && (s[n] += l[n], l[n] = -l[n]), t >= s[0] && t <= s[0] + l[0] && e >= s[1] && e <= s[1] + l[1])
      return o[h];
  }
  return -1;
}
function ab(r, t, e) {
  if (Qa(e, "cartesian2d")) {
    var i = t, n = e.getArea();
    return {
      x: r ? i.x : n.x,
      y: r ? n.y : i.y,
      width: r ? i.width : n.width,
      height: r ? n.height : i.height
    };
  } else {
    var n = e.getArea(), a = t;
    return {
      cx: n.cx,
      cy: n.cy,
      r0: r ? n.r0 : a.r0,
      r: r ? n.r : a.r,
      startAngle: r ? a.startAngle : 0,
      endAngle: r ? a.endAngle : Math.PI * 2
    };
  }
}
function Wk(r, t, e) {
  var i = r.type === "polar" ? bn : Mt;
  return new i({
    shape: ab(t, e, r),
    silent: !0,
    z2: 0
  });
}
function Uk(r) {
  r.registerChartView(Ok), r.registerSeriesModel(Ik), r.registerLayout(r.PRIORITY.VISUAL.LAYOUT, et(xD, "bar")), r.registerLayout(r.PRIORITY.VISUAL.PROGRESSIVE_LAYOUT, wD("bar")), r.registerProcessor(r.PRIORITY.PROCESSOR.STATISTIC, ib("bar")), r.registerAction({
    type: "changeAxisOrder",
    event: "changeAxisOrder",
    update: "update"
  }, function(t, e) {
    var i = t.componentType || "series";
    e.eachComponent({
      mainType: i,
      query: t
    }, function(n) {
      t.sortInfo && n.axis.setCategorySortInfo(t.sortInfo);
    });
  });
}
var Yk = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.type = "grid", t.dependencies = ["xAxis", "yAxis"], t.layoutMode = "box", t.defaultOption = {
      show: !1,
      // zlevel: 0,
      z: 0,
      left: "10%",
      top: 60,
      right: "10%",
      bottom: 70,
      // If grid size contain label
      containLabel: !1,
      // width: {totalWidth} - left - right,
      // height: {totalHeight} - top - bottom,
      backgroundColor: "rgba(0,0,0,0)",
      borderWidth: 1,
      borderColor: "#ccc"
    }, t;
  }(dt)
), Qh = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.prototype.getCoordSysModel = function() {
      return this.getReferringComponents("grid", Me).models[0];
    }, t.type = "cartesian2dAxis", t;
  }(dt)
);
Le(Qh, UD);
var ob = {
  show: !0,
  // zlevel: 0,
  z: 0,
  // Inverse the axis.
  inverse: !1,
  // Axis name displayed.
  name: "",
  // 'start' | 'middle' | 'end'
  nameLocation: "end",
  // By degree. By default auto rotate by nameLocation.
  nameRotate: null,
  nameTruncate: {
    maxWidth: null,
    ellipsis: "...",
    placeholder: "."
  },
  // Use global text style by default.
  nameTextStyle: {},
  // The gap between axisName and axisLine.
  nameGap: 15,
  // Default `false` to support tooltip.
  silent: !1,
  // Default `false` to avoid legacy user event listener fail.
  triggerEvent: !1,
  tooltip: {
    show: !1
  },
  axisPointer: {},
  axisLine: {
    show: !0,
    onZero: !0,
    onZeroAxisIndex: null,
    lineStyle: {
      color: "#6E7079",
      width: 1,
      type: "solid"
    },
    // The arrow at both ends the the axis.
    symbol: ["none", "none"],
    symbolSize: [10, 15]
  },
  axisTick: {
    show: !0,
    // Whether axisTick is inside the grid or outside the grid.
    inside: !1,
    // The length of axisTick.
    length: 5,
    lineStyle: {
      width: 1
    }
  },
  axisLabel: {
    show: !0,
    // Whether axisLabel is inside the grid or outside the grid.
    inside: !1,
    rotate: 0,
    // true | false | null/undefined (auto)
    showMinLabel: null,
    // true | false | null/undefined (auto)
    showMaxLabel: null,
    margin: 8,
    // formatter: null,
    fontSize: 12
  },
  splitLine: {
    show: !0,
    showMinLine: !0,
    showMaxLine: !0,
    lineStyle: {
      color: ["#E0E6F1"],
      width: 1,
      type: "solid"
    }
  },
  splitArea: {
    show: !1,
    areaStyle: {
      color: ["rgba(250,250,250,0.2)", "rgba(210,219,238,0.2)"]
    }
  }
}, Xk = ut({
  // The gap at both ends of the axis. For categoryAxis, boolean.
  boundaryGap: !0,
  // Set false to faster category collection.
  deduplication: null,
  // splitArea: {
  // show: false
  // },
  splitLine: {
    show: !1
  },
  axisTick: {
    // If tick is align with label when boundaryGap is true
    alignWithLabel: !1,
    interval: "auto"
  },
  axisLabel: {
    interval: "auto"
  }
}, ob), Bf = ut({
  boundaryGap: [0, 0],
  axisLine: {
    // Not shown when other axis is categoryAxis in cartesian
    show: "auto"
  },
  axisTick: {
    // Not shown when other axis is categoryAxis in cartesian
    show: "auto"
  },
  // TODO
  // min/max: [30, datamin, 60] or [20, datamin] or [datamin, 60]
  splitNumber: 5,
  minorTick: {
    // Minor tick, not available for cateogry axis.
    show: !1,
    // Split number of minor ticks. The value should be in range of (0, 100)
    splitNumber: 5,
    // Length of minor tick
    length: 3,
    // Line style
    lineStyle: {
      // Default to be same with axisTick
    }
  },
  minorSplitLine: {
    show: !1,
    lineStyle: {
      color: "#F4F7FD",
      width: 1
    }
  }
}, ob), Zk = ut({
  splitNumber: 6,
  axisLabel: {
    // To eliminate labels that are not nice
    showMinLabel: !1,
    showMaxLabel: !1,
    rich: {
      primary: {
        fontWeight: "bold"
      }
    }
  },
  splitLine: {
    show: !1
  }
}, Bf), qk = ht({
  logBase: 10
}, Bf);
const Kk = {
  category: Xk,
  value: Bf,
  time: Zk,
  log: qk
};
var jk = {
  value: 1,
  category: 1,
  time: 1,
  log: 1
};
function pg(r, t, e, i) {
  T(jk, function(n, a) {
    var o = ut(ut({}, Kk[a], !0), i, !0), s = (
      /** @class */
      function(l) {
        N(u, l);
        function u() {
          var h = l !== null && l.apply(this, arguments) || this;
          return h.type = t + "Axis." + a, h;
        }
        return u.prototype.mergeDefaultAndTheme = function(h, c) {
          var f = $a(this), d = f ? vl(h) : {}, v = c.getTheme();
          ut(h, v.get(a + "Axis")), ut(h, this.getDefaultOption()), h.type = gg(h), f && fn(h, d, f);
        }, u.prototype.optionUpdated = function() {
          var h = this.option;
          h.type === "category" && (this.__ordinalMeta = Zh.createByAxisModel(this));
        }, u.prototype.getCategories = function(h) {
          var c = this.option;
          if (c.type === "category")
            return h ? c.data : this.__ordinalMeta.categories;
        }, u.prototype.getOrdinalMeta = function() {
          return this.__ordinalMeta;
        }, u.type = t + "Axis." + a, u.defaultOption = o, u;
      }(e)
    );
    r.registerComponentModel(s);
  }), r.registerSubTypeDefaulter(t + "Axis", gg);
}
function gg(r) {
  return r.type || (r.data ? "category" : "value");
}
var Qk = (
  /** @class */
  function() {
    function r(t) {
      this.type = "cartesian", this._dimList = [], this._axes = {}, this.name = t || "";
    }
    return r.prototype.getAxis = function(t) {
      return this._axes[t];
    }, r.prototype.getAxes = function() {
      return H(this._dimList, function(t) {
        return this._axes[t];
      }, this);
    }, r.prototype.getAxesByScale = function(t) {
      return t = t.toLowerCase(), Pt(this.getAxes(), function(e) {
        return e.scale.type === t;
      });
    }, r.prototype.addAxis = function(t) {
      var e = t.dim;
      this._axes[e] = t, this._dimList.push(e);
    }, r;
  }()
), Jh = ["x", "y"];
function yg(r) {
  return r.type === "interval" || r.type === "time";
}
var Jk = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = "cartesian2d", e.dimensions = Jh, e;
    }
    return t.prototype.calcAffineTransform = function() {
      this._transform = this._invTransform = null;
      var e = this.getAxis("x").scale, i = this.getAxis("y").scale;
      if (!(!yg(e) || !yg(i))) {
        var n = e.getExtent(), a = i.getExtent(), o = this.dataToPoint([n[0], a[0]]), s = this.dataToPoint([n[1], a[1]]), l = n[1] - n[0], u = a[1] - a[0];
        if (!(!l || !u)) {
          var h = (s[0] - o[0]) / l, c = (s[1] - o[1]) / u, f = o[0] - n[0] * h, d = o[1] - a[0] * c, v = this._transform = [h, 0, 0, c, f, d];
          this._invTransform = zc([], v);
        }
      }
    }, t.prototype.getBaseAxis = function() {
      return this.getAxesByScale("ordinal")[0] || this.getAxesByScale("time")[0] || this.getAxis("x");
    }, t.prototype.containPoint = function(e) {
      var i = this.getAxis("x"), n = this.getAxis("y");
      return i.contain(i.toLocalCoord(e[0])) && n.contain(n.toLocalCoord(e[1]));
    }, t.prototype.containData = function(e) {
      return this.getAxis("x").containData(e[0]) && this.getAxis("y").containData(e[1]);
    }, t.prototype.containZone = function(e, i) {
      var n = this.dataToPoint(e), a = this.dataToPoint(i), o = this.getArea(), s = new ot(n[0], n[1], a[0] - n[0], a[1] - n[1]);
      return o.intersect(s);
    }, t.prototype.dataToPoint = function(e, i, n) {
      n = n || [];
      var a = e[0], o = e[1];
      if (this._transform && a != null && isFinite(a) && o != null && isFinite(o))
        return ge(n, e, this._transform);
      var s = this.getAxis("x"), l = this.getAxis("y");
      return n[0] = s.toGlobalCoord(s.dataToCoord(a, i)), n[1] = l.toGlobalCoord(l.dataToCoord(o, i)), n;
    }, t.prototype.clampData = function(e, i) {
      var n = this.getAxis("x").scale, a = this.getAxis("y").scale, o = n.getExtent(), s = a.getExtent(), l = n.parse(e[0]), u = a.parse(e[1]);
      return i = i || [], i[0] = Math.min(Math.max(Math.min(o[0], o[1]), l), Math.max(o[0], o[1])), i[1] = Math.min(Math.max(Math.min(s[0], s[1]), u), Math.max(s[0], s[1])), i;
    }, t.prototype.pointToData = function(e, i) {
      var n = [];
      if (this._invTransform)
        return ge(n, e, this._invTransform);
      var a = this.getAxis("x"), o = this.getAxis("y");
      return n[0] = a.coordToData(a.toLocalCoord(e[0]), i), n[1] = o.coordToData(o.toLocalCoord(e[1]), i), n;
    }, t.prototype.getOtherAxis = function(e) {
      return this.getAxis(e.dim === "x" ? "y" : "x");
    }, t.prototype.getArea = function(e) {
      e = e || 0;
      var i = this.getAxis("x").getGlobalExtent(), n = this.getAxis("y").getGlobalExtent(), a = Math.min(i[0], i[1]) - e, o = Math.min(n[0], n[1]) - e, s = Math.max(i[0], i[1]) - a + e, l = Math.max(n[0], n[1]) - o + e;
      return new ot(a, o, s, l);
    }, t;
  }(Qk)
), t2 = (
  /** @class */
  function(r) {
    N(t, r);
    function t(e, i, n, a, o) {
      var s = r.call(this, e, i, n) || this;
      return s.index = 0, s.type = a || "value", s.position = o || "bottom", s;
    }
    return t.prototype.isHorizontal = function() {
      var e = this.position;
      return e === "top" || e === "bottom";
    }, t.prototype.getGlobalExtent = function(e) {
      var i = this.getExtent();
      return i[0] = this.toGlobalCoord(i[0]), i[1] = this.toGlobalCoord(i[1]), e && i[0] > i[1] && i.reverse(), i;
    }, t.prototype.pointToData = function(e, i) {
      return this.coordToData(this.toLocalCoord(e[this.dim === "x" ? 0 : 1]), i);
    }, t.prototype.setCategorySortInfo = function(e) {
      if (this.type !== "category")
        return !1;
      this.model.option.categorySortInfo = e, this.scale.setSortInfo(e);
    }, t;
  }(rk)
);
function tc(r, t, e) {
  e = e || {};
  var i = r.coordinateSystem, n = t.axis, a = {}, o = n.getAxesOnZeroOf()[0], s = n.position, l = o ? "onZero" : s, u = n.dim, h = i.getRect(), c = [h.x, h.x + h.width, h.y, h.y + h.height], f = {
    left: 0,
    right: 1,
    top: 0,
    bottom: 1,
    onZero: 2
  }, d = t.get("offset") || 0, v = u === "x" ? [c[2] - d, c[3] + d] : [c[0] - d, c[1] + d];
  if (o) {
    var g = o.toGlobalCoord(o.dataToCoord(0));
    v[f.onZero] = Math.max(Math.min(g, v[1]), v[0]);
  }
  a.position = [u === "y" ? v[f[l]] : c[0], u === "x" ? v[f[l]] : c[3]], a.rotation = Math.PI / 2 * (u === "x" ? 0 : 1);
  var p = {
    top: -1,
    bottom: 1,
    left: -1,
    right: 1
  };
  a.labelDirection = a.tickDirection = a.nameDirection = p[s], a.labelOffset = o ? v[f[s]] - v[f.onZero] : 0, t.get(["axisTick", "inside"]) && (a.tickDirection = -a.tickDirection), Be(e.labelInside, t.get(["axisLabel", "inside"])) && (a.labelDirection = -a.labelDirection);
  var y = t.get(["axisLabel", "rotate"]);
  return a.labelRotate = l === "top" ? -y : y, a.z2 = 1, a;
}
function mg(r) {
  return r.get("coordinateSystem") === "cartesian2d";
}
function _g(r) {
  var t = {
    xAxisModel: null,
    yAxisModel: null
  };
  return T(t, function(e, i) {
    var n = i.replace(/Model$/, ""), a = r.getReferringComponents(n, Me).models[0];
    t[i] = a;
  }), t;
}
var Ou = Math.log;
function e2(r, t, e) {
  var i = Tn.prototype, n = i.getTicks.call(e), a = i.getTicks.call(e, !0), o = n.length - 1, s = i.getInterval.call(e), l = H_(r, t), u = l.extent, h = l.fixMin, c = l.fixMax;
  if (r.type === "log") {
    var f = Ou(r.base);
    u = [Ou(u[0]) / f, Ou(u[1]) / f];
  }
  r.setExtent(u[0], u[1]), r.calcNiceExtent({
    splitNumber: o,
    fixMin: h,
    fixMax: c
  });
  var d = i.getExtent.call(r);
  h && (u[0] = d[0]), c && (u[1] = d[1]);
  var v = i.getInterval.call(r), g = u[0], p = u[1];
  if (h && c)
    v = (p - g) / o;
  else if (h)
    for (p = u[0] + v * o; p < u[1] && isFinite(p) && isFinite(u[1]); )
      v = Lu(v), p = u[0] + v * o;
  else if (c)
    for (g = u[1] - v * o; g > u[0] && isFinite(g) && isFinite(u[0]); )
      v = Lu(v), g = u[1] - v * o;
  else {
    var y = r.getTicks().length - 1;
    y > o && (v = Lu(v));
    var m = v * o;
    p = Math.ceil(u[1] / v) * v, g = Lt(p - m), g < 0 && u[0] >= 0 ? (g = 0, p = Lt(m)) : p > 0 && u[1] <= 0 && (p = 0, g = -Lt(m));
  }
  var _ = (n[0].value - a[0].value) / s, b = (n[o].value - a[o].value) / s;
  i.setExtent.call(r, g + v * _, p + v * b), i.setInterval.call(r, v), (_ || b) && i.setNiceExtent.call(r, g + v, p - v);
}
var r2 = (
  /** @class */
  function() {
    function r(t, e, i) {
      this.type = "grid", this._coordsMap = {}, this._coordsList = [], this._axesMap = {}, this._axesList = [], this.axisPointerEnabled = !0, this.dimensions = Jh, this._initCartesian(t, e, i), this.model = t;
    }
    return r.prototype.getRect = function() {
      return this._rect;
    }, r.prototype.update = function(t, e) {
      var i = this._axesMap;
      this._updateScale(t, this.model);
      function n(o) {
        var s, l = xt(o), u = l.length;
        if (u) {
          for (var h = [], c = u - 1; c >= 0; c--) {
            var f = +l[c], d = o[f], v = d.model, g = d.scale;
            // Only value and log axis without interval support alignTicks.
            qh(g) && v.get("alignTicks") && v.get("interval") == null ? h.push(d) : (Xp(g, v), qh(g) && (s = d));
          }
          h.length && (s || (s = h.pop(), Xp(s.scale, s.model)), T(h, function(p) {
            e2(p.scale, p.model, s.scale);
          }));
        }
      }
      n(i.x), n(i.y);
      var a = {};
      T(i.x, function(o) {
        bg(i, "y", o, a);
      }), T(i.y, function(o) {
        bg(i, "x", o, a);
      }), this.resize(this.model, e);
    }, r.prototype.resize = function(t, e, i) {
      var n = t.getBoxLayoutParams(), a = !i && t.get("containLabel"), o = cn(n, {
        width: e.getWidth(),
        height: e.getHeight()
      });
      this._rect = o;
      var s = this._axesList;
      l(), a && (T(s, function(u) {
        if (!u.model.get(["axisLabel", "inside"])) {
          var h = VD(u);
          if (h) {
            var c = u.isHorizontal() ? "height" : "width", f = u.model.get(["axisLabel", "margin"]);
            o[c] -= h[c] + f, u.position === "top" ? o.y += h.height + f : u.position === "left" && (o.x += h.width + f);
          }
        }
      }), l()), T(this._coordsList, function(u) {
        u.calcAffineTransform();
      });
      function l() {
        T(s, function(u) {
          var h = u.isHorizontal(), c = h ? [0, o.width] : [0, o.height], f = u.inverse ? 1 : 0;
          u.setExtent(c[f], c[1 - f]), i2(u, h ? o.x : o.y);
        });
      }
    }, r.prototype.getAxis = function(t, e) {
      var i = this._axesMap[t];
      if (i != null)
        return i[e || 0];
    }, r.prototype.getAxes = function() {
      return this._axesList.slice();
    }, r.prototype.getCartesian = function(t, e) {
      if (t != null && e != null) {
        var i = "x" + t + "y" + e;
        return this._coordsMap[i];
      }
      U(t) && (e = t.yAxisIndex, t = t.xAxisIndex);
      for (var n = 0, a = this._coordsList; n < a.length; n++)
        if (a[n].getAxis("x").index === t || a[n].getAxis("y").index === e)
          return a[n];
    }, r.prototype.getCartesians = function() {
      return this._coordsList.slice();
    }, r.prototype.convertToPixel = function(t, e, i) {
      var n = this._findConvertTarget(e);
      return n.cartesian ? n.cartesian.dataToPoint(i) : n.axis ? n.axis.toGlobalCoord(n.axis.dataToCoord(i)) : null;
    }, r.prototype.convertFromPixel = function(t, e, i) {
      var n = this._findConvertTarget(e);
      return n.cartesian ? n.cartesian.pointToData(i) : n.axis ? n.axis.coordToData(n.axis.toLocalCoord(i)) : null;
    }, r.prototype._findConvertTarget = function(t) {
      var e = t.seriesModel, i = t.xAxisModel || e && e.getReferringComponents("xAxis", Me).models[0], n = t.yAxisModel || e && e.getReferringComponents("yAxis", Me).models[0], a = t.gridModel, o = this._coordsList, s, l;
      if (e)
        s = e.coordinateSystem, rt(o, s) < 0 && (s = null);
      else if (i && n)
        s = this.getCartesian(i.componentIndex, n.componentIndex);
      else if (i)
        l = this.getAxis("x", i.componentIndex);
      else if (n)
        l = this.getAxis("y", n.componentIndex);
      else if (a) {
        var u = a.coordinateSystem;
        u === this && (s = this._coordsList[0]);
      }
      return {
        cartesian: s,
        axis: l
      };
    }, r.prototype.containPoint = function(t) {
      var e = this._coordsList[0];
      if (e)
        return e.containPoint(t);
    }, r.prototype._initCartesian = function(t, e, i) {
      var n = this, a = this, o = {
        left: !1,
        right: !1,
        top: !1,
        bottom: !1
      }, s = {
        x: {},
        y: {}
      }, l = {
        x: 0,
        y: 0
      };
      if (e.eachComponent("xAxis", u("x"), this), e.eachComponent("yAxis", u("y"), this), !l.x || !l.y) {
        this._axesMap = {}, this._axesList = [];
        return;
      }
      this._axesMap = s, T(s.x, function(h, c) {
        T(s.y, function(f, d) {
          var v = "x" + c + "y" + d, g = new Jk(v);
          g.master = n, g.model = t, n._coordsMap[v] = g, n._coordsList.push(g), g.addAxis(h), g.addAxis(f);
        });
      });
      function u(h) {
        return function(c, f) {
          if (Nu(c, t)) {
            var d = c.get("position");
            h === "x" ? d !== "top" && d !== "bottom" && (d = o.bottom ? "top" : "bottom") : d !== "left" && d !== "right" && (d = o.left ? "right" : "left"), o[d] = !0;
            var v = new t2(h, FD(c), [0, 0], c.get("type"), d), g = v.type === "category";
            v.onBand = g && c.get("boundaryGap"), v.inverse = c.get("inverse"), c.axis = v, v.model = c, v.grid = a, v.index = f, a._axesList.push(v), s[h][f] = v, l[h]++;
          }
        };
      }
    }, r.prototype._updateScale = function(t, e) {
      T(this._axesList, function(n) {
        if (n.scale.setExtent(1 / 0, -1 / 0), n.type === "category") {
          var a = n.model.get("categorySortInfo");
          n.scale.setSortInfo(a);
        }
      }), t.eachSeries(function(n) {
        if (mg(n)) {
          var a = _g(n), o = a.xAxisModel, s = a.yAxisModel;
          if (!Nu(o, e) || !Nu(s, e))
            return;
          var l = this.getCartesian(o.componentIndex, s.componentIndex), u = n.getData(), h = l.getAxis("x"), c = l.getAxis("y");
          i(u, h), i(u, c);
        }
      }, this);
      function i(n, a) {
        T(WD(n, a.dim), function(o) {
          a.scale.unionExtentFromData(n, o);
        });
      }
    }, r.prototype.getTooltipAxes = function(t) {
      var e = [], i = [];
      return T(this.getCartesians(), function(n) {
        var a = t != null && t !== "auto" ? n.getAxis(t) : n.getBaseAxis(), o = n.getOtherAxis(a);
        rt(e, a) < 0 && e.push(a), rt(i, o) < 0 && i.push(o);
      }), {
        baseAxes: e,
        otherAxes: i
      };
    }, r.create = function(t, e) {
      var i = [];
      return t.eachComponent("grid", function(n, a) {
        var o = new r(n, t, e);
        o.name = "grid_" + a, o.resize(n, e, !0), n.coordinateSystem = o, i.push(o);
      }), t.eachSeries(function(n) {
        if (mg(n)) {
          var a = _g(n), o = a.xAxisModel, s = a.yAxisModel, l = o.getCoordSysModel(), u = l.coordinateSystem;
          n.coordinateSystem = u.getCartesian(o.componentIndex, s.componentIndex);
        }
      }), i;
    }, r.dimensions = Jh, r;
  }()
);
function Nu(r, t) {
  return r.getCoordSysModel() === t;
}
function bg(r, t, e, i) {
  e.getAxesOnZeroOf = function() {
    return a ? [a] : [];
  };
  var n = r[t], a, o = e.model, s = o.get(["axisLine", "onZero"]), l = o.get(["axisLine", "onZeroAxisIndex"]);
  if (!s)
    return;
  if (l != null)
    xg(n[l]) && (a = n[l]);
  else
    for (var u in n)
      if (n.hasOwnProperty(u) && xg(n[u]) && !i[h(n[u])]) {
        a = n[u];
        break;
      }
  a && (i[h(a)] = !0);
  function h(c) {
    return c.dim + "_" + c.index;
  }
}
function xg(r) {
  return r && r.type !== "category" && r.type !== "time" && HD(r);
}
function i2(r, t) {
  var e = r.getExtent(), i = e[0] + e[1];
  r.toGlobalCoord = r.dim === "x" ? function(n) {
    return n + t;
  } : function(n) {
    return i - n + t;
  }, r.toLocalCoord = r.dim === "x" ? function(n) {
    return n - t;
  } : function(n) {
    return i - n + t;
  };
}
var br = Math.PI, Tr = (
  /** @class */
  function() {
    function r(t, e) {
      this.group = new St(), this.opt = e, this.axisModel = t, ht(e, {
        labelOffset: 0,
        nameDirection: 1,
        tickDirection: 1,
        labelDirection: 1,
        silent: !0,
        handleAutoShown: function() {
          return !0;
        }
      });
      var i = new St({
        x: e.position[0],
        y: e.position[1],
        rotation: e.rotation
      });
      i.updateTransform(), this._transformGroup = i;
    }
    return r.prototype.hasBuilder = function(t) {
      return !!wg[t];
    }, r.prototype.add = function(t) {
      wg[t](this.opt, this.axisModel, this.group, this._transformGroup);
    }, r.prototype.getGroup = function() {
      return this.group;
    }, r.innerTextLayout = function(t, e, i) {
      var n = gm(e - t), a, o;
      return bs(n) ? (o = i > 0 ? "top" : "bottom", a = "center") : bs(n - br) ? (o = i > 0 ? "bottom" : "top", a = "center") : (o = "middle", n > 0 && n < br ? a = i > 0 ? "right" : "left" : a = i > 0 ? "left" : "right"), {
        rotation: n,
        textAlign: a,
        textVerticalAlign: o
      };
    }, r.makeAxisEventDataBase = function(t) {
      var e = {
        componentType: t.mainType,
        componentIndex: t.componentIndex
      };
      return e[t.mainType + "Index"] = t.componentIndex, e;
    }, r.isLabelSilent = function(t) {
      var e = t.get("tooltip");
      return t.get("silent") || !(t.get("triggerEvent") || e && e.show);
    }, r;
  }()
), wg = {
  axisLine: function(r, t, e, i) {
    var n = t.get(["axisLine", "show"]);
    if (n === "auto" && r.handleAutoShown && (n = r.handleAutoShown("axisLine")), !!n) {
      var a = t.axis.getExtent(), o = i.transform, s = [a[0], 0], l = [a[1], 0], u = s[0] > l[0];
      o && (ge(s, s, o), ge(l, l, o));
      var h = $({
        lineCap: "round"
      }, t.getModel(["axisLine", "lineStyle"]).getLineStyle()), c = new Ar({
        shape: {
          x1: s[0],
          y1: s[1],
          x2: l[0],
          y2: l[1]
        },
        style: h,
        strokeContainThreshold: r.strokeContainThreshold || 5,
        silent: !0,
        z2: 1
      });
      Ea(c.shape, c.style.lineWidth), c.anid = "line", e.add(c);
      var f = t.get(["axisLine", "symbol"]);
      if (f != null) {
        var d = t.get(["axisLine", "symbolSize"]);
        V(f) && (f = [f, f]), (V(d) || wt(d)) && (d = [d, d]);
        var v = r_(t.get(["axisLine", "symbolOffset"]) || 0, d), g = d[0], p = d[1];
        T([{
          rotate: r.rotation + Math.PI / 2,
          offset: v[0],
          r: 0
        }, {
          rotate: r.rotation - Math.PI / 2,
          offset: v[1],
          r: Math.sqrt((s[0] - l[0]) * (s[0] - l[0]) + (s[1] - l[1]) * (s[1] - l[1]))
        }], function(y, m) {
          if (f[m] !== "none" && f[m] != null) {
            var _ = vn(f[m], -g / 2, -p / 2, g, p, h.stroke, !0), b = y.r + y.offset, w = u ? l : s;
            _.attr({
              rotation: y.rotate,
              x: w[0] + b * Math.cos(r.rotation),
              y: w[1] - b * Math.sin(r.rotation),
              silent: !0,
              z2: 11
            }), e.add(_);
          }
        });
      }
    }
  },
  axisTickLabel: function(r, t, e, i) {
    var n = o2(e, i, t, r), a = l2(e, i, t, r);
    if (a2(t, a, n), s2(e, i, t, r.tickDirection), t.get(["axisLabel", "hideOverlap"])) {
      var o = nk(H(a, function(s) {
        return {
          label: s,
          priority: s.z2,
          defaultAttr: {
            ignore: s.ignore
          }
        };
      }));
      ak(o);
    }
  },
  axisName: function(r, t, e, i) {
    var n = Be(r.axisName, t.get("name"));
    if (n) {
      var a = t.get("nameLocation"), o = r.nameDirection, s = t.getModel("nameTextStyle"), l = t.get("nameGap") || 0, u = t.axis.getExtent(), h = u[0] > u[1] ? -1 : 1, c = [
        a === "start" ? u[0] - h * l : a === "end" ? u[1] + h * l : (u[0] + u[1]) / 2,
        // Reuse labelOffset.
        Tg(a) ? r.labelOffset + o * l : 0
      ], f, d = t.get("nameRotate");
      d != null && (d = d * br / 180);
      var v;
      Tg(a) ? f = Tr.innerTextLayout(
        r.rotation,
        d ?? r.rotation,
        // Adapt to axis.
        o
      ) : (f = n2(r.rotation, a, d || 0, u), v = r.axisNameAvailableWidth, v != null && (v = Math.abs(v / Math.sin(f.rotation)), !isFinite(v) && (v = null)));
      var g = s.getFont(), p = t.get("nameTruncate", !0) || {}, y = p.ellipsis, m = Be(r.nameTruncateMaxWidth, p.maxWidth, v), _ = new Ht({
        x: c[0],
        y: c[1],
        rotation: f.rotation,
        silent: Tr.isLabelSilent(t),
        style: Mr(s, {
          text: n,
          font: g,
          overflow: "truncate",
          width: m,
          ellipsis: y,
          fill: s.getTextColor() || t.get(["axisLine", "lineStyle", "color"]),
          align: s.get("align") || f.textAlign,
          verticalAlign: s.get("verticalAlign") || f.textVerticalAlign
        }),
        z2: 1
      });
      if (nl({
        el: _,
        componentModel: t,
        itemName: n
      }), _.__fullText = n, _.anid = "name", t.get("triggerEvent")) {
        var b = Tr.makeAxisEventDataBase(t);
        b.targetType = "axisName", b.name = n, lt(_).eventData = b;
      }
      i.add(_), _.updateTransform(), e.add(_), _.decomposeTransform();
    }
  }
};
function n2(r, t, e, i) {
  var n = gm(e - r), a, o, s = i[0] > i[1], l = t === "start" && !s || t !== "start" && s;
  return bs(n - br / 2) ? (o = l ? "bottom" : "top", a = "center") : bs(n - br * 1.5) ? (o = l ? "top" : "bottom", a = "center") : (o = "middle", n < br * 1.5 && n > br / 2 ? a = l ? "left" : "right" : a = l ? "right" : "left"), {
    rotation: n,
    textAlign: a,
    textVerticalAlign: o
  };
}
function a2(r, t, e) {
  if (!V_(r.axis)) {
    var i = r.get(["axisLabel", "showMinLabel"]), n = r.get(["axisLabel", "showMaxLabel"]);
    t = t || [], e = e || [];
    var a = t[0], o = t[1], s = t[t.length - 1], l = t[t.length - 2], u = e[0], h = e[1], c = e[e.length - 1], f = e[e.length - 2];
    i === !1 ? (oe(a), oe(u)) : Sg(a, o) && (i ? (oe(o), oe(h)) : (oe(a), oe(u))), n === !1 ? (oe(s), oe(c)) : Sg(l, s) && (n ? (oe(l), oe(f)) : (oe(s), oe(c)));
  }
}
function oe(r) {
  r && (r.ignore = !0);
}
function Sg(r, t) {
  var e = r && r.getBoundingRect().clone(), i = t && t.getBoundingRect().clone();
  if (!(!e || !i)) {
    var n = Nc([]);
    return Bc(n, n, -r.rotation), e.applyTransform(tn([], n, r.getLocalTransform())), i.applyTransform(tn([], n, t.getLocalTransform())), e.intersect(i);
  }
}
function Tg(r) {
  return r === "middle" || r === "center";
}
function sb(r, t, e, i, n) {
  for (var a = [], o = [], s = [], l = 0; l < r.length; l++) {
    var u = r[l].coord;
    o[0] = u, o[1] = 0, s[0] = u, s[1] = e, t && (ge(o, o, t), ge(s, s, t));
    var h = new Ar({
      shape: {
        x1: o[0],
        y1: o[1],
        x2: s[0],
        y2: s[1]
      },
      style: i,
      z2: 2,
      autoBatch: !0,
      silent: !0
    });
    Ea(h.shape, h.style.lineWidth), h.anid = n + "_" + r[l].tickValue, a.push(h);
  }
  return a;
}
function o2(r, t, e, i) {
  var n = e.axis, a = e.getModel("axisTick"), o = a.get("show");
  if (o === "auto" && i.handleAutoShown && (o = i.handleAutoShown("axisTick")), !(!o || n.scale.isBlank())) {
    for (var s = a.getModel("lineStyle"), l = i.tickDirection * a.get("length"), u = n.getTicksCoords(), h = sb(u, t.transform, l, ht(s.getLineStyle(), {
      stroke: e.get(["axisLine", "lineStyle", "color"])
    }), "ticks"), c = 0; c < h.length; c++)
      r.add(h[c]);
    return h;
  }
}
function s2(r, t, e, i) {
  var n = e.axis, a = e.getModel("minorTick");
  if (!(!a.get("show") || n.scale.isBlank())) {
    var o = n.getMinorTicksCoords();
    if (o.length)
      for (var s = a.getModel("lineStyle"), l = i * a.get("length"), u = ht(s.getLineStyle(), ht(e.getModel("axisTick").getLineStyle(), {
        stroke: e.get(["axisLine", "lineStyle", "color"])
      })), h = 0; h < o.length; h++)
        for (var c = sb(o[h], t.transform, l, u, "minorticks_" + h), f = 0; f < c.length; f++)
          r.add(c[f]);
  }
}
function l2(r, t, e, i) {
  var n = e.axis, a = Be(i.axisLabelShow, e.get(["axisLabel", "show"]));
  if (!(!a || n.scale.isBlank())) {
    var o = e.getModel("axisLabel"), s = o.get("margin"), l = n.getViewLabels(), u = (Be(i.labelRotate, o.get("rotate")) || 0) * br / 180, h = Tr.innerTextLayout(i.rotation, u, i.labelDirection), c = e.getCategories && e.getCategories(!0), f = [], d = Tr.isLabelSilent(e), v = e.get("triggerEvent");
    return T(l, function(g, p) {
      var y = n.scale.type === "ordinal" ? n.scale.getRawOrdinalNumber(g.tickValue) : g.tickValue, m = g.formattedLabel, _ = g.rawLabel, b = o;
      if (c && c[y]) {
        var w = c[y];
        U(w) && w.textStyle && (b = new bt(w.textStyle, o, e.ecModel));
      }
      var x = b.getTextColor() || e.get(["axisLine", "lineStyle", "color"]), S = n.dataToCoord(y), A = b.getShallow("align", !0) || h.textAlign, M = st(b.getShallow("alignMinLabel", !0), A), D = st(b.getShallow("alignMaxLabel", !0), A), C = b.getShallow("verticalAlign", !0) || b.getShallow("baseline", !0) || h.textVerticalAlign, I = st(b.getShallow("verticalAlignMinLabel", !0), C), L = st(b.getShallow("verticalAlignMaxLabel", !0), C), P = new Ht({
        x: S,
        y: i.labelOffset + i.labelDirection * s,
        rotation: h.rotation,
        silent: d,
        z2: 10 + (g.level || 0),
        style: Mr(b, {
          text: m,
          align: p === 0 ? M : p === l.length - 1 ? D : A,
          verticalAlign: p === 0 ? I : p === l.length - 1 ? L : C,
          fill: Q(x) ? x(
            // (1) In category axis with data zoom, tick is not the original
            // index of axis.data. So tick should not be exposed to user
            // in category axis.
            // (2) Compatible with previous version, which always use formatted label as
            // input. But in interval scale the formatted label is like '223,445', which
            // maked user replace ','. So we modify it to return original val but remain
            // it as 'string' to avoid error in replacing.
            n.type === "category" ? _ : n.type === "value" ? y + "" : y,
            p
          ) : x
        })
      });
      if (P.anid = "label_" + y, nl({
        el: P,
        componentModel: e,
        itemName: m,
        formatterParamsExtra: {
          isTruncated: function() {
            return P.isTruncated;
          },
          value: _,
          tickIndex: p
        }
      }), v) {
        var E = Tr.makeAxisEventDataBase(e);
        E.targetType = "axisLabel", E.value = _, E.tickIndex = p, n.type === "category" && (E.dataIndex = y), lt(P).eventData = E;
      }
      t.add(P), P.updateTransform(), f.push(P), r.add(P), P.decomposeTransform();
    }), f;
  }
}
function u2(r, t) {
  var e = {
    /**
     * key: makeKey(axis.model)
     * value: {
     *      axis,
     *      coordSys,
     *      axisPointerModel,
     *      triggerTooltip,
     *      triggerEmphasis,
     *      involveSeries,
     *      snap,
     *      seriesModels,
     *      seriesDataCount
     * }
     */
    axesInfo: {},
    seriesInvolved: !1,
    /**
     * key: makeKey(coordSys.model)
     * value: Object: key makeKey(axis.model), value: axisInfo
     */
    coordSysAxesInfo: {},
    coordSysMap: {}
  };
  return h2(e, r, t), e.seriesInvolved && f2(e, r), e;
}
function h2(r, t, e) {
  var i = t.getComponent("tooltip"), n = t.getComponent("axisPointer"), a = n.get("link", !0) || [], o = [];
  T(e.getCoordinateSystems(), function(s) {
    if (!s.axisPointerEnabled)
      return;
    var l = Fa(s.model), u = r.coordSysAxesInfo[l] = {};
    r.coordSysMap[l] = s;
    var h = s.model, c = h.getModel("tooltip", i);
    if (T(s.getAxes(), et(g, !1, null)), s.getTooltipAxes && i && c.get("show")) {
      var f = c.get("trigger") === "axis", d = c.get(["axisPointer", "type"]) === "cross", v = s.getTooltipAxes(c.get(["axisPointer", "axis"]));
      (f || d) && T(v.baseAxes, et(g, d ? "cross" : !0, f)), d && T(v.otherAxes, et(g, "cross", !1));
    }
    function g(p, y, m) {
      var _ = m.model.getModel("axisPointer", n), b = _.get("show");
      if (!(!b || b === "auto" && !p && !ec(_))) {
        y == null && (y = _.get("triggerTooltip")), _ = p ? c2(m, c, n, t, p, y) : _;
        var w = _.get("snap"), x = _.get("triggerEmphasis"), S = Fa(m.model), A = y || w || m.type === "category", M = r.axesInfo[S] = {
          key: S,
          axis: m,
          coordSys: s,
          axisPointerModel: _,
          triggerTooltip: y,
          triggerEmphasis: x,
          involveSeries: A,
          snap: w,
          useHandle: ec(_),
          seriesModels: [],
          linkGroup: null
        };
        u[S] = M, r.seriesInvolved = r.seriesInvolved || A;
        var D = d2(a, m);
        if (D != null) {
          var C = o[D] || (o[D] = {
            axesInfo: {}
          });
          C.axesInfo[S] = M, C.mapper = a[D].mapper, M.linkGroup = C;
        }
      }
    }
  });
}
function c2(r, t, e, i, n, a) {
  var o = t.getModel("axisPointer"), s = ["type", "snap", "lineStyle", "shadowStyle", "label", "animation", "animationDurationUpdate", "animationEasingUpdate", "z"], l = {};
  T(s, function(f) {
    l[f] = K(o.get(f));
  }), l.snap = r.type !== "category" && !!a, o.get("type") === "cross" && (l.type = "line");
  var u = l.label || (l.label = {});
  if (u.show == null && (u.show = !1), n === "cross") {
    var h = o.get(["label", "show"]);
    if (u.show = h ?? !0, !a) {
      var c = l.lineStyle = o.get("crossStyle");
      c && ht(u, c.textStyle);
    }
  }
  return r.model.getModel("axisPointer", new bt(l, e, i));
}
function f2(r, t) {
  t.eachSeries(function(e) {
    var i = e.coordinateSystem, n = e.get(["tooltip", "trigger"], !0), a = e.get(["tooltip", "show"], !0);
    !i || n === "none" || n === !1 || n === "item" || a === !1 || e.get(["axisPointer", "show"], !0) === !1 || T(r.coordSysAxesInfo[Fa(i.model)], function(o) {
      var s = o.axis;
      i.getAxis(s.dim) === s && (o.seriesModels.push(e), o.seriesDataCount == null && (o.seriesDataCount = 0), o.seriesDataCount += e.getData().count());
    });
  });
}
function d2(r, t) {
  for (var e = t.model, i = t.dim, n = 0; n < r.length; n++) {
    var a = r[n] || {};
    if (Bu(a[i + "AxisId"], e.id) || Bu(a[i + "AxisIndex"], e.componentIndex) || Bu(a[i + "AxisName"], e.name))
      return n;
  }
}
function Bu(r, t) {
  return r === "all" || B(r) && rt(r, t) >= 0 || r === t;
}
function v2(r) {
  var t = zf(r);
  if (t) {
    var e = t.axisPointerModel, i = t.axis.scale, n = e.option, a = e.get("status"), o = e.get("value");
    o != null && (o = i.parse(o));
    var s = ec(e);
    a == null && (n.status = s ? "show" : "hide");
    var l = i.getExtent().slice();
    l[0] > l[1] && l.reverse(), // Pick a value on axis when initializing.
    (o == null || o > l[1]) && (o = l[1]), o < l[0] && (o = l[0]), n.value = o, s && (n.status = t.axis.scale.isBlank() ? "hide" : "show");
  }
}
function zf(r) {
  var t = (r.ecModel.getComponent("axisPointer") || {}).coordSysAxesInfo;
  return t && t.axesInfo[Fa(r)];
}
function p2(r) {
  var t = zf(r);
  return t && t.axisPointerModel;
}
function ec(r) {
  return !!r.get(["handle", "show"]);
}
function Fa(r) {
  return r.type + "||" + r.id;
}
var Cg = {}, lb = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e;
    }
    return t.prototype.render = function(e, i, n, a) {
      this.axisPointerClass && v2(e), r.prototype.render.apply(this, arguments), this._doUpdateAxisPointerClass(e, n, !0);
    }, t.prototype.updateAxisPointer = function(e, i, n, a) {
      this._doUpdateAxisPointerClass(e, n, !1);
    }, t.prototype.remove = function(e, i) {
      var n = this._axisPointer;
      n && n.remove(i);
    }, t.prototype.dispose = function(e, i) {
      this._disposeAxisPointer(i), r.prototype.dispose.apply(this, arguments);
    }, t.prototype._doUpdateAxisPointerClass = function(e, i, n) {
      var a = t.getAxisPointerClass(this.axisPointerClass);
      if (a) {
        var o = p2(e);
        o ? (this._axisPointer || (this._axisPointer = new a())).render(e, o, i, n) : this._disposeAxisPointer(i);
      }
    }, t.prototype._disposeAxisPointer = function(e) {
      this._axisPointer && this._axisPointer.dispose(e), this._axisPointer = null;
    }, t.registerAxisPointerClass = function(e, i) {
      Cg[e] = i;
    }, t.getAxisPointerClass = function(e) {
      return e && Cg[e];
    }, t.type = "axis", t;
  }(ne)
), rc = Tt();
function g2(r, t, e, i) {
  var n = e.axis;
  if (!n.scale.isBlank()) {
    var a = e.getModel("splitArea"), o = a.getModel("areaStyle"), s = o.get("color"), l = i.coordinateSystem.getRect(), u = n.getTicksCoords({
      tickModel: a,
      clamp: !0
    });
    if (u.length) {
      var h = s.length, c = rc(r).splitAreaColors, f = tt(), d = 0;
      if (c)
        for (var v = 0; v < u.length; v++) {
          var g = c.get(u[v].tickValue);
          if (g != null) {
            d = (g + (h - 1) * v) % h;
            break;
          }
        }
      var p = n.toGlobalCoord(u[0].coord), y = o.getAreaStyle();
      s = B(s) ? s : [s];
      for (var v = 1; v < u.length; v++) {
        var m = n.toGlobalCoord(u[v].coord), _ = void 0, b = void 0, w = void 0, x = void 0;
        n.isHorizontal() ? (_ = p, b = l.y, w = m - _, x = l.height, p = _ + w) : (_ = l.x, b = p, w = l.width, x = m - b, p = b + x);
        var S = u[v - 1].tickValue;
        S != null && f.set(S, d), t.add(new Mt({
          anid: S != null ? "area_" + S : null,
          shape: {
            x: _,
            y: b,
            width: w,
            height: x
          },
          style: ht({
            fill: s[d]
          }, y),
          autoBatch: !0,
          silent: !0
        })), d = (d + 1) % h;
      }
      rc(r).splitAreaColors = f;
    }
  }
}
function y2(r) {
  rc(r).splitAreaColors = null;
}
var m2 = ["axisLine", "axisTickLabel", "axisName"], _2 = ["splitArea", "splitLine", "minorSplitLine"], ub = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e.axisPointerClass = "CartesianAxisPointer", e;
    }
    return t.prototype.render = function(e, i, n, a) {
      this.group.removeAll();
      var o = this._axisGroup;
      if (this._axisGroup = new St(), this.group.add(this._axisGroup), !!e.get("show")) {
        var s = e.getCoordSysModel(), l = tc(s, e), u = new Tr(e, $({
          handleAutoShown: function(c) {
            for (var f = s.coordinateSystem.getCartesians(), d = 0; d < f.length; d++)
              if (qh(f[d].getOtherAxis(e.axis).scale))
                return !0;
            return !1;
          }
        }, l));
        T(m2, u.add, u), this._axisGroup.add(u.getGroup()), T(_2, function(c) {
          e.get([c, "show"]) && b2[c](this, this._axisGroup, e, s);
        }, this);
        var h = a && a.type === "changeAxisOrder" && a.isInitSort;
        h || t0(o, this._axisGroup, e), r.prototype.render.call(this, e, i, n, a);
      }
    }, t.prototype.remove = function() {
      y2(this);
    }, t.type = "cartesianAxis", t;
  }(lb)
), b2 = {
  splitLine: function(r, t, e, i) {
    var n = e.axis;
    if (!n.scale.isBlank()) {
      var a = e.getModel("splitLine"), o = a.getModel("lineStyle"), s = o.get("color"), l = a.get("showMinLine") !== !1, u = a.get("showMaxLine") !== !1;
      s = B(s) ? s : [s];
      for (var h = i.coordinateSystem.getRect(), c = n.isHorizontal(), f = 0, d = n.getTicksCoords({
        tickModel: a
      }), v = [], g = [], p = o.getLineStyle(), y = 0; y < d.length; y++) {
        var m = n.toGlobalCoord(d[y].coord);
        if (!(y === 0 && !l || y === d.length - 1 && !u)) {
          var _ = d[y].tickValue;
          c ? (v[0] = m, v[1] = h.y, g[0] = m, g[1] = h.y + h.height) : (v[0] = h.x, v[1] = m, g[0] = h.x + h.width, g[1] = m);
          var b = f++ % s.length, w = new Ar({
            anid: _ != null ? "line_" + _ : null,
            autoBatch: !0,
            shape: {
              x1: v[0],
              y1: v[1],
              x2: g[0],
              y2: g[1]
            },
            style: ht({
              stroke: s[b]
            }, p),
            silent: !0
          });
          Ea(w.shape, p.lineWidth), t.add(w);
        }
      }
    }
  },
  minorSplitLine: function(r, t, e, i) {
    var n = e.axis, a = e.getModel("minorSplitLine"), o = a.getModel("lineStyle"), s = i.coordinateSystem.getRect(), l = n.isHorizontal(), u = n.getMinorTicksCoords();
    if (u.length)
      for (var h = [], c = [], f = o.getLineStyle(), d = 0; d < u.length; d++)
        for (var v = 0; v < u[d].length; v++) {
          var g = n.toGlobalCoord(u[d][v].coord);
          l ? (h[0] = g, h[1] = s.y, c[0] = g, c[1] = s.y + s.height) : (h[0] = s.x, h[1] = g, c[0] = s.x + s.width, c[1] = g);
          var p = new Ar({
            anid: "minor_line_" + u[d][v].tickValue,
            autoBatch: !0,
            shape: {
              x1: h[0],
              y1: h[1],
              x2: c[0],
              y2: c[1]
            },
            style: f,
            silent: !0
          });
          Ea(p.shape, f.lineWidth), t.add(p);
        }
  },
  splitArea: function(r, t, e, i) {
    g2(r, t, e, i);
  }
}, hb = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e;
    }
    return t.type = "xAxis", t;
  }(ub)
), x2 = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = hb.type, e;
    }
    return t.type = "yAxis", t;
  }(ub)
), w2 = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = "grid", e;
    }
    return t.prototype.render = function(e, i) {
      this.group.removeAll(), e.get("show") && this.group.add(new Mt({
        shape: e.coordinateSystem.getRect(),
        style: ht({
          fill: e.get("backgroundColor")
        }, e.getItemStyle()),
        silent: !0,
        z2: -1
      }));
    }, t.type = "grid", t;
  }(ne)
), Ag = {
  // gridIndex: 0,
  // gridId: '',
  offset: 0
};
function S2(r) {
  r.registerComponentView(w2), r.registerComponentModel(Yk), r.registerCoordinateSystem("cartesian2d", r2), pg(r, "x", Qh, Ag), pg(r, "y", Qh, Ag), r.registerComponentView(hb), r.registerComponentView(x2), r.registerPreprocessor(function(t) {
    t.xAxis && t.yAxis && !t.grid && (t.grid = {});
  });
}
var Mg = "\0_ec_interaction_mutex";
function T2(r, t, e) {
  var i = Ff(r);
  i[t] = e;
}
function C2(r, t, e) {
  var i = Ff(r), n = i[t];
  n === e && (i[t] = null);
}
function Dg(r, t) {
  return !!Ff(r)[t];
}
function Ff(r) {
  return r[Mg] || (r[Mg] = {});
}
Ai({
  type: "takeGlobalCursor",
  event: "globalCursorTaken",
  update: "update"
}, Et);
var A2 = (
  /** @class */
  function(r) {
    N(t, r);
    function t(e) {
      var i = r.call(this) || this;
      i._zr = e;
      var n = at(i._mousedownHandler, i), a = at(i._mousemoveHandler, i), o = at(i._mouseupHandler, i), s = at(i._mousewheelHandler, i), l = at(i._pinchHandler, i);
      return i.enable = function(u, h) {
        this.disable(), this._opt = ht(K(h) || {}, {
          zoomOnMouseWheel: !0,
          moveOnMouseMove: !0,
          // By default, wheel do not trigger move.
          moveOnMouseWheel: !1,
          preventDefaultMouseMove: !0
        }), u == null && (u = !0), (u === !0 || u === "move" || u === "pan") && (e.on("mousedown", n), e.on("mousemove", a), e.on("mouseup", o)), (u === !0 || u === "scale" || u === "zoom") && (e.on("mousewheel", s), e.on("pinch", l));
      }, i.disable = function() {
        e.off("mousedown", n), e.off("mousemove", a), e.off("mouseup", o), e.off("mousewheel", s), e.off("pinch", l);
      }, i;
    }
    return t.prototype.isDragging = function() {
      return this._dragging;
    }, t.prototype.isPinching = function() {
      return this._pinching;
    }, t.prototype.setPointerChecker = function(e) {
      this.pointerChecker = e;
    }, t.prototype.dispose = function() {
      this.disable();
    }, t.prototype._mousedownHandler = function(e) {
      if (!gd(e)) {
        for (var i = e.target; i; ) {
          if (i.draggable)
            return;
          i = i.__hostTarget || i.parent;
        }
        var n = e.offsetX, a = e.offsetY;
        this.pointerChecker && this.pointerChecker(e, n, a) && (this._x = n, this._y = a, this._dragging = !0);
      }
    }, t.prototype._mousemoveHandler = function(e) {
      if (!(!this._dragging || !os("moveOnMouseMove", e, this._opt) || e.gestureEvent === "pinch" || Dg(this._zr, "globalPan"))) {
        var i = e.offsetX, n = e.offsetY, a = this._x, o = this._y, s = i - a, l = n - o;
        this._x = i, this._y = n, this._opt.preventDefaultMouseMove && Xs(e.event), cb(this, "pan", "moveOnMouseMove", e, {
          dx: s,
          dy: l,
          oldX: a,
          oldY: o,
          newX: i,
          newY: n,
          isAvailableBehavior: null
        });
      }
    }, t.prototype._mouseupHandler = function(e) {
      gd(e) || (this._dragging = !1);
    }, t.prototype._mousewheelHandler = function(e) {
      var i = os("zoomOnMouseWheel", e, this._opt), n = os("moveOnMouseWheel", e, this._opt), a = e.wheelDelta, o = Math.abs(a), s = e.offsetX, l = e.offsetY;
      if (!(a === 0 || !i && !n)) {
        if (i) {
          var u = o > 3 ? 1.4 : o > 1 ? 1.2 : 1.1, h = a > 0 ? u : 1 / u;
          zu(this, "zoom", "zoomOnMouseWheel", e, {
            scale: h,
            originX: s,
            originY: l,
            isAvailableBehavior: null
          });
        }
        if (n) {
          var c = Math.abs(a), f = (a > 0 ? 1 : -1) * (c > 3 ? 0.4 : c > 1 ? 0.15 : 0.05);
          zu(this, "scrollMove", "moveOnMouseWheel", e, {
            scrollDelta: f,
            originX: s,
            originY: l,
            isAvailableBehavior: null
          });
        }
      }
    }, t.prototype._pinchHandler = function(e) {
      if (!Dg(this._zr, "globalPan")) {
        var i = e.pinchScale > 1 ? 1.1 : 1 / 1.1;
        zu(this, "zoom", null, e, {
          scale: i,
          originX: e.pinchX,
          originY: e.pinchY,
          isAvailableBehavior: null
        });
      }
    }, t;
  }(be)
);
function zu(r, t, e, i, n) {
  r.pointerChecker && r.pointerChecker(i, n.originX, n.originY) && (Xs(i.event), cb(r, t, e, i, n));
}
function cb(r, t, e, i, n) {
  n.isAvailableBehavior = at(os, null, e, i), r.trigger(t, n);
}
function os(r, t, e) {
  var i = e[r];
  return !r || i && (!V(i) || t.event[i + "Key"]);
}
var M2 = {
  axisPointer: 1,
  tooltip: 1,
  brush: 1
};
function D2(r, t, e) {
  var i = t.getComponentByElement(r.topTarget), n = i && i.coordinateSystem;
  return i && i !== e && !M2.hasOwnProperty(i.mainType) && n && n.model !== e;
}
var _e = Tt();
function k2(r) {
  var t = r.mainData, e = r.datas;
  e || (e = {
    main: t
  }, r.datasAttr = {
    main: "data"
  }), r.datas = r.mainData = null, fb(t, e, r), T(e, function(i) {
    T(t.TRANSFERABLE_METHODS, function(n) {
      i.wrapMethod(n, et(I2, r));
    });
  }), t.wrapMethod("cloneShallow", et(P2, r)), T(t.CHANGABLE_METHODS, function(i) {
    t.wrapMethod(i, et(L2, r));
  }), ke(e[t.dataType] === t);
}
function I2(r, t) {
  if ($2(this)) {
    var e = $({}, _e(this).datas);
    e[this.dataType] = t, fb(t, e, r);
  } else
    Hf(t, this.dataType, _e(this).mainData, r);
  return t;
}
function L2(r, t) {
  return r.struct && r.struct.update(), t;
}
function P2(r, t) {
  return T(_e(t).datas, function(e, i) {
    e !== t && Hf(e.cloneShallow(), i, t, r);
  }), t;
}
function E2(r) {
  var t = _e(this).mainData;
  return r == null || t == null ? t : _e(t).datas[r];
}
function R2() {
  var r = _e(this).mainData;
  return r == null ? [{
    data: r
  }] : H(xt(_e(r).datas), function(t) {
    return {
      type: t,
      data: _e(r).datas[t]
    };
  });
}
function $2(r) {
  return _e(r).mainData === r;
}
function fb(r, t, e) {
  _e(r).datas = {}, T(t, function(i, n) {
    Hf(i, n, r, e);
  });
}
function Hf(r, t, e, i) {
  _e(e).datas[t] = r, _e(r).mainData = e, r.dataType = t, i.struct && (r[i.structAttr] = i.struct, i.struct[i.datasAttr[t]] = r), r.getLinkedData = E2, r.getLinkedDataAll = R2;
}
var O2 = (
  /** @class */
  function() {
    function r(t, e) {
      this.depth = 0, this.height = 0, this.dataIndex = -1, this.children = [], this.viewChildren = [], this.isExpand = !1, this.name = t || "", this.hostTree = e;
    }
    return r.prototype.isRemoved = function() {
      return this.dataIndex < 0;
    }, r.prototype.eachNode = function(t, e, i) {
      Q(t) && (i = e, e = t, t = null), t = t || {}, V(t) && (t = {
        order: t
      });
      var n = t.order || "preorder", a = this[t.attr || "children"], o;
      n === "preorder" && (o = e.call(i, this));
      for (var s = 0; !o && s < a.length; s++)
        a[s].eachNode(t, e, i);
      n === "postorder" && e.call(i, this);
    }, r.prototype.updateDepthAndHeight = function(t) {
      var e = 0;
      this.depth = t;
      for (var i = 0; i < this.children.length; i++) {
        var n = this.children[i];
        n.updateDepthAndHeight(t + 1), n.height > e && (e = n.height);
      }
      this.height = e + 1;
    }, r.prototype.getNodeById = function(t) {
      if (this.getId() === t)
        return this;
      for (var e = 0, i = this.children, n = i.length; e < n; e++) {
        var a = i[e].getNodeById(t);
        if (a)
          return a;
      }
    }, r.prototype.contains = function(t) {
      if (t === this)
        return !0;
      for (var e = 0, i = this.children, n = i.length; e < n; e++) {
        var a = i[e].contains(t);
        if (a)
          return a;
      }
    }, r.prototype.getAncestors = function(t) {
      for (var e = [], i = t ? this : this.parentNode; i; )
        e.push(i), i = i.parentNode;
      return e.reverse(), e;
    }, r.prototype.getAncestorsIndices = function() {
      for (var t = [], e = this; e; )
        t.push(e.dataIndex), e = e.parentNode;
      return t.reverse(), t;
    }, r.prototype.getDescendantIndices = function() {
      var t = [];
      return this.eachNode(function(e) {
        t.push(e.dataIndex);
      }), t;
    }, r.prototype.getValue = function(t) {
      var e = this.hostTree.data;
      return e.getStore().get(e.getDimensionIndex(t || "value"), this.dataIndex);
    }, r.prototype.setLayout = function(t, e) {
      this.dataIndex >= 0 && this.hostTree.data.setItemLayout(this.dataIndex, t, e);
    }, r.prototype.getLayout = function() {
      return this.hostTree.data.getItemLayout(this.dataIndex);
    }, r.prototype.getModel = function(t) {
      if (!(this.dataIndex < 0)) {
        var e = this.hostTree, i = e.data.getItemModel(this.dataIndex);
        return i.getModel(t);
      }
    }, r.prototype.getLevelModel = function() {
      return (this.hostTree.levelModels || [])[this.depth];
    }, r.prototype.setVisual = function(t, e) {
      this.dataIndex >= 0 && this.hostTree.data.setItemVisual(this.dataIndex, t, e);
    }, r.prototype.getVisual = function(t) {
      return this.hostTree.data.getItemVisual(this.dataIndex, t);
    }, r.prototype.getRawIndex = function() {
      return this.hostTree.data.getRawIndex(this.dataIndex);
    }, r.prototype.getId = function() {
      return this.hostTree.data.getId(this.dataIndex);
    }, r.prototype.getChildIndex = function() {
      if (this.parentNode) {
        for (var t = this.parentNode.children, e = 0; e < t.length; ++e)
          if (t[e] === this)
            return e;
        return -1;
      }
      return -1;
    }, r.prototype.isAncestorOf = function(t) {
      for (var e = t.parentNode; e; ) {
        if (e === this)
          return !0;
        e = e.parentNode;
      }
      return !1;
    }, r.prototype.isDescendantOf = function(t) {
      return t !== this && t.isAncestorOf(this);
    }, r;
  }()
), N2 = (
  /** @class */
  function() {
    function r(t) {
      this.type = "tree", this._nodes = [], this.hostModel = t;
    }
    return r.prototype.eachNode = function(t, e, i) {
      this.root.eachNode(t, e, i);
    }, r.prototype.getNodeByDataIndex = function(t) {
      var e = this.data.getRawIndex(t);
      return this._nodes[e];
    }, r.prototype.getNodeById = function(t) {
      return this.root.getNodeById(t);
    }, r.prototype.update = function() {
      for (var t = this.data, e = this._nodes, i = 0, n = e.length; i < n; i++)
        e[i].dataIndex = -1;
      for (var i = 0, n = t.count(); i < n; i++)
        e[t.getRawIndex(i)].dataIndex = i;
    }, r.prototype.clearLayouts = function() {
      this.data.clearItemLayouts();
    }, r.createTree = function(t, e, i) {
      var n = new r(e), a = [], o = 1;
      s(t);
      function s(h, c) {
        var f = h.value;
        o = Math.max(o, B(f) ? f.length : 1), a.push(h);
        var d = new O2(ie(h.name, ""), n);
        c ? B2(d, c) : n.root = d, n._nodes.push(d);
        var v = h.children;
        if (v)
          for (var g = 0; g < v.length; g++)
            s(v[g], d);
      }
      n.root.updateDepthAndHeight(0);
      var l = L_(a, {
        coordDimensions: ["value"],
        dimensionsCount: o
      }).dimensions, u = new Ns(l, e);
      return u.initData(a), i && i(u), k2({
        mainData: u,
        struct: n,
        structAttr: "tree"
      }), n.update(), n;
    }, r;
  }()
);
function B2(r, t) {
  var e = t.children;
  r.parentNode !== t && (e.push(r), r.parentNode = t);
}
function Vf(r, t, e) {
  if (r && rt(t, r.type) >= 0) {
    var i = e.getData().tree.root, n = r.targetNode;
    if (V(n) && (n = i.getNodeById(n)), n && i.contains(n))
      return {
        node: n
      };
    var a = r.targetNodeId;
    if (a != null && (n = i.getNodeById(a)))
      return {
        node: n
      };
  }
}
function db(r) {
  for (var t = []; r; )
    r = r.parentNode, r && t.push(r);
  return t.reverse();
}
function vb(r, t) {
  var e = db(r);
  return rt(e, t) >= 0;
}
function pb(r, t) {
  for (var e = []; r; ) {
    var i = r.dataIndex;
    e.push({
      name: r.name,
      dataIndex: i,
      value: t.getRawValue(i)
    }), r = r.parentNode;
  }
  return e.reverse(), e;
}
var kg = ["treemapZoomToNode", "treemapRender", "treemapMove"];
function z2(r) {
  for (var t = 0; t < kg.length; t++)
    r.registerAction({
      type: kg[t],
      update: "updateView"
    }, Et);
  r.registerAction({
    type: "treemapRootToNode",
    update: "updateView"
  }, function(e, i) {
    i.eachComponent({
      mainType: "series",
      subType: "treemap",
      query: e
    }, n);
    function n(a, o) {
      var s = ["treemapZoomToNode", "treemapRootToNode"], l = Vf(e, s, a);
      if (l) {
        var u = a.getViewRoot();
        u && (e.direction = vb(u, l.node) ? "rollUp" : "drillDown"), a.resetViewRoot(l.node);
      }
    }
  });
}
function F2(r) {
  var t = r.getData(), e = t.tree, i = {};
  e.eachNode(function(n) {
    for (var a = n; a && a.depth > 1; )
      a = a.parentNode;
    var o = fC(r.ecModel, a.name || a.dataIndex + "", i);
    n.setVisual("decal", o);
  });
}
var H2 = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e.preventUsingHoverLayer = !0, e;
    }
    return t.prototype.getInitialData = function(e, i) {
      var n = {
        name: e.name,
        children: e.data
      };
      gb(n);
      var a = e.levels || [], o = this.designatedVisualItemStyle = {}, s = new bt({
        itemStyle: o
      }, this, i);
      a = e.levels = V2(a, i);
      var l = H(a || [], function(c) {
        return new bt(c, s, i);
      }, this), u = N2.createTree(n, this, h);
      function h(c) {
        c.wrapMethod("getItemModel", function(f, d) {
          var v = u.getNodeByDataIndex(d), g = v ? l[v.depth] : null;
          return f.parentModel = g || s, f;
        });
      }
      return u.data;
    }, t.prototype.optionUpdated = function() {
      this.resetViewRoot();
    }, t.prototype.formatTooltip = function(e, i, n) {
      var a = this.getData(), o = this.getRawValue(e), s = a.getName(e);
      return Dr("nameValue", {
        name: s,
        value: o
      });
    }, t.prototype.getDataParams = function(e) {
      var i = r.prototype.getDataParams.apply(this, arguments), n = this.getData().tree.getNodeByDataIndex(e);
      return i.treeAncestors = pb(n, this), i.treePathInfo = i.treeAncestors, i;
    }, t.prototype.setLayoutInfo = function(e) {
      this.layoutInfo = this.layoutInfo || {}, $(this.layoutInfo, e);
    }, t.prototype.mapIdToIndex = function(e) {
      var i = this._idIndexMap;
      i || (i = this._idIndexMap = tt(), this._idIndexMapCount = 0);
      var n = i.get(e);
      return n == null && i.set(e, n = this._idIndexMapCount++), n;
    }, t.prototype.getViewRoot = function() {
      return this._viewRoot;
    }, t.prototype.resetViewRoot = function(e) {
      e ? this._viewRoot = e : e = this._viewRoot;
      var i = this.getRawData().tree.root;
      (!e || e !== i && !i.contains(e)) && (this._viewRoot = i);
    }, t.prototype.enableAriaDecal = function() {
      F2(this);
    }, t.type = "series.treemap", t.layoutMode = "box", t.defaultOption = {
      // Disable progressive rendering
      progressive: 0,
      // size: ['80%', '80%'],            // deprecated, compatible with ec2.
      left: "center",
      top: "middle",
      width: "80%",
      height: "80%",
      sort: !0,
      clipWindow: "origin",
      squareRatio: 0.5 * (1 + Math.sqrt(5)),
      leafDepth: null,
      drillDownIcon: "▶",
      // to align specialized icon. ▷▶❒❐▼✚
      zoomToNodeRatio: 0.32 * 0.32,
      scaleLimit: null,
      roam: !0,
      nodeClick: "zoomToNode",
      animation: !0,
      animationDurationUpdate: 900,
      animationEasing: "quinticInOut",
      breadcrumb: {
        show: !0,
        height: 22,
        left: "center",
        top: "bottom",
        // right
        // bottom
        emptyItemWidth: 25,
        itemStyle: {
          color: "rgba(0,0,0,0.7)",
          textStyle: {
            color: "#fff"
          }
        },
        emphasis: {
          itemStyle: {
            color: "rgba(0,0,0,0.9)"
            // '#5793f3',
          }
        }
      },
      label: {
        show: !0,
        // Do not use textDistance, for ellipsis rect just the same as treemap node rect.
        distance: 0,
        padding: 5,
        position: "inside",
        // formatter: null,
        color: "#fff",
        overflow: "truncate"
        // align
        // verticalAlign
      },
      upperLabel: {
        show: !1,
        position: [0, "50%"],
        height: 20,
        // formatter: null,
        // color: '#fff',
        overflow: "truncate",
        // align: null,
        verticalAlign: "middle"
      },
      itemStyle: {
        color: null,
        colorAlpha: null,
        colorSaturation: null,
        borderWidth: 0,
        gapWidth: 0,
        borderColor: "#fff",
        borderColorSaturation: null
        // If specified, borderColor will be ineffective, and the
        // border color is evaluated by color of current node and
        // borderColorSaturation.
      },
      emphasis: {
        upperLabel: {
          show: !0,
          position: [0, "50%"],
          overflow: "truncate",
          verticalAlign: "middle"
        }
      },
      visualDimension: 0,
      visualMin: null,
      visualMax: null,
      color: [],
      // level[n].color (if necessary).
      // + Specify color list of each level. level[0].color would be global
      // color list if not specified. (see method `setDefault`).
      // + But set as a empty array to forbid fetch color from global palette
      // when using nodeModel.get('color'), otherwise nodes on deep level
      // will always has color palette set and are not able to inherit color
      // from parent node.
      // + TreemapSeries.color can not be set as 'none', otherwise effect
      // legend color fetching (see seriesColor.js).
      colorAlpha: null,
      colorSaturation: null,
      colorMappingBy: "index",
      visibleMin: 10,
      // be rendered. Only works when sort is 'asc' or 'desc'.
      childrenVisibleMin: null,
      // grandchildren will not show.
      // Why grandchildren? If not grandchildren but children,
      // some siblings show children and some not,
      // the appearance may be mess and not consistent,
      levels: []
      // Each item: {
      //     visibleMin, itemStyle, visualDimension, label
      // }
    }, t;
  }(Ie)
);
function gb(r) {
  var t = 0;
  T(r.children, function(i) {
    gb(i);
    var n = i.value;
    B(n) && (n = n[0]), t += n;
  });
  var e = r.value;
  B(e) && (e = e[0]), (e == null || isNaN(e)) && (e = t), e < 0 && (e = 0), B(r.value) ? r.value[0] = e : r.value = e;
}
function V2(r, t) {
  var e = Rt(t.get("color")), i = Rt(t.get(["aria", "decal", "decals"]));
  if (e) {
    r = r || [];
    var n, a;
    T(r, function(s) {
      var l = new bt(s), u = l.get("color"), h = l.get("decal");
      (l.get(["itemStyle", "color"]) || u && u !== "none") && (n = !0), (l.get(["itemStyle", "decal"]) || h && h !== "none") && (a = !0);
    });
    var o = r[0] || (r[0] = {});
    return n || (o.color = e.slice()), !a && i && (o.decal = i.slice()), r;
  }
}
var G2 = 8, Ig = 8, Fu = 5, W2 = (
  /** @class */
  function() {
    function r(t) {
      this.group = new St(), t.add(this.group);
    }
    return r.prototype.render = function(t, e, i, n) {
      var a = t.getModel("breadcrumb"), o = this.group;
      if (o.removeAll(), !(!a.get("show") || !i)) {
        var s = a.getModel("itemStyle"), l = a.getModel("emphasis"), u = s.getModel("textStyle"), h = l.getModel(["itemStyle", "textStyle"]), c = {
          pos: {
            left: a.get("left"),
            right: a.get("right"),
            top: a.get("top"),
            bottom: a.get("bottom")
          },
          box: {
            width: e.getWidth(),
            height: e.getHeight()
          },
          emptyItemWidth: a.get("emptyItemWidth"),
          totalWidth: 0,
          renderList: []
        };
        this._prepare(i, c, u), this._renderContent(t, c, s, l, u, h, n), tC(o, c.pos, c.box);
      }
    }, r.prototype._prepare = function(t, e, i) {
      for (var n = t; n; n = n.parentNode) {
        var a = ie(n.getModel().get("name"), ""), o = i.getTextRect(a), s = Math.max(o.width + G2 * 2, e.emptyItemWidth);
        e.totalWidth += s + Ig, e.renderList.push({
          node: n,
          text: a,
          width: s
        });
      }
    }, r.prototype._renderContent = function(t, e, i, n, a, o, s) {
      for (var l = 0, u = e.emptyItemWidth, h = t.get(["breadcrumb", "height"]), c = JT(e.pos, e.box), f = e.totalWidth, d = e.renderList, v = n.getModel("itemStyle").getItemStyle(), g = d.length - 1; g >= 0; g--) {
        var p = d[g], y = p.node, m = p.width, _ = p.text;
        f > c.width && (f -= m - u, m = u, _ = null);
        var b = new xi({
          shape: {
            points: U2(l, 0, m, h, g === d.length - 1, g === 0)
          },
          style: ht(i.getItemStyle(), {
            lineJoin: "bevel"
          }),
          textContent: new Ht({
            style: Mr(a, {
              text: _
            })
          }),
          textConfig: {
            position: "inside"
          },
          z2: Ka * 1e4,
          onclick: et(s, y)
        });
        b.disableLabelAnimation = !0, b.getTextContent().ensureState("emphasis").style = Mr(o, {
          text: _
        }), b.ensureState("emphasis").style = v, hn(b, n.get("focus"), n.get("blurScope"), n.get("disabled")), this.group.add(b), Y2(b, t, y), l += m + Ig;
      }
    }, r.prototype.remove = function() {
      this.group.removeAll();
    }, r;
  }()
);
function U2(r, t, e, i, n, a) {
  var o = [[n ? r : r - Fu, t], [r + e, t], [r + e, t + i], [n ? r : r - Fu, t + i]];
  return !a && o.splice(2, 0, [r + e + Fu, t + i / 2]), !n && o.push([r, t + i / 2]), o;
}
function Y2(r, t, e) {
  lt(r).eventData = {
    componentType: "series",
    componentSubType: "treemap",
    componentIndex: t.componentIndex,
    seriesIndex: t.seriesIndex,
    seriesName: t.name,
    seriesType: "treemap",
    selfType: "breadcrumb",
    nodeData: {
      dataIndex: e && e.dataIndex,
      name: e && e.name
    },
    treePathInfo: e && pb(e, t)
  };
}
var X2 = (
  /** @class */
  function() {
    function r() {
      this._storage = [], this._elExistsMap = {};
    }
    return r.prototype.add = function(t, e, i, n, a) {
      return this._elExistsMap[t.id] ? !1 : (this._elExistsMap[t.id] = !0, this._storage.push({
        el: t,
        target: e,
        duration: i,
        delay: n,
        easing: a
      }), !0);
    }, r.prototype.finished = function(t) {
      return this._finishedCallback = t, this;
    }, r.prototype.start = function() {
      for (var t = this, e = this._storage.length, i = function() {
        e--, e <= 0 && (t._storage.length = 0, t._elExistsMap = {}, t._finishedCallback && t._finishedCallback());
      }, n = 0, a = this._storage.length; n < a; n++) {
        var o = this._storage[n];
        o.el.animateTo(o.target, {
          duration: o.duration,
          delay: o.delay,
          easing: o.easing,
          setToFinal: !0,
          done: i,
          aborted: i
        });
      }
      return this;
    }, r;
  }()
);
function Z2() {
  return new X2();
}
var ic = St, Lg = Mt, Pg = 3, Eg = "label", Rg = "upperLabel", q2 = Ka * 10, K2 = Ka * 2, j2 = Ka * 3, ti = un([
  ["fill", "color"],
  // `borderColor` and `borderWidth` has been occupied,
  // so use `stroke` to indicate the stroke of the rect.
  ["stroke", "strokeColor"],
  ["lineWidth", "strokeWidth"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["shadowColor"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
]), $g = function(r) {
  var t = ti(r);
  return t.stroke = t.fill = t.lineWidth = null, t;
}, Bs = Tt(), Q2 = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e._state = "ready", e._storage = Yn(), e;
    }
    return t.prototype.render = function(e, i, n, a) {
      var o = i.findComponents({
        mainType: "series",
        subType: "treemap",
        query: a
      });
      if (!(rt(o, e) < 0)) {
        this.seriesModel = e, this.api = n, this.ecModel = i;
        var s = ["treemapZoomToNode", "treemapRootToNode"], l = Vf(a, s, e), u = a && a.type, h = e.layoutInfo, c = !this._oldTree, f = this._storage, d = u === "treemapRootToNode" && l && f ? {
          rootNodeGroup: f.nodeGroup[l.node.getRawIndex()],
          direction: a.direction
        } : null, v = this._giveContainerGroup(h), g = e.get("animation"), p = this._doRender(v, e, d);
        g && !c && (!u || u === "treemapZoomToNode" || u === "treemapRootToNode") ? this._doAnimation(v, p, e, d) : p.renderFinally(), this._resetController(n), this._renderBreadcrumb(e, n, l);
      }
    }, t.prototype._giveContainerGroup = function(e) {
      var i = this._containerGroup;
      return i || (i = this._containerGroup = new ic(), this._initEvents(i), this.group.add(i)), i.x = e.x, i.y = e.y, i;
    }, t.prototype._doRender = function(e, i, n) {
      var a = i.getData().tree, o = this._oldTree, s = Yn(), l = Yn(), u = this._storage, h = [];
      function c(m, _, b, w) {
        return J2(i, l, u, n, s, h, m, _, b, w);
      }
      g(a.root ? [a.root] : [], o && o.root ? [o.root] : [], e, a === o || !o, 0);
      var f = p(u);
      if (this._oldTree = a, this._storage = l, this._controllerHost) {
        var d = this.seriesModel.layoutInfo, v = a.root.getLayout();
        v.width === d.width && v.height === d.height && (this._controllerHost.zoom = 1);
      }
      return {
        lastsForAnimation: s,
        willDeleteEls: f,
        renderFinally: y
      };
      function g(m, _, b, w, x) {
        w ? (_ = m, T(m, function(M, D) {
          !M.isRemoved() && A(D, D);
        })) : new kf(_, m, S, S).add(A).update(A).remove(et(A, null)).execute();
        function S(M) {
          return M.getId();
        }
        function A(M, D) {
          var C = M != null ? m[M] : null, I = D != null ? _[D] : null, L = c(C, I, b, x);
          L && g(C && C.viewChildren || [], I && I.viewChildren || [], L, w, x + 1);
        }
      }
      function p(m) {
        var _ = Yn();
        return m && T(m, function(b, w) {
          var x = _[w];
          T(b, function(S) {
            S && (x.push(S), Bs(S).willDelete = !0);
          });
        }), _;
      }
      function y() {
        T(f, function(m) {
          T(m, function(_) {
            _.parent && _.parent.remove(_);
          });
        }), T(h, function(m) {
          m.invisible = !0, m.dirty();
        });
      }
    }, t.prototype._doAnimation = function(e, i, n, a) {
      var o = n.get("animationDurationUpdate"), s = n.get("animationEasing"), l = (Q(o) ? 0 : o) || 0, u = (Q(s) ? null : s) || "cubicOut", h = Z2();
      T(i.willDeleteEls, function(c, f) {
        T(c, function(d, v) {
          if (!d.invisible) {
            var g = d.parent, p, y = Bs(g);
            if (a && a.direction === "drillDown")
              p = g === a.rootNodeGroup ? {
                shape: {
                  x: 0,
                  y: 0,
                  width: y.nodeWidth,
                  height: y.nodeHeight
                },
                style: {
                  opacity: 0
                }
              } : {
                style: {
                  opacity: 0
                }
              };
            else {
              var m = 0, _ = 0;
              y.willDelete || (m = y.nodeWidth / 2, _ = y.nodeHeight / 2), p = f === "nodeGroup" ? {
                x: m,
                y: _,
                style: {
                  opacity: 0
                }
              } : {
                shape: {
                  x: m,
                  y: _,
                  width: 0,
                  height: 0
                },
                style: {
                  opacity: 0
                }
              };
            }
            p && h.add(d, p, l, 0, u);
          }
        });
      }), T(this._storage, function(c, f) {
        T(c, function(d, v) {
          var g = i.lastsForAnimation[f][v], p = {};
          g && (d instanceof St ? g.oldX != null && (p.x = d.x, p.y = d.y, d.x = g.oldX, d.y = g.oldY) : (g.oldShape && (p.shape = $({}, d.shape), d.setShape(g.oldShape)), g.fadein ? (d.setStyle("opacity", 0), p.style = {
            opacity: 1
          }) : d.style.opacity !== 1 && (p.style = {
            opacity: 1
          })), h.add(d, p, l, 0, u));
        });
      }, this), this._state = "animating", h.finished(at(function() {
        this._state = "ready", i.renderFinally();
      }, this)).start();
    }, t.prototype._resetController = function(e) {
      var i = this._controller, n = this._controllerHost;
      n || (this._controllerHost = {
        target: this.group
      }, n = this._controllerHost), i || (i = this._controller = new A2(e.getZr()), i.enable(this.seriesModel.get("roam")), n.zoomLimit = this.seriesModel.get("scaleLimit"), n.zoom = this.seriesModel.get("zoom"), i.on("pan", at(this._onPan, this)), i.on("zoom", at(this._onZoom, this)));
      var a = new ot(0, 0, e.getWidth(), e.getHeight());
      i.setPointerChecker(function(o, s, l) {
        return a.contain(s, l);
      });
    }, t.prototype._clearController = function() {
      var e = this._controller;
      this._controllerHost = null, e && (e.dispose(), e = null);
    }, t.prototype._onPan = function(e) {
      if (this._state !== "animating" && (Math.abs(e.dx) > Pg || Math.abs(e.dy) > Pg)) {
        var i = this.seriesModel.getData().tree.root;
        if (!i)
          return;
        var n = i.getLayout();
        if (!n)
          return;
        this.api.dispatchAction({
          type: "treemapMove",
          from: this.uid,
          seriesId: this.seriesModel.id,
          rootRect: {
            x: n.x + e.dx,
            y: n.y + e.dy,
            width: n.width,
            height: n.height
          }
        });
      }
    }, t.prototype._onZoom = function(e) {
      var i = e.originX, n = e.originY, a = e.scale;
      if (this._state !== "animating") {
        var o = this.seriesModel.getData().tree.root;
        if (!o)
          return;
        var s = o.getLayout();
        if (!s)
          return;
        var l = new ot(s.x, s.y, s.width, s.height), u = null, h = this._controllerHost;
        u = h.zoomLimit;
        var c = h.zoom = h.zoom || 1;
        if (c *= a, u) {
          var f = u.min || 0, d = u.max || 1 / 0;
          c = Math.max(Math.min(d, c), f);
        }
        var v = c / h.zoom;
        h.zoom = c;
        var g = this.seriesModel.layoutInfo;
        i -= g.x, n -= g.y;
        var p = ui();
        Da(p, p, [-i, -n]), Qy(p, p, [v, v]), Da(p, p, [i, n]), l.applyTransform(p), this.api.dispatchAction({
          type: "treemapRender",
          from: this.uid,
          seriesId: this.seriesModel.id,
          rootRect: {
            x: l.x,
            y: l.y,
            width: l.width,
            height: l.height
          }
        });
      }
    }, t.prototype._initEvents = function(e) {
      var i = this;
      e.on("click", function(n) {
        if (i._state === "ready") {
          var a = i.seriesModel.get("nodeClick", !0);
          if (a) {
            var o = i.findTarget(n.offsetX, n.offsetY);
            if (o) {
              var s = o.node;
              if (s.getLayout().isLeafRoot)
                i._rootToNode(o);
              else if (a === "zoomToNode")
                i._zoomToNode(o);
              else if (a === "link") {
                var l = s.hostTree.data.getItemModel(s.dataIndex), u = l.get("link", !0), h = l.get("target", !0) || "blank";
                u && jT(u, h);
              }
            }
          }
        }
      }, this);
    }, t.prototype._renderBreadcrumb = function(e, i, n) {
      var a = this;
      n || (n = e.get("leafDepth", !0) != null ? {
        node: e.getViewRoot()
      } : this.findTarget(i.getWidth() / 2, i.getHeight() / 2), n || (n = {
        node: e.getData().tree.root
      })), (this._breadcrumb || (this._breadcrumb = new W2(this.group))).render(e, i, n.node, function(o) {
        a._state !== "animating" && (vb(e.getViewRoot(), o) ? a._rootToNode({
          node: o
        }) : a._zoomToNode({
          node: o
        }));
      });
    }, t.prototype.remove = function() {
      this._clearController(), this._containerGroup && this._containerGroup.removeAll(), this._storage = Yn(), this._state = "ready", this._breadcrumb && this._breadcrumb.remove();
    }, t.prototype.dispose = function() {
      this._clearController();
    }, t.prototype._zoomToNode = function(e) {
      this.api.dispatchAction({
        type: "treemapZoomToNode",
        from: this.uid,
        seriesId: this.seriesModel.id,
        targetNode: e.node
      });
    }, t.prototype._rootToNode = function(e) {
      this.api.dispatchAction({
        type: "treemapRootToNode",
        from: this.uid,
        seriesId: this.seriesModel.id,
        targetNode: e.node
      });
    }, t.prototype.findTarget = function(e, i) {
      var n, a = this.seriesModel.getViewRoot();
      return a.eachNode({
        attr: "viewChildren",
        order: "preorder"
      }, function(o) {
        var s = this._storage.background[o.getRawIndex()];
        if (s) {
          var l = s.transformCoordToLocal(e, i), u = s.shape;
          if (u.x <= l[0] && l[0] <= u.x + u.width && u.y <= l[1] && l[1] <= u.y + u.height)
            n = {
              node: o,
              offsetX: l[0],
              offsetY: l[1]
            };
          else
            return !1;
        }
      }, this), n;
    }, t.type = "treemap", t;
  }(me)
);
function Yn() {
  return {
    nodeGroup: [],
    background: [],
    content: []
  };
}
function J2(r, t, e, i, n, a, o, s, l, u) {
  if (!o)
    return;
  var h = o.getLayout(), c = r.getData(), f = o.getModel();
  if (c.setItemGraphicEl(o.dataIndex, null), !h || !h.isInView)
    return;
  var d = h.width, v = h.height, g = h.borderWidth, p = h.invisible, y = o.getRawIndex(), m = s && s.getRawIndex(), _ = o.viewChildren, b = h.upperHeight, w = _ && _.length, x = f.getModel("itemStyle"), S = f.getModel(["emphasis", "itemStyle"]), A = f.getModel(["blur", "itemStyle"]), M = f.getModel(["select", "itemStyle"]), D = x.get("borderRadius") || 0, C = _t("nodeGroup", ic);
  if (!C)
    return;
  if (l.add(C), C.x = h.x || 0, C.y = h.y || 0, C.markRedraw(), Bs(C).nodeWidth = d, Bs(C).nodeHeight = v, h.isAboveViewRoot)
    return C;
  var I = _t("background", Lg, u, K2);
  I && Z(C, I, w && h.upperLabelHeight);
  var L = f.getModel("emphasis"), P = L.get("focus"), E = L.get("blurScope"), R = L.get("disabled"), Y = P === "ancestor" ? o.getAncestorsIndices() : P === "descendant" ? o.getDescendantIndices() : P;
  if (w)
    Pa(C) && Qi(C, !1), I && (Qi(I, !R), c.setItemGraphicEl(o.dataIndex, I), Dh(I, Y, E));
  else {
    var O = _t("content", Lg, u, j2);
    O && J(C, O), I.disableMorphing = !0, I && Pa(I) && Qi(I, !1), Qi(C, !R), c.setItemGraphicEl(o.dataIndex, C);
    var z = f.getShallow("cursor");
    z && O.attr("cursor", z), Dh(C, Y, E);
  }
  return C;
  function Z(ct, X, nt) {
    var F = lt(X);
    if (F.dataIndex = o.dataIndex, F.seriesIndex = r.seriesIndex, X.setShape({
      x: 0,
      y: 0,
      width: d,
      height: v,
      r: D
    }), p)
      it(X);
    else {
      X.invisible = !1;
      var W = o.getVisual("style"), At = W.stroke, yt = $g(x);
      yt.fill = At;
      var Dt = ti(S);
      Dt.fill = S.get("borderColor");
      var Vt = ti(A);
      Vt.fill = A.get("borderColor");
      var Xe = ti(M);
      if (Xe.fill = M.get("borderColor"), nt) {
        var Di = d - 2 * g;
        ft(
          // PENDING: convert ZRColor to ColorString for text.
          X,
          At,
          W.opacity,
          {
            x: g,
            y: 0,
            width: Di,
            height: b
          }
        );
      } else
        X.removeTextContent();
      X.setStyle(yt), X.ensureState("emphasis").style = Dt, X.ensureState("blur").style = Vt, X.ensureState("select").style = Xe, Th(X);
    }
    ct.add(X);
  }
  function J(ct, X) {
    var nt = lt(X);
    nt.dataIndex = o.dataIndex, nt.seriesIndex = r.seriesIndex;
    var F = Math.max(d - 2 * g, 0), W = Math.max(v - 2 * g, 0);
    if (X.culling = !0, X.setShape({
      x: g,
      y: g,
      width: F,
      height: W,
      r: D
    }), p)
      it(X);
    else {
      X.invisible = !1;
      var At = o.getVisual("style"), yt = At.fill, Dt = $g(x);
      Dt.fill = yt, Dt.decal = At.decal;
      var Vt = ti(S), Xe = ti(A), Di = ti(M);
      ft(X, yt, At.opacity, null), X.setStyle(Dt), X.ensureState("emphasis").style = Vt, X.ensureState("blur").style = Xe, X.ensureState("select").style = Di, Th(X);
    }
    ct.add(X);
  }
  function it(ct) {
    !ct.invisible && a.push(ct);
  }
  function ft(ct, X, nt, F) {
    var W = f.getModel(F ? Rg : Eg), At = ie(f.get("name"), null), yt = W.getShallow("show");
    xn(ct, wn(f, F ? Rg : Eg), {
      defaultText: yt ? At : null,
      inheritColor: X,
      defaultOpacity: nt,
      labelFetcher: r,
      labelDataIndex: o.dataIndex
    });
    var Dt = ct.getTextContent();
    if (Dt) {
      var Vt = Dt.style, Xe = $c(Vt.padding || 0);
      F && (ct.setTextConfig({
        layoutRect: F
      }), Dt.disableLabelLayout = !0), Dt.beforeUpdate = function() {
        var jf = Math.max((F ? F.width : ct.shape.width) - Xe[1] - Xe[3], 0), Qf = Math.max((F ? F.height : ct.shape.height) - Xe[0] - Xe[2], 0);
        (Vt.width !== jf || Vt.height !== Qf) && Dt.setStyle({
          width: jf,
          height: Qf
        });
      }, Vt.truncateMinChar = 2, Vt.lineOverflow = "truncate", gt(Vt, F, h);
      var Di = Dt.getState("emphasis");
      gt(Di ? Di.style : null, F, h);
    }
  }
  function gt(ct, X, nt) {
    var F = ct ? ct.text : null;
    if (!X && nt.isLeafRoot && F != null) {
      var W = r.get("drillDownIcon", !0);
      ct.text = W ? W + " " + F : F;
    }
  }
  function _t(ct, X, nt, F) {
    var W = m != null && e[ct][m], At = n[ct];
    return W ? (e[ct][m] = null, Jt(At, W)) : p || (W = new X(), W instanceof _n && (W.z2 = tI(nt, F)), Ye(At, W)), t[ct][y] = W;
  }
  function Jt(ct, X) {
    var nt = ct[y] = {};
    X instanceof ic ? (nt.oldX = X.x, nt.oldY = X.y) : nt.oldShape = $({}, X.shape);
  }
  function Ye(ct, X) {
    var nt = ct[y] = {}, F = o.parentNode, W = X instanceof St;
    if (F && (!i || i.direction === "drillDown")) {
      var At = 0, yt = 0, Dt = n.background[F.getRawIndex()];
      !i && Dt && Dt.oldShape && (At = Dt.oldShape.width, yt = Dt.oldShape.height), W ? (nt.oldX = 0, nt.oldY = yt) : nt.oldShape = {
        x: At,
        y: yt,
        width: 0,
        height: 0
      };
    }
    nt.fadein = !W;
  }
}
function tI(r, t) {
  return r * q2 + t;
}
var Ha = T, eI = U, zs = -1, vi = (
  /** @class */
  function() {
    function r(t) {
      var e = t.mappingMethod, i = t.type, n = this.option = K(t);
      this.type = i, this.mappingMethod = e, this._normalizeData = nI[e];
      var a = r.visualHandlers[i];
      this.applyVisual = a.applyVisual, this.getColorMapper = a.getColorMapper, this._normalizedToVisual = a._normalizedToVisual[e], e === "piecewise" ? (Hu(n), rI(n)) : e === "category" ? n.categories ? iI(n) : Hu(n, !0) : (ke(e !== "linear" || n.dataExtent), Hu(n));
    }
    return r.prototype.mapValueToVisual = function(t) {
      var e = this._normalizeData(t);
      return this._normalizedToVisual(e, t);
    }, r.prototype.getNormalizer = function() {
      return at(this._normalizeData, this);
    }, r.listVisualTypes = function() {
      return xt(r.visualHandlers);
    }, r.isValidType = function(t) {
      return r.visualHandlers.hasOwnProperty(t);
    }, r.eachVisual = function(t, e, i) {
      U(t) ? T(t, e, i) : e.call(i, t);
    }, r.mapVisual = function(t, e, i) {
      var n, a = B(t) ? [] : U(t) ? {} : (n = !0, null);
      return r.eachVisual(t, function(o, s) {
        var l = e.call(i, o, s);
        n ? a = l : a[s] = l;
      }), a;
    }, r.retrieveVisuals = function(t) {
      var e = {}, i;
      return t && Ha(r.visualHandlers, function(n, a) {
        t.hasOwnProperty(a) && (e[a] = t[a], i = !0);
      }), i ? e : null;
    }, r.prepareVisualTypes = function(t) {
      if (B(t))
        t = t.slice();
      else if (eI(t)) {
        var e = [];
        Ha(t, function(i, n) {
          e.push(n);
        }), t = e;
      } else
        return [];
      return t.sort(function(i, n) {
        return n === "color" && i !== "color" && i.indexOf("color") === 0 ? 1 : -1;
      }), t;
    }, r.dependsOn = function(t, e) {
      return e === "color" ? !!(t && t.indexOf(e) === 0) : t === e;
    }, r.findPieceIndex = function(t, e, i) {
      for (var n, a = 1 / 0, o = 0, s = e.length; o < s; o++) {
        var l = e[o].value;
        if (l != null) {
          if (l === t || V(l) && l === t + "")
            return o;
          i && f(l, o);
        }
      }
      for (var o = 0, s = e.length; o < s; o++) {
        var u = e[o], h = u.interval, c = u.close;
        if (h) {
          if (h[0] === -1 / 0) {
            if (Bo(c[1], t, h[1]))
              return o;
          } else if (h[1] === 1 / 0) {
            if (Bo(c[0], h[0], t))
              return o;
          } else if (Bo(c[0], h[0], t) && Bo(c[1], t, h[1]))
            return o;
          i && f(h[0], o), i && f(h[1], o);
        }
      }
      if (i)
        return t === 1 / 0 ? e.length - 1 : t === -1 / 0 ? 0 : n;
      function f(d, v) {
        var g = Math.abs(d - t);
        g < a && (a = g, n = v);
      }
    }, r.visualHandlers = {
      color: {
        applyVisual: Xn("color"),
        getColorMapper: function() {
          var t = this.option;
          return at(t.mappingMethod === "category" ? function(e, i) {
            return !i && (e = this._normalizeData(e)), sa.call(this, e);
          } : function(e, i, n) {
            var a = !!n;
            return !i && (e = this._normalizeData(e)), n = Ol(e, t.parsedVisual, n), a ? n : er(n, "rgba");
          }, this);
        },
        _normalizedToVisual: {
          linear: function(t) {
            return er(Ol(t, this.option.parsedVisual), "rgba");
          },
          category: sa,
          piecewise: function(t, e) {
            var i = ac.call(this, e);
            return i == null && (i = er(Ol(t, this.option.parsedVisual), "rgba")), i;
          },
          fixed: ei
        }
      },
      colorHue: No(function(t, e) {
        return fa(t, e);
      }),
      colorSaturation: No(function(t, e) {
        return fa(t, null, e);
      }),
      colorLightness: No(function(t, e) {
        return fa(t, null, null, e);
      }),
      colorAlpha: No(function(t, e) {
        return gs(t, e);
      }),
      decal: {
        applyVisual: Xn("decal"),
        _normalizedToVisual: {
          linear: null,
          category: sa,
          piecewise: null,
          fixed: null
        }
      },
      opacity: {
        applyVisual: Xn("opacity"),
        _normalizedToVisual: nc([0, 1])
      },
      liftZ: {
        applyVisual: Xn("liftZ"),
        _normalizedToVisual: {
          linear: ei,
          category: ei,
          piecewise: ei,
          fixed: ei
        }
      },
      symbol: {
        applyVisual: function(t, e, i) {
          var n = this.mapValueToVisual(t);
          i("symbol", n);
        },
        _normalizedToVisual: {
          linear: Og,
          category: sa,
          piecewise: function(t, e) {
            var i = ac.call(this, e);
            return i == null && (i = Og.call(this, t)), i;
          },
          fixed: ei
        }
      },
      symbolSize: {
        applyVisual: Xn("symbolSize"),
        _normalizedToVisual: nc([0, 1])
      }
    }, r;
  }()
);
function rI(r) {
  var t = r.pieceList;
  r.hasSpecialVisual = !1, T(t, function(e, i) {
    e.originIndex = i, e.visual != null && (r.hasSpecialVisual = !0);
  });
}
function iI(r) {
  var t = r.categories, e = r.categoryMap = {}, i = r.visual;
  if (Ha(t, function(o, s) {
    e[o] = s;
  }), !B(i)) {
    var n = [];
    U(i) ? Ha(i, function(o, s) {
      var l = e[s];
      n[l ?? zs] = o;
    }) : n[zs] = i, i = yb(r, n);
  }
  for (var a = t.length - 1; a >= 0; a--)
    i[a] == null && (delete e[t[a]], t.pop());
}
function Hu(r, t) {
  var e = r.visual, i = [];
  U(e) ? Ha(e, function(a) {
    i.push(a);
  }) : e != null && i.push(e);
  var n = {
    color: 1,
    symbol: 1
  };
  !t && i.length === 1 && !n.hasOwnProperty(r.type) && (i[1] = i[0]), yb(r, i);
}
function No(r) {
  return {
    applyVisual: function(t, e, i) {
      var n = this.mapValueToVisual(t);
      i("color", r(e("color"), n));
    },
    _normalizedToVisual: nc([0, 1])
  };
}
function Og(r) {
  var t = this.option.visual;
  return t[Math.round(mi(r, [0, 1], [0, t.length - 1], !0))] || {};
}
function Xn(r) {
  return function(t, e, i) {
    i(r, this.mapValueToVisual(t));
  };
}
function sa(r) {
  var t = this.option.visual;
  return t[this.option.loop && r !== zs ? r % t.length : r];
}
function ei() {
  return this.option.visual[0];
}
function nc(r) {
  return {
    linear: function(t) {
      return mi(t, r, this.option.visual, !0);
    },
    category: sa,
    piecewise: function(t, e) {
      var i = ac.call(this, e);
      return i == null && (i = mi(t, r, this.option.visual, !0)), i;
    },
    fixed: ei
  };
}
function ac(r) {
  var t = this.option, e = t.pieceList;
  if (t.hasSpecialVisual) {
    var i = vi.findPieceIndex(r, e), n = e[i];
    if (n && n.visual)
      return n.visual[this.type];
  }
}
function yb(r, t) {
  return r.visual = t, r.type === "color" && (r.parsedVisual = H(t, function(e) {
    var i = ye(e);
    return i || [0, 0, 0, 1];
  })), t;
}
var nI = {
  linear: function(r) {
    return mi(r, this.option.dataExtent, [0, 1], !0);
  },
  piecewise: function(r) {
    var t = this.option.pieceList, e = vi.findPieceIndex(r, t, !0);
    if (e != null)
      return mi(e, [0, t.length - 1], [0, 1], !0);
  },
  category: function(r) {
    var t = this.option.categories ? this.option.categoryMap[r] : r;
    return t ?? zs;
  },
  fixed: Et
};
function Bo(r, t, e) {
  return r ? t <= e : t < e;
}
var aI = "itemStyle", mb = Tt();
const oI = {
  seriesType: "treemap",
  reset: function(r) {
    var t = r.getData().tree, e = t.root;
    e.isRemoved() || _b(
      e,
      // Visual should calculate from tree root but not view root.
      {},
      r.getViewRoot().getAncestors(),
      r
    );
  }
};
function _b(r, t, e, i) {
  var n = r.getModel(), a = r.getLayout(), o = r.hostTree.data;
  if (!(!a || a.invisible || !a.isInView)) {
    var s = n.getModel(aI), l = sI(s, t, i), u = o.ensureUniqueItemVisual(r.dataIndex, "style"), h = s.get("borderColor"), c = s.get("borderColorSaturation"), f;
    c != null && (f = Ng(l), h = lI(c, f)), u.stroke = h;
    var d = r.viewChildren;
    if (!d || !d.length)
      f = Ng(l), u.fill = f;
    else {
      var v = uI(r, n, a, s, l, d);
      T(d, function(g, p) {
        if (g.depth >= e.length || g === e[g.depth]) {
          var y = hI(n, l, g, p, v, i);
          _b(g, y, e, i);
        }
      });
    }
  }
}
function sI(r, t, e) {
  var i = $({}, t), n = e.designatedVisualItemStyle;
  return T(["color", "colorAlpha", "colorSaturation"], function(a) {
    n[a] = t[a];
    var o = r.get(a);
    n[a] = null, o != null && (i[a] = o);
  }), i;
}
function Ng(r) {
  var t = Vu(r, "color");
  if (t) {
    var e = Vu(r, "colorAlpha"), i = Vu(r, "colorSaturation");
    return i && (t = fa(t, null, null, i)), e && (t = gs(t, e)), t;
  }
}
function lI(r, t) {
  return t != null ? fa(t, null, null, r) : null;
}
function Vu(r, t) {
  var e = r[t];
  if (e != null && e !== "none")
    return e;
}
function uI(r, t, e, i, n, a) {
  if (!(!a || !a.length)) {
    var o = Gu(t, "color") || n.color != null && n.color !== "none" && (Gu(t, "colorAlpha") || Gu(t, "colorSaturation"));
    if (o) {
      var s = t.get("visualMin"), l = t.get("visualMax"), u = e.dataExtent.slice();
      s != null && s < u[0] && (u[0] = s), l != null && l > u[1] && (u[1] = l);
      var h = t.get("colorMappingBy"), c = {
        type: o.name,
        dataExtent: u,
        visual: o.range
      };
      c.type === "color" && (h === "index" || h === "id") ? (c.mappingMethod = "category", c.loop = !0) : c.mappingMethod = "linear";
      var f = new vi(c);
      return mb(f).drColorMappingBy = h, f;
    }
  }
}
function Gu(r, t) {
  var e = r.get(t);
  return B(e) && e.length ? {
    name: t,
    range: e
  } : null;
}
function hI(r, t, e, i, n, a) {
  var o = $({}, t);
  if (n) {
    var s = n.type, l = s === "color" && mb(n).drColorMappingBy, u = l === "index" ? i : l === "id" ? a.mapIdToIndex(e.getId()) : e.getValue(r.get("visualDimension"));
    o[s] = n.mapValueToVisual(u);
  }
  return o;
}
var Va = Math.max, Fs = Math.min, Bg = Be, Gf = T, bb = ["itemStyle", "borderWidth"], cI = ["itemStyle", "gapWidth"], fI = ["upperLabel", "show"], dI = ["upperLabel", "height"];
const vI = {
  seriesType: "treemap",
  reset: function(r, t, e, i) {
    var n = e.getWidth(), a = e.getHeight(), o = r.option, s = cn(r.getBoxLayoutParams(), {
      width: e.getWidth(),
      height: e.getHeight()
    }), l = o.size || [], u = Ct(Bg(s.width, l[0]), n), h = Ct(Bg(s.height, l[1]), a), c = i && i.type, f = ["treemapZoomToNode", "treemapRootToNode"], d = Vf(i, f, r), v = c === "treemapRender" || c === "treemapMove" ? i.rootRect : null, g = r.getViewRoot(), p = db(g);
    if (c !== "treemapMove") {
      var y = c === "treemapZoomToNode" ? bI(r, d, g, u, h) : v ? [v.width, v.height] : [u, h], m = o.sort;
      m && m !== "asc" && m !== "desc" && (m = "desc");
      var _ = {
        squareRatio: o.squareRatio,
        sort: m,
        leafDepth: o.leafDepth
      };
      g.hostTree.clearLayouts();
      var b = {
        x: 0,
        y: 0,
        width: y[0],
        height: y[1],
        area: y[0] * y[1]
      };
      g.setLayout(b), xb(g, _, !1, 0), b = g.getLayout(), Gf(p, function(x, S) {
        var A = (p[S + 1] || g).getValue();
        x.setLayout($({
          dataExtent: [A, A],
          borderWidth: 0,
          upperHeight: 0
        }, b));
      });
    }
    var w = r.getData().tree.root;
    w.setLayout(xI(s, v, d), !0), r.setLayoutInfo(s), wb(
      w,
      // Transform to base element coordinate system.
      new ot(-s.x, -s.y, n, a),
      p,
      g,
      0
    );
  }
};
function xb(r, t, e, i) {
  var n, a;
  if (!r.isRemoved()) {
    var o = r.getLayout();
    n = o.width, a = o.height;
    var s = r.getModel(), l = s.get(bb), u = s.get(cI) / 2, h = Sb(s), c = Math.max(l, h), f = l - u, d = c - u;
    r.setLayout({
      borderWidth: l,
      upperHeight: c,
      upperLabelHeight: h
    }, !0), n = Va(n - 2 * f, 0), a = Va(a - f - d, 0);
    var v = n * a, g = pI(r, s, v, t, e, i);
    if (g.length) {
      var p = {
        x: f,
        y: d,
        width: n,
        height: a
      }, y = Fs(n, a), m = 1 / 0, _ = [];
      _.area = 0;
      for (var b = 0, w = g.length; b < w; ) {
        var x = g[b];
        _.push(x), _.area += x.getLayout().area;
        var S = _I(_, y, t.squareRatio);
        S <= m ? (b++, m = S) : (_.area -= _.pop().getLayout().area, zg(_, y, p, u, !1), y = Fs(p.width, p.height), _.length = _.area = 0, m = 1 / 0);
      }
      if (_.length && zg(_, y, p, u, !0), !e) {
        var A = s.get("childrenVisibleMin");
        A != null && v < A && (e = !0);
      }
      for (var b = 0, w = g.length; b < w; b++)
        xb(g[b], t, e, i + 1);
    }
  }
}
function pI(r, t, e, i, n, a) {
  var o = r.children || [], s = i.sort;
  s !== "asc" && s !== "desc" && (s = null);
  var l = i.leafDepth != null && i.leafDepth <= a;
  if (n && !l)
    return r.viewChildren = [];
  o = Pt(o, function(d) {
    return !d.isRemoved();
  }), yI(o, s);
  var u = mI(t, o, s);
  if (u.sum === 0)
    return r.viewChildren = [];
  if (u.sum = gI(t, e, u.sum, s, o), u.sum === 0)
    return r.viewChildren = [];
  for (var h = 0, c = o.length; h < c; h++) {
    var f = o[h].getValue() / u.sum * e;
    o[h].setLayout({
      area: f
    });
  }
  return l && (o.length && r.setLayout({
    isLeafRoot: !0
  }, !0), o.length = 0), r.viewChildren = o, r.setLayout({
    dataExtent: u.dataExtent
  }, !0), o;
}
function gI(r, t, e, i, n) {
  if (!i)
    return e;
  for (var a = r.get("visibleMin"), o = n.length, s = o, l = o - 1; l >= 0; l--) {
    var u = n[i === "asc" ? o - l - 1 : l].getValue();
    u / e * t < a && (s = l, e -= u);
  }
  return i === "asc" ? n.splice(0, o - s) : n.splice(s, o - s), e;
}
function yI(r, t) {
  return t && r.sort(function(e, i) {
    var n = t === "asc" ? e.getValue() - i.getValue() : i.getValue() - e.getValue();
    return n === 0 ? t === "asc" ? e.dataIndex - i.dataIndex : i.dataIndex - e.dataIndex : n;
  }), r;
}
function mI(r, t, e) {
  for (var i = 0, n = 0, a = t.length; n < a; n++)
    i += t[n].getValue();
  var o = r.get("visualDimension"), s;
  return !t || !t.length ? s = [NaN, NaN] : o === "value" && e ? (s = [t[t.length - 1].getValue(), t[0].getValue()], e === "asc" && s.reverse()) : (s = [1 / 0, -1 / 0], Gf(t, function(l) {
    var u = l.getValue(o);
    u < s[0] && (s[0] = u), u > s[1] && (s[1] = u);
  })), {
    sum: i,
    dataExtent: s
  };
}
function _I(r, t, e) {
  for (var i = 0, n = 1 / 0, a = 0, o = void 0, s = r.length; a < s; a++)
    o = r[a].getLayout().area, o && (o < n && (n = o), o > i && (i = o));
  var l = r.area * r.area, u = t * t * e;
  return l ? Va(u * i / l, l / (u * n)) : 1 / 0;
}
function zg(r, t, e, i, n) {
  var a = t === e.width ? 0 : 1, o = 1 - a, s = ["x", "y"], l = ["width", "height"], u = e[s[a]], h = t ? r.area / t : 0;
  (n || h > e[l[o]]) && (h = e[l[o]]);
  for (var c = 0, f = r.length; c < f; c++) {
    var d = r[c], v = {}, g = h ? d.getLayout().area / h : 0, p = v[l[o]] = Va(h - 2 * i, 0), y = e[s[a]] + e[l[a]] - u, m = c === f - 1 || y < g ? y : g, _ = v[l[a]] = Va(m - 2 * i, 0);
    v[s[o]] = e[s[o]] + Fs(i, p / 2), v[s[a]] = u + Fs(i, _ / 2), u += m, d.setLayout(v, !0);
  }
  e[s[o]] += h, e[l[o]] -= h;
}
function bI(r, t, e, i, n) {
  var a = (t || {}).node, o = [i, n];
  if (!a || a === e)
    return o;
  for (var s, l = i * n, u = l * r.option.zoomToNodeRatio; s = a.parentNode; ) {
    for (var h = 0, c = s.children, f = 0, d = c.length; f < d; f++)
      h += c[f].getValue();
    var v = a.getValue();
    if (v === 0)
      return o;
    u *= h / v;
    var g = s.getModel(), p = g.get(bb), y = Math.max(p, Sb(g));
    u += 4 * p * p + (3 * p + y) * Math.pow(u, 0.5), u > Gd && (u = Gd), a = s;
  }
  u < l && (u = l);
  var m = Math.pow(u / l, 0.5);
  return [i * m, n * m];
}
function xI(r, t, e) {
  if (t)
    return {
      x: t.x,
      y: t.y
    };
  var i = {
    x: 0,
    y: 0
  };
  if (!e)
    return i;
  var n = e.node, a = n.getLayout();
  if (!a)
    return i;
  for (var o = [a.width / 2, a.height / 2], s = n; s; ) {
    var l = s.getLayout();
    o[0] += l.x, o[1] += l.y, s = s.parentNode;
  }
  return {
    x: r.width / 2 - o[0],
    y: r.height / 2 - o[1]
  };
}
function wb(r, t, e, i, n) {
  var a = r.getLayout(), o = e[n], s = o && o === r;
  if (!(o && !s || n === e.length && r !== i)) {
    r.setLayout({
      // isInView means: viewRoot sub tree + viewAbovePath
      isInView: !0,
      // invisible only means: outside view clip so that the node can not
      // see but still layout for animation preparation but not render.
      invisible: !s && !t.intersect(a),
      isAboveViewRoot: s
    }, !0);
    var l = new ot(t.x - a.x, t.y - a.y, t.width, t.height);
    Gf(r.viewChildren || [], function(u) {
      wb(u, l, e, i, n + 1);
    });
  }
}
function Sb(r) {
  return r.get(fI) ? r.get(dI) : 0;
}
function wI(r) {
  r.registerSeriesModel(H2), r.registerChartView(Q2), r.registerVisual(oI), r.registerLayout(vI), z2(r);
}
var Ti = !0, Ga = Math.min, pn = Math.max, SI = Math.pow, TI = 1e4, CI = 6, AI = 6, Fg = "globalPan", MI = {
  w: [0, 0],
  e: [0, 1],
  n: [1, 0],
  s: [1, 1]
}, DI = {
  w: "ew",
  e: "ew",
  n: "ns",
  s: "ns",
  ne: "nesw",
  sw: "nesw",
  nw: "nwse",
  se: "nwse"
}, Hg = {
  brushStyle: {
    lineWidth: 2,
    stroke: "rgba(210,219,238,0.3)",
    fill: "#D2DBEE"
  },
  transformable: !0,
  brushMode: "single",
  removeOnClick: !1
}, kI = 0, II = (
  /** @class */
  function(r) {
    N(t, r);
    function t(e) {
      var i = r.call(this) || this;
      return i._track = [], i._covers = [], i._handlers = {}, i._zr = e, i.group = new St(), i._uid = "brushController_" + kI++, T(NI, function(n, a) {
        this._handlers[a] = at(n, this);
      }, i), i;
    }
    return t.prototype.enableBrush = function(e) {
      return this._brushType && this._doDisableBrush(), e.brushType && this._doEnableBrush(e), this;
    }, t.prototype._doEnableBrush = function(e) {
      var i = this._zr;
      this._enableGlobalPan || T2(i, Fg, this._uid), T(this._handlers, function(n, a) {
        i.on(a, n);
      }), this._brushType = e.brushType, this._brushOption = ut(K(Hg), e, !0);
    }, t.prototype._doDisableBrush = function() {
      var e = this._zr;
      C2(e, Fg, this._uid), T(this._handlers, function(i, n) {
        e.off(n, i);
      }), this._brushType = this._brushOption = null;
    }, t.prototype.setPanels = function(e) {
      if (e && e.length) {
        var i = this._panels = {};
        T(e, function(n) {
          i[n.panelId] = K(n);
        });
      } else
        this._panels = null;
      return this;
    }, t.prototype.mount = function(e) {
      e = e || {}, this._enableGlobalPan = e.enableGlobalPan;
      var i = this.group;
      return this._zr.add(i), i.attr({
        x: e.x || 0,
        y: e.y || 0,
        rotation: e.rotation || 0,
        scaleX: e.scaleX || 1,
        scaleY: e.scaleY || 1
      }), this._transform = i.getLocalTransform(), this;
    }, t.prototype.updateCovers = function(e) {
      e = H(e, function(f) {
        return ut(K(Hg), f, !0);
      });
      var i = "\0-brush-index-", n = this._covers, a = this._covers = [], o = this, s = this._creatingCover;
      return new kf(n, e, u, l).add(h).update(h).remove(c).execute(), this;
      function l(f, d) {
        return (f.id != null ? f.id : i + d) + "-" + f.brushType;
      }
      function u(f, d) {
        return l(f.__brushOption, d);
      }
      function h(f, d) {
        var v = e[f];
        if (d != null && n[d] === s)
          a[f] = n[d];
        else {
          var g = a[f] = d != null ? (n[d].__brushOption = v, n[d]) : Cb(o, Tb(o, v));
          Wf(o, g);
        }
      }
      function c(f) {
        n[f] !== s && o.group.remove(n[f]);
      }
    }, t.prototype.unmount = function() {
      return this.enableBrush(!1), oc(this), this._zr.remove(this.group), this;
    }, t.prototype.dispose = function() {
      this.unmount(), this.off();
    }, t;
  }(be)
);
function Tb(r, t) {
  var e = xl[t.brushType].createCover(r, t);
  return e.__brushOption = t, Mb(e, t), r.group.add(e), e;
}
function Cb(r, t) {
  var e = Uf(t);
  return e.endCreating && (e.endCreating(r, t), Mb(t, t.__brushOption)), t;
}
function Ab(r, t) {
  var e = t.__brushOption;
  Uf(t).updateCoverShape(r, t, e.range, e);
}
function Mb(r, t) {
  var e = t.z;
  e == null && (e = TI), r.traverse(function(i) {
    i.z = e, i.z2 = e;
  });
}
function Wf(r, t) {
  Uf(t).updateCommon(r, t), Ab(r, t);
}
function Uf(r) {
  return xl[r.__brushOption.brushType];
}
function Yf(r, t, e) {
  var i = r._panels;
  if (!i)
    return Ti;
  var n, a = r._transform;
  return T(i, function(o) {
    o.isTargetByCursor(t, e, a) && (n = o);
  }), n;
}
function Db(r, t) {
  var e = r._panels;
  if (!e)
    return Ti;
  var i = t.__brushOption.panelId;
  return i != null ? e[i] : Ti;
}
function oc(r) {
  var t = r._covers, e = t.length;
  return T(t, function(i) {
    r.group.remove(i);
  }, r), t.length = 0, !!e;
}
function Ci(r, t) {
  var e = H(r._covers, function(i) {
    var n = i.__brushOption, a = K(n.range);
    return {
      brushType: n.brushType,
      panelId: n.panelId,
      range: a
    };
  });
  r.trigger("brush", {
    areas: e,
    isEnd: !!t.isEnd,
    removeOnClick: !!t.removeOnClick
  });
}
function LI(r) {
  var t = r._track;
  if (!t.length)
    return !1;
  var e = t[t.length - 1], i = t[0], n = e[0] - i[0], a = e[1] - i[1], o = SI(n * n + a * a, 0.5);
  return o > CI;
}
function kb(r) {
  var t = r.length - 1;
  return t < 0 && (t = 0), [r[0], r[t]];
}
function Ib(r, t, e, i) {
  var n = new St();
  return n.add(new Mt({
    name: "main",
    style: Xf(e),
    silent: !0,
    draggable: !0,
    cursor: "move",
    drift: et(Vg, r, t, n, ["n", "s", "w", "e"]),
    ondragend: et(Ci, t, {
      isEnd: !0
    })
  })), T(i, function(a) {
    n.add(new Mt({
      name: a.join(""),
      style: {
        opacity: 0
      },
      draggable: !0,
      silent: !0,
      invisible: !0,
      drift: et(Vg, r, t, n, a),
      ondragend: et(Ci, t, {
        isEnd: !0
      })
    }));
  }), n;
}
function Lb(r, t, e, i) {
  var n = i.brushStyle.lineWidth || 0, a = pn(n, AI), o = e[0][0], s = e[1][0], l = o - n / 2, u = s - n / 2, h = e[0][1], c = e[1][1], f = h - a + n / 2, d = c - a + n / 2, v = h - o, g = c - s, p = v + n, y = g + n;
  Ke(r, t, "main", o, s, v, g), i.transformable && (Ke(r, t, "w", l, u, a, y), Ke(r, t, "e", f, u, a, y), Ke(r, t, "n", l, u, p, a), Ke(r, t, "s", l, d, p, a), Ke(r, t, "nw", l, u, a, a), Ke(r, t, "ne", f, u, a, a), Ke(r, t, "sw", l, d, a, a), Ke(r, t, "se", f, d, a, a));
}
function sc(r, t) {
  var e = t.__brushOption, i = e.transformable, n = t.childAt(0);
  n.useStyle(Xf(e)), n.attr({
    silent: !i,
    cursor: i ? "move" : "default"
  }), T([["w"], ["e"], ["n"], ["s"], ["s", "e"], ["s", "w"], ["n", "e"], ["n", "w"]], function(a) {
    var o = t.childOfName(a.join("")), s = a.length === 1 ? lc(r, a[0]) : EI(r, a);
    o && o.attr({
      silent: !i,
      invisible: !i,
      cursor: i ? DI[s] + "-resize" : null
    });
  });
}
function Ke(r, t, e, i, n, a, o) {
  var s = t.childOfName(e);
  s && s.setShape($I(Zf(r, t, [[i, n], [i + a, n + o]])));
}
function Xf(r) {
  return ht({
    strokeNoScale: !0
  }, r.brushStyle);
}
function Pb(r, t, e, i) {
  var n = [Ga(r, e), Ga(t, i)], a = [pn(r, e), pn(t, i)];
  return [
    [n[0], a[0]],
    [n[1], a[1]]
    // y range
  ];
}
function PI(r) {
  return af(r.group);
}
function lc(r, t) {
  var e = {
    w: "left",
    e: "right",
    n: "top",
    s: "bottom"
  }, i = {
    left: "w",
    right: "e",
    top: "n",
    bottom: "s"
  }, n = Jm(e[t], PI(r));
  return i[n];
}
function EI(r, t) {
  var e = [lc(r, t[0]), lc(r, t[1])];
  return (e[0] === "e" || e[0] === "w") && e.reverse(), e.join("");
}
function Vg(r, t, e, i, n, a) {
  var o = e.__brushOption, s = r.toRectRange(o.range), l = Eb(t, n, a);
  T(i, function(u) {
    var h = MI[u];
    s[h[0]][h[1]] += l[h[0]];
  }), o.range = r.fromRectRange(Pb(s[0][0], s[1][0], s[0][1], s[1][1])), Wf(t, e), Ci(t, {
    isEnd: !1
  });
}
function RI(r, t, e, i) {
  var n = t.__brushOption.range, a = Eb(r, e, i);
  T(n, function(o) {
    o[0] += a[0], o[1] += a[1];
  }), Wf(r, t), Ci(r, {
    isEnd: !1
  });
}
function Eb(r, t, e) {
  var i = r.group, n = i.transformCoordToLocal(t, e), a = i.transformCoordToLocal(0, 0);
  return [n[0] - a[0], n[1] - a[1]];
}
function Zf(r, t, e) {
  var i = Db(r, t);
  return i && i !== Ti ? i.clipPath(e, r._transform) : K(e);
}
function $I(r) {
  var t = Ga(r[0][0], r[1][0]), e = Ga(r[0][1], r[1][1]), i = pn(r[0][0], r[1][0]), n = pn(r[0][1], r[1][1]);
  return {
    x: t,
    y: e,
    width: i - t,
    height: n - e
  };
}
function OI(r, t, e) {
  if (
    // Check active
    !(!r._brushType || BI(r, t.offsetX, t.offsetY))
  ) {
    var i = r._zr, n = r._covers, a = Yf(r, t, e);
    if (!r._dragging)
      for (var o = 0; o < n.length; o++) {
        var s = n[o].__brushOption;
        if (a && (a === Ti || s.panelId === a.panelId) && xl[s.brushType].contain(n[o], e[0], e[1]))
          return;
      }
    a && i.setCursorStyle("crosshair");
  }
}
function uc(r) {
  var t = r.event;
  t.preventDefault && t.preventDefault();
}
function hc(r, t, e) {
  return r.childOfName("main").contain(t, e);
}
function Rb(r, t, e, i) {
  var n = r._creatingCover, a = r._creatingPanel, o = r._brushOption, s;
  if (r._track.push(e.slice()), LI(r) || n) {
    if (a && !n) {
      o.brushMode === "single" && oc(r);
      var l = K(o);
      l.brushType = Gg(l.brushType, a), l.panelId = a === Ti ? null : a.panelId, n = r._creatingCover = Tb(r, l), r._covers.push(n);
    }
    if (n) {
      var u = xl[Gg(r._brushType, a)], h = n.__brushOption;
      h.range = u.getCreatingRange(Zf(r, n, r._track)), i && (Cb(r, n), u.updateCommon(r, n)), Ab(r, n), s = {
        isEnd: i
      };
    }
  } else i && o.brushMode === "single" && o.removeOnClick && Yf(r, t, e) && oc(r) && (s = {
    isEnd: i,
    removeOnClick: !0
  });
  return s;
}
function Gg(r, t) {
  return r === "auto" ? t.defaultBrushType : r;
}
var NI = {
  mousedown: function(r) {
    if (this._dragging)
      Wg(this, r);
    else if (!r.target || !r.target.draggable) {
      uc(r);
      var t = this.group.transformCoordToLocal(r.offsetX, r.offsetY);
      this._creatingCover = null;
      var e = this._creatingPanel = Yf(this, r, t);
      e && (this._dragging = !0, this._track = [t.slice()]);
    }
  },
  mousemove: function(r) {
    var t = r.offsetX, e = r.offsetY, i = this.group.transformCoordToLocal(t, e);
    if (OI(this, r, i), this._dragging) {
      uc(r);
      var n = Rb(this, r, i, !1);
      n && Ci(this, n);
    }
  },
  mouseup: function(r) {
    Wg(this, r);
  }
};
function Wg(r, t) {
  if (r._dragging) {
    uc(t);
    var e = t.offsetX, i = t.offsetY, n = r.group.transformCoordToLocal(e, i), a = Rb(r, t, n, !0);
    r._dragging = !1, r._track = [], r._creatingCover = null, a && Ci(r, a);
  }
}
function BI(r, t, e) {
  var i = r._zr;
  return t < 0 || t > i.getWidth() || e < 0 || e > i.getHeight();
}
var xl = {
  lineX: Ug(0),
  lineY: Ug(1),
  rect: {
    createCover: function(r, t) {
      function e(i) {
        return i;
      }
      return Ib({
        toRectRange: e,
        fromRectRange: e
      }, r, t, [["w"], ["e"], ["n"], ["s"], ["s", "e"], ["s", "w"], ["n", "e"], ["n", "w"]]);
    },
    getCreatingRange: function(r) {
      var t = kb(r);
      return Pb(t[1][0], t[1][1], t[0][0], t[0][1]);
    },
    updateCoverShape: function(r, t, e, i) {
      Lb(r, t, e, i);
    },
    updateCommon: sc,
    contain: hc
  },
  polygon: {
    createCover: function(r, t) {
      var e = new St();
      return e.add(new rl({
        name: "main",
        style: Xf(t),
        silent: !0
      })), e;
    },
    getCreatingRange: function(r) {
      return r;
    },
    endCreating: function(r, t) {
      t.remove(t.childAt(0)), t.add(new xi({
        name: "main",
        draggable: !0,
        drift: et(RI, r, t),
        ondragend: et(Ci, r, {
          isEnd: !0
        })
      }));
    },
    updateCoverShape: function(r, t, e, i) {
      t.childAt(0).setShape({
        points: Zf(r, t, e)
      });
    },
    updateCommon: sc,
    contain: hc
  }
};
function Ug(r) {
  return {
    createCover: function(t, e) {
      return Ib({
        toRectRange: function(i) {
          var n = [i, [0, 100]];
          return r && n.reverse(), n;
        },
        fromRectRange: function(i) {
          return i[r];
        }
      }, t, e, [[["w"], ["e"]], [["n"], ["s"]]][r]);
    },
    getCreatingRange: function(t) {
      var e = kb(t), i = Ga(e[0][r], e[1][r]), n = pn(e[0][r], e[1][r]);
      return [i, n];
    },
    updateCoverShape: function(t, e, i, n) {
      var a, o = Db(t, e);
      if (o !== Ti && o.getLinearBrushOtherExtent)
        a = o.getLinearBrushOtherExtent(r);
      else {
        var s = t._zr;
        a = [0, [s.getWidth(), s.getHeight()][1 - r]];
      }
      var l = [i, a];
      r && l.reverse(), Lb(t, e, l, n);
    },
    updateCommon: sc,
    contain: hc
  };
}
function zI(r) {
  return r = qf(r), function(t) {
    return e0(t, r);
  };
}
function FI(r, t) {
  return r = qf(r), function(e) {
    var i = t ?? e, n = i ? r.width : r.height, a = i ? r.x : r.y;
    return [a, a + (n || 0)];
  };
}
function HI(r, t, e) {
  var i = qf(r);
  return function(n, a) {
    return i.contain(a[0], a[1]) && !D2(n, t, e);
  };
}
function qf(r) {
  return ot.create(r);
}
var ri = Tt(), Yg = K, Wu = at, VI = (
  /** @class */
  function() {
    function r() {
      this._dragging = !1, this.animationThreshold = 15;
    }
    return r.prototype.render = function(t, e, i, n) {
      var a = e.get("value"), o = e.get("status");
      if (this._axisModel = t, this._axisPointerModel = e, this._api = i, !(!n && this._lastValue === a && this._lastStatus === o)) {
        this._lastValue = a, this._lastStatus = o;
        var s = this._group, l = this._handle;
        if (!o || o === "hide") {
          s && s.hide(), l && l.hide();
          return;
        }
        s && s.show(), l && l.show();
        var u = {};
        this.makeElOption(u, a, t, e, i);
        var h = u.graphicKey;
        h !== this._lastGraphicKey && this.clear(i), this._lastGraphicKey = h;
        var c = this._moveAnimation = this.determineAnimation(t, e);
        if (!s)
          s = this._group = new St(), this.createPointerEl(s, u, t, e), this.createLabelEl(s, u, t, e), i.getZr().add(s);
        else {
          var f = et(Xg, e, c);
          this.updatePointerEl(s, u, f), this.updateLabelEl(s, u, f, e);
        }
        qg(s, e, !0), this._renderHandle(a);
      }
    }, r.prototype.remove = function(t) {
      this.clear(t);
    }, r.prototype.dispose = function(t) {
      this.clear(t);
    }, r.prototype.determineAnimation = function(t, e) {
      var i = e.get("animation"), n = t.axis, a = n.type === "category", o = e.get("snap");
      if (!o && !a)
        return !1;
      if (i === "auto" || i == null) {
        var s = this.animationThreshold;
        if (a && n.getBandWidth() > s)
          return !0;
        if (o) {
          var l = zf(t).seriesDataCount, u = n.getExtent();
          return Math.abs(u[0] - u[1]) / l > s;
        }
        return !1;
      }
      return i === !0;
    }, r.prototype.makeElOption = function(t, e, i, n, a) {
    }, r.prototype.createPointerEl = function(t, e, i, n) {
      var a = e.pointer;
      if (a) {
        var o = ri(t).pointerEl = new AT[a.type](Yg(e.pointer));
        t.add(o);
      }
    }, r.prototype.createLabelEl = function(t, e, i, n) {
      if (e.label) {
        var a = ri(t).labelEl = new Ht(Yg(e.label));
        t.add(a), Zg(a, n);
      }
    }, r.prototype.updatePointerEl = function(t, e, i) {
      var n = ri(t).pointerEl;
      n && e.pointer && (n.setStyle(e.pointer.style), i(n, {
        shape: e.pointer.shape
      }));
    }, r.prototype.updateLabelEl = function(t, e, i, n) {
      var a = ri(t).labelEl;
      a && (a.setStyle(e.label.style), i(a, {
        // Consider text length change in vertical axis, animation should
        // be used on shape, otherwise the effect will be weird.
        // TODOTODO
        // shape: elOption.label.shape,
        x: e.label.x,
        y: e.label.y
      }), Zg(a, n));
    }, r.prototype._renderHandle = function(t) {
      if (!(this._dragging || !this.updateHandleTransform)) {
        var e = this._axisPointerModel, i = this._api.getZr(), n = this._handle, a = e.getModel("handle"), o = e.get("status");
        if (!a.get("show") || !o || o === "hide") {
          n && i.remove(n), this._handle = null;
          return;
        }
        var s;
        this._handle || (s = !0, n = this._handle = sf(a.get("icon"), {
          cursor: "move",
          draggable: !0,
          onmousemove: function(u) {
            Xs(u.event);
          },
          onmousedown: Wu(this._onHandleDragMove, this, 0, 0),
          drift: Wu(this._onHandleDragMove, this),
          ondragend: Wu(this._onHandleDragEnd, this)
        }), i.add(n)), qg(n, e, !1), n.setStyle(a.getItemStyle(null, ["color", "borderColor", "borderWidth", "opacity", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY"]));
        var l = a.get("size");
        B(l) || (l = [l, l]), n.scaleX = l[0] / 2, n.scaleY = l[1] / 2, Sf(this, "_doDispatchAxisPointer", a.get("throttle") || 0, "fixRate"), this._moveHandleToValue(t, s);
      }
    }, r.prototype._moveHandleToValue = function(t, e) {
      Xg(this._axisPointerModel, !e && this._moveAnimation, this._handle, Uu(this.getHandleTransform(t, this._axisModel, this._axisPointerModel)));
    }, r.prototype._onHandleDragMove = function(t, e) {
      var i = this._handle;
      if (i) {
        this._dragging = !0;
        var n = this.updateHandleTransform(Uu(i), [t, e], this._axisModel, this._axisPointerModel);
        this._payloadInfo = n, i.stopAnimation(), i.attr(Uu(n)), ri(i).lastProp = null, this._doDispatchAxisPointer();
      }
    }, r.prototype._doDispatchAxisPointer = function() {
      var t = this._handle;
      if (t) {
        var e = this._payloadInfo, i = this._axisModel;
        this._api.dispatchAction({
          type: "updateAxisPointer",
          x: e.cursorPoint[0],
          y: e.cursorPoint[1],
          tooltipOption: e.tooltipOption,
          axesInfo: [{
            axisDim: i.axis.dim,
            axisIndex: i.componentIndex
          }]
        });
      }
    }, r.prototype._onHandleDragEnd = function() {
      this._dragging = !1;
      var t = this._handle;
      if (t) {
        var e = this._axisPointerModel.get("value");
        this._moveHandleToValue(e), this._api.dispatchAction({
          type: "hideTip"
        });
      }
    }, r.prototype.clear = function(t) {
      this._lastValue = null, this._lastStatus = null;
      var e = t.getZr(), i = this._group, n = this._handle;
      e && i && (this._lastGraphicKey = null, i && e.remove(i), n && e.remove(n), this._group = null, this._handle = null, this._payloadInfo = null), zh(this, "_doDispatchAxisPointer");
    }, r.prototype.doClear = function() {
    }, r.prototype.buildLabel = function(t, e, i) {
      return i = i || 0, {
        x: t[i],
        y: t[1 - i],
        width: e[i],
        height: e[1 - i]
      };
    }, r;
  }()
);
function Xg(r, t, e, i) {
  $b(ri(e).lastProp, i) || (ri(e).lastProp = i, t ? jt(e, i, r) : (e.stopAnimation(), e.attr(i)));
}
function $b(r, t) {
  if (U(r) && U(t)) {
    var e = !0;
    return T(t, function(i, n) {
      e = e && $b(r[n], i);
    }), !!e;
  } else
    return r === t;
}
function Zg(r, t) {
  r[t.get(["label", "show"]) ? "show" : "hide"]();
}
function Uu(r) {
  return {
    x: r.x || 0,
    y: r.y || 0,
    rotation: r.rotation || 0
  };
}
function qg(r, t, e) {
  var i = t.get("z"), n = t.get("zlevel");
  r && r.traverse(function(a) {
    a.type !== "group" && (i != null && (a.z = i), n != null && (a.zlevel = n), a.silent = e);
  });
}
function GI(r) {
  var t = r.get("type"), e = r.getModel(t + "Style"), i;
  return t === "line" ? (i = e.getLineStyle(), i.fill = null) : t === "shadow" && (i = e.getAreaStyle(), i.stroke = null), i;
}
function WI(r, t, e, i, n) {
  var a = e.get("value"), o = Ob(a, t.axis, t.ecModel, e.get("seriesDataIndices"), {
    precision: e.get(["label", "precision"]),
    formatter: e.get(["label", "formatter"])
  }), s = e.getModel("label"), l = ja(s.get("padding") || 0), u = s.getFont(), h = Vc(o, u), c = n.position, f = h.width + l[1] + l[3], d = h.height + l[0] + l[2], v = n.align;
  v === "right" && (c[0] -= f), v === "center" && (c[0] -= f / 2);
  var g = n.verticalAlign;
  g === "bottom" && (c[1] -= d), g === "middle" && (c[1] -= d / 2), UI(c, f, d, i);
  var p = s.get("backgroundColor");
  (!p || p === "auto") && (p = t.get(["axisLine", "lineStyle", "color"])), r.label = {
    // shape: {x: 0, y: 0, width: width, height: height, r: labelModel.get('borderRadius')},
    x: c[0],
    y: c[1],
    style: Mr(s, {
      text: o,
      font: u,
      fill: s.getTextColor(),
      padding: l,
      backgroundColor: p
    }),
    // Label should be over axisPointer.
    z2: 10
  };
}
function UI(r, t, e, i) {
  var n = i.getWidth(), a = i.getHeight();
  r[0] = Math.min(r[0] + t, n) - t, r[1] = Math.min(r[1] + e, a) - e, r[0] = Math.max(r[0], 0), r[1] = Math.max(r[1], 0);
}
function Ob(r, t, e, i, n) {
  r = t.scale.parse(r);
  var a = t.scale.getLabel({
    value: r
  }, {
    // If `precision` is set, width can be fixed (like '12.00500'), which
    // helps to debounce when when moving label.
    precision: n.precision
  }), o = n.formatter;
  if (o) {
    var s = {
      value: Rf(t, {
        value: r
      }),
      axisDimension: t.dim,
      axisIndex: t.index,
      seriesData: []
    };
    T(i, function(l) {
      var u = e.getSeriesByIndex(l.seriesIndex), h = l.dataIndexInside, c = u && u.getDataParams(h);
      c && s.seriesData.push(c);
    }), V(o) ? a = o.replace("{value}", a) : Q(o) && (a = o(s));
  }
  return a;
}
function Nb(r, t, e) {
  var i = ui();
  return Bc(i, i, e.rotation), Da(i, i, e.position), of([r.dataToCoord(t), (e.labelOffset || 0) + (e.labelDirection || 1) * (e.labelMargin || 0)], i);
}
function YI(r, t, e, i, n, a) {
  var o = Tr.innerTextLayout(e.rotation, 0, e.labelDirection);
  e.labelMargin = n.get(["label", "margin"]), WI(t, i, n, a, {
    position: Nb(i.axis, r, e),
    align: o.textAlign,
    verticalAlign: o.textVerticalAlign
  });
}
function XI(r, t, e) {
  return e = e || 0, {
    x1: r[e],
    y1: r[1 - e],
    x2: t[e],
    y2: t[1 - e]
  };
}
function ZI(r, t, e) {
  return e = e || 0, {
    x: r[e],
    y: r[1 - e],
    width: t[e],
    height: t[1 - e]
  };
}
var qI = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.prototype.makeElOption = function(e, i, n, a, o) {
      var s = n.axis, l = s.grid, u = a.get("type"), h = Kg(l, s).getOtherAxis(s).getGlobalExtent(), c = s.toGlobalCoord(s.dataToCoord(i, !0));
      if (u && u !== "none") {
        var f = GI(a), d = KI[u](s, c, h);
        d.style = f, e.graphicKey = d.type, e.pointer = d;
      }
      var v = tc(l.model, n);
      YI(
        // @ts-ignore
        i,
        e,
        v,
        n,
        a,
        o
      );
    }, t.prototype.getHandleTransform = function(e, i, n) {
      var a = tc(i.axis.grid.model, i, {
        labelInside: !1
      });
      a.labelMargin = n.get(["handle", "margin"]);
      var o = Nb(i.axis, e, a);
      return {
        x: o[0],
        y: o[1],
        rotation: a.rotation + (a.labelDirection < 0 ? Math.PI : 0)
      };
    }, t.prototype.updateHandleTransform = function(e, i, n, a) {
      var o = n.axis, s = o.grid, l = o.getGlobalExtent(!0), u = Kg(s, o).getOtherAxis(o).getGlobalExtent(), h = o.dim === "x" ? 0 : 1, c = [e.x, e.y];
      c[h] += i[h], c[h] = Math.min(l[1], c[h]), c[h] = Math.max(l[0], c[h]);
      var f = (u[1] + u[0]) / 2, d = [f, f];
      d[h] = c[h];
      var v = [{
        verticalAlign: "middle"
      }, {
        align: "center"
      }];
      return {
        x: c[0],
        y: c[1],
        rotation: e.rotation,
        cursorPoint: d,
        tooltipOption: v[h]
      };
    }, t;
  }(VI)
);
function Kg(r, t) {
  var e = {};
  return e[t.dim + "AxisIndex"] = t.index, r.getCartesian(e);
}
var KI = {
  line: function(r, t, e) {
    var i = XI([t, e[0]], [t, e[1]], jg(r));
    return {
      type: "Line",
      subPixelOptimize: !0,
      shape: i
    };
  },
  shadow: function(r, t, e) {
    var i = Math.max(1, r.getBandWidth()), n = e[1] - e[0];
    return {
      type: "Rect",
      shape: ZI([t - i / 2, e[0]], [i, n], jg(r))
    };
  }
};
function jg(r) {
  return r.dim === "x" ? 0 : 1;
}
var jI = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e;
    }
    return t.type = "axisPointer", t.defaultOption = {
      // 'auto' means that show when triggered by tooltip or handle.
      show: "auto",
      // zlevel: 0,
      z: 50,
      type: "line",
      // axispointer triggered by tootip determine snap automatically,
      // see `modelHelper`.
      snap: !1,
      triggerTooltip: !0,
      triggerEmphasis: !0,
      value: null,
      status: null,
      link: [],
      // Do not set 'auto' here, otherwise global animation: false
      // will not effect at this axispointer.
      animation: null,
      animationDurationUpdate: 200,
      lineStyle: {
        color: "#B9BEC9",
        width: 1,
        type: "dashed"
      },
      shadowStyle: {
        color: "rgba(210,219,238,0.2)"
      },
      label: {
        show: !0,
        formatter: null,
        precision: "auto",
        margin: 3,
        color: "#fff",
        padding: [5, 7, 5, 7],
        backgroundColor: "auto",
        borderColor: null,
        borderWidth: 0,
        borderRadius: 3
      },
      handle: {
        show: !1,
        // eslint-disable-next-line
        icon: "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z",
        size: 45,
        // handle margin is from symbol center to axis, which is stable when circular move.
        margin: 50,
        // color: '#1b8bbd'
        // color: '#2f4554'
        color: "#333",
        shadowBlur: 3,
        shadowColor: "#aaa",
        shadowOffsetX: 0,
        shadowOffsetY: 2,
        // For mobile performance
        throttle: 40
      }
    }, t;
  }(dt)
), tr = Tt(), QI = T;
function Bb(r, t, e) {
  if (!j.node) {
    var i = t.getZr();
    tr(i).records || (tr(i).records = {}), JI(i, t);
    var n = tr(i).records[r] || (tr(i).records[r] = {});
    n.handler = e;
  }
}
function JI(r, t) {
  if (tr(r).initialized)
    return;
  tr(r).initialized = !0, e("click", et(Qg, "click")), e("mousemove", et(Qg, "mousemove")), e("globalout", eL);
  function e(i, n) {
    r.on(i, function(a) {
      var o = rL(t);
      QI(tr(r).records, function(s) {
        s && n(s, a, o.dispatchAction);
      }), tL(o.pendings, t);
    });
  }
}
function tL(r, t) {
  var e = r.showTip.length, i = r.hideTip.length, n;
  e ? n = r.showTip[e - 1] : i && (n = r.hideTip[i - 1]), n && (n.dispatchAction = null, t.dispatchAction(n));
}
function eL(r, t, e) {
  r.handler("leave", null, e);
}
function Qg(r, t, e, i) {
  t.handler(r, e, i);
}
function rL(r) {
  var t = {
    showTip: [],
    hideTip: []
  }, e = function(i) {
    var n = t[i.type];
    n ? n.push(i) : (i.dispatchAction = e, r.dispatchAction(i));
  };
  return {
    dispatchAction: e,
    pendings: t
  };
}
function cc(r, t) {
  if (!j.node) {
    var e = t.getZr(), i = (tr(e).records || {})[r];
    i && (tr(e).records[r] = null);
  }
}
var iL = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e;
    }
    return t.prototype.render = function(e, i, n) {
      var a = i.getComponent("tooltip"), o = e.get("triggerOn") || a && a.get("triggerOn") || "mousemove|click";
      Bb("axisPointer", n, function(s, l, u) {
        o !== "none" && (s === "leave" || o.indexOf(s) >= 0) && u({
          type: "updateAxisPointer",
          currTrigger: s,
          x: l && l.offsetX,
          y: l && l.offsetY
        });
      });
    }, t.prototype.remove = function(e, i) {
      cc("axisPointer", i);
    }, t.prototype.dispose = function(e, i) {
      cc("axisPointer", i);
    }, t.type = "axisPointer", t;
  }(ne)
);
function zb(r, t) {
  var e = [], i = r.seriesIndex, n;
  if (i == null || !(n = t.getSeriesByIndex(i)))
    return {
      point: []
    };
  var a = n.getData(), o = _i(a, r);
  if (o == null || o < 0 || B(o))
    return {
      point: []
    };
  var s = a.getItemGraphicEl(o), l = n.coordinateSystem;
  if (n.getTooltipPosition)
    e = n.getTooltipPosition(o) || [];
  else if (l && l.dataToPoint)
    if (r.isStacked) {
      var u = l.getBaseAxis(), h = l.getOtherAxis(u), c = h.dim, f = u.dim, d = c === "x" || c === "radius" ? 1 : 0, v = a.mapDimension(f), g = [];
      g[d] = a.get(v, o), g[1 - d] = a.get(a.getCalculationInfo("stackResultDimension"), o), e = l.dataToPoint(g) || [];
    } else
      e = l.dataToPoint(a.getValues(H(l.dimensions, function(y) {
        return a.mapDimension(y);
      }), o)) || [];
  else if (s) {
    var p = s.getBoundingRect().clone();
    p.applyTransform(s.transform), e = [p.x + p.width / 2, p.y + p.height / 2];
  }
  return {
    point: e,
    el: s
  };
}
var Jg = Tt();
function nL(r, t, e) {
  var i = r.currTrigger, n = [r.x, r.y], a = r, o = r.dispatchAction || at(e.dispatchAction, e), s = t.getComponent("axisPointer").coordSysAxesInfo;
  if (s) {
    ss(n) && (n = zb({
      seriesIndex: a.seriesIndex,
      // Do not use dataIndexInside from other ec instance.
      // FIXME: auto detect it?
      dataIndex: a.dataIndex
    }, t).point);
    var l = ss(n), u = a.axesInfo, h = s.axesInfo, c = i === "leave" || ss(n), f = {}, d = {}, v = {
      list: [],
      map: {}
    }, g = {
      showPointer: et(oL, d),
      showTooltip: et(sL, v)
    };
    T(s.coordSysMap, function(y, m) {
      var _ = l || y.containPoint(n);
      T(s.coordSysAxesInfo[m], function(b, w) {
        var x = b.axis, S = cL(u, b);
        if (!c && _ && (!u || S)) {
          var A = S && S.value;
          A == null && !l && (A = x.pointToData(n)), A != null && ty(b, A, g, !1, f);
        }
      });
    });
    var p = {};
    return T(h, function(y, m) {
      var _ = y.linkGroup;
      _ && !d[m] && T(_.axesInfo, function(b, w) {
        var x = d[w];
        if (b !== y && x) {
          var S = x.value;
          _.mapper && (S = y.axis.scale.parse(_.mapper(S, ey(b), ey(y)))), p[y.key] = S;
        }
      });
    }), T(p, function(y, m) {
      ty(h[m], y, g, !0, f);
    }), lL(d, h, f), uL(v, n, r, o), hL(h, o, e), f;
  }
}
function ty(r, t, e, i, n) {
  var a = r.axis;
  if (!(a.scale.isBlank() || !a.containData(t))) {
    if (!r.involveSeries) {
      e.showPointer(r, t);
      return;
    }
    var o = aL(t, r), s = o.payloadBatch, l = o.snapToValue;
    s[0] && n.seriesIndex == null && $(n, s[0]), !i && r.snap && a.containData(l) && l != null && (t = l), e.showPointer(r, t, s), e.showTooltip(r, o, l);
  }
}
function aL(r, t) {
  var e = t.axis, i = e.dim, n = r, a = [], o = Number.MAX_VALUE, s = -1;
  return T(t.seriesModels, function(l, u) {
    var h = l.getData().mapDimensionsAll(i), c, f;
    if (l.getAxisTooltipData) {
      var d = l.getAxisTooltipData(h, r, e);
      f = d.dataIndices, c = d.nestestValue;
    } else {
      if (f = l.getData().indicesOfNearest(
        h[0],
        r,
        // Add a threshold to avoid find the wrong dataIndex
        // when data length is not same.
        // false,
        e.type === "category" ? 0.5 : null
      ), !f.length)
        return;
      c = l.getData().get(h[0], f[0]);
    }
    if (!(c == null || !isFinite(c))) {
      var v = r - c, g = Math.abs(v);
      g <= o && ((g < o || v >= 0 && s < 0) && (o = g, s = v, n = c, a.length = 0), T(f, function(p) {
        a.push({
          seriesIndex: l.seriesIndex,
          dataIndexInside: p,
          dataIndex: l.getData().getRawIndex(p)
        });
      }));
    }
  }), {
    payloadBatch: a,
    snapToValue: n
  };
}
function oL(r, t, e, i) {
  r[t.key] = {
    value: e,
    payloadBatch: i
  };
}
function sL(r, t, e, i) {
  var n = e.payloadBatch, a = t.axis, o = a.model, s = t.axisPointerModel;
  if (!(!t.triggerTooltip || !n.length)) {
    var l = t.coordSys.model, u = Fa(l), h = r.map[u];
    h || (h = r.map[u] = {
      coordSysId: l.id,
      coordSysIndex: l.componentIndex,
      coordSysType: l.type,
      coordSysMainType: l.mainType,
      dataByAxis: []
    }, r.list.push(h)), h.dataByAxis.push({
      axisDim: a.dim,
      axisIndex: o.componentIndex,
      axisType: o.type,
      axisId: o.id,
      value: i,
      // Caustion: viewHelper.getValueLabel is actually on "view stage", which
      // depends that all models have been updated. So it should not be performed
      // here. Considering axisPointerModel used here is volatile, which is hard
      // to be retrieve in TooltipView, we prepare parameters here.
      valueLabelOpt: {
        precision: s.get(["label", "precision"]),
        formatter: s.get(["label", "formatter"])
      },
      seriesDataIndices: n.slice()
    });
  }
}
function lL(r, t, e) {
  var i = e.axesInfo = [];
  T(t, function(n, a) {
    var o = n.axisPointerModel.option, s = r[a];
    s ? (!n.useHandle && (o.status = "show"), o.value = s.value, o.seriesDataIndices = (s.payloadBatch || []).slice()) : !n.useHandle && (o.status = "hide"), o.status === "show" && i.push({
      axisDim: n.axis.dim,
      axisIndex: n.axis.model.componentIndex,
      value: o.value
    });
  });
}
function uL(r, t, e, i) {
  if (ss(t) || !r.list.length) {
    i({
      type: "hideTip"
    });
    return;
  }
  var n = ((r.list[0].dataByAxis[0] || {}).seriesDataIndices || [])[0] || {};
  i({
    type: "showTip",
    escapeConnect: !0,
    x: t[0],
    y: t[1],
    tooltipOption: e.tooltipOption,
    position: e.position,
    dataIndexInside: n.dataIndexInside,
    dataIndex: n.dataIndex,
    seriesIndex: n.seriesIndex,
    dataByCoordSys: r.list
  });
}
function hL(r, t, e) {
  var i = e.getZr(), n = "axisPointerLastHighlights", a = Jg(i)[n] || {}, o = Jg(i)[n] = {};
  T(r, function(u, h) {
    var c = u.axisPointerModel.option;
    c.status === "show" && u.triggerEmphasis && T(c.seriesDataIndices, function(f) {
      var d = f.seriesIndex + " | " + f.dataIndex;
      o[d] = f;
    });
  });
  var s = [], l = [];
  T(a, function(u, h) {
    !o[h] && l.push(u);
  }), T(o, function(u, h) {
    !a[h] && s.push(u);
  }), l.length && e.dispatchAction({
    type: "downplay",
    escapeConnect: !0,
    // Not blur others when highlight in axisPointer.
    notBlur: !0,
    batch: l
  }), s.length && e.dispatchAction({
    type: "highlight",
    escapeConnect: !0,
    // Not blur others when highlight in axisPointer.
    notBlur: !0,
    batch: s
  });
}
function cL(r, t) {
  for (var e = 0; e < (r || []).length; e++) {
    var i = r[e];
    if (t.axis.dim === i.axisDim && t.axis.model.componentIndex === i.axisIndex)
      return i;
  }
}
function ey(r) {
  var t = r.axis.model, e = {}, i = e.axisDim = r.axis.dim;
  return e.axisIndex = e[i + "AxisIndex"] = t.componentIndex, e.axisName = e[i + "AxisName"] = t.name, e.axisId = e[i + "AxisId"] = t.id, e;
}
function ss(r) {
  return !r || r[0] == null || isNaN(r[0]) || r[1] == null || isNaN(r[1]);
}
function Fb(r) {
  lb.registerAxisPointerClass("CartesianAxisPointer", qI), r.registerComponentModel(jI), r.registerComponentView(iL), r.registerPreprocessor(function(t) {
    if (t) {
      (!t.axisPointer || t.axisPointer.length === 0) && (t.axisPointer = {});
      var e = t.axisPointer.link;
      e && !B(e) && (t.axisPointer.link = [e]);
    }
  }), r.registerProcessor(r.PRIORITY.PROCESSOR.STATISTIC, function(t, e) {
    t.getComponent("axisPointer").coordSysAxesInfo = u2(t, e);
  }), r.registerAction({
    type: "updateAxisPointer",
    event: "updateAxisPointer",
    update: ":updateAxisPointer"
  }, nL);
}
function fL(r) {
  kr(S2), kr(Fb);
}
var dL = (
  /** @class */
  /* @__PURE__ */ function() {
    function r() {
    }
    return r;
  }()
);
function vL(r, t) {
  var e = ja(t.get("padding")), i = t.getItemStyle(["color", "opacity"]);
  return i.fill = t.get("backgroundColor"), r = new Mt({
    shape: {
      x: r.x - e[3],
      y: r.y - e[0],
      width: r.width + e[1] + e[3],
      height: r.height + e[0] + e[2],
      r: t.get("borderRadius")
    },
    style: i,
    silent: !0,
    z2: -1
  }), r;
}
var pL = ["grid", "xAxis", "yAxis", "geo", "graph", "polar", "radiusAxis", "angleAxis", "bmap"], gL = (
  /** @class */
  function() {
    function r(t, e, i) {
      var n = this;
      this._targetInfoList = [];
      var a = ry(e, t);
      T(yL, function(o, s) {
        (!i || !i.include || rt(i.include, s) >= 0) && o(a, n._targetInfoList);
      });
    }
    return r.prototype.setOutputRanges = function(t, e) {
      return this.matchOutputRanges(t, e, function(i, n, a) {
        if ((i.coordRanges || (i.coordRanges = [])).push(n), !i.coordRange) {
          i.coordRange = n;
          var o = Yu[i.brushType](0, a, n);
          i.__rangeOffset = {
            offset: oy[i.brushType](o.values, i.range, [1, 1]),
            xyMinMax: o.xyMinMax
          };
        }
      }), t;
    }, r.prototype.matchOutputRanges = function(t, e, i) {
      T(t, function(n) {
        var a = this.findTargetInfo(n, e);
        a && a !== !0 && T(a.coordSyses, function(o) {
          var s = Yu[n.brushType](1, o, n.range, !0);
          i(n, s.values, o, e);
        });
      }, this);
    }, r.prototype.setInputRanges = function(t, e) {
      T(t, function(i) {
        var n = this.findTargetInfo(i, e);
        if (i.range = i.range || [], n && n !== !0) {
          i.panelId = n.panelId;
          var a = Yu[i.brushType](0, n.coordSys, i.coordRange), o = i.__rangeOffset;
          i.range = o ? oy[i.brushType](a.values, o.offset, mL(a.xyMinMax, o.xyMinMax)) : a.values;
        }
      }, this);
    }, r.prototype.makePanelOpts = function(t, e) {
      return H(this._targetInfoList, function(i) {
        var n = i.getPanelRect();
        return {
          panelId: i.panelId,
          defaultBrushType: e ? e(i) : null,
          clipPath: zI(n),
          isTargetByCursor: HI(n, t, i.coordSysModel),
          getLinearBrushOtherExtent: FI(n)
        };
      });
    }, r.prototype.controlSeries = function(t, e, i) {
      var n = this.findTargetInfo(t, i);
      return n === !0 || n && rt(n.coordSyses, e.coordinateSystem) >= 0;
    }, r.prototype.findTargetInfo = function(t, e) {
      for (var i = this._targetInfoList, n = ry(e, t), a = 0; a < i.length; a++) {
        var o = i[a], s = t.panelId;
        if (s) {
          if (o.panelId === s)
            return o;
        } else
          for (var l = 0; l < iy.length; l++)
            if (iy[l](n, o))
              return o;
      }
      return !0;
    }, r;
  }()
);
function fc(r) {
  return r[0] > r[1] && r.reverse(), r;
}
function ry(r, t) {
  return ts(r, t, {
    includeMainTypes: pL
  });
}
var yL = {
  grid: function(r, t) {
    var e = r.xAxisModels, i = r.yAxisModels, n = r.gridModels, a = tt(), o = {}, s = {};
    !e && !i && !n || (T(e, function(l) {
      var u = l.axis.grid.model;
      a.set(u.id, u), o[u.id] = !0;
    }), T(i, function(l) {
      var u = l.axis.grid.model;
      a.set(u.id, u), s[u.id] = !0;
    }), T(n, function(l) {
      a.set(l.id, l), o[l.id] = !0, s[l.id] = !0;
    }), a.each(function(l) {
      var u = l.coordinateSystem, h = [];
      T(u.getCartesians(), function(c, f) {
        (rt(e, c.getAxis("x").model) >= 0 || rt(i, c.getAxis("y").model) >= 0) && h.push(c);
      }), t.push({
        panelId: "grid--" + l.id,
        gridModel: l,
        coordSysModel: l,
        // Use the first one as the representitive coordSys.
        coordSys: h[0],
        coordSyses: h,
        getPanelRect: ny.grid,
        xAxisDeclared: o[l.id],
        yAxisDeclared: s[l.id]
      });
    }));
  },
  geo: function(r, t) {
    T(r.geoModels, function(e) {
      var i = e.coordinateSystem;
      t.push({
        panelId: "geo--" + e.id,
        geoModel: e,
        coordSysModel: e,
        coordSys: i,
        coordSyses: [i],
        getPanelRect: ny.geo
      });
    });
  }
}, iy = [
  // grid
  function(r, t) {
    var e = r.xAxisModel, i = r.yAxisModel, n = r.gridModel;
    return !n && e && (n = e.axis.grid.model), !n && i && (n = i.axis.grid.model), n && n === t.gridModel;
  },
  // geo
  function(r, t) {
    var e = r.geoModel;
    return e && e === t.geoModel;
  }
], ny = {
  grid: function() {
    return this.coordSys.master.getRect().clone();
  },
  geo: function() {
    var r = this.coordSys, t = r.getBoundingRect().clone();
    return t.applyTransform(af(r)), t;
  }
}, Yu = {
  lineX: et(ay, 0),
  lineY: et(ay, 1),
  rect: function(r, t, e, i) {
    var n = r ? t.pointToData([e[0][0], e[1][0]], i) : t.dataToPoint([e[0][0], e[1][0]], i), a = r ? t.pointToData([e[0][1], e[1][1]], i) : t.dataToPoint([e[0][1], e[1][1]], i), o = [fc([n[0], a[0]]), fc([n[1], a[1]])];
    return {
      values: o,
      xyMinMax: o
    };
  },
  polygon: function(r, t, e, i) {
    var n = [[1 / 0, -1 / 0], [1 / 0, -1 / 0]], a = H(e, function(o) {
      var s = r ? t.pointToData(o, i) : t.dataToPoint(o, i);
      return n[0][0] = Math.min(n[0][0], s[0]), n[1][0] = Math.min(n[1][0], s[1]), n[0][1] = Math.max(n[0][1], s[0]), n[1][1] = Math.max(n[1][1], s[1]), s;
    });
    return {
      values: a,
      xyMinMax: n
    };
  }
};
function ay(r, t, e, i) {
  var n = e.getAxis(["x", "y"][r]), a = fc(H([0, 1], function(s) {
    return t ? n.coordToData(n.toLocalCoord(i[s]), !0) : n.toGlobalCoord(n.dataToCoord(i[s]));
  })), o = [];
  return o[r] = a, o[1 - r] = [NaN, NaN], {
    values: a,
    xyMinMax: o
  };
}
var oy = {
  lineX: et(sy, 0),
  lineY: et(sy, 1),
  rect: function(r, t, e) {
    return [[r[0][0] - e[0] * t[0][0], r[0][1] - e[0] * t[0][1]], [r[1][0] - e[1] * t[1][0], r[1][1] - e[1] * t[1][1]]];
  },
  polygon: function(r, t, e) {
    return H(r, function(i, n) {
      return [i[0] - e[0] * t[n][0], i[1] - e[1] * t[n][1]];
    });
  }
};
function sy(r, t, e, i) {
  return [t[0] - i[r] * e[0], t[1] - i[r] * e[1]];
}
function mL(r, t) {
  var e = ly(r), i = ly(t), n = [e[0] / i[0], e[1] / i[1]];
  return isNaN(n[0]) && (n[0] = 1), isNaN(n[1]) && (n[1] = 1), n;
}
function ly(r) {
  return r ? [r[0][1] - r[0][0], r[1][1] - r[1][0]] : [NaN, NaN];
}
var _L = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e;
    }
    return t.type = "tooltip", t.dependencies = ["axisPointer"], t.defaultOption = {
      // zlevel: 0,
      z: 60,
      show: !0,
      // tooltip main content
      showContent: !0,
      // 'trigger' only works on coordinate system.
      // 'item' | 'axis' | 'none'
      trigger: "item",
      // 'click' | 'mousemove' | 'none'
      triggerOn: "mousemove|click",
      alwaysShowContent: !1,
      displayMode: "single",
      renderMode: "auto",
      // whether restraint content inside viewRect.
      // If renderMode: 'richText', default true.
      // If renderMode: 'html', defaut false (for backward compat).
      confine: null,
      showDelay: 0,
      hideDelay: 100,
      // Animation transition time, unit is second
      transitionDuration: 0.4,
      enterable: !1,
      backgroundColor: "#fff",
      // box shadow
      shadowBlur: 10,
      shadowColor: "rgba(0, 0, 0, .2)",
      shadowOffsetX: 1,
      shadowOffsetY: 2,
      // tooltip border radius, unit is px, default is 4
      borderRadius: 4,
      // tooltip border width, unit is px, default is 0 (no border)
      borderWidth: 1,
      // Tooltip inside padding, default is 5 for all direction
      // Array is allowed to set up, right, bottom, left, same with css
      // The default value: See `tooltip/tooltipMarkup.ts#getPaddingFromTooltipModel`.
      padding: null,
      // Extra css text
      extraCssText: "",
      // axis indicator, trigger by axis
      axisPointer: {
        // default is line
        // legal values: 'line' | 'shadow' | 'cross'
        type: "line",
        // Valid when type is line, appoint tooltip line locate on which line. Optional
        // legal values: 'x' | 'y' | 'angle' | 'radius' | 'auto'
        // default is 'auto', chose the axis which type is category.
        // for multiply y axis, cartesian coord chose x axis, polar chose angle axis
        axis: "auto",
        animation: "auto",
        animationDurationUpdate: 200,
        animationEasingUpdate: "exponentialOut",
        crossStyle: {
          color: "#999",
          width: 1,
          type: "dashed",
          // TODO formatter
          textStyle: {}
        }
        // lineStyle and shadowStyle should not be specified here,
        // otherwise it will always override those styles on option.axisPointer.
      },
      textStyle: {
        color: "#666",
        fontSize: 14
      }
    }, t;
  }(dt)
);
function Hb(r) {
  var t = r.get("confine");
  return t != null ? !!t : r.get("renderMode") === "richText";
}
function Vb(r) {
  if (j.domSupported) {
    for (var t = document.documentElement.style, e = 0, i = r.length; e < i; e++)
      if (r[e] in t)
        return r[e];
  }
}
var Gb = Vb(["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]), bL = Vb(["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]);
function Wb(r, t) {
  if (!r)
    return t;
  t = y0(t, !0);
  var e = r.indexOf(t);
  return r = e === -1 ? t : "-" + r.slice(0, e) + "-" + t, r.toLowerCase();
}
function xL(r, t) {
  var e = r.currentStyle || document.defaultView && document.defaultView.getComputedStyle(r);
  return e ? e[t] : null;
}
var wL = Wb(bL, "transition"), Kf = Wb(Gb, "transform"), SL = "position:absolute;display:block;border-style:solid;white-space:nowrap;z-index:9999999;" + (j.transform3dSupported ? "will-change:transform;" : "");
function TL(r) {
  return r = r === "left" ? "right" : r === "right" ? "left" : r === "top" ? "bottom" : "top", r;
}
function CL(r, t, e) {
  if (!V(e) || e === "inside")
    return "";
  var i = r.get("backgroundColor"), n = r.get("borderWidth");
  t = wi(t);
  var a = TL(e), o = Math.max(Math.round(n) * 1.5, 6), s = "", l = Kf + ":", u;
  rt(["left", "right"], a) > -1 ? (s += "top:50%", l += "translateY(-50%) rotate(" + (u = a === "left" ? -225 : -45) + "deg)") : (s += "left:50%", l += "translateX(-50%) rotate(" + (u = a === "top" ? 225 : 45) + "deg)");
  var h = u * Math.PI / 180, c = o + n, f = c * Math.abs(Math.cos(h)) + c * Math.abs(Math.sin(h)), d = Math.round(((f - Math.SQRT2 * n) / 2 + Math.SQRT2 * n - (f - c) / 2) * 100) / 100;
  s += ";" + a + ":-" + d + "px";
  var v = t + " solid " + n + "px;", g = ["position:absolute;width:" + o + "px;height:" + o + "px;z-index:-1;", s + ";" + l + ";", "border-bottom:" + v, "border-right:" + v, "background-color:" + i + ";"];
  return '<div style="' + g.join("") + '"></div>';
}
function AL(r, t) {
  var e = "cubic-bezier(0.23,1,0.32,1)", i = " " + r / 2 + "s " + e, n = "opacity" + i + ",visibility" + i;
  return t || (i = " " + r + "s " + e, n += j.transformSupported ? "," + Kf + i : ",left" + i + ",top" + i), wL + ":" + n;
}
function uy(r, t, e) {
  var i = r.toFixed(0) + "px", n = t.toFixed(0) + "px";
  if (!j.transformSupported)
    return e ? "top:" + n + ";left:" + i + ";" : [["top", n], ["left", i]];
  var a = j.transform3dSupported, o = "translate" + (a ? "3d" : "") + "(" + i + "," + n + (a ? ",0" : "") + ")";
  return e ? "top:0;left:0;" + Kf + ":" + o + ";" : [["top", 0], ["left", 0], [Gb, o]];
}
function ML(r) {
  var t = [], e = r.get("fontSize"), i = r.getTextColor();
  i && t.push("color:" + i), t.push("font:" + r.getFont());
  var n = st(r.get("lineHeight"), Math.round(e * 3 / 2));
  e && t.push("line-height:" + n + "px");
  var a = r.get("textShadowColor"), o = r.get("textShadowBlur") || 0, s = r.get("textShadowOffsetX") || 0, l = r.get("textShadowOffsetY") || 0;
  return a && o && t.push("text-shadow:" + s + "px " + l + "px " + o + "px " + a), T(["decoration", "align"], function(u) {
    var h = r.get(u);
    h && t.push("text-" + u + ":" + h);
  }), t.join(";");
}
function DL(r, t, e) {
  var i = [], n = r.get("transitionDuration"), a = r.get("backgroundColor"), o = r.get("shadowBlur"), s = r.get("shadowColor"), l = r.get("shadowOffsetX"), u = r.get("shadowOffsetY"), h = r.getModel("textStyle"), c = U0(r, "html"), f = l + "px " + u + "px " + o + "px " + s;
  return i.push("box-shadow:" + f), t && n && i.push(AL(n, e)), a && i.push("background-color:" + a), T(["width", "color", "radius"], function(d) {
    var v = "border-" + d, g = y0(v), p = r.get(g);
    p != null && i.push(v + ":" + p + (d === "color" ? "" : "px"));
  }), i.push(ML(h)), c != null && i.push("padding:" + ja(c).join("px ") + "px"), i.join(";") + ";";
}
function hy(r, t, e, i, n) {
  var a = t && t.painter;
  if (e) {
    var o = a && a.getViewportRoot();
    o && K1(r, o, e, i, n);
  } else {
    r[0] = i, r[1] = n;
    var s = a && a.getViewportRootOffset();
    s && (r[0] += s.offsetLeft, r[1] += s.offsetTop);
  }
  r[2] = r[0] / t.getWidth(), r[3] = r[1] / t.getHeight();
}
var kL = (
  /** @class */
  function() {
    function r(t, e) {
      if (this._show = !1, this._styleCoord = [0, 0, 0, 0], this._enterable = !0, this._alwaysShowContent = !1, this._firstShow = !0, this._longHide = !0, j.wxa)
        return null;
      var i = document.createElement("div");
      i.domBelongToZr = !0, this.el = i;
      var n = this._zr = t.getZr(), a = e.appendTo, o = a && (V(a) ? document.querySelector(a) : Ma(a) ? a : Q(a) && a(t.getDom()));
      hy(this._styleCoord, n, o, t.getWidth() / 2, t.getHeight() / 2), (o || t.getDom()).appendChild(i), this._api = t, this._container = o;
      var s = this;
      i.onmouseenter = function() {
        s._enterable && (clearTimeout(s._hideTimeout), s._show = !0), s._inContent = !0;
      }, i.onmousemove = function(l) {
        if (l = l || window.event, !s._enterable) {
          var u = n.handler, h = n.painter.getViewportRoot();
          le(h, l, !0), u.dispatch("mousemove", l);
        }
      }, i.onmouseleave = function() {
        s._inContent = !1, s._enterable && s._show && s.hideLater(s._hideDelay);
      };
    }
    return r.prototype.update = function(t) {
      if (!this._container) {
        var e = this._api.getDom(), i = xL(e, "position"), n = e.style;
        n.position !== "absolute" && i !== "absolute" && (n.position = "relative");
      }
      var a = t.get("alwaysShowContent");
      a && this._moveIfResized(), this._alwaysShowContent = a, this.el.className = t.get("className") || "";
    }, r.prototype.show = function(t, e) {
      clearTimeout(this._hideTimeout), clearTimeout(this._longHideTimeout);
      var i = this.el, n = i.style, a = this._styleCoord;
      i.innerHTML ? n.cssText = SL + DL(t, !this._firstShow, this._longHide) + uy(a[0], a[1], !0) + ("border-color:" + wi(e) + ";") + (t.get("extraCssText") || "") + (";pointer-events:" + (this._enterable ? "auto" : "none")) : n.display = "none", this._show = !0, this._firstShow = !1, this._longHide = !1;
    }, r.prototype.setContent = function(t, e, i, n, a) {
      var o = this.el;
      if (t == null) {
        o.innerHTML = "";
        return;
      }
      var s = "";
      if (V(a) && i.get("trigger") === "item" && !Hb(i) && (s = CL(i, n, a)), V(t))
        o.innerHTML = t + s;
      else if (t) {
        o.innerHTML = "", B(t) || (t = [t]);
        for (var l = 0; l < t.length; l++)
          Ma(t[l]) && t[l].parentNode !== o && o.appendChild(t[l]);
        if (s && o.childNodes.length) {
          var u = document.createElement("div");
          u.innerHTML = s, o.appendChild(u);
        }
      }
    }, r.prototype.setEnterable = function(t) {
      this._enterable = t;
    }, r.prototype.getSize = function() {
      var t = this.el;
      return t ? [t.offsetWidth, t.offsetHeight] : [0, 0];
    }, r.prototype.moveTo = function(t, e) {
      if (this.el) {
        var i = this._styleCoord;
        if (hy(i, this._zr, this._container, t, e), i[0] != null && i[1] != null) {
          var n = this.el.style, a = uy(i[0], i[1]);
          T(a, function(o) {
            n[o[0]] = o[1];
          });
        }
      }
    }, r.prototype._moveIfResized = function() {
      var t = this._styleCoord[2], e = this._styleCoord[3];
      this.moveTo(t * this._zr.getWidth(), e * this._zr.getHeight());
    }, r.prototype.hide = function() {
      var t = this, e = this.el.style;
      e.visibility = "hidden", e.opacity = "0", j.transform3dSupported && (e.willChange = ""), this._show = !1, this._longHideTimeout = setTimeout(function() {
        return t._longHide = !0;
      }, 500);
    }, r.prototype.hideLater = function(t) {
      this._show && !(this._inContent && this._enterable) && !this._alwaysShowContent && (t ? (this._hideDelay = t, this._show = !1, this._hideTimeout = setTimeout(at(this.hide, this), t)) : this.hide());
    }, r.prototype.isShow = function() {
      return this._show;
    }, r.prototype.dispose = function() {
      clearTimeout(this._hideTimeout), clearTimeout(this._longHideTimeout);
      var t = this.el.parentNode;
      t && t.removeChild(this.el), this.el = this._container = null;
    }, r;
  }()
), IL = (
  /** @class */
  function() {
    function r(t) {
      this._show = !1, this._styleCoord = [0, 0, 0, 0], this._alwaysShowContent = !1, this._enterable = !0, this._zr = t.getZr(), fy(this._styleCoord, this._zr, t.getWidth() / 2, t.getHeight() / 2);
    }
    return r.prototype.update = function(t) {
      var e = t.get("alwaysShowContent");
      e && this._moveIfResized(), this._alwaysShowContent = e;
    }, r.prototype.show = function() {
      this._hideTimeout && clearTimeout(this._hideTimeout), this.el.show(), this._show = !0;
    }, r.prototype.setContent = function(t, e, i, n, a) {
      var o = this;
      U(t) && Xt(""), this.el && this._zr.remove(this.el);
      var s = i.getModel("textStyle");
      this.el = new Ht({
        style: {
          rich: e.richTextStyles,
          text: t,
          lineHeight: 22,
          borderWidth: 1,
          borderColor: n,
          textShadowColor: s.get("textShadowColor"),
          fill: i.get(["textStyle", "color"]),
          padding: U0(i, "richText"),
          verticalAlign: "top",
          align: "left"
        },
        z: i.get("z")
      }), T(["backgroundColor", "borderRadius", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY"], function(u) {
        o.el.style[u] = i.get(u);
      }), T(["textShadowBlur", "textShadowOffsetX", "textShadowOffsetY"], function(u) {
        o.el.style[u] = s.get(u) || 0;
      }), this._zr.add(this.el);
      var l = this;
      this.el.on("mouseover", function() {
        l._enterable && (clearTimeout(l._hideTimeout), l._show = !0), l._inContent = !0;
      }), this.el.on("mouseout", function() {
        l._enterable && l._show && l.hideLater(l._hideDelay), l._inContent = !1;
      });
    }, r.prototype.setEnterable = function(t) {
      this._enterable = t;
    }, r.prototype.getSize = function() {
      var t = this.el, e = this.el.getBoundingRect(), i = cy(t.style);
      return [e.width + i.left + i.right, e.height + i.top + i.bottom];
    }, r.prototype.moveTo = function(t, e) {
      var i = this.el;
      if (i) {
        var n = this._styleCoord;
        fy(n, this._zr, t, e), t = n[0], e = n[1];
        var a = i.style, o = gr(a.borderWidth || 0), s = cy(a);
        i.x = t + o + s.left, i.y = e + o + s.top, i.markRedraw();
      }
    }, r.prototype._moveIfResized = function() {
      var t = this._styleCoord[2], e = this._styleCoord[3];
      this.moveTo(t * this._zr.getWidth(), e * this._zr.getHeight());
    }, r.prototype.hide = function() {
      this.el && this.el.hide(), this._show = !1;
    }, r.prototype.hideLater = function(t) {
      this._show && !(this._inContent && this._enterable) && !this._alwaysShowContent && (t ? (this._hideDelay = t, this._show = !1, this._hideTimeout = setTimeout(at(this.hide, this), t)) : this.hide());
    }, r.prototype.isShow = function() {
      return this._show;
    }, r.prototype.dispose = function() {
      this._zr.remove(this.el);
    }, r;
  }()
);
function gr(r) {
  return Math.max(0, r);
}
function cy(r) {
  var t = gr(r.shadowBlur || 0), e = gr(r.shadowOffsetX || 0), i = gr(r.shadowOffsetY || 0);
  return {
    left: gr(t - e),
    right: gr(t + e),
    top: gr(t - i),
    bottom: gr(t + i)
  };
}
function fy(r, t, e, i) {
  r[0] = e, r[1] = i, r[2] = r[0] / t.getWidth(), r[3] = r[1] / t.getHeight();
}
var LL = new Mt({
  shape: {
    x: -1,
    y: -1,
    width: 2,
    height: 2
  }
}), PL = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e;
    }
    return t.prototype.init = function(e, i) {
      if (!(j.node || !i.getDom())) {
        var n = e.getComponent("tooltip"), a = this._renderMode = Sw(n.get("renderMode"));
        this._tooltipContent = a === "richText" ? new IL(i) : new kL(i, {
          appendTo: n.get("appendToBody", !0) ? "body" : n.get("appendTo", !0)
        });
      }
    }, t.prototype.render = function(e, i, n) {
      if (!(j.node || !n.getDom())) {
        this.group.removeAll(), this._tooltipModel = e, this._ecModel = i, this._api = n;
        var a = this._tooltipContent;
        a.update(e), a.setEnterable(e.get("enterable")), this._initGlobalListener(), this._keepShow(), this._renderMode !== "richText" && e.get("transitionDuration") ? Sf(this, "_updatePosition", 50, "fixRate") : zh(this, "_updatePosition");
      }
    }, t.prototype._initGlobalListener = function() {
      var e = this._tooltipModel, i = e.get("triggerOn");
      Bb("itemTooltip", this._api, at(function(n, a, o) {
        i !== "none" && (i.indexOf(n) >= 0 ? this._tryShow(a, o) : n === "leave" && this._hide(o));
      }, this));
    }, t.prototype._keepShow = function() {
      var e = this._tooltipModel, i = this._ecModel, n = this._api, a = e.get("triggerOn");
      if (this._lastX != null && this._lastY != null && a !== "none" && a !== "click") {
        var o = this;
        clearTimeout(this._refreshUpdateTimeout), this._refreshUpdateTimeout = setTimeout(function() {
          !n.isDisposed() && o.manuallyShowTip(e, i, n, {
            x: o._lastX,
            y: o._lastY,
            dataByCoordSys: o._lastDataByCoordSys
          });
        });
      }
    }, t.prototype.manuallyShowTip = function(e, i, n, a) {
      if (!(a.from === this.uid || j.node || !n.getDom())) {
        var o = dy(a, n);
        this._ticket = "";
        var s = a.dataByCoordSys, l = OL(a, i, n);
        if (l) {
          var u = l.el.getBoundingRect().clone();
          u.applyTransform(l.el.transform), this._tryShow({
            offsetX: u.x + u.width / 2,
            offsetY: u.y + u.height / 2,
            target: l.el,
            position: a.position,
            // When manully trigger, the mouse is not on the el, so we'd better to
            // position tooltip on the bottom of the el and display arrow is possible.
            positionDefault: "bottom"
          }, o);
        } else if (a.tooltip && a.x != null && a.y != null) {
          var h = LL;
          h.x = a.x, h.y = a.y, h.update(), lt(h).tooltipConfig = {
            name: null,
            option: a.tooltip
          }, this._tryShow({
            offsetX: a.x,
            offsetY: a.y,
            target: h
          }, o);
        } else if (s)
          this._tryShow({
            offsetX: a.x,
            offsetY: a.y,
            position: a.position,
            dataByCoordSys: s,
            tooltipOption: a.tooltipOption
          }, o);
        else if (a.seriesIndex != null) {
          if (this._manuallyAxisShowTip(e, i, n, a))
            return;
          var c = zb(a, i), f = c.point[0], d = c.point[1];
          f != null && d != null && this._tryShow({
            offsetX: f,
            offsetY: d,
            target: c.el,
            position: a.position,
            // When manully trigger, the mouse is not on the el, so we'd better to
            // position tooltip on the bottom of the el and display arrow is possible.
            positionDefault: "bottom"
          }, o);
        } else a.x != null && a.y != null && (n.dispatchAction({
          type: "updateAxisPointer",
          x: a.x,
          y: a.y
        }), this._tryShow({
          offsetX: a.x,
          offsetY: a.y,
          position: a.position,
          target: n.getZr().findHover(a.x, a.y).target
        }, o));
      }
    }, t.prototype.manuallyHideTip = function(e, i, n, a) {
      var o = this._tooltipContent;
      this._tooltipModel && o.hideLater(this._tooltipModel.get("hideDelay")), this._lastX = this._lastY = this._lastDataByCoordSys = null, a.from !== this.uid && this._hide(dy(a, n));
    }, t.prototype._manuallyAxisShowTip = function(e, i, n, a) {
      var o = a.seriesIndex, s = a.dataIndex, l = i.getComponent("axisPointer").coordSysAxesInfo;
      if (!(o == null || s == null || l == null)) {
        var u = i.getSeriesByIndex(o);
        if (u) {
          var h = u.getData(), c = Zn([h.getItemModel(s), u, (u.coordinateSystem || {}).model], this._tooltipModel);
          if (c.get("trigger") === "axis")
            return n.dispatchAction({
              type: "updateAxisPointer",
              seriesIndex: o,
              dataIndex: s,
              position: a.position
            }), !0;
        }
      }
    }, t.prototype._tryShow = function(e, i) {
      var n = e.target, a = this._tooltipModel;
      if (a) {
        this._lastX = e.offsetX, this._lastY = e.offsetY;
        var o = e.dataByCoordSys;
        if (o && o.length)
          this._showAxisTooltip(o, e);
        else if (n) {
          var s = lt(n);
          if (s.ssrType === "legend")
            return;
          this._lastDataByCoordSys = null;
          var l, u;
          oa(n, function(h) {
            if (lt(h).dataIndex != null)
              return l = h, !0;
            if (lt(h).tooltipConfig != null)
              return u = h, !0;
          }, !0), l ? this._showSeriesItemTooltip(e, l, i) : u ? this._showComponentItemTooltip(e, u, i) : this._hide(i);
        } else
          this._lastDataByCoordSys = null, this._hide(i);
      }
    }, t.prototype._showOrMove = function(e, i) {
      var n = e.get("showDelay");
      i = at(i, this), clearTimeout(this._showTimout), n > 0 ? this._showTimout = setTimeout(i, n) : i();
    }, t.prototype._showAxisTooltip = function(e, i) {
      var n = this._ecModel, a = this._tooltipModel, o = [i.offsetX, i.offsetY], s = Zn([i.tooltipOption], a), l = this._renderMode, u = [], h = Dr("section", {
        blocks: [],
        noHeader: !0
      }), c = [], f = new _u();
      T(e, function(m) {
        T(m.dataByAxis, function(_) {
          var b = n.getComponent(_.axisDim + "Axis", _.axisIndex), w = _.value;
          if (!(!b || w == null)) {
            var x = Ob(w, b.axis, n, _.seriesDataIndices, _.valueLabelOpt), S = Dr("section", {
              header: x,
              noHeader: !ze(x),
              sortBlocks: !0,
              blocks: []
            });
            h.blocks.push(S), T(_.seriesDataIndices, function(A) {
              var M = n.getSeriesByIndex(A.seriesIndex), D = A.dataIndexInside, C = M.getDataParams(D);
              if (!(C.dataIndex < 0)) {
                C.axisDim = _.axisDim, C.axisIndex = _.axisIndex, C.axisType = _.axisType, C.axisId = _.axisId, C.axisValue = Rf(b.axis, {
                  value: w
                }), C.axisValueLabel = x, C.marker = f.makeTooltipMarker("item", wi(C.color), l);
                var I = ep(M.formatTooltip(D, !0, null)), L = I.frag;
                if (L) {
                  var P = Zn([M], a).get("valueFormatter");
                  S.blocks.push(P ? $({
                    valueFormatter: P
                  }, L) : L);
                }
                I.text && c.push(I.text), u.push(C);
              }
            });
          }
        });
      }), h.blocks.reverse(), c.reverse();
      var d = i.position, v = s.get("order"), g = sp(h, f, l, v, n.get("useUTC"), s.get("textStyle"));
      g && c.unshift(g);
      var p = l === "richText" ? `

` : "<br/>", y = c.join(p);
      this._showOrMove(s, function() {
        this._updateContentNotChangedOnAxis(e, u) ? this._updatePosition(s, d, o[0], o[1], this._tooltipContent, u) : this._showTooltipContent(s, y, u, Math.random() + "", o[0], o[1], d, null, f);
      });
    }, t.prototype._showSeriesItemTooltip = function(e, i, n) {
      var a = this._ecModel, o = lt(i), s = o.seriesIndex, l = a.getSeriesByIndex(s), u = o.dataModel || l, h = o.dataIndex, c = o.dataType, f = u.getData(c), d = this._renderMode, v = e.positionDefault, g = Zn([f.getItemModel(h), u, l && (l.coordinateSystem || {}).model], this._tooltipModel, v ? {
        position: v
      } : null), p = g.get("trigger");
      if (!(p != null && p !== "item")) {
        var y = u.getDataParams(h, c), m = new _u();
        y.marker = m.makeTooltipMarker("item", wi(y.color), d);
        var _ = ep(u.formatTooltip(h, !1, c)), b = g.get("order"), w = g.get("valueFormatter"), x = _.frag, S = x ? sp(w ? $({
          valueFormatter: w
        }, x) : x, m, d, b, a.get("useUTC"), g.get("textStyle")) : _.text, A = "item_" + u.name + "_" + h;
        this._showOrMove(g, function() {
          this._showTooltipContent(g, S, y, A, e.offsetX, e.offsetY, e.position, e.target, m);
        }), n({
          type: "showTip",
          dataIndexInside: h,
          dataIndex: f.getRawIndex(h),
          seriesIndex: s,
          from: this.uid
        });
      }
    }, t.prototype._showComponentItemTooltip = function(e, i, n) {
      var a = this._renderMode === "html", o = lt(i), s = o.tooltipConfig, l = s.option || {}, u = l.encodeHTMLContent;
      if (V(l)) {
        var h = l;
        l = {
          content: h,
          // Fixed formatter
          formatter: h
        }, u = !0;
      }
      u && a && l.content && (l = K(l), l.content = Ut(l.content));
      var c = [l], f = this._ecModel.getComponent(o.componentMainType, o.componentIndex);
      f && c.push(f), c.push({
        formatter: l.content
      });
      var d = e.positionDefault, v = Zn(c, this._tooltipModel, d ? {
        position: d
      } : null), g = v.get("content"), p = Math.random() + "", y = new _u();
      this._showOrMove(v, function() {
        var m = K(v.get("formatterParams") || {});
        this._showTooltipContent(v, g, m, p, e.offsetX, e.offsetY, e.position, i, y);
      }), n({
        type: "showTip",
        from: this.uid
      });
    }, t.prototype._showTooltipContent = function(e, i, n, a, o, s, l, u, h) {
      if (this._ticket = "", !(!e.get("showContent") || !e.get("show"))) {
        var c = this._tooltipContent;
        c.setEnterable(e.get("enterable"));
        var f = e.get("formatter");
        l = l || e.get("position");
        var d = i, v = this._getNearestPoint([o, s], n, e.get("trigger"), e.get("borderColor")), g = v.color;
        if (f)
          if (V(f)) {
            var p = e.ecModel.get("useUTC"), y = B(n) ? n[0] : n, m = y && y.axisType && y.axisType.indexOf("time") >= 0;
            d = f, m && (d = ul(y.axisValue, d, p)), d = m0(d, n, !0);
          } else if (Q(f)) {
            var _ = at(function(b, w) {
              b === this._ticket && (c.setContent(w, h, e, g, l), this._updatePosition(e, l, o, s, c, n, u));
            }, this);
            this._ticket = a, d = f(n, a, _);
          } else
            d = f;
        c.setContent(d, h, e, g, l), c.show(e, g), this._updatePosition(e, l, o, s, c, n, u);
      }
    }, t.prototype._getNearestPoint = function(e, i, n, a) {
      if (n === "axis" || B(i))
        return {
          color: a || (this._renderMode === "html" ? "#fff" : "none")
        };
      if (!B(i))
        return {
          color: a || i.color || i.borderColor
        };
    }, t.prototype._updatePosition = function(e, i, n, a, o, s, l) {
      var u = this._api.getWidth(), h = this._api.getHeight();
      i = i || e.get("position");
      var c = o.getSize(), f = e.get("align"), d = e.get("verticalAlign"), v = l && l.getBoundingRect().clone();
      if (l && v.applyTransform(l.transform), Q(i) && (i = i([n, a], s, o.el, v, {
        viewSize: [u, h],
        contentSize: c.slice()
      })), B(i))
        n = Ct(i[0], u), a = Ct(i[1], h);
      else if (U(i)) {
        var g = i;
        g.width = c[0], g.height = c[1];
        var p = cn(g, {
          width: u,
          height: h
        });
        n = p.x, a = p.y, f = null, d = null;
      } else if (V(i) && l) {
        var y = $L(i, v, c, e.get("borderWidth"));
        n = y[0], a = y[1];
      } else {
        var y = EL(n, a, o, u, h, f ? null : 20, d ? null : 20);
        n = y[0], a = y[1];
      }
      if (f && (n -= vy(f) ? c[0] / 2 : f === "right" ? c[0] : 0), d && (a -= vy(d) ? c[1] / 2 : d === "bottom" ? c[1] : 0), Hb(e)) {
        var y = RL(n, a, o, u, h);
        n = y[0], a = y[1];
      }
      o.moveTo(n, a);
    }, t.prototype._updateContentNotChangedOnAxis = function(e, i) {
      var n = this._lastDataByCoordSys, a = this._cbParamsList, o = !!n && n.length === e.length;
      return o && T(n, function(s, l) {
        var u = s.dataByAxis || [], h = e[l] || {}, c = h.dataByAxis || [];
        o = o && u.length === c.length, o && T(u, function(f, d) {
          var v = c[d] || {}, g = f.seriesDataIndices || [], p = v.seriesDataIndices || [];
          o = o && f.value === v.value && f.axisType === v.axisType && f.axisId === v.axisId && g.length === p.length, o && T(g, function(y, m) {
            var _ = p[m];
            o = o && y.seriesIndex === _.seriesIndex && y.dataIndex === _.dataIndex;
          }), a && T(f.seriesDataIndices, function(y) {
            var m = y.seriesIndex, _ = i[m], b = a[m];
            _ && b && b.data !== _.data && (o = !1);
          });
        });
      }), this._lastDataByCoordSys = e, this._cbParamsList = i, !!o;
    }, t.prototype._hide = function(e) {
      this._lastDataByCoordSys = null, e({
        type: "hideTip",
        from: this.uid
      });
    }, t.prototype.dispose = function(e, i) {
      j.node || !i.getDom() || (zh(this, "_updatePosition"), this._tooltipContent.dispose(), cc("itemTooltip", i));
    }, t.type = "tooltip", t;
  }(ne)
);
function Zn(r, t, e) {
  var i = t.ecModel, n;
  e ? (n = new bt(e, i, i), n = new bt(t.option, n, i)) : n = t;
  for (var a = r.length - 1; a >= 0; a--) {
    var o = r[a];
    o && (o instanceof bt && (o = o.get("tooltip", !0)), V(o) && (o = {
      formatter: o
    }), o && (n = new bt(o, n, i)));
  }
  return n;
}
function dy(r, t) {
  return r.dispatchAction || at(t.dispatchAction, t);
}
function EL(r, t, e, i, n, a, o) {
  var s = e.getSize(), l = s[0], u = s[1];
  return a != null && (r + l + a + 2 > i ? r -= l + a : r += a), o != null && (t + u + o > n ? t -= u + o : t += o), [r, t];
}
function RL(r, t, e, i, n) {
  var a = e.getSize(), o = a[0], s = a[1];
  return r = Math.min(r + o, i) - o, t = Math.min(t + s, n) - s, r = Math.max(r, 0), t = Math.max(t, 0), [r, t];
}
function $L(r, t, e, i) {
  var n = e[0], a = e[1], o = Math.ceil(Math.SQRT2 * i) + 8, s = 0, l = 0, u = t.width, h = t.height;
  switch (r) {
    case "inside":
      s = t.x + u / 2 - n / 2, l = t.y + h / 2 - a / 2;
      break;
    case "top":
      s = t.x + u / 2 - n / 2, l = t.y - a - o;
      break;
    case "bottom":
      s = t.x + u / 2 - n / 2, l = t.y + h + o;
      break;
    case "left":
      s = t.x - n - o, l = t.y + h / 2 - a / 2;
      break;
    case "right":
      s = t.x + u + o, l = t.y + h / 2 - a / 2;
  }
  return [s, l];
}
function vy(r) {
  return r === "center" || r === "middle";
}
function OL(r, t, e) {
  var i = Yc(r).queryOptionMap, n = i.keys()[0];
  if (!(!n || n === "series")) {
    var a = qa(t, n, i.get(n), {
      useDefault: !1,
      enableAll: !1,
      enableNone: !1
    }), o = a.models[0];
    if (o) {
      var s = e.getViewOfComponentModel(o), l;
      if (s.group.traverse(function(u) {
        var h = lt(u).tooltipConfig;
        if (h && h.name === r.name)
          return l = u, !0;
      }), l)
        return {
          componentMainType: n,
          componentIndex: o.componentIndex,
          el: l
        };
    }
  }
}
function NL(r) {
  kr(Fb), r.registerComponentModel(_L), r.registerComponentView(PL), r.registerAction({
    type: "showTip",
    event: "showTip",
    update: "tooltip:manuallyShowTip"
  }, Et), r.registerAction({
    type: "hideTip",
    event: "hideTip",
    update: "tooltip:manuallyHideTip"
  }, Et);
}
var BL = ["rect", "polygon", "keep", "clear"];
function zL(r, t) {
  var e = Rt(r ? r.brush : []);
  if (e.length) {
    var i = [];
    T(e, function(l) {
      var u = l.hasOwnProperty("toolbox") ? l.toolbox : [];
      u instanceof Array && (i = i.concat(u));
    });
    var n = r && r.toolbox;
    B(n) && (n = n[0]), n || (n = {
      feature: {}
    }, r.toolbox = [n]);
    var a = n.feature || (n.feature = {}), o = a.brush || (a.brush = {}), s = o.type || (o.type = []);
    s.push.apply(s, i), FL(s), t && !s.length && s.push.apply(s, BL);
  }
}
function FL(r) {
  var t = {};
  T(r, function(e) {
    t[e] = 1;
  }), r.length = 0, T(t, function(e, i) {
    r.push(i);
  });
}
var py = T;
function gy(r) {
  if (r) {
    for (var t in r)
      if (r.hasOwnProperty(t))
        return !0;
  }
}
function HL(r, t, e) {
  var i = {};
  return py(t, function(a) {
    var o = i[a] = n();
    py(r[a], function(s, l) {
      if (vi.isValidType(l)) {
        var u = {
          type: l,
          visual: s
        };
        e && e(u, a), o[l] = new vi(u), l === "opacity" && (u = K(u), u.type = "colorAlpha", o.__hidden.__alphaForOpacity = new vi(u));
      }
    });
  }), i;
  function n() {
    var a = function() {
    };
    a.prototype.__hidden = a.prototype;
    var o = new a();
    return o;
  }
}
function VL(r, t, e) {
  var i;
  T(e, function(n) {
    t.hasOwnProperty(n) && gy(t[n]) && (i = !0);
  }), i && T(e, function(n) {
    t.hasOwnProperty(n) && gy(t[n]) ? r[n] = K(t[n]) : delete r[n];
  });
}
function GL(r, t, e, i, n, a) {
  var o = {};
  T(r, function(c) {
    var f = vi.prepareVisualTypes(t[c]);
    o[c] = f;
  });
  var s;
  function l(c) {
    return t_(e, s, c);
  }
  function u(c, f) {
    HA(e, s, c, f);
  }
  e.each(h);
  function h(c, f) {
    s = c;
    var d = e.getRawDataItem(s);
    if (!(d && d.visualMap === !1))
      for (var v = i.call(n, c), g = t[v], p = o[v], y = 0, m = p.length; y < m; y++) {
        var _ = p[y];
        g[_] && g[_].applyVisual(c, l, u);
      }
  }
}
function WL(r) {
  var t = r.brushType, e = {
    point: function(i) {
      return yy[t].point(i, e, r);
    },
    rect: function(i) {
      return yy[t].rect(i, e, r);
    }
  };
  return e;
}
var yy = {
  lineX: my(0),
  lineY: my(1),
  rect: {
    point: function(r, t, e) {
      return r && e.boundingRect.contain(r[0], r[1]);
    },
    rect: function(r, t, e) {
      return r && e.boundingRect.intersect(r);
    }
  },
  polygon: {
    point: function(r, t, e) {
      return r && e.boundingRect.contain(r[0], r[1]) && Un(e.range, r[0], r[1]);
    },
    rect: function(r, t, e) {
      var i = e.range;
      if (!r || i.length <= 1)
        return !1;
      var n = r.x, a = r.y, o = r.width, s = r.height, l = i[0];
      if (Un(i, n, a) || Un(i, n + o, a) || Un(i, n, a + s) || Un(i, n + o, a + s) || ot.create(r).contain(l[0], l[1]) || ia(n, a, n + o, a, i) || ia(n, a, n, a + s, i) || ia(n + o, a, n + o, a + s, i) || ia(n, a + s, n + o, a + s, i))
        return !0;
    }
  }
};
function my(r) {
  var t = ["x", "y"], e = ["width", "height"];
  return {
    point: function(i, n, a) {
      if (i) {
        var o = a.range, s = i[r];
        return qn(s, o);
      }
    },
    rect: function(i, n, a) {
      if (i) {
        var o = a.range, s = [i[t[r]], i[t[r]] + i[e[r]]];
        return s[1] < s[0] && s.reverse(), qn(s[0], o) || qn(s[1], o) || qn(o[0], s) || qn(o[1], s);
      }
    }
  };
}
function qn(r, t) {
  return t[0] <= r && r <= t[1];
}
var _y = ["inBrush", "outOfBrush"], Xu = "__ecBrushSelect", dc = "__ecInBrushSelectEvent";
function Ub(r) {
  r.eachComponent({
    mainType: "brush"
  }, function(t) {
    var e = t.brushTargetManager = new gL(t.option, r);
    e.setInputRanges(t.areas, r);
  });
}
function UL(r, t, e) {
  var i = [], n, a;
  r.eachComponent({
    mainType: "brush"
  }, function(o) {
    e && e.type === "takeGlobalCursor" && o.setBrushOption(e.key === "brush" ? e.brushOption : {
      brushType: !1
    });
  }), Ub(r), r.eachComponent({
    mainType: "brush"
  }, function(o, s) {
    var l = {
      brushId: o.id,
      brushIndex: s,
      brushName: o.name,
      areas: K(o.areas),
      selected: []
    };
    i.push(l);
    var u = o.option, h = u.brushLink, c = [], f = [], d = [], v = !1;
    s || (n = u.throttleType, a = u.throttleDelay);
    var g = H(o.areas, function(w) {
      var x = qL[w.brushType], S = ht({
        boundingRect: x ? x(w) : void 0
      }, w);
      return S.selectors = WL(S), S;
    }), p = HL(o.option, _y, function(w) {
      w.mappingMethod = "fixed";
    });
    B(h) && T(h, function(w) {
      c[w] = 1;
    });
    function y(w) {
      return h === "all" || !!c[w];
    }
    function m(w) {
      return !!w.length;
    }
    r.eachSeries(function(w, x) {
      var S = d[x] = [];
      w.subType === "parallel" ? _(w, x) : b(w, x, S);
    });
    function _(w, x) {
      var S = w.coordinateSystem;
      v = v || S.hasAxisBrushed(), y(x) && S.eachActiveState(w.getData(), function(A, M) {
        A === "active" && (f[M] = 1);
      });
    }
    function b(w, x, S) {
      if (!(!w.brushSelector || ZL(o, x)) && (T(g, function(M) {
        o.brushTargetManager.controlSeries(M, w, r) && S.push(M), v = v || m(S);
      }), y(x) && m(S))) {
        var A = w.getData();
        A.each(function(M) {
          by(w, S, A, M) && (f[M] = 1);
        });
      }
    }
    r.eachSeries(function(w, x) {
      var S = {
        seriesId: w.id,
        seriesIndex: x,
        seriesName: w.name,
        dataIndex: []
      };
      l.selected.push(S);
      var A = d[x], M = w.getData(), D = y(x) ? function(C) {
        return f[C] ? (S.dataIndex.push(M.getRawIndex(C)), "inBrush") : "outOfBrush";
      } : function(C) {
        return by(w, A, M, C) ? (S.dataIndex.push(M.getRawIndex(C)), "inBrush") : "outOfBrush";
      };
      (y(x) ? v : m(A)) && GL(_y, p, M, D);
    });
  }), YL(t, n, a, i, e);
}
function YL(r, t, e, i, n) {
  if (n) {
    var a = r.getZr();
    if (!a[dc]) {
      a[Xu] || (a[Xu] = XL);
      var o = Sf(a, Xu, e, t);
      o(r, i);
    }
  }
}
function XL(r, t) {
  if (!r.isDisposed()) {
    var e = r.getZr();
    e[dc] = !0, r.dispatchAction({
      type: "brushSelect",
      batch: t
    }), e[dc] = !1;
  }
}
function by(r, t, e, i) {
  for (var n = 0, a = t.length; n < a; n++) {
    var o = t[n];
    if (r.brushSelector(i, e, o.selectors, o))
      return !0;
  }
}
function ZL(r, t) {
  var e = r.option.seriesIndex;
  return e != null && e !== "all" && (B(e) ? rt(e, t) < 0 : t !== e);
}
var qL = {
  rect: function(r) {
    return xy(r.range);
  },
  polygon: function(r) {
    for (var t, e = r.range, i = 0, n = e.length; i < n; i++) {
      t = t || [[1 / 0, -1 / 0], [1 / 0, -1 / 0]];
      var a = e[i];
      a[0] < t[0][0] && (t[0][0] = a[0]), a[0] > t[0][1] && (t[0][1] = a[0]), a[1] < t[1][0] && (t[1][0] = a[1]), a[1] > t[1][1] && (t[1][1] = a[1]);
    }
    return t && xy(t);
  }
};
function xy(r) {
  return new ot(r[0][0], r[1][0], r[0][1] - r[0][0], r[1][1] - r[1][0]);
}
var KL = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e;
    }
    return t.prototype.init = function(e, i) {
      this.ecModel = e, this.api = i, this.model, (this._brushController = new II(i.getZr())).on("brush", at(this._onBrush, this)).mount();
    }, t.prototype.render = function(e, i, n, a) {
      this.model = e, this._updateController(e, i, n, a);
    }, t.prototype.updateTransform = function(e, i, n, a) {
      Ub(i), this._updateController(e, i, n, a);
    }, t.prototype.updateVisual = function(e, i, n, a) {
      this.updateTransform(e, i, n, a);
    }, t.prototype.updateView = function(e, i, n, a) {
      this._updateController(e, i, n, a);
    }, t.prototype._updateController = function(e, i, n, a) {
      (!a || a.$from !== e.id) && this._brushController.setPanels(e.brushTargetManager.makePanelOpts(n)).enableBrush(e.brushOption).updateCovers(e.areas.slice());
    }, t.prototype.dispose = function() {
      this._brushController.dispose();
    }, t.prototype._onBrush = function(e) {
      var i = this.model.id, n = this.model.brushTargetManager.setOutputRanges(e.areas, this.ecModel);
      (!e.isEnd || e.removeOnClick) && this.api.dispatchAction({
        type: "brush",
        brushId: i,
        areas: K(n),
        $from: i
      }), e.isEnd && this.api.dispatchAction({
        type: "brushEnd",
        brushId: i,
        areas: K(n),
        $from: i
      });
    }, t.type = "brush", t;
  }(ne)
), jL = "#ddd", QL = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e.areas = [], e.brushOption = {}, e;
    }
    return t.prototype.optionUpdated = function(e, i) {
      var n = this.option;
      !i && VL(n, e, ["inBrush", "outOfBrush"]);
      var a = n.inBrush = n.inBrush || {};
      n.outOfBrush = n.outOfBrush || {
        color: jL
      }, a.hasOwnProperty("liftZ") || (a.liftZ = 5);
    }, t.prototype.setAreas = function(e) {
      e && (this.areas = H(e, function(i) {
        return wy(this.option, i);
      }, this));
    }, t.prototype.setBrushOption = function(e) {
      this.brushOption = wy(this.option, e), this.brushType = this.brushOption.brushType;
    }, t.type = "brush", t.dependencies = ["geo", "grid", "xAxis", "yAxis", "parallel", "series"], t.defaultOption = {
      seriesIndex: "all",
      brushType: "rect",
      brushMode: "single",
      transformable: !0,
      brushStyle: {
        borderWidth: 1,
        color: "rgba(210,219,238,0.3)",
        borderColor: "#D2DBEE"
      },
      throttleType: "fixRate",
      throttleDelay: 0,
      removeOnClick: !0,
      z: 1e4
    }, t;
  }(dt)
);
function wy(r, t) {
  return ut({
    brushType: r.brushType,
    brushMode: r.brushMode,
    transformable: r.transformable,
    brushStyle: new bt(r.brushStyle).getItemStyle(),
    removeOnClick: r.removeOnClick,
    z: r.z
  }, t, !0);
}
var JL = ["rect", "polygon", "lineX", "lineY", "keep", "clear"];
(function(r) {
  N(t, r);
  function t() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return t.prototype.render = function(e, i, n) {
    var a, o, s;
    i.eachComponent({
      mainType: "brush"
    }, function(l) {
      a = l.brushType, o = l.brushOption.brushMode || "single", s = s || !!l.areas.length;
    }), this._brushType = a, this._brushMode = o, T(e.get("type", !0), function(l) {
      e.setIconStatus(l, (l === "keep" ? o === "multiple" : l === "clear" ? s : l === a) ? "emphasis" : "normal");
    });
  }, t.prototype.updateView = function(e, i, n) {
    this.render(e, i, n);
  }, t.prototype.getIcons = function() {
    var e = this.model, i = e.get("icon", !0), n = {};
    return T(e.get("type", !0), function(a) {
      i[a] && (n[a] = i[a]);
    }), n;
  }, t.prototype.onclick = function(e, i, n) {
    var a = this._brushType, o = this._brushMode;
    n === "clear" ? (i.dispatchAction({
      type: "axisAreaSelect",
      intervals: []
    }), i.dispatchAction({
      type: "brush",
      command: "clear",
      // Clear all areas of all brush components.
      areas: []
    })) : i.dispatchAction({
      type: "takeGlobalCursor",
      key: "brush",
      brushOption: {
        brushType: n === "keep" ? a : a === n ? !1 : n,
        brushMode: n === "keep" ? o === "multiple" ? "single" : "multiple" : o
      }
    });
  }, t.getDefaultOption = function(e) {
    var i = {
      show: !0,
      type: JL.slice(),
      icon: {
        /* eslint-disable */
        rect: "M7.3,34.7 M0.4,10V-0.2h9.8 M89.6,10V-0.2h-9.8 M0.4,60v10.2h9.8 M89.6,60v10.2h-9.8 M12.3,22.4V10.5h13.1 M33.6,10.5h7.8 M49.1,10.5h7.8 M77.5,22.4V10.5h-13 M12.3,31.1v8.2 M77.7,31.1v8.2 M12.3,47.6v11.9h13.1 M33.6,59.5h7.6 M49.1,59.5 h7.7 M77.5,47.6v11.9h-13",
        polygon: "M55.2,34.9c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1 s-3.1-1.4-3.1-3.1S53.5,34.9,55.2,34.9z M50.4,51c1.7,0,3.1,1.4,3.1,3.1c0,1.7-1.4,3.1-3.1,3.1c-1.7,0-3.1-1.4-3.1-3.1 C47.3,52.4,48.7,51,50.4,51z M55.6,37.1l1.5-7.8 M60.1,13.5l1.6-8.7l-7.8,4 M59,19l-1,5.3 M24,16.1l6.4,4.9l6.4-3.3 M48.5,11.6 l-5.9,3.1 M19.1,12.8L9.7,5.1l1.1,7.7 M13.4,29.8l1,7.3l6.6,1.6 M11.6,18.4l1,6.1 M32.8,41.9 M26.6,40.4 M27.3,40.2l6.1,1.6 M49.9,52.1l-5.6-7.6l-4.9-1.2",
        lineX: "M15.2,30 M19.7,15.6V1.9H29 M34.8,1.9H40.4 M55.3,15.6V1.9H45.9 M19.7,44.4V58.1H29 M34.8,58.1H40.4 M55.3,44.4 V58.1H45.9 M12.5,20.3l-9.4,9.6l9.6,9.8 M3.1,29.9h16.5 M62.5,20.3l9.4,9.6L62.3,39.7 M71.9,29.9H55.4",
        lineY: "M38.8,7.7 M52.7,12h13.2v9 M65.9,26.6V32 M52.7,46.3h13.2v-9 M24.9,12H11.8v9 M11.8,26.6V32 M24.9,46.3H11.8v-9 M48.2,5.1l-9.3-9l-9.4,9.2 M38.9-3.9V12 M48.2,53.3l-9.3,9l-9.4-9.2 M38.9,62.3V46.4",
        keep: "M4,10.5V1h10.3 M20.7,1h6.1 M33,1h6.1 M55.4,10.5V1H45.2 M4,17.3v6.6 M55.6,17.3v6.6 M4,30.5V40h10.3 M20.7,40 h6.1 M33,40h6.1 M55.4,30.5V40H45.2 M21,18.9h62.9v48.6H21V18.9z",
        clear: "M22,14.7l30.9,31 M52.9,14.7L22,45.7 M4.7,16.8V4.2h13.1 M26,4.2h7.8 M41.6,4.2h7.8 M70.3,16.8V4.2H57.2 M4.7,25.9v8.6 M70.3,25.9v8.6 M4.7,43.2v12.6h13.1 M26,55.8h7.8 M41.6,55.8h7.8 M70.3,43.2v12.6H57.2"
        // jshint ignore:line
        /* eslint-enable */
      },
      // `rect`, `polygon`, `lineX`, `lineY`, `keep`, `clear`
      title: e.getLocaleModel().get(["toolbox", "brush", "title"])
    };
    return i;
  }, t;
})(dL);
function tP(r) {
  r.registerComponentView(KL), r.registerComponentModel(QL), r.registerPreprocessor(zL), r.registerVisual(r.PRIORITY.VISUAL.BRUSH, UL), r.registerAction({
    type: "brush",
    event: "brush",
    update: "updateVisual"
  }, function(t, e) {
    e.eachComponent({
      mainType: "brush",
      query: t
    }, function(i) {
      i.setAreas(t.areas);
    });
  }), r.registerAction({
    type: "brushSelect",
    event: "brushSelected",
    update: "none"
  }, Et), r.registerAction({
    type: "brushEnd",
    event: "brushEnd",
    update: "none"
  }, Et);
}
function eP(r, t) {
  if (!r)
    return !1;
  for (var e = B(r) ? r : [r], i = 0; i < e.length; i++)
    if (e[i] && e[i][t])
      return !0;
  return !1;
}
function zo(r) {
  bh(r, "label", ["show"]);
}
var Fo = Tt(), Wa = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e.createdBySelf = !1, e;
    }
    return t.prototype.init = function(e, i, n) {
      this.mergeDefaultAndTheme(e, n), this._mergeOption(e, n, !1, !0);
    }, t.prototype.isAnimationEnabled = function() {
      if (j.node)
        return !1;
      var e = this.__hostSeries;
      return this.getShallow("animation") && e && e.isAnimationEnabled();
    }, t.prototype.mergeOption = function(e, i) {
      this._mergeOption(e, i, !1, !1);
    }, t.prototype._mergeOption = function(e, i, n, a) {
      var o = this.mainType;
      n || i.eachSeries(function(s) {
        var l = s.get(this.mainType, !0), u = Fo(s)[o];
        if (!l || !l.data) {
          Fo(s)[o] = null;
          return;
        }
        u ? u._mergeOption(l, i, !0) : (a && zo(l), T(l.data, function(h) {
          h instanceof Array ? (zo(h[0]), zo(h[1])) : zo(h);
        }), u = this.createMarkerModelFromSeries(l, this, i), $(u, {
          mainType: this.mainType,
          // Use the same series index and name
          seriesIndex: s.seriesIndex,
          name: s.name,
          createdBySelf: !0
        }), u.__hostSeries = s), Fo(s)[o] = u;
      }, this);
    }, t.prototype.formatTooltip = function(e, i, n) {
      var a = this.getData(), o = this.getRawValue(e), s = a.getName(e);
      return Dr("section", {
        header: this.name,
        blocks: [Dr("nameValue", {
          name: s,
          value: o,
          noName: !s,
          noValue: o == null
        })]
      });
    }, t.prototype.getData = function() {
      return this._data;
    }, t.prototype.setData = function(e) {
      this._data = e;
    }, t.prototype.getDataParams = function(e, i) {
      var n = _f.prototype.getDataParams.call(this, e, i), a = this.__hostSeries;
      return a && (n.seriesId = a.id, n.seriesName = a.name, n.seriesType = a.subType), n;
    }, t.getMarkerModelFromSeries = function(e, i) {
      return Fo(e)[i];
    }, t.type = "marker", t.dependencies = ["series", "grid", "polar", "geo"], t;
  }(dt)
);
Le(Wa, _f.prototype);
function vc(r) {
  return !(isNaN(parseFloat(r.x)) && isNaN(parseFloat(r.y)));
}
function rP(r) {
  return !isNaN(parseFloat(r.x)) && !isNaN(parseFloat(r.y));
}
function Ho(r, t, e, i, n, a) {
  var o = [], s = Si(
    t,
    i
    /* , otherDataDim */
  ), l = s ? t.getCalculationInfo("stackResultDimension") : i, u = Yb(t, l, r), h = t.indicesOfNearest(l, u)[0];
  o[n] = t.get(e, h), o[a] = t.get(l, h);
  var c = t.get(i, h), f = Fe(t.get(i, h));
  return f = Math.min(f, 20), f >= 0 && (o[a] = +o[a].toFixed(f)), [o, c];
}
var Zu = {
  min: et(Ho, "min"),
  max: et(Ho, "max"),
  average: et(Ho, "average"),
  median: et(Ho, "median")
};
function Sy(r, t) {
  if (t) {
    var e = r.getData(), i = r.coordinateSystem, n = i && i.dimensions;
    if (!rP(t) && !B(t.coord) && B(n)) {
      var a = iP(t, e, i, r);
      if (t = K(t), t.type && Zu[t.type] && a.baseAxis && a.valueAxis) {
        var o = rt(n, a.baseAxis.dim), s = rt(n, a.valueAxis.dim), l = Zu[t.type](e, a.baseDataDim, a.valueDataDim, o, s);
        t.coord = l[0], t.value = l[1];
      } else
        t.coord = [t.xAxis != null ? t.xAxis : t.radiusAxis, t.yAxis != null ? t.yAxis : t.angleAxis];
    }
    if (t.coord == null || !B(n))
      t.coord = [];
    else
      for (var u = t.coord, h = 0; h < 2; h++)
        Zu[u[h]] && (u[h] = Yb(e, e.mapDimension(n[h]), u[h]));
    return t;
  }
}
function iP(r, t, e, i) {
  var n = {};
  return r.valueIndex != null || r.valueDim != null ? (n.valueDataDim = r.valueIndex != null ? t.getDimension(r.valueIndex) : r.valueDim, n.valueAxis = e.getAxis(nP(i, n.valueDataDim)), n.baseAxis = e.getOtherAxis(n.valueAxis), n.baseDataDim = t.mapDimension(n.baseAxis.dim)) : (n.baseAxis = i.getBaseAxis(), n.valueAxis = e.getOtherAxis(n.baseAxis), n.baseDataDim = t.mapDimension(n.baseAxis.dim), n.valueDataDim = t.mapDimension(n.valueAxis.dim)), n;
}
function nP(r, t) {
  var e = r.getData().getDimensionInfo(t);
  return e && e.coordDim;
}
function Ty(r, t) {
  return r && r.containData && t.coord && !vc(t) ? r.containData(t.coord) : !0;
}
function aP(r, t, e) {
  return r && r.containZone && t.coord && e.coord && !vc(t) && !vc(e) ? r.containZone(t.coord, e.coord) : !0;
}
function Yb(r, t, e) {
  if (e === "average") {
    var i = 0, n = 0;
    return r.each(t, function(a, o) {
      isNaN(a) || (i += a, n++);
    }), i / n;
  } else return e === "median" ? r.getMedian(t) : r.getDataExtent(t)[e === "max" ? 1 : 0];
}
var qu = Tt(), oP = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e;
    }
    return t.prototype.init = function() {
      this.markerGroupMap = tt();
    }, t.prototype.render = function(e, i, n) {
      var a = this, o = this.markerGroupMap;
      o.each(function(s) {
        qu(s).keep = !1;
      }), i.eachSeries(function(s) {
        var l = Wa.getMarkerModelFromSeries(s, a.type);
        l && a.renderSeries(s, l, i, n);
      }), o.each(function(s) {
        !qu(s).keep && a.group.remove(s.group);
      });
    }, t.prototype.markKeep = function(e) {
      qu(e).keep = !0;
    }, t.prototype.toggleBlurSeries = function(e, i) {
      var n = this;
      T(e, function(a) {
        var o = Wa.getMarkerModelFromSeries(a, n.type);
        if (o) {
          var s = o.getData();
          s.eachItemGraphicEl(function(l) {
            l && (i ? Nm(l) : jc(l));
          });
        }
      });
    }, t.type = "marker", t;
  }(ne)
), sP = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e;
    }
    return t.prototype.createMarkerModelFromSeries = function(e, i, n) {
      return new t(e, i, n);
    }, t.type = "markArea", t.defaultOption = {
      // zlevel: 0,
      // PENDING
      z: 1,
      tooltip: {
        trigger: "item"
      },
      // markArea should fixed on the coordinate system
      animation: !1,
      label: {
        show: !0,
        position: "top"
      },
      itemStyle: {
        // color and borderColor default to use color from series
        // color: 'auto'
        // borderColor: 'auto'
        borderWidth: 0
      },
      emphasis: {
        label: {
          show: !0,
          position: "top"
        }
      }
    }, t;
  }(Wa)
), Vo = Tt(), lP = function(r, t, e, i) {
  var n = i[0], a = i[1];
  if (!(!n || !a)) {
    var o = Sy(r, n), s = Sy(r, a), l = o.coord, u = s.coord;
    l[0] = Be(l[0], -1 / 0), l[1] = Be(l[1], -1 / 0), u[0] = Be(u[0], 1 / 0), u[1] = Be(u[1], 1 / 0);
    var h = P1([{}, o, s]);
    return h.coord = [o.coord, s.coord], h.x0 = o.x, h.y0 = o.y, h.x1 = s.x, h.y1 = s.y, h;
  }
};
function Hs(r) {
  return !isNaN(r) && !isFinite(r);
}
function Cy(r, t, e, i) {
  var n = 1 - r;
  return Hs(t[n]) && Hs(e[n]);
}
function uP(r, t) {
  var e = t.coord[0], i = t.coord[1], n = {
    coord: e,
    x: t.x0,
    y: t.y0
  }, a = {
    coord: i,
    x: t.x1,
    y: t.y1
  };
  return Qa(r, "cartesian2d") ? e && i && (Cy(1, e, i) || Cy(0, e, i)) ? !0 : aP(r, n, a) : Ty(r, n) || Ty(r, a);
}
function Ay(r, t, e, i, n) {
  var a = i.coordinateSystem, o = r.getItemModel(t), s, l = Ct(o.get(e[0]), n.getWidth()), u = Ct(o.get(e[1]), n.getHeight());
  if (!isNaN(l) && !isNaN(u))
    s = [l, u];
  else {
    if (i.getMarkerPosition) {
      var h = r.getValues(["x0", "y0"], t), c = r.getValues(["x1", "y1"], t), f = a.clampData(h), d = a.clampData(c), v = [];
      e[0] === "x0" ? v[0] = f[0] > d[0] ? c[0] : h[0] : v[0] = f[0] > d[0] ? h[0] : c[0], e[1] === "y0" ? v[1] = f[1] > d[1] ? c[1] : h[1] : v[1] = f[1] > d[1] ? h[1] : c[1], s = i.getMarkerPosition(v, e, !0);
    } else {
      var g = r.get(e[0], t), p = r.get(e[1], t), y = [g, p];
      a.clampData && a.clampData(y, y), s = a.dataToPoint(y, !0);
    }
    if (Qa(a, "cartesian2d")) {
      var m = a.getAxis("x"), _ = a.getAxis("y"), g = r.get(e[0], t), p = r.get(e[1], t);
      Hs(g) ? s[0] = m.toGlobalCoord(m.getExtent()[e[0] === "x0" ? 0 : 1]) : Hs(p) && (s[1] = _.toGlobalCoord(_.getExtent()[e[1] === "y0" ? 0 : 1]));
    }
    isNaN(l) || (s[0] = l), isNaN(u) || (s[1] = u);
  }
  return s;
}
var My = [["x0", "y0"], ["x1", "y0"], ["x1", "y1"], ["x0", "y1"]], hP = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e;
    }
    return t.prototype.updateTransform = function(e, i, n) {
      i.eachSeries(function(a) {
        var o = Wa.getMarkerModelFromSeries(a, "markArea");
        if (o) {
          var s = o.getData();
          s.each(function(l) {
            var u = H(My, function(c) {
              return Ay(s, l, c, a, n);
            });
            s.setItemLayout(l, u);
            var h = s.getItemGraphicEl(l);
            h.setShape("points", u);
          });
        }
      }, this);
    }, t.prototype.renderSeries = function(e, i, n, a) {
      var o = e.coordinateSystem, s = e.id, l = e.getData(), u = this.markerGroupMap, h = u.get(s) || u.set(s, {
        group: new St()
      });
      this.group.add(h.group), this.markKeep(h);
      var c = cP(o, e, i);
      i.setData(c), c.each(function(f) {
        var d = H(My, function(A) {
          return Ay(c, f, A, e, a);
        }), v = o.getAxis("x").scale, g = o.getAxis("y").scale, p = v.getExtent(), y = g.getExtent(), m = [v.parse(c.get("x0", f)), v.parse(c.get("x1", f))], _ = [g.parse(c.get("y0", f)), g.parse(c.get("y1", f))];
        Vd(m), Vd(_);
        var b = !(p[0] > m[1] || p[1] < m[0] || y[0] > _[1] || y[1] < _[0]), w = !b;
        c.setItemLayout(f, {
          points: d,
          allClipped: w
        });
        var x = c.getItemModel(f).getModel("itemStyle").getItemStyle(), S = e_(l, "color");
        x.fill || (x.fill = S, V(x.fill) && (x.fill = gs(x.fill, 0.4))), x.stroke || (x.stroke = S), c.setItemVisual(f, "style", x);
      }), c.diff(Vo(h).data).add(function(f) {
        var d = c.getItemLayout(f);
        if (!d.allClipped) {
          var v = new xi({
            shape: {
              points: d.points
            }
          });
          c.setItemGraphicEl(f, v), h.group.add(v);
        }
      }).update(function(f, d) {
        var v = Vo(h).data.getItemGraphicEl(d), g = c.getItemLayout(f);
        g.allClipped ? v && h.group.remove(v) : (v ? jt(v, {
          shape: {
            points: g.points
          }
        }, i, f) : v = new xi({
          shape: {
            points: g.points
          }
        }), c.setItemGraphicEl(f, v), h.group.add(v));
      }).remove(function(f) {
        var d = Vo(h).data.getItemGraphicEl(f);
        h.group.remove(d);
      }).execute(), c.eachItemGraphicEl(function(f, d) {
        var v = c.getItemModel(d), g = c.getItemVisual(d, "style");
        f.useStyle(c.getItemVisual(d, "style")), xn(f, wn(v), {
          labelFetcher: i,
          labelDataIndex: d,
          defaultText: c.getName(d) || "",
          inheritColor: V(g.fill) ? gs(g.fill, 1) : "#000"
        }), Cs(f, v), hn(f, null, null, v.get(["emphasis", "disabled"])), lt(f).dataModel = i;
      }), Vo(h).data = c, h.group.silent = i.get("silent") || e.get("silent");
    }, t.type = "markArea", t;
  }(oP)
);
function cP(r, t, e) {
  var i, n, a = ["x0", "y0", "x1", "y1"];
  if (r) {
    var o = H(r && r.dimensions, function(u) {
      var h = t.getData(), c = h.getDimensionInfo(h.mapDimension(u)) || {};
      return $($({}, c), {
        name: u,
        // DON'T use ordinalMeta to parse and collect ordinal.
        ordinalMeta: null
      });
    });
    n = H(a, function(u, h) {
      return {
        name: u,
        type: o[h % 2].type
      };
    }), i = new Ns(n, e);
  } else
    n = [{
      name: "value",
      type: "float"
    }], i = new Ns(n, e);
  var s = H(e.get("data"), et(lP, t, r, e));
  r && (s = Pt(s, et(uP, r)));
  var l = r ? function(u, h, c, f) {
    var d = u.coord[Math.floor(f / 2)][f % 2];
    return on(d, n[f]);
  } : function(u, h, c, f) {
    return on(u.value, n[f]);
  };
  return i.initData(s, null, l), i.hasItemOption = !0, i;
}
function fP(r) {
  r.registerComponentModel(sP), r.registerComponentView(hP), r.registerPreprocessor(function(t) {
    eP(t.series, "markArea") && (t.markArea = t.markArea || {});
  });
}
var dP = function(r, t) {
  if (t === "all")
    return {
      type: "all",
      title: r.getLocaleModel().get(["legend", "selector", "all"])
    };
  if (t === "inverse")
    return {
      type: "inverse",
      title: r.getLocaleModel().get(["legend", "selector", "inverse"])
    };
}, pc = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e.layoutMode = {
        type: "box",
        // legend.width/height are maxWidth/maxHeight actually,
        // whereas real width/height is calculated by its content.
        // (Setting {left: 10, right: 10} does not make sense).
        // So consider the case:
        // `setOption({legend: {left: 10});`
        // then `setOption({legend: {right: 10});`
        // The previous `left` should be cleared by setting `ignoreSize`.
        ignoreSize: !0
      }, e;
    }
    return t.prototype.init = function(e, i, n) {
      this.mergeDefaultAndTheme(e, n), e.selected = e.selected || {}, this._updateSelector(e);
    }, t.prototype.mergeOption = function(e, i) {
      r.prototype.mergeOption.call(this, e, i), this._updateSelector(e);
    }, t.prototype._updateSelector = function(e) {
      var i = e.selector, n = this.ecModel;
      i === !0 && (i = e.selector = ["all", "inverse"]), B(i) && T(i, function(a, o) {
        V(a) && (a = {
          type: a
        }), i[o] = ut(a, dP(n, a.type));
      });
    }, t.prototype.optionUpdated = function() {
      this._updateData(this.ecModel);
      var e = this._data;
      if (e[0] && this.get("selectedMode") === "single") {
        for (var i = !1, n = 0; n < e.length; n++) {
          var a = e[n].get("name");
          if (this.isSelected(a)) {
            this.select(a), i = !0;
            break;
          }
        }
        !i && this.select(e[0].get("name"));
      }
    }, t.prototype._updateData = function(e) {
      var i = [], n = [];
      e.eachRawSeries(function(l) {
        var u = l.name;
        n.push(u);
        var h;
        if (l.legendVisualProvider) {
          var c = l.legendVisualProvider, f = c.getAllNames();
          e.isSeriesFiltered(l) || (n = n.concat(f)), f.length ? i = i.concat(f) : h = !0;
        } else
          h = !0;
        h && Uc(l) && i.push(l.name);
      }), this._availableNames = n;
      var a = this.get("data") || i, o = tt(), s = H(a, function(l) {
        return (V(l) || wt(l)) && (l = {
          name: l
        }), o.get(l.name) ? null : (o.set(l.name, !0), new bt(l, this, this.ecModel));
      }, this);
      this._data = Pt(s, function(l) {
        return !!l;
      });
    }, t.prototype.getData = function() {
      return this._data;
    }, t.prototype.select = function(e) {
      var i = this.option.selected, n = this.get("selectedMode");
      if (n === "single") {
        var a = this._data;
        T(a, function(o) {
          i[o.get("name")] = !1;
        });
      }
      i[e] = !0;
    }, t.prototype.unSelect = function(e) {
      this.get("selectedMode") !== "single" && (this.option.selected[e] = !1);
    }, t.prototype.toggleSelected = function(e) {
      var i = this.option.selected;
      i.hasOwnProperty(e) || (i[e] = !0), this[i[e] ? "unSelect" : "select"](e);
    }, t.prototype.allSelect = function() {
      var e = this._data, i = this.option.selected;
      T(e, function(n) {
        i[n.get("name", !0)] = !0;
      });
    }, t.prototype.inverseSelect = function() {
      var e = this._data, i = this.option.selected;
      T(e, function(n) {
        var a = n.get("name", !0);
        i.hasOwnProperty(a) || (i[a] = !0), i[a] = !i[a];
      });
    }, t.prototype.isSelected = function(e) {
      var i = this.option.selected;
      return !(i.hasOwnProperty(e) && !i[e]) && rt(this._availableNames, e) >= 0;
    }, t.prototype.getOrient = function() {
      return this.get("orient") === "vertical" ? {
        index: 1,
        name: "vertical"
      } : {
        index: 0,
        name: "horizontal"
      };
    }, t.type = "legend.plain", t.dependencies = ["series"], t.defaultOption = {
      // zlevel: 0,
      z: 4,
      show: !0,
      orient: "horizontal",
      left: "center",
      // right: 'center',
      top: 0,
      // bottom: null,
      align: "auto",
      backgroundColor: "rgba(0,0,0,0)",
      borderColor: "#ccc",
      borderRadius: 0,
      borderWidth: 0,
      padding: 5,
      itemGap: 10,
      itemWidth: 25,
      itemHeight: 14,
      symbolRotate: "inherit",
      symbolKeepAspect: !0,
      inactiveColor: "#ccc",
      inactiveBorderColor: "#ccc",
      inactiveBorderWidth: "auto",
      itemStyle: {
        color: "inherit",
        opacity: "inherit",
        borderColor: "inherit",
        borderWidth: "auto",
        borderCap: "inherit",
        borderJoin: "inherit",
        borderDashOffset: "inherit",
        borderMiterLimit: "inherit"
      },
      lineStyle: {
        width: "auto",
        color: "inherit",
        inactiveColor: "#ccc",
        inactiveWidth: 2,
        opacity: "inherit",
        type: "inherit",
        cap: "inherit",
        join: "inherit",
        dashOffset: "inherit",
        miterLimit: "inherit"
      },
      textStyle: {
        color: "#333"
      },
      selectedMode: !0,
      selector: !1,
      selectorLabel: {
        show: !0,
        borderRadius: 10,
        padding: [3, 5, 3, 5],
        fontSize: 12,
        fontFamily: "sans-serif",
        color: "#666",
        borderWidth: 1,
        borderColor: "#666"
      },
      emphasis: {
        selectorLabel: {
          show: !0,
          color: "#eee",
          backgroundColor: "#666"
        }
      },
      selectorPosition: "auto",
      selectorItemGap: 7,
      selectorButtonGap: 10,
      tooltip: {
        show: !1
      }
    }, t;
  }(dt)
), Gi = et, gc = T, Go = St, Xb = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e.newlineDisabled = !1, e;
    }
    return t.prototype.init = function() {
      this.group.add(this._contentGroup = new Go()), this.group.add(this._selectorGroup = new Go()), this._isFirstRender = !0;
    }, t.prototype.getContentGroup = function() {
      return this._contentGroup;
    }, t.prototype.getSelectorGroup = function() {
      return this._selectorGroup;
    }, t.prototype.render = function(e, i, n) {
      var a = this._isFirstRender;
      if (this._isFirstRender = !1, this.resetInner(), !!e.get("show", !0)) {
        var o = e.get("align"), s = e.get("orient");
        (!o || o === "auto") && (o = e.get("left") === "right" && s === "vertical" ? "right" : "left");
        var l = e.get("selector", !0), u = e.get("selectorPosition", !0);
        l && (!u || u === "auto") && (u = s === "horizontal" ? "end" : "start"), this.renderInner(o, e, i, n, l, s, u);
        var h = e.getBoxLayoutParams(), c = {
          width: n.getWidth(),
          height: n.getHeight()
        }, f = e.get("padding"), d = cn(h, c, f), v = this.layoutInner(e, o, d, a, l, u), g = cn(ht({
          width: v.width,
          height: v.height
        }, h), c, f);
        this.group.x = g.x - v.x, this.group.y = g.y - v.y, this.group.markRedraw(), this.group.add(this._backgroundEl = vL(v, e));
      }
    }, t.prototype.resetInner = function() {
      this.getContentGroup().removeAll(), this._backgroundEl && this.group.remove(this._backgroundEl), this.getSelectorGroup().removeAll();
    }, t.prototype.renderInner = function(e, i, n, a, o, s, l) {
      var u = this.getContentGroup(), h = tt(), c = i.get("selectedMode"), f = [];
      n.eachRawSeries(function(d) {
        !d.get("legendHoverLink") && f.push(d.id);
      }), gc(i.getData(), function(d, v) {
        var g = d.get("name");
        if (!this.newlineDisabled && (g === "" || g === `
`)) {
          var p = new Go();
          p.newline = !0, u.add(p);
          return;
        }
        var y = n.getSeriesByName(g)[0];
        if (!h.get(g))
          if (y) {
            var m = y.getData(), _ = m.getVisual("legendLineStyle") || {}, b = m.getVisual("legendIcon"), w = m.getVisual("style"), x = this._createItem(y, g, v, d, i, e, _, w, b, c, a);
            x.on("click", Gi(Dy, g, null, a, f)).on("mouseover", Gi(yc, y.name, null, a, f)).on("mouseout", Gi(mc, y.name, null, a, f)), n.ssr && x.eachChild(function(S) {
              var A = lt(S);
              A.seriesIndex = y.seriesIndex, A.dataIndex = v, A.ssrType = "legend";
            }), h.set(g, !0);
          } else
            n.eachRawSeries(function(S) {
              if (!h.get(g) && S.legendVisualProvider) {
                var A = S.legendVisualProvider;
                if (!A.containName(g))
                  return;
                var M = A.indexOfName(g), D = A.getItemVisual(M, "style"), C = A.getItemVisual(M, "legendIcon"), I = ye(D.fill);
                I && I[3] === 0 && (I[3] = 0.2, D = $($({}, D), {
                  fill: er(I, "rgba")
                }));
                var L = this._createItem(S, g, v, d, i, e, {}, D, C, c, a);
                L.on("click", Gi(Dy, null, g, a, f)).on("mouseover", Gi(yc, null, g, a, f)).on("mouseout", Gi(mc, null, g, a, f)), n.ssr && L.eachChild(function(P) {
                  var E = lt(P);
                  E.seriesIndex = S.seriesIndex, E.dataIndex = v, E.ssrType = "legend";
                }), h.set(g, !0);
              }
            }, this);
      }, this), o && this._createSelector(o, i, a, s, l);
    }, t.prototype._createSelector = function(e, i, n, a, o) {
      var s = this.getSelectorGroup();
      gc(e, function(u) {
        var h = u.type, c = new Ht({
          style: {
            x: 0,
            y: 0,
            align: "center",
            verticalAlign: "middle"
          },
          onclick: function() {
            n.dispatchAction({
              type: h === "all" ? "legendAllSelect" : "legendInverseSelect",
              legendId: i.id
            });
          }
        });
        s.add(c);
        var f = i.getModel("selectorLabel"), d = i.getModel(["emphasis", "selectorLabel"]);
        xn(c, {
          normal: f,
          emphasis: d
        }, {
          defaultText: u.title
        }), Mh(c);
      });
    }, t.prototype._createItem = function(e, i, n, a, o, s, l, u, h, c, f) {
      var d = e.visualDrawType, v = o.get("itemWidth"), g = o.get("itemHeight"), p = o.isSelected(i), y = a.get("symbolRotate"), m = a.get("symbolKeepAspect"), _ = a.get("icon");
      h = _ || h || "roundRect";
      var b = vP(h, a, l, u, d, p, f), w = new Go(), x = a.getModel("textStyle");
      if (Q(e.getLegendIcon) && (!_ || _ === "inherit"))
        w.add(e.getLegendIcon({
          itemWidth: v,
          itemHeight: g,
          icon: h,
          iconRotate: y,
          itemStyle: b.itemStyle,
          lineStyle: b.lineStyle,
          symbolKeepAspect: m
        }));
      else {
        var S = _ === "inherit" && e.getData().getVisual("symbol") ? y === "inherit" ? e.getData().getVisual("symbolRotate") : y : 0;
        w.add(pP({
          itemWidth: v,
          itemHeight: g,
          icon: h,
          iconRotate: S,
          itemStyle: b.itemStyle,
          symbolKeepAspect: m
        }));
      }
      var A = s === "left" ? v + 5 : -5, M = s, D = o.get("formatter"), C = i;
      V(D) && D ? C = D.replace("{name}", i ?? "") : Q(D) && (C = D(i));
      var I = p ? x.getTextColor() : a.get("inactiveColor");
      w.add(new Ht({
        style: Mr(x, {
          text: C,
          x: A,
          y: g / 2,
          fill: I,
          align: M,
          verticalAlign: "middle"
        }, {
          inheritColor: I
        })
      }));
      var L = new Mt({
        shape: w.getBoundingRect(),
        style: {
          // Cannot use 'invisible' because SVG SSR will miss the node
          fill: "transparent"
        }
      }), P = a.getModel("tooltip");
      return P.get("show") && nl({
        el: L,
        componentModel: o,
        itemName: i,
        itemTooltipOption: P.option
      }), w.add(L), w.eachChild(function(E) {
        E.silent = !0;
      }), L.silent = !c, this.getContentGroup().add(w), Mh(w), w.__legendDataIndex = n, w;
    }, t.prototype.layoutInner = function(e, i, n, a, o, s) {
      var l = this.getContentGroup(), u = this.getSelectorGroup();
      _a(e.get("orient"), l, e.get("itemGap"), n.width, n.height);
      var h = l.getBoundingRect(), c = [-h.x, -h.y];
      if (u.markRedraw(), l.markRedraw(), o) {
        _a(
          // Buttons in selectorGroup always layout horizontally
          "horizontal",
          u,
          e.get("selectorItemGap", !0)
        );
        var f = u.getBoundingRect(), d = [-f.x, -f.y], v = e.get("selectorButtonGap", !0), g = e.getOrient().index, p = g === 0 ? "width" : "height", y = g === 0 ? "height" : "width", m = g === 0 ? "y" : "x";
        s === "end" ? d[g] += h[p] + v : c[g] += f[p] + v, d[1 - g] += h[y] / 2 - f[y] / 2, u.x = d[0], u.y = d[1], l.x = c[0], l.y = c[1];
        var _ = {
          x: 0,
          y: 0
        };
        return _[p] = h[p] + v + f[p], _[y] = Math.max(h[y], f[y]), _[m] = Math.min(0, f[m] + d[1 - g]), _;
      } else
        return l.x = c[0], l.y = c[1], this.group.getBoundingRect();
    }, t.prototype.remove = function() {
      this.getContentGroup().removeAll(), this._isFirstRender = !0;
    }, t.type = "legend.plain", t;
  }(ne)
);
function vP(r, t, e, i, n, a, o) {
  function s(p, y) {
    p.lineWidth === "auto" && (p.lineWidth = y.lineWidth > 0 ? 2 : 0), gc(p, function(m, _) {
      p[_] === "inherit" && (p[_] = y[_]);
    });
  }
  var l = t.getModel("itemStyle"), u = l.getItemStyle(), h = r.lastIndexOf("empty", 0) === 0 ? "fill" : "stroke", c = l.getShallow("decal");
  u.decal = !c || c === "inherit" ? i.decal : Wh(c, o), u.fill === "inherit" && (u.fill = i[n]), u.stroke === "inherit" && (u.stroke = i[h]), u.opacity === "inherit" && (u.opacity = (n === "fill" ? i : e).opacity), s(u, i);
  var f = t.getModel("lineStyle"), d = f.getLineStyle();
  if (s(d, e), u.fill === "auto" && (u.fill = i.fill), u.stroke === "auto" && (u.stroke = i.fill), d.stroke === "auto" && (d.stroke = i.fill), !a) {
    var v = t.get("inactiveBorderWidth"), g = u[h];
    u.lineWidth = v === "auto" ? i.lineWidth > 0 && g ? 2 : 0 : u.lineWidth, u.fill = t.get("inactiveColor"), u.stroke = t.get("inactiveBorderColor"), d.stroke = f.get("inactiveColor"), d.lineWidth = f.get("inactiveWidth");
  }
  return {
    itemStyle: u,
    lineStyle: d
  };
}
function pP(r) {
  var t = r.icon || "roundRect", e = vn(t, 0, 0, r.itemWidth, r.itemHeight, r.itemStyle.fill, r.symbolKeepAspect);
  return e.setStyle(r.itemStyle), e.rotation = (r.iconRotate || 0) * Math.PI / 180, e.setOrigin([r.itemWidth / 2, r.itemHeight / 2]), t.indexOf("empty") > -1 && (e.style.stroke = e.style.fill, e.style.fill = "#fff", e.style.lineWidth = 2), e;
}
function Dy(r, t, e, i) {
  mc(r, t, e, i), e.dispatchAction({
    type: "legendToggleSelect",
    name: r ?? t
  }), yc(r, t, e, i);
}
function Zb(r) {
  for (var t = r.getZr().storage.getDisplayList(), e, i = 0, n = t.length; i < n && !(e = t[i].states.emphasis); )
    i++;
  return e && e.hoverLayer;
}
function yc(r, t, e, i) {
  Zb(e) || e.dispatchAction({
    type: "highlight",
    seriesName: r,
    name: t,
    excludeSeriesId: i
  });
}
function mc(r, t, e, i) {
  Zb(e) || e.dispatchAction({
    type: "downplay",
    seriesName: r,
    name: t,
    excludeSeriesId: i
  });
}
function gP(r) {
  var t = r.findComponents({
    mainType: "legend"
  });
  t && t.length && r.filterSeries(function(e) {
    for (var i = 0; i < t.length; i++)
      if (!t[i].isSelected(e.name))
        return !1;
    return !0;
  });
}
function Kn(r, t, e) {
  var i = r === "allSelect" || r === "inverseSelect", n = {}, a = [];
  e.eachComponent({
    mainType: "legend",
    query: t
  }, function(s) {
    i ? s[r]() : s[r](t.name), ky(s, n), a.push(s.componentIndex);
  });
  var o = {};
  return e.eachComponent("legend", function(s) {
    T(n, function(l, u) {
      s[l ? "select" : "unSelect"](u);
    }), ky(s, o);
  }), i ? {
    selected: o,
    // return legendIndex array to tell the developers which legends are allSelect / inverseSelect
    legendIndex: a
  } : {
    name: t.name,
    selected: o
  };
}
function ky(r, t) {
  var e = t || {};
  return T(r.getData(), function(i) {
    var n = i.get("name");
    if (!(n === `
` || n === "")) {
      var a = r.isSelected(n);
      yi(e, n) ? e[n] = e[n] && a : e[n] = a;
    }
  }), e;
}
function yP(r) {
  r.registerAction("legendToggleSelect", "legendselectchanged", et(Kn, "toggleSelected")), r.registerAction("legendAllSelect", "legendselectall", et(Kn, "allSelect")), r.registerAction("legendInverseSelect", "legendinverseselect", et(Kn, "inverseSelect")), r.registerAction("legendSelect", "legendselected", et(Kn, "select")), r.registerAction("legendUnSelect", "legendunselected", et(Kn, "unSelect"));
}
function qb(r) {
  r.registerComponentModel(pc), r.registerComponentView(Xb), r.registerProcessor(r.PRIORITY.PROCESSOR.SERIES_FILTER, gP), r.registerSubTypeDefaulter("legend", function() {
    return "plain";
  }), yP(r);
}
var mP = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e;
    }
    return t.prototype.setScrollDataIndex = function(e) {
      this.option.scrollDataIndex = e;
    }, t.prototype.init = function(e, i, n) {
      var a = vl(e);
      r.prototype.init.call(this, e, i, n), Iy(this, e, a);
    }, t.prototype.mergeOption = function(e, i) {
      r.prototype.mergeOption.call(this, e, i), Iy(this, this.option, e);
    }, t.type = "legend.scroll", t.defaultOption = a0(pc.defaultOption, {
      scrollDataIndex: 0,
      pageButtonItemGap: 5,
      pageButtonGap: null,
      pageButtonPosition: "end",
      pageFormatter: "{current}/{total}",
      pageIcons: {
        horizontal: ["M0,0L12,-10L12,10z", "M0,0L-12,-10L-12,10z"],
        vertical: ["M0,0L20,0L10,-20z", "M0,0L20,0L10,20z"]
      },
      pageIconColor: "#2f4554",
      pageIconInactiveColor: "#aaa",
      pageIconSize: 15,
      pageTextStyle: {
        color: "#333"
      },
      animationDurationUpdate: 800
    }), t;
  }(pc)
);
function Iy(r, t, e) {
  var i = r.getOrient(), n = [1, 1];
  n[i.index] = 0, fn(t, e, {
    type: "box",
    ignoreSize: !!n
  });
}
var Ly = St, Ku = ["width", "height"], ju = ["x", "y"], _P = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = t.type, e.newlineDisabled = !0, e._currentIndex = 0, e;
    }
    return t.prototype.init = function() {
      r.prototype.init.call(this), this.group.add(this._containerGroup = new Ly()), this._containerGroup.add(this.getContentGroup()), this.group.add(this._controllerGroup = new Ly());
    }, t.prototype.resetInner = function() {
      r.prototype.resetInner.call(this), this._controllerGroup.removeAll(), this._containerGroup.removeClipPath(), this._containerGroup.__rectSize = null;
    }, t.prototype.renderInner = function(e, i, n, a, o, s, l) {
      var u = this;
      r.prototype.renderInner.call(this, e, i, n, a, o, s, l);
      var h = this._controllerGroup, c = i.get("pageIconSize", !0), f = B(c) ? c : [c, c];
      v("pagePrev", 0);
      var d = i.getModel("pageTextStyle");
      h.add(new Ht({
        name: "pageText",
        style: {
          // Placeholder to calculate a proper layout.
          text: "xx/xx",
          fill: d.getTextColor(),
          font: d.getFont(),
          verticalAlign: "middle",
          align: "center"
        },
        silent: !0
      })), v("pageNext", 1);
      function v(g, p) {
        var y = g + "DataIndex", m = sf(i.get("pageIcons", !0)[i.getOrient().name][p], {
          // Buttons will be created in each render, so we do not need
          // to worry about avoiding using legendModel kept in scope.
          onclick: at(u._pageGo, u, y, i, a)
        }, {
          x: -f[0] / 2,
          y: -f[1] / 2,
          width: f[0],
          height: f[1]
        });
        m.name = g, h.add(m);
      }
    }, t.prototype.layoutInner = function(e, i, n, a, o, s) {
      var l = this.getSelectorGroup(), u = e.getOrient().index, h = Ku[u], c = ju[u], f = Ku[1 - u], d = ju[1 - u];
      o && _a(
        // Buttons in selectorGroup always layout horizontally
        "horizontal",
        l,
        e.get("selectorItemGap", !0)
      );
      var v = e.get("selectorButtonGap", !0), g = l.getBoundingRect(), p = [-g.x, -g.y], y = K(n);
      o && (y[h] = n[h] - g[h] - v);
      var m = this._layoutContentAndController(e, a, y, u, h, f, d, c);
      if (o) {
        if (s === "end")
          p[u] += m[h] + v;
        else {
          var _ = g[h] + v;
          p[u] -= _, m[c] -= _;
        }
        m[h] += g[h] + v, p[1 - u] += m[d] + m[f] / 2 - g[f] / 2, m[f] = Math.max(m[f], g[f]), m[d] = Math.min(m[d], g[d] + p[1 - u]), l.x = p[0], l.y = p[1], l.markRedraw();
      }
      return m;
    }, t.prototype._layoutContentAndController = function(e, i, n, a, o, s, l, u) {
      var h = this.getContentGroup(), c = this._containerGroup, f = this._controllerGroup;
      _a(e.get("orient"), h, e.get("itemGap"), a ? n.width : null, a ? null : n.height), _a(
        // Buttons in controller are layout always horizontally.
        "horizontal",
        f,
        e.get("pageButtonItemGap", !0)
      );
      var d = h.getBoundingRect(), v = f.getBoundingRect(), g = this._showController = d[o] > n[o], p = [-d.x, -d.y];
      i || (p[a] = h[u]);
      var y = [0, 0], m = [-v.x, -v.y], _ = st(e.get("pageButtonGap", !0), e.get("itemGap", !0));
      if (g) {
        var b = e.get("pageButtonPosition", !0);
        b === "end" ? m[a] += n[o] - v[o] : y[a] += v[o] + _;
      }
      m[1 - a] += d[s] / 2 - v[s] / 2, h.setPosition(p), c.setPosition(y), f.setPosition(m);
      var w = {
        x: 0,
        y: 0
      };
      if (w[o] = g ? n[o] : d[o], w[s] = Math.max(d[s], v[s]), w[l] = Math.min(0, v[l] + m[1 - a]), c.__rectSize = n[o], g) {
        var x = {
          x: 0,
          y: 0
        };
        x[o] = Math.max(n[o] - v[o] - _, 0), x[s] = w[s], c.setClipPath(new Mt({
          shape: x
        })), c.__rectSize = x[o];
      } else
        f.eachChild(function(A) {
          A.attr({
            invisible: !0,
            silent: !0
          });
        });
      var S = this._getPageInfo(e);
      return S.pageIndex != null && jt(
        h,
        {
          x: S.contentPosition[0],
          y: S.contentPosition[1]
        },
        // When switch from "show controller" to "not show controller", view should be
        // updated immediately without animation, otherwise causes weird effect.
        g ? e : null
      ), this._updatePageInfoView(e, S), w;
    }, t.prototype._pageGo = function(e, i, n) {
      var a = this._getPageInfo(i)[e];
      a != null && n.dispatchAction({
        type: "legendScroll",
        scrollDataIndex: a,
        legendId: i.id
      });
    }, t.prototype._updatePageInfoView = function(e, i) {
      var n = this._controllerGroup;
      T(["pagePrev", "pageNext"], function(h) {
        var c = h + "DataIndex", f = i[c] != null, d = n.childOfName(h);
        d && (d.setStyle("fill", f ? e.get("pageIconColor", !0) : e.get("pageIconInactiveColor", !0)), d.cursor = f ? "pointer" : "default");
      });
      var a = n.childOfName("pageText"), o = e.get("pageFormatter"), s = i.pageIndex, l = s != null ? s + 1 : 0, u = i.pageCount;
      a && o && a.setStyle("text", V(o) ? o.replace("{current}", l == null ? "" : l + "").replace("{total}", u == null ? "" : u + "") : o({
        current: l,
        total: u
      }));
    }, t.prototype._getPageInfo = function(e) {
      var i = e.get("scrollDataIndex", !0), n = this.getContentGroup(), a = this._containerGroup.__rectSize, o = e.getOrient().index, s = Ku[o], l = ju[o], u = this._findTargetItemIndex(i), h = n.children(), c = h[u], f = h.length, d = f ? 1 : 0, v = {
        contentPosition: [n.x, n.y],
        pageCount: d,
        pageIndex: d - 1,
        pagePrevDataIndex: null,
        pageNextDataIndex: null
      };
      if (!c)
        return v;
      var g = b(c);
      v.contentPosition[o] = -g.s;
      for (var p = u + 1, y = g, m = g, _ = null; p <= f; ++p)
        _ = b(h[p]), // Half of the last item is out of the window.
        (!_ && m.e > y.s + a || _ && !w(_, y.s)) && (m.i > y.i ? y = m : y = _, y && (v.pageNextDataIndex == null && (v.pageNextDataIndex = y.i), ++v.pageCount)), m = _;
      for (var p = u - 1, y = g, m = g, _ = null; p >= -1; --p)
        _ = b(h[p]), // If the the end item does not intersect with the window started
        // from the current item, a page can be settled.
        (!_ || !w(m, _.s)) && y.i < m.i && (m = y, v.pagePrevDataIndex == null && (v.pagePrevDataIndex = y.i), ++v.pageCount, ++v.pageIndex), y = _;
      return v;
      function b(x) {
        if (x) {
          var S = x.getBoundingRect(), A = S[l] + x[l];
          return {
            s: A,
            e: A + S[s],
            i: x.__legendDataIndex
          };
        }
      }
      function w(x, S) {
        return x.e >= S && x.s <= S + a;
      }
    }, t.prototype._findTargetItemIndex = function(e) {
      if (!this._showController)
        return 0;
      var i, n = this.getContentGroup(), a;
      return n.eachChild(function(o, s) {
        var l = o.__legendDataIndex;
        a == null && l != null && (a = s), l === e && (i = s);
      }), i ?? a;
    }, t.type = "legend.scroll", t;
  }(Xb)
);
function bP(r) {
  r.registerAction("legendScroll", "legendscroll", function(t, e) {
    var i = t.scrollDataIndex;
    i != null && e.eachComponent({
      mainType: "legend",
      subType: "scroll",
      query: t
    }, function(n) {
      n.setScrollDataIndex(i);
    });
  });
}
function xP(r) {
  kr(qb), r.registerComponentModel(mP), r.registerComponentView(_P), bP(r);
}
function wP(r) {
  kr(qb), kr(xP);
}
var SP = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = "dataset", e;
    }
    return t.prototype.init = function(e, i, n) {
      r.prototype.init.call(this, e, i, n), this._sourceManager = new z0(this), ap(this);
    }, t.prototype.mergeOption = function(e, i) {
      r.prototype.mergeOption.call(this, e, i), ap(this);
    }, t.prototype.optionUpdated = function() {
      this._sourceManager.dirty();
    }, t.prototype.getSourceManager = function() {
      return this._sourceManager;
    }, t.type = "dataset", t.defaultOption = {
      seriesLayoutBy: Ve
    }, t;
  }(dt)
), TP = (
  /** @class */
  function(r) {
    N(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.type = "dataset", e;
    }
    return t.type = "dataset", t;
  }(ne)
);
function CP(r) {
  r.registerComponentModel(SP), r.registerComponentView(TP);
}
function Py(r, t, e) {
  var i = gn.createCanvas(), n = t.getWidth(), a = t.getHeight(), o = i.style;
  return o && (o.position = "absolute", o.left = "0", o.top = "0", o.width = n + "px", o.height = a + "px", i.setAttribute("data-zr-dom-id", r)), i.width = n * e, i.height = a * e, i;
}
var Qu = function(r) {
  N(t, r);
  function t(e, i, n) {
    var a = r.call(this) || this;
    a.motionBlur = !1, a.lastFrameAlpha = 0.7, a.dpr = 1, a.virtual = !1, a.config = {}, a.incremental = !1, a.zlevel = 0, a.maxRepaintRectCount = 5, a.__dirty = !0, a.__firstTimePaint = !0, a.__used = !1, a.__drawIndex = 0, a.__startIndex = 0, a.__endIndex = 0, a.__prevStartIndex = null, a.__prevEndIndex = null;
    var o;
    n = n || ms, typeof e == "string" ? o = Py(e, i, n) : U(e) && (o = e, e = o.id), a.id = e, a.dom = o;
    var s = o.style;
    return s && (Ky(o), o.onselectstart = function() {
      return !1;
    }, s.padding = "0", s.margin = "0", s.borderWidth = "0"), a.painter = i, a.dpr = n, a;
  }
  return t.prototype.getElementCount = function() {
    return this.__endIndex - this.__startIndex;
  }, t.prototype.afterBrush = function() {
    this.__prevStartIndex = this.__startIndex, this.__prevEndIndex = this.__endIndex;
  }, t.prototype.initContext = function() {
    this.ctx = this.dom.getContext("2d"), this.ctx.dpr = this.dpr;
  }, t.prototype.setUnpainted = function() {
    this.__firstTimePaint = !0;
  }, t.prototype.createBackBuffer = function() {
    var e = this.dpr;
    this.domBack = Py("back-" + this.id, this.painter, e), this.ctxBack = this.domBack.getContext("2d"), e !== 1 && this.ctxBack.scale(e, e);
  }, t.prototype.createRepaintRects = function(e, i, n, a) {
    if (this.__firstTimePaint)
      return this.__firstTimePaint = !1, null;
    var o = [], s = this.maxRepaintRectCount, l = !1, u = new ot(0, 0, 0, 0);
    function h(m) {
      if (!(!m.isFinite() || m.isZero()))
        if (o.length === 0) {
          var _ = new ot(0, 0, 0, 0);
          _.copy(m), o.push(_);
        } else {
          for (var b = !1, w = 1 / 0, x = 0, S = 0; S < o.length; ++S) {
            var A = o[S];
            if (A.intersect(m)) {
              var M = new ot(0, 0, 0, 0);
              M.copy(A), M.union(m), o[S] = M, b = !0;
              break;
            } else if (l) {
              u.copy(m), u.union(A);
              var D = m.width * m.height, C = A.width * A.height, I = u.width * u.height, L = I - D - C;
              L < w && (w = L, x = S);
            }
          }
          if (l && (o[x].union(m), b = !0), !b) {
            var _ = new ot(0, 0, 0, 0);
            _.copy(m), o.push(_);
          }
          l || (l = o.length >= s);
        }
    }
    for (var c = this.__startIndex; c < this.__endIndex; ++c) {
      var f = e[c];
      if (f) {
        var d = f.shouldBePainted(n, a, !0, !0), v = f.__isRendered && (f.__dirty & ee || !d) ? f.getPrevPaintRect() : null;
        v && h(v);
        var g = d && (f.__dirty & ee || !f.__isRendered) ? f.getPaintRect() : null;
        g && h(g);
      }
    }
    for (var c = this.__prevStartIndex; c < this.__prevEndIndex; ++c) {
      var f = i[c], d = f && f.shouldBePainted(n, a, !0, !0);
      if (f && (!d || !f.__zr) && f.__isRendered) {
        var v = f.getPrevPaintRect();
        v && h(v);
      }
    }
    var p;
    do {
      p = !1;
      for (var c = 0; c < o.length; ) {
        if (o[c].isZero()) {
          o.splice(c, 1);
          continue;
        }
        for (var y = c + 1; y < o.length; )
          o[c].intersect(o[y]) ? (p = !0, o[c].union(o[y]), o.splice(y, 1)) : y++;
        c++;
      }
    } while (p);
    return this._paintRects = o, o;
  }, t.prototype.debugGetPaintRects = function() {
    return (this._paintRects || []).slice();
  }, t.prototype.resize = function(e, i) {
    var n = this.dpr, a = this.dom, o = a.style, s = this.domBack;
    o && (o.width = e + "px", o.height = i + "px"), a.width = e * n, a.height = i * n, s && (s.width = e * n, s.height = i * n, n !== 1 && this.ctxBack.scale(n, n));
  }, t.prototype.clear = function(e, i, n) {
    var a = this.dom, o = this.ctx, s = a.width, l = a.height;
    i = i || this.clearColor;
    var u = this.motionBlur && !e, h = this.lastFrameAlpha, c = this.dpr, f = this;
    u && (this.domBack || this.createBackBuffer(), this.ctxBack.globalCompositeOperation = "copy", this.ctxBack.drawImage(a, 0, 0, s / c, l / c));
    var d = this.domBack;
    function v(g, p, y, m) {
      if (o.clearRect(g, p, y, m), i && i !== "transparent") {
        var _ = void 0;
        if (Us(i)) {
          var b = i.global || i.__width === y && i.__height === m;
          _ = b && i.__canvasGradient || Vh(o, i, {
            x: 0,
            y: 0,
            width: y,
            height: m
          }), i.__canvasGradient = _, i.__width = y, i.__height = m;
        } else $1(i) && (i.scaleX = i.scaleX || c, i.scaleY = i.scaleY || c, _ = Gh(o, i, {
          dirty: function() {
            f.setUnpainted(), f.painter.refresh();
          }
        }));
        o.save(), o.fillStyle = _ || i, o.fillRect(g, p, y, m), o.restore();
      }
      u && (o.save(), o.globalAlpha = h, o.drawImage(d, g, p, y, m), o.restore());
    }
    !n || u ? v(0, 0, s, l) : n.length && T(n, function(g) {
      v(g.x * c, g.y * c, g.width * c, g.height * c);
    });
  }, t;
}(be), Ey = 1e5, Jr = 314159, Wo = 0.01, AP = 1e-3;
function MP(r) {
  return r ? r.__builtin__ ? !0 : !(typeof r.resize != "function" || typeof r.refresh != "function") : !1;
}
function DP(r, t) {
  var e = document.createElement("div");
  return e.style.cssText = [
    "position:relative",
    "width:" + r + "px",
    "height:" + t + "px",
    "padding:0",
    "margin:0",
    "border-width:0"
  ].join(";") + ";", e;
}
var kP = function() {
  function r(t, e, i, n) {
    this.type = "canvas", this._zlevelList = [], this._prevDisplayList = [], this._layers = {}, this._layerConfig = {}, this._needsManuallyCompositing = !1, this.type = "canvas";
    var a = !t.nodeName || t.nodeName.toUpperCase() === "CANVAS";
    this._opts = i = $({}, i || {}), this.dpr = i.devicePixelRatio || ms, this._singleCanvas = a, this.root = t;
    var o = t.style;
    o && (Ky(t), t.innerHTML = ""), this.storage = e;
    var s = this._zlevelList;
    this._prevDisplayList = [];
    var l = this._layers;
    if (a) {
      var h = t, c = h.width, f = h.height;
      i.width != null && (c = i.width), i.height != null && (f = i.height), this.dpr = i.devicePixelRatio || 1, h.width = c * this.dpr, h.height = f * this.dpr, this._width = c, this._height = f;
      var d = new Qu(h, this, this.dpr);
      d.__builtin__ = !0, d.initContext(), l[Jr] = d, d.zlevel = Jr, s.push(Jr), this._domRoot = t;
    } else {
      this._width = Ao(t, 0, i), this._height = Ao(t, 1, i);
      var u = this._domRoot = DP(this._width, this._height);
      t.appendChild(u);
    }
  }
  return r.prototype.getType = function() {
    return "canvas";
  }, r.prototype.isSingleCanvas = function() {
    return this._singleCanvas;
  }, r.prototype.getViewportRoot = function() {
    return this._domRoot;
  }, r.prototype.getViewportRootOffset = function() {
    var t = this.getViewportRoot();
    if (t)
      return {
        offsetLeft: t.offsetLeft || 0,
        offsetTop: t.offsetTop || 0
      };
  }, r.prototype.refresh = function(t) {
    var e = this.storage.getDisplayList(!0), i = this._prevDisplayList, n = this._zlevelList;
    this._redrawId = Math.random(), this._paintList(e, i, t, this._redrawId);
    for (var a = 0; a < n.length; a++) {
      var o = n[a], s = this._layers[o];
      if (!s.__builtin__ && s.refresh) {
        var l = a === 0 ? this._backgroundColor : null;
        s.refresh(l);
      }
    }
    return this._opts.useDirtyRect && (this._prevDisplayList = e.slice()), this;
  }, r.prototype.refreshHover = function() {
    this._paintHoverList(this.storage.getDisplayList(!1));
  }, r.prototype._paintHoverList = function(t) {
    var e = t.length, i = this._hoverlayer;
    if (i && i.clear(), !!e) {
      for (var n = {
        inHover: !0,
        viewWidth: this._width,
        viewHeight: this._height
      }, a, o = 0; o < e; o++) {
        var s = t[o];
        s.__inHover && (i || (i = this._hoverlayer = this.getLayer(Ey)), a || (a = i.ctx, a.save()), oi(a, s, n, o === e - 1));
      }
      a && a.restore();
    }
  }, r.prototype.getHoverLayer = function() {
    return this.getLayer(Ey);
  }, r.prototype.paintOne = function(t, e) {
    o_(t, e);
  }, r.prototype._paintList = function(t, e, i, n) {
    if (this._redrawId === n) {
      i = i || !1, this._updateLayerStatus(t);
      var a = this._doPaintList(t, e, i), o = a.finished, s = a.needsRefreshHover;
      if (this._needsManuallyCompositing && this._compositeManually(), s && this._paintHoverList(t), o)
        this.eachLayer(function(u) {
          u.afterBrush && u.afterBrush();
        });
      else {
        var l = this;
        cs(function() {
          l._paintList(t, e, i, n);
        });
      }
    }
  }, r.prototype._compositeManually = function() {
    var t = this.getLayer(Jr).ctx, e = this._domRoot.width, i = this._domRoot.height;
    t.clearRect(0, 0, e, i), this.eachBuiltinLayer(function(n) {
      n.virtual && t.drawImage(n.dom, 0, 0, e, i);
    });
  }, r.prototype._doPaintList = function(t, e, i) {
    for (var n = this, a = [], o = this._opts.useDirtyRect, s = 0; s < this._zlevelList.length; s++) {
      var l = this._zlevelList[s], u = this._layers[l];
      u.__builtin__ && u !== this._hoverlayer && (u.__dirty || i) && a.push(u);
    }
    for (var h = !0, c = !1, f = function(g) {
      var p = a[g], y = p.ctx, m = o && p.createRepaintRects(t, e, d._width, d._height), _ = i ? p.__startIndex : p.__drawIndex, b = !i && p.incremental && Date.now, w = b && Date.now(), x = p.zlevel === d._zlevelList[0] ? d._backgroundColor : null;
      if (p.__startIndex === p.__endIndex)
        p.clear(!1, x, m);
      else if (_ === p.__startIndex) {
        var S = t[_];
        (!S.incremental || !S.notClear || i) && p.clear(!1, x, m);
      }
      _ === -1 && (console.error("For some unknown reason. drawIndex is -1"), _ = p.__startIndex);
      var A, M = function(L) {
        var P = {
          inHover: !1,
          allClipped: !1,
          prevEl: null,
          viewWidth: n._width,
          viewHeight: n._height
        };
        for (A = _; A < p.__endIndex; A++) {
          var E = t[A];
          if (E.__inHover && (c = !0), n._doPaintEl(E, p, o, L, P, A === p.__endIndex - 1), b) {
            var R = Date.now() - w;
            if (R > 15)
              break;
          }
        }
        P.prevElClipPaths && y.restore();
      };
      if (m)
        if (m.length === 0)
          A = p.__endIndex;
        else
          for (var D = d.dpr, C = 0; C < m.length; ++C) {
            var I = m[C];
            y.save(), y.beginPath(), y.rect(I.x * D, I.y * D, I.width * D, I.height * D), y.clip(), M(I), y.restore();
          }
      else
        y.save(), M(), y.restore();
      p.__drawIndex = A, p.__drawIndex < p.__endIndex && (h = !1);
    }, d = this, v = 0; v < a.length; v++)
      f(v);
    return j.wxa && T(this._layers, function(g) {
      g && g.ctx && g.ctx.draw && g.ctx.draw();
    }), {
      finished: h,
      needsRefreshHover: c
    };
  }, r.prototype._doPaintEl = function(t, e, i, n, a, o) {
    var s = e.ctx;
    if (i) {
      var l = t.getPaintRect();
      (!n || l && l.intersect(n)) && (oi(s, t, a, o), t.setPrevPaintRect(l));
    } else
      oi(s, t, a, o);
  }, r.prototype.getLayer = function(t, e) {
    this._singleCanvas && !this._needsManuallyCompositing && (t = Jr);
    var i = this._layers[t];
    return i || (i = new Qu("zr_" + t, this, this.dpr), i.zlevel = t, i.__builtin__ = !0, this._layerConfig[t] ? ut(i, this._layerConfig[t], !0) : this._layerConfig[t - Wo] && ut(i, this._layerConfig[t - Wo], !0), e && (i.virtual = e), this.insertLayer(t, i), i.initContext()), i;
  }, r.prototype.insertLayer = function(t, e) {
    var i = this._layers, n = this._zlevelList, a = n.length, o = this._domRoot, s = null, l = -1;
    if (!i[t] && MP(e)) {
      if (a > 0 && t > n[0]) {
        for (l = 0; l < a - 1 && !(n[l] < t && n[l + 1] > t); l++)
          ;
        s = i[n[l]];
      }
      if (n.splice(l + 1, 0, t), i[t] = e, !e.virtual)
        if (s) {
          var u = s.dom;
          u.nextSibling ? o.insertBefore(e.dom, u.nextSibling) : o.appendChild(e.dom);
        } else
          o.firstChild ? o.insertBefore(e.dom, o.firstChild) : o.appendChild(e.dom);
      e.painter || (e.painter = this);
    }
  }, r.prototype.eachLayer = function(t, e) {
    for (var i = this._zlevelList, n = 0; n < i.length; n++) {
      var a = i[n];
      t.call(e, this._layers[a], a);
    }
  }, r.prototype.eachBuiltinLayer = function(t, e) {
    for (var i = this._zlevelList, n = 0; n < i.length; n++) {
      var a = i[n], o = this._layers[a];
      o.__builtin__ && t.call(e, o, a);
    }
  }, r.prototype.eachOtherLayer = function(t, e) {
    for (var i = this._zlevelList, n = 0; n < i.length; n++) {
      var a = i[n], o = this._layers[a];
      o.__builtin__ || t.call(e, o, a);
    }
  }, r.prototype.getLayers = function() {
    return this._layers;
  }, r.prototype._updateLayerStatus = function(t) {
    this.eachBuiltinLayer(function(c, f) {
      c.__dirty = c.__used = !1;
    });
    function e(c) {
      a && (a.__endIndex !== c && (a.__dirty = !0), a.__endIndex = c);
    }
    if (this._singleCanvas)
      for (var i = 1; i < t.length; i++) {
        var n = t[i];
        if (n.zlevel !== t[i - 1].zlevel || n.incremental) {
          this._needsManuallyCompositing = !0;
          break;
        }
      }
    var a = null, o = 0, s, l;
    for (l = 0; l < t.length; l++) {
      var n = t[l], u = n.zlevel, h = void 0;
      s !== u && (s = u, o = 0), n.incremental ? (h = this.getLayer(u + AP, this._needsManuallyCompositing), h.incremental = !0, o = 1) : h = this.getLayer(u + (o > 0 ? Wo : 0), this._needsManuallyCompositing), h.__builtin__ || Ec("ZLevel " + u + " has been used by unkown layer " + h.id), h !== a && (h.__used = !0, h.__startIndex !== l && (h.__dirty = !0), h.__startIndex = l, h.incremental ? h.__drawIndex = -1 : h.__drawIndex = l, e(l), a = h), n.__dirty & ee && !n.__inHover && (h.__dirty = !0, h.incremental && h.__drawIndex < 0 && (h.__drawIndex = l));
    }
    e(l), this.eachBuiltinLayer(function(c, f) {
      !c.__used && c.getElementCount() > 0 && (c.__dirty = !0, c.__startIndex = c.__endIndex = c.__drawIndex = 0), c.__dirty && c.__drawIndex < 0 && (c.__drawIndex = c.__startIndex);
    });
  }, r.prototype.clear = function() {
    return this.eachBuiltinLayer(this._clearLayer), this;
  }, r.prototype._clearLayer = function(t) {
    t.clear();
  }, r.prototype.setBackgroundColor = function(t) {
    this._backgroundColor = t, T(this._layers, function(e) {
      e.setUnpainted();
    });
  }, r.prototype.configLayer = function(t, e) {
    if (e) {
      var i = this._layerConfig;
      i[t] ? ut(i[t], e, !0) : i[t] = e;
      for (var n = 0; n < this._zlevelList.length; n++) {
        var a = this._zlevelList[n];
        if (a === t || a === t + Wo) {
          var o = this._layers[a];
          ut(o, i[t], !0);
        }
      }
    }
  }, r.prototype.delLayer = function(t) {
    var e = this._layers, i = this._zlevelList, n = e[t];
    n && (n.dom.parentNode.removeChild(n.dom), delete e[t], i.splice(rt(i, t), 1));
  }, r.prototype.resize = function(t, e) {
    if (this._domRoot.style) {
      var i = this._domRoot;
      i.style.display = "none";
      var n = this._opts, a = this.root;
      if (t != null && (n.width = t), e != null && (n.height = e), t = Ao(a, 0, n), e = Ao(a, 1, n), i.style.display = "", this._width !== t || e !== this._height) {
        i.style.width = t + "px", i.style.height = e + "px";
        for (var o in this._layers)
          this._layers.hasOwnProperty(o) && this._layers[o].resize(t, e);
        this.refresh(!0);
      }
      this._width = t, this._height = e;
    } else {
      if (t == null || e == null)
        return;
      this._width = t, this._height = e, this.getLayer(Jr).resize(t, e);
    }
    return this;
  }, r.prototype.clearLayer = function(t) {
    var e = this._layers[t];
    e && e.clear();
  }, r.prototype.dispose = function() {
    this.root.innerHTML = "", this.root = this.storage = this._domRoot = this._layers = null;
  }, r.prototype.getRenderedCanvas = function(t) {
    if (t = t || {}, this._singleCanvas && !this._compositeManually)
      return this._layers[Jr].dom;
    var e = new Qu("image", this, t.pixelRatio || this.dpr);
    e.initContext(), e.clear(!1, t.backgroundColor || this._backgroundColor);
    var i = e.ctx;
    if (t.pixelRatio <= this.dpr) {
      this.refresh();
      var n = e.dom.width, a = e.dom.height;
      this.eachLayer(function(c) {
        c.__builtin__ ? i.drawImage(c.dom, 0, 0, n, a) : c.renderToCanvas && (i.save(), c.renderToCanvas(i), i.restore());
      });
    } else
      for (var o = {
        inHover: !1,
        viewWidth: this._width,
        viewHeight: this._height
      }, s = this.storage.getDisplayList(!0), l = 0, u = s.length; l < u; l++) {
        var h = s[l];
        oi(i, h, o, l === u - 1);
      }
    return e.dom;
  }, r.prototype.getWidth = function() {
    return this._width;
  }, r.prototype.getHeight = function() {
    return this._height;
  }, r;
}();
function IP(r) {
  r.registerPainter("canvas", kP);
}
kr([Uk, kk, wI, fL, wP, NL, CP, tP, fP, IP]);
class _c extends pe {
  constructor() {
    super(...arguments);
    kt(this, "height", 260);
  }
  render() {
    return k`<div class="c"></div>`;
  }
  firstUpdated() {
    this._chart = $M(this.renderRoot.querySelector("div.c")), this._ro = new ResizeObserver(() => this._chart.resize()), this._ro.observe(this), this._chart.on("click", (e) => this.dispatchEvent(new CustomEvent("point", { detail: e.data, bubbles: !0, composed: !0 }))), this._chart.on("brushEnd", (e) => {
      var n, a;
      const i = (a = (n = e.areas) == null ? void 0 : n[0]) == null ? void 0 : a.coordRange;
      i && this.dispatchEvent(new CustomEvent("range", { detail: [Math.round(i[0] / 1e3), Math.round(i[1] / 1e3)], bubbles: !0, composed: !0 })), setTimeout(() => {
        var o;
        return (o = this._chart) == null ? void 0 : o.dispatchAction({ type: "brush", areas: [] });
      }, 0);
    }), this._apply();
  }
  // Re-render only when the chart's inputs changed. Home Assistant updates `hass` constantly, which
  // re-renders the panel; redrawing then would wipe a drag-selection in progress.
  updated() {
    const e = [this.build, ...Array.isArray(this.rev) ? this.rev : [this.rev], this.brush];
    this._key && e.length === this._key.length && e.every((i, n) => i === this._key[n]) || (this._key = e, this._apply());
  }
  disconnectedCallback() {
    var e, i;
    super.disconnectedCallback(), (e = this._ro) == null || e.disconnect(), (i = this._chart) == null || i.dispose();
  }
  _apply() {
    if (!this._chart || !this.build) return;
    const e = getComputedStyle(this), i = {
      text: e.getPropertyValue("--primary-text-color").trim() || "#444",
      muted: e.getPropertyValue("--secondary-text-color").trim() || "#888",
      line: e.getPropertyValue("--divider-color").trim() || "#ddd",
      primary: e.getPropertyValue("--primary-color").trim() || "#03a9f4",
      accent: e.getPropertyValue("--accent-color").trim() || "#ff9800"
    }, n = this.build(i), a = e.getPropertyValue("--card-background-color").trim() || "#fff";
    n.tooltip = {
      confine: !0,
      backgroundColor: a,
      borderColor: i.line,
      borderWidth: 1,
      padding: [4, 8],
      textStyle: { color: i.text, fontSize: 12, fontWeight: "normal" },
      extraCssText: "box-shadow:0 2px 8px rgba(0,0,0,.25);border-radius:8px;",
      ...n.tooltip
    }, this.brush && (n.brush = {
      xAxisIndex: 0,
      brushType: "lineX",
      brushMode: "single",
      throttleType: "debounce",
      throttleDelay: 100,
      removeOnClick: !1,
      brushStyle: { color: i.primary + "33", borderColor: i.primary, borderWidth: 1 }
    }), this._chart.setOption(n, !0), this.brush && this._chart.dispatchAction({ type: "takeGlobalCursor", key: "brush", brushOption: { brushType: "lineX", brushMode: "single" } });
  }
}
kt(_c, "properties", { build: { attribute: !1 }, height: { type: Number }, brush: { type: Boolean }, rev: { attribute: !1 } }), kt(_c, "styles", Ir`:host{display:block;position:relative;flex:1 1 auto;min-height:var(--h,240px)} div.c{position:absolute;inset:0}`);
customElements.define("db-chart", _c);
const q = (r) => r == null ? "n/a" : r >= 1073741824 ? (r / 1073741824).toFixed(2) + " GB" : r >= 1048576 ? (r / 1048576).toFixed(1) + " MB" : r >= 1024 ? Math.round(r / 1024) + " KB" : r + " B", Kb = { suggestion: "Suggestion", integration: "Integration", device: "Device", domain: "Type", status: "Status", defined_in: "Defined in", used_in: "Referenced In 🔗", retention: "Retention", age: "Last update" }, LP = "Active = exists and is enabled. Disabled = turned off in Settings > Entities. Orphaned = history exists but no entity matches. External = statistics from another source.", jb = (r) => (r < 90 ? `${r}s` : r < 5400 ? `${Math.round(r / 60)} min` : r < 129600 ? `${Math.round(r / 3600)} h` : `${Math.round(r / 86400)} days`) + " ago", PP = (r) => r == null ? "" : r < 1e3 ? `${r} ms` : `${(r / 1e3).toFixed(1)} s`, EP = "Remove history = no entity exists, it is disabled, or it is imported statistics that stopped updating, so the history is leftover. Remove orphaned = a helper, automation, script or scene that is switched off and that nothing uses, so it can be deleted. Disable = still exists but looks unused and stale, or is unavailable and no longer updating. Remove from YAML = defined in YAML without a unique ID, so it cannot be disabled here. Review = might be unused, check before acting. Keep = referenced in your config. Suggestions are advice from a text scan and cannot see dynamic templates or outside systems.", RP = (r, t) => {
  const e = { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" };
  return `${new Date(r * 1e3).toLocaleString([], e)} to ${new Date(t * 1e3).toLocaleString([], e)}`;
}, $P = { sensor: "mdi:eye", binary_sensor: "mdi:radiobox-blank", light: "mdi:lightbulb", switch: "mdi:toggle-switch", cover: "mdi:window-shutter", climate: "mdi:thermostat", number: "mdi:ray-vertex", select: "mdi:format-list-bulleted", input_boolean: "mdi:toggle-switch-outline", device_tracker: "mdi:account", media_player: "mdi:cast", camera: "mdi:video", update: "mdi:package-up" }, Vs = (r, t) => {
  var i, n, a, o, s;
  const e = (i = r == null ? void 0 : r.entities) == null ? void 0 : i[t];
  if (customElements.get("ha-state-icon")) {
    const l = ((n = r == null ? void 0 : r.states) == null ? void 0 : n[t]) ?? { entity_id: t, state: "unknown", attributes: {}, context: {} };
    return k`<ha-state-icon .hass=${r} .stateObj=${l} .icon=${e == null ? void 0 : e.icon}></ha-state-icon>`;
  }
  return k`<ha-icon .icon=${(e == null ? void 0 : e.icon) || ((s = (o = (a = r == null ? void 0 : r.states) == null ? void 0 : a[t]) == null ? void 0 : o.attributes) == null ? void 0 : s.icon) || $P[t.split(".")[0]] || "mdi:help-circle-outline"}></ha-icon>`;
}, Ju = "#8353d1", Ry = (r, t, e) => r && getComputedStyle(r).getPropertyValue(t).trim() || e, jn = "#b5b5b5", $y = (r) => new Date(r * 1e3).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }), Qn = {
  get(r, t) {
    try {
      const e = JSON.parse(localStorage.getItem("db_storage.prefs") || "{}")[r];
      return e === void 0 ? t : e;
    } catch {
      return t;
    }
  },
  set(r, t) {
    try {
      const e = JSON.parse(localStorage.getItem("db_storage.prefs") || "{}");
      e[r] = t, localStorage.setItem("db_storage.prefs", JSON.stringify(e));
    } catch {
    }
  }
};
class bc extends pe {
  constructor() {
    super(...arguments);
    kt(this, "_historyOpt", (e) => {
      const i = this._windowed(), n = Ry(this, "--ha-color-primary-20", e.primary), a = Ry(this, "--ha-color-border-primary-loud", Ju), o = (s) => new Date(s).toLocaleDateString([], { day: "numeric", month: "short" });
      return {
        grid: { left: 8, right: 16, top: 12, bottom: 8, containLabel: !0 },
        tooltip: { trigger: "axis", valueFormatter: (s) => q(s) },
        xAxis: { type: "time", minInterval: 864e5, axisLabel: { color: e.muted, formatter: o, hideOverlap: !0 }, axisLine: { lineStyle: { color: e.line } } },
        yAxis: { type: "value", min: 0, axisLabel: { color: e.muted, formatter: (s) => q(s) }, splitLine: { lineStyle: { color: e.line } } },
        legend: { show: !1 },
        series: [
          { name: "Free Space/Undo Data", type: "line", stack: "size", showSymbol: !1, itemStyle: { color: jn }, lineStyle: { width: 1, color: jn }, areaStyle: { color: jn, opacity: 0.55 }, data: i.map((s) => [s.ts * 1e3, (s.undo_bytes || 0) + (s.free_bytes || 0)]) },
          { name: "Long-term statistics", type: "line", stack: "size", showSymbol: !1, itemStyle: { color: a }, lineStyle: { width: 1, color: a }, areaStyle: { color: a, opacity: 0.7 }, data: i.map((s) => [s.ts * 1e3, s.stats_bytes || 0]) },
          {
            name: "Everything else",
            type: "line",
            stack: "size",
            showSymbol: i.length < 40,
            itemStyle: { color: n },
            lineStyle: { width: 1, color: n },
            areaStyle: { color: n, opacity: 0.45 },
            data: i.map((s) => [s.ts * 1e3, Math.max(0, s.file_bytes - (s.stats_bytes || 0) - (s.free_bytes || 0))]),
            markArea: this.window ? { silent: !0, itemStyle: { color: e.primary, opacity: 0.18 }, data: [[{ xAxis: this.window[0] * 1e3 }, { xAxis: this.window[1] * 1e3 }]] } : void 0
          }
        ]
      };
    });
    kt(this, "_treemap", (e) => {
      var a, o;
      const i = {};
      for (const s of ((a = this.data) == null ? void 0 : a.items) || []) {
        const l = i[o = s.integration] || (i[o] = {});
        l[s.domain] = (l[s.domain] || 0) + s.total_bytes;
      }
      const n = Object.entries(i).map(([s, l]) => ({
        name: s,
        children: Object.entries(l).map(([u, h]) => ({ name: u, value: h, integration: s, domain: u }))
      }));
      return {
        tooltip: { formatter: (s) => `${s.treePathInfo.map((l) => l.name).filter(Boolean).join(" / ")}<br>${q(s.value)}` },
        series: [{
          type: "treemap",
          roam: !1,
          nodeClick: !1,
          breadcrumb: { show: !1 },
          width: "100%",
          height: "100%",
          label: { color: "#fff", overflow: "truncate" },
          upperLabel: { show: !0, height: 20, color: "#fff" },
          itemStyle: { borderColor: e.line, gapWidth: 1 },
          levels: [{ itemStyle: { borderWidth: 2, gapWidth: 2 } }, { colorSaturation: [0.35, 0.6] }],
          data: n
        }]
      };
    });
    kt(this, "_treeClick", (e) => {
      const i = e.detail;
      if (!i) return;
      const n = i.children ? { integration: [i.name] } : { integration: [i.integration], domain: [i.domain] };
      this.dispatchEvent(new CustomEvent("goto-filter", { detail: n }));
    });
  }
  // History inside the selected window (0 = everything we have).
  _windowed() {
    const e = this.history || [];
    if (!this.days || !e.length) return e;
    const i = e.at(-1).ts - this.days * 86400;
    return e.filter((n) => n.ts >= i);
  }
  render() {
    const e = this.data;
    if (!e) return k`<div class="hint">Waiting for the first scan to finish.</div>`;
    const i = (this.history || []).at(-1), n = this.live || i, a = e.dialect || "sqlite", o = n ? (a === "sqlite" ? `Database size = pages × page size, the figure SQLite tools report.
` : a === "postgresql" ? `Database size as PostgreSQL reports it (pg_database_size), including indexes.
` : `Database size as the storage engine reports it: tables, indexes and empty space (approximate).
`) + (n.main_bytes != null ? `On disk: main file ${q(n.main_bytes)} + write-ahead log ${q(n.wal_bytes || 0)}.
` : "") + `Exact: ${n.file_bytes.toLocaleString()} bytes (1 MB here = 1,048,576 bytes).` : "", s = e.items.filter((S) => S.used_in[0] === "Not referenced"), l = s.reduce((S, A) => S + A.total_bytes, 0), u = e.items.filter((S) => S.suggestion === "Remove history" || S.suggestion === "Remove orphaned" || S.suggestion === "Disable"), h = u.reduce((S, A) => S + A.total_bytes, 0), c = e.items.filter((S) => S.retention && S.retention !== "Default"), f = [...new Set(c.map((S) => S.retention))], d = this.ret, v = d == null ? void 0 : d.last_run, g = v ? `Last run ${jb(Math.max(0, Math.round(Date.now() / 1e3 - v.ts)))}` : "Has not run yet", p = [
      `Entities that keep less state history than Home Assistant's ${(d == null ? void 0 : d.default_days) ?? "default number of"} days. Click to see them.`,
      v ? `Last run ${new Date(v.ts * 1e3).toLocaleString()}: ${v.rows.toLocaleString()} rows deleted for ${v.entities} entit${v.entities === 1 ? "y" : "ies"}.` : "The retention job has not run yet.",
      d != null && d.run_at ? `Runs nightly at ${d.run_at}.` : "Nightly run is off (see the integration options).",
      "Change the time or turn it off in the integration options; to run it from your own automation instead, turn it off and call the db_storage_manager.run_retention action. Run retention now is in the menu beside Re-Scan. Rows it deletes are not backed up."
    ].join(`
`), y = this.history || [], m = y.length > 1 ? (y.at(-1).ts - y[0].ts) / 86400 : 0, _ = y.length ? new Date(y[0].ts * 1e3).toLocaleDateString([], { dateStyle: "medium" }) : null, b = Math.floor(m), w = y.length ? b < 1 ? `Under 1 day of data since first collection on ${_}` : `${b} day${b === 1 ? "" : "s"} of data since first collection on ${_}` : "No data collected yet.", x = [7, 30, 90, 365].filter((S) => S <= m);
    return k`
      <div class="kpis">
        <div class="kpi" title=${o + ((n == null ? void 0 : n.free_bytes) != null ? `
Free: empty space inside the database file left behind by deleted data. Reclaim free space (the arrow beside Re-Scan) returns it to the disk.` : "")}>
          <span>Database size</span><b>${q((n == null ? void 0 : n.file_bytes) ?? e.total_bytes)}</b>${(n == null ? void 0 : n.free_bytes) != null ? k`<span>~ ${q(n.free_bytes)} Free</span>` : ""}</div>
        <div class="kpi click" title="Entities with no literal reference in your config. Click to review them."
          @click=${() => this.dispatchEvent(new CustomEvent("goto-filter", { detail: { used_in: ["Not referenced"] } }))}>
          <span>Not referenced in config</span><b>${q(l)}</b><span>${s.length} entities</span></div>
        <div class="kpi click" title="Entities whose history is leftover (orphaned or disabled) or that look unused and stale. Click to review them."
          @click=${() => this.dispatchEvent(new CustomEvent("goto-filter", { detail: { suggestion: ["Remove history", "Remove orphaned", "Disable"] } }))}>
          <span>Cleanup candidates</span><b>${q(h)}</b><span>${u.length} entities</span></div>
        <div class="kpi ${c.length ? "click" : ""}" title=${p}
          @click=${() => c.length && this.dispatchEvent(new CustomEvent("goto-filter", { detail: { retention: f } }))}>
          <span>Reduced retention</span><b>${c.length} entit${c.length === 1 ? "y" : "ies"}</b><span>${g}</span></div>
      </div>
      <div class="grid">
        <div class="card tree"><h3>By integration and type</h3>
          <db-chart style="--h:420px" .rev=${e} .build=${this._treemap} @point=${this._treeClick}></db-chart></div>
        <div class="card"><h3>Largest entities</h3>
          <div class="key"><span><i style="background:var(--primary-color)"></i>Used in config</span><span><i style="background:var(--accent-color,#ff9800)"></i>Not referenced</span></div>
          <div class="toplist">${this._top(e)}</div></div>
        <div class="card"><h3>Database size over time
            <select @change=${(S) => this.dispatchEvent(new CustomEvent("days", { detail: +S.target.value }))}>
              <option value="0" ?selected=${!this.days || !x.includes(this.days)}>All data</option>
              ${x.map((S) => k`<option value=${S} ?selected=${this.days === S}>Last ${S} days</option>`)}</select>
            <span class="tip" tabindex="0"><span class="info">?</span><span class="pop"><div>${w}</div>
              <div>Drag across the chart to drill into a period.</div>
              <div><i style="background:var(--ha-color-primary-20,#488fc2)"></i><b>Everything else</b><br>States, attributes, events and the rest of the data in the database.</div>
              <div><i style="background:var(--ha-color-border-primary-loud,${Ju})"></i><b>Long-term statistics</b><br>Hourly and 5-minute statistics behind history graphs and Energy.</div>
              <div><i style="background:${jn}"></i><b>Free Space/Undo Data</b><br>Empty space inside the database file left by deleted data (returned to the disk by a repack), plus the compressed backups that let actions be undone, which are kept beside the database.</div></span></span></h3>
          <div class="key"><span><i style="background:var(--ha-color-primary-20,#488fc2)"></i>Everything else</span><span><i style="background:var(--ha-color-border-primary-loud,${Ju})"></i>Long-term statistics</span><span><i style="background:${jn}"></i>Free Space/Undo Data</span></div>
          <db-chart style="--h:250px" brush .rev=${[this.history, this.days, this.window]} .build=${this._historyOpt}
            @range=${(S) => this.dispatchEvent(new CustomEvent("goto-window", { detail: S.detail }))}></db-chart></div>
      </div>`;
  }
  // Clicking a box filters Entities to that integration and type; clicking a title, to the integration.
  _top(e) {
    const i = [...e.items].sort((a, o) => o.total_bytes - a.total_bytes).slice(0, 12), n = Math.max(...i.map((a) => a.total_bytes), 1);
    return i.map((a) => {
      const o = a.used_in[0] === "Not referenced";
      return k`<div class="tl" title=${`${a.entity_id}
${o ? "Not referenced in config" : a.used_count + " places"}`}
        @click=${() => this.dispatchEvent(new CustomEvent("goto-entity", { detail: a.entity_id }))}>
        <i class=${o ? "un" : ""} style="width:${Math.max(2, a.total_bytes / n * 100)}%"></i>
        <span class="ico">${Vs(this.hass, a.entity_id)}</span><span class="nm">${a.name || a.entity_id}</span><span class="sz">${q(a.total_bytes)}</span></div>`;
    });
  }
}
kt(bc, "properties", { data: { attribute: !1 }, history: { attribute: !1 }, days: { type: Number }, window: { attribute: !1 }, hass: { attribute: !1 }, live: { attribute: !1 }, ret: { attribute: !1 } }), kt(bc, "styles", Ir`
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
    @media (max-width:1000px){.grid{grid-template-columns:1fr;grid-auto-rows:auto}.tree{grid-column:auto;grid-row:auto}}`);
customElements.define("db-overview", bc);
const OP = { "Remove history": "rm", "Remove orphaned": "rm", Disable: "dis", "Remove from YAML": "dis", Review: "rev", Keep: "keep" }, NP = "Disabled but referenced", Oy = "Disabled in Home Assistant, but an automation, script, dashboard, helper or YAML file still names it. Whatever uses it is working with an entity that no longer exists.", BP = { size: "Size", name: "Name", age: "Last update" };
class xc extends pe {
  constructor() {
    super(), this.filters = {}, this.selected = /* @__PURE__ */ new Set(), this.shown = 100, this.sort = "size", this.search = "", this._facetsOpen = !1;
  }
  // Search as you type (short delay), and at once when the box is emptied with the x or by hand.
  _onSearch(t, e = !1) {
    clearTimeout(this._st);
    const i = t.trim();
    if (i === this.search) return;
    const n = () => this._emit("search", i);
    e || i === "" ? n() : this._st = setTimeout(n, 350);
  }
  _emit(t, e) {
    this.dispatchEvent(new CustomEvent(t, { detail: e }));
  }
  _toggleFilter(t, e, i) {
    const n = new Set(this.filters[t] || []);
    i ? n.add(e) : n.delete(e), this._emit("filters", { ...this.filters, [t]: [...n] });
  }
  _rows() {
    var i;
    const t = [...((i = this.data) == null ? void 0 : i.items) || []], e = (n) => {
      var a;
      return (a = this.data) != null && a.window ? n.win_bytes : n.total_bytes;
    };
    return this.sort === "name" ? t.sort((n, a) => n.entity_id.localeCompare(a.entity_id)) : this.sort === "age" ? t.sort((n, a) => (a.last_ts || 0) - (n.last_ts || 0)) : t.sort((n, a) => e(a) - e(n)), t;
  }
  _toggleSel(t, e) {
    const i = new Set(this.selected);
    e ? i.add(t) : i.delete(t), this._emit("selected", i);
  }
  _selectAll(t, e) {
    const i = new Set(this.selected);
    t.forEach((n) => e ? i.add(n.entity_id) : i.delete(n.entity_id)), this._emit("selected", i);
  }
  _moreInfo(t) {
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: t }, bubbles: !0, composed: !0 }));
  }
  _facet(t, e) {
    const i = Math.max(...e.map((n) => n.bytes), 1);
    return k`<div class="facet"><b>${Kb[t] || t}</b>
      ${t === "status" ? k` <span class="help" title=${LP}>?</span>` : G}
      ${t === "suggestion" ? k` <span class="help" title=${EP}>?</span>` : G}
      ${e.map((n) => {
      const a = (this.filters[t] || []).includes(n.value);
      return n.other ? k`<div class="fr more" title="Show all of them" @click=${() => this._emit("expand", { facet: t, on: !0 })}><i style="width:${Math.max(1, n.bytes / i * 100)}%"></i><span></span><span class="lbl">${n.value} ▾</span><span class="val">${q(n.bytes)}<small>${n.count}</small></span></div>` : k`<label class="fr ${n.count === 0 && !a ? "zero" : ""}"><i style="width:${Math.max(1, n.bytes / i * 100)}%"></i>
          ${n.other ? k`<span></span>` : k`<input type="checkbox" .checked=${a} @change=${(o) => this._toggleFilter(t, n.value, o.target.checked)}>`}
          ${t === "used_in" && n.value === NP ? k`<span class="lbl warnrow" title=${n.count ? Oy : "None found. " + Oy}>${n.count ? k`<svg class="warnicon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M13 14H11V10H13M13 18H11V16H13M1 21H23L12 2L1 21Z"/></svg>` : G}<span class="txt">${n.value}</span></span>` : k`<span class="lbl" title=${n.value}>${n.value}</span>`}<span class="val">${q(n.bytes)}<small>${n.count}</small></span></label>`;
    })}
      ${(this.expand || []).includes(t) && e.length > 8 ? k`<div class="fr more" @click=${() => this._emit("expand", { facet: t, on: !1 })}><span></span><span class="lbl">Show fewer ▴</span><span></span></div>` : G}
      ${t === "used_in" ? k`<div class="muted">An entity can appear under several kinds.</div>` : G}</div>`;
  }
  _link(t, e, i) {
    return k`<a href=${t} @click=${(n) => {
      n.preventDefault(), this._emit("navigate", t);
    }}>${i ? k`<ha-icon class="tabicon" .icon=${i}></ha-icon>` : G}${e}</a>`;
  }
  // Dashboards: "Main > <tab link> card gauge", so the tab itself is the link. Others link the item name.
  _locText(t) {
    const e = t.kind === "Dashboard" && t.link ? /^(view "[^"]*")(?:, )?(.*)$/.exec(t.where) : null;
    return e ? k`${t.name} <span class="muted">›</span> ${this._link(t.link, e[1].slice(6, -1), t.icon)}${e[2] ? k` <span class="muted">${e[2]}</span>` : G}` : k`${t.link ? this._link(t.link, t.name) : t.name} <span class="muted">${t.where}</span>`;
  }
  _usageDetail() {
    var n, a, o, s, l;
    const t = this.usage;
    if (!t) return G;
    const e = (n = t.dynamic_possible) != null && n.length ? k`<div class="warn">These templates loop over every entity of this type, so they may use it without naming it: ${t.dynamic_possible.join(", ")}.</div>` : G, i = t.entity_ids ? k`<b>${t.entity_ids.length} selected entit${t.entity_ids.length === 1 ? "y" : "ies"}</b> appear in these places (a number shows how many of them are in a place):` : k`<span class="ico" style="vertical-align:middle">${Vs(this.hass, t.entity_id)}</span> <b>${((s = (o = (a = this.data) == null ? void 0 : a.items) == null ? void 0 : o.find((u) => u.entity_id === t.entity_id)) == null ? void 0 : s.name) || t.entity_id}</b> is referenced in:`;
    return k`<div class="detail">${i}
      <ul>${t.locations.length ? t.locations.map((u) => k`<li><span class="kind">${u.kind}</span>
        ${this._locText(u)}${u.count > 1 ? k` <span class="cnt" title=${u.entities.join(`
`)}>×${u.count}</span>` : G}</li>`) : k`<li class="muted">No literal reference found in automations, scripts, scenes, dashboards, helpers, the Energy dashboard or YAML files.</li>`}</ul>
      ${e}<details><summary>What this scan can miss</summary><ul>${(((l = this.data) == null ? void 0 : l.caveats) || []).map((u) => k`<li>${u}</li>`)}</ul></details>
      <button @click=${() => this._emit("usage", null)}>Close</button></div>`;
  }
  render() {
    const t = this.data;
    if (!t) return k`<div class="muted">Waiting for the first scan to finish.</div>`;
    const e = this._rows(), i = e.slice(0, this.shown), n = !!t.window, a = (f) => n ? f.win_bytes : f.total_bytes, o = Math.max(...i.map(a), 1), s = i.length > 0 && i.every((f) => this.selected.has(f.entity_id)), l = (t.items || []).filter((f) => this.selected.has(f.entity_id)).reduce((f, d) => f + a(d), 0), u = new Set((t.items || []).map((f) => f.entity_id)), h = [...this.selected].filter((f) => !u.has(f)).length, c = Object.entries(this.filters).flatMap(([f, d]) => d.map((v) => [f, v]));
    return k`
      <div class="bar">
        <input type="search" placeholder="Search name or entity id" .value=${this.search} @input=${(f) => this._onSearch(f.target.value)} @change=${(f) => this._onSearch(f.target.value, !0)}>
        <select @change=${(f) => this._emit("sort", f.target.value)} title="Sort">${Object.entries(BP).map(([f, d]) => k`<option value=${f} ?selected=${this.sort === f}>Sort: ${d}</option>`)}</select>
        <button class="filtertoggle" @click=${() => {
      this._facetsOpen = !this._facetsOpen, this.requestUpdate();
    }}>Filters${c.length ? ` (${c.length})` : ""}</button>
      </div>
      ${this.selected.size ? k`<div class="selbar"><b>${this.selected.size} selected</b>${h ? k` <span class="muted" title="These were ticked earlier and are not in the list now (filters, search or period changed). Actions still include them.">(${h} not in the current list)</span> <button title="Drop the selected entities that are not in the current list" @click=${() => this._emit("selected", new Set([...this.selected].filter((f) => u.has(f))))}>Keep only listed</button>` : G}
        <button class="x" title="Clear selection" aria-label="Clear selection" @click=${() => this._emit("selected", /* @__PURE__ */ new Set())}>✕</button>
        <span class="muted">≈ ${q(l)} of ${n ? "data written in this period" : "entity data"}</span>
        ${this.selected.size < t.items.length ? k`<button @click=${() => this._emit("selected", new Set(t.items.map((f) => f.entity_id)))}>Select all ${t.items.length.toLocaleString()} matching</button>` : G}
        <span style="flex:1"></span>
        <button title="Turns these entities off in Home Assistant so they stop recording. Nothing is deleted and it can be undone from the History tab. Entities defined in your YAML files stay in those files; remove them there to get rid of them for good." @click=${() => this._emit("action", "disable")}>Disable</button>
        <button title="Deletes their long-term statistics, and optionally their recorded state history. Everything deleted is first saved in one compressed backup, so the whole action can be undone from the History tab." @click=${() => this._emit("action", "delete_history")}>Clear history</button>
        <button title="Disables them first so nothing is recorded again, then clears their history. Everything deleted is first saved in one compressed backup, and undoing from the History tab restores it and turns them back on." @click=${() => this._emit("action", "disable_and_clear")}>Disable + clear</button>
        <button title="Choose how many days of detailed states to keep (1, 3, 5, 7 or Home Assistant's default). Long-term statistics (graphs, Energy) are kept." @click=${() => this._emit("action", "reduce_retention")}>Change retention</button></div>` : G}
      ${n ? k`<div class="banner"><span>≈ <b>${q((t.items || []).reduce((f, d) => f + (d.win_bytes || 0), 0))}</b> of <b>${(t.items || []).length.toLocaleString()}</b> entities changed between <b>${$y(t.window.from)}</b> and <b>${$y(t.window.to)}</b>.</span>
        <span class="info" title=${`Entities that wrote data in this period, with the estimated size of what they wrote.${this.growth != null ? `
The database file changed by ${this.growth >= 0 ? "+" : "-"}${q(Math.abs(this.growth))} across it.` : ""}
State history is only kept for ${t.window.keep_days} days, so older periods show long-term statistics only.`}>i</span>
        <span style="flex:1"></span><button class="x" title="Clear the period filter" aria-label="Clear the period filter" @click=${() => this._emit("clearwindow")}>✕</button></div>` : G}
      <div class="layout">
        <div class="facets ${this._facetsOpen ? "" : "closed"}">${Object.entries(t.facets).map(([f, d]) => this._facet(f, d))}</div>
        <div>
          ${this._usageDetail()}
          <div class="tablewrap">
            <div class="head"><input type="checkbox" .checked=${s} @change=${(f) => this._selectAll(i, f.target.checked)} title="Select all shown">
              <span>Entity</span><span class="c-int">Integration</span><span class="c-dev">Device</span><span class="c-age">Last update</span><span class="c-status">Suggestion</span><span style="text-align:right">${n ? "In period" : "Size"}<span class="tip" tabindex="0"><span class="info" style="font-style:normal">?</span><span class="pop"><div><b>${n ? "Estimated size of what each entity wrote in the period" : "Estimated size of all its stored data"}</b></div>
              <div><i style="background:var(--ha-color-primary-20,#488fc2)"></i>States and attributes</div><div><i style="background:var(--ha-color-border-primary-loud,#8353d1)"></i>Long-term statistics (hourly and 5-minute)</div>
              <div class="muted">The bar splits each entity's size between the two. Hover a size for the exact split.</div></span></span></span></div>
            ${i.map((f) => this._row(f, o, a))}
          </div>
          ${e.length > this.shown ? k`<button style="margin-top:8px" @click=${() => this._emit("more")}>Show ${Math.min(100, e.length - this.shown)} more of ${e.length - this.shown} remaining</button>` : G}
        </div>
      </div>
`;
  }
  // Share of an entity's storage that is detailed states (with attributes) rather than long-term statistics.
  _split(t) {
    const e = (t.states_bytes || 0) + (t.attrs_bytes || 0), i = t.stats_bytes || 0;
    return e + i > 0 ? e / (e + i) : 1;
  }
  _splitTip(t, e) {
    const i = this._split(t);
    return `States ${q(e * i)} · Long-term statistics ${q(e * (1 - i))}`;
  }
  _row(t, e, i) {
    const n = t.used_in[0] === "Not referenced", a = t.dynamic_possible ? ` +${t.dynamic_possible} dyn` : "", o = `${t.integration} · ${t.device} · ${t.status} · ${t.age}`;
    return k`<div class="row ${this.selected.has(t.entity_id) ? "sel" : ""}">
      <input type="checkbox" .checked=${this.selected.has(t.entity_id)} @change=${(s) => this._toggleSel(t.entity_id, s.target.checked)}>
      <span style="display:flex;gap:8px;align-items:center;min-width:0">${t.status === "Disabled" ? k`<span class="ico off" title="Disabled in Home Assistant"><ha-icon icon="mdi:cancel"></ha-icon></span>` : k`<span class="ico">${Vs(this.hass, t.entity_id)}</span>`}<a class="eid" href="#" title=${`${t.entity_id}
${o}`} style="overflow:hidden;text-overflow:ellipsis" @click=${(s) => {
      s.preventDefault(), this._moreInfo(t.entity_id);
    }}>${t.name || t.entity_id}</a>
        ${t.retention_days ? k`<span class="ret" title=${`Retention rule: state history is kept for ${t.retention_days} days (Home Assistant's default is longer). Rows older than that are deleted every night.`}>${t.retention_days}d</span>` : G}
        <button class="inspect" title="Inspect the raw data stored for this entity (states, attributes, statistics)" aria-label="Inspect stored data" @click=${() => this._emit("inspect", t)}><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m1 2v3h16V5H4m0 5v4h5v-4H4m7 0v4h9v-4h-9m-7 6v3h5v-3H4m7 0v3h9v-3h-9z"/></svg></button><button class="chip ${n ? "none" : "used"}" title=${n ? "No literal reference found in config" : `${t.used_count} reference${t.used_count === 1 ? "" : "s"}: ${t.used_in.join(", ")}`} @click=${() => this._emit("usage", t.entity_id)}>${n ? "0" : t.used_count} 🔗${a}</button></span>
      <span class="c-int muted">${t.integration}</span><span class="c-dev muted">${t.device}</span><span class="c-age muted">${t.age}</span><span class="c-status"><span class="sugg ${OP[t.suggestion] || ""}" title=${`${t.suggestion} (${(t.confidence || "").toLowerCase()} confidence)
${(t.reasons || []).join(`
`)}`}>${t.suggestion}</span></span>
      ${t.size_stale ? k`<span class="size stale" title="Out of date: this entity was changed by an action. Re-Scan refreshes it."><span>⟳</span></span>` : k`<span class="size" title=${this._splitTip(t, i(t))}><i class="bar2" style="width:${Math.max(2, i(t) / e * 100)}%"><b class="seg st" style="flex:${this._split(t)}"></b><b class="seg hs" style="flex:${1 - this._split(t)}"></b></i><span>${q(i(t))}</span></span>`}</div>`;
  }
}
kt(xc, "properties", {
  data: { attribute: !1 },
  filters: { attribute: !1 },
  search: { type: String },
  sort: { type: String },
  selected: { attribute: !1 },
  shown: { type: Number },
  usage: { attribute: !1 },
  busy: { type: Boolean },
  growth: { type: Number },
  hass: { attribute: !1 },
  expand: { attribute: !1 }
}), kt(xc, "styles", Ir`
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
    .size span{position:relative} .size.stale{color:var(--secondary-text-color);font-weight:400;cursor:help} .size.stale span{font-size:16px}
    .size i.bar2{display:flex;background:none;opacity:1;overflow:hidden} .seg{display:block;height:100%;min-width:0} .seg.st{background:color-mix(in srgb,var(--ha-color-primary-20,#488fc2) 55%,transparent)} .seg.hs{background:color-mix(in srgb,var(--ha-color-border-primary-loud,#8353d1) 50%,transparent)}
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
    .warnrow{display:flex;align-items:center;gap:5px;min-width:0;line-height:1.2} .warnrow .txt{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .warnicon{flex:0 0 16px;display:block;width:16px;height:16px;color:var(--warning-color,#ff9800)}
    .fr.zero{opacity:.45} .fr.more{color:var(--primary-color)} .fr.more:hover{background:color-mix(in srgb,var(--primary-color) 12%,transparent)}
    .detail{border:1px solid var(--primary-color);border-radius:10px;padding:8px 12px;margin:10px 0;background:var(--card-background-color)} .detail ul{margin:6px 0;padding-left:18px}
    .kind{font-size:11px;border:1px solid var(--divider-color);border-radius:8px;padding:0 6px;margin-right:4px} .warn{background:var(--secondary-background-color);border-radius:8px;padding:6px 10px;margin:6px 0;font-size:12px}
    a{color:var(--primary-color)} .chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px} .fchip{font-size:12px;border:1px solid var(--primary-color);border-radius:12px;padding:1px 8px;cursor:pointer}
    .ret{flex:0 0 auto;font-size:11px;border:1px solid var(--primary-color);color:var(--primary-color);border-radius:8px;padding:0 6px;line-height:16px;cursor:help}
    .filtertoggle{display:none}
    @media (max-width:900px){.layout{grid-template-columns:1fr}.filtertoggle{display:inline-block}.facets.closed{display:none}
      .head,.row{grid-template-columns:32px minmax(0,1fr) auto auto}.c-int,.c-dev,.c-age,.c-status{display:none}}`);
customElements.define("db-entities", xc);
class wc extends pe {
  render() {
    var n;
    const t = this.status;
    if (!t || !((n = t.steps) != null && n.length)) return k`<div class="card"><h3>Starting scan…</h3><div class="track"><div class="fill run" style="width:5%"></div></div></div>`;
    const e = t.steps.filter((a) => a.status === "done").length, i = Math.max(5, Math.round((e + (t.steps.some((a) => a.status === "running") ? 0.5 : 0)) / t.steps.length * 100));
    return k`<div class="card">
      <h3>${this.first ? "First scan, building the inventory" : "Refreshing"} · ${Math.round(t.elapsed_s)} s</h3>
      <div class="sub">${this.first ? "This only happens once; results are saved and reloaded instantly after a restart. " : "You can keep browsing the previous results. "}Step ${Math.min(e + 1, t.steps.length)} of ${t.steps.length}.</div>
      <div class="track"><div class="fill ${t.running ? "run" : ""}" style="width:${i}%"></div></div>
      ${t.steps.map((a) => k`<div class="st ${a.status}"><span>${a.status === "done" ? "✓" : a.status === "running" ? k`<span class="spin"></span>` : "○"}</span><span>${a.label}</span><span>${PP(a.ms)}</span></div>`)}
      ${t.error ? k`<div class="err">${t.error}</div>` : ""}</div>`;
  }
}
kt(wc, "properties", { status: { attribute: !1 }, first: { type: Boolean } }), kt(wc, "styles", Ir`
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
    .err{color:var(--error-color,#c33);margin-top:6px}`);
customElements.define("db-progress", wc);
const zP = { disable: "Disable", delete_history: "Clear history", disable_and_clear: "Disable and clear history", reduce_retention: "Change retention", reset_retention: "Change retention (default)", retention_run: "Retention rules (nightly)" }, FP = { applied: "Applied", partial: "Partly applied", failed: "Failed", undone: "Undone", undo_partial: "Partly undone", running: "Running", interrupted: "Interrupted" }, HP = `Every change made from this panel is recorded here.
Each action that clears history saves one compressed backup file holding everything it cleared (long-term statistics and any state history, with attributes) for all its entities. Undo restores the whole batch, turns disabled entities back on, and removes the file.
Est. freed is the database space the action should free. The Backup size is that same data compressed, so it is normally much smaller.
The database file on disk only shrinks after "Reclaim free space".`, VP = /^(No long-term statistics to clear|State history cleared|Was already disabled|Not in the entity registry)/, si = (r) => (r || 0).toLocaleString(), GP = (r) => {
  var e;
  const t = (e = r.steps) == null ? void 0 : e.disabled;
  return t ? t.changed ? "Disabled" : "Was already off" : "";
}, WP = (r) => {
  var e;
  const t = (e = r.steps) == null ? void 0 : e.statistics;
  return t ? t.snapshot === null || t.snapshot === void 0 ? "None to clear" : t.deleted ? `Cleared · ${si(t.statistics)} rows` : "Not cleared" : "";
}, UP = (r) => {
  var e;
  const t = (e = r.steps) == null ? void 0 : e.states;
  return t != null && t.purged ? t.rows ? `Cleared · ${si(t.rows)} rows` : "None to clear" : "";
}, YP = (r) => {
  var e;
  const t = (e = r.steps) == null ? void 0 : e.retention;
  return t ? t.new ? `Keep ${t.new} days${t.old ? ` (was ${t.old})` : ""}` : `Default${t.old ? ` (was ${t.old} days)` : ""}` : "";
}, XP = (r) => (r.undo_notes || []).filter((t) => !/^(Backup file removed|State history cannot)/.test(t)).map((t) => t.replace(/^Restored (\d+) long-term and (\d+) short-term rows\.$/, (e, i, n) => `Restored ${si(+i)} rows`).replace("Enabled again.", "Re-enabled")).join(" · "), th = (r) => (r.notes || []).filter((t) => !VP.test(t)).join(" "), ZP = [
  ["rule", "Retention rule", YP, "Detailed states are kept for this many days. Statistics are not affected."],
  ["disabled", "Disabled", GP, "Turned off in Home Assistant so it stops recording."],
  ["stats", "Long-term statistics", WP, "Hourly summaries behind history graphs and the Energy dashboard. Backed up before clearing."],
  ["states", "State history", UP, "Every recorded state change, with its attributes. Backed up before clearing."],
  ["undo", "Undo result", XP, "What the undo did for this entity."]
], Ny = {
  disabled: { Disabled: "Disabled: turned off in Home Assistant so they stop recording. Undo turns them back on.", "Was already off": "They were already disabled, so nothing changed there." },
  stats: { "None to clear": "No long-term statistics existed to clear, so there is nothing to back up or restore." },
  states: { "None to clear": "No state history was stored for these entities." }
};
class Sc extends pe {
  constructor() {
    super(), this.sel = /* @__PURE__ */ new Set(), this.open = null;
  }
  updated(t) {
    t.has("actions") && this.actions && this.ws && this._loadUsage();
  }
  async _loadUsage() {
    try {
      this.usage = await this.ws("backup_usage");
    } catch {
    }
  }
  _when(t) {
    return new Date(t * 1e3).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }
  _undoable(t) {
    return ["applied", "partial", "failed", "undo_partial"].includes(t.status) && t.entities.some((e) => {
      var i, n, a, o, s, l, u;
      return ((n = (i = e.steps) == null ? void 0 : i.disabled) == null ? void 0 : n.changed) || ((a = e.steps) == null ? void 0 : a.retention) || ((s = (o = e.steps) == null ? void 0 : o.statistics) == null ? void 0 : s.deleted) && e.steps.statistics.snapshot && !e.steps.statistics.snapshot_removed || ((u = (l = e.steps) == null ? void 0 : l.states) == null ? void 0 : u.purged) && e.steps.states.backup && !e.steps.states.backup_removed;
    });
  }
  async _recheck(t) {
    this._checking = t.id, this._soon = null, this.requestUpdate();
    try {
      const e = await this.ws("health_check", { action_id: t.id });
      e != null && e.too_soon && (this._soon = t.id), this.dispatchEvent(new CustomEvent("changed"));
    } catch (e) {
      this.err = e.message || JSON.stringify(e);
    }
    this._checking = null, this.requestUpdate();
  }
  // After a disable: has anything else from the same integration been down ever since? An integration can read an entity you turn off.
  _health(t) {
    var o;
    if (!["disable", "disable_and_clear"].includes(t.kind) || t.status === "undone" || !t.entities.some((s) => {
      var l, u;
      return (u = (l = s.steps) == null ? void 0 : l.disabled) == null ? void 0 : u.changed;
    })) return G;
    const e = (o = t.meta) == null ? void 0 : o.health, i = e != null && e.checked ? this._when(e.checked) : null, n = k`<button ?disabled=${this._checking === t.id} @click=${(s) => {
      s.stopPropagation(), this._recheck(t);
    }}>${this._checking === t.id ? "Checking…" : "Check now"}</button>`, a = (e == null ? void 0 : e.broken) || [];
    if (a.length) {
      const s = (l) => l < 5400 ? `${Math.max(1, Math.round(l / 60))} min` : `${Math.round(l / 3600)} h`;
      return k`<div class="warnbox"><b>⚠ ${a.length} other entit${a.length === 1 ? "y has" : "ies have"} been unavailable ever since this.</b> They were working when you disabled these, and have had no working state since${i ? ` (checked ${i})` : ""}:
        <ul>${a.map((l) => k`<li title=${l.entity_id}>${l.name} <span class="muted">${l.entity_id} · down ${this._when(l.down_since)}, ${s(l.after_s)} after</span></li>`)}</ul>
        That might be caused by what was disabled here, or be a coincidence. Undo this action and see whether they come back. ${n}</div>`;
    }
    return e ? k`<div class="gsum">Health check: <b>${e.siblings}</b> other entit${e.siblings === 1 ? "y" : "ies"} from the same integration; none has been down ever since this (checked ${i}). A dropout that came back is ignored. ${n}</div>` : k`<div class="gsum">Health check: ${this._soon === t.id ? "too early to say, " : ""}runs on a scan once 3 hours have passed. It looks for other entities from the same integration that have been unavailable ever since. ${n}</div>`;
  }
  _toggle(t, e) {
    const i = new Set(this.sel);
    e ? i.add(t) : i.delete(t), this.sel = i;
  }
  _chosen() {
    return (this.actions || []).filter((t) => this.sel.has(t.id) && t.status !== "running");
  }
  async _delete() {
    const t = this._chosen().map((e) => e.id);
    this.err = null;
    try {
      const e = await this.ws("delete_actions", { action_ids: t, confirm: !0 });
      this.dlg = null, this.sel = /* @__PURE__ */ new Set(), this.open = null, this.dispatchEvent(new CustomEvent("changed")), this.freedMsg = `Deleted ${e.deleted} record${e.deleted === 1 ? "" : "s"} and ${e.files_removed} backup file${e.files_removed === 1 ? "" : "s"}, recovering ${q(e.bytes_freed)}.`, this.requestUpdate();
    } catch (e) {
      this.err = e.message || JSON.stringify(e);
    }
  }
  _dlg() {
    if (!this.dlg) return G;
    const t = this._chosen(), e = t.reduce((a, o) => a + (o.backup_bytes || 0), 0), i = t.reduce((a, o) => a + (o.backup_files || 0), 0), n = t.filter((a) => this._undoable(a));
    return k`<div class="modal" @click=${() => this.dlg = null}><div class="dlg" @click=${(a) => a.stopPropagation()}>
      <h3>Delete ${t.length} history record${t.length === 1 ? "" : "s"}?</h3>
      <div>This removes the records and ${i} backup file${i === 1 ? "" : "s"}, recovering <b>${q(e)}</b> of disk space.</div>
      ${n.length ? k`<div class="warnbox"><b>${n.length}</b> of them can still be undone. Once deleted, their statistics can no longer be restored and disabled entities will not be turned back on.</div>` : G}
      ${this.err ? k`<div class="err">${this.err}</div>` : G}
      <div class="btns"><button @click=${() => this.dlg = null}>Cancel</button><button class="danger" @click=${() => this._delete()}>Delete</button></div></div></div>`;
  }
  _detail(t) {
    var d, v;
    const e = t.entities, i = (g) => e.map(g), n = (g) => {
      const p = i(g);
      return p.every((y) => y === p[0]) ? p[0] : void 0;
    }, a = [], o = [], s = [];
    for (const [g, p, y, m] of ZP) {
      const _ = n(y);
      _ === void 0 ? a.push([g, p, y, m]) : _ && (o.push(g === "disabled" ? _ : `${p}: ${_}`), (d = Ny[g]) != null && d[_] ? s.push(Ny[g][_]) : g === "undo" && s.push("Undo result: " + _));
    }
    const l = n(th), u = l === void 0;
    l && (o.push(l), s.push(l));
    const h = [...s, ...t.error ? [t.error] : []].join(`
`), c = e.some((g) => {
      var p, y, m, _;
      return ((y = (p = g.steps) == null ? void 0 : p.statistics) == null ? void 0 : y.snapshot) || ((_ = (m = g.steps) == null ? void 0 : m.states) == null ? void 0 : _.backup);
    }), f = (v = t.backup_names) == null ? void 0 : v[0];
    return k`<div class="detail">
      ${t.undone_ts ? k`<div class="muted" style="margin-bottom:4px">Undone ${this._when(t.undone_ts)}</div>` : G}
      ${t.error ? k`<div class="muted" style="margin-bottom:4px">${t.error}</div>` : G}
      ${this._health(t)}
      ${c ? k`<div class="gsum">Backup: <b>${t.backup_files ? q(t.backup_bytes) : "no file on disk"}</b> ${f ? k`<span title=${f}>(${f})</span>` : G} <span class="muted">compressed, one file for the whole action</span></div>` : G}
      ${o.length ? k`<div class="gsum">${e.length > 1 ? "Same for all:" : "Result:"} ${o.join(" · ")} <span class="info" title=${h}>i</span></div>` : G}
      <table><tr><th>Entity</th>${a.map(([, g, , p]) => k`<th title=${p}>${g}</th>`)}<th class="r" title="Estimated database space freed: long-term statistics plus any state history cleared. Not the size of the backup.">Est. freed</th>${c ? k`<th class="r" title="Rows of this entity saved in the action's backup file">Backed up</th>` : G}${u ? k`<th>Notes</th>` : G}</tr>
        ${e.map((g) => {
      var w, x;
      const p = (w = g.steps) == null ? void 0 : w.statistics, y = g.est_stats_bytes != null ? `Long-term statistics ${q(g.est_stats_bytes)}${g.est_states_bytes ? ` + state history ${q(g.est_states_bytes)}` : ""}` : "", m = (x = g.steps) == null ? void 0 : x.states, _ = ((p == null ? void 0 : p.statistics) || 0) + ((p == null ? void 0 : p.short_term) || 0) + ((m == null ? void 0 : m.rows) || 0), b = p != null && p.snapshot || m != null && m.backup ? ((p == null ? void 0 : p.exists) ?? (m == null ? void 0 : m.exists)) === !1 ? p != null && p.snapshot_removed || m != null && m.backup_removed ? "removed" : "missing" : `${si(_)} rows` : "";
      return k`<tr><td class="ent" title=${g.entity_id}>${g.name}<span class="id">${g.entity_id}</span></td>
            ${a.map(([, , S]) => k`<td title=${S(g)}>${S(g) || "–"}</td>`)}
            <td class="r" title=${y}>${g.est_bytes ? q(g.est_bytes) : "–"}</td>
            ${c ? k`<td class="r" title=${p != null && p.snapshot || m != null && m.backup ? `${si(p == null ? void 0 : p.statistics)} long-term, ${si(p == null ? void 0 : p.short_term)} 5-minute statistics rows and ${si(m == null ? void 0 : m.rows)} state rows saved in ${(p == null ? void 0 : p.snapshot) || (m == null ? void 0 : m.backup)}${((p == null ? void 0 : p.exists) ?? (m == null ? void 0 : m.exists)) === !1 ? p != null && p.snapshot_removed || m != null && m.backup_removed ? `
Removed after the undo restored it` : `
The file is no longer on disk` : ""}` : "Nothing needed backing up"}>${b || "–"}</td>` : G}
            ${u ? k`<td title=${th(g)}>${th(g) || "–"}</td>` : G}</tr>`;
    })}</table></div>`;
  }
  render() {
    const t = this.actions;
    if (!t) return k`<div class="muted">Loading…</div>`;
    const e = this.usage, i = this._chosen(), n = i.reduce((o, s) => o + (s.backup_bytes || 0), 0), a = t.length > 0 && t.every((o) => this.sel.has(o.id));
    return k`
      <div class="card"><b>Undo data</b>
        <span title=${e ? `Backup files: ${e.path}
History records: ${e.journal_path}` : ""}>${e ? k`<b>${q(e.bytes + e.journal_bytes)}</b> in use: ${e.files} backup file${e.files === 1 ? "" : "s"} (${q(e.bytes)}) and the record database (${q(e.journal_bytes)})` : "Checking…"}</span>
        ${e ? k`<span class="muted">Stored in ${e.path.replace(/\/snapshots$/, "")}</span>` : G}
        ${e != null && e.unlinked_files ? k`<span class="muted" title="Backup files in the folder that no history record points to, for example from records deleted by hand. They are safe to delete from the folder.">${e.unlinked_files} file${e.unlinked_files === 1 ? "" : "s"} not linked to any record (${q(e.unlinked_bytes)})</span>` : G}
        <span class="sp"></span><span class="info" title=${HP}>i</span></div>
      ${this.freedMsg ? k`<div class="card" style="border-color:var(--success-color,green)">${this.freedMsg} <span class="sp"></span><button @click=${() => {
      this.freedMsg = null, this.requestUpdate();
    }}>Dismiss</button></div>` : G}
      ${t.length ? k`
      ${i.length ? k`<div class="selbar"><b>${i.length} selected</b><span class="muted">${q(n)} of backup files would be recovered</span><span style="flex:1"></span>
        <button @click=${() => this.sel = /* @__PURE__ */ new Set()}>Clear</button><button class="danger" @click=${() => {
      this.err = null, this.dlg = !0;
    }}>Delete selected…</button></div>` : G}
      <div class="tablewrap"><div class="row head"><input type="checkbox" .checked=${a} @change=${(o) => this.sel = o.target.checked ? new Set(t.map((s) => s.id)) : /* @__PURE__ */ new Set()} title="Select all"><span>When</span><span class="c2">Action</span><span class="c3 r" title="Estimated database space freed, not the size of the backup">Est. freed</span><span class="c4 r" title="Compressed backup file for this action">Backup</span><span class="c5">Status</span><span></span></div>
      ${t.map((o) => {
      var s, l, u;
      return k`
        <div class="row item ${this.sel.has(o.id) ? "sel" : ""}" @click=${() => this.open = this.open === o.id ? null : o.id}>
          <input type="checkbox" .checked=${this.sel.has(o.id)} @click=${(h) => h.stopPropagation()} @change=${(h) => this._toggle(o.id, h.target.checked)}>
          <span>${this._when(o.ts)}</span><span class="c2"><b>${zP[o.kind] || o.kind}</b> · ${o.entities.length} entit${o.entities.length === 1 ? "y" : "ies"}</span>
          <span class="c3 r muted">${o.kind === "disable" || o.kind === "reset_retention" ? "n/a" : q(o.est_bytes)}</span>
          <span class="c4 r muted" title=${o.backup_files ? `${o.backup_files} backup file${o.backup_files === 1 ? "" : "s"} on disk` : "No backup files on disk for this action"}>${o.backup_files ? q(o.backup_bytes) : "–"}</span>
          <span class="c5"><span class="chip ${o.status}">${FP[o.status] || o.status}</span>${(u = (l = (s = o.meta) == null ? void 0 : s.health) == null ? void 0 : l.broken) != null && u.length && o.status !== "undone" ? k`<ha-icon class="healthwarn" icon="mdi:alert" title=${`${o.meta.health.broken.length} other entities have been unavailable ever since this. Open it for details.`}></ha-icon>` : G}</span>
          <span>${this._undoable(o) ? k`<button ?disabled=${this.busy} @click=${(h) => {
        h.stopPropagation(), this.dispatchEvent(new CustomEvent("undo", { detail: o }));
      }}>Undo</button>` : G}</span></div>
        ${this.open === o.id ? this._detail(o) : G}`;
    })}</div>` : k`<div class="tablewrap"><div class="empty">No actions yet. Select entities on the Entities tab and choose an action; every change is recorded here so it can be undone.</div></div>`}
      ${this._dlg()}`;
  }
}
kt(Sc, "properties", {
  actions: { attribute: !1 },
  busy: { type: Boolean },
  ws: { attribute: !1 },
  open: { state: !0 },
  sel: { state: !0 },
  usage: { state: !0 },
  dlg: { state: !0 },
  err: { state: !0 }
}), kt(Sc, "styles", Ir`
    :host{display:block}
    .muted{color:var(--secondary-text-color);font-size:12px}
    .info{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;border:1px solid var(--secondary-text-color);color:var(--secondary-text-color);font-size:11px;font-style:italic;font-family:serif;cursor:help;vertical-align:middle}
    .card{border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color);padding:10px 14px;margin-bottom:10px;font-size:13px;display:flex;gap:14px;flex-wrap:wrap;align-items:center}
    .card .sp{flex:1}
    .tablewrap{border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color);overflow:hidden}
    .row{display:grid;grid-template-columns:28px 140px minmax(0,1fr) 100px 110px 120px 80px;gap:8px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--divider-color)}
    .row.head{font-size:12px;color:var(--secondary-text-color);background:var(--secondary-background-color)}
    .healthwarn{--mdc-icon-size:18px;color:var(--warning-color,#ff9800);vertical-align:middle;margin-left:6px}
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
    @media (max-width:760px){.row{grid-template-columns:28px minmax(0,1fr) auto}.c3,.c4,.c5{display:none}}`);
customElements.define("db-history", Sc);
const qP = [["states", "State history"], ["statistics", "Hourly statistics"], ["short_term", "5-minute statistics"]], KP = [25, 50, 100];
class Tc extends pe {
  constructor() {
    super(), this.kind = "states", this.size = 25, this.page = 0, this._cursors = [null], this.sel = null, this._all = /* @__PURE__ */ new Set();
  }
  connectedCallback() {
    super.connectedCallback(), this._load(0);
  }
  async _load(t) {
    var e;
    this.loading = !0, this.error = null;
    try {
      const i = await this.ws("entity_rows", { entity_id: this.entityId, kind: this.kind, limit: this.size, ...this._cursors[t] ? { cursor: this._cursors[t] } : {} });
      t === 0 && (this._total = i.total), this._cursors[t + 1] = i.next, this.data = i, this.page = t, this.sel = ((e = i.rows[0]) == null ? void 0 : e.id) ?? null;
    } catch (i) {
      this.error = i.message || JSON.stringify(i);
    }
    this.loading = !1;
  }
  _tab(t) {
    this.kind = t, this._cursors = [null], this.data = null, this._load(0);
  }
  _resize(t) {
    this.size = t, this._cursors = [null], this._load(0);
  }
  _t(t) {
    return t == null ? "" : new Date(t * 1e3).toLocaleString([], { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
  _n(t) {
    return t == null ? "" : Math.abs(t) >= 1e3 ? t.toLocaleString(void 0, { maximumFractionDigits: 2 }) : String(Math.round(t * 1e3) / 1e3);
  }
  _v(t, e) {
    if (t === null || typeof t != "object") return String(t);
    const i = this._all.has(e);
    return k`<button class="jall" @click=${() => {
      const n = new Set(this._all);
      i ? n.delete(e) : n.add(e), this._all = n;
    }}>${i ? "Collapse all" : "Expand all"}</button>${this._jv(t, i, 0, !0)}`;
  }
  // Collapsible JSON: the top level and its first item start open; "Expand all" opens everything.
  _jv(t, e, i, n) {
    if (t === null || typeof t != "object") return k`<span class="j-${t === null ? "null" : typeof t}">${JSON.stringify(t)}</span>`;
    const a = Array.isArray(t), o = a ? t.map((l, u) => [u, l]) : Object.entries(t);
    if (!o.length) return k`<span class="j-null">${a ? "[]" : "{}"}</span>`;
    const s = o.slice(0, 3).map(([l, u]) => (a ? "" : `${l}: `) + (typeof u == "object" && u ? Array.isArray(u) ? "[…]" : "{…}" : JSON.stringify(u))).join(", ");
    return k`<details ?open=${e || i === 0 || i === 1 && n}><summary>${a ? `Array(${o.length})` : `Object(${o.length})`} <span class="muted">${s}${o.length > 3 ? ", …" : ""}</span></summary>
      <div class="jc">${o.map(([l, u], h) => k`<div><span class="jk">${l}</span>: ${this._jv(u, e, i + 1, h === 0)}</div>`)}</div></details>`;
  }
  _pick(t) {
    this.sel = t;
  }
  _key(t) {
    var a;
    const e = ((a = this.data) == null ? void 0 : a.rows) || [], i = e.findIndex((o) => o.id === this.sel), n = t.key === "ArrowDown" ? Math.min(e.length - 1, i + 1) : t.key === "ArrowUp" ? Math.max(0, i - 1) : -1;
    n >= 0 && (t.preventDefault(), this.sel = e[n].id, this.updateComplete.then(() => {
      var o;
      return (o = this.renderRoot.querySelector("tr.on")) == null ? void 0 : o.scrollIntoView({ block: "nearest" });
    }));
  }
  _list(t) {
    return k`<table><thead><tr><th>Updated</th><th>State</th><th class="num" title="How many attributes are stored with this row">Attrs</th></tr></thead><tbody>
      ${t.map((e) => {
      const i = e.state === "unavailable" || e.state === "unknown";
      return k`<tr class="r ${e.id === this.sel ? "on" : ""}" @click=${() => this._pick(e.id)}>
          <td class="time">${this._t(e.ts)}</td><td><span class="st ${i ? "dim" : ""}">${e.state}</span></td><td class="num">${Object.keys(e.attributes).length}</td></tr>`;
    })}</tbody></table>`;
  }
  _grid(t) {
    return k`<table class="grid"><thead><tr><th>${this.kind === "short_term" ? "Period start" : "Hour"}</th><th class="num">Mean</th><th class="num">Min</th><th class="num">Max</th><th class="num">State</th><th class="num">Sum</th></tr></thead><tbody>
      ${t.map((e) => k`<tr><td class="time">${this._t(e.ts)}</td><td class="num">${this._n(e.mean)}</td><td class="num">${this._n(e.min)}</td><td class="num">${this._n(e.max)}</td><td class="num">${this._n(e.state)}</td><td class="num">${this._n(e.sum)}</td></tr>`)}</tbody></table>`;
  }
  _detail(t) {
    if (!t) return k`<div class="muted">Select a row to see everything stored for it.</div>`;
    if (this.kind === "states") {
      const e = Object.keys(t.attributes);
      return k`<h4>${this._t(t.ts)}</h4><div class="kv">
        <i>state</i><span class="st">${t.state}</span>
        <i>last_updated</i><span>${this._t(t.ts)}</span>
        <i>last_changed</i><span>${this._t(t.changed_ts)}</span>
        <div class="sep"></div>
        ${e.length ? e.map((i) => k`<i>${i}</i><span>${this._v(t.attributes[i], `${t.id}:${i}`)}</span>`) : k`<i>attributes</i><span class="muted">none</span>`}
        <div class="sep"></div>
        <i>stored attribute size</i><span>${q(t.attr_bytes)} <span class="muted">(shared with other rows that have the same attributes)</span></span>
        <i>row id</i><span>${t.id}</span></div>`;
    }
  }
  render() {
    const t = this.data, e = (t == null ? void 0 : t.rows) || [], i = this.page * this.size + 1, n = this.page * this.size + e.length;
    return k`<div class="dlg" @click=${(a) => a.stopPropagation()}>
      <header><span class="ico">${Vs(this.hass, this.entityId)}</span>
        <div class="t"><b>${this.name || this.entityId}</b><div class="muted">${this.entityId} · what the recorder has stored, newest first${this.kind === "states" ? ". Pick a row to see all of it." : ""}</div></div>
        <button class="x" title="Close" @click=${() => this.dispatchEvent(new CustomEvent("close"))}>✕</button></header>
      <div class="tabs">${qP.map(([a, o]) => k`<button class=${this.kind === a ? "on" : ""} @click=${() => this._tab(a)}>${o}</button>`)}</div>
      ${this.error || !t || !e.length ? k`<div class="body" style="display:block"><div class="empty">${this.error ? this.error : t ? this.kind === "states" ? "No state history is stored for this entity (it may be older than the recorder retention, or excluded)." : "No statistics are stored for this entity." : "Loading…"}</div></div>` : this.kind !== "states" ? k`<div class="body" style="display:block;overflow:auto"><div style="padding:0 18px">${this._grid(e)}</div></div>` : k`<div class="body"><div class="list" tabindex="0" @keydown=${(a) => this._key(a)}>${this._list(e)}</div><div class="detail">${this._detail(e.find((a) => a.id === this.sel))}</div></div>`}
      <footer>
        <button ?disabled=${this.page === 0 || this.loading} @click=${() => this._load(this.page - 1)}>‹ Newer</button>
        <button ?disabled=${!(t != null && t.next) || this.loading} @click=${() => this._load(this.page + 1)}>Older ›</button>
        <span class="muted">${e.length ? `Rows ${i.toLocaleString()}–${n.toLocaleString()}` : ""}${this._total != null ? ` of ${this._total.toLocaleString()}` : ""}${this.loading ? " · loading…" : ""}</span>
        <span style="flex:1"></span><span class="muted">Rows per page</span>
        <select @change=${(a) => this._resize(+a.target.value)}>${KP.map((a) => k`<option value=${a} ?selected=${this.size === a}>${a}</option>`)}</select></footer>
    </div>`;
  }
}
kt(Tc, "properties", {
  entityId: { type: String },
  name: { type: String },
  hass: { attribute: !1 },
  ws: { attribute: !1 },
  kind: { state: !0 },
  size: { state: !0 },
  page: { state: !0 },
  data: { state: !0 },
  loading: { state: !0 },
  sel: { state: !0 },
  _all: { state: !0 },
  error: { state: !0 }
}), kt(Tc, "styles", Ir`
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
    @media (max-width:800px){.body{grid-template-columns:1fr;overflow:auto}.list{max-height:40vh;padding:0 12px}.detail{border-left:none;border-top:1px solid var(--divider-color)}}`);
customElements.define("db-inspect", Tc);
const Uo = (r) => r == null ? "Indefinitely" : r < 12 ? `${r} months` : r % 12 ? `${(r / 12).toFixed(1)} years` : `${r / 12} year${r === 12 ? "" : "s"}`, Wi = (r) => `${Math.round(r).toLocaleString()} rows`, eh = (r) => k`<span class="tip" tabindex="0"><span class="info">?</span><span class="pop">${r}</span></span>`, rh = (r, t) => (r || []).slice(Math.max(0, t)).reduce((e, i) => e + i, 0);
class Cc extends pe {
  updated(t) {
    t.has("cfg") && this.cfg && !this._init && (this._init = !0, this._reset(), this._predict());
  }
  _reset() {
    const t = this.cfg;
    this.days = t.recorder.running_days, this.stats = t.stats_keep_months, this.energy = t.energy_stats_keep_months;
  }
  async _predict() {
    try {
      this.pred = await this.ws("settings_predict");
    } catch (t) {
      this.err = t.message || JSON.stringify(t);
    }
  }
  async _save(t, e) {
    this.busy = !0, this.err = null;
    try {
      const i = await this.ws("settings_set", t);
      this.dispatchEvent(new CustomEvent("saved", { detail: i })), this.cfg = i, this.msg = e, "stats_keep_months" in t && (this.stats = i.stats_keep_months, this.energy = i.energy_stats_keep_months);
    } catch (i) {
      this.err = i.message || JSON.stringify(i);
    }
    this.busy = !1, this.ask = null;
  }
  // --- state history -------------------------------------------------------------------------
  _statesPred(t) {
    var o;
    const e = (o = this.pred) == null ? void 0 : o.states, i = this.cfg.recorder.running_days;
    if (!e) return k`<div class="pred">Working out what this would change…</div>`;
    const n = e.bytes_per_row, a = (s) => n ? `about ${q(s * n)} (${Wi(s)})` : Wi(s);
    if (t < i) {
      const s = rh(e.hist, t);
      return k`<div class="pred free">Frees ${a(s)}: the states older than ${t} day${t === 1 ? "" : "s"}. They are deleted by Home Assistant's nightly purge after the restart; Reclaim free space then returns the room to the disk.</div>`;
    }
    if (t > i) {
      const s = e.rate_per_day * (t - i);
      return k`<div class="pred grow">Grows by ${a(s)} over the next ${t - i} days, at the last week's pace (${Wi(e.rate_per_day)} a day), then stays about level.</div>`;
    }
    return k`<div class="pred">No change from what Home Assistant keeps now (${Wi(e.rows)}${n ? `, about ${q(e.rows * n)}` : ""}).</div>`;
  }
  _statesCard() {
    const t = this.cfg.recorder, e = t.running_days, i = Math.max(30, e), n = `recorder:
  purge_keep_days: ${this.days}`;
    return k`<div class="card"><h3>State history (default retention)${eh(k`<p>How many days of detailed states Home Assistant keeps for every entity: its <code>recorder: purge_keep_days</code> setting (10 days if it is not set).</p>
        <p>This page does not change your configuration. Pick a value to see its effect, then set it in your YAML yourself and restart Home Assistant.</p>
        <p>Entities with their own retention rule keep their rule when it is shorter.</p>`)}</h3>
      <p class="muted">Home Assistant is running with ${e} day${e === 1 ? "" : "s"}.</p>
      <div class="row"><input type="range" min="1" max=${i} .value=${String(this.days)} @input=${(a) => this.days = +a.target.value}>
        <span class="val">${this.days} day${this.days === 1 ? "" : "s"}</span></div>
      ${this._statesPred(this.days)}
      ${this.days !== e ? k`<div class="yaml"><p>To use ${this.days} days, set this in your <code>configuration.yaml</code> (or wherever your <code>recorder:</code> configuration is), then restart Home Assistant:</p>
        <pre>${n}</pre>
        <div class="row"><button class="b" @click=${() => this._copy(n)}>${this.copied ? "Copied" : "Copy"}</button>
          <a class="link" href="https://www.home-assistant.io/integrations/recorder/#purge_keep_days" target="_blank" rel="noreferrer">Recorder documentation</a>
          <span style="flex:1"></span>
          <button class="b" @click=${() => this.days = e}>Undo change</button>
          <button class="b" @click=${() => this.ask = { restart: !0 }}>Restart…</button></div></div>` : G}</div>`;
  }
  async _copy(t) {
    try {
      await navigator.clipboard.writeText(t), this.copied = !0, setTimeout(() => this.copied = !1, 1500);
    } catch {
      this.err = "Copy failed: select the text and copy it yourself.";
    }
  }
  // --- long-term statistics ------------------------------------------------------------------
  _steps() {
    return [...this.cfg.month_steps, null];
  }
  _stepper(t, e) {
    const i = this._steps(), n = i.indexOf(t);
    return k`<span class="step"><button ?disabled=${n <= 0} aria-label="Shorter" @click=${() => e(i[n - 1])}>−</button><span>${Uo(t)}</span>
      <button ?disabled=${n >= i.length - 1} aria-label="Longer" @click=${() => e(i[n + 1])}>+</button></span>`;
  }
  _statsPred(t, e) {
    var h;
    const i = (h = this.pred) == null ? void 0 : h.statistics;
    if (!i) return k`<div class="pred">Working out what this would change…</div>`;
    const n = i.bytes_per_row, a = rh(t, 0), o = (c) => n ? `about ${q(c * n)}` : Wi(c), s = (t == null ? void 0 : t.length) > 1 ? t[1] : (t == null ? void 0 : t[0]) || 0;
    if (e == null) return k`<div class="pred">Keeps everything: ${o(a)} now, growing by ${o(s * 12)} a year.</div>`;
    const l = rh(t, e), u = a - l;
    return k`<div class="pred ${l ? "free" : ""}">${l ? k`Frees ${o(l)} at the next monthly run, keeping ${o(u)}.` : k`Frees nothing yet: you have less than ${Uo(e)} of these (${o(a)}).`}
      Will likely grow to around ${s && n ? q(s * e * n) : Wi(s * e)}.</div>`;
  }
  _statsCard() {
    var o;
    const t = this.cfg, e = (o = this.pred) == null ? void 0 : o.statistics, i = t.retention, n = this.stats !== t.stats_keep_months || this.energy !== t.energy_stats_keep_months, a = t.last_stats_trim;
    return k`<div class="card"><h3>Long-term statistics${eh(k`<p>Hourly averages and totals behind history graphs beyond the state history, and the Energy dashboard. Home Assistant keeps them forever.</p>
        <p>A limit here deletes older hourly rows once a month, in the first nightly retention run of the month${i.run_at ? ` (at ${i.run_at})` : ""}. Deleted rows are not backed up.</p>
        <p>Energy dashboard statistics have their own setting, so you can keep them longer to compare years.</p>`)}</h3>
      ${i.run_at ? G : k`<div class="warn">The nightly retention run is off in the integration options, so limits here are only applied by Run retention now.</div>`}
      <div class="row"><span class="lab"><b>All other statistics</b></span>${this._stepper(this.stats, (s) => this.stats = s)}</div>
      ${this._statsPred(e == null ? void 0 : e.other, this.stats)}
      <div class="row" style="margin-top:14px"><span class="lab"><b>Energy dashboard statistics</b><div class="muted">${e ? k`<a class="link" title="List them on the Entities tab" @click=${() => this.dispatchEvent(new CustomEvent("goto-filter", { detail: { used_in: ["Energy dashboard"] } }))}>${e.energy_count} statistic${e.energy_count === 1 ? "" : "s"} used by the Energy dashboard</a>` : ""}</div></span>${this._stepper(this.energy, (s) => this.energy = s)}</div>
      ${this._statsPred(e == null ? void 0 : e.energy, this.energy)}
      ${a ? k`<p class="muted">Last applied ${new Date(a.ts * 1e3).toLocaleString()}: ${a.rows.toLocaleString()} rows deleted.</p>` : G}
      <div class="row"><button class="b" ?disabled=${!n} @click=${() => {
      this.stats = t.stats_keep_months, this.energy = t.energy_stats_keep_months;
    }}>Undo change</button>
        <button class="b go" ?disabled=${this.busy || !n} @click=${() => this.ask = { stats: this.stats, energy: this.energy }}>Save…</button></div></div>`;
  }
  _dialog() {
    const t = this.ask;
    if (!t) return G;
    const e = this.cfg.retention;
    let i, n, a, o = "Save", s = !1;
    if (t.restart)
      i = "Restart Home Assistant?", n = k`Save your YAML change first. Home Assistant checks the configuration, restarts and is unavailable for a minute or two.`, o = "Restart", a = async () => {
        this.ask = null, await this.hass.callService("homeassistant", "restart");
      };
    else {
      const l = e.next_run ? new Date(e.next_run * 1e3).toLocaleString() : "the next Run retention now", u = t.stats != null && (this.cfg.stats_keep_months == null || t.stats < this.cfg.stats_keep_months) || t.energy != null && (this.cfg.energy_stats_keep_months == null || t.energy < this.cfg.energy_stats_keep_months);
      s = u, i = "Change long-term statistics retention?", n = k`All other statistics: <b>${Uo(t.stats)}</b>. Energy dashboard statistics: <b>${Uo(t.energy)}</b>.<br>
        ${u ? k`Older hourly statistics are <b>deleted permanently</b> (no backup) at ${l}, then once a month.` : k`Nothing is deleted by this change.`}`, a = () => this._save({ stats_keep_months: t.stats, energy_stats_keep_months: t.energy }, "Saved long-term statistics retention.");
    }
    return k`<div class="modal" @click=${() => this.ask = null}><div class="dlg" @click=${(l) => l.stopPropagation()}><h3>${i}</h3><div style="font-size:13px">${n}</div>
      <div class="row"><button class="b" @click=${() => this.ask = null}>Cancel</button><button class="b go" style=${s ? "background:var(--error-color,#db4437);border-color:var(--error-color,#db4437)" : ""} ?disabled=${this.busy} @click=${a}>${o}</button></div></div></div>`;
  }
  render() {
    const t = this.cfg;
    return t ? k`
      ${this.err ? k`<div class="warn err">${this.err}</div>` : G}
      ${this.msg ? k`<div class="warn ok">${this.msg} <button class="b" style="margin-left:8px" @click=${() => this.msg = null}>Dismiss</button></div>` : G}
      <div class="card"><h3>Display</h3>
        <label class="chk"><input type="checkbox" .checked=${t.hide_automations} ?disabled=${this.busy}
          @change=${(e) => this._save({ hide_automations: e.target.checked }, null)}>
          <span><b>Hide automations</b>${eh(k`Leaves automation entities out of the Overview figures and charts and the Entities list. Pick Automation in the Type filter to list them anyway.`)}</span></label></div>
      ${this._statesCard()}
      ${this._statsCard()}
      ${this._dialog()}` : k`<div class="muted">Loading settings…</div>`;
  }
}
kt(Cc, "properties", {
  hass: { attribute: !1 },
  ws: { attribute: !1 },
  cfg: { attribute: !1 },
  pred: { state: !0 },
  days: { state: !0 },
  stats: { state: !0 },
  energy: { state: !0 },
  ask: { state: !0 },
  copied: { state: !0 },
  busy: { state: !0 },
  msg: { state: !0 },
  err: { state: !0 }
}), kt(Cc, "styles", Ir`
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
    .yaml{margin-top:10px} pre{margin:6px 0;padding:8px 10px;border-radius:8px;background:var(--secondary-background-color);font-size:12px;user-select:all;overflow-x:auto}
    a.link{color:var(--primary-color);cursor:pointer;text-decoration:none} a.link:hover{text-decoration:underline}`);
customElements.define("db-settings", Cc);
const jP = [1, 3, 5, 7, "default"];
class Ac extends pe {
  constructor() {
    super(), this.tab = "overview", this.window = null, this.days = 0, this.filters = {}, this.search = "", this.sort = "size", this.selected = /* @__PURE__ */ new Set(), this.shown = 100, this.usage = null, this.history = [], this.expand = [], this.hideAuto = !0;
  }
  _ws(t, e = {}) {
    return this.hass.connection.sendMessagePromise({ type: `db_storage/${t}`, ...e });
  }
  updated(t) {
    t.has("hass") && this.hass && !this._started && (this._started = !0, this._loadAll());
  }
  connectedCallback() {
    super.connectedCallback(), this._tick = setInterval(() => this.now = Date.now(), 3e4), this._close = () => {
      this.menuOpen = !1;
    }, window.addEventListener("click", this._close);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this._tick), window.removeEventListener("click", this._close);
  }
  _scanLabel() {
    if (!(this.all || this.data)) return "";
    const e = Math.max(0, Math.round(Date.now() / 1e3 - this._scanTs));
    return `Last scanned ${jb(e)}`;
  }
  // True after an action or undo until the next scan: the sizes on screen no longer match the database.
  _needsResync() {
    var t, e;
    return !!this.resync || (((t = this.all) == null ? void 0 : t.stale_count) || ((e = this.data) == null ? void 0 : e.stale_count) || 0) > 0;
  }
  _scanTip() {
    var i, n;
    const t = this.data || this.all;
    if (!t) return "";
    const e = new Date(this._scanTs * 1e3).toLocaleString();
    return this.resync && !((i = this.all) != null && i.stale_count || (n = this.data) != null && n.stale_count) ? `Retention deleted old states since the last scan at ${e}, so sizes are out of date. Press Re-Scan to refresh them.` : this._needsResync() ? `${(this.all || this.data).stale_count} entit${(this.all || this.data).stale_count === 1 ? "y was" : "ies were"} changed by an action since the last scan at ${e}, so their sizes show ⟳. Re-Scan refreshes just those and anything new.` : `Last scanned ${e}${t.from_disk ? " (saved from before the last restart)" : ""}
${t.match_count.toLocaleString()} entities match the current filters · ${q(t.match_bytes)} estimated
The scan took ${(t.timings_ms.total_ms / 1e3).toFixed(1)} s`;
  }
  async _openReclaim() {
    this.reclaim = { phase: "confirm", before: null };
    try {
      this.reclaim = { phase: "confirm", before: await this._ws("db_size", { expired: !0 }) };
    } catch (t) {
      this.error = t.message, this.reclaim = null;
    }
  }
  async _startReclaim() {
    const t = this.reclaim.before;
    this.reclaim = { phase: "running", before: t, now: t, started: Date.now() };
    try {
      await this._ws("reclaim", { confirm: !0 });
    } catch (a) {
      this.error = a.message || JSON.stringify(a), this.reclaim = null;
      return;
    }
    const e = t.free_bytes != null, i = Math.max(1048576, (t.free_bytes || 0) * 0.05);
    for (let a = 0; a < (e ? 300 : 90); a++) {
      await new Promise((o) => setTimeout(o, 4e3));
      try {
        const o = await this._ws("db_size");
        if (this.reclaim = { ...this.reclaim, now: o }, this.live = o, e ? (o.free_bytes ?? 0) <= i : o.file_bytes < t.file_bytes * 0.99) break;
      } catch {
      }
    }
    let n = this.reclaim.now;
    try {
      n = await this._ws("db_size", { checkpoint: !0 }), await this._ws("sample_now"), await this._loadHistory();
    } catch {
    }
    this.live = n, this.reclaim = { ...this.reclaim, now: n, phase: "done" };
  }
  _reclaimUi() {
    var n;
    const t = this.reclaim;
    if (!t) return "";
    const e = t.before && t.now ? t.before.file_bytes - t.now.file_bytes : 0, i = t.before && t.before.free_bytes != null && t.before.free_bytes < 1048576 && !t.before.expired_rows;
    return t.phase === "confirm" ? k`<div class="modal" @click=${() => this.reclaim = null}><div class="dlg" @click=${(a) => a.stopPropagation()}>
      <h3>Reclaim free space</h3>
      <div>${t.before ? k`The database is <b>${q(t.before.file_bytes)}</b>${t.before.free_bytes != null ? k` with <b>${q(t.before.free_bytes)}</b> of empty space` : ""}.${t.before.expired_rows ? k` The repack also deletes states older than the recorder's ${t.before.keep_days}-day limit: ${t.before.expired_rows.toLocaleString()} rows${t.before.expired_bytes ? `, about ${q(t.before.expired_bytes)}` : ""}.` : ""}` : "Checking the file…"}
        ${i && !((n = t.before) != null && n.expired_rows) ? "Too little to be worth a repack." : ""}</div>
      <ul><li>It can take several minutes on a small device, and recorder writes queue up meanwhile (nothing is lost).</li>
        <li>It needs free disk space roughly equal to the database size while it runs.</li>
        <li>Only do this when little else is going on; Home Assistant keeps running.</li></ul>
      <div class="row"><button @click=${() => this.reclaim = null}>Cancel</button><button class="go" ?disabled=${!t.before || i} @click=${() => this._startReclaim()}>Reclaim</button></div></div></div>` : k`<div class="rcard"><h3>${t.phase === "running" ? "Reclaiming free space…" : e > 0 ? `Reclaimed ${q(e)}` : "Finished: nothing was left to reclaim"}</h3>
      <div class="sub">${t.phase === "running" ? `Database size ${q(t.before.file_bytes)}${t.now.free_bytes != null ? ` · empty space ${q(t.now.free_bytes)}` : ""} · ${Math.round((Date.now() - t.started) / 1e3)} s. The size changes only when the repack finishes; this page keeps working.` : `Database size ${q(t.before.file_bytes)} → ${q(t.now.file_bytes)}${t.before.free_bytes != null ? ` · empty space ${q(t.before.free_bytes)} → ${q(t.now.free_bytes)}` : ""}`}</div>
      ${t.phase === "done" ? k`<button style="margin-top:8px" class="rescan" @click=${() => this.reclaim = null}>Dismiss</button>` : ""}</div>`;
  }
  async _loadActions() {
    try {
      this.actionsList = await this._ws("actions", { limit: 200 });
    } catch (t) {
      this.error = t.message;
    }
    this._loadRet();
  }
  async _loadRet() {
    try {
      this.ret = await this._ws("retention_status");
    } catch {
    }
  }
  // Runs the nightly retention job now.
  async _runRetention() {
    this.menuOpen = !1, this.retBusy = !0;
    try {
      const t = await this._ws("retention_run", { confirm: !0 });
      this.notice = (t.rows ? `Retention ran: ${t.rows.toLocaleString()} old states deleted for ${t.entities} entit${t.entities === 1 ? "y" : "ies"}.` : "Retention ran: no states were older than their rule.") + (t.stats_rows != null ? ` Long-term statistics: ${t.stats_rows.toLocaleString()} old rows deleted.` : ""), t.stats_rows && (this.resync = !0), t.rows && (this.resync = !0), await this._loadActions();
    } catch (t) {
      this.error = t.message || JSON.stringify(t);
    }
    this.retBusy = !1;
  }
  // --- actions: preview, confirm, run in the background, undo -------------------------------
  async _askAction(t) {
    const e = [...this.selected];
    try {
      const i = Qn.get("days", 1), n = Qn.get("applyNow", !0), a = Qn.get("states", !0), o = t === "reduce_retention", s = await this._ws("preview_action", { kind: o && i === "default" ? "reset_retention" : t, entity_ids: e, states: a, ...o && i !== "default" ? { keep_days: i, apply_now: n } : {} });
      this.modal = { kind: t, ids: e, pv: s, states: a, text: "", days: i, applyNow: n };
    } catch (i) {
      this.error = i.message || JSON.stringify(i);
    }
  }
  // Change-retention dialog: refresh the preview after the days or the "delete now" choice changes. Choices stick.
  async _retChange(t) {
    this.modal = { ...this.modal, ...t };
    for (const a of ["days", "applyNow"]) a in t && Qn.set(a, t[a]);
    const e = this.modal, i = this._rseq = (this._rseq || 0) + 1, n = e.days === "default";
    try {
      const a = await this._ws("preview_action", { kind: n ? "reset_retention" : "reduce_retention", entity_ids: e.ids, ...n ? {} : { keep_days: e.days, apply_now: e.applyNow } });
      i === this._rseq && this.modal && (this.modal = { ...this.modal, pv: a });
    } catch (a) {
      this.error = a.message || JSON.stringify(a);
    }
  }
  async _setStates(t) {
    Qn.set("states", t), this.modal = { ...this.modal, states: t, pv: await this._ws("preview_action", { kind: this.modal.kind, entity_ids: this.modal.ids, states: t }) };
  }
  async _runAction() {
    const { kind: t, ids: e, states: i, days: n, applyNow: a } = this.modal, o = t === "reduce_retention" && n === "default" ? "reset_retention" : t;
    this.modal = null;
    const s = o === "reduce_retention" ? { keep_days: n, apply_now: a } : o === "reset_retention" ? { apply_now: !1 } : {};
    try {
      await this._ws("apply_action", { kind: o, entity_ids: e, confirm: !0, states: i, ...s });
    } catch (l) {
      this.error = l.message || JSON.stringify(l);
      return;
    }
    this.selected = /* @__PURE__ */ new Set(), this._pollJob();
  }
  _askUndo(t) {
    this.modal = { undo: t };
  }
  async _runUndo() {
    const { undo: t } = this.modal;
    this.modal = null;
    try {
      await this._ws("undo_action", { action_id: t.id, confirm: !0 });
    } catch (e) {
      this.error = e.message || JSON.stringify(e);
      return;
    }
    this._pollJob();
  }
  async _pollJob() {
    if (!this._jobPolling) {
      this._jobPolling = !0;
      try {
        for (; this.job = await this._ws("action_status"), !!this.job.running; )
          await new Promise((t) => setTimeout(t, 700));
        await this._loadActions(), this.job.error && (this.error = "Action failed: " + this.job.error), this._loadEntities(!1), this._loadLive();
      } catch (t) {
        this.error = t.message || JSON.stringify(t);
      }
      this._jobPolling = !1;
    }
  }
  _jobUi() {
    const t = this.job;
    if (!t) return "";
    const e = t.total ? Math.round(t.done / t.total * 100) : 5;
    if (t.running) return k`<div class="rcard"><h3>${t.label}…</h3><div class="sub">${t.phase} · ${t.done} of ${t.total} · ${Math.round(t.elapsed_s)} s</div>
      <div style="height:6px;border-radius:3px;background:var(--divider-color);margin-top:8px;overflow:hidden"><div style="height:100%;width:${Math.max(5, e)}%;background:var(--primary-color);transition:width .4s"></div></div></div>`;
    const i = t.result;
    return k`<div class="rcard"><h3>${t.error ? "Something went wrong" : t.label === "Undo" ? "Undo finished" : "Done"}</h3>
      <div class="sub">${t.error || (t.label === "Undo" ? `Status: ${i == null ? void 0 : i.status}.` : "Recorded in History, where you can undo it. Sizes of the changed entities are refreshed.")}</div>
      <div style="margin-top:8px"><button class="rescan" @click=${() => {
      this.tab = "history", this._loadActions(), this.job = null;
    }}>View in History</button>
        <button class="rescan" @click=${() => this.job = null}>Dismiss</button></div></div>`;
  }
  _modalUi() {
    const t = this.modal;
    if (!t) return "";
    if (t.undo) {
      const u = t.undo;
      return k`<div class="modal" @click=${() => this.modal = null}><div class="dlg" @click=${(h) => h.stopPropagation()}>
        <h3>Undo this action?</h3>
        <div>${u.summary}. Re-enables entities, restores rules, statistics and state history from the backup, then deletes the backup.</div>
        <div class="row"><button @click=${() => this.modal = null}>Cancel</button><button class="go" @click=${() => this._runUndo()}>Undo</button></div></div></div>`;
    }
    const e = t.pv, i = e.entities.length, n = t.kind === "reduce_retention", a = n && t.days === "default", o = n, s = t.kind !== "disable" && !o, l = e.entities.slice(0, 8);
    return k`<div class="modal" @click=${() => this.modal = null}><div class="dlg wide" @click=${(u) => u.stopPropagation()}>
      <h3>${e.label}: ${i} entit${i === 1 ? "y" : "ies"}</h3>
      ${n ? k`<div>Keep detailed <b>states</b> for</div>
        <div class="seg">${jP.map((u) => k`<button class=${t.days === u ? "on" : ""} @click=${() => this._retChange({ days: u })}>${u === "default" ? `default (${e.default_days}d)` : `${u}d`}</button>`)}</div>
        <div class="muted" style="margin:0 0 8px">Long-term statistics (history graphs, Energy) are not touched.</div>
        ${a ? k`<div>Back to Home Assistant's default. Nothing is deleted.</div>` : k`<label class="chk" title="Saved in a backup first, so it can be undone. If unticked, the nightly retention job deletes them without a backup."><input type="checkbox" .checked=${t.applyNow} @change=${(u) => this._retChange({ applyNow: u.target.checked })}>
          Delete older states now${e.est_bytes ? ` (${e.entities.reduce((u, h) => u + (h.rows || 0), 0).toLocaleString()} states, ${q(e.est_bytes)})` : ""}</label>`}` : s ? k`<div>Frees about <b>${q(e.est_bytes)}</b>. Backed up first; undo from History.</div>` : k`<div>Stops recording. Nothing is deleted.</div>`}
      ${s ? k`<label class="chk"><input type="checkbox" .checked=${t.states} @change=${(u) => this._setStates(u.target.checked)}>
        Also clear state history${e.est_states_bytes ? ` (${q(e.est_states_bytes)})` : ""}</label>` : ""}
      ${e.warnings.includes("no_stats") ? k`<div class="warnbox">${e.entities.filter((u) => u.no_stats).length} have no long-term statistics, so their history is gone once cleared (Undo restores it).</div>` : ""}
      ${e.warnings.includes("no_effect") ? k`<div class="warnbox">Home Assistant already keeps this few days: no change.</div>` : ""}
      ${e.warnings.includes("referenced") ? k`<div class="warnbox">Some are used in automations, dashboards or helpers and work only while enabled.</div>` : ""}
      ${e.warnings.includes("active") ? k`<div class="warnbox">Some are still active and will record again within minutes. Use "Disable + clear".</div>` : ""}
      <ul class="pl">${l.map((u) => k`<li><b>${u.name}</b>${u.notes.map((h) => k`<div class="muted">${h}</div>`)}</li>`)}
        ${i > l.length ? k`<li class="muted">and ${i - l.length} more</li>` : ""}</ul>
      ${i > 25 ? k`<div class="muted" style="margin-top:8px">Type <b>${i}</b> to confirm: <input class="conf" .value=${t.text} @input=${(u) => this.modal = { ...this.modal, text: u.target.value }}></div>` : ""}
      <div class="row"><button @click=${() => this.modal = null}>Cancel</button>
        <button class="go ${s ? "danger" : ""}" ?disabled=${i > 25 && t.text.trim() !== String(i) || n && !a && e.warnings.includes("no_effect")} @click=${() => this._runAction()}>${e.label}</button></div></div></div>`;
  }
  _toggleMenu() {
    this.dispatchEvent(new Event("hass-toggle-menu", { bubbles: !0, composed: !0 }));
  }
  async _loadAll() {
    await this._loadCfg(), await Promise.all([this._loadEntities(!1), this._loadHistory(), this._loadLive(), this._loadRet()]);
  }
  // Saved settings; Hide automations decides what the Overview and Entities count.
  async _loadCfg() {
    try {
      this.cfg = await this._ws("settings_get"), this.hideAuto = this.cfg.hide_automations;
    } catch {
    }
  }
  _cfgSaved(t) {
    const e = t.hide_automations !== this.hideAuto;
    this.cfg = t, this.hideAuto = t.hide_automations, this.ret = t.retention, e && (this.shown = 100, this._loadEntities(!1));
  }
  async _loadLive() {
    try {
      this.live = await this._ws("db_size");
    } catch {
    }
  }
  async _loadHistory() {
    try {
      this.history = await this._ws("size_history", { days: 3650 });
    } catch (t) {
      this.error = t.message;
    }
  }
  async _loadEntities(t) {
    try {
      const e = await this._ws("entities", { filters: this.filters, search: this.search, expand: this.expand, exclude_domains: this._exclude(), refresh: t, limit: 5e3, ...this.window ? { window: this.window } : {} });
      this.error = null, e.no_data ? (this.data = null, this.all = null) : (this.data = e, this._scanTs = Date.now() / 1e3 - e.scan_age_s, !Object.values(this.filters).some((i) => i.length) && !this.search && !this.window ? this.all = e : this.all = await this._ws("entities", { filters: {}, search: "", refresh: !1, limit: 5e3, exclude_domains: this.hideAuto ? ["automation"] : [] })), (e.no_data || e.scanning || t) && this._poll(), await this.updateComplete, requestAnimationFrame(() => this.chipsIn = !0);
    } catch (e) {
      this.error = e.message || JSON.stringify(e);
    }
  }
  // Polls scan progress until the background scan finishes, then reloads the results.
  async _poll() {
    var t;
    if (!this._polling) {
      this._polling = !0;
      try {
        for (; ; ) {
          const e = await this._ws("scan_status");
          if (this.progress = e, !e.running) break;
          await new Promise((i) => setTimeout(i, 700));
        }
        (t = this.progress) != null && t.error ? this.error = "Scan failed: " + this.progress.error : (this.progress = null, this.error = null, this.resync = !1, await this._loadEntities(!1), await this._loadHistory(), await this._loadLive());
      } catch (e) {
        this.error = e.message || JSON.stringify(e), this.progress = null;
      }
      this._polling = !1;
    }
  }
  // The "Referenced in" panel shows one entity, or the combined places of everything ticked while it is open.
  // Automations are hidden (Settings > Hide automations) unless picked in the Type filter.
  _exclude() {
    return this.hideAuto && !(this.filters.domain || []).includes("automation") ? ["automation"] : [];
  }
  async _loadUsage(t) {
    if (t !== void 0 && (this._usageFor = t), !this._usageFor && !this.usage) {
      this.usage = null;
      return;
    }
    if (t === null) {
      this._usageFor = null, this.usage = null;
      return;
    }
    try {
      this.usage = this.selected.size ? await this._ws("usage", { entity_ids: [...this.selected] }) : await this._ws("usage", { entity_id: this._usageFor });
    } catch (e) {
      this.error = e.message;
    }
  }
  _filters(t) {
    this.filters = t, this.shown = 100, this._loadEntities(!1);
  }
  _go(t) {
    history.pushState(null, "", t), window.dispatchEvent(new Event("location-changed"));
  }
  // How much the database file changed across the selected period, from the hourly/daily samples.
  _growth() {
    const t = this.history || [];
    if (!this.window || t.length < 2) return null;
    const [e, i] = this.window, n = [...t].reverse().find((o) => o.ts <= e) || t[0], a = t.find((o) => o.ts >= i) || t.at(-1);
    return a.ts > n.ts ? a.file_bytes - n.file_bytes : null;
  }
  _chips() {
    const t = Object.entries(this.filters).flatMap(([e, i]) => i.map((n) => [e, n]));
    return !t.length && !this.search && !this.window ? "" : k`<span class="chips ${this.chipsIn ? "in" : "pending"}" title="Filters apply to the Entities tab">
      ${this.window ? k`<span class="fchip" title="Only entities that wrote data in this period" @click=${() => {
      this.window = null, this.shown = 100, this._loadEntities(!1);
    }}>Period: ${RP(...this.window)}${this._growth() != null ? ` (${this._growth() >= 0 ? "+" : "-"}${q(Math.abs(this._growth()))})` : ""} ✕</span>` : ""}
      ${this.search ? k`<span class="fchip" @click=${() => {
      this.search = "", this.shown = 100, this._loadEntities(!1);
    }}>Search: ${this.search} ✕</span>` : ""}
      ${t.map(([e, i]) => k`<span class="fchip" @click=${() => {
      this._filters({ ...this.filters, [e]: this.filters[e].filter((n) => n !== i) });
    }}>${Kb[e] || e}: ${i} ✕</span>`)}
      <span class="fchip clear" @click=${() => {
      this.search = "", this.window = null, this._filters({});
    }}>Clear all</span></span>`;
  }
  render() {
    var e, i, n, a, o, s, l, u, h;
    const t = [["overview", "Overview"], ["entities", "Entities"], ["history", "History"], ["settings", "Settings"]];
    return k`<div class="wrap">
      <h2>${this.narrow ? k`<button class="menu" @click=${this._toggleMenu}>☰</button>` : ""}DB Storage${this._chips()}
        ${this.all || this.data ? k`<span class="scan"><span class="lastscan ${this._needsResync() ? "need" : ""}" title=${this._scanTip()}>${this._needsResync() ? "Re-Scan needed" : this._scanLabel()}</span>
          <span class="split">
            <button class="rescan main ${this._needsResync() ? "need" : ""}" ?disabled=${!!((e = this.progress) != null && e.running)} aria-label="Re-Scan"
              title="Re-Scan: re-reads the database and your configuration from scratch (table and entity sizes, last update times, new entities, and where each entity is used). Takes several seconds; the page keeps working meanwhile. After an action only the entities it changed are refreshed, automatically."
              @click=${() => this._loadEntities(!0)}>
              <svg viewBox="0 0 24 24" width="18" height="18" class=${(i = this.progress) != null && i.running ? "spin" : ""}><path fill="currentColor" d="M17.65 6.35A7.96 7.96 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"/></svg></button>
            <button class="rescan arrow" aria-label="More actions" title="More actions" @click=${(c) => {
      c.stopPropagation(), this.menuOpen = !this.menuOpen;
    }}>
              <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg></button>
            ${this.menuOpen ? k`<div class="menu-pop" @click=${(c) => c.stopPropagation()}>
              <button @click=${() => {
      this.menuOpen = !1, this._loadEntities(!0);
    }}><b>Re-Scan</b><span>Refresh the sizes and where entities are used.</span></button>
              <div><button ?disabled=${!((n = this.ret) != null && n.rules || (a = this.ret) != null && a.stats_limits) || this.retBusy || ((o = this.job) == null ? void 0 : o.running)} @click=${() => this._runRetention()}><b>Run retention now</b><span>${(s = this.ret) != null && s.rules || (l = this.ret) != null && l.stats_limits ? "Deletes states older than each rule now (and long-term statistics past their limit, if not yet done this month)." : "No retention rules or statistics limits yet."}</span></button></div>
              <button @click=${() => {
      this.menuOpen = !1, this._openReclaim();
    }}><b>Reclaim free space…</b><span>Repack the database so space freed by deletions goes back to the disk.</span></button></div>` : ""}</span></span>` : ""}</h2>
      <div class="tabs">${t.map(([c, f]) => k`<button class=${this.tab === c ? "on" : ""} @click=${() => {
      this.tab = c, c === "history" && this._loadActions(), c === "settings" && this._loadCfg();
    }}>${f}</button>`)}</div>
      ${this.error ? k`<div class="err">${this.error}</div>` : ""}
      ${this._reclaimUi()}
      ${this.notice ? k`<div class="rcard"><h3>Retention</h3><div class="sub">${this.notice}</div><div style="margin-top:8px"><button class="rescan" @click=${() => this.notice = null}>Dismiss</button></div></div>` : ""}
      ${this._jobUi()}
      ${this._modalUi()}
      ${this.inspect ? k`<db-inspect .hass=${this.hass} .ws=${(c, f) => this._ws(c, f)} .entityId=${this.inspect.entity_id} .name=${this.inspect.name} @close=${() => this.inspect = null} @click=${() => this.inspect = null}></db-inspect>` : ""}
      ${this.progress ? k`<db-progress .status=${this.progress} .first=${!this.data}></db-progress>` : ""}
      ${this.tab === "overview" ? k`<db-overview .live=${this.live} .ret=${this.ret} .hass=${this.hass} .data=${this.all} .history=${this.history} .days=${this.days} .window=${this.window}
          @days=${(c) => {
      this.days = c.detail;
    }}
          @goto-entity=${(c) => {
      this.search = c.detail, this.filters = {}, this.window = null, this.tab = "entities", this.shown = 100, this.chipsIn = !1, this._loadEntities(!1);
    }}
          @goto-window=${(c) => {
      this.window = c.detail, this.search = "", this.filters = {}, this.tab = "entities", this.shown = 100, this.chipsIn = !1, this._loadEntities(!1);
    }}
          @goto-filter=${(c) => {
      this.search = "", this.window = null, this.filters = c.detail, this.tab = "entities", this.shown = 100, this.chipsIn = !1, this._loadEntities(!1);
    }}></db-overview>` : ""}
      ${this.tab === "entities" ? k`<db-entities .hass=${this.hass} .data=${this.data} .filters=${this.filters} .search=${this.search} .sort=${this.sort} .expand=${this.expand} 
          .selected=${this.selected} .shown=${this.shown} .usage=${this.usage} .growth=${this._growth()} .busy=${!!((u = this.progress) != null && u.running)}
          @clearwindow=${() => {
      this.window = null, this.shown = 100, this._loadEntities(!1);
    }} @filters=${(c) => this._filters(c.detail)} @expand=${(c) => {
      const f = new Set(this.expand);
      c.detail.on ? f.add(c.detail.facet) : f.delete(c.detail.facet), this.expand = [...f], this._loadEntities(!1);
    }} @search=${(c) => {
      this.search = c.detail, this.shown = 100, this._loadEntities(!1);
    }}
          @sort=${(c) => this.sort = c.detail} @selected=${(c) => {
      this.selected = c.detail, this.usage && this._loadUsage();
    }} @more=${() => this.shown += 100}
          @action=${(c) => this._askAction(c.detail)} @inspect=${(c) => this.inspect = c.detail} @refresh=${() => this._loadEntities(!0)} @usage=${(c) => this._loadUsage(c.detail)} @navigate=${(c) => this._go(c.detail)}></db-entities>` : ""}
      ${this.tab === "settings" ? k`<db-settings .hass=${this.hass} .ws=${(c, f) => this._ws(c, f)} .cfg=${this.cfg} @saved=${(c) => this._cfgSaved(c.detail)}
          @goto-filter=${(c) => {
      this.search = "", this.window = null, this.filters = c.detail, this.tab = "entities", this.shown = 100, this.chipsIn = !1, this._loadEntities(!1);
    }}></db-settings>` : ""}
      ${this.tab === "history" ? k`<db-history .actions=${this.actionsList} @navigate=${(c) => this._go(c.detail)} .ws=${(c, f) => this._ws(c, f)} .busy=${!!((h = this.job) != null && h.running)} @changed=${() => this._loadActions()} @undo=${(c) => this._askUndo(c.detail)}></db-history>` : ""}
    </div>`;
  }
}
kt(Ac, "properties", {
  all: { state: !0 },
  window: { state: !0 },
  chipsIn: { state: !0 },
  inspect: { state: !0 },
  job: { state: !0 },
  modal: { state: !0 },
  actionsList: { state: !0 },
  live: { state: !0 },
  menuOpen: { state: !0 },
  reclaim: { state: !0 },
  now: { state: !0 },
  hass: { attribute: !1 },
  narrow: { type: Boolean },
  tab: { state: !0 },
  data: { state: !0 },
  history: { state: !0 },
  days: { state: !0 },
  filters: { state: !0 },
  search: { state: !0 },
  sort: { state: !0 },
  selected: { state: !0 },
  shown: { state: !0 },
  usage: { state: !0 },
  resync: { state: !0 },
  expand: { state: !0 },
  hideAuto: { state: !0 },
  cfg: { state: !0 },
  ret: { state: !0 },
  notice: { state: !0 },
  retBusy: { state: !0 },
  progress: { state: !0 },
  error: { state: !0 }
}), kt(Ac, "styles", Ir`
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
    .menu{background:none;border:none;color:var(--primary-text-color);font-size:22px;cursor:pointer;padding:0 6px}`);
customElements.define("db-storage-panel", Ac);
