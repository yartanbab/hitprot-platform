import { g as $t, r as i, j as y, R as Te, a as zt, b as Bt } from "./react-vendor.js";
function rt(e) {
  var t, r, n = "";
  if (typeof e == "string" || typeof e == "number") n += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (r = rt(e[t])) && (n && (n += " "), n += r);
  } else for (r in e) e[r] && (n && (n += " "), n += r);
  return n;
}
function Pe() {
  for (var e, t, r = 0, n = "", o = arguments.length; r < o; r++) (e = arguments[r]) && (t = rt(e)) && (n && (n += " "), n += t);
  return n;
}
const Vt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clsx: Pe,
  default: Pe
}, Symbol.toStringTag, { value: "Module" })), ke = "-", Ut = (e) => {
  const t = Kt(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: n
  } = e;
  return {
    getClassGroupId: (c) => {
      const a = c.split(ke);
      return a[0] === "" && a.length !== 1 && a.shift(), nt(a, t) || Gt(c);
    },
    getConflictingClassGroupIds: (c, a) => {
      const u = r[c] || [];
      return a && n[c] ? [...u, ...n[c]] : u;
    }
  };
}, nt = (e, t) => {
  var c;
  if (e.length === 0)
    return t.classGroupId;
  const r = e[0], n = t.nextPart.get(r), o = n ? nt(e.slice(1), n) : void 0;
  if (o)
    return o;
  if (t.validators.length === 0)
    return;
  const s = e.join(ke);
  return (c = t.validators.find(({
    validator: a
  }) => a(s))) == null ? void 0 : c.classGroupId;
}, We = /^\[(.+)\]$/, Gt = (e) => {
  if (We.test(e)) {
    const t = We.exec(e)[1], r = t == null ? void 0 : t.substring(0, t.indexOf(":"));
    if (r)
      return "arbitrary.." + r;
  }
}, Kt = (e) => {
  const {
    theme: t,
    prefix: r
  } = e, n = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  return Yt(Object.entries(e.classGroups), r).forEach(([s, c]) => {
    Ne(c, n, s, t);
  }), n;
}, Ne = (e, t, r, n) => {
  e.forEach((o) => {
    if (typeof o == "string") {
      const s = o === "" ? t : $e(t, o);
      s.classGroupId = r;
      return;
    }
    if (typeof o == "function") {
      if (Ht(o)) {
        Ne(o(n), t, r, n);
        return;
      }
      t.validators.push({
        validator: o,
        classGroupId: r
      });
      return;
    }
    Object.entries(o).forEach(([s, c]) => {
      Ne(c, $e(t, s), r, n);
    });
  });
}, $e = (e, t) => {
  let r = e;
  return t.split(ke).forEach((n) => {
    r.nextPart.has(n) || r.nextPart.set(n, {
      nextPart: /* @__PURE__ */ new Map(),
      validators: []
    }), r = r.nextPart.get(n);
  }), r;
}, Ht = (e) => e.isThemeGetter, Yt = (e, t) => t ? e.map(([r, n]) => {
  const o = n.map((s) => typeof s == "string" ? t + s : typeof s == "object" ? Object.fromEntries(Object.entries(s).map(([c, a]) => [t + c, a])) : s);
  return [r, o];
}) : e, Xt = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let t = 0, r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  const o = (s, c) => {
    r.set(s, c), t++, t > e && (t = 0, n = r, r = /* @__PURE__ */ new Map());
  };
  return {
    get(s) {
      let c = r.get(s);
      if (c !== void 0)
        return c;
      if ((c = n.get(s)) !== void 0)
        return o(s, c), c;
    },
    set(s, c) {
      r.has(s) ? r.set(s, c) : o(s, c);
    }
  };
}, ot = "!", Zt = (e) => {
  const {
    separator: t,
    experimentalParseClassName: r
  } = e, n = t.length === 1, o = t[0], s = t.length, c = (a) => {
    const u = [];
    let l = 0, f = 0, p;
    for (let g = 0; g < a.length; g++) {
      let v = a[g];
      if (l === 0) {
        if (v === o && (n || a.slice(g, g + s) === t)) {
          u.push(a.slice(f, g)), f = g + s;
          continue;
        }
        if (v === "/") {
          p = g;
          continue;
        }
      }
      v === "[" ? l++ : v === "]" && l--;
    }
    const m = u.length === 0 ? a : a.substring(f), h = m.startsWith(ot), x = h ? m.substring(1) : m, d = p && p > f ? p - f : void 0;
    return {
      modifiers: u,
      hasImportantModifier: h,
      baseClassName: x,
      maybePostfixModifierPosition: d
    };
  };
  return r ? (a) => r({
    className: a,
    parseClassName: c
  }) : c;
}, qt = (e) => {
  if (e.length <= 1)
    return e;
  const t = [];
  let r = [];
  return e.forEach((n) => {
    n[0] === "[" ? (t.push(...r.sort(), n), r = []) : r.push(n);
  }), t.push(...r.sort()), t;
}, Qt = (e) => ({
  cache: Xt(e.cacheSize),
  parseClassName: Zt(e),
  ...Ut(e)
}), Jt = /\s+/, er = (e, t) => {
  const {
    parseClassName: r,
    getClassGroupId: n,
    getConflictingClassGroupIds: o
  } = t, s = [], c = e.trim().split(Jt);
  let a = "";
  for (let u = c.length - 1; u >= 0; u -= 1) {
    const l = c[u], {
      modifiers: f,
      hasImportantModifier: p,
      baseClassName: m,
      maybePostfixModifierPosition: h
    } = r(l);
    let x = !!h, d = n(x ? m.substring(0, h) : m);
    if (!d) {
      if (!x) {
        a = l + (a.length > 0 ? " " + a : a);
        continue;
      }
      if (d = n(m), !d) {
        a = l + (a.length > 0 ? " " + a : a);
        continue;
      }
      x = !1;
    }
    const g = qt(f).join(":"), v = p ? g + ot : g, w = v + d;
    if (s.includes(w))
      continue;
    s.push(w);
    const S = o(d, x);
    for (let E = 0; E < S.length; ++E) {
      const N = S[E];
      s.push(v + N);
    }
    a = l + (a.length > 0 ? " " + a : a);
  }
  return a;
};
function tr() {
  let e = 0, t, r, n = "";
  for (; e < arguments.length; )
    (t = arguments[e++]) && (r = st(t)) && (n && (n += " "), n += r);
  return n;
}
const st = (e) => {
  if (typeof e == "string")
    return e;
  let t, r = "";
  for (let n = 0; n < e.length; n++)
    e[n] && (t = st(e[n])) && (r && (r += " "), r += t);
  return r;
};
function rr(e, ...t) {
  let r, n, o, s = c;
  function c(u) {
    const l = t.reduce((f, p) => p(f), e());
    return r = Qt(l), n = r.cache.get, o = r.cache.set, s = a, a(u);
  }
  function a(u) {
    const l = n(u);
    if (l)
      return l;
    const f = er(u, r);
    return o(u, f), f;
  }
  return function() {
    return s(tr.apply(null, arguments));
  };
}
const P = (e) => {
  const t = (r) => r[e] || [];
  return t.isThemeGetter = !0, t;
}, at = /^\[(?:([a-z-]+):)?(.+)\]$/i, nr = /^\d+\/\d+$/, or = /* @__PURE__ */ new Set(["px", "full", "screen"]), sr = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, ar = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, ir = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, cr = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, lr = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, _ = (e) => H(e) || or.has(e) || nr.test(e), F = (e) => X(e, "length", hr), H = (e) => !!e && !Number.isNaN(Number(e)), he = (e) => X(e, "number", H), q = (e) => !!e && Number.isInteger(Number(e)), ur = (e) => e.endsWith("%") && H(e.slice(0, -1)), b = (e) => at.test(e), W = (e) => sr.test(e), dr = /* @__PURE__ */ new Set(["length", "size", "percentage"]), fr = (e) => X(e, dr, it), pr = (e) => X(e, "position", it), mr = /* @__PURE__ */ new Set(["image", "url"]), gr = (e) => X(e, mr, yr), vr = (e) => X(e, "", br), Q = () => !0, X = (e, t, r) => {
  const n = at.exec(e);
  return n ? n[1] ? typeof t == "string" ? n[1] === t : t.has(n[1]) : r(n[2]) : !1;
}, hr = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  ar.test(e) && !ir.test(e)
), it = () => !1, br = (e) => cr.test(e), yr = (e) => lr.test(e), wr = () => {
  const e = P("colors"), t = P("spacing"), r = P("blur"), n = P("brightness"), o = P("borderColor"), s = P("borderRadius"), c = P("borderSpacing"), a = P("borderWidth"), u = P("contrast"), l = P("grayscale"), f = P("hueRotate"), p = P("invert"), m = P("gap"), h = P("gradientColorStops"), x = P("gradientColorStopPositions"), d = P("inset"), g = P("margin"), v = P("opacity"), w = P("padding"), S = P("saturate"), E = P("scale"), N = P("sepia"), A = P("skew"), C = P("space"), T = P("translate"), k = () => ["auto", "contain", "none"], I = () => ["auto", "hidden", "clip", "visible", "scroll"], j = () => ["auto", b, t], R = () => [b, t], _e = () => ["", _, F], te = () => ["auto", H, b], Le = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"], re = () => ["solid", "dashed", "dotted", "double", "none"], je = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], ve = () => ["start", "end", "center", "between", "around", "evenly", "stretch"], Z = () => ["", "0", b], Fe = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], D = () => [H, b];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [Q],
      spacing: [_, F],
      blur: ["none", "", W, b],
      brightness: D(),
      borderColor: [e],
      borderRadius: ["none", "", "full", W, b],
      borderSpacing: R(),
      borderWidth: _e(),
      contrast: D(),
      grayscale: Z(),
      hueRotate: D(),
      invert: Z(),
      gap: R(),
      gradientColorStops: [e],
      gradientColorStopPositions: [ur, F],
      inset: j(),
      margin: j(),
      opacity: D(),
      padding: R(),
      saturate: D(),
      scale: D(),
      sepia: Z(),
      skew: D(),
      space: R(),
      translate: R()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", b]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [W]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": Fe()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": Fe()
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
        object: [...Le(), b]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: I()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": I()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": I()
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
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [d]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [d]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [d]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [d]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [d]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [d]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [d]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [d]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [d]
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
        z: ["auto", q, b]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: j()
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
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", b]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: Z()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: Z()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", q, b]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [Q]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", q, b]
        }, b]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": te()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": te()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [Q]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [q, b]
        }, b]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": te()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": te()
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
        "auto-cols": ["auto", "min", "max", "fr", b]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", b]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [m]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [m]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [m]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...ve()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...ve(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...ve(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [w]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [w]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [w]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [w]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [w]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [w]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [w]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [w]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [w]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [g]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [g]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [g]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [g]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [g]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [g]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [g]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [g]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [g]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [C]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [C]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", b, t]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [b, t, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [b, t, "none", "full", "min", "max", "fit", "prose", {
          screen: [W]
        }, W]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [b, t, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [b, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [b, t, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [b, t, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", W, F]
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
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", he]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Q]
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
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", b]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", H, he]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", _, b]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", b]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", b]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [e]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [v]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [e]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [v]
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
        decoration: [...re(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", _, F]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", _, b]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [e]
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
        indent: R()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", b]
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
        content: ["none", b]
      }],
      // Backgrounds
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
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [v]
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
        bg: [...Le(), pr]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", fr]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, gr]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [e]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [x]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [x]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [x]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [h]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [h]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [h]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [s]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [s]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [s]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [s]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [s]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [s]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [s]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [s]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [s]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [s]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [s]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [s]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [s]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [s]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [s]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [a]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [a]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [a]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [a]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [a]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [a]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [a]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [a]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [a]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [v]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...re(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [a]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [a]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [v]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: re()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [o]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [o]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [o]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [o]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [o]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [o]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [o]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [o]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [o]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [o]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...re()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [_, b]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [_, F]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [e]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: _e()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [e]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [v]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [_, F]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [e]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", W, vr]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [Q]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [v]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...je(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": je()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [r]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [n]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [u]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", W, b]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [l]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [f]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [p]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [S]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [N]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [r]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [n]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [u]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [l]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [f]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [p]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [v]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [S]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [N]
      }],
      // Tables
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
        "border-spacing": [c]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [c]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [c]
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
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", b]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: D()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", b]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: D()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", b]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [E]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [E]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [E]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [q, b]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [T]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [T]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [A]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [A]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", b]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", e]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", b]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [e]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": R()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": R()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": R()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": R()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": R()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": R()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": R()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": R()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": R()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": R()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": R()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": R()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": R()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": R()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": R()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": R()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": R()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": R()
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
        "will-change": ["auto", "scroll", "contents", "transform", b]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [e, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [_, F, he]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [e, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
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
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
}, vo = /* @__PURE__ */ rr(wr), ho = /* @__PURE__ */ $t(Vt);
function ze(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function fe(...e) {
  return (t) => {
    let r = !1;
    const n = e.map((o) => {
      const s = ze(o, t);
      return !r && typeof s == "function" && (r = !0), s;
    });
    if (r)
      return () => {
        for (let o = 0; o < n.length; o++) {
          const s = n[o];
          typeof s == "function" ? s() : ze(e[o], null);
        }
      };
  };
}
function V(...e) {
  return i.useCallback(fe(...e), e);
}
var xr = Symbol.for("react.lazy"), ue = Te[" use ".trim().toString()];
function Er(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
function ct(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === xr && "_payload" in e && Er(e._payload);
}
// @__NO_SIDE_EFFECTS__
function Cr(e) {
  const t = /* @__PURE__ */ Sr(e), r = i.forwardRef((n, o) => {
    let { children: s, ...c } = n;
    ct(s) && typeof ue == "function" && (s = ue(s._payload));
    const a = i.Children.toArray(s), u = a.find(Pr);
    if (u) {
      const l = u.props.children, f = a.map((p) => p === u ? i.Children.count(l) > 1 ? i.Children.only(null) : i.isValidElement(l) ? l.props.children : null : p);
      return /* @__PURE__ */ y.jsx(t, { ...c, ref: o, children: i.isValidElement(l) ? i.cloneElement(l, void 0, f) : null });
    }
    return /* @__PURE__ */ y.jsx(t, { ...c, ref: o, children: s });
  });
  return r.displayName = `${e}.Slot`, r;
}
var bo = /* @__PURE__ */ Cr("Slot");
// @__NO_SIDE_EFFECTS__
function Sr(e) {
  const t = i.forwardRef((r, n) => {
    let { children: o, ...s } = r;
    if (ct(o) && typeof ue == "function" && (o = ue(o._payload)), i.isValidElement(o)) {
      const c = Ar(o), a = Nr(s, o.props);
      return o.type !== i.Fragment && (a.ref = n ? fe(n, c) : c), i.cloneElement(o, a);
    }
    return i.Children.count(o) > 1 ? i.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var Rr = Symbol("radix.slottable");
function Pr(e) {
  return i.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Rr;
}
function Nr(e, t) {
  const r = { ...t };
  for (const n in t) {
    const o = e[n], s = t[n];
    /^on[A-Z]/.test(n) ? o && s ? r[n] = (...a) => {
      const u = s(...a);
      return o(...a), u;
    } : o && (r[n] = o) : n === "style" ? r[n] = { ...o, ...s } : n === "className" && (r[n] = [o, s].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
function Ar(e) {
  var n, o;
  let t = (n = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : n.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
const Be = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, Ve = Pe, yo = (e, t) => (r) => {
  var n;
  if ((t == null ? void 0 : t.variants) == null) return Ve(e, r == null ? void 0 : r.class, r == null ? void 0 : r.className);
  const { variants: o, defaultVariants: s } = t, c = Object.keys(o).map((l) => {
    const f = r == null ? void 0 : r[l], p = s == null ? void 0 : s[l];
    if (f === null) return null;
    const m = Be(f) || Be(p);
    return o[l][m];
  }), a = r && Object.entries(r).reduce((l, f) => {
    let [p, m] = f;
    return m === void 0 || (l[p] = m), l;
  }, {}), u = t == null || (n = t.compoundVariants) === null || n === void 0 ? void 0 : n.reduce((l, f) => {
    let { class: p, className: m, ...h } = f;
    return Object.entries(h).every((x) => {
      let [d, g] = x;
      return Array.isArray(g) ? g.includes({
        ...s,
        ...a
      }[d]) : {
        ...s,
        ...a
      }[d] === g;
    }) ? [
      ...l,
      p,
      m
    ] : l;
  }, []);
  return Ve(e, c, u, r == null ? void 0 : r.class, r == null ? void 0 : r.className);
};
function z(e, t, { checkForDefaultPrevented: r = !0 } = {}) {
  return function(o) {
    if (e == null || e(o), r === !1 || !o.defaultPrevented)
      return t == null ? void 0 : t(o);
  };
}
function Or(e, t) {
  const r = i.createContext(t), n = (s) => {
    const { children: c, ...a } = s, u = i.useMemo(() => a, Object.values(a));
    return /* @__PURE__ */ y.jsx(r.Provider, { value: u, children: c });
  };
  n.displayName = e + "Provider";
  function o(s) {
    const c = i.useContext(r);
    if (c) return c;
    if (t !== void 0) return t;
    throw new Error(`\`${s}\` must be used within \`${e}\``);
  }
  return [n, o];
}
function Tr(e, t = []) {
  let r = [];
  function n(s, c) {
    const a = i.createContext(c), u = r.length;
    r = [...r, c];
    const l = (p) => {
      var v;
      const { scope: m, children: h, ...x } = p, d = ((v = m == null ? void 0 : m[e]) == null ? void 0 : v[u]) || a, g = i.useMemo(() => x, Object.values(x));
      return /* @__PURE__ */ y.jsx(d.Provider, { value: g, children: h });
    };
    l.displayName = s + "Provider";
    function f(p, m) {
      var d;
      const h = ((d = m == null ? void 0 : m[e]) == null ? void 0 : d[u]) || a, x = i.useContext(h);
      if (x) return x;
      if (c !== void 0) return c;
      throw new Error(`\`${p}\` must be used within \`${s}\``);
    }
    return [l, f];
  }
  const o = () => {
    const s = r.map((c) => i.createContext(c));
    return function(a) {
      const u = (a == null ? void 0 : a[e]) || s;
      return i.useMemo(
        () => ({ [`__scope${e}`]: { ...a, [e]: u } }),
        [a, u]
      );
    };
  };
  return o.scopeName = e, [n, kr(o, ...t)];
}
function kr(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const r = () => {
    const n = e.map((o) => ({
      useScope: o(),
      scopeName: o.scopeName
    }));
    return function(s) {
      const c = n.reduce((a, { useScope: u, scopeName: l }) => {
        const p = u(s)[`__scope${l}`];
        return { ...a, ...p };
      }, {});
      return i.useMemo(() => ({ [`__scope${t.scopeName}`]: c }), [c]);
    };
  };
  return r.scopeName = t.scopeName, r;
}
var J = globalThis != null && globalThis.document ? i.useLayoutEffect : () => {
}, Mr = Te[" useId ".trim().toString()] || (() => {
}), Ir = 0;
function be(e) {
  const [t, r] = i.useState(Mr());
  return J(() => {
    r((n) => n ?? String(Ir++));
  }, [e]), e || (t ? `radix-${t}` : "");
}
var Dr = Te[" useInsertionEffect ".trim().toString()] || J;
function _r({
  prop: e,
  defaultProp: t,
  onChange: r = () => {
  },
  caller: n
}) {
  const [o, s, c] = Lr({
    defaultProp: t,
    onChange: r
  }), a = e !== void 0, u = a ? e : o;
  {
    const f = i.useRef(e !== void 0);
    i.useEffect(() => {
      const p = f.current;
      p !== a && console.warn(
        `${n} is changing from ${p ? "controlled" : "uncontrolled"} to ${a ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), f.current = a;
    }, [a, n]);
  }
  const l = i.useCallback(
    (f) => {
      var p;
      if (a) {
        const m = jr(f) ? f(e) : f;
        m !== e && ((p = c.current) == null || p.call(c, m));
      } else
        s(f);
    },
    [a, e, s, c]
  );
  return [u, l];
}
function Lr({
  defaultProp: e,
  onChange: t
}) {
  const [r, n] = i.useState(e), o = i.useRef(r), s = i.useRef(t);
  return Dr(() => {
    s.current = t;
  }, [t]), i.useEffect(() => {
    var c;
    o.current !== r && ((c = s.current) == null || c.call(s, r), o.current = r);
  }, [r, o]), [r, n, s];
}
function jr(e) {
  return typeof e == "function";
}
// @__NO_SIDE_EFFECTS__
function Fr(e) {
  const t = /* @__PURE__ */ Wr(e), r = i.forwardRef((n, o) => {
    const { children: s, ...c } = n, a = i.Children.toArray(s), u = a.find(zr);
    if (u) {
      const l = u.props.children, f = a.map((p) => p === u ? i.Children.count(l) > 1 ? i.Children.only(null) : i.isValidElement(l) ? l.props.children : null : p);
      return /* @__PURE__ */ y.jsx(t, { ...c, ref: o, children: i.isValidElement(l) ? i.cloneElement(l, void 0, f) : null });
    }
    return /* @__PURE__ */ y.jsx(t, { ...c, ref: o, children: s });
  });
  return r.displayName = `${e}.Slot`, r;
}
// @__NO_SIDE_EFFECTS__
function Wr(e) {
  const t = i.forwardRef((r, n) => {
    const { children: o, ...s } = r;
    if (i.isValidElement(o)) {
      const c = Vr(o), a = Br(s, o.props);
      return o.type !== i.Fragment && (a.ref = n ? fe(n, c) : c), i.cloneElement(o, a);
    }
    return i.Children.count(o) > 1 ? i.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var $r = Symbol("radix.slottable");
function zr(e) {
  return i.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === $r;
}
function Br(e, t) {
  const r = { ...t };
  for (const n in t) {
    const o = e[n], s = t[n];
    /^on[A-Z]/.test(n) ? o && s ? r[n] = (...a) => {
      const u = s(...a);
      return o(...a), u;
    } : o && (r[n] = o) : n === "style" ? r[n] = { ...o, ...s } : n === "className" && (r[n] = [o, s].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
function Vr(e) {
  var n, o;
  let t = (n = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : n.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
var Ur = [
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
], L = Ur.reduce((e, t) => {
  const r = /* @__PURE__ */ Fr(`Primitive.${t}`), n = i.forwardRef((o, s) => {
    const { asChild: c, ...a } = o, u = c ? r : t;
    return typeof window < "u" && (window[Symbol.for("radix-ui")] = !0), /* @__PURE__ */ y.jsx(u, { ...a, ref: s });
  });
  return n.displayName = `Primitive.${t}`, { ...e, [t]: n };
}, {});
function Gr(e, t) {
  e && zt.flushSync(() => e.dispatchEvent(t));
}
function ee(e) {
  const t = i.useRef(e);
  return i.useEffect(() => {
    t.current = e;
  }), i.useMemo(() => (...r) => {
    var n;
    return (n = t.current) == null ? void 0 : n.call(t, ...r);
  }, []);
}
function Kr(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = ee(e);
  i.useEffect(() => {
    const n = (o) => {
      o.key === "Escape" && r(o);
    };
    return t.addEventListener("keydown", n, { capture: !0 }), () => t.removeEventListener("keydown", n, { capture: !0 });
  }, [r, t]);
}
var Hr = "DismissableLayer", Ae = "dismissableLayer.update", Yr = "dismissableLayer.pointerDownOutside", Xr = "dismissableLayer.focusOutside", Ue, lt = i.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set()
}), ut = i.forwardRef(
  (e, t) => {
    const {
      disableOutsidePointerEvents: r = !1,
      onEscapeKeyDown: n,
      onPointerDownOutside: o,
      onFocusOutside: s,
      onInteractOutside: c,
      onDismiss: a,
      ...u
    } = e, l = i.useContext(lt), [f, p] = i.useState(null), m = (f == null ? void 0 : f.ownerDocument) ?? (globalThis == null ? void 0 : globalThis.document), [, h] = i.useState({}), x = V(t, (C) => p(C)), d = Array.from(l.layers), [g] = [...l.layersWithOutsidePointerEventsDisabled].slice(-1), v = d.indexOf(g), w = f ? d.indexOf(f) : -1, S = l.layersWithOutsidePointerEventsDisabled.size > 0, E = w >= v, N = Qr((C) => {
      const T = C.target, k = [...l.branches].some((I) => I.contains(T));
      !E || k || (o == null || o(C), c == null || c(C), C.defaultPrevented || a == null || a());
    }, m), A = Jr((C) => {
      const T = C.target;
      [...l.branches].some((I) => I.contains(T)) || (s == null || s(C), c == null || c(C), C.defaultPrevented || a == null || a());
    }, m);
    return Kr((C) => {
      w === l.layers.size - 1 && (n == null || n(C), !C.defaultPrevented && a && (C.preventDefault(), a()));
    }, m), i.useEffect(() => {
      if (f)
        return r && (l.layersWithOutsidePointerEventsDisabled.size === 0 && (Ue = m.body.style.pointerEvents, m.body.style.pointerEvents = "none"), l.layersWithOutsidePointerEventsDisabled.add(f)), l.layers.add(f), Ge(), () => {
          r && l.layersWithOutsidePointerEventsDisabled.size === 1 && (m.body.style.pointerEvents = Ue);
        };
    }, [f, m, r, l]), i.useEffect(() => () => {
      f && (l.layers.delete(f), l.layersWithOutsidePointerEventsDisabled.delete(f), Ge());
    }, [f, l]), i.useEffect(() => {
      const C = () => h({});
      return document.addEventListener(Ae, C), () => document.removeEventListener(Ae, C);
    }, []), /* @__PURE__ */ y.jsx(
      L.div,
      {
        ...u,
        ref: x,
        style: {
          pointerEvents: S ? E ? "auto" : "none" : void 0,
          ...e.style
        },
        onFocusCapture: z(e.onFocusCapture, A.onFocusCapture),
        onBlurCapture: z(e.onBlurCapture, A.onBlurCapture),
        onPointerDownCapture: z(
          e.onPointerDownCapture,
          N.onPointerDownCapture
        )
      }
    );
  }
);
ut.displayName = Hr;
var Zr = "DismissableLayerBranch", qr = i.forwardRef((e, t) => {
  const r = i.useContext(lt), n = i.useRef(null), o = V(t, n);
  return i.useEffect(() => {
    const s = n.current;
    if (s)
      return r.branches.add(s), () => {
        r.branches.delete(s);
      };
  }, [r.branches]), /* @__PURE__ */ y.jsx(L.div, { ...e, ref: o });
});
qr.displayName = Zr;
function Qr(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = ee(e), n = i.useRef(!1), o = i.useRef(() => {
  });
  return i.useEffect(() => {
    const s = (a) => {
      if (a.target && !n.current) {
        let u = function() {
          dt(
            Yr,
            r,
            l,
            { discrete: !0 }
          );
        };
        const l = { originalEvent: a };
        a.pointerType === "touch" ? (t.removeEventListener("click", o.current), o.current = u, t.addEventListener("click", o.current, { once: !0 })) : u();
      } else
        t.removeEventListener("click", o.current);
      n.current = !1;
    }, c = window.setTimeout(() => {
      t.addEventListener("pointerdown", s);
    }, 0);
    return () => {
      window.clearTimeout(c), t.removeEventListener("pointerdown", s), t.removeEventListener("click", o.current);
    };
  }, [t, r]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => n.current = !0
  };
}
function Jr(e, t = globalThis == null ? void 0 : globalThis.document) {
  const r = ee(e), n = i.useRef(!1);
  return i.useEffect(() => {
    const o = (s) => {
      s.target && !n.current && dt(Xr, r, { originalEvent: s }, {
        discrete: !1
      });
    };
    return t.addEventListener("focusin", o), () => t.removeEventListener("focusin", o);
  }, [t, r]), {
    onFocusCapture: () => n.current = !0,
    onBlurCapture: () => n.current = !1
  };
}
function Ge() {
  const e = new CustomEvent(Ae);
  document.dispatchEvent(e);
}
function dt(e, t, r, { discrete: n }) {
  const o = r.originalEvent.target, s = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: r });
  t && o.addEventListener(e, t, { once: !0 }), n ? Gr(o, s) : o.dispatchEvent(s);
}
var ye = "focusScope.autoFocusOnMount", we = "focusScope.autoFocusOnUnmount", Ke = { bubbles: !1, cancelable: !0 }, en = "FocusScope", ft = i.forwardRef((e, t) => {
  const {
    loop: r = !1,
    trapped: n = !1,
    onMountAutoFocus: o,
    onUnmountAutoFocus: s,
    ...c
  } = e, [a, u] = i.useState(null), l = ee(o), f = ee(s), p = i.useRef(null), m = V(t, (d) => u(d)), h = i.useRef({
    paused: !1,
    pause() {
      this.paused = !0;
    },
    resume() {
      this.paused = !1;
    }
  }).current;
  i.useEffect(() => {
    if (n) {
      let d = function(S) {
        if (h.paused || !a) return;
        const E = S.target;
        a.contains(E) ? p.current = E : $(p.current, { select: !0 });
      }, g = function(S) {
        if (h.paused || !a) return;
        const E = S.relatedTarget;
        E !== null && (a.contains(E) || $(p.current, { select: !0 }));
      }, v = function(S) {
        if (document.activeElement === document.body)
          for (const N of S)
            N.removedNodes.length > 0 && $(a);
      };
      document.addEventListener("focusin", d), document.addEventListener("focusout", g);
      const w = new MutationObserver(v);
      return a && w.observe(a, { childList: !0, subtree: !0 }), () => {
        document.removeEventListener("focusin", d), document.removeEventListener("focusout", g), w.disconnect();
      };
    }
  }, [n, a, h.paused]), i.useEffect(() => {
    if (a) {
      Ye.add(h);
      const d = document.activeElement;
      if (!a.contains(d)) {
        const v = new CustomEvent(ye, Ke);
        a.addEventListener(ye, l), a.dispatchEvent(v), v.defaultPrevented || (tn(an(pt(a)), { select: !0 }), document.activeElement === d && $(a));
      }
      return () => {
        a.removeEventListener(ye, l), setTimeout(() => {
          const v = new CustomEvent(we, Ke);
          a.addEventListener(we, f), a.dispatchEvent(v), v.defaultPrevented || $(d ?? document.body, { select: !0 }), a.removeEventListener(we, f), Ye.remove(h);
        }, 0);
      };
    }
  }, [a, l, f, h]);
  const x = i.useCallback(
    (d) => {
      if (!r && !n || h.paused) return;
      const g = d.key === "Tab" && !d.altKey && !d.ctrlKey && !d.metaKey, v = document.activeElement;
      if (g && v) {
        const w = d.currentTarget, [S, E] = rn(w);
        S && E ? !d.shiftKey && v === E ? (d.preventDefault(), r && $(S, { select: !0 })) : d.shiftKey && v === S && (d.preventDefault(), r && $(E, { select: !0 })) : v === w && d.preventDefault();
      }
    },
    [r, n, h.paused]
  );
  return /* @__PURE__ */ y.jsx(L.div, { tabIndex: -1, ...c, ref: m, onKeyDown: x });
});
ft.displayName = en;
function tn(e, { select: t = !1 } = {}) {
  const r = document.activeElement;
  for (const n of e)
    if ($(n, { select: t }), document.activeElement !== r) return;
}
function rn(e) {
  const t = pt(e), r = He(t, e), n = He(t.reverse(), e);
  return [r, n];
}
function pt(e) {
  const t = [], r = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (n) => {
      const o = n.tagName === "INPUT" && n.type === "hidden";
      return n.disabled || n.hidden || o ? NodeFilter.FILTER_SKIP : n.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  for (; r.nextNode(); ) t.push(r.currentNode);
  return t;
}
function He(e, t) {
  for (const r of e)
    if (!nn(r, { upTo: t })) return r;
}
function nn(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e; ) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function on(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function $(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const r = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== r && on(e) && t && e.select();
  }
}
var Ye = sn();
function sn() {
  let e = [];
  return {
    add(t) {
      const r = e[0];
      t !== r && (r == null || r.pause()), e = Xe(e, t), e.unshift(t);
    },
    remove(t) {
      var r;
      e = Xe(e, t), (r = e[0]) == null || r.resume();
    }
  };
}
function Xe(e, t) {
  const r = [...e], n = r.indexOf(t);
  return n !== -1 && r.splice(n, 1), r;
}
function an(e) {
  return e.filter((t) => t.tagName !== "A");
}
var cn = "Portal", mt = i.forwardRef((e, t) => {
  var a;
  const { container: r, ...n } = e, [o, s] = i.useState(!1);
  J(() => s(!0), []);
  const c = r || o && ((a = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : a.body);
  return c ? Bt.createPortal(/* @__PURE__ */ y.jsx(L.div, { ...n, ref: t }), c) : null;
});
mt.displayName = cn;
function ln(e, t) {
  return i.useReducer((r, n) => t[r][n] ?? r, e);
}
var pe = (e) => {
  const { present: t, children: r } = e, n = un(t), o = typeof r == "function" ? r({ present: n.isPresent }) : i.Children.only(r), s = V(n.ref, dn(o));
  return typeof r == "function" || n.isPresent ? i.cloneElement(o, { ref: s }) : null;
};
pe.displayName = "Presence";
function un(e) {
  const [t, r] = i.useState(), n = i.useRef(null), o = i.useRef(e), s = i.useRef("none"), c = e ? "mounted" : "unmounted", [a, u] = ln(c, {
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
  return i.useEffect(() => {
    const l = ne(n.current);
    s.current = a === "mounted" ? l : "none";
  }, [a]), J(() => {
    const l = n.current, f = o.current;
    if (f !== e) {
      const m = s.current, h = ne(l);
      e ? u("MOUNT") : h === "none" || (l == null ? void 0 : l.display) === "none" ? u("UNMOUNT") : u(f && m !== h ? "ANIMATION_OUT" : "UNMOUNT"), o.current = e;
    }
  }, [e, u]), J(() => {
    if (t) {
      let l;
      const f = t.ownerDocument.defaultView ?? window, p = (h) => {
        const d = ne(n.current).includes(CSS.escape(h.animationName));
        if (h.target === t && d && (u("ANIMATION_END"), !o.current)) {
          const g = t.style.animationFillMode;
          t.style.animationFillMode = "forwards", l = f.setTimeout(() => {
            t.style.animationFillMode === "forwards" && (t.style.animationFillMode = g);
          });
        }
      }, m = (h) => {
        h.target === t && (s.current = ne(n.current));
      };
      return t.addEventListener("animationstart", m), t.addEventListener("animationcancel", p), t.addEventListener("animationend", p), () => {
        f.clearTimeout(l), t.removeEventListener("animationstart", m), t.removeEventListener("animationcancel", p), t.removeEventListener("animationend", p);
      };
    } else
      u("ANIMATION_END");
  }, [t, u]), {
    isPresent: ["mounted", "unmountSuspended"].includes(a),
    ref: i.useCallback((l) => {
      n.current = l ? getComputedStyle(l) : null, r(l);
    }, [])
  };
}
function ne(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function dn(e) {
  var n, o;
  let t = (n = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : n.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
var xe = 0;
function fn() {
  i.useEffect(() => {
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return document.body.insertAdjacentElement("afterbegin", e[0] ?? Ze()), document.body.insertAdjacentElement("beforeend", e[1] ?? Ze()), xe++, () => {
      xe === 1 && document.querySelectorAll("[data-radix-focus-guard]").forEach((t) => t.remove()), xe--;
    };
  }, []);
}
function Ze() {
  const e = document.createElement("span");
  return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e;
}
var M = function() {
  return M = Object.assign || function(t) {
    for (var r, n = 1, o = arguments.length; n < o; n++) {
      r = arguments[n];
      for (var s in r) Object.prototype.hasOwnProperty.call(r, s) && (t[s] = r[s]);
    }
    return t;
  }, M.apply(this, arguments);
};
function gt(e, t) {
  var r = {};
  for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, n = Object.getOwnPropertySymbols(e); o < n.length; o++)
      t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]]);
  return r;
}
function pn(e, t, r) {
  if (r || arguments.length === 2) for (var n = 0, o = t.length, s; n < o; n++)
    (s || !(n in t)) && (s || (s = Array.prototype.slice.call(t, 0, n)), s[n] = t[n]);
  return e.concat(s || Array.prototype.slice.call(t));
}
var ce = "right-scroll-bar-position", le = "width-before-scroll-bar", mn = "with-scroll-bars-hidden", gn = "--removed-body-scroll-bar-size";
function Ee(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function vn(e, t) {
  var r = i.useState(function() {
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
var hn = typeof window < "u" ? i.useLayoutEffect : i.useEffect, qe = /* @__PURE__ */ new WeakMap();
function bn(e, t) {
  var r = vn(null, function(n) {
    return e.forEach(function(o) {
      return Ee(o, n);
    });
  });
  return hn(function() {
    var n = qe.get(r);
    if (n) {
      var o = new Set(n), s = new Set(e), c = r.current;
      o.forEach(function(a) {
        s.has(a) || Ee(a, null);
      }), s.forEach(function(a) {
        o.has(a) || Ee(a, c);
      });
    }
    qe.set(r, e);
  }, [e]), r;
}
function yn(e) {
  return e;
}
function wn(e, t) {
  t === void 0 && (t = yn);
  var r = [], n = !1, o = {
    read: function() {
      if (n)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return r.length ? r[r.length - 1] : e;
    },
    useMedium: function(s) {
      var c = t(s, n);
      return r.push(c), function() {
        r = r.filter(function(a) {
          return a !== c;
        });
      };
    },
    assignSyncMedium: function(s) {
      for (n = !0; r.length; ) {
        var c = r;
        r = [], c.forEach(s);
      }
      r = {
        push: function(a) {
          return s(a);
        },
        filter: function() {
          return r;
        }
      };
    },
    assignMedium: function(s) {
      n = !0;
      var c = [];
      if (r.length) {
        var a = r;
        r = [], a.forEach(s), c = r;
      }
      var u = function() {
        var f = c;
        c = [], f.forEach(s);
      }, l = function() {
        return Promise.resolve().then(u);
      };
      l(), r = {
        push: function(f) {
          c.push(f), l();
        },
        filter: function(f) {
          return c = c.filter(f), r;
        }
      };
    }
  };
  return o;
}
function xn(e) {
  e === void 0 && (e = {});
  var t = wn(null);
  return t.options = M({ async: !0, ssr: !1 }, e), t;
}
var vt = function(e) {
  var t = e.sideCar, r = gt(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var n = t.read();
  if (!n)
    throw new Error("Sidecar medium not found");
  return i.createElement(n, M({}, r));
};
vt.isSideCarExport = !0;
function En(e, t) {
  return e.useMedium(t), vt;
}
var ht = xn(), Ce = function() {
}, me = i.forwardRef(function(e, t) {
  var r = i.useRef(null), n = i.useState({
    onScrollCapture: Ce,
    onWheelCapture: Ce,
    onTouchMoveCapture: Ce
  }), o = n[0], s = n[1], c = e.forwardProps, a = e.children, u = e.className, l = e.removeScrollBar, f = e.enabled, p = e.shards, m = e.sideCar, h = e.noRelative, x = e.noIsolation, d = e.inert, g = e.allowPinchZoom, v = e.as, w = v === void 0 ? "div" : v, S = e.gapMode, E = gt(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), N = m, A = bn([r, t]), C = M(M({}, E), o);
  return i.createElement(
    i.Fragment,
    null,
    f && i.createElement(N, { sideCar: ht, removeScrollBar: l, shards: p, noRelative: h, noIsolation: x, inert: d, setCallbacks: s, allowPinchZoom: !!g, lockRef: r, gapMode: S }),
    c ? i.cloneElement(i.Children.only(a), M(M({}, C), { ref: A })) : i.createElement(w, M({}, C, { className: u, ref: A }), a)
  );
});
me.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
me.classNames = {
  fullWidth: le,
  zeroRight: ce
};
var Cn = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function Sn() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = Cn();
  return t && e.setAttribute("nonce", t), e;
}
function Rn(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function Pn(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var Nn = function() {
  var e = 0, t = null;
  return {
    add: function(r) {
      e == 0 && (t = Sn()) && (Rn(t, r), Pn(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, An = function() {
  var e = Nn();
  return function(t, r) {
    i.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && r]);
  };
}, bt = function() {
  var e = An(), t = function(r) {
    var n = r.styles, o = r.dynamic;
    return e(n, o), null;
  };
  return t;
}, On = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, Se = function(e) {
  return parseInt(e || "", 10) || 0;
}, Tn = function(e) {
  var t = window.getComputedStyle(document.body), r = t[e === "padding" ? "paddingLeft" : "marginLeft"], n = t[e === "padding" ? "paddingTop" : "marginTop"], o = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [Se(r), Se(n), Se(o)];
}, kn = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return On;
  var t = Tn(e), r = document.documentElement.clientWidth, n = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, n - r + t[2] - t[0])
  };
}, Mn = bt(), Y = "data-scroll-locked", In = function(e, t, r, n) {
  var o = e.left, s = e.top, c = e.right, a = e.gap;
  return r === void 0 && (r = "margin"), `
  .`.concat(mn, ` {
   overflow: hidden `).concat(n, `;
   padding-right: `).concat(a, "px ").concat(n, `;
  }
  body[`).concat(Y, `] {
    overflow: hidden `).concat(n, `;
    overscroll-behavior: contain;
    `).concat([
    t && "position: relative ".concat(n, ";"),
    r === "margin" && `
    padding-left: `.concat(o, `px;
    padding-top: `).concat(s, `px;
    padding-right: `).concat(c, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(a, "px ").concat(n, `;
    `),
    r === "padding" && "padding-right: ".concat(a, "px ").concat(n, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(ce, ` {
    right: `).concat(a, "px ").concat(n, `;
  }
  
  .`).concat(le, ` {
    margin-right: `).concat(a, "px ").concat(n, `;
  }
  
  .`).concat(ce, " .").concat(ce, ` {
    right: 0 `).concat(n, `;
  }
  
  .`).concat(le, " .").concat(le, ` {
    margin-right: 0 `).concat(n, `;
  }
  
  body[`).concat(Y, `] {
    `).concat(gn, ": ").concat(a, `px;
  }
`);
}, Qe = function() {
  var e = parseInt(document.body.getAttribute(Y) || "0", 10);
  return isFinite(e) ? e : 0;
}, Dn = function() {
  i.useEffect(function() {
    return document.body.setAttribute(Y, (Qe() + 1).toString()), function() {
      var e = Qe() - 1;
      e <= 0 ? document.body.removeAttribute(Y) : document.body.setAttribute(Y, e.toString());
    };
  }, []);
}, _n = function(e) {
  var t = e.noRelative, r = e.noImportant, n = e.gapMode, o = n === void 0 ? "margin" : n;
  Dn();
  var s = i.useMemo(function() {
    return kn(o);
  }, [o]);
  return i.createElement(Mn, { styles: In(s, !t, o, r ? "" : "!important") });
}, Oe = !1;
if (typeof window < "u")
  try {
    var oe = Object.defineProperty({}, "passive", {
      get: function() {
        return Oe = !0, !0;
      }
    });
    window.addEventListener("test", oe, oe), window.removeEventListener("test", oe, oe);
  } catch {
    Oe = !1;
  }
var U = Oe ? { passive: !1 } : !1, Ln = function(e) {
  return e.tagName === "TEXTAREA";
}, yt = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var r = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    r[t] !== "hidden" && // contains scroll inside self
    !(r.overflowY === r.overflowX && !Ln(e) && r[t] === "visible")
  );
}, jn = function(e) {
  return yt(e, "overflowY");
}, Fn = function(e) {
  return yt(e, "overflowX");
}, Je = function(e, t) {
  var r = t.ownerDocument, n = t;
  do {
    typeof ShadowRoot < "u" && n instanceof ShadowRoot && (n = n.host);
    var o = wt(e, n);
    if (o) {
      var s = xt(e, n), c = s[1], a = s[2];
      if (c > a)
        return !0;
    }
    n = n.parentNode;
  } while (n && n !== r.body);
  return !1;
}, Wn = function(e) {
  var t = e.scrollTop, r = e.scrollHeight, n = e.clientHeight;
  return [
    t,
    r,
    n
  ];
}, $n = function(e) {
  var t = e.scrollLeft, r = e.scrollWidth, n = e.clientWidth;
  return [
    t,
    r,
    n
  ];
}, wt = function(e, t) {
  return e === "v" ? jn(t) : Fn(t);
}, xt = function(e, t) {
  return e === "v" ? Wn(t) : $n(t);
}, zn = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, Bn = function(e, t, r, n, o) {
  var s = zn(e, window.getComputedStyle(t).direction), c = s * n, a = r.target, u = t.contains(a), l = !1, f = c > 0, p = 0, m = 0;
  do {
    if (!a)
      break;
    var h = xt(e, a), x = h[0], d = h[1], g = h[2], v = d - g - s * x;
    (x || v) && wt(e, a) && (p += v, m += x);
    var w = a.parentNode;
    a = w && w.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? w.host : w;
  } while (
    // portaled content
    !u && a !== document.body || // self content
    u && (t.contains(a) || t === a)
  );
  return (f && Math.abs(p) < 1 || !f && Math.abs(m) < 1) && (l = !0), l;
}, se = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, et = function(e) {
  return [e.deltaX, e.deltaY];
}, tt = function(e) {
  return e && "current" in e ? e.current : e;
}, Vn = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, Un = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, Gn = 0, G = [];
function Kn(e) {
  var t = i.useRef([]), r = i.useRef([0, 0]), n = i.useRef(), o = i.useState(Gn++)[0], s = i.useState(bt)[0], c = i.useRef(e);
  i.useEffect(function() {
    c.current = e;
  }, [e]), i.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var d = pn([e.lockRef.current], (e.shards || []).map(tt), !0).filter(Boolean);
      return d.forEach(function(g) {
        return g.classList.add("allow-interactivity-".concat(o));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(o)), d.forEach(function(g) {
          return g.classList.remove("allow-interactivity-".concat(o));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var a = i.useCallback(function(d, g) {
    if ("touches" in d && d.touches.length === 2 || d.type === "wheel" && d.ctrlKey)
      return !c.current.allowPinchZoom;
    var v = se(d), w = r.current, S = "deltaX" in d ? d.deltaX : w[0] - v[0], E = "deltaY" in d ? d.deltaY : w[1] - v[1], N, A = d.target, C = Math.abs(S) > Math.abs(E) ? "h" : "v";
    if ("touches" in d && C === "h" && A.type === "range")
      return !1;
    var T = window.getSelection(), k = T && T.anchorNode, I = k ? k === A || k.contains(A) : !1;
    if (I)
      return !1;
    var j = Je(C, A);
    if (!j)
      return !0;
    if (j ? N = C : (N = C === "v" ? "h" : "v", j = Je(C, A)), !j)
      return !1;
    if (!n.current && "changedTouches" in d && (S || E) && (n.current = N), !N)
      return !0;
    var R = n.current || N;
    return Bn(R, g, d, R === "h" ? S : E);
  }, []), u = i.useCallback(function(d) {
    var g = d;
    if (!(!G.length || G[G.length - 1] !== s)) {
      var v = "deltaY" in g ? et(g) : se(g), w = t.current.filter(function(N) {
        return N.name === g.type && (N.target === g.target || g.target === N.shadowParent) && Vn(N.delta, v);
      })[0];
      if (w && w.should) {
        g.cancelable && g.preventDefault();
        return;
      }
      if (!w) {
        var S = (c.current.shards || []).map(tt).filter(Boolean).filter(function(N) {
          return N.contains(g.target);
        }), E = S.length > 0 ? a(g, S[0]) : !c.current.noIsolation;
        E && g.cancelable && g.preventDefault();
      }
    }
  }, []), l = i.useCallback(function(d, g, v, w) {
    var S = { name: d, delta: g, target: v, should: w, shadowParent: Hn(v) };
    t.current.push(S), setTimeout(function() {
      t.current = t.current.filter(function(E) {
        return E !== S;
      });
    }, 1);
  }, []), f = i.useCallback(function(d) {
    r.current = se(d), n.current = void 0;
  }, []), p = i.useCallback(function(d) {
    l(d.type, et(d), d.target, a(d, e.lockRef.current));
  }, []), m = i.useCallback(function(d) {
    l(d.type, se(d), d.target, a(d, e.lockRef.current));
  }, []);
  i.useEffect(function() {
    return G.push(s), e.setCallbacks({
      onScrollCapture: p,
      onWheelCapture: p,
      onTouchMoveCapture: m
    }), document.addEventListener("wheel", u, U), document.addEventListener("touchmove", u, U), document.addEventListener("touchstart", f, U), function() {
      G = G.filter(function(d) {
        return d !== s;
      }), document.removeEventListener("wheel", u, U), document.removeEventListener("touchmove", u, U), document.removeEventListener("touchstart", f, U);
    };
  }, []);
  var h = e.removeScrollBar, x = e.inert;
  return i.createElement(
    i.Fragment,
    null,
    x ? i.createElement(s, { styles: Un(o) }) : null,
    h ? i.createElement(_n, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function Hn(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const Yn = En(ht, Kn);
var Et = i.forwardRef(function(e, t) {
  return i.createElement(me, M({}, e, { ref: t, sideCar: Yn }));
});
Et.classNames = me.classNames;
var Xn = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, K = /* @__PURE__ */ new WeakMap(), ae = /* @__PURE__ */ new WeakMap(), ie = {}, Re = 0, Ct = function(e) {
  return e && (e.host || Ct(e.parentNode));
}, Zn = function(e, t) {
  return t.map(function(r) {
    if (e.contains(r))
      return r;
    var n = Ct(r);
    return n && e.contains(n) ? n : (console.error("aria-hidden", r, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(r) {
    return !!r;
  });
}, qn = function(e, t, r, n) {
  var o = Zn(t, Array.isArray(e) ? e : [e]);
  ie[r] || (ie[r] = /* @__PURE__ */ new WeakMap());
  var s = ie[r], c = [], a = /* @__PURE__ */ new Set(), u = new Set(o), l = function(p) {
    !p || a.has(p) || (a.add(p), l(p.parentNode));
  };
  o.forEach(l);
  var f = function(p) {
    !p || u.has(p) || Array.prototype.forEach.call(p.children, function(m) {
      if (a.has(m))
        f(m);
      else
        try {
          var h = m.getAttribute(n), x = h !== null && h !== "false", d = (K.get(m) || 0) + 1, g = (s.get(m) || 0) + 1;
          K.set(m, d), s.set(m, g), c.push(m), d === 1 && x && ae.set(m, !0), g === 1 && m.setAttribute(r, "true"), x || m.setAttribute(n, "true");
        } catch (v) {
          console.error("aria-hidden: cannot operate on ", m, v);
        }
    });
  };
  return f(t), a.clear(), Re++, function() {
    c.forEach(function(p) {
      var m = K.get(p) - 1, h = s.get(p) - 1;
      K.set(p, m), s.set(p, h), m || (ae.has(p) || p.removeAttribute(n), ae.delete(p)), h || p.removeAttribute(r);
    }), Re--, Re || (K = /* @__PURE__ */ new WeakMap(), K = /* @__PURE__ */ new WeakMap(), ae = /* @__PURE__ */ new WeakMap(), ie = {});
  };
}, Qn = function(e, t, r) {
  r === void 0 && (r = "data-aria-hidden");
  var n = Array.from(Array.isArray(e) ? e : [e]), o = Xn(e);
  return o ? (n.push.apply(n, Array.from(o.querySelectorAll("[aria-live], script"))), qn(n, o, r, "aria-hidden")) : function() {
    return null;
  };
};
// @__NO_SIDE_EFFECTS__
function Jn(e) {
  const t = /* @__PURE__ */ eo(e), r = i.forwardRef((n, o) => {
    const { children: s, ...c } = n, a = i.Children.toArray(s), u = a.find(ro);
    if (u) {
      const l = u.props.children, f = a.map((p) => p === u ? i.Children.count(l) > 1 ? i.Children.only(null) : i.isValidElement(l) ? l.props.children : null : p);
      return /* @__PURE__ */ y.jsx(t, { ...c, ref: o, children: i.isValidElement(l) ? i.cloneElement(l, void 0, f) : null });
    }
    return /* @__PURE__ */ y.jsx(t, { ...c, ref: o, children: s });
  });
  return r.displayName = `${e}.Slot`, r;
}
// @__NO_SIDE_EFFECTS__
function eo(e) {
  const t = i.forwardRef((r, n) => {
    const { children: o, ...s } = r;
    if (i.isValidElement(o)) {
      const c = oo(o), a = no(s, o.props);
      return o.type !== i.Fragment && (a.ref = n ? fe(n, c) : c), i.cloneElement(o, a);
    }
    return i.Children.count(o) > 1 ? i.Children.only(null) : null;
  });
  return t.displayName = `${e}.SlotClone`, t;
}
var to = Symbol("radix.slottable");
function ro(e) {
  return i.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === to;
}
function no(e, t) {
  const r = { ...t };
  for (const n in t) {
    const o = e[n], s = t[n];
    /^on[A-Z]/.test(n) ? o && s ? r[n] = (...a) => {
      const u = s(...a);
      return o(...a), u;
    } : o && (r[n] = o) : n === "style" ? r[n] = { ...o, ...s } : n === "className" && (r[n] = [o, s].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
function oo(e) {
  var n, o;
  let t = (n = Object.getOwnPropertyDescriptor(e.props, "ref")) == null ? void 0 : n.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = (o = Object.getOwnPropertyDescriptor(e, "ref")) == null ? void 0 : o.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
var ge = "Dialog", [St] = Tr(ge), [so, O] = St(ge), Rt = (e) => {
  const {
    __scopeDialog: t,
    children: r,
    open: n,
    defaultOpen: o,
    onOpenChange: s,
    modal: c = !0
  } = e, a = i.useRef(null), u = i.useRef(null), [l, f] = _r({
    prop: n,
    defaultProp: o ?? !1,
    onChange: s,
    caller: ge
  });
  return /* @__PURE__ */ y.jsx(
    so,
    {
      scope: t,
      triggerRef: a,
      contentRef: u,
      contentId: be(),
      titleId: be(),
      descriptionId: be(),
      open: l,
      onOpenChange: f,
      onOpenToggle: i.useCallback(() => f((p) => !p), [f]),
      modal: c,
      children: r
    }
  );
};
Rt.displayName = ge;
var Pt = "DialogTrigger", Nt = i.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = O(Pt, r), s = V(t, o.triggerRef);
    return /* @__PURE__ */ y.jsx(
      L.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": o.open,
        "aria-controls": o.contentId,
        "data-state": De(o.open),
        ...n,
        ref: s,
        onClick: z(e.onClick, o.onOpenToggle)
      }
    );
  }
);
Nt.displayName = Pt;
var Me = "DialogPortal", [ao, At] = St(Me, {
  forceMount: void 0
}), Ot = (e) => {
  const { __scopeDialog: t, forceMount: r, children: n, container: o } = e, s = O(Me, t);
  return /* @__PURE__ */ y.jsx(ao, { scope: t, forceMount: r, children: i.Children.map(n, (c) => /* @__PURE__ */ y.jsx(pe, { present: r || s.open, children: /* @__PURE__ */ y.jsx(mt, { asChild: !0, container: o, children: c }) })) });
};
Ot.displayName = Me;
var de = "DialogOverlay", Tt = i.forwardRef(
  (e, t) => {
    const r = At(de, e.__scopeDialog), { forceMount: n = r.forceMount, ...o } = e, s = O(de, e.__scopeDialog);
    return s.modal ? /* @__PURE__ */ y.jsx(pe, { present: n || s.open, children: /* @__PURE__ */ y.jsx(co, { ...o, ref: t }) }) : null;
  }
);
Tt.displayName = de;
var io = /* @__PURE__ */ Jn("DialogOverlay.RemoveScroll"), co = i.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = O(de, r);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ y.jsx(Et, { as: io, allowPinchZoom: !0, shards: [o.contentRef], children: /* @__PURE__ */ y.jsx(
        L.div,
        {
          "data-state": De(o.open),
          ...n,
          ref: t,
          style: { pointerEvents: "auto", ...n.style }
        }
      ) })
    );
  }
), B = "DialogContent", kt = i.forwardRef(
  (e, t) => {
    const r = At(B, e.__scopeDialog), { forceMount: n = r.forceMount, ...o } = e, s = O(B, e.__scopeDialog);
    return /* @__PURE__ */ y.jsx(pe, { present: n || s.open, children: s.modal ? /* @__PURE__ */ y.jsx(lo, { ...o, ref: t }) : /* @__PURE__ */ y.jsx(uo, { ...o, ref: t }) });
  }
);
kt.displayName = B;
var lo = i.forwardRef(
  (e, t) => {
    const r = O(B, e.__scopeDialog), n = i.useRef(null), o = V(t, r.contentRef, n);
    return i.useEffect(() => {
      const s = n.current;
      if (s) return Qn(s);
    }, []), /* @__PURE__ */ y.jsx(
      Mt,
      {
        ...e,
        ref: o,
        trapFocus: r.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: z(e.onCloseAutoFocus, (s) => {
          var c;
          s.preventDefault(), (c = r.triggerRef.current) == null || c.focus();
        }),
        onPointerDownOutside: z(e.onPointerDownOutside, (s) => {
          const c = s.detail.originalEvent, a = c.button === 0 && c.ctrlKey === !0;
          (c.button === 2 || a) && s.preventDefault();
        }),
        onFocusOutside: z(
          e.onFocusOutside,
          (s) => s.preventDefault()
        )
      }
    );
  }
), uo = i.forwardRef(
  (e, t) => {
    const r = O(B, e.__scopeDialog), n = i.useRef(!1), o = i.useRef(!1);
    return /* @__PURE__ */ y.jsx(
      Mt,
      {
        ...e,
        ref: t,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (s) => {
          var c, a;
          (c = e.onCloseAutoFocus) == null || c.call(e, s), s.defaultPrevented || (n.current || (a = r.triggerRef.current) == null || a.focus(), s.preventDefault()), n.current = !1, o.current = !1;
        },
        onInteractOutside: (s) => {
          var u, l;
          (u = e.onInteractOutside) == null || u.call(e, s), s.defaultPrevented || (n.current = !0, s.detail.originalEvent.type === "pointerdown" && (o.current = !0));
          const c = s.target;
          ((l = r.triggerRef.current) == null ? void 0 : l.contains(c)) && s.preventDefault(), s.detail.originalEvent.type === "focusin" && o.current && s.preventDefault();
        }
      }
    );
  }
), Mt = i.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, trapFocus: n, onOpenAutoFocus: o, onCloseAutoFocus: s, ...c } = e, a = O(B, r), u = i.useRef(null), l = V(t, u);
    return fn(), /* @__PURE__ */ y.jsxs(y.Fragment, { children: [
      /* @__PURE__ */ y.jsx(
        ft,
        {
          asChild: !0,
          loop: !0,
          trapped: n,
          onMountAutoFocus: o,
          onUnmountAutoFocus: s,
          children: /* @__PURE__ */ y.jsx(
            ut,
            {
              role: "dialog",
              id: a.contentId,
              "aria-describedby": a.descriptionId,
              "aria-labelledby": a.titleId,
              "data-state": De(a.open),
              ...c,
              ref: l,
              onDismiss: () => a.onOpenChange(!1)
            }
          )
        }
      ),
      /* @__PURE__ */ y.jsxs(y.Fragment, { children: [
        /* @__PURE__ */ y.jsx(fo, { titleId: a.titleId }),
        /* @__PURE__ */ y.jsx(mo, { contentRef: u, descriptionId: a.descriptionId })
      ] })
    ] });
  }
), Ie = "DialogTitle", It = i.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = O(Ie, r);
    return /* @__PURE__ */ y.jsx(L.h2, { id: o.titleId, ...n, ref: t });
  }
);
It.displayName = Ie;
var Dt = "DialogDescription", _t = i.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = O(Dt, r);
    return /* @__PURE__ */ y.jsx(L.p, { id: o.descriptionId, ...n, ref: t });
  }
);
_t.displayName = Dt;
var Lt = "DialogClose", jt = i.forwardRef(
  (e, t) => {
    const { __scopeDialog: r, ...n } = e, o = O(Lt, r);
    return /* @__PURE__ */ y.jsx(
      L.button,
      {
        type: "button",
        ...n,
        ref: t,
        onClick: z(e.onClick, () => o.onOpenChange(!1))
      }
    );
  }
);
jt.displayName = Lt;
function De(e) {
  return e ? "open" : "closed";
}
var Ft = "DialogTitleWarning", [wo, Wt] = Or(Ft, {
  contentName: B,
  titleName: Ie,
  docsSlug: "dialog"
}), fo = ({ titleId: e }) => {
  const t = Wt(Ft), r = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
  return i.useEffect(() => {
    e && (document.getElementById(e) || console.error(r));
  }, [r, e]), null;
}, po = "DialogDescriptionWarning", mo = ({ contentRef: e, descriptionId: t }) => {
  const n = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${Wt(po).contentName}}.`;
  return i.useEffect(() => {
    var s;
    const o = (s = e.current) == null ? void 0 : s.getAttribute("aria-describedby");
    t && o && (document.getElementById(t) || console.warn(n));
  }, [n, e, t]), null;
}, xo = Rt, Eo = Nt, Co = Ot, So = Tt, Ro = kt, Po = It, No = _t, Ao = jt;
export {
  Ro as C,
  No as D,
  So as O,
  Co as P,
  xo as R,
  bo as S,
  Po as T,
  yo as a,
  Eo as b,
  Pe as c,
  Ao as d,
  ho as r,
  vo as t
};
