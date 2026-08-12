import { g as Os, r as c, R as me, j as A, a as it } from "./react-vendor.js";
function $r(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (n = $r(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function rn() {
  for (var e, t, n = 0, r = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = $r(e)) && (r && (r += " "), r += t);
  return r;
}
const As = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clsx: rn,
  default: rn
}, Symbol.toStringTag, { value: "Module" })), ks = (e, t) => {
  const n = new Array(e.length + t.length);
  for (let r = 0; r < e.length; r++)
    n[r] = e[r];
  for (let r = 0; r < t.length; r++)
    n[e.length + r] = t[r];
  return n;
}, _s = (e, t) => ({
  classGroupId: e,
  validator: t
}), Lr = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
  nextPart: e,
  validators: t,
  classGroupId: n
}), Rt = "-", Un = [], Ds = "arbitrary..", Ns = (e) => {
  const t = $s(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: r
  } = e;
  return {
    getClassGroupId: (i) => {
      if (i.startsWith("[") && i.endsWith("]"))
        return Ts(i);
      const a = i.split(Rt), l = a[0] === "" && a.length > 1 ? 1 : 0;
      return Ir(a, l, t);
    },
    getConflictingClassGroupIds: (i, a) => {
      if (a) {
        const l = r[i], f = n[i];
        return l ? f ? ks(f, l) : l : f || Un;
      }
      return n[i] || Un;
    }
  };
}, Ir = (e, t, n) => {
  if (e.length - t === 0)
    return n.classGroupId;
  const o = e[t], s = n.nextPart.get(o);
  if (s) {
    const f = Ir(e, t + 1, s);
    if (f) return f;
  }
  const i = n.validators;
  if (i === null)
    return;
  const a = t === 0 ? e.join(Rt) : e.slice(t).join(Rt), l = i.length;
  for (let f = 0; f < l; f++) {
    const d = i[f];
    if (d.validator(a))
      return d.classGroupId;
  }
}, Ts = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
  return r ? Ds + r : void 0;
})(), $s = (e) => {
  const {
    theme: t,
    classGroups: n
  } = e;
  return Ls(n, t);
}, Ls = (e, t) => {
  const n = Lr();
  for (const r in e) {
    const o = e[r];
    wn(o, n, r, t);
  }
  return n;
}, wn = (e, t, n, r) => {
  const o = e.length;
  for (let s = 0; s < o; s++) {
    const i = e[s];
    Is(i, t, n, r);
  }
}, Is = (e, t, n, r) => {
  if (typeof e == "string") {
    Ms(e, t, n);
    return;
  }
  if (typeof e == "function") {
    Fs(e, t, n, r);
    return;
  }
  js(e, t, n, r);
}, Ms = (e, t, n) => {
  const r = e === "" ? t : Mr(t, e);
  r.classGroupId = n;
}, Fs = (e, t, n, r) => {
  if (Ws(e)) {
    wn(e(r), t, n, r);
    return;
  }
  t.validators === null && (t.validators = []), t.validators.push(_s(n, e));
}, js = (e, t, n, r) => {
  const o = Object.entries(e), s = o.length;
  for (let i = 0; i < s; i++) {
    const [a, l] = o[i];
    wn(l, Mr(t, a), n, r);
  }
}, Mr = (e, t) => {
  let n = e;
  const r = t.split(Rt), o = r.length;
  for (let s = 0; s < o; s++) {
    const i = r[s];
    let a = n.nextPart.get(i);
    a || (a = Lr(), n.nextPart.set(i, a)), n = a;
  }
  return n;
}, Ws = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, zs = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, n = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null);
  const o = (s, i) => {
    n[s] = i, t++, t > e && (t = 0, r = n, n = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(s) {
      let i = n[s];
      if (i !== void 0)
        return i;
      if ((i = r[s]) !== void 0)
        return o(s, i), i;
    },
    set(s, i) {
      s in n ? n[s] = i : o(s, i);
    }
  };
}, on = "!", Gn = ":", Vs = [], Hn = (e, t, n, r, o) => ({
  modifiers: e,
  hasImportantModifier: t,
  baseClassName: n,
  maybePostfixModifierPosition: r,
  isExternal: o
}), Bs = (e) => {
  const {
    prefix: t,
    experimentalParseClassName: n
  } = e;
  let r = (o) => {
    const s = [];
    let i = 0, a = 0, l = 0, f;
    const d = o.length;
    for (let m = 0; m < d; m++) {
      const v = o[m];
      if (i === 0 && a === 0) {
        if (v === Gn) {
          s.push(o.slice(l, m)), l = m + 1;
          continue;
        }
        if (v === "/") {
          f = m;
          continue;
        }
      }
      v === "[" ? i++ : v === "]" ? i-- : v === "(" ? a++ : v === ")" && a--;
    }
    const u = s.length === 0 ? o : o.slice(l);
    let p = u, h = !1;
    u.endsWith(on) ? (p = u.slice(0, -1), h = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      u.startsWith(on) && (p = u.slice(1), h = !0)
    );
    const g = f && f > l ? f - l : void 0;
    return Hn(s, h, p, g);
  };
  if (t) {
    const o = t + Gn, s = r;
    r = (i) => i.startsWith(o) ? s(i.slice(o.length)) : Hn(Vs, !1, i, void 0, !0);
  }
  if (n) {
    const o = r;
    r = (s) => n({
      className: s,
      parseClassName: o
    });
  }
  return r;
}, Us = (e) => {
  const t = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((n, r) => {
    t.set(n, 1e6 + r);
  }), (n) => {
    const r = [];
    let o = [];
    for (let s = 0; s < n.length; s++) {
      const i = n[s], a = i[0] === "[", l = t.has(i);
      a || l ? (o.length > 0 && (o.sort(), r.push(...o), o = []), r.push(i)) : o.push(i);
    }
    return o.length > 0 && (o.sort(), r.push(...o)), r;
  };
}, Gs = (e) => ({
  cache: zs(e.cacheSize),
  parseClassName: Bs(e),
  sortModifiers: Us(e),
  postfixLookupClassGroupIds: Hs(e),
  ...Ns(e)
}), Hs = (e) => {
  const t = /* @__PURE__ */ Object.create(null), n = e.postfixLookupClassGroups;
  if (n)
    for (let r = 0; r < n.length; r++)
      t[n[r]] = !0;
  return t;
}, Ys = /\s+/, Ks = (e, t) => {
  const {
    parseClassName: n,
    getClassGroupId: r,
    getConflictingClassGroupIds: o,
    sortModifiers: s,
    postfixLookupClassGroupIds: i
  } = t, a = [], l = e.trim().split(Ys);
  let f = "";
  for (let d = l.length - 1; d >= 0; d -= 1) {
    const u = l[d], {
      isExternal: p,
      modifiers: h,
      hasImportantModifier: g,
      baseClassName: m,
      maybePostfixModifierPosition: v
    } = n(u);
    if (p) {
      f = u + (f.length > 0 ? " " + f : f);
      continue;
    }
    let b = !!v, w;
    if (b) {
      const k = m.substring(0, v);
      w = r(k);
      const E = w && i[w] ? r(m) : void 0;
      E && E !== w && (w = E, b = !1);
    } else
      w = r(m);
    if (!w) {
      if (!b) {
        f = u + (f.length > 0 ? " " + f : f);
        continue;
      }
      if (w = r(m), !w) {
        f = u + (f.length > 0 ? " " + f : f);
        continue;
      }
      b = !1;
    }
    const y = h.length === 0 ? "" : h.length === 1 ? h[0] : s(h).join(":"), x = g ? y + on : y, C = x + w;
    if (a.indexOf(C) > -1)
      continue;
    a.push(C);
    const S = o(w, b);
    for (let k = 0; k < S.length; ++k) {
      const E = S[k];
      a.push(x + E);
    }
    f = u + (f.length > 0 ? " " + f : f);
  }
  return f;
}, Xs = (...e) => {
  let t = 0, n, r, o = "";
  for (; t < e.length; )
    (n = e[t++]) && (r = Fr(n)) && (o && (o += " "), o += r);
  return o;
}, Fr = (e) => {
  if (typeof e == "string")
    return e;
  let t, n = "";
  for (let r = 0; r < e.length; r++)
    e[r] && (t = Fr(e[r])) && (n && (n += " "), n += t);
  return n;
}, Zs = (e, ...t) => {
  let n, r, o, s;
  const i = (l) => {
    const f = t.reduce((d, u) => u(d), e());
    return n = Gs(f), r = n.cache.get, o = n.cache.set, s = a, a(l);
  }, a = (l) => {
    const f = r(l);
    if (f)
      return f;
    const d = Ks(l, n);
    return o(l, d), d;
  };
  return s = i, (...l) => s(Xs(...l));
}, qs = [], B = (e) => {
  const t = (n) => n[e] || qs;
  return t.isThemeGetter = !0, t;
}, jr = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Wr = /^\((?:(\w[\w-]*):)?(.+)\)$/i, Qs = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, Js = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, ei = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, ti = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, ni = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, ri = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, be = (e) => Qs.test(e), T = (e) => !!e && !Number.isNaN(Number(e)), J = (e) => !!e && Number.isInteger(Number(e)), Bt = (e) => e.endsWith("%") && T(e.slice(0, -1)), ae = (e) => Js.test(e), zr = () => !0, oi = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  ei.test(e) && !ti.test(e)
), xn = () => !1, si = (e) => ni.test(e), ii = (e) => ri.test(e), ai = (e) => !P(e) && !R(e), ci = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), li = (e) => Ce(e, Ur, xn), P = (e) => jr.test(e), ke = (e) => Ce(e, Gr, oi), Yn = (e) => Ce(e, vi, T), ui = (e) => Ce(e, Yr, zr), fi = (e) => Ce(e, Hr, xn), Kn = (e) => Ce(e, Vr, xn), di = (e) => Ce(e, Br, ii), ft = (e) => Ce(e, Kr, si), R = (e) => Wr.test(e), et = (e) => $e(e, Gr), pi = (e) => $e(e, Hr), Xn = (e) => $e(e, Vr), mi = (e) => $e(e, Ur), hi = (e) => $e(e, Br), dt = (e) => $e(e, Kr, !0), gi = (e) => $e(e, Yr, !0), Ce = (e, t, n) => {
  const r = jr.exec(e);
  return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, $e = (e, t, n = !1) => {
  const r = Wr.exec(e);
  return r ? r[1] ? t(r[1]) : n : !1;
}, Vr = (e) => e === "position" || e === "percentage", Br = (e) => e === "image" || e === "url", Ur = (e) => e === "length" || e === "size" || e === "bg-size", Gr = (e) => e === "length", vi = (e) => e === "number", Hr = (e) => e === "family-name", Yr = (e) => e === "number" || e === "weight", Kr = (e) => e === "shadow", bi = () => {
  const e = B("color"), t = B("font"), n = B("text"), r = B("font-weight"), o = B("tracking"), s = B("leading"), i = B("breakpoint"), a = B("container"), l = B("spacing"), f = B("radius"), d = B("shadow"), u = B("inset-shadow"), p = B("text-shadow"), h = B("drop-shadow"), g = B("blur"), m = B("perspective"), v = B("aspect"), b = B("ease"), w = B("animate"), y = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], x = () => [
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
  ], C = () => [...x(), R, P], S = () => ["auto", "hidden", "clip", "visible", "scroll"], k = () => ["auto", "contain", "none"], E = () => [R, P, l], N = () => [be, "full", "auto", ...E()], L = () => [J, "none", "subgrid", R, P], _ = () => ["auto", {
    span: ["full", J, R, P]
  }, J, R, P], D = () => [J, "auto", R, P], F = () => ["auto", "min", "max", "fr", R, P], M = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], z = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], I = () => ["auto", ...E()], W = () => [be, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...E()], $ = () => [be, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...E()], j = () => [be, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...E()], O = () => [e, R, P], Ze = () => [...x(), Xn, Kn, {
    position: [R, P]
  }], qe = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], Pe = () => ["auto", "cover", "contain", mi, li, {
    size: [R, P]
  }], Qe = () => [Bt, et, ke], G = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    f,
    R,
    P
  ], H = () => ["", T, et, ke], Ie = () => ["solid", "dashed", "dotted", "double"], lt = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], V = () => [T, Bt, Xn, Kn], Je = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    g,
    R,
    P
  ], Re = () => ["none", T, R, P], Oe = () => ["none", T, R, P], Me = () => [T, R, P], Ae = () => [be, "full", ...E()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [ae],
      breakpoint: [ae],
      color: [zr],
      container: [ae],
      "drop-shadow": [ae],
      ease: ["in", "out", "in-out"],
      font: [ai],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [ae],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [ae],
      shadow: [ae],
      spacing: ["px", T],
      text: [ae],
      "text-shadow": [ae],
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
        aspect: ["auto", "square", be, P, R, v]
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
        "@container": ["", "normal", "size", R, P]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [ci],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [T, P, R, a]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": y()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": y()
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
        object: C()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: S()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": S()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": S()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: k()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": k()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": k()
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
        inset: N()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": N()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": N()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": N(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: N()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": N(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: N()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": N()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": N()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: N()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: N()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: N()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: N()
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
        z: [J, "auto", R, P]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [be, "full", "auto", a, ...E()]
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
        flex: [T, be, "auto", "initial", "none", P]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", T, R, P]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", T, R, P]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [J, "first", "last", "none", R, P]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": L()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: _()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": D()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": D()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": L()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: _()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": D()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": D()
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
        "auto-cols": F()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": F()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: E()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": E()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": E()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...M(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...z(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...z()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...M()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...z(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...z(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": M()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...z(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...z()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: E()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: E()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: E()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: E()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: E()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: E()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: E()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: E()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: E()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: E()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: E()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: I()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: I()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: I()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: I()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: I()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: I()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: I()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: I()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: I()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: I()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: I()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": E()
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
        "space-y": E()
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
        size: W()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/width
       */
      "inline-size": [{
        inline: ["auto", ...$()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...$()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...$()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ...j()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ...j()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ...j()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [a, "screen", ...W()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          a,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...W()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          a,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [i]
          },
          ...W()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...W()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...W()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...W()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", n, et, ke]
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
        font: [r, gi, ui]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Bt, P]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [pi, fi, t]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [P]
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
        tracking: [o, R, P]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [T, "none", R, Yn]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          s,
          ...E()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", R, P]
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
        list: ["disc", "decimal", "none", R, P]
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
        placeholder: O()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: O()
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
        decoration: [...Ie(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [T, "from-font", "auto", R, ke]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: O()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [T, "auto", R, P]
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
        indent: E()
      }],
      /**
       * Tab Size
       * @see https://tailwindcss.com/docs/tab-size
       */
      "tab-size": [{
        tab: [J, R, P]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", R, P]
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
        content: ["none", R, P]
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
        bg: Ze()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: qe()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: Pe()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, J, R, P],
          radial: ["", R, P],
          conic: [J, R, P]
        }, hi, di]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: O()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: Qe()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: Qe()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: Qe()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: O()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: O()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: O()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: G()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": G()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": G()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": G()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": G()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": G()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": G()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": G()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": G()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": G()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": G()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": G()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": G()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": G()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": G()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: H()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": H()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": H()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": H()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": H()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": H()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": H()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": H()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": H()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": H()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": H()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": H()
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
        "divide-y": H()
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
        border: [...Ie(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...Ie(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: O()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": O()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": O()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": O()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": O()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": O()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": O()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": O()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": O()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": O()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": O()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: O()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...Ie(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [T, R, P]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", T, et, ke]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: O()
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
          dt,
          ft
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: O()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", u, dt, ft]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": O()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: H()
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
        ring: O()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [T, ke]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": O()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": H()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": O()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", p, dt, ft]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": O()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [T, R, P]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...lt(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": lt()
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
        "mask-linear": [T]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": V()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": V()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": O()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": O()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": V()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": V()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": O()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": O()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": V()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": V()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": O()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": O()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": V()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": V()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": O()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": O()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": V()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": V()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": O()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": O()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": V()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": V()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": O()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": O()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": V()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": V()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": O()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": O()
      }],
      "mask-image-radial": [{
        "mask-radial": [R, P]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": V()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": V()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": O()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": O()
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
        "mask-radial-at": x()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [T]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": V()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": V()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": O()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": O()
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
        mask: Ze()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: qe()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: Pe()
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
        mask: ["none", R, P]
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
          R,
          P
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: Je()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [T, R, P]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [T, R, P]
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
          h,
          dt,
          ft
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": O()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", T, R, P]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [T, R, P]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", T, R, P]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [T, R, P]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", T, R, P]
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
          R,
          P
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": Je()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [T, R, P]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [T, R, P]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", T, R, P]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [T, R, P]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", T, R, P]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [T, R, P]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [T, R, P]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", T, R, P]
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
        "border-spacing": E()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": E()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": E()
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
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", R, P]
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
        duration: [T, "initial", R, P]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", b, R, P]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [T, R, P]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", w, R, P]
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
        perspective: [m, R, P]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": C()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: Re()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": Re()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": Re()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": Re()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: Oe()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": Oe()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": Oe()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": Oe()
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
        transform: [R, P, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: C()
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
        translate: Ae()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": Ae()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": Ae()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": Ae()
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
        zoom: [J, R, P]
      }],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: O()
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
        caret: O()
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
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", R, P]
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
        "scrollbar-thumb": O()
      }],
      /**
       * Scrollbar Track Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-track-color": [{
        "scrollbar-track": O()
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
        "scroll-m": E()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": E()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": E()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": E()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": E()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": E()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": E()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": E()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": E()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": E()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": E()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": E()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": E()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": E()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": E()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": E()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": E()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": E()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": E()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": E()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": E()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": E()
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
        "will-change": ["auto", "scroll", "contents", "transform", R, P]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...O()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [T, et, ke, Yn]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...O()]
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
}, qu = /* @__PURE__ */ Zs(bi), Qu = /* @__PURE__ */ Os(As);
function Zn(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function yi(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const s = Zn(o, t);
      return !n && typeof s == "function" && (n = !0), s;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const s = r[o];
          typeof s == "function" ? s() : Zn(e[o], null);
        }
      };
  };
}
function wi(...e) {
  return c.useCallback(yi(...e), e);
}
// @__NO_SIDE_EFFECTS__
function Ge(e) {
  const t = c.forwardRef((n, r) => {
    let { children: o, ...s } = n, i = null, a = !1;
    const l = [];
    qn(o) && typeof pt == "function" && (o = pt(o._payload)), c.Children.forEach(o, (p) => {
      var h;
      if (Pi(p)) {
        a = !0;
        const g = p;
        let m = "child" in g.props ? g.props.child : g.props.children;
        qn(m) && typeof pt == "function" && (m = pt(m._payload)), i = Ei(g, m), l.push((h = i == null ? void 0 : i.props) == null ? void 0 : h.children);
      } else
        l.push(p);
    }), i ? i = c.cloneElement(i, void 0, l) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && c.Children.count(o) === 1 && c.isValidElement(o) && (i = o)
    );
    const f = i ? Si(i) : void 0, d = wi(r, f);
    if (!i) {
      if (o || o === 0)
        throw new Error(
          a ? ki(e) : Ai(e)
        );
      return o;
    }
    const u = Ci(s, i.props ?? {});
    return i.type !== c.Fragment && (u.ref = r ? d : f), c.cloneElement(i, u);
  });
  return t.displayName = `${e}.Slot`, t;
}
var Ju = /* @__PURE__ */ Ge("Slot"), xi = Symbol.for("radix.slottable"), Ei = (e, t) => {
  if ("child" in e.props) {
    const n = e.props.child;
    return c.isValidElement(n) ? c.cloneElement(n, void 0, e.props.children(n.props.children)) : null;
  }
  return c.isValidElement(t) ? t : null;
};
function Ci(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r], s = t[r];
    /^on[A-Z]/.test(r) ? o && s ? n[r] = (...a) => {
      const l = s(...a);
      return o(...a), l;
    } : o && (n[r] = o) : r === "style" ? n[r] = { ...o, ...s } : r === "className" && (n[r] = [o, s].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function Si(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
function Pi(e) {
  return c.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === xi;
}
var Ri = Symbol.for("react.lazy");
function qn(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === Ri && "_payload" in e && Oi(e._payload);
}
function Oi(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
var Ai = (e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, ki = (e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, pt = me[" use ".trim().toString()];
const Qn = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, Jn = rn, ef = (e, t) => (n) => {
  var r;
  if ((t == null ? void 0 : t.variants) == null) return Jn(e, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
  const { variants: o, defaultVariants: s } = t, i = Object.keys(o).map((f) => {
    const d = n == null ? void 0 : n[f], u = s == null ? void 0 : s[f];
    if (d === null) return null;
    const p = Qn(d) || Qn(u);
    return o[f][p];
  }), a = n && Object.entries(n).reduce((f, d) => {
    let [u, p] = d;
    return p === void 0 || (f[u] = p), f;
  }, {}), l = t == null || (r = t.compoundVariants) === null || r === void 0 ? void 0 : r.reduce((f, d) => {
    let { class: u, className: p, ...h } = d;
    return Object.entries(h).every((g) => {
      let [m, v] = g;
      return Array.isArray(v) ? v.includes({
        ...s,
        ...a
      }[m]) : {
        ...s,
        ...a
      }[m] === v;
    }) ? [
      ...f,
      u,
      p
    ] : f;
  }, []);
  return Jn(e, i, l, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
};
function nt(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function(o) {
    if (e == null || e(o), n === !1 || !o || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  };
}
function er(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function _i(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const s = er(o, t);
      return !n && typeof s == "function" && (n = !0), s;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const s = r[o];
          typeof s == "function" ? s() : er(e[o], null);
        }
      };
  };
}
function En(...e) {
  return c.useCallback(_i(...e), e);
}
function Di(e, t = []) {
  let n = [];
  function r(s, i) {
    const a = c.createContext(i);
    a.displayName = s + "Context";
    const l = n.length;
    n = [...n, i];
    const f = (u) => {
      var b;
      const { scope: p, children: h, ...g } = u, m = ((b = p == null ? void 0 : p[e]) == null ? void 0 : b[l]) || a, v = c.useMemo(() => g, Object.values(g));
      return /* @__PURE__ */ A.jsx(m.Provider, { value: v, children: h });
    };
    f.displayName = s + "Provider";
    function d(u, p, h = {}) {
      var b;
      const { optional: g = !1 } = h, m = ((b = p == null ? void 0 : p[e]) == null ? void 0 : b[l]) || a, v = c.useContext(m);
      if (v) return v;
      if (i !== void 0) return i;
      if (!g)
        throw new Error(`\`${u}\` must be used within \`${s}\``);
    }
    return [f, d];
  }
  const o = () => {
    const s = n.map((i) => c.createContext(i));
    return function(a) {
      const l = (a == null ? void 0 : a[e]) || s;
      return c.useMemo(
        () => ({ [`__scope${e}`]: { ...a, [e]: l } }),
        [a, l]
      );
    };
  };
  return o.scopeName = e, [r, Ni(o, ...t)];
}
function Ni(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = () => {
    const r = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return function(s) {
      const i = r.reduce((a, { useScope: l, scopeName: f }) => {
        const u = l(s)[`__scope${f}`];
        return { ...a, ...u };
      }, {});
      return c.useMemo(() => ({ [`__scope${t.scopeName}`]: i }), [i]);
    };
  };
  return n.scopeName = t.scopeName, n;
}
var Ti = globalThis != null && globalThis.document ? c.useLayoutEffect : () => {
}, $i = me[" useId ".trim().toString()] || (() => {
}), Li = 0;
function Ut(e) {
  const [t, n] = c.useState($i());
  return Ti(() => {
    n((r) => r ?? String(Li++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
var Ii = globalThis != null && globalThis.document ? c.useLayoutEffect : () => {
}, Mi = me[" useInsertionEffect ".trim().toString()] || Ii;
function Fi({
  prop: e,
  defaultProp: t,
  onChange: n = () => {
  },
  caller: r
}) {
  const [o, s, i] = ji({
    defaultProp: t,
    onChange: n
  }), a = e !== void 0, l = a ? e : o;
  {
    const d = c.useRef(e !== void 0);
    c.useEffect(() => {
      const u = d.current;
      u !== a && console.warn(
        `${r} is changing from ${u ? "controlled" : "uncontrolled"} to ${a ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), d.current = a;
    }, [a, r]);
  }
  const f = c.useCallback(
    (d) => {
      var u;
      if (a) {
        const p = Wi(d) ? d(e) : d;
        p !== e && ((u = i.current) == null || u.call(i, p));
      } else
        s(d);
    },
    [a, e, s, i]
  );
  return [l, f];
}
function ji({
  defaultProp: e,
  onChange: t
}) {
  const [n, r] = c.useState(e), o = c.useRef(n), s = c.useRef(t);
  return Mi(() => {
    s.current = t;
  }, [t]), c.useEffect(() => {
    var i;
    o.current !== n && ((i = s.current) == null || i.call(s, n), o.current = n);
  }, [n, o]), [n, r, s];
}
function Wi(e) {
  return typeof e == "function";
}
function Gt(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function(o) {
    if (e == null || e(o), n === !1 || !o || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  };
}
var zi = [
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
], Xr = zi.reduce((e, t) => {
  const n = /* @__PURE__ */ Ge(`Primitive.${t}`), r = c.forwardRef((o, s) => {
    const { asChild: i, ...a } = o, l = i ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ A.jsx(l, { ...a, ref: s });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function Vi(e, t) {
  e && it.flushSync(() => e.dispatchEvent(t));
}
function tr(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function Bi(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const s = tr(o, t);
      return !n && typeof s == "function" && (n = !0), s;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const s = r[o];
          typeof s == "function" ? s() : tr(e[o], null);
        }
      };
  };
}
function Zr(...e) {
  return c.useCallback(Bi(...e), e);
}
function Cn(e) {
  const t = c.useRef(e);
  return c.useEffect(() => {
    t.current = e;
  }), c.useMemo(() => (...n) => {
    var r;
    return (r = t.current) == null ? void 0 : r.call(t, ...n);
  }, []);
}
var Ui = "DismissableLayer", sn = "dismissableLayer.update", Gi = "dismissableLayer.pointerDownOutside", Hi = "dismissableLayer.focusOutside", nr, Sn = c.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set(),
  // Outside elements that belong to a layer's own dismiss affordance (eg, a
  // dialog overlay). Pressing them should dismiss the layer regardless of
  // whether or not they stop propagation.
  //
  // See https://github.com/radix-ui/primitives/issues/3346
  dismissableSurfaces: /* @__PURE__ */ new Set()
}), qr = c.forwardRef(
  (e, t) => {
    const {
      disableOutsidePointerEvents: n = !1,
      deferPointerDownOutside: r = !1,
      onEscapeKeyDown: o,
      onPointerDownOutside: s,
      onFocusOutside: i,
      onInteractOutside: a,
      onDismiss: l,
      ...f
    } = e, d = c.useContext(Sn), [u, p] = c.useState(null), h = (u == null ? void 0 : u.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, g] = c.useState({}), m = Zr(t, p), v = Array.from(d.layers), [b] = [
      ...d.layersWithOutsidePointerEventsDisabled
    ].slice(-1), w = b ? v.indexOf(b) : -1, y = u ? v.indexOf(u) : -1, x = d.layersWithOutsidePointerEventsDisabled.size > 0, C = y >= w, S = c.useRef(!1), k = qi(
      (_) => {
        s == null || s(_), a == null || a(_), _.defaultPrevented || l == null || l();
      },
      {
        ownerDocument: h,
        deferPointerDownOutside: r,
        isDeferredPointerDownOutsideRef: S,
        dismissableSurfaces: d.dismissableSurfaces,
        shouldHandlePointerDownOutside: c.useCallback(
          (_) => {
            if (!(_ instanceof Node))
              return !1;
            const D = [...d.branches].some(
              (F) => F.contains(_)
            );
            return C && !D;
          },
          [d.branches, C]
        )
      }
    ), E = Qi((_) => {
      if (r && S.current)
        return;
      const D = _.target;
      [...d.branches].some((M) => M.contains(D)) || (i == null || i(_), a == null || a(_), _.defaultPrevented || l == null || l());
    }, h), N = u ? y === v.length - 1 : !1, L = Cn((_) => {
      _.key === "Escape" && (o == null || o(_), !_.defaultPrevented && l && (_.preventDefault(), l()));
    });
    return c.useEffect(() => {
      if (N)
        return h.addEventListener("keydown", L, { capture: !0 }), () => h.removeEventListener("keydown", L, { capture: !0 });
    }, [h, N, L]), c.useEffect(() => {
      if (u)
        return n && (d.layersWithOutsidePointerEventsDisabled.size === 0 && (nr = h.body.style.pointerEvents, h.body.style.pointerEvents = "none"), d.layersWithOutsidePointerEventsDisabled.add(u)), d.layers.add(u), rr(), () => {
          n && (d.layersWithOutsidePointerEventsDisabled.delete(u), d.layersWithOutsidePointerEventsDisabled.size === 0 && (h.body.style.pointerEvents = nr));
        };
    }, [u, h, n, d]), c.useEffect(() => () => {
      u && (d.layers.delete(u), d.layersWithOutsidePointerEventsDisabled.delete(u), rr());
    }, [u, d]), c.useEffect(() => {
      const _ = () => g({});
      return document.addEventListener(sn, _), () => document.removeEventListener(sn, _);
    }, []), /* @__PURE__ */ A.jsx(
      Xr.div,
      {
        ...f,
        ref: m,
        style: {
          pointerEvents: x ? C ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: Gt(e.onFocusCapture, E.onFocusCapture),
        onBlurCapture: Gt(e.onBlurCapture, E.onBlurCapture),
        onPointerDownCapture: Gt(
          e.onPointerDownCapture,
          k.onPointerDownCapture
        )
      }
    );
  }
);
qr.displayName = Ui;
var Yi = "DismissableLayerBranch", Ki = c.forwardRef((e, t) => {
  const n = c.useContext(Sn), r = c.useRef(null), o = Zr(t, r);
  return c.useEffect(() => {
    const s = r.current;
    if (s)
      return n.branches.add(s), () => {
        n.branches.delete(s);
      };
  }, [n.branches]), /* @__PURE__ */ A.jsx(Xr.div, { ...e, ref: o });
});
Ki.displayName = Yi;
function Xi() {
  const e = c.useContext(Sn), [t, n] = c.useState(null);
  return c.useEffect(() => {
    if (t)
      return e.dismissableSurfaces.add(t), () => {
        e.dismissableSurfaces.delete(t);
      };
  }, [t, e.dismissableSurfaces]), n;
}
var Zi = () => !0;
function qi(e, t) {
  const {
    ownerDocument: n = globalThis == null ? void 0 : globalThis.document,
    deferPointerDownOutside: r = !1,
    isDeferredPointerDownOutsideRef: o,
    dismissableSurfaces: s,
    shouldHandlePointerDownOutside: i = Zi
  } = t, a = Cn(e), l = c.useRef(!1), f = c.useRef(!1), d = c.useRef(/* @__PURE__ */ new Map()), u = c.useRef(() => {
  });
  return c.useEffect(() => {
    function p() {
      f.current = !1, o.current = !1, d.current.clear();
    }
    function h() {
      return Array.from(d.current.values()).some(Boolean);
    }
    function g(y) {
      if (!f.current)
        return;
      const x = y.target;
      x instanceof Node && [...s].some((S) => S.contains(x)) || d.current.set(y.type, !0), y.type === "click" && window.setTimeout(() => {
        f.current && u.current();
      }, 0);
    }
    function m(y) {
      f.current && d.current.set(y.type, !1);
    }
    const v = (y) => {
      if (y.target && !l.current) {
        let x = function() {
          n.removeEventListener("click", u.current);
          const S = h();
          p(), S || Qr(
            Gi,
            a,
            C,
            { discrete: !0 }
          );
        };
        if (!i(y.target)) {
          n.removeEventListener("click", u.current), p(), l.current = !1;
          return;
        }
        const C = { originalEvent: y };
        f.current = !0, o.current = r && y.button === 0, d.current.clear(), !r || y.button !== 0 ? x() : (n.removeEventListener("click", u.current), u.current = x, n.addEventListener("click", u.current, { once: !0 }));
      } else
        n.removeEventListener("click", u.current), p();
      l.current = !1;
    }, b = [
      "pointerup",
      "mousedown",
      "mouseup",
      "touchstart",
      "touchend",
      "click"
    ];
    for (const y of b)
      n.addEventListener(y, g, !0), n.addEventListener(y, m);
    const w = window.setTimeout(() => {
      n.addEventListener("pointerdown", v);
    }, 0);
    return () => {
      window.clearTimeout(w), n.removeEventListener("pointerdown", v), n.removeEventListener("click", u.current);
      for (const y of b)
        n.removeEventListener(y, g, !0), n.removeEventListener(y, m);
    };
  }, [
    n,
    a,
    r,
    o,
    s,
    i
  ]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => l.current = !0
  };
}
function Qi(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = Cn(e), r = c.useRef(!1);
  return c.useEffect(() => {
    const o = (s) => {
      s.target && !r.current && Qr(Hi, n, { originalEvent: s }, {
        discrete: !1
      });
    };
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, n]), {
    onFocusCapture: () => r.current = !0,
    onBlurCapture: () => r.current = !1
  };
}
function rr() {
  const e = new CustomEvent(sn);
  document.dispatchEvent(e);
}
function Qr(e, t, n, { discrete: r }) {
  const o = n.originalEvent.target, s = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && o.addEventListener(e, t, { once: !0 }), r ? Vi(o, s) : o.dispatchEvent(s);
}
function or(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function Ji(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const s = or(o, t);
      return !n && typeof s == "function" && (n = !0), s;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const s = r[o];
          typeof s == "function" ? s() : or(e[o], null);
        }
      };
  };
}
function ea(...e) {
  return c.useCallback(Ji(...e), e);
}
var ta = [
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
], na = ta.reduce((e, t) => {
  const n = /* @__PURE__ */ Ge(`Primitive.${t}`), r = c.forwardRef((o, s) => {
    const { asChild: i, ...a } = o, l = i ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ A.jsx(l, { ...a, ref: s });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function sr(e) {
  const t = c.useRef(e);
  return c.useEffect(() => {
    t.current = e;
  }), c.useMemo(() => (...n) => {
    var r;
    return (r = t.current) == null ? void 0 : r.call(t, ...n);
  }, []);
}
var Ht = "focusScope.autoFocusOnMount", Yt = "focusScope.autoFocusOnUnmount", ir = { bubbles: !1, cancelable: !0 }, ra = "FocusScope", Jr = c.forwardRef((e, t) => {
  const {
    loop: n = !1,
    trapped: r = !1,
    onMountAutoFocus: o,
    onUnmountAutoFocus: s,
    ...i
  } = e, [a, l] = c.useState(null), f = sr(o), d = sr(s), u = c.useRef(null), p = ea(t, l), h = c.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  c.useEffect(() => {
    if (r) {
      let m = function(y) {
        if (h.paused || !a) return;
        const x = y.target;
        a.contains(x) ? u.current = x : ye(u.current, { select: !0 });
      }, v = function(y) {
        if (h.paused || !a) return;
        const x = y.relatedTarget;
        x !== null && (a.contains(x) || ye(u.current, { select: !0 }));
      }, b = function(y) {
        if (document.activeElement === document.body)
          for (const C of y)
            C.removedNodes.length > 0 && ye(a);
      };
      document.addEventListener("focusin", m), document.addEventListener("focusout", v);
      const w = new MutationObserver(b);
      return a && w.observe(a, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", m), document.removeEventListener("focusout", v), w.disconnect();
      };
    }
  }, [r, a, h.paused]), c.useEffect(() => {
    if (a) {
      cr.add(h);
      const m = document.activeElement;
      if (!a.contains(m)) {
        const b = new CustomEvent(Ht, ir);
        a.addEventListener(Ht, f), a.dispatchEvent(b), b.defaultPrevented || (oa(la(eo(a)), { select: !0 }), document.activeElement === m && ye(a));
      }
      return () => {
        a.removeEventListener(Ht, f), setTimeout(() => {
          const b = new CustomEvent(Yt, ir);
          a.addEventListener(Yt, d), a.dispatchEvent(b), b.defaultPrevented || ye(m ?? document.body, { select: !0 }), a.removeEventListener(Yt, d), cr.remove(h);
        }, 0);
      };
    }
  }, [a, f, d, h]);
  const g = c.useCallback(
    (m) => {
      if (!n && !r || h.paused) return;
      const v = m.key === "Tab" && !m.altKey && !m.ctrlKey && !m.metaKey, b = document.activeElement;
      if (v && b) {
        const w = m.currentTarget, [y, x] = sa(w);
        y && x ? !m.shiftKey && b === x ? (m.preventDefault(), n && ye(y, { select: !0 })) : m.shiftKey && b === y && (m.preventDefault(), n && ye(x, { select: !0 })) : b === w && m.preventDefault();
      }
    },
    [n, r, h.paused]
  );
  return /* @__PURE__ */ A.jsx(na.div, { tabIndex: -1, ...i, ref: p, onKeyDown: g });
});
Jr.displayName = ra;
function oa(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const r of e)
    if (ye(r, { select: t }), document.activeElement !== n) return;
}
function sa(e) {
  const t = eo(e), n = ar(t, e), r = ar(t.reverse(), e);
  return [n, r];
}
function eo(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (r) => {
      const o = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || o ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function ar(e, t) {
  const n = typeof t.checkVisibility == "function" && t.checkVisibility({ checkVisibilityCSS: !0 });
  for (const r of e)
    if (!(n ? !r.checkVisibility({ checkVisibilityCSS: !0 }) : ia(r, { upTo: t })))
      return r;
}
function ia(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function aa(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function ye(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && aa(e) && t && e.select();
  }
}
var cr = ca();
function ca() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && (n == null || n.pause()), e = lr(e, t), e.unshift(t);
    },
    remove(t) {
      var n;
      e = lr(e, t), (n = e[0]) == null || n.resume();
    }
  };
}
function lr(e, t) {
  const n = [...e], r = n.indexOf(t);
  return r !== -1 && n.splice(r, 1), n;
}
function la(e) {
  return e.filter((t) => t.tagName !== "A");
}
var ua = [
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
], fa = ua.reduce((e, t) => {
  const n = /* @__PURE__ */ Ge(`Primitive.${t}`), r = c.forwardRef((o, s) => {
    const { asChild: i, ...a } = o, l = i ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ A.jsx(l, { ...a, ref: s });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {}), da = globalThis != null && globalThis.document ? c.useLayoutEffect : () => {
}, pa = "Portal", to = c.forwardRef((e, t) => {
  var a;
  const { container: n, ...r } = e, [o, s] = c.useState(!1);
  da(() => s(!0), []);
  const i = n || o && ((a = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : a.body);
  return i ? it.createPortal(/* @__PURE__ */ A.jsx(fa.div, { ...r, ref: t }), i) : null;
});
to.displayName = pa;
var ur = globalThis != null && globalThis.document ? c.useLayoutEffect : () => {
};
function ma(e, t) {
  return c.useReducer((n, r) => t[n][r] ?? n, e);
}
var Nt = (e) => {
  const { present: t, children: n } = e, r = ha(t), o = typeof n == "function" ? n({ present: r.isPresent }) : c.Children.only(n), s = ga(r.ref, va(o));
  return typeof n == "function" || r.isPresent ? c.cloneElement(o, { ref: s }) : null;
};
Nt.displayName = "Presence";
function ha(e) {
  const [t, n] = c.useState(), r = c.useRef(null), o = c.useRef(e), s = c.useRef("none"), i = c.useRef(void 0), a = e ? "mounted" : "unmounted", [l, f] = ma(a, {
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
    l === "mounted" ? (s.current = i.current ?? tt(r.current), i.current = void 0) : s.current = "none";
  }, [l]), ur(() => {
    const d = r.current, u = o.current;
    if (u !== e) {
      const h = s.current, g = tt(d);
      e ? (i.current = g, f("MOUNT")) : g === "none" || (d == null ? void 0 : d.display) === "none" ? f("UNMOUNT") : f(u && h !== g ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, f]), ur(() => {
    if (t) {
      let d;
      const u = t.ownerDocument.defaultView ?? window, p = (g) => {
        const v = tt(r.current).includes(CSS.escape(g.animationName));
        if (g.target === t && v && (f("ANIMATION_END"), !o.current)) {
          const b = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", d = u.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = b);
          });
        }
      }, h = (g) => {
        g.target === t && (s.current = tt(r.current));
      };
      return t.addEventListener("animationstart", h), t.addEventListener("animationcancel", p), t.addEventListener("animationend", p), () => {
        u.clearTimeout(d), t.removeEventListener("animationstart", h), t.removeEventListener("animationcancel", p), t.removeEventListener("animationend", p);
      };
    } else
      f("ANIMATION_END");
  }, [t, f]), {
    isPresent: ["mounted", "unmountSuspended"].includes(l),
    ref: c.useCallback((d) => {
      if (d) {
        const u = getComputedStyle(d);
        r.current = u, i.current = tt(u);
      } else
        r.current = null;
      n(d);
    }, [])
  };
}
function fr(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function ga(...e) {
  const t = c.useRef(e);
  return t.current = e, c.useCallback((n) => {
    const r = t.current;
    let o = !1;
    const s = r.map((i) => {
      const a = fr(i, n);
      return !o && typeof a == "function" && (o = !0), a;
    });
    if (o)
      return () => {
        for (let i = 0; i < s.length; i++) {
          const a = s[i];
          typeof a == "function" ? a() : fr(r[i], null);
        }
      };
  }, []);
}
function tt(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function va(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var ba = [
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
], at = ba.reduce((e, t) => {
  const n = /* @__PURE__ */ Ge(`Primitive.${t}`), r = c.forwardRef((o, s) => {
    const { asChild: i, ...a } = o, l = i ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ A.jsx(l, { ...a, ref: s });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {}), mt = 0, ee = null;
function ya() {
  c.useEffect(() => {
    ee || (ee = { start: dr(), end: dr() });
    const { start: e, end: t } = ee;
    return document.body.firstElementChild !== e && document.body.insertAdjacentElement("afterbegin", e), document.body.lastElementChild !== t && document.body.insertAdjacentElement("beforeend", t), mt++, () => {
      mt === 1 && (ee == null || ee.start.remove(), ee == null || ee.end.remove(), ee = null), mt = Math.max(0, mt - 1);
    };
  }, []);
}
function dr() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var ne = function() {
  return ne = Object.assign || function(t) {
    for (var n, r = 1, o = arguments.length; r < o; r++) {
      n = arguments[r];
      for (var s in n) Object.prototype.hasOwnProperty.call(n, s) && (t[s] = n[s]);
    }
    return t;
  }, ne.apply(this, arguments);
};
function no(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
}
function wa(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, o = t.length, s; r < o; r++)
    (s || !(r in t)) && (s || (s = Array.prototype.slice.call(t, 0, r)), s[r] = t[r]);
  return e.concat(s || Array.prototype.slice.call(t));
}
var Ct = "right-scroll-bar-position", St = "width-before-scroll-bar", xa = "with-scroll-bars-hidden", Ea = "--removed-body-scroll-bar-size";
function Kt(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function Ca(e, t) {
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
var Sa = typeof window < "u" ? c.useLayoutEffect : c.useEffect, pr = /* @__PURE__ */ new WeakMap();
function Pa(e, t) {
  var n = Ca(null, function(r) {
    return e.forEach(function(o) {
      return Kt(o, r);
    });
  });
  return Sa(function() {
    var r = pr.get(n);
    if (r) {
      var o = new Set(r), s = new Set(e), i = n.current;
      o.forEach(function(a) {
        s.has(a) || Kt(a, null);
      }), s.forEach(function(a) {
        o.has(a) || Kt(a, i);
      });
    }
    pr.set(n, e);
  }, [e]), n;
}
function Ra(e) {
  return e;
}
function Oa(e, t) {
  t === void 0 && (t = Ra);
  var n = [], r = !1, o = {
    read: function() {
      if (r)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return n.length ? n[n.length - 1] : e;
    },
    useMedium: function(s) {
      var i = t(s, r);
      return n.push(i), function() {
        n = n.filter(function(a) {
          return a !== i;
        });
      };
    },
    assignSyncMedium: function(s) {
      for (r = !0; n.length; ) {
        var i = n;
        n = [], i.forEach(s);
      }
      n = {
        push: function(a) {
          return s(a);
        },
        filter: function() {
          return n;
        }
      };
    },
    assignMedium: function(s) {
      r = !0;
      var i = [];
      if (n.length) {
        var a = n;
        n = [], a.forEach(s), i = n;
      }
      var l = function() {
        var d = i;
        i = [], d.forEach(s);
      }, f = function() {
        return Promise.resolve().then(l);
      };
      f(), n = {
        push: function(d) {
          i.push(d), f();
        },
        filter: function(d) {
          return i = i.filter(d), n;
        }
      };
    }
  };
  return o;
}
function Aa(e) {
  e === void 0 && (e = {});
  var t = Oa(null);
  return t.options = ne({ async: !0, ssr: !1 }, e), t;
}
var ro = function(e) {
  var t = e.sideCar, n = no(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var r = t.read();
  if (!r)
    throw new Error("Sidecar medium not found");
  return c.createElement(r, ne({}, n));
};
ro.isSideCarExport = !0;
function ka(e, t) {
  return e.useMedium(t), ro;
}
var oo = Aa(), Xt = function() {
}, Tt = c.forwardRef(function(e, t) {
  var n = c.useRef(null), r = c.useState({
    onScrollCapture: Xt,
    onWheelCapture: Xt,
    onTouchMoveCapture: Xt
  }), o = r[0], s = r[1], i = e.forwardProps, a = e.children, l = e.className, f = e.removeScrollBar, d = e.enabled, u = e.shards, p = e.sideCar, h = e.noRelative, g = e.noIsolation, m = e.inert, v = e.allowPinchZoom, b = e.as, w = b === void 0 ? "div" : b, y = e.gapMode, x = no(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), C = p, S = Pa([n, t]), k = ne(ne({}, x), o);
  return c.createElement(
    c.Fragment,
    null,
    d && c.createElement(C, { sideCar: oo, removeScrollBar: f, shards: u, noRelative: h, noIsolation: g, inert: m, setCallbacks: s, allowPinchZoom: !!v, lockRef: n, gapMode: y }),
    i ? c.cloneElement(c.Children.only(a), ne(ne({}, k), { ref: S })) : c.createElement(w, ne({}, k, { className: l, ref: S }), a)
  );
});
Tt.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
Tt.classNames = {
  fullWidth: St,
  zeroRight: Ct
};
var _a = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function Da() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = _a();
  return t && e.setAttribute("nonce", t), e;
}
function Na(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function Ta(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var $a = function() {
  var e = 0, t = null;
  return {
    add: function(n) {
      e == 0 && (t = Da()) && (Na(t, n), Ta(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, La = function() {
  var e = $a();
  return function(t, n) {
    c.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && n]);
  };
}, so = function() {
  var e = La(), t = function(n) {
    var r = n.styles, o = n.dynamic;
    return e(r, o), null;
  };
  return t;
}, Ia = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, Zt = function(e) {
  return parseInt(e || "", 10) || 0;
}, Ma = function(e) {
  var t = window.getComputedStyle(document.body), n = t[e === "padding" ? "paddingLeft" : "marginLeft"], r = t[e === "padding" ? "paddingTop" : "marginTop"], o = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [Zt(n), Zt(r), Zt(o)];
}, Fa = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return Ia;
  var t = Ma(e), n = document.documentElement.clientWidth, r = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, r - n + t[2] - t[0])
  };
}, ja = so(), Ve = "data-scroll-locked", Wa = function(e, t, n, r) {
  var o = e.left, s = e.top, i = e.right, a = e.gap;
  return n === void 0 && (n = "margin"), `
  .`.concat(xa, ` {
   overflow: hidden `).concat(r, `;
   padding-right: `).concat(a, "px ").concat(r, `;
  }
  body[`).concat(Ve, `] {
    overflow: hidden `).concat(r, `;
    overscroll-behavior: contain;
    `).concat([
    t && "position: relative ".concat(r, ";"),
    n === "margin" && `
    padding-left: `.concat(o, `px;
    padding-top: `).concat(s, `px;
    padding-right: `).concat(i, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(a, "px ").concat(r, `;
    `),
    n === "padding" && "padding-right: ".concat(a, "px ").concat(r, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(Ct, ` {
    right: `).concat(a, "px ").concat(r, `;
  }
  
  .`).concat(St, ` {
    margin-right: `).concat(a, "px ").concat(r, `;
  }
  
  .`).concat(Ct, " .").concat(Ct, ` {
    right: 0 `).concat(r, `;
  }
  
  .`).concat(St, " .").concat(St, ` {
    margin-right: 0 `).concat(r, `;
  }
  
  body[`).concat(Ve, `] {
    `).concat(Ea, ": ").concat(a, `px;
  }
`);
}, mr = function() {
  var e = parseInt(document.body.getAttribute(Ve) || "0", 10);
  return isFinite(e) ? e : 0;
}, za = function() {
  c.useEffect(function() {
    return document.body.setAttribute(Ve, (mr() + 1).toString()), function() {
      var e = mr() - 1;
      e <= 0 ? document.body.removeAttribute(Ve) : document.body.setAttribute(Ve, e.toString());
    };
  }, []);
}, Va = function(e) {
  var t = e.noRelative, n = e.noImportant, r = e.gapMode, o = r === void 0 ? "margin" : r;
  za();
  var s = c.useMemo(function() {
    return Fa(o);
  }, [o]);
  return c.createElement(ja, { styles: Wa(s, !t, o, n ? "" : "!important") });
}, an = !1;
if (typeof window < "u")
  try {
    var ht = Object.defineProperty({}, "passive", {
      get: function() {
        return an = !0, !0;
      }
    });
    window.addEventListener("test", ht, ht), window.removeEventListener("test", ht, ht);
  } catch {
    an = !1;
  }
var Fe = an ? { passive: !1 } : !1, Ba = function(e) {
  return e.tagName === "TEXTAREA";
}, io = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var n = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    n[t] !== "hidden" && // contains scroll inside self
    !(n.overflowY === n.overflowX && !Ba(e) && n[t] === "visible")
  );
}, Ua = function(e) {
  return io(e, "overflowY");
}, Ga = function(e) {
  return io(e, "overflowX");
}, hr = function(e, t) {
  var n = t.ownerDocument, r = t;
  do {
    typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host);
    var o = ao(e, r);
    if (o) {
      var s = co(e, r), i = s[1], a = s[2];
      if (i > a)
        return !0;
    }
    r = r.parentNode;
  } while (r && r !== n.body);
  return !1;
}, Ha = function(e) {
  var t = e.scrollTop, n = e.scrollHeight, r = e.clientHeight;
  return [
    t,
    n,
    r
  ];
}, Ya = function(e) {
  var t = e.scrollLeft, n = e.scrollWidth, r = e.clientWidth;
  return [
    t,
    n,
    r
  ];
}, ao = function(e, t) {
  return e === "v" ? Ua(t) : Ga(t);
}, co = function(e, t) {
  return e === "v" ? Ha(t) : Ya(t);
}, Ka = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, Xa = function(e, t, n, r, o) {
  var s = Ka(e, window.getComputedStyle(t).direction), i = s * r, a = n.target, l = t.contains(a), f = !1, d = i > 0, u = 0, p = 0;
  do {
    if (!a)
      break;
    var h = co(e, a), g = h[0], m = h[1], v = h[2], b = m - v - s * g;
    (g || b) && ao(e, a) && (u += b, p += g);
    var w = a.parentNode;
    a = w && w.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? w.host : w;
  } while (
    // portaled content
    !l && a !== document.body || // self content
    l && (t.contains(a) || t === a)
  );
  return (d && Math.abs(u) < 1 || !d && Math.abs(p) < 1) && (f = !0), f;
}, gt = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, gr = function(e) {
  return [e.deltaX, e.deltaY];
}, vr = function(e) {
  return e && "current" in e ? e.current : e;
}, Za = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, qa = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, Qa = 0, je = [];
function Ja(e) {
  var t = c.useRef([]), n = c.useRef([0, 0]), r = c.useRef(), o = c.useState(Qa++)[0], s = c.useState(so)[0], i = c.useRef(e);
  c.useEffect(function() {
    i.current = e;
  }, [e]), c.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var m = wa([e.lockRef.current], (e.shards || []).map(vr), !0).filter(Boolean);
      return m.forEach(function(v) {
        return v.classList.add("allow-interactivity-".concat(o));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(o)), m.forEach(function(v) {
          return v.classList.remove("allow-interactivity-".concat(o));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var a = c.useCallback(function(m, v) {
    if ("touches" in m && m.touches.length === 2 || m.type === "wheel" && m.ctrlKey)
      return !i.current.allowPinchZoom;
    var b = gt(m), w = n.current, y = "deltaX" in m ? m.deltaX : w[0] - b[0], x = "deltaY" in m ? m.deltaY : w[1] - b[1], C, S = m.target, k = Math.abs(y) > Math.abs(x) ? "h" : "v";
    if ("touches" in m && k === "h" && S.type === "range")
      return !1;
    var E = window.getSelection(), N = E && E.anchorNode, L = N ? N === S || N.contains(S) : !1;
    if (L)
      return !1;
    var _ = hr(k, S);
    if (!_)
      return !0;
    if (_ ? C = k : (C = k === "v" ? "h" : "v", _ = hr(k, S)), !_)
      return !1;
    if (!r.current && "changedTouches" in m && (y || x) && (r.current = C), !C)
      return !0;
    var D = r.current || C;
    return Xa(D, v, m, D === "h" ? y : x);
  }, []), l = c.useCallback(function(m) {
    var v = m;
    if (!(!je.length || je[je.length - 1] !== s)) {
      var b = "deltaY" in v ? gr(v) : gt(v), w = t.current.filter(function(C) {
        return C.name === v.type && (C.target === v.target || v.target === C.shadowParent) && Za(C.delta, b);
      })[0];
      if (w && w.should) {
        v.cancelable && v.preventDefault();
        return;
      }
      if (!w) {
        var y = (i.current.shards || []).map(vr).filter(Boolean).filter(function(C) {
          return C.contains(v.target);
        }), x = y.length > 0 ? a(v, y[0]) : !i.current.noIsolation;
        x && v.cancelable && v.preventDefault();
      }
    }
  }, []), f = c.useCallback(function(m, v, b, w) {
    var y = { name: m, delta: v, target: b, should: w, shadowParent: ec(b) };
    t.current.push(y), setTimeout(function() {
      t.current = t.current.filter(function(x) {
        return x !== y;
      });
    }, 1);
  }, []), d = c.useCallback(function(m) {
    n.current = gt(m), r.current = void 0;
  }, []), u = c.useCallback(function(m) {
    f(m.type, gr(m), m.target, a(m, e.lockRef.current));
  }, []), p = c.useCallback(function(m) {
    f(m.type, gt(m), m.target, a(m, e.lockRef.current));
  }, []);
  c.useEffect(function() {
    return je.push(s), e.setCallbacks({
      onScrollCapture: u,
      onWheelCapture: u,
      onTouchMoveCapture: p
    }), document.addEventListener("wheel", l, Fe), document.addEventListener("touchmove", l, Fe), document.addEventListener("touchstart", d, Fe), function() {
      je = je.filter(function(m) {
        return m !== s;
      }), document.removeEventListener("wheel", l, Fe), document.removeEventListener("touchmove", l, Fe), document.removeEventListener("touchstart", d, Fe);
    };
  }, []);
  var h = e.removeScrollBar, g = e.inert;
  return c.createElement(
    c.Fragment,
    null,
    g ? c.createElement(s, { styles: qa(o) }) : null,
    h ? c.createElement(Va, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function ec(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const tc = ka(oo, Ja);
var Pn = c.forwardRef(function(e, t) {
  return c.createElement(Tt, ne({}, e, { ref: t, sideCar: tc }));
});
Pn.classNames = Tt.classNames;
var nc = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, We = /* @__PURE__ */ new WeakMap(), vt = /* @__PURE__ */ new WeakMap(), bt = {}, qt = 0, lo = function(e) {
  return e && (e.host || lo(e.parentNode));
}, rc = function(e, t) {
  return t.map(function(n) {
    if (e.contains(n))
      return n;
    var r = lo(n);
    return r && e.contains(r) ? r : (console.error("aria-hidden", n, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, oc = function(e, t, n, r) {
  var o = rc(t, Array.isArray(e) ? e : [e]);
  bt[n] || (bt[n] = /* @__PURE__ */ new WeakMap());
  var s = bt[n], i = [], a = /* @__PURE__ */ new Set(), l = new Set(o), f = function(u) {
    !u || a.has(u) || (a.add(u), f(u.parentNode));
  };
  o.forEach(f);
  var d = function(u) {
    !u || l.has(u) || Array.prototype.forEach.call(u.children, function(p) {
      if (a.has(p))
        d(p);
      else
        try {
          var h = p.getAttribute(r), g = h !== null && h !== "false", m = (We.get(p) || 0) + 1, v = (s.get(p) || 0) + 1;
          We.set(p, m), s.set(p, v), i.push(p), m === 1 && g && vt.set(p, !0), v === 1 && p.setAttribute(n, "true"), g || p.setAttribute(r, "true");
        } catch (b) {
          console.error("aria-hidden: cannot operate on ", p, b);
        }
    });
  };
  return d(t), a.clear(), qt++, function() {
    i.forEach(function(u) {
      var p = We.get(u) - 1, h = s.get(u) - 1;
      We.set(u, p), s.set(u, h), p || (vt.has(u) || u.removeAttribute(r), vt.delete(u)), h || u.removeAttribute(n);
    }), qt--, qt || (We = /* @__PURE__ */ new WeakMap(), We = /* @__PURE__ */ new WeakMap(), vt = /* @__PURE__ */ new WeakMap(), bt = {});
  };
}, uo = function(e, t, n) {
  n === void 0 && (n = "data-aria-hidden");
  var r = Array.from(Array.isArray(e) ? e : [e]), o = nc(e);
  return o ? (r.push.apply(r, Array.from(o.querySelectorAll("[aria-live], script"))), oc(r, o, n, "aria-hidden")) : function() {
    return null;
  };
}, $t = "Dialog", [fo] = Di($t), [sc, Z] = fo($t), ic = (e) => {
  const {
    __scopeDialog: t,
    children: n,
    open: r,
    defaultOpen: o,
    onOpenChange: s,
    modal: i = !0
  } = e, a = c.useRef(null), l = c.useRef(null), [f, d] = Fi({
    prop: r,
    defaultProp: o ?? !1,
    onChange: s,
    caller: $t
  });
  return /* @__PURE__ */ A.jsx(
    sc,
    {
      scope: t,
      triggerRef: a,
      contentRef: l,
      contentId: Ut(),
      titleId: Ut(),
      descriptionId: Ut(),
      open: f,
      onOpenChange: d,
      onOpenToggle: c.useCallback(() => d((u) => !u), [d]),
      modal: i,
      children: n
    }
  );
};
ic.displayName = $t;
var po = "DialogTrigger", ac = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = Z(po, n), s = En(t, o.triggerRef);
    return /* @__PURE__ */ A.jsx(
      at.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.open ? o.contentId : void 0,
        "data-state": On(o.open),
        ...r,
        ref: s,
        onClick: nt(e.onClick, o.onOpenToggle)
      }
    );
  }
);
ac.displayName = po;
var Rn = "DialogPortal", [cc, mo] = fo(Rn, {
  forceMount: void 0
}), lc = (e) => {
  const { __scopeDialog: t, forceMount: n, children: r, container: o } = e, s = Z(Rn, t);
  return /* @__PURE__ */ A.jsx(cc, { scope: t, forceMount: n, children: c.Children.map(r, (i) => /* @__PURE__ */ A.jsx(Nt, { present: n || s.open, children: /* @__PURE__ */ A.jsx(to, { asChild: !0, container: o, children: i }) })) });
};
lc.displayName = Rn;
var Ot = "DialogOverlay", uc = c.forwardRef(
  (e, t) => {
    const n = mo(Ot, e.__scopeDialog), { forceMount: r = n.forceMount, ...o } = e, s = Z(Ot, e.__scopeDialog);
    return s.modal ? /* @__PURE__ */ A.jsx(Nt, { present: r || s.open, children: /* @__PURE__ */ A.jsx(dc, { ...o, ref: t }) }) : null;
  }
);
uc.displayName = Ot;
var fc = /* @__PURE__ */ Ge("DialogOverlay.RemoveScroll"), dc = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = Z(Ot, n), s = Xi(), i = En(t, s);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ A.jsx(Pn, { as: fc, allowPinchZoom: !0, shards: [o.contentRef], children: /* @__PURE__ */ A.jsx(
        at.div,
        {
          "data-state": On(o.open),
          ...r,
          ref: i,
          style: { pointerEvents: "auto", ...r.style }
        }
      ) })
    );
  }
), Ue = "DialogContent", pc = c.forwardRef(
  (e, t) => {
    const n = mo(Ue, e.__scopeDialog), { forceMount: r = n.forceMount, ...o } = e, s = Z(Ue, e.__scopeDialog);
    return /* @__PURE__ */ A.jsx(Nt, { present: r || s.open, children: s.modal ? /* @__PURE__ */ A.jsx(mc, { ...o, ref: t }) : /* @__PURE__ */ A.jsx(hc, { ...o, ref: t }) });
  }
);
pc.displayName = Ue;
var mc = c.forwardRef(
  (e, t) => {
    const n = Z(Ue, e.__scopeDialog), r = c.useRef(null), o = En(t, n.contentRef, r);
    return c.useEffect(() => {
      const s = r.current;
      if (s) return uo(s);
    }, []), /* @__PURE__ */ A.jsx(
      ho,
      {
        ...e,
        ref: o,
        trapFocus: n.open,
        disableOutsidePointerEvents: n.open,
        onCloseAutoFocus: nt(e.onCloseAutoFocus, (s) => {
          var i;
          s.preventDefault(), (i = n.triggerRef.current) == null || i.focus();
        }),
        onPointerDownOutside: nt(e.onPointerDownOutside, (s) => {
          const i = s.detail.originalEvent, a = i.button === 0 && i.ctrlKey === !0;
          (i.button === 2 || a) && s.preventDefault();
        }),
        onFocusOutside: nt(
          e.onFocusOutside,
          (s) => s.preventDefault()
        )
      }
    );
  }
), hc = c.forwardRef(
  (e, t) => {
    const n = Z(Ue, e.__scopeDialog), r = c.useRef(!1), o = c.useRef(!1);
    return /* @__PURE__ */ A.jsx(
      ho,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (s) => {
          var i, a;
          (i = e.onCloseAutoFocus) == null || i.call(e, s), s.defaultPrevented || (r.current || (a = n.triggerRef.current) == null || a.focus(), s.preventDefault()), r.current = !1, o.current = !1;
        },
        onInteractOutside: (s) => {
          var l, f;
          (l = e.onInteractOutside) == null || l.call(e, s), s.defaultPrevented || (r.current = !0, s.detail.originalEvent.type === "pointerdown" && (o.current = !0));
          const i = s.target;
          ((f = n.triggerRef.current) == null ? void 0 : f.contains(i)) && s.preventDefault(), s.detail.originalEvent.type === "focusin" && o.current && s.preventDefault();
        }
      }
    );
  }
), ho = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, trapFocus: r, onOpenAutoFocus: o, onCloseAutoFocus: s, ...i } = e, a = Z(Ue, n);
    return ya(), /* @__PURE__ */ A.jsx(A.Fragment, { children: /* @__PURE__ */ A.jsx(
      Jr,
      {
        asChild: !0,
        loop: !0,
        trapped: r,
        onMountAutoFocus: o,
        onUnmountAutoFocus: s,
        children: /* @__PURE__ */ A.jsx(
          qr,
          {
            role: "dialog",
            id: a.contentId,
            "aria-describedby": a.descriptionId,
            "aria-labelledby": a.titleId,
            "data-state": On(a.open),
            ...i,
            ref: t,
            deferPointerDownOutside: !0,
            onDismiss: () => a.onOpenChange(!1)
          }
        )
      }
    ) });
  }
), go = "DialogTitle", gc = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = Z(go, n);
    return /* @__PURE__ */ A.jsx(at.h2, { id: o.titleId, ...r, ref: t });
  }
);
gc.displayName = go;
var vo = "DialogDescription", vc = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = Z(vo, n);
    return /* @__PURE__ */ A.jsx(at.p, { id: o.descriptionId, ...r, ref: t });
  }
);
vc.displayName = vo;
var bo = "DialogClose", bc = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = Z(bo, n);
    return /* @__PURE__ */ A.jsx(
      at.button,
      {
        type: "button",
        ...r,
        ref: t,
        onClick: nt(e.onClick, () => o.onOpenChange(!1))
      }
    );
  }
);
bc.displayName = bo;
function On(e) {
  return e ? "open" : "closed";
}
var yc = Object.defineProperty, He = (e, t) => yc(e, "name", { value: t, configurable: !0 }), yo = !!(typeof window < "u" && window.document && window.document.createElement);
function we(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return /* @__PURE__ */ He(function(o) {
    if (e == null || e(o), n === !1 || !o || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  }, "handleEvent");
}
He(we, "composeEventHandlers");
function wc(e) {
  var t;
  if (!yo)
    throw new Error("Cannot access window outside of the DOM");
  return ((t = e == null ? void 0 : e.ownerDocument) == null ? void 0 : t.defaultView) ?? window;
}
He(wc, "getOwnerWindow");
function cn(e) {
  if (!yo)
    throw new Error("Cannot access document outside of the DOM");
  return (e == null ? void 0 : e.ownerDocument) ?? document;
}
He(cn, "getOwnerDocument");
function wo(e, t = !1) {
  const { activeElement: n } = cn(e);
  if (!(n != null && n.nodeName))
    return null;
  if (xo(n) && n.contentDocument)
    return wo(n.contentDocument.body, t);
  if (t) {
    const r = n.getAttribute("aria-activedescendant");
    if (r) {
      const o = cn(n).getElementById(r);
      if (o)
        return o;
    }
  }
  return n;
}
He(wo, "getActiveElement");
function xo(e) {
  return e.tagName === "IFRAME";
}
He(xo, "isFrame");
var xc = Object.defineProperty, An = (e, t) => xc(e, "name", { value: t, configurable: !0 });
function ln(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
An(ln, "setRef");
function Eo(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const s = ln(o, t);
      return !n && typeof s == "function" && (n = !0), s;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const s = r[o];
          typeof s == "function" ? s() : ln(e[o], null);
        }
      };
  };
}
An(Eo, "composeRefs");
function he(...e) {
  return c.useCallback(Eo(...e), e);
}
An(he, "useComposedRefs");
var Ec = Object.defineProperty, X = (e, t) => Ec(e, "name", { value: t, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Cc(e, t) {
  const n = c.createContext(t);
  n.displayName = e + "Context";
  const r = /* @__PURE__ */ X((s) => {
    const { children: i, ...a } = s, l = c.useMemo(() => a, Object.values(a));
    return /* @__PURE__ */ A.jsx(n.Provider, { value: l, children: i });
  }, "Provider");
  r.displayName = e + "Provider";
  function o(s, i = {}) {
    const { optional: a = !1 } = i, l = c.useContext(n);
    if (l) return l;
    if (t !== void 0) return t;
    if (!a)
      throw new Error(`\`${s}\` must be used within \`${e}\``);
  }
  return X(o, "useContext"), [r, o];
}
X(Cc, "createContext");
// @__NO_SIDE_EFFECTS__
function kn(e, t = []) {
  let n = [];
  function r(s, i) {
    const a = c.createContext(i);
    a.displayName = s + "Context";
    const l = n.length;
    n = [...n, i];
    const f = /* @__PURE__ */ X((u) => {
      var b;
      const { scope: p, children: h, ...g } = u, m = ((b = p == null ? void 0 : p[e]) == null ? void 0 : b[l]) || a, v = c.useMemo(() => g, Object.values(g));
      return /* @__PURE__ */ A.jsx(m.Provider, { value: v, children: h });
    }, "Provider");
    f.displayName = s + "Provider";
    function d(u, p, h = {}) {
      var b;
      const { optional: g = !1 } = h, m = ((b = p == null ? void 0 : p[e]) == null ? void 0 : b[l]) || a, v = c.useContext(m);
      if (v) return v;
      if (i !== void 0) return i;
      if (!g)
        throw new Error(`\`${u}\` must be used within \`${s}\``);
    }
    return X(d, "useContext"), [f, d];
  }
  X(r, "createContext");
  const o = /* @__PURE__ */ X(() => {
    const s = n.map((i) => c.createContext(i));
    return /* @__PURE__ */ X(function(a) {
      const l = (a == null ? void 0 : a[e]) || s;
      return c.useMemo(
        () => ({ [`__scope${e}`]: { ...a, [e]: l } }),
        [a, l]
      );
    }, "useScope");
  }, "createScope");
  return o.scopeName = e, [r, Co(o, ...t)];
}
X(kn, "createContextScope");
function Co(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = /* @__PURE__ */ X(() => {
    const r = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return /* @__PURE__ */ X(function(s) {
      const i = r.reduce((a, { useScope: l, scopeName: f }) => {
        const u = l(s)[`__scope${f}`];
        return { ...a, ...u };
      }, {});
      return c.useMemo(() => ({ [`__scope${t.scopeName}`]: i }), [i]);
    }, "useComposedScopes");
  }, "createScope");
  return n.scopeName = t.scopeName, n;
}
X(Co, "composeContextScopes");
var Sc = Object.defineProperty, q = (e, t) => Sc(e, "name", { value: t, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function So(e) {
  const t = c.forwardRef((n, r) => {
    let { children: o, ...s } = n, i = null, a = !1;
    const l = [];
    un(o) && typeof yt == "function" && (o = yt(o._payload)), c.Children.forEach(o, (p) => {
      var h;
      if (Ao(p)) {
        a = !0;
        const g = p;
        let m = "child" in g.props ? g.props.child : g.props.children;
        un(m) && typeof yt == "function" && (m = yt(m._payload)), i = Rc(g, m), l.push((h = i == null ? void 0 : i.props) == null ? void 0 : h.children);
      } else
        l.push(p);
    }), i ? i = c.cloneElement(i, void 0, l) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && c.Children.count(o) === 1 && c.isValidElement(o) && (i = o)
    );
    const f = i ? Oo(i) : void 0, d = he(r, f);
    if (!i) {
      if (o || o === 0)
        throw new Error(
          a ? kc(e) : Ac(e)
        );
      return o;
    }
    const u = Ro(s, i.props ?? {});
    return i.type !== c.Fragment && (u.ref = r ? d : f), c.cloneElement(i, u);
  });
  return t.displayName = `${e}.Slot`, t;
}
q(So, "createSlot");
var Po = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function Pc(e) {
  const t = /* @__PURE__ */ q((n) => "child" in n ? n.children(n.child) : n.children, "Slottable");
  return t.displayName = `${e}.Slottable`, t.__radixId = Po, t;
}
q(Pc, "createSlottable");
var Rc = /* @__PURE__ */ q((e, t) => {
  if ("child" in e.props) {
    const n = e.props.child;
    return c.isValidElement(n) ? c.cloneElement(n, void 0, e.props.children(n.props.children)) : null;
  }
  return c.isValidElement(t) ? t : null;
}, "getSlottableElementFromSlottable");
function Ro(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r], s = t[r];
    /^on[A-Z]/.test(r) ? o && s ? n[r] = (...a) => {
      const l = s(...a);
      return o(...a), l;
    } : o && (n[r] = o) : r === "style" ? n[r] = { ...o, ...s } : r === "className" && (n[r] = [o, s].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
q(Ro, "mergeProps");
function Oo(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
q(Oo, "getElementRef");
function Ao(e) {
  return c.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Po;
}
q(Ao, "isSlottable");
var Oc = Symbol.for("react.lazy");
function un(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === Oc && "_payload" in e && ko(e._payload);
}
q(un, "isLazyComponent");
function ko(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
q(ko, "isPromiseLike");
var Ac = /* @__PURE__ */ q((e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), kc = /* @__PURE__ */ q((e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), yt = me[" use ".trim().toString()], _c = Object.defineProperty, Dc = (e, t) => _c(e, "name", { value: t, configurable: !0 }), Nc = [
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
], Le = Nc.reduce((e, t) => {
  const n = /* @__PURE__ */ So(`Primitive.${t}`), r = c.forwardRef((o, s) => {
    const { asChild: i, ...a } = o, l = i ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ A.jsx(l, { ...a, ref: s });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function _o(e, t) {
  e && it.flushSync(() => e.dispatchEvent(t));
}
Dc(_o, "dispatchDiscreteCustomEvent");
var Tc = Object.defineProperty, $c = (e, t) => Tc(e, "name", { value: t, configurable: !0 });
function De(e) {
  const t = c.useRef(e);
  return c.useEffect(() => {
    t.current = e;
  }), c.useMemo(() => (...n) => {
    var r;
    return (r = t.current) == null ? void 0 : r.call(t, ...n);
  }, []);
}
$c(De, "useCallbackRef");
var Lc = Object.defineProperty, U = (e, t) => Lc(e, "name", { value: t, configurable: !0 }), fn = "dismissableLayer.update", Ic = "dismissableLayer.pointerDownOutside", Mc = "dismissableLayer.focusOutside", br, Do = c.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set(),
  // Outside elements that belong to a layer's own dismiss affordance (eg, a
  // dialog overlay). Pressing them should dismiss the layer regardless of
  // whether or not they stop propagation.
  //
  // See https://github.com/radix-ui/primitives/issues/3346
  dismissableSurfaces: /* @__PURE__ */ new Set()
}), Fc = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ U(function(t, n) {
    const {
      disableOutsidePointerEvents: r = !1,
      deferPointerDownOutside: o = !1,
      onEscapeKeyDown: s,
      onPointerDownOutside: i,
      onFocusOutside: a,
      onInteractOutside: l,
      onDismiss: f,
      ...d
    } = t, u = c.useContext(Do), [p, h] = c.useState(null), g = (p == null ? void 0 : p.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, m] = c.useState({}), v = he(n, h), b = Array.from(u.layers), [w] = [
      ...u.layersWithOutsidePointerEventsDisabled
    ].slice(-1), y = w ? b.indexOf(w) : -1, x = p ? b.indexOf(p) : -1, C = u.layersWithOutsidePointerEventsDisabled.size > 0, S = x >= y, k = c.useRef(!1), E = No(
      (D) => {
        i == null || i(D), l == null || l(D), D.defaultPrevented || f == null || f();
      },
      {
        ownerDocument: g,
        deferPointerDownOutside: o,
        isDeferredPointerDownOutsideRef: k,
        dismissableSurfaces: u.dismissableSurfaces,
        shouldHandlePointerDownOutside: c.useCallback(
          (D) => {
            if (!(D instanceof Node))
              return !1;
            const F = [...u.branches].some(
              (M) => M.contains(D)
            );
            return S && !F;
          },
          [u.branches, S]
        )
      }
    ), N = To((D) => {
      if (o && k.current)
        return;
      const F = D.target;
      [...u.branches].some((z) => z.contains(F)) || (a == null || a(D), l == null || l(D), D.defaultPrevented || f == null || f());
    }, g), L = p ? x === b.length - 1 : !1, _ = De((D) => {
      D.key === "Escape" && (s == null || s(D), !D.defaultPrevented && f && (D.preventDefault(), f()));
    });
    return c.useEffect(() => {
      if (L)
        return g.addEventListener("keydown", _, { capture: !0 }), () => g.removeEventListener("keydown", _, { capture: !0 });
    }, [g, L, _]), c.useEffect(() => {
      if (p)
        return r && (u.layersWithOutsidePointerEventsDisabled.size === 0 && (br = g.body.style.pointerEvents, g.body.style.pointerEvents = "none"), u.layersWithOutsidePointerEventsDisabled.add(p)), u.layers.add(p), dn(), () => {
          r && (u.layersWithOutsidePointerEventsDisabled.delete(p), u.layersWithOutsidePointerEventsDisabled.size === 0 && (g.body.style.pointerEvents = br));
        };
    }, [p, g, r, u]), c.useEffect(() => () => {
      p && (u.layers.delete(p), u.layersWithOutsidePointerEventsDisabled.delete(p), dn());
    }, [p, u]), c.useEffect(() => {
      const D = /* @__PURE__ */ U(() => m({}), "handleUpdate");
      return document.addEventListener(fn, D), () => document.removeEventListener(fn, D);
    }, []), /* @__PURE__ */ A.jsx(
      Le.div,
      {
        ...d,
        ref: v,
        style: {
          pointerEvents: C ? S ? "auto" : "none" : void 0,
          ...t.style
        },
        onFocusCapture: we(t.onFocusCapture, N.onFocusCapture),
        onBlurCapture: we(t.onBlurCapture, N.onBlurCapture),
        onPointerDownCapture: we(
          t.onPointerDownCapture,
          E.onPointerDownCapture
        )
      }
    );
  }, "DismissableLayer")
);
function jc() {
  const e = c.useContext(Do), [t, n] = c.useState(null);
  return c.useEffect(() => {
    if (t)
      return e.dismissableSurfaces.add(t), () => {
        e.dismissableSurfaces.delete(t);
      };
  }, [t, e.dismissableSurfaces]), n;
}
U(jc, "useDismissableLayerSurface");
var Wc = /* @__PURE__ */ U(() => !0, "IS_TRUE");
function No(e, t) {
  const {
    ownerDocument: n = globalThis == null ? void 0 : globalThis.document,
    deferPointerDownOutside: r = !1,
    isDeferredPointerDownOutsideRef: o,
    dismissableSurfaces: s,
    shouldHandlePointerDownOutside: i = Wc
  } = t, a = De(e), l = c.useRef(!1), f = c.useRef(!1), d = c.useRef(/* @__PURE__ */ new Map()), u = c.useRef(() => {
  });
  return c.useEffect(() => {
    function p() {
      f.current = !1, o.current = !1, d.current.clear();
    }
    U(p, "resetOutsideInteraction");
    function h() {
      return Array.from(d.current.values()).some(Boolean);
    }
    U(h, "isOutsideInteractionIntercepted");
    function g(y) {
      if (!f.current)
        return;
      const x = y.target;
      x instanceof Node && [...s].some((S) => S.contains(x)) || d.current.set(y.type, !0), y.type === "click" && window.setTimeout(() => {
        f.current && u.current();
      }, 0);
    }
    U(g, "handleInteractionCapture");
    function m(y) {
      f.current && d.current.set(y.type, !1);
    }
    U(m, "handleInteractionBubble");
    const v = /* @__PURE__ */ U((y) => {
      if (y.target && !l.current) {
        let x = function() {
          n.removeEventListener("click", u.current);
          const S = h();
          p(), S || _n(
            Ic,
            a,
            C,
            { discrete: !0 }
          );
        };
        if (U(x, "handleAndDispatchPointerDownOutsideEvent"), !i(y.target)) {
          n.removeEventListener("click", u.current), p(), l.current = !1;
          return;
        }
        const C = { originalEvent: y };
        f.current = !0, o.current = r && y.button === 0, d.current.clear(), !r || y.button !== 0 ? x() : (n.removeEventListener("click", u.current), u.current = x, n.addEventListener("click", u.current, { once: !0 }));
      } else
        n.removeEventListener("click", u.current), p();
      l.current = !1;
    }, "handlePointerDown"), b = [
      "pointerup",
      "mousedown",
      "mouseup",
      "touchstart",
      "touchend",
      "click"
    ];
    for (const y of b)
      n.addEventListener(y, g, !0), n.addEventListener(y, m);
    const w = window.setTimeout(() => {
      n.addEventListener("pointerdown", v);
    }, 0);
    return () => {
      window.clearTimeout(w), n.removeEventListener("pointerdown", v), n.removeEventListener("click", u.current);
      for (const y of b)
        n.removeEventListener(y, g, !0), n.removeEventListener(y, m);
    };
  }, [
    n,
    a,
    r,
    o,
    s,
    i
  ]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: /* @__PURE__ */ U(() => l.current = !0, "onPointerDownCapture")
  };
}
U(No, "usePointerDownOutside");
function To(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = De(e), r = c.useRef(!1);
  return c.useEffect(() => {
    const o = /* @__PURE__ */ U((s) => {
      s.target && !r.current && _n(Mc, n, { originalEvent: s }, {
        discrete: !1
      });
    }, "handleFocus");
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, n]), {
    onFocusCapture: /* @__PURE__ */ U(() => r.current = !0, "onFocusCapture"),
    onBlurCapture: /* @__PURE__ */ U(() => r.current = !1, "onBlurCapture")
  };
}
U(To, "useFocusOutside");
function dn() {
  const e = new CustomEvent(fn);
  document.dispatchEvent(e);
}
U(dn, "dispatchUpdate");
function _n(e, t, n, { discrete: r }) {
  const o = n.originalEvent.target, s = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && o.addEventListener(e, t, { once: !0 }), r ? _o(o, s) : o.dispatchEvent(s);
}
U(_n, "handleAndDispatchCustomEvent");
var zc = Object.defineProperty, Dn = (e, t) => zc(e, "name", { value: t, configurable: !0 }), wt = 0, te = null;
function Vc(e) {
  return Nn(), e.children;
}
Dn(Vc, "FocusGuards");
function Nn() {
  c.useEffect(() => {
    te || (te = { start: pn(), end: pn() });
    const { start: e, end: t } = te;
    return document.body.firstElementChild !== e && document.body.insertAdjacentElement("afterbegin", e), document.body.lastElementChild !== t && document.body.insertAdjacentElement("beforeend", t), wt++, () => {
      wt === 1 && (te == null || te.start.remove(), te == null || te.end.remove(), te = null), wt = Math.max(0, wt - 1);
    };
  }, []);
}
Dn(Nn, "useFocusGuards");
function pn() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
Dn(pn, "createFocusGuard");
var Bc = Object.defineProperty, Y = (e, t) => Bc(e, "name", { value: t, configurable: !0 }), Qt = "focusScope.autoFocusOnMount", Jt = "focusScope.autoFocusOnUnmount", yr = { bubbles: !1, cancelable: !0 }, Uc = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Y(function(t, n) {
    const {
      loop: r = !1,
      trapped: o = !1,
      onMountAutoFocus: s,
      onUnmountAutoFocus: i,
      ...a
    } = t, [l, f] = c.useState(null), d = De(s), u = De(i), p = c.useRef(null), h = he(n, f), g = c.useRef({
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
        let v = function(x) {
          if (g.paused || !l) return;
          const C = x.target;
          l.contains(C) ? p.current = C : ce(p.current, { select: !0 });
        }, b = function(x) {
          if (g.paused || !l) return;
          const C = x.relatedTarget;
          C !== null && (l.contains(C) || ce(p.current, { select: !0 }));
        }, w = function(x) {
          if (document.activeElement === document.body)
            for (const S of x)
              S.removedNodes.length > 0 && ce(l);
        };
        Y(v, "handleFocusIn"), Y(b, "handleFocusOut"), Y(w, "handleMutations"), document.addEventListener("focusin", v), document.addEventListener("focusout", b);
        const y = new MutationObserver(w);
        return l && y.observe(l, { childList: !0, subtree: !0 }), () => {
          document.removeEventListener("focusin", v), document.removeEventListener("focusout", b), y.disconnect();
        };
      }
    }, [o, l, g.paused]), c.useEffect(() => {
      if (l) {
        wr.add(g);
        const v = document.activeElement;
        if (!l.contains(v)) {
          const w = new CustomEvent(Qt, yr);
          l.addEventListener(Qt, d), l.dispatchEvent(w), w.defaultPrevented || ($o(jo(Tn(l)), { select: !0 }), document.activeElement === v && ce(l));
        }
        return () => {
          l.removeEventListener(Qt, d), setTimeout(() => {
            const w = new CustomEvent(Jt, yr);
            l.addEventListener(Jt, u), l.dispatchEvent(w), w.defaultPrevented || ce(v ?? document.body, { select: !0 }), l.removeEventListener(Jt, u), wr.remove(g);
          }, 0);
        };
      }
    }, [l, d, u, g]);
    const m = c.useCallback(
      (v) => {
        if (!r && !o || g.paused) return;
        const b = v.key === "Tab" && !v.altKey && !v.ctrlKey && !v.metaKey, w = document.activeElement;
        if (b && w) {
          const y = v.currentTarget, [x, C] = Lo(y);
          x && C ? !v.shiftKey && w === C ? (v.preventDefault(), r && ce(x, { select: !0 })) : v.shiftKey && w === x && (v.preventDefault(), r && ce(C, { select: !0 })) : w === y && v.preventDefault();
        }
      },
      [r, o, g.paused]
    );
    return /* @__PURE__ */ A.jsx(Le.div, { tabIndex: -1, ...a, ref: h, onKeyDown: m });
  }, "FocusScope")
);
function $o(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const r of e)
    if (ce(r, { select: t }), document.activeElement !== n) return;
}
Y($o, "focusFirst");
function Lo(e) {
  const t = Tn(e), n = mn(t, e), r = mn(t.reverse(), e);
  return [n, r];
}
Y(Lo, "getTabbableEdges");
function Tn(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: /* @__PURE__ */ Y((r) => {
      const o = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || o ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }, "acceptNode")
  });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
Y(Tn, "getTabbableCandidates");
function mn(e, t) {
  const n = typeof t.checkVisibility == "function" && t.checkVisibility({ checkVisibilityCSS: !0 });
  for (const r of e)
    if (!(n ? !r.checkVisibility({ checkVisibilityCSS: !0 }) : Io(r, { upTo: t })))
      return r;
}
Y(mn, "findVisible");
function Io(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
Y(Io, "isHidden");
function Mo(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
Y(Mo, "isSelectableInput");
function ce(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && Mo(e) && t && e.select();
  }
}
Y(ce, "focus");
var wr = Fo();
function Fo() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && (n == null || n.pause()), e = hn(e, t), e.unshift(t);
    },
    remove(t) {
      var n;
      e = hn(e, t), (n = e[0]) == null || n.resume();
    }
  };
}
Y(Fo, "createFocusScopesStack");
function hn(e, t) {
  const n = [...e], r = n.indexOf(t);
  return r !== -1 && n.splice(r, 1), n;
}
Y(hn, "arrayRemove");
function jo(e) {
  return e.filter((t) => t.tagName !== "A");
}
Y(jo, "removeLinks");
var oe = globalThis != null && globalThis.document ? c.useLayoutEffect : () => {
}, Gc = Object.defineProperty, Hc = (e, t) => Gc(e, "name", { value: t, configurable: !0 }), Yc = me[" useId ".trim().toString()] || (() => {
}), Kc = 0;
function Wo(e) {
  const [t, n] = c.useState(Yc());
  return oe(() => {
    e || n((r) => r ?? String(Kc++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
Hc(Wo, "useId");
const Xc = ["top", "right", "bottom", "left"], xe = Math.min, le = Math.max, At = Math.round, xt = Math.floor, ue = (e) => ({
  x: e,
  y: e
}), Zc = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function zo(e, t, n) {
  return le(e, xe(t, n));
}
function de(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function Ee(e) {
  return e.split("-")[0];
}
function Ye(e) {
  return e.split("-")[1];
}
function $n(e) {
  return e === "x" ? "y" : "x";
}
function Ln(e) {
  return e === "y" ? "height" : "width";
}
function re(e) {
  const t = e[0];
  return t === "t" || t === "b" ? "y" : "x";
}
function In(e) {
  return $n(re(e));
}
function qc(e, t, n) {
  n === void 0 && (n = !1);
  const r = Ye(e), o = In(e), s = Ln(o);
  let i = o === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return t.reference[s] > t.floating[s] && (i = kt(i)), [i, kt(i)];
}
function Qc(e) {
  const t = kt(e);
  return [gn(e), t, gn(t)];
}
function gn(e) {
  return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
const xr = ["left", "right"], Er = ["right", "left"], Jc = ["top", "bottom"], el = ["bottom", "top"];
function tl(e, t, n) {
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? Er : xr : t ? xr : Er;
    case "left":
    case "right":
      return t ? Jc : el;
    default:
      return [];
  }
}
function nl(e, t, n, r) {
  const o = Ye(e);
  let s = tl(Ee(e), n === "start", r);
  return o && (s = s.map((i) => i + "-" + o), t && (s = s.concat(s.map(gn)))), s;
}
function kt(e) {
  const t = Ee(e);
  return Zc[t] + e.slice(t.length);
}
function rl(e) {
  var t, n, r, o;
  return {
    top: (t = e.top) != null ? t : 0,
    right: (n = e.right) != null ? n : 0,
    bottom: (r = e.bottom) != null ? r : 0,
    left: (o = e.left) != null ? o : 0
  };
}
function Vo(e) {
  return typeof e != "number" ? rl(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function _t(e) {
  const {
    x: t,
    y: n,
    width: r,
    height: o
  } = e;
  return {
    width: r,
    height: o,
    top: n,
    left: t,
    right: t + r,
    bottom: n + o,
    x: t,
    y: n
  };
}
function Cr(e, t, n) {
  let {
    reference: r,
    floating: o
  } = e;
  const s = re(t), i = In(t), a = Ln(i), l = Ee(t), f = s === "y", d = r.x + r.width / 2 - o.width / 2, u = r.y + r.height / 2 - o.height / 2, p = r[a] / 2 - o[a] / 2;
  let h;
  switch (l) {
    case "top":
      h = {
        x: d,
        y: r.y - o.height
      };
      break;
    case "bottom":
      h = {
        x: d,
        y: r.y + r.height
      };
      break;
    case "right":
      h = {
        x: r.x + r.width,
        y: u
      };
      break;
    case "left":
      h = {
        x: r.x - o.width,
        y: u
      };
      break;
    default:
      h = {
        x: r.x,
        y: r.y
      };
  }
  const g = Ye(t);
  return g && (h[i] += p * (g === "end" ? 1 : -1) * (n && f ? -1 : 1)), h;
}
async function ol(e, t) {
  var n;
  t === void 0 && (t = {});
  const {
    x: r,
    y: o,
    platform: s,
    rects: i,
    elements: a,
    strategy: l
  } = e, {
    boundary: f = "clippingAncestors",
    rootBoundary: d = "viewport",
    elementContext: u = "floating",
    altBoundary: p = !1,
    padding: h = 0
  } = de(t, e), g = Vo(h), v = a[p ? u === "floating" ? "reference" : "floating" : u], b = _t(await s.getClippingRect({
    element: (n = await (s.isElement == null ? void 0 : s.isElement(v))) == null || n ? v : v.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: f,
    rootBoundary: d,
    strategy: l
  })), w = u === "floating" ? {
    x: r,
    y: o,
    width: i.floating.width,
    height: i.floating.height
  } : i.reference, y = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), x = await (s.isElement == null ? void 0 : s.isElement(y)) && await (s.getScale == null ? void 0 : s.getScale(y)) || {
    x: 1,
    y: 1
  }, C = _t(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: w,
    offsetParent: y,
    strategy: l
  }) : w);
  return {
    top: (b.top - C.top + g.top) / x.y,
    bottom: (C.bottom - b.bottom + g.bottom) / x.y,
    left: (b.left - C.left + g.left) / x.x,
    right: (C.right - b.right + g.right) / x.x
  };
}
const sl = 50, il = async (e, t, n) => {
  const {
    placement: r = "bottom",
    strategy: o = "absolute",
    middleware: s = [],
    platform: i
  } = n, a = i.detectOverflow ? i : {
    ...i,
    detectOverflow: ol
  }, l = await (i.isRTL == null ? void 0 : i.isRTL(t));
  let f = await i.getElementRects({
    reference: e,
    floating: t,
    strategy: o
  }), {
    x: d,
    y: u
  } = Cr(f, r, l), p = r, h = 0;
  const g = {};
  for (let m = 0; m < s.length; m++) {
    const v = s[m];
    if (!v)
      continue;
    const {
      name: b,
      fn: w
    } = v, {
      x: y,
      y: x,
      data: C,
      reset: S
    } = await w({
      x: d,
      y: u,
      initialPlacement: r,
      placement: p,
      strategy: o,
      middlewareData: g,
      rects: f,
      platform: a,
      elements: {
        reference: e,
        floating: t
      }
    });
    d = y ?? d, u = x ?? u, g[b] = {
      ...g[b],
      ...C
    }, S && h < sl && (h++, typeof S == "object" && (S.placement && (p = S.placement), S.rects && (f = S.rects === !0 ? await i.getElementRects({
      reference: e,
      floating: t,
      strategy: o
    }) : S.rects), {
      x: d,
      y: u
    } = Cr(f, p, l)), m = -1);
  }
  return {
    x: d,
    y: u,
    placement: p,
    strategy: o,
    middlewareData: g
  };
}, al = (e) => ({
  name: "arrow",
  options: e,
  async fn(t) {
    const {
      x: n,
      y: r,
      placement: o,
      rects: s,
      platform: i,
      elements: a,
      middlewareData: l
    } = t, {
      element: f,
      padding: d = 0
    } = de(e, t) || {};
    if (f == null)
      return {};
    const u = Vo(d), p = {
      x: n,
      y: r
    }, h = In(o), g = Ln(h), m = await i.getDimensions(f), v = h === "y", b = v ? "top" : "left", w = v ? "bottom" : "right", y = v ? "clientHeight" : "clientWidth", x = s.reference[g] + s.reference[h] - p[h] - s.floating[g], C = p[h] - s.reference[h], S = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(f));
    let k = S ? S[y] : 0;
    (!k || !await (i.isElement == null ? void 0 : i.isElement(S))) && (k = a.floating[y] || s.floating[g]);
    const E = x / 2 - C / 2, N = k / 2 - m[g] / 2 - 1, L = xe(u[b], N), _ = xe(u[w], N), D = k - m[g] - _, F = k / 2 - m[g] / 2 + E, M = zo(L, F, D), z = !l.arrow && Ye(o) != null && F !== M && s.reference[g] / 2 - (F < L ? L : _) - m[g] / 2 < 0, I = z ? F < L ? F - L : F - D : 0;
    return {
      [h]: p[h] + I,
      data: {
        [h]: M,
        centerOffset: F - M - I,
        ...z && {
          alignmentOffset: I
        }
      },
      reset: z
    };
  }
}), cl = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var n, r;
      const {
        placement: o,
        middlewareData: s,
        rects: i,
        initialPlacement: a,
        platform: l,
        elements: f
      } = t, {
        mainAxis: d = !0,
        crossAxis: u = !0,
        fallbackPlacements: p,
        fallbackStrategy: h = "bestFit",
        fallbackAxisSideDirection: g = "none",
        flipAlignment: m = !0,
        ...v
      } = de(e, t);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const b = Ee(o), w = re(a), y = Ee(a) === a, x = await (l.isRTL == null ? void 0 : l.isRTL(f.floating)), C = p || (y || !m ? [kt(a)] : Qc(a)), S = g !== "none";
      !p && S && C.push(...nl(a, m, g, x));
      const k = [a, ...C], E = await l.detectOverflow(t, v), N = [];
      let L = ((r = s.flip) == null ? void 0 : r.overflows) || [];
      if (d && N.push(E[b]), u) {
        const M = qc(o, i, x);
        N.push(E[M[0]], E[M[1]]);
      }
      if (L = [...L, {
        placement: o,
        overflows: N
      }], !N.every((M) => M <= 0)) {
        var _, D;
        const M = (((_ = s.flip) == null ? void 0 : _.index) || 0) + 1, z = k[M];
        if (z && (!(u === "alignment" ? w !== re(z) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        L.every(($) => re($.placement) === w ? $.overflows[0] > 0 : !0)))
          return {
            data: {
              index: M,
              overflows: L
            },
            reset: {
              placement: z
            }
          };
        let I = (D = L.filter((W) => W.overflows[0] <= 0).sort((W, $) => W.overflows[1] - $.overflows[1])[0]) == null ? void 0 : D.placement;
        if (!I)
          switch (h) {
            case "bestFit": {
              var F;
              const W = (F = L.filter(($) => {
                if (S) {
                  const j = re($.placement);
                  return j === w || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  j === "y";
                }
                return !0;
              }).map(($) => [$.placement, $.overflows.filter((j) => j > 0).reduce((j, O) => j + O, 0)]).sort(($, j) => $[1] - j[1])[0]) == null ? void 0 : F[0];
              W && (I = W);
              break;
            }
            case "initialPlacement":
              I = a;
              break;
          }
        if (o !== I)
          return {
            reset: {
              placement: I
            }
          };
      }
      return {};
    }
  };
};
function Sr(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width
  };
}
function Pr(e) {
  return Xc.some((t) => e[t] >= 0);
}
const ll = function(e) {
  return e === void 0 && (e = {}), {
    name: "hide",
    options: e,
    async fn(t) {
      const {
        rects: n,
        platform: r
      } = t, {
        strategy: o = "referenceHidden",
        ...s
      } = de(e, t);
      switch (o) {
        case "referenceHidden": {
          const i = await r.detectOverflow(t, {
            ...s,
            elementContext: "reference"
          }), a = Sr(i, n.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: Pr(a)
            }
          };
        }
        case "escaped": {
          const i = await r.detectOverflow(t, {
            ...s,
            altBoundary: !0
          }), a = Sr(i, n.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: Pr(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Bo = /* @__PURE__ */ new Set(["left", "top"]);
async function ul(e, t) {
  const {
    placement: n,
    platform: r,
    elements: o
  } = e, s = await (r.isRTL == null ? void 0 : r.isRTL(o.floating)), i = Ee(n), a = Ye(n), l = re(n) === "y", f = Bo.has(i) ? -1 : 1, d = s && l ? -1 : 1, u = de(t, e);
  let {
    mainAxis: p,
    crossAxis: h,
    alignmentAxis: g
  } = typeof u == "number" ? {
    mainAxis: u,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: u.mainAxis || 0,
    crossAxis: u.crossAxis || 0,
    alignmentAxis: u.alignmentAxis
  };
  return a && typeof g == "number" && (h = a === "end" ? g * -1 : g), l ? {
    x: h * d,
    y: p * f
  } : {
    x: p * f,
    y: h * d
  };
}
const fl = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var n, r;
      const {
        x: o,
        y: s,
        placement: i,
        middlewareData: a
      } = t, l = await ul(t, e);
      return i === ((n = a.offset) == null ? void 0 : n.placement) && (r = a.arrow) != null && r.alignmentOffset ? {} : {
        x: o + l.x,
        y: s + l.y,
        data: {
          ...l,
          placement: i
        }
      };
    }
  };
}, dl = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: n,
        y: r,
        placement: o,
        platform: s
      } = t, {
        mainAxis: i = !0,
        crossAxis: a = !1,
        limiter: l = {
          fn: (w) => {
            let {
              x: y,
              y: x
            } = w;
            return {
              x: y,
              y: x
            };
          }
        },
        ...f
      } = de(e, t), d = {
        x: n,
        y: r
      }, u = await s.detectOverflow(t, f), p = re(o), h = $n(p);
      let g = d[h], m = d[p];
      const v = (w, y) => zo(y + u[w === "y" ? "top" : "left"], y, y - u[w === "y" ? "bottom" : "right"]);
      i && (g = v(h, g)), a && (m = v(p, m));
      const b = l.fn({
        ...t,
        [h]: g,
        [p]: m
      });
      return {
        ...b,
        data: {
          x: b.x - n,
          y: b.y - r,
          enabled: {
            [h]: i,
            [p]: a
          }
        }
      };
    }
  };
}, pl = function(e) {
  return e === void 0 && (e = {}), {
    options: e,
    fn(t) {
      var n, r;
      const {
        x: o,
        y: s,
        placement: i,
        rects: a,
        middlewareData: l
      } = t, {
        offset: f = 0,
        mainAxis: d = !0,
        crossAxis: u = !0
      } = de(e, t), p = {
        x: o,
        y: s
      }, h = re(i), g = $n(h);
      let m = p[g], v = p[h];
      const b = de(f, t), w = typeof b == "number" ? {
        mainAxis: b,
        crossAxis: 0
      } : {
        mainAxis: (n = b.mainAxis) != null ? n : 0,
        crossAxis: (r = b.crossAxis) != null ? r : 0
      };
      if (d) {
        const C = g === "y" ? "height" : "width", S = a.reference[g] - a.floating[C] + w.mainAxis, k = a.reference[g] + a.reference[C] - w.mainAxis;
        m < S ? m = S : m > k && (m = k);
      }
      if (u) {
        var y, x;
        const C = g === "y" ? "width" : "height", S = Bo.has(Ee(i)), k = a.reference[h] - a.floating[C] + (S && ((y = l.offset) == null ? void 0 : y[h]) || 0) + (S ? 0 : w.crossAxis), E = a.reference[h] + a.reference[C] + (S ? 0 : ((x = l.offset) == null ? void 0 : x[h]) || 0) - (S ? w.crossAxis : 0);
        v < k ? v = k : v > E && (v = E);
      }
      return {
        [g]: m,
        [h]: v
      };
    }
  };
}, ml = function(e) {
  return e === void 0 && (e = {}), {
    name: "size",
    options: e,
    async fn(t) {
      const {
        placement: n,
        rects: r,
        platform: o,
        elements: s
      } = t, {
        apply: i = () => {
        },
        ...a
      } = de(e, t), l = await o.detectOverflow(t, a), f = Ee(n), d = Ye(n), u = re(n) === "y", {
        width: p,
        height: h
      } = r.floating;
      let g, m;
      f === "top" || f === "bottom" ? (g = f, m = d === (await (o.isRTL == null ? void 0 : o.isRTL(s.floating)) ? "start" : "end") ? "left" : "right") : (m = f, g = d === "end" ? "top" : "bottom");
      const v = h - l.top - l.bottom, b = p - l.left - l.right, w = xe(h - l[g], v), y = xe(p - l[m], b), x = t.middlewareData.shift, C = !x;
      let S = w, k = y;
      x != null && x.enabled.x && (k = b), x != null && x.enabled.y && (S = v), C && !d && (u ? k = p - 2 * le(l.left, l.right) : S = h - 2 * le(l.top, l.bottom)), await i({
        ...t,
        availableWidth: k,
        availableHeight: S
      });
      const E = await o.getDimensions(s.floating);
      return p !== E.width || h !== E.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Lt() {
  return typeof window < "u";
}
function Ke(e) {
  return Uo(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function K(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function ge(e) {
  var t;
  return (t = (Uo(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Uo(e) {
  return Lt() ? e instanceof Node || e instanceof K(e).Node : !1;
}
function se(e) {
  return Lt() ? e instanceof Element || e instanceof K(e).Element : !1;
}
function Se(e) {
  return Lt() ? e instanceof HTMLElement || e instanceof K(e).HTMLElement : !1;
}
function Rr(e) {
  return !Lt() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof K(e).ShadowRoot;
}
function It(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: r,
    display: o
  } = ie(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && o !== "inline" && o !== "contents";
}
function hl(e) {
  return /^(table|td|th)$/.test(Ke(e));
}
function Mt(e) {
  try {
    if (e.matches(":popover-open"))
      return !0;
  } catch {
  }
  try {
    return e.matches(":modal");
  } catch {
    return !1;
  }
}
const gl = /transform|translate|scale|rotate|perspective|filter/, vl = /paint|layout|strict|content/, _e = (e) => !!e && e !== "none";
let en;
function Mn(e) {
  const t = se(e) ? ie(e) : e;
  return _e(t.transform) || _e(t.translate) || _e(t.scale) || _e(t.rotate) || _e(t.perspective) || !Fn() && (_e(t.backdropFilter) || _e(t.filter)) || gl.test(t.willChange || "") || vl.test(t.contain || "");
}
function bl(e) {
  let t = Ne(e);
  for (; Se(t) && !rt(t); ) {
    if (Mn(t))
      return t;
    if (Mt(t))
      return null;
    t = Ne(t);
  }
  return null;
}
function Fn() {
  return en == null && (en = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), en;
}
function rt(e) {
  return /^(html|body|#document)$/.test(Ke(e));
}
function ie(e) {
  return K(e).getComputedStyle(e);
}
function Ft(e) {
  return se(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function Ne(e) {
  if (Ke(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    Rr(e) && e.host || // Fallback.
    ge(e)
  );
  return Rr(t) ? t.host : t;
}
function Go(e) {
  const t = Ne(e);
  return rt(t) ? (e.ownerDocument || e).body : Se(t) && It(t) ? t : Go(t);
}
function ot(e, t, n) {
  var r;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const o = Go(e), s = o === ((r = e.ownerDocument) == null ? void 0 : r.body), i = K(o);
  if (s) {
    const a = vn(i);
    return t.concat(i, i.visualViewport || [], It(o) ? o : [], a && n ? ot(a) : []);
  } else
    return t.concat(o, ot(o, [], n));
}
function vn(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Ho(e) {
  const t = ie(e);
  let n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0;
  const o = Se(e), s = o ? e.offsetWidth : n, i = o ? e.offsetHeight : r, a = At(n) !== s || At(r) !== i;
  return a && (n = s, r = i), {
    width: n,
    height: r,
    $: a
  };
}
function jn(e) {
  return se(e) ? e : e.contextElement;
}
function Be(e) {
  const t = jn(e);
  if (!Se(t))
    return ue(1);
  const n = t.getBoundingClientRect(), {
    width: r,
    height: o,
    $: s
  } = Ho(t);
  let i = (s ? At(n.width) : n.width) / r, a = (s ? At(n.height) : n.height) / o;
  return (!i || !Number.isFinite(i)) && (i = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: i,
    y: a
  };
}
const yl = /* @__PURE__ */ ue(0);
function Yo(e) {
  const t = K(e);
  return !Fn() || !t.visualViewport ? yl : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function wl(e, t, n) {
  return t === void 0 && (t = !1), !!n && t && n === K(e);
}
function Te(e, t, n, r) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const o = e.getBoundingClientRect(), s = jn(e);
  let i = ue(1);
  t && (r ? se(r) && (i = Be(r)) : i = Be(e));
  const a = wl(s, n, r) ? Yo(s) : ue(0);
  let l = (o.left + a.x) / i.x, f = (o.top + a.y) / i.y, d = o.width / i.x, u = o.height / i.y;
  if (s && r) {
    const p = K(s), h = se(r) ? K(r) : r;
    let g = p, m = vn(g);
    for (; m && h !== g; ) {
      const v = Be(m), b = m.getBoundingClientRect(), w = ie(m), y = b.left + (m.clientLeft + parseFloat(w.paddingLeft)) * v.x, x = b.top + (m.clientTop + parseFloat(w.paddingTop)) * v.y;
      l *= v.x, f *= v.y, d *= v.x, u *= v.y, l += y, f += x, g = K(m), m = vn(g);
    }
  }
  return _t({
    width: d,
    height: u,
    x: l,
    y: f
  });
}
function jt(e, t) {
  const n = Ft(e).scrollLeft;
  return t ? t.left + n : Te(ge(e)).left + n;
}
function Ko(e, t) {
  const n = e.getBoundingClientRect(), r = n.left + t.scrollLeft - jt(e, n), o = n.top + t.scrollTop;
  return {
    x: r,
    y: o
  };
}
function xl(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: r,
    strategy: o
  } = e;
  const s = o === "fixed", i = ge(r), a = t ? Mt(t.floating) : !1;
  if (r === i || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, f = ue(1);
  const d = ue(0), u = Se(r);
  if ((u || !s) && ((Ke(r) !== "body" || It(i)) && (l = Ft(r)), u)) {
    const h = Te(r);
    f = Be(r), d.x = h.x + r.clientLeft, d.y = h.y + r.clientTop;
  }
  const p = i && !u && !s ? Ko(i, l) : ue(0);
  return {
    width: n.width * f.x,
    height: n.height * f.y,
    x: n.x * f.x - l.scrollLeft * f.x + d.x + p.x,
    y: n.y * f.y - l.scrollTop * f.y + d.y + p.y
  };
}
function El(e) {
  return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function Cl(e) {
  const t = Ft(e), n = e.ownerDocument.body, r = le(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), o = le(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight);
  let s = -t.scrollLeft + jt(e);
  const i = -t.scrollTop;
  return ie(n).direction === "rtl" && (s += le(e.clientWidth, n.clientWidth) - r), {
    width: r,
    height: o,
    x: s,
    y: i
  };
}
const Sl = 25;
function Pl(e, t, n) {
  n === void 0 && (n = "viewport");
  const r = n === "layoutViewport", o = K(e), s = ge(e), i = o.visualViewport;
  let a = s.clientWidth, l = s.clientHeight, f = 0, d = 0;
  if (i) {
    const p = !Fn() || t === "fixed";
    r ? p || (f = -i.offsetLeft, d = -i.offsetTop) : (a = i.width, l = i.height, p && (f = i.offsetLeft, d = i.offsetTop));
  }
  if (jt(s) <= 0) {
    const p = s.ownerDocument, h = p.body, g = getComputedStyle(h), m = p.compatMode === "CSS1Compat" && parseFloat(g.marginLeft) + parseFloat(g.marginRight) || 0, v = Math.abs(s.clientWidth - h.clientWidth - m), b = getComputedStyle(s).scrollbarGutter === "stable both-edges" ? v / 2 : v;
    b <= Sl && (a -= b);
  }
  return {
    width: a,
    height: l,
    x: f,
    y: d
  };
}
function Rl(e, t) {
  const n = Te(e, !0, t === "fixed"), r = n.top + e.clientTop, o = n.left + e.clientLeft, s = Be(e), i = e.clientWidth * s.x, a = e.clientHeight * s.y, l = o * s.x, f = r * s.y;
  return {
    width: i,
    height: a,
    x: l,
    y: f
  };
}
function Or(e, t, n) {
  let r;
  if (t === "viewport" || t === "layoutViewport")
    r = Pl(e, n, t);
  else if (t === "document")
    r = Cl(ge(e));
  else if (se(t))
    r = Rl(t, n);
  else {
    const o = Yo(e);
    r = {
      x: t.x - o.x,
      y: t.y - o.y,
      width: t.width,
      height: t.height
    };
  }
  return _t(r);
}
function Ol(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let r = ot(e, [], !1).filter((a) => se(a) && Ke(a) !== "body"), o = null;
  const s = ie(e).position === "fixed";
  let i = s ? Ne(e) : e;
  for (; se(i) && !rt(i); ) {
    const a = ie(i), l = Mn(i), f = o ? o.position : s ? "fixed" : "";
    !l && (f === "fixed" || f === "absolute" && a.position === "static") ? r = r.filter((u) => u !== i) : o = a, i = Ne(i);
  }
  return t.set(e, r), r;
}
function Al(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: r,
    strategy: o
  } = e;
  const i = [...n === "clippingAncestors" ? Mt(t) ? [] : Ol(t, this._c) : [].concat(n), r], a = Or(t, i[0], o);
  let l = a.top, f = a.right, d = a.bottom, u = a.left;
  for (let p = 1; p < i.length; p++) {
    const h = Or(t, i[p], o);
    l = le(h.top, l), f = xe(h.right, f), d = xe(h.bottom, d), u = le(h.left, u);
  }
  return {
    width: f - u,
    height: d - l,
    x: u,
    y: l
  };
}
function kl(e) {
  const {
    width: t,
    height: n
  } = Ho(e);
  return {
    width: t,
    height: n
  };
}
function _l(e, t, n) {
  const r = Se(t), o = ge(t), s = n === "fixed", i = Te(e, !0, s, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = ue(0);
  if ((r || !s) && ((Ke(t) !== "body" || It(o)) && (a = Ft(t)), r)) {
    const p = Te(t, !0, s, t);
    l.x = p.x + t.clientLeft, l.y = p.y + t.clientTop;
  }
  !r && o && (l.x = jt(o));
  const f = o && !r && !s ? Ko(o, a) : ue(0), d = i.left + a.scrollLeft - l.x - f.x, u = i.top + a.scrollTop - l.y - f.y;
  return {
    x: d,
    y: u,
    width: i.width,
    height: i.height
  };
}
function tn(e) {
  return ie(e).position === "static";
}
function Ar(e, t) {
  if (!Se(e) || ie(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return ge(e) === n && (n = n.ownerDocument.body), n;
}
function Xo(e, t) {
  const n = K(e);
  if (Mt(e))
    return n;
  if (!Se(e)) {
    let o = Ne(e);
    for (; o && !rt(o); ) {
      if (se(o) && !tn(o))
        return o;
      o = Ne(o);
    }
    return n;
  }
  let r = Ar(e, t);
  for (; r && hl(r) && tn(r); )
    r = Ar(r, t);
  return r && rt(r) && tn(r) && !Mn(r) ? n : r || bl(e) || n;
}
const Dl = async function(e) {
  const t = this.getOffsetParent || Xo, n = this.getDimensions, r = await n(e.floating);
  return {
    reference: _l(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function Nl(e) {
  return ie(e).direction === "rtl";
}
const Tl = {
  convertOffsetParentRelativeRectToViewportRelativeRect: xl,
  getDocumentElement: ge,
  getClippingRect: Al,
  getOffsetParent: Xo,
  getElementRects: Dl,
  getClientRects: El,
  getDimensions: kl,
  getScale: Be,
  isElement: se,
  isRTL: Nl
};
function Zo(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function $l(e, t, n) {
  let r = null, o;
  const s = ge(e);
  function i() {
    var d;
    clearTimeout(o), (d = r) == null || d.disconnect(), r = null;
  }
  function a(d, u) {
    d === void 0 && (d = !1), u === void 0 && (u = 1), i();
    const p = e.getBoundingClientRect(), {
      left: h,
      top: g,
      width: m,
      height: v
    } = p;
    if (d || t(), !m || !v)
      return;
    const b = xt(g), w = xt(s.clientWidth - (h + m)), y = xt(s.clientHeight - (g + v)), x = xt(h), S = {
      rootMargin: -b + "px " + -w + "px " + -y + "px " + -x + "px",
      threshold: le(0, xe(1, u)) || 1
    };
    let k = !0;
    function E(N) {
      const L = N[0].intersectionRatio;
      if (!Zo(p, e.getBoundingClientRect()))
        return a();
      if (L !== u) {
        if (!k)
          return a();
        L ? a(!1, L) : o = setTimeout(() => {
          a(!1, 1e-7);
        }, 1e3);
      }
      k = !1;
    }
    try {
      r = new IntersectionObserver(E, {
        ...S,
        // Handle <iframe>s
        root: s.ownerDocument
      });
    } catch {
      r = new IntersectionObserver(E, S);
    }
    r.observe(e);
  }
  const l = K(e), f = () => a(n);
  return l.addEventListener("resize", f), a(!0), () => {
    l.removeEventListener("resize", f), i();
  };
}
function Ll(e, t, n, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: o = !0,
    ancestorResize: s = !0,
    elementResize: i = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = r, f = jn(e), d = o || s ? [...f ? ot(f) : [], ...t ? ot(t) : []] : [];
  d.forEach((b) => {
    o && b.addEventListener("scroll", n), s && b.addEventListener("resize", n);
  });
  const u = f && a ? $l(f, n, s) : null;
  let p = -1, h = null;
  i && (h = new ResizeObserver((b) => {
    let [w] = b;
    w && w.target === f && h && t && (h.unobserve(t), cancelAnimationFrame(p), p = requestAnimationFrame(() => {
      var y;
      (y = h) == null || y.observe(t);
    })), n();
  }), f && !l && h.observe(f), t && h.observe(t));
  let g, m = l ? Te(e) : null;
  l && v();
  function v() {
    const b = Te(e);
    m && !Zo(m, b) && n(), m = b, g = requestAnimationFrame(v);
  }
  return n(), () => {
    var b;
    d.forEach((w) => {
      o && w.removeEventListener("scroll", n), s && w.removeEventListener("resize", n);
    }), u == null || u(), (b = h) == null || b.disconnect(), h = null, l && cancelAnimationFrame(g);
  };
}
const Il = fl, Ml = dl, Fl = cl, jl = ml, Wl = ll, kr = al, zl = pl, Vl = (e, t, n) => {
  const r = /* @__PURE__ */ new Map(), o = n ?? {}, s = {
    ...Tl,
    ...o.platform,
    _c: r
  };
  return il(e, t, {
    ...o,
    platform: s
  });
};
var Bl = typeof document < "u", Ul = function() {
}, Pt = Bl ? c.useLayoutEffect : Ul;
function Dt(e, t) {
  if (e === t)
    return !0;
  if (typeof e != typeof t)
    return !1;
  if (typeof e == "function" && e.toString() === t.toString())
    return !0;
  let n, r, o;
  if (e && t && typeof e == "object") {
    if (Array.isArray(e)) {
      if (n = e.length, n !== t.length) return !1;
      for (r = n; r-- !== 0; )
        if (!Dt(e[r], t[r]))
          return !1;
      return !0;
    }
    if (o = Object.keys(e), n = o.length, n !== Object.keys(t).length)
      return !1;
    for (r = n; r-- !== 0; )
      if (!{}.hasOwnProperty.call(t, o[r]))
        return !1;
    for (r = n; r-- !== 0; ) {
      const s = o[r];
      if (!(s === "_owner" && e.$$typeof) && !Dt(e[s], t[s]))
        return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function qo(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function _r(e, t) {
  const n = qo(e);
  return Math.round(t * n) / n;
}
function nn(e) {
  const t = c.useRef(e);
  return Pt(() => {
    t.current = e;
  }), t;
}
function Gl(e) {
  e === void 0 && (e = {});
  const {
    placement: t = "bottom",
    strategy: n = "absolute",
    middleware: r = [],
    platform: o,
    elements: {
      reference: s,
      floating: i
    } = {},
    transform: a = !0,
    whileElementsMounted: l,
    open: f
  } = e, [d, u] = c.useState({
    x: 0,
    y: 0,
    strategy: n,
    placement: t,
    middlewareData: {},
    isPositioned: !1
  }), [p, h] = c.useState(r);
  Dt(p, r) || h(r);
  const [g, m] = c.useState(null), [v, b] = c.useState(null), w = c.useCallback(($) => {
    $ !== S.current && (S.current = $, m($));
  }, []), y = c.useCallback(($) => {
    $ !== k.current && (k.current = $, b($));
  }, []), x = s || g, C = i || v, S = c.useRef(null), k = c.useRef(null), E = c.useRef(d), N = l != null, L = nn(l), _ = nn(o), D = nn(f), F = c.useCallback(() => {
    if (!S.current || !k.current)
      return;
    const $ = {
      placement: t,
      strategy: n,
      middleware: p
    };
    _.current && ($.platform = _.current), Vl(S.current, k.current, $).then((j) => {
      const O = {
        ...j,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: D.current !== !1
      };
      M.current && !Dt(E.current, O) && (E.current = O, it.flushSync(() => {
        u(O);
      }));
    });
  }, [p, t, n, _, D]);
  Pt(() => {
    f === !1 && E.current.isPositioned && (E.current.isPositioned = !1, u(($) => ({
      ...$,
      isPositioned: !1
    })));
  }, [f]);
  const M = c.useRef(!1);
  Pt(() => (M.current = !0, () => {
    M.current = !1;
  }), []), Pt(() => {
    if (x && (S.current = x), C && (k.current = C), x && C) {
      if (L.current)
        return L.current(x, C, F);
      F();
    }
  }, [x, C, F, L, N]);
  const z = c.useMemo(() => ({
    reference: S,
    floating: k,
    setReference: w,
    setFloating: y
  }), [w, y]), I = c.useMemo(() => ({
    reference: x,
    floating: C
  }), [x, C]), W = c.useMemo(() => {
    const $ = {
      position: n,
      left: 0,
      top: 0
    };
    if (!I.floating)
      return $;
    const j = _r(I.floating, d.x), O = _r(I.floating, d.y);
    return a ? {
      ...$,
      transform: "translate(" + j + "px, " + O + "px)",
      ...qo(I.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: n,
      left: j,
      top: O
    };
  }, [n, a, I.floating, d.x, d.y]);
  return c.useMemo(() => ({
    ...d,
    update: F,
    refs: z,
    elements: I,
    floatingStyles: W
  }), [d, F, z, I, W]);
}
const Hl = (e) => {
  function t(n) {
    return {}.hasOwnProperty.call(n, "current");
  }
  return {
    name: "arrow",
    options: e,
    fn(n) {
      const {
        element: r,
        padding: o
      } = typeof e == "function" ? e(n) : e;
      return r && t(r) ? r.current != null ? kr({
        element: r.current,
        padding: o
      }).fn(n) : {} : r ? kr({
        element: r,
        padding: o
      }).fn(n) : {};
    }
  };
}, Yl = (e, t) => {
  const n = Il(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Kl = (e, t) => {
  const n = Ml(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Xl = (e, t) => ({
  fn: zl(e).fn,
  options: [e, t]
}), Zl = (e, t) => {
  const n = Fl(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, ql = (e, t) => {
  const n = jl(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Ql = (e, t) => {
  const n = Wl(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Jl = (e, t) => {
  const n = Hl(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
};
var eu = Object.defineProperty, tu = (e, t) => eu(e, "name", { value: t, configurable: !0 }), nu = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ tu(function(t, n) {
    const { children: r, width: o = 10, height: s = 5, ...i } = t;
    return /* @__PURE__ */ A.jsx(
      Le.svg,
      {
        ...i,
        ref: n,
        width: o,
        height: s,
        viewBox: "0 0 30 10",
        preserveAspectRatio: "none",
        children: t.asChild ? r : /* @__PURE__ */ A.jsx("polygon", { points: "0,0 30,0 15,10" })
      }
    );
  }, "Arrow")
), ru = nu, ou = Object.defineProperty, su = (e, t) => ou(e, "name", { value: t, configurable: !0 });
function Qo(e) {
  const [t, n] = c.useState(void 0);
  return oe(() => {
    if (e) {
      n({ width: e.offsetWidth, height: e.offsetHeight });
      const r = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length)
          return;
        const s = o[0];
        let i, a;
        if ("borderBoxSize" in s) {
          const l = s.borderBoxSize, f = Array.isArray(l) ? l[0] : l;
          i = f.inlineSize, a = f.blockSize;
        } else
          i = e.offsetWidth, a = e.offsetHeight;
        n({ width: i, height: a });
      });
      return r.observe(e, { box: "border-box" }), () => r.unobserve(e);
    } else
      n(void 0);
  }, [e]), t;
}
su(Qo, "useSize");
var iu = Object.defineProperty, fe = (e, t) => iu(e, "name", { value: t, configurable: !0 }), Jo = "Popper", [es, ts] = /* @__PURE__ */ kn(Jo), [au, ns] = es(Jo), cu = /* @__PURE__ */ fe((e) => {
  const { __scopePopper: t, children: n } = e, [r, o] = c.useState(null), [s, i] = c.useState(void 0);
  return /* @__PURE__ */ A.jsx(
    au,
    {
      scope: t,
      anchor: r,
      onAnchorChange: o,
      placementState: s,
      setPlacementState: i,
      children: n
    }
  );
}, "Popper"), lu = "PopperAnchor", uu = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ fe(function(t, n) {
    const { __scopePopper: r, virtualRef: o, ...s } = t, i = ns(lu, r), a = c.useRef(null), l = i.onAnchorChange, f = c.useCallback(
      (m) => {
        a.current = m, m && l(m);
      },
      [l]
    ), d = he(n, f), u = c.useRef(null);
    c.useEffect(() => {
      if (!o)
        return;
      const m = u.current;
      u.current = o.current, m !== u.current && l(u.current);
    });
    const p = i.placementState && Wt(i.placementState), h = p == null ? void 0 : p[0], g = p == null ? void 0 : p[1];
    return o ? null : /* @__PURE__ */ A.jsx(
      Le.div,
      {
        "data-radix-popper-side": h,
        "data-radix-popper-align": g,
        ...s,
        ref: d
      }
    );
  }, "PopperAnchor")
), rs = "PopperContent", [fu, du] = es(rs), pu = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ fe(function(t, n) {
    var V, Je, Re, Oe, Me, Ae, Vn;
    const {
      __scopePopper: r,
      side: o = "bottom",
      sideOffset: s = 0,
      align: i = "center",
      alignOffset: a = 0,
      arrowPadding: l = 0,
      avoidCollisions: f = !0,
      collisionBoundary: d = [],
      collisionPadding: u = 0,
      sticky: p = "partial",
      hideWhenDetached: h = !1,
      updatePositionStrategy: g = "optimized",
      onPlaced: m,
      ...v
    } = t, b = ns(rs, r), [w, y] = c.useState(null), x = he(n, y), [C, S] = c.useState(null), k = Qo(C), E = (k == null ? void 0 : k.width) ?? 0, N = (k == null ? void 0 : k.height) ?? 0, L = o + (i !== "center" ? "-" + i : ""), _ = typeof u == "number" ? u : { top: 0, right: 0, bottom: 0, left: 0, ...u }, D = Array.isArray(d) ? d : [d], F = D.length > 0, M = {
      padding: _,
      boundary: D.filter(os),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: F
    }, { refs: z, floatingStyles: I, placement: W, isPositioned: $, middlewareData: j } = Gl({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: L,
      whileElementsMounted: /* @__PURE__ */ fe((...Vt) => Ll(...Vt, {
        animationFrame: g === "always"
      }), "whileElementsMounted"),
      elements: {
        reference: b.anchor
      },
      middleware: [
        Yl({ mainAxis: s + N, alignmentAxis: a }),
        f && Kl({
          mainAxis: !0,
          crossAxis: !1,
          limiter: p === "partial" ? Xl() : void 0,
          ...M
        }),
        f && Zl({ ...M }),
        ql({
          ...M,
          apply: /* @__PURE__ */ fe(({ elements: Vt, rects: Bn, availableWidth: Cs, availableHeight: Ss }) => {
            const { width: Ps, height: Rs } = Bn.reference, ut = Vt.floating.style;
            ut.setProperty("--radix-popper-available-width", `${Cs}px`), ut.setProperty("--radix-popper-available-height", `${Ss}px`), ut.setProperty("--radix-popper-anchor-width", `${Ps}px`), ut.setProperty("--radix-popper-anchor-height", `${Rs}px`);
          }, "apply")
        }),
        C && Jl({ element: C, padding: l }),
        vu({ arrowWidth: E, arrowHeight: N }),
        h && Ql({
          strategy: "referenceHidden",
          ...M,
          // `hide` detects whether the anchor (reference) is clipped, so when
          // no explicit `collisionBoundary` is set we fall back to Floating
          // UI's default clipping ancestors (e.g. a scrollable menu). This
          // lets an occluded submenu hide once its anchor scrolls out of view
          // (#3237). The collision/size middlewares deliberately keep the
          // viewport-based default to avoid clamping content rendered inside
          // transformed or overflow-clipping portal containers.
          boundary: F ? M.boundary : void 0
        })
      ]
    }), O = b.setPlacementState;
    oe(() => (O(W), () => {
      O(void 0);
    }), [W, O]);
    const [Ze, qe] = Wt(W), Pe = De(m);
    oe(() => {
      $ && (Pe == null || Pe());
    }, [$, Pe]);
    const Qe = (V = j.arrow) == null ? void 0 : V.x, G = (Je = j.arrow) == null ? void 0 : Je.y, H = ((Re = j.arrow) == null ? void 0 : Re.centerOffset) !== 0, [Ie, lt] = c.useState();
    return oe(() => {
      w && lt(window.getComputedStyle(w).zIndex);
    }, [w]), /* @__PURE__ */ A.jsx(
      "div",
      {
        ref: z.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...I,
          transform: $ ? I.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: Ie,
          "--radix-popper-transform-origin": [
            (Oe = j.transformOrigin) == null ? void 0 : Oe.x,
            (Me = j.transformOrigin) == null ? void 0 : Me.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((Ae = j.hide) == null ? void 0 : Ae.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: t.dir,
        children: /* @__PURE__ */ A.jsx(
          fu,
          {
            scope: r,
            placedSide: Ze,
            placedAlign: qe,
            onArrowChange: S,
            arrowX: Qe,
            arrowY: G,
            shouldHideArrow: H,
            children: /* @__PURE__ */ A.jsx(
              Le.div,
              {
                "data-side": Ze,
                "data-align": qe,
                ...v,
                ref: x,
                style: {
                  ...v.style,
                  // if the PopperContent hasn't been placed yet (not all
                  // measurements done) we prevent animations so that users'
                  // animations don't kick in too early from the wrong sides.
                  animation: $ ? (Vn = v.style) == null ? void 0 : Vn.animation : "none"
                }
              }
            )
          }
        )
      }
    );
  }, "PopperContent")
), mu = "PopperArrow", hu = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, gu = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ fe(function(t, n) {
    const { __scopePopper: r, ...o } = t, s = du(mu, r), i = hu[s.placedSide];
    return (
      // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
      // doesn't report size as we'd expect on SVG elements.
      // it reports their bounding box which is effectively the largest path inside the SVG.
      /* @__PURE__ */ A.jsx(
        "span",
        {
          ref: s.onArrowChange,
          style: {
            position: "absolute",
            left: s.arrowX,
            top: s.arrowY,
            [i]: 0,
            transformOrigin: {
              top: "",
              right: "0 0",
              bottom: "center 0",
              left: "100% 0"
            }[s.placedSide],
            transform: {
              top: "translateY(100%)",
              right: "translateY(50%) rotate(90deg) translateX(-50%)",
              bottom: "rotate(180deg)",
              left: "translateY(50%) rotate(-90deg) translateX(50%)"
            }[s.placedSide],
            visibility: s.shouldHideArrow ? "hidden" : void 0
          },
          children: /* @__PURE__ */ A.jsx(
            ru,
            {
              ...o,
              ref: n,
              style: {
                ...o.style,
                // ensures the element can be measured correctly (mostly for if SVG)
                display: "block"
              }
            }
          )
        }
      )
    );
  }, "PopperArrow")
);
function os(e) {
  return e !== null;
}
fe(os, "isNotNull");
var vu = /* @__PURE__ */ fe((e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    var v, b, w;
    const { placement: n, rects: r, middlewareData: o } = t, i = ((v = o.arrow) == null ? void 0 : v.centerOffset) !== 0, a = i ? 0 : e.arrowWidth, l = i ? 0 : e.arrowHeight, [f, d] = Wt(n), u = { start: "0%", center: "50%", end: "100%" }[d], p = (((b = o.arrow) == null ? void 0 : b.x) ?? 0) + a / 2, h = (((w = o.arrow) == null ? void 0 : w.y) ?? 0) + l / 2;
    let g = "", m = "";
    return f === "bottom" ? (g = i ? u : `${p}px`, m = `${-l}px`) : f === "top" ? (g = i ? u : `${p}px`, m = `${r.floating.height + l}px`) : f === "right" ? (g = `${-l}px`, m = i ? u : `${h}px`) : f === "left" && (g = `${r.floating.width + l}px`, m = i ? u : `${h}px`), { data: { x: g, y: m } };
  }
}), "transformOrigin");
function Wt(e) {
  const [t, n = "center"] = e.split("-");
  return [t, n];
}
fe(Wt, "getSideAndAlignFromPlacement");
var bu = cu, yu = uu, wu = pu, xu = gu, Eu = Object.defineProperty, Cu = (e, t) => Eu(e, "name", { value: t, configurable: !0 }), Su = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Cu(function(t, n) {
    var l;
    const { container: r, ...o } = t, [s, i] = c.useState(!1);
    oe(() => i(!0), []);
    const a = r || s && ((l = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : l.body);
    return a ? it.createPortal(/* @__PURE__ */ A.jsx(Le.div, { ...o, ref: n }), a) : null;
  }, "Portal")
), Pu = Object.defineProperty, pe = (e, t) => Pu(e, "name", { value: t, configurable: !0 });
function ss(e, t) {
  return c.useReducer((n, r) => t[n][r] ?? n, e);
}
pe(ss, "useStateMachine");
var is = /* @__PURE__ */ pe((e) => {
  const { present: t, children: n } = e, r = as(t), o = typeof n == "function" ? n({ present: r.isPresent }) : c.Children.only(n), s = cs(r.ref, ls(o));
  return typeof n == "function" || r.isPresent ? c.cloneElement(o, { ref: s }) : null;
}, "Presence");
function as(e) {
  const [t, n] = c.useState(), r = c.useRef(null), o = c.useRef(e), s = c.useRef("none"), i = c.useRef(void 0), a = e ? "mounted" : "unmounted", [l, f] = ss(a, {
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
    l === "mounted" ? (s.current = i.current ?? ze(r.current), i.current = void 0) : s.current = "none";
  }, [l]), oe(() => {
    const d = r.current, u = o.current;
    if (u !== e) {
      const h = s.current, g = ze(d);
      e ? (i.current = g, f("MOUNT")) : g === "none" || (d == null ? void 0 : d.display) === "none" ? f("UNMOUNT") : f(u && h !== g ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, f]), oe(() => {
    if (t) {
      let d;
      const u = t.ownerDocument.defaultView ?? window, p = /* @__PURE__ */ pe((g) => {
        const v = ze(r.current).includes(CSS.escape(g.animationName));
        if (g.target === t && v && (f("ANIMATION_END"), !o.current)) {
          const b = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", d = u.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = b);
          });
        }
      }, "handleAnimationEnd"), h = /* @__PURE__ */ pe((g) => {
        g.target === t && (s.current = ze(r.current));
      }, "handleAnimationStart");
      return t.addEventListener("animationstart", h), t.addEventListener("animationcancel", p), t.addEventListener("animationend", p), () => {
        u.clearTimeout(d), t.removeEventListener("animationstart", h), t.removeEventListener("animationcancel", p), t.removeEventListener("animationend", p);
      };
    } else
      f("ANIMATION_END");
  }, [t, f]), {
    isPresent: ["mounted", "unmountSuspended"].includes(l),
    ref: c.useCallback((d) => {
      if (d) {
        const u = getComputedStyle(d);
        r.current = u, i.current = ze(u);
      } else
        r.current = null;
      n(d);
    }, [])
  };
}
pe(as, "usePresence");
function bn(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
pe(bn, "setRef");
function cs(...e) {
  const t = c.useRef(e);
  return t.current = e, c.useCallback((n) => {
    const r = t.current;
    let o = !1;
    const s = r.map((i) => {
      const a = bn(i, n);
      return !o && typeof a == "function" && (o = !0), a;
    });
    if (o)
      return () => {
        for (let i = 0; i < s.length; i++) {
          const a = s[i];
          typeof a == "function" ? a() : bn(r[i], null);
        }
      };
  }, []);
}
pe(cs, "useStableComposedRefs");
function ze(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
pe(ze, "getAnimationName");
function ls(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
pe(ls, "getElementRef");
var Ru = Object.defineProperty, Q = (e, t) => Ru(e, "name", { value: t, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function us(e) {
  const t = c.forwardRef((n, r) => {
    let { children: o, ...s } = n, i = null, a = !1;
    const l = [];
    yn(o) && typeof Et == "function" && (o = Et(o._payload)), c.Children.forEach(o, (p) => {
      var h;
      if (ms(p)) {
        a = !0;
        const g = p;
        let m = "child" in g.props ? g.props.child : g.props.children;
        yn(m) && typeof Et == "function" && (m = Et(m._payload)), i = Au(g, m), l.push((h = i == null ? void 0 : i.props) == null ? void 0 : h.children);
      } else
        l.push(p);
    }), i ? i = c.cloneElement(i, void 0, l) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && c.Children.count(o) === 1 && c.isValidElement(o) && (i = o)
    );
    const f = i ? ps(i) : void 0, d = he(r, f);
    if (!i) {
      if (o || o === 0)
        throw new Error(
          a ? Du(e) : _u(e)
        );
      return o;
    }
    const u = ds(s, i.props ?? {});
    return i.type !== c.Fragment && (u.ref = r ? d : f), c.cloneElement(i, u);
  });
  return t.displayName = `${e}.Slot`, t;
}
Q(us, "createSlot");
var fs = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function Ou(e) {
  const t = /* @__PURE__ */ Q((n) => "child" in n ? n.children(n.child) : n.children, "Slottable");
  return t.displayName = `${e}.Slottable`, t.__radixId = fs, t;
}
Q(Ou, "createSlottable");
var Au = /* @__PURE__ */ Q((e, t) => {
  if ("child" in e.props) {
    const n = e.props.child;
    return c.isValidElement(n) ? c.cloneElement(n, void 0, e.props.children(n.props.children)) : null;
  }
  return c.isValidElement(t) ? t : null;
}, "getSlottableElementFromSlottable");
function ds(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r], s = t[r];
    /^on[A-Z]/.test(r) ? o && s ? n[r] = (...a) => {
      const l = s(...a);
      return o(...a), l;
    } : o && (n[r] = o) : r === "style" ? n[r] = { ...o, ...s } : r === "className" && (n[r] = [o, s].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
Q(ds, "mergeProps");
function ps(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
Q(ps, "getElementRef");
function ms(e) {
  return c.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === fs;
}
Q(ms, "isSlottable");
var ku = Symbol.for("react.lazy");
function yn(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === ku && "_payload" in e && hs(e._payload);
}
Q(yn, "isLazyComponent");
function hs(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
Q(hs, "isPromiseLike");
var _u = /* @__PURE__ */ Q((e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), Du = /* @__PURE__ */ Q((e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Et = me[" use ".trim().toString()], Nu = Object.defineProperty, Tu = (e, t) => Nu(e, "name", { value: t, configurable: !0 }), Dr = me[" useEffectEvent ".trim().toString()], Nr = me[" useInsertionEffect ".trim().toString()];
function gs(e) {
  if (typeof Dr == "function")
    return Dr(e);
  const t = c.useRef(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });
  return typeof Nr == "function" ? Nr(() => {
    t.current = e;
  }) : oe(() => {
    t.current = e;
  }), c.useMemo(() => (...n) => {
    var r;
    return (r = t.current) == null ? void 0 : r.call(t, ...n);
  }, []);
}
Tu(gs, "useEffectEvent");
var $u = Object.defineProperty, ct = (e, t) => $u(e, "name", { value: t, configurable: !0 }), Lu = me[" useInsertionEffect ".trim().toString()] || oe;
function vs({
  prop: e,
  defaultProp: t,
  onChange: n = /* @__PURE__ */ ct(() => {
  }, "onChange"),
  caller: r
}) {
  const [o, s, i] = bs({
    defaultProp: t,
    onChange: n
  }), a = e !== void 0, l = a ? e : o, f = c.useCallback(
    (d) => {
      var u;
      if (a) {
        const p = ys(d) ? d(e) : d;
        p !== e && ((u = i.current) == null || u.call(i, p));
      } else
        s(d);
    },
    [a, e, s, i]
  );
  return [l, f];
}
ct(vs, "useControllableState");
function bs({
  defaultProp: e,
  onChange: t
}) {
  const [n, r] = c.useState(e), o = c.useRef(n), s = c.useRef(t);
  return Lu(() => {
    s.current = t;
  }, [t]), c.useEffect(() => {
    var i;
    o.current !== n && ((i = s.current) == null || i.call(s, n), o.current = n);
  }, [n, o]), [n, r, s];
}
ct(bs, "useUncontrolledState");
function ys(e) {
  return typeof e == "function";
}
ct(ys, "isFunction");
var Tr = Symbol("RADIX:SYNC_STATE");
function Iu(e, t, n, r) {
  const { prop: o, defaultProp: s, onChange: i, caller: a } = t, l = o !== void 0, f = gs(i), d = [{ ...n, state: s }];
  r && d.push(r);
  const [u, p] = c.useReducer(
    (v, b) => {
      if (b.type === Tr)
        return { ...v, state: b.state };
      const w = e(v, b);
      return l && !Object.is(w.state, v.state) && f(w.state), w;
    },
    ...d
  ), h = u.state, g = c.useRef(h);
  c.useEffect(() => {
    g.current !== h && (g.current = h, l || f(h));
  }, [h, g, l]);
  const m = c.useMemo(() => o !== void 0 ? { ...u, state: o } : u, [u, o]);
  return c.useEffect(() => {
    l && !Object.is(o, u.state) && p({ type: Tr, state: o });
  }, [o, u.state, l]), [m, p];
}
ct(Iu, "useControllableStateReducer");
var Mu = Object.defineProperty, ve = (e, t) => Mu(e, "name", { value: t, configurable: !0 }), Wn = "Popover", [ws, tf] = /* @__PURE__ */ kn(Wn, [
  ts
]), zt = ts(), [Fu, Xe] = ws(Wn), ju = /* @__PURE__ */ ve((e) => {
  const {
    __scopePopover: t,
    children: n,
    open: r,
    defaultOpen: o,
    onOpenChange: s,
    modal: i = !1
  } = e, a = zt(t), l = c.useRef(null), [f, d] = c.useState(!1), [u, p] = vs({
    prop: r,
    defaultProp: o ?? !1,
    onChange: s,
    caller: Wn
  });
  return /* @__PURE__ */ A.jsx(bu, { ...a, children: /* @__PURE__ */ A.jsx(
    Fu,
    {
      scope: t,
      contentId: Wo(),
      triggerRef: l,
      open: u,
      onOpenChange: p,
      onOpenToggle: c.useCallback(() => p((h) => !h), [p]),
      hasCustomAnchor: f,
      onCustomAnchorAdd: c.useCallback(() => d(!0), []),
      onCustomAnchorRemove: c.useCallback(() => d(!1), []),
      modal: i,
      children: n
    }
  ) });
}, "Popover"), Wu = "PopoverTrigger", zu = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ ve(function(t, n) {
    const { __scopePopover: r, ...o } = t, s = Xe(Wu, r), i = zt(r), a = he(n, s.triggerRef), l = /* @__PURE__ */ A.jsx(
      Le.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": s.open,
        "aria-controls": s.open ? s.contentId : void 0,
        "data-state": zn(s.open),
        ...o,
        ref: a,
        onClick: we(t.onClick, s.onOpenToggle)
      }
    );
    return s.hasCustomAnchor ? l : /* @__PURE__ */ A.jsx(yu, { asChild: !0, ...i, children: l });
  }, "PopoverTrigger")
), xs = "PopoverPortal", [Vu, Bu] = ws(xs, {
  forceMount: void 0
}), Uu = /* @__PURE__ */ ve((e) => {
  const { __scopePopover: t, forceMount: n, children: r, container: o } = e, s = Xe(xs, t);
  return /* @__PURE__ */ A.jsx(Vu, { scope: t, forceMount: n, children: /* @__PURE__ */ A.jsx(is, { present: n || s.open, children: /* @__PURE__ */ A.jsx(Su, { asChild: !0, container: o, children: r }) }) });
}, "PopoverPortal"), st = "PopoverContent", Gu = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ve(function(t, n) {
    const r = Bu(st, t.__scopePopover), { forceMount: o = r.forceMount, ...s } = t, i = Xe(st, t.__scopePopover);
    return /* @__PURE__ */ A.jsx(is, { present: o || i.open, children: i.modal ? /* @__PURE__ */ A.jsx(Yu, { ...s, ref: n }) : /* @__PURE__ */ A.jsx(Ku, { ...s, ref: n }) });
  }, "PopoverContent")
), Hu = /* @__PURE__ */ us("PopoverContent.RemoveScroll"), Yu = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ve(function(t, n) {
    const r = Xe(st, t.__scopePopover), o = c.useRef(null), s = he(n, o), i = c.useRef(!1);
    return c.useEffect(() => {
      const a = o.current;
      if (a) return uo(a);
    }, []), /* @__PURE__ */ A.jsx(Pn, { as: Hu, allowPinchZoom: !0, children: /* @__PURE__ */ A.jsx(
      Es,
      {
        ...t,
        ref: s,
        trapFocus: r.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: we(t.onCloseAutoFocus, (a) => {
          var l;
          a.preventDefault(), i.current || (l = r.triggerRef.current) == null || l.focus();
        }),
        onPointerDownOutside: we(
          t.onPointerDownOutside,
          (a) => {
            const l = a.detail.originalEvent, f = l.button === 0 && l.ctrlKey === !0, d = l.button === 2 || f;
            i.current = d;
          },
          { checkForDefaultPrevented: !1 }
        ),
        onFocusOutside: we(
          t.onFocusOutside,
          (a) => a.preventDefault(),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }, "PopoverContentModal")
), Ku = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ve(function(t, n) {
    const r = Xe(st, t.__scopePopover), o = c.useRef(!1), s = c.useRef(!1);
    return /* @__PURE__ */ A.jsx(
      Es,
      {
        ...t,
        ref: n,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (i) => {
          var a, l;
          (a = t.onCloseAutoFocus) == null || a.call(t, i), i.defaultPrevented || (o.current || (l = r.triggerRef.current) == null || l.focus(), i.preventDefault()), o.current = !1, s.current = !1;
        },
        onInteractOutside: (i) => {
          var f, d;
          (f = t.onInteractOutside) == null || f.call(t, i), i.defaultPrevented || (o.current = !0, i.detail.originalEvent.type === "pointerdown" && (s.current = !0));
          const a = i.target;
          ((d = r.triggerRef.current) == null ? void 0 : d.contains(a)) && i.preventDefault(), i.detail.originalEvent.type === "focusin" && s.current && i.preventDefault();
        }
      }
    );
  }, "PopoverContentNonModal")
), Es = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ve(function(t, n) {
    const {
      __scopePopover: r,
      trapFocus: o,
      onOpenAutoFocus: s,
      onCloseAutoFocus: i,
      disableOutsidePointerEvents: a,
      onEscapeKeyDown: l,
      onPointerDownOutside: f,
      onFocusOutside: d,
      onInteractOutside: u,
      ...p
    } = t, h = Xe(st, r), g = zt(r);
    return Nn(), /* @__PURE__ */ A.jsx(
      Uc,
      {
        asChild: !0,
        loop: !0,
        trapped: o,
        onMountAutoFocus: s,
        onUnmountAutoFocus: i,
        children: /* @__PURE__ */ A.jsx(
          Fc,
          {
            asChild: !0,
            disableOutsidePointerEvents: a,
            onInteractOutside: u,
            onEscapeKeyDown: l,
            onPointerDownOutside: f,
            onFocusOutside: d,
            onDismiss: () => h.onOpenChange(!1),
            deferPointerDownOutside: !0,
            children: /* @__PURE__ */ A.jsx(
              wu,
              {
                "data-state": zn(h.open),
                role: "dialog",
                id: h.contentId,
                ...g,
                ...p,
                ref: n,
                style: {
                  ...p.style,
                  "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
                  "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
                  "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
                  "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
                  "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
                }
              }
            )
          }
        )
      }
    );
  }, "PopoverContentImpl")
), Xu = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ ve(function(t, n) {
    const { __scopePopover: r, ...o } = t, s = zt(r);
    return /* @__PURE__ */ A.jsx(xu, { ...s, ...o, ref: n });
  }, "PopoverArrow")
);
function zn(e) {
  return e ? "open" : "closed";
}
ve(zn, "getState");
var nf = ju, rf = zu, of = Uu, sf = Gu, af = Xu;
export {
  af as A,
  sf as C,
  lc as D,
  of as P,
  nf as R,
  Ju as S,
  rf as T,
  ef as a,
  uc as b,
  rn as c,
  pc as d,
  gc as e,
  vc as f,
  ic as g,
  ac as h,
  bc as i,
  Qu as r,
  qu as t
};
