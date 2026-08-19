import { j as e, d as de, r as g, b as it } from "./react-vendor.js";
import { c as y, B as A, d as ne, e as ie, S as se, D as Le, i as qe, T as lt } from "./Dialog.js";
import { D as ot } from "./useDeviceMode.js";
import { a as ct } from "./QueryProvider.js";
import { E as le } from "./EmptyState.js";
import { u as Z, a as Q, b as B } from "./query-vendor.js";
import { a as P } from "./httpClient.js";
/* empty css      */
const M = {
  1: { key: "task", label: "Görev", plural: "görev", icon: "fa-circle-check" },
  2: { key: "invoice", label: "Fatura", plural: "fatura", icon: "fa-file-invoice" },
  3: { key: "grant", label: "Hibe", plural: "hibe", icon: "fa-award" },
  4: { key: "expense", label: "Gider", plural: "gider", icon: "fa-arrow-trend-down" },
  5: { key: "income", label: "Gelir", plural: "gelir", icon: "fa-arrow-trend-up" },
  6: { key: "cash", label: "Kasa hareketi", plural: "kasa hareketi", icon: "fa-wallet" },
  7: { key: "external", label: "Dış etkinlik", plural: "dış etkinlik", icon: "fa-calendar-days" }
}, re = [1, 2, 3, 4, 5, 6, 7], ve = [1, 2, 3, 4, 5, 6], O = { DUE_TODAY: 1, OVERDUE: 2 }, dt = (t) => t.risk === O.OVERDUE || t.risk === O.DUE_TODAY, Ue = 864e5, je = (t) => new Date(t.getFullYear(), t.getMonth(), t.getDate()), _ = (t, a) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + a);
function D(t) {
  const a = (s) => (s < 10 ? "0" : "") + s;
  return `${t.getFullYear()}-${a(t.getMonth() + 1)}-${a(t.getDate())}`;
}
function Se(t) {
  const a = (t.getDay() + 6) % 7;
  return new Date(t.getTime() - a * Ue);
}
const Qe = (t) => Se(new Date(t.getFullYear(), t.getMonth(), 1)), De = 42;
function He(t) {
  const a = Qe(t);
  return Array.from({ length: De }, (s, r) => new Date(a.getTime() + r * Ue));
}
const ut = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }), xt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }), mt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }), j = {
  monthTitle: (t) => ut.format(t),
  dayTitle: (t) => xt.format(t),
  dayShort: (t) => mt.format(t),
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
function We(t) {
  const a = {};
  for (const s of t ?? []) {
    const r = (s.date || "").slice(0, 10);
    r && (a[r] ?? (a[r] = [])).push(s);
  }
  return a;
}
const be = (t) => (t ?? []).reduce((a, s) => a + (s.loadHours ?? 0), 0);
function pt(t, { maxPills: a = 3, maxRiskPills: s = 2 } = {}) {
  const r = t ?? [];
  if (r.length === 0) return { pills: [], summaries: [] };
  if (r.length <= a) return { pills: r, summaries: [] };
  const u = r.filter(dt).slice(0, s), c = new Set(u.map((i) => i.key)), x = /* @__PURE__ */ new Map();
  for (const i of r) {
    if (c.has(i.key)) continue;
    const n = x.get(i.source) ?? { source: i.source, count: 0, amount: 0, hasAmount: !1, only: null };
    n.count += 1, n.only = n.count === 1 ? i : null, i.amount != null && (n.amount += i.amount, n.hasAmount = !0), x.set(i.source, n);
  }
  const f = [];
  for (const i of re) {
    const n = x.get(i);
    n && (n.count === 1 && n.only ? u.push(n.only) : f.push(n));
  }
  return { pills: u, summaries: f };
}
function bt(t, { compact: a = !0 } = {}) {
  const s = M[t.source], r = `${t.count} ${s ? s.plural : "öğe"}`;
  if (!t.hasAmount) return r;
  const l = a ? j.moneyCompact(t.amount) : j.money(t.amount);
  return `${r} · ${l}`;
}
function Ve(t, a) {
  const s = D(a), r = (t ?? []).filter((f) => !f.isDone), l = r.filter((f) => f.date.slice(0, 10) < s && f.risk === O.OVERDUE), u = r.filter((f) => f.date.slice(0, 10) >= s), c = We(u), x = Object.keys(c).sort().map((f) => ({
    key: f,
    date: /* @__PURE__ */ new Date(`${f}T00:00:00`),
    isToday: f === s,
    items: c[f]
  }));
  return { overdue: l, days: x };
}
function ft(t) {
  const a = Se(je(t));
  return Array.from({ length: 7 }, (s, r) => _(a, r));
}
const ht = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }), ye = (t) => t ? ht.format(new Date(t)) : "";
function me(t) {
  const a = new Date(t);
  return a.getHours() * 60 + a.getMinutes();
}
function gt(t) {
  let a = 8, s = 18;
  for (const r of t ?? [])
    r.startTime && (a = Math.min(a, Math.floor(me(r.startTime) / 60)), s = Math.max(s, Math.ceil(me(r.endTime ?? r.startTime) / 60)));
  return { start: Math.max(0, a), end: Math.min(24, Math.max(s, a + 4)) };
}
const Me = (t) => !!t.startTime, Fe = (t) => t.getDay() === 0 || t.getDay() === 6;
function yt(t, { today: a, capacity: s = null, horizonDays: r = 21, fallbackPerDay: l = 3 } = {}) {
  const u = D(a), c = (t ?? []).filter((b) => !b.isDone), x = c.filter((b) => b.date.slice(0, 10) < u && b.risk === O.OVERDUE), f = x.filter((b) => b.canReschedule), i = x.filter((b) => !b.canReschedule), n = {}, p = {};
  for (const b of c) {
    const d = b.date.slice(0, 10);
    d < u || (n[d] = (n[d] ?? 0) + (b.loadHours ?? 0), p[d] = (p[d] ?? 0) + 1);
  }
  const o = [];
  let m = 0;
  for (const b of f) {
    let d = null;
    for (; m < r; ) {
      const w = _(a, m);
      if (Fe(w)) {
        m += 1;
        continue;
      }
      const S = D(w), I = n[S] ?? 0, $ = p[S] ?? 0, k = b.loadHours ?? 0;
      if (s ? I + k <= s : $ < l) {
        n[S] = I + k, p[S] = $ + 1, d = w;
        break;
      }
      m += 1;
    }
    if (!d) {
      let w = _(a, r);
      for (; Fe(w); ) w = _(w, 1);
      d = w;
    }
    o.push({ item: b, date: d });
  }
  return { suggestions: o, fixed: i };
}
const kt = {
  [O.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [O.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function Ne({ item: t, onSelect: a, showDate: s = !1 }) {
  const r = M[t.source], l = kt[t.risk];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => a(t),
      className: y(
        "flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left transition-colors duration-fast",
        "hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      ),
      children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-neutral-subtle text-[10px] text-text-tertiary",
            "aria-hidden": "true",
            children: r && /* @__PURE__ */ e.jsx("i", { className: y("fa", r.icon) })
          }
        ),
        /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("span", { className: y("block truncate text-[13px] font-semibold text-text-primary", t.isDone && "line-through opacity-65"), children: t.title }),
          /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block truncate text-[11.5px] text-text-tertiary", children: [
            s ? j.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
            t.subtitle,
            t.assigneeName,
            t.amount != null ? j.money(t.amount, t.currency) : null
          ].filter(Boolean).join(" · ") || (r ? r.label : "") })
        ] }),
        l && /* @__PURE__ */ e.jsx("span", { className: y("shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold", l.className), children: l.label })
      ]
    }
  );
}
function vt({ items: t, today: a, onSelectItem: s, onSmartDefer: r }) {
  const { overdue: l, days: u } = Ve(t, a);
  return l.length === 0 && u.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
    le,
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
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: l.map((c) => /* @__PURE__ */ e.jsx(Ne, { item: c, onSelect: s, showDate: !0 }, c.key)) })
    ] }),
    u.map((c) => /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: y(
        "flex items-center justify-between border-b border-subtle px-3 py-2",
        c.isToday && "border-b-accent"
      ), children: [
        /* @__PURE__ */ e.jsxs("span", { className: y(
          "text-[11px] font-bold uppercase tracking-wider",
          c.isToday ? "text-accent" : "text-text-tertiary"
        ), children: [
          j.dayTitle(c.date),
          c.isToday ? " · Bugün" : ""
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: c.items.length })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: c.items.map((x) => /* @__PURE__ */ e.jsx(Ne, { item: x, onSelect: s }, x.key)) })
    ] }, c.key))
  ] });
}
function jt({ dayKey: t, items: a, capacity: s, onSelectItem: r, onClose: l }) {
  const u = /* @__PURE__ */ new Date(`${t}T00:00:00`), c = be(a), x = s && c > s, f = a.reduce((i, n) => (i[n.source] = (i[n.source] ?? 0) + 1, i), {});
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: j.dayTitle(u) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(f).length === 0 ? "Planlanmış öğe yok" : Object.entries(f).map(([i, n]) => {
          var p;
          return `${n} ${((p = M[i]) == null ? void 0 : p.plural) ?? "öğe"}`;
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
    s && c > 0 && /* @__PURE__ */ e.jsxs("div", { className: y(
      "flex items-center justify-between border-b px-3 py-2 text-[11.5px]",
      x ? "border-negative-100 bg-negative-50 text-negative-700" : "border-subtle text-text-secondary"
    ), children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-semibold", children: x ? "Kapasite aşımı" : "Gün yükü" }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono tabular-nums", children: [
        j.hours(c),
        " / ",
        j.hours(s)
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "flex-1 overflow-y-auto p-1", children: a.length === 0 ? /* @__PURE__ */ e.jsx(
      le,
      {
        compact: !0,
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-day" }),
        title: "Bu gün boş",
        description: "Bu güne düşen bir öğe yok."
      }
    ) : a.map((i) => /* @__PURE__ */ e.jsx(Ne, { item: i, onSelect: r }, i.key)) })
  ] });
}
const Nt = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], wt = {
  [O.OVERDUE]: {
    pill: "bg-negative-50 text-negative-700",
    /* çapraz tarama */
    pattern: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,.07) 3px, rgba(0,0,0,.07) 5px)"
  },
  [O.DUE_TODAY]: {
    pill: "bg-warning-50 text-warning-700",
    /* dikey çizgi */
    pattern: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,.06) 4px, rgba(0,0,0,.06) 5px)"
  }
};
function St({ item: t, onSelect: a, onDragStart: s, isPending: r, hasError: l }) {
  const u = M[t.source], c = wt[t.risk], x = t.canReschedule && !t.isDone;
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: x,
      onDragStart: x ? (f) => {
        f.stopPropagation(), f.dataTransfer.effectAllowed = "move", f.dataTransfer.setData("text/plain", t.key), s(t);
      } : void 0,
      onClick: (f) => {
        f.stopPropagation(), a(t);
      },
      title: t.subtitle ? `${t.title} — ${t.subtitle}` : t.title,
      style: c ? { backgroundImage: c.pattern } : void 0,
      className: y(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        c ? c.pill : "bg-neutral-subtle text-text-primary",
        t.isDone && "line-through opacity-65",
        x && "cursor-grab active:cursor-grabbing",
        /* Hata SATIRDA kalır — toast'a kaçmaz. */
        l && "ring-1 ring-negative-500",
        r && "opacity-60"
      ),
      children: [
        r ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin shrink-0 text-[9px]", "aria-hidden": "true" }) : u && /* @__PURE__ */ e.jsx("i", { className: y("fa shrink-0 text-[9px] opacity-70", u.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: t.title }),
        l && /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation ms-auto shrink-0 text-[9px]", "aria-hidden": "true" })
      ]
    }
  );
}
function Dt({ summary: t, onSelect: a }) {
  const s = M[t.source];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: (r) => {
        r.stopPropagation(), a(t.source);
      },
      className: y(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left",
        "text-[10.5px] font-medium text-text-secondary hover:bg-surface-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      ),
      children: [
        s && /* @__PURE__ */ e.jsx("i", { className: y("fa shrink-0 text-[9px] opacity-60", s.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: bt(t) })
      ]
    }
  );
}
function Ct({ load: t, capacity: a }) {
  if (!a || t <= 0) return null;
  const s = Math.min(t / a, 1), r = t > a;
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "mt-auto flex h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle",
      title: `Gün yükü ${j.hours(t)} / kapasite ${j.hours(a)}`,
      "aria-label": `Gün yükü ${j.hours(t)}, kapasite ${j.hours(a)}`,
      children: /* @__PURE__ */ e.jsx(
        "span",
        {
          className: y("h-full", r ? "bg-negative" : "bg-accent"),
          style: { width: `${s * 100}%` }
        }
      )
    }
  );
}
function Tt({
  month: t,
  byDay: a,
  today: s,
  capacity: r,
  onSelectItem: l,
  onSelectDay: u,
  selectedDay: c,
  onDropItem: x,
  pending: f = {},
  errors: i = {},
  focusedDay: n,
  onFocusDay: p,
  onNavigate: o
}) {
  const m = He(t), b = D(s), [d, w] = de.useState(null), [S, I] = de.useState(null), $ = de.useRef(null), k = n ?? c ?? b, h = (C) => {
    const N = addDays(/* @__PURE__ */ new Date(`${k}T00:00:00`), C);
    m.some((F) => D(F) === D(N)) || o == null || o(N), p == null || p(D(N));
  }, z = (C) => {
    const N = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[C.key];
    if (N) {
      C.preventDefault(), h(N);
      return;
    }
    (C.key === "Enter" || C.key === " ") && (C.preventDefault(), u(k));
  };
  return de.useEffect(() => {
    var N, F;
    const C = (N = $.current) == null ? void 0 : N.querySelector(`[data-day="${k}"]`);
    C && ((F = $.current) != null && F.contains(document.activeElement)) && C.focus();
  }, [k]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Nt.map((C, N) => /* @__PURE__ */ e.jsx(
      "div",
      {
        className: y(
          "px-2.5 py-2 text-right text-[10.5px] font-bold uppercase tracking-wider",
          N > 4 ? "text-text-tertiary opacity-70" : "text-text-tertiary"
        ),
        children: C
      },
      C
    )) }),
    /* @__PURE__ */ e.jsx(
      "div",
      {
        ref: $,
        role: "grid",
        "aria-label": "Ay takvimi",
        tabIndex: 0,
        onKeyDown: z,
        className: "grid grid-cols-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
        children: m.map((C) => {
          const N = D(C), F = a[N] ?? [], { pills: fe, summaries: q } = pt(F), H = be(F), W = C.getMonth() !== t.getMonth(), E = N === b, V = N === c;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              role: "gridcell",
              "data-day": N,
              tabIndex: N === k ? 0 : -1,
              "aria-selected": V,
              "aria-label": `${j.dayTitle(C)}${F.length ? `, ${F.length} öğe` : ", boş"}`,
              onClick: () => {
                p == null || p(N), u(N);
              },
              onDragOver: d ? (K) => {
                K.preventDefault(), K.dataTransfer.dropEffect = "move", S !== N && I(N);
              } : void 0,
              onDragLeave: d ? () => I((K) => K === N ? null : K) : void 0,
              onDrop: d ? (K) => {
                K.preventDefault();
                const J = d;
                w(null), I(null), J && J.date.slice(0, 10) !== N && x(J, /* @__PURE__ */ new Date(`${N}T00:00:00`));
              } : void 0,
              className: y(
                "flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5",
                "transition-colors duration-fast last:border-r-0 hover:bg-surface-hover",
                W ? "bg-surface-sunken" : "bg-surface-base",
                V && "ring-2 ring-inset ring-border-focus",
                S === N && "bg-primary-subtle ring-2 ring-inset ring-accent"
              ),
              children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                  H > 0 && r && H > r && /* @__PURE__ */ e.jsx("span", { className: "rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: j.hours(H) }),
                  /* @__PURE__ */ e.jsx(
                    "span",
                    {
                      className: y(
                        "ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11.5px] font-semibold leading-none tabular-nums",
                        E && "bg-accent text-white",
                        !E && W && "text-text-tertiary opacity-60",
                        !E && !W && "text-text-secondary"
                      ),
                      children: C.getDate()
                    }
                  )
                ] }),
                fe.map((K) => /* @__PURE__ */ e.jsx(
                  St,
                  {
                    item: K,
                    onSelect: l,
                    onDragStart: w,
                    isPending: !!f[K.key],
                    hasError: !!i[K.key]
                  },
                  K.key
                )),
                q.map((K) => /* @__PURE__ */ e.jsx(
                  Dt,
                  {
                    summary: K,
                    onSelect: () => u(N)
                  },
                  `${N}-${K.source}`
                )),
                /* @__PURE__ */ e.jsx(Ct, { load: H, capacity: r })
              ]
            },
            N
          );
        })
      }
    )
  ] });
}
const Et = { 1: "Google", 2: "Outlook", 3: "iCloud" };
function Rt({
  sources: t,
  counts: a,
  enabled: s,
  onToggle: r,
  compact: l = !1,
  externalAccounts: u = [],
  externalLoading: c = !1,
  onOpenSync: x
}) {
  const f = (t ?? []).filter((i) => i.isAvailable);
  return f.length === 0 ? null : /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Takvim kaynakları",
      className: y(
        "flex flex-col gap-1 rounded-card border border-subtle bg-surface-base p-2",
        l ? "w-[60px] items-center" : "w-full"
      ),
      children: [
        !l && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Kaynaklar" }),
        f.map((i) => {
          const n = M[i.source];
          if (!n) return null;
          const p = s.has(i.source), o = a[i.source] ?? 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": p,
              title: l ? `${n.label} — ${o} öğe` : void 0,
              onClick: () => r(i.source),
              className: y(
                "group flex items-center rounded-md text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                l ? "relative h-11 w-11 justify-center" : "gap-2.5 px-2 py-2",
                p ? "text-text-primary" : "text-text-tertiary",
                "hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: y(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px]",
                      p ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: y("fa", n.icon) })
                  }
                ),
                l ? o > 0 && /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: y(
                      "absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-[9.5px] font-bold leading-4",
                      p ? "bg-accent text-white" : "bg-neutral-200 text-text-tertiary"
                    ),
                    children: o
                  }
                ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                  /* @__PURE__ */ e.jsx("span", { className: y("flex-1 truncate text-[12.5px] font-medium", !p && "line-through decoration-1"), children: n.label }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: o })
                ] })
              ]
            },
            i.source
          );
        }),
        !l && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex items-center justify-between border-t border-subtle px-2 pb-1 pt-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Dış takvimler" }),
            x && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: x,
                className: "rounded p-1 text-[11px] font-medium text-text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                children: "Ayarlar"
              }
            )
          ] }),
          u.length === 0 && !c && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 text-[11.5px] text-text-tertiary", children: "Bağlı takvim yok." }),
          c && u.length === 0 && /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1 text-[11.5px] text-text-tertiary", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
            "senkronize ediliyor…"
          ] }),
          u.map((i) => /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: y(
                "flex items-start gap-2 rounded-md px-2 py-1.5",
                i.error && "bg-negative-50"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: y(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px]",
                      i.error ? "bg-negative-100 text-negative-700" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: y("fa", i.error ? "fa-triangle-exclamation" : "fa-calendar-days") })
                  }
                ),
                /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: Et[i.provider] ?? "Takvim" }),
                  /* @__PURE__ */ e.jsx("span", { className: y(
                    "block truncate text-[10.5px]",
                    i.error ? "text-negative-700" : "text-text-tertiary"
                  ), children: i.error ?? `${i.email} · ${i.eventCount} etkinlik` }),
                  i.error && /* @__PURE__ */ e.jsx("a", { href: "/Calendars", className: "text-[10.5px] font-semibold text-text-link hover:underline", children: "Yeniden bağla" })
                ] })
              ]
            },
            i.accountId
          ))
        ] })
      ]
    }
  );
}
const At = { month: "Ay", week: "Hafta", day: "Gün", agenda: "Ajanda" };
function $t({ title: t, view: a, onView: s, onPrev: r, onNext: l, onToday: u, overloadDays: c, onHelp: x }) {
  const f = a !== "agenda";
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
          onClick: l,
          "aria-label": "Sonrakine git",
          className: "h-9 w-9 rounded-r-md border border-l-0 border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(A, { variant: "outline", size: "sm", onClick: u, children: "Bugün" }),
    /* @__PURE__ */ e.jsx("h2", { className: "ml-1 text-[17px] font-semibold capitalize tracking-tight text-text-primary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
      c > 0 && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "rounded-md bg-negative-50 px-2 py-1 text-[11.5px] font-semibold text-negative-700",
          title: "Günlük kapasitenizi aşan gün sayısı",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
            c,
            " günde kapasite aşımı"
          ]
        }
      ),
      /* @__PURE__ */ e.jsxs(
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
      x && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: x,
          title: "Klavye kısayolları (?)",
          "aria-label": "Klavye kısayolları",
          className: "h-9 w-9 rounded-md border border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-keyboard", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(At).map(([i, n]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": a === i,
          onClick: () => s(i),
          className: y(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            a === i ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: n
        },
        i
      )) })
    ] })
  ] });
}
const U = 44, Kt = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], zt = {
  [O.OVERDUE]: "bg-negative-50 text-negative-700",
  [O.DUE_TODAY]: "bg-warning-50 text-warning-700"
};
function Ot({ load: t, capacity: a }) {
  if (!a || t <= 0) return null;
  const s = t > a;
  return /* @__PURE__ */ e.jsx("div", { className: "mt-1 h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
    "span",
    {
      className: y("block h-full", s ? "bg-negative" : "bg-accent"),
      style: { width: `${Math.min(t / a, 1) * 100}%` }
    }
  ) });
}
function It({ days: t, byDay: a, today: s, capacity: r, onSelectItem: l, onSelectDay: u, selectedDay: c }) {
  const x = D(s), f = g.useRef(null), [i, n] = g.useState(() => {
    const k = /* @__PURE__ */ new Date();
    return k.getHours() * 60 + k.getMinutes();
  });
  g.useEffect(() => {
    const k = setInterval(() => {
      const h = /* @__PURE__ */ new Date();
      n(h.getHours() * 60 + h.getMinutes());
    }, 6e4);
    return () => clearInterval(k);
  }, []);
  const p = t.map(D), o = {}, m = {};
  for (const k of p) {
    const h = a[k] ?? [];
    o[k] = h.filter(Me), m[k] = h.filter((z) => !Me(z));
  }
  const b = p.flatMap((k) => o[k]), { start: d, end: w } = gt(b), S = Array.from({ length: w - d }, (k, h) => d + h), I = (w - d) * U, $ = p.includes(x) && i >= d * 60 && i <= w * 60;
  return g.useEffect(() => {
    if (!$ || !f.current) return;
    const k = (i - d * 60) / 60 * U;
    f.current.scrollTop = Math.max(0, k - 120);
  }, [$, d]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "grid border-b border-default bg-surface-raised",
        style: { gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))` },
        children: [
          /* @__PURE__ */ e.jsx("div", {}),
          t.map((k) => {
            const h = D(k), z = be(a[h] ?? []), C = h === x;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => u(h),
                className: y(
                  "border-l border-subtle px-2 py-2 text-left transition-colors duration-fast hover:bg-surface-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
                  c === h && "bg-primary-subtle"
                ),
                children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "flex items-baseline gap-1.5", children: [
                    /* @__PURE__ */ e.jsx("span", { className: y(
                      "text-[10.5px] font-bold uppercase tracking-wider",
                      C ? "text-accent" : "text-text-tertiary"
                    ), children: Kt[(k.getDay() + 6) % 7] }),
                    /* @__PURE__ */ e.jsx("span", { className: y(
                      "font-mono text-[13px] font-semibold tabular-nums",
                      C ? "text-accent" : "text-text-primary"
                    ), children: k.getDate() }),
                    r && z > r && /* @__PURE__ */ e.jsx("span", { className: "ms-auto rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: j.hours(z) })
                  ] }),
                  /* @__PURE__ */ e.jsx(Ot, { load: z, capacity: r })
                ]
              },
              h
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
          p.map((k) => /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-[46px] flex-col gap-[3px] border-l border-subtle p-1", children: [
            m[k].slice(0, 4).map((h) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => l(h),
                title: h.title,
                className: y(
                  "flex w-full items-center gap-1 truncate rounded-[5px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                  zt[h.risk] ?? "bg-neutral-subtle text-text-primary",
                  h.isDone && "line-through opacity-65"
                ),
                children: [
                  M[h.source] && /* @__PURE__ */ e.jsx("i", { className: y("fa shrink-0 text-[9px] opacity-70", M[h.source].icon), "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "truncate", children: h.title })
                ]
              },
              h.key
            )),
            m[k].length > 4 && /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => u(k),
                className: "px-1.5 text-left text-[10.5px] font-medium text-text-tertiary hover:text-text-primary",
                children: [
                  "+",
                  m[k].length - 4,
                  " öğe"
                ]
              }
            )
          ] }, k))
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { ref: f, className: "max-h-[520px] overflow-y-auto", children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "relative grid",
          style: {
            gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))`,
            height: `${I}px`
          },
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "relative", children: S.map((k, h) => /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: "absolute right-1.5 -translate-y-1/2 font-mono text-[10px] tabular-nums text-text-tertiary",
                style: { top: `${h * U}px` },
                children: [
                  String(k).padStart(2, "0"),
                  ":00"
                ]
              },
              k
            )) }),
            p.map((k) => /* @__PURE__ */ e.jsxs("div", { className: "relative border-l border-subtle", children: [
              S.map((h, z) => /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "absolute inset-x-0 border-t border-subtle",
                  style: { top: `${z * U}px` }
                },
                h
              )),
              o[k].map((h) => {
                const z = me(h.startTime), C = h.endTime ? me(h.endTime) : z + 60, N = (z - d * 60) / 60 * U, F = Math.max((C - z) / 60 * U, 18);
                return /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => l(h),
                    title: `${h.title} · ${ye(h.startTime)}`,
                    style: {
                      top: `${N}px`,
                      height: `${F}px`,
                      backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(0,0,0,.05) 4px, rgba(0,0,0,.05) 6px)"
                    },
                    className: y(
                      "absolute inset-x-0.5 overflow-hidden rounded-[5px] border-l-2 border-accent bg-primary-subtle",
                      "px-1.5 py-0.5 text-left text-[10.5px] leading-tight text-text-primary",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    ),
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: "block truncate font-semibold", children: h.title }),
                      /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[9.5px] text-text-tertiary", children: [
                        ye(h.startTime),
                        h.endTime ? `–${ye(h.endTime)}` : ""
                      ] })
                    ]
                  },
                  h.key
                );
              }),
              $ && k === x && /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "pointer-events-none absolute inset-x-0 z-10 border-t-2 border-negative",
                  style: { top: `${(i - d * 60) / 60 * U}px` },
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ e.jsx("span", { className: "absolute -left-1 -top-1 h-2 w-2 rounded-full bg-negative" })
                }
              )
            ] }, k))
          ]
        }
      ),
      b.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "border-t border-subtle px-3 py-2 text-[11.5px] text-text-tertiary", children: "Saat ızgarası dış takvim etkinliklerini gösterir. Bağlı bir takvim yoksa boş kalır." })
    ] })
  ] });
}
const Pt = {
  [O.OVERDUE]: { text: "Gecikmiş", cls: "bg-negative-50 text-negative-700" },
  [O.DUE_TODAY]: { text: "Bugün son gün", cls: "bg-warning-50 text-warning-700" }
};
function ae({ label: t, children: a }) {
  return a ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-subtle py-2.5 last:border-b-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11.5px] font-medium text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "min-w-0 text-right text-[12.5px] text-text-primary", children: a })
  ] }) : null;
}
function Mt({ item: t, capacity: a, onClose: s, onReschedule: r, onComplete: l, isPending: u, error: c, onRetry: x }) {
  const [f, i] = g.useState(() => t.date.slice(0, 10)), n = M[t.source], p = Pt[t.risk], o = t.date.slice(0, 10);
  g.useEffect(() => i(o), [o]);
  const m = () => {
    !f || f === o || r(t, /* @__PURE__ */ new Date(`${f}T00:00:00`));
  };
  return /* @__PURE__ */ e.jsx(ne, { open: !0, onOpenChange: (b) => {
    b || s();
  }, children: /* @__PURE__ */ e.jsxs(ie, { side: "right", title: t.title, className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md bg-neutral-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary", children: [
          n && /* @__PURE__ */ e.jsx("i", { className: y("fa text-[10px]", n.icon), "aria-hidden": "true" }),
          n == null ? void 0 : n.label
        ] }),
        p && /* @__PURE__ */ e.jsx("span", { className: y("rounded-md px-2 py-1 text-[11px] font-bold", p.cls), children: p.text }),
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
    c && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-negative-100 bg-negative-50 px-4 py-2.5 text-[12px] text-negative-700", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: c }),
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: x, className: "font-semibold underline", children: "Yeniden dene" })
    ] }),
    u && /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle px-4 py-2 text-[12px] text-text-tertiary", "aria-live": "polite", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "kaydediliyor…"
    ] }),
    t.canReschedule && !t.isDone && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs(A, { size: "sm", variant: "secondary", onClick: () => l(t), children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-check me-1.5", "aria-hidden": "true" }),
        "Tamamla"
      ] }),
      /* @__PURE__ */ e.jsx(
        A,
        {
          size: "sm",
          variant: "outline",
          onClick: () => r(t, _(/* @__PURE__ */ new Date(`${o}T00:00:00`), 1)),
          children: "+1 gün ertele"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-2", children: [
      /* @__PURE__ */ e.jsx(ae, { label: "Son tarih", children: t.canReschedule ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "date",
            value: f,
            onChange: (b) => i(b.target.value),
            className: "rounded-md border border-default bg-surface-base px-2 py-1 text-[12.5px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": "Son tarih"
          }
        ),
        f !== o && /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "primary", onClick: m, children: "Uygula" })
      ] }) : /* @__PURE__ */ e.jsxs("span", { className: "text-text-secondary", children: [
        j.dayTitle(/* @__PURE__ */ new Date(`${o}T00:00:00`)),
        /* @__PURE__ */ e.jsx("span", { className: "ml-1.5 text-text-tertiary", children: "· takvimden değiştirilemez" })
      ] }) }),
      /* @__PURE__ */ e.jsx(ae, { label: "Bağlam", children: t.subtitle }),
      /* @__PURE__ */ e.jsx(ae, { label: "Atanan", children: t.assigneeName }),
      /* @__PURE__ */ e.jsx(ae, { label: "Tutar", children: t.amount != null ? j.money(t.amount, t.currency) : null }),
      /* @__PURE__ */ e.jsx(ae, { label: "Gün yükü", children: t.loadHours != null ? `${j.hours(t.loadHours)}${a ? ` / ${j.hours(a)} kapasite` : ""}` : null })
    ] }),
    t.href && /* @__PURE__ */ e.jsx("footer", { className: "border-t border-subtle px-4 py-3", children: /* @__PURE__ */ e.jsxs(
      "a",
      {
        href: t.href,
        className: "text-[12.5px] font-medium text-text-link hover:underline",
        children: [
          n == null ? void 0 : n.label,
          " ekranında aç",
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right ms-1.5 text-[10px]", "aria-hidden": "true" })
        ]
      }
    ) })
  ] }) });
}
const Xe = ["calendar", "sync-settings"];
function Ft(t) {
  return Z({
    queryKey: Xe,
    queryFn: () => P.get("/api/app/calendar/sync-settings"),
    enabled: t,
    staleTime: 3e4
  });
}
function _t() {
  const t = Q();
  return B({
    mutationFn: (a) => P.post("/api/app/calendar/sync-rules", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Xe }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
const Ze = ["calendar", "ical-feed"], Ce = ["calendar", "ical-subscriptions"];
function Yt(t) {
  return Z({
    queryKey: Ze,
    /* GetOrCreate: bağlantı yoksa ilk açılışta üretilir. */
    queryFn: () => P.post("/api/app/ical-feed/ensure", {}),
    enabled: t,
    staleTime: 1 / 0
  });
}
function Bt() {
  const t = Q();
  return B({
    mutationFn: () => P.post("/api/app/ical-feed/regenerate", {}),
    onSuccess: (a) => t.setQueryData(Ze, a)
  });
}
function Gt(t) {
  return Z({
    queryKey: Ce,
    queryFn: () => P.get("/api/app/ical-subscription"),
    enabled: t,
    staleTime: 3e4
  });
}
function Lt() {
  const t = Q();
  return B({
    mutationFn: (a) => P.post("/api/app/ical-subscription", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Ce }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function qt() {
  const t = Q();
  return B({
    mutationFn: (a) => P.delete(`/api/app/ical-subscription/${a}`),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Ce }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function Ut() {
  return B({
    mutationFn: (t) => P.post(`/api/app/ical-subscription/probe?url=${encodeURIComponent(t)}`, {})
  });
}
const Qt = {
  1: { label: "Google Calendar", icon: "fa-google", brand: "bg-[#ea4335]" },
  2: { label: "Microsoft Outlook", icon: "fa-windows", brand: "bg-[#0078d4]" },
  3: { label: "iCloud", icon: "fa-apple", brand: "bg-neutral-700" }
}, Ht = {
  0: { title: "Son değişen kazanır", desc: "İki taraf da düzenlenirse en son yapılan değişiklik uygulanır; ekranda geri alma şeridi çıkar." },
  1: { title: "APYA her zaman kazanır", desc: "Dış takvim salt-okunur ayna olur; dışarıdaki düzenleme geri alınır." }
}, _e = {
  0: { icon: "fa-arrow-up-from-bracket", cls: "text-text-tertiary" },
  1: { icon: "fa-code-merge", cls: "text-warning-700" },
  2: { icon: "fa-triangle-exclamation", cls: "text-negative-700" }
};
function Te(t) {
  if (!t) return "hiç";
  const a = Math.round((Date.now() - new Date(t).getTime()) / 6e4);
  return a < 1 ? "az önce" : a < 60 ? `${a} dk önce` : a < 1440 ? `${Math.round(a / 60)} sa önce` : j.dayShort(new Date(t));
}
function Wt({ account: t, onSave: a, saving: s }) {
  const r = Qt[t.provider] ?? { label: "Takvim", icon: "fa-calendar", brand: "bg-neutral-700" }, [l, u] = g.useState(() => new Set(t.syncSources ?? [])), [c, x] = g.useState(t.conflictRule ?? 0), [f, i] = g.useState(t.isSyncEnabled);
  g.useEffect(() => {
    u(new Set(t.syncSources ?? [])), x(t.conflictRule ?? 0), i(t.isSyncEnabled);
  }, [t]);
  const n = f !== t.isSyncEnabled || c !== t.conflictRule || l.size !== (t.syncSources ?? []).length || [...l].some((o) => !(t.syncSources ?? []).includes(o)), p = (o) => u((m) => {
    const b = new Set(m);
    return b.has(o) ? b.delete(o) : b.add(o), b;
  });
  return /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-3 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: y("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", r.brand), "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("i", { className: y("fab", r.icon) }) }),
      /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-semibold text-text-primary", children: r.label }),
        /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[11.5px] text-text-tertiary", children: [
          t.externalEmail,
          " · son senkron ",
          Te(t.lastSyncTime)
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("label", { className: "flex shrink-0 items-center gap-1.5 text-[11.5px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: f,
            onChange: (o) => i(o.target.checked),
            className: "h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
          }
        ),
        "Açık"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Bu hesaba ne gitsin?" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: ve.map((o) => {
        var b, d;
        const m = l.has(o);
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": m,
            onClick: () => p(o),
            className: y(
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              m ? "border-accent bg-primary-subtle text-accent" : "border-subtle bg-surface-base text-text-tertiary hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: y("fa text-[10px]", (b = M[o]) == null ? void 0 : b.icon), "aria-hidden": "true" }),
              (d = M[o]) == null ? void 0 : d.label
            ]
          },
          o
        );
      }) }),
      l.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-text-tertiary", children: "Hiçbiri seçili değil — yalnız görevler gönderilir." }),
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Çakışma kuralı" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: Object.entries(Ht).map(([o, m]) => {
        const b = Number(o), d = c === b;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => x(b),
            className: y(
              "rounded-md border px-2.5 py-2 text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              d ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("span", { className: y("block text-[12px] font-semibold", d ? "text-accent" : "text-text-primary"), children: m.title }),
              /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] leading-snug text-text-tertiary", children: m.desc })
            ]
          },
          o
        );
      }) }),
      n && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          A,
          {
            size: "sm",
            variant: "primary",
            disabled: s,
            onClick: () => a({
              accountId: t.id,
              isSyncEnabled: f,
              syncSources: [...l],
              syncProjectIds: t.syncProjectIds ?? [],
              conflictRule: c
            }),
            children: s ? "Kaydediliyor…" : "Kuralları kaydet"
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Kaydedilmemiş değişiklik var" })
      ] })
    ] })
  ] });
}
const Vt = [
  { value: 15, label: "15 dk" },
  { value: 60, label: "1 saat" },
  { value: 360, label: "6 saat" },
  { value: 1440, label: "Günlük" }
];
function Xt({ open: t }) {
  var S, I, $, k;
  const a = Yt(t), s = Bt(), r = Gt(t), l = Lt(), u = qt(), c = Ut(), [x, f] = g.useState(""), [i, n] = g.useState(""), [p, o] = g.useState(60), [m, b] = g.useState(!1), d = (S = a.data) != null && S.path ? `${window.location.origin}${a.data.path}` : "", w = async () => {
    try {
      await navigator.clipboard.writeText(d), b(!0), setTimeout(() => b(!1), 2e3);
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
            value: d,
            "aria-label": "iCal abonelik bağlantısı",
            className: "min-w-0 flex-1 truncate rounded-md border border-default bg-surface-sunken px-2 py-1 font-mono text-[11px] text-text-secondary"
          }
        ),
        /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "outline", onClick: w, disabled: !d, children: m ? "Kopyalandı" : "Kopyala" })
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
            value: x,
            onChange: (h) => {
              f(h.target.value), c.reset();
            },
            placeholder: "https://…/basic.ics",
            "aria-label": "Takvim bağlantısı",
            className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          }
        ),
        ((I = c.data) == null ? void 0 : I.isValid) && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-positive-700", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-check me-1", "aria-hidden": "true" }),
          "Bağlantı doğrulandı · ",
          c.data.eventCount,
          " etkinlik bulundu"
        ] }),
        c.data && !c.data.isValid && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-negative-700", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
          c.data.error
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              value: i,
              onChange: (h) => n(h.target.value),
              placeholder: (($ = c.data) == null ? void 0 : $.suggestedName) || "Görünen ad",
              "aria-label": "Görünen ad",
              className: "min-w-0 flex-1 rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              value: p,
              onChange: (h) => o(Number(h.target.value)),
              "aria-label": "Yenileme sıklığı",
              className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
              children: Vt.map((h) => /* @__PURE__ */ e.jsx("option", { value: h.value, children: h.label }, h.value))
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(
            A,
            {
              size: "sm",
              variant: "outline",
              disabled: !x || c.isPending,
              onClick: () => c.mutate(x),
              children: c.isPending ? "Deneniyor…" : "Bağlantıyı dene"
            }
          ),
          /* @__PURE__ */ e.jsx(
            A,
            {
              size: "sm",
              variant: "primary",
              disabled: !x || l.isPending,
              onClick: () => l.mutate(
                { url: x, displayName: i, color: "accent", refreshMinutes: p },
                { onSuccess: () => {
                  f(""), n(""), c.reset();
                } }
              ),
              children: l.isPending ? "Ekleniyor…" : "Takvimi ekle"
            }
          )
        ] }),
        l.isError && /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-negative-700", children: ((k = l.error) == null ? void 0 : k.message) || "Takvim eklenemedi." }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] leading-snug text-text-tertiary", children: [
          "iCal abonelikleri ",
          /* @__PURE__ */ e.jsx("strong", { className: "font-semibold", children: "tek yönlüdür" }),
          ": etkinlikler APYA'da salt-okunur görünür, APYA öğeleri bu takvime yazılmaz. Çift yönlü senkron için Google veya Outlook hesabı bağlayın."
        ] })
      ] }),
      (r.data ?? []).length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 border-t border-subtle pt-2", children: r.data.map((h) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: h.displayName }),
          /* @__PURE__ */ e.jsx("span", { className: y(
            "block truncate text-[10.5px]",
            h.lastError ? "text-negative-700" : "text-text-tertiary"
          ), children: h.lastError ?? `${h.lastEventCount} etkinlik · ${Te(h.lastFetchedAt)} çekildi` })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => u.mutate(h.id),
            className: "shrink-0 rounded p-1 text-[11px] text-text-tertiary hover:text-negative-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": `${h.displayName} aboneliğini kaldır`,
            children: "Kaldır"
          }
        )
      ] }, h.id)) })
    ] })
  ] });
}
function Zt({ open: t, onClose: a }) {
  const { data: s, isPending: r } = Ft(t), l = _t();
  return /* @__PURE__ */ e.jsx(ne, { open: t, onOpenChange: (u) => {
    u || a();
  }, children: /* @__PURE__ */ e.jsxs(ie, { side: "right", title: "Takvim senkronizasyonu", className: "w-full max-w-[440px] p-0", children: [
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
      /* @__PURE__ */ e.jsx(se, { height: 92 }),
      /* @__PURE__ */ e.jsx(se, { height: 92 })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", children: [
      ((s == null ? void 0 : s.accounts) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-4", children: /* @__PURE__ */ e.jsx(
        le,
        {
          compact: !0,
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
          title: "Bağlı hesap yok",
          description: "Google veya Outlook bağlayınca size atanan tarihli öğeler oraya etkinlik olarak yazılır.",
          action: /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "outline", onClick: () => {
            window.location.href = "/Calendars/SimulateAuth?provider=1";
          }, children: "Hesap bağla" })
        }
      ) }) : s.accounts.map((u) => /* @__PURE__ */ e.jsx(
        Wt,
        {
          account: u,
          saving: l.isPending,
          onSave: (c) => l.mutate(c)
        },
        u.id
      )),
      /* @__PURE__ */ e.jsx(Xt, { open: t }),
      /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
        /* @__PURE__ */ e.jsx("header", { className: "border-b border-subtle px-3 py-2", children: /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-semibold text-text-primary", children: "Senkron günlüğü" }) }),
        /* @__PURE__ */ e.jsx("div", { className: "px-3 py-2", children: ((s == null ? void 0 : s.log) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-2 text-[11.5px] text-text-tertiary", children: "Henüz senkron kaydı yok." }) : s.log.map((u) => {
          const c = _e[u.kind] ?? _e[0];
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
            /* @__PURE__ */ e.jsx("i", { className: y("fa mt-0.5 shrink-0 text-[11px]", c.icon, c.cls), "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[11.5px] leading-snug text-text-secondary", children: u.message }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: Te(u.occurredAt) })
          ] }, u.id);
        }) })
      ] })
    ] }) })
  ] }) });
}
const Je = ["calendar", "preferences"];
function Jt() {
  return Z({
    queryKey: Je,
    queryFn: () => P.get("/api/app/calendar/preferences"),
    staleTime: 5 * 6e4
  });
}
function ea() {
  const t = Q();
  return B({
    mutationFn: (a) => P.post("/api/app/calendar/preferences", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Je }), t.invalidateQueries({ queryKey: ["calendar", "feed"] });
    }
  });
}
function ta() {
  const t = Q();
  return B({
    mutationFn: (a) => P.post("/api/app/calendar/bulk-reschedule", a),
    onSettled: () => t.invalidateQueries({ queryKey: ["calendar", "feed"] })
  });
}
function aa({ open: t, items: a, today: s, capacity: r, onClose: l }) {
  const { suggestions: u, fixed: c } = g.useMemo(
    () => yt(a, { today: s, capacity: r }),
    [a, s, r]
  ), [x, f] = g.useState(() => new Set(u.map((d) => d.item.key))), i = ta(), n = i.data ?? [], p = new Map(n.filter((d) => !d.succeeded).map((d) => [d.sourceId, d.error])), o = (d) => f((w) => {
    const S = new Set(w);
    return S.has(d) ? S.delete(d) : S.add(d), S;
  }), m = u.filter((d) => x.has(d.item.key)), b = () => {
    i.mutate(
      m.map((d) => ({
        source: d.item.source,
        sourceId: d.item.sourceId,
        newDate: D(d.date)
      })),
      {
        onSuccess: (d) => {
          (d ?? []).every((w) => w.succeeded) && l();
        }
      }
    );
  };
  return /* @__PURE__ */ e.jsx(ne, { open: t, onOpenChange: (d) => {
    d || l();
  }, children: /* @__PURE__ */ e.jsxs(ie, { side: "right", title: "Akıllı erteleme", className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-semibold text-text-primary", children: "Akıllı erteleme" }),
        /* @__PURE__ */ e.jsxs("p", { className: "mt-0.5 text-[11.5px] leading-snug text-text-tertiary", children: [
          u.length > 0 ? `${u.length} gecikmiş öğe için boş günlere dağıtılmış tarihler önerildi.` : "Ertelenecek gecikmiş öğe yok.",
          r ? ` Günlük kapasite ${j.hours(r)}.` : ""
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
      u.map(({ item: d, date: w }) => {
        const S = p.get(d.sourceId);
        return /* @__PURE__ */ e.jsxs(
          "label",
          {
            className: y(
              "flex cursor-pointer items-start gap-2.5 border-b border-subtle py-2.5 last:border-b-0",
              S && "bg-negative-50"
            ),
            children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: x.has(d.key),
                  onChange: () => o(d.key),
                  className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] font-semibold text-text-primary", children: d.title }),
                /* @__PURE__ */ e.jsxs("span", { className: "mt-0.5 flex items-center gap-1.5 text-[11px] text-text-tertiary", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "line-through", children: j.dayShort(/* @__PURE__ */ new Date(`${d.date.slice(0, 10)}T00:00:00`)) }),
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right text-[9px]", "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-accent", children: j.dayShort(w) }),
                  d.loadHours != null && /* @__PURE__ */ e.jsxs("span", { children: [
                    "· ",
                    j.hours(d.loadHours)
                  ] })
                ] }),
                S && /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] font-medium text-negative-700", children: S })
              ] })
            ]
          },
          d.key
        );
      }),
      c.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 border-t border-subtle pt-2", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Ertelenemez" }),
        c.map((d) => {
          var w;
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 py-1.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock mt-1 shrink-0 text-[10px] text-text-tertiary", "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] text-text-secondary", children: d.title }),
              /* @__PURE__ */ e.jsxs("span", { className: "block text-[11px] text-text-tertiary", children: [
                (w = M[d.source]) == null ? void 0 : w.label,
                " — vadesi takvimden değiştirilemez"
              ] })
            ] })
          ] }, d.key);
        })
      ] })
    ] }),
    u.length > 0 && /* @__PURE__ */ e.jsxs("footer", { className: "flex items-center gap-2 border-t border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsx(
        A,
        {
          size: "sm",
          variant: "primary",
          disabled: m.length === 0 || i.isPending,
          onClick: b,
          children: i.isPending ? "Erteleniyor…" : `${m.length} öğeyi ertele`
        }
      ),
      /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "ghost", onClick: l, children: "Vazgeç" })
    ] })
  ] }) });
}
const sa = [
  { value: 4, label: "4 sa" },
  { value: 6, label: "6 sa" },
  { value: 8, label: "8 sa" },
  { value: 0, label: "Kapalı" }
], ue = ["Kaynaklar", "Dış takvim", "Kurallar"];
function ra({ open: t, counts: a, onDone: s }) {
  const [r, l] = g.useState(0), [u, c] = g.useState(() => new Set(ve)), [x, f] = g.useState(8), i = ea(), n = () => {
    i.mutate(
      {
        dailyCapacityHours: x > 0 ? x : 0,
        sources: [...u],
        setupCompleted: !0
      },
      { onSettled: s }
    );
  }, p = (o) => c((m) => {
    const b = new Set(m);
    return b.has(o) ? b.delete(o) : b.add(o), b;
  });
  return /* @__PURE__ */ e.jsx(Le, { open: t, onOpenChange: (o) => {
    o || s();
  }, children: /* @__PURE__ */ e.jsxs(qe, { className: "w-full max-w-[520px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-5 py-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[18px] font-semibold tracking-tight text-text-primary", children: "Takviminizi kurun" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: "Hangi kaynakları göreceğinizi seçin, dilerseniz dış takvim bağlayın. Her ayarı sonradan değiştirebilirsiniz." }),
      /* @__PURE__ */ e.jsx("ol", { className: "mt-3 flex items-center gap-2", children: ue.map((o, m) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx("span", { className: y(
          "flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold",
          m === r ? "bg-accent text-white" : m < r ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
        ), children: m + 1 }),
        /* @__PURE__ */ e.jsx("span", { className: y(
          "text-[11.5px]",
          m === r ? "font-semibold text-text-primary" : "text-text-tertiary"
        ), children: o }),
        m < ue.length - 1 && /* @__PURE__ */ e.jsx("span", { className: "ms-1 text-text-tertiary", children: "·" })
      ] }, o)) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-5 py-4", children: [
      r === 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Takvimde ne görünsün?" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex flex-col gap-1.5", children: ve.map((o) => {
          var d, w;
          const m = u.has(o), b = a == null ? void 0 : a[o];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": m,
              onClick: () => p(o),
              className: y(
                "flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                m ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: y("fa text-[12px]", (d = M[o]) == null ? void 0 : d.icon, m ? "text-accent" : "text-text-tertiary"), "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-medium text-text-primary", children: (w = M[o]) == null ? void 0 : w.label }),
                b != null && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: b })
              ]
            },
            o
          );
        }) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-[13px] font-semibold text-text-primary", children: "Günlük kapasiteniz" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex gap-1.5", children: sa.map((o) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => f(o.value),
            className: y(
              "rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              x === o.value ? "border-accent bg-primary-subtle text-accent" : "border-subtle text-text-secondary hover:bg-surface-hover"
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
    /* @__PURE__ */ e.jsxs("footer", { className: "flex items-center gap-2 border-t border-subtle px-5 py-3", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary", children: [
        "Adım ",
        r + 1,
        " / ",
        ue.length
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1" }),
      /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "ghost", onClick: n, disabled: i.isPending, children: "Şimdilik atla" }),
      r < ue.length - 1 ? /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "primary", onClick: () => l((o) => o + 1), children: "Devam" }) : /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "primary", onClick: n, disabled: i.isPending, children: i.isPending ? "Kaydediliyor…" : "Bitir" })
    ] })
  ] }) });
}
const na = [
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
function Ye({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "rounded border border-strong bg-surface-raised px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-text-primary", children: t });
}
function ia({ open: t, onClose: a }) {
  return /* @__PURE__ */ e.jsx(Le, { open: t, onOpenChange: (s) => {
    s || a();
  }, children: /* @__PURE__ */ e.jsxs(qe, { className: "w-full max-w-[480px] p-0", children: [
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
      na.map((s) => /* @__PURE__ */ e.jsxs("section", { className: "mb-4 last:mb-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: s.title }),
        s.rows.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center gap-1", children: r.keys.map((l) => /* @__PURE__ */ e.jsx(Ye, { children: l }, l)) }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-secondary", children: r.label })
        ] }, r.label))
      ] }, s.title)),
      /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] leading-snug text-text-tertiary", children: [
        "Takvim ızgarası tek sekme durağıdır: ",
        /* @__PURE__ */ e.jsx(Ye, { children: "Tab" }),
        " ile içine girin, sonra oklarla gezin. Sürükle-bırakla yapılan her taşıma buradaki kısayollarla da yapılabilir."
      ] })
    ] })
  ] }) });
}
function la({ polite: t, assertive: a }) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("p", { role: "status", "aria-live": "polite", className: "sr-only", children: t }),
    /* @__PURE__ */ e.jsx("p", { role: "alert", "aria-live": "assertive", className: "sr-only", children: a })
  ] });
}
const oa = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
function ca({ items: t, month: a, today: s, generatedAt: r }) {
  var o;
  const l = He(a), u = D(s), c = {};
  for (const m of t ?? [])
    (c[o = m.date.slice(0, 10)] ?? (c[o] = [])).push(m);
  const x = Se(s), f = (t ?? []).filter((m) => {
    const b = m.date.slice(0, 10);
    return b >= D(x) && b <= D(_(x, 7));
  }), { overdue: i, days: n } = Ve(f, s), p = (m) => m === O.OVERDUE ? "border-l-[3px] border-l-black" : m === O.DUE_TODAY ? "border-l-[3px] border-l-neutral-500" : "border-l-[3px] border-l-neutral-300";
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-print-root hidden print:block", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-end justify-between border-b-2 border-black pb-2", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[8pt] font-bold uppercase tracking-widest text-neutral-500", children: "APYA · Takvim" }),
          /* @__PURE__ */ e.jsx("h1", { className: "mt-1 text-[22pt] font-semibold capitalize leading-none", children: j.monthTitle(a) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "text-right text-[8pt] text-neutral-500", children: [
          /* @__PURE__ */ e.jsx("p", { children: "Risk: kalın çizgi = gecikmiş · gri çizgi = bugün son gün" }),
          /* @__PURE__ */ e.jsxs("p", { children: [
            r,
            " tarihinde oluşturuldu · Sayfa 1 / 2"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "mt-3 grid grid-cols-7", children: oa.map((m) => /* @__PURE__ */ e.jsx("div", { className: "pb-1 text-[7.5pt] font-bold uppercase tracking-wide text-neutral-500", children: m }, m)) }),
      /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-l border-t border-neutral-300", children: l.map((m) => {
        const b = D(m), d = c[b] ?? [], w = m.getMonth() !== a.getMonth();
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: y(
              "min-h-[62px] border-b border-r border-neutral-300 p-1",
              b === u && "ring-1 ring-inset ring-black"
            ),
            children: [
              /* @__PURE__ */ e.jsx("p", { className: y(
                "text-right font-mono text-[9pt] font-semibold",
                w ? "text-neutral-300" : "text-neutral-700"
              ), children: m.getDate() }),
              d.slice(0, 4).map((S) => /* @__PURE__ */ e.jsx(
                "p",
                {
                  className: y(
                    "mt-0.5 truncate ps-1 text-[7.5pt] leading-tight",
                    p(S.risk),
                    S.risk === O.OVERDUE ? "font-semibold" : "font-normal",
                    S.isDone && "line-through"
                  ),
                  children: S.title
                },
                S.key
              )),
              d.length > 4 && /* @__PURE__ */ e.jsxs("p", { className: "mt-0.5 text-[7pt] text-neutral-500", children: [
                "+",
                d.length - 4,
                " öğe"
              ] })
            ]
          },
          b
        );
      }) })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page apya-print-break", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-end justify-between border-b-2 border-black pb-2", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[8pt] font-bold uppercase tracking-widest text-neutral-500", children: "APYA · Haftalık ajanda" }),
          /* @__PURE__ */ e.jsxs("h1", { className: "mt-1 text-[22pt] font-semibold leading-none", children: [
            j.dayShort(x),
            " – ",
            j.dayShort(_(x, 6))
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
          i.map((m) => /* @__PURE__ */ e.jsx(Be, { item: m, showDate: !0 }, m.key))
        ] }),
        n.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "mb-4 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "border-b border-black pb-1 text-[9pt] font-bold uppercase tracking-wide", children: [
            j.dayTitle(m.date),
            m.isToday ? " · Bugün" : ""
          ] }),
          m.items.map((b) => /* @__PURE__ */ e.jsx(Be, { item: b }, b.key))
        ] }, m.key))
      ] })
    ] })
  ] });
}
function Be({ item: t, showDate: a = !1 }) {
  const s = M[t.source];
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-neutral-200 py-1", children: [
    /* @__PURE__ */ e.jsx("span", { className: "mt-[3px] h-[9px] w-[9px] shrink-0 border border-neutral-600", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ e.jsx("span", { className: y("block text-[9pt] leading-tight", t.risk === O.OVERDUE && "font-semibold"), children: t.title }),
      /* @__PURE__ */ e.jsx("span", { className: "block text-[7.5pt] text-neutral-500", children: [
        a ? j.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
        s == null ? void 0 : s.label,
        t.subtitle,
        t.amount != null ? j.money(t.amount, t.currency) : null
      ].filter(Boolean).join(" · ") })
    ] })
  ] });
}
const da = 6e4;
function ua({ from: t, to: a }) {
  const s = D(t), r = D(a);
  return Z({
    queryKey: ["calendar", "feed", s, r],
    queryFn: () => P.get(`/api/app/calendar/feed?From=${s}&To=${r}`),
    staleTime: da,
    placeholderData: (l) => l
    /* ay geçişinde boş ekran yerine eski veri */
  });
}
const et = "apya.calendar.view", we = "apya.calendar.sources", pe = ["month", "week", "day", "agenda"];
function tt(t) {
  try {
    return window.localStorage.getItem(t);
  } catch {
    return null;
  }
}
function ke(t, a) {
  try {
    window.localStorage.setItem(t, a);
  } catch {
  }
}
function xa() {
  const t = new URLSearchParams(window.location.search).get("view");
  if (pe.includes(t)) return t;
  const a = tt(et);
  return pe.includes(a) ? a : null;
}
function ma() {
  const t = tt(we);
  if (!t) return new Set(re);
  const a = t.split(",").map(Number).filter((s) => re.includes(s));
  return a.length ? new Set(a) : new Set(re);
}
function pa({ defaultView: t = "month" } = {}) {
  const [a] = g.useState(xa), [s, r] = g.useState(() => a ?? t), [l, u] = g.useState(ma);
  g.useEffect(() => {
    const n = new URL(window.location.href);
    n.searchParams.get("view") !== s && (n.searchParams.set("view", s), window.history.replaceState({}, "", n));
  }, [s]);
  const c = g.useCallback((n) => {
    pe.includes(n) && (r(n), ke(et, n));
  }, []), x = g.useCallback((n) => {
    u((p) => {
      const o = new Set(p);
      return o.has(n) ? o.delete(n) : o.add(n), ke(we, [...o].join(",")), o;
    });
  }, []), f = g.useCallback((n) => {
    a || pe.includes(n) && r((p) => p === n ? p : n);
  }, [a]), i = g.useCallback(() => {
    const n = new Set(re);
    u(n), ke(we, [...n].join(","));
  }, []);
  return { view: s, setView: c, applyResponsiveDefault: f, enabledSources: l, toggleSource: x, resetSources: i };
}
const L = ["calendar", "feed"];
function ba(t, a, s) {
  t.setQueriesData({ queryKey: L }, (r) => r != null && r.items ? {
    ...r,
    items: r.items.map((l) => l.key === a ? { ...l, date: `${s}T00:00:00` } : l)
  } : r);
}
function fa(t, a) {
  t.setQueriesData({ queryKey: L }, (s) => s != null && s.items ? {
    ...s,
    items: s.items.map((r) => r.key === a ? { ...r, isDone: !0, risk: 0, loadHours: null } : r)
  } : s);
}
function ha() {
  const t = Q(), [a, s] = g.useState(null), [r, l] = g.useState({}), [u, c] = g.useState({}), x = g.useCallback((n) => {
    l((p) => {
      if (!p[n]) return p;
      const o = { ...p };
      return delete o[n], o;
    });
  }, []), f = B({
    mutationFn: ({ item: n, newDate: p }) => P.post("/api/app/calendar/reschedule-item", {
      source: n.source,
      sourceId: n.sourceId,
      newDate: D(p)
    }),
    onMutate: async ({ item: n, newDate: p }) => {
      await t.cancelQueries({ queryKey: L });
      const o = t.getQueriesData({ queryKey: L });
      return x(n.key), c((m) => ({ ...m, [n.key]: !0 })), ba(t, n.key, D(p)), { snapshot: o, previousDate: n.date.slice(0, 10) };
    },
    onError: (n, { item: p }, o) => {
      var m;
      (m = o == null ? void 0 : o.snapshot) == null || m.forEach(([b, d]) => t.setQueryData(b, d)), l((b) => ({
        ...b,
        [p.key]: (n == null ? void 0 : n.message) || "Kaydedilemedi — tarih değişmedi."
      }));
    },
    onSuccess: (n, { item: p, newDate: o }, m) => {
      s({
        key: p.key,
        message: `“${p.title}” ${D(o)} tarihine taşındı.`,
        undo: () => f.mutate({
          item: { ...p, date: `${D(o)}T00:00:00` },
          newDate: /* @__PURE__ */ new Date(`${m.previousDate}T00:00:00`)
        })
      });
    },
    onSettled: (n, p, { item: o }) => {
      c((m) => {
        const b = { ...m };
        return delete b[o.key], b;
      }), t.invalidateQueries({ queryKey: L });
    }
  }), i = B({
    mutationFn: ({ item: n }) => P.post("/api/app/calendar/complete-item", {
      source: n.source,
      sourceId: n.sourceId
    }),
    onMutate: async ({ item: n }) => {
      await t.cancelQueries({ queryKey: L });
      const p = t.getQueriesData({ queryKey: L });
      return x(n.key), c((o) => ({ ...o, [n.key]: !0 })), fa(t, n.key), { snapshot: p };
    },
    onError: (n, { item: p }, o) => {
      var m;
      (m = o == null ? void 0 : o.snapshot) == null || m.forEach(([b, d]) => t.setQueryData(b, d)), l((b) => ({
        ...b,
        [p.key]: (n == null ? void 0 : n.message) || "Tamamlanamadı."
      }));
    },
    onSuccess: (n, { item: p }) => {
      s({ key: p.key, message: `“${p.title}” tamamlandı.`, undo: null });
    },
    onSettled: (n, p, { item: o }) => {
      c((m) => {
        const b = { ...m };
        return delete b[o.key], b;
      }), t.invalidateQueries({ queryKey: L });
    }
  });
  return {
    reschedule: (n, p) => f.mutate({ item: n, newDate: p }),
    complete: (n) => i.mutate({ item: n }),
    retry: (n, p) => p ? f.mutate({ item: n, newDate: p }) : i.mutate({ item: n }),
    lastAction: a,
    dismissAction: () => s(null),
    errors: r,
    clearError: x,
    pending: u
  };
}
function ga({ from: t, to: a, enabled: s = !0 }) {
  const r = D(t), l = D(a);
  return Z({
    queryKey: ["calendar", "external", r, l],
    queryFn: () => P.get(`/api/app/calendar/external-events?From=${r}&To=${l}`),
    enabled: s,
    staleTime: 12e4,
    retry: !1,
    placeholderData: (u) => u
  });
}
const ya = ["INPUT", "TEXTAREA", "SELECT"];
function ka({
  onView: t,
  onToday: a,
  onPrev: s,
  onNext: r,
  onDeferSelected: l,
  onUndo: u,
  onToggleHelp: c,
  enabled: x = !0
}) {
  g.useEffect(() => {
    if (!x) return;
    const f = (i) => {
      const n = i.target;
      if (!(ya.includes(n == null ? void 0 : n.tagName) || n != null && n.isContentEditable)) {
        if ((i.metaKey || i.ctrlKey) && i.key.toLowerCase() === "z") {
          i.preventDefault(), u == null || u();
          return;
        }
        if (!(i.metaKey || i.ctrlKey || i.altKey)) {
          if (i.shiftKey) {
            i.key === "ArrowRight" && (i.preventDefault(), l == null || l(1)), i.key === "ArrowLeft" && (i.preventDefault(), l == null || l(-1)), i.key === "?" && (i.preventDefault(), c == null || c());
            return;
          }
          switch (i.key) {
            case "?":
              i.preventDefault(), c == null || c();
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
    return window.addEventListener("keydown", f), () => window.removeEventListener("keydown", f);
  }, [x, t, a, s, r, l, u, c]);
}
function va() {
  const t = g.useRef(null), [a, s] = g.useState(0);
  return g.useLayoutEffect(() => {
    const r = t.current;
    if (!r || (s(r.getBoundingClientRect().width), typeof ResizeObserver > "u")) return;
    const l = new ResizeObserver((u) => {
      for (const c of u)
        s(c.contentRect.width);
    });
    return l.observe(r), () => l.disconnect();
  }, []), [t, a];
}
function ja(t) {
  return t === 0 || t >= 1180 ? "wide" : t >= 780 ? "medium" : "narrow";
}
const Na = 60;
function xe(t, a, s) {
  return a === "week" ? _(t, 7 * s) : a === "day" ? _(t, s) : new Date(t.getFullYear(), t.getMonth() + s, 1);
}
function wa() {
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Array.from({ length: 7 }, (t, a) => /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-2", children: /* @__PURE__ */ e.jsx(se, { height: 10 }) }, a)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: Array.from({ length: De }, (t, a) => /* @__PURE__ */ e.jsxs("div", { className: "min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0", children: [
      /* @__PURE__ */ e.jsx(se, { height: 12, width: "40%", className: "ml-auto" }),
      a % 3 === 0 && /* @__PURE__ */ e.jsx(se, { height: 14, className: "mt-2" })
    ] }, a)) })
  ] });
}
function Sa() {
  var Ke, ze, Oe, Ie, Pe;
  const [t, a] = va(), s = ja(a), r = s === "narrow", l = g.useMemo(() => je(/* @__PURE__ */ new Date()), []), [u, c] = g.useState(() => new Date(l.getFullYear(), l.getMonth(), 1)), [x, f] = g.useState(null), [i, n] = g.useState(null), [p, o] = g.useState(!1), [m, b] = g.useState(!1), [d, w] = g.useState(!1), [S, I] = g.useState(!1), [$, k] = g.useState(null), { view: h, setView: z, applyResponsiveDefault: C, enabledSources: N, toggleSource: F, resetSources: fe } = pa();
  g.useEffect(() => {
    a !== 0 && C(r ? "agenda" : "month");
  }, [a, r, C]);
  const { range: q, title: H, weekDayList: W } = g.useMemo(() => {
    if (h === "agenda")
      return {
        range: { from: _(l, -60), to: _(l, Na) },
        title: "Ajanda",
        weekDayList: null
      };
    if (h === "week") {
      const T = ft(u);
      return {
        range: { from: T[0], to: T[6] },
        title: `${j.dayShort(T[0])} – ${j.dayShort(T[6])} ${T[6].getFullYear()}`,
        weekDayList: T
      };
    }
    if (h === "day") {
      const T = je(u);
      return { range: { from: T, to: T }, title: j.dayTitle(T), weekDayList: [T] };
    }
    const v = Qe(u);
    return {
      range: { from: v, to: _(v, De - 1) },
      title: j.monthTitle(u),
      weekDayList: null
    };
  }, [h, u, l]), { data: E, isPending: V, isError: K, refetch: J } = ua(q), ee = ga(q), Ee = Jt(), oe = g.useMemo(
    () => {
      var v;
      return [...(E == null ? void 0 : E.items) ?? [], ...((v = ee.data) == null ? void 0 : v.items) ?? []];
    },
    [E, ee.data]
  ), X = g.useMemo(
    () => oe.filter((v) => N.has(v.source)),
    [oe, N]
  ), Y = g.useMemo(() => We(X), [X]), G = (E == null ? void 0 : E.dailyCapacityHours) ?? null, Re = g.useMemo(() => {
    const v = {};
    for (const T of (E == null ? void 0 : E.sources) ?? []) v[T.source] = T.count;
    return v;
  }, [E]), at = g.useMemo(() => G ? Object.values(Y).filter((v) => be(v) > G).length : 0, [Y, G]);
  g.useEffect(() => {
    x && !Y[x] && !V && (x >= D(q.from) && x <= D(q.to) || f(null));
  }, [x, Y, V, q]);
  const ce = g.useCallback((v) => n(v.key), []), Ae = g.useCallback(() => {
    c(l), f(D(l));
  }, [l]), R = ha(), st = g.useCallback((v) => {
    const T = $ ?? x;
    if (T)
      for (const ge of Y[T] ?? [])
        ge.canReschedule && !ge.isDone && R.reschedule(ge, _(/* @__PURE__ */ new Date("T00:00:00"), v));
  }, [$, x, Y, R]);
  ka({
    onView: z,
    onToday: Ae,
    onPrev: () => c((v) => xe(v, h, -1)),
    onNext: () => c((v) => xe(v, h, 1)),
    onDeferSelected: st,
    onUndo: () => {
      var v, T;
      return (T = (v = R.lastAction) == null ? void 0 : v.undo) == null ? void 0 : T.call(v);
    },
    onToggleHelp: () => I((v) => !v)
  });
  const $e = oe.length > 0, rt = $e && X.length === 0, nt = x ? Y[x] ?? [] : [], te = i ? oe.find((v) => v.key === i) ?? null : null, he = x && /* @__PURE__ */ e.jsx(
    jt,
    {
      dayKey: x,
      items: nt,
      capacity: G,
      onSelectItem: ce,
      onClose: () => f(null)
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { ref: t, className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsx(
      $t,
      {
        title: H,
        view: h,
        onView: z,
        onPrev: () => c((v) => xe(v, h, -1)),
        onNext: () => c((v) => xe(v, h, 1)),
        onToday: Ae,
        overloadDays: at,
        onHelp: () => I(!0)
      }
    ),
    K && /* @__PURE__ */ e.jsxs("div", { className: "rounded-card border border-negative-100 bg-negative-50 px-3 py-2.5 text-[12.5px] text-negative-700", children: [
      "Takvim yüklenemedi.",
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => J(), className: "ml-2 font-semibold underline", children: "Yeniden dene" })
    ] }),
    R.lastAction && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "flex items-center gap-2 rounded-card border border-subtle bg-surface-raised px-3 py-2 text-[12.5px] text-text-secondary",
        role: "status",
        "aria-live": "polite",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left text-text-tertiary", "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 truncate", children: R.lastAction.message }),
          R.lastAction.undo && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                R.lastAction.undo(), R.dismissAction();
              },
              className: "font-semibold text-text-link hover:underline",
              children: "Geri al"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: R.dismissAction,
              "aria-label": "Şeridi kapat",
              className: "rounded p-1 text-text-tertiary hover:bg-surface-hover",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: y("flex gap-3", r ? "flex-col" : "flex-row items-start"), children: [
      !r && /* @__PURE__ */ e.jsx("div", { className: y("shrink-0", s === "wide" ? "w-[240px]" : "w-auto"), children: /* @__PURE__ */ e.jsx(
        Rt,
        {
          sources: (E == null ? void 0 : E.sources) ?? [],
          counts: Re,
          enabled: N,
          onToggle: F,
          compact: s !== "wide",
          externalAccounts: ((Ke = ee.data) == null ? void 0 : Ke.accounts) ?? [],
          externalLoading: ee.isFetching,
          onOpenSync: () => o(!0)
        }
      ) }),
      /* @__PURE__ */ e.jsx("div", { className: "min-w-0 flex-1", children: V ? /* @__PURE__ */ e.jsx(wa, {}) : rt ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
        le,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-filter-circle-xmark" }),
          title: "Bu filtreyle gösterilecek öğe yok",
          description: "Kaynak rayında kapattığınız türler bu aralıktaki tüm öğeleri gizliyor.",
          action: /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "outline", onClick: fe, children: "Kaynakları aç" })
        }
      ) }) : $e ? h === "month" ? /* @__PURE__ */ e.jsx(
        Tt,
        {
          month: u,
          byDay: Y,
          today: l,
          capacity: G,
          selectedDay: x,
          onSelectItem: ce,
          onSelectDay: f,
          onDropItem: R.reschedule,
          focusedDay: $,
          onFocusDay: k,
          onNavigate: (v) => c(v),
          pending: R.pending,
          errors: R.errors
        }
      ) : W ? /* @__PURE__ */ e.jsx(
        It,
        {
          days: W,
          byDay: Y,
          today: l,
          capacity: G,
          selectedDay: x,
          onSelectItem: ce,
          onSelectDay: f
        }
      ) : /* @__PURE__ */ e.jsx(
        vt,
        {
          items: X,
          today: l,
          onSelectItem: ce,
          onSmartDefer: () => b(!0)
        }
      ) : /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
        le,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
          title: "Bu aralıkta planlanmış bir şey yok",
          description: "Son tarihi olan görevler, fatura vadeleri, hibe son tarihleri ve tarihli finans kayıtları burada birlikte görünür.",
          action: /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "outline", onClick: () => {
            window.location.href = "/Tasks";
          }, children: "Görev oluştur" })
        }
      ) }) }),
      s === "wide" && x && /* @__PURE__ */ e.jsx("div", { className: "w-[340px] shrink-0 self-stretch", children: he })
    ] }),
    s === "medium" && x && /* @__PURE__ */ e.jsx(ne, { open: !0, onOpenChange: (v) => {
      v || f(null);
    }, children: /* @__PURE__ */ e.jsx(ie, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: he }) }),
    r && x && /* @__PURE__ */ e.jsx(ne, { open: !0, onOpenChange: (v) => {
      v || f(null);
    }, children: /* @__PURE__ */ e.jsx(ie, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: he }) }),
    /* @__PURE__ */ e.jsx(
      ca,
      {
        items: X,
        month: u,
        today: l,
        generatedAt: j.dayShort(l)
      }
    ),
    /* @__PURE__ */ e.jsx(ia, { open: S, onClose: () => I(!1) }),
    /* @__PURE__ */ e.jsx(
      la,
      {
        polite: ((ze = R.lastAction) == null ? void 0 : ze.message) ?? "",
        assertive: ((Pe = (Ie = (Oe = ee.data) == null ? void 0 : Oe.accounts) == null ? void 0 : Ie.find((v) => v.error)) == null ? void 0 : Pe.error) ?? ""
      }
    ),
    /* @__PURE__ */ e.jsx(Zt, { open: p, onClose: () => o(!1) }),
    /* @__PURE__ */ e.jsx(
      aa,
      {
        open: m,
        items: X,
        today: l,
        capacity: G,
        onClose: () => b(!1)
      }
    ),
    /* @__PURE__ */ e.jsx(
      ra,
      {
        open: Ee.data ? !Ee.data.setupCompleted && !d : !1,
        counts: Re,
        onDone: () => w(!0)
      }
    ),
    te && /* @__PURE__ */ e.jsx(
      Mt,
      {
        item: te,
        capacity: G,
        onClose: () => n(null),
        onReschedule: R.reschedule,
        onComplete: R.complete,
        isPending: !!R.pending[te.key],
        error: R.errors[te.key],
        onRetry: () => R.clearError(te.key)
      }
    )
  ] });
}
const Ge = document.getElementById("apya-calendar-root");
Ge && it(Ge).render(
  /* @__PURE__ */ e.jsx(lt, { children: /* @__PURE__ */ e.jsx(ot, { children: /* @__PURE__ */ e.jsx(ct, { children: /* @__PURE__ */ e.jsx(Sa, {}) }) }) })
);
