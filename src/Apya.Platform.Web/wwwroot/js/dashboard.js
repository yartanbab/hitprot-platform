import { r as g, j as t, d as L, b as fe } from "./react-vendor.js";
import { B as N, c as v, S as k, C as _, a as pe, b as ge, d as ye, t as o, e as S, f as be, Q as b, g as $, h as T, u as ne, i as P, j as F, k as U, r as ve, T as je, l as we, m as ke } from "./registerServiceWorker.js";
import { H as se, a as Ae, L as Ne } from "./signalr-vendor.js";
import { r as Q } from "./grid-vendor.js";
import { u as E, a as O, b as Se } from "./query-vendor.js";
import { A as Re } from "./httpClient.js";
/* empty css      */
const ie = g.createContext({
  connection: null,
  state: se.Disconnected
});
function Ce({ hubUrl: e = "/signalr-hubs/notifications", children: a, enabled: n = !0 }) {
  const [s, r] = g.useState(se.Disconnected), l = g.useRef(null);
  g.useEffect(() => {
    if (!n || typeof window > "u") return;
    const i = new Ae().withUrl(e, { withCredentials: !0 }).withAutomaticReconnect([0, 2e3, 5e3, 1e4, 3e4]).configureLogging(Ne.Warning).build();
    l.current = i, r(i.state);
    const u = () => r(i.state);
    return i.onreconnecting(u), i.onreconnected(u), i.onclose(u), i.start().then(u).catch((c) => {
      console.warn("[SignalR] connect failed:", c == null ? void 0 : c.message), u();
    }), () => {
      i.stop().catch(() => {
      }), l.current = null;
    };
  }, [e, n]);
  const d = g.useMemo(() => ({
    get connection() {
      return l.current;
    },
    state: s
  }), [s]);
  return /* @__PURE__ */ t.jsx(ie.Provider, { value: d, children: a });
}
function re() {
  return g.useContext(ie);
}
const I = {
  triage: "(min-width: 768px)",
  analysis: "(min-width: 1280px)",
  command: "(min-width: 1920px)"
};
function Ee() {
  return typeof window > "u" || !window.matchMedia ? "analysis" : window.matchMedia(I.command).matches ? "command" : window.matchMedia(I.analysis).matches ? "analysis" : window.matchMedia(I.triage).matches ? "triage" : "decision";
}
const le = g.createContext(null);
function De({ children: e, override: a }) {
  const n = g.useCallback((l) => {
    if (typeof window > "u" || !window.matchMedia) return () => {
    };
    const d = Object.values(I).map((i) => window.matchMedia(i));
    return d.forEach((i) => i.addEventListener("change", l)), () => d.forEach((i) => i.removeEventListener("change", l));
  }, []), s = g.useSyncExternalStore(n, Ee, () => "analysis"), r = a ?? s;
  return g.useEffect(() => {
    typeof document > "u" || (document.documentElement.dataset.deviceMode = r);
  }, [r]), /* @__PURE__ */ t.jsx(le.Provider, { value: r, children: e });
}
function Le() {
  const e = g.useContext(le);
  if (e === null)
    throw new Error("useDeviceMode must be used within <DeviceModeProvider>.");
  return e;
}
const Me = {
  desktop: [
    { i: "kpi-strip", x: 0, y: 0, w: 12, h: 2, minW: 8, minH: 2, isResizable: !1 },
    { i: "budget-health", x: 0, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "cash-flow", x: 6, y: 2, w: 6, h: 2, minW: 4, minH: 2 },
    { i: "income-expense", x: 6, y: 4, w: 6, h: 2, minW: 4, minH: 2 },
    { i: "risk-alerts", x: 6, y: 6, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "pending-approvals", x: 0, y: 6, w: 6, h: 4, minW: 4, minH: 3 },
    /* AI inbox tam genişlik altta — sessiz feed, kullanıcı iner görür. */
    { i: "ai-suggestions", x: 0, y: 10, w: 12, h: 4, minW: 6, minH: 3 }
  ],
  tablet: [
    { i: "kpi-strip", x: 0, y: 0, w: 8, h: 2, minW: 6, minH: 2, isResizable: !1 },
    { i: "budget-health", x: 0, y: 2, w: 8, h: 4, minW: 4, minH: 3 },
    { i: "cash-flow", x: 0, y: 6, w: 8, h: 2, minW: 4, minH: 2 },
    { i: "income-expense", x: 0, y: 8, w: 8, h: 2, minW: 4, minH: 2 },
    { i: "risk-alerts", x: 0, y: 10, w: 8, h: 4, minW: 4, minH: 3 },
    { i: "pending-approvals", x: 0, y: 14, w: 8, h: 4, minW: 4, minH: 3 },
    { i: "ai-suggestions", x: 0, y: 18, w: 8, h: 4, minW: 4, minH: 3 }
  ],
  mobile: [
    { i: "kpi-strip", x: 0, y: 0, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "budget-health", x: 0, y: 4, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "cash-flow", x: 0, y: 8, w: 1, h: 2, isResizable: !1, isDraggable: !1 },
    { i: "income-expense", x: 0, y: 10, w: 1, h: 2, isResizable: !1, isDraggable: !1 },
    { i: "risk-alerts", x: 0, y: 12, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "pending-approvals", x: 0, y: 16, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "ai-suggestions", x: 0, y: 20, w: 1, h: 4, isResizable: !1, isDraggable: !1 }
  ]
}, ze = {
  desktop: [
    { i: "risk-alerts", x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "pending-approvals", x: 6, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "budget-health", x: 0, y: 4, w: 6, h: 3, minW: 4, minH: 3 },
    { i: "cash-flow", x: 6, y: 4, w: 6, h: 3, minW: 4, minH: 2 },
    { i: "ai-suggestions", x: 0, y: 7, w: 12, h: 4, minW: 6, minH: 3 }
  ],
  tablet: [
    { i: "risk-alerts", x: 0, y: 0, w: 8, h: 4 },
    { i: "pending-approvals", x: 0, y: 4, w: 8, h: 4 },
    { i: "budget-health", x: 0, y: 8, w: 8, h: 3 },
    { i: "cash-flow", x: 0, y: 11, w: 8, h: 2 },
    { i: "ai-suggestions", x: 0, y: 13, w: 8, h: 4 }
  ],
  mobile: [
    { i: "risk-alerts", x: 0, y: 0, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "pending-approvals", x: 0, y: 4, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "budget-health", x: 0, y: 8, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "cash-flow", x: 0, y: 12, w: 1, h: 2, isResizable: !1, isDraggable: !1 },
    { i: "ai-suggestions", x: 0, y: 14, w: 1, h: 4, isResizable: !1, isDraggable: !1 }
  ]
}, Pe = {
  desktop: [
    /* Saha personası desktop'ta da erişebilsin diye basit layout */
    { i: "pending-approvals", x: 0, y: 0, w: 8, h: 4 },
    { i: "risk-alerts", x: 8, y: 0, w: 4, h: 4 }
  ],
  tablet: [
    { i: "pending-approvals", x: 0, y: 0, w: 8, h: 4 },
    { i: "risk-alerts", x: 0, y: 4, w: 8, h: 3 }
  ],
  mobile: [
    { i: "pending-approvals", x: 0, y: 0, w: 1, h: 5, isResizable: !1, isDraggable: !1 },
    { i: "risk-alerts", x: 0, y: 5, w: 1, h: 4, isResizable: !1, isDraggable: !1 }
  ]
}, H = {
  cfo: Me,
  pm: ze,
  field: Pe
}, K = {
  cfo: { key: "Persona:Cfo", fallback: "CFO / Finansman" },
  pm: { key: "Persona:Pm", fallback: "Proje Yöneticisi" },
  field: { key: "Persona:Field", fallback: "Saha Kullanıcısı" }
}, Te = {
  desktop: 1280,
  tablet: 768,
  mobile: 0
}, Ie = {
  desktop: 12,
  tablet: 8,
  mobile: 1
}, _e = 64, Fe = [12, 12], oe = "apya-dashboard-persona", q = "apya-dashboard-layout-overrides";
function Be() {
  if (typeof window > "u") return "cfo";
  try {
    const e = window.localStorage.getItem(oe);
    if (e && H[e]) return e;
  } catch {
  }
  return "cfo";
}
function We(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(oe, e);
    } catch {
    }
}
function He(e) {
  if (typeof window > "u") return null;
  try {
    const a = window.localStorage.getItem(`${q}-${e}`);
    return a ? JSON.parse(a) : null;
  } catch {
    return null;
  }
}
function Ke(e, a) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(
        `${q}-${e}`,
        JSON.stringify(a)
      );
    } catch {
    }
}
function Ge(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.removeItem(`${q}-${e}`);
    } catch {
    }
}
function $e({
  holdMs: e = 200,
  onConfirm: a,
  children: n,
  className: s,
  disabled: r,
  isLoading: l,
  ...d
}) {
  const [i, u] = g.useState(0), c = g.useRef(0), x = g.useRef(0), m = e <= 0, p = g.useCallback(() => {
    cancelAnimationFrame(c.current), c.current = 0, x.current = 0, u(0);
  }, []), h = g.useCallback(() => {
    if (!x.current) return;
    const y = performance.now() - x.current, w = Math.min(y / e, 1);
    u(w), w >= 1 ? (p(), a == null || a()) : c.current = requestAnimationFrame(h);
  }, [e, a, p]), f = g.useCallback((y) => {
    r || l || m || y.button !== void 0 && y.button !== 0 || (x.current = performance.now(), c.current = requestAnimationFrame(h));
  }, [r, l, m, h]);
  return g.useEffect(() => () => cancelAnimationFrame(c.current), []), m ? /* @__PURE__ */ t.jsx(
    N,
    {
      onClick: a,
      disabled: r,
      isLoading: l,
      className: s,
      ...d,
      children: n
    }
  ) : /* @__PURE__ */ t.jsxs(
    N,
    {
      disabled: r,
      isLoading: l,
      onPointerDown: f,
      onPointerUp: p,
      onPointerLeave: p,
      onPointerCancel: p,
      onBlur: p,
      onClick: (y) => {
        y.detail === 0 ? a == null || a() : y.preventDefault();
      },
      className: v("relative overflow-hidden", s),
      ...d,
      children: [
        /* @__PURE__ */ t.jsx(
          "span",
          {
            className: v(
              "absolute inset-y-0 left-0 bg-white/25 pointer-events-none",
              "transition-[width] duration-[40ms] ease-linear"
            ),
            style: { width: `${i * 100}%` },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ t.jsx("span", { className: "relative", children: n })
      ]
    }
  );
}
function Y({ className: e, withDelta: a = !0, withBar: n = !1 }) {
  return /* @__PURE__ */ t.jsxs("div", { className: v("flex flex-col gap-3 h-full", e), "aria-busy": "true", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-baseline gap-2", children: [
      /* @__PURE__ */ t.jsx(k, { width: 140, height: 32, rounded: "md" }),
      /* @__PURE__ */ t.jsx(k, { width: 70, height: 16, rounded: "sm" })
    ] }),
    a && /* @__PURE__ */ t.jsx(k, { width: 180, height: 12, rounded: "sm" }),
    n && /* @__PURE__ */ t.jsx(k, { height: 6, rounded: "full" })
  ] });
}
function ce({ className: e, height: a = 64 }) {
  const n = [0.4, 0.55, 0.45, 0.7, 0.6, 0.8, 0.65, 0.85, 0.75, 0.9, 0.7, 0.95];
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      className: v("flex items-end justify-between gap-1 w-full", e),
      style: { height: a },
      "aria-busy": "true",
      children: n.map((s, r) => /* @__PURE__ */ t.jsx(
        k,
        {
          height: `${s * 100}%`,
          className: "flex-1 min-w-0",
          rounded: "sm"
        },
        r
      ))
    }
  );
}
function V({ rows: e = 4, withLeading: a = !0, withTrailing: n = !0, className: s }) {
  return /* @__PURE__ */ t.jsx("ul", { className: v("flex flex-col gap-2", s), "aria-busy": "true", children: Array.from({ length: e }).map((r, l) => /* @__PURE__ */ t.jsxs(
    "li",
    {
      className: "flex items-center gap-3 p-2 rounded-md border border-subtle bg-surface-base",
      children: [
        a && /* @__PURE__ */ t.jsx(k, { width: 32, height: 32, rounded: "md" }),
        /* @__PURE__ */ t.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
          /* @__PURE__ */ t.jsx(k, { height: 12, className: l % 2 === 0 ? "w-3/4" : "w-2/3" }),
          /* @__PURE__ */ t.jsx(k, { height: 10, className: "w-1/2" })
        ] }),
        n && /* @__PURE__ */ t.jsx(k, { width: 64, height: 12, rounded: "sm" })
      ]
    },
    l
  )) });
}
const J = {
  default: { ring: "bg-neutral-100 text-neutral-500", text: "text-text-tertiary" },
  success: { ring: "bg-positive-50 text-positive-600", text: "text-text-secondary" },
  info: { ring: "bg-brand-50 text-brand-600", text: "text-text-secondary" }
};
function B({
  icon: e,
  title: a,
  description: n,
  action: s,
  /* ReactNode — Button, link vs. */
  variant: r = "default",
  compact: l = !1,
  /* compact: ikonu küçült, padding düşür — Bento widget için */
  className: d
}) {
  const i = J[r] ?? J.default;
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      role: "status",
      "aria-live": "polite",
      className: v(
        "flex flex-col items-center justify-center text-center",
        l ? "gap-2 py-3" : "gap-3 py-6",
        d
      ),
      children: [
        e && /* @__PURE__ */ t.jsx(
          "span",
          {
            className: v(
              "inline-flex items-center justify-center rounded-full",
              i.ring,
              l ? "h-8 w-8" : "h-12 w-12"
            ),
            "aria-hidden": "true",
            children: e
          }
        ),
        a && /* @__PURE__ */ t.jsx("p", { className: v(
          "font-medium text-text-primary",
          l ? "text-sm" : "text-base"
        ), children: a }),
        n && /* @__PURE__ */ t.jsx("p", { className: v("max-w-sm", i.text, l ? "text-xs" : "text-sm"), children: n }),
        s && /* @__PURE__ */ t.jsx("div", { className: "mt-1", children: s })
      ]
    }
  );
}
function de({ series: e, variant: a = "positive", className: n = "w-full h-full" }) {
  const r = `apya-spark-${g.useId().replace(/:/g, "")}`;
  if (!e || e.length < 2) return null;
  const l = 100, d = 40, i = Math.min(...e), c = Math.max(...e) - i || 1, m = e.map((f, y) => {
    const w = y / (e.length - 1) * l, C = d - (f - i) / c * d;
    return [w, C];
  }).map(([f, y], w) => `${w === 0 ? "M" : "L"} ${f.toFixed(2)} ${y.toFixed(2)}`).join(" "), p = `${m} L ${l} ${d} L 0 ${d} Z`, h = a === "positive" ? "var(--apya-positive-500)" : "var(--apya-negative-500)";
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      viewBox: `0 0 ${l} ${d}`,
      preserveAspectRatio: "none",
      className: n,
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ t.jsx("defs", { children: /* @__PURE__ */ t.jsxs("linearGradient", { id: r, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ t.jsx("stop", { offset: "0%", stopColor: h, stopOpacity: "0.25" }),
          /* @__PURE__ */ t.jsx("stop", { offset: "100%", stopColor: h, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ t.jsx("path", { d: p, fill: `url(#${r})` }),
        /* @__PURE__ */ t.jsx(
          "path",
          {
            d: m,
            fill: "none",
            stroke: h,
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            vectorEffect: "non-scaling-stroke"
          }
        )
      ]
    }
  );
}
const ue = {
  /* react-grid-layout drag handle'ı için class — yalnızca header'dan sürüklenir */
  DRAG_HANDLE_CLASS: "widget-drag-handle"
};
function R({
  title: e,
  subtitle: a,
  badge: n,
  actions: s,
  /* sağ üstteki action button'lar */
  isLoading: r = !1,
  isError: l = !1,
  errorMessage: d,
  onRetry: i,
  isEmpty: u = !1,
  emptyMessage: c,
  /* legacy: tek satır metin; yeni kod emptyState kullanmalı */
  emptyState: x,
  /* yeni: <EmptyState .../> ReactNode */
  skeleton: m,
  /* yeni: shape-aware loading state — ReactNode */
  isFetching: p = !1,
  /* React Query background refetch */
  isStale: h = !1,
  /* React Query staleTime aşıldı */
  dataUpdatedAt: f,
  /* number (ms) | Date | undefined — son başarılı fetch */
  density: y = "compact",
  children: w,
  className: C
}) {
  const M = !r && !l && h && p;
  return /* @__PURE__ */ t.jsxs(_, { variant: "default", className: v("h-full flex flex-col", C), children: [
    /* @__PURE__ */ t.jsxs(
      pe,
      {
        density: y,
        className: v(
          ue.DRAG_HANDLE_CLASS,
          "cursor-grab active:cursor-grabbing select-none",
          "flex-row items-center justify-between flex-none"
        ),
        children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0 flex-1", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ t.jsx(ge, { className: "text-sm font-semibold truncate", children: e }),
              n,
              M && /* @__PURE__ */ t.jsx(Ve, {})
            ] }),
            a && /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary truncate", children: a })
          ] }),
          s && /* @__PURE__ */ t.jsx(
            "div",
            {
              className: "flex items-center gap-1 flex-none",
              onMouseDown: (z) => z.stopPropagation(),
              onTouchStart: (z) => z.stopPropagation(),
              children: s
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ t.jsxs(ye, { density: y, className: "flex-1 overflow-auto", children: [
      l && /* @__PURE__ */ t.jsx(
        Ye,
        {
          message: d,
          onRetry: i,
          dataUpdatedAt: f
        }
      ),
      !l && r && (m ?? /* @__PURE__ */ t.jsx(Oe, { density: y })),
      !l && !r && u && (x ?? /* @__PURE__ */ t.jsx(qe, { message: c })),
      !l && !r && !u && w
    ] })
  ] });
}
function Oe({ density: e }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3", "aria-busy": "true", children: [
    /* @__PURE__ */ t.jsx(k, { height: e === "spacious" ? 48 : 32, className: "w-1/3" }),
    /* @__PURE__ */ t.jsx(k, { height: 16 }),
    /* @__PURE__ */ t.jsx(k, { height: 16, className: "w-5/6" }),
    /* @__PURE__ */ t.jsx(k, { height: 16, className: "w-3/4" })
  ] });
}
function qe({ message: e }) {
  return /* @__PURE__ */ t.jsx(
    B,
    {
      compact: !0,
      title: e ?? o("Common:NoDataToShow", "Görüntülenecek veri yok"),
      description: o("Common:NoDataYet", "Yeni veri girildiğinde burada görünecek.")
    }
  );
}
function Ye({ message: e, onRetry: a, dataUpdatedAt: n }) {
  const s = Ue(n);
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col items-center justify-center text-center gap-2 py-4", children: [
    /* @__PURE__ */ t.jsx(S, { variant: "negative", withDot: !0, children: o("Common:LoadFailed", "Yüklenemedi") }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-secondary max-w-xs", children: e || o("Common:FetchError", "Veri alınırken bir hata oluştu.") }),
    s && /* Son başarılı snapshot — kullanıcı "veri ne kadar eski" bilsin.
    Critical UX: kullanıcı kararlarını eski veriyle vermesin diye. */
    /* @__PURE__ */ t.jsxs("p", { className: "text-xs text-text-tertiary", children: [
      o("Common:LastSuccessfulUpdate", "Son başarılı güncelleme"),
      ": ",
      s
    ] }),
    a && /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: a,
        className: v(
          "text-sm text-text-link underline-offset-2 hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: o("Common:Retry", "Tekrar dene")
      }
    )
  ] });
}
function Ve() {
  return /* @__PURE__ */ t.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1 text-xs text-text-tertiary",
      title: o("Common:UpdatingInBackground", "Arka planda güncelleniyor"),
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ t.jsx(
          "span",
          {
            className: "inline-block h-1.5 w-1.5 rounded-full bg-warning-500 animate-pulse",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ t.jsx("span", { children: o("Common:Updating", "güncelleniyor") })
      ]
    }
  );
}
function Ue(e) {
  if (e == null) return null;
  const a = e instanceof Date ? e.getTime() : Number(e);
  if (!Number.isFinite(a)) return null;
  const n = Math.round((a - Date.now()) / 1e3), s = Math.abs(n), r = new Intl.RelativeTimeFormat(be(), { numeric: "auto" });
  return s < 60 ? r.format(n, "second") : s < 3600 ? r.format(Math.round(n / 60), "minute") : s < 86400 ? r.format(Math.round(n / 3600), "hour") : r.format(Math.round(n / 86400), "day");
}
R.DRAG_HANDLE_CLASS = ue.DRAG_HANDLE_CLASS;
const Z = 250, Qe = 450;
function A(e = Z + Math.random() * (Qe - Z)) {
  return new Promise((a) => setTimeout(a, e));
}
const j = {
  async budgetSummary() {
    return await A(), {
      spent: 1847500,
      budget: 24e5,
      currency: "TRY",
      deltaPct: -8.4,
      breakdown: [
        { project: "KOSGEB Ar-Ge", spent: 72e4, budget: 9e5, ratio: 0.8 },
        { project: "TÜBİTAK 1501", spent: 54e4, budget: 8e5, ratio: 0.68 },
        { project: "Dijitalleşme Hibesi", spent: 387500, budget: 45e4, ratio: 0.86 },
        { project: "İhracat Geliştirme", spent: 2e5, budget: 25e4, ratio: 0.8 }
      ]
    };
  },
  async cashFlow() {
    return await A(), {
      currency: "TRY",
      netCurrent: 487300,
      deltaPct: 12.4,
      series: [
        320,
        312,
        305,
        318,
        332,
        340,
        355,
        348,
        360,
        372,
        380,
        365,
        390,
        410,
        405,
        420,
        435,
        425,
        440,
        455,
        448,
        462,
        470,
        458,
        472,
        480,
        475,
        482,
        487,
        487
      ]
    };
  },
  /* Prototip "4 KPI kartı" şeridi (HANDOFF §Dashboard) — CFO görünümü üstü. */
  async kpiSummary() {
    return await A(), [
      {
        id: "cash",
        icon: "wallet",
        label: "Nakit Pozisyonu",
        value: 487300,
        currency: "TRY",
        deltaPct: 12.4,
        series: [320, 340, 355, 372, 390, 410, 435, 455, 472, 487]
      },
      {
        id: "revenue",
        icon: "trending",
        label: "Aylık Gelir",
        value: 612400,
        currency: "TRY",
        deltaPct: 6.1,
        series: [512, 528, 540, 561, 575, 590, 598, 605, 609, 612]
      },
      {
        id: "expense",
        icon: "receipt",
        label: "Aylık Gider",
        value: 398900,
        currency: "TRY",
        deltaPct: -3.2,
        series: [420, 415, 408, 412, 405, 402, 400, 399, 397, 399]
      },
      {
        id: "budget",
        icon: "gauge",
        label: "Bütçe Kullanımı",
        value: 0.77,
        format: "percent",
        deltaPct: -8.4,
        series: [0.62, 0.65, 0.68, 0.7, 0.71, 0.73, 0.75, 0.76, 0.78, 0.77]
      }
    ];
  },
  /* Gelir/Gider grouped-bar (HANDOFF §Dashboard) — CashFlow'un yanında. */
  async incomeExpense() {
    return await A(), {
      currency: "TRY",
      months: [
        { label: "Şub", income: 512e3, expense: 34e4 },
        { label: "Mar", income: 54e4, expense: 365e3 },
        { label: "Nis", income: 498e3, expense: 372e3 },
        { label: "May", income: 575e3, expense: 388e3 },
        { label: "Haz", income: 602e3, expense: 402e3 },
        { label: "Tem", income: 612400, expense: 398900 }
      ]
    };
  },
  async pendingApprovals() {
    return await A(), [
      { id: "inv-001", type: "invoice", title: "TÜBİTAK 1501 — Eylül faturası", requester: "Ahmet Yıldız", amount: 12450, currency: "TRY", ageHours: 4 },
      { id: "exp-002", type: "expense", title: "Yazılım lisansı — JetBrains All", requester: "Mehmet Kaya", amount: 8240, currency: "TRY", ageHours: 18 },
      { id: "po-003", type: "po", title: "Bulut hosting (Q3 yenileme)", requester: "Zeynep Aksoy", amount: 24900, currency: "TRY", ageHours: 36 },
      { id: "inv-004", type: "invoice", title: "KOSGEB danışmanlık — Ağustos", requester: "Selin Aydın", amount: 6800, currency: "TRY", ageHours: 52 }
    ];
  },
  /* Tek bir onay kaydı + zenginleştirilmiş context (push notification deep-link
     senaryosu — APYA-108). Liste API'sinden bağımsız endpoint. */
  async fetchApproval(e) {
    await A(280);
    const n = (await this.pendingApprovals()).find((s) => s.id === e);
    if (!n) {
      const s = new Error("Onay bulunamadı veya başka kullanıcıca işlendi.");
      throw s.status = 404, s;
    }
    return {
      ...n,
      ai: {
        confidence: 0.92,
        anomaly: !1,
        /* Reasons — neden anomaly değil/değil. Şeffaf AI: kullanıcı
           güvenmek için "neden"i görmek ister. */
        reasons: [
          "Tutar son 90 günlük ortalamanın %12 altında",
          "Tedarikçi son 6 ayda 4 fatura (sürekli)",
          "KDV oranı kategori için tipik (%20)"
        ]
      },
      context: {
        budget: { remaining: 78400, total: 25e4, currency: "TRY" },
        category: { spentMonth: 14200, label: n.type === "expense" ? "Yazılım" : "Operasyon" },
        project: { name: "KOSGEB Ar-Ge", code: "PRJ-2026-014" }
      }
    };
  },
  async approveItem(e) {
    if (await A(600), Math.random() < 0.05) {
      const a = new Error("Bu kayıt başka bir kullanıcı tarafından onaylanmış.");
      throw a.status = 409, a;
    }
    return { id: e.id, status: "approved" };
  },
  async rejectItem(e) {
    return await A(400), { id: e.id, status: "rejected" };
  },
  async riskAlerts() {
    return await A(), [
      {
        id: "r-001",
        severity: "critical",
        confidence: 92,
        confidenceLabel: "Yüksek",
        title: "KOSGEB Ar-Ge projesi 14 gün içinde teslim — kritik yol kaymış",
        reasons: [
          "Görev T-142 son 5 gündür hareketsiz",
          "Bağımlı 3 görev gecikmeli",
          "Geçmiş projelerde benzer örüntü %78 gecikme ile sonuçlandı"
        ],
        suggestedAction: "Kritik yolu yeniden planla"
      },
      {
        id: "r-002",
        severity: "actionable",
        confidence: 74,
        confidenceLabel: "Orta",
        title: "Dijitalleşme bütçesi %86 — kalan 2 ay yetmeyebilir",
        reasons: [
          "Aylık ortalama harcama hızı 187K ₺",
          "Kalan bütçe 63K ₺",
          "Önceki dönemde benzer hızda %22 aşım yaşanmış"
        ],
        suggestedAction: "Bütçe revizyonu öner"
      },
      {
        id: "r-003",
        severity: "info",
        confidence: 88,
        confidenceLabel: "Yüksek",
        title: "Yeni hibe çağrısı: TÜBİTAK 1505 firma profilinizle %88 uyumlu",
        reasons: [
          "NACE sektörü uyumlu",
          "Çalışan sayısı eşleşiyor",
          "Önceki başarılı projeniz 1501 → 1505 kombinasyonu yaygın"
        ],
        suggestedAction: "Çağrıyı incele"
      }
    ];
  },
  async dismissRisk(e) {
    return await A(300), { id: e.id, dismissed: !0 };
  },
  async acceptRisk(e) {
    return await A(500), { id: e.id, accepted: !0 };
  },
  /* AI suggestion inbox — dashboard widget'ı için top-N öneri.
     Risk alerts'ten ayrı: risk = "neye dikkat", suggestion = "ne yap".
     Tone: opportunity | warning | critical | neutral */
  async aiSuggestions() {
    return await A(), [
      {
        id: "s-001",
        tone: "opportunity",
        confidence: 0.91,
        headline: "Reklam bütçesini Q3'te %15 düşür — ROAS son 2 çeyrekte 1.8 → 1.2",
        why: [
          "Q1 ROAS 1.8 → Q2 ROAS 1.2 (%33 düşüş)",
          "Aynı kategoride sektör medyanı 1.4",
          "Geçen sezon benzer kararı veren 4 müşteride %12 net marj kazanımı"
        ],
        primaryActionLabel: "Bütçeyi düşür",
        affects: { module: "budgets", resource: "campaign-q3" }
      },
      {
        id: "s-002",
        tone: "warning",
        confidence: 0.74,
        headline: "Dijitalleşme kategorisi son 30 günde %22 hızlandı, eşik 2 ay önce aşılır",
        why: [
          "Aylık ortalama harcama hızı 187K ₺",
          "Kalan bütçe 63K ₺",
          "Trend devam ederse 28 Haziran'da limit aşılır"
        ],
        primaryActionLabel: "Bütçe revizyonu öner",
        affects: { module: "budgets", resource: "cat-digital" }
      },
      {
        id: "s-003",
        tone: "opportunity",
        confidence: 0.88,
        headline: "TÜBİTAK 1505 çağrısı firma profilinizle %88 uyumlu — son başvuru 18 gün",
        why: [
          "NACE sektör kodu uyumlu",
          "Çalışan sayısı eşik aralığında",
          "Önceki başarılı 1501 projeniz 1505'e geçişte sık görülen örüntü"
        ],
        primaryActionLabel: "Çağrıyı incele",
        affects: { module: "grants", resource: "tubitak-1505" }
      },
      {
        id: "s-004",
        tone: "neutral",
        confidence: 0.42,
        headline: "Yazılım abonelik gideri 3 ay üst üste yükseldi — kontrol etmek isteyebilirsin",
        why: [
          "Mart: 4.2K — Nisan: 5.1K — Mayıs: 6.3K ₺",
          "Yeni eklenen 3 lisans tespit edildi"
        ],
        primaryActionLabel: "Faturaları gör",
        affects: { module: "expenses", resource: "subs" }
      }
    ];
  },
  async applySuggestion(e) {
    if (await A(500), Math.random() < 0.03) {
      const a = new Error("Bu öneri başka bir kullanıcı tarafından uygulanmış.");
      throw a.status = 409, a;
    }
    return { id: e.id, applied: !0 };
  },
  async snoozeSuggestion(e) {
    return await A(250), { id: e.id, snoozed: !0, until: new Date(Date.now() + 7 * 864e5).toISOString() };
  },
  async dismissSuggestion(e, a = "irrelevant") {
    return await A(250), { id: e.id, dismissed: !0, reason: a };
  }
}, Je = () => j.budgetSummary();
function Ze() {
  return E({
    queryKey: b.dashboard.budget(),
    queryFn: Je
  });
}
function Xe() {
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: l, refetch: d } = Ze(), i = () => d(), u = e ? e.spent / e.budget * 100 : 0, c = X(u), x = e ? $(e.deltaPct) : null;
  return /* @__PURE__ */ t.jsx(
    R,
    {
      title: o("Widget:BudgetHealth:Title", "Bütçe Sağlığı"),
      subtitle: o("Widget:BudgetHealth:Subtitle", "Tüm aktif projeler — bu ay"),
      badge: /* @__PURE__ */ t.jsx(S, { variant: c.badgeVariant, size: "sm", withDot: !0, children: c.label }),
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: l,
      onRetry: i,
      skeleton: /* @__PURE__ */ t.jsx(Y, { withDelta: !0, withBar: !0 }),
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-baseline gap-2 font-tabular", children: [
          /* @__PURE__ */ t.jsx("span", { className: "text-3xl font-semibold tracking-tight", children: T(e.spent, e.currency) }),
          /* @__PURE__ */ t.jsxs("span", { className: "text-sm text-text-tertiary", children: [
            "/ ",
            T(e.budget, e.currency)
          ] })
        ] }),
        x && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1.5 text-xs", children: [
          /* @__PURE__ */ t.jsxs("span", { className: v(
            "inline-flex items-center gap-1 font-medium font-tabular",
            /* delta < 0 = harcama düşmüş = pozitif sinyal */
            e.deltaPct < 0 ? "text-text-positive" : "text-text-negative"
          ), children: [
            x.symbol,
            " ",
            x.text
          ] }),
          /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: o("Common:VsLastMonth", "geçen aya göre") })
        ] }),
        /* @__PURE__ */ t.jsx(et, { value: u, variant: c.barVariant }),
        /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-1.5 mt-1 overflow-y-auto", children: e.breakdown.map((m) => /* @__PURE__ */ t.jsxs(
          "li",
          {
            className: "flex items-center justify-between text-xs gap-3",
            children: [
              /* @__PURE__ */ t.jsx("span", { className: "truncate text-text-secondary", children: m.project }),
              /* @__PURE__ */ t.jsxs("span", { className: v(
                "font-tabular font-medium",
                X(m.ratio * 100).textVariant
              ), children: [
                Math.round(m.ratio * 100),
                "%"
              ] })
            ]
          },
          m.project
        )) })
      ] })
    }
  );
}
function X(e) {
  return e >= 90 ? {
    label: o("Budget:Health:Critical", "Kritik"),
    badgeVariant: "critical",
    barVariant: "critical",
    textVariant: "text-text-negative"
  } : e >= 70 ? {
    label: o("Budget:Health:Warning", "Dikkat"),
    badgeVariant: "warning",
    barVariant: "warning",
    textVariant: "text-text-warning"
  } : {
    label: o("Budget:Health:Healthy", "Sağlıklı"),
    badgeVariant: "positive",
    barVariant: "positive",
    textVariant: "text-text-positive"
  };
}
function et({ value: e, variant: a = "positive" }) {
  const n = {
    positive: "bg-positive-500",
    warning: "bg-warning-500",
    critical: "bg-negative-500"
  }[a];
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      role: "progressbar",
      "aria-valuenow": Math.round(e),
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      className: "w-full h-1.5 rounded-full bg-surface-sunken overflow-hidden",
      children: /* @__PURE__ */ t.jsx(
        "div",
        {
          className: v(
            n,
            "h-full rounded-full transition-all duration-slow ease-standard"
          ),
          style: { width: `${Math.min(e, 100)}%` }
        }
      )
    }
  );
}
const tt = () => j.cashFlow();
function at() {
  return E({
    queryKey: b.dashboard.cashflow(),
    queryFn: tt
  });
}
function nt() {
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: l, refetch: d } = at(), i = () => d(), u = e ? $(e.deltaPct) : null, c = e ? e.deltaPct >= 0 : !0;
  return /* @__PURE__ */ t.jsx(
    R,
    {
      title: o("Widget:CashFlow:Title", "Nakit Akışı"),
      subtitle: o("Widget:CashFlow:Subtitle", "Son 30 gün"),
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: l,
      onRetry: i,
      skeleton: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-4 h-full", children: [
        /* @__PURE__ */ t.jsx(Y, { className: "flex-none" }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx(ce, { height: 64 }) })
      ] }),
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-4 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 flex-none", children: [
          /* @__PURE__ */ t.jsx("div", { className: "text-2xl font-semibold tracking-tight font-tabular", children: T(e.netCurrent, e.currency) }),
          u && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 text-xs", children: [
            /* @__PURE__ */ t.jsxs("span", { className: v(
              "inline-flex items-center gap-1 font-medium font-tabular",
              c ? "text-text-positive" : "text-text-negative"
            ), children: [
              u.symbol,
              " ",
              u.text
            ] }),
            /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: o("Common:VsPreviousPeriod", "vs önceki dönem") })
          ] })
        ] }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx(de, { series: e.series, variant: c ? "positive" : "negative" }) })
      ] })
    }
  );
}
const st = (e, a) => (e ?? []).filter((n) => n.id !== (a == null ? void 0 : a.id));
function D({
  queryKey: e,
  mutationFn: a,
  /* Mutation arg'ı liste'deki hedef row'a nasıl eşlenir? Default: arg = row */
  extractTarget: n = (c) => c,
  /* Optimistic cache transform — default: id eşleşen row'u sil */
  transform: s = st,
  /* Side-effect query'leri — onSettled'da invalidate edilir */
  extraInvalidations: r = [],
  /* Başarı toast'i (undo destekli). undoFn varsa "Geri al" gösterilir. */
  undoMessage: l,
  /* (target) => string  | undefined */
  undoFn: d,
  /* (target) => Promise | undefined */
  /* Hata toast'leri — varsayılan generic mesajlar */
  errorMessage: i = "İşlem başarısız oldu",
  conflictMessage: u = "Bu kayıt başka bir kullanıcı tarafından değiştirildi"
}) {
  const c = O(), x = ne();
  return Se({
    mutationFn: a,
    onMutate: async (m) => {
      const p = n(m);
      await c.cancelQueries({ queryKey: e });
      const h = c.getQueryData(e);
      return c.setQueryData(e, (f) => s(f, p, m)), { previous: h, target: p };
    },
    onError: (m, p, h) => {
      (h == null ? void 0 : h.previous) !== void 0 && c.setQueryData(e, h.previous), (m instanceof Re ? m.status === 409 : (m == null ? void 0 : m.status) === 409) ? x.warning(u, {
        description: "Veriyi tazeleyip tekrar deneyebilirsin.",
        action: { label: "Yenile", onClick: () => c.invalidateQueries({ queryKey: e }) }
      }) : x.error(i, {
        description: m == null ? void 0 : m.message
      });
    },
    onSuccess: (m, p, h) => {
      if (!d || !l) return;
      const f = (h == null ? void 0 : h.target) ?? n(p), y = typeof l == "function" ? l(f) : l;
      x.success(y, {
        action: {
          label: "Geri al",
          onClick: () => {
            c.setQueryData(e, h == null ? void 0 : h.previous), Promise.resolve(d(f)).catch((w) => {
              x.error("Geri alınamadı", { description: w == null ? void 0 : w.message }), c.invalidateQueries({ queryKey: e });
            });
          }
        }
      });
    },
    onSettled: () => {
      c.invalidateQueries({ queryKey: e }), r.forEach((m) => c.invalidateQueries({ queryKey: m }));
    }
  });
}
const it = () => j.pendingApprovals();
function rt() {
  return E({
    queryKey: b.dashboard.approvals(),
    queryFn: it
  });
}
function lt(e) {
  return E({
    queryKey: b.dashboard.approvalDetail(e),
    queryFn: () => j.fetchApproval(e),
    enabled: !!e,
    /* Detail kullanıcı sheet'i kapatınca refetch'e gerek yok */
    staleTime: 6e4
  });
}
function me() {
  return D({
    queryKey: b.dashboard.approvals(),
    mutationFn: (e) => j.approveItem(e),
    extraInvalidations: [b.dashboard.budget(), b.dashboard.cashflow()],
    undoMessage: (e) => `${e.title} onaylandı`,
    undoFn: (e) => j.rejectItem(e),
    /* "geri al" = ters yöne kaydet */
    errorMessage: "Onay başarısız oldu"
  });
}
function xe() {
  return D({
    queryKey: b.dashboard.approvals(),
    mutationFn: (e) => j.rejectItem(e),
    extraInvalidations: [b.dashboard.budget(), b.dashboard.cashflow()],
    undoMessage: (e) => `${e.title} reddedildi`,
    undoFn: (e) => j.approveItem(e),
    errorMessage: "Reddetme başarısız oldu"
  });
}
const ee = {
  invoice: { labelKey: "Approval:Type:Invoice", labelFallback: "Fatura", variant: "brand" },
  expense: { labelKey: "Approval:Type:Expense", labelFallback: "Masraf", variant: "neutral" },
  po: { labelKey: "Approval:Type:Order", labelFallback: "Sipariş", variant: "ai" }
};
function ot() {
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: l, refetch: d } = rt(), i = me(), u = xe(), c = () => d(), x = (h) => i.mutateAsync(h).catch(() => {
  }), m = (h) => u.mutateAsync(h).catch(() => {
  }), p = (e == null ? void 0 : e.length) ?? 0;
  return /* @__PURE__ */ t.jsx(
    R,
    {
      title: o("Widget:PendingApprovals:Title", "Onay Bekleyenler"),
      subtitle: p > 0 ? o("Widget:PendingApprovals:Subtitle", "{0} kalem inceleme bekliyor", p) : void 0,
      badge: p > 0 && /* @__PURE__ */ t.jsx(S, { variant: "warning", size: "sm", withDot: !0, children: p }),
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: l,
      onRetry: c,
      skeleton: /* @__PURE__ */ t.jsx(V, { rows: 4 }),
      isEmpty: !a && !n && p === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        B,
        {
          compact: !0,
          variant: "success",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✓" }),
          title: o("Widget:PendingApprovals:EmptyTitle", "Hepsi tamam"),
          description: o("Widget:PendingApprovals:EmptyDescription", "Bugün karar bekleyen kalmadı.")
        }
      ),
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: e == null ? void 0 : e.map((h) => /* @__PURE__ */ t.jsx(
        ct,
        {
          item: h,
          onApprove: x,
          onReject: m
        },
        h.id
      )) })
    }
  );
}
function ct({ item: e, onApprove: a, onReject: n }) {
  const [s, r] = L.useState(null), l = ee[e.type] ?? ee.expense, d = dt(e.ageHours), i = async (u, c) => {
    if (!s) {
      r(u);
      try {
        await (c == null ? void 0 : c(e));
      } finally {
        r(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsxs("li", { className: v(
    "flex items-center gap-3 p-2.5 rounded-md",
    "bg-surface-base border border-subtle",
    "transition-opacity duration-fast",
    s && "opacity-60"
  ), children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 min-w-0 flex-1", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(S, { variant: l.variant, size: "sm", children: o(l.labelKey, l.labelFallback) }),
        /* @__PURE__ */ t.jsxs("span", { className: "text-xs text-text-tertiary truncate", children: [
          e.requester,
          " · ",
          d
        ] })
      ] }),
      /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary truncate", children: e.title })
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "font-tabular font-semibold text-sm text-text-primary flex-none", children: P(e.amount, e.currency) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 flex-none", children: [
      /* @__PURE__ */ t.jsx(
        N,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => i("reject", n),
          isLoading: s === "reject",
          "aria-label": o("Approval:RejectItem", "{0} reddet", e.title),
          className: "text-text-negative hover:bg-negative-50 hover:text-negative-700",
          children: o("Common:Reject", "Reddet")
        }
      ),
      /* @__PURE__ */ t.jsx(
        N,
        {
          size: "sm",
          variant: "primary",
          onClick: () => i("approve", a),
          isLoading: s === "approve",
          "aria-label": o("Approval:ApproveItem", "{0} onayla", e.title),
          children: o("Common:Approve", "Onayla")
        }
      )
    ] })
  ] });
}
function dt(e) {
  return e < 1 ? o("Common:Age:JustNow", "az önce") : e < 24 ? o("Common:Age:HoursAgo", "{0} sa önce", Math.round(e)) : o("Common:Age:DaysAgo", "{0} gün önce", Math.floor(e / 24));
}
const te = {
  /* Neutral default — AI'ın sakin, ısrarsız tonu */
  neutral: { border: "border-default", ribbon: null },
  /* Pozitif — fırsat, gelişim önerisi */
  opportunity: { border: "border-positive-100", ribbon: "bg-positive-50" },
  /* Uyarı — bütçe aşımı, anomali */
  warning: { border: "border-warning-100", ribbon: "bg-warning-50" },
  /* Kritik — derhal aksiyon */
  critical: { border: "border-critical-50 ring-1 ring-critical-50", ribbon: "bg-critical-50" }
};
function ut({
  headline: e,
  why: a = [],
  /* string[] — bullet'lara dönüşür */
  confidence: n,
  /* 0-1 ya da 0-100 */
  confidenceLabel: s,
  /* opsiyonel custom label; yoksa otomatik band */
  tone: r = "neutral",
  badge: l,
  /* opsiyonel custom badge; yoksa "AI" rozetı */
  primaryActionLabel: d = o("Common:Apply", "Uygula"),
  onApply: i,
  onSnooze: u,
  onDismiss: c,
  pending: x,
  /* 'apply' | 'snooze' | 'dismiss' | null */
  className: m,
  children: p
  /* ekstra içerik — örn. before/after diff snippet */
}) {
  const [h, f] = L.useState(!1), y = te[r] ?? te.neutral, w = Array.isArray(a) && a.length > 0, C = !!x;
  return /* @__PURE__ */ t.jsxs(
    "article",
    {
      className: v(
        "rounded-md border bg-surface-base",
        "transition-opacity duration-fast",
        y.border,
        C && "opacity-60",
        m
      ),
      "data-suggestion-tone": r,
      children: [
        y.ribbon && /* Tone ribbon — sade renk şeridi; arka planı ezmeden tonu işaret eder */
        /* @__PURE__ */ t.jsx("div", { className: v("h-1 rounded-t-md", y.ribbon), "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsxs("div", { className: "p-3 flex flex-col gap-2", children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            l ?? /* @__PURE__ */ t.jsx(S, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
            /* @__PURE__ */ t.jsx(F, { score: n, label: s, size: "md" })
          ] }),
          /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug text-balance", children: e }),
          p,
          w && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx(
              "button",
              {
                type: "button",
                onClick: () => f((M) => !M),
                "aria-expanded": h,
                className: v(
                  "self-start text-xs text-text-link hover:underline",
                  "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
                ),
                children: h ? o("Risk:HideExplanation", "Açıklamayı gizle") : o("Risk:WhyThisSuggestion", "Neden bu öneri?")
              }
            ),
            h && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: a.map((M, z) => /* @__PURE__ */ t.jsx("li", { children: M }, z)) })
          ] }),
          /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
            c && /* @__PURE__ */ t.jsx(
              N,
              {
                size: "sm",
                variant: "ghost",
                onClick: c,
                isLoading: x === "dismiss",
                disabled: C && x !== "dismiss",
                children: o("Ai:Irrelevant", "İlgisiz")
              }
            ),
            u && /* @__PURE__ */ t.jsx(
              N,
              {
                size: "sm",
                variant: "ghost",
                onClick: u,
                isLoading: x === "snooze",
                disabled: C && x !== "snooze",
                children: o("Common:Later", "Sonra")
              }
            ),
            i && /* @__PURE__ */ t.jsx(
              N,
              {
                size: "sm",
                variant: r === "critical" ? "destructive" : "primary",
                onClick: i,
                isLoading: x === "apply",
                disabled: C && x !== "apply",
                children: d
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const mt = () => j.riskAlerts();
function xt() {
  return E({
    queryKey: b.dashboard.risks(),
    queryFn: mt
  });
}
function ht() {
  return D({
    queryKey: b.dashboard.risks(),
    mutationFn: (e) => j.dismissRisk(e),
    errorMessage: "Uyarı reddedilemedi"
  });
}
function ft() {
  return D({
    queryKey: b.dashboard.risks(),
    mutationFn: (e) => j.acceptRisk(e),
    undoMessage: (e) => `Uygulandı: ${e.title}`,
    undoFn: (e) => j.dismissRisk(e),
    errorMessage: "Aksiyon uygulanamadı"
  });
}
const G = {
  critical: { labelKey: "Risk:Severity:Critical", labelFallback: "Kritik", variant: "critical", priority: 0 },
  actionable: { labelKey: "Risk:Severity:Actionable", labelFallback: "Eyleme açık", variant: "warning", priority: 1 },
  info: { labelKey: "Risk:Severity:Info", labelFallback: "Bilgi", variant: "ai", priority: 2 }
};
function pt() {
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: l, refetch: d } = xt(), i = ht(), u = ft(), c = () => d(), x = (h) => i.mutateAsync(h).catch(() => {
  }), m = (h) => u.mutateAsync(h).catch(() => {
  }), p = L.useMemo(
    () => [...e ?? []].sort(
      (h, f) => G[h.severity].priority - G[f.severity].priority
    ),
    [e]
  );
  return /* @__PURE__ */ t.jsx(
    R,
    {
      title: o("Widget:RiskAlerts:Title", "Risk Uyarıları"),
      subtitle: o("Widget:RiskAlerts:Subtitle", "AI öneri motoru"),
      badge: /* @__PURE__ */ t.jsx(S, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: l,
      onRetry: c,
      skeleton: /* @__PURE__ */ t.jsx(V, { rows: 3, withTrailing: !1 }),
      isEmpty: !a && !n && p.length === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        B,
        {
          compact: !0,
          variant: "success",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✓" }),
          title: o("Widget:RiskAlerts:EmptyTitle", "Görünen risk yok"),
          description: o("Widget:RiskAlerts:EmptyDescription", "AI motoru taramayı tamamladı. Yeni veri geldikçe burada görünecek.")
        }
      ),
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: p.map((h) => /* @__PURE__ */ t.jsx(
        gt,
        {
          risk: h,
          onAccept: m,
          onDismiss: x
        },
        h.id
      )) })
    }
  );
}
function gt({ risk: e, onAccept: a, onDismiss: n }) {
  const [s, r] = L.useState(!1), [l, d] = L.useState(null), i = G[e.severity], u = async (c, x) => {
    if (!l) {
      d(c);
      try {
        await (x == null ? void 0 : x(e));
      } finally {
        d(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsx("li", { className: v(
    "rounded-md border bg-surface-base",
    "transition-opacity duration-fast",
    e.severity === "critical" && "border-critical-50 bg-critical-50",
    e.severity === "actionable" && "border-warning-100",
    e.severity === "info" && "border-subtle",
    l && "opacity-60"
  ), children: /* @__PURE__ */ t.jsxs("div", { className: "p-2.5 flex flex-col gap-2", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t.jsx(S, { variant: i.variant, size: "sm", withDot: !0, children: o(i.labelKey, i.labelFallback) }),
      /* @__PURE__ */ t.jsx(F, { score: e.confidence, label: e.confidenceLabel, size: "md" })
    ] }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug", children: e.title }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: () => r((c) => !c),
        "aria-expanded": s,
        className: v(
          "self-start text-xs text-text-link hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: s ? o("Risk:HideExplanation", "Açıklamayı gizle") : o("Risk:WhyThisSuggestion", "Neden bu öneri?")
      }
    ),
    s && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: e.reasons.map((c, x) => /* @__PURE__ */ t.jsx("li", { children: c }, x)) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
      /* @__PURE__ */ t.jsx(
        N,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => u("dismiss", n),
          isLoading: l === "dismiss",
          children: o("Common:NotNow", "Şimdi değil")
        }
      ),
      /* @__PURE__ */ t.jsx(
        N,
        {
          size: "sm",
          variant: e.severity === "critical" ? "destructive" : "primary",
          onClick: () => u("accept", a),
          isLoading: l === "accept",
          children: e.suggestedAction
        }
      )
    ] })
  ] }) });
}
const yt = () => j.aiSuggestions();
function bt() {
  return E({
    queryKey: b.dashboard.aiSuggestions(),
    queryFn: yt
  });
}
function vt() {
  return D({
    queryKey: b.dashboard.aiSuggestions(),
    mutationFn: (e) => j.applySuggestion(e),
    undoMessage: (e) => `Uygulandı: ${e.headline}`,
    /* Server reverse henüz yok — undo cache restore'la sınırlı (factory zaten
       previous'ı koyar). Reverse hazırlanınca undoFn dolar. */
    undoFn: () => Promise.resolve(),
    errorMessage: "Öneri uygulanamadı"
  });
}
function jt() {
  return D({
    queryKey: b.dashboard.aiSuggestions(),
    mutationFn: (e) => j.snoozeSuggestion(e),
    errorMessage: "Erteleme başarısız"
  });
}
function wt() {
  return D({
    queryKey: b.dashboard.aiSuggestions(),
    mutationFn: ({ suggestion: e, reason: a }) => j.dismissSuggestion(e, a),
    extractTarget: ({ suggestion: e }) => e,
    errorMessage: "Reddetme kaydedilemedi"
  });
}
const kt = 5, At = 0.3;
function Nt() {
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: l, refetch: d } = bt(), i = vt(), u = jt(), c = wt(), x = L.useMemo(() => (e ?? []).filter(
    (h) => F.normalize(h.confidence) >= At
  ).slice(0, kt), [e]), m = ((e == null ? void 0 : e.length) ?? 0) - x.length;
  return /* @__PURE__ */ t.jsx(
    R,
    {
      title: o("Widget:AiSuggestions:Title", "AI önerileri"),
      subtitle: o("Widget:AiSuggestions:Subtitle", "Sessiz inbox — sen bakmak istediğinde"),
      badge: /* @__PURE__ */ t.jsx(S, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: l,
      onRetry: () => d(),
      skeleton: /* @__PURE__ */ t.jsx(V, { rows: 3, withLeading: !1 }),
      isEmpty: !a && !n && x.length === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        B,
        {
          compact: !0,
          variant: "info",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✦" }),
          title: o("Widget:AiSuggestions:EmptyTitle", "AI şu an sessiz"),
          description: o("Widget:AiSuggestions:EmptyDescription", "Anlamlı bir öneri çıkarsa burada gözükecek. Şimdilik aksiyona gerek yok.")
        }
      ),
      children: /* @__PURE__ */ t.jsxs("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: [
        x.map((p) => /* @__PURE__ */ t.jsx("li", { children: /* @__PURE__ */ t.jsx(
          St,
          {
            suggestion: p,
            apply: i,
            snooze: u,
            dismiss: c
          }
        ) }, p.id)),
        m > 0 && /* @__PURE__ */ t.jsxs("li", { className: "text-xs text-text-tertiary text-center pt-1", children: [
          "+",
          m,
          " öneri daha"
        ] })
      ] })
    }
  );
}
function St({ suggestion: e, apply: a, snooze: n, dismiss: s }) {
  var l, d, i, u;
  const r = a.isPending && ((l = a.variables) == null ? void 0 : l.id) === e.id ? "apply" : n.isPending && ((d = n.variables) == null ? void 0 : d.id) === e.id ? "snooze" : s.isPending && ((u = (i = s.variables) == null ? void 0 : i.suggestion) == null ? void 0 : u.id) === e.id ? "dismiss" : null;
  return /* @__PURE__ */ t.jsx(
    ut,
    {
      headline: e.headline,
      why: e.why,
      confidence: e.confidence,
      tone: e.tone,
      primaryActionLabel: e.primaryActionLabel,
      pending: r,
      onApply: () => a.mutateAsync(e).catch(() => {
      }),
      onSnooze: () => n.mutateAsync(e).catch(() => {
      }),
      onDismiss: () => s.mutateAsync({ suggestion: e, reason: "irrelevant" }).catch(() => {
      })
    }
  );
}
const Rt = () => j.kpiSummary();
function Ct() {
  return E({
    queryKey: b.dashboard.kpiSummary(),
    queryFn: Rt
  });
}
const Et = {
  wallet: he,
  trending: Mt,
  receipt: zt,
  gauge: Pt
};
function Dt() {
  const { data: e, isLoading: a, isError: n, refetch: s } = Ct();
  return n ? /* @__PURE__ */ t.jsx(_, { variant: "flat", density: "comfortable", className: "h-full flex items-center justify-center", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
    /* @__PURE__ */ t.jsx(S, { variant: "negative", withDot: !0, children: o("Common:LoadFailed", "Yüklenemedi") }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: () => s(),
        className: "text-text-link underline-offset-2 hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
        children: o("Common:Retry", "Tekrar dene")
      }
    )
  ] }) }) : a || !e ? /* @__PURE__ */ t.jsx("div", { className: "grid grid-cols-4 gap-3 h-full mobile:grid-cols-2", children: [0, 1, 2, 3].map((r) => /* @__PURE__ */ t.jsxs(_, { variant: "default", density: "compact", className: "flex flex-col gap-2 justify-center", children: [
    /* @__PURE__ */ t.jsx(k, { height: 10, className: "w-1/2" }),
    /* @__PURE__ */ t.jsx(k, { height: 22, className: "w-2/3" }),
    /* @__PURE__ */ t.jsx(k, { height: 9, className: "w-1/3" })
  ] }, r)) }) : /* @__PURE__ */ t.jsx("div", { className: "grid grid-cols-4 gap-3 h-full mobile:grid-cols-2", children: e.map((r) => /* @__PURE__ */ t.jsx(Lt, { kpi: r }, r.id)) });
}
function Lt({ kpi: e }) {
  const a = $(e.deltaPct), n = e.deltaPct >= 0, s = e.format === "percent" ? new Intl.NumberFormat("tr-TR", { style: "percent", maximumFractionDigits: 0 }).format(e.value) : T(e.value, e.currency), r = Et[e.icon] ?? he;
  return /* @__PURE__ */ t.jsxs(_, { variant: "default", density: "compact", className: "flex flex-col gap-1.5 justify-between", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t.jsx("span", { className: "apya-overline truncate", children: e.label }),
      /* @__PURE__ */ t.jsx(r, { className: "text-text-tertiary flex-none" })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-end justify-between gap-2", children: [
      /* @__PURE__ */ t.jsx("span", { className: "text-xl font-semibold tracking-tight font-tabular truncate", children: s }),
      /* @__PURE__ */ t.jsx("div", { className: "w-10 h-6 flex-none", children: /* @__PURE__ */ t.jsx(de, { series: e.series, variant: n ? "positive" : "negative" }) })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: v(
      "inline-flex items-center gap-1 text-xs font-medium font-tabular w-fit",
      n ? "text-text-positive" : "text-text-negative"
    ), children: [
      a.symbol,
      " ",
      a.text
    ] })
  ] });
}
function he({ className: e }) {
  return /* @__PURE__ */ t.jsxs("svg", { className: e, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ t.jsx("path", { d: "M21 12V7H5a2 2 0 0 1 0-4h14v4" }),
    /* @__PURE__ */ t.jsx("path", { d: "M3 5v14a2 2 0 0 0 2 2h16v-5" }),
    /* @__PURE__ */ t.jsx("path", { d: "M18 12a2 2 0 0 0 0 4h4v-4Z" })
  ] });
}
function Mt({ className: e }) {
  return /* @__PURE__ */ t.jsxs("svg", { className: e, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ t.jsx("path", { d: "M3 17l6-6 4 4 8-8" }),
    /* @__PURE__ */ t.jsx("path", { d: "M17 7h4v4" })
  ] });
}
function zt({ className: e }) {
  return /* @__PURE__ */ t.jsxs("svg", { className: e, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ t.jsx("path", { d: "M4 2h16v20l-3-2-2 2-3-2-3 2-2-2-3 2Z" }),
    /* @__PURE__ */ t.jsx("path", { d: "M8 8h8M8 12h8" })
  ] });
}
function Pt({ className: e }) {
  return /* @__PURE__ */ t.jsxs("svg", { className: e, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ t.jsx("path", { d: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" }),
    /* @__PURE__ */ t.jsx("path", { d: "M12 15l3-3M4 15a8 8 0 1 1 16 0" })
  ] });
}
const Tt = () => j.incomeExpense();
function It() {
  return E({
    queryKey: b.dashboard.incomeExpense(),
    queryFn: Tt
  });
}
function _t() {
  var x;
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: l, refetch: d } = It(), i = () => d(), u = (x = e == null ? void 0 : e.months) == null ? void 0 : x[e.months.length - 1], c = u ? u.income - u.expense : null;
  return /* @__PURE__ */ t.jsx(
    R,
    {
      title: o("Widget:IncomeExpense:Title", "Gelir / Gider"),
      subtitle: o("Widget:IncomeExpense:Subtitle", "Son 6 ay"),
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: l,
      onRetry: i,
      skeleton: /* @__PURE__ */ t.jsx(ce, { height: 64 }),
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-2 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          c != null && /* @__PURE__ */ t.jsxs("span", { className: "text-lg font-semibold tracking-tight font-tabular", children: [
            T(c, e.currency),
            /* @__PURE__ */ t.jsx("span", { className: "text-xs font-normal text-text-tertiary ml-1", children: o("Common:Net", "net") })
          ] }),
          /* @__PURE__ */ t.jsx(Ft, {})
        ] }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-h-0", children: /* @__PURE__ */ t.jsx(Bt, { months: e.months }) }),
        /* @__PURE__ */ t.jsx("div", { className: "flex text-[10px] text-text-tertiary", children: e.months.map((m) => /* @__PURE__ */ t.jsx("span", { className: "flex-1 text-center", children: m.label }, m.label)) })
      ] })
    }
  );
}
function Ft() {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-3 text-[11px] text-text-secondary flex-none", children: [
    /* @__PURE__ */ t.jsxs("span", { className: "inline-flex items-center gap-1", children: [
      /* @__PURE__ */ t.jsx("span", { className: "inline-block w-2 h-2 rounded-full", style: { background: "var(--apya-positive-500)" }, "aria-hidden": "true" }),
      o("Common:Income", "Gelir")
    ] }),
    /* @__PURE__ */ t.jsxs("span", { className: "inline-flex items-center gap-1", children: [
      /* @__PURE__ */ t.jsx("span", { className: "inline-block w-2 h-2 rounded-full", style: { background: "var(--apya-negative-500)" }, "aria-hidden": "true" }),
      o("Common:Expense", "Gider")
    ] })
  ] });
}
function Bt({ months: e }) {
  if (!e || e.length === 0) return null;
  const a = 100, n = 100, s = Math.max(...e.flatMap((i) => [i.income, i.expense])) || 1, r = a / e.length, l = r * 0.3, d = r * 0.08;
  return /* @__PURE__ */ t.jsx("svg", { viewBox: `0 0 ${a} ${n}`, preserveAspectRatio: "none", className: "w-full h-full", "aria-hidden": "true", children: e.map((i, u) => {
    const c = u * r + r / 2, x = i.income / s * n, m = i.expense / s * n;
    return /* @__PURE__ */ t.jsxs("g", { children: [
      /* @__PURE__ */ t.jsx(
        "rect",
        {
          x: c - d / 2 - l,
          y: n - x,
          width: l,
          height: x,
          fill: "var(--apya-positive-500)"
        }
      ),
      /* @__PURE__ */ t.jsx(
        "rect",
        {
          x: c + d / 2,
          y: n - m,
          width: l,
          height: m,
          fill: "var(--apya-negative-500)"
        }
      )
    ] }, i.label);
  }) });
}
const Wt = 200;
function Ht({ approvalId: e, open: a, onOpenChange: n }) {
  var h;
  const s = Le(), r = lt(e), l = me(), d = xe(), i = r.data, u = g.useCallback(async () => {
    if (i)
      try {
        await l.mutateAsync(i), n == null || n(!1);
      } catch {
      }
  }, [i, l, n]), c = g.useCallback(async () => {
    if (i)
      try {
        await d.mutateAsync(i), n == null || n(!1);
      } catch {
      }
  }, [i, d, n]), x = g.useMemo(() => {
    var f, y;
    return i ? `${P(i.amount, i.currency)} — ${i.requester} — ${((y = (f = i.context) == null ? void 0 : f.category) == null ? void 0 : y.label) ?? i.type}` : null;
  }, [i]), m = s === "decision" ? Wt : 0, p = l.isPending || d.isPending;
  return /* @__PURE__ */ t.jsx(U, { open: a, onOpenChange: n, children: /* @__PURE__ */ t.jsx(
    U.Content,
    {
      title: o("Approval:Detail:Title", "Onay detayı"),
      description: o("Approval:Detail:Subtitle", "Tek bir kararı bağlamıyla incele ve uygula"),
      children: /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col h-full", children: [
        /* @__PURE__ */ t.jsxs("header", { className: "px-4 pt-2 pb-3 border-b border-subtle", children: [
          /* @__PURE__ */ t.jsx("h2", { className: "text-lg font-semibold text-balance", children: r.isLoading ? /* @__PURE__ */ t.jsx(Y, { withDelta: !1 }) : x }),
          i && /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary mt-1", children: i.title })
        ] }),
        /* @__PURE__ */ t.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4", children: [
          r.isError && /* @__PURE__ */ t.jsx("div", { className: "rounded-md border border-negative-100 bg-negative-50 p-3", children: /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-negative", children: ((h = r.error) == null ? void 0 : h.message) ?? o("Approval:LoadFailed", "Onay yüklenemedi.") }) }),
          i && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx(Kt, { ai: i.ai }),
            /* @__PURE__ */ t.jsx(Gt, { context: i.context })
          ] })
        ] }),
        /* @__PURE__ */ t.jsxs("footer", { className: "px-4 py-3 border-t border-subtle bg-surface-sunken flex items-center justify-end gap-2", children: [
          /* @__PURE__ */ t.jsx(
            N,
            {
              type: "button",
              variant: "ghost",
              size: "md",
              onClick: c,
              isLoading: d.isPending,
              disabled: !i || p,
              className: "text-text-negative hover:bg-negative-50 hover:text-negative-700",
              children: o("Common:Reject", "Reddet")
            }
          ),
          /* @__PURE__ */ t.jsx(
            $e,
            {
              holdMs: m,
              variant: "primary",
              size: "md",
              onConfirm: u,
              isLoading: l.isPending,
              disabled: !i || p,
              children: m > 0 ? o("Approval:HoldToApprove", "Onaylamak için bas") : o("Common:Approve", "Onayla")
            }
          )
        ] })
      ] })
    }
  ) });
}
function Kt({ ai: e }) {
  var a;
  return e ? /* @__PURE__ */ t.jsxs("section", { className: "rounded-md border border-subtle bg-surface-base p-3", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2 mb-2", children: [
      /* @__PURE__ */ t.jsx(S, { variant: e.anomaly ? "warning" : "ai", size: "sm", withDot: !0, children: e.anomaly ? o("Approval:Ai:AnomalyFound", "AI: anomali işareti var") : o("Approval:Ai:NoAnomaly", "AI: anomali yok") }),
      /* @__PURE__ */ t.jsx(F, { score: e.confidence, size: "md" })
    ] }),
    ((a = e.reasons) == null ? void 0 : a.length) > 0 && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: e.reasons.map((n, s) => /* @__PURE__ */ t.jsx("li", { children: n }, s)) })
  ] }) : null;
}
function Gt({ context: e }) {
  if (!e) return null;
  const { budget: a, category: n, project: s } = e, r = a != null && a.total ? a.remaining / a.total : 0, l = r >= 0.3 ? "positive" : r >= 0.1 ? "warning" : "critical";
  return /* @__PURE__ */ t.jsxs("section", { className: "grid grid-cols-1 gap-2", children: [
    /* @__PURE__ */ t.jsx(
      W,
      {
        label: o("Approval:Detail:BudgetRemaining", "Bütçe kalanı"),
        value: a && P(a.remaining, a.currency),
        hint: a && `${Math.round(r * 100)}% / ${P(a.total, a.currency)}`,
        variant: l
      }
    ),
    /* @__PURE__ */ t.jsx(
      W,
      {
        label: o(
          "Approval:Detail:CategoryThisMonth",
          "{0} — bu ay",
          (n == null ? void 0 : n.label) ?? o("Common:Category", "Kategori")
        ),
        value: n && P(n.spentMonth, (a == null ? void 0 : a.currency) ?? "TRY")
      }
    ),
    /* @__PURE__ */ t.jsx(
      W,
      {
        label: o("Common:Project", "Proje"),
        value: s == null ? void 0 : s.name,
        hint: s == null ? void 0 : s.code
      }
    )
  ] });
}
function W({ label: e, value: a, hint: n, variant: s }) {
  const r = s === "positive" ? "text-text-positive" : s === "warning" ? "text-text-warning" : s === "critical" ? "text-text-negative" : "text-text-primary";
  return /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-3 py-1.5 border-b border-subtle last:border-b-0", children: [
    /* @__PURE__ */ t.jsx("span", { className: "text-sm text-text-secondary", children: e }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col items-end min-w-0", children: [
      /* @__PURE__ */ t.jsx("span", { className: `text-sm font-tabular font-medium ${r}`, children: a ?? "—" }),
      n && /* @__PURE__ */ t.jsx("span", { className: "text-xs text-text-tertiary", children: n })
    ] })
  ] });
}
const $t = Q.WidthProvider(Q.Responsive), Ot = {
  "budget-health": Xe,
  "cash-flow": nt,
  "income-expense": _t,
  "pending-approvals": ot,
  "risk-alerts": pt,
  "ai-suggestions": Nt,
  "kpi-strip": Dt
};
function qt() {
  const [e, a] = g.useState(() => Be()), [n, s] = g.useState(!1), [r, l] = g.useState(null), [d, i] = g.useState(0);
  g.useEffect(() => {
    const f = requestAnimationFrame(() => i(1));
    return () => cancelAnimationFrame(f);
  }, []), g.useEffect(() => {
    if (typeof window > "u") return;
    const f = new URLSearchParams(window.location.search), y = f.get("approval");
    if (!y) return;
    l(y), f.delete("approval");
    const w = window.location.pathname + (f.toString() ? `?${f}` : "") + window.location.hash;
    window.history.replaceState(null, "", w);
  }, []);
  const u = g.useMemo(() => {
    const f = H[e] ?? H.cfo, y = He(e);
    return y ? { ...f, ...y } : f;
  }, [e]), c = g.useCallback((f) => {
    a(f), We(f);
  }, []), x = g.useCallback(
    (f, y) => {
      n && Ke(e, y);
    },
    [n, e]
  ), m = g.useCallback(() => {
    Ge(e), a(e);
  }, [e]), h = (u.desktop ?? []).map((f) => f.i);
  return /* @__PURE__ */ t.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ t.jsx(
      Yt,
      {
        persona: e,
        onPersonaChange: c,
        editMode: n,
        onEditModeToggle: () => s((f) => !f),
        onReset: m
      }
    ),
    /* @__PURE__ */ t.jsx("main", { className: "px-4 py-4 mobile:px-2 mobile:py-2", children: /* @__PURE__ */ t.jsx(
      $t,
      {
        className: v("apya-bento", n && "apya-bento--edit"),
        layouts: u,
        breakpoints: Te,
        cols: Ie,
        rowHeight: _e,
        margin: Fe,
        isDraggable: n,
        isResizable: n,
        draggableHandle: `.${R.DRAG_HANDLE_CLASS}`,
        onLayoutChange: x,
        compactType: "vertical",
        preventCollision: !1,
        children: h.map((f) => {
          const y = Ot[f];
          return y ? /* @__PURE__ */ t.jsx("div", { className: "apya-bento-item", children: /* @__PURE__ */ t.jsx(y, {}) }, f) : /* @__PURE__ */ t.jsx("div", { children: /* @__PURE__ */ t.jsx(R, { title: `Bilinmeyen widget: ${f}` }) }, f);
        })
      },
      d
    ) }),
    /* @__PURE__ */ t.jsx(
      Ht,
      {
        approvalId: r,
        open: !!r,
        onOpenChange: (f) => {
          f || l(null);
        }
      }
    ),
    n && /* @__PURE__ */ t.jsxs(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        className: v(
          "fixed bottom-4 left-1/2 -translate-x-1/2 z-toast",
          "bg-surface-inverse text-text-inverse text-sm",
          "px-4 py-2 rounded-md shadow-lg",
          "flex items-center gap-3"
        ),
        children: [
          /* @__PURE__ */ t.jsx("span", { children: o("Dashboard:EditMode:Hint", "Düzenleme modu — widget'ları sürükleyip yeniden boyutlandırabilirsin") }),
          /* @__PURE__ */ t.jsx(
            N,
            {
              variant: "ghost",
              size: "sm",
              className: "text-text-inverse hover:bg-white/10",
              onClick: () => s(!1),
              children: o("Common:Finish", "Bitir")
            }
          )
        ]
      }
    )
  ] });
}
function Yt({ persona: e, onPersonaChange: a, editMode: n, onEditModeToggle: s, onReset: r }) {
  return /* @__PURE__ */ t.jsxs("header", { className: v(
    "sticky top-0 z-sticky",
    "bg-surface-raised/95 backdrop-blur-sm",
    "border-b border-default",
    "px-4 py-3",
    "flex items-center justify-between gap-4",
    "mobile:px-2 mobile:py-2"
  ), children: [
    /* @__PURE__ */ t.jsx("div", { className: "flex flex-col gap-0.5 min-w-0", children: /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-secondary truncate mobile:hidden", children: o(
      "Dashboard:PersonaView",
      "{0} görünümü",
      o(K[e].key, K[e].fallback)
    ) }) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      /* @__PURE__ */ t.jsx(Vt, { value: e, onChange: a }),
      n ? /* @__PURE__ */ t.jsx(
        N,
        {
          size: "sm",
          variant: "secondary",
          onClick: r,
          title: o("Dashboard:ResetLayout", "Layout'u persona varsayılanına döndür"),
          children: o("Common:Reset", "Sıfırla")
        }
      ) : null,
      /* @__PURE__ */ t.jsx(
        N,
        {
          size: "sm",
          variant: n ? "primary" : "secondary",
          onClick: s,
          children: n ? o("Common:Done", "Tamamla") : o("Common:Edit", "Düzenle")
        }
      )
    ] })
  ] });
}
function Vt({ value: e, onChange: a }) {
  return /* @__PURE__ */ t.jsxs("label", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ t.jsx("span", { className: "sr-only", children: o("Dashboard:SelectPersona", "Persona seç") }),
    /* @__PURE__ */ t.jsx(
      "select",
      {
        value: e,
        onChange: (n) => a(n.target.value),
        className: v(
          "h-10 px-3 text-sm rounded-md",
          "bg-surface-base text-text-primary",
          "border border-default",
          "hover:border-strong",
          "focus-visible:outline-none focus-visible:shadow-focus",
          "transition-colors duration-fast"
        ),
        children: Object.entries(K).map(([n, s]) => /* @__PURE__ */ t.jsx("option", { value: n, children: o(s.key, s.fallback) }, n))
      }
    )
  ] });
}
function Ut(e) {
  const { connection: a, state: n } = re(), s = O();
  g.useEffect(() => {
    if (!a || !(e != null && e.length)) return;
    const r = e.map(([l, d]) => {
      const i = () => {
        d.forEach((u) => {
          s.invalidateQueries({ queryKey: u });
        });
      };
      return a.on(l, i), [l, i];
    });
    return () => {
      r.forEach(([l, d]) => {
        a.off(l, d);
      });
    };
  }, [a, n, s]);
}
function Qt(e) {
  const { connection: a, state: n } = re(), s = O(), r = ne();
  g.useEffect(() => {
    if (!a || !(e != null && e.length)) return;
    const l = e.map(([d, i]) => {
      const u = (c) => {
        var x;
        (x = i.queryKeys) == null || x.forEach(
          (m) => s.invalidateQueries({ queryKey: m })
        ), r.warning(i.message ?? "Bu kayıtta çakışma oldu", {
          description: i.description ?? (c == null ? void 0 : c.message),
          action: {
            label: "Yenile",
            onClick: () => {
              var m;
              (m = i.queryKeys) == null || m.forEach(
                (p) => s.invalidateQueries({ queryKey: p })
              );
            }
          }
        });
      };
      return a.on(d, u), [d, u];
    });
    return () => {
      l.forEach(([d, i]) => a.off(d, i));
    };
  }, [a, n, s]);
}
function Jt() {
  const e = g.useMemo(() => [
    ["JournalEntryPosted", [b.dashboard.budget(), b.dashboard.cashflow()]],
    ["ApprovalDecided", [b.dashboard.approvals(), b.dashboard.budget(), b.dashboard.cashflow()]],
    ["RiskDetected", [b.dashboard.risks()]],
    ["RiskDismissed", [b.dashboard.risks()]],
    ["AISuggestionPosted", [b.dashboard.aiSuggestions()]]
  ], []), a = g.useMemo(() => [
    ["ApprovalConflict", {
      queryKeys: [b.dashboard.approvals(), b.dashboard.budget(), b.dashboard.cashflow()],
      message: "Onay kaydında çakışma",
      description: "Bu kayıt başka bir kullanıcı tarafından işlendi."
    }],
    ["BudgetConflict", {
      queryKeys: [b.dashboard.budget()],
      message: "Bütçe kaydında çakışma",
      description: "Aynı bütçeyi başka bir kullanıcı güncelledi."
    }],
    ["SuggestionConflict", {
      queryKeys: [b.dashboard.aiSuggestions()],
      message: "AI önerisinde çakışma",
      description: "Bu öneri başka bir kullanıcı tarafından uygulanmış."
    }]
  ], []);
  return Ut(e), Qt(a), null;
}
ve();
const ae = document.getElementById("apya-dashboard-root");
ae && fe(ae).render(
  /* @__PURE__ */ t.jsx(je, { children: /* @__PURE__ */ t.jsx(De, { children: /* @__PURE__ */ t.jsx(we, { children: /* @__PURE__ */ t.jsx(ke, { children: /* @__PURE__ */ t.jsxs(Ce, { children: [
    /* @__PURE__ */ t.jsx(Jt, {}),
    /* @__PURE__ */ t.jsx(qt, {})
  ] }) }) }) }) })
);
