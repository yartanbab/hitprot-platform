import { j as e, b as ye, r as g } from "./react-vendor-D7YDiBbi.js";
import { E as re, R as mt, t as Ft, w as Mt, m as Lt } from "./index-DgpuJ91w.js";
import { c as k, B as z, b as ue, d as xe, S as ce, D as pt, h as bt, T as Bt } from "./Dialog-BdrRxZcw.js";
import { D as qt } from "./useDeviceMode-Bkxjujsr.js";
import { a as _t } from "./QueryProvider-D2Hvqdr9.js";
import { a as K } from "./httpClient-BNoyY5yK.js";
import { d as Gt } from "./draggableActivation-Ybw9Upbh.js";
import { u as W, b as L, a as U } from "./query-vendor-Db2mwxYI.js";
import { e as Yt, m as nt, u as Ut } from "./dataChanged-CDwwWMH8.js";
import { i as Qt, s as Ht } from "./permanentRejection-SvaBclz0.js";
const O = {
  1: { key: "task", label: "Görev", plural: "görev", icon: "fa-circle-check", railLabel: "Görevler" },
  2: { key: "invoice", label: "Fatura", plural: "fatura", icon: "fa-file-invoice", railLabel: "Faturalar" },
  3: { key: "grant", label: "Hibe", plural: "hibe", icon: "fa-award", railLabel: "Hibe son tarihleri" },
  4: { key: "expense", label: "Gider", plural: "gider", icon: "fa-arrow-trend-down", railLabel: "Gider / gelir" },
  5: { key: "income", label: "Gelir", plural: "gelir", icon: "fa-arrow-trend-up", railLabel: "Gider / gelir" },
  6: { key: "cash", label: "Kasa hareketi", plural: "kasa hareketi", icon: "fa-wallet", railLabel: "Nakit hareketleri" },
  7: { key: "external", label: "Dış etkinlik", plural: "dış etkinlik", icon: "fa-calendar-days", railLabel: "Dış etkinlikler" }
}, de = [1, 2, 3, 4, 5, 6, 7], Wt = [
  { key: "task", sources: [1] },
  { key: "invoice", sources: [2] },
  { key: "grant", sources: [3] },
  { key: "money", sources: [4, 5] },
  { key: "cash", sources: [6] }
], Pe = [1, 2, 3, 4, 5, 6], I = { DUE_TODAY: 1, OVERDUE: 2 }, Vt = (t) => t.risk === I.OVERDUE || t.risk === I.DUE_TODAY, ft = 864e5, Ie = (t) => new Date(t.getFullYear(), t.getMonth(), t.getDate()), M = (t, a) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + a);
function E(t) {
  const a = (s) => (s < 10 ? "0" : "") + s;
  return `${t.getFullYear()}-${a(t.getMonth() + 1)}-${a(t.getDate())}`;
}
function Me(t) {
  const a = (t.getDay() + 6) % 7;
  return new Date(t.getTime() - a * ft);
}
const ht = (t) => Me(new Date(t.getFullYear(), t.getMonth(), 1)), Le = 42;
function gt(t) {
  const a = ht(t);
  return Array.from({ length: Le }, (s, r) => new Date(a.getTime() + r * ft));
}
const Xt = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }), Jt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }), Zt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }), C = {
  monthTitle: (t) => Xt.format(t),
  dayTitle: (t) => Jt.format(t),
  dayShort: (t) => Zt.format(t),
  /** Tam tutar — panel ve ajanda satırlarında. */
  money: (t, a = "TRY") => {
    try {
      return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: a || "TRY",
        maximumFractionDigits: 0
      }).format(t ?? 0);
    } catch {
      return `${t ?? 0} ${a || "TRY"}`;
    }
  },
  /** Kısa tutar — dar ay hücresinde ("₺163,4B"). */
  moneyCompact: (t, a = "TRY") => {
    try {
      return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: a || "TRY",
        notation: "compact",
        maximumFractionDigits: 1
      }).format(t ?? 0);
    } catch {
      return `${t ?? 0} ${a || "TRY"}`;
    }
  },
  hours: (t) => `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 }).format(t)} sa`
};
function yt(t) {
  const a = {};
  for (const s of t ?? []) {
    const r = (s.date || "").slice(0, 10);
    r && (a[r] ?? (a[r] = [])).push(s);
  }
  return a;
}
const Se = (t) => (t ?? []).reduce((a, s) => a + (s.loadHours ?? 0), 0);
function ea(t, { maxPills: a = 3, maxRiskPills: s = 2 } = {}) {
  const r = t ?? [];
  if (r.length === 0) return { pills: [], summaries: [] };
  if (r.length <= a) return { pills: r, summaries: [] };
  const c = r.filter(Vt).slice(0, s), p = new Set(c.map((i) => i.key)), d = /* @__PURE__ */ new Map();
  for (const i of r) {
    if (p.has(i.key)) continue;
    const m = d.get(i.source) ?? { source: i.source, count: 0, amount: 0, hasAmount: !1, only: null };
    m.count += 1, m.only = m.count === 1 ? i : null, i.amount != null && (m.amount += i.amount, m.hasAmount = !0), d.set(i.source, m);
  }
  const o = [];
  for (const i of de) {
    const m = d.get(i);
    m && (m.count === 1 && m.only ? c.push(m.only) : o.push(m));
  }
  return { pills: c, summaries: o };
}
function ta(t, { compact: a = !0 } = {}) {
  const s = O[t.source], r = `${t.count} ${s ? s.plural : "öğe"}`;
  if (!t.hasAmount) return r;
  const l = a ? C.moneyCompact(t.amount) : C.money(t.amount);
  return `${r} · ${l}`;
}
function kt(t, a) {
  const s = E(a), r = (t ?? []).filter((o) => !o.isDone), l = r.filter((o) => o.date.slice(0, 10) < s && o.risk === I.OVERDUE), c = r.filter((o) => o.date.slice(0, 10) >= s), p = yt(c), d = Object.keys(p).sort().map((o) => ({
    key: o,
    date: /* @__PURE__ */ new Date(`${o}T00:00:00`),
    isToday: o === s,
    items: p[o]
  }));
  return { overdue: l, days: d };
}
function aa(t) {
  const a = Me(Ie(t));
  return Array.from({ length: 7 }, (s, r) => M(a, r));
}
const sa = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }), ze = (t) => t ? sa.format(new Date(t)) : "";
function je(t) {
  const a = new Date(t);
  return a.getHours() * 60 + a.getMinutes();
}
function ra(t) {
  let a = 8, s = 18;
  for (const r of t ?? [])
    r.startTime && (a = Math.min(a, Math.floor(je(r.startTime) / 60)), s = Math.max(s, Math.ceil(je(r.endTime ?? r.startTime) / 60)));
  return { start: Math.max(0, a), end: Math.min(24, Math.max(s, a + 4)) };
}
const it = (t) => !!t.startTime, lt = (t) => t.getDay() === 0 || t.getDay() === 6;
function na(t, { today: a, capacity: s = null, horizonDays: r = 21, fallbackPerDay: l = 3 } = {}) {
  const c = E(a), p = (t ?? []).filter((h) => !h.isDone), d = p.filter((h) => h.date.slice(0, 10) < c && h.risk === I.OVERDUE), o = d.filter((h) => h.canReschedule), i = d.filter((h) => !h.canReschedule), m = {}, f = {};
  for (const h of p) {
    const n = h.date.slice(0, 10);
    n < c || (m[n] = (m[n] ?? 0) + (h.loadHours ?? 0), f[n] = (f[n] ?? 0) + 1);
  }
  const b = [];
  let u = 0;
  for (const h of o) {
    let n = null;
    for (; u < r; ) {
      const x = M(a, u);
      if (lt(x)) {
        u += 1;
        continue;
      }
      const v = E(x), D = m[v] ?? 0, $ = f[v] ?? 0, j = h.loadHours ?? 0, w = s && j > s;
      if (s && !w ? D + j <= s : $ < l) {
        m[v] = D + j, f[v] = $ + 1, n = x;
        break;
      }
      u += 1;
    }
    if (!n) {
      let x = M(a, r);
      for (; lt(x); ) x = M(x, 1);
      n = x;
    }
    b.push({ item: h, date: n });
  }
  return { suggestions: b, fixed: i };
}
const ia = {
  [I.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [I.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function Oe({ item: t, onSelect: a, showDate: s = !1 }) {
  const r = O[t.source], l = ia[t.risk];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => a(t),
      className: k(
        "flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left transition-colors duration-fast",
        "hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      ),
      children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-neutral-subtle text-[10px] text-text-tertiary",
            "aria-hidden": "true",
            children: r && /* @__PURE__ */ e.jsx("i", { className: k("fa", r.icon) })
          }
        ),
        /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("span", { className: k("block truncate text-[13px] font-semibold text-text-primary", t.isDone && "line-through opacity-65"), children: t.title }),
          /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block truncate text-[11.5px] text-text-tertiary", children: [
            s ? C.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
            t.subtitle,
            t.assigneeName,
            t.amount != null ? C.money(t.amount, t.currency) : null
          ].filter(Boolean).join(" · ") || (r ? r.label : "") })
        ] }),
        l && /* @__PURE__ */ e.jsx("span", { className: k("shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold", l.className), children: l.label })
      ]
    }
  );
}
function la({ items: t, today: a, onSelectItem: s, onSmartDefer: r }) {
  const { overdue: l, days: c } = kt(t, a);
  return l.length === 0 && c.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
    re,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-mug-hot" }),
      title: "Planlanmış bir şey yok",
      description: "Son tarihli görevler, fatura vadeleri ve tarihli finans kayıtları burada öncelik sırasıyla listelenir."
    }
  ) }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    l.length > 0 && /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-negative-100 bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 border-b border-negative-100 px-3 py-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-negative-700", children: "Gecikmiş" }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-semibold tabular-nums text-negative-700", children: l.length }),
        r && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: r,
            className: "ms-auto rounded-md px-2 py-0.5 text-[11.5px] font-semibold text-text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            children: "Akıllı ertele"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: l.map((p) => /* @__PURE__ */ e.jsx(Oe, { item: p, onSelect: s, showDate: !0 }, p.key)) })
    ] }),
    c.map((p) => /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: k(
        "flex items-center justify-between border-b border-subtle px-3 py-2",
        p.isToday && "border-b-accent"
      ), children: [
        /* @__PURE__ */ e.jsxs("span", { className: k(
          "text-[11px] font-bold uppercase tracking-wider",
          p.isToday ? "text-accent" : "text-text-tertiary"
        ), children: [
          C.dayTitle(p.date),
          p.isToday ? " · Bugün" : ""
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: p.items.length })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: p.items.map((d) => /* @__PURE__ */ e.jsx(Oe, { item: d, onSelect: s }, d.key)) })
    ] }, p.key))
  ] });
}
function oa({ dayKey: t, items: a, capacity: s, onSelectItem: r, onClose: l }) {
  const c = /* @__PURE__ */ new Date(`${t}T00:00:00`), p = Se(a), d = s && p > s, o = a.reduce((i, m) => (i[m.source] = (i[m.source] ?? 0) + 1, i), {});
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: C.dayTitle(c) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(o).length === 0 ? "Planlanmış öğe yok" : Object.entries(o).map(([i, m]) => {
          var f;
          return `${m} ${((f = O[i]) == null ? void 0 : f.plural) ?? "öğe"}`;
        }).join(" · ") })
      ] }),
      l && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: l,
          "aria-label": "Günü kapat",
          className: "shrink-0 rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] }),
    s && p > 0 && /* @__PURE__ */ e.jsxs("div", { className: k(
      "flex items-center justify-between border-b px-3 py-2 text-[11.5px]",
      d ? "border-negative-100 bg-negative-50 text-negative-700" : "border-subtle text-text-secondary"
    ), children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-semibold", children: d ? "Kapasite aşımı" : "Gün yükü" }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono tabular-nums", children: [
        C.hours(p),
        " / ",
        C.hours(s)
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "flex-1 overflow-y-auto p-1", children: a.length === 0 ? /* @__PURE__ */ e.jsx(
      re,
      {
        compact: !0,
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-day" }),
        title: "Bu gün boş",
        description: "Bu güne düşen bir öğe yok."
      }
    ) : a.map((i) => /* @__PURE__ */ e.jsx(Oe, { item: i, onSelect: r }, i.key)) })
  ] });
}
const ca = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], da = {
  [I.OVERDUE]: {
    /* Maketteki sol kenar çubuğu: pill'i okumadan da "bu gecikmiş" denir. */
    pill: "border-l-2 border-negative bg-negative-50 text-negative-700",
    /* çapraz tarama */
    pattern: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,.07) 3px, rgba(0,0,0,.07) 5px)"
  },
  [I.DUE_TODAY]: {
    pill: "border-l-2 border-warning bg-warning-50 text-warning-700",
    /* dikey çizgi */
    pattern: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,.06) 4px, rgba(0,0,0,.06) 5px)"
  }
};
function ua({ item: t, onSelect: a, onDragStart: s, isPending: r, hasError: l }) {
  const c = O[t.source], p = da[t.risk], d = t.canReschedule && !t.isDone, o = Gt(() => a(t));
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: d,
      onDragStart: d ? (i) => {
        i.stopPropagation(), i.dataTransfer.effectAllowed = "move", i.dataTransfer.setData("text/plain", t.key), s(t);
      } : void 0,
      onPointerDown: (i) => {
        i.stopPropagation(), o.onPointerDown(i);
      },
      onClick: (i) => {
        i.stopPropagation(), o.onClick(i);
      },
      title: t.subtitle ? `${t.title} — ${t.subtitle}` : t.title,
      style: p ? { backgroundImage: p.pattern } : void 0,
      className: k(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        p ? p.pill : "bg-neutral-subtle text-text-primary",
        t.isDone && "line-through opacity-65",
        d && "cursor-grab active:cursor-grabbing",
        /* Hata SATIRDA kalır — toast'a kaçmaz. */
        l && "ring-1 ring-negative-500",
        r && "opacity-60"
      ),
      children: [
        r ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin shrink-0 text-[9px]", "aria-hidden": "true" }) : c && /* @__PURE__ */ e.jsx("i", { className: k("fa shrink-0 text-[9px] opacity-70", c.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: t.title }),
        l && /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation ms-auto shrink-0 text-[9px]", "aria-hidden": "true" })
      ]
    }
  );
}
function xa({ summary: t, onSelect: a }) {
  const s = O[t.source];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: (r) => {
        r.stopPropagation(), a(t.source);
      },
      className: k(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left",
        "text-[10.5px] font-medium text-text-secondary hover:bg-surface-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      ),
      children: [
        s && /* @__PURE__ */ e.jsx("i", { className: k("fa shrink-0 text-[9px] opacity-60", s.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: ta(t) })
      ]
    }
  );
}
function ma({ load: t, capacity: a }) {
  if (!a || t <= 0) return null;
  const s = t > a, r = s ? a / t * 100 : t / a * 100;
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "mt-auto flex h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle",
      title: `Gün yükü ${C.hours(t)} / kapasite ${C.hours(a)}`,
      "aria-label": `Gün yükü ${C.hours(t)}, kapasite ${C.hours(a)}`,
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-full bg-accent", style: { width: `${r}%` } }),
        s && /* @__PURE__ */ e.jsx("span", { className: "h-full flex-1 bg-negative" })
      ]
    }
  );
}
function pa({
  month: t,
  byDay: a,
  today: s,
  capacity: r,
  onSelectItem: l,
  onSelectDay: c,
  selectedDay: p,
  onDropItem: d,
  pending: o = {},
  errors: i = {},
  focusedDay: m,
  onFocusDay: f,
  onNavigate: b
}) {
  const u = gt(t), h = E(s), [n, x] = ye.useState(null), [v, D] = ye.useState(null), $ = ye.useRef(null), j = m ?? p ?? h, w = (S) => {
    const N = M(/* @__PURE__ */ new Date(`${j}T00:00:00`), S);
    u.some((F) => E(F) === E(N)) || b == null || b(N), f == null || f(E(N));
  }, A = (S) => {
    const N = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[S.key];
    if (N) {
      S.preventDefault(), w(N);
      return;
    }
    (S.key === "Enter" || S.key === " ") && (S.preventDefault(), c(j));
  };
  return ye.useEffect(() => {
    var N, F;
    const S = (N = $.current) == null ? void 0 : N.querySelector(`[data-day="${j}"]`);
    S && ((F = $.current) != null && F.contains(document.activeElement)) && S.focus();
  }, [j]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: ca.map((S, N) => /* @__PURE__ */ e.jsx(
      "div",
      {
        className: k(
          "px-2.5 py-2 text-right text-[10.5px] font-bold uppercase tracking-wider",
          N > 4 ? "text-text-tertiary opacity-70" : "text-text-tertiary"
        ),
        children: S
      },
      S
    )) }),
    /* @__PURE__ */ e.jsx(
      "div",
      {
        ref: $,
        role: "grid",
        "aria-label": "Ay takvimi",
        tabIndex: 0,
        onKeyDown: A,
        className: "grid grid-cols-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
        children: u.map((S) => {
          const N = E(S), F = a[N] ?? [], { pills: V, summaries: De } = ea(F), X = Se(F), B = S.getMonth() !== t.getMonth(), ne = N === h, te = N === p;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              role: "gridcell",
              "data-day": N,
              tabIndex: N === j ? 0 : -1,
              "aria-selected": te,
              "aria-label": `${C.dayTitle(S)}${F.length ? `, ${F.length} öğe` : ", boş"}`,
              onClick: () => {
                f == null || f(N), c(N);
              },
              onDragOver: n ? (T) => {
                T.preventDefault(), T.dataTransfer.dropEffect = "move", v !== N && D(N);
              } : void 0,
              onDragLeave: n ? () => D((T) => T === N ? null : T) : void 0,
              onDrop: n ? (T) => {
                T.preventDefault();
                const J = n;
                x(null), D(null), J && J.date.slice(0, 10) !== N && d(J, /* @__PURE__ */ new Date(`${N}T00:00:00`));
              } : void 0,
              className: k(
                "flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5",
                "transition-colors duration-fast last:border-r-0 hover:bg-surface-hover",
                B ? "bg-surface-sunken" : "bg-surface-base",
                te && "ring-2 ring-inset ring-border-focus",
                v === N && "bg-primary-subtle ring-2 ring-inset ring-accent"
              ),
              children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                  X > 0 && r && X > r && /* @__PURE__ */ e.jsx("span", { className: "rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: C.hours(X) }),
                  /* @__PURE__ */ e.jsx(
                    "span",
                    {
                      className: k(
                        "ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11.5px] font-semibold leading-none tabular-nums",
                        ne && "bg-accent text-white",
                        !ne && B && "text-text-tertiary opacity-60",
                        !ne && !B && "text-text-secondary"
                      ),
                      children: S.getDate()
                    }
                  )
                ] }),
                V.map((T) => /* @__PURE__ */ e.jsx(
                  ua,
                  {
                    item: T,
                    onSelect: l,
                    onDragStart: x,
                    isPending: !!o[T.key],
                    hasError: !!i[T.key]
                  },
                  T.key
                )),
                De.map((T) => /* @__PURE__ */ e.jsx(
                  xa,
                  {
                    summary: T,
                    onSelect: () => c(N)
                  },
                  `${N}-${T.source}`
                )),
                /* @__PURE__ */ e.jsx(ma, { load: X, capacity: r })
              ]
            },
            N
          );
        })
      }
    )
  ] });
}
const ba = { 1: "Google", 2: "Outlook", 3: "iCloud" };
function fa(t) {
  const a = String(t ?? "").trim().split(/\s+/).filter(Boolean);
  return a.length === 0 ? "?" : a.length === 1 ? a[0].slice(0, 2).toLocaleUpperCase("tr") : (a[0][0] + a[a.length - 1][0]).toLocaleUpperCase("tr");
}
function ha({
  sources: t,
  counts: a,
  enabled: s,
  onToggle: r,
  compact: l = !1,
  externalAccounts: c = [],
  externalLoading: p = !1,
  onOpenSync: d,
  teamOpen: o = !1,
  onToggleTeam: i,
  teamContent: m,
  teamMembers: f = [],
  riskCounts: b
}) {
  const u = (t ?? []).filter((x) => x.isAvailable);
  if (u.length === 0) return null;
  const h = new Set(u.map((x) => x.source)), n = Wt.map(({ key: x, sources: v }) => {
    const D = v.filter(($) => h.has($));
    return D.length === 0 ? null : {
      key: x,
      sources: D,
      meta: O[D[0]],
      /* Grubun tamamı kapalıysa kapalı sayılır — biri açıksa satır açıktır. */
      isOn: D.some(($) => s.has($)),
      count: D.reduce(($, j) => $ + (a[j] ?? 0), 0)
    };
  }).filter(Boolean);
  return /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Takvim kaynakları",
      className: k(
        "flex flex-col gap-1 rounded-card border border-subtle bg-surface-base p-2",
        l ? "w-[60px] items-center" : "w-full"
      ),
      children: [
        !l && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Kaynaklar" }),
        n.map(({ key: x, sources: v, meta: D, isOn: $, count: j }) => D ? /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": $,
            title: l ? `${D.railLabel ?? D.label} — ${j} öğe` : void 0,
            onClick: () => {
              const w = !$;
              v.forEach((A) => {
                s.has(A) !== w && r(A);
              });
            },
            className: k(
              "group flex items-center rounded-md text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              l ? "relative h-11 w-11 justify-center" : "gap-2.5 px-2 py-2",
              $ ? "text-text-primary" : "text-text-tertiary",
              "hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: k(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px]",
                    $ ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
                  ),
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ e.jsx("i", { className: k("fa", D.icon) })
                }
              ),
              l ? j > 0 && /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: k(
                    "absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-[9.5px] font-bold leading-4",
                    $ ? "bg-accent text-white" : "bg-neutral-200 text-text-tertiary"
                  ),
                  children: j
                }
              ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsx("span", { className: k("flex-1 truncate text-[12.5px] font-medium", !$ && "line-through decoration-1"), children: D.railLabel ?? D.label }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: j })
              ] })
            ]
          },
          x
        ) : null),
        !l && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex items-center justify-between border-t border-subtle px-2 pb-1 pt-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Dış takvimler" }),
            d && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: d,
                className: "rounded p-1 text-[11px] font-medium text-text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                children: "+ Ekle"
              }
            )
          ] }),
          c.length === 0 && !p && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 text-[11.5px] text-text-tertiary", children: "Bağlı takvim yok." }),
          p && c.length === 0 && /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1 text-[11.5px] text-text-tertiary", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
            "senkronize ediliyor…"
          ] }),
          c.map((x) => /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: k(
                "flex items-start gap-2 rounded-md px-2 py-1.5",
                x.error && "bg-negative-50"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: k(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px]",
                      x.error ? "bg-negative-100 text-negative-700" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: k("fa", x.error ? "fa-triangle-exclamation" : "fa-calendar-days") })
                  }
                ),
                /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: ba[x.provider] ?? "Takvim" }),
                  /* @__PURE__ */ e.jsx("span", { className: k(
                    "block truncate text-[10.5px]",
                    x.error ? "text-negative-700" : "text-text-tertiary"
                  ), children: x.error ?? `${x.email} · ${x.eventCount} etkinlik` }),
                  x.error && /* @__PURE__ */ e.jsx("a", { href: "/Calendars", className: "text-[10.5px] font-semibold text-text-link hover:underline", children: "Yeniden bağla" })
                ] })
              ]
            },
            x.accountId
          )),
          !l && i && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                role: "switch",
                "aria-checked": o,
                onClick: i,
                className: k(
                  "mt-2 flex items-center gap-2 border-t border-subtle px-2 pb-1 pt-2 text-left",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                ),
                children: [
                  /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Ekip katmanı" }),
                  /* @__PURE__ */ e.jsx(
                    "i",
                    {
                      className: k("fa text-[11px]", o ? "fa-toggle-on text-accent" : "fa-toggle-off text-text-tertiary"),
                      "aria-hidden": "true"
                    }
                  )
                ]
              }
            ),
            f.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-1 px-2 pb-1", children: [
              f.slice(0, 3).map((x) => /* @__PURE__ */ e.jsxs(
                "span",
                {
                  title: x.name,
                  className: "flex items-center gap-1 rounded-full bg-neutral-subtle py-0.5 pe-2 ps-0.5 text-[10.5px] text-text-secondary",
                  children: [
                    /* @__PURE__ */ e.jsx(
                      "span",
                      {
                        className: "flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[8.5px] font-bold text-[color:var(--apya-avatar-fg)]",
                        "aria-hidden": "true",
                        children: fa(x.name)
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { className: "max-w-[86px] truncate", children: x.name })
                  ]
                },
                x.userId
              )),
              f.length > 3 && /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-medium text-text-tertiary", children: [
                "+",
                f.length - 3
              ] })
            ] }),
            m
          ] }),
          b && (b.overdue > 0 || b.dueToday > 0 || b.syncError > 0) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("p", { className: "mt-2 border-t border-subtle px-2 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Risk" }),
            [
              { key: "overdue", label: "Gecikmiş", value: b.overdue, dot: "bg-negative" },
              { key: "dueToday", label: "Bugün son gün", value: b.dueToday, dot: "bg-warning" },
              { key: "syncError", label: "Senkron hatası", value: b.syncError, dot: "bg-negative-700" }
            ].filter((x) => x.value > 0).map((x) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-2 py-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: k("h-[7px] w-[7px] shrink-0 rounded-full", x.dot), "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[11.5px] text-text-secondary", children: x.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-primary", children: x.value })
            ] }, x.key))
          ] }),
          d && /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: d,
              className: "mt-2 flex items-center gap-2 rounded-md border border-subtle px-2.5 py-2 text-left text-[12px] font-medium text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa fa-gear text-[12px] text-text-tertiary", "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Senkron ayarları" }),
                /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right text-[10px] text-text-tertiary", "aria-hidden": "true" })
              ]
            }
          )
        ] })
      ]
    }
  );
}
const ga = { month: "Ay", week: "Hafta", day: "Gün", agenda: "Ajanda" };
function ya(t) {
  if (!t) return null;
  const a = Math.round((Date.now() - new Date(t).getTime()) / 6e4);
  if (!Number.isFinite(a) || a < 0) return null;
  if (a < 1) return "az önce";
  if (a < 60) return `${a} dk önce`;
  const s = Math.round(a / 60);
  if (s < 24) return `${s} sa önce`;
  const r = Math.round(s / 24);
  return r === 1 ? "dün" : `${r} gün önce`;
}
function Ne() {
  var s;
  const t = "/Tasks/CreateModal";
  if (!((s = window.abp) != null && s.ModalManager)) {
    window.location.href = t;
    return;
  }
  const a = new window.abp.ModalManager(t);
  a.onResult(() => {
    var r, l, c;
    return (c = (l = (r = window.abp) == null ? void 0 : r.notify) == null ? void 0 : l.success) == null ? void 0 : c.call(l, "Görev oluşturuldu.");
  }), a.open();
}
function ka() {
  return /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: Ne,
      "aria-label": "Yeni görev",
      title: "Yeni görev",
      style: { bottom: "calc(1rem + env(safe-area-inset-bottom))" },
      className: "fixed right-4 z-fixed grid h-14 w-14 place-items-center rounded-full bg-accent text-text-inverse shadow-lg transition-colors duration-fast hover:bg-accent-600 active:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
      children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus text-[19px]", "aria-hidden": "true" })
    }
  );
}
function va({
  title: t,
  view: a,
  onView: s,
  onPrev: r,
  onNext: l,
  onToday: c,
  overloadDays: p,
  onHelp: d,
  filterCount: o = 0,
  onClearFilters: i,
  lastSyncAt: m,
  syncError: f = !1,
  canCreateTask: b = !0,
  compact: u = !1
}) {
  const h = a !== "agenda", n = ya(m);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    h && /* @__PURE__ */ e.jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: r,
          "aria-label": "Öncekine git",
          className: "h-9 w-9 rounded-l-md border border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: l,
          "aria-label": "Sonrakine git",
          className: "h-9 w-9 rounded-r-md border border-l-0 border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(z, { variant: "outline", size: "sm", onClick: c, children: "Bugün" }),
    /* @__PURE__ */ e.jsx("h2", { className: "ml-1 text-[17px] font-semibold capitalize tracking-tight text-text-primary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "ml-auto flex flex-wrap items-center justify-end gap-2", children: [
      p > 0 && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "rounded-md bg-negative-50 px-2 py-1 text-[11.5px] font-semibold text-negative-700",
          title: "Günlük kapasitenizi aşan gün sayısı",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
            p,
            " günde kapasite aşımı"
          ]
        }
      ),
      (n || f) && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: k(
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium",
            f ? "bg-negative-50 text-negative-700" : "text-text-tertiary"
          ),
          title: f ? "Bir dış takvim senkronlanamıyor" : "Dış takvimlerin son senkron zamanı",
          children: [
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: k("h-[6px] w-[6px] rounded-full", f ? "bg-negative" : "bg-positive"),
                "aria-hidden": "true"
              }
            ),
            "Senkron",
            n ? ` · ${n}` : ""
          ]
        }
      ),
      o > 0 && i && /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: i,
          title: "Filtreleri temizle — kapalı kaynakları geri aç",
          className: "flex h-9 items-center gap-1.5 rounded-md border border-default bg-surface-base px-2.5 text-[12px] font-medium text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: [
            "Filtre",
            /* @__PURE__ */ e.jsx("span", { className: "rounded-full bg-primary-subtle px-1.5 text-[11px] font-semibold text-accent", children: o })
          ]
        }
      ),
      !u && /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => window.print(),
          title: "A4 yatay, iki sayfa",
          className: "h-9 rounded-md border border-default bg-surface-base px-2.5 text-[12px] text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-print", "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "sr-only", children: "Yazdır" })
          ]
        }
      ),
      d && !u && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: d,
          title: "Klavye kısayolları (?)",
          "aria-label": "Klavye kısayolları",
          className: "h-9 w-9 rounded-md border border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-keyboard", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(ga).map(([x, v]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": a === x,
          onClick: () => s(x),
          className: k(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            a === x ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: v
        },
        x
      )) }),
      b && !u && /* @__PURE__ */ e.jsxs(z, { variant: "primary", size: "sm", onClick: Ne, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus me-1.5", "aria-hidden": "true" }),
        "Yeni görev"
      ] })
    ] })
  ] });
}
const ee = 44, ja = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], Na = {
  [I.OVERDUE]: "bg-negative-50 text-negative-700",
  [I.DUE_TODAY]: "bg-warning-50 text-warning-700"
};
function wa({ load: t, capacity: a }) {
  if (!a || t <= 0) return null;
  const s = t > a;
  return /* @__PURE__ */ e.jsx("div", { className: "mt-1 h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
    "span",
    {
      className: k("block h-full", s ? "bg-negative" : "bg-accent"),
      style: { width: `${Math.min(t / a, 1) * 100}%` }
    }
  ) });
}
function Sa({ days: t, byDay: a, today: s, capacity: r, onSelectItem: l, onSelectDay: c, selectedDay: p }) {
  const d = E(s), o = g.useRef(null), [i, m] = g.useState(() => {
    const j = /* @__PURE__ */ new Date();
    return j.getHours() * 60 + j.getMinutes();
  });
  g.useEffect(() => {
    const j = setInterval(() => {
      const w = /* @__PURE__ */ new Date();
      m(w.getHours() * 60 + w.getMinutes());
    }, 6e4);
    return () => clearInterval(j);
  }, []);
  const f = t.map(E), b = {}, u = {};
  for (const j of f) {
    const w = a[j] ?? [];
    b[j] = w.filter(it), u[j] = w.filter((A) => !it(A));
  }
  const h = f.flatMap((j) => b[j]), { start: n, end: x } = ra(h), v = Array.from({ length: x - n }, (j, w) => n + w), D = (x - n) * ee, $ = f.includes(d) && i >= n * 60 && i <= x * 60;
  return g.useEffect(() => {
    if (!$ || !o.current) return;
    const j = (i - n * 60) / 60 * ee;
    o.current.scrollTop = Math.max(0, j - 120);
  }, [$, n]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "grid border-b border-default bg-surface-raised",
        style: { gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))` },
        children: [
          /* @__PURE__ */ e.jsx("div", {}),
          t.map((j) => {
            const w = E(j), A = Se(a[w] ?? []), S = w === d;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => c(w),
                className: k(
                  "border-l border-subtle px-2 py-2 text-left transition-colors duration-fast hover:bg-surface-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
                  p === w && "bg-primary-subtle"
                ),
                children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "flex items-baseline gap-1.5", children: [
                    /* @__PURE__ */ e.jsx("span", { className: k(
                      "text-[10.5px] font-bold uppercase tracking-wider",
                      S ? "text-accent" : "text-text-tertiary"
                    ), children: ja[(j.getDay() + 6) % 7] }),
                    /* @__PURE__ */ e.jsx("span", { className: k(
                      "font-mono text-[13px] font-semibold tabular-nums",
                      S ? "text-accent" : "text-text-primary"
                    ), children: j.getDate() }),
                    r && A > r && /* @__PURE__ */ e.jsx("span", { className: "ms-auto rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: C.hours(A) })
                  ] }),
                  /* @__PURE__ */ e.jsx(wa, { load: A, capacity: r })
                ]
              },
              w
            );
          })
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "grid border-b border-default",
        style: { gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))` },
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-end px-1.5 py-1.5 text-[9.5px] font-bold uppercase leading-tight tracking-wider text-text-tertiary", children: [
            "Son",
            /* @__PURE__ */ e.jsx("br", {}),
            "tarih"
          ] }),
          f.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-[46px] flex-col gap-[3px] border-l border-subtle p-1", children: [
            u[j].slice(0, 4).map((w) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => l(w),
                title: w.title,
                className: k(
                  "flex w-full items-center gap-1 truncate rounded-[5px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                  Na[w.risk] ?? "bg-neutral-subtle text-text-primary",
                  w.isDone && "line-through opacity-65"
                ),
                children: [
                  O[w.source] && /* @__PURE__ */ e.jsx("i", { className: k("fa shrink-0 text-[9px] opacity-70", O[w.source].icon), "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "truncate", children: w.title })
                ]
              },
              w.key
            )),
            u[j].length > 4 && /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => c(j),
                className: "px-1.5 text-left text-[10.5px] font-medium text-text-tertiary hover:text-text-primary",
                children: [
                  "+",
                  u[j].length - 4,
                  " öğe"
                ]
              }
            )
          ] }, j))
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { ref: o, className: "max-h-[520px] overflow-y-auto", children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "relative grid",
          style: {
            gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))`,
            height: `${D}px`
          },
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "relative", children: v.map((j, w) => /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: "absolute right-1.5 -translate-y-1/2 font-mono text-[10px] tabular-nums text-text-tertiary",
                style: { top: `${w * ee}px` },
                children: [
                  String(j).padStart(2, "0"),
                  ":00"
                ]
              },
              j
            )) }),
            f.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "relative border-l border-subtle", children: [
              v.map((w, A) => /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "absolute inset-x-0 border-t border-subtle",
                  style: { top: `${A * ee}px` }
                },
                w
              )),
              b[j].map((w) => {
                const A = je(w.startTime), S = w.endTime ? je(w.endTime) : A + 60, N = (A - n * 60) / 60 * ee, F = Math.max((S - A) / 60 * ee, 18);
                return /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => l(w),
                    title: `${w.title} · ${ze(w.startTime)}`,
                    style: {
                      top: `${N}px`,
                      height: `${F}px`,
                      backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(0,0,0,.05) 4px, rgba(0,0,0,.05) 6px)"
                    },
                    className: k(
                      "absolute inset-x-0.5 overflow-hidden rounded-[5px] border-l-2 border-accent bg-primary-subtle",
                      "px-1.5 py-0.5 text-left text-[10.5px] leading-tight text-text-primary",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    ),
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: "block truncate font-semibold", children: w.title }),
                      /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[9.5px] text-text-tertiary", children: [
                        ze(w.startTime),
                        w.endTime ? `–${ze(w.endTime)}` : ""
                      ] })
                    ]
                  },
                  w.key
                );
              }),
              $ && j === d && /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "pointer-events-none absolute inset-x-0 z-10 border-t-2 border-negative",
                  style: { top: `${(i - n * 60) / 60 * ee}px` },
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ e.jsx("span", { className: "absolute -left-1 -top-1 h-2 w-2 rounded-full bg-negative" })
                }
              )
            ] }, j))
          ]
        }
      ),
      h.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "border-t border-subtle px-3 py-2 text-[11.5px] text-text-tertiary", children: "Saat ızgarası dış takvim etkinliklerini gösterir. Bağlı bir takvim yoksa boş kalır." })
    ] })
  ] });
}
function Da({ item: t }) {
  var m;
  const [a, s] = g.useState(""), [r, l] = g.useState(() => /* @__PURE__ */ new Set()), c = t.description ?? t.subtitle ?? "", p = W({
    queryKey: ["calendar", "projects-lookup"],
    queryFn: () => K.get("/api/app/task/projects-lookup"),
    staleTime: 10 * 6e4
  }), d = L({
    mutationFn: async () => {
      const f = new FormData();
      f.append("file", new Blob([`${t.title}

