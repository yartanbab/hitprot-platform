import { r as p, j as t, e as R, d as oe } from "./react-vendor.js";
import { S as y, c as f, C as ce, a as de, b as ue, d as me, B as S, Q as m, f as J, e as T, g as xe, h as w, T as he, r as fe, i as ge, j as pe } from "./registerServiceWorker.js";
import { H as Z, a as ye, L as be } from "./signalr-vendor.js";
import { r as $ } from "./grid-vendor.js";
import { u as L, a as M, b as H } from "./query-vendor.js";
/* empty css      */
const X = p.createContext({
  connection: null,
  state: Z.Disconnected
});
function ve({ hubUrl: e = "/signalr-hubs/notifications", children: a, enabled: s = !0 }) {
  const [i, n] = p.useState(Z.Disconnected), r = p.useRef(null);
  p.useEffect(() => {
    if (!s || typeof window > "u") return;
    const l = new ye().withUrl(e, { withCredentials: !0 }).withAutomaticReconnect([0, 2e3, 5e3, 1e4, 3e4]).configureLogging(be.Warning).build();
    r.current = l, n(l.state);
    const d = () => n(l.state);
    return l.onreconnecting(d), l.onreconnected(d), l.onclose(d), l.start().then(d).catch((u) => {
      console.warn("[SignalR] connect failed:", u == null ? void 0 : u.message), d();
    }), () => {
      l.stop().catch(() => {
      }), r.current = null;
    };
  }, [e, s]);
  const c = p.useMemo(() => ({
    get connection() {
      return r.current;
    },
    state: i
  }), [i]);
  return /* @__PURE__ */ t.jsx(X.Provider, { value: c, children: a });
}
function je() {
  return p.useContext(X);
}
const _ = {
  triage: "(min-width: 768px)",
  analysis: "(min-width: 1280px)",
  command: "(min-width: 1920px)"
};
function we() {
  return typeof window > "u" || !window.matchMedia ? "analysis" : window.matchMedia(_.command).matches ? "command" : window.matchMedia(_.analysis).matches ? "analysis" : window.matchMedia(_.triage).matches ? "triage" : "decision";
}
const ke = p.createContext(null);
function Ne({ children: e, override: a }) {
  const s = p.useCallback((r) => {
    if (typeof window > "u" || !window.matchMedia) return () => {
    };
    const c = Object.values(_).map((l) => window.matchMedia(l));
    return c.forEach((l) => l.addEventListener("change", r)), () => c.forEach((l) => l.removeEventListener("change", r));
  }, []), i = p.useSyncExternalStore(s, we, () => "analysis"), n = a ?? i;
  return p.useEffect(() => {
    typeof document > "u" || (document.documentElement.dataset.deviceMode = n);
  }, [n]), /* @__PURE__ */ t.jsx(ke.Provider, { value: n, children: e });
}
const Se = {
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
}, Ae = {
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
}, Re = {
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
}, P = {
  cfo: Se,
  pm: Ae,
  field: Re
}, ee = {
  cfo: "CFO / Finansman",
  pm: "Proje Yöneticisi",
  field: "Saha Kullanıcısı"
}, De = {
  desktop: 1280,
  tablet: 768,
  mobile: 0
}, ze = {
  desktop: 12,
  tablet: 8,
  mobile: 1
}, Ee = 64, Le = [12, 12], te = "apya-dashboard-persona", K = "apya-dashboard-layout-overrides";
function Ce() {
  if (typeof window > "u") return "cfo";
  try {
    const e = window.localStorage.getItem(te);
    if (e && P[e]) return e;
  } catch {
  }
  return "cfo";
}
function _e(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(te, e);
    } catch {
    }
}
function Me(e) {
  if (typeof window > "u") return null;
  try {
    const a = window.localStorage.getItem(`${K}-${e}`);
    return a ? JSON.parse(a) : null;
  } catch {
    return null;
  }
}
function Ie(e, a) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(
        `${K}-${e}`,
        JSON.stringify(a)
      );
    } catch {
    }
}
function Te(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.removeItem(`${K}-${e}`);
    } catch {
    }
}
function ae({ className: e, withDelta: a = !0, withBar: s = !1 }) {
  return /* @__PURE__ */ t.jsxs("div", { className: f("flex flex-col gap-3 h-full", e), "aria-busy": "true", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-baseline gap-2", children: [
      /* @__PURE__ */ t.jsx(y, { width: 140, height: 32, rounded: "md" }),
      /* @__PURE__ */ t.jsx(y, { width: 70, height: 16, rounded: "sm" })
    ] }),
    a && /* @__PURE__ */ t.jsx(y, { width: 180, height: 12, rounded: "sm" }),
    s && /* @__PURE__ */ t.jsx(y, { height: 6, rounded: "full" })
  ] });
}
function Pe({ className: e, height: a = 64 }) {
  const s = [0.4, 0.55, 0.45, 0.7, 0.6, 0.8, 0.65, 0.85, 0.75, 0.9, 0.7, 0.95];
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      className: f("flex items-end justify-between gap-1 w-full", e),
      style: { height: a },
      "aria-busy": "true",
      children: s.map((i, n) => /* @__PURE__ */ t.jsx(
        y,
        {
          height: `${i * 100}%`,
          className: "flex-1 min-w-0",
          rounded: "sm"
        },
        n
      ))
    }
  );
}
function O({ rows: e = 4, withLeading: a = !0, withTrailing: s = !0, className: i }) {
  return /* @__PURE__ */ t.jsx("ul", { className: f("flex flex-col gap-2", i), "aria-busy": "true", children: Array.from({ length: e }).map((n, r) => /* @__PURE__ */ t.jsxs(
    "li",
    {
      className: "flex items-center gap-3 p-2 rounded-md border border-subtle bg-surface-base",
      children: [
        a && /* @__PURE__ */ t.jsx(y, { width: 32, height: 32, rounded: "md" }),
        /* @__PURE__ */ t.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
          /* @__PURE__ */ t.jsx(y, { height: 12, className: r % 2 === 0 ? "w-3/4" : "w-2/3" }),
          /* @__PURE__ */ t.jsx(y, { height: 10, className: "w-1/2" })
        ] }),
        s && /* @__PURE__ */ t.jsx(y, { width: 64, height: 12, rounded: "sm" })
      ]
    },
    r
  )) });
}
const G = {
  default: { ring: "bg-neutral-100 text-neutral-500", text: "text-text-tertiary" },
  success: { ring: "bg-positive-50 text-positive-600", text: "text-text-secondary" },
  info: { ring: "bg-brand-50 text-brand-600", text: "text-text-secondary" }
};
function I({
  icon: e,
  title: a,
  description: s,
  action: i,
  /* ReactNode — Button, link vs. */
  variant: n = "default",
  compact: r = !1,
  /* compact: ikonu küçült, padding düşür — Bento widget için */
  className: c
}) {
  const l = G[n] ?? G.default;
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      role: "status",
      "aria-live": "polite",
      className: f(
        "flex flex-col items-center justify-center text-center",
        r ? "gap-2 py-3" : "gap-3 py-6",
        c
      ),
      children: [
        e && /* @__PURE__ */ t.jsx(
          "span",
          {
            className: f(
              "inline-flex items-center justify-center rounded-full",
              l.ring,
              r ? "h-8 w-8" : "h-12 w-12"
            ),
            "aria-hidden": "true",
            children: e
          }
        ),
        a && /* @__PURE__ */ t.jsx("p", { className: f(
          "font-medium text-text-primary",
          r ? "text-sm" : "text-base"
        ), children: a }),
        s && /* @__PURE__ */ t.jsx("p", { className: f("max-w-sm", l.text, r ? "text-xs" : "text-sm"), children: s }),
        i && /* @__PURE__ */ t.jsx("div", { className: "mt-1", children: i })
      ]
    }
  );
}
const se = {
  /* react-grid-layout drag handle'ı için class — yalnızca header'dan sürüklenir */
  DRAG_HANDLE_CLASS: "widget-drag-handle"
};
function N({
  title: e,
  subtitle: a,
  badge: s,
  actions: i,
  /* sağ üstteki action button'lar */
  isLoading: n = !1,
  isError: r = !1,
  errorMessage: c,
  onRetry: l,
  isEmpty: d = !1,
  emptyMessage: u,
  /* legacy: tek satır metin; yeni kod emptyState kullanmalı */
  emptyState: o,
  /* yeni: <EmptyState .../> ReactNode */
  skeleton: x,
  /* yeni: shape-aware loading state — ReactNode */
  isFetching: g = !1,
  /* React Query background refetch */
  isStale: h = !1,
  /* React Query staleTime aşıldı */
  dataUpdatedAt: k,
  /* number (ms) | Date | undefined — son başarılı fetch */
  density: j = "compact",
  children: D,
  className: A
}) {
  const z = !n && !r && h && g;
  return /* @__PURE__ */ t.jsxs(ce, { variant: "default", className: f("h-full flex flex-col", A), children: [
    /* @__PURE__ */ t.jsxs(
      de,
      {
        density: j,
        className: f(
          se.DRAG_HANDLE_CLASS,
          "cursor-grab active:cursor-grabbing select-none",
          "flex-row items-center justify-between flex-none"
        ),
        children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0 flex-1", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ t.jsx(ue, { className: "text-sm font-semibold truncate", children: e }),
              s,
              z && /* @__PURE__ */ t.jsx(Oe, {})
            ] }),
            a && /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary truncate", children: a })
          ] }),
          i && /* @__PURE__ */ t.jsx(
            "div",
            {
              className: "flex items-center gap-1 flex-none",
              onMouseDown: (E) => E.stopPropagation(),
              onTouchStart: (E) => E.stopPropagation(),
              children: i
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ t.jsxs(me, { density: j, className: "flex-1 overflow-auto", children: [
      r && /* @__PURE__ */ t.jsx(
        Ke,
        {
          message: c,
          onRetry: l,
          dataUpdatedAt: k
        }
      ),
      !r && n && (x ?? /* @__PURE__ */ t.jsx(Be, { density: j })),
      !r && !n && d && (o ?? /* @__PURE__ */ t.jsx(He, { message: u })),
      !r && !n && !d && D
    ] })
  ] });
}
function Be({ density: e }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3", "aria-busy": "true", children: [
    /* @__PURE__ */ t.jsx(y, { height: e === "spacious" ? 48 : 32, className: "w-1/3" }),
    /* @__PURE__ */ t.jsx(y, { height: 16 }),
    /* @__PURE__ */ t.jsx(y, { height: 16, className: "w-5/6" }),
    /* @__PURE__ */ t.jsx(y, { height: 16, className: "w-3/4" })
  ] });
}
function He({ message: e }) {
  return /* @__PURE__ */ t.jsx(
    I,
    {
      compact: !0,
      title: e ?? "Görüntülenecek veri yok",
      description: "Yeni veri girildiğinde burada görünecek."
    }
  );
}
function Ke({ message: e, onRetry: a, dataUpdatedAt: s }) {
  const i = Fe(s);
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col items-center justify-center text-center gap-2 py-4", children: [
    /* @__PURE__ */ t.jsx(S, { variant: "negative", withDot: !0, children: "Yüklenemedi" }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-secondary max-w-xs", children: e || "Veri alınırken bir hata oluştu." }),
    i && /* Son başarılı snapshot — kullanıcı "veri ne kadar eski" bilsin.
    Critical UX: kullanıcı kararlarını eski veriyle vermesin diye. */
    /* @__PURE__ */ t.jsxs("p", { className: "text-xs text-text-tertiary", children: [
      "Son başarılı güncelleme: ",
      i
    ] }),
    a && /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: a,
        className: f(
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
function Fe(e) {
  if (e == null) return null;
  const a = e instanceof Date ? e.getTime() : Number(e);
  if (!Number.isFinite(a)) return null;
  const s = Math.round((a - Date.now()) / 1e3), i = Math.abs(s), n = new Intl.RelativeTimeFormat("tr-TR", { numeric: "auto" });
  return i < 60 ? n.format(s, "second") : i < 3600 ? n.format(Math.round(s / 60), "minute") : i < 86400 ? n.format(Math.round(s / 3600), "hour") : n.format(Math.round(s / 86400), "day");
}
N.DRAG_HANDLE_CLASS = se.DRAG_HANDLE_CLASS;
const W = 250, $e = 450;
function b(e = W + Math.random() * ($e - W)) {
  return new Promise((a) => setTimeout(a, e));
}
const v = {
  async budgetSummary() {
    return await b(), {
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
    return await b(), {
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
    return await b(), [
      { id: "inv-001", type: "invoice", title: "TÜBİTAK 1501 — Eylül faturası", requester: "Ahmet Yıldız", amount: 12450, currency: "TRY", ageHours: 4 },
      { id: "exp-002", type: "expense", title: "Yazılım lisansı — JetBrains All", requester: "Mehmet Kaya", amount: 8240, currency: "TRY", ageHours: 18 },
      { id: "po-003", type: "po", title: "Bulut hosting (Q3 yenileme)", requester: "Zeynep Aksoy", amount: 24900, currency: "TRY", ageHours: 36 },
      { id: "inv-004", type: "invoice", title: "KOSGEB danışmanlık — Ağustos", requester: "Selin Aydın", amount: 6800, currency: "TRY", ageHours: 52 }
    ];
  },
  async approveItem(e) {
    if (await b(600), Math.random() < 0.05) {
      const a = new Error("Bu kayıt başka bir kullanıcı tarafından onaylanmış.");
      throw a.status = 409, a;
    }
    return { id: e.id, status: "approved" };
  },
  async rejectItem(e) {
    return await b(400), { id: e.id, status: "rejected" };
  },
  async riskAlerts() {
    return await b(), [
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
    return await b(300), { id: e.id, dismissed: !0 };
  },
  async acceptRisk(e) {
    return await b(500), { id: e.id, accepted: !0 };
  },
  /* AI suggestion inbox — dashboard widget'ı için top-N öneri.
     Risk alerts'ten ayrı: risk = "neye dikkat", suggestion = "ne yap".
     Tone: opportunity | warning | critical | neutral */
  async aiSuggestions() {
    return await b(), [
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
    if (await b(500), Math.random() < 0.03) {
      const a = new Error("Bu öneri başka bir kullanıcı tarafından uygulanmış.");
      throw a.status = 409, a;
    }
    return { id: e.id, applied: !0 };
  },
  async snoozeSuggestion(e) {
    return await b(250), { id: e.id, snoozed: !0, until: new Date(Date.now() + 7 * 864e5).toISOString() };
  },
  async dismissSuggestion(e, a = "irrelevant") {
    return await b(250), { id: e.id, dismissed: !0, reason: a };
  }
}, Ge = () => v.budgetSummary();
function We() {
  return L({
    queryKey: m.dashboard.budget(),
    queryFn: Ge
  });
}
function qe() {
  const { data: e, isLoading: a, isError: s, isFetching: i, isStale: n, dataUpdatedAt: r, refetch: c } = We(), l = () => c(), d = e ? e.spent / e.budget * 100 : 0, u = q(d), o = e ? J(e.deltaPct) : null;
  return /* @__PURE__ */ t.jsx(
    N,
    {
      title: "Bütçe Sağlığı",
      subtitle: "Tüm aktif projeler — bu ay",
      badge: /* @__PURE__ */ t.jsx(S, { variant: u.badgeVariant, size: "sm", withDot: !0, children: u.label }),
      isLoading: a,
      isError: s,
      isFetching: i,
      isStale: n,
      dataUpdatedAt: r,
      onRetry: l,
      skeleton: /* @__PURE__ */ t.jsx(ae, { withDelta: !0, withBar: !0 }),
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-baseline gap-2 font-tabular", children: [
          /* @__PURE__ */ t.jsx("span", { className: "text-3xl font-semibold tracking-tight", children: T(e.spent, e.currency) }),
          /* @__PURE__ */ t.jsxs("span", { className: "text-sm text-text-tertiary", children: [
            "/ ",
            T(e.budget, e.currency)
          ] })
        ] }),
        o && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1.5 text-xs", children: [
          /* @__PURE__ */ t.jsxs("span", { className: f(
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
        /* @__PURE__ */ t.jsx(Qe, { value: d, variant: u.barVariant }),
        /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-1.5 mt-1 overflow-y-auto", children: e.breakdown.map((x) => /* @__PURE__ */ t.jsxs(
          "li",
          {
            className: "flex items-center justify-between text-xs gap-3",
            children: [
              /* @__PURE__ */ t.jsx("span", { className: "truncate text-text-secondary", children: x.project }),
              /* @__PURE__ */ t.jsxs("span", { className: f(
                "font-tabular font-medium",
                q(x.ratio * 100).textVariant
              ), children: [
                Math.round(x.ratio * 100),
                "%"
              ] })
            ]
          },
          x.project
        )) })
      ] })
    }
  );
}
function q(e) {
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
function Qe({ value: e, variant: a = "positive" }) {
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
          className: f(
            s,
            "h-full rounded-full transition-all duration-slow ease-standard"
          ),
          style: { width: `${Math.min(e, 100)}%` }
        }
      )
    }
  );
}
const Ye = () => v.cashFlow();
function Ve() {
  return L({
    queryKey: m.dashboard.cashflow(),
    queryFn: Ye
  });
}
function Ue() {
  const { data: e, isLoading: a, isError: s, isFetching: i, isStale: n, dataUpdatedAt: r, refetch: c } = Ve(), l = () => c(), d = e ? J(e.deltaPct) : null, u = e ? e.deltaPct >= 0 : !0;
  return /* @__PURE__ */ t.jsx(
    N,
    {
      title: "Nakit Akışı",
      subtitle: "Son 30 gün",
      isLoading: a,
      isError: s,
      isFetching: i,
      isStale: n,
      dataUpdatedAt: r,
      onRetry: l,
      skeleton: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-4 h-full", children: [
        /* @__PURE__ */ t.jsx(ae, { className: "flex-none" }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx(Pe, { height: 64 }) })
      ] }),
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-4 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 flex-none", children: [
          /* @__PURE__ */ t.jsx("div", { className: "text-2xl font-semibold tracking-tight font-tabular", children: T(e.netCurrent, e.currency) }),
          d && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 text-xs", children: [
            /* @__PURE__ */ t.jsxs("span", { className: f(
              "inline-flex items-center gap-1 font-medium font-tabular",
              u ? "text-text-positive" : "text-text-negative"
            ), children: [
              d.symbol,
              " ",
              d.text
            ] }),
            /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: "vs önceki dönem" })
          ] })
        ] }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx(Je, { series: e.series, variant: u ? "positive" : "negative" }) })
      ] })
    }
  );
}
function Je({ series: e, variant: a = "positive" }) {
  const i = `cashflow-grad-${p.useId().replace(/:/g, "")}`;
  if (!e || e.length < 2) return null;
  const n = 100, r = 40, c = Math.min(...e), d = Math.max(...e) - c || 1, o = e.map((h, k) => {
    const j = k / (e.length - 1) * n, D = r - (h - c) / d * r;
    return [j, D];
  }).map(([h, k], j) => `${j === 0 ? "M" : "L"} ${h.toFixed(2)} ${k.toFixed(2)}`).join(" "), x = `${o} L ${n} ${r} L 0 ${r} Z`, g = a === "positive" ? "var(--apya-positive-500)" : "var(--apya-negative-500)";
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      viewBox: `0 0 ${n} ${r}`,
      preserveAspectRatio: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ t.jsx("defs", { children: /* @__PURE__ */ t.jsxs("linearGradient", { id: i, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ t.jsx("stop", { offset: "0%", stopColor: g, stopOpacity: "0.25" }),
          /* @__PURE__ */ t.jsx("stop", { offset: "100%", stopColor: g, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ t.jsx("path", { d: x, fill: `url(#${i})` }),
        /* @__PURE__ */ t.jsx(
          "path",
          {
            d: o,
            fill: "none",
            stroke: g,
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
const Ze = () => v.pendingApprovals();
function Xe() {
  return L({
    queryKey: m.dashboard.approvals(),
    queryFn: Ze
  });
}
function ne(e) {
  const a = M();
  return H({
    mutationFn: e,
    onMutate: async (s) => {
      await a.cancelQueries({ queryKey: m.dashboard.approvals() });
      const i = a.getQueryData(m.dashboard.approvals());
      return a.setQueryData(
        m.dashboard.approvals(),
        (n = []) => n.filter((r) => r.id !== s.id)
      ), { previous: i, item: s };
    },
    onError: (s, i, n) => {
      n != null && n.previous && a.setQueryData(m.dashboard.approvals(), n.previous);
    },
    onSettled: () => {
      a.invalidateQueries({ queryKey: m.dashboard.approvals() }), a.invalidateQueries({ queryKey: m.dashboard.budget() }), a.invalidateQueries({ queryKey: m.dashboard.cashflow() });
    }
  });
}
function et() {
  return ne((e) => v.approveItem(e));
}
function tt() {
  return ne((e) => v.rejectItem(e));
}
const Q = {
  invoice: { label: "Fatura", variant: "brand" },
  expense: { label: "Masraf", variant: "neutral" },
  po: { label: "Sipariş", variant: "ai" }
};
function at() {
  const { data: e, isLoading: a, isError: s, isFetching: i, isStale: n, dataUpdatedAt: r, refetch: c } = Xe(), l = et(), d = tt(), u = () => c(), o = (h) => l.mutateAsync(h).catch(() => {
  }), x = (h) => d.mutateAsync(h).catch(() => {
  }), g = (e == null ? void 0 : e.length) ?? 0;
  return /* @__PURE__ */ t.jsx(
    N,
    {
      title: "Onay Bekleyenler",
      subtitle: g > 0 ? `${g} kalem inceleme bekliyor` : void 0,
      badge: g > 0 && /* @__PURE__ */ t.jsx(S, { variant: "warning", size: "sm", withDot: !0, children: g }),
      isLoading: a,
      isError: s,
      isFetching: i,
      isStale: n,
      dataUpdatedAt: r,
      onRetry: u,
      skeleton: /* @__PURE__ */ t.jsx(O, { rows: 4 }),
      isEmpty: !a && !s && g === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        I,
        {
          compact: !0,
          variant: "success",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✓" }),
          title: "Hepsi tamam",
          description: "Bugün karar bekleyen kalmadı."
        }
      ),
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: e == null ? void 0 : e.map((h) => /* @__PURE__ */ t.jsx(
        st,
        {
          item: h,
          onApprove: o,
          onReject: x
        },
        h.id
      )) })
    }
  );
}
function st({ item: e, onApprove: a, onReject: s }) {
  const [i, n] = R.useState(null), r = Q[e.type] ?? Q.expense, c = nt(e.ageHours), l = async (d, u) => {
    if (!i) {
      n(d);
      try {
        await (u == null ? void 0 : u(e));
      } finally {
        n(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsxs("li", { className: f(
    "flex items-center gap-3 p-2.5 rounded-md",
    "bg-surface-base border border-subtle",
    "transition-opacity duration-fast",
    i && "opacity-60"
  ), children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 min-w-0 flex-1", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(S, { variant: r.variant, size: "sm", children: r.label }),
        /* @__PURE__ */ t.jsxs("span", { className: "text-xs text-text-tertiary truncate", children: [
          e.requester,
          " · ",
          c
        ] })
      ] }),
      /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary truncate", children: e.title })
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "font-tabular font-semibold text-sm text-text-primary flex-none", children: xe(e.amount, e.currency) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 flex-none", children: [
      /* @__PURE__ */ t.jsx(
        w,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => l("reject", s),
          isLoading: i === "reject",
          "aria-label": `${e.title} reddet`,
          className: "text-text-negative hover:bg-negative-50 hover:text-negative-700",
          children: "Reddet"
        }
      ),
      /* @__PURE__ */ t.jsx(
        w,
        {
          size: "sm",
          variant: "primary",
          onClick: () => l("approve", a),
          isLoading: i === "approve",
          "aria-label": `${e.title} onayla`,
          children: "Onayla"
        }
      )
    ] })
  ] });
}
function nt(e) {
  return e < 1 ? "az önce" : e < 24 ? `${Math.round(e)} sa önce` : `${Math.floor(e / 24)} gün önce`;
}
const Y = {
  sm: { dot: "h-1 w-1", gap: "gap-0.5" },
  md: { dot: "h-1.5 w-1.5", gap: "gap-0.5" },
  lg: { dot: "h-2 w-2", gap: "gap-1" }
};
function ie(e) {
  return typeof e != "number" || !Number.isFinite(e) ? 0 : e > 1 ? Math.max(0, Math.min(100, e)) / 100 : Math.max(0, Math.min(1, e));
}
function re(e) {
  return e >= 0.85 ? { dots: 5, label: "Çok yüksek güven" } : e >= 0.7 ? { dots: 4, label: "Yüksek güven" } : e >= 0.5 ? { dots: 3, label: "Orta güven" } : e >= 0.3 ? { dots: 2, label: "Düşük güven" } : { dots: 1, label: "Çok düşük güven" };
}
function C({ score: e, label: a, size: s = "md", showLabel: i = !0, className: n }) {
  const r = ie(e), c = re(r), l = Y[s] ?? Y.md, d = a ?? c.label, u = Math.round(r * 100);
  return /* @__PURE__ */ t.jsxs(
    "span",
    {
      className: f("inline-flex items-center gap-1 text-xs text-text-tertiary", n),
      title: `${c.label} (%${u})`,
      children: [
        /* @__PURE__ */ t.jsx("span", { className: f("inline-flex items-center", l.gap), "aria-hidden": "true", children: Array.from({ length: 5 }, (o, x) => /* @__PURE__ */ t.jsx(
          "span",
          {
            className: f(
              "inline-block rounded-full",
              l.dot,
              x < c.dots ? "bg-ai-500" : "bg-neutral-200"
            )
          },
          x
        )) }),
        i && /* @__PURE__ */ t.jsx("span", { "aria-hidden": "true", children: d }),
        /* @__PURE__ */ t.jsxs("span", { className: "sr-only", children: [
          "Güven düzeyi: ",
          c.label,
          " (%",
          u,
          ")"
        ] })
      ]
    }
  );
}
C.bandFor = re;
C.normalize = ie;
const V = {
  /* Neutral default — AI'ın sakin, ısrarsız tonu */
  neutral: { border: "border-default", ribbon: null },
  /* Pozitif — fırsat, gelişim önerisi */
  opportunity: { border: "border-positive-100", ribbon: "bg-positive-50" },
  /* Uyarı — bütçe aşımı, anomali */
  warning: { border: "border-warning-100", ribbon: "bg-warning-50" },
  /* Kritik — derhal aksiyon */
  critical: { border: "border-critical-50 ring-1 ring-critical-50", ribbon: "bg-critical-50" }
};
function it({
  headline: e,
  why: a = [],
  /* string[] — bullet'lara dönüşür */
  confidence: s,
  /* 0-1 ya da 0-100 */
  confidenceLabel: i,
  /* opsiyonel custom label; yoksa otomatik band */
  tone: n = "neutral",
  badge: r,
  /* opsiyonel custom badge; yoksa "AI" rozetı */
  primaryActionLabel: c = "Uygula",
  onApply: l,
  onSnooze: d,
  onDismiss: u,
  pending: o,
  /* 'apply' | 'snooze' | 'dismiss' | null */
  className: x,
  children: g
  /* ekstra içerik — örn. before/after diff snippet */
}) {
  const [h, k] = R.useState(!1), j = V[n] ?? V.neutral, D = Array.isArray(a) && a.length > 0, A = !!o;
  return /* @__PURE__ */ t.jsxs(
    "article",
    {
      className: f(
        "rounded-md border bg-surface-base",
        "transition-opacity duration-fast",
        j.border,
        A && "opacity-60",
        x
      ),
      "data-suggestion-tone": n,
      children: [
        j.ribbon && /* Tone ribbon — sade renk şeridi; arka planı ezmeden tonu işaret eder */
        /* @__PURE__ */ t.jsx("div", { className: f("h-1 rounded-t-md", j.ribbon), "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsxs("div", { className: "p-3 flex flex-col gap-2", children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            r ?? /* @__PURE__ */ t.jsx(S, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
            /* @__PURE__ */ t.jsx(C, { score: s, label: i, size: "md" })
          ] }),
          /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug text-balance", children: e }),
          g,
          D && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx(
              "button",
              {
                type: "button",
                onClick: () => k((z) => !z),
                "aria-expanded": h,
                className: f(
                  "self-start text-xs text-text-link hover:underline",
                  "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
                ),
                children: h ? "Açıklamayı gizle" : "Neden bu öneri?"
              }
            ),
            h && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: a.map((z, E) => /* @__PURE__ */ t.jsx("li", { children: z }, E)) })
          ] }),
          /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
            u && /* @__PURE__ */ t.jsx(
              w,
              {
                size: "sm",
                variant: "ghost",
                onClick: u,
                isLoading: o === "dismiss",
                disabled: A && o !== "dismiss",
                children: "İlgisiz"
              }
            ),
            d && /* @__PURE__ */ t.jsx(
              w,
              {
                size: "sm",
                variant: "ghost",
                onClick: d,
                isLoading: o === "snooze",
                disabled: A && o !== "snooze",
                children: "Sonra"
              }
            ),
            l && /* @__PURE__ */ t.jsx(
              w,
              {
                size: "sm",
                variant: n === "critical" ? "destructive" : "primary",
                onClick: l,
                isLoading: o === "apply",
                disabled: A && o !== "apply",
                children: c
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const rt = () => v.riskAlerts();
function lt() {
  return L({
    queryKey: m.dashboard.risks(),
    queryFn: rt
  });
}
function le(e) {
  const a = M();
  return H({
    mutationFn: e,
    onMutate: async (s) => {
      await a.cancelQueries({ queryKey: m.dashboard.risks() });
      const i = a.getQueryData(m.dashboard.risks());
      return a.setQueryData(
        m.dashboard.risks(),
        (n = []) => n.filter((r) => r.id !== s.id)
      ), { previous: i };
    },
    onError: (s, i, n) => {
      n != null && n.previous && a.setQueryData(m.dashboard.risks(), n.previous);
    },
    onSettled: () => {
      a.invalidateQueries({ queryKey: m.dashboard.risks() });
    }
  });
}
function ot() {
  return le((e) => v.dismissRisk(e));
}
function ct() {
  return le((e) => v.acceptRisk(e));
}
const B = {
  critical: { label: "Kritik", variant: "critical", priority: 0 },
  actionable: { label: "Eyleme açık", variant: "warning", priority: 1 },
  info: { label: "Bilgi", variant: "ai", priority: 2 }
};
function dt() {
  const { data: e, isLoading: a, isError: s, isFetching: i, isStale: n, dataUpdatedAt: r, refetch: c } = lt(), l = ot(), d = ct(), u = () => c(), o = (h) => l.mutateAsync(h).catch(() => {
  }), x = (h) => d.mutateAsync(h).catch(() => {
  }), g = R.useMemo(
    () => [...e ?? []].sort(
      (h, k) => B[h.severity].priority - B[k.severity].priority
    ),
    [e]
  );
  return /* @__PURE__ */ t.jsx(
    N,
    {
      title: "Risk Uyarıları",
      subtitle: "AI öneri motoru",
      badge: /* @__PURE__ */ t.jsx(S, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
      isLoading: a,
      isError: s,
      isFetching: i,
      isStale: n,
      dataUpdatedAt: r,
      onRetry: u,
      skeleton: /* @__PURE__ */ t.jsx(O, { rows: 3, withTrailing: !1 }),
      isEmpty: !a && !s && g.length === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        I,
        {
          compact: !0,
          variant: "success",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✓" }),
          title: "Görünen risk yok",
          description: "AI motoru taramayı tamamladı. Yeni veri geldikçe burada görünecek."
        }
      ),
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: g.map((h) => /* @__PURE__ */ t.jsx(
        ut,
        {
          risk: h,
          onAccept: x,
          onDismiss: o
        },
        h.id
      )) })
    }
  );
}
function ut({ risk: e, onAccept: a, onDismiss: s }) {
  const [i, n] = R.useState(!1), [r, c] = R.useState(null), l = B[e.severity], d = async (u, o) => {
    if (!r) {
      c(u);
      try {
        await (o == null ? void 0 : o(e));
      } finally {
        c(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsx("li", { className: f(
    "rounded-md border bg-surface-base",
    "transition-opacity duration-fast",
    e.severity === "critical" && "border-critical-50 bg-critical-50",
    e.severity === "actionable" && "border-warning-100",
    e.severity === "info" && "border-subtle",
    r && "opacity-60"
  ), children: /* @__PURE__ */ t.jsxs("div", { className: "p-2.5 flex flex-col gap-2", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t.jsx(S, { variant: l.variant, size: "sm", withDot: !0, children: l.label }),
      /* @__PURE__ */ t.jsx(C, { score: e.confidence, label: e.confidenceLabel, size: "md" })
    ] }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug", children: e.title }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: () => n((u) => !u),
        "aria-expanded": i,
        className: f(
          "self-start text-xs text-text-link hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: i ? "Açıklamayı gizle" : "Neden bu öneri?"
      }
    ),
    i && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: e.reasons.map((u, o) => /* @__PURE__ */ t.jsx("li", { children: u }, o)) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
      /* @__PURE__ */ t.jsx(
        w,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => d("dismiss", s),
          isLoading: r === "dismiss",
          children: "Şimdi değil"
        }
      ),
      /* @__PURE__ */ t.jsx(
        w,
        {
          size: "sm",
          variant: e.severity === "critical" ? "destructive" : "primary",
          onClick: () => d("accept", a),
          isLoading: r === "accept",
          children: e.suggestedAction
        }
      )
    ] })
  ] }) });
}
const mt = () => v.aiSuggestions();
function xt() {
  return L({
    queryKey: m.dashboard.aiSuggestions(),
    queryFn: mt
  });
}
function F(e, a = (s) => s) {
  const s = M();
  return H({
    mutationFn: e,
    onMutate: async (i) => {
      const n = a(i);
      await s.cancelQueries({ queryKey: m.dashboard.aiSuggestions() });
      const r = s.getQueryData(m.dashboard.aiSuggestions());
      return s.setQueryData(
        m.dashboard.aiSuggestions(),
        (c = []) => c.filter((l) => l.id !== n.id)
      ), { previous: r };
    },
    onError: (i, n, r) => {
      r != null && r.previous && s.setQueryData(m.dashboard.aiSuggestions(), r.previous);
    },
    onSettled: () => {
      s.invalidateQueries({ queryKey: m.dashboard.aiSuggestions() });
    }
  });
}
function ht() {
  return F((e) => v.applySuggestion(e));
}
function ft() {
  return F((e) => v.snoozeSuggestion(e));
}
function gt() {
  return F(
    ({ suggestion: e, reason: a }) => v.dismissSuggestion(e, a),
    ({ suggestion: e }) => e
  );
}
const pt = 5, yt = 0.3;
function bt() {
  const { data: e, isLoading: a, isError: s, isFetching: i, isStale: n, dataUpdatedAt: r, refetch: c } = xt(), l = ht(), d = ft(), u = gt(), o = R.useMemo(() => (e ?? []).filter(
    (h) => C.normalize(h.confidence) >= yt
  ).slice(0, pt), [e]), x = ((e == null ? void 0 : e.length) ?? 0) - o.length;
  return /* @__PURE__ */ t.jsx(
    N,
    {
      title: "AI önerileri",
      subtitle: "Sessiz inbox — sen bakmak istediğinde",
      badge: /* @__PURE__ */ t.jsx(S, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
      isLoading: a,
      isError: s,
      isFetching: i,
      isStale: n,
      dataUpdatedAt: r,
      onRetry: () => c(),
      skeleton: /* @__PURE__ */ t.jsx(O, { rows: 3, withLeading: !1 }),
      isEmpty: !a && !s && o.length === 0,
      emptyState: /* @__PURE__ */ t.jsx(
        I,
        {
          compact: !0,
          variant: "info",
          icon: /* @__PURE__ */ t.jsx("span", { className: "text-base", children: "✦" }),
          title: "AI şu an sessiz",
          description: "Anlamlı bir öneri çıkarsa burada gözükecek. Şimdilik aksiyona gerek yok."
        }
      ),
      children: /* @__PURE__ */ t.jsxs("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: [
        o.map((g) => /* @__PURE__ */ t.jsx("li", { children: /* @__PURE__ */ t.jsx(
          vt,
          {
            suggestion: g,
            apply: l,
            snooze: d,
            dismiss: u
          }
        ) }, g.id)),
        x > 0 && /* @__PURE__ */ t.jsxs("li", { className: "text-xs text-text-tertiary text-center pt-1", children: [
          "+",
          x,
          " öneri daha"
        ] })
      ] })
    }
  );
}
function vt({ suggestion: e, apply: a, snooze: s, dismiss: i }) {
  var r, c, l, d;
  const n = a.isPending && ((r = a.variables) == null ? void 0 : r.id) === e.id ? "apply" : s.isPending && ((c = s.variables) == null ? void 0 : c.id) === e.id ? "snooze" : i.isPending && ((d = (l = i.variables) == null ? void 0 : l.suggestion) == null ? void 0 : d.id) === e.id ? "dismiss" : null;
  return /* @__PURE__ */ t.jsx(
    it,
    {
      headline: e.headline,
      why: e.why,
      confidence: e.confidence,
      tone: e.tone,
      primaryActionLabel: e.primaryActionLabel,
      pending: n,
      onApply: () => a.mutateAsync(e).catch(() => {
      }),
      onSnooze: () => s.mutateAsync(e).catch(() => {
      }),
      onDismiss: () => i.mutateAsync({ suggestion: e, reason: "irrelevant" }).catch(() => {
      })
    }
  );
}
const jt = $.WidthProvider($.Responsive), wt = {
  "budget-health": qe,
  "cash-flow": Ue,
  "pending-approvals": at,
  "risk-alerts": dt,
  "ai-suggestions": bt
};
function kt() {
  const [e, a] = p.useState(() => Ce()), [s, i] = p.useState(!1), n = p.useMemo(() => {
    const o = P[e] ?? P.cfo, x = Me(e);
    return x ? { ...o, ...x } : o;
  }, [e]), r = p.useCallback((o) => {
    a(o), _e(o);
  }, []), c = p.useCallback(
    (o, x) => {
      s && Ie(e, x);
    },
    [s, e]
  ), l = p.useCallback(() => {
    Te(e), a(e);
  }, [e]), u = (n.desktop ?? []).map((o) => o.i);
  return /* @__PURE__ */ t.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ t.jsx(
      Nt,
      {
        persona: e,
        onPersonaChange: r,
        editMode: s,
        onEditModeToggle: () => i((o) => !o),
        onReset: l
      }
    ),
    /* @__PURE__ */ t.jsx("main", { className: "px-4 py-4 mobile:px-2 mobile:py-2", children: /* @__PURE__ */ t.jsx(
      jt,
      {
        className: f("apya-bento", s && "apya-bento--edit"),
        layouts: n,
        breakpoints: De,
        cols: ze,
        rowHeight: Ee,
        margin: Le,
        isDraggable: s,
        isResizable: s,
        draggableHandle: `.${N.DRAG_HANDLE_CLASS}`,
        onLayoutChange: c,
        compactType: "vertical",
        preventCollision: !1,
        children: u.map((o) => {
          const x = wt[o];
          return x ? /* @__PURE__ */ t.jsx("div", { className: "apya-bento-item", children: /* @__PURE__ */ t.jsx(x, {}) }, o) : /* @__PURE__ */ t.jsx("div", { children: /* @__PURE__ */ t.jsx(N, { title: `Bilinmeyen widget: ${o}` }) }, o);
        })
      }
    ) }),
    s && /* @__PURE__ */ t.jsxs(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        className: f(
          "fixed bottom-4 left-1/2 -translate-x-1/2 z-toast",
          "bg-surface-inverse text-text-inverse text-sm",
          "px-4 py-2 rounded-md shadow-lg",
          "flex items-center gap-3"
        ),
        children: [
          /* @__PURE__ */ t.jsx("span", { children: "Düzenleme modu — widget'ları sürükleyip yeniden boyutlandırabilirsin" }),
          /* @__PURE__ */ t.jsx(
            w,
            {
              variant: "ghost",
              size: "sm",
              className: "text-text-inverse hover:bg-white/10",
              onClick: () => i(!1),
              children: "Bitir"
            }
          )
        ]
      }
    )
  ] });
}
function Nt({ persona: e, onPersonaChange: a, editMode: s, onEditModeToggle: i, onReset: n }) {
  return /* @__PURE__ */ t.jsxs("header", { className: f(
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
      /* @__PURE__ */ t.jsx(St, { value: e, onChange: a }),
      s ? /* @__PURE__ */ t.jsx(
        w,
        {
          size: "sm",
          variant: "secondary",
          onClick: n,
          title: "Layout'u persona varsayılanına döndür",
          children: "Sıfırla"
        }
      ) : null,
      /* @__PURE__ */ t.jsx(
        w,
        {
          size: "sm",
          variant: s ? "primary" : "secondary",
          onClick: i,
          children: s ? "Tamamla" : "Düzenle"
        }
      ),
      /* @__PURE__ */ t.jsx(he, {})
    ] })
  ] });
}
function St({ value: e, onChange: a }) {
  return /* @__PURE__ */ t.jsxs("label", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ t.jsx("span", { className: "sr-only", children: "Persona seç" }),
    /* @__PURE__ */ t.jsx(
      "select",
      {
        value: e,
        onChange: (s) => a(s.target.value),
        className: f(
          "h-10 px-3 text-sm rounded-md",
          "bg-surface-base text-text-primary",
          "border border-default",
          "hover:border-strong",
          "focus-visible:outline-none focus-visible:shadow-focus",
          "transition-colors duration-fast"
        ),
        children: Object.entries(ee).map(([s, i]) => /* @__PURE__ */ t.jsx("option", { value: s, children: i }, s))
      }
    )
  ] });
}
function At(e) {
  const { connection: a, state: s } = je(), i = M();
  p.useEffect(() => {
    if (!a || !(e != null && e.length)) return;
    const n = e.map(([r, c]) => {
      const l = () => {
        c.forEach((d) => {
          i.invalidateQueries({ queryKey: d });
        });
      };
      return a.on(r, l), [r, l];
    });
    return () => {
      n.forEach(([r, c]) => {
        a.off(r, c);
      });
    };
  }, [a, s, i]);
}
function Rt() {
  const e = p.useMemo(() => [
    ["JournalEntryPosted", [m.dashboard.budget(), m.dashboard.cashflow()]],
    ["ApprovalDecided", [m.dashboard.approvals(), m.dashboard.budget(), m.dashboard.cashflow()]],
    ["RiskDetected", [m.dashboard.risks()]],
    ["RiskDismissed", [m.dashboard.risks()]]
  ], []);
  return At(e), null;
}
fe();
const U = document.getElementById("apya-dashboard-root");
U && oe(U).render(
  /* @__PURE__ */ t.jsx(ge, { children: /* @__PURE__ */ t.jsx(Ne, { children: /* @__PURE__ */ t.jsx(pe, { children: /* @__PURE__ */ t.jsxs(ve, { children: [
    /* @__PURE__ */ t.jsx(Rt, {}),
    /* @__PURE__ */ t.jsx(kt, {})
  ] }) }) }) })
);
