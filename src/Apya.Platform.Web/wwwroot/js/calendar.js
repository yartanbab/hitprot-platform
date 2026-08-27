import { j as e, d as pe, r as g, b as kt } from "./react-vendor-D57GAUXd.js";
import { c as k, B as A, d as oe, e as ce, S as ie, D as Je, i as Ze, T as vt } from "./Dialog-BdNKdiS6.js";
import { D as jt } from "./useDeviceMode-Dk7fb2QY.js";
import { a as Nt } from "./QueryProvider-AIUp_Zk5.js";
import { E as de } from "./EmptyState-Bhcx2Wdd.js";
import { a as K } from "./httpClient-CRlyQ1eg.js";
import { d as wt } from "./draggableActivation-Ybw9Upbh.js";
import { u as W, b as _, a as ee } from "./query-vendor-Bf69L2iP.js";
/* empty css               */
const P = {
  1: { key: "task", label: "Görev", plural: "görev", icon: "fa-circle-check", railLabel: "Görevler" },
  2: { key: "invoice", label: "Fatura", plural: "fatura", icon: "fa-file-invoice", railLabel: "Faturalar" },
  3: { key: "grant", label: "Hibe", plural: "hibe", icon: "fa-award", railLabel: "Hibe son tarihleri" },
  4: { key: "expense", label: "Gider", plural: "gider", icon: "fa-arrow-trend-down", railLabel: "Gider / gelir" },
  5: { key: "income", label: "Gelir", plural: "gelir", icon: "fa-arrow-trend-up", railLabel: "Gider / gelir" },
  6: { key: "cash", label: "Kasa hareketi", plural: "kasa hareketi", icon: "fa-wallet", railLabel: "Nakit hareketleri" },
  7: { key: "external", label: "Dış etkinlik", plural: "dış etkinlik", icon: "fa-calendar-days", railLabel: "Dış etkinlikler" }
}, le = [1, 2, 3, 4, 5, 6, 7], St = [
  { key: "task", sources: [1] },
  { key: "invoice", sources: [2] },
  { key: "grant", sources: [3] },
  { key: "money", sources: [4, 5] },
  { key: "cash", sources: [6] }
], Se = [1, 2, 3, 4, 5, 6], O = { DUE_TODAY: 1, OVERDUE: 2 }, Dt = (t) => t.risk === O.OVERDUE || t.risk === O.DUE_TODAY, et = 864e5, De = (t) => new Date(t.getFullYear(), t.getMonth(), t.getDate()), L = (t, a) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + a);
function T(t) {
  const a = (s) => (s < 10 ? "0" : "") + s;
  return `${t.getFullYear()}-${a(t.getMonth() + 1)}-${a(t.getDate())}`;
}
function Ee(t) {
  const a = (t.getDay() + 6) % 7;
  return new Date(t.getTime() - a * et);
}
const tt = (t) => Ee(new Date(t.getFullYear(), t.getMonth(), 1)), $e = 42;
function at(t) {
  const a = tt(t);
  return Array.from({ length: $e }, (s, r) => new Date(a.getTime() + r * et));
}
const Ct = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }), Tt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }), Et = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }), w = {
  monthTitle: (t) => Ct.format(t),
  dayTitle: (t) => Tt.format(t),
  dayShort: (t) => Et.format(t),
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
function $t(t, { maxPills: a = 3, maxRiskPills: s = 2 } = {}) {
  const r = t ?? [];
  if (r.length === 0) return { pills: [], summaries: [] };
  if (r.length <= a) return { pills: r, summaries: [] };
  const p = r.filter(Dt).slice(0, s), x = new Set(p.map((n) => n.key)), d = /* @__PURE__ */ new Map();
  for (const n of r) {
    if (x.has(n.key)) continue;
    const b = d.get(n.source) ?? { source: n.source, count: 0, amount: 0, hasAmount: !1, only: null };
    b.count += 1, b.only = b.count === 1 ? n : null, n.amount != null && (b.amount += n.amount, b.hasAmount = !0), d.set(n.source, b);
  }
  const m = [];
  for (const n of le) {
    const b = d.get(n);
    b && (b.count === 1 && b.only ? p.push(b.only) : m.push(b));
  }
  return { pills: p, summaries: m };
}
function Rt(t, { compact: a = !0 } = {}) {
  const s = P[t.source], r = `${t.count} ${s ? s.plural : "öğe"}`;
  if (!t.hasAmount) return r;
  const i = a ? w.moneyCompact(t.amount) : w.money(t.amount);
  return `${r} · ${i}`;
}
function rt(t, a) {
  const s = T(a), r = (t ?? []).filter((m) => !m.isDone), i = r.filter((m) => m.date.slice(0, 10) < s && m.risk === O.OVERDUE), p = r.filter((m) => m.date.slice(0, 10) >= s), x = st(p), d = Object.keys(x).sort().map((m) => ({
    key: m,
    date: /* @__PURE__ */ new Date(`${m}T00:00:00`),
    isToday: m === s,
    items: x[m]
  }));
  return { overdue: i, days: d };
}
function At(t) {
  const a = Ee(De(t));
  return Array.from({ length: 7 }, (s, r) => L(a, r));
}
const zt = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }), je = (t) => t ? zt.format(new Date(t)) : "";
function fe(t) {
  const a = new Date(t);
  return a.getHours() * 60 + a.getMinutes();
}
function Kt(t) {
  let a = 8, s = 18;
  for (const r of t ?? [])
    r.startTime && (a = Math.min(a, Math.floor(fe(r.startTime) / 60)), s = Math.max(s, Math.ceil(fe(r.endTime ?? r.startTime) / 60)));
  return { start: Math.max(0, a), end: Math.min(24, Math.max(s, a + 4)) };
}
const Ye = (t) => !!t.startTime, Ue = (t) => t.getDay() === 0 || t.getDay() === 6;
function It(t, { today: a, capacity: s = null, horizonDays: r = 21, fallbackPerDay: i = 3 } = {}) {
  const p = T(a), x = (t ?? []).filter((f) => !f.isDone), d = x.filter((f) => f.date.slice(0, 10) < p && f.risk === O.OVERDUE), m = d.filter((f) => f.canReschedule), n = d.filter((f) => !f.canReschedule), b = {}, l = {};
  for (const f of x) {
    const u = f.date.slice(0, 10);
    u < p || (b[u] = (b[u] ?? 0) + (f.loadHours ?? 0), l[u] = (l[u] ?? 0) + 1);
  }
  const c = [];
  let o = 0;
  for (const f of m) {
    let u = null;
    for (; o < r; ) {
      const h = L(a, o);
      if (Ue(h)) {
        o += 1;
        continue;
      }
      const N = T(h), $ = b[N] ?? 0, E = l[N] ?? 0, j = f.loadHours ?? 0, y = s && j > s;
      if (s && !y ? $ + j <= s : E < i) {
        b[N] = $ + j, l[N] = E + 1, u = h;
        break;
      }
      o += 1;
    }
    if (!u) {
      let h = L(a, r);
      for (; Ue(h); ) h = L(h, 1);
      u = h;
    }
    c.push({ item: f, date: u });
  }
  return { suggestions: c, fixed: n };
}
const Ot = {
  [O.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [O.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function Ce({ item: t, onSelect: a, showDate: s = !1 }) {
  const r = P[t.source], i = Ot[t.risk];
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
            s ? w.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
            t.subtitle,
            t.assigneeName,
            t.amount != null ? w.money(t.amount, t.currency) : null
          ].filter(Boolean).join(" · ") || (r ? r.label : "") })
        ] }),
        i && /* @__PURE__ */ e.jsx("span", { className: k("shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold", i.className), children: i.label })
      ]
    }
  );
}
function Pt({ items: t, today: a, onSelectItem: s, onSmartDefer: r }) {
  const { overdue: i, days: p } = rt(t, a);
  return i.length === 0 && p.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
    de,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-mug-hot" }),
      title: "Planlanmış bir şey yok",
      description: "Son tarihli görevler, fatura vadeleri ve tarihli finans kayıtları burada öncelik sırasıyla listelenir."
    }
  ) }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    i.length > 0 && /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-negative-100 bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 border-b border-negative-100 px-3 py-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-negative-700", children: "Gecikmiş" }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-semibold tabular-nums text-negative-700", children: i.length }),
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
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: i.map((x) => /* @__PURE__ */ e.jsx(Ce, { item: x, onSelect: s, showDate: !0 }, x.key)) })
    ] }),
    p.map((x) => /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: k(
        "flex items-center justify-between border-b border-subtle px-3 py-2",
        x.isToday && "border-b-accent"
      ), children: [
        /* @__PURE__ */ e.jsxs("span", { className: k(
          "text-[11px] font-bold uppercase tracking-wider",
          x.isToday ? "text-accent" : "text-text-tertiary"
        ), children: [
          w.dayTitle(x.date),
          x.isToday ? " · Bugün" : ""
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: x.items.length })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: x.items.map((d) => /* @__PURE__ */ e.jsx(Ce, { item: d, onSelect: s }, d.key)) })
    ] }, x.key))
  ] });
}
function Mt({ dayKey: t, items: a, capacity: s, onSelectItem: r, onClose: i }) {
  const p = /* @__PURE__ */ new Date(`${t}T00:00:00`), x = ge(a), d = s && x > s, m = a.reduce((n, b) => (n[b.source] = (n[b.source] ?? 0) + 1, n), {});
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: w.dayTitle(p) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(m).length === 0 ? "Planlanmış öğe yok" : Object.entries(m).map(([n, b]) => {
          var l;
          return `${b} ${((l = P[n]) == null ? void 0 : l.plural) ?? "öğe"}`;
        }).join(" · ") })
      ] }),
      i && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: i,
          "aria-label": "Günü kapat",
          className: "shrink-0 rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] }),
    s && x > 0 && /* @__PURE__ */ e.jsxs("div", { className: k(
      "flex items-center justify-between border-b px-3 py-2 text-[11.5px]",
      d ? "border-negative-100 bg-negative-50 text-negative-700" : "border-subtle text-text-secondary"
    ), children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-semibold", children: d ? "Kapasite aşımı" : "Gün yükü" }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono tabular-nums", children: [
        w.hours(x),
        " / ",
        w.hours(s)
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
    ) : a.map((n) => /* @__PURE__ */ e.jsx(Ce, { item: n, onSelect: r }, n.key)) })
  ] });
}
const Lt = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], Ft = {
  [O.OVERDUE]: {
    /* Maketteki sol kenar çubuğu: pill'i okumadan da "bu gecikmiş" denir. */
    pill: "border-l-2 border-negative bg-negative-50 text-negative-700",
    /* çapraz tarama */
    pattern: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,.07) 3px, rgba(0,0,0,.07) 5px)"
  },
  [O.DUE_TODAY]: {
    pill: "border-l-2 border-warning bg-warning-50 text-warning-700",
    /* dikey çizgi */
    pattern: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,.06) 4px, rgba(0,0,0,.06) 5px)"
  }
};
function _t({ item: t, onSelect: a, onDragStart: s, isPending: r, hasError: i }) {
  const p = P[t.source], x = Ft[t.risk], d = t.canReschedule && !t.isDone, m = wt(() => a(t));
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: d,
      onDragStart: d ? (n) => {
        n.stopPropagation(), n.dataTransfer.effectAllowed = "move", n.dataTransfer.setData("text/plain", t.key), s(t);
      } : void 0,
      onPointerDown: (n) => {
        n.stopPropagation(), m.onPointerDown(n);
      },
      onClick: (n) => {
        n.stopPropagation(), m.onClick(n);
      },
      title: t.subtitle ? `${t.title} — ${t.subtitle}` : t.title,
      style: x ? { backgroundImage: x.pattern } : void 0,
      className: k(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        x ? x.pill : "bg-neutral-subtle text-text-primary",
        t.isDone && "line-through opacity-65",
        d && "cursor-grab active:cursor-grabbing",
        /* Hata SATIRDA kalır — toast'a kaçmaz. */
        i && "ring-1 ring-negative-500",
        r && "opacity-60"
      ),
      children: [
        r ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin shrink-0 text-[9px]", "aria-hidden": "true" }) : p && /* @__PURE__ */ e.jsx("i", { className: k("fa shrink-0 text-[9px] opacity-70", p.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: t.title }),
        i && /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation ms-auto shrink-0 text-[9px]", "aria-hidden": "true" })
      ]
    }
  );
}
function Bt({ summary: t, onSelect: a }) {
  const s = P[t.source];
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
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: Rt(t) })
      ]
    }
  );
}
function qt({ load: t, capacity: a }) {
  if (!a || t <= 0) return null;
  const s = t > a, r = s ? a / t * 100 : t / a * 100;
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "mt-auto flex h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle",
      title: `Gün yükü ${w.hours(t)} / kapasite ${w.hours(a)}`,
      "aria-label": `Gün yükü ${w.hours(t)}, kapasite ${w.hours(a)}`,
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-full bg-accent", style: { width: `${r}%` } }),
        s && /* @__PURE__ */ e.jsx("span", { className: "h-full flex-1 bg-negative" })
      ]
    }
  );
}
function Gt({
  month: t,
  byDay: a,
  today: s,
  capacity: r,
  onSelectItem: i,
  onSelectDay: p,
  selectedDay: x,
  onDropItem: d,
  pending: m = {},
  errors: n = {},
  focusedDay: b,
  onFocusDay: l,
  onNavigate: c
}) {
  const o = at(t), f = T(s), [u, h] = pe.useState(null), [N, $] = pe.useState(null), E = pe.useRef(null), j = b ?? x ?? f, y = (S) => {
    const C = L(/* @__PURE__ */ new Date(`${j}T00:00:00`), S);
    o.some((M) => T(M) === T(C)) || c == null || c(C), l == null || l(T(C));
  }, z = (S) => {
    const C = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[S.key];
    if (C) {
      S.preventDefault(), y(C);
      return;
    }
    (S.key === "Enter" || S.key === " ") && (S.preventDefault(), p(j));
  };
  return pe.useEffect(() => {
    var C, M;
    const S = (C = E.current) == null ? void 0 : C.querySelector(`[data-day="${j}"]`);
    S && ((M = E.current) != null && M.contains(document.activeElement)) && S.focus();
  }, [j]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Lt.map((S, C) => /* @__PURE__ */ e.jsx(
      "div",
      {
        className: k(
          "px-2.5 py-2 text-right text-[10.5px] font-bold uppercase tracking-wider",
          C > 4 ? "text-text-tertiary opacity-70" : "text-text-tertiary"
        ),
        children: S
      },
      S
    )) }),
    /* @__PURE__ */ e.jsx(
      "div",
      {
        ref: E,
        role: "grid",
        "aria-label": "Ay takvimi",
        tabIndex: 0,
        onKeyDown: z,
        className: "grid grid-cols-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
        children: o.map((S) => {
          const C = T(S), M = a[C] ?? [], { pills: V, summaries: ye } = $t(M), X = ge(M), F = S.getMonth() !== t.getMonth(), ae = C === f, te = C === x;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              role: "gridcell",
              "data-day": C,
              tabIndex: C === j ? 0 : -1,
              "aria-selected": te,
              "aria-label": `${w.dayTitle(S)}${M.length ? `, ${M.length} öğe` : ", boş"}`,
              onClick: () => {
                l == null || l(C), p(C);
              },
              onDragOver: u ? (D) => {
                D.preventDefault(), D.dataTransfer.dropEffect = "move", N !== C && $(C);
              } : void 0,
              onDragLeave: u ? () => $((D) => D === C ? null : D) : void 0,
              onDrop: u ? (D) => {
                D.preventDefault();
                const U = u;
                h(null), $(null), U && U.date.slice(0, 10) !== C && d(U, /* @__PURE__ */ new Date(`${C}T00:00:00`));
              } : void 0,
              className: k(
                "flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5",
                "transition-colors duration-fast last:border-r-0 hover:bg-surface-hover",
                F ? "bg-surface-sunken" : "bg-surface-base",
                te && "ring-2 ring-inset ring-border-focus",
                N === C && "bg-primary-subtle ring-2 ring-inset ring-accent"
              ),
              children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                  X > 0 && r && X > r && /* @__PURE__ */ e.jsx("span", { className: "rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: w.hours(X) }),
                  /* @__PURE__ */ e.jsx(
                    "span",
                    {
                      className: k(
                        "ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11.5px] font-semibold leading-none tabular-nums",
                        ae && "bg-accent text-white",
                        !ae && F && "text-text-tertiary opacity-60",
                        !ae && !F && "text-text-secondary"
                      ),
                      children: S.getDate()
                    }
                  )
                ] }),
                V.map((D) => /* @__PURE__ */ e.jsx(
                  _t,
                  {
                    item: D,
                    onSelect: i,
                    onDragStart: h,
                    isPending: !!m[D.key],
                    hasError: !!n[D.key]
                  },
                  D.key
                )),
                ye.map((D) => /* @__PURE__ */ e.jsx(
                  Bt,
                  {
                    summary: D,
                    onSelect: () => p(C)
                  },
                  `${C}-${D.source}`
                )),
                /* @__PURE__ */ e.jsx(qt, { load: X, capacity: r })
              ]
            },
            C
          );
        })
      }
    )
  ] });
}
const Yt = { 1: "Google", 2: "Outlook", 3: "iCloud" };
function Ut(t) {
  const a = String(t ?? "").trim().split(/\s+/).filter(Boolean);
  return a.length === 0 ? "?" : a.length === 1 ? a[0].slice(0, 2).toLocaleUpperCase("tr") : (a[0][0] + a[a.length - 1][0]).toLocaleUpperCase("tr");
}
function Qt({
  sources: t,
  counts: a,
  enabled: s,
  onToggle: r,
  compact: i = !1,
  externalAccounts: p = [],
  externalLoading: x = !1,
  onOpenSync: d,
  teamOpen: m = !1,
  onToggleTeam: n,
  teamContent: b,
  teamMembers: l = [],
  riskCounts: c
}) {
  const o = (t ?? []).filter((h) => h.isAvailable);
  if (o.length === 0) return null;
  const f = new Set(o.map((h) => h.source)), u = St.map(({ key: h, sources: N }) => {
    const $ = N.filter((E) => f.has(E));
    return $.length === 0 ? null : {
      key: h,
      sources: $,
      meta: P[$[0]],
      /* Grubun tamamı kapalıysa kapalı sayılır — biri açıksa satır açıktır. */
      isOn: $.some((E) => s.has(E)),
      count: $.reduce((E, j) => E + (a[j] ?? 0), 0)
    };
  }).filter(Boolean);
  return /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Takvim kaynakları",
      className: k(
        "flex flex-col gap-1 rounded-card border border-subtle bg-surface-base p-2",
        i ? "w-[60px] items-center" : "w-full"
      ),
      children: [
        !i && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Kaynaklar" }),
        u.map(({ key: h, sources: N, meta: $, isOn: E, count: j }) => $ ? /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": E,
            title: i ? `${$.railLabel ?? $.label} — ${j} öğe` : void 0,
            onClick: () => {
              const y = !E;
              N.forEach((z) => {
                s.has(z) !== y && r(z);
              });
            },
            className: k(
              "group flex items-center rounded-md text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              i ? "relative h-11 w-11 justify-center" : "gap-2.5 px-2 py-2",
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
                  children: /* @__PURE__ */ e.jsx("i", { className: k("fa", $.icon) })
                }
              ),
              i ? j > 0 && /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: k(
                    "absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-[9.5px] font-bold leading-4",
                    E ? "bg-accent text-white" : "bg-neutral-200 text-text-tertiary"
                  ),
                  children: j
                }
              ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsx("span", { className: k("flex-1 truncate text-[12.5px] font-medium", !E && "line-through decoration-1"), children: $.railLabel ?? $.label }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: j })
              ] })
            ]
          },
          h
        ) : null),
        !i && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
          p.length === 0 && !x && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 text-[11.5px] text-text-tertiary", children: "Bağlı takvim yok." }),
          x && p.length === 0 && /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1 text-[11.5px] text-text-tertiary", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
            "senkronize ediliyor…"
          ] }),
          p.map((h) => /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: k(
                "flex items-start gap-2 rounded-md px-2 py-1.5",
                h.error && "bg-negative-50"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: k(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px]",
                      h.error ? "bg-negative-100 text-negative-700" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: k("fa", h.error ? "fa-triangle-exclamation" : "fa-calendar-days") })
                  }
                ),
                /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: Yt[h.provider] ?? "Takvim" }),
                  /* @__PURE__ */ e.jsx("span", { className: k(
                    "block truncate text-[10.5px]",
                    h.error ? "text-negative-700" : "text-text-tertiary"
                  ), children: h.error ?? `${h.email} · ${h.eventCount} etkinlik` }),
                  h.error && /* @__PURE__ */ e.jsx("a", { href: "/Calendars", className: "text-[10.5px] font-semibold text-text-link hover:underline", children: "Yeniden bağla" })
                ] })
              ]
            },
            h.accountId
          )),
          !i && n && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                role: "switch",
                "aria-checked": m,
                onClick: n,
                className: k(
                  "mt-2 flex items-center gap-2 border-t border-subtle px-2 pb-1 pt-2 text-left",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                ),
                children: [
                  /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Ekip katmanı" }),
                  /* @__PURE__ */ e.jsx(
                    "i",
                    {
                      className: k("fa text-[11px]", m ? "fa-toggle-on text-accent" : "fa-toggle-off text-text-tertiary"),
                      "aria-hidden": "true"
                    }
                  )
                ]
              }
            ),
            l.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-1 px-2 pb-1", children: [
              l.slice(0, 3).map((h) => /* @__PURE__ */ e.jsxs(
                "span",
                {
                  title: h.name,
                  className: "flex items-center gap-1 rounded-full bg-neutral-subtle py-0.5 pe-2 ps-0.5 text-[10.5px] text-text-secondary",
                  children: [
                    /* @__PURE__ */ e.jsx(
                      "span",
                      {
                        className: "flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[8.5px] font-bold text-[color:var(--apya-avatar-fg)]",
                        "aria-hidden": "true",
                        children: Ut(h.name)
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { className: "max-w-[86px] truncate", children: h.name })
                  ]
                },
                h.userId
              )),
              l.length > 3 && /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-medium text-text-tertiary", children: [
                "+",
                l.length - 3
              ] })
            ] }),
            b
          ] }),
          c && (c.overdue > 0 || c.dueToday > 0 || c.syncError > 0) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("p", { className: "mt-2 border-t border-subtle px-2 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Risk" }),
            [
              { key: "overdue", label: "Gecikmiş", value: c.overdue, dot: "bg-negative" },
              { key: "dueToday", label: "Bugün son gün", value: c.dueToday, dot: "bg-warning" },
              { key: "syncError", label: "Senkron hatası", value: c.syncError, dot: "bg-negative-700" }
            ].filter((h) => h.value > 0).map((h) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-2 py-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: k("h-[7px] w-[7px] shrink-0 rounded-full", h.dot), "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[11.5px] text-text-secondary", children: h.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-primary", children: h.value })
            ] }, h.key))
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
const Ht = { month: "Ay", week: "Hafta", day: "Gün", agenda: "Ajanda" };
function Wt(t) {
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
function Vt() {
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
function Xt({
  title: t,
  view: a,
  onView: s,
  onPrev: r,
  onNext: i,
  onToday: p,
  overloadDays: x,
  onHelp: d,
  filterCount: m = 0,
  onClearFilters: n,
  lastSyncAt: b,
  syncError: l = !1,
  canCreateTask: c = !0,
  compact: o = !1
}) {
  const f = a !== "agenda", u = Wt(b);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    f && /* @__PURE__ */ e.jsxs("div", { className: "flex", children: [
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
          onClick: i,
          "aria-label": "Sonrakine git",
          className: "h-9 w-9 rounded-r-md border border-l-0 border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(A, { variant: "outline", size: "sm", onClick: p, children: "Bugün" }),
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
      (u || l) && /* @__PURE__ */ e.jsxs(
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
            u ? ` · ${u}` : ""
          ]
        }
      ),
      m > 0 && n && /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: n,
          title: "Filtreleri temizle — kapalı kaynakları geri aç",
          className: "flex h-9 items-center gap-1.5 rounded-md border border-default bg-surface-base px-2.5 text-[12px] font-medium text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: [
            "Filtre",
            /* @__PURE__ */ e.jsx("span", { className: "rounded-full bg-primary-subtle px-1.5 text-[11px] font-semibold text-accent", children: m })
          ]
        }
      ),
      !o && /* @__PURE__ */ e.jsxs(
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
      d && !o && /* @__PURE__ */ e.jsx(
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
      /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(Ht).map(([h, N]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": a === h,
          onClick: () => s(h),
          className: k(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            a === h ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: N
        },
        h
      )) }),
      c && !o && /* @__PURE__ */ e.jsxs(A, { variant: "primary", size: "sm", onClick: nt, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus me-1.5", "aria-hidden": "true" }),
        "Yeni görev"
      ] })
    ] })
  ] });
}
const Z = 44, Jt = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], Zt = {
  [O.OVERDUE]: "bg-negative-50 text-negative-700",
  [O.DUE_TODAY]: "bg-warning-50 text-warning-700"
};
function ea({ load: t, capacity: a }) {
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
function ta({ days: t, byDay: a, today: s, capacity: r, onSelectItem: i, onSelectDay: p, selectedDay: x }) {
  const d = T(s), m = g.useRef(null), [n, b] = g.useState(() => {
    const j = /* @__PURE__ */ new Date();
    return j.getHours() * 60 + j.getMinutes();
  });
  g.useEffect(() => {
    const j = setInterval(() => {
      const y = /* @__PURE__ */ new Date();
      b(y.getHours() * 60 + y.getMinutes());
    }, 6e4);
    return () => clearInterval(j);
  }, []);
  const l = t.map(T), c = {}, o = {};
  for (const j of l) {
    const y = a[j] ?? [];
    c[j] = y.filter(Ye), o[j] = y.filter((z) => !Ye(z));
  }
  const f = l.flatMap((j) => c[j]), { start: u, end: h } = Kt(f), N = Array.from({ length: h - u }, (j, y) => u + y), $ = (h - u) * Z, E = l.includes(d) && n >= u * 60 && n <= h * 60;
  return g.useEffect(() => {
    if (!E || !m.current) return;
    const j = (n - u * 60) / 60 * Z;
    m.current.scrollTop = Math.max(0, j - 120);
  }, [E, u]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "grid border-b border-default bg-surface-raised",
        style: { gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))` },
        children: [
          /* @__PURE__ */ e.jsx("div", {}),
          t.map((j) => {
            const y = T(j), z = ge(a[y] ?? []), S = y === d;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => p(y),
                className: k(
                  "border-l border-subtle px-2 py-2 text-left transition-colors duration-fast hover:bg-surface-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
                  x === y && "bg-primary-subtle"
                ),
                children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "flex items-baseline gap-1.5", children: [
                    /* @__PURE__ */ e.jsx("span", { className: k(
                      "text-[10.5px] font-bold uppercase tracking-wider",
                      S ? "text-accent" : "text-text-tertiary"
                    ), children: Jt[(j.getDay() + 6) % 7] }),
                    /* @__PURE__ */ e.jsx("span", { className: k(
                      "font-mono text-[13px] font-semibold tabular-nums",
                      S ? "text-accent" : "text-text-primary"
                    ), children: j.getDate() }),
                    r && z > r && /* @__PURE__ */ e.jsx("span", { className: "ms-auto rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: w.hours(z) })
                  ] }),
                  /* @__PURE__ */ e.jsx(ea, { load: z, capacity: r })
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
          l.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-[46px] flex-col gap-[3px] border-l border-subtle p-1", children: [
            o[j].slice(0, 4).map((y) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => i(y),
                title: y.title,
                className: k(
                  "flex w-full items-center gap-1 truncate rounded-[5px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                  Zt[y.risk] ?? "bg-neutral-subtle text-text-primary",
                  y.isDone && "line-through opacity-65"
                ),
                children: [
                  P[y.source] && /* @__PURE__ */ e.jsx("i", { className: k("fa shrink-0 text-[9px] opacity-70", P[y.source].icon), "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "truncate", children: y.title })
                ]
              },
              y.key
            )),
            o[j].length > 4 && /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => p(j),
                className: "px-1.5 text-left text-[10.5px] font-medium text-text-tertiary hover:text-text-primary",
                children: [
                  "+",
                  o[j].length - 4,
                  " öğe"
                ]
              }
            )
          ] }, j))
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { ref: m, className: "max-h-[520px] overflow-y-auto", children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "relative grid",
          style: {
            gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))`,
            height: `${$}px`
          },
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "relative", children: N.map((j, y) => /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: "absolute right-1.5 -translate-y-1/2 font-mono text-[10px] tabular-nums text-text-tertiary",
                style: { top: `${y * Z}px` },
                children: [
                  String(j).padStart(2, "0"),
                  ":00"
                ]
              },
              j
            )) }),
            l.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "relative border-l border-subtle", children: [
              N.map((y, z) => /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "absolute inset-x-0 border-t border-subtle",
                  style: { top: `${z * Z}px` }
                },
                y
              )),
              c[j].map((y) => {
                const z = fe(y.startTime), S = y.endTime ? fe(y.endTime) : z + 60, C = (z - u * 60) / 60 * Z, M = Math.max((S - z) / 60 * Z, 18);
                return /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => i(y),
                    title: `${y.title} · ${je(y.startTime)}`,
                    style: {
                      top: `${C}px`,
                      height: `${M}px`,
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
              E && j === d && /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "pointer-events-none absolute inset-x-0 z-10 border-t-2 border-negative",
                  style: { top: `${(n - u * 60) / 60 * Z}px` },
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ e.jsx("span", { className: "absolute -left-1 -top-1 h-2 w-2 rounded-full bg-negative" })
                }
              )
            ] }, j))
          ]
        }
      ),
      f.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "border-t border-subtle px-3 py-2 text-[11.5px] text-text-tertiary", children: "Saat ızgarası dış takvim etkinliklerini gösterir. Bağlı bir takvim yoksa boş kalır." })
    ] })
  ] });
}
function aa({ item: t }) {
  var b;
  const [a, s] = g.useState(""), [r, i] = g.useState(() => /* @__PURE__ */ new Set()), p = t.description ?? t.subtitle ?? "", x = W({
    queryKey: ["calendar", "projects-lookup"],
    queryFn: () => K.get("/api/app/task/projects-lookup"),
    staleTime: 10 * 6e4
  }), d = _({
    mutationFn: async () => {
      const l = new FormData();
      l.append("file", new Blob([`${t.title}

${p}`], { type: "text/plain" }), "toplanti-notlari.txt");
      const c = await fetch(`/api/ai-task-generator/parse?projectId=${a}`, {
        method: "POST",
        body: l,
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });
      if (!c.ok) throw new Error("Notlardan görev çıkarılamadı.");
      return c.json();
    },
    onSuccess: (l) => i(new Set(((l == null ? void 0 : l.suggestions) ?? []).map((c, o) => o)))
  }), m = _({
    mutationFn: () => {
      var l;
      return K.post("/api/ai-task-generator/create-tasks", {
        projectId: a,
        approvedTasks: (((l = d.data) == null ? void 0 : l.suggestions) ?? []).filter((c, o) => r.has(o))
      });
    }
  }), n = ((b = d.data) == null ? void 0 : b.suggestions) ?? [];
  return /* @__PURE__ */ e.jsxs("section", { className: "border-t border-subtle px-4 py-3", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Toplantıdan görev" }),
    !p && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[11.5px] text-text-tertiary", children: "Bu etkinlikte not yok — çıkarılacak aksiyon maddesi bulunamaz." }),
    p && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
        A,
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
      n.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", children: [
        n.map((l, c) => /* @__PURE__ */ e.jsxs("label", { className: "flex cursor-pointer items-start gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: r.has(c),
              onChange: () => i((o) => {
                const f = new Set(o);
                return f.has(c) ? f.delete(c) : f.add(c), f;
              }),
              className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[12px] text-text-primary", children: l.title })
        ] }, `${l.title}-${c}`)),
        /* @__PURE__ */ e.jsx(
          A,
          {
            size: "sm",
            variant: "primary",
            className: k("mt-2"),
            disabled: r.size === 0 || m.isPending || m.isSuccess,
            onClick: () => m.mutate(),
            children: m.isSuccess ? `${m.data} görev eklendi` : m.isPending ? "Ekleniyor…" : `${r.size} görev olarak ekle`
          }
        )
      ] })
    ] })
  ] });
}
const sa = {
  [O.OVERDUE]: { text: "Gecikmiş", cls: "bg-negative-50 text-negative-700" },
  [O.DUE_TODAY]: { text: "Bugün son gün", cls: "bg-warning-50 text-warning-700" }
};
function ne({ label: t, children: a }) {
  return a ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-subtle py-2.5 last:border-b-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11.5px] font-medium text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "min-w-0 text-right text-[12.5px] text-text-primary", children: a })
  ] }) : null;
}
function ra({ item: t, capacity: a, onClose: s, onReschedule: r, onComplete: i, isPending: p, error: x, onRetry: d }) {
  const [m, n] = g.useState(() => t.date.slice(0, 10)), b = P[t.source], l = sa[t.risk], c = t.date.slice(0, 10);
  g.useEffect(() => n(c), [c]);
  const o = () => {
    !m || m === c || r(t, /* @__PURE__ */ new Date(`${m}T00:00:00`));
  };
  return /* @__PURE__ */ e.jsx(oe, { open: !0, onOpenChange: (f) => {
    f || s();
  }, children: /* @__PURE__ */ e.jsxs(ce, { side: "right", title: t.title, className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md bg-neutral-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary", children: [
          b && /* @__PURE__ */ e.jsx("i", { className: k("fa text-[10px]", b.icon), "aria-hidden": "true" }),
          b == null ? void 0 : b.label
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
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: d, className: "font-semibold underline", children: "Yeniden dene" })
    ] }),
    p && /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle px-4 py-2 text-[12px] text-text-tertiary", "aria-live": "polite", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "kaydediliyor…"
    ] }),
    t.canReschedule && !t.isDone && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs(A, { size: "sm", variant: "secondary", onClick: () => i(t), children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-check me-1.5", "aria-hidden": "true" }),
        "Tamamla"
      ] }),
      /* @__PURE__ */ e.jsx(
        A,
        {
          size: "sm",
          variant: "outline",
          onClick: () => r(t, L(/* @__PURE__ */ new Date(`${c}T00:00:00`), 1)),
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
            value: m,
            onChange: (f) => n(f.target.value),
            className: "rounded-md border border-default bg-surface-base px-2 py-1 text-[12.5px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": "Son tarih"
          }
        ),
        m !== c && /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "primary", onClick: o, children: "Uygula" })
      ] }) : /* @__PURE__ */ e.jsxs("span", { className: "text-text-secondary", children: [
        w.dayTitle(/* @__PURE__ */ new Date(`${c}T00:00:00`)),
        /* @__PURE__ */ e.jsx("span", { className: "ml-1.5 text-text-tertiary", children: "· takvimden değiştirilemez" })
      ] }) }),
      /* @__PURE__ */ e.jsx(ne, { label: "Bağlam", children: t.subtitle }),
      /* @__PURE__ */ e.jsx(ne, { label: "Atanan", children: t.assigneeName }),
      /* @__PURE__ */ e.jsx(ne, { label: "Tutar", children: t.amount != null ? w.money(t.amount, t.currency) : null }),
      /* @__PURE__ */ e.jsx(ne, { label: "Gün yükü", children: t.loadHours != null ? `${w.hours(t.loadHours)}${a ? ` / ${w.hours(a)} kapasite` : ""}` : null })
    ] }),
    t.source === 7 && /* @__PURE__ */ e.jsx(aa, { item: t }),
    t.href && /* @__PURE__ */ e.jsx("footer", { className: "border-t border-subtle px-4 py-3", children: /* @__PURE__ */ e.jsxs(
      "a",
      {
        href: t.href,
        className: "text-[12.5px] font-medium text-text-link hover:underline",
        children: [
          b == null ? void 0 : b.label,
          " ekranında aç",
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right ms-1.5 text-[10px]", "aria-hidden": "true" })
        ]
      }
    ) })
  ] }) });
}
const it = ["calendar", "sync-settings"];
function na(t) {
  return W({
    queryKey: it,
    queryFn: () => K.get("/api/app/calendar/sync-settings"),
    enabled: t,
    staleTime: 3e4
  });
}
function ia() {
  const t = ee();
  return _({
    /* ABP konvansiyonu: UpdateSyncRulesAsync → PUT (POST 405). */
    mutationFn: (a) => K.put("/api/app/calendar/sync-rules", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: it }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
const lt = ["calendar", "ical-feed"], Re = ["calendar", "ical-subscriptions"];
function la(t) {
  return W({
    queryKey: lt,
    /* GetOrCreate: bağlantı yoksa ilk açılışta üretilir. */
    queryFn: () => K.post("/api/app/ical-feed/ensure", {}),
    enabled: t,
    staleTime: 1 / 0
  });
}
function oa() {
  const t = ee();
  return _({
    mutationFn: () => K.post("/api/app/ical-feed/regenerate", {}),
    onSuccess: (a) => t.setQueryData(lt, a)
  });
}
function ca(t) {
  return W({
    queryKey: Re,
    queryFn: () => K.get("/api/app/ical-subscription"),
    enabled: t,
    staleTime: 3e4
  });
}
function da() {
  const t = ee();
  return _({
    mutationFn: (a) => K.post("/api/app/ical-subscription", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Re }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function ua() {
  const t = ee();
  return _({
    mutationFn: (a) => K.delete(`/api/app/ical-subscription/${a}`),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Re }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function xa() {
  return _({
    mutationFn: (t) => K.post(`/api/app/ical-subscription/probe?url=${encodeURIComponent(t)}`, {})
  });
}
const pa = {
  1: { label: "Google Calendar", icon: "fa-google", brand: "bg-[#ea4335]" },
  2: { label: "Microsoft Outlook", icon: "fa-windows", brand: "bg-[#0078d4]" },
  3: { label: "iCloud", icon: "fa-apple", brand: "bg-neutral-700" }
}, ma = {
  0: { title: "Son değişen kazanır", desc: "İki taraf da düzenlenirse en son yapılan değişiklik uygulanır; ekranda geri alma şeridi çıkar." },
  1: { title: "APYA her zaman kazanır", desc: "Dış takvim salt-okunur ayna olur; dışarıdaki düzenleme geri alınır." }
}, Qe = {
  0: { icon: "fa-arrow-up-from-bracket", cls: "text-text-tertiary" },
  1: { icon: "fa-code-merge", cls: "text-warning-700" },
  2: { icon: "fa-triangle-exclamation", cls: "text-negative-700" }
};
function Ae(t) {
  if (!t) return "hiç";
  const a = Math.round((Date.now() - new Date(t).getTime()) / 6e4);
  return a < 1 ? "az önce" : a < 60 ? `${a} dk önce` : a < 1440 ? `${Math.round(a / 60)} sa önce` : w.dayShort(new Date(t));
}
function ba({ account: t, onSave: a, saving: s }) {
  const r = pa[t.provider] ?? { label: "Takvim", icon: "fa-calendar", brand: "bg-neutral-700" }, [i, p] = g.useState(() => new Set(t.syncSources ?? [])), [x, d] = g.useState(t.conflictRule ?? 0), [m, n] = g.useState(t.isSyncEnabled);
  g.useEffect(() => {
    p(new Set(t.syncSources ?? [])), d(t.conflictRule ?? 0), n(t.isSyncEnabled);
  }, [t]);
  const b = m !== t.isSyncEnabled || x !== t.conflictRule || i.size !== (t.syncSources ?? []).length || [...i].some((c) => !(t.syncSources ?? []).includes(c)), l = (c) => p((o) => {
    const f = new Set(o);
    return f.has(c) ? f.delete(c) : f.add(c), f;
  });
  return /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-3 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: k("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", r.brand), "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("i", { className: k("fab", r.icon) }) }),
      /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-semibold text-text-primary", children: r.label }),
        /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[11.5px] text-text-tertiary", children: [
          t.externalEmail,
          " · son senkron ",
          Ae(t.lastSyncTime)
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("label", { className: "flex shrink-0 items-center gap-1.5 text-[11.5px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: m,
            onChange: (c) => n(c.target.checked),
            className: "h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
          }
        ),
        "Açık"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Bu hesaba ne gitsin?" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Se.map((c) => {
        var f, u;
        const o = i.has(c);
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": o,
            onClick: () => l(c),
            className: k(
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              o ? "border-accent bg-primary-subtle text-accent" : "border-subtle bg-surface-base text-text-tertiary hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: k("fa text-[10px]", (f = P[c]) == null ? void 0 : f.icon), "aria-hidden": "true" }),
              (u = P[c]) == null ? void 0 : u.label
            ]
          },
          c
        );
      }) }),
      i.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-text-tertiary", children: "Hiçbiri seçili değil — yalnız görevler gönderilir." }),
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Çakışma kuralı" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: Object.entries(ma).map(([c, o]) => {
        const f = Number(c), u = x === f;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => d(f),
            className: k(
              "rounded-md border px-2.5 py-2 text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              u ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("span", { className: k("block text-[12px] font-semibold", u ? "text-accent" : "text-text-primary"), children: o.title }),
              /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] leading-snug text-text-tertiary", children: o.desc })
            ]
          },
          c
        );
      }) }),
      b && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          A,
          {
            size: "sm",
            variant: "primary",
            disabled: s,
            onClick: () => a({
              accountId: t.id,
              isSyncEnabled: m,
              syncSources: [...i],
              syncProjectIds: t.syncProjectIds ?? [],
              conflictRule: x
            }),
            children: s ? "Kaydediliyor…" : "Kuralları kaydet"
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Kaydedilmemiş değişiklik var" })
      ] })
    ] })
  ] });
}
const fa = [
  { value: 15, label: "15 dk" },
  { value: 60, label: "1 saat" },
  { value: 360, label: "6 saat" },
  { value: 1440, label: "Günlük" }
];
function ha({ open: t }) {
  var N, $, E, j;
  const a = la(t), s = oa(), r = ca(t), i = da(), p = ua(), x = xa(), [d, m] = g.useState(""), [n, b] = g.useState(""), [l, c] = g.useState(60), [o, f] = g.useState(!1), u = (N = a.data) != null && N.path ? `${window.location.origin}${a.data.path}` : "", h = async () => {
    try {
      await navigator.clipboard.writeText(u), f(!0), setTimeout(() => f(!1), 2e3);
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
            value: u,
            "aria-label": "iCal abonelik bağlantısı",
            className: "min-w-0 flex-1 truncate rounded-md border border-default bg-surface-sunken px-2 py-1 font-mono text-[11px] text-text-secondary"
          }
        ),
        /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "outline", onClick: h, disabled: !u, children: o ? "Kopyalandı" : "Kopyala" })
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
            onChange: (y) => {
              m(y.target.value), x.reset();
            },
            placeholder: "https://…/basic.ics",
            "aria-label": "Takvim bağlantısı",
            className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          }
        ),
        (($ = x.data) == null ? void 0 : $.isValid) && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-positive-700", children: [
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
              value: n,
              onChange: (y) => b(y.target.value),
              placeholder: ((E = x.data) == null ? void 0 : E.suggestedName) || "Görünen ad",
              "aria-label": "Görünen ad",
              className: "min-w-0 flex-1 rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              value: l,
              onChange: (y) => c(Number(y.target.value)),
              "aria-label": "Yenileme sıklığı",
              className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
              children: fa.map((y) => /* @__PURE__ */ e.jsx("option", { value: y.value, children: y.label }, y.value))
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(
            A,
            {
              size: "sm",
              variant: "outline",
              disabled: !d || x.isPending,
              onClick: () => x.mutate(d),
              children: x.isPending ? "Deneniyor…" : "Bağlantıyı dene"
            }
          ),
          /* @__PURE__ */ e.jsx(
            A,
            {
              size: "sm",
              variant: "primary",
              disabled: !d || i.isPending,
              onClick: () => i.mutate(
                { url: d, displayName: n, color: "accent", refreshMinutes: l },
                { onSuccess: () => {
                  m(""), b(""), x.reset();
                } }
              ),
              children: i.isPending ? "Ekleniyor…" : "Takvimi ekle"
            }
          )
        ] }),
        i.isError && /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-negative-700", children: ((j = i.error) == null ? void 0 : j.message) || "Takvim eklenemedi." }),
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
          ), children: y.lastError ?? `${y.lastEventCount} etkinlik · ${Ae(y.lastFetchedAt)} çekildi` })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => p.mutate(y.id),
            className: "shrink-0 rounded p-1 text-[11px] text-text-tertiary hover:text-negative-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": `${y.displayName} aboneliğini kaldır`,
            children: "Kaldır"
          }
        )
      ] }, y.id)) })
    ] })
  ] });
}
function ga({ open: t, onClose: a }) {
  const { data: s, isPending: r } = na(t), i = ia();
  return /* @__PURE__ */ e.jsx(oe, { open: t, onOpenChange: (p) => {
    p || a();
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
          action: /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "outline", onClick: () => {
            window.location.href = "/Calendars/SimulateAuth?provider=1";
          }, children: "Hesap bağla" })
        }
      ) }) : s.accounts.map((p) => /* @__PURE__ */ e.jsx(
        ba,
        {
          account: p,
          saving: i.isPending,
          onSave: (x) => i.mutate(x)
        },
        p.id
      )),
      /* @__PURE__ */ e.jsx(ha, { open: t }),
      /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
        /* @__PURE__ */ e.jsx("header", { className: "border-b border-subtle px-3 py-2", children: /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-semibold text-text-primary", children: "Senkron günlüğü" }) }),
        /* @__PURE__ */ e.jsx("div", { className: "px-3 py-2", children: ((s == null ? void 0 : s.log) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-2 text-[11.5px] text-text-tertiary", children: "Henüz senkron kaydı yok." }) : s.log.map((p) => {
          const x = Qe[p.kind] ?? Qe[0];
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
            /* @__PURE__ */ e.jsx("i", { className: k("fa mt-0.5 shrink-0 text-[11px]", x.icon, x.cls), "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[11.5px] leading-snug text-text-secondary", children: p.message }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: Ae(p.occurredAt) })
          ] }, p.id);
        }) })
      ] })
    ] }) })
  ] }) });
}
const ot = ["calendar", "preferences"];
function ya() {
  return W({
    queryKey: ot,
    queryFn: () => K.get("/api/app/calendar/preferences"),
    staleTime: 5 * 6e4
  });
}
function ka() {
  const t = ee();
  return _({
    /* ABP konvansiyonu: Update* metotları PUT'a düşer. POST 405 döner ve
       ayarlar SESSİZCE kaydedilmemiş olur. */
    mutationFn: (a) => K.put("/api/app/calendar/preferences", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: ot }), t.invalidateQueries({ queryKey: ["calendar", "feed"] });
    }
  });
}
function va() {
  const t = ee();
  return _({
    mutationFn: (a) => K.post("/api/app/calendar/bulk-reschedule", a),
    onSettled: () => t.invalidateQueries({ queryKey: ["calendar", "feed"] })
  });
}
function ja({ open: t, items: a, today: s, capacity: r, onClose: i }) {
  const { suggestions: p, fixed: x } = g.useMemo(
    () => It(a, { today: s, capacity: r }),
    [a, s, r]
  ), [d, m] = g.useState(() => new Set(p.map((u) => u.item.key)));
  g.useEffect(() => {
    m(new Set(p.map((u) => u.item.key)));
  }, [p]);
  const n = va(), b = n.data ?? [], l = new Map(b.filter((u) => !u.succeeded).map((u) => [u.sourceId, u.error])), c = (u) => m((h) => {
    const N = new Set(h);
    return N.has(u) ? N.delete(u) : N.add(u), N;
  }), o = p.filter((u) => d.has(u.item.key)), f = () => {
    n.mutate(
      o.map((u) => ({
        source: u.item.source,
        sourceId: u.item.sourceId,
        newDate: T(u.date)
      })),
      {
        onSuccess: (u) => {
          (u ?? []).every((h) => h.succeeded) && i();
        }
      }
    );
  };
  return /* @__PURE__ */ e.jsx(oe, { open: t, onOpenChange: (u) => {
    u || i();
  }, children: /* @__PURE__ */ e.jsxs(ce, { side: "right", title: "Akıllı erteleme", className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-semibold text-text-primary", children: "Akıllı erteleme" }),
        /* @__PURE__ */ e.jsxs("p", { className: "mt-0.5 text-[11.5px] leading-snug text-text-tertiary", children: [
          p.length > 0 ? `${p.length} gecikmiş öğe için boş günlere dağıtılmış tarihler önerildi.` : "Ertelenecek gecikmiş öğe yok.",
          r ? ` Günlük kapasite ${w.hours(r)}.` : ""
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: i,
          "aria-label": "Kapat",
          className: "rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-2", children: [
      p.map(({ item: u, date: h }) => {
        const N = l.get(u.sourceId);
        return /* @__PURE__ */ e.jsxs(
          "label",
          {
            className: k(
              "flex cursor-pointer items-start gap-2.5 border-b border-subtle py-2.5 last:border-b-0",
              N && "bg-negative-50"
            ),
            children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: d.has(u.key),
                  onChange: () => c(u.key),
                  className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] font-semibold text-text-primary", children: u.title }),
                /* @__PURE__ */ e.jsxs("span", { className: "mt-0.5 flex items-center gap-1.5 text-[11px] text-text-tertiary", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "line-through", children: w.dayShort(/* @__PURE__ */ new Date(`${u.date.slice(0, 10)}T00:00:00`)) }),
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right text-[9px]", "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-accent", children: w.dayShort(h) }),
                  u.loadHours != null && /* @__PURE__ */ e.jsxs("span", { children: [
                    "· ",
                    w.hours(u.loadHours)
                  ] })
                ] }),
                N && /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] font-medium text-negative-700", children: N })
              ] })
            ]
          },
          u.key
        );
      }),
      x.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 border-t border-subtle pt-2", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Ertelenemez" }),
        x.map((u) => {
          var h;
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 py-1.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock mt-1 shrink-0 text-[10px] text-text-tertiary", "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] text-text-secondary", children: u.title }),
              /* @__PURE__ */ e.jsxs("span", { className: "block text-[11px] text-text-tertiary", children: [
                (h = P[u.source]) == null ? void 0 : h.label,
                " — vadesi takvimden değiştirilemez"
              ] })
            ] })
          ] }, u.key);
        })
      ] })
    ] }),
    p.length > 0 && /* @__PURE__ */ e.jsxs("footer", { className: "flex items-center gap-2 border-t border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsx(
        A,
        {
          size: "sm",
          variant: "primary",
          disabled: o.length === 0 || n.isPending,
          onClick: f,
          children: n.isPending ? "Erteleniyor…" : `${o.length} öğeyi ertele`
        }
      ),
      /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "ghost", onClick: i, children: "Vazgeç" })
    ] })
  ] }) });
}
const Na = [
  { value: 4, label: "4 sa" },
  { value: 6, label: "6 sa" },
  { value: 8, label: "8 sa" },
  { value: 0, label: "Kapalı" }
], me = ["Kaynaklar", "Dış takvim", "Kurallar"];
function wa({ open: t, counts: a, onDone: s }) {
  var c;
  const [r, i] = g.useState(0), [p, x] = g.useState(() => new Set(Se)), [d, m] = g.useState(8), n = ka(), b = () => {
    n.mutate(
      {
        dailyCapacityHours: d > 0 ? d : 0,
        sources: [...p],
        setupCompleted: !0
      },
      /* onSettled DEĞİL: hata durumunda da kapanırsa ayarlar sessizce
         kaybolur ve kullanıcı kurulumu yaptığını sanır. */
      { onSuccess: s }
    );
  }, l = (o) => x((f) => {
    const u = new Set(f);
    return u.has(o) ? u.delete(o) : u.add(o), u;
  });
  return /* @__PURE__ */ e.jsx(Je, { open: t, onOpenChange: (o) => {
    o || s();
  }, children: /* @__PURE__ */ e.jsxs(Ze, { className: "w-full max-w-[520px] p-0 h-auto max-h-[88dvh] tablet:min-h-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "shrink-0 border-b border-subtle px-5 py-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[18px] font-semibold tracking-tight text-text-primary", children: "Takviminizi kurun" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: "Hangi kaynakları göreceğinizi seçin, dilerseniz dış takvim bağlayın. Her ayarı sonradan değiştirebilirsiniz." }),
      /* @__PURE__ */ e.jsx("ol", { className: "mt-3 flex items-center gap-2", children: me.map((o, f) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx("span", { className: k(
          "flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold",
          f === r ? "bg-accent text-white" : f < r ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
        ), children: f + 1 }),
        /* @__PURE__ */ e.jsx("span", { className: k(
          "text-[11.5px]",
          f === r ? "font-semibold text-text-primary" : "text-text-tertiary"
        ), children: o }),
        f < me.length - 1 && /* @__PURE__ */ e.jsx("span", { className: "ms-1 text-text-tertiary", children: "·" })
      ] }, o)) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "min-h-0 overflow-y-auto px-5 py-4", children: [
      r === 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Takvimde ne görünsün?" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex flex-col gap-1.5", children: Se.map((o) => {
          var h, N;
          const f = p.has(o), u = a == null ? void 0 : a[o];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": f,
              onClick: () => l(o),
              className: k(
                "flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                f ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: k("fa text-[12px]", (h = P[o]) == null ? void 0 : h.icon, f ? "text-accent" : "text-text-tertiary"), "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-medium text-text-primary", children: (N = P[o]) == null ? void 0 : N.label }),
                u != null && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: u })
              ]
            },
            o
          );
        }) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-[13px] font-semibold text-text-primary", children: "Günlük kapasiteniz" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex gap-1.5", children: Na.map((o) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => m(o.value),
            className: k(
              "rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              d === o.value ? "border-accent bg-primary-subtle text-accent" : "border-subtle text-text-secondary hover:bg-surface-hover"
            ),
            children: o.label
          },
          o.value
        )) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] leading-snug text-text-tertiary", children: "Aşım uyarıları bu değere göre hesaplanır. Kapatırsanız kapasite çubukları görünmez." })
      ] }),
      r === 1 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Dış takvim bağlayın" }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: "Google veya Outlook bağlarsanız size atanan tarihli öğeler oraya etkinlik olarak yazılır. Bu adım isteğe bağlıdır — sonradan senkron ayarlarından bağlayabilirsiniz." }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex gap-2", children: [
          /* @__PURE__ */ e.jsxs(
            A,
            {
              size: "sm",
              variant: "outline",
              onClick: () => {
                window.location.href = "/Calendars/SimulateAuth?provider=1";
              },
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fab fa-google me-1.5", "aria-hidden": "true" }),
                "Google bağla"
              ]
            }
          ),
          /* @__PURE__ */ e.jsxs(
            A,
            {
              size: "sm",
              variant: "outline",
              onClick: () => {
                window.location.href = "/Calendars/SimulateAuth?provider=2";
              },
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fab fa-windows me-1.5", "aria-hidden": "true" }),
                "Outlook bağla"
              ]
            }
          )
        ] })
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
    n.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "shrink-0 px-5 pb-3 text-[11px] text-negative-700", children: ((c = n.error) == null ? void 0 : c.message) || "Ayarlar kaydedilemedi, lütfen tekrar deneyin." }),
    /* @__PURE__ */ e.jsxs("footer", { className: "shrink-0 flex items-center gap-2 border-t border-subtle px-5 py-3", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary", children: [
        "Adım ",
        r + 1,
        " / ",
        me.length
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1" }),
      /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "ghost", onClick: b, disabled: n.isPending, children: "Şimdilik atla" }),
      r < me.length - 1 ? /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "primary", onClick: () => i((o) => o + 1), children: "Devam" }) : /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "primary", onClick: b, disabled: n.isPending, children: n.isPending ? "Kaydediliyor…" : "Bitir" })
    ] })
  ] }) });
}
const Sa = [
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
function Da({ open: t, onClose: a }) {
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
      Sa.map((s) => /* @__PURE__ */ e.jsxs("section", { className: "mb-4 last:mb-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: s.title }),
        s.rows.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center gap-1", children: r.keys.map((i) => /* @__PURE__ */ e.jsx(He, { children: i }, i)) }),
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
function Ca({ polite: t, assertive: a }) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("p", { role: "status", "aria-live": "polite", className: "sr-only", children: t }),
    /* @__PURE__ */ e.jsx("p", { role: "alert", "aria-live": "assertive", className: "sr-only", children: a })
  ] });
}
const Ta = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
function Ea({ items: t, month: a, today: s, generatedAt: r }) {
  var c;
  const i = at(a), p = T(s), x = {};
  for (const o of t ?? [])
    (x[c = o.date.slice(0, 10)] ?? (x[c] = [])).push(o);
  const d = Ee(s), m = (t ?? []).filter((o) => {
    const f = o.date.slice(0, 10);
    return f >= T(d) && f <= T(L(d, 7));
  }), { overdue: n, days: b } = rt(m, s), l = (o) => o === O.OVERDUE ? "border-l-[3px] border-l-black" : o === O.DUE_TODAY ? "border-l-[3px] border-l-neutral-500" : "border-l-[3px] border-l-neutral-300";
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-print-root hidden print:block", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-end justify-between border-b-2 border-black pb-2", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[8pt] font-bold uppercase tracking-widest text-neutral-500", children: "APYA · Takvim" }),
          /* @__PURE__ */ e.jsx("h1", { className: "mt-1 text-[22pt] font-semibold capitalize leading-none", children: w.monthTitle(a) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "text-right text-[8pt] text-neutral-500", children: [
          /* @__PURE__ */ e.jsx("p", { children: "Risk: kalın çizgi = gecikmiş · gri çizgi = bugün son gün" }),
          /* @__PURE__ */ e.jsxs("p", { children: [
            r,
            " tarihinde oluşturuldu · Sayfa 1 / 2"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "mt-3 grid grid-cols-7", children: Ta.map((o) => /* @__PURE__ */ e.jsx("div", { className: "pb-1 text-[7.5pt] font-bold uppercase tracking-wide text-neutral-500", children: o }, o)) }),
      /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-l border-t border-neutral-300", children: i.map((o) => {
        const f = T(o), u = x[f] ?? [], h = o.getMonth() !== a.getMonth();
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: k(
              "min-h-[62px] border-b border-r border-neutral-300 p-1",
              f === p && "ring-1 ring-inset ring-black"
            ),
            children: [
              /* @__PURE__ */ e.jsx("p", { className: k(
                "text-right font-mono text-[9pt] font-semibold",
                h ? "text-neutral-300" : "text-neutral-700"
              ), children: o.getDate() }),
              u.slice(0, 4).map((N) => /* @__PURE__ */ e.jsx(
                "p",
                {
                  className: k(
                    "mt-0.5 truncate ps-1 text-[7.5pt] leading-tight",
                    l(N.risk),
                    N.risk === O.OVERDUE ? "font-semibold" : "font-normal",
                    N.isDone && "line-through"
                  ),
                  children: N.title
                },
                N.key
              )),
              u.length > 4 && /* @__PURE__ */ e.jsxs("p", { className: "mt-0.5 text-[7pt] text-neutral-500", children: [
                "+",
                u.length - 4,
                " öğe"
              ] })
            ]
          },
          f
        );
      }) })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page apya-print-break", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-end justify-between border-b-2 border-black pb-2", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[8pt] font-bold uppercase tracking-widest text-neutral-500", children: "APYA · Haftalık ajanda" }),
          /* @__PURE__ */ e.jsxs("h1", { className: "mt-1 text-[22pt] font-semibold leading-none", children: [
            w.dayShort(d),
            " – ",
            w.dayShort(L(d, 6))
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
        n.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-4 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "border-b-2 border-black pb-1 text-[9pt] font-bold uppercase tracking-wide", children: [
            "Gecikmiş · ",
            n.length
          ] }),
          n.map((o) => /* @__PURE__ */ e.jsx(We, { item: o, showDate: !0 }, o.key))
        ] }),
        b.map((o) => /* @__PURE__ */ e.jsxs("div", { className: "mb-4 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "border-b border-black pb-1 text-[9pt] font-bold uppercase tracking-wide", children: [
            w.dayTitle(o.date),
            o.isToday ? " · Bugün" : ""
          ] }),
          o.items.map((f) => /* @__PURE__ */ e.jsx(We, { item: f }, f.key))
        ] }, o.key))
      ] })
    ] })
  ] });
}
function We({ item: t, showDate: a = !1 }) {
  const s = P[t.source];
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-neutral-200 py-1", children: [
    /* @__PURE__ */ e.jsx("span", { className: "mt-[3px] h-[9px] w-[9px] shrink-0 border border-neutral-600", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ e.jsx("span", { className: k("block text-[9pt] leading-tight", t.risk === O.OVERDUE && "font-semibold"), children: t.title }),
      /* @__PURE__ */ e.jsx("span", { className: "block text-[7.5pt] text-neutral-500", children: [
        a ? w.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
        s == null ? void 0 : s.label,
        t.subtitle,
        t.amount != null ? w.money(t.amount, t.currency) : null
      ].filter(Boolean).join(" · ") })
    ] })
  ] });
}
function $a({ rows: t, days: a, capacity: s, loading: r }) {
  if (r)
    return /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1.5 text-[11.5px] text-text-tertiary", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "ekip yükü hesaplanıyor…"
    ] });
  if (!t || t.length === 0)
    return /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1.5 text-[11.5px] text-text-tertiary", children: "Bu aralıkta atanmış açık görev yok." });
  const i = (a ?? []).map(T);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 px-2 pb-1", children: [
    t.map((p) => {
      const x = {};
      for (const d of p.days ?? []) x[d.date.slice(0, 10)] = d;
      return /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "truncate text-[11.5px] font-medium text-text-primary", children: p.name }),
          /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] tabular-nums text-text-tertiary", children: w.hours(p.totalHours) })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-0.5 flex gap-[2px]", children: (i.length ? i : (p.days ?? []).map((d) => d.date.slice(0, 10))).map((d) => {
          const m = x[d], n = (m == null ? void 0 : m.hours) ?? 0, b = s && n > s, l = s ? Math.min(n / s, 1) : n > 0 ? 1 : 0;
          return /* @__PURE__ */ e.jsx(
            "span",
            {
              title: `${d}: ${w.hours(n)}${m != null && m.itemCount ? ` · ${m.itemCount} öğe` : ""}`,
              className: "h-[6px] flex-1 overflow-hidden rounded-sm bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: k("block h-full", b ? "bg-negative" : "bg-accent"),
                  style: { width: `${l * 100}%` }
                }
              )
            },
            d
          );
        }) })
      ] }, p.userId);
    }),
    /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[10.5px] leading-snug text-text-tertiary", children: "Yalnız görebildiğiniz projelerin görevleri sayılır." })
  ] });
}
const Ra = 6e4;
function Aa({ from: t, to: a }) {
  const s = T(t), r = T(a);
  return W({
    queryKey: ["calendar", "feed", s, r],
    queryFn: () => K.get(`/api/app/calendar/feed?From=${s}&To=${r}`),
    staleTime: Ra,
    placeholderData: (i) => i
    /* ay geçişinde boş ekran yerine eski veri */
  });
}
const ct = "apya.calendar.view", Te = "apya.calendar.sources", he = ["month", "week", "day", "agenda"];
function dt(t) {
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
function za() {
  const t = new URLSearchParams(window.location.search).get("view");
  if (he.includes(t)) return t;
  const a = dt(ct);
  return he.includes(a) ? a : null;
}
function Ka() {
  const t = dt(Te);
  if (!t) return new Set(le);
  const a = t.split(",").map(Number).filter((s) => le.includes(s));
  return a.length ? new Set(a) : new Set(le);
}
function Ia({ defaultView: t = "month" } = {}) {
  const [a] = g.useState(za), [s, r] = g.useState(() => a ?? t), [i, p] = g.useState(Ka);
  g.useEffect(() => {
    const b = new URL(window.location.href);
    b.searchParams.get("view") !== s && (b.searchParams.set("view", s), window.history.replaceState({}, "", b));
  }, [s]);
  const x = g.useCallback((b) => {
    he.includes(b) && (r(b), Ne(ct, b));
  }, []), d = g.useCallback((b) => {
    p((l) => {
      const c = new Set(l);
      return c.has(b) ? c.delete(b) : c.add(b), Ne(Te, [...c].join(",")), c;
    });
  }, []), m = g.useCallback((b) => {
    a || he.includes(b) && r((l) => l === b ? l : b);
  }, [a]), n = g.useCallback(() => {
    const b = new Set(le);
    p(b), Ne(Te, [...b].join(","));
  }, []);
  return { view: s, setView: x, applyResponsiveDefault: m, enabledSources: i, toggleSource: d, resetSources: n };
}
const H = ["calendar", "feed"];
function Oa(t, a, s) {
  t.setQueriesData({ queryKey: H }, (r) => r != null && r.items ? {
    ...r,
    items: r.items.map((i) => i.key === a ? { ...i, date: `${s}T00:00:00` } : i)
  } : r);
}
function Pa(t, a) {
  t.setQueriesData({ queryKey: H }, (s) => s != null && s.items ? {
    ...s,
    items: s.items.map((r) => r.key === a ? { ...r, isDone: !0, risk: 0, loadHours: null } : r)
  } : s);
}
function Ma({ onOfflineFailure: t } = {}) {
  const a = ee(), [s, r] = g.useState(null), [i, p] = g.useState({}), [x, d] = g.useState({}), m = g.useCallback((l) => {
    p((c) => {
      if (!c[l]) return c;
      const o = { ...c };
      return delete o[l], o;
    });
  }, []), n = _({
    mutationFn: ({ item: l, newDate: c }) => K.post("/api/app/calendar/reschedule-item", {
      source: l.source,
      sourceId: l.sourceId,
      newDate: T(c)
    }),
    onMutate: async ({ item: l, newDate: c }) => {
      await a.cancelQueries({ queryKey: H });
      const o = a.getQueriesData({ queryKey: H });
      return m(l.key), d((f) => ({ ...f, [l.key]: !0 })), Oa(a, l.key, T(c)), { snapshot: o, previousDate: l.date.slice(0, 10) };
    },
    onError: (l, { item: c, newDate: o }, f) => {
      var u;
      if (typeof navigator < "u" && !navigator.onLine) {
        t == null || t({
          key: c.key,
          payload: { source: c.source, sourceId: c.sourceId, newDate: T(o) }
        });
        return;
      }
      (u = f == null ? void 0 : f.snapshot) == null || u.forEach(([h, N]) => a.setQueryData(h, N)), p((h) => ({
        ...h,
        [c.key]: (l == null ? void 0 : l.message) || "Kaydedilemedi — tarih değişmedi."
      }));
    },
    onSuccess: (l, { item: c, newDate: o }, f) => {
      r({
        key: c.key,
        message: `“${c.title}” ${T(o)} tarihine taşındı.`,
        undo: () => n.mutate({
          item: { ...c, date: `${T(o)}T00:00:00` },
          newDate: /* @__PURE__ */ new Date(`${f.previousDate}T00:00:00`)
        })
      });
    },
    onSettled: (l, c, { item: o }) => {
      d((f) => {
        const u = { ...f };
        return delete u[o.key], u;
      }), a.invalidateQueries({ queryKey: H });
    }
  }), b = _({
    mutationFn: ({ item: l }) => K.post("/api/app/calendar/complete-item", {
      source: l.source,
      sourceId: l.sourceId
    }),
    onMutate: async ({ item: l }) => {
      await a.cancelQueries({ queryKey: H });
      const c = a.getQueriesData({ queryKey: H });
      return m(l.key), d((o) => ({ ...o, [l.key]: !0 })), Pa(a, l.key), { snapshot: c };
    },
    onError: (l, { item: c }, o) => {
      var f;
      (f = o == null ? void 0 : o.snapshot) == null || f.forEach(([u, h]) => a.setQueryData(u, h)), p((u) => ({
        ...u,
        [c.key]: (l == null ? void 0 : l.message) || "Tamamlanamadı."
      }));
    },
    onSuccess: (l, { item: c }) => {
      r({ key: c.key, message: `“${c.title}” tamamlandı.`, undo: null });
    },
    onSettled: (l, c, { item: o }) => {
      d((f) => {
        const u = { ...f };
        return delete u[o.key], u;
      }), a.invalidateQueries({ queryKey: H });
    }
  });
  return {
    reschedule: (l, c) => n.mutate({ item: l, newDate: c }),
    complete: (l) => b.mutate({ item: l }),
    retry: (l, c) => c ? n.mutate({ item: l, newDate: c }) : b.mutate({ item: l }),
    lastAction: s,
    dismissAction: () => r(null),
    errors: i,
    clearError: m,
    pending: x
  };
}
function La({ from: t, to: a, enabled: s = !0 }) {
  const r = T(t), i = T(a);
  return W({
    queryKey: ["calendar", "external", r, i],
    queryFn: () => K.get(`/api/app/calendar/external-events?From=${r}&To=${i}`),
    enabled: s,
    staleTime: 12e4,
    retry: !1,
    placeholderData: (p) => p
  });
}
const Fa = ["INPUT", "TEXTAREA", "SELECT"];
function _a({
  onView: t,
  onToday: a,
  onPrev: s,
  onNext: r,
  onDeferSelected: i,
  onUndo: p,
  onToggleHelp: x,
  enabled: d = !0
}) {
  g.useEffect(() => {
    if (!d) return;
    const m = (n) => {
      const b = n.target;
      if (!(Fa.includes(b == null ? void 0 : b.tagName) || b != null && b.isContentEditable)) {
        if ((n.metaKey || n.ctrlKey) && n.key.toLowerCase() === "z") {
          n.preventDefault(), p == null || p();
          return;
        }
        if (!(n.metaKey || n.ctrlKey || n.altKey)) {
          if (n.shiftKey) {
            n.key === "ArrowRight" && (n.preventDefault(), i == null || i(1)), n.key === "ArrowLeft" && (n.preventDefault(), i == null || i(-1)), n.key === "?" && (n.preventDefault(), x == null || x());
            return;
          }
          switch (n.key) {
            case "?":
              n.preventDefault(), x == null || x();
              break;
            case "t":
            case "T":
              n.preventDefault(), a == null || a();
              break;
            case "m":
            case "M":
              n.preventDefault(), t == null || t("month");
              break;
            case "w":
            case "W":
              n.preventDefault(), t == null || t("week");
              break;
            case "d":
            case "D":
              n.preventDefault(), t == null || t("day");
              break;
            case "a":
            case "A":
              n.preventDefault(), t == null || t("agenda");
              break;
            case "PageUp":
              n.preventDefault(), s == null || s();
              break;
            case "PageDown":
              n.preventDefault(), r == null || r();
              break;
          }
        }
      }
    };
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, [d, t, a, s, r, i, p, x]);
}
function Ba({ from: t, to: a, enabled: s }) {
  const r = T(t), i = T(a);
  return W({
    queryKey: ["calendar", "team-load", r, i],
    queryFn: () => K.get(`/api/app/calendar/team-load?From=${r}&To=${i}`),
    enabled: s,
    staleTime: 6e4
  });
}
const ut = "apya.calendar.offlineQueue";
function we() {
  try {
    const t = window.localStorage.getItem(ut), a = t ? JSON.parse(t) : [];
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}
function Ve(t) {
  try {
    window.localStorage.setItem(ut, JSON.stringify(t));
  } catch {
  }
}
function qa({ onFlush: t }) {
  const [a, s] = g.useState(() => typeof navigator > "u" ? !0 : navigator.onLine), [r, i] = g.useState(() => we().length), p = g.useRef(!1), x = g.useCallback((m) => {
    const b = we().filter((l) => l.key !== m.key).concat(m);
    Ve(b), i(b.length);
  }, []), d = g.useCallback(async () => {
    if (p.current) return;
    const m = we();
    if (m.length !== 0) {
      p.current = !0;
      try {
        const n = [];
        for (const b of m)
          try {
            await t(b);
          } catch {
            n.push(b);
          }
        Ve(n), i(n.length);
      } finally {
        p.current = !1;
      }
    }
  }, [t]);
  return g.useEffect(() => {
    const m = () => {
      s(!0), d();
    }, n = () => s(!1);
    return window.addEventListener("online", m), window.addEventListener("offline", n), navigator.onLine && d(), () => {
      window.removeEventListener("online", m), window.removeEventListener("offline", n);
    };
  }, [d]), { isOnline: a, pendingCount: r, enqueue: x, flush: d };
}
function Ga() {
  const t = g.useRef(null), [a, s] = g.useState(0);
  return g.useLayoutEffect(() => {
    const r = t.current;
    if (!r || (s(r.getBoundingClientRect().width), typeof ResizeObserver > "u")) return;
    const i = new ResizeObserver((p) => {
      for (const x of p)
        s(x.contentRect.width);
    });
    return i.observe(r), () => i.disconnect();
  }, []), [t, a];
}
function Ya(t) {
  return t === 0 || t >= 1180 ? "wide" : t >= 780 ? "medium" : "narrow";
}
const Ua = 60;
function be(t, a, s) {
  return a === "week" ? L(t, 7 * s) : a === "day" ? L(t, s) : new Date(t.getFullYear(), t.getMonth() + s, 1);
}
function Qa() {
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Array.from({ length: 7 }, (t, a) => /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-2", children: /* @__PURE__ */ e.jsx(ie, { height: 10 }) }, a)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: Array.from({ length: $e }, (t, a) => /* @__PURE__ */ e.jsxs("div", { className: "min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0", children: [
      /* @__PURE__ */ e.jsx(ie, { height: 12, width: "40%", className: "ml-auto" }),
      a % 3 === 0 && /* @__PURE__ */ e.jsx(ie, { height: 14, className: "mt-2" })
    ] }, a)) })
  ] });
}
function Ha() {
  var Le, Fe, _e, Be, qe;
  const [t, a] = Ga(), s = Ya(a), r = s === "narrow", i = g.useMemo(() => De(/* @__PURE__ */ new Date()), []), [p, x] = g.useState(i), [d, m] = g.useState(null), [n, b] = g.useState(null), [l, c] = g.useState(!1), [o, f] = g.useState(!1), [u, h] = g.useState(!1), [N, $] = g.useState(!1), [E, j] = g.useState(null), [y, z] = g.useState(!1), { view: S, setView: C, applyResponsiveDefault: M, enabledSources: V, toggleSource: ye, resetSources: X } = Ia();
  g.useEffect(() => {
    a !== 0 && M(r ? "agenda" : "month");
  }, [a, r, M]);
  const { range: F, title: ae, weekDayList: te } = g.useMemo(() => {
    if (S === "agenda")
      return {
        range: { from: L(i, -60), to: L(i, Ua) },
        title: "Ajanda",
        weekDayList: null
      };
    if (S === "week") {
      const R = At(p);
      return {
        range: { from: R[0], to: R[6] },
        title: `${w.dayShort(R[0])} – ${w.dayShort(R[6])} ${R[6].getFullYear()}`,
        weekDayList: R
      };
    }
    if (S === "day") {
      const R = De(p);
      return { range: { from: R, to: R }, title: w.dayTitle(R), weekDayList: [R] };
    }
    const v = tt(p);
    return {
      range: { from: v, to: L(v, $e - 1) },
      title: w.monthTitle(p),
      weekDayList: null
    };
  }, [S, p, i]), { data: D, isPending: U, isError: xt, refetch: pt } = Aa(F), q = La(F), ze = ya(), ke = Ba({ from: F.from, to: F.to, enabled: y }), B = qa({
    onFlush: (v) => K.post("/api/app/calendar/reschedule-item", v.payload)
  }), ue = g.useMemo(
    () => {
      var v;
      return [...(D == null ? void 0 : D.items) ?? [], ...((v = q.data) == null ? void 0 : v.items) ?? []];
    },
    [D, q.data]
  ), Q = g.useMemo(
    () => ue.filter((v) => V.has(v.source)),
    [ue, V]
  ), G = g.useMemo(() => st(Q), [Q]), Y = (D == null ? void 0 : D.dailyCapacityHours) ?? null, Ke = g.useMemo(() => {
    const v = {};
    for (const R of (D == null ? void 0 : D.sources) ?? []) v[R.source] = R.count;
    return v;
  }, [D]), mt = g.useMemo(() => Y ? Object.values(G).filter((v) => ge(v) > Y).length : 0, [G, Y]), Ie = g.useMemo(() => {
    var Ge;
    let v = 0, R = 0;
    for (const re of Q)
      re.isDone || (re.risk === O.OVERDUE ? v++ : re.risk === O.DUE_TODAY && R++);
    const J = (((Ge = q.data) == null ? void 0 : Ge.accounts) ?? []).filter((re) => re.error).length;
    return { overdue: v, dueToday: R, syncError: J };
  }, [Q, q.data]), Oe = g.useMemo(
    () => ((D == null ? void 0 : D.sources) ?? []).filter((v) => v.isAvailable),
    [D]
  ), bt = g.useMemo(
    () => Oe.filter((v) => !V.has(v.source)).length,
    [Oe, V]
  ), ft = g.useMemo(() => {
    var R;
    const v = (((R = q.data) == null ? void 0 : R.accounts) ?? []).map((J) => J.lastSyncTime).filter(Boolean).sort();
    return v.length ? v[v.length - 1] : null;
  }, [q.data]);
  g.useEffect(() => {
    d && !G[d] && !U && (d >= T(F.from) && d <= T(F.to) || m(null));
  }, [d, G, U, F]);
  const xe = g.useCallback((v) => b(v.key), []), Pe = g.useCallback(() => {
    x(i), m(T(i));
  }, [i]), I = Ma({ onOfflineFailure: B.enqueue }), ht = g.useCallback((v) => {
    const R = E ?? d;
    if (R)
      for (const J of G[R] ?? [])
        J.canReschedule && !J.isDone && I.reschedule(J, L(/* @__PURE__ */ new Date("T00:00:00"), v));
  }, [E, d, G, I]);
  _a({
    onView: C,
    onToday: Pe,
    onPrev: () => x((v) => be(v, S, -1)),
    onNext: () => x((v) => be(v, S, 1)),
    onDeferSelected: ht,
    onUndo: () => {
      var v, R;
      return (R = (v = I.lastAction) == null ? void 0 : v.undo) == null ? void 0 : R.call(v);
    },
    onToggleHelp: () => $((v) => !v)
  });
  const Me = ue.length > 0, gt = Me && Q.length === 0, yt = d ? G[d] ?? [] : [], se = n ? ue.find((v) => v.key === n) ?? null : null, ve = d && /* @__PURE__ */ e.jsx(
    Mt,
    {
      dayKey: d,
      items: yt,
      capacity: Y,
      onSelectItem: xe,
      onClose: () => m(null)
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { ref: t, className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsx(
      Xt,
      {
        title: ae,
        view: S,
        onView: C,
        onPrev: () => x((v) => be(v, S, -1)),
        onNext: () => x((v) => be(v, S, 1)),
        onToday: Pe,
        overloadDays: mt,
        onHelp: () => $(!0),
        filterCount: bt,
        onClearFilters: X,
        lastSyncAt: ft,
        syncError: Ie.syncError > 0,
        compact: r
      }
    ),
    xt && /* @__PURE__ */ e.jsxs("div", { className: "rounded-card border border-negative-100 bg-negative-50 px-3 py-2.5 text-[12.5px] text-negative-700", children: [
      "Takvim yüklenemedi.",
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => pt(), className: "ml-2 font-semibold underline", children: "Yeniden dene" })
    ] }),
    (!B.isOnline || B.pendingCount > 0) && /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        className: "flex items-center gap-2 rounded-card border border-warning-100 bg-warning-50 px-3 py-2 text-[12.5px] text-warning-700",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: k("fa", B.isOnline ? "fa-cloud-arrow-up" : "fa-wifi"), "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: B.isOnline ? `${B.pendingCount} değişiklik gönderiliyor…` : `Çevrimdışısınız — ${B.pendingCount} değişiklik kuyrukta, bağlantı gelince gönderilecek.` }),
          B.isOnline && B.pendingCount > 0 && /* @__PURE__ */ e.jsx("button", { type: "button", onClick: B.flush, className: "font-semibold underline", children: "Şimdi gönder" })
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
      !r && /* @__PURE__ */ e.jsx("div", { className: k("shrink-0", s === "wide" ? "w-[240px]" : "w-auto"), children: /* @__PURE__ */ e.jsx(
        Qt,
        {
          sources: (D == null ? void 0 : D.sources) ?? [],
          counts: Ke,
          enabled: V,
          onToggle: ye,
          compact: s !== "wide",
          externalAccounts: ((Le = q.data) == null ? void 0 : Le.accounts) ?? [],
          externalLoading: q.isFetching,
          onOpenSync: () => c(!0),
          teamOpen: y,
          onToggleTeam: () => z((v) => !v),
          teamContent: y ? /* @__PURE__ */ e.jsx(
            $a,
            {
              rows: ke.data,
              days: te,
              capacity: Y,
              loading: ke.isPending
            }
          ) : null,
          teamMembers: ke.data ?? [],
          riskCounts: Ie
        }
      ) }),
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        U ? /* @__PURE__ */ e.jsx(Qa, {}) : gt ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
          de,
          {
            icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-filter-circle-xmark" }),
            title: "Bu filtreyle gösterilecek öğe yok",
            description: "Kaynak rayında kapattığınız türler bu aralıktaki tüm öğeleri gizliyor.",
            action: /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "outline", onClick: X, children: "Kaynakları aç" })
          }
        ) }) : Me ? S === "month" ? /* @__PURE__ */ e.jsx(
          Gt,
          {
            month: p,
            byDay: G,
            today: i,
            capacity: Y,
            selectedDay: d,
            onSelectItem: xe,
            onSelectDay: m,
            onDropItem: I.reschedule,
            focusedDay: E,
            onFocusDay: j,
            onNavigate: (v) => x(v),
            pending: I.pending,
            errors: I.errors
          }
        ) : te ? /* @__PURE__ */ e.jsx(
          ta,
          {
            days: te,
            byDay: G,
            today: i,
            capacity: Y,
            selectedDay: d,
            onSelectItem: xe,
            onSelectDay: m
          }
        ) : /* @__PURE__ */ e.jsx(
          Pt,
          {
            items: Q,
            today: i,
            onSelectItem: xe,
            onSmartDefer: () => f(!0)
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
          de,
          {
            icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
            title: "Bu aralıkta planlanmış bir şey yok",
            description: "Son tarihi olan görevler, fatura vadeleri, hibe son tarihleri ve tarihli finans kayıtları burada birlikte görünür.",
            action: /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "outline", onClick: () => {
              window.location.href = "/Tasks";
            }, children: "Görev oluştur" })
          }
        ) }),
        !U && S !== "agenda" && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[10.5px] text-text-tertiary", children: [
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
      s === "wide" && d && /* @__PURE__ */ e.jsx("div", { className: "w-[340px] shrink-0 self-stretch", children: ve })
    ] }),
    s === "medium" && d && /* @__PURE__ */ e.jsx(oe, { open: !0, onOpenChange: (v) => {
      v || m(null);
    }, children: /* @__PURE__ */ e.jsx(ce, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: ve }) }),
    r && d && /* @__PURE__ */ e.jsx(oe, { open: !0, onOpenChange: (v) => {
      v || m(null);
    }, children: /* @__PURE__ */ e.jsx(ce, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: ve }) }),
    r && /* @__PURE__ */ e.jsx(Vt, {}),
    /* @__PURE__ */ e.jsx(
      Ea,
      {
        items: Q,
        month: p,
        today: i,
        generatedAt: w.dayShort(i)
      }
    ),
    /* @__PURE__ */ e.jsx(Da, { open: N, onClose: () => $(!1) }),
    /* @__PURE__ */ e.jsx(
      Ca,
      {
        polite: ((Fe = I.lastAction) == null ? void 0 : Fe.message) ?? "",
        assertive: ((qe = (Be = (_e = q.data) == null ? void 0 : _e.accounts) == null ? void 0 : Be.find((v) => v.error)) == null ? void 0 : qe.error) ?? ""
      }
    ),
    /* @__PURE__ */ e.jsx(ga, { open: l, onClose: () => c(!1) }),
    /* @__PURE__ */ e.jsx(
      ja,
      {
        open: o,
        items: Q,
        today: i,
        capacity: Y,
        onClose: () => f(!1)
      }
    ),
    /* @__PURE__ */ e.jsx(
      wa,
      {
        open: ze.data ? !ze.data.setupCompleted && !u : !1,
        counts: Ke,
        onDone: () => h(!0)
      }
    ),
    se && /* @__PURE__ */ e.jsx(
      ra,
      {
        item: se,
        capacity: Y,
        onClose: () => b(null),
        onReschedule: I.reschedule,
        onComplete: I.complete,
        isPending: !!I.pending[se.key],
        error: I.errors[se.key],
        onRetry: () => I.clearError(se.key)
      }
    )
  ] });
}
const Xe = document.getElementById("apya-calendar-root");
Xe && kt(Xe).render(
  /* @__PURE__ */ e.jsx(vt, { children: /* @__PURE__ */ e.jsx(jt, { children: /* @__PURE__ */ e.jsx(Nt, { children: /* @__PURE__ */ e.jsx(Ha, {}) }) }) })
);
