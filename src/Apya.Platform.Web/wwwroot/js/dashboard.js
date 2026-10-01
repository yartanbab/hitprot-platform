import { r as x, j as e, b as ke } from "./react-vendor-D7YDiBbi.js";
import { t as n, R as $e, E as T, c as Oe, m as bt } from "./index-DgpuJ91w.js";
import { c as p, S as U, f as se, a as A, b as ft, d as gt, I as yt, B as G, T as jt } from "./Dialog-BdrRxZcw.js";
import { Q as E, a as kt } from "./QueryProvider-D2Hvqdr9.js";
import { H as Ge, a as Dt, L as vt } from "./signalr-vendor-CjTpd8t3.js";
import { D as Nt } from "./useDeviceMode-Bkxjujsr.js";
import { u as We, r as St, T as wt } from "./registerServiceWorker-BqopwOEk.js";
import { r as Tt } from "./grid-vendor-Fh34umPY.js";
import { u as R, a as oe, b as Ue } from "./query-vendor-Db2mwxYI.js";
import { a as ce } from "./httpClient-BNoyY5yK.js";
import { u as Et } from "./dataChanged-CDwwWMH8.js";
const _e = x.createContext({
  connection: null,
  state: Ge.Disconnected
});
function Ct({ hubUrl: t = "/signalr-hubs/notifications", children: s, enabled: a = !0 }) {
  const [r, i] = x.useState(Ge.Disconnected), o = x.useRef(null);
  x.useEffect(() => {
    if (!a || typeof window > "u") return;
    const l = new Dt().withUrl(t, { withCredentials: !0 }).withAutomaticReconnect([0, 2e3, 5e3, 1e4, 3e4]).configureLogging(vt.Warning).build();
    o.current = l, i(l.state);
    const d = () => i(l.state);
    return l.onreconnecting(d), l.onreconnected(d), l.onclose(d), l.start().then(d).catch((u) => {
      console.warn("[SignalR] connect failed:", u == null ? void 0 : u.message), d();
    }), () => {
      l.stop().catch(() => {
      }), o.current = null;
    };
  }, [t, a]);
  const c = x.useMemo(() => ({
    get connection() {
      return o.current;
    },
    state: r
  }), [r]);
  return /* @__PURE__ */ e.jsx(_e.Provider, { value: c, children: s });
}
function ze() {
  return x.useContext(_e);
}
const qe = "apya-card-drag-handle";
function C({
  title: t,
  subtitle: s,
  badge: a,
  actions: r,
  footer: i,
  accent: o,
  /* 'negative' | 'warning' — kritik kartların üst şeridi */
  editMode: c = !1,
  /* Sorgunun `isPending`i geçilir, `isLoading`i DEĞİL: kalıcı önbellek geri
     yüklenirken isLoading FALSE döner ama veri henüz yoktur; kart o karede
     boş/hatalı içerikle çizilirdi. (Prop adı geriye dönük uyum için kaldı.) */
  isLoading: l = !1,
  isError: d = !1,
  errorMessage: u,
  onRetry: m,
  isEmpty: f = !1,
  emptyState: D,
  skeleton: k,
  isFetching: N = !1,
  isStale: $ = !1,
  dataUpdatedAt: M,
  bleed: B = !1,
  className: j,
  bodyClassName: W,
  children: S
}) {
  const I = !l && !d && $ && N, O = x.useId(), H = d && m ? O : void 0;
  return /* @__PURE__ */ e.jsxs(
    "section",
    {
      className: p(
        "h-full flex flex-col overflow-hidden",
        "rounded-card shadow-card",
        "bg-surface-base border border-default",
        j
      ),
      children: [
        o && /* @__PURE__ */ e.jsx(
          "span",
          {
            "aria-hidden": "true",
            className: p(
              "block h-[3px] flex-none",
              o === "negative" ? "bg-negative-500" : "bg-warning-500"
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
                c && /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: p(
                      qe,
                      "text-accent-soft text-xs tracking-[-2px] cursor-grab active:cursor-grabbing select-none flex-none"
                    ),
                    "aria-hidden": "true",
                    children: "⠿"
                  }
                ),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("h2", { id: H, className: "text-[13.5px] font-semibold tracking-[-0.01em] truncate text-text-primary", children: t }),
                    a,
                    I && /* @__PURE__ */ e.jsx(Bt, {})
                  ] }),
                  s && /* @__PURE__ */ e.jsx("p", { className: "text-[11.5px] text-text-tertiary truncate", children: s })
                ] })
              ] }),
              r && /* Aksiyonlara basmak kartı sürüklemesin. */
              /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "flex items-center gap-2.5 flex-none",
                  onMouseDown: (V) => V.stopPropagation(),
                  onTouchStart: (V) => V.stopPropagation(),
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
              B ? "pb-0" : "px-[18px] pb-[18px]",
              B && "px-[18px]",
              W
            ),
            children: [
              d && /* @__PURE__ */ e.jsx(
                Rt,
                {
                  message: u,
                  onRetry: m,
                  retrying: N,
                  describedBy: H,
                  dataUpdatedAt: M
                }
              ),
              !d && l && (k ?? /* @__PURE__ */ e.jsx(Pt, {})),
              !d && !l && f && (D ?? /* @__PURE__ */ e.jsx(At, {})),
              !d && !l && !f && S
            ]
          }
        ),
        i && !d && /* @__PURE__ */ e.jsx("footer", { className: "flex-none px-[18px] pb-[14px] pt-1", children: i })
      ]
    }
  );
}
function Pt() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", "aria-busy": "true", children: [
    /* @__PURE__ */ e.jsx(U, { height: 28, className: "w-1/3" }),
    /* @__PURE__ */ e.jsx(U, { height: 14 }),
    /* @__PURE__ */ e.jsx(U, { height: 14, className: "w-5/6" }),
    /* @__PURE__ */ e.jsx(U, { height: 14, className: "w-3/4" })
  ] });
}
function At() {
  return /* @__PURE__ */ e.jsx(
    T,
    {
      compact: !0,
      title: n("Common:NoDataToShow", "Görüntülenecek veri yok"),
      description: n("Common:NoDataYet", "Yeni veri girildiğinde burada görünecek.")
    }
  );
}
function Rt({ message: t, onRetry: s, retrying: a, describedBy: r, dataUpdatedAt: i }) {
  const o = It(i);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center justify-center text-center gap-2 py-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-text-secondary max-w-xs", children: t || n("Common:FetchError", "Veri alınırken bir hata oluştu.") }),
    o && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-text-tertiary", children: [
      n("Common:LastSuccessfulUpdate", "Son başarılı güncelleme"),
      ": ",
      o
    ] }),
    s && /* @__PURE__ */ e.jsx($e, { onRetry: s, retrying: a, "aria-describedby": r })
  ] });
}
function Bt() {
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1 text-[11px] text-text-tertiary flex-none",
      title: n("Common:UpdatingInBackground", "Arka planda güncelleniyor"),
      "aria-live": "polite",
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "inline-block h-1.5 w-1.5 rounded-full bg-warning-500 animate-pulse", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: n("Common:Updating", "güncelleniyor") })
      ]
    }
  );
}
function It(t) {
  if (t == null) return null;
  const s = t instanceof Date ? t.getTime() : Number(t);
  if (!Number.isFinite(s) || s <= 0) return null;
  const a = Math.round((s - Date.now()) / 1e3), r = Math.abs(a), i = new Intl.RelativeTimeFormat(Oe(), { numeric: "auto" });
  return r < 60 ? i.format(a, "second") : r < 3600 ? i.format(Math.round(a / 60), "minute") : r < 86400 ? i.format(Math.round(a / 3600), "hour") : i.format(Math.round(a / 86400), "day");
}
C.DRAG_HANDLE_CLASS = qe;
function Lt({ trend: t, children: s }) {
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
        s
      ]
    }
  );
}
const ne = 100, _ = 40;
function Mt(t, s = _, a = 2) {
  const r = Math.max(...t, 0);
  if (r <= 0) return t.map(() => s - a);
  const i = s - a * 2;
  return t.map((o) => a + i - o / r * i);
}
function Ht(t, s = ne) {
  if (t <= 1) return [s / 2];
  const a = s / (t - 1);
  return Array.from({ length: t }, (r, i) => i * a);
}
function Ye(t, s) {
  return t.length ? t.map((a, r) => `${r === 0 ? "M" : "L"} ${re(a)} ${re(s[r])}`).join(" ") : "";
}
function Ft(t, s, a = _) {
  return t.length ? `${Ye(t, s)} L ${re(t[t.length - 1])} ${a} L ${re(t[0])} ${a} Z` : "";
}
function re(t) {
  return Math.round(t * 100) / 100;
}
function Kt({ values: t = [], color: s = "var(--apya-brand-500)", ariaLabel: a }) {
  const r = x.useId().replace(/:/g, "");
  if (t.length < 2) return null;
  const i = Ht(t.length), o = Mt(t);
  return /* @__PURE__ */ e.jsxs(
    "svg",
    {
      viewBox: `0 0 ${ne} ${_}`,
      preserveAspectRatio: "none",
      className: "block w-full h-full",
      role: a ? "img" : "presentation",
      "aria-label": a,
      children: [
        /* @__PURE__ */ e.jsx("defs", { children: /* @__PURE__ */ e.jsxs("linearGradient", { id: r, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ e.jsx("stop", { offset: "0%", stopColor: s, stopOpacity: "0.16" }),
          /* @__PURE__ */ e.jsx("stop", { offset: "100%", stopColor: s, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ e.jsx("path", { d: Ft(i, o), fill: `url(#${r})` }),
        /* @__PURE__ */ e.jsx(
          "path",
          {
            d: Ye(i, o),
            fill: "none",
            stroke: s,
            strokeWidth: "1.75",
            vectorEffect: "non-scaling-stroke"
          }
        )
      ]
    }
  );
}
const $t = ["var(--apya-positive-500)", "color-mix(in srgb, var(--apya-negative-500) 45%, transparent)"];
function Ot({ groups: t = [], colors: s = $t, ariaLabel: a }) {
  if (!t.length) return null;
  const r = Math.max(...t.flatMap((l) => l.values), 0), i = ne / t.length, o = Math.min(4.5, i * 0.62 / 2), c = o * 0.22;
  return /* @__PURE__ */ e.jsx(
    "svg",
    {
      viewBox: `0 0 ${ne} ${_}`,
      preserveAspectRatio: "none",
      className: "block w-full h-full",
      role: a ? "img" : "presentation",
      "aria-label": a,
      children: t.map((l, d) => {
        const u = l.values.length * o + (l.values.length - 1) * c, m = d * i + (i - u) / 2;
        return l.values.map((f, D) => {
          const k = r > 0 ? f / r * (_ - 2) : 0;
          return /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: m + D * (o + c),
              y: _ - k,
              width: o,
              height: k,
              rx: "0.8",
              fill: s[D % s.length]
            },
            `${d}-${D}`
          );
        });
      })
    }
  );
}
const he = 34, Ce = 2 * Math.PI * he;
function Gt({ ratio: t = 0, size: s = 58, ariaLabel: a }) {
  const r = Math.max(0, Math.min(t, 1)), i = r * Ce, o = r >= 0.9 ? "var(--apya-negative-500)" : r >= 0.7 ? "var(--apya-warning-500)" : "var(--apya-positive-500)";
  return /* @__PURE__ */ e.jsxs(
    "svg",
    {
      viewBox: "0 0 100 100",
      style: { width: s, height: s },
      className: "flex-none",
      role: "img",
      "aria-label": a ?? `${Math.round(r * 100)}%`,
      children: [
        /* @__PURE__ */ e.jsx("circle", { cx: "50", cy: "50", r: he, fill: "none", stroke: "var(--apya-surface-sunken)", strokeWidth: "12" }),
        i > 0 && /* @__PURE__ */ e.jsx(
          "circle",
          {
            cx: "50",
            cy: "50",
            r: he,
            fill: "none",
            stroke: o,
            strokeWidth: "12",
            strokeDasharray: `${i} ${Ce - i}`,
            strokeLinecap: "round",
            transform: "rotate(-90 50 50)"
          }
        )
      ]
    }
  );
}
const Wt = [
  "bg-surface-sunken",
  /* 0 teslim */
  "bg-brand-200",
  "bg-brand-300",
  "bg-brand-500",
  "bg-brand-600"
];
function Ut(t, s) {
  return t <= 0 ? 0 : s <= 1 ? 2 : Math.min(4, 1 + Math.round((t - 1) / s * 3));
}
function _t({ cells: t = [], weekdayLabels: s = !0 }) {
  if (!t.length) return null;
  const a = Math.max(...t.map((i) => i.count), 0), r = [];
  for (let i = 0; i < t.length; i += 7) r.push(t.slice(i, i + 7));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
    r.map((i, o) => /* @__PURE__ */ e.jsx("div", { className: "flex gap-1", children: i.map((c) => /* @__PURE__ */ e.jsx(
      "span",
      {
        title: zt(c),
        className: p(
          "flex-1 h-[15px] rounded",
          /* Hibe günü kademeden çıkar, sarı boyanır. Tasarımdaki
             #FCD34D için token yok → warning-500 yarı saydam
             (yeni renk üretmemek için). */
          c.isGrantDeadline ? "bg-warning-500/55" : Wt[Ut(c.count, a)]
        )
      },
      c.date
    )) }, o)),
    s && /* @__PURE__ */ e.jsx("div", { className: "flex justify-between font-mono text-[9.5px] text-text-tertiary pt-0.5", children: [
      n("Common:Day:Mon", "Pzt"),
      n("Common:Day:Tue", "Sal"),
      n("Common:Day:Wed", "Çar"),
      n("Common:Day:Thu", "Per"),
      n("Common:Day:Fri", "Cum"),
      n("Common:Day:Sat", "Cmt"),
      n("Common:Day:Sun", "Paz")
    ].map((i) => /* @__PURE__ */ e.jsx("span", { children: i }, i)) })
  ] });
}
function zt(t) {
  const s = new Date(t.date).toLocaleDateString(), a = n("Dashboard:Heatmap:CellCount", "{0} teslim", t.count);
  return t.isGrantDeadline ? `${s} — ${a} · ${n("Dashboard:Heatmap:GrantDeadline", "hibe son tarihi")}` : `${s} — ${a}`;
}
function qt({ ratio: t = 0, tone: s = "positive", ariaLabel: a }) {
  const r = Math.max(0, Math.min(t, 1)), i = Math.round(r * 100), o = s === "negative" ? "var(--apya-negative-500)" : s === "warning" ? "var(--apya-warning-500)" : "var(--apya-positive-500)";
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "flex gap-1",
      role: "img",
      "aria-label": a ?? `%${i}`,
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-[5px] rounded-full", style: { flex: i, background: o } }),
        i < 100 && /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "h-[5px] rounded-full bg-surface-sunken",
            style: { flex: 100 - i }
          }
        )
      ]
    }
  );
}
const Yt = ["Upcoming", "OnTrack", "InReview", "Overdue"], Vt = ["ThisWeek", "NextWeek", "EndOfMonth", "Later"], Qt = ["Healthy", "Attention", "Risky"], Xt = ["WaitingReview", "Dependency", "Unassigned"], Jt = ["Flat", "Up", "Down"], Zt = ["Work", "Finance", "Grants", "Communication", "System"];
function q(t, s, a) {
  return typeof s == "string" ? s : t[s] ?? a;
}
function ea(t) {
  return (t ?? []).map((s) => ({
    ...s,
    state: q(Yt, s.state, "Upcoming"),
    groupKey: q(Vt, s.groupKey, "Later")
  }));
}
function ta(t) {
  return (t ?? []).map((s) => ({
    ...s,
    state: q(Qt, s.state, "Healthy")
  }));
}
function aa(t) {
  return (t ?? []).map((s) => ({
    ...s,
    blockReason: q(Xt, s.blockReason, "Dependency")
  }));
}
function sa(t) {
  return (t ?? []).map((s) => ({
    ...s,
    group: q(Zt, s.group, "Work"),
    trend: q(Jt, s.trend, "Flat")
  }));
}
const Pe = 0, Y = 6e4, De = 3e4;
function na({ range: t, projectId: s } = {}) {
  const a = new URLSearchParams();
  t && a.set("range", t), s && a.set("projectId", s);
  const r = a.toString();
  return r ? `?${r}` : "";
}
const L = (t, s) => ce.get(`/api/dashboard/${t}${na(s)}`);
function Ve(t) {
  return R({
    queryKey: E.dashboard.summary(t),
    queryFn: () => L("summary", t),
    staleTime: De
    /* bütçe alanları içeriyor */
  });
}
function Qe(t) {
  return R({
    queryKey: E.dashboard.deliveries(t),
    queryFn: () => L("deliveries", t),
    select: ea,
    staleTime: Y
  });
}
function Xe(t) {
  return R({
    queryKey: E.dashboard.projectHealth(t),
    queryFn: () => L("project-health", t),
    select: ta,
    staleTime: Y
  });
}
function Je() {
  return R({
    queryKey: E.dashboard.approvals(),
    queryFn: () => L("pending-approvals"),
    staleTime: De
  });
}
function Ze() {
  return R({
    queryKey: E.dashboard.blockedTasks(),
    queryFn: () => L("blocked-tasks"),
    select: aa,
    staleTime: Y
  });
}
function et(t) {
  return R({
    queryKey: E.dashboard.statistics(t),
    queryFn: () => L("statistics", t),
    select: sa,
    staleTime: Y
  });
}
function tt(t) {
  return R({
    queryKey: E.dashboard.incomeExpense(t),
    queryFn: () => L("income-expense", t),
    staleTime: De
  });
}
function at(t) {
  return R({
    queryKey: E.dashboard.deliveryHeatmap(t),
    queryFn: () => L("delivery-heatmap", t),
    staleTime: Y
  });
}
function ra(t) {
  return R({
    queryKey: E.dashboard.effortDistribution(t),
    queryFn: () => L("effort-distribution", t),
    staleTime: Y
  });
}
function ia({ filter: t, template: s, compact: a }) {
  const { data: r, isPending: i, isError: o, isFetching: c, refetch: l } = Ve(t), d = x.useId(), u = { gridTemplateColumns: s ?? "repeat(4, minmax(0, 2fr)) minmax(0, 3fr)" };
  return i ? /* @__PURE__ */ e.jsx("div", { className: "h-full grid gap-[12px]", style: u, children: Array.from({ length: 5 }, (m, f) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-card shadow-card bg-surface-base border border-default p-[16px]", children: [
    /* @__PURE__ */ e.jsx(U, { height: 14, className: "w-2/3 mb-[8px]" }),
    /* @__PURE__ */ e.jsx(U, { height: 28, className: "w-1/2" })
  ] }, f)) }) : o || !r ? /* @__PURE__ */ e.jsxs("div", { className: "rounded-card shadow-card bg-surface-base border border-default p-[16px] flex items-center justify-between gap-[12px]", children: [
    /* @__PURE__ */ e.jsx("span", { id: d, className: "text-[12.5px] text-text-secondary", children: n("Dashboard:Summary:Error", "Özet yüklenemedi.") }),
    /* @__PURE__ */ e.jsx($e, { onRetry: () => l(), retrying: c, "aria-describedby": d })
  ] }) : (
    /* Kutucuklar ızgara kutusunu TAM doldurur (h-full): doğal yüksekliğe
               bırakılırsa kutu içerikten kısa kalınca taşıp alttaki satıra biniyor,
               uzun kalınca da altta ölü boşluk bırakıyordu — ikisini de gördük.
               Ek alt padding YOK: tüm boşluklar tek kaynaktan, GRID_MARGIN'den gelir.
               Kutucuk arası da aynı 12px — ızgaradaki kart aralarıyla birebir.
    
               Kutu yüksekliği de kolon sayısını takip eder (stripLayoutFor → h), yani
               çok satırlı dizilimde kutu büyür; sabit h=2 bırakılınca satırlar 148px'lik
               kutuya sıkışıp `overflow-hidden` altyazıları kesiyordu. */
    /* @__PURE__ */ e.jsxs("div", { className: "h-full grid gap-[12px]", style: u, children: [
      /* @__PURE__ */ e.jsx(
        ee,
        {
          compact: a,
          label: n("Dashboard:Summary:DueThisPeriod", "Bu dönem teslim"),
          value: r.dueThisPeriod,
          pill: n("Dashboard:Summary:DueThisWeek", "{0} bu hafta", r.dueThisWeek),
          icon: /* @__PURE__ */ e.jsx(oa, {}),
          iconTone: "brand",
          spark: r.dueTrend
        }
      ),
      /* @__PURE__ */ e.jsx(
        ee,
        {
          compact: a,
          label: n("Dashboard:Summary:Overdue", "Gecikmiş"),
          value: r.overdue,
          tone: "negative",
          pill: r.oldestOverdueDays != null ? n("Dashboard:Summary:OldestOverdue", "en eski {0} g", r.oldestOverdueDays) : null,
          pillTone: "negative",
          icon: /* @__PURE__ */ e.jsx(ca, {}),
          iconTone: "negative",
          caption: n("Dashboard:Summary:OverdueProjects", "{0} projede", r.overdueProjectCount)
        }
      ),
      /* @__PURE__ */ e.jsx(
        ee,
        {
          compact: a,
          label: n("Dashboard:Summary:Blocked", "Tıkanan iş"),
          value: r.blocked,
          tone: "warning",
          pill: n("Dashboard:Summary:BlockedAvg", "ort. {0} g", r.blockedAvgIdleDays),
          pillTone: "warning",
          icon: /* @__PURE__ */ e.jsx(da, {}),
          iconTone: "warning",
          caption: n("Dashboard:Summary:BlockedReasons", "onay · bilgi · bağımlılık")
        }
      ),
      /* @__PURE__ */ e.jsx(
        ee,
        {
          compact: a,
          label: n("Dashboard:Summary:PendingApprovals", "Bende onay"),
          value: r.pendingApprovals,
          locked: r.pendingApprovals == null,
          lockedPermission: n("Permission:Invoices", "Faturalar"),
          pill: r.pendingApprovalAmount != null ? se(r.pendingApprovalAmount, r.currency) : null,
          icon: /* @__PURE__ */ e.jsx(ua, {}),
          iconTone: "brand",
          caption: r.pendingApprovalAvgAgeHours != null ? n("Dashboard:Summary:AvgWait", "ortalama bekleme {0} sa", r.pendingApprovalAvgAgeHours) : null
        }
      ),
      /* @__PURE__ */ e.jsx(la, { data: r, compact: a })
    ] })
  );
}
function ee({ label: t, value: s, pill: a, pillTone: r = "neutral", caption: i, tone: o = "neutral", icon: c, iconTone: l = "brand", spark: d, locked: u, lockedPermission: m, compact: f }) {
  const D = !f && d && d.length > 1;
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: p(
        "rounded-card shadow-card bg-surface-base border border-default",
        "flex flex-col overflow-hidden",
        f ? "gap-[5px] pt-[12px] px-[12px] pb-[12px]" : p(
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
            f ? "w-5 h-5" : "w-6 h-6",
            l === "negative" ? "bg-negative-50 text-negative-700" : l === "warning" ? "bg-warning-50 text-warning-700" : "bg-accent-soft text-accent-600"
          ), children: c })
        ] }),
        u ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx("span", { className: p("font-mono font-semibold tracking-[-0.03em] text-text-tertiary", f ? "text-[22px]" : "text-[28px]", "leading-none"), children: "— —" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: n("Dashboard:Stat:Locked", "yetki gerekli") }),
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary", children: m })
        ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-[8px] flex-wrap", children: [
            /* @__PURE__ */ e.jsx("span", { className: p(
              "font-mono font-semibold tracking-[-0.03em] tabular-nums",
              f ? "text-[22px]" : "text-[28px]",
              /* leading-none SIRASI ÖNEMLİ: tailwind-merge, text-[..] font-size
                 sınıfını gördüğünde ÖNCESİNDEKİ leading-* sınıfını atıyor. */
              "leading-none",
              o === "negative" ? "text-negative-500" : o === "warning" ? "text-warning-600" : "text-text-primary"
            ), children: s }),
            a && /* @__PURE__ */ e.jsx("span", { className: p(
              "font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full tabular-nums",
              r === "negative" ? "bg-negative-50 text-negative-700" : r === "warning" ? "bg-warning-50 text-warning-700" : "bg-surface-sunken text-text-secondary"
            ), children: a })
          ] }),
          i && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary truncate", children: i })
        ] }),
        D && /* @__PURE__ */ e.jsx("div", { className: "h-9 mt-auto -mx-[16px]", children: /* @__PURE__ */ e.jsx(Kt, { values: d, ariaLabel: n("Dashboard:Summary:DueTrend", "Teslim dağılımı") }) })
      ]
    }
  );
}
function la({ data: t, compact: s }) {
  const a = t.budgetUsedRatio == null && t.budgetTotal == null;
  return (
    /* Kompakt kipte tam satıra yayılır: 145px'lik yarım kolonda Gauge (58px)
       + altyazı sığmıyor, tek başına geniş satırda rahat ediyor. */
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: p(
          "rounded-card shadow-card bg-surface-base border border-default flex items-center justify-between",
          s ? "p-[12px] gap-[8px]" : "p-[16px] gap-[10px]"
        ),
        style: s ? { gridColumn: "1 / -1" } : void 0,
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: p("flex flex-col min-w-0", s ? "gap-[5px]" : "gap-[7px]"), children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-medium text-text-secondary truncate", children: n("Dashboard:Summary:BudgetUsage", "Bütçe kullanımı") }),
            a ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsx("span", { className: p("font-mono font-semibold tracking-[-0.03em] text-text-tertiary", s ? "text-[22px]" : "text-[28px]", "leading-none"), children: "— —" }),
              /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[9px] text-text-tertiary", children: [
                n("Dashboard:Stat:Locked", "yetki gerekli"),
                " · ",
                n("Permission:Projects.ViewBudget", "Bütçe Görüntüleme")
              ] })
            ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsxs("span", { className: p("font-mono font-semibold tracking-[-0.03em] text-text-primary tabular-nums", s ? "text-[22px]" : "text-[28px]", "leading-none"), children: [
                "%",
                Math.round((t.budgetUsedRatio ?? 0) * 100)
              ] }),
              /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary truncate", children: [
                se(t.budgetSpent, t.currency),
                " / ",
                se(t.budgetTotal, t.currency)
              ] })
            ] })
          ] }),
          !a && /* @__PURE__ */ e.jsx(Gt, { ratio: t.budgetUsedRatio ?? 0 })
        ]
      }
    )
  );
}
const de = { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }, oa = () => /* @__PURE__ */ e.jsxs("svg", { ...de, children: [
  /* @__PURE__ */ e.jsx("path", { d: "M8 2v3M16 2v3M4 9h16" }),
  /* @__PURE__ */ e.jsx("rect", { x: "4", y: "5", width: "16", height: "16", rx: "2" })
] }), ca = () => /* @__PURE__ */ e.jsxs("svg", { ...de, children: [
  /* @__PURE__ */ e.jsx("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ e.jsx("path", { d: "M12 8v5" }),
  /* @__PURE__ */ e.jsx("path", { d: "M12 16.5v.01" })
] }), da = () => /* @__PURE__ */ e.jsxs("svg", { ...de, children: [
  /* @__PURE__ */ e.jsx("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ e.jsx("path", { d: "M5.6 5.6l12.8 12.8" })
] }), ua = () => /* @__PURE__ */ e.jsx("svg", { ...de, children: /* @__PURE__ */ e.jsx("path", { d: "M20 6L9 17l-5-5" }) }), pe = ["ThisWeek", "NextWeek", "EndOfMonth", "Later"], be = {
  ThisWeek: ["Dashboard:Deliveries:ThisWeek", "Bu hafta"],
  NextWeek: ["Dashboard:Deliveries:NextWeek", "Gelecek hafta"],
  EndOfMonth: ["Dashboard:Deliveries:EndOfMonth", "Ay sonu"],
  Later: ["Dashboard:Deliveries:Later", "Sonrası"]
};
function ma({ filter: t, editMode: s }) {
  const a = Qe(t), r = a.data ?? [], i = x.useMemo(() => {
    const c = new Map(pe.map((l) => [l, []]));
    for (const l of r)
      (c.get(l.groupKey) ?? c.get("Later")).push(l);
    return pe.map((l) => ({ key: l, items: c.get(l) ?? [] })).filter((l) => l.items.length > 0);
  }, [r]), o = r.filter((c) => c.state === "Overdue").length;
  return /* @__PURE__ */ e.jsx(
    C,
    {
      editMode: s,
      title: n("Dashboard:Deliveries:Title", "Bu ay teslim edilecekler"),
      subtitle: a.isSuccess ? n("Dashboard:Deliveries:Subtitle", "{0} iş · {1} gecikmiş", r.length, o) : void 0,
      actions: /* @__PURE__ */ e.jsx("a", { href: "/Tasks", className: "text-[12.5px] font-medium text-text-link hover:underline", children: n("Dashboard:Deliveries:AllTasks", "Görev listesi →") }),
      isLoading: a.isPending,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: r.length === 0,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        T,
        {
          compact: !0,
          title: n("Dashboard:Deliveries:EmptyTitle", "Bu dönem teslim yok"),
          description: n("Dashboard:Deliveries:EmptyDescription", "Son tarihi bu döneme düşen açık iş bulunmuyor."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Tasks", className: "text-[12.5px] font-medium text-text-link hover:underline", children: n("Dashboard:Deliveries:AllTasks", "Görev listesi →") })
        }
      ),
      children: /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2.5", children: i.map((c) => /* @__PURE__ */ e.jsxs(ke.Fragment, { children: [
        /* @__PURE__ */ e.jsx(xa, { groupKey: c.key, count: c.items.length }),
        /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col gap-[3px]", children: c.items.map((l) => /* @__PURE__ */ e.jsx(ha, { item: l }, l.taskId)) })
      ] }, c.key)) })
    }
  );
}
function xa({ groupKey: t, count: s }) {
  const [a, r] = be[t] ?? be.Later;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.04em] text-text-tertiary", children: n(a, r) }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary tabular-nums", children: s }),
    /* @__PURE__ */ e.jsx("span", { className: "flex-1 h-px bg-subtle" })
  ] });
}
const Ae = {
  Overdue: "bg-negative-500",
  InReview: "bg-warning-500",
  OnTrack: "bg-positive-500",
  Upcoming: "bg-neutral-300"
};
function ha({ item: t }) {
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
        /* @__PURE__ */ e.jsx("span", { className: p("w-1.5 h-1.5 rounded-full flex-none", Ae[t.state] ?? Ae.Upcoming), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-[140px] text-[13.5px] font-medium text-text-primary truncate", children: t.title }),
        t.state === "Overdue" && t.overdueDays != null && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold px-2 py-0.5 rounded-full bg-negative-50 text-negative-700 flex-none", children: n("Dashboard:Deliveries:OverdueDays", "{0} gün gecikmiş", t.overdueDays) }),
        t.state === "InReview" && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold px-2 py-0.5 rounded-full bg-warning-50 text-warning-700 flex-none", children: n("Dashboard:Deliveries:InReview", "kontrolde") }),
        t.projectName && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-secondary px-2 py-0.5 rounded-full bg-surface-sunken flex-none truncate max-w-[140px]", children: t.projectName }),
        /* @__PURE__ */ e.jsx("span", { className: p(
          "font-mono text-[11.5px] w-[50px] text-right flex-none tabular-nums",
          t.state === "Overdue" ? "text-negative-500" : "text-text-secondary"
        ), children: pa(t.dueDate) }),
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
function pa(t) {
  const s = new Date(t);
  return Number.isNaN(s.getTime()) ? "" : s.toLocaleDateString(void 0, { day: "numeric", month: "short" });
}
const Re = 4, ie = {
  Healthy: ["bg-positive-50 text-positive-700", "Dashboard:Health:Healthy", "Sağlıklı"],
  Attention: ["bg-warning-50 text-warning-700", "Dashboard:Health:Attention", "Dikkat"],
  Risky: ["bg-negative-50 text-negative-700", "Dashboard:Health:Risky", "Riskli"]
}, ba = { Healthy: "positive", Attention: "warning", Risky: "negative" };
function fa({ filter: t, editMode: s }) {
  const a = Xe(t), r = a.data ?? [], i = r.slice(0, Re), o = r.slice(Re);
  return /* @__PURE__ */ e.jsx(
    C,
    {
      editMode: s,
      title: n("Dashboard:Health:Title", "Proje sağlığı"),
      subtitle: a.isSuccess ? n("Dashboard:Health:Subtitle", "{0} aktif proje", r.length) : void 0,
      isLoading: a.isPending,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: r.length === 0,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        T,
        {
          compact: !0,
          title: n("Dashboard:Health:EmptyTitle", "Henüz proje yok"),
          description: n("Dashboard:Health:EmptyDescription", "Proje oluşturunca sağlık göstergeleri burada belirir."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Projects", className: "text-[12.5px] font-medium text-text-link hover:underline", children: n("Dashboard:Health:OpenProjects", "Projeleri aç →") })
        }
      ),
      footer: o.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary truncate", children: o.map((c) => c.name).join(" · ") }),
        /* @__PURE__ */ e.jsx("a", { href: "/Projects", className: "text-xs text-text-link hover:underline flex-none", children: n("Dashboard:Health:More", "+{0} proje →", o.length) })
      ] }),
      children: /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col", children: i.map((c, l) => /* @__PURE__ */ e.jsxs("li", { className: "flex flex-col gap-[7px]", children: [
        l > 0 && /* @__PURE__ */ e.jsx("span", { className: "h-px bg-subtle my-2.5" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx(
            "a",
            {
              href: `/Projects/ProjectDetails/${c.projectId}`,
              className: "text-[13px] font-medium text-text-primary truncate hover:underline",
              children: c.name
            }
          ),
          /* @__PURE__ */ e.jsx(ga, { state: c.state })
        ] }),
        /* @__PURE__ */ e.jsx(
          qt,
          {
            ratio: c.budgetRatio ?? c.timeRatio ?? 0,
            tone: ba[c.state] ?? "positive",
            ariaLabel: n("Dashboard:Health:BarLabel", "{0} ilerleme", c.name)
          }
        ),
        /* @__PURE__ */ e.jsx(ya, { project: c })
      ] }, c.projectId)) })
    }
  );
}
function ga({ state: t }) {
  const [s, a, r] = ie[t] ?? ie.Healthy;
  return /* @__PURE__ */ e.jsx("span", { className: p("text-[11px] font-semibold px-2 py-0.5 rounded-full flex-none", s), children: n(a, r) });
}
function ya({ project: t }) {
  const s = [];
  return t.daysRemaining != null && s.push(n("Dashboard:Health:DaysLeft", "{0} gün", t.daysRemaining)), t.budgetRatio != null && s.push(n("Dashboard:Health:BudgetPercent", "%{0} bütçe", Math.round(t.budgetRatio * 100))), s.push(n("Dashboard:Health:Tasks", "{0}/{1} görev", t.tasksDone, t.tasksTotal)), /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2.5 font-mono text-[11px] text-text-secondary tabular-nums", children: s.map((a, r) => /* @__PURE__ */ e.jsxs(ke.Fragment, { children: [
    r > 0 && /* @__PURE__ */ e.jsx("span", { className: "text-border-default", "aria-hidden": "true", children: "|" }),
    /* @__PURE__ */ e.jsx("span", { children: a })
  ] }, a)) });
}
function ja({ editMode: t }) {
  var d;
  const s = Je(), a = s.data, r = (a == null ? void 0 : a.locked) === !0, i = Array.isArray(a) ? a : (a == null ? void 0 : a.items) ?? [], o = i.reduce((u, m) => u + (m.amount ?? 0), 0), c = i.length ? Math.round(i.reduce((u, m) => u + m.ageHours, 0) / i.length) : 0, l = ((d = i[0]) == null ? void 0 : d.currency) ?? "TRY";
  return /* @__PURE__ */ e.jsx(
    C,
    {
      editMode: t,
      title: n("Dashboard:Approvals:Title", "Bende bekleyen kararlar"),
      badge: i.length > 0 && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full bg-warning-50 text-warning-700 tabular-nums flex-none", children: i.length }),
      isLoading: s.isPending,
      isError: s.isError,
      onRetry: s.refetch,
      isEmpty: r || i.length === 0,
      isFetching: s.isFetching,
      isStale: s.isStale,
      dataUpdatedAt: s.dataUpdatedAt,
      emptyState: r ? (
        /* Kilitli kart yasak sayfaya (/Invoices → 403) bağlantı VERMEZ. */
        /* @__PURE__ */ e.jsx(
          T,
          {
            compact: !0,
            variant: "locked",
            title: n("Common:Locked:Title", "Bu bilgiyi görme yetkiniz yok"),
            description: n("Dashboard:Approvals:LockedDescription", 'Taslak faturaları görmek için "{0}" yetkisi gerekir.', n("Permission:Invoices", "Faturalar"))
          }
        )
      ) : /* @__PURE__ */ e.jsx(
        T,
        {
          compact: !0,
          title: n("Dashboard:Approvals:EmptyTitle", "Karar bekleyen yok"),
          description: n("Dashboard:Approvals:EmptyDescription", "Taslak durumdaki fatura bulunmuyor."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Invoices", className: "text-[12.5px] font-medium text-text-link hover:underline", children: n("Dashboard:Approvals:OpenInvoices", "Faturaları aç →") })
        }
      ),
      footer: i.length > 0 && /* Satır başlıkları serbest metin olduğu için kırpılabilir, ama bu
      özet SABİT biçimli — dar kartta kırpmak yerine alt satıra sarsın. */
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: n("Dashboard:Approvals:Total", "Toplam {0} · ort. bekleme {1} sa", A(o, l), c) }),
        /* @__PURE__ */ e.jsx("a", { href: "/Invoices", className: "text-[12.5px] font-medium text-text-link hover:underline flex-none", children: n("Dashboard:Approvals:Queue", "Onay kuyruğu →") })
      ] }),
      children: /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col", children: i.slice(0, 4).map((u, m) => /* @__PURE__ */ e.jsxs(
        "li",
        {
          className: "flex flex-wrap items-center gap-2.5 py-2 border-b border-subtle last:border-b-0",
          children: [
            /* @__PURE__ */ e.jsxs("span", { className: "flex-1 min-w-[150px] flex flex-col gap-0.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-medium text-text-primary truncate", children: u.title }),
              /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary truncate", children: n("Dashboard:Approvals:Meta", "Fatura · {0} · {1} sa", u.requesterName || "—", u.ageHours) })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "font-mono text-xs font-semibold text-text-primary tabular-nums flex-none", children: A(u.amount, u.currency) }),
            /* @__PURE__ */ e.jsx(
              "a",
              {
                href: u.targetUrl,
                className: "text-xs font-medium text-text-link hover:underline flex-none",
                children: n("Dashboard:Approvals:Review", "İncele →")
              }
            )
          ]
        },
        u.id
      )) })
    }
  );
}
const le = {
  WaitingReview: ["bg-warning-50 text-warning-700", "Dashboard:Blockers:WaitingReview", "Kontrolde"],
  Dependency: ["bg-surface-sunken text-text-secondary", "Dashboard:Blockers:Dependency", "Bağımlı"],
  Unassigned: ["bg-negative-50 text-negative-700", "Dashboard:Blockers:Unassigned", "Atanmamış"]
};
function ka({ editMode: t }) {
  const s = Ze(), a = s.data ?? [];
  return /* @__PURE__ */ e.jsx(
    C,
    {
      editMode: t,
      accent: a.length > 0 ? "negative" : void 0,
      title: n("Dashboard:Blockers:Title", "Tıkanan işler & risk"),
      badge: a.length > 0 && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full bg-negative-50 text-negative-700 tabular-nums flex-none", children: a.length }),
      isLoading: s.isPending,
      isError: s.isError,
      onRetry: s.refetch,
      isEmpty: a.length === 0,
      isFetching: s.isFetching,
      isStale: s.isStale,
      dataUpdatedAt: s.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        T,
        {
          compact: !0,
          title: n("Dashboard:Blockers:EmptyTitle", "Tıkanan iş yok"),
          description: n("Dashboard:Blockers:EmptyDescription", "Açık işlerin hepsi son günlerde hareket görmüş.")
        }
      ),
      children: /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col gap-3", children: a.slice(0, 3).map((r, i) => /* @__PURE__ */ e.jsxs("li", { className: "flex flex-col gap-1", children: [
        i > 0 && /* @__PURE__ */ e.jsx("span", { className: "h-px bg-subtle mb-2" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(Da, { reason: r.blockReason }),
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary truncate", children: n("Dashboard:Blockers:Meta", "{0} · {1} gündür hareketsiz", r.code, r.idleDays) })
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[12.5px] font-medium text-text-primary leading-[1.4]", children: [
          r.title,
          r.dependentCount > 0 && /* @__PURE__ */ e.jsxs("span", { className: "text-text-tertiary font-normal", children: [
            " — ",
            n("Dashboard:Blockers:Dependents", "{0} bağımlı görev bekliyor", r.dependentCount)
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(
          "a",
          {
            href: `/Tasks?taskId=${r.taskId}`,
            className: "text-xs font-medium text-text-link hover:underline self-start",
            children: n("Dashboard:Blockers:OpenTask", "Görevi aç →")
          }
        )
      ] }, r.taskId)) })
    }
  );
}
function Da({ reason: t }) {
  const [s, a, r] = le[t] ?? le.Dependency;
  return /* @__PURE__ */ e.jsx("span", { className: p("text-[11px] font-semibold px-2 py-0.5 rounded-full flex-none", s), children: n(a, r) });
}
function va({ editMode: t }) {
  return /* @__PURE__ */ e.jsx(
    C,
    {
      editMode: t,
      title: n("Dashboard:Ai:Title", "AI önerileri"),
      subtitle: n("Dashboard:Ai:Subtitle", "sessiz inbox"),
      isEmpty: !0,
      emptyState: /* @__PURE__ */ e.jsx(
        T,
        {
          compact: !0,
          title: n("Dashboard:Ai:EmptyTitle", "AI şu an sessiz"),
          description: n("Dashboard:Ai:EmptyDescription", "Anlamlı bir öneri çıktığında burada görünecek."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Ai/Dashboard", className: "text-[12.5px] font-medium text-text-link hover:underline", children: n("Dashboard:Ai:OpenCenter", "AI Merkezi →") })
        }
      )
    }
  );
}
function Na({ filter: t, editMode: s }) {
  const a = tt(t), r = a.data, i = (r == null ? void 0 : r.locked) === !0, o = (r == null ? void 0 : r.points) ?? [], c = o.some((d) => d.income > 0 || d.expense > 0), l = (r == null ? void 0 : r.currency) ?? "TRY";
  return /* @__PURE__ */ e.jsxs(
    C,
    {
      editMode: s,
      bleed: !0,
      title: n("Dashboard:IncomeExpense:Title", "Gelir / gider"),
      subtitle: n("Dashboard:IncomeExpense:Subtitle", "Son 6 ay"),
      actions: i ? null : /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 text-[11px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-2 h-2 rounded-full bg-positive-500" }),
          n("Dashboard:IncomeExpense:Income", "Gelir")
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx("span", { className: "w-2 h-2 rounded-full bg-negative-500/45" }),
          n("Dashboard:IncomeExpense:Expense", "Gider")
        ] })
      ] }),
      isLoading: a.isPending,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: i || !c,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: i ? /* @__PURE__ */ e.jsx(
        T,
        {
          compact: !0,
          variant: "locked",
          title: n("Common:Locked:Title", "Bu bilgiyi görme yetkiniz yok"),
          description: n("Dashboard:IncomeExpense:LockedDescription", 'Bu kart "{0}" ve "{1}" yetkilerinin ikisini de ister.', n("Permission:Incomes", "Gelirler"), n("Permission:Expenses", "Giderler"))
        }
      ) : /* @__PURE__ */ e.jsx(
        T,
        {
          compact: !0,
          title: n("Dashboard:IncomeExpense:EmptyTitle", "Kayıtlı hareket yok"),
          description: n("Dashboard:IncomeExpense:EmptyDescription", "Son 6 ayda gelir veya gider kaydı bulunmuyor.")
        }
      ),
      bodyClassName: "flex flex-col gap-2.5",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-2xl font-semibold leading-none tracking-[-0.03em] text-text-primary tabular-nums", children: se((r == null ? void 0 : r.net) ?? 0, l) }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: n("Dashboard:IncomeExpense:Net", "net") })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-[82px] -mx-[18px] mt-auto", children: /* @__PURE__ */ e.jsx(
          Ot,
          {
            groups: o.map((d) => ({ values: [d.income, d.expense] })),
            ariaLabel: n("Dashboard:IncomeExpense:ChartLabel", "Aylık gelir ve gider")
          }
        ) })
      ]
    }
  );
}
function Sa({ filter: t, editMode: s }) {
  const a = at(t), r = a.data ?? [], i = r.some((c) => c.count > 0), o = r.reduce(
    (c, l) => l.count > ((c == null ? void 0 : c.count) ?? 0) ? l : c,
    null
  );
  return /* @__PURE__ */ e.jsxs(
    C,
    {
      editMode: s,
      title: n("Dashboard:Heatmap:Title", "Teslim yoğunluğu"),
      subtitle: n("Dashboard:Heatmap:Subtitle", "Önümüzdeki 4 hafta · hafta × gün"),
      isLoading: a.isPending,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: r.length === 0,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        T,
        {
          compact: !0,
          title: n("Dashboard:Heatmap:EmptyTitle", "Planlı teslim yok"),
          description: n("Dashboard:Heatmap:EmptyDescription", "Önümüzdeki 4 haftada son tarihi olan iş bulunmuyor.")
        }
      ),
      bodyClassName: "flex flex-col gap-3",
      children: [
        /* @__PURE__ */ e.jsx(_t, { cells: r }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: i && o ? n(
          "Dashboard:Heatmap:Busiest",
          "En yoğun gün {0} ({1} teslim) · sarı: hibe son tarihi",
          new Date(o.date).toLocaleDateString(void 0, { day: "numeric", month: "short" }),
          o.count
        ) : n("Dashboard:Heatmap:NoneScheduled", "Bu pencerede teslim planlanmamış · sarı: hibe son tarihi") })
      ]
    }
  );
}
function wa({ editMode: t }) {
  return /* @__PURE__ */ e.jsx(
    C,
    {
      editMode: t,
      title: n("Dashboard:Phases:Title", "Proje fazları"),
      subtitle: n("Dashboard:Phases:Subtitle", "mini gantt"),
      isEmpty: !0,
      emptyState: /* @__PURE__ */ e.jsx(
        T,
        {
          compact: !0,
          title: n("Dashboard:Phases:EmptyTitle", "Faz tanımlı değil"),
          description: n("Dashboard:Phases:EmptyDescription", "Projelere faz tanımlandığında zaman çizelgesi burada görünecek."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Projects", className: "text-[12.5px] font-medium text-text-link hover:underline", children: n("Dashboard:Phases:OpenProjects", "Projeleri aç →") })
        }
      )
    }
  );
}
const Be = 5;
function ue(t) {
  return Number(t ?? 0).toLocaleString("tr-TR", { maximumFractionDigits: 1 });
}
function Ta({ filter: t, editMode: s }) {
  const a = ra(t), r = a.data ?? [], i = r.slice(0, Be), o = r.slice(Be), c = r.reduce((d, u) => d + (u.hours ?? 0), 0), l = i.length > 0 ? Math.max(...i.map((d) => d.hours ?? 0)) : 0;
  return /* @__PURE__ */ e.jsx(
    C,
    {
      editMode: s,
      title: n("Dashboard:Effort:Title", "Efor dağılımı"),
      subtitle: r.length > 0 ? n("Dashboard:Effort:Subtitle", "{0} kişi · toplam {1} sa", r.length, ue(c)) : void 0,
      isLoading: a.isPending,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: r.length === 0,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        T,
        {
          compact: !0,
          title: n("Dashboard:Effort:EmptyTitle", "Bu dönemde süre kaydı yok"),
          description: n("Dashboard:Effort:EmptyDescription", "Görevlere süre işlendikçe kimin ne kadar çalıştığı burada birikir.")
        }
      ),
      footer: o.length > 0 && /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-secondary truncate", children: n(
        "Dashboard:Effort:More",
        "+{0} kişi daha · {1} sa",
        o.length,
        ue(o.reduce((d, u) => d + (u.hours ?? 0), 0))
      ) }),
      children: /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col gap-2.5", children: i.map((d) => /* @__PURE__ */ e.jsxs("li", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-medium text-text-primary truncate", children: d.userName }),
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] text-text-primary tabular-nums flex-none", children: n("Dashboard:Effort:Hours", "{0} sa", ue(d.hours)) })
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-surface-sunken overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "block h-full rounded-full",
            style: {
              width: l > 0 ? `${(d.hours ?? 0) / l * 100}%` : "0%",
              background: "var(--apya-brand-500)"
            }
          }
        ) }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-secondary", children: n("Dashboard:Effort:TaskCount", "{0} görev", d.taskCount) })
      ] }, d.userId)) })
    }
  );
}
const st = [
  ["Work", "Dashboard:StatTab:Work", "İş & teslim"],
  ["Finance", "Dashboard:StatTab:Finance", "Finans"],
  ["Grants", "Dashboard:StatTab:Grants", "Hibe"],
  ["Communication", "Dashboard:StatTab:Communication", "İletişim"],
  ["System", "Dashboard:StatTab:System", "Sistem"]
];
function fe(t) {
  const s = String(t ?? "").split(" + ").filter(Boolean).map((a) => n(`Permission:${a.replace(/^Platform\./, "")}`, a));
  return s.length === 2 ? n("Dashboard:Stat:PermissionPair", "{0} ve {1}", s[0], s[1]) : s.join(", ");
}
function Ea({ filter: t, editMode: s }) {
  const a = et(t), r = a.data ?? [], [i, o] = x.useState("Work"), c = x.useMemo(
    () => st.filter(([u]) => r.some((m) => m.group === u)),
    [r]
  ), l = r.filter((u) => u.group === i), d = r.filter((u) => u.locked).length;
  return /* @__PURE__ */ e.jsx(
    C,
    {
      editMode: s,
      title: n("Dashboard:Statistics:Title", "İstatistikler"),
      subtitle: r.length > 0 ? n(
        "Dashboard:Statistics:Subtitle",
        "{0} istatistikten {1}'i yetkinde · {2}'si kilitli",
        r.length,
        r.length - d,
        d
      ) : void 0,
      actions: /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1.5 flex-wrap justify-end", children: c.map(([u, m, f]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => o(u),
          "aria-pressed": i === u,
          className: p(
            "inline-flex items-center h-7 px-[11px] rounded-[9px] text-[11.5px] transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:shadow-focus",
            i === u ? "bg-text-primary text-surface-base font-semibold" : "bg-surface-sunken text-text-secondary font-medium hover:text-text-primary"
          ),
          children: n(m, f)
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
      children: /* @__PURE__ */ e.jsx("div", { className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(154px, 1fr))" }, children: l.map((u) => /* @__PURE__ */ e.jsx(Ca, { stat: u }, u.key)) })
    }
  );
}
function Ca({ stat: t }) {
  return t.locked ? /* @__PURE__ */ e.jsxs("div", { className: "p-[12px_14px] border border-dashed border-default rounded-xl bg-surface-base flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary truncate", children: t.label }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-xl font-semibold leading-none tracking-[-0.03em] text-text-tertiary", children: "— —" }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: n("Dashboard:Stat:Locked", "yetki gerekli") }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary truncate", children: fe(t.requiredPermission) })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "p-[12px_14px] border border-subtle rounded-xl bg-surface-base flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary truncate", children: t.label }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-xl font-semibold leading-none tracking-[-0.03em] text-text-primary tabular-nums", children: t.formatted || "—" }),
    t.deltaFormatted ? /* @__PURE__ */ e.jsx(Lt, { trend: t.trend, children: t.deltaFormatted }) : /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: n("Dashboard:Stat:Flat", "• sabit") }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary truncate", children: fe(t.requiredPermission) })
  ] });
}
const z = [
  { key: "project-management", labelKey: "Dashboard:View:ProjectManagement", fallback: "Proje Yönetimi" },
  { key: "finance", labelKey: "Dashboard:View:Finance", fallback: "Finans" },
  { key: "today", labelKey: "Dashboard:View:Today", fallback: "Bugün" },
  { key: "grants", labelKey: "Dashboard:View:Grants", fallback: "Hibe takibi" }
], ge = "project-management", J = {
  /* h=2 (140px): kutucuk içeriği ~122px. h=3 verilince ızgara kutusu
     içerikten ~75px yüksek kalıyor ve altındaki satırla arasında ölü boşluk
     oluşuyordu. minH de 2 olmalı — aksi halde RGL yüksekliği 3'e zorlar. */
  /* `band`: kart yatay bir şerittir — dar kırılımlarda yarım genişliğe
     düşürülmez, hep tam satır kaplar (içeriği kolonlara yayılıyor). */
  "summary-strip": { component: ia, titleKey: "Dashboard:Card:SummaryStrip", fallback: "Sayısal özet", w: 12, h: 2, minW: 6, minH: 2, band: !0 },
  deliveries: { component: ma, titleKey: "Dashboard:Deliveries:Title", fallback: "Bu ay teslim edilecekler", w: 7, h: 8, minW: 4, minH: 5 },
  "project-health": { component: fa, titleKey: "Dashboard:Health:Title", fallback: "Proje sağlığı", w: 5, h: 8, minW: 3, minH: 5 },
  approvals: { component: ja, titleKey: "Dashboard:Approvals:Title", fallback: "Bende bekleyen kararlar", w: 4, h: 6, minW: 3, minH: 4 },
  blockers: { component: ka, titleKey: "Dashboard:Blockers:Title", fallback: "Tıkanan işler & risk", w: 4, h: 6, minW: 3, minH: 4 },
  "ai-suggestions": { component: va, titleKey: "Dashboard:Ai:Title", fallback: "AI önerileri", w: 4, h: 6, minW: 3, minH: 3 },
  "income-expense": { component: Na, titleKey: "Dashboard:IncomeExpense:Title", fallback: "Gelir / gider", w: 4, h: 6, minW: 3, minH: 4 },
  "delivery-heatmap": { component: Sa, titleKey: "Dashboard:Heatmap:Title", fallback: "Teslim yoğunluğu", w: 4, h: 6, minW: 3, minH: 4 },
  "project-phases": { component: wa, titleKey: "Dashboard:Phases:Title", fallback: "Proje fazları", w: 4, h: 6, minW: 3, minH: 4 },
  "effort-distribution": { component: Ta, titleKey: "Dashboard:Effort:Title", fallback: "Efor dağılımı", w: 4, h: 6, minW: 3, minH: 4 },
  "statistics-band": { component: Ea, titleKey: "Dashboard:Statistics:Title", fallback: "İstatistikler", w: 12, h: 6, minW: 6, minH: 4, band: !0 }
}, ye = { desktop: 920, tablet: 560, mobile: 0 }, Pa = { desktop: 12, tablet: 6, mobile: 1 }, Aa = 64, Ra = [12, 12], nt = [0, 0];
function Ba(t) {
  return t >= ye.desktop ? "desktop" : t >= ye.tablet ? "tablet" : "mobile";
}
function Ia(t) {
  return Math.max(0, t - nt[0] * 2);
}
function La(t) {
  return t >= 1015 ? { template: "repeat(4, minmax(0, 2fr)) minmax(0, 3fr)", h: 2 } : t >= 694 ? { template: "repeat(3, minmax(0, 1fr))", h: 4 } : t >= 456 ? { template: "repeat(2, minmax(0, 1fr))", h: 6 } : { template: "repeat(2, minmax(0, 1fr))", h: 4, compact: !0 };
}
const rt = "apya-dashboard-view";
function Ma() {
  try {
    const t = window.localStorage.getItem(rt);
    return z.some((s) => s.key === t) ? t : ge;
  } catch {
    return ge;
  }
}
function Ha(t) {
  try {
    window.localStorage.setItem(rt, t);
  } catch {
  }
}
function Fa({ open: t, onOpenChange: s, presentCardKeys: a = [], onAdd: r }) {
  const [i, o] = x.useState(""), c = x.useMemo(() => {
    const l = i.trim().toLocaleLowerCase();
    return Object.entries(J).map(([d, u]) => ({ key: d, meta: u, label: n(u.titleKey, u.fallback) })).filter((d) => !l || d.label.toLocaleLowerCase().includes(l));
  }, [i]);
  return /* @__PURE__ */ e.jsx(ft, { open: t, onOpenChange: s, children: /* @__PURE__ */ e.jsx(gt, { side: "right", className: "w-[380px] mobile:w-full", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 p-5 h-full", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-base font-semibold text-text-primary", children: n("Dashboard:Catalog:Title", "Kart ekle") }),
      /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-text-tertiary", children: n("Dashboard:Catalog:Subtitle", "Eklediğin kart görünümün altına yerleşir; sürükleyip boyutlandırabilirsin.") })
    ] }),
    /* @__PURE__ */ e.jsx(
      yt,
      {
        value: i,
        onChange: (l) => o(l.target.value),
        placeholder: n("Dashboard:Catalog:Search", "Kart ara…"),
        "aria-label": n("Dashboard:Catalog:Search", "Kart ara…")
      }
    ),
    /* @__PURE__ */ e.jsxs("ul", { className: "flex flex-col gap-2 overflow-auto flex-1", children: [
      c.map(({ key: l, meta: d, label: u }) => {
        const m = a.includes(l);
        return /* @__PURE__ */ e.jsxs(
          "li",
          {
            className: p(
              "flex items-center justify-between gap-3 p-3 rounded-xl border",
              m ? "border-subtle bg-surface-sunken opacity-60" : "border-default bg-surface-base"
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
                G,
                {
                  size: "sm",
                  variant: m ? "ghost" : "secondary",
                  disabled: m,
                  onClick: () => r(l),
                  className: "flex-none",
                  children: m ? n("Dashboard:Catalog:Added", "Ekli") : n("Dashboard:Catalog:Add", "Ekle")
                }
              )
            ]
          },
          l
        );
      }),
      c.length === 0 && /* @__PURE__ */ e.jsx("li", { className: "text-[12.5px] text-text-tertiary py-4 text-center", children: n("Dashboard:Catalog:NoMatch", "Eşleşen kart yok.") })
    ] })
  ] }) }) });
}
const te = (() => {
  try {
    const t = document.getElementById("apya-dashboard-layout");
    return t ? JSON.parse(t.textContent) : null;
  } catch {
    return null;
  }
})();
function Ka(t) {
  const s = (te == null ? void 0 : te.viewKey) === t ? te : void 0;
  return R({
    queryKey: E.dashboard.layout(t),
    queryFn: () => ce.get(`/api/dashboard/layout?viewKey=${encodeURIComponent(t)}`),
    /* Düzen kullanıcıdan başkası değiştiremez → uzun taze kalır. */
    staleTime: 5 * 6e4,
    enabled: !!t,
    initialData: s
  });
}
function $a() {
  const t = oe();
  return Ue({
    mutationFn: ({ viewKey: s, cards: a }) => ce.put("/api/dashboard/layout", { viewKey: s, cards: a }),
    onSuccess: (s, { viewKey: a }) => {
      t.invalidateQueries({ queryKey: E.dashboard.layout(a) });
    }
  });
}
function Oa() {
  const t = oe();
  return Ue({
    mutationFn: (s) => ce.delete(`/api/dashboard/layout?viewKey=${encodeURIComponent(s)}`),
    onSuccess: (s, a) => {
      t.invalidateQueries({ queryKey: E.dashboard.layout(a) });
    }
  });
}
function Ga() {
  try {
    const t = document.getElementById("apya-dashboard-print-context");
    if (!t) return null;
    const s = JSON.parse(t.textContent);
    return s && typeof s == "object" ? s : null;
  } catch {
    return null;
  }
}
function Wa(t, s = /* @__PURE__ */ new Date()) {
  const a = new Date(s.getFullYear(), s.getMonth(), s.getDate());
  if (t === "Week") {
    const r = za(a);
    return { start: r, end: ae(r, 6) };
  }
  if (t === "Quarter") {
    const r = Math.floor(a.getMonth() / 3) * 3;
    return {
      start: new Date(a.getFullYear(), r, 1),
      end: ae(new Date(a.getFullYear(), r + 3, 1), -1)
    };
  }
  return {
    start: new Date(a.getFullYear(), a.getMonth(), 1),
    end: ae(new Date(a.getFullYear(), a.getMonth() + 1, 1), -1)
  };
}
function Ua(t, s) {
  const a = t.start.getMonth() === t.end.getMonth() && t.start.getFullYear() === t.end.getFullYear(), r = t.start.getFullYear() === t.end.getFullYear(), i = a ? { day: "numeric" } : r ? { day: "numeric", month: "long" } : { day: "numeric", month: "long", year: "numeric" };
  return `${t.start.toLocaleDateString(s, i)} – ` + t.end.toLocaleDateString(s, { day: "numeric", month: "long", year: "numeric" });
}
function _a(t, s) {
  return t.toLocaleDateString(s, { day: "numeric", month: "long", year: "numeric" }) + " " + t.toLocaleTimeString(s, { hour: "2-digit", minute: "2-digit" });
}
function za(t) {
  return ae(t, -((t.getDay() + 6) % 7));
}
function ae(t, s) {
  const a = new Date(t);
  return a.setDate(a.getDate() + s), a;
}
const Ie = {
  Week: ["Dashboard:Range:Week", "Bu hafta"],
  Month: ["Dashboard:Range:Month", "Bu ay"],
  Quarter: ["Dashboard:Range:Quarter", "Bu çeyrek"]
}, Le = {
  Overdue: ["Dashboard:Print:State:Overdue", "Gecikmiş"],
  InReview: ["Dashboard:Print:State:InReview", "Kontrolde"],
  OnTrack: ["Dashboard:Print:State:OnTrack", "Yolunda"],
  Upcoming: ["Dashboard:Print:State:Upcoming", "Yaklaşan"]
}, me = { Up: "▲", Down: "▼", Flat: "•" }, qa = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], b = "border-b border-neutral-500 pb-1 pe-3 text-start text-[7pt] font-bold uppercase tracking-wide text-neutral-600", y = "border-b border-neutral-200 py-[3px] pe-3 align-top text-[8.5pt] leading-tight", v = `${y} text-end font-mono tabular-nums whitespace-nowrap`;
function Ya({ viewKey: t, range: s, onReady: a }) {
  const r = x.useMemo(() => ({ range: s }), [s]), i = Ve(r), o = et(r), c = Qe(r), l = Xe(r), d = Je(), u = Ze(), m = tt(r), f = at(r), D = [i, o, c, l, d, u, m, f].every((I) => I.status !== "pending");
  x.useEffect(() => {
    D && (a == null || a());
  }, [D, a]);
  const k = Oe(), N = x.useMemo(() => Ga(), []), $ = x.useMemo(() => _a(/* @__PURE__ */ new Date(), k), [k]), M = x.useMemo(() => Wa(s), [s]), B = z.find((I) => I.key === t) ?? z.find((I) => I.key === ge) ?? z[0], [j, W] = Ie[s] ?? Ie.Month, S = {
    tenantName: N == null ? void 0 : N.tenantName,
    userName: N == null ? void 0 : N.userName,
    viewLabel: n(B.labelKey, B.fallback),
    rangeLabel: `${n(j, W)} · ${Ua(M, k)}`,
    stamp: $
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-print-root hidden print:block", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page", children: [
      /* @__PURE__ */ e.jsx(xe, { ...S, part: n("Dashboard:Print:Part1", "Özet & istatistikler") }),
      /* @__PURE__ */ e.jsx(Va, { query: i, locale: k }),
      /* @__PURE__ */ e.jsx(Qa, { query: o })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page apya-print-break", children: [
      /* @__PURE__ */ e.jsx(xe, { ...S, part: n("Dashboard:Print:Part2", "İş yükü") }),
      /* @__PURE__ */ e.jsx(Xa, { query: c, locale: k }),
      /* @__PURE__ */ e.jsx(Ja, { query: l }),
      /* @__PURE__ */ e.jsx(Za, { query: u })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page apya-print-break", children: [
      /* @__PURE__ */ e.jsx(xe, { ...S, part: n("Dashboard:Print:Part3", "Finans & teslim yoğunluğu") }),
      /* @__PURE__ */ e.jsx(es, { query: d, locale: k }),
      /* @__PURE__ */ e.jsx(ts, { query: m, locale: k }),
      /* @__PURE__ */ e.jsx(as, { query: f, locale: k })
    ] })
  ] });
}
function xe({ tenantName: t, userName: s, viewLabel: a, rangeLabel: r, stamp: i, part: o }) {
  return /* @__PURE__ */ e.jsxs("header", { className: "flex items-end justify-between gap-6 border-b-2 border-black pb-2 break-after-avoid", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsx("p", { className: "text-[8pt] font-bold uppercase tracking-widest text-neutral-500", children: n("Dashboard:Print:Eyebrow", "APYA · Genel Bakış") }),
      /* @__PURE__ */ e.jsx("h1", { className: "mt-1 text-[20pt] font-semibold leading-none", children: t || n("Dashboard:Title", "Genel Bakış") }),
      /* @__PURE__ */ e.jsxs("p", { className: "mt-1.5 text-[8.5pt] text-neutral-600", children: [
        n("Dashboard:Print:Meta:Period", "Dönem"),
        ": ",
        /* @__PURE__ */ e.jsx("strong", { className: "font-semibold", children: r }),
        " · ",
        n("Dashboard:Print:Meta:View", "Görünüm"),
        ": ",
        /* @__PURE__ */ e.jsx("strong", { className: "font-semibold", children: a })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-none text-end text-[8pt] leading-snug text-neutral-500", children: [
      /* @__PURE__ */ e.jsx("p", { className: "text-[9pt] font-semibold uppercase tracking-wide text-neutral-700", children: o }),
      s && /* @__PURE__ */ e.jsxs("p", { className: "mt-1", children: [
        n("Dashboard:Print:Meta:By", "Yazdıran"),
        ": ",
        s
      ] }),
      /* @__PURE__ */ e.jsx("p", { children: n("Dashboard:Print:Meta:At", "{0} tarihinde oluşturuldu", i) }),
      /* @__PURE__ */ e.jsx("p", { children: n("Dashboard:Print:Meta:Scope", "Liste ve istatistikler kırpılmadan basılır") })
    ] })
  ] });
}
function K({ title: t, meta: s, query: a, isEmpty: r, emptyText: i, children: o }) {
  return /* @__PURE__ */ e.jsxs("section", { className: "mt-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between gap-3 border-b border-black pb-1 break-after-avoid", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[10pt] font-bold uppercase tracking-wide", children: t }),
      s && /* @__PURE__ */ e.jsx("span", { className: "text-[8pt] text-neutral-600", children: s })
    ] }),
    a != null && a.isError ? /* @__PURE__ */ e.jsx(Me, { children: n("Dashboard:Print:SectionError", "Veri alınamadı.") }) : r ? /* @__PURE__ */ e.jsx(Me, { children: i }) : /* @__PURE__ */ e.jsx("div", { className: "mt-1.5", children: o })
  ] });
}
function Me({ children: t }) {
  return /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[8.5pt] italic text-neutral-500", children: t });
}
function Va({ query: t, locale: s }) {
  const a = t.data;
  return /* @__PURE__ */ e.jsx(
    K,
    {
      title: n("Dashboard:Card:SummaryStrip", "Sayısal özet"),
      query: t,
      isEmpty: !a,
      emptyText: n("Dashboard:Summary:Error", "Özet yüklenemedi."),
      children: a && /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-5 border-s border-t border-neutral-400 break-inside-avoid", children: [
        /* @__PURE__ */ e.jsx(
          X,
          {
            label: n("Dashboard:Summary:DueThisPeriod", "Bu dönem teslim"),
            value: a.dueThisPeriod,
            note: n("Dashboard:Summary:DueThisWeek", "{0} bu hafta", a.dueThisWeek)
          }
        ),
        /* @__PURE__ */ e.jsx(
          X,
          {
            label: n("Dashboard:Summary:Overdue", "Gecikmiş"),
            value: a.overdue,
            note: [
              a.oldestOverdueDays != null ? n("Dashboard:Summary:OldestOverdue", "en eski {0} g", a.oldestOverdueDays) : null,
              n("Dashboard:Summary:OverdueProjects", "{0} projede", a.overdueProjectCount)
            ].filter(Boolean).join(" · ")
          }
        ),
        /* @__PURE__ */ e.jsx(
          X,
          {
            label: n("Dashboard:Summary:Blocked", "Tıkanan iş"),
            value: a.blocked,
            note: n("Dashboard:Summary:BlockedAvg", "ort. {0} g", Fe(a.blockedAvgIdleDays, 1))
          }
        ),
        /* @__PURE__ */ e.jsx(
          X,
          {
            label: n("Dashboard:Summary:PendingApprovals", "Bende onay"),
            value: a.pendingApprovals,
            locked: a.pendingApprovals == null,
            permission: n("Permission:Invoices", "Faturalar"),
            note: [
              a.pendingApprovalAmount != null ? A(a.pendingApprovalAmount, a.currency, s) : null,
              a.pendingApprovalAvgAgeHours != null ? n("Dashboard:Summary:AvgWait", "ortalama bekleme {0} sa", Fe(a.pendingApprovalAvgAgeHours, 0)) : null
            ].filter(Boolean).join(" · ")
          }
        ),
        /* @__PURE__ */ e.jsx(
          X,
          {
            label: n("Dashboard:Summary:BudgetUsage", "Bütçe kullanımı"),
            value: a.budgetUsedRatio != null ? `%${Math.round(a.budgetUsedRatio * 100)}` : null,
            locked: a.budgetUsedRatio == null && a.budgetTotal == null,
            permission: n("Permission:Projects.ViewBudget", "Bütçe Görüntüleme"),
            note: a.budgetTotal != null ? `${A(a.budgetSpent, a.currency, s)} / ${A(a.budgetTotal, a.currency, s)}` : null
          }
        )
      ] })
    }
  );
}
function X({ label: t, value: s, note: a, locked: r, permission: i }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "border-b border-e border-neutral-400 p-2", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[8pt] font-medium text-neutral-600", children: t }),
    /* @__PURE__ */ e.jsx("p", { className: "mt-1 font-mono text-[17pt] font-semibold leading-none tabular-nums", children: r ? "— —" : s ?? "—" }),
    r ? /* @__PURE__ */ e.jsxs("p", { className: "mt-1 text-[7.5pt] text-neutral-500", children: [
      n("Dashboard:Stat:Locked", "yetki gerekli"),
      " · ",
      /* @__PURE__ */ e.jsx("span", { className: "font-mono", children: i })
    ] }) : a && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[7.5pt] text-neutral-500", children: a })
  ] });
}
function Qa({ query: t }) {
  const s = t.data ?? [], a = s.filter((r) => r.locked).length;
  return /* @__PURE__ */ e.jsx(
    K,
    {
      title: n("Dashboard:Statistics:Title", "İstatistikler"),
      meta: s.length > 0 ? n(
        "Dashboard:Statistics:Subtitle",
        "{0} istatistikten {1}'i yetkinde · {2}'si kilitli",
        s.length,
        s.length - a,
        a
      ) : null,
      query: t,
      isEmpty: s.length === 0,
      emptyText: n("Dashboard:Print:Statistics:Empty", "Bu dönem için istatistik üretilmedi."),
      children: /* @__PURE__ */ e.jsx("div", { className: "columns-2 gap-6", children: st.map(([r, i, o]) => {
        const c = s.filter((l) => l.group === r);
        return c.length === 0 ? null : /* @__PURE__ */ e.jsxs("div", { className: "mb-3 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[8.5pt] font-bold uppercase tracking-wide", children: n(i, o) }),
          /* @__PURE__ */ e.jsxs("table", { className: "mt-1 w-full border-collapse", children: [
            /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
              /* @__PURE__ */ e.jsx("th", { className: b, children: n("Dashboard:Print:Col:Stat", "İstatistik") }),
              /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: n("Dashboard:Print:Col:Value", "Değer") }),
              /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: n("Dashboard:Print:Col:Delta", "Değişim") })
            ] }) }),
            /* @__PURE__ */ e.jsx("tbody", { children: c.map((l) => /* @__PURE__ */ e.jsxs("tr", { children: [
              /* @__PURE__ */ e.jsxs("td", { className: y, children: [
                l.label,
                /* @__PURE__ */ e.jsx("span", { className: "block font-mono text-[6.5pt] text-neutral-400", children: fe(l.requiredPermission) })
              ] }),
              /* @__PURE__ */ e.jsx("td", { className: v, children: l.locked ? "— —" : l.formatted || "—" }),
              /* @__PURE__ */ e.jsx("td", { className: v, children: l.locked ? n("Dashboard:Stat:Locked", "yetki gerekli") : l.deltaFormatted ? `${me[l.trend] ?? me.Flat} ${l.deltaFormatted}` : me.Flat })
            ] }, l.key)) })
          ] })
        ] }, r);
      }) })
    }
  );
}
function Xa({ query: t, locale: s }) {
  const a = t.data ?? [], r = a.filter((i) => i.state === "Overdue").length;
  return /* @__PURE__ */ e.jsx(
    K,
    {
      title: n("Dashboard:Deliveries:Title", "Bu ay teslim edilecekler"),
      meta: a.length > 0 ? n("Dashboard:Deliveries:Subtitle", "{0} iş · {1} gecikmiş", a.length, r) : null,
      query: t,
      isEmpty: a.length === 0,
      emptyText: n("Dashboard:Deliveries:EmptyDescription", "Son tarihi bu döneme düşen açık iş bulunmuyor."),
      children: pe.map((i) => {
        const o = a.filter((d) => d.groupKey === i);
        if (o.length === 0) return null;
        const [c, l] = be[i];
        return /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "text-[8.5pt] font-bold uppercase tracking-wide break-after-avoid", children: [
            n(c, l),
            " · ",
            o.length
          ] }),
          /* @__PURE__ */ e.jsxs("table", { className: "mt-1 w-full border-collapse", children: [
            /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
              /* @__PURE__ */ e.jsx("th", { className: `${b} w-[14px]`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("th", { className: b, children: n("Dashboard:Print:Col:Task", "İş") }),
              /* @__PURE__ */ e.jsx("th", { className: b, children: n("Dashboard:Print:Col:Project", "Proje") }),
              /* @__PURE__ */ e.jsx("th", { className: b, children: n("Dashboard:Print:Col:Assignee", "Sorumlu") }),
              /* @__PURE__ */ e.jsx("th", { className: b, children: n("Dashboard:Print:Col:State", "Durum") }),
              /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: n("Dashboard:Print:Col:Due", "Son tarih") })
            ] }) }),
            /* @__PURE__ */ e.jsx("tbody", { children: o.map((d) => {
              const [u, m] = Le[d.state] ?? Le.Upcoming;
              return /* @__PURE__ */ e.jsxs("tr", { children: [
                /* @__PURE__ */ e.jsx("td", { className: y, children: /* @__PURE__ */ e.jsx(ve, {}) }),
                /* @__PURE__ */ e.jsx("td", { className: `${y} ${d.state === "Overdue" ? "font-semibold" : ""}`, children: d.title }),
                /* @__PURE__ */ e.jsx("td", { className: y, children: d.projectName || "—" }),
                /* @__PURE__ */ e.jsx("td", { className: y, children: d.assigneeName || "—" }),
                /* @__PURE__ */ e.jsxs("td", { className: y, children: [
                  n(u, m),
                  d.state === "Overdue" && d.overdueDays != null && ` · ${n("Dashboard:Deliveries:OverdueDays", "{0} gün gecikmiş", d.overdueDays)}`
                ] }),
                /* @__PURE__ */ e.jsx("td", { className: v, children: je(d.dueDate, s) })
              ] }, d.taskId);
            }) })
          ] })
        ] }, i);
      })
    }
  );
}
function ve() {
  return /* @__PURE__ */ e.jsx("span", { className: "mt-[2px] block h-[9px] w-[9px] border border-neutral-600", "aria-hidden": "true" });
}
function Ja({ query: t }) {
  const s = t.data ?? [];
  return /* @__PURE__ */ e.jsx(
    K,
    {
      title: n("Dashboard:Health:Title", "Proje sağlığı"),
      meta: s.length > 0 ? n("Dashboard:Health:Subtitle", "{0} aktif proje", s.length) : null,
      query: t,
      isEmpty: s.length === 0,
      emptyText: n("Dashboard:Health:EmptyDescription", "Proje oluşturunca sağlık göstergeleri burada belirir."),
      children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse", children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { className: b, children: n("Dashboard:Print:Col:Project", "Proje") }),
          /* @__PURE__ */ e.jsx("th", { className: b, children: n("Dashboard:Print:Col:State", "Durum") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: n("Dashboard:Print:Col:DaysLeft", "Kalan gün") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: n("Dashboard:Print:Col:Budget", "Bütçe") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: n("Dashboard:Print:Col:Time", "Süre") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: n("Dashboard:Print:Col:Tasks", "Görev") })
        ] }) }),
        /* @__PURE__ */ e.jsx("tbody", { children: s.map((a) => {
          const [, r, i] = ie[a.state] ?? ie.Healthy;
          return /* @__PURE__ */ e.jsxs("tr", { children: [
            /* @__PURE__ */ e.jsx("td", { className: y, children: a.name }),
            /* @__PURE__ */ e.jsx("td", { className: `${y} ${a.state === "Risky" ? "font-semibold" : ""}`, children: n(r, i) }),
            /* @__PURE__ */ e.jsx("td", { className: v, children: a.daysRemaining ?? "—" }),
            /* @__PURE__ */ e.jsx("td", { className: v, children: He(a.budgetRatio) }),
            /* @__PURE__ */ e.jsx("td", { className: v, children: He(a.timeRatio) }),
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
function Za({ query: t }) {
  const s = t.data ?? [];
  return /* @__PURE__ */ e.jsx(
    K,
    {
      title: n("Dashboard:Blockers:Title", "Tıkanan işler & risk"),
      meta: s.length > 0 ? n("Dashboard:Print:Count", "{0} kayıt", s.length) : null,
      query: t,
      isEmpty: s.length === 0,
      emptyText: n("Dashboard:Blockers:EmptyDescription", "Açık işlerin hepsi son günlerde hareket görmüş."),
      children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse", children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { className: `${b} w-[14px]`, "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("th", { className: b, children: n("Dashboard:Print:Col:Code", "Kod") }),
          /* @__PURE__ */ e.jsx("th", { className: b, children: n("Dashboard:Print:Col:Task", "İş") }),
          /* @__PURE__ */ e.jsx("th", { className: b, children: n("Dashboard:Print:Col:Reason", "Sebep") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: n("Dashboard:Print:Col:Idle", "Hareketsiz") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: n("Dashboard:Print:Col:Dependents", "Bağımlı") })
        ] }) }),
        /* @__PURE__ */ e.jsx("tbody", { children: s.map((a) => {
          const [, r, i] = le[a.blockReason] ?? le.Dependency;
          return /* @__PURE__ */ e.jsxs("tr", { children: [
            /* @__PURE__ */ e.jsx("td", { className: y, children: /* @__PURE__ */ e.jsx(ve, {}) }),
            /* @__PURE__ */ e.jsx("td", { className: `${y} font-mono`, children: a.code }),
            /* @__PURE__ */ e.jsx("td", { className: y, children: a.title }),
            /* @__PURE__ */ e.jsx("td", { className: y, children: n(r, i) }),
            /* @__PURE__ */ e.jsx("td", { className: v, children: n("Dashboard:Health:DaysLeft", "{0} gün", a.idleDays) }),
            /* @__PURE__ */ e.jsx("td", { className: v, children: a.dependentCount })
          ] }, a.taskId);
        }) })
      ] })
    }
  );
}
function es({ query: t, locale: s }) {
  var d;
  const a = t.data, r = (a == null ? void 0 : a.locked) === !0, i = Array.isArray(a) ? a : (a == null ? void 0 : a.items) ?? [], o = i.reduce((u, m) => u + (m.amount ?? 0), 0), c = i.length ? Math.round(i.reduce((u, m) => u + m.ageHours, 0) / i.length) : 0, l = ((d = i[0]) == null ? void 0 : d.currency) ?? "TRY";
  return /* @__PURE__ */ e.jsx(
    K,
    {
      title: n("Dashboard:Approvals:Title", "Bende bekleyen kararlar"),
      meta: i.length > 0 ? n("Dashboard:Approvals:Total", "Toplam {0} · ort. bekleme {1} sa", A(o, l, s), c) : null,
      query: t,
      isEmpty: r || i.length === 0,
      emptyText: r ? n("Dashboard:Print:Locked", "Bu bölümü görme yetkiniz yok ({0}).", n("Permission:Invoices", "Faturalar")) : n("Dashboard:Approvals:EmptyDescription", "Taslak durumdaki fatura bulunmuyor."),
      children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse", children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { className: `${b} w-[14px]`, "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("th", { className: b, children: n("Dashboard:Print:Col:Record", "Kayıt") }),
          /* @__PURE__ */ e.jsx("th", { className: b, children: n("Dashboard:Print:Col:Requester", "Talep eden") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: n("Dashboard:Print:Col:Age", "Bekleme") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: n("Dashboard:Print:Col:Amount", "Tutar") })
        ] }) }),
        /* @__PURE__ */ e.jsx("tbody", { children: i.map((u) => /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("td", { className: y, children: /* @__PURE__ */ e.jsx(ve, {}) }),
          /* @__PURE__ */ e.jsx("td", { className: y, children: u.title }),
          /* @__PURE__ */ e.jsx("td", { className: y, children: u.requesterName || "—" }),
          /* @__PURE__ */ e.jsxs("td", { className: v, children: [
            u.ageHours,
            " sa"
          ] }),
          /* @__PURE__ */ e.jsx("td", { className: v, children: A(u.amount, u.currency, s) })
        ] }, u.id)) })
      ] })
    }
  );
}
function ts({ query: t, locale: s }) {
  const a = t.data, r = (a == null ? void 0 : a.locked) === !0, i = (a == null ? void 0 : a.points) ?? [], o = (a == null ? void 0 : a.currency) ?? "TRY", c = i.some((l) => l.income > 0 || l.expense > 0);
  return /* @__PURE__ */ e.jsx(
    K,
    {
      title: n("Dashboard:IncomeExpense:Title", "Gelir / gider"),
      meta: n("Dashboard:IncomeExpense:Subtitle", "Son 6 ay"),
      query: t,
      isEmpty: r || !c,
      emptyText: r ? n("Dashboard:Print:LockedBoth", "Bu bölümü görme yetkiniz yok ({0} ve {1}).", n("Permission:Incomes", "Gelirler"), n("Permission:Expenses", "Giderler")) : n("Dashboard:IncomeExpense:EmptyDescription", "Son 6 ayda gelir veya gider kaydı bulunmuyor."),
      children: /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse break-inside-avoid", children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { className: b, children: n("Dashboard:Print:Col:Month", "Ay") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: n("Dashboard:IncomeExpense:Income", "Gelir") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: n("Dashboard:IncomeExpense:Expense", "Gider") }),
          /* @__PURE__ */ e.jsx("th", { className: `${b} text-end`, children: n("Dashboard:IncomeExpense:Net", "net") })
        ] }) }),
        /* @__PURE__ */ e.jsxs("tbody", { children: [
          i.map((l) => /* @__PURE__ */ e.jsxs("tr", { children: [
            /* @__PURE__ */ e.jsx("td", { className: y, children: ss(l.month, s) }),
            /* @__PURE__ */ e.jsx("td", { className: v, children: A(l.income, o, s) }),
            /* @__PURE__ */ e.jsx("td", { className: v, children: A(l.expense, o, s) }),
            /* @__PURE__ */ e.jsx("td", { className: v, children: A(l.income - l.expense, o, s) })
          ] }, l.month)),
          /* @__PURE__ */ e.jsxs("tr", { children: [
            /* @__PURE__ */ e.jsx("td", { className: `${y} font-semibold`, colSpan: 3, children: n("Dashboard:Print:PeriodNet", "Dönem neti") }),
            /* @__PURE__ */ e.jsx("td", { className: `${v} font-semibold`, children: A((a == null ? void 0 : a.net) ?? 0, o, s) })
          ] })
        ] })
      ] })
    }
  );
}
function as({ query: t, locale: s }) {
  const a = t.data ?? [], r = [];
  for (let o = 0; o < a.length; o += 7) r.push(a.slice(o, o + 7));
  const i = a.reduce((o, c) => c.count > ((o == null ? void 0 : o.count) ?? 0) ? c : o, null);
  return /* @__PURE__ */ e.jsxs(
    K,
    {
      title: n("Dashboard:Heatmap:Title", "Teslim yoğunluğu"),
      meta: n("Dashboard:Heatmap:Subtitle", "Önümüzdeki 4 hafta · hafta × gün"),
      query: t,
      isEmpty: a.length === 0,
      emptyText: n("Dashboard:Heatmap:EmptyDescription", "Önümüzdeki 4 haftada son tarihi olan iş bulunmuyor."),
      children: [
        /* @__PURE__ */ e.jsxs("table", { className: "w-full border-collapse break-inside-avoid", children: [
          /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { children: qa.map((o) => /* @__PURE__ */ e.jsx("th", { className: `${b} text-center`, children: o }, o)) }) }),
          /* @__PURE__ */ e.jsx("tbody", { children: r.map((o) => /* @__PURE__ */ e.jsx("tr", { children: o.map((c) => /* @__PURE__ */ e.jsxs("td", { className: `${y} text-center`, children: [
            /* @__PURE__ */ e.jsxs("span", { className: "block font-mono text-[7pt] text-neutral-500", children: [
              je(c.date, s),
              c.isGrantDeadline ? " ✱" : ""
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: `block font-mono tabular-nums ${c.count > 0 ? "font-semibold" : "text-neutral-400"}`, children: c.count })
          ] }, c.date)) }, o[0].date)) })
        ] }),
        /* @__PURE__ */ e.jsxs("p", { className: "mt-1 text-[7.5pt] text-neutral-500", children: [
          i && i.count > 0 ? n(
            "Dashboard:Heatmap:Busiest",
            "En yoğun gün {0} ({1} teslim) · sarı: hibe son tarihi",
            je(i.date, s),
            i.count
          ) : n("Dashboard:Heatmap:NoneScheduled", "Bu pencerede teslim planlanmamış · sarı: hibe son tarihi"),
          " · ",
          n("Dashboard:Print:GrantMark", "✱ hibe son tarihi")
        ] })
      ]
    }
  );
}
function je(t, s) {
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? "—" : a.toLocaleDateString(s, { day: "numeric", month: "short" });
}
function ss(t, s) {
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? "—" : a.toLocaleDateString(s, { month: "long", year: "numeric" });
}
function He(t) {
  return t == null ? "—" : `%${Math.round(t * 100)}`;
}
function Fe(t, s) {
  return typeof t != "number" || !Number.isFinite(t) ? "—" : s > 0 ? Number(t.toFixed(s)) : Math.round(t);
}
const it = [
  ["Month", "Dashboard:Range:Month", "Bu ay"],
  ["Week", "Dashboard:Range:Week", "Bu hafta"],
  ["Quarter", "Dashboard:Range:Quarter", "Bu çeyrek"]
];
function ns() {
  var Te, Ee;
  const [t, s] = x.useState(() => Ma()), [a, r] = x.useState(() => us()), [i, o] = x.useState(!1), [c, l] = x.useState(!1), [d, u] = x.useState(null), [m, f] = x.useState("idle"), D = x.useRef(!1), k = Ka(t), N = $a(), $ = Oa(), M = We(), B = x.useMemo(() => ({ range: a }), [a]), j = d ?? ((Te = k.data) == null ? void 0 : Te.cards) ?? [], W = x.useRef(null), [S, I] = x.useState(null);
  x.useLayoutEffect(() => {
    const h = W.current;
    if (!h) return;
    const w = () => I(h.clientWidth);
    w();
    const P = new ResizeObserver(w);
    return P.observe(h), () => P.disconnect();
  }, []);
  const O = S == null ? null : Ba(S), H = x.useMemo(
    () => La(S == null ? 0 : Ia(S)),
    [S]
  ), V = x.useMemo(
    () => ({ desktop: j.map((h) => ds(h, H.h)) }),
    [j, H.h]
  ), Ne = x.useCallback(() => {
    if (m === "ready") {
      window.print();
      return;
    }
    f((h) => h === "idle" ? "preparing" : h);
  }, [m]), ct = x.useCallback(() => {
    D.current || (D.current = !0, f("ready"), window.requestAnimationFrame(() => window.print()));
  }, []), Se = x.useCallback((h) => {
    s(h), Ha(h), u(null), o(!1);
  }, []), dt = x.useCallback((h) => {
    i && O === "desktop" && u((w) => {
      const P = w ?? j;
      return h.map((F) => {
        const Q = P.find((Z) => Z.cardKey === F.i);
        return {
          cardKey: F.i,
          /* Enum SAYI olarak gidip gelir; string göndermek
             deserialization hatası verir (JsonStringEnumConverter yok). */
          chartType: (Q == null ? void 0 : Q.chartType) ?? Pe,
          x: F.x,
          y: F.y,
          w: F.w,
          h: F.h
        };
      });
    });
  }, [i, j, O]), we = O === "desktop", ut = x.useCallback(() => {
    N.mutate(
      { viewKey: t, cards: d ?? j },
      {
        onSuccess: () => {
          u(null), o(!1);
        },
        onError: (h) => M.error(
          (h == null ? void 0 : h.message) || n("Dashboard:Layout:SaveError", "Düzen kaydedilemedi.")
        )
      }
    );
  }, [N, t, d, j, M]), mt = x.useCallback(() => {
    $.mutate(t, {
      onSuccess: () => {
        u(null), o(!1);
      },
      onError: (h) => M.error(
        (h == null ? void 0 : h.message) || n("Dashboard:Layout:ResetError", "Düzen sıfırlanamadı.")
      )
    });
  }, [$, t, M]), xt = x.useCallback((h) => {
    const w = J[h];
    if (!w) return;
    const P = d ?? j, F = P.reduce((Q, Z) => Math.max(Q, Z.y + Z.h), 0);
    u([
      ...P,
      { cardKey: h, chartType: Pe, x: 0, y: F, w: w.w, h: w.h }
    ]), l(!1), o(!0);
  }, [d, j]), ht = x.useCallback((h) => {
    u((d ?? j).filter((P) => P.cardKey !== h));
  }, [d, j]), pt = /* @__PURE__ */ e.jsxs("div", { className: "hidden mobile:grid grid-cols-2 gap-2", style: { gridColumn: "1 / -1" }, children: [
    /* @__PURE__ */ e.jsx(ls, { value: t, onChange: Se, className: "w-full" }),
    /* @__PURE__ */ e.jsx(ot, { value: a, onChange: r, className: "w-full" }),
    /* @__PURE__ */ e.jsx(lt, { onPrint: Ne, printState: m, className: "w-full", style: { gridColumn: "1 / -1" } })
  ] });
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-app-bg", children: [
    /* @__PURE__ */ e.jsx(
      is,
      {
        viewKey: t,
        onViewChange: Se,
        range: a,
        onRangeChange: r,
        editMode: i,
        canEdit: we,
        onToggleEdit: () => o((h) => !h),
        onOpenCatalog: () => l(!0),
        onPrint: Ne,
        printState: m
      }
    ),
    i && /* @__PURE__ */ e.jsx(
      os,
      {
        onSave: ut,
        isSaving: N.isPending
      }
    ),
    /* @__PURE__ */ e.jsxs("main", { className: "px-[18px] pt-4 pb-[18px] mobile:px-3 mobile:pt-3", children: [
      /* @__PURE__ */ e.jsx("div", { ref: W, children: S != null && (O === "desktop" ? /* @__PURE__ */ e.jsx(
        Tt.Responsive,
        {
          width: S,
          className: p("apya-dashboard-grid", i && "apya-dashboard-grid--edit"),
          layouts: V,
          breakpoints: ye,
          cols: Pa,
          rowHeight: Aa,
          margin: Ra,
          containerPadding: nt,
          isDraggable: i,
          isResizable: i,
          draggableHandle: `.${C.DRAG_HANDLE_CLASS}`,
          onLayoutChange: dt,
          compactType: "vertical",
          preventCollision: !1,
          children: j.map((h) => {
            const w = J[h.cardKey];
            if (!w) return /* @__PURE__ */ e.jsx("div", {}, h.cardKey);
            const P = w.component;
            return /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ e.jsx(
                P,
                {
                  filter: B,
                  editMode: i,
                  ...h.cardKey === "summary-strip" ? { template: H.template, compact: H.compact } : null
                }
              ),
              i && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => ht(h.cardKey),
                  "aria-label": n("Dashboard:RemoveCard", "Kartı kaldır"),
                  className: p(
                    "absolute top-2 right-2 z-10 w-6 h-6 rounded-lg",
                    "bg-surface-base border border-default text-text-secondary",
                    "hover:text-negative-500 hover:border-strong",
                    "focus-visible:outline-none focus-visible:shadow-focus"
                  ),
                  children: "×"
                }
              )
            ] }, h.cardKey);
          })
        }
      ) : /* @__PURE__ */ e.jsx(
        rs,
        {
          tier: O,
          cards: j,
          filter: B,
          strip: H,
          filters: pt
        }
      )) }),
      /* @__PURE__ */ e.jsx(
        cs,
        {
          isDefault: ((Ee = k.data) == null ? void 0 : Ee.isDefault) !== !1,
          canEdit: we,
          onReset: mt,
          onOpenCatalog: () => l(!0),
          isResetting: $.isPending
        }
      )
    ] }),
    m !== "idle" && /* @__PURE__ */ e.jsx(Ya, { viewKey: t, range: a, onReady: ct }),
    /* @__PURE__ */ e.jsx(
      Fa,
      {
        open: c,
        onOpenChange: l,
        presentCardKeys: j.map((h) => h.cardKey),
        onAdd: xt
      }
    )
  ] });
}
function rs({ tier: t, cards: s, filter: a, strip: r, filters: i }) {
  const o = t === "tablet" ? 2 : 1, c = s.findIndex((l) => l.cardKey === "summary-strip");
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: p("grid items-stretch", t === "tablet" ? "gap-3.5" : "gap-3"),
      style: { gridTemplateColumns: `repeat(${o}, minmax(0, 1fr))` },
      children: [
        c < 0 && i,
        s.map((l, d) => {
          const u = J[l.cardKey];
          if (!u) return null;
          const m = u.component, f = o > 1 && u.band;
          return /* @__PURE__ */ e.jsxs(ke.Fragment, { children: [
            /* @__PURE__ */ e.jsx("div", { style: f ? { gridColumn: "1 / -1" } : void 0, children: /* @__PURE__ */ e.jsx(
              m,
              {
                filter: a,
                editMode: !1,
                ...l.cardKey === "summary-strip" ? { template: r.template, compact: r.compact } : null
              }
            ) }),
            d === c && i
          ] }, l.cardKey);
        })
      ]
    }
  );
}
function is({
  viewKey: t,
  onViewChange: s,
  range: a,
  onRangeChange: r,
  editMode: i,
  canEdit: o,
  onToggleEdit: c,
  onOpenCatalog: l,
  onPrint: d,
  printState: u
}) {
  return /* @__PURE__ */ e.jsxs("header", { className: "px-[18px] py-2.5 bg-surface-base border-b border-default flex items-center gap-3 flex-wrap mobile:hidden", children: [
    /* @__PURE__ */ e.jsx("h1", { className: "text-[17px] font-semibold tracking-[-0.02em] text-text-primary m-0 whitespace-nowrap", children: n("Dashboard:Title", "Genel Bakış") }),
    /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", className: "w-px h-[18px] bg-border-default flex-none" }),
    /* @__PURE__ */ e.jsx("nav", { className: "flex items-center gap-1 flex-wrap", "aria-label": n("Dashboard:Views", "Görünümler"), children: z.map((m) => /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        onClick: () => s(m.key),
        "aria-current": m.key === t ? "page" : void 0,
        className: p(
          "inline-flex items-center h-[30px] px-3 rounded-[9px] text-[12.5px] transition-colors duration-fast",
          "focus-visible:outline-none focus-visible:shadow-focus",
          m.key === t ? "bg-text-primary text-surface-base font-semibold" : "text-text-secondary font-medium hover:bg-surface-sunken hover:text-text-primary"
        ),
        children: n(m.labelKey, m.fallback)
      },
      m.key
    )) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-none ml-auto", children: [
      /* @__PURE__ */ e.jsx(ot, { value: a, onChange: r }),
      /* @__PURE__ */ e.jsx(lt, { onPrint: d, printState: u }),
      o && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(G, { size: "sm", variant: "secondary", onClick: l, children: n("Dashboard:AddCard", "+ Kart ekle") }),
        /* @__PURE__ */ e.jsx(G, { size: "sm", variant: "primary", onClick: c, children: i ? n("Common:Done", "Bitir") : n("Common:Edit", "Düzenle") })
      ] })
    ] })
  ] });
}
function lt({ onPrint: t, printState: s, className: a, style: r }) {
  return /* @__PURE__ */ e.jsx(
    G,
    {
      size: "sm",
      variant: "secondary",
      onClick: t,
      disabled: s === "preparing",
      title: n("Dashboard:Print:Hint", "A4 yatay · tüm bölümler, kırpılmadan"),
      className: a,
      style: r,
      children: s === "preparing" ? n("Dashboard:Print:Preparing", "Hazırlanıyor…") : n("Dashboard:Print:Action", "Yazdır")
    }
  );
}
function ls({ value: t, onChange: s, className: a }) {
  return /* @__PURE__ */ e.jsxs("label", { className: p("hidden mobile:inline-flex items-center flex-1 min-w-0", a), children: [
    /* @__PURE__ */ e.jsx("span", { className: "sr-only", children: n("Dashboard:SelectView", "Görünüm seç") }),
    /* @__PURE__ */ e.jsx(
      "select",
      {
        value: t,
        onChange: (r) => s(r.target.value),
        className: p(
          "h-8 w-full px-3 rounded-[9px] text-[12.5px] font-medium",
          "bg-surface-sunken text-text-secondary border-0",
          /* Mobilde kutu, başlık şeridinin beyazı yerine gri sayfa
             zemininin üstünde duruyor; sunken (#F3F4F6) o zeminle
             (#F5F5F5) neredeyse aynı → kartlarla aynı beyaz+çerçeve. */
          "mobile:bg-surface-base mobile:border mobile:border-default",
          "focus-visible:outline-none focus-visible:shadow-focus"
        ),
        children: z.map((r) => /* @__PURE__ */ e.jsx("option", { value: r.key, children: n(r.labelKey, r.fallback) }, r.key))
      }
    )
  ] });
}
function ot({ value: t, onChange: s, className: a }) {
  return /* @__PURE__ */ e.jsxs("label", { className: p("inline-flex items-center", a), children: [
    /* @__PURE__ */ e.jsx("span", { className: "sr-only", children: n("Dashboard:SelectRange", "Zaman aralığı seç") }),
    /* @__PURE__ */ e.jsx(
      "select",
      {
        value: t,
        onChange: (r) => {
          s(r.target.value), ms(r.target.value);
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
        children: it.map(([r, i, o]) => /* @__PURE__ */ e.jsx("option", { value: r, children: n(i, o) }, r))
      }
    )
  ] });
}
function os({ onSave: t, isSaving: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-6 py-2.5 bg-accent-soft border-b border-default mobile:px-3 mobile:flex-wrap", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center h-[26px] px-2.5 rounded-lg bg-accent text-white text-[11.5px] font-semibold", children: n("Dashboard:EditMode", "Düzenleme modu") }),
      /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center h-[26px] px-2.5 rounded-lg bg-surface-base border border-default text-accent-600 text-[11.5px]", children: n("Dashboard:EditMode:Snap", "Yapış: 12 kolon · 64px satır") })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] text-accent-600 mobile:hidden", children: n("Dashboard:EditMode:Hint", "Kartı başlıktaki ⠿ tutamağından sürükle") }),
      /* @__PURE__ */ e.jsx(G, { size: "sm", variant: "primary", onClick: t, disabled: s, children: n("Dashboard:EditMode:Save", "Düzeni kaydet") })
    ] })
  ] });
}
function cs({ isDefault: t, canEdit: s, onReset: a, onOpenCatalog: r, isResetting: i }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 mt-3 px-4 py-3 rounded-card border border-dashed border-default bg-surface-base mobile:flex-col mobile:items-stretch", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-secondary", children: t ? n("Dashboard:Footer:DefaultLayout", "Bu görünüm rol varsayılanından geldi — kart ekleyip çıkarabilir, sürükleyip boyutlandırabilirsin.") : n("Dashboard:Footer:CustomLayout", "Bu görünümü sen düzenledin. Dilediğin an varsayılana dönebilirsin.") }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      !t && /* @__PURE__ */ e.jsx(G, { size: "sm", variant: "secondary", onClick: a, disabled: i, children: n("Dashboard:Footer:Reset", "Varsayılana dön") }),
      s && /* @__PURE__ */ e.jsx(G, { size: "sm", variant: "primary", onClick: r, children: n("Dashboard:AddCard", "+ Kart ekle") })
    ] })
  ] });
}
function ds(t, s) {
  const a = J[t.cardKey], r = t.cardKey === "summary-strip";
  return {
    i: t.cardKey,
    x: t.x,
    y: t.y,
    w: t.w,
    h: r ? s : t.h,
    minW: (a == null ? void 0 : a.minW) ?? 2,
    minH: r ? s : (a == null ? void 0 : a.minH) ?? 2
  };
}
function us() {
  try {
    const t = new URLSearchParams(window.location.search).get("range");
    return it.some(([s]) => s === t) ? t : "Month";
  } catch {
    return "Month";
  }
}
function ms(t) {
  try {
    const s = new URLSearchParams(window.location.search);
    s.set("range", t), window.history.replaceState(null, "", `${window.location.pathname}?${s}`);
  } catch {
  }
}
function xs(t) {
  const { connection: s, state: a } = ze(), r = oe();
  x.useEffect(() => {
    if (!s || !(t != null && t.length)) return;
    const i = t.map(([o, c]) => {
      const l = () => {
        c.forEach((d) => {
          r.invalidateQueries({ queryKey: d });
        });
      };
      return s.on(o, l), [o, l];
    });
    return () => {
      i.forEach(([o, c]) => {
        s.off(o, c);
      });
    };
  }, [s, a, r]);
}
function hs(t) {
  const { connection: s, state: a } = ze(), r = oe(), i = We();
  x.useEffect(() => {
    if (!s || !(t != null && t.length)) return;
    const o = t.map(([c, l]) => {
      const d = (u) => {
        var m;
        (m = l.queryKeys) == null || m.forEach(
          (f) => r.invalidateQueries({ queryKey: f })
        ), i.warning(l.message ?? "Bu kayıtta çakışma oldu", {
          description: l.description ?? (u == null ? void 0 : u.message),
          action: {
            label: "Yenile",
            onClick: () => {
              var f;
              (f = l.queryKeys) == null || f.forEach(
                (D) => r.invalidateQueries({ queryKey: D })
              );
            }
          }
        });
      };
      return s.on(c, d), [c, d];
    });
    return () => {
      o.forEach(([c, l]) => s.off(c, l));
    };
  }, [s, a, r]);
}
const g = (t) => ["dashboard", t];
function ps() {
  const t = x.useMemo(() => [
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
  ], []), s = x.useMemo(() => [
    ["BudgetConflict", {
      queryKeys: [g("summary"), g("project-health")],
      message: "Bütçe kaydında çakışma",
      description: "Aynı bütçeyi başka bir kullanıcı güncelledi."
    }]
  ], []);
  return xs(t), Et(), hs(s), null;
}
St();
const Ke = document.getElementById("apya-dashboard-root");
Ke && bt(
  Ke,
  "dashboard",
  /* @__PURE__ */ e.jsx(jt, { children: /* @__PURE__ */ e.jsx(Nt, { children: /* @__PURE__ */ e.jsx(kt, { children: /* @__PURE__ */ e.jsx(wt, { children: /* @__PURE__ */ e.jsxs(Ct, { children: [
    /* @__PURE__ */ e.jsx(ps, {}),
    /* @__PURE__ */ e.jsx(ns, {})
  ] }) }) }) }) })
);
