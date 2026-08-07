import { g as Bs, r as c, R as ce, j as A, a as Le } from "./react-vendor.js";
function jr(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (n = jr(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function un() {
  for (var e, t, n = 0, r = "", o = arguments.length; n < o; n++) (e = arguments[n]) && (t = jr(e)) && (r && (r += " "), r += t);
  return r;
}
const Us = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clsx: un,
  default: un
}, Symbol.toStringTag, { value: "Module" })), Hs = (e, t) => {
  const n = new Array(e.length + t.length);
  for (let r = 0; r < e.length; r++)
    n[r] = e[r];
  for (let r = 0; r < t.length; r++)
    n[e.length + r] = t[r];
  return n;
}, Gs = (e, t) => ({
  classGroupId: e,
  validator: t
}), Wr = (e = /* @__PURE__ */ new Map(), t = null, n) => ({
  nextPart: e,
  validators: t,
  classGroupId: n
}), _t = "-", er = [], Ys = "arbitrary..", Ks = (e) => {
  const t = Zs(e), {
    conflictingClassGroups: n,
    conflictingClassGroupModifiers: r
  } = e;
  return {
    getClassGroupId: (i) => {
      if (i.startsWith("[") && i.endsWith("]"))
        return Xs(i);
      const a = i.split(_t), l = a[0] === "" && a.length > 1 ? 1 : 0;
      return zr(a, l, t);
    },
    getConflictingClassGroupIds: (i, a) => {
      if (a) {
        const l = r[i], f = n[i];
        return l ? f ? Hs(f, l) : l : f || er;
      }
      return n[i] || er;
    }
  };
}, zr = (e, t, n) => {
  if (e.length - t === 0)
    return n.classGroupId;
  const o = e[t], s = n.nextPart.get(o);
  if (s) {
    const f = zr(e, t + 1, s);
    if (f) return f;
  }
  const i = n.validators;
  if (i === null)
    return;
  const a = t === 0 ? e.join(_t) : e.slice(t).join(_t), l = i.length;
  for (let f = 0; f < l; f++) {
    const d = i[f];
    if (d.validator(a))
      return d.classGroupId;
  }
}, Xs = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const t = e.slice(1, -1), n = t.indexOf(":"), r = t.slice(0, n);
  return r ? Ys + r : void 0;
})(), Zs = (e) => {
  const {
    theme: t,
    classGroups: n
  } = e;
  return qs(n, t);
}, qs = (e, t) => {
  const n = Wr();
  for (const r in e) {
    const o = e[r];
    kn(o, n, r, t);
  }
  return n;
}, kn = (e, t, n, r) => {
  const o = e.length;
  for (let s = 0; s < o; s++) {
    const i = e[s];
    Qs(i, t, n, r);
  }
}, Qs = (e, t, n, r) => {
  if (typeof e == "string") {
    Js(e, t, n);
    return;
  }
  if (typeof e == "function") {
    ei(e, t, n, r);
    return;
  }
  ti(e, t, n, r);
}, Js = (e, t, n) => {
  const r = e === "" ? t : Vr(t, e);
  r.classGroupId = n;
}, ei = (e, t, n, r) => {
  if (ni(e)) {
    kn(e(r), t, n, r);
    return;
  }
  t.validators === null && (t.validators = []), t.validators.push(Gs(n, e));
}, ti = (e, t, n, r) => {
  const o = Object.entries(e), s = o.length;
  for (let i = 0; i < s; i++) {
    const [a, l] = o[i];
    kn(l, Vr(t, a), n, r);
  }
}, Vr = (e, t) => {
  let n = e;
  const r = t.split(_t), o = r.length;
  for (let s = 0; s < o; s++) {
    const i = r[s];
    let a = n.nextPart.get(i);
    a || (a = Wr(), n.nextPart.set(i, a)), n = a;
  }
  return n;
}, ni = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, ri = (e) => {
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
}, fn = "!", tr = ":", oi = [], nr = (e, t, n, r, o) => ({
  modifiers: e,
  hasImportantModifier: t,
  baseClassName: n,
  maybePostfixModifierPosition: r,
  isExternal: o
}), si = (e) => {
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
        if (v === tr) {
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
    u.endsWith(fn) ? (p = u.slice(0, -1), h = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      u.startsWith(fn) && (p = u.slice(1), h = !0)
    );
    const g = f && f > l ? f - l : void 0;
    return nr(s, h, p, g);
  };
  if (t) {
    const o = t + tr, s = r;
    r = (i) => i.startsWith(o) ? s(i.slice(o.length)) : nr(oi, !1, i, void 0, !0);
  }
  if (n) {
    const o = r;
    r = (s) => n({
      className: s,
      parseClassName: o
    });
  }
  return r;
}, ii = (e) => {
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
}, ai = (e) => ({
  cache: ri(e.cacheSize),
  parseClassName: si(e),
  sortModifiers: ii(e),
  postfixLookupClassGroupIds: ci(e),
  ...Ks(e)
}), ci = (e) => {
  const t = /* @__PURE__ */ Object.create(null), n = e.postfixLookupClassGroups;
  if (n)
    for (let r = 0; r < n.length; r++)
      t[n[r]] = !0;
  return t;
}, li = /\s+/, ui = (e, t) => {
  const {
    parseClassName: n,
    getClassGroupId: r,
    getConflictingClassGroupIds: o,
    sortModifiers: s,
    postfixLookupClassGroupIds: i
  } = t, a = [], l = e.trim().split(li);
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
    const y = h.length === 0 ? "" : h.length === 1 ? h[0] : s(h).join(":"), x = g ? y + fn : y, S = x + w;
    if (a.indexOf(S) > -1)
      continue;
    a.push(S);
    const C = o(w, b);
    for (let k = 0; k < C.length; ++k) {
      const E = C[k];
      a.push(x + E);
    }
    f = u + (f.length > 0 ? " " + f : f);
  }
  return f;
}, fi = (...e) => {
  let t = 0, n, r, o = "";
  for (; t < e.length; )
    (n = e[t++]) && (r = Br(n)) && (o && (o += " "), o += r);
  return o;
}, Br = (e) => {
  if (typeof e == "string")
    return e;
  let t, n = "";
  for (let r = 0; r < e.length; r++)
    e[r] && (t = Br(e[r])) && (n && (n += " "), n += t);
  return n;
}, di = (e, ...t) => {
  let n, r, o, s;
  const i = (l) => {
    const f = t.reduce((d, u) => u(d), e());
    return n = ai(f), r = n.cache.get, o = n.cache.set, s = a, a(l);
  }, a = (l) => {
    const f = r(l);
    if (f)
      return f;
    const d = ui(l, n);
    return o(l, d), d;
  };
  return s = i, (...l) => s(fi(...l));
}, pi = [], B = (e) => {
  const t = (n) => n[e] || pi;
  return t.isThemeGetter = !0, t;
}, Ur = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Hr = /^\((?:(\w[\w-]*):)?(.+)\)$/i, mi = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, hi = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, gi = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, vi = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, bi = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, yi = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, ye = (e) => mi.test(e), N = (e) => !!e && !Number.isNaN(Number(e)), te = (e) => !!e && Number.isInteger(Number(e)), Xt = (e) => e.endsWith("%") && N(e.slice(0, -1)), le = (e) => hi.test(e), Gr = () => !0, wi = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  gi.test(e) && !vi.test(e)
), _n = () => !1, xi = (e) => bi.test(e), Ei = (e) => yi.test(e), Si = (e) => !P(e) && !R(e), Ci = (e) => e.startsWith("@container") && (e[10] === "/" && e[11] !== void 0 || e[11] === "s" && e[16] !== void 0 && e.startsWith("-size/", 10) || e[11] === "n" && e[18] !== void 0 && e.startsWith("-normal/", 10)), Pi = (e) => Pe(e, Xr, _n), P = (e) => Ur.test(e), $e = (e) => Pe(e, Zr, wi), rr = (e) => Pe(e, Ni, N), Ri = (e) => Pe(e, Qr, Gr), Oi = (e) => Pe(e, qr, _n), or = (e) => Pe(e, Yr, _n), Ai = (e) => Pe(e, Kr, Ei), mt = (e) => Pe(e, Jr, xi), R = (e) => Hr.test(e), ot = (e) => Ie(e, Zr), ki = (e) => Ie(e, qr), sr = (e) => Ie(e, Yr), _i = (e) => Ie(e, Xr), $i = (e) => Ie(e, Kr), ht = (e) => Ie(e, Jr, !0), Di = (e) => Ie(e, Qr, !0), Pe = (e, t, n) => {
  const r = Ur.exec(e);
  return r ? r[1] ? t(r[1]) : n(r[2]) : !1;
}, Ie = (e, t, n = !1) => {
  const r = Hr.exec(e);
  return r ? r[1] ? t(r[1]) : n : !1;
}, Yr = (e) => e === "position" || e === "percentage", Kr = (e) => e === "image" || e === "url", Xr = (e) => e === "length" || e === "size" || e === "bg-size", Zr = (e) => e === "length", Ni = (e) => e === "number", qr = (e) => e === "family-name", Qr = (e) => e === "number" || e === "weight", Jr = (e) => e === "shadow", Ti = () => {
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
  ], S = () => [...x(), R, P], C = () => ["auto", "hidden", "clip", "visible", "scroll"], k = () => ["auto", "contain", "none"], E = () => [R, P, l], D = () => [ye, "full", "auto", ...E()], L = () => [te, "none", "subgrid", R, P], _ = () => ["auto", {
    span: ["full", te, R, P]
  }, te, R, P], $ = () => [te, "auto", R, P], F = () => ["auto", "min", "max", "fr", R, P], M = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], z = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], I = () => ["auto", ...E()], W = () => [ye, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...E()], T = () => [ye, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...E()], j = () => [ye, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...E()], O = () => [e, R, P], et = () => [...x(), sr, or, {
    position: [R, P]
  }], tt = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], Oe = () => ["auto", "cover", "contain", _i, Pi, {
    size: [R, P]
  }], nt = () => [Xt, ot, $e], H = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    f,
    R,
    P
  ], G = () => ["", N, ot, $e], Fe = () => ["solid", "dashed", "dotted", "double"], dt = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], V = () => [N, Xt, sr, or], rt = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    g,
    R,
    P
  ], Ae = () => ["none", N, R, P], ke = () => ["none", N, R, P], je = () => [N, R, P], _e = () => [ye, "full", ...E()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [le],
      breakpoint: [le],
      color: [Gr],
      container: [le],
      "drop-shadow": [le],
      ease: ["in", "out", "in-out"],
      font: [Si],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [le],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [le],
      shadow: [le],
      spacing: ["px", N],
      text: [le],
      "text-shadow": [le],
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
        aspect: ["auto", "square", ye, P, R, v]
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
      "container-named": [Ci],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [N, P, R, a]
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
        object: S()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: C()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": C()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": C()
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
        inset: D()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": D()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": D()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": D(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: D()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": D(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: D()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": D()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": D()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: D()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: D()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: D()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: D()
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
        z: [te, "auto", R, P]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [ye, "full", "auto", a, ...E()]
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
        flex: [N, ye, "auto", "initial", "none", P]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", N, R, P]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", N, R, P]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [te, "first", "last", "none", R, P]
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
        "col-start": $()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": $()
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
        "row-start": $()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": $()
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
        inline: ["auto", ...T()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...T()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...T()]
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
        text: ["base", n, ot, $e]
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
        font: [r, Di, Ri]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Xt, P]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [ki, Oi, t]
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
        "line-clamp": [N, "none", R, rr]
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
        decoration: [...Fe(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [N, "from-font", "auto", R, $e]
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
        "underline-offset": [N, "auto", R, P]
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
        tab: [te, R, P]
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
        bg: Oe()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, te, R, P],
          radial: ["", R, P],
          conic: [te, R, P]
        }, $i, Ai]
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
        from: nt()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: nt()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: nt()
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
        rounded: H()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": H()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": H()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": H()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": H()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": H()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": H()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": H()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": H()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": H()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": H()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": H()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": H()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": H()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": H()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: G()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": G()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": G()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": G()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": G()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": G()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": G()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": G()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": G()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": G()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": G()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": G()
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
        "divide-y": G()
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
        border: [...Fe(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...Fe(), "hidden", "none"]
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
        outline: [...Fe(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [N, R, P]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", N, ot, $e]
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
          ht,
          mt
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
        "inset-shadow": ["none", u, ht, mt]
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
        ring: G()
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
        "ring-offset": [N, $e]
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
        "inset-ring": G()
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
        "text-shadow": ["none", p, ht, mt]
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
        opacity: [N, R, P]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...dt(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": dt()
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
        "mask-linear": [N]
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
        "mask-conic": [N]
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
        mask: Oe()
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
        blur: rt()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [N, R, P]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [N, R, P]
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
          ht,
          mt
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
        grayscale: ["", N, R, P]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [N, R, P]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", N, R, P]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [N, R, P]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", N, R, P]
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
        "backdrop-blur": rt()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [N, R, P]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [N, R, P]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", N, R, P]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [N, R, P]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", N, R, P]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [N, R, P]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [N, R, P]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", N, R, P]
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
        duration: [N, "initial", R, P]
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
        delay: [N, R, P]
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
        "perspective-origin": S()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: Ae()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": Ae()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": Ae()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": Ae()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: ke()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": ke()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": ke()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": ke()
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
        skew: je()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": je()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": je()
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
        origin: S()
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
        translate: _e()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": _e()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": _e()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": _e()
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
        zoom: [te, R, P]
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
        stroke: [N, ot, $e, rr]
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
}, Sf = /* @__PURE__ */ di(Ti), Cf = /* @__PURE__ */ Bs(Us);
function ir(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function Li(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const s = ir(o, t);
      return !n && typeof s == "function" && (n = !0), s;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const s = r[o];
          typeof s == "function" ? s() : ir(e[o], null);
        }
      };
  };
}
function Me(...e) {
  return c.useCallback(Li(...e), e);
}
// @__NO_SIDE_EFFECTS__
function $n(e) {
  const t = c.forwardRef((n, r) => {
    let { children: o, ...s } = n, i = null, a = !1;
    const l = [];
    ar(o) && typeof gt == "function" && (o = gt(o._payload)), c.Children.forEach(o, (p) => {
      var h;
      if (Wi(p)) {
        a = !0;
        const g = p;
        let m = "child" in g.props ? g.props.child : g.props.children;
        ar(m) && typeof gt == "function" && (m = gt(m._payload)), i = Mi(g, m), l.push((h = i == null ? void 0 : i.props) == null ? void 0 : h.children);
      } else
        l.push(p);
    }), i ? i = c.cloneElement(i, void 0, l) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && c.Children.count(o) === 1 && c.isValidElement(o) && (i = o)
    );
    const f = i ? ji(i) : void 0, d = Me(r, f);
    if (!i) {
      if (o || o === 0)
        throw new Error(
          a ? Ui(e) : Bi(e)
        );
      return o;
    }
    const u = Fi(s, i.props ?? {});
    return i.type !== c.Fragment && (u.ref = r ? d : f), c.cloneElement(i, u);
  });
  return t.displayName = `${e}.Slot`, t;
}
var Pf = /* @__PURE__ */ $n("Slot"), Ii = Symbol.for("radix.slottable"), Mi = (e, t) => {
  if ("child" in e.props) {
    const n = e.props.child;
    return c.isValidElement(n) ? c.cloneElement(n, void 0, e.props.children(n.props.children)) : null;
  }
  return c.isValidElement(t) ? t : null;
};
function Fi(e, t) {
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
function ji(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
function Wi(e) {
  return c.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Ii;
}
var zi = Symbol.for("react.lazy");
function ar(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === zi && "_payload" in e && Vi(e._payload);
}
function Vi(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
var Bi = (e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, Ui = (e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, gt = ce[" use ".trim().toString()];
const cr = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, lr = un, Rf = (e, t) => (n) => {
  var r;
  if ((t == null ? void 0 : t.variants) == null) return lr(e, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
  const { variants: o, defaultVariants: s } = t, i = Object.keys(o).map((f) => {
    const d = n == null ? void 0 : n[f], u = s == null ? void 0 : s[f];
    if (d === null) return null;
    const p = cr(d) || cr(u);
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
  return lr(e, i, l, n == null ? void 0 : n.class, n == null ? void 0 : n.className);
};
function xe(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function(o) {
    if (e == null || e(o), n === !1 || !o || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  };
}
function Hi(e, t = []) {
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
  return o.scopeName = e, [r, Gi(o, ...t)];
}
function Gi(...e) {
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
var it = globalThis != null && globalThis.document ? c.useLayoutEffect : () => {
}, Yi = ce[" useId ".trim().toString()] || (() => {
}), Ki = 0;
function Zt(e) {
  const [t, n] = c.useState(Yi());
  return it(() => {
    n((r) => r ?? String(Ki++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
var Xi = ce[" useInsertionEffect ".trim().toString()] || it;
function Zi({
  prop: e,
  defaultProp: t,
  onChange: n = () => {
  },
  caller: r
}) {
  const [o, s, i] = qi({
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
        const p = Qi(d) ? d(e) : d;
        p !== e && ((u = i.current) == null || u.call(i, p));
      } else
        s(d);
    },
    [a, e, s, i]
  );
  return [l, f];
}
function qi({
  defaultProp: e,
  onChange: t
}) {
  const [n, r] = c.useState(e), o = c.useRef(n), s = c.useRef(t);
  return Xi(() => {
    s.current = t;
  }, [t]), c.useEffect(() => {
    var i;
    o.current !== n && ((i = s.current) == null || i.call(s, n), o.current = n);
  }, [n, o]), [n, r, s];
}
function Qi(e) {
  return typeof e == "function";
}
var Ji = [
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
], ge = Ji.reduce((e, t) => {
  const n = /* @__PURE__ */ $n(`Primitive.${t}`), r = c.forwardRef((o, s) => {
    const { asChild: i, ...a } = o, l = i ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ A.jsx(l, { ...a, ref: s });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function ea(e, t) {
  e && Le.flushSync(() => e.dispatchEvent(t));
}
function at(e) {
  const t = c.useRef(e);
  return c.useEffect(() => {
    t.current = e;
  }), c.useMemo(() => (...n) => {
    var r;
    return (r = t.current) == null ? void 0 : r.call(t, ...n);
  }, []);
}
var ta = "DismissableLayer", dn = "dismissableLayer.update", na = "dismissableLayer.pointerDownOutside", ra = "dismissableLayer.focusOutside", ur, Dn = c.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set(),
  // Outside elements that belong to a layer's own dismiss affordance (eg, a
  // dialog overlay). Pressing them should dismiss the layer regardless of
  // whether or not they stop propagation.
  //
  // See https://github.com/radix-ui/primitives/issues/3346
  dismissableSurfaces: /* @__PURE__ */ new Set()
}), eo = c.forwardRef(
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
    } = e, d = c.useContext(Dn), [u, p] = c.useState(null), h = (u == null ? void 0 : u.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, g] = c.useState({}), m = Me(t, p), v = Array.from(d.layers), [b] = [
      ...d.layersWithOutsidePointerEventsDisabled
    ].slice(-1), w = b ? v.indexOf(b) : -1, y = u ? v.indexOf(u) : -1, x = d.layersWithOutsidePointerEventsDisabled.size > 0, S = y >= w, C = c.useRef(!1), k = ca(
      (_) => {
        s == null || s(_), a == null || a(_), _.defaultPrevented || l == null || l();
      },
      {
        ownerDocument: h,
        deferPointerDownOutside: r,
        isDeferredPointerDownOutsideRef: C,
        dismissableSurfaces: d.dismissableSurfaces,
        shouldHandlePointerDownOutside: c.useCallback(
          (_) => {
            if (!(_ instanceof Node))
              return !1;
            const $ = [...d.branches].some(
              (F) => F.contains(_)
            );
            return S && !$;
          },
          [d.branches, S]
        )
      }
    ), E = la((_) => {
      if (r && C.current)
        return;
      const $ = _.target;
      [...d.branches].some((M) => M.contains($)) || (i == null || i(_), a == null || a(_), _.defaultPrevented || l == null || l());
    }, h), D = u ? y === v.length - 1 : !1, L = at((_) => {
      _.key === "Escape" && (o == null || o(_), !_.defaultPrevented && l && (_.preventDefault(), l()));
    });
    return c.useEffect(() => {
      if (D)
        return h.addEventListener("keydown", L, { capture: !0 }), () => h.removeEventListener("keydown", L, { capture: !0 });
    }, [h, D, L]), c.useEffect(() => {
      if (u)
        return n && (d.layersWithOutsidePointerEventsDisabled.size === 0 && (ur = h.body.style.pointerEvents, h.body.style.pointerEvents = "none"), d.layersWithOutsidePointerEventsDisabled.add(u)), d.layers.add(u), fr(), () => {
          n && (d.layersWithOutsidePointerEventsDisabled.delete(u), d.layersWithOutsidePointerEventsDisabled.size === 0 && (h.body.style.pointerEvents = ur));
        };
    }, [u, h, n, d]), c.useEffect(() => () => {
      u && (d.layers.delete(u), d.layersWithOutsidePointerEventsDisabled.delete(u), fr());
    }, [u, d]), c.useEffect(() => {
      const _ = () => g({});
      return document.addEventListener(dn, _), () => document.removeEventListener(dn, _);
    }, []), /* @__PURE__ */ A.jsx(
      ge.div,
      {
        ...f,
        ref: m,
        style: {
          pointerEvents: x ? S ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: xe(e.onFocusCapture, E.onFocusCapture),
        onBlurCapture: xe(e.onBlurCapture, E.onBlurCapture),
        onPointerDownCapture: xe(
          e.onPointerDownCapture,
          k.onPointerDownCapture
        )
      }
    );
  }
);
eo.displayName = ta;
var oa = "DismissableLayerBranch", sa = c.forwardRef((e, t) => {
  const n = c.useContext(Dn), r = c.useRef(null), o = Me(t, r);
  return c.useEffect(() => {
    const s = r.current;
    if (s)
      return n.branches.add(s), () => {
        n.branches.delete(s);
      };
  }, [n.branches]), /* @__PURE__ */ A.jsx(ge.div, { ...e, ref: o });
});
sa.displayName = oa;
function ia() {
  const e = c.useContext(Dn), [t, n] = c.useState(null);
  return c.useEffect(() => {
    if (t)
      return e.dismissableSurfaces.add(t), () => {
        e.dismissableSurfaces.delete(t);
      };
  }, [t, e.dismissableSurfaces]), n;
}
var aa = () => !0;
function ca(e, t) {
  const {
    ownerDocument: n = globalThis == null ? void 0 : globalThis.document,
    deferPointerDownOutside: r = !1,
    isDeferredPointerDownOutsideRef: o,
    dismissableSurfaces: s,
    shouldHandlePointerDownOutside: i = aa
  } = t, a = at(e), l = c.useRef(!1), f = c.useRef(!1), d = c.useRef(/* @__PURE__ */ new Map()), u = c.useRef(() => {
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
      x instanceof Node && [...s].some((C) => C.contains(x)) || d.current.set(y.type, !0), y.type === "click" && window.setTimeout(() => {
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
          const C = h();
          p(), C || to(
            na,
            a,
            S,
            { discrete: !0 }
          );
        };
        if (!i(y.target)) {
          n.removeEventListener("click", u.current), p(), l.current = !1;
          return;
        }
        const S = { originalEvent: y };
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
function la(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = at(e), r = c.useRef(!1);
  return c.useEffect(() => {
    const o = (s) => {
      s.target && !r.current && to(ra, n, { originalEvent: s }, {
        discrete: !1
      });
    };
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, n]), {
    onFocusCapture: () => r.current = !0,
    onBlurCapture: () => r.current = !1
  };
}
function fr() {
  const e = new CustomEvent(dn);
  document.dispatchEvent(e);
}
function to(e, t, n, { discrete: r }) {
  const o = n.originalEvent.target, s = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && o.addEventListener(e, t, { once: !0 }), r ? ea(o, s) : o.dispatchEvent(s);
}
var qt = "focusScope.autoFocusOnMount", Qt = "focusScope.autoFocusOnUnmount", dr = { bubbles: !1, cancelable: !0 }, ua = "FocusScope", no = c.forwardRef((e, t) => {
  const {
    loop: n = !1,
    trapped: r = !1,
    onMountAutoFocus: o,
    onUnmountAutoFocus: s,
    ...i
  } = e, [a, l] = c.useState(null), f = at(o), d = at(s), u = c.useRef(null), p = Me(t, l), h = c.useRef({
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
        a.contains(x) ? u.current = x : we(u.current, { select: !0 });
      }, v = function(y) {
        if (h.paused || !a) return;
        const x = y.relatedTarget;
        x !== null && (a.contains(x) || we(u.current, { select: !0 }));
      }, b = function(y) {
        if (document.activeElement === document.body)
          for (const S of y)
            S.removedNodes.length > 0 && we(a);
      };
      document.addEventListener("focusin", m), document.addEventListener("focusout", v);
      const w = new MutationObserver(b);
      return a && w.observe(a, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", m), document.removeEventListener("focusout", v), w.disconnect();
      };
    }
  }, [r, a, h.paused]), c.useEffect(() => {
    if (a) {
      mr.add(h);
      const m = document.activeElement;
      if (!a.contains(m)) {
        const b = new CustomEvent(qt, dr);
        a.addEventListener(qt, f), a.dispatchEvent(b), b.defaultPrevented || (fa(ga(ro(a)), { select: !0 }), document.activeElement === m && we(a));
      }
      return () => {
        a.removeEventListener(qt, f), setTimeout(() => {
          const b = new CustomEvent(Qt, dr);
          a.addEventListener(Qt, d), a.dispatchEvent(b), b.defaultPrevented || we(m ?? document.body, { select: !0 }), a.removeEventListener(Qt, d), mr.remove(h);
        }, 0);
      };
    }
  }, [a, f, d, h]);
  const g = c.useCallback(
    (m) => {
      if (!n && !r || h.paused) return;
      const v = m.key === "Tab" && !m.altKey && !m.ctrlKey && !m.metaKey, b = document.activeElement;
      if (v && b) {
        const w = m.currentTarget, [y, x] = da(w);
        y && x ? !m.shiftKey && b === x ? (m.preventDefault(), n && we(y, { select: !0 })) : m.shiftKey && b === y && (m.preventDefault(), n && we(x, { select: !0 })) : b === w && m.preventDefault();
      }
    },
    [n, r, h.paused]
  );
  return /* @__PURE__ */ A.jsx(ge.div, { tabIndex: -1, ...i, ref: p, onKeyDown: g });
});
no.displayName = ua;
function fa(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const r of e)
    if (we(r, { select: t }), document.activeElement !== n) return;
}
function da(e) {
  const t = ro(e), n = pr(t, e), r = pr(t.reverse(), e);
  return [n, r];
}
function ro(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (r) => {
      const o = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || o ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
function pr(e, t) {
  const n = typeof t.checkVisibility == "function" && t.checkVisibility({ checkVisibilityCSS: !0 });
  for (const r of e)
    if (!(n ? !r.checkVisibility({ checkVisibilityCSS: !0 }) : pa(r, { upTo: t })))
      return r;
}
function pa(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function ma(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function we(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && ma(e) && t && e.select();
  }
}
var mr = ha();
function ha() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && (n == null || n.pause()), e = hr(e, t), e.unshift(t);
    },
    remove(t) {
      var n;
      e = hr(e, t), (n = e[0]) == null || n.resume();
    }
  };
}
function hr(e, t) {
  const n = [...e], r = n.indexOf(t);
  return r !== -1 && n.splice(r, 1), n;
}
function ga(e) {
  return e.filter((t) => t.tagName !== "A");
}
var va = "Portal", oo = c.forwardRef((e, t) => {
  var a;
  const { container: n, ...r } = e, [o, s] = c.useState(!1);
  it(() => s(!0), []);
  const i = n || o && ((a = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : a.body);
  return i ? Le.createPortal(/* @__PURE__ */ A.jsx(ge.div, { ...r, ref: t }), i) : null;
});
oo.displayName = va;
function ba(e, t) {
  return c.useReducer((n, r) => t[n][r] ?? n, e);
}
var It = (e) => {
  const { present: t, children: n } = e, r = ya(t), o = typeof n == "function" ? n({ present: r.isPresent }) : c.Children.only(n), s = wa(r.ref, xa(o));
  return typeof n == "function" || r.isPresent ? c.cloneElement(o, { ref: s }) : null;
};
It.displayName = "Presence";
function ya(e) {
  const [t, n] = c.useState(), r = c.useRef(null), o = c.useRef(e), s = c.useRef("none"), i = c.useRef(void 0), a = e ? "mounted" : "unmounted", [l, f] = ba(a, {
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
    l === "mounted" ? (s.current = i.current ?? st(r.current), i.current = void 0) : s.current = "none";
  }, [l]), it(() => {
    const d = r.current, u = o.current;
    if (u !== e) {
      const h = s.current, g = st(d);
      e ? (i.current = g, f("MOUNT")) : g === "none" || (d == null ? void 0 : d.display) === "none" ? f("UNMOUNT") : f(u && h !== g ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, f]), it(() => {
    if (t) {
      let d;
      const u = t.ownerDocument.defaultView ?? window, p = (g) => {
        const v = st(r.current).includes(CSS.escape(g.animationName));
        if (g.target === t && v && (f("ANIMATION_END"), !o.current)) {
          const b = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", d = u.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = b);
          });
        }
      }, h = (g) => {
        g.target === t && (s.current = st(r.current));
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
        r.current = u, i.current = st(u);
      } else
        r.current = null;
      n(d);
    }, [])
  };
}
function gr(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function wa(...e) {
  const t = c.useRef(e);
  return t.current = e, c.useCallback((n) => {
    const r = t.current;
    let o = !1;
    const s = r.map((i) => {
      const a = gr(i, n);
      return !o && typeof a == "function" && (o = !0), a;
    });
    if (o)
      return () => {
        for (let i = 0; i < s.length; i++) {
          const a = s[i];
          typeof a == "function" ? a() : gr(r[i], null);
        }
      };
  }, []);
}
function st(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function xa(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
var vt = 0, ne = null;
function Ea() {
  c.useEffect(() => {
    ne || (ne = { start: vr(), end: vr() });
    const { start: e, end: t } = ne;
    return document.body.firstElementChild !== e && document.body.insertAdjacentElement("afterbegin", e), document.body.lastElementChild !== t && document.body.insertAdjacentElement("beforeend", t), vt++, () => {
      vt === 1 && (ne == null || ne.start.remove(), ne == null || ne.end.remove(), ne = null), vt = Math.max(0, vt - 1);
    };
  }, []);
}
function vr() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var oe = function() {
  return oe = Object.assign || function(t) {
    for (var n, r = 1, o = arguments.length; r < o; r++) {
      n = arguments[r];
      for (var s in n) Object.prototype.hasOwnProperty.call(n, s) && (t[s] = n[s]);
    }
    return t;
  }, oe.apply(this, arguments);
};
function so(e, t) {
  var n = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
  return n;
}
function Sa(e, t, n) {
  if (n || arguments.length === 2) for (var r = 0, o = t.length, s; r < o; r++)
    (s || !(r in t)) && (s || (s = Array.prototype.slice.call(t, 0, r)), s[r] = t[r]);
  return e.concat(s || Array.prototype.slice.call(t));
}
var Ot = "right-scroll-bar-position", At = "width-before-scroll-bar", Ca = "with-scroll-bars-hidden", Pa = "--removed-body-scroll-bar-size";
function Jt(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function Ra(e, t) {
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
var Oa = typeof window < "u" ? c.useLayoutEffect : c.useEffect, br = /* @__PURE__ */ new WeakMap();
function Aa(e, t) {
  var n = Ra(null, function(r) {
    return e.forEach(function(o) {
      return Jt(o, r);
    });
  });
  return Oa(function() {
    var r = br.get(n);
    if (r) {
      var o = new Set(r), s = new Set(e), i = n.current;
      o.forEach(function(a) {
        s.has(a) || Jt(a, null);
      }), s.forEach(function(a) {
        o.has(a) || Jt(a, i);
      });
    }
    br.set(n, e);
  }, [e]), n;
}
function ka(e) {
  return e;
}
function _a(e, t) {
  t === void 0 && (t = ka);
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
function $a(e) {
  e === void 0 && (e = {});
  var t = _a(null);
  return t.options = oe({ async: !0, ssr: !1 }, e), t;
}
var io = function(e) {
  var t = e.sideCar, n = so(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var r = t.read();
  if (!r)
    throw new Error("Sidecar medium not found");
  return c.createElement(r, oe({}, n));
};
io.isSideCarExport = !0;
function Da(e, t) {
  return e.useMedium(t), io;
}
var ao = $a(), en = function() {
}, Mt = c.forwardRef(function(e, t) {
  var n = c.useRef(null), r = c.useState({
    onScrollCapture: en,
    onWheelCapture: en,
    onTouchMoveCapture: en
  }), o = r[0], s = r[1], i = e.forwardProps, a = e.children, l = e.className, f = e.removeScrollBar, d = e.enabled, u = e.shards, p = e.sideCar, h = e.noRelative, g = e.noIsolation, m = e.inert, v = e.allowPinchZoom, b = e.as, w = b === void 0 ? "div" : b, y = e.gapMode, x = so(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), S = p, C = Aa([n, t]), k = oe(oe({}, x), o);
  return c.createElement(
    c.Fragment,
    null,
    d && c.createElement(S, { sideCar: ao, removeScrollBar: f, shards: u, noRelative: h, noIsolation: g, inert: m, setCallbacks: s, allowPinchZoom: !!v, lockRef: n, gapMode: y }),
    i ? c.cloneElement(c.Children.only(a), oe(oe({}, k), { ref: C })) : c.createElement(w, oe({}, k, { className: l, ref: C }), a)
  );
});
Mt.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
Mt.classNames = {
  fullWidth: At,
  zeroRight: Ot
};
var Na = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function Ta() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = Na();
  return t && e.setAttribute("nonce", t), e;
}
function La(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function Ia(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var Ma = function() {
  var e = 0, t = null;
  return {
    add: function(n) {
      e == 0 && (t = Ta()) && (La(t, n), Ia(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, Fa = function() {
  var e = Ma();
  return function(t, n) {
    c.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && n]);
  };
}, co = function() {
  var e = Fa(), t = function(n) {
    var r = n.styles, o = n.dynamic;
    return e(r, o), null;
  };
  return t;
}, ja = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, tn = function(e) {
  return parseInt(e || "", 10) || 0;
}, Wa = function(e) {
  var t = window.getComputedStyle(document.body), n = t[e === "padding" ? "paddingLeft" : "marginLeft"], r = t[e === "padding" ? "paddingTop" : "marginTop"], o = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [tn(n), tn(r), tn(o)];
}, za = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return ja;
  var t = Wa(e), n = document.documentElement.clientWidth, r = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, r - n + t[2] - t[0])
  };
}, Va = co(), Ue = "data-scroll-locked", Ba = function(e, t, n, r) {
  var o = e.left, s = e.top, i = e.right, a = e.gap;
  return n === void 0 && (n = "margin"), `
  .`.concat(Ca, ` {
   overflow: hidden `).concat(r, `;
   padding-right: `).concat(a, "px ").concat(r, `;
  }
  body[`).concat(Ue, `] {
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
  
  .`).concat(Ot, ` {
    right: `).concat(a, "px ").concat(r, `;
  }
  
  .`).concat(At, ` {
    margin-right: `).concat(a, "px ").concat(r, `;
  }
  
  .`).concat(Ot, " .").concat(Ot, ` {
    right: 0 `).concat(r, `;
  }
  
  .`).concat(At, " .").concat(At, ` {
    margin-right: 0 `).concat(r, `;
  }
  
  body[`).concat(Ue, `] {
    `).concat(Pa, ": ").concat(a, `px;
  }
`);
}, yr = function() {
  var e = parseInt(document.body.getAttribute(Ue) || "0", 10);
  return isFinite(e) ? e : 0;
}, Ua = function() {
  c.useEffect(function() {
    return document.body.setAttribute(Ue, (yr() + 1).toString()), function() {
      var e = yr() - 1;
      e <= 0 ? document.body.removeAttribute(Ue) : document.body.setAttribute(Ue, e.toString());
    };
  }, []);
}, Ha = function(e) {
  var t = e.noRelative, n = e.noImportant, r = e.gapMode, o = r === void 0 ? "margin" : r;
  Ua();
  var s = c.useMemo(function() {
    return za(o);
  }, [o]);
  return c.createElement(Va, { styles: Ba(s, !t, o, n ? "" : "!important") });
}, pn = !1;
if (typeof window < "u")
  try {
    var bt = Object.defineProperty({}, "passive", {
      get: function() {
        return pn = !0, !0;
      }
    });
    window.addEventListener("test", bt, bt), window.removeEventListener("test", bt, bt);
  } catch {
    pn = !1;
  }
var We = pn ? { passive: !1 } : !1, Ga = function(e) {
  return e.tagName === "TEXTAREA";
}, lo = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var n = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    n[t] !== "hidden" && // contains scroll inside self
    !(n.overflowY === n.overflowX && !Ga(e) && n[t] === "visible")
  );
}, Ya = function(e) {
  return lo(e, "overflowY");
}, Ka = function(e) {
  return lo(e, "overflowX");
}, wr = function(e, t) {
  var n = t.ownerDocument, r = t;
  do {
    typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host);
    var o = uo(e, r);
    if (o) {
      var s = fo(e, r), i = s[1], a = s[2];
      if (i > a)
        return !0;
    }
    r = r.parentNode;
  } while (r && r !== n.body);
  return !1;
}, Xa = function(e) {
  var t = e.scrollTop, n = e.scrollHeight, r = e.clientHeight;
  return [
    t,
    n,
    r
  ];
}, Za = function(e) {
  var t = e.scrollLeft, n = e.scrollWidth, r = e.clientWidth;
  return [
    t,
    n,
    r
  ];
}, uo = function(e, t) {
  return e === "v" ? Ya(t) : Ka(t);
}, fo = function(e, t) {
  return e === "v" ? Xa(t) : Za(t);
}, qa = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, Qa = function(e, t, n, r, o) {
  var s = qa(e, window.getComputedStyle(t).direction), i = s * r, a = n.target, l = t.contains(a), f = !1, d = i > 0, u = 0, p = 0;
  do {
    if (!a)
      break;
    var h = fo(e, a), g = h[0], m = h[1], v = h[2], b = m - v - s * g;
    (g || b) && uo(e, a) && (u += b, p += g);
    var w = a.parentNode;
    a = w && w.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? w.host : w;
  } while (
    // portaled content
    !l && a !== document.body || // self content
    l && (t.contains(a) || t === a)
  );
  return (d && Math.abs(u) < 1 || !d && Math.abs(p) < 1) && (f = !0), f;
}, yt = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, xr = function(e) {
  return [e.deltaX, e.deltaY];
}, Er = function(e) {
  return e && "current" in e ? e.current : e;
}, Ja = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, ec = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, tc = 0, ze = [];
function nc(e) {
  var t = c.useRef([]), n = c.useRef([0, 0]), r = c.useRef(), o = c.useState(tc++)[0], s = c.useState(co)[0], i = c.useRef(e);
  c.useEffect(function() {
    i.current = e;
  }, [e]), c.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var m = Sa([e.lockRef.current], (e.shards || []).map(Er), !0).filter(Boolean);
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
    var b = yt(m), w = n.current, y = "deltaX" in m ? m.deltaX : w[0] - b[0], x = "deltaY" in m ? m.deltaY : w[1] - b[1], S, C = m.target, k = Math.abs(y) > Math.abs(x) ? "h" : "v";
    if ("touches" in m && k === "h" && C.type === "range")
      return !1;
    var E = window.getSelection(), D = E && E.anchorNode, L = D ? D === C || D.contains(C) : !1;
    if (L)
      return !1;
    var _ = wr(k, C);
    if (!_)
      return !0;
    if (_ ? S = k : (S = k === "v" ? "h" : "v", _ = wr(k, C)), !_)
      return !1;
    if (!r.current && "changedTouches" in m && (y || x) && (r.current = S), !S)
      return !0;
    var $ = r.current || S;
    return Qa($, v, m, $ === "h" ? y : x);
  }, []), l = c.useCallback(function(m) {
    var v = m;
    if (!(!ze.length || ze[ze.length - 1] !== s)) {
      var b = "deltaY" in v ? xr(v) : yt(v), w = t.current.filter(function(S) {
        return S.name === v.type && (S.target === v.target || v.target === S.shadowParent) && Ja(S.delta, b);
      })[0];
      if (w && w.should) {
        v.cancelable && v.preventDefault();
        return;
      }
      if (!w) {
        var y = (i.current.shards || []).map(Er).filter(Boolean).filter(function(S) {
          return S.contains(v.target);
        }), x = y.length > 0 ? a(v, y[0]) : !i.current.noIsolation;
        x && v.cancelable && v.preventDefault();
      }
    }
  }, []), f = c.useCallback(function(m, v, b, w) {
    var y = { name: m, delta: v, target: b, should: w, shadowParent: rc(b) };
    t.current.push(y), setTimeout(function() {
      t.current = t.current.filter(function(x) {
        return x !== y;
      });
    }, 1);
  }, []), d = c.useCallback(function(m) {
    n.current = yt(m), r.current = void 0;
  }, []), u = c.useCallback(function(m) {
    f(m.type, xr(m), m.target, a(m, e.lockRef.current));
  }, []), p = c.useCallback(function(m) {
    f(m.type, yt(m), m.target, a(m, e.lockRef.current));
  }, []);
  c.useEffect(function() {
    return ze.push(s), e.setCallbacks({
      onScrollCapture: u,
      onWheelCapture: u,
      onTouchMoveCapture: p
    }), document.addEventListener("wheel", l, We), document.addEventListener("touchmove", l, We), document.addEventListener("touchstart", d, We), function() {
      ze = ze.filter(function(m) {
        return m !== s;
      }), document.removeEventListener("wheel", l, We), document.removeEventListener("touchmove", l, We), document.removeEventListener("touchstart", d, We);
    };
  }, []);
  var h = e.removeScrollBar, g = e.inert;
  return c.createElement(
    c.Fragment,
    null,
    g ? c.createElement(s, { styles: ec(o) }) : null,
    h ? c.createElement(Ha, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function rc(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const oc = Da(ao, nc);
var Nn = c.forwardRef(function(e, t) {
  return c.createElement(Mt, oe({}, e, { ref: t, sideCar: oc }));
});
Nn.classNames = Mt.classNames;
var sc = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, Ve = /* @__PURE__ */ new WeakMap(), wt = /* @__PURE__ */ new WeakMap(), xt = {}, nn = 0, po = function(e) {
  return e && (e.host || po(e.parentNode));
}, ic = function(e, t) {
  return t.map(function(n) {
    if (e.contains(n))
      return n;
    var r = po(n);
    return r && e.contains(r) ? r : (console.error("aria-hidden", n, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(n) {
    return !!n;
  });
}, ac = function(e, t, n, r) {
  var o = ic(t, Array.isArray(e) ? e : [e]);
  xt[n] || (xt[n] = /* @__PURE__ */ new WeakMap());
  var s = xt[n], i = [], a = /* @__PURE__ */ new Set(), l = new Set(o), f = function(u) {
    !u || a.has(u) || (a.add(u), f(u.parentNode));
  };
  o.forEach(f);
  var d = function(u) {
    !u || l.has(u) || Array.prototype.forEach.call(u.children, function(p) {
      if (a.has(p))
        d(p);
      else
        try {
          var h = p.getAttribute(r), g = h !== null && h !== "false", m = (Ve.get(p) || 0) + 1, v = (s.get(p) || 0) + 1;
          Ve.set(p, m), s.set(p, v), i.push(p), m === 1 && g && wt.set(p, !0), v === 1 && p.setAttribute(n, "true"), g || p.setAttribute(r, "true");
        } catch (b) {
          console.error("aria-hidden: cannot operate on ", p, b);
        }
    });
  };
  return d(t), a.clear(), nn++, function() {
    i.forEach(function(u) {
      var p = Ve.get(u) - 1, h = s.get(u) - 1;
      Ve.set(u, p), s.set(u, h), p || (wt.has(u) || u.removeAttribute(r), wt.delete(u)), h || u.removeAttribute(n);
    }), nn--, nn || (Ve = /* @__PURE__ */ new WeakMap(), Ve = /* @__PURE__ */ new WeakMap(), wt = /* @__PURE__ */ new WeakMap(), xt = {});
  };
}, mo = function(e, t, n) {
  n === void 0 && (n = "data-aria-hidden");
  var r = Array.from(Array.isArray(e) ? e : [e]), o = sc(e);
  return o ? (r.push.apply(r, Array.from(o.querySelectorAll("[aria-live], script"))), ac(r, o, n, "aria-hidden")) : function() {
    return null;
  };
}, Ft = "Dialog", [ho] = Hi(Ft), [cc, q] = ho(Ft), lc = (e) => {
  const {
    __scopeDialog: t,
    children: n,
    open: r,
    defaultOpen: o,
    onOpenChange: s,
    modal: i = !0
  } = e, a = c.useRef(null), l = c.useRef(null), [f, d] = Zi({
    prop: r,
    defaultProp: o ?? !1,
    onChange: s,
    caller: Ft
  });
  return /* @__PURE__ */ A.jsx(
    cc,
    {
      scope: t,
      triggerRef: a,
      contentRef: l,
      contentId: Zt(),
      titleId: Zt(),
      descriptionId: Zt(),
      open: f,
      onOpenChange: d,
      onOpenToggle: c.useCallback(() => d((u) => !u), [d]),
      modal: i,
      children: n
    }
  );
};
lc.displayName = Ft;
var go = "DialogTrigger", uc = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = q(go, n), s = Me(t, o.triggerRef);
    return /* @__PURE__ */ A.jsx(
      ge.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.open ? o.contentId : void 0,
        "data-state": Ln(o.open),
        ...r,
        ref: s,
        onClick: xe(e.onClick, o.onOpenToggle)
      }
    );
  }
);
uc.displayName = go;
var Tn = "DialogPortal", [fc, vo] = ho(Tn, {
  forceMount: void 0
}), dc = (e) => {
  const { __scopeDialog: t, forceMount: n, children: r, container: o } = e, s = q(Tn, t);
  return /* @__PURE__ */ A.jsx(fc, { scope: t, forceMount: n, children: c.Children.map(r, (i) => /* @__PURE__ */ A.jsx(It, { present: n || s.open, children: /* @__PURE__ */ A.jsx(oo, { asChild: !0, container: o, children: i }) })) });
};
dc.displayName = Tn;
var $t = "DialogOverlay", pc = c.forwardRef(
  (e, t) => {
    const n = vo($t, e.__scopeDialog), { forceMount: r = n.forceMount, ...o } = e, s = q($t, e.__scopeDialog);
    return s.modal ? /* @__PURE__ */ A.jsx(It, { present: r || s.open, children: /* @__PURE__ */ A.jsx(hc, { ...o, ref: t }) }) : null;
  }
);
pc.displayName = $t;
var mc = /* @__PURE__ */ $n("DialogOverlay.RemoveScroll"), hc = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = q($t, n), s = ia(), i = Me(t, s);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ A.jsx(Nn, { as: mc, allowPinchZoom: !0, shards: [o.contentRef], children: /* @__PURE__ */ A.jsx(
        ge.div,
        {
          "data-state": Ln(o.open),
          ...r,
          ref: i,
          style: { pointerEvents: "auto", ...r.style }
        }
      ) })
    );
  }
), Ge = "DialogContent", gc = c.forwardRef(
  (e, t) => {
    const n = vo(Ge, e.__scopeDialog), { forceMount: r = n.forceMount, ...o } = e, s = q(Ge, e.__scopeDialog);
    return /* @__PURE__ */ A.jsx(It, { present: r || s.open, children: s.modal ? /* @__PURE__ */ A.jsx(vc, { ...o, ref: t }) : /* @__PURE__ */ A.jsx(bc, { ...o, ref: t }) });
  }
);
gc.displayName = Ge;
var vc = c.forwardRef(
  (e, t) => {
    const n = q(Ge, e.__scopeDialog), r = c.useRef(null), o = Me(t, n.contentRef, r);
    return c.useEffect(() => {
      const s = r.current;
      if (s) return mo(s);
    }, []), /* @__PURE__ */ A.jsx(
      bo,
      {
        ...e,
        ref: o,
        trapFocus: n.open,
        disableOutsidePointerEvents: n.open,
        onCloseAutoFocus: xe(e.onCloseAutoFocus, (s) => {
          var i;
          s.preventDefault(), (i = n.triggerRef.current) == null || i.focus();
        }),
        onPointerDownOutside: xe(e.onPointerDownOutside, (s) => {
          const i = s.detail.originalEvent, a = i.button === 0 && i.ctrlKey === !0;
          (i.button === 2 || a) && s.preventDefault();
        }),
        onFocusOutside: xe(
          e.onFocusOutside,
          (s) => s.preventDefault()
        )
      }
    );
  }
), bc = c.forwardRef(
  (e, t) => {
    const n = q(Ge, e.__scopeDialog), r = c.useRef(!1), o = c.useRef(!1);
    return /* @__PURE__ */ A.jsx(
      bo,
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
), bo = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, trapFocus: r, onOpenAutoFocus: o, onCloseAutoFocus: s, ...i } = e, a = q(Ge, n);
    return Ea(), /* @__PURE__ */ A.jsx(A.Fragment, { children: /* @__PURE__ */ A.jsx(
      no,
      {
        asChild: !0,
        loop: !0,
        trapped: r,
        onMountAutoFocus: o,
        onUnmountAutoFocus: s,
        children: /* @__PURE__ */ A.jsx(
          eo,
          {
            role: "dialog",
            id: a.contentId,
            "aria-describedby": a.descriptionId,
            "aria-labelledby": a.titleId,
            "data-state": Ln(a.open),
            ...i,
            ref: t,
            deferPointerDownOutside: !0,
            onDismiss: () => a.onOpenChange(!1)
          }
        )
      }
    ) });
  }
), yo = "DialogTitle", yc = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = q(yo, n);
    return /* @__PURE__ */ A.jsx(ge.h2, { id: o.titleId, ...r, ref: t });
  }
);
yc.displayName = yo;
var wo = "DialogDescription", wc = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = q(wo, n);
    return /* @__PURE__ */ A.jsx(ge.p, { id: o.descriptionId, ...r, ref: t });
  }
);
wc.displayName = wo;
var xo = "DialogClose", xc = c.forwardRef(
  (e, t) => {
    const { __scopeDialog: n, ...r } = e, o = q(xo, n);
    return /* @__PURE__ */ A.jsx(
      ge.button,
      {
        type: "button",
        ...r,
        ref: t,
        onClick: xe(e.onClick, () => o.onOpenChange(!1))
      }
    );
  }
);
xc.displayName = xo;
function Ln(e) {
  return e ? "open" : "closed";
}
var Ec = Object.defineProperty, Xe = (e, t) => Ec(e, "name", { value: t, configurable: !0 }), Eo = !!(typeof window < "u" && window.document && window.document.createElement);
function Ee(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return /* @__PURE__ */ Xe(function(o) {
    if (e == null || e(o), n === !1 || !o || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  }, "handleEvent");
}
Xe(Ee, "composeEventHandlers");
function Sc(e) {
  var t;
  if (!Eo)
    throw new Error("Cannot access window outside of the DOM");
  return ((t = e == null ? void 0 : e.ownerDocument) == null ? void 0 : t.defaultView) ?? window;
}
Xe(Sc, "getOwnerWindow");
function mn(e) {
  if (!Eo)
    throw new Error("Cannot access document outside of the DOM");
  return (e == null ? void 0 : e.ownerDocument) ?? document;
}
Xe(mn, "getOwnerDocument");
function So(e, t = !1) {
  const { activeElement: n } = mn(e);
  if (!(n != null && n.nodeName))
    return null;
  if (Co(n) && n.contentDocument)
    return So(n.contentDocument.body, t);
  if (t) {
    const r = n.getAttribute("aria-activedescendant");
    if (r) {
      const o = mn(n).getElementById(r);
      if (o)
        return o;
    }
  }
  return n;
}
Xe(So, "getActiveElement");
function Co(e) {
  return e.tagName === "IFRAME";
}
Xe(Co, "isFrame");
var Cc = Object.defineProperty, In = (e, t) => Cc(e, "name", { value: t, configurable: !0 });
function hn(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
In(hn, "setRef");
function Po(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const s = hn(o, t);
      return !n && typeof s == "function" && (n = !0), s;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const s = r[o];
          typeof s == "function" ? s() : hn(e[o], null);
        }
      };
  };
}
In(Po, "composeRefs");
function Ze(...e) {
  return c.useCallback(Po(...e), e);
}
In(Ze, "useComposedRefs");
var Pc = Object.defineProperty, X = (e, t) => Pc(e, "name", { value: t, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Rc(e, t) {
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
X(Rc, "createContext");
// @__NO_SIDE_EFFECTS__
function Ro(e, t = []) {
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
  return o.scopeName = e, [r, Oo(o, ...t)];
}
X(Ro, "createContextScope");
function Oo(...e) {
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
X(Oo, "composeContextScopes");
var Oc = Object.defineProperty, Q = (e, t) => Oc(e, "name", { value: t, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Mn(e) {
  const t = c.forwardRef((n, r) => {
    let { children: o, ...s } = n, i = null, a = !1;
    const l = [];
    gn(o) && typeof Et == "function" && (o = Et(o._payload)), c.Children.forEach(o, (p) => {
      var h;
      if ($o(p)) {
        a = !0;
        const g = p;
        let m = "child" in g.props ? g.props.child : g.props.children;
        gn(m) && typeof Et == "function" && (m = Et(m._payload)), i = kc(g, m), l.push((h = i == null ? void 0 : i.props) == null ? void 0 : h.children);
      } else
        l.push(p);
    }), i ? i = c.cloneElement(i, void 0, l) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && c.Children.count(o) === 1 && c.isValidElement(o) && (i = o)
    );
    const f = i ? _o(i) : void 0, d = Ze(r, f);
    if (!i) {
      if (o || o === 0)
        throw new Error(
          a ? Dc(e) : $c(e)
        );
      return o;
    }
    const u = ko(s, i.props ?? {});
    return i.type !== c.Fragment && (u.ref = r ? d : f), c.cloneElement(i, u);
  });
  return t.displayName = `${e}.Slot`, t;
}
Q(Mn, "createSlot");
var Ao = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function Ac(e) {
  const t = /* @__PURE__ */ Q((n) => "child" in n ? n.children(n.child) : n.children, "Slottable");
  return t.displayName = `${e}.Slottable`, t.__radixId = Ao, t;
}
Q(Ac, "createSlottable");
var kc = /* @__PURE__ */ Q((e, t) => {
  if ("child" in e.props) {
    const n = e.props.child;
    return c.isValidElement(n) ? c.cloneElement(n, void 0, e.props.children(n.props.children)) : null;
  }
  return c.isValidElement(t) ? t : null;
}, "getSlottableElementFromSlottable");
function ko(e, t) {
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
Q(ko, "mergeProps");
function _o(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
Q(_o, "getElementRef");
function $o(e) {
  return c.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Ao;
}
Q($o, "isSlottable");
var _c = Symbol.for("react.lazy");
function gn(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === _c && "_payload" in e && Do(e._payload);
}
Q(gn, "isLazyComponent");
function Do(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
Q(Do, "isPromiseLike");
var $c = /* @__PURE__ */ Q((e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), Dc = /* @__PURE__ */ Q((e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Et = ce[" use ".trim().toString()], Nc = Object.defineProperty, Tc = (e, t) => Nc(e, "name", { value: t, configurable: !0 }), Lc = [
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
], jt = Lc.reduce((e, t) => {
  const n = /* @__PURE__ */ Mn(`Primitive.${t}`), r = c.forwardRef((o, s) => {
    const { asChild: i, ...a } = o, l = i ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ A.jsx(l, { ...a, ref: s });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function No(e, t) {
  e && Le.flushSync(() => e.dispatchEvent(t));
}
Tc(No, "dispatchDiscreteCustomEvent");
var Ic = Object.defineProperty, Mc = (e, t) => Ic(e, "name", { value: t, configurable: !0 });
function Ye(e) {
  const t = c.useRef(e);
  return c.useEffect(() => {
    t.current = e;
  }), c.useMemo(() => (...n) => {
    var r;
    return (r = t.current) == null ? void 0 : r.call(t, ...n);
  }, []);
}
Mc(Ye, "useCallbackRef");
var Fc = Object.defineProperty, U = (e, t) => Fc(e, "name", { value: t, configurable: !0 }), vn = "dismissableLayer.update", jc = "dismissableLayer.pointerDownOutside", Wc = "dismissableLayer.focusOutside", Sr, To = c.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set(),
  // Outside elements that belong to a layer's own dismiss affordance (eg, a
  // dialog overlay). Pressing them should dismiss the layer regardless of
  // whether or not they stop propagation.
  //
  // See https://github.com/radix-ui/primitives/issues/3346
  dismissableSurfaces: /* @__PURE__ */ new Set()
}), zc = /* @__PURE__ */ c.forwardRef(
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
    } = t, u = c.useContext(To), [p, h] = c.useState(null), g = (p == null ? void 0 : p.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, m] = c.useState({}), v = Ze(n, h), b = Array.from(u.layers), [w] = [
      ...u.layersWithOutsidePointerEventsDisabled
    ].slice(-1), y = w ? b.indexOf(w) : -1, x = p ? b.indexOf(p) : -1, S = u.layersWithOutsidePointerEventsDisabled.size > 0, C = x >= y, k = c.useRef(!1), E = Lo(
      ($) => {
        i == null || i($), l == null || l($), $.defaultPrevented || f == null || f();
      },
      {
        ownerDocument: g,
        deferPointerDownOutside: o,
        isDeferredPointerDownOutsideRef: k,
        dismissableSurfaces: u.dismissableSurfaces,
        shouldHandlePointerDownOutside: c.useCallback(
          ($) => {
            if (!($ instanceof Node))
              return !1;
            const F = [...u.branches].some(
              (M) => M.contains($)
            );
            return C && !F;
          },
          [u.branches, C]
        )
      }
    ), D = Io(($) => {
      if (o && k.current)
        return;
      const F = $.target;
      [...u.branches].some((z) => z.contains(F)) || (a == null || a($), l == null || l($), $.defaultPrevented || f == null || f());
    }, g), L = p ? x === b.length - 1 : !1, _ = Ye(($) => {
      $.key === "Escape" && (s == null || s($), !$.defaultPrevented && f && ($.preventDefault(), f()));
    });
    return c.useEffect(() => {
      if (L)
        return g.addEventListener("keydown", _, { capture: !0 }), () => g.removeEventListener("keydown", _, { capture: !0 });
    }, [g, L, _]), c.useEffect(() => {
      if (p)
        return r && (u.layersWithOutsidePointerEventsDisabled.size === 0 && (Sr = g.body.style.pointerEvents, g.body.style.pointerEvents = "none"), u.layersWithOutsidePointerEventsDisabled.add(p)), u.layers.add(p), bn(), () => {
          r && (u.layersWithOutsidePointerEventsDisabled.delete(p), u.layersWithOutsidePointerEventsDisabled.size === 0 && (g.body.style.pointerEvents = Sr));
        };
    }, [p, g, r, u]), c.useEffect(() => () => {
      p && (u.layers.delete(p), u.layersWithOutsidePointerEventsDisabled.delete(p), bn());
    }, [p, u]), c.useEffect(() => {
      const $ = /* @__PURE__ */ U(() => m({}), "handleUpdate");
      return document.addEventListener(vn, $), () => document.removeEventListener(vn, $);
    }, []), /* @__PURE__ */ A.jsx(
      jt.div,
      {
        ...d,
        ref: v,
        style: {
          pointerEvents: S ? C ? "auto" : "none" : void 0,
          ...t.style
        },
        onFocusCapture: Ee(t.onFocusCapture, D.onFocusCapture),
        onBlurCapture: Ee(t.onBlurCapture, D.onBlurCapture),
        onPointerDownCapture: Ee(
          t.onPointerDownCapture,
          E.onPointerDownCapture
        )
      }
    );
  }, "DismissableLayer")
);
function Vc() {
  const e = c.useContext(To), [t, n] = c.useState(null);
  return c.useEffect(() => {
    if (t)
      return e.dismissableSurfaces.add(t), () => {
        e.dismissableSurfaces.delete(t);
      };
  }, [t, e.dismissableSurfaces]), n;
}
U(Vc, "useDismissableLayerSurface");
var Bc = /* @__PURE__ */ U(() => !0, "IS_TRUE");
function Lo(e, t) {
  const {
    ownerDocument: n = globalThis == null ? void 0 : globalThis.document,
    deferPointerDownOutside: r = !1,
    isDeferredPointerDownOutsideRef: o,
    dismissableSurfaces: s,
    shouldHandlePointerDownOutside: i = Bc
  } = t, a = Ye(e), l = c.useRef(!1), f = c.useRef(!1), d = c.useRef(/* @__PURE__ */ new Map()), u = c.useRef(() => {
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
      x instanceof Node && [...s].some((C) => C.contains(x)) || d.current.set(y.type, !0), y.type === "click" && window.setTimeout(() => {
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
          const C = h();
          p(), C || Fn(
            jc,
            a,
            S,
            { discrete: !0 }
          );
        };
        if (U(x, "handleAndDispatchPointerDownOutsideEvent"), !i(y.target)) {
          n.removeEventListener("click", u.current), p(), l.current = !1;
          return;
        }
        const S = { originalEvent: y };
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
U(Lo, "usePointerDownOutside");
function Io(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = Ye(e), r = c.useRef(!1);
  return c.useEffect(() => {
    const o = /* @__PURE__ */ U((s) => {
      s.target && !r.current && Fn(Wc, n, { originalEvent: s }, {
        discrete: !1
      });
    }, "handleFocus");
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, n]), {
    onFocusCapture: /* @__PURE__ */ U(() => r.current = !0, "onFocusCapture"),
    onBlurCapture: /* @__PURE__ */ U(() => r.current = !1, "onBlurCapture")
  };
}
U(Io, "useFocusOutside");
function bn() {
  const e = new CustomEvent(vn);
  document.dispatchEvent(e);
}
U(bn, "dispatchUpdate");
function Fn(e, t, n, { discrete: r }) {
  const o = n.originalEvent.target, s = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && o.addEventListener(e, t, { once: !0 }), r ? No(o, s) : o.dispatchEvent(s);
}
U(Fn, "handleAndDispatchCustomEvent");
var Uc = Object.defineProperty, jn = (e, t) => Uc(e, "name", { value: t, configurable: !0 }), St = 0, re = null;
function Hc(e) {
  return Wn(), e.children;
}
jn(Hc, "FocusGuards");
function Wn() {
  c.useEffect(() => {
    re || (re = { start: yn(), end: yn() });
    const { start: e, end: t } = re;
    return document.body.firstElementChild !== e && document.body.insertAdjacentElement("afterbegin", e), document.body.lastElementChild !== t && document.body.insertAdjacentElement("beforeend", t), St++, () => {
      St === 1 && (re == null || re.start.remove(), re == null || re.end.remove(), re = null), St = Math.max(0, St - 1);
    };
  }, []);
}
jn(Wn, "useFocusGuards");
function yn() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
jn(yn, "createFocusGuard");
var Gc = Object.defineProperty, Y = (e, t) => Gc(e, "name", { value: t, configurable: !0 }), rn = "focusScope.autoFocusOnMount", on = "focusScope.autoFocusOnUnmount", Cr = { bubbles: !1, cancelable: !0 }, Yc = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ Y(function(t, n) {
    const {
      loop: r = !1,
      trapped: o = !1,
      onMountAutoFocus: s,
      onUnmountAutoFocus: i,
      ...a
    } = t, [l, f] = c.useState(null), d = Ye(s), u = Ye(i), p = c.useRef(null), h = Ze(n, f), g = c.useRef({
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
          const S = x.target;
          l.contains(S) ? p.current = S : ue(p.current, { select: !0 });
        }, b = function(x) {
          if (g.paused || !l) return;
          const S = x.relatedTarget;
          S !== null && (l.contains(S) || ue(p.current, { select: !0 }));
        }, w = function(x) {
          if (document.activeElement === document.body)
            for (const C of x)
              C.removedNodes.length > 0 && ue(l);
        };
        Y(v, "handleFocusIn"), Y(b, "handleFocusOut"), Y(w, "handleMutations"), document.addEventListener("focusin", v), document.addEventListener("focusout", b);
        const y = new MutationObserver(w);
        return l && y.observe(l, { childList: !0, subtree: !0 }), () => {
          document.removeEventListener("focusin", v), document.removeEventListener("focusout", b), y.disconnect();
        };
      }
    }, [o, l, g.paused]), c.useEffect(() => {
      if (l) {
        Pr.add(g);
        const v = document.activeElement;
        if (!l.contains(v)) {
          const w = new CustomEvent(rn, Cr);
          l.addEventListener(rn, d), l.dispatchEvent(w), w.defaultPrevented || (Mo(Vo(zn(l)), { select: !0 }), document.activeElement === v && ue(l));
        }
        return () => {
          l.removeEventListener(rn, d), setTimeout(() => {
            const w = new CustomEvent(on, Cr);
            l.addEventListener(on, u), l.dispatchEvent(w), w.defaultPrevented || ue(v ?? document.body, { select: !0 }), l.removeEventListener(on, u), Pr.remove(g);
          }, 0);
        };
      }
    }, [l, d, u, g]);
    const m = c.useCallback(
      (v) => {
        if (!r && !o || g.paused) return;
        const b = v.key === "Tab" && !v.altKey && !v.ctrlKey && !v.metaKey, w = document.activeElement;
        if (b && w) {
          const y = v.currentTarget, [x, S] = Fo(y);
          x && S ? !v.shiftKey && w === S ? (v.preventDefault(), r && ue(x, { select: !0 })) : v.shiftKey && w === x && (v.preventDefault(), r && ue(S, { select: !0 })) : w === y && v.preventDefault();
        }
      },
      [r, o, g.paused]
    );
    return /* @__PURE__ */ A.jsx(jt.div, { tabIndex: -1, ...a, ref: h, onKeyDown: m });
  }, "FocusScope")
);
function Mo(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const r of e)
    if (ue(r, { select: t }), document.activeElement !== n) return;
}
Y(Mo, "focusFirst");
function Fo(e) {
  const t = zn(e), n = wn(t, e), r = wn(t.reverse(), e);
  return [n, r];
}
Y(Fo, "getTabbableEdges");
function zn(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: /* @__PURE__ */ Y((r) => {
      const o = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || o ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }, "acceptNode")
  });
  for (; n.nextNode(); ) t.push(n.currentNode);
  return t;
}
Y(zn, "getTabbableCandidates");
function wn(e, t) {
  const n = typeof t.checkVisibility == "function" && t.checkVisibility({ checkVisibilityCSS: !0 });
  for (const r of e)
    if (!(n ? !r.checkVisibility({ checkVisibilityCSS: !0 }) : jo(r, { upTo: t })))
      return r;
}
Y(wn, "findVisible");
function jo(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
Y(jo, "isHidden");
function Wo(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
Y(Wo, "isSelectableInput");
function ue(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && Wo(e) && t && e.select();
  }
}
Y(ue, "focus");
var Pr = zo();
function zo() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && (n == null || n.pause()), e = xn(e, t), e.unshift(t);
    },
    remove(t) {
      var n;
      e = xn(e, t), (n = e[0]) == null || n.resume();
    }
  };
}
Y(zo, "createFocusScopesStack");
function xn(e, t) {
  const n = [...e], r = n.indexOf(t);
  return r !== -1 && n.splice(r, 1), n;
}
Y(xn, "arrayRemove");
function Vo(e) {
  return e.filter((t) => t.tagName !== "A");
}
Y(Vo, "removeLinks");
var Ke = globalThis != null && globalThis.document ? c.useLayoutEffect : () => {
}, Kc = Object.defineProperty, Xc = (e, t) => Kc(e, "name", { value: t, configurable: !0 }), Zc = ce[" useId ".trim().toString()] || (() => {
}), qc = 0;
function Bo(e) {
  const [t, n] = c.useState(Zc());
  return Ke(() => {
    e || n((r) => r ?? String(qc++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
Xc(Bo, "useId");
const Qc = ["top", "right", "bottom", "left"], Se = Math.min, fe = Math.max, Dt = Math.round, Ct = Math.floor, de = (e) => ({
  x: e,
  y: e
}), Jc = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function Uo(e, t, n) {
  return fe(e, Se(t, n));
}
function me(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function Ce(e) {
  return e.split("-")[0];
}
function qe(e) {
  return e.split("-")[1];
}
function Vn(e) {
  return e === "x" ? "y" : "x";
}
function Bn(e) {
  return e === "y" ? "height" : "width";
}
function se(e) {
  const t = e[0];
  return t === "t" || t === "b" ? "y" : "x";
}
function Un(e) {
  return Vn(se(e));
}
function el(e, t, n) {
  n === void 0 && (n = !1);
  const r = qe(e), o = Un(e), s = Bn(o);
  let i = o === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return t.reference[s] > t.floating[s] && (i = Nt(i)), [i, Nt(i)];
}
function tl(e) {
  const t = Nt(e);
  return [En(e), t, En(t)];
}
function En(e) {
  return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
const Rr = ["left", "right"], Or = ["right", "left"], nl = ["top", "bottom"], rl = ["bottom", "top"];
function ol(e, t, n) {
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? Or : Rr : t ? Rr : Or;
    case "left":
    case "right":
      return t ? nl : rl;
    default:
      return [];
  }
}
function sl(e, t, n, r) {
  const o = qe(e);
  let s = ol(Ce(e), n === "start", r);
  return o && (s = s.map((i) => i + "-" + o), t && (s = s.concat(s.map(En)))), s;
}
function Nt(e) {
  const t = Ce(e);
  return Jc[t] + e.slice(t.length);
}
function il(e) {
  var t, n, r, o;
  return {
    top: (t = e.top) != null ? t : 0,
    right: (n = e.right) != null ? n : 0,
    bottom: (r = e.bottom) != null ? r : 0,
    left: (o = e.left) != null ? o : 0
  };
}
function Ho(e) {
  return typeof e != "number" ? il(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function Tt(e) {
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
function Ar(e, t, n) {
  let {
    reference: r,
    floating: o
  } = e;
  const s = se(t), i = Un(t), a = Bn(i), l = Ce(t), f = s === "y", d = r.x + r.width / 2 - o.width / 2, u = r.y + r.height / 2 - o.height / 2, p = r[a] / 2 - o[a] / 2;
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
  const g = qe(t);
  return g && (h[i] += p * (g === "end" ? 1 : -1) * (n && f ? -1 : 1)), h;
}
async function al(e, t) {
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
  } = me(t, e), g = Ho(h), v = a[p ? u === "floating" ? "reference" : "floating" : u], b = Tt(await s.getClippingRect({
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
  }, S = Tt(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: w,
    offsetParent: y,
    strategy: l
  }) : w);
  return {
    top: (b.top - S.top + g.top) / x.y,
    bottom: (S.bottom - b.bottom + g.bottom) / x.y,
    left: (b.left - S.left + g.left) / x.x,
    right: (S.right - b.right + g.right) / x.x
  };
}
const cl = 50, ll = async (e, t, n) => {
  const {
    placement: r = "bottom",
    strategy: o = "absolute",
    middleware: s = [],
    platform: i
  } = n, a = i.detectOverflow ? i : {
    ...i,
    detectOverflow: al
  }, l = await (i.isRTL == null ? void 0 : i.isRTL(t));
  let f = await i.getElementRects({
    reference: e,
    floating: t,
    strategy: o
  }), {
    x: d,
    y: u
  } = Ar(f, r, l), p = r, h = 0;
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
      data: S,
      reset: C
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
      ...S
    }, C && h < cl && (h++, typeof C == "object" && (C.placement && (p = C.placement), C.rects && (f = C.rects === !0 ? await i.getElementRects({
      reference: e,
      floating: t,
      strategy: o
    }) : C.rects), {
      x: d,
      y: u
    } = Ar(f, p, l)), m = -1);
  }
  return {
    x: d,
    y: u,
    placement: p,
    strategy: o,
    middlewareData: g
  };
}, ul = (e) => ({
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
    } = me(e, t) || {};
    if (f == null)
      return {};
    const u = Ho(d), p = {
      x: n,
      y: r
    }, h = Un(o), g = Bn(h), m = await i.getDimensions(f), v = h === "y", b = v ? "top" : "left", w = v ? "bottom" : "right", y = v ? "clientHeight" : "clientWidth", x = s.reference[g] + s.reference[h] - p[h] - s.floating[g], S = p[h] - s.reference[h], C = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(f));
    let k = C ? C[y] : 0;
    (!k || !await (i.isElement == null ? void 0 : i.isElement(C))) && (k = a.floating[y] || s.floating[g]);
    const E = x / 2 - S / 2, D = k / 2 - m[g] / 2 - 1, L = Se(u[b], D), _ = Se(u[w], D), $ = k - m[g] - _, F = k / 2 - m[g] / 2 + E, M = Uo(L, F, $), z = !l.arrow && qe(o) != null && F !== M && s.reference[g] / 2 - (F < L ? L : _) - m[g] / 2 < 0, I = z ? F < L ? F - L : F - $ : 0;
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
}), fl = function(e) {
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
      } = me(e, t);
      if ((n = s.arrow) != null && n.alignmentOffset)
        return {};
      const b = Ce(o), w = se(a), y = Ce(a) === a, x = await (l.isRTL == null ? void 0 : l.isRTL(f.floating)), S = p || (y || !m ? [Nt(a)] : tl(a)), C = g !== "none";
      !p && C && S.push(...sl(a, m, g, x));
      const k = [a, ...S], E = await l.detectOverflow(t, v), D = [];
      let L = ((r = s.flip) == null ? void 0 : r.overflows) || [];
      if (d && D.push(E[b]), u) {
        const M = el(o, i, x);
        D.push(E[M[0]], E[M[1]]);
      }
      if (L = [...L, {
        placement: o,
        overflows: D
      }], !D.every((M) => M <= 0)) {
        var _, $;
        const M = (((_ = s.flip) == null ? void 0 : _.index) || 0) + 1, z = k[M];
        if (z && (!(u === "alignment" ? w !== se(z) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        L.every((T) => se(T.placement) === w ? T.overflows[0] > 0 : !0)))
          return {
            data: {
              index: M,
              overflows: L
            },
            reset: {
              placement: z
            }
          };
        let I = ($ = L.filter((W) => W.overflows[0] <= 0).sort((W, T) => W.overflows[1] - T.overflows[1])[0]) == null ? void 0 : $.placement;
        if (!I)
          switch (h) {
            case "bestFit": {
              var F;
              const W = (F = L.filter((T) => {
                if (C) {
                  const j = se(T.placement);
                  return j === w || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  j === "y";
                }
                return !0;
              }).map((T) => [T.placement, T.overflows.filter((j) => j > 0).reduce((j, O) => j + O, 0)]).sort((T, j) => T[1] - j[1])[0]) == null ? void 0 : F[0];
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
function kr(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width
  };
}
function _r(e) {
  return Qc.some((t) => e[t] >= 0);
}
const dl = function(e) {
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
      } = me(e, t);
      switch (o) {
        case "referenceHidden": {
          const i = await r.detectOverflow(t, {
            ...s,
            elementContext: "reference"
          }), a = kr(i, n.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: _r(a)
            }
          };
        }
        case "escaped": {
          const i = await r.detectOverflow(t, {
            ...s,
            altBoundary: !0
          }), a = kr(i, n.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: _r(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Go = /* @__PURE__ */ new Set(["left", "top"]);
async function pl(e, t) {
  const {
    placement: n,
    platform: r,
    elements: o
  } = e, s = await (r.isRTL == null ? void 0 : r.isRTL(o.floating)), i = Ce(n), a = qe(n), l = se(n) === "y", f = Go.has(i) ? -1 : 1, d = s && l ? -1 : 1, u = me(t, e);
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
const ml = function(e) {
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
      } = t, l = await pl(t, e);
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
}, hl = function(e) {
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
      } = me(e, t), d = {
        x: n,
        y: r
      }, u = await s.detectOverflow(t, f), p = se(o), h = Vn(p);
      let g = d[h], m = d[p];
      const v = (w, y) => Uo(y + u[w === "y" ? "top" : "left"], y, y - u[w === "y" ? "bottom" : "right"]);
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
}, gl = function(e) {
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
      } = me(e, t), p = {
        x: o,
        y: s
      }, h = se(i), g = Vn(h);
      let m = p[g], v = p[h];
      const b = me(f, t), w = typeof b == "number" ? {
        mainAxis: b,
        crossAxis: 0
      } : {
        mainAxis: (n = b.mainAxis) != null ? n : 0,
        crossAxis: (r = b.crossAxis) != null ? r : 0
      };
      if (d) {
        const S = g === "y" ? "height" : "width", C = a.reference[g] - a.floating[S] + w.mainAxis, k = a.reference[g] + a.reference[S] - w.mainAxis;
        m < C ? m = C : m > k && (m = k);
      }
      if (u) {
        var y, x;
        const S = g === "y" ? "width" : "height", C = Go.has(Ce(i)), k = a.reference[h] - a.floating[S] + (C && ((y = l.offset) == null ? void 0 : y[h]) || 0) + (C ? 0 : w.crossAxis), E = a.reference[h] + a.reference[S] + (C ? 0 : ((x = l.offset) == null ? void 0 : x[h]) || 0) - (C ? w.crossAxis : 0);
        v < k ? v = k : v > E && (v = E);
      }
      return {
        [g]: m,
        [h]: v
      };
    }
  };
}, vl = function(e) {
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
      } = me(e, t), l = await o.detectOverflow(t, a), f = Ce(n), d = qe(n), u = se(n) === "y", {
        width: p,
        height: h
      } = r.floating;
      let g, m;
      f === "top" || f === "bottom" ? (g = f, m = d === (await (o.isRTL == null ? void 0 : o.isRTL(s.floating)) ? "start" : "end") ? "left" : "right") : (m = f, g = d === "end" ? "top" : "bottom");
      const v = h - l.top - l.bottom, b = p - l.left - l.right, w = Se(h - l[g], v), y = Se(p - l[m], b), x = t.middlewareData.shift, S = !x;
      let C = w, k = y;
      x != null && x.enabled.x && (k = b), x != null && x.enabled.y && (C = v), S && !d && (u ? k = p - 2 * fe(l.left, l.right) : C = h - 2 * fe(l.top, l.bottom)), await i({
        ...t,
        availableWidth: k,
        availableHeight: C
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
function Wt() {
  return typeof window < "u";
}
function Qe(e) {
  return Yo(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function K(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function ve(e) {
  var t;
  return (t = (Yo(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function Yo(e) {
  return Wt() ? e instanceof Node || e instanceof K(e).Node : !1;
}
function ie(e) {
  return Wt() ? e instanceof Element || e instanceof K(e).Element : !1;
}
function Re(e) {
  return Wt() ? e instanceof HTMLElement || e instanceof K(e).HTMLElement : !1;
}
function $r(e) {
  return !Wt() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof K(e).ShadowRoot;
}
function zt(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: r,
    display: o
  } = ae(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && o !== "inline" && o !== "contents";
}
function bl(e) {
  return /^(table|td|th)$/.test(Qe(e));
}
function Vt(e) {
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
const yl = /transform|translate|scale|rotate|perspective|filter/, wl = /paint|layout|strict|content/, De = (e) => !!e && e !== "none";
let sn;
function Hn(e) {
  const t = ie(e) ? ae(e) : e;
  return De(t.transform) || De(t.translate) || De(t.scale) || De(t.rotate) || De(t.perspective) || !Gn() && (De(t.backdropFilter) || De(t.filter)) || yl.test(t.willChange || "") || wl.test(t.contain || "");
}
function xl(e) {
  let t = Ne(e);
  for (; Re(t) && !ct(t); ) {
    if (Hn(t))
      return t;
    if (Vt(t))
      return null;
    t = Ne(t);
  }
  return null;
}
function Gn() {
  return sn == null && (sn = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), sn;
}
function ct(e) {
  return /^(html|body|#document)$/.test(Qe(e));
}
function ae(e) {
  return K(e).getComputedStyle(e);
}
function Bt(e) {
  return ie(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function Ne(e) {
  if (Qe(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    $r(e) && e.host || // Fallback.
    ve(e)
  );
  return $r(t) ? t.host : t;
}
function Ko(e) {
  const t = Ne(e);
  return ct(t) ? (e.ownerDocument || e).body : Re(t) && zt(t) ? t : Ko(t);
}
function lt(e, t, n) {
  var r;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const o = Ko(e), s = o === ((r = e.ownerDocument) == null ? void 0 : r.body), i = K(o);
  if (s) {
    const a = Sn(i);
    return t.concat(i, i.visualViewport || [], zt(o) ? o : [], a && n ? lt(a) : []);
  } else
    return t.concat(o, lt(o, [], n));
}
function Sn(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Xo(e) {
  const t = ae(e);
  let n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0;
  const o = Re(e), s = o ? e.offsetWidth : n, i = o ? e.offsetHeight : r, a = Dt(n) !== s || Dt(r) !== i;
  return a && (n = s, r = i), {
    width: n,
    height: r,
    $: a
  };
}
function Yn(e) {
  return ie(e) ? e : e.contextElement;
}
function He(e) {
  const t = Yn(e);
  if (!Re(t))
    return de(1);
  const n = t.getBoundingClientRect(), {
    width: r,
    height: o,
    $: s
  } = Xo(t);
  let i = (s ? Dt(n.width) : n.width) / r, a = (s ? Dt(n.height) : n.height) / o;
  return (!i || !Number.isFinite(i)) && (i = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: i,
    y: a
  };
}
const El = /* @__PURE__ */ de(0);
function Zo(e) {
  const t = K(e);
  return !Gn() || !t.visualViewport ? El : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function Sl(e, t, n) {
  return t === void 0 && (t = !1), !!n && t && n === K(e);
}
function Te(e, t, n, r) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const o = e.getBoundingClientRect(), s = Yn(e);
  let i = de(1);
  t && (r ? ie(r) && (i = He(r)) : i = He(e));
  const a = Sl(s, n, r) ? Zo(s) : de(0);
  let l = (o.left + a.x) / i.x, f = (o.top + a.y) / i.y, d = o.width / i.x, u = o.height / i.y;
  if (s && r) {
    const p = K(s), h = ie(r) ? K(r) : r;
    let g = p, m = Sn(g);
    for (; m && h !== g; ) {
      const v = He(m), b = m.getBoundingClientRect(), w = ae(m), y = b.left + (m.clientLeft + parseFloat(w.paddingLeft)) * v.x, x = b.top + (m.clientTop + parseFloat(w.paddingTop)) * v.y;
      l *= v.x, f *= v.y, d *= v.x, u *= v.y, l += y, f += x, g = K(m), m = Sn(g);
    }
  }
  return Tt({
    width: d,
    height: u,
    x: l,
    y: f
  });
}
function Ut(e, t) {
  const n = Bt(e).scrollLeft;
  return t ? t.left + n : Te(ve(e)).left + n;
}
function qo(e, t) {
  const n = e.getBoundingClientRect(), r = n.left + t.scrollLeft - Ut(e, n), o = n.top + t.scrollTop;
  return {
    x: r,
    y: o
  };
}
function Cl(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: r,
    strategy: o
  } = e;
  const s = o === "fixed", i = ve(r), a = t ? Vt(t.floating) : !1;
  if (r === i || a && s)
    return n;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, f = de(1);
  const d = de(0), u = Re(r);
  if ((u || !s) && ((Qe(r) !== "body" || zt(i)) && (l = Bt(r)), u)) {
    const h = Te(r);
    f = He(r), d.x = h.x + r.clientLeft, d.y = h.y + r.clientTop;
  }
  const p = i && !u && !s ? qo(i, l) : de(0);
  return {
    width: n.width * f.x,
    height: n.height * f.y,
    x: n.x * f.x - l.scrollLeft * f.x + d.x + p.x,
    y: n.y * f.y - l.scrollTop * f.y + d.y + p.y
  };
}
function Pl(e) {
  return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function Rl(e) {
  const t = Bt(e), n = e.ownerDocument.body, r = fe(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), o = fe(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight);
  let s = -t.scrollLeft + Ut(e);
  const i = -t.scrollTop;
  return ae(n).direction === "rtl" && (s += fe(e.clientWidth, n.clientWidth) - r), {
    width: r,
    height: o,
    x: s,
    y: i
  };
}
const Ol = 25;
function Al(e, t, n) {
  n === void 0 && (n = "viewport");
  const r = n === "layoutViewport", o = K(e), s = ve(e), i = o.visualViewport;
  let a = s.clientWidth, l = s.clientHeight, f = 0, d = 0;
  if (i) {
    const p = !Gn() || t === "fixed";
    r ? p || (f = -i.offsetLeft, d = -i.offsetTop) : (a = i.width, l = i.height, p && (f = i.offsetLeft, d = i.offsetTop));
  }
  if (Ut(s) <= 0) {
    const p = s.ownerDocument, h = p.body, g = getComputedStyle(h), m = p.compatMode === "CSS1Compat" && parseFloat(g.marginLeft) + parseFloat(g.marginRight) || 0, v = Math.abs(s.clientWidth - h.clientWidth - m), b = getComputedStyle(s).scrollbarGutter === "stable both-edges" ? v / 2 : v;
    b <= Ol && (a -= b);
  }
  return {
    width: a,
    height: l,
    x: f,
    y: d
  };
}
function kl(e, t) {
  const n = Te(e, !0, t === "fixed"), r = n.top + e.clientTop, o = n.left + e.clientLeft, s = He(e), i = e.clientWidth * s.x, a = e.clientHeight * s.y, l = o * s.x, f = r * s.y;
  return {
    width: i,
    height: a,
    x: l,
    y: f
  };
}
function Dr(e, t, n) {
  let r;
  if (t === "viewport" || t === "layoutViewport")
    r = Al(e, n, t);
  else if (t === "document")
    r = Rl(ve(e));
  else if (ie(t))
    r = kl(t, n);
  else {
    const o = Zo(e);
    r = {
      x: t.x - o.x,
      y: t.y - o.y,
      width: t.width,
      height: t.height
    };
  }
  return Tt(r);
}
function _l(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let r = lt(e, [], !1).filter((a) => ie(a) && Qe(a) !== "body"), o = null;
  const s = ae(e).position === "fixed";
  let i = s ? Ne(e) : e;
  for (; ie(i) && !ct(i); ) {
    const a = ae(i), l = Hn(i), f = o ? o.position : s ? "fixed" : "";
    !l && (f === "fixed" || f === "absolute" && a.position === "static") ? r = r.filter((u) => u !== i) : o = a, i = Ne(i);
  }
  return t.set(e, r), r;
}
function $l(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: r,
    strategy: o
  } = e;
  const i = [...n === "clippingAncestors" ? Vt(t) ? [] : _l(t, this._c) : [].concat(n), r], a = Dr(t, i[0], o);
  let l = a.top, f = a.right, d = a.bottom, u = a.left;
  for (let p = 1; p < i.length; p++) {
    const h = Dr(t, i[p], o);
    l = fe(h.top, l), f = Se(h.right, f), d = Se(h.bottom, d), u = fe(h.left, u);
  }
  return {
    width: f - u,
    height: d - l,
    x: u,
    y: l
  };
}
function Dl(e) {
  const {
    width: t,
    height: n
  } = Xo(e);
  return {
    width: t,
    height: n
  };
}
function Nl(e, t, n) {
  const r = Re(t), o = ve(t), s = n === "fixed", i = Te(e, !0, s, t);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = de(0);
  if ((r || !s) && ((Qe(t) !== "body" || zt(o)) && (a = Bt(t)), r)) {
    const p = Te(t, !0, s, t);
    l.x = p.x + t.clientLeft, l.y = p.y + t.clientTop;
  }
  !r && o && (l.x = Ut(o));
  const f = o && !r && !s ? qo(o, a) : de(0), d = i.left + a.scrollLeft - l.x - f.x, u = i.top + a.scrollTop - l.y - f.y;
  return {
    x: d,
    y: u,
    width: i.width,
    height: i.height
  };
}
function an(e) {
  return ae(e).position === "static";
}
function Nr(e, t) {
  if (!Re(e) || ae(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return ve(e) === n && (n = n.ownerDocument.body), n;
}
function Qo(e, t) {
  const n = K(e);
  if (Vt(e))
    return n;
  if (!Re(e)) {
    let o = Ne(e);
    for (; o && !ct(o); ) {
      if (ie(o) && !an(o))
        return o;
      o = Ne(o);
    }
    return n;
  }
  let r = Nr(e, t);
  for (; r && bl(r) && an(r); )
    r = Nr(r, t);
  return r && ct(r) && an(r) && !Hn(r) ? n : r || xl(e) || n;
}
const Tl = async function(e) {
  const t = this.getOffsetParent || Qo, n = this.getDimensions, r = await n(e.floating);
  return {
    reference: Nl(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function Ll(e) {
  return ae(e).direction === "rtl";
}
const Il = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Cl,
  getDocumentElement: ve,
  getClippingRect: $l,
  getOffsetParent: Qo,
  getElementRects: Tl,
  getClientRects: Pl,
  getDimensions: Dl,
  getScale: He,
  isElement: ie,
  isRTL: Ll
};
function Jo(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Ml(e, t, n) {
  let r = null, o;
  const s = ve(e);
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
    const b = Ct(g), w = Ct(s.clientWidth - (h + m)), y = Ct(s.clientHeight - (g + v)), x = Ct(h), C = {
      rootMargin: -b + "px " + -w + "px " + -y + "px " + -x + "px",
      threshold: fe(0, Se(1, u)) || 1
    };
    let k = !0;
    function E(D) {
      const L = D[0].intersectionRatio;
      if (!Jo(p, e.getBoundingClientRect()))
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
        ...C,
        // Handle <iframe>s
        root: s.ownerDocument
      });
    } catch {
      r = new IntersectionObserver(E, C);
    }
    r.observe(e);
  }
  const l = K(e), f = () => a(n);
  return l.addEventListener("resize", f), a(!0), () => {
    l.removeEventListener("resize", f), i();
  };
}
function Fl(e, t, n, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: o = !0,
    ancestorResize: s = !0,
    elementResize: i = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = r, f = Yn(e), d = o || s ? [...f ? lt(f) : [], ...t ? lt(t) : []] : [];
  d.forEach((b) => {
    o && b.addEventListener("scroll", n), s && b.addEventListener("resize", n);
  });
  const u = f && a ? Ml(f, n, s) : null;
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
    m && !Jo(m, b) && n(), m = b, g = requestAnimationFrame(v);
  }
  return n(), () => {
    var b;
    d.forEach((w) => {
      o && w.removeEventListener("scroll", n), s && w.removeEventListener("resize", n);
    }), u == null || u(), (b = h) == null || b.disconnect(), h = null, l && cancelAnimationFrame(g);
  };
}
const jl = ml, Wl = hl, zl = fl, Vl = vl, Bl = dl, Tr = ul, Ul = gl, Hl = (e, t, n) => {
  const r = /* @__PURE__ */ new Map(), o = n ?? {}, s = {
    ...Il,
    ...o.platform,
    _c: r
  };
  return ll(e, t, {
    ...o,
    platform: s
  });
};
var Gl = typeof document < "u", Yl = function() {
}, kt = Gl ? c.useLayoutEffect : Yl;
function Lt(e, t) {
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
        if (!Lt(e[r], t[r]))
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
      if (!(s === "_owner" && e.$$typeof) && !Lt(e[s], t[s]))
        return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function es(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Lr(e, t) {
  const n = es(e);
  return Math.round(t * n) / n;
}
function cn(e) {
  const t = c.useRef(e);
  return kt(() => {
    t.current = e;
  }), t;
}
function Kl(e) {
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
  Lt(p, r) || h(r);
  const [g, m] = c.useState(null), [v, b] = c.useState(null), w = c.useCallback((T) => {
    T !== C.current && (C.current = T, m(T));
  }, []), y = c.useCallback((T) => {
    T !== k.current && (k.current = T, b(T));
  }, []), x = s || g, S = i || v, C = c.useRef(null), k = c.useRef(null), E = c.useRef(d), D = l != null, L = cn(l), _ = cn(o), $ = cn(f), F = c.useCallback(() => {
    if (!C.current || !k.current)
      return;
    const T = {
      placement: t,
      strategy: n,
      middleware: p
    };
    _.current && (T.platform = _.current), Hl(C.current, k.current, T).then((j) => {
      const O = {
        ...j,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: $.current !== !1
      };
      M.current && !Lt(E.current, O) && (E.current = O, Le.flushSync(() => {
        u(O);
      }));
    });
  }, [p, t, n, _, $]);
  kt(() => {
    f === !1 && E.current.isPositioned && (E.current.isPositioned = !1, u((T) => ({
      ...T,
      isPositioned: !1
    })));
  }, [f]);
  const M = c.useRef(!1);
  kt(() => (M.current = !0, () => {
    M.current = !1;
  }), []), kt(() => {
    if (x && (C.current = x), S && (k.current = S), x && S) {
      if (L.current)
        return L.current(x, S, F);
      F();
    }
  }, [x, S, F, L, D]);
  const z = c.useMemo(() => ({
    reference: C,
    floating: k,
    setReference: w,
    setFloating: y
  }), [w, y]), I = c.useMemo(() => ({
    reference: x,
    floating: S
  }), [x, S]), W = c.useMemo(() => {
    const T = {
      position: n,
      left: 0,
      top: 0
    };
    if (!I.floating)
      return T;
    const j = Lr(I.floating, d.x), O = Lr(I.floating, d.y);
    return a ? {
      ...T,
      transform: "translate(" + j + "px, " + O + "px)",
      ...es(I.floating) >= 1.5 && {
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
const Xl = (e) => {
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
      return r && t(r) ? r.current != null ? Tr({
        element: r.current,
        padding: o
      }).fn(n) : {} : r ? Tr({
        element: r,
        padding: o
      }).fn(n) : {};
    }
  };
}, Zl = (e, t) => {
  const n = jl(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, ql = (e, t) => {
  const n = Wl(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, Ql = (e, t) => ({
  fn: Ul(e).fn,
  options: [e, t]
}), Jl = (e, t) => {
  const n = zl(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, eu = (e, t) => {
  const n = Vl(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, tu = (e, t) => {
  const n = Bl(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
}, nu = (e, t) => {
  const n = Xl(e);
  return {
    name: n.name,
    fn: n.fn,
    options: [e, t]
  };
};
var ru = Object.defineProperty, Kn = (e, t) => ru(e, "name", { value: t, configurable: !0 });
function Cn(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
Kn(Cn, "setRef");
function ts(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const s = Cn(o, t);
      return !n && typeof s == "function" && (n = !0), s;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const s = r[o];
          typeof s == "function" ? s() : Cn(e[o], null);
        }
      };
  };
}
Kn(ts, "composeRefs");
function ns(...e) {
  return c.useCallback(ts(...e), e);
}
Kn(ns, "useComposedRefs");
var ou = Object.defineProperty, J = (e, t) => ou(e, "name", { value: t, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function rs(e) {
  const t = c.forwardRef((n, r) => {
    let { children: o, ...s } = n, i = null, a = !1;
    const l = [];
    Pn(o) && typeof Pt == "function" && (o = Pt(o._payload)), c.Children.forEach(o, (p) => {
      var h;
      if (as(p)) {
        a = !0;
        const g = p;
        let m = "child" in g.props ? g.props.child : g.props.children;
        Pn(m) && typeof Pt == "function" && (m = Pt(m._payload)), i = iu(g, m), l.push((h = i == null ? void 0 : i.props) == null ? void 0 : h.children);
      } else
        l.push(p);
    }), i ? i = c.cloneElement(i, void 0, l) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && c.Children.count(o) === 1 && c.isValidElement(o) && (i = o)
    );
    const f = i ? is(i) : void 0, d = ns(r, f);
    if (!i) {
      if (o || o === 0)
        throw new Error(
          a ? lu(e) : cu(e)
        );
      return o;
    }
    const u = ss(s, i.props ?? {});
    return i.type !== c.Fragment && (u.ref = r ? d : f), c.cloneElement(i, u);
  });
  return t.displayName = `${e}.Slot`, t;
}
J(rs, "createSlot");
var os = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function su(e) {
  const t = /* @__PURE__ */ J((n) => "child" in n ? n.children(n.child) : n.children, "Slottable");
  return t.displayName = `${e}.Slottable`, t.__radixId = os, t;
}
J(su, "createSlottable");
var iu = /* @__PURE__ */ J((e, t) => {
  if ("child" in e.props) {
    const n = e.props.child;
    return c.isValidElement(n) ? c.cloneElement(n, void 0, e.props.children(n.props.children)) : null;
  }
  return c.isValidElement(t) ? t : null;
}, "getSlottableElementFromSlottable");
function ss(e, t) {
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
J(ss, "mergeProps");
function is(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
J(is, "getElementRef");
function as(e) {
  return c.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === os;
}
J(as, "isSlottable");
var au = Symbol.for("react.lazy");
function Pn(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === au && "_payload" in e && cs(e._payload);
}
J(Pn, "isLazyComponent");
function cs(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
J(cs, "isPromiseLike");
var cu = /* @__PURE__ */ J((e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), lu = /* @__PURE__ */ J((e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Pt = ce[" use ".trim().toString()], uu = Object.defineProperty, fu = (e, t) => uu(e, "name", { value: t, configurable: !0 }), du = [
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
], pu = du.reduce((e, t) => {
  const n = /* @__PURE__ */ rs(`Primitive.${t}`), r = c.forwardRef((o, s) => {
    const { asChild: i, ...a } = o, l = i ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ A.jsx(l, { ...a, ref: s });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function mu(e, t) {
  e && Le.flushSync(() => e.dispatchEvent(t));
}
fu(mu, "dispatchDiscreteCustomEvent");
var hu = Object.defineProperty, gu = (e, t) => hu(e, "name", { value: t, configurable: !0 }), vu = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ gu(function(t, n) {
    const { children: r, width: o = 10, height: s = 5, ...i } = t;
    return /* @__PURE__ */ A.jsx(
      pu.svg,
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
), bu = vu, yu = Object.defineProperty, Xn = (e, t) => yu(e, "name", { value: t, configurable: !0 });
function Rn(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
Xn(Rn, "setRef");
function ls(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const s = Rn(o, t);
      return !n && typeof s == "function" && (n = !0), s;
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const s = r[o];
          typeof s == "function" ? s() : Rn(e[o], null);
        }
      };
  };
}
Xn(ls, "composeRefs");
function Ht(...e) {
  return c.useCallback(ls(...e), e);
}
Xn(Ht, "useComposedRefs");
var wu = Object.defineProperty, Z = (e, t) => wu(e, "name", { value: t, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function xu(e, t) {
  const n = c.createContext(t);
  n.displayName = e + "Context";
  const r = /* @__PURE__ */ Z((s) => {
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
  return Z(o, "useContext"), [r, o];
}
Z(xu, "createContext");
// @__NO_SIDE_EFFECTS__
function us(e, t = []) {
  let n = [];
  function r(s, i) {
    const a = c.createContext(i);
    a.displayName = s + "Context";
    const l = n.length;
    n = [...n, i];
    const f = /* @__PURE__ */ Z((u) => {
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
    return Z(d, "useContext"), [f, d];
  }
  Z(r, "createContext");
  const o = /* @__PURE__ */ Z(() => {
    const s = n.map((i) => c.createContext(i));
    return /* @__PURE__ */ Z(function(a) {
      const l = (a == null ? void 0 : a[e]) || s;
      return c.useMemo(
        () => ({ [`__scope${e}`]: { ...a, [e]: l } }),
        [a, l]
      );
    }, "useScope");
  }, "createScope");
  return o.scopeName = e, [r, fs(o, ...t)];
}
Z(us, "createContextScope");
function fs(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = /* @__PURE__ */ Z(() => {
    const r = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return /* @__PURE__ */ Z(function(s) {
      const i = r.reduce((a, { useScope: l, scopeName: f }) => {
        const u = l(s)[`__scope${f}`];
        return { ...a, ...u };
      }, {});
      return c.useMemo(() => ({ [`__scope${t.scopeName}`]: i }), [i]);
    }, "useComposedScopes");
  }, "createScope");
  return n.scopeName = t.scopeName, n;
}
Z(fs, "composeContextScopes");
var Eu = Object.defineProperty, ee = (e, t) => Eu(e, "name", { value: t, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function ds(e) {
  const t = c.forwardRef((n, r) => {
    let { children: o, ...s } = n, i = null, a = !1;
    const l = [];
    On(o) && typeof Rt == "function" && (o = Rt(o._payload)), c.Children.forEach(o, (p) => {
      var h;
      if (gs(p)) {
        a = !0;
        const g = p;
        let m = "child" in g.props ? g.props.child : g.props.children;
        On(m) && typeof Rt == "function" && (m = Rt(m._payload)), i = Cu(g, m), l.push((h = i == null ? void 0 : i.props) == null ? void 0 : h.children);
      } else
        l.push(p);
    }), i ? i = c.cloneElement(i, void 0, l) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !a && c.Children.count(o) === 1 && c.isValidElement(o) && (i = o)
    );
    const f = i ? hs(i) : void 0, d = Ht(r, f);
    if (!i) {
      if (o || o === 0)
        throw new Error(
          a ? Ou(e) : Ru(e)
        );
      return o;
    }
    const u = ms(s, i.props ?? {});
    return i.type !== c.Fragment && (u.ref = r ? d : f), c.cloneElement(i, u);
  });
  return t.displayName = `${e}.Slot`, t;
}
ee(ds, "createSlot");
var ps = Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function Su(e) {
  const t = /* @__PURE__ */ ee((n) => "child" in n ? n.children(n.child) : n.children, "Slottable");
  return t.displayName = `${e}.Slottable`, t.__radixId = ps, t;
}
ee(Su, "createSlottable");
var Cu = /* @__PURE__ */ ee((e, t) => {
  if ("child" in e.props) {
    const n = e.props.child;
    return c.isValidElement(n) ? c.cloneElement(n, void 0, e.props.children(n.props.children)) : null;
  }
  return c.isValidElement(t) ? t : null;
}, "getSlottableElementFromSlottable");
function ms(e, t) {
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
ee(ms, "mergeProps");
function hs(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
ee(hs, "getElementRef");
function gs(e) {
  return c.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === ps;
}
ee(gs, "isSlottable");
var Pu = Symbol.for("react.lazy");
function On(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === Pu && "_payload" in e && vs(e._payload);
}
ee(On, "isLazyComponent");
function vs(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
ee(vs, "isPromiseLike");
var Ru = /* @__PURE__ */ ee((e) => `${e} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), Ou = /* @__PURE__ */ ee((e) => `${e} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Rt = ce[" use ".trim().toString()], Au = Object.defineProperty, ku = (e, t) => Au(e, "name", { value: t, configurable: !0 }), _u = [
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
], bs = _u.reduce((e, t) => {
  const n = /* @__PURE__ */ ds(`Primitive.${t}`), r = c.forwardRef((o, s) => {
    const { asChild: i, ...a } = o, l = i ? n : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ A.jsx(l, { ...a, ref: s });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function $u(e, t) {
  e && Le.flushSync(() => e.dispatchEvent(t));
}
ku($u, "dispatchDiscreteCustomEvent");
var Du = Object.defineProperty, Nu = (e, t) => Du(e, "name", { value: t, configurable: !0 });
function ys(e) {
  const t = c.useRef(e);
  return c.useEffect(() => {
    t.current = e;
  }), c.useMemo(() => (...n) => {
    var r;
    return (r = t.current) == null ? void 0 : r.call(t, ...n);
  }, []);
}
Nu(ys, "useCallbackRef");
var ln = globalThis != null && globalThis.document ? c.useLayoutEffect : () => {
}, Tu = globalThis != null && globalThis.document ? c.useLayoutEffect : () => {
}, Lu = Object.defineProperty, Iu = (e, t) => Lu(e, "name", { value: t, configurable: !0 });
function ws(e) {
  const [t, n] = c.useState(void 0);
  return Tu(() => {
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
Iu(ws, "useSize");
var Mu = Object.defineProperty, pe = (e, t) => Mu(e, "name", { value: t, configurable: !0 }), xs = "Popper", [Es, Ss] = /* @__PURE__ */ us(xs), [Fu, Cs] = Es(xs), ju = /* @__PURE__ */ pe((e) => {
  const { __scopePopper: t, children: n } = e, [r, o] = c.useState(null), [s, i] = c.useState(void 0);
  return /* @__PURE__ */ A.jsx(
    Fu,
    {
      scope: t,
      anchor: r,
      onAnchorChange: o,
      placementState: s,
      setPlacementState: i,
      children: n
    }
  );
}, "Popper"), Wu = "PopperAnchor", zu = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ pe(function(t, n) {
    const { __scopePopper: r, virtualRef: o, ...s } = t, i = Cs(Wu, r), a = c.useRef(null), l = i.onAnchorChange, f = c.useCallback(
      (m) => {
        a.current = m, m && l(m);
      },
      [l]
    ), d = Ht(n, f), u = c.useRef(null);
    c.useEffect(() => {
      if (!o)
        return;
      const m = u.current;
      u.current = o.current, m !== u.current && l(u.current);
    });
    const p = i.placementState && Gt(i.placementState), h = p == null ? void 0 : p[0], g = p == null ? void 0 : p[1];
    return o ? null : /* @__PURE__ */ A.jsx(
      bs.div,
      {
        "data-radix-popper-side": h,
        "data-radix-popper-align": g,
        ...s,
        ref: d
      }
    );
  }, "PopperAnchor")
), Ps = "PopperContent", [Vu, Bu] = Es(Ps), Uu = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ pe(function(t, n) {
    var V, rt, Ae, ke, je, _e, Qn;
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
    } = t, b = Cs(Ps, r), [w, y] = c.useState(null), x = Ht(n, y), [S, C] = c.useState(null), k = ws(S), E = (k == null ? void 0 : k.width) ?? 0, D = (k == null ? void 0 : k.height) ?? 0, L = o + (i !== "center" ? "-" + i : ""), _ = typeof u == "number" ? u : { top: 0, right: 0, bottom: 0, left: 0, ...u }, $ = Array.isArray(d) ? d : [d], F = $.length > 0, M = {
      padding: _,
      boundary: $.filter(Rs),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: F
    }, { refs: z, floatingStyles: I, placement: W, isPositioned: T, middlewareData: j } = Kl({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: L,
      whileElementsMounted: /* @__PURE__ */ pe((...Kt) => Fl(...Kt, {
        animationFrame: g === "always"
      }), "whileElementsMounted"),
      elements: {
        reference: b.anchor
      },
      middleware: [
        Zl({ mainAxis: s + D, alignmentAxis: a }),
        f && ql({
          mainAxis: !0,
          crossAxis: !1,
          limiter: p === "partial" ? Ql() : void 0,
          ...M
        }),
        f && Jl({ ...M }),
        eu({
          ...M,
          apply: /* @__PURE__ */ pe(({ elements: Kt, rects: Jn, availableWidth: js, availableHeight: Ws }) => {
            const { width: zs, height: Vs } = Jn.reference, pt = Kt.floating.style;
            pt.setProperty("--radix-popper-available-width", `${js}px`), pt.setProperty("--radix-popper-available-height", `${Ws}px`), pt.setProperty("--radix-popper-anchor-width", `${zs}px`), pt.setProperty("--radix-popper-anchor-height", `${Vs}px`);
          }, "apply")
        }),
        S && nu({ element: S, padding: l }),
        Ku({ arrowWidth: E, arrowHeight: D }),
        h && tu({
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
    ln(() => (O(W), () => {
      O(void 0);
    }), [W, O]);
    const [et, tt] = Gt(W), Oe = ys(m);
    ln(() => {
      T && (Oe == null || Oe());
    }, [T, Oe]);
    const nt = (V = j.arrow) == null ? void 0 : V.x, H = (rt = j.arrow) == null ? void 0 : rt.y, G = ((Ae = j.arrow) == null ? void 0 : Ae.centerOffset) !== 0, [Fe, dt] = c.useState();
    return ln(() => {
      w && dt(window.getComputedStyle(w).zIndex);
    }, [w]), /* @__PURE__ */ A.jsx(
      "div",
      {
        ref: z.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...I,
          transform: T ? I.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: Fe,
          "--radix-popper-transform-origin": [
            (ke = j.transformOrigin) == null ? void 0 : ke.x,
            (je = j.transformOrigin) == null ? void 0 : je.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...((_e = j.hide) == null ? void 0 : _e.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: t.dir,
        children: /* @__PURE__ */ A.jsx(
          Vu,
          {
            scope: r,
            placedSide: et,
            placedAlign: tt,
            onArrowChange: C,
            arrowX: nt,
            arrowY: H,
            shouldHideArrow: G,
            children: /* @__PURE__ */ A.jsx(
              bs.div,
              {
                "data-side": et,
                "data-align": tt,
                ...v,
                ref: x,
                style: {
                  ...v.style,
                  // if the PopperContent hasn't been placed yet (not all
                  // measurements done) we prevent animations so that users'
                  // animations don't kick in too early from the wrong sides.
                  animation: T ? (Qn = v.style) == null ? void 0 : Qn.animation : "none"
                }
              }
            )
          }
        )
      }
    );
  }, "PopperContent")
), Hu = "PopperArrow", Gu = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right"
}, Yu = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ pe(function(t, n) {
    const { __scopePopper: r, ...o } = t, s = Bu(Hu, r), i = Gu[s.placedSide];
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
            bu,
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
function Rs(e) {
  return e !== null;
}
pe(Rs, "isNotNull");
var Ku = /* @__PURE__ */ pe((e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    var v, b, w;
    const { placement: n, rects: r, middlewareData: o } = t, i = ((v = o.arrow) == null ? void 0 : v.centerOffset) !== 0, a = i ? 0 : e.arrowWidth, l = i ? 0 : e.arrowHeight, [f, d] = Gt(n), u = { start: "0%", center: "50%", end: "100%" }[d], p = (((b = o.arrow) == null ? void 0 : b.x) ?? 0) + a / 2, h = (((w = o.arrow) == null ? void 0 : w.y) ?? 0) + l / 2;
    let g = "", m = "";
    return f === "bottom" ? (g = i ? u : `${p}px`, m = `${-l}px`) : f === "top" ? (g = i ? u : `${p}px`, m = `${r.floating.height + l}px`) : f === "right" ? (g = `${-l}px`, m = i ? u : `${h}px`) : f === "left" && (g = `${r.floating.width + l}px`, m = i ? u : `${h}px`), { data: { x: g, y: m } };
  }
}), "transformOrigin");
function Gt(e) {
  const [t, n = "center"] = e.split("-");
  return [t, n];
}
pe(Gt, "getSideAndAlignFromPlacement");
var Xu = ju, Zu = zu, qu = Uu, Qu = Yu, Ju = Object.defineProperty, ef = (e, t) => Ju(e, "name", { value: t, configurable: !0 }), tf = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ ef(function(t, n) {
    var l;
    const { container: r, ...o } = t, [s, i] = c.useState(!1);
    Ke(() => i(!0), []);
    const a = r || s && ((l = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : l.body);
    return a ? Le.createPortal(/* @__PURE__ */ A.jsx(jt.div, { ...o, ref: n }), a) : null;
  }, "Portal")
), nf = Object.defineProperty, he = (e, t) => nf(e, "name", { value: t, configurable: !0 });
function Os(e, t) {
  return c.useReducer((n, r) => t[n][r] ?? n, e);
}
he(Os, "useStateMachine");
var As = /* @__PURE__ */ he((e) => {
  const { present: t, children: n } = e, r = ks(t), o = typeof n == "function" ? n({ present: r.isPresent }) : c.Children.only(n), s = _s(r.ref, $s(o));
  return typeof n == "function" || r.isPresent ? c.cloneElement(o, { ref: s }) : null;
}, "Presence");
function ks(e) {
  const [t, n] = c.useState(), r = c.useRef(null), o = c.useRef(e), s = c.useRef("none"), i = c.useRef(void 0), a = e ? "mounted" : "unmounted", [l, f] = Os(a, {
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
    l === "mounted" ? (s.current = i.current ?? Be(r.current), i.current = void 0) : s.current = "none";
  }, [l]), Ke(() => {
    const d = r.current, u = o.current;
    if (u !== e) {
      const h = s.current, g = Be(d);
      e ? (i.current = g, f("MOUNT")) : g === "none" || (d == null ? void 0 : d.display) === "none" ? f("UNMOUNT") : f(u && h !== g ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, f]), Ke(() => {
    if (t) {
      let d;
      const u = t.ownerDocument.defaultView ?? window, p = /* @__PURE__ */ he((g) => {
        const v = Be(r.current).includes(CSS.escape(g.animationName));
        if (g.target === t && v && (f("ANIMATION_END"), !o.current)) {
          const b = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", d = u.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = b);
          });
        }
      }, "handleAnimationEnd"), h = /* @__PURE__ */ he((g) => {
        g.target === t && (s.current = Be(r.current));
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
        r.current = u, i.current = Be(u);
      } else
        r.current = null;
      n(d);
    }, [])
  };
}
he(ks, "usePresence");
function An(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
he(An, "setRef");
function _s(...e) {
  const t = c.useRef(e);
  return t.current = e, c.useCallback((n) => {
    const r = t.current;
    let o = !1;
    const s = r.map((i) => {
      const a = An(i, n);
      return !o && typeof a == "function" && (o = !0), a;
    });
    if (o)
      return () => {
        for (let i = 0; i < s.length; i++) {
          const a = s[i];
          typeof a == "function" ? a() : An(r[i], null);
        }
      };
  }, []);
}
he(_s, "useStableComposedRefs");
function Be(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
he(Be, "getAnimationName");
function $s(e) {
  var r, o;
  let t = (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : r.get, n = t && "isReactWarning" in t && t.isReactWarning;
  return n ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, n = t && "isReactWarning" in t && t.isReactWarning, n ? e.props.ref : e.props.ref || e.ref);
}
he($s, "getElementRef");
var rf = Object.defineProperty, of = (e, t) => rf(e, "name", { value: t, configurable: !0 }), Ir = ce[" useEffectEvent ".trim().toString()], Mr = ce[" useInsertionEffect ".trim().toString()];
function Ds(e) {
  if (typeof Ir == "function")
    return Ir(e);
  const t = c.useRef(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });
  return typeof Mr == "function" ? Mr(() => {
    t.current = e;
  }) : Ke(() => {
    t.current = e;
  }), c.useMemo(() => (...n) => {
    var r;
    return (r = t.current) == null ? void 0 : r.call(t, ...n);
  }, []);
}
of(Ds, "useEffectEvent");
var sf = Object.defineProperty, ft = (e, t) => sf(e, "name", { value: t, configurable: !0 }), af = ce[" useInsertionEffect ".trim().toString()] || Ke;
function Ns({
  prop: e,
  defaultProp: t,
  onChange: n = /* @__PURE__ */ ft(() => {
  }, "onChange"),
  caller: r
}) {
  const [o, s, i] = Ts({
    defaultProp: t,
    onChange: n
  }), a = e !== void 0, l = a ? e : o, f = c.useCallback(
    (d) => {
      var u;
      if (a) {
        const p = Ls(d) ? d(e) : d;
        p !== e && ((u = i.current) == null || u.call(i, p));
      } else
        s(d);
    },
    [a, e, s, i]
  );
  return [l, f];
}
ft(Ns, "useControllableState");
function Ts({
  defaultProp: e,
  onChange: t
}) {
  const [n, r] = c.useState(e), o = c.useRef(n), s = c.useRef(t);
  return af(() => {
    s.current = t;
  }, [t]), c.useEffect(() => {
    var i;
    o.current !== n && ((i = s.current) == null || i.call(s, n), o.current = n);
  }, [n, o]), [n, r, s];
}
ft(Ts, "useUncontrolledState");
function Ls(e) {
  return typeof e == "function";
}
ft(Ls, "isFunction");
var Fr = Symbol("RADIX:SYNC_STATE");
function cf(e, t, n, r) {
  const { prop: o, defaultProp: s, onChange: i, caller: a } = t, l = o !== void 0, f = Ds(i), d = [{ ...n, state: s }];
  r && d.push(r);
  const [u, p] = c.useReducer(
    (v, b) => {
      if (b.type === Fr)
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
    l && !Object.is(o, u.state) && p({ type: Fr, state: o });
  }, [o, u.state, l]), [m, p];
}
ft(cf, "useControllableStateReducer");
var lf = Object.defineProperty, be = (e, t) => lf(e, "name", { value: t, configurable: !0 }), Zn = "Popover", [Is, Of] = /* @__PURE__ */ Ro(Zn, [
  Ss
]), Yt = Ss(), [uf, Je] = Is(Zn), ff = /* @__PURE__ */ be((e) => {
  const {
    __scopePopover: t,
    children: n,
    open: r,
    defaultOpen: o,
    onOpenChange: s,
    modal: i = !1
  } = e, a = Yt(t), l = c.useRef(null), [f, d] = c.useState(!1), [u, p] = Ns({
    prop: r,
    defaultProp: o ?? !1,
    onChange: s,
    caller: Zn
  });
  return /* @__PURE__ */ A.jsx(Xu, { ...a, children: /* @__PURE__ */ A.jsx(
    uf,
    {
      scope: t,
      contentId: Bo(),
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
}, "Popover"), df = "PopoverTrigger", pf = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ be(function(t, n) {
    const { __scopePopover: r, ...o } = t, s = Je(df, r), i = Yt(r), a = Ze(n, s.triggerRef), l = /* @__PURE__ */ A.jsx(
      jt.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": s.open,
        "aria-controls": s.open ? s.contentId : void 0,
        "data-state": qn(s.open),
        ...o,
        ref: a,
        onClick: Ee(t.onClick, s.onOpenToggle)
      }
    );
    return s.hasCustomAnchor ? l : /* @__PURE__ */ A.jsx(Zu, { asChild: !0, ...i, children: l });
  }, "PopoverTrigger")
), Ms = "PopoverPortal", [mf, hf] = Is(Ms, {
  forceMount: void 0
}), gf = /* @__PURE__ */ be((e) => {
  const { __scopePopover: t, forceMount: n, children: r, container: o } = e, s = Je(Ms, t);
  return /* @__PURE__ */ A.jsx(mf, { scope: t, forceMount: n, children: /* @__PURE__ */ A.jsx(As, { present: n || s.open, children: /* @__PURE__ */ A.jsx(tf, { asChild: !0, container: o, children: r }) }) });
}, "PopoverPortal"), ut = "PopoverContent", vf = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ be(function(t, n) {
    const r = hf(ut, t.__scopePopover), { forceMount: o = r.forceMount, ...s } = t, i = Je(ut, t.__scopePopover);
    return /* @__PURE__ */ A.jsx(As, { present: o || i.open, children: i.modal ? /* @__PURE__ */ A.jsx(yf, { ...s, ref: n }) : /* @__PURE__ */ A.jsx(wf, { ...s, ref: n }) });
  }, "PopoverContent")
), bf = /* @__PURE__ */ Mn("PopoverContent.RemoveScroll"), yf = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ be(function(t, n) {
    const r = Je(ut, t.__scopePopover), o = c.useRef(null), s = Ze(n, o), i = c.useRef(!1);
    return c.useEffect(() => {
      const a = o.current;
      if (a) return mo(a);
    }, []), /* @__PURE__ */ A.jsx(Nn, { as: bf, allowPinchZoom: !0, children: /* @__PURE__ */ A.jsx(
      Fs,
      {
        ...t,
        ref: s,
        trapFocus: r.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: Ee(t.onCloseAutoFocus, (a) => {
          var l;
          a.preventDefault(), i.current || (l = r.triggerRef.current) == null || l.focus();
        }),
        onPointerDownOutside: Ee(
          t.onPointerDownOutside,
          (a) => {
            const l = a.detail.originalEvent, f = l.button === 0 && l.ctrlKey === !0, d = l.button === 2 || f;
            i.current = d;
          },
          { checkForDefaultPrevented: !1 }
        ),
        onFocusOutside: Ee(
          t.onFocusOutside,
          (a) => a.preventDefault(),
          { checkForDefaultPrevented: !1 }
        )
      }
    ) });
  }, "PopoverContentModal")
), wf = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ be(function(t, n) {
    const r = Je(ut, t.__scopePopover), o = c.useRef(!1), s = c.useRef(!1);
    return /* @__PURE__ */ A.jsx(
      Fs,
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
), Fs = /* @__PURE__ */ c.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ be(function(t, n) {
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
    } = t, h = Je(ut, r), g = Yt(r);
    return Wn(), /* @__PURE__ */ A.jsx(
      Yc,
      {
        asChild: !0,
        loop: !0,
        trapped: o,
        onMountAutoFocus: s,
        onUnmountAutoFocus: i,
        children: /* @__PURE__ */ A.jsx(
          zc,
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
              qu,
              {
                "data-state": qn(h.open),
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
), xf = /* @__PURE__ */ c.forwardRef(
  /* @__PURE__ */ be(function(t, n) {
    const { __scopePopover: r, ...o } = t, s = Yt(r);
    return /* @__PURE__ */ A.jsx(Qu, { ...s, ...o, ref: n });
  }, "PopoverArrow")
);
function qn(e) {
  return e ? "open" : "closed";
}
be(qn, "getState");
var Af = ff, kf = pf, _f = gf, $f = vf, Df = xf;
export {
  Df as A,
  $f as C,
  dc as D,
  _f as P,
  Af as R,
  Pf as S,
  kf as T,
  Rf as a,
  pc as b,
  un as c,
  gc as d,
  yc as e,
  wc as f,
  lc as g,
  uc as h,
  xc as i,
  Cf as r,
  Sf as t
};
