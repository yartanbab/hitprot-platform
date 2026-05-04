import { r as x, j as t, e as R, d as V } from "./react-vendor.js";
import { C as U, a as J, b as Z, c as h, d as X, B as w, S as k, Q as m, f as B, e as D, g as ee, h as b, T as te, r as ae, i as se, j as ne } from "./registerServiceWorker.js";
import { H as G, a as ie, L as re } from "./signalr-vendor.js";
import { r as P } from "./grid-vendor.js";
import { u as A, a as C, b as K } from "./query-vendor.js";
/* empty css      */
const $ = x.createContext({
  connection: null,
  state: G.Disconnected
});
function oe({ hubUrl: e = "/signalr-hubs/notifications", children: a, enabled: s = !0 }) {
  const [o, n] = x.useState(G.Disconnected), i = x.useRef(null);
  x.useEffect(() => {
    if (!s || typeof window > "u") return;
    const l = new ie().withUrl(e, { withCredentials: !0 }).withAutomaticReconnect([0, 2e3, 5e3, 1e4, 3e4]).configureLogging(re.Warning).build();
    i.current = l, n(l.state);
    const d = () => n(l.state);
    return l.onreconnecting(d), l.onreconnected(d), l.onclose(d), l.start().then(d).catch((u) => {
      console.warn("[SignalR] connect failed:", u == null ? void 0 : u.message), d();
    }), () => {
      l.stop().catch(() => {
      }), i.current = null;
    };
  }, [e, s]);
  const c = x.useMemo(() => ({
    get connection() {
      return i.current;
    },
    state: o
  }), [o]);
  return /* @__PURE__ */ t.jsx($.Provider, { value: c, children: a });
}
function le() {
  return x.useContext($);
}
const N = {
  triage: "(min-width: 768px)",
  analysis: "(min-width: 1280px)",
  command: "(min-width: 1920px)"
};
function ce() {
  return typeof window > "u" || !window.matchMedia ? "analysis" : window.matchMedia(N.command).matches ? "command" : window.matchMedia(N.analysis).matches ? "analysis" : window.matchMedia(N.triage).matches ? "triage" : "decision";
}
const de = x.createContext(null);
function ue({ children: e, override: a }) {
  const s = x.useCallback((i) => {
    if (typeof window > "u" || !window.matchMedia) return () => {
    };
    const c = Object.values(N).map((l) => window.matchMedia(l));
    return c.forEach((l) => l.addEventListener("change", i)), () => c.forEach((l) => l.removeEventListener("change", i));
  }, []), o = x.useSyncExternalStore(s, ce, () => "analysis"), n = a ?? o;
  return x.useEffect(() => {
    typeof document > "u" || (document.documentElement.dataset.deviceMode = n);
  }, [n]), /* @__PURE__ */ t.jsx(de.Provider, { value: n, children: e });
}
const me = {
  desktop: [
    { i: "budget-health", x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "cash-flow", x: 6, y: 0, w: 6, h: 2, minW: 4, minH: 2 },
    { i: "risk-alerts", x: 6, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "pending-approvals", x: 0, y: 4, w: 6, h: 4, minW: 4, minH: 3 }
  ],
  tablet: [
    { i: "budget-health", x: 0, y: 0, w: 8, h: 4, minW: 4, minH: 3 },
    { i: "cash-flow", x: 0, y: 4, w: 8, h: 2, minW: 4, minH: 2 },
    { i: "risk-alerts", x: 0, y: 6, w: 8, h: 4, minW: 4, minH: 3 },
    { i: "pending-approvals", x: 0, y: 10, w: 8, h: 4, minW: 4, minH: 3 }
  ],
  mobile: [
    { i: "budget-health", x: 0, y: 0, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "cash-flow", x: 0, y: 4, w: 1, h: 2, isResizable: !1, isDraggable: !1 },
    { i: "risk-alerts", x: 0, y: 6, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "pending-approvals", x: 0, y: 10, w: 1, h: 4, isResizable: !1, isDraggable: !1 }
  ]
}, xe = {
  desktop: [
    { i: "risk-alerts", x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "pending-approvals", x: 6, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "budget-health", x: 0, y: 4, w: 6, h: 3, minW: 4, minH: 3 },
    { i: "cash-flow", x: 6, y: 4, w: 6, h: 3, minW: 4, minH: 2 }
  ],
  tablet: [
    { i: "risk-alerts", x: 0, y: 0, w: 8, h: 4 },
    { i: "pending-approvals", x: 0, y: 4, w: 8, h: 4 },
    { i: "budget-health", x: 0, y: 8, w: 8, h: 3 },
    { i: "cash-flow", x: 0, y: 11, w: 8, h: 2 }
  ],
  mobile: [
    { i: "risk-alerts", x: 0, y: 0, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "pending-approvals", x: 0, y: 4, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "budget-health", x: 0, y: 8, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "cash-flow", x: 0, y: 12, w: 1, h: 2, isResizable: !1, isDraggable: !1 }
  ]
}, he = {
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
}, L = {
  cfo: me,
  pm: xe,
  field: he
}, O = {
  cfo: "CFO / Finansman",
  pm: "Proje Yöneticisi",
  field: "Saha Kullanıcısı"
}, fe = {
  desktop: 1280,
  tablet: 768,
  mobile: 0
}, pe = {
  desktop: 12,
  tablet: 8,
  mobile: 1
}, ye = 64, ge = [12, 12], W = "apya-dashboard-persona", M = "apya-dashboard-layout-overrides";
function be() {
  if (typeof window > "u") return "cfo";
  try {
    const e = window.localStorage.getItem(W);
    if (e && L[e]) return e;
  } catch {
  }
  return "cfo";
}
function ve(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(W, e);
    } catch {
    }
}
function we(e) {
  if (typeof window > "u") return null;
  try {
    const a = window.localStorage.getItem(`${M}-${e}`);
    return a ? JSON.parse(a) : null;
  } catch {
    return null;
  }
}
function je(e, a) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(
        `${M}-${e}`,
        JSON.stringify(a)
      );
    } catch {
    }
}
function ke(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.removeItem(`${M}-${e}`);
    } catch {
    }
}
const q = {
  /* react-grid-layout drag handle'ı için class — yalnızca header'dan sürüklenir,
     body'den sürüklendiğinde widget içindeki interactive element'leri tetiklemez. */
  DRAG_HANDLE_CLASS: "widget-drag-handle"
};
function v({
  title: e,
  subtitle: a,
  badge: s,
  actions: o,
  /* sağ üstteki action button'lar */
  isLoading: n = !1,
  isError: i = !1,
  errorMessage: c,
  onRetry: l,
  isEmpty: d = !1,
  emptyMessage: u = "Görüntülenecek veri yok.",
  density: r = "compact",
  children: f,
  className: j
}) {
  return /* @__PURE__ */ t.jsxs(U, { variant: "default", className: h("h-full flex flex-col", j), children: [
    /* @__PURE__ */ t.jsxs(
      J,
      {
        density: r,
        className: h(
          /* Header drag-handle olur — sadece BURASI sürüklenir */
          q.DRAG_HANDLE_CLASS,
          "cursor-grab active:cursor-grabbing select-none",
          "flex-row items-center justify-between flex-none"
        ),
        children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0 flex-1", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ t.jsx(Z, { className: "text-sm font-semibold truncate", children: e }),
              s
            ] }),
            a && /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary truncate", children: a })
          ] }),
          o && /* Action button'ların onClick'leri drag'i tetiklemesin diye stopPropagation */
          /* @__PURE__ */ t.jsx(
            "div",
            {
              className: "flex items-center gap-1 flex-none",
              onMouseDown: (g) => g.stopPropagation(),
              onTouchStart: (g) => g.stopPropagation(),
              children: o
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ t.jsxs(X, { density: r, className: "flex-1 overflow-auto", children: [
      i && /* @__PURE__ */ t.jsx(Re, { message: c, onRetry: l }),
      !i && n && /* @__PURE__ */ t.jsx(Ne, { density: r }),
      !i && !n && d && /* @__PURE__ */ t.jsx(Ae, { message: u }),
      !i && !n && !d && f
    ] })
  ] });
}
function Ne({ density: e }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3", "aria-busy": "true", children: [
    /* @__PURE__ */ t.jsx(k, { height: e === "spacious" ? 48 : 32, className: "w-1/3" }),
    /* @__PURE__ */ t.jsx(k, { height: 16 }),
    /* @__PURE__ */ t.jsx(k, { height: 16, className: "w-5/6" }),
    /* @__PURE__ */ t.jsx(k, { height: 16, className: "w-3/4" })
  ] });
}
function Re({ message: e, onRetry: a }) {
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
function Ae({ message: e }) {
  return /* @__PURE__ */ t.jsx("div", { className: "flex flex-col items-center justify-center text-center gap-1 py-6", children: /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: e }) });
}
v.DRAG_HANDLE_CLASS = q.DRAG_HANDLE_CLASS;
const z = 250, Se = 450;
function p(e = z + Math.random() * (Se - z)) {
  return new Promise((a) => setTimeout(a, e));
}
const y = {
  async budgetSummary() {
    return await p(), {
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
    return await p(), {
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
    return await p(), [
      { id: "inv-001", type: "invoice", title: "TÜBİTAK 1501 — Eylül faturası", requester: "Ahmet Yıldız", amount: 12450, currency: "TRY", ageHours: 4 },
      { id: "exp-002", type: "expense", title: "Yazılım lisansı — JetBrains All", requester: "Mehmet Kaya", amount: 8240, currency: "TRY", ageHours: 18 },
      { id: "po-003", type: "po", title: "Bulut hosting (Q3 yenileme)", requester: "Zeynep Aksoy", amount: 24900, currency: "TRY", ageHours: 36 },
      { id: "inv-004", type: "invoice", title: "KOSGEB danışmanlık — Ağustos", requester: "Selin Aydın", amount: 6800, currency: "TRY", ageHours: 52 }
    ];
  },
  async approveItem(e) {
    if (await p(600), Math.random() < 0.05) {
      const a = new Error("Bu kayıt başka bir kullanıcı tarafından onaylanmış.");
      throw a.status = 409, a;
    }
    return { id: e.id, status: "approved" };
  },
  async rejectItem(e) {
    return await p(400), { id: e.id, status: "rejected" };
  },
  async riskAlerts() {
    return await p(), [
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
    return await p(300), { id: e.id, dismissed: !0 };
  },
  async acceptRisk(e) {
    return await p(500), { id: e.id, accepted: !0 };
  }
}, Ee = () => y.budgetSummary();
function De() {
  return A({
    queryKey: m.dashboard.budget(),
    queryFn: Ee
  });
}
function Le() {
  const { data: e, isLoading: a, isError: s, refetch: o } = De(), n = () => o(), i = e ? e.spent / e.budget * 100 : 0, c = T(i), l = e ? B(e.deltaPct) : null;
  return /* @__PURE__ */ t.jsx(
    v,
    {
      title: "Bütçe Sağlığı",
      subtitle: "Tüm aktif projeler — bu ay",
      badge: /* @__PURE__ */ t.jsx(w, { variant: c.badgeVariant, size: "sm", withDot: !0, children: c.label }),
      isLoading: a,
      isError: s,
      onRetry: n,
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-baseline gap-2 font-tabular", children: [
          /* @__PURE__ */ t.jsx("span", { className: "text-3xl font-semibold tracking-tight", children: D(e.spent, e.currency) }),
          /* @__PURE__ */ t.jsxs("span", { className: "text-sm text-text-tertiary", children: [
            "/ ",
            D(e.budget, e.currency)
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
        /* @__PURE__ */ t.jsx(_e, { value: i, variant: c.barVariant }),
        /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-1.5 mt-1 overflow-y-auto", children: e.breakdown.map((d) => /* @__PURE__ */ t.jsxs(
          "li",
          {
            className: "flex items-center justify-between text-xs gap-3",
            children: [
              /* @__PURE__ */ t.jsx("span", { className: "truncate text-text-secondary", children: d.project }),
              /* @__PURE__ */ t.jsxs("span", { className: h(
                "font-tabular font-medium",
                T(d.ratio * 100).textVariant
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
function T(e) {
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
function _e({ value: e, variant: a = "positive" }) {
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
          className: h(
            s,
            "h-full rounded-full transition-all duration-slow ease-standard"
          ),
          style: { width: `${Math.min(e, 100)}%` }
        }
      )
    }
  );
}
const Ce = () => y.cashFlow();
function Me() {
  return A({
    queryKey: m.dashboard.cashflow(),
    queryFn: Ce
  });
}
function Pe() {
  const { data: e, isLoading: a, isError: s, refetch: o } = Me(), n = () => o(), i = e ? B(e.deltaPct) : null, c = e ? e.deltaPct >= 0 : !0;
  return /* @__PURE__ */ t.jsx(
    v,
    {
      title: "Nakit Akışı",
      subtitle: "Son 30 gün",
      isLoading: a,
      isError: s,
      onRetry: n,
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-4 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 flex-none", children: [
          /* @__PURE__ */ t.jsx("div", { className: "text-2xl font-semibold tracking-tight font-tabular", children: D(e.netCurrent, e.currency) }),
          i && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 text-xs", children: [
            /* @__PURE__ */ t.jsxs("span", { className: h(
              "inline-flex items-center gap-1 font-medium font-tabular",
              c ? "text-text-positive" : "text-text-negative"
            ), children: [
              i.symbol,
              " ",
              i.text
            ] }),
            /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: "vs önceki dönem" })
          ] })
        ] }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx(ze, { series: e.series, variant: c ? "positive" : "negative" }) })
      ] })
    }
  );
}
function ze({ series: e, variant: a = "positive" }) {
  const o = `cashflow-grad-${x.useId().replace(/:/g, "")}`;
  if (!e || e.length < 2) return null;
  const n = 100, i = 40, c = Math.min(...e), d = Math.max(...e) - c || 1, r = e.map((g, S) => {
    const E = S / (e.length - 1) * n, F = i - (g - c) / d * i;
    return [E, F];
  }).map(([g, S], E) => `${E === 0 ? "M" : "L"} ${g.toFixed(2)} ${S.toFixed(2)}`).join(" "), f = `${r} L ${n} ${i} L 0 ${i} Z`, j = a === "positive" ? "var(--apya-positive-500)" : "var(--apya-negative-500)";
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      viewBox: `0 0 ${n} ${i}`,
      preserveAspectRatio: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ t.jsx("defs", { children: /* @__PURE__ */ t.jsxs("linearGradient", { id: o, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ t.jsx("stop", { offset: "0%", stopColor: j, stopOpacity: "0.25" }),
          /* @__PURE__ */ t.jsx("stop", { offset: "100%", stopColor: j, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ t.jsx("path", { d: f, fill: `url(#${o})` }),
        /* @__PURE__ */ t.jsx(
          "path",
          {
            d: r,
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
const Te = () => y.pendingApprovals();
function He() {
  return A({
    queryKey: m.dashboard.approvals(),
    queryFn: Te
  });
}
function Y(e) {
  const a = C();
  return K({
    mutationFn: e,
    onMutate: async (s) => {
      await a.cancelQueries({ queryKey: m.dashboard.approvals() });
      const o = a.getQueryData(m.dashboard.approvals());
      return a.setQueryData(
        m.dashboard.approvals(),
        (n = []) => n.filter((i) => i.id !== s.id)
      ), { previous: o, item: s };
    },
    onError: (s, o, n) => {
      n != null && n.previous && a.setQueryData(m.dashboard.approvals(), n.previous);
    },
    onSettled: () => {
      a.invalidateQueries({ queryKey: m.dashboard.approvals() }), a.invalidateQueries({ queryKey: m.dashboard.budget() }), a.invalidateQueries({ queryKey: m.dashboard.cashflow() });
    }
  });
}
function Ie() {
  return Y((e) => y.approveItem(e));
}
function Be() {
  return Y((e) => y.rejectItem(e));
}
const H = {
  invoice: { label: "Fatura", variant: "brand" },
  expense: { label: "Masraf", variant: "neutral" },
  po: { label: "Sipariş", variant: "ai" }
};
function Ge() {
  const { data: e, isLoading: a, isError: s, refetch: o } = He(), n = Ie(), i = Be(), c = () => o(), l = (r) => n.mutateAsync(r).catch(() => {
  }), d = (r) => i.mutateAsync(r).catch(() => {
  }), u = (e == null ? void 0 : e.length) ?? 0;
  return /* @__PURE__ */ t.jsx(
    v,
    {
      title: "Onay Bekleyenler",
      subtitle: u > 0 ? `${u} kalem inceleme bekliyor` : void 0,
      badge: u > 0 && /* @__PURE__ */ t.jsx(w, { variant: "warning", size: "sm", withDot: !0, children: u }),
      isLoading: a,
      isError: s,
      onRetry: c,
      isEmpty: !a && !s && u === 0,
      emptyMessage: "🎉 Bekleyen onay yok.",
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: e == null ? void 0 : e.map((r) => /* @__PURE__ */ t.jsx(
        Ke,
        {
          item: r,
          onApprove: l,
          onReject: d
        },
        r.id
      )) })
    }
  );
}
function Ke({ item: e, onApprove: a, onReject: s }) {
  const [o, n] = R.useState(null), i = H[e.type] ?? H.expense, c = $e(e.ageHours), l = async (d, u) => {
    if (!o) {
      n(d);
      try {
        await (u == null ? void 0 : u(e));
      } finally {
        n(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsxs("li", { className: h(
    "flex items-center gap-3 p-2.5 rounded-md",
    "bg-surface-base border border-subtle",
    "transition-opacity duration-fast",
    o && "opacity-60"
  ), children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 min-w-0 flex-1", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(w, { variant: i.variant, size: "sm", children: i.label }),
        /* @__PURE__ */ t.jsxs("span", { className: "text-xs text-text-tertiary truncate", children: [
          e.requester,
          " · ",
          c
        ] })
      ] }),
      /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary truncate", children: e.title })
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "font-tabular font-semibold text-sm text-text-primary flex-none", children: ee(e.amount, e.currency) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 flex-none", children: [
      /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => l("reject", s),
          isLoading: o === "reject",
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
          isLoading: o === "approve",
          "aria-label": `${e.title} onayla`,
          children: "Onayla"
        }
      )
    ] })
  ] });
}
function $e(e) {
  return e < 1 ? "az önce" : e < 24 ? `${Math.round(e)} sa önce` : `${Math.floor(e / 24)} gün önce`;
}
const Oe = () => y.riskAlerts();
function We() {
  return A({
    queryKey: m.dashboard.risks(),
    queryFn: Oe
  });
}
function Q(e) {
  const a = C();
  return K({
    mutationFn: e,
    onMutate: async (s) => {
      await a.cancelQueries({ queryKey: m.dashboard.risks() });
      const o = a.getQueryData(m.dashboard.risks());
      return a.setQueryData(
        m.dashboard.risks(),
        (n = []) => n.filter((i) => i.id !== s.id)
      ), { previous: o };
    },
    onError: (s, o, n) => {
      n != null && n.previous && a.setQueryData(m.dashboard.risks(), n.previous);
    },
    onSettled: () => {
      a.invalidateQueries({ queryKey: m.dashboard.risks() });
    }
  });
}
function qe() {
  return Q((e) => y.dismissRisk(e));
}
function Ye() {
  return Q((e) => y.acceptRisk(e));
}
const _ = {
  critical: { label: "Kritik", variant: "critical", priority: 0 },
  actionable: { label: "Eyleme açık", variant: "warning", priority: 1 },
  info: { label: "Bilgi", variant: "ai", priority: 2 }
};
function Qe() {
  const { data: e, isLoading: a, isError: s, refetch: o } = We(), n = qe(), i = Ye(), c = () => o(), l = (r) => n.mutateAsync(r).catch(() => {
  }), d = (r) => i.mutateAsync(r).catch(() => {
  }), u = R.useMemo(
    () => [...e ?? []].sort(
      (r, f) => _[r.severity].priority - _[f.severity].priority
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
      isError: s,
      onRetry: c,
      isEmpty: !a && !s && u.length === 0,
      emptyMessage: "Şu an risk yok — AI motoru tarama tamamladı.",
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: u.map((r) => /* @__PURE__ */ t.jsx(
        Fe,
        {
          risk: r,
          onAccept: d,
          onDismiss: l
        },
        r.id
      )) })
    }
  );
}
function Fe({ risk: e, onAccept: a, onDismiss: s }) {
  const [o, n] = R.useState(!1), [i, c] = R.useState(null), l = _[e.severity], d = async (u, r) => {
    if (!i) {
      c(u);
      try {
        await (r == null ? void 0 : r(e));
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
    i && "opacity-60"
  ), children: /* @__PURE__ */ t.jsxs("div", { className: "p-2.5 flex flex-col gap-2", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t.jsx(w, { variant: l.variant, size: "sm", withDot: !0, children: l.label }),
      /* @__PURE__ */ t.jsx(Ve, { score: e.confidence, label: e.confidenceLabel })
    ] }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug", children: e.title }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: () => n((u) => !u),
        "aria-expanded": o,
        className: h(
          "self-start text-xs text-text-link hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: o ? "Açıklamayı gizle" : "Neden bu öneri?"
      }
    ),
    o && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: e.reasons.map((u, r) => /* @__PURE__ */ t.jsx("li", { children: u }, r)) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
      /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => d("dismiss", s),
          isLoading: i === "dismiss",
          children: "Şimdi değil"
        }
      ),
      /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: e.severity === "critical" ? "destructive" : "primary",
          onClick: () => d("accept", a),
          isLoading: i === "accept",
          children: e.suggestedAction
        }
      )
    ] })
  ] }) });
}
function Ve({ score: e, label: a }) {
  const s = Math.max(0, Math.min(5, Math.round(e / 100 * 5)));
  return /* @__PURE__ */ t.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1 text-xs text-text-tertiary",
      title: `Güven: %${e}`,
      children: [
        /* @__PURE__ */ t.jsxs("span", { className: "font-tabular tracking-wider", "aria-hidden": "true", children: [
          "●".repeat(s),
          /* @__PURE__ */ t.jsx("span", { className: "text-text-disabled", children: "○".repeat(5 - s) })
        ] }),
        /* @__PURE__ */ t.jsxs("span", { className: "sr-only", children: [
          "Güven düzeyi: ",
          a,
          " (%",
          e,
          ")"
        ] }),
        /* @__PURE__ */ t.jsx("span", { "aria-hidden": "true", children: a })
      ]
    }
  );
}
const Ue = P.WidthProvider(P.Responsive), Je = {
  "budget-health": Le,
  "cash-flow": Pe,
  "pending-approvals": Ge,
  "risk-alerts": Qe
};
function Ze() {
  const [e, a] = x.useState(() => be()), [s, o] = x.useState(!1), n = x.useMemo(() => {
    const r = L[e] ?? L.cfo, f = we(e);
    return f ? { ...r, ...f } : r;
  }, [e]), i = x.useCallback((r) => {
    a(r), ve(r);
  }, []), c = x.useCallback(
    (r, f) => {
      s && je(e, f);
    },
    [s, e]
  ), l = x.useCallback(() => {
    ke(e), a(e);
  }, [e]), u = (n.desktop ?? []).map((r) => r.i);
  return /* @__PURE__ */ t.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ t.jsx(
      Xe,
      {
        persona: e,
        onPersonaChange: i,
        editMode: s,
        onEditModeToggle: () => o((r) => !r),
        onReset: l
      }
    ),
    /* @__PURE__ */ t.jsx("main", { className: "px-4 py-4 mobile:px-2 mobile:py-2", children: /* @__PURE__ */ t.jsx(
      Ue,
      {
        className: h("apya-bento", s && "apya-bento--edit"),
        layouts: n,
        breakpoints: fe,
        cols: pe,
        rowHeight: ye,
        margin: ge,
        isDraggable: s,
        isResizable: s,
        draggableHandle: `.${v.DRAG_HANDLE_CLASS}`,
        onLayoutChange: c,
        compactType: "vertical",
        preventCollision: !1,
        children: u.map((r) => {
          const f = Je[r];
          return f ? /* @__PURE__ */ t.jsx("div", { className: "apya-bento-item", children: /* @__PURE__ */ t.jsx(f, {}) }, r) : /* @__PURE__ */ t.jsx("div", { children: /* @__PURE__ */ t.jsx(v, { title: `Bilinmeyen widget: ${r}` }) }, r);
        })
      }
    ) }),
    s && /* @__PURE__ */ t.jsxs(
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
              onClick: () => o(!1),
              children: "Bitir"
            }
          )
        ]
      }
    )
  ] });
}
function Xe({ persona: e, onPersonaChange: a, editMode: s, onEditModeToggle: o, onReset: n }) {
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
        O[e],
        " görünümü"
      ] })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      /* @__PURE__ */ t.jsx(et, { value: e, onChange: a }),
      s ? /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: "secondary",
          onClick: n,
          title: "Layout'u persona varsayılanına döndür",
          children: "Sıfırla"
        }
      ) : null,
      /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: s ? "primary" : "secondary",
          onClick: o,
          children: s ? "Tamamla" : "Düzenle"
        }
      ),
      /* @__PURE__ */ t.jsx(te, {})
    ] })
  ] });
}
function et({ value: e, onChange: a }) {
  return /* @__PURE__ */ t.jsxs("label", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ t.jsx("span", { className: "sr-only", children: "Persona seç" }),
    /* @__PURE__ */ t.jsx(
      "select",
      {
        value: e,
        onChange: (s) => a(s.target.value),
        className: h(
          "h-10 px-3 text-sm rounded-md",
          "bg-surface-base text-text-primary",
          "border border-default",
          "hover:border-strong",
          "focus-visible:outline-none focus-visible:shadow-focus",
          "transition-colors duration-fast"
        ),
        children: Object.entries(O).map(([s, o]) => /* @__PURE__ */ t.jsx("option", { value: s, children: o }, s))
      }
    )
  ] });
}
function tt(e) {
  const { connection: a, state: s } = le(), o = C();
  x.useEffect(() => {
    if (!a || !(e != null && e.length)) return;
    const n = e.map(([i, c]) => {
      const l = () => {
        c.forEach((d) => {
          o.invalidateQueries({ queryKey: d });
        });
      };
      return a.on(i, l), [i, l];
    });
    return () => {
      n.forEach(([i, c]) => {
        a.off(i, c);
      });
    };
  }, [a, s, o]);
}
function at() {
  const e = x.useMemo(() => [
    ["JournalEntryPosted", [m.dashboard.budget(), m.dashboard.cashflow()]],
    ["ApprovalDecided", [m.dashboard.approvals(), m.dashboard.budget(), m.dashboard.cashflow()]],
    ["RiskDetected", [m.dashboard.risks()]],
    ["RiskDismissed", [m.dashboard.risks()]]
  ], []);
  return tt(e), null;
}
ae();
const I = document.getElementById("apya-dashboard-root");
I && V(I).render(
  /* @__PURE__ */ t.jsx(se, { children: /* @__PURE__ */ t.jsx(ue, { children: /* @__PURE__ */ t.jsx(ne, { children: /* @__PURE__ */ t.jsxs(oe, { children: [
    /* @__PURE__ */ t.jsx(at, {}),
    /* @__PURE__ */ t.jsx(Ze, {})
  ] }) }) }) })
);
