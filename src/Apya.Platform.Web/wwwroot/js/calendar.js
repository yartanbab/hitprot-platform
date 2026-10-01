import { j as e, b as ye, r as g } from "./react-vendor-D7YDiBbi.js";
import { E as re, R as mt, w as Ft, m as Mt } from "./index-DgpuJ91w.js";
import { c as v, B as z, b as ue, d as xe, S as ce, D as pt, h as ft, T as Lt } from "./Dialog-BEQtx1HL.js";
import { D as Bt } from "./useDeviceMode-Bkxjujsr.js";
import { a as qt } from "./QueryProvider-D2Hvqdr9.js";
import { a as A } from "./httpClient-BNoyY5yK.js";
import { d as _t } from "./draggableActivation-Ybw9Upbh.js";
import { u as W, b as L, a as U } from "./query-vendor-Db2mwxYI.js";
import { e as Gt, m as nt, u as Yt } from "./dataChanged-CDwwWMH8.js";
import { i as Ut, s as Qt } from "./permanentRejection-SvaBclz0.js";
const O = {
  1: { key: "task", label: "Görev", plural: "görev", icon: "fa-circle-check", railLabel: "Görevler" },
  2: { key: "invoice", label: "Fatura", plural: "fatura", icon: "fa-file-invoice", railLabel: "Faturalar" },
  3: { key: "grant", label: "Hibe", plural: "hibe", icon: "fa-award", railLabel: "Hibe son tarihleri" },
  4: { key: "expense", label: "Gider", plural: "gider", icon: "fa-arrow-trend-down", railLabel: "Gider / gelir" },
  5: { key: "income", label: "Gelir", plural: "gelir", icon: "fa-arrow-trend-up", railLabel: "Gider / gelir" },
  6: { key: "cash", label: "Kasa hareketi", plural: "kasa hareketi", icon: "fa-wallet", railLabel: "Nakit hareketleri" },
  7: { key: "external", label: "Dış etkinlik", plural: "dış etkinlik", icon: "fa-calendar-days", railLabel: "Dış etkinlikler" }
}, de = [1, 2, 3, 4, 5, 6, 7], Ht = [
  { key: "task", sources: [1] },
  { key: "invoice", sources: [2] },
  { key: "grant", sources: [3] },
  { key: "money", sources: [4, 5] },
  { key: "cash", sources: [6] }
], Pe = [1, 2, 3, 4, 5, 6], I = { DUE_TODAY: 1, OVERDUE: 2 }, Wt = (t) => t.risk === I.OVERDUE || t.risk === I.DUE_TODAY, bt = 864e5, Ie = (t) => new Date(t.getFullYear(), t.getMonth(), t.getDate()), M = (t, a) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + a);
function $(t) {
  const a = (s) => (s < 10 ? "0" : "") + s;
  return `${t.getFullYear()}-${a(t.getMonth() + 1)}-${a(t.getDate())}`;
}
function Me(t) {
  const a = (t.getDay() + 6) % 7;
  return new Date(t.getTime() - a * bt);
}
const ht = (t) => Me(new Date(t.getFullYear(), t.getMonth(), 1)), Le = 42;
function gt(t) {
  const a = ht(t);
  return Array.from({ length: Le }, (s, r) => new Date(a.getTime() + r * bt));
}
const Vt = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }), Xt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }), Jt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }), D = {
  monthTitle: (t) => Vt.format(t),
  dayTitle: (t) => Xt.format(t),
  dayShort: (t) => Jt.format(t),
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
function Zt(t, { maxPills: a = 3, maxRiskPills: s = 2 } = {}) {
  const r = t ?? [];
  if (r.length === 0) return { pills: [], summaries: [] };
  if (r.length <= a) return { pills: r, summaries: [] };
  const d = r.filter(Wt).slice(0, s), m = new Set(d.map((i) => i.key)), o = /* @__PURE__ */ new Map();
  for (const i of r) {
    if (m.has(i.key)) continue;
    const x = o.get(i.source) ?? { source: i.source, count: 0, amount: 0, hasAmount: !1, only: null };
    x.count += 1, x.only = x.count === 1 ? i : null, i.amount != null && (x.amount += i.amount, x.hasAmount = !0), o.set(i.source, x);
  }
  const c = [];
  for (const i of de) {
    const x = o.get(i);
    x && (x.count === 1 && x.only ? d.push(x.only) : c.push(x));
  }
  return { pills: d, summaries: c };
}
function ea(t, { compact: a = !0 } = {}) {
  const s = O[t.source], r = `${t.count} ${s ? s.plural : "öğe"}`;
  if (!t.hasAmount) return r;
  const l = a ? D.moneyCompact(t.amount) : D.money(t.amount);
  return `${r} · ${l}`;
}
function kt(t, a) {
  const s = $(a), r = (t ?? []).filter((c) => !c.isDone), l = r.filter((c) => c.date.slice(0, 10) < s && c.risk === I.OVERDUE), d = r.filter((c) => c.date.slice(0, 10) >= s), m = yt(d), o = Object.keys(m).sort().map((c) => ({
    key: c,
    date: /* @__PURE__ */ new Date(`${c}T00:00:00`),
    isToday: c === s,
    items: m[c]
  }));
  return { overdue: l, days: o };
}
function ta(t) {
  const a = Me(Ie(t));
  return Array.from({ length: 7 }, (s, r) => M(a, r));
}
const aa = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }), ze = (t) => t ? aa.format(new Date(t)) : "";
function je(t) {
  const a = new Date(t);
  return a.getHours() * 60 + a.getMinutes();
}
function sa(t) {
  let a = 8, s = 18;
  for (const r of t ?? [])
    r.startTime && (a = Math.min(a, Math.floor(je(r.startTime) / 60)), s = Math.max(s, Math.ceil(je(r.endTime ?? r.startTime) / 60)));
  return { start: Math.max(0, a), end: Math.min(24, Math.max(s, a + 4)) };
}
const it = (t) => !!t.startTime, lt = (t) => t.getDay() === 0 || t.getDay() === 6;
function ra(t, { today: a, capacity: s = null, horizonDays: r = 21, fallbackPerDay: l = 3 } = {}) {
  const d = $(a), m = (t ?? []).filter((h) => !h.isDone), o = m.filter((h) => h.date.slice(0, 10) < d && h.risk === I.OVERDUE), c = o.filter((h) => h.canReschedule), i = o.filter((h) => !h.canReschedule), x = {}, b = {};
  for (const h of m) {
    const n = h.date.slice(0, 10);
    n < d || (x[n] = (x[n] ?? 0) + (h.loadHours ?? 0), b[n] = (b[n] ?? 0) + 1);
  }
  const p = [];
  let u = 0;
  for (const h of c) {
    let n = null;
    for (; u < r; ) {
      const f = M(a, u);
      if (lt(f)) {
        u += 1;
        continue;
      }
      const j = $(f), w = x[j] ?? 0, T = b[j] ?? 0, N = h.loadHours ?? 0, y = s && N > s;
      if (s && !y ? w + N <= s : T < l) {
        x[j] = w + N, b[j] = T + 1, n = f;
        break;
      }
      u += 1;
    }
    if (!n) {
      let f = M(a, r);
      for (; lt(f); ) f = M(f, 1);
      n = f;
    }
    p.push({ item: h, date: n });
  }
  return { suggestions: p, fixed: i };
}
const na = {
  [I.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [I.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function Oe({ item: t, onSelect: a, showDate: s = !1 }) {
  const r = O[t.source], l = na[t.risk];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => a(t),
      className: v(
        "flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left transition-colors duration-fast",
        "hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      ),
      children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-neutral-subtle text-[10px] text-text-tertiary",
            "aria-hidden": "true",
            children: r && /* @__PURE__ */ e.jsx("i", { className: v("fa", r.icon) })
          }
        ),
        /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("span", { className: v("block truncate text-[13px] font-semibold text-text-primary", t.isDone && "line-through opacity-65"), children: t.title }),
          /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block truncate text-[11.5px] text-text-tertiary", children: [
            s ? D.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
            t.subtitle,
            t.assigneeName,
            t.amount != null ? D.money(t.amount, t.currency) : null
          ].filter(Boolean).join(" · ") || (r ? r.label : "") })
        ] }),
        l && /* @__PURE__ */ e.jsx("span", { className: v("shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold", l.className), children: l.label })
      ]
    }
  );
}
function ia({ items: t, today: a, onSelectItem: s, onSmartDefer: r }) {
  const { overdue: l, days: d } = kt(t, a);
  return l.length === 0 && d.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
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
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: l.map((m) => /* @__PURE__ */ e.jsx(Oe, { item: m, onSelect: s, showDate: !0 }, m.key)) })
    ] }),
    d.map((m) => /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: v(
        "flex items-center justify-between border-b border-subtle px-3 py-2",
        m.isToday && "border-b-accent"
      ), children: [
        /* @__PURE__ */ e.jsxs("span", { className: v(
          "text-[11px] font-bold uppercase tracking-wider",
          m.isToday ? "text-accent" : "text-text-tertiary"
        ), children: [
          D.dayTitle(m.date),
          m.isToday ? " · Bugün" : ""
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: m.items.length })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: m.items.map((o) => /* @__PURE__ */ e.jsx(Oe, { item: o, onSelect: s }, o.key)) })
    ] }, m.key))
  ] });
}
function la({ dayKey: t, items: a, capacity: s, onSelectItem: r, onClose: l }) {
  const d = /* @__PURE__ */ new Date(`${t}T00:00:00`), m = Se(a), o = s && m > s, c = a.reduce((i, x) => (i[x.source] = (i[x.source] ?? 0) + 1, i), {});
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: D.dayTitle(d) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(c).length === 0 ? "Planlanmış öğe yok" : Object.entries(c).map(([i, x]) => {
          var b;
          return `${x} ${((b = O[i]) == null ? void 0 : b.plural) ?? "öğe"}`;
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
    s && m > 0 && /* @__PURE__ */ e.jsxs("div", { className: v(
      "flex items-center justify-between border-b px-3 py-2 text-[11.5px]",
      o ? "border-negative-100 bg-negative-50 text-negative-700" : "border-subtle text-text-secondary"
    ), children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-semibold", children: o ? "Kapasite aşımı" : "Gün yükü" }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono tabular-nums", children: [
        D.hours(m),
        " / ",
        D.hours(s)
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
const oa = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], ca = {
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
function da({ item: t, onSelect: a, onDragStart: s, isPending: r, hasError: l }) {
  const d = O[t.source], m = ca[t.risk], o = t.canReschedule && !t.isDone, c = _t(() => a(t));
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: o,
      onDragStart: o ? (i) => {
        i.stopPropagation(), i.dataTransfer.effectAllowed = "move", i.dataTransfer.setData("text/plain", t.key), s(t);
      } : void 0,
      onPointerDown: (i) => {
        i.stopPropagation(), c.onPointerDown(i);
      },
      onClick: (i) => {
        i.stopPropagation(), c.onClick(i);
      },
      title: t.subtitle ? `${t.title} — ${t.subtitle}` : t.title,
      style: m ? { backgroundImage: m.pattern } : void 0,
      className: v(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        m ? m.pill : "bg-neutral-subtle text-text-primary",
        t.isDone && "line-through opacity-65",
        o && "cursor-grab active:cursor-grabbing",
        /* Hata SATIRDA kalır — toast'a kaçmaz. */
        l && "ring-1 ring-negative-500",
        r && "opacity-60"
      ),
      children: [
        r ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin shrink-0 text-[9px]", "aria-hidden": "true" }) : d && /* @__PURE__ */ e.jsx("i", { className: v("fa shrink-0 text-[9px] opacity-70", d.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: t.title }),
        l && /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation ms-auto shrink-0 text-[9px]", "aria-hidden": "true" })
      ]
    }
  );
}
function ua({ summary: t, onSelect: a }) {
  const s = O[t.source];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: (r) => {
        r.stopPropagation(), a(t.source);
      },
      className: v(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left",
        "text-[10.5px] font-medium text-text-secondary hover:bg-surface-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      ),
      children: [
        s && /* @__PURE__ */ e.jsx("i", { className: v("fa shrink-0 text-[9px] opacity-60", s.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: ea(t) })
      ]
    }
  );
}
function xa({ load: t, capacity: a }) {
  if (!a || t <= 0) return null;
  const s = t > a, r = s ? a / t * 100 : t / a * 100;
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "mt-auto flex h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle",
      title: `Gün yükü ${D.hours(t)} / kapasite ${D.hours(a)}`,
      "aria-label": `Gün yükü ${D.hours(t)}, kapasite ${D.hours(a)}`,
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-full bg-accent", style: { width: `${r}%` } }),
        s && /* @__PURE__ */ e.jsx("span", { className: "h-full flex-1 bg-negative" })
      ]
    }
  );
}
function ma({
  month: t,
  byDay: a,
  today: s,
  capacity: r,
  onSelectItem: l,
  onSelectDay: d,
  selectedDay: m,
  onDropItem: o,
  pending: c = {},
  errors: i = {},
  focusedDay: x,
  onFocusDay: b,
  onNavigate: p
}) {
  const u = gt(t), h = $(s), [n, f] = ye.useState(null), [j, w] = ye.useState(null), T = ye.useRef(null), N = x ?? m ?? h, y = (S) => {
    const E = M(/* @__PURE__ */ new Date(`${N}T00:00:00`), S);
    u.some((F) => $(F) === $(E)) || p == null || p(E), b == null || b($(E));
  }, K = (S) => {
    const E = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[S.key];
    if (E) {
      S.preventDefault(), y(E);
      return;
    }
    (S.key === "Enter" || S.key === " ") && (S.preventDefault(), d(N));
  };
  return ye.useEffect(() => {
    var E, F;
    const S = (E = T.current) == null ? void 0 : E.querySelector(`[data-day="${N}"]`);
    S && ((F = T.current) != null && F.contains(document.activeElement)) && S.focus();
  }, [N]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: oa.map((S, E) => /* @__PURE__ */ e.jsx(
      "div",
      {
        className: v(
          "px-2.5 py-2 text-right text-[10.5px] font-bold uppercase tracking-wider",
          E > 4 ? "text-text-tertiary opacity-70" : "text-text-tertiary"
        ),
        children: S
      },
      S
    )) }),
    /* @__PURE__ */ e.jsx(
      "div",
      {
        ref: T,
        role: "grid",
        "aria-label": "Ay takvimi",
        tabIndex: 0,
        onKeyDown: K,
        className: "grid grid-cols-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
        children: u.map((S) => {
          const E = $(S), F = a[E] ?? [], { pills: V, summaries: De } = Zt(F), X = Se(F), B = S.getMonth() !== t.getMonth(), ne = E === h, te = E === m;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              role: "gridcell",
              "data-day": E,
              tabIndex: E === N ? 0 : -1,
              "aria-selected": te,
              "aria-label": `${D.dayTitle(S)}${F.length ? `, ${F.length} öğe` : ", boş"}`,
              onClick: () => {
                b == null || b(E), d(E);
              },
              onDragOver: n ? (C) => {
                C.preventDefault(), C.dataTransfer.dropEffect = "move", j !== E && w(E);
              } : void 0,
              onDragLeave: n ? () => w((C) => C === E ? null : C) : void 0,
              onDrop: n ? (C) => {
                C.preventDefault();
                const J = n;
                f(null), w(null), J && J.date.slice(0, 10) !== E && o(J, /* @__PURE__ */ new Date(`${E}T00:00:00`));
              } : void 0,
              className: v(
                "flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5",
                "transition-colors duration-fast last:border-r-0 hover:bg-surface-hover",
                B ? "bg-surface-sunken" : "bg-surface-base",
                te && "ring-2 ring-inset ring-border-focus",
                j === E && "bg-primary-subtle ring-2 ring-inset ring-accent"
              ),
              children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                  X > 0 && r && X > r && /* @__PURE__ */ e.jsx("span", { className: "rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: D.hours(X) }),
                  /* @__PURE__ */ e.jsx(
                    "span",
                    {
                      className: v(
                        "ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11.5px] font-semibold leading-none tabular-nums",
                        ne && "bg-accent text-white",
                        !ne && B && "text-text-tertiary opacity-60",
                        !ne && !B && "text-text-secondary"
                      ),
                      children: S.getDate()
                    }
                  )
                ] }),
                V.map((C) => /* @__PURE__ */ e.jsx(
                  da,
                  {
                    item: C,
                    onSelect: l,
                    onDragStart: f,
                    isPending: !!c[C.key],
                    hasError: !!i[C.key]
                  },
                  C.key
                )),
                De.map((C) => /* @__PURE__ */ e.jsx(
                  ua,
                  {
                    summary: C,
                    onSelect: () => d(E)
                  },
                  `${E}-${C.source}`
                )),
                /* @__PURE__ */ e.jsx(xa, { load: X, capacity: r })
              ]
            },
            E
          );
        })
      }
    )
  ] });
}
const pa = { 1: "Google", 2: "Outlook", 3: "iCloud" };
function fa(t) {
  const a = String(t ?? "").trim().split(/\s+/).filter(Boolean);
  return a.length === 0 ? "?" : a.length === 1 ? a[0].slice(0, 2).toLocaleUpperCase("tr") : (a[0][0] + a[a.length - 1][0]).toLocaleUpperCase("tr");
}
function ba({
  sources: t,
  counts: a,
  enabled: s,
  onToggle: r,
  compact: l = !1,
  externalAccounts: d = [],
  externalLoading: m = !1,
  onOpenSync: o,
  teamOpen: c = !1,
  onToggleTeam: i,
  teamContent: x,
  teamMembers: b = [],
  riskCounts: p
}) {
  const u = (t ?? []).filter((f) => f.isAvailable);
  if (u.length === 0) return null;
  const h = new Set(u.map((f) => f.source)), n = Ht.map(({ key: f, sources: j }) => {
    const w = j.filter((T) => h.has(T));
    return w.length === 0 ? null : {
      key: f,
      sources: w,
      meta: O[w[0]],
      /* Grubun tamamı kapalıysa kapalı sayılır — biri açıksa satır açıktır. */
      isOn: w.some((T) => s.has(T)),
      count: w.reduce((T, N) => T + (a[N] ?? 0), 0)
    };
  }).filter(Boolean);
  return /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Takvim kaynakları",
      className: v(
        "flex flex-col gap-1 rounded-card border border-subtle bg-surface-base p-2",
        l ? "w-[60px] items-center" : "w-full"
      ),
      children: [
        !l && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Kaynaklar" }),
        n.map(({ key: f, sources: j, meta: w, isOn: T, count: N }) => w ? /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": T,
            title: l ? `${w.railLabel ?? w.label} — ${N} öğe` : void 0,
            onClick: () => {
              const y = !T;
              j.forEach((K) => {
                s.has(K) !== y && r(K);
              });
            },
            className: v(
              "group flex items-center rounded-md text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              l ? "relative h-11 w-11 justify-center" : "gap-2.5 px-2 py-2",
              T ? "text-text-primary" : "text-text-tertiary",
              "hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: v(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px]",
                    T ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
                  ),
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ e.jsx("i", { className: v("fa", w.icon) })
                }
              ),
              l ? N > 0 && /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: v(
                    "absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-[9.5px] font-bold leading-4",
                    T ? "bg-accent text-white" : "bg-neutral-200 text-text-tertiary"
                  ),
                  children: N
                }
              ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsx("span", { className: v("flex-1 truncate text-[12.5px] font-medium", !T && "line-through decoration-1"), children: w.railLabel ?? w.label }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: N })
              ] })
            ]
          },
          f
        ) : null),
        !l && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex items-center justify-between border-t border-subtle px-2 pb-1 pt-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Dış takvimler" }),
            o && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: o,
                className: "rounded p-1 text-[11px] font-medium text-text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                children: "+ Ekle"
              }
            )
          ] }),
          d.length === 0 && !m && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 text-[11.5px] text-text-tertiary", children: "Bağlı takvim yok." }),
          m && d.length === 0 && /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1 text-[11.5px] text-text-tertiary", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
            "senkronize ediliyor…"
          ] }),
          d.map((f) => /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: v(
                "flex items-start gap-2 rounded-md px-2 py-1.5",
                f.error && "bg-negative-50"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: v(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px]",
                      f.error ? "bg-negative-100 text-negative-700" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: v("fa", f.error ? "fa-triangle-exclamation" : "fa-calendar-days") })
                  }
                ),
                /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: pa[f.provider] ?? "Takvim" }),
                  /* @__PURE__ */ e.jsx("span", { className: v(
                    "block truncate text-[10.5px]",
                    f.error ? "text-negative-700" : "text-text-tertiary"
                  ), children: f.error ?? `${f.email} · ${f.eventCount} etkinlik` }),
                  f.error && /* @__PURE__ */ e.jsx("a", { href: "/Calendars", className: "text-[10.5px] font-semibold text-text-link hover:underline", children: "Yeniden bağla" })
                ] })
              ]
            },
            f.accountId
          )),
          !l && i && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                role: "switch",
                "aria-checked": c,
                onClick: i,
                className: v(
                  "mt-2 flex items-center gap-2 border-t border-subtle px-2 pb-1 pt-2 text-left",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                ),
                children: [
                  /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Ekip katmanı" }),
                  /* @__PURE__ */ e.jsx(
                    "i",
                    {
                      className: v("fa text-[11px]", c ? "fa-toggle-on text-accent" : "fa-toggle-off text-text-tertiary"),
                      "aria-hidden": "true"
                    }
                  )
                ]
              }
            ),
            b.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-1 px-2 pb-1", children: [
              b.slice(0, 3).map((f) => /* @__PURE__ */ e.jsxs(
                "span",
                {
                  title: f.name,
                  className: "flex items-center gap-1 rounded-full bg-neutral-subtle py-0.5 pe-2 ps-0.5 text-[10.5px] text-text-secondary",
                  children: [
                    /* @__PURE__ */ e.jsx(
                      "span",
                      {
                        className: "flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[8.5px] font-bold text-[color:var(--apya-avatar-fg)]",
                        "aria-hidden": "true",
                        children: fa(f.name)
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { className: "max-w-[86px] truncate", children: f.name })
                  ]
                },
                f.userId
              )),
              b.length > 3 && /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-medium text-text-tertiary", children: [
                "+",
                b.length - 3
              ] })
            ] }),
            x
          ] }),
          p && (p.overdue > 0 || p.dueToday > 0 || p.syncError > 0) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("p", { className: "mt-2 border-t border-subtle px-2 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Risk" }),
            [
              { key: "overdue", label: "Gecikmiş", value: p.overdue, dot: "bg-negative" },
              { key: "dueToday", label: "Bugün son gün", value: p.dueToday, dot: "bg-warning" },
              { key: "syncError", label: "Senkron hatası", value: p.syncError, dot: "bg-negative-700" }
            ].filter((f) => f.value > 0).map((f) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-2 py-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: v("h-[7px] w-[7px] shrink-0 rounded-full", f.dot), "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[11.5px] text-text-secondary", children: f.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-primary", children: f.value })
            ] }, f.key))
          ] }),
          o && /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: o,
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
const ha = { month: "Ay", week: "Hafta", day: "Gün", agenda: "Ajanda" };
function ga(t) {
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
    var r, l, d;
    return (d = (l = (r = window.abp) == null ? void 0 : r.notify) == null ? void 0 : l.success) == null ? void 0 : d.call(l, "Görev oluşturuldu.");
  }), a.open();
}
function ya() {
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
function ka({
  title: t,
  view: a,
  onView: s,
  onPrev: r,
  onNext: l,
  onToday: d,
  overloadDays: m,
  onHelp: o,
  filterCount: c = 0,
  onClearFilters: i,
  lastSyncAt: x,
  syncError: b = !1,
  canCreateTask: p = !0,
  compact: u = !1
}) {
  const h = a !== "agenda", n = ga(x);
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
    /* @__PURE__ */ e.jsx(z, { variant: "outline", size: "sm", onClick: d, children: "Bugün" }),
    /* @__PURE__ */ e.jsx("h2", { className: "ml-1 text-[17px] font-semibold capitalize tracking-tight text-text-primary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "ml-auto flex flex-wrap items-center justify-end gap-2", children: [
      m > 0 && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "rounded-md bg-negative-50 px-2 py-1 text-[11.5px] font-semibold text-negative-700",
          title: "Günlük kapasitenizi aşan gün sayısı",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
            m,
            " günde kapasite aşımı"
          ]
        }
      ),
      (n || b) && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: v(
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium",
            b ? "bg-negative-50 text-negative-700" : "text-text-tertiary"
          ),
          title: b ? "Bir dış takvim senkronlanamıyor" : "Dış takvimlerin son senkron zamanı",
          children: [
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: v("h-[6px] w-[6px] rounded-full", b ? "bg-negative" : "bg-positive"),
                "aria-hidden": "true"
              }
            ),
            "Senkron",
            n ? ` · ${n}` : ""
          ]
        }
      ),
      c > 0 && i && /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: i,
          title: "Filtreleri temizle — kapalı kaynakları geri aç",
          className: "flex h-9 items-center gap-1.5 rounded-md border border-default bg-surface-base px-2.5 text-[12px] font-medium text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: [
            "Filtre",
            /* @__PURE__ */ e.jsx("span", { className: "rounded-full bg-primary-subtle px-1.5 text-[11px] font-semibold text-accent", children: c })
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
      o && !u && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: o,
          title: "Klavye kısayolları (?)",
          "aria-label": "Klavye kısayolları",
          className: "h-9 w-9 rounded-md border border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-keyboard", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(ha).map(([f, j]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": a === f,
          onClick: () => s(f),
          className: v(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            a === f ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: j
        },
        f
      )) }),
      p && !u && /* @__PURE__ */ e.jsxs(z, { variant: "primary", size: "sm", onClick: Ne, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus me-1.5", "aria-hidden": "true" }),
        "Yeni görev"
      ] })
    ] })
  ] });
}
const ee = 44, va = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], ja = {
  [I.OVERDUE]: "bg-negative-50 text-negative-700",
  [I.DUE_TODAY]: "bg-warning-50 text-warning-700"
};
function Na({ load: t, capacity: a }) {
  if (!a || t <= 0) return null;
  const s = t > a;
  return /* @__PURE__ */ e.jsx("div", { className: "mt-1 h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
    "span",
    {
      className: v("block h-full", s ? "bg-negative" : "bg-accent"),
      style: { width: `${Math.min(t / a, 1) * 100}%` }
    }
  ) });
}
function wa({ days: t, byDay: a, today: s, capacity: r, onSelectItem: l, onSelectDay: d, selectedDay: m }) {
  const o = $(s), c = g.useRef(null), [i, x] = g.useState(() => {
    const N = /* @__PURE__ */ new Date();
    return N.getHours() * 60 + N.getMinutes();
  });
  g.useEffect(() => {
    const N = setInterval(() => {
      const y = /* @__PURE__ */ new Date();
      x(y.getHours() * 60 + y.getMinutes());
    }, 6e4);
    return () => clearInterval(N);
  }, []);
  const b = t.map($), p = {}, u = {};
  for (const N of b) {
    const y = a[N] ?? [];
    p[N] = y.filter(it), u[N] = y.filter((K) => !it(K));
  }
  const h = b.flatMap((N) => p[N]), { start: n, end: f } = sa(h), j = Array.from({ length: f - n }, (N, y) => n + y), w = (f - n) * ee, T = b.includes(o) && i >= n * 60 && i <= f * 60;
  return g.useEffect(() => {
    if (!T || !c.current) return;
    const N = (i - n * 60) / 60 * ee;
    c.current.scrollTop = Math.max(0, N - 120);
  }, [T, n]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "grid border-b border-default bg-surface-raised",
        style: { gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))` },
        children: [
          /* @__PURE__ */ e.jsx("div", {}),
          t.map((N) => {
            const y = $(N), K = Se(a[y] ?? []), S = y === o;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => d(y),
                className: v(
                  "border-l border-subtle px-2 py-2 text-left transition-colors duration-fast hover:bg-surface-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
                  m === y && "bg-primary-subtle"
                ),
                children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "flex items-baseline gap-1.5", children: [
                    /* @__PURE__ */ e.jsx("span", { className: v(
                      "text-[10.5px] font-bold uppercase tracking-wider",
                      S ? "text-accent" : "text-text-tertiary"
                    ), children: va[(N.getDay() + 6) % 7] }),
                    /* @__PURE__ */ e.jsx("span", { className: v(
                      "font-mono text-[13px] font-semibold tabular-nums",
                      S ? "text-accent" : "text-text-primary"
                    ), children: N.getDate() }),
                    r && K > r && /* @__PURE__ */ e.jsx("span", { className: "ms-auto rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: D.hours(K) })
                  ] }),
                  /* @__PURE__ */ e.jsx(Na, { load: K, capacity: r })
                ]
              },
              y
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
          b.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-[46px] flex-col gap-[3px] border-l border-subtle p-1", children: [
            u[N].slice(0, 4).map((y) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => l(y),
                title: y.title,
                className: v(
                  "flex w-full items-center gap-1 truncate rounded-[5px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                  ja[y.risk] ?? "bg-neutral-subtle text-text-primary",
                  y.isDone && "line-through opacity-65"
                ),
                children: [
                  O[y.source] && /* @__PURE__ */ e.jsx("i", { className: v("fa shrink-0 text-[9px] opacity-70", O[y.source].icon), "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "truncate", children: y.title })
                ]
              },
              y.key
            )),
            u[N].length > 4 && /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => d(N),
                className: "px-1.5 text-left text-[10.5px] font-medium text-text-tertiary hover:text-text-primary",
                children: [
                  "+",
                  u[N].length - 4,
                  " öğe"
                ]
              }
            )
          ] }, N))
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { ref: c, className: "max-h-[520px] overflow-y-auto", children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "relative grid",
          style: {
            gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))`,
            height: `${w}px`
          },
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "relative", children: j.map((N, y) => /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: "absolute right-1.5 -translate-y-1/2 font-mono text-[10px] tabular-nums text-text-tertiary",
                style: { top: `${y * ee}px` },
                children: [
                  String(N).padStart(2, "0"),
                  ":00"
                ]
              },
              N
            )) }),
            b.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "relative border-l border-subtle", children: [
              j.map((y, K) => /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "absolute inset-x-0 border-t border-subtle",
                  style: { top: `${K * ee}px` }
                },
                y
              )),
              p[N].map((y) => {
                const K = je(y.startTime), S = y.endTime ? je(y.endTime) : K + 60, E = (K - n * 60) / 60 * ee, F = Math.max((S - K) / 60 * ee, 18);
                return /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => l(y),
                    title: `${y.title} · ${ze(y.startTime)}`,
                    style: {
                      top: `${E}px`,
                      height: `${F}px`,
                      backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(0,0,0,.05) 4px, rgba(0,0,0,.05) 6px)"
                    },
                    className: v(
                      "absolute inset-x-0.5 overflow-hidden rounded-[5px] border-l-2 border-accent bg-primary-subtle",
                      "px-1.5 py-0.5 text-left text-[10.5px] leading-tight text-text-primary",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    ),
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: "block truncate font-semibold", children: y.title }),
                      /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[9.5px] text-text-tertiary", children: [
                        ze(y.startTime),
                        y.endTime ? `–${ze(y.endTime)}` : ""
                      ] })
                    ]
                  },
                  y.key
                );
              }),
              T && N === o && /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "pointer-events-none absolute inset-x-0 z-10 border-t-2 border-negative",
                  style: { top: `${(i - n * 60) / 60 * ee}px` },
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ e.jsx("span", { className: "absolute -left-1 -top-1 h-2 w-2 rounded-full bg-negative" })
                }
              )
            ] }, N))
          ]
        }
      ),
      h.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "border-t border-subtle px-3 py-2 text-[11.5px] text-text-tertiary", children: "Saat ızgarası dış takvim etkinliklerini gösterir. Bağlı bir takvim yoksa boş kalır." })
    ] })
  ] });
}
function Sa({ item: t }) {
  var x;
  const [a, s] = g.useState(""), [r, l] = g.useState(() => /* @__PURE__ */ new Set()), d = t.description ?? t.subtitle ?? "", m = W({
    queryKey: ["calendar", "projects-lookup"],
    queryFn: () => A.get("/api/app/task/projects-lookup"),
    staleTime: 10 * 6e4
  }), o = L({
    mutationFn: async () => {
      const b = new FormData();
      b.append("file", new Blob([`${t.title}

${d}`], { type: "text/plain" }), "toplanti-notlari.txt");
      const p = await fetch(`/api/ai-task-generator/parse?projectId=${a}`, {
        method: "POST",
        body: b,
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });
      if (!p.ok) throw new Error("Notlardan görev çıkarılamadı.");
      return p.json();
    },
    onSuccess: (b) => l(new Set(((b == null ? void 0 : b.suggestions) ?? []).map((p, u) => u)))
  }), c = L({
    mutationFn: () => {
      var b;
      return A.post("/api/ai-task-generator/create-tasks", {
        projectId: a,
        approvedTasks: (((b = o.data) == null ? void 0 : b.suggestions) ?? []).filter((p, u) => r.has(u))
      });
    },
    /* Olay takvimin kendi dinleyicisiyle feed ve ekip yükünü tazeler, damga Pano'yu. */
    onSuccess: () => Gt({ entity: "task", action: "create" })
  }), i = ((x = o.data) == null ? void 0 : x.suggestions) ?? [];
  return /* @__PURE__ */ e.jsxs("section", { className: "border-t border-subtle px-4 py-3", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Toplantıdan görev" }),
    !d && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[11.5px] text-text-tertiary", children: "Bu etkinlikte not yok — çıkarılacak aksiyon maddesi bulunamaz." }),
    d && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs(
        "select",
        {
          value: a,
          onChange: (b) => s(b.target.value),
          "aria-label": "Görevlerin ekleneceği proje",
          className: "mt-1.5 w-full rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "Proje seçin…" }),
            (m.data ?? []).map((b) => /* @__PURE__ */ e.jsx("option", { value: b.id, children: b.name }, b.id))
          ]
        }
      ),
      /* @__PURE__ */ e.jsx(
        z,
        {
          size: "sm",
          variant: "outline",
          className: "mt-2",
          disabled: !a || o.isPending,
          onClick: () => o.mutate(),
          children: o.isPending ? "Notlar okunuyor…" : "Notlardan aksiyon çıkar"
        }
      ),
      o.isError && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-negative-700", children: o.error.message }),
      i.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", children: [
        i.map((b, p) => /* @__PURE__ */ e.jsxs("label", { className: "flex cursor-pointer items-start gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: r.has(p),
              onChange: () => l((u) => {
                const h = new Set(u);
                return h.has(p) ? h.delete(p) : h.add(p), h;
              }),
              className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[12px] text-text-primary", children: b.title })
        ] }, `${b.title}-${p}`)),
        /* @__PURE__ */ e.jsx(
          z,
          {
            size: "sm",
            variant: "primary",
            className: v("mt-2"),
            disabled: r.size === 0 || c.isPending || c.isSuccess,
            onClick: () => c.mutate(),
            children: c.isSuccess ? `${c.data} görev eklendi` : c.isPending ? "Ekleniyor…" : `${r.size} görev olarak ekle`
          }
        )
      ] })
    ] })
  ] });
}
const Da = {
  [I.OVERDUE]: { text: "Gecikmiş", cls: "bg-negative-50 text-negative-700" },
  [I.DUE_TODAY]: { text: "Bugün son gün", cls: "bg-warning-50 text-warning-700" }
};
function oe({ label: t, children: a }) {
  return a ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-subtle py-2.5 last:border-b-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11.5px] font-medium text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "min-w-0 text-right text-[12.5px] text-text-primary", children: a })
  ] }) : null;
}
function Ca({ item: t, capacity: a, onClose: s, onReschedule: r, onComplete: l, isPending: d, error: m, onRetry: o }) {
  const [c, i] = g.useState(() => t.date.slice(0, 10)), x = O[t.source], b = Da[t.risk], p = t.date.slice(0, 10);
  g.useEffect(() => i(p), [p]);
  const u = () => {
    !c || c === p || r(t, /* @__PURE__ */ new Date(`${c}T00:00:00`));
  };
  return /* @__PURE__ */ e.jsx(ue, { open: !0, onOpenChange: (h) => {
    h || s();
  }, children: /* @__PURE__ */ e.jsxs(xe, { side: "right", title: t.title, className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md bg-neutral-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary", children: [
          x && /* @__PURE__ */ e.jsx("i", { className: v("fa text-[10px]", x.icon), "aria-hidden": "true" }),
          x == null ? void 0 : x.label
        ] }),
        b && /* @__PURE__ */ e.jsx("span", { className: v("rounded-md px-2 py-1 text-[11px] font-bold", b.cls), children: b.text }),
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
    m && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-negative-100 bg-negative-50 px-4 py-2.5 text-[12px] text-negative-700", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: m }),
      /* @__PURE__ */ e.jsx(mt, { onRetry: o })
    ] }),
    d && /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle px-4 py-2 text-[12px] text-text-tertiary", "aria-live": "polite", children: [
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
          onClick: () => r(t, M(/* @__PURE__ */ new Date(`${p}T00:00:00`), 1)),
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
            value: c,
            onChange: (h) => i(h.target.value),
            className: "rounded-md border border-default bg-surface-base px-2 py-1 text-[12.5px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": "Son tarih"
          }
        ),
        c !== p && /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "primary", onClick: u, children: "Uygula" })
      ] }) : /* @__PURE__ */ e.jsxs("span", { className: "text-text-secondary", children: [
        D.dayTitle(/* @__PURE__ */ new Date(`${p}T00:00:00`)),
        /* @__PURE__ */ e.jsx("span", { className: "ml-1.5 text-text-tertiary", children: "· takvimden değiştirilemez" })
      ] }) }),
      /* @__PURE__ */ e.jsx(oe, { label: "Bağlam", children: t.subtitle }),
      /* @__PURE__ */ e.jsx(oe, { label: "Atanan", children: t.assigneeName }),
      /* @__PURE__ */ e.jsx(oe, { label: "Tutar", children: t.amount != null ? D.money(t.amount, t.currency) : null }),
      /* @__PURE__ */ e.jsx(oe, { label: "Gün yükü", children: t.loadHours != null ? `${D.hours(t.loadHours)}${a ? ` / ${D.hours(a)} kapasite` : ""}` : null })
    ] }),
    t.source === 7 && /* @__PURE__ */ e.jsx(Sa, { item: t }),
    t.href && /* @__PURE__ */ e.jsx("footer", { className: "border-t border-subtle px-4 py-3", children: /* @__PURE__ */ e.jsxs(
      "a",
      {
        href: t.href,
        className: "text-[12.5px] font-medium text-text-link hover:underline",
        children: [
          x == null ? void 0 : x.label,
          " ekranında aç",
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right ms-1.5 text-[10px]", "aria-hidden": "true" })
        ]
      }
    ) })
  ] }) });
}
const vt = ["calendar", "sync-settings"];
function Ta(t) {
  return W({
    queryKey: vt,
    queryFn: () => A.get("/api/app/calendar/sync-settings"),
    enabled: t,
    staleTime: 3e4
  });
}
function Ea() {
  const t = U();
  return L({
    /* ABP konvansiyonu: UpdateSyncRulesAsync → PUT (POST 405). */
    mutationFn: (a) => A.put("/api/app/calendar/sync-rules", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: vt }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
const jt = ["calendar", "sync-settings"], $a = ["calendar", "external"];
function Nt() {
  return L({
    mutationFn: (t) => A.get(`/api/app/calendar/auth-url?provider=${t}`),
    /* Sağlayıcının kendi ekranına gidiliyor: SPA yönlendirmesi değil, tam sayfa. */
    onSuccess: (t) => {
      typeof t == "string" && t && (window.location.href = t);
    }
  });
}
function Ra() {
  const t = U();
  return L({
    mutationFn: (a) => A.post(`/api/app/calendar/${a}/disconnect-account`, {}),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: jt }), t.invalidateQueries({ queryKey: $a });
    }
  });
}
function za() {
  const t = U();
  return L({
    mutationFn: (a) => A.post(`/api/app/calendar/${a}/force-sync`, {}),
    /* "Son senkron" damgası ve senkron günlüğü bu çağrıyla değişir. */
    onSuccess: () => t.invalidateQueries({ queryKey: jt })
  });
}
const wt = ["calendar", "ical-feed"], Be = ["calendar", "ical-subscriptions"];
function Aa(t) {
  return W({
    queryKey: wt,
    /* GetOrCreate: bağlantı yoksa ilk açılışta üretilir. */
    queryFn: () => A.post("/api/app/ical-feed/ensure", {}),
    enabled: t,
    staleTime: 1 / 0
  });
}
function Ka() {
  const t = U();
  return L({
    mutationFn: () => A.post("/api/app/ical-feed/regenerate", {}),
    onSuccess: (a) => t.setQueryData(wt, a)
  });
}
function Pa(t) {
  return W({
    queryKey: Be,
    queryFn: () => A.get("/api/app/ical-subscription"),
    enabled: t,
    staleTime: 3e4
  });
}
function Ia() {
  const t = U();
  return L({
    mutationFn: (a) => A.post("/api/app/ical-subscription", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Be }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function Oa() {
  const t = U();
  return L({
    mutationFn: (a) => A.delete(`/api/app/ical-subscription/${a}`),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Be }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function Fa() {
  return L({
    mutationFn: (t) => A.post(`/api/app/ical-subscription/probe?url=${encodeURIComponent(t)}`, {})
  });
}
const Ma = {
  1: { label: "Google Calendar", icon: "fa-google", brand: "bg-[#ea4335]" },
  2: { label: "Microsoft Outlook", icon: "fa-windows", brand: "bg-[#0078d4]" },
  3: { label: "iCloud", icon: "fa-apple", brand: "bg-neutral-700" }
}, La = {
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
  return a < 1 ? "az önce" : a < 60 ? `${a} dk önce` : a < 1440 ? `${Math.round(a / 60)} sa önce` : D.dayShort(new Date(t));
}
function Ba({ account: t, onSave: a, saving: s }) {
  var h;
  const r = Ma[t.provider] ?? { label: "Takvim", icon: "fa-calendar", brand: "bg-neutral-700" }, l = za(), d = Ra(), [m, o] = g.useState(() => new Set(t.syncSources ?? [])), [c, i] = g.useState(t.conflictRule ?? 0), [x, b] = g.useState(t.isSyncEnabled);
  g.useEffect(() => {
    o(new Set(t.syncSources ?? [])), i(t.conflictRule ?? 0), b(t.isSyncEnabled);
  }, [t]);
  const p = x !== t.isSyncEnabled || c !== t.conflictRule || m.size !== (t.syncSources ?? []).length || [...m].some((n) => !(t.syncSources ?? []).includes(n)), u = (n) => o((f) => {
    const j = new Set(f);
    return j.has(n) ? j.delete(n) : j.add(n), j;
  });
  return /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-3 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: v("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", r.brand), "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("i", { className: v("fab", r.icon) }) }),
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
            checked: x,
            onChange: (n) => b(n.target.checked),
            className: "h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
          }
        ),
        "Açık"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Bu hesaba ne gitsin?" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Pe.map((n) => {
        var j, w;
        const f = m.has(n);
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": f,
            onClick: () => u(n),
            className: v(
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              f ? "border-accent bg-primary-subtle text-accent" : "border-subtle bg-surface-base text-text-tertiary hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: v("fa text-[10px]", (j = O[n]) == null ? void 0 : j.icon), "aria-hidden": "true" }),
              (w = O[n]) == null ? void 0 : w.label
            ]
          },
          n
        );
      }) }),
      m.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-text-tertiary", children: "Hiçbiri seçili değil — yalnız görevler gönderilir." }),
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Çakışma kuralı" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: Object.entries(La).map(([n, f]) => {
        const j = Number(n), w = c === j;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => i(j),
            className: v(
              "rounded-md border px-2.5 py-2 text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              w ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("span", { className: v("block text-[12px] font-semibold", w ? "text-accent" : "text-text-primary"), children: f.title }),
              /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] leading-snug text-text-tertiary", children: f.desc })
            ]
          },
          n
        );
      }) }),
      p && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          z,
          {
            size: "sm",
            variant: "primary",
            disabled: s,
            onClick: () => a({
              accountId: t.id,
              isSyncEnabled: x,
              syncSources: [...m],
              syncProjectIds: t.syncProjectIds ?? [],
              conflictRule: c
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
          disabled: d.isPending,
          onClick: () => {
            window.confirm(`${t.externalEmail} bağlantısı kaldırılsın mı? Dış takvimdeki mevcut etkinlikler silinmez.`) && d.mutate(t.id);
          },
          className: "ms-auto rounded-md px-2 py-1 text-[11.5px] font-medium text-negative-700 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-60",
          children: d.isPending ? "Kaldırılıyor…" : "Bağlantıyı kaldır"
        }
      )
    ] }),
    (l.isError || d.isError) && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "border-t border-subtle px-3 py-2 text-[11.5px] text-negative-700", children: ((h = l.error || d.error) == null ? void 0 : h.message) || "İşlem tamamlanamadı." })
  ] });
}
const qa = [
  { value: 15, label: "15 dk" },
  { value: 60, label: "1 saat" },
  { value: 360, label: "6 saat" },
  { value: 1440, label: "Günlük" }
];
function _a({ open: t }) {
  var j, w, T, N;
  const a = Aa(t), s = Ka(), r = Pa(t), l = Ia(), d = Oa(), m = Fa(), [o, c] = g.useState(""), [i, x] = g.useState(""), [b, p] = g.useState(60), [u, h] = g.useState(!1), n = (j = a.data) != null && j.path ? `${window.location.origin}${a.data.path}` : "", f = async () => {
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
        /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "outline", onClick: f, disabled: !n, children: u ? "Kopyalandı" : "Kopyala" })
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
            value: o,
            onChange: (y) => {
              c(y.target.value), m.reset();
            },
            placeholder: "https://…/basic.ics",
            "aria-label": "Takvim bağlantısı",
            className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          }
        ),
        ((w = m.data) == null ? void 0 : w.isValid) && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-positive-700", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-check me-1", "aria-hidden": "true" }),
          "Bağlantı doğrulandı · ",
          m.data.eventCount,
          " etkinlik bulundu"
        ] }),
        m.data && !m.data.isValid && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-negative-700", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
          m.data.error
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              value: i,
              onChange: (y) => x(y.target.value),
              placeholder: ((T = m.data) == null ? void 0 : T.suggestedName) || "Görünen ad",
              "aria-label": "Görünen ad",
              className: "min-w-0 flex-1 rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              value: b,
              onChange: (y) => p(Number(y.target.value)),
              "aria-label": "Yenileme sıklığı",
              className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
              children: qa.map((y) => /* @__PURE__ */ e.jsx("option", { value: y.value, children: y.label }, y.value))
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(
            z,
            {
              size: "sm",
              variant: "outline",
              disabled: !o || m.isPending,
              onClick: () => m.mutate(o),
              children: m.isPending ? "Deneniyor…" : "Bağlantıyı dene"
            }
          ),
          /* @__PURE__ */ e.jsx(
            z,
            {
              size: "sm",
              variant: "primary",
              disabled: !o || l.isPending,
              onClick: () => l.mutate(
                { url: o, displayName: i, color: "accent", refreshMinutes: b },
                { onSuccess: () => {
                  c(""), x(""), m.reset();
                } }
              ),
              children: l.isPending ? "Ekleniyor…" : "Takvimi ekle"
            }
          )
        ] }),
        l.isError && /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-negative-700", children: ((N = l.error) == null ? void 0 : N.message) || "Takvim eklenemedi." }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] leading-snug text-text-tertiary", children: [
          "iCal abonelikleri ",
          /* @__PURE__ */ e.jsx("strong", { className: "font-semibold", children: "tek yönlüdür" }),
          ": etkinlikler APYA'da salt-okunur görünür, APYA öğeleri bu takvime yazılmaz. Çift yönlü senkron için Google veya Outlook hesabı bağlayın."
        ] })
      ] }),
      (r.data ?? []).length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 border-t border-subtle pt-2", children: r.data.map((y) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: y.displayName }),
          /* @__PURE__ */ e.jsx("span", { className: v(
            "block truncate text-[10.5px]",
            y.lastError ? "text-negative-700" : "text-text-tertiary"
          ), children: y.lastError ?? `${y.lastEventCount} etkinlik · ${qe(y.lastFetchedAt)} çekildi` })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => d.mutate(y.id),
            className: "shrink-0 rounded p-1 text-[11px] text-text-tertiary hover:text-negative-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": `${y.displayName} aboneliğini kaldır`,
            children: "Kaldır"
          }
        )
      ] }, y.id)) })
    ] })
  ] });
}
function Ga({ open: t, onClose: a }) {
  var m, o;
  const { data: s, isPending: r } = Ta(t), l = Ea(), d = Nt();
  return /* @__PURE__ */ e.jsx(ue, { open: t, onOpenChange: (c) => {
    c || a();
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
            /* @__PURE__ */ e.jsxs(z, { size: "sm", variant: "outline", disabled: d.isPending, onClick: () => d.mutate(1), children: [
              /* @__PURE__ */ e.jsx("i", { className: "fab fa-google me-1.5", "aria-hidden": "true" }),
              "Google bağla"
            ] }),
            /* @__PURE__ */ e.jsxs(z, { size: "sm", variant: "outline", disabled: d.isPending, onClick: () => d.mutate(2), children: [
              /* @__PURE__ */ e.jsx("i", { className: "fab fa-windows me-1.5", "aria-hidden": "true" }),
              "Outlook bağla"
            ] })
          ] })
        }
      ) }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        l.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "text-[11.5px] text-negative-700", children: ((m = l.error) == null ? void 0 : m.message) || "Senkron kuralları kaydedilemedi." }),
        s.accounts.map((c) => /* @__PURE__ */ e.jsx(
          Ba,
          {
            account: c,
            saving: l.isPending,
            onSave: (i) => l.mutate(i)
          },
          c.id
        )),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: "Başka hesap bağla:" }),
          /* @__PURE__ */ e.jsxs(z, { size: "sm", variant: "outline", disabled: d.isPending, onClick: () => d.mutate(1), children: [
            /* @__PURE__ */ e.jsx("i", { className: "fab fa-google me-1.5", "aria-hidden": "true" }),
            "Google"
          ] }),
          /* @__PURE__ */ e.jsxs(z, { size: "sm", variant: "outline", disabled: d.isPending, onClick: () => d.mutate(2), children: [
            /* @__PURE__ */ e.jsx("i", { className: "fab fa-windows me-1.5", "aria-hidden": "true" }),
            "Outlook"
          ] })
        ] })
      ] }),
      d.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "text-[11.5px] text-negative-700", children: ((o = d.error) == null ? void 0 : o.message) || "Yetkilendirme adresi alınamadı." }),
      /* @__PURE__ */ e.jsx(_a, { open: t }),
      /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
        /* @__PURE__ */ e.jsx("header", { className: "border-b border-subtle px-3 py-2", children: /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-semibold text-text-primary", children: "Senkron günlüğü" }) }),
        /* @__PURE__ */ e.jsx("div", { className: "px-3 py-2", children: ((s == null ? void 0 : s.log) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-2 text-[11.5px] text-text-tertiary", children: "Henüz senkron kaydı yok." }) : s.log.map((c) => {
          const i = ot[c.kind] ?? ot[0];
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
            /* @__PURE__ */ e.jsx("i", { className: v("fa mt-0.5 shrink-0 text-[11px]", i.icon, i.cls), "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[11.5px] leading-snug text-text-secondary", children: c.message }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: qe(c.occurredAt) })
          ] }, c.id);
        }) })
      ] })
    ] }) })
  ] }) });
}
const St = ["calendar", "preferences"];
function Ya() {
  return W({
    queryKey: St,
    queryFn: () => A.get("/api/app/calendar/preferences"),
    staleTime: 5 * 6e4
  });
}
function Ua() {
  const t = U();
  return L({
    /* ABP konvansiyonu: Update* metotları PUT'a düşer. POST 405 döner ve
       ayarlar SESSİZCE kaydedilmemiş olur. */
    mutationFn: (a) => A.put("/api/app/calendar/preferences", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: St }), t.invalidateQueries({ queryKey: ["calendar", "feed"] });
    }
  });
}
function Qa() {
  const t = U();
  return L({
    mutationFn: (a) => A.post("/api/app/calendar/bulk-reschedule", a),
    onSettled: () => t.invalidateQueries({ queryKey: ["calendar", "feed"] })
  });
}
function Ha({ open: t, items: a, today: s, capacity: r, onClose: l }) {
  const { suggestions: d, fixed: m } = g.useMemo(
    () => ra(a, { today: s, capacity: r }),
    [a, s, r]
  ), [o, c] = g.useState(() => new Set(d.map((n) => n.item.key)));
  g.useEffect(() => {
    c(new Set(d.map((n) => n.item.key)));
  }, [d]);
  const i = Qa(), x = i.data ?? [], b = new Map(x.filter((n) => !n.succeeded).map((n) => [n.sourceId, n.error])), p = (n) => c((f) => {
    const j = new Set(f);
    return j.has(n) ? j.delete(n) : j.add(n), j;
  }), u = d.filter((n) => o.has(n.item.key)), h = () => {
    i.mutate(
      u.map((n) => ({
        source: n.item.source,
        sourceId: n.item.sourceId,
        newDate: $(n.date)
      })),
      {
        onSuccess: (n) => {
          (n ?? []).every((f) => f.succeeded) && l();
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
          d.length > 0 ? `${d.length} gecikmiş öğe için boş günlere dağıtılmış tarihler önerildi.` : "Ertelenecek gecikmiş öğe yok.",
          r ? ` Günlük kapasite ${D.hours(r)}.` : ""
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
      d.map(({ item: n, date: f }) => {
        const j = b.get(n.sourceId);
        return /* @__PURE__ */ e.jsxs(
          "label",
          {
            className: v(
              "flex cursor-pointer items-start gap-2.5 border-b border-subtle py-2.5 last:border-b-0",
              j && "bg-negative-50"
            ),
            children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: o.has(n.key),
                  onChange: () => p(n.key),
                  className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] font-semibold text-text-primary", children: n.title }),
                /* @__PURE__ */ e.jsxs("span", { className: "mt-0.5 flex items-center gap-1.5 text-[11px] text-text-tertiary", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "line-through", children: D.dayShort(/* @__PURE__ */ new Date(`${n.date.slice(0, 10)}T00:00:00`)) }),
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right text-[9px]", "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-accent", children: D.dayShort(f) }),
                  n.loadHours != null && /* @__PURE__ */ e.jsxs("span", { children: [
                    "· ",
                    D.hours(n.loadHours)
                  ] })
                ] }),
                j && /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] font-medium text-negative-700", children: j })
              ] })
            ]
          },
          n.key
        );
      }),
      m.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 border-t border-subtle pt-2", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Ertelenemez" }),
        m.map((n) => {
          var f;
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 py-1.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock mt-1 shrink-0 text-[10px] text-text-tertiary", "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] text-text-secondary", children: n.title }),
              /* @__PURE__ */ e.jsxs("span", { className: "block text-[11px] text-text-tertiary", children: [
                (f = O[n.source]) == null ? void 0 : f.label,
                " — vadesi takvimden değiştirilemez"
              ] })
            ] })
          ] }, n.key);
        })
      ] })
    ] }),
    d.length > 0 && /* @__PURE__ */ e.jsxs("footer", { className: "flex items-center gap-2 border-t border-subtle px-4 py-3", children: [
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
const Wa = [
  { value: 4, label: "4 sa" },
  { value: 6, label: "6 sa" },
  { value: 8, label: "8 sa" },
  { value: 0, label: "Kapalı" }
], ke = ["Kaynaklar", "Dış takvim", "Kurallar"];
function Va({ open: t, counts: a, onDone: s }) {
  var u, h;
  const [r, l] = g.useState(0), [d, m] = g.useState(() => new Set(Pe)), [o, c] = g.useState(8), i = Ua(), x = Nt(), b = () => {
    i.mutate(
      {
        dailyCapacityHours: o > 0 ? o : 0,
        sources: [...d],
        setupCompleted: !0
      },
      /* onSettled DEĞİL: hata durumunda da kapanırsa ayarlar sessizce
         kaybolur ve kullanıcı kurulumu yaptığını sanır. */
      { onSuccess: s }
    );
  }, p = (n) => m((f) => {
    const j = new Set(f);
    return j.has(n) ? j.delete(n) : j.add(n), j;
  });
  return /* @__PURE__ */ e.jsx(pt, { open: t, onOpenChange: (n) => {
    n || s();
  }, children: /* @__PURE__ */ e.jsxs(ft, { className: "w-full max-w-[520px] p-0 h-auto max-h-[88dvh] tablet:min-h-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "shrink-0 border-b border-subtle px-5 py-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[18px] font-semibold tracking-tight text-text-primary", children: "Takviminizi kurun" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: "Hangi kaynakları göreceğinizi seçin, dilerseniz dış takvim bağlayın. Her ayarı sonradan değiştirebilirsiniz." }),
      /* @__PURE__ */ e.jsx("ol", { className: "mt-3 flex items-center gap-2", children: ke.map((n, f) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx("span", { className: v(
          "flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold",
          f === r ? "bg-accent text-white" : f < r ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
        ), children: f + 1 }),
        /* @__PURE__ */ e.jsx("span", { className: v(
          "text-[11.5px]",
          f === r ? "font-semibold text-text-primary" : "text-text-tertiary"
        ), children: n }),
        f < ke.length - 1 && /* @__PURE__ */ e.jsx("span", { className: "ms-1 text-text-tertiary", children: "·" })
      ] }, n)) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "min-h-0 overflow-y-auto px-5 py-4", children: [
      r === 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Takvimde ne görünsün?" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex flex-col gap-1.5", children: Pe.map((n) => {
          var w, T;
          const f = d.has(n), j = a == null ? void 0 : a[n];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": f,
              onClick: () => p(n),
              className: v(
                "flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                f ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: v("fa text-[12px]", (w = O[n]) == null ? void 0 : w.icon, f ? "text-accent" : "text-text-tertiary"), "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-medium text-text-primary", children: (T = O[n]) == null ? void 0 : T.label }),
                j != null && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: j })
              ]
            },
            n
          );
        }) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-[13px] font-semibold text-text-primary", children: "Günlük kapasiteniz" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex gap-1.5", children: Wa.map((n) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => c(n.value),
            className: v(
              "rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              o === n.value ? "border-accent bg-primary-subtle text-accent" : "border-subtle text-text-secondary hover:bg-surface-hover"
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
              disabled: x.isPending,
              onClick: () => x.mutate(1),
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
              disabled: x.isPending,
              onClick: () => x.mutate(2),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fab fa-windows me-1.5", "aria-hidden": "true" }),
                "Outlook bağla"
              ]
            }
          )
        ] }),
        x.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "mt-2 text-[11.5px] text-negative-700", children: ((u = x.error) == null ? void 0 : u.message) || "Yetkilendirme adresi alınamadı." })
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
      /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "ghost", onClick: b, disabled: i.isPending, children: "Şimdilik atla" }),
      r < ke.length - 1 ? /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "primary", onClick: () => l((n) => n + 1), children: "Devam" }) : /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "primary", onClick: b, disabled: i.isPending, children: i.isPending ? "Kaydediliyor…" : "Bitir" })
    ] })
  ] }) });
}
const Xa = [
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
function Ja({ open: t, onClose: a }) {
  return /* @__PURE__ */ e.jsx(pt, { open: t, onOpenChange: (s) => {
    s || a();
  }, children: /* @__PURE__ */ e.jsxs(ft, { className: "w-full max-w-[480px] p-0", children: [
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
      Xa.map((s) => /* @__PURE__ */ e.jsxs("section", { className: "mb-4 last:mb-0", children: [
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
function Za({ polite: t, assertive: a }) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("p", { role: "status", "aria-live": "polite", className: "sr-only", children: t }),
    /* @__PURE__ */ e.jsx("p", { role: "alert", "aria-live": "assertive", className: "sr-only", children: a })
  ] });
}
const es = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
function ts({ items: t, month: a, today: s, generatedAt: r }) {
  var p;
  const l = gt(a), d = $(s), m = {};
  for (const u of t ?? [])
    (m[p = u.date.slice(0, 10)] ?? (m[p] = [])).push(u);
  const o = Me(s), c = (t ?? []).filter((u) => {
    const h = u.date.slice(0, 10);
    return h >= $(o) && h <= $(M(o, 7));
  }), { overdue: i, days: x } = kt(c, s), b = (u) => u === I.OVERDUE ? "border-l-[3px] border-l-black" : u === I.DUE_TODAY ? "border-l-[3px] border-l-neutral-500" : "border-l-[3px] border-l-neutral-300";
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-print-root hidden print:block", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-end justify-between border-b-2 border-black pb-2", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[8pt] font-bold uppercase tracking-widest text-neutral-500", children: "APYA · Takvim" }),
          /* @__PURE__ */ e.jsx("h1", { className: "mt-1 text-[22pt] font-semibold capitalize leading-none", children: D.monthTitle(a) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "text-right text-[8pt] text-neutral-500", children: [
          /* @__PURE__ */ e.jsx("p", { children: "Risk: kalın çizgi = gecikmiş · gri çizgi = bugün son gün" }),
          /* @__PURE__ */ e.jsxs("p", { children: [
            r,
            " tarihinde oluşturuldu · Sayfa 1 / 2"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "mt-3 grid grid-cols-7", children: es.map((u) => /* @__PURE__ */ e.jsx("div", { className: "pb-1 text-[7.5pt] font-bold uppercase tracking-wide text-neutral-500", children: u }, u)) }),
      /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-l border-t border-neutral-300", children: l.map((u) => {
        const h = $(u), n = m[h] ?? [], f = u.getMonth() !== a.getMonth();
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: v(
              "min-h-[62px] border-b border-r border-neutral-300 p-1",
              h === d && "ring-1 ring-inset ring-black"
            ),
            children: [
              /* @__PURE__ */ e.jsx("p", { className: v(
                "text-right font-mono text-[9pt] font-semibold",
                f ? "text-neutral-300" : "text-neutral-700"
              ), children: u.getDate() }),
              n.slice(0, 4).map((j) => /* @__PURE__ */ e.jsx(
                "p",
                {
                  className: v(
                    "mt-0.5 truncate ps-1 text-[7.5pt] leading-tight",
                    b(j.risk),
                    j.risk === I.OVERDUE ? "font-semibold" : "font-normal",
                    j.isDone && "line-through"
                  ),
                  children: j.title
                },
                j.key
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
            D.dayShort(o),
            " – ",
            D.dayShort(M(o, 6))
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
        x.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "mb-4 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "border-b border-black pb-1 text-[9pt] font-bold uppercase tracking-wide", children: [
            D.dayTitle(u.date),
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
      /* @__PURE__ */ e.jsx("span", { className: v("block text-[9pt] leading-tight", t.risk === I.OVERDUE && "font-semibold"), children: t.title }),
      /* @__PURE__ */ e.jsx("span", { className: "block text-[7.5pt] text-neutral-500", children: [
        a ? D.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
        s == null ? void 0 : s.label,
        t.subtitle,
        t.amount != null ? D.money(t.amount, t.currency) : null
      ].filter(Boolean).join(" · ") })
    ] })
  ] });
}
function as({ rows: t, days: a, capacity: s, loading: r }) {
  if (r)
    return /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1.5 text-[11.5px] text-text-tertiary", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "ekip yükü hesaplanıyor…"
    ] });
  if (!t || t.length === 0)
    return /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1.5 text-[11.5px] text-text-tertiary", children: "Bu aralıkta atanmış açık görev yok." });
  const l = (a ?? []).map($);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 px-2 pb-1", children: [
    t.map((d) => {
      const m = {};
      for (const o of d.days ?? []) m[o.date.slice(0, 10)] = o;
      return /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "truncate text-[11.5px] font-medium text-text-primary", children: d.name }),
          /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] tabular-nums text-text-tertiary", children: D.hours(d.totalHours) })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-0.5 flex gap-[2px]", children: (l.length ? l : (d.days ?? []).map((o) => o.date.slice(0, 10))).map((o) => {
          const c = m[o], i = (c == null ? void 0 : c.hours) ?? 0, x = s && i > s, b = s ? Math.min(i / s, 1) : i > 0 ? 1 : 0;
          return /* @__PURE__ */ e.jsx(
            "span",
            {
              title: `${o}: ${D.hours(i)}${c != null && c.itemCount ? ` · ${c.itemCount} öğe` : ""}`,
              className: "h-[6px] flex-1 overflow-hidden rounded-sm bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: v("block h-full", x ? "bg-negative" : "bg-accent"),
                  style: { width: `${b * 100}%` }
                }
              )
            },
            o
          );
        }) })
      ] }, d.userId);
    }),
    /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[10.5px] leading-snug text-text-tertiary", children: "Yalnız görebildiğiniz projelerin görevleri sayılır." })
  ] });
}
const ss = 6e4;
function rs({ from: t, to: a }) {
  const s = $(t), r = $(a);
  return W({
    queryKey: ["calendar", "feed", s, r],
    queryFn: () => A.get(`/api/app/calendar/feed?From=${s}&To=${r}`),
    staleTime: ss,
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
function ns() {
  const t = new URLSearchParams(window.location.search).get("view");
  if (we.includes(t)) return t;
  const a = Ct(Dt);
  return we.includes(a) ? a : null;
}
function is() {
  const t = Ct(Fe);
  if (!t) return new Set(de);
  const a = t.split(",").map(Number).filter((s) => de.includes(s));
  return a.length ? new Set(a) : new Set(de);
}
function ls({ defaultView: t = "month" } = {}) {
  const [a] = g.useState(ns), [s, r] = g.useState(() => a ?? t), [l, d] = g.useState(is);
  g.useEffect(() => {
    const x = new URL(window.location.href);
    x.searchParams.get("view") !== s && (x.searchParams.set("view", s), window.history.replaceState({}, "", x));
  }, [s]);
  const m = g.useCallback((x) => {
    we.includes(x) && (r(x), Ae(Dt, x));
  }, []), o = g.useCallback((x) => {
    d((b) => {
      const p = new Set(b);
      return p.has(x) ? p.delete(x) : p.add(x), Ae(Fe, [...p].join(",")), p;
    });
  }, []), c = g.useCallback((x) => {
    a || we.includes(x) && r((b) => b === x ? b : x);
  }, [a]), i = g.useCallback(() => {
    const x = new Set(de);
    d(x), Ae(Fe, [...x].join(","));
  }, []);
  return { view: s, setView: m, applyResponsiveDefault: c, enabledSources: l, toggleSource: o, resetSources: i };
}
const H = ["calendar", "feed"];
function os(t, a, s) {
  t.setQueriesData({ queryKey: H }, (r) => r != null && r.items ? {
    ...r,
    items: r.items.map((l) => l.key === a ? { ...l, date: `${s}T00:00:00` } : l)
  } : r);
}
function cs(t, a) {
  t.setQueriesData({ queryKey: H }, (s) => s != null && s.items ? {
    ...s,
    items: s.items.map((r) => r.key === a ? { ...r, isDone: !0, risk: 0, loadHours: null } : r)
  } : s);
}
function ds({ onOfflineFailure: t } = {}) {
  const a = U(), [s, r] = g.useState(null), [l, d] = g.useState({}), [m, o] = g.useState({}), c = g.useRef({}), i = g.useCallback((p) => {
    delete c.current[p], d((u) => {
      if (!u[p]) return u;
      const h = { ...u };
      return delete h[p], h;
    });
  }, []), x = L({
    mutationFn: ({ item: p, newDate: u }) => A.post("/api/app/calendar/reschedule-item", {
      source: p.source,
      sourceId: p.sourceId,
      newDate: $(u)
    }),
    onMutate: async ({ item: p, newDate: u }) => {
      await a.cancelQueries({ queryKey: H });
      const h = a.getQueriesData({ queryKey: H });
      return i(p.key), o((n) => ({ ...n, [p.key]: !0 })), os(a, p.key, $(u)), { snapshot: h, previousDate: p.date.slice(0, 10) };
    },
    onError: (p, { item: u, newDate: h }, n) => {
      var f;
      if (typeof navigator < "u" && !navigator.onLine) {
        t == null || t({
          key: u.key,
          payload: { source: u.source, sourceId: u.sourceId, newDate: $(h) }
        });
        return;
      }
      (f = n == null ? void 0 : n.snapshot) == null || f.forEach(([j, w]) => a.setQueryData(j, w)), c.current[u.key] = { item: u, newDate: h }, d((j) => ({
        ...j,
        [u.key]: (p == null ? void 0 : p.message) || "Kaydedilemedi — tarih değişmedi."
      }));
    },
    onSuccess: (p, { item: u, newDate: h }, n) => {
      nt(), r({
        key: u.key,
        message: `“${u.title}” ${$(h)} tarihine taşındı.`,
        undo: () => x.mutate({
          item: { ...u, date: `${$(h)}T00:00:00` },
          newDate: /* @__PURE__ */ new Date(`${n.previousDate}T00:00:00`)
        })
      });
    },
    onSettled: (p, u, { item: h }) => {
      o((n) => {
        const f = { ...n };
        return delete f[h.key], f;
      }), a.invalidateQueries({ queryKey: H });
    }
  }), b = L({
    mutationFn: ({ item: p }) => A.post("/api/app/calendar/complete-item", {
      source: p.source,
      sourceId: p.sourceId
    }),
    onMutate: async ({ item: p }) => {
      await a.cancelQueries({ queryKey: H });
      const u = a.getQueriesData({ queryKey: H });
      return i(p.key), o((h) => ({ ...h, [p.key]: !0 })), cs(a, p.key), { snapshot: u };
    },
    onError: (p, { item: u }, h) => {
      var n;
      (n = h == null ? void 0 : h.snapshot) == null || n.forEach(([f, j]) => a.setQueryData(f, j)), c.current[u.key] = { item: u }, d((f) => ({
        ...f,
        [u.key]: (p == null ? void 0 : p.message) || "Tamamlanamadı."
      }));
    },
    onSuccess: (p, { item: u }) => {
      nt(), r({ key: u.key, message: `“${u.title}” tamamlandı.`, undo: null });
    },
    onSettled: (p, u, { item: h }) => {
      o((n) => {
        const f = { ...n };
        return delete f[h.key], f;
      }), a.invalidateQueries({ queryKey: H });
    }
  });
  return {
    reschedule: (p, u) => x.mutate({ item: p, newDate: u }),
    complete: (p) => b.mutate({ item: p }),
    retry: (p, u) => u ? x.mutate({ item: p, newDate: u }) : b.mutate({ item: p }),
    /** Reddedilen son işlemi aynen yineler; kayıt yoksa yalnız hata şeridini kapatır. */
    retryFailed: (p) => {
      const u = c.current[p];
      if (!u) {
        i(p);
        return;
      }
      u.newDate ? x.mutate({ item: u.item, newDate: u.newDate }) : b.mutate({ item: u.item });
    },
    lastAction: s,
    dismissAction: () => r(null),
    errors: l,
    clearError: i,
    pending: m
  };
}
function us({ from: t, to: a, enabled: s = !0 }) {
  const r = $(t), l = $(a);
  return W({
    queryKey: ["calendar", "external", r, l],
    queryFn: () => A.get(`/api/app/calendar/external-events?From=${r}&To=${l}`),
    enabled: s,
    staleTime: 12e4,
    retry: !1,
    placeholderData: (d) => d
  });
}
const xs = ["INPUT", "TEXTAREA", "SELECT"];
function ms({
  onView: t,
  onToday: a,
  onPrev: s,
  onNext: r,
  onDeferSelected: l,
  onUndo: d,
  onToggleHelp: m,
  enabled: o = !0
}) {
  g.useEffect(() => {
    if (!o) return;
    const c = (i) => {
      const x = i.target;
      if (!(xs.includes(x == null ? void 0 : x.tagName) || x != null && x.isContentEditable)) {
        if ((i.metaKey || i.ctrlKey) && i.key.toLowerCase() === "z") {
          i.preventDefault(), d == null || d();
          return;
        }
        if (!(i.metaKey || i.ctrlKey || i.altKey)) {
          if (i.shiftKey) {
            i.key === "ArrowRight" && (i.preventDefault(), l == null || l(1)), i.key === "ArrowLeft" && (i.preventDefault(), l == null || l(-1)), i.key === "?" && (i.preventDefault(), m == null || m());
            return;
          }
          switch (i.key) {
            case "?":
              i.preventDefault(), m == null || m();
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
    return window.addEventListener("keydown", c), () => window.removeEventListener("keydown", c);
  }, [o, t, a, s, r, l, d, m]);
}
function ps({ from: t, to: a, enabled: s }) {
  const r = $(t), l = $(a);
  return W({
    queryKey: ["calendar", "team-load", r, l],
    queryFn: () => A.get(`/api/app/calendar/team-load?From=${r}&To=${l}`),
    enabled: s,
    staleTime: 6e4
  });
}
const Tt = () => Qt("apya.calendar.offlineQueue");
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
  const [a, s] = g.useState(() => typeof navigator > "u" ? !0 : navigator.onLine), [r, l] = g.useState(() => Ke().length), d = g.useRef(!1), m = g.useCallback((c) => {
    const x = Ke().filter((b) => b.key !== c.key).concat(c);
    ut(x), l(x.length);
  }, []), o = g.useCallback(async () => {
    if (d.current) return;
    const c = Ke();
    if (c.length !== 0) {
      d.current = !0;
      try {
        const i = [];
        for (const x of c)
          try {
            await t(x);
          } catch (b) {
            Ut(b) || i.push(x);
          }
        ut(i), l(i.length);
      } finally {
        d.current = !1;
      }
    }
  }, [t]);
  return g.useEffect(() => {
    const c = () => {
      s(!0), o();
    }, i = () => s(!1);
    return window.addEventListener("online", c), window.addEventListener("offline", i), navigator.onLine && o(), () => {
      window.removeEventListener("online", c), window.removeEventListener("offline", i);
    };
  }, [o]), { isOnline: a, pendingCount: r, enqueue: m, flush: o };
}
function bs() {
  const t = g.useRef(null), [a, s] = g.useState(0);
  return g.useLayoutEffect(() => {
    const r = t.current;
    if (!r || (s(r.getBoundingClientRect().width), typeof ResizeObserver > "u")) return;
    const l = new ResizeObserver((d) => {
      for (const m of d)
        s(m.contentRect.width);
    });
    return l.observe(r), () => l.disconnect();
  }, []), [t, a];
}
function hs(t) {
  return t === 0 || t >= 1180 ? "wide" : t >= 780 ? "medium" : "narrow";
}
const gs = 60;
function ve(t, a, s) {
  return a === "week" ? M(t, 7 * s) : a === "day" ? M(t, s) : new Date(t.getFullYear(), t.getMonth() + s, 1);
}
function ys() {
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Array.from({ length: 7 }, (t, a) => /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-2", children: /* @__PURE__ */ e.jsx(ce, { height: 10 }) }, a)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: Array.from({ length: Le }, (t, a) => /* @__PURE__ */ e.jsxs("div", { className: "min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0", children: [
      /* @__PURE__ */ e.jsx(ce, { height: 12, width: "40%", className: "ml-auto" }),
      a % 3 === 0 && /* @__PURE__ */ e.jsx(ce, { height: 14, className: "mt-2" })
    ] }, a)) })
  ] });
}
function ks() {
  var Xe, ge, Je, Ze, et, tt, at, st;
  const [t, a] = bs(), s = hs(a), r = s === "narrow", l = g.useMemo(() => Ie(/* @__PURE__ */ new Date()), []), [d, m] = g.useState(l), [o, c] = g.useState(null), [i, x] = g.useState(null), [b, p] = g.useState(!1), [u, h] = g.useState(!1), [n, f] = g.useState(!1), [j, w] = g.useState(!1), [T, N] = g.useState(null), [y, K] = g.useState(!1), { view: S, setView: E, applyResponsiveDefault: F, enabledSources: V, toggleSource: De, resetSources: X } = ls();
  g.useEffect(() => {
    a !== 0 && F(r ? "agenda" : "month");
  }, [a, r, F]);
  const { range: B, title: ne, weekDayList: te } = g.useMemo(() => {
    if (S === "agenda")
      return {
        range: { from: M(l, -60), to: M(l, gs) },
        title: "Ajanda",
        weekDayList: null
      };
    if (S === "week") {
      const R = ta(d);
      return {
        range: { from: R[0], to: R[6] },
        title: `${D.dayShort(R[0])} – ${D.dayShort(R[6])} ${R[6].getFullYear()}`,
        weekDayList: R
      };
    }
    if (S === "day") {
      const R = Ie(d);
      return { range: { from: R, to: R }, title: D.dayTitle(R), weekDayList: [R] };
    }
    const k = ht(d);
    return {
      range: { from: k, to: M(k, Le - 1) },
      title: D.monthTitle(d),
      weekDayList: null
    };
  }, [S, d, l]), { data: C, error: J, isPending: ae, isError: _e, isFetching: Et, isPlaceholderData: $t, refetch: Ge } = rs(B), me = _e && !C, Ce = `${$(B.from)}/${$(B.to)}`, [pe, Ye] = g.useState(null), se = (pe == null ? void 0 : pe.feedKey) === Ce, Rt = () => {
    Ye({ feedKey: Ce, error: J }), Ge().finally(() => Ye((k) => (k == null ? void 0 : k.feedKey) === Ce ? null : k));
  }, Ue = g.useId(), _ = us(B), Qe = Ya(), Te = ps({ from: B.from, to: B.to, enabled: y });
  Yt();
  const q = fs({
    onFlush: (k) => A.post("/api/app/calendar/reschedule-item", k.payload)
  }), fe = g.useMemo(
    () => {
      var k;
      return [...(C == null ? void 0 : C.items) ?? [], ...((k = _.data) == null ? void 0 : k.items) ?? []];
    },
    [C, _.data]
  ), Q = g.useMemo(
    () => fe.filter((k) => V.has(k.source)),
    [fe, V]
  ), G = g.useMemo(() => yt(Q), [Q]), Y = (C == null ? void 0 : C.dailyCapacityHours) ?? null, He = g.useMemo(() => {
    const k = {};
    for (const R of (C == null ? void 0 : C.sources) ?? []) k[R.source] = R.count;
    return k;
  }, [C]), zt = g.useMemo(() => Y ? Object.values(G).filter((k) => Se(k) > Y).length : 0, [G, Y]), We = g.useMemo(() => {
    var rt;
    let k = 0, R = 0;
    for (const le of Q)
      le.isDone || (le.risk === I.OVERDUE ? k++ : le.risk === I.DUE_TODAY && R++);
    const Z = (((rt = _.data) == null ? void 0 : rt.accounts) ?? []).filter((le) => le.error).length;
    return { overdue: k, dueToday: R, syncError: Z };
  }, [Q, _.data]), Ee = g.useMemo(
    () => ((C == null ? void 0 : C.sources) ?? []).filter((k) => k.isAvailable),
    [C]
  ), At = g.useMemo(
    () => Ee.filter((k) => !V.has(k.source)).length,
    [Ee, V]
  ), Kt = g.useMemo(() => {
    var R;
    const k = (((R = _.data) == null ? void 0 : R.accounts) ?? []).map((Z) => Z.lastSyncTime).filter(Boolean).sort();
    return k.length ? k[k.length - 1] : null;
  }, [_.data]);
  g.useEffect(() => {
    o && !G[o] && !ae && (o >= $(B.from) && o <= $(B.to) || c(null));
  }, [o, G, ae, B]);
  const be = g.useCallback((k) => x(k.key), []), Ve = g.useCallback(() => {
    m(l), c($(l));
  }, [l]), P = ds({ onOfflineFailure: q.enqueue }), he = !!((Je = (ge = (Xe = window.abp) == null ? void 0 : Xe.auth) == null ? void 0 : ge.isGranted) != null && Je.call(ge, "Platform.Tasks.Create")), Pt = g.useCallback((k) => {
    const R = T ?? o;
    if (R)
      for (const Z of G[R] ?? [])
        Z.canReschedule && !Z.isDone && P.reschedule(Z, M(/* @__PURE__ */ new Date("T00:00:00"), k));
  }, [T, o, G, P]);
  ms({
    onView: E,
    onToday: Ve,
    onPrev: () => m((k) => ve(k, S, -1)),
    onNext: () => m((k) => ve(k, S, 1)),
    onDeferSelected: Pt,
    onUndo: () => {
      var k, R;
      return (R = (k = P.lastAction) == null ? void 0 : k.undo) == null ? void 0 : R.call(k);
    },
    onToggleHelp: () => w((k) => !k)
  });
  const $e = fe.length > 0, It = $e && Q.length === 0, Ot = o ? G[o] ?? [] : [], ie = i ? fe.find((k) => k.key === i) ?? null : null, Re = o && /* @__PURE__ */ e.jsx(
    la,
    {
      dayKey: o,
      items: Ot,
      capacity: Y,
      onSelectItem: be,
      onClose: () => c(null)
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { ref: t, className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsx(
      ka,
      {
        title: ne,
        view: S,
        onView: E,
        onPrev: () => m((k) => ve(k, S, -1)),
        onNext: () => m((k) => ve(k, S, 1)),
        onToday: Ve,
        overloadDays: zt,
        onHelp: () => w(!0),
        filterCount: At,
        onClearFilters: X,
        lastSyncAt: Kt,
        syncError: We.syncError > 0,
        compact: r,
        canCreateTask: he
      }
    ),
    _e && !me && !Ft(J) && /* @__PURE__ */ e.jsxs("div", { role: "alert", className: "flex flex-wrap items-center gap-2 rounded-card border border-negative-100 bg-negative-50 px-3 py-2 text-[12.5px] text-negative-700", children: [
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
          /* @__PURE__ */ e.jsx("i", { className: v("fa", q.isOnline ? "fa-cloud-arrow-up" : "fa-wifi"), "aria-hidden": "true" }),
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
    /* @__PURE__ */ e.jsxs("div", { className: v("flex gap-3", r ? "flex-col" : "flex-row items-start"), children: [
      !r && !se && (ae || Ee.length > 0) && /* @__PURE__ */ e.jsx("div", { className: v("shrink-0", s === "wide" ? "w-[240px]" : "w-auto"), children: /* @__PURE__ */ e.jsx(
        ba,
        {
          sources: (C == null ? void 0 : C.sources) ?? [],
          counts: He,
          enabled: V,
          onToggle: De,
          compact: s !== "wide",
          externalAccounts: ((Ze = _.data) == null ? void 0 : Ze.accounts) ?? [],
          externalLoading: _.isFetching,
          onOpenSync: () => p(!0),
          teamOpen: y,
          onToggleTeam: () => K((k) => !k),
          teamContent: y ? /* @__PURE__ */ e.jsx(
            as,
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
        ae && !se ? /* @__PURE__ */ e.jsx(ys, {}) : me || se ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
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
          ma,
          {
            month: d,
            byDay: G,
            today: l,
            capacity: Y,
            selectedDay: o,
            onSelectItem: be,
            onSelectDay: c,
            onDropItem: P.reschedule,
            focusedDay: T,
            onFocusDay: N,
            onNavigate: (k) => m(k),
            pending: P.pending,
            errors: P.errors
          }
        ) : te ? /* @__PURE__ */ e.jsx(
          wa,
          {
            days: te,
            byDay: G,
            today: l,
            capacity: Y,
            selectedDay: o,
            onSelectItem: be,
            onSelectDay: c
          }
        ) : /* @__PURE__ */ e.jsx(
          ia,
          {
            items: Q,
            today: l,
            onSelectItem: be,
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
      s === "wide" && o && /* @__PURE__ */ e.jsx("div", { className: "w-[340px] shrink-0 self-stretch", children: Re })
    ] }),
    s === "medium" && o && /* @__PURE__ */ e.jsx(ue, { open: !0, onOpenChange: (k) => {
      k || c(null);
    }, children: /* @__PURE__ */ e.jsx(xe, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: Re }) }),
    r && o && /* @__PURE__ */ e.jsx(ue, { open: !0, onOpenChange: (k) => {
      k || c(null);
    }, children: /* @__PURE__ */ e.jsx(xe, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: Re }) }),
    r && he && /* @__PURE__ */ e.jsx(ya, {}),
    /* @__PURE__ */ e.jsx(
      ts,
      {
        items: Q,
        month: d,
        today: l,
        generatedAt: D.dayShort(l)
      }
    ),
    /* @__PURE__ */ e.jsx(Ja, { open: j, onClose: () => w(!1) }),
    /* @__PURE__ */ e.jsx(
      Za,
      {
        polite: ((et = P.lastAction) == null ? void 0 : et.message) ?? "",
        assertive: ((st = (at = (tt = _.data) == null ? void 0 : tt.accounts) == null ? void 0 : at.find((k) => k.error)) == null ? void 0 : st.error) ?? ""
      }
    ),
    /* @__PURE__ */ e.jsx(Ga, { open: b, onClose: () => p(!1) }),
    /* @__PURE__ */ e.jsx(
      Ha,
      {
        open: u,
        items: Q,
        today: l,
        capacity: Y,
        onClose: () => h(!1)
      }
    ),
    /* @__PURE__ */ e.jsx(
      Va,
      {
        open: Qe.data ? !Qe.data.setupCompleted && !n : !1,
        counts: He,
        onDone: () => f(!0)
      }
    ),
    ie && /* @__PURE__ */ e.jsx(
      Ca,
      {
        item: ie,
        capacity: Y,
        onClose: () => x(null),
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
xt && Mt(
  xt,
  "calendar",
  /* @__PURE__ */ e.jsx(Lt, { children: /* @__PURE__ */ e.jsx(Bt, { children: /* @__PURE__ */ e.jsx(qt, { children: /* @__PURE__ */ e.jsx(ks, {}) }) }) })
);
