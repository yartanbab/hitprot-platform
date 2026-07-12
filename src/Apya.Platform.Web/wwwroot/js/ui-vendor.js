import { g as dr, r as c, R as Ke, j as A, a as Ot } from "./react-vendor.js";
function At(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (r = At(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function Ue() {
  for (var e, t, r = 0, n = "", o = arguments.length; r < o; r++) (e = arguments[r]) && (t = At(e)) && (n && (n += " "), n += t);
  return n;
}
const fr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clsx: Ue,
  default: Ue
}, Symbol.toStringTag, { value: "Module" })), mr = (e, t) => {
  const r = new Array(e.length + t.length);
  for (let n = 0; n < e.length; n++)
    r[n] = e[n];
  for (let n = 0; n < t.length; n++)
    r[e.length + n] = t[n];
  return r;
}, pr = (e, t) => ({
  classGroupId: e,
  validator: t
}), Nt = (e = /* @__PURE__ */ new Map(), t = null, r) => ({
  nextPart: e,
  validators: t,
  classGroupId: r
}), Re = "-", st = [], br = "arbitrary..", hr = (e) => {
  const t = vr(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: n
  } = e;
  return {
    getClassGroupId: (a) => {
      if (a.startsWith("[") && a.endsWith("]"))
        return gr(a);
      const i = a.split(Re), m = i[0] === "" && i.length > 1 ? 1 : 0;
      return Dt(i, m, t);
    },
    getConflictingClassGroupIds: (a, i) => {
      if (i) {
        const m = n[a], l = r[a];
        return m ? l ? mr(l, m) : m : l || st;
      }
      return r[a] || st;
    }
  };
}, Dt = (e, t, r) => {
  if (e.length - t === 0)
    return r.classGroupId;
  const o = e[t], s = r.nextPart.get(o);
  if (s) {
    const l = Dt(e, t + 1, s);
    if (l) return l;
  }
  const a = r.validators;
  if (a === null)
    return;
  const i = t === 0 ? e.join(Re) : e.slice(t).join(Re), m = a.length;
  for (let l = 0; l < m; l++) {
    const d = a[l];
    if (d.validator(i))
      return d.classGroupId;
  }
}, gr = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const t = e.slice(1, -1), r = t.indexOf(":"), n = t.slice(0, r);
  return n ? br + n : void 0;
})(), vr = (e) => {
  const {
    theme: t,
    classGroups: r
  } = e;
  return yr(r, t);
}, yr = (e, t) => {
  const r = Nt();
  for (const n in e) {
    const o = e[n];
    Xe(o, r, n, t);
  }
  return r;
}, Xe = (e, t, r, n) => {
  const o = e.length;
  for (let s = 0; s < o; s++) {
    const a = e[s];
    wr(a, t, r, n);
  }
}, wr = (e, t, r, n) => {
  if (typeof e == "string") {
    xr(e, t, r);
    return;
  }
  if (typeof e == "function") {
    kr(e, t, r, n);
    return;
  }
  Er(e, t, r, n);
}, xr = (e, t, r) => {
  const n = e === "" ? t : It(t, e);
  n.classGroupId = r;
}, kr = (e, t, r, n) => {
  if (Cr(e)) {
    Xe(e(n), t, r, n);
    return;
  }
  t.validators === null && (t.validators = []), t.validators.push(pr(r, e));
}, Er = (e, t, r, n) => {
  const o = Object.entries(e), s = o.length;
  for (let a = 0; a < s; a++) {
    const [i, m] = o[a];
    Xe(m, It(t, i), r, n);
  }
}, It = (e, t) => {
  let r = e;
  const n = t.split(Re), o = n.length;
  for (let s = 0; s < o; s++) {
    const a = n[s];
    let i = r.nextPart.get(a);
    i || (i = Nt(), r.nextPart.set(a, i)), r = i;
  }
  return r;
}, Cr = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, Sr = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, r = /* @__PURE__ */ Object.create(null), n = /* @__PURE__ */ Object.create(null);
  const o = (s, a) => {
    r[s] = a, t++, t > e && (t = 0, n = r, r = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(s) {
      let a = r[s];
      if (a !== void 0)
        return a;
      if ((a = n[s]) !== void 0)
        return o(s, a), a;
    },
    set(s, a) {
      s in r ? r[s] = a : o(s, a);
    }
  };
}, Ge = "!", at = ":", Rr = [], it = (e, t, r, n, o) => ({
  modifiers: e,
  hasImportantModifier: t,
  baseClassName: r,
  maybePostfixModifierPosition: n,
  isExternal: o
}), Pr = (e) => {
  const {
    prefix: t,
    experimentalParseClassName: r
  } = e;
  let n = (o) => {
    const s = [];
    let a = 0, i = 0, m = 0, l;
    const d = o.length;
    for (let f = 0; f < d; f++) {
      const g = o[f];
      if (a === 0 && i === 0) {
        if (g === at) {
          s.push(o.slice(m, f)), m = f + 1;
          continue;
        }
        if (g === "/") {
          l = f;
          continue;
        }
      }
      g === "[" ? a++ : g === "]" ? a-- : g === "(" ? i++ : g === ")" && i--;
    }
    const u = s.length === 0 ? o : o.slice(m);
    let p = u, y = !1;
    u.endsWith(Ge) ? (p = u.slice(0, -1), y = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      u.startsWith(Ge) && (p = u.slice(1), y = !0)
    );
    const E = l && l > m ? l - m : void 0;
    return it(s, y, p, E);
  };
  if (t) {
    const o = t + at, s = n;
    n = (a) => a.startsWith(o) ? s(a.slice(o.length)) : it(Rr, !1, a, void 0, !0);
  }
  if (r) {
    const o = n;
    n = (s) => r({
      className: s,
      parseClassName: o
    });
  }
  return n;
}, Or = (e) => {
  const t = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((r, n) => {
    t.set(r, 1e6 + n);
  }), (r) => {
    const n = [];
    let o = [];
    for (let s = 0; s < r.length; s++) {
      const a = r[s], i = a[0] === "[", m = t.has(a);
      i || m ? (o.length > 0 && (o.sort(), n.push(...o), o = []), n.push(a)) : o.push(a);
    }
    return o.length > 0 && (o.sort(), n.push(...o)), n;
  };
}, Ar = (e) => ({
  cache: Sr(e.cacheSize),
  parseClassName: Pr(e),
  sortModifiers: Or(e),
  postfixLookupClassGroupIds: Nr(e),
  ...hr(e)
}), Nr = (e) => {
  const t = /* @__PURE__ */ Object.create(null), r = e.postfixLookupClassGroups;
  if (r)
    for (let n = 0; n < r.length; n++)
      t[r[n]] = !0;
  return t;
}, Dr = /\s+/, Ir = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: n,
    getConflictingClassGroupIds: o,
    sortModifiers: s,
    postfixLookupClassGroupIds: a
  } = t, i = [], m = e.trim().split(Dr);
  let l = "";
  for (let d = m.length - 1; d >= 0; d -= 1) {
    const u = m[d], {
      isExternal: p,
      modifiers: y,
      hasImportantModifier: E,
      baseClassName: f,
      maybePostfixModifierPosition: g
    } = r(u);
    if (p) {
      l = u + (l.length > 0 ? " " + l : l);
      continue;
    }
    let x = !!g, C;
    if (x) {
      const D = f.substring(0, g);
      C = n(D);
      const v = C && a[C] ? n(f) : void 0;
      v && v !== C && (C = v, x = !1);
    } else
      C = n(f);
    if (!C) {
      if (!x) {
        l = u + (l.length > 0 ? " " + l : l);
        continue;
      }
      if (C = n(f), !C) {
        l = u + (l.length > 0 ? " " + l : l);
        continue;
      }
      x = !1;
    }
    const k = y.length === 0 ? "" : y.length === 1 ? y[0] : s(y).join(":"), R = E ? k + Ge : k, P = R + C;
    if (i.indexOf(P) > -1)
      continue;
    i.push(P);
    const N = o(C, x);
    for (let D = 0; D < N.length; ++D) {
      const v = N[D];
      i.push(R + v);
    }
    l = u + (l.length > 0 ? " " + l : l);
  }
  return l;
}, Tr = (...e) => {
  let t = 0, r, n, o = "";
  for (; t < e.length; )
    (r = e[t++]) && (n = Tt(r)) && (o && (o += " "), o += n);
  return o;
}, Tt = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let n = 0; n < e.length; n++)
    e[n] && (t = Tt(e[n])) && (r && (r += " "), r += t);
  return r;
}, Mr = (e, ...t) => {
  let r, n, o, s;
  const a = (m) => {
    const l = t.reduce((d, u) => u(d), e());
    return r = Ar(l), n = r.cache.get, o = r.cache.set, s = i, i(m);
  }, i = (m) => {
    const l = n(m);
    if (l)
      return l;
    const d = Ir(m, r);
    return o(m, d), d;
  };
  return s = a, (...m) => s(Tr(...m));
}, Lr = [], T = (e) => {
  const t = (r) => r[e] || Lr;
  return t.isThemeGetter = !0, t;
}, Mt = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Lt = /^\((?:(\w[\w-]*):)?(.+)\)$/i, _r = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, zr = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Fr = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, jr = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Wr = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Br = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Y = (e) => _r.test(e), S = (e) => !!e && !Number.isNaN(Number(e)), W = (e) => !!e && Number.isInteger(Number(e)), Le = (e) => e.endsWith("%") && S(e.slice(0, -1)), U = (e) => zr.test(e), _t = () => !0, Vr = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Fr.test(e) && !jr.test(e)
), He = () => !1, Ur = (e) => Wr.test(e), Gr = (e) => Br.test(e), $r = (e) => !b(e) && !h(e), Yr = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), Kr = (e) => H(e, jt, He), b = (e) => Mt.test(e), q = (e) => H(e, Wt, Vr), ct = (e) => H(e, tn, S), Xr = (e) => H(e, Vt, _t), Hr = (e) => H(e, Bt, He), lt = (e) => H(e, zt, He), Zr = (e) => H(e, Ft, Gr), he = (e) => H(e, Ut, Ur), h = (e) => Lt.test(e), ce = (e) => Q(e, Wt), qr = (e) => Q(e, Bt), ut = (e) => Q(e, zt), Qr = (e) => Q(e, jt), Jr = (e) => Q(e, Ft), ge = (e) => Q(e, Ut, !0), en = (e) => Q(e, Vt, !0), H = (e, t, r) => {
  const n = Mt.exec(e);
  return n ? n[1] ? t(n[1]) : r(n[2]) : !1;
}, Q = (e, t, r = !1) => {
  const n = Lt.exec(e);
  return n ? n[1] ? t(n[1]) : r : !1;
}, zt = (e) => e === "position" || e === "percentage", Ft = (e) => e === "image" || e === "url", jt = (e) => e === "length" || e === "size" || e === "bg-size", Wt = (e) => e === "length", tn = (e) => e === "number", Bt = (e) => e === "family-name", Vt = (e) => e === "number" || e === "weight", Ut = (e) => e === "shadow", rn = () => {
  const e = T("color"), t = T("font"), r = T("text"), n = T("font-weight"), o = T("tracking"), s = T("leading"), a = T("breakpoint"), i = T("container"), m = T("spacing"), l = T("radius"), d = T("shadow"), u = T("inset-shadow"), p = T("text-shadow"), y = T("drop-shadow"), E = T("blur"), f = T("perspective"), g = T("aspect"), x = T("ease"), C = T("animate"), k = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], R = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], P = () => [...R(), h, b], N = () => ["auto", "hidden", "clip", "visible", "scroll"], D = () => ["auto", "contain", "none"], v = () => [h, b, m], I = () => [Y, "full", "auto", ...v()], $ = () => [W, "none", "subgrid", h, b], O = () => ["auto", {
    span: ["full", W, h, b]
  }, W, h, b], z = () => [W, "auto", h, b], ae = () => ["auto", "min", "max", "fr", h, b], ie = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], ee = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], F = () => ["auto", ...v()], Z = () => [Y, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...v()], De = () => [Y, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...v()], Ie = () => [Y, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...v()], w = () => [e, h, b], et = () => [...R(), ut, lt, {
    position: [h, b]
  }], tt = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], rt = () => ["auto", "cover", "contain", Qr, Kr, {
    size: [h, b]
  }], Te = () => [Le, ce, q], L = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    l,
    h,
    b
  ], _ = () => ["", S, ce, q], fe = () => ["solid", "dashed", "dotted", "double"], nt = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], M = () => [S, Le, ut, lt], ot = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    E,
    h,
    b
  ], me = () => ["none", S, h, b], pe = () => ["none", S, h, b], Me = () => [S, h, b], be = () => [Y, "full", ...v()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [U],
      breakpoint: [U],
      color: [_t],
      container: [U],
      "drop-shadow": [U],
      ease: ["in", "out", "in-out"],
      font: [$r],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [U],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [U],
      shadow: [U],
      spacing: ["px", S],
      text: [U],
      "text-shadow": [U],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", Y, b, h, g]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Container Type
       * @see https://tailwindcss.com/docs/responsive-design#container-queries
       */
      "container-type": [{
        "@container": ["", "normal", "size", h, b]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [Yr],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [S, b, h, i]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": k()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": k()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: P()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: N()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": N()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": N()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: D()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": D()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": D()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Inset
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: I()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": I()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": I()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": I(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: I()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": I(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: I()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": I()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": I()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: I()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: I()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: I()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: I()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [W, "auto", h, b]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [Y, "full", "auto", i, ...v()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [S, Y, "auto", "initial", "none", b]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", S, h, b]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", S, h, b]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [W, "first", "last", "none", h, b]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": $()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: O()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": z()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": z()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": $()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: O()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": z()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": z()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ae()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ae()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: v()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": v()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": v()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...ie(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...ee(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...ee()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...ie()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...ee(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...ee(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": ie()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...ee(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...ee()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: v()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: v()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: v()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: v()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: v()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: v()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: v()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: v()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: v()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: v()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: v()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: F()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: F()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: F()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: F()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: F()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: F()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: F()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: F()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: F()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: F()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: F()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": v()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": v()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: Z()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/width
       */
      "inline-size": [{
        inline: ["auto", ...De()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...De()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...De()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ...Ie()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ...Ie()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ...Ie()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [i, "screen", ...Z()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          i,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...Z()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          i,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [a]
          },
          ...Z()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...Z()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...Z()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...Z()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", r, ce, q]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [n, en, Xr]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Le, b]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [qr, Hr, t]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [b]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [o, h, b]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [S, "none", h, ct]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          s,
          ...v()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", h, b]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", h, b]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: w()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: w()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...fe(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [S, "from-font", "auto", h, q]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: w()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [S, "auto", h, b]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: v()
      }],
      /**
       * Tab Size
       * @see https://tailwindcss.com/docs/tab-size
       */
      "tab-size": [{
        tab: [W, h, b]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", h, b]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", h, b]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: et()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: tt()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: rt()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, W, h, b],
          radial: ["", h, b],
          conic: [W, h, b]
        }, Jr, Zr]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: w()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: Te()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: Te()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: Te()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: w()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: w()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: w()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: L()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": L()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": L()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": L()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": L()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": L()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": L()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": L()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": L()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": L()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": L()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": L()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": L()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": L()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": L()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: _()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": _()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": _()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": _()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": _()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": _()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": _()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": _()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": _()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": _()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": _()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": _()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": _()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...fe(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...fe(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: w()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": w()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": w()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": w()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": w()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": w()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": w()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": w()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": w()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": w()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": w()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: w()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...fe(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [S, h, b]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", S, ce, q]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: w()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          d,
          ge,
          he
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: w()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", u, ge, he]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": w()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: _()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: w()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [S, q]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": w()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": _()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": w()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", p, ge, he]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": w()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [S, h, b]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...nt(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": nt()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [S]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": M()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": M()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": w()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": w()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": M()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": M()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": w()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": w()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": M()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": M()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": w()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": w()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": M()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": M()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": w()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": w()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": M()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": M()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": w()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": w()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": M()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": M()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": w()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": w()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": M()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": M()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": w()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": w()
      }],
      "mask-image-radial": [{
        "mask-radial": [h, b]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": M()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": M()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": w()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": w()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": R()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [S]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": M()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": M()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": w()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": w()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: et()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: tt()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: rt()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", h, b]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          h,
          b
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: ot()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [S, h, b]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [S, h, b]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          y,
          ge,
          he
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": w()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", S, h, b]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [S, h, b]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", S, h, b]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [S, h, b]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", S, h, b]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          h,
          b
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": ot()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [S, h, b]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [S, h, b]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", S, h, b]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [S, h, b]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", S, h, b]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [S, h, b]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [S, h, b]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", S, h, b]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": v()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": v()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": v()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", h, b]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [S, "initial", h, b]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", x, h, b]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [S, h, b]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", C, h, b]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [f, h, b]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": P()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: me()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": me()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": me()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": me()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: pe()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": pe()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": pe()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": pe()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: Me()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": Me()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": Me()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [h, b, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: P()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: be()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": be()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": be()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": be()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      /**
       * Zoom
       * @see https://tailwindcss.com/docs/zoom
       */
      zoom: [{
        zoom: [W, h, b]
      }],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: w()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: w()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", h, b]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scrollbar Thumb Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-thumb-color": [{
        "scrollbar-thumb": w()
      }],
      /**
       * Scrollbar Track Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-track-color": [{
        "scrollbar-track": w()
      }],
      /**
       * Scrollbar Gutter
       * @see https://tailwindcss.com/docs/scrollbar-gutter
       */
      "scrollbar-gutter": [{
        "scrollbar-gutter": ["auto", "stable", "both"]
      }],
      /**
       * Scrollbar Width
       * @see https://tailwindcss.com/docs/scrollbar-width
       */
      "scrollbar-w": [{
        scrollbar: ["auto", "thin", "none"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": v()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": v()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": v()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": v()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": v()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": v()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": v()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": v()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": v()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": v()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": v()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": v()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": v()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": v()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": v()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": v()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": v()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": v()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": v()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": v()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": v()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": v()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", h, b]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...w()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [S, ce, q, ct]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...w()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      "container-named": ["container-type"],
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    postfixLookupClassGroups: ["container-type"],
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, Xo = /* @__PURE__ */ Mr(rn), Ho = /* @__PURE__ */ dr(fr);
function dt(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function nn(...e) {
  return (t) => {
    let r = !1;
    const n = e.map((o) => {
      const s = dt(o, t);
      return !r && typeof s == "function" && (r = !0), s;
    });
    if (r)
      return () => {
        for (let o = 0; o < n.length; o++) {
          const s = n[o];
          typeof s == "function" ? s() : dt(e[o], null);
        }
      };
  };
}
function J(...e) {
  return c.useCallback(nn(...e), e);
}
// @__NO_SIDE_EFFECTS__
function Ze(e) {
  const t = c.forwardRef((r, n) => {
    let { children: o, ...s } = r, a = null, i = !1;
    const m = [];
    ft(o) && typeof ve == "function" && (o = ve(o._payload)), c.Children.forEach(o, (p) => {
      var y;
      if (ln(p)) {
        i = !0;
        const E = p;
        let f = "child" in E.props ? E.props.child : E.props.children;
        ft(f) && typeof ve == "function" && (f = ve(f._payload)), a = sn(E, f), m.push((y = a == null ? void 0 : a.props) == null ? void 0 : y.children);
      } else
        m.push(p);
    }), a ? a = c.cloneElement(a, void 0, m) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !i && c.Children.count(o) === 1 && c.isValidElement(o) && (a = o)
    );
    const l = a ? cn(a) : void 0, d = J(n, l);
    if (!a) {
      if (o || o === 0)
        throw new Error(
          i ? mn(e) : fn(e)
        );
      return o;
    }
    const u = an(s, a.props ?? {});
    return a.type !== c.Fragment && (u.ref = n ? d : l), c.cloneElement(a, u);
  });
  return t.displayName = `${e}.Slot`, t;
}
var Zo = /* @__PURE__ */ Ze("Slot"), on = Symbol.for("radix.slottable"), sn = (e, t) => {
  if ("child" in e.props) {
    const r = e.props.child;
    return c.isValidElement(r) ? c.cloneElement(r, void 0, e.props.children(r.props.children)) : null;
  }
  return c.isValidElement(t) ? t : null;
};
function an(e, t) {
  const r = { ...t };
  for (const n in t) {
    const o = e[n], s = t[n];
    /^on[A-Z]/.test(n) ? o && s ? r[n] = (...i) => {
      const m = s(...i);
      return o(...i), m;
    } : o && (r[n] = o) : n === "style" ? r[n] = { ...o, ...s } : n === "className" && (r[n] = [o, s].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
function cn(e) {
  var n, o;
  let t = (n = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : n.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
function ln(e) {
  return c.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === on;
}
var un = Symbol.for("react.lazy");
function ft(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === un && "_payload" in e && dn(e._payload);
}
function dn(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
var fn = (e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, mn = (e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, ve = Ke[" use ".trim().toString()];
const mt = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, pt = Ue, qo = (e, t) => (r) => {
  var n;
  if ((t == null ? void 0 : t.variants) == null) return pt(e, r == null ? void 0 : r.class, r == null ? void 0 : r.className);
  const { variants: o, defaultVariants: s } = t, a = Object.keys(o).map((l) => {
    const d = r == null ? void 0 : r[l], u = s == null ? void 0 : s[l];
    if (d === null) return null;
    const p = mt(d) || mt(u);
    return o[l][p];
  }), i = r && Object.entries(r).reduce((l, d) => {
    let [u, p] = d;
    return p === void 0 || (l[u] = p), l;
  }, {}), m = t == null || (n = t.compoundVariants) === null || n === void 0 ? void 0 : n.reduce((l, d) => {
    let { class: u, className: p, ...y } = d;
    return Object.entries(y).every((E) => {
      let [f, g] = E;
      return Array.isArray(g) ? g.includes({
        ...s,
        ...i
      }[f]) : {
        ...s,
        ...i
      }[f] === g;
    }) ? [
      ...l,
      u,
      p
    ] : l;
  }, []);
  return pt(e, a, m, r == null ? void 0 : r.class, r == null ? void 0 : r.className);
};
function X(e, t, { checkForDefaultPrevented: r = !0 } = {}) {
  return function(o) {
    if (e == null || e(o), r === !1 || !o || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  };
}
function pn(e, t = []) {
  let r = [];
  function n(s, a) {
    const i = c.createContext(a);
    i.displayName = s + "Context";
    const m = r.length;
    r = [...r, a];
    const l = (u) => {
      var x;
      const { scope: p, children: y, ...E } = u, f = ((x = p == null ? void 0 : p[e]) == null ? void 0 : x[m]) || i, g = c.useMemo(() => E, Object.values(E));
      return /* @__PURE__ */ A.jsx(f.Provider, { value: g, children: y });
    };
    l.displayName = s + "Provider";
    function d(u, p, y = {}) {
      var x;
      const { optional: E = !1 } = y, f = ((x = p == null ? void 0 : p[e]) == null ? void 0 : x[m]) || i, g = c.useContext(f);
      if (g) return g;
      if (a !== void 0) return a;
      if (!E)
        throw new Error(`\`${u}\` must be used within \`${s}\``);
    }
    return [l, d];
  }
  const o = () => {
    const s = r.map((a) => c.createContext(a));
    return function(i) {
      const m = (i == null ? void 0 : i[e]) || s;
      return c.useMemo(
        () => ({ [`__scope${e}`]: { ...i, [e]: m } }),
        [i, m]
      );
    };
  };
  return o.scopeName = e, [n, bn(o, ...t)];
}
function bn(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const r = () => {
    const n = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return function(s) {
      const a = n.reduce((i, { useScope: m, scopeName: l }) => {
        const u = m(s)[`__scope${l}`];
        return { ...i, ...u };
      }, {});
      return c.useMemo(() => ({ [`__scope${t.scopeName}`]: a }), [a]);
    };
  };
  return r.scopeName = t.scopeName, r;
}
var ue = globalThis != null && globalThis.document ? c.useLayoutEffect : () => {
}, hn = Ke[" useId ".trim().toString()] || (() => {
}), gn = 0;
function _e(e) {
  const [t, r] = c.useState(hn());
  return ue(() => {
    r((n) => n ?? String(gn++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
var vn = Ke[" useInsertionEffect ".trim().toString()] || ue;
function yn({
  prop: e,
  defaultProp: t,
  onChange: r = () => {
  },
  caller: n
}) {
  const [o, s, a] = wn({
    defaultProp: t,
    onChange: r
  }), i = e !== void 0, m = i ? e : o;
  {
    const d = c.useRef(e !== void 0);
    c.useEffect(() => {
      const u = d.current;
      u !== i && console.warn(
        `${n} is changing from ${u ? "controlled" : "uncontrolled"} to ${i ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), d.current = i;
    }, [i, n]);
  }
  const l = c.useCallback(
    (d) => {
      var u;
      if (i) {
        const p = xn(d) ? d(e) : d;
        p !== e && ((u = a.current) == null || u.call(a, p));
      } else
        s(d);
    },
    [i, e, s, a]
  );
  return [m, l];
}
function wn({
  defaultProp: e,
  onChange: t
}) {
  const [r, n] = c.useState(e), o = c.useRef(r), s = c.useRef(t);
  return vn(() => {
    s.current = t;
  }, [t]), c.useEffect(() => {
    var a;
    o.current !== r && ((a = s.current) == null || a.call(s, r), o.current = r);
  }, [r, o]), [r, n, s];
}
function xn(e) {
  return typeof e == "function";
}
var kn = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], G = kn.reduce((e, t) => {
  const r = /* @__PURE__ */ Ze(`Primitive.${t}`), n = c.forwardRef((o, s) => {
    const { asChild: a, ...i } = o, m = a ? r : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ A.jsx(m, { ...i, ref: s });
  });
  return n.displayName = `Primitive.${t}`, { ...e, [t]: n };
}, {});
function En(e, t) {
  e && Ot.flushSync(() => e.dispatchEvent(t));
}
function de(e) {
  const t = c.useRef(e);
  return c.useEffect(() => {
    t.current = e;
  }), c.useMemo(() => (...r) => {
    var n;
    return (n = t.current) == null ? void 0 : n.call(t, ...r);
  }, []);
}
var Cn = "DismissableLayer", $e = "dismissableLayer.update", Sn = "dismissableLayer.pointerDownOutside", Rn = "dismissableLayer.focusOutside", bt, qe = c.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set(),
  // Outside elements that belong to a layer's own dismiss affordance (eg, a
  // dialog overlay). Pressing them should dismiss the layer regardless of
  // whether or not they stop propagation.
  //
  // See https://github.com/radix-ui/primitives/issues/3346
  dismissableSurfaces: /* @__PURE__ */ new Set()
}), Gt = c.forwardRef(
  (e, t) => {
    const {
      disableOutsidePointerEvents: r = !1,
      deferPointerDownOutside: n = !1,
      onEscapeKeyDown: o,
      onPointerDownOutside: s,
      onFocusOutside: a,
      onInteractOutside: i,
      onDismiss: m,
      ...l
    } = e, d = c.useContext(qe), [u, p] = c.useState(null), y = (u == null ? void 0 : u.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, E] = c.useState({}), f = J(t, p), g = Array.from(d.layers), [x] = [
      ...d.layersWithOutsidePointerEventsDisabled
    ].slice(-1), C = x ? g.indexOf(x) : -1, k = u ? g.indexOf(u) : -1, R = d.layersWithOutsidePointerEventsDisabled.size > 0, P = k >= C, N = c.useRef(!1), D = Dn(
      (O) => {
        s == null || s(O), i == null || i(O), O.defaultPrevented || m == null || m();
      },
      {
        ownerDocument: y,
        deferPointerDownOutside: n,
        isDeferredPointerDownOutsideRef: N,
        dismissableSurfaces: d.dismissableSurfaces,
        shouldHandlePointerDownOutside: c.useCallback(
          (O) => {
            if (!(O instanceof Node))
              return !1;
            const z = [...d.branches].some(
              (ae) => ae.contains(O)
            );
            return P && !z;
          },
          [d.branches, P]
        )
      }
    ), v = In((O) => {
      if (n && N.current)
        return;
      const z = O.target;
      [...d.branches].some((ie) => ie.contains(z)) || (a == null || a(O), i == null || i(O), O.defaultPrevented || m == null || m());
    }, y), I = u ? k === g.length - 1 : !1, $ = de((O) => {
      O.key === "Escape" && (o == null || o(O), !O.defaultPrevented && m && (O.preventDefault(), m()));
    });
    return c.useEffect(() => {
      if (I)
        return y.addEventListener("keydown", $, { capture: !0 }), () => y.removeEventListener("keydown", $, { capture: !0 });
    }, [y, I, $]), c.useEffect(() => {
      if (u)
        return r && (d.layersWithOutsidePointerEventsDisabled.size === 0 && (bt = y.body.style.pointerEvents, y.body.style.pointerEvents = "none"), d.layersWithOutsidePointerEventsDisabled.add(u)), d.layers.add(u), ht(), () => {
          r && (d.layersWithOutsidePointerEventsDisabled.delete(u), d.layersWithOutsidePointerEventsDisabled.size === 0 && (y.body.style.pointerEvents = bt));
        };
    }, [u, y, r, d]), c.useEffect(() => () => {
      u && (d.layers.delete(u), d.layersWithOutsidePointerEventsDisabled.delete(u), ht());
    }, [u, d]), c.useEffect(() => {
      const O = () => E({});
      return document.addEventListener($e, O), () => document.removeEventListener($e, O);
    }, []), /* @__PURE__ */ A.jsx(
      G.div,
      {
        ...l,
        ref: f,
        style: {
          pointerEvents: R ? P ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: X(e.onFocusCapture, v.onFocusCapture),
        onBlurCapture: X(e.onBlurCapture, v.onBlurCapture),
        onPointerDownCapture: X(
          e.onPointerDownCapture,
          D.onPointerDownCapture
        )
      }
    );
  }
);
Gt.displayName = Cn;
var Pn = "DismissableLayerBranch", On = c.forwardRef((e, t) => {
  const r = c.useContext(qe), n = c.useRef(null), o = J(t, n);
  return c.useEffect(() => {
    const s = n.current;
    if (s)
      return r.branches.add(s), () => {
        r.branches.delete(s);
      };
  }, [r.branches]), /* @__PURE__ */ A.jsx(G.div, { ...e, ref: o });
});
On.displayName = Pn;
function An() {
  const e = c.useContext(qe), [t, r] = c.useState(null);
  return c.useEffect(() => {
    if (t)
      return e.dismissableSurfaces.add(t), () => {
        e.dismissableSurfaces.delete(t);
      };
  }, [t, e.dismissableSurfaces]), r;
}
var Nn = () => !0;
function Dn(e, t) {
  const {
    ownerDocument: r = globalThis == null ? void 0 : globalThis.document,
    deferPointerDownOutside: n = !1,
    isDeferredPointerDownOutsideRef: o,
    dismissableSurfaces: s,
    shouldHandlePointerDownOutside: a = Nn
  } = t, i = de(e), m = c.useRef(!1), l = c.useRef(!1), d = c.useRef(/* @__PURE__ */ new Map()), u = c.useRef(() => {
  });
  return c.useEffect(() => {
    function p() {
      l.current = !1, o.current = !1, d.current.clear();
    }
    function y() {
      return Array.from(d.current.values()).some(Boolean);
    }
    function E(k) {
      if (!l.current)
        return;
      const R = k.target;
      R instanceof Node && [...s].some((N) => N.contains(R)) || d.current.set(k.type, !0), k.type === "click" && window.setTimeout(() => {
        l.current && u.current();
      }, 0);
    }
    function f(k) {
      l.current && d.current.set(k.type, !1);
    }
    const g = (k) => {
      if (k.target && !m.current) {
        let R = function() {
          r.removeEventListener("click", u.current);
          const N = y();
          p(), N || $t(
            Sn,
            i,
            P,
            { discrete: !0 }
          );
        };
        if (!a(k.target)) {
          r.removeEventListener("click", u.current), p(), m.current = !1;
          return;
        }
        const P = { originalEvent: k };
        l.current = !0, o.current = n && k.button === 0, d.current.clear(), !n || k.button !== 0 ? R() : (r.removeEventListener("click", u.current), u.current = R, r.addEventListener("click", u.current, { once: !0 }));
      } else
        r.removeEventListener("click", u.current), p();
      m.current = !1;
    }, x = [
      "pointerup",
      "mousedown",
      "mouseup",
      "touchstart",
      "touchend",
      "click"
    ];
    for (const k of x)
      r.addEventListener(k, E, !0), r.addEventListener(k, f);
    const C = window.setTimeout(() => {
      r.addEventListener("pointerdown", g);
    }, 0);
    return () => {
      window.clearTimeout(C), r.removeEventListener("pointerdown", g), r.removeEventListener("click", u.current);
      for (const k of x)
        r.removeEventListener(k, E, !0), r.removeEventListener(k, f);
    };
  }, [
    r,
    i,
    n,
    o,
    s,
    a
  ]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => m.current = !0
  };
}
function In(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = de(e), n = c.useRef(!1);
  return c.useEffect(() => {
    const o = (s) => {
      s.target && !n.current && $t(Rn, r, { originalEvent: s }, {
        discrete: !1
      });
    };
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, r]), {
    onFocusCapture: () => n.current = !0,
    onBlurCapture: () => n.current = !1
  };
}
function ht() {
  const e = new CustomEvent($e);
  document.dispatchEvent(e);
}
function $t(e, t, r, { discrete: n }) {
  const o = r.originalEvent.target, s = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: r });
  t && o.addEventListener(e, t, { once: !0 }), n ? En(o, s) : o.dispatchEvent(s);
}
var ze = "focusScope.autoFocusOnMount", Fe = "focusScope.autoFocusOnUnmount", gt = { bubbles: !1, cancelable: !0 }, Tn = "FocusScope", Yt = c.forwardRef((e, t) => {
  const {
    loop: r = !1,
    trapped: n = !1,
    onMountAutoFocus: o,
    onUnmountAutoFocus: s,
    ...a
  } = e, [i, m] = c.useState(null), l = de(o), d = de(s), u = c.useRef(null), p = J(t, m), y = c.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  c.useEffect(() => {
    if (n) {
      let f = function(k) {
        if (y.paused || !i) return;
        const R = k.target;
        i.contains(R) ? u.current = R : K(u.current, { select: !0 });
      }, g = function(k) {
        if (y.paused || !i) return;
        const R = k.relatedTarget;
        R !== null && (i.contains(R) || K(u.current, { select: !0 }));
      }, x = function(k) {
        if (document.activeElement === document.body)
          for (const P of k)
            P.removedNodes.length > 0 && K(i);
      };
      document.addEventListener("focusin", f), document.addEventListener("focusout", g);
      const C = new MutationObserver(x);
      return i && C.observe(i, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", f), document.removeEventListener("focusout", g), C.disconnect();
      };
    }
  }, [n, i, y.paused]), c.useEffect(() => {
    if (i) {
      yt.add(y);
      const f = document.activeElement;
      if (!i.contains(f)) {
        const x = new CustomEvent(ze, gt);
        i.addEventListener(ze, l), i.dispatchEvent(x), x.defaultPrevented || (Mn(jn(Kt(i)), { select: !0 }), document.activeElement === f && K(i));
      }
      return () => {
        i.removeEventListener(ze, l), setTimeout(() => {
          const x = new CustomEvent(Fe, gt);
          i.addEventListener(Fe, d), i.dispatchEvent(x), x.defaultPrevented || K(f ?? document.body, { select: !0 }), i.removeEventListener(Fe, d), yt.remove(y);
        }, 0);
      };
    }
  }, [i, l, d, y]);
  const E = c.useCallback(
    (f) => {
      if (!r && !n || y.paused) return;
      const g = f.key === "Tab" && !f.altKey && !f.ctrlKey && !f.metaKey, x = document.activeElement;
      if (g && x) {
        const C = f.currentTarget, [k, R] = Ln(C);
        k && R ? !f.shiftKey && x === R ? (f.preventDefault(), r && K(k, { select: !0 })) : f.shiftKey && x === k && (f.preventDefault(), r && K(R, { select: !0 })) : x === C && f.preventDefault();
      }
    },
    [r, n, y.paused]
  );
  return /* @__PURE__ */ A.jsx(G.div, { tabIndex: -1, ...a, ref: p, onKeyDown: E });
});
Yt.displayName = Tn;
function Mn(e, { select: t = !1 } = {}) {
  const r = document.activeElement;
  for (const n of e)
    if (K(n, { select: t }), document.activeElement !== r) return;
}
function Ln(e) {
  const t = Kt(e), r = vt(t, e), n = vt(t.reverse(), e);
  return [r, n];
}
function Kt(e) {
  const t = [], r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) => {
      const o = n.tagName === "INPUT" && n.type === "hidden";
      return n.disabled || n.hidden || o ? NodeFilter.FILTER_SKIP : n.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; r.nextNode(); ) t.push(r.currentNode);
  return t;
}
function vt(e, t) {
  const r = typeof t.checkVisibility == "function" && t.checkVisibility({ checkVisibilityCSS: !0 });
  for (const n of e)
    if (!(r ? !n.checkVisibility({ checkVisibilityCSS: !0 }) : _n(n, { upTo: t })))
      return n;
}
function _n(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function zn(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function K(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const r = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== r && zn(e) && t && e.select();
  }
}
var yt = Fn();
function Fn() {
  let e = [];
  return {
    add(t) {
      const r = e[0];
      t !== r && (r == null || r.pause()), e = wt(e, t), e.unshift(t);
    },
    remove(t) {
      var r;
      e = wt(e, t), (r = e[0]) == null || r.resume();
    }
  };
}
function wt(e, t) {
  const r = [...e], n = r.indexOf(t);
  return n !== -1 && r.splice(n, 1), r;
}
function jn(e) {
  return e.filter((t) => t.tagName !== "A");
}
var Wn = "Portal", Xt = c.forwardRef((e, t) => {
  var i;
  const { container: r, ...n } = e, [o, s] = c.useState(!1);
  ue(() => s(!0), []);
  const a = r || o && ((i = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : i.body);
  return a ? Ot.createPortal(/* @__PURE__ */ A.jsx(G.div, { ...n, ref: t }), a) : null;
});
Xt.displayName = Wn;
function Bn(e, t) {
  return c.useReducer((r, n) => t[r][n] ?? r, e);
}
var Oe = (e) => {
  const { present: t, children: r } = e, n = Vn(t), o = typeof r == "function" ? r({ present: n.isPresent }) : c.Children.only(r), s = Un(n.ref, Gn(o));
  return typeof r == "function" || n.isPresent ? c.cloneElement(o, { ref: s }) : null;
};
Oe.displayName = "Presence";
function Vn(e) {
  const [t, r] = c.useState(), n = c.useRef(null), o = c.useRef(e), s = c.useRef("none"), a = c.useRef(void 0), i = e ? "mounted" : "unmounted", [m, l] = Bn(i, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return c.useEffect(() => {
    m === "mounted" ? (s.current = a.current ?? le(n.current), a.current = void 0) : s.current = "none";
  }, [m]), ue(() => {
    const d = n.current, u = o.current;
    if (u !== e) {
      const y = s.current, E = le(d);
      e ? (a.current = E, l("MOUNT")) : E === "none" || (d == null ? void 0 : d.display) === "none" ? l("UNMOUNT") : l(u && y !== E ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, l]), ue(() => {
    if (t) {
      let d;
      const u = t.ownerDocument.defaultView ?? window, p = (E) => {
        const g = le(n.current).includes(CSS.escape(E.animationName));
        if (E.target === t && g && (l("ANIMATION_END"), !o.current)) {
          const x = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", d = u.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = x);
          });
        }
      }, y = (E) => {
        E.target === t && (s.current = le(n.current));
      };
      return t.addEventListener("animationstart", y), t.addEventListener("animationcancel", p), t.addEventListener("animationend", p), () => {
        u.clearTimeout(d), t.removeEventListener("animationstart", y), t.removeEventListener("animationcancel", p), t.removeEventListener("animationend", p);
      };
    } else
      l("ANIMATION_END");
  }, [t, l]), {
    isPresent: ["mounted", "unmountSuspended"].includes(m),
    ref: c.useCallback((d) => {
      if (d) {
        const u = getComputedStyle(d);
        n.current = u, a.current = le(u);
      } else
        n.current = null;
      r(d);
    }, [])
  };
}
function xt(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function Un(...e) {
  const t = c.useRef(e);
  return t.current = e, c.useCallback((r) => {
    const n = t.current;
    let o = !1;
    const s = n.map((a) => {
      const i = xt(a, r);
      return !o && typeof i == "function" && (o = !0), i;
    });
    if (o)
      return () => {
        for (let a = 0; a < s.length; a++) {
          const i = s[a];
          typeof i == "function" ? i() : xt(n[a], null);
        }
      };
  }, []);
}
function le(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function Gn(e) {
  var n, o;
  let t = (n = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : n.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
var ye = 0, B = null;
function $n() {
  c.useEffect(() => {
    B || (B = { start: kt(), end: kt() });
    const { start: e, end: t } = B;
    return document.body.firstElementChild !== e && document.body.insertAdjacentElement("afterbegin", e), document.body.lastElementChild !== t && document.body.insertAdjacentElement("beforeend", t), ye++, () => {
      ye === 1 && (B == null || B.start.remove(), B == null || B.end.remove(), B = null), ye = Math.max(0, ye - 1);
    };
  }, []);
}
function kt() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var V = function() {
  return V = Object.assign || function(t) {
    for (var r, n = 1, o = arguments.length; n < o; n++) {
      r = arguments[n];
      for (var s in r) Object.prototype.hasOwnProperty.call(r, s) && (t[s] = r[s]);
    }
    return t;
  }, V.apply(this, arguments);
};
function Ht(e, t) {
  var r = {};
  for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, n = Object.getOwnPropertySymbols(e); o < n.length; o++)
      t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]]);
  return r;
}
function Yn(e, t, r) {
  if (r || arguments.length === 2) for (var n = 0, o = t.length, s; n < o; n++)
    (s || !(n in t)) && (s || (s = Array.prototype.slice.call(t, 0, n)), s[n] = t[n]);
  return e.concat(s || Array.prototype.slice.call(t));
}
var Ce = "right-scroll-bar-position", Se = "width-before-scroll-bar", Kn = "with-scroll-bars-hidden", Xn = "--removed-body-scroll-bar-size";
function je(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function Hn(e, t) {
  var r = c.useState(function() {
    return {
      // value
      value: e,
      // last callback
      callback: t,
      // "memoized" public interface
      facade: {
        get current() {
          return r.value;
        },
        set current(n) {
          var o = r.value;
          o !== n && (r.value = n, r.callback(n, o));
        }
      }
    };
  })[0];
  return r.callback = t, r.facade;
}
var Zn = typeof window < "u" ? c.useLayoutEffect : c.useEffect, Et = /* @__PURE__ */ new WeakMap();
function qn(e, t) {
  var r = Hn(null, function(n) {
    return e.forEach(function(o) {
      return je(o, n);
    });
  });
  return Zn(function() {
    var n = Et.get(r);
    if (n) {
      var o = new Set(n), s = new Set(e), a = r.current;
      o.forEach(function(i) {
        s.has(i) || je(i, null);
      }), s.forEach(function(i) {
        o.has(i) || je(i, a);
      });
    }
    Et.set(r, e);
  }, [e]), r;
}
function Qn(e) {
  return e;
}
function Jn(e, t) {
  t === void 0 && (t = Qn);
  var r = [], n = !1, o = {
    read: function() {
      if (n)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return r.length ? r[r.length - 1] : e;
    },
    useMedium: function(s) {
      var a = t(s, n);
      return r.push(a), function() {
        r = r.filter(function(i) {
          return i !== a;
        });
      };
    },
    assignSyncMedium: function(s) {
      for (n = !0; r.length; ) {
        var a = r;
        r = [], a.forEach(s);
      }
      r = {
        push: function(i) {
          return s(i);
        },
        filter: function() {
          return r;
        }
      };
    },
    assignMedium: function(s) {
      n = !0;
      var a = [];
      if (r.length) {
        var i = r;
        r = [], i.forEach(s), a = r;
      }
      var m = function() {
        var d = a;
        a = [], d.forEach(s);
      }, l = function() {
        return Promise.resolve().then(m);
      };
      l(), r = {
        push: function(d) {
          a.push(d), l();
        },
        filter: function(d) {
          return a = a.filter(d), r;
        }
      };
    }
  };
  return o;
}
function eo(e) {
  e === void 0 && (e = {});
  var t = Jn(null);
  return t.options = V({ async: !0, ssr: !1 }, e), t;
}
var Zt = function(e) {
  var t = e.sideCar, r = Ht(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var n = t.read();
  if (!n)
    throw new Error("Sidecar medium not found");
  return c.createElement(n, V({}, r));
};
Zt.isSideCarExport = !0;
function to(e, t) {
  return e.useMedium(t), Zt;
}
var qt = eo(), We = function() {
}, Ae = c.forwardRef(function(e, t) {
  var r = c.useRef(null), n = c.useState({
    onScrollCapture: We,
    onWheelCapture: We,
    onTouchMoveCapture: We
  }), o = n[0], s = n[1], a = e.forwardProps, i = e.children, m = e.className, l = e.removeScrollBar, d = e.enabled, u = e.shards, p = e.sideCar, y = e.noRelative, E = e.noIsolation, f = e.inert, g = e.allowPinchZoom, x = e.as, C = x === void 0 ? "div" : x, k = e.gapMode, R = Ht(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), P = p, N = qn([r, t]), D = V(V({}, R), o);
  return c.createElement(
    c.Fragment,
    null,
    d && c.createElement(P, { sideCar: qt, removeScrollBar: l, shards: u, noRelative: y, noIsolation: E, inert: f, setCallbacks: s, allowPinchZoom: !!g, lockRef: r, gapMode: k }),
    a ? c.cloneElement(c.Children.only(i), V(V({}, D), { ref: N })) : c.createElement(C, V({}, D, { className: m, ref: N }), i)
  );
});
Ae.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
Ae.classNames = {
  fullWidth: Se,
  zeroRight: Ce
};
var ro = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function no() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = ro();
  return t && e.setAttribute("nonce", t), e;
}
function oo(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function so(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var ao = function() {
  var e = 0, t = null;
  return {
    add: function(r) {
      e == 0 && (t = no()) && (oo(t, r), so(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, io = function() {
  var e = ao();
  return function(t, r) {
    c.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && r]);
  };
}, Qt = function() {
  var e = io(), t = function(r) {
    var n = r.styles, o = r.dynamic;
    return e(n, o), null;
  };
  return t;
}, co = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, Be = function(e) {
  return parseInt(e || "", 10) || 0;
}, lo = function(e) {
  var t = window.getComputedStyle(document.body), r = t[e === "padding" ? "paddingLeft" : "marginLeft"], n = t[e === "padding" ? "paddingTop" : "marginTop"], o = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [Be(r), Be(n), Be(o)];
}, uo = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return co;
  var t = lo(e), r = document.documentElement.clientWidth, n = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, n - r + t[2] - t[0])
  };
}, fo = Qt(), oe = "data-scroll-locked", mo = function(e, t, r, n) {
  var o = e.left, s = e.top, a = e.right, i = e.gap;
  return r === void 0 && (r = "margin"), `
  .`.concat(Kn, ` {
   overflow: hidden `).concat(n, `;
   padding-right: `).concat(i, "px ").concat(n, `;
  }
  body[`).concat(oe, `] {
    overflow: hidden `).concat(n, `;
    overscroll-behavior: contain;
    `).concat([
    t && "position: relative ".concat(n, ";"),
    r === "margin" && `
    padding-left: `.concat(o, `px;
    padding-top: `).concat(s, `px;
    padding-right: `).concat(a, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(i, "px ").concat(n, `;
    `),
    r === "padding" && "padding-right: ".concat(i, "px ").concat(n, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(Ce, ` {
    right: `).concat(i, "px ").concat(n, `;
  }
  
  .`).concat(Se, ` {
    margin-right: `).concat(i, "px ").concat(n, `;
  }
  
  .`).concat(Ce, " .").concat(Ce, ` {
    right: 0 `).concat(n, `;
  }
  
  .`).concat(Se, " .").concat(Se, ` {
    margin-right: 0 `).concat(n, `;
  }
  
  body[`).concat(oe, `] {
    `).concat(Xn, ": ").concat(i, `px;
  }
`);
}, Ct = function() {
  var e = parseInt(document.body.getAttribute(oe) || "0", 10);
  return isFinite(e) ? e : 0;
}, po = function() {
  c.useEffect(function() {
    return document.body.setAttribute(oe, (Ct() + 1).toString()), function() {
      var e = Ct() - 1;
      e <= 0 ? document.body.removeAttribute(oe) : document.body.setAttribute(oe, e.toString());
    };
  }, []);
}, bo = function(e) {
  var t = e.noRelative, r = e.noImportant, n = e.gapMode, o = n === void 0 ? "margin" : n;
  po();
  var s = c.useMemo(function() {
    return uo(o);
  }, [o]);
  return c.createElement(fo, { styles: mo(s, !t, o, r ? "" : "!important") });
}, Ye = !1;
if (typeof window < "u")
  try {
    var we = Object.defineProperty({}, "passive", {
      get: function() {
        return Ye = !0, !0;
      }
    });
    window.addEventListener("test", we, we), window.removeEventListener("test", we, we);
  } catch {
    Ye = !1;
  }
var te = Ye ? { passive: !1 } : !1, ho = function(e) {
  return e.tagName === "TEXTAREA";
}, Jt = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var r = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    r[t] !== "hidden" && // contains scroll inside self
    !(r.overflowY === r.overflowX && !ho(e) && r[t] === "visible")
  );
}, go = function(e) {
  return Jt(e, "overflowY");
}, vo = function(e) {
  return Jt(e, "overflowX");
}, St = function(e, t) {
  var r = t.ownerDocument, n = t;
  do {
    typeof ShadowRoot < "u" && n instanceof ShadowRoot && (n = n.host);
    var o = er(e, n);
    if (o) {
      var s = tr(e, n), a = s[1], i = s[2];
      if (a > i)
        return !0;
    }
    n = n.parentNode;
  } while (n && n !== r.body);
  return !1;
}, yo = function(e) {
  var t = e.scrollTop, r = e.scrollHeight, n = e.clientHeight;
  return [
    t,
    r,
    n
  ];
}, wo = function(e) {
  var t = e.scrollLeft, r = e.scrollWidth, n = e.clientWidth;
  return [
    t,
    r,
    n
  ];
}, er = function(e, t) {
  return e === "v" ? go(t) : vo(t);
}, tr = function(e, t) {
  return e === "v" ? yo(t) : wo(t);
}, xo = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, ko = function(e, t, r, n, o) {
  var s = xo(e, window.getComputedStyle(t).direction), a = s * n, i = r.target, m = t.contains(i), l = !1, d = a > 0, u = 0, p = 0;
  do {
    if (!i)
      break;
    var y = tr(e, i), E = y[0], f = y[1], g = y[2], x = f - g - s * E;
    (E || x) && er(e, i) && (u += x, p += E);
    var C = i.parentNode;
    i = C && C.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? C.host : C;
  } while (
    // portaled content
    !m && i !== document.body || // self content
    m && (t.contains(i) || t === i)
  );
  return (d && Math.abs(u) < 1 || !d && Math.abs(p) < 1) && (l = !0), l;
}, xe = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, Rt = function(e) {
  return [e.deltaX, e.deltaY];
}, Pt = function(e) {
  return e && "current" in e ? e.current : e;
}, Eo = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, Co = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, So = 0, re = [];
function Ro(e) {
  var t = c.useRef([]), r = c.useRef([0, 0]), n = c.useRef(), o = c.useState(So++)[0], s = c.useState(Qt)[0], a = c.useRef(e);
  c.useEffect(function() {
    a.current = e;
  }, [e]), c.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var f = Yn([e.lockRef.current], (e.shards || []).map(Pt), !0).filter(Boolean);
      return f.forEach(function(g) {
        return g.classList.add("allow-interactivity-".concat(o));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(o)), f.forEach(function(g) {
          return g.classList.remove("allow-interactivity-".concat(o));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var i = c.useCallback(function(f, g) {
    if ("touches" in f && f.touches.length === 2 || f.type === "wheel" && f.ctrlKey)
      return !a.current.allowPinchZoom;
    var x = xe(f), C = r.current, k = "deltaX" in f ? f.deltaX : C[0] - x[0], R = "deltaY" in f ? f.deltaY : C[1] - x[1], P, N = f.target, D = Math.abs(k) > Math.abs(R) ? "h" : "v";
    if ("touches" in f && D === "h" && N.type === "range")
      return !1;
    var v = window.getSelection(), I = v && v.anchorNode, $ = I ? I === N || I.contains(N) : !1;
    if ($)
      return !1;
    var O = St(D, N);
    if (!O)
      return !0;
    if (O ? P = D : (P = D === "v" ? "h" : "v", O = St(D, N)), !O)
      return !1;
    if (!n.current && "changedTouches" in f && (k || R) && (n.current = P), !P)
      return !0;
    var z = n.current || P;
    return ko(z, g, f, z === "h" ? k : R);
  }, []), m = c.useCallback(function(f) {
    var g = f;
    if (!(!re.length || re[re.length - 1] !== s)) {
      var x = "deltaY" in g ? Rt(g) : xe(g), C = t.current.filter(function(P) {
        return P.name === g.type && (P.target === g.target || g.target === P.shadowParent) && Eo(P.delta, x);
      })[0];
      if (C && C.should) {
        g.cancelable && g.preventDefault();
        return;
      }
      if (!C) {
        var k = (a.current.shards || []).map(Pt).filter(Boolean).filter(function(P) {
          return P.contains(g.target);
        }), R = k.length > 0 ? i(g, k[0]) : !a.current.noIsolation;
        R && g.cancelable && g.preventDefault();
      }
    }
  }, []), l = c.useCallback(function(f, g, x, C) {
    var k = { name: f, delta: g, target: x, should: C, shadowParent: Po(x) };
    t.current.push(k), setTimeout(function() {
      t.current = t.current.filter(function(R) {
        return R !== k;
      });
    }, 1);
  }, []), d = c.useCallback(function(f) {
    r.current = xe(f), n.current = void 0;
  }, []), u = c.useCallback(function(f) {
    l(f.type, Rt(f), f.target, i(f, e.lockRef.current));
  }, []), p = c.useCallback(function(f) {
    l(f.type, xe(f), f.target, i(f, e.lockRef.current));
  }, []);
  c.useEffect(function() {
    return re.push(s), e.setCallbacks({
      onScrollCapture: u,
      onWheelCapture: u,
      onTouchMoveCapture: p
    }), document.addEventListener("wheel", m, te), document.addEventListener("touchmove", m, te), document.addEventListener("touchstart", d, te), function() {
      re = re.filter(function(f) {
        return f !== s;
      }), document.removeEventListener("wheel", m, te), document.removeEventListener("touchmove", m, te), document.removeEventListener("touchstart", d, te);
    };
  }, []);
  var y = e.removeScrollBar, E = e.inert;
  return c.createElement(
    c.Fragment,
    null,
    E ? c.createElement(s, { styles: Co(o) }) : null,
    y ? c.createElement(bo, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function Po(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const Oo = to(qt, Ro);
var rr = c.forwardRef(function(e, t) {
  return c.createElement(Ae, V({}, e, { ref: t, sideCar: Oo }));
});
rr.classNames = Ae.classNames;
var Ao = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, ne = /* @__PURE__ */ new WeakMap(), ke = /* @__PURE__ */ new WeakMap(), Ee = {}, Ve = 0, nr = function(e) {
  return e && (e.host || nr(e.parentNode));
}, No = function(e, t) {
  return t.map(function(r) {
    if (e.contains(r))
      return r;
    var n = nr(r);
    return n && e.contains(n) ? n : (console.error("aria-hidden", r, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(r) {
    return !!r;
  });
}, Do = function(e, t, r, n) {
  var o = No(t, Array.isArray(e) ? e : [e]);
  Ee[r] || (Ee[r] = /* @__PURE__ */ new WeakMap());
  var s = Ee[r], a = [], i = /* @__PURE__ */ new Set(), m = new Set(o), l = function(u) {
    !u || i.has(u) || (i.add(u), l(u.parentNode));
  };
  o.forEach(l);
  var d = function(u) {
    !u || m.has(u) || Array.prototype.forEach.call(u.children, function(p) {
      if (i.has(p))
        d(p);
      else
        try {
          var y = p.getAttribute(n), E = y !== null && y !== "false", f = (ne.get(p) || 0) + 1, g = (s.get(p) || 0) + 1;
          ne.set(p, f), s.set(p, g), a.push(p), f === 1 && E && ke.set(p, !0), g === 1 && p.setAttribute(r, "true"), E || p.setAttribute(n, "true");
        } catch (x) {
          console.error("aria-hidden: cannot operate on ", p, x);
        }
    });
  };
  return d(t), i.clear(), Ve++, function() {
    a.forEach(function(u) {
      var p = ne.get(u) - 1, y = s.get(u) - 1;
      ne.set(u, p), s.set(u, y), p || (ke.has(u) || u.removeAttribute(n), ke.delete(u)), y || u.removeAttribute(r);
    }), Ve--, Ve || (ne = /* @__PURE__ */ new WeakMap(), ne = /* @__PURE__ */ new WeakMap(), ke = /* @__PURE__ */ new WeakMap(), Ee = {});
  };
}, Io = function(e, t, r) {
  r === void 0 && (r = "data-aria-hidden");
  var n = Array.from(Array.isArray(e) ? e : [e]), o = Ao(e);
  return o ? (n.push.apply(n, Array.from(o.querySelectorAll("[aria-live], script"))), Do(n, o, r, "aria-hidden")) : function() {
    return null;
  };
}, Ne = "Dialog", [or] = pn(Ne), [To, j] = or(Ne), Mo = (e) => {
  const {
    __scopeDialog: t,
    children: r,
    open: n,
    defaultOpen: o,
    onOpenChange: s,
    modal: a = !0
  } = e, i = c.useRef(null), m = c.useRef(null), [l, d] = yn({
    prop: n,
    defaultProp: o ?? !1,
    onChange: s,
    caller: Ne
  });
  return /* @__PURE__ */ A.jsx(
    To,
    {
      scope: t,
      triggerRef: i,
      contentRef: m,
      contentId: _e(),
      titleId: _e(),
      descriptionId: _e(),
      open: l,
      onOpenChange: d,
      onOpenToggle: c.useCallback(() => d((u) => !u), [d]),
      modal: a,
      children: r
    }
  );
};
Mo.displayName = Ne;
var sr = "DialogTrigger", Lo = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = j(sr, r), s = J(t, o.triggerRef);
    return /* @__PURE__ */ A.jsx(
      G.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.open ? o.contentId : void 0,
        "data-state": Je(o.open),
        ...n,
        ref: s,
        onClick: X(e.onClick, o.onOpenToggle)
      }
    );
  }
);
Lo.displayName = sr;
var Qe = "DialogPortal", [_o, ar] = or(Qe, {
  forceMount: void 0
}), zo = (e) => {
  const { __scopeDialog: t, forceMount: r, children: n, container: o } = e, s = j(Qe, t);
  return /* @__PURE__ */ A.jsx(_o, { scope: t, forceMount: r, children: c.Children.map(n, (a) => /* @__PURE__ */ A.jsx(Oe, { present: r || s.open, children: /* @__PURE__ */ A.jsx(Xt, { asChild: !0, container: o, children: a }) })) });
};
zo.displayName = Qe;
var Pe = "DialogOverlay", Fo = c.forwardRef(
  (e, t) => {
    const r = ar(Pe, e.__scopeDialog), { forceMount: n = r.forceMount, ...o } = e, s = j(Pe, e.__scopeDialog);
    return s.modal ? /* @__PURE__ */ A.jsx(Oe, { present: n || s.open, children: /* @__PURE__ */ A.jsx(Wo, { ...o, ref: t }) }) : null;
  }
);
Fo.displayName = Pe;
var jo = /* @__PURE__ */ Ze("DialogOverlay.RemoveScroll"), Wo = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = j(Pe, r), s = An(), a = J(t, s);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ A.jsx(rr, { as: jo, allowPinchZoom: !0, shards: [o.contentRef], children: /* @__PURE__ */ A.jsx(
        G.div,
        {
          "data-state": Je(o.open),
          ...n,
          ref: a,
          style: { pointerEvents: "auto", ...n.style }
        }
      ) })
    );
  }
), se = "DialogContent", Bo = c.forwardRef(
  (e, t) => {
    const r = ar(se, e.__scopeDialog), { forceMount: n = r.forceMount, ...o } = e, s = j(se, e.__scopeDialog);
    return /* @__PURE__ */ A.jsx(Oe, { present: n || s.open, children: s.modal ? /* @__PURE__ */ A.jsx(Vo, { ...o, ref: t }) : /* @__PURE__ */ A.jsx(Uo, { ...o, ref: t }) });
  }
);
Bo.displayName = se;
var Vo = c.forwardRef(
  (e, t) => {
    const r = j(se, e.__scopeDialog), n = c.useRef(null), o = J(t, r.contentRef, n);
    return c.useEffect(() => {
      const s = n.current;
      if (s) return Io(s);
    }, []), /* @__PURE__ */ A.jsx(
      ir,
      {
        ...e,
        ref: o,
        trapFocus: r.open,
        disableOutsidePointerEvents: r.open,
        onCloseAutoFocus: X(e.onCloseAutoFocus, (s) => {
          var a;
          s.preventDefault(), (a = r.triggerRef.current) == null || a.focus();
        }),
        onPointerDownOutside: X(e.onPointerDownOutside, (s) => {
          const a = s.detail.originalEvent, i = a.button === 0 && a.ctrlKey === !0;
          (a.button === 2 || i) && s.preventDefault();
        }),
        onFocusOutside: X(
          e.onFocusOutside,
          (s) => s.preventDefault()
        )
      }
    );
  }
), Uo = c.forwardRef(
  (e, t) => {
    const r = j(se, e.__scopeDialog), n = c.useRef(!1), o = c.useRef(!1);
    return /* @__PURE__ */ A.jsx(
      ir,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (s) => {
          var a, i;
          (a = e.onCloseAutoFocus) == null || a.call(e, s), s.defaultPrevented || (n.current || (i = r.triggerRef.current) == null || i.focus(), s.preventDefault()), n.current = !1, o.current = !1;
        },
        onInteractOutside: (s) => {
          var m, l;
          (m = e.onInteractOutside) == null || m.call(e, s), s.defaultPrevented || (n.current = !0, s.detail.originalEvent.type === "pointerdown" && (o.current = !0));
          const a = s.target;
          ((l = r.triggerRef.current) == null ? void 0 : l.contains(a)) && s.preventDefault(), s.detail.originalEvent.type === "focusin" && o.current && s.preventDefault();
        }
      }
    );
  }
), ir = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, trapFocus: n, onOpenAutoFocus: o, onCloseAutoFocus: s, ...a } = e, i = j(se, r);
    return $n(), /* @__PURE__ */ A.jsx(A.Fragment, { children: /* @__PURE__ */ A.jsx(
      Yt,
      {
        asChild: !0,
        loop: !0,
        trapped: n,
        onMountAutoFocus: o,
        onUnmountAutoFocus: s,
        children: /* @__PURE__ */ A.jsx(
          Gt,
          {
            role: "dialog",
            id: i.contentId,
            "aria-describedby": i.descriptionId,
            "aria-labelledby": i.titleId,
            "data-state": Je(i.open),
            ...a,
            ref: t,
            deferPointerDownOutside: !0,
            onDismiss: () => i.onOpenChange(!1)
          }
        )
      }
    ) });
  }
), cr = "DialogTitle", Go = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = j(cr, r);
    return /* @__PURE__ */ A.jsx(G.h2, { id: o.titleId, ...n, ref: t });
  }
);
Go.displayName = cr;
var lr = "DialogDescription", $o = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = j(lr, r);
    return /* @__PURE__ */ A.jsx(G.p, { id: o.descriptionId, ...n, ref: t });
  }
);
$o.displayName = lr;
var ur = "DialogClose", Yo = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = j(ur, r);
    return /* @__PURE__ */ A.jsx(
      G.button,
      {
        type: "button",
        ...n,
        ref: t,
        onClick: X(e.onClick, () => o.onOpenChange(!1))
      }
    );
  }
);
Yo.displayName = ur;
function Je(e) {
  return e ? "open" : "closed";
}
export {
  zo as D,
  Zo as S,
  qo as a,
  Fo as b,
  Ue as c,
  Bo as d,
  Go as e,
  $o as f,
  Mo as g,
  Lo as h,
  Yo as i,
  Ho as r,
  Xo as t
};
