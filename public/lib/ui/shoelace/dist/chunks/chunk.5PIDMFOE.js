import {
  __spreadProps,
  __spreadValues
} from "./chunk.IHGPZX35.js";

// node_modules/@lit/reactive-element/css-tag.js
var t = window.ShadowRoot && (window.ShadyCSS === void 0 || window.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var e = Symbol();
var s = class {
  constructor(t4, s5) {
    if (s5 !== e)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t4;
  }
  get styleSheet() {
    return t && this.t === void 0 && (this.t = new CSSStyleSheet(), this.t.replaceSync(this.cssText)), this.t;
  }
  toString() {
    return this.cssText;
  }
};
var n = new Map();
var o = (t4) => {
  let o7 = n.get(t4);
  return o7 === void 0 && n.set(t4, o7 = new s(t4, e)), o7;
};
var r = (t4) => o(typeof t4 == "string" ? t4 : t4 + "");
var S = (e6, s5) => {
  t ? e6.adoptedStyleSheets = s5.map((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet) : s5.forEach((t4) => {
    const s6 = document.createElement("style");
    s6.textContent = t4.cssText, e6.appendChild(s6);
  });
};
var u = t ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
  let e6 = "";
  for (const s5 of t5.cssRules)
    e6 += s5.cssText;
  return r(e6);
})(t4) : t4;

