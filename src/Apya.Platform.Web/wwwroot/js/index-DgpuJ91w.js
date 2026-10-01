var A = Object.defineProperty;
var B = (e, n, t) => n in e ? A(e, n, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[n] = t;
var b = (e, n, t) => B(e, typeof n != "symbol" ? n + "" : n, t);
import { r as u, j as s, b as L, d as O } from "./react-vendor-D7YDiBbi.js";
let x = null;
function D() {
  var n, t;
  if (x) return x;
  const e = (t = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.localization) == null ? void 0 : t.getResource;
  return typeof e == "function" && (x = e("Platform")), x;
}
function d(e, n, ...t) {
  const r = D(), o = r ? r(e, ...t) : null;
  return o != null && o !== e ? o : M(n ?? e, t);
}
function M(e, n) {
  return n.length ? String(e).replace(/\{(\d+)\}/g, (t, r) => n[r] ?? t) : e;
}
function V() {
  var e, n, t, r;
  return ((t = (n = (e = window == null ? void 0 : window.abp) == null ? void 0 : e.localization) == null ? void 0 : n.currentCulture) == null ? void 0 : t.name) || ((r = document == null ? void 0 : document.documentElement) == null ? void 0 : r.lang) || "tr-TR";
}
const P = "apya-rq-cache", Y = 1e3;
function p() {
  try {
    window.sessionStorage.removeItem(P);
  } catch {
  }
}
const T = () => {
  var e;
  return typeof window > "u" || (e = window.apya) == null ? void 0 : e.ajaxErrors;
};
function F(e) {
  var n, t;
  return e != null && e.apyaShown || e != null && e.apyaCentral ? !0 : !!((t = (n = T()) == null ? void 0 : n.wasShown) != null && t.call(n, e));
}
function k(e, n, t) {
  const r = T();
  return r != null && r.message ? r.message(e, n, t) : (e == null ? void 0 : e.message) || n || null;
}
function W(e, n) {
  var o, a, i, c, l;
  if (F(e)) return;
  const t = k(e, n), r = (a = (o = window == null ? void 0 : window.abp) == null ? void 0 : o.utils) == null ? void 0 : a.htmlEscape;
  t && ((l = (c = (i = window == null ? void 0 : window.abp) == null ? void 0 : i.notify) == null ? void 0 : c.error) == null || l.call(c, r ? r(t) : t));
}
const v = {
  default: { ring: "bg-neutral-100 text-neutral-500", text: "text-text-tertiary" },
  success: { ring: "bg-positive-50 text-positive-600", text: "text-text-secondary" },
  info: { ring: "bg-brand-50 text-brand-600", text: "text-text-secondary" },
  error: { ring: "bg-surface-sunken text-text-secondary", text: "text-text-secondary", icon: "fa-triangle-exclamation" },
  locked: { ring: "bg-surface-sunken text-text-secondary", text: "text-text-secondary", icon: "fa-lock" }
}, h = (...e) => e.filter(Boolean).join(" "), R = () => d("Common:FetchError", "Veri alınırken bir hata oluştu."), z = "btn btn-sm btn-outline-primary aria-disabled:opacity-50 aria-disabled:pointer-events-none", S = "fa fa-rotate-right me-1";
function I({ onRetry: e, retrying: n = !1, ...t }) {
  return /* @__PURE__ */ s.jsxs(
    "button",
    {
      ...t,
      type: "button",
      className: z,
      "aria-disabled": n || void 0,
      "aria-busy": n || void 0,
      onClick: () => {
        n || e();
      },
      children: [
        /* @__PURE__ */ s.jsx("i", { className: n ? `${S} fa-spin` : S, "aria-hidden": "true" }),
        /* @__PURE__ */ s.jsx("span", { children: d("Common:Retry", "Tekrar dene") })
      ]
    }
  );
}
function $(e) {
  const n = u.useRef(null), t = u.useRef(!1);
  return u.useEffect(() => {
    var a;
    if (!e || !t.current) return;
    t.current = !1;
    const o = document.activeElement;
    (!o || o === document.body) && ((a = n.current) == null || a.focus({ preventScroll: !0 }));
  }, [e]), { contentRef: n, retry: (o) => () => {
    const a = document.activeElement;
    t.current = !!a && a !== document.body, o();
  } };
}
function Q({
  icon: e,
  title: n,
  description: t,
  action: r,
  /* ReactNode — Button, link vs. */
  variant: o = "default",
  compact: a = !1,
  /* compact: ikonu küçült, padding düşür — Bento widget için */
  onRetry: i,
  /* () => void — "Tekrar dene" düğmesi (argümansız çağrılır) */
  retrying: c = !1,
  /* yeniden deneme sürüyor: kart kalır, düğme meşgul */
  error: l,
  /* yalnız variant="error": yükleme hatası nesnesi (açıklama kaynağı) */
  className: f
}) {
  const _ = u.useId(), m = v[o] ?? v.default, y = o === "error", E = e ?? (m.icon ? /* @__PURE__ */ s.jsx("i", { className: `fa ${m.icon}` }) : null), w = t !== void 0 || !y ? t : l !== void 0 ? k(l, R(), { load: !0 }) : R(), j = !r && i && n ? _ : void 0, g = r ?? (i ? /* @__PURE__ */ s.jsx(I, { onRetry: i, retrying: c, "aria-describedby": j }) : null);
  return /* @__PURE__ */ s.jsxs(
    "div",
    {
      role: y ? "alert" : "status",
      "aria-live": y ? void 0 : "polite",
      className: h(
        "flex flex-col items-center justify-center text-center",
        a ? "gap-2 py-3" : "gap-3 py-6",
        f
      ),
      children: [
        E && /* @__PURE__ */ s.jsx(
          "span",
          {
            className: h(
              "inline-flex items-center justify-center rounded-full",
              m.ring,
              a ? "h-8 w-8" : "h-12 w-12"
            ),
            "aria-hidden": "true",
            children: E
          }
        ),
        n && /* @__PURE__ */ s.jsx("p", { id: j, className: h(
          "font-medium text-text-primary",
          a ? "text-sm" : "text-base"
        ), children: n }),
        w && /* @__PURE__ */ s.jsx("p", { className: h("max-w-sm", m.text, a ? "text-xs" : "text-sm"), children: w }),
        g && /* @__PURE__ */ s.jsx("div", { className: "mt-1", children: g })
      ]
    }
  );
}
const C = "btn btn-sm btn-outline-secondary", U = /* @__PURE__ */ s.jsxs(
  "svg",
  {
    width: "1.25em",
    height: "1.25em",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    children: [
      /* @__PURE__ */ s.jsx("path", { d: "M12 3.5 2.5 20h19L12 3.5z" }),
      /* @__PURE__ */ s.jsx("path", { d: "M12 10v4" }),
      /* @__PURE__ */ s.jsx("path", { d: "M12 17h.01" })
    ]
  }
), N = (e) => e || new Error(String(e));
function q({ name: e, retry: n, reload: t, onClose: r, refocus: o = !1 }) {
  const a = u.useId(), i = u.useRef(null);
  return u.useEffect(() => {
    var l, f;
    const c = document.activeElement;
    o && (!c || c === document.body) && ((f = (l = i.current) == null ? void 0 : l.querySelector("button")) == null || f.focus());
  }, [o]), /* @__PURE__ */ s.jsx("div", { ref: i, "data-island-error": e, children: /* @__PURE__ */ s.jsx(
    Q,
    {
      variant: "error",
      icon: U,
      title: /* @__PURE__ */ s.jsx("span", { id: a, children: d("Common:SectionError:Title", "Bu bölüm gösterilemedi") }),
      description: d("Common:SectionError:Description", "Beklenmeyen bir hata oluştu. Tekrar deneyin; sorun sürerse sayfayı yenileyin."),
      action: /* @__PURE__ */ s.jsxs("div", { className: "flex flex-wrap justify-center gap-2", children: [
        /* @__PURE__ */ s.jsx(I, { onRetry: n, "aria-describedby": a }),
        /* @__PURE__ */ s.jsx("button", { type: "button", className: C, onClick: () => t(), children: d("Common:ReloadPage", "Sayfayı yenile") }),
        r && /* @__PURE__ */ s.jsx("button", { type: "button", className: C, onClick: () => r(), children: d("Common:Close", "Kapat") })
      ] })
    }
  ) });
}
class G extends L.Component {
  constructor(t) {
    super(t);
    b(this, "retry", () => {
      p(), this.retried = !0, this.setState({ error: null });
    });
    b(this, "reload", () => {
      p(), window.location.reload();
    });
    this.state = { error: null }, this.retried = !1;
  }
  static getDerivedStateFromError(t) {
    return { error: N(t) };
  }
  componentDidCatch(t, r) {
    var o, a;
    this.retried = !1, p(), setTimeout(p, Y + 100);
    try {
      (a = (o = window.ApyaTelemetry) == null ? void 0 : o.reportIslandError) == null || a.call(o, this.props.name, N(t), r == null ? void 0 : r.componentStack);
    } catch {
    }
  }
  render() {
    if (!this.state.error) return this.props.children;
    const t = { name: this.props.name, retry: this.retry, reload: this.reload, refocus: this.retried };
    return this.props.fallback ? this.props.fallback(t) : /* @__PURE__ */ s.jsx(q, { ...t });
  }
}
function J(e, n, t) {
  const r = O(e);
  return r.render(/* @__PURE__ */ s.jsx(G, { name: n, children: t })), r;
}
export {
  Q as E,
  G as I,
  Y as P,
  P as Q,
  I as R,
  q as a,
  V as c,
  k as e,
  J as m,
  W as n,
  d as t,
  $ as u,
  F as w
};
