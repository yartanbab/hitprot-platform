import { j as e, d as pe, r as g, b as jt } from "./react-vendor-D57GAUXd.js";
import { c as k, B as z, d as oe, e as ce, S as ie, D as Je, i as Ze, T as Nt } from "./Dialog-BdNKdiS6.js";
import { D as wt } from "./useDeviceMode-Dk7fb2QY.js";
import { a as St } from "./QueryProvider-AIUp_Zk5.js";
import { E as de } from "./EmptyState-Bhcx2Wdd.js";
import { a as A } from "./httpClient-CRlyQ1eg.js";
import { d as Dt } from "./draggableActivation-Ybw9Upbh.js";
import { u as V, b as L, a as U } from "./query-vendor-Bf69L2iP.js";
/* empty css               */
const O = {
  1: { key: "task", label: "Görev", plural: "görev", icon: "fa-circle-check", railLabel: "Görevler" },
  2: { key: "invoice", label: "Fatura", plural: "fatura", icon: "fa-file-invoice", railLabel: "Faturalar" },
  3: { key: "grant", label: "Hibe", plural: "hibe", icon: "fa-award", railLabel: "Hibe son tarihleri" },
  4: { key: "expense", label: "Gider", plural: "gider", icon: "fa-arrow-trend-down", railLabel: "Gider / gelir" },
  5: { key: "income", label: "Gelir", plural: "gelir", icon: "fa-arrow-trend-up", railLabel: "Gider / gelir" },
  6: { key: "cash", label: "Kasa hareketi", plural: "kasa hareketi", icon: "fa-wallet", railLabel: "Nakit hareketleri" },
  7: { key: "external", label: "Dış etkinlik", plural: "dış etkinlik", icon: "fa-calendar-days", railLabel: "Dış etkinlikler" }
}, le = [1, 2, 3, 4, 5, 6, 7], Ct = [
  { key: "task", sources: [1] },
  { key: "invoice", sources: [2] },
  { key: "grant", sources: [3] },
  { key: "money", sources: [4, 5] },
  { key: "cash", sources: [6] }
], Se = [1, 2, 3, 4, 5, 6], I = { DUE_TODAY: 1, OVERDUE: 2 }, Et = (t) => t.risk === I.OVERDUE || t.risk === I.DUE_TODAY, et = 864e5, De = (t) => new Date(t.getFullYear(), t.getMonth(), t.getDate()), M = (t, a) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + a);
function $(t) {
  const a = (s) => (s < 10 ? "0" : "") + s;
  return `${t.getFullYear()}-${a(t.getMonth() + 1)}-${a(t.getDate())}`;
}
function Te(t) {
  const a = (t.getDay() + 6) % 7;
  return new Date(t.getTime() - a * et);
}
const tt = (t) => Te(new Date(t.getFullYear(), t.getMonth(), 1)), $e = 42;
function at(t) {
  const a = tt(t);
  return Array.from({ length: $e }, (s, r) => new Date(a.getTime() + r * et));
}
const Tt = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }), $t = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }), Rt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }), S = {
  monthTitle: (t) => Tt.format(t),
  dayTitle: (t) => $t.format(t),
  dayShort: (t) => Rt.format(t),
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
function st(t) {
  const a = {};
  for (const s of t ?? []) {
    const r = (s.date || "").slice(0, 10);
    r && (a[r] ?? (a[r] = [])).push(s);
  }
  return a;
}
const ge = (t) => (t ?? []).reduce((a, s) => a + (s.loadHours ?? 0), 0);
function zt(t, { maxPills: a = 3, maxRiskPills: s = 2 } = {}) {
  const r = t ?? [];
  if (r.length === 0) return { pills: [], summaries: [] };
  if (r.length <= a) return { pills: r, summaries: [] };
  const d = r.filter(Et).slice(0, s), u = new Set(d.map((i) => i.key)), o = /* @__PURE__ */ new Map();
  for (const i of r) {
    if (u.has(i.key)) continue;
    const p = o.get(i.source) ?? { source: i.source, count: 0, amount: 0, hasAmount: !1, only: null };
    p.count += 1, p.only = p.count === 1 ? i : null, i.amount != null && (p.amount += i.amount, p.hasAmount = !0), o.set(i.source, p);
  }
  const x = [];
  for (const i of le) {
    const p = o.get(i);
    p && (p.count === 1 && p.only ? d.push(p.only) : x.push(p));
  }
  return { pills: d, summaries: x };
}
function At(t, { compact: a = !0 } = {}) {
  const s = O[t.source], r = `${t.count} ${s ? s.plural : "öğe"}`;
  if (!t.hasAmount) return r;
  const l = a ? S.moneyCompact(t.amount) : S.money(t.amount);
  return `${r} · ${l}`;
}
function rt(t, a) {
  const s = $(a), r = (t ?? []).filter((x) => !x.isDone), l = r.filter((x) => x.date.slice(0, 10) < s && x.risk === I.OVERDUE), d = r.filter((x) => x.date.slice(0, 10) >= s), u = st(d), o = Object.keys(u).sort().map((x) => ({
    key: x,
    date: /* @__PURE__ */ new Date(`${x}T00:00:00`),
    isToday: x === s,
    items: u[x]
  }));
  return { overdue: l, days: o };
}
function Kt(t) {
  const a = Te(De(t));
  return Array.from({ length: 7 }, (s, r) => M(a, r));
}
const Pt = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }), je = (t) => t ? Pt.format(new Date(t)) : "";
function fe(t) {
  const a = new Date(t);
  return a.getHours() * 60 + a.getMinutes();
}
function It(t) {
  let a = 8, s = 18;
  for (const r of t ?? [])
    r.startTime && (a = Math.min(a, Math.floor(fe(r.startTime) / 60)), s = Math.max(s, Math.ceil(fe(r.endTime ?? r.startTime) / 60)));
  return { start: Math.max(0, a), end: Math.min(24, Math.max(s, a + 4)) };
}
const Ge = (t) => !!t.startTime, Ue = (t) => t.getDay() === 0 || t.getDay() === 6;
function Ot(t, { today: a, capacity: s = null, horizonDays: r = 21, fallbackPerDay: l = 3 } = {}) {
  const d = $(a), u = (t ?? []).filter((h) => !h.isDone), o = u.filter((h) => h.date.slice(0, 10) < d && h.risk === I.OVERDUE), x = o.filter((h) => h.canReschedule), i = o.filter((h) => !h.canReschedule), p = {}, c = {};
  for (const h of u) {
    const n = h.date.slice(0, 10);
    n < d || (p[n] = (p[n] ?? 0) + (h.loadHours ?? 0), c[n] = (c[n] ?? 0) + 1);
  }
  const b = [];
  let f = 0;
  for (const h of x) {
    let n = null;
    for (; f < r; ) {
      const m = M(a, f);
      if (Ue(m)) {
        f += 1;
        continue;
      }
      const v = $(m), w = p[v] ?? 0, E = c[v] ?? 0, N = h.loadHours ?? 0, y = s && N > s;
      if (s && !y ? w + N <= s : E < l) {
        p[v] = w + N, c[v] = E + 1, n = m;
        break;
      }
      f += 1;
    }
    if (!n) {
      let m = M(a, r);
      for (; Ue(m); ) m = M(m, 1);
      n = m;
    }
    b.push({ item: h, date: n });
  }
  return { suggestions: b, fixed: i };
}
const Ft = {
  [I.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [I.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function Ce({ item: t, onSelect: a, showDate: s = !1 }) {
  const r = O[t.source], l = Ft[t.risk];
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
        l && /* @__PURE__ */ e.jsx("span", { className: k("shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold", l.className), children: l.label })
      ]
    }
  );
}
function Mt({ items: t, today: a, onSelectItem: s, onSmartDefer: r }) {
  const { overdue: l, days: d } = rt(t, a);
  return l.length === 0 && d.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
    de,
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
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: l.map((u) => /* @__PURE__ */ e.jsx(Ce, { item: u, onSelect: s, showDate: !0 }, u.key)) })
    ] }),
    d.map((u) => /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: k(
        "flex items-center justify-between border-b border-subtle px-3 py-2",
        u.isToday && "border-b-accent"
      ), children: [
        /* @__PURE__ */ e.jsxs("span", { className: k(
          "text-[11px] font-bold uppercase tracking-wider",
          u.isToday ? "text-accent" : "text-text-tertiary"
        ), children: [
          S.dayTitle(u.date),
          u.isToday ? " · Bugün" : ""
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: u.items.length })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: u.items.map((o) => /* @__PURE__ */ e.jsx(Ce, { item: o, onSelect: s }, o.key)) })
    ] }, u.key))
  ] });
}
function Lt({ dayKey: t, items: a, capacity: s, onSelectItem: r, onClose: l }) {
  const d = /* @__PURE__ */ new Date(`${t}T00:00:00`), u = ge(a), o = s && u > s, x = a.reduce((i, p) => (i[p.source] = (i[p.source] ?? 0) + 1, i), {});
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: S.dayTitle(d) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(x).length === 0 ? "Planlanmış öğe yok" : Object.entries(x).map(([i, p]) => {
          var c;
          return `${p} ${((c = O[i]) == null ? void 0 : c.plural) ?? "öğe"}`;
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
    s && u > 0 && /* @__PURE__ */ e.jsxs("div", { className: k(
      "flex items-center justify-between border-b px-3 py-2 text-[11.5px]",
      o ? "border-negative-100 bg-negative-50 text-negative-700" : "border-subtle text-text-secondary"
    ), children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-semibold", children: o ? "Kapasite aşımı" : "Gün yükü" }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono tabular-nums", children: [
        S.hours(u),
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
    ) : a.map((i) => /* @__PURE__ */ e.jsx(Ce, { item: i, onSelect: r }, i.key)) })
  ] });
}
const _t = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], qt = {
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
function Yt({ item: t, onSelect: a, onDragStart: s, isPending: r, hasError: l }) {
  const d = O[t.source], u = qt[t.risk], o = t.canReschedule && !t.isDone, x = Dt(() => a(t));
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: o,
      onDragStart: o ? (i) => {
        i.stopPropagation(), i.dataTransfer.effectAllowed = "move", i.dataTransfer.setData("text/plain", t.key), s(t);
      } : void 0,
      onPointerDown: (i) => {
        i.stopPropagation(), x.onPointerDown(i);
      },
      onClick: (i) => {
        i.stopPropagation(), x.onClick(i);
      },
      title: t.subtitle ? `${t.title} — ${t.subtitle}` : t.title,
      style: u ? { backgroundImage: u.pattern } : void 0,
      className: k(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        u ? u.pill : "bg-neutral-subtle text-text-primary",
        t.isDone && "line-through opacity-65",
        o && "cursor-grab active:cursor-grabbing",
        /* Hata SATIRDA kalır — toast'a kaçmaz. */
        l && "ring-1 ring-negative-500",
        r && "opacity-60"
      ),
      children: [
        r ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin shrink-0 text-[9px]", "aria-hidden": "true" }) : d && /* @__PURE__ */ e.jsx("i", { className: k("fa shrink-0 text-[9px] opacity-70", d.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: t.title }),
        l && /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation ms-auto shrink-0 text-[9px]", "aria-hidden": "true" })
      ]
    }
  );
}
function Bt({ summary: t, onSelect: a }) {
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
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: At(t) })
      ]
    }
  );
}
function Gt({ load: t, capacity: a }) {
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
function Ut({
  month: t,
  byDay: a,
  today: s,
  capacity: r,
  onSelectItem: l,
  onSelectDay: d,
  selectedDay: u,
  onDropItem: o,
  pending: x = {},
  errors: i = {},
  focusedDay: p,
  onFocusDay: c,
  onNavigate: b
}) {
  const f = at(t), h = $(s), [n, m] = pe.useState(null), [v, w] = pe.useState(null), E = pe.useRef(null), N = p ?? u ?? h, y = (D) => {
    const T = M(/* @__PURE__ */ new Date(`${N}T00:00:00`), D);
    f.some((F) => $(F) === $(T)) || b == null || b(T), c == null || c($(T));
  }, K = (D) => {
    const T = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[D.key];
    if (T) {
      D.preventDefault(), y(T);
      return;
    }
    (D.key === "Enter" || D.key === " ") && (D.preventDefault(), d(N));
  };
  return pe.useEffect(() => {
    var T, F;
    const D = (T = E.current) == null ? void 0 : T.querySelector(`[data-day="${N}"]`);
    D && ((F = E.current) != null && F.contains(document.activeElement)) && D.focus();
  }, [N]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: _t.map((D, T) => /* @__PURE__ */ e.jsx(
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
          const T = $(D), F = a[T] ?? [], { pills: X, summaries: ye } = zt(F), J = ge(F), _ = D.getMonth() !== t.getMonth(), ae = T === h, te = T === u;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              role: "gridcell",
              "data-day": T,
              tabIndex: T === N ? 0 : -1,
              "aria-selected": te,
              "aria-label": `${S.dayTitle(D)}${F.length ? `, ${F.length} öğe` : ", boş"}`,
              onClick: () => {
                c == null || c(T), d(T);
              },
              onDragOver: n ? (C) => {
                C.preventDefault(), C.dataTransfer.dropEffect = "move", v !== T && w(T);
              } : void 0,
              onDragLeave: n ? () => w((C) => C === T ? null : C) : void 0,
              onDrop: n ? (C) => {
                C.preventDefault();
                const Q = n;
                m(null), w(null), Q && Q.date.slice(0, 10) !== T && o(Q, /* @__PURE__ */ new Date(`${T}T00:00:00`));
              } : void 0,
              className: k(
                "flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5",
                "transition-colors duration-fast last:border-r-0 hover:bg-surface-hover",
                _ ? "bg-surface-sunken" : "bg-surface-base",
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
                        !ae && _ && "text-text-tertiary opacity-60",
                        !ae && !_ && "text-text-secondary"
                      ),
                      children: D.getDate()
                    }
                  )
                ] }),
                X.map((C) => /* @__PURE__ */ e.jsx(
                  Yt,
                  {
                    item: C,
                    onSelect: l,
                    onDragStart: m,
                    isPending: !!x[C.key],
                    hasError: !!i[C.key]
                  },
                  C.key
                )),
                ye.map((C) => /* @__PURE__ */ e.jsx(
                  Bt,
                  {
                    summary: C,
                    onSelect: () => d(T)
                  },
                  `${T}-${C.source}`
                )),
                /* @__PURE__ */ e.jsx(Gt, { load: J, capacity: r })
              ]
            },
            T
          );
        })
      }
    )
  ] });
}
const Qt = { 1: "Google", 2: "Outlook", 3: "iCloud" };
function Ht(t) {
  const a = String(t ?? "").trim().split(/\s+/).filter(Boolean);
  return a.length === 0 ? "?" : a.length === 1 ? a[0].slice(0, 2).toLocaleUpperCase("tr") : (a[0][0] + a[a.length - 1][0]).toLocaleUpperCase("tr");
}
function Wt({
  sources: t,
  counts: a,
  enabled: s,
  onToggle: r,
  compact: l = !1,
  externalAccounts: d = [],
  externalLoading: u = !1,
  onOpenSync: o,
  teamOpen: x = !1,
  onToggleTeam: i,
  teamContent: p,
  teamMembers: c = [],
  riskCounts: b
}) {
  const f = (t ?? []).filter((m) => m.isAvailable);
  if (f.length === 0) return null;
  const h = new Set(f.map((m) => m.source)), n = Ct.map(({ key: m, sources: v }) => {
    const w = v.filter((E) => h.has(E));
    return w.length === 0 ? null : {
      key: m,
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
        l ? "w-[60px] items-center" : "w-full"
      ),
      children: [
        !l && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Kaynaklar" }),
        n.map(({ key: m, sources: v, meta: w, isOn: E, count: N }) => w ? /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": E,
            title: l ? `${w.railLabel ?? w.label} — ${N} öğe` : void 0,
            onClick: () => {
              const y = !E;
              v.forEach((K) => {
                s.has(K) !== y && r(K);
              });
            },
            className: k(
              "group flex items-center rounded-md text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              l ? "relative h-11 w-11 justify-center" : "gap-2.5 px-2 py-2",
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
              l ? N > 0 && /* @__PURE__ */ e.jsx(
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
          m
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
          d.length === 0 && !u && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 text-[11.5px] text-text-tertiary", children: "Bağlı takvim yok." }),
          u && d.length === 0 && /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1 text-[11.5px] text-text-tertiary", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
            "senkronize ediliyor…"
          ] }),
          d.map((m) => /* @__PURE__ */ e.jsxs(
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
                  /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: Qt[m.provider] ?? "Takvim" }),
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
                "aria-checked": x,
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
                      className: k("fa text-[11px]", x ? "fa-toggle-on text-accent" : "fa-toggle-off text-text-tertiary"),
                      "aria-hidden": "true"
                    }
                  )
                ]
              }
            ),
            c.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-1 px-2 pb-1", children: [
              c.slice(0, 3).map((m) => /* @__PURE__ */ e.jsxs(
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
                        children: Ht(m.name)
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { className: "max-w-[86px] truncate", children: m.name })
                  ]
                },
                m.userId
              )),
              c.length > 3 && /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-medium text-text-tertiary", children: [
                "+",
                c.length - 3
              ] })
            ] }),
            p
          ] }),
          b && (b.overdue > 0 || b.dueToday > 0 || b.syncError > 0) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("p", { className: "mt-2 border-t border-subtle px-2 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Risk" }),
            [
              { key: "overdue", label: "Gecikmiş", value: b.overdue, dot: "bg-negative" },
              { key: "dueToday", label: "Bugün son gün", value: b.dueToday, dot: "bg-warning" },
              { key: "syncError", label: "Senkron hatası", value: b.syncError, dot: "bg-negative-700" }
            ].filter((m) => m.value > 0).map((m) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-2 py-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: k("h-[7px] w-[7px] shrink-0 rounded-full", m.dot), "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[11.5px] text-text-secondary", children: m.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-primary", children: m.value })
            ] }, m.key))
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
const Vt = { month: "Ay", week: "Hafta", day: "Gün", agenda: "Ajanda" };
function Xt(t) {
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
function nt() {
  var a;
  const t = "/Tasks/CreateModal";
  (a = window.abp) != null && a.ModalManager ? new window.abp.ModalManager(t).open() : window.location.href = t;
}
function Jt() {
  return /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: nt,
      "aria-label": "Yeni görev",
      title: "Yeni görev",
      style: { bottom: "calc(1rem + env(safe-area-inset-bottom))" },
      className: "fixed right-4 z-fixed grid h-14 w-14 place-items-center rounded-full bg-accent text-text-inverse shadow-lg transition-colors duration-fast hover:bg-accent-600 active:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
      children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus text-[19px]", "aria-hidden": "true" })
    }
  );
}
function Zt({
  title: t,
  view: a,
  onView: s,
  onPrev: r,
  onNext: l,
  onToday: d,
  overloadDays: u,
  onHelp: o,
  filterCount: x = 0,
  onClearFilters: i,
  lastSyncAt: p,
  syncError: c = !1,
  canCreateTask: b = !0,
  compact: f = !1
}) {
  const h = a !== "agenda", n = Xt(p);
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
      u > 0 && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "rounded-md bg-negative-50 px-2 py-1 text-[11.5px] font-semibold text-negative-700",
          title: "Günlük kapasitenizi aşan gün sayısı",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
            u,
            " günde kapasite aşımı"
          ]
        }
      ),
      (n || c) && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: k(
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium",
            c ? "bg-negative-50 text-negative-700" : "text-text-tertiary"
          ),
          title: c ? "Bir dış takvim senkronlanamıyor" : "Dış takvimlerin son senkron zamanı",
          children: [
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: k("h-[6px] w-[6px] rounded-full", c ? "bg-negative" : "bg-positive"),
                "aria-hidden": "true"
              }
            ),
            "Senkron",
            n ? ` · ${n}` : ""
          ]
        }
      ),
      x > 0 && i && /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: i,
          title: "Filtreleri temizle — kapalı kaynakları geri aç",
          className: "flex h-9 items-center gap-1.5 rounded-md border border-default bg-surface-base px-2.5 text-[12px] font-medium text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: [
            "Filtre",
            /* @__PURE__ */ e.jsx("span", { className: "rounded-full bg-primary-subtle px-1.5 text-[11px] font-semibold text-accent", children: x })
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
      o && !f && /* @__PURE__ */ e.jsx(
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
      /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(Vt).map(([m, v]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": a === m,
          onClick: () => s(m),
          className: k(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            a === m ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: v
        },
        m
      )) }),
      b && !f && /* @__PURE__ */ e.jsxs(z, { variant: "primary", size: "sm", onClick: nt, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus me-1.5", "aria-hidden": "true" }),
        "Yeni görev"
      ] })
    ] })
  ] });
}
const ee = 44, ea = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], ta = {
  [I.OVERDUE]: "bg-negative-50 text-negative-700",
  [I.DUE_TODAY]: "bg-warning-50 text-warning-700"
};
function aa({ load: t, capacity: a }) {
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
function sa({ days: t, byDay: a, today: s, capacity: r, onSelectItem: l, onSelectDay: d, selectedDay: u }) {
  const o = $(s), x = g.useRef(null), [i, p] = g.useState(() => {
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
  const c = t.map($), b = {}, f = {};
  for (const N of c) {
    const y = a[N] ?? [];
    b[N] = y.filter(Ge), f[N] = y.filter((K) => !Ge(K));
  }
  const h = c.flatMap((N) => b[N]), { start: n, end: m } = It(h), v = Array.from({ length: m - n }, (N, y) => n + y), w = (m - n) * ee, E = c.includes(o) && i >= n * 60 && i <= m * 60;
  return g.useEffect(() => {
    if (!E || !x.current) return;
    const N = (i - n * 60) / 60 * ee;
    x.current.scrollTop = Math.max(0, N - 120);
  }, [E, n]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "grid border-b border-default bg-surface-raised",
        style: { gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))` },
        children: [
          /* @__PURE__ */ e.jsx("div", {}),
          t.map((N) => {
            const y = $(N), K = ge(a[y] ?? []), D = y === o;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => d(y),
                className: k(
                  "border-l border-subtle px-2 py-2 text-left transition-colors duration-fast hover:bg-surface-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
                  u === y && "bg-primary-subtle"
                ),
                children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "flex items-baseline gap-1.5", children: [
                    /* @__PURE__ */ e.jsx("span", { className: k(
                      "text-[10.5px] font-bold uppercase tracking-wider",
                      D ? "text-accent" : "text-text-tertiary"
                    ), children: ea[(N.getDay() + 6) % 7] }),
                    /* @__PURE__ */ e.jsx("span", { className: k(
                      "font-mono text-[13px] font-semibold tabular-nums",
                      D ? "text-accent" : "text-text-primary"
                    ), children: N.getDate() }),
                    r && K > r && /* @__PURE__ */ e.jsx("span", { className: "ms-auto rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: S.hours(K) })
                  ] }),
                  /* @__PURE__ */ e.jsx(aa, { load: K, capacity: r })
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
          c.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-[46px] flex-col gap-[3px] border-l border-subtle p-1", children: [
            f[N].slice(0, 4).map((y) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => l(y),
                title: y.title,
                className: k(
                  "flex w-full items-center gap-1 truncate rounded-[5px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                  ta[y.risk] ?? "bg-neutral-subtle text-text-primary",
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
                onClick: () => d(N),
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
    /* @__PURE__ */ e.jsxs("div", { ref: x, className: "max-h-[520px] overflow-y-auto", children: [
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
            c.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "relative border-l border-subtle", children: [
              v.map((y, K) => /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "absolute inset-x-0 border-t border-subtle",
                  style: { top: `${K * ee}px` }
                },
                y
              )),
              b[N].map((y) => {
                const K = fe(y.startTime), D = y.endTime ? fe(y.endTime) : K + 60, T = (K - n * 60) / 60 * ee, F = Math.max((D - K) / 60 * ee, 18);
                return /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => l(y),
                    title: `${y.title} · ${je(y.startTime)}`,
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
                        je(y.startTime),
                        y.endTime ? `–${je(y.endTime)}` : ""
                      ] })
                    ]
                  },
                  y.key
                );
              }),
              E && N === o && /* @__PURE__ */ e.jsx(
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
function ra({ item: t }) {
  var p;
  const [a, s] = g.useState(""), [r, l] = g.useState(() => /* @__PURE__ */ new Set()), d = t.description ?? t.subtitle ?? "", u = V({
    queryKey: ["calendar", "projects-lookup"],
    queryFn: () => A.get("/api/app/task/projects-lookup"),
    staleTime: 10 * 6e4
  }), o = L({
    mutationFn: async () => {
      const c = new FormData();
      c.append("file", new Blob([`${t.title}

${d}`], { type: "text/plain" }), "toplanti-notlari.txt");
      const b = await fetch(`/api/ai-task-generator/parse?projectId=${a}`, {
        method: "POST",
        body: c,
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });
      if (!b.ok) throw new Error("Notlardan görev çıkarılamadı.");
      return b.json();
    },
    onSuccess: (c) => l(new Set(((c == null ? void 0 : c.suggestions) ?? []).map((b, f) => f)))
  }), x = L({
    mutationFn: () => {
      var c;
      return A.post("/api/ai-task-generator/create-tasks", {
        projectId: a,
        approvedTasks: (((c = o.data) == null ? void 0 : c.suggestions) ?? []).filter((b, f) => r.has(f))
      });
    }
  }), i = ((p = o.data) == null ? void 0 : p.suggestions) ?? [];
  return /* @__PURE__ */ e.jsxs("section", { className: "border-t border-subtle px-4 py-3", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Toplantıdan görev" }),
    !d && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[11.5px] text-text-tertiary", children: "Bu etkinlikte not yok — çıkarılacak aksiyon maddesi bulunamaz." }),
    d && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs(
        "select",
        {
          value: a,
          onChange: (c) => s(c.target.value),
          "aria-label": "Görevlerin ekleneceği proje",
          className: "mt-1.5 w-full rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "Proje seçin…" }),
            (u.data ?? []).map((c) => /* @__PURE__ */ e.jsx("option", { value: c.id, children: c.name }, c.id))
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
        i.map((c, b) => /* @__PURE__ */ e.jsxs("label", { className: "flex cursor-pointer items-start gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: r.has(b),
              onChange: () => l((f) => {
                const h = new Set(f);
                return h.has(b) ? h.delete(b) : h.add(b), h;
              }),
              className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[12px] text-text-primary", children: c.title })
        ] }, `${c.title}-${b}`)),
        /* @__PURE__ */ e.jsx(
          z,
          {
            size: "sm",
            variant: "primary",
            className: k("mt-2"),
            disabled: r.size === 0 || x.isPending || x.isSuccess,
            onClick: () => x.mutate(),
            children: x.isSuccess ? `${x.data} görev eklendi` : x.isPending ? "Ekleniyor…" : `${r.size} görev olarak ekle`
          }
        )
      ] })
    ] })
  ] });
}
const na = {
  [I.OVERDUE]: { text: "Gecikmiş", cls: "bg-negative-50 text-negative-700" },
  [I.DUE_TODAY]: { text: "Bugün son gün", cls: "bg-warning-50 text-warning-700" }
};
function ne({ label: t, children: a }) {
  return a ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-subtle py-2.5 last:border-b-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11.5px] font-medium text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "min-w-0 text-right text-[12.5px] text-text-primary", children: a })
  ] }) : null;
}
function ia({ item: t, capacity: a, onClose: s, onReschedule: r, onComplete: l, isPending: d, error: u, onRetry: o }) {
  const [x, i] = g.useState(() => t.date.slice(0, 10)), p = O[t.source], c = na[t.risk], b = t.date.slice(0, 10);
  g.useEffect(() => i(b), [b]);
  const f = () => {
    !x || x === b || r(t, /* @__PURE__ */ new Date(`${x}T00:00:00`));
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
        c && /* @__PURE__ */ e.jsx("span", { className: k("rounded-md px-2 py-1 text-[11px] font-bold", c.cls), children: c.text }),
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
    u && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-negative-100 bg-negative-50 px-4 py-2.5 text-[12px] text-negative-700", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: u }),
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: o, className: "font-semibold underline", children: "Yeniden dene" })
    ] }),
    d && /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle px-4 py-2 text-[12px] text-text-tertiary", "aria-live": "polite", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "kaydediliyor…"
    ] }),
    t.canReschedule && !t.isDone && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs(z, { size: "sm", variant: "secondary", onClick: () => l(t), children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-check me-1.5", "aria-hidden": "true" }),
        "Tamamla"
      ] }),
      /* @__PURE__ */ e.jsx(
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
      /* @__PURE__ */ e.jsx(ne, { label: "Son tarih", children: t.canReschedule ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "date",
            value: x,
            onChange: (h) => i(h.target.value),
            className: "rounded-md border border-default bg-surface-base px-2 py-1 text-[12.5px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": "Son tarih"
          }
        ),
        x !== b && /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "primary", onClick: f, children: "Uygula" })
      ] }) : /* @__PURE__ */ e.jsxs("span", { className: "text-text-secondary", children: [
        S.dayTitle(/* @__PURE__ */ new Date(`${b}T00:00:00`)),
        /* @__PURE__ */ e.jsx("span", { className: "ml-1.5 text-text-tertiary", children: "· takvimden değiştirilemez" })
      ] }) }),
      /* @__PURE__ */ e.jsx(ne, { label: "Bağlam", children: t.subtitle }),
      /* @__PURE__ */ e.jsx(ne, { label: "Atanan", children: t.assigneeName }),
      /* @__PURE__ */ e.jsx(ne, { label: "Tutar", children: t.amount != null ? S.money(t.amount, t.currency) : null }),
      /* @__PURE__ */ e.jsx(ne, { label: "Gün yükü", children: t.loadHours != null ? `${S.hours(t.loadHours)}${a ? ` / ${S.hours(a)} kapasite` : ""}` : null })
    ] }),
    t.source === 7 && /* @__PURE__ */ e.jsx(ra, { item: t }),
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
const it = ["calendar", "sync-settings"];
function la(t) {
  return V({
    queryKey: it,
    queryFn: () => A.get("/api/app/calendar/sync-settings"),
    enabled: t,
    staleTime: 3e4
  });
}
function oa() {
  const t = U();
  return L({
    /* ABP konvansiyonu: UpdateSyncRulesAsync → PUT (POST 405). */
    mutationFn: (a) => A.put("/api/app/calendar/sync-rules", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: it }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
const lt = ["calendar", "sync-settings"], ca = ["calendar", "external"];
function ot() {
  return L({
    mutationFn: (t) => A.get(`/api/app/calendar/auth-url?provider=${t}`),
    /* Sağlayıcının kendi ekranına gidiliyor: SPA yönlendirmesi değil, tam sayfa. */
    onSuccess: (t) => {
      typeof t == "string" && t && (window.location.href = t);
    }
  });
}
function da() {
  const t = U();
  return L({
    mutationFn: (a) => A.post(`/api/app/calendar/${a}/disconnect-account`, {}),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: lt }), t.invalidateQueries({ queryKey: ca });
    }
  });
}
function ua() {
  const t = U();
  return L({
    mutationFn: (a) => A.post(`/api/app/calendar/${a}/force-sync`, {}),
    /* "Son senkron" damgası ve senkron günlüğü bu çağrıyla değişir. */
    onSuccess: () => t.invalidateQueries({ queryKey: lt })
  });
}
const ct = ["calendar", "ical-feed"], Re = ["calendar", "ical-subscriptions"];
function xa(t) {
  return V({
    queryKey: ct,
    /* GetOrCreate: bağlantı yoksa ilk açılışta üretilir. */
    queryFn: () => A.post("/api/app/ical-feed/ensure", {}),
    enabled: t,
    staleTime: 1 / 0
  });
}
function pa() {
  const t = U();
  return L({
    mutationFn: () => A.post("/api/app/ical-feed/regenerate", {}),
    onSuccess: (a) => t.setQueryData(ct, a)
  });
}
function ma(t) {
  return V({
    queryKey: Re,
    queryFn: () => A.get("/api/app/ical-subscription"),
    enabled: t,
    staleTime: 3e4
  });
}
function ba() {
  const t = U();
  return L({
    mutationFn: (a) => A.post("/api/app/ical-subscription", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Re }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function fa() {
  const t = U();
  return L({
    mutationFn: (a) => A.delete(`/api/app/ical-subscription/${a}`),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Re }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function ha() {
  return L({
    mutationFn: (t) => A.post(`/api/app/ical-subscription/probe?url=${encodeURIComponent(t)}`, {})
  });
}
const ga = {
  1: { label: "Google Calendar", icon: "fa-google", brand: "bg-[#ea4335]" },
  2: { label: "Microsoft Outlook", icon: "fa-windows", brand: "bg-[#0078d4]" },
  3: { label: "iCloud", icon: "fa-apple", brand: "bg-neutral-700" }
}, ya = {
  0: { title: "Son değişen kazanır", desc: "İki taraf da düzenlenirse en son yapılan değişiklik uygulanır; ekranda geri alma şeridi çıkar." },
  1: { title: "APYA her zaman kazanır", desc: "Dış takvim salt-okunur ayna olur; dışarıdaki düzenleme geri alınır." }
}, Qe = {
  0: { icon: "fa-arrow-up-from-bracket", cls: "text-text-tertiary" },
  1: { icon: "fa-code-merge", cls: "text-warning-700" },
  2: { icon: "fa-triangle-exclamation", cls: "text-negative-700" }
};
function ze(t) {
  if (!t) return "hiç";
  const a = Math.round((Date.now() - new Date(t).getTime()) / 6e4);
  return a < 1 ? "az önce" : a < 60 ? `${a} dk önce` : a < 1440 ? `${Math.round(a / 60)} sa önce` : S.dayShort(new Date(t));
}
function ka({ account: t, onSave: a, saving: s }) {
  var h;
  const r = ga[t.provider] ?? { label: "Takvim", icon: "fa-calendar", brand: "bg-neutral-700" }, l = ua(), d = da(), [u, o] = g.useState(() => new Set(t.syncSources ?? [])), [x, i] = g.useState(t.conflictRule ?? 0), [p, c] = g.useState(t.isSyncEnabled);
  g.useEffect(() => {
    o(new Set(t.syncSources ?? [])), i(t.conflictRule ?? 0), c(t.isSyncEnabled);
  }, [t]);
  const b = p !== t.isSyncEnabled || x !== t.conflictRule || u.size !== (t.syncSources ?? []).length || [...u].some((n) => !(t.syncSources ?? []).includes(n)), f = (n) => o((m) => {
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
          ze(t.lastSyncTime)
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("label", { className: "flex shrink-0 items-center gap-1.5 text-[11.5px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: p,
            onChange: (n) => c(n.target.checked),
            className: "h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
          }
        ),
        "Açık"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Bu hesaba ne gitsin?" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Se.map((n) => {
        var v, w;
        const m = u.has(n);
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": m,
            onClick: () => f(n),
            className: k(
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              m ? "border-accent bg-primary-subtle text-accent" : "border-subtle bg-surface-base text-text-tertiary hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: k("fa text-[10px]", (v = O[n]) == null ? void 0 : v.icon), "aria-hidden": "true" }),
              (w = O[n]) == null ? void 0 : w.label
            ]
          },
          n
        );
      }) }),
      u.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-text-tertiary", children: "Hiçbiri seçili değil — yalnız görevler gönderilir." }),
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Çakışma kuralı" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: Object.entries(ya).map(([n, m]) => {
        const v = Number(n), w = x === v;
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
              /* @__PURE__ */ e.jsx("span", { className: k("block text-[12px] font-semibold", w ? "text-accent" : "text-text-primary"), children: m.title }),
              /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] leading-snug text-text-tertiary", children: m.desc })
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
              isSyncEnabled: p,
              syncSources: [...u],
              syncProjectIds: t.syncProjectIds ?? [],
              conflictRule: x
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
const va = [
  { value: 15, label: "15 dk" },
  { value: 60, label: "1 saat" },
  { value: 360, label: "6 saat" },
  { value: 1440, label: "Günlük" }
];
function ja({ open: t }) {
  var v, w, E, N;
  const a = xa(t), s = pa(), r = ma(t), l = ba(), d = fa(), u = ha(), [o, x] = g.useState(""), [i, p] = g.useState(""), [c, b] = g.useState(60), [f, h] = g.useState(!1), n = (v = a.data) != null && v.path ? `${window.location.origin}${a.data.path}` : "", m = async () => {
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
        /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "outline", onClick: m, disabled: !n, children: f ? "Kopyalandı" : "Kopyala" })
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
              x(y.target.value), u.reset();
            },
            placeholder: "https://…/basic.ics",
            "aria-label": "Takvim bağlantısı",
            className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          }
        ),
        ((w = u.data) == null ? void 0 : w.isValid) && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-positive-700", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-check me-1", "aria-hidden": "true" }),
          "Bağlantı doğrulandı · ",
          u.data.eventCount,
          " etkinlik bulundu"
        ] }),
        u.data && !u.data.isValid && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-negative-700", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
          u.data.error
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              value: i,
              onChange: (y) => p(y.target.value),
              placeholder: ((E = u.data) == null ? void 0 : E.suggestedName) || "Görünen ad",
              "aria-label": "Görünen ad",
              className: "min-w-0 flex-1 rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              value: c,
              onChange: (y) => b(Number(y.target.value)),
              "aria-label": "Yenileme sıklığı",
              className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
              children: va.map((y) => /* @__PURE__ */ e.jsx("option", { value: y.value, children: y.label }, y.value))
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(
            z,
            {
              size: "sm",
              variant: "outline",
              disabled: !o || u.isPending,
              onClick: () => u.mutate(o),
              children: u.isPending ? "Deneniyor…" : "Bağlantıyı dene"
            }
          ),
          /* @__PURE__ */ e.jsx(
            z,
            {
              size: "sm",
              variant: "primary",
              disabled: !o || l.isPending,
              onClick: () => l.mutate(
                { url: o, displayName: i, color: "accent", refreshMinutes: c },
                { onSuccess: () => {
                  x(""), p(""), u.reset();
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
          /* @__PURE__ */ e.jsx("span", { className: k(
            "block truncate text-[10.5px]",
            y.lastError ? "text-negative-700" : "text-text-tertiary"
          ), children: y.lastError ?? `${y.lastEventCount} etkinlik · ${ze(y.lastFetchedAt)} çekildi` })
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
function Na({ open: t, onClose: a }) {
  var u;
  const { data: s, isPending: r } = la(t), l = oa(), d = ot();
  return /* @__PURE__ */ e.jsx(oe, { open: t, onOpenChange: (o) => {
    o || a();
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
        s.accounts.map((o) => /* @__PURE__ */ e.jsx(
          ka,
          {
            account: o,
            saving: l.isPending,
            onSave: (x) => l.mutate(x)
          },
          o.id
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
      d.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "text-[11.5px] text-negative-700", children: ((u = d.error) == null ? void 0 : u.message) || "Yetkilendirme adresi alınamadı." }),
      /* @__PURE__ */ e.jsx(ja, { open: t }),
      /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
        /* @__PURE__ */ e.jsx("header", { className: "border-b border-subtle px-3 py-2", children: /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-semibold text-text-primary", children: "Senkron günlüğü" }) }),
        /* @__PURE__ */ e.jsx("div", { className: "px-3 py-2", children: ((s == null ? void 0 : s.log) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-2 text-[11.5px] text-text-tertiary", children: "Henüz senkron kaydı yok." }) : s.log.map((o) => {
          const x = Qe[o.kind] ?? Qe[0];
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
            /* @__PURE__ */ e.jsx("i", { className: k("fa mt-0.5 shrink-0 text-[11px]", x.icon, x.cls), "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[11.5px] leading-snug text-text-secondary", children: o.message }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: ze(o.occurredAt) })
          ] }, o.id);
        }) })
      ] })
    ] }) })
  ] }) });
}
const dt = ["calendar", "preferences"];
function wa() {
  return V({
    queryKey: dt,
    queryFn: () => A.get("/api/app/calendar/preferences"),
    staleTime: 5 * 6e4
  });
}
function Sa() {
  const t = U();
  return L({
    /* ABP konvansiyonu: Update* metotları PUT'a düşer. POST 405 döner ve
       ayarlar SESSİZCE kaydedilmemiş olur. */
    mutationFn: (a) => A.put("/api/app/calendar/preferences", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: dt }), t.invalidateQueries({ queryKey: ["calendar", "feed"] });
    }
  });
}
function Da() {
  const t = U();
  return L({
    mutationFn: (a) => A.post("/api/app/calendar/bulk-reschedule", a),
    onSettled: () => t.invalidateQueries({ queryKey: ["calendar", "feed"] })
  });
}
function Ca({ open: t, items: a, today: s, capacity: r, onClose: l }) {
  const { suggestions: d, fixed: u } = g.useMemo(
    () => Ot(a, { today: s, capacity: r }),
    [a, s, r]
  ), [o, x] = g.useState(() => new Set(d.map((n) => n.item.key)));
  g.useEffect(() => {
    x(new Set(d.map((n) => n.item.key)));
  }, [d]);
  const i = Da(), p = i.data ?? [], c = new Map(p.filter((n) => !n.succeeded).map((n) => [n.sourceId, n.error])), b = (n) => x((m) => {
    const v = new Set(m);
    return v.has(n) ? v.delete(n) : v.add(n), v;
  }), f = d.filter((n) => o.has(n.item.key)), h = () => {
    i.mutate(
      f.map((n) => ({
        source: n.item.source,
        sourceId: n.item.sourceId,
        newDate: $(n.date)
      })),
      {
        onSuccess: (n) => {
          (n ?? []).every((m) => m.succeeded) && l();
        }
      }
    );
  };
  return /* @__PURE__ */ e.jsx(oe, { open: t, onOpenChange: (n) => {
    n || l();
  }, children: /* @__PURE__ */ e.jsxs(ce, { side: "right", title: "Akıllı erteleme", className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-semibold text-text-primary", children: "Akıllı erteleme" }),
        /* @__PURE__ */ e.jsxs("p", { className: "mt-0.5 text-[11.5px] leading-snug text-text-tertiary", children: [
          d.length > 0 ? `${d.length} gecikmiş öğe için boş günlere dağıtılmış tarihler önerildi.` : "Ertelenecek gecikmiş öğe yok.",
          r ? ` Günlük kapasite ${S.hours(r)}.` : ""
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
      d.map(({ item: n, date: m }) => {
        const v = c.get(n.sourceId);
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
                  checked: o.has(n.key),
                  onChange: () => b(n.key),
                  className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] font-semibold text-text-primary", children: n.title }),
                /* @__PURE__ */ e.jsxs("span", { className: "mt-0.5 flex items-center gap-1.5 text-[11px] text-text-tertiary", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "line-through", children: S.dayShort(/* @__PURE__ */ new Date(`${n.date.slice(0, 10)}T00:00:00`)) }),
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right text-[9px]", "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-accent", children: S.dayShort(m) }),
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
      u.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 border-t border-subtle pt-2", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Ertelenemez" }),
        u.map((n) => {
          var m;
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 py-1.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock mt-1 shrink-0 text-[10px] text-text-tertiary", "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] text-text-secondary", children: n.title }),
              /* @__PURE__ */ e.jsxs("span", { className: "block text-[11px] text-text-tertiary", children: [
                (m = O[n.source]) == null ? void 0 : m.label,
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
          disabled: f.length === 0 || i.isPending,
          onClick: h,
          children: i.isPending ? "Erteleniyor…" : `${f.length} öğeyi ertele`
        }
      ),
      /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "ghost", onClick: l, children: "Vazgeç" })
    ] })
  ] }) });
}
const Ea = [
  { value: 4, label: "4 sa" },
  { value: 6, label: "6 sa" },
  { value: 8, label: "8 sa" },
  { value: 0, label: "Kapalı" }
], me = ["Kaynaklar", "Dış takvim", "Kurallar"];
function Ta({ open: t, counts: a, onDone: s }) {
  var f, h;
  const [r, l] = g.useState(0), [d, u] = g.useState(() => new Set(Se)), [o, x] = g.useState(8), i = Sa(), p = ot(), c = () => {
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
  }, b = (n) => u((m) => {
    const v = new Set(m);
    return v.has(n) ? v.delete(n) : v.add(n), v;
  });
  return /* @__PURE__ */ e.jsx(Je, { open: t, onOpenChange: (n) => {
    n || s();
  }, children: /* @__PURE__ */ e.jsxs(Ze, { className: "w-full max-w-[520px] p-0 h-auto max-h-[88dvh] tablet:min-h-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "shrink-0 border-b border-subtle px-5 py-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[18px] font-semibold tracking-tight text-text-primary", children: "Takviminizi kurun" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: "Hangi kaynakları göreceğinizi seçin, dilerseniz dış takvim bağlayın. Her ayarı sonradan değiştirebilirsiniz." }),
      /* @__PURE__ */ e.jsx("ol", { className: "mt-3 flex items-center gap-2", children: me.map((n, m) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx("span", { className: k(
          "flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold",
          m === r ? "bg-accent text-white" : m < r ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
        ), children: m + 1 }),
        /* @__PURE__ */ e.jsx("span", { className: k(
          "text-[11.5px]",
          m === r ? "font-semibold text-text-primary" : "text-text-tertiary"
        ), children: n }),
        m < me.length - 1 && /* @__PURE__ */ e.jsx("span", { className: "ms-1 text-text-tertiary", children: "·" })
      ] }, n)) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "min-h-0 overflow-y-auto px-5 py-4", children: [
      r === 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Takvimde ne görünsün?" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex flex-col gap-1.5", children: Se.map((n) => {
          var w, E;
          const m = d.has(n), v = a == null ? void 0 : a[n];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": m,
              onClick: () => b(n),
              className: k(
                "flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                m ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: k("fa text-[12px]", (w = O[n]) == null ? void 0 : w.icon, m ? "text-accent" : "text-text-tertiary"), "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-medium text-text-primary", children: (E = O[n]) == null ? void 0 : E.label }),
                v != null && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: v })
              ]
            },
            n
          );
        }) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-[13px] font-semibold text-text-primary", children: "Günlük kapasiteniz" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex gap-1.5", children: Ea.map((n) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => x(n.value),
            className: k(
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
        me.length
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1" }),
      /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "ghost", onClick: c, disabled: i.isPending, children: "Şimdilik atla" }),
      r < me.length - 1 ? /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "primary", onClick: () => l((n) => n + 1), children: "Devam" }) : /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "primary", onClick: c, disabled: i.isPending, children: i.isPending ? "Kaydediliyor…" : "Bitir" })
    ] })
  ] }) });
}
const $a = [
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
function He({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "rounded border border-strong bg-surface-raised px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-text-primary", children: t });
}
function Ra({ open: t, onClose: a }) {
  return /* @__PURE__ */ e.jsx(Je, { open: t, onOpenChange: (s) => {
    s || a();
  }, children: /* @__PURE__ */ e.jsxs(Ze, { className: "w-full max-w-[480px] p-0", children: [
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
      $a.map((s) => /* @__PURE__ */ e.jsxs("section", { className: "mb-4 last:mb-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: s.title }),
        s.rows.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center gap-1", children: r.keys.map((l) => /* @__PURE__ */ e.jsx(He, { children: l }, l)) }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-secondary", children: r.label })
        ] }, r.label))
      ] }, s.title)),
      /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] leading-snug text-text-tertiary", children: [
        "Takvim ızgarası tek sekme durağıdır: ",
        /* @__PURE__ */ e.jsx(He, { children: "Tab" }),
        " ile içine girin, sonra oklarla gezin. Sürükle-bırakla yapılan her taşıma buradaki kısayollarla da yapılabilir."
      ] })
    ] })
  ] }) });
}
function za({ polite: t, assertive: a }) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("p", { role: "status", "aria-live": "polite", className: "sr-only", children: t }),
    /* @__PURE__ */ e.jsx("p", { role: "alert", "aria-live": "assertive", className: "sr-only", children: a })
  ] });
}
const Aa = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
function Ka({ items: t, month: a, today: s, generatedAt: r }) {
  var b;
  const l = at(a), d = $(s), u = {};
  for (const f of t ?? [])
    (u[b = f.date.slice(0, 10)] ?? (u[b] = [])).push(f);
  const o = Te(s), x = (t ?? []).filter((f) => {
    const h = f.date.slice(0, 10);
    return h >= $(o) && h <= $(M(o, 7));
  }), { overdue: i, days: p } = rt(x, s), c = (f) => f === I.OVERDUE ? "border-l-[3px] border-l-black" : f === I.DUE_TODAY ? "border-l-[3px] border-l-neutral-500" : "border-l-[3px] border-l-neutral-300";
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
      /* @__PURE__ */ e.jsx("div", { className: "mt-3 grid grid-cols-7", children: Aa.map((f) => /* @__PURE__ */ e.jsx("div", { className: "pb-1 text-[7.5pt] font-bold uppercase tracking-wide text-neutral-500", children: f }, f)) }),
      /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-l border-t border-neutral-300", children: l.map((f) => {
        const h = $(f), n = u[h] ?? [], m = f.getMonth() !== a.getMonth();
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: k(
              "min-h-[62px] border-b border-r border-neutral-300 p-1",
              h === d && "ring-1 ring-inset ring-black"
            ),
            children: [
              /* @__PURE__ */ e.jsx("p", { className: k(
                "text-right font-mono text-[9pt] font-semibold",
                m ? "text-neutral-300" : "text-neutral-700"
              ), children: f.getDate() }),
              n.slice(0, 4).map((v) => /* @__PURE__ */ e.jsx(
                "p",
                {
                  className: k(
                    "mt-0.5 truncate ps-1 text-[7.5pt] leading-tight",
                    c(v.risk),
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
            S.dayShort(o),
            " – ",
            S.dayShort(M(o, 6))
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
          i.map((f) => /* @__PURE__ */ e.jsx(We, { item: f, showDate: !0 }, f.key))
        ] }),
        p.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "mb-4 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "border-b border-black pb-1 text-[9pt] font-bold uppercase tracking-wide", children: [
            S.dayTitle(f.date),
            f.isToday ? " · Bugün" : ""
          ] }),
          f.items.map((h) => /* @__PURE__ */ e.jsx(We, { item: h }, h.key))
        ] }, f.key))
      ] })
    ] })
  ] });
}
function We({ item: t, showDate: a = !1 }) {
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
function Pa({ rows: t, days: a, capacity: s, loading: r }) {
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
      const u = {};
      for (const o of d.days ?? []) u[o.date.slice(0, 10)] = o;
      return /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "truncate text-[11.5px] font-medium text-text-primary", children: d.name }),
          /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] tabular-nums text-text-tertiary", children: S.hours(d.totalHours) })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-0.5 flex gap-[2px]", children: (l.length ? l : (d.days ?? []).map((o) => o.date.slice(0, 10))).map((o) => {
          const x = u[o], i = (x == null ? void 0 : x.hours) ?? 0, p = s && i > s, c = s ? Math.min(i / s, 1) : i > 0 ? 1 : 0;
          return /* @__PURE__ */ e.jsx(
            "span",
            {
              title: `${o}: ${S.hours(i)}${x != null && x.itemCount ? ` · ${x.itemCount} öğe` : ""}`,
              className: "h-[6px] flex-1 overflow-hidden rounded-sm bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: k("block h-full", p ? "bg-negative" : "bg-accent"),
                  style: { width: `${c * 100}%` }
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
const Ia = 6e4;
function Oa({ from: t, to: a }) {
  const s = $(t), r = $(a);
  return V({
    queryKey: ["calendar", "feed", s, r],
    queryFn: () => A.get(`/api/app/calendar/feed?From=${s}&To=${r}`),
    staleTime: Ia,
    placeholderData: (l) => l
    /* ay geçişinde boş ekran yerine eski veri */
  });
}
const ut = "apya.calendar.view", Ee = "apya.calendar.sources", he = ["month", "week", "day", "agenda"];
function xt(t) {
  try {
    return window.localStorage.getItem(t);
  } catch {
    return null;
  }
}
function Ne(t, a) {
  try {
    window.localStorage.setItem(t, a);
  } catch {
  }
}
function Fa() {
  const t = new URLSearchParams(window.location.search).get("view");
  if (he.includes(t)) return t;
  const a = xt(ut);
  return he.includes(a) ? a : null;
}
function Ma() {
  const t = xt(Ee);
  if (!t) return new Set(le);
  const a = t.split(",").map(Number).filter((s) => le.includes(s));
  return a.length ? new Set(a) : new Set(le);
}
function La({ defaultView: t = "month" } = {}) {
  const [a] = g.useState(Fa), [s, r] = g.useState(() => a ?? t), [l, d] = g.useState(Ma);
  g.useEffect(() => {
    const p = new URL(window.location.href);
    p.searchParams.get("view") !== s && (p.searchParams.set("view", s), window.history.replaceState({}, "", p));
  }, [s]);
  const u = g.useCallback((p) => {
    he.includes(p) && (r(p), Ne(ut, p));
  }, []), o = g.useCallback((p) => {
    d((c) => {
      const b = new Set(c);
      return b.has(p) ? b.delete(p) : b.add(p), Ne(Ee, [...b].join(",")), b;
    });
  }, []), x = g.useCallback((p) => {
    a || he.includes(p) && r((c) => c === p ? c : p);
  }, [a]), i = g.useCallback(() => {
    const p = new Set(le);
    d(p), Ne(Ee, [...p].join(","));
  }, []);
  return { view: s, setView: u, applyResponsiveDefault: x, enabledSources: l, toggleSource: o, resetSources: i };
}
const W = ["calendar", "feed"];
function _a(t, a, s) {
  t.setQueriesData({ queryKey: W }, (r) => r != null && r.items ? {
    ...r,
    items: r.items.map((l) => l.key === a ? { ...l, date: `${s}T00:00:00` } : l)
  } : r);
}
function qa(t, a) {
  t.setQueriesData({ queryKey: W }, (s) => s != null && s.items ? {
    ...s,
    items: s.items.map((r) => r.key === a ? { ...r, isDone: !0, risk: 0, loadHours: null } : r)
  } : s);
}
function Ya({ onOfflineFailure: t } = {}) {
  const a = U(), [s, r] = g.useState(null), [l, d] = g.useState({}), [u, o] = g.useState({}), x = g.useCallback((c) => {
    d((b) => {
      if (!b[c]) return b;
      const f = { ...b };
      return delete f[c], f;
    });
  }, []), i = L({
    mutationFn: ({ item: c, newDate: b }) => A.post("/api/app/calendar/reschedule-item", {
      source: c.source,
      sourceId: c.sourceId,
      newDate: $(b)
    }),
    onMutate: async ({ item: c, newDate: b }) => {
      await a.cancelQueries({ queryKey: W });
      const f = a.getQueriesData({ queryKey: W });
      return x(c.key), o((h) => ({ ...h, [c.key]: !0 })), _a(a, c.key, $(b)), { snapshot: f, previousDate: c.date.slice(0, 10) };
    },
    onError: (c, { item: b, newDate: f }, h) => {
      var n;
      if (typeof navigator < "u" && !navigator.onLine) {
        t == null || t({
          key: b.key,
          payload: { source: b.source, sourceId: b.sourceId, newDate: $(f) }
        });
        return;
      }
      (n = h == null ? void 0 : h.snapshot) == null || n.forEach(([m, v]) => a.setQueryData(m, v)), d((m) => ({
        ...m,
        [b.key]: (c == null ? void 0 : c.message) || "Kaydedilemedi — tarih değişmedi."
      }));
    },
    onSuccess: (c, { item: b, newDate: f }, h) => {
      r({
        key: b.key,
        message: `“${b.title}” ${$(f)} tarihine taşındı.`,
        undo: () => i.mutate({
          item: { ...b, date: `${$(f)}T00:00:00` },
          newDate: /* @__PURE__ */ new Date(`${h.previousDate}T00:00:00`)
        })
      });
    },
    onSettled: (c, b, { item: f }) => {
      o((h) => {
        const n = { ...h };
        return delete n[f.key], n;
      }), a.invalidateQueries({ queryKey: W });
    }
  }), p = L({
    mutationFn: ({ item: c }) => A.post("/api/app/calendar/complete-item", {
      source: c.source,
      sourceId: c.sourceId
    }),
    onMutate: async ({ item: c }) => {
      await a.cancelQueries({ queryKey: W });
      const b = a.getQueriesData({ queryKey: W });
      return x(c.key), o((f) => ({ ...f, [c.key]: !0 })), qa(a, c.key), { snapshot: b };
    },
    onError: (c, { item: b }, f) => {
      var h;
      (h = f == null ? void 0 : f.snapshot) == null || h.forEach(([n, m]) => a.setQueryData(n, m)), d((n) => ({
        ...n,
        [b.key]: (c == null ? void 0 : c.message) || "Tamamlanamadı."
      }));
    },
    onSuccess: (c, { item: b }) => {
      r({ key: b.key, message: `“${b.title}” tamamlandı.`, undo: null });
    },
    onSettled: (c, b, { item: f }) => {
      o((h) => {
        const n = { ...h };
        return delete n[f.key], n;
      }), a.invalidateQueries({ queryKey: W });
    }
  });
  return {
    reschedule: (c, b) => i.mutate({ item: c, newDate: b }),
    complete: (c) => p.mutate({ item: c }),
    retry: (c, b) => b ? i.mutate({ item: c, newDate: b }) : p.mutate({ item: c }),
    lastAction: s,
    dismissAction: () => r(null),
    errors: l,
    clearError: x,
    pending: u
  };
}
function Ba({ from: t, to: a, enabled: s = !0 }) {
  const r = $(t), l = $(a);
  return V({
    queryKey: ["calendar", "external", r, l],
    queryFn: () => A.get(`/api/app/calendar/external-events?From=${r}&To=${l}`),
    enabled: s,
    staleTime: 12e4,
    retry: !1,
    placeholderData: (d) => d
  });
}
const Ga = ["INPUT", "TEXTAREA", "SELECT"];
function Ua({
  onView: t,
  onToday: a,
  onPrev: s,
  onNext: r,
  onDeferSelected: l,
  onUndo: d,
  onToggleHelp: u,
  enabled: o = !0
}) {
  g.useEffect(() => {
    if (!o) return;
    const x = (i) => {
      const p = i.target;
      if (!(Ga.includes(p == null ? void 0 : p.tagName) || p != null && p.isContentEditable)) {
        if ((i.metaKey || i.ctrlKey) && i.key.toLowerCase() === "z") {
          i.preventDefault(), d == null || d();
          return;
        }
        if (!(i.metaKey || i.ctrlKey || i.altKey)) {
          if (i.shiftKey) {
            i.key === "ArrowRight" && (i.preventDefault(), l == null || l(1)), i.key === "ArrowLeft" && (i.preventDefault(), l == null || l(-1)), i.key === "?" && (i.preventDefault(), u == null || u());
            return;
          }
          switch (i.key) {
            case "?":
              i.preventDefault(), u == null || u();
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
    return window.addEventListener("keydown", x), () => window.removeEventListener("keydown", x);
  }, [o, t, a, s, r, l, d, u]);
}
function Qa({ from: t, to: a, enabled: s }) {
  const r = $(t), l = $(a);
  return V({
    queryKey: ["calendar", "team-load", r, l],
    queryFn: () => A.get(`/api/app/calendar/team-load?From=${r}&To=${l}`),
    enabled: s,
    staleTime: 6e4
  });
}
const pt = "apya.calendar.offlineQueue";
function we() {
  try {
    const t = window.localStorage.getItem(pt), a = t ? JSON.parse(t) : [];
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}
function Ve(t) {
  try {
    window.localStorage.setItem(pt, JSON.stringify(t));
  } catch {
  }
}
function Ha({ onFlush: t }) {
  const [a, s] = g.useState(() => typeof navigator > "u" ? !0 : navigator.onLine), [r, l] = g.useState(() => we().length), d = g.useRef(!1), u = g.useCallback((x) => {
    const p = we().filter((c) => c.key !== x.key).concat(x);
    Ve(p), l(p.length);
  }, []), o = g.useCallback(async () => {
    if (d.current) return;
    const x = we();
    if (x.length !== 0) {
      d.current = !0;
      try {
        const i = [];
        for (const p of x)
          try {
            await t(p);
          } catch {
            i.push(p);
          }
        Ve(i), l(i.length);
      } finally {
        d.current = !1;
      }
    }
  }, [t]);
  return g.useEffect(() => {
    const x = () => {
      s(!0), o();
    }, i = () => s(!1);
    return window.addEventListener("online", x), window.addEventListener("offline", i), navigator.onLine && o(), () => {
      window.removeEventListener("online", x), window.removeEventListener("offline", i);
    };
  }, [o]), { isOnline: a, pendingCount: r, enqueue: u, flush: o };
}
function Wa() {
  const t = g.useRef(null), [a, s] = g.useState(0);
  return g.useLayoutEffect(() => {
    const r = t.current;
    if (!r || (s(r.getBoundingClientRect().width), typeof ResizeObserver > "u")) return;
    const l = new ResizeObserver((d) => {
      for (const u of d)
        s(u.contentRect.width);
    });
    return l.observe(r), () => l.disconnect();
  }, []), [t, a];
}
function Va(t) {
  return t === 0 || t >= 1180 ? "wide" : t >= 780 ? "medium" : "narrow";
}
const Xa = 60;
function be(t, a, s) {
  return a === "week" ? M(t, 7 * s) : a === "day" ? M(t, s) : new Date(t.getFullYear(), t.getMonth() + s, 1);
}
function Ja() {
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Array.from({ length: 7 }, (t, a) => /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-2", children: /* @__PURE__ */ e.jsx(ie, { height: 10 }) }, a)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: Array.from({ length: $e }, (t, a) => /* @__PURE__ */ e.jsxs("div", { className: "min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0", children: [
      /* @__PURE__ */ e.jsx(ie, { height: 12, width: "40%", className: "ml-auto" }),
      a % 3 === 0 && /* @__PURE__ */ e.jsx(ie, { height: 14, className: "mt-2" })
    ] }, a)) })
  ] });
}
function Za() {
  var Me, Le, _e, qe, Ye;
  const [t, a] = Wa(), s = Va(a), r = s === "narrow", l = g.useMemo(() => De(/* @__PURE__ */ new Date()), []), [d, u] = g.useState(l), [o, x] = g.useState(null), [i, p] = g.useState(null), [c, b] = g.useState(!1), [f, h] = g.useState(!1), [n, m] = g.useState(!1), [v, w] = g.useState(!1), [E, N] = g.useState(null), [y, K] = g.useState(!1), { view: D, setView: T, applyResponsiveDefault: F, enabledSources: X, toggleSource: ye, resetSources: J } = La();
  g.useEffect(() => {
    a !== 0 && F(r ? "agenda" : "month");
  }, [a, r, F]);
  const { range: _, title: ae, weekDayList: te } = g.useMemo(() => {
    if (D === "agenda")
      return {
        range: { from: M(l, -60), to: M(l, Xa) },
        title: "Ajanda",
        weekDayList: null
      };
    if (D === "week") {
      const R = Kt(d);
      return {
        range: { from: R[0], to: R[6] },
        title: `${S.dayShort(R[0])} – ${S.dayShort(R[6])} ${R[6].getFullYear()}`,
        weekDayList: R
      };
    }
    if (D === "day") {
      const R = De(d);
      return { range: { from: R, to: R }, title: S.dayTitle(R), weekDayList: [R] };
    }
    const j = tt(d);
    return {
      range: { from: j, to: M(j, $e - 1) },
      title: S.monthTitle(d),
      weekDayList: null
    };
  }, [D, d, l]), { data: C, isPending: Q, isError: mt, refetch: bt } = Oa(_), Y = Ba(_), Ae = wa(), ke = Qa({ from: _.from, to: _.to, enabled: y }), q = Ha({
    onFlush: (j) => A.post("/api/app/calendar/reschedule-item", j.payload)
  }), ue = g.useMemo(
    () => {
      var j;
      return [...(C == null ? void 0 : C.items) ?? [], ...((j = Y.data) == null ? void 0 : j.items) ?? []];
    },
    [C, Y.data]
  ), H = g.useMemo(
    () => ue.filter((j) => X.has(j.source)),
    [ue, X]
  ), B = g.useMemo(() => st(H), [H]), G = (C == null ? void 0 : C.dailyCapacityHours) ?? null, Ke = g.useMemo(() => {
    const j = {};
    for (const R of (C == null ? void 0 : C.sources) ?? []) j[R.source] = R.count;
    return j;
  }, [C]), ft = g.useMemo(() => G ? Object.values(B).filter((j) => ge(j) > G).length : 0, [B, G]), Pe = g.useMemo(() => {
    var Be;
    let j = 0, R = 0;
    for (const re of H)
      re.isDone || (re.risk === I.OVERDUE ? j++ : re.risk === I.DUE_TODAY && R++);
    const Z = (((Be = Y.data) == null ? void 0 : Be.accounts) ?? []).filter((re) => re.error).length;
    return { overdue: j, dueToday: R, syncError: Z };
  }, [H, Y.data]), Ie = g.useMemo(
    () => ((C == null ? void 0 : C.sources) ?? []).filter((j) => j.isAvailable),
    [C]
  ), ht = g.useMemo(
    () => Ie.filter((j) => !X.has(j.source)).length,
    [Ie, X]
  ), gt = g.useMemo(() => {
    var R;
    const j = (((R = Y.data) == null ? void 0 : R.accounts) ?? []).map((Z) => Z.lastSyncTime).filter(Boolean).sort();
    return j.length ? j[j.length - 1] : null;
  }, [Y.data]);
  g.useEffect(() => {
    o && !B[o] && !Q && (o >= $(_.from) && o <= $(_.to) || x(null));
  }, [o, B, Q, _]);
  const xe = g.useCallback((j) => p(j.key), []), Oe = g.useCallback(() => {
    u(l), x($(l));
  }, [l]), P = Ya({ onOfflineFailure: q.enqueue }), yt = g.useCallback((j) => {
    const R = E ?? o;
    if (R)
      for (const Z of B[R] ?? [])
        Z.canReschedule && !Z.isDone && P.reschedule(Z, M(/* @__PURE__ */ new Date("T00:00:00"), j));
  }, [E, o, B, P]);
  Ua({
    onView: T,
    onToday: Oe,
    onPrev: () => u((j) => be(j, D, -1)),
    onNext: () => u((j) => be(j, D, 1)),
    onDeferSelected: yt,
    onUndo: () => {
      var j, R;
      return (R = (j = P.lastAction) == null ? void 0 : j.undo) == null ? void 0 : R.call(j);
    },
    onToggleHelp: () => w((j) => !j)
  });
  const Fe = ue.length > 0, kt = Fe && H.length === 0, vt = o ? B[o] ?? [] : [], se = i ? ue.find((j) => j.key === i) ?? null : null, ve = o && /* @__PURE__ */ e.jsx(
    Lt,
    {
      dayKey: o,
      items: vt,
      capacity: G,
      onSelectItem: xe,
      onClose: () => x(null)
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { ref: t, className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsx(
      Zt,
      {
        title: ae,
        view: D,
        onView: T,
        onPrev: () => u((j) => be(j, D, -1)),
        onNext: () => u((j) => be(j, D, 1)),
        onToday: Oe,
        overloadDays: ft,
        onHelp: () => w(!0),
        filterCount: ht,
        onClearFilters: J,
        lastSyncAt: gt,
        syncError: Pe.syncError > 0,
        compact: r
      }
    ),
    mt && /* @__PURE__ */ e.jsxs("div", { className: "rounded-card border border-negative-100 bg-negative-50 px-3 py-2.5 text-[12.5px] text-negative-700", children: [
      "Takvim yüklenemedi.",
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => bt(), className: "ml-2 font-semibold underline", children: "Yeniden dene" })
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
      !r && /* @__PURE__ */ e.jsx("div", { className: k("shrink-0", s === "wide" ? "w-[240px]" : "w-auto"), children: /* @__PURE__ */ e.jsx(
        Wt,
        {
          sources: (C == null ? void 0 : C.sources) ?? [],
          counts: Ke,
          enabled: X,
          onToggle: ye,
          compact: s !== "wide",
          externalAccounts: ((Me = Y.data) == null ? void 0 : Me.accounts) ?? [],
          externalLoading: Y.isFetching,
          onOpenSync: () => b(!0),
          teamOpen: y,
          onToggleTeam: () => K((j) => !j),
          teamContent: y ? /* @__PURE__ */ e.jsx(
            Pa,
            {
              rows: ke.data,
              days: te,
              capacity: G,
              loading: ke.isPending
            }
          ) : null,
          teamMembers: ke.data ?? [],
          riskCounts: Pe
        }
      ) }),
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        Q ? /* @__PURE__ */ e.jsx(Ja, {}) : kt ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
          de,
          {
            icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-filter-circle-xmark" }),
            title: "Bu filtreyle gösterilecek öğe yok",
            description: "Kaynak rayında kapattığınız türler bu aralıktaki tüm öğeleri gizliyor.",
            action: /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "outline", onClick: J, children: "Kaynakları aç" })
          }
        ) }) : Fe ? D === "month" ? /* @__PURE__ */ e.jsx(
          Ut,
          {
            month: d,
            byDay: B,
            today: l,
            capacity: G,
            selectedDay: o,
            onSelectItem: xe,
            onSelectDay: x,
            onDropItem: P.reschedule,
            focusedDay: E,
            onFocusDay: N,
            onNavigate: (j) => u(j),
            pending: P.pending,
            errors: P.errors
          }
        ) : te ? /* @__PURE__ */ e.jsx(
          sa,
          {
            days: te,
            byDay: B,
            today: l,
            capacity: G,
            selectedDay: o,
            onSelectItem: xe,
            onSelectDay: x
          }
        ) : /* @__PURE__ */ e.jsx(
          Mt,
          {
            items: H,
            today: l,
            onSelectItem: xe,
            onSmartDefer: () => h(!0)
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
          de,
          {
            icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
            title: "Bu aralıkta planlanmış bir şey yok",
            description: "Son tarihi olan görevler, fatura vadeleri, hibe son tarihleri ve tarihli finans kayıtları burada birlikte görünür.",
            action: /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "outline", onClick: () => {
              window.location.href = "/Tasks";
            }, children: "Görev oluştur" })
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
      s === "wide" && o && /* @__PURE__ */ e.jsx("div", { className: "w-[340px] shrink-0 self-stretch", children: ve })
    ] }),
    s === "medium" && o && /* @__PURE__ */ e.jsx(oe, { open: !0, onOpenChange: (j) => {
      j || x(null);
    }, children: /* @__PURE__ */ e.jsx(ce, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: ve }) }),
    r && o && /* @__PURE__ */ e.jsx(oe, { open: !0, onOpenChange: (j) => {
      j || x(null);
    }, children: /* @__PURE__ */ e.jsx(ce, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: ve }) }),
    r && /* @__PURE__ */ e.jsx(Jt, {}),
    /* @__PURE__ */ e.jsx(
      Ka,
      {
        items: H,
        month: d,
        today: l,
        generatedAt: S.dayShort(l)
      }
    ),
    /* @__PURE__ */ e.jsx(Ra, { open: v, onClose: () => w(!1) }),
    /* @__PURE__ */ e.jsx(
      za,
      {
        polite: ((Le = P.lastAction) == null ? void 0 : Le.message) ?? "",
        assertive: ((Ye = (qe = (_e = Y.data) == null ? void 0 : _e.accounts) == null ? void 0 : qe.find((j) => j.error)) == null ? void 0 : Ye.error) ?? ""
      }
    ),
    /* @__PURE__ */ e.jsx(Na, { open: c, onClose: () => b(!1) }),
    /* @__PURE__ */ e.jsx(
      Ca,
      {
        open: f,
        items: H,
        today: l,
        capacity: G,
        onClose: () => h(!1)
      }
    ),
    /* @__PURE__ */ e.jsx(
      Ta,
      {
        open: Ae.data ? !Ae.data.setupCompleted && !n : !1,
        counts: Ke,
        onDone: () => m(!0)
      }
    ),
    se && /* @__PURE__ */ e.jsx(
      ia,
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
const Xe = document.getElementById("apya-calendar-root");
Xe && jt(Xe).render(
  /* @__PURE__ */ e.jsx(Nt, { children: /* @__PURE__ */ e.jsx(wt, { children: /* @__PURE__ */ e.jsx(St, { children: /* @__PURE__ */ e.jsx(Za, {}) }) }) })
);