// node_modules/@lit/reactive-element/reactive-element.js
var s2;
var e2;
var h;
var r2;
var o2 = { toAttribute(t4, i5) {
  switch (i5) {
    case Boolean:
      t4 = t4 ? "" : null;
      break;
    case Object:
    case Array:
      t4 = t4 == null ? t4 : JSON.stringify(t4);
  }
  return t4;
}, fromAttribute(t4, i5) {
  let s5 = t4;
  switch (i5) {
    case Boolean:
      s5 = t4 !== null;
      break;
    case Number:
      s5 = t4 === null ? null : Number(t4);
      break;
    case Object:
    case Array:
      try {
        s5 = JSON.parse(t4);
      } catch (t5) {
        s5 = null;
      }
  }
  return s5;
} };
var n2 = (t4, i5) => i5 !== t4 && (i5 == i5 || t4 == t4);
var l = { attribute: true, type: String, converter: o2, reflect: false, hasChanged: n2 };
var a = class extends HTMLElement {
  constructor() {
    super(), this.\u03A0i = new Map(), this.\u03A0o = void 0, this.\u03A0l = void 0, this.isUpdatePending = false, this.hasUpdated = false, this.\u03A0h = null, this.u();
  }
  static addInitializer(t4) {
    var i5;
    (i5 = this.v) !== null && i5 !== void 0 || (this.v = []), this.v.push(t4);
  }
  static get observedAttributes() {
    this.finalize();
    const t4 = [];
    return this.elementProperties.forEach((i5, s5) => {
      const e6 = this.\u03A0p(s5, i5);
      e6 !== void 0 && (this.\u03A0m.set(e6, s5), t4.push(e6));
    }), t4;
  }
  static createProperty(t4, i5 = l) {
    if (i5.state && (i5.attribute = false), this.finalize(), this.elementProperties.set(t4, i5), !i5.noAccessor && !this.prototype.hasOwnProperty(t4)) {
      const s5 = typeof t4 == "symbol" ? Symbol() : "__" + t4, e6 = this.getPropertyDescriptor(t4, s5, i5);
      e6 !== void 0 && Object.defineProperty(this.prototype, t4, e6);
    }
  }
  static getPropertyDescriptor(t4, i5, s5) {
    return { get() {
      return this[i5];
    }, set(e6) {
      const h4 = this[t4];
      this[i5] = e6, this.requestUpdate(t4, h4, s5);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t4) {
    return this.elementProperties.get(t4) || l;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return false;
    this.finalized = true;
    const t4 = Object.getPrototypeOf(this);
    if (t4.finalize(), this.elementProperties = new Map(t4.elementProperties), this.\u03A0m = new Map(), this.hasOwnProperty("properties")) {
      const t5 = this.properties, i5 = [...Object.getOwnPropertyNames(t5), ...Object.getOwnPropertySymbols(t5)];
      for (const s5 of i5)
        this.createProperty(s5, t5[s5]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), true;
  }
  static finalizeStyles(i5) {
    const s5 = [];
    if (Array.isArray(i5)) {
      const e6 = new Set(i5.flat(1 / 0).reverse());
      for (const i6 of e6)
        s5.unshift(u(i6));
    } else
      i5 !== void 0 && s5.push(u(i5));
    return s5;
  }
  static \u03A0p(t4, i5) {
    const s5 = i5.attribute;
    return s5 === false ? void 0 : typeof s5 == "string" ? s5 : typeof t4 == "string" ? t4.toLowerCase() : void 0;
  }
  u() {
    var t4;
    this.\u03A0g = new Promise((t5) => this.enableUpdating = t5), this.L = new Map(), this.\u03A0_(), this.requestUpdate(), (t4 = this.constructor.v) === null || t4 === void 0 || t4.forEach((t5) => t5(this));
  }
  addController(t4) {
    var i5, s5;
    ((i5 = this.\u03A0U) !== null && i5 !== void 0 ? i5 : this.\u03A0U = []).push(t4), this.renderRoot !== void 0 && this.isConnected && ((s5 = t4.hostConnected) === null || s5 === void 0 || s5.call(t4));
  }
  removeController(t4) {
    var i5;
    (i5 = this.\u03A0U) === null || i5 === void 0 || i5.splice(this.\u03A0U.indexOf(t4) >>> 0, 1);
  }
  \u03A0_() {
    this.constructor.elementProperties.forEach((t4, i5) => {
      this.hasOwnProperty(i5) && (this.\u03A0i.set(i5, this[i5]), delete this[i5]);
    });
  }
  createRenderRoot() {
    var t4;
    const s5 = (t4 = this.shadowRoot) !== null && t4 !== void 0 ? t4 : this.attachShadow(this.constructor.shadowRootOptions);
    return S(s5, this.constructor.elementStyles), s5;
  }
  connectedCallback() {
    var t4;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (t4 = this.\u03A0U) === null || t4 === void 0 || t4.forEach((t5) => {
      var i5;
      return (i5 = t5.hostConnected) === null || i5 === void 0 ? void 0 : i5.call(t5);
    }), this.\u03A0l && (this.\u03A0l(), this.\u03A0o = this.\u03A0l = void 0);
  }
  enableUpdating(t4) {
  }
  disconnectedCallback() {
    var t4;
    (t4 = this.\u03A0U) === null || t4 === void 0 || t4.forEach((t5) => {
      var i5;
      return (i5 = t5.hostDisconnected) === null || i5 === void 0 ? void 0 : i5.call(t5);
    }), this.\u03A0o = new Promise((t5) => this.\u03A0l = t5);
  }
  attributeChangedCallback(t4, i5, s5) {
    this.K(t4, s5);
  }
  \u03A0j(t4, i5, s5 = l) {
    var e6, h4;
    const r5 = this.constructor.\u03A0p(t4, s5);
    if (r5 !== void 0 && s5.reflect === true) {
      const n7 = ((h4 = (e6 = s5.converter) === null || e6 === void 0 ? void 0 : e6.toAttribute) !== null && h4 !== void 0 ? h4 : o2.toAttribute)(i5, s5.type);
      this.\u03A0h = t4, n7 == null ? this.removeAttribute(r5) : this.setAttribute(r5, n7), this.\u03A0h = null;
    }
  }
  K(t4, i5) {
    var s5, e6, h4;
    const r5 = this.constructor, n7 = r5.\u03A0m.get(t4);
    if (n7 !== void 0 && this.\u03A0h !== n7) {
      const t5 = r5.getPropertyOptions(n7), l4 = t5.converter, a4 = (h4 = (e6 = (s5 = l4) === null || s5 === void 0 ? void 0 : s5.fromAttribute) !== null && e6 !== void 0 ? e6 : typeof l4 == "function" ? l4 : null) !== null && h4 !== void 0 ? h4 : o2.fromAttribute;
      this.\u03A0h = n7, this[n7] = a4(i5, t5.type), this.\u03A0h = null;
    }
  }
  requestUpdate(t4, i5, s5) {
    let e6 = true;
    t4 !== void 0 && (((s5 = s5 || this.constructor.getPropertyOptions(t4)).hasChanged || n2)(this[t4], i5) ? (this.L.has(t4) || this.L.set(t4, i5), s5.reflect === true && this.\u03A0h !== t4 && (this.\u03A0k === void 0 && (this.\u03A0k = new Map()), this.\u03A0k.set(t4, s5))) : e6 = false), !this.isUpdatePending && e6 && (this.\u03A0g = this.\u03A0q());
  }
  async \u03A0q() {
    this.isUpdatePending = true;
    try {
      for (await this.\u03A0g; this.\u03A0o; )
        await this.\u03A0o;
    } catch (t5) {
      Promise.reject(t5);
    }
    const t4 = this.performUpdate();
    return t4 != null && await t4, !this.isUpdatePending;
  }
  performUpdate() {
    var t4;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this.\u03A0i && (this.\u03A0i.forEach((t5, i6) => this[i6] = t5), this.\u03A0i = void 0);
    let i5 = false;
    const s5 = this.L;
    try {
      i5 = this.shouldUpdate(s5), i5 ? (this.willUpdate(s5), (t4 = this.\u03A0U) === null || t4 === void 0 || t4.forEach((t5) => {
        var i6;
        return (i6 = t5.hostUpdate) === null || i6 === void 0 ? void 0 : i6.call(t5);
      }), this.update(s5)) : this.\u03A0$();
    } catch (t5) {
      throw i5 = false, this.\u03A0$(), t5;
    }
    i5 && this.E(s5);
  }
  willUpdate(t4) {
  }
  E(t4) {
    var i5;
    (i5 = this.\u03A0U) === null || i5 === void 0 || i5.forEach((t5) => {
      var i6;
      return (i6 = t5.hostUpdated) === null || i6 === void 0 ? void 0 : i6.call(t5);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
  }
  \u03A0$() {
    this.L = new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this.\u03A0g;
  }
  shouldUpdate(t4) {
    return true;
  }
  update(t4) {
    this.\u03A0k !== void 0 && (this.\u03A0k.forEach((t5, i5) => this.\u03A0j(i5, this[i5], t5)), this.\u03A0k = void 0), this.\u03A0$();
  }
  updated(t4) {
  }
  firstUpdated(t4) {
  }
};
a.finalized = true, a.elementProperties = new Map(), a.elementStyles = [], a.shadowRootOptions = { mode: "open" }, (e2 = (s2 = globalThis).reactiveElementPlatformSupport) === null || e2 === void 0 || e2.call(s2, { ReactiveElement: a }), ((h = (r2 = globalThis).reactiveElementVersions) !== null && h !== void 0 ? h : r2.reactiveElementVersions = []).push("1.0.0-rc.2");

// node_modules/lit-html/lit-html.js
var t2;
var i2;
var s3;
var e3;
var o3 = globalThis.trustedTypes;
var l2 = o3 ? o3.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
var n3 = `lit$${(Math.random() + "").slice(9)}$`;
var h2 = "?" + n3;
var r3 = `<${h2}>`;
var u2 = document;
var c = (t4 = "") => u2.createComment(t4);
var d = (t4) => t4 === null || typeof t4 != "object" && typeof t4 != "function";
var v = Array.isArray;
var a2 = (t4) => {
  var i5;
  return v(t4) || typeof ((i5 = t4) === null || i5 === void 0 ? void 0 : i5[Symbol.iterator]) == "function";
};
var f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p = />|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g;
var $ = /'/g;
var g = /"/g;
var y = /^(?:script|style|textarea)$/i;
var b = (t4) => (i5, ...s5) => ({ _$litType$: t4, strings: i5, values: s5 });
var T = b(1);
var x = b(2);
var w = Symbol.for("lit-noChange");
var A = Symbol.for("lit-nothing");
var P = new WeakMap();
var V = (t4, i5, s5) => {
  var e6, o7;
  const l4 = (e6 = s5 == null ? void 0 : s5.renderBefore) !== null && e6 !== void 0 ? e6 : i5;
  let n7 = l4._$litPart$;
  if (n7 === void 0) {
    const t5 = (o7 = s5 == null ? void 0 : s5.renderBefore) !== null && o7 !== void 0 ? o7 : null;
    l4._$litPart$ = n7 = new C(i5.insertBefore(c(), t5), t5, void 0, s5);
  }
  return n7.I(t4), n7;
};
var E = u2.createTreeWalker(u2, 129, null, false);
var M = (t4, i5) => {
  const s5 = t4.length - 1, e6 = [];
  let o7, h4 = i5 === 2 ? "<svg>" : "", u3 = f;
  for (let i6 = 0; i6 < s5; i6++) {
    const s6 = t4[i6];
    let l4, c3, d2 = -1, v2 = 0;
    for (; v2 < s6.length && (u3.lastIndex = v2, c3 = u3.exec(s6), c3 !== null); )
      v2 = u3.lastIndex, u3 === f ? c3[1] === "!--" ? u3 = _ : c3[1] !== void 0 ? u3 = m : c3[2] !== void 0 ? (y.test(c3[2]) && (o7 = RegExp("</" + c3[2], "g")), u3 = p) : c3[3] !== void 0 && (u3 = p) : u3 === p ? c3[0] === ">" ? (u3 = o7 != null ? o7 : f, d2 = -1) : c3[1] === void 0 ? d2 = -2 : (d2 = u3.lastIndex - c3[2].length, l4 = c3[1], u3 = c3[3] === void 0 ? p : c3[3] === '"' ? g : $) : u3 === g || u3 === $ ? u3 = p : u3 === _ || u3 === m ? u3 = f : (u3 = p, o7 = void 0);
    const a4 = u3 === p && t4[i6 + 1].startsWith("/>") ? " " : "";
    h4 += u3 === f ? s6 + r3 : d2 >= 0 ? (e6.push(l4), s6.slice(0, d2) + "$lit$" + s6.slice(d2) + n3 + a4) : s6 + n3 + (d2 === -2 ? (e6.push(void 0), i6) : a4);
  }
  const c2 = h4 + (t4[s5] || "<?>") + (i5 === 2 ? "</svg>" : "");
  return [l2 !== void 0 ? l2.createHTML(c2) : c2, e6];
};
var N = class {
  constructor({ strings: t4, _$litType$: i5 }, s5) {
    let e6;
    this.parts = [];
    let l4 = 0, r5 = 0;
    const u3 = t4.length - 1, d2 = this.parts, [v2, a4] = M(t4, i5);
    if (this.el = N.createElement(v2, s5), E.currentNode = this.el.content, i5 === 2) {
      const t5 = this.el.content, i6 = t5.firstChild;
      i6.remove(), t5.append(...i6.childNodes);
    }
    for (; (e6 = E.nextNode()) !== null && d2.length < u3; ) {
      if (e6.nodeType === 1) {
        if (e6.hasAttributes()) {
          const t5 = [];
          for (const i6 of e6.getAttributeNames())
            if (i6.endsWith("$lit$") || i6.startsWith(n3)) {
              const s6 = a4[r5++];
              if (t5.push(i6), s6 !== void 0) {
                const t6 = e6.getAttribute(s6.toLowerCase() + "$lit$").split(n3), i7 = /([.?@])?(.*)/.exec(s6);
                d2.push({ type: 1, index: l4, name: i7[2], strings: t6, ctor: i7[1] === "." ? I : i7[1] === "?" ? L : i7[1] === "@" ? R : H });
              } else
                d2.push({ type: 6, index: l4 });
            }
          for (const i6 of t5)
            e6.removeAttribute(i6);
        }
        if (y.test(e6.tagName)) {
          const t5 = e6.textContent.split(n3), i6 = t5.length - 1;
          if (i6 > 0) {
            e6.textContent = o3 ? o3.emptyScript : "";
            for (let s6 = 0; s6 < i6; s6++)
              e6.append(t5[s6], c()), E.nextNode(), d2.push({ type: 2, index: ++l4 });
            e6.append(t5[i6], c());
          }
        }
      } else if (e6.nodeType === 8)
        if (e6.data === h2)
          d2.push({ type: 2, index: l4 });
        else {
          let t5 = -1;
          for (; (t5 = e6.data.indexOf(n3, t5 + 1)) !== -1; )
            d2.push({ type: 7, index: l4 }), t5 += n3.length - 1;
        }
      l4++;
    }
  }
  static createElement(t4, i5) {
    const s5 = u2.createElement("template");
    return s5.innerHTML = t4, s5;
  }
};
function S2(t4, i5, s5 = t4, e6) {
  var o7, l4, n7, h4;
  if (i5 === w)
    return i5;
  let r5 = e6 !== void 0 ? (o7 = s5.\u03A3i) === null || o7 === void 0 ? void 0 : o7[e6] : s5.\u03A3o;
  const u3 = d(i5) ? void 0 : i5._$litDirective$;
  return (r5 == null ? void 0 : r5.constructor) !== u3 && ((l4 = r5 == null ? void 0 : r5.O) === null || l4 === void 0 || l4.call(r5, false), u3 === void 0 ? r5 = void 0 : (r5 = new u3(t4), r5.T(t4, s5, e6)), e6 !== void 0 ? ((n7 = (h4 = s5).\u03A3i) !== null && n7 !== void 0 ? n7 : h4.\u03A3i = [])[e6] = r5 : s5.\u03A3o = r5), r5 !== void 0 && (i5 = S2(t4, r5.S(t4, i5.values), r5, e6)), i5;
}
var k = class {
  constructor(t4, i5) {
    this.l = [], this.N = void 0, this.D = t4, this.M = i5;
  }
  u(t4) {
    var i5;
    const { el: { content: s5 }, parts: e6 } = this.D, o7 = ((i5 = t4 == null ? void 0 : t4.creationScope) !== null && i5 !== void 0 ? i5 : u2).importNode(s5, true);
    E.currentNode = o7;
    let l4 = E.nextNode(), n7 = 0, h4 = 0, r5 = e6[0];
    for (; r5 !== void 0; ) {
      if (n7 === r5.index) {
        let i6;
        r5.type === 2 ? i6 = new C(l4, l4.nextSibling, this, t4) : r5.type === 1 ? i6 = new r5.ctor(l4, r5.name, r5.strings, this, t4) : r5.type === 6 && (i6 = new z(l4, this, t4)), this.l.push(i6), r5 = e6[++h4];
      }
      n7 !== (r5 == null ? void 0 : r5.index) && (l4 = E.nextNode(), n7++);
    }
    return o7;
  }
  v(t4) {
    let i5 = 0;
    for (const s5 of this.l)
      s5 !== void 0 && (s5.strings !== void 0 ? (s5.I(t4, s5, i5), i5 += s5.strings.length - 2) : s5.I(t4[i5])), i5++;
  }
};
var C = class {
  constructor(t4, i5, s5, e6) {
    this.type = 2, this.N = void 0, this.A = t4, this.B = i5, this.M = s5, this.options = e6;
  }
  setConnected(t4) {
    var i5;
    (i5 = this.P) === null || i5 === void 0 || i5.call(this, t4);
  }
  get parentNode() {
    return this.A.parentNode;
  }
  get startNode() {
    return this.A;
  }
  get endNode() {
    return this.B;
  }
  I(t4, i5 = this) {
    t4 = S2(this, t4, i5), d(t4) ? t4 === A || t4 == null || t4 === "" ? (this.H !== A && this.R(), this.H = A) : t4 !== this.H && t4 !== w && this.m(t4) : t4._$litType$ !== void 0 ? this._(t4) : t4.nodeType !== void 0 ? this.$(t4) : a2(t4) ? this.g(t4) : this.m(t4);
  }
  k(t4, i5 = this.B) {
    return this.A.parentNode.insertBefore(t4, i5);
  }
  $(t4) {
    this.H !== t4 && (this.R(), this.H = this.k(t4));
  }
  m(t4) {
    const i5 = this.A.nextSibling;
    i5 !== null && i5.nodeType === 3 && (this.B === null ? i5.nextSibling === null : i5 === this.B.previousSibling) ? i5.data = t4 : this.$(u2.createTextNode(t4)), this.H = t4;
  }
  _(t4) {
    var i5;
    const { values: s5, _$litType$: e6 } = t4, o7 = typeof e6 == "number" ? this.C(t4) : (e6.el === void 0 && (e6.el = N.createElement(e6.h, this.options)), e6);
    if (((i5 = this.H) === null || i5 === void 0 ? void 0 : i5.D) === o7)
      this.H.v(s5);
    else {
      const t5 = new k(o7, this), i6 = t5.u(this.options);
      t5.v(s5), this.$(i6), this.H = t5;
    }
  }
  C(t4) {
    let i5 = P.get(t4.strings);
    return i5 === void 0 && P.set(t4.strings, i5 = new N(t4)), i5;
  }
  g(t4) {
    v(this.H) || (this.H = [], this.R());
    const i5 = this.H;
    let s5, e6 = 0;
    for (const o7 of t4)
      e6 === i5.length ? i5.push(s5 = new C(this.k(c()), this.k(c()), this, this.options)) : s5 = i5[e6], s5.I(o7), e6++;
    e6 < i5.length && (this.R(s5 && s5.B.nextSibling, e6), i5.length = e6);
  }
  R(t4 = this.A.nextSibling, i5) {
    var s5;
    for ((s5 = this.P) === null || s5 === void 0 || s5.call(this, false, true, i5); t4 && t4 !== this.B; ) {
      const i6 = t4.nextSibling;
      t4.remove(), t4 = i6;
    }
  }
};
var H = class {
  constructor(t4, i5, s5, e6, o7) {
    this.type = 1, this.H = A, this.N = void 0, this.V = void 0, this.element = t4, this.name = i5, this.M = e6, this.options = o7, s5.length > 2 || s5[0] !== "" || s5[1] !== "" ? (this.H = Array(s5.length - 1).fill(A), this.strings = s5) : this.H = A;
  }
  get tagName() {
    return this.element.tagName;
  }
  I(t4, i5 = this, s5, e6) {
    const o7 = this.strings;
    let l4 = false;
    if (o7 === void 0)
      t4 = S2(this, t4, i5, 0), l4 = !d(t4) || t4 !== this.H && t4 !== w, l4 && (this.H = t4);
    else {
      const e7 = t4;
      let n7, h4;
      for (t4 = o7[0], n7 = 0; n7 < o7.length - 1; n7++)
        h4 = S2(this, e7[s5 + n7], i5, n7), h4 === w && (h4 = this.H[n7]), l4 || (l4 = !d(h4) || h4 !== this.H[n7]), h4 === A ? t4 = A : t4 !== A && (t4 += (h4 != null ? h4 : "") + o7[n7 + 1]), this.H[n7] = h4;
    }
    l4 && !e6 && this.W(t4);
  }
  W(t4) {
    t4 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 != null ? t4 : "");
  }
};
var I = class extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  W(t4) {
    this.element[this.name] = t4 === A ? void 0 : t4;
  }
};
var L = class extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  W(t4) {
    t4 && t4 !== A ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name);
  }
};
var R = class extends H {
  constructor() {
    super(...arguments), this.type = 5;
  }
  I(t4, i5 = this) {
    var s5;
    if ((t4 = (s5 = S2(this, t4, i5, 0)) !== null && s5 !== void 0 ? s5 : A) === w)
      return;
    const e6 = this.H, o7 = t4 === A && e6 !== A || t4.capture !== e6.capture || t4.once !== e6.once || t4.passive !== e6.passive, l4 = t4 !== A && (e6 === A || o7);
    o7 && this.element.removeEventListener(this.name, this, e6), l4 && this.element.addEventListener(this.name, this, t4), this.H = t4;
  }
  handleEvent(t4) {
    var i5, s5;
    typeof this.H == "function" ? this.H.call((s5 = (i5 = this.options) === null || i5 === void 0 ? void 0 : i5.host) !== null && s5 !== void 0 ? s5 : this.element, t4) : this.H.handleEvent(t4);
  }
};
var z = class {
  constructor(t4, i5, s5) {
    this.element = t4, this.type = 6, this.N = void 0, this.V = void 0, this.M = i5, this.options = s5;
  }
  I(t4) {
    S2(this, t4);
  }
};
(i2 = (t2 = globalThis).litHtmlPlatformSupport) === null || i2 === void 0 || i2.call(t2, N, C), ((s3 = (e3 = globalThis).litHtmlVersions) !== null && s3 !== void 0 ? s3 : e3.litHtmlVersions = []).push("2.0.0-rc.3");

// node_modules/lit-element/lit-element.js
var i3;
var l3;
var o4;
var s4;
var n4;
var a3;
((i3 = (a3 = globalThis).litElementVersions) !== null && i3 !== void 0 ? i3 : a3.litElementVersions = []).push("3.0.0-rc.2");
var h3 = class extends a {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this.\u03A6t = void 0;
  }
  createRenderRoot() {
    var t4, e6;
    const r5 = super.createRenderRoot();
    return (t4 = (e6 = this.renderOptions).renderBefore) !== null && t4 !== void 0 || (e6.renderBefore = r5.firstChild), r5;
  }
  update(t4) {
    const r5 = this.render();
    super.update(t4), this.\u03A6t = V(r5, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t4;
    super.connectedCallback(), (t4 = this.\u03A6t) === null || t4 === void 0 || t4.setConnected(true);
  }
  disconnectedCallback() {
    var t4;
    super.disconnectedCallback(), (t4 = this.\u03A6t) === null || t4 === void 0 || t4.setConnected(false);
  }
  render() {
    return w;
  }
};
h3.finalized = true, h3._$litElement$ = true, (o4 = (l3 = globalThis).litElementHydrateSupport) === null || o4 === void 0 || o4.call(l3, { LitElement: h3 }), (n4 = (s4 = globalThis).litElementPlatformSupport) === null || n4 === void 0 || n4.call(s4, { LitElement: h3 });

// node_modules/@lit/reactive-element/decorators/custom-element.js
var n5 = (n7) => (e6) => typeof e6 == "function" ? ((n8, e7) => (window.customElements.define(n8, e7), e7))(n7, e6) : ((n8, e7) => {
  const { kind: t4, elements: i5 } = e7;
  return { kind: t4, elements: i5, finisher(e8) {
    window.customElements.define(n8, e8);
  } };
})(n7, e6);

// node_modules/@lit/reactive-element/decorators/property.js
var i4 = (i5, e6) => e6.kind === "method" && e6.descriptor && !("value" in e6.descriptor) ? __spreadProps(__spreadValues({}, e6), { finisher(n7) {
  n7.createProperty(e6.key, i5);
} }) : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: e6.key, initializer() {
  typeof e6.initializer == "function" && (this[e6.key] = e6.initializer.call(this));
}, finisher(n7) {
  n7.createProperty(e6.key, i5);
} };
function e4(e6) {
  return (n7, t4) => t4 !== void 0 ? ((i5, e7, n8) => {
    e7.constructor.createProperty(n8, i5);
  })(e6, n7, t4) : i4(e6, n7);
}

