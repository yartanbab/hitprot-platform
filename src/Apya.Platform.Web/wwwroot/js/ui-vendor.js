import { g as qn, r as c, R as ye, j as D, a as Bt } from "./react-vendor.js";
function Ut(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (n = Ut(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function qe() {
  for (var e, t, n = 0, r = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = Ut(e)) && (r && (r += " "), r += t);
  return r;
}
const Qn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clsx: qe,
  default: qe
}, Symbol.toStringTag, { value: "Module" })), Jn = (e, t) => {
  const n = new Array(e.length + t.length);
  for (let r = 0; r < e.length; r++)
    n[r] = e[r];
  for (let r = 0; r < t.length; r++)
    n[e.length + r] = t[r];
  return n;
}, er = (e, t) => ({
  classGroupId: e,
  validator: t
}), Gt = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
  nextPart: e,
  validators: t,
  classGroupId: n
}), Le = "-", St = [], tr = "arbitrary..", nr = (e) => {
  const t = or(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: r
  } = e;
  return {
    getClassGroupId: (a) => {
      if (a.startsWith("[") && a.endsWith("]"))
        return rr(a);
      const i = a.split(Le), l = i[0] === "" && i.length > 1 ? 1 : 0;
      return Yt(i, l, t);
    },
    getConflictingClassGroupIds: (a, i) => {
      if (i) {
        const l = r[a], u = n[a];
        return l ? u ? Jn(u, l) : l : u || St;
      }
      return n[a] || St;
    }
  };
}, Yt = (e, t, n) => {
  if (e.length - t === 0)
    return n.classGroupId;
  const o = e[t], s = n.nextPart.get(o);
  if (s) {
    const u = Yt(e, t + 1, s);
    if (u) return u;
  }
  const a = n.validators;
  if (a === null)
    return;
  const i = t === 0 ? e.join(Le) : e.slice(t).join(Le), l = a.length;
  for (let u = 0; u < l; u++) {
    const f = a[u];
    if (f.validator(i))
      return f.classGroupId;
  }
}, rr = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
  return r ? tr + r : void 0;
})(), or = (e) => {
  const {
    theme: t,
    classGroups: n
  } = e;
  return sr(n, t);
}, sr = (e, t) => {
  const n = Gt();
  for (const r in e) {
    const o = e[r];
    ut(o, n, r, t);
  }
  return n;
}, ut = (e, t, n, r) => {
  const o = e.length;
  for (let s = 0; s < o; s++) {
    const a = e[s];
    ar(a, t, n, r);
  }
}, ar = (e, t, n, r) => {
  if (typeof e == "string") {
    ir(e, t, n);
    return;
  }
  if (typeof e == "function") {
    cr(e, t, n, r);
    return;
  }
  lr(e, t, n, r);
}, ir = (e, t, n) => {
  const r = e === "" ? t : Kt(t, e);
  r.classGroupId = n;
}, cr = (e, t, n, r) => {
  if (ur(e)) {
    ut(e(r), t, n, r);
    return;
  }
  t.validators === null && (t.validators = []), t.validators.push(er(n, e));
}, lr = (e, t, n, r) => {
  const o = Object.entries(e), s = o.length;
  for (let a = 0; a < s; a++) {
    const [i, l] = o[a];
    ut(l, Kt(t, i), n, r);
  }
}, Kt = (e, t) => {
  let n = e;
  const r = t.split(Le), o = r.length;
  for (let s = 0; s < o; s++) {
    const a = r[s];
    let i = n.nextPart.get(a);
    i || (i = Gt(), n.nextPart.set(a, i)), n = i;
  }
  return n;
}, ur = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, dr = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, n = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null);
  const o = (s, a) => {
    n[s] = a, t++, t > e && (t = 0, r = n, n = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(s) {
      let a = n[s];
      if (a !== void 0)
        return a;
      if ((a = r[s]) !== void 0)
        return o(s, a), a;
    },
    set(s, a) {
      s in n ? n[s] = a : o(s, a);
    }
  };
}, Qe = "!", kt = ":", fr = [], Pt = (e, t, n, r, o) => ({
  modifiers: e,
  hasImportantModifier: t,
  baseClassName: n,
  maybePostfixModifierPosition: r,
  isExternal: o
}), mr = (e) => {
  const {
    prefix: t,
    experimentalParseClassName: n
  } = e;
  let r = (o) => {
    const s = [];
    let a = 0, i = 0, l = 0, u;
    const f = o.length;
    for (let b = 0; b < f; b++) {
      const p = o[b];
      if (a === 0 && i === 0) {
        if (p === kt) {
          s.push(o.slice(l, b)), l = b + 1;
          continue;
        }
        if (p === "/") {
          u = b;
          continue;
        }
      }
      p === "[" ? a++ : p === "]" ? a-- : p === "(" ? i++ : p === ")" && i--;
    }
    const d = s.length === 0 ? o : o.slice(l);
    let m = d, x = !1;
    d.endsWith(Qe) ? (m = d.slice(0, -1), x = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      d.startsWith(Qe) && (m = d.slice(1), x = !0)
    );
    const h = u && u > l ? u - l : void 0;
    return Pt(s, x, m, h);
  };
  if (t) {
    const o = t + kt, s = r;
    r = (a) => a.startsWith(o) ? s(a.slice(o.length)) : Pt(fr, !1, a, void 0, !0);
  }
  if (n) {
    const o = r;
    r = (s) => n({
      className: s,
      parseClassName: o
    });
  }
  return r;
}, pr = (e) => {
  const t = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((n, r) => {
    t.set(n, 1e6 + r);
  }), (n) => {
    const r = [];
    let o = [];
    for (let s = 0; s < n.length; s++) {
      const a = n[s], i = a[0] === "[", l = t.has(a);
      i || l ? (o.length > 0 && (o.sort(), r.push(...o), o = []), r.push(a)) : o.push(a);
    }
    return o.length > 0 && (o.sort(), r.push(...o)), r;
  };
}, br = (e) => ({
  cache: dr(e.cacheSize),
  parseClassName: mr(e),
  sortModifiers: pr(e),
  postfixLookupClassGroupIds: gr(e),
  ...nr(e)
}), gr = (e) => {
  const t = /* @__PURE__ */ Object.create(null), n = e.postfixLookupClassGroups;
  if (n)
    for (let r = 0; r < n.length; r++)
      t[n[r]] = !0;
  return t;
}, vr = /\s+/, hr = (e, t) => {
  const {
    parseClassName: n,
    getClassGroupId: r,
    getConflictingClassGroupIds: o,
    sortModifiers: s,
    postfixLookupClassGroupIds: a
  } = t, i = [], l = e.trim().split(vr);
  let u = "";
  for (let f = l.length - 1; f >= 0; f -= 1) {
    const d = l[f], {
      isExternal: m,
      modifiers: x,
      hasImportantModifier: h,
      baseClassName: b,
      maybePostfixModifierPosition: p
    } = n(d);
    if (m) {
      u = d + (u.length > 0 ? " " + u : u);
      continue;
    }
    let w = !!p, C;
    if (w) {
      const _ = b.substring(0, p);
      C = r(_);
      const y = C && a[C] ? r(b) : void 0;
      y && y !== C && (C = y, w = !1);
    } else
      C = r(b);
    if (!C) {
      if (!w) {
        u = d + (u.length > 0 ? " " + u : u);
        continue;
      }
      if (C = r(b), !C) {
        u = d + (u.length > 0 ? " " + u : u);
        continue;
      }
      w = !1;
    }
    const S = x.length === 0 ? "" : x.length === 1 ? x[0] : s(x).join(":"), R = h ? S + Qe : S, P = R + C;
    if (i.indexOf(P) > -1)
      continue;
    i.push(P);
    const A = o(C, w);
    for (let _ = 0; _ < A.length; ++_) {
      const y = A[_];
      i.push(R + y);
    }
    u = d + (u.length > 0 ? " " + u : u);
  }
  return u;
}, yr = (...e) => {
  let t = 0, n, r, o = "";
  for (; t < e.length; )
    (n = e[t++]) && (r = Xt(n)) && (o && (o += " "), o += r);
  return o;
}, Xt = (e) => {
  if (typeof e == "string")
    return e;
  let t, n = "";
  for (let r = 0; r < e.length; r++)
    e[r] && (t = Xt(e[r])) && (n && (n += " "), n += t);
  return n;
}, wr = (e, ...t) => {
  let n, r, o, s;
  const a = (l) => {
    const u = t.reduce((f, d) => d(f), e());
    return n = br(u), r = n.cache.get, o = n.cache.set, s = i, i(l);
  }, i = (l) => {
    const u = r(l);
    if (u)
      return u;
    const f = hr(l, n);
    return o(l, f), f;
  };
  return s = a, (...l) => s(yr(...l));
}, xr = [], T = (e) => {
  const t = (n) => n[e] || xr;
  return t.isThemeGetter = !0, t;
}, Ht = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Zt = /^\((?:(\w[\w-]*):)?(.+)\)$/i, Cr = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, Er = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Sr = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, kr = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Pr = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Rr = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, J = (e) => Cr.test(e), k = (e) => !!e && !Number.isNaN(Number(e)), G = (e) => !!e && Number.isInteger(Number(e)), Ue = (e) => e.endsWith("%") && k(e.slice(0, -1)), X = (e) => Er.test(e), qt = () => !0, Or = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Sr.test(e) && !kr.test(e)
), dt = () => !1, Dr = (e) => Pr.test(e), Ar = (e) => Rr.test(e), _r = (e) => !g(e) && !v(e), Ir = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), Tr = (e) => te(e, en, dt), g = (e) => Ht.test(e), se = (e) => te(e, tn, Or), Rt = (e) => te(e, $r, k), Nr = (e) => te(e, rn, qt), Mr = (e) => te(e, nn, dt), Ot = (e) => te(e, Qt, dt), Lr = (e) => te(e, Jt, Ar), ke = (e) => te(e, on, Dr), v = (e) => Zt.test(e), ve = (e) => ae(e, tn), Fr = (e) => ae(e, nn), Dt = (e) => ae(e, Qt), jr = (e) => ae(e, en), zr = (e) => ae(e, Jt), Pe = (e) => ae(e, on, !0), Wr = (e) => ae(e, rn, !0), te = (e, t, n) => {
  const r = Ht.exec(e);
  return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, ae = (e, t, n = !1) => {
  const r = Zt.exec(e);
  return r ? r[1] ? t(r[1]) : n : !1;
}, Qt = (e) => e === "position" || e === "percentage", Jt = (e) => e === "image" || e === "url", en = (e) => e === "length" || e === "size" || e === "bg-size", tn = (e) => e === "length", $r = (e) => e === "number", nn = (e) => e === "family-name", rn = (e) => e === "number" || e === "weight", on = (e) => e === "shadow", Vr = () => {
  const e = T("color"), t = T("font"), n = T("text"), r = T("font-weight"), o = T("tracking"), s = T("leading"), a = T("breakpoint"), i = T("container"), l = T("spacing"), u = T("radius"), f = T("shadow"), d = T("inset-shadow"), m = T("text-shadow"), x = T("drop-shadow"), h = T("blur"), b = T("perspective"), p = T("aspect"), w = T("ease"), C = T("animate"), S = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], R = () => [
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
  ], P = () => [...R(), v, g], A = () => ["auto", "hidden", "clip", "visible", "scroll"], _ = () => ["auto", "contain", "none"], y = () => [v, g, l], I = () => [J, "full", "auto", ...y()], re = () => [G, "none", "subgrid", v, g], V = () => ["auto", {
    span: ["full", G, v, g]
  }, G, v, g], O = () => [G, "auto", v, g], ce = () => ["auto", "min", "max", "fr", v, g], le = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], Q = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], B = () => ["auto", ...y()], oe = () => [J, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...y()], We = () => [J, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...y()], $e = () => [J, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...y()], E = () => [e, v, g], yt = () => [...R(), Dt, Ot, {
    position: [v, g]
  }], wt = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], xt = () => ["auto", "cover", "contain", jr, Tr, {
    size: [v, g]
  }], Ve = () => [Ue, ve, se], L = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    u,
    v,
    g
  ], F = () => ["", k, ve, se], xe = () => ["solid", "dashed", "dotted", "double"], Ct = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], N = () => [k, Ue, Dt, Ot], Et = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    h,
    v,
    g
  ], Ce = () => ["none", k, v, g], Ee = () => ["none", k, v, g], Be = () => [k, v, g], Se = () => [J, "full", ...y()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [X],
      breakpoint: [X],
      color: [qt],
      container: [X],
      "drop-shadow": [X],
      ease: ["in", "out", "in-out"],
      font: [_r],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [X],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [X],
      shadow: [X],
      spacing: ["px", k],
      text: [X],
      "text-shadow": [X],
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
        aspect: ["auto", "square", J, g, v, p]
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
        "@container": ["", "normal", "size", v, g]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [Ir],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [k, g, v, i]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": S()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": S()
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
        overflow: A()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": A()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": A()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: _()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": _()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": _()
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
        z: [G, "auto", v, g]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [J, "full", "auto", i, ...y()]
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
        flex: [k, J, "auto", "initial", "none", g]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", k, v, g]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", k, v, g]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [G, "first", "last", "none", v, g]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": re()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: V()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": O()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": O()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": re()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: V()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": O()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": O()
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
        "auto-cols": ce()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ce()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: y()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": y()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": y()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...le(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...Q(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...Q()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...le()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...Q(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...Q(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": le()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...Q(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...Q()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: y()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: y()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: y()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: y()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: y()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: y()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: y()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: y()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: y()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: y()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: y()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: B()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: B()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: B()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: B()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: B()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: B()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: B()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: B()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: B()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: B()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: B()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": y()
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
        "space-y": y()
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
        size: oe()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/width
       */
      "inline-size": [{
        inline: ["auto", ...We()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...We()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...We()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ...$e()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ...$e()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ...$e()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [i, "screen", ...oe()]
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
          ...oe()
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
          ...oe()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...oe()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...oe()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...oe()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", n, ve, se]
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
        font: [r, Wr, Nr]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Ue, g]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Fr, Mr, t]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [g]
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
        tracking: [o, v, g]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [k, "none", v, Rt]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          s,
          ...y()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", v, g]
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
        list: ["disc", "decimal", "none", v, g]
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
        placeholder: E()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: E()
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
        decoration: [...xe(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [k, "from-font", "auto", v, se]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: E()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [k, "auto", v, g]
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
        indent: y()
      }],
      /**
       * Tab Size
       * @see https://tailwindcss.com/docs/tab-size
       */
      "tab-size": [{
        tab: [G, v, g]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", v, g]
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
        content: ["none", v, g]
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
        bg: yt()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: wt()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: xt()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, G, v, g],
          radial: ["", v, g],
          conic: [G, v, g]
        }, zr, Lr]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: E()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: Ve()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: Ve()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: Ve()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: E()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: E()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: E()
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
        border: F()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": F()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": F()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": F()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": F()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": F()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": F()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": F()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": F()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": F()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": F()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": F()
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
        "divide-y": F()
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
        border: [...xe(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...xe(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: E()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": E()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": E()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": E()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": E()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": E()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": E()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": E()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": E()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": E()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": E()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: E()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...xe(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [k, v, g]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", k, ve, se]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: E()
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
          f,
          Pe,
          ke
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: E()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", d, Pe, ke]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": E()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: F()
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
        ring: E()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [k, se]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": E()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": F()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": E()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", m, Pe, ke]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": E()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [k, v, g]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...Ct(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": Ct()
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
        "mask-linear": [k]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": N()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": N()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": E()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": E()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": N()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": N()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": E()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": E()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": N()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": N()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": E()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": E()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": N()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": N()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": E()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": E()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": N()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": N()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": E()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": E()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": N()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": N()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": E()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": E()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": N()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": N()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": E()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": E()
      }],
      "mask-image-radial": [{
        "mask-radial": [v, g]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": N()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": N()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": E()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": E()
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
        "mask-conic": [k]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": N()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": N()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": E()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": E()
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
        mask: yt()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: wt()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: xt()
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
        mask: ["none", v, g]
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
          v,
          g
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: Et()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [k, v, g]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [k, v, g]
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
          x,
          Pe,
          ke
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": E()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", k, v, g]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [k, v, g]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", k, v, g]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [k, v, g]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", k, v, g]
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
          v,
          g
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": Et()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [k, v, g]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [k, v, g]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", k, v, g]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [k, v, g]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", k, v, g]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [k, v, g]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [k, v, g]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", k, v, g]
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
        "border-spacing": y()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": y()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": y()
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
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", v, g]
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
        duration: [k, "initial", v, g]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", w, v, g]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [k, v, g]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", C, v, g]
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
        perspective: [b, v, g]
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
        rotate: Ce()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": Ce()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": Ce()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": Ce()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: Ee()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": Ee()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": Ee()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": Ee()
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
        skew: Be()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": Be()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": Be()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [v, g, "", "none", "gpu", "cpu"]
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
        translate: Se()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": Se()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": Se()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": Se()
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
        zoom: [G, v, g]
      }],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: E()
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
        caret: E()
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", v, g]
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
        "scrollbar-thumb": E()
      }],
      /**
       * Scrollbar Track Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-track-color": [{
        "scrollbar-track": E()
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
        "scroll-m": y()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": y()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": y()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": y()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": y()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": y()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": y()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": y()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": y()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": y()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": y()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": y()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": y()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": y()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": y()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": y()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": y()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": y()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": y()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": y()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": y()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": y()
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
        "will-change": ["auto", "scroll", "contents", "transform", v, g]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...E()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [k, ve, se, Rt]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...E()]
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
}, ks = /* @__PURE__ */ wr(Vr), Ps = /* @__PURE__ */ qn(Qn);
var Br = Object.defineProperty, ft = (e, t) => Br(e, "name", { value: t, configurable: !0 });
function Je(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
ft(Je, "setRef");
function sn(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const s = Je(o, t);
      return !n && typeof s == "function" && (n = !0), s;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const s = r[o];
          typeof s == "function" ? s() : Je(e[o], null);
        }
      };
  };
}
ft(sn, "composeRefs");
function ie(...e) {
  return c.useCallback(sn(...e), e);
}
ft(ie, "useComposedRefs");
var Ur = Object.defineProperty, $ = (e, t) => Ur(e, "name", { value: t, configurable: !0 }), Gr = /* @__PURE__ */ $((e, t) => {
  const n = { ...t };
  for (const r in t) {
    const o = e[r], s = t[r];
    if (/^on[A-Z]/.test(r))
      if (o && s) {
        const i = typeof o == "function", l = typeof s == "function";
        n[r] = (...u) => {
          const f = l ? s(...u) : void 0;
          return i && o(...u), f;
        };
      } else o && (n[r] = o);
    else r === "style" ? n[r] = {
      ...typeof o == "object" ? o : null,
      ...typeof s == "object" ? s : null
    } : r === "className" ? n[r] = [o, s].filter(Boolean).join(" ") : r === "aria-describedby" && (n[r] = an(s, o));
  }
  return { ...e, ...n };
}, "mergeProps");
function an(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if (typeof n == "string")
      for (const r of String(n).trim().split(/\s+/))
        r && t.add(r);
  return t.size > 0 ? Array.from(t).join(" ") : void 0;
}
$(an, "concatAriaDescribedby");
var cn = c.createContext(Gr);
cn.displayName = "SlotContext";
// @__NO_SIDE_EFFECTS__
function Fe(e) {
  const t = c.forwardRef((n, r) => {
    const o = c.useContext(cn);
    let { children: s, mergeProps: a = o, ...i } = n, l = null, u = !1;
    const f = [];
    et(s) && typeof Re == "function" && (s = Re(s._payload)), c.Children.forEach(s, (h) => {
      var b;
      if (dn(h)) {
        u = !0;
        const p = h;
        let w = "child" in p.props ? p.props.child : p.props.children;
        et(w) && typeof Re == "function" && (w = Re(w._payload)), l = Kr(p, w), f.push((b = l == null ? void 0 : l.props) == null ? void 0 : b.children);
      } else
        f.push(h);
    }), l ? l = c.cloneElement(l, void 0, f) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !u && c.Children.count(s) === 1 && c.isValidElement(s) && (l = s)
    );
    const d = l ? un(l) : void 0, m = ie(r, d);
    if (!l) {
      if (s || s === 0)
        throw new Error(
          u ? Zr(e) : Hr(e)
        );
      return s;
    }
    const x = a(
      i,
      l.props ?? {}
    );
    return l.type !== c.Fragment && (x.ref = r ? m : d), c.cloneElement(l, x);
  });
  return t.displayName = `${e}.Slot`, t;
}
$(Fe, "createSlot");
var Rs = /* @__PURE__ */ Fe("Slot"), ln = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function Yr(e) {
  const t = /* @__PURE__ */ $((n) => "child" in n ? n.children(n.child) : n.children, "Slottable");
  return t.displayName = `${e}.Slottable`, t.__radixId = ln, t;
}
$(Yr, "createSlottable");
var Kr = /* @__PURE__ */ $((e, t) => {
  if ("child" in e.props) {
    const n = e.props.child;
    return c.isValidElement(n) ? c.cloneElement(n, void 0, e.props.children(n.props.children)) : null;
  }
  return c.isValidElement(t) ? t : null;
}, "getSlottableElementFromSlottable");
function un(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
$(un, "getElementRef");
function dn(e) {
  return c.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === ln;
}
$(dn, "isSlottable");
var Xr = Symbol.for("react.lazy");
function et(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === Xr && "_payload" in e && fn(e._payload);
}
$(et, "isLazyComponent");
function fn(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
$(fn, "isPromiseLike");
var Hr = /* @__PURE__ */ $((e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), Zr = /* @__PURE__ */ $((e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Re = ye[" use ".trim().toString()];
const At = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, _t = qe, Os = (e, t) => (n) => {
  var r;
  if ((t == null ? void 0 : t.variants) == null) return _t(e, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
  const { variants: o, defaultVariants: s } = t, a = Object.keys(o).map((u) => {
    const f = n == null ? void 0 : n[u], d = s == null ? void 0 : s[u];
    if (f === null) return null;
    const m = At(f) || At(d);
    return o[u][m];
  }), i = n && Object.entries(n).reduce((u, f) => {
    let [d, m] = f;
    return m === void 0 || (u[d] = m), u;
  }, {}), l = t == null || (r = t.compoundVariants) === null || r === void 0 ? void 0 : r.reduce((u, f) => {
    let { class: d, className: m, ...x } = f;
    return Object.entries(x).every((h) => {
      let [b, p] = h;
      return Array.isArray(p) ? p.includes({
        ...s,
        ...i
      }[b]) : {
        ...s,
        ...i
      }[b] === p;
    }) ? [
      ...u,
      d,
      m
    ] : u;
  }, []);
  return _t(e, a, l, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
};
var qr = Object.defineProperty, ge = (e, t) => qr(e, "name", { value: t, configurable: !0 }), mn = !!(typeof window < "u" && window.document && window.document.createElement);
function Z(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return /* @__PURE__ */ ge(function(o) {
    if (e == null || e(o), n === !1 || !o || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  }, "handleEvent");
}
ge(Z, "composeEventHandlers");
function Qr(e) {
  var t;
  if (!mn)
    throw new Error("Cannot access window outside of the DOM");
  return ((t = e == null ? void 0 : e.ownerDocument) == null ? void 0 : t.defaultView) ?? window;
}
ge(Qr, "getOwnerWindow");
function tt(e) {
  if (!mn)
    throw new Error("Cannot access document outside of the DOM");
  return (e == null ? void 0 : e.ownerDocument) ?? document;
}
ge(tt, "getOwnerDocument");
function pn(e, t = !1) {
  const { activeElement: n } = tt(e);
  if (!(n != null && n.nodeName))
    return null;
  if (bn(n) && n.contentDocument)
    return pn(n.contentDocument.body, t);
  if (t) {
    const r = n.getAttribute("aria-activedescendant");
    if (r) {
      const o = tt(n).getElementById(r);
      if (o)
        return o;
    }
  }
  return n;
}
ge(pn, "getActiveElement");
function bn(e) {
  return e.tagName === "IFRAME";
}
ge(bn, "isFrame");
var Jr = Object.defineProperty, W = (e, t) => Jr(e, "name", { value: t, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function eo(e, t) {
  const n = c.createContext(t);
  n.displayName = e + "Context";
  const r = /* @__PURE__ */ W((s) => {
    const { children: a, ...i } = s, l = c.useMemo(() => i, Object.values(i));
    return /* @__PURE__ */ D.jsx(n.Provider, { value: l, children: a });
  }, "Provider");
  r.displayName = e + "Provider";
  function o(s, a = {}) {
    const { optional: i = !1 } = a, l = c.useContext(n);
    if (l) return l;
    if (t !== void 0) return t;
    if (!i)
      throw new Error(`\`${s}\` must be used within \`${e}\``);
  }
  return W(o, "useContext"), [r, o];
}
W(eo, "createContext");
// @__NO_SIDE_EFFECTS__
function gn(e, t = []) {
  let n = [];
  function r(s, a) {
    const i = c.createContext(a);
    i.displayName = s + "Context";
    const l = n.length;
    n = [...n, a];
    const u = /* @__PURE__ */ W((d) => {
      var w;
      const { scope: m, children: x, ...h } = d, b = ((w = m == null ? void 0 : m[e]) == null ? void 0 : w[l]) || i, p = c.useMemo(() => h, Object.values(h));
      return /* @__PURE__ */ D.jsx(b.Provider, { value: p, children: x });
    }, "Provider");
    u.displayName = s + "Provider";
    function f(d, m, x = {}) {
      var w;
      const { optional: h = !1 } = x, b = ((w = m == null ? void 0 : m[e]) == null ? void 0 : w[l]) || i, p = c.useContext(b);
      if (p) return p;
      if (a !== void 0) return a;
      if (!h)
        throw new Error(`\`${d}\` must be used within \`${s}\``);
    }
    return W(f, "useContext"), [u, f];
  }
  W(r, "createContext");
  const o = /* @__PURE__ */ W(() => {
    const s = n.map((a) => c.createContext(a));
    return /* @__PURE__ */ W(function(i) {
      const l = (i == null ? void 0 : i[e]) || s;
      return c.useMemo(
        () => ({ [`__scope${e}`]: { ...i, [e]: l } }),
        [i, l]
      );
    }, "useScope");
  }, "createScope");
  return o.scopeName = e, [r, vn(o, ...t)];
}
W(gn, "createContextScope");
function vn(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = /* @__PURE__ */ W(() => {
    const r = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return /* @__PURE__ */ W(function(s) {
      const a = r.reduce((i, { useScope: l, scopeName: u }) => {
        const d = l(s)[`__scope${u}`];
        return { ...i, ...d };
      }, {});
      return c.useMemo(() => ({ [`__scope${t.scopeName}`]: a }), [a]);
    }, "useComposedScopes");
  }, "createScope");
  return n.scopeName = t.scopeName, n;
}
W(vn, "composeContextScopes");
var ee = globalThis != null && globalThis.document ? c.useLayoutEffect : () => {
}, to = Object.defineProperty, no = (e, t) => to(e, "name", { value: t, configurable: !0 }), ro = ye[" useId ".trim().toString()] || (() => {
}), oo = 0;
function Te(e) {
  const [t, n] = c.useState(ro());
  return ee(() => {
    e || n((r) => r ?? String(oo++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
no(Te, "useId");
var so = Object.defineProperty, ao = (e, t) => so(e, "name", { value: t, configurable: !0 }), It = ye[" useEffectEvent ".trim().toString()], Tt = ye[" useInsertionEffect ".trim().toString()];
function hn(e) {
  if (typeof It == "function")
    return It(e);
  const t = c.useRef(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });
  return typeof Tt == "function" ? Tt(() => {
    t.current = e;
  }) : ee(() => {
    t.current = e;
  }), c.useMemo(() => (...n) => {
    var r;
    return (r = t.current) == null ? void 0 : r.call(t, ...n);
  }, []);
}
ao(hn, "useEffectEvent");
var io = Object.defineProperty, we = (e, t) => io(e, "name", { value: t, configurable: !0 }), co = ye[" useInsertionEffect ".trim().toString()] || ee;
function yn({
  prop: e,
  defaultProp: t,
  onChange: n = /* @__PURE__ */ we(() => {
  }, "onChange"),
  caller: r
}) {
  const [o, s, a] = wn({
    defaultProp: t,
    onChange: n
  }), i = e !== void 0, l = i ? e : o, u = c.useCallback(
    (f) => {
      var d;
      if (i) {
        const m = xn(f) ? f(e) : f;
        m !== e && ((d = a.current) == null || d.call(a, m));
      } else
        s(f);
    },
    [i, e, s, a]
  );
  return [l, u];
}
we(yn, "useControllableState");
function wn({
  defaultProp: e,
  onChange: t
}) {
  const [n, r] = c.useState(e), o = c.useRef(n), s = c.useRef(t);
  return co(() => {
    s.current = t;
  }, [t]), c.useEffect(() => {
    var a;
    o.current !== n && ((a = s.current) == null || a.call(s, n), o.current = n);
  }, [n, o]), [n, r, s];
}
we(wn, "useUncontrolledState");
function xn(e) {
  return typeof e == "function";
}
we(xn, "isFunction");
var Nt = Symbol("RADIX:SYNC_STATE");
function lo(e, t, n, r) {
  const { prop: o, defaultProp: s, onChange: a, caller: i } = t, l = o !== void 0, u = hn(a), f = [{ ...n, state: s }];
  r && f.push(r);
  const [d, m] = c.useReducer(
    (p, w) => {
      if (w.type === Nt)
        return { ...p, state: w.state };
      const C = e(p, w);
      return l && !Object.is(C.state, p.state) && u(C.state), C;
    },
    ...f
  ), x = d.state, h = c.useRef(x);
  c.useEffect(() => {
    h.current !== x && (h.current = x, l || u(x));
  }, [x, h, l]);
  const b = c.useMemo(() => o !== void 0 ? { ...d, state: o } : d, [d, o]);
  return c.useEffect(() => {
    l && !Object.is(o, d.state) && m({ type: Nt, state: o });
  }, [o, d.state, l]), [b, m];
}
we(lo, "useControllableStateReducer");
var uo = Object.defineProperty, fo = (e, t) => uo(e, "name", { value: t, configurable: !0 }), mo = [
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
], ne = mo.reduce((e, t) => {
  const n = /* @__PURE__ */ Fe(`Primitive.${t}`), r = c.forwardRef((o, s) => {
    const { asChild: a, ...i } = o, l = a ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ D.jsx(l, { ...i, ref: s });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function Cn(e, t) {
  e && Bt.flushSync(() => e.dispatchEvent(t));
}
fo(Cn, "dispatchDiscreteCustomEvent");
var po = Object.defineProperty, bo = (e, t) => po(e, "name", { value: t, configurable: !0 });
function be(e) {
  const t = c.useRef(e);
  return c.useEffect(() => {
    t.current = e;
  }), c.useMemo(() => (...n) => {
    var r;
    return (r = t.current) == null ? void 0 : r.call(t, ...n);
  }, []);
}
bo(be, "useCallbackRef");
var go = Object.defineProperty, M = (e, t) => go(e, "name", { value: t, configurable: !0 }), nt = "dismissableLayer.update", vo = "dismissableLayer.pointerDownOutside", ho = "dismissableLayer.focusOutside", Mt, En = c.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set(),
  // Outside elements that belong to a layer's own dismiss affordance (eg, a
  // dialog overlay). Pressing them should dismiss the layer regardless of
  // whether or not they stop propagation.
  //
  // See https://github.com/radix-ui/primitives/issues/3346
  dismissableSurfaces: /* @__PURE__ */ new Set()
}), yo = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ M(function(t, n) {
    const {
      disableOutsidePointerEvents: r = !1,
      deferPointerDownOutside: o = !1,
      onEscapeKeyDown: s,
      onPointerDownOutside: a,
      onFocusOutside: i,
      onInteractOutside: l,
      onDismiss: u,
      ...f
    } = t, d = c.useContext(En), [m, x] = c.useState(null), h = (m == null ? void 0 : m.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, b] = c.useState({}), p = ie(n, x), w = Array.from(d.layers), [C] = [
      ...d.layersWithOutsidePointerEventsDisabled
    ].slice(-1), S = C ? w.indexOf(C) : -1, R = m ? w.indexOf(m) : -1, P = d.layersWithOutsidePointerEventsDisabled.size > 0, A = R >= S, _ = c.useRef(!1), y = kn(
      (O) => {
        a == null || a(O), l == null || l(O), O.defaultPrevented || u == null || u();
      },
      {
        ownerDocument: h,
        deferPointerDownOutside: o,
        isDeferredPointerDownOutsideRef: _,
        dismissableSurfaces: d.dismissableSurfaces,
        shouldHandlePointerDownOutside: c.useCallback(
          (O) => {
            if (!(O instanceof Node))
              return !1;
            const ce = [...d.branches].some(
              (le) => le.contains(O)
            );
            return A && !ce;
          },
          [d.branches, A]
        )
      }
    ), I = Pn((O) => {
      if (o && _.current)
        return;
      const ce = O.target;
      [...d.branches].some((Q) => Q.contains(ce)) || (i == null || i(O), l == null || l(O), O.defaultPrevented || u == null || u());
    }, h), re = m ? R === w.length - 1 : !1, V = be((O) => {
      O.key === "Escape" && (s == null || s(O), !O.defaultPrevented && u && (O.preventDefault(), u()));
    });
    return c.useEffect(() => {
      if (re)
        return h.addEventListener("keydown", V, { capture: !0 }), () => h.removeEventListener("keydown", V, { capture: !0 });
    }, [h, re, V]), c.useEffect(() => {
      if (m)
        return r && (d.layersWithOutsidePointerEventsDisabled.size === 0 && (Mt = h.body.style.pointerEvents, h.body.style.pointerEvents = "none"), d.layersWithOutsidePointerEventsDisabled.add(m)), d.layers.add(m), rt(), () => {
          r && (d.layersWithOutsidePointerEventsDisabled.delete(m), d.layersWithOutsidePointerEventsDisabled.size === 0 && (h.body.style.pointerEvents = Mt));
        };
    }, [m, h, r, d]), c.useEffect(() => () => {
      m && (d.layers.delete(m), d.layersWithOutsidePointerEventsDisabled.delete(m), rt());
    }, [m, d]), c.useEffect(() => {
      const O = /* @__PURE__ */ M(() => b({}), "handleUpdate");
      return document.addEventListener(nt, O), () => document.removeEventListener(nt, O);
    }, []), /* @__PURE__ */ D.jsx(
      ne.div,
      {
        ...f,
        ref: p,
        style: {
          pointerEvents: P ? A ? "auto" : "none" : void 0,
          ...t.style
        },
        onFocusCapture: Z(t.onFocusCapture, I.onFocusCapture),
        onBlurCapture: Z(t.onBlurCapture, I.onBlurCapture),
        onPointerDownCapture: Z(
          t.onPointerDownCapture,
          y.onPointerDownCapture
        )
      }
    );
  }, "DismissableLayer")
);
function Sn() {
  const e = c.useContext(En), [t, n] = c.useState(null);
  return c.useEffect(() => {
    if (t)
      return e.dismissableSurfaces.add(t), () => {
        e.dismissableSurfaces.delete(t);
      };
  }, [t, e.dismissableSurfaces]), n;
}
M(Sn, "useDismissableLayerSurface");
var wo = /* @__PURE__ */ M(() => !0, "IS_TRUE");
function kn(e, t) {
  const {
    ownerDocument: n = globalThis == null ? void 0 : globalThis.document,
    deferPointerDownOutside: r = !1,
    isDeferredPointerDownOutsideRef: o,
    dismissableSurfaces: s,
    shouldHandlePointerDownOutside: a = wo
  } = t, i = be(e), l = c.useRef(!1), u = c.useRef(!1), f = c.useRef(/* @__PURE__ */ new Map()), d = c.useRef(() => {
  });
  return c.useEffect(() => {
    function m() {
      u.current = !1, o.current = !1, f.current.clear();
    }
    M(m, "resetOutsideInteraction");
    function x() {
      return Array.from(f.current.values()).some(Boolean);
    }
    M(x, "isOutsideInteractionIntercepted");
    function h(S) {
      if (!u.current)
        return;
      const R = S.target;
      R instanceof Node && [...s].some((A) => A.contains(R)) || f.current.set(S.type, !0), S.type === "click" && window.setTimeout(() => {
        u.current && d.current();
      }, 0);
    }
    M(h, "handleInteractionCapture");
    function b(S) {
      u.current && f.current.set(S.type, !1);
    }
    M(b, "handleInteractionBubble");
    const p = /* @__PURE__ */ M((S) => {
      if (S.target && !l.current) {
        let R = function() {
          n.removeEventListener("click", d.current);
          const A = x();
          m(), A || mt(
            vo,
            i,
            P,
            { discrete: !0 }
          );
        };
        if (M(R, "handleAndDispatchPointerDownOutsideEvent"), !a(S.target)) {
          n.removeEventListener("click", d.current), m(), l.current = !1;
          return;
        }
        const P = { originalEvent: S };
        u.current = !0, o.current = r && S.button === 0, f.current.clear(), !r || S.button !== 0 ? R() : (n.removeEventListener("click", d.current), d.current = R, n.addEventListener("click", d.current, { once: !0 }));
      } else
        n.removeEventListener("click", d.current), m();
      l.current = !1;
    }, "handlePointerDown"), w = [
      "pointerup",
      "mousedown",
      "mouseup",
      "touchstart",
      "touchend",
      "click"
    ];
    for (const S of w)
      n.addEventListener(S, h, !0), n.addEventListener(S, b);
    const C = window.setTimeout(() => {
      n.addEventListener("pointerdown", p);
    }, 0);
    return () => {
      window.clearTimeout(C), n.removeEventListener("pointerdown", p), n.removeEventListener("click", d.current);
      for (const S of w)
        n.removeEventListener(S, h, !0), n.removeEventListener(S, b);
    };
  }, [
    n,
    i,
    r,
    o,
    s,
    a
  ]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: /* @__PURE__ */ M(() => l.current = !0, "onPointerDownCapture")
  };
}
M(kn, "usePointerDownOutside");
function Pn(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = be(e), r = c.useRef(!1);
  return c.useEffect(() => {
    const o = /* @__PURE__ */ M((s) => {
      s.target && !r.current && mt(ho, n, { originalEvent: s }, {
        discrete: !1
      });
    }, "handleFocus");
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, n]), {
    onFocusCapture: /* @__PURE__ */ M(() => r.current = !0, "onFocusCapture"),
    onBlurCapture: /* @__PURE__ */ M(() => r.current = !1, "onBlurCapture")
  };
}
M(Pn, "useFocusOutside");
function rt() {
  const e = new CustomEvent(nt);
  document.dispatchEvent(e);
}
M(rt, "dispatchUpdate");
function mt(e, t, n, { discrete: r }) {
  const o = n.originalEvent.target, s = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && o.addEventListener(e, t, { once: !0 }), r ? Cn(o, s) : o.dispatchEvent(s);
}
M(mt, "handleAndDispatchCustomEvent");
var xo = Object.defineProperty, j = (e, t) => xo(e, "name", { value: t, configurable: !0 }), Ge = "focusScope.autoFocusOnMount", Ye = "focusScope.autoFocusOnUnmount", Lt = { bubbles: !1, cancelable: !0 }, Co = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ j(function(t, n) {
    const {
      loop: r = !1,
      trapped: o = !1,
      onMountAutoFocus: s,
      onUnmountAutoFocus: a,
      ...i
    } = t, [l, u] = c.useState(null), f = be(s), d = be(a), m = c.useRef(null), x = ie(n, u), h = c.useRef({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    }).current;
    c.useEffect(() => {
      if (o) {
        let p = function(R) {
          if (h.paused || !l) return;
          const P = R.target;
          l.contains(P) ? m.current = P : H(m.current, { select: !0 });
        }, w = function(R) {
          if (h.paused || !l) return;
          const P = R.relatedTarget;
          P !== null && (l.contains(P) || H(m.current, { select: !0 }));
        }, C = function(R) {
          if (document.activeElement === document.body)
            for (const A of R)
              A.removedNodes.length > 0 && H(l);
        };
        j(p, "handleFocusIn"), j(w, "handleFocusOut"), j(C, "handleMutations"), document.addEventListener("focusin", p), document.addEventListener("focusout", w);
        const S = new MutationObserver(C);
        return l && S.observe(l, { childList: !0, subtree: !0 }), () => {
          document.removeEventListener("focusin", p), document.removeEventListener("focusout", w), S.disconnect();
        };
      }
    }, [o, l, h.paused]), c.useEffect(() => {
      if (l) {
        Ft.add(h);
        const p = document.activeElement;
        if (!l.contains(p)) {
          const C = new CustomEvent(Ge, Lt);
          l.addEventListener(Ge, f), l.dispatchEvent(C), C.defaultPrevented || (Rn(In(pt(l)), { select: !0 }), document.activeElement === p && H(l));
        }
        return () => {
          l.removeEventListener(Ge, f), setTimeout(() => {
            const C = new CustomEvent(Ye, Lt);
            l.addEventListener(Ye, d), l.dispatchEvent(C), C.defaultPrevented || H(p ?? document.body, { select: !0 }), l.removeEventListener(Ye, d), Ft.remove(h);
          }, 0);
        };
      }
    }, [l, f, d, h]);
    const b = c.useCallback(
      (p) => {
        if (!r && !o || h.paused) return;
        const w = p.key === "Tab" && !p.altKey && !p.ctrlKey && !p.metaKey, C = document.activeElement;
        if (w && C) {
          const S = p.currentTarget, [R, P] = On(S);
          R && P ? !p.shiftKey && C === P ? (p.preventDefault(), r && H(R, { select: !0 })) : p.shiftKey && C === R && (p.preventDefault(), r && H(P, { select: !0 })) : C === S && p.preventDefault();
        }
      },
      [r, o, h.paused]
    );
    return /* @__PURE__ */ D.jsx(ne.div, { tabIndex: -1, ...i, ref: x, onKeyDown: b });
  }, "FocusScope")
);
function Rn(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const r of e)
    if (H(r, { select: t }), document.activeElement !== n) return;
}
j(Rn, "focusFirst");
function On(e) {
  const t = pt(e), n = ot(t, e), r = ot(t.reverse(), e);
  return [n, r];
}
j(On, "getTabbableEdges");
function pt(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: /* @__PURE__ */ j((r) => {
      const o = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || o ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }, "acceptNode")
  });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
j(pt, "getTabbableCandidates");
function ot(e, t) {
  const n = typeof t.checkVisibility == "function" && t.checkVisibility({ checkVisibilityCSS: !0 });
  for (const r of e)
    if (!(n ? !r.checkVisibility({ checkVisibilityCSS: !0 }) : Dn(r, { upTo: t })))
      return r;
}
j(ot, "findVisible");
function Dn(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
j(Dn, "isHidden");
function An(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
j(An, "isSelectableInput");
function H(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && An(e) && t && e.select();
  }
}
j(H, "focus");
var Ft = _n();
function _n() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && (n == null || n.pause()), e = st(e, t), e.unshift(t);
    },
    remove(t) {
      var n;
      e = st(e, t), (n = e[0]) == null || n.resume();
    }
  };
}
j(_n, "createFocusScopesStack");
function st(e, t) {
  const n = [...e], r = n.indexOf(t);
  return r !== -1 && n.splice(r, 1), n;
}
j(st, "arrayRemove");
function In(e) {
  return e.filter((t) => t.tagName !== "A");
}
j(In, "removeLinks");
var Eo = Object.defineProperty, So = (e, t) => Eo(e, "name", { value: t, configurable: !0 }), ko = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ So(function(t, n) {
    var l;
    const { container: r, ...o } = t, [s, a] = c.useState(!1);
    ee(() => a(!0), []);
    const i = r || s && ((l = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : l.body);
    return i ? Bt.createPortal(/* @__PURE__ */ D.jsx(ne.div, { ...o, ref: n }), i) : null;
  }, "Portal")
), Po = Object.defineProperty, q = (e, t) => Po(e, "name", { value: t, configurable: !0 });
function Tn(e, t) {
  return c.useReducer((n, r) => t[n][r] ?? n, e);
}
q(Tn, "useStateMachine");
var bt = /* @__PURE__ */ q((e) => {
  const { present: t, children: n } = e, r = Nn(t), o = typeof n == "function" ? n({ present: r.isPresent }) : c.Children.only(n), s = Mn(r.ref, Ln(o));
  return typeof n == "function" || r.isPresent ? c.cloneElement(o, { ref: s }) : null;
}, "Presence");
function Nn(e) {
  const [t, n] = c.useState(), r = c.useRef(null), o = c.useRef(e), s = c.useRef("none"), a = c.useRef(void 0), i = e ? "mounted" : "unmounted", [l, u] = Tn(i, {
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
    l === "mounted" ? (s.current = a.current ?? me(r.current), a.current = void 0) : s.current = "none";
  }, [l]), ee(() => {
    const f = r.current, d = o.current;
    if (d !== e) {
      const x = s.current, h = me(f);
      e ? (a.current = h, u("MOUNT")) : h === "none" || (f == null ? void 0 : f.display) === "none" ? u("UNMOUNT") : u(d && x !== h ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, u]), ee(() => {
    if (t) {
      let f;
      const d = t.ownerDocument.defaultView ?? window, m = /* @__PURE__ */ q((h) => {
        const p = me(r.current).includes(CSS.escape(h.animationName));
        if (h.target === t && p && (u("ANIMATION_END"), !o.current)) {
          const w = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", f = d.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = w);
          });
        }
      }, "handleAnimationEnd"), x = /* @__PURE__ */ q((h) => {
        h.target === t && (s.current = me(r.current));
      }, "handleAnimationStart");
      return t.addEventListener("animationstart", x), t.addEventListener("animationcancel", m), t.addEventListener("animationend", m), () => {
        d.clearTimeout(f), t.removeEventListener("animationstart", x), t.removeEventListener("animationcancel", m), t.removeEventListener("animationend", m);
      };
    } else
      u("ANIMATION_END");
  }, [t, u]), {
    isPresent: ["mounted", "unmountSuspended"].includes(l),
    ref: c.useCallback((f) => {
      if (f) {
        const d = getComputedStyle(f);
        r.current = d, a.current = me(d);
      } else
        r.current = null;
      n(f);
    }, [])
  };
}
q(Nn, "usePresence");
function at(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
q(at, "setRef");
function Mn(...e) {
  const t = c.useRef(e);
  return t.current = e, c.useCallback((n) => {
    const r = t.current;
    let o = !1;
    const s = r.map((a) => {
      const i = at(a, n);
      return !o && typeof i == "function" && (o = !0), i;
    });
    if (o)
      return () => {
        for (let a = 0; a < s.length; a++) {
          const i = s[a];
          typeof i == "function" ? i() : at(r[a], null);
        }
      };
  }, []);
}
q(Mn, "useStableComposedRefs");
function me(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
q(me, "getAnimationName");
function Ln(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
q(Ln, "getElementRef");
var Ro = Object.defineProperty, gt = (e, t) => Ro(e, "name", { value: t, configurable: !0 }), Oe = 0, Y = null;
function Oo(e) {
  return vt(), e.children;
}
gt(Oo, "FocusGuards");
function vt() {
  c.useEffect(() => {
    Y || (Y = { start: it(), end: it() });
    const { start: e, end: t } = Y;
    return document.body.firstElementChild !== e && document.body.insertAdjacentElement("afterbegin", e), document.body.lastElementChild !== t && document.body.insertAdjacentElement("beforeend", t), Oe++, () => {
      Oe === 1 && (Y == null || Y.start.remove(), Y == null || Y.end.remove(), Y = null), Oe = Math.max(0, Oe - 1);
    };
  }, []);
}
gt(vt, "useFocusGuards");
function it() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
gt(it, "createFocusGuard");
var K = function() {
  return K = Object.assign || function(t) {
    for (var n, r = 1, o = arguments.length; r < o; r++) {
      n = arguments[r];
      for (var s in n) Object.prototype.hasOwnProperty.call(n, s) && (t[s] = n[s]);
    }
    return t;
  }, K.apply(this, arguments);
};
function Fn(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
}
function Do(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, o = t.length, s; r < o; r++)
    (s || !(r in t)) && (s || (s = Array.prototype.slice.call(t, 0, r)), s[r] = t[r]);
  return e.concat(s || Array.prototype.slice.call(t));
}
var Ne = "right-scroll-bar-position", Me = "width-before-scroll-bar", Ao = "with-scroll-bars-hidden", _o = "--removed-body-scroll-bar-size";
function Ke(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function Io(e, t) {
  var n = c.useState(function() {
    return {
      // value
      value: e,
      // last callback
      callback: t,
      // "memoized" public interface
      facade: {
        get current() {
          return n.value;
        },
        set current(r) {
          var o = n.value;
          o !== r && (n.value = r, n.callback(r, o));
        }
      }
    };
  })[0];
  return n.callback = t, n.facade;
}
var To = typeof window < "u" ? c.useLayoutEffect : c.useEffect, jt = /* @__PURE__ */ new WeakMap();
function No(e, t) {
  var n = Io(null, function(r) {
    return e.forEach(function(o) {
      return Ke(o, r);
    });
  });
  return To(function() {
    var r = jt.get(n);
    if (r) {
      var o = new Set(r), s = new Set(e), a = n.current;
      o.forEach(function(i) {
        s.has(i) || Ke(i, null);
      }), s.forEach(function(i) {
        o.has(i) || Ke(i, a);
      });
    }
    jt.set(n, e);
  }, [e]), n;
}
function Mo(e) {
  return e;
}
function Lo(e, t) {
  t === void 0 && (t = Mo);
  var n = [], r = !1, o = {
    read: function() {
      if (r)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return n.length ? n[n.length - 1] : e;
    },
    useMedium: function(s) {
      var a = t(s, r);
      return n.push(a), function() {
        n = n.filter(function(i) {
          return i !== a;
        });
      };
    },
    assignSyncMedium: function(s) {
      for (r = !0; n.length; ) {
        var a = n;
        n = [], a.forEach(s);
      }
      n = {
        push: function(i) {
          return s(i);
        },
        filter: function() {
          return n;
        }
      };
    },
    assignMedium: function(s) {
      r = !0;
      var a = [];
      if (n.length) {
        var i = n;
        n = [], i.forEach(s), a = n;
      }
      var l = function() {
        var f = a;
        a = [], f.forEach(s);
      }, u = function() {
        return Promise.resolve().then(l);
      };
      u(), n = {
        push: function(f) {
          a.push(f), u();
        },
        filter: function(f) {
          return a = a.filter(f), n;
        }
      };
    }
  };
  return o;
}
function Fo(e) {
  e === void 0 && (e = {});
  var t = Lo(null);
  return t.options = K({ async: !0, ssr: !1 }, e), t;
}
var jn = function(e) {
  var t = e.sideCar, n = Fn(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var r = t.read();
  if (!r)
    throw new Error("Sidecar medium not found");
  return c.createElement(r, K({}, n));
};
jn.isSideCarExport = !0;
function jo(e, t) {
  return e.useMedium(t), jn;
}
var zn = Fo(), Xe = function() {
}, je = c.forwardRef(function(e, t) {
  var n = c.useRef(null), r = c.useState({
    onScrollCapture: Xe,
    onWheelCapture: Xe,
    onTouchMoveCapture: Xe
  }), o = r[0], s = r[1], a = e.forwardProps, i = e.children, l = e.className, u = e.removeScrollBar, f = e.enabled, d = e.shards, m = e.sideCar, x = e.noRelative, h = e.noIsolation, b = e.inert, p = e.allowPinchZoom, w = e.as, C = w === void 0 ? "div" : w, S = e.gapMode, R = Fn(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), P = m, A = No([n, t]), _ = K(K({}, R), o);
  return c.createElement(
    c.Fragment,
    null,
    f && c.createElement(P, { sideCar: zn, removeScrollBar: u, shards: d, noRelative: x, noIsolation: h, inert: b, setCallbacks: s, allowPinchZoom: !!p, lockRef: n, gapMode: S }),
    a ? c.cloneElement(c.Children.only(i), K(K({}, _), { ref: A })) : c.createElement(C, K({}, _, { className: l, ref: A }), i)
  );
});
je.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
je.classNames = {
  fullWidth: Me,
  zeroRight: Ne
};
var zo = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function Wo() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = zo();
  return t && e.setAttribute("nonce", t), e;
}
function $o(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function Vo(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var Bo = function() {
  var e = 0, t = null;
  return {
    add: function(n) {
      e == 0 && (t = Wo()) && ($o(t, n), Vo(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, Uo = function() {
  var e = Bo();
  return function(t, n) {
    c.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && n]);
  };
}, Wn = function() {
  var e = Uo(), t = function(n) {
    var r = n.styles, o = n.dynamic;
    return e(r, o), null;
  };
  return t;
}, Go = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, He = function(e) {
  return parseInt(e || "", 10) || 0;
}, Yo = function(e) {
  var t = window.getComputedStyle(document.body), n = t[e === "padding" ? "paddingLeft" : "marginLeft"], r = t[e === "padding" ? "paddingTop" : "marginTop"], o = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [He(n), He(r), He(o)];
}, Ko = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return Go;
  var t = Yo(e), n = document.documentElement.clientWidth, r = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, r - n + t[2] - t[0])
  };
}, Xo = Wn(), pe = "data-scroll-locked", Ho = function(e, t, n, r) {
  var o = e.left, s = e.top, a = e.right, i = e.gap;
  return n === void 0 && (n = "margin"), `
  .`.concat(Ao, ` {
   overflow: hidden `).concat(r, `;
   padding-right: `).concat(i, "px ").concat(r, `;
  }
  body[`).concat(pe, `] {
    overflow: hidden `).concat(r, `;
    overscroll-behavior: contain;
    `).concat([
    t && "position: relative ".concat(r, ";"),
    n === "margin" && `
    padding-left: `.concat(o, `px;
    padding-top: `).concat(s, `px;
    padding-right: `).concat(a, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(i, "px ").concat(r, `;
    `),
    n === "padding" && "padding-right: ".concat(i, "px ").concat(r, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(Ne, ` {
    right: `).concat(i, "px ").concat(r, `;
  }
  
  .`).concat(Me, ` {
    margin-right: `).concat(i, "px ").concat(r, `;
  }
  
  .`).concat(Ne, " .").concat(Ne, ` {
    right: 0 `).concat(r, `;
  }
  
  .`).concat(Me, " .").concat(Me, ` {
    margin-right: 0 `).concat(r, `;
  }
  
  body[`).concat(pe, `] {
    `).concat(_o, ": ").concat(i, `px;
  }
`);
}, zt = function() {
  var e = parseInt(document.body.getAttribute(pe) || "0", 10);
  return isFinite(e) ? e : 0;
}, Zo = function() {
  c.useEffect(function() {
    return document.body.setAttribute(pe, (zt() + 1).toString()), function() {
      var e = zt() - 1;
      e <= 0 ? document.body.removeAttribute(pe) : document.body.setAttribute(pe, e.toString());
    };
  }, []);
}, qo = function(e) {
  var t = e.noRelative, n = e.noImportant, r = e.gapMode, o = r === void 0 ? "margin" : r;
  Zo();
  var s = c.useMemo(function() {
    return Ko(o);
  }, [o]);
  return c.createElement(Xo, { styles: Ho(s, !t, o, n ? "" : "!important") });
}, ct = !1;
if (typeof window < "u")
  try {
    var De = Object.defineProperty({}, "passive", {
      get: function() {
        return ct = !0, !0;
      }
    });
    window.addEventListener("test", De, De), window.removeEventListener("test", De, De);
  } catch {
    ct = !1;
  }
var ue = ct ? { passive: !1 } : !1, Qo = function(e) {
  return e.tagName === "TEXTAREA";
}, $n = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var n = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    n[t] !== "hidden" && // contains scroll inside self
    !(n.overflowY === n.overflowX && !Qo(e) && n[t] === "visible")
  );
}, Jo = function(e) {
  return $n(e, "overflowY");
}, es = function(e) {
  return $n(e, "overflowX");
}, Wt = function(e, t) {
  var n = t.ownerDocument, r = t;
  do {
    typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host);
    var o = Vn(e, r);
    if (o) {
      var s = Bn(e, r), a = s[1], i = s[2];
      if (a > i)
        return !0;
    }
    r = r.parentNode;
  } while (r && r !== n.body);
  return !1;
}, ts = function(e) {
  var t = e.scrollTop, n = e.scrollHeight, r = e.clientHeight;
  return [
    t,
    n,
    r
  ];
}, ns = function(e) {
  var t = e.scrollLeft, n = e.scrollWidth, r = e.clientWidth;
  return [
    t,
    n,
    r
  ];
}, Vn = function(e, t) {
  return e === "v" ? Jo(t) : es(t);
}, Bn = function(e, t) {
  return e === "v" ? ts(t) : ns(t);
}, rs = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, os = function(e, t, n, r, o) {
  var s = rs(e, window.getComputedStyle(t).direction), a = s * r, i = n.target, l = t.contains(i), u = !1, f = a > 0, d = 0, m = 0;
  do {
    if (!i)
      break;
    var x = Bn(e, i), h = x[0], b = x[1], p = x[2], w = b - p - s * h;
    (h || w) && Vn(e, i) && (d += w, m += h);
    var C = i.parentNode;
    i = C && C.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? C.host : C;
  } while (
    // portaled content
    !l && i !== document.body || // self content
    l && (t.contains(i) || t === i)
  );
  return (f && Math.abs(d) < 1 || !f && Math.abs(m) < 1) && (u = !0), u;
}, Ae = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, $t = function(e) {
  return [e.deltaX, e.deltaY];
}, Vt = function(e) {
  return e && "current" in e ? e.current : e;
}, ss = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, as = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, is = 0, de = [];
function cs(e) {
  var t = c.useRef([]), n = c.useRef([0, 0]), r = c.useRef(), o = c.useState(is++)[0], s = c.useState(Wn)[0], a = c.useRef(e);
  c.useEffect(function() {
    a.current = e;
  }, [e]), c.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var b = Do([e.lockRef.current], (e.shards || []).map(Vt), !0).filter(Boolean);
      return b.forEach(function(p) {
        return p.classList.add("allow-interactivity-".concat(o));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(o)), b.forEach(function(p) {
          return p.classList.remove("allow-interactivity-".concat(o));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var i = c.useCallback(function(b, p) {
    if ("touches" in b && b.touches.length === 2 || b.type === "wheel" && b.ctrlKey)
      return !a.current.allowPinchZoom;
    var w = Ae(b), C = n.current, S = "deltaX" in b ? b.deltaX : C[0] - w[0], R = "deltaY" in b ? b.deltaY : C[1] - w[1], P, A = b.target, _ = Math.abs(S) > Math.abs(R) ? "h" : "v";
    if ("touches" in b && _ === "h" && A.type === "range")
      return !1;
    var y = window.getSelection(), I = y && y.anchorNode, re = I ? I === A || I.contains(A) : !1;
    if (re)
      return !1;
    var V = Wt(_, A);
    if (!V)
      return !0;
    if (V ? P = _ : (P = _ === "v" ? "h" : "v", V = Wt(_, A)), !V)
      return !1;
    if (!r.current && "changedTouches" in b && (S || R) && (r.current = P), !P)
      return !0;
    var O = r.current || P;
    return os(O, p, b, O === "h" ? S : R);
  }, []), l = c.useCallback(function(b) {
    var p = b;
    if (!(!de.length || de[de.length - 1] !== s)) {
      var w = "deltaY" in p ? $t(p) : Ae(p), C = t.current.filter(function(P) {
        return P.name === p.type && (P.target === p.target || p.target === P.shadowParent) && ss(P.delta, w);
      })[0];
      if (C && C.should) {
        p.cancelable && p.preventDefault();
        return;
      }
      if (!C) {
        var S = (a.current.shards || []).map(Vt).filter(Boolean).filter(function(P) {
          return P.contains(p.target);
        }), R = S.length > 0 ? i(p, S[0]) : !a.current.noIsolation;
        R && p.cancelable && p.preventDefault();
      }
    }
  }, []), u = c.useCallback(function(b, p, w, C) {
    var S = { name: b, delta: p, target: w, should: C, shadowParent: ls(w) };
    t.current.push(S), setTimeout(function() {
      t.current = t.current.filter(function(R) {
        return R !== S;
      });
    }, 1);
  }, []), f = c.useCallback(function(b) {
    n.current = Ae(b), r.current = void 0;
  }, []), d = c.useCallback(function(b) {
    u(b.type, $t(b), b.target, i(b, e.lockRef.current));
  }, []), m = c.useCallback(function(b) {
    u(b.type, Ae(b), b.target, i(b, e.lockRef.current));
  }, []);
  c.useEffect(function() {
    return de.push(s), e.setCallbacks({
      onScrollCapture: d,
      onWheelCapture: d,
      onTouchMoveCapture: m
    }), document.addEventListener("wheel", l, ue), document.addEventListener("touchmove", l, ue), document.addEventListener("touchstart", f, ue), function() {
      de = de.filter(function(b) {
        return b !== s;
      }), document.removeEventListener("wheel", l, ue), document.removeEventListener("touchmove", l, ue), document.removeEventListener("touchstart", f, ue);
    };
  }, []);
  var x = e.removeScrollBar, h = e.inert;
  return c.createElement(
    c.Fragment,
    null,
    h ? c.createElement(s, { styles: as(o) }) : null,
    x ? c.createElement(qo, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function ls(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const us = jo(zn, cs);
var Un = c.forwardRef(function(e, t) {
  return c.createElement(je, K({}, e, { ref: t, sideCar: us }));
});
Un.classNames = je.classNames;
var ds = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, fe = /* @__PURE__ */ new WeakMap(), _e = /* @__PURE__ */ new WeakMap(), Ie = {}, Ze = 0, Gn = function(e) {
  return e && (e.host || Gn(e.parentNode));
}, fs = function(e, t) {
  return t.map(function(n) {
    if (e.contains(n))
      return n;
    var r = Gn(n);
    return r && e.contains(r) ? r : (console.error("aria-hidden", n, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, ms = function(e, t, n, r) {
  var o = fs(t, Array.isArray(e) ? e : [e]);
  Ie[n] || (Ie[n] = /* @__PURE__ */ new WeakMap());
  var s = Ie[n], a = [], i = /* @__PURE__ */ new Set(), l = new Set(o), u = function(d) {
    !d || i.has(d) || (i.add(d), u(d.parentNode));
  };
  o.forEach(u);
  var f = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(m) {
      if (i.has(m))
        f(m);
      else
        try {
          var x = m.getAttribute(r), h = x !== null && x !== "false", b = (fe.get(m) || 0) + 1, p = (s.get(m) || 0) + 1;
          fe.set(m, b), s.set(m, p), a.push(m), b === 1 && h && _e.set(m, !0), p === 1 && m.setAttribute(n, "true"), h || m.setAttribute(r, "true");
        } catch (w) {
          console.error("aria-hidden: cannot operate on ", m, w);
        }
    });
  };
  return f(t), i.clear(), Ze++, function() {
    a.forEach(function(d) {
      var m = fe.get(d) - 1, x = s.get(d) - 1;
      fe.set(d, m), s.set(d, x), m || (_e.has(d) || d.removeAttribute(r), _e.delete(d)), x || d.removeAttribute(n);
    }), Ze--, Ze || (fe = /* @__PURE__ */ new WeakMap(), fe = /* @__PURE__ */ new WeakMap(), _e = /* @__PURE__ */ new WeakMap(), Ie = {});
  };
}, ps = function(e, t, n) {
  n === void 0 && (n = "data-aria-hidden");
  var r = Array.from(Array.isArray(e) ? e : [e]), o = ds(e);
  return o ? (r.push.apply(r, Array.from(o.querySelectorAll("[aria-live], script"))), ms(r, o, n, "aria-hidden")) : function() {
    return null;
  };
}, bs = Object.defineProperty, z = (e, t) => bs(e, "name", { value: t, configurable: !0 }), ht = "Dialog", [Yn, Ds] = /* @__PURE__ */ gn(ht), [gs, U] = Yn(ht), As = /* @__PURE__ */ z((e) => {
  const {
    __scopeDialog: t,
    children: n,
    open: r,
    defaultOpen: o,
    onOpenChange: s,
    modal: a = !0
  } = e, i = c.useRef(null), l = c.useRef(null), [u, f] = yn({
    prop: r,
    defaultProp: o ?? !1,
    onChange: s,
    caller: ht
  }), [d, m] = c.useState(0), [x, h] = c.useState(0);
  return /* @__PURE__ */ D.jsx(
    gs,
    {
      scope: t,
      triggerRef: i,
      contentRef: l,
      contentId: Te(),
      titleId: Te(),
      descriptionId: Te(),
      titlePresent: d > 0,
      descriptionPresent: x > 0,
      setTitleCount: m,
      setDescriptionCount: h,
      open: u,
      onOpenChange: f,
      onOpenToggle: c.useCallback(() => f((b) => !b), [f]),
      modal: a,
      children: n
    }
  );
}, "Dialog"), vs = "DialogTrigger", _s = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ z(function(t, n) {
    const { __scopeDialog: r, ...o } = t, s = U(vs, r), a = ie(n, s.triggerRef);
    return /* @__PURE__ */ D.jsx(
      ne.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": s.open,
        "aria-controls": s.open ? s.contentId : void 0,
        "data-state": ze(s.open),
        ...o,
        ref: a,
        onClick: Z(t.onClick, s.onOpenToggle)
      }
    );
  }, "DialogTrigger")
), Kn = "DialogPortal", [hs, Xn] = Yn(Kn, {
  forceMount: void 0
}), Is = /* @__PURE__ */ z((e) => {
  const { __scopeDialog: t, forceMount: n, children: r, container: o } = e, s = U(Kn, t);
  return /* @__PURE__ */ D.jsx(hs, { scope: t, forceMount: n, children: c.Children.map(r, (a) => /* @__PURE__ */ D.jsx(bt, { present: n || s.open, children: /* @__PURE__ */ D.jsx(ko, { asChild: !0, container: o, children: a }) })) });
}, "DialogPortal"), lt = "DialogOverlay", Ts = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ z(function(t, n) {
    const r = Xn(lt, t.__scopeDialog), { forceMount: o = r.forceMount, ...s } = t, a = U(lt, t.__scopeDialog);
    return a.modal ? /* @__PURE__ */ D.jsx(bt, { present: o || a.open, children: /* @__PURE__ */ D.jsx(ws, { ...s, ref: n }) }) : null;
  }, "DialogOverlay")
), ys = /* @__PURE__ */ Fe("DialogOverlay.RemoveScroll"), ws = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ z(function(t, n) {
    const { __scopeDialog: r, ...o } = t, s = U(lt, r), a = Sn(), i = ie(n, a);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ D.jsx(Un, { as: ys, allowPinchZoom: !0, shards: [s.contentRef], children: /* @__PURE__ */ D.jsx(
        ne.div,
        {
          "data-state": ze(s.open),
          ...o,
          ref: i,
          style: { pointerEvents: "auto", ...o.style }
        }
      ) })
    );
  }, "DialogOverlayImpl")
), he = "DialogContent", Ns = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ z(function(t, n) {
    const r = Xn(he, t.__scopeDialog), { forceMount: o = r.forceMount, ...s } = t, a = U(he, t.__scopeDialog);
    return /* @__PURE__ */ D.jsx(bt, { present: o || a.open, children: a.modal ? /* @__PURE__ */ D.jsx(xs, { ...s, ref: n }) : /* @__PURE__ */ D.jsx(Cs, { ...s, ref: n }) });
  }, "DialogContent")
), xs = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ z(function(t, n) {
    const r = U(he, t.__scopeDialog), o = c.useRef(null), s = ie(n, r.contentRef, o);
    return c.useEffect(() => {
      const a = o.current;
      if (a) return ps(a);
    }, []), /* @__PURE__ */ D.jsx(
      Hn,
      {
        ...t,
        ref: s,
        trapFocus: r.open,
        disableOutsidePointerEvents: r.open,
        onCloseAutoFocus: Z(t.onCloseAutoFocus, (a) => {
          var i;
          a.preventDefault(), (i = r.triggerRef.current) == null || i.focus();
        }),
        onPointerDownOutside: Z(t.onPointerDownOutside, (a) => {
          const i = a.detail.originalEvent, l = i.button === 0 && i.ctrlKey === !0;
          (i.button === 2 || l) && a.preventDefault();
        }),
        onFocusOutside: Z(
          t.onFocusOutside,
          (a) => a.preventDefault()
        )
      }
    );
  }, "DialogContentModal")
), Cs = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ z(function(t, n) {
    const r = U(he, t.__scopeDialog), o = c.useRef(!1), s = c.useRef(!1);
    return /* @__PURE__ */ D.jsx(
      Hn,
      {
        ...t,
        ref: n,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (a) => {
          var i, l;
          (i = t.onCloseAutoFocus) == null || i.call(t, a), a.defaultPrevented || (o.current || (l = r.triggerRef.current) == null || l.focus(), a.preventDefault()), o.current = !1, s.current = !1;
        },
        onInteractOutside: (a) => {
          var u, f;
          (u = t.onInteractOutside) == null || u.call(t, a), a.defaultPrevented || (o.current = !0, a.detail.originalEvent.type === "pointerdown" && (s.current = !0));
          const i = a.target;
          ((f = r.triggerRef.current) == null ? void 0 : f.contains(i)) && a.preventDefault(), a.detail.originalEvent.type === "focusin" && s.current && a.preventDefault();
        }
      }
    );
  }, "DialogContentNonModal")
), Hn = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ z(function(t, n) {
    const {
      __scopeDialog: r,
      trapFocus: o,
      onOpenAutoFocus: s,
      onCloseAutoFocus: a,
      "aria-describedby": i,
      ...l
    } = t, u = U(he, r);
    return vt(), /* @__PURE__ */ D.jsx(D.Fragment, { children: /* @__PURE__ */ D.jsx(
      Co,
      {
        asChild: !0,
        loop: !0,
        trapped: o,
        onMountAutoFocus: s,
        onUnmountAutoFocus: a,
        children: /* @__PURE__ */ D.jsx(
          yo,
          {
            role: "dialog",
            id: u.contentId,
            "aria-labelledby": u.titlePresent ? u.titleId : void 0,
            "aria-describedby": u.descriptionPresent ? Zn(i, u.descriptionId) : i,
            "data-state": ze(u.open),
            ...l,
            ref: n,
            deferPointerDownOutside: !0,
            onDismiss: () => u.onOpenChange(!1)
          }
        )
      }
    ) });
  }, "DialogContentImpl")
), Ms = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ z(function(t, n) {
    const { __scopeDialog: r, ...o } = t, s = U("DialogTitle", r), { setTitleCount: a } = s;
    return ee(() => (a((i) => i + 1), () => a((i) => i - 1)), [a]), /* @__PURE__ */ D.jsx(ne.h2, { id: s.titleId, ...o, ref: n });
  }, "DialogTitle")
), Ls = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ z(function(t, n) {
    const { __scopeDialog: r, ...o } = t, s = U("DialogDescription", r), { setDescriptionCount: a } = s;
    return ee(() => (a((i) => i + 1), () => a((i) => i - 1)), [a]), /* @__PURE__ */ D.jsx(ne.p, { id: s.descriptionId, ...o, ref: n });
  }, "DialogDescription")
), Es = "DialogClose", Fs = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ z(function(t, n) {
    const { __scopeDialog: r, ...o } = t, s = U(Es, r);
    return /* @__PURE__ */ D.jsx(
      ne.button,
      {
        type: "button",
        ...o,
        ref: n,
        onClick: Z(t.onClick, () => s.onOpenChange(!1))
      }
    );
  }, "DialogClose")
);
function Zn(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if (typeof n == "string")
      for (const r of String(n).trim().split(/\s+/))
        r && t.add(r);
  return t.size > 0 ? Array.from(t).join(" ") : void 0;
}
z(Zn, "concatAriaDescribedby");
function ze(e) {
  return e ? "open" : "closed";
}
z(ze, "getState");
export {
  Is as D,
  Rs as S,
  Os as a,
  Ts as b,
  qe as c,
  Ns as d,
  Ms as e,
  Ls as f,
  As as g,
  _s as h,
  Fs as i,
  Ps as r,
  ks as t
};
