import { r as g, j as t, d as L, b as he } from "./react-vendor.js";
import { B as A, c as v, C as _, a as pe, b as fe, d as ge, t as l, e as N, S as E, f as ye, g as O, h as T, i as P, j as V, T as be } from "./Sheet.js";
import { Q as b, u as ae, C as F, r as ve, a as je, T as we } from "./registerServiceWorker.js";
import { H as ne, a as ke, L as Ae } from "./signalr-vendor.js";
import { r as Q } from "./grid-vendor.js";
import { E as B, S as $, a as se, b as q } from "./EmptyState.js";
import { u as C, a as Y, b as Ne } from "./query-vendor.js";
import { A as Se } from "./httpClient.js";
/* empty css      */
const ie = g.createContext({
  connection: null,
  state: ne.Disconnected
});
function Re({ hubUrl: e = "/signalr-hubs/notifications", children: a, enabled: n = !0 }) {
  const [s, r] = g.useState(ne.Disconnected), o = g.useRef(null);
  g.useEffect(() => {
    if (!n || typeof window > "u") return;
    const i = new ke().withUrl(e, { withCredentials: !0 }).withAutomaticReconnect([0, 2e3, 5e3, 1e4, 3e4]).configureLogging(Ae.Warning).build();
    o.current = i, r(i.state);
    const u = () => r(i.state);
    return i.onreconnecting(u), i.onreconnected(u), i.onclose(u), i.start().then(u).catch((c) => {
      console.warn("[SignalR] connect failed:", c == null ? void 0 : c.message), u();
    }), () => {
      i.stop().catch(() => {
      }), o.current = null;
    };
  }, [e, n]);
  const d = g.useMemo(() => ({
    get connection() {
      return o.current;
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
function Ce() {
  return typeof window > "u" || !window.matchMedia ? "analysis" : window.matchMedia(I.command).matches ? "command" : window.matchMedia(I.analysis).matches ? "analysis" : window.matchMedia(I.triage).matches ? "triage" : "decision";
}
const le = g.createContext(null);
function Ee({ children: e, override: a }) {
  const n = g.useCallback((o) => {
    if (typeof window > "u" || !window.matchMedia) return () => {
    };
    const d = Object.values(I).map((i) => window.matchMedia(i));
    return d.forEach((i) => i.addEventListener("change", o)), () => d.forEach((i) => i.removeEventListener("change", o));
  }, []), s = g.useSyncExternalStore(n, Ce, () => "analysis"), r = a ?? s;
  return g.useEffect(() => {
    typeof document > "u" || (document.documentElement.dataset.deviceMode = r);
  }, [r]), /* @__PURE__ */ t.jsx(le.Provider, { value: r, children: e });
}
function De() {
  const e = g.useContext(le);
  if (e === null)
    throw new Error("useDeviceMode must be used within <DeviceModeProvider>.");
  return e;
}
const Le = {
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
}, Me = {
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
}, ze = {
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
  cfo: Le,
  pm: Me,
  field: ze
}, K = {
  cfo: { key: "Persona:Cfo", fallback: "CFO / Finansman" },
  pm: { key: "Persona:Pm", fallback: "Proje Yöneticisi" },
  field: { key: "Persona:Field", fallback: "Saha Kullanıcısı" }
}, Pe = {
  desktop: 1280,
  tablet: 768,
  mobile: 0
}, Te = {
  desktop: 12,
  tablet: 8,
  mobile: 1
}, Ie = 64, _e = [12, 12], oe = "apya-dashboard-persona", U = "apya-dashboard-layout-overrides";
function Fe() {
  if (typeof window > "u") return "cfo";
  try {
    const e = window.localStorage.getItem(oe);
    if (e && H[e]) return e;
  } catch {
  }
  return "cfo";
}
function Be(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(oe, e);
    } catch {
    }
}
function We(e) {
  if (typeof window > "u") return null;
  try {
    const a = window.localStorage.getItem(`${U}-${e}`);
    return a ? JSON.parse(a) : null;
  } catch {
    return null;
  }
}
function He(e, a) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(
        `${U}-${e}`,
        JSON.stringify(a)
      );
    } catch {
    }
}
function Ke(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.removeItem(`${U}-${e}`);
    } catch {
    }
}
function Ge({
  holdMs: e = 200,
  onConfirm: a,
  children: n,
  className: s,
  disabled: r,
  isLoading: o,
  ...d
}) {
  const [i, u] = g.useState(0), c = g.useRef(0), x = g.useRef(0), m = e <= 0, f = g.useCallback(() => {
    cancelAnimationFrame(c.current), c.current = 0, x.current = 0, u(0);
  }, []), h = g.useCallback(() => {
    if (!x.current) return;
    const y = performance.now() - x.current, w = Math.min(y / e, 1);
    u(w), w >= 1 ? (f(), a == null || a()) : c.current = requestAnimationFrame(h);
  }, [e, a, f]), p = g.useCallback((y) => {
    r || o || m || y.button !== void 0 && y.button !== 0 || (x.current = performance.now(), c.current = requestAnimationFrame(h));
  }, [r, o, m, h]);
  return g.useEffect(() => () => cancelAnimationFrame(c.current), []), m ? /* @__PURE__ */ t.jsx(
    A,
    {
      onClick: a,
      disabled: r,
      isLoading: o,
      className: s,
      ...d,
      children: n
    }
  ) : /* @__PURE__ */ t.jsxs(
    A,
    {
      disabled: r,
      isLoading: o,
      onPointerDown: p,
      onPointerUp: f,
      onPointerLeave: f,
      onPointerCancel: f,
      onBlur: f,
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
function ce({ series: e, variant: a = "positive", className: n = "w-full h-full" }) {
  const r = `apya-spark-${g.useId().replace(/:/g, "")}`;
  if (!e || e.length < 2) return null;
  const o = 100, d = 40, i = Math.min(...e), c = Math.max(...e) - i || 1, m = e.map((p, y) => {
    const w = y / (e.length - 1) * o, R = d - (p - i) / c * d;
    return [w, R];
  }).map(([p, y], w) => `${w === 0 ? "M" : "L"} ${p.toFixed(2)} ${y.toFixed(2)}`).join(" "), f = `${m} L ${o} ${d} L 0 ${d} Z`, h = a === "positive" ? "var(--apya-positive-500)" : "var(--apya-negative-500)";
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      viewBox: `0 0 ${o} ${d}`,
      preserveAspectRatio: "none",
      className: n,
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ t.jsx("defs", { children: /* @__PURE__ */ t.jsxs("linearGradient", { id: r, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ t.jsx("stop", { offset: "0%", stopColor: h, stopOpacity: "0.25" }),
          /* @__PURE__ */ t.jsx("stop", { offset: "100%", stopColor: h, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ t.jsx("path", { d: f, fill: `url(#${r})` }),
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
const de = {
  /* react-grid-layout drag handle'ı için class — yalnızca header'dan sürüklenir */
  DRAG_HANDLE_CLASS: "widget-drag-handle"
};
function S({
  title: e,
  subtitle: a,
  badge: n,
  actions: s,
  /* sağ üstteki action button'lar */
  isLoading: r = !1,
  isError: o = !1,
  errorMessage: d,
  onRetry: i,
  isEmpty: u = !1,
  emptyMessage: c,
  /* legacy: tek satır metin; yeni kod emptyState kullanmalı */
  emptyState: x,
  /* yeni: <EmptyState .../> ReactNode */
  skeleton: m,
  /* yeni: shape-aware loading state — ReactNode */
  isFetching: f = !1,
  /* React Query background refetch */
  isStale: h = !1,
  /* React Query staleTime aşıldı */
  dataUpdatedAt: p,
  /* number (ms) | Date | undefined — son başarılı fetch */
  density: y = "compact",
  children: w,
  className: R
}) {
  const M = !r && !o && h && f;
  return /* @__PURE__ */ t.jsxs(_, { variant: "default", className: v("h-full flex flex-col", R), children: [
    /* @__PURE__ */ t.jsxs(
      pe,
      {
        density: y,
        className: v(
          de.DRAG_HANDLE_CLASS,
          "cursor-grab active:cursor-grabbing select-none",
          "flex-row items-center justify-between flex-none"
        ),
        children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0 flex-1", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ t.jsx(fe, { className: "text-sm font-semibold truncate", children: e }),
              n,
              M && /* @__PURE__ */ t.jsx(Ye, {})
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
    /* @__PURE__ */ t.jsxs(ge, { density: y, className: "flex-1 overflow-auto", children: [
      o && /* @__PURE__ */ t.jsx(
        qe,
        {
          message: d,
          onRetry: i,
          dataUpdatedAt: p
        }
      ),
      !o && r && (m ?? /* @__PURE__ */ t.jsx(Oe, { density: y })),
      !o && !r && u && (x ?? /* @__PURE__ */ t.jsx($e, { message: c })),
      !o && !r && !u && w
    ] })
  ] });
}
function Oe({ density: e }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3", "aria-busy": "true", children: [
    /* @__PURE__ */ t.jsx(E, { height: e === "spacious" ? 48 : 32, className: "w-1/3" }),
    /* @__PURE__ */ t.jsx(E, { height: 16 }),
    /* @__PURE__ */ t.jsx(E, { height: 16, className: "w-5/6" }),
    /* @__PURE__ */ t.jsx(E, { height: 16, className: "w-3/4" })
  ] });
}
function $e({ message: e }) {
  return /* @__PURE__ */ t.jsx(
    B,
    {
      compact: !0,
      title: e ?? l("Common:NoDataToShow", "Görüntülenecek veri yok"),
      description: l("Common:NoDataYet", "Yeni veri girildiğinde burada görünecek.")
    }
  );
}
function qe({ message: e, onRetry: a, dataUpdatedAt: n }) {
  const s = Ue(n);
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col items-center justify-center text-center gap-2 py-4", children: [
    /* @__PURE__ */ t.jsx(N, { variant: "negative", withDot: !0, children: l("Common:LoadFailed", "Yüklenemedi") }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-secondary max-w-xs", children: e || l("Common:FetchError", "Veri alınırken bir hata oluştu.") }),
    s && /* Son başarılı snapshot — kullanıcı "veri ne kadar eski" bilsin.
    Critical UX: kullanıcı kararlarını eski veriyle vermesin diye. */
    /* @__PURE__ */ t.jsxs("p", { className: "text-xs text-text-tertiary", children: [
      l("Common:LastSuccessfulUpdate", "Son başarılı güncelleme"),
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
        children: l("Common:Retry", "Tekrar dene")
      }
    )
  ] });
}
function Ye() {
  return /* @__PURE__ */ t.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1 text-xs text-text-tertiary",
      title: l("Common:UpdatingInBackground", "Arka planda güncelleniyor"),
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ t.jsx(
          "span",
          {
            className: "inline-block h-1.5 w-1.5 rounded-full bg-warning-500 animate-pulse",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ t.jsx("span", { children: l("Common:Updating", "güncelleniyor") })
      ]
    }
  );
}
function Ue(e) {
  if (e == null) return null;
  const a = e instanceof Date ? e.getTime() : Number(e);
  if (!Number.isFinite(a)) return null;
  const n = Math.round((a - Date.now()) / 1e3), s = Math.abs(n), r = new Intl.RelativeTimeFormat(ye(), { numeric: "auto" });
  return s < 60 ? r.format(n, "second") : s < 3600 ? r.format(Math.round(n / 60), "minute") : s < 86400 ? r.format(Math.round(n / 3600), "hour") : r.format(Math.round(n / 86400), "day");
}
S.DRAG_HANDLE_CLASS = de.DRAG_HANDLE_CLASS;
const J = 250, Ve = 450;
function k(e = J + Math.random() * (Ve - J)) {
  return new Promise((a) => setTimeout(a, e));
}
const j = {
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
}, Qe = () => j.budgetSummary();
function Je() {
  return C({
    queryKey: b.dashboard.budget(),
    queryFn: Qe
  });
}
function Ze() {
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: o, refetch: d } = Je(), i = () => d(), u = e ? e.spent / e.budget * 100 : 0, c = Z(u), x = e ? O(e.deltaPct) : null;
  return /* @__PURE__ */ t.jsx(
    S,
    {
      title: l("Widget:BudgetHealth:Title", "Bütçe Sağlığı"),
      subtitle: l("Widget:BudgetHealth:Subtitle", "Tüm aktif projeler — bu ay"),
      badge: /* @__PURE__ */ t.jsx(N, { variant: c.badgeVariant, size: "sm", withDot: !0, children: c.label }),
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: o,
      onRetry: i,
      skeleton: /* @__PURE__ */ t.jsx($, { withDelta: !0, withBar: !0 }),
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
          /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: l("Common:VsLastMonth", "geçen aya göre") })
        ] }),
        /* @__PURE__ */ t.jsx(Xe, { value: u, variant: c.barVariant }),
        /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-1.5 mt-1 overflow-y-auto", children: e.breakdown.map((m) => /* @__PURE__ */ t.jsxs(
          "li",
          {
            className: "flex items-center justify-between text-xs gap-3",
            children: [
              /* @__PURE__ */ t.jsx("span", { className: "truncate text-text-secondary", children: m.project }),
              /* @__PURE__ */ t.jsxs("span", { className: v(
                "font-tabular font-medium",
                Z(m.ratio * 100).textVariant
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
function Z(e) {
  return e >= 90 ? {
    label: l("Budget:Health:Critical", "Kritik"),
    badgeVariant: "critical",
    barVariant: "critical",
    textVariant: "text-text-negative"
  } : e >= 70 ? {
    label: l("Budget:Health:Warning", "Dikkat"),
    badgeVariant: "warning",
    barVariant: "warning",
    textVariant: "text-text-warning"
  } : {
    label: l("Budget:Health:Healthy", "Sağlıklı"),
    badgeVariant: "positive",
    barVariant: "positive",
    textVariant: "text-text-positive"
  };
}
function Xe({ value: e, variant: a = "positive" }) {
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
const et = () => j.cashFlow();
function tt() {
  return C({
    queryKey: b.dashboard.cashflow(),
    queryFn: et
  });
}
function at() {
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: o, refetch: d } = tt(), i = () => d(), u = e ? O(e.deltaPct) : null, c = e ? e.deltaPct >= 0 : !0;
  return /* @__PURE__ */ t.jsx(
    S,
    {
      title: l("Widget:CashFlow:Title", "Nakit Akışı"),
      subtitle: l("Widget:CashFlow:Subtitle", "Son 30 gün"),
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: o,
      onRetry: i,
      skeleton: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-4 h-full", children: [
        /* @__PURE__ */ t.jsx($, { className: "flex-none" }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx(se, { height: 64 }) })
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
            /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: l("Common:VsPreviousPeriod", "vs önceki dönem") })
          ] })
        ] }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx(ce, { series: e.series, variant: c ? "positive" : "negative" }) })
      ] })
    }
  );
}
const nt = (e, a) => (e ?? []).filter((n) => n.id !== (a == null ? void 0 : a.id));
function D({
  queryKey: e,
  mutationFn: a,
  /* Mutation arg'ı liste'deki hedef row'a nasıl eşlenir? Default: arg = row */
  extractTarget: n = (c) => c,
  /* Optimistic cache transform — default: id eşleşen row'u sil */
  transform: s = nt,
  /* Side-effect query'leri — onSettled'da invalidate edilir */
  extraInvalidations: r = [],
  /* Başarı toast'i (undo destekli). undoFn varsa "Geri al" gösterilir. */
  undoMessage: o,
  /* (target) => string  | undefined */
  undoFn: d,
  /* (target) => Promise | undefined */
  /* Hata toast'leri — varsayılan generic mesajlar */
  errorMessage: i = "İşlem başarısız oldu",
  conflictMessage: u = "Bu kayıt başka bir kullanıcı tarafından değiştirildi"
}) {
  const c = Y(), x = ae();
  return Ne({
    mutationFn: a,
    onMutate: async (m) => {
      const f = n(m);
      await c.cancelQueries({ queryKey: e });
      const h = c.getQueryData(e);
      return c.setQueryData(e, (p) => s(p, f, m)), { previous: h, target: f };
    },
    onError: (m, f, h) => {
      (h == null ? void 0 : h.previous) !== void 0 && c.setQueryData(e, h.previous), (m instanceof Se ? m.status === 409 : (m == null ? void 0 : m.status) === 409) ? x.warning(u, {
        description: "Veriyi tazeleyip tekrar deneyebilirsin.",
        action: { label: "Yenile", onClick: () => c.invalidateQueries({ queryKey: e }) }
      }) : x.error(i, {
        description: m == null ? void 0 : m.message
      });
    },
    onSuccess: (m, f, h) => {
      if (!d || !o) return;
      const p = (h == null ? void 0 : h.target) ?? n(f), y = typeof o == "function" ? o(p) : o;
      x.success(y, {
        action: {
          label: "Geri al",
          onClick: () => {
            c.setQueryData(e, h == null ? void 0 : h.previous), Promise.resolve(d(p)).catch((w) => {
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
const st = () => j.pendingApprovals();
function it() {
  return C({
    queryKey: b.dashboard.approvals(),
    queryFn: st
  });
}
function rt(e) {
  return C({
    queryKey: b.dashboard.approvalDetail(e),
    queryFn: () => j.fetchApproval(e),
    enabled: !!e,
    /* Detail kullanıcı sheet'i kapatınca refetch'e gerek yok */
    staleTime: 6e4
  });
}
function ue() {
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
function me() {
  return D({
    queryKey: b.dashboard.approvals(),
    mutationFn: (e) => j.rejectItem(e),
    extraInvalidations: [b.dashboard.budget(), b.dashboard.cashflow()],
    undoMessage: (e) => `${e.title} reddedildi`,
    undoFn: (e) => j.approveItem(e),
    errorMessage: "Reddetme başarısız oldu"
  });
}
const X = {
  invoice: { labelKey: "Approval:Type:Invoice", labelFallback: "Fatura", variant: "brand" },
  expense: { labelKey: "Approval:Type:Expense", labelFallback: "Masraf", variant: "neutral" },
  po: { labelKey: "Approval:Type:Order", labelFallback: "Sipariş", variant: "ai" }
};
function lt() {
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: o, refetch: d } = it(), i = ue(), u = me(), c = () => d(), x = (h) => i.mutateAsync(h).catch(() => {
  }), m = (h) => u.mutateAsync(h).catch(() => {
  }), f = (e == null ? void 0 : e.length) ?? 0;
  return /* @__PURE__ */ t.jsx(
    S,
    {
      title: l("Widget:PendingApprovals:Title", "Onay Bekleyenler"),
      subtitle: f > 0 ? l("Widget:PendingApprovals:Subtitle", "{0} kalem inceleme bekliyor", f) : void 0,
      badge: f > 0 && /* @__PURE__ */ t.jsx(N, { variant: "warning", size: "sm", withDot: !0, children: f }),
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: o,
      onRetry: c,
      skeleton: /* @__PURE__ */ t.jsx(q, { rows: 4 }),
      isEmpty: !a && !n && f === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        B,
        {
          compact: !0,
          variant: "success",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✓" }),
          title: l("Widget:PendingApprovals:EmptyTitle", "Hepsi tamam"),
          description: l("Widget:PendingApprovals:EmptyDescription", "Bugün karar bekleyen kalmadı.")
        }
      ),
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: e == null ? void 0 : e.map((h) => /* @__PURE__ */ t.jsx(
        ot,
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
function ot({ item: e, onApprove: a, onReject: n }) {
  const [s, r] = L.useState(null), o = X[e.type] ?? X.expense, d = ct(e.ageHours), i = async (u, c) => {
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
        /* @__PURE__ */ t.jsx(N, { variant: o.variant, size: "sm", children: l(o.labelKey, o.labelFallback) }),
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
        A,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => i("reject", n),
          isLoading: s === "reject",
          "aria-label": l("Approval:RejectItem", "{0} reddet", e.title),
          className: "text-text-negative hover:bg-negative-50 hover:text-negative-700",
          children: l("Common:Reject", "Reddet")
        }
      ),
      /* @__PURE__ */ t.jsx(
        A,
        {
          size: "sm",
          variant: "primary",
          onClick: () => i("approve", a),
          isLoading: s === "approve",
          "aria-label": l("Approval:ApproveItem", "{0} onayla", e.title),
          children: l("Common:Approve", "Onayla")
        }
      )
    ] })
  ] });
}
function ct(e) {
  return e < 1 ? l("Common:Age:JustNow", "az önce") : e < 24 ? l("Common:Age:HoursAgo", "{0} sa önce", Math.round(e)) : l("Common:Age:DaysAgo", "{0} gün önce", Math.floor(e / 24));
}
const ee = {
  /* Neutral default — AI'ın sakin, ısrarsız tonu */
  neutral: { border: "border-default", ribbon: null },
  /* Pozitif — fırsat, gelişim önerisi */
  opportunity: { border: "border-positive-100", ribbon: "bg-positive-50" },
  /* Uyarı — bütçe aşımı, anomali */
  warning: { border: "border-warning-100", ribbon: "bg-warning-50" },
  /* Kritik — derhal aksiyon */
  critical: { border: "border-critical-50 ring-1 ring-critical-50", ribbon: "bg-critical-50" }
};
function dt({
  headline: e,
  why: a = [],
  /* string[] — bullet'lara dönüşür */
  confidence: n,
  /* 0-1 ya da 0-100 */
  confidenceLabel: s,
  /* opsiyonel custom label; yoksa otomatik band */
  tone: r = "neutral",
  badge: o,
  /* opsiyonel custom badge; yoksa "AI" rozetı */
  primaryActionLabel: d = l("Common:Apply", "Uygula"),
  onApply: i,
  onSnooze: u,
  onDismiss: c,
  pending: x,
  /* 'apply' | 'snooze' | 'dismiss' | null */
  className: m,
  children: f
  /* ekstra içerik — örn. before/after diff snippet */
}) {
  const [h, p] = L.useState(!1), y = ee[r] ?? ee.neutral, w = Array.isArray(a) && a.length > 0, R = !!x;
  return /* @__PURE__ */ t.jsxs(
    "article",
    {
      className: v(
        "rounded-md border bg-surface-base",
        "transition-opacity duration-fast",
        y.border,
        R && "opacity-60",
        m
      ),
      "data-suggestion-tone": r,
      children: [
        y.ribbon && /* Tone ribbon — sade renk şeridi; arka planı ezmeden tonu işaret eder */
        /* @__PURE__ */ t.jsx("div", { className: v("h-1 rounded-t-md", y.ribbon), "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsxs("div", { className: "p-3 flex flex-col gap-2", children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            o ?? /* @__PURE__ */ t.jsx(N, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
            /* @__PURE__ */ t.jsx(F, { score: n, label: s, size: "md" })
          ] }),
          /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug text-balance", children: e }),
          f,
          w && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx(
              "button",
              {
                type: "button",
                onClick: () => p((M) => !M),
                "aria-expanded": h,
                className: v(
                  "self-start text-xs text-text-link hover:underline",
                  "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
                ),
                children: h ? l("Risk:HideExplanation", "Açıklamayı gizle") : l("Risk:WhyThisSuggestion", "Neden bu öneri?")
              }
            ),
            h && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: a.map((M, z) => /* @__PURE__ */ t.jsx("li", { children: M }, z)) })
          ] }),
          /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
            c && /* @__PURE__ */ t.jsx(
              A,
              {
                size: "sm",
                variant: "ghost",
                onClick: c,
                isLoading: x === "dismiss",
                disabled: R && x !== "dismiss",
                children: l("Ai:Irrelevant", "İlgisiz")
              }
            ),
            u && /* @__PURE__ */ t.jsx(
              A,
              {
                size: "sm",
                variant: "ghost",
                onClick: u,
                isLoading: x === "snooze",
                disabled: R && x !== "snooze",
                children: l("Common:Later", "Sonra")
              }
            ),
            i && /* @__PURE__ */ t.jsx(
              A,
              {
                size: "sm",
                variant: r === "critical" ? "destructive" : "primary",
                onClick: i,
                isLoading: x === "apply",
                disabled: R && x !== "apply",
                children: d
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const ut = () => j.riskAlerts();
function mt() {
  return C({
    queryKey: b.dashboard.risks(),
    queryFn: ut
  });
}
function xt() {
  return D({
    queryKey: b.dashboard.risks(),
    mutationFn: (e) => j.dismissRisk(e),
    errorMessage: "Uyarı reddedilemedi"
  });
}
function ht() {
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
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: o, refetch: d } = mt(), i = xt(), u = ht(), c = () => d(), x = (h) => i.mutateAsync(h).catch(() => {
  }), m = (h) => u.mutateAsync(h).catch(() => {
  }), f = L.useMemo(
    () => [...e ?? []].sort(
      (h, p) => G[h.severity].priority - G[p.severity].priority
    ),
    [e]
  );
  return /* @__PURE__ */ t.jsx(
    S,
    {
      title: l("Widget:RiskAlerts:Title", "Risk Uyarıları"),
      subtitle: l("Widget:RiskAlerts:Subtitle", "AI öneri motoru"),
      badge: /* @__PURE__ */ t.jsx(N, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: o,
      onRetry: c,
      skeleton: /* @__PURE__ */ t.jsx(q, { rows: 3, withTrailing: !1 }),
      isEmpty: !a && !n && f.length === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        B,
        {
          compact: !0,
          variant: "success",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✓" }),
          title: l("Widget:RiskAlerts:EmptyTitle", "Görünen risk yok"),
          description: l("Widget:RiskAlerts:EmptyDescription", "AI motoru taramayı tamamladı. Yeni veri geldikçe burada görünecek.")
        }
      ),
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: f.map((h) => /* @__PURE__ */ t.jsx(
        ft,
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
function ft({ risk: e, onAccept: a, onDismiss: n }) {
  const [s, r] = L.useState(!1), [o, d] = L.useState(null), i = G[e.severity], u = async (c, x) => {
    if (!o) {
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
    o && "opacity-60"
  ), children: /* @__PURE__ */ t.jsxs("div", { className: "p-2.5 flex flex-col gap-2", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t.jsx(N, { variant: i.variant, size: "sm", withDot: !0, children: l(i.labelKey, i.labelFallback) }),
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
        children: s ? l("Risk:HideExplanation", "Açıklamayı gizle") : l("Risk:WhyThisSuggestion", "Neden bu öneri?")
      }
    ),
    s && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: e.reasons.map((c, x) => /* @__PURE__ */ t.jsx("li", { children: c }, x)) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
      /* @__PURE__ */ t.jsx(
        A,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => u("dismiss", n),
          isLoading: o === "dismiss",
          children: l("Common:NotNow", "Şimdi değil")
        }
      ),
      /* @__PURE__ */ t.jsx(
        A,
        {
          size: "sm",
          variant: e.severity === "critical" ? "destructive" : "primary",
          onClick: () => u("accept", a),
          isLoading: o === "accept",
          children: e.suggestedAction
        }
      )
    ] })
  ] }) });
}
const gt = () => j.aiSuggestions();
function yt() {
  return C({
    queryKey: b.dashboard.aiSuggestions(),
    queryFn: gt
  });
}
function bt() {
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
function vt() {
  return D({
    queryKey: b.dashboard.aiSuggestions(),
    mutationFn: (e) => j.snoozeSuggestion(e),
    errorMessage: "Erteleme başarısız"
  });
}
function jt() {
  return D({
    queryKey: b.dashboard.aiSuggestions(),
    mutationFn: ({ suggestion: e, reason: a }) => j.dismissSuggestion(e, a),
    extractTarget: ({ suggestion: e }) => e,
    errorMessage: "Reddetme kaydedilemedi"
  });
}
const wt = 5, kt = 0.3;
function At() {
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: o, refetch: d } = yt(), i = bt(), u = vt(), c = jt(), x = L.useMemo(() => (e ?? []).filter(
    (h) => F.normalize(h.confidence) >= kt
  ).slice(0, wt), [e]), m = ((e == null ? void 0 : e.length) ?? 0) - x.length;
  return /* @__PURE__ */ t.jsx(
    S,
    {
      title: l("Widget:AiSuggestions:Title", "AI önerileri"),
      subtitle: l("Widget:AiSuggestions:Subtitle", "Sessiz inbox — sen bakmak istediğinde"),
      badge: /* @__PURE__ */ t.jsx(N, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: o,
      onRetry: () => d(),
      skeleton: /* @__PURE__ */ t.jsx(q, { rows: 3, withLeading: !1 }),
      isEmpty: !a && !n && x.length === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        B,
        {
          compact: !0,
          variant: "info",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✦" }),
          title: l("Widget:AiSuggestions:EmptyTitle", "AI şu an sessiz"),
          description: l("Widget:AiSuggestions:EmptyDescription", "Anlamlı bir öneri çıkarsa burada gözükecek. Şimdilik aksiyona gerek yok.")
        }
      ),
      children: /* @__PURE__ */ t.jsxs("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: [
        x.map((f) => /* @__PURE__ */ t.jsx("li", { children: /* @__PURE__ */ t.jsx(
          Nt,
          {
            suggestion: f,
            apply: i,
            snooze: u,
            dismiss: c
          }
        ) }, f.id)),
        m > 0 && /* @__PURE__ */ t.jsxs("li", { className: "text-xs text-text-tertiary text-center pt-1", children: [
          "+",
          m,
          " öneri daha"
        ] })
      ] })
    }
  );
}
function Nt({ suggestion: e, apply: a, snooze: n, dismiss: s }) {
  var o, d, i, u;
  const r = a.isPending && ((o = a.variables) == null ? void 0 : o.id) === e.id ? "apply" : n.isPending && ((d = n.variables) == null ? void 0 : d.id) === e.id ? "snooze" : s.isPending && ((u = (i = s.variables) == null ? void 0 : i.suggestion) == null ? void 0 : u.id) === e.id ? "dismiss" : null;
  return /* @__PURE__ */ t.jsx(
    dt,
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
const St = () => j.kpiSummary();
function Rt() {
  return C({
    queryKey: b.dashboard.kpiSummary(),
    queryFn: St
  });
}
const Ct = {
  wallet: xe,
  trending: Lt,
  receipt: Mt,
  gauge: zt
};
function Et() {
  const { data: e, isLoading: a, isError: n, refetch: s } = Rt();
  return n ? /* @__PURE__ */ t.jsx(_, { variant: "flat", density: "comfortable", className: "h-full flex items-center justify-center", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
    /* @__PURE__ */ t.jsx(N, { variant: "negative", withDot: !0, children: l("Common:LoadFailed", "Yüklenemedi") }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: () => s(),
        className: "text-text-link underline-offset-2 hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
        children: l("Common:Retry", "Tekrar dene")
      }
    )
  ] }) }) : a || !e ? /* @__PURE__ */ t.jsx("div", { className: "grid grid-cols-4 gap-3 h-full mobile:grid-cols-2", children: [0, 1, 2, 3].map((r) => /* @__PURE__ */ t.jsxs(_, { variant: "default", density: "compact", className: "flex flex-col gap-2 justify-center", children: [
    /* @__PURE__ */ t.jsx(E, { height: 10, className: "w-1/2" }),
    /* @__PURE__ */ t.jsx(E, { height: 22, className: "w-2/3" }),
    /* @__PURE__ */ t.jsx(E, { height: 9, className: "w-1/3" })
  ] }, r)) }) : /* @__PURE__ */ t.jsx("div", { className: "grid grid-cols-4 gap-3 h-full mobile:grid-cols-2", children: e.map((r) => /* @__PURE__ */ t.jsx(Dt, { kpi: r }, r.id)) });
}
function Dt({ kpi: e }) {
  const a = O(e.deltaPct), n = e.deltaPct >= 0, s = e.format === "percent" ? new Intl.NumberFormat("tr-TR", { style: "percent", maximumFractionDigits: 0 }).format(e.value) : T(e.value, e.currency), r = Ct[e.icon] ?? xe;
  return /* @__PURE__ */ t.jsxs(_, { variant: "default", density: "compact", className: "flex flex-col gap-1.5 justify-between", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t.jsx("span", { className: "apya-overline truncate", children: e.label }),
      /* @__PURE__ */ t.jsx(r, { className: "text-text-tertiary flex-none" })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-end justify-between gap-2", children: [
      /* @__PURE__ */ t.jsx("span", { className: "text-xl font-semibold tracking-tight font-tabular truncate", children: s }),
      /* @__PURE__ */ t.jsx("div", { className: "w-10 h-6 flex-none", children: /* @__PURE__ */ t.jsx(ce, { series: e.series, variant: n ? "positive" : "negative" }) })
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
function xe({ className: e }) {
  return /* @__PURE__ */ t.jsxs("svg", { className: e, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ t.jsx("path", { d: "M21 12V7H5a2 2 0 0 1 0-4h14v4" }),
    /* @__PURE__ */ t.jsx("path", { d: "M3 5v14a2 2 0 0 0 2 2h16v-5" }),
    /* @__PURE__ */ t.jsx("path", { d: "M18 12a2 2 0 0 0 0 4h4v-4Z" })
  ] });
}
function Lt({ className: e }) {
  return /* @__PURE__ */ t.jsxs("svg", { className: e, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ t.jsx("path", { d: "M3 17l6-6 4 4 8-8" }),
    /* @__PURE__ */ t.jsx("path", { d: "M17 7h4v4" })
  ] });
}
function Mt({ className: e }) {
  return /* @__PURE__ */ t.jsxs("svg", { className: e, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ t.jsx("path", { d: "M4 2h16v20l-3-2-2 2-3-2-3 2-2-2-3 2Z" }),
    /* @__PURE__ */ t.jsx("path", { d: "M8 8h8M8 12h8" })
  ] });
}
function zt({ className: e }) {
  return /* @__PURE__ */ t.jsxs("svg", { className: e, width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ t.jsx("path", { d: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" }),
    /* @__PURE__ */ t.jsx("path", { d: "M12 15l3-3M4 15a8 8 0 1 1 16 0" })
  ] });
}
const Pt = () => j.incomeExpense();
function Tt() {
  return C({
    queryKey: b.dashboard.incomeExpense(),
    queryFn: Pt
  });
}
function It() {
  var x;
  const { data: e, isLoading: a, isError: n, isFetching: s, isStale: r, dataUpdatedAt: o, refetch: d } = Tt(), i = () => d(), u = (x = e == null ? void 0 : e.months) == null ? void 0 : x[e.months.length - 1], c = u ? u.income - u.expense : null;
  return /* @__PURE__ */ t.jsx(
    S,
    {
      title: l("Widget:IncomeExpense:Title", "Gelir / Gider"),
      subtitle: l("Widget:IncomeExpense:Subtitle", "Son 6 ay"),
      isLoading: a,
      isError: n,
      isFetching: s,
      isStale: r,
      dataUpdatedAt: o,
      onRetry: i,
      skeleton: /* @__PURE__ */ t.jsx(se, { height: 64 }),
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-2 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          c != null && /* @__PURE__ */ t.jsxs("span", { className: "text-lg font-semibold tracking-tight font-tabular", children: [
            T(c, e.currency),
            /* @__PURE__ */ t.jsx("span", { className: "text-xs font-normal text-text-tertiary ml-1", children: l("Common:Net", "net") })
          ] }),
          /* @__PURE__ */ t.jsx(_t, {})
        ] }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-h-0", children: /* @__PURE__ */ t.jsx(Ft, { months: e.months }) }),
        /* @__PURE__ */ t.jsx("div", { className: "flex text-[10px] text-text-tertiary", children: e.months.map((m) => /* @__PURE__ */ t.jsx("span", { className: "flex-1 text-center", children: m.label }, m.label)) })
      ] })
    }
  );
}
function _t() {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-3 text-[11px] text-text-secondary flex-none", children: [
    /* @__PURE__ */ t.jsxs("span", { className: "inline-flex items-center gap-1", children: [
      /* @__PURE__ */ t.jsx("span", { className: "inline-block w-2 h-2 rounded-full", style: { background: "var(--apya-positive-500)" }, "aria-hidden": "true" }),
      l("Common:Income", "Gelir")
    ] }),
    /* @__PURE__ */ t.jsxs("span", { className: "inline-flex items-center gap-1", children: [
      /* @__PURE__ */ t.jsx("span", { className: "inline-block w-2 h-2 rounded-full", style: { background: "var(--apya-negative-500)" }, "aria-hidden": "true" }),
      l("Common:Expense", "Gider")
    ] })
  ] });
}
function Ft({ months: e }) {
  if (!e || e.length === 0) return null;
  const a = 100, n = 100, s = Math.max(...e.flatMap((i) => [i.income, i.expense])) || 1, r = a / e.length, o = r * 0.3, d = r * 0.08;
  return /* @__PURE__ */ t.jsx("svg", { viewBox: `0 0 ${a} ${n}`, preserveAspectRatio: "none", className: "w-full h-full", "aria-hidden": "true", children: e.map((i, u) => {
    const c = u * r + r / 2, x = i.income / s * n, m = i.expense / s * n;
    return /* @__PURE__ */ t.jsxs("g", { children: [
      /* @__PURE__ */ t.jsx(
        "rect",
        {
          x: c - d / 2 - o,
          y: n - x,
          width: o,
          height: x,
          fill: "var(--apya-positive-500)"
        }
      ),
      /* @__PURE__ */ t.jsx(
        "rect",
        {
          x: c + d / 2,
          y: n - m,
          width: o,
          height: m,
          fill: "var(--apya-negative-500)"
        }
      )
    ] }, i.label);
  }) });
}
const Bt = 200;
function Wt({ approvalId: e, open: a, onOpenChange: n }) {
  var h;
  const s = De(), r = rt(e), o = ue(), d = me(), i = r.data, u = g.useCallback(async () => {
    if (i)
      try {
        await o.mutateAsync(i), n == null || n(!1);
      } catch {
      }
  }, [i, o, n]), c = g.useCallback(async () => {
    if (i)
      try {
        await d.mutateAsync(i), n == null || n(!1);
      } catch {
      }
  }, [i, d, n]), x = g.useMemo(() => {
    var p, y;
    return i ? `${P(i.amount, i.currency)} — ${i.requester} — ${((y = (p = i.context) == null ? void 0 : p.category) == null ? void 0 : y.label) ?? i.type}` : null;
  }, [i]), m = s === "decision" ? Bt : 0, f = o.isPending || d.isPending;
  return /* @__PURE__ */ t.jsx(V, { open: a, onOpenChange: n, children: /* @__PURE__ */ t.jsx(
    V.Content,
    {
      title: l("Approval:Detail:Title", "Onay detayı"),
      description: l("Approval:Detail:Subtitle", "Tek bir kararı bağlamıyla incele ve uygula"),
      children: /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col h-full", children: [
        /* @__PURE__ */ t.jsxs("header", { className: "px-4 pt-2 pb-3 border-b border-subtle", children: [
          /* @__PURE__ */ t.jsx("h2", { className: "text-lg font-semibold text-balance", children: r.isLoading ? /* @__PURE__ */ t.jsx($, { withDelta: !1 }) : x }),
          i && /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary mt-1", children: i.title })
        ] }),
        /* @__PURE__ */ t.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4", children: [
          r.isError && /* @__PURE__ */ t.jsx("div", { className: "rounded-md border border-negative-100 bg-negative-50 p-3", children: /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-negative", children: ((h = r.error) == null ? void 0 : h.message) ?? l("Approval:LoadFailed", "Onay yüklenemedi.") }) }),
          i && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx(Ht, { ai: i.ai }),
            /* @__PURE__ */ t.jsx(Kt, { context: i.context })
          ] })
        ] }),
        /* @__PURE__ */ t.jsxs("footer", { className: "px-4 py-3 border-t border-subtle bg-surface-sunken flex items-center justify-end gap-2", children: [
          /* @__PURE__ */ t.jsx(
            A,
            {
              type: "button",
              variant: "ghost",
              size: "md",
              onClick: c,
              isLoading: d.isPending,
              disabled: !i || f,
              className: "text-text-negative hover:bg-negative-50 hover:text-negative-700",
              children: l("Common:Reject", "Reddet")
            }
          ),
          /* @__PURE__ */ t.jsx(
            Ge,
            {
              holdMs: m,
              variant: "primary",
              size: "md",
              onConfirm: u,
              isLoading: o.isPending,
              disabled: !i || f,
              children: m > 0 ? l("Approval:HoldToApprove", "Onaylamak için bas") : l("Common:Approve", "Onayla")
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
      /* @__PURE__ */ t.jsx(N, { variant: e.anomaly ? "warning" : "ai", size: "sm", withDot: !0, children: e.anomaly ? l("Approval:Ai:AnomalyFound", "AI: anomali işareti var") : l("Approval:Ai:NoAnomaly", "AI: anomali yok") }),
      /* @__PURE__ */ t.jsx(F, { score: e.confidence, size: "md" })
    ] }),
    ((a = e.reasons) == null ? void 0 : a.length) > 0 && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: e.reasons.map((n, s) => /* @__PURE__ */ t.jsx("li", { children: n }, s)) })
  ] }) : null;
}
function Kt({ context: e }) {
  if (!e) return null;
  const { budget: a, category: n, project: s } = e, r = a != null && a.total ? a.remaining / a.total : 0, o = r >= 0.3 ? "positive" : r >= 0.1 ? "warning" : "critical";
  return /* @__PURE__ */ t.jsxs("section", { className: "grid grid-cols-1 gap-2", children: [
    /* @__PURE__ */ t.jsx(
      W,
      {
        label: l("Approval:Detail:BudgetRemaining", "Bütçe kalanı"),
        value: a && P(a.remaining, a.currency),
        hint: a && `${Math.round(r * 100)}% / ${P(a.total, a.currency)}`,
        variant: o
      }
    ),
    /* @__PURE__ */ t.jsx(
      W,
      {
        label: l(
          "Approval:Detail:CategoryThisMonth",
          "{0} — bu ay",
          (n == null ? void 0 : n.label) ?? l("Common:Category", "Kategori")
        ),
        value: n && P(n.spentMonth, (a == null ? void 0 : a.currency) ?? "TRY")
      }
    ),
    /* @__PURE__ */ t.jsx(
      W,
      {
        label: l("Common:Project", "Proje"),
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
const Gt = Q.WidthProvider(Q.Responsive), Ot = {
  "budget-health": Ze,
  "cash-flow": at,
  "income-expense": It,
  "pending-approvals": lt,
  "risk-alerts": pt,
  "ai-suggestions": At,
  "kpi-strip": Et
};
function $t() {
  const [e, a] = g.useState(() => Fe()), [n, s] = g.useState(!1), [r, o] = g.useState(null), [d, i] = g.useState(0);
  g.useEffect(() => {
    const p = requestAnimationFrame(() => i(1));
    return () => cancelAnimationFrame(p);
  }, []), g.useEffect(() => {
    if (typeof window > "u") return;
    const p = new URLSearchParams(window.location.search), y = p.get("approval");
    if (!y) return;
    o(y), p.delete("approval");
    const w = window.location.pathname + (p.toString() ? `?${p}` : "") + window.location.hash;
    window.history.replaceState(null, "", w);
  }, []);
  const u = g.useMemo(() => {
    const p = H[e] ?? H.cfo, y = We(e);
    return y ? { ...p, ...y } : p;
  }, [e]), c = g.useCallback((p) => {
    a(p), Be(p);
  }, []), x = g.useCallback(
    (p, y) => {
      n && He(e, y);
    },
    [n, e]
  ), m = g.useCallback(() => {
    Ke(e), a(e);
  }, [e]), h = (u.desktop ?? []).map((p) => p.i);
  return /* @__PURE__ */ t.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ t.jsx(
      qt,
      {
        persona: e,
        onPersonaChange: c,
        editMode: n,
        onEditModeToggle: () => s((p) => !p),
        onReset: m
      }
    ),
    /* @__PURE__ */ t.jsx("main", { className: "px-4 py-4 mobile:px-2 mobile:py-2", children: /* @__PURE__ */ t.jsx(
      Gt,
      {
        className: v("apya-bento", n && "apya-bento--edit"),
        layouts: u,
        breakpoints: Pe,
        cols: Te,
        rowHeight: Ie,
        margin: _e,
        isDraggable: n,
        isResizable: n,
        draggableHandle: `.${S.DRAG_HANDLE_CLASS}`,
        onLayoutChange: x,
        compactType: "vertical",
        preventCollision: !1,
        children: h.map((p) => {
          const y = Ot[p];
          return y ? /* @__PURE__ */ t.jsx("div", { className: "apya-bento-item", children: /* @__PURE__ */ t.jsx(y, {}) }, p) : /* @__PURE__ */ t.jsx("div", { children: /* @__PURE__ */ t.jsx(S, { title: `Bilinmeyen widget: ${p}` }) }, p);
        })
      },
      d
    ) }),
    /* @__PURE__ */ t.jsx(
      Wt,
      {
        approvalId: r,
        open: !!r,
        onOpenChange: (p) => {
          p || o(null);
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
          /* @__PURE__ */ t.jsx("span", { children: l("Dashboard:EditMode:Hint", "Düzenleme modu — widget'ları sürükleyip yeniden boyutlandırabilirsin") }),
          /* @__PURE__ */ t.jsx(
            A,
            {
              variant: "ghost",
              size: "sm",
              className: "text-text-inverse hover:bg-white/10",
              onClick: () => s(!1),
              children: l("Common:Finish", "Bitir")
            }
          )
        ]
      }
    )
  ] });
}
function qt({ persona: e, onPersonaChange: a, editMode: n, onEditModeToggle: s, onReset: r }) {
  return /* @__PURE__ */ t.jsxs("header", { className: v(
    "sticky top-0 z-sticky",
    "bg-surface-raised/95 backdrop-blur-sm",
    "border-b border-default",
    "px-4 py-3",
    "flex items-center justify-between gap-4",
    "mobile:px-2 mobile:py-2"
  ), children: [
    /* @__PURE__ */ t.jsx("div", { className: "flex flex-col gap-0.5 min-w-0", children: /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-secondary truncate mobile:hidden", children: l(
      "Dashboard:PersonaView",
      "{0} görünümü",
      l(K[e].key, K[e].fallback)
    ) }) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      /* @__PURE__ */ t.jsx(Yt, { value: e, onChange: a }),
      n ? /* @__PURE__ */ t.jsx(
        A,
        {
          size: "sm",
          variant: "secondary",
          onClick: r,
          title: l("Dashboard:ResetLayout", "Layout'u persona varsayılanına döndür"),
          children: l("Common:Reset", "Sıfırla")
        }
      ) : null,
      /* @__PURE__ */ t.jsx(
        A,
        {
          size: "sm",
          variant: n ? "primary" : "secondary",
          onClick: s,
          children: n ? l("Common:Done", "Tamamla") : l("Common:Edit", "Düzenle")
        }
      )
    ] })
  ] });
}
function Yt({ value: e, onChange: a }) {
  return /* @__PURE__ */ t.jsxs("label", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ t.jsx("span", { className: "sr-only", children: l("Dashboard:SelectPersona", "Persona seç") }),
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
        children: Object.entries(K).map(([n, s]) => /* @__PURE__ */ t.jsx("option", { value: n, children: l(s.key, s.fallback) }, n))
      }
    )
  ] });
}
function Ut(e) {
  const { connection: a, state: n } = re(), s = Y();
  g.useEffect(() => {
    if (!a || !(e != null && e.length)) return;
    const r = e.map(([o, d]) => {
      const i = () => {
        d.forEach((u) => {
          s.invalidateQueries({ queryKey: u });
        });
      };
      return a.on(o, i), [o, i];
    });
    return () => {
      r.forEach(([o, d]) => {
        a.off(o, d);
      });
    };
  }, [a, n, s]);
}
function Vt(e) {
  const { connection: a, state: n } = re(), s = Y(), r = ae();
  g.useEffect(() => {
    if (!a || !(e != null && e.length)) return;
    const o = e.map(([d, i]) => {
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
                (f) => s.invalidateQueries({ queryKey: f })
              );
            }
          }
        });
      };
      return a.on(d, u), [d, u];
    });
    return () => {
      o.forEach(([d, i]) => a.off(d, i));
    };
  }, [a, n, s]);
}
function Qt() {
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
  return Ut(e), Vt(a), null;
}
ve();
const te = document.getElementById("apya-dashboard-root");
te && he(te).render(
  /* @__PURE__ */ t.jsx(be, { children: /* @__PURE__ */ t.jsx(Ee, { children: /* @__PURE__ */ t.jsx(je, { children: /* @__PURE__ */ t.jsx(we, { children: /* @__PURE__ */ t.jsxs(Re, { children: [
    /* @__PURE__ */ t.jsx(Qt, {}),
    /* @__PURE__ */ t.jsx($t, {})
  ] }) }) }) }) })
);
