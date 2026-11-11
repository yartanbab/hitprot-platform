import { j as e, b as ve, r as g } from "./react-vendor-D7YDiBbi.js";
import { E as re, R as mt, t as Mt, w as Lt, m as qt } from "./index-DgpuJ91w.js";
import { c as k, B as z, S as xe, b as me, D as pt, g as ft, T as Bt } from "./Dialog-BHF0cPzq.js";
import { D as Gt } from "./useDeviceMode-Bkxjujsr.js";
import { a as _t } from "./QueryProvider-D2Hvqdr9.js";
import { S as de } from "./Skeleton-0zr_K-5W.js";
import { a as K } from "./httpClient-BNoyY5yK.js";
import { d as Yt } from "./draggableActivation-Ybw9Upbh.js";
import { u as X, b as q, a as H } from "./query-vendor-Db2mwxYI.js";
import { e as Ut, m as nt, u as Qt } from "./dataChanged-CDwwWMH8.js";
import { i as Ht, s as Wt } from "./permanentRejection-SvaBclz0.js";
const F = {
  1: { key: "task", label: "Görev", plural: "görev", icon: "fa-circle-check", railLabel: "Görevler" },
  2: { key: "invoice", label: "Fatura", plural: "fatura", icon: "fa-file-invoice", railLabel: "Faturalar" },
  3: { key: "grant", label: "Hibe", plural: "hibe", icon: "fa-award", railLabel: "Hibe son tarihleri" },
  4: { key: "expense", label: "Gider", plural: "gider", icon: "fa-arrow-trend-down", railLabel: "Gider / gelir" },
  5: { key: "income", label: "Gelir", plural: "gelir", icon: "fa-arrow-trend-up", railLabel: "Gider / gelir" },
  6: { key: "cash", label: "Kasa hareketi", plural: "kasa hareketi", icon: "fa-wallet", railLabel: "Nakit hareketleri" },
  7: { key: "external", label: "Dış etkinlik", plural: "dış etkinlik", icon: "fa-calendar-days", railLabel: "Dış etkinlikler" }
}, ue = [1, 2, 3, 4, 5, 6, 7], Vt = [
  { key: "task", sources: [1] },
  { key: "invoice", sources: [2] },
  { key: "grant", sources: [3] },
  { key: "money", sources: [4, 5] },
  { key: "cash", sources: [6] }
], Ie = [1, 2, 3, 4, 5, 6], P = { DUE_TODAY: 1, OVERDUE: 2 }, Xt = (t) => t.risk === P.OVERDUE || t.risk === P.DUE_TODAY, bt = 864e5, Pe = (t) => new Date(t.getFullYear(), t.getMonth(), t.getDate()), L = (t, a) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + a);
function E(t) {
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
const Jt = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }), Zt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }), ea = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }), C = {
  monthTitle: (t) => Jt.format(t),
  dayTitle: (t) => Zt.format(t),
  dayShort: (t) => ea.format(t),
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
const De = (t) => (t ?? []).reduce((a, s) => a + (s.loadHours ?? 0), 0);
function ta(t, { maxPills: a = 3, maxRiskPills: s = 2 } = {}) {
  const r = t ?? [];
  if (r.length === 0) return { pills: [], summaries: [] };
  if (r.length <= a) return { pills: r, summaries: [] };
  const c = r.filter(Xt).slice(0, s), p = new Set(c.map((i) => i.key)), u = /* @__PURE__ */ new Map();
  for (const i of r) {
    if (p.has(i.key)) continue;
    const x = u.get(i.source) ?? { source: i.source, count: 0, amount: 0, hasAmount: !1, only: null };
    x.count += 1, x.only = x.count === 1 ? i : null, i.amount != null && (x.amount += i.amount, x.hasAmount = !0), u.set(i.source, x);
  }
  const o = [];
  for (const i of ue) {
    const x = u.get(i);
    x && (x.count === 1 && x.only ? c.push(x.only) : o.push(x));
  }
  return { pills: c, summaries: o };
}
function aa(t, { compact: a = !0 } = {}) {
  const s = F[t.source], r = `${t.count} ${s ? s.plural : "öğe"}`;
  if (!t.hasAmount) return r;
  const l = a ? C.moneyCompact(t.amount) : C.money(t.amount);
  return `${r} · ${l}`;
}
function vt(t, a) {
  const s = E(a), r = (t ?? []).filter((o) => !o.isDone), l = r.filter((o) => o.date.slice(0, 10) < s && o.risk === P.OVERDUE), c = r.filter((o) => o.date.slice(0, 10) >= s), p = yt(c), u = Object.keys(p).sort().map((o) => ({
    key: o,
    date: /* @__PURE__ */ new Date(`${o}T00:00:00`),
    isToday: o === s,
    items: p[o]
  }));
  return { overdue: l, days: u };
}
function sa(t) {
  const a = Me(Pe(t));
  return Array.from({ length: 7 }, (s, r) => L(a, r));
}
const ra = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }), ze = (t) => t ? ra.format(new Date(t)) : "";
function Ne(t) {
  const a = new Date(t);
  return a.getHours() * 60 + a.getMinutes();
}
function na(t) {
  let a = 8, s = 18;
  for (const r of t ?? [])
    r.startTime && (a = Math.min(a, Math.floor(Ne(r.startTime) / 60)), s = Math.max(s, Math.ceil(Ne(r.endTime ?? r.startTime) / 60)));
  return { start: Math.max(0, a), end: Math.min(24, Math.max(s, a + 4)) };
}
const it = (t) => !!t.startTime, lt = (t) => t.getDay() === 0 || t.getDay() === 6;
function ia(t, { today: a, capacity: s = null, horizonDays: r = 21, fallbackPerDay: l = 3 } = {}) {
  const c = E(a), p = (t ?? []).filter((h) => !h.isDone), u = p.filter((h) => h.date.slice(0, 10) < c && h.risk === P.OVERDUE), o = u.filter((h) => h.canReschedule), i = u.filter((h) => !h.canReschedule), x = {}, b = {};
  for (const h of p) {
    const n = h.date.slice(0, 10);
    n < c || (x[n] = (x[n] ?? 0) + (h.loadHours ?? 0), b[n] = (b[n] ?? 0) + 1);
  }
  const f = [];
  let d = 0;
  for (const h of o) {
    let n = null;
    for (; d < r; ) {
      const m = L(a, d);
      if (lt(m)) {
        d += 1;
        continue;
      }
      const v = E(m), S = x[v] ?? 0, $ = b[v] ?? 0, j = h.loadHours ?? 0, w = s && j > s;
      if (s && !w ? S + j <= s : $ < l) {
        x[v] = S + j, b[v] = $ + 1, n = m;
        break;
      }
      d += 1;
    }
    if (!n) {
      let m = L(a, r);
      for (; lt(m); ) m = L(m, 1);
      n = m;
    }
    f.push({ item: h, date: n });
  }
  return { suggestions: f, fixed: i };
}
const la = {
  [P.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [P.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function Oe({ item: t, onSelect: a, showDate: s = !1 }) {
  const r = F[t.source], l = la[t.risk];
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
function oa({ items: t, today: a, onSelectItem: s, onSmartDefer: r }) {
  const { overdue: l, days: c } = vt(t, a);
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
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: p.items.map((u) => /* @__PURE__ */ e.jsx(Oe, { item: u, onSelect: s }, u.key)) })
    ] }, p.key))
  ] });
}
function ca({ dayKey: t, items: a, capacity: s, onSelectItem: r, onClose: l }) {
  const c = /* @__PURE__ */ new Date(`${t}T00:00:00`), p = De(a), u = s && p > s, o = a.reduce((i, x) => (i[x.source] = (i[x.source] ?? 0) + 1, i), {});
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: C.dayTitle(c) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(o).length === 0 ? "Planlanmış öğe yok" : Object.entries(o).map(([i, x]) => {
          var b;
          return `${x} ${((b = F[i]) == null ? void 0 : b.plural) ?? "öğe"}`;
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
      u ? "border-negative-100 bg-negative-50 text-negative-700" : "border-subtle text-text-secondary"
    ), children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-semibold", children: u ? "Kapasite aşımı" : "Gün yükü" }),
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
const da = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], ua = {
  [P.OVERDUE]: {
    /* Maketteki sol kenar çubuğu: pill'i okumadan da "bu gecikmiş" denir. */
    pill: "border-l-2 border-negative bg-negative-50 text-negative-700",
    /* çapraz tarama */
    pattern: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,.07) 3px, rgba(0,0,0,.07) 5px)"
  },
  [P.DUE_TODAY]: {
    pill: "border-l-2 border-warning bg-warning-50 text-warning-700",
    /* dikey çizgi */
    pattern: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,.06) 4px, rgba(0,0,0,.06) 5px)"
  }
};
function xa({ item: t, onSelect: a, onDragStart: s, isPending: r, hasError: l }) {
  const c = F[t.source], p = ua[t.risk], u = t.canReschedule && !t.isDone, o = Yt(() => a(t));
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: u,
      onDragStart: u ? (i) => {
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
        u && "cursor-grab active:cursor-grabbing",
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
function ma({ summary: t, onSelect: a }) {
  const s = F[t.source];
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
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: aa(t) })
      ]
    }
  );
}
function pa({ load: t, capacity: a }) {
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
function fa({
  month: t,
  byDay: a,
  today: s,
  capacity: r,
  onSelectItem: l,
  onSelectDay: c,
  selectedDay: p,
  onDropItem: u,
  pending: o = {},
  errors: i = {},
  focusedDay: x,
  onFocusDay: b,
  onNavigate: f
}) {
  const d = gt(t), h = E(s), [n, m] = ve.useState(null), [v, S] = ve.useState(null), $ = ve.useRef(null), j = x ?? p ?? h, w = (D) => {
    const N = L(/* @__PURE__ */ new Date(`${j}T00:00:00`), D);
    d.some((M) => E(M) === E(N)) || f == null || f(N), b == null || b(E(N));
  }, A = (D) => {
    const N = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[D.key];
    if (N) {
      D.preventDefault(), w(N);
      return;
    }
    (D.key === "Enter" || D.key === " ") && (D.preventDefault(), c(j));
  };
  return ve.useEffect(() => {
    var N, M;
    const D = (N = $.current) == null ? void 0 : N.querySelector(`[data-day="${j}"]`);
    D && ((M = $.current) != null && M.contains(document.activeElement)) && D.focus();
  }, [j]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: da.map((D, N) => /* @__PURE__ */ e.jsx(
      "div",
      {
        className: k(
          "px-2.5 py-2 text-right text-[10.5px] font-bold uppercase tracking-wider",
          N > 4 ? "text-text-tertiary opacity-70" : "text-text-tertiary"
        ),
        children: D
      },
      D
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
        children: d.map((D) => {
          const N = E(D), M = a[N] ?? [], { pills: _, summaries: Ce } = ta(M), J = De(M), O = D.getMonth() !== t.getMonth(), ne = N === h, te = N === p;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              role: "gridcell",
              "data-day": N,
              tabIndex: N === j ? 0 : -1,
              "aria-selected": te,
              "aria-label": `${C.dayTitle(D)}${M.length ? `, ${M.length} öğe` : ", boş"}`,
              onClick: () => {
                b == null || b(N), c(N);
              },
              onDragOver: n ? (T) => {
                T.preventDefault(), T.dataTransfer.dropEffect = "move", v !== N && S(N);
              } : void 0,
              onDragLeave: n ? () => S((T) => T === N ? null : T) : void 0,
              onDrop: n ? (T) => {
                T.preventDefault();
                const Z = n;
                m(null), S(null), Z && Z.date.slice(0, 10) !== N && u(Z, /* @__PURE__ */ new Date(`${N}T00:00:00`));
              } : void 0,
              className: k(
                "flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5",
                "transition-colors duration-fast last:border-r-0 hover:bg-surface-hover",
                O ? "bg-surface-sunken" : "bg-surface-base",
                te && "ring-2 ring-inset ring-border-focus",
                v === N && "bg-primary-subtle ring-2 ring-inset ring-accent"
              ),
              children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                  J > 0 && r && J > r && /* @__PURE__ */ e.jsx("span", { className: "rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: C.hours(J) }),
                  /* @__PURE__ */ e.jsx(
                    "span",
                    {
                      className: k(
                        "ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11.5px] font-semibold leading-none tabular-nums",
                        ne && "bg-accent text-white",
                        !ne && O && "text-text-tertiary opacity-60",
                        !ne && !O && "text-text-secondary"
                      ),
                      children: D.getDate()
                    }
                  )
                ] }),
                _.map((T) => /* @__PURE__ */ e.jsx(
                  xa,
                  {
                    item: T,
                    onSelect: l,
                    onDragStart: m,
                    isPending: !!o[T.key],
                    hasError: !!i[T.key]
                  },
                  T.key
                )),
                Ce.map((T) => /* @__PURE__ */ e.jsx(
                  ma,
                  {
                    summary: T,
                    onSelect: () => c(N)
                  },
                  `${N}-${T.source}`
                )),
                /* @__PURE__ */ e.jsx(pa, { load: J, capacity: r })
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
function ha(t) {
  const a = String(t ?? "").trim().split(/\s+/).filter(Boolean);
  return a.length === 0 ? "?" : a.length === 1 ? a[0].slice(0, 2).toLocaleUpperCase("tr") : (a[0][0] + a[a.length - 1][0]).toLocaleUpperCase("tr");
}
function ga({
  sources: t,
  counts: a,
  enabled: s,
  onToggle: r,
  compact: l = !1,
  externalAccounts: c = [],
  externalLoading: p = !1,
  onOpenSync: u,
  teamOpen: o = !1,
  onToggleTeam: i,
  teamContent: x,
  teamMembers: b = [],
  riskCounts: f
}) {
  const d = (t ?? []).filter((m) => m.isAvailable);
  if (d.length === 0) return null;
  const h = new Set(d.map((m) => m.source)), n = Vt.map(({ key: m, sources: v }) => {
    const S = v.filter(($) => h.has($));
    return S.length === 0 ? null : {
      key: m,
      sources: S,
      meta: F[S[0]],
      /* Grubun tamamı kapalıysa kapalı sayılır — biri açıksa satır açıktır. */
      isOn: S.some(($) => s.has($)),
      count: S.reduce(($, j) => $ + (a[j] ?? 0), 0)
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
        n.map(({ key: m, sources: v, meta: S, isOn: $, count: j }) => S ? /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": $,
            title: l ? `${S.railLabel ?? S.label} — ${j} öğe` : void 0,
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
                  children: /* @__PURE__ */ e.jsx("i", { className: k("fa", S.icon) })
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
                /* @__PURE__ */ e.jsx("span", { className: k("flex-1 truncate text-[12.5px] font-medium", !$ && "line-through decoration-1"), children: S.railLabel ?? S.label }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: j })
              ] })
            ]
          },
          m
        ) : null),
        !l && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex items-center justify-between border-t border-subtle px-2 pb-1 pt-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Dış takvimler" }),
            u && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: u,
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
          c.map((m) => /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: k(
                "flex items-start gap-2 rounded-md px-2 py-1.5",
                m.error && "bg-negative-50"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: k(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px]",
                      m.error ? "bg-negative-100 text-negative-700" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: k("fa", m.error ? "fa-triangle-exclamation" : "fa-calendar-days") })
                  }
                ),
                /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: ba[m.provider] ?? "Takvim" }),
                  /* @__PURE__ */ e.jsx("span", { className: k(
                    "block truncate text-[10.5px]",
                    m.error ? "text-negative-700" : "text-text-tertiary"
                  ), children: m.error ?? `${m.email} · ${m.eventCount} etkinlik` }),
                  m.error && /* @__PURE__ */ e.jsx("a", { href: "/Calendars", className: "text-[10.5px] font-semibold text-text-link hover:underline", children: "Yeniden bağla" })
                ] })
              ]
            },
            m.accountId
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
            b.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-1 px-2 pb-1", children: [
              b.slice(0, 3).map((m) => /* @__PURE__ */ e.jsxs(
                "span",
                {
                  title: m.name,
                  className: "flex items-center gap-1 rounded-full bg-neutral-subtle py-0.5 pe-2 ps-0.5 text-[10.5px] text-text-secondary",
                  children: [
                    /* @__PURE__ */ e.jsx(
                      "span",
                      {
                        className: "flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[8.5px] font-bold text-[color:var(--apya-avatar-fg)]",
                        "aria-hidden": "true",
                        children: ha(m.name)
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { className: "max-w-[86px] truncate", children: m.name })
                  ]
                },
                m.userId
              )),
              b.length > 3 && /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-medium text-text-tertiary", children: [
                "+",
                b.length - 3
              ] })
            ] }),
            x
          ] }),
          f && (f.overdue > 0 || f.dueToday > 0 || f.syncError > 0) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("p", { className: "mt-2 border-t border-subtle px-2 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Risk" }),
            [
              { key: "overdue", label: "Gecikmiş", value: f.overdue, dot: "bg-negative" },
              { key: "dueToday", label: "Bugün son gün", value: f.dueToday, dot: "bg-warning" },
              { key: "syncError", label: "Senkron hatası", value: f.syncError, dot: "bg-negative-700" }
            ].filter((m) => m.value > 0).map((m) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-2 py-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: k("h-[7px] w-[7px] shrink-0 rounded-full", m.dot), "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[11.5px] text-text-secondary", children: m.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-primary", children: m.value })
            ] }, m.key))
          ] }),
          u && /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: u,
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
const ya = { month: "Ay", week: "Hafta", day: "Gün", agenda: "Ajanda" };
function va(t) {
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
function we() {
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
      onClick: we,
      "aria-label": "Yeni görev",
      title: "Yeni görev",
      style: { bottom: "calc(1rem + env(safe-area-inset-bottom))" },
      className: "fixed right-4 z-fixed grid h-14 w-14 place-items-center rounded-full bg-accent text-text-inverse shadow-lg transition-colors duration-fast hover:bg-accent-600 active:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
      children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus text-[19px]", "aria-hidden": "true" })
    }
  );
}
function ja({
  title: t,
  view: a,
  onView: s,
  onPrev: r,
  onNext: l,
  onToday: c,
  overloadDays: p,
  onHelp: u,
  filterCount: o = 0,
  onClearFilters: i,
  lastSyncAt: x,
  syncError: b = !1,
  canCreateTask: f = !0,
  compact: d = !1,
  icsHref: h = null
}) {
  const n = a !== "agenda", m = va(x);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    n && /* @__PURE__ */ e.jsxs("div", { className: "flex", children: [
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
      (m || b) && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: k(
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium",
            b ? "bg-negative-50 text-negative-700" : "text-text-tertiary"
          ),
          title: b ? "Bir dış takvim senkronlanamıyor" : "Dış takvimlerin son senkron zamanı",
          children: [
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: k("h-[6px] w-[6px] rounded-full", b ? "bg-negative" : "bg-positive"),
                "aria-hidden": "true"
              }
            ),
            "Senkron",
            m ? ` · ${m}` : ""
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
      !d && /* @__PURE__ */ e.jsxs(
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
      h && !d && /* @__PURE__ */ e.jsxs(
        "a",
        {
          href: h,
          download: !0,
          title: "Görünen aralığı takvim dosyası (.ics) olarak indir",
          className: "flex h-9 items-center rounded-md border border-default bg-surface-base px-2.5 text-[12px] text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-download", "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "sr-only", children: "Takvim dosyası indir (.ics)" })
          ]
        }
      ),
      u && !d && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: u,
          title: "Klavye kısayolları (?)",
          "aria-label": "Klavye kısayolları",
          className: "h-9 w-9 rounded-md border border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-keyboard", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(ya).map(([v, S]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": a === v,
          onClick: () => s(v),
          className: k(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            a === v ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: S
        },
        v
      )) }),
      f && !d && /* @__PURE__ */ e.jsxs(z, { variant: "primary", size: "sm", onClick: we, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus me-1.5", "aria-hidden": "true" }),
        "Yeni görev"
      ] })
    ] })
  ] });
}
const ee = 44, Na = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], wa = {
  [P.OVERDUE]: "bg-negative-50 text-negative-700",
  [P.DUE_TODAY]: "bg-warning-50 text-warning-700"
};
function Sa({ load: t, capacity: a }) {
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
function Da({ days: t, byDay: a, today: s, capacity: r, onSelectItem: l, onSelectDay: c, selectedDay: p }) {
  const u = E(s), o = g.useRef(null), [i, x] = g.useState(() => {
    const j = /* @__PURE__ */ new Date();
    return j.getHours() * 60 + j.getMinutes();
  });
  g.useEffect(() => {
    const j = setInterval(() => {
      const w = /* @__PURE__ */ new Date();
      x(w.getHours() * 60 + w.getMinutes());
    }, 6e4);
    return () => clearInterval(j);
  }, []);
  const b = t.map(E), f = {}, d = {};
  for (const j of b) {
    const w = a[j] ?? [];
    f[j] = w.filter(it), d[j] = w.filter((A) => !it(A));
  }
  const h = b.flatMap((j) => f[j]), { start: n, end: m } = na(h), v = Array.from({ length: m - n }, (j, w) => n + w), S = (m - n) * ee, $ = b.includes(u) && i >= n * 60 && i <= m * 60;
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
            const w = E(j), A = De(a[w] ?? []), D = w === u;
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
                      D ? "text-accent" : "text-text-tertiary"
                    ), children: Na[(j.getDay() + 6) % 7] }),
                    /* @__PURE__ */ e.jsx("span", { className: k(
                      "font-mono text-[13px] font-semibold tabular-nums",
                      D ? "text-accent" : "text-text-primary"
                    ), children: j.getDate() }),
                    r && A > r && /* @__PURE__ */ e.jsx("span", { className: "ms-auto rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: C.hours(A) })
                  ] }),
                  /* @__PURE__ */ e.jsx(Sa, { load: A, capacity: r })
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
          b.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-[46px] flex-col gap-[3px] border-l border-subtle p-1", children: [
            d[j].slice(0, 4).map((w) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => l(w),
                title: w.title,
                className: k(
                  "flex w-full items-center gap-1 truncate rounded-[5px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                  wa[w.risk] ?? "bg-neutral-subtle text-text-primary",
                  w.isDone && "line-through opacity-65"
                ),
                children: [
                  F[w.source] && /* @__PURE__ */ e.jsx("i", { className: k("fa shrink-0 text-[9px] opacity-70", F[w.source].icon), "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "truncate", children: w.title })
                ]
              },
              w.key
            )),
            d[j].length > 4 && /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => c(j),
                className: "px-1.5 text-left text-[10.5px] font-medium text-text-tertiary hover:text-text-primary",
                children: [
                  "+",
                  d[j].length - 4,
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
            height: `${S}px`
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
            b.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "relative border-l border-subtle", children: [
              v.map((w, A) => /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "absolute inset-x-0 border-t border-subtle",
                  style: { top: `${A * ee}px` }
                },
                w
              )),
              f[j].map((w) => {
                const A = Ne(w.startTime), D = w.endTime ? Ne(w.endTime) : A + 60, N = (A - n * 60) / 60 * ee, M = Math.max((D - A) / 60 * ee, 18);
                return /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => l(w),
                    title: `${w.title} · ${ze(w.startTime)}`,
                    style: {
                      top: `${N}px`,
                      height: `${M}px`,
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
              $ && j === u && /* @__PURE__ */ e.jsx(
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
function Ca({ item: t }) {
  var x;
  const [a, s] = g.useState(""), [r, l] = g.useState(() => /* @__PURE__ */ new Set()), c = t.description ?? t.subtitle ?? "", p = X({
    queryKey: ["calendar", "projects-lookup"],
    queryFn: () => K.get("/api/app/task/projects-lookup"),
    staleTime: 10 * 6e4
  }), u = q({
    mutationFn: async () => {
      const b = new FormData();
      b.append("file", new Blob([`${t.title}

${c}`], { type: "text/plain" }), "toplanti-notlari.txt");
      const f = await fetch(`/api/ai-task-generator/parse?projectId=${a}`, {
        method: "POST",
        body: b,
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });
      if (!f.ok) throw new Error("Notlardan görev çıkarılamadı.");
      return f.json();
    },
    onSuccess: (b) => l(new Set(((b == null ? void 0 : b.suggestions) ?? []).map((f, d) => d)))
  }), o = q({
    mutationFn: () => {
      var b;
      return K.post("/api/ai-task-generator/create-tasks", {
        projectId: a,
        approvedTasks: (((b = u.data) == null ? void 0 : b.suggestions) ?? []).filter((f, d) => r.has(d))
      });
    },
    /* Olay takvimin kendi dinleyicisiyle feed ve ekip yükünü tazeler, damga Pano'yu. */
    onSuccess: () => Ut({ entity: "task", action: "create" })
  }), i = ((x = u.data) == null ? void 0 : x.suggestions) ?? [];
  return /* @__PURE__ */ e.jsxs("section", { className: "border-t border-subtle px-4 py-3", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Toplantıdan görev" }),
    !c && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[11.5px] text-text-tertiary", children: "Bu etkinlikte not yok — çıkarılacak aksiyon maddesi bulunamaz." }),
    c && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs(
        "select",
        {
          value: a,
          onChange: (b) => s(b.target.value),
          "aria-label": "Görevlerin ekleneceği proje",
          className: "mt-1.5 w-full rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "Proje seçin…" }),
            (p.data ?? []).map((b) => /* @__PURE__ */ e.jsx("option", { value: b.id, children: b.name }, b.id))
          ]
        }
      ),
      /* @__PURE__ */ e.jsx(
        z,
        {
          size: "sm",
          variant: "outline",
          className: "mt-2",
          disabled: !a || u.isPending,
          onClick: () => u.mutate(),
          children: u.isPending ? "Notlar okunuyor…" : "Notlardan aksiyon çıkar"
        }
      ),
      u.isError && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-negative-700", children: u.error.message }),
      i.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", children: [
        i.map((b, f) => /* @__PURE__ */ e.jsxs("label", { className: "flex cursor-pointer items-start gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: r.has(f),
              onChange: () => l((d) => {
                const h = new Set(d);
                return h.has(f) ? h.delete(f) : h.add(f), h;
              }),
              className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[12px] text-text-primary", children: b.title })
        ] }, `${b.title}-${f}`)),
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
const Ta = {
  [P.OVERDUE]: { text: "Gecikmiş", cls: "bg-negative-50 text-negative-700" },
  [P.DUE_TODAY]: { text: "Bugün son gün", cls: "bg-warning-50 text-warning-700" }
};
function ce({ label: t, children: a }) {
  return a ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-subtle py-2.5 last:border-b-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11.5px] font-medium text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "min-w-0 text-right text-[12.5px] text-text-primary", children: a })
  ] }) : null;
}
function Ea({ item: t, capacity: a, onClose: s, onReschedule: r, onComplete: l, isPending: c, error: p, onRetry: u }) {
  const [o, i] = g.useState(() => t.date.slice(0, 10)), x = F[t.source], b = Ta[t.risk], f = t.date.slice(0, 10);
  g.useEffect(() => i(f), [f]);
  const d = () => {
    !o || o === f || r(t, /* @__PURE__ */ new Date(`${o}T00:00:00`));
  };
  return /* @__PURE__ */ e.jsx(xe, { open: !0, onOpenChange: (h) => {
    h || s();
  }, children: /* @__PURE__ */ e.jsxs(me, { side: "right", title: t.title, className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md bg-neutral-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary", children: [
          x && /* @__PURE__ */ e.jsx("i", { className: k("fa text-[10px]", x.icon), "aria-hidden": "true" }),
          x == null ? void 0 : x.label
        ] }),
        b && /* @__PURE__ */ e.jsx("span", { className: k("rounded-md px-2 py-1 text-[11px] font-bold", b.cls), children: b.text }),
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
      /* @__PURE__ */ e.jsx(mt, { onRetry: u })
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
          onClick: () => r(t, L(/* @__PURE__ */ new Date(`${f}T00:00:00`), 1)),
          children: "+1 gün ertele"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-2", children: [
      /* @__PURE__ */ e.jsx(ce, { label: "Son tarih", children: t.canReschedule ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2", children: [
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
        o !== f && /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "primary", onClick: d, children: "Uygula" })
      ] }) : /* @__PURE__ */ e.jsxs("span", { className: "text-text-secondary", children: [
        C.dayTitle(/* @__PURE__ */ new Date(`${f}T00:00:00`)),
        /* @__PURE__ */ e.jsx("span", { className: "ml-1.5 text-text-tertiary", children: "· takvimden değiştirilemez" })
      ] }) }),
      /* @__PURE__ */ e.jsx(ce, { label: "Bağlam", children: t.subtitle }),
      /* @__PURE__ */ e.jsx(ce, { label: "Atanan", children: t.assigneeName }),
      /* @__PURE__ */ e.jsx(ce, { label: "Tutar", children: t.amount != null ? C.money(t.amount, t.currency) : null }),
      /* @__PURE__ */ e.jsx(ce, { label: "Gün yükü", children: t.loadHours != null ? `${C.hours(t.loadHours)}${a ? ` / ${C.hours(a)} kapasite` : ""}` : null })
    ] }),
    t.source === 7 && /* @__PURE__ */ e.jsx(Ca, { item: t }),
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
const kt = ["calendar", "sync-settings"];
function $a(t) {
  return X({
    queryKey: kt,
    queryFn: () => K.get("/api/app/calendar/sync-settings"),
    enabled: t,
    staleTime: 3e4
  });
}
function Ra() {
  const t = H();
  return q({
    /* ABP konvansiyonu: UpdateSyncRulesAsync → PUT (POST 405). */
    mutationFn: (a) => K.put("/api/app/calendar/sync-rules", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: kt }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
const jt = ["calendar", "sync-settings"], za = ["calendar", "external"];
function Nt() {
  return q({
    mutationFn: (t) => K.get(`/api/app/calendar/auth-url?provider=${t}`),
    /* Sağlayıcının kendi ekranına gidiliyor: SPA yönlendirmesi değil, tam sayfa. */
    onSuccess: (t) => {
      typeof t == "string" && t && (window.location.href = t);
    }
  });
}
function Aa() {
  const t = H();
  return q({
    mutationFn: (a) => K.post(`/api/app/calendar/${a}/disconnect-account`, {}),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: jt }), t.invalidateQueries({ queryKey: za });
    }
  });
}
function Ka() {
  const t = H();
  return q({
    mutationFn: (a) => K.post(`/api/app/calendar/${a}/force-sync`, {}),
    /* "Son senkron" damgası ve senkron günlüğü bu çağrıyla değişir. */
    onSuccess: () => t.invalidateQueries({ queryKey: jt })
  });
}
const wt = ["calendar", "ical-feed"], qe = ["calendar", "ical-subscriptions"];
function Ia(t) {
  return X({
    queryKey: wt,
    /* GetOrCreate: bağlantı yoksa ilk açılışta üretilir. */
    queryFn: () => K.post("/api/app/ical-feed/ensure", {}),
    enabled: t,
    staleTime: 1 / 0
  });
}
function Pa() {
  const t = H();
  return q({
    mutationFn: () => K.post("/api/app/ical-feed/regenerate", {}),
    onSuccess: (a) => t.setQueryData(wt, a)
  });
}
function Oa(t) {
  return X({
    queryKey: qe,
    queryFn: () => K.get("/api/app/ical-subscription"),
    enabled: t,
    staleTime: 3e4
  });
}
function Fa() {
  const t = H();
  return q({
    mutationFn: (a) => K.post("/api/app/ical-subscription", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: qe }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function Ma() {
  const t = H();
  return q({
    mutationFn: (a) => K.delete(`/api/app/ical-subscription/${a}`),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: qe }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function La() {
  return q({
    mutationFn: (t) => K.post(`/api/app/ical-subscription/probe?url=${encodeURIComponent(t)}`, {})
  });
}
const qa = {
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
function Be(t) {
  if (!t) return "hiç";
  const a = Math.round((Date.now() - new Date(t).getTime()) / 6e4);
  return a < 1 ? "az önce" : a < 60 ? `${a} dk önce` : a < 1440 ? `${Math.round(a / 60)} sa önce` : C.dayShort(new Date(t));
}
function Ga({ account: t, onSave: a, saving: s }) {
  var h;
  const r = qa[t.provider] ?? { label: "Takvim", icon: "fa-calendar", brand: "bg-neutral-700" }, l = Ka(), c = Aa(), [p, u] = g.useState(() => new Set(t.syncSources ?? [])), [o, i] = g.useState(t.conflictRule ?? 0), [x, b] = g.useState(t.isSyncEnabled);
  g.useEffect(() => {
    u(new Set(t.syncSources ?? [])), i(t.conflictRule ?? 0), b(t.isSyncEnabled);
  }, [t]);
  const f = x !== t.isSyncEnabled || o !== t.conflictRule || p.size !== (t.syncSources ?? []).length || [...p].some((n) => !(t.syncSources ?? []).includes(n)), d = (n) => u((m) => {
    const v = new Set(m);
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
          Be(t.lastSyncTime)
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
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Ie.map((n) => {
        var v, S;
        const m = p.has(n);
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": m,
            onClick: () => d(n),
            className: k(
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              m ? "border-accent bg-primary-subtle text-accent" : "border-subtle bg-surface-base text-text-tertiary hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: k("fa text-[10px]", (v = F[n]) == null ? void 0 : v.icon), "aria-hidden": "true" }),
              (S = F[n]) == null ? void 0 : S.label
            ]
          },
          n
        );
      }) }),
      p.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-text-tertiary", children: "Hiçbiri seçili değil — yalnız görevler gönderilir." }),
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Çakışma kuralı" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: Object.entries(Ba).map(([n, m]) => {
        const v = Number(n), S = o === v;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => i(v),
            className: k(
              "rounded-md border px-2.5 py-2 text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              S ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("span", { className: k("block text-[12px] font-semibold", S ? "text-accent" : "text-text-primary"), children: m.title }),
              /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] leading-snug text-text-tertiary", children: m.desc })
            ]
          },
          n
        );
      }) }),
      f && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          z,
          {
            size: "sm",
            variant: "primary",
            disabled: s,
            onClick: () => a({
              accountId: t.id,
              isSyncEnabled: x,
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
function Ya({ open: t }) {
  var j, w, A, D;
  const a = Ia(t), s = Pa(), r = Oa(t), l = Fa(), c = Ma(), p = La(), [u, o] = g.useState(""), [i, x] = g.useState(""), [b, f] = g.useState(60), [d, h] = g.useState(!1), n = (j = a.data) != null && j.path ? `${window.location.origin}${a.data.path}` : "", m = u.trim(), v = /^https?:\/\//i.test(m), S = m !== "" && !v && !p.data, $ = async () => {
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
        /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "outline", onClick: $, disabled: !n, children: d ? "Kopyalandı" : "Kopyala" })
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
            value: u,
            onChange: (N) => {
              o(N.target.value), p.reset();
            },
            placeholder: "https://…/basic.ics",
            "aria-label": "Takvim bağlantısı",
            "aria-describedby": S ? "ical-url-hint" : void 0,
            className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          }
        ),
        S && /* @__PURE__ */ e.jsx("p", { id: "ical-url-hint", className: "text-[11px] text-text-tertiary", children: Mt("Calendar:Ical:UrlHint", "Adres http:// ya da https:// ile başlamalı.") }),
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
              onChange: (N) => x(N.target.value),
              placeholder: ((A = p.data) == null ? void 0 : A.suggestedName) || "Görünen ad",
              "aria-label": "Görünen ad",
              className: "min-w-0 flex-1 rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              value: b,
              onChange: (N) => f(Number(N.target.value)),
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
              disabled: !m || p.isPending,
              onClick: () => p.mutate(m),
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
                { url: m, displayName: i, color: "accent", refreshMinutes: b },
                { onSuccess: () => {
                  o(""), x(""), p.reset();
                } }
              ),
              children: l.isPending ? "Ekleniyor…" : "Takvimi ekle"
            }
          )
        ] }),
        l.isError && /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-negative-700", children: ((D = l.error) == null ? void 0 : D.message) || "Takvim eklenemedi." }),
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
          ), children: N.lastError ?? `${N.lastEventCount} etkinlik · ${Be(N.lastFetchedAt)} çekildi` })
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
function Ua({ open: t, onClose: a }) {
  var p, u;
  const { data: s, isPending: r } = $a(t), l = Ra(), c = Nt();
  return /* @__PURE__ */ e.jsx(xe, { open: t, onOpenChange: (o) => {
    o || a();
  }, children: /* @__PURE__ */ e.jsxs(me, { side: "right", title: "Takvim senkronizasyonu", className: "w-full max-w-[440px] p-0", children: [
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
      /* @__PURE__ */ e.jsx(de, { height: 92 }),
      /* @__PURE__ */ e.jsx(de, { height: 92 })
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
          Ga,
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
      c.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "text-[11.5px] text-negative-700", children: ((u = c.error) == null ? void 0 : u.message) || "Yetkilendirme adresi alınamadı." }),
      /* @__PURE__ */ e.jsx(Ya, { open: t }),
      /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
        /* @__PURE__ */ e.jsx("header", { className: "border-b border-subtle px-3 py-2", children: /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-semibold text-text-primary", children: "Senkron günlüğü" }) }),
        /* @__PURE__ */ e.jsx("div", { className: "px-3 py-2", children: ((s == null ? void 0 : s.log) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-2 text-[11.5px] text-text-tertiary", children: "Henüz senkron kaydı yok." }) : s.log.map((o) => {
          const i = ot[o.kind] ?? ot[0];
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
            /* @__PURE__ */ e.jsx("i", { className: k("fa mt-0.5 shrink-0 text-[11px]", i.icon, i.cls), "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[11.5px] leading-snug text-text-secondary", children: o.message }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: Be(o.occurredAt) })
          ] }, o.id);
        }) })
      ] })
    ] }) })
  ] }) });
}
const St = ["calendar", "preferences"];
function Qa() {
  return X({
    queryKey: St,
    queryFn: () => K.get("/api/app/calendar/preferences"),
    staleTime: 5 * 6e4
  });
}
function Ha() {
  const t = H();
  return q({
    /* ABP konvansiyonu: Update* metotları PUT'a düşer. POST 405 döner ve
       ayarlar SESSİZCE kaydedilmemiş olur. */
    mutationFn: (a) => K.put("/api/app/calendar/preferences", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: St }), t.invalidateQueries({ queryKey: ["calendar", "feed"] });
    }
  });
}
function Wa() {
  const t = H();
  return q({
    mutationFn: (a) => K.post("/api/app/calendar/bulk-reschedule", a),
    onSettled: () => t.invalidateQueries({ queryKey: ["calendar", "feed"] })
  });
}
function Va({ open: t, items: a, today: s, capacity: r, onClose: l }) {
  const { suggestions: c, fixed: p } = g.useMemo(
    () => ia(a, { today: s, capacity: r }),
    [a, s, r]
  ), [u, o] = g.useState(() => new Set(c.map((n) => n.item.key)));
  g.useEffect(() => {
    o(new Set(c.map((n) => n.item.key)));
  }, [c]);
  const i = Wa(), x = i.data ?? [], b = new Map(x.filter((n) => !n.succeeded).map((n) => [n.sourceId, n.error])), f = (n) => o((m) => {
    const v = new Set(m);
    return v.has(n) ? v.delete(n) : v.add(n), v;
  }), d = c.filter((n) => u.has(n.item.key)), h = () => {
    i.mutate(
      d.map((n) => ({
        source: n.item.source,
        sourceId: n.item.sourceId,
        newDate: E(n.date)
      })),
      {
        onSuccess: (n) => {
          (n ?? []).every((m) => m.succeeded) && l();
        }
      }
    );
  };
  return /* @__PURE__ */ e.jsx(xe, { open: t, onOpenChange: (n) => {
    n || l();
  }, children: /* @__PURE__ */ e.jsxs(me, { side: "right", title: "Akıllı erteleme", className: "w-full max-w-[420px] p-0", children: [
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
      c.map(({ item: n, date: m }) => {
        const v = b.get(n.sourceId);
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
                  checked: u.has(n.key),
                  onChange: () => f(n.key),
                  className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] font-semibold text-text-primary", children: n.title }),
                /* @__PURE__ */ e.jsxs("span", { className: "mt-0.5 flex items-center gap-1.5 text-[11px] text-text-tertiary", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "line-through", children: C.dayShort(/* @__PURE__ */ new Date(`${n.date.slice(0, 10)}T00:00:00`)) }),
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right text-[9px]", "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-accent", children: C.dayShort(m) }),
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
          var m;
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 py-1.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock mt-1 shrink-0 text-[10px] text-text-tertiary", "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] text-text-secondary", children: n.title }),
              /* @__PURE__ */ e.jsxs("span", { className: "block text-[11px] text-text-tertiary", children: [
                (m = F[n.source]) == null ? void 0 : m.label,
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
          disabled: d.length === 0 || i.isPending,
          onClick: h,
          children: i.isPending ? "Erteleniyor…" : `${d.length} öğeyi ertele`
        }
      ),
      /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "ghost", onClick: l, children: "Vazgeç" })
    ] })
  ] }) });
}
const Xa = [
  { value: 4, label: "4 sa" },
  { value: 6, label: "6 sa" },
  { value: 8, label: "8 sa" },
  { value: 0, label: "Kapalı" }
], ke = ["Kaynaklar", "Dış takvim", "Kurallar"];
function Ja({ open: t, counts: a, onDone: s }) {
  var d, h;
  const [r, l] = g.useState(0), [c, p] = g.useState(() => new Set(Ie)), [u, o] = g.useState(8), i = Ha(), x = Nt(), b = () => {
    i.mutate(
      {
        dailyCapacityHours: u > 0 ? u : 0,
        sources: [...c],
        setupCompleted: !0
      },
      /* onSettled DEĞİL: hata durumunda da kapanırsa ayarlar sessizce
         kaybolur ve kullanıcı kurulumu yaptığını sanır. */
      { onSuccess: s }
    );
  }, f = (n) => p((m) => {
    const v = new Set(m);
    return v.has(n) ? v.delete(n) : v.add(n), v;
  });
  return /* @__PURE__ */ e.jsx(pt, { open: t, onOpenChange: (n) => {
    n || s();
  }, children: /* @__PURE__ */ e.jsxs(ft, { className: "w-full max-w-[520px] p-0 h-auto max-h-[88dvh] tablet:min-h-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "shrink-0 border-b border-subtle px-5 py-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[18px] font-semibold tracking-tight text-text-primary", children: "Takviminizi kurun" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: "Hangi kaynakları göreceğinizi seçin, dilerseniz dış takvim bağlayın. Her ayarı sonradan değiştirebilirsiniz." }),
      /* @__PURE__ */ e.jsx("ol", { className: "mt-3 flex items-center gap-2", children: ke.map((n, m) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx("span", { className: k(
          "flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold",
          m === r ? "bg-accent text-white" : m < r ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
        ), children: m + 1 }),
        /* @__PURE__ */ e.jsx("span", { className: k(
          "text-[11.5px]",
          m === r ? "font-semibold text-text-primary" : "text-text-tertiary"
        ), children: n }),
        m < ke.length - 1 && /* @__PURE__ */ e.jsx("span", { className: "ms-1 text-text-tertiary", children: "·" })
      ] }, n)) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "min-h-0 overflow-y-auto px-5 py-4", children: [
      r === 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Takvimde ne görünsün?" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex flex-col gap-1.5", children: Ie.map((n) => {
          var S, $;
          const m = c.has(n), v = a == null ? void 0 : a[n];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": m,
              onClick: () => f(n),
              className: k(
                "flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                m ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: k("fa text-[12px]", (S = F[n]) == null ? void 0 : S.icon, m ? "text-accent" : "text-text-tertiary"), "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-medium text-text-primary", children: ($ = F[n]) == null ? void 0 : $.label }),
                v != null && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: v })
              ]
            },
            n
          );
        }) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-[13px] font-semibold text-text-primary", children: "Günlük kapasiteniz" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex gap-1.5", children: Xa.map((n) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => o(n.value),
            className: k(
              "rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              u === n.value ? "border-accent bg-primary-subtle text-accent" : "border-subtle text-text-secondary hover:bg-surface-hover"
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
        x.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "mt-2 text-[11.5px] text-negative-700", children: ((d = x.error) == null ? void 0 : d.message) || "Yetkilendirme adresi alınamadı." })
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
const Za = [
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
function es({ open: t, onClose: a }) {
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
      Za.map((s) => /* @__PURE__ */ e.jsxs("section", { className: "mb-4 last:mb-0", children: [
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
function ts({ polite: t, assertive: a }) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("p", { role: "status", "aria-live": "polite", className: "sr-only", children: t }),
    /* @__PURE__ */ e.jsx("p", { role: "alert", "aria-live": "assertive", className: "sr-only", children: a })
  ] });
}
const as = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
function ss({ items: t, month: a, today: s, generatedAt: r }) {
  var f;
  const l = gt(a), c = E(s), p = {};
  for (const d of t ?? [])
    (p[f = d.date.slice(0, 10)] ?? (p[f] = [])).push(d);
  const u = Me(s), o = (t ?? []).filter((d) => {
    const h = d.date.slice(0, 10);
    return h >= E(u) && h <= E(L(u, 7));
  }), { overdue: i, days: x } = vt(o, s), b = (d) => d === P.OVERDUE ? "border-l-[3px] border-l-black" : d === P.DUE_TODAY ? "border-l-[3px] border-l-neutral-500" : "border-l-[3px] border-l-neutral-300";
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
      /* @__PURE__ */ e.jsx("div", { className: "mt-3 grid grid-cols-7", children: as.map((d) => /* @__PURE__ */ e.jsx("div", { className: "pb-1 text-[7.5pt] font-bold uppercase tracking-wide text-neutral-500", children: d }, d)) }),
      /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-l border-t border-neutral-300", children: l.map((d) => {
        const h = E(d), n = p[h] ?? [], m = d.getMonth() !== a.getMonth();
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
                m ? "text-neutral-300" : "text-neutral-700"
              ), children: d.getDate() }),
              n.slice(0, 4).map((v) => /* @__PURE__ */ e.jsx(
                "p",
                {
                  className: k(
                    "mt-0.5 truncate ps-1 text-[7.5pt] leading-tight",
                    b(v.risk),
                    v.risk === P.OVERDUE ? "font-semibold" : "font-normal",
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
            C.dayShort(u),
            " – ",
            C.dayShort(L(u, 6))
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
          i.map((d) => /* @__PURE__ */ e.jsx(dt, { item: d, showDate: !0 }, d.key))
        ] }),
        x.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "mb-4 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "border-b border-black pb-1 text-[9pt] font-bold uppercase tracking-wide", children: [
            C.dayTitle(d.date),
            d.isToday ? " · Bugün" : ""
          ] }),
          d.items.map((h) => /* @__PURE__ */ e.jsx(dt, { item: h }, h.key))
        ] }, d.key))
      ] })
    ] })
  ] });
}
function dt({ item: t, showDate: a = !1 }) {
  const s = F[t.source];
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-neutral-200 py-1", children: [
    /* @__PURE__ */ e.jsx("span", { className: "mt-[3px] h-[9px] w-[9px] shrink-0 border border-neutral-600", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ e.jsx("span", { className: k("block text-[9pt] leading-tight", t.risk === P.OVERDUE && "font-semibold"), children: t.title }),
      /* @__PURE__ */ e.jsx("span", { className: "block text-[7.5pt] text-neutral-500", children: [
        a ? C.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
        s == null ? void 0 : s.label,
        t.subtitle,
        t.amount != null ? C.money(t.amount, t.currency) : null
      ].filter(Boolean).join(" · ") })
    ] })
  ] });
}
function rs({ rows: t, days: a, capacity: s, loading: r }) {
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
      for (const u of c.days ?? []) p[u.date.slice(0, 10)] = u;
      return /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "truncate text-[11.5px] font-medium text-text-primary", children: c.name }),
          /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] tabular-nums text-text-tertiary", children: C.hours(c.totalHours) })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-0.5 flex gap-[2px]", children: (l.length ? l : (c.days ?? []).map((u) => u.date.slice(0, 10))).map((u) => {
          const o = p[u], i = (o == null ? void 0 : o.hours) ?? 0, x = s && i > s, b = s ? Math.min(i / s, 1) : i > 0 ? 1 : 0;
          return /* @__PURE__ */ e.jsx(
            "span",
            {
              title: `${u}: ${C.hours(i)}${o != null && o.itemCount ? ` · ${o.itemCount} öğe` : ""}`,
              className: "h-[6px] flex-1 overflow-hidden rounded-sm bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: k("block h-full", x ? "bg-negative" : "bg-accent"),
                  style: { width: `${b * 100}%` }
                }
              )
            },
            u
          );
        }) })
      ] }, c.userId);
    }),
    /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[10.5px] leading-snug text-text-tertiary", children: "Yalnız görebildiğiniz projelerin görevleri sayılır." })
  ] });
}
const ns = 6e4;
function is({ from: t, to: a }) {
  const s = E(t), r = E(a);
  return X({
    queryKey: ["calendar", "feed", s, r],
    queryFn: () => K.get(`/api/app/calendar/feed?From=${s}&To=${r}`),
    staleTime: ns,
    placeholderData: (l) => l
    /* ay geçişinde boş ekran yerine eski veri */
  });
}
const Dt = "apya.calendar.view", Fe = "apya.calendar.sources", Se = ["month", "week", "day", "agenda"];
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
function ls() {
  const t = new URLSearchParams(window.location.search).get("view");
  if (Se.includes(t)) return t;
  const a = Ct(Dt);
  return Se.includes(a) ? a : null;
}
function os() {
  const t = Ct(Fe);
  if (!t) return new Set(ue);
  const a = t.split(",").map(Number).filter((s) => ue.includes(s));
  return a.length ? new Set(a) : new Set(ue);
}
function cs({ defaultView: t = "month" } = {}) {
  const [a] = g.useState(ls), [s, r] = g.useState(() => a ?? t), [l, c] = g.useState(os);
  g.useEffect(() => {
    const x = new URL(window.location.href);
    x.searchParams.get("view") !== s && (x.searchParams.set("view", s), window.history.replaceState({}, "", x));
  }, [s]);
  const p = g.useCallback((x) => {
    Se.includes(x) && (r(x), Ae(Dt, x));
  }, []), u = g.useCallback((x) => {
    c((b) => {
      const f = new Set(b);
      return f.has(x) ? f.delete(x) : f.add(x), Ae(Fe, [...f].join(",")), f;
    });
  }, []), o = g.useCallback((x) => {
    a || Se.includes(x) && r((b) => b === x ? b : x);
  }, [a]), i = g.useCallback(() => {
    const x = new Set(ue);
    c(x), Ae(Fe, [...x].join(","));
  }, []);
  return { view: s, setView: p, applyResponsiveDefault: o, enabledSources: l, toggleSource: u, resetSources: i };
}
const V = ["calendar", "feed"];
function ds(t, a, s) {
  t.setQueriesData({ queryKey: V }, (r) => r != null && r.items ? {
    ...r,
    items: r.items.map((l) => l.key === a ? { ...l, date: `${s}T00:00:00` } : l)
  } : r);
}
function us(t, a) {
  t.setQueriesData({ queryKey: V }, (s) => s != null && s.items ? {
    ...s,
    items: s.items.map((r) => r.key === a ? { ...r, isDone: !0, risk: 0, loadHours: null } : r)
  } : s);
}
function xs({ onOfflineFailure: t } = {}) {
  const a = H(), [s, r] = g.useState(null), [l, c] = g.useState({}), [p, u] = g.useState({}), o = g.useRef({}), i = g.useCallback((f) => {
    delete o.current[f], c((d) => {
      if (!d[f]) return d;
      const h = { ...d };
      return delete h[f], h;
    });
  }, []), x = q({
    mutationFn: ({ item: f, newDate: d }) => K.post("/api/app/calendar/reschedule-item", {
      source: f.source,
      sourceId: f.sourceId,
      newDate: E(d)
    }),
    onMutate: async ({ item: f, newDate: d }) => {
      await a.cancelQueries({ queryKey: V });
      const h = a.getQueriesData({ queryKey: V });
      return i(f.key), u((n) => ({ ...n, [f.key]: !0 })), ds(a, f.key, E(d)), { snapshot: h, previousDate: f.date.slice(0, 10) };
    },
    onError: (f, { item: d, newDate: h }, n) => {
      var m;
      if (typeof navigator < "u" && !navigator.onLine) {
        t == null || t({
          key: d.key,
          payload: { source: d.source, sourceId: d.sourceId, newDate: E(h) }
        });
        return;
      }
      (m = n == null ? void 0 : n.snapshot) == null || m.forEach(([v, S]) => a.setQueryData(v, S)), o.current[d.key] = { item: d, newDate: h }, c((v) => ({
        ...v,
        [d.key]: (f == null ? void 0 : f.message) || "Kaydedilemedi — tarih değişmedi."
      }));
    },
    onSuccess: (f, { item: d, newDate: h }, n) => {
      nt(), r({
        key: d.key,
        message: `“${d.title}” ${E(h)} tarihine taşındı.`,
        undo: () => x.mutate({
          item: { ...d, date: `${E(h)}T00:00:00` },
          newDate: /* @__PURE__ */ new Date(`${n.previousDate}T00:00:00`)
        })
      });
    },
    onSettled: (f, d, { item: h }) => {
      u((n) => {
        const m = { ...n };
        return delete m[h.key], m;
      }), a.invalidateQueries({ queryKey: V });
    }
  }), b = q({
    mutationFn: ({ item: f }) => K.post("/api/app/calendar/complete-item", {
      source: f.source,
      sourceId: f.sourceId
    }),
    onMutate: async ({ item: f }) => {
      await a.cancelQueries({ queryKey: V });
      const d = a.getQueriesData({ queryKey: V });
      return i(f.key), u((h) => ({ ...h, [f.key]: !0 })), us(a, f.key), { snapshot: d };
    },
    onError: (f, { item: d }, h) => {
      var n;
      (n = h == null ? void 0 : h.snapshot) == null || n.forEach(([m, v]) => a.setQueryData(m, v)), o.current[d.key] = { item: d }, c((m) => ({
        ...m,
        [d.key]: (f == null ? void 0 : f.message) || "Tamamlanamadı."
      }));
    },
    onSuccess: (f, { item: d }) => {
      nt(), r({ key: d.key, message: `“${d.title}” tamamlandı.`, undo: null });
    },
    onSettled: (f, d, { item: h }) => {
      u((n) => {
        const m = { ...n };
        return delete m[h.key], m;
      }), a.invalidateQueries({ queryKey: V });
    }
  });
  return {
    reschedule: (f, d) => x.mutate({ item: f, newDate: d }),
    complete: (f) => b.mutate({ item: f }),
    retry: (f, d) => d ? x.mutate({ item: f, newDate: d }) : b.mutate({ item: f }),
    /** Reddedilen son işlemi aynen yineler; kayıt yoksa yalnız hata şeridini kapatır. */
    retryFailed: (f) => {
      const d = o.current[f];
      if (!d) {
        i(f);
        return;
      }
      d.newDate ? x.mutate({ item: d.item, newDate: d.newDate }) : b.mutate({ item: d.item });
    },
    lastAction: s,
    dismissAction: () => r(null),
    errors: l,
    clearError: i,
    pending: p
  };
}
function ms({ from: t, to: a, enabled: s = !0 }) {
  const r = E(t), l = E(a);
  return X({
    queryKey: ["calendar", "external", r, l],
    queryFn: () => K.get(`/api/app/calendar/external-events?From=${r}&To=${l}`),
    enabled: s,
    staleTime: 12e4,
    retry: !1,
    placeholderData: (c) => c
  });
}
const ps = ["INPUT", "TEXTAREA", "SELECT"];
function fs({
  onView: t,
  onToday: a,
  onPrev: s,
  onNext: r,
  onDeferSelected: l,
  onUndo: c,
  onToggleHelp: p,
  enabled: u = !0
}) {
  g.useEffect(() => {
    if (!u) return;
    const o = (i) => {
      const x = i.target;
      if (!(ps.includes(x == null ? void 0 : x.tagName) || x != null && x.isContentEditable)) {
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
  }, [u, t, a, s, r, l, c, p]);
}
function bs({ from: t, to: a, enabled: s }) {
  const r = E(t), l = E(a);
  return X({
    queryKey: ["calendar", "team-load", r, l],
    queryFn: () => K.get(`/api/app/calendar/team-load?From=${r}&To=${l}`),
    enabled: s,
    staleTime: 6e4
  });
}
const Tt = () => Wt("apya.calendar.offlineQueue");
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
function hs({ onFlush: t }) {
  const [a, s] = g.useState(() => typeof navigator > "u" ? !0 : navigator.onLine), [r, l] = g.useState(() => Ke().length), c = g.useRef(!1), p = g.useCallback((o) => {
    const x = Ke().filter((b) => b.key !== o.key).concat(o);
    ut(x), l(x.length);
  }, []), u = g.useCallback(async () => {
    if (c.current) return;
    const o = Ke();
    if (o.length !== 0) {
      c.current = !0;
      try {
        const i = [];
        for (const x of o)
          try {
            await t(x);
          } catch (b) {
            Ht(b) || i.push(x);
          }
        ut(i), l(i.length);
      } finally {
        c.current = !1;
      }
    }
  }, [t]);
  return g.useEffect(() => {
    const o = () => {
      s(!0), u();
    }, i = () => s(!1);
    return window.addEventListener("online", o), window.addEventListener("offline", i), navigator.onLine && u(), () => {
      window.removeEventListener("online", o), window.removeEventListener("offline", i);
    };
  }, [u]), { isOnline: a, pendingCount: r, enqueue: p, flush: u };
}
function gs() {
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
function ys(t) {
  return t === 0 || t >= 1180 ? "wide" : t >= 780 ? "medium" : "narrow";
}
const vs = 60;
function je(t, a, s) {
  return a === "week" ? L(t, 7 * s) : a === "day" ? L(t, s) : new Date(t.getFullYear(), t.getMonth() + s, 1);
}
function ks() {
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Array.from({ length: 7 }, (t, a) => /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-2", children: /* @__PURE__ */ e.jsx(de, { height: 10 }) }, a)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: Array.from({ length: Le }, (t, a) => /* @__PURE__ */ e.jsxs("div", { className: "min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0", children: [
      /* @__PURE__ */ e.jsx(de, { height: 12, width: "40%", className: "ml-auto" }),
      a % 3 === 0 && /* @__PURE__ */ e.jsx(de, { height: 14, className: "mt-2" })
    ] }, a)) })
  ] });
}
function js() {
  var Xe, ye, Je, Ze, et, tt, at, st;
  const [t, a] = gs(), s = ys(a), r = s === "narrow", l = g.useMemo(() => Pe(/* @__PURE__ */ new Date()), []), [c, p] = g.useState(l), [u, o] = g.useState(null), [i, x] = g.useState(null), [b, f] = g.useState(!1), [d, h] = g.useState(!1), [n, m] = g.useState(!1), [v, S] = g.useState(!1), [$, j] = g.useState(null), [w, A] = g.useState(!1), { view: D, setView: N, applyResponsiveDefault: M, enabledSources: _, toggleSource: Ce, resetSources: J } = cs();
  g.useEffect(() => {
    a !== 0 && M(r ? "agenda" : "month");
  }, [a, r, M]);
  const { range: O, title: ne, weekDayList: te } = g.useMemo(() => {
    if (D === "agenda")
      return {
        range: { from: L(l, -60), to: L(l, vs) },
        title: "Ajanda",
        weekDayList: null
      };
    if (D === "week") {
      const R = sa(c);
      return {
        range: { from: R[0], to: R[6] },
        title: `${C.dayShort(R[0])} – ${C.dayShort(R[6])} ${R[6].getFullYear()}`,
        weekDayList: R
      };
    }
    if (D === "day") {
      const R = Pe(c);
      return { range: { from: R, to: R }, title: C.dayTitle(R), weekDayList: [R] };
    }
    const y = ht(c);
    return {
      range: { from: y, to: L(y, Le - 1) },
      title: C.monthTitle(c),
      weekDayList: null
    };
  }, [D, c, l]), { data: T, error: Z, isPending: ae, isError: Ge, isFetching: Et, isPlaceholderData: $t, refetch: _e } = is(O), pe = Ge && !T, Te = `${E(O.from)}/${E(O.to)}`, [fe, Ye] = g.useState(null), se = (fe == null ? void 0 : fe.feedKey) === Te, Rt = () => {
    Ye({ feedKey: Te, error: Z }), _e().finally(() => Ye((y) => (y == null ? void 0 : y.feedKey) === Te ? null : y));
  }, Ue = g.useId(), Y = ms(O), Qe = Qa(), Ee = bs({ from: O.from, to: O.to, enabled: w });
  Qt();
  const G = hs({
    onFlush: (y) => K.post("/api/app/calendar/reschedule-item", y.payload)
  }), be = g.useMemo(
    () => {
      var y;
      return [...(T == null ? void 0 : T.items) ?? [], ...((y = Y.data) == null ? void 0 : y.items) ?? []];
    },
    [T, Y.data]
  ), W = g.useMemo(
    () => be.filter((y) => _.has(y.source)),
    [be, _]
  ), U = g.useMemo(() => yt(W), [W]), Q = (T == null ? void 0 : T.dailyCapacityHours) ?? null, He = g.useMemo(() => {
    const y = {};
    for (const R of (T == null ? void 0 : T.sources) ?? []) y[R.source] = R.count;
    return y;
  }, [T]), zt = g.useMemo(() => Q ? Object.values(U).filter((y) => De(y) > Q).length : 0, [U, Q]), We = g.useMemo(() => {
    var rt;
    let y = 0, R = 0;
    for (const oe of W)
      oe.isDone || (oe.risk === P.OVERDUE ? y++ : oe.risk === P.DUE_TODAY && R++);
    const B = (((rt = Y.data) == null ? void 0 : rt.accounts) ?? []).filter((oe) => oe.error).length;
    return { overdue: y, dueToday: R, syncError: B };
  }, [W, Y.data]), ie = g.useMemo(
    () => ((T == null ? void 0 : T.sources) ?? []).filter((y) => y.isAvailable),
    [T]
  ), At = g.useMemo(
    () => ie.filter((y) => !_.has(y.source)).length,
    [ie, _]
  ), Kt = g.useMemo(() => {
    const y = ie.filter((B) => _.has(B.source)).map((B) => B.source);
    return y.length === 0 ? null : `/Calendars?handler=Ics&${[`from=${E(O.from)}`, `to=${E(O.to)}`, ...y.map((B) => `sources=${B}`)].join("&")}`;
  }, [ie, _, O]), It = g.useMemo(() => {
    var R;
    const y = (((R = Y.data) == null ? void 0 : R.accounts) ?? []).map((B) => B.lastSyncTime).filter(Boolean).sort();
    return y.length ? y[y.length - 1] : null;
  }, [Y.data]);
  g.useEffect(() => {
    u && !U[u] && !ae && (u >= E(O.from) && u <= E(O.to) || o(null));
  }, [u, U, ae, O]);
  const he = g.useCallback((y) => x(y.key), []), Ve = g.useCallback(() => {
    p(l), o(E(l));
  }, [l]), I = xs({ onOfflineFailure: G.enqueue }), ge = !!((Je = (ye = (Xe = window.abp) == null ? void 0 : Xe.auth) == null ? void 0 : ye.isGranted) != null && Je.call(ye, "Platform.Tasks.Create")), Pt = g.useCallback((y) => {
    const R = $ ?? u;
    if (R)
      for (const B of U[R] ?? [])
        B.canReschedule && !B.isDone && I.reschedule(B, L(/* @__PURE__ */ new Date("T00:00:00"), y));
  }, [$, u, U, I]);
  fs({
    onView: N,
    onToday: Ve,
    onPrev: () => p((y) => je(y, D, -1)),
    onNext: () => p((y) => je(y, D, 1)),
    onDeferSelected: Pt,
    onUndo: () => {
      var y, R;
      return (R = (y = I.lastAction) == null ? void 0 : y.undo) == null ? void 0 : R.call(y);
    },
    onToggleHelp: () => S((y) => !y)
  });
  const $e = be.length > 0, Ot = $e && W.length === 0, Ft = u ? U[u] ?? [] : [], le = i ? be.find((y) => y.key === i) ?? null : null, Re = u && /* @__PURE__ */ e.jsx(
    ca,
    {
      dayKey: u,
      items: Ft,
      capacity: Q,
      onSelectItem: he,
      onClose: () => o(null)
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { ref: t, className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsx(
      ja,
      {
        title: ne,
        view: D,
        onView: N,
        onPrev: () => p((y) => je(y, D, -1)),
        onNext: () => p((y) => je(y, D, 1)),
        onToday: Ve,
        overloadDays: zt,
        onHelp: () => S(!0),
        filterCount: At,
        onClearFilters: J,
        lastSyncAt: It,
        syncError: We.syncError > 0,
        compact: r,
        canCreateTask: ge,
        icsHref: Kt
      }
    ),
    Ge && !pe && !Lt(Z) && /* @__PURE__ */ e.jsxs("div", { role: "alert", className: "flex flex-wrap items-center gap-2 rounded-card border border-negative-100 bg-negative-50 px-3 py-2 text-[12.5px] text-negative-700", children: [
      /* @__PURE__ */ e.jsx("span", { id: Ue, className: "min-w-0 flex-1", children: "Takvim yenilenemedi; son yüklenen veriler gösteriliyor." }),
      /* @__PURE__ */ e.jsx(mt, { onRetry: _e, retrying: Et, "aria-describedby": Ue })
    ] }),
    (!G.isOnline || G.pendingCount > 0) && /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        className: "flex items-center gap-2 rounded-card border border-warning-100 bg-warning-50 px-3 py-2 text-[12.5px] text-warning-700",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: k("fa", G.isOnline ? "fa-cloud-arrow-up" : "fa-wifi"), "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: G.isOnline ? `${G.pendingCount} değişiklik gönderiliyor…` : `Çevrimdışısınız — ${G.pendingCount} değişiklik kuyrukta, bağlantı gelince gönderilecek.` }),
          G.isOnline && G.pendingCount > 0 && /* @__PURE__ */ e.jsx("button", { type: "button", onClick: G.flush, className: "font-semibold underline", children: "Şimdi gönder" })
        ]
      }
    ),
    I.lastAction && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "flex items-center gap-2 rounded-card border border-subtle bg-surface-raised px-3 py-2 text-[12.5px] text-text-secondary",
        role: "status",
        "aria-live": "polite",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left text-text-tertiary", "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 truncate", children: I.lastAction.message }),
          I.lastAction.undo && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                I.lastAction.undo(), I.dismissAction();
              },
              className: "font-semibold text-text-link hover:underline",
              children: "Geri al"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: I.dismissAction,
              "aria-label": "Şeridi kapat",
              className: "rounded p-1 text-text-tertiary hover:bg-surface-hover",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: k("flex gap-3", r ? "flex-col" : "flex-row items-start"), children: [
      !r && !se && (ae || ie.length > 0) && /* @__PURE__ */ e.jsx("div", { className: k("shrink-0", s === "wide" ? "w-[240px]" : "w-auto"), children: /* @__PURE__ */ e.jsx(
        ga,
        {
          sources: (T == null ? void 0 : T.sources) ?? [],
          counts: He,
          enabled: _,
          onToggle: Ce,
          compact: s !== "wide",
          externalAccounts: ((Ze = Y.data) == null ? void 0 : Ze.accounts) ?? [],
          externalLoading: Y.isFetching,
          onOpenSync: () => f(!0),
          teamOpen: w,
          onToggleTeam: () => A((y) => !y),
          teamContent: w ? /* @__PURE__ */ e.jsx(
            rs,
            {
              rows: Ee.data,
              days: te,
              capacity: Q,
              loading: Ee.isPending
            }
          ) : null,
          teamMembers: Ee.data ?? [],
          riskCounts: We
        }
      ) }),
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        !ae && !pe && !$t && !$e && D !== "agenda" && /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "status",
            className: "mb-2 flex items-center gap-2 rounded-card border border-subtle bg-surface-raised px-3 py-2 text-[12.5px] text-text-secondary",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus text-text-tertiary", "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1", children: "Bu aralıkta planlanmış bir şey yok." }),
              ge && /* @__PURE__ */ e.jsx("button", { type: "button", onClick: we, className: "font-semibold text-text-link hover:underline", children: "Görev oluştur" })
            ]
          }
        ),
        ae && !se ? /* @__PURE__ */ e.jsx(ks, {}) : pe || se ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
          re,
          {
            variant: "error",
            title: "Takvim yüklenemedi",
            error: se ? fe.error : Z,
            onRetry: Rt,
            retrying: se
          }
        ) }) : Ot ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
          re,
          {
            icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-filter-circle-xmark" }),
            title: "Bu filtreyle gösterilecek öğe yok",
            description: "Kaynak rayında kapattığınız türler bu aralıktaki tüm öğeleri gizliyor.",
            action: /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "outline", onClick: J, children: "Kaynakları aç" })
          }
        ) }) : !$e && D === "agenda" ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
          re,
          {
            icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
            title: "Bu aralıkta planlanmış bir şey yok",
            description: "Son tarihi olan görevler, fatura vadeleri, hibe son tarihleri ve tarihli finans kayıtları burada birlikte görünür.",
            action: ge ? /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "outline", onClick: we, children: "Görev oluştur" }) : null
          }
        ) }) : D === "month" ? /* @__PURE__ */ e.jsx(
          fa,
          {
            month: c,
            byDay: U,
            today: l,
            capacity: Q,
            selectedDay: u,
            onSelectItem: he,
            onSelectDay: o,
            onDropItem: I.reschedule,
            focusedDay: $,
            onFocusDay: j,
            onNavigate: (y) => p(y),
            pending: I.pending,
            errors: I.errors
          }
        ) : te ? /* @__PURE__ */ e.jsx(
          Da,
          {
            days: te,
            byDay: U,
            today: l,
            capacity: Q,
            selectedDay: u,
            onSelectItem: he,
            onSelectDay: o
          }
        ) : /* @__PURE__ */ e.jsx(
          oa,
          {
            items: W,
            today: l,
            onSelectItem: he,
            onSmartDefer: () => h(!0)
          }
        ),
        !ae && !pe && !se && D !== "agenda" && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[10.5px] text-text-tertiary", children: [
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
      s === "wide" && u && /* @__PURE__ */ e.jsx("div", { className: "w-[340px] shrink-0 self-stretch", children: Re })
    ] }),
    s === "medium" && u && /* @__PURE__ */ e.jsx(xe, { open: !0, onOpenChange: (y) => {
      y || o(null);
    }, children: /* @__PURE__ */ e.jsx(me, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: Re }) }),
    r && u && /* @__PURE__ */ e.jsx(xe, { open: !0, onOpenChange: (y) => {
      y || o(null);
    }, children: /* @__PURE__ */ e.jsx(me, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: Re }) }),
    r && ge && /* @__PURE__ */ e.jsx(ka, {}),
    /* @__PURE__ */ e.jsx(
      ss,
      {
        items: W,
        month: c,
        today: l,
        generatedAt: C.dayShort(l)
      }
    ),
    /* @__PURE__ */ e.jsx(es, { open: v, onClose: () => S(!1) }),
    /* @__PURE__ */ e.jsx(
      ts,
      {
        polite: ((et = I.lastAction) == null ? void 0 : et.message) ?? "",
        assertive: ((st = (at = (tt = Y.data) == null ? void 0 : tt.accounts) == null ? void 0 : at.find((y) => y.error)) == null ? void 0 : st.error) ?? ""
      }
    ),
    /* @__PURE__ */ e.jsx(Ua, { open: b, onClose: () => f(!1) }),
    /* @__PURE__ */ e.jsx(
      Va,
      {
        open: d,
        items: W,
        today: l,
        capacity: Q,
        onClose: () => h(!1)
      }
    ),
    /* @__PURE__ */ e.jsx(
      Ja,
      {
        open: Qe.data ? !Qe.data.setupCompleted && !n : !1,
        counts: He,
        onDone: () => m(!0)
      }
    ),
    le && /* @__PURE__ */ e.jsx(
      Ea,
      {
        item: le,
        capacity: Q,
        onClose: () => x(null),
        onReschedule: I.reschedule,
        onComplete: I.complete,
        isPending: !!I.pending[le.key],
        error: I.errors[le.key],
        onRetry: () => I.retryFailed(le.key)
      }
    )
  ] });
}
const xt = document.getElementById("apya-calendar-root");
xt && qt(
  xt,
  "calendar",
  /* @__PURE__ */ e.jsx(Bt, { children: /* @__PURE__ */ e.jsx(Gt, { children: /* @__PURE__ */ e.jsx(_t, { children: /* @__PURE__ */ e.jsx(js, {}) }) }) })
);
