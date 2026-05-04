import { r as f, j as t, e as S, d as se } from "./react-vendor.js";
import { C as ie, a as re, b as oe, c as h, d as le, B as w, S as D, Q as m, f as Y, e as M, g as ce, h as b, T as de, r as ue, i as me, j as he } from "./registerServiceWorker.js";
import { H as F, a as fe, L as xe } from "./signalr-vendor.js";
import { r as H } from "./grid-vendor.js";
import { u as A, a as L, b as T } from "./query-vendor.js";
/* empty css      */
const V = f.createContext({
  connection: null,
  state: F.Disconnected
});
function ge({ hubUrl: e = "/signalr-hubs/notifications", children: a, enabled: n = !0 }) {
  const [r, i] = f.useState(F.Disconnected), s = f.useRef(null);
  f.useEffect(() => {
    if (!n || typeof window > "u") return;
    const l = new fe().withUrl(e, { withCredentials: !0 }).withAutomaticReconnect([0, 2e3, 5e3, 1e4, 3e4]).configureLogging(xe.Warning).build();
    s.current = l, i(l.state);
    const d = () => i(l.state);
    return l.onreconnecting(d), l.onreconnected(d), l.onclose(d), l.start().then(d).catch((u) => {
      console.warn("[SignalR] connect failed:", u == null ? void 0 : u.message), d();
    }), () => {
      l.stop().catch(() => {
      }), s.current = null;
    };
  }, [e, n]);
  const c = f.useMemo(() => ({
    get connection() {
      return s.current;
    },
    state: r
  }), [r]);
  return /* @__PURE__ */ t.jsx(V.Provider, { value: c, children: a });
}
function pe() {
  return f.useContext(V);
}
const E = {
  triage: "(min-width: 768px)",
  analysis: "(min-width: 1280px)",
  command: "(min-width: 1920px)"
};
function ye() {
  return typeof window > "u" || !window.matchMedia ? "analysis" : window.matchMedia(E.command).matches ? "command" : window.matchMedia(E.analysis).matches ? "analysis" : window.matchMedia(E.triage).matches ? "triage" : "decision";
}
const be = f.createContext(null);
function ve({ children: e, override: a }) {
  const n = f.useCallback((s) => {
    if (typeof window > "u" || !window.matchMedia) return () => {
    };
    const c = Object.values(E).map((l) => window.matchMedia(l));
    return c.forEach((l) => l.addEventListener("change", s)), () => c.forEach((l) => l.removeEventListener("change", s));
  }, []), r = f.useSyncExternalStore(n, ye, () => "analysis"), i = a ?? r;
  return f.useEffect(() => {
    typeof document > "u" || (document.documentElement.dataset.deviceMode = i);
  }, [i]), /* @__PURE__ */ t.jsx(be.Provider, { value: i, children: e });
}
const we = {
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
}, je = {
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
}, ke = {
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
}, I = {
  cfo: we,
  pm: je,
  field: ke
}, U = {
  cfo: "CFO / Finansman",
  pm: "Proje Yöneticisi",
  field: "Saha Kullanıcısı"
}, Se = {
  desktop: 1280,
  tablet: 768,
  mobile: 0
}, Ne = {
  desktop: 12,
  tablet: 8,
  mobile: 1
}, Ae = 64, Re = [12, 12], J = "apya-dashboard-persona", B = "apya-dashboard-layout-overrides";
function ze() {
  if (typeof window > "u") return "cfo";
  try {
    const e = window.localStorage.getItem(J);
    if (e && I[e]) return e;
  } catch {
  }
  return "cfo";
}
function De(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(J, e);
    } catch {
    }
}
function Ee(e) {
  if (typeof window > "u") return null;
  try {
    const a = window.localStorage.getItem(`${B}-${e}`);
    return a ? JSON.parse(a) : null;
  } catch {
    return null;
  }
}
function Le(e, a) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(
        `${B}-${e}`,
        JSON.stringify(a)
      );
    } catch {
    }
}
function Ce(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.removeItem(`${B}-${e}`);
    } catch {
    }
}
const Z = {
  /* react-grid-layout drag handle'ı için class — yalnızca header'dan sürüklenir,
     body'den sürüklendiğinde widget içindeki interactive element'leri tetiklemez. */
  DRAG_HANDLE_CLASS: "widget-drag-handle"
};
function v({
  title: e,
  subtitle: a,
  badge: n,
  actions: r,
  /* sağ üstteki action button'lar */
  isLoading: i = !1,
  isError: s = !1,
  errorMessage: c,
  onRetry: l,
  isEmpty: d = !1,
  emptyMessage: u = "Görüntülenecek veri yok.",
  density: o = "compact",
  children: x,
  className: j
}) {
  return /* @__PURE__ */ t.jsxs(ie, { variant: "default", className: h("h-full flex flex-col", j), children: [
    /* @__PURE__ */ t.jsxs(
      re,
      {
        density: o,
        className: h(
          /* Header drag-handle olur — sadece BURASI sürüklenir */
          Z.DRAG_HANDLE_CLASS,
          "cursor-grab active:cursor-grabbing select-none",
          "flex-row items-center justify-between flex-none"
        ),
        children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0 flex-1", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ t.jsx(oe, { className: "text-sm font-semibold truncate", children: e }),
              n
            ] }),
            a && /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary truncate", children: a })
          ] }),
          r && /* Action button'ların onClick'leri drag'i tetiklemesin diye stopPropagation */
          /* @__PURE__ */ t.jsx(
            "div",
            {
              className: "flex items-center gap-1 flex-none",
              onMouseDown: (y) => y.stopPropagation(),
              onTouchStart: (y) => y.stopPropagation(),
              children: r
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ t.jsxs(le, { density: o, className: "flex-1 overflow-auto", children: [
      s && /* @__PURE__ */ t.jsx(Me, { message: c, onRetry: l }),
      !s && i && /* @__PURE__ */ t.jsx(_e, { density: o }),
      !s && !i && d && /* @__PURE__ */ t.jsx(Ie, { message: u }),
      !s && !i && !d && x
    ] })
  ] });
}
function _e({ density: e }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3", "aria-busy": "true", children: [
    /* @__PURE__ */ t.jsx(D, { height: e === "spacious" ? 48 : 32, className: "w-1/3" }),
    /* @__PURE__ */ t.jsx(D, { height: 16 }),
    /* @__PURE__ */ t.jsx(D, { height: 16, className: "w-5/6" }),
    /* @__PURE__ */ t.jsx(D, { height: 16, className: "w-3/4" })
  ] });
}
function Me({ message: e, onRetry: a }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col items-center justify-center text-center gap-2 py-4", children: [
    /* @__PURE__ */ t.jsx(w, { variant: "negative", withDot: !0, children: "Yüklenemedi" }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-secondary max-w-xs", children: e || "Veri alınırken bir hata oluştu." }),
    a && /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: a,
        className: h(
          "text-sm text-text-link underline-offset-2 hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: "Tekrar dene"
      }
    )
  ] });
}
function Ie({ message: e }) {
  return /* @__PURE__ */ t.jsx("div", { className: "flex flex-col items-center justify-center text-center gap-1 py-6", children: /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: e }) });
}
v.DRAG_HANDLE_CLASS = Z.DRAG_HANDLE_CLASS;
const O = 250, Pe = 450;
function g(e = O + Math.random() * (Pe - O)) {
  return new Promise((a) => setTimeout(a, e));
}
const p = {
  async budgetSummary() {
    return await g(), {
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
    return await g(), {
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
    return await g(), [
      { id: "inv-001", type: "invoice", title: "TÜBİTAK 1501 — Eylül faturası", requester: "Ahmet Yıldız", amount: 12450, currency: "TRY", ageHours: 4 },
      { id: "exp-002", type: "expense", title: "Yazılım lisansı — JetBrains All", requester: "Mehmet Kaya", amount: 8240, currency: "TRY", ageHours: 18 },
      { id: "po-003", type: "po", title: "Bulut hosting (Q3 yenileme)", requester: "Zeynep Aksoy", amount: 24900, currency: "TRY", ageHours: 36 },
      { id: "inv-004", type: "invoice", title: "KOSGEB danışmanlık — Ağustos", requester: "Selin Aydın", amount: 6800, currency: "TRY", ageHours: 52 }
    ];
  },
  async approveItem(e) {
    if (await g(600), Math.random() < 0.05) {
      const a = new Error("Bu kayıt başka bir kullanıcı tarafından onaylanmış.");
      throw a.status = 409, a;
    }
    return { id: e.id, status: "approved" };
  },
  async rejectItem(e) {
    return await g(400), { id: e.id, status: "rejected" };
  },
  async riskAlerts() {
    return await g(), [
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
    return await g(300), { id: e.id, dismissed: !0 };
  },
  async acceptRisk(e) {
    return await g(500), { id: e.id, accepted: !0 };
  },
  /* AI suggestion inbox — dashboard widget'ı için top-N öneri.
     Risk alerts'ten ayrı: risk = "neye dikkat", suggestion = "ne yap".
     Tone: opportunity | warning | critical | neutral */
  async aiSuggestions() {
    return await g(), [
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
    if (await g(500), Math.random() < 0.03) {
      const a = new Error("Bu öneri başka bir kullanıcı tarafından uygulanmış.");
      throw a.status = 409, a;
    }
    return { id: e.id, applied: !0 };
  },
  async snoozeSuggestion(e) {
    return await g(250), { id: e.id, snoozed: !0, until: new Date(Date.now() + 7 * 864e5).toISOString() };
  },
  async dismissSuggestion(e, a = "irrelevant") {
    return await g(250), { id: e.id, dismissed: !0, reason: a };
  }
}, Te = () => p.budgetSummary();
function Be() {
  return A({
    queryKey: m.dashboard.budget(),
    queryFn: Te
  });
}
function Ke() {
  const { data: e, isLoading: a, isError: n, refetch: r } = Be(), i = () => r(), s = e ? e.spent / e.budget * 100 : 0, c = W(s), l = e ? Y(e.deltaPct) : null;
  return /* @__PURE__ */ t.jsx(
    v,
    {
      title: "Bütçe Sağlığı",
      subtitle: "Tüm aktif projeler — bu ay",
      badge: /* @__PURE__ */ t.jsx(w, { variant: c.badgeVariant, size: "sm", withDot: !0, children: c.label }),
      isLoading: a,
      isError: n,
      onRetry: i,
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-baseline gap-2 font-tabular", children: [
          /* @__PURE__ */ t.jsx("span", { className: "text-3xl font-semibold tracking-tight", children: M(e.spent, e.currency) }),
          /* @__PURE__ */ t.jsxs("span", { className: "text-sm text-text-tertiary", children: [
            "/ ",
            M(e.budget, e.currency)
          ] })
        ] }),
        l && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1.5 text-xs", children: [
          /* @__PURE__ */ t.jsxs("span", { className: h(
            "inline-flex items-center gap-1 font-medium font-tabular",
            /* delta < 0 = harcama düşmüş = pozitif sinyal */
            e.deltaPct < 0 ? "text-text-positive" : "text-text-negative"
          ), children: [
            l.symbol,
            " ",
            l.text
          ] }),
          /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: "geçen aya göre" })
        ] }),
        /* @__PURE__ */ t.jsx(He, { value: s, variant: c.barVariant }),
        /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-1.5 mt-1 overflow-y-auto", children: e.breakdown.map((d) => /* @__PURE__ */ t.jsxs(
          "li",
          {
            className: "flex items-center justify-between text-xs gap-3",
            children: [
              /* @__PURE__ */ t.jsx("span", { className: "truncate text-text-secondary", children: d.project }),
              /* @__PURE__ */ t.jsxs("span", { className: h(
                "font-tabular font-medium",
                W(d.ratio * 100).textVariant
              ), children: [
                Math.round(d.ratio * 100),
                "%"
              ] })
            ]
          },
          d.project
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
function He({ value: e, variant: a = "positive" }) {
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
          className: h(
            n,
            "h-full rounded-full transition-all duration-slow ease-standard"
          ),
          style: { width: `${Math.min(e, 100)}%` }
        }
      )
    }
  );
}
const Oe = () => p.cashFlow();
function We() {
  return A({
    queryKey: m.dashboard.cashflow(),
    queryFn: Oe
  });
}
function $e() {
  const { data: e, isLoading: a, isError: n, refetch: r } = We(), i = () => r(), s = e ? Y(e.deltaPct) : null, c = e ? e.deltaPct >= 0 : !0;
  return /* @__PURE__ */ t.jsx(
    v,
    {
      title: "Nakit Akışı",
      subtitle: "Son 30 gün",
      isLoading: a,
      isError: n,
      onRetry: i,
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-4 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 flex-none", children: [
          /* @__PURE__ */ t.jsx("div", { className: "text-2xl font-semibold tracking-tight font-tabular", children: M(e.netCurrent, e.currency) }),
          s && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 text-xs", children: [
            /* @__PURE__ */ t.jsxs("span", { className: h(
              "inline-flex items-center gap-1 font-medium font-tabular",
              c ? "text-text-positive" : "text-text-negative"
            ), children: [
              s.symbol,
              " ",
              s.text
            ] }),
            /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: "vs önceki dönem" })
          ] })
        ] }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx(qe, { series: e.series, variant: c ? "positive" : "negative" }) })
      ] })
    }
  );
}
function qe({ series: e, variant: a = "positive" }) {
  const r = `cashflow-grad-${f.useId().replace(/:/g, "")}`;
  if (!e || e.length < 2) return null;
  const i = 100, s = 40, c = Math.min(...e), d = Math.max(...e) - c || 1, o = e.map((y, N) => {
    const k = N / (e.length - 1) * i, C = s - (y - c) / d * s;
    return [k, C];
  }).map(([y, N], k) => `${k === 0 ? "M" : "L"} ${y.toFixed(2)} ${N.toFixed(2)}`).join(" "), x = `${o} L ${i} ${s} L 0 ${s} Z`, j = a === "positive" ? "var(--apya-positive-500)" : "var(--apya-negative-500)";
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      viewBox: `0 0 ${i} ${s}`,
      preserveAspectRatio: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ t.jsx("defs", { children: /* @__PURE__ */ t.jsxs("linearGradient", { id: r, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ t.jsx("stop", { offset: "0%", stopColor: j, stopOpacity: "0.25" }),
          /* @__PURE__ */ t.jsx("stop", { offset: "100%", stopColor: j, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ t.jsx("path", { d: x, fill: `url(#${r})` }),
        /* @__PURE__ */ t.jsx(
          "path",
          {
            d: o,
            fill: "none",
            stroke: j,
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
const Ge = () => p.pendingApprovals();
function Qe() {
  return A({
    queryKey: m.dashboard.approvals(),
    queryFn: Ge
  });
}
function X(e) {
  const a = L();
  return T({
    mutationFn: e,
    onMutate: async (n) => {
      await a.cancelQueries({ queryKey: m.dashboard.approvals() });
      const r = a.getQueryData(m.dashboard.approvals());
      return a.setQueryData(
        m.dashboard.approvals(),
        (i = []) => i.filter((s) => s.id !== n.id)
      ), { previous: r, item: n };
    },
    onError: (n, r, i) => {
      i != null && i.previous && a.setQueryData(m.dashboard.approvals(), i.previous);
    },
    onSettled: () => {
      a.invalidateQueries({ queryKey: m.dashboard.approvals() }), a.invalidateQueries({ queryKey: m.dashboard.budget() }), a.invalidateQueries({ queryKey: m.dashboard.cashflow() });
    }
  });
}
function Ye() {
  return X((e) => p.approveItem(e));
}
function Fe() {
  return X((e) => p.rejectItem(e));
}
const $ = {
  invoice: { label: "Fatura", variant: "brand" },
  expense: { label: "Masraf", variant: "neutral" },
  po: { label: "Sipariş", variant: "ai" }
};
function Ve() {
  const { data: e, isLoading: a, isError: n, refetch: r } = Qe(), i = Ye(), s = Fe(), c = () => r(), l = (o) => i.mutateAsync(o).catch(() => {
  }), d = (o) => s.mutateAsync(o).catch(() => {
  }), u = (e == null ? void 0 : e.length) ?? 0;
  return /* @__PURE__ */ t.jsx(
    v,
    {
      title: "Onay Bekleyenler",
      subtitle: u > 0 ? `${u} kalem inceleme bekliyor` : void 0,
      badge: u > 0 && /* @__PURE__ */ t.jsx(w, { variant: "warning", size: "sm", withDot: !0, children: u }),
      isLoading: a,
      isError: n,
      onRetry: c,
      isEmpty: !a && !n && u === 0,
      emptyMessage: "🎉 Bekleyen onay yok.",
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: e == null ? void 0 : e.map((o) => /* @__PURE__ */ t.jsx(
        Ue,
        {
          item: o,
          onApprove: l,
          onReject: d
        },
        o.id
      )) })
    }
  );
}
function Ue({ item: e, onApprove: a, onReject: n }) {
  const [r, i] = S.useState(null), s = $[e.type] ?? $.expense, c = Je(e.ageHours), l = async (d, u) => {
    if (!r) {
      i(d);
      try {
        await (u == null ? void 0 : u(e));
      } finally {
        i(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsxs("li", { className: h(
    "flex items-center gap-3 p-2.5 rounded-md",
    "bg-surface-base border border-subtle",
    "transition-opacity duration-fast",
    r && "opacity-60"
  ), children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 min-w-0 flex-1", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(w, { variant: s.variant, size: "sm", children: s.label }),
        /* @__PURE__ */ t.jsxs("span", { className: "text-xs text-text-tertiary truncate", children: [
          e.requester,
          " · ",
          c
        ] })
      ] }),
      /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary truncate", children: e.title })
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "font-tabular font-semibold text-sm text-text-primary flex-none", children: ce(e.amount, e.currency) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 flex-none", children: [
      /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => l("reject", n),
          isLoading: r === "reject",
          "aria-label": `${e.title} reddet`,
          className: "text-text-negative hover:bg-negative-50 hover:text-negative-700",
          children: "Reddet"
        }
      ),
      /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: "primary",
          onClick: () => l("approve", a),
          isLoading: r === "approve",
          "aria-label": `${e.title} onayla`,
          children: "Onayla"
        }
      )
    ] })
  ] });
}
function Je(e) {
  return e < 1 ? "az önce" : e < 24 ? `${Math.round(e)} sa önce` : `${Math.floor(e / 24)} gün önce`;
}
const q = {
  sm: { dot: "h-1 w-1", gap: "gap-0.5" },
  md: { dot: "h-1.5 w-1.5", gap: "gap-0.5" },
  lg: { dot: "h-2 w-2", gap: "gap-1" }
};
function ee(e) {
  return typeof e != "number" || !Number.isFinite(e) ? 0 : e > 1 ? Math.max(0, Math.min(100, e)) / 100 : Math.max(0, Math.min(1, e));
}
function te(e) {
  return e >= 0.85 ? { dots: 5, label: "Çok yüksek güven" } : e >= 0.7 ? { dots: 4, label: "Yüksek güven" } : e >= 0.5 ? { dots: 3, label: "Orta güven" } : e >= 0.3 ? { dots: 2, label: "Düşük güven" } : { dots: 1, label: "Çok düşük güven" };
}
function R({ score: e, label: a, size: n = "md", showLabel: r = !0, className: i }) {
  const s = ee(e), c = te(s), l = q[n] ?? q.md, d = a ?? c.label, u = Math.round(s * 100);
  return /* @__PURE__ */ t.jsxs(
    "span",
    {
      className: h("inline-flex items-center gap-1 text-xs text-text-tertiary", i),
      title: `${c.label} (%${u})`,
      children: [
        /* @__PURE__ */ t.jsx("span", { className: h("inline-flex items-center", l.gap), "aria-hidden": "true", children: Array.from({ length: 5 }, (o, x) => /* @__PURE__ */ t.jsx(
          "span",
          {
            className: h(
              "inline-block rounded-full",
              l.dot,
              x < c.dots ? "bg-ai-500" : "bg-neutral-200"
            )
          },
          x
        )) }),
        r && /* @__PURE__ */ t.jsx("span", { "aria-hidden": "true", children: d }),
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
R.bandFor = te;
R.normalize = ee;
const G = {
  /* Neutral default — AI'ın sakin, ısrarsız tonu */
  neutral: { border: "border-default", ribbon: null },
  /* Pozitif — fırsat, gelişim önerisi */
  opportunity: { border: "border-positive-100", ribbon: "bg-positive-50" },
  /* Uyarı — bütçe aşımı, anomali */
  warning: { border: "border-warning-100", ribbon: "bg-warning-50" },
  /* Kritik — derhal aksiyon */
  critical: { border: "border-critical-50 ring-1 ring-critical-50", ribbon: "bg-critical-50" }
};
function Ze({
  headline: e,
  why: a = [],
  /* string[] — bullet'lara dönüşür */
  confidence: n,
  /* 0-1 ya da 0-100 */
  confidenceLabel: r,
  /* opsiyonel custom label; yoksa otomatik band */
  tone: i = "neutral",
  badge: s,
  /* opsiyonel custom badge; yoksa "AI" rozetı */
  primaryActionLabel: c = "Uygula",
  onApply: l,
  onSnooze: d,
  onDismiss: u,
  pending: o,
  /* 'apply' | 'snooze' | 'dismiss' | null */
  className: x,
  children: j
  /* ekstra içerik — örn. before/after diff snippet */
}) {
  const [y, N] = S.useState(!1), k = G[i] ?? G.neutral, C = Array.isArray(a) && a.length > 0, z = !!o;
  return /* @__PURE__ */ t.jsxs(
    "article",
    {
      className: h(
        "rounded-md border bg-surface-base",
        "transition-opacity duration-fast",
        k.border,
        z && "opacity-60",
        x
      ),
      "data-suggestion-tone": i,
      children: [
        k.ribbon && /* Tone ribbon — sade renk şeridi; arka planı ezmeden tonu işaret eder */
        /* @__PURE__ */ t.jsx("div", { className: h("h-1 rounded-t-md", k.ribbon), "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsxs("div", { className: "p-3 flex flex-col gap-2", children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            s ?? /* @__PURE__ */ t.jsx(w, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
            /* @__PURE__ */ t.jsx(R, { score: n, label: r, size: "md" })
          ] }),
          /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug text-balance", children: e }),
          j,
          C && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx(
              "button",
              {
                type: "button",
                onClick: () => N((_) => !_),
                "aria-expanded": y,
                className: h(
                  "self-start text-xs text-text-link hover:underline",
                  "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
                ),
                children: y ? "Açıklamayı gizle" : "Neden bu öneri?"
              }
            ),
            y && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: a.map((_, ne) => /* @__PURE__ */ t.jsx("li", { children: _ }, ne)) })
          ] }),
          /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
            u && /* @__PURE__ */ t.jsx(
              b,
              {
                size: "sm",
                variant: "ghost",
                onClick: u,
                isLoading: o === "dismiss",
                disabled: z && o !== "dismiss",
                children: "İlgisiz"
              }
            ),
            d && /* @__PURE__ */ t.jsx(
              b,
              {
                size: "sm",
                variant: "ghost",
                onClick: d,
                isLoading: o === "snooze",
                disabled: z && o !== "snooze",
                children: "Sonra"
              }
            ),
            l && /* @__PURE__ */ t.jsx(
              b,
              {
                size: "sm",
                variant: i === "critical" ? "destructive" : "primary",
                onClick: l,
                isLoading: o === "apply",
                disabled: z && o !== "apply",
                children: c
              }
            )
          ] })
        ] })
      ]
    }
  );
}
const Xe = () => p.riskAlerts();
function et() {
  return A({
    queryKey: m.dashboard.risks(),
    queryFn: Xe
  });
}
function ae(e) {
  const a = L();
  return T({
    mutationFn: e,
    onMutate: async (n) => {
      await a.cancelQueries({ queryKey: m.dashboard.risks() });
      const r = a.getQueryData(m.dashboard.risks());
      return a.setQueryData(
        m.dashboard.risks(),
        (i = []) => i.filter((s) => s.id !== n.id)
      ), { previous: r };
    },
    onError: (n, r, i) => {
      i != null && i.previous && a.setQueryData(m.dashboard.risks(), i.previous);
    },
    onSettled: () => {
      a.invalidateQueries({ queryKey: m.dashboard.risks() });
    }
  });
}
function tt() {
  return ae((e) => p.dismissRisk(e));
}
function at() {
  return ae((e) => p.acceptRisk(e));
}
const P = {
  critical: { label: "Kritik", variant: "critical", priority: 0 },
  actionable: { label: "Eyleme açık", variant: "warning", priority: 1 },
  info: { label: "Bilgi", variant: "ai", priority: 2 }
};
function nt() {
  const { data: e, isLoading: a, isError: n, refetch: r } = et(), i = tt(), s = at(), c = () => r(), l = (o) => i.mutateAsync(o).catch(() => {
  }), d = (o) => s.mutateAsync(o).catch(() => {
  }), u = S.useMemo(
    () => [...e ?? []].sort(
      (o, x) => P[o.severity].priority - P[x.severity].priority
    ),
    [e]
  );
  return /* @__PURE__ */ t.jsx(
    v,
    {
      title: "Risk Uyarıları",
      subtitle: "AI öneri motoru",
      badge: /* @__PURE__ */ t.jsx(w, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
      isLoading: a,
      isError: n,
      onRetry: c,
      isEmpty: !a && !n && u.length === 0,
      emptyMessage: "Şu an risk yok — AI motoru tarama tamamladı.",
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: u.map((o) => /* @__PURE__ */ t.jsx(
        st,
        {
          risk: o,
          onAccept: d,
          onDismiss: l
        },
        o.id
      )) })
    }
  );
}
function st({ risk: e, onAccept: a, onDismiss: n }) {
  const [r, i] = S.useState(!1), [s, c] = S.useState(null), l = P[e.severity], d = async (u, o) => {
    if (!s) {
      c(u);
      try {
        await (o == null ? void 0 : o(e));
      } finally {
        c(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsx("li", { className: h(
    "rounded-md border bg-surface-base",
    "transition-opacity duration-fast",
    e.severity === "critical" && "border-critical-50 bg-critical-50",
    e.severity === "actionable" && "border-warning-100",
    e.severity === "info" && "border-subtle",
    s && "opacity-60"
  ), children: /* @__PURE__ */ t.jsxs("div", { className: "p-2.5 flex flex-col gap-2", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t.jsx(w, { variant: l.variant, size: "sm", withDot: !0, children: l.label }),
      /* @__PURE__ */ t.jsx(R, { score: e.confidence, label: e.confidenceLabel, size: "md" })
    ] }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug", children: e.title }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: () => i((u) => !u),
        "aria-expanded": r,
        className: h(
          "self-start text-xs text-text-link hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: r ? "Açıklamayı gizle" : "Neden bu öneri?"
      }
    ),
    r && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: e.reasons.map((u, o) => /* @__PURE__ */ t.jsx("li", { children: u }, o)) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
      /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => d("dismiss", n),
          isLoading: s === "dismiss",
          children: "Şimdi değil"
        }
      ),
      /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: e.severity === "critical" ? "destructive" : "primary",
          onClick: () => d("accept", a),
          isLoading: s === "accept",
          children: e.suggestedAction
        }
      )
    ] })
  ] }) });
}
const it = () => p.aiSuggestions();
function rt() {
  return A({
    queryKey: m.dashboard.aiSuggestions(),
    queryFn: it
  });
}
function K(e, a = (n) => n) {
  const n = L();
  return T({
    mutationFn: e,
    onMutate: async (r) => {
      const i = a(r);
      await n.cancelQueries({ queryKey: m.dashboard.aiSuggestions() });
      const s = n.getQueryData(m.dashboard.aiSuggestions());
      return n.setQueryData(
        m.dashboard.aiSuggestions(),
        (c = []) => c.filter((l) => l.id !== i.id)
      ), { previous: s };
    },
    onError: (r, i, s) => {
      s != null && s.previous && n.setQueryData(m.dashboard.aiSuggestions(), s.previous);
    },
    onSettled: () => {
      n.invalidateQueries({ queryKey: m.dashboard.aiSuggestions() });
    }
  });
}
function ot() {
  return K((e) => p.applySuggestion(e));
}
function lt() {
  return K((e) => p.snoozeSuggestion(e));
}
function ct() {
  return K(
    ({ suggestion: e, reason: a }) => p.dismissSuggestion(e, a),
    ({ suggestion: e }) => e
  );
}
const dt = 5, ut = 0.3;
function mt() {
  const { data: e, isLoading: a, isError: n, refetch: r } = rt(), i = ot(), s = lt(), c = ct(), l = S.useMemo(() => (e ?? []).filter(
    (o) => R.normalize(o.confidence) >= ut
  ).slice(0, dt), [e]), d = ((e == null ? void 0 : e.length) ?? 0) - l.length;
  return /* @__PURE__ */ t.jsx(
    v,
    {
      title: "AI önerileri",
      subtitle: "Sessiz inbox — sen bakmak istediğinde",
      badge: /* @__PURE__ */ t.jsx(w, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
      isLoading: a,
      isError: n,
      onRetry: () => r(),
      isEmpty: !a && !n && l.length === 0,
      emptyMessage: "Şu an gösterilecek öneri yok — AI sessiz.",
      children: /* @__PURE__ */ t.jsxs("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: [
        l.map((u) => /* @__PURE__ */ t.jsx("li", { children: /* @__PURE__ */ t.jsx(
          ht,
          {
            suggestion: u,
            apply: i,
            snooze: s,
            dismiss: c
          }
        ) }, u.id)),
        d > 0 && /* @__PURE__ */ t.jsxs("li", { className: "text-xs text-text-tertiary text-center pt-1", children: [
          "+",
          d,
          " öneri daha"
        ] })
      ] })
    }
  );
}
function ht({ suggestion: e, apply: a, snooze: n, dismiss: r }) {
  var s, c, l, d;
  const i = a.isPending && ((s = a.variables) == null ? void 0 : s.id) === e.id ? "apply" : n.isPending && ((c = n.variables) == null ? void 0 : c.id) === e.id ? "snooze" : r.isPending && ((d = (l = r.variables) == null ? void 0 : l.suggestion) == null ? void 0 : d.id) === e.id ? "dismiss" : null;
  return /* @__PURE__ */ t.jsx(
    Ze,
    {
      headline: e.headline,
      why: e.why,
      confidence: e.confidence,
      tone: e.tone,
      primaryActionLabel: e.primaryActionLabel,
      pending: i,
      onApply: () => a.mutateAsync(e).catch(() => {
      }),
      onSnooze: () => n.mutateAsync(e).catch(() => {
      }),
      onDismiss: () => r.mutateAsync({ suggestion: e, reason: "irrelevant" }).catch(() => {
      })
    }
  );
}
const ft = H.WidthProvider(H.Responsive), xt = {
  "budget-health": Ke,
  "cash-flow": $e,
  "pending-approvals": Ve,
  "risk-alerts": nt,
  "ai-suggestions": mt
};
function gt() {
  const [e, a] = f.useState(() => ze()), [n, r] = f.useState(!1), i = f.useMemo(() => {
    const o = I[e] ?? I.cfo, x = Ee(e);
    return x ? { ...o, ...x } : o;
  }, [e]), s = f.useCallback((o) => {
    a(o), De(o);
  }, []), c = f.useCallback(
    (o, x) => {
      n && Le(e, x);
    },
    [n, e]
  ), l = f.useCallback(() => {
    Ce(e), a(e);
  }, [e]), u = (i.desktop ?? []).map((o) => o.i);
  return /* @__PURE__ */ t.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ t.jsx(
      pt,
      {
        persona: e,
        onPersonaChange: s,
        editMode: n,
        onEditModeToggle: () => r((o) => !o),
        onReset: l
      }
    ),
    /* @__PURE__ */ t.jsx("main", { className: "px-4 py-4 mobile:px-2 mobile:py-2", children: /* @__PURE__ */ t.jsx(
      ft,
      {
        className: h("apya-bento", n && "apya-bento--edit"),
        layouts: i,
        breakpoints: Se,
        cols: Ne,
        rowHeight: Ae,
        margin: Re,
        isDraggable: n,
        isResizable: n,
        draggableHandle: `.${v.DRAG_HANDLE_CLASS}`,
        onLayoutChange: c,
        compactType: "vertical",
        preventCollision: !1,
        children: u.map((o) => {
          const x = xt[o];
          return x ? /* @__PURE__ */ t.jsx("div", { className: "apya-bento-item", children: /* @__PURE__ */ t.jsx(x, {}) }, o) : /* @__PURE__ */ t.jsx("div", { children: /* @__PURE__ */ t.jsx(v, { title: `Bilinmeyen widget: ${o}` }) }, o);
        })
      }
    ) }),
    n && /* @__PURE__ */ t.jsxs(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        className: h(
          "fixed bottom-4 left-1/2 -translate-x-1/2 z-toast",
          "bg-surface-inverse text-text-inverse text-sm",
          "px-4 py-2 rounded-md shadow-lg",
          "flex items-center gap-3"
        ),
        children: [
          /* @__PURE__ */ t.jsx("span", { children: "Düzenleme modu — widget'ları sürükleyip yeniden boyutlandırabilirsin" }),
          /* @__PURE__ */ t.jsx(
            b,
            {
              variant: "ghost",
              size: "sm",
              className: "text-text-inverse hover:bg-white/10",
              onClick: () => r(!1),
              children: "Bitir"
            }
          )
        ]
      }
    )
  ] });
}
function pt({ persona: e, onPersonaChange: a, editMode: n, onEditModeToggle: r, onReset: i }) {
  return /* @__PURE__ */ t.jsxs("header", { className: h(
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
        U[e],
        " görünümü"
      ] })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      /* @__PURE__ */ t.jsx(yt, { value: e, onChange: a }),
      n ? /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: "secondary",
          onClick: i,
          title: "Layout'u persona varsayılanına döndür",
          children: "Sıfırla"
        }
      ) : null,
      /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: n ? "primary" : "secondary",
          onClick: r,
          children: n ? "Tamamla" : "Düzenle"
        }
      ),
      /* @__PURE__ */ t.jsx(de, {})
    ] })
  ] });
}
function yt({ value: e, onChange: a }) {
  return /* @__PURE__ */ t.jsxs("label", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ t.jsx("span", { className: "sr-only", children: "Persona seç" }),
    /* @__PURE__ */ t.jsx(
      "select",
      {
        value: e,
        onChange: (n) => a(n.target.value),
        className: h(
          "h-10 px-3 text-sm rounded-md",
          "bg-surface-base text-text-primary",
          "border border-default",
          "hover:border-strong",
          "focus-visible:outline-none focus-visible:shadow-focus",
          "transition-colors duration-fast"
        ),
        children: Object.entries(U).map(([n, r]) => /* @__PURE__ */ t.jsx("option", { value: n, children: r }, n))
      }
    )
  ] });
}
function bt(e) {
  const { connection: a, state: n } = pe(), r = L();
  f.useEffect(() => {
    if (!a || !(e != null && e.length)) return;
    const i = e.map(([s, c]) => {
      const l = () => {
        c.forEach((d) => {
          r.invalidateQueries({ queryKey: d });
        });
      };
      return a.on(s, l), [s, l];
    });
    return () => {
      i.forEach(([s, c]) => {
        a.off(s, c);
      });
    };
  }, [a, n, r]);
}
function vt() {
  const e = f.useMemo(() => [
    ["JournalEntryPosted", [m.dashboard.budget(), m.dashboard.cashflow()]],
    ["ApprovalDecided", [m.dashboard.approvals(), m.dashboard.budget(), m.dashboard.cashflow()]],
    ["RiskDetected", [m.dashboard.risks()]],
    ["RiskDismissed", [m.dashboard.risks()]]
  ], []);
  return bt(e), null;
}
ue();
const Q = document.getElementById("apya-dashboard-root");
Q && se(Q).render(
  /* @__PURE__ */ t.jsx(me, { children: /* @__PURE__ */ t.jsx(ve, { children: /* @__PURE__ */ t.jsx(he, { children: /* @__PURE__ */ t.jsxs(ge, { children: [
    /* @__PURE__ */ t.jsx(vt, {}),
    /* @__PURE__ */ t.jsx(gt, {})
  ] }) }) }) })
);
