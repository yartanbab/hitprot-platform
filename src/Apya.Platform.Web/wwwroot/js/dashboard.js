import { r as p, j as t, d as z, b as he } from "./react-vendor.js";
import { B as N, c as b, S as w, C as P, a as fe, b as pe, d as ge, e as S, Q as y, f as $, g as C, u as te, h as _, i as T, j as Y, r as ye, T as be, k as ve, l as je } from "./registerServiceWorker.js";
import { H as ae, a as we, L as ke } from "./signalr-vendor.js";
import { r as Q } from "./grid-vendor.js";
import { u as E, a as W, b as Ne } from "./query-vendor.js";
import { A as Se } from "./httpClient.js";
/* empty css      */
const ne = p.createContext({
  connection: null,
  state: ae.Disconnected
});
function Ae({ hubUrl: e = "/signalr-hubs/notifications", children: a, enabled: n = !0 }) {
  const [s, r] = p.useState(ae.Disconnected), l = p.useRef(null);
  p.useEffect(() => {
    if (!n || typeof window > "u") return;
    const i = new we().withUrl(e, { withCredentials: !0 }).withAutomaticReconnect([0, 2e3, 5e3, 1e4, 3e4]).configureLogging(ke.Warning).build();
    l.current = i, r(i.state);
    const d = () => r(i.state);
    return i.onreconnecting(d), i.onreconnected(d), i.onclose(d), i.start().then(d).catch((o) => {
      console.warn("[SignalR] connect failed:", o == null ? void 0 : o.message), d();
    }), () => {
      i.stop().catch(() => {
      }), l.current = null;
    };
  }, [e, n]);
  const c = p.useMemo(() => ({
    get connection() {
      return l.current;
    },
    state: s
  }), [s]);
  return /* @__PURE__ */ t.jsx(ne.Provider, { value: c, children: a });
}
function se() {
  return p.useContext(ne);
}
const I = {
  triage: "(min-width: 768px)",
  analysis: "(min-width: 1280px)",
  command: "(min-width: 1920px)"
};
function Re() {
  return typeof window > "u" || !window.matchMedia ? "analysis" : window.matchMedia(I.command).matches ? "command" : window.matchMedia(I.analysis).matches ? "analysis" : window.matchMedia(I.triage).matches ? "triage" : "decision";
}
const ie = p.createContext(null);
function Ee({ children: e, override: a }) {
  const n = p.useCallback((l) => {
    if (typeof window > "u" || !window.matchMedia) return () => {
    };
    const c = Object.values(I).map((i) => window.matchMedia(i));
    return c.forEach((i) => i.addEventListener("change", l)), () => c.forEach((i) => i.removeEventListener("change", l));
  }, []), s = p.useSyncExternalStore(n, Re, () => "analysis"), r = a ?? s;
  return p.useEffect(() => {
    typeof document > "u" || (document.documentElement.dataset.deviceMode = r);
  }, [r]), /* @__PURE__ */ t.jsx(ie.Provider, { value: r, children: e });
}
function Me() {
  const e = p.useContext(ie);
  if (e === null)
    throw new Error("useDeviceMode must be used within <DeviceModeProvider>.");
  return e;
}
const ze = {
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
}, De = {
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
}, Le = {
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
  cfo: ze,
  pm: De,
  field: Le
}, re = {
  cfo: "CFO / Finansman",
  pm: "Proje Yöneticisi",
  field: "Saha Kullanıcısı"
}, _e = {
  desktop: 1280,
  tablet: 768,
  mobile: 0
}, Ce = {
  desktop: 12,
  tablet: 8,
  mobile: 1
}, Ie = 64, Pe = [12, 12], le = "apya-dashboard-persona", G = "apya-dashboard-layout-overrides";
function Te() {
  if (typeof window > "u") return "cfo";
  try {
    const e = window.localStorage.getItem(le);
    if (e && H[e]) return e;
  } catch {
  }
  return "cfo";
}
function Be(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(le, e);
    } catch {
    }
}
function Fe(e) {
  if (typeof window > "u") return null;
  try {
    const a = window.localStorage.getItem(`${G}-${e}`);
    return a ? JSON.parse(a) : null;
  } catch {
    return null;
  }
}
function He(e, a) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(
        `${G}-${e}`,
        JSON.stringify(a)
      );
    } catch {
    }
}
function Ke(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.removeItem(`${G}-${e}`);
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
  ...c
}) {
  const [i, d] = p.useState(0), o = p.useRef(0), m = p.useRef(0), u = e <= 0, f = p.useCallback(() => {
    cancelAnimationFrame(o.current), o.current = 0, m.current = 0, d(0);
  }, []), x = p.useCallback(() => {
    if (!m.current) return;
    const g = performance.now() - m.current, j = Math.min(g / e, 1);
    d(j), j >= 1 ? (f(), a == null || a()) : o.current = requestAnimationFrame(x);
  }, [e, a, f]), h = p.useCallback((g) => {
    r || l || u || g.button !== void 0 && g.button !== 0 || (m.current = performance.now(), o.current = requestAnimationFrame(x));
  }, [r, l, u, x]);
  return p.useEffect(() => () => cancelAnimationFrame(o.current), []), u ? /* @__PURE__ */ t.jsx(
    N,
    {
      onClick: a,
      disabled: r,
      isLoading: l,
      className: s,
      ...c,
      children: n
    }
  ) : /* @__PURE__ */ t.jsxs(
    N,
    {
      disabled: r,
      isLoading: l,
      onPointerDown: h,
      onPointerUp: f,
      onPointerLeave: f,
      onPointerCancel: f,
      onBlur: f,
      onClick: (g) => {
        g.detail === 0 ? a == null || a() : g.preventDefault();
      },
      className: b("relative overflow-hidden", s),
      ...c,
      children: [
        /* @__PURE__ */ t.jsx(
          "span",
          {
            className: b(
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
function q({ className: e, withDelta: a = !0, withBar: n = !1 }) {
  return /* @__PURE__ */ t.jsxs("div", { className: b("flex flex-col gap-3 h-full", e), "aria-busy": "true", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-baseline gap-2", children: [
      /* @__PURE__ */ t.jsx(w, { width: 140, height: 32, rounded: "md" }),
      /* @__PURE__ */ t.jsx(w, { width: 70, height: 16, rounded: "sm" })
    ] }),
    a && /* @__PURE__ */ t.jsx(w, { width: 180, height: 12, rounded: "sm" }),
    n && /* @__PURE__ */ t.jsx(w, { height: 6, rounded: "full" })
  ] });
}
function oe({ className: e, height: a = 64 }) {
  const n = [0.4, 0.55, 0.45, 0.7, 0.6, 0.8, 0.65, 0.85, 0.75, 0.9, 0.7, 0.95];
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      className: b("flex items-end justify-between gap-1 w-full", e),
      style: { height: a },
      "aria-busy": "true",
      children: n.map((s, r) => /* @__PURE__ */ t.jsx(
        w,
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
function O({ rows: e = 4, withLeading: a = !0, withTrailing: n = !0, className: s }) {
  return /* @__PURE__ */ t.jsx("ul", { className: b("flex flex-col gap-2", s), "aria-busy": "true", children: Array.from({ length: e }).map((r, l) => /* @__PURE__ */ t.jsxs(
    "li",
    {
      className: "flex items-center gap-3 p-2 rounded-md border border-subtle bg-surface-base",
      children: [
        a && /* @__PURE__ */ t.jsx(w, { width: 32, height: 32, rounded: "md" }),
        /* @__PURE__ */ t.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
          /* @__PURE__ */ t.jsx(w, { height: 12, className: l % 2 === 0 ? "w-3/4" : "w-2/3" }),
          /* @__PURE__ */ t.jsx(w, { height: 10, className: "w-1/2" })
        ] }),
        n && /* @__PURE__ */ t.jsx(w, { width: 64, height: 12, rounded: "sm" })
      ]
    },
    l
  )) });
}
const V = {
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
  className: c
}) {
  const i = V[r] ?? V.default;
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      role: "status",
      "aria-live": "polite",
      className: b(
        "flex flex-col items-center justify-center text-center",
        l ? "gap-2 py-3" : "gap-3 py-6",
        c
      ),
      children: [
        e && /* @__PURE__ */ t.jsx(
          "span",
          {
            className: b(
              "inline-flex items-center justify-center rounded-full",
              i.ring,
              l ? "h-8 w-8" : "h-12 w-12"
            ),
            "aria-hidden": "true",
            children: e
          }
        ),
        a && /* @__PURE__ */ t.jsx("p", { className: b(
          "font-medium text-text-primary",
          l ? "text-sm" : "text-base"
        ), children: a }),
        n && /* @__PURE__ */ t.jsx("p", { className: b("max-w-sm", i.text, l ? "text-xs" : "text-sm"), children: n }),
        s && /* @__PURE__ */ t.jsx("div", { className: "mt-1", children: s })
      ]
    }
  );
}
function ce({ series: e, variant: a = "positive", className: n = "w-full h-full" }) {
  const r = `apya-spark-${p.useId().replace(/:/g, "")}`;
  if (!e || e.length < 2) return null;
  const l = 100, c = 40, i = Math.min(...e), o = Math.max(...e) - i || 1, u = e.map((h, g) => {
    const j = g / (e.length - 1) * l, R = c - (h - i) / o * c;
    return [j, R];
  }).map(([h, g], j) => `${j === 0 ? "M" : "L"} ${h.toFixed(2)} ${g.toFixed(2)}`).join(" "), f = `${u} L ${l} ${c} L 0 ${c} Z`, x = a === "positive" ? "var(--apya-positive-500)" : "var(--apya-negative-500)";
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      viewBox: `0 0 ${l} ${c}`,
      preserveAspectRatio: "none",
      className: n,
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ t.jsx("defs", { children: /* @__PURE__ */ t.jsxs("linearGradient", { id: r, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ t.jsx("stop", { offset: "0%", stopColor: x, stopOpacity: "0.25" }),
          /* @__PURE__ */ t.jsx("stop", { offset: "100%", stopColor: x, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ t.jsx("path", { d: f, fill: `url(#${r})` }),
        /* @__PURE__ */ t.jsx(
          "path",
          {
            d: u,
            fill: "none",
            stroke: x,
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
const de = {
  /* react-grid-layout drag handle'ı için class — yalnızca header'dan sürüklenir */
  DRAG_HANDLE_CLASS: "widget-drag-handle"
};
function A({
  title: e,
  subtitle: a,
  badge: n,
  actions: s,
  /* sağ üstteki action button'lar */
  isLoading: r = !1,
  isError: l = !1,
  errorMessage: c,
  onRetry: i,
  isEmpty: d = !1,
  emptyMessage: o,
  /* legacy: tek satır metin; yeni kod emptyState kullanmalı */
  emptyState: m,
  /* yeni: <EmptyState .../> ReactNode */
  skeleton: u,
  /* yeni: shape-aware loading state — ReactNode */
  isFetching: f = !1,
  /* React Query background refetch */
  isStale: x = !1,
  /* React Query staleTime aşıldı */
  dataUpdatedAt: h,
  /* number (ms) | Date | undefined — son başarılı fetch */
  density: g = "compact",
  children: j,
  className: R
}) {
  const D = !r && !l && x && f;
  return /* @__PURE__ */ t.jsxs(P, { variant: "default", className: b("h-full flex flex-col", R), children: [
    /* @__PURE__ */ t.jsxs(
      fe,
      {
        density: g,
        className: b(
          de.DRAG_HANDLE_CLASS,
          "cursor-grab active:cursor-grabbing select-none",
          "flex-row items-center justify-between flex-none"
        ),
        children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0 flex-1", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ t.jsx(pe, { className: "text-sm font-semibold truncate", children: e }),
              n,
              D && /* @__PURE__ */ t.jsx(Oe, {})
            ] }),
            a && /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary truncate", children: a })
          ] }),
          s && /* @__PURE__ */ t.jsx(
            "div",
            {
              className: "flex items-center gap-1 flex-none",
              onMouseDown: (L) => L.stopPropagation(),
              onTouchStart: (L) => L.stopPropagation(),
              children: s
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ t.jsxs(ge, { density: g, className: "flex-1 overflow-auto", children: [
      l && /* @__PURE__ */ t.jsx(
        qe,
        {
          message: c,
          onRetry: i,
          dataUpdatedAt: h
        }
      ),
      !l && r && (u ?? /* @__PURE__ */ t.jsx(We, { density: g })),
      !l && !r && d && (m ?? /* @__PURE__ */ t.jsx(Ge, { message: o })),
      !l && !r && !d && j
    ] })
  ] });
}
function We({ density: e }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3", "aria-busy": "true", children: [
    /* @__PURE__ */ t.jsx(w, { height: e === "spacious" ? 48 : 32, className: "w-1/3" }),
    /* @__PURE__ */ t.jsx(w, { height: 16 }),
    /* @__PURE__ */ t.jsx(w, { height: 16, className: "w-5/6" }),
    /* @__PURE__ */ t.jsx(w, { height: 16, className: "w-3/4" })
  ] });
}
function Ge({ message: e }) {
  return /* @__PURE__ */ t.jsx(
    B,
    {
      compact: !0,
      title: e ?? "Görüntülenecek veri yok",
      description: "Yeni veri girildiğinde burada görünecek."
    }
  );
}
function qe({ message: e, onRetry: a, dataUpdatedAt: n }) {
  const s = Ye(n);
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col items-center justify-center text-center gap-2 py-4", children: [
    /* @__PURE__ */ t.jsx(S, { variant: "negative", withDot: !0, children: "Yüklenemedi" }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-secondary max-w-xs", children: e || "Veri alınırken bir hata oluştu." }),
    s && /* Son başarılı snapshot — kullanıcı "veri ne kadar eski" bilsin.
    Critical UX: kullanıcı kararlarını eski veriyle vermesin diye. */
    /* @__PURE__ */ t.jsxs("p", { className: "text-xs text-text-tertiary", children: [
      "Son başarılı güncelleme: ",
      s
    ] }),
    a && /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: a,
        className: b(
          "text-sm text-text-link underline-offset-2 hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: "Tekrar dene"
      }
    )
  ] });
}
function Oe() {
  return /* @__PURE__ */ t.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1 text-xs text-text-tertiary",
      title: "Arka planda güncelleniyor",
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ t.jsx(
          "span",
          {
            className: "inline-block h-1.5 w-1.5 rounded-full bg-warning-500 animate-pulse",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ t.jsx("span", { children: "güncelleniyor" })
      ]
    }
  );
}
function Ye(e) {
  if (e == null) return null;
  const a = e instanceof Date ? e.getTime() : Number(e);
  if (!Number.isFinite(a)) return null;
  const n = Math.round((a - Date.now()) / 1e3), s = Math.abs(n), r = new Intl.RelativeTimeFormat("tr-TR", { numeric: "auto" });
  return s < 60 ? r.format(n, "second") : s < 3600 ? r.format(Math.round(n / 60), "minute") : s < 86400 ? r.format(Math.round(n / 3600), "hour") : r.format(Math.round(n / 86400), "day");
}
A.DRAG_HANDLE_CLASS = de.DRAG_HANDLE_CLASS;
const U = 250, Qe = 450;
function k(e = U + Math.random() * (Qe - U)) {
  return new Promise((a) => setTimeout(a, e));
}
const v = {
  async budgetSummary() {
    return await k(), {
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
    return await k(), {
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
    return await k(), [
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
    return await k(), {
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
    return await k(), [
      { id: "inv-001", type: "invoice", title: "TÜBİTAK 1501 — Eylül faturası", requester: "Ahmet Yıldız", amount: 12450, currency: "TRY", ageHours: 4 },
      { id: "exp-002", type: "expense", title: "Yazılım lisansı — JetBrains All", requester: "Mehmet Kaya", amount: 8240, currency: "TRY", ageHours: 18 },
      { id: "po-003", type: "po", title: "Bulut hosting (Q3 yenileme)", requester: "Zeynep Aksoy", amount: 24900, currency: "TRY", ageHours: 36 },
      { id: "inv-004", type: "invoice", title: "KOSGEB danışmanlık — Ağustos", requester: "Selin Aydın", amount: 6800, currency: "TRY", ageHours: 52 }
    ];
  },
  /* Tek bir onay kaydı + zenginleştirilmiş context (push notification deep-link
     senaryosu — APYA-108). Liste API'sinden bağımsız endpoint. */
  async fetchApproval(e) {
    await k(280);
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
    if (await k(600), Math.random() < 0.05) {
      const a = new Error("Bu kayıt başka bir kullanıcı tarafından onaylanmış.");
      throw a.status = 409, a;
    }
    return { id: e.id, status: "approved" };
  },
  async rejectItem(e) {
    return await k(400), { id: e.id, status: "rejected" };
  },
  async riskAlerts() {
    return await k(), [
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
    return await k(300), { id: e.id, dismissed: !0 };
  },
  async acceptRisk(e) {
    return await k(500), { id: e.id, accepted: !0 };
  },
  /* AI suggestion inbox — dashboard widget'ı için top-N öneri.
     Risk alerts'ten ayrı: risk = "neye dikkat", suggestion = "ne yap".
     Tone: opportunity | warning | critical | neutral */
  async aiSuggestions() {
    return await k(), [
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
    if (await k(500), Math.random() < 0.03) {
      const a = new Error("Bu öneri başka bir kullanıcı tarafından uygulanmış.");
      throw a.status = 409, a;
    }
    return { id: e.id, applied: !0 };
  },
  async snoozeSuggestion(e) {
    return await k(250), { id: e.id, snoozed: !0, until: new Date(Date.now() + 7 * 864e5).toISOString() };
  },
  async dismissSuggestion(e, a = "irrelevant") {
    return await k(250), { id: e.id, dismissed: !0, reason: a };
  }
}, Ve = () => v.budgetSummary();
function Ue() {
  return E({
    queryKey: y.dashboard.budget(),
    queryFn: Ve
  });
}
function Je() {
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: l, refetch: c } = Ue(), i = () => c(), d = e ? e.spent / e.budget * 100 : 0, o = J(d), m = e ? $(e.deltaPct) : null;
  return /* @__PURE__ */ t.jsx(
    A,
    {
      title: "Bütçe Sağlığı",
      subtitle: "Tüm aktif projeler — bu ay",
      badge: /* @__PURE__ */ t.jsx(S, { variant: o.badgeVariant, size: "sm", withDot: !0, children: o.label }),
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: l,
      onRetry: i,
      skeleton: /* @__PURE__ */ t.jsx(q, { withDelta: !0, withBar: !0 }),
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-baseline gap-2 font-tabular", children: [
          /* @__PURE__ */ t.jsx("span", { className: "text-3xl font-semibold tracking-tight", children: C(e.spent, e.currency) }),
          /* @__PURE__ */ t.jsxs("span", { className: "text-sm text-text-tertiary", children: [
            "/ ",
            C(e.budget, e.currency)
          ] })
        ] }),
        m && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1.5 text-xs", children: [
          /* @__PURE__ */ t.jsxs("span", { className: b(
            "inline-flex items-center gap-1 font-medium font-tabular",
            /* delta < 0 = harcama düşmüş = pozitif sinyal */
            e.deltaPct < 0 ? "text-text-positive" : "text-text-negative"
          ), children: [
            m.symbol,
            " ",
            m.text
          ] }),
          /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: "geçen aya göre" })
        ] }),
        /* @__PURE__ */ t.jsx(Ze, { value: d, variant: o.barVariant }),
        /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-1.5 mt-1 overflow-y-auto", children: e.breakdown.map((u) => /* @__PURE__ */ t.jsxs(
          "li",
          {
            className: "flex items-center justify-between text-xs gap-3",
            children: [
              /* @__PURE__ */ t.jsx("span", { className: "truncate text-text-secondary", children: u.project }),
              /* @__PURE__ */ t.jsxs("span", { className: b(
                "font-tabular font-medium",
                J(u.ratio * 100).textVariant
              ), children: [
                Math.round(u.ratio * 100),
                "%"
              ] })
            ]
          },
          u.project
        )) })
      ] })
    }
  );
}
function J(e) {
  return e >= 90 ? {
    label: "Kritik",
    badgeVariant: "critical",
    barVariant: "critical",
    textVariant: "text-text-negative"
  } : e >= 70 ? {
    label: "Dikkat",
    badgeVariant: "warning",
    barVariant: "warning",
    textVariant: "text-text-warning"
  } : {
    label: "Sağlıklı",
    badgeVariant: "positive",
    barVariant: "positive",
    textVariant: "text-text-positive"
  };
}
function Ze({ value: e, variant: a = "positive" }) {
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
          className: b(
            n,
            "h-full rounded-full transition-all duration-slow ease-standard"
          ),
          style: { width: `${Math.min(e, 100)}%` }
        }
      )
    }
  );
}
const Xe = () => v.cashFlow();
function et() {
  return E({
    queryKey: y.dashboard.cashflow(),
    queryFn: Xe
  });
}
function tt() {
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: l, refetch: c } = et(), i = () => c(), d = e ? $(e.deltaPct) : null, o = e ? e.deltaPct >= 0 : !0;
  return /* @__PURE__ */ t.jsx(
    A,
    {
      title: "Nakit Akışı",
      subtitle: "Son 30 gün",
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: l,
      onRetry: i,
      skeleton: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-4 h-full", children: [
        /* @__PURE__ */ t.jsx(q, { className: "flex-none" }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx(oe, { height: 64 }) })
      ] }),
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-4 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 flex-none", children: [
          /* @__PURE__ */ t.jsx("div", { className: "text-2xl font-semibold tracking-tight font-tabular", children: C(e.netCurrent, e.currency) }),
          d && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 text-xs", children: [
            /* @__PURE__ */ t.jsxs("span", { className: b(
              "inline-flex items-center gap-1 font-medium font-tabular",
              o ? "text-text-positive" : "text-text-negative"
            ), children: [
              d.symbol,
              " ",
              d.text
            ] }),
            /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: "vs önceki dönem" })
          ] })
        ] }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx(ce, { series: e.series, variant: o ? "positive" : "negative" }) })
      ] })
    }
  );
}
const at = (e, a) => (e ?? []).filter((n) => n.id !== (a == null ? void 0 : a.id));
function M({
  queryKey: e,
  mutationFn: a,
  /* Mutation arg'ı liste'deki hedef row'a nasıl eşlenir? Default: arg = row */
  extractTarget: n = (o) => o,
  /* Optimistic cache transform — default: id eşleşen row'u sil */
  transform: s = at,
  /* Side-effect query'leri — onSettled'da invalidate edilir */
  extraInvalidations: r = [],
  /* Başarı toast'i (undo destekli). undoFn varsa "Geri al" gösterilir. */
  undoMessage: l,
  /* (target) => string  | undefined */
  undoFn: c,
  /* (target) => Promise | undefined */
  /* Hata toast'leri — varsayılan generic mesajlar */
  errorMessage: i = "İşlem başarısız oldu",
  conflictMessage: d = "Bu kayıt başka bir kullanıcı tarafından değiştirildi"
}) {
  const o = W(), m = te();
  return Ne({
    mutationFn: a,
    onMutate: async (u) => {
      const f = n(u);
      await o.cancelQueries({ queryKey: e });
      const x = o.getQueryData(e);
      return o.setQueryData(e, (h) => s(h, f, u)), { previous: x, target: f };
    },
    onError: (u, f, x) => {
      (x == null ? void 0 : x.previous) !== void 0 && o.setQueryData(e, x.previous), (u instanceof Se ? u.status === 409 : (u == null ? void 0 : u.status) === 409) ? m.warning(d, {
        description: "Veriyi tazeleyip tekrar deneyebilirsin.",
        action: { label: "Yenile", onClick: () => o.invalidateQueries({ queryKey: e }) }
      }) : m.error(i, {
        description: u == null ? void 0 : u.message
      });
    },
    onSuccess: (u, f, x) => {
      if (!c || !l) return;
      const h = (x == null ? void 0 : x.target) ?? n(f), g = typeof l == "function" ? l(h) : l;
      m.success(g, {
        action: {
          label: "Geri al",
          onClick: () => {
            o.setQueryData(e, x == null ? void 0 : x.previous), Promise.resolve(c(h)).catch((j) => {
              m.error("Geri alınamadı", { description: j == null ? void 0 : j.message }), o.invalidateQueries({ queryKey: e });
            });
          }
        }
      });
    },
    onSettled: () => {
      o.invalidateQueries({ queryKey: e }), r.forEach((u) => o.invalidateQueries({ queryKey: u }));
    }
  });
}
const nt = () => v.pendingApprovals();
function st() {
  return E({
    queryKey: y.dashboard.approvals(),
    queryFn: nt
  });
}
function it(e) {
  return E({
    queryKey: y.dashboard.approvalDetail(e),
    queryFn: () => v.fetchApproval(e),
    enabled: !!e,
    /* Detail kullanıcı sheet'i kapatınca refetch'e gerek yok */
    staleTime: 6e4
  });
}
function ue() {
  return M({
    queryKey: y.dashboard.approvals(),
    mutationFn: (e) => v.approveItem(e),
    extraInvalidations: [y.dashboard.budget(), y.dashboard.cashflow()],
    undoMessage: (e) => `${e.title} onaylandı`,
    undoFn: (e) => v.rejectItem(e),
    /* "geri al" = ters yöne kaydet */
    errorMessage: "Onay başarısız oldu"
  });
}
function me() {
  return M({
    queryKey: y.dashboard.approvals(),
    mutationFn: (e) => v.rejectItem(e),
    extraInvalidations: [y.dashboard.budget(), y.dashboard.cashflow()],
    undoMessage: (e) => `${e.title} reddedildi`,
    undoFn: (e) => v.approveItem(e),
    errorMessage: "Reddetme başarısız oldu"
  });
}
const Z = {
  invoice: { label: "Fatura", variant: "brand" },
  expense: { label: "Masraf", variant: "neutral" },
  po: { label: "Sipariş", variant: "ai" }
};
function rt() {
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: l, refetch: c } = st(), i = ue(), d = me(), o = () => c(), m = (x) => i.mutateAsync(x).catch(() => {
  }), u = (x) => d.mutateAsync(x).catch(() => {
  }), f = (e == null ? void 0 : e.length) ?? 0;
  return /* @__PURE__ */ t.jsx(
    A,
    {
      title: "Onay Bekleyenler",
      subtitle: f > 0 ? `${f} kalem inceleme bekliyor` : void 0,
      badge: f > 0 && /* @__PURE__ */ t.jsx(S, { variant: "warning", size: "sm", withDot: !0, children: f }),
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: l,
      onRetry: o,
      skeleton: /* @__PURE__ */ t.jsx(O, { rows: 4 }),
      isEmpty: !a && !n && f === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        B,
        {
          compact: !0,
          variant: "success",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✓" }),
          title: "Hepsi tamam",
          description: "Bugün karar bekleyen kalmadı."
        }
      ),
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: e == null ? void 0 : e.map((x) => /* @__PURE__ */ t.jsx(
        lt,
        {
          item: x,
          onApprove: m,
          onReject: u
        },
        x.id
      )) })
    }
  );
}
function lt({ item: e, onApprove: a, onReject: n }) {
  const [s, r] = z.useState(null), l = Z[e.type] ?? Z.expense, c = ot(e.ageHours), i = async (d, o) => {
    if (!s) {
      r(d);
      try {
        await (o == null ? void 0 : o(e));
      } finally {
        r(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsxs("li", { className: b(
    "flex items-center gap-3 p-2.5 rounded-md",
    "bg-surface-base border border-subtle",
    "transition-opacity duration-fast",
    s && "opacity-60"
  ), children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 min-w-0 flex-1", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(S, { variant: l.variant, size: "sm", children: l.label }),
        /* @__PURE__ */ t.jsxs("span", { className: "text-xs text-text-tertiary truncate", children: [
          e.requester,
          " · ",
          c
        ] })
      ] }),
      /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary truncate", children: e.title })
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "font-tabular font-semibold text-sm text-text-primary flex-none", children: _(e.amount, e.currency) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 flex-none", children: [
      /* @__PURE__ */ t.jsx(
        N,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => i("reject", n),
          isLoading: s === "reject",
          "aria-label": `${e.title} reddet`,
          className: "text-text-negative hover:bg-negative-50 hover:text-negative-700",
          children: "Reddet"
        }
      ),
      /* @__PURE__ */ t.jsx(
        N,
        {
          size: "sm",
          variant: "primary",
          onClick: () => i("approve", a),
          isLoading: s === "approve",
          "aria-label": `${e.title} onayla`,
          children: "Onayla"
        }
      )
    ] })
  ] });
}
function ot(e) {
  return e < 1 ? "az önce" : e < 24 ? `${Math.round(e)} sa önce` : `${Math.floor(e / 24)} gün önce`;
}
const X = {
  /* Neutral default — AI'ın sakin, ısrarsız tonu */
  neutral: { border: "border-default", ribbon: null },
  /* Pozitif — fırsat, gelişim önerisi */
  opportunity: { border: "border-positive-100", ribbon: "bg-positive-50" },
  /* Uyarı — bütçe aşımı, anomali */
  warning: { border: "border-warning-100", ribbon: "bg-warning-50" },
  /* Kritik — derhal aksiyon */
  critical: { border: "border-critical-50 ring-1 ring-critical-50", ribbon: "bg-critical-50" }
};
function ct({
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
  primaryActionLabel: c = "Uygula",
  onApply: i,
  onSnooze: d,
  onDismiss: o,
  pending: m,
  /* 'apply' | 'snooze' | 'dismiss' | null */
  className: u,
  children: f
  /* ekstra içerik — örn. before/after diff snippet */
}) {
  const [x, h] = z.useState(!1), g = X[r] ?? X.neutral, j = Array.isArray(a) && a.length > 0, R = !!m;
  return /* @__PURE__ */ t.jsxs(
    "article",
    {
      className: b(
        "rounded-md border bg-surface-base",
        "transition-opacity duration-fast",
        g.border,
        R && "opacity-60",
        u
      ),
      "data-suggestion-tone": r,
      children: [
        g.ribbon && /* Tone ribbon — sade renk şeridi; arka planı ezmeden tonu işaret eder */
        /* @__PURE__ */ t.jsx("div", { className: b("h-1 rounded-t-md", g.ribbon), "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsxs("div", { className: "p-3 flex flex-col gap-2", children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            l ?? /* @__PURE__ */ t.jsx(S, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
            /* @__PURE__ */ t.jsx(T, { score: n, label: s, size: "md" })
          ] }),
          /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug text-balance", children: e }),
          f,
          j && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx(
              "button",
              {
                type: "button",
                onClick: () => h((D) => !D),
                "aria-expanded": x,
                className: b(
                  "self-start text-xs text-text-link hover:underline",
                  "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
                ),
                children: x ? "Açıklamayı gizle" : "Neden bu öneri?"
              }
            ),
            x && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: a.map((D, L) => /* @__PURE__ */ t.jsx("li", { children: D }, L)) })
          ] }),
          /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
            o && /* @__PURE__ */ t.jsx(
              N,
              {
                size: "sm",
                variant: "ghost",
                onClick: o,
                isLoading: m === "dismiss",
                disabled: R && m !== "dismiss",
                children: "İlgisiz"
              }
            ),
            d && /* @__PURE__ */ t.jsx(
              N,
              {
                size: "sm",
                variant: "ghost",
                onClick: d,
                isLoading: m === "snooze",
                disabled: R && m !== "snooze",
                children: "Sonra"
              }
            ),
            i && /* @__PURE__ */ t.jsx(
              N,
              {
                size: "sm",
                variant: r === "critical" ? "destructive" : "primary",
                onClick: i,
                isLoading: m === "apply",
                disabled: R && m !== "apply",
                children: c
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const dt = () => v.riskAlerts();
function ut() {
  return E({
    queryKey: y.dashboard.risks(),
    queryFn: dt
  });
}
function mt() {
  return M({
    queryKey: y.dashboard.risks(),
    mutationFn: (e) => v.dismissRisk(e),
    errorMessage: "Uyarı reddedilemedi"
  });
}
function xt() {
  return M({
    queryKey: y.dashboard.risks(),
    mutationFn: (e) => v.acceptRisk(e),
    undoMessage: (e) => `Uygulandı: ${e.title}`,
    undoFn: (e) => v.dismissRisk(e),
    errorMessage: "Aksiyon uygulanamadı"
  });
}
const K = {
  critical: { label: "Kritik", variant: "critical", priority: 0 },
  actionable: { label: "Eyleme açık", variant: "warning", priority: 1 },
  info: { label: "Bilgi", variant: "ai", priority: 2 }
};
function ht() {
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: l, refetch: c } = ut(), i = mt(), d = xt(), o = () => c(), m = (x) => i.mutateAsync(x).catch(() => {
  }), u = (x) => d.mutateAsync(x).catch(() => {
  }), f = z.useMemo(
    () => [...e ?? []].sort(
      (x, h) => K[x.severity].priority - K[h.severity].priority
    ),
    [e]
  );
  return /* @__PURE__ */ t.jsx(
    A,
    {
      title: "Risk Uyarıları",
      subtitle: "AI öneri motoru",
      badge: /* @__PURE__ */ t.jsx(S, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: l,
      onRetry: o,
      skeleton: /* @__PURE__ */ t.jsx(O, { rows: 3, withTrailing: !1 }),
      isEmpty: !a && !n && f.length === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        B,
        {
          compact: !0,
          variant: "success",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✓" }),
          title: "Görünen risk yok",
          description: "AI motoru taramayı tamamladı. Yeni veri geldikçe burada görünecek."
        }
      ),
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: f.map((x) => /* @__PURE__ */ t.jsx(
        ft,
        {
          risk: x,
          onAccept: u,
          onDismiss: m
        },
        x.id
      )) })
    }
  );
}
function ft({ risk: e, onAccept: a, onDismiss: n }) {
  const [s, r] = z.useState(!1), [l, c] = z.useState(null), i = K[e.severity], d = async (o, m) => {
    if (!l) {
      c(o);
      try {
        await (m == null ? void 0 : m(e));
      } finally {
        c(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsx("li", { className: b(
    "rounded-md border bg-surface-base",
    "transition-opacity duration-fast",
    e.severity === "critical" && "border-critical-50 bg-critical-50",
    e.severity === "actionable" && "border-warning-100",
    e.severity === "info" && "border-subtle",
    l && "opacity-60"
  ), children: /* @__PURE__ */ t.jsxs("div", { className: "p-2.5 flex flex-col gap-2", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t.jsx(S, { variant: i.variant, size: "sm", withDot: !0, children: i.label }),
      /* @__PURE__ */ t.jsx(T, { score: e.confidence, label: e.confidenceLabel, size: "md" })
    ] }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug", children: e.title }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: () => r((o) => !o),
        "aria-expanded": s,
        className: b(
          "self-start text-xs text-text-link hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: s ? "Açıklamayı gizle" : "Neden bu öneri?"
      }
    ),
    s && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: e.reasons.map((o, m) => /* @__PURE__ */ t.jsx("li", { children: o }, m)) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
      /* @__PURE__ */ t.jsx(
        N,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => d("dismiss", n),
          isLoading: l === "dismiss",
          children: "Şimdi değil"
        }
      ),
      /* @__PURE__ */ t.jsx(
        N,
        {
          size: "sm",
          variant: e.severity === "critical" ? "destructive" : "primary",
          onClick: () => d("accept", a),
          isLoading: l === "accept",
          children: e.suggestedAction
        }
      )
    ] })
  ] }) });
}
const pt = () => v.aiSuggestions();
function gt() {
  return E({
    queryKey: y.dashboard.aiSuggestions(),
    queryFn: pt
  });
}
function yt() {
  return M({
    queryKey: y.dashboard.aiSuggestions(),
    mutationFn: (e) => v.applySuggestion(e),
    undoMessage: (e) => `Uygulandı: ${e.headline}`,
    /* Server reverse henüz yok — undo cache restore'la sınırlı (factory zaten
       previous'ı koyar). Reverse hazırlanınca undoFn dolar. */
    undoFn: () => Promise.resolve(),
    errorMessage: "Öneri uygulanamadı"
  });
}
function bt() {
  return M({
    queryKey: y.dashboard.aiSuggestions(),
    mutationFn: (e) => v.snoozeSuggestion(e),
    errorMessage: "Erteleme başarısız"
  });
}
function vt() {
  return M({
    queryKey: y.dashboard.aiSuggestions(),
    mutationFn: ({ suggestion: e, reason: a }) => v.dismissSuggestion(e, a),
    extractTarget: ({ suggestion: e }) => e,
    errorMessage: "Reddetme kaydedilemedi"
  });
}
const jt = 5, wt = 0.3;
function kt() {
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: l, refetch: c } = gt(), i = yt(), d = bt(), o = vt(), m = z.useMemo(() => (e ?? []).filter(
    (x) => T.normalize(x.confidence) >= wt
  ).slice(0, jt), [e]), u = ((e == null ? void 0 : e.length) ?? 0) - m.length;
  return /* @__PURE__ */ t.jsx(
    A,
    {
      title: "AI önerileri",
      subtitle: "Sessiz inbox — sen bakmak istediğinde",
      badge: /* @__PURE__ */ t.jsx(S, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: l,
      onRetry: () => c(),
      skeleton: /* @__PURE__ */ t.jsx(O, { rows: 3, withLeading: !1 }),
      isEmpty: !a && !n && m.length === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        B,
        {
          compact: !0,
          variant: "info",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✦" }),
          title: "AI şu an sessiz",
          description: "Anlamlı bir öneri çıkarsa burada gözükecek. Şimdilik aksiyona gerek yok."
        }
      ),
      children: /* @__PURE__ */ t.jsxs("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: [
        m.map((f) => /* @__PURE__ */ t.jsx("li", { children: /* @__PURE__ */ t.jsx(
          Nt,
          {
            suggestion: f,
            apply: i,
            snooze: d,
            dismiss: o
          }
        ) }, f.id)),
        u > 0 && /* @__PURE__ */ t.jsxs("li", { className: "text-xs text-text-tertiary text-center pt-1", children: [
          "+",
          u,
          " öneri daha"
        ] })
      ] })
    }
  );
}
function Nt({ suggestion: e, apply: a, snooze: n, dismiss: s }) {
  var l, c, i, d;
  const r = a.isPending && ((l = a.variables) == null ? void 0 : l.id) === e.id ? "apply" : n.isPending && ((c = n.variables) == null ? void 0 : c.id) === e.id ? "snooze" : s.isPending && ((d = (i = s.variables) == null ? void 0 : i.suggestion) == null ? void 0 : d.id) === e.id ? "dismiss" : null;
  return /* @__PURE__ */ t.jsx(
    ct,
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
const St = () => v.kpiSummary();
function At() {
  return E({
    queryKey: y.dashboard.kpiSummary(),
    queryFn: St
  });
}
const Rt = {
  wallet: xe,
  trending: zt,
  receipt: Dt,
  gauge: Lt
};
function Et() {
  const { data: e, isLoading: a, isError: n, refetch: s } = At();
  return n ? /* @__PURE__ */ t.jsx(P, { variant: "flat", density: "comfortable", className: "h-full flex items-center justify-center", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
    /* @__PURE__ */ t.jsx(S, { variant: "negative", withDot: !0, children: "Yüklenemedi" }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: () => s(),
        className: "text-text-link underline-offset-2 hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
        children: "Tekrar dene"
      }
    )
  ] }) }) : a || !e ? /* @__PURE__ */ t.jsx("div", { className: "grid grid-cols-4 gap-3 h-full mobile:grid-cols-2", children: [0, 1, 2, 3].map((r) => /* @__PURE__ */ t.jsxs(P, { variant: "default", density: "compact", className: "flex flex-col gap-2 justify-center", children: [
    /* @__PURE__ */ t.jsx(w, { height: 10, className: "w-1/2" }),
    /* @__PURE__ */ t.jsx(w, { height: 22, className: "w-2/3" }),
    /* @__PURE__ */ t.jsx(w, { height: 9, className: "w-1/3" })
  ] }, r)) }) : /* @__PURE__ */ t.jsx("div", { className: "grid grid-cols-4 gap-3 h-full mobile:grid-cols-2", children: e.map((r) => /* @__PURE__ */ t.jsx(Mt, { kpi: r }, r.id)) });
}
function Mt({ kpi: e }) {
  const a = $(e.deltaPct), n = e.deltaPct >= 0, s = e.format === "percent" ? new Intl.NumberFormat("tr-TR", { style: "percent", maximumFractionDigits: 0 }).format(e.value) : C(e.value, e.currency), r = Rt[e.icon] ?? xe;
  return /* @__PURE__ */ t.jsxs(P, { variant: "default", density: "compact", className: "flex flex-col gap-1.5 justify-between", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t.jsx("span", { className: "apya-overline truncate", children: e.label }),
      /* @__PURE__ */ t.jsx(r, { className: "text-text-tertiary flex-none" })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-end justify-between gap-2", children: [
      /* @__PURE__ */ t.jsx("span", { className: "text-xl font-semibold tracking-tight font-tabular truncate", children: s }),
      /* @__PURE__ */ t.jsx("div", { className: "w-10 h-6 flex-none", children: /* @__PURE__ */ t.jsx(ce, { series: e.series, variant: n ? "positive" : "negative" }) })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: b(
      "inline-flex items-center gap-1 text-xs font-medium font-tabular w-fit",
      n ? "text-text-positive" : "text-text-negative"
    ), children: [
      a.symbol,
      " ",
      a.text
    ] })
  ] });
}
function xe({ className: e }) {
  return /* @__PURE__ */ t.jsxs("svg", { className: e, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ t.jsx("path", { d: "M21 12V7H5a2 2 0 0 1 0-4h14v4" }),
    /* @__PURE__ */ t.jsx("path", { d: "M3 5v14a2 2 0 0 0 2 2h16v-5" }),
    /* @__PURE__ */ t.jsx("path", { d: "M18 12a2 2 0 0 0 0 4h4v-4Z" })
  ] });
}
function zt({ className: e }) {
  return /* @__PURE__ */ t.jsxs("svg", { className: e, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ t.jsx("path", { d: "M3 17l6-6 4 4 8-8" }),
    /* @__PURE__ */ t.jsx("path", { d: "M17 7h4v4" })
  ] });
}
function Dt({ className: e }) {
  return /* @__PURE__ */ t.jsxs("svg", { className: e, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ t.jsx("path", { d: "M4 2h16v20l-3-2-2 2-3-2-3 2-2-2-3 2Z" }),
    /* @__PURE__ */ t.jsx("path", { d: "M8 8h8M8 12h8" })
  ] });
}
function Lt({ className: e }) {
  return /* @__PURE__ */ t.jsxs("svg", { className: e, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ t.jsx("path", { d: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" }),
    /* @__PURE__ */ t.jsx("path", { d: "M12 15l3-3M4 15a8 8 0 1 1 16 0" })
  ] });
}
const _t = () => v.incomeExpense();
function Ct() {
  return E({
    queryKey: y.dashboard.incomeExpense(),
    queryFn: _t
  });
}
function It() {
  var m;
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: l, refetch: c } = Ct(), i = () => c(), d = (m = e == null ? void 0 : e.months) == null ? void 0 : m[e.months.length - 1], o = d ? d.income - d.expense : null;
  return /* @__PURE__ */ t.jsx(
    A,
    {
      title: "Gelir / Gider",
      subtitle: "Son 6 ay",
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: l,
      onRetry: i,
      skeleton: /* @__PURE__ */ t.jsx(oe, { height: 64 }),
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-2 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          o != null && /* @__PURE__ */ t.jsxs("span", { className: "text-lg font-semibold tracking-tight font-tabular", children: [
            C(o, e.currency),
            /* @__PURE__ */ t.jsx("span", { className: "text-xs font-normal text-text-tertiary ml-1", children: "net" })
          ] }),
          /* @__PURE__ */ t.jsx(Pt, {})
        ] }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-h-0", children: /* @__PURE__ */ t.jsx(Tt, { months: e.months }) }),
        /* @__PURE__ */ t.jsx("div", { className: "flex text-[10px] text-text-tertiary", children: e.months.map((u) => /* @__PURE__ */ t.jsx("span", { className: "flex-1 text-center", children: u.label }, u.label)) })
      ] })
    }
  );
}
function Pt() {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-3 text-[11px] text-text-secondary flex-none", children: [
    /* @__PURE__ */ t.jsxs("span", { className: "inline-flex items-center gap-1", children: [
      /* @__PURE__ */ t.jsx("span", { className: "inline-block w-2 h-2 rounded-full", style: { background: "var(--apya-positive-500)" }, "aria-hidden": "true" }),
      "Gelir"
    ] }),
    /* @__PURE__ */ t.jsxs("span", { className: "inline-flex items-center gap-1", children: [
      /* @__PURE__ */ t.jsx("span", { className: "inline-block w-2 h-2 rounded-full", style: { background: "var(--apya-negative-500)" }, "aria-hidden": "true" }),
      "Gider"
    ] })
  ] });
}
function Tt({ months: e }) {
  if (!e || e.length === 0) return null;
  const a = 100, n = 100, s = Math.max(...e.flatMap((i) => [i.income, i.expense])) || 1, r = a / e.length, l = r * 0.3, c = r * 0.08;
  return /* @__PURE__ */ t.jsx("svg", { viewBox: `0 0 ${a} ${n}`, preserveAspectRatio: "none", className: "w-full h-full", "aria-hidden": "true", children: e.map((i, d) => {
    const o = d * r + r / 2, m = i.income / s * n, u = i.expense / s * n;
    return /* @__PURE__ */ t.jsxs("g", { children: [
      /* @__PURE__ */ t.jsx(
        "rect",
        {
          x: o - c / 2 - l,
          y: n - m,
          width: l,
          height: m,
          fill: "var(--apya-positive-500)"
        }
      ),
      /* @__PURE__ */ t.jsx(
        "rect",
        {
          x: o + c / 2,
          y: n - u,
          width: l,
          height: u,
          fill: "var(--apya-negative-500)"
        }
      )
    ] }, i.label);
  }) });
}
const Bt = 200;
function Ft({ approvalId: e, open: a, onOpenChange: n }) {
  var x;
  const s = Me(), r = it(e), l = ue(), c = me(), i = r.data, d = p.useCallback(async () => {
    if (i)
      try {
        await l.mutateAsync(i), n == null || n(!1);
      } catch {
      }
  }, [i, l, n]), o = p.useCallback(async () => {
    if (i)
      try {
        await c.mutateAsync(i), n == null || n(!1);
      } catch {
      }
  }, [i, c, n]), m = p.useMemo(() => {
    var h, g;
    return i ? `${_(i.amount, i.currency)} — ${i.requester} — ${((g = (h = i.context) == null ? void 0 : h.category) == null ? void 0 : g.label) ?? i.type}` : null;
  }, [i]), u = s === "decision" ? Bt : 0, f = l.isPending || c.isPending;
  return /* @__PURE__ */ t.jsx(Y, { open: a, onOpenChange: n, children: /* @__PURE__ */ t.jsx(
    Y.Content,
    {
      title: "Onay detayı",
      description: "Tek bir kararı bağlamıyla incele ve uygula",
      children: /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col h-full", children: [
        /* @__PURE__ */ t.jsxs("header", { className: "px-4 pt-2 pb-3 border-b border-subtle", children: [
          /* @__PURE__ */ t.jsx("h2", { className: "text-lg font-semibold text-balance", children: r.isLoading ? /* @__PURE__ */ t.jsx(q, { withDelta: !1 }) : m }),
          i && /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary mt-1", children: i.title })
        ] }),
        /* @__PURE__ */ t.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4", children: [
          r.isError && /* @__PURE__ */ t.jsx("div", { className: "rounded-md border border-negative-100 bg-negative-50 p-3", children: /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-negative", children: ((x = r.error) == null ? void 0 : x.message) ?? "Onay yüklenemedi." }) }),
          i && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx(Ht, { ai: i.ai }),
            /* @__PURE__ */ t.jsx(Kt, { context: i.context })
          ] })
        ] }),
        /* @__PURE__ */ t.jsxs("footer", { className: "px-4 py-3 border-t border-subtle bg-surface-sunken flex items-center justify-end gap-2", children: [
          /* @__PURE__ */ t.jsx(
            N,
            {
              type: "button",
              variant: "ghost",
              size: "md",
              onClick: o,
              isLoading: c.isPending,
              disabled: !i || f,
              className: "text-text-negative hover:bg-negative-50 hover:text-negative-700",
              children: "Reddet"
            }
          ),
          /* @__PURE__ */ t.jsx(
            $e,
            {
              holdMs: u,
              variant: "primary",
              size: "md",
              onConfirm: d,
              isLoading: l.isPending,
              disabled: !i || f,
              children: u > 0 ? "Onaylamak için bas" : "Onayla"
            }
          )
        ] })
      ] })
    }
  ) });
}
function Ht({ ai: e }) {
  var a;
  return e ? /* @__PURE__ */ t.jsxs("section", { className: "rounded-md border border-subtle bg-surface-base p-3", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2 mb-2", children: [
      /* @__PURE__ */ t.jsx(S, { variant: e.anomaly ? "warning" : "ai", size: "sm", withDot: !0, children: e.anomaly ? "AI: anomali işareti var" : "AI: anomaly yok" }),
      /* @__PURE__ */ t.jsx(T, { score: e.confidence, size: "md" })
    ] }),
    ((a = e.reasons) == null ? void 0 : a.length) > 0 && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: e.reasons.map((n, s) => /* @__PURE__ */ t.jsx("li", { children: n }, s)) })
  ] }) : null;
}
function Kt({ context: e }) {
  if (!e) return null;
  const { budget: a, category: n, project: s } = e, r = a != null && a.total ? a.remaining / a.total : 0, l = r >= 0.3 ? "positive" : r >= 0.1 ? "warning" : "critical";
  return /* @__PURE__ */ t.jsxs("section", { className: "grid grid-cols-1 gap-2", children: [
    /* @__PURE__ */ t.jsx(
      F,
      {
        label: "Bütçe kalanı",
        value: a && _(a.remaining, a.currency),
        hint: a && `${Math.round(r * 100)}% / ${_(a.total, a.currency)}`,
        variant: l
      }
    ),
    /* @__PURE__ */ t.jsx(
      F,
      {
        label: `${(n == null ? void 0 : n.label) ?? "Kategori"} — bu ay`,
        value: n && _(n.spentMonth, (a == null ? void 0 : a.currency) ?? "TRY")
      }
    ),
    /* @__PURE__ */ t.jsx(
      F,
      {
        label: "Proje",
        value: s == null ? void 0 : s.name,
        hint: s == null ? void 0 : s.code
      }
    )
  ] });
}
function F({ label: e, value: a, hint: n, variant: s }) {
  const r = s === "positive" ? "text-text-positive" : s === "warning" ? "text-text-warning" : s === "critical" ? "text-text-negative" : "text-text-primary";
  return /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-3 py-1.5 border-b border-subtle last:border-b-0", children: [
    /* @__PURE__ */ t.jsx("span", { className: "text-sm text-text-secondary", children: e }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col items-end min-w-0", children: [
      /* @__PURE__ */ t.jsx("span", { className: `text-sm font-tabular font-medium ${r}`, children: a ?? "—" }),
      n && /* @__PURE__ */ t.jsx("span", { className: "text-xs text-text-tertiary", children: n })
    ] })
  ] });
}
const $t = Q.WidthProvider(Q.Responsive), Wt = {
  "budget-health": Je,
  "cash-flow": tt,
  "income-expense": It,
  "pending-approvals": rt,
  "risk-alerts": ht,
  "ai-suggestions": kt,
  "kpi-strip": Et
};
function Gt() {
  const [e, a] = p.useState(() => Te()), [n, s] = p.useState(!1), [r, l] = p.useState(null), [c, i] = p.useState(0);
  p.useEffect(() => {
    const h = requestAnimationFrame(() => i(1));
    return () => cancelAnimationFrame(h);
  }, []), p.useEffect(() => {
    if (typeof window > "u") return;
    const h = new URLSearchParams(window.location.search), g = h.get("approval");
    if (!g) return;
    l(g), h.delete("approval");
    const j = window.location.pathname + (h.toString() ? `?${h}` : "") + window.location.hash;
    window.history.replaceState(null, "", j);
  }, []);
  const d = p.useMemo(() => {
    const h = H[e] ?? H.cfo, g = Fe(e);
    return g ? { ...h, ...g } : h;
  }, [e]), o = p.useCallback((h) => {
    a(h), Be(h);
  }, []), m = p.useCallback(
    (h, g) => {
      n && He(e, g);
    },
    [n, e]
  ), u = p.useCallback(() => {
    Ke(e), a(e);
  }, [e]), x = (d.desktop ?? []).map((h) => h.i);
  return /* @__PURE__ */ t.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ t.jsx(
      qt,
      {
        persona: e,
        onPersonaChange: o,
        editMode: n,
        onEditModeToggle: () => s((h) => !h),
        onReset: u
      }
    ),
    /* @__PURE__ */ t.jsx("main", { className: "px-4 py-4 mobile:px-2 mobile:py-2", children: /* @__PURE__ */ t.jsx(
      $t,
      {
        className: b("apya-bento", n && "apya-bento--edit"),
        layouts: d,
        breakpoints: _e,
        cols: Ce,
        rowHeight: Ie,
        margin: Pe,
        isDraggable: n,
        isResizable: n,
        draggableHandle: `.${A.DRAG_HANDLE_CLASS}`,
        onLayoutChange: m,
        compactType: "vertical",
        preventCollision: !1,
        children: x.map((h) => {
          const g = Wt[h];
          return g ? /* @__PURE__ */ t.jsx("div", { className: "apya-bento-item", children: /* @__PURE__ */ t.jsx(g, {}) }, h) : /* @__PURE__ */ t.jsx("div", { children: /* @__PURE__ */ t.jsx(A, { title: `Bilinmeyen widget: ${h}` }) }, h);
        })
      },
      c
    ) }),
    /* @__PURE__ */ t.jsx(
      Ft,
      {
        approvalId: r,
        open: !!r,
        onOpenChange: (h) => {
          h || l(null);
        }
      }
    ),
    n && /* @__PURE__ */ t.jsxs(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        className: b(
          "fixed bottom-4 left-1/2 -translate-x-1/2 z-toast",
          "bg-surface-inverse text-text-inverse text-sm",
          "px-4 py-2 rounded-md shadow-lg",
          "flex items-center gap-3"
        ),
        children: [
          /* @__PURE__ */ t.jsx("span", { children: "Düzenleme modu — widget'ları sürükleyip yeniden boyutlandırabilirsin" }),
          /* @__PURE__ */ t.jsx(
            N,
            {
              variant: "ghost",
              size: "sm",
              className: "text-text-inverse hover:bg-white/10",
              onClick: () => s(!1),
              children: "Bitir"
            }
          )
        ]
      }
    )
  ] });
}
function qt({ persona: e, onPersonaChange: a, editMode: n, onEditModeToggle: s, onReset: r }) {
  return /* @__PURE__ */ t.jsxs("header", { className: b(
    "sticky top-0 z-sticky",
    "bg-surface-raised/95 backdrop-blur-sm",
    "border-b border-default",
    "px-4 py-3",
    "flex items-center justify-between gap-4",
    "mobile:px-2 mobile:py-2"
  ), children: [
    /* @__PURE__ */ t.jsx("div", { className: "flex flex-col gap-0.5 min-w-0", children: /* @__PURE__ */ t.jsxs("p", { className: "text-sm font-medium text-text-secondary truncate mobile:hidden", children: [
      re[e],
      " görünümü"
    ] }) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      /* @__PURE__ */ t.jsx(Ot, { value: e, onChange: a }),
      n ? /* @__PURE__ */ t.jsx(
        N,
        {
          size: "sm",
          variant: "secondary",
          onClick: r,
          title: "Layout'u persona varsayılanına döndür",
          children: "Sıfırla"
        }
      ) : null,
      /* @__PURE__ */ t.jsx(
        N,
        {
          size: "sm",
          variant: n ? "primary" : "secondary",
          onClick: s,
          children: n ? "Tamamla" : "Düzenle"
        }
      )
    ] })
  ] });
}
function Ot({ value: e, onChange: a }) {
  return /* @__PURE__ */ t.jsxs("label", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ t.jsx("span", { className: "sr-only", children: "Persona seç" }),
    /* @__PURE__ */ t.jsx(
      "select",
      {
        value: e,
        onChange: (n) => a(n.target.value),
        className: b(
          "h-10 px-3 text-sm rounded-md",
          "bg-surface-base text-text-primary",
          "border border-default",
          "hover:border-strong",
          "focus-visible:outline-none focus-visible:shadow-focus",
          "transition-colors duration-fast"
        ),
        children: Object.entries(re).map(([n, s]) => /* @__PURE__ */ t.jsx("option", { value: n, children: s }, n))
      }
    )
  ] });
}
function Yt(e) {
  const { connection: a, state: n } = se(), s = W();
  p.useEffect(() => {
    if (!a || !(e != null && e.length)) return;
    const r = e.map(([l, c]) => {
      const i = () => {
        c.forEach((d) => {
          s.invalidateQueries({ queryKey: d });
        });
      };
      return a.on(l, i), [l, i];
    });
    return () => {
      r.forEach(([l, c]) => {
        a.off(l, c);
      });
    };
  }, [a, n, s]);
}
function Qt(e) {
  const { connection: a, state: n } = se(), s = W(), r = te();
  p.useEffect(() => {
    if (!a || !(e != null && e.length)) return;
    const l = e.map(([c, i]) => {
      const d = (o) => {
        var m;
        (m = i.queryKeys) == null || m.forEach(
          (u) => s.invalidateQueries({ queryKey: u })
        ), r.warning(i.message ?? "Bu kayıtta çakışma oldu", {
          description: i.description ?? (o == null ? void 0 : o.message),
          action: {
            label: "Yenile",
            onClick: () => {
              var u;
              (u = i.queryKeys) == null || u.forEach(
                (f) => s.invalidateQueries({ queryKey: f })
              );
            }
          }
        });
      };
      return a.on(c, d), [c, d];
    });
    return () => {
      l.forEach(([c, i]) => a.off(c, i));
    };
  }, [a, n, s]);
}
function Vt() {
  const e = p.useMemo(() => [
    ["JournalEntryPosted", [y.dashboard.budget(), y.dashboard.cashflow()]],
    ["ApprovalDecided", [y.dashboard.approvals(), y.dashboard.budget(), y.dashboard.cashflow()]],
    ["RiskDetected", [y.dashboard.risks()]],
    ["RiskDismissed", [y.dashboard.risks()]],
    ["AISuggestionPosted", [y.dashboard.aiSuggestions()]]
  ], []), a = p.useMemo(() => [
    ["ApprovalConflict", {
      queryKeys: [y.dashboard.approvals(), y.dashboard.budget(), y.dashboard.cashflow()],
      message: "Onay kaydında çakışma",
      description: "Bu kayıt başka bir kullanıcı tarafından işlendi."
    }],
    ["BudgetConflict", {
      queryKeys: [y.dashboard.budget()],
      message: "Bütçe kaydında çakışma",
      description: "Aynı bütçeyi başka bir kullanıcı güncelledi."
    }],
    ["SuggestionConflict", {
      queryKeys: [y.dashboard.aiSuggestions()],
      message: "AI önerisinde çakışma",
      description: "Bu öneri başka bir kullanıcı tarafından uygulanmış."
    }]
  ], []);
  return Yt(e), Qt(a), null;
}
ye();
const ee = document.getElementById("apya-dashboard-root");
ee && he(ee).render(
  /* @__PURE__ */ t.jsx(be, { children: /* @__PURE__ */ t.jsx(Ee, { children: /* @__PURE__ */ t.jsx(ve, { children: /* @__PURE__ */ t.jsx(je, { children: /* @__PURE__ */ t.jsxs(Ae, { children: [
    /* @__PURE__ */ t.jsx(Vt, {}),
    /* @__PURE__ */ t.jsx(Gt, {})
  ] }) }) }) }) })
);
