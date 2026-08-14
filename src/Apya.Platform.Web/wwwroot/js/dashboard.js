import { r as x, j as e, d as fe, b as Se } from "./react-vendor.js";
import { c as p, t as s, S as C, a as Te, f as U, b as se, d as Ee, e as Ce, I as Ae, B as R, T as Re } from "./Dialog.js";
import { Q as k, a as Le } from "./QueryProvider.js";
import { H as be, a as Me, L as Ie } from "./signalr-vendor.js";
import { u as He, r as Pe, T as Be } from "./registerServiceWorker.js";
import { r as re } from "./grid-vendor.js";
import { E as N } from "./EmptyState.js";
import { u as w, a as q, b as ge } from "./query-vendor.js";
import { a as $ } from "./httpClient.js";
/* empty css      */
const ye = x.createContext({
  connection: null,
  state: be.Disconnected
});
function Ke({ hubUrl: t = "/signalr-hubs/notifications", children: a, enabled: n = !0 }) {
  const [r, o] = x.useState(be.Disconnected), c = x.useRef(null);
  x.useEffect(() => {
    if (!n || typeof window > "u") return;
    const i = new Me().withUrl(t, { withCredentials: !0 }).withAutomaticReconnect([0, 2e3, 5e3, 1e4, 3e4]).configureLogging(Ie.Warning).build();
    c.current = i, o(i.state);
    const d = () => o(i.state);
    return i.onreconnecting(d), i.onreconnected(d), i.onclose(d), i.start().then(d).catch((u) => {
      console.warn("[SignalR] connect failed:", u == null ? void 0 : u.message), d();
    }), () => {
      i.stop().catch(() => {
      }), c.current = null;
    };
  }, [t, n]);
  const l = x.useMemo(() => ({
    get connection() {
      return c.current;
    },
    state: r
  }), [r]);
  return /* @__PURE__ */ e.jsx(ye.Provider, { value: l, children: a });
}
function ve() {
  return x.useContext(ye);
}
const F = {
  triage: "(min-width: 768px)",
  analysis: "(min-width: 1280px)",
  command: "(min-width: 1920px)"
};
function Fe() {
  return typeof window > "u" || !window.matchMedia ? "analysis" : window.matchMedia(F.command).matches ? "command" : window.matchMedia(F.analysis).matches ? "analysis" : window.matchMedia(F.triage).matches ? "triage" : "decision";
}
const Oe = x.createContext(null);
function Ue({ children: t, override: a }) {
  const n = x.useCallback((c) => {
    if (typeof window > "u" || !window.matchMedia) return () => {
    };
    const l = Object.values(F).map((i) => window.matchMedia(i));
    return l.forEach((i) => i.addEventListener("change", c)), () => l.forEach((i) => i.removeEventListener("change", c));
  }, []), r = x.useSyncExternalStore(n, Fe, () => "analysis"), o = a ?? r;
  return x.useEffect(() => {
    typeof document > "u" || (document.documentElement.dataset.deviceMode = o);
  }, [o]), /* @__PURE__ */ e.jsx(Oe.Provider, { value: o, children: t });
}
const je = "apya-card-drag-handle";
function D({
  title: t,
  subtitle: a,
  badge: n,
  actions: r,
  footer: o,
  accent: c,
  /* 'negative' | 'warning' — kritik kartların üst şeridi */
  editMode: l = !1,
  isLoading: i = !1,
  isError: d = !1,
  errorMessage: u,
  onRetry: f,
  isEmpty: g = !1,
  emptyState: j,
  skeleton: E,
  isFetching: y = !1,
  isStale: V = !1,
  dataUpdatedAt: Q,
  bleed: M = !1,
  className: Y,
  bodyClassName: X,
  children: Z
}) {
  const J = !i && !d && V && y;
  return /* @__PURE__ */ e.jsxs(
    "section",
    {
      className: p(
        "h-full flex flex-col overflow-hidden",
        "rounded-card shadow-card",
        "bg-surface-base border border-default",
        Y
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
                l && /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: p(
                      je,
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
                    J && /* @__PURE__ */ e.jsx(qe, {})
                  ] }),
                  a && /* @__PURE__ */ e.jsx("p", { className: "text-[11.5px] text-text-tertiary truncate", children: a })
                ] })
              ] }),
              r && /* Aksiyonlara basmak kartı sürüklemesin. */
              /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "flex items-center gap-2.5 flex-none",
                  onMouseDown: (I) => I.stopPropagation(),
                  onTouchStart: (I) => I.stopPropagation(),
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
              "flex-1 min-h-0 pt-3",
              M ? "pb-0" : "px-[18px] pb-[18px]",
              M && "px-[18px]",
              X
            ),
            children: [
              d && /* @__PURE__ */ e.jsx(_e, { message: u, onRetry: f, dataUpdatedAt: Q }),
              !d && i && (E ?? /* @__PURE__ */ e.jsx(We, {})),
              !d && !i && g && (j ?? /* @__PURE__ */ e.jsx(Ge, {})),
              !d && !i && !g && Z
            ]
          }
        ),
        o && /* @__PURE__ */ e.jsx("footer", { className: "flex-none px-[18px] pb-[14px] pt-1", children: o })
      ]
    }
  );
}
function We() {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", "aria-busy": "true", children: [
    /* @__PURE__ */ e.jsx(C, { height: 28, className: "w-1/3" }),
    /* @__PURE__ */ e.jsx(C, { height: 14 }),
    /* @__PURE__ */ e.jsx(C, { height: 14, className: "w-5/6" }),
    /* @__PURE__ */ e.jsx(C, { height: 14, className: "w-3/4" })
  ] });
}
function Ge() {
  return /* @__PURE__ */ e.jsx(
    N,
    {
      compact: !0,
      title: s("Common:NoDataToShow", "Görüntülenecek veri yok"),
      description: s("Common:NoDataYet", "Yeni veri girildiğinde burada görünecek.")
    }
  );
}
function _e({ message: t, onRetry: a, dataUpdatedAt: n }) {
  const r = $e(n);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center justify-center text-center gap-2 py-4", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-text-secondary max-w-xs", children: t || s("Common:FetchError", "Veri alınırken bir hata oluştu.") }),
    r && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-text-tertiary", children: [
      s("Common:LastSuccessfulUpdate", "Son başarılı güncelleme"),
      ": ",
      r
    ] }),
    a && /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        onClick: a,
        className: "text-[12.5px] text-text-link underline-offset-2 hover:underline focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
        children: s("Common:Retry", "Tekrar dene")
      }
    )
  ] });
}
function qe() {
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
function $e(t) {
  if (t == null) return null;
  const a = t instanceof Date ? t.getTime() : Number(t);
  if (!Number.isFinite(a)) return null;
  const n = Math.round((a - Date.now()) / 1e3), r = Math.abs(n), o = new Intl.RelativeTimeFormat(Te(), { numeric: "auto" });
  return r < 60 ? o.format(n, "second") : r < 3600 ? o.format(Math.round(n / 60), "minute") : r < 86400 ? o.format(Math.round(n / 3600), "hour") : o.format(Math.round(n / 86400), "day");
}
D.DRAG_HANDLE_CLASS = je;
function ze({ trend: t, children: a }) {
  const n = t === "Up" ? "▲" : t === "Down" ? "▼" : "•";
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: p(
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
const W = 100, A = 40;
function Ve(t, a = A, n = 2) {
  const r = Math.max(...t, 0);
  if (r <= 0) return t.map(() => a - n);
  const o = a - n * 2;
  return t.map((c) => n + o - c / r * o);
}
function Qe(t, a = W) {
  if (t <= 1) return [a / 2];
  const n = a / (t - 1);
  return Array.from({ length: t }, (r, o) => o * n);
}
function ke(t, a) {
  return t.length ? t.map((n, r) => `${r === 0 ? "M" : "L"} ${G(n)} ${G(a[r])}`).join(" ") : "";
}
function Ye(t, a, n = A) {
  return t.length ? `${ke(t, a)} L ${G(t[t.length - 1])} ${n} L ${G(t[0])} ${n} Z` : "";
}
function G(t) {
  return Math.round(t * 100) / 100;
}
function Xe({ values: t = [], color: a = "var(--apya-brand-500)", ariaLabel: n }) {
  const r = x.useId().replace(/:/g, "");
  if (t.length < 2) return null;
  const o = Qe(t.length), c = Ve(t);
  return /* @__PURE__ */ e.jsxs(
    "svg",
    {
      viewBox: `0 0 ${W} ${A}`,
      preserveAspectRatio: "none",
      className: "block w-full h-full",
      role: n ? "img" : "presentation",
      "aria-label": n,
      children: [
        /* @__PURE__ */ e.jsx("defs", { children: /* @__PURE__ */ e.jsxs("linearGradient", { id: r, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ e.jsx("stop", { offset: "0%", stopColor: a, stopOpacity: "0.16" }),
          /* @__PURE__ */ e.jsx("stop", { offset: "100%", stopColor: a, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ e.jsx("path", { d: Ye(o, c), fill: `url(#${r})` }),
        /* @__PURE__ */ e.jsx(
          "path",
          {
            d: ke(o, c),
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
const Ze = ["var(--apya-positive-500)", "color-mix(in srgb, var(--apya-negative-500) 45%, transparent)"];
function Je({ groups: t = [], colors: a = Ze, ariaLabel: n }) {
  if (!t.length) return null;
  const r = Math.max(...t.flatMap((i) => i.values), 0), o = W / t.length, c = Math.min(4.5, o * 0.62 / 2), l = c * 0.22;
  return /* @__PURE__ */ e.jsx(
    "svg",
    {
      viewBox: `0 0 ${W} ${A}`,
      preserveAspectRatio: "none",
      className: "block w-full h-full",
      role: n ? "img" : "presentation",
      "aria-label": n,
      children: t.map((i, d) => {
        const u = i.values.length * c + (i.values.length - 1) * l, f = d * o + (o - u) / 2;
        return i.values.map((g, j) => {
          const E = r > 0 ? g / r * (A - 2) : 0;
          return /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: f + j * (c + l),
              y: A - E,
              width: c,
              height: E,
              rx: "0.8",
              fill: a[j % a.length]
            },
            `${d}-${j}`
          );
        });
      })
    }
  );
}
const ee = 34, ie = 2 * Math.PI * ee;
function et({ ratio: t = 0, size: a = 58, ariaLabel: n }) {
  const r = Math.max(0, Math.min(t, 1)), o = r * ie, c = r >= 0.9 ? "var(--apya-negative-500)" : r >= 0.7 ? "var(--apya-warning-500)" : "var(--apya-positive-500)";
  return /* @__PURE__ */ e.jsxs(
    "svg",
    {
      viewBox: "0 0 100 100",
      style: { width: a, height: a },
      className: "flex-none",
      role: "img",
      "aria-label": n ?? `${Math.round(r * 100)}%`,
      children: [
        /* @__PURE__ */ e.jsx("circle", { cx: "50", cy: "50", r: ee, fill: "none", stroke: "var(--apya-surface-sunken)", strokeWidth: "12" }),
        o > 0 && /* @__PURE__ */ e.jsx(
          "circle",
          {
            cx: "50",
            cy: "50",
            r: ee,
            fill: "none",
            stroke: c,
            strokeWidth: "12",
            strokeDasharray: `${o} ${ie - o}`,
            strokeLinecap: "round",
            transform: "rotate(-90 50 50)"
          }
        )
      ]
    }
  );
}
const tt = [
  "bg-surface-sunken",
  /* 0 teslim */
  "bg-brand-200",
  "bg-brand-300",
  "bg-brand-500",
  "bg-brand-600"
];
function at(t, a) {
  return t <= 0 ? 0 : a <= 1 ? 2 : Math.min(4, 1 + Math.round((t - 1) / a * 3));
}
function nt({ cells: t = [], weekdayLabels: a = !0 }) {
  if (!t.length) return null;
  const n = Math.max(...t.map((o) => o.count), 0), r = [];
  for (let o = 0; o < t.length; o += 7) r.push(t.slice(o, o + 7));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
    r.map((o, c) => /* @__PURE__ */ e.jsx("div", { className: "flex gap-1", children: o.map((l) => /* @__PURE__ */ e.jsx(
      "span",
      {
        title: st(l),
        className: p(
          "flex-1 h-[15px] rounded",
          /* Hibe günü kademeden çıkar, sarı boyanır. Tasarımdaki
             #FCD34D için token yok → warning-500 yarı saydam
             (yeni renk üretmemek için). */
          l.isGrantDeadline ? "bg-warning-500/55" : tt[at(l.count, n)]
        )
      },
      l.date
    )) }, c)),
    a && /* @__PURE__ */ e.jsx("div", { className: "flex justify-between font-mono text-[9.5px] text-text-tertiary pt-0.5", children: [
      s("Common:Day:Mon", "Pzt"),
      s("Common:Day:Tue", "Sal"),
      s("Common:Day:Wed", "Çar"),
      s("Common:Day:Thu", "Per"),
      s("Common:Day:Fri", "Cum"),
      s("Common:Day:Sat", "Cmt"),
      s("Common:Day:Sun", "Paz")
    ].map((o) => /* @__PURE__ */ e.jsx("span", { children: o }, o)) })
  ] });
}
function st(t) {
  const a = new Date(t.date).toLocaleDateString(), n = s("Dashboard:Heatmap:CellCount", "{0} teslim", t.count);
  return t.isGrantDeadline ? `${a} — ${n} · ${s("Dashboard:Heatmap:GrantDeadline", "hibe son tarihi")}` : `${a} — ${n}`;
}
function rt({ ratio: t = 0, tone: a = "positive", ariaLabel: n }) {
  const r = Math.max(0, Math.min(t, 1)), o = Math.round(r * 100), c = a === "negative" ? "var(--apya-negative-500)" : a === "warning" ? "var(--apya-warning-500)" : "var(--apya-positive-500)";
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "flex gap-1",
      role: "img",
      "aria-label": n ?? `%${o}`,
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-[5px] rounded-full", style: { flex: o, background: c } }),
        o < 100 && /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "h-[5px] rounded-full bg-surface-sunken",
            style: { flex: 100 - o }
          }
        )
      ]
    }
  );
}
const it = ["Upcoming", "OnTrack", "InReview", "Overdue"], ot = ["ThisWeek", "NextWeek", "EndOfMonth", "Later"], lt = ["Healthy", "Attention", "Risky"], ct = ["WaitingReview", "Dependency", "Unassigned"], dt = ["Flat", "Up", "Down"], ut = ["Work", "Finance", "Grants", "Communication", "System"];
function L(t, a, n) {
  return typeof a == "string" ? a : t[a] ?? n;
}
function xt(t) {
  return (t ?? []).map((a) => ({
    ...a,
    state: L(it, a.state, "Upcoming"),
    groupKey: L(ot, a.groupKey, "Later")
  }));
}
function mt(t) {
  return (t ?? []).map((a) => ({
    ...a,
    state: L(lt, a.state, "Healthy")
  }));
}
function ht(t) {
  return (t ?? []).map((a) => ({
    ...a,
    blockReason: L(ct, a.blockReason, "Dependency")
  }));
}
function pt(t) {
  return (t ?? []).map((a) => ({
    ...a,
    group: L(ut, a.group, "Work"),
    trend: L(dt, a.trend, "Flat")
  }));
}
const oe = 0, P = 6e4, te = 3e4;
function ft({ range: t, projectId: a } = {}) {
  const n = new URLSearchParams();
  t && n.set("range", t), a && n.set("projectId", a);
  const r = n.toString();
  return r ? `?${r}` : "";
}
const T = (t, a) => $.get(`/api/dashboard/${t}${ft(a)}`);
function bt(t) {
  return w({
    queryKey: k.dashboard.summary(t),
    queryFn: () => T("summary", t),
    staleTime: te
    /* bütçe alanları içeriyor */
  });
}
function gt(t) {
  return w({
    queryKey: k.dashboard.deliveries(t),
    queryFn: () => T("deliveries", t),
    select: xt,
    staleTime: P
  });
}
function yt(t) {
  return w({
    queryKey: k.dashboard.projectHealth(t),
    queryFn: () => T("project-health", t),
    select: mt,
    staleTime: P
  });
}
function vt() {
  return w({
    queryKey: k.dashboard.approvals(),
    queryFn: () => T("pending-approvals"),
    staleTime: te
  });
}
function jt() {
  return w({
    queryKey: k.dashboard.blockedTasks(),
    queryFn: () => T("blocked-tasks"),
    select: ht,
    staleTime: P
  });
}
function kt(t) {
  return w({
    queryKey: k.dashboard.statistics(t),
    queryFn: () => T("statistics", t),
    select: pt,
    staleTime: P
  });
}
function Dt(t) {
  return w({
    queryKey: k.dashboard.incomeExpense(t),
    queryFn: () => T("income-expense", t),
    staleTime: te
  });
}
function Nt(t) {
  return w({
    queryKey: k.dashboard.deliveryHeatmap(t),
    queryFn: () => T("delivery-heatmap", t),
    staleTime: P
  });
}
function wt({ filter: t }) {
  const { data: a, isLoading: n, isError: r, refetch: o } = bt(t);
  return n ? /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-5 gap-3.5 mobile:grid-cols-2", children: Array.from({ length: 5 }, (c, l) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-card shadow-card bg-surface-base border border-default p-4", children: [
    /* @__PURE__ */ e.jsx(C, { height: 14, className: "w-2/3 mb-2" }),
    /* @__PURE__ */ e.jsx(C, { height: 28, className: "w-1/2" })
  ] }, l)) }) : r || !a ? /* @__PURE__ */ e.jsxs("div", { className: "rounded-card shadow-card bg-surface-base border border-default p-4 flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-secondary", children: s("Dashboard:Summary:Error", "Özet yüklenemedi.") }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => o(), className: "text-[12.5px] text-text-link hover:underline", children: s("Common:Retry", "Tekrar dene") })
  ] }) : (
    /* lt-1080 ve mobile ikisi de max-width → Tailwind bunları azalan sırada
       yazar, dar ekranda mobile kazanır. `tablet:` KULLANILMAZ: o min-width'tir,
       1440'ta da tetiklenirdi. */
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-5 gap-3.5 lt-1080:grid-cols-3 mobile:grid-cols-2", children: [
      /* @__PURE__ */ e.jsx(
        K,
        {
          label: s("Dashboard:Summary:DueThisPeriod", "Bu dönem teslim"),
          value: a.dueThisPeriod,
          pill: s("Dashboard:Summary:DueThisWeek", "{0} bu hafta", a.dueThisWeek),
          icon: /* @__PURE__ */ e.jsx(Tt, {}),
          iconTone: "brand",
          spark: a.dueTrend
        }
      ),
      /* @__PURE__ */ e.jsx(
        K,
        {
          label: s("Dashboard:Summary:Overdue", "Gecikmiş"),
          value: a.overdue,
          tone: "negative",
          pill: a.oldestOverdueDays != null ? s("Dashboard:Summary:OldestOverdue", "en eski {0} g", a.oldestOverdueDays) : null,
          pillTone: "negative",
          icon: /* @__PURE__ */ e.jsx(Et, {}),
          iconTone: "negative",
          caption: s("Dashboard:Summary:OverdueProjects", "{0} projede", a.overdueProjectCount)
        }
      ),
      /* @__PURE__ */ e.jsx(
        K,
        {
          label: s("Dashboard:Summary:Blocked", "Tıkanan iş"),
          value: a.blocked,
          tone: "warning",
          pill: s("Dashboard:Summary:BlockedAvg", "ort. {0} g", a.blockedAvgIdleDays),
          pillTone: "warning",
          icon: /* @__PURE__ */ e.jsx(Ct, {}),
          iconTone: "warning",
          caption: s("Dashboard:Summary:BlockedReasons", "onay · bilgi · bağımlılık")
        }
      ),
      /* @__PURE__ */ e.jsx(
        K,
        {
          label: s("Dashboard:Summary:PendingApprovals", "Bende onay"),
          value: a.pendingApprovals,
          locked: a.pendingApprovals == null,
          lockedPermission: "Platform.Invoices",
          pill: a.pendingApprovalAmount != null ? U(a.pendingApprovalAmount, a.currency) : null,
          icon: /* @__PURE__ */ e.jsx(At, {}),
          iconTone: "brand",
          caption: a.pendingApprovalAvgAgeHours != null ? s("Dashboard:Summary:AvgWait", "ortalama bekleme {0} sa", a.pendingApprovalAvgAgeHours) : null
        }
      ),
      /* @__PURE__ */ e.jsx(St, { data: a })
    ] })
  );
}
function K({ label: t, value: a, pill: n, pillTone: r = "neutral", caption: o, tone: c = "neutral", icon: l, iconTone: i = "brand", spark: d, locked: u, lockedPermission: f }) {
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: p(
        "rounded-card shadow-card bg-surface-base border border-default",
        "flex flex-col gap-[7px] overflow-hidden",
        /* Üst ve yan padding TÜM kutucuklarda aynı; yalnız alt padding
           grafikli kutucukta sıfırlanır ki sparkline kenara yapışsın.
           Farklı üst padding vermek şeritteki başlıkları kaydırıyordu. */
        "pt-4 px-4",
        d ? "pb-0" : "pb-4"
      ),
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-medium text-text-secondary truncate", children: t }),
          /* @__PURE__ */ e.jsx("span", { className: p(
            "inline-flex items-center justify-center w-6 h-6 rounded-lg flex-none",
            i === "negative" ? "bg-negative-50 text-negative-700" : i === "warning" ? "bg-warning-50 text-warning-700" : "bg-accent-soft text-accent-600"
          ), children: l })
        ] }),
        u ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[28px] font-semibold leading-none tracking-[-0.03em] text-text-tertiary", children: "— —" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: s("Dashboard:Stat:Locked", "yetki gerekli") }),
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary", children: f })
        ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
            /* @__PURE__ */ e.jsx("span", { className: p(
              "font-mono text-[28px] font-semibold leading-none tracking-[-0.03em] tabular-nums",
              c === "negative" ? "text-negative-500" : c === "warning" ? "text-warning-600" : "text-text-primary"
            ), children: a }),
            n && /* @__PURE__ */ e.jsx("span", { className: p(
              "font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full tabular-nums",
              r === "negative" ? "bg-negative-50 text-negative-700" : r === "warning" ? "bg-warning-50 text-warning-700" : "bg-surface-sunken text-text-secondary"
            ), children: n })
          ] }),
          o && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary truncate", children: o })
        ] }),
        d && d.length > 1 && /* @__PURE__ */ e.jsx("div", { className: "h-9 mt-1 -mx-4", children: /* @__PURE__ */ e.jsx(Xe, { values: d, ariaLabel: s("Dashboard:Summary:DueTrend", "Teslim dağılımı") }) })
      ]
    }
  );
}
function St({ data: t }) {
  const a = t.budgetUsedRatio == null && t.budgetTotal == null;
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-card shadow-card bg-surface-base border border-default p-4 flex items-center justify-between gap-2.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-medium text-text-secondary truncate", children: s("Dashboard:Summary:BudgetUsage", "Bütçe kullanımı") }),
      a ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[28px] font-semibold leading-none tracking-[-0.03em] text-text-tertiary", children: "— —" }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary", children: "Platform.Projects.ViewBudget" })
      ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[28px] font-semibold leading-none tracking-[-0.03em] text-text-primary tabular-nums", children: [
          "%",
          Math.round((t.budgetUsedRatio ?? 0) * 100)
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary truncate", children: [
          U(t.budgetSpent, t.currency),
          " / ",
          U(t.budgetTotal, t.currency)
        ] })
      ] })
    ] }),
    !a && /* @__PURE__ */ e.jsx(et, { ratio: t.budgetUsedRatio ?? 0 })
  ] });
}
const z = { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }, Tt = () => /* @__PURE__ */ e.jsxs("svg", { ...z, children: [
  /* @__PURE__ */ e.jsx("path", { d: "M8 2v3M16 2v3M4 9h16" }),
  /* @__PURE__ */ e.jsx("rect", { x: "4", y: "5", width: "16", height: "16", rx: "2" })
] }), Et = () => /* @__PURE__ */ e.jsxs("svg", { ...z, children: [
  /* @__PURE__ */ e.jsx("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ e.jsx("path", { d: "M12 8v5" }),
  /* @__PURE__ */ e.jsx("path", { d: "M12 16.5v.01" })
] }), Ct = () => /* @__PURE__ */ e.jsxs("svg", { ...z, children: [
  /* @__PURE__ */ e.jsx("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ e.jsx("path", { d: "M5.6 5.6l12.8 12.8" })
] }), At = () => /* @__PURE__ */ e.jsx("svg", { ...z, children: /* @__PURE__ */ e.jsx("path", { d: "M20 6L9 17l-5-5" }) }), le = ["ThisWeek", "NextWeek", "EndOfMonth", "Later"], ce = {
  ThisWeek: ["Dashboard:Deliveries:ThisWeek", "Bu hafta"],
  NextWeek: ["Dashboard:Deliveries:NextWeek", "Gelecek hafta"],
  EndOfMonth: ["Dashboard:Deliveries:EndOfMonth", "Ay sonu"],
  Later: ["Dashboard:Deliveries:Later", "Sonrası"]
};
function Rt({ filter: t, editMode: a }) {
  const n = gt(t), r = n.data ?? [], o = x.useMemo(() => {
    const l = new Map(le.map((i) => [i, []]));
    for (const i of r)
      (l.get(i.groupKey) ?? l.get("Later")).push(i);
    return le.map((i) => ({ key: i, items: l.get(i) ?? [] })).filter((i) => i.items.length > 0);
  }, [r]), c = r.filter((l) => l.state === "Overdue").length;
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: a,
      title: s("Dashboard:Deliveries:Title", "Bu ay teslim edilecekler"),
      subtitle: s("Dashboard:Deliveries:Subtitle", "{0} iş · {1} gecikmiş", r.length, c),
      actions: /* @__PURE__ */ e.jsx("a", { href: "/Tasks", className: "text-[12.5px] font-medium text-text-link hover:underline", children: s("Dashboard:Deliveries:AllTasks", "Görev listesi →") }),
      isLoading: n.isLoading,
      isError: n.isError,
      onRetry: n.refetch,
      isEmpty: r.length === 0,
      isFetching: n.isFetching,
      isStale: n.isStale,
      dataUpdatedAt: n.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        N,
        {
          compact: !0,
          title: s("Dashboard:Deliveries:EmptyTitle", "Bu dönem teslim yok"),
          description: s("Dashboard:Deliveries:EmptyDescription", "Son tarihi bu döneme düşen açık iş bulunmuyor."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Tasks", className: "text-[12.5px] font-medium text-text-link hover:underline", children: s("Dashboard:Deliveries:AllTasks", "Görev listesi →") })
        }
      ),
      children: /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2.5", children: o.map((l) => /* @__PURE__ */ e.jsxs(fe.Fragment, { children: [
        /* @__PURE__ */ e.jsx(Lt, { groupKey: l.key, count: l.items.length }),
        /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col gap-[3px]", children: l.items.map((i) => /* @__PURE__ */ e.jsx(Mt, { item: i }, i.taskId)) })
      ] }, l.key)) })
    }
  );
}
function Lt({ groupKey: t, count: a }) {
  const [n, r] = ce[t] ?? ce.Later;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold uppercase tracking-[0.04em] text-text-tertiary", children: s(n, r) }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary tabular-nums", children: a }),
    /* @__PURE__ */ e.jsx("span", { className: "flex-1 h-px bg-subtle" })
  ] });
}
const de = {
  Overdue: "bg-negative-500",
  InReview: "bg-warning-500",
  OnTrack: "bg-positive-500",
  Upcoming: "bg-neutral-300"
};
function Mt({ item: t }) {
  return /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsxs(
    "a",
    {
      href: `/Tasks?taskId=${t.taskId}`,
      className: p(
        "flex items-center gap-3 p-2.5 rounded-[10px]",
        "bg-surface-base border border-subtle",
        "hover:bg-surface-hover hover:border-default transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:shadow-focus",
        "mobile:flex-wrap"
      ),
      children: [
        /* @__PURE__ */ e.jsx("span", { className: p("w-1.5 h-1.5 rounded-full flex-none", de[t.state] ?? de.Upcoming), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[13.5px] font-medium text-text-primary truncate", children: t.title }),
        t.state === "Overdue" && t.overdueDays != null && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold px-2 py-0.5 rounded-full bg-negative-50 text-negative-700 flex-none", children: s("Dashboard:Deliveries:OverdueDays", "{0} gün gecikmiş", t.overdueDays) }),
        t.state === "InReview" && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-semibold px-2 py-0.5 rounded-full bg-warning-50 text-warning-700 flex-none", children: s("Dashboard:Deliveries:InReview", "kontrolde") }),
        t.projectName && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-secondary px-2 py-0.5 rounded-full bg-surface-sunken flex-none truncate max-w-[140px]", children: t.projectName }),
        /* @__PURE__ */ e.jsx("span", { className: p(
          "font-mono text-[11.5px] w-[50px] text-right flex-none tabular-nums",
          t.state === "Overdue" ? "text-negative-500" : "text-text-secondary"
        ), children: It(t.dueDate) }),
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
function It(t) {
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? "" : a.toLocaleDateString(void 0, { day: "numeric", month: "short" });
}
const ue = 4, xe = {
  Healthy: ["bg-positive-50 text-positive-700", "Dashboard:Health:Healthy", "Sağlıklı"],
  Attention: ["bg-warning-50 text-warning-700", "Dashboard:Health:Attention", "Dikkat"],
  Risky: ["bg-negative-50 text-negative-700", "Dashboard:Health:Risky", "Riskli"]
}, Ht = { Healthy: "positive", Attention: "warning", Risky: "negative" };
function Pt({ filter: t, editMode: a }) {
  const n = yt(t), r = n.data ?? [], o = r.slice(0, ue), c = r.slice(ue);
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: a,
      title: s("Dashboard:Health:Title", "Proje sağlığı"),
      subtitle: s("Dashboard:Health:Subtitle", "{0} aktif proje", r.length),
      isLoading: n.isLoading,
      isError: n.isError,
      onRetry: n.refetch,
      isEmpty: r.length === 0,
      isFetching: n.isFetching,
      isStale: n.isStale,
      dataUpdatedAt: n.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        N,
        {
          compact: !0,
          title: s("Dashboard:Health:EmptyTitle", "Henüz proje yok"),
          description: s("Dashboard:Health:EmptyDescription", "Proje oluşturunca sağlık göstergeleri burada belirir."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Projects", className: "text-[12.5px] font-medium text-text-link hover:underline", children: s("Dashboard:Health:OpenProjects", "Projeleri aç →") })
        }
      ),
      footer: c.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary truncate", children: c.map((l) => l.name).join(" · ") }),
        /* @__PURE__ */ e.jsx("a", { href: "/Projects", className: "text-xs text-text-link hover:underline flex-none", children: s("Dashboard:Health:More", "+{0} proje →", c.length) })
      ] }),
      children: /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col", children: o.map((l, i) => /* @__PURE__ */ e.jsxs("li", { className: "flex flex-col gap-[7px]", children: [
        i > 0 && /* @__PURE__ */ e.jsx("span", { className: "h-px bg-subtle my-2.5" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx(
            "a",
            {
              href: `/Projects/Detail/${l.projectId}`,
              className: "text-[13px] font-medium text-text-primary truncate hover:underline",
              children: l.name
            }
          ),
          /* @__PURE__ */ e.jsx(Bt, { state: l.state })
        ] }),
        /* @__PURE__ */ e.jsx(
          rt,
          {
            ratio: l.budgetRatio ?? l.timeRatio ?? 0,
            tone: Ht[l.state] ?? "positive",
            ariaLabel: s("Dashboard:Health:BarLabel", "{0} ilerleme", l.name)
          }
        ),
        /* @__PURE__ */ e.jsx(Kt, { project: l })
      ] }, l.projectId)) })
    }
  );
}
function Bt({ state: t }) {
  const [a, n, r] = xe[t] ?? xe.Healthy;
  return /* @__PURE__ */ e.jsx("span", { className: p("text-[11px] font-semibold px-2 py-0.5 rounded-full flex-none", a), children: s(n, r) });
}
function Kt({ project: t }) {
  const a = [];
  return t.daysRemaining != null && a.push(s("Dashboard:Health:DaysLeft", "{0} gün", t.daysRemaining)), t.budgetRatio != null && a.push(s("Dashboard:Health:BudgetPercent", "%{0} bütçe", Math.round(t.budgetRatio * 100))), a.push(s("Dashboard:Health:Tasks", "{0}/{1} görev", t.tasksDone, t.tasksTotal)), /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2.5 font-mono text-[11px] text-text-secondary tabular-nums", children: a.map((n, r) => /* @__PURE__ */ e.jsxs(fe.Fragment, { children: [
    r > 0 && /* @__PURE__ */ e.jsx("span", { className: "text-border-default", "aria-hidden": "true", children: "|" }),
    /* @__PURE__ */ e.jsx("span", { children: n })
  ] }, n)) });
}
function Ft({ editMode: t }) {
  var l;
  const a = vt(), n = a.data ?? [], r = n.reduce((i, d) => i + (d.amount ?? 0), 0), o = n.length ? Math.round(n.reduce((i, d) => i + d.ageHours, 0) / n.length) : 0, c = ((l = n[0]) == null ? void 0 : l.currency) ?? "TRY";
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: t,
      title: s("Dashboard:Approvals:Title", "Bende bekleyen kararlar"),
      badge: n.length > 0 && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full bg-warning-50 text-warning-700 tabular-nums flex-none", children: n.length }),
      isLoading: a.isLoading,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: n.length === 0,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        N,
        {
          compact: !0,
          title: s("Dashboard:Approvals:EmptyTitle", "Karar bekleyen yok"),
          description: s("Dashboard:Approvals:EmptyDescription", "Taslak durumdaki fatura bulunmuyor."),
          action: /* @__PURE__ */ e.jsx("a", { href: "/Invoices", className: "text-[12.5px] font-medium text-text-link hover:underline", children: s("Dashboard:Approvals:OpenInvoices", "Faturaları aç →") })
        }
      ),
      footer: n.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary truncate", children: s("Dashboard:Approvals:Total", "Toplam {0} · ort. bekleme {1} sa", se(r, c), o) }),
        /* @__PURE__ */ e.jsx("a", { href: "/Invoices", className: "text-[12.5px] font-medium text-text-link hover:underline flex-none", children: s("Dashboard:Approvals:Queue", "Onay kuyruğu →") })
      ] }),
      children: /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col", children: n.slice(0, 4).map((i, d) => /* @__PURE__ */ e.jsxs(
        "li",
        {
          className: "flex items-center gap-2.5 py-2 border-b border-subtle last:border-b-0",
          children: [
            /* @__PURE__ */ e.jsxs("span", { className: "flex-1 min-w-0 flex flex-col gap-0.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-medium text-text-primary truncate", children: i.title }),
              /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary truncate", children: s("Dashboard:Approvals:Meta", "Fatura · {0} · {1} sa", i.requesterName || "—", i.ageHours) })
            ] }),
            /* @__PURE__ */ e.jsx("span", { className: "font-mono text-xs font-semibold text-text-primary tabular-nums flex-none", children: se(i.amount, i.currency) }),
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
const me = {
  WaitingReview: ["bg-warning-50 text-warning-700", "Dashboard:Blockers:WaitingReview", "Kontrolde"],
  Dependency: ["bg-surface-sunken text-text-secondary", "Dashboard:Blockers:Dependency", "Bağımlı"],
  Unassigned: ["bg-negative-50 text-negative-700", "Dashboard:Blockers:Unassigned", "Atanmamış"]
};
function Ot({ editMode: t }) {
  const a = jt(), n = a.data ?? [];
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: t,
      accent: n.length > 0 ? "negative" : void 0,
      title: s("Dashboard:Blockers:Title", "Tıkanan işler & risk"),
      badge: n.length > 0 && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-semibold px-[7px] py-0.5 rounded-full bg-negative-50 text-negative-700 tabular-nums flex-none", children: n.length }),
      isLoading: a.isLoading,
      isError: a.isError,
      onRetry: a.refetch,
      isEmpty: n.length === 0,
      isFetching: a.isFetching,
      isStale: a.isStale,
      dataUpdatedAt: a.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        N,
        {
          compact: !0,
          title: s("Dashboard:Blockers:EmptyTitle", "Tıkanan iş yok"),
          description: s("Dashboard:Blockers:EmptyDescription", "Açık işlerin hepsi son günlerde hareket görmüş.")
        }
      ),
      children: /* @__PURE__ */ e.jsx("ul", { className: "flex flex-col gap-3", children: n.slice(0, 3).map((r, o) => /* @__PURE__ */ e.jsxs("li", { className: "flex flex-col gap-1", children: [
        o > 0 && /* @__PURE__ */ e.jsx("span", { className: "h-px bg-subtle mb-2" }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(Ut, { reason: r.blockReason }),
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
function Ut({ reason: t }) {
  const [a, n, r] = me[t] ?? me.Dependency;
  return /* @__PURE__ */ e.jsx("span", { className: p("text-[11px] font-semibold px-2 py-0.5 rounded-full flex-none", a), children: s(n, r) });
}
function Wt({ editMode: t }) {
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: t,
      title: s("Dashboard:Ai:Title", "AI önerileri"),
      subtitle: s("Dashboard:Ai:Subtitle", "sessiz inbox"),
      isEmpty: !0,
      emptyState: /* @__PURE__ */ e.jsx(
        N,
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
function Gt({ filter: t, editMode: a }) {
  const n = Dt(t), r = n.data, o = (r == null ? void 0 : r.points) ?? [], c = o.some((i) => i.income > 0 || i.expense > 0), l = (r == null ? void 0 : r.currency) ?? "TRY";
  return /* @__PURE__ */ e.jsxs(
    D,
    {
      editMode: a,
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
      isLoading: n.isLoading,
      isError: n.isError,
      onRetry: n.refetch,
      isEmpty: !c,
      isFetching: n.isFetching,
      isStale: n.isStale,
      dataUpdatedAt: n.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        N,
        {
          compact: !0,
          title: s("Dashboard:IncomeExpense:EmptyTitle", "Kayıtlı hareket yok"),
          description: s("Dashboard:IncomeExpense:EmptyDescription", "Son 6 ayda gelir veya gider kaydı bulunmuyor.")
        }
      ),
      bodyClassName: "flex flex-col gap-2.5",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-mono text-2xl font-semibold leading-none tracking-[-0.03em] text-text-primary tabular-nums", children: U((r == null ? void 0 : r.net) ?? 0, l) }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: s("Dashboard:IncomeExpense:Net", "net") })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-[82px] -mx-[18px] mt-auto", children: /* @__PURE__ */ e.jsx(
          Je,
          {
            groups: o.map((i) => ({ values: [i.income, i.expense] })),
            ariaLabel: s("Dashboard:IncomeExpense:ChartLabel", "Aylık gelir ve gider")
          }
        ) })
      ]
    }
  );
}
function _t({ filter: t, editMode: a }) {
  const n = Nt(t), r = n.data ?? [], o = r.some((l) => l.count > 0), c = r.reduce(
    (l, i) => i.count > ((l == null ? void 0 : l.count) ?? 0) ? i : l,
    null
  );
  return /* @__PURE__ */ e.jsxs(
    D,
    {
      editMode: a,
      title: s("Dashboard:Heatmap:Title", "Teslim yoğunluğu"),
      subtitle: s("Dashboard:Heatmap:Subtitle", "Önümüzdeki 4 hafta · hafta × gün"),
      isLoading: n.isLoading,
      isError: n.isError,
      onRetry: n.refetch,
      isEmpty: r.length === 0,
      isFetching: n.isFetching,
      isStale: n.isStale,
      dataUpdatedAt: n.dataUpdatedAt,
      emptyState: /* @__PURE__ */ e.jsx(
        N,
        {
          compact: !0,
          title: s("Dashboard:Heatmap:EmptyTitle", "Planlı teslim yok"),
          description: s("Dashboard:Heatmap:EmptyDescription", "Önümüzdeki 4 haftada son tarihi olan iş bulunmuyor.")
        }
      ),
      bodyClassName: "flex flex-col gap-3",
      children: [
        /* @__PURE__ */ e.jsx(nt, { cells: r }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: o && c ? s(
          "Dashboard:Heatmap:Busiest",
          "En yoğun gün {0} ({1} teslim) · sarı: hibe son tarihi",
          new Date(c.date).toLocaleDateString(void 0, { day: "numeric", month: "short" }),
          c.count
        ) : s("Dashboard:Heatmap:NoneScheduled", "Bu pencerede teslim planlanmamış · sarı: hibe son tarihi") })
      ]
    }
  );
}
function qt({ editMode: t }) {
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: t,
      title: s("Dashboard:Phases:Title", "Proje fazları"),
      subtitle: s("Dashboard:Phases:Subtitle", "mini gantt"),
      isEmpty: !0,
      emptyState: /* @__PURE__ */ e.jsx(
        N,
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
const $t = [
  ["Work", "Dashboard:StatTab:Work", "İş & teslim"],
  ["Finance", "Dashboard:StatTab:Finance", "Finans"],
  ["Grants", "Dashboard:StatTab:Grants", "Hibe"],
  ["Communication", "Dashboard:StatTab:Communication", "İletişim"],
  ["System", "Dashboard:StatTab:System", "Sistem"]
];
function zt({ filter: t, editMode: a }) {
  const n = kt(t), r = n.data ?? [], [o, c] = x.useState("Work"), l = x.useMemo(
    () => $t.filter(([u]) => r.some((f) => f.group === u)),
    [r]
  ), i = r.filter((u) => u.group === o), d = r.filter((u) => u.locked).length;
  return /* @__PURE__ */ e.jsx(
    D,
    {
      editMode: a,
      title: s("Dashboard:Statistics:Title", "İstatistikler"),
      subtitle: r.length > 0 ? s(
        "Dashboard:Statistics:Subtitle",
        "{0} istatistikten {1}'i yetkinde · {2}'si kilitli",
        r.length,
        r.length - d,
        d
      ) : void 0,
      actions: /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1.5 flex-wrap justify-end", children: l.map(([u, f, g]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => c(u),
          "aria-pressed": o === u,
          className: p(
            "inline-flex items-center h-7 px-[11px] rounded-[9px] text-[11.5px] transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:shadow-focus",
            o === u ? "bg-text-primary text-surface-base font-semibold" : "bg-surface-sunken text-text-secondary font-medium hover:text-text-primary"
          ),
          children: s(f, g)
        },
        u
      )) }),
      isLoading: n.isLoading,
      isError: n.isError,
      onRetry: n.refetch,
      isEmpty: r.length === 0,
      isFetching: n.isFetching,
      isStale: n.isStale,
      dataUpdatedAt: n.dataUpdatedAt,
      children: /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-6 gap-3 lt-1080:grid-cols-3 mobile:grid-cols-2", children: i.map((u) => /* @__PURE__ */ e.jsx(Vt, { stat: u }, u.key)) })
    }
  );
}
function Vt({ stat: t }) {
  return t.locked ? /* @__PURE__ */ e.jsxs("div", { className: "p-[12px_14px] border border-dashed border-default rounded-xl bg-surface-base flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary truncate", children: t.label }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-xl font-semibold leading-none tracking-[-0.03em] text-text-tertiary", children: "— —" }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] text-text-tertiary", children: s("Dashboard:Stat:Locked", "yetki gerekli") }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary truncate", children: t.requiredPermission })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "p-[12px_14px] border border-subtle rounded-xl bg-surface-base flex flex-col gap-1.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary truncate", children: t.label }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-xl font-semibold leading-none tracking-[-0.03em] text-text-primary tabular-nums", children: t.formatted || "—" }),
    t.deltaFormatted ? /* @__PURE__ */ e.jsx(ze, { trend: t.trend, children: t.deltaFormatted }) : /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: s("Dashboard:Stat:Flat", "• sabit") }),
    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[9px] text-text-tertiary truncate", children: t.requiredPermission })
  ] });
}
const O = [
  { key: "project-management", labelKey: "Dashboard:View:ProjectManagement", fallback: "Proje Yönetimi" },
  { key: "finance", labelKey: "Dashboard:View:Finance", fallback: "Finans" },
  { key: "today", labelKey: "Dashboard:View:Today", fallback: "Bugün" },
  { key: "grants", labelKey: "Dashboard:View:Grants", fallback: "Hibe takibi" }
], he = "project-management", _ = {
  "summary-strip": { component: wt, titleKey: "Dashboard:Card:SummaryStrip", fallback: "Sayısal özet", w: 12, h: 3, minW: 6, minH: 3 },
  deliveries: { component: Rt, titleKey: "Dashboard:Deliveries:Title", fallback: "Bu ay teslim edilecekler", w: 7, h: 8, minW: 4, minH: 5 },
  "project-health": { component: Pt, titleKey: "Dashboard:Health:Title", fallback: "Proje sağlığı", w: 5, h: 8, minW: 3, minH: 5 },
  approvals: { component: Ft, titleKey: "Dashboard:Approvals:Title", fallback: "Bende bekleyen kararlar", w: 4, h: 6, minW: 3, minH: 4 },
  blockers: { component: Ot, titleKey: "Dashboard:Blockers:Title", fallback: "Tıkanan işler & risk", w: 4, h: 6, minW: 3, minH: 4 },
  "ai-suggestions": { component: Wt, titleKey: "Dashboard:Ai:Title", fallback: "AI önerileri", w: 4, h: 6, minW: 3, minH: 3 },
  "income-expense": { component: Gt, titleKey: "Dashboard:IncomeExpense:Title", fallback: "Gelir / gider", w: 4, h: 6, minW: 3, minH: 4 },
  "delivery-heatmap": { component: _t, titleKey: "Dashboard:Heatmap:Title", fallback: "Teslim yoğunluğu", w: 4, h: 6, minW: 3, minH: 4 },
  "project-phases": { component: qt, titleKey: "Dashboard:Phases:Title", fallback: "Proje fazları", w: 4, h: 6, minW: 3, minH: 4 },
  "statistics-band": { component: zt, titleKey: "Dashboard:Statistics:Title", fallback: "İstatistikler", w: 12, h: 6, minW: 6, minH: 4 }
}, Qt = { desktop: 1200, tablet: 768, mobile: 0 }, Yt = { desktop: 12, tablet: 8, mobile: 1 }, Xt = 64, Zt = [12, 12], De = "apya-dashboard-view";
function Jt() {
  try {
    const t = window.localStorage.getItem(De);
    return O.some((a) => a.key === t) ? t : he;
  } catch {
    return he;
  }
}
function ea(t) {
  try {
    window.localStorage.setItem(De, t);
  } catch {
  }
}
function ta({ open: t, onOpenChange: a, presentCardKeys: n = [], onAdd: r }) {
  const [o, c] = x.useState(""), l = x.useMemo(() => {
    const i = o.trim().toLocaleLowerCase();
    return Object.entries(_).map(([d, u]) => ({ key: d, meta: u, label: s(u.titleKey, u.fallback) })).filter((d) => !i || d.label.toLocaleLowerCase().includes(i));
  }, [o]);
  return /* @__PURE__ */ e.jsx(Ee, { open: t, onOpenChange: a, children: /* @__PURE__ */ e.jsx(Ce, { side: "right", className: "w-[380px] mobile:w-full", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 p-5 h-full", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-base font-semibold text-text-primary", children: s("Dashboard:Catalog:Title", "Kart ekle") }),
      /* @__PURE__ */ e.jsx("p", { className: "text-[12.5px] text-text-tertiary", children: s("Dashboard:Catalog:Subtitle", "Eklediğin kart görünümün altına yerleşir; sürükleyip boyutlandırabilirsin.") })
    ] }),
    /* @__PURE__ */ e.jsx(
      Ae,
      {
        value: o,
        onChange: (i) => c(i.target.value),
        placeholder: s("Dashboard:Catalog:Search", "Kart ara…"),
        "aria-label": s("Dashboard:Catalog:Search", "Kart ara…")
      }
    ),
    /* @__PURE__ */ e.jsxs("ul", { className: "flex flex-col gap-2 overflow-auto flex-1", children: [
      l.map(({ key: i, meta: d, label: u }) => {
        const f = n.includes(i);
        return /* @__PURE__ */ e.jsxs(
          "li",
          {
            className: p(
              "flex items-center justify-between gap-3 p-3 rounded-xl border",
              f ? "border-subtle bg-surface-sunken opacity-60" : "border-default bg-surface-base"
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
                R,
                {
                  size: "sm",
                  variant: f ? "ghost" : "secondary",
                  disabled: f,
                  onClick: () => r(i),
                  className: "flex-none",
                  children: f ? s("Dashboard:Catalog:Added", "Ekli") : s("Dashboard:Catalog:Add", "Ekle")
                }
              )
            ]
          },
          i
        );
      }),
      l.length === 0 && /* @__PURE__ */ e.jsx("li", { className: "text-[12.5px] text-text-tertiary py-4 text-center", children: s("Dashboard:Catalog:NoMatch", "Eşleşen kart yok.") })
    ] })
  ] }) }) });
}
function aa(t) {
  return w({
    queryKey: k.dashboard.layout(t),
    queryFn: () => $.get(`/api/dashboard/layout?viewKey=${encodeURIComponent(t)}`),
    /* Düzen kullanıcıdan başkası değiştiremez → uzun taze kalır. */
    staleTime: 5 * 6e4,
    enabled: !!t
  });
}
function na() {
  const t = q();
  return ge({
    mutationFn: ({ viewKey: a, cards: n }) => $.put("/api/dashboard/layout", { viewKey: a, cards: n }),
    onSuccess: (a, { viewKey: n }) => {
      t.invalidateQueries({ queryKey: k.dashboard.layout(n) });
    }
  });
}
function sa() {
  const t = q();
  return ge({
    mutationFn: (a) => $.delete(`/api/dashboard/layout?viewKey=${encodeURIComponent(a)}`),
    onSuccess: (a, n) => {
      t.invalidateQueries({ queryKey: k.dashboard.layout(n) });
    }
  });
}
const ra = re.WidthProvider(re.Responsive), Ne = [
  ["Month", "Dashboard:Range:Month", "Bu ay"],
  ["Week", "Dashboard:Range:Week", "Bu hafta"],
  ["Quarter", "Dashboard:Range:Quarter", "Bu çeyrek"]
];
function ia() {
  var ae, ne;
  const [t, a] = x.useState(() => Jt()), [n, r] = x.useState(() => xa()), [o, c] = x.useState(!1), [l, i] = x.useState(!1), [d, u] = x.useState(null), f = aa(t), g = na(), j = sa(), E = x.useMemo(() => ({ range: n }), [n]), y = d ?? ((ae = f.data) == null ? void 0 : ae.cards) ?? [], [V, Q] = x.useState(0);
  x.useEffect(() => {
    const m = requestAnimationFrame(() => Q(1));
    return () => cancelAnimationFrame(m);
  }, []);
  const M = x.useMemo(() => {
    const m = y.map(ua);
    return {
      desktop: m,
      /* Tablet: 8 kolon — genişlikler kırpılır, sıra korunur. */
      tablet: m.map((b) => ({ ...b, w: Math.min(b.w, 8) })),
      /* Mobil tek kolon: tasarım sırası y'ye göre. */
      mobile: m.slice().sort((b, v) => b.y - v.y || b.x - v.x).map((b, v) => ({ ...b, x: 0, y: v, w: 1 }))
    };
  }, [y]), Y = x.useCallback((m) => {
    a(m), ea(m), u(null), c(!1);
  }, []), X = x.useCallback((m) => {
    o && u((b) => {
      const v = b ?? y;
      return m.map((S) => {
        const H = v.find((B) => B.cardKey === S.i);
        return {
          cardKey: S.i,
          /* Enum SAYI olarak gidip gelir; string göndermek
             deserialization hatası verir (JsonStringEnumConverter yok). */
          chartType: (H == null ? void 0 : H.chartType) ?? oe,
          x: S.x,
          y: S.y,
          w: S.w,
          h: S.h
        };
      });
    });
  }, [o, y]), Z = x.useCallback(() => {
    g.mutate(
      { viewKey: t, cards: d ?? y },
      { onSuccess: () => {
        u(null), c(!1);
      } }
    );
  }, [g, t, d, y]), J = x.useCallback(() => {
    j.mutate(t, {
      onSuccess: () => {
        u(null), c(!1);
      }
    });
  }, [j, t]), I = x.useCallback((m) => {
    const b = _[m];
    if (!b) return;
    const v = d ?? y, S = v.reduce((H, B) => Math.max(H, B.y + B.h), 0);
    u([
      ...v,
      { cardKey: m, chartType: oe, x: 0, y: S, w: b.w, h: b.h }
    ]), i(!1), c(!0);
  }, [d, y]), we = x.useCallback((m) => {
    u((d ?? y).filter((v) => v.cardKey !== m));
  }, [d, y]);
  return /* @__PURE__ */ e.jsxs("div", { className: "min-h-screen bg-surface-app-bg", children: [
    /* @__PURE__ */ e.jsx(
      oa,
      {
        viewKey: t,
        onViewChange: Y,
        range: n,
        onRangeChange: r,
        editMode: o,
        onToggleEdit: () => c((m) => !m),
        onOpenCatalog: () => i(!0)
      }
    ),
    o && /* @__PURE__ */ e.jsx(
      ca,
      {
        onSave: Z,
        isSaving: g.isPending
      }
    ),
    /* @__PURE__ */ e.jsxs("main", { className: "px-6 pt-5 pb-6 mobile:px-3", children: [
      /* @__PURE__ */ e.jsx(
        ra,
        {
          className: p("apya-dashboard-grid", o && "apya-dashboard-grid--edit"),
          layouts: M,
          breakpoints: Qt,
          cols: Yt,
          rowHeight: Xt,
          margin: Zt,
          isDraggable: o,
          isResizable: o,
          draggableHandle: `.${D.DRAG_HANDLE_CLASS}`,
          onLayoutChange: X,
          compactType: "vertical",
          preventCollision: !1,
          children: y.map((m) => {
            const b = _[m.cardKey];
            if (!b) return /* @__PURE__ */ e.jsx("div", {}, m.cardKey);
            const v = b.component;
            return /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ e.jsx(v, { filter: E, editMode: o }),
              o && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => we(m.cardKey),
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
            ] }, m.cardKey);
          })
        },
        V
      ),
      /* @__PURE__ */ e.jsx(
        da,
        {
          isDefault: ((ne = f.data) == null ? void 0 : ne.isDefault) !== !1,
          onReset: J,
          onOpenCatalog: () => i(!0),
          isResetting: j.isPending
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      ta,
      {
        open: l,
        onOpenChange: i,
        presentCardKeys: y.map((m) => m.cardKey),
        onAdd: I
      }
    )
  ] });
}
function oa({ viewKey: t, onViewChange: a, range: n, onRangeChange: r, editMode: o, onToggleEdit: c, onOpenCatalog: l }) {
  const i = O.find((d) => d.key === t) ?? O[0];
  return /* @__PURE__ */ e.jsxs("header", { className: "px-6 pt-[18px] pb-4 bg-surface-base border-b border-default flex items-end justify-between gap-5 mobile:px-3 mobile:flex-col mobile:items-stretch mobile:gap-3", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ e.jsx("h1", { className: "text-[22px] font-semibold tracking-[-0.025em] text-text-primary m-0", children: s("Dashboard:Title", "Genel Bakış") }),
        /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center h-[22px] px-[9px] rounded-full bg-accent-soft text-accent-600 text-[11.5px] font-semibold flex-none", children: s(i.labelKey, i.fallback) })
      ] }),
      /* @__PURE__ */ e.jsx("nav", { className: "flex items-center gap-1 flex-wrap", "aria-label": s("Dashboard:Views", "Görünümler"), children: O.map((d) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => a(d.key),
          "aria-current": d.key === t ? "page" : void 0,
          className: p(
            "inline-flex items-center h-[30px] px-3 rounded-[9px] text-[12.5px] transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:shadow-focus",
            d.key === t ? "bg-text-primary text-surface-base font-semibold" : "text-text-secondary font-medium hover:bg-surface-sunken hover:text-text-primary"
          ),
          children: s(d.labelKey, d.fallback)
        },
        d.key
      )) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-none mobile:flex-wrap", children: [
      /* @__PURE__ */ e.jsx(la, { value: n, onChange: r }),
      /* @__PURE__ */ e.jsx(R, { size: "sm", variant: "secondary", onClick: l, children: s("Dashboard:AddCard", "+ Kart ekle") }),
      /* @__PURE__ */ e.jsx(R, { size: "sm", variant: "primary", onClick: c, children: o ? s("Common:Done", "Bitir") : s("Common:Edit", "Düzenle") })
    ] })
  ] });
}
function la({ value: t, onChange: a }) {
  return /* @__PURE__ */ e.jsxs("label", { className: "inline-flex items-center", children: [
    /* @__PURE__ */ e.jsx("span", { className: "sr-only", children: s("Dashboard:SelectRange", "Zaman aralığı seç") }),
    /* @__PURE__ */ e.jsx(
      "select",
      {
        value: t,
        onChange: (n) => {
          a(n.target.value), ma(n.target.value);
        },
        className: p(
          "h-8 px-3 rounded-[9px] text-[12.5px] font-medium",
          "bg-surface-sunken text-text-secondary border-0",
          "focus-visible:outline-none focus-visible:shadow-focus"
        ),
        children: Ne.map(([n, r, o]) => /* @__PURE__ */ e.jsx("option", { value: n, children: s(r, o) }, n))
      }
    )
  ] });
}
function ca({ onSave: t, isSaving: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-6 py-2.5 bg-accent-soft border-b border-default mobile:px-3 mobile:flex-wrap", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center h-[26px] px-2.5 rounded-lg bg-accent text-white text-[11.5px] font-semibold", children: s("Dashboard:EditMode", "Düzenleme modu") }),
      /* @__PURE__ */ e.jsx("span", { className: "inline-flex items-center h-[26px] px-2.5 rounded-lg bg-surface-base border border-default text-accent-600 text-[11.5px]", children: s("Dashboard:EditMode:Snap", "Yapış: 12 kolon · 64px satır") })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] text-accent-600 mobile:hidden", children: s("Dashboard:EditMode:Hint", "Kartı başlıktaki ⠿ tutamağından sürükle") }),
      /* @__PURE__ */ e.jsx(R, { size: "sm", variant: "primary", onClick: t, disabled: a, children: s("Dashboard:EditMode:Save", "Düzeni kaydet") })
    ] })
  ] });
}
function da({ isDefault: t, onReset: a, onOpenCatalog: n, isResetting: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 mt-3.5 px-4 py-3 rounded-card border border-dashed border-default bg-surface-base mobile:flex-col mobile:items-stretch", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-secondary", children: t ? s("Dashboard:Footer:DefaultLayout", "Bu görünüm rol varsayılanından geldi — kart ekleyip çıkarabilir, sürükleyip boyutlandırabilirsin.") : s("Dashboard:Footer:CustomLayout", "Bu görünümü sen düzenledin. Dilediğin an varsayılana dönebilirsin.") }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      !t && /* @__PURE__ */ e.jsx(R, { size: "sm", variant: "secondary", onClick: a, disabled: r, children: s("Dashboard:Footer:Reset", "Varsayılana dön") }),
      /* @__PURE__ */ e.jsx(R, { size: "sm", variant: "primary", onClick: n, children: s("Dashboard:AddCard", "+ Kart ekle") })
    ] })
  ] });
}
function ua(t) {
  const a = _[t.cardKey];
  return {
    i: t.cardKey,
    x: t.x,
    y: t.y,
    w: t.w,
    h: t.h,
    minW: (a == null ? void 0 : a.minW) ?? 2,
    minH: (a == null ? void 0 : a.minH) ?? 2
  };
}
function xa() {
  try {
    const t = new URLSearchParams(window.location.search).get("range");
    return Ne.some(([a]) => a === t) ? t : "Month";
  } catch {
    return "Month";
  }
}
function ma(t) {
  try {
    const a = new URLSearchParams(window.location.search);
    a.set("range", t), window.history.replaceState(null, "", `${window.location.pathname}?${a}`);
  } catch {
  }
}
function ha(t) {
  const { connection: a, state: n } = ve(), r = q();
  x.useEffect(() => {
    if (!a || !(t != null && t.length)) return;
    const o = t.map(([c, l]) => {
      const i = () => {
        l.forEach((d) => {
          r.invalidateQueries({ queryKey: d });
        });
      };
      return a.on(c, i), [c, i];
    });
    return () => {
      o.forEach(([c, l]) => {
        a.off(c, l);
      });
    };
  }, [a, n, r]);
}
function pa(t) {
  const { connection: a, state: n } = ve(), r = q(), o = He();
  x.useEffect(() => {
    if (!a || !(t != null && t.length)) return;
    const c = t.map(([l, i]) => {
      const d = (u) => {
        var f;
        (f = i.queryKeys) == null || f.forEach(
          (g) => r.invalidateQueries({ queryKey: g })
        ), o.warning(i.message ?? "Bu kayıtta çakışma oldu", {
          description: i.description ?? (u == null ? void 0 : u.message),
          action: {
            label: "Yenile",
            onClick: () => {
              var g;
              (g = i.queryKeys) == null || g.forEach(
                (j) => r.invalidateQueries({ queryKey: j })
              );
            }
          }
        });
      };
      return a.on(l, d), [l, d];
    });
    return () => {
      c.forEach(([l, i]) => a.off(l, i));
    };
  }, [a, n, r]);
}
const h = (t) => ["dashboard", t];
function fa() {
  const t = x.useMemo(() => [
    /* Görev durumu değişti → teslimler, tıkananlar, özet, ısı takvimi, istatistik */
    ["TaskStatusChanged", [
      h("summary"),
      h("deliveries"),
      h("blocked-tasks"),
      h("delivery-heatmap"),
      h("statistics"),
      h("project-health")
    ]],
    /* Atama değişti → tıkanma sebebi "atanmamış" olabilir */
    ["TaskAssigned", [h("blocked-tasks"), h("deliveries")]],
    /* Onay kuyruğu (taslak fatura) hareketi */
    ["ApprovalCreated", [h("pending-approvals"), h("summary"), h("statistics")]],
    ["ApprovalResolved", [h("pending-approvals"), h("summary"), h("statistics")]],
    /* Bütçe / muhasebe hareketi → bütçe oranları ve finans istatistikleri */
    ["BudgetUpdated", [h("summary"), h("project-health"), h("statistics")]],
    ["JournalEntryPosted", [h("income-expense"), h("statistics")]],
    /* Hibe belgesi son tarihi → ısı takviminin sarı günleri */
    ["GrantDocumentDue", [h("delivery-heatmap"), h("statistics")]]
  ], []), a = x.useMemo(() => [
    ["BudgetConflict", {
      queryKeys: [h("summary"), h("project-health")],
      message: "Bütçe kaydında çakışma",
      description: "Aynı bütçeyi başka bir kullanıcı güncelledi."
    }]
  ], []);
  return ha(t), pa(a), null;
}
Pe();
const pe = document.getElementById("apya-dashboard-root");
pe && Se(pe).render(
  /* @__PURE__ */ e.jsx(Re, { children: /* @__PURE__ */ e.jsx(Ue, { children: /* @__PURE__ */ e.jsx(Le, { children: /* @__PURE__ */ e.jsx(Be, { children: /* @__PURE__ */ e.jsxs(Ke, { children: [
    /* @__PURE__ */ e.jsx(fa, {}),
    /* @__PURE__ */ e.jsx(ia, {})
  ] }) }) }) }) })
);
