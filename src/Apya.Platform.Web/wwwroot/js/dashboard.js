import { r as m, j as e, d as fe, b as dt } from "./react-vendor-D57GAUXd.js";
import { c as p, t as s, S as U, a as Ie, f as te, b as E, d as ut, e as mt, I as xt, B as O, T as ht } from "./Dialog-BdNKdiS6.js";
import { Q as P, a as pt } from "./QueryProvider-AIUp_Zk5.js";
import { H as He, a as bt, L as ft } from "./signalr-vendor-CjTpd8t3.js";
import { D as gt } from "./useDeviceMode-Dk7fb2QY.js";
import { u as yt, r as jt, T as kt } from "./registerServiceWorker-DJF2vjVD.js";
import { r as Dt } from "./grid-vendor-D-Pdxerz.js";
import { E as B } from "./EmptyState-Bhcx2Wdd.js";
import { u as M, a as le, b as Le } from "./query-vendor-Bf69L2iP.js";
import { a as ie } from "./httpClient-CRlyQ1eg.js";
/* empty css               */
const Fe = m.createContext({
  connection: null,
  state: He.Disconnected
});
function vt({ hubUrl: t = "/signalr-hubs/notifications", children: n, enabled: a = !0 }) {
  const [r, l] = m.useState(He.Disconnected), c = m.useRef(null);
  m.useEffect(() => {
    if (!a || typeof window > "u") return;
    const i = new bt().withUrl(t, { withCredentials: !0 }).withAutomaticReconnect([0, 2e3, 5e3, 1e4, 3e4]).configureLogging(ft.Warning).build();
    c.current = i, l(i.state);
    const d = () => l(i.state);
    return i.onreconnecting(d), i.onreconnected(d), i.onclose(d), i.start().then(d).catch((u) => {
      console.warn("[SignalR] connect failed:", u == null ? void 0 : u.message), d();
    }), () => {
      i.stop().catch(() => {
      }), c.current = null;
    };
  }, [t, a]);
  const o = m.useMemo(() => ({
    get connection() {
      return c.current;
    },
    state: r
  }), [r]);
  return /* @__PURE__ */ e.jsx(Fe.Provider, { value: o, children: n });
}
function Ke() {
  return m.useContext(Fe);
}
const $e = "apya-card-drag-handle";
function A({
  title: t,
  subtitle: n,
  badge: a,
  actions: r,
  footer: l,
  accent: c,
  /* 'negative' | 'warning' — kritik kartların üst şeridi */
  editMode: o = !1,
  /* Sorgunun `isPending`i geçilir, `isLoading`i DEĞİL: kalıcı önbellek geri
     yüklenirken isLoading FALSE döner ama veri henüz yoktur; kart o karede
     boş/hatalı içerikle çizilirdi. (Prop adı geriye dönük uyum için kaldı.) */
  isLoading: i = !1,
  isError: d = !1,
  errorMessage: u,
  onRetry: h,
  isEmpty: x = !1,
  emptyState: D,
  skeleton: k,
  isFetching: S = !1,
  isStale: K = !1,
  dataUpdatedAt: W,
  bleed: y = !1,
  className: G,
  bodyClassName: T,
  children: $
}) {
  const N = !i && !d && K && S;
  return /* @__PURE__ */ e.jsxs(
    "section",
    {
      className: p(
        "h-full flex flex-col overflow-hidden",
        "rounded-card shadow-card",
        "bg-surface-base border border-default",
        G
      ),
      children: [
        c && /* @__PURE__ */ e.jsx(
          "span",
          {
            "aria-hidden": "true",
            className: p(
              "block h-[3px] flex-none",
              c === "negative" ? "bg-negative-500" : "bg-warning-500"
            )
          }
        ),
        /* @__PURE__ */ e.jsxs(
          "header",
          {
            className: p(
              "flex items-start justify-between gap-3 flex-none",
              "px-[18px] pt-4"
            ),
            children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
                o && /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: p(
                      $e,
                      "text-accent-soft text-xs tracking-[-2px] cursor-grab active:cursor-grabbing select-none flex-none"
                    ),
                    "aria-hidden": "true",
                    children: "⠿"
                  }
                ),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-semibold tracking-[-0.01em] truncate text-text-primary", children: t }),
                    a,
                    N && /* @__PURE__ */ e.jsx(Tt, {})
                  ] }),
                  n && /* @__PURE__ */ e.jsx("p", { className: "text-[11.5px] text-text-tertiary truncate", children: n })
                ] })
              ] }),
              r && /* Aksiyonlara basmak kartı sürüklemesin. */
              /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "flex items-center gap-2.5 flex-none",
                  onMouseDown: (R) => R.stopPropagation(),
                  onTouchStart: (R) => R.stopPropagation(),
                  children: r
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: p(
              /* Kart yüksekliği ızgaradan SABİT gelir, içerik ise değişken:
                 kayıt sayısı, kart genişliği (satırlar sarar) ve kullanıcının
                 verdiği boyut hepsi etkiliyor. Kaydırma olmadan `overflow-hidden`
                 fazlalığı sessizce kesiyordu — kullanıcının "alt açıklamalar
                 kesiliyor" dediği davranış. Kart kendi gerekçesiyle
                 `bodyClassName="overflow-visible"` diyerek vazgeçebilir. */
              "flex-1 min-h-0 pt-3 overflow-y-auto",
              y ? "pb-0" : "px-[18px] pb-[18px]",
              y && "px-[18px]",
              T
            ),
            children: [
              d && /* @__PURE__ */ e.jsx(wt, { message: u, onRetry: h, dataUpdatedAt: W }),
              !d && i && (k ?? /* @__PURE__ */ e.jsx(Nt, {})),
              !d && !i && x && (D ?? /* @__PURE__ */ e.jsx(St, {})),
              !d && !i && !x && $
            ]
          }
        ),
        l && /* @__PURE__ */ e.jsx("footer", { className: "flex-none px-[18px] pb-[14px] pt-1", children: l })
      ]
    }
  );
}
function Nt() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", "aria-busy": "true", children: [
    /* @__PURE__ */ e.jsx(U, { height: 28, className: "w-1/3" }),
    /* @__PURE__ */ e.jsx(U, { height: 14 }),
    /* @__PURE__ */ e.jsx(U, { height: 14, className: "w-5/6" }),
    /* @__PURE__ */ e.jsx(U, { height: 14, className: "w-3/4" })
  ] });
}
function St() {
  return /* @__PURE__ */ e.jsx(
    B,
    {
      compact: !0,
      title: s("Common:NoDataToShow", "Görüntülenecek veri yok"),
      description: s("Common:NoDataYet", "Yeni veri girildiğinde burada görünecek.")
    }
  );
}
function wt({ message: t, onRetry: n, dataUpdatedAt: a }) {
  const r = Ct(a);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center justify-center text-center gap-2 py-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-text-secondary max-w-xs", children: t || s("Common:FetchError", "Veri alınırken bir hata oluştu.") }),
    r && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-text-tertiary", children: [
      s("Common:LastSuccessfulUpdate", "Son başarılı güncelleme"),
      ": ",
      r
    ] }),
    n && /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        onClick: n,
        className: "text-[12.5px] text-text-link underline-offset-2 hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
        children: s("Common:Retry", "Tekrar dene")
      }
    )
  ] });
}
function Tt() {
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1 text-[11px] text-text-tertiary flex-none",
      title: s("Common:UpdatingInBackground", "Arka planda güncelleniyor"),
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-warning-500 animate-pulse", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: s("Common:Updating", "güncelleniyor") })
      ]
    }
  );
}
function Ct(t) {
  if (t == null) return null;
  const n = t instanceof Date ? t.getTime() : Number(t);
  if (!Number.isFinite(n)) return null;
  const a = Math.round((n - Date.now()) / 1e3), r = Math.abs(a), l = new Intl.RelativeTimeFormat(Ie(), { numeric: "auto" });
  return r < 60 ? l.format(a, "second") : r < 3600 ? l.format(Math.round(a / 60), "minute") : r < 86400 ? l.format(Math.round(a / 3600), "hour") : l.format(Math.round(a / 86400), "day");
}
A.DRAG_HANDLE_CLASS = $e;
function Et({ trend: t, children: n }) {
  const a = t === "Up" ? "▲" : t === "Down" ? "▼" : "•";
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: p(
        "font-mono text-[10.5px] tabular-nums",
        t === "Up" ? "text-positive-600" : t === "Down" ? "text-negative-600" : "text-text-tertiary"
      ),
      children: [
        a,
        " ",
        n
      ]
    }
  );
}
const ae = 100, _ = 40;
function Pt(t, n = _, a = 2) {
  const r = Math.max(...t, 0);
  if (r <= 0) return t.map(() => n - a);
  const l = n - a * 2;
  return t.map((c) => a + l - c / r * l);
}
function At(t, n = ae) {
  if (t <= 1) return [n / 2];
  const a = n / (t - 1);
  return Array.from({ length: t }, (r, l) => l * a);
}
function Oe(t, n) {
  return t.length ? t.map((a, r) => `${r === 0 ? "M" : "L"} ${ne(a)} ${ne(n[r])}`).join(" ") : "";
}
function Rt(t, n, a = _) {
  return t.length ? `${Oe(t, n)} L ${ne(t[t.length - 1])} ${a} L ${ne(t[0])} ${a} Z` : "";
}
function ne(t) {
  return Math.round(t * 100) / 100;
}
function Bt({ values: t = [], color: n = "var(--apya-brand-500)", ariaLabel: a }) {
  const r = m.useId().replace(/:/g, "");
  if (t.length < 2) return null;
  const l = At(t.length), c = Pt(t);
  return /* @__PURE__ */ e.jsxs(
    "svg",
    {
      viewBox: `0 0 ${ae} ${_}`,
      preserveAspectRatio: "none",
      className: "block w-full h-full",
      role: a ? "img" : "presentation",
      "aria-label": a,
      children: [
        /* @__PURE__ */ e.jsx("defs", { children: /* @__PURE__ */ e.jsxs("linearGradient", { id: r, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ e.jsx("stop", { offset: "0%", stopColor: n, stopOpacity: "0.16" }),
          /* @__PURE__ */ e.jsx("stop", { offset: "100%", stopColor: n, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ e.jsx("path", { d: Rt(l, c), fill: `url(#${r})` }),
        /* @__PURE__ */ e.jsx(
          "path",
          {
            d: Oe(l, c),
            fill: "none",
            stroke: n,
            strokeWidth: "1.75",
            vectorEffect: "non-scaling-stroke"
          }
        )
      ]
    }
  );
}
const Mt = ["var(--apya-positive-500)", "color-mix(in srgb, var(--apya-negative-500) 45%, transparent)"];
function It({ groups: t = [], colors: n = Mt, ariaLabel: a }) {
  if (!t.length) return null;
  const r = Math.max(...t.flatMap((i) => i.values), 0), l = ae / t.length, c = Math.min(4.5, l * 0.62 / 2), o = c * 0.22;
  return /* @__PURE__ */ e.jsx(
    "svg",
    {
      viewBox: `0 0 ${ae} ${_}`,
      preserveAspectRatio: "none",
      className: "block w-full h-full",
      role: a ? "img" : "presentation",
      "aria-label": a,
      children: t.map((i, d) => {
        const u = i.values.length * c + (i.values.length - 1) * o, h = d * l + (l - u) / 2;
        return i.values.map((x, D) => {
          const k = r > 0 ? x / r * (_ - 2) : 0;
          return /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: h + D * (c + o),
              y: _ - k,
              width: c,
              height: k,
              rx: "0.8",
              fill: n[D % n.length]
            },
            `${d}-${D}`
          );
        });
      })
    }
  );
}
const ue = 34, Se = 2 * Math.PI * ue;
function Ht({ ratio: t = 0, size: n = 58, ariaLabel: a }) {
  const r = Math.max(0, Math.min(t, 1)), l = r * Se, c = r >= 0.9 ? "var(--apya-negative-500)" : r >= 0.7 ? "var(--apya-warning-500)" : "var(--apya-positive-500)";
  return /* @__PURE__ */ e.jsxs(
    "svg",
    {
      viewBox: "0 0 100 100",
      style: { width: n, height: n },
      className: "flex-none",
      role: "img",
      "aria-label": a ?? `${Math.round(r * 100)}%`,
      children: [
        /* @__PURE__ */ e.jsx("circle", { cx: "50", cy: "50", r: ue, fill: "none", stroke: "var(--apya-surface-sunken)", strokeWidth: "12" }),
        l > 0 && /* @__PURE__ */ e.jsx(
          "circle",
          {
            cx: "50",
            cy: "50",
            r: ue,
            fill: "none",
            stroke: c,
            strokeWidth: "12",
            strokeDasharray: `${l} ${Se - l}`,
            strokeLinecap: "round",
            transform: "rotate(-90 50 50)"
          }
        )
      ]
    }
  );
}
const Lt = [
  "bg-surface-sunken",
  /* 0 teslim */
  "bg-brand-200",
  "bg-brand-300",
  "bg-brand-500",
  "bg-brand-600"
];
function Ft(t, n) {
  return t <= 0 ? 0 : n <= 1 ? 2 : Math.min(4, 1 + Math.round((t - 1) / n * 3));
}
function Kt({ cells: t = [], weekdayLabels: n = !0 }) {
  if (!t.length) return null;
  const a = Math.max(...t.map((l) => l.count), 0), r = [];
  for (let l = 0; l < t.length; l += 7) r.push(t.slice(l, l + 7));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
    r.map((l, c) => /* @__PURE__ */ e.jsx("div", { className: "flex gap-1", children: l.map((o) => /* @__PURE__ */ e.jsx(
      "span",
      {
        title: $t(o),
        className: p(
          "flex-1 h-[15px] rounded",
          /* Hibe günü kademeden çıkar, sarı boyanır. Tasarımdaki
             #FCD34D için token yok → warning-500 yarı saydam
             (yeni renk üretmemek için). */
          o.isGrantDeadline ? "bg-warning-500/55" : Lt[Ft(o.count, a)]
        )
      },
      o.date
    )) }, c)),
    n && /* @__PURE__ */ e.jsx("div", { className: "flex justify-between font-mono text-[9.5px] text-text-tertiary pt-0.5", children: [
      s("Common:Day:Mon", "Pzt"),
      s("Common:Day:Tue", "Sal"),
      s("Common:Day:Wed", "Çar"),
      s("Common:Day:Thu", "Per"),
      s("Common:Day:Fri", "Cum"),
      s("Common:Day:Sat", "Cmt"),
      s("Common:Day:Sun", "Paz")
    ].map((l) => /* @__PURE__ */ e.jsx("span", { children: l }, l)) })
  ] });
}
function $t(t) {
  const n = new Date(t.date).toLocaleDateString(), a = s("Dashboard:Heatmap:CellCount", "{0} teslim", t.count);
  return t.isGrantDeadline ? `${n} — ${a} · ${s("Dashboard:Heatmap:GrantDeadline", "hibe son tarihi")}` : `${n} — ${a}`;
}
function Ot({ ratio: t = 0, tone: n = "positive", ariaLabel: a }) {
  const r = Math.max(0, Math.min(t, 1)), l = Math.round(r * 100), c = n === "negative" ? "var(--apya-negative-500)" : n === "warning" ? "var(--apya-warning-500)" : "var(--apya-positive-500)";
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "flex gap-1",
      role: "img",
      "aria-label": a ?? `%${l}`,
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
const Wt = ["Upcoming", "OnTrack", "InReview", "Overdue"], Gt = ["ThisWeek", "NextWeek", "EndOfMonth", "Later"], Ut = ["Healthy", "Attention", "Risky"], _t = ["WaitingReview", "Dependency", "Unassigned"], zt = ["Flat", "Up", "Down"], qt = ["Work", "Finance", "Grants", "Communication", "System"];
function z(t, n, a) {
  return typeof n == "string" ? n : t[n] ?? a;
}
function Yt(t) {
  return (t ?? []).map((n) => ({
    ...n,
    state: z(Wt, n.state, "Upcoming"),
    groupKey: z(Gt, n.groupKey, "Later")
  }));
}
function Vt(t) {
  return (t ?? []).map((n) => ({
    ...n,
    state: z(Ut, n.state, "Healthy")
  }));
}
function Qt(t) {
  return (t ?? []).map((n) => ({
    ...n,
    blockReason: z(_t, n.blockReason, "Dependency")
  }));
}
function Xt(t) {
  return (t ?? []).map((n) => ({
    ...n,
    group: z(qt, n.group, "Work"),
    trend: z(zt, n.trend, "Flat")
  }));
}
const we = 0, Q = 6e4, ge = 3e4;
function Jt({ range: t, projectId: n } = {}) {
  const a = new URLSearchParams();
  t && a.set("range", t), n && a.set("projectId", n);
  const r = a.toString();
  return r ? `?${r}` : "";
}
const L = (t, n) => ie.get(`/api/dashboard/${t}${Jt(n)}`);
function We(t) {
  return M({
    queryKey: P.dashboard.summary(t),
    queryFn: () => L("summary", t),
    staleTime: ge
    /* bütçe alanları içeriyor */
  });
}
function Ge(t) {
  return M({
    queryKey: P.dashboard.deliveries(t),
    queryFn: () => L("deliveries", t),
    select: Yt,
    staleTime: Q
  });
}
function Ue(t) {
  return M({
    queryKey: P.dashboard.projectHealth(t),
    queryFn: () => L("project-health", t),
    select: Vt,
    staleTime: Q
  });
}
function _e() {
  return M({
    queryKey: P.dashboard.approvals(),
    queryFn: () => L("pending-approvals"),
    staleTime: ge
  });
}
function ze() {
  return M({
    queryKey: P.dashboard.blockedTasks(),
    queryFn: () => L("blocked-tasks"),
    select: Qt,
    staleTime: Q
  });
}
function qe(t) {
  return M({
    queryKey: P.dashboard.statistics(t),
    queryFn: () => L("statistics", t),
    select: Xt,
    staleTime: Q
  });
}
function Ye(t) {
  return M({
    queryKey: P.dashboard.incomeExpense(t),
    queryFn: () => L("income-expense", t),
    staleTime: ge
  });
}
function Ve(t) {
  return M({
    queryKey: P.dashboard.deliveryHeatmap(t),
    queryFn: () => L("delivery-heatmap", t),
    staleTime: Q
  });
}
function Zt({ filter: t, template: n, compact: a }) {
  const { data: r, isPending: l, isError: c, refetch: o } = We(t), i = { gridTemplateColumns: n ?? "repeat(4, minmax(0, 2fr)) minmax(0, 3fr)" };
  return l ? /* @__PURE__ */ e.jsx("div", { className: "h-full grid gap-[12px]", style: i, children: Array.from({ length: 5 }, (d, u) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-card shadow-card bg-surface-base border border-default p-[16px]", children: [
    /* @__PURE__ */ e.jsx(U, { height: 14, className: "w-2/3 mb-[8px]" }),
    /* @__PURE__ */ e.jsx(U, { height: 28, className: "w-1/2" })
  ] }, u)) }) : c || !r ? /* @__PURE__ */ e.jsxs("div", { className: "rounded-card shadow-card bg-surface-base border border-default p-[16px] flex items-center justify-between gap-[12px]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-secondary", children: s("Dashboard:Summary:Error", "Özet yüklenemedi.") }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => o(), className: "text-[12.5px] text-text-link hover:underline", children: s("Common:Retry", "Tekrar dene") })
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
        J,
        {
          compact: a,
          label: s("Dashboard:Summary:DueThisPeriod", "Bu dönem teslim"),
          value: r.dueThisPeriod,
          pill: s("Dashboard:Summary:DueThisWeek", "{0} bu hafta", r.dueThisWeek),
          icon: /* @__PURE__ */ e.jsx(ta, {}),
          iconTone: "brand",
          spark: r.dueTrend
        }
      ),
      /* @__PURE__ */ e.jsx(
        J,
        {
          compact: a,
          label: s("Dashboard:Summary:Overdue", "Gecikmiş"),
          value: r.overdue,
          tone: "negative",
          pill: r.oldestOverdueDays != null ? s("Dashboard:Summary:OldestOverdue", "en eski {0} g", r.oldestOverdueDays) : null,
          pillTone: "negative",
          icon: /* @__PURE__ */ e.jsx(aa, {}),
          iconTone: "negative",
          caption: s("Dashboard:Summary:OverdueProjects", "{0} projede", r.overdueProjectCount)
        }
      ),
      /* @__PURE__ */ e.jsx(
        J,
        {
          compact: a,
          label: s("Dashboard:Summary:Blocked", "Tıkanan iş"),
          value: r.blocked,
          tone: "warning",
          pill: s("Dashboard:Summary:BlockedAvg", "ort. {0} g", r.blockedAvgIdleDays),
          pillTone: "warning",
          icon: /* @__PURE__ */ e.jsx(na, {}),
          iconTone: "warning",
          caption: s("Dashboard:Summary:BlockedReasons", "onay · bilgi · bağımlılık")
        }
      ),
      /* @__PURE__ */ e.jsx(
        J,
        {
          compact: a,
          label: s("Dashboard:Summary:PendingApprovals", "Bende onay"),
          value: r.pendingApprovals,
          locked: r.pendingApprovals == null,
          lockedPermission: "Platform.Invoices",
          pill: r.pendingApprovalAmount != null ? te(r.pendingApprovalAmount, r.currency) : null,
          icon: /* @__PURE__ */ e.jsx(sa, {}),
          iconTone: "brand",
          caption: r.pendingApprovalAvgAgeHours != null ? s("Dashboard:Summary:AvgWait", "ortalama bekleme {0} sa", r.pendingApprovalAvgAgeHours) : null
        }
      ),
      /* @__PURE__ */ e.jsx(ea, { data: r, compact: a })
    ] })
  );
}
function J({ label: t, value: n, pill: a, pillTone: r = "neutral", caption: l, tone: c = "neutral", icon: o, iconTone: i = "brand", spark: d, locked: u, lockedPermission: h, compact: x }) {
  const D = !x && d && d.length > 1;
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: p(
        "rounded-card shadow-card bg-surface-base border border-default",
        "flex flex-col overflow-hidden",
        x ? "gap-[5px] pt-[12px] px-[12px] pb-[12px]" : p(
          "gap-[7px]",
          /* Üst ve yan padding TÜM kutucuklarda aynı; yalnız alt padding
             grafikli kutucukta sıfırlanır ki sparkline kenara yapışsın.
             Farklı üst padding vermek şeritteki başlıkları kaydırıyordu. */
          "pt-[16px] px-[16px]",
          d ? "pb-[0px]" : "pb-[16px]"
        )
      ),
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[8px]", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-medium text-text-secondary truncate", children: t }),
          /* @__PURE__ */ e.jsx("span", { className: p(
            "inline-flex items-center justify-center rounded-lg flex-none",
            x ? "w-5 h-5" : "w-6 h-6",
            i === "negative" ? "bg-negative-50 text-negative-700" : i === "warning" ? "bg-warning-50 text-warning-700" : "bg-accent-soft text-accent-600"
          ), children: o })
        ] }),
        u ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx("span", { className: p("font-mono font-semibold tracking-[-0.03em] text-text-tertiary", x ? "text-[22px]" : "text-[28px]", "leading-none"), children: "— —" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: s("Dashboard:Stat:Locked", "yetki gerekli") }),
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary", children: h })
        ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-[8px] flex-wrap", children: [
            /* @__PURE__ */ e.jsx("span", { className: p(
              "font-mono font-semibold tracking-[-0.03em] tabular-nums",
              x ? "text-[22px]" : "text-[28px]",
              /* leading-none SIRASI ÖNEMLİ: tailwind-merge, text-[..] font-size
                 sınıfını gördüğünde ÖNCESİNDEKİ leading-* sınıfını atıyor. */
              "leading-none",
              c === "negative" ? "text-negative-500" : c === "warning" ? "text-warning-600" : "text-text-primary"
            ), children: n }),
            a && /* @__PURE__ */ e.jsx("span", { className: p(
              "font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full tabular-nums",
              r === "negative" ? "bg-negative-50 text-negative-700" : r === "warning" ? "bg-warning-50 text-warning-700" : "bg-surface-sunken text-text-secondary"
            ), children: a })
          ] }),
          l && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary truncate", children: l })
        ] }),
        D && /* @__PURE__ */ e.jsx("div", { className: "h-9 mt-auto -mx-[16px]", children: /* @__PURE__ */ e.jsx(Bt, { values: d, ariaLabel: s("Dashboard:Summary:DueTrend", "Teslim dağılımı") }) })
      ]
    }
  );
}
function ea({ data: t, compact: n }) {
  const a = t.budgetUsedRatio == null && t.budgetTotal == null;
  return (
    /* Kompakt kipte tam satıra yayılır: 145px'lik yarım kolonda Gauge (58px)
       + altyazı sığmıyor, tek başına geniş satırda rahat ediyor. */
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: p(
          "rounded-card shadow-card bg-surface-base border border-default flex items-center justify-between",
          n ? "p-[12px] gap-[8px]" : "p-[16px] gap-[10px]"
        ),
        style: n ? { gridColumn: "1 / -1" } : void 0,
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: p("flex flex-col min-w-0", n ? "gap-[5px]" : "gap-[7px]"), children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-medium text-text-secondary truncate", children: s("Dashboard:Summary:BudgetUsage", "Bütçe kullanımı") }),
            a ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsx("span", { className: p("font-mono font-semibold tracking-[-0.03em] text-text-tertiary", n ? "text-[22px]" : "text-[28px]", "leading-none"), children: "— —" }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary", children: "Platform.Projects.ViewBudget" })
            ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsxs("span", { className: p("font-mono font-semibold tracking-[-0.03em] text-text-primary tabular-nums", n ? "text-[22px]" : "text-[28px]", "leading-none"), children: [
                "%",
                Math.round((t.budgetUsedRatio ?? 0) * 100)
              ] }),
              /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary truncate", children: [
                te(t.budgetSpent, t.currency),
                " / ",
                te(t.budgetTotal, t.currency)
              ] })
            ] })
          ] }),
          !a && /* @__PURE__ */ e.jsx(Ht, { ratio: t.budgetUsedRatio ?? 0 })
        ]
      }
    )
  );
}
const oe = { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }, ta = () => /* @__PURE__ */ e.jsxs("svg", { ...oe, children: [
  /* @__PURE__ */ e.jsx("path", { d: "M8 2v3M16 2v3M4 9h16" }),
  /* @__PURE__ */ e.jsx("rect", { x: "4", y: "5", width: "16", height: "16", rx: "2" })
] }), aa = () => /* @__PURE__ */ e.jsxs("svg", { ...oe, children: [
  /* @__PURE__ */ e.jsx("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ e.jsx("path", { d: "M12 8v5" }),
  /* @__PURE__ */ e.jsx("path", { d: "M12 16.5v.01" })
] }), na = () => /* @__PURE__ */ e.jsxs("svg", { ...oe, children: [
  /* @__PURE__ */ e.jsx("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ e.jsx("path", { d: "M5.6 5.6l12.8 12.8" })
] }), sa = () => /* @__PURE__ */ e.jsx("svg", { ...oe, children: /* @__PURE__ */ e.jsx("path", { d: "M20 6L9 17l-5-5" }) }), me = ["ThisWeek", "NextWeek", "EndOfMonth", "Later"], xe = {
  ThisWeek: ["Dashboard:Deliveries:ThisWeek", "Bu hafta"],
  NextWeek: ["Dashboard:Deliveries:NextWeek", "Gelecek hafta"],
  EndOfMonth: ["Dashboard:Deliveries:EndOfMonth", "Ay sonu"],
  Later: ["Dashboard:Deliveries:Later", "Sonrası"]
};
function ra({ filter: t, editMode: n }) {
  const a = Ge(t), r = a.data ?? [], l = m.useMemo(() => {
    const o = new Map(me.map((i) => [i, []]));
    for (const i of r)
      (o.get(i.groupKey) ?? o.get("Later")).push(i);
    return me.map((i) => ({ key: i, items: o.get(i) ?? [] })).filter((i) => i.items.length > 0);
  }, [r]), c = r.filter((o) => o.state === "Overdue").length;
  return /* @__PURE__ */ e.jsx(
    A,
    {
      editMode: n,
      title: s("Dashboard:Deliveries:Title", "Bu ay teslim edilecekler"),
      subtitle: s("Dashboard:Deliveries:Subtitle", "{0} iş · {1} gecikmiş", r.length, c),
      actions: /* @__PURE__ */ e.jsx("a", { href: "/Tasks", className: "text-[12.5px] font-medium text-text-link hover:underline", children: s("Dashboard:Deliveries:AllTasks", "Görev listesi →") }),
      isLoading: a.isPending,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: r.length === 0,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        B,
        {
          compact: !0,
          title: s("Dashboard:Deliveries:EmptyTitle", "Bu dönem teslim yok"),
          description: s("Dashboard:Deliveries:EmptyDescription", "Son tarihi bu döneme düşen açık iş bulunmuyor."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Tasks", className: "text-[12.5px] font-medium text-text-link hover:underline", children: s("Dashboard:Deliveries:AllTasks", "Görev listesi →") })
        }
      ),
      children: /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2.5", children: l.map((o) => /* @__PURE__ */ e.jsxs(fe.Fragment, { children: [
        /* @__PURE__ */ e.jsx(la, { groupKey: o.key, count: o.items.length }),
        /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col gap-[3px]", children: o.items.map((i) => /* @__PURE__ */ e.jsx(ia, { item: i }, i.taskId)) })
      ] }, o.key)) })
    }
  );
}
function la({ groupKey: t, count: n }) {
  const [a, r] = xe[t] ?? xe.Later;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.04em] text-text-tertiary", children: s(a, r) }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary tabular-nums", children: n }),
    /* @__PURE__ */ e.jsx("span", { className: "flex-1 h-px bg-subtle" })
  ] });
}
const Te = {
  Overdue: "bg-negative-500",
  InReview: "bg-warning-500",
  OnTrack: "bg-positive-500",
  Upcoming: "bg-neutral-300"
};
function ia({ item: t }) {
  return /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsxs(
    "a",
    {
      href: `/Tasks?taskId=${t.taskId}`,
      className: p(
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
        /* @__PURE__ */ e.jsx("span", { className: p("w-1.5 h-1.5 rounded-full flex-none", Te[t.state] ?? Te.Upcoming), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-[140px] text-[13.5px] font-medium text-text-primary truncate", children: t.title }),
        t.state === "Overdue" && t.overdueDays != null && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold px-2 py-0.5 rounded-full bg-negative-50 text-negative-700 flex-none", children: s("Dashboard:Deliveries:OverdueDays", "{0} gün gecikmiş", t.overdueDays) }),
        t.state === "InReview" && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold px-2 py-0.5 rounded-full bg-warning-50 text-warning-700 flex-none", children: s("Dashboard:Deliveries:InReview", "kontrolde") }),
        t.projectName && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-secondary px-2 py-0.5 rounded-full bg-surface-sunken flex-none truncate max-w-[140px]", children: t.projectName }),
        /* @__PURE__ */ e.jsx("span", { className: p(
          "font-mono text-[11.5px] w-[50px] text-right flex-none tabular-nums",
          t.state === "Overdue" ? "text-negative-500" : "text-text-secondary"
        ), children: oa(t.dueDate) }),
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
function oa(t) {
  const n = new Date(t);
  return Number.isNaN(n.getTime()) ? "" : n.toLocaleDateString(void 0, { day: "numeric", month: "short" });
}
const Ce = 4, se = {
  Healthy: ["bg-positive-50 text-positive-700", "Dashboard:Health:Healthy", "Sağlıklı"],
  Attention: ["bg-warning-50 text-warning-700", "Dashboard:Health:Attention", "Dikkat"],
  Risky: ["bg-negative-50 text-negative-700", "Dashboard:Health:Risky", "Riskli"]
}, ca = { Healthy: "positive", Attention: "warning", Risky: "negative" };
function da({ filter: t, editMode: n }) {
  const a = Ue(t), r = a.data ?? [], l = r.slice(0, Ce), c = r.slice(Ce);
  return /* @__PURE__ */ e.jsx(
    A,
    {
      editMode: n,
      title: s("Dashboard:Health:Title", "Proje sağlığı"),
      subtitle: s("Dashboard:Health:Subtitle", "{0} aktif proje", r.length),
      isLoading: a.isPending,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: r.length === 0,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        B,
        {
          compact: !0,
          title: s("Dashboard:Health:EmptyTitle", "Henüz proje yok"),
          description: s("Dashboard:Health:EmptyDescription", "Proje oluşturunca sağlık göstergeleri burada belirir."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Projects", className: "text-[12.5px] font-medium text-text-link hover:underline", children: s("Dashboard:Health:OpenProjects", "Projeleri aç →") })
        }
      ),
      footer: c.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary truncate", children: c.map((o) => o.name).join(" · ") }),
        /* @__PURE__ */ e.jsx("a", { href: "/Projects", className: "text-xs text-text-link hover:underline flex-none", children: s("Dashboard:Health:More", "+{0} proje →", c.length) })
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
          /* @__PURE__ */ e.jsx(ua, { state: o.state })
        ] }),
        /* @__PURE__ */ e.jsx(
          Ot,
          {
            ratio: o.budgetRatio ?? o.timeRatio ?? 0,
            tone: ca[o.state] ?? "positive",
            ariaLabel: s("Dashboard:Health:BarLabel", "{0} ilerleme", o.name)
          }
        ),
        /* @__PURE__ */ e.jsx(ma, { project: o })
      ] }, o.projectId)) })
    }
  );
}
function ua({ state: t }) {
  const [n, a, r] = se[t] ?? se.Healthy;
  return /* @__PURE__ */ e.jsx("span", { className: p("text-[11px] font-semibold px-2 py-0.5 rounded-full flex-none", n), children: s(a, r) });
}
function ma({ project: t }) {
  const n = [];
  return t.daysRemaining != null && n.push(s("Dashboard:Health:DaysLeft", "{0} gün", t.daysRemaining)), t.budgetRatio != null && n.push(s("Dashboard:Health:BudgetPercent", "%{0} bütçe", Math.round(t.budgetRatio * 100))), n.push(s("Dashboard:Health:Tasks", "{0}/{1} görev", t.tasksDone, t.tasksTotal)), /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2.5 font-mono text-[11px] text-text-secondary tabular-nums", children: n.map((a, r) => /* @__PURE__ */ e.jsxs(fe.Fragment, { children: [
    r > 0 && /* @__PURE__ */ e.jsx("span", { className: "text-border-default", "aria-hidden": "true", children: "|" }),
    /* @__PURE__ */ e.jsx("span", { children: a })
  ] }, a)) });
}
function xa({ editMode: t }) {
  var o;
  const n = _e(), a = n.data ?? [], r = a.reduce((i, d) => i + (d.amount ?? 0), 0), l = a.length ? Math.round(a.reduce((i, d) => i + d.ageHours, 0) / a.length) : 0, c = ((o = a[0]) == null ? void 0 : o.currency) ?? "TRY";
  return /* @__PURE__ */ e.jsx(
    A,
    {
      editMode: t,
      title: s("Dashboard:Approvals:Title", "Bende bekleyen kararlar"),
      badge: a.length > 0 && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full bg-warning-50 text-warning-700 tabular-nums flex-none", children: a.length }),
      isLoading: n.isPending,
      isError: n.isError,
      onRetry: n.refetch,
      isEmpty: a.length === 0,
      isFetching: n.isFetching,
      isStale: n.isStale,
      dataUpdatedAt: n.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        B,
        {
          compact: !0,
          title: s("Dashboard:Approvals:EmptyTitle", "Karar bekleyen yok"),
          description: s("Dashboard:Approvals:EmptyDescription", "Taslak durumdaki fatura bulunmuyor."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Invoices", className: "text-[12.5px] font-medium text-text-link hover:underline", children: s("Dashboard:Approvals:OpenInvoices", "Faturaları aç →") })
        }
      ),
      footer: a.length > 0 && /* Satır başlıkları serbest metin olduğu için kırpılabilir, ama bu
      özet SABİT biçimli — dar kartta kırpmak yerine alt satıra sarsın. */
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: s("Dashboard:Approvals:Total", "Toplam {0} · ort. bekleme {1} sa", E(r, c), l) }),
        /* @__PURE__ */ e.jsx("a", { href: "/Invoices", className: "text-[12.5px] font-medium text-text-link hover:underline flex-none", children: s("Dashboard:Approvals:Queue", "Onay kuyruğu →") })
      ] }),
      children: /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col", children: a.slice(0, 4).map((i, d) => /* @__PURE__ */ e.jsxs(
        "li",
        {
          className: "flex flex-wrap items-center gap-2.5 py-2 border-b border-subtle last:border-b-0",
          children: [
            /* @__PURE__ */ e.jsxs("span", { className: "flex-1 min-w-[150px] flex flex-col gap-0.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-medium text-text-primary truncate", children: i.title }),
              /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary truncate", children: s("Dashboard:Approvals:Meta", "Fatura · {0} · {1} sa", i.requesterName || "—", i.ageHours) })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "font-mono text-xs font-semibold text-text-primary tabular-nums flex-none", children: E(i.amount, i.currency) }),
            /* @__PURE__ */ e.jsx(
              "a",
              {
                href: i.targetUrl,
                className: "text-xs font-medium text-text-link hover:underline flex-none",
                children: s("Dashboard:Approvals:Review", "İncele →")
              }
            )
          ]
        },
        i.id
      )) })
    }
  );
}
const re = {
  WaitingReview: ["bg-warning-50 text-warning-700", "Dashboard:Blockers:WaitingReview", "Kontrolde"],
  Dependency: ["bg-surface-sunken text-text-secondary", "Dashboard:Blockers:Dependency", "Bağımlı"],
  Unassigned: ["bg-negative-50 text-negative-700", "Dashboard:Blockers:Unassigned", "Atanmamış"]
};
function ha({ editMode: t }) {
  const n = ze(), a = n.data ?? [];
  return /* @__PURE__ */ e.jsx(
    A,
    {
      editMode: t,
      accent: a.length > 0 ? "negative" : void 0,
      title: s("Dashboard:Blockers:Title", "Tıkanan işler & risk"),
      badge: a.length > 0 && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full bg-negative-50 text-negative-700 tabular-nums flex-none", children: a.length }),
      isLoading: n.isPending,
      isError: n.isError,
      onRetry: n.refetch,
      isEmpty: a.length === 0,
      isFetching: n.isFetching,
      isStale: n.isStale,
      dataUpdatedAt: n.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        B,
        {
          compact: !0,
          title: s("Dashboard:Blockers:EmptyTitle", "Tıkanan iş yok"),
          description: s("Dashboard:Blockers:EmptyDescription", "Açık işlerin hepsi son günlerde hareket görmüş.")
        }
      ),
      children: /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col gap-3", children: a.slice(0, 3).map((r, l) => /* @__PURE__ */ e.jsxs("li", { className: "flex flex-col gap-1", children: [
        l > 0 && /* @__PURE__ */ e.jsx("span", { className: "h-px bg-subtle mb-2" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(pa, { reason: r.blockReason }),
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary truncate", children: s("Dashboard:Blockers:Meta", "{0} · {1} gündür hareketsiz", r.code, r.idleDays) })
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[12.5px] font-medium text-text-primary leading-[1.4]", children: [
          r.title,
          r.dependentCount > 0 && /* @__PURE__ */ e.jsxs("span", { className: "text-text-tertiary font-normal", children: [
            " — ",
            s("Dashboard:Blockers:Dependents", "{0} bağımlı görev bekliyor", r.dependentCount)
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(
          "a",
          {
            href: `/Tasks?taskId=${r.taskId}`,
            className: "text-xs font-medium text-text-link hover:underline self-start",
            children: s("Dashboard:Blockers:OpenTask", "Görevi aç →")
          }
        )
      ] }, r.taskId)) })
    }
  );
}
function pa({ reason: t }) {
  const [n, a, r] = re[t] ?? re.Dependency;
  return /* @__PURE__ */ e.jsx("span", { className: p("text-[11px] font-semibold px-2 py-0.5 rounded-full flex-none", n), children: s(a, r) });
}
function ba({ editMode: t }) {
  return /* @__PURE__ */ e.jsx(
    A,
    {
      editMode: t,
      title: s("Dashboard:Ai:Title", "AI önerileri"),
      subtitle: s("Dashboard:Ai:Subtitle", "sessiz inbox"),
      isEmpty: !0,
      emptyState: /* @__PURE__ */ e.jsx(
        B,
        {
          compact: !0,
          title: s("Dashboard:Ai:EmptyTitle", "AI şu an sessiz"),
          description: s("Dashboard:Ai:EmptyDescription", "Anlamlı bir öneri çıktığında burada görünecek."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Ai/Dashboard", className: "text-[12.5px] font-medium text-text-link hover:underline", children: s("Dashboard:Ai:OpenCenter", "AI Merkezi →") })
        }
      )
    }
  );
}
function fa({ filter: t, editMode: n }) {
  const a = Ye(t), r = a.data, l = (r == null ? void 0 : r.points) ?? [], c = l.some((i) => i.income > 0 || i.expense > 0), o = (r == null ? void 0 : r.currency) ?? "TRY";
  return /* @__PURE__ */ e.jsxs(
    A,
    {
      editMode: n,
      bleed: !0,
      title: s("Dashboard:IncomeExpense:Title", "Gelir / gider"),
      subtitle: s("Dashboard:IncomeExpense:Subtitle", "Son 6 ay"),
      actions: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 text-[11px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-2 h-2 rounded-full bg-positive-500" }),
          s("Dashboard:IncomeExpense:Income", "Gelir")
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-2 h-2 rounded-full bg-negative-500/45" }),
          s("Dashboard:IncomeExpense:Expense", "Gider")
        ] })
      ] }),
      isLoading: a.isPending,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: !c,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        B,
        {
          compact: !0,
          title: s("Dashboard:IncomeExpense:EmptyTitle", "Kayıtlı hareket yok"),
          description: s("Dashboard:IncomeExpense:EmptyDescription", "Son 6 ayda gelir veya gider kaydı bulunmuyor.")
        }
      ),
      bodyClassName: "flex flex-col gap-2.5",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-2xl font-semibold leading-none tracking-[-0.03em] text-text-primary tabular-nums", children: te((r == null ? void 0 : r.net) ?? 0, o) }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: s("Dashboard:IncomeExpense:Net", "net") })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-[82px] -mx-[18px] mt-auto", children: /* @__PURE__ */ e.jsx(
          It,
          {
            groups: l.map((i) => ({ values: [i.income, i.expense] })),
            ariaLabel: s("Dashboard:IncomeExpense:ChartLabel", "Aylık gelir ve gider")
          }
        ) })
      ]
    }
  );
}
function ga({ filter: t, editMode: n }) {
  const a = Ve(t), r = a.data ?? [], l = r.some((o) => o.count > 0), c = r.reduce(
    (o, i) => i.count > ((o == null ? void 0 : o.count) ?? 0) ? i : o,
    null
  );
  return /* @__PURE__ */ e.jsxs(
    A,
    {
      editMode: n,
      title: s("Dashboard:Heatmap:Title", "Teslim yoğunluğu"),
      subtitle: s("Dashboard:Heatmap:Subtitle", "Önümüzdeki 4 hafta · hafta × gün"),
      isLoading: a.isPending,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: r.length === 0,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        B,
        {
          compact: !0,
          title: s("Dashboard:Heatmap:EmptyTitle", "Planlı teslim yok"),
          description: s("Dashboard:Heatmap:EmptyDescription", "Önümüzdeki 4 haftada son tarihi olan iş bulunmuyor.")
        }
      ),
      bodyClassName: "flex flex-col gap-3",
      children: [
        /* @__PURE__ */ e.jsx(Kt, { cells: r }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: l && c ? s(
          "Dashboard:Heatmap:Busiest",
          "En yoğun gün {0} ({1} teslim) · sarı: hibe son tarihi",
          new Date(c.date).toLocaleDateString(void 0, { day: "numeric", month: "short" }),
          c.count
        ) : s("Dashboard:Heatmap:NoneScheduled", "Bu pencerede teslim planlanmamış · sarı: hibe son tarihi") })
      ]
    }
  );
}
function ya({ editMode: t }) {
  return /* @__PURE__ */ e.jsx(
    A,
    {
      editMode: t,
      title: s("Dashboard:Phases:Title", "Proje fazları"),
      subtitle: s("Dashboard:Phases:Subtitle", "mini gantt"),
      isEmpty: !0,
      emptyState: /* @__PURE__ */ e.jsx(
        B,
        {
          compact: !0,
          title: s("Dashboard:Phases:EmptyTitle", "Faz tanımlı değil"),
          description: s("Dashboard:Phases:EmptyDescription", "Projelere faz tanımlandığında zaman çizelgesi burada görünecek."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Projects", className: "text-[12.5px] font-medium text-text-link hover:underline", children: s("Dashboard:Phases:OpenProjects", "Projeleri aç →") })
        }
      )
    }
  );
}
const Qe = [
  ["Work", "Dashboard:StatTab:Work", "İş & teslim"],
  ["Finance", "Dashboard:StatTab:Finance", "Finans"],
  ["Grants", "Dashboard:StatTab:Grants", "Hibe"],
  ["Communication", "Dashboard:StatTab:Communication", "İletişim"],
  ["System", "Dashboard:StatTab:System", "Sistem"]
];
function ja({ filter: t, editMode: n }) {
  const a = qe(t), r = a.data ?? [], [l, c] = m.useState("Work"), o = m.useMemo(
    () => Qe.filter(([u]) => r.some((h) => h.group === u)),
    [r]
  ), i = r.filter((u) => u.group === l), d = r.filter((u) => u.locked).length;
  return /* @__PURE__ */ e.jsx(
    A,
    {
      editMode: n,
      title: s("Dashboard:Statistics:Title", "İstatistikler"),
      subtitle: r.length > 0 ? s(
        "Dashboard:Statistics:Subtitle",
        "{0} istatistikten {1}'i yetkinde · {2}'si kilitli",
        r.length,
        r.length - d,
        d
      ) : void 0,
      actions: /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1.5 flex-wrap justify-end", children: o.map(([u, h, x]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => c(u),
          "aria-pressed": l === u,
          className: p(
            "inline-flex items-center h-7 px-[11px] rounded-[9px] text-[11.5px] transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:shadow-focus",
            l === u ? "bg-text-primary text-surface-base font-semibold" : "bg-surface-sunken text-text-secondary font-medium hover:text-text-primary"
          ),
          children: s(h, x)
        },
        u
      )) }),
      isLoading: a.isPending,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: r.length === 0,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      children: /* @__PURE__ */ e.jsx("div", { className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(154px, 1fr))" }, children: i.map((u) => /* @__PURE__ */ e.jsx(ka, { stat: u }, u.key)) })
    }
  );
}
function ka({ stat: t }) {
  return t.locked ? /* @__PURE__ */ e.jsxs("div", { className: "p-[12px_14px] border border-dashed border-default rounded-xl bg-surface-base flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary truncate", children: t.label }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-xl font-semibold leading-none tracking-[-0.03em] text-text-tertiary", children: "— —" }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: s("Dashboard:Stat:Locked", "yetki gerekli") }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary truncate", children: t.requiredPermission })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "p-[12px_14px] border border-subtle rounded-xl bg-surface-base flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary truncate", children: t.label }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-xl font-semibold leading-none tracking-[-0.03em] text-text-primary tabular-nums", children: t.formatted || "—" }),
    t.deltaFormatted ? /* @__PURE__ */ e.jsx(Et, { trend: t.trend, children: t.deltaFormatted }) : /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: s("Dashboard:Stat:Flat", "• sabit") }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary truncate", children: t.requiredPermission })
  ] });
}
const H = [
  { key: "project-management", labelKey: "Dashboard:View:ProjectManagement", fallback: "Proje Yönetimi" },
  { key: "finance", labelKey: "Dashboard:View:Finance", fallback: "Finans" },
  { key: "today", labelKey: "Dashboard:View:Today", fallback: "Bugün" },
  { key: "grants", labelKey: "Dashboard:View:Grants", fallback: "Hibe takibi" }
], he = "project-management", V = {
  /* h=2 (140px): kutucuk içeriği ~122px. h=3 verilince ızgara kutusu
     içerikten ~75px yüksek kalıyor ve altındaki satırla arasında ölü boşluk
     oluşuyordu. minH de 2 olmalı — aksi halde RGL yüksekliği 3'e zorlar. */
  /* `band`: kart yatay bir şerittir — dar kırılımlarda yarım genişliğe
     düşürülmez, hep tam satır kaplar (içeriği kolonlara yayılıyor). */
  "summary-strip": { component: Zt, titleKey: "Dashboard:Card:SummaryStrip", fallback: "Sayısal özet", w: 12, h: 2, minW: 6, minH: 2, band: !0 },
  deliveries: { component: ra, titleKey: "Dashboard:Deliveries:Title", fallback: "Bu ay teslim edilecekler", w: 7, h: 8, minW: 4, minH: 5 },
  "project-health": { component: da, titleKey: "Dashboard:Health:Title", fallback: "Proje sağlığı", w: 5, h: 8, minW: 3, minH: 5 },
  approvals: { component: xa, titleKey: "Dashboard:Approvals:Title", fallback: "Bende bekleyen kararlar", w: 4, h: 6, minW: 3, minH: 4 },
  blockers: { component: ha, titleKey: "Dashboard:Blockers:Title", fallback: "Tıkanan işler & risk", w: 4, h: 6, minW: 3, minH: 4 },
  "ai-suggestions": { component: ba, titleKey: "Dashboard:Ai:Title", fallback: "AI önerileri", w: 4, h: 6, minW: 3, minH: 3 },
  "income-expense": { component: fa, titleKey: "Dashboard:IncomeExpense:Title", fallback: "Gelir / gider", w: 4, h: 6, minW: 3, minH: 4 },
  "delivery-heatmap": { component: ga, titleKey: "Dashboard:Heatmap:Title", fallback: "Teslim yoğunluğu", w: 4, h: 6, minW: 3, minH: 4 },
  "project-phases": { component: ya, titleKey: "Dashboard:Phases:Title", fallback: "Proje fazları", w: 4, h: 6, minW: 3, minH: 4 },
  "statistics-band": { component: ja, titleKey: "Dashboard:Statistics:Title", fallback: "İstatistikler", w: 12, h: 6, minW: 6, minH: 4, band: !0 }
}, pe = { desktop: 920, tablet: 560, mobile: 0 }, Da = { desktop: 12, tablet: 6, mobile: 1 }, va = 64, Na = [12, 12], Xe = [0, 0];
function Sa(t) {
  return t >= pe.desktop ? "desktop" : t >= pe.tablet ? "tablet" : "mobile";
}
function wa(t) {
  return Math.max(0, t - Xe[0] * 2);
}
function Ta(t) {
  return t >= 1015 ? { template: "repeat(4, minmax(0, 2fr)) minmax(0, 3fr)", h: 2 } : t >= 694 ? { template: "repeat(3, minmax(0, 1fr))", h: 4 } : t >= 456 ? { template: "repeat(2, minmax(0, 1fr))", h: 6 } : { template: "repeat(2, minmax(0, 1fr))", h: 4, compact: !0 };
}
const Je = "apya-dashboard-view";
function Ca() {
  try {
    const t = window.localStorage.getItem(Je);
    return H.some((n) => n.key === t) ? t : he;
  } catch {
    return he;
  }
}
function Ea(t) {
  try {
    window.localStorage.setItem(Je, t);
  } catch {
  }
}
function Pa({ open: t, onOpenChange: n, presentCardKeys: a = [], onAdd: r }) {
  const [l, c] = m.useState(""), o = m.useMemo(() => {
    const i = l.trim().toLocaleLowerCase();
    return Object.entries(V).map(([d, u]) => ({ key: d, meta: u, label: s(u.titleKey, u.fallback) })).filter((d) => !i || d.label.toLocaleLowerCase().includes(i));
  }, [l]);
  return /* @__PURE__ */ e.jsx(ut, { open: t, onOpenChange: n, children: /* @__PURE__ */ e.jsx(mt, { side: "right", className: "w-[380px] mobile:w-full", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 p-5 h-full", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-base font-semibold text-text-primary", children: s("Dashboard:Catalog:Title", "Kart ekle") }),
      /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-text-tertiary", children: s("Dashboard:Catalog:Subtitle", "Eklediğin kart görünümün altına yerleşir; sürükleyip boyutlandırabilirsin.") })
    ] }),
    /* @__PURE__ */ e.jsx(
      xt,
      {
        value: l,
        onChange: (i) => c(i.target.value),
        placeholder: s("Dashboard:Catalog:Search", "Kart ara…"),
        "aria-label": s("Dashboard:Catalog:Search", "Kart ara…")
      }
    ),
    /* @__PURE__ */ e.jsxs("ul", { className: "flex flex-col gap-2 overflow-auto flex-1", children: [
      o.map(({ key: i, meta: d, label: u }) => {
        const h = a.includes(i);
        return /* @__PURE__ */ e.jsxs(
          "li",
          {
            className: p(
              "flex items-center justify-between gap-3 p-3 rounded-xl border",
              h ? "border-subtle bg-surface-sunken opacity-60" : "border-default bg-surface-base"
            ),
            children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-medium text-text-primary truncate", children: u }),
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                  d.w,
                  "×",
                  d.h
                ] })
              ] }),
              /* @__PURE__ */ e.jsx(
                O,
                {
                  size: "sm",
                  variant: h ? "ghost" : "secondary",
                  disabled: h,
                  onClick: () => r(i),
                  className: "flex-none",
                  children: h ? s("Dashboard:Catalog:Added", "Ekli") : s("Dashboard:Catalog:Add", "Ekle")
                }
              )
            ]
          },
          i
        );
      }),
      o.length === 0 && /* @__PURE__ */ e.jsx("li", { className: "text-[12.5px] text-text-tertiary py-4 text-center", children: s("Dashboard:Catalog:NoMatch", "Eşleşen kart yok.") })
    ] })
  ] }) }) });
}
const Z = (() => {
  try {
    const t = document.getElementById("apya-dashboard-layout");
    return t ? JSON.parse(t.textContent) : null;
  } catch {
    return null;
  }
})();
function Aa(t) {
  const n = (Z == null ? void 0 : Z.viewKey) === t ? Z : void 0;
  return M({
    queryKey: P.dashboard.layout(t),
    queryFn: () => ie.get(`/api/dashboard/layout?viewKey=${encodeURIComponent(t)}`),
    /* Düzen kullanıcıdan başkası değiştiremez → uzun taze kalır. */
    staleTime: 5 * 6e4,
    enabled: !!t,
    initialData: n
  });
}
function Ra() {
  const t = le();
  return Le({
    mutationFn: ({ viewKey: n, cards: a }) => ie.put("/api/dashboard/layout", { viewKey: n, cards: a }),
    onSuccess: (n, { viewKey: a }) => {
      t.invalidateQueries({ queryKey: P.dashboard.layout(a) });
    }
  });
}
function Ba() {
  const t = le();
  return Le({
    mutationFn: (n) => ie.delete(`/api/dashboard/layout?viewKey=${encodeURIComponent(n)}`),
    onSuccess: (n, a) => {
      t.invalidateQueries({ queryKey: P.dashboard.layout(a) });
    }
  });
}
function Ma() {
  try {
    const t = document.getElementById("apya-dashboard-print-context");
    if (!t) return null;
    const n = JSON.parse(t.textContent);
    return n && typeof n == "object" ? n : null;
  } catch {
    return null;
  }
}
function Ia(t, n = /* @__PURE__ */ new Date()) {
  const a = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  if (t === "Week") {
    const r = Fa(a);
    return { start: r, end: ee(r, 6) };
  }
  if (t === "Quarter") {
    const r = Math.floor(a.getMonth() / 3) * 3;
    return {
      start: new Date(a.getFullYear(), r, 1),
      end: ee(new Date(a.getFullYear(), r + 3, 1), -1)
    };
  }
  return {
    start: new Date(a.getFullYear(), a.getMonth(), 1),
    end: ee(new Date(a.getFullYear(), a.getMonth() + 1, 1), -1)
  };
}
function Ha(t, n) {
  const a = t.start.getMonth() === t.end.getMonth() && t.start.getFullYear() === t.end.getFullYear(), r = t.start.getFullYear() === t.end.getFullYear(), l = a ? { day: "numeric" } : r ? { day: "numeric", month: "long" } : { day: "numeric", month: "long", year: "numeric" };
  return `${t.start.toLocaleDateString(n, l)} – ` + t.end.toLocaleDateString(n, { day: "numeric", month: "long", year: "numeric" });
}
function La(t, n) {
  return t.toLocaleDateString(n, { day: "numeric", month: "long", year: "numeric" }) + " " + t.toLocaleTimeString(n, { hour: "2-digit", minute: "2-digit" });
}
function Fa(t) {
  return ee(t, -((t.getDay() + 6) % 7));
}
function ee(t, n) {
  const a = new Date(t);
  return a.setDate(a.getDate() + n), a;
}
const Ee = {
  Week: ["Dashboard:Range:Week", "Bu hafta"],
  Month: ["Dashboard:Range:Month", "Bu ay"],
  Quarter: ["Dashboard:Range:Quarter", "Bu çeyrek"]
}, Pe = {
  Overdue: ["Dashboard:Print:State:Overdue", "Gecikmiş"],
  InReview: ["Dashboard:Print:State:InReview", "Kontrolde"],
  OnTrack: ["Dashboard:Print:State:OnTrack", "Yolunda"],
  Upcoming: ["Dashboard:Print:State:Upcoming", "Yaklaşan"]
}, ce = { Up: "▲", Down: "▼", Flat: "•" }, Ka = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], b = "border-b border-neutral-500 pb-1 pe-3 text-start text-[7pt] font-bold uppercase tracking-wide text-neutral-600", j = "border-b border-neutral-200 py-[3px] pe-3 align-top text-[8.5pt] leading-tight", v = `${j} text-end font-mono tabular-nums whitespace-nowrap`;
function $a({ viewKey: t, range: n, onReady: a }) {
  const r = m.useMemo(() => ({ range: n }), [n]), l = We(r), c = qe(r), o = Ge(r), i = Ue(r), d = _e(), u = ze(), h = Ye(r), x = Ve(r), D = [l, c, o, i, d, u, h, x].every((N) => N.status !== "pending");
  m.useEffect(() => {
    D && (a == null || a());
  }, [D, a]);
  const k = Ie(), S = m.useMemo(() => Ma(), []), K = m.useMemo(() => La(/* @__PURE__ */ new Date(), k), [k]), W = m.useMemo(() => Ia(n), [n]), y = H.find((N) => N.key === t) ?? H.find((N) => N.key === he) ?? H[0], [G, T] = Ee[n] ?? Ee.Month, $ = {
    tenantName: S == null ? void 0 : S.tenantName,
    userName: S == null ? void 0 : S.userName,
    viewLabel: s(y.labelKey, y.fallback),
    rangeLabel: `${s(G, T)} · ${Ha(W, k)}`,
    stamp: K
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-print-root hidden print:block", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page", children: [
      /* @__PURE__ */ e.jsx(de, { ...$, part: s("Dashboard:Print:Part1", "Özet & istatistikler") }),
      /* @__PURE__ */ e.jsx(Oa, { query: l, locale: k }),
      /* @__PURE__ */ e.jsx(Wa, { query: c })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page apya-print-break", children: [
      /* @__PURE__ */ e.jsx(de, { ...$, part: s("Dashboard:Print:Part2", "İş yükü") }),
      /* @__PURE__ */ e.jsx(Ga, { query: o, locale: k }),
      /* @__PURE__ */ e.jsx(Ua, { query: i }),
      /* @__PURE__ */ e.jsx(_a, { query: u })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page apya-print-break", children: [
      /* @__PURE__ */ e.jsx(de, { ...$, part: s("Dashboard:Print:Part3", "Finans & teslim yoğunluğu") }),
      /* @__PURE__ */ e.jsx(za, { query: d, locale: k }),
      /* @__PURE__ */ e.jsx(qa, { query: h, locale: k }),
      /* @__PURE__ */ e.jsx(Ya, { query: x, locale: k })
    ] })
  ] });
}
function de({ tenantName: t, userName: n, viewLabel: a, rangeLabel: r, stamp: l, part: c }) {
  return /* @__PURE__ */ e.jsxs("header", { className: "flex items-end justify-between gap-6 border-b-2 border-black pb-2 break-after-avoid", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsx("p", { className: "text-[8pt] font-bold uppercase tracking-widest text-neutral-500", children: s("Dashboard:Print:Eyebrow", "APYA · Genel Bakış") }),
      /* @__PURE__ */ e.jsx("h1", { className: "mt-1 text-[20pt] font-semibold leading-none", children: t || s("Dashboard:Title", "Genel Bakış") }),
      /* @__PURE__ */ e.jsxs("p", { className: "mt-1.5 text-[8.5pt] text-neutral-600", children: [
        s("Dashboard:Print:Meta:Period", "Dönem"),
        ": ",
        /* @__PURE__ */ e.jsx("strong", { className: "font-semibold", children: r }),
        " · ",
        s("Dashboard:Print:Meta:View", "Görünüm"),
        ": ",
        /* @__PURE__ */ e.jsx("strong", { className: "font-semibold", children: a })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-none text-end text-[8pt] leading-snug text-neutral-500", children: [
      /* @__PURE__ */ e.jsx("p", { className: "text-[9pt] font-semibold uppercase tracking-wide text-neutral-700", children: c }),
      n && /* @__PURE__ */ e.jsxs("p", { className: "mt-1", children: [
        s("Dashboard:Print:Meta:By", "Yazdıran"),
        ": ",
        n
      ] }),
      /* @__PURE__ */ e.jsx("p", { children: s("Dashboard:Print:Meta:At", "{0} tarihinde oluşturuldu", l) }),
      /* @__PURE__ */ e.jsx("p", { children: s("Dashboard:Print:Meta:Scope", "Liste ve istatistikler kırpılmadan basılır") })
    ] })
  ] });
}
function F({ title: t, meta: n, query: a, isEmpty: r, emptyText: l, children: c }) {
  return /* @__PURE__ */ e.jsxs("section", { className: "mt-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between gap-3 border-b border-black pb-1 break-after-avoid", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[10pt] font-bold uppercase tracking-wide", children: t }),
      n && /* @__PURE__ */ e.jsx("span", { className: "text-[8pt] text-neutral-600", children: n })
    ] }),
    a != null && a.isError ? /* @__PURE__ */ e.jsx(Ae, { children: s("Dashboard:Print:SectionError", "Veri alınamadı.") }) : r ? /* @__PURE__ */ e.jsx(Ae, { children: l }) : /* @__PURE__ */ e.jsx("div", { className: "mt-1.5", children: c })
  ] });
}
function Ae({ children: t }) {
  return /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[8.5pt] italic text-neutral-500", children: t });
}
function Oa({ query: t, locale: n }) {
  const a = t.data;
  return /* @__PURE__ */ e.jsx(
    F,
    {
      title: s("Dashboard:Card:SummaryStrip", "Sayısal özet"),
      query: t,
      isEmpty: !a,
      emptyText: s("Dashboard:Summary:Error", "Özet yüklenemedi."),
      children: a && /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-5 border-s border-t border-neutral-400 break-inside-avoid", children: [
        /* @__PURE__ */ e.jsx(
          Y,
          {
            label: s("Dashboard:Summary:DueThisPeriod", "Bu dönem teslim"),
            value: a.dueThisPeriod,
            note: s("Dashboard:Summary:DueThisWeek", "{0} bu hafta", a.dueThisWeek)
          }
        ),
        /* @__PURE__ */ e.jsx(
          Y,
          {
            label: s("Dashboard:Summary:Overdue", "Gecikmiş"),
            value: a.overdue,
            note: [
              a.oldestOverdueDays != null ? s("Dashboard:Summary:OldestOverdue", "en eski {0} g", a.oldestOverdueDays) : null,
              s("Dashboard:Summary:OverdueProjects", "{0} projede", a.overdueProjectCount)
            ].filter(Boolean).join(" · ")
          }
        ),
        /* @__PURE__ */ e.jsx(
          Y,
          {
            label: s("Dashboard:Summary:Blocked", "Tıkanan iş"),
            value: a.blocked,
            note: s("Dashboard:Summary:BlockedAvg", "ort. {0} g", Be(a.blockedAvgIdleDays, 1))
          }
        ),
        /* @__PURE__ */ e.jsx(
          Y,
          {
            label: s("Dashboard:Summary:PendingApprovals", "Bende onay"),
            value: a.pendingApprovals,
            locked: a.pendingApprovals == null,
            permission: "Platform.Invoices",
            note: [
              a.pendingApprovalAmount != null ? E(a.pendingApprovalAmount, a.currency, n) : null,
              a.pendingApprovalAvgAgeHours != null ? s("Dashboard:Summary:AvgWait", "ortalama bekleme {0} sa", Be(a.pendingApprovalAvgAgeHours, 0)) : null
            ].filter(Boolean).join(" · ")
          }
        ),
        /* @__PURE__ */ e.jsx(
          Y,
          {
            label: s("Dashboard:Summary:BudgetUsage", "Bütçe kullanımı"),
            value: a.budgetUsedRatio != null ? `%${Math.round(a.budgetUsedRatio * 100)}` : null,
            locked: a.budgetUsedRatio == null && a.budgetTotal == null,
            permission: "Platform.Projects.ViewBudget",
            note: a.budgetTotal != null ? `${E(a.budgetSpent, a.currency, n)} / ${E(a.budgetTotal, a.currency, n)}` : null
          }
        )
      ] })
    }
  );
}
function Y({ label: t, value: n, note: a, locked: r, permission: l }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "border-b border-e border-neutral-400 p-2", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[8pt] font-medium text-neutral-600", children: t }),
    /* @__PURE__ */ e.jsx("p", { className: "mt-1 font-mono text-[17pt] font-semibold leading-none tabular-nums", children: r ? "— —" : n ?? "—" }),
    r ? /* @__PURE__ */ e.jsxs("p", { className: "mt-1 text-[7.5pt] text-neutral-500", children: [
      s("Dashboard:Stat:Locked", "yetki gerekli"),
      " · ",
      /* @__PURE__ */ e.jsx("span", { className: "font-mono", children: l })
    ] }) : a && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[7.5pt] text-neutral-500", children: a })
  ] });
}
function Wa({ query: t }) {
  const n = t.data ?? [], a = n.filter((r) => r.locked).length;
  return /* @__PURE__ */ e.jsx(
    F,
    {
      title: s("Dashboard:Statistics:Title", "İstatistikler"),
      meta: n.length > 0 ? s(
        "Dashboard:Statistics:Subtitle",
        "{0} istatistikten {1}'i yetkinde · {2}'si kilitli",
        n.length,
        n.length - a,
        a
      ) : null,
      query: t,
      isEmpty: n.length === 0,
      emptyText: s("Dashboard:Print:Statistics:Empty", "Bu dönem için istatistik üretilmedi."),
      children: /* @__PURE__ */ e.jsx("div", { className: "columns-2 gap-6", children: Qe.map(([r, l, c]) => {
        const o = n.filter((i) => i.group === r);
        return o.length === 0 ? null : /* @__PURE__ */ e.jsxs("div", { className: "mb-3 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[8.5pt] font-bold uppercase tracking-wide", children: s(l, c) }),
          /* @__PURE__ */ e.jsxs("table", { className: "mt-1 w-full border-collapse", children: [
            /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
              /* @__PURE__ */ e.jsx("th", { className: b, children: s("Dashboard:Print:Col:Stat", "İstatistik") }),
              /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: s("Dashboard:Print:Col:Value", "Değer") }),
              /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: s("Dashboard:Print:Col:Delta", "Değişim") })
            ] }) }),
            /* @__PURE__ */ e.jsx("tbody", { children: o.map((i) => /* @__PURE__ */ e.jsxs("tr", { children: [
              /* @__PURE__ */ e.jsxs("td", { className: j, children: [
                i.label,
                /* @__PURE__ */ e.jsx("span", { className: "block font-mono text-[6.5pt] text-neutral-400", children: i.requiredPermission })
              ] }),
              /* @__PURE__ */ e.jsx("td", { className: v, children: i.locked ? "— —" : i.formatted || "—" }),
              /* @__PURE__ */ e.jsx("td", { className: v, children: i.locked ? s("Dashboard:Stat:Locked", "yetki gerekli") : i.deltaFormatted ? `${ce[i.trend] ?? ce.Flat} ${i.deltaFormatted}` : ce.Flat })
            ] }, i.key)) })
          ] })
        ] }, r);
      }) })
    }
  );
}
function Ga({ query: t, locale: n }) {
  const a = t.data ?? [], r = a.filter((l) => l.state === "Overdue").length;
  return /* @__PURE__ */ e.jsx(
    F,
    {
      title: s("Dashboard:Deliveries:Title", "Bu ay teslim edilecekler"),
      meta: a.length > 0 ? s("Dashboard:Deliveries:Subtitle", "{0} iş · {1} gecikmiş", a.length, r) : null,
      query: t,
      isEmpty: a.length === 0,
      emptyText: s("Dashboard:Deliveries:EmptyDescription", "Son tarihi bu döneme düşen açık iş bulunmuyor."),
      children: me.map((l) => {
        const c = a.filter((d) => d.groupKey === l);
        if (c.length === 0) return null;
        const [o, i] = xe[l];
        return /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "text-[8.5pt] font-bold uppercase tracking-wide break-after-avoid", children: [
            s(o, i),
            " · ",
            c.length
          ] }),
          /* @__PURE__ */ e.jsxs("table", { className: "mt-1 w-full border-collapse", children: [
            /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
              /* @__PURE__ */ e.jsx("th", { className: `${b} w-[14px]`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("th", { className: b, children: s("Dashboard:Print:Col:Task", "İş") }),
              /* @__PURE__ */ e.jsx("th", { className: b, children: s("Dashboard:Print:Col:Project", "Proje") }),
              /* @__PURE__ */ e.jsx("th", { className: b, children: s("Dashboard:Print:Col:Assignee", "Sorumlu") }),
              /* @__PURE__ */ e.jsx("th", { className: b, children: s("Dashboard:Print:Col:State", "Durum") }),
              /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: s("Dashboard:Print:Col:Due", "Son tarih") })
            ] }) }),
            /* @__PURE__ */ e.jsx("tbody", { children: c.map((d) => {
              const [u, h] = Pe[d.state] ?? Pe.Upcoming;
              return /* @__PURE__ */ e.jsxs("tr", { children: [
                /* @__PURE__ */ e.jsx("td", { className: j, children: /* @__PURE__ */ e.jsx(ye, {}) }),
                /* @__PURE__ */ e.jsx("td", { className: `${j} ${d.state === "Overdue" ? "font-semibold" : ""}`, children: d.title }),
                /* @__PURE__ */ e.jsx("td", { className: j, children: d.projectName || "—" }),
                /* @__PURE__ */ e.jsx("td", { className: j, children: d.assigneeName || "—" }),
                /* @__PURE__ */ e.jsxs("td", { className: j, children: [
                  s(u, h),
                  d.state === "Overdue" && d.overdueDays != null && ` · ${s("Dashboard:Deliveries:OverdueDays", "{0} gün gecikmiş", d.overdueDays)}`
                ] }),
                /* @__PURE__ */ e.jsx("td", { className: v, children: be(d.dueDate, n) })
              ] }, d.taskId);
            }) })
          ] })
        ] }, l);
      })
    }
  );
}
function ye() {
  return /* @__PURE__ */ e.jsx("span", { className: "mt-[2px] block h-[9px] w-[9px] border border-neutral-600", "aria-hidden": "true" });
}
function Ua({ query: t }) {
  const n = t.data ?? [];
  return /* @__PURE__ */ e.jsx(
    F,
    {
      title: s("Dashboard:Health:Title", "Proje sağlığı"),
      meta: n.length > 0 ? s("Dashboard:Health:Subtitle", "{0} aktif proje", n.length) : null,
      query: t,
      isEmpty: n.length === 0,
      emptyText: s("Dashboard:Health:EmptyDescription", "Proje oluşturunca sağlık göstergeleri burada belirir."),
      children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse", children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { className: b, children: s("Dashboard:Print:Col:Project", "Proje") }),
          /* @__PURE__ */ e.jsx("th", { className: b, children: s("Dashboard:Print:Col:State", "Durum") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: s("Dashboard:Print:Col:DaysLeft", "Kalan gün") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: s("Dashboard:Print:Col:Budget", "Bütçe") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: s("Dashboard:Print:Col:Time", "Süre") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: s("Dashboard:Print:Col:Tasks", "Görev") })
        ] }) }),
        /* @__PURE__ */ e.jsx("tbody", { children: n.map((a) => {
          const [, r, l] = se[a.state] ?? se.Healthy;
          return /* @__PURE__ */ e.jsxs("tr", { children: [
            /* @__PURE__ */ e.jsx("td", { className: j, children: a.name }),
            /* @__PURE__ */ e.jsx("td", { className: `${j} ${a.state === "Risky" ? "font-semibold" : ""}`, children: s(r, l) }),
            /* @__PURE__ */ e.jsx("td", { className: v, children: a.daysRemaining ?? "—" }),
            /* @__PURE__ */ e.jsx("td", { className: v, children: Re(a.budgetRatio) }),
            /* @__PURE__ */ e.jsx("td", { className: v, children: Re(a.timeRatio) }),
            /* @__PURE__ */ e.jsxs("td", { className: v, children: [
              a.tasksDone,
              "/",
              a.tasksTotal
            ] })
          ] }, a.projectId);
        }) })
      ] })
    }
  );
}
function _a({ query: t }) {
  const n = t.data ?? [];
  return /* @__PURE__ */ e.jsx(
    F,
    {
      title: s("Dashboard:Blockers:Title", "Tıkanan işler & risk"),
      meta: n.length > 0 ? s("Dashboard:Print:Count", "{0} kayıt", n.length) : null,
      query: t,
      isEmpty: n.length === 0,
      emptyText: s("Dashboard:Blockers:EmptyDescription", "Açık işlerin hepsi son günlerde hareket görmüş."),
      children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse", children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { className: `${b} w-[14px]`, "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("th", { className: b, children: s("Dashboard:Print:Col:Code", "Kod") }),
          /* @__PURE__ */ e.jsx("th", { className: b, children: s("Dashboard:Print:Col:Task", "İş") }),
          /* @__PURE__ */ e.jsx("th", { className: b, children: s("Dashboard:Print:Col:Reason", "Sebep") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: s("Dashboard:Print:Col:Idle", "Hareketsiz") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: s("Dashboard:Print:Col:Dependents", "Bağımlı") })
        ] }) }),
        /* @__PURE__ */ e.jsx("tbody", { children: n.map((a) => {
          const [, r, l] = re[a.blockReason] ?? re.Dependency;
          return /* @__PURE__ */ e.jsxs("tr", { children: [
            /* @__PURE__ */ e.jsx("td", { className: j, children: /* @__PURE__ */ e.jsx(ye, {}) }),
            /* @__PURE__ */ e.jsx("td", { className: `${j} font-mono`, children: a.code }),
            /* @__PURE__ */ e.jsx("td", { className: j, children: a.title }),
            /* @__PURE__ */ e.jsx("td", { className: j, children: s(r, l) }),
            /* @__PURE__ */ e.jsx("td", { className: v, children: s("Dashboard:Health:DaysLeft", "{0} gün", a.idleDays) }),
            /* @__PURE__ */ e.jsx("td", { className: v, children: a.dependentCount })
          ] }, a.taskId);
        }) })
      ] })
    }
  );
}
function za({ query: t, locale: n }) {
  var o;
  const a = t.data ?? [], r = a.reduce((i, d) => i + (d.amount ?? 0), 0), l = a.length ? Math.round(a.reduce((i, d) => i + d.ageHours, 0) / a.length) : 0, c = ((o = a[0]) == null ? void 0 : o.currency) ?? "TRY";
  return /* @__PURE__ */ e.jsx(
    F,
    {
      title: s("Dashboard:Approvals:Title", "Bende bekleyen kararlar"),
      meta: a.length > 0 ? s("Dashboard:Approvals:Total", "Toplam {0} · ort. bekleme {1} sa", E(r, c, n), l) : null,
      query: t,
      isEmpty: a.length === 0,
      emptyText: s("Dashboard:Approvals:EmptyDescription", "Taslak durumdaki fatura bulunmuyor."),
      children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse", children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { className: `${b} w-[14px]`, "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("th", { className: b, children: s("Dashboard:Print:Col:Record", "Kayıt") }),
          /* @__PURE__ */ e.jsx("th", { className: b, children: s("Dashboard:Print:Col:Requester", "Talep eden") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: s("Dashboard:Print:Col:Age", "Bekleme") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: s("Dashboard:Print:Col:Amount", "Tutar") })
        ] }) }),
        /* @__PURE__ */ e.jsx("tbody", { children: a.map((i) => /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("td", { className: j, children: /* @__PURE__ */ e.jsx(ye, {}) }),
          /* @__PURE__ */ e.jsx("td", { className: j, children: i.title }),
          /* @__PURE__ */ e.jsx("td", { className: j, children: i.requesterName || "—" }),
          /* @__PURE__ */ e.jsxs("td", { className: v, children: [
            i.ageHours,
            " sa"
          ] }),
          /* @__PURE__ */ e.jsx("td", { className: v, children: E(i.amount, i.currency, n) })
        ] }, i.id)) })
      ] })
    }
  );
}
function qa({ query: t, locale: n }) {
  const a = t.data, r = (a == null ? void 0 : a.points) ?? [], l = (a == null ? void 0 : a.currency) ?? "TRY", c = r.some((o) => o.income > 0 || o.expense > 0);
  return /* @__PURE__ */ e.jsx(
    F,
    {
      title: s("Dashboard:IncomeExpense:Title", "Gelir / gider"),
      meta: s("Dashboard:IncomeExpense:Subtitle", "Son 6 ay"),
      query: t,
      isEmpty: !c,
      emptyText: s("Dashboard:IncomeExpense:EmptyDescription", "Son 6 ayda gelir veya gider kaydı bulunmuyor."),
      children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse break-inside-avoid", children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { className: b, children: s("Dashboard:Print:Col:Month", "Ay") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: s("Dashboard:IncomeExpense:Income", "Gelir") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: s("Dashboard:IncomeExpense:Expense", "Gider") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: s("Dashboard:IncomeExpense:Net", "net") })
        ] }) }),
        /* @__PURE__ */ e.jsxs("tbody", { children: [
          r.map((o) => /* @__PURE__ */ e.jsxs("tr", { children: [
            /* @__PURE__ */ e.jsx("td", { className: j, children: Va(o.month, n) }),
            /* @__PURE__ */ e.jsx("td", { className: v, children: E(o.income, l, n) }),
            /* @__PURE__ */ e.jsx("td", { className: v, children: E(o.expense, l, n) }),
            /* @__PURE__ */ e.jsx("td", { className: v, children: E(o.income - o.expense, l, n) })
          ] }, o.month)),
          /* @__PURE__ */ e.jsxs("tr", { children: [
            /* @__PURE__ */ e.jsx("td", { className: `${j} font-semibold`, colSpan: 3, children: s("Dashboard:Print:PeriodNet", "Dönem neti") }),
            /* @__PURE__ */ e.jsx("td", { className: `${v} font-semibold`, children: E((a == null ? void 0 : a.net) ?? 0, l, n) })
          ] })
        ] })
      ] })
    }
  );
}
function Ya({ query: t, locale: n }) {
  const a = t.data ?? [], r = [];
  for (let c = 0; c < a.length; c += 7) r.push(a.slice(c, c + 7));
  const l = a.reduce((c, o) => o.count > ((c == null ? void 0 : c.count) ?? 0) ? o : c, null);
  return /* @__PURE__ */ e.jsxs(
    F,
    {
      title: s("Dashboard:Heatmap:Title", "Teslim yoğunluğu"),
      meta: s("Dashboard:Heatmap:Subtitle", "Önümüzdeki 4 hafta · hafta × gün"),
      query: t,
      isEmpty: a.length === 0,
      emptyText: s("Dashboard:Heatmap:EmptyDescription", "Önümüzdeki 4 haftada son tarihi olan iş bulunmuyor."),
      children: [
        /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse break-inside-avoid", children: [
          /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { children: Ka.map((c) => /* @__PURE__ */ e.jsx("th", { className: `${b} text-center`, children: c }, c)) }) }),
          /* @__PURE__ */ e.jsx("tbody", { children: r.map((c) => /* @__PURE__ */ e.jsx("tr", { children: c.map((o) => /* @__PURE__ */ e.jsxs("td", { className: `${j} text-center`, children: [
            /* @__PURE__ */ e.jsxs("span", { className: "block font-mono text-[7pt] text-neutral-500", children: [
              be(o.date, n),
              o.isGrantDeadline ? " ✱" : ""
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: `block font-mono tabular-nums ${o.count > 0 ? "font-semibold" : "text-neutral-400"}`, children: o.count })
          ] }, o.date)) }, c[0].date)) })
        ] }),
        /* @__PURE__ */ e.jsxs("p", { className: "mt-1 text-[7.5pt] text-neutral-500", children: [
          l && l.count > 0 ? s(
            "Dashboard:Heatmap:Busiest",
            "En yoğun gün {0} ({1} teslim) · sarı: hibe son tarihi",
            be(l.date, n),
            l.count
          ) : s("Dashboard:Heatmap:NoneScheduled", "Bu pencerede teslim planlanmamış · sarı: hibe son tarihi"),
          " · ",
          s("Dashboard:Print:GrantMark", "✱ hibe son tarihi")
        ] })
      ]
    }
  );
}
function be(t, n) {
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? "—" : a.toLocaleDateString(n, { day: "numeric", month: "short" });
}
function Va(t, n) {
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? "—" : a.toLocaleDateString(n, { month: "long", year: "numeric" });
}
function Re(t) {
  return t == null ? "—" : `%${Math.round(t * 100)}`;
}
function Be(t, n) {
  return typeof t != "number" || !Number.isFinite(t) ? "—" : n > 0 ? Number(t.toFixed(n)) : Math.round(t);
}
const Ze = [
  ["Month", "Dashboard:Range:Month", "Bu ay"],
  ["Week", "Dashboard:Range:Week", "Bu hafta"],
  ["Quarter", "Dashboard:Range:Quarter", "Bu çeyrek"]
];
function Qa() {
  var ve, Ne;
  const [t, n] = m.useState(() => Ca()), [a, r] = m.useState(() => nn()), [l, c] = m.useState(!1), [o, i] = m.useState(!1), [d, u] = m.useState(null), [h, x] = m.useState("idle"), D = m.useRef(!1), k = Aa(t), S = Ra(), K = Ba(), W = m.useMemo(() => ({ range: a }), [a]), y = d ?? ((ve = k.data) == null ? void 0 : ve.cards) ?? [], G = m.useRef(null), [T, $] = m.useState(null);
  m.useLayoutEffect(() => {
    const f = G.current;
    if (!f) return;
    const w = () => $(f.clientWidth);
    w();
    const C = new ResizeObserver(w);
    return C.observe(f), () => C.disconnect();
  }, []);
  const N = T == null ? null : Sa(T), R = m.useMemo(
    () => Ta(T == null ? 0 : wa(T)),
    [T]
  ), at = m.useMemo(
    () => ({ desktop: y.map((f) => an(f, R.h)) }),
    [y, R.h]
  ), je = m.useCallback(() => {
    if (h === "ready") {
      window.print();
      return;
    }
    x((f) => f === "idle" ? "preparing" : f);
  }, [h]), nt = m.useCallback(() => {
    D.current || (D.current = !0, x("ready"), window.requestAnimationFrame(() => window.print()));
  }, []), ke = m.useCallback((f) => {
    n(f), Ea(f), u(null), c(!1);
  }, []), st = m.useCallback((f) => {
    l && N === "desktop" && u((w) => {
      const C = w ?? y;
      return f.map((I) => {
        const q = C.find((X) => X.cardKey === I.i);
        return {
          cardKey: I.i,
          /* Enum SAYI olarak gidip gelir; string göndermek
             deserialization hatası verir (JsonStringEnumConverter yok). */
          chartType: (q == null ? void 0 : q.chartType) ?? we,
          x: I.x,
          y: I.y,
          w: I.w,
          h: I.h
        };
      });
    });
  }, [l, y, N]), De = N === "desktop", rt = m.useCallback(() => {
    S.mutate(
      { viewKey: t, cards: d ?? y },
      { onSuccess: () => {
        u(null), c(!1);
      } }
    );
  }, [S, t, d, y]), lt = m.useCallback(() => {
    K.mutate(t, {
      onSuccess: () => {
        u(null), c(!1);
      }
    });
  }, [K, t]), it = m.useCallback((f) => {
    const w = V[f];
    if (!w) return;
    const C = d ?? y, I = C.reduce((q, X) => Math.max(q, X.y + X.h), 0);
    u([
      ...C,
      { cardKey: f, chartType: we, x: 0, y: I, w: w.w, h: w.h }
    ]), i(!1), c(!0);
  }, [d, y]), ot = m.useCallback((f) => {
    u((d ?? y).filter((C) => C.cardKey !== f));
  }, [d, y]), ct = /* @__PURE__ */ e.jsxs("div", { className: "hidden mobile:grid grid-cols-2 gap-2", style: { gridColumn: "1 / -1" }, children: [
    /* @__PURE__ */ e.jsx(Za, { value: t, onChange: ke, className: "w-full" }),
    /* @__PURE__ */ e.jsx(tt, { value: a, onChange: r, className: "w-full" }),
    /* @__PURE__ */ e.jsx(et, { onPrint: je, printState: h, className: "w-full", style: { gridColumn: "1 / -1" } })
  ] });
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-app-bg", children: [
    /* @__PURE__ */ e.jsx(
      Ja,
      {
        viewKey: t,
        onViewChange: ke,
        range: a,
        onRangeChange: r,
        editMode: l,
        canEdit: De,
        onToggleEdit: () => c((f) => !f),
        onOpenCatalog: () => i(!0),
        onPrint: je,
        printState: h
      }
    ),
    l && /* @__PURE__ */ e.jsx(
      en,
      {
        onSave: rt,
        isSaving: S.isPending
      }
    ),
    /* @__PURE__ */ e.jsxs("main", { className: "px-[18px] pt-4 pb-[18px] mobile:px-3 mobile:pt-3", children: [
      /* @__PURE__ */ e.jsx("div", { ref: G, children: T != null && (N === "desktop" ? /* @__PURE__ */ e.jsx(
        Dt.Responsive,
        {
          width: T,
          className: p("apya-dashboard-grid", l && "apya-dashboard-grid--edit"),
          layouts: at,
          breakpoints: pe,
          cols: Da,
          rowHeight: va,
          margin: Na,
          containerPadding: Xe,
          isDraggable: l,
          isResizable: l,
          draggableHandle: `.${A.DRAG_HANDLE_CLASS}`,
          onLayoutChange: st,
          compactType: "vertical",
          preventCollision: !1,
          children: y.map((f) => {
            const w = V[f.cardKey];
            if (!w) return /* @__PURE__ */ e.jsx("div", {}, f.cardKey);
            const C = w.component;
            return /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ e.jsx(
                C,
                {
                  filter: W,
                  editMode: l,
                  ...f.cardKey === "summary-strip" ? { template: R.template, compact: R.compact } : null
                }
              ),
              l && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => ot(f.cardKey),
                  "aria-label": s("Dashboard:RemoveCard", "Kartı kaldır"),
                  className: p(
                    "absolute top-2 right-2 z-10 w-6 h-6 rounded-lg",
                    "bg-surface-base border border-default text-text-secondary",
                    "hover:text-negative-500 hover:border-strong",
                    "focus-visible:outline-none focus-visible:shadow-focus"
                  ),
                  children: "×"
                }
              )
            ] }, f.cardKey);
          })
        }
      ) : /* @__PURE__ */ e.jsx(
        Xa,
        {
          tier: N,
          cards: y,
          filter: W,
          strip: R,
          filters: ct
        }
      )) }),
      /* @__PURE__ */ e.jsx(
        tn,
        {
          isDefault: ((Ne = k.data) == null ? void 0 : Ne.isDefault) !== !1,
          canEdit: De,
          onReset: lt,
          onOpenCatalog: () => i(!0),
          isResetting: K.isPending
        }
      )
    ] }),
    h !== "idle" && /* @__PURE__ */ e.jsx($a, { viewKey: t, range: a, onReady: nt }),
    /* @__PURE__ */ e.jsx(
      Pa,
      {
        open: o,
        onOpenChange: i,
        presentCardKeys: y.map((f) => f.cardKey),
        onAdd: it
      }
    )
  ] });
}
function Xa({ tier: t, cards: n, filter: a, strip: r, filters: l }) {
  const c = t === "tablet" ? 2 : 1, o = n.findIndex((i) => i.cardKey === "summary-strip");
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: p("grid items-stretch", t === "tablet" ? "gap-3.5" : "gap-3"),
      style: { gridTemplateColumns: `repeat(${c}, minmax(0, 1fr))` },
      children: [
        o < 0 && l,
        n.map((i, d) => {
          const u = V[i.cardKey];
          if (!u) return null;
          const h = u.component, x = c > 1 && u.band;
          return /* @__PURE__ */ e.jsxs(fe.Fragment, { children: [
            /* @__PURE__ */ e.jsx("div", { style: x ? { gridColumn: "1 / -1" } : void 0, children: /* @__PURE__ */ e.jsx(
              h,
              {
                filter: a,
                editMode: !1,
                ...i.cardKey === "summary-strip" ? { template: r.template, compact: r.compact } : null
              }
            ) }),
            d === o && l
          ] }, i.cardKey);
        })
      ]
    }
  );
}
function Ja({
  viewKey: t,
  onViewChange: n,
  range: a,
  onRangeChange: r,
  editMode: l,
  canEdit: c,
  onToggleEdit: o,
  onOpenCatalog: i,
  onPrint: d,
  printState: u
}) {
  const h = H.find((x) => x.key === t) ?? H[0];
  return /* @__PURE__ */ e.jsxs("header", { className: "px-[18px] pt-4 pb-3 bg-surface-base border-b border-default flex items-end justify-between gap-5 mobile:hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("h1", { className: "text-[22px] font-semibold tracking-[-0.025em] text-text-primary m-0", children: s("Dashboard:Title", "Genel Bakış") }),
        /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center h-[22px] px-[9px] rounded-full bg-accent-soft text-accent-600 text-[11.5px] font-semibold flex-none", children: s(h.labelKey, h.fallback) })
      ] }),
      /* @__PURE__ */ e.jsx("nav", { className: "flex items-center gap-1 flex-wrap", "aria-label": s("Dashboard:Views", "Görünümler"), children: H.map((x) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => n(x.key),
          "aria-current": x.key === t ? "page" : void 0,
          className: p(
            "inline-flex items-center h-[30px] px-3 rounded-[9px] text-[12.5px] transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:shadow-focus",
            x.key === t ? "bg-text-primary text-surface-base font-semibold" : "text-text-secondary font-medium hover:bg-surface-sunken hover:text-text-primary"
          ),
          children: s(x.labelKey, x.fallback)
        },
        x.key
      )) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      /* @__PURE__ */ e.jsx(tt, { value: a, onChange: r }),
      /* @__PURE__ */ e.jsx(et, { onPrint: d, printState: u }),
      c && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(O, { size: "sm", variant: "secondary", onClick: i, children: s("Dashboard:AddCard", "+ Kart ekle") }),
        /* @__PURE__ */ e.jsx(O, { size: "sm", variant: "primary", onClick: o, children: l ? s("Common:Done", "Bitir") : s("Common:Edit", "Düzenle") })
      ] })
    ] })
  ] });
}
function et({ onPrint: t, printState: n, className: a, style: r }) {
  return /* @__PURE__ */ e.jsx(
    O,
    {
      size: "sm",
      variant: "secondary",
      onClick: t,
      disabled: n === "preparing",
      title: s("Dashboard:Print:Hint", "A4 yatay · tüm bölümler, kırpılmadan"),
      className: a,
      style: r,
      children: n === "preparing" ? s("Dashboard:Print:Preparing", "Hazırlanıyor…") : s("Dashboard:Print:Action", "Yazdır")
    }
  );
}
function Za({ value: t, onChange: n, className: a }) {
  return /* @__PURE__ */ e.jsxs("label", { className: p("hidden mobile:inline-flex items-center flex-1 min-w-0", a), children: [
    /* @__PURE__ */ e.jsx("span", { className: "sr-only", children: s("Dashboard:SelectView", "Görünüm seç") }),
    /* @__PURE__ */ e.jsx(
      "select",
      {
        value: t,
        onChange: (r) => n(r.target.value),
        className: p(
          "h-8 w-full px-3 rounded-[9px] text-[12.5px] font-medium",
          "bg-surface-sunken text-text-secondary border-0",
          /* Mobilde kutu, başlık şeridinin beyazı yerine gri sayfa
             zemininin üstünde duruyor; sunken (#F3F4F6) o zeminle
             (#F5F5F5) neredeyse aynı → kartlarla aynı beyaz+çerçeve. */
          "mobile:bg-surface-base mobile:border mobile:border-default",
          "focus-visible:outline-none focus-visible:shadow-focus"
        ),
        children: H.map((r) => /* @__PURE__ */ e.jsx("option", { value: r.key, children: s(r.labelKey, r.fallback) }, r.key))
      }
    )
  ] });
}
function tt({ value: t, onChange: n, className: a }) {
  return /* @__PURE__ */ e.jsxs("label", { className: p("inline-flex items-center", a), children: [
    /* @__PURE__ */ e.jsx("span", { className: "sr-only", children: s("Dashboard:SelectRange", "Zaman aralığı seç") }),
    /* @__PURE__ */ e.jsx(
      "select",
      {
        value: t,
        onChange: (r) => {
          n(r.target.value), sn(r.target.value);
        },
        className: p(
          "h-8 w-full px-3 rounded-[9px] text-[12.5px] font-medium",
          "bg-surface-sunken text-text-secondary border-0",
          /* Mobilde kutu, başlık şeridinin beyazı yerine gri sayfa
             zemininin üstünde duruyor; sunken (#F3F4F6) o zeminle
             (#F5F5F5) neredeyse aynı → kartlarla aynı beyaz+çerçeve. */
          "mobile:bg-surface-base mobile:border mobile:border-default",
          "focus-visible:outline-none focus-visible:shadow-focus"
        ),
        children: Ze.map(([r, l, c]) => /* @__PURE__ */ e.jsx("option", { value: r, children: s(l, c) }, r))
      }
    )
  ] });
}
function en({ onSave: t, isSaving: n }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-6 py-2.5 bg-accent-soft border-b border-default mobile:px-3 mobile:flex-wrap", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center h-[26px] px-2.5 rounded-lg bg-accent text-white text-[11.5px] font-semibold", children: s("Dashboard:EditMode", "Düzenleme modu") }),
      /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center h-[26px] px-2.5 rounded-lg bg-surface-base border border-default text-accent-600 text-[11.5px]", children: s("Dashboard:EditMode:Snap", "Yapış: 12 kolon · 64px satır") })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] text-accent-600 mobile:hidden", children: s("Dashboard:EditMode:Hint", "Kartı başlıktaki ⠿ tutamağından sürükle") }),
      /* @__PURE__ */ e.jsx(O, { size: "sm", variant: "primary", onClick: t, disabled: n, children: s("Dashboard:EditMode:Save", "Düzeni kaydet") })
    ] })
  ] });
}
function tn({ isDefault: t, canEdit: n, onReset: a, onOpenCatalog: r, isResetting: l }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 mt-3 px-4 py-3 rounded-card border border-dashed border-default bg-surface-base mobile:flex-col mobile:items-stretch", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-secondary", children: t ? s("Dashboard:Footer:DefaultLayout", "Bu görünüm rol varsayılanından geldi — kart ekleyip çıkarabilir, sürükleyip boyutlandırabilirsin.") : s("Dashboard:Footer:CustomLayout", "Bu görünümü sen düzenledin. Dilediğin an varsayılana dönebilirsin.") }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      !t && /* @__PURE__ */ e.jsx(O, { size: "sm", variant: "secondary", onClick: a, disabled: l, children: s("Dashboard:Footer:Reset", "Varsayılana dön") }),
      n && /* @__PURE__ */ e.jsx(O, { size: "sm", variant: "primary", onClick: r, children: s("Dashboard:AddCard", "+ Kart ekle") })
    ] })
  ] });
}
function an(t, n) {
  const a = V[t.cardKey], r = t.cardKey === "summary-strip";
  return {
    i: t.cardKey,
    x: t.x,
    y: t.y,
    w: t.w,
    h: r ? n : t.h,
    minW: (a == null ? void 0 : a.minW) ?? 2,
    minH: r ? n : (a == null ? void 0 : a.minH) ?? 2
  };
}
function nn() {
  try {
    const t = new URLSearchParams(window.location.search).get("range");
    return Ze.some(([n]) => n === t) ? t : "Month";
  } catch {
    return "Month";
  }
}
function sn(t) {
  try {
    const n = new URLSearchParams(window.location.search);
    n.set("range", t), window.history.replaceState(null, "", `${window.location.pathname}?${n}`);
  } catch {
  }
}
function rn(t) {
  const { connection: n, state: a } = Ke(), r = le();
  m.useEffect(() => {
    if (!n || !(t != null && t.length)) return;
    const l = t.map(([c, o]) => {
      const i = () => {
        o.forEach((d) => {
          r.invalidateQueries({ queryKey: d });
        });
      };
      return n.on(c, i), [c, i];
    });
    return () => {
      l.forEach(([c, o]) => {
        n.off(c, o);
      });
    };
  }, [n, a, r]);
}
function ln(t) {
  const { connection: n, state: a } = Ke(), r = le(), l = yt();
  m.useEffect(() => {
    if (!n || !(t != null && t.length)) return;
    const c = t.map(([o, i]) => {
      const d = (u) => {
        var h;
        (h = i.queryKeys) == null || h.forEach(
          (x) => r.invalidateQueries({ queryKey: x })
        ), l.warning(i.message ?? "Bu kayıtta çakışma oldu", {
          description: i.description ?? (u == null ? void 0 : u.message),
          action: {
            label: "Yenile",
            onClick: () => {
              var x;
              (x = i.queryKeys) == null || x.forEach(
                (D) => r.invalidateQueries({ queryKey: D })
              );
            }
          }
        });
      };
      return n.on(o, d), [o, d];
    });
    return () => {
      c.forEach(([o, i]) => n.off(o, i));
    };
  }, [n, a, r]);
}
const g = (t) => ["dashboard", t];
function on() {
  const t = m.useMemo(() => [
    /* Görev durumu değişti → teslimler, tıkananlar, özet, ısı takvimi, istatistik */
    ["TaskStatusChanged", [
      g("summary"),
      g("deliveries"),
      g("blocked-tasks"),
      g("delivery-heatmap"),
      g("statistics"),
      g("project-health")
    ]],
    /* Atama değişti → tıkanma sebebi "atanmamış" olabilir */
    ["TaskAssigned", [g("blocked-tasks"), g("deliveries")]],
    /* Onay kuyruğu (taslak fatura) hareketi */
    ["ApprovalCreated", [g("pending-approvals"), g("summary"), g("statistics")]],
    ["ApprovalResolved", [g("pending-approvals"), g("summary"), g("statistics")]],
    /* Bütçe / muhasebe hareketi → bütçe oranları ve finans istatistikleri */
    ["BudgetUpdated", [g("summary"), g("project-health"), g("statistics")]],
    ["JournalEntryPosted", [g("income-expense"), g("statistics")]],
    /* Hibe belgesi son tarihi → ısı takviminin sarı günleri */
    ["GrantDocumentDue", [g("delivery-heatmap"), g("statistics")]]
  ], []), n = m.useMemo(() => [
    ["BudgetConflict", {
      queryKeys: [g("summary"), g("project-health")],
      message: "Bütçe kaydında çakışma",
      description: "Aynı bütçeyi başka bir kullanıcı güncelledi."
    }]
  ], []);
  return rn(t), ln(n), null;
}
jt();
const Me = document.getElementById("apya-dashboard-root");
Me && dt(Me).render(
  /* @__PURE__ */ e.jsx(ht, { children: /* @__PURE__ */ e.jsx(gt, { children: /* @__PURE__ */ e.jsx(pt, { children: /* @__PURE__ */ e.jsx(kt, { children: /* @__PURE__ */ e.jsxs(vt, { children: [
    /* @__PURE__ */ e.jsx(on, {}),
    /* @__PURE__ */ e.jsx(Qa, {})
  ] }) }) }) }) })
);
