import { j as e, d as me, r as g, b as Dt } from "./react-vendor-D57GAUXd.js";
import { c as k, B as z, b as oe, d as ce, S as ie, D as at, h as st, T as Ct } from "./Dialog-Bky2XNdc.js";
import { D as Et } from "./useDeviceMode-Dk7fb2QY.js";
import { a as Tt } from "./QueryProvider-B4436sFh.js";
import { E as de } from "./EmptyState-D5m5kdmR.js";
import { a as A } from "./httpClient-DePjXdo1.js";
import { d as $t } from "./draggableActivation-Ybw9Upbh.js";
import { u as V, b as L, a as U } from "./query-vendor-Bf69L2iP.js";
import { s as Rt } from "./storageScope-BcOJz0_P.js";
/* empty css               */
const O = {
  1: { key: "task", label: "Görev", plural: "görev", icon: "fa-circle-check", railLabel: "Görevler" },
  2: { key: "invoice", label: "Fatura", plural: "fatura", icon: "fa-file-invoice", railLabel: "Faturalar" },
  3: { key: "grant", label: "Hibe", plural: "hibe", icon: "fa-award", railLabel: "Hibe son tarihleri" },
  4: { key: "expense", label: "Gider", plural: "gider", icon: "fa-arrow-trend-down", railLabel: "Gider / gelir" },
  5: { key: "income", label: "Gelir", plural: "gelir", icon: "fa-arrow-trend-up", railLabel: "Gider / gelir" },
  6: { key: "cash", label: "Kasa hareketi", plural: "kasa hareketi", icon: "fa-wallet", railLabel: "Nakit hareketleri" },
  7: { key: "external", label: "Dış etkinlik", plural: "dış etkinlik", icon: "fa-calendar-days", railLabel: "Dış etkinlikler" }
}, le = [1, 2, 3, 4, 5, 6, 7], zt = [
  { key: "task", sources: [1] },
  { key: "invoice", sources: [2] },
  { key: "grant", sources: [3] },
  { key: "money", sources: [4, 5] },
  { key: "cash", sources: [6] }
], Ce = [1, 2, 3, 4, 5, 6], I = { DUE_TODAY: 1, OVERDUE: 2 }, At = (t) => t.risk === I.OVERDUE || t.risk === I.DUE_TODAY, rt = 864e5, Ee = (t) => new Date(t.getFullYear(), t.getMonth(), t.getDate()), M = (t, a) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + a);
function $(t) {
  const a = (s) => (s < 10 ? "0" : "") + s;
  return `${t.getFullYear()}-${a(t.getMonth() + 1)}-${a(t.getDate())}`;
}
function Re(t) {
  const a = (t.getDay() + 6) % 7;
  return new Date(t.getTime() - a * rt);
}
const nt = (t) => Re(new Date(t.getFullYear(), t.getMonth(), 1)), ze = 42;
function it(t) {
  const a = nt(t);
  return Array.from({ length: ze }, (s, r) => new Date(a.getTime() + r * rt));
}
const Kt = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }), Pt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }), It = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }), S = {
  monthTitle: (t) => Kt.format(t),
  dayTitle: (t) => Pt.format(t),
  dayShort: (t) => It.format(t),
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
function lt(t) {
  const a = {};
  for (const s of t ?? []) {
    const r = (s.date || "").slice(0, 10);
    r && (a[r] ?? (a[r] = [])).push(s);
  }
  return a;
}
const ye = (t) => (t ?? []).reduce((a, s) => a + (s.loadHours ?? 0), 0);
function Ot(t, { maxPills: a = 3, maxRiskPills: s = 2 } = {}) {
  const r = t ?? [];
  if (r.length === 0) return { pills: [], summaries: [] };
  if (r.length <= a) return { pills: r, summaries: [] };
  const u = r.filter(At).slice(0, s), x = new Set(u.map((i) => i.key)), c = /* @__PURE__ */ new Map();
  for (const i of r) {
    if (x.has(i.key)) continue;
    const p = c.get(i.source) ?? { source: i.source, count: 0, amount: 0, hasAmount: !1, only: null };
    p.count += 1, p.only = p.count === 1 ? i : null, i.amount != null && (p.amount += i.amount, p.hasAmount = !0), c.set(i.source, p);
  }
  const d = [];
  for (const i of le) {
    const p = c.get(i);
    p && (p.count === 1 && p.only ? u.push(p.only) : d.push(p));
  }
  return { pills: u, summaries: d };
}
function Ft(t, { compact: a = !0 } = {}) {
  const s = O[t.source], r = `${t.count} ${s ? s.plural : "öğe"}`;
  if (!t.hasAmount) return r;
  const o = a ? S.moneyCompact(t.amount) : S.money(t.amount);
  return `${r} · ${o}`;
}
function ot(t, a) {
  const s = $(a), r = (t ?? []).filter((d) => !d.isDone), o = r.filter((d) => d.date.slice(0, 10) < s && d.risk === I.OVERDUE), u = r.filter((d) => d.date.slice(0, 10) >= s), x = lt(u), c = Object.keys(x).sort().map((d) => ({
    key: d,
    date: /* @__PURE__ */ new Date(`${d}T00:00:00`),
    isToday: d === s,
    items: x[d]
  }));
  return { overdue: o, days: c };
}
function Mt(t) {
  const a = Re(Ee(t));
  return Array.from({ length: 7 }, (s, r) => M(a, r));
}
const Lt = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }), we = (t) => t ? Lt.format(new Date(t)) : "";
function he(t) {
  const a = new Date(t);
  return a.getHours() * 60 + a.getMinutes();
}
function qt(t) {
  let a = 8, s = 18;
  for (const r of t ?? [])
    r.startTime && (a = Math.min(a, Math.floor(he(r.startTime) / 60)), s = Math.max(s, Math.ceil(he(r.endTime ?? r.startTime) / 60)));
  return { start: Math.max(0, a), end: Math.min(24, Math.max(s, a + 4)) };
}
const We = (t) => !!t.startTime, Ve = (t) => t.getDay() === 0 || t.getDay() === 6;
function _t(t, { today: a, capacity: s = null, horizonDays: r = 21, fallbackPerDay: o = 3 } = {}) {
  const u = $(a), x = (t ?? []).filter((h) => !h.isDone), c = x.filter((h) => h.date.slice(0, 10) < u && h.risk === I.OVERDUE), d = c.filter((h) => h.canReschedule), i = c.filter((h) => !h.canReschedule), p = {}, l = {};
  for (const h of x) {
    const n = h.date.slice(0, 10);
    n < u || (p[n] = (p[n] ?? 0) + (h.loadHours ?? 0), l[n] = (l[n] ?? 0) + 1);
  }
  const m = [];
  let f = 0;
  for (const h of d) {
    let n = null;
    for (; f < r; ) {
      const b = M(a, f);
      if (Ve(b)) {
        f += 1;
        continue;
      }
      const v = $(b), w = p[v] ?? 0, E = l[v] ?? 0, N = h.loadHours ?? 0, y = s && N > s;
      if (s && !y ? w + N <= s : E < o) {
        p[v] = w + N, l[v] = E + 1, n = b;
        break;
      }
      f += 1;
    }
    if (!n) {
      let b = M(a, r);
      for (; Ve(b); ) b = M(b, 1);
      n = b;
    }
    m.push({ item: h, date: n });
  }
  return { suggestions: m, fixed: i };
}
const Bt = {
  [I.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [I.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function Te({ item: t, onSelect: a, showDate: s = !1 }) {
  const r = O[t.source], o = Bt[t.risk];
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
            s ? S.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
            t.subtitle,
            t.assigneeName,
            t.amount != null ? S.money(t.amount, t.currency) : null
          ].filter(Boolean).join(" · ") || (r ? r.label : "") })
        ] }),
        o && /* @__PURE__ */ e.jsx("span", { className: k("shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold", o.className), children: o.label })
      ]
    }
  );
}
function Yt({ items: t, today: a, onSelectItem: s, onSmartDefer: r }) {
  const { overdue: o, days: u } = ot(t, a);
  return o.length === 0 && u.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
    de,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-mug-hot" }),
      title: "Planlanmış bir şey yok",
      description: "Son tarihli görevler, fatura vadeleri ve tarihli finans kayıtları burada öncelik sırasıyla listelenir."
    }
  ) }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    o.length > 0 && /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-negative-100 bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 border-b border-negative-100 px-3 py-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-negative-700", children: "Gecikmiş" }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-semibold tabular-nums text-negative-700", children: o.length }),
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
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: o.map((x) => /* @__PURE__ */ e.jsx(Te, { item: x, onSelect: s, showDate: !0 }, x.key)) })
    ] }),
    u.map((x) => /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: k(
        "flex items-center justify-between border-b border-subtle px-3 py-2",
        x.isToday && "border-b-accent"
      ), children: [
        /* @__PURE__ */ e.jsxs("span", { className: k(
          "text-[11px] font-bold uppercase tracking-wider",
          x.isToday ? "text-accent" : "text-text-tertiary"
        ), children: [
          S.dayTitle(x.date),
          x.isToday ? " · Bugün" : ""
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: x.items.length })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: x.items.map((c) => /* @__PURE__ */ e.jsx(Te, { item: c, onSelect: s }, c.key)) })
    ] }, x.key))
  ] });
}
function Gt({ dayKey: t, items: a, capacity: s, onSelectItem: r, onClose: o }) {
  const u = /* @__PURE__ */ new Date(`${t}T00:00:00`), x = ye(a), c = s && x > s, d = a.reduce((i, p) => (i[p.source] = (i[p.source] ?? 0) + 1, i), {});
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: S.dayTitle(u) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(d).length === 0 ? "Planlanmış öğe yok" : Object.entries(d).map(([i, p]) => {
          var l;
          return `${p} ${((l = O[i]) == null ? void 0 : l.plural) ?? "öğe"}`;
        }).join(" · ") })
      ] }),
      o && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: o,
          "aria-label": "Günü kapat",
          className: "shrink-0 rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] }),
    s && x > 0 && /* @__PURE__ */ e.jsxs("div", { className: k(
      "flex items-center justify-between border-b px-3 py-2 text-[11.5px]",
      c ? "border-negative-100 bg-negative-50 text-negative-700" : "border-subtle text-text-secondary"
    ), children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-semibold", children: c ? "Kapasite aşımı" : "Gün yükü" }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono tabular-nums", children: [
        S.hours(x),
        " / ",
        S.hours(s)
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "flex-1 overflow-y-auto p-1", children: a.length === 0 ? /* @__PURE__ */ e.jsx(
      de,
      {
        compact: !0,
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-day" }),
        title: "Bu gün boş",
        description: "Bu güne düşen bir öğe yok."
      }
    ) : a.map((i) => /* @__PURE__ */ e.jsx(Te, { item: i, onSelect: r }, i.key)) })
  ] });
}
const Ut = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], Qt = {
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
function Ht({ item: t, onSelect: a, onDragStart: s, isPending: r, hasError: o }) {
  const u = O[t.source], x = Qt[t.risk], c = t.canReschedule && !t.isDone, d = $t(() => a(t));
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: c,
      onDragStart: c ? (i) => {
        i.stopPropagation(), i.dataTransfer.effectAllowed = "move", i.dataTransfer.setData("text/plain", t.key), s(t);
      } : void 0,
      onPointerDown: (i) => {
        i.stopPropagation(), d.onPointerDown(i);
      },
      onClick: (i) => {
        i.stopPropagation(), d.onClick(i);
      },
      title: t.subtitle ? `${t.title} — ${t.subtitle}` : t.title,
      style: x ? { backgroundImage: x.pattern } : void 0,
      className: k(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        x ? x.pill : "bg-neutral-subtle text-text-primary",
        t.isDone && "line-through opacity-65",
        c && "cursor-grab active:cursor-grabbing",
        /* Hata SATIRDA kalır — toast'a kaçmaz. */
        o && "ring-1 ring-negative-500",
        r && "opacity-60"
      ),
      children: [
        r ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin shrink-0 text-[9px]", "aria-hidden": "true" }) : u && /* @__PURE__ */ e.jsx("i", { className: k("fa shrink-0 text-[9px] opacity-70", u.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: t.title }),
        o && /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation ms-auto shrink-0 text-[9px]", "aria-hidden": "true" })
      ]
    }
  );
}
function Wt({ summary: t, onSelect: a }) {
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
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: Ft(t) })
      ]
    }
  );
}
function Vt({ load: t, capacity: a }) {
  if (!a || t <= 0) return null;
  const s = t > a, r = s ? a / t * 100 : t / a * 100;
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "mt-auto flex h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle",
      title: `Gün yükü ${S.hours(t)} / kapasite ${S.hours(a)}`,
      "aria-label": `Gün yükü ${S.hours(t)}, kapasite ${S.hours(a)}`,
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-full bg-accent", style: { width: `${r}%` } }),
        s && /* @__PURE__ */ e.jsx("span", { className: "h-full flex-1 bg-negative" })
      ]
    }
  );
}
function Xt({
  month: t,
  byDay: a,
  today: s,
  capacity: r,
  onSelectItem: o,
  onSelectDay: u,
  selectedDay: x,
  onDropItem: c,
  pending: d = {},
  errors: i = {},
  focusedDay: p,
  onFocusDay: l,
  onNavigate: m
}) {
  const f = it(t), h = $(s), [n, b] = me.useState(null), [v, w] = me.useState(null), E = me.useRef(null), N = p ?? x ?? h, y = (D) => {
    const T = M(/* @__PURE__ */ new Date(`${N}T00:00:00`), D);
    f.some((F) => $(F) === $(T)) || m == null || m(T), l == null || l($(T));
  }, K = (D) => {
    const T = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[D.key];
    if (T) {
      D.preventDefault(), y(T);
      return;
    }
    (D.key === "Enter" || D.key === " ") && (D.preventDefault(), u(N));
  };
  return me.useEffect(() => {
    var T, F;
    const D = (T = E.current) == null ? void 0 : T.querySelector(`[data-day="${N}"]`);
    D && ((F = E.current) != null && F.contains(document.activeElement)) && D.focus();
  }, [N]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Ut.map((D, T) => /* @__PURE__ */ e.jsx(
      "div",
      {
        className: k(
          "px-2.5 py-2 text-right text-[10.5px] font-bold uppercase tracking-wider",
          T > 4 ? "text-text-tertiary opacity-70" : "text-text-tertiary"
        ),
        children: D
      },
      D
    )) }),
    /* @__PURE__ */ e.jsx(
      "div",
      {
        ref: E,
        role: "grid",
        "aria-label": "Ay takvimi",
        tabIndex: 0,
        onKeyDown: K,
        className: "grid grid-cols-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
        children: f.map((D) => {
          const T = $(D), F = a[T] ?? [], { pills: X, summaries: ke } = Ot(F), J = ye(F), q = D.getMonth() !== t.getMonth(), ae = T === h, te = T === x;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              role: "gridcell",
              "data-day": T,
              tabIndex: T === N ? 0 : -1,
              "aria-selected": te,
              "aria-label": `${S.dayTitle(D)}${F.length ? `, ${F.length} öğe` : ", boş"}`,
              onClick: () => {
                l == null || l(T), u(T);
              },
              onDragOver: n ? (C) => {
                C.preventDefault(), C.dataTransfer.dropEffect = "move", v !== T && w(T);
              } : void 0,
              onDragLeave: n ? () => w((C) => C === T ? null : C) : void 0,
              onDrop: n ? (C) => {
                C.preventDefault();
                const Q = n;
                b(null), w(null), Q && Q.date.slice(0, 10) !== T && c(Q, /* @__PURE__ */ new Date(`${T}T00:00:00`));
              } : void 0,
              className: k(
                "flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5",
                "transition-colors duration-fast last:border-r-0 hover:bg-surface-hover",
                q ? "bg-surface-sunken" : "bg-surface-base",
                te && "ring-2 ring-inset ring-border-focus",
                v === T && "bg-primary-subtle ring-2 ring-inset ring-accent"
              ),
              children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                  J > 0 && r && J > r && /* @__PURE__ */ e.jsx("span", { className: "rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: S.hours(J) }),
                  /* @__PURE__ */ e.jsx(
                    "span",
                    {
                      className: k(
                        "ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11.5px] font-semibold leading-none tabular-nums",
                        ae && "bg-accent text-white",
                        !ae && q && "text-text-tertiary opacity-60",
                        !ae && !q && "text-text-secondary"
                      ),
                      children: D.getDate()
                    }
                  )
                ] }),
                X.map((C) => /* @__PURE__ */ e.jsx(
                  Ht,
                  {
                    item: C,
                    onSelect: o,
                    onDragStart: b,
                    isPending: !!d[C.key],
                    hasError: !!i[C.key]
                  },
                  C.key
                )),
                ke.map((C) => /* @__PURE__ */ e.jsx(
                  Wt,
                  {
                    summary: C,
                    onSelect: () => u(T)
                  },
                  `${T}-${C.source}`
                )),
                /* @__PURE__ */ e.jsx(Vt, { load: J, capacity: r })
              ]
            },
            T
          );
        })
      }
    )
  ] });
}
const Jt = { 1: "Google", 2: "Outlook", 3: "iCloud" };
function Zt(t) {
  const a = String(t ?? "").trim().split(/\s+/).filter(Boolean);
  return a.length === 0 ? "?" : a.length === 1 ? a[0].slice(0, 2).toLocaleUpperCase("tr") : (a[0][0] + a[a.length - 1][0]).toLocaleUpperCase("tr");
}
function ea({
  sources: t,
  counts: a,
  enabled: s,
  onToggle: r,
  compact: o = !1,
  externalAccounts: u = [],
  externalLoading: x = !1,
  onOpenSync: c,
  teamOpen: d = !1,
  onToggleTeam: i,
  teamContent: p,
  teamMembers: l = [],
  riskCounts: m
}) {
  const f = (t ?? []).filter((b) => b.isAvailable);
  if (f.length === 0) return null;
  const h = new Set(f.map((b) => b.source)), n = zt.map(({ key: b, sources: v }) => {
    const w = v.filter((E) => h.has(E));
    return w.length === 0 ? null : {
      key: b,
      sources: w,
      meta: O[w[0]],
      /* Grubun tamamı kapalıysa kapalı sayılır — biri açıksa satır açıktır. */
      isOn: w.some((E) => s.has(E)),
      count: w.reduce((E, N) => E + (a[N] ?? 0), 0)
    };
  }).filter(Boolean);
  return /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Takvim kaynakları",
      className: k(
        "flex flex-col gap-1 rounded-card border border-subtle bg-surface-base p-2",
        o ? "w-[60px] items-center" : "w-full"
      ),
      children: [
        !o && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Kaynaklar" }),
        n.map(({ key: b, sources: v, meta: w, isOn: E, count: N }) => w ? /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": E,
            title: o ? `${w.railLabel ?? w.label} — ${N} öğe` : void 0,
            onClick: () => {
              const y = !E;
              v.forEach((K) => {
                s.has(K) !== y && r(K);
              });
            },
            className: k(
              "group flex items-center rounded-md text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              o ? "relative h-11 w-11 justify-center" : "gap-2.5 px-2 py-2",
              E ? "text-text-primary" : "text-text-tertiary",
              "hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: k(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px]",
                    E ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
                  ),
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ e.jsx("i", { className: k("fa", w.icon) })
                }
              ),
              o ? N > 0 && /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: k(
                    "absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-[9.5px] font-bold leading-4",
                    E ? "bg-accent text-white" : "bg-neutral-200 text-text-tertiary"
                  ),
                  children: N
                }
              ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsx("span", { className: k("flex-1 truncate text-[12.5px] font-medium", !E && "line-through decoration-1"), children: w.railLabel ?? w.label }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: N })
              ] })
            ]
          },
          b
        ) : null),
        !o && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex items-center justify-between border-t border-subtle px-2 pb-1 pt-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Dış takvimler" }),
            c && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: c,
                className: "rounded p-1 text-[11px] font-medium text-text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                children: "+ Ekle"
              }
            )
          ] }),
          u.length === 0 && !x && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 text-[11.5px] text-text-tertiary", children: "Bağlı takvim yok." }),
          x && u.length === 0 && /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1 text-[11.5px] text-text-tertiary", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
            "senkronize ediliyor…"
          ] }),
          u.map((b) => /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: k(
                "flex items-start gap-2 rounded-md px-2 py-1.5",
                b.error && "bg-negative-50"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: k(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px]",
                      b.error ? "bg-negative-100 text-negative-700" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: k("fa", b.error ? "fa-triangle-exclamation" : "fa-calendar-days") })
                  }
                ),
                /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: Jt[b.provider] ?? "Takvim" }),
                  /* @__PURE__ */ e.jsx("span", { className: k(
                    "block truncate text-[10.5px]",
                    b.error ? "text-negative-700" : "text-text-tertiary"
                  ), children: b.error ?? `${b.email} · ${b.eventCount} etkinlik` }),
                  b.error && /* @__PURE__ */ e.jsx("a", { href: "/Calendars", className: "text-[10.5px] font-semibold text-text-link hover:underline", children: "Yeniden bağla" })
                ] })
              ]
            },
            b.accountId
          )),
          !o && i && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                role: "switch",
                "aria-checked": d,
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
                      className: k("fa text-[11px]", d ? "fa-toggle-on text-accent" : "fa-toggle-off text-text-tertiary"),
                      "aria-hidden": "true"
                    }
                  )
                ]
              }
            ),
            l.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-1 px-2 pb-1", children: [
              l.slice(0, 3).map((b) => /* @__PURE__ */ e.jsxs(
                "span",
                {
                  title: b.name,
                  className: "flex items-center gap-1 rounded-full bg-neutral-subtle py-0.5 pe-2 ps-0.5 text-[10.5px] text-text-secondary",
                  children: [
                    /* @__PURE__ */ e.jsx(
                      "span",
                      {
                        className: "flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[8.5px] font-bold text-[color:var(--apya-avatar-fg)]",
                        "aria-hidden": "true",
                        children: Zt(b.name)
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { className: "max-w-[86px] truncate", children: b.name })
                  ]
                },
                b.userId
              )),
              l.length > 3 && /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-medium text-text-tertiary", children: [
                "+",
                l.length - 3
              ] })
            ] }),
            p
          ] }),
          m && (m.overdue > 0 || m.dueToday > 0 || m.syncError > 0) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("p", { className: "mt-2 border-t border-subtle px-2 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Risk" }),
            [
              { key: "overdue", label: "Gecikmiş", value: m.overdue, dot: "bg-negative" },
              { key: "dueToday", label: "Bugün son gün", value: m.dueToday, dot: "bg-warning" },
              { key: "syncError", label: "Senkron hatası", value: m.syncError, dot: "bg-negative-700" }
            ].filter((b) => b.value > 0).map((b) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-2 py-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: k("h-[7px] w-[7px] shrink-0 rounded-full", b.dot), "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[11.5px] text-text-secondary", children: b.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-primary", children: b.value })
            ] }, b.key))
          ] }),
          c && /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: c,
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
const ta = { month: "Ay", week: "Hafta", day: "Gün", agenda: "Ajanda" };
function aa(t) {
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
function ct() {
  var a;
  const t = "/Tasks/CreateModal";
  (a = window.abp) != null && a.ModalManager ? new window.abp.ModalManager(t).open() : window.location.href = t;
}
function sa() {
  return /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: ct,
      "aria-label": "Yeni görev",
      title: "Yeni görev",
      style: { bottom: "calc(1rem + env(safe-area-inset-bottom))" },
      className: "fixed right-4 z-fixed grid h-14 w-14 place-items-center rounded-full bg-accent text-text-inverse shadow-lg transition-colors duration-fast hover:bg-accent-600 active:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
      children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus text-[19px]", "aria-hidden": "true" })
    }
  );
}
function ra({
  title: t,
  view: a,
  onView: s,
  onPrev: r,
  onNext: o,
  onToday: u,
  overloadDays: x,
  onHelp: c,
  filterCount: d = 0,
  onClearFilters: i,
  lastSyncAt: p,
  syncError: l = !1,
  canCreateTask: m = !0,
  compact: f = !1
}) {
  const h = a !== "agenda", n = aa(p);
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
          onClick: o,
          "aria-label": "Sonrakine git",
          className: "h-9 w-9 rounded-r-md border border-l-0 border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(z, { variant: "outline", size: "sm", onClick: u, children: "Bugün" }),
    /* @__PURE__ */ e.jsx("h2", { className: "ml-1 text-[17px] font-semibold capitalize tracking-tight text-text-primary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "ml-auto flex flex-wrap items-center justify-end gap-2", children: [
      x > 0 && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "rounded-md bg-negative-50 px-2 py-1 text-[11.5px] font-semibold text-negative-700",
          title: "Günlük kapasitenizi aşan gün sayısı",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
            x,
            " günde kapasite aşımı"
          ]
        }
      ),
      (n || l) && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: k(
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium",
            l ? "bg-negative-50 text-negative-700" : "text-text-tertiary"
          ),
          title: l ? "Bir dış takvim senkronlanamıyor" : "Dış takvimlerin son senkron zamanı",
          children: [
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: k("h-[6px] w-[6px] rounded-full", l ? "bg-negative" : "bg-positive"),
                "aria-hidden": "true"
              }
            ),
            "Senkron",
            n ? ` · ${n}` : ""
          ]
        }
      ),
      d > 0 && i && /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: i,
          title: "Filtreleri temizle — kapalı kaynakları geri aç",
          className: "flex h-9 items-center gap-1.5 rounded-md border border-default bg-surface-base px-2.5 text-[12px] font-medium text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: [
            "Filtre",
            /* @__PURE__ */ e.jsx("span", { className: "rounded-full bg-primary-subtle px-1.5 text-[11px] font-semibold text-accent", children: d })
          ]
        }
      ),
      !f && /* @__PURE__ */ e.jsxs(
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
      c && !f && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: c,
          title: "Klavye kısayolları (?)",
          "aria-label": "Klavye kısayolları",
          className: "h-9 w-9 rounded-md border border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-keyboard", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(ta).map(([b, v]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": a === b,
          onClick: () => s(b),
          className: k(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            a === b ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: v
        },
        b
      )) }),
      m && !f && /* @__PURE__ */ e.jsxs(z, { variant: "primary", size: "sm", onClick: ct, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus me-1.5", "aria-hidden": "true" }),
        "Yeni görev"
      ] })
    ] })
  ] });
}
const ee = 44, na = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], ia = {
  [I.OVERDUE]: "bg-negative-50 text-negative-700",
  [I.DUE_TODAY]: "bg-warning-50 text-warning-700"
};
function la({ load: t, capacity: a }) {
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
function oa({ days: t, byDay: a, today: s, capacity: r, onSelectItem: o, onSelectDay: u, selectedDay: x }) {
  const c = $(s), d = g.useRef(null), [i, p] = g.useState(() => {
    const N = /* @__PURE__ */ new Date();
    return N.getHours() * 60 + N.getMinutes();
  });
  g.useEffect(() => {
    const N = setInterval(() => {
      const y = /* @__PURE__ */ new Date();
      p(y.getHours() * 60 + y.getMinutes());
    }, 6e4);
    return () => clearInterval(N);
  }, []);
  const l = t.map($), m = {}, f = {};
  for (const N of l) {
    const y = a[N] ?? [];
    m[N] = y.filter(We), f[N] = y.filter((K) => !We(K));
  }
  const h = l.flatMap((N) => m[N]), { start: n, end: b } = qt(h), v = Array.from({ length: b - n }, (N, y) => n + y), w = (b - n) * ee, E = l.includes(c) && i >= n * 60 && i <= b * 60;
  return g.useEffect(() => {
    if (!E || !d.current) return;
    const N = (i - n * 60) / 60 * ee;
    d.current.scrollTop = Math.max(0, N - 120);
  }, [E, n]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "grid border-b border-default bg-surface-raised",
        style: { gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))` },
        children: [
          /* @__PURE__ */ e.jsx("div", {}),
          t.map((N) => {
            const y = $(N), K = ye(a[y] ?? []), D = y === c;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => u(y),
                className: k(
                  "border-l border-subtle px-2 py-2 text-left transition-colors duration-fast hover:bg-surface-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
                  x === y && "bg-primary-subtle"
                ),
                children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "flex items-baseline gap-1.5", children: [
                    /* @__PURE__ */ e.jsx("span", { className: k(
                      "text-[10.5px] font-bold uppercase tracking-wider",
                      D ? "text-accent" : "text-text-tertiary"
                    ), children: na[(N.getDay() + 6) % 7] }),
                    /* @__PURE__ */ e.jsx("span", { className: k(
                      "font-mono text-[13px] font-semibold tabular-nums",
                      D ? "text-accent" : "text-text-primary"
                    ), children: N.getDate() }),
                    r && K > r && /* @__PURE__ */ e.jsx("span", { className: "ms-auto rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: S.hours(K) })
                  ] }),
                  /* @__PURE__ */ e.jsx(la, { load: K, capacity: r })
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
          l.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-[46px] flex-col gap-[3px] border-l border-subtle p-1", children: [
            f[N].slice(0, 4).map((y) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => o(y),
                title: y.title,
                className: k(
                  "flex w-full items-center gap-1 truncate rounded-[5px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                  ia[y.risk] ?? "bg-neutral-subtle text-text-primary",
                  y.isDone && "line-through opacity-65"
                ),
                children: [
                  O[y.source] && /* @__PURE__ */ e.jsx("i", { className: k("fa shrink-0 text-[9px] opacity-70", O[y.source].icon), "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "truncate", children: y.title })
                ]
              },
              y.key
            )),
            f[N].length > 4 && /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => u(N),
                className: "px-1.5 text-left text-[10.5px] font-medium text-text-tertiary hover:text-text-primary",
                children: [
                  "+",
                  f[N].length - 4,
                  " öğe"
                ]
              }
            )
          ] }, N))
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { ref: d, className: "max-h-[520px] overflow-y-auto", children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "relative grid",
          style: {
            gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))`,
            height: `${w}px`
          },
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "relative", children: v.map((N, y) => /* @__PURE__ */ e.jsxs(
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
            l.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "relative border-l border-subtle", children: [
              v.map((y, K) => /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "absolute inset-x-0 border-t border-subtle",
                  style: { top: `${K * ee}px` }
                },
                y
              )),
              m[N].map((y) => {
                const K = he(y.startTime), D = y.endTime ? he(y.endTime) : K + 60, T = (K - n * 60) / 60 * ee, F = Math.max((D - K) / 60 * ee, 18);
                return /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => o(y),
                    title: `${y.title} · ${we(y.startTime)}`,
                    style: {
                      top: `${T}px`,
                      height: `${F}px`,
                      backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(0,0,0,.05) 4px, rgba(0,0,0,.05) 6px)"
                    },
                    className: k(
                      "absolute inset-x-0.5 overflow-hidden rounded-[5px] border-l-2 border-accent bg-primary-subtle",
                      "px-1.5 py-0.5 text-left text-[10.5px] leading-tight text-text-primary",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    ),
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: "block truncate font-semibold", children: y.title }),
                      /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[9.5px] text-text-tertiary", children: [
                        we(y.startTime),
                        y.endTime ? `–${we(y.endTime)}` : ""
                      ] })
                    ]
                  },
                  y.key
                );
              }),
              E && N === c && /* @__PURE__ */ e.jsx(
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
function ca({ item: t }) {
  var p;
  const [a, s] = g.useState(""), [r, o] = g.useState(() => /* @__PURE__ */ new Set()), u = t.description ?? t.subtitle ?? "", x = V({
    queryKey: ["calendar", "projects-lookup"],
    queryFn: () => A.get("/api/app/task/projects-lookup"),
    staleTime: 10 * 6e4
  }), c = L({
    mutationFn: async () => {
      const l = new FormData();
      l.append("file", new Blob([`${t.title}

${u}`], { type: "text/plain" }), "toplanti-notlari.txt");
      const m = await fetch(`/api/ai-task-generator/parse?projectId=${a}`, {
        method: "POST",
        body: l,
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });
      if (!m.ok) throw new Error("Notlardan görev çıkarılamadı.");
      return m.json();
    },
    onSuccess: (l) => o(new Set(((l == null ? void 0 : l.suggestions) ?? []).map((m, f) => f)))
  }), d = L({
    mutationFn: () => {
      var l;
      return A.post("/api/ai-task-generator/create-tasks", {
        projectId: a,
        approvedTasks: (((l = c.data) == null ? void 0 : l.suggestions) ?? []).filter((m, f) => r.has(f))
      });
    }
  }), i = ((p = c.data) == null ? void 0 : p.suggestions) ?? [];
  return /* @__PURE__ */ e.jsxs("section", { className: "border-t border-subtle px-4 py-3", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Toplantıdan görev" }),
    !u && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[11.5px] text-text-tertiary", children: "Bu etkinlikte not yok — çıkarılacak aksiyon maddesi bulunamaz." }),
    u && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs(
        "select",
        {
          value: a,
          onChange: (l) => s(l.target.value),
          "aria-label": "Görevlerin ekleneceği proje",
          className: "mt-1.5 w-full rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "Proje seçin…" }),
            (x.data ?? []).map((l) => /* @__PURE__ */ e.jsx("option", { value: l.id, children: l.name }, l.id))
          ]
        }
      ),
      /* @__PURE__ */ e.jsx(
        z,
        {
          size: "sm",
          variant: "outline",
          className: "mt-2",
          disabled: !a || c.isPending,
          onClick: () => c.mutate(),
          children: c.isPending ? "Notlar okunuyor…" : "Notlardan aksiyon çıkar"
        }
      ),
      c.isError && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-negative-700", children: c.error.message }),
      i.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", children: [
        i.map((l, m) => /* @__PURE__ */ e.jsxs("label", { className: "flex cursor-pointer items-start gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: r.has(m),
              onChange: () => o((f) => {
                const h = new Set(f);
                return h.has(m) ? h.delete(m) : h.add(m), h;
              }),
              className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[12px] text-text-primary", children: l.title })
        ] }, `${l.title}-${m}`)),
        /* @__PURE__ */ e.jsx(
          z,
          {
            size: "sm",
            variant: "primary",
            className: k("mt-2"),
            disabled: r.size === 0 || d.isPending || d.isSuccess,
            onClick: () => d.mutate(),
            children: d.isSuccess ? `${d.data} görev eklendi` : d.isPending ? "Ekleniyor…" : `${r.size} görev olarak ekle`
          }
        )
      ] })
    ] })
  ] });
}
const da = {
  [I.OVERDUE]: { text: "Gecikmiş", cls: "bg-negative-50 text-negative-700" },
  [I.DUE_TODAY]: { text: "Bugün son gün", cls: "bg-warning-50 text-warning-700" }
};
function ne({ label: t, children: a }) {
  return a ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-subtle py-2.5 last:border-b-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11.5px] font-medium text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "min-w-0 text-right text-[12.5px] text-text-primary", children: a })
  ] }) : null;
}
function ua({ item: t, capacity: a, onClose: s, onReschedule: r, onComplete: o, isPending: u, error: x, onRetry: c }) {
  const [d, i] = g.useState(() => t.date.slice(0, 10)), p = O[t.source], l = da[t.risk], m = t.date.slice(0, 10);
  g.useEffect(() => i(m), [m]);
  const f = () => {
    !d || d === m || r(t, /* @__PURE__ */ new Date(`${d}T00:00:00`));
  };
  return /* @__PURE__ */ e.jsx(oe, { open: !0, onOpenChange: (h) => {
    h || s();
  }, children: /* @__PURE__ */ e.jsxs(ce, { side: "right", title: t.title, className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md bg-neutral-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary", children: [
          p && /* @__PURE__ */ e.jsx("i", { className: k("fa text-[10px]", p.icon), "aria-hidden": "true" }),
          p == null ? void 0 : p.label
        ] }),
        l && /* @__PURE__ */ e.jsx("span", { className: k("rounded-md px-2 py-1 text-[11px] font-bold", l.cls), children: l.text }),
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
    x && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-negative-100 bg-negative-50 px-4 py-2.5 text-[12px] text-negative-700", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: x }),
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: c, className: "font-semibold underline", children: "Yeniden dene" })
    ] }),
    u && /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle px-4 py-2 text-[12px] text-text-tertiary", "aria-live": "polite", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "kaydediliyor…"
    ] }),
    (t.canComplete || t.canReschedule) && !t.isDone && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2 border-b border-subtle px-4 py-3", children: [
      t.canComplete && /* @__PURE__ */ e.jsxs(z, { size: "sm", variant: "secondary", onClick: () => o(t), children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-check me-1.5", "aria-hidden": "true" }),
        "Tamamla"
      ] }),
      t.canReschedule && /* @__PURE__ */ e.jsx(
        z,
        {
          size: "sm",
          variant: "outline",
          onClick: () => r(t, M(/* @__PURE__ */ new Date(`${m}T00:00:00`), 1)),
          children: "+1 gün ertele"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-2", children: [
      /* @__PURE__ */ e.jsx(ne, { label: "Son tarih", children: t.canReschedule ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "date",
            value: d,
            onChange: (h) => i(h.target.value),
            className: "rounded-md border border-default bg-surface-base px-2 py-1 text-[12.5px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": "Son tarih"
          }
        ),
        d !== m && /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "primary", onClick: f, children: "Uygula" })
      ] }) : /* @__PURE__ */ e.jsxs("span", { className: "text-text-secondary", children: [
        S.dayTitle(/* @__PURE__ */ new Date(`${m}T00:00:00`)),
        /* @__PURE__ */ e.jsx("span", { className: "ml-1.5 text-text-tertiary", children: "· takvimden değiştirilemez" })
      ] }) }),
      /* @__PURE__ */ e.jsx(ne, { label: "Bağlam", children: t.subtitle }),
      /* @__PURE__ */ e.jsx(ne, { label: "Atanan", children: t.assigneeName }),
      /* @__PURE__ */ e.jsx(ne, { label: "Tutar", children: t.amount != null ? S.money(t.amount, t.currency) : null }),
      /* @__PURE__ */ e.jsx(ne, { label: "Gün yükü", children: t.loadHours != null ? `${S.hours(t.loadHours)}${a ? ` / ${S.hours(a)} kapasite` : ""}` : null })
    ] }),
    t.source === 7 && /* @__PURE__ */ e.jsx(ca, { item: t }),
    t.href && /* @__PURE__ */ e.jsx("footer", { className: "border-t border-subtle px-4 py-3", children: /* @__PURE__ */ e.jsxs(
      "a",
      {
        href: t.href,
        className: "text-[12.5px] font-medium text-text-link hover:underline",
        children: [
          p == null ? void 0 : p.label,
          " ekranında aç",
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right ms-1.5 text-[10px]", "aria-hidden": "true" })
        ]
      }
    ) })
  ] }) });
}
const dt = ["calendar", "sync-settings"];
function xa(t) {
  return V({
    queryKey: dt,
    queryFn: () => A.get("/api/app/calendar/sync-settings"),
    enabled: t,
    staleTime: 3e4
  });
}
function pa() {
  const t = U();
  return L({
    /* ABP konvansiyonu: UpdateSyncRulesAsync → PUT (POST 405). */
    mutationFn: (a) => A.put("/api/app/calendar/sync-rules", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: dt }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
const ut = ["calendar", "sync-settings"], ma = ["calendar", "external"];
function xt() {
  return L({
    mutationFn: (t) => A.get(`/api/app/calendar/auth-url?provider=${t}`),
    /* Sağlayıcının kendi ekranına gidiliyor: SPA yönlendirmesi değil, tam sayfa. */
    onSuccess: (t) => {
      typeof t == "string" && t && (window.location.href = t);
    }
  });
}
function ba() {
  const t = U();
  return L({
    mutationFn: (a) => A.post(`/api/app/calendar/${a}/disconnect-account`, {}),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: ut }), t.invalidateQueries({ queryKey: ma });
    }
  });
}
function fa() {
  const t = U();
  return L({
    mutationFn: (a) => A.post(`/api/app/calendar/${a}/force-sync`, {}),
    /* "Son senkron" damgası ve senkron günlüğü bu çağrıyla değişir. */
    onSuccess: () => t.invalidateQueries({ queryKey: ut })
  });
}
const pt = ["calendar", "ical-feed"], Ae = ["calendar", "ical-subscriptions"];
function ha(t) {
  return V({
    queryKey: pt,
    /* GetOrCreate: bağlantı yoksa ilk açılışta üretilir. */
    queryFn: () => A.post("/api/app/ical-feed/ensure", {}),
    enabled: t,
    staleTime: 1 / 0
  });
}
function ga() {
  const t = U();
  return L({
    mutationFn: () => A.post("/api/app/ical-feed/regenerate", {}),
    onSuccess: (a) => t.setQueryData(pt, a)
  });
}
function ya(t) {
  return V({
    queryKey: Ae,
    queryFn: () => A.get("/api/app/ical-subscription"),
    enabled: t,
    staleTime: 3e4
  });
}
function ka() {
  const t = U();
  return L({
    mutationFn: (a) => A.post("/api/app/ical-subscription", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Ae }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function va() {
  const t = U();
  return L({
    mutationFn: (a) => A.delete(`/api/app/ical-subscription/${a}`),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Ae }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function ja() {
  return L({
    mutationFn: (t) => A.post(`/api/app/ical-subscription/probe?url=${encodeURIComponent(t)}`, {})
  });
}
const Na = {
  1: { label: "Google Calendar", icon: "fa-google", brand: "bg-[#ea4335]" },
  2: { label: "Microsoft Outlook", icon: "fa-windows", brand: "bg-[#0078d4]" },
  3: { label: "iCloud", icon: "fa-apple", brand: "bg-neutral-700" }
}, wa = {
  0: { title: "Son değişen kazanır", desc: "İki taraf da düzenlenirse en son yapılan değişiklik uygulanır; ekranda geri alma şeridi çıkar." },
  1: { title: "APYA her zaman kazanır", desc: "Dış takvim salt-okunur ayna olur; dışarıdaki düzenleme geri alınır." }
}, Xe = {
  0: { icon: "fa-arrow-up-from-bracket", cls: "text-text-tertiary" },
  1: { icon: "fa-code-merge", cls: "text-warning-700" },
  2: { icon: "fa-triangle-exclamation", cls: "text-negative-700" }
};
function Ke(t) {
  if (!t) return "hiç";
  const a = Math.round((Date.now() - new Date(t).getTime()) / 6e4);
  return a < 1 ? "az önce" : a < 60 ? `${a} dk önce` : a < 1440 ? `${Math.round(a / 60)} sa önce` : S.dayShort(new Date(t));
}
function Sa({ account: t, onSave: a, saving: s }) {
  var h;
  const r = Na[t.provider] ?? { label: "Takvim", icon: "fa-calendar", brand: "bg-neutral-700" }, o = fa(), u = ba(), [x, c] = g.useState(() => new Set(t.syncSources ?? [])), [d, i] = g.useState(t.conflictRule ?? 0), [p, l] = g.useState(t.isSyncEnabled);
  g.useEffect(() => {
    c(new Set(t.syncSources ?? [])), i(t.conflictRule ?? 0), l(t.isSyncEnabled);
  }, [t]);
  const m = p !== t.isSyncEnabled || d !== t.conflictRule || x.size !== (t.syncSources ?? []).length || [...x].some((n) => !(t.syncSources ?? []).includes(n)), f = (n) => c((b) => {
    const v = new Set(b);
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
          Ke(t.lastSyncTime)
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("label", { className: "flex shrink-0 items-center gap-1.5 text-[11.5px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: p,
            onChange: (n) => l(n.target.checked),
            className: "h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
          }
        ),
        "Açık"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Bu hesaba ne gitsin?" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Ce.map((n) => {
        var v, w;
        const b = x.has(n);
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": b,
            onClick: () => f(n),
            className: k(
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              b ? "border-accent bg-primary-subtle text-accent" : "border-subtle bg-surface-base text-text-tertiary hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: k("fa text-[10px]", (v = O[n]) == null ? void 0 : v.icon), "aria-hidden": "true" }),
              (w = O[n]) == null ? void 0 : w.label
            ]
          },
          n
        );
      }) }),
      x.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-text-tertiary", children: "Hiçbiri seçili değil — yalnız görevler gönderilir." }),
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Çakışma kuralı" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: Object.entries(wa).map(([n, b]) => {
        const v = Number(n), w = d === v;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => i(v),
            className: k(
              "rounded-md border px-2.5 py-2 text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              w ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("span", { className: k("block text-[12px] font-semibold", w ? "text-accent" : "text-text-primary"), children: b.title }),
              /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] leading-snug text-text-tertiary", children: b.desc })
            ]
          },
          n
        );
      }) }),
      m && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          z,
          {
            size: "sm",
            variant: "primary",
            disabled: s,
            onClick: () => a({
              accountId: t.id,
              isSyncEnabled: p,
              syncSources: [...x],
              syncProjectIds: t.syncProjectIds ?? [],
              conflictRule: d
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
          disabled: o.isPending,
          onClick: () => o.mutate(t.id),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-rotate me-1.5", "aria-hidden": "true" }),
            o.isPending ? "Senkronlanıyor…" : "Şimdi senkronize et"
          ]
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          disabled: u.isPending,
          onClick: () => {
            window.confirm(`${t.externalEmail} bağlantısı kaldırılsın mı? Dış takvimdeki mevcut etkinlikler silinmez.`) && u.mutate(t.id);
          },
          className: "ms-auto rounded-md px-2 py-1 text-[11.5px] font-medium text-negative-700 hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-60",
          children: u.isPending ? "Kaldırılıyor…" : "Bağlantıyı kaldır"
        }
      )
    ] }),
    (o.isError || u.isError) && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "border-t border-subtle px-3 py-2 text-[11.5px] text-negative-700", children: ((h = o.error || u.error) == null ? void 0 : h.message) || "İşlem tamamlanamadı." })
  ] });
}
const Da = [
  { value: 15, label: "15 dk" },
  { value: 60, label: "1 saat" },
  { value: 360, label: "6 saat" },
  { value: 1440, label: "Günlük" }
];
function Ca({ open: t }) {
  var v, w, E, N;
  const a = ha(t), s = ga(), r = ya(t), o = ka(), u = va(), x = ja(), [c, d] = g.useState(""), [i, p] = g.useState(""), [l, m] = g.useState(60), [f, h] = g.useState(!1), n = (v = a.data) != null && v.path ? `${window.location.origin}${a.data.path}` : "", b = async () => {
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
        /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "outline", onClick: b, disabled: !n, children: f ? "Kopyalandı" : "Kopyala" })
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
            value: c,
            onChange: (y) => {
              d(y.target.value), x.reset();
            },
            placeholder: "https://…/basic.ics",
            "aria-label": "Takvim bağlantısı",
            className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          }
        ),
        ((w = x.data) == null ? void 0 : w.isValid) && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-positive-700", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-check me-1", "aria-hidden": "true" }),
          "Bağlantı doğrulandı · ",
          x.data.eventCount,
          " etkinlik bulundu"
        ] }),
        x.data && !x.data.isValid && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-negative-700", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
          x.data.error
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              value: i,
              onChange: (y) => p(y.target.value),
              placeholder: ((E = x.data) == null ? void 0 : E.suggestedName) || "Görünen ad",
              "aria-label": "Görünen ad",
              className: "min-w-0 flex-1 rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              value: l,
              onChange: (y) => m(Number(y.target.value)),
              "aria-label": "Yenileme sıklığı",
              className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
              children: Da.map((y) => /* @__PURE__ */ e.jsx("option", { value: y.value, children: y.label }, y.value))
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(
            z,
            {
              size: "sm",
              variant: "outline",
              disabled: !c || x.isPending,
              onClick: () => x.mutate(c),
              children: x.isPending ? "Deneniyor…" : "Bağlantıyı dene"
            }
          ),
          /* @__PURE__ */ e.jsx(
            z,
            {
              size: "sm",
              variant: "primary",
              disabled: !c || o.isPending,
              onClick: () => o.mutate(
                { url: c, displayName: i, color: "accent", refreshMinutes: l },
                { onSuccess: () => {
                  d(""), p(""), x.reset();
                } }
              ),
              children: o.isPending ? "Ekleniyor…" : "Takvimi ekle"
            }
          )
        ] }),
        o.isError && /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-negative-700", children: ((N = o.error) == null ? void 0 : N.message) || "Takvim eklenemedi." }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] leading-snug text-text-tertiary", children: [
          "iCal abonelikleri ",
          /* @__PURE__ */ e.jsx("strong", { className: "font-semibold", children: "tek yönlüdür" }),
          ": etkinlikler APYA'da salt-okunur görünür, APYA öğeleri bu takvime yazılmaz. Çift yönlü senkron için Google veya Outlook hesabı bağlayın."
        ] })
      ] }),
      (r.data ?? []).length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 border-t border-subtle pt-2", children: r.data.map((y) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: y.displayName }),
          /* @__PURE__ */ e.jsx("span", { className: k(
            "block truncate text-[10.5px]",
            y.lastError ? "text-negative-700" : "text-text-tertiary"
          ), children: y.lastError ?? `${y.lastEventCount} etkinlik · ${Ke(y.lastFetchedAt)} çekildi` })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => u.mutate(y.id),
            className: "shrink-0 rounded p-1 text-[11px] text-text-tertiary hover:text-negative-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": `${y.displayName} aboneliğini kaldır`,
            children: "Kaldır"
          }
        )
      ] }, y.id)) })
    ] })
  ] });
}
function Ea({ open: t, onClose: a }) {
  var x, c;
  const { data: s, isPending: r } = xa(t), o = pa(), u = xt();
  return /* @__PURE__ */ e.jsx(oe, { open: t, onOpenChange: (d) => {
    d || a();
  }, children: /* @__PURE__ */ e.jsxs(ce, { side: "right", title: "Takvim senkronizasyonu", className: "w-full max-w-[440px] p-0", children: [
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
      /* @__PURE__ */ e.jsx(ie, { height: 92 }),
      /* @__PURE__ */ e.jsx(ie, { height: 92 })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", children: [
      ((s == null ? void 0 : s.accounts) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-4", children: /* @__PURE__ */ e.jsx(
        de,
        {
          compact: !0,
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
          title: "Bağlı hesap yok",
          description: "Google veya Outlook bağlayınca size atanan tarihli öğeler oraya etkinlik olarak yazılır.",
          action: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center justify-center gap-2", children: [
            /* @__PURE__ */ e.jsxs(z, { size: "sm", variant: "outline", disabled: u.isPending, onClick: () => u.mutate(1), children: [
              /* @__PURE__ */ e.jsx("i", { className: "fab fa-google me-1.5", "aria-hidden": "true" }),
              "Google bağla"
            ] }),
            /* @__PURE__ */ e.jsxs(z, { size: "sm", variant: "outline", disabled: u.isPending, onClick: () => u.mutate(2), children: [
              /* @__PURE__ */ e.jsx("i", { className: "fab fa-windows me-1.5", "aria-hidden": "true" }),
              "Outlook bağla"
            ] })
          ] })
        }
      ) }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        o.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "text-[11.5px] text-negative-700", children: ((x = o.error) == null ? void 0 : x.message) || "Senkron kuralları kaydedilemedi." }),
        s.accounts.map((d) => /* @__PURE__ */ e.jsx(
          Sa,
          {
            account: d,
            saving: o.isPending,
            onSave: (i) => o.mutate(i)
          },
          d.id
        )),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: "Başka hesap bağla:" }),
          /* @__PURE__ */ e.jsxs(z, { size: "sm", variant: "outline", disabled: u.isPending, onClick: () => u.mutate(1), children: [
            /* @__PURE__ */ e.jsx("i", { className: "fab fa-google me-1.5", "aria-hidden": "true" }),
            "Google"
          ] }),
          /* @__PURE__ */ e.jsxs(z, { size: "sm", variant: "outline", disabled: u.isPending, onClick: () => u.mutate(2), children: [
            /* @__PURE__ */ e.jsx("i", { className: "fab fa-windows me-1.5", "aria-hidden": "true" }),
            "Outlook"
          ] })
        ] })
      ] }),
      u.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "text-[11.5px] text-negative-700", children: ((c = u.error) == null ? void 0 : c.message) || "Yetkilendirme adresi alınamadı." }),
      /* @__PURE__ */ e.jsx(Ca, { open: t }),
      /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
        /* @__PURE__ */ e.jsx("header", { className: "border-b border-subtle px-3 py-2", children: /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-semibold text-text-primary", children: "Senkron günlüğü" }) }),
        /* @__PURE__ */ e.jsx("div", { className: "px-3 py-2", children: ((s == null ? void 0 : s.log) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-2 text-[11.5px] text-text-tertiary", children: "Henüz senkron kaydı yok." }) : s.log.map((d) => {
          const i = Xe[d.kind] ?? Xe[0];
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
            /* @__PURE__ */ e.jsx("i", { className: k("fa mt-0.5 shrink-0 text-[11px]", i.icon, i.cls), "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[11.5px] leading-snug text-text-secondary", children: d.message }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: Ke(d.occurredAt) })
          ] }, d.id);
        }) })
      ] })
    ] }) })
  ] }) });
}
const mt = ["calendar", "preferences"];
function Ta() {
  return V({
    queryKey: mt,
    queryFn: () => A.get("/api/app/calendar/preferences"),
    staleTime: 5 * 6e4
  });
}
function $a() {
  const t = U();
  return L({
    /* ABP konvansiyonu: Update* metotları PUT'a düşer. POST 405 döner ve
       ayarlar SESSİZCE kaydedilmemiş olur. */
    mutationFn: (a) => A.put("/api/app/calendar/preferences", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: mt }), t.invalidateQueries({ queryKey: ["calendar", "feed"] });
    }
  });
}
function Ra() {
  const t = U();
  return L({
    mutationFn: (a) => A.post("/api/app/calendar/bulk-reschedule", a),
    onSettled: () => t.invalidateQueries({ queryKey: ["calendar", "feed"] })
  });
}
function za({ open: t, items: a, today: s, capacity: r, onClose: o }) {
  const { suggestions: u, fixed: x } = g.useMemo(
    () => _t(a, { today: s, capacity: r }),
    [a, s, r]
  ), [c, d] = g.useState(() => new Set(u.map((n) => n.item.key)));
  g.useEffect(() => {
    d(new Set(u.map((n) => n.item.key)));
  }, [u]);
  const i = Ra(), p = i.data ?? [], l = new Map(p.filter((n) => !n.succeeded).map((n) => [n.sourceId, n.error])), m = (n) => d((b) => {
    const v = new Set(b);
    return v.has(n) ? v.delete(n) : v.add(n), v;
  }), f = u.filter((n) => c.has(n.item.key)), h = () => {
    i.mutate(
      f.map((n) => ({
        source: n.item.source,
        sourceId: n.item.sourceId,
        newDate: $(n.date)
      })),
      {
        onSuccess: (n) => {
          (n ?? []).every((b) => b.succeeded) && o();
        }
      }
    );
  };
  return /* @__PURE__ */ e.jsx(oe, { open: t, onOpenChange: (n) => {
    n || o();
  }, children: /* @__PURE__ */ e.jsxs(ce, { side: "right", title: "Akıllı erteleme", className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-semibold text-text-primary", children: "Akıllı erteleme" }),
        /* @__PURE__ */ e.jsxs("p", { className: "mt-0.5 text-[11.5px] leading-snug text-text-tertiary", children: [
          u.length > 0 ? `${u.length} gecikmiş öğe için boş günlere dağıtılmış tarihler önerildi.` : "Ertelenecek gecikmiş öğe yok.",
          r ? ` Günlük kapasite ${S.hours(r)}.` : ""
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: o,
          "aria-label": "Kapat",
          className: "rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-2", children: [
      u.map(({ item: n, date: b }) => {
        const v = l.get(n.sourceId);
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
                  checked: c.has(n.key),
                  onChange: () => m(n.key),
                  className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] font-semibold text-text-primary", children: n.title }),
                /* @__PURE__ */ e.jsxs("span", { className: "mt-0.5 flex items-center gap-1.5 text-[11px] text-text-tertiary", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "line-through", children: S.dayShort(/* @__PURE__ */ new Date(`${n.date.slice(0, 10)}T00:00:00`)) }),
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right text-[9px]", "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-accent", children: S.dayShort(b) }),
                  n.loadHours != null && /* @__PURE__ */ e.jsxs("span", { children: [
                    "· ",
                    S.hours(n.loadHours)
                  ] })
                ] }),
                v && /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] font-medium text-negative-700", children: v })
              ] })
            ]
          },
          n.key
        );
      }),
      x.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 border-t border-subtle pt-2", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Ertelenemez" }),
        x.map((n) => {
          var b;
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 py-1.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock mt-1 shrink-0 text-[10px] text-text-tertiary", "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] text-text-secondary", children: n.title }),
              /* @__PURE__ */ e.jsxs("span", { className: "block text-[11px] text-text-tertiary", children: [
                (b = O[n.source]) == null ? void 0 : b.label,
                " — vadesi takvimden değiştirilemez"
              ] })
            ] })
          ] }, n.key);
        })
      ] })
    ] }),
    u.length > 0 && /* @__PURE__ */ e.jsxs("footer", { className: "flex items-center gap-2 border-t border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsx(
        z,
        {
          size: "sm",
          variant: "primary",
          disabled: f.length === 0 || i.isPending,
          onClick: h,
          children: i.isPending ? "Erteleniyor…" : `${f.length} öğeyi ertele`
        }
      ),
      /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "ghost", onClick: o, children: "Vazgeç" })
    ] })
  ] }) });
}
const Aa = [
  { value: 4, label: "4 sa" },
  { value: 6, label: "6 sa" },
  { value: 8, label: "8 sa" },
  { value: 0, label: "Kapalı" }
], be = ["Kaynaklar", "Dış takvim", "Kurallar"];
function Ka({ open: t, counts: a, onDone: s }) {
  var f, h;
  const [r, o] = g.useState(0), [u, x] = g.useState(() => new Set(Ce)), [c, d] = g.useState(8), i = $a(), p = xt(), l = () => {
    i.mutate(
      {
        dailyCapacityHours: c > 0 ? c : 0,
        sources: [...u],
        setupCompleted: !0
      },
      /* onSettled DEĞİL: hata durumunda da kapanırsa ayarlar sessizce
         kaybolur ve kullanıcı kurulumu yaptığını sanır. */
      { onSuccess: s }
    );
  }, m = (n) => x((b) => {
    const v = new Set(b);
    return v.has(n) ? v.delete(n) : v.add(n), v;
  });
  return /* @__PURE__ */ e.jsx(at, { open: t, onOpenChange: (n) => {
    n || s();
  }, children: /* @__PURE__ */ e.jsxs(st, { className: "w-full max-w-[520px] p-0 h-auto max-h-[88dvh] tablet:min-h-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "shrink-0 border-b border-subtle px-5 py-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[18px] font-semibold tracking-tight text-text-primary", children: "Takviminizi kurun" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: "Hangi kaynakları göreceğinizi seçin, dilerseniz dış takvim bağlayın. Her ayarı sonradan değiştirebilirsiniz." }),
      /* @__PURE__ */ e.jsx("ol", { className: "mt-3 flex items-center gap-2", children: be.map((n, b) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx("span", { className: k(
          "flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold",
          b === r ? "bg-accent text-white" : b < r ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
        ), children: b + 1 }),
        /* @__PURE__ */ e.jsx("span", { className: k(
          "text-[11.5px]",
          b === r ? "font-semibold text-text-primary" : "text-text-tertiary"
        ), children: n }),
        b < be.length - 1 && /* @__PURE__ */ e.jsx("span", { className: "ms-1 text-text-tertiary", children: "·" })
      ] }, n)) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "min-h-0 overflow-y-auto px-5 py-4", children: [
      r === 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Takvimde ne görünsün?" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex flex-col gap-1.5", children: Ce.map((n) => {
          var w, E;
          const b = u.has(n), v = a == null ? void 0 : a[n];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": b,
              onClick: () => m(n),
              className: k(
                "flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                b ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: k("fa text-[12px]", (w = O[n]) == null ? void 0 : w.icon, b ? "text-accent" : "text-text-tertiary"), "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-medium text-text-primary", children: (E = O[n]) == null ? void 0 : E.label }),
                v != null && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: v })
              ]
            },
            n
          );
        }) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-[13px] font-semibold text-text-primary", children: "Günlük kapasiteniz" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex gap-1.5", children: Aa.map((n) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => d(n.value),
            className: k(
              "rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              c === n.value ? "border-accent bg-primary-subtle text-accent" : "border-subtle text-text-secondary hover:bg-surface-hover"
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
              disabled: p.isPending,
              onClick: () => p.mutate(1),
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
              disabled: p.isPending,
              onClick: () => p.mutate(2),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fab fa-windows me-1.5", "aria-hidden": "true" }),
                "Outlook bağla"
              ]
            }
          )
        ] }),
        p.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "mt-2 text-[11.5px] text-negative-700", children: ((f = p.error) == null ? void 0 : f.message) || "Yetkilendirme adresi alınamadı." })
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
        be.length
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1" }),
      /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "ghost", onClick: l, disabled: i.isPending, children: "Şimdilik atla" }),
      r < be.length - 1 ? /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "primary", onClick: () => o((n) => n + 1), children: "Devam" }) : /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "primary", onClick: l, disabled: i.isPending, children: i.isPending ? "Kaydediliyor…" : "Bitir" })
    ] })
  ] }) });
}
const Pa = [
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
function Je({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "rounded border border-strong bg-surface-raised px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-text-primary", children: t });
}
function Ia({ open: t, onClose: a }) {
  return /* @__PURE__ */ e.jsx(at, { open: t, onOpenChange: (s) => {
    s || a();
  }, children: /* @__PURE__ */ e.jsxs(st, { className: "w-full max-w-[480px] p-0", children: [
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
      Pa.map((s) => /* @__PURE__ */ e.jsxs("section", { className: "mb-4 last:mb-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: s.title }),
        s.rows.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center gap-1", children: r.keys.map((o) => /* @__PURE__ */ e.jsx(Je, { children: o }, o)) }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-secondary", children: r.label })
        ] }, r.label))
      ] }, s.title)),
      /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] leading-snug text-text-tertiary", children: [
        "Takvim ızgarası tek sekme durağıdır: ",
        /* @__PURE__ */ e.jsx(Je, { children: "Tab" }),
        " ile içine girin, sonra oklarla gezin. Sürükle-bırakla yapılan her taşıma buradaki kısayollarla da yapılabilir."
      ] })
    ] })
  ] }) });
}
function Oa({ polite: t, assertive: a }) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("p", { role: "status", "aria-live": "polite", className: "sr-only", children: t }),
    /* @__PURE__ */ e.jsx("p", { role: "alert", "aria-live": "assertive", className: "sr-only", children: a })
  ] });
}
const Fa = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
function Ma({ items: t, month: a, today: s, generatedAt: r }) {
  var m;
  const o = it(a), u = $(s), x = {};
  for (const f of t ?? [])
    (x[m = f.date.slice(0, 10)] ?? (x[m] = [])).push(f);
  const c = Re(s), d = (t ?? []).filter((f) => {
    const h = f.date.slice(0, 10);
    return h >= $(c) && h <= $(M(c, 7));
  }), { overdue: i, days: p } = ot(d, s), l = (f) => f === I.OVERDUE ? "border-l-[3px] border-l-black" : f === I.DUE_TODAY ? "border-l-[3px] border-l-neutral-500" : "border-l-[3px] border-l-neutral-300";
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-print-root hidden print:block", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-end justify-between border-b-2 border-black pb-2", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[8pt] font-bold uppercase tracking-widest text-neutral-500", children: "APYA · Takvim" }),
          /* @__PURE__ */ e.jsx("h1", { className: "mt-1 text-[22pt] font-semibold capitalize leading-none", children: S.monthTitle(a) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "text-right text-[8pt] text-neutral-500", children: [
          /* @__PURE__ */ e.jsx("p", { children: "Risk: kalın çizgi = gecikmiş · gri çizgi = bugün son gün" }),
          /* @__PURE__ */ e.jsxs("p", { children: [
            r,
            " tarihinde oluşturuldu · Sayfa 1 / 2"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "mt-3 grid grid-cols-7", children: Fa.map((f) => /* @__PURE__ */ e.jsx("div", { className: "pb-1 text-[7.5pt] font-bold uppercase tracking-wide text-neutral-500", children: f }, f)) }),
      /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-l border-t border-neutral-300", children: o.map((f) => {
        const h = $(f), n = x[h] ?? [], b = f.getMonth() !== a.getMonth();
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: k(
              "min-h-[62px] border-b border-r border-neutral-300 p-1",
              h === u && "ring-1 ring-inset ring-black"
            ),
            children: [
              /* @__PURE__ */ e.jsx("p", { className: k(
                "text-right font-mono text-[9pt] font-semibold",
                b ? "text-neutral-300" : "text-neutral-700"
              ), children: f.getDate() }),
              n.slice(0, 4).map((v) => /* @__PURE__ */ e.jsx(
                "p",
                {
                  className: k(
                    "mt-0.5 truncate ps-1 text-[7.5pt] leading-tight",
                    l(v.risk),
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
            S.dayShort(c),
            " – ",
            S.dayShort(M(c, 6))
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
          i.map((f) => /* @__PURE__ */ e.jsx(Ze, { item: f, showDate: !0 }, f.key))
        ] }),
        p.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "mb-4 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "border-b border-black pb-1 text-[9pt] font-bold uppercase tracking-wide", children: [
            S.dayTitle(f.date),
            f.isToday ? " · Bugün" : ""
          ] }),
          f.items.map((h) => /* @__PURE__ */ e.jsx(Ze, { item: h }, h.key))
        ] }, f.key))
      ] })
    ] })
  ] });
}
function Ze({ item: t, showDate: a = !1 }) {
  const s = O[t.source];
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-neutral-200 py-1", children: [
    /* @__PURE__ */ e.jsx("span", { className: "mt-[3px] h-[9px] w-[9px] shrink-0 border border-neutral-600", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ e.jsx("span", { className: k("block text-[9pt] leading-tight", t.risk === I.OVERDUE && "font-semibold"), children: t.title }),
      /* @__PURE__ */ e.jsx("span", { className: "block text-[7.5pt] text-neutral-500", children: [
        a ? S.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
        s == null ? void 0 : s.label,
        t.subtitle,
        t.amount != null ? S.money(t.amount, t.currency) : null
      ].filter(Boolean).join(" · ") })
    ] })
  ] });
}
function La({ rows: t, days: a, capacity: s, loading: r }) {
  if (r)
    return /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1.5 text-[11.5px] text-text-tertiary", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "ekip yükü hesaplanıyor…"
    ] });
  if (!t || t.length === 0)
    return /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1.5 text-[11.5px] text-text-tertiary", children: "Bu aralıkta atanmış açık görev yok." });
  const o = (a ?? []).map($);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 px-2 pb-1", children: [
    t.map((u) => {
      const x = {};
      for (const c of u.days ?? []) x[c.date.slice(0, 10)] = c;
      return /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "truncate text-[11.5px] font-medium text-text-primary", children: u.name }),
          /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] tabular-nums text-text-tertiary", children: S.hours(u.totalHours) })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-0.5 flex gap-[2px]", children: (o.length ? o : (u.days ?? []).map((c) => c.date.slice(0, 10))).map((c) => {
          const d = x[c], i = (d == null ? void 0 : d.hours) ?? 0, p = s && i > s, l = s ? Math.min(i / s, 1) : i > 0 ? 1 : 0;
          return /* @__PURE__ */ e.jsx(
            "span",
            {
              title: `${c}: ${S.hours(i)}${d != null && d.itemCount ? ` · ${d.itemCount} öğe` : ""}`,
              className: "h-[6px] flex-1 overflow-hidden rounded-sm bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: k("block h-full", p ? "bg-negative" : "bg-accent"),
                  style: { width: `${l * 100}%` }
                }
              )
            },
            c
          );
        }) })
      ] }, u.userId);
    }),
    /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[10.5px] leading-snug text-text-tertiary", children: "Yalnız görebildiğiniz projelerin görevleri sayılır." })
  ] });
}
const qa = 6e4;
function _a({ from: t, to: a }) {
  const s = $(t), r = $(a);
  return V({
    queryKey: ["calendar", "feed", s, r],
    queryFn: () => A.get(`/api/app/calendar/feed?From=${s}&To=${r}`),
    staleTime: qa,
    placeholderData: (o) => o
    /* ay geçişinde boş ekran yerine eski veri */
  });
}
const bt = "apya.calendar.view", $e = "apya.calendar.sources", ge = ["month", "week", "day", "agenda"];
function ft(t) {
  try {
    return window.localStorage.getItem(t);
  } catch {
    return null;
  }
}
function Se(t, a) {
  try {
    window.localStorage.setItem(t, a);
  } catch {
  }
}
function Ba() {
  const t = new URLSearchParams(window.location.search).get("view");
  if (ge.includes(t)) return t;
  const a = ft(bt);
  return ge.includes(a) ? a : null;
}
function Ya() {
  const t = ft($e);
  if (!t) return new Set(le);
  const a = t.split(",").map(Number).filter((s) => le.includes(s));
  return a.length ? new Set(a) : new Set(le);
}
function Ga({ defaultView: t = "month" } = {}) {
  const [a] = g.useState(Ba), [s, r] = g.useState(() => a ?? t), [o, u] = g.useState(Ya);
  g.useEffect(() => {
    const p = new URL(window.location.href);
    p.searchParams.get("view") !== s && (p.searchParams.set("view", s), window.history.replaceState({}, "", p));
  }, [s]);
  const x = g.useCallback((p) => {
    ge.includes(p) && (r(p), Se(bt, p));
  }, []), c = g.useCallback((p) => {
    u((l) => {
      const m = new Set(l);
      return m.has(p) ? m.delete(p) : m.add(p), Se($e, [...m].join(",")), m;
    });
  }, []), d = g.useCallback((p) => {
    a || ge.includes(p) && r((l) => l === p ? l : p);
  }, [a]), i = g.useCallback(() => {
    const p = new Set(le);
    u(p), Se($e, [...p].join(","));
  }, []);
  return { view: s, setView: x, applyResponsiveDefault: d, enabledSources: o, toggleSource: c, resetSources: i };
}
const W = ["calendar", "feed"];
function Ua(t, a, s) {
  t.setQueriesData({ queryKey: W }, (r) => r != null && r.items ? {
    ...r,
    items: r.items.map((o) => o.key === a ? { ...o, date: `${s}T00:00:00` } : o)
  } : r);
}
function Qa(t, a) {
  t.setQueriesData({ queryKey: W }, (s) => s != null && s.items ? {
    ...s,
    items: s.items.map((r) => r.key === a ? { ...r, isDone: !0, risk: 0, loadHours: null } : r)
  } : s);
}
function Ha({ onOfflineFailure: t } = {}) {
  const a = U(), [s, r] = g.useState(null), [o, u] = g.useState({}), [x, c] = g.useState({}), d = g.useCallback((l) => {
    u((m) => {
      if (!m[l]) return m;
      const f = { ...m };
      return delete f[l], f;
    });
  }, []), i = L({
    mutationFn: ({ item: l, newDate: m }) => A.post("/api/app/calendar/reschedule-item", {
      source: l.source,
      sourceId: l.sourceId,
      newDate: $(m)
    }),
    onMutate: async ({ item: l, newDate: m }) => {
      await a.cancelQueries({ queryKey: W });
      const f = a.getQueriesData({ queryKey: W });
      return d(l.key), c((h) => ({ ...h, [l.key]: !0 })), Ua(a, l.key, $(m)), { snapshot: f, previousDate: l.date.slice(0, 10) };
    },
    onError: (l, { item: m, newDate: f }, h) => {
      var n;
      if (typeof navigator < "u" && !navigator.onLine) {
        t == null || t({
          key: m.key,
          payload: { source: m.source, sourceId: m.sourceId, newDate: $(f) }
        });
        return;
      }
      (n = h == null ? void 0 : h.snapshot) == null || n.forEach(([b, v]) => a.setQueryData(b, v)), u((b) => ({
        ...b,
        [m.key]: (l == null ? void 0 : l.message) || "Kaydedilemedi — tarih değişmedi."
      }));
    },
    onSuccess: (l, { item: m, newDate: f }, h) => {
      r({
        key: m.key,
        message: `“${m.title}” ${$(f)} tarihine taşındı.`,
        undo: () => i.mutate({
          item: { ...m, date: `${$(f)}T00:00:00` },
          newDate: /* @__PURE__ */ new Date(`${h.previousDate}T00:00:00`)
        })
      });
    },
    onSettled: (l, m, { item: f }) => {
      c((h) => {
        const n = { ...h };
        return delete n[f.key], n;
      }), a.invalidateQueries({ queryKey: W });
    }
  }), p = L({
    mutationFn: ({ item: l }) => A.post("/api/app/calendar/complete-item", {
      source: l.source,
      sourceId: l.sourceId
    }),
    onMutate: async ({ item: l }) => {
      await a.cancelQueries({ queryKey: W });
      const m = a.getQueriesData({ queryKey: W });
      return d(l.key), c((f) => ({ ...f, [l.key]: !0 })), Qa(a, l.key), { snapshot: m };
    },
    onError: (l, { item: m }, f) => {
      var h;
      (h = f == null ? void 0 : f.snapshot) == null || h.forEach(([n, b]) => a.setQueryData(n, b)), u((n) => ({
        ...n,
        [m.key]: (l == null ? void 0 : l.message) || "Tamamlanamadı."
      }));
    },
    onSuccess: (l, { item: m }) => {
      r({ key: m.key, message: `“${m.title}” tamamlandı.`, undo: null });
    },
    onSettled: (l, m, { item: f }) => {
      c((h) => {
        const n = { ...h };
        return delete n[f.key], n;
      }), a.invalidateQueries({ queryKey: W });
    }
  });
  return {
    reschedule: (l, m) => i.mutate({ item: l, newDate: m }),
    complete: (l) => p.mutate({ item: l }),
    retry: (l, m) => m ? i.mutate({ item: l, newDate: m }) : p.mutate({ item: l }),
    lastAction: s,
    dismissAction: () => r(null),
    errors: o,
    clearError: d,
    pending: x
  };
}
function Wa({ from: t, to: a, enabled: s = !0 }) {
  const r = $(t), o = $(a);
  return V({
    queryKey: ["calendar", "external", r, o],
    queryFn: () => A.get(`/api/app/calendar/external-events?From=${r}&To=${o}`),
    enabled: s,
    staleTime: 12e4,
    retry: !1,
    placeholderData: (u) => u
  });
}
const Va = ["INPUT", "TEXTAREA", "SELECT"];
function Xa({
  onView: t,
  onToday: a,
  onPrev: s,
  onNext: r,
  onDeferSelected: o,
  onUndo: u,
  onToggleHelp: x,
  enabled: c = !0
}) {
  g.useEffect(() => {
    if (!c) return;
    const d = (i) => {
      const p = i.target;
      if (!(Va.includes(p == null ? void 0 : p.tagName) || p != null && p.isContentEditable)) {
        if ((i.metaKey || i.ctrlKey) && i.key.toLowerCase() === "z") {
          i.preventDefault(), u == null || u();
          return;
        }
        if (!(i.metaKey || i.ctrlKey || i.altKey)) {
          if (i.shiftKey) {
            i.key === "ArrowRight" && (i.preventDefault(), o == null || o(1)), i.key === "ArrowLeft" && (i.preventDefault(), o == null || o(-1)), i.key === "?" && (i.preventDefault(), x == null || x());
            return;
          }
          switch (i.key) {
            case "?":
              i.preventDefault(), x == null || x();
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
    return window.addEventListener("keydown", d), () => window.removeEventListener("keydown", d);
  }, [c, t, a, s, r, o, u, x]);
}
function Ja({ from: t, to: a, enabled: s }) {
  const r = $(t), o = $(a);
  return V({
    queryKey: ["calendar", "team-load", r, o],
    queryFn: () => A.get(`/api/app/calendar/team-load?From=${r}&To=${o}`),
    enabled: s,
    staleTime: 6e4
  });
}
const ht = () => Rt("apya.calendar.offlineQueue");
function De() {
  try {
    const t = window.localStorage.getItem(ht()), a = t ? JSON.parse(t) : [];
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}
function et(t) {
  try {
    window.localStorage.setItem(ht(), JSON.stringify(t));
  } catch {
  }
}
function Za({ onFlush: t }) {
  const [a, s] = g.useState(() => typeof navigator > "u" ? !0 : navigator.onLine), [r, o] = g.useState(() => De().length), u = g.useRef(!1), x = g.useCallback((d) => {
    const p = De().filter((l) => l.key !== d.key).concat(d);
    et(p), o(p.length);
  }, []), c = g.useCallback(async () => {
    if (u.current) return;
    const d = De();
    if (d.length !== 0) {
      u.current = !0;
      try {
        const i = [];
        for (const p of d)
          try {
            await t(p);
          } catch (l) {
            const m = l == null ? void 0 : l.status;
            m >= 400 && m < 500 || i.push(p);
          }
        et(i), o(i.length);
      } finally {
        u.current = !1;
      }
    }
  }, [t]);
  return g.useEffect(() => {
    const d = () => {
      s(!0), c();
    }, i = () => s(!1);
    return window.addEventListener("online", d), window.addEventListener("offline", i), navigator.onLine && c(), () => {
      window.removeEventListener("online", d), window.removeEventListener("offline", i);
    };
  }, [c]), { isOnline: a, pendingCount: r, enqueue: x, flush: c };
}
function es() {
  const t = g.useRef(null), [a, s] = g.useState(0);
  return g.useLayoutEffect(() => {
    const r = t.current;
    if (!r || (s(r.getBoundingClientRect().width), typeof ResizeObserver > "u")) return;
    const o = new ResizeObserver((u) => {
      for (const x of u)
        s(x.contentRect.width);
    });
    return o.observe(r), () => o.disconnect();
  }, []), [t, a];
}
function ts(t) {
  return t === 0 || t >= 1180 ? "wide" : t >= 780 ? "medium" : "narrow";
}
const as = 60;
function fe(t, a, s) {
  return a === "week" ? M(t, 7 * s) : a === "day" ? M(t, s) : new Date(t.getFullYear(), t.getMonth() + s, 1);
}
function ss() {
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Array.from({ length: 7 }, (t, a) => /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-2", children: /* @__PURE__ */ e.jsx(ie, { height: 10 }) }, a)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: Array.from({ length: ze }, (t, a) => /* @__PURE__ */ e.jsxs("div", { className: "min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0", children: [
      /* @__PURE__ */ e.jsx(ie, { height: 12, width: "40%", className: "ml-auto" }),
      a % 3 === 0 && /* @__PURE__ */ e.jsx(ie, { height: 14, className: "mt-2" })
    ] }, a)) })
  ] });
}
function rs() {
  var qe, pe, _e, Be, Ye, Ge, Ue, Qe;
  const [t, a] = es(), s = ts(a), r = s === "narrow", o = g.useMemo(() => Ee(/* @__PURE__ */ new Date()), []), [u, x] = g.useState(o), [c, d] = g.useState(null), [i, p] = g.useState(null), [l, m] = g.useState(!1), [f, h] = g.useState(!1), [n, b] = g.useState(!1), [v, w] = g.useState(!1), [E, N] = g.useState(null), [y, K] = g.useState(!1), { view: D, setView: T, applyResponsiveDefault: F, enabledSources: X, toggleSource: ke, resetSources: J } = Ga();
  g.useEffect(() => {
    a !== 0 && F(r ? "agenda" : "month");
  }, [a, r, F]);
  const { range: q, title: ae, weekDayList: te } = g.useMemo(() => {
    if (D === "agenda")
      return {
        range: { from: M(o, -60), to: M(o, as) },
        title: "Ajanda",
        weekDayList: null
      };
    if (D === "week") {
      const R = Mt(u);
      return {
        range: { from: R[0], to: R[6] },
        title: `${S.dayShort(R[0])} – ${S.dayShort(R[6])} ${R[6].getFullYear()}`,
        weekDayList: R
      };
    }
    if (D === "day") {
      const R = Ee(u);
      return { range: { from: R, to: R }, title: S.dayTitle(R), weekDayList: [R] };
    }
    const j = nt(u);
    return {
      range: { from: j, to: M(j, ze - 1) },
      title: S.monthTitle(u),
      weekDayList: null
    };
  }, [D, u, o]), { data: C, isPending: Q, isError: gt, refetch: yt } = _a(q), B = Wa(q), Pe = Ta(), ve = Ja({ from: q.from, to: q.to, enabled: y }), _ = Za({
    onFlush: (j) => A.post("/api/app/calendar/reschedule-item", j.payload)
  }), ue = g.useMemo(
    () => {
      var j;
      return [...(C == null ? void 0 : C.items) ?? [], ...((j = B.data) == null ? void 0 : j.items) ?? []];
    },
    [C, B.data]
  ), H = g.useMemo(
    () => ue.filter((j) => X.has(j.source)),
    [ue, X]
  ), Y = g.useMemo(() => lt(H), [H]), G = (C == null ? void 0 : C.dailyCapacityHours) ?? null, Ie = g.useMemo(() => {
    const j = {};
    for (const R of (C == null ? void 0 : C.sources) ?? []) j[R.source] = R.count;
    return j;
  }, [C]), kt = g.useMemo(() => G ? Object.values(Y).filter((j) => ye(j) > G).length : 0, [Y, G]), Oe = g.useMemo(() => {
    var He;
    let j = 0, R = 0;
    for (const re of H)
      re.isDone || (re.risk === I.OVERDUE ? j++ : re.risk === I.DUE_TODAY && R++);
    const Z = (((He = B.data) == null ? void 0 : He.accounts) ?? []).filter((re) => re.error).length;
    return { overdue: j, dueToday: R, syncError: Z };
  }, [H, B.data]), Fe = g.useMemo(
    () => ((C == null ? void 0 : C.sources) ?? []).filter((j) => j.isAvailable),
    [C]
  ), vt = g.useMemo(
    () => Fe.filter((j) => !X.has(j.source)).length,
    [Fe, X]
  ), jt = g.useMemo(() => {
    var R;
    const j = (((R = B.data) == null ? void 0 : R.accounts) ?? []).map((Z) => Z.lastSyncTime).filter(Boolean).sort();
    return j.length ? j[j.length - 1] : null;
  }, [B.data]);
  g.useEffect(() => {
    c && !Y[c] && !Q && (c >= $(q.from) && c <= $(q.to) || d(null));
  }, [c, Y, Q, q]);
  const xe = g.useCallback((j) => p(j.key), []), Me = g.useCallback(() => {
    x(o), d($(o));
  }, [o]), P = Ha({ onOfflineFailure: _.enqueue }), je = !!((_e = (pe = (qe = window.abp) == null ? void 0 : qe.auth) == null ? void 0 : pe.isGranted) != null && _e.call(pe, "Platform.Tasks.Create")), Nt = g.useCallback((j) => {
    const R = E ?? c;
    if (R)
      for (const Z of Y[R] ?? [])
        Z.canReschedule && !Z.isDone && P.reschedule(Z, M(/* @__PURE__ */ new Date("T00:00:00"), j));
  }, [E, c, Y, P]);
  Xa({
    onView: T,
    onToday: Me,
    onPrev: () => x((j) => fe(j, D, -1)),
    onNext: () => x((j) => fe(j, D, 1)),
    onDeferSelected: Nt,
    onUndo: () => {
      var j, R;
      return (R = (j = P.lastAction) == null ? void 0 : j.undo) == null ? void 0 : R.call(j);
    },
    onToggleHelp: () => w((j) => !j)
  });
  const Le = ue.length > 0, wt = Le && H.length === 0, St = c ? Y[c] ?? [] : [], se = i ? ue.find((j) => j.key === i) ?? null : null, Ne = c && /* @__PURE__ */ e.jsx(
    Gt,
    {
      dayKey: c,
      items: St,
      capacity: G,
      onSelectItem: xe,
      onClose: () => d(null)
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { ref: t, className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsx(
      ra,
      {
        title: ae,
        view: D,
        onView: T,
        onPrev: () => x((j) => fe(j, D, -1)),
        onNext: () => x((j) => fe(j, D, 1)),
        onToday: Me,
        overloadDays: kt,
        onHelp: () => w(!0),
        filterCount: vt,
        onClearFilters: J,
        lastSyncAt: jt,
        syncError: Oe.syncError > 0,
        compact: r,
        canCreateTask: je
      }
    ),
    gt && /* @__PURE__ */ e.jsxs("div", { className: "rounded-card border border-negative-100 bg-negative-50 px-3 py-2.5 text-[12.5px] text-negative-700", children: [
      "Takvim yüklenemedi.",
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => yt(), className: "ml-2 font-semibold underline", children: "Yeniden dene" })
    ] }),
    (!_.isOnline || _.pendingCount > 0) && /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        className: "flex items-center gap-2 rounded-card border border-warning-100 bg-warning-50 px-3 py-2 text-[12.5px] text-warning-700",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: k("fa", _.isOnline ? "fa-cloud-arrow-up" : "fa-wifi"), "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: _.isOnline ? `${_.pendingCount} değişiklik gönderiliyor…` : `Çevrimdışısınız — ${_.pendingCount} değişiklik kuyrukta, bağlantı gelince gönderilecek.` }),
          _.isOnline && _.pendingCount > 0 && /* @__PURE__ */ e.jsx("button", { type: "button", onClick: _.flush, className: "font-semibold underline", children: "Şimdi gönder" })
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
      !r && /* @__PURE__ */ e.jsx("div", { className: k("shrink-0", s === "wide" ? "w-[240px]" : "w-auto"), children: /* @__PURE__ */ e.jsx(
        ea,
        {
          sources: (C == null ? void 0 : C.sources) ?? [],
          counts: Ie,
          enabled: X,
          onToggle: ke,
          compact: s !== "wide",
          externalAccounts: ((Be = B.data) == null ? void 0 : Be.accounts) ?? [],
          externalLoading: B.isFetching,
          onOpenSync: () => m(!0),
          teamOpen: y,
          onToggleTeam: () => K((j) => !j),
          teamContent: y ? /* @__PURE__ */ e.jsx(
            La,
            {
              rows: ve.data,
              days: te,
              capacity: G,
              loading: ve.isPending
            }
          ) : null,
          teamMembers: ve.data ?? [],
          riskCounts: Oe
        }
      ) }),
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        Q ? /* @__PURE__ */ e.jsx(ss, {}) : wt ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
          de,
          {
            icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-filter-circle-xmark" }),
            title: "Bu filtreyle gösterilecek öğe yok",
            description: "Kaynak rayında kapattığınız türler bu aralıktaki tüm öğeleri gizliyor.",
            action: /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "outline", onClick: J, children: "Kaynakları aç" })
          }
        ) }) : Le ? D === "month" ? /* @__PURE__ */ e.jsx(
          Xt,
          {
            month: u,
            byDay: Y,
            today: o,
            capacity: G,
            selectedDay: c,
            onSelectItem: xe,
            onSelectDay: d,
            onDropItem: P.reschedule,
            focusedDay: E,
            onFocusDay: N,
            onNavigate: (j) => x(j),
            pending: P.pending,
            errors: P.errors
          }
        ) : te ? /* @__PURE__ */ e.jsx(
          oa,
          {
            days: te,
            byDay: Y,
            today: o,
            capacity: G,
            selectedDay: c,
            onSelectItem: xe,
            onSelectDay: d
          }
        ) : /* @__PURE__ */ e.jsx(
          Yt,
          {
            items: H,
            today: o,
            onSelectItem: xe,
            onSmartDefer: () => h(!0)
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
          de,
          {
            icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
            title: "Bu aralıkta planlanmış bir şey yok",
            description: "Son tarihi olan görevler, fatura vadeleri, hibe son tarihleri ve tarihli finans kayıtları burada birlikte görünür.",
            action: je ? /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "outline", onClick: () => {
              window.location.href = "/Tasks";
            }, children: "Görev oluştur" }) : null
          }
        ) }),
        !Q && D !== "agenda" && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[10.5px] text-text-tertiary", children: [
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
      s === "wide" && c && /* @__PURE__ */ e.jsx("div", { className: "w-[340px] shrink-0 self-stretch", children: Ne })
    ] }),
    s === "medium" && c && /* @__PURE__ */ e.jsx(oe, { open: !0, onOpenChange: (j) => {
      j || d(null);
    }, children: /* @__PURE__ */ e.jsx(ce, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: Ne }) }),
    r && c && /* @__PURE__ */ e.jsx(oe, { open: !0, onOpenChange: (j) => {
      j || d(null);
    }, children: /* @__PURE__ */ e.jsx(ce, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: Ne }) }),
    r && je && /* @__PURE__ */ e.jsx(sa, {}),
    /* @__PURE__ */ e.jsx(
      Ma,
      {
        items: H,
        month: u,
        today: o,
        generatedAt: S.dayShort(o)
      }
    ),
    /* @__PURE__ */ e.jsx(Ia, { open: v, onClose: () => w(!1) }),
    /* @__PURE__ */ e.jsx(
      Oa,
      {
        polite: ((Ye = P.lastAction) == null ? void 0 : Ye.message) ?? "",
        assertive: ((Qe = (Ue = (Ge = B.data) == null ? void 0 : Ge.accounts) == null ? void 0 : Ue.find((j) => j.error)) == null ? void 0 : Qe.error) ?? ""
      }
    ),
    /* @__PURE__ */ e.jsx(Ea, { open: l, onClose: () => m(!1) }),
    /* @__PURE__ */ e.jsx(
      za,
      {
        open: f,
        items: H,
        today: o,
        capacity: G,
        onClose: () => h(!1)
      }
    ),
    /* @__PURE__ */ e.jsx(
      Ka,
      {
        open: Pe.data ? !Pe.data.setupCompleted && !n : !1,
        counts: Ie,
        onDone: () => b(!0)
      }
    ),
    se && /* @__PURE__ */ e.jsx(
      ua,
      {
        item: se,
        capacity: G,
        onClose: () => p(null),
        onReschedule: P.reschedule,
        onComplete: P.complete,
        isPending: !!P.pending[se.key],
        error: P.errors[se.key],
        onRetry: () => P.clearError(se.key)
      }
    )
  ] });
}
const tt = document.getElementById("apya-calendar-root");
tt && Dt(tt).render(
  /* @__PURE__ */ e.jsx(Ct, { children: /* @__PURE__ */ e.jsx(Et, { children: /* @__PURE__ */ e.jsx(Tt, { children: /* @__PURE__ */ e.jsx(rs, {}) }) }) })
);
