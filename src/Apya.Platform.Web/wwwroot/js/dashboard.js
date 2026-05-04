import { r as h, j as t, e as D, d as de } from "./react-vendor.js";
import { B as k, c as p, S as w, C as ue, a as me, b as xe, d as fe, e as A, Q as g, f as Z, g as B, u as ee, A as he, h as C, i as I, j as G, T as ge, r as pe, k as ye, l as be, m as ve } from "./registerServiceWorker.js";
import { H as te, a as je, L as we } from "./signalr-vendor.js";
import { r as W } from "./grid-vendor.js";
import { u as z, a as $, b as ke } from "./query-vendor.js";
/* empty css      */
const ae = h.createContext({
  connection: null,
  state: te.Disconnected
});
function Ne({ hubUrl: e = "/signalr-hubs/notifications", children: a, enabled: s = !0 }) {
  const [n, l] = h.useState(te.Disconnected), r = h.useRef(null);
  h.useEffect(() => {
    if (!s || typeof window > "u") return;
    const i = new je().withUrl(e, { withCredentials: !0 }).withAutomaticReconnect([0, 2e3, 5e3, 1e4, 3e4]).configureLogging(we.Warning).build();
    r.current = i, l(i.state);
    const m = () => l(i.state);
    return i.onreconnecting(m), i.onreconnected(m), i.onclose(m), i.start().then(m).catch((d) => {
      console.warn("[SignalR] connect failed:", d == null ? void 0 : d.message), m();
    }), () => {
      i.stop().catch(() => {
      }), r.current = null;
    };
  }, [e, s]);
  const u = h.useMemo(() => ({
    get connection() {
      return r.current;
    },
    state: n
  }), [n]);
  return /* @__PURE__ */ t.jsx(ae.Provider, { value: u, children: a });
}
function se() {
  return h.useContext(ae);
}
const _ = {
  triage: "(min-width: 768px)",
  analysis: "(min-width: 1280px)",
  command: "(min-width: 1920px)"
};
function Ae() {
  return typeof window > "u" || !window.matchMedia ? "analysis" : window.matchMedia(_.command).matches ? "command" : window.matchMedia(_.analysis).matches ? "analysis" : window.matchMedia(_.triage).matches ? "triage" : "decision";
}
const ne = h.createContext(null);
function Se({ children: e, override: a }) {
  const s = h.useCallback((r) => {
    if (typeof window > "u" || !window.matchMedia) return () => {
    };
    const u = Object.values(_).map((i) => window.matchMedia(i));
    return u.forEach((i) => i.addEventListener("change", r)), () => u.forEach((i) => i.removeEventListener("change", r));
  }, []), n = h.useSyncExternalStore(s, Ae, () => "analysis"), l = a ?? n;
  return h.useEffect(() => {
    typeof document > "u" || (document.documentElement.dataset.deviceMode = l);
  }, [l]), /* @__PURE__ */ t.jsx(ne.Provider, { value: l, children: e });
}
function Re() {
  const e = h.useContext(ne);
  if (e === null)
    throw new Error("useDeviceMode must be used within <DeviceModeProvider>.");
  return e;
}
const Ee = {
  desktop: [
    { i: "budget-health", x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "cash-flow", x: 6, y: 0, w: 6, h: 2, minW: 4, minH: 2 },
    { i: "risk-alerts", x: 6, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "pending-approvals", x: 0, y: 4, w: 6, h: 4, minW: 4, minH: 3 },
    /* AI inbox tam genişlik altta — sessiz feed, kullanıcı iner görür. */
    { i: "ai-suggestions", x: 0, y: 8, w: 12, h: 4, minW: 6, minH: 3 }
  ],
  tablet: [
    { i: "budget-health", x: 0, y: 0, w: 8, h: 4, minW: 4, minH: 3 },
    { i: "cash-flow", x: 0, y: 4, w: 8, h: 2, minW: 4, minH: 2 },
    { i: "risk-alerts", x: 0, y: 6, w: 8, h: 4, minW: 4, minH: 3 },
    { i: "pending-approvals", x: 0, y: 10, w: 8, h: 4, minW: 4, minH: 3 },
    { i: "ai-suggestions", x: 0, y: 14, w: 8, h: 4, minW: 4, minH: 3 }
  ],
  mobile: [
    { i: "budget-health", x: 0, y: 0, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "cash-flow", x: 0, y: 4, w: 1, h: 2, isResizable: !1, isDraggable: !1 },
    { i: "risk-alerts", x: 0, y: 6, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "pending-approvals", x: 0, y: 10, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "ai-suggestions", x: 0, y: 14, w: 1, h: 4, isResizable: !1, isDraggable: !1 }
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
}, F = {
  cfo: Ee,
  pm: De,
  field: ze
}, ie = {
  cfo: "CFO / Finansman",
  pm: "Proje Yöneticisi",
  field: "Saha Kullanıcısı"
}, Le = {
  desktop: 1280,
  tablet: 768,
  mobile: 0
}, Me = {
  desktop: 12,
  tablet: 8,
  mobile: 1
}, Ce = 64, _e = [12, 12], re = "apya-dashboard-persona", H = "apya-dashboard-layout-overrides";
function Ie() {
  if (typeof window > "u") return "cfo";
  try {
    const e = window.localStorage.getItem(re);
    if (e && F[e]) return e;
  } catch {
  }
  return "cfo";
}
function Pe(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(re, e);
    } catch {
    }
}
function Te(e) {
  if (typeof window > "u") return null;
  try {
    const a = window.localStorage.getItem(`${H}-${e}`);
    return a ? JSON.parse(a) : null;
  } catch {
    return null;
  }
}
function Be(e, a) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(
        `${H}-${e}`,
        JSON.stringify(a)
      );
    } catch {
    }
}
function Fe(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.removeItem(`${H}-${e}`);
    } catch {
    }
}
function Ke({
  holdMs: e = 200,
  onConfirm: a,
  children: s,
  className: n,
  disabled: l,
  isLoading: r,
  ...u
}) {
  const [i, m] = h.useState(0), d = h.useRef(0), x = h.useRef(0), f = e <= 0, o = h.useCallback(() => {
    cancelAnimationFrame(d.current), d.current = 0, x.current = 0, m(0);
  }, []), c = h.useCallback(() => {
    if (!x.current) return;
    const y = performance.now() - x.current, N = Math.min(y / e, 1);
    m(N), N >= 1 ? (o(), a == null || a()) : d.current = requestAnimationFrame(c);
  }, [e, a, o]), b = h.useCallback((y) => {
    l || r || f || y.button !== void 0 && y.button !== 0 || (x.current = performance.now(), d.current = requestAnimationFrame(c));
  }, [l, r, f, c]);
  return h.useEffect(() => () => cancelAnimationFrame(d.current), []), f ? /* @__PURE__ */ t.jsx(
    k,
    {
      onClick: a,
      disabled: l,
      isLoading: r,
      className: n,
      ...u,
      children: s
    }
  ) : /* @__PURE__ */ t.jsxs(
    k,
    {
      disabled: l,
      isLoading: r,
      onPointerDown: b,
      onPointerUp: o,
      onPointerLeave: o,
      onPointerCancel: o,
      onBlur: o,
      onClick: (y) => {
        y.detail === 0 ? a == null || a() : y.preventDefault();
      },
      className: p("relative overflow-hidden", n),
      ...u,
      children: [
        /* @__PURE__ */ t.jsx(
          "span",
          {
            className: p(
              "absolute inset-y-0 left-0 bg-white/25 pointer-events-none",
              "transition-[width] duration-[40ms] ease-linear"
            ),
            style: { width: `${i * 100}%` },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ t.jsx("span", { className: "relative", children: s })
      ]
    }
  );
}
function O({ className: e, withDelta: a = !0, withBar: s = !1 }) {
  return /* @__PURE__ */ t.jsxs("div", { className: p("flex flex-col gap-3 h-full", e), "aria-busy": "true", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-baseline gap-2", children: [
      /* @__PURE__ */ t.jsx(w, { width: 140, height: 32, rounded: "md" }),
      /* @__PURE__ */ t.jsx(w, { width: 70, height: 16, rounded: "sm" })
    ] }),
    a && /* @__PURE__ */ t.jsx(w, { width: 180, height: 12, rounded: "sm" }),
    s && /* @__PURE__ */ t.jsx(w, { height: 6, rounded: "full" })
  ] });
}
function $e({ className: e, height: a = 64 }) {
  const s = [0.4, 0.55, 0.45, 0.7, 0.6, 0.8, 0.65, 0.85, 0.75, 0.9, 0.7, 0.95];
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      className: p("flex items-end justify-between gap-1 w-full", e),
      style: { height: a },
      "aria-busy": "true",
      children: s.map((n, l) => /* @__PURE__ */ t.jsx(
        w,
        {
          height: `${n * 100}%`,
          className: "flex-1 min-w-0",
          rounded: "sm"
        },
        l
      ))
    }
  );
}
function q({ rows: e = 4, withLeading: a = !0, withTrailing: s = !0, className: n }) {
  return /* @__PURE__ */ t.jsx("ul", { className: p("flex flex-col gap-2", n), "aria-busy": "true", children: Array.from({ length: e }).map((l, r) => /* @__PURE__ */ t.jsxs(
    "li",
    {
      className: "flex items-center gap-3 p-2 rounded-md border border-subtle bg-surface-base",
      children: [
        a && /* @__PURE__ */ t.jsx(w, { width: 32, height: 32, rounded: "md" }),
        /* @__PURE__ */ t.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
          /* @__PURE__ */ t.jsx(w, { height: 12, className: r % 2 === 0 ? "w-3/4" : "w-2/3" }),
          /* @__PURE__ */ t.jsx(w, { height: 10, className: "w-1/2" })
        ] }),
        s && /* @__PURE__ */ t.jsx(w, { width: 64, height: 12, rounded: "sm" })
      ]
    },
    r
  )) });
}
const Y = {
  default: { ring: "bg-neutral-100 text-neutral-500", text: "text-text-tertiary" },
  success: { ring: "bg-positive-50 text-positive-600", text: "text-text-secondary" },
  info: { ring: "bg-brand-50 text-brand-600", text: "text-text-secondary" }
};
function P({
  icon: e,
  title: a,
  description: s,
  action: n,
  /* ReactNode — Button, link vs. */
  variant: l = "default",
  compact: r = !1,
  /* compact: ikonu küçült, padding düşür — Bento widget için */
  className: u
}) {
  const i = Y[l] ?? Y.default;
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      role: "status",
      "aria-live": "polite",
      className: p(
        "flex flex-col items-center justify-center text-center",
        r ? "gap-2 py-3" : "gap-3 py-6",
        u
      ),
      children: [
        e && /* @__PURE__ */ t.jsx(
          "span",
          {
            className: p(
              "inline-flex items-center justify-center rounded-full",
              i.ring,
              r ? "h-8 w-8" : "h-12 w-12"
            ),
            "aria-hidden": "true",
            children: e
          }
        ),
        a && /* @__PURE__ */ t.jsx("p", { className: p(
          "font-medium text-text-primary",
          r ? "text-sm" : "text-base"
        ), children: a }),
        s && /* @__PURE__ */ t.jsx("p", { className: p("max-w-sm", i.text, r ? "text-xs" : "text-sm"), children: s }),
        n && /* @__PURE__ */ t.jsx("div", { className: "mt-1", children: n })
      ]
    }
  );
}
const le = {
  /* react-grid-layout drag handle'ı için class — yalnızca header'dan sürüklenir */
  DRAG_HANDLE_CLASS: "widget-drag-handle"
};
function S({
  title: e,
  subtitle: a,
  badge: s,
  actions: n,
  /* sağ üstteki action button'lar */
  isLoading: l = !1,
  isError: r = !1,
  errorMessage: u,
  onRetry: i,
  isEmpty: m = !1,
  emptyMessage: d,
  /* legacy: tek satır metin; yeni kod emptyState kullanmalı */
  emptyState: x,
  /* yeni: <EmptyState .../> ReactNode */
  skeleton: f,
  /* yeni: shape-aware loading state — ReactNode */
  isFetching: o = !1,
  /* React Query background refetch */
  isStale: c = !1,
  /* React Query staleTime aşıldı */
  dataUpdatedAt: b,
  /* number (ms) | Date | undefined — son başarılı fetch */
  density: y = "compact",
  children: N,
  className: E
}) {
  const L = !l && !r && c && o;
  return /* @__PURE__ */ t.jsxs(ue, { variant: "default", className: p("h-full flex flex-col", E), children: [
    /* @__PURE__ */ t.jsxs(
      me,
      {
        density: y,
        className: p(
          le.DRAG_HANDLE_CLASS,
          "cursor-grab active:cursor-grabbing select-none",
          "flex-row items-center justify-between flex-none"
        ),
        children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0 flex-1", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ t.jsx(xe, { className: "text-sm font-semibold truncate", children: e }),
              s,
              L && /* @__PURE__ */ t.jsx(Ge, {})
            ] }),
            a && /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary truncate", children: a })
          ] }),
          n && /* @__PURE__ */ t.jsx(
            "div",
            {
              className: "flex items-center gap-1 flex-none",
              onMouseDown: (M) => M.stopPropagation(),
              onTouchStart: (M) => M.stopPropagation(),
              children: n
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ t.jsxs(fe, { density: y, className: "flex-1 overflow-auto", children: [
      r && /* @__PURE__ */ t.jsx(
        qe,
        {
          message: u,
          onRetry: i,
          dataUpdatedAt: b
        }
      ),
      !r && l && (f ?? /* @__PURE__ */ t.jsx(He, { density: y })),
      !r && !l && m && (x ?? /* @__PURE__ */ t.jsx(Oe, { message: d })),
      !r && !l && !m && N
    ] })
  ] });
}
function He({ density: e }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3", "aria-busy": "true", children: [
    /* @__PURE__ */ t.jsx(w, { height: e === "spacious" ? 48 : 32, className: "w-1/3" }),
    /* @__PURE__ */ t.jsx(w, { height: 16 }),
    /* @__PURE__ */ t.jsx(w, { height: 16, className: "w-5/6" }),
    /* @__PURE__ */ t.jsx(w, { height: 16, className: "w-3/4" })
  ] });
}
function Oe({ message: e }) {
  return /* @__PURE__ */ t.jsx(
    P,
    {
      compact: !0,
      title: e ?? "Görüntülenecek veri yok",
      description: "Yeni veri girildiğinde burada görünecek."
    }
  );
}
function qe({ message: e, onRetry: a, dataUpdatedAt: s }) {
  const n = We(s);
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col items-center justify-center text-center gap-2 py-4", children: [
    /* @__PURE__ */ t.jsx(A, { variant: "negative", withDot: !0, children: "Yüklenemedi" }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-secondary max-w-xs", children: e || "Veri alınırken bir hata oluştu." }),
    n && /* Son başarılı snapshot — kullanıcı "veri ne kadar eski" bilsin.
    Critical UX: kullanıcı kararlarını eski veriyle vermesin diye. */
    /* @__PURE__ */ t.jsxs("p", { className: "text-xs text-text-tertiary", children: [
      "Son başarılı güncelleme: ",
      n
    ] }),
    a && /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: a,
        className: p(
          "text-sm text-text-link underline-offset-2 hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: "Tekrar dene"
      }
    )
  ] });
}
function Ge() {
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
function We(e) {
  if (e == null) return null;
  const a = e instanceof Date ? e.getTime() : Number(e);
  if (!Number.isFinite(a)) return null;
  const s = Math.round((a - Date.now()) / 1e3), n = Math.abs(s), l = new Intl.RelativeTimeFormat("tr-TR", { numeric: "auto" });
  return n < 60 ? l.format(s, "second") : n < 3600 ? l.format(Math.round(s / 60), "minute") : n < 86400 ? l.format(Math.round(s / 3600), "hour") : l.format(Math.round(s / 86400), "day");
}
S.DRAG_HANDLE_CLASS = le.DRAG_HANDLE_CLASS;
const Q = 250, Ye = 450;
function j(e = Q + Math.random() * (Ye - Q)) {
  return new Promise((a) => setTimeout(a, e));
}
const v = {
  async budgetSummary() {
    return await j(), {
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
    return await j(), {
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
  async pendingApprovals() {
    return await j(), [
      { id: "inv-001", type: "invoice", title: "TÜBİTAK 1501 — Eylül faturası", requester: "Ahmet Yıldız", amount: 12450, currency: "TRY", ageHours: 4 },
      { id: "exp-002", type: "expense", title: "Yazılım lisansı — JetBrains All", requester: "Mehmet Kaya", amount: 8240, currency: "TRY", ageHours: 18 },
      { id: "po-003", type: "po", title: "Bulut hosting (Q3 yenileme)", requester: "Zeynep Aksoy", amount: 24900, currency: "TRY", ageHours: 36 },
      { id: "inv-004", type: "invoice", title: "KOSGEB danışmanlık — Ağustos", requester: "Selin Aydın", amount: 6800, currency: "TRY", ageHours: 52 }
    ];
  },
  /* Tek bir onay kaydı + zenginleştirilmiş context (push notification deep-link
     senaryosu — APYA-108). Liste API'sinden bağımsız endpoint. */
  async fetchApproval(e) {
    await j(280);
    const s = (await this.pendingApprovals()).find((n) => n.id === e);
    if (!s) {
      const n = new Error("Onay bulunamadı veya başka kullanıcıca işlendi.");
      throw n.status = 404, n;
    }
    return {
      ...s,
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
        category: { spentMonth: 14200, label: s.type === "expense" ? "Yazılım" : "Operasyon" },
        project: { name: "KOSGEB Ar-Ge", code: "PRJ-2026-014" }
      }
    };
  },
  async approveItem(e) {
    if (await j(600), Math.random() < 0.05) {
      const a = new Error("Bu kayıt başka bir kullanıcı tarafından onaylanmış.");
      throw a.status = 409, a;
    }
    return { id: e.id, status: "approved" };
  },
  async rejectItem(e) {
    return await j(400), { id: e.id, status: "rejected" };
  },
  async riskAlerts() {
    return await j(), [
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
    return await j(300), { id: e.id, dismissed: !0 };
  },
  async acceptRisk(e) {
    return await j(500), { id: e.id, accepted: !0 };
  },
  /* AI suggestion inbox — dashboard widget'ı için top-N öneri.
     Risk alerts'ten ayrı: risk = "neye dikkat", suggestion = "ne yap".
     Tone: opportunity | warning | critical | neutral */
  async aiSuggestions() {
    return await j(), [
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
    if (await j(500), Math.random() < 0.03) {
      const a = new Error("Bu öneri başka bir kullanıcı tarafından uygulanmış.");
      throw a.status = 409, a;
    }
    return { id: e.id, applied: !0 };
  },
  async snoozeSuggestion(e) {
    return await j(250), { id: e.id, snoozed: !0, until: new Date(Date.now() + 7 * 864e5).toISOString() };
  },
  async dismissSuggestion(e, a = "irrelevant") {
    return await j(250), { id: e.id, dismissed: !0, reason: a };
  }
}, Qe = () => v.budgetSummary();
function Ve() {
  return z({
    queryKey: g.dashboard.budget(),
    queryFn: Qe
  });
}
function Ue() {
  const { data: e, isLoading: a, isError: s, isFetching: n, isStale: l, dataUpdatedAt: r, refetch: u } = Ve(), i = () => u(), m = e ? e.spent / e.budget * 100 : 0, d = V(m), x = e ? Z(e.deltaPct) : null;
  return /* @__PURE__ */ t.jsx(
    S,
    {
      title: "Bütçe Sağlığı",
      subtitle: "Tüm aktif projeler — bu ay",
      badge: /* @__PURE__ */ t.jsx(A, { variant: d.badgeVariant, size: "sm", withDot: !0, children: d.label }),
      isLoading: a,
      isError: s,
      isFetching: n,
      isStale: l,
      dataUpdatedAt: r,
      onRetry: i,
      skeleton: /* @__PURE__ */ t.jsx(O, { withDelta: !0, withBar: !0 }),
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-baseline gap-2 font-tabular", children: [
          /* @__PURE__ */ t.jsx("span", { className: "text-3xl font-semibold tracking-tight", children: B(e.spent, e.currency) }),
          /* @__PURE__ */ t.jsxs("span", { className: "text-sm text-text-tertiary", children: [
            "/ ",
            B(e.budget, e.currency)
          ] })
        ] }),
        x && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1.5 text-xs", children: [
          /* @__PURE__ */ t.jsxs("span", { className: p(
            "inline-flex items-center gap-1 font-medium font-tabular",
            /* delta < 0 = harcama düşmüş = pozitif sinyal */
            e.deltaPct < 0 ? "text-text-positive" : "text-text-negative"
          ), children: [
            x.symbol,
            " ",
            x.text
          ] }),
          /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: "geçen aya göre" })
        ] }),
        /* @__PURE__ */ t.jsx(Je, { value: m, variant: d.barVariant }),
        /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-1.5 mt-1 overflow-y-auto", children: e.breakdown.map((f) => /* @__PURE__ */ t.jsxs(
          "li",
          {
            className: "flex items-center justify-between text-xs gap-3",
            children: [
              /* @__PURE__ */ t.jsx("span", { className: "truncate text-text-secondary", children: f.project }),
              /* @__PURE__ */ t.jsxs("span", { className: p(
                "font-tabular font-medium",
                V(f.ratio * 100).textVariant
              ), children: [
                Math.round(f.ratio * 100),
                "%"
              ] })
            ]
          },
          f.project
        )) })
      ] })
    }
  );
}
function V(e) {
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
function Je({ value: e, variant: a = "positive" }) {
  const s = {
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
          className: p(
            s,
            "h-full rounded-full transition-all duration-slow ease-standard"
          ),
          style: { width: `${Math.min(e, 100)}%` }
        }
      )
    }
  );
}
const Xe = () => v.cashFlow();
function Ze() {
  return z({
    queryKey: g.dashboard.cashflow(),
    queryFn: Xe
  });
}
function et() {
  const { data: e, isLoading: a, isError: s, isFetching: n, isStale: l, dataUpdatedAt: r, refetch: u } = Ze(), i = () => u(), m = e ? Z(e.deltaPct) : null, d = e ? e.deltaPct >= 0 : !0;
  return /* @__PURE__ */ t.jsx(
    S,
    {
      title: "Nakit Akışı",
      subtitle: "Son 30 gün",
      isLoading: a,
      isError: s,
      isFetching: n,
      isStale: l,
      dataUpdatedAt: r,
      onRetry: i,
      skeleton: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-4 h-full", children: [
        /* @__PURE__ */ t.jsx(O, { className: "flex-none" }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx($e, { height: 64 }) })
      ] }),
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-4 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 flex-none", children: [
          /* @__PURE__ */ t.jsx("div", { className: "text-2xl font-semibold tracking-tight font-tabular", children: B(e.netCurrent, e.currency) }),
          m && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 text-xs", children: [
            /* @__PURE__ */ t.jsxs("span", { className: p(
              "inline-flex items-center gap-1 font-medium font-tabular",
              d ? "text-text-positive" : "text-text-negative"
            ), children: [
              m.symbol,
              " ",
              m.text
            ] }),
            /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: "vs önceki dönem" })
          ] })
        ] }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx(tt, { series: e.series, variant: d ? "positive" : "negative" }) })
      ] })
    }
  );
}
function tt({ series: e, variant: a = "positive" }) {
  const n = `cashflow-grad-${h.useId().replace(/:/g, "")}`;
  if (!e || e.length < 2) return null;
  const l = 100, r = 40, u = Math.min(...e), m = Math.max(...e) - u || 1, x = e.map((c, b) => {
    const y = b / (e.length - 1) * l, N = r - (c - u) / m * r;
    return [y, N];
  }).map(([c, b], y) => `${y === 0 ? "M" : "L"} ${c.toFixed(2)} ${b.toFixed(2)}`).join(" "), f = `${x} L ${l} ${r} L 0 ${r} Z`, o = a === "positive" ? "var(--apya-positive-500)" : "var(--apya-negative-500)";
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      viewBox: `0 0 ${l} ${r}`,
      preserveAspectRatio: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ t.jsx("defs", { children: /* @__PURE__ */ t.jsxs("linearGradient", { id: n, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ t.jsx("stop", { offset: "0%", stopColor: o, stopOpacity: "0.25" }),
          /* @__PURE__ */ t.jsx("stop", { offset: "100%", stopColor: o, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ t.jsx("path", { d: f, fill: `url(#${n})` }),
        /* @__PURE__ */ t.jsx(
          "path",
          {
            d: x,
            fill: "none",
            stroke: o,
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
const at = (e, a) => (e ?? []).filter((s) => s.id !== (a == null ? void 0 : a.id));
function R({
  queryKey: e,
  mutationFn: a,
  /* Mutation arg'ı liste'deki hedef row'a nasıl eşlenir? Default: arg = row */
  extractTarget: s = (d) => d,
  /* Optimistic cache transform — default: id eşleşen row'u sil */
  transform: n = at,
  /* Side-effect query'leri — onSettled'da invalidate edilir */
  extraInvalidations: l = [],
  /* Başarı toast'i (undo destekli). undoFn varsa "Geri al" gösterilir. */
  undoMessage: r,
  /* (target) => string  | undefined */
  undoFn: u,
  /* (target) => Promise | undefined */
  /* Hata toast'leri — varsayılan generic mesajlar */
  errorMessage: i = "İşlem başarısız oldu",
  conflictMessage: m = "Bu kayıt başka bir kullanıcı tarafından değiştirildi"
}) {
  const d = $(), x = ee();
  return ke({
    mutationFn: a,
    onMutate: async (f) => {
      const o = s(f);
      await d.cancelQueries({ queryKey: e });
      const c = d.getQueryData(e);
      return d.setQueryData(e, (b) => n(b, o, f)), { previous: c, target: o };
    },
    onError: (f, o, c) => {
      (c == null ? void 0 : c.previous) !== void 0 && d.setQueryData(e, c.previous), (f instanceof he ? f.status === 409 : (f == null ? void 0 : f.status) === 409) ? x.warning(m, {
        description: "Veriyi tazeleyip tekrar deneyebilirsin.",
        action: { label: "Yenile", onClick: () => d.invalidateQueries({ queryKey: e }) }
      }) : x.error(i, {
        description: f == null ? void 0 : f.message
      });
    },
    onSuccess: (f, o, c) => {
      if (!u || !r) return;
      const b = (c == null ? void 0 : c.target) ?? s(o), y = typeof r == "function" ? r(b) : r;
      x.success(y, {
        action: {
          label: "Geri al",
          onClick: () => {
            d.setQueryData(e, c == null ? void 0 : c.previous), Promise.resolve(u(b)).catch((N) => {
              x.error("Geri alınamadı", { description: N == null ? void 0 : N.message }), d.invalidateQueries({ queryKey: e });
            });
          }
        }
      });
    },
    onSettled: () => {
      d.invalidateQueries({ queryKey: e }), l.forEach((f) => d.invalidateQueries({ queryKey: f }));
    }
  });
}
const st = () => v.pendingApprovals();
function nt() {
  return z({
    queryKey: g.dashboard.approvals(),
    queryFn: st
  });
}
function it(e) {
  return z({
    queryKey: g.dashboard.approvalDetail(e),
    queryFn: () => v.fetchApproval(e),
    enabled: !!e,
    /* Detail kullanıcı sheet'i kapatınca refetch'e gerek yok */
    staleTime: 6e4
  });
}
function oe() {
  return R({
    queryKey: g.dashboard.approvals(),
    mutationFn: (e) => v.approveItem(e),
    extraInvalidations: [g.dashboard.budget(), g.dashboard.cashflow()],
    undoMessage: (e) => `${e.title} onaylandı`,
    undoFn: (e) => v.rejectItem(e),
    /* "geri al" = ters yöne kaydet */
    errorMessage: "Onay başarısız oldu"
  });
}
function ce() {
  return R({
    queryKey: g.dashboard.approvals(),
    mutationFn: (e) => v.rejectItem(e),
    extraInvalidations: [g.dashboard.budget(), g.dashboard.cashflow()],
    undoMessage: (e) => `${e.title} reddedildi`,
    undoFn: (e) => v.approveItem(e),
    errorMessage: "Reddetme başarısız oldu"
  });
}
const U = {
  invoice: { label: "Fatura", variant: "brand" },
  expense: { label: "Masraf", variant: "neutral" },
  po: { label: "Sipariş", variant: "ai" }
};
function rt() {
  const { data: e, isLoading: a, isError: s, isFetching: n, isStale: l, dataUpdatedAt: r, refetch: u } = nt(), i = oe(), m = ce(), d = () => u(), x = (c) => i.mutateAsync(c).catch(() => {
  }), f = (c) => m.mutateAsync(c).catch(() => {
  }), o = (e == null ? void 0 : e.length) ?? 0;
  return /* @__PURE__ */ t.jsx(
    S,
    {
      title: "Onay Bekleyenler",
      subtitle: o > 0 ? `${o} kalem inceleme bekliyor` : void 0,
      badge: o > 0 && /* @__PURE__ */ t.jsx(A, { variant: "warning", size: "sm", withDot: !0, children: o }),
      isLoading: a,
      isError: s,
      isFetching: n,
      isStale: l,
      dataUpdatedAt: r,
      onRetry: d,
      skeleton: /* @__PURE__ */ t.jsx(q, { rows: 4 }),
      isEmpty: !a && !s && o === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        P,
        {
          compact: !0,
          variant: "success",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✓" }),
          title: "Hepsi tamam",
          description: "Bugün karar bekleyen kalmadı."
        }
      ),
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: e == null ? void 0 : e.map((c) => /* @__PURE__ */ t.jsx(
        lt,
        {
          item: c,
          onApprove: x,
          onReject: f
        },
        c.id
      )) })
    }
  );
}
function lt({ item: e, onApprove: a, onReject: s }) {
  const [n, l] = D.useState(null), r = U[e.type] ?? U.expense, u = ot(e.ageHours), i = async (m, d) => {
    if (!n) {
      l(m);
      try {
        await (d == null ? void 0 : d(e));
      } finally {
        l(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsxs("li", { className: p(
    "flex items-center gap-3 p-2.5 rounded-md",
    "bg-surface-base border border-subtle",
    "transition-opacity duration-fast",
    n && "opacity-60"
  ), children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 min-w-0 flex-1", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(A, { variant: r.variant, size: "sm", children: r.label }),
        /* @__PURE__ */ t.jsxs("span", { className: "text-xs text-text-tertiary truncate", children: [
          e.requester,
          " · ",
          u
        ] })
      ] }),
      /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary truncate", children: e.title })
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "font-tabular font-semibold text-sm text-text-primary flex-none", children: C(e.amount, e.currency) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 flex-none", children: [
      /* @__PURE__ */ t.jsx(
        k,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => i("reject", s),
          isLoading: n === "reject",
          "aria-label": `${e.title} reddet`,
          className: "text-text-negative hover:bg-negative-50 hover:text-negative-700",
          children: "Reddet"
        }
      ),
      /* @__PURE__ */ t.jsx(
        k,
        {
          size: "sm",
          variant: "primary",
          onClick: () => i("approve", a),
          isLoading: n === "approve",
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
const J = {
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
  confidence: s,
  /* 0-1 ya da 0-100 */
  confidenceLabel: n,
  /* opsiyonel custom label; yoksa otomatik band */
  tone: l = "neutral",
  badge: r,
  /* opsiyonel custom badge; yoksa "AI" rozetı */
  primaryActionLabel: u = "Uygula",
  onApply: i,
  onSnooze: m,
  onDismiss: d,
  pending: x,
  /* 'apply' | 'snooze' | 'dismiss' | null */
  className: f,
  children: o
  /* ekstra içerik — örn. before/after diff snippet */
}) {
  const [c, b] = D.useState(!1), y = J[l] ?? J.neutral, N = Array.isArray(a) && a.length > 0, E = !!x;
  return /* @__PURE__ */ t.jsxs(
    "article",
    {
      className: p(
        "rounded-md border bg-surface-base",
        "transition-opacity duration-fast",
        y.border,
        E && "opacity-60",
        f
      ),
      "data-suggestion-tone": l,
      children: [
        y.ribbon && /* Tone ribbon — sade renk şeridi; arka planı ezmeden tonu işaret eder */
        /* @__PURE__ */ t.jsx("div", { className: p("h-1 rounded-t-md", y.ribbon), "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsxs("div", { className: "p-3 flex flex-col gap-2", children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            r ?? /* @__PURE__ */ t.jsx(A, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
            /* @__PURE__ */ t.jsx(I, { score: s, label: n, size: "md" })
          ] }),
          /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug text-balance", children: e }),
          o,
          N && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx(
              "button",
              {
                type: "button",
                onClick: () => b((L) => !L),
                "aria-expanded": c,
                className: p(
                  "self-start text-xs text-text-link hover:underline",
                  "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
                ),
                children: c ? "Açıklamayı gizle" : "Neden bu öneri?"
              }
            ),
            c && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: a.map((L, M) => /* @__PURE__ */ t.jsx("li", { children: L }, M)) })
          ] }),
          /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
            d && /* @__PURE__ */ t.jsx(
              k,
              {
                size: "sm",
                variant: "ghost",
                onClick: d,
                isLoading: x === "dismiss",
                disabled: E && x !== "dismiss",
                children: "İlgisiz"
              }
            ),
            m && /* @__PURE__ */ t.jsx(
              k,
              {
                size: "sm",
                variant: "ghost",
                onClick: m,
                isLoading: x === "snooze",
                disabled: E && x !== "snooze",
                children: "Sonra"
              }
            ),
            i && /* @__PURE__ */ t.jsx(
              k,
              {
                size: "sm",
                variant: l === "critical" ? "destructive" : "primary",
                onClick: i,
                isLoading: x === "apply",
                disabled: E && x !== "apply",
                children: u
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
  return z({
    queryKey: g.dashboard.risks(),
    queryFn: dt
  });
}
function mt() {
  return R({
    queryKey: g.dashboard.risks(),
    mutationFn: (e) => v.dismissRisk(e),
    errorMessage: "Uyarı reddedilemedi"
  });
}
function xt() {
  return R({
    queryKey: g.dashboard.risks(),
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
function ft() {
  const { data: e, isLoading: a, isError: s, isFetching: n, isStale: l, dataUpdatedAt: r, refetch: u } = ut(), i = mt(), m = xt(), d = () => u(), x = (c) => i.mutateAsync(c).catch(() => {
  }), f = (c) => m.mutateAsync(c).catch(() => {
  }), o = D.useMemo(
    () => [...e ?? []].sort(
      (c, b) => K[c.severity].priority - K[b.severity].priority
    ),
    [e]
  );
  return /* @__PURE__ */ t.jsx(
    S,
    {
      title: "Risk Uyarıları",
      subtitle: "AI öneri motoru",
      badge: /* @__PURE__ */ t.jsx(A, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
      isLoading: a,
      isError: s,
      isFetching: n,
      isStale: l,
      dataUpdatedAt: r,
      onRetry: d,
      skeleton: /* @__PURE__ */ t.jsx(q, { rows: 3, withTrailing: !1 }),
      isEmpty: !a && !s && o.length === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        P,
        {
          compact: !0,
          variant: "success",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✓" }),
          title: "Görünen risk yok",
          description: "AI motoru taramayı tamamladı. Yeni veri geldikçe burada görünecek."
        }
      ),
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: o.map((c) => /* @__PURE__ */ t.jsx(
        ht,
        {
          risk: c,
          onAccept: f,
          onDismiss: x
        },
        c.id
      )) })
    }
  );
}
function ht({ risk: e, onAccept: a, onDismiss: s }) {
  const [n, l] = D.useState(!1), [r, u] = D.useState(null), i = K[e.severity], m = async (d, x) => {
    if (!r) {
      u(d);
      try {
        await (x == null ? void 0 : x(e));
      } finally {
        u(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsx("li", { className: p(
    "rounded-md border bg-surface-base",
    "transition-opacity duration-fast",
    e.severity === "critical" && "border-critical-50 bg-critical-50",
    e.severity === "actionable" && "border-warning-100",
    e.severity === "info" && "border-subtle",
    r && "opacity-60"
  ), children: /* @__PURE__ */ t.jsxs("div", { className: "p-2.5 flex flex-col gap-2", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t.jsx(A, { variant: i.variant, size: "sm", withDot: !0, children: i.label }),
      /* @__PURE__ */ t.jsx(I, { score: e.confidence, label: e.confidenceLabel, size: "md" })
    ] }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug", children: e.title }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: () => l((d) => !d),
        "aria-expanded": n,
        className: p(
          "self-start text-xs text-text-link hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: n ? "Açıklamayı gizle" : "Neden bu öneri?"
      }
    ),
    n && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: e.reasons.map((d, x) => /* @__PURE__ */ t.jsx("li", { children: d }, x)) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
      /* @__PURE__ */ t.jsx(
        k,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => m("dismiss", s),
          isLoading: r === "dismiss",
          children: "Şimdi değil"
        }
      ),
      /* @__PURE__ */ t.jsx(
        k,
        {
          size: "sm",
          variant: e.severity === "critical" ? "destructive" : "primary",
          onClick: () => m("accept", a),
          isLoading: r === "accept",
          children: e.suggestedAction
        }
      )
    ] })
  ] }) });
}
const gt = () => v.aiSuggestions();
function pt() {
  return z({
    queryKey: g.dashboard.aiSuggestions(),
    queryFn: gt
  });
}
function yt() {
  return R({
    queryKey: g.dashboard.aiSuggestions(),
    mutationFn: (e) => v.applySuggestion(e),
    undoMessage: (e) => `Uygulandı: ${e.headline}`,
    /* Server reverse henüz yok — undo cache restore'la sınırlı (factory zaten
       previous'ı koyar). Reverse hazırlanınca undoFn dolar. */
    undoFn: () => Promise.resolve(),
    errorMessage: "Öneri uygulanamadı"
  });
}
function bt() {
  return R({
    queryKey: g.dashboard.aiSuggestions(),
    mutationFn: (e) => v.snoozeSuggestion(e),
    errorMessage: "Erteleme başarısız"
  });
}
function vt() {
  return R({
    queryKey: g.dashboard.aiSuggestions(),
    mutationFn: ({ suggestion: e, reason: a }) => v.dismissSuggestion(e, a),
    extractTarget: ({ suggestion: e }) => e,
    errorMessage: "Reddetme kaydedilemedi"
  });
}
const jt = 5, wt = 0.3;
function kt() {
  const { data: e, isLoading: a, isError: s, isFetching: n, isStale: l, dataUpdatedAt: r, refetch: u } = pt(), i = yt(), m = bt(), d = vt(), x = D.useMemo(() => (e ?? []).filter(
    (c) => I.normalize(c.confidence) >= wt
  ).slice(0, jt), [e]), f = ((e == null ? void 0 : e.length) ?? 0) - x.length;
  return /* @__PURE__ */ t.jsx(
    S,
    {
      title: "AI önerileri",
      subtitle: "Sessiz inbox — sen bakmak istediğinde",
      badge: /* @__PURE__ */ t.jsx(A, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
      isLoading: a,
      isError: s,
      isFetching: n,
      isStale: l,
      dataUpdatedAt: r,
      onRetry: () => u(),
      skeleton: /* @__PURE__ */ t.jsx(q, { rows: 3, withLeading: !1 }),
      isEmpty: !a && !s && x.length === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        P,
        {
          compact: !0,
          variant: "info",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✦" }),
          title: "AI şu an sessiz",
          description: "Anlamlı bir öneri çıkarsa burada gözükecek. Şimdilik aksiyona gerek yok."
        }
      ),
      children: /* @__PURE__ */ t.jsxs("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: [
        x.map((o) => /* @__PURE__ */ t.jsx("li", { children: /* @__PURE__ */ t.jsx(
          Nt,
          {
            suggestion: o,
            apply: i,
            snooze: m,
            dismiss: d
          }
        ) }, o.id)),
        f > 0 && /* @__PURE__ */ t.jsxs("li", { className: "text-xs text-text-tertiary text-center pt-1", children: [
          "+",
          f,
          " öneri daha"
        ] })
      ] })
    }
  );
}
function Nt({ suggestion: e, apply: a, snooze: s, dismiss: n }) {
  var r, u, i, m;
  const l = a.isPending && ((r = a.variables) == null ? void 0 : r.id) === e.id ? "apply" : s.isPending && ((u = s.variables) == null ? void 0 : u.id) === e.id ? "snooze" : n.isPending && ((m = (i = n.variables) == null ? void 0 : i.suggestion) == null ? void 0 : m.id) === e.id ? "dismiss" : null;
  return /* @__PURE__ */ t.jsx(
    ct,
    {
      headline: e.headline,
      why: e.why,
      confidence: e.confidence,
      tone: e.tone,
      primaryActionLabel: e.primaryActionLabel,
      pending: l,
      onApply: () => a.mutateAsync(e).catch(() => {
      }),
      onSnooze: () => s.mutateAsync(e).catch(() => {
      }),
      onDismiss: () => n.mutateAsync({ suggestion: e, reason: "irrelevant" }).catch(() => {
      })
    }
  );
}
const At = 200;
function St({ approvalId: e, open: a, onOpenChange: s }) {
  var c;
  const n = Re(), l = it(e), r = oe(), u = ce(), i = l.data, m = h.useCallback(async () => {
    if (i)
      try {
        await r.mutateAsync(i), s == null || s(!1);
      } catch {
      }
  }, [i, r, s]), d = h.useCallback(async () => {
    if (i)
      try {
        await u.mutateAsync(i), s == null || s(!1);
      } catch {
      }
  }, [i, u, s]), x = h.useMemo(() => {
    var b, y;
    return i ? `${C(i.amount, i.currency)} — ${i.requester} — ${((y = (b = i.context) == null ? void 0 : b.category) == null ? void 0 : y.label) ?? i.type}` : null;
  }, [i]), f = n === "decision" ? At : 0, o = r.isPending || u.isPending;
  return /* @__PURE__ */ t.jsx(G, { open: a, onOpenChange: s, children: /* @__PURE__ */ t.jsx(
    G.Content,
    {
      title: "Onay detayı",
      description: "Tek bir kararı bağlamıyla incele ve uygula",
      children: /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col h-full", children: [
        /* @__PURE__ */ t.jsxs("header", { className: "px-4 pt-2 pb-3 border-b border-subtle", children: [
          /* @__PURE__ */ t.jsx("h2", { className: "text-lg font-semibold text-balance", children: l.isLoading ? /* @__PURE__ */ t.jsx(O, { withDelta: !1 }) : x }),
          i && /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary mt-1", children: i.title })
        ] }),
        /* @__PURE__ */ t.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4", children: [
          l.isError && /* @__PURE__ */ t.jsx("div", { className: "rounded-md border border-negative-100 bg-negative-50 p-3", children: /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-negative", children: ((c = l.error) == null ? void 0 : c.message) ?? "Onay yüklenemedi." }) }),
          i && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx(Rt, { ai: i.ai }),
            /* @__PURE__ */ t.jsx(Et, { context: i.context })
          ] })
        ] }),
        /* @__PURE__ */ t.jsxs("footer", { className: "px-4 py-3 border-t border-subtle bg-surface-sunken flex items-center justify-end gap-2", children: [
          /* @__PURE__ */ t.jsx(
            k,
            {
              type: "button",
              variant: "ghost",
              size: "md",
              onClick: d,
              isLoading: u.isPending,
              disabled: !i || o,
              className: "text-text-negative hover:bg-negative-50 hover:text-negative-700",
              children: "Reddet"
            }
          ),
          /* @__PURE__ */ t.jsx(
            Ke,
            {
              holdMs: f,
              variant: "primary",
              size: "md",
              onConfirm: m,
              isLoading: r.isPending,
              disabled: !i || o,
              children: f > 0 ? "Onaylamak için bas" : "Onayla"
            }
          )
        ] })
      ] })
    }
  ) });
}
function Rt({ ai: e }) {
  var a;
  return e ? /* @__PURE__ */ t.jsxs("section", { className: "rounded-md border border-subtle bg-surface-base p-3", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2 mb-2", children: [
      /* @__PURE__ */ t.jsx(A, { variant: e.anomaly ? "warning" : "ai", size: "sm", withDot: !0, children: e.anomaly ? "AI: anomali işareti var" : "AI: anomaly yok" }),
      /* @__PURE__ */ t.jsx(I, { score: e.confidence, size: "md" })
    ] }),
    ((a = e.reasons) == null ? void 0 : a.length) > 0 && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: e.reasons.map((s, n) => /* @__PURE__ */ t.jsx("li", { children: s }, n)) })
  ] }) : null;
}
function Et({ context: e }) {
  if (!e) return null;
  const { budget: a, category: s, project: n } = e, l = a != null && a.total ? a.remaining / a.total : 0, r = l >= 0.3 ? "positive" : l >= 0.1 ? "warning" : "critical";
  return /* @__PURE__ */ t.jsxs("section", { className: "grid grid-cols-1 gap-2", children: [
    /* @__PURE__ */ t.jsx(
      T,
      {
        label: "Bütçe kalanı",
        value: a && C(a.remaining, a.currency),
        hint: a && `${Math.round(l * 100)}% / ${C(a.total, a.currency)}`,
        variant: r
      }
    ),
    /* @__PURE__ */ t.jsx(
      T,
      {
        label: `${(s == null ? void 0 : s.label) ?? "Kategori"} — bu ay`,
        value: s && C(s.spentMonth, (a == null ? void 0 : a.currency) ?? "TRY")
      }
    ),
    /* @__PURE__ */ t.jsx(
      T,
      {
        label: "Proje",
        value: n == null ? void 0 : n.name,
        hint: n == null ? void 0 : n.code
      }
    )
  ] });
}
function T({ label: e, value: a, hint: s, variant: n }) {
  const l = n === "positive" ? "text-text-positive" : n === "warning" ? "text-text-warning" : n === "critical" ? "text-text-negative" : "text-text-primary";
  return /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-3 py-1.5 border-b border-subtle last:border-b-0", children: [
    /* @__PURE__ */ t.jsx("span", { className: "text-sm text-text-secondary", children: e }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col items-end min-w-0", children: [
      /* @__PURE__ */ t.jsx("span", { className: `text-sm font-tabular font-medium ${l}`, children: a ?? "—" }),
      s && /* @__PURE__ */ t.jsx("span", { className: "text-xs text-text-tertiary", children: s })
    ] })
  ] });
}
const Dt = W.WidthProvider(W.Responsive), zt = {
  "budget-health": Ue,
  "cash-flow": et,
  "pending-approvals": rt,
  "risk-alerts": ft,
  "ai-suggestions": kt
};
function Lt() {
  const [e, a] = h.useState(() => Ie()), [s, n] = h.useState(!1), [l, r] = h.useState(null);
  h.useEffect(() => {
    if (typeof window > "u") return;
    const o = new URLSearchParams(window.location.search), c = o.get("approval");
    if (!c) return;
    r(c), o.delete("approval");
    const b = window.location.pathname + (o.toString() ? `?${o}` : "") + window.location.hash;
    window.history.replaceState(null, "", b);
  }, []);
  const u = h.useMemo(() => {
    const o = F[e] ?? F.cfo, c = Te(e);
    return c ? { ...o, ...c } : o;
  }, [e]), i = h.useCallback((o) => {
    a(o), Pe(o);
  }, []), m = h.useCallback(
    (o, c) => {
      s && Be(e, c);
    },
    [s, e]
  ), d = h.useCallback(() => {
    Fe(e), a(e);
  }, [e]), f = (u.desktop ?? []).map((o) => o.i);
  return /* @__PURE__ */ t.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ t.jsx(
      Mt,
      {
        persona: e,
        onPersonaChange: i,
        editMode: s,
        onEditModeToggle: () => n((o) => !o),
        onReset: d
      }
    ),
    /* @__PURE__ */ t.jsx("main", { className: "px-4 py-4 mobile:px-2 mobile:py-2", children: /* @__PURE__ */ t.jsx(
      Dt,
      {
        className: p("apya-bento", s && "apya-bento--edit"),
        layouts: u,
        breakpoints: Le,
        cols: Me,
        rowHeight: Ce,
        margin: _e,
        isDraggable: s,
        isResizable: s,
        draggableHandle: `.${S.DRAG_HANDLE_CLASS}`,
        onLayoutChange: m,
        compactType: "vertical",
        preventCollision: !1,
        children: f.map((o) => {
          const c = zt[o];
          return c ? /* @__PURE__ */ t.jsx("div", { className: "apya-bento-item", children: /* @__PURE__ */ t.jsx(c, {}) }, o) : /* @__PURE__ */ t.jsx("div", { children: /* @__PURE__ */ t.jsx(S, { title: `Bilinmeyen widget: ${o}` }) }, o);
        })
      }
    ) }),
    /* @__PURE__ */ t.jsx(
      St,
      {
        approvalId: l,
        open: !!l,
        onOpenChange: (o) => {
          o || r(null);
        }
      }
    ),
    s && /* @__PURE__ */ t.jsxs(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        className: p(
          "fixed bottom-4 left-1/2 -translate-x-1/2 z-toast",
          "bg-surface-inverse text-text-inverse text-sm",
          "px-4 py-2 rounded-md shadow-lg",
          "flex items-center gap-3"
        ),
        children: [
          /* @__PURE__ */ t.jsx("span", { children: "Düzenleme modu — widget'ları sürükleyip yeniden boyutlandırabilirsin" }),
          /* @__PURE__ */ t.jsx(
            k,
            {
              variant: "ghost",
              size: "sm",
              className: "text-text-inverse hover:bg-white/10",
              onClick: () => n(!1),
              children: "Bitir"
            }
          )
        ]
      }
    )
  ] });
}
function Mt({ persona: e, onPersonaChange: a, editMode: s, onEditModeToggle: n, onReset: l }) {
  return /* @__PURE__ */ t.jsxs("header", { className: p(
    "sticky top-0 z-sticky",
    "bg-surface-raised/95 backdrop-blur-sm",
    "border-b border-default",
    "px-4 py-3",
    "flex items-center justify-between gap-4",
    "mobile:px-2 mobile:py-2"
  ), children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0", children: [
      /* @__PURE__ */ t.jsx("h1", { className: "text-base font-semibold text-text-primary truncate", children: "Genel Bakış" }),
      /* @__PURE__ */ t.jsxs("p", { className: "text-xs text-text-tertiary truncate mobile:hidden", children: [
        ie[e],
        " görünümü"
      ] })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      /* @__PURE__ */ t.jsx(Ct, { value: e, onChange: a }),
      s ? /* @__PURE__ */ t.jsx(
        k,
        {
          size: "sm",
          variant: "secondary",
          onClick: l,
          title: "Layout'u persona varsayılanına döndür",
          children: "Sıfırla"
        }
      ) : null,
      /* @__PURE__ */ t.jsx(
        k,
        {
          size: "sm",
          variant: s ? "primary" : "secondary",
          onClick: n,
          children: s ? "Tamamla" : "Düzenle"
        }
      ),
      /* @__PURE__ */ t.jsx(ge, {})
    ] })
  ] });
}
function Ct({ value: e, onChange: a }) {
  return /* @__PURE__ */ t.jsxs("label", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ t.jsx("span", { className: "sr-only", children: "Persona seç" }),
    /* @__PURE__ */ t.jsx(
      "select",
      {
        value: e,
        onChange: (s) => a(s.target.value),
        className: p(
          "h-10 px-3 text-sm rounded-md",
          "bg-surface-base text-text-primary",
          "border border-default",
          "hover:border-strong",
          "focus-visible:outline-none focus-visible:shadow-focus",
          "transition-colors duration-fast"
        ),
        children: Object.entries(ie).map(([s, n]) => /* @__PURE__ */ t.jsx("option", { value: s, children: n }, s))
      }
    )
  ] });
}
function _t(e) {
  const { connection: a, state: s } = se(), n = $();
  h.useEffect(() => {
    if (!a || !(e != null && e.length)) return;
    const l = e.map(([r, u]) => {
      const i = () => {
        u.forEach((m) => {
          n.invalidateQueries({ queryKey: m });
        });
      };
      return a.on(r, i), [r, i];
    });
    return () => {
      l.forEach(([r, u]) => {
        a.off(r, u);
      });
    };
  }, [a, s, n]);
}
function It(e) {
  const { connection: a, state: s } = se(), n = $(), l = ee();
  h.useEffect(() => {
    if (!a || !(e != null && e.length)) return;
    const r = e.map(([u, i]) => {
      const m = (d) => {
        var x;
        (x = i.queryKeys) == null || x.forEach(
          (f) => n.invalidateQueries({ queryKey: f })
        ), l.warning(i.message ?? "Bu kayıtta çakışma oldu", {
          description: i.description ?? (d == null ? void 0 : d.message),
          action: {
            label: "Yenile",
            onClick: () => {
              var f;
              (f = i.queryKeys) == null || f.forEach(
                (o) => n.invalidateQueries({ queryKey: o })
              );
            }
          }
        });
      };
      return a.on(u, m), [u, m];
    });
    return () => {
      r.forEach(([u, i]) => a.off(u, i));
    };
  }, [a, s, n]);
}
function Pt() {
  const e = h.useMemo(() => [
    ["JournalEntryPosted", [g.dashboard.budget(), g.dashboard.cashflow()]],
    ["ApprovalDecided", [g.dashboard.approvals(), g.dashboard.budget(), g.dashboard.cashflow()]],
    ["RiskDetected", [g.dashboard.risks()]],
    ["RiskDismissed", [g.dashboard.risks()]],
    ["AISuggestionPosted", [g.dashboard.aiSuggestions()]]
  ], []), a = h.useMemo(() => [
    ["ApprovalConflict", {
      queryKeys: [g.dashboard.approvals(), g.dashboard.budget(), g.dashboard.cashflow()],
      message: "Onay kaydında çakışma",
      description: "Bu kayıt başka bir kullanıcı tarafından işlendi."
    }],
    ["BudgetConflict", {
      queryKeys: [g.dashboard.budget()],
      message: "Bütçe kaydında çakışma",
      description: "Aynı bütçeyi başka bir kullanıcı güncelledi."
    }],
    ["SuggestionConflict", {
      queryKeys: [g.dashboard.aiSuggestions()],
      message: "AI önerisinde çakışma",
      description: "Bu öneri başka bir kullanıcı tarafından uygulanmış."
    }]
  ], []);
  return _t(e), It(a), null;
}
pe();
const X = document.getElementById("apya-dashboard-root");
X && de(X).render(
  /* @__PURE__ */ t.jsx(ye, { children: /* @__PURE__ */ t.jsx(Se, { children: /* @__PURE__ */ t.jsx(be, { children: /* @__PURE__ */ t.jsx(ve, { children: /* @__PURE__ */ t.jsxs(Ne, { children: [
    /* @__PURE__ */ t.jsx(Pt, {}),
    /* @__PURE__ */ t.jsx(Lt, {})
  ] }) }) }) }) })
);
