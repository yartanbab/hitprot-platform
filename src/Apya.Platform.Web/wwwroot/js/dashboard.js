import { r as x, j as e, d as ae, b as Ie } from "./react-vendor-D57GAUXd.js";
import { c as m, t as r, S as P, a as Le, f as z, b as le, d as He, e as Me, I as Be, B as L, T as Ke } from "./Dialog-BdNKdiS6.js";
import { Q as k, a as Fe } from "./QueryProvider-AIUp_Zk5.js";
import { H as ge, a as Oe, L as We } from "./signalr-vendor-CjTpd8t3.js";
import { D as Ue } from "./useDeviceMode-Dk7fb2QY.js";
import { u as Ge, r as _e, T as qe } from "./registerServiceWorker-DJF2vjVD.js";
import { r as $e } from "./grid-vendor-D-Pdxerz.js";
import { E as w } from "./EmptyState-Bhcx2Wdd.js";
import { u as S, a as Y, b as ye } from "./query-vendor-Bf69L2iP.js";
import { a as X } from "./httpClient-CRlyQ1eg.js";
/* empty css               */
const je = x.createContext({
  connection: null,
  state: ge.Disconnected
});
function ze({ hubUrl: t = "/signalr-hubs/notifications", children: a, enabled: n = !0 }) {
  const [s, l] = x.useState(ge.Disconnected), c = x.useRef(null);
  x.useEffect(() => {
    if (!n || typeof window > "u") return;
    const i = new Oe().withUrl(t, { withCredentials: !0 }).withAutomaticReconnect([0, 2e3, 5e3, 1e4, 3e4]).configureLogging(We.Warning).build();
    c.current = i, l(i.state);
    const u = () => l(i.state);
    return i.onreconnecting(u), i.onreconnected(u), i.onclose(u), i.start().then(u).catch((d) => {
      console.warn("[SignalR] connect failed:", d == null ? void 0 : d.message), u();
    }), () => {
      i.stop().catch(() => {
      }), c.current = null;
    };
  }, [t, n]);
  const o = x.useMemo(() => ({
    get connection() {
      return c.current;
    },
    state: s
  }), [s]);
  return /* @__PURE__ */ e.jsx(je.Provider, { value: o, children: a });
}
function ve() {
  return x.useContext(je);
}
const ke = "apya-card-drag-handle";
function D({
  title: t,
  subtitle: a,
  badge: n,
  actions: s,
  footer: l,
  accent: c,
  /* 'negative' | 'warning' — kritik kartların üst şeridi */
  editMode: o = !1,
  /* Sorgunun `isPending`i geçilir, `isLoading`i DEĞİL: kalıcı önbellek geri
     yüklenirken isLoading FALSE döner ama veri henüz yoktur; kart o karede
     boş/hatalı içerikle çizilirdi. (Prop adı geriye dönük uyum için kaldı.) */
  isLoading: i = !1,
  isError: u = !1,
  errorMessage: d,
  onRetry: b,
  isEmpty: h = !1,
  emptyState: y,
  skeleton: E,
  isFetching: g = !1,
  isStale: U = !1,
  dataUpdatedAt: N,
  bleed: M = !1,
  className: A,
  bodyClassName: R,
  children: Z
}) {
  const G = !i && !u && U && g;
  return /* @__PURE__ */ e.jsxs(
    "section",
    {
      className: m(
        "h-full flex flex-col overflow-hidden",
        "rounded-card shadow-card",
        "bg-surface-base border border-default",
        A
      ),
      children: [
        c && /* @__PURE__ */ e.jsx(
          "span",
          {
            "aria-hidden": "true",
            className: m(
              "block h-[3px] flex-none",
              c === "negative" ? "bg-negative-500" : "bg-warning-500"
            )
          }
        ),
        /* @__PURE__ */ e.jsxs(
          "header",
          {
            className: m(
              "flex items-start justify-between gap-3 flex-none",
              "px-[18px] pt-4"
            ),
            children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                o && /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: m(
                      ke,
                      "text-accent-soft text-xs tracking-[-2px] cursor-grab active:cursor-grabbing select-none flex-none"
                    ),
                    "aria-hidden": "true",
                    children: "⠿"
                  }
                ),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-semibold tracking-[-0.01em] truncate text-text-primary", children: t }),
                    n,
                    G && /* @__PURE__ */ e.jsx(Xe, {})
                  ] }),
                  a && /* @__PURE__ */ e.jsx("p", { className: "text-[11.5px] text-text-tertiary truncate", children: a })
                ] })
              ] }),
              s && /* Aksiyonlara basmak kartı sürüklemesin. */
              /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "flex items-center gap-2.5 flex-none",
                  onMouseDown: (B) => B.stopPropagation(),
                  onTouchStart: (B) => B.stopPropagation(),
                  children: s
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: m(
              /* Kart yüksekliği ızgaradan SABİT gelir, içerik ise değişken:
                 kayıt sayısı, kart genişliği (satırlar sarar) ve kullanıcının
                 verdiği boyut hepsi etkiliyor. Kaydırma olmadan `overflow-hidden`
                 fazlalığı sessizce kesiyordu — kullanıcının "alt açıklamalar
                 kesiliyor" dediği davranış. Kart kendi gerekçesiyle
                 `bodyClassName="overflow-visible"` diyerek vazgeçebilir. */
              "flex-1 min-h-0 pt-3 overflow-y-auto",
              M ? "pb-0" : "px-[18px] pb-[18px]",
              M && "px-[18px]",
              R
            ),
            children: [
              u && /* @__PURE__ */ e.jsx(Ye, { message: d, onRetry: b, dataUpdatedAt: N }),
              !u && i && (E ?? /* @__PURE__ */ e.jsx(Ve, {})),
              !u && !i && h && (y ?? /* @__PURE__ */ e.jsx(Qe, {})),
              !u && !i && !h && Z
            ]
          }
        ),
        l && /* @__PURE__ */ e.jsx("footer", { className: "flex-none px-[18px] pb-[14px] pt-1", children: l })
      ]
    }
  );
}
function Ve() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", "aria-busy": "true", children: [
    /* @__PURE__ */ e.jsx(P, { height: 28, className: "w-1/3" }),
    /* @__PURE__ */ e.jsx(P, { height: 14 }),
    /* @__PURE__ */ e.jsx(P, { height: 14, className: "w-5/6" }),
    /* @__PURE__ */ e.jsx(P, { height: 14, className: "w-3/4" })
  ] });
}
function Qe() {
  return /* @__PURE__ */ e.jsx(
    w,
    {
      compact: !0,
      title: r("Common:NoDataToShow", "Görüntülenecek veri yok"),
      description: r("Common:NoDataYet", "Yeni veri girildiğinde burada görünecek.")
    }
  );
}
function Ye({ message: t, onRetry: a, dataUpdatedAt: n }) {
  const s = Je(n);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center justify-center text-center gap-2 py-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-text-secondary max-w-xs", children: t || r("Common:FetchError", "Veri alınırken bir hata oluştu.") }),
    s && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-text-tertiary", children: [
      r("Common:LastSuccessfulUpdate", "Son başarılı güncelleme"),
      ": ",
      s
    ] }),
    a && /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        onClick: a,
        className: "text-[12.5px] text-text-link underline-offset-2 hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
        children: r("Common:Retry", "Tekrar dene")
      }
    )
  ] });
}
function Xe() {
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1 text-[11px] text-text-tertiary flex-none",
      title: r("Common:UpdatingInBackground", "Arka planda güncelleniyor"),
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-warning-500 animate-pulse", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: r("Common:Updating", "güncelleniyor") })
      ]
    }
  );
}
function Je(t) {
  if (t == null) return null;
  const a = t instanceof Date ? t.getTime() : Number(t);
  if (!Number.isFinite(a)) return null;
  const n = Math.round((a - Date.now()) / 1e3), s = Math.abs(n), l = new Intl.RelativeTimeFormat(Le(), { numeric: "auto" });
  return s < 60 ? l.format(n, "second") : s < 3600 ? l.format(Math.round(n / 60), "minute") : s < 86400 ? l.format(Math.round(n / 3600), "hour") : l.format(Math.round(n / 86400), "day");
}
D.DRAG_HANDLE_CLASS = ke;
function Ze({ trend: t, children: a }) {
  const n = t === "Up" ? "▲" : t === "Down" ? "▼" : "•";
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: m(
        "font-mono text-[10.5px] tabular-nums",
        t === "Up" ? "text-positive-600" : t === "Down" ? "text-negative-600" : "text-text-tertiary"
      ),
      children: [
        n,
        " ",
        a
      ]
    }
  );
}
const V = 100, I = 40;
function et(t, a = I, n = 2) {
  const s = Math.max(...t, 0);
  if (s <= 0) return t.map(() => a - n);
  const l = a - n * 2;
  return t.map((c) => n + l - c / s * l);
}
function tt(t, a = V) {
  if (t <= 1) return [a / 2];
  const n = a / (t - 1);
  return Array.from({ length: t }, (s, l) => l * n);
}
function De(t, a) {
  return t.length ? t.map((n, s) => `${s === 0 ? "M" : "L"} ${Q(n)} ${Q(a[s])}`).join(" ") : "";
}
function at(t, a, n = I) {
  return t.length ? `${De(t, a)} L ${Q(t[t.length - 1])} ${n} L ${Q(t[0])} ${n} Z` : "";
}
function Q(t) {
  return Math.round(t * 100) / 100;
}
function nt({ values: t = [], color: a = "var(--apya-brand-500)", ariaLabel: n }) {
  const s = x.useId().replace(/:/g, "");
  if (t.length < 2) return null;
  const l = tt(t.length), c = et(t);
  return /* @__PURE__ */ e.jsxs(
    "svg",
    {
      viewBox: `0 0 ${V} ${I}`,
      preserveAspectRatio: "none",
      className: "block w-full h-full",
      role: n ? "img" : "presentation",
      "aria-label": n,
      children: [
        /* @__PURE__ */ e.jsx("defs", { children: /* @__PURE__ */ e.jsxs("linearGradient", { id: s, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ e.jsx("stop", { offset: "0%", stopColor: a, stopOpacity: "0.16" }),
          /* @__PURE__ */ e.jsx("stop", { offset: "100%", stopColor: a, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ e.jsx("path", { d: at(l, c), fill: `url(#${s})` }),
        /* @__PURE__ */ e.jsx(
          "path",
          {
            d: De(l, c),
            fill: "none",
            stroke: a,
            strokeWidth: "1.75",
            vectorEffect: "non-scaling-stroke"
          }
        )
      ]
    }
  );
}
const st = ["var(--apya-positive-500)", "color-mix(in srgb, var(--apya-negative-500) 45%, transparent)"];
function rt({ groups: t = [], colors: a = st, ariaLabel: n }) {
  if (!t.length) return null;
  const s = Math.max(...t.flatMap((i) => i.values), 0), l = V / t.length, c = Math.min(4.5, l * 0.62 / 2), o = c * 0.22;
  return /* @__PURE__ */ e.jsx(
    "svg",
    {
      viewBox: `0 0 ${V} ${I}`,
      preserveAspectRatio: "none",
      className: "block w-full h-full",
      role: n ? "img" : "presentation",
      "aria-label": n,
      children: t.map((i, u) => {
        const d = i.values.length * c + (i.values.length - 1) * o, b = u * l + (l - d) / 2;
        return i.values.map((h, y) => {
          const E = s > 0 ? h / s * (I - 2) : 0;
          return /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: b + y * (c + o),
              y: I - E,
              width: c,
              height: E,
              rx: "0.8",
              fill: a[y % a.length]
            },
            `${u}-${y}`
          );
        });
      })
    }
  );
}
const ee = 34, oe = 2 * Math.PI * ee;
function it({ ratio: t = 0, size: a = 58, ariaLabel: n }) {
  const s = Math.max(0, Math.min(t, 1)), l = s * oe, c = s >= 0.9 ? "var(--apya-negative-500)" : s >= 0.7 ? "var(--apya-warning-500)" : "var(--apya-positive-500)";
  return /* @__PURE__ */ e.jsxs(
    "svg",
    {
      viewBox: "0 0 100 100",
      style: { width: a, height: a },
      className: "flex-none",
      role: "img",
      "aria-label": n ?? `${Math.round(s * 100)}%`,
      children: [
        /* @__PURE__ */ e.jsx("circle", { cx: "50", cy: "50", r: ee, fill: "none", stroke: "var(--apya-surface-sunken)", strokeWidth: "12" }),
        l > 0 && /* @__PURE__ */ e.jsx(
          "circle",
          {
            cx: "50",
            cy: "50",
            r: ee,
            fill: "none",
            stroke: c,
            strokeWidth: "12",
            strokeDasharray: `${l} ${oe - l}`,
            strokeLinecap: "round",
            transform: "rotate(-90 50 50)"
          }
        )
      ]
    }
  );
}
const lt = [
  "bg-surface-sunken",
  /* 0 teslim */
  "bg-brand-200",
  "bg-brand-300",
  "bg-brand-500",
  "bg-brand-600"
];
function ot(t, a) {
  return t <= 0 ? 0 : a <= 1 ? 2 : Math.min(4, 1 + Math.round((t - 1) / a * 3));
}
function ct({ cells: t = [], weekdayLabels: a = !0 }) {
  if (!t.length) return null;
  const n = Math.max(...t.map((l) => l.count), 0), s = [];
  for (let l = 0; l < t.length; l += 7) s.push(t.slice(l, l + 7));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
    s.map((l, c) => /* @__PURE__ */ e.jsx("div", { className: "flex gap-1", children: l.map((o) => /* @__PURE__ */ e.jsx(
      "span",
      {
        title: dt(o),
        className: m(
          "flex-1 h-[15px] rounded",
          /* Hibe günü kademeden çıkar, sarı boyanır. Tasarımdaki
             #FCD34D için token yok → warning-500 yarı saydam
             (yeni renk üretmemek için). */
          o.isGrantDeadline ? "bg-warning-500/55" : lt[ot(o.count, n)]
        )
      },
      o.date
    )) }, c)),
    a && /* @__PURE__ */ e.jsx("div", { className: "flex justify-between font-mono text-[9.5px] text-text-tertiary pt-0.5", children: [
      r("Common:Day:Mon", "Pzt"),
      r("Common:Day:Tue", "Sal"),
      r("Common:Day:Wed", "Çar"),
      r("Common:Day:Thu", "Per"),
      r("Common:Day:Fri", "Cum"),
      r("Common:Day:Sat", "Cmt"),
      r("Common:Day:Sun", "Paz")
    ].map((l) => /* @__PURE__ */ e.jsx("span", { children: l }, l)) })
  ] });
}
function dt(t) {
  const a = new Date(t.date).toLocaleDateString(), n = r("Dashboard:Heatmap:CellCount", "{0} teslim", t.count);
  return t.isGrantDeadline ? `${a} — ${n} · ${r("Dashboard:Heatmap:GrantDeadline", "hibe son tarihi")}` : `${a} — ${n}`;
}
function ut({ ratio: t = 0, tone: a = "positive", ariaLabel: n }) {
  const s = Math.max(0, Math.min(t, 1)), l = Math.round(s * 100), c = a === "negative" ? "var(--apya-negative-500)" : a === "warning" ? "var(--apya-warning-500)" : "var(--apya-positive-500)";
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "flex gap-1",
      role: "img",
      "aria-label": n ?? `%${l}`,
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-[5px] rounded-full", style: { flex: l, background: c } }),
        l < 100 && /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "h-[5px] rounded-full bg-surface-sunken",
            style: { flex: 100 - l }
          }
        )
      ]
    }
  );
}
const xt = ["Upcoming", "OnTrack", "InReview", "Overdue"], mt = ["ThisWeek", "NextWeek", "EndOfMonth", "Later"], pt = ["Healthy", "Attention", "Risky"], ht = ["WaitingReview", "Dependency", "Unassigned"], ft = ["Flat", "Up", "Down"], bt = ["Work", "Finance", "Grants", "Communication", "System"];
function H(t, a, n) {
  return typeof a == "string" ? a : t[a] ?? n;
}
function gt(t) {
  return (t ?? []).map((a) => ({
    ...a,
    state: H(xt, a.state, "Upcoming"),
    groupKey: H(mt, a.groupKey, "Later")
  }));
}
function yt(t) {
  return (t ?? []).map((a) => ({
    ...a,
    state: H(pt, a.state, "Healthy")
  }));
}
function jt(t) {
  return (t ?? []).map((a) => ({
    ...a,
    blockReason: H(ht, a.blockReason, "Dependency")
  }));
}
function vt(t) {
  return (t ?? []).map((a) => ({
    ...a,
    group: H(bt, a.group, "Work"),
    trend: H(ft, a.trend, "Flat")
  }));
}
const ce = 0, W = 6e4, ne = 3e4;
function kt({ range: t, projectId: a } = {}) {
  const n = new URLSearchParams();
  t && n.set("range", t), a && n.set("projectId", a);
  const s = n.toString();
  return s ? `?${s}` : "";
}
const C = (t, a) => X.get(`/api/dashboard/${t}${kt(a)}`);
function Dt(t) {
  return S({
    queryKey: k.dashboard.summary(t),
    queryFn: () => C("summary", t),
    staleTime: ne
    /* bütçe alanları içeriyor */
  });
}
function Nt(t) {
  return S({
    queryKey: k.dashboard.deliveries(t),
    queryFn: () => C("deliveries", t),
    select: gt,
    staleTime: W
  });
}
function wt(t) {
  return S({
    queryKey: k.dashboard.projectHealth(t),
    queryFn: () => C("project-health", t),
    select: yt,
    staleTime: W
  });
}
function St() {
  return S({
    queryKey: k.dashboard.approvals(),
    queryFn: () => C("pending-approvals"),
    staleTime: ne
  });
}
function Tt() {
  return S({
    queryKey: k.dashboard.blockedTasks(),
    queryFn: () => C("blocked-tasks"),
    select: jt,
    staleTime: W
  });
}
function Ct(t) {
  return S({
    queryKey: k.dashboard.statistics(t),
    queryFn: () => C("statistics", t),
    select: vt,
    staleTime: W
  });
}
function Et(t) {
  return S({
    queryKey: k.dashboard.incomeExpense(t),
    queryFn: () => C("income-expense", t),
    staleTime: ne
  });
}
function At(t) {
  return S({
    queryKey: k.dashboard.deliveryHeatmap(t),
    queryFn: () => C("delivery-heatmap", t),
    staleTime: W
  });
}
function Rt({ filter: t, template: a, compact: n }) {
  const { data: s, isPending: l, isError: c, refetch: o } = Dt(t), i = { gridTemplateColumns: a ?? "repeat(4, minmax(0, 2fr)) minmax(0, 3fr)" };
  return l ? /* @__PURE__ */ e.jsx("div", { className: "h-full grid gap-[12px]", style: i, children: Array.from({ length: 5 }, (u, d) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-card shadow-card bg-surface-base border border-default p-[16px]", children: [
    /* @__PURE__ */ e.jsx(P, { height: 14, className: "w-2/3 mb-[8px]" }),
    /* @__PURE__ */ e.jsx(P, { height: 28, className: "w-1/2" })
  ] }, d)) }) : c || !s ? /* @__PURE__ */ e.jsxs("div", { className: "rounded-card shadow-card bg-surface-base border border-default p-[16px] flex items-center justify-between gap-[12px]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-secondary", children: r("Dashboard:Summary:Error", "Özet yüklenemedi.") }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => o(), className: "text-[12.5px] text-text-link hover:underline", children: r("Common:Retry", "Tekrar dene") })
  ] }) : (
    /* Kutucuklar ızgara kutusunu TAM doldurur (h-full): doğal yüksekliğe
               bırakılırsa kutu içerikten kısa kalınca taşıp alttaki satıra biniyor,
               uzun kalınca da altta ölü boşluk bırakıyordu — ikisini de gördük.
               Ek alt padding YOK: tüm boşluklar tek kaynaktan, GRID_MARGIN'den gelir.
               Kutucuk arası da aynı 12px — ızgaradaki kart aralarıyla birebir.
    
               Kutu yüksekliği de kolon sayısını takip eder (stripLayoutFor → h), yani
               çok satırlı dizilimde kutu büyür; sabit h=2 bırakılınca satırlar 148px'lik
               kutuya sıkışıp `overflow-hidden` altyazıları kesiyordu. */
    /* @__PURE__ */ e.jsxs("div", { className: "h-full grid gap-[12px]", style: i, children: [
      /* @__PURE__ */ e.jsx(
        q,
        {
          compact: n,
          label: r("Dashboard:Summary:DueThisPeriod", "Bu dönem teslim"),
          value: s.dueThisPeriod,
          pill: r("Dashboard:Summary:DueThisWeek", "{0} bu hafta", s.dueThisWeek),
          icon: /* @__PURE__ */ e.jsx(It, {}),
          iconTone: "brand",
          spark: s.dueTrend
        }
      ),
      /* @__PURE__ */ e.jsx(
        q,
        {
          compact: n,
          label: r("Dashboard:Summary:Overdue", "Gecikmiş"),
          value: s.overdue,
          tone: "negative",
          pill: s.oldestOverdueDays != null ? r("Dashboard:Summary:OldestOverdue", "en eski {0} g", s.oldestOverdueDays) : null,
          pillTone: "negative",
          icon: /* @__PURE__ */ e.jsx(Lt, {}),
          iconTone: "negative",
          caption: r("Dashboard:Summary:OverdueProjects", "{0} projede", s.overdueProjectCount)
        }
      ),
      /* @__PURE__ */ e.jsx(
        q,
        {
          compact: n,
          label: r("Dashboard:Summary:Blocked", "Tıkanan iş"),
          value: s.blocked,
          tone: "warning",
          pill: r("Dashboard:Summary:BlockedAvg", "ort. {0} g", s.blockedAvgIdleDays),
          pillTone: "warning",
          icon: /* @__PURE__ */ e.jsx(Ht, {}),
          iconTone: "warning",
          caption: r("Dashboard:Summary:BlockedReasons", "onay · bilgi · bağımlılık")
        }
      ),
      /* @__PURE__ */ e.jsx(
        q,
        {
          compact: n,
          label: r("Dashboard:Summary:PendingApprovals", "Bende onay"),
          value: s.pendingApprovals,
          locked: s.pendingApprovals == null,
          lockedPermission: "Platform.Invoices",
          pill: s.pendingApprovalAmount != null ? z(s.pendingApprovalAmount, s.currency) : null,
          icon: /* @__PURE__ */ e.jsx(Mt, {}),
          iconTone: "brand",
          caption: s.pendingApprovalAvgAgeHours != null ? r("Dashboard:Summary:AvgWait", "ortalama bekleme {0} sa", s.pendingApprovalAvgAgeHours) : null
        }
      ),
      /* @__PURE__ */ e.jsx(Pt, { data: s, compact: n })
    ] })
  );
}
function q({ label: t, value: a, pill: n, pillTone: s = "neutral", caption: l, tone: c = "neutral", icon: o, iconTone: i = "brand", spark: u, locked: d, lockedPermission: b, compact: h }) {
  const y = !h && u && u.length > 1;
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: m(
        "rounded-card shadow-card bg-surface-base border border-default",
        "flex flex-col overflow-hidden",
        h ? "gap-[5px] pt-[12px] px-[12px] pb-[12px]" : m(
          "gap-[7px]",
          /* Üst ve yan padding TÜM kutucuklarda aynı; yalnız alt padding
             grafikli kutucukta sıfırlanır ki sparkline kenara yapışsın.
             Farklı üst padding vermek şeritteki başlıkları kaydırıyordu. */
          "pt-[16px] px-[16px]",
          u ? "pb-[0px]" : "pb-[16px]"
        )
      ),
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[8px]", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-medium text-text-secondary truncate", children: t }),
          /* @__PURE__ */ e.jsx("span", { className: m(
            "inline-flex items-center justify-center rounded-lg flex-none",
            h ? "w-5 h-5" : "w-6 h-6",
            i === "negative" ? "bg-negative-50 text-negative-700" : i === "warning" ? "bg-warning-50 text-warning-700" : "bg-accent-soft text-accent-600"
          ), children: o })
        ] }),
        d ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx("span", { className: m("font-mono font-semibold tracking-[-0.03em] text-text-tertiary", h ? "text-[22px]" : "text-[28px]", "leading-none"), children: "— —" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r("Dashboard:Stat:Locked", "yetki gerekli") }),
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary", children: b })
        ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-[8px] flex-wrap", children: [
            /* @__PURE__ */ e.jsx("span", { className: m(
              "font-mono font-semibold tracking-[-0.03em] tabular-nums",
              h ? "text-[22px]" : "text-[28px]",
              /* leading-none SIRASI ÖNEMLİ: tailwind-merge, text-[..] font-size
                 sınıfını gördüğünde ÖNCESİNDEKİ leading-* sınıfını atıyor. */
              "leading-none",
              c === "negative" ? "text-negative-500" : c === "warning" ? "text-warning-600" : "text-text-primary"
            ), children: a }),
            n && /* @__PURE__ */ e.jsx("span", { className: m(
              "font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full tabular-nums",
              s === "negative" ? "bg-negative-50 text-negative-700" : s === "warning" ? "bg-warning-50 text-warning-700" : "bg-surface-sunken text-text-secondary"
            ), children: n })
          ] }),
          l && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary truncate", children: l })
        ] }),
        y && /* @__PURE__ */ e.jsx("div", { className: "h-9 mt-auto -mx-[16px]", children: /* @__PURE__ */ e.jsx(nt, { values: u, ariaLabel: r("Dashboard:Summary:DueTrend", "Teslim dağılımı") }) })
      ]
    }
  );
}
function Pt({ data: t, compact: a }) {
  const n = t.budgetUsedRatio == null && t.budgetTotal == null;
  return (
    /* Kompakt kipte tam satıra yayılır: 145px'lik yarım kolonda Gauge (58px)
       + altyazı sığmıyor, tek başına geniş satırda rahat ediyor. */
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: m(
          "rounded-card shadow-card bg-surface-base border border-default flex items-center justify-between",
          a ? "p-[12px] gap-[8px]" : "p-[16px] gap-[10px]"
        ),
        style: a ? { gridColumn: "1 / -1" } : void 0,
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: m("flex flex-col min-w-0", a ? "gap-[5px]" : "gap-[7px]"), children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-medium text-text-secondary truncate", children: r("Dashboard:Summary:BudgetUsage", "Bütçe kullanımı") }),
            n ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsx("span", { className: m("font-mono font-semibold tracking-[-0.03em] text-text-tertiary", a ? "text-[22px]" : "text-[28px]", "leading-none"), children: "— —" }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary", children: "Platform.Projects.ViewBudget" })
            ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsxs("span", { className: m("font-mono font-semibold tracking-[-0.03em] text-text-primary tabular-nums", a ? "text-[22px]" : "text-[28px]", "leading-none"), children: [
                "%",
                Math.round((t.budgetUsedRatio ?? 0) * 100)
              ] }),
              /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary truncate", children: [
                z(t.budgetSpent, t.currency),
                " / ",
                z(t.budgetTotal, t.currency)
              ] })
            ] })
          ] }),
          !n && /* @__PURE__ */ e.jsx(it, { ratio: t.budgetUsedRatio ?? 0 })
        ]
      }
    )
  );
}
const J = { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }, It = () => /* @__PURE__ */ e.jsxs("svg", { ...J, children: [
  /* @__PURE__ */ e.jsx("path", { d: "M8 2v3M16 2v3M4 9h16" }),
  /* @__PURE__ */ e.jsx("rect", { x: "4", y: "5", width: "16", height: "16", rx: "2" })
] }), Lt = () => /* @__PURE__ */ e.jsxs("svg", { ...J, children: [
  /* @__PURE__ */ e.jsx("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ e.jsx("path", { d: "M12 8v5" }),
  /* @__PURE__ */ e.jsx("path", { d: "M12 16.5v.01" })
] }), Ht = () => /* @__PURE__ */ e.jsxs("svg", { ...J, children: [
  /* @__PURE__ */ e.jsx("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ e.jsx("path", { d: "M5.6 5.6l12.8 12.8" })
] }), Mt = () => /* @__PURE__ */ e.jsx("svg", { ...J, children: /* @__PURE__ */ e.jsx("path", { d: "M20 6L9 17l-5-5" }) }), de = ["ThisWeek", "NextWeek", "EndOfMonth", "Later"], ue = {
  ThisWeek: ["Dashboard:Deliveries:ThisWeek", "Bu hafta"],
  NextWeek: ["Dashboard:Deliveries:NextWeek", "Gelecek hafta"],
  EndOfMonth: ["Dashboard:Deliveries:EndOfMonth", "Ay sonu"],
  Later: ["Dashboard:Deliveries:Later", "Sonrası"]
};
function Bt({ filter: t, editMode: a }) {
  const n = Nt(t), s = n.data ?? [], l = x.useMemo(() => {
    const o = new Map(de.map((i) => [i, []]));
    for (const i of s)
      (o.get(i.groupKey) ?? o.get("Later")).push(i);
    return de.map((i) => ({ key: i, items: o.get(i) ?? [] })).filter((i) => i.items.length > 0);
  }, [s]), c = s.filter((o) => o.state === "Overdue").length;
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: a,
      title: r("Dashboard:Deliveries:Title", "Bu ay teslim edilecekler"),
      subtitle: r("Dashboard:Deliveries:Subtitle", "{0} iş · {1} gecikmiş", s.length, c),
      actions: /* @__PURE__ */ e.jsx("a", { href: "/Tasks", className: "text-[12.5px] font-medium text-text-link hover:underline", children: r("Dashboard:Deliveries:AllTasks", "Görev listesi →") }),
      isLoading: n.isPending,
      isError: n.isError,
      onRetry: n.refetch,
      isEmpty: s.length === 0,
      isFetching: n.isFetching,
      isStale: n.isStale,
      dataUpdatedAt: n.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        w,
        {
          compact: !0,
          title: r("Dashboard:Deliveries:EmptyTitle", "Bu dönem teslim yok"),
          description: r("Dashboard:Deliveries:EmptyDescription", "Son tarihi bu döneme düşen açık iş bulunmuyor."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Tasks", className: "text-[12.5px] font-medium text-text-link hover:underline", children: r("Dashboard:Deliveries:AllTasks", "Görev listesi →") })
        }
      ),
      children: /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2.5", children: l.map((o) => /* @__PURE__ */ e.jsxs(ae.Fragment, { children: [
        /* @__PURE__ */ e.jsx(Kt, { groupKey: o.key, count: o.items.length }),
        /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col gap-[3px]", children: o.items.map((i) => /* @__PURE__ */ e.jsx(Ft, { item: i }, i.taskId)) })
      ] }, o.key)) })
    }
  );
}
function Kt({ groupKey: t, count: a }) {
  const [n, s] = ue[t] ?? ue.Later;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.04em] text-text-tertiary", children: r(n, s) }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary tabular-nums", children: a }),
    /* @__PURE__ */ e.jsx("span", { className: "flex-1 h-px bg-subtle" })
  ] });
}
const xe = {
  Overdue: "bg-negative-500",
  InReview: "bg-warning-500",
  OnTrack: "bg-positive-500",
  Upcoming: "bg-neutral-300"
};
function Ft({ item: t }) {
  return /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsxs(
    "a",
    {
      href: `/Tasks?taskId=${t.taskId}`,
      className: m(
        /* `flex-wrap` + başlığa taban genişlik: rozet/proje/tarih/avatar
           hepsi flex-none olduğu için dar kartta başlık 0'a eziliyordu
           (ölçüldü: 311px kartta başlığa 4px kalıyor). Taban genişlik
           sığmayınca yan bilgiler alt satıra sarar. `mobile:` yetmez —
           o viewport sorgusu, kart dar olması ekranın dar olması demek değil. */
        "flex flex-wrap items-center gap-3 p-2.5 rounded-[10px]",
        "bg-surface-base border border-subtle",
        "hover:bg-surface-hover hover:border-default transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:shadow-focus"
      ),
      children: [
        /* @__PURE__ */ e.jsx("span", { className: m("w-1.5 h-1.5 rounded-full flex-none", xe[t.state] ?? xe.Upcoming), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-[140px] text-[13.5px] font-medium text-text-primary truncate", children: t.title }),
        t.state === "Overdue" && t.overdueDays != null && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold px-2 py-0.5 rounded-full bg-negative-50 text-negative-700 flex-none", children: r("Dashboard:Deliveries:OverdueDays", "{0} gün gecikmiş", t.overdueDays) }),
        t.state === "InReview" && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold px-2 py-0.5 rounded-full bg-warning-50 text-warning-700 flex-none", children: r("Dashboard:Deliveries:InReview", "kontrolde") }),
        t.projectName && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-secondary px-2 py-0.5 rounded-full bg-surface-sunken flex-none truncate max-w-[140px]", children: t.projectName }),
        /* @__PURE__ */ e.jsx("span", { className: m(
          "font-mono text-[11.5px] w-[50px] text-right flex-none tabular-nums",
          t.state === "Overdue" ? "text-negative-500" : "text-text-secondary"
        ), children: Ot(t.dueDate) }),
        t.assigneeInitials && /* @__PURE__ */ e.jsx(
          "span",
          {
            title: t.assigneeName,
            className: "inline-flex items-center justify-center w-[22px] h-[22px] rounded-full bg-surface-sunken text-text-secondary text-[9px] font-semibold flex-none",
            children: t.assigneeInitials
          }
        )
      ]
    }
  ) });
}
function Ot(t) {
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? "" : a.toLocaleDateString(void 0, { day: "numeric", month: "short" });
}
const me = 4, pe = {
  Healthy: ["bg-positive-50 text-positive-700", "Dashboard:Health:Healthy", "Sağlıklı"],
  Attention: ["bg-warning-50 text-warning-700", "Dashboard:Health:Attention", "Dikkat"],
  Risky: ["bg-negative-50 text-negative-700", "Dashboard:Health:Risky", "Riskli"]
}, Wt = { Healthy: "positive", Attention: "warning", Risky: "negative" };
function Ut({ filter: t, editMode: a }) {
  const n = wt(t), s = n.data ?? [], l = s.slice(0, me), c = s.slice(me);
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: a,
      title: r("Dashboard:Health:Title", "Proje sağlığı"),
      subtitle: r("Dashboard:Health:Subtitle", "{0} aktif proje", s.length),
      isLoading: n.isPending,
      isError: n.isError,
      onRetry: n.refetch,
      isEmpty: s.length === 0,
      isFetching: n.isFetching,
      isStale: n.isStale,
      dataUpdatedAt: n.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        w,
        {
          compact: !0,
          title: r("Dashboard:Health:EmptyTitle", "Henüz proje yok"),
          description: r("Dashboard:Health:EmptyDescription", "Proje oluşturunca sağlık göstergeleri burada belirir."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Projects", className: "text-[12.5px] font-medium text-text-link hover:underline", children: r("Dashboard:Health:OpenProjects", "Projeleri aç →") })
        }
      ),
      footer: c.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary truncate", children: c.map((o) => o.name).join(" · ") }),
        /* @__PURE__ */ e.jsx("a", { href: "/Projects", className: "text-xs text-text-link hover:underline flex-none", children: r("Dashboard:Health:More", "+{0} proje →", c.length) })
      ] }),
      children: /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col", children: l.map((o, i) => /* @__PURE__ */ e.jsxs("li", { className: "flex flex-col gap-[7px]", children: [
        i > 0 && /* @__PURE__ */ e.jsx("span", { className: "h-px bg-subtle my-2.5" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx(
            "a",
            {
              href: `/Projects/ProjectDetails/${o.projectId}`,
              className: "text-[13px] font-medium text-text-primary truncate hover:underline",
              children: o.name
            }
          ),
          /* @__PURE__ */ e.jsx(Gt, { state: o.state })
        ] }),
        /* @__PURE__ */ e.jsx(
          ut,
          {
            ratio: o.budgetRatio ?? o.timeRatio ?? 0,
            tone: Wt[o.state] ?? "positive",
            ariaLabel: r("Dashboard:Health:BarLabel", "{0} ilerleme", o.name)
          }
        ),
        /* @__PURE__ */ e.jsx(_t, { project: o })
      ] }, o.projectId)) })
    }
  );
}
function Gt({ state: t }) {
  const [a, n, s] = pe[t] ?? pe.Healthy;
  return /* @__PURE__ */ e.jsx("span", { className: m("text-[11px] font-semibold px-2 py-0.5 rounded-full flex-none", a), children: r(n, s) });
}
function _t({ project: t }) {
  const a = [];
  return t.daysRemaining != null && a.push(r("Dashboard:Health:DaysLeft", "{0} gün", t.daysRemaining)), t.budgetRatio != null && a.push(r("Dashboard:Health:BudgetPercent", "%{0} bütçe", Math.round(t.budgetRatio * 100))), a.push(r("Dashboard:Health:Tasks", "{0}/{1} görev", t.tasksDone, t.tasksTotal)), /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2.5 font-mono text-[11px] text-text-secondary tabular-nums", children: a.map((n, s) => /* @__PURE__ */ e.jsxs(ae.Fragment, { children: [
    s > 0 && /* @__PURE__ */ e.jsx("span", { className: "text-border-default", "aria-hidden": "true", children: "|" }),
    /* @__PURE__ */ e.jsx("span", { children: n })
  ] }, n)) });
}
function qt({ editMode: t }) {
  var o;
  const a = St(), n = a.data ?? [], s = n.reduce((i, u) => i + (u.amount ?? 0), 0), l = n.length ? Math.round(n.reduce((i, u) => i + u.ageHours, 0) / n.length) : 0, c = ((o = n[0]) == null ? void 0 : o.currency) ?? "TRY";
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: t,
      title: r("Dashboard:Approvals:Title", "Bende bekleyen kararlar"),
      badge: n.length > 0 && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full bg-warning-50 text-warning-700 tabular-nums flex-none", children: n.length }),
      isLoading: a.isPending,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: n.length === 0,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        w,
        {
          compact: !0,
          title: r("Dashboard:Approvals:EmptyTitle", "Karar bekleyen yok"),
          description: r("Dashboard:Approvals:EmptyDescription", "Taslak durumdaki fatura bulunmuyor."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Invoices", className: "text-[12.5px] font-medium text-text-link hover:underline", children: r("Dashboard:Approvals:OpenInvoices", "Faturaları aç →") })
        }
      ),
      footer: n.length > 0 && /* Satır başlıkları serbest metin olduğu için kırpılabilir, ama bu
      özet SABİT biçimli — dar kartta kırpmak yerine alt satıra sarsın. */
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r("Dashboard:Approvals:Total", "Toplam {0} · ort. bekleme {1} sa", le(s, c), l) }),
        /* @__PURE__ */ e.jsx("a", { href: "/Invoices", className: "text-[12.5px] font-medium text-text-link hover:underline flex-none", children: r("Dashboard:Approvals:Queue", "Onay kuyruğu →") })
      ] }),
      children: /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col", children: n.slice(0, 4).map((i, u) => /* @__PURE__ */ e.jsxs(
        "li",
        {
          className: "flex flex-wrap items-center gap-2.5 py-2 border-b border-subtle last:border-b-0",
          children: [
            /* @__PURE__ */ e.jsxs("span", { className: "flex-1 min-w-[150px] flex flex-col gap-0.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-medium text-text-primary truncate", children: i.title }),
              /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary truncate", children: r("Dashboard:Approvals:Meta", "Fatura · {0} · {1} sa", i.requesterName || "—", i.ageHours) })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "font-mono text-xs font-semibold text-text-primary tabular-nums flex-none", children: le(i.amount, i.currency) }),
            /* @__PURE__ */ e.jsx(
              "a",
              {
                href: i.targetUrl,
                className: "text-xs font-medium text-text-link hover:underline flex-none",
                children: r("Dashboard:Approvals:Review", "İncele →")
              }
            )
          ]
        },
        i.id
      )) })
    }
  );
}
const he = {
  WaitingReview: ["bg-warning-50 text-warning-700", "Dashboard:Blockers:WaitingReview", "Kontrolde"],
  Dependency: ["bg-surface-sunken text-text-secondary", "Dashboard:Blockers:Dependency", "Bağımlı"],
  Unassigned: ["bg-negative-50 text-negative-700", "Dashboard:Blockers:Unassigned", "Atanmamış"]
};
function $t({ editMode: t }) {
  const a = Tt(), n = a.data ?? [];
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: t,
      accent: n.length > 0 ? "negative" : void 0,
      title: r("Dashboard:Blockers:Title", "Tıkanan işler & risk"),
      badge: n.length > 0 && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full bg-negative-50 text-negative-700 tabular-nums flex-none", children: n.length }),
      isLoading: a.isPending,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: n.length === 0,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        w,
        {
          compact: !0,
          title: r("Dashboard:Blockers:EmptyTitle", "Tıkanan iş yok"),
          description: r("Dashboard:Blockers:EmptyDescription", "Açık işlerin hepsi son günlerde hareket görmüş.")
        }
      ),
      children: /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col gap-3", children: n.slice(0, 3).map((s, l) => /* @__PURE__ */ e.jsxs("li", { className: "flex flex-col gap-1", children: [
        l > 0 && /* @__PURE__ */ e.jsx("span", { className: "h-px bg-subtle mb-2" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(zt, { reason: s.blockReason }),
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary truncate", children: r("Dashboard:Blockers:Meta", "{0} · {1} gündür hareketsiz", s.code, s.idleDays) })
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[12.5px] font-medium text-text-primary leading-[1.4]", children: [
          s.title,
          s.dependentCount > 0 && /* @__PURE__ */ e.jsxs("span", { className: "text-text-tertiary font-normal", children: [
            " — ",
            r("Dashboard:Blockers:Dependents", "{0} bağımlı görev bekliyor", s.dependentCount)
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(
          "a",
          {
            href: `/Tasks?taskId=${s.taskId}`,
            className: "text-xs font-medium text-text-link hover:underline self-start",
            children: r("Dashboard:Blockers:OpenTask", "Görevi aç →")
          }
        )
      ] }, s.taskId)) })
    }
  );
}
function zt({ reason: t }) {
  const [a, n, s] = he[t] ?? he.Dependency;
  return /* @__PURE__ */ e.jsx("span", { className: m("text-[11px] font-semibold px-2 py-0.5 rounded-full flex-none", a), children: r(n, s) });
}
function Vt({ editMode: t }) {
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: t,
      title: r("Dashboard:Ai:Title", "AI önerileri"),
      subtitle: r("Dashboard:Ai:Subtitle", "sessiz inbox"),
      isEmpty: !0,
      emptyState: /* @__PURE__ */ e.jsx(
        w,
        {
          compact: !0,
          title: r("Dashboard:Ai:EmptyTitle", "AI şu an sessiz"),
          description: r("Dashboard:Ai:EmptyDescription", "Anlamlı bir öneri çıktığında burada görünecek."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Ai/Dashboard", className: "text-[12.5px] font-medium text-text-link hover:underline", children: r("Dashboard:Ai:OpenCenter", "AI Merkezi →") })
        }
      )
    }
  );
}
function Qt({ filter: t, editMode: a }) {
  const n = Et(t), s = n.data, l = (s == null ? void 0 : s.points) ?? [], c = l.some((i) => i.income > 0 || i.expense > 0), o = (s == null ? void 0 : s.currency) ?? "TRY";
  return /* @__PURE__ */ e.jsxs(
    D,
    {
      editMode: a,
      bleed: !0,
      title: r("Dashboard:IncomeExpense:Title", "Gelir / gider"),
      subtitle: r("Dashboard:IncomeExpense:Subtitle", "Son 6 ay"),
      actions: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 text-[11px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-2 h-2 rounded-full bg-positive-500" }),
          r("Dashboard:IncomeExpense:Income", "Gelir")
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-2 h-2 rounded-full bg-negative-500/45" }),
          r("Dashboard:IncomeExpense:Expense", "Gider")
        ] })
      ] }),
      isLoading: n.isPending,
      isError: n.isError,
      onRetry: n.refetch,
      isEmpty: !c,
      isFetching: n.isFetching,
      isStale: n.isStale,
      dataUpdatedAt: n.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        w,
        {
          compact: !0,
          title: r("Dashboard:IncomeExpense:EmptyTitle", "Kayıtlı hareket yok"),
          description: r("Dashboard:IncomeExpense:EmptyDescription", "Son 6 ayda gelir veya gider kaydı bulunmuyor.")
        }
      ),
      bodyClassName: "flex flex-col gap-2.5",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-2xl font-semibold leading-none tracking-[-0.03em] text-text-primary tabular-nums", children: z((s == null ? void 0 : s.net) ?? 0, o) }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r("Dashboard:IncomeExpense:Net", "net") })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-[82px] -mx-[18px] mt-auto", children: /* @__PURE__ */ e.jsx(
          rt,
          {
            groups: l.map((i) => ({ values: [i.income, i.expense] })),
            ariaLabel: r("Dashboard:IncomeExpense:ChartLabel", "Aylık gelir ve gider")
          }
        ) })
      ]
    }
  );
}
function Yt({ filter: t, editMode: a }) {
  const n = At(t), s = n.data ?? [], l = s.some((o) => o.count > 0), c = s.reduce(
    (o, i) => i.count > ((o == null ? void 0 : o.count) ?? 0) ? i : o,
    null
  );
  return /* @__PURE__ */ e.jsxs(
    D,
    {
      editMode: a,
      title: r("Dashboard:Heatmap:Title", "Teslim yoğunluğu"),
      subtitle: r("Dashboard:Heatmap:Subtitle", "Önümüzdeki 4 hafta · hafta × gün"),
      isLoading: n.isPending,
      isError: n.isError,
      onRetry: n.refetch,
      isEmpty: s.length === 0,
      isFetching: n.isFetching,
      isStale: n.isStale,
      dataUpdatedAt: n.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        w,
        {
          compact: !0,
          title: r("Dashboard:Heatmap:EmptyTitle", "Planlı teslim yok"),
          description: r("Dashboard:Heatmap:EmptyDescription", "Önümüzdeki 4 haftada son tarihi olan iş bulunmuyor.")
        }
      ),
      bodyClassName: "flex flex-col gap-3",
      children: [
        /* @__PURE__ */ e.jsx(ct, { cells: s }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: l && c ? r(
          "Dashboard:Heatmap:Busiest",
          "En yoğun gün {0} ({1} teslim) · sarı: hibe son tarihi",
          new Date(c.date).toLocaleDateString(void 0, { day: "numeric", month: "short" }),
          c.count
        ) : r("Dashboard:Heatmap:NoneScheduled", "Bu pencerede teslim planlanmamış · sarı: hibe son tarihi") })
      ]
    }
  );
}
function Xt({ editMode: t }) {
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: t,
      title: r("Dashboard:Phases:Title", "Proje fazları"),
      subtitle: r("Dashboard:Phases:Subtitle", "mini gantt"),
      isEmpty: !0,
      emptyState: /* @__PURE__ */ e.jsx(
        w,
        {
          compact: !0,
          title: r("Dashboard:Phases:EmptyTitle", "Faz tanımlı değil"),
          description: r("Dashboard:Phases:EmptyDescription", "Projelere faz tanımlandığında zaman çizelgesi burada görünecek."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Projects", className: "text-[12.5px] font-medium text-text-link hover:underline", children: r("Dashboard:Phases:OpenProjects", "Projeleri aç →") })
        }
      )
    }
  );
}
const Jt = [
  ["Work", "Dashboard:StatTab:Work", "İş & teslim"],
  ["Finance", "Dashboard:StatTab:Finance", "Finans"],
  ["Grants", "Dashboard:StatTab:Grants", "Hibe"],
  ["Communication", "Dashboard:StatTab:Communication", "İletişim"],
  ["System", "Dashboard:StatTab:System", "Sistem"]
];
function Zt({ filter: t, editMode: a }) {
  const n = Ct(t), s = n.data ?? [], [l, c] = x.useState("Work"), o = x.useMemo(
    () => Jt.filter(([d]) => s.some((b) => b.group === d)),
    [s]
  ), i = s.filter((d) => d.group === l), u = s.filter((d) => d.locked).length;
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: a,
      title: r("Dashboard:Statistics:Title", "İstatistikler"),
      subtitle: s.length > 0 ? r(
        "Dashboard:Statistics:Subtitle",
        "{0} istatistikten {1}'i yetkinde · {2}'si kilitli",
        s.length,
        s.length - u,
        u
      ) : void 0,
      actions: /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1.5 flex-wrap justify-end", children: o.map(([d, b, h]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => c(d),
          "aria-pressed": l === d,
          className: m(
            "inline-flex items-center h-7 px-[11px] rounded-[9px] text-[11.5px] transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:shadow-focus",
            l === d ? "bg-text-primary text-surface-base font-semibold" : "bg-surface-sunken text-text-secondary font-medium hover:text-text-primary"
          ),
          children: r(b, h)
        },
        d
      )) }),
      isLoading: n.isPending,
      isError: n.isError,
      onRetry: n.refetch,
      isEmpty: s.length === 0,
      isFetching: n.isFetching,
      isStale: n.isStale,
      dataUpdatedAt: n.dataUpdatedAt,
      children: /* @__PURE__ */ e.jsx("div", { className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(154px, 1fr))" }, children: i.map((d) => /* @__PURE__ */ e.jsx(ea, { stat: d }, d.key)) })
    }
  );
}
function ea({ stat: t }) {
  return t.locked ? /* @__PURE__ */ e.jsxs("div", { className: "p-[12px_14px] border border-dashed border-default rounded-xl bg-surface-base flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary truncate", children: t.label }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-xl font-semibold leading-none tracking-[-0.03em] text-text-tertiary", children: "— —" }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: r("Dashboard:Stat:Locked", "yetki gerekli") }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary truncate", children: t.requiredPermission })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "p-[12px_14px] border border-subtle rounded-xl bg-surface-base flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary truncate", children: t.label }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-xl font-semibold leading-none tracking-[-0.03em] text-text-primary tabular-nums", children: t.formatted || "—" }),
    t.deltaFormatted ? /* @__PURE__ */ e.jsx(Ze, { trend: t.trend, children: t.deltaFormatted }) : /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: r("Dashboard:Stat:Flat", "• sabit") }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary truncate", children: t.requiredPermission })
  ] });
}
const F = [
  { key: "project-management", labelKey: "Dashboard:View:ProjectManagement", fallback: "Proje Yönetimi" },
  { key: "finance", labelKey: "Dashboard:View:Finance", fallback: "Finans" },
  { key: "today", labelKey: "Dashboard:View:Today", fallback: "Bugün" },
  { key: "grants", labelKey: "Dashboard:View:Grants", fallback: "Hibe takibi" }
], fe = "project-management", O = {
  /* h=2 (140px): kutucuk içeriği ~122px. h=3 verilince ızgara kutusu
     içerikten ~75px yüksek kalıyor ve altındaki satırla arasında ölü boşluk
     oluşuyordu. minH de 2 olmalı — aksi halde RGL yüksekliği 3'e zorlar. */
  /* `band`: kart yatay bir şerittir — dar kırılımlarda yarım genişliğe
     düşürülmez, hep tam satır kaplar (içeriği kolonlara yayılıyor). */
  "summary-strip": { component: Rt, titleKey: "Dashboard:Card:SummaryStrip", fallback: "Sayısal özet", w: 12, h: 2, minW: 6, minH: 2, band: !0 },
  deliveries: { component: Bt, titleKey: "Dashboard:Deliveries:Title", fallback: "Bu ay teslim edilecekler", w: 7, h: 8, minW: 4, minH: 5 },
  "project-health": { component: Ut, titleKey: "Dashboard:Health:Title", fallback: "Proje sağlığı", w: 5, h: 8, minW: 3, minH: 5 },
  approvals: { component: qt, titleKey: "Dashboard:Approvals:Title", fallback: "Bende bekleyen kararlar", w: 4, h: 6, minW: 3, minH: 4 },
  blockers: { component: $t, titleKey: "Dashboard:Blockers:Title", fallback: "Tıkanan işler & risk", w: 4, h: 6, minW: 3, minH: 4 },
  "ai-suggestions": { component: Vt, titleKey: "Dashboard:Ai:Title", fallback: "AI önerileri", w: 4, h: 6, minW: 3, minH: 3 },
  "income-expense": { component: Qt, titleKey: "Dashboard:IncomeExpense:Title", fallback: "Gelir / gider", w: 4, h: 6, minW: 3, minH: 4 },
  "delivery-heatmap": { component: Yt, titleKey: "Dashboard:Heatmap:Title", fallback: "Teslim yoğunluğu", w: 4, h: 6, minW: 3, minH: 4 },
  "project-phases": { component: Xt, titleKey: "Dashboard:Phases:Title", fallback: "Proje fazları", w: 4, h: 6, minW: 3, minH: 4 },
  "statistics-band": { component: Zt, titleKey: "Dashboard:Statistics:Title", fallback: "İstatistikler", w: 12, h: 6, minW: 6, minH: 4, band: !0 }
}, te = { desktop: 920, tablet: 560, mobile: 0 }, ta = { desktop: 12, tablet: 6, mobile: 1 }, aa = 64, na = [12, 12], Ne = [0, 0];
function sa(t) {
  return t >= te.desktop ? "desktop" : t >= te.tablet ? "tablet" : "mobile";
}
function ra(t) {
  return Math.max(0, t - Ne[0] * 2);
}
function ia(t) {
  return t >= 1015 ? { template: "repeat(4, minmax(0, 2fr)) minmax(0, 3fr)", h: 2 } : t >= 694 ? { template: "repeat(3, minmax(0, 1fr))", h: 4 } : t >= 456 ? { template: "repeat(2, minmax(0, 1fr))", h: 6 } : { template: "repeat(2, minmax(0, 1fr))", h: 4, compact: !0 };
}
const we = "apya-dashboard-view";
function la() {
  try {
    const t = window.localStorage.getItem(we);
    return F.some((a) => a.key === t) ? t : fe;
  } catch {
    return fe;
  }
}
function oa(t) {
  try {
    window.localStorage.setItem(we, t);
  } catch {
  }
}
function ca({ open: t, onOpenChange: a, presentCardKeys: n = [], onAdd: s }) {
  const [l, c] = x.useState(""), o = x.useMemo(() => {
    const i = l.trim().toLocaleLowerCase();
    return Object.entries(O).map(([u, d]) => ({ key: u, meta: d, label: r(d.titleKey, d.fallback) })).filter((u) => !i || u.label.toLocaleLowerCase().includes(i));
  }, [l]);
  return /* @__PURE__ */ e.jsx(He, { open: t, onOpenChange: a, children: /* @__PURE__ */ e.jsx(Me, { side: "right", className: "w-[380px] mobile:w-full", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 p-5 h-full", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-base font-semibold text-text-primary", children: r("Dashboard:Catalog:Title", "Kart ekle") }),
      /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-text-tertiary", children: r("Dashboard:Catalog:Subtitle", "Eklediğin kart görünümün altına yerleşir; sürükleyip boyutlandırabilirsin.") })
    ] }),
    /* @__PURE__ */ e.jsx(
      Be,
      {
        value: l,
        onChange: (i) => c(i.target.value),
        placeholder: r("Dashboard:Catalog:Search", "Kart ara…"),
        "aria-label": r("Dashboard:Catalog:Search", "Kart ara…")
      }
    ),
    /* @__PURE__ */ e.jsxs("ul", { className: "flex flex-col gap-2 overflow-auto flex-1", children: [
      o.map(({ key: i, meta: u, label: d }) => {
        const b = n.includes(i);
        return /* @__PURE__ */ e.jsxs(
          "li",
          {
            className: m(
              "flex items-center justify-between gap-3 p-3 rounded-xl border",
              b ? "border-subtle bg-surface-sunken opacity-60" : "border-default bg-surface-base"
            ),
            children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-medium text-text-primary truncate", children: d }),
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                  u.w,
                  "×",
                  u.h
                ] })
              ] }),
              /* @__PURE__ */ e.jsx(
                L,
                {
                  size: "sm",
                  variant: b ? "ghost" : "secondary",
                  disabled: b,
                  onClick: () => s(i),
                  className: "flex-none",
                  children: b ? r("Dashboard:Catalog:Added", "Ekli") : r("Dashboard:Catalog:Add", "Ekle")
                }
              )
            ]
          },
          i
        );
      }),
      o.length === 0 && /* @__PURE__ */ e.jsx("li", { className: "text-[12.5px] text-text-tertiary py-4 text-center", children: r("Dashboard:Catalog:NoMatch", "Eşleşen kart yok.") })
    ] })
  ] }) }) });
}
const $ = (() => {
  try {
    const t = document.getElementById("apya-dashboard-layout");
    return t ? JSON.parse(t.textContent) : null;
  } catch {
    return null;
  }
})();
function da(t) {
  const a = ($ == null ? void 0 : $.viewKey) === t ? $ : void 0;
  return S({
    queryKey: k.dashboard.layout(t),
    queryFn: () => X.get(`/api/dashboard/layout?viewKey=${encodeURIComponent(t)}`),
    /* Düzen kullanıcıdan başkası değiştiremez → uzun taze kalır. */
    staleTime: 5 * 6e4,
    enabled: !!t,
    initialData: a
  });
}
function ua() {
  const t = Y();
  return ye({
    mutationFn: ({ viewKey: a, cards: n }) => X.put("/api/dashboard/layout", { viewKey: a, cards: n }),
    onSuccess: (a, { viewKey: n }) => {
      t.invalidateQueries({ queryKey: k.dashboard.layout(n) });
    }
  });
}
function xa() {
  const t = Y();
  return ye({
    mutationFn: (a) => X.delete(`/api/dashboard/layout?viewKey=${encodeURIComponent(a)}`),
    onSuccess: (a, n) => {
      t.invalidateQueries({ queryKey: k.dashboard.layout(n) });
    }
  });
}
const Se = [
  ["Month", "Dashboard:Range:Month", "Bu ay"],
  ["Week", "Dashboard:Range:Week", "Bu hafta"],
  ["Quarter", "Dashboard:Range:Quarter", "Bu çeyrek"]
];
function ma() {
  var re, ie;
  const [t, a] = x.useState(() => la()), [n, s] = x.useState(() => ja()), [l, c] = x.useState(!1), [o, i] = x.useState(!1), [u, d] = x.useState(null), b = da(t), h = ua(), y = xa(), E = x.useMemo(() => ({ range: n }), [n]), g = u ?? ((re = b.data) == null ? void 0 : re.cards) ?? [], U = x.useRef(null), [N, M] = x.useState(null);
  x.useLayoutEffect(() => {
    const p = U.current;
    if (!p) return;
    const j = () => M(p.clientWidth);
    j();
    const v = new ResizeObserver(j);
    return v.observe(p), () => v.disconnect();
  }, []);
  const A = N == null ? null : sa(N), R = x.useMemo(
    () => ia(N == null ? 0 : ra(N)),
    [N]
  ), Z = x.useMemo(
    () => ({ desktop: g.map((p) => ya(p, R.h)) }),
    [g, R.h]
  ), G = x.useCallback((p) => {
    a(p), oa(p), d(null), c(!1);
  }, []), B = x.useCallback((p) => {
    l && A === "desktop" && d((j) => {
      const v = j ?? g;
      return p.map((T) => {
        const K = v.find((_) => _.cardKey === T.i);
        return {
          cardKey: T.i,
          /* Enum SAYI olarak gidip gelir; string göndermek
             deserialization hatası verir (JsonStringEnumConverter yok). */
          chartType: (K == null ? void 0 : K.chartType) ?? ce,
          x: T.x,
          y: T.y,
          w: T.w,
          h: T.h
        };
      });
    });
  }, [l, g, A]), se = A === "desktop", Ce = x.useCallback(() => {
    h.mutate(
      { viewKey: t, cards: u ?? g },
      { onSuccess: () => {
        d(null), c(!1);
      } }
    );
  }, [h, t, u, g]), Ee = x.useCallback(() => {
    y.mutate(t, {
      onSuccess: () => {
        d(null), c(!1);
      }
    });
  }, [y, t]), Ae = x.useCallback((p) => {
    const j = O[p];
    if (!j) return;
    const v = u ?? g, T = v.reduce((K, _) => Math.max(K, _.y + _.h), 0);
    d([
      ...v,
      { cardKey: p, chartType: ce, x: 0, y: T, w: j.w, h: j.h }
    ]), i(!1), c(!0);
  }, [u, g]), Re = x.useCallback((p) => {
    d((u ?? g).filter((v) => v.cardKey !== p));
  }, [u, g]), Pe = /* @__PURE__ */ e.jsxs("div", { className: "hidden mobile:grid grid-cols-2 gap-2", style: { gridColumn: "1 / -1" }, children: [
    /* @__PURE__ */ e.jsx(fa, { value: t, onChange: G, className: "w-full" }),
    /* @__PURE__ */ e.jsx(Te, { value: n, onChange: s, className: "w-full" })
  ] });
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-app-bg", children: [
    /* @__PURE__ */ e.jsx(
      ha,
      {
        viewKey: t,
        onViewChange: G,
        range: n,
        onRangeChange: s,
        editMode: l,
        canEdit: se,
        onToggleEdit: () => c((p) => !p),
        onOpenCatalog: () => i(!0)
      }
    ),
    l && /* @__PURE__ */ e.jsx(
      ba,
      {
        onSave: Ce,
        isSaving: h.isPending
      }
    ),
    /* @__PURE__ */ e.jsxs("main", { className: "px-[18px] pt-4 pb-[18px] mobile:px-3 mobile:pt-3", children: [
      /* @__PURE__ */ e.jsx("div", { ref: U, children: N != null && (A === "desktop" ? /* @__PURE__ */ e.jsx(
        $e.Responsive,
        {
          width: N,
          className: m("apya-dashboard-grid", l && "apya-dashboard-grid--edit"),
          layouts: Z,
          breakpoints: te,
          cols: ta,
          rowHeight: aa,
          margin: na,
          containerPadding: Ne,
          isDraggable: l,
          isResizable: l,
          draggableHandle: `.${D.DRAG_HANDLE_CLASS}`,
          onLayoutChange: B,
          compactType: "vertical",
          preventCollision: !1,
          children: g.map((p) => {
            const j = O[p.cardKey];
            if (!j) return /* @__PURE__ */ e.jsx("div", {}, p.cardKey);
            const v = j.component;
            return /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ e.jsx(
                v,
                {
                  filter: E,
                  editMode: l,
                  ...p.cardKey === "summary-strip" ? { template: R.template, compact: R.compact } : null
                }
              ),
              l && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => Re(p.cardKey),
                  "aria-label": r("Dashboard:RemoveCard", "Kartı kaldır"),
                  className: m(
                    "absolute top-2 right-2 z-10 w-6 h-6 rounded-lg",
                    "bg-surface-base border border-default text-text-secondary",
                    "hover:text-negative-500 hover:border-strong",
                    "focus-visible:outline-none focus-visible:shadow-focus"
                  ),
                  children: "×"
                }
              )
            ] }, p.cardKey);
          })
        }
      ) : /* @__PURE__ */ e.jsx(
        pa,
        {
          tier: A,
          cards: g,
          filter: E,
          strip: R,
          filters: Pe
        }
      )) }),
      /* @__PURE__ */ e.jsx(
        ga,
        {
          isDefault: ((ie = b.data) == null ? void 0 : ie.isDefault) !== !1,
          canEdit: se,
          onReset: Ee,
          onOpenCatalog: () => i(!0),
          isResetting: y.isPending
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      ca,
      {
        open: o,
        onOpenChange: i,
        presentCardKeys: g.map((p) => p.cardKey),
        onAdd: Ae
      }
    )
  ] });
}
function pa({ tier: t, cards: a, filter: n, strip: s, filters: l }) {
  const c = t === "tablet" ? 2 : 1, o = a.findIndex((i) => i.cardKey === "summary-strip");
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: m("grid items-stretch", t === "tablet" ? "gap-3.5" : "gap-3"),
      style: { gridTemplateColumns: `repeat(${c}, minmax(0, 1fr))` },
      children: [
        o < 0 && l,
        a.map((i, u) => {
          const d = O[i.cardKey];
          if (!d) return null;
          const b = d.component, h = c > 1 && d.band;
          return /* @__PURE__ */ e.jsxs(ae.Fragment, { children: [
            /* @__PURE__ */ e.jsx("div", { style: h ? { gridColumn: "1 / -1" } : void 0, children: /* @__PURE__ */ e.jsx(
              b,
              {
                filter: n,
                editMode: !1,
                ...i.cardKey === "summary-strip" ? { template: s.template, compact: s.compact } : null
              }
            ) }),
            u === o && l
          ] }, i.cardKey);
        })
      ]
    }
  );
}
function ha({ viewKey: t, onViewChange: a, range: n, onRangeChange: s, editMode: l, canEdit: c, onToggleEdit: o, onOpenCatalog: i }) {
  const u = F.find((d) => d.key === t) ?? F[0];
  return /* @__PURE__ */ e.jsxs("header", { className: "px-[18px] pt-4 pb-3 bg-surface-base border-b border-default flex items-end justify-between gap-5 mobile:hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("h1", { className: "text-[22px] font-semibold tracking-[-0.025em] text-text-primary m-0", children: r("Dashboard:Title", "Genel Bakış") }),
        /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center h-[22px] px-[9px] rounded-full bg-accent-soft text-accent-600 text-[11.5px] font-semibold flex-none", children: r(u.labelKey, u.fallback) })
      ] }),
      /* @__PURE__ */ e.jsx("nav", { className: "flex items-center gap-1 flex-wrap", "aria-label": r("Dashboard:Views", "Görünümler"), children: F.map((d) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => a(d.key),
          "aria-current": d.key === t ? "page" : void 0,
          className: m(
            "inline-flex items-center h-[30px] px-3 rounded-[9px] text-[12.5px] transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:shadow-focus",
            d.key === t ? "bg-text-primary text-surface-base font-semibold" : "text-text-secondary font-medium hover:bg-surface-sunken hover:text-text-primary"
          ),
          children: r(d.labelKey, d.fallback)
        },
        d.key
      )) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      /* @__PURE__ */ e.jsx(Te, { value: n, onChange: s }),
      c && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(L, { size: "sm", variant: "secondary", onClick: i, children: r("Dashboard:AddCard", "+ Kart ekle") }),
        /* @__PURE__ */ e.jsx(L, { size: "sm", variant: "primary", onClick: o, children: l ? r("Common:Done", "Bitir") : r("Common:Edit", "Düzenle") })
      ] })
    ] })
  ] });
}
function fa({ value: t, onChange: a, className: n }) {
  return /* @__PURE__ */ e.jsxs("label", { className: m("hidden mobile:inline-flex items-center flex-1 min-w-0", n), children: [
    /* @__PURE__ */ e.jsx("span", { className: "sr-only", children: r("Dashboard:SelectView", "Görünüm seç") }),
    /* @__PURE__ */ e.jsx(
      "select",
      {
        value: t,
        onChange: (s) => a(s.target.value),
        className: m(
          "h-8 w-full px-3 rounded-[9px] text-[12.5px] font-medium",
          "bg-surface-sunken text-text-secondary border-0",
          /* Mobilde kutu, başlık şeridinin beyazı yerine gri sayfa
             zemininin üstünde duruyor; sunken (#F3F4F6) o zeminle
             (#F5F5F5) neredeyse aynı → kartlarla aynı beyaz+çerçeve. */
          "mobile:bg-surface-base mobile:border mobile:border-default",
          "focus-visible:outline-none focus-visible:shadow-focus"
        ),
        children: F.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.key, children: r(s.labelKey, s.fallback) }, s.key))
      }
    )
  ] });
}
function Te({ value: t, onChange: a, className: n }) {
  return /* @__PURE__ */ e.jsxs("label", { className: m("inline-flex items-center", n), children: [
    /* @__PURE__ */ e.jsx("span", { className: "sr-only", children: r("Dashboard:SelectRange", "Zaman aralığı seç") }),
    /* @__PURE__ */ e.jsx(
      "select",
      {
        value: t,
        onChange: (s) => {
          a(s.target.value), va(s.target.value);
        },
        className: m(
          "h-8 w-full px-3 rounded-[9px] text-[12.5px] font-medium",
          "bg-surface-sunken text-text-secondary border-0",
          /* Mobilde kutu, başlık şeridinin beyazı yerine gri sayfa
             zemininin üstünde duruyor; sunken (#F3F4F6) o zeminle
             (#F5F5F5) neredeyse aynı → kartlarla aynı beyaz+çerçeve. */
          "mobile:bg-surface-base mobile:border mobile:border-default",
          "focus-visible:outline-none focus-visible:shadow-focus"
        ),
        children: Se.map(([s, l, c]) => /* @__PURE__ */ e.jsx("option", { value: s, children: r(l, c) }, s))
      }
    )
  ] });
}
function ba({ onSave: t, isSaving: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-6 py-2.5 bg-accent-soft border-b border-default mobile:px-3 mobile:flex-wrap", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center h-[26px] px-2.5 rounded-lg bg-accent text-white text-[11.5px] font-semibold", children: r("Dashboard:EditMode", "Düzenleme modu") }),
      /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center h-[26px] px-2.5 rounded-lg bg-surface-base border border-default text-accent-600 text-[11.5px]", children: r("Dashboard:EditMode:Snap", "Yapış: 12 kolon · 64px satır") })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] text-accent-600 mobile:hidden", children: r("Dashboard:EditMode:Hint", "Kartı başlıktaki ⠿ tutamağından sürükle") }),
      /* @__PURE__ */ e.jsx(L, { size: "sm", variant: "primary", onClick: t, disabled: a, children: r("Dashboard:EditMode:Save", "Düzeni kaydet") })
    ] })
  ] });
}
function ga({ isDefault: t, canEdit: a, onReset: n, onOpenCatalog: s, isResetting: l }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 mt-3 px-4 py-3 rounded-card border border-dashed border-default bg-surface-base mobile:flex-col mobile:items-stretch", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-secondary", children: t ? r("Dashboard:Footer:DefaultLayout", "Bu görünüm rol varsayılanından geldi — kart ekleyip çıkarabilir, sürükleyip boyutlandırabilirsin.") : r("Dashboard:Footer:CustomLayout", "Bu görünümü sen düzenledin. Dilediğin an varsayılana dönebilirsin.") }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      !t && /* @__PURE__ */ e.jsx(L, { size: "sm", variant: "secondary", onClick: n, disabled: l, children: r("Dashboard:Footer:Reset", "Varsayılana dön") }),
      a && /* @__PURE__ */ e.jsx(L, { size: "sm", variant: "primary", onClick: s, children: r("Dashboard:AddCard", "+ Kart ekle") })
    ] })
  ] });
}
function ya(t, a) {
  const n = O[t.cardKey], s = t.cardKey === "summary-strip";
  return {
    i: t.cardKey,
    x: t.x,
    y: t.y,
    w: t.w,
    h: s ? a : t.h,
    minW: (n == null ? void 0 : n.minW) ?? 2,
    minH: s ? a : (n == null ? void 0 : n.minH) ?? 2
  };
}
function ja() {
  try {
    const t = new URLSearchParams(window.location.search).get("range");
    return Se.some(([a]) => a === t) ? t : "Month";
  } catch {
    return "Month";
  }
}
function va(t) {
  try {
    const a = new URLSearchParams(window.location.search);
    a.set("range", t), window.history.replaceState(null, "", `${window.location.pathname}?${a}`);
  } catch {
  }
}
function ka(t) {
  const { connection: a, state: n } = ve(), s = Y();
  x.useEffect(() => {
    if (!a || !(t != null && t.length)) return;
    const l = t.map(([c, o]) => {
      const i = () => {
        o.forEach((u) => {
          s.invalidateQueries({ queryKey: u });
        });
      };
      return a.on(c, i), [c, i];
    });
    return () => {
      l.forEach(([c, o]) => {
        a.off(c, o);
      });
    };
  }, [a, n, s]);
}
function Da(t) {
  const { connection: a, state: n } = ve(), s = Y(), l = Ge();
  x.useEffect(() => {
    if (!a || !(t != null && t.length)) return;
    const c = t.map(([o, i]) => {
      const u = (d) => {
        var b;
        (b = i.queryKeys) == null || b.forEach(
          (h) => s.invalidateQueries({ queryKey: h })
        ), l.warning(i.message ?? "Bu kayıtta çakışma oldu", {
          description: i.description ?? (d == null ? void 0 : d.message),
          action: {
            label: "Yenile",
            onClick: () => {
              var h;
              (h = i.queryKeys) == null || h.forEach(
                (y) => s.invalidateQueries({ queryKey: y })
              );
            }
          }
        });
      };
      return a.on(o, u), [o, u];
    });
    return () => {
      c.forEach(([o, i]) => a.off(o, i));
    };
  }, [a, n, s]);
}
const f = (t) => ["dashboard", t];
function Na() {
  const t = x.useMemo(() => [
    /* Görev durumu değişti → teslimler, tıkananlar, özet, ısı takvimi, istatistik */
    ["TaskStatusChanged", [
      f("summary"),
      f("deliveries"),
      f("blocked-tasks"),
      f("delivery-heatmap"),
      f("statistics"),
      f("project-health")
    ]],
    /* Atama değişti → tıkanma sebebi "atanmamış" olabilir */
    ["TaskAssigned", [f("blocked-tasks"), f("deliveries")]],
    /* Onay kuyruğu (taslak fatura) hareketi */
    ["ApprovalCreated", [f("pending-approvals"), f("summary"), f("statistics")]],
    ["ApprovalResolved", [f("pending-approvals"), f("summary"), f("statistics")]],
    /* Bütçe / muhasebe hareketi → bütçe oranları ve finans istatistikleri */
    ["BudgetUpdated", [f("summary"), f("project-health"), f("statistics")]],
    ["JournalEntryPosted", [f("income-expense"), f("statistics")]],
    /* Hibe belgesi son tarihi → ısı takviminin sarı günleri */
    ["GrantDocumentDue", [f("delivery-heatmap"), f("statistics")]]
  ], []), a = x.useMemo(() => [
    ["BudgetConflict", {
      queryKeys: [f("summary"), f("project-health")],
      message: "Bütçe kaydında çakışma",
      description: "Aynı bütçeyi başka bir kullanıcı güncelledi."
    }]
  ], []);
  return ka(t), Da(a), null;
}
_e();
const be = document.getElementById("apya-dashboard-root");
be && Ie(be).render(
  /* @__PURE__ */ e.jsx(Ke, { children: /* @__PURE__ */ e.jsx(Ue, { children: /* @__PURE__ */ e.jsx(Fe, { children: /* @__PURE__ */ e.jsx(qe, { children: /* @__PURE__ */ e.jsxs(ze, { children: [
    /* @__PURE__ */ e.jsx(Na, {}),
    /* @__PURE__ */ e.jsx(ma, {})
  ] }) }) }) }) })
);
