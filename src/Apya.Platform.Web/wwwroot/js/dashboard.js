import { r as y, j as t, e as z, d as ne } from "./react-vendor.js";
import { S as j, c as g, C as ie, a as re, b as le, d as oe, B as A, Q as x, f as V, e as I, u as U, A as ce, g as de, h as k, i as B, T as ue, r as me, j as he, k as xe, l as fe } from "./registerServiceWorker.js";
import { H as J, a as ge, L as ye } from "./signalr-vendor.js";
import { r as F } from "./grid-vendor.js";
import { u as D, a as H, b as pe } from "./query-vendor.js";
/* empty css      */
const X = y.createContext({
  connection: null,
  state: J.Disconnected
});
function be({ hubUrl: e = "/signalr-hubs/notifications", children: a, enabled: s = !0 }) {
  const [n, r] = y.useState(J.Disconnected), i = y.useRef(null);
  y.useEffect(() => {
    if (!s || typeof window > "u") return;
    const l = new ge().withUrl(e, { withCredentials: !0 }).withAutomaticReconnect([0, 2e3, 5e3, 1e4, 3e4]).configureLogging(ye.Warning).build();
    i.current = l, r(l.state);
    const m = () => r(l.state);
    return l.onreconnecting(m), l.onreconnected(m), l.onclose(m), l.start().then(m).catch((c) => {
      console.warn("[SignalR] connect failed:", c == null ? void 0 : c.message), m();
    }), () => {
      l.stop().catch(() => {
      }), i.current = null;
    };
  }, [e, s]);
  const d = y.useMemo(() => ({
    get connection() {
      return i.current;
    },
    state: n
  }), [n]);
  return /* @__PURE__ */ t.jsx(X.Provider, { value: d, children: a });
}
function Z() {
  return y.useContext(X);
}
const M = {
  triage: "(min-width: 768px)",
  analysis: "(min-width: 1280px)",
  command: "(min-width: 1920px)"
};
function ve() {
  return typeof window > "u" || !window.matchMedia ? "analysis" : window.matchMedia(M.command).matches ? "command" : window.matchMedia(M.analysis).matches ? "analysis" : window.matchMedia(M.triage).matches ? "triage" : "decision";
}
const je = y.createContext(null);
function we({ children: e, override: a }) {
  const s = y.useCallback((i) => {
    if (typeof window > "u" || !window.matchMedia) return () => {
    };
    const d = Object.values(M).map((l) => window.matchMedia(l));
    return d.forEach((l) => l.addEventListener("change", i)), () => d.forEach((l) => l.removeEventListener("change", i));
  }, []), n = y.useSyncExternalStore(s, ve, () => "analysis"), r = a ?? n;
  return y.useEffect(() => {
    typeof document > "u" || (document.documentElement.dataset.deviceMode = r);
  }, [r]), /* @__PURE__ */ t.jsx(je.Provider, { value: r, children: e });
}
const ke = {
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
}, Ne = {
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
}, Se = {
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
}, T = {
  cfo: ke,
  pm: Ne,
  field: Se
}, ee = {
  cfo: "CFO / Finansman",
  pm: "Proje Yöneticisi",
  field: "Saha Kullanıcısı"
}, Ae = {
  desktop: 1280,
  tablet: 768,
  mobile: 0
}, Re = {
  desktop: 12,
  tablet: 8,
  mobile: 1
}, Ee = 64, ze = [12, 12], te = "apya-dashboard-persona", O = "apya-dashboard-layout-overrides";
function Ce() {
  if (typeof window > "u") return "cfo";
  try {
    const e = window.localStorage.getItem(te);
    if (e && T[e]) return e;
  } catch {
  }
  return "cfo";
}
function Le(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(te, e);
    } catch {
    }
}
function De(e) {
  if (typeof window > "u") return null;
  try {
    const a = window.localStorage.getItem(`${O}-${e}`);
    return a ? JSON.parse(a) : null;
  } catch {
    return null;
  }
}
function Me(e, a) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(
        `${O}-${e}`,
        JSON.stringify(a)
      );
    } catch {
    }
}
function _e(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.removeItem(`${O}-${e}`);
    } catch {
    }
}
function ae({ className: e, withDelta: a = !0, withBar: s = !1 }) {
  return /* @__PURE__ */ t.jsxs("div", { className: g("flex flex-col gap-3 h-full", e), "aria-busy": "true", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-baseline gap-2", children: [
      /* @__PURE__ */ t.jsx(j, { width: 140, height: 32, rounded: "md" }),
      /* @__PURE__ */ t.jsx(j, { width: 70, height: 16, rounded: "sm" })
    ] }),
    a && /* @__PURE__ */ t.jsx(j, { width: 180, height: 12, rounded: "sm" }),
    s && /* @__PURE__ */ t.jsx(j, { height: 6, rounded: "full" })
  ] });
}
function Ie({ className: e, height: a = 64 }) {
  const s = [0.4, 0.55, 0.45, 0.7, 0.6, 0.8, 0.65, 0.85, 0.75, 0.9, 0.7, 0.95];
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      className: g("flex items-end justify-between gap-1 w-full", e),
      style: { height: a },
      "aria-busy": "true",
      children: s.map((n, r) => /* @__PURE__ */ t.jsx(
        j,
        {
          height: `${n * 100}%`,
          className: "flex-1 min-w-0",
          rounded: "sm"
        },
        r
      ))
    }
  );
}
function K({ rows: e = 4, withLeading: a = !0, withTrailing: s = !0, className: n }) {
  return /* @__PURE__ */ t.jsx("ul", { className: g("flex flex-col gap-2", n), "aria-busy": "true", children: Array.from({ length: e }).map((r, i) => /* @__PURE__ */ t.jsxs(
    "li",
    {
      className: "flex items-center gap-3 p-2 rounded-md border border-subtle bg-surface-base",
      children: [
        a && /* @__PURE__ */ t.jsx(j, { width: 32, height: 32, rounded: "md" }),
        /* @__PURE__ */ t.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
          /* @__PURE__ */ t.jsx(j, { height: 12, className: i % 2 === 0 ? "w-3/4" : "w-2/3" }),
          /* @__PURE__ */ t.jsx(j, { height: 10, className: "w-1/2" })
        ] }),
        s && /* @__PURE__ */ t.jsx(j, { width: 64, height: 12, rounded: "sm" })
      ]
    },
    i
  )) });
}
const $ = {
  default: { ring: "bg-neutral-100 text-neutral-500", text: "text-text-tertiary" },
  success: { ring: "bg-positive-50 text-positive-600", text: "text-text-secondary" },
  info: { ring: "bg-brand-50 text-brand-600", text: "text-text-secondary" }
};
function _({
  icon: e,
  title: a,
  description: s,
  action: n,
  /* ReactNode — Button, link vs. */
  variant: r = "default",
  compact: i = !1,
  /* compact: ikonu küçült, padding düşür — Bento widget için */
  className: d
}) {
  const l = $[r] ?? $.default;
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      role: "status",
      "aria-live": "polite",
      className: g(
        "flex flex-col items-center justify-center text-center",
        i ? "gap-2 py-3" : "gap-3 py-6",
        d
      ),
      children: [
        e && /* @__PURE__ */ t.jsx(
          "span",
          {
            className: g(
              "inline-flex items-center justify-center rounded-full",
              l.ring,
              i ? "h-8 w-8" : "h-12 w-12"
            ),
            "aria-hidden": "true",
            children: e
          }
        ),
        a && /* @__PURE__ */ t.jsx("p", { className: g(
          "font-medium text-text-primary",
          i ? "text-sm" : "text-base"
        ), children: a }),
        s && /* @__PURE__ */ t.jsx("p", { className: g("max-w-sm", l.text, i ? "text-xs" : "text-sm"), children: s }),
        n && /* @__PURE__ */ t.jsx("div", { className: "mt-1", children: n })
      ]
    }
  );
}
const se = {
  /* react-grid-layout drag handle'ı için class — yalnızca header'dan sürüklenir */
  DRAG_HANDLE_CLASS: "widget-drag-handle"
};
function S({
  title: e,
  subtitle: a,
  badge: s,
  actions: n,
  /* sağ üstteki action button'lar */
  isLoading: r = !1,
  isError: i = !1,
  errorMessage: d,
  onRetry: l,
  isEmpty: m = !1,
  emptyMessage: c,
  /* legacy: tek satır metin; yeni kod emptyState kullanmalı */
  emptyState: o,
  /* yeni: <EmptyState .../> ReactNode */
  skeleton: u,
  /* yeni: shape-aware loading state — ReactNode */
  isFetching: f = !1,
  /* React Query background refetch */
  isStale: h = !1,
  /* React Query staleTime aşıldı */
  dataUpdatedAt: p,
  /* number (ms) | Date | undefined — son başarılı fetch */
  density: v = "compact",
  children: N,
  className: E
}) {
  const C = !r && !i && h && f;
  return /* @__PURE__ */ t.jsxs(ie, { variant: "default", className: g("h-full flex flex-col", E), children: [
    /* @__PURE__ */ t.jsxs(
      re,
      {
        density: v,
        className: g(
          se.DRAG_HANDLE_CLASS,
          "cursor-grab active:cursor-grabbing select-none",
          "flex-row items-center justify-between flex-none"
        ),
        children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0 flex-1", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ t.jsx(le, { className: "text-sm font-semibold truncate", children: e }),
              s,
              C && /* @__PURE__ */ t.jsx(He, {})
            ] }),
            a && /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary truncate", children: a })
          ] }),
          n && /* @__PURE__ */ t.jsx(
            "div",
            {
              className: "flex items-center gap-1 flex-none",
              onMouseDown: (L) => L.stopPropagation(),
              onTouchStart: (L) => L.stopPropagation(),
              children: n
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ t.jsxs(oe, { density: v, className: "flex-1 overflow-auto", children: [
      i && /* @__PURE__ */ t.jsx(
        Be,
        {
          message: d,
          onRetry: l,
          dataUpdatedAt: p
        }
      ),
      !i && r && (u ?? /* @__PURE__ */ t.jsx(Te, { density: v })),
      !i && !r && m && (o ?? /* @__PURE__ */ t.jsx(Pe, { message: c })),
      !i && !r && !m && N
    ] })
  ] });
}
function Te({ density: e }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3", "aria-busy": "true", children: [
    /* @__PURE__ */ t.jsx(j, { height: e === "spacious" ? 48 : 32, className: "w-1/3" }),
    /* @__PURE__ */ t.jsx(j, { height: 16 }),
    /* @__PURE__ */ t.jsx(j, { height: 16, className: "w-5/6" }),
    /* @__PURE__ */ t.jsx(j, { height: 16, className: "w-3/4" })
  ] });
}
function Pe({ message: e }) {
  return /* @__PURE__ */ t.jsx(
    _,
    {
      compact: !0,
      title: e ?? "Görüntülenecek veri yok",
      description: "Yeni veri girildiğinde burada görünecek."
    }
  );
}
function Be({ message: e, onRetry: a, dataUpdatedAt: s }) {
  const n = Oe(s);
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
        className: g(
          "text-sm text-text-link underline-offset-2 hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: "Tekrar dene"
      }
    )
  ] });
}
function He() {
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
function Oe(e) {
  if (e == null) return null;
  const a = e instanceof Date ? e.getTime() : Number(e);
  if (!Number.isFinite(a)) return null;
  const s = Math.round((a - Date.now()) / 1e3), n = Math.abs(s), r = new Intl.RelativeTimeFormat("tr-TR", { numeric: "auto" });
  return n < 60 ? r.format(s, "second") : n < 3600 ? r.format(Math.round(s / 60), "minute") : n < 86400 ? r.format(Math.round(s / 3600), "hour") : r.format(Math.round(s / 86400), "day");
}
S.DRAG_HANDLE_CLASS = se.DRAG_HANDLE_CLASS;
const G = 250, Ke = 450;
function w(e = G + Math.random() * (Ke - G)) {
  return new Promise((a) => setTimeout(a, e));
}
const b = {
  async budgetSummary() {
    return await w(), {
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
    return await w(), {
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
    return await w(), [
      { id: "inv-001", type: "invoice", title: "TÜBİTAK 1501 — Eylül faturası", requester: "Ahmet Yıldız", amount: 12450, currency: "TRY", ageHours: 4 },
      { id: "exp-002", type: "expense", title: "Yazılım lisansı — JetBrains All", requester: "Mehmet Kaya", amount: 8240, currency: "TRY", ageHours: 18 },
      { id: "po-003", type: "po", title: "Bulut hosting (Q3 yenileme)", requester: "Zeynep Aksoy", amount: 24900, currency: "TRY", ageHours: 36 },
      { id: "inv-004", type: "invoice", title: "KOSGEB danışmanlık — Ağustos", requester: "Selin Aydın", amount: 6800, currency: "TRY", ageHours: 52 }
    ];
  },
  async approveItem(e) {
    if (await w(600), Math.random() < 0.05) {
      const a = new Error("Bu kayıt başka bir kullanıcı tarafından onaylanmış.");
      throw a.status = 409, a;
    }
    return { id: e.id, status: "approved" };
  },
  async rejectItem(e) {
    return await w(400), { id: e.id, status: "rejected" };
  },
  async riskAlerts() {
    return await w(), [
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
    return await w(300), { id: e.id, dismissed: !0 };
  },
  async acceptRisk(e) {
    return await w(500), { id: e.id, accepted: !0 };
  },
  /* AI suggestion inbox — dashboard widget'ı için top-N öneri.
     Risk alerts'ten ayrı: risk = "neye dikkat", suggestion = "ne yap".
     Tone: opportunity | warning | critical | neutral */
  async aiSuggestions() {
    return await w(), [
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
    if (await w(500), Math.random() < 0.03) {
      const a = new Error("Bu öneri başka bir kullanıcı tarafından uygulanmış.");
      throw a.status = 409, a;
    }
    return { id: e.id, applied: !0 };
  },
  async snoozeSuggestion(e) {
    return await w(250), { id: e.id, snoozed: !0, until: new Date(Date.now() + 7 * 864e5).toISOString() };
  },
  async dismissSuggestion(e, a = "irrelevant") {
    return await w(250), { id: e.id, dismissed: !0, reason: a };
  }
}, Fe = () => b.budgetSummary();
function $e() {
  return D({
    queryKey: x.dashboard.budget(),
    queryFn: Fe
  });
}
function Ge() {
  const { data: e, isLoading: a, isError: s, isFetching: n, isStale: r, dataUpdatedAt: i, refetch: d } = $e(), l = () => d(), m = e ? e.spent / e.budget * 100 : 0, c = W(m), o = e ? V(e.deltaPct) : null;
  return /* @__PURE__ */ t.jsx(
    S,
    {
      title: "Bütçe Sağlığı",
      subtitle: "Tüm aktif projeler — bu ay",
      badge: /* @__PURE__ */ t.jsx(A, { variant: c.badgeVariant, size: "sm", withDot: !0, children: c.label }),
      isLoading: a,
      isError: s,
      isFetching: n,
      isStale: r,
      dataUpdatedAt: i,
      onRetry: l,
      skeleton: /* @__PURE__ */ t.jsx(ae, { withDelta: !0, withBar: !0 }),
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-baseline gap-2 font-tabular", children: [
          /* @__PURE__ */ t.jsx("span", { className: "text-3xl font-semibold tracking-tight", children: I(e.spent, e.currency) }),
          /* @__PURE__ */ t.jsxs("span", { className: "text-sm text-text-tertiary", children: [
            "/ ",
            I(e.budget, e.currency)
          ] })
        ] }),
        o && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1.5 text-xs", children: [
          /* @__PURE__ */ t.jsxs("span", { className: g(
            "inline-flex items-center gap-1 font-medium font-tabular",
            /* delta < 0 = harcama düşmüş = pozitif sinyal */
            e.deltaPct < 0 ? "text-text-positive" : "text-text-negative"
          ), children: [
            o.symbol,
            " ",
            o.text
          ] }),
          /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: "geçen aya göre" })
        ] }),
        /* @__PURE__ */ t.jsx(We, { value: m, variant: c.barVariant }),
        /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-1.5 mt-1 overflow-y-auto", children: e.breakdown.map((u) => /* @__PURE__ */ t.jsxs(
          "li",
          {
            className: "flex items-center justify-between text-xs gap-3",
            children: [
              /* @__PURE__ */ t.jsx("span", { className: "truncate text-text-secondary", children: u.project }),
              /* @__PURE__ */ t.jsxs("span", { className: g(
                "font-tabular font-medium",
                W(u.ratio * 100).textVariant
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
function W(e) {
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
function We({ value: e, variant: a = "positive" }) {
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
          className: g(
            s,
            "h-full rounded-full transition-all duration-slow ease-standard"
          ),
          style: { width: `${Math.min(e, 100)}%` }
        }
      )
    }
  );
}
const qe = () => b.cashFlow();
function Ye() {
  return D({
    queryKey: x.dashboard.cashflow(),
    queryFn: qe
  });
}
function Qe() {
  const { data: e, isLoading: a, isError: s, isFetching: n, isStale: r, dataUpdatedAt: i, refetch: d } = Ye(), l = () => d(), m = e ? V(e.deltaPct) : null, c = e ? e.deltaPct >= 0 : !0;
  return /* @__PURE__ */ t.jsx(
    S,
    {
      title: "Nakit Akışı",
      subtitle: "Son 30 gün",
      isLoading: a,
      isError: s,
      isFetching: n,
      isStale: r,
      dataUpdatedAt: i,
      onRetry: l,
      skeleton: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-4 h-full", children: [
        /* @__PURE__ */ t.jsx(ae, { className: "flex-none" }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx(Ie, { height: 64 }) })
      ] }),
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-4 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 flex-none", children: [
          /* @__PURE__ */ t.jsx("div", { className: "text-2xl font-semibold tracking-tight font-tabular", children: I(e.netCurrent, e.currency) }),
          m && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 text-xs", children: [
            /* @__PURE__ */ t.jsxs("span", { className: g(
              "inline-flex items-center gap-1 font-medium font-tabular",
              c ? "text-text-positive" : "text-text-negative"
            ), children: [
              m.symbol,
              " ",
              m.text
            ] }),
            /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: "vs önceki dönem" })
          ] })
        ] }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx(Ve, { series: e.series, variant: c ? "positive" : "negative" }) })
      ] })
    }
  );
}
function Ve({ series: e, variant: a = "positive" }) {
  const n = `cashflow-grad-${y.useId().replace(/:/g, "")}`;
  if (!e || e.length < 2) return null;
  const r = 100, i = 40, d = Math.min(...e), m = Math.max(...e) - d || 1, o = e.map((h, p) => {
    const v = p / (e.length - 1) * r, N = i - (h - d) / m * i;
    return [v, N];
  }).map(([h, p], v) => `${v === 0 ? "M" : "L"} ${h.toFixed(2)} ${p.toFixed(2)}`).join(" "), u = `${o} L ${r} ${i} L 0 ${i} Z`, f = a === "positive" ? "var(--apya-positive-500)" : "var(--apya-negative-500)";
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      viewBox: `0 0 ${r} ${i}`,
      preserveAspectRatio: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ t.jsx("defs", { children: /* @__PURE__ */ t.jsxs("linearGradient", { id: n, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ t.jsx("stop", { offset: "0%", stopColor: f, stopOpacity: "0.25" }),
          /* @__PURE__ */ t.jsx("stop", { offset: "100%", stopColor: f, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ t.jsx("path", { d: u, fill: `url(#${n})` }),
        /* @__PURE__ */ t.jsx(
          "path",
          {
            d: o,
            fill: "none",
            stroke: f,
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
const Ue = (e, a) => (e ?? []).filter((s) => s.id !== (a == null ? void 0 : a.id));
function R({
  queryKey: e,
  mutationFn: a,
  /* Mutation arg'ı liste'deki hedef row'a nasıl eşlenir? Default: arg = row */
  extractTarget: s = (c) => c,
  /* Optimistic cache transform — default: id eşleşen row'u sil */
  transform: n = Ue,
  /* Side-effect query'leri — onSettled'da invalidate edilir */
  extraInvalidations: r = [],
  /* Başarı toast'i (undo destekli). undoFn varsa "Geri al" gösterilir. */
  undoMessage: i,
  /* (target) => string  | undefined */
  undoFn: d,
  /* (target) => Promise | undefined */
  /* Hata toast'leri — varsayılan generic mesajlar */
  errorMessage: l = "İşlem başarısız oldu",
  conflictMessage: m = "Bu kayıt başka bir kullanıcı tarafından değiştirildi"
}) {
  const c = H(), o = U();
  return pe({
    mutationFn: a,
    onMutate: async (u) => {
      const f = s(u);
      await c.cancelQueries({ queryKey: e });
      const h = c.getQueryData(e);
      return c.setQueryData(e, (p) => n(p, f, u)), { previous: h, target: f };
    },
    onError: (u, f, h) => {
      (h == null ? void 0 : h.previous) !== void 0 && c.setQueryData(e, h.previous), (u instanceof ce ? u.status === 409 : (u == null ? void 0 : u.status) === 409) ? o.warning(m, {
        description: "Veriyi tazeleyip tekrar deneyebilirsin.",
        action: { label: "Yenile", onClick: () => c.invalidateQueries({ queryKey: e }) }
      }) : o.error(l, {
        description: u == null ? void 0 : u.message
      });
    },
    onSuccess: (u, f, h) => {
      if (!d || !i) return;
      const p = (h == null ? void 0 : h.target) ?? s(f), v = typeof i == "function" ? i(p) : i;
      o.success(v, {
        action: {
          label: "Geri al",
          onClick: () => {
            c.setQueryData(e, h == null ? void 0 : h.previous), Promise.resolve(d(p)).catch((N) => {
              o.error("Geri alınamadı", { description: N == null ? void 0 : N.message }), c.invalidateQueries({ queryKey: e });
            });
          }
        }
      });
    },
    onSettled: () => {
      c.invalidateQueries({ queryKey: e }), r.forEach((u) => c.invalidateQueries({ queryKey: u }));
    }
  });
}
const Je = () => b.pendingApprovals();
function Xe() {
  return D({
    queryKey: x.dashboard.approvals(),
    queryFn: Je
  });
}
function Ze() {
  return R({
    queryKey: x.dashboard.approvals(),
    mutationFn: (e) => b.approveItem(e),
    extraInvalidations: [x.dashboard.budget(), x.dashboard.cashflow()],
    undoMessage: (e) => `${e.title} onaylandı`,
    undoFn: (e) => b.rejectItem(e),
    /* "geri al" = ters yöne kaydet */
    errorMessage: "Onay başarısız oldu"
  });
}
function et() {
  return R({
    queryKey: x.dashboard.approvals(),
    mutationFn: (e) => b.rejectItem(e),
    extraInvalidations: [x.dashboard.budget(), x.dashboard.cashflow()],
    undoMessage: (e) => `${e.title} reddedildi`,
    undoFn: (e) => b.approveItem(e),
    errorMessage: "Reddetme başarısız oldu"
  });
}
const q = {
  invoice: { label: "Fatura", variant: "brand" },
  expense: { label: "Masraf", variant: "neutral" },
  po: { label: "Sipariş", variant: "ai" }
};
function tt() {
  const { data: e, isLoading: a, isError: s, isFetching: n, isStale: r, dataUpdatedAt: i, refetch: d } = Xe(), l = Ze(), m = et(), c = () => d(), o = (h) => l.mutateAsync(h).catch(() => {
  }), u = (h) => m.mutateAsync(h).catch(() => {
  }), f = (e == null ? void 0 : e.length) ?? 0;
  return /* @__PURE__ */ t.jsx(
    S,
    {
      title: "Onay Bekleyenler",
      subtitle: f > 0 ? `${f} kalem inceleme bekliyor` : void 0,
      badge: f > 0 && /* @__PURE__ */ t.jsx(A, { variant: "warning", size: "sm", withDot: !0, children: f }),
      isLoading: a,
      isError: s,
      isFetching: n,
      isStale: r,
      dataUpdatedAt: i,
      onRetry: c,
      skeleton: /* @__PURE__ */ t.jsx(K, { rows: 4 }),
      isEmpty: !a && !s && f === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        _,
        {
          compact: !0,
          variant: "success",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✓" }),
          title: "Hepsi tamam",
          description: "Bugün karar bekleyen kalmadı."
        }
      ),
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: e == null ? void 0 : e.map((h) => /* @__PURE__ */ t.jsx(
        at,
        {
          item: h,
          onApprove: o,
          onReject: u
        },
        h.id
      )) })
    }
  );
}
function at({ item: e, onApprove: a, onReject: s }) {
  const [n, r] = z.useState(null), i = q[e.type] ?? q.expense, d = st(e.ageHours), l = async (m, c) => {
    if (!n) {
      r(m);
      try {
        await (c == null ? void 0 : c(e));
      } finally {
        r(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsxs("li", { className: g(
    "flex items-center gap-3 p-2.5 rounded-md",
    "bg-surface-base border border-subtle",
    "transition-opacity duration-fast",
    n && "opacity-60"
  ), children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 min-w-0 flex-1", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(A, { variant: i.variant, size: "sm", children: i.label }),
        /* @__PURE__ */ t.jsxs("span", { className: "text-xs text-text-tertiary truncate", children: [
          e.requester,
          " · ",
          d
        ] })
      ] }),
      /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary truncate", children: e.title })
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "font-tabular font-semibold text-sm text-text-primary flex-none", children: de(e.amount, e.currency) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 flex-none", children: [
      /* @__PURE__ */ t.jsx(
        k,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => l("reject", s),
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
          onClick: () => l("approve", a),
          isLoading: n === "approve",
          "aria-label": `${e.title} onayla`,
          children: "Onayla"
        }
      )
    ] })
  ] });
}
function st(e) {
  return e < 1 ? "az önce" : e < 24 ? `${Math.round(e)} sa önce` : `${Math.floor(e / 24)} gün önce`;
}
const Y = {
  /* Neutral default — AI'ın sakin, ısrarsız tonu */
  neutral: { border: "border-default", ribbon: null },
  /* Pozitif — fırsat, gelişim önerisi */
  opportunity: { border: "border-positive-100", ribbon: "bg-positive-50" },
  /* Uyarı — bütçe aşımı, anomali */
  warning: { border: "border-warning-100", ribbon: "bg-warning-50" },
  /* Kritik — derhal aksiyon */
  critical: { border: "border-critical-50 ring-1 ring-critical-50", ribbon: "bg-critical-50" }
};
function nt({
  headline: e,
  why: a = [],
  /* string[] — bullet'lara dönüşür */
  confidence: s,
  /* 0-1 ya da 0-100 */
  confidenceLabel: n,
  /* opsiyonel custom label; yoksa otomatik band */
  tone: r = "neutral",
  badge: i,
  /* opsiyonel custom badge; yoksa "AI" rozetı */
  primaryActionLabel: d = "Uygula",
  onApply: l,
  onSnooze: m,
  onDismiss: c,
  pending: o,
  /* 'apply' | 'snooze' | 'dismiss' | null */
  className: u,
  children: f
  /* ekstra içerik — örn. before/after diff snippet */
}) {
  const [h, p] = z.useState(!1), v = Y[r] ?? Y.neutral, N = Array.isArray(a) && a.length > 0, E = !!o;
  return /* @__PURE__ */ t.jsxs(
    "article",
    {
      className: g(
        "rounded-md border bg-surface-base",
        "transition-opacity duration-fast",
        v.border,
        E && "opacity-60",
        u
      ),
      "data-suggestion-tone": r,
      children: [
        v.ribbon && /* Tone ribbon — sade renk şeridi; arka planı ezmeden tonu işaret eder */
        /* @__PURE__ */ t.jsx("div", { className: g("h-1 rounded-t-md", v.ribbon), "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsxs("div", { className: "p-3 flex flex-col gap-2", children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            i ?? /* @__PURE__ */ t.jsx(A, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
            /* @__PURE__ */ t.jsx(B, { score: s, label: n, size: "md" })
          ] }),
          /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug text-balance", children: e }),
          f,
          N && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx(
              "button",
              {
                type: "button",
                onClick: () => p((C) => !C),
                "aria-expanded": h,
                className: g(
                  "self-start text-xs text-text-link hover:underline",
                  "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
                ),
                children: h ? "Açıklamayı gizle" : "Neden bu öneri?"
              }
            ),
            h && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: a.map((C, L) => /* @__PURE__ */ t.jsx("li", { children: C }, L)) })
          ] }),
          /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
            c && /* @__PURE__ */ t.jsx(
              k,
              {
                size: "sm",
                variant: "ghost",
                onClick: c,
                isLoading: o === "dismiss",
                disabled: E && o !== "dismiss",
                children: "İlgisiz"
              }
            ),
            m && /* @__PURE__ */ t.jsx(
              k,
              {
                size: "sm",
                variant: "ghost",
                onClick: m,
                isLoading: o === "snooze",
                disabled: E && o !== "snooze",
                children: "Sonra"
              }
            ),
            l && /* @__PURE__ */ t.jsx(
              k,
              {
                size: "sm",
                variant: r === "critical" ? "destructive" : "primary",
                onClick: l,
                isLoading: o === "apply",
                disabled: E && o !== "apply",
                children: d
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const it = () => b.riskAlerts();
function rt() {
  return D({
    queryKey: x.dashboard.risks(),
    queryFn: it
  });
}
function lt() {
  return R({
    queryKey: x.dashboard.risks(),
    mutationFn: (e) => b.dismissRisk(e),
    errorMessage: "Uyarı reddedilemedi"
  });
}
function ot() {
  return R({
    queryKey: x.dashboard.risks(),
    mutationFn: (e) => b.acceptRisk(e),
    undoMessage: (e) => `Uygulandı: ${e.title}`,
    undoFn: (e) => b.dismissRisk(e),
    errorMessage: "Aksiyon uygulanamadı"
  });
}
const P = {
  critical: { label: "Kritik", variant: "critical", priority: 0 },
  actionable: { label: "Eyleme açık", variant: "warning", priority: 1 },
  info: { label: "Bilgi", variant: "ai", priority: 2 }
};
function ct() {
  const { data: e, isLoading: a, isError: s, isFetching: n, isStale: r, dataUpdatedAt: i, refetch: d } = rt(), l = lt(), m = ot(), c = () => d(), o = (h) => l.mutateAsync(h).catch(() => {
  }), u = (h) => m.mutateAsync(h).catch(() => {
  }), f = z.useMemo(
    () => [...e ?? []].sort(
      (h, p) => P[h.severity].priority - P[p.severity].priority
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
      isStale: r,
      dataUpdatedAt: i,
      onRetry: c,
      skeleton: /* @__PURE__ */ t.jsx(K, { rows: 3, withTrailing: !1 }),
      isEmpty: !a && !s && f.length === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        _,
        {
          compact: !0,
          variant: "success",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✓" }),
          title: "Görünen risk yok",
          description: "AI motoru taramayı tamamladı. Yeni veri geldikçe burada görünecek."
        }
      ),
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: f.map((h) => /* @__PURE__ */ t.jsx(
        dt,
        {
          risk: h,
          onAccept: u,
          onDismiss: o
        },
        h.id
      )) })
    }
  );
}
function dt({ risk: e, onAccept: a, onDismiss: s }) {
  const [n, r] = z.useState(!1), [i, d] = z.useState(null), l = P[e.severity], m = async (c, o) => {
    if (!i) {
      d(c);
      try {
        await (o == null ? void 0 : o(e));
      } finally {
        d(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsx("li", { className: g(
    "rounded-md border bg-surface-base",
    "transition-opacity duration-fast",
    e.severity === "critical" && "border-critical-50 bg-critical-50",
    e.severity === "actionable" && "border-warning-100",
    e.severity === "info" && "border-subtle",
    i && "opacity-60"
  ), children: /* @__PURE__ */ t.jsxs("div", { className: "p-2.5 flex flex-col gap-2", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t.jsx(A, { variant: l.variant, size: "sm", withDot: !0, children: l.label }),
      /* @__PURE__ */ t.jsx(B, { score: e.confidence, label: e.confidenceLabel, size: "md" })
    ] }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug", children: e.title }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: () => r((c) => !c),
        "aria-expanded": n,
        className: g(
          "self-start text-xs text-text-link hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: n ? "Açıklamayı gizle" : "Neden bu öneri?"
      }
    ),
    n && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: e.reasons.map((c, o) => /* @__PURE__ */ t.jsx("li", { children: c }, o)) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
      /* @__PURE__ */ t.jsx(
        k,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => m("dismiss", s),
          isLoading: i === "dismiss",
          children: "Şimdi değil"
        }
      ),
      /* @__PURE__ */ t.jsx(
        k,
        {
          size: "sm",
          variant: e.severity === "critical" ? "destructive" : "primary",
          onClick: () => m("accept", a),
          isLoading: i === "accept",
          children: e.suggestedAction
        }
      )
    ] })
  ] }) });
}
const ut = () => b.aiSuggestions();
function mt() {
  return D({
    queryKey: x.dashboard.aiSuggestions(),
    queryFn: ut
  });
}
function ht() {
  return R({
    queryKey: x.dashboard.aiSuggestions(),
    mutationFn: (e) => b.applySuggestion(e),
    undoMessage: (e) => `Uygulandı: ${e.headline}`,
    /* Server reverse henüz yok — undo cache restore'la sınırlı (factory zaten
       previous'ı koyar). Reverse hazırlanınca undoFn dolar. */
    undoFn: () => Promise.resolve(),
    errorMessage: "Öneri uygulanamadı"
  });
}
function xt() {
  return R({
    queryKey: x.dashboard.aiSuggestions(),
    mutationFn: (e) => b.snoozeSuggestion(e),
    errorMessage: "Erteleme başarısız"
  });
}
function ft() {
  return R({
    queryKey: x.dashboard.aiSuggestions(),
    mutationFn: ({ suggestion: e, reason: a }) => b.dismissSuggestion(e, a),
    extractTarget: ({ suggestion: e }) => e,
    errorMessage: "Reddetme kaydedilemedi"
  });
}
const gt = 5, yt = 0.3;
function pt() {
  const { data: e, isLoading: a, isError: s, isFetching: n, isStale: r, dataUpdatedAt: i, refetch: d } = mt(), l = ht(), m = xt(), c = ft(), o = z.useMemo(() => (e ?? []).filter(
    (h) => B.normalize(h.confidence) >= yt
  ).slice(0, gt), [e]), u = ((e == null ? void 0 : e.length) ?? 0) - o.length;
  return /* @__PURE__ */ t.jsx(
    S,
    {
      title: "AI önerileri",
      subtitle: "Sessiz inbox — sen bakmak istediğinde",
      badge: /* @__PURE__ */ t.jsx(A, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
      isLoading: a,
      isError: s,
      isFetching: n,
      isStale: r,
      dataUpdatedAt: i,
      onRetry: () => d(),
      skeleton: /* @__PURE__ */ t.jsx(K, { rows: 3, withLeading: !1 }),
      isEmpty: !a && !s && o.length === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        _,
        {
          compact: !0,
          variant: "info",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✦" }),
          title: "AI şu an sessiz",
          description: "Anlamlı bir öneri çıkarsa burada gözükecek. Şimdilik aksiyona gerek yok."
        }
      ),
      children: /* @__PURE__ */ t.jsxs("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: [
        o.map((f) => /* @__PURE__ */ t.jsx("li", { children: /* @__PURE__ */ t.jsx(
          bt,
          {
            suggestion: f,
            apply: l,
            snooze: m,
            dismiss: c
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
function bt({ suggestion: e, apply: a, snooze: s, dismiss: n }) {
  var i, d, l, m;
  const r = a.isPending && ((i = a.variables) == null ? void 0 : i.id) === e.id ? "apply" : s.isPending && ((d = s.variables) == null ? void 0 : d.id) === e.id ? "snooze" : n.isPending && ((m = (l = n.variables) == null ? void 0 : l.suggestion) == null ? void 0 : m.id) === e.id ? "dismiss" : null;
  return /* @__PURE__ */ t.jsx(
    nt,
    {
      headline: e.headline,
      why: e.why,
      confidence: e.confidence,
      tone: e.tone,
      primaryActionLabel: e.primaryActionLabel,
      pending: r,
      onApply: () => a.mutateAsync(e).catch(() => {
      }),
      onSnooze: () => s.mutateAsync(e).catch(() => {
      }),
      onDismiss: () => n.mutateAsync({ suggestion: e, reason: "irrelevant" }).catch(() => {
      })
    }
  );
}
const vt = F.WidthProvider(F.Responsive), jt = {
  "budget-health": Ge,
  "cash-flow": Qe,
  "pending-approvals": tt,
  "risk-alerts": ct,
  "ai-suggestions": pt
};
function wt() {
  const [e, a] = y.useState(() => Ce()), [s, n] = y.useState(!1), r = y.useMemo(() => {
    const o = T[e] ?? T.cfo, u = De(e);
    return u ? { ...o, ...u } : o;
  }, [e]), i = y.useCallback((o) => {
    a(o), Le(o);
  }, []), d = y.useCallback(
    (o, u) => {
      s && Me(e, u);
    },
    [s, e]
  ), l = y.useCallback(() => {
    _e(e), a(e);
  }, [e]), c = (r.desktop ?? []).map((o) => o.i);
  return /* @__PURE__ */ t.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ t.jsx(
      kt,
      {
        persona: e,
        onPersonaChange: i,
        editMode: s,
        onEditModeToggle: () => n((o) => !o),
        onReset: l
      }
    ),
    /* @__PURE__ */ t.jsx("main", { className: "px-4 py-4 mobile:px-2 mobile:py-2", children: /* @__PURE__ */ t.jsx(
      vt,
      {
        className: g("apya-bento", s && "apya-bento--edit"),
        layouts: r,
        breakpoints: Ae,
        cols: Re,
        rowHeight: Ee,
        margin: ze,
        isDraggable: s,
        isResizable: s,
        draggableHandle: `.${S.DRAG_HANDLE_CLASS}`,
        onLayoutChange: d,
        compactType: "vertical",
        preventCollision: !1,
        children: c.map((o) => {
          const u = jt[o];
          return u ? /* @__PURE__ */ t.jsx("div", { className: "apya-bento-item", children: /* @__PURE__ */ t.jsx(u, {}) }, o) : /* @__PURE__ */ t.jsx("div", { children: /* @__PURE__ */ t.jsx(S, { title: `Bilinmeyen widget: ${o}` }) }, o);
        })
      }
    ) }),
    s && /* @__PURE__ */ t.jsxs(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        className: g(
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
function kt({ persona: e, onPersonaChange: a, editMode: s, onEditModeToggle: n, onReset: r }) {
  return /* @__PURE__ */ t.jsxs("header", { className: g(
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
        ee[e],
        " görünümü"
      ] })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      /* @__PURE__ */ t.jsx(Nt, { value: e, onChange: a }),
      s ? /* @__PURE__ */ t.jsx(
        k,
        {
          size: "sm",
          variant: "secondary",
          onClick: r,
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
      /* @__PURE__ */ t.jsx(ue, {})
    ] })
  ] });
}
function Nt({ value: e, onChange: a }) {
  return /* @__PURE__ */ t.jsxs("label", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ t.jsx("span", { className: "sr-only", children: "Persona seç" }),
    /* @__PURE__ */ t.jsx(
      "select",
      {
        value: e,
        onChange: (s) => a(s.target.value),
        className: g(
          "h-10 px-3 text-sm rounded-md",
          "bg-surface-base text-text-primary",
          "border border-default",
          "hover:border-strong",
          "focus-visible:outline-none focus-visible:shadow-focus",
          "transition-colors duration-fast"
        ),
        children: Object.entries(ee).map(([s, n]) => /* @__PURE__ */ t.jsx("option", { value: s, children: n }, s))
      }
    )
  ] });
}
function St(e) {
  const { connection: a, state: s } = Z(), n = H();
  y.useEffect(() => {
    if (!a || !(e != null && e.length)) return;
    const r = e.map(([i, d]) => {
      const l = () => {
        d.forEach((m) => {
          n.invalidateQueries({ queryKey: m });
        });
      };
      return a.on(i, l), [i, l];
    });
    return () => {
      r.forEach(([i, d]) => {
        a.off(i, d);
      });
    };
  }, [a, s, n]);
}
function At(e) {
  const { connection: a, state: s } = Z(), n = H(), r = U();
  y.useEffect(() => {
    if (!a || !(e != null && e.length)) return;
    const i = e.map(([d, l]) => {
      const m = (c) => {
        var o;
        (o = l.queryKeys) == null || o.forEach(
          (u) => n.invalidateQueries({ queryKey: u })
        ), r.warning(l.message ?? "Bu kayıtta çakışma oldu", {
          description: l.description ?? (c == null ? void 0 : c.message),
          action: {
            label: "Yenile",
            onClick: () => {
              var u;
              (u = l.queryKeys) == null || u.forEach(
                (f) => n.invalidateQueries({ queryKey: f })
              );
            }
          }
        });
      };
      return a.on(d, m), [d, m];
    });
    return () => {
      i.forEach(([d, l]) => a.off(d, l));
    };
  }, [a, s, n]);
}
function Rt() {
  const e = y.useMemo(() => [
    ["JournalEntryPosted", [x.dashboard.budget(), x.dashboard.cashflow()]],
    ["ApprovalDecided", [x.dashboard.approvals(), x.dashboard.budget(), x.dashboard.cashflow()]],
    ["RiskDetected", [x.dashboard.risks()]],
    ["RiskDismissed", [x.dashboard.risks()]],
    ["AISuggestionPosted", [x.dashboard.aiSuggestions()]]
  ], []), a = y.useMemo(() => [
    ["ApprovalConflict", {
      queryKeys: [x.dashboard.approvals(), x.dashboard.budget(), x.dashboard.cashflow()],
      message: "Onay kaydında çakışma",
      description: "Bu kayıt başka bir kullanıcı tarafından işlendi."
    }],
    ["BudgetConflict", {
      queryKeys: [x.dashboard.budget()],
      message: "Bütçe kaydında çakışma",
      description: "Aynı bütçeyi başka bir kullanıcı güncelledi."
    }],
    ["SuggestionConflict", {
      queryKeys: [x.dashboard.aiSuggestions()],
      message: "AI önerisinde çakışma",
      description: "Bu öneri başka bir kullanıcı tarafından uygulanmış."
    }]
  ], []);
  return St(e), At(a), null;
}
me();
const Q = document.getElementById("apya-dashboard-root");
Q && ne(Q).render(
  /* @__PURE__ */ t.jsx(he, { children: /* @__PURE__ */ t.jsx(we, { children: /* @__PURE__ */ t.jsx(xe, { children: /* @__PURE__ */ t.jsx(fe, { children: /* @__PURE__ */ t.jsxs(be, { children: [
    /* @__PURE__ */ t.jsx(Rt, {}),
    /* @__PURE__ */ t.jsx(wt, {})
  ] }) }) }) }) })
);
