import { r as x, j as e, d as fe, b as Ae } from "./react-vendor.js";
import { c as m, t as r, S as L, a as Re, f as q, b as re, d as Le, e as Ie, I as He, B as H, T as Me } from "./Dialog.js";
import { Q as k, a as Pe } from "./QueryProvider.js";
import { H as be, a as Be, L as Ke } from "./signalr-vendor.js";
import { D as Fe } from "./useDeviceMode.js";
import { u as We, r as Oe, T as Ue } from "./registerServiceWorker.js";
import { r as Ge } from "./grid-vendor.js";
import { E as S } from "./EmptyState.js";
import { u as w, a as V, b as ge } from "./query-vendor.js";
import { a as Q } from "./httpClient.js";
/* empty css      */
const ye = x.createContext({
  connection: null,
  state: be.Disconnected
});
function _e({ hubUrl: t = "/signalr-hubs/notifications", children: n, enabled: a = !0 }) {
  const [s, i] = x.useState(be.Disconnected), c = x.useRef(null);
  x.useEffect(() => {
    if (!a || typeof window > "u") return;
    const o = new Be().withUrl(t, { withCredentials: !0 }).withAutomaticReconnect([0, 2e3, 5e3, 1e4, 3e4]).configureLogging(Ke.Warning).build();
    c.current = o, i(o.state);
    const d = () => i(o.state);
    return o.onreconnecting(d), o.onreconnected(d), o.onclose(d), o.start().then(d).catch((u) => {
      console.warn("[SignalR] connect failed:", u == null ? void 0 : u.message), d();
    }), () => {
      o.stop().catch(() => {
      }), c.current = null;
    };
  }, [t, a]);
  const l = x.useMemo(() => ({
    get connection() {
      return c.current;
    },
    state: s
  }), [s]);
  return /* @__PURE__ */ e.jsx(ye.Provider, { value: l, children: n });
}
function je() {
  return x.useContext(ye);
}
const ve = "apya-card-drag-handle";
function D({
  title: t,
  subtitle: n,
  badge: a,
  actions: s,
  footer: i,
  accent: c,
  /* 'negative' | 'warning' — kritik kartların üst şeridi */
  editMode: l = !1,
  isLoading: o = !1,
  isError: d = !1,
  errorMessage: u,
  onRetry: b,
  isEmpty: f = !1,
  emptyState: y,
  skeleton: E,
  isFetching: g = !1,
  isStale: U = !1,
  dataUpdatedAt: N,
  bleed: P = !1,
  className: A,
  bodyClassName: R,
  children: X
}) {
  const Z = !o && !d && U && g;
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
                l && /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: m(
                      ve,
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
                    Z && /* @__PURE__ */ e.jsx(Ve, {})
                  ] }),
                  n && /* @__PURE__ */ e.jsx("p", { className: "text-[11.5px] text-text-tertiary truncate", children: n })
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
              P ? "pb-0" : "px-[18px] pb-[18px]",
              P && "px-[18px]",
              R
            ),
            children: [
              d && /* @__PURE__ */ e.jsx(ze, { message: u, onRetry: b, dataUpdatedAt: N }),
              !d && o && (E ?? /* @__PURE__ */ e.jsx(qe, {})),
              !d && !o && f && (y ?? /* @__PURE__ */ e.jsx($e, {})),
              !d && !o && !f && X
            ]
          }
        ),
        i && /* @__PURE__ */ e.jsx("footer", { className: "flex-none px-[18px] pb-[14px] pt-1", children: i })
      ]
    }
  );
}
function qe() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", "aria-busy": "true", children: [
    /* @__PURE__ */ e.jsx(L, { height: 28, className: "w-1/3" }),
    /* @__PURE__ */ e.jsx(L, { height: 14 }),
    /* @__PURE__ */ e.jsx(L, { height: 14, className: "w-5/6" }),
    /* @__PURE__ */ e.jsx(L, { height: 14, className: "w-3/4" })
  ] });
}
function $e() {
  return /* @__PURE__ */ e.jsx(
    S,
    {
      compact: !0,
      title: r("Common:NoDataToShow", "Görüntülenecek veri yok"),
      description: r("Common:NoDataYet", "Yeni veri girildiğinde burada görünecek.")
    }
  );
}
function ze({ message: t, onRetry: n, dataUpdatedAt: a }) {
  const s = Qe(a);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center justify-center text-center gap-2 py-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-text-secondary max-w-xs", children: t || r("Common:FetchError", "Veri alınırken bir hata oluştu.") }),
    s && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-text-tertiary", children: [
      r("Common:LastSuccessfulUpdate", "Son başarılı güncelleme"),
      ": ",
      s
    ] }),
    n && /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        onClick: n,
        className: "text-[12.5px] text-text-link underline-offset-2 hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
        children: r("Common:Retry", "Tekrar dene")
      }
    )
  ] });
}
function Ve() {
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
function Qe(t) {
  if (t == null) return null;
  const n = t instanceof Date ? t.getTime() : Number(t);
  if (!Number.isFinite(n)) return null;
  const a = Math.round((n - Date.now()) / 1e3), s = Math.abs(a), i = new Intl.RelativeTimeFormat(Re(), { numeric: "auto" });
  return s < 60 ? i.format(a, "second") : s < 3600 ? i.format(Math.round(a / 60), "minute") : s < 86400 ? i.format(Math.round(a / 3600), "hour") : i.format(Math.round(a / 86400), "day");
}
D.DRAG_HANDLE_CLASS = ve;
function Ye({ trend: t, children: n }) {
  const a = t === "Up" ? "▲" : t === "Down" ? "▼" : "•";
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: m(
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
const $ = 100, I = 40;
function Xe(t, n = I, a = 2) {
  const s = Math.max(...t, 0);
  if (s <= 0) return t.map(() => n - a);
  const i = n - a * 2;
  return t.map((c) => a + i - c / s * i);
}
function Ze(t, n = $) {
  if (t <= 1) return [n / 2];
  const a = n / (t - 1);
  return Array.from({ length: t }, (s, i) => i * a);
}
function ke(t, n) {
  return t.length ? t.map((a, s) => `${s === 0 ? "M" : "L"} ${z(a)} ${z(n[s])}`).join(" ") : "";
}
function Je(t, n, a = I) {
  return t.length ? `${ke(t, n)} L ${z(t[t.length - 1])} ${a} L ${z(t[0])} ${a} Z` : "";
}
function z(t) {
  return Math.round(t * 100) / 100;
}
function et({ values: t = [], color: n = "var(--apya-brand-500)", ariaLabel: a }) {
  const s = x.useId().replace(/:/g, "");
  if (t.length < 2) return null;
  const i = Ze(t.length), c = Xe(t);
  return /* @__PURE__ */ e.jsxs(
    "svg",
    {
      viewBox: `0 0 ${$} ${I}`,
      preserveAspectRatio: "none",
      className: "block w-full h-full",
      role: a ? "img" : "presentation",
      "aria-label": a,
      children: [
        /* @__PURE__ */ e.jsx("defs", { children: /* @__PURE__ */ e.jsxs("linearGradient", { id: s, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ e.jsx("stop", { offset: "0%", stopColor: n, stopOpacity: "0.16" }),
          /* @__PURE__ */ e.jsx("stop", { offset: "100%", stopColor: n, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ e.jsx("path", { d: Je(i, c), fill: `url(#${s})` }),
        /* @__PURE__ */ e.jsx(
          "path",
          {
            d: ke(i, c),
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
const tt = ["var(--apya-positive-500)", "color-mix(in srgb, var(--apya-negative-500) 45%, transparent)"];
function at({ groups: t = [], colors: n = tt, ariaLabel: a }) {
  if (!t.length) return null;
  const s = Math.max(...t.flatMap((o) => o.values), 0), i = $ / t.length, c = Math.min(4.5, i * 0.62 / 2), l = c * 0.22;
  return /* @__PURE__ */ e.jsx(
    "svg",
    {
      viewBox: `0 0 ${$} ${I}`,
      preserveAspectRatio: "none",
      className: "block w-full h-full",
      role: a ? "img" : "presentation",
      "aria-label": a,
      children: t.map((o, d) => {
        const u = o.values.length * c + (o.values.length - 1) * l, b = d * i + (i - u) / 2;
        return o.values.map((f, y) => {
          const E = s > 0 ? f / s * (I - 2) : 0;
          return /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: b + y * (c + l),
              y: I - E,
              width: c,
              height: E,
              rx: "0.8",
              fill: n[y % n.length]
            },
            `${d}-${y}`
          );
        });
      })
    }
  );
}
const J = 34, ie = 2 * Math.PI * J;
function nt({ ratio: t = 0, size: n = 58, ariaLabel: a }) {
  const s = Math.max(0, Math.min(t, 1)), i = s * ie, c = s >= 0.9 ? "var(--apya-negative-500)" : s >= 0.7 ? "var(--apya-warning-500)" : "var(--apya-positive-500)";
  return /* @__PURE__ */ e.jsxs(
    "svg",
    {
      viewBox: "0 0 100 100",
      style: { width: n, height: n },
      className: "flex-none",
      role: "img",
      "aria-label": a ?? `${Math.round(s * 100)}%`,
      children: [
        /* @__PURE__ */ e.jsx("circle", { cx: "50", cy: "50", r: J, fill: "none", stroke: "var(--apya-surface-sunken)", strokeWidth: "12" }),
        i > 0 && /* @__PURE__ */ e.jsx(
          "circle",
          {
            cx: "50",
            cy: "50",
            r: J,
            fill: "none",
            stroke: c,
            strokeWidth: "12",
            strokeDasharray: `${i} ${ie - i}`,
            strokeLinecap: "round",
            transform: "rotate(-90 50 50)"
          }
        )
      ]
    }
  );
}
const st = [
  "bg-surface-sunken",
  /* 0 teslim */
  "bg-brand-200",
  "bg-brand-300",
  "bg-brand-500",
  "bg-brand-600"
];
function rt(t, n) {
  return t <= 0 ? 0 : n <= 1 ? 2 : Math.min(4, 1 + Math.round((t - 1) / n * 3));
}
function it({ cells: t = [], weekdayLabels: n = !0 }) {
  if (!t.length) return null;
  const a = Math.max(...t.map((i) => i.count), 0), s = [];
  for (let i = 0; i < t.length; i += 7) s.push(t.slice(i, i + 7));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
    s.map((i, c) => /* @__PURE__ */ e.jsx("div", { className: "flex gap-1", children: i.map((l) => /* @__PURE__ */ e.jsx(
      "span",
      {
        title: ot(l),
        className: m(
          "flex-1 h-[15px] rounded",
          /* Hibe günü kademeden çıkar, sarı boyanır. Tasarımdaki
             #FCD34D için token yok → warning-500 yarı saydam
             (yeni renk üretmemek için). */
          l.isGrantDeadline ? "bg-warning-500/55" : st[rt(l.count, a)]
        )
      },
      l.date
    )) }, c)),
    n && /* @__PURE__ */ e.jsx("div", { className: "flex justify-between font-mono text-[9.5px] text-text-tertiary pt-0.5", children: [
      r("Common:Day:Mon", "Pzt"),
      r("Common:Day:Tue", "Sal"),
      r("Common:Day:Wed", "Çar"),
      r("Common:Day:Thu", "Per"),
      r("Common:Day:Fri", "Cum"),
      r("Common:Day:Sat", "Cmt"),
      r("Common:Day:Sun", "Paz")
    ].map((i) => /* @__PURE__ */ e.jsx("span", { children: i }, i)) })
  ] });
}
function ot(t) {
  const n = new Date(t.date).toLocaleDateString(), a = r("Dashboard:Heatmap:CellCount", "{0} teslim", t.count);
  return t.isGrantDeadline ? `${n} — ${a} · ${r("Dashboard:Heatmap:GrantDeadline", "hibe son tarihi")}` : `${n} — ${a}`;
}
function lt({ ratio: t = 0, tone: n = "positive", ariaLabel: a }) {
  const s = Math.max(0, Math.min(t, 1)), i = Math.round(s * 100), c = n === "negative" ? "var(--apya-negative-500)" : n === "warning" ? "var(--apya-warning-500)" : "var(--apya-positive-500)";
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "flex gap-1",
      role: "img",
      "aria-label": a ?? `%${i}`,
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-[5px] rounded-full", style: { flex: i, background: c } }),
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
const ct = ["Upcoming", "OnTrack", "InReview", "Overdue"], dt = ["ThisWeek", "NextWeek", "EndOfMonth", "Later"], ut = ["Healthy", "Attention", "Risky"], xt = ["WaitingReview", "Dependency", "Unassigned"], mt = ["Flat", "Up", "Down"], ht = ["Work", "Finance", "Grants", "Communication", "System"];
function M(t, n, a) {
  return typeof n == "string" ? n : t[n] ?? a;
}
function pt(t) {
  return (t ?? []).map((n) => ({
    ...n,
    state: M(ct, n.state, "Upcoming"),
    groupKey: M(dt, n.groupKey, "Later")
  }));
}
function ft(t) {
  return (t ?? []).map((n) => ({
    ...n,
    state: M(ut, n.state, "Healthy")
  }));
}
function bt(t) {
  return (t ?? []).map((n) => ({
    ...n,
    blockReason: M(xt, n.blockReason, "Dependency")
  }));
}
function gt(t) {
  return (t ?? []).map((n) => ({
    ...n,
    group: M(ht, n.group, "Work"),
    trend: M(mt, n.trend, "Flat")
  }));
}
const oe = 0, O = 6e4, te = 3e4;
function yt({ range: t, projectId: n } = {}) {
  const a = new URLSearchParams();
  t && a.set("range", t), n && a.set("projectId", n);
  const s = a.toString();
  return s ? `?${s}` : "";
}
const C = (t, n) => Q.get(`/api/dashboard/${t}${yt(n)}`);
function jt(t) {
  return w({
    queryKey: k.dashboard.summary(t),
    queryFn: () => C("summary", t),
    staleTime: te
    /* bütçe alanları içeriyor */
  });
}
function vt(t) {
  return w({
    queryKey: k.dashboard.deliveries(t),
    queryFn: () => C("deliveries", t),
    select: pt,
    staleTime: O
  });
}
function kt(t) {
  return w({
    queryKey: k.dashboard.projectHealth(t),
    queryFn: () => C("project-health", t),
    select: ft,
    staleTime: O
  });
}
function Dt() {
  return w({
    queryKey: k.dashboard.approvals(),
    queryFn: () => C("pending-approvals"),
    staleTime: te
  });
}
function Nt() {
  return w({
    queryKey: k.dashboard.blockedTasks(),
    queryFn: () => C("blocked-tasks"),
    select: bt,
    staleTime: O
  });
}
function St(t) {
  return w({
    queryKey: k.dashboard.statistics(t),
    queryFn: () => C("statistics", t),
    select: gt,
    staleTime: O
  });
}
function wt(t) {
  return w({
    queryKey: k.dashboard.incomeExpense(t),
    queryFn: () => C("income-expense", t),
    staleTime: te
  });
}
function Tt(t) {
  return w({
    queryKey: k.dashboard.deliveryHeatmap(t),
    queryFn: () => C("delivery-heatmap", t),
    staleTime: O
  });
}
function Ct({ filter: t, template: n, compact: a }) {
  const { data: s, isLoading: i, isError: c, refetch: l } = jt(t), o = { gridTemplateColumns: n ?? "repeat(4, minmax(0, 2fr)) minmax(0, 3fr)" };
  return i ? /* @__PURE__ */ e.jsx("div", { className: m("h-full grid", a ? "gap-3" : "gap-5"), style: o, children: Array.from({ length: 5 }, (d, u) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-card shadow-card bg-surface-base border border-default p-4", children: [
    /* @__PURE__ */ e.jsx(L, { height: 14, className: "w-2/3 mb-2" }),
    /* @__PURE__ */ e.jsx(L, { height: 28, className: "w-1/2" })
  ] }, u)) }) : c || !s ? /* @__PURE__ */ e.jsxs("div", { className: "rounded-card shadow-card bg-surface-base border border-default p-4 flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-secondary", children: r("Dashboard:Summary:Error", "Özet yüklenemedi.") }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => l(), className: "text-[12.5px] text-text-link hover:underline", children: r("Common:Retry", "Tekrar dene") })
  ] }) : (
    /* Kutucuklar ızgara kutusunu TAM doldurur (h-full): doğal yüksekliğe
               bırakılırsa kutu içerikten kısa kalınca taşıp alttaki satıra biniyor,
               uzun kalınca da altta ölü boşluk bırakıyordu — ikisini de gördük.
               Ek alt padding YOK: tüm boşluklar tek kaynaktan, GRID_MARGIN'den gelir.
               Kutucuk arası da aynı 20px (gap-5) — ızgaradaki kart aralarıyla birebir.
    
               Kutu yüksekliği de kolon sayısını takip eder (stripLayoutFor → h), yani
               çok satırlı dizilimde kutu büyür; sabit h=2 bırakılınca satırlar 148px'lik
               kutuya sıkışıp `overflow-hidden` altyazıları kesiyordu. */
    /* @__PURE__ */ e.jsxs("div", { className: m("h-full grid", a ? "gap-3" : "gap-5"), style: o, children: [
      /* @__PURE__ */ e.jsx(
        _,
        {
          compact: a,
          label: r("Dashboard:Summary:DueThisPeriod", "Bu dönem teslim"),
          value: s.dueThisPeriod,
          pill: r("Dashboard:Summary:DueThisWeek", "{0} bu hafta", s.dueThisWeek),
          icon: /* @__PURE__ */ e.jsx(At, {}),
          iconTone: "brand",
          spark: s.dueTrend
        }
      ),
      /* @__PURE__ */ e.jsx(
        _,
        {
          compact: a,
          label: r("Dashboard:Summary:Overdue", "Gecikmiş"),
          value: s.overdue,
          tone: "negative",
          pill: s.oldestOverdueDays != null ? r("Dashboard:Summary:OldestOverdue", "en eski {0} g", s.oldestOverdueDays) : null,
          pillTone: "negative",
          icon: /* @__PURE__ */ e.jsx(Rt, {}),
          iconTone: "negative",
          caption: r("Dashboard:Summary:OverdueProjects", "{0} projede", s.overdueProjectCount)
        }
      ),
      /* @__PURE__ */ e.jsx(
        _,
        {
          compact: a,
          label: r("Dashboard:Summary:Blocked", "Tıkanan iş"),
          value: s.blocked,
          tone: "warning",
          pill: r("Dashboard:Summary:BlockedAvg", "ort. {0} g", s.blockedAvgIdleDays),
          pillTone: "warning",
          icon: /* @__PURE__ */ e.jsx(Lt, {}),
          iconTone: "warning",
          caption: r("Dashboard:Summary:BlockedReasons", "onay · bilgi · bağımlılık")
        }
      ),
      /* @__PURE__ */ e.jsx(
        _,
        {
          compact: a,
          label: r("Dashboard:Summary:PendingApprovals", "Bende onay"),
          value: s.pendingApprovals,
          locked: s.pendingApprovals == null,
          lockedPermission: "Platform.Invoices",
          pill: s.pendingApprovalAmount != null ? q(s.pendingApprovalAmount, s.currency) : null,
          icon: /* @__PURE__ */ e.jsx(It, {}),
          iconTone: "brand",
          caption: s.pendingApprovalAvgAgeHours != null ? r("Dashboard:Summary:AvgWait", "ortalama bekleme {0} sa", s.pendingApprovalAvgAgeHours) : null
        }
      ),
      /* @__PURE__ */ e.jsx(Et, { data: s, compact: a })
    ] })
  );
}
function _({ label: t, value: n, pill: a, pillTone: s = "neutral", caption: i, tone: c = "neutral", icon: l, iconTone: o = "brand", spark: d, locked: u, lockedPermission: b, compact: f }) {
  const y = !f && d && d.length > 1;
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: m(
        "rounded-card shadow-card bg-surface-base border border-default",
        "flex flex-col overflow-hidden",
        f ? "gap-[5px] pt-3 px-3 pb-3" : m(
          "gap-[7px]",
          /* Üst ve yan padding TÜM kutucuklarda aynı; yalnız alt padding
             grafikli kutucukta sıfırlanır ki sparkline kenara yapışsın.
             Farklı üst padding vermek şeritteki başlıkları kaydırıyordu. */
          "pt-4 px-4",
          d ? "pb-0" : "pb-4"
        )
      ),
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-medium text-text-secondary truncate", children: t }),
          /* @__PURE__ */ e.jsx("span", { className: m(
            "inline-flex items-center justify-center rounded-lg flex-none",
            f ? "w-5 h-5" : "w-6 h-6",
            o === "negative" ? "bg-negative-50 text-negative-700" : o === "warning" ? "bg-warning-50 text-warning-700" : "bg-accent-soft text-accent-600"
          ), children: l })
        ] }),
        u ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx("span", { className: m("font-mono font-semibold leading-none tracking-[-0.03em] text-text-tertiary", f ? "text-[22px]" : "text-[28px]"), children: "— —" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r("Dashboard:Stat:Locked", "yetki gerekli") }),
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary", children: b })
        ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
            /* @__PURE__ */ e.jsx("span", { className: m(
              "font-mono font-semibold leading-none tracking-[-0.03em] tabular-nums",
              f ? "text-[22px]" : "text-[28px]",
              c === "negative" ? "text-negative-500" : c === "warning" ? "text-warning-600" : "text-text-primary"
            ), children: n }),
            a && /* @__PURE__ */ e.jsx("span", { className: m(
              "font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full tabular-nums",
              s === "negative" ? "bg-negative-50 text-negative-700" : s === "warning" ? "bg-warning-50 text-warning-700" : "bg-surface-sunken text-text-secondary"
            ), children: a })
          ] }),
          i && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary truncate", children: i })
        ] }),
        y && /* @__PURE__ */ e.jsx("div", { className: "h-9 mt-auto -mx-4", children: /* @__PURE__ */ e.jsx(et, { values: d, ariaLabel: r("Dashboard:Summary:DueTrend", "Teslim dağılımı") }) })
      ]
    }
  );
}
function Et({ data: t, compact: n }) {
  const a = t.budgetUsedRatio == null && t.budgetTotal == null;
  return (
    /* Kompakt kipte tam satıra yayılır: 145px'lik yarım kolonda Gauge (58px)
       + altyazı sığmıyor, tek başına geniş satırda rahat ediyor. */
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: m(
          "rounded-card shadow-card bg-surface-base border border-default flex items-center justify-between",
          n ? "p-3 gap-2" : "p-4 gap-2.5"
        ),
        style: n ? { gridColumn: "1 / -1" } : void 0,
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: m("flex flex-col min-w-0", n ? "gap-[5px]" : "gap-[7px]"), children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-medium text-text-secondary truncate", children: r("Dashboard:Summary:BudgetUsage", "Bütçe kullanımı") }),
            a ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsx("span", { className: m("font-mono font-semibold leading-none tracking-[-0.03em] text-text-tertiary", n ? "text-[22px]" : "text-[28px]"), children: "— —" }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary", children: "Platform.Projects.ViewBudget" })
            ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsxs("span", { className: m("font-mono font-semibold leading-none tracking-[-0.03em] text-text-primary tabular-nums", n ? "text-[22px]" : "text-[28px]"), children: [
                "%",
                Math.round((t.budgetUsedRatio ?? 0) * 100)
              ] }),
              /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary truncate", children: [
                q(t.budgetSpent, t.currency),
                " / ",
                q(t.budgetTotal, t.currency)
              ] })
            ] })
          ] }),
          !a && /* @__PURE__ */ e.jsx(nt, { ratio: t.budgetUsedRatio ?? 0 })
        ]
      }
    )
  );
}
const Y = { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }, At = () => /* @__PURE__ */ e.jsxs("svg", { ...Y, children: [
  /* @__PURE__ */ e.jsx("path", { d: "M8 2v3M16 2v3M4 9h16" }),
  /* @__PURE__ */ e.jsx("rect", { x: "4", y: "5", width: "16", height: "16", rx: "2" })
] }), Rt = () => /* @__PURE__ */ e.jsxs("svg", { ...Y, children: [
  /* @__PURE__ */ e.jsx("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ e.jsx("path", { d: "M12 8v5" }),
  /* @__PURE__ */ e.jsx("path", { d: "M12 16.5v.01" })
] }), Lt = () => /* @__PURE__ */ e.jsxs("svg", { ...Y, children: [
  /* @__PURE__ */ e.jsx("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ e.jsx("path", { d: "M5.6 5.6l12.8 12.8" })
] }), It = () => /* @__PURE__ */ e.jsx("svg", { ...Y, children: /* @__PURE__ */ e.jsx("path", { d: "M20 6L9 17l-5-5" }) }), le = ["ThisWeek", "NextWeek", "EndOfMonth", "Later"], ce = {
  ThisWeek: ["Dashboard:Deliveries:ThisWeek", "Bu hafta"],
  NextWeek: ["Dashboard:Deliveries:NextWeek", "Gelecek hafta"],
  EndOfMonth: ["Dashboard:Deliveries:EndOfMonth", "Ay sonu"],
  Later: ["Dashboard:Deliveries:Later", "Sonrası"]
};
function Ht({ filter: t, editMode: n }) {
  const a = vt(t), s = a.data ?? [], i = x.useMemo(() => {
    const l = new Map(le.map((o) => [o, []]));
    for (const o of s)
      (l.get(o.groupKey) ?? l.get("Later")).push(o);
    return le.map((o) => ({ key: o, items: l.get(o) ?? [] })).filter((o) => o.items.length > 0);
  }, [s]), c = s.filter((l) => l.state === "Overdue").length;
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: n,
      title: r("Dashboard:Deliveries:Title", "Bu ay teslim edilecekler"),
      subtitle: r("Dashboard:Deliveries:Subtitle", "{0} iş · {1} gecikmiş", s.length, c),
      actions: /* @__PURE__ */ e.jsx("a", { href: "/Tasks", className: "text-[12.5px] font-medium text-text-link hover:underline", children: r("Dashboard:Deliveries:AllTasks", "Görev listesi →") }),
      isLoading: a.isLoading,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: s.length === 0,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        S,
        {
          compact: !0,
          title: r("Dashboard:Deliveries:EmptyTitle", "Bu dönem teslim yok"),
          description: r("Dashboard:Deliveries:EmptyDescription", "Son tarihi bu döneme düşen açık iş bulunmuyor."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Tasks", className: "text-[12.5px] font-medium text-text-link hover:underline", children: r("Dashboard:Deliveries:AllTasks", "Görev listesi →") })
        }
      ),
      children: /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2.5", children: i.map((l) => /* @__PURE__ */ e.jsxs(fe.Fragment, { children: [
        /* @__PURE__ */ e.jsx(Mt, { groupKey: l.key, count: l.items.length }),
        /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col gap-[3px]", children: l.items.map((o) => /* @__PURE__ */ e.jsx(Pt, { item: o }, o.taskId)) })
      ] }, l.key)) })
    }
  );
}
function Mt({ groupKey: t, count: n }) {
  const [a, s] = ce[t] ?? ce.Later;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.04em] text-text-tertiary", children: r(a, s) }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary tabular-nums", children: n }),
    /* @__PURE__ */ e.jsx("span", { className: "flex-1 h-px bg-subtle" })
  ] });
}
const de = {
  Overdue: "bg-negative-500",
  InReview: "bg-warning-500",
  OnTrack: "bg-positive-500",
  Upcoming: "bg-neutral-300"
};
function Pt({ item: t }) {
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
        /* @__PURE__ */ e.jsx("span", { className: m("w-1.5 h-1.5 rounded-full flex-none", de[t.state] ?? de.Upcoming), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-[140px] text-[13.5px] font-medium text-text-primary truncate", children: t.title }),
        t.state === "Overdue" && t.overdueDays != null && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold px-2 py-0.5 rounded-full bg-negative-50 text-negative-700 flex-none", children: r("Dashboard:Deliveries:OverdueDays", "{0} gün gecikmiş", t.overdueDays) }),
        t.state === "InReview" && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold px-2 py-0.5 rounded-full bg-warning-50 text-warning-700 flex-none", children: r("Dashboard:Deliveries:InReview", "kontrolde") }),
        t.projectName && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-secondary px-2 py-0.5 rounded-full bg-surface-sunken flex-none truncate max-w-[140px]", children: t.projectName }),
        /* @__PURE__ */ e.jsx("span", { className: m(
          "font-mono text-[11.5px] w-[50px] text-right flex-none tabular-nums",
          t.state === "Overdue" ? "text-negative-500" : "text-text-secondary"
        ), children: Bt(t.dueDate) }),
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
function Bt(t) {
  const n = new Date(t);
  return Number.isNaN(n.getTime()) ? "" : n.toLocaleDateString(void 0, { day: "numeric", month: "short" });
}
const ue = 4, xe = {
  Healthy: ["bg-positive-50 text-positive-700", "Dashboard:Health:Healthy", "Sağlıklı"],
  Attention: ["bg-warning-50 text-warning-700", "Dashboard:Health:Attention", "Dikkat"],
  Risky: ["bg-negative-50 text-negative-700", "Dashboard:Health:Risky", "Riskli"]
}, Kt = { Healthy: "positive", Attention: "warning", Risky: "negative" };
function Ft({ filter: t, editMode: n }) {
  const a = kt(t), s = a.data ?? [], i = s.slice(0, ue), c = s.slice(ue);
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: n,
      title: r("Dashboard:Health:Title", "Proje sağlığı"),
      subtitle: r("Dashboard:Health:Subtitle", "{0} aktif proje", s.length),
      isLoading: a.isLoading,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: s.length === 0,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        S,
        {
          compact: !0,
          title: r("Dashboard:Health:EmptyTitle", "Henüz proje yok"),
          description: r("Dashboard:Health:EmptyDescription", "Proje oluşturunca sağlık göstergeleri burada belirir."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Projects", className: "text-[12.5px] font-medium text-text-link hover:underline", children: r("Dashboard:Health:OpenProjects", "Projeleri aç →") })
        }
      ),
      footer: c.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary truncate", children: c.map((l) => l.name).join(" · ") }),
        /* @__PURE__ */ e.jsx("a", { href: "/Projects", className: "text-xs text-text-link hover:underline flex-none", children: r("Dashboard:Health:More", "+{0} proje →", c.length) })
      ] }),
      children: /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col", children: i.map((l, o) => /* @__PURE__ */ e.jsxs("li", { className: "flex flex-col gap-[7px]", children: [
        o > 0 && /* @__PURE__ */ e.jsx("span", { className: "h-px bg-subtle my-2.5" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx(
            "a",
            {
              href: `/Projects/ProjectDetails/${l.projectId}`,
              className: "text-[13px] font-medium text-text-primary truncate hover:underline",
              children: l.name
            }
          ),
          /* @__PURE__ */ e.jsx(Wt, { state: l.state })
        ] }),
        /* @__PURE__ */ e.jsx(
          lt,
          {
            ratio: l.budgetRatio ?? l.timeRatio ?? 0,
            tone: Kt[l.state] ?? "positive",
            ariaLabel: r("Dashboard:Health:BarLabel", "{0} ilerleme", l.name)
          }
        ),
        /* @__PURE__ */ e.jsx(Ot, { project: l })
      ] }, l.projectId)) })
    }
  );
}
function Wt({ state: t }) {
  const [n, a, s] = xe[t] ?? xe.Healthy;
  return /* @__PURE__ */ e.jsx("span", { className: m("text-[11px] font-semibold px-2 py-0.5 rounded-full flex-none", n), children: r(a, s) });
}
function Ot({ project: t }) {
  const n = [];
  return t.daysRemaining != null && n.push(r("Dashboard:Health:DaysLeft", "{0} gün", t.daysRemaining)), t.budgetRatio != null && n.push(r("Dashboard:Health:BudgetPercent", "%{0} bütçe", Math.round(t.budgetRatio * 100))), n.push(r("Dashboard:Health:Tasks", "{0}/{1} görev", t.tasksDone, t.tasksTotal)), /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2.5 font-mono text-[11px] text-text-secondary tabular-nums", children: n.map((a, s) => /* @__PURE__ */ e.jsxs(fe.Fragment, { children: [
    s > 0 && /* @__PURE__ */ e.jsx("span", { className: "text-border-default", "aria-hidden": "true", children: "|" }),
    /* @__PURE__ */ e.jsx("span", { children: a })
  ] }, a)) });
}
function Ut({ editMode: t }) {
  var l;
  const n = Dt(), a = n.data ?? [], s = a.reduce((o, d) => o + (d.amount ?? 0), 0), i = a.length ? Math.round(a.reduce((o, d) => o + d.ageHours, 0) / a.length) : 0, c = ((l = a[0]) == null ? void 0 : l.currency) ?? "TRY";
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: t,
      title: r("Dashboard:Approvals:Title", "Bende bekleyen kararlar"),
      badge: a.length > 0 && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full bg-warning-50 text-warning-700 tabular-nums flex-none", children: a.length }),
      isLoading: n.isLoading,
      isError: n.isError,
      onRetry: n.refetch,
      isEmpty: a.length === 0,
      isFetching: n.isFetching,
      isStale: n.isStale,
      dataUpdatedAt: n.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        S,
        {
          compact: !0,
          title: r("Dashboard:Approvals:EmptyTitle", "Karar bekleyen yok"),
          description: r("Dashboard:Approvals:EmptyDescription", "Taslak durumdaki fatura bulunmuyor."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Invoices", className: "text-[12.5px] font-medium text-text-link hover:underline", children: r("Dashboard:Approvals:OpenInvoices", "Faturaları aç →") })
        }
      ),
      footer: a.length > 0 && /* Satır başlıkları serbest metin olduğu için kırpılabilir, ama bu
      özet SABİT biçimli — dar kartta kırpmak yerine alt satıra sarsın. */
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r("Dashboard:Approvals:Total", "Toplam {0} · ort. bekleme {1} sa", re(s, c), i) }),
        /* @__PURE__ */ e.jsx("a", { href: "/Invoices", className: "text-[12.5px] font-medium text-text-link hover:underline flex-none", children: r("Dashboard:Approvals:Queue", "Onay kuyruğu →") })
      ] }),
      children: /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col", children: a.slice(0, 4).map((o, d) => /* @__PURE__ */ e.jsxs(
        "li",
        {
          className: "flex flex-wrap items-center gap-2.5 py-2 border-b border-subtle last:border-b-0",
          children: [
            /* @__PURE__ */ e.jsxs("span", { className: "flex-1 min-w-[150px] flex flex-col gap-0.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-medium text-text-primary truncate", children: o.title }),
              /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary truncate", children: r("Dashboard:Approvals:Meta", "Fatura · {0} · {1} sa", o.requesterName || "—", o.ageHours) })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "font-mono text-xs font-semibold text-text-primary tabular-nums flex-none", children: re(o.amount, o.currency) }),
            /* @__PURE__ */ e.jsx(
              "a",
              {
                href: o.targetUrl,
                className: "text-xs font-medium text-text-link hover:underline flex-none",
                children: r("Dashboard:Approvals:Review", "İncele →")
              }
            )
          ]
        },
        o.id
      )) })
    }
  );
}
const me = {
  WaitingReview: ["bg-warning-50 text-warning-700", "Dashboard:Blockers:WaitingReview", "Kontrolde"],
  Dependency: ["bg-surface-sunken text-text-secondary", "Dashboard:Blockers:Dependency", "Bağımlı"],
  Unassigned: ["bg-negative-50 text-negative-700", "Dashboard:Blockers:Unassigned", "Atanmamış"]
};
function Gt({ editMode: t }) {
  const n = Nt(), a = n.data ?? [];
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: t,
      accent: a.length > 0 ? "negative" : void 0,
      title: r("Dashboard:Blockers:Title", "Tıkanan işler & risk"),
      badge: a.length > 0 && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full bg-negative-50 text-negative-700 tabular-nums flex-none", children: a.length }),
      isLoading: n.isLoading,
      isError: n.isError,
      onRetry: n.refetch,
      isEmpty: a.length === 0,
      isFetching: n.isFetching,
      isStale: n.isStale,
      dataUpdatedAt: n.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        S,
        {
          compact: !0,
          title: r("Dashboard:Blockers:EmptyTitle", "Tıkanan iş yok"),
          description: r("Dashboard:Blockers:EmptyDescription", "Açık işlerin hepsi son günlerde hareket görmüş.")
        }
      ),
      children: /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col gap-3", children: a.slice(0, 3).map((s, i) => /* @__PURE__ */ e.jsxs("li", { className: "flex flex-col gap-1", children: [
        i > 0 && /* @__PURE__ */ e.jsx("span", { className: "h-px bg-subtle mb-2" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(_t, { reason: s.blockReason }),
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
function _t({ reason: t }) {
  const [n, a, s] = me[t] ?? me.Dependency;
  return /* @__PURE__ */ e.jsx("span", { className: m("text-[11px] font-semibold px-2 py-0.5 rounded-full flex-none", n), children: r(a, s) });
}
function qt({ editMode: t }) {
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: t,
      title: r("Dashboard:Ai:Title", "AI önerileri"),
      subtitle: r("Dashboard:Ai:Subtitle", "sessiz inbox"),
      isEmpty: !0,
      emptyState: /* @__PURE__ */ e.jsx(
        S,
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
function $t({ filter: t, editMode: n }) {
  const a = wt(t), s = a.data, i = (s == null ? void 0 : s.points) ?? [], c = i.some((o) => o.income > 0 || o.expense > 0), l = (s == null ? void 0 : s.currency) ?? "TRY";
  return /* @__PURE__ */ e.jsxs(
    D,
    {
      editMode: n,
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
      isLoading: a.isLoading,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: !c,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        S,
        {
          compact: !0,
          title: r("Dashboard:IncomeExpense:EmptyTitle", "Kayıtlı hareket yok"),
          description: r("Dashboard:IncomeExpense:EmptyDescription", "Son 6 ayda gelir veya gider kaydı bulunmuyor.")
        }
      ),
      bodyClassName: "flex flex-col gap-2.5",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-2xl font-semibold leading-none tracking-[-0.03em] text-text-primary tabular-nums", children: q((s == null ? void 0 : s.net) ?? 0, l) }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r("Dashboard:IncomeExpense:Net", "net") })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-[82px] -mx-[18px] mt-auto", children: /* @__PURE__ */ e.jsx(
          at,
          {
            groups: i.map((o) => ({ values: [o.income, o.expense] })),
            ariaLabel: r("Dashboard:IncomeExpense:ChartLabel", "Aylık gelir ve gider")
          }
        ) })
      ]
    }
  );
}
function zt({ filter: t, editMode: n }) {
  const a = Tt(t), s = a.data ?? [], i = s.some((l) => l.count > 0), c = s.reduce(
    (l, o) => o.count > ((l == null ? void 0 : l.count) ?? 0) ? o : l,
    null
  );
  return /* @__PURE__ */ e.jsxs(
    D,
    {
      editMode: n,
      title: r("Dashboard:Heatmap:Title", "Teslim yoğunluğu"),
      subtitle: r("Dashboard:Heatmap:Subtitle", "Önümüzdeki 4 hafta · hafta × gün"),
      isLoading: a.isLoading,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: s.length === 0,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        S,
        {
          compact: !0,
          title: r("Dashboard:Heatmap:EmptyTitle", "Planlı teslim yok"),
          description: r("Dashboard:Heatmap:EmptyDescription", "Önümüzdeki 4 haftada son tarihi olan iş bulunmuyor.")
        }
      ),
      bodyClassName: "flex flex-col gap-3",
      children: [
        /* @__PURE__ */ e.jsx(it, { cells: s }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: i && c ? r(
          "Dashboard:Heatmap:Busiest",
          "En yoğun gün {0} ({1} teslim) · sarı: hibe son tarihi",
          new Date(c.date).toLocaleDateString(void 0, { day: "numeric", month: "short" }),
          c.count
        ) : r("Dashboard:Heatmap:NoneScheduled", "Bu pencerede teslim planlanmamış · sarı: hibe son tarihi") })
      ]
    }
  );
}
function Vt({ editMode: t }) {
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: t,
      title: r("Dashboard:Phases:Title", "Proje fazları"),
      subtitle: r("Dashboard:Phases:Subtitle", "mini gantt"),
      isEmpty: !0,
      emptyState: /* @__PURE__ */ e.jsx(
        S,
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
const Qt = [
  ["Work", "Dashboard:StatTab:Work", "İş & teslim"],
  ["Finance", "Dashboard:StatTab:Finance", "Finans"],
  ["Grants", "Dashboard:StatTab:Grants", "Hibe"],
  ["Communication", "Dashboard:StatTab:Communication", "İletişim"],
  ["System", "Dashboard:StatTab:System", "Sistem"]
];
function Yt({ filter: t, editMode: n }) {
  const a = St(t), s = a.data ?? [], [i, c] = x.useState("Work"), l = x.useMemo(
    () => Qt.filter(([u]) => s.some((b) => b.group === u)),
    [s]
  ), o = s.filter((u) => u.group === i), d = s.filter((u) => u.locked).length;
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: n,
      title: r("Dashboard:Statistics:Title", "İstatistikler"),
      subtitle: s.length > 0 ? r(
        "Dashboard:Statistics:Subtitle",
        "{0} istatistikten {1}'i yetkinde · {2}'si kilitli",
        s.length,
        s.length - d,
        d
      ) : void 0,
      actions: /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1.5 flex-wrap justify-end", children: l.map(([u, b, f]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => c(u),
          "aria-pressed": i === u,
          className: m(
            "inline-flex items-center h-7 px-[11px] rounded-[9px] text-[11.5px] transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:shadow-focus",
            i === u ? "bg-text-primary text-surface-base font-semibold" : "bg-surface-sunken text-text-secondary font-medium hover:text-text-primary"
          ),
          children: r(b, f)
        },
        u
      )) }),
      isLoading: a.isLoading,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: s.length === 0,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      children: /* @__PURE__ */ e.jsx("div", { className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(154px, 1fr))" }, children: o.map((u) => /* @__PURE__ */ e.jsx(Xt, { stat: u }, u.key)) })
    }
  );
}
function Xt({ stat: t }) {
  return t.locked ? /* @__PURE__ */ e.jsxs("div", { className: "p-[12px_14px] border border-dashed border-default rounded-xl bg-surface-base flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary truncate", children: t.label }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-xl font-semibold leading-none tracking-[-0.03em] text-text-tertiary", children: "— —" }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: r("Dashboard:Stat:Locked", "yetki gerekli") }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary truncate", children: t.requiredPermission })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "p-[12px_14px] border border-subtle rounded-xl bg-surface-base flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary truncate", children: t.label }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-xl font-semibold leading-none tracking-[-0.03em] text-text-primary tabular-nums", children: t.formatted || "—" }),
    t.deltaFormatted ? /* @__PURE__ */ e.jsx(Ye, { trend: t.trend, children: t.deltaFormatted }) : /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: r("Dashboard:Stat:Flat", "• sabit") }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary truncate", children: t.requiredPermission })
  ] });
}
const F = [
  { key: "project-management", labelKey: "Dashboard:View:ProjectManagement", fallback: "Proje Yönetimi" },
  { key: "finance", labelKey: "Dashboard:View:Finance", fallback: "Finans" },
  { key: "today", labelKey: "Dashboard:View:Today", fallback: "Bugün" },
  { key: "grants", labelKey: "Dashboard:View:Grants", fallback: "Hibe takibi" }
], he = "project-management", W = {
  /* h=2 (138px): kutucuk içeriği ~122px. h=3 verilince ızgara kutusu
     içerikten ~75px yüksek kalıyor ve altındaki satırla arasında ölü boşluk
     oluşuyordu. minH de 2 olmalı — aksi halde RGL yüksekliği 3'e zorlar. */
  /* `band`: kart yatay bir şerittir — dar kırılımlarda yarım genişliğe
     düşürülmez, hep tam satır kaplar (içeriği kolonlara yayılıyor). */
  "summary-strip": { component: Ct, titleKey: "Dashboard:Card:SummaryStrip", fallback: "Sayısal özet", w: 12, h: 2, minW: 6, minH: 2, band: !0 },
  deliveries: { component: Ht, titleKey: "Dashboard:Deliveries:Title", fallback: "Bu ay teslim edilecekler", w: 7, h: 8, minW: 4, minH: 5 },
  "project-health": { component: Ft, titleKey: "Dashboard:Health:Title", fallback: "Proje sağlığı", w: 5, h: 8, minW: 3, minH: 5 },
  approvals: { component: Ut, titleKey: "Dashboard:Approvals:Title", fallback: "Bende bekleyen kararlar", w: 4, h: 6, minW: 3, minH: 4 },
  blockers: { component: Gt, titleKey: "Dashboard:Blockers:Title", fallback: "Tıkanan işler & risk", w: 4, h: 6, minW: 3, minH: 4 },
  "ai-suggestions": { component: qt, titleKey: "Dashboard:Ai:Title", fallback: "AI önerileri", w: 4, h: 6, minW: 3, minH: 3 },
  "income-expense": { component: $t, titleKey: "Dashboard:IncomeExpense:Title", fallback: "Gelir / gider", w: 4, h: 6, minW: 3, minH: 4 },
  "delivery-heatmap": { component: zt, titleKey: "Dashboard:Heatmap:Title", fallback: "Teslim yoğunluğu", w: 4, h: 6, minW: 3, minH: 4 },
  "project-phases": { component: Vt, titleKey: "Dashboard:Phases:Title", fallback: "Proje fazları", w: 4, h: 6, minW: 3, minH: 4 },
  "statistics-band": { component: Yt, titleKey: "Dashboard:Statistics:Title", fallback: "İstatistikler", w: 12, h: 6, minW: 6, minH: 4, band: !0 }
}, ee = { desktop: 920, tablet: 560, mobile: 0 }, Zt = { desktop: 12, tablet: 6, mobile: 1 }, Jt = 64, De = [20, 20];
function ea(t) {
  return t >= ee.desktop ? "desktop" : t >= ee.tablet ? "tablet" : "mobile";
}
function ta(t) {
  return Math.max(0, t - De[0] * 2);
}
function aa(t) {
  return t >= 1015 ? { template: "repeat(4, minmax(0, 2fr)) minmax(0, 3fr)", h: 2 } : t >= 694 ? { template: "repeat(3, minmax(0, 1fr))", h: 4 } : t >= 456 ? { template: "repeat(2, minmax(0, 1fr))", h: 6 } : { template: "repeat(2, minmax(0, 1fr))", h: 4, compact: !0 };
}
const Ne = "apya-dashboard-view";
function na() {
  try {
    const t = window.localStorage.getItem(Ne);
    return F.some((n) => n.key === t) ? t : he;
  } catch {
    return he;
  }
}
function sa(t) {
  try {
    window.localStorage.setItem(Ne, t);
  } catch {
  }
}
function ra({ open: t, onOpenChange: n, presentCardKeys: a = [], onAdd: s }) {
  const [i, c] = x.useState(""), l = x.useMemo(() => {
    const o = i.trim().toLocaleLowerCase();
    return Object.entries(W).map(([d, u]) => ({ key: d, meta: u, label: r(u.titleKey, u.fallback) })).filter((d) => !o || d.label.toLocaleLowerCase().includes(o));
  }, [i]);
  return /* @__PURE__ */ e.jsx(Le, { open: t, onOpenChange: n, children: /* @__PURE__ */ e.jsx(Ie, { side: "right", className: "w-[380px] mobile:w-full", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 p-5 h-full", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-base font-semibold text-text-primary", children: r("Dashboard:Catalog:Title", "Kart ekle") }),
      /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-text-tertiary", children: r("Dashboard:Catalog:Subtitle", "Eklediğin kart görünümün altına yerleşir; sürükleyip boyutlandırabilirsin.") })
    ] }),
    /* @__PURE__ */ e.jsx(
      He,
      {
        value: i,
        onChange: (o) => c(o.target.value),
        placeholder: r("Dashboard:Catalog:Search", "Kart ara…"),
        "aria-label": r("Dashboard:Catalog:Search", "Kart ara…")
      }
    ),
    /* @__PURE__ */ e.jsxs("ul", { className: "flex flex-col gap-2 overflow-auto flex-1", children: [
      l.map(({ key: o, meta: d, label: u }) => {
        const b = a.includes(o);
        return /* @__PURE__ */ e.jsxs(
          "li",
          {
            className: m(
              "flex items-center justify-between gap-3 p-3 rounded-xl border",
              b ? "border-subtle bg-surface-sunken opacity-60" : "border-default bg-surface-base"
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
                H,
                {
                  size: "sm",
                  variant: b ? "ghost" : "secondary",
                  disabled: b,
                  onClick: () => s(o),
                  className: "flex-none",
                  children: b ? r("Dashboard:Catalog:Added", "Ekli") : r("Dashboard:Catalog:Add", "Ekle")
                }
              )
            ]
          },
          o
        );
      }),
      l.length === 0 && /* @__PURE__ */ e.jsx("li", { className: "text-[12.5px] text-text-tertiary py-4 text-center", children: r("Dashboard:Catalog:NoMatch", "Eşleşen kart yok.") })
    ] })
  ] }) }) });
}
function ia(t) {
  return w({
    queryKey: k.dashboard.layout(t),
    queryFn: () => Q.get(`/api/dashboard/layout?viewKey=${encodeURIComponent(t)}`),
    /* Düzen kullanıcıdan başkası değiştiremez → uzun taze kalır. */
    staleTime: 5 * 6e4,
    enabled: !!t
  });
}
function oa() {
  const t = V();
  return ge({
    mutationFn: ({ viewKey: n, cards: a }) => Q.put("/api/dashboard/layout", { viewKey: n, cards: a }),
    onSuccess: (n, { viewKey: a }) => {
      t.invalidateQueries({ queryKey: k.dashboard.layout(a) });
    }
  });
}
function la() {
  const t = V();
  return ge({
    mutationFn: (n) => Q.delete(`/api/dashboard/layout?viewKey=${encodeURIComponent(n)}`),
    onSuccess: (n, a) => {
      t.invalidateQueries({ queryKey: k.dashboard.layout(a) });
    }
  });
}
const Se = [
  ["Month", "Dashboard:Range:Month", "Bu ay"],
  ["Week", "Dashboard:Range:Week", "Bu hafta"],
  ["Quarter", "Dashboard:Range:Quarter", "Bu çeyrek"]
];
function ca() {
  var ne, se;
  const [t, n] = x.useState(() => na()), [a, s] = x.useState(() => ba()), [i, c] = x.useState(!1), [l, o] = x.useState(!1), [d, u] = x.useState(null), b = ia(t), f = oa(), y = la(), E = x.useMemo(() => ({ range: a }), [a]), g = d ?? ((ne = b.data) == null ? void 0 : ne.cards) ?? [], U = x.useRef(null), [N, P] = x.useState(null);
  x.useLayoutEffect(() => {
    const h = U.current;
    if (!h) return;
    const j = () => P(h.clientWidth);
    j();
    const v = new ResizeObserver(j);
    return v.observe(h), () => v.disconnect();
  }, []);
  const A = N == null ? null : ea(N), R = x.useMemo(
    () => aa(N == null ? 0 : ta(N)),
    [N]
  ), X = x.useMemo(
    () => ({ desktop: g.map((h) => fa(h, R.h)) }),
    [g, R.h]
  ), Z = x.useCallback((h) => {
    n(h), sa(h), u(null), c(!1);
  }, []), B = x.useCallback((h) => {
    i && A === "desktop" && u((j) => {
      const v = j ?? g;
      return h.map((T) => {
        const K = v.find((G) => G.cardKey === T.i);
        return {
          cardKey: T.i,
          /* Enum SAYI olarak gidip gelir; string göndermek
             deserialization hatası verir (JsonStringEnumConverter yok). */
          chartType: (K == null ? void 0 : K.chartType) ?? oe,
          x: T.x,
          y: T.y,
          w: T.w,
          h: T.h
        };
      });
    });
  }, [i, g, A]), ae = A === "desktop", we = x.useCallback(() => {
    f.mutate(
      { viewKey: t, cards: d ?? g },
      { onSuccess: () => {
        u(null), c(!1);
      } }
    );
  }, [f, t, d, g]), Te = x.useCallback(() => {
    y.mutate(t, {
      onSuccess: () => {
        u(null), c(!1);
      }
    });
  }, [y, t]), Ce = x.useCallback((h) => {
    const j = W[h];
    if (!j) return;
    const v = d ?? g, T = v.reduce((K, G) => Math.max(K, G.y + G.h), 0);
    u([
      ...v,
      { cardKey: h, chartType: oe, x: 0, y: T, w: j.w, h: j.h }
    ]), o(!1), c(!0);
  }, [d, g]), Ee = x.useCallback((h) => {
    u((d ?? g).filter((v) => v.cardKey !== h));
  }, [d, g]);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-app-bg", children: [
    /* @__PURE__ */ e.jsx(
      ua,
      {
        viewKey: t,
        onViewChange: Z,
        range: a,
        onRangeChange: s,
        editMode: i,
        canEdit: ae,
        onToggleEdit: () => c((h) => !h),
        onOpenCatalog: () => o(!0)
      }
    ),
    i && /* @__PURE__ */ e.jsx(
      ha,
      {
        onSave: we,
        isSaving: f.isPending
      }
    ),
    /* @__PURE__ */ e.jsxs("main", { className: "px-4 pt-4 pb-4 mobile:px-3", children: [
      /* @__PURE__ */ e.jsx("div", { ref: U, children: N != null && (A === "desktop" ? /* @__PURE__ */ e.jsx(
        Ge.Responsive,
        {
          width: N,
          className: m("apya-dashboard-grid", i && "apya-dashboard-grid--edit"),
          layouts: X,
          breakpoints: ee,
          cols: Zt,
          rowHeight: Jt,
          margin: De,
          isDraggable: i,
          isResizable: i,
          draggableHandle: `.${D.DRAG_HANDLE_CLASS}`,
          onLayoutChange: B,
          compactType: "vertical",
          preventCollision: !1,
          children: g.map((h) => {
            const j = W[h.cardKey];
            if (!j) return /* @__PURE__ */ e.jsx("div", {}, h.cardKey);
            const v = j.component;
            return /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ e.jsx(
                v,
                {
                  filter: E,
                  editMode: i,
                  ...h.cardKey === "summary-strip" ? { template: R.template, compact: R.compact } : null
                }
              ),
              i && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => Ee(h.cardKey),
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
            ] }, h.cardKey);
          })
        }
      ) : /* @__PURE__ */ e.jsx(da, { tier: A, cards: g, filter: E, strip: R })) }),
      /* @__PURE__ */ e.jsx(
        pa,
        {
          isDefault: ((se = b.data) == null ? void 0 : se.isDefault) !== !1,
          canEdit: ae,
          onReset: Te,
          onOpenCatalog: () => o(!0),
          isResetting: y.isPending
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      ra,
      {
        open: l,
        onOpenChange: o,
        presentCardKeys: g.map((h) => h.cardKey),
        onAdd: Ce
      }
    )
  ] });
}
function da({ tier: t, cards: n, filter: a, strip: s }) {
  const i = t === "tablet" ? 2 : 1;
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: m("grid items-stretch", t === "tablet" ? "gap-3.5" : "gap-3"),
      style: { gridTemplateColumns: `repeat(${i}, minmax(0, 1fr))` },
      children: n.map((c) => {
        const l = W[c.cardKey];
        if (!l) return null;
        const o = l.component, d = i > 1 && l.band;
        return /* @__PURE__ */ e.jsx("div", { style: d ? { gridColumn: "1 / -1" } : void 0, children: /* @__PURE__ */ e.jsx(
          o,
          {
            filter: a,
            editMode: !1,
            ...c.cardKey === "summary-strip" ? { template: s.template, compact: s.compact } : null
          }
        ) }, c.cardKey);
      })
    }
  );
}
function ua({ viewKey: t, onViewChange: n, range: a, onRangeChange: s, editMode: i, canEdit: c, onToggleEdit: l, onOpenCatalog: o }) {
  const d = F.find((u) => u.key === t) ?? F[0];
  return /* @__PURE__ */ e.jsxs("header", { className: "px-4 pt-4 pb-3 bg-surface-base border-b border-default flex items-end justify-between gap-5 mobile:px-3 mobile:flex-col mobile:items-stretch mobile:gap-3", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("h1", { className: "text-[22px] font-semibold tracking-[-0.025em] text-text-primary m-0", children: r("Dashboard:Title", "Genel Bakış") }),
        /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center h-[22px] px-[9px] rounded-full bg-accent-soft text-accent-600 text-[11.5px] font-semibold flex-none mobile:hidden", children: r(d.labelKey, d.fallback) })
      ] }),
      /* @__PURE__ */ e.jsx("nav", { className: "flex items-center gap-1 flex-wrap mobile:hidden", "aria-label": r("Dashboard:Views", "Görünümler"), children: F.map((u) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => n(u.key),
          "aria-current": u.key === t ? "page" : void 0,
          className: m(
            "inline-flex items-center h-[30px] px-3 rounded-[9px] text-[12.5px] transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:shadow-focus",
            u.key === t ? "bg-text-primary text-surface-base font-semibold" : "text-text-secondary font-medium hover:bg-surface-sunken hover:text-text-primary"
          ),
          children: r(u.labelKey, u.fallback)
        },
        u.key
      )) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-none mobile:flex-wrap", children: [
      /* @__PURE__ */ e.jsx(xa, { value: t, onChange: n }),
      /* @__PURE__ */ e.jsx(ma, { value: a, onChange: s }),
      c && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(H, { size: "sm", variant: "secondary", onClick: o, children: r("Dashboard:AddCard", "+ Kart ekle") }),
        /* @__PURE__ */ e.jsx(H, { size: "sm", variant: "primary", onClick: l, children: i ? r("Common:Done", "Bitir") : r("Common:Edit", "Düzenle") })
      ] })
    ] })
  ] });
}
function xa({ value: t, onChange: n }) {
  return /* @__PURE__ */ e.jsxs("label", { className: "hidden mobile:inline-flex items-center flex-1 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "sr-only", children: r("Dashboard:SelectView", "Görünüm seç") }),
    /* @__PURE__ */ e.jsx(
      "select",
      {
        value: t,
        onChange: (a) => n(a.target.value),
        className: m(
          "h-8 w-full px-3 rounded-[9px] text-[12.5px] font-medium",
          "bg-surface-sunken text-text-secondary border-0",
          "focus-visible:outline-none focus-visible:shadow-focus"
        ),
        children: F.map((a) => /* @__PURE__ */ e.jsx("option", { value: a.key, children: r(a.labelKey, a.fallback) }, a.key))
      }
    )
  ] });
}
function ma({ value: t, onChange: n }) {
  return /* @__PURE__ */ e.jsxs("label", { className: "inline-flex items-center", children: [
    /* @__PURE__ */ e.jsx("span", { className: "sr-only", children: r("Dashboard:SelectRange", "Zaman aralığı seç") }),
    /* @__PURE__ */ e.jsx(
      "select",
      {
        value: t,
        onChange: (a) => {
          n(a.target.value), ga(a.target.value);
        },
        className: m(
          "h-8 px-3 rounded-[9px] text-[12.5px] font-medium",
          "bg-surface-sunken text-text-secondary border-0",
          "focus-visible:outline-none focus-visible:shadow-focus"
        ),
        children: Se.map(([a, s, i]) => /* @__PURE__ */ e.jsx("option", { value: a, children: r(s, i) }, a))
      }
    )
  ] });
}
function ha({ onSave: t, isSaving: n }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-6 py-2.5 bg-accent-soft border-b border-default mobile:px-3 mobile:flex-wrap", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center h-[26px] px-2.5 rounded-lg bg-accent text-white text-[11.5px] font-semibold", children: r("Dashboard:EditMode", "Düzenleme modu") }),
      /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center h-[26px] px-2.5 rounded-lg bg-surface-base border border-default text-accent-600 text-[11.5px]", children: r("Dashboard:EditMode:Snap", "Yapış: 12 kolon · 64px satır") })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] text-accent-600 mobile:hidden", children: r("Dashboard:EditMode:Hint", "Kartı başlıktaki ⠿ tutamağından sürükle") }),
      /* @__PURE__ */ e.jsx(H, { size: "sm", variant: "primary", onClick: t, disabled: n, children: r("Dashboard:EditMode:Save", "Düzeni kaydet") })
    ] })
  ] });
}
function pa({ isDefault: t, canEdit: n, onReset: a, onOpenCatalog: s, isResetting: i }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 mt-5 px-4 py-3 rounded-card border border-dashed border-default bg-surface-base mobile:flex-col mobile:items-stretch", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-secondary", children: t ? r("Dashboard:Footer:DefaultLayout", "Bu görünüm rol varsayılanından geldi — kart ekleyip çıkarabilir, sürükleyip boyutlandırabilirsin.") : r("Dashboard:Footer:CustomLayout", "Bu görünümü sen düzenledin. Dilediğin an varsayılana dönebilirsin.") }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      !t && /* @__PURE__ */ e.jsx(H, { size: "sm", variant: "secondary", onClick: a, disabled: i, children: r("Dashboard:Footer:Reset", "Varsayılana dön") }),
      n && /* @__PURE__ */ e.jsx(H, { size: "sm", variant: "primary", onClick: s, children: r("Dashboard:AddCard", "+ Kart ekle") })
    ] })
  ] });
}
function fa(t, n) {
  const a = W[t.cardKey], s = t.cardKey === "summary-strip";
  return {
    i: t.cardKey,
    x: t.x,
    y: t.y,
    w: t.w,
    h: s ? n : t.h,
    minW: (a == null ? void 0 : a.minW) ?? 2,
    minH: s ? n : (a == null ? void 0 : a.minH) ?? 2
  };
}
function ba() {
  try {
    const t = new URLSearchParams(window.location.search).get("range");
    return Se.some(([n]) => n === t) ? t : "Month";
  } catch {
    return "Month";
  }
}
function ga(t) {
  try {
    const n = new URLSearchParams(window.location.search);
    n.set("range", t), window.history.replaceState(null, "", `${window.location.pathname}?${n}`);
  } catch {
  }
}
function ya(t) {
  const { connection: n, state: a } = je(), s = V();
  x.useEffect(() => {
    if (!n || !(t != null && t.length)) return;
    const i = t.map(([c, l]) => {
      const o = () => {
        l.forEach((d) => {
          s.invalidateQueries({ queryKey: d });
        });
      };
      return n.on(c, o), [c, o];
    });
    return () => {
      i.forEach(([c, l]) => {
        n.off(c, l);
      });
    };
  }, [n, a, s]);
}
function ja(t) {
  const { connection: n, state: a } = je(), s = V(), i = We();
  x.useEffect(() => {
    if (!n || !(t != null && t.length)) return;
    const c = t.map(([l, o]) => {
      const d = (u) => {
        var b;
        (b = o.queryKeys) == null || b.forEach(
          (f) => s.invalidateQueries({ queryKey: f })
        ), i.warning(o.message ?? "Bu kayıtta çakışma oldu", {
          description: o.description ?? (u == null ? void 0 : u.message),
          action: {
            label: "Yenile",
            onClick: () => {
              var f;
              (f = o.queryKeys) == null || f.forEach(
                (y) => s.invalidateQueries({ queryKey: y })
              );
            }
          }
        });
      };
      return n.on(l, d), [l, d];
    });
    return () => {
      c.forEach(([l, o]) => n.off(l, o));
    };
  }, [n, a, s]);
}
const p = (t) => ["dashboard", t];
function va() {
  const t = x.useMemo(() => [
    /* Görev durumu değişti → teslimler, tıkananlar, özet, ısı takvimi, istatistik */
    ["TaskStatusChanged", [
      p("summary"),
      p("deliveries"),
      p("blocked-tasks"),
      p("delivery-heatmap"),
      p("statistics"),
      p("project-health")
    ]],
    /* Atama değişti → tıkanma sebebi "atanmamış" olabilir */
    ["TaskAssigned", [p("blocked-tasks"), p("deliveries")]],
    /* Onay kuyruğu (taslak fatura) hareketi */
    ["ApprovalCreated", [p("pending-approvals"), p("summary"), p("statistics")]],
    ["ApprovalResolved", [p("pending-approvals"), p("summary"), p("statistics")]],
    /* Bütçe / muhasebe hareketi → bütçe oranları ve finans istatistikleri */
    ["BudgetUpdated", [p("summary"), p("project-health"), p("statistics")]],
    ["JournalEntryPosted", [p("income-expense"), p("statistics")]],
    /* Hibe belgesi son tarihi → ısı takviminin sarı günleri */
    ["GrantDocumentDue", [p("delivery-heatmap"), p("statistics")]]
  ], []), n = x.useMemo(() => [
    ["BudgetConflict", {
      queryKeys: [p("summary"), p("project-health")],
      message: "Bütçe kaydında çakışma",
      description: "Aynı bütçeyi başka bir kullanıcı güncelledi."
    }]
  ], []);
  return ya(t), ja(n), null;
}
Oe();
const pe = document.getElementById("apya-dashboard-root");
pe && Ae(pe).render(
  /* @__PURE__ */ e.jsx(Me, { children: /* @__PURE__ */ e.jsx(Fe, { children: /* @__PURE__ */ e.jsx(Pe, { children: /* @__PURE__ */ e.jsx(Ue, { children: /* @__PURE__ */ e.jsxs(_e, { children: [
    /* @__PURE__ */ e.jsx(va, {}),
    /* @__PURE__ */ e.jsx(ca, {})
  ] }) }) }) }) })
);