${c}`], { type: "text/plain" }), "toplanti-notlari.txt");
      const b = await fetch(`/api/ai-task-generator/parse?projectId=${a}`, {
        method: "POST",
        body: f,
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });
      if (!b.ok) throw new Error("Notlardan görev çıkarılamadı.");
      return b.json();
    },
    onSuccess: (f) => l(new Set(((f == null ? void 0 : f.suggestions) ?? []).map((b, u) => u)))
  }), o = L({
    mutationFn: () => {
      var f;
      return K.post("/api/ai-task-generator/create-tasks", {
        projectId: a,
        approvedTasks: (((f = d.data) == null ? void 0 : f.suggestions) ?? []).filter((b, u) => r.has(u))
      });
    },
    /* Olay takvimin kendi dinleyicisiyle feed ve ekip yükünü tazeler, damga Pano'yu. */
    onSuccess: () => Yt({ entity: "task", action: "create" })
  }), i = ((m = d.data) == null ? void 0 : m.suggestions) ?? [];
  return /* @__PURE__ */ e.jsxs("section", { className: "border-t border-subtle px-4 py-3", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Toplantıdan görev" }),
    !c && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[11.5px] text-text-tertiary", children: "Bu etkinlikte not yok — çıkarılacak aksiyon maddesi bulunamaz." }),
    c && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs(
        "select",
        {
          value: a,
          onChange: (f) => s(f.target.value),
          "aria-label": "Görevlerin ekleneceği proje",
          className: "mt-1.5 w-full rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "Proje seçin…" }),
            (p.data ?? []).map((f) => /* @__PURE__ */ e.jsx("option", { value: f.id, children: f.name }, f.id))
          ]
        }
      ),
      /* @__PURE__ */ e.jsx(
        z,
        {
          size: "sm",
          variant: "outline",
          className: "mt-2",
          disabled: !a || d.isPending,
          onClick: () => d.mutate(),
          children: d.isPending ? "Notlar okunuyor…" : "Notlardan aksiyon çıkar"
        }
      ),
      d.isError && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-negative-700", children: d.error.message }),
      i.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", children: [
        i.map((f, b) => /* @__PURE__ */ e.jsxs("label", { className: "flex cursor-pointer items-start gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: r.has(b),
              onChange: () => l((u) => {
                const h = new Set(u);
                return h.has(b) ? h.delete(b) : h.add(b), h;
              }),
              className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[12px] text-text-primary", children: f.title })
        ] }, `${f.title}-${b}`)),
        /* @__PURE__ */ e.jsx(
          z,
          {
            size: "sm",
            variant: "primary",
            className: k("mt-2"),
            disabled: r.size === 0 || o.isPending || o.isSuccess,
            onClick: () => o.mutate(),
            children: o.isSuccess ? `${o.data} görev eklendi` : o.isPending ? "Ekleniyor…" : `${r.size} görev olarak ekle`
          }
        )
      ] })
    ] })
  ] });
}
const Ca = {
  [I.OVERDUE]: { text: "Gecikmiş", cls: "bg-negative-50 text-negative-700" },
  [I.DUE_TODAY]: { text: "Bugün son gün", cls: "bg-warning-50 text-warning-700" }
};
function oe({ label: t, children: a }) {
  return a ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-subtle py-2.5 last:border-b-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11.5px] font-medium text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "min-w-0 text-right text-[12.5px] text-text-primary", children: a })
  ] }) : null;
}
function Ta({ item: t, capacity: a, onClose: s, onReschedule: r, onComplete: l, isPending: c, error: p, onRetry: d }) {
  const [o, i] = g.useState(() => t.date.slice(0, 10)), m = O[t.source], f = Ca[t.risk], b = t.date.slice(0, 10);
  g.useEffect(() => i(b), [b]);
  const u = () => {
    !o || o === b || r(t, /* @__PURE__ */ new Date(`${o}T00:00:00`));
  };
  return /* @__PURE__ */ e.jsx(ue, { open: !0, onOpenChange: (h) => {
    h || s();
  }, children: /* @__PURE__ */ e.jsxs(xe, { side: "right", title: t.title, className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md bg-neutral-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary", children: [
          m && /* @__PURE__ */ e.jsx("i", { className: k("fa text-[10px]", m.icon), "aria-hidden": "true" }),
          m == null ? void 0 : m.label
        ] }),
        f && /* @__PURE__ */ e.jsx("span", { className: k("rounded-md px-2 py-1 text-[11px] font-bold", f.cls), children: f.text }),
        t.isDone && /* @__PURE__ */ e.jsx("span", { className: "rounded-md bg-positive-50 px-2 py-1 text-[11px] font-bold text-positive-700", children: "Tamamlandı" }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: s,
            "aria-label": "Kapat",
            className: "ml-auto rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx("h3", { className: "mt-2 text-[16px] font-semibold leading-snug text-text-primary", children: t.title })
    ] }),
    p && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-negative-100 bg-negative-50 px-4 py-2.5 text-[12px] text-negative-700", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: p }),
      /* @__PURE__ */ e.jsx(mt, { onRetry: d })
    ] }),
    c && /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle px-4 py-2 text-[12px] text-text-tertiary", "aria-live": "polite", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "kaydediliyor…"
    ] }),
    (t.canComplete || t.canReschedule) && !t.isDone && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2 border-b border-subtle px-4 py-3", children: [
      t.canComplete && /* @__PURE__ */ e.jsxs(z, { size: "sm", variant: "secondary", onClick: () => l(t), children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-check me-1.5", "aria-hidden": "true" }),
        "Tamamla"
      ] }),
      t.canReschedule && /* @__PURE__ */ e.jsx(
        z,
        {
          size: "sm",
          variant: "outline",
          onClick: () => r(t, M(/* @__PURE__ */ new Date(`${b}T00:00:00`), 1)),
          children: "+1 gün ertele"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-2", children: [
      /* @__PURE__ */ e.jsx(oe, { label: "Son tarih", children: t.canReschedule ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "date",
            value: o,
            onChange: (h) => i(h.target.value),
            className: "rounded-md border border-default bg-surface-base px-2 py-1 text-[12.5px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": "Son tarih"
          }
        ),
        o !== b && /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "primary", onClick: u, children: "Uygula" })
      ] }) : /* @__PURE__ */ e.jsxs("span", { className: "text-text-secondary", children: [
        C.dayTitle(/* @__PURE__ */ new Date(`${b}T00:00:00`)),
        /* @__PURE__ */ e.jsx("span", { className: "ml-1.5 text-text-tertiary", children: "· takvimden değiştirilemez" })
      ] }) }),
      /* @__PURE__ */ e.jsx(oe, { label: "Bağlam", children: t.subtitle }),
      /* @__PURE__ */ e.jsx(oe, { label: "Atanan", children: t.assigneeName }),
      /* @__PURE__ */ e.jsx(oe, { label: "Tutar", children: t.amount != null ? C.money(t.amount, t.currency) : null }),
      /* @__PURE__ */ e.jsx(oe, { label: "Gün yükü", children: t.loadHours != null ? `${C.hours(t.loadHours)}${a ? ` / ${C.hours(a)} kapasite` : ""}` : null })
    ] }),
    t.source === 7 && /* @__PURE__ */ e.jsx(Da, { item: t }),
    t.href && /* @__PURE__ */ e.jsx("footer", { className: "border-t border-subtle px-4 py-3", children: /* @__PURE__ */ e.jsxs(
      "a",
      {
        href: t.href,
        className: "text-[12.5px] font-medium text-text-link hover:underline",
        children: [
          m == null ? void 0 : m.label,
          " ekranında aç",
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right ms-1.5 text-[10px]", "aria-hidden": "true" })
        ]
      }
    ) })
  ] }) });
}
const vt = ["calendar", "sync-settings"];
function Ea(t) {
  return W({
    queryKey: vt,
    queryFn: () => K.get("/api/app/calendar/sync-settings"),
    enabled: t,
    staleTime: 3e4
  });
}
function $a() {
  const t = U();
  return L({
    /* ABP konvansiyonu: UpdateSyncRulesAsync → PUT (POST 405). */
    mutationFn: (a) => K.put("/api/app/calendar/sync-rules", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: vt }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
const jt = ["calendar", "sync-settings"], Ra = ["calendar", "external"];
function Nt() {
  return L({
    mutationFn: (t) => K.get(`/api/app/calendar/auth-url?provider=${t}`),
    /* Sağlayıcının kendi ekranına gidiliyor: SPA yönlendirmesi değil, tam sayfa. */
    onSuccess: (t) => {
      typeof t == "string" && t && (window.location.href = t);
    }
  });
}
function za() {
  const t = U();
  return L({
    mutationFn: (a) => K.post(`/api/app/calendar/${a}/disconnect-account`, {}),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: jt }), t.invalidateQueries({ queryKey: Ra });
    }
  });
}
function Aa() {
  const t = U();
  return L({
    mutationFn: (a) => K.post(`/api/app/calendar/${a}/force-sync`, {}),
    /* "Son senkron" damgası ve senkron günlüğü bu çağrıyla değişir. */
    onSuccess: () => t.invalidateQueries({ queryKey: jt })
  });
}
const wt = ["calendar", "ical-feed"], Be = ["calendar", "ical-subscriptions"];
function Ka(t) {
  return W({
    queryKey: wt,
    /* GetOrCreate: bağlantı yoksa ilk açılışta üretilir. */
    queryFn: () => K.post("/api/app/ical-feed/ensure", {}),
    enabled: t,
    staleTime: 1 / 0
  });
}
function Pa() {
  const t = U();
  return L({
    mutationFn: () => K.post("/api/app/ical-feed/regenerate", {}),
    onSuccess: (a) => t.setQueryData(wt, a)
  });
}
function Ia(t) {
  return W({
    queryKey: Be,
    queryFn: () => K.get("/api/app/ical-subscription"),
    enabled: t,
    staleTime: 3e4
  });
}
function Oa() {
  const t = U();
  return L({
    mutationFn: (a) => K.post("/api/app/ical-subscription", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Be }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function Fa() {
  const t = U();
  return L({
    mutationFn: (a) => K.delete(`/api/app/ical-subscription/${a}`),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Be }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function Ma() {
  return L({
    mutationFn: (t) => K.post(`/api/app/ical-subscription/probe?url=${encodeURIComponent(t)}`, {})
  });
}
const La = {
  1: { label: "Google Calendar", icon: "fa-google", brand: "bg-[#ea4335]" },
  2: { label: "Microsoft Outlook", icon: "fa-windows", brand: "bg-[#0078d4]" },
  3: { label: "iCloud", icon: "fa-apple", brand: "bg-neutral-700" }
}, Ba = {
  0: { title: "Son değişen kazanır", desc: "İki taraf da düzenlenirse en son yapılan değişiklik uygulanır; ekranda geri alma şeridi çıkar." },
  1: { title: "APYA her zaman kazanır", desc: "Dış takvim salt-okunur ayna olur; dışarıdaki düzenleme geri alınır." }
}, ot = {
  0: { icon: "fa-arrow-up-from-bracket", cls: "text-text-tertiary" },
  1: { icon: "fa-code-merge", cls: "text-warning-700" },
  2: { icon: "fa-triangle-exclamation", cls: "text-negative-700" }
};
function qe(t) {
  if (!t) return "hiç";
  const a = Math.round((Date.now() - new Date(t).getTime()) / 6e4);
  return a < 1 ? "az önce" : a < 60 ? `${a} dk önce` : a < 1440 ? `${Math.round(a / 60)} sa önce` : C.dayShort(new Date(t));
}
function qa({ account: t, onSave: a, saving: s }) {
  var h;
  const r = La[t.provider] ?? { label: "Takvim", icon: "fa-calendar", brand: "bg-neutral-700" }, l = Aa(), c = za(), [p, d] = g.useState(() => new Set(t.syncSources ?? [])), [o, i] = g.useState(t.conflictRule ?? 0), [m, f] = g.useState(t.isSyncEnabled);
  g.useEffect(() => {
    d(new Set(t.syncSources ?? [])), i(t.conflictRule ?? 0), f(t.isSyncEnabled);
  }, [t]);
  const b = m !== t.isSyncEnabled || o !== t.conflictRule || p.size !== (t.syncSources ?? []).length || [...p].some((n) => !(t.syncSources ?? []).includes(n)), u = (n) => d((x) => {
    const v = new Set(x);
    return v.has(n) ? v.delete(n) : v.add(n), v;
  });
  return /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-3 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: k("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", r.brand), "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("i", { className: k("fab", r.icon) }) }),
      /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-semibold text-text-primary", children: r.label }),
        /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[11.5px] text-text-tertiary", children: [
          t.externalEmail,
          " · son senkron ",
          qe(t.lastSyncTime)
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("label", { className: "flex shrink-0 items-center gap-1.5 text-[11.5px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: m,
            onChange: (n) => f(n.target.checked),
            className: "h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
          }
        ),
        "Açık"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Bu hesaba ne gitsin?" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Pe.map((n) => {
        var v, D;
        const x = p.has(n);
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": x,
            onClick: () => u(n),
            className: k(
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              x ? "border-accent bg-primary-subtle text-accent" : "border-subtle bg-surface-base text-text-tertiary hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: k("fa text-[10px]", (v = O[n]) == null ? void 0 : v.icon), "aria-hidden": "true" }),
              (D = O[n]) == null ? void 0 : D.label
            ]
          },
          n
        );
      }) }),
      p.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-text-tertiary", children: "Hiçbiri seçili değil — yalnız görevler gönderilir." }),
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Çakışma kuralı" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: Object.entries(Ba).map(([n, x]) => {
        const v = Number(n), D = o === v;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => i(v),
            className: k(
              "rounded-md border px-2.5 py-2 text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              D ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("span", { className: k("block text-[12px] font-semibold", D ? "text-accent" : "text-text-primary"), children: x.title }),
              /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] leading-snug text-text-tertiary", children: x.desc })
            ]
          },
          n
        );
      }) }),
      b && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          z,
          {
            size: "sm",
            variant: "primary",
            disabled: s,
            onClick: () => a({
              accountId: t.id,
              isSyncEnabled: m,
              syncSources: [...p],
              syncProjectIds: t.syncProjectIds ?? [],
              conflictRule: o
            }),
            children: s ? "Kaydediliyor…" : "Kuralları kaydet"
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Kaydedilmemiş değişiklik var" })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("footer", { className: "flex items-center gap-2 border-t border-subtle px-3 py-2", children: [
      /* @__PURE__ */ e.jsxs(
        z,
        {
          size: "sm",
          variant: "outline",
          disabled: l.isPending,
          onClick: () => l.mutate(t.id),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-rotate me-1.5", "aria-hidden": "true" }),
            l.isPending ? "Senkronlanıyor…" : "Şimdi senkronize et"
          ]
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          disabled: c.isPending,
          onClick: () => {
            window.confirm(`${t.externalEmail} bağlantısı kaldırılsın mı? Dış takvimdeki mevcut etkinlikler silinmez.`) && c.mutate(t.id);
          },
          className: "ms-auto rounded-md px-2 py-1 text-[11.5px] font-medium text-negative-700 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-60",
          children: c.isPending ? "Kaldırılıyor…" : "Bağlantıyı kaldır"
        }
      )
    ] }),
    (l.isError || c.isError) && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "border-t border-subtle px-3 py-2 text-[11.5px] text-negative-700", children: ((h = l.error || c.error) == null ? void 0 : h.message) || "İşlem tamamlanamadı." })
  ] });
}
const _a = [
  { value: 15, label: "15 dk" },
  { value: 60, label: "1 saat" },
  { value: 360, label: "6 saat" },
  { value: 1440, label: "Günlük" }
];
function Ga({ open: t }) {
  var j, w, A, S;
  const a = Ka(t), s = Pa(), r = Ia(t), l = Oa(), c = Fa(), p = Ma(), [d, o] = g.useState(""), [i, m] = g.useState(""), [f, b] = g.useState(60), [u, h] = g.useState(!1), n = (j = a.data) != null && j.path ? `${window.location.origin}${a.data.path}` : "", x = d.trim(), v = /^https?:\/\//i.test(x), D = x !== "" && !v && !p.data, $ = async () => {
    try {
      await navigator.clipboard.writeText(n), h(!0), setTimeout(() => h(!1), 2e3);
    } catch {
    }
  };
  return /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsx("header", { className: "border-b border-subtle px-3 py-2", children: /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-semibold text-text-primary", children: "iCal" }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("p", { className: "text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "APYA takviminize abone olun" }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-1.5 flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            readOnly: !0,
            value: n,
            "aria-label": "iCal abonelik bağlantısı",
            className: "min-w-0 flex-1 truncate rounded-md border border-default bg-surface-sunken px-2 py-1 font-mono text-[11px] text-text-secondary"
          }
        ),
        /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "outline", onClick: $, disabled: !n, children: u ? "Kopyalandı" : "Kopyala" })
      ] }),
      /* @__PURE__ */ e.jsxs("p", { className: "mt-1.5 text-[11px] leading-snug text-text-tertiary", children: [
        "Salt-okunur bağlantı; size atanan tarihli görevleri taşır. Bağlantıyı bilen herkes bu takvimi okuyabilir —",
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => s.mutate(),
            className: "ms-1 font-semibold text-text-link hover:underline",
            children: "yeniden üret"
          }
        ),
        " ",
        "dediğinizde eski bağlantı anında geçersizleşir."
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("p", { className: "text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Dışarıdan takvim ekle" }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-1.5 flex flex-col gap-1.5", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "url",
            value: d,
            onChange: (N) => {
              o(N.target.value), p.reset();
            },
            placeholder: "https://…/basic.ics",
            "aria-label": "Takvim bağlantısı",
            "aria-describedby": D ? "ical-url-hint" : void 0,
            className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          }
        ),
        D && /* @__PURE__ */ e.jsx("p", { id: "ical-url-hint", className: "text-[11px] text-text-tertiary", children: Ft("Calendar:Ical:UrlHint", "Adres http:// ya da https:// ile başlamalı.") }),
        ((w = p.data) == null ? void 0 : w.isValid) && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-positive-700", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-check me-1", "aria-hidden": "true" }),
          "Bağlantı doğrulandı · ",
          p.data.eventCount,
          " etkinlik bulundu"
        ] }),
        p.data && !p.data.isValid && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-negative-700", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
          p.data.error
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              value: i,
              onChange: (N) => m(N.target.value),
              placeholder: ((A = p.data) == null ? void 0 : A.suggestedName) || "Görünen ad",
              "aria-label": "Görünen ad",
              className: "min-w-0 flex-1 rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              value: f,
              onChange: (N) => b(Number(N.target.value)),
              "aria-label": "Yenileme sıklığı",
              className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
              children: _a.map((N) => /* @__PURE__ */ e.jsx("option", { value: N.value, children: N.label }, N.value))
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(
            z,
            {
              size: "sm",
              variant: "outline",
              disabled: !x || p.isPending,
              onClick: () => p.mutate(x),
              children: p.isPending ? "Deneniyor…" : "Bağlantıyı dene"
            }
          ),
          /* @__PURE__ */ e.jsx(
            z,
            {
              size: "sm",
              variant: "primary",
              disabled: !v || l.isPending,
              onClick: () => l.mutate(
                { url: x, displayName: i, color: "accent", refreshMinutes: f },
                { onSuccess: () => {
                  o(""), m(""), p.reset();
                } }
              ),
              children: l.isPending ? "Ekleniyor…" : "Takvimi ekle"
            }
          )
        ] }),
        l.isError && /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-negative-700", children: ((S = l.error) == null ? void 0 : S.message) || "Takvim eklenemedi." }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] leading-snug text-text-tertiary", children: [
          "iCal abonelikleri ",
          /* @__PURE__ */ e.jsx("strong", { className: "font-semibold", children: "tek yönlüdür" }),
          ": etkinlikler APYA'da salt-okunur görünür, APYA öğeleri bu takvime yazılmaz. Çift yönlü senkron için Google veya Outlook hesabı bağlayın."
        ] })
      ] }),
      (r.data ?? []).length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 border-t border-subtle pt-2", children: r.data.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: N.displayName }),
          /* @__PURE__ */ e.jsx("span", { className: k(
            "block truncate text-[10.5px]",
            N.lastError ? "text-negative-700" : "text-text-tertiary"
          ), children: N.lastError ?? `${N.lastEventCount} etkinlik · ${qe(N.lastFetchedAt)} çekildi` })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => c.mutate(N.id),
            className: "shrink-0 rounded p-1 text-[11px] text-text-tertiary hover:text-negative-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": `${N.displayName} aboneliğini kaldır`,
            children: "Kaldır"
          }
        )
      ] }, N.id)) })
    ] })
  ] });
}
function Ya({ open: t, onClose: a }) {
  var p, d;
  const { data: s, isPending: r } = Ea(t), l = $a(), c = Nt();
  return /* @__PURE__ */ e.jsx(ue, { open: t, onOpenChange: (o) => {
    o || a();
  }, children: /* @__PURE__ */ e.jsxs(xe, { side: "right", title: "Takvim senkronizasyonu", className: "w-full max-w-[440px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-semibold text-text-primary", children: "Takvim senkronizasyonu" }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 text-[11.5px] text-text-tertiary", children: "APYA öğeleri dış takvimlerinize etkinlik olarak yazılır." })
      ] }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: a,
          "aria-label": "Kapat",
          className: "rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "flex-1 overflow-y-auto px-4 py-3", children: r ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", "aria-hidden": "true", children: [
      /* @__PURE__ */ e.jsx(ce, { height: 92 }),
      /* @__PURE__ */ e.jsx(ce, { height: 92 })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", children: [
      ((s == null ? void 0 : s.accounts) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-4", children: /* @__PURE__ */ e.jsx(
        re,
        {
          compact: !0,
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
          title: "Bağlı hesap yok",
          description: "Google veya Outlook bağlayınca size atanan tarihli öğeler oraya etkinlik olarak yazılır.",
          action: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center justify-center gap-2", children: [
            /* @__PURE__ */ e.jsxs(z, { size: "sm", variant: "outline", disabled: c.isPending, onClick: () => c.mutate(1), children: [
              /* @__PURE__ */ e.jsx("i", { className: "fab fa-google me-1.5", "aria-hidden": "true" }),
              "Google bağla"
            ] }),
            /* @__PURE__ */ e.jsxs(z, { size: "sm", variant: "outline", disabled: c.isPending, onClick: () => c.mutate(2), children: [
              /* @__PURE__ */ e.jsx("i", { className: "fab fa-windows me-1.5", "aria-hidden": "true" }),
              "Outlook bağla"
            ] })
          ] })
        }
      ) }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        l.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "text-[11.5px] text-negative-700", children: ((p = l.error) == null ? void 0 : p.message) || "Senkron kuralları kaydedilemedi." }),
        s.accounts.map((o) => /* @__PURE__ */ e.jsx(
          qa,
          {
            account: o,
            saving: l.isPending,
            onSave: (i) => l.mutate(i)
          },
          o.id
        )),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: "Başka hesap bağla:" }),
          /* @__PURE__ */ e.jsxs(z, { size: "sm", variant: "outline", disabled: c.isPending, onClick: () => c.mutate(1), children: [
            /* @__PURE__ */ e.jsx("i", { className: "fab fa-google me-1.5", "aria-hidden": "true" }),
            "Google"
          ] }),
          /* @__PURE__ */ e.jsxs(z, { size: "sm", variant: "outline", disabled: c.isPending, onClick: () => c.mutate(2), children: [
            /* @__PURE__ */ e.jsx("i", { className: "fab fa-windows me-1.5", "aria-hidden": "true" }),
            "Outlook"
          ] })
        ] })
      ] }),
      c.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "text-[11.5px] text-negative-700", children: ((d = c.error) == null ? void 0 : d.message) || "Yetkilendirme adresi alınamadı." }),
      /* @__PURE__ */ e.jsx(Ga, { open: t }),
      /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
        /* @__PURE__ */ e.jsx("header", { className: "border-b border-subtle px-3 py-2", children: /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-semibold text-text-primary", children: "Senkron günlüğü" }) }),
        /* @__PURE__ */ e.jsx("div", { className: "px-3 py-2", children: ((s == null ? void 0 : s.log) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-2 text-[11.5px] text-text-tertiary", children: "Henüz senkron kaydı yok." }) : s.log.map((o) => {
          const i = ot[o.kind] ?? ot[0];
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
            /* @__PURE__ */ e.jsx("i", { className: k("fa mt-0.5 shrink-0 text-[11px]", i.icon, i.cls), "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[11.5px] leading-snug text-text-secondary", children: o.message }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: qe(o.occurredAt) })
          ] }, o.id);
        }) })
      ] })
    ] }) })
  ] }) });
}
const St = ["calendar", "preferences"];
function Ua() {
  return W({
    queryKey: St,
    queryFn: () => K.get("/api/app/calendar/preferences"),
    staleTime: 5 * 6e4
  });
}
function Qa() {
  const t = U();
  return L({
    /* ABP konvansiyonu: Update* metotları PUT'a düşer. POST 405 döner ve
       ayarlar SESSİZCE kaydedilmemiş olur. */
    mutationFn: (a) => K.put("/api/app/calendar/preferences", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: St }), t.invalidateQueries({ queryKey: ["calendar", "feed"] });
    }
  });
}
function Ha() {
  const t = U();
  return L({
    mutationFn: (a) => K.post("/api/app/calendar/bulk-reschedule", a),
    onSettled: () => t.invalidateQueries({ queryKey: ["calendar", "feed"] })
  });
}
function Wa({ open: t, items: a, today: s, capacity: r, onClose: l }) {
  const { suggestions: c, fixed: p } = g.useMemo(
    () => na(a, { today: s, capacity: r }),
    [a, s, r]
  ), [d, o] = g.useState(() => new Set(c.map((n) => n.item.key)));
  g.useEffect(() => {
    o(new Set(c.map((n) => n.item.key)));
  }, [c]);
  const i = Ha(), m = i.data ?? [], f = new Map(m.filter((n) => !n.succeeded).map((n) => [n.sourceId, n.error])), b = (n) => o((x) => {
    const v = new Set(x);
    return v.has(n) ? v.delete(n) : v.add(n), v;
  }), u = c.filter((n) => d.has(n.item.key)), h = () => {
    i.mutate(
      u.map((n) => ({
        source: n.item.source,
        sourceId: n.item.sourceId,
        newDate: E(n.date)
      })),
      {
        onSuccess: (n) => {
          (n ?? []).every((x) => x.succeeded) && l();
        }
      }
    );
  };
  return /* @__PURE__ */ e.jsx(ue, { open: t, onOpenChange: (n) => {
    n || l();
  }, children: /* @__PURE__ */ e.jsxs(xe, { side: "right", title: "Akıllı erteleme", className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-semibold text-text-primary", children: "Akıllı erteleme" }),
        /* @__PURE__ */ e.jsxs("p", { className: "mt-0.5 text-[11.5px] leading-snug text-text-tertiary", children: [
          c.length > 0 ? `${c.length} gecikmiş öğe için boş günlere dağıtılmış tarihler önerildi.` : "Ertelenecek gecikmiş öğe yok.",
          r ? ` Günlük kapasite ${C.hours(r)}.` : ""
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: l,
          "aria-label": "Kapat",
          className: "rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-2", children: [
      c.map(({ item: n, date: x }) => {
        const v = f.get(n.sourceId);
        return /* @__PURE__ */ e.jsxs(
          "label",
          {
            className: k(
              "flex cursor-pointer items-start gap-2.5 border-b border-subtle py-2.5 last:border-b-0",
              v && "bg-negative-50"
            ),
            children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: d.has(n.key),
                  onChange: () => b(n.key),
                  className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] font-semibold text-text-primary", children: n.title }),
                /* @__PURE__ */ e.jsxs("span", { className: "mt-0.5 flex items-center gap-1.5 text-[11px] text-text-tertiary", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "line-through", children: C.dayShort(/* @__PURE__ */ new Date(`${n.date.slice(0, 10)}T00:00:00`)) }),
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right text-[9px]", "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-accent", children: C.dayShort(x) }),
                  n.loadHours != null && /* @__PURE__ */ e.jsxs("span", { children: [
                    "· ",
                    C.hours(n.loadHours)
                  ] })
                ] }),
                v && /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] font-medium text-negative-700", children: v })
              ] })
            ]
          },
          n.key
        );
      }),
      p.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 border-t border-subtle pt-2", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Ertelenemez" }),
        p.map((n) => {
          var x;
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 py-1.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock mt-1 shrink-0 text-[10px] text-text-tertiary", "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] text-text-secondary", children: n.title }),
              /* @__PURE__ */ e.jsxs("span", { className: "block text-[11px] text-text-tertiary", children: [
                (x = O[n.source]) == null ? void 0 : x.label,
                " — vadesi takvimden değiştirilemez"
              ] })
            ] })
          ] }, n.key);
        })
      ] })
    ] }),
    c.length > 0 && /* @__PURE__ */ e.jsxs("footer", { className: "flex items-center gap-2 border-t border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsx(
        z,
        {
          size: "sm",
          variant: "primary",
          disabled: u.length === 0 || i.isPending,
          onClick: h,
          children: i.isPending ? "Erteleniyor…" : `${u.length} öğeyi ertele`
        }
      ),
      /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "ghost", onClick: l, children: "Vazgeç" })
    ] })
  ] }) });
}
const Va = [
  { value: 4, label: "4 sa" },
  { value: 6, label: "6 sa" },
  { value: 8, label: "8 sa" },
  { value: 0, label: "Kapalı" }
], ke = ["Kaynaklar", "Dış takvim", "Kurallar"];
function Xa({ open: t, counts: a, onDone: s }) {
  var u, h;
  const [r, l] = g.useState(0), [c, p] = g.useState(() => new Set(Pe)), [d, o] = g.useState(8), i = Qa(), m = Nt(), f = () => {
    i.mutate(
      {
        dailyCapacityHours: d > 0 ? d : 0,
        sources: [...c],
        setupCompleted: !0
      },
      /* onSettled DEĞİL: hata durumunda da kapanırsa ayarlar sessizce
         kaybolur ve kullanıcı kurulumu yaptığını sanır. */
      { onSuccess: s }
    );
  }, b = (n) => p((x) => {
    const v = new Set(x);
    return v.has(n) ? v.delete(n) : v.add(n), v;
  });
  return /* @__PURE__ */ e.jsx(pt, { open: t, onOpenChange: (n) => {
    n || s();
  }, children: /* @__PURE__ */ e.jsxs(bt, { className: "w-full max-w-[520px] p-0 h-auto max-h-[88dvh] tablet:min-h-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "shrink-0 border-b border-subtle px-5 py-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[18px] font-semibold tracking-tight text-text-primary", children: "Takviminizi kurun" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: "Hangi kaynakları göreceğinizi seçin, dilerseniz dış takvim bağlayın. Her ayarı sonradan değiştirebilirsiniz." }),
      /* @__PURE__ */ e.jsx("ol", { className: "mt-3 flex items-center gap-2", children: ke.map((n, x) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx("span", { className: k(
          "flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold",
          x === r ? "bg-accent text-white" : x < r ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
        ), children: x + 1 }),
        /* @__PURE__ */ e.jsx("span", { className: k(
          "text-[11.5px]",
          x === r ? "font-semibold text-text-primary" : "text-text-tertiary"
        ), children: n }),
        x < ke.length - 1 && /* @__PURE__ */ e.jsx("span", { className: "ms-1 text-text-tertiary", children: "·" })
      ] }, n)) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "min-h-0 overflow-y-auto px-5 py-4", children: [
      r === 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Takvimde ne görünsün?" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex flex-col gap-1.5", children: Pe.map((n) => {
          var D, $;
          const x = c.has(n), v = a == null ? void 0 : a[n];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": x,
              onClick: () => b(n),
              className: k(
                "flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                x ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: k("fa text-[12px]", (D = O[n]) == null ? void 0 : D.icon, x ? "text-accent" : "text-text-tertiary"), "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-medium text-text-primary", children: ($ = O[n]) == null ? void 0 : $.label }),
                v != null && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: v })
              ]
            },
            n
          );
        }) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-[13px] font-semibold text-text-primary", children: "Günlük kapasiteniz" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex gap-1.5", children: Va.map((n) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => o(n.value),
            className: k(
              "rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              d === n.value ? "border-accent bg-primary-subtle text-accent" : "border-subtle text-text-secondary hover:bg-surface-hover"
            ),
            children: n.label
          },
          n.value
        )) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] leading-snug text-text-tertiary", children: "Aşım uyarıları bu değere göre hesaplanır. Kapatırsanız kapasite çubukları görünmez." })
      ] }),
      r === 1 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Dış takvim bağlayın" }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: "Google veya Outlook bağlarsanız size atanan tarihli öğeler oraya etkinlik olarak yazılır. Bu adım isteğe bağlıdır — sonradan senkron ayarlarından bağlayabilirsiniz." }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex gap-2", children: [
          /* @__PURE__ */ e.jsxs(
            z,
            {
              size: "sm",
              variant: "outline",
              disabled: m.isPending,
              onClick: () => m.mutate(1),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fab fa-google me-1.5", "aria-hidden": "true" }),
                "Google bağla"
              ]
            }
          ),
          /* @__PURE__ */ e.jsxs(
            z,
            {
              size: "sm",
              variant: "outline",
              disabled: m.isPending,
              onClick: () => m.mutate(2),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fab fa-windows me-1.5", "aria-hidden": "true" }),
                "Outlook bağla"
              ]
            }
          )
        ] }),
        m.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "mt-2 text-[11.5px] text-negative-700", children: ((u = m.error) == null ? void 0 : u.message) || "Yetkilendirme adresi alınamadı." })
      ] }),
      r === 2 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Çakışma kuralı" }),
        /* @__PURE__ */ e.jsxs("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: [
          "İki taraf da düzenlenirse varsayılan olarak ",
          /* @__PURE__ */ e.jsx("strong", { className: "font-semibold", children: "son değişen kazanır" }),
          " ve ekranda geri alma şeridi çıkar. Hesap bağladığınızda bu kuralı senkron ayarlarından değiştirebilirsiniz."
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-3 text-[12px] text-text-secondary", children: "Kurulum tamam — takvim seçtiğiniz kaynaklarla açılacak." })
      ] })
    ] }),
    i.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "shrink-0 px-5 pb-3 text-[11px] text-negative-700", children: ((h = i.error) == null ? void 0 : h.message) || "Ayarlar kaydedilemedi, lütfen tekrar deneyin." }),
    /* @__PURE__ */ e.jsxs("footer", { className: "shrink-0 flex items-center gap-2 border-t border-subtle px-5 py-3", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary", children: [
        "Adım ",
        r + 1,
        " / ",
        ke.length
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1" }),
      /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "ghost", onClick: f, disabled: i.isPending, children: "Şimdilik atla" }),
      r < ke.length - 1 ? /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "primary", onClick: () => l((n) => n + 1), children: "Devam" }) : /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "primary", onClick: f, disabled: i.isPending, children: i.isPending ? "Kaydediliyor…" : "Bitir" })
    ] })
  ] }) });
}
const Ja = [
  {
    title: "Gezinme",
    rows: [
      { keys: ["←", "→"], label: "Gün değiştir" },
      { keys: ["↑", "↓"], label: "Hafta değiştir" },
      { keys: ["PgUp", "PgDn"], label: "Önceki / sonraki dönem" },
      { keys: ["T"], label: "Bugüne dön" },
      { keys: ["M", "W", "D", "A"], label: "Ay / Hafta / Gün / Ajanda" }
    ]
  },
  {
    title: "Eylem",
    rows: [
      { keys: ["Enter"], label: "Seçili günü aç" },
      { keys: ["⇧", "→"], label: "Seçili günün öğelerini 1 gün ertele" },
      { keys: ["⌘/Ctrl", "Z"], label: "Son değişikliği geri al" },
      { keys: ["?"], label: "Bu haritayı aç / kapat" },
      { keys: ["Esc"], label: "Açık paneli kapat" }
    ]
  }
];
function ct({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "rounded border border-strong bg-surface-raised px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-text-primary", children: t });
}
function Za({ open: t, onClose: a }) {
  return /* @__PURE__ */ e.jsx(pt, { open: t, onOpenChange: (s) => {
    s || a();
  }, children: /* @__PURE__ */ e.jsxs(bt, { className: "w-full max-w-[480px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-center justify-between border-b border-subtle px-5 py-3", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[15px] font-semibold text-text-primary", children: "Klavye kısayolları" }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: a,
          "aria-label": "Kapat",
          className: "rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-5 py-4", children: [
      Ja.map((s) => /* @__PURE__ */ e.jsxs("section", { className: "mb-4 last:mb-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: s.title }),
        s.rows.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center gap-1", children: r.keys.map((l) => /* @__PURE__ */ e.jsx(ct, { children: l }, l)) }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-secondary", children: r.label })
        ] }, r.label))
      ] }, s.title)),
      /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] leading-snug text-text-tertiary", children: [
        "Takvim ızgarası tek sekme durağıdır: ",
        /* @__PURE__ */ e.jsx(ct, { children: "Tab" }),
        " ile içine girin, sonra oklarla gezin. Sürükle-bırakla yapılan her taşıma buradaki kısayollarla da yapılabilir."
      ] })
    ] })
  ] }) });
}
function es({ polite: t, assertive: a }) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("p", { role: "status", "aria-live": "polite", className: "sr-only", children: t }),
    /* @__PURE__ */ e.jsx("p", { role: "alert", "aria-live": "assertive", className: "sr-only", children: a })
  ] });
}
const ts = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
function as({ items: t, month: a, today: s, generatedAt: r }) {
  var b;
  const l = gt(a), c = E(s), p = {};
  for (const u of t ?? [])
    (p[b = u.date.slice(0, 10)] ?? (p[b] = [])).push(u);
  const d = Me(s), o = (t ?? []).filter((u) => {
    const h = u.date.slice(0, 10);
    return h >= E(d) && h <= E(M(d, 7));
  }), { overdue: i, days: m } = kt(o, s), f = (u) => u === I.OVERDUE ? "border-l-[3px] border-l-black" : u === I.DUE_TODAY ? "border-l-[3px] border-l-neutral-500" : "border-l-[3px] border-l-neutral-300";
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-print-root hidden print:block", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-end justify-between border-b-2 border-black pb-2", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[8pt] font-bold uppercase tracking-widest text-neutral-500", children: "APYA · Takvim" }),
          /* @__PURE__ */ e.jsx("h1", { className: "mt-1 text-[22pt] font-semibold capitalize leading-none", children: C.monthTitle(a) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "text-right text-[8pt] text-neutral-500", children: [
          /* @__PURE__ */ e.jsx("p", { children: "Risk: kalın çizgi = gecikmiş · gri çizgi = bugün son gün" }),
          /* @__PURE__ */ e.jsxs("p", { children: [
            r,
            " tarihinde oluşturuldu · Sayfa 1 / 2"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "mt-3 grid grid-cols-7", children: ts.map((u) => /* @__PURE__ */ e.jsx("div", { className: "pb-1 text-[7.5pt] font-bold uppercase tracking-wide text-neutral-500", children: u }, u)) }),
      /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-l border-t border-neutral-300", children: l.map((u) => {
        const h = E(u), n = p[h] ?? [], x = u.getMonth() !== a.getMonth();
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: k(
              "min-h-[62px] border-b border-r border-neutral-300 p-1",
              h === c && "ring-1 ring-inset ring-black"
            ),
            children: [
              /* @__PURE__ */ e.jsx("p", { className: k(
                "text-right font-mono text-[9pt] font-semibold",
                x ? "text-neutral-300" : "text-neutral-700"
              ), children: u.getDate() }),
              n.slice(0, 4).map((v) => /* @__PURE__ */ e.jsx(
                "p",
                {
                  className: k(
                    "mt-0.5 truncate ps-1 text-[7.5pt] leading-tight",
                    f(v.risk),
                    v.risk === I.OVERDUE ? "font-semibold" : "font-normal",
                    v.isDone && "line-through"
                  ),
                  children: v.title
                },
                v.key
              )),
              n.length > 4 && /* @__PURE__ */ e.jsxs("p", { className: "mt-0.5 text-[7pt] text-neutral-500", children: [
                "+",
                n.length - 4,
                " öğe"
              ] })
            ]
          },
          h
        );
      }) })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page apya-print-break", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-end justify-between border-b-2 border-black pb-2", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[8pt] font-bold uppercase tracking-widest text-neutral-500", children: "APYA · Haftalık ajanda" }),
          /* @__PURE__ */ e.jsxs("h1", { className: "mt-1 text-[22pt] font-semibold leading-none", children: [
            C.dayShort(d),
            " – ",
            C.dayShort(M(d, 6))
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "text-right text-[8pt] text-neutral-500", children: [
          /* @__PURE__ */ e.jsx("p", { children: "Onay kutuları elle işaretlemek için · tamamlananlar listeye alınmadı" }),
          /* @__PURE__ */ e.jsxs("p", { children: [
            r,
            " tarihinde oluşturuldu · Sayfa 2 / 2"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-3 columns-2 gap-8", children: [
        i.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-4 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "border-b-2 border-black pb-1 text-[9pt] font-bold uppercase tracking-wide", children: [
            "Gecikmiş · ",
            i.length
          ] }),
          i.map((u) => /* @__PURE__ */ e.jsx(dt, { item: u, showDate: !0 }, u.key))
        ] }),
        m.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "mb-4 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "border-b border-black pb-1 text-[9pt] font-bold uppercase tracking-wide", children: [
            C.dayTitle(u.date),
            u.isToday ? " · Bugün" : ""
          ] }),
          u.items.map((h) => /* @__PURE__ */ e.jsx(dt, { item: h }, h.key))
        ] }, u.key))
      ] })
    ] })
  ] });
}
function dt({ item: t, showDate: a = !1 }) {
  const s = O[t.source];
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-neutral-200 py-1", children: [
    /* @__PURE__ */ e.jsx("span", { className: "mt-[3px] h-[9px] w-[9px] shrink-0 border border-neutral-600", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ e.jsx("span", { className: k("block text-[9pt] leading-tight", t.risk === I.OVERDUE && "font-semibold"), children: t.title }),
      /* @__PURE__ */ e.jsx("span", { className: "block text-[7.5pt] text-neutral-500", children: [
        a ? C.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
        s == null ? void 0 : s.label,
        t.subtitle,
        t.amount != null ? C.money(t.amount, t.currency) : null
      ].filter(Boolean).join(" · ") })
    ] })
  ] });
}
function ss({ rows: t, days: a, capacity: s, loading: r }) {
  if (r)
    return /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1.5 text-[11.5px] text-text-tertiary", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "ekip yükü hesaplanıyor…"
    ] });
  if (!t || t.length === 0)
    return /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1.5 text-[11.5px] text-text-tertiary", children: "Bu aralıkta atanmış açık görev yok." });
  const l = (a ?? []).map(E);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 px-2 pb-1", children: [
    t.map((c) => {
      const p = {};
      for (const d of c.days ?? []) p[d.date.slice(0, 10)] = d;
      return /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "truncate text-[11.5px] font-medium text-text-primary", children: c.name }),
          /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] tabular-nums text-text-tertiary", children: C.hours(c.totalHours) })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-0.5 flex gap-[2px]", children: (l.length ? l : (c.days ?? []).map((d) => d.date.slice(0, 10))).map((d) => {
          const o = p[d], i = (o == null ? void 0 : o.hours) ?? 0, m = s && i > s, f = s ? Math.min(i / s, 1) : i > 0 ? 1 : 0;
          return /* @__PURE__ */ e.jsx(
            "span",
            {
              title: `${d}: ${C.hours(i)}${o != null && o.itemCount ? ` · ${o.itemCount} öğe` : ""}`,
              className: "h-[6px] flex-1 overflow-hidden rounded-sm bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: k("block h-full", m ? "bg-negative" : "bg-accent"),
                  style: { width: `${f * 100}%` }
                }
              )
            },
            d
          );
        }) })
      ] }, c.userId);
    }),
    /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[10.5px] leading-snug text-text-tertiary", children: "Yalnız görebildiğiniz projelerin görevleri sayılır." })
  ] });
}
const rs = 6e4;
function ns({ from: t, to: a }) {
  const s = E(t), r = E(a);
  return W({
    queryKey: ["calendar", "feed", s, r],
    queryFn: () => K.get(`/api/app/calendar/feed?From=${s}&To=${r}`),
    staleTime: rs,
    placeholderData: (l) => l
    /* ay geçişinde boş ekran yerine eski veri */
  });
}
const Dt = "apya.calendar.view", Fe = "apya.calendar.sources", we = ["month", "week", "day", "agenda"];
function Ct(t) {
  try {
    return window.localStorage.getItem(t);
  } catch {
    return null;
  }
}
function Ae(t, a) {
  try {
    window.localStorage.setItem(t, a);
  } catch {
  }
}
function is() {
  const t = new URLSearchParams(window.location.search).get("view");
  if (we.includes(t)) return t;
  const a = Ct(Dt);
  return we.includes(a) ? a : null;
}
function ls() {
  const t = Ct(Fe);
  if (!t) return new Set(de);
  const a = t.split(",").map(Number).filter((s) => de.includes(s));
  return a.length ? new Set(a) : new Set(de);
}
function os({ defaultView: t = "month" } = {}) {
  const [a] = g.useState(is), [s, r] = g.useState(() => a ?? t), [l, c] = g.useState(ls);
  g.useEffect(() => {
    const m = new URL(window.location.href);
    m.searchParams.get("view") !== s && (m.searchParams.set("view", s), window.history.replaceState({}, "", m));
  }, [s]);
  const p = g.useCallback((m) => {
    we.includes(m) && (r(m), Ae(Dt, m));
  }, []), d = g.useCallback((m) => {
    c((f) => {
      const b = new Set(f);
      return b.has(m) ? b.delete(m) : b.add(m), Ae(Fe, [...b].join(",")), b;
    });
  }, []), o = g.useCallback((m) => {
    a || we.includes(m) && r((f) => f === m ? f : m);
  }, [a]), i = g.useCallback(() => {
    const m = new Set(de);
    c(m), Ae(Fe, [...m].join(","));
  }, []);
  return { view: s, setView: p, applyResponsiveDefault: o, enabledSources: l, toggleSource: d, resetSources: i };
}
const H = ["calendar", "feed"];
function cs(t, a, s) {
  t.setQueriesData({ queryKey: H }, (r) => r != null && r.items ? {
    ...r,
    items: r.items.map((l) => l.key === a ? { ...l, date: `${s}T00:00:00` } : l)
  } : r);
}
function ds(t, a) {
  t.setQueriesData({ queryKey: H }, (s) => s != null && s.items ? {
    ...s,
    items: s.items.map((r) => r.key === a ? { ...r, isDone: !0, risk: 0, loadHours: null } : r)
  } : s);
}
function us({ onOfflineFailure: t } = {}) {
  const a = U(), [s, r] = g.useState(null), [l, c] = g.useState({}), [p, d] = g.useState({}), o = g.useRef({}), i = g.useCallback((b) => {
    delete o.current[b], c((u) => {
      if (!u[b]) return u;
      const h = { ...u };
      return delete h[b], h;
    });
  }, []), m = L({
    mutationFn: ({ item: b, newDate: u }) => K.post("/api/app/calendar/reschedule-item", {
      source: b.source,
      sourceId: b.sourceId,
      newDate: E(u)
    }),
    onMutate: async ({ item: b, newDate: u }) => {
      await a.cancelQueries({ queryKey: H });
      const h = a.getQueriesData({ queryKey: H });
      return i(b.key), d((n) => ({ ...n, [b.key]: !0 })), cs(a, b.key, E(u)), { snapshot: h, previousDate: b.date.slice(0, 10) };
    },
    onError: (b, { item: u, newDate: h }, n) => {
      var x;
      if (typeof navigator < "u" && !navigator.onLine) {
        t == null || t({
          key: u.key,
          payload: { source: u.source, sourceId: u.sourceId, newDate: E(h) }
        });
        return;
      }
      (x = n == null ? void 0 : n.snapshot) == null || x.forEach(([v, D]) => a.setQueryData(v, D)), o.current[u.key] = { item: u, newDate: h }, c((v) => ({
        ...v,
        [u.key]: (b == null ? void 0 : b.message) || "Kaydedilemedi — tarih değişmedi."
      }));
    },
    onSuccess: (b, { item: u, newDate: h }, n) => {
      nt(), r({
        key: u.key,
        message: `“${u.title}” ${E(h)} tarihine taşındı.`,
        undo: () => m.mutate({
          item: { ...u, date: `${E(h)}T00:00:00` },
          newDate: /* @__PURE__ */ new Date(`${n.previousDate}T00:00:00`)
        })
      });
    },
    onSettled: (b, u, { item: h }) => {
      d((n) => {
        const x = { ...n };
        return delete x[h.key], x;
      }), a.invalidateQueries({ queryKey: H });
    }
  }), f = L({
    mutationFn: ({ item: b }) => K.post("/api/app/calendar/complete-item", {
      source: b.source,
      sourceId: b.sourceId
    }),
    onMutate: async ({ item: b }) => {
      await a.cancelQueries({ queryKey: H });
      const u = a.getQueriesData({ queryKey: H });
      return i(b.key), d((h) => ({ ...h, [b.key]: !0 })), ds(a, b.key), { snapshot: u };
    },
    onError: (b, { item: u }, h) => {
      var n;
      (n = h == null ? void 0 : h.snapshot) == null || n.forEach(([x, v]) => a.setQueryData(x, v)), o.current[u.key] = { item: u }, c((x) => ({
        ...x,
        [u.key]: (b == null ? void 0 : b.message) || "Tamamlanamadı."
      }));
    },
    onSuccess: (b, { item: u }) => {
      nt(), r({ key: u.key, message: `“${u.title}” tamamlandı.`, undo: null });
    },
    onSettled: (b, u, { item: h }) => {
      d((n) => {
        const x = { ...n };
        return delete x[h.key], x;
      }), a.invalidateQueries({ queryKey: H });
    }
  });
  return {
    reschedule: (b, u) => m.mutate({ item: b, newDate: u }),
    complete: (b) => f.mutate({ item: b }),
    retry: (b, u) => u ? m.mutate({ item: b, newDate: u }) : f.mutate({ item: b }),
    /** Reddedilen son işlemi aynen yineler; kayıt yoksa yalnız hata şeridini kapatır. */
    retryFailed: (b) => {
      const u = o.current[b];
      if (!u) {
        i(b);
        return;
      }
      u.newDate ? m.mutate({ item: u.item, newDate: u.newDate }) : f.mutate({ item: u.item });
    },
    lastAction: s,
    dismissAction: () => r(null),
    errors: l,
    clearError: i,
    pending: p
  };
}
function xs({ from: t, to: a, enabled: s = !0 }) {
  const r = E(t), l = E(a);
  return W({
    queryKey: ["calendar", "external", r, l],
    queryFn: () => K.get(`/api/app/calendar/external-events?From=${r}&To=${l}`),
    enabled: s,
    staleTime: 12e4,
    retry: !1,
    placeholderData: (c) => c
  });
}
const ms = ["INPUT", "TEXTAREA", "SELECT"];
function ps({
  onView: t,
  onToday: a,
  onPrev: s,
  onNext: r,
  onDeferSelected: l,
  onUndo: c,
  onToggleHelp: p,
  enabled: d = !0
}) {
  g.useEffect(() => {
    if (!d) return;
    const o = (i) => {
      const m = i.target;
      if (!(ms.includes(m == null ? void 0 : m.tagName) || m != null && m.isContentEditable)) {
        if ((i.metaKey || i.ctrlKey) && i.key.toLowerCase() === "z") {
          i.preventDefault(), c == null || c();
          return;
        }
        if (!(i.metaKey || i.ctrlKey || i.altKey)) {
          if (i.shiftKey) {
            i.key === "ArrowRight" && (i.preventDefault(), l == null || l(1)), i.key === "ArrowLeft" && (i.preventDefault(), l == null || l(-1)), i.key === "?" && (i.preventDefault(), p == null || p());
            return;
          }
          switch (i.key) {
            case "?":
              i.preventDefault(), p == null || p();
              break;
            case "t":
            case "T":
              i.preventDefault(), a == null || a();
              break;
            case "m":
            case "M":
              i.preventDefault(), t == null || t("month");
              break;
            case "w":
            case "W":
              i.preventDefault(), t == null || t("week");
              break;
            case "d":
            case "D":
              i.preventDefault(), t == null || t("day");
              break;
            case "a":
            case "A":
              i.preventDefault(), t == null || t("agenda");
              break;
            case "PageUp":
              i.preventDefault(), s == null || s();
              break;
            case "PageDown":
              i.preventDefault(), r == null || r();
              break;
          }
        }
      }
    };
    return window.addEventListener("keydown", o), () => window.removeEventListener("keydown", o);
  }, [d, t, a, s, r, l, c, p]);
}
function bs({ from: t, to: a, enabled: s }) {
  const r = E(t), l = E(a);
  return W({
    queryKey: ["calendar", "team-load", r, l],
    queryFn: () => K.get(`/api/app/calendar/team-load?From=${r}&To=${l}`),
    enabled: s,
    staleTime: 6e4
  });
}
const Tt = () => Ht("apya.calendar.offlineQueue");
function Ke() {
  try {
    const t = window.localStorage.getItem(Tt()), a = t ? JSON.parse(t) : [];
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}
function ut(t) {
  try {
    window.localStorage.setItem(Tt(), JSON.stringify(t));
  } catch {
  }
}
function fs({ onFlush: t }) {
  const [a, s] = g.useState(() => typeof navigator > "u" ? !0 : navigator.onLine), [r, l] = g.useState(() => Ke().length), c = g.useRef(!1), p = g.useCallback((o) => {
    const m = Ke().filter((f) => f.key !== o.key).concat(o);
    ut(m), l(m.length);
  }, []), d = g.useCallback(async () => {
    if (c.current) return;
    const o = Ke();
    if (o.length !== 0) {
      c.current = !0;
      try {
        const i = [];
        for (const m of o)
          try {
            await t(m);
          } catch (f) {
            Qt(f) || i.push(m);
          }
        ut(i), l(i.length);
      } finally {
        c.current = !1;
      }
    }
  }, [t]);
  return g.useEffect(() => {
    const o = () => {
      s(!0), d();
    }, i = () => s(!1);
    return window.addEventListener("online", o), window.addEventListener("offline", i), navigator.onLine && d(), () => {
      window.removeEventListener("online", o), window.removeEventListener("offline", i);
    };
  }, [d]), { isOnline: a, pendingCount: r, enqueue: p, flush: d };
}
function hs() {
  const t = g.useRef(null), [a, s] = g.useState(0);
  return g.useLayoutEffect(() => {
    const r = t.current;
    if (!r || (s(r.getBoundingClientRect().width), typeof ResizeObserver > "u")) return;
    const l = new ResizeObserver((c) => {
      for (const p of c)
        s(p.contentRect.width);
    });
    return l.observe(r), () => l.disconnect();
  }, []), [t, a];
}
function gs(t) {
  return t === 0 || t >= 1180 ? "wide" : t >= 780 ? "medium" : "narrow";
}
const ys = 60;
function ve(t, a, s) {
  return a === "week" ? M(t, 7 * s) : a === "day" ? M(t, s) : new Date(t.getFullYear(), t.getMonth() + s, 1);
}
function ks() {
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Array.from({ length: 7 }, (t, a) => /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-2", children: /* @__PURE__ */ e.jsx(ce, { height: 10 }) }, a)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: Array.from({ length: Le }, (t, a) => /* @__PURE__ */ e.jsxs("div", { className: "min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0", children: [
      /* @__PURE__ */ e.jsx(ce, { height: 12, width: "40%", className: "ml-auto" }),
      a % 3 === 0 && /* @__PURE__ */ e.jsx(ce, { height: 14, className: "mt-2" })
    ] }, a)) })
  ] });
}
function vs() {
  var Xe, ge, Je, Ze, et, tt, at, st;
  const [t, a] = hs(), s = gs(a), r = s === "narrow", l = g.useMemo(() => Ie(/* @__PURE__ */ new Date()), []), [c, p] = g.useState(l), [d, o] = g.useState(null), [i, m] = g.useState(null), [f, b] = g.useState(!1), [u, h] = g.useState(!1), [n, x] = g.useState(!1), [v, D] = g.useState(!1), [$, j] = g.useState(null), [w, A] = g.useState(!1), { view: S, setView: N, applyResponsiveDefault: F, enabledSources: V, toggleSource: De, resetSources: X } = os();
  g.useEffect(() => {
    a !== 0 && F(r ? "agenda" : "month");
  }, [a, r, F]);
  const { range: B, title: ne, weekDayList: te } = g.useMemo(() => {
    if (S === "agenda")
      return {
        range: { from: M(l, -60), to: M(l, ys) },
        title: "Ajanda",
        weekDayList: null
      };
    if (S === "week") {
      const R = aa(c);
      return {
        range: { from: R[0], to: R[6] },
        title: `${C.dayShort(R[0])} – ${C.dayShort(R[6])} ${R[6].getFullYear()}`,
        weekDayList: R
      };
    }
    if (S === "day") {
      const R = Ie(c);
      return { range: { from: R, to: R }, title: C.dayTitle(R), weekDayList: [R] };
    }
    const y = ht(c);
    return {
      range: { from: y, to: M(y, Le - 1) },
      title: C.monthTitle(c),
      weekDayList: null
    };
  }, [S, c, l]), { data: T, error: J, isPending: ae, isError: _e, isFetching: Et, isPlaceholderData: $t, refetch: Ge } = ns(B), me = _e && !T, Ce = `${E(B.from)}/${E(B.to)}`, [pe, Ye] = g.useState(null), se = (pe == null ? void 0 : pe.feedKey) === Ce, Rt = () => {
    Ye({ feedKey: Ce, error: J }), Ge().finally(() => Ye((y) => (y == null ? void 0 : y.feedKey) === Ce ? null : y));
  }, Ue = g.useId(), _ = xs(B), Qe = Ua(), Te = bs({ from: B.from, to: B.to, enabled: w });
  Ut();
  const q = fs({
    onFlush: (y) => K.post("/api/app/calendar/reschedule-item", y.payload)
  }), be = g.useMemo(
    () => {
      var y;
      return [...(T == null ? void 0 : T.items) ?? [], ...((y = _.data) == null ? void 0 : y.items) ?? []];
    },
    [T, _.data]
  ), Q = g.useMemo(
    () => be.filter((y) => V.has(y.source)),
    [be, V]
  ), G = g.useMemo(() => yt(Q), [Q]), Y = (T == null ? void 0 : T.dailyCapacityHours) ?? null, He = g.useMemo(() => {
    const y = {};
    for (const R of (T == null ? void 0 : T.sources) ?? []) y[R.source] = R.count;
    return y;
  }, [T]), zt = g.useMemo(() => Y ? Object.values(G).filter((y) => Se(y) > Y).length : 0, [G, Y]), We = g.useMemo(() => {
    var rt;
    let y = 0, R = 0;
    for (const le of Q)
      le.isDone || (le.risk === I.OVERDUE ? y++ : le.risk === I.DUE_TODAY && R++);
    const Z = (((rt = _.data) == null ? void 0 : rt.accounts) ?? []).filter((le) => le.error).length;
    return { overdue: y, dueToday: R, syncError: Z };
  }, [Q, _.data]), Ee = g.useMemo(
    () => ((T == null ? void 0 : T.sources) ?? []).filter((y) => y.isAvailable),
    [T]
  ), At = g.useMemo(
    () => Ee.filter((y) => !V.has(y.source)).length,
    [Ee, V]
  ), Kt = g.useMemo(() => {
    var R;
    const y = (((R = _.data) == null ? void 0 : R.accounts) ?? []).map((Z) => Z.lastSyncTime).filter(Boolean).sort();
    return y.length ? y[y.length - 1] : null;
  }, [_.data]);
  g.useEffect(() => {
    d && !G[d] && !ae && (d >= E(B.from) && d <= E(B.to) || o(null));
  }, [d, G, ae, B]);
  const fe = g.useCallback((y) => m(y.key), []), Ve = g.useCallback(() => {
    p(l), o(E(l));
  }, [l]), P = us({ onOfflineFailure: q.enqueue }), he = !!((Je = (ge = (Xe = window.abp) == null ? void 0 : Xe.auth) == null ? void 0 : ge.isGranted) != null && Je.call(ge, "Platform.Tasks.Create")), Pt = g.useCallback((y) => {
    const R = $ ?? d;
    if (R)
      for (const Z of G[R] ?? [])
        Z.canReschedule && !Z.isDone && P.reschedule(Z, M(/* @__PURE__ */ new Date("T00:00:00"), y));
  }, [$, d, G, P]);
  ps({
    onView: N,
    onToday: Ve,
    onPrev: () => p((y) => ve(y, S, -1)),
    onNext: () => p((y) => ve(y, S, 1)),
    onDeferSelected: Pt,
    onUndo: () => {
      var y, R;
      return (R = (y = P.lastAction) == null ? void 0 : y.undo) == null ? void 0 : R.call(y);
    },
    onToggleHelp: () => D((y) => !y)
  });
  const $e = be.length > 0, It = $e && Q.length === 0, Ot = d ? G[d] ?? [] : [], ie = i ? be.find((y) => y.key === i) ?? null : null, Re = d && /* @__PURE__ */ e.jsx(
    oa,
    {
      dayKey: d,
      items: Ot,
      capacity: Y,
      onSelectItem: fe,
      onClose: () => o(null)
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { ref: t, className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsx(
      va,
      {
        title: ne,
        view: S,
        onView: N,
        onPrev: () => p((y) => ve(y, S, -1)),
        onNext: () => p((y) => ve(y, S, 1)),
        onToday: Ve,
        overloadDays: zt,
        onHelp: () => D(!0),
        filterCount: At,
        onClearFilters: X,
        lastSyncAt: Kt,
        syncError: We.syncError > 0,
        compact: r,
        canCreateTask: he
      }
    ),
    _e && !me && !Mt(J) && /* @__PURE__ */ e.jsxs("div", { role: "alert", className: "flex flex-wrap items-center gap-2 rounded-card border border-negative-100 bg-negative-50 px-3 py-2 text-[12.5px] text-negative-700", children: [
      /* @__PURE__ */ e.jsx("span", { id: Ue, className: "min-w-0 flex-1", children: "Takvim yenilenemedi; son yüklenen veriler gösteriliyor." }),
      /* @__PURE__ */ e.jsx(mt, { onRetry: Ge, retrying: Et, "aria-describedby": Ue })
    ] }),
    (!q.isOnline || q.pendingCount > 0) && /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        className: "flex items-center gap-2 rounded-card border border-warning-100 bg-warning-50 px-3 py-2 text-[12.5px] text-warning-700",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: k("fa", q.isOnline ? "fa-cloud-arrow-up" : "fa-wifi"), "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: q.isOnline ? `${q.pendingCount} değişiklik gönderiliyor…` : `Çevrimdışısınız — ${q.pendingCount} değişiklik kuyrukta, bağlantı gelince gönderilecek.` }),
          q.isOnline && q.pendingCount > 0 && /* @__PURE__ */ e.jsx("button", { type: "button", onClick: q.flush, className: "font-semibold underline", children: "Şimdi gönder" })
        ]
      }
    ),
    P.lastAction && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "flex items-center gap-2 rounded-card border border-subtle bg-surface-raised px-3 py-2 text-[12.5px] text-text-secondary",
        role: "status",
        "aria-live": "polite",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left text-text-tertiary", "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 truncate", children: P.lastAction.message }),
          P.lastAction.undo && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                P.lastAction.undo(), P.dismissAction();
              },
              className: "font-semibold text-text-link hover:underline",
              children: "Geri al"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: P.dismissAction,
              "aria-label": "Şeridi kapat",
              className: "rounded p-1 text-text-tertiary hover:bg-surface-hover",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: k("flex gap-3", r ? "flex-col" : "flex-row items-start"), children: [
      !r && !se && (ae || Ee.length > 0) && /* @__PURE__ */ e.jsx("div", { className: k("shrink-0", s === "wide" ? "w-[240px]" : "w-auto"), children: /* @__PURE__ */ e.jsx(
        ha,
        {
          sources: (T == null ? void 0 : T.sources) ?? [],
          counts: He,
          enabled: V,
          onToggle: De,
          compact: s !== "wide",
          externalAccounts: ((Ze = _.data) == null ? void 0 : Ze.accounts) ?? [],
          externalLoading: _.isFetching,
          onOpenSync: () => b(!0),
          teamOpen: w,
          onToggleTeam: () => A((y) => !y),
          teamContent: w ? /* @__PURE__ */ e.jsx(
            ss,
            {
              rows: Te.data,
              days: te,
              capacity: Y,
              loading: Te.isPending
            }
          ) : null,
          teamMembers: Te.data ?? [],
          riskCounts: We
        }
      ) }),
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        !ae && !me && !$t && !$e && S !== "agenda" && /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "status",
            className: "mb-2 flex items-center gap-2 rounded-card border border-subtle bg-surface-raised px-3 py-2 text-[12.5px] text-text-secondary",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus text-text-tertiary", "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1", children: "Bu aralıkta planlanmış bir şey yok." }),
              he && /* @__PURE__ */ e.jsx("button", { type: "button", onClick: Ne, className: "font-semibold text-text-link hover:underline", children: "Görev oluştur" })
            ]
          }
        ),
        ae && !se ? /* @__PURE__ */ e.jsx(ks, {}) : me || se ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
          re,
          {
            variant: "error",
            title: "Takvim yüklenemedi",
            error: se ? pe.error : J,
            onRetry: Rt,
            retrying: se
          }
        ) }) : It ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
          re,
          {
            icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-filter-circle-xmark" }),
            title: "Bu filtreyle gösterilecek öğe yok",
            description: "Kaynak rayında kapattığınız türler bu aralıktaki tüm öğeleri gizliyor.",
            action: /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "outline", onClick: X, children: "Kaynakları aç" })
          }
        ) }) : !$e && S === "agenda" ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
          re,
          {
            icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
            title: "Bu aralıkta planlanmış bir şey yok",
            description: "Son tarihi olan görevler, fatura vadeleri, hibe son tarihleri ve tarihli finans kayıtları burada birlikte görünür.",
            action: he ? /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "outline", onClick: Ne, children: "Görev oluştur" }) : null
          }
        ) }) : S === "month" ? /* @__PURE__ */ e.jsx(
          pa,
          {
            month: c,
            byDay: G,
            today: l,
            capacity: Y,
            selectedDay: d,
            onSelectItem: fe,
            onSelectDay: o,
            onDropItem: P.reschedule,
            focusedDay: $,
            onFocusDay: j,
            onNavigate: (y) => p(y),
            pending: P.pending,
            errors: P.errors
          }
        ) : te ? /* @__PURE__ */ e.jsx(
          Sa,
          {
            days: te,
            byDay: G,
            today: l,
            capacity: Y,
            selectedDay: d,
            onSelectItem: fe,
            onSelectDay: o
          }
        ) : /* @__PURE__ */ e.jsx(
          la,
          {
            items: Q,
            today: l,
            onSelectItem: fe,
            onSmartDefer: () => h(!0)
          }
        ),
        !ae && !me && !se && S !== "agenda" && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[10.5px] text-text-tertiary", children: [
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ e.jsx("span", { className: "h-[3px] w-[18px] rounded-full bg-primary-subtle", "aria-hidden": "true" }),
            "gün yükü"
          ] }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ e.jsx("span", { className: "h-[3px] w-[18px] rounded-full bg-negative", "aria-hidden": "true" }),
            "kapasite aşımı"
          ] }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: "h-[8px] w-[18px] rounded-[3px] border border-dashed border-accent bg-primary-subtle",
                "aria-hidden": "true"
              }
            ),
            "önerilen yeni tarih"
          ] })
        ] })
      ] }),
      s === "wide" && d && /* @__PURE__ */ e.jsx("div", { className: "w-[340px] shrink-0 self-stretch", children: Re })
    ] }),
    s === "medium" && d && /* @__PURE__ */ e.jsx(ue, { open: !0, onOpenChange: (y) => {
      y || o(null);
    }, children: /* @__PURE__ */ e.jsx(xe, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: Re }) }),
    r && d && /* @__PURE__ */ e.jsx(ue, { open: !0, onOpenChange: (y) => {
      y || o(null);
    }, children: /* @__PURE__ */ e.jsx(xe, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: Re }) }),
    r && he && /* @__PURE__ */ e.jsx(ka, {}),
    /* @__PURE__ */ e.jsx(
      as,
      {
        items: Q,
        month: c,
        today: l,
        generatedAt: C.dayShort(l)
      }
    ),
    /* @__PURE__ */ e.jsx(Za, { open: v, onClose: () => D(!1) }),
    /* @__PURE__ */ e.jsx(
      es,
      {
        polite: ((et = P.lastAction) == null ? void 0 : et.message) ?? "",
        assertive: ((st = (at = (tt = _.data) == null ? void 0 : tt.accounts) == null ? void 0 : at.find((y) => y.error)) == null ? void 0 : st.error) ?? ""
      }
    ),
    /* @__PURE__ */ e.jsx(Ya, { open: f, onClose: () => b(!1) }),
    /* @__PURE__ */ e.jsx(
      Wa,
      {
        open: u,
        items: Q,
        today: l,
        capacity: Y,
        onClose: () => h(!1)
      }
    ),
    /* @__PURE__ */ e.jsx(
      Xa,
      {
        open: Qe.data ? !Qe.data.setupCompleted && !n : !1,
        counts: He,
        onDone: () => x(!0)
      }
    ),
    ie && /* @__PURE__ */ e.jsx(
      Ta,
      {
        item: ie,
        capacity: Y,
        onClose: () => m(null),
        onReschedule: P.reschedule,
        onComplete: P.complete,
        isPending: !!P.pending[ie.key],
        error: P.errors[ie.key],
        onRetry: () => P.retryFailed(ie.key)
      }
    )
  ] });
}
const xt = document.getElementById("apya-calendar-root");
xt && Lt(
  xt,
  "calendar",
  /* @__PURE__ */ e.jsx(Bt, { children: /* @__PURE__ */ e.jsx(qt, { children: /* @__PURE__ */ e.jsx(_t, { children: /* @__PURE__ */ e.jsx(vs, {}) }) }) })
);
