import { r as m, j as t, e as N, d as F } from "./react-vendor.js";
import { C as V, a as U, b as J, c as h, d as Z, B as j, S as k, Q as x, f as B, e as D, g as X, h as b, T as ee, r as te, i as ae, j as se } from "./registerServiceWorker.js";
import { H as I, a as ne, L as ie } from "./signalr-vendor.js";
import { r as z } from "./grid-vendor.js";
import { u as R, a as E, b as G } from "./query-vendor.js";
/* empty css      */
const K = m.createContext({
  connection: null,
  state: I.Disconnected
});
function re({ hubUrl: e = "/signalr-hubs/notifications", children: a, enabled: s = !0 }) {
  const [l, n] = m.useState(I.Disconnected), i = m.useRef(null);
  m.useEffect(() => {
    if (!s || typeof window > "u") return;
    const o = new ne().withUrl(e, { withCredentials: !0 }).withAutomaticReconnect([0, 2e3, 5e3, 1e4, 3e4]).configureLogging(ie.Warning).build();
    i.current = o, n(o.state);
    const d = () => n(o.state);
    return o.onreconnecting(d), o.onreconnected(d), o.onclose(d), o.start().then(d).catch((u) => {
      console.warn("[SignalR] connect failed:", u == null ? void 0 : u.message), d();
    }), () => {
      o.stop().catch(() => {
      }), i.current = null;
    };
  }, [e, s]);
  const c = m.useMemo(() => ({
    get connection() {
      return i.current;
    },
    state: l
  }), [l]);
  return /* @__PURE__ */ t.jsx(K.Provider, { value: c, children: a });
}
function le() {
  return m.useContext(K);
}
const oe = {
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
}, ce = {
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
}, de = {
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
  cfo: oe,
  pm: ce,
  field: de
}, $ = {
  cfo: "CFO / Finansman",
  pm: "Proje Yöneticisi",
  field: "Saha Kullanıcısı"
}, ue = {
  desktop: 1280,
  tablet: 768,
  mobile: 0
}, xe = {
  desktop: 12,
  tablet: 8,
  mobile: 1
}, me = 64, he = [12, 12], O = "apya-dashboard-persona", C = "apya-dashboard-layout-overrides";
function pe() {
  if (typeof window > "u") return "cfo";
  try {
    const e = window.localStorage.getItem(O);
    if (e && L[e]) return e;
  } catch {
  }
  return "cfo";
}
function fe(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(O, e);
    } catch {
    }
}
function ye(e) {
  if (typeof window > "u") return null;
  try {
    const a = window.localStorage.getItem(`${C}-${e}`);
    return a ? JSON.parse(a) : null;
  } catch {
    return null;
  }
}
function ge(e, a) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(
        `${C}-${e}`,
        JSON.stringify(a)
      );
    } catch {
    }
}
function be(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.removeItem(`${C}-${e}`);
    } catch {
    }
}
const W = {
  /* react-grid-layout drag handle'ı için class — yalnızca header'dan sürüklenir,
     body'den sürüklendiğinde widget içindeki interactive element'leri tetiklemez. */
  DRAG_HANDLE_CLASS: "widget-drag-handle"
};
function v({
  title: e,
  subtitle: a,
  badge: s,
  actions: l,
  /* sağ üstteki action button'lar */
  isLoading: n = !1,
  isError: i = !1,
  errorMessage: c,
  onRetry: o,
  isEmpty: d = !1,
  emptyMessage: u = "Görüntülenecek veri yok.",
  density: r = "compact",
  children: p,
  className: w
}) {
  return /* @__PURE__ */ t.jsxs(V, { variant: "default", className: h("h-full flex flex-col", w), children: [
    /* @__PURE__ */ t.jsxs(
      U,
      {
        density: r,
        className: h(
          /* Header drag-handle olur — sadece BURASI sürüklenir */
          W.DRAG_HANDLE_CLASS,
          "cursor-grab active:cursor-grabbing select-none",
          "flex-row items-center justify-between flex-none"
        ),
        children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0 flex-1", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ t.jsx(J, { className: "text-sm font-semibold truncate", children: e }),
              s
            ] }),
            a && /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary truncate", children: a })
          ] }),
          l && /* Action button'ların onClick'leri drag'i tetiklemesin diye stopPropagation */
          /* @__PURE__ */ t.jsx(
            "div",
            {
              className: "flex items-center gap-1 flex-none",
              onMouseDown: (g) => g.stopPropagation(),
              onTouchStart: (g) => g.stopPropagation(),
              children: l
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ t.jsxs(Z, { density: r, className: "flex-1 overflow-auto", children: [
      i && /* @__PURE__ */ t.jsx(je, { message: c, onRetry: o }),
      !i && n && /* @__PURE__ */ t.jsx(ve, { density: r }),
      !i && !n && d && /* @__PURE__ */ t.jsx(we, { message: u }),
      !i && !n && !d && p
    ] })
  ] });
}
function ve({ density: e }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3", "aria-busy": "true", children: [
    /* @__PURE__ */ t.jsx(k, { height: e === "spacious" ? 48 : 32, className: "w-1/3" }),
    /* @__PURE__ */ t.jsx(k, { height: 16 }),
    /* @__PURE__ */ t.jsx(k, { height: 16, className: "w-5/6" }),
    /* @__PURE__ */ t.jsx(k, { height: 16, className: "w-3/4" })
  ] });
}
function je({ message: e, onRetry: a }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col items-center justify-center text-center gap-2 py-4", children: [
    /* @__PURE__ */ t.jsx(j, { variant: "negative", withDot: !0, children: "Yüklenemedi" }),
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
function we({ message: e }) {
  return /* @__PURE__ */ t.jsx("div", { className: "flex flex-col items-center justify-center text-center gap-1 py-6", children: /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: e }) });
}
v.DRAG_HANDLE_CLASS = W.DRAG_HANDLE_CLASS;
const P = 250, ke = 450;
function f(e = P + Math.random() * (ke - P)) {
  return new Promise((a) => setTimeout(a, e));
}
const y = {
  async budgetSummary() {
    return await f(), {
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
    return await f(), {
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
    return await f(), [
      { id: "inv-001", type: "invoice", title: "TÜBİTAK 1501 — Eylül faturası", requester: "Ahmet Yıldız", amount: 12450, currency: "TRY", ageHours: 4 },
      { id: "exp-002", type: "expense", title: "Yazılım lisansı — JetBrains All", requester: "Mehmet Kaya", amount: 8240, currency: "TRY", ageHours: 18 },
      { id: "po-003", type: "po", title: "Bulut hosting (Q3 yenileme)", requester: "Zeynep Aksoy", amount: 24900, currency: "TRY", ageHours: 36 },
      { id: "inv-004", type: "invoice", title: "KOSGEB danışmanlık — Ağustos", requester: "Selin Aydın", amount: 6800, currency: "TRY", ageHours: 52 }
    ];
  },
  async approveItem(e) {
    if (await f(600), Math.random() < 0.05) {
      const a = new Error("Bu kayıt başka bir kullanıcı tarafından onaylanmış.");
      throw a.status = 409, a;
    }
    return { id: e.id, status: "approved" };
  },
  async rejectItem(e) {
    return await f(400), { id: e.id, status: "rejected" };
  },
  async riskAlerts() {
    return await f(), [
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
    return await f(300), { id: e.id, dismissed: !0 };
  },
  async acceptRisk(e) {
    return await f(500), { id: e.id, accepted: !0 };
  }
}, Ne = () => y.budgetSummary();
function Re() {
  return R({
    queryKey: x.dashboard.budget(),
    queryFn: Ne
  });
}
function Ae() {
  const { data: e, isLoading: a, isError: s, refetch: l } = Re(), n = () => l(), i = e ? e.spent / e.budget * 100 : 0, c = T(i), o = e ? B(e.deltaPct) : null;
  return /* @__PURE__ */ t.jsx(
    v,
    {
      title: "Bütçe Sağlığı",
      subtitle: "Tüm aktif projeler — bu ay",
      badge: /* @__PURE__ */ t.jsx(j, { variant: c.badgeVariant, size: "sm", withDot: !0, children: c.label }),
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
        o && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1.5 text-xs", children: [
          /* @__PURE__ */ t.jsxs("span", { className: h(
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
        /* @__PURE__ */ t.jsx(Se, { value: i, variant: c.barVariant }),
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
function Se({ value: e, variant: a = "positive" }) {
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
const De = () => y.cashFlow();
function Le() {
  return R({
    queryKey: x.dashboard.cashflow(),
    queryFn: De
  });
}
function _e() {
  const { data: e, isLoading: a, isError: s, refetch: l } = Le(), n = () => l(), i = e ? B(e.deltaPct) : null, c = e ? e.deltaPct >= 0 : !0;
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
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx(Ee, { series: e.series, variant: c ? "positive" : "negative" }) })
      ] })
    }
  );
}
function Ee({ series: e, variant: a = "positive" }) {
  const l = `cashflow-grad-${m.useId().replace(/:/g, "")}`;
  if (!e || e.length < 2) return null;
  const n = 100, i = 40, c = Math.min(...e), d = Math.max(...e) - c || 1, r = e.map((g, A) => {
    const S = A / (e.length - 1) * n, Q = i - (g - c) / d * i;
    return [S, Q];
  }).map(([g, A], S) => `${S === 0 ? "M" : "L"} ${g.toFixed(2)} ${A.toFixed(2)}`).join(" "), p = `${r} L ${n} ${i} L 0 ${i} Z`, w = a === "positive" ? "var(--apya-positive-500)" : "var(--apya-negative-500)";
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      viewBox: `0 0 ${n} ${i}`,
      preserveAspectRatio: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ t.jsx("defs", { children: /* @__PURE__ */ t.jsxs("linearGradient", { id: l, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ t.jsx("stop", { offset: "0%", stopColor: w, stopOpacity: "0.25" }),
          /* @__PURE__ */ t.jsx("stop", { offset: "100%", stopColor: w, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ t.jsx("path", { d: p, fill: `url(#${l})` }),
        /* @__PURE__ */ t.jsx(
          "path",
          {
            d: r,
            fill: "none",
            stroke: w,
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
const Ce = () => y.pendingApprovals();
function ze() {
  return R({
    queryKey: x.dashboard.approvals(),
    queryFn: Ce
  });
}
function q(e) {
  const a = E();
  return G({
    mutationFn: e,
    onMutate: async (s) => {
      await a.cancelQueries({ queryKey: x.dashboard.approvals() });
      const l = a.getQueryData(x.dashboard.approvals());
      return a.setQueryData(
        x.dashboard.approvals(),
        (n = []) => n.filter((i) => i.id !== s.id)
      ), { previous: l, item: s };
    },
    onError: (s, l, n) => {
      n != null && n.previous && a.setQueryData(x.dashboard.approvals(), n.previous);
    },
    onSettled: () => {
      a.invalidateQueries({ queryKey: x.dashboard.approvals() }), a.invalidateQueries({ queryKey: x.dashboard.budget() }), a.invalidateQueries({ queryKey: x.dashboard.cashflow() });
    }
  });
}
function Pe() {
  return q((e) => y.approveItem(e));
}
function Te() {
  return q((e) => y.rejectItem(e));
}
const M = {
  invoice: { label: "Fatura", variant: "brand" },
  expense: { label: "Masraf", variant: "neutral" },
  po: { label: "Sipariş", variant: "ai" }
};
function Me() {
  const { data: e, isLoading: a, isError: s, refetch: l } = ze(), n = Pe(), i = Te(), c = () => l(), o = (r) => n.mutateAsync(r).catch(() => {
  }), d = (r) => i.mutateAsync(r).catch(() => {
  }), u = (e == null ? void 0 : e.length) ?? 0;
  return /* @__PURE__ */ t.jsx(
    v,
    {
      title: "Onay Bekleyenler",
      subtitle: u > 0 ? `${u} kalem inceleme bekliyor` : void 0,
      badge: u > 0 && /* @__PURE__ */ t.jsx(j, { variant: "warning", size: "sm", withDot: !0, children: u }),
      isLoading: a,
      isError: s,
      onRetry: c,
      isEmpty: !a && !s && u === 0,
      emptyMessage: "🎉 Bekleyen onay yok.",
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: e == null ? void 0 : e.map((r) => /* @__PURE__ */ t.jsx(
        He,
        {
          item: r,
          onApprove: o,
          onReject: d
        },
        r.id
      )) })
    }
  );
}
function He({ item: e, onApprove: a, onReject: s }) {
  const [l, n] = N.useState(null), i = M[e.type] ?? M.expense, c = Be(e.ageHours), o = async (d, u) => {
    if (!l) {
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
    l && "opacity-60"
  ), children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 min-w-0 flex-1", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(j, { variant: i.variant, size: "sm", children: i.label }),
        /* @__PURE__ */ t.jsxs("span", { className: "text-xs text-text-tertiary truncate", children: [
          e.requester,
          " · ",
          c
        ] })
      ] }),
      /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary truncate", children: e.title })
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "font-tabular font-semibold text-sm text-text-primary flex-none", children: X(e.amount, e.currency) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 flex-none", children: [
      /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => o("reject", s),
          isLoading: l === "reject",
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
          onClick: () => o("approve", a),
          isLoading: l === "approve",
          "aria-label": `${e.title} onayla`,
          children: "Onayla"
        }
      )
    ] })
  ] });
}
function Be(e) {
  return e < 1 ? "az önce" : e < 24 ? `${Math.round(e)} sa önce` : `${Math.floor(e / 24)} gün önce`;
}
const Ie = () => y.riskAlerts();
function Ge() {
  return R({
    queryKey: x.dashboard.risks(),
    queryFn: Ie
  });
}
function Y(e) {
  const a = E();
  return G({
    mutationFn: e,
    onMutate: async (s) => {
      await a.cancelQueries({ queryKey: x.dashboard.risks() });
      const l = a.getQueryData(x.dashboard.risks());
      return a.setQueryData(
        x.dashboard.risks(),
        (n = []) => n.filter((i) => i.id !== s.id)
      ), { previous: l };
    },
    onError: (s, l, n) => {
      n != null && n.previous && a.setQueryData(x.dashboard.risks(), n.previous);
    },
    onSettled: () => {
      a.invalidateQueries({ queryKey: x.dashboard.risks() });
    }
  });
}
function Ke() {
  return Y((e) => y.dismissRisk(e));
}
function $e() {
  return Y((e) => y.acceptRisk(e));
}
const _ = {
  critical: { label: "Kritik", variant: "critical", priority: 0 },
  actionable: { label: "Eyleme açık", variant: "warning", priority: 1 },
  info: { label: "Bilgi", variant: "ai", priority: 2 }
};
function Oe() {
  const { data: e, isLoading: a, isError: s, refetch: l } = Ge(), n = Ke(), i = $e(), c = () => l(), o = (r) => n.mutateAsync(r).catch(() => {
  }), d = (r) => i.mutateAsync(r).catch(() => {
  }), u = N.useMemo(
    () => [...e ?? []].sort(
      (r, p) => _[r.severity].priority - _[p.severity].priority
    ),
    [e]
  );
  return /* @__PURE__ */ t.jsx(
    v,
    {
      title: "Risk Uyarıları",
      subtitle: "AI öneri motoru",
      badge: /* @__PURE__ */ t.jsx(j, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
      isLoading: a,
      isError: s,
      onRetry: c,
      isEmpty: !a && !s && u.length === 0,
      emptyMessage: "Şu an risk yok — AI motoru tarama tamamladı.",
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: u.map((r) => /* @__PURE__ */ t.jsx(
        We,
        {
          risk: r,
          onAccept: d,
          onDismiss: o
        },
        r.id
      )) })
    }
  );
}
function We({ risk: e, onAccept: a, onDismiss: s }) {
  const [l, n] = N.useState(!1), [i, c] = N.useState(null), o = _[e.severity], d = async (u, r) => {
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
      /* @__PURE__ */ t.jsx(j, { variant: o.variant, size: "sm", withDot: !0, children: o.label }),
      /* @__PURE__ */ t.jsx(qe, { score: e.confidence, label: e.confidenceLabel })
    ] }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug", children: e.title }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: () => n((u) => !u),
        "aria-expanded": l,
        className: h(
          "self-start text-xs text-text-link hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: l ? "Açıklamayı gizle" : "Neden bu öneri?"
      }
    ),
    l && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: e.reasons.map((u, r) => /* @__PURE__ */ t.jsx("li", { children: u }, r)) }),
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
function qe({ score: e, label: a }) {
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
const Ye = z.WidthProvider(z.Responsive), Qe = {
  "budget-health": Ae,
  "cash-flow": _e,
  "pending-approvals": Me,
  "risk-alerts": Oe
};
function Fe() {
  const [e, a] = m.useState(() => pe()), [s, l] = m.useState(!1), n = m.useMemo(() => {
    const r = L[e] ?? L.cfo, p = ye(e);
    return p ? { ...r, ...p } : r;
  }, [e]), i = m.useCallback((r) => {
    a(r), fe(r);
  }, []), c = m.useCallback(
    (r, p) => {
      s && ge(e, p);
    },
    [s, e]
  ), o = m.useCallback(() => {
    be(e), a(e);
  }, [e]), u = (n.desktop ?? []).map((r) => r.i);
  return /* @__PURE__ */ t.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ t.jsx(
      Ve,
      {
        persona: e,
        onPersonaChange: i,
        editMode: s,
        onEditModeToggle: () => l((r) => !r),
        onReset: o
      }
    ),
    /* @__PURE__ */ t.jsx("main", { className: "px-4 py-4 mobile:px-2 mobile:py-2", children: /* @__PURE__ */ t.jsx(
      Ye,
      {
        className: h("apya-bento", s && "apya-bento--edit"),
        layouts: n,
        breakpoints: ue,
        cols: xe,
        rowHeight: me,
        margin: he,
        isDraggable: s,
        isResizable: s,
        draggableHandle: `.${v.DRAG_HANDLE_CLASS}`,
        onLayoutChange: c,
        compactType: "vertical",
        preventCollision: !1,
        children: u.map((r) => {
          const p = Qe[r];
          return p ? /* @__PURE__ */ t.jsx("div", { className: "apya-bento-item", children: /* @__PURE__ */ t.jsx(p, {}) }, r) : /* @__PURE__ */ t.jsx("div", { children: /* @__PURE__ */ t.jsx(v, { title: `Bilinmeyen widget: ${r}` }) }, r);
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
              onClick: () => l(!1),
              children: "Bitir"
            }
          )
        ]
      }
    )
  ] });
}
function Ve({ persona: e, onPersonaChange: a, editMode: s, onEditModeToggle: l, onReset: n }) {
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
        $[e],
        " görünümü"
      ] })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      /* @__PURE__ */ t.jsx(Ue, { value: e, onChange: a }),
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
          onClick: l,
          children: s ? "Tamamla" : "Düzenle"
        }
      ),
      /* @__PURE__ */ t.jsx(ee, {})
    ] })
  ] });
}
function Ue({ value: e, onChange: a }) {
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
        children: Object.entries($).map(([s, l]) => /* @__PURE__ */ t.jsx("option", { value: s, children: l }, s))
      }
    )
  ] });
}
function Je(e) {
  const { connection: a, state: s } = le(), l = E();
  m.useEffect(() => {
    if (!a || !(e != null && e.length)) return;
    const n = e.map(([i, c]) => {
      const o = () => {
        c.forEach((d) => {
          l.invalidateQueries({ queryKey: d });
        });
      };
      return a.on(i, o), [i, o];
    });
    return () => {
      n.forEach(([i, c]) => {
        a.off(i, c);
      });
    };
  }, [a, s, l]);
}
function Ze() {
  const e = m.useMemo(() => [
    ["JournalEntryPosted", [x.dashboard.budget(), x.dashboard.cashflow()]],
    ["ApprovalDecided", [x.dashboard.approvals(), x.dashboard.budget(), x.dashboard.cashflow()]],
    ["RiskDetected", [x.dashboard.risks()]],
    ["RiskDismissed", [x.dashboard.risks()]]
  ], []);
  return Je(e), null;
}
te();
const H = document.getElementById("apya-dashboard-root");
H && F(H).render(
  /* @__PURE__ */ t.jsx(ae, { children: /* @__PURE__ */ t.jsx(se, { children: /* @__PURE__ */ t.jsxs(re, { children: [
    /* @__PURE__ */ t.jsx(Ze, {}),
    /* @__PURE__ */ t.jsx(Fe, {})
  ] }) }) })
);
