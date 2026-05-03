import { c as fn, r as ee, a as Et, g as dn } from "./react-vendor.js";
import { r as Xe } from "./ui-vendor.js";
var mr = { exports: {} }, He = {}, vt = { exports: {} };
(function(t, e) {
  (function(r, n) {
    n(e);
  })(fn, function(r) {
    function n(g) {
      return function(M, C, j, H, q, Z, k) {
        return g(M, C, k);
      };
    }
    function o(g) {
      return function(M, C, j, H) {
        if (!M || !C || typeof M != "object" || typeof C != "object")
          return g(M, C, j, H);
        var q = H.get(M), Z = H.get(C);
        if (q && Z)
          return q === C && Z === M;
        H.set(M, C), H.set(C, M);
        var k = g(M, C, j, H);
        return H.delete(M), H.delete(C), k;
      };
    }
    function i(g, O) {
      var M = {};
      for (var C in g)
        M[C] = g[C];
      for (var C in O)
        M[C] = O[C];
      return M;
    }
    function s(g) {
      return g.constructor === Object || g.constructor == null;
    }
    function l(g) {
      return typeof g.then == "function";
    }
    function a(g, O) {
      return g === O || g !== g && O !== O;
    }
    var u = "[object Arguments]", c = "[object Boolean]", d = "[object Date]", f = "[object RegExp]", v = "[object Map]", S = "[object Number]", E = "[object Object]", _ = "[object Set]", p = "[object String]", y = Object.prototype.toString;
    function h(g) {
      var O = g.areArraysEqual, M = g.areDatesEqual, C = g.areMapsEqual, j = g.areObjectsEqual, H = g.areRegExpsEqual, q = g.areSetsEqual, Z = g.createIsNestedEqual, k = Z(te);
      function te(T, W, re) {
        if (T === W)
          return !0;
        if (!T || !W || typeof T != "object" || typeof W != "object")
          return T !== T && W !== W;
        if (s(T) && s(W))
          return j(T, W, k, re);
        var Kt = Array.isArray(T), Zt = Array.isArray(W);
        if (Kt || Zt)
          return Kt === Zt && O(T, W, k, re);
        var ne = y.call(T);
        return ne !== y.call(W) ? !1 : ne === d ? M(T, W, k, re) : ne === f ? H(T, W, k, re) : ne === v ? C(T, W, k, re) : ne === _ ? q(T, W, k, re) : ne === E || ne === u ? l(T) || l(W) ? !1 : j(T, W, k, re) : ne === c || ne === S || ne === p ? a(T.valueOf(), W.valueOf()) : !1;
      }
      return te;
    }
    function b(g, O, M, C) {
      var j = g.length;
      if (O.length !== j)
        return !1;
      for (; j-- > 0; )
        if (!M(g[j], O[j], j, j, g, O, C))
          return !1;
      return !0;
    }
    var m = o(b);
    function x(g, O) {
      return a(g.valueOf(), O.valueOf());
    }
    function N(g, O, M, C) {
      var j = g.size === O.size;
      if (!j)
        return !1;
      if (!g.size)
        return !0;
      var H = {}, q = 0;
      return g.forEach(function(Z, k) {
        if (j) {
          var te = !1, T = 0;
          O.forEach(function(W, re) {
            !te && !H[T] && (te = M(k, re, q, T, g, O, C) && M(Z, W, k, re, g, O, C)) && (H[T] = !0), T++;
          }), q++, j = te;
        }
      }), j;
    }
    var $ = o(N), F = "_owner", U = Object.prototype.hasOwnProperty;
    function xe(g, O, M, C) {
      var j = Object.keys(g), H = j.length;
      if (Object.keys(O).length !== H)
        return !1;
      for (var q; H-- > 0; ) {
        if (q = j[H], q === F) {
          var Z = !!g.$$typeof, k = !!O.$$typeof;
          if ((Z || k) && Z !== k)
            return !1;
        }
        if (!U.call(O, q) || !M(g[q], O[q], q, q, g, O, C))
          return !1;
      }
      return !0;
    }
    var at = o(xe);
    function ze(g, O) {
      return g.source === O.source && g.flags === O.flags;
    }
    function Ce(g, O, M, C) {
      var j = g.size === O.size;
      if (!j)
        return !1;
      if (!g.size)
        return !0;
      var H = {};
      return g.forEach(function(q, Z) {
        if (j) {
          var k = !1, te = 0;
          O.forEach(function(T, W) {
            !k && !H[te] && (k = M(q, T, Z, W, g, O, C)) && (H[te] = !0), te++;
          }), j = k;
        }
      }), j;
    }
    var Vt = o(Ce), fe = Object.freeze({
      areArraysEqual: b,
      areDatesEqual: x,
      areMapsEqual: N,
      areObjectsEqual: xe,
      areRegExpsEqual: ze,
      areSetsEqual: Ce,
      createIsNestedEqual: n
    }), de = Object.freeze({
      areArraysEqual: m,
      areDatesEqual: x,
      areMapsEqual: $,
      areObjectsEqual: at,
      areRegExpsEqual: ze,
      areSetsEqual: Vt,
      createIsNestedEqual: n
    }), Ne = h(fe);
    function lt(g, O) {
      return Ne(g, O, void 0);
    }
    var rn = h(i(fe, { createIsNestedEqual: function() {
      return a;
    } }));
    function nn(g, O) {
      return rn(g, O, void 0);
    }
    var on = h(de);
    function sn(g, O) {
      return on(g, O, /* @__PURE__ */ new WeakMap());
    }
    var an = h(i(de, {
      createIsNestedEqual: function() {
        return a;
      }
    }));
    function ln(g, O) {
      return an(g, O, /* @__PURE__ */ new WeakMap());
    }
    function un(g) {
      return h(i(fe, g(fe)));
    }
    function cn(g) {
      var O = h(i(de, g(de)));
      return function(M, C, j) {
        return j === void 0 && (j = /* @__PURE__ */ new WeakMap()), O(M, C, j);
      };
    }
    r.circularDeepEqual = sn, r.circularShallowEqual = ln, r.createCustomCircularEqual = cn, r.createCustomEqual = un, r.deepEqual = lt, r.sameValueZeroEqual = a, r.shallowEqual = nn, Object.defineProperty(r, "__esModule", { value: !0 });
  });
})(vt, vt.exports);
var xt = vt.exports, R = {}, pn = function(e, r, n) {
  return e === r ? !0 : e.className === r.className && n(e.style, r.style) && e.width === r.width && e.autoSize === r.autoSize && e.cols === r.cols && e.draggableCancel === r.draggableCancel && e.draggableHandle === r.draggableHandle && n(e.verticalCompact, r.verticalCompact) && n(e.compactType, r.compactType) && n(e.layout, r.layout) && n(e.margin, r.margin) && n(e.containerPadding, r.containerPadding) && e.rowHeight === r.rowHeight && e.maxRows === r.maxRows && e.isBounded === r.isBounded && e.isDraggable === r.isDraggable && e.isResizable === r.isResizable && e.allowOverlap === r.allowOverlap && e.preventCollision === r.preventCollision && e.useCSSTransforms === r.useCSSTransforms && e.transformScale === r.transformScale && e.isDroppable === r.isDroppable && n(e.resizeHandles, r.resizeHandles) && n(e.resizeHandle, r.resizeHandle) && e.onLayoutChange === r.onLayoutChange && e.onDragStart === r.onDragStart && e.onDrag === r.onDrag && e.onDragStop === r.onDragStop && e.onResizeStart === r.onResizeStart && e.onResize === r.onResize && e.onResizeStop === r.onResizeStop && e.onDrop === r.onDrop && n(e.droppingItem, r.droppingItem) && n(e.innerRef, r.innerRef);
};
Object.defineProperty(R, "__esModule", {
  value: !0
});
R.bottom = Ue;
R.childrenEqual = bn;
R.cloneLayout = yr;
R.cloneLayoutItem = ve;
R.collides = Ve;
R.compact = br;
R.compactItem = wr;
R.compactType = Tn;
R.correctBounds = Or;
R.fastPositionEqual = wn;
R.fastRGLPropsEqual = void 0;
R.getAllCollisions = Sr;
R.getFirstCollision = me;
R.getLayoutItem = zt;
R.getStatics = Ct;
R.modifyLayout = vr;
R.moveElement = Te;
R.moveElementAwayFromCollision = wt;
R.noop = void 0;
R.perc = Sn;
R.resizeItemInDirection = xn;
R.setTopLeft = Cn;
R.setTransform = zn;
R.sortLayoutItems = kt;
R.sortLayoutItemsByColRow = Er;
R.sortLayoutItemsByRowCol = Rr;
R.synchronizeLayoutWithChildren = jn;
R.validateLayout = Mn;
R.withLayoutItem = vn;
var Jt = xt, Me = hn(ee);
function hn(t) {
  return t && t.__esModule ? t : { default: t };
}
function Qt(t, e) {
  var r = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    e && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Be(t) {
  for (var e = 1; e < arguments.length; e++) {
    var r = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Qt(Object(r), !0).forEach(function(n) {
      gn(t, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : Qt(Object(r)).forEach(function(n) {
      Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return t;
}
function gn(t, e, r) {
  return (e = mn(e)) in t ? Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = r, t;
}
function mn(t) {
  var e = yn(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function yn(t, e) {
  if (typeof t != "object" || !t) return t;
  var r = t[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(t, e);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function Ue(t) {
  let e = 0, r;
  for (let n = 0, o = t.length; n < o; n++)
    r = t[n].y + t[n].h, r > e && (e = r);
  return e;
}
function yr(t) {
  const e = Array(t.length);
  for (let r = 0, n = t.length; r < n; r++)
    e[r] = ve(t[r]);
  return e;
}
function vr(t, e) {
  const r = Array(t.length);
  for (let n = 0, o = t.length; n < o; n++)
    e.i === t[n].i ? r[n] = e : r[n] = t[n];
  return r;
}
function vn(t, e, r) {
  let n = zt(t, e);
  return n ? (n = r(ve(n)), t = vr(t, n), [t, n]) : [t, null];
}
function ve(t) {
  return {
    w: t.w,
    h: t.h,
    x: t.x,
    y: t.y,
    i: t.i,
    minW: t.minW,
    maxW: t.maxW,
    minH: t.minH,
    maxH: t.maxH,
    moved: !!t.moved,
    static: !!t.static,
    // These can be null/undefined
    isDraggable: t.isDraggable,
    isResizable: t.isResizable,
    resizeHandles: t.resizeHandles,
    isBounded: t.isBounded
  };
}
function bn(t, e) {
  return (0, Jt.deepEqual)(Me.default.Children.map(t, (r) => r == null ? void 0 : r.key), Me.default.Children.map(e, (r) => r == null ? void 0 : r.key)) && (0, Jt.deepEqual)(Me.default.Children.map(t, (r) => r == null ? void 0 : r.props["data-grid"]), Me.default.Children.map(e, (r) => r == null ? void 0 : r.props["data-grid"]));
}
R.fastRGLPropsEqual = pn;
function wn(t, e) {
  return t.left === e.left && t.top === e.top && t.width === e.width && t.height === e.height;
}
function Ve(t, e) {
  return !(t.i === e.i || t.x + t.w <= e.x || t.x >= e.x + e.w || t.y + t.h <= e.y || t.y >= e.y + e.h);
}
function br(t, e, r, n) {
  const o = Ct(t);
  let i = Ue(o);
  const s = kt(t, e), l = Array(t.length);
  for (let a = 0, u = s.length; a < u; a++) {
    let c = ve(s[a]);
    c.static || (c = wr(o, c, e, r, s, n, i), i = Math.max(i, c.y + c.h), o.push(c)), l[t.indexOf(s[a])] = c, c.moved = !1;
  }
  return l;
}
const On = {
  x: "w",
  y: "h"
};
function bt(t, e, r, n) {
  const o = On[n];
  e[n] += 1;
  const i = t.map((s) => s.i).indexOf(e.i);
  for (let s = i + 1; s < t.length; s++) {
    const l = t[s];
    if (!l.static) {
      if (l.y > e.y + e.h) break;
      Ve(e, l) && bt(t, l, r + e[o], n);
    }
  }
  e[n] = r;
}
function wr(t, e, r, n, o, i, s) {
  const l = r === "vertical", a = r === "horizontal";
  if (l)
    for (typeof s == "number" ? e.y = Math.min(s, e.y) : e.y = Math.min(Ue(t), e.y); e.y > 0 && !me(t, e); )
      e.y--;
  else if (a)
    for (; e.x > 0 && !me(t, e); )
      e.x--;
  let u;
  for (; (u = me(t, e)) && !(r === null && i); )
    if (a ? bt(o, e, u.x + u.w, "x") : bt(o, e, u.y + u.h, "y"), a && e.x + e.w > n)
      for (e.x = n - e.w, e.y++; e.x > 0 && !me(t, e); )
        e.x--;
  return e.y = Math.max(e.y, 0), e.x = Math.max(e.x, 0), e;
}
function Or(t, e) {
  const r = Ct(t);
  for (let n = 0, o = t.length; n < o; n++) {
    const i = t[n];
    if (i.x + i.w > e.cols && (i.x = e.cols - i.w), i.x < 0 && (i.x = 0, i.w = e.cols), !i.static) r.push(i);
    else
      for (; me(r, i); )
        i.y++;
  }
  return t;
}
function zt(t, e) {
  for (let r = 0, n = t.length; r < n; r++)
    if (t[r].i === e) return t[r];
}
function me(t, e) {
  for (let r = 0, n = t.length; r < n; r++)
    if (Ve(t[r], e)) return t[r];
}
function Sr(t, e) {
  return t.filter((r) => Ve(r, e));
}
function Ct(t) {
  return t.filter((e) => e.static);
}
function Te(t, e, r, n, o, i, s, l, a) {
  if (e.static && e.isDraggable !== !0 || e.y === n && e.x === r) return t;
  "Moving element ".concat(e.i, " to [").concat(String(r), ",").concat(String(n), "] from [").concat(e.x, ",").concat(e.y, "]");
  const u = e.x, c = e.y;
  typeof r == "number" && (e.x = r), typeof n == "number" && (e.y = n), e.moved = !0;
  let d = kt(t, s);
  (s === "vertical" && typeof n == "number" ? c >= n : s === "horizontal" && typeof r == "number" ? u >= r : !1) && (d = d.reverse());
  const v = Sr(d, e), S = v.length > 0;
  if (S && a)
    return yr(t);
  if (S && i)
    return "Collision prevented on ".concat(e.i, ", reverting."), e.x = u, e.y = c, e.moved = !1, t;
  for (let E = 0, _ = v.length; E < _; E++) {
    const p = v[E];
    "Resolving collision between ".concat(e.i, " at [").concat(e.x, ",").concat(e.y, "] and ").concat(p.i, " at [").concat(p.x, ",").concat(p.y, "]"), !p.moved && (p.static ? t = wt(t, p, e, o, s) : t = wt(t, e, p, o, s));
  }
  return t;
}
function wt(t, e, r, n, o, i) {
  const s = o === "horizontal", l = o === "vertical", a = e.static;
  if (n) {
    n = !1;
    const d = {
      x: s ? Math.max(e.x - r.w, 0) : r.x,
      y: l ? Math.max(e.y - r.h, 0) : r.y,
      w: r.w,
      h: r.h,
      i: "-1"
    }, f = me(t, d), v = f && f.y + f.h > e.y, S = f && e.x + e.w > f.x;
    if (f) {
      if (v && l)
        return Te(t, r, void 0, r.y + 1, n, a, o);
      if (v && o == null)
        return e.y = r.y, r.y = r.y + r.h, t;
      if (S && s)
        return Te(t, e, r.x, void 0, n, a, o);
    } else return "Doing reverse collision on ".concat(r.i, " up to [").concat(d.x, ",").concat(d.y, "]."), Te(t, r, s ? d.x : void 0, l ? d.y : void 0, n, a, o);
  }
  const u = s ? r.x + 1 : void 0, c = l ? r.y + 1 : void 0;
  return u == null && c == null ? t : Te(t, r, s ? r.x + 1 : void 0, l ? r.y + 1 : void 0, n, a, o);
}
function Sn(t) {
  return t * 100 + "%";
}
const _r = (t, e, r, n) => t + r > n ? e : r, Dr = (t, e, r) => t < 0 ? e : r, Pr = (t) => Math.max(0, t), jt = (t) => Math.max(0, t), Mt = (t, e, r) => {
  let {
    left: n,
    height: o,
    width: i
  } = e;
  const s = t.top - (o - t.height);
  return {
    left: n,
    width: i,
    height: Dr(s, t.height, o),
    top: jt(s)
  };
}, Tt = (t, e, r) => {
  let {
    top: n,
    left: o,
    height: i,
    width: s
  } = e;
  return {
    top: n,
    height: i,
    width: _r(t.left, t.width, s, r),
    left: Pr(o)
  };
}, Lt = (t, e, r) => {
  let {
    top: n,
    height: o,
    width: i
  } = e;
  const s = t.left - (i - t.width);
  return {
    height: o,
    width: s < 0 ? t.width : _r(t.left, t.width, i, r),
    top: jt(n),
    left: Pr(s)
  };
}, Ht = (t, e, r) => {
  let {
    top: n,
    left: o,
    height: i,
    width: s
  } = e;
  return {
    width: s,
    left: o,
    height: Dr(n, t.height, i),
    top: jt(n)
  };
}, _n = function() {
  return Mt(arguments.length <= 0 ? void 0 : arguments[0], Tt(...arguments));
}, Dn = function() {
  return Mt(arguments.length <= 0 ? void 0 : arguments[0], Lt(...arguments));
}, Pn = function() {
  return Ht(arguments.length <= 0 ? void 0 : arguments[0], Tt(...arguments));
}, Rn = function() {
  return Ht(arguments.length <= 0 ? void 0 : arguments[0], Lt(...arguments));
}, En = {
  n: Mt,
  ne: _n,
  e: Tt,
  se: Pn,
  s: Ht,
  sw: Rn,
  w: Lt,
  nw: Dn
};
function xn(t, e, r, n) {
  const o = En[t];
  return o ? o(e, Be(Be({}, e), r), n) : r;
}
function zn(t) {
  let {
    top: e,
    left: r,
    width: n,
    height: o
  } = t;
  const i = "translate(".concat(r, "px,").concat(e, "px)");
  return {
    transform: i,
    WebkitTransform: i,
    MozTransform: i,
    msTransform: i,
    OTransform: i,
    width: "".concat(n, "px"),
    height: "".concat(o, "px"),
    position: "absolute"
  };
}
function Cn(t) {
  let {
    top: e,
    left: r,
    width: n,
    height: o
  } = t;
  return {
    top: "".concat(e, "px"),
    left: "".concat(r, "px"),
    width: "".concat(n, "px"),
    height: "".concat(o, "px"),
    position: "absolute"
  };
}
function kt(t, e) {
  return e === "horizontal" ? Er(t) : e === "vertical" ? Rr(t) : t;
}
function Rr(t) {
  return t.slice(0).sort(function(e, r) {
    return e.y > r.y || e.y === r.y && e.x > r.x ? 1 : e.y === r.y && e.x === r.x ? 0 : -1;
  });
}
function Er(t) {
  return t.slice(0).sort(function(e, r) {
    return e.x > r.x || e.x === r.x && e.y > r.y ? 1 : -1;
  });
}
function jn(t, e, r, n, o) {
  t = t || [];
  const i = [];
  Me.default.Children.forEach(e, (l) => {
    if ((l == null ? void 0 : l.key) == null) return;
    const a = zt(t, String(l.key)), u = l.props["data-grid"];
    a && u == null ? i.push(ve(a)) : u ? i.push(ve(Be(Be({}, u), {}, {
      i: l.key
    }))) : i.push(ve({
      w: 1,
      h: 1,
      x: 0,
      y: Ue(i),
      i: String(l.key)
    }));
  });
  const s = Or(i, {
    cols: r
  });
  return o ? s : br(s, n, r);
}
function Mn(t) {
  let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "Layout";
  const r = ["x", "y", "w", "h"];
  if (!Array.isArray(t)) throw new Error(e + " must be an array!");
  for (let n = 0, o = t.length; n < o; n++) {
    const i = t[n];
    for (let s = 0; s < r.length; s++) {
      const l = r[s], a = i[l];
      if (typeof a != "number" || Number.isNaN(a))
        throw new Error("ReactGridLayout: ".concat(e, "[").concat(n, "].").concat(l, " must be a number! Received: ").concat(a, " (").concat(typeof a, ")"));
    }
    if (typeof i.i < "u" && typeof i.i != "string")
      throw new Error("ReactGridLayout: ".concat(e, "[").concat(n, "].i must be a string! Received: ").concat(i.i, " (").concat(typeof i.i, ")"));
  }
}
function Tn(t) {
  const {
    verticalCompact: e,
    compactType: r
  } = t || {};
  return e === !1 ? null : r;
}
const Ln = () => {
};
R.noop = Ln;
var oe = {};
Object.defineProperty(oe, "__esModule", {
  value: !0
});
oe.calcGridColWidth = Ke;
oe.calcGridItemPosition = Hn;
oe.calcGridItemWHPx = Ot;
oe.calcWH = Wn;
oe.calcXY = kn;
oe.clamp = ye;
function Ke(t) {
  const {
    margin: e,
    containerPadding: r,
    containerWidth: n,
    cols: o
  } = t;
  return (n - e[0] * (o - 1) - r[0] * 2) / o;
}
function Ot(t, e, r) {
  return Number.isFinite(t) ? Math.round(e * t + Math.max(0, t - 1) * r) : t;
}
function Hn(t, e, r, n, o, i) {
  const {
    margin: s,
    containerPadding: l,
    rowHeight: a
  } = t, u = Ke(t), c = {};
  return i && i.resizing ? (c.width = Math.round(i.resizing.width), c.height = Math.round(i.resizing.height)) : (c.width = Ot(n, u, s[0]), c.height = Ot(o, a, s[1])), i && i.dragging ? (c.top = Math.round(i.dragging.top), c.left = Math.round(i.dragging.left)) : i && i.resizing && typeof i.resizing.top == "number" && typeof i.resizing.left == "number" ? (c.top = Math.round(i.resizing.top), c.left = Math.round(i.resizing.left)) : (c.top = Math.round((a + s[1]) * r + l[1]), c.left = Math.round((u + s[0]) * e + l[0])), c;
}
function kn(t, e, r, n, o) {
  const {
    margin: i,
    containerPadding: s,
    cols: l,
    rowHeight: a,
    maxRows: u
  } = t, c = Ke(t);
  let d = Math.round((r - s[0]) / (c + i[0])), f = Math.round((e - s[1]) / (a + i[1]));
  return d = ye(d, 0, l - n), f = ye(f, 0, u - o), {
    x: d,
    y: f
  };
}
function Wn(t, e, r, n, o, i) {
  const {
    margin: s,
    maxRows: l,
    cols: a,
    rowHeight: u
  } = t, c = Ke(t);
  let d = Math.round((e + s[0]) / (c + s[0])), f = Math.round((r + s[1]) / (u + s[1])), v = ye(d, 0, a - n), S = ye(f, 0, l - o);
  return ["sw", "w", "nw"].indexOf(i) !== -1 && (v = ye(d, 0, a)), ["nw", "n", "ne"].indexOf(i) !== -1 && (S = ye(f, 0, l)), {
    w: v,
    h: S
  };
}
function ye(t, e, r) {
  return Math.max(Math.min(t, r), e);
}
var Ze = {}, xr = { exports: {} }, Nn = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED", $n = Nn, qn = $n;
function zr() {
}
function Cr() {
}
Cr.resetWarningCache = zr;
var In = function() {
  function t(n, o, i, s, l, a) {
    if (a !== qn) {
      var u = new Error(
        "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
      );
      throw u.name = "Invariant Violation", u;
    }
  }
  t.isRequired = t;
  function e() {
    return t;
  }
  var r = {
    array: t,
    bigint: t,
    bool: t,
    func: t,
    number: t,
    object: t,
    string: t,
    symbol: t,
    any: t,
    arrayOf: e,
    element: t,
    elementType: t,
    instanceOf: e,
    node: t,
    objectOf: e,
    oneOf: e,
    oneOfType: e,
    shape: e,
    exact: e,
    checkPropTypes: Cr,
    resetWarningCache: zr
  };
  return r.PropTypes = r, r;
};
xr.exports = In();
var ce = xr.exports, Je = { exports: {} }, jr = {}, L = {}, ie = {};
Object.defineProperty(ie, "__esModule", {
  value: !0
});
ie.dontSetMe = Fn;
ie.findInArray = An;
ie.int = Yn;
ie.isFunction = Bn;
ie.isNum = Gn;
function An(t, e) {
  for (let r = 0, n = t.length; r < n; r++)
    if (e.apply(e, [t[r], r, t])) return t[r];
}
function Bn(t) {
  return typeof t == "function" || Object.prototype.toString.call(t) === "[object Function]";
}
function Gn(t) {
  return typeof t == "number" && !isNaN(t);
}
function Yn(t) {
  return parseInt(t, 10);
}
function Fn(t, e, r) {
  if (t[e])
    return new Error(`Invalid prop ${e} passed to ${r} - do not set this, set it on the child.`);
}
var be = {};
Object.defineProperty(be, "__esModule", {
  value: !0
});
be.browserPrefixToKey = Tr;
be.browserPrefixToStyle = Xn;
be.default = void 0;
be.getPrefix = Mr;
const ut = ["Moz", "Webkit", "O", "ms"];
function Mr() {
  var r, n;
  let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "transform";
  if (typeof window > "u") return "";
  const e = (n = (r = window.document) == null ? void 0 : r.documentElement) == null ? void 0 : n.style;
  if (!e || t in e) return "";
  for (let o = 0; o < ut.length; o++)
    if (Tr(t, ut[o]) in e) return ut[o];
  return "";
}
function Tr(t, e) {
  return e ? `${e}${Un(t)}` : t;
}
function Xn(t, e) {
  return e ? `-${e.toLowerCase()}-${t}` : t;
}
function Un(t) {
  let e = "", r = !0;
  for (let n = 0; n < t.length; n++)
    r ? (e += t[n].toUpperCase(), r = !1) : t[n] === "-" ? r = !0 : e += t[n];
  return e;
}
be.default = Mr();
Object.defineProperty(L, "__esModule", {
  value: !0
});
L.addClassName = kr;
L.addEvent = Kn;
L.addUserSelectStyles = ao;
L.createCSSTransform = no;
L.createSVGTransform = oo;
L.getTouch = io;
L.getTouchIdentifier = so;
L.getTranslation = Wt;
L.innerHeight = eo;
L.innerWidth = to;
L.matchesSelector = Hr;
L.matchesSelectorAndParentsTo = Vn;
L.offsetXYFromParent = ro;
L.outerHeight = Jn;
L.outerWidth = Qn;
L.removeClassName = Wr;
L.removeEvent = Zn;
L.scheduleRemoveUserSelectStyles = lo;
var K = ie, er = Lr(be);
function Lr(t, e) {
  if (typeof WeakMap == "function") var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
  return (Lr = function(o, i) {
    if (!i && o && o.__esModule) return o;
    var s, l, a = { __proto__: null, default: o };
    if (o === null || typeof o != "object" && typeof o != "function") return a;
    if (s = i ? n : r) {
      if (s.has(o)) return s.get(o);
      s.set(o, a);
    }
    for (const u in o) u !== "default" && {}.hasOwnProperty.call(o, u) && ((l = (s = Object.defineProperty) && Object.getOwnPropertyDescriptor(o, u)) && (l.get || l.set) ? s(a, u, l) : a[u] = o[u]);
    return a;
  })(t, e);
}
let $e = "";
function Hr(t, e) {
  return $e || ($e = (0, K.findInArray)(["matches", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector"], function(r) {
    return (0, K.isFunction)(t[r]);
  })), (0, K.isFunction)(t[$e]) ? t[$e](e) : !1;
}
function Vn(t, e, r) {
  let n = t;
  do {
    if (Hr(n, e)) return !0;
    if (n === r) return !1;
    n = n.parentNode;
  } while (n);
  return !1;
}
function Kn(t, e, r, n) {
  if (!t) return;
  const o = {
    capture: !0,
    ...n
  };
  t.addEventListener ? t.addEventListener(e, r, o) : t.attachEvent ? t.attachEvent("on" + e, r) : t["on" + e] = r;
}
function Zn(t, e, r, n) {
  if (!t) return;
  const o = {
    capture: !0,
    ...n
  };
  t.removeEventListener ? t.removeEventListener(e, r, o) : t.detachEvent ? t.detachEvent("on" + e, r) : t["on" + e] = null;
}
function Jn(t) {
  let e = t.clientHeight;
  const r = t.ownerDocument.defaultView.getComputedStyle(t);
  return e += (0, K.int)(r.borderTopWidth), e += (0, K.int)(r.borderBottomWidth), e;
}
function Qn(t) {
  let e = t.clientWidth;
  const r = t.ownerDocument.defaultView.getComputedStyle(t);
  return e += (0, K.int)(r.borderLeftWidth), e += (0, K.int)(r.borderRightWidth), e;
}
function eo(t) {
  let e = t.clientHeight;
  const r = t.ownerDocument.defaultView.getComputedStyle(t);
  return e -= (0, K.int)(r.paddingTop), e -= (0, K.int)(r.paddingBottom), e;
}
function to(t) {
  let e = t.clientWidth;
  const r = t.ownerDocument.defaultView.getComputedStyle(t);
  return e -= (0, K.int)(r.paddingLeft), e -= (0, K.int)(r.paddingRight), e;
}
function ro(t, e, r) {
  const o = e === e.ownerDocument.body ? {
    left: 0,
    top: 0
  } : e.getBoundingClientRect(), i = (t.clientX + e.scrollLeft - o.left) / r, s = (t.clientY + e.scrollTop - o.top) / r;
  return {
    x: i,
    y: s
  };
}
function no(t, e) {
  const r = Wt(t, e, "px");
  return {
    [(0, er.browserPrefixToKey)("transform", er.default)]: r
  };
}
function oo(t, e) {
  return Wt(t, e, "");
}
function Wt(t, e, r) {
  let {
    x: n,
    y: o
  } = t, i = `translate(${n}${r},${o}${r})`;
  if (e) {
    const s = `${typeof e.x == "string" ? e.x : e.x + r}`, l = `${typeof e.y == "string" ? e.y : e.y + r}`;
    i = `translate(${s}, ${l})` + i;
  }
  return i;
}
function io(t, e) {
  return t.targetTouches && (0, K.findInArray)(t.targetTouches, (r) => e === r.identifier) || t.changedTouches && (0, K.findInArray)(t.changedTouches, (r) => e === r.identifier);
}
function so(t) {
  if (t.targetTouches && t.targetTouches[0]) return t.targetTouches[0].identifier;
  if (t.changedTouches && t.changedTouches[0]) return t.changedTouches[0].identifier;
}
function ao(t) {
  if (!t) return;
  let e = t.getElementById("react-draggable-style-el");
  e || (e = t.createElement("style"), e.type = "text/css", e.id = "react-draggable-style-el", e.innerHTML = `.react-draggable-transparent-selection *::-moz-selection {all: inherit;}
`, e.innerHTML += `.react-draggable-transparent-selection *::selection {all: inherit;}
`, t.getElementsByTagName("head")[0].appendChild(e)), t.body && kr(t.body, "react-draggable-transparent-selection");
}
function lo(t) {
  window.requestAnimationFrame ? window.requestAnimationFrame(() => {
    tr(t);
  }) : tr(t);
}
function tr(t) {
  if (t)
    try {
      if (t.body && Wr(t.body, "react-draggable-transparent-selection"), t.selection)
        t.selection.empty();
      else {
        const e = (t.defaultView || window).getSelection();
        e && e.type !== "Caret" && e.removeAllRanges();
      }
    } catch {
    }
}
function kr(t, e) {
  t.classList ? t.classList.add(e) : t.className.match(new RegExp(`(?:^|\\s)${e}(?!\\S)`)) || (t.className += ` ${e}`);
}
function Wr(t, e) {
  t.classList ? t.classList.remove(e) : t.className = t.className.replace(new RegExp(`(?:^|\\s)${e}(?!\\S)`, "g"), "");
}
var se = {};
Object.defineProperty(se, "__esModule", {
  value: !0
});
se.canDragX = fo;
se.canDragY = po;
se.createCoreData = go;
se.createDraggableData = mo;
se.getBoundPosition = uo;
se.getControlPosition = ho;
se.snapToGrid = co;
var V = ie, Pe = L;
function uo(t, e, r) {
  if (!t.props.bounds) return [e, r];
  let {
    bounds: n
  } = t.props;
  n = typeof n == "string" ? n : yo(n);
  const o = Nt(t);
  if (typeof n == "string") {
    const {
      ownerDocument: i
    } = o, s = i.defaultView;
    let l;
    if (n === "parent" ? l = o.parentNode : l = o.getRootNode().querySelector(n), !(l instanceof s.HTMLElement))
      throw new Error('Bounds selector "' + n + '" could not find an element.');
    const a = l, u = s.getComputedStyle(o), c = s.getComputedStyle(a);
    n = {
      left: -o.offsetLeft + (0, V.int)(c.paddingLeft) + (0, V.int)(u.marginLeft),
      top: -o.offsetTop + (0, V.int)(c.paddingTop) + (0, V.int)(u.marginTop),
      right: (0, Pe.innerWidth)(a) - (0, Pe.outerWidth)(o) - o.offsetLeft + (0, V.int)(c.paddingRight) - (0, V.int)(u.marginRight),
      bottom: (0, Pe.innerHeight)(a) - (0, Pe.outerHeight)(o) - o.offsetTop + (0, V.int)(c.paddingBottom) - (0, V.int)(u.marginBottom)
    };
  }
  return (0, V.isNum)(n.right) && (e = Math.min(e, n.right)), (0, V.isNum)(n.bottom) && (r = Math.min(r, n.bottom)), (0, V.isNum)(n.left) && (e = Math.max(e, n.left)), (0, V.isNum)(n.top) && (r = Math.max(r, n.top)), [e, r];
}
function co(t, e, r) {
  const n = Math.round(e / t[0]) * t[0], o = Math.round(r / t[1]) * t[1];
  return [n, o];
}
function fo(t) {
  return t.props.axis === "both" || t.props.axis === "x";
}
function po(t) {
  return t.props.axis === "both" || t.props.axis === "y";
}
function ho(t, e, r) {
  const n = typeof e == "number" ? (0, Pe.getTouch)(t, e) : null;
  if (typeof e == "number" && !n) return null;
  const o = Nt(r), i = r.props.offsetParent || o.offsetParent || o.ownerDocument.body;
  return (0, Pe.offsetXYFromParent)(n || t, i, r.props.scale);
}
function go(t, e, r) {
  const n = !(0, V.isNum)(t.lastX), o = Nt(t);
  return n ? {
    node: o,
    deltaX: 0,
    deltaY: 0,
    lastX: e,
    lastY: r,
    x: e,
    y: r
  } : {
    node: o,
    deltaX: e - t.lastX,
    deltaY: r - t.lastY,
    lastX: t.lastX,
    lastY: t.lastY,
    x: e,
    y: r
  };
}
function mo(t, e) {
  const r = t.props.scale;
  return {
    node: e.node,
    x: t.state.x + e.deltaX / r,
    y: t.state.y + e.deltaY / r,
    deltaX: e.deltaX / r,
    deltaY: e.deltaY / r,
    lastX: t.state.x,
    lastY: t.state.y
  };
}
function yo(t) {
  return {
    left: t.left,
    top: t.top,
    right: t.right,
    bottom: t.bottom
  };
}
function Nt(t) {
  const e = t.findDOMNode();
  if (!e)
    throw new Error("<DraggableCore>: Unmounted during event!");
  return e;
}
var Qe = {}, et = {};
Object.defineProperty(et, "__esModule", {
  value: !0
});
et.default = vo;
function vo() {
}
Object.defineProperty(Qe, "__esModule", {
  value: !0
});
Qe.default = void 0;
var ct = Nr(ee), G = $t(ce), bo = $t(Et), B = L, le = se, ft = ie, je = $t(et);
function $t(t) {
  return t && t.__esModule ? t : { default: t };
}
function Nr(t, e) {
  if (typeof WeakMap == "function") var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
  return (Nr = function(o, i) {
    if (!i && o && o.__esModule) return o;
    var s, l, a = { __proto__: null, default: o };
    if (o === null || typeof o != "object" && typeof o != "function") return a;
    if (s = i ? n : r) {
      if (s.has(o)) return s.get(o);
      s.set(o, a);
    }
    for (const u in o) u !== "default" && {}.hasOwnProperty.call(o, u) && ((l = (s = Object.defineProperty) && Object.getOwnPropertyDescriptor(o, u)) && (l.get || l.set) ? s(a, u, l) : a[u] = o[u]);
    return a;
  })(t, e);
}
function Y(t, e, r) {
  return (e = wo(e)) in t ? Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = r, t;
}
function wo(t) {
  var e = Oo(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function Oo(t, e) {
  if (typeof t != "object" || !t) return t;
  var r = t[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(t, e);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
const J = {
  touch: {
    start: "touchstart",
    move: "touchmove",
    stop: "touchend"
  },
  mouse: {
    start: "mousedown",
    move: "mousemove",
    stop: "mouseup"
  }
};
let ue = J.mouse, tt = class extends ct.Component {
  constructor() {
    super(...arguments), Y(this, "dragging", !1), Y(this, "lastX", NaN), Y(this, "lastY", NaN), Y(this, "touchIdentifier", null), Y(this, "mounted", !1), Y(this, "handleDragStart", (e) => {
      if (this.props.onMouseDown(e), !this.props.allowAnyClick && typeof e.button == "number" && e.button !== 0) return !1;
      const r = this.findDOMNode();
      if (!r || !r.ownerDocument || !r.ownerDocument.body)
        throw new Error("<DraggableCore> not mounted on DragStart!");
      const {
        ownerDocument: n
      } = r;
      if (this.props.disabled || !(e.target instanceof n.defaultView.Node) || this.props.handle && !(0, B.matchesSelectorAndParentsTo)(e.target, this.props.handle, r) || this.props.cancel && (0, B.matchesSelectorAndParentsTo)(e.target, this.props.cancel, r))
        return;
      e.type === "touchstart" && !this.props.allowMobileScroll && e.preventDefault();
      const o = (0, B.getTouchIdentifier)(e);
      this.touchIdentifier = o;
      const i = (0, le.getControlPosition)(e, o, this);
      if (i == null) return;
      const {
        x: s,
        y: l
      } = i, a = (0, le.createCoreData)(this, s, l);
      (0, je.default)("DraggableCore: handleDragStart: %j", a), (0, je.default)("calling", this.props.onStart), !(this.props.onStart(e, a) === !1 || this.mounted === !1) && (this.props.enableUserSelectHack && (0, B.addUserSelectStyles)(n), this.dragging = !0, this.lastX = s, this.lastY = l, (0, B.addEvent)(n, ue.move, this.handleDrag), (0, B.addEvent)(n, ue.stop, this.handleDragStop));
    }), Y(this, "handleDrag", (e) => {
      const r = (0, le.getControlPosition)(e, this.touchIdentifier, this);
      if (r == null) return;
      let {
        x: n,
        y: o
      } = r;
      if (Array.isArray(this.props.grid)) {
        let l = n - this.lastX, a = o - this.lastY;
        if ([l, a] = (0, le.snapToGrid)(this.props.grid, l, a), !l && !a) return;
        n = this.lastX + l, o = this.lastY + a;
      }
      const i = (0, le.createCoreData)(this, n, o);
      if ((0, je.default)("DraggableCore: handleDrag: %j", i), this.props.onDrag(e, i) === !1 || this.mounted === !1) {
        try {
          this.handleDragStop(new MouseEvent("mouseup"));
        } catch {
          const a = document.createEvent("MouseEvents");
          a.initMouseEvent("mouseup", !0, !0, window, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), this.handleDragStop(a);
        }
        return;
      }
      this.lastX = n, this.lastY = o;
    }), Y(this, "handleDragStop", (e) => {
      if (!this.dragging) return;
      const r = (0, le.getControlPosition)(e, this.touchIdentifier, this);
      if (r == null) return;
      let {
        x: n,
        y: o
      } = r;
      if (Array.isArray(this.props.grid)) {
        let a = n - this.lastX || 0, u = o - this.lastY || 0;
        [a, u] = (0, le.snapToGrid)(this.props.grid, a, u), n = this.lastX + a, o = this.lastY + u;
      }
      const i = (0, le.createCoreData)(this, n, o);
      if (this.props.onStop(e, i) === !1 || this.mounted === !1) return !1;
      const l = this.findDOMNode();
      l && this.props.enableUserSelectHack && (0, B.scheduleRemoveUserSelectStyles)(l.ownerDocument), (0, je.default)("DraggableCore: handleDragStop: %j", i), this.dragging = !1, this.lastX = NaN, this.lastY = NaN, l && ((0, je.default)("DraggableCore: Removing handlers"), (0, B.removeEvent)(l.ownerDocument, ue.move, this.handleDrag), (0, B.removeEvent)(l.ownerDocument, ue.stop, this.handleDragStop));
    }), Y(this, "onMouseDown", (e) => (ue = J.mouse, this.handleDragStart(e))), Y(this, "onMouseUp", (e) => (ue = J.mouse, this.handleDragStop(e))), Y(this, "onTouchStart", (e) => (ue = J.touch, this.handleDragStart(e))), Y(this, "onTouchEnd", (e) => (ue = J.touch, this.handleDragStop(e)));
  }
  componentDidMount() {
    this.mounted = !0;
    const e = this.findDOMNode();
    e && (0, B.addEvent)(e, J.touch.start, this.onTouchStart, {
      passive: !1
    });
  }
  componentWillUnmount() {
    this.mounted = !1;
    const e = this.findDOMNode();
    if (e) {
      const {
        ownerDocument: r
      } = e;
      (0, B.removeEvent)(r, J.mouse.move, this.handleDrag), (0, B.removeEvent)(r, J.touch.move, this.handleDrag), (0, B.removeEvent)(r, J.mouse.stop, this.handleDragStop), (0, B.removeEvent)(r, J.touch.stop, this.handleDragStop), (0, B.removeEvent)(e, J.touch.start, this.onTouchStart, {
        passive: !1
      }), this.props.enableUserSelectHack && (0, B.scheduleRemoveUserSelectStyles)(r);
    }
  }
  // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
  // the underlying DOM node ourselves. See the README for more information.
  findDOMNode() {
    var e, r, n;
    return (e = this.props) != null && e.nodeRef ? (n = (r = this.props) == null ? void 0 : r.nodeRef) == null ? void 0 : n.current : bo.default.findDOMNode(this);
  }
  render() {
    return /* @__PURE__ */ ct.cloneElement(ct.Children.only(this.props.children), {
      // Note: mouseMove handler is attached to document so it will still function
      // when the user drags quickly and leaves the bounds of the element.
      onMouseDown: this.onMouseDown,
      onMouseUp: this.onMouseUp,
      // onTouchStart is added on `componentDidMount` so they can be added with
      // {passive: false}, which allows it to cancel. See
      // https://developers.google.com/web/updates/2017/01/scrolling-intervention
      onTouchEnd: this.onTouchEnd
    });
  }
};
Qe.default = tt;
Y(tt, "displayName", "DraggableCore");
Y(tt, "propTypes", {
  /**
   * `allowAnyClick` allows dragging using any mouse button.
   * By default, we only accept the left button.
   *
   * Defaults to `false`.
   */
  allowAnyClick: G.default.bool,
  /**
   * `allowMobileScroll` turns off cancellation of the 'touchstart' event
   * on mobile devices. Only enable this if you are having trouble with click
   * events. Prefer using 'handle' / 'cancel' instead.
   *
   * Defaults to `false`.
   */
  allowMobileScroll: G.default.bool,
  children: G.default.node.isRequired,
  /**
   * `disabled`, if true, stops the <Draggable> from dragging. All handlers,
   * with the exception of `onMouseDown`, will not fire.
   */
  disabled: G.default.bool,
  /**
   * By default, we add 'user-select:none' attributes to the document body
   * to prevent ugly text selection during drag. If this is causing problems
   * for your app, set this to `false`.
   */
  enableUserSelectHack: G.default.bool,
  /**
   * `offsetParent`, if set, uses the passed DOM node to compute drag offsets
   * instead of using the parent node.
   */
  offsetParent: function(t, e) {
    if (t[e] && t[e].nodeType !== 1)
      throw new Error("Draggable's offsetParent must be a DOM Node.");
  },
  /**
   * `grid` specifies the x and y that dragging should snap to.
   */
  grid: G.default.arrayOf(G.default.number),
  /**
   * `handle` specifies a selector to be used as the handle that initiates drag.
   *
   * Example:
   *
   * ```jsx
   *   let App = React.createClass({
   *       render: function () {
   *         return (
   *            <Draggable handle=".handle">
   *              <div>
   *                  <div className="handle">Click me to drag</div>
   *                  <div>This is some other content</div>
   *              </div>
   *           </Draggable>
   *         );
   *       }
   *   });
   * ```
   */
  handle: G.default.string,
  /**
   * `cancel` specifies a selector to be used to prevent drag initialization.
   *
   * Example:
   *
   * ```jsx
   *   let App = React.createClass({
   *       render: function () {
   *           return(
   *               <Draggable cancel=".cancel">
   *                   <div>
   *                     <div className="cancel">You can't drag from here</div>
   *                     <div>Dragging here works fine</div>
   *                   </div>
   *               </Draggable>
   *           );
   *       }
   *   });
   * ```
   */
  cancel: G.default.string,
  /* If running in React Strict mode, ReactDOM.findDOMNode() is deprecated.
   * Unfortunately, in order for <Draggable> to work properly, we need raw access
   * to the underlying DOM node. If you want to avoid the warning, pass a `nodeRef`
   * as in this example:
   *
   * function MyComponent() {
   *   const nodeRef = React.useRef(null);
   *   return (
   *     <Draggable nodeRef={nodeRef}>
   *       <div ref={nodeRef}>Example Target</div>
   *     </Draggable>
   *   );
   * }
   *
   * This can be used for arbitrarily nested components, so long as the ref ends up
   * pointing to the actual child DOM node and not a custom component.
   */
  nodeRef: G.default.object,
  /**
   * Called when dragging starts.
   * If this function returns the boolean false, dragging will be canceled.
   */
  onStart: G.default.func,
  /**
   * Called while dragging.
   * If this function returns the boolean false, dragging will be canceled.
   */
  onDrag: G.default.func,
  /**
   * Called when dragging stops.
   * If this function returns the boolean false, the drag will remain active.
   */
  onStop: G.default.func,
  /**
   * A workaround option which can be passed if onMouseDown needs to be accessed,
   * since it'll always be blocked (as there is internal use of onMouseDown)
   */
  onMouseDown: G.default.func,
  /**
   * `scale`, if set, applies scaling while dragging an element
   */
  scale: G.default.number,
  /**
   * These properties should be defined on the child, not here.
   */
  className: ft.dontSetMe,
  style: ft.dontSetMe,
  transform: ft.dontSetMe
});
Y(tt, "defaultProps", {
  allowAnyClick: !1,
  // by default only accept left click
  allowMobileScroll: !1,
  disabled: !1,
  enableUserSelectHack: !0,
  onStart: function() {
  },
  onDrag: function() {
  },
  onStop: function() {
  },
  onMouseDown: function() {
  },
  scale: 1
});
(function(t) {
  Object.defineProperty(t, "__esModule", {
    value: !0
  }), Object.defineProperty(t, "DraggableCore", {
    enumerable: !0,
    get: function() {
      return a.default;
    }
  }), t.default = void 0;
  var e = d(ee), r = c(ce), n = c(Et), o = Xe, i = L, s = se, l = ie, a = c(Qe), u = c(et);
  function c(p) {
    return p && p.__esModule ? p : { default: p };
  }
  function d(p, y) {
    if (typeof WeakMap == "function") var h = /* @__PURE__ */ new WeakMap(), b = /* @__PURE__ */ new WeakMap();
    return (d = function(m, x) {
      if (!x && m && m.__esModule) return m;
      var N, $, F = { __proto__: null, default: m };
      if (m === null || typeof m != "object" && typeof m != "function") return F;
      if (N = x ? b : h) {
        if (N.has(m)) return N.get(m);
        N.set(m, F);
      }
      for (const U in m) U !== "default" && {}.hasOwnProperty.call(m, U) && (($ = (N = Object.defineProperty) && Object.getOwnPropertyDescriptor(m, U)) && ($.get || $.set) ? N(F, U, $) : F[U] = m[U]);
      return F;
    })(p, y);
  }
  function f() {
    return f = Object.assign ? Object.assign.bind() : function(p) {
      for (var y = 1; y < arguments.length; y++) {
        var h = arguments[y];
        for (var b in h) ({}).hasOwnProperty.call(h, b) && (p[b] = h[b]);
      }
      return p;
    }, f.apply(null, arguments);
  }
  function v(p, y, h) {
    return (y = S(y)) in p ? Object.defineProperty(p, y, { value: h, enumerable: !0, configurable: !0, writable: !0 }) : p[y] = h, p;
  }
  function S(p) {
    var y = E(p, "string");
    return typeof y == "symbol" ? y : y + "";
  }
  function E(p, y) {
    if (typeof p != "object" || !p) return p;
    var h = p[Symbol.toPrimitive];
    if (h !== void 0) {
      var b = h.call(p, y);
      if (typeof b != "object") return b;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (y === "string" ? String : Number)(p);
  }
  class _ extends e.Component {
    // React 16.3+
    // Arity (props, state)
    static getDerivedStateFromProps(y, h) {
      let {
        position: b
      } = y, {
        prevPropsPosition: m
      } = h;
      return b && (!m || b.x !== m.x || b.y !== m.y) ? ((0, u.default)("Draggable: getDerivedStateFromProps %j", {
        position: b,
        prevPropsPosition: m
      }), {
        x: b.x,
        y: b.y,
        prevPropsPosition: {
          ...b
        }
      }) : null;
    }
    constructor(y) {
      super(y), v(this, "onDragStart", (h, b) => {
        if ((0, u.default)("Draggable: onDragStart: %j", b), this.props.onStart(h, (0, s.createDraggableData)(this, b)) === !1) return !1;
        this.setState({
          dragging: !0,
          dragged: !0
        });
      }), v(this, "onDrag", (h, b) => {
        if (!this.state.dragging) return !1;
        (0, u.default)("Draggable: onDrag: %j", b);
        const m = (0, s.createDraggableData)(this, b), x = {
          x: m.x,
          y: m.y,
          slackX: 0,
          slackY: 0
        };
        if (this.props.bounds) {
          const {
            x: $,
            y: F
          } = x;
          x.x += this.state.slackX, x.y += this.state.slackY;
          const [U, xe] = (0, s.getBoundPosition)(this, x.x, x.y);
          x.x = U, x.y = xe, x.slackX = this.state.slackX + ($ - x.x), x.slackY = this.state.slackY + (F - x.y), m.x = x.x, m.y = x.y, m.deltaX = x.x - this.state.x, m.deltaY = x.y - this.state.y;
        }
        if (this.props.onDrag(h, m) === !1) return !1;
        this.setState(x);
      }), v(this, "onDragStop", (h, b) => {
        if (!this.state.dragging || this.props.onStop(h, (0, s.createDraggableData)(this, b)) === !1) return !1;
        (0, u.default)("Draggable: onDragStop: %j", b);
        const x = {
          dragging: !1,
          slackX: 0,
          slackY: 0
        };
        if (!!this.props.position) {
          const {
            x: $,
            y: F
          } = this.props.position;
          x.x = $, x.y = F;
        }
        this.setState(x);
      }), this.state = {
        // Whether or not we are currently dragging.
        dragging: !1,
        // Whether or not we have been dragged before.
        dragged: !1,
        // Current transform x and y.
        x: y.position ? y.position.x : y.defaultPosition.x,
        y: y.position ? y.position.y : y.defaultPosition.y,
        prevPropsPosition: {
          ...y.position
        },
        // Used for compensating for out-of-bounds drags
        slackX: 0,
        slackY: 0,
        // Can only determine if SVG after mounting
        isElementSVG: !1
      }, y.position && !(y.onDrag || y.onStop) && console.warn("A `position` was applied to this <Draggable>, without drag handlers. This will make this component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the `position` of this element.");
    }
    componentDidMount() {
      typeof window.SVGElement < "u" && this.findDOMNode() instanceof window.SVGElement && this.setState({
        isElementSVG: !0
      });
    }
    componentWillUnmount() {
      this.state.dragging && this.setState({
        dragging: !1
      });
    }
    // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
    // the underlying DOM node ourselves. See the README for more information.
    findDOMNode() {
      var y, h;
      return ((h = (y = this.props) == null ? void 0 : y.nodeRef) == null ? void 0 : h.current) ?? n.default.findDOMNode(this);
    }
    render() {
      const {
        axis: y,
        bounds: h,
        children: b,
        defaultPosition: m,
        defaultClassName: x,
        defaultClassNameDragging: N,
        defaultClassNameDragged: $,
        position: F,
        positionOffset: U,
        scale: xe,
        ...at
      } = this.props;
      let ze = {}, Ce = null;
      const fe = !!!F || this.state.dragging, de = F || m, Ne = {
        // Set left if horizontal drag is enabled
        x: (0, s.canDragX)(this) && fe ? this.state.x : de.x,
        // Set top if vertical drag is enabled
        y: (0, s.canDragY)(this) && fe ? this.state.y : de.y
      };
      this.state.isElementSVG ? Ce = (0, i.createSVGTransform)(Ne, U) : ze = (0, i.createCSSTransform)(Ne, U);
      const lt = (0, o.clsx)(b.props.className || "", x, {
        [N]: this.state.dragging,
        [$]: this.state.dragged
      });
      return /* @__PURE__ */ e.createElement(a.default, f({}, at, {
        onStart: this.onDragStart,
        onDrag: this.onDrag,
        onStop: this.onDragStop
      }), /* @__PURE__ */ e.cloneElement(e.Children.only(b), {
        className: lt,
        style: {
          ...b.props.style,
          ...ze
        },
        transform: Ce
      }));
    }
  }
  t.default = _, v(_, "displayName", "Draggable"), v(_, "propTypes", {
    // Accepts all props <DraggableCore> accepts.
    ...a.default.propTypes,
    /**
     * `axis` determines which axis the draggable can move.
     *
     *  Note that all callbacks will still return data as normal. This only
     *  controls flushing to the DOM.
     *
     * 'both' allows movement horizontally and vertically.
     * 'x' limits movement to horizontal axis.
     * 'y' limits movement to vertical axis.
     * 'none' limits all movement.
     *
     * Defaults to 'both'.
     */
    axis: r.default.oneOf(["both", "x", "y", "none"]),
    /**
     * `bounds` determines the range of movement available to the element.
     * Available values are:
     *
     * 'parent' restricts movement within the Draggable's parent node.
     *
     * Alternatively, pass an object with the following properties, all of which are optional:
     *
     * {left: LEFT_BOUND, right: RIGHT_BOUND, bottom: BOTTOM_BOUND, top: TOP_BOUND}
     *
     * All values are in px.
     *
     * Example:
     *
     * ```jsx
     *   let App = React.createClass({
     *       render: function () {
     *         return (
     *            <Draggable bounds={{right: 300, bottom: 300}}>
     *              <div>Content</div>
     *           </Draggable>
     *         );
     *       }
     *   });
     * ```
     */
    bounds: r.default.oneOfType([r.default.shape({
      left: r.default.number,
      right: r.default.number,
      top: r.default.number,
      bottom: r.default.number
    }), r.default.string, r.default.oneOf([!1])]),
    defaultClassName: r.default.string,
    defaultClassNameDragging: r.default.string,
    defaultClassNameDragged: r.default.string,
    /**
     * `defaultPosition` specifies the x and y that the dragged item should start at
     *
     * Example:
     *
     * ```jsx
     *      let App = React.createClass({
     *          render: function () {
     *              return (
     *                  <Draggable defaultPosition={{x: 25, y: 25}}>
     *                      <div>I start with transformX: 25px and transformY: 25px;</div>
     *                  </Draggable>
     *              );
     *          }
     *      });
     * ```
     */
    defaultPosition: r.default.shape({
      x: r.default.number,
      y: r.default.number
    }),
    positionOffset: r.default.shape({
      x: r.default.oneOfType([r.default.number, r.default.string]),
      y: r.default.oneOfType([r.default.number, r.default.string])
    }),
    /**
     * `position`, if present, defines the current position of the element.
     *
     *  This is similar to how form elements in React work - if no `position` is supplied, the component
     *  is uncontrolled.
     *
     * Example:
     *
     * ```jsx
     *      let App = React.createClass({
     *          render: function () {
     *              return (
     *                  <Draggable position={{x: 25, y: 25}}>
     *                      <div>I start with transformX: 25px and transformY: 25px;</div>
     *                  </Draggable>
     *              );
     *          }
     *      });
     * ```
     */
    position: r.default.shape({
      x: r.default.number,
      y: r.default.number
    }),
    /**
     * These properties should be defined on the child, not here.
     */
    className: l.dontSetMe,
    style: l.dontSetMe,
    transform: l.dontSetMe
  }), v(_, "defaultProps", {
    ...a.default.defaultProps,
    axis: "both",
    bounds: !1,
    defaultClassName: "react-draggable",
    defaultClassNameDragging: "react-draggable-dragging",
    defaultClassNameDragged: "react-draggable-dragged",
    defaultPosition: {
      x: 0,
      y: 0
    },
    scale: 1
  });
})(jr);
const {
  default: $r,
  DraggableCore: So
} = jr;
Je.exports = $r;
Je.exports.default = $r;
Je.exports.DraggableCore = So;
var qr = Je.exports, rt = { exports: {} }, ke = {}, qt = {};
qt.__esModule = !0;
qt.cloneElement = xo;
var _o = Do(ee);
function Do(t) {
  return t && t.__esModule ? t : { default: t };
}
function rr(t, e) {
  var r = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    e && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function nr(t) {
  for (var e = 1; e < arguments.length; e++) {
    var r = arguments[e] != null ? arguments[e] : {};
    e % 2 ? rr(Object(r), !0).forEach(function(n) {
      Po(t, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : rr(Object(r)).forEach(function(n) {
      Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return t;
}
function Po(t, e, r) {
  return (e = Ro(e)) in t ? Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = r, t;
}
function Ro(t) {
  var e = Eo(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function Eo(t, e) {
  if (typeof t != "object" || !t) return t;
  var r = t[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(t, e);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function xo(t, e) {
  return e.style && t.props.style && (e.style = nr(nr({}, t.props.style), e.style)), e.className && t.props.className && (e.className = `${t.props.className} ${e.className}`), /* @__PURE__ */ _o.default.cloneElement(t, e);
}
var We = {};
We.__esModule = !0;
We.resizableProps = void 0;
var D = zo(ce);
function zo(t) {
  return t && t.__esModule ? t : { default: t };
}
We.resizableProps = {
  /*
  * Restricts resizing to a particular axis (default: 'both')
  * 'both' - allows resizing by width or height
  * 'x' - only allows the width to be changed
  * 'y' - only allows the height to be changed
  * 'none' - disables resizing altogether
  * */
  axis: D.default.oneOf(["both", "x", "y", "none"]),
  className: D.default.string,
  /*
  * Require that one and only one child be present.
  * */
  children: D.default.element.isRequired,
  /*
  * These will be passed wholesale to react-draggable's DraggableCore
  * */
  draggableOpts: D.default.shape({
    allowAnyClick: D.default.bool,
    cancel: D.default.string,
    children: D.default.node,
    disabled: D.default.bool,
    enableUserSelectHack: D.default.bool,
    // #251: Check for Element to support SSR environments where DOM globals don't exist
    offsetParent: typeof Element < "u" ? D.default.instanceOf(Element) : D.default.any,
    grid: D.default.arrayOf(D.default.number),
    handle: D.default.string,
    nodeRef: D.default.object,
    onStart: D.default.func,
    onDrag: D.default.func,
    onStop: D.default.func,
    onMouseDown: D.default.func,
    scale: D.default.number
  }),
  /*
  * Initial height
  * */
  height: function() {
    for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
      e[r] = arguments[r];
    const [n] = e;
    return n.axis === "both" || n.axis === "y" ? D.default.number.isRequired(...e) : D.default.number(...e);
  },
  /*
  * Customize cursor resize handle
  * */
  handle: D.default.oneOfType([D.default.node, D.default.func]),
  /*
  * If you change this, be sure to update your css
  * */
  handleSize: D.default.arrayOf(D.default.number),
  lockAspectRatio: D.default.bool,
  /*
  * Max X & Y measure
  * */
  maxConstraints: D.default.arrayOf(D.default.number),
  /*
  * Min X & Y measure
  * */
  minConstraints: D.default.arrayOf(D.default.number),
  /*
  * Called on stop resize event
  * */
  onResizeStop: D.default.func,
  /*
  * Called on start resize event
  * */
  onResizeStart: D.default.func,
  /*
  * Called on resize event
  * */
  onResize: D.default.func,
  /*
  * Defines which resize handles should be rendered (default: 'se')
  * 's' - South handle (bottom-center)
  * 'w' - West handle (left-center)
  * 'e' - East handle (right-center)
  * 'n' - North handle (top-center)
  * 'sw' - Southwest handle (bottom-left)
  * 'nw' - Northwest handle (top-left)
  * 'se' - Southeast handle (bottom-right)
  * 'ne' - Northeast handle (top-center)
  * */
  resizeHandles: D.default.arrayOf(D.default.oneOf(["s", "w", "e", "n", "sw", "nw", "se", "ne"])),
  /*
  * If `transform: scale(n)` is set on the parent, this should be set to `n`.
  * */
  transformScale: D.default.number,
  /*
   * Initial width
   */
  width: function() {
    for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
      e[r] = arguments[r];
    const [n] = e;
    return n.axis === "both" || n.axis === "x" ? D.default.number.isRequired(...e) : D.default.number(...e);
  }
};
ke.__esModule = !0;
ke.default = void 0;
var Oe = Ir(ee), Co = qr, jo = qt, Mo = We;
const To = ["children", "className", "draggableOpts", "width", "height", "handle", "handleSize", "lockAspectRatio", "axis", "minConstraints", "maxConstraints", "onResize", "onResizeStop", "onResizeStart", "resizeHandles", "transformScale"];
function Ir(t, e) {
  if (typeof WeakMap == "function") var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
  return (Ir = function(o, i) {
    if (!i && o && o.__esModule) return o;
    var s, l, a = { __proto__: null, default: o };
    if (o === null || typeof o != "object" && typeof o != "function") return a;
    if (s = i ? n : r) {
      if (s.has(o)) return s.get(o);
      s.set(o, a);
    }
    for (const u in o) u !== "default" && {}.hasOwnProperty.call(o, u) && ((l = (s = Object.defineProperty) && Object.getOwnPropertyDescriptor(o, u)) && (l.get || l.set) ? s(a, u, l) : a[u] = o[u]);
    return a;
  })(t, e);
}
function St() {
  return St = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, St.apply(null, arguments);
}
function Lo(t, e) {
  if (t == null) return {};
  var r, n, o = Ho(t, e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(t);
    for (n = 0; n < i.length; n++) r = i[n], e.indexOf(r) === -1 && {}.propertyIsEnumerable.call(t, r) && (o[r] = t[r]);
  }
  return o;
}
function Ho(t, e) {
  if (t == null) return {};
  var r = {};
  for (var n in t) if ({}.hasOwnProperty.call(t, n)) {
    if (e.indexOf(n) !== -1) continue;
    r[n] = t[n];
  }
  return r;
}
function or(t, e) {
  var r = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    e && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function dt(t) {
  for (var e = 1; e < arguments.length; e++) {
    var r = arguments[e] != null ? arguments[e] : {};
    e % 2 ? or(Object(r), !0).forEach(function(n) {
      ko(t, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : or(Object(r)).forEach(function(n) {
      Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return t;
}
function ko(t, e, r) {
  return (e = Wo(e)) in t ? Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = r, t;
}
function Wo(t) {
  var e = No(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function No(t, e) {
  if (typeof t != "object" || !t) return t;
  var r = t[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(t, e);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
class It extends Oe.Component {
  constructor() {
    super(...arguments), this.handleRefs = {}, this.lastHandleRect = null, this.slack = null, this.lastSize = null;
  }
  componentWillUnmount() {
    this.resetData();
  }
  resetData() {
    this.lastHandleRect = this.slack = this.lastSize = null;
  }
  // Clamp width and height within provided constraints
  runConstraints(e, r) {
    const {
      minConstraints: n,
      maxConstraints: o,
      lockAspectRatio: i
    } = this.props;
    if (!n && !o && !i) return [e, r];
    if (i) {
      const c = this.props.width / this.props.height, d = e - this.props.width, f = r - this.props.height;
      Math.abs(d) > Math.abs(f * c) ? r = e / c : e = r * c;
    }
    const [s, l] = [e, r];
    let [a, u] = this.slack || [0, 0];
    return e += a, r += u, n && (e = Math.max(n[0], e), r = Math.max(n[1], r)), o && (e = Math.min(o[0], e), r = Math.min(o[1], r)), this.slack = [a + (s - e), u + (l - r)], [e, r];
  }
  /**
   * Wrapper around drag events to provide more useful data.
   *
   * @param  {String} handlerName Handler name to wrap.
   * @return {Function}           Handler function.
   */
  resizeHandler(e, r) {
    return (n, o) => {
      var y;
      let {
        node: i,
        deltaX: s,
        deltaY: l
      } = o;
      e === "onResizeStart" && this.resetData();
      const a = (this.props.axis === "both" || this.props.axis === "x") && r !== "n" && r !== "s", u = (this.props.axis === "both" || this.props.axis === "y") && r !== "e" && r !== "w";
      if (!a && !u) return;
      const c = r[0], d = r[r.length - 1], f = i.getBoundingClientRect();
      if (this.lastHandleRect != null) {
        if (d === "w") {
          const h = f.left - this.lastHandleRect.left;
          s += h;
        }
        if (c === "n") {
          const h = f.top - this.lastHandleRect.top;
          l += h;
        }
      }
      this.lastHandleRect = f, d === "w" && (s = -s), c === "n" && (l = -l);
      let v = this.props.width + (a ? s / this.props.transformScale : 0), S = this.props.height + (u ? l / this.props.transformScale : 0);
      [v, S] = this.runConstraints(v, S), e === "onResizeStop" && this.lastSize && ({
        width: v,
        height: S
      } = this.lastSize);
      const E = v !== this.props.width || S !== this.props.height;
      e !== "onResizeStop" && (this.lastSize = {
        width: v,
        height: S
      });
      const _ = typeof this.props[e] == "function" ? this.props[e] : null;
      _ && !(e === "onResize" && !E) && ((y = n.persist) == null || y.call(n), _(n, {
        node: i,
        size: {
          width: v,
          height: S
        },
        handle: r
      })), e === "onResizeStop" && this.resetData();
    };
  }
  // Render a resize handle given an axis & DOM ref. Ref *must* be attached for
  // the underlying draggable library to work properly.
  renderResizeHandle(e, r) {
    const {
      handle: n
    } = this.props;
    if (!n)
      return /* @__PURE__ */ Oe.createElement("span", {
        className: `react-resizable-handle react-resizable-handle-${e}`,
        ref: r
      });
    if (typeof n == "function")
      return n(e, r);
    const o = typeof n.type == "string", i = dt({
      ref: r
    }, o ? {} : {
      handleAxis: e
    });
    return /* @__PURE__ */ Oe.cloneElement(n, i);
  }
  render() {
    const e = this.props, {
      children: r,
      className: n,
      draggableOpts: o,
      width: i,
      height: s,
      handle: l,
      handleSize: a,
      lockAspectRatio: u,
      axis: c,
      minConstraints: d,
      maxConstraints: f,
      onResize: v,
      onResizeStop: S,
      onResizeStart: E,
      resizeHandles: _,
      transformScale: p
    } = e, y = Lo(e, To);
    return (0, jo.cloneElement)(r, dt(dt({}, y), {}, {
      className: `${n ? `${n} ` : ""}react-resizable`,
      children: [...Oe.Children.toArray(r.props.children), ..._.map((h) => {
        const b = this.handleRefs[h] ?? (this.handleRefs[h] = /* @__PURE__ */ Oe.createRef());
        return /* @__PURE__ */ Oe.createElement(Co.DraggableCore, St({}, o, {
          nodeRef: b,
          key: `resizableHandle-${h}`,
          onStop: this.resizeHandler("onResizeStop", h),
          onStart: this.resizeHandler("onResizeStart", h),
          onDrag: this.resizeHandler("onResize", h)
        }), this.renderResizeHandle(h, b));
      })]
    }));
  }
}
ke.default = It;
It.propTypes = Mo.resizableProps;
It.defaultProps = {
  axis: "both",
  handleSize: [20, 20],
  lockAspectRatio: !1,
  minConstraints: [20, 20],
  maxConstraints: [1 / 0, 1 / 0],
  resizeHandles: ["se"],
  transformScale: 1
};
var nt = {};
nt.__esModule = !0;
nt.default = void 0;
var pt = Br(ee), $o = Ar(ce), qo = Ar(ke), Io = We;
const Ao = ["handle", "handleSize", "onResize", "onResizeStart", "onResizeStop", "draggableOpts", "minConstraints", "maxConstraints", "lockAspectRatio", "axis", "width", "height", "resizeHandles", "style", "transformScale"];
function Ar(t) {
  return t && t.__esModule ? t : { default: t };
}
function Br(t, e) {
  if (typeof WeakMap == "function") var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
  return (Br = function(o, i) {
    if (!i && o && o.__esModule) return o;
    var s, l, a = { __proto__: null, default: o };
    if (o === null || typeof o != "object" && typeof o != "function") return a;
    if (s = i ? n : r) {
      if (s.has(o)) return s.get(o);
      s.set(o, a);
    }
    for (const u in o) u !== "default" && {}.hasOwnProperty.call(o, u) && ((l = (s = Object.defineProperty) && Object.getOwnPropertyDescriptor(o, u)) && (l.get || l.set) ? s(a, u, l) : a[u] = o[u]);
    return a;
  })(t, e);
}
function _t() {
  return _t = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, _t.apply(null, arguments);
}
function ir(t, e) {
  var r = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    e && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function Ge(t) {
  for (var e = 1; e < arguments.length; e++) {
    var r = arguments[e] != null ? arguments[e] : {};
    e % 2 ? ir(Object(r), !0).forEach(function(n) {
      Bo(t, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : ir(Object(r)).forEach(function(n) {
      Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return t;
}
function Bo(t, e, r) {
  return (e = Go(e)) in t ? Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = r, t;
}
function Go(t) {
  var e = Yo(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function Yo(t, e) {
  if (typeof t != "object" || !t) return t;
  var r = t[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(t, e);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function Fo(t, e) {
  if (t == null) return {};
  var r, n, o = Xo(t, e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(t);
    for (n = 0; n < i.length; n++) r = i[n], e.indexOf(r) === -1 && {}.propertyIsEnumerable.call(t, r) && (o[r] = t[r]);
  }
  return o;
}
function Xo(t, e) {
  if (t == null) return {};
  var r = {};
  for (var n in t) if ({}.hasOwnProperty.call(t, n)) {
    if (e.indexOf(n) !== -1) continue;
    r[n] = t[n];
  }
  return r;
}
class Gr extends pt.Component {
  constructor() {
    super(...arguments), this.state = {
      width: this.props.width,
      height: this.props.height,
      propsWidth: this.props.width,
      propsHeight: this.props.height
    }, this.onResize = (e, r) => {
      var o;
      const {
        size: n
      } = r;
      this.props.onResize ? ((o = e.persist) == null || o.call(e), this.setState(n, () => this.props.onResize && this.props.onResize(e, r))) : this.setState(n);
    };
  }
  static getDerivedStateFromProps(e, r) {
    return r.propsWidth !== e.width || r.propsHeight !== e.height ? {
      width: e.width,
      height: e.height,
      propsWidth: e.width,
      propsHeight: e.height
    } : null;
  }
  render() {
    const e = this.props, {
      handle: r,
      handleSize: n,
      onResize: o,
      onResizeStart: i,
      onResizeStop: s,
      draggableOpts: l,
      minConstraints: a,
      maxConstraints: u,
      lockAspectRatio: c,
      axis: d,
      width: f,
      height: v,
      resizeHandles: S,
      style: E,
      transformScale: _
    } = e, p = Fo(e, Ao);
    return /* @__PURE__ */ pt.createElement(qo.default, {
      axis: d,
      draggableOpts: l,
      handle: r,
      handleSize: n,
      height: this.state.height,
      lockAspectRatio: c,
      maxConstraints: u,
      minConstraints: a,
      onResizeStart: i,
      onResize: this.onResize,
      onResizeStop: s,
      resizeHandles: S,
      transformScale: _,
      width: this.state.width
    }, /* @__PURE__ */ pt.createElement("div", _t({}, p, {
      style: Ge(Ge({}, E), {}, {
        width: this.state.width + "px",
        height: this.state.height + "px"
      })
    })));
  }
}
nt.default = Gr;
Gr.propTypes = Ge(Ge({}, Io.resizableProps), {}, {
  children: $o.default.element
});
rt.exports = function() {
  throw new Error("Don't instantiate Resizable directly! Use require('react-resizable').Resizable");
};
rt.exports.Resizable = ke.default;
rt.exports.ResizableBox = nt.default;
var Uo = rt.exports, ae = {};
Object.defineProperty(ae, "__esModule", {
  value: !0
});
ae.resizeHandleType = ae.resizeHandleAxesType = ae.default = void 0;
var P = Yr(ce), Vo = Yr(ee);
function Yr(t) {
  return t && t.__esModule ? t : { default: t };
}
const Ko = ae.resizeHandleAxesType = P.default.arrayOf(P.default.oneOf(["s", "w", "e", "n", "sw", "nw", "se", "ne"])), Zo = ae.resizeHandleType = P.default.oneOfType([P.default.node, P.default.func]);
ae.default = {
  //
  // Basic props
  //
  className: P.default.string,
  style: P.default.object,
  // This can be set explicitly. If it is not set, it will automatically
  // be set to the container width. Note that resizes will *not* cause this to adjust.
  // If you need that behavior, use WidthProvider.
  width: P.default.number,
  // If true, the container height swells and contracts to fit contents
  autoSize: P.default.bool,
  // # of cols.
  cols: P.default.number,
  // A selector that will not be draggable.
  draggableCancel: P.default.string,
  // A selector for the draggable handler
  draggableHandle: P.default.string,
  // Deprecated
  verticalCompact: function(t) {
    t.verticalCompact;
  },
  // Choose vertical or hotizontal compaction
  compactType: P.default.oneOf(["vertical", "horizontal"]),
  // layout is an array of object with the format:
  // {x: Number, y: Number, w: Number, h: Number, i: String}
  layout: function(t) {
    var e = t.layout;
    e !== void 0 && R.validateLayout(e, "layout");
  },
  //
  // Grid Dimensions
  //
  // Margin between items [x, y] in px
  margin: P.default.arrayOf(P.default.number),
  // Padding inside the container [x, y] in px
  containerPadding: P.default.arrayOf(P.default.number),
  // Rows have a static height, but you can change this based on breakpoints if you like
  rowHeight: P.default.number,
  // Default Infinity, but you can specify a max here if you like.
  // Note that this isn't fully fleshed out and won't error if you specify a layout that
  // extends beyond the row capacity. It will, however, not allow users to drag/resize
  // an item past the barrier. They can push items beyond the barrier, though.
  // Intentionally not documented for this reason.
  maxRows: P.default.number,
  //
  // Flags
  //
  isBounded: P.default.bool,
  isDraggable: P.default.bool,
  isResizable: P.default.bool,
  // If true, grid can be placed one over the other.
  allowOverlap: P.default.bool,
  // If true, grid items won't change position when being dragged over.
  preventCollision: P.default.bool,
  // Use CSS transforms instead of top/left
  useCSSTransforms: P.default.bool,
  // parent layout transform scale
  transformScale: P.default.number,
  // If true, an external element can trigger onDrop callback with a specific grid position as a parameter
  isDroppable: P.default.bool,
  // Resize handle options
  resizeHandles: Ko,
  resizeHandle: Zo,
  //
  // Callbacks
  //
  // Callback so you can save the layout. Calls after each drag & resize stops.
  onLayoutChange: P.default.func,
  // Calls when drag starts. Callback is of the signature (layout, oldItem, newItem, placeholder, e, ?node).
  // All callbacks below have the same signature. 'start' and 'stop' callbacks omit the 'placeholder'.
  onDragStart: P.default.func,
  // Calls on each drag movement.
  onDrag: P.default.func,
  // Calls when drag is complete.
  onDragStop: P.default.func,
  //Calls when resize starts.
  onResizeStart: P.default.func,
  // Calls when resize movement happens.
  onResize: P.default.func,
  // Calls when resize is complete.
  onResizeStop: P.default.func,
  // Calls when some element is dropped.
  onDrop: P.default.func,
  //
  // Other validations
  //
  droppingItem: P.default.shape({
    i: P.default.string.isRequired,
    w: P.default.number.isRequired,
    h: P.default.number.isRequired
  }),
  // Children must not have duplicate keys.
  children: function(t, e) {
    const r = t[e], n = {};
    Vo.default.Children.forEach(r, function(o) {
      if ((o == null ? void 0 : o.key) != null) {
        if (n[o.key])
          throw new Error('Duplicate child key "' + o.key + '" found! This will cause problems in ReactGridLayout.');
        n[o.key] = !0;
      }
    });
  },
  // Optional ref for getting a reference for the wrapping div.
  innerRef: P.default.any
};
Object.defineProperty(Ze, "__esModule", {
  value: !0
});
Ze.default = void 0;
var Se = At(ee), sr = Et, z = At(ce), Jo = qr, Qo = Uo, _e = R, I = oe, ar = ae, ei = At(Xe);
function At(t) {
  return t && t.__esModule ? t : { default: t };
}
function lr(t, e) {
  var r = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    e && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function ht(t) {
  for (var e = 1; e < arguments.length; e++) {
    var r = arguments[e] != null ? arguments[e] : {};
    e % 2 ? lr(Object(r), !0).forEach(function(n) {
      Q(t, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : lr(Object(r)).forEach(function(n) {
      Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return t;
}
function Q(t, e, r) {
  return (e = ti(e)) in t ? Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = r, t;
}
function ti(t) {
  var e = ri(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function ri(t, e) {
  if (typeof t != "object" || !t) return t;
  var r = t[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(t, e);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
class Bt extends Se.default.Component {
  constructor() {
    super(...arguments), Q(this, "state", {
      resizing: null,
      dragging: null,
      className: ""
    }), Q(this, "elementRef", /* @__PURE__ */ Se.default.createRef()), Q(this, "onDragStart", (e, r) => {
      let {
        node: n
      } = r;
      const {
        onDragStart: o,
        transformScale: i
      } = this.props;
      if (!o) return;
      const s = {
        top: 0,
        left: 0
      }, {
        offsetParent: l
      } = n;
      if (!l) return;
      const a = l.getBoundingClientRect(), u = n.getBoundingClientRect(), c = u.left / i, d = a.left / i, f = u.top / i, v = a.top / i;
      s.left = c - d + l.scrollLeft, s.top = f - v + l.scrollTop, this.setState({
        dragging: s
      });
      const {
        x: S,
        y: E
      } = (0, I.calcXY)(this.getPositionParams(), s.top, s.left, this.props.w, this.props.h);
      return o.call(this, this.props.i, S, E, {
        e,
        node: n,
        newPosition: s
      });
    }), Q(this, "onDrag", (e, r, n) => {
      let {
        node: o,
        deltaX: i,
        deltaY: s
      } = r;
      const {
        onDrag: l
      } = this.props;
      if (!l) return;
      if (!this.state.dragging)
        throw new Error("onDrag called before onDragStart.");
      let a = this.state.dragging.top + s, u = this.state.dragging.left + i;
      const {
        isBounded: c,
        i: d,
        w: f,
        h: v,
        containerWidth: S
      } = this.props, E = this.getPositionParams();
      if (c) {
        const {
          offsetParent: h
        } = o;
        if (h) {
          const {
            margin: b,
            rowHeight: m
          } = this.props, x = h.clientHeight - (0, I.calcGridItemWHPx)(v, m, b[1]);
          a = (0, I.clamp)(a, 0, x);
          const N = (0, I.calcGridColWidth)(E), $ = S - (0, I.calcGridItemWHPx)(f, N, b[0]);
          u = (0, I.clamp)(u, 0, $);
        }
      }
      const _ = {
        top: a,
        left: u
      };
      n ? this.setState({
        dragging: _
      }) : (0, sr.flushSync)(() => {
        this.setState({
          dragging: _
        });
      });
      const {
        x: p,
        y
      } = (0, I.calcXY)(E, a, u, f, v);
      return l.call(this, d, p, y, {
        e,
        node: o,
        newPosition: _
      });
    }), Q(this, "onDragStop", (e, r) => {
      let {
        node: n
      } = r;
      const {
        onDragStop: o
      } = this.props;
      if (!o) return;
      if (!this.state.dragging)
        throw new Error("onDragEnd called before onDragStart.");
      const {
        w: i,
        h: s,
        i: l
      } = this.props, {
        left: a,
        top: u
      } = this.state.dragging, c = {
        top: u,
        left: a
      };
      this.setState({
        dragging: null
      });
      const {
        x: d,
        y: f
      } = (0, I.calcXY)(this.getPositionParams(), u, a, i, s);
      return o.call(this, l, d, f, {
        e,
        node: n,
        newPosition: c
      });
    }), Q(this, "onResizeStop", (e, r, n) => this.onResizeHandler(e, r, n, "onResizeStop")), Q(this, "onResizeStart", (e, r, n) => this.onResizeHandler(e, r, n, "onResizeStart")), Q(this, "onResize", (e, r, n) => this.onResizeHandler(e, r, n, "onResize"));
  }
  shouldComponentUpdate(e, r) {
    if (this.props.children !== e.children || this.props.droppingPosition !== e.droppingPosition) return !0;
    const n = (0, I.calcGridItemPosition)(this.getPositionParams(this.props), this.props.x, this.props.y, this.props.w, this.props.h, this.state), o = (0, I.calcGridItemPosition)(this.getPositionParams(e), e.x, e.y, e.w, e.h, r);
    return !(0, _e.fastPositionEqual)(n, o) || this.props.useCSSTransforms !== e.useCSSTransforms;
  }
  componentDidMount() {
    this.moveDroppingItem({});
  }
  componentDidUpdate(e) {
    this.moveDroppingItem(e);
  }
  // When a droppingPosition is present, this means we should fire a move event, as if we had moved
  // this element by `x, y` pixels.
  moveDroppingItem(e) {
    const {
      droppingPosition: r
    } = this.props;
    if (!r) return;
    const n = this.elementRef.current;
    if (!n) return;
    const o = e.droppingPosition || {
      left: 0,
      top: 0
    }, {
      dragging: i
    } = this.state, s = i && r.left !== o.left || r.top !== o.top;
    if (!i)
      this.onDragStart(r.e, {
        node: n,
        deltaX: r.left,
        deltaY: r.top
      });
    else if (s) {
      const l = r.left - i.left, a = r.top - i.top;
      this.onDrag(
        r.e,
        {
          node: n,
          deltaX: l,
          deltaY: a
        },
        !0
        // dontFLush: avoid flushSync to temper warnings
      );
    }
  }
  getPositionParams() {
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.props;
    return {
      cols: e.cols,
      containerPadding: e.containerPadding,
      containerWidth: e.containerWidth,
      margin: e.margin,
      maxRows: e.maxRows,
      rowHeight: e.rowHeight
    };
  }
  /**
   * This is where we set the grid item's absolute placement. It gets a little tricky because we want to do it
   * well when server rendering, and the only way to do that properly is to use percentage width/left because
   * we don't know exactly what the browser viewport is.
   * Unfortunately, CSS Transforms, which are great for performance, break in this instance because a percentage
   * left is relative to the item itself, not its container! So we cannot use them on the server rendering pass.
   *
   * @param  {Object} pos Position object with width, height, left, top.
   * @return {Object}     Style object.
   */
  createStyle(e) {
    const {
      usePercentages: r,
      containerWidth: n,
      useCSSTransforms: o
    } = this.props;
    let i;
    return o ? i = (0, _e.setTransform)(e) : (i = (0, _e.setTopLeft)(e), r && (i.left = (0, _e.perc)(e.left / n), i.width = (0, _e.perc)(e.width / n))), i;
  }
  /**
   * Mix a Draggable instance into a child.
   * @param  {Element} child    Child element.
   * @return {Element}          Child wrapped in Draggable.
   */
  mixinDraggable(e, r) {
    return /* @__PURE__ */ Se.default.createElement(Jo.DraggableCore, {
      disabled: !r,
      onStart: this.onDragStart,
      onDrag: this.onDrag,
      onStop: this.onDragStop,
      handle: this.props.handle,
      cancel: ".react-resizable-handle" + (this.props.cancel ? "," + this.props.cancel : ""),
      scale: this.props.transformScale,
      nodeRef: this.elementRef
    }, e);
  }
  /**
   * Utility function to setup callback handler definitions for
   * similarily structured resize events.
   */
  curryResizeHandler(e, r) {
    return (n, o) => (
      /*: Function*/
      r(n, o, e)
    );
  }
  /**
   * Mix a Resizable instance into a child.
   * @param  {Element} child    Child element.
   * @param  {Object} position  Position object (pixel values)
   * @return {Element}          Child wrapped in Resizable.
   */
  mixinResizable(e, r, n) {
    const {
      cols: o,
      minW: i,
      minH: s,
      maxW: l,
      maxH: a,
      transformScale: u,
      resizeHandles: c,
      resizeHandle: d
    } = this.props, f = this.getPositionParams(), v = (0, I.calcGridItemPosition)(f, 0, 0, o, 0).width, S = (0, I.calcGridItemPosition)(f, 0, 0, i, s), E = (0, I.calcGridItemPosition)(f, 0, 0, l, a), _ = [S.width, S.height], p = [Math.min(E.width, v), Math.min(E.height, 1 / 0)];
    return /* @__PURE__ */ Se.default.createElement(
      Qo.Resizable,
      {
        draggableOpts: {
          disabled: !n
        },
        className: n ? void 0 : "react-resizable-hide",
        width: r.width,
        height: r.height,
        minConstraints: _,
        maxConstraints: p,
        onResizeStop: this.curryResizeHandler(r, this.onResizeStop),
        onResizeStart: this.curryResizeHandler(r, this.onResizeStart),
        onResize: this.curryResizeHandler(r, this.onResize),
        transformScale: u,
        resizeHandles: c,
        handle: d
      },
      e
    );
  }
  /**
   * Wrapper around resize events to provide more useful data.
   */
  onResizeHandler(e, r, n, o) {
    let {
      node: i,
      size: s,
      handle: l
    } = r;
    const a = this.props[o];
    if (!a) return;
    const {
      x: u,
      y: c,
      i: d,
      maxH: f,
      minH: v,
      containerWidth: S
    } = this.props, {
      minW: E,
      maxW: _
    } = this.props;
    let p = s;
    i && (p = (0, _e.resizeItemInDirection)(l, n, s, S), (0, sr.flushSync)(() => {
      this.setState({
        resizing: o === "onResizeStop" ? null : p
      });
    }));
    let {
      w: y,
      h
    } = (0, I.calcWH)(this.getPositionParams(), p.width, p.height, u, c, l);
    y = (0, I.clamp)(y, Math.max(E, 1), _), h = (0, I.clamp)(h, v, f), a.call(this, d, y, h, {
      e,
      node: i,
      size: p,
      handle: l
    });
  }
  render() {
    const {
      x: e,
      y: r,
      w: n,
      h: o,
      isDraggable: i,
      isResizable: s,
      droppingPosition: l,
      useCSSTransforms: a
    } = this.props, u = (0, I.calcGridItemPosition)(this.getPositionParams(), e, r, n, o, this.state), c = Se.default.Children.only(this.props.children);
    let d = /* @__PURE__ */ Se.default.cloneElement(c, {
      ref: this.elementRef,
      className: (0, ei.default)("react-grid-item", c.props.className, this.props.className, {
        static: this.props.static,
        resizing: !!this.state.resizing,
        "react-draggable": i,
        "react-draggable-dragging": !!this.state.dragging,
        dropping: !!l,
        cssTransforms: a
      }),
      // We can set the width and height on the child, but unfortunately we can't set the position.
      style: ht(ht(ht({}, this.props.style), c.props.style), this.createStyle(u))
    });
    return d = this.mixinResizable(d, u, s), d = this.mixinDraggable(d, i), d;
  }
}
Ze.default = Bt;
Q(Bt, "propTypes", {
  // Children must be only a single element
  children: z.default.element,
  // General grid attributes
  cols: z.default.number.isRequired,
  containerWidth: z.default.number.isRequired,
  rowHeight: z.default.number.isRequired,
  margin: z.default.array.isRequired,
  maxRows: z.default.number.isRequired,
  containerPadding: z.default.array.isRequired,
  // These are all in grid units
  x: z.default.number.isRequired,
  y: z.default.number.isRequired,
  w: z.default.number.isRequired,
  h: z.default.number.isRequired,
  // All optional
  minW: function(t, e) {
    const r = t[e];
    if (typeof r != "number") return new Error("minWidth not Number");
    if (r > t.w || r > t.maxW) return new Error("minWidth larger than item width/maxWidth");
  },
  maxW: function(t, e) {
    const r = t[e];
    if (typeof r != "number") return new Error("maxWidth not Number");
    if (r < t.w || r < t.minW) return new Error("maxWidth smaller than item width/minWidth");
  },
  minH: function(t, e) {
    const r = t[e];
    if (typeof r != "number") return new Error("minHeight not Number");
    if (r > t.h || r > t.maxH) return new Error("minHeight larger than item height/maxHeight");
  },
  maxH: function(t, e) {
    const r = t[e];
    if (typeof r != "number") return new Error("maxHeight not Number");
    if (r < t.h || r < t.minH) return new Error("maxHeight smaller than item height/minHeight");
  },
  // ID is nice to have for callbacks
  i: z.default.string.isRequired,
  // Resize handle options
  resizeHandles: ar.resizeHandleAxesType,
  resizeHandle: ar.resizeHandleType,
  // Functions
  onDragStop: z.default.func,
  onDragStart: z.default.func,
  onDrag: z.default.func,
  onResizeStop: z.default.func,
  onResizeStart: z.default.func,
  onResize: z.default.func,
  // Flags
  isDraggable: z.default.bool.isRequired,
  isResizable: z.default.bool.isRequired,
  isBounded: z.default.bool.isRequired,
  static: z.default.bool,
  // Use CSS transforms instead of top/left
  useCSSTransforms: z.default.bool.isRequired,
  transformScale: z.default.number,
  // Others
  className: z.default.string,
  // Selector for draggable handle
  handle: z.default.string,
  // Selector for draggable cancel (see react-draggable)
  cancel: z.default.string,
  // Current position of a dropping element
  droppingPosition: z.default.shape({
    e: z.default.object.isRequired,
    left: z.default.number.isRequired,
    top: z.default.number.isRequired
  })
});
Q(Bt, "defaultProps", {
  className: "",
  cancel: "",
  handle: "",
  minH: 1,
  minW: 1,
  maxH: 1 / 0,
  maxW: 1 / 0,
  transformScale: 1
});
Object.defineProperty(He, "__esModule", {
  value: !0
});
He.default = void 0;
var pe = Fr(ee), gt = xt, ni = Gt(Xe), w = R, oi = oe, ur = Gt(Ze), ii = Gt(ae);
function Gt(t) {
  return t && t.__esModule ? t : { default: t };
}
function Fr(t, e) {
  if (typeof WeakMap == "function") var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
  return (Fr = function(o, i) {
    if (!i && o && o.__esModule) return o;
    var s, l, a = { __proto__: null, default: o };
    if (o === null || typeof o != "object" && typeof o != "function") return a;
    if (s = i ? n : r) {
      if (s.has(o)) return s.get(o);
      s.set(o, a);
    }
    for (const u in o) u !== "default" && {}.hasOwnProperty.call(o, u) && ((l = (s = Object.defineProperty) && Object.getOwnPropertyDescriptor(o, u)) && (l.get || l.set) ? s(a, u, l) : a[u] = o[u]);
    return a;
  })(t, e);
}
function cr(t, e) {
  var r = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    e && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function he(t) {
  for (var e = 1; e < arguments.length; e++) {
    var r = arguments[e] != null ? arguments[e] : {};
    e % 2 ? cr(Object(r), !0).forEach(function(n) {
      A(t, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : cr(Object(r)).forEach(function(n) {
      Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return t;
}
function A(t, e, r) {
  return (e = si(e)) in t ? Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = r, t;
}
function si(t) {
  var e = ai(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function ai(t, e) {
  if (typeof t != "object" || !t) return t;
  var r = t[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(t, e);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
const fr = "react-grid-layout";
let Xr = !1;
try {
  Xr = /firefox/i.test(navigator.userAgent);
} catch {
}
class ot extends pe.Component {
  constructor() {
    super(...arguments), A(this, "state", {
      activeDrag: null,
      layout: (0, w.synchronizeLayoutWithChildren)(
        this.props.layout,
        this.props.children,
        this.props.cols,
        // Legacy support for verticalCompact: false
        (0, w.compactType)(this.props),
        this.props.allowOverlap
      ),
      mounted: !1,
      oldDragItem: null,
      oldLayout: null,
      oldResizeItem: null,
      resizing: !1,
      droppingDOMNode: null,
      children: []
    }), A(this, "dragEnterCounter", 0), A(this, "onDragStart", (e, r, n, o) => {
      let {
        e: i,
        node: s
      } = o;
      const {
        layout: l
      } = this.state, a = (0, w.getLayoutItem)(l, e);
      if (!a) return;
      const u = {
        w: a.w,
        h: a.h,
        x: a.x,
        y: a.y,
        placeholder: !0,
        i: e
      };
      return this.setState({
        oldDragItem: (0, w.cloneLayoutItem)(a),
        oldLayout: l,
        activeDrag: u
      }), this.props.onDragStart(l, a, a, null, i, s);
    }), A(this, "onDrag", (e, r, n, o) => {
      let {
        e: i,
        node: s
      } = o;
      const {
        oldDragItem: l
      } = this.state;
      let {
        layout: a
      } = this.state;
      const {
        cols: u,
        allowOverlap: c,
        preventCollision: d
      } = this.props, f = (0, w.getLayoutItem)(a, e);
      if (!f) return;
      const v = {
        w: f.w,
        h: f.h,
        x: f.x,
        y: f.y,
        placeholder: !0,
        i: e
      };
      a = (0, w.moveElement)(a, f, r, n, !0, d, (0, w.compactType)(this.props), u, c), this.props.onDrag(a, l, f, v, i, s), this.setState({
        layout: c ? a : (0, w.compact)(a, (0, w.compactType)(this.props), u),
        activeDrag: v
      });
    }), A(this, "onDragStop", (e, r, n, o) => {
      let {
        e: i,
        node: s
      } = o;
      if (!this.state.activeDrag) return;
      const {
        oldDragItem: l
      } = this.state;
      let {
        layout: a
      } = this.state;
      const {
        cols: u,
        preventCollision: c,
        allowOverlap: d
      } = this.props, f = (0, w.getLayoutItem)(a, e);
      if (!f) return;
      a = (0, w.moveElement)(a, f, r, n, !0, c, (0, w.compactType)(this.props), u, d);
      const S = d ? a : (0, w.compact)(a, (0, w.compactType)(this.props), u);
      this.props.onDragStop(S, l, f, null, i, s);
      const {
        oldLayout: E
      } = this.state;
      this.setState({
        activeDrag: null,
        layout: S,
        oldDragItem: null,
        oldLayout: null
      }), this.onLayoutMaybeChanged(S, E);
    }), A(this, "onResizeStart", (e, r, n, o) => {
      let {
        e: i,
        node: s
      } = o;
      const {
        layout: l
      } = this.state, a = (0, w.getLayoutItem)(l, e);
      a && (this.setState({
        oldResizeItem: (0, w.cloneLayoutItem)(a),
        oldLayout: this.state.layout,
        resizing: !0
      }), this.props.onResizeStart(l, a, a, null, i, s));
    }), A(this, "onResize", (e, r, n, o) => {
      let {
        e: i,
        node: s,
        size: l,
        handle: a
      } = o;
      const {
        oldResizeItem: u
      } = this.state, {
        layout: c
      } = this.state, {
        cols: d,
        preventCollision: f,
        allowOverlap: v
      } = this.props;
      let S = !1, E, _, p;
      const [y, h] = (0, w.withLayoutItem)(c, e, (m) => {
        let x;
        return _ = m.x, p = m.y, ["sw", "w", "nw", "n", "ne"].indexOf(a) !== -1 && (["sw", "nw", "w"].indexOf(a) !== -1 && (_ = m.x + (m.w - r), r = m.x !== _ && _ < 0 ? m.w : r, _ = _ < 0 ? 0 : _), ["ne", "n", "nw"].indexOf(a) !== -1 && (p = m.y + (m.h - n), n = m.y !== p && p < 0 ? m.h : n, p = p < 0 ? 0 : p), S = !0), f && !v && (x = (0, w.getAllCollisions)(c, he(he({}, m), {}, {
          w: r,
          h: n,
          x: _,
          y: p
        })).filter(($) => $.i !== m.i).length > 0, x && (p = m.y, n = m.h, _ = m.x, r = m.w, S = !1)), m.w = r, m.h = n, m;
      });
      if (!h) return;
      E = y, S && (E = (0, w.moveElement)(y, h, _, p, !0, this.props.preventCollision, (0, w.compactType)(this.props), d, v));
      const b = {
        w: h.w,
        h: h.h,
        x: h.x,
        y: h.y,
        static: !0,
        i: e
      };
      this.props.onResize(E, u, h, b, i, s), this.setState({
        layout: v ? E : (0, w.compact)(E, (0, w.compactType)(this.props), d),
        activeDrag: b
      });
    }), A(this, "onResizeStop", (e, r, n, o) => {
      let {
        e: i,
        node: s
      } = o;
      const {
        layout: l,
        oldResizeItem: a
      } = this.state, {
        cols: u,
        allowOverlap: c
      } = this.props, d = (0, w.getLayoutItem)(l, e), f = c ? l : (0, w.compact)(l, (0, w.compactType)(this.props), u);
      this.props.onResizeStop(f, a, d, null, i, s);
      const {
        oldLayout: v
      } = this.state;
      this.setState({
        activeDrag: null,
        layout: f,
        oldResizeItem: null,
        oldLayout: null,
        resizing: !1
      }), this.onLayoutMaybeChanged(f, v);
    }), A(this, "onDragOver", (e) => {
      var r;
      if (e.preventDefault(), e.stopPropagation(), Xr && // $FlowIgnore can't figure this out
      !((r = e.nativeEvent.target) !== null && r !== void 0 && r.classList.contains(fr)))
        return !1;
      const {
        droppingItem: n,
        onDropDragOver: o,
        margin: i,
        cols: s,
        rowHeight: l,
        maxRows: a,
        width: u,
        containerPadding: c,
        transformScale: d
      } = this.props, f = o == null ? void 0 : o(e);
      if (f === !1)
        return this.state.droppingDOMNode && this.removeDroppingPlaceholder(), !1;
      const v = he(he({}, n), f), {
        layout: S
      } = this.state, E = e.currentTarget.getBoundingClientRect(), _ = e.clientX - E.left, p = e.clientY - E.top, y = {
        left: _ / d,
        top: p / d,
        e
      };
      if (this.state.droppingDOMNode) {
        if (this.state.droppingPosition) {
          const {
            left: h,
            top: b
          } = this.state.droppingPosition;
          (h != _ || b != p) && this.setState({
            droppingPosition: y
          });
        }
      } else {
        const h = {
          cols: s,
          margin: i,
          maxRows: a,
          rowHeight: l,
          containerWidth: u,
          containerPadding: c || i
        }, b = (0, oi.calcXY)(h, p, _, v.w, v.h);
        this.setState({
          droppingDOMNode: /* @__PURE__ */ pe.createElement("div", {
            key: v.i
          }),
          droppingPosition: y,
          layout: [...S, he(he({}, v), {}, {
            x: b.x,
            y: b.y,
            static: !1,
            isDraggable: !0
          })]
        });
      }
    }), A(this, "removeDroppingPlaceholder", () => {
      const {
        droppingItem: e,
        cols: r
      } = this.props, {
        layout: n
      } = this.state, o = (0, w.compact)(n.filter((i) => i.i !== e.i), (0, w.compactType)(this.props), r, this.props.allowOverlap);
      this.setState({
        layout: o,
        droppingDOMNode: null,
        activeDrag: null,
        droppingPosition: void 0
      });
    }), A(this, "onDragLeave", (e) => {
      e.preventDefault(), e.stopPropagation(), this.dragEnterCounter--, this.dragEnterCounter === 0 && this.removeDroppingPlaceholder();
    }), A(this, "onDragEnter", (e) => {
      e.preventDefault(), e.stopPropagation(), this.dragEnterCounter++;
    }), A(this, "onDrop", (e) => {
      e.preventDefault(), e.stopPropagation();
      const {
        droppingItem: r
      } = this.props, {
        layout: n
      } = this.state, o = n.find((i) => i.i === r.i);
      this.dragEnterCounter = 0, this.removeDroppingPlaceholder(), this.props.onDrop(n, o, e);
    });
  }
  componentDidMount() {
    this.setState({
      mounted: !0
    }), this.onLayoutMaybeChanged(this.state.layout, this.props.layout);
  }
  static getDerivedStateFromProps(e, r) {
    let n;
    return r.activeDrag ? null : (!(0, gt.deepEqual)(e.layout, r.propsLayout) || e.compactType !== r.compactType ? n = e.layout : (0, w.childrenEqual)(e.children, r.children) || (n = r.layout), n ? {
      layout: (0, w.synchronizeLayoutWithChildren)(n, e.children, e.cols, (0, w.compactType)(e), e.allowOverlap),
      // We need to save these props to state for using
      // getDerivedStateFromProps instead of componentDidMount (in which we would get extra rerender)
      compactType: e.compactType,
      children: e.children,
      propsLayout: e.layout
    } : null);
  }
  shouldComponentUpdate(e, r) {
    return (
      // NOTE: this is almost always unequal. Therefore the only way to get better performance
      // from SCU is if the user intentionally memoizes children. If they do, and they can
      // handle changes properly, performance will increase.
      this.props.children !== e.children || !(0, w.fastRGLPropsEqual)(this.props, e, gt.deepEqual) || this.state.activeDrag !== r.activeDrag || this.state.mounted !== r.mounted || this.state.droppingPosition !== r.droppingPosition
    );
  }
  componentDidUpdate(e, r) {
    if (!this.state.activeDrag) {
      const n = this.state.layout, o = r.layout;
      this.onLayoutMaybeChanged(n, o);
    }
  }
  /**
   * Calculates a pixel value for the container.
   * @return {String} Container height in pixels.
   */
  containerHeight() {
    if (!this.props.autoSize) return;
    const e = (0, w.bottom)(this.state.layout), r = this.props.containerPadding ? this.props.containerPadding[1] : this.props.margin[1];
    return e * this.props.rowHeight + (e - 1) * this.props.margin[1] + r * 2 + "px";
  }
  onLayoutMaybeChanged(e, r) {
    r || (r = this.state.layout), (0, gt.deepEqual)(r, e) || this.props.onLayoutChange(e);
  }
  /**
   * Create a placeholder object.
   * @return {Element} Placeholder div.
   */
  placeholder() {
    const {
      activeDrag: e
    } = this.state;
    if (!e) return null;
    const {
      width: r,
      cols: n,
      margin: o,
      containerPadding: i,
      rowHeight: s,
      maxRows: l,
      useCSSTransforms: a,
      transformScale: u
    } = this.props;
    return /* @__PURE__ */ pe.createElement(ur.default, {
      w: e.w,
      h: e.h,
      x: e.x,
      y: e.y,
      i: e.i,
      className: "react-grid-placeholder ".concat(this.state.resizing ? "placeholder-resizing" : ""),
      containerWidth: r,
      cols: n,
      margin: o,
      containerPadding: i || o,
      maxRows: l,
      rowHeight: s,
      isDraggable: !1,
      isResizable: !1,
      isBounded: !1,
      useCSSTransforms: a,
      transformScale: u
    }, /* @__PURE__ */ pe.createElement("div", null));
  }
  /**
   * Given a grid item, set its style attributes & surround in a <Draggable>.
   * @param  {Element} child React element.
   * @return {Element}       Element wrapped in draggable and properly placed.
   */
  processGridItem(e, r) {
    if (!e || !e.key) return;
    const n = (0, w.getLayoutItem)(this.state.layout, String(e.key));
    if (!n) return null;
    const {
      width: o,
      cols: i,
      margin: s,
      containerPadding: l,
      rowHeight: a,
      maxRows: u,
      isDraggable: c,
      isResizable: d,
      isBounded: f,
      useCSSTransforms: v,
      transformScale: S,
      draggableCancel: E,
      draggableHandle: _,
      resizeHandles: p,
      resizeHandle: y
    } = this.props, {
      mounted: h,
      droppingPosition: b
    } = this.state, m = typeof n.isDraggable == "boolean" ? n.isDraggable : !n.static && c, x = typeof n.isResizable == "boolean" ? n.isResizable : !n.static && d, N = n.resizeHandles || p, $ = m && f && n.isBounded !== !1;
    return /* @__PURE__ */ pe.createElement(ur.default, {
      containerWidth: o,
      cols: i,
      margin: s,
      containerPadding: l || s,
      maxRows: u,
      rowHeight: a,
      cancel: E,
      handle: _,
      onDragStop: this.onDragStop,
      onDragStart: this.onDragStart,
      onDrag: this.onDrag,
      onResizeStart: this.onResizeStart,
      onResize: this.onResize,
      onResizeStop: this.onResizeStop,
      isDraggable: m,
      isResizable: x,
      isBounded: $,
      useCSSTransforms: v && h,
      usePercentages: !h,
      transformScale: S,
      w: n.w,
      h: n.h,
      x: n.x,
      y: n.y,
      i: n.i,
      minH: n.minH,
      minW: n.minW,
      maxH: n.maxH,
      maxW: n.maxW,
      static: n.static,
      droppingPosition: r ? b : void 0,
      resizeHandles: N,
      resizeHandle: y
    }, e);
  }
  render() {
    const {
      className: e,
      style: r,
      isDroppable: n,
      innerRef: o
    } = this.props, i = (0, ni.default)(fr, e), s = he({
      height: this.containerHeight()
    }, r);
    return /* @__PURE__ */ pe.createElement("div", {
      ref: o,
      className: i,
      style: s,
      onDrop: n ? this.onDrop : w.noop,
      onDragLeave: n ? this.onDragLeave : w.noop,
      onDragEnter: n ? this.onDragEnter : w.noop,
      onDragOver: n ? this.onDragOver : w.noop
    }, pe.Children.map(this.props.children, (l) => this.processGridItem(l)), n && this.state.droppingDOMNode && this.processGridItem(this.state.droppingDOMNode, !0), this.placeholder());
  }
}
He.default = ot;
A(ot, "displayName", "ReactGridLayout");
A(ot, "propTypes", ii.default);
A(ot, "defaultProps", {
  autoSize: !0,
  cols: 12,
  className: "",
  style: {},
  draggableHandle: "",
  draggableCancel: "",
  containerPadding: null,
  rowHeight: 150,
  maxRows: 1 / 0,
  // infinite vertical growth
  layout: [],
  margin: [10, 10],
  isBounded: !1,
  isDraggable: !0,
  isResizable: !0,
  allowOverlap: !1,
  isDroppable: !1,
  useCSSTransforms: !0,
  transformScale: 1,
  verticalCompact: !0,
  compactType: "vertical",
  preventCollision: !1,
  droppingItem: {
    i: "__dropping-elem__",
    h: 1,
    w: 1
  },
  resizeHandles: ["se"],
  onLayoutChange: w.noop,
  onDragStart: w.noop,
  onDrag: w.noop,
  onDragStop: w.noop,
  onResizeStart: w.noop,
  onResize: w.noop,
  onResizeStop: w.noop,
  onDrop: w.noop,
  onDropDragOver: w.noop
});
var it = {}, we = {};
Object.defineProperty(we, "__esModule", {
  value: !0
});
we.findOrGenerateResponsiveLayout = ci;
we.getBreakpointFromWidth = li;
we.getColsFromBreakpoint = ui;
we.sortBreakpoints = Yt;
var qe = R;
function li(t, e) {
  const r = Yt(t);
  let n = r[0];
  for (let o = 1, i = r.length; o < i; o++) {
    const s = r[o];
    e > t[s] && (n = s);
  }
  return n;
}
function ui(t, e) {
  if (!e[t])
    throw new Error("ResponsiveReactGridLayout: `cols` entry for breakpoint " + t + " is missing!");
  return e[t];
}
function ci(t, e, r, n, o, i) {
  if (t[r]) return (0, qe.cloneLayout)(t[r]);
  let s = t[n];
  const l = Yt(e), a = l.slice(l.indexOf(r));
  for (let u = 0, c = a.length; u < c; u++) {
    const d = a[u];
    if (t[d]) {
      s = t[d];
      break;
    }
  }
  return s = (0, qe.cloneLayout)(s || []), (0, qe.compact)((0, qe.correctBounds)(s, {
    cols: o
  }), i, o);
}
function Yt(t) {
  return Object.keys(t).sort(function(r, n) {
    return t[r] - t[n];
  });
}
Object.defineProperty(it, "__esModule", {
  value: !0
});
it.default = void 0;
var dr = Vr(ee), X = Ur(ce), mt = xt, Re = R, ge = we, fi = Ur(He);
const di = ["breakpoint", "breakpoints", "cols", "layouts", "margin", "containerPadding", "onBreakpointChange", "onLayoutChange", "onWidthChange"];
function Ur(t) {
  return t && t.__esModule ? t : { default: t };
}
function Vr(t, e) {
  if (typeof WeakMap == "function") var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
  return (Vr = function(o, i) {
    if (!i && o && o.__esModule) return o;
    var s, l, a = { __proto__: null, default: o };
    if (o === null || typeof o != "object" && typeof o != "function") return a;
    if (s = i ? n : r) {
      if (s.has(o)) return s.get(o);
      s.set(o, a);
    }
    for (const u in o) u !== "default" && {}.hasOwnProperty.call(o, u) && ((l = (s = Object.defineProperty) && Object.getOwnPropertyDescriptor(o, u)) && (l.get || l.set) ? s(a, u, l) : a[u] = o[u]);
    return a;
  })(t, e);
}
function Dt() {
  return Dt = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, Dt.apply(null, arguments);
}
function pi(t, e) {
  if (t == null) return {};
  var r, n, o = hi(t, e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(t);
    for (n = 0; n < i.length; n++) r = i[n], e.indexOf(r) === -1 && {}.propertyIsEnumerable.call(t, r) && (o[r] = t[r]);
  }
  return o;
}
function hi(t, e) {
  if (t == null) return {};
  var r = {};
  for (var n in t) if ({}.hasOwnProperty.call(t, n)) {
    if (e.indexOf(n) !== -1) continue;
    r[n] = t[n];
  }
  return r;
}
function pr(t, e) {
  var r = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    e && (n = n.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), r.push.apply(r, n);
  }
  return r;
}
function yt(t) {
  for (var e = 1; e < arguments.length; e++) {
    var r = arguments[e] != null ? arguments[e] : {};
    e % 2 ? pr(Object(r), !0).forEach(function(n) {
      Le(t, n, r[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : pr(Object(r)).forEach(function(n) {
      Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(r, n));
    });
  }
  return t;
}
function Le(t, e, r) {
  return (e = gi(e)) in t ? Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = r, t;
}
function gi(t) {
  var e = mi(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function mi(t, e) {
  if (typeof t != "object" || !t) return t;
  var r = t[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(t, e);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
const hr = (t) => Object.prototype.toString.call(t);
function Ie(t, e) {
  return t == null ? null : Array.isArray(t) ? t : t[e];
}
class Ft extends dr.Component {
  constructor() {
    super(...arguments), Le(this, "state", this.generateInitialState()), Le(this, "onLayoutChange", (e) => {
      this.props.onLayoutChange(e, yt(yt({}, this.props.layouts), {}, {
        [this.state.breakpoint]: e
      }));
    });
  }
  generateInitialState() {
    const {
      width: e,
      breakpoints: r,
      layouts: n,
      cols: o
    } = this.props, i = (0, ge.getBreakpointFromWidth)(r, e), s = (0, ge.getColsFromBreakpoint)(i, o), l = this.props.verticalCompact === !1 ? null : this.props.compactType;
    return {
      layout: (0, ge.findOrGenerateResponsiveLayout)(n, r, i, i, s, l),
      breakpoint: i,
      cols: s
    };
  }
  static getDerivedStateFromProps(e, r) {
    if (!(0, mt.deepEqual)(e.layouts, r.layouts)) {
      const {
        breakpoint: n,
        cols: o
      } = r;
      return {
        layout: (0, ge.findOrGenerateResponsiveLayout)(e.layouts, e.breakpoints, n, n, o, e.compactType),
        layouts: e.layouts
      };
    }
    return null;
  }
  componentDidUpdate(e) {
    (this.props.width != e.width || this.props.breakpoint !== e.breakpoint || !(0, mt.deepEqual)(this.props.breakpoints, e.breakpoints) || !(0, mt.deepEqual)(this.props.cols, e.cols)) && this.onWidthChange(e);
  }
  /**
   * When the width changes work through breakpoints and reset state with the new width & breakpoint.
   * Width changes are necessary to figure out the widget widths.
   */
  onWidthChange(e) {
    const {
      breakpoints: r,
      cols: n,
      layouts: o,
      compactType: i
    } = this.props, s = this.props.breakpoint || (0, ge.getBreakpointFromWidth)(this.props.breakpoints, this.props.width), l = this.state.breakpoint, a = (0, ge.getColsFromBreakpoint)(s, n), u = yt({}, o);
    if (l !== s || e.breakpoints !== r || e.cols !== n) {
      l in u || (u[l] = (0, Re.cloneLayout)(this.state.layout));
      let f = (0, ge.findOrGenerateResponsiveLayout)(u, r, s, l, a, i);
      f = (0, Re.synchronizeLayoutWithChildren)(f, this.props.children, a, i, this.props.allowOverlap), u[s] = f, this.props.onBreakpointChange(s, a), this.props.onLayoutChange(f, u), this.setState({
        breakpoint: s,
        layout: f,
        cols: a
      });
    }
    const c = Ie(this.props.margin, s), d = Ie(this.props.containerPadding, s);
    this.props.onWidthChange(this.props.width, c, a, d);
  }
  render() {
    const e = this.props, {
      breakpoint: r,
      breakpoints: n,
      cols: o,
      layouts: i,
      margin: s,
      containerPadding: l,
      onBreakpointChange: a,
      onLayoutChange: u,
      onWidthChange: c
    } = e, d = pi(e, di);
    return /* @__PURE__ */ dr.createElement(fi.default, Dt({}, d, {
      // $FlowIgnore should allow nullable here due to DefaultProps
      margin: Ie(s, this.state.breakpoint),
      containerPadding: Ie(l, this.state.breakpoint),
      onLayoutChange: this.onLayoutChange,
      layout: this.state.layout,
      cols: this.state.cols
    }));
  }
}
it.default = Ft;
Le(Ft, "propTypes", {
  //
  // Basic props
  //
  // Optional, but if you are managing width yourself you may want to set the breakpoint
  // yourself as well.
  breakpoint: X.default.string,
  // {name: pxVal}, e.g. {lg: 1200, md: 996, sm: 768, xs: 480}
  breakpoints: X.default.object,
  allowOverlap: X.default.bool,
  // # of cols. This is a breakpoint -> cols map
  cols: X.default.object,
  // # of margin. This is a breakpoint -> margin map
  // e.g. { lg: [5, 5], md: [10, 10], sm: [15, 15] }
  // Margin between items [x, y] in px
  // e.g. [10, 10]
  margin: X.default.oneOfType([X.default.array, X.default.object]),
  // # of containerPadding. This is a breakpoint -> containerPadding map
  // e.g. { lg: [5, 5], md: [10, 10], sm: [15, 15] }
  // Padding inside the container [x, y] in px
  // e.g. [10, 10]
  containerPadding: X.default.oneOfType([X.default.array, X.default.object]),
  // layouts is an object mapping breakpoints to layouts.
  // e.g. {lg: Layout, md: Layout, ...}
  layouts(t, e) {
    if (hr(t[e]) !== "[object Object]")
      throw new Error("Layout property must be an object. Received: " + hr(t[e]));
    Object.keys(t[e]).forEach((r) => {
      if (!(r in t.breakpoints))
        throw new Error("Each key in layouts must align with a key in breakpoints.");
      (0, Re.validateLayout)(t.layouts[r], "layouts." + r);
    });
  },
  // The width of this component.
  // Required in this propTypes stanza because generateInitialState() will fail without it.
  width: X.default.number.isRequired,
  //
  // Callbacks
  //
  // Calls back with breakpoint and new # cols
  onBreakpointChange: X.default.func,
  // Callback so you can save the layout.
  // Calls back with (currentLayout, allLayouts). allLayouts are keyed by breakpoint.
  onLayoutChange: X.default.func,
  // Calls back with (containerWidth, margin, cols, containerPadding)
  onWidthChange: X.default.func
});
Le(Ft, "defaultProps", {
  breakpoints: {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0
  },
  cols: {
    lg: 12,
    md: 10,
    sm: 6,
    xs: 4,
    xxs: 2
  },
  containerPadding: {
    lg: null,
    md: null,
    sm: null,
    xs: null,
    xxs: null
  },
  layouts: {},
  margin: [10, 10],
  allowOverlap: !1,
  onBreakpointChange: Re.noop,
  onLayoutChange: Re.noop,
  onWidthChange: Re.noop
});
var Xt = {}, Kr = function() {
  if (typeof Map < "u")
    return Map;
  function t(e, r) {
    var n = -1;
    return e.some(function(o, i) {
      return o[0] === r ? (n = i, !0) : !1;
    }), n;
  }
  return (
    /** @class */
    function() {
      function e() {
        this.__entries__ = [];
      }
      return Object.defineProperty(e.prototype, "size", {
        /**
         * @returns {boolean}
         */
        get: function() {
          return this.__entries__.length;
        },
        enumerable: !0,
        configurable: !0
      }), e.prototype.get = function(r) {
        var n = t(this.__entries__, r), o = this.__entries__[n];
        return o && o[1];
      }, e.prototype.set = function(r, n) {
        var o = t(this.__entries__, r);
        ~o ? this.__entries__[o][1] = n : this.__entries__.push([r, n]);
      }, e.prototype.delete = function(r) {
        var n = this.__entries__, o = t(n, r);
        ~o && n.splice(o, 1);
      }, e.prototype.has = function(r) {
        return !!~t(this.__entries__, r);
      }, e.prototype.clear = function() {
        this.__entries__.splice(0);
      }, e.prototype.forEach = function(r, n) {
        n === void 0 && (n = null);
        for (var o = 0, i = this.__entries__; o < i.length; o++) {
          var s = i[o];
          r.call(n, s[1], s[0]);
        }
      }, e;
    }()
  );
}(), Pt = typeof window < "u" && typeof document < "u" && window.document === document, Ye = function() {
  return typeof global < "u" && global.Math === Math ? global : typeof self < "u" && self.Math === Math ? self : typeof window < "u" && window.Math === Math ? window : Function("return this")();
}(), yi = function() {
  return typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(Ye) : function(t) {
    return setTimeout(function() {
      return t(Date.now());
    }, 1e3 / 60);
  };
}(), vi = 2;
function bi(t, e) {
  var r = !1, n = !1, o = 0;
  function i() {
    r && (r = !1, t()), n && l();
  }
  function s() {
    yi(i);
  }
  function l() {
    var a = Date.now();
    if (r) {
      if (a - o < vi)
        return;
      n = !0;
    } else
      r = !0, n = !1, setTimeout(s, e);
    o = a;
  }
  return l;
}
var wi = 20, Oi = ["top", "right", "bottom", "left", "width", "height", "size", "weight"], Si = typeof MutationObserver < "u", _i = (
  /** @class */
  function() {
    function t() {
      this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = bi(this.refresh.bind(this), wi);
    }
    return t.prototype.addObserver = function(e) {
      ~this.observers_.indexOf(e) || this.observers_.push(e), this.connected_ || this.connect_();
    }, t.prototype.removeObserver = function(e) {
      var r = this.observers_, n = r.indexOf(e);
      ~n && r.splice(n, 1), !r.length && this.connected_ && this.disconnect_();
    }, t.prototype.refresh = function() {
      var e = this.updateObservers_();
      e && this.refresh();
    }, t.prototype.updateObservers_ = function() {
      var e = this.observers_.filter(function(r) {
        return r.gatherActive(), r.hasActive();
      });
      return e.forEach(function(r) {
        return r.broadcastActive();
      }), e.length > 0;
    }, t.prototype.connect_ = function() {
      !Pt || this.connected_ || (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), Si ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
        attributes: !0,
        childList: !0,
        characterData: !0,
        subtree: !0
      })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0), this.connected_ = !0);
    }, t.prototype.disconnect_ = function() {
      !Pt || !this.connected_ || (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1);
    }, t.prototype.onTransitionEnd_ = function(e) {
      var r = e.propertyName, n = r === void 0 ? "" : r, o = Oi.some(function(i) {
        return !!~n.indexOf(i);
      });
      o && this.refresh();
    }, t.getInstance = function() {
      return this.instance_ || (this.instance_ = new t()), this.instance_;
    }, t.instance_ = null, t;
  }()
), Zr = function(t, e) {
  for (var r = 0, n = Object.keys(e); r < n.length; r++) {
    var o = n[r];
    Object.defineProperty(t, o, {
      value: e[o],
      enumerable: !1,
      writable: !1,
      configurable: !0
    });
  }
  return t;
}, Ee = function(t) {
  var e = t && t.ownerDocument && t.ownerDocument.defaultView;
  return e || Ye;
}, Jr = st(0, 0, 0, 0);
function Fe(t) {
  return parseFloat(t) || 0;
}
function gr(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  return e.reduce(function(n, o) {
    var i = t["border-" + o + "-width"];
    return n + Fe(i);
  }, 0);
}
function Di(t) {
  for (var e = ["top", "right", "bottom", "left"], r = {}, n = 0, o = e; n < o.length; n++) {
    var i = o[n], s = t["padding-" + i];
    r[i] = Fe(s);
  }
  return r;
}
function Pi(t) {
  var e = t.getBBox();
  return st(0, 0, e.width, e.height);
}
function Ri(t) {
  var e = t.clientWidth, r = t.clientHeight;
  if (!e && !r)
    return Jr;
  var n = Ee(t).getComputedStyle(t), o = Di(n), i = o.left + o.right, s = o.top + o.bottom, l = Fe(n.width), a = Fe(n.height);
  if (n.boxSizing === "border-box" && (Math.round(l + i) !== e && (l -= gr(n, "left", "right") + i), Math.round(a + s) !== r && (a -= gr(n, "top", "bottom") + s)), !xi(t)) {
    var u = Math.round(l + i) - e, c = Math.round(a + s) - r;
    Math.abs(u) !== 1 && (l -= u), Math.abs(c) !== 1 && (a -= c);
  }
  return st(o.left, o.top, l, a);
}
var Ei = /* @__PURE__ */ function() {
  return typeof SVGGraphicsElement < "u" ? function(t) {
    return t instanceof Ee(t).SVGGraphicsElement;
  } : function(t) {
    return t instanceof Ee(t).SVGElement && typeof t.getBBox == "function";
  };
}();
function xi(t) {
  return t === Ee(t).document.documentElement;
}
function zi(t) {
  return Pt ? Ei(t) ? Pi(t) : Ri(t) : Jr;
}
function Ci(t) {
  var e = t.x, r = t.y, n = t.width, o = t.height, i = typeof DOMRectReadOnly < "u" ? DOMRectReadOnly : Object, s = Object.create(i.prototype);
  return Zr(s, {
    x: e,
    y: r,
    width: n,
    height: o,
    top: r,
    right: e + n,
    bottom: o + r,
    left: e
  }), s;
}
function st(t, e, r, n) {
  return { x: t, y: e, width: r, height: n };
}
var ji = (
  /** @class */
  function() {
    function t(e) {
      this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = st(0, 0, 0, 0), this.target = e;
    }
    return t.prototype.isActive = function() {
      var e = zi(this.target);
      return this.contentRect_ = e, e.width !== this.broadcastWidth || e.height !== this.broadcastHeight;
    }, t.prototype.broadcastRect = function() {
      var e = this.contentRect_;
      return this.broadcastWidth = e.width, this.broadcastHeight = e.height, e;
    }, t;
  }()
), Mi = (
  /** @class */
  /* @__PURE__ */ function() {
    function t(e, r) {
      var n = Ci(r);
      Zr(this, { target: e, contentRect: n });
    }
    return t;
  }()
), Ti = (
  /** @class */
  function() {
    function t(e, r, n) {
      if (this.activeObservations_ = [], this.observations_ = new Kr(), typeof e != "function")
        throw new TypeError("The callback provided as parameter 1 is not a function.");
      this.callback_ = e, this.controller_ = r, this.callbackCtx_ = n;
    }
    return t.prototype.observe = function(e) {
      if (!arguments.length)
        throw new TypeError("1 argument required, but only 0 present.");
      if (!(typeof Element > "u" || !(Element instanceof Object))) {
        if (!(e instanceof Ee(e).Element))
          throw new TypeError('parameter 1 is not of type "Element".');
        var r = this.observations_;
        r.has(e) || (r.set(e, new ji(e)), this.controller_.addObserver(this), this.controller_.refresh());
      }
    }, t.prototype.unobserve = function(e) {
      if (!arguments.length)
        throw new TypeError("1 argument required, but only 0 present.");
      if (!(typeof Element > "u" || !(Element instanceof Object))) {
        if (!(e instanceof Ee(e).Element))
          throw new TypeError('parameter 1 is not of type "Element".');
        var r = this.observations_;
        r.has(e) && (r.delete(e), r.size || this.controller_.removeObserver(this));
      }
    }, t.prototype.disconnect = function() {
      this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this);
    }, t.prototype.gatherActive = function() {
      var e = this;
      this.clearActive(), this.observations_.forEach(function(r) {
        r.isActive() && e.activeObservations_.push(r);
      });
    }, t.prototype.broadcastActive = function() {
      if (this.hasActive()) {
        var e = this.callbackCtx_, r = this.activeObservations_.map(function(n) {
          return new Mi(n.target, n.broadcastRect());
        });
        this.callback_.call(e, r, e), this.clearActive();
      }
    }, t.prototype.clearActive = function() {
      this.activeObservations_.splice(0);
    }, t.prototype.hasActive = function() {
      return this.activeObservations_.length > 0;
    }, t;
  }()
), Qr = typeof WeakMap < "u" ? /* @__PURE__ */ new WeakMap() : new Kr(), en = (
  /** @class */
  /* @__PURE__ */ function() {
    function t(e) {
      if (!(this instanceof t))
        throw new TypeError("Cannot call a class as a function.");
      if (!arguments.length)
        throw new TypeError("1 argument required, but only 0 present.");
      var r = _i.getInstance(), n = new Ti(e, r, this);
      Qr.set(this, n);
    }
    return t;
  }()
);
[
  "observe",
  "unobserve",
  "disconnect"
].forEach(function(t) {
  en.prototype[t] = function() {
    var e;
    return (e = Qr.get(this))[t].apply(e, arguments);
  };
});
var Li = function() {
  return typeof Ye.ResizeObserver < "u" ? Ye.ResizeObserver : en;
}();
const Hi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Li
}, Symbol.toStringTag, { value: "Module" })), ki = /* @__PURE__ */ dn(Hi);
Object.defineProperty(Xt, "__esModule", {
  value: !0
});
Xt.default = Fi;
var Ae = tn(ee), Wi = Ut(ce), Ni = Ut(ki), $i = Ut(Xe);
const qi = ["measureBeforeMount"];
function Ut(t) {
  return t && t.__esModule ? t : { default: t };
}
function tn(t, e) {
  if (typeof WeakMap == "function") var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
  return (tn = function(o, i) {
    if (!i && o && o.__esModule) return o;
    var s, l, a = { __proto__: null, default: o };
    if (o === null || typeof o != "object" && typeof o != "function") return a;
    if (s = i ? n : r) {
      if (s.has(o)) return s.get(o);
      s.set(o, a);
    }
    for (const u in o) u !== "default" && {}.hasOwnProperty.call(o, u) && ((l = (s = Object.defineProperty) && Object.getOwnPropertyDescriptor(o, u)) && (l.get || l.set) ? s(a, u, l) : a[u] = o[u]);
    return a;
  })(t, e);
}
function Rt() {
  return Rt = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var r = arguments[e];
      for (var n in r) ({}).hasOwnProperty.call(r, n) && (t[n] = r[n]);
    }
    return t;
  }, Rt.apply(null, arguments);
}
function Ii(t, e) {
  if (t == null) return {};
  var r, n, o = Ai(t, e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(t);
    for (n = 0; n < i.length; n++) r = i[n], e.indexOf(r) === -1 && {}.propertyIsEnumerable.call(t, r) && (o[r] = t[r]);
  }
  return o;
}
function Ai(t, e) {
  if (t == null) return {};
  var r = {};
  for (var n in t) if ({}.hasOwnProperty.call(t, n)) {
    if (e.indexOf(n) !== -1) continue;
    r[n] = t[n];
  }
  return r;
}
function De(t, e, r) {
  return (e = Bi(e)) in t ? Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = r, t;
}
function Bi(t) {
  var e = Gi(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function Gi(t, e) {
  if (typeof t != "object" || !t) return t;
  var r = t[Symbol.toPrimitive];
  if (r !== void 0) {
    var n = r.call(t, e);
    if (typeof n != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
const Yi = "react-grid-layout";
function Fi(t) {
  var e;
  return e = class extends Ae.Component {
    constructor() {
      super(...arguments), De(this, "state", {
        width: 1280
      }), De(this, "elementRef", /* @__PURE__ */ Ae.createRef()), De(this, "mounted", !1), De(this, "resizeObserver", void 0);
    }
    componentDidMount() {
      this.mounted = !0, this.resizeObserver = new Ni.default((o) => {
        if (this.elementRef.current instanceof HTMLElement) {
          const s = o[0].contentRect.width;
          this.setState({
            width: s
          });
        }
      });
      const n = this.elementRef.current;
      n instanceof HTMLElement && this.resizeObserver.observe(n);
    }
    componentWillUnmount() {
      this.mounted = !1;
      const n = this.elementRef.current;
      n instanceof HTMLElement && this.resizeObserver.unobserve(n), this.resizeObserver.disconnect();
    }
    render() {
      const n = this.props, {
        measureBeforeMount: o
      } = n, i = Ii(n, qi);
      return o && !this.mounted ? /* @__PURE__ */ Ae.createElement("div", {
        className: (0, $i.default)(this.props.className, Yi),
        style: this.props.style,
        ref: this.elementRef
      }) : /* @__PURE__ */ Ae.createElement(t, Rt({
        innerRef: this.elementRef
      }, i, this.state));
    }
  }, De(e, "defaultProps", {
    measureBeforeMount: !1
  }), De(e, "propTypes", {
    // If true, will not render children until mounted. Useful for getting the exact width before
    // rendering, to prevent any unsightly resizing.
    measureBeforeMount: Wi.default.bool
  }), e;
}
(function(t) {
  t.exports = He.default, t.exports.utils = R, t.exports.calculateUtils = oe, t.exports.Responsive = it.default, t.exports.Responsive.utils = we, t.exports.WidthProvider = Xt.default;
})(mr);
var Zi = mr.exports;
export {
  Zi as r
};
