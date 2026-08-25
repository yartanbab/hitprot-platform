import { c as cr, r as U, a as St, g as fr } from "./react-vendor-D57GAUXd.js";
import { r as qe } from "./ui-vendor-DaE-uom6.js";
var mn = { exports: {} }, Pe = {}, ft = { exports: {} };
(function(t, e) {
  (function(n, r) {
    r(e);
  })(cr, function(n) {
    function r(p) {
      return function(z, x, E, L, N, G, H) {
        return p(z, x, H);
      };
    }
    function o(p) {
      return function(z, x, E, L) {
        if (!z || !x || typeof z != "object" || typeof x != "object")
          return p(z, x, E, L);
        var N = L.get(z), G = L.get(x);
        if (N && G)
          return N === x && G === z;
        L.set(z, x), L.set(x, z);
        var H = p(z, x, E, L);
        return L.delete(z), L.delete(x), H;
      };
    }
    function i(p, m) {
      var z = {};
      for (var x in p)
        z[x] = p[x];
      for (var x in m)
        z[x] = m[x];
      return z;
    }
    function s(p) {
      return p.constructor === Object || p.constructor == null;
    }
    function l(p) {
      return typeof p.then == "function";
    }
    function a(p, m) {
      return p === m || p !== p && m !== m;
    }
    var u = "[object Arguments]", c = "[object Boolean]", d = "[object Date]", f = "[object RegExp]", h = "[object Map]", w = "[object Number]", R = "[object Object]", _ = "[object Set]", y = "[object String]", M = Object.prototype.toString;
    function S(p) {
      var m = p.areArraysEqual, z = p.areDatesEqual, x = p.areMapsEqual, E = p.areObjectsEqual, L = p.areRegExpsEqual, N = p.areSetsEqual, G = p.createIsNestedEqual, H = G(V);
      function V(j, k, K) {
        if (j === k)
          return !0;
        if (!j || !k || typeof j != "object" || typeof k != "object")
          return j !== j && k !== k;
        if (s(j) && s(k))
          return E(j, k, H, K);
        var Xt = Array.isArray(j), Ut = Array.isArray(k);
        if (Xt || Ut)
          return Xt === Ut && m(j, k, H, K);
        var J = M.call(j);
        return J !== M.call(k) ? !1 : J === d ? z(j, k, H, K) : J === f ? L(j, k, H, K) : J === h ? x(j, k, H, K) : J === _ ? N(j, k, H, K) : J === R || J === u ? l(j) || l(k) ? !1 : E(j, k, H, K) : J === c || J === w || J === y ? a(j.valueOf(), k.valueOf()) : !1;
      }
      return V;
    }
    function T(p, m, z, x) {
      var E = p.length;
      if (m.length !== E)
        return !1;
      for (; E-- > 0; )
        if (!z(p[E], m[E], E, E, p, m, x))
          return !1;
      return !0;
    }
    var D = o(T);
    function B(p, m) {
      return a(p.valueOf(), m.valueOf());
    }
    function ee(p, m, z, x) {
      var E = p.size === m.size;
      if (!E)
        return !1;
      if (!p.size)
        return !0;
      var L = {}, N = 0;
      return p.forEach(function(G, H) {
        if (E) {
          var V = !1, j = 0;
          m.forEach(function(k, K) {
            !V && !L[j] && (V = z(H, K, N, j, p, m, x) && z(G, k, H, K, p, m, x)) && (L[j] = !0), j++;
          }), N++, E = V;
        }
      }), E;
    }
    var F = o(ee), It = "_owner", Oe = Object.prototype.hasOwnProperty;
    function Bt(p, m, z, x) {
      var E = Object.keys(p), L = E.length;
      if (Object.keys(m).length !== L)
        return !1;
      for (var N; L-- > 0; ) {
        if (N = E[L], N === It) {
          var G = !!p.$$typeof, H = !!m.$$typeof;
          if ((G || H) && G !== H)
            return !1;
        }
        if (!Oe.call(m, N) || !z(p[N], m[N], N, N, p, m, x))
          return !1;
      }
      return !0;
    }
    var Zn = o(Bt);
    function Gt(p, m) {
      return p.source === m.source && p.flags === m.flags;
    }
    function Yt(p, m, z, x) {
      var E = p.size === m.size;
      if (!E)
        return !1;
      if (!p.size)
        return !0;
      var L = {};
      return p.forEach(function(N, G) {
        if (E) {
          var H = !1, V = 0;
          m.forEach(function(j, k) {
            !H && !L[V] && (H = z(N, j, G, k, p, m, x)) && (L[V] = !0), V++;
          }), E = H;
        }
      }), E;
    }
    var Qn = o(Yt), ze = Object.freeze({
      areArraysEqual: T,
      areDatesEqual: B,
      areMapsEqual: ee,
      areObjectsEqual: Bt,
      areRegExpsEqual: Gt,
      areSetsEqual: Yt,
      createIsNestedEqual: r
    }), Ce = Object.freeze({
      areArraysEqual: D,
      areDatesEqual: B,
      areMapsEqual: F,
      areObjectsEqual: Zn,
      areRegExpsEqual: Gt,
      areSetsEqual: Qn,
      createIsNestedEqual: r
    }), er = S(ze);
    function tr(p, m) {
      return er(p, m, void 0);
    }
    var nr = S(i(ze, { createIsNestedEqual: function() {
      return a;
    } }));
    function rr(p, m) {
      return nr(p, m, void 0);
    }
    var or = S(Ce);
    function ir(p, m) {
      return or(p, m, /* @__PURE__ */ new WeakMap());
    }
    var sr = S(i(Ce, {
      createIsNestedEqual: function() {
        return a;
      }
    }));
    function ar(p, m) {
      return sr(p, m, /* @__PURE__ */ new WeakMap());
    }
    function lr(p) {
      return S(i(ze, p(ze)));
    }
    function ur(p) {
      var m = S(i(Ce, p(Ce)));
      return function(z, x, E) {
        return E === void 0 && (E = /* @__PURE__ */ new WeakMap()), m(z, x, E);
      };
    }
    n.circularDeepEqual = ir, n.circularShallowEqual = ar, n.createCustomCircularEqual = ur, n.createCustomEqual = lr, n.deepEqual = tr, n.sameValueZeroEqual = a, n.shallowEqual = rr, Object.defineProperty(n, "__esModule", { value: !0 });
  });
})(ft, ft.exports);
var _t = ft.exports, O = {}, dr = function(e, n, r) {
  return e === n ? !0 : e.className === n.className && r(e.style, n.style) && e.width === n.width && e.autoSize === n.autoSize && e.cols === n.cols && e.draggableCancel === n.draggableCancel && e.draggableHandle === n.draggableHandle && r(e.verticalCompact, n.verticalCompact) && r(e.compactType, n.compactType) && r(e.layout, n.layout) && r(e.margin, n.margin) && r(e.containerPadding, n.containerPadding) && e.rowHeight === n.rowHeight && e.maxRows === n.maxRows && e.isBounded === n.isBounded && e.isDraggable === n.isDraggable && e.isResizable === n.isResizable && e.allowOverlap === n.allowOverlap && e.preventCollision === n.preventCollision && e.useCSSTransforms === n.useCSSTransforms && e.transformScale === n.transformScale && e.isDroppable === n.isDroppable && r(e.resizeHandles, n.resizeHandles) && r(e.resizeHandle, n.resizeHandle) && e.onLayoutChange === n.onLayoutChange && e.onDragStart === n.onDragStart && e.onDrag === n.onDrag && e.onDragStop === n.onDragStop && e.onResizeStart === n.onResizeStart && e.onResize === n.onResize && e.onResizeStop === n.onResizeStop && e.onDrop === n.onDrop && r(e.droppingItem, n.droppingItem) && r(e.innerRef, n.innerRef);
};
Object.defineProperty(O, "__esModule", {
  value: !0
});
O.bottom = $e;
O.childrenEqual = vr;
O.cloneLayout = yn;
O.cloneLayoutItem = ce;
O.collides = Ae;
O.compact = bn;
O.compactItem = wn;
O.compactType = Mr;
O.correctBounds = On;
O.fastPositionEqual = br;
O.fastRGLPropsEqual = void 0;
O.getAllCollisions = Sn;
O.getFirstCollision = le;
O.getLayoutItem = Rt;
O.getStatics = Dt;
O.modifyLayout = vn;
O.moveElement = _e;
O.moveElementAwayFromCollision = pt;
O.noop = void 0;
O.perc = Or;
O.resizeItemInDirection = xr;
O.setTopLeft = zr;
O.setTransform = Er;
O.sortLayoutItems = jt;
O.sortLayoutItemsByColRow = xn;
O.sortLayoutItemsByRowCol = Pn;
O.synchronizeLayoutWithChildren = Cr;
O.validateLayout = jr;
O.withLayoutItem = yr;
var Ft = _t, Se = pr(U);
function pr(t) {
  return t && t.__esModule ? t : { default: t };
}
function Vt(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function He(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Vt(Object(n), !0).forEach(function(r) {
      hr(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Vt(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function hr(t, e, n) {
  return (e = gr(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function gr(t) {
  var e = mr(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function mr(t, e) {
  if (typeof t != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function $e(t) {
  let e = 0, n;
  for (let r = 0, o = t.length; r < o; r++)
    n = t[r].y + t[r].h, n > e && (e = n);
  return e;
}
function yn(t) {
  const e = Array(t.length);
  for (let n = 0, r = t.length; n < r; n++)
    e[n] = ce(t[n]);
  return e;
}
function vn(t, e) {
  const n = Array(t.length);
  for (let r = 0, o = t.length; r < o; r++)
    e.i === t[r].i ? n[r] = e : n[r] = t[r];
  return n;
}
function yr(t, e, n) {
  let r = Rt(t, e);
  return r ? (r = n(ce(r)), t = vn(t, r), [t, r]) : [t, null];
}
function ce(t) {
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
function vr(t, e) {
  return (0, Ft.deepEqual)(Se.default.Children.map(t, (n) => n == null ? void 0 : n.key), Se.default.Children.map(e, (n) => n == null ? void 0 : n.key)) && (0, Ft.deepEqual)(Se.default.Children.map(t, (n) => n == null ? void 0 : n.props["data-grid"]), Se.default.Children.map(e, (n) => n == null ? void 0 : n.props["data-grid"]));
}
O.fastRGLPropsEqual = dr;
function br(t, e) {
  return t.left === e.left && t.top === e.top && t.width === e.width && t.height === e.height;
}
function Ae(t, e) {
  return !(t.i === e.i || t.x + t.w <= e.x || t.x >= e.x + e.w || t.y + t.h <= e.y || t.y >= e.y + e.h);
}
function bn(t, e, n, r) {
  const o = Dt(t);
  let i = $e(o);
  const s = jt(t, e), l = Array(t.length);
  for (let a = 0, u = s.length; a < u; a++) {
    let c = ce(s[a]);
    c.static || (c = wn(o, c, e, n, s, r, i), i = Math.max(i, c.y + c.h), o.push(c)), l[t.indexOf(s[a])] = c, c.moved = !1;
  }
  return l;
}
const wr = {
  x: "w",
  y: "h"
};
function dt(t, e, n, r) {
  const o = wr[r];
  e[r] += 1;
  const i = t.map((s) => s.i).indexOf(e.i);
  for (let s = i + 1; s < t.length; s++) {
    const l = t[s];
    if (!l.static) {
      if (l.y > e.y + e.h) break;
      Ae(e, l) && dt(t, l, n + e[o], r);
    }
  }
  e[r] = n;
}
function wn(t, e, n, r, o, i, s) {
  const l = n === "vertical", a = n === "horizontal";
  if (l)
    for (typeof s == "number" ? e.y = Math.min(s, e.y) : e.y = Math.min($e(t), e.y); e.y > 0 && !le(t, e); )
      e.y--;
  else if (a)
    for (; e.x > 0 && !le(t, e); )
      e.x--;
  let u;
  for (; (u = le(t, e)) && !(n === null && i); )
    if (a ? dt(o, e, u.x + u.w, "x") : dt(o, e, u.y + u.h, "y"), a && e.x + e.w > r)
      for (e.x = r - e.w, e.y++; e.x > 0 && !le(t, e); )
        e.x--;
  return e.y = Math.max(e.y, 0), e.x = Math.max(e.x, 0), e;
}
function On(t, e) {
  const n = Dt(t);
  for (let r = 0, o = t.length; r < o; r++) {
    const i = t[r];
    if (i.x + i.w > e.cols && (i.x = e.cols - i.w), i.x < 0 && (i.x = 0, i.w = e.cols), !i.static) n.push(i);
    else
      for (; le(n, i); )
        i.y++;
  }
  return t;
}
function Rt(t, e) {
  for (let n = 0, r = t.length; n < r; n++)
    if (t[n].i === e) return t[n];
}
function le(t, e) {
  for (let n = 0, r = t.length; n < r; n++)
    if (Ae(t[n], e)) return t[n];
}
function Sn(t, e) {
  return t.filter((n) => Ae(n, e));
}
function Dt(t) {
  return t.filter((e) => e.static);
}
function _e(t, e, n, r, o, i, s, l, a) {
  if (e.static && e.isDraggable !== !0 || e.y === r && e.x === n) return t;
  "Moving element ".concat(e.i, " to [").concat(String(n), ",").concat(String(r), "] from [").concat(e.x, ",").concat(e.y, "]");
  const u = e.x, c = e.y;
  typeof n == "number" && (e.x = n), typeof r == "number" && (e.y = r), e.moved = !0;
  let d = jt(t, s);
  (s === "vertical" && typeof r == "number" ? c >= r : s === "horizontal" && typeof n == "number" ? u >= n : !1) && (d = d.reverse());
  const h = Sn(d, e), w = h.length > 0;
  if (w && a)
    return yn(t);
  if (w && i)
    return "Collision prevented on ".concat(e.i, ", reverting."), e.x = u, e.y = c, e.moved = !1, t;
  for (let R = 0, _ = h.length; R < _; R++) {
    const y = h[R];
    "Resolving collision between ".concat(e.i, " at [").concat(e.x, ",").concat(e.y, "] and ").concat(y.i, " at [").concat(y.x, ",").concat(y.y, "]"), !y.moved && (y.static ? t = pt(t, y, e, o, s) : t = pt(t, e, y, o, s));
  }
  return t;
}
function pt(t, e, n, r, o, i) {
  const s = o === "horizontal", l = o === "vertical", a = e.static;
  if (r) {
    r = !1;
    const d = {
      x: s ? Math.max(e.x - n.w, 0) : n.x,
      y: l ? Math.max(e.y - n.h, 0) : n.y,
      w: n.w,
      h: n.h,
      i: "-1"
    }, f = le(t, d), h = f && f.y + f.h > e.y, w = f && e.x + e.w > f.x;
    if (f) {
      if (h && l)
        return _e(t, n, void 0, n.y + 1, r, a, o);
      if (h && o == null)
        return e.y = n.y, n.y = n.y + n.h, t;
      if (w && s)
        return _e(t, e, n.x, void 0, r, a, o);
    } else return "Doing reverse collision on ".concat(n.i, " up to [").concat(d.x, ",").concat(d.y, "]."), _e(t, n, s ? d.x : void 0, l ? d.y : void 0, r, a, o);
  }
  const u = s ? n.x + 1 : void 0, c = l ? n.y + 1 : void 0;
  return u == null && c == null ? t : _e(t, n, s ? n.x + 1 : void 0, l ? n.y + 1 : void 0, r, a, o);
}
function Or(t) {
  return t * 100 + "%";
}
const _n = (t, e, n, r) => t + n > r ? e : n, Rn = (t, e, n) => t < 0 ? e : n, Dn = (t) => Math.max(0, t), Pt = (t) => Math.max(0, t), xt = (t, e, n) => {
  let {
    left: r,
    height: o,
    width: i
  } = e;
  const s = t.top - (o - t.height);
  return {
    left: r,
    width: i,
    height: Rn(s, t.height, o),
    top: Pt(s)
  };
}, Et = (t, e, n) => {
  let {
    top: r,
    left: o,
    height: i,
    width: s
  } = e;
  return {
    top: r,
    height: i,
    width: _n(t.left, t.width, s, n),
    left: Dn(o)
  };
}, zt = (t, e, n) => {
  let {
    top: r,
    height: o,
    width: i
  } = e;
  const s = t.left - (i - t.width);
  return {
    height: o,
    width: s < 0 ? t.width : _n(t.left, t.width, i, n),
    top: Pt(r),
    left: Dn(s)
  };
}, Ct = (t, e, n) => {
  let {
    top: r,
    left: o,
    height: i,
    width: s
  } = e;
  return {
    width: s,
    left: o,
    height: Rn(r, t.height, i),
    top: Pt(r)
  };
}, Sr = function() {
  return xt(arguments.length <= 0 ? void 0 : arguments[0], Et(...arguments));
}, _r = function() {
  return xt(arguments.length <= 0 ? void 0 : arguments[0], zt(...arguments));
}, Rr = function() {
  return Ct(arguments.length <= 0 ? void 0 : arguments[0], Et(...arguments));
}, Dr = function() {
  return Ct(arguments.length <= 0 ? void 0 : arguments[0], zt(...arguments));
}, Pr = {
  n: xt,
  ne: Sr,
  e: Et,
  se: Rr,
  s: Ct,
  sw: Dr,
  w: zt,
  nw: _r
};
function xr(t, e, n, r) {
  const o = Pr[t];
  return o ? o(e, He(He({}, e), n), r) : n;
}
function Er(t) {
  let {
    top: e,
    left: n,
    width: r,
    height: o
  } = t;
  const i = "translate(".concat(n, "px,").concat(e, "px)");
  return {
    transform: i,
    WebkitTransform: i,
    MozTransform: i,
    msTransform: i,
    OTransform: i,
    width: "".concat(r, "px"),
    height: "".concat(o, "px"),
    position: "absolute"
  };
}
function zr(t) {
  let {
    top: e,
    left: n,
    width: r,
    height: o
  } = t;
  return {
    top: "".concat(e, "px"),
    left: "".concat(n, "px"),
    width: "".concat(r, "px"),
    height: "".concat(o, "px"),
    position: "absolute"
  };
}
function jt(t, e) {
  return e === "horizontal" ? xn(t) : e === "vertical" ? Pn(t) : t;
}
function Pn(t) {
  return t.slice(0).sort(function(e, n) {
    return e.y > n.y || e.y === n.y && e.x > n.x ? 1 : e.y === n.y && e.x === n.x ? 0 : -1;
  });
}
function xn(t) {
  return t.slice(0).sort(function(e, n) {
    return e.x > n.x || e.x === n.x && e.y > n.y ? 1 : -1;
  });
}
function Cr(t, e, n, r, o) {
  t = t || [];
  const i = [];
  Se.default.Children.forEach(e, (l) => {
    if ((l == null ? void 0 : l.key) == null) return;
    const a = Rt(t, String(l.key)), u = l.props["data-grid"];
    a && u == null ? i.push(ce(a)) : u ? i.push(ce(He(He({}, u), {}, {
      i: l.key
    }))) : i.push(ce({
      w: 1,
      h: 1,
      x: 0,
      y: $e(i),
      i: String(l.key)
    }));
  });
  const s = On(i, {
    cols: n
  });
  return o ? s : bn(s, r, n);
}
function jr(t) {
  let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "Layout";
  const n = ["x", "y", "w", "h"];
  if (!Array.isArray(t)) throw new Error(e + " must be an array!");
  for (let r = 0, o = t.length; r < o; r++) {
    const i = t[r];
    for (let s = 0; s < n.length; s++) {
      const l = n[s], a = i[l];
      if (typeof a != "number" || Number.isNaN(a))
        throw new Error("ReactGridLayout: ".concat(e, "[").concat(r, "].").concat(l, " must be a number! Received: ").concat(a, " (").concat(typeof a, ")"));
    }
    if (typeof i.i < "u" && typeof i.i != "string")
      throw new Error("ReactGridLayout: ".concat(e, "[").concat(r, "].i must be a string! Received: ").concat(i.i, " (").concat(typeof i.i, ")"));
  }
}
function Mr(t) {
  const {
    verticalCompact: e,
    compactType: n
  } = t || {};
  return e === !1 ? null : n;
}
const Tr = () => {
};
O.noop = Tr;
var Q = {};
Object.defineProperty(Q, "__esModule", {
  value: !0
});
Q.calcGridColWidth = Ie;
Q.calcGridItemPosition = Lr;
Q.calcGridItemWHPx = ht;
Q.calcWH = kr;
Q.calcXY = Hr;
Q.clamp = ue;
function Ie(t) {
  const {
    margin: e,
    containerPadding: n,
    containerWidth: r,
    cols: o
  } = t;
  return (r - e[0] * (o - 1) - n[0] * 2) / o;
}
function ht(t, e, n) {
  return Number.isFinite(t) ? Math.round(e * t + Math.max(0, t - 1) * n) : t;
}
function Lr(t, e, n, r, o, i) {
  const {
    margin: s,
    containerPadding: l,
    rowHeight: a
  } = t, u = Ie(t), c = {};
  return i && i.resizing ? (c.width = Math.round(i.resizing.width), c.height = Math.round(i.resizing.height)) : (c.width = ht(r, u, s[0]), c.height = ht(o, a, s[1])), i && i.dragging ? (c.top = Math.round(i.dragging.top), c.left = Math.round(i.dragging.left)) : i && i.resizing && typeof i.resizing.top == "number" && typeof i.resizing.left == "number" ? (c.top = Math.round(i.resizing.top), c.left = Math.round(i.resizing.left)) : (c.top = Math.round((a + s[1]) * n + l[1]), c.left = Math.round((u + s[0]) * e + l[0])), c;
}
function Hr(t, e, n, r, o) {
  const {
    margin: i,
    containerPadding: s,
    cols: l,
    rowHeight: a,
    maxRows: u
  } = t, c = Ie(t);
  let d = Math.round((n - s[0]) / (c + i[0])), f = Math.round((e - s[1]) / (a + i[1]));
  return d = ue(d, 0, l - r), f = ue(f, 0, u - o), {
    x: d,
    y: f
  };
}
function kr(t, e, n, r, o, i) {
  const {
    margin: s,
    maxRows: l,
    cols: a,
    rowHeight: u
  } = t, c = Ie(t);
  let d = Math.round((e + s[0]) / (c + s[0])), f = Math.round((n + s[1]) / (u + s[1])), h = ue(d, 0, a - r), w = ue(f, 0, l - o);
  return ["sw", "w", "nw"].indexOf(i) !== -1 && (h = ue(d, 0, a)), ["nw", "n", "ne"].indexOf(i) !== -1 && (w = ue(f, 0, l)), {
    w: h,
    h: w
  };
}
function ue(t, e, n) {
  return Math.max(Math.min(t, n), e);
}
var Be = {}, En = { exports: {} }, Nr = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED", Wr = Nr, qr = Wr;
function zn() {
}
function Cn() {
}
Cn.resetWarningCache = zn;
var $r = function() {
  function t(r, o, i, s, l, a) {
    if (a !== qr) {
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
  var n = {
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
    checkPropTypes: Cn,
    resetWarningCache: zn
  };
  return n.PropTypes = n, n;
};
En.exports = $r();
var re = En.exports, Ge = { exports: {} }, Ar = {}, Ir = Object.create, Ye = Object.defineProperty, Br = Object.getOwnPropertyDescriptor, Gr = Object.getOwnPropertyNames, Yr = Object.getPrototypeOf, Xr = Object.prototype.hasOwnProperty, Ur = (t, e) => {
  for (var n in e)
    Ye(t, n, { get: e[n], enumerable: !0 });
}, jn = (t, e, n, r) => {
  if (e && typeof e == "object" || typeof e == "function")
    for (let o of Gr(e))
      !Xr.call(t, o) && o !== n && Ye(t, o, { get: () => e[o], enumerable: !(r = Br(e, o)) || r.enumerable });
  return t;
}, we = (t, e, n) => (n = t != null ? Ir(Yr(t)) : {}, jn(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  !t || !t.__esModule ? Ye(n, "default", { value: t, enumerable: !0 }) : n,
  t
)), Fr = (t) => jn(Ye({}, "__esModule", { value: !0 }), t), Mn = {};
Ur(Mn, {
  DraggableCore: () => fe,
  default: () => Xe
});
var Vr = Fr(Mn), je = we(U), C = we(re), Kr = we(St), Jr = qe;
function gt(t, e) {
  for (let n = 0, r = t.length; n < r; n++)
    if (e.apply(e, [t[n], n, t])) return t[n];
}
function Kt(t) {
  return typeof t == "function" || Object.prototype.toString.call(t) === "[object Function]";
}
function Re(t) {
  return typeof t == "number" && !isNaN(t);
}
function A(t) {
  return parseInt(t, 10);
}
function ye(t, e, n) {
  if (t[e])
    return new Error(`Invalid prop ${e} passed to ${n} - do not set this, set it on the child.`);
}
var Ze = ["Moz", "Webkit", "O", "ms"];
function Zr(t = "transform") {
  var e, n;
  if (typeof window > "u") return "";
  const r = (n = (e = window.document) == null ? void 0 : e.documentElement) == null ? void 0 : n.style;
  if (!r || t in r) return "";
  for (let o = 0; o < Ze.length; o++)
    if (Tn(t, Ze[o]) in r) return Ze[o];
  return "";
}
function Tn(t, e) {
  return e ? `${e}${Qr(t)}` : t;
}
function Qr(t) {
  let e = "", n = !0;
  for (let r = 0; r < t.length; r++)
    n ? (e += t[r].toUpperCase(), n = !1) : t[r] === "-" ? n = !0 : e += t[r];
  return e;
}
var eo = Zr(), Qe = "";
function to(t, e) {
  var n;
  Qe || (Qe = (n = gt([
    "matches",
    "webkitMatchesSelector",
    "mozMatchesSelector",
    "msMatchesSelector",
    "oMatchesSelector"
  ], function(o) {
    return Kt(t[o]);
  })) != null ? n : "");
  const r = t[Qe];
  return Kt(r) ? !!r.call(t, e) : !1;
}
function Jt(t, e, n) {
  let r = t;
  do {
    if (to(r, e)) return !0;
    if (r === n) return !1;
    r = r.parentNode;
  } while (r);
  return !1;
}
function et(t, e, n, r) {
  if (!t) return;
  const o = { capture: !0, ...r }, i = n;
  t.addEventListener ? t.addEventListener(e, i, o) : t.attachEvent ? t.attachEvent("on" + e, i) : t["on" + e] = i;
}
function oe(t, e, n, r) {
  if (!t) return;
  const o = { capture: !0, ...r }, i = n;
  t.removeEventListener ? t.removeEventListener(e, i, o) : t.detachEvent ? t.detachEvent("on" + e, i) : t["on" + e] = null;
}
function no(t) {
  let e = t.clientHeight;
  const n = t.ownerDocument.defaultView.getComputedStyle(t);
  return e += A(n.borderTopWidth), e += A(n.borderBottomWidth), e;
}
function ro(t) {
  let e = t.clientWidth;
  const n = t.ownerDocument.defaultView.getComputedStyle(t);
  return e += A(n.borderLeftWidth), e += A(n.borderRightWidth), e;
}
function oo(t) {
  let e = t.clientHeight;
  const n = t.ownerDocument.defaultView.getComputedStyle(t);
  return e -= A(n.paddingTop), e -= A(n.paddingBottom), e;
}
function io(t) {
  let e = t.clientWidth;
  const n = t.ownerDocument.defaultView.getComputedStyle(t);
  return e -= A(n.paddingLeft), e -= A(n.paddingRight), e;
}
function so(t, e, n) {
  const o = e === e.ownerDocument.body ? { left: 0, top: 0 } : e.getBoundingClientRect(), i = (t.clientX + e.scrollLeft - o.left) / n, s = (t.clientY + e.scrollTop - o.top) / n;
  return { x: i, y: s };
}
function ao(t, e) {
  const n = Ln(t, e, "px");
  return { [Tn("transform", eo)]: n };
}
function lo(t, e) {
  return Ln(t, e, "");
}
function Ln({ x: t, y: e }, n, r) {
  let o = `translate(${t}${r},${e}${r})`;
  if (n) {
    const i = `${typeof n.x == "string" ? n.x : n.x + r}`, s = `${typeof n.y == "string" ? n.y : n.y + r}`;
    o = `translate(${i}, ${s})` + o;
  }
  return o;
}
function uo(t, e) {
  return t.targetTouches && gt(t.targetTouches, (n) => e === n.identifier) || t.changedTouches && gt(t.changedTouches, (n) => e === n.identifier);
}
function co(t) {
  if (t.targetTouches && t.targetTouches[0]) return t.targetTouches[0].identifier;
  if (t.changedTouches && t.changedTouches[0]) return t.changedTouches[0].identifier;
}
function fo() {
  return typeof __webpack_nonce__ < "u" ? __webpack_nonce__ : void 0;
}
function po(t, e) {
  if (!t) return;
  let n = t.getElementById("react-draggable-style-el");
  if (!n) {
    n = t.createElement("style"), n.type = "text/css", n.id = "react-draggable-style-el";
    const r = e ?? fo();
    r && n.setAttribute("nonce", r), n.innerHTML = `.react-draggable-transparent-selection *::-moz-selection {all: inherit;}
`, n.innerHTML += `.react-draggable-transparent-selection *::selection {all: inherit;}
`, t.getElementsByTagName("head")[0].appendChild(n);
  }
  t.body && ho(t.body, "react-draggable-transparent-selection");
}
function Zt(t) {
  window.requestAnimationFrame ? window.requestAnimationFrame(() => {
    Qt(t);
  }) : Qt(t);
}
function Qt(t) {
  if (t)
    try {
      t.body && go(t.body, "react-draggable-transparent-selection");
      const e = t.selection;
      if (e)
        e.empty();
      else {
        const n = (t.defaultView || window).getSelection();
        n && n.type !== "Caret" && n.removeAllRanges();
      }
    } catch {
    }
}
function ho(t, e) {
  t.classList ? t.classList.add(e) : t.className.match(new RegExp(`(?:^|\\s)${e}(?!\\S)`)) || (t.className += ` ${e}`);
}
function go(t, e) {
  t.classList ? t.classList.remove(e) : t.className = t.className.replace(new RegExp(`(?:^|\\s)${e}(?!\\S)`, "g"), "");
}
function mo(t, e, n) {
  if (!t.props.bounds) return [e, n];
  let { bounds: r } = t.props;
  r = typeof r == "string" ? r : bo(r);
  const o = Mt(t);
  if (typeof r == "string") {
    const { ownerDocument: i } = o, s = i.defaultView;
    if (!s)
      throw new Error("Cannot resolve the owner window of the draggable node.");
    let l;
    if (r === "parent" ? l = o.parentNode : l = o.getRootNode().querySelector(r), !(l instanceof s.HTMLElement))
      throw new Error('Bounds selector "' + r + '" could not find an element.');
    const a = l, u = s.getComputedStyle(o), c = s.getComputedStyle(a);
    r = {
      left: -o.offsetLeft + A(c.paddingLeft) + A(u.marginLeft),
      top: -o.offsetTop + A(c.paddingTop) + A(u.marginTop),
      right: io(a) - ro(o) - o.offsetLeft + A(c.paddingRight) - A(u.marginRight),
      bottom: oo(a) - no(o) - o.offsetTop + A(c.paddingBottom) - A(u.marginBottom)
    };
  }
  return Re(r.right) && (e = Math.min(e, r.right)), Re(r.bottom) && (n = Math.min(n, r.bottom)), Re(r.left) && (e = Math.max(e, r.left)), Re(r.top) && (n = Math.max(n, r.top)), [e, n];
}
function en(t, e, n) {
  const r = Math.round(e / t[0]) * t[0], o = Math.round(n / t[1]) * t[1];
  return [r, o];
}
function yo(t) {
  return t.props.axis === "both" || t.props.axis === "x";
}
function vo(t) {
  return t.props.axis === "both" || t.props.axis === "y";
}
function tt(t, e, n) {
  const r = typeof e == "number" ? uo(t, e) : null;
  if (typeof e == "number" && !r) return null;
  const o = Mt(n), i = n.props.offsetParent || o.offsetParent || o.ownerDocument.body;
  return so(r || t, i, n.props.scale);
}
function nt(t, e, n) {
  const r = !Re(t.lastX), o = Mt(t);
  return r ? {
    node: o,
    deltaX: 0,
    deltaY: 0,
    lastX: e,
    lastY: n,
    x: e,
    y: n
  } : {
    node: o,
    deltaX: e - t.lastX,
    deltaY: n - t.lastY,
    lastX: t.lastX,
    lastY: t.lastY,
    x: e,
    y: n
  };
}
function rt(t, e) {
  const n = t.props.scale;
  return {
    node: e.node,
    x: t.state.x + e.deltaX / n,
    y: t.state.y + e.deltaY / n,
    deltaX: e.deltaX / n,
    deltaY: e.deltaY / n,
    lastX: t.state.x,
    lastY: t.state.y
  };
}
function bo(t) {
  return {
    left: t.left,
    top: t.top,
    right: t.right,
    bottom: t.bottom
  };
}
function Mt(t) {
  const e = t.findDOMNode();
  if (!e)
    throw new Error("<DraggableCore>: Unmounted during event!");
  return e;
}
var ot = we(U), $ = we(re), wo = we(St);
function Z(...t) {
  Ar.DRAGGABLE_DEBUG && console.log(...t);
}
var Y = {
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
}, ne = Y.mouse, fe = class extends ot.Component {
  constructor() {
    super(...arguments), this.dragging = !1, this.lastX = NaN, this.lastY = NaN, this.touchIdentifier = null, this.mounted = !1, this.handleDragStart = (e) => {
      if (this.props.onMouseDown(e), !this.props.allowAnyClick && (typeof e.button == "number" && e.button !== 0 || e.ctrlKey)) return !1;
      const n = this.findDOMNode();
      if (!n || !n.ownerDocument || !n.ownerDocument.body)
        throw new Error("<DraggableCore> not mounted on DragStart!");
      const { ownerDocument: r } = n;
      if (this.props.disabled || !(e.target instanceof r.defaultView.Node) || this.props.handle && !Jt(e.target, this.props.handle, n) || this.props.cancel && Jt(e.target, this.props.cancel, n))
        return;
      e.type === "touchstart" && !this.props.allowMobileScroll && e.preventDefault();
      const o = co(e);
      this.touchIdentifier = o;
      const i = tt(e, o, this);
      if (i == null) return;
      const { x: s, y: l } = i, a = nt(this, s, l);
      Z("DraggableCore: handleDragStart: %j", a), Z("calling", this.props.onStart), !(this.props.onStart(e, a) === !1 || this.mounted === !1) && (this.props.enableUserSelectHack && po(r, this.props.nonce), this.dragging = !0, this.lastX = s, this.lastY = l, et(r, ne.move, this.handleDrag), et(r, ne.stop, this.handleDragStop));
    }, this.handleDrag = (e) => {
      const n = tt(e, this.touchIdentifier, this);
      if (n == null) return;
      let { x: r, y: o } = n;
      if (Array.isArray(this.props.grid)) {
        let l = r - this.lastX, a = o - this.lastY;
        if ([l, a] = en(this.props.grid, l, a), !l && !a) return;
        r = this.lastX + l, o = this.lastY + a;
      }
      const i = nt(this, r, o);
      if (Z("DraggableCore: handleDrag: %j", i), this.props.onDrag(e, i) === !1 || this.mounted === !1) {
        try {
          this.handleDragStop(new MouseEvent("mouseup"));
        } catch {
          const l = document.createEvent("MouseEvents");
          l.initMouseEvent("mouseup", !0, !0, window, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), this.handleDragStop(l);
        }
        return;
      }
      this.lastX = r, this.lastY = o;
    }, this.handleDragStop = (e) => {
      if (!this.dragging) return;
      const n = tt(e, this.touchIdentifier, this);
      if (n == null) return;
      let { x: r, y: o } = n;
      if (Array.isArray(this.props.grid)) {
        let a = r - this.lastX || 0, u = o - this.lastY || 0;
        [a, u] = en(this.props.grid, a, u), r = this.lastX + a, o = this.lastY + u;
      }
      const i = nt(this, r, o);
      if (this.props.onStop(e, i) === !1 || this.mounted === !1) return !1;
      const l = this.findDOMNode();
      l && this.props.enableUserSelectHack && Zt(l.ownerDocument), Z("DraggableCore: handleDragStop: %j", i), this.dragging = !1, this.lastX = NaN, this.lastY = NaN, l && (Z("DraggableCore: Removing handlers"), oe(l.ownerDocument, ne.move, this.handleDrag), oe(l.ownerDocument, ne.stop, this.handleDragStop));
    }, this.onMouseDown = (e) => (ne = Y.mouse, this.handleDragStart(e)), this.onMouseUp = (e) => (ne = Y.mouse, this.handleDragStop(e)), this.onTouchStart = (e) => (ne = Y.touch, this.handleDragStart(e)), this.onTouchEnd = (e) => (ne = Y.touch, this.handleDragStop(e));
  }
  componentDidMount() {
    this.mounted = !0;
    const e = this.findDOMNode();
    e && et(e, Y.touch.start, this.onTouchStart, { passive: !1 });
  }
  componentWillUnmount() {
    this.mounted = !1;
    const e = this.findDOMNode();
    if (e) {
      const { ownerDocument: n } = e;
      oe(n, Y.mouse.move, this.handleDrag), oe(n, Y.touch.move, this.handleDrag), oe(n, Y.mouse.stop, this.handleDragStop), oe(n, Y.touch.stop, this.handleDragStop), oe(e, Y.touch.start, this.onTouchStart, { passive: !1 }), this.props.enableUserSelectHack && Zt(n);
    }
  }
  // React 19 removed ReactDOM.findDOMNode, so nodeRef is now required.
  // For backward compatibility with React 18 and earlier, we still support findDOMNode if available.
  findDOMNode() {
    var e;
    if ((e = this.props) != null && e.nodeRef)
      return this.props.nodeRef.current;
    const n = wo.default;
    return typeof n.findDOMNode == "function" ? n.findDOMNode(this) : (Z(
      "react-draggable: ReactDOM.findDOMNode is not available in React 19+. You must provide a nodeRef prop. See: https://github.com/react-grid-layout/react-draggable#noderef"
    ), null);
  }
  render() {
    return ot.cloneElement(ot.Children.only(this.props.children), {
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
fe.displayName = "DraggableCore";
fe.propTypes = {
  /**
   * `allowAnyClick` allows dragging using any mouse button.
   * By default, we only accept the left button.
   *
   * Defaults to `false`.
   */
  allowAnyClick: $.default.bool,
  /**
   * `allowMobileScroll` turns off cancellation of the 'touchstart' event
   * on mobile devices. Only enable this if you are having trouble with click
   * events. Prefer using 'handle' / 'cancel' instead.
   *
   * Defaults to `false`.
   */
  allowMobileScroll: $.default.bool,
  children: $.default.node.isRequired,
  /**
   * `disabled`, if true, stops the <Draggable> from dragging. All handlers,
   * with the exception of `onMouseDown`, will not fire.
   */
  disabled: $.default.bool,
  /**
   * By default, we add 'user-select:none' attributes to the document body
   * to prevent ugly text selection during drag. If this is causing problems
   * for your app, set this to `false`.
   */
  enableUserSelectHack: $.default.bool,
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
  grid: $.default.arrayOf($.default.number),
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
  handle: $.default.string,
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
  cancel: $.default.string,
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
  nodeRef: $.default.object,
  /**
   * `nonce` is applied to the dynamically-injected <style> element used by the
   * user-select hack, so it isn't blocked under a strict Content Security
   * Policy (`style-src` without `'unsafe-inline'`). If omitted, webpack's
   * `__webpack_nonce__` global is used when available.
   */
  nonce: $.default.string,
  /**
   * Called when dragging starts.
   * If this function returns the boolean false, dragging will be canceled.
   */
  onStart: $.default.func,
  /**
   * Called while dragging.
   * If this function returns the boolean false, dragging will be canceled.
   */
  onDrag: $.default.func,
  /**
   * Called when dragging stops.
   * If this function returns the boolean false, the drag will remain active.
   */
  onStop: $.default.func,
  /**
   * A workaround option which can be passed if onMouseDown needs to be accessed,
   * since it'll always be blocked (as there is internal use of onMouseDown)
   */
  onMouseDown: $.default.func,
  /**
   * `scale`, if set, applies scaling while dragging an element
   */
  scale: $.default.number,
  /**
   * These properties should be defined on the child, not here.
   */
  className: ye,
  style: ye,
  transform: ye
};
fe.defaultProps = {
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
};
var Xe = class extends je.Component {
  constructor(e) {
    super(e), this.onDragStart = (n, r) => {
      if (Z("Draggable: onDragStart: %j", r), this.props.onStart(n, rt(this, r)) === !1) return !1;
      this.setState({ dragging: !0, dragged: !0 });
    }, this.onDrag = (n, r) => {
      if (!this.state.dragging) return !1;
      Z("Draggable: onDrag: %j", r);
      const o = rt(this, r), i = {
        x: o.x,
        y: o.y,
        slackX: 0,
        slackY: 0
      };
      if (this.props.bounds) {
        const { x: l, y: a } = i;
        i.x += this.state.slackX, i.y += this.state.slackY;
        const [u, c] = mo(this, i.x, i.y);
        i.x = u, i.y = c, i.slackX = this.state.slackX + (l - i.x), i.slackY = this.state.slackY + (a - i.y), o.x = i.x, o.y = i.y, o.deltaX = i.x - this.state.x, o.deltaY = i.y - this.state.y;
      }
      if (this.props.onDrag(n, o) === !1) return !1;
      this.setState(i);
    }, this.onDragStop = (n, r) => {
      if (!this.state.dragging || this.props.onStop(n, rt(this, r)) === !1) return !1;
      Z("Draggable: onDragStop: %j", r);
      const i = {
        dragging: !1,
        slackX: 0,
        slackY: 0
      };
      if (!!this.props.position) {
        const { x: l, y: a } = this.props.position;
        i.x = l, i.y = a;
      }
      this.setState(i);
    }, this.state = {
      // Whether or not we are currently dragging.
      dragging: !1,
      // Whether or not we have been dragged before.
      dragged: !1,
      // Current transform x and y.
      x: e.position ? e.position.x : e.defaultPosition.x,
      y: e.position ? e.position.y : e.defaultPosition.y,
      prevPropsPosition: { ...e.position },
      // Used for compensating for out-of-bounds drags
      slackX: 0,
      slackY: 0,
      // Can only determine if SVG after mounting
      isElementSVG: !1
    }, e.position && !(e.onDrag || e.onStop) && console.warn("A `position` was applied to this <Draggable>, without drag handlers. This will make this component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the `position` of this element.");
  }
  // React 16.3+
  // Arity (props, state)
  static getDerivedStateFromProps({ position: e }, { prevPropsPosition: n }) {
    return e && (!n || e.x !== n.x || e.y !== n.y) ? (Z("Draggable: getDerivedStateFromProps %j", { position: e, prevPropsPosition: n }), {
      x: e.x,
      y: e.y,
      prevPropsPosition: { ...e }
    }) : null;
  }
  componentDidMount() {
    typeof window.SVGElement < "u" && this.findDOMNode() instanceof window.SVGElement && this.setState({ isElementSVG: !0 });
  }
  componentWillUnmount() {
    this.state.dragging && this.setState({ dragging: !1 });
  }
  // React 19 removed ReactDOM.findDOMNode, so nodeRef is now required.
  // For backward compatibility with React 18 and earlier, we still support findDOMNode if available.
  findDOMNode() {
    var e;
    if ((e = this.props) != null && e.nodeRef)
      return this.props.nodeRef.current;
    const n = Kr.default;
    return typeof n.findDOMNode == "function" ? n.findDOMNode(this) : null;
  }
  render() {
    const {
      axis: e,
      bounds: n,
      children: r,
      defaultPosition: o,
      defaultClassName: i,
      defaultClassNameDragging: s,
      defaultClassNameDragged: l,
      position: a,
      positionOffset: u,
      scale: c,
      ...d
    } = this.props;
    let f = {}, h = null;
    const R = !!!a || this.state.dragging, _ = a || o, y = {
      // Set left if horizontal drag is enabled
      x: yo(this) && R ? this.state.x : _.x,
      // Set top if vertical drag is enabled
      y: vo(this) && R ? this.state.y : _.y
    };
    this.state.isElementSVG ? h = lo(y, u) : f = ao(y, u);
    const M = je.Children.only(r), S = (0, Jr.clsx)(M.props.className || "", i, {
      [s]: this.state.dragging,
      [l]: this.state.dragged
    });
    return /* @__PURE__ */ je.createElement(fe, { ...d, onStart: this.onDragStart, onDrag: this.onDrag, onStop: this.onDragStop }, je.cloneElement(M, {
      className: S,
      style: { ...M.props.style, ...f },
      transform: h
    }));
  }
};
Xe.displayName = "Draggable";
Xe.propTypes = {
  // Accepts all props <DraggableCore> accepts.
  ...fe.propTypes,
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
  axis: C.default.oneOf(["both", "x", "y", "none"]),
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
  bounds: C.default.oneOfType([
    C.default.shape({
      left: C.default.number,
      right: C.default.number,
      top: C.default.number,
      bottom: C.default.number
    }),
    C.default.string,
    C.default.oneOf([!1])
  ]),
  defaultClassName: C.default.string,
  defaultClassNameDragging: C.default.string,
  defaultClassNameDragged: C.default.string,
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
  defaultPosition: C.default.shape({
    x: C.default.number,
    y: C.default.number
  }),
  positionOffset: C.default.shape({
    x: C.default.oneOfType([C.default.number, C.default.string]),
    y: C.default.oneOfType([C.default.number, C.default.string])
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
  position: C.default.shape({
    x: C.default.number,
    y: C.default.number
  }),
  /**
   * These properties should be defined on the child, not here.
   */
  className: ye,
  style: ye,
  transform: ye
};
Xe.defaultProps = {
  ...fe.defaultProps,
  axis: "both",
  bounds: !1,
  defaultClassName: "react-draggable",
  defaultClassNameDragging: "react-draggable-dragging",
  defaultClassNameDragged: "react-draggable-dragged",
  defaultPosition: { x: 0, y: 0 },
  scale: 1
};
const mt = Vr, Oo = mt.DraggableCore, Hn = mt.default || mt;
Ge.exports = Hn;
Ge.exports.default = Hn;
Ge.exports.DraggableCore = Oo;
var kn = Ge.exports, Ue = { exports: {} }, xe = {}, Tt = {};
Tt.__esModule = !0;
Tt.cloneElement = xo;
var So = _o(U);
function _o(t) {
  return t && t.__esModule ? t : { default: t };
}
function tn(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function nn(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? tn(Object(n), !0).forEach(function(r) {
      Ro(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : tn(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function Ro(t, e, n) {
  return (e = Do(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Do(t) {
  var e = Po(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function Po(t, e) {
  if (typeof t != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function xo(t, e) {
  return e.style && t.props.style && (e.style = nn(nn({}, t.props.style), e.style)), e.className && t.props.className && (e.className = t.props.className + " " + e.className), /* @__PURE__ */ So.default.cloneElement(t, e);
}
var Ee = {};
Ee.__esModule = !0;
Ee.resizableProps = void 0;
var v = Eo(re);
function Eo(t) {
  return t && t.__esModule ? t : { default: t };
}
Ee.resizableProps = {
  /*
  * Restricts resizing to a particular axis (default: 'both')
  * 'both' - allows resizing by width or height
  * 'x' - only allows the width to be changed
  * 'y' - only allows the height to be changed
  * 'none' - disables resizing altogether
  * */
  axis: v.default.oneOf(["both", "x", "y", "none"]),
  className: v.default.string,
  /*
  * Require that one and only one child be present.
  * */
  children: v.default.element.isRequired,
  /*
  * These will be passed wholesale to react-draggable's DraggableCore
  * */
  draggableOpts: v.default.shape({
    allowAnyClick: v.default.bool,
    cancel: v.default.string,
    children: v.default.node,
    disabled: v.default.bool,
    enableUserSelectHack: v.default.bool,
    // #251: Check for Element to support SSR environments where DOM globals don't exist
    offsetParent: typeof Element < "u" ? v.default.instanceOf(Element) : v.default.any,
    grid: v.default.arrayOf(v.default.number),
    handle: v.default.string,
    nodeRef: v.default.object,
    onStart: v.default.func,
    onDrag: v.default.func,
    onStop: v.default.func,
    onMouseDown: v.default.func,
    scale: v.default.number
  }),
  /*
  * Initial height
  * */
  height: function() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
      e[n] = arguments[n];
    const r = e[0];
    return r.axis === "both" || r.axis === "y" ? v.default.number.isRequired(...e) : v.default.number(...e);
  },
  /*
  * Customize cursor resize handle
  * */
  handle: v.default.oneOfType([v.default.node, v.default.func]),
  /*
  * If you change this, be sure to update your css
  * */
  handleSize: v.default.arrayOf(v.default.number),
  lockAspectRatio: v.default.bool,
  /*
  * Max X & Y measure
  * */
  maxConstraints: v.default.arrayOf(v.default.number),
  /*
  * Min X & Y measure
  * */
  minConstraints: v.default.arrayOf(v.default.number),
  /*
  * Called on stop resize event
  * */
  onResizeStop: v.default.func,
  /*
  * Called on start resize event
  * */
  onResizeStart: v.default.func,
  /*
  * Called on resize event
  * */
  onResize: v.default.func,
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
  resizeHandles: v.default.arrayOf(v.default.oneOf(["s", "w", "e", "n", "sw", "nw", "se", "ne"])),
  /*
  * If `transform: scale(n)` is set on the parent, this should be set to `n`.
  * */
  transformScale: v.default.number,
  /*
   * Initial width
   */
  width: function() {
    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
      e[n] = arguments[n];
    const r = e[0];
    return r.axis === "both" || r.axis === "x" ? v.default.number.isRequired(...e) : v.default.number(...e);
  }
};
xe.__esModule = !0;
xe.default = void 0;
var pe = Nn(U), zo = kn, Co = Tt, jo = Ee;
const Mo = ["children", "className", "draggableOpts", "width", "height", "handle", "handleSize", "lockAspectRatio", "axis", "minConstraints", "maxConstraints", "onResize", "onResizeStop", "onResizeStart", "resizeHandles", "transformScale"];
function Nn(t, e) {
  if (typeof WeakMap == "function") var n = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap();
  return (Nn = function(o, i) {
    if (!i && o && o.__esModule) return o;
    var s, l, a = { __proto__: null, default: o };
    if (o === null || typeof o != "object" && typeof o != "function") return a;
    if (s = i ? r : n) {
      if (s.has(o)) return s.get(o);
      s.set(o, a);
    }
    for (const u in o) u !== "default" && {}.hasOwnProperty.call(o, u) && ((l = (s = Object.defineProperty) && Object.getOwnPropertyDescriptor(o, u)) && (l.get || l.set) ? s(a, u, l) : a[u] = o[u]);
    return a;
  })(t, e);
}
function yt() {
  return yt = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];
      for (var r in n) ({}).hasOwnProperty.call(n, r) && (t[r] = n[r]);
    }
    return t;
  }, yt.apply(null, arguments);
}
function To(t, e) {
  if (t == null) return {};
  var n = {};
  for (var r in t) if ({}.hasOwnProperty.call(t, r)) {
    if (e.indexOf(r) !== -1) continue;
    n[r] = t[r];
  }
  return n;
}
function rn(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function it(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? rn(Object(n), !0).forEach(function(r) {
      Lo(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : rn(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function Lo(t, e, n) {
  return (e = Ho(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Ho(t) {
  var e = ko(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function ko(t, e) {
  if (typeof t != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
class Lt extends pe.Component {
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
  runConstraints(e, n) {
    const r = this.props, o = r.minConstraints, i = r.maxConstraints, s = r.lockAspectRatio;
    if (!o && !i && !s) return [e, n];
    if (s) {
      const f = this.props.width / this.props.height, h = e - this.props.width, w = n - this.props.height;
      Math.abs(h) > Math.abs(w * f) ? n = e / f : e = n * f;
    }
    const l = e, a = n;
    let u = this.slack || [0, 0], c = u[0], d = u[1];
    return e += c, n += d, o && (e = Math.max(o[0], e), n = Math.max(o[1], n)), i && (e = Math.min(i[0], e), n = Math.min(i[1], n)), this.slack = [c + (l - e), d + (a - n)], [e, n];
  }
  /**
   * Wrapper around drag events to provide more useful data.
   *
   * @param  {String} handlerName Handler name to wrap.
   * @return {Function}           Handler function.
   */
  resizeHandler(e, n) {
    return (r, o) => {
      var i, s, l, a;
      let u = o.node, c = o.deltaX, d = o.deltaY;
      e === "onResizeStart" && this.resetData();
      const f = (this.props.axis === "both" || this.props.axis === "x") && n !== "n" && n !== "s", h = (this.props.axis === "both" || this.props.axis === "y") && n !== "e" && n !== "w";
      if (!f && !h) return;
      const w = n[0], R = n[n.length - 1], _ = u.getBoundingClientRect();
      if (this.lastHandleRect != null) {
        if (R === "w") {
          const Oe = _.left - this.lastHandleRect.left;
          c += Oe;
        }
        if (w === "n") {
          const Oe = _.top - this.lastHandleRect.top;
          d += Oe;
        }
      }
      this.lastHandleRect = _, R === "w" && (c = -c), w === "n" && (d = -d);
      const y = (i = (s = this.lastSize) == null ? void 0 : s.width) != null ? i : this.props.width, M = (l = (a = this.lastSize) == null ? void 0 : a.height) != null ? l : this.props.height;
      let S = y + (f ? c / this.props.transformScale : 0), T = M + (h ? d / this.props.transformScale : 0);
      var D = this.runConstraints(S, T);
      if (S = D[0], T = D[1], e === "onResizeStop" && this.lastSize) {
        var B = this.lastSize;
        S = B.width, T = B.height;
      }
      const ee = S !== y || T !== M;
      e !== "onResizeStop" && (this.lastSize = {
        width: S,
        height: T
      });
      const F = typeof this.props[e] == "function" ? this.props[e] : null;
      F && !(e === "onResize" && !ee) && (r.persist == null || r.persist(), F(r, {
        node: u,
        size: {
          width: S,
          height: T
        },
        handle: n
      })), e === "onResizeStop" && this.resetData();
    };
  }
  // Render a resize handle given an axis & DOM ref. Ref *must* be attached for
  // the underlying draggable library to work properly.
  renderResizeHandle(e, n) {
    const r = this.props.handle;
    if (!r)
      return /* @__PURE__ */ pe.createElement("span", {
        className: "react-resizable-handle react-resizable-handle-" + e,
        ref: n
      });
    if (typeof r == "function")
      return r(e, n);
    const o = typeof r.type == "string", i = it({
      ref: n
    }, o ? {} : {
      handleAxis: e
    });
    return /* @__PURE__ */ pe.cloneElement(r, i);
  }
  render() {
    const e = this.props, n = e.children, r = e.className, o = e.draggableOpts;
    e.width, e.height, e.handle, e.handleSize, e.lockAspectRatio, e.axis, e.minConstraints, e.maxConstraints, e.onResize, e.onResizeStop, e.onResizeStart;
    const i = e.resizeHandles;
    e.transformScale;
    const s = To(e, Mo);
    return (0, Co.cloneElement)(n, it(it({}, s), {}, {
      className: (r ? r + " " : "") + "react-resizable",
      children: [...pe.Children.toArray(n.props.children), ...i.map((l) => {
        var a;
        const u = (a = this.handleRefs[l]) != null ? a : this.handleRefs[l] = /* @__PURE__ */ pe.createRef();
        return /* @__PURE__ */ pe.createElement(zo.DraggableCore, yt({}, o, {
          nodeRef: u,
          key: "resizableHandle-" + l,
          onStop: this.resizeHandler("onResizeStop", l),
          onStart: this.resizeHandler("onResizeStart", l),
          onDrag: this.resizeHandler("onResize", l)
        }), this.renderResizeHandle(l, u));
      })]
    }));
  }
}
xe.default = Lt;
Lt.propTypes = jo.resizableProps;
Lt.defaultProps = {
  axis: "both",
  handleSize: [20, 20],
  lockAspectRatio: !1,
  minConstraints: [20, 20],
  maxConstraints: [1 / 0, 1 / 0],
  resizeHandles: ["se"],
  transformScale: 1
};
var Fe = {};
Fe.__esModule = !0;
Fe.default = void 0;
var st = qn(U), No = Wn(re), Wo = Wn(xe), qo = Ee;
const $o = ["handle", "handleSize", "onResize", "onResizeStart", "onResizeStop", "draggableOpts", "minConstraints", "maxConstraints", "lockAspectRatio", "axis", "width", "height", "resizeHandles", "style", "transformScale"];
function Wn(t) {
  return t && t.__esModule ? t : { default: t };
}
function qn(t, e) {
  if (typeof WeakMap == "function") var n = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap();
  return (qn = function(o, i) {
    if (!i && o && o.__esModule) return o;
    var s, l, a = { __proto__: null, default: o };
    if (o === null || typeof o != "object" && typeof o != "function") return a;
    if (s = i ? r : n) {
      if (s.has(o)) return s.get(o);
      s.set(o, a);
    }
    for (const u in o) u !== "default" && {}.hasOwnProperty.call(o, u) && ((l = (s = Object.defineProperty) && Object.getOwnPropertyDescriptor(o, u)) && (l.get || l.set) ? s(a, u, l) : a[u] = o[u]);
    return a;
  })(t, e);
}
function vt() {
  return vt = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];
      for (var r in n) ({}).hasOwnProperty.call(n, r) && (t[r] = n[r]);
    }
    return t;
  }, vt.apply(null, arguments);
}
function on(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function ke(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? on(Object(n), !0).forEach(function(r) {
      Ao(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : on(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function Ao(t, e, n) {
  return (e = Io(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Io(t) {
  var e = Bo(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function Bo(t, e) {
  if (typeof t != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function Go(t, e) {
  if (t == null) return {};
  var n = {};
  for (var r in t) if ({}.hasOwnProperty.call(t, r)) {
    if (e.indexOf(r) !== -1) continue;
    n[r] = t[r];
  }
  return n;
}
class $n extends st.Component {
  constructor() {
    super(...arguments), this.state = {
      width: this.props.width,
      height: this.props.height,
      propsWidth: this.props.width,
      propsHeight: this.props.height
    }, this.onResize = (e, n) => {
      const r = n.size;
      this.props.onResize ? (e.persist == null || e.persist(), this.setState(r, () => this.props.onResize && this.props.onResize(e, n))) : this.setState(r);
    };
  }
  static getDerivedStateFromProps(e, n) {
    return n.propsWidth !== e.width || n.propsHeight !== e.height ? {
      width: e.width,
      height: e.height,
      propsWidth: e.width,
      propsHeight: e.height
    } : null;
  }
  render() {
    const e = this.props, n = e.handle, r = e.handleSize;
    e.onResize;
    const o = e.onResizeStart, i = e.onResizeStop, s = e.draggableOpts, l = e.minConstraints, a = e.maxConstraints, u = e.lockAspectRatio, c = e.axis;
    e.width, e.height;
    const d = e.resizeHandles, f = e.style, h = e.transformScale, w = Go(e, $o);
    return /* @__PURE__ */ st.createElement(Wo.default, {
      axis: c,
      draggableOpts: s,
      handle: n,
      handleSize: r,
      height: this.state.height,
      lockAspectRatio: u,
      maxConstraints: a,
      minConstraints: l,
      onResizeStart: o,
      onResize: this.onResize,
      onResizeStop: i,
      resizeHandles: d,
      transformScale: h,
      width: this.state.width
    }, /* @__PURE__ */ st.createElement("div", vt({}, w, {
      style: ke(ke({}, f), {}, {
        width: this.state.width + "px",
        height: this.state.height + "px"
      })
    })));
  }
}
Fe.default = $n;
$n.propTypes = ke(ke({}, qo.resizableProps), {}, {
  children: No.default.element
});
Ue.exports = function() {
  throw new Error("Don't instantiate Resizable directly! Use require('react-resizable').Resizable");
};
Ue.exports.Resizable = xe.default;
Ue.exports.ResizableBox = Fe.default;
var Yo = Ue.exports, te = {};
Object.defineProperty(te, "__esModule", {
  value: !0
});
te.resizeHandleType = te.resizeHandleAxesType = te.default = void 0;
var b = An(re), Xo = An(U);
function An(t) {
  return t && t.__esModule ? t : { default: t };
}
const Uo = te.resizeHandleAxesType = b.default.arrayOf(b.default.oneOf(["s", "w", "e", "n", "sw", "nw", "se", "ne"])), Fo = te.resizeHandleType = b.default.oneOfType([b.default.node, b.default.func]);
te.default = {
  //
  // Basic props
  //
  className: b.default.string,
  style: b.default.object,
  // This can be set explicitly. If it is not set, it will automatically
  // be set to the container width. Note that resizes will *not* cause this to adjust.
  // If you need that behavior, use WidthProvider.
  width: b.default.number,
  // If true, the container height swells and contracts to fit contents
  autoSize: b.default.bool,
  // # of cols.
  cols: b.default.number,
  // A selector that will not be draggable.
  draggableCancel: b.default.string,
  // A selector for the draggable handler
  draggableHandle: b.default.string,
  // Deprecated
  verticalCompact: function(t) {
    t.verticalCompact;
  },
  // Choose vertical or hotizontal compaction
  compactType: b.default.oneOf(["vertical", "horizontal"]),
  // layout is an array of object with the format:
  // {x: Number, y: Number, w: Number, h: Number, i: String}
  layout: function(t) {
    var e = t.layout;
    e !== void 0 && O.validateLayout(e, "layout");
  },
  //
  // Grid Dimensions
  //
  // Margin between items [x, y] in px
  margin: b.default.arrayOf(b.default.number),
  // Padding inside the container [x, y] in px
  containerPadding: b.default.arrayOf(b.default.number),
  // Rows have a static height, but you can change this based on breakpoints if you like
  rowHeight: b.default.number,
  // Default Infinity, but you can specify a max here if you like.
  // Note that this isn't fully fleshed out and won't error if you specify a layout that
  // extends beyond the row capacity. It will, however, not allow users to drag/resize
  // an item past the barrier. They can push items beyond the barrier, though.
  // Intentionally not documented for this reason.
  maxRows: b.default.number,
  //
  // Flags
  //
  isBounded: b.default.bool,
  isDraggable: b.default.bool,
  isResizable: b.default.bool,
  // If true, grid can be placed one over the other.
  allowOverlap: b.default.bool,
  // If true, grid items won't change position when being dragged over.
  preventCollision: b.default.bool,
  // Use CSS transforms instead of top/left
  useCSSTransforms: b.default.bool,
  // parent layout transform scale
  transformScale: b.default.number,
  // If true, an external element can trigger onDrop callback with a specific grid position as a parameter
  isDroppable: b.default.bool,
  // Resize handle options
  resizeHandles: Uo,
  resizeHandle: Fo,
  //
  // Callbacks
  //
  // Callback so you can save the layout. Calls after each drag & resize stops.
  onLayoutChange: b.default.func,
  // Calls when drag starts. Callback is of the signature (layout, oldItem, newItem, placeholder, e, ?node).
  // All callbacks below have the same signature. 'start' and 'stop' callbacks omit the 'placeholder'.
  onDragStart: b.default.func,
  // Calls on each drag movement.
  onDrag: b.default.func,
  // Calls when drag is complete.
  onDragStop: b.default.func,
  //Calls when resize starts.
  onResizeStart: b.default.func,
  // Calls when resize movement happens.
  onResize: b.default.func,
  // Calls when resize is complete.
  onResizeStop: b.default.func,
  // Calls when some element is dropped.
  onDrop: b.default.func,
  //
  // Other validations
  //
  droppingItem: b.default.shape({
    i: b.default.string.isRequired,
    w: b.default.number.isRequired,
    h: b.default.number.isRequired
  }),
  // Children must not have duplicate keys.
  children: function(t, e) {
    const n = t[e], r = {};
    Xo.default.Children.forEach(n, function(o) {
      if ((o == null ? void 0 : o.key) != null) {
        if (r[o.key])
          throw new Error('Duplicate child key "' + o.key + '" found! This will cause problems in ReactGridLayout.');
        r[o.key] = !0;
      }
    });
  },
  // Optional ref for getting a reference for the wrapping div.
  innerRef: b.default.any
};
Object.defineProperty(Be, "__esModule", {
  value: !0
});
Be.default = void 0;
var he = Ht(U), sn = St, P = Ht(re), Vo = kn, Ko = Yo, ge = O, W = Q, an = te, Jo = Ht(qe);
function Ht(t) {
  return t && t.__esModule ? t : { default: t };
}
function ln(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function at(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? ln(Object(n), !0).forEach(function(r) {
      X(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : ln(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function X(t, e, n) {
  return (e = Zo(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Zo(t) {
  var e = Qo(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function Qo(t, e) {
  if (typeof t != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
class kt extends he.default.Component {
  constructor() {
    super(...arguments), X(this, "state", {
      resizing: null,
      dragging: null,
      className: ""
    }), X(this, "elementRef", /* @__PURE__ */ he.default.createRef()), X(this, "onDragStart", (e, n) => {
      let {
        node: r
      } = n;
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
      } = r;
      if (!l) return;
      const a = l.getBoundingClientRect(), u = r.getBoundingClientRect(), c = u.left / i, d = a.left / i, f = u.top / i, h = a.top / i;
      s.left = c - d + l.scrollLeft, s.top = f - h + l.scrollTop, this.setState({
        dragging: s
      });
      const {
        x: w,
        y: R
      } = (0, W.calcXY)(this.getPositionParams(), s.top, s.left, this.props.w, this.props.h);
      return o.call(this, this.props.i, w, R, {
        e,
        node: r,
        newPosition: s
      });
    }), X(this, "onDrag", (e, n, r) => {
      let {
        node: o,
        deltaX: i,
        deltaY: s
      } = n;
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
        h,
        containerWidth: w
      } = this.props, R = this.getPositionParams();
      if (c) {
        const {
          offsetParent: S
        } = o;
        if (S) {
          const {
            margin: T,
            rowHeight: D
          } = this.props, B = S.clientHeight - (0, W.calcGridItemWHPx)(h, D, T[1]);
          a = (0, W.clamp)(a, 0, B);
          const ee = (0, W.calcGridColWidth)(R), F = w - (0, W.calcGridItemWHPx)(f, ee, T[0]);
          u = (0, W.clamp)(u, 0, F);
        }
      }
      const _ = {
        top: a,
        left: u
      };
      r ? this.setState({
        dragging: _
      }) : (0, sn.flushSync)(() => {
        this.setState({
          dragging: _
        });
      });
      const {
        x: y,
        y: M
      } = (0, W.calcXY)(R, a, u, f, h);
      return l.call(this, d, y, M, {
        e,
        node: o,
        newPosition: _
      });
    }), X(this, "onDragStop", (e, n) => {
      let {
        node: r
      } = n;
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
      } = (0, W.calcXY)(this.getPositionParams(), u, a, i, s);
      return o.call(this, l, d, f, {
        e,
        node: r,
        newPosition: c
      });
    }), X(this, "onResizeStop", (e, n, r) => this.onResizeHandler(e, n, r, "onResizeStop")), X(this, "onResizeStart", (e, n, r) => this.onResizeHandler(e, n, r, "onResizeStart")), X(this, "onResize", (e, n, r) => this.onResizeHandler(e, n, r, "onResize"));
  }
  shouldComponentUpdate(e, n) {
    if (this.props.children !== e.children || this.props.droppingPosition !== e.droppingPosition) return !0;
    const r = (0, W.calcGridItemPosition)(this.getPositionParams(this.props), this.props.x, this.props.y, this.props.w, this.props.h, this.state), o = (0, W.calcGridItemPosition)(this.getPositionParams(e), e.x, e.y, e.w, e.h, n);
    return !(0, ge.fastPositionEqual)(r, o) || this.props.useCSSTransforms !== e.useCSSTransforms;
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
      droppingPosition: n
    } = this.props;
    if (!n) return;
    const r = this.elementRef.current;
    if (!r) return;
    const o = e.droppingPosition || {
      left: 0,
      top: 0
    }, {
      dragging: i
    } = this.state, s = i && n.left !== o.left || n.top !== o.top;
    if (!i)
      this.onDragStart(n.e, {
        node: r,
        deltaX: n.left,
        deltaY: n.top
      });
    else if (s) {
      const l = n.left - i.left, a = n.top - i.top;
      this.onDrag(
        n.e,
        {
          node: r,
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
      usePercentages: n,
      containerWidth: r,
      useCSSTransforms: o
    } = this.props;
    let i;
    return o ? i = (0, ge.setTransform)(e) : (i = (0, ge.setTopLeft)(e), n && (i.left = (0, ge.perc)(e.left / r), i.width = (0, ge.perc)(e.width / r))), i;
  }
  /**
   * Mix a Draggable instance into a child.
   * @param  {Element} child    Child element.
   * @return {Element}          Child wrapped in Draggable.
   */
  mixinDraggable(e, n) {
    return /* @__PURE__ */ he.default.createElement(Vo.DraggableCore, {
      disabled: !n,
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
  curryResizeHandler(e, n) {
    return (r, o) => (
      /*: Function*/
      n(r, o, e)
    );
  }
  /**
   * Mix a Resizable instance into a child.
   * @param  {Element} child    Child element.
   * @param  {Object} position  Position object (pixel values)
   * @return {Element}          Child wrapped in Resizable.
   */
  mixinResizable(e, n, r) {
    const {
      cols: o,
      minW: i,
      minH: s,
      maxW: l,
      maxH: a,
      transformScale: u,
      resizeHandles: c,
      resizeHandle: d
    } = this.props, f = this.getPositionParams(), h = (0, W.calcGridItemPosition)(f, 0, 0, o, 0).width, w = (0, W.calcGridItemPosition)(f, 0, 0, i, s), R = (0, W.calcGridItemPosition)(f, 0, 0, l, a), _ = [w.width, w.height], y = [Math.min(R.width, h), Math.min(R.height, 1 / 0)];
    return /* @__PURE__ */ he.default.createElement(
      Ko.Resizable,
      {
        draggableOpts: {
          disabled: !r
        },
        className: r ? void 0 : "react-resizable-hide",
        width: n.width,
        height: n.height,
        minConstraints: _,
        maxConstraints: y,
        onResizeStop: this.curryResizeHandler(n, this.onResizeStop),
        onResizeStart: this.curryResizeHandler(n, this.onResizeStart),
        onResize: this.curryResizeHandler(n, this.onResize),
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
  onResizeHandler(e, n, r, o) {
    let {
      node: i,
      size: s,
      handle: l
    } = n;
    const a = this.props[o];
    if (!a) return;
    const {
      x: u,
      y: c,
      i: d,
      maxH: f,
      minH: h,
      containerWidth: w
    } = this.props, {
      minW: R,
      maxW: _
    } = this.props;
    let y = s;
    i && (y = (0, ge.resizeItemInDirection)(l, r, s, w), (0, sn.flushSync)(() => {
      this.setState({
        resizing: o === "onResizeStop" ? null : y
      });
    }));
    let {
      w: M,
      h: S
    } = (0, W.calcWH)(this.getPositionParams(), y.width, y.height, u, c, l);
    M = (0, W.clamp)(M, Math.max(R, 1), _), S = (0, W.clamp)(S, h, f), a.call(this, d, M, S, {
      e,
      node: i,
      size: y,
      handle: l
    });
  }
  render() {
    const {
      x: e,
      y: n,
      w: r,
      h: o,
      isDraggable: i,
      isResizable: s,
      droppingPosition: l,
      useCSSTransforms: a
    } = this.props, u = (0, W.calcGridItemPosition)(this.getPositionParams(), e, n, r, o, this.state), c = he.default.Children.only(this.props.children);
    let d = /* @__PURE__ */ he.default.cloneElement(c, {
      ref: this.elementRef,
      className: (0, Jo.default)("react-grid-item", c.props.className, this.props.className, {
        static: this.props.static,
        resizing: !!this.state.resizing,
        "react-draggable": i,
        "react-draggable-dragging": !!this.state.dragging,
        dropping: !!l,
        cssTransforms: a
      }),
      // We can set the width and height on the child, but unfortunately we can't set the position.
      style: at(at(at({}, this.props.style), c.props.style), this.createStyle(u))
    });
    return d = this.mixinResizable(d, u, s), d = this.mixinDraggable(d, i), d;
  }
}
Be.default = kt;
X(kt, "propTypes", {
  // Children must be only a single element
  children: P.default.element,
  // General grid attributes
  cols: P.default.number.isRequired,
  containerWidth: P.default.number.isRequired,
  rowHeight: P.default.number.isRequired,
  margin: P.default.array.isRequired,
  maxRows: P.default.number.isRequired,
  containerPadding: P.default.array.isRequired,
  // These are all in grid units
  x: P.default.number.isRequired,
  y: P.default.number.isRequired,
  w: P.default.number.isRequired,
  h: P.default.number.isRequired,
  // All optional
  minW: function(t, e) {
    const n = t[e];
    if (typeof n != "number") return new Error("minWidth not Number");
    if (n > t.w || n > t.maxW) return new Error("minWidth larger than item width/maxWidth");
  },
  maxW: function(t, e) {
    const n = t[e];
    if (typeof n != "number") return new Error("maxWidth not Number");
    if (n < t.w || n < t.minW) return new Error("maxWidth smaller than item width/minWidth");
  },
  minH: function(t, e) {
    const n = t[e];
    if (typeof n != "number") return new Error("minHeight not Number");
    if (n > t.h || n > t.maxH) return new Error("minHeight larger than item height/maxHeight");
  },
  maxH: function(t, e) {
    const n = t[e];
    if (typeof n != "number") return new Error("maxHeight not Number");
    if (n < t.h || n < t.minH) return new Error("maxHeight smaller than item height/minHeight");
  },
  // ID is nice to have for callbacks
  i: P.default.string.isRequired,
  // Resize handle options
  resizeHandles: an.resizeHandleAxesType,
  resizeHandle: an.resizeHandleType,
  // Functions
  onDragStop: P.default.func,
  onDragStart: P.default.func,
  onDrag: P.default.func,
  onResizeStop: P.default.func,
  onResizeStart: P.default.func,
  onResize: P.default.func,
  // Flags
  isDraggable: P.default.bool.isRequired,
  isResizable: P.default.bool.isRequired,
  isBounded: P.default.bool.isRequired,
  static: P.default.bool,
  // Use CSS transforms instead of top/left
  useCSSTransforms: P.default.bool.isRequired,
  transformScale: P.default.number,
  // Others
  className: P.default.string,
  // Selector for draggable handle
  handle: P.default.string,
  // Selector for draggable cancel (see react-draggable)
  cancel: P.default.string,
  // Current position of a dropping element
  droppingPosition: P.default.shape({
    e: P.default.object.isRequired,
    left: P.default.number.isRequired,
    top: P.default.number.isRequired
  })
});
X(kt, "defaultProps", {
  className: "",
  cancel: "",
  handle: "",
  minH: 1,
  minW: 1,
  maxH: 1 / 0,
  maxW: 1 / 0,
  transformScale: 1
});
Object.defineProperty(Pe, "__esModule", {
  value: !0
});
Pe.default = void 0;
var ie = In(U), lt = _t, ei = Nt(qe), g = O, ti = Q, un = Nt(Be), ni = Nt(te);
function Nt(t) {
  return t && t.__esModule ? t : { default: t };
}
function In(t, e) {
  if (typeof WeakMap == "function") var n = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap();
  return (In = function(o, i) {
    if (!i && o && o.__esModule) return o;
    var s, l, a = { __proto__: null, default: o };
    if (o === null || typeof o != "object" && typeof o != "function") return a;
    if (s = i ? r : n) {
      if (s.has(o)) return s.get(o);
      s.set(o, a);
    }
    for (const u in o) u !== "default" && {}.hasOwnProperty.call(o, u) && ((l = (s = Object.defineProperty) && Object.getOwnPropertyDescriptor(o, u)) && (l.get || l.set) ? s(a, u, l) : a[u] = o[u]);
    return a;
  })(t, e);
}
function cn(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function se(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? cn(Object(n), !0).forEach(function(r) {
      q(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : cn(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function q(t, e, n) {
  return (e = ri(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function ri(t) {
  var e = oi(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function oi(t, e) {
  if (typeof t != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
const fn = "react-grid-layout";
let Bn = !1;
try {
  Bn = /firefox/i.test(navigator.userAgent);
} catch {
}
class Ve extends ie.Component {
  constructor() {
    super(...arguments), q(this, "state", {
      activeDrag: null,
      layout: (0, g.synchronizeLayoutWithChildren)(
        this.props.layout,
        this.props.children,
        this.props.cols,
        // Legacy support for verticalCompact: false
        (0, g.compactType)(this.props),
        this.props.allowOverlap
      ),
      mounted: !1,
      oldDragItem: null,
      oldLayout: null,
      oldResizeItem: null,
      resizing: !1,
      droppingDOMNode: null,
      children: []
    }), q(this, "dragEnterCounter", 0), q(this, "onDragStart", (e, n, r, o) => {
      let {
        e: i,
        node: s
      } = o;
      const {
        layout: l
      } = this.state, a = (0, g.getLayoutItem)(l, e);
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
        oldDragItem: (0, g.cloneLayoutItem)(a),
        oldLayout: l,
        activeDrag: u
      }), this.props.onDragStart(l, a, a, null, i, s);
    }), q(this, "onDrag", (e, n, r, o) => {
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
      } = this.props, f = (0, g.getLayoutItem)(a, e);
      if (!f) return;
      const h = {
        w: f.w,
        h: f.h,
        x: f.x,
        y: f.y,
        placeholder: !0,
        i: e
      };
      a = (0, g.moveElement)(a, f, n, r, !0, d, (0, g.compactType)(this.props), u, c), this.props.onDrag(a, l, f, h, i, s), this.setState({
        layout: c ? a : (0, g.compact)(a, (0, g.compactType)(this.props), u),
        activeDrag: h
      });
    }), q(this, "onDragStop", (e, n, r, o) => {
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
      } = this.props, f = (0, g.getLayoutItem)(a, e);
      if (!f) return;
      a = (0, g.moveElement)(a, f, n, r, !0, c, (0, g.compactType)(this.props), u, d);
      const w = d ? a : (0, g.compact)(a, (0, g.compactType)(this.props), u);
      this.props.onDragStop(w, l, f, null, i, s);
      const {
        oldLayout: R
      } = this.state;
      this.setState({
        activeDrag: null,
        layout: w,
        oldDragItem: null,
        oldLayout: null
      }), this.onLayoutMaybeChanged(w, R);
    }), q(this, "onResizeStart", (e, n, r, o) => {
      let {
        e: i,
        node: s
      } = o;
      const {
        layout: l
      } = this.state, a = (0, g.getLayoutItem)(l, e);
      a && (this.setState({
        oldResizeItem: (0, g.cloneLayoutItem)(a),
        oldLayout: this.state.layout,
        resizing: !0
      }), this.props.onResizeStart(l, a, a, null, i, s));
    }), q(this, "onResize", (e, n, r, o) => {
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
        allowOverlap: h
      } = this.props;
      let w = !1, R, _, y;
      const [M, S] = (0, g.withLayoutItem)(c, e, (D) => {
        let B;
        return _ = D.x, y = D.y, ["sw", "w", "nw", "n", "ne"].indexOf(a) !== -1 && (["sw", "nw", "w"].indexOf(a) !== -1 && (_ = D.x + (D.w - n), n = D.x !== _ && _ < 0 ? D.w : n, _ = _ < 0 ? 0 : _), ["ne", "n", "nw"].indexOf(a) !== -1 && (y = D.y + (D.h - r), r = D.y !== y && y < 0 ? D.h : r, y = y < 0 ? 0 : y), w = !0), f && !h && (B = (0, g.getAllCollisions)(c, se(se({}, D), {}, {
          w: n,
          h: r,
          x: _,
          y
        })).filter((F) => F.i !== D.i).length > 0, B && (y = D.y, r = D.h, _ = D.x, n = D.w, w = !1)), D.w = n, D.h = r, D;
      });
      if (!S) return;
      R = M, w && (R = (0, g.moveElement)(M, S, _, y, !0, this.props.preventCollision, (0, g.compactType)(this.props), d, h));
      const T = {
        w: S.w,
        h: S.h,
        x: S.x,
        y: S.y,
        static: !0,
        i: e
      };
      this.props.onResize(R, u, S, T, i, s), this.setState({
        layout: h ? R : (0, g.compact)(R, (0, g.compactType)(this.props), d),
        activeDrag: T
      });
    }), q(this, "onResizeStop", (e, n, r, o) => {
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
      } = this.props, d = (0, g.getLayoutItem)(l, e), f = c ? l : (0, g.compact)(l, (0, g.compactType)(this.props), u);
      this.props.onResizeStop(f, a, d, null, i, s);
      const {
        oldLayout: h
      } = this.state;
      this.setState({
        activeDrag: null,
        layout: f,
        oldResizeItem: null,
        oldLayout: null,
        resizing: !1
      }), this.onLayoutMaybeChanged(f, h);
    }), q(this, "onDragOver", (e) => {
      var n;
      if (e.preventDefault(), e.stopPropagation(), Bn && // $FlowIgnore can't figure this out
      !((n = e.nativeEvent.target) !== null && n !== void 0 && n.classList.contains(fn)))
        return !1;
      const {
        droppingItem: r,
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
      const h = se(se({}, r), f), {
        layout: w
      } = this.state, R = e.currentTarget.getBoundingClientRect(), _ = e.clientX - R.left, y = e.clientY - R.top, M = {
        left: _ / d,
        top: y / d,
        e
      };
      if (this.state.droppingDOMNode) {
        if (this.state.droppingPosition) {
          const {
            left: S,
            top: T
          } = this.state.droppingPosition;
          (S != _ || T != y) && this.setState({
            droppingPosition: M
          });
        }
      } else {
        const S = {
          cols: s,
          margin: i,
          maxRows: a,
          rowHeight: l,
          containerWidth: u,
          containerPadding: c || i
        }, T = (0, ti.calcXY)(S, y, _, h.w, h.h);
        this.setState({
          droppingDOMNode: /* @__PURE__ */ ie.createElement("div", {
            key: h.i
          }),
          droppingPosition: M,
          layout: [...w, se(se({}, h), {}, {
            x: T.x,
            y: T.y,
            static: !1,
            isDraggable: !0
          })]
        });
      }
    }), q(this, "removeDroppingPlaceholder", () => {
      const {
        droppingItem: e,
        cols: n
      } = this.props, {
        layout: r
      } = this.state, o = (0, g.compact)(r.filter((i) => i.i !== e.i), (0, g.compactType)(this.props), n, this.props.allowOverlap);
      this.setState({
        layout: o,
        droppingDOMNode: null,
        activeDrag: null,
        droppingPosition: void 0
      });
    }), q(this, "onDragLeave", (e) => {
      e.preventDefault(), e.stopPropagation(), this.dragEnterCounter--, this.dragEnterCounter === 0 && this.removeDroppingPlaceholder();
    }), q(this, "onDragEnter", (e) => {
      e.preventDefault(), e.stopPropagation(), this.dragEnterCounter++;
    }), q(this, "onDrop", (e) => {
      e.preventDefault(), e.stopPropagation();
      const {
        droppingItem: n
      } = this.props, {
        layout: r
      } = this.state, o = r.find((i) => i.i === n.i);
      this.dragEnterCounter = 0, this.removeDroppingPlaceholder(), this.props.onDrop(r, o, e);
    });
  }
  componentDidMount() {
    this.setState({
      mounted: !0
    }), this.onLayoutMaybeChanged(this.state.layout, this.props.layout);
  }
  static getDerivedStateFromProps(e, n) {
    let r;
    return n.activeDrag ? null : (!(0, lt.deepEqual)(e.layout, n.propsLayout) || e.compactType !== n.compactType ? r = e.layout : (0, g.childrenEqual)(e.children, n.children) || (r = n.layout), r ? {
      layout: (0, g.synchronizeLayoutWithChildren)(r, e.children, e.cols, (0, g.compactType)(e), e.allowOverlap),
      // We need to save these props to state for using
      // getDerivedStateFromProps instead of componentDidMount (in which we would get extra rerender)
      compactType: e.compactType,
      children: e.children,
      propsLayout: e.layout
    } : null);
  }
  shouldComponentUpdate(e, n) {
    return (
      // NOTE: this is almost always unequal. Therefore the only way to get better performance
      // from SCU is if the user intentionally memoizes children. If they do, and they can
      // handle changes properly, performance will increase.
      this.props.children !== e.children || !(0, g.fastRGLPropsEqual)(this.props, e, lt.deepEqual) || this.state.activeDrag !== n.activeDrag || this.state.mounted !== n.mounted || this.state.droppingPosition !== n.droppingPosition
    );
  }
  componentDidUpdate(e, n) {
    if (!this.state.activeDrag) {
      const r = this.state.layout, o = n.layout;
      this.onLayoutMaybeChanged(r, o);
    }
  }
  /**
   * Calculates a pixel value for the container.
   * @return {String} Container height in pixels.
   */
  containerHeight() {
    if (!this.props.autoSize) return;
    const e = (0, g.bottom)(this.state.layout), n = this.props.containerPadding ? this.props.containerPadding[1] : this.props.margin[1];
    return e * this.props.rowHeight + (e - 1) * this.props.margin[1] + n * 2 + "px";
  }
  onLayoutMaybeChanged(e, n) {
    n || (n = this.state.layout), (0, lt.deepEqual)(n, e) || this.props.onLayoutChange(e);
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
      width: n,
      cols: r,
      margin: o,
      containerPadding: i,
      rowHeight: s,
      maxRows: l,
      useCSSTransforms: a,
      transformScale: u
    } = this.props;
    return /* @__PURE__ */ ie.createElement(un.default, {
      w: e.w,
      h: e.h,
      x: e.x,
      y: e.y,
      i: e.i,
      className: "react-grid-placeholder ".concat(this.state.resizing ? "placeholder-resizing" : ""),
      containerWidth: n,
      cols: r,
      margin: o,
      containerPadding: i || o,
      maxRows: l,
      rowHeight: s,
      isDraggable: !1,
      isResizable: !1,
      isBounded: !1,
      useCSSTransforms: a,
      transformScale: u
    }, /* @__PURE__ */ ie.createElement("div", null));
  }
  /**
   * Given a grid item, set its style attributes & surround in a <Draggable>.
   * @param  {Element} child React element.
   * @return {Element}       Element wrapped in draggable and properly placed.
   */
  processGridItem(e, n) {
    if (!e || !e.key) return;
    const r = (0, g.getLayoutItem)(this.state.layout, String(e.key));
    if (!r) return null;
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
      useCSSTransforms: h,
      transformScale: w,
      draggableCancel: R,
      draggableHandle: _,
      resizeHandles: y,
      resizeHandle: M
    } = this.props, {
      mounted: S,
      droppingPosition: T
    } = this.state, D = typeof r.isDraggable == "boolean" ? r.isDraggable : !r.static && c, B = typeof r.isResizable == "boolean" ? r.isResizable : !r.static && d, ee = r.resizeHandles || y, F = D && f && r.isBounded !== !1;
    return /* @__PURE__ */ ie.createElement(un.default, {
      containerWidth: o,
      cols: i,
      margin: s,
      containerPadding: l || s,
      maxRows: u,
      rowHeight: a,
      cancel: R,
      handle: _,
      onDragStop: this.onDragStop,
      onDragStart: this.onDragStart,
      onDrag: this.onDrag,
      onResizeStart: this.onResizeStart,
      onResize: this.onResize,
      onResizeStop: this.onResizeStop,
      isDraggable: D,
      isResizable: B,
      isBounded: F,
      useCSSTransforms: h && S,
      usePercentages: !S,
      transformScale: w,
      w: r.w,
      h: r.h,
      x: r.x,
      y: r.y,
      i: r.i,
      minH: r.minH,
      minW: r.minW,
      maxH: r.maxH,
      maxW: r.maxW,
      static: r.static,
      droppingPosition: n ? T : void 0,
      resizeHandles: ee,
      resizeHandle: M
    }, e);
  }
  render() {
    const {
      className: e,
      style: n,
      isDroppable: r,
      innerRef: o
    } = this.props, i = (0, ei.default)(fn, e), s = se({
      height: this.containerHeight()
    }, n);
    return /* @__PURE__ */ ie.createElement("div", {
      ref: o,
      className: i,
      style: s,
      onDrop: r ? this.onDrop : g.noop,
      onDragLeave: r ? this.onDragLeave : g.noop,
      onDragEnter: r ? this.onDragEnter : g.noop,
      onDragOver: r ? this.onDragOver : g.noop
    }, ie.Children.map(this.props.children, (l) => this.processGridItem(l)), r && this.state.droppingDOMNode && this.processGridItem(this.state.droppingDOMNode, !0), this.placeholder());
  }
}
Pe.default = Ve;
q(Ve, "displayName", "ReactGridLayout");
q(Ve, "propTypes", ni.default);
q(Ve, "defaultProps", {
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
  onLayoutChange: g.noop,
  onDragStart: g.noop,
  onDrag: g.noop,
  onDragStop: g.noop,
  onResizeStart: g.noop,
  onResize: g.noop,
  onResizeStop: g.noop,
  onDrop: g.noop,
  onDropDragOver: g.noop
});
var Ke = {}, de = {};
Object.defineProperty(de, "__esModule", {
  value: !0
});
de.findOrGenerateResponsiveLayout = ai;
de.getBreakpointFromWidth = ii;
de.getColsFromBreakpoint = si;
de.sortBreakpoints = Wt;
var Me = O;
function ii(t, e) {
  const n = Wt(t);
  let r = n[0];
  for (let o = 1, i = n.length; o < i; o++) {
    const s = n[o];
    e > t[s] && (r = s);
  }
  return r;
}
function si(t, e) {
  if (!e[t])
    throw new Error("ResponsiveReactGridLayout: `cols` entry for breakpoint " + t + " is missing!");
  return e[t];
}
function ai(t, e, n, r, o, i) {
  if (t[n]) return (0, Me.cloneLayout)(t[n]);
  let s = t[r];
  const l = Wt(e), a = l.slice(l.indexOf(n));
  for (let u = 0, c = a.length; u < c; u++) {
    const d = a[u];
    if (t[d]) {
      s = t[d];
      break;
    }
  }
  return s = (0, Me.cloneLayout)(s || []), (0, Me.compact)((0, Me.correctBounds)(s, {
    cols: o
  }), i, o);
}
function Wt(t) {
  return Object.keys(t).sort(function(n, r) {
    return t[n] - t[r];
  });
}
Object.defineProperty(Ke, "__esModule", {
  value: !0
});
Ke.default = void 0;
var dn = Yn(U), I = Gn(re), ut = _t, ve = O, ae = de, li = Gn(Pe);
const ui = ["breakpoint", "breakpoints", "cols", "layouts", "margin", "containerPadding", "onBreakpointChange", "onLayoutChange", "onWidthChange"];
function Gn(t) {
  return t && t.__esModule ? t : { default: t };
}
function Yn(t, e) {
  if (typeof WeakMap == "function") var n = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap();
  return (Yn = function(o, i) {
    if (!i && o && o.__esModule) return o;
    var s, l, a = { __proto__: null, default: o };
    if (o === null || typeof o != "object" && typeof o != "function") return a;
    if (s = i ? r : n) {
      if (s.has(o)) return s.get(o);
      s.set(o, a);
    }
    for (const u in o) u !== "default" && {}.hasOwnProperty.call(o, u) && ((l = (s = Object.defineProperty) && Object.getOwnPropertyDescriptor(o, u)) && (l.get || l.set) ? s(a, u, l) : a[u] = o[u]);
    return a;
  })(t, e);
}
function bt() {
  return bt = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];
      for (var r in n) ({}).hasOwnProperty.call(n, r) && (t[r] = n[r]);
    }
    return t;
  }, bt.apply(null, arguments);
}
function ci(t, e) {
  if (t == null) return {};
  var n, r, o = fi(t, e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(t);
    for (r = 0; r < i.length; r++) n = i[r], e.indexOf(n) === -1 && {}.propertyIsEnumerable.call(t, n) && (o[n] = t[n]);
  }
  return o;
}
function fi(t, e) {
  if (t == null) return {};
  var n = {};
  for (var r in t) if ({}.hasOwnProperty.call(t, r)) {
    if (e.indexOf(r) !== -1) continue;
    n[r] = t[r];
  }
  return n;
}
function pn(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function ct(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? pn(Object(n), !0).forEach(function(r) {
      De(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : pn(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function De(t, e, n) {
  return (e = di(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function di(t) {
  var e = pi(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function pi(t, e) {
  if (typeof t != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
const hn = (t) => Object.prototype.toString.call(t);
function Te(t, e) {
  return t == null ? null : Array.isArray(t) ? t : t[e];
}
class qt extends dn.Component {
  constructor() {
    super(...arguments), De(this, "state", this.generateInitialState()), De(this, "onLayoutChange", (e) => {
      this.props.onLayoutChange(e, ct(ct({}, this.props.layouts), {}, {
        [this.state.breakpoint]: e
      }));
    });
  }
  generateInitialState() {
    const {
      width: e,
      breakpoints: n,
      layouts: r,
      cols: o
    } = this.props, i = (0, ae.getBreakpointFromWidth)(n, e), s = (0, ae.getColsFromBreakpoint)(i, o), l = this.props.verticalCompact === !1 ? null : this.props.compactType;
    return {
      layout: (0, ae.findOrGenerateResponsiveLayout)(r, n, i, i, s, l),
      breakpoint: i,
      cols: s
    };
  }
  static getDerivedStateFromProps(e, n) {
    if (!(0, ut.deepEqual)(e.layouts, n.layouts)) {
      const {
        breakpoint: r,
        cols: o
      } = n;
      return {
        layout: (0, ae.findOrGenerateResponsiveLayout)(e.layouts, e.breakpoints, r, r, o, e.compactType),
        layouts: e.layouts
      };
    }
    return null;
  }
  componentDidUpdate(e) {
    (this.props.width != e.width || this.props.breakpoint !== e.breakpoint || !(0, ut.deepEqual)(this.props.breakpoints, e.breakpoints) || !(0, ut.deepEqual)(this.props.cols, e.cols)) && this.onWidthChange(e);
  }
  /**
   * When the width changes work through breakpoints and reset state with the new width & breakpoint.
   * Width changes are necessary to figure out the widget widths.
   */
  onWidthChange(e) {
    const {
      breakpoints: n,
      cols: r,
      layouts: o,
      compactType: i
    } = this.props, s = this.props.breakpoint || (0, ae.getBreakpointFromWidth)(this.props.breakpoints, this.props.width), l = this.state.breakpoint, a = (0, ae.getColsFromBreakpoint)(s, r), u = ct({}, o);
    if (l !== s || e.breakpoints !== n || e.cols !== r) {
      l in u || (u[l] = (0, ve.cloneLayout)(this.state.layout));
      let f = (0, ae.findOrGenerateResponsiveLayout)(u, n, s, l, a, i);
      f = (0, ve.synchronizeLayoutWithChildren)(f, this.props.children, a, i, this.props.allowOverlap), u[s] = f, this.props.onBreakpointChange(s, a), this.props.onLayoutChange(f, u), this.setState({
        breakpoint: s,
        layout: f,
        cols: a
      });
    }
    const c = Te(this.props.margin, s), d = Te(this.props.containerPadding, s);
    this.props.onWidthChange(this.props.width, c, a, d);
  }
  render() {
    const e = this.props, {
      breakpoint: n,
      breakpoints: r,
      cols: o,
      layouts: i,
      margin: s,
      containerPadding: l,
      onBreakpointChange: a,
      onLayoutChange: u,
      onWidthChange: c
    } = e, d = ci(e, ui);
    return /* @__PURE__ */ dn.createElement(li.default, bt({}, d, {
      // $FlowIgnore should allow nullable here due to DefaultProps
      margin: Te(s, this.state.breakpoint),
      containerPadding: Te(l, this.state.breakpoint),
      onLayoutChange: this.onLayoutChange,
      layout: this.state.layout,
      cols: this.state.cols
    }));
  }
}
Ke.default = qt;
De(qt, "propTypes", {
  //
  // Basic props
  //
  // Optional, but if you are managing width yourself you may want to set the breakpoint
  // yourself as well.
  breakpoint: I.default.string,
  // {name: pxVal}, e.g. {lg: 1200, md: 996, sm: 768, xs: 480}
  breakpoints: I.default.object,
  allowOverlap: I.default.bool,
  // # of cols. This is a breakpoint -> cols map
  cols: I.default.object,
  // # of margin. This is a breakpoint -> margin map
  // e.g. { lg: [5, 5], md: [10, 10], sm: [15, 15] }
  // Margin between items [x, y] in px
  // e.g. [10, 10]
  margin: I.default.oneOfType([I.default.array, I.default.object]),
  // # of containerPadding. This is a breakpoint -> containerPadding map
  // e.g. { lg: [5, 5], md: [10, 10], sm: [15, 15] }
  // Padding inside the container [x, y] in px
  // e.g. [10, 10]
  containerPadding: I.default.oneOfType([I.default.array, I.default.object]),
  // layouts is an object mapping breakpoints to layouts.
  // e.g. {lg: Layout, md: Layout, ...}
  layouts(t, e) {
    if (hn(t[e]) !== "[object Object]")
      throw new Error("Layout property must be an object. Received: " + hn(t[e]));
    Object.keys(t[e]).forEach((n) => {
      if (!(n in t.breakpoints))
        throw new Error("Each key in layouts must align with a key in breakpoints.");
      (0, ve.validateLayout)(t.layouts[n], "layouts." + n);
    });
  },
  // The width of this component.
  // Required in this propTypes stanza because generateInitialState() will fail without it.
  width: I.default.number.isRequired,
  //
  // Callbacks
  //
  // Calls back with breakpoint and new # cols
  onBreakpointChange: I.default.func,
  // Callback so you can save the layout.
  // Calls back with (currentLayout, allLayouts). allLayouts are keyed by breakpoint.
  onLayoutChange: I.default.func,
  // Calls back with (containerWidth, margin, cols, containerPadding)
  onWidthChange: I.default.func
});
De(qt, "defaultProps", {
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
  onBreakpointChange: ve.noop,
  onLayoutChange: ve.noop,
  onWidthChange: ve.noop
});
var $t = {}, Xn = function() {
  if (typeof Map < "u")
    return Map;
  function t(e, n) {
    var r = -1;
    return e.some(function(o, i) {
      return o[0] === n ? (r = i, !0) : !1;
    }), r;
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
      }), e.prototype.get = function(n) {
        var r = t(this.__entries__, n), o = this.__entries__[r];
        return o && o[1];
      }, e.prototype.set = function(n, r) {
        var o = t(this.__entries__, n);
        ~o ? this.__entries__[o][1] = r : this.__entries__.push([n, r]);
      }, e.prototype.delete = function(n) {
        var r = this.__entries__, o = t(r, n);
        ~o && r.splice(o, 1);
      }, e.prototype.has = function(n) {
        return !!~t(this.__entries__, n);
      }, e.prototype.clear = function() {
        this.__entries__.splice(0);
      }, e.prototype.forEach = function(n, r) {
        r === void 0 && (r = null);
        for (var o = 0, i = this.__entries__; o < i.length; o++) {
          var s = i[o];
          n.call(r, s[1], s[0]);
        }
      }, e;
    }()
  );
}(), wt = typeof window < "u" && typeof document < "u" && window.document === document, Ne = function() {
  return typeof global < "u" && global.Math === Math ? global : typeof self < "u" && self.Math === Math ? self : typeof window < "u" && window.Math === Math ? window : Function("return this")();
}(), hi = function() {
  return typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(Ne) : function(t) {
    return setTimeout(function() {
      return t(Date.now());
    }, 1e3 / 60);
  };
}(), gi = 2;
function mi(t, e) {
  var n = !1, r = !1, o = 0;
  function i() {
    n && (n = !1, t()), r && l();
  }
  function s() {
    hi(i);
  }
  function l() {
    var a = Date.now();
    if (n) {
      if (a - o < gi)
        return;
      r = !0;
    } else
      n = !0, r = !1, setTimeout(s, e);
    o = a;
  }
  return l;
}
var yi = 20, vi = ["top", "right", "bottom", "left", "width", "height", "size", "weight"], bi = typeof MutationObserver < "u", wi = (
  /** @class */
  function() {
    function t() {
      this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = mi(this.refresh.bind(this), yi);
    }
    return t.prototype.addObserver = function(e) {
      ~this.observers_.indexOf(e) || this.observers_.push(e), this.connected_ || this.connect_();
    }, t.prototype.removeObserver = function(e) {
      var n = this.observers_, r = n.indexOf(e);
      ~r && n.splice(r, 1), !n.length && this.connected_ && this.disconnect_();
    }, t.prototype.refresh = function() {
      var e = this.updateObservers_();
      e && this.refresh();
    }, t.prototype.updateObservers_ = function() {
      var e = this.observers_.filter(function(n) {
        return n.gatherActive(), n.hasActive();
      });
      return e.forEach(function(n) {
        return n.broadcastActive();
      }), e.length > 0;
    }, t.prototype.connect_ = function() {
      !wt || this.connected_ || (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), bi ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
        attributes: !0,
        childList: !0,
        characterData: !0,
        subtree: !0
      })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0), this.connected_ = !0);
    }, t.prototype.disconnect_ = function() {
      !wt || !this.connected_ || (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1);
    }, t.prototype.onTransitionEnd_ = function(e) {
      var n = e.propertyName, r = n === void 0 ? "" : n, o = vi.some(function(i) {
        return !!~r.indexOf(i);
      });
      o && this.refresh();
    }, t.getInstance = function() {
      return this.instance_ || (this.instance_ = new t()), this.instance_;
    }, t.instance_ = null, t;
  }()
), Un = function(t, e) {
  for (var n = 0, r = Object.keys(e); n < r.length; n++) {
    var o = r[n];
    Object.defineProperty(t, o, {
      value: e[o],
      enumerable: !1,
      writable: !1,
      configurable: !0
    });
  }
  return t;
}, be = function(t) {
  var e = t && t.ownerDocument && t.ownerDocument.defaultView;
  return e || Ne;
}, Fn = Je(0, 0, 0, 0);
function We(t) {
  return parseFloat(t) || 0;
}
function gn(t) {
  for (var e = [], n = 1; n < arguments.length; n++)
    e[n - 1] = arguments[n];
  return e.reduce(function(r, o) {
    var i = t["border-" + o + "-width"];
    return r + We(i);
  }, 0);
}
function Oi(t) {
  for (var e = ["top", "right", "bottom", "left"], n = {}, r = 0, o = e; r < o.length; r++) {
    var i = o[r], s = t["padding-" + i];
    n[i] = We(s);
  }
  return n;
}
function Si(t) {
  var e = t.getBBox();
  return Je(0, 0, e.width, e.height);
}
function _i(t) {
  var e = t.clientWidth, n = t.clientHeight;
  if (!e && !n)
    return Fn;
  var r = be(t).getComputedStyle(t), o = Oi(r), i = o.left + o.right, s = o.top + o.bottom, l = We(r.width), a = We(r.height);
  if (r.boxSizing === "border-box" && (Math.round(l + i) !== e && (l -= gn(r, "left", "right") + i), Math.round(a + s) !== n && (a -= gn(r, "top", "bottom") + s)), !Di(t)) {
    var u = Math.round(l + i) - e, c = Math.round(a + s) - n;
    Math.abs(u) !== 1 && (l -= u), Math.abs(c) !== 1 && (a -= c);
  }
  return Je(o.left, o.top, l, a);
}
var Ri = /* @__PURE__ */ function() {
  return typeof SVGGraphicsElement < "u" ? function(t) {
    return t instanceof be(t).SVGGraphicsElement;
  } : function(t) {
    return t instanceof be(t).SVGElement && typeof t.getBBox == "function";
  };
}();
function Di(t) {
  return t === be(t).document.documentElement;
}
function Pi(t) {
  return wt ? Ri(t) ? Si(t) : _i(t) : Fn;
}
function xi(t) {
  var e = t.x, n = t.y, r = t.width, o = t.height, i = typeof DOMRectReadOnly < "u" ? DOMRectReadOnly : Object, s = Object.create(i.prototype);
  return Un(s, {
    x: e,
    y: n,
    width: r,
    height: o,
    top: n,
    right: e + r,
    bottom: o + n,
    left: e
  }), s;
}
function Je(t, e, n, r) {
  return { x: t, y: e, width: n, height: r };
}
var Ei = (
  /** @class */
  function() {
    function t(e) {
      this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = Je(0, 0, 0, 0), this.target = e;
    }
    return t.prototype.isActive = function() {
      var e = Pi(this.target);
      return this.contentRect_ = e, e.width !== this.broadcastWidth || e.height !== this.broadcastHeight;
    }, t.prototype.broadcastRect = function() {
      var e = this.contentRect_;
      return this.broadcastWidth = e.width, this.broadcastHeight = e.height, e;
    }, t;
  }()
), zi = (
  /** @class */
  /* @__PURE__ */ function() {
    function t(e, n) {
      var r = xi(n);
      Un(this, { target: e, contentRect: r });
    }
    return t;
  }()
), Ci = (
  /** @class */
  function() {
    function t(e, n, r) {
      if (this.activeObservations_ = [], this.observations_ = new Xn(), typeof e != "function")
        throw new TypeError("The callback provided as parameter 1 is not a function.");
      this.callback_ = e, this.controller_ = n, this.callbackCtx_ = r;
    }
    return t.prototype.observe = function(e) {
      if (!arguments.length)
        throw new TypeError("1 argument required, but only 0 present.");
      if (!(typeof Element > "u" || !(Element instanceof Object))) {
        if (!(e instanceof be(e).Element))
          throw new TypeError('parameter 1 is not of type "Element".');
        var n = this.observations_;
        n.has(e) || (n.set(e, new Ei(e)), this.controller_.addObserver(this), this.controller_.refresh());
      }
    }, t.prototype.unobserve = function(e) {
      if (!arguments.length)
        throw new TypeError("1 argument required, but only 0 present.");
      if (!(typeof Element > "u" || !(Element instanceof Object))) {
        if (!(e instanceof be(e).Element))
          throw new TypeError('parameter 1 is not of type "Element".');
        var n = this.observations_;
        n.has(e) && (n.delete(e), n.size || this.controller_.removeObserver(this));
      }
    }, t.prototype.disconnect = function() {
      this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this);
    }, t.prototype.gatherActive = function() {
      var e = this;
      this.clearActive(), this.observations_.forEach(function(n) {
        n.isActive() && e.activeObservations_.push(n);
      });
    }, t.prototype.broadcastActive = function() {
      if (this.hasActive()) {
        var e = this.callbackCtx_, n = this.activeObservations_.map(function(r) {
          return new zi(r.target, r.broadcastRect());
        });
        this.callback_.call(e, n, e), this.clearActive();
      }
    }, t.prototype.clearActive = function() {
      this.activeObservations_.splice(0);
    }, t.prototype.hasActive = function() {
      return this.activeObservations_.length > 0;
    }, t;
  }()
), Vn = typeof WeakMap < "u" ? /* @__PURE__ */ new WeakMap() : new Xn(), Kn = (
  /** @class */
  /* @__PURE__ */ function() {
    function t(e) {
      if (!(this instanceof t))
        throw new TypeError("Cannot call a class as a function.");
      if (!arguments.length)
        throw new TypeError("1 argument required, but only 0 present.");
      var n = wi.getInstance(), r = new Ci(e, n, this);
      Vn.set(this, r);
    }
    return t;
  }()
);
[
  "observe",
  "unobserve",
  "disconnect"
].forEach(function(t) {
  Kn.prototype[t] = function() {
    var e;
    return (e = Vn.get(this))[t].apply(e, arguments);
  };
});
var ji = function() {
  return typeof Ne.ResizeObserver < "u" ? Ne.ResizeObserver : Kn;
}();
const Mi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ji
}, Symbol.toStringTag, { value: "Module" })), Ti = /* @__PURE__ */ fr(Mi);
Object.defineProperty($t, "__esModule", {
  value: !0
});
$t.default = Bi;
var Le = Jn(U), Li = At(re), Hi = At(Ti), ki = At(qe);
const Ni = ["measureBeforeMount"];
function At(t) {
  return t && t.__esModule ? t : { default: t };
}
function Jn(t, e) {
  if (typeof WeakMap == "function") var n = /* @__PURE__ */ new WeakMap(), r = /* @__PURE__ */ new WeakMap();
  return (Jn = function(o, i) {
    if (!i && o && o.__esModule) return o;
    var s, l, a = { __proto__: null, default: o };
    if (o === null || typeof o != "object" && typeof o != "function") return a;
    if (s = i ? r : n) {
      if (s.has(o)) return s.get(o);
      s.set(o, a);
    }
    for (const u in o) u !== "default" && {}.hasOwnProperty.call(o, u) && ((l = (s = Object.defineProperty) && Object.getOwnPropertyDescriptor(o, u)) && (l.get || l.set) ? s(a, u, l) : a[u] = o[u]);
    return a;
  })(t, e);
}
function Ot() {
  return Ot = Object.assign ? Object.assign.bind() : function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];
      for (var r in n) ({}).hasOwnProperty.call(n, r) && (t[r] = n[r]);
    }
    return t;
  }, Ot.apply(null, arguments);
}
function Wi(t, e) {
  if (t == null) return {};
  var n, r, o = qi(t, e);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(t);
    for (r = 0; r < i.length; r++) n = i[r], e.indexOf(n) === -1 && {}.propertyIsEnumerable.call(t, n) && (o[n] = t[n]);
  }
  return o;
}
function qi(t, e) {
  if (t == null) return {};
  var n = {};
  for (var r in t) if ({}.hasOwnProperty.call(t, r)) {
    if (e.indexOf(r) !== -1) continue;
    n[r] = t[r];
  }
  return n;
}
function me(t, e, n) {
  return (e = $i(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function $i(t) {
  var e = Ai(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function Ai(t, e) {
  if (typeof t != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
const Ii = "react-grid-layout";
function Bi(t) {
  var e;
  return e = class extends Le.Component {
    constructor() {
      super(...arguments), me(this, "state", {
        width: 1280
      }), me(this, "elementRef", /* @__PURE__ */ Le.createRef()), me(this, "mounted", !1), me(this, "resizeObserver", void 0);
    }
    componentDidMount() {
      this.mounted = !0, this.resizeObserver = new Hi.default((o) => {
        if (this.elementRef.current instanceof HTMLElement) {
          const s = o[0].contentRect.width;
          this.setState({
            width: s
          });
        }
      });
      const r = this.elementRef.current;
      r instanceof HTMLElement && this.resizeObserver.observe(r);
    }
    componentWillUnmount() {
      this.mounted = !1;
      const r = this.elementRef.current;
      r instanceof HTMLElement && this.resizeObserver.unobserve(r), this.resizeObserver.disconnect();
    }
    render() {
      const r = this.props, {
        measureBeforeMount: o
      } = r, i = Wi(r, Ni);
      return o && !this.mounted ? /* @__PURE__ */ Le.createElement("div", {
        className: (0, ki.default)(this.props.className, Ii),
        style: this.props.style,
        ref: this.elementRef
      }) : /* @__PURE__ */ Le.createElement(t, Ot({
        innerRef: this.elementRef
      }, i, this.state));
    }
  }, me(e, "defaultProps", {
    measureBeforeMount: !1
  }), me(e, "propTypes", {
    // If true, will not render children until mounted. Useful for getting the exact width before
    // rendering, to prevent any unsightly resizing.
    measureBeforeMount: Li.default.bool
  }), e;
}
(function(t) {
  t.exports = Pe.default, t.exports.utils = O, t.exports.calculateUtils = Q, t.exports.Responsive = Ke.default, t.exports.Responsive.utils = de, t.exports.WidthProvider = $t.default;
})(mn);
var Vi = mn.exports;
export {
  Vi as r
};