// node_modules/@lit/reactive-element/decorators/state.js
function r4(r5) {
  return e4(__spreadProps(__spreadValues({}, r5), { state: true, attribute: false }));
}

// node_modules/@lit/reactive-element/decorators/base.js
var o5 = ({ finisher: e6, descriptor: t4 }) => (o7, n7) => {
  var r5;
  if (n7 === void 0) {
    const n8 = (r5 = o7.originalKey) !== null && r5 !== void 0 ? r5 : o7.key, i5 = t4 != null ? { kind: "method", placement: "prototype", key: n8, descriptor: t4(o7.key) } : __spreadProps(__spreadValues({}, o7), { key: n8 });
    return e6 != null && (i5.finisher = function(t5) {
      e6(t5, n8);
    }), i5;
  }
  {
    const r6 = o7.constructor;
    t4 !== void 0 && Object.defineProperty(o7, n7, t4(n7)), e6 == null || e6(r6, n7);
  }
};

// node_modules/@lit/reactive-element/decorators/query.js
function o6(o7, r5) {
  return o5({ descriptor: (t4) => {
    const i5 = { get() {
      var t5;
      return (t5 = this.renderRoot) === null || t5 === void 0 ? void 0 : t5.querySelector(o7);
    }, enumerable: true, configurable: true };
    if (r5) {
      const r6 = typeof t4 == "symbol" ? Symbol() : "__" + t4;
      i5.get = function() {
        var t5;
        return this[r6] === void 0 && (this[r6] = (t5 = this.renderRoot) === null || t5 === void 0 ? void 0 : t5.querySelector(o7)), this[r6];
      };
    }
    return i5;
  } });
}

// node_modules/@lit/reactive-element/decorators/query-async.js
function e5(e6) {
  return o5({ descriptor: (r5) => ({ async get() {
    var r6;
    return await this.updateComplete, (r6 = this.renderRoot) === null || r6 === void 0 ? void 0 : r6.querySelector(e6);
  }, enumerable: true, configurable: true }) });
}

// node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js
var t3 = Element.prototype;
var n6 = t3.msMatchesSelector || t3.webkitMatchesSelector;

export {
  r,
  T,
  w,
  A,
  h3 as h,
  n5 as n,
  e4 as e,
  r4 as r2,
  o6 as o,
  e5 as e2
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
