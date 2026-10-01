import { j as e, d as pe, r as g, b as Ct } from "./react-vendor-D57GAUXd.js";
import { c as k, B as z, b as oe, d as ce, S as ie, D as rt, h as nt, T as Et } from "./Dialog-Bky2XNdc.js";
import { D as Tt } from "./useDeviceMode-Dk7fb2QY.js";
import { a as $t } from "./QueryProvider-CMEXdgTM.js";
import { E as de } from "./EmptyState-D5m5kdmR.js";
import { a as A } from "./httpClient-DePjXdo1.js";
import { d as Rt } from "./draggableActivation-Ybw9Upbh.js";
import { u as V, b as L, a as U } from "./query-vendor-Bf69L2iP.js";
import { e as zt, m as Ve, u as At } from "./dataChanged-DR0MWWqM.js";
import { i as Kt, s as Pt } from "./permanentRejection-SvaBclz0.js";
/* empty css               */
const O = {
  1: { key: "task", label: "Görev", plural: "görev", icon: "fa-circle-check", railLabel: "Görevler" },
  2: { key: "invoice", label: "Fatura", plural: "fatura", icon: "fa-file-invoice", railLabel: "Faturalar" },
  3: { key: "grant", label: "Hibe", plural: "hibe", icon: "fa-award", railLabel: "Hibe son tarihleri" },
  4: { key: "expense", label: "Gider", plural: "gider", icon: "fa-arrow-trend-down", railLabel: "Gider / gelir" },
  5: { key: "income", label: "Gelir", plural: "gelir", icon: "fa-arrow-trend-up", railLabel: "Gider / gelir" },
  6: { key: "cash", label: "Kasa hareketi", plural: "kasa hareketi", icon: "fa-wallet", railLabel: "Nakit hareketleri" },
  7: { key: "external", label: "Dış etkinlik", plural: "dış etkinlik", icon: "fa-calendar-days", railLabel: "Dış etkinlikler" }
}, le = [1, 2, 3, 4, 5, 6, 7], It = [
  { key: "task", sources: [1] },
  { key: "invoice", sources: [2] },
  { key: "grant", sources: [3] },
  { key: "money", sources: [4, 5] },
  { key: "cash", sources: [6] }
], Ce = [1, 2, 3, 4, 5, 6], I = { DUE_TODAY: 1, OVERDUE: 2 }, Ot = (t) => t.risk === I.OVERDUE || t.risk === I.DUE_TODAY, it = 864e5, Ee = (t) => new Date(t.getFullYear(), t.getMonth(), t.getDate()), M = (t, a) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + a);
function $(t) {
  const a = (s) => (s < 10 ? "0" : "") + s;
  return `${t.getFullYear()}-${a(t.getMonth() + 1)}-${a(t.getDate())}`;
}
function Re(t) {
  const a = (t.getDay() + 6) % 7;
  return new Date(t.getTime() - a * it);
}
const lt = (t) => Re(new Date(t.getFullYear(), t.getMonth(), 1)), ze = 42;
function ot(t) {
  const a = lt(t);
  return Array.from({ length: ze }, (s, r) => new Date(a.getTime() + r * it));
}
const Ft = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }), Mt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }), Lt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }), S = {
  monthTitle: (t) => Ft.format(t),
  dayTitle: (t) => Mt.format(t),
  dayShort: (t) => Lt.format(t),
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
function ct(t) {
  const a = {};
  for (const s of t ?? []) {
    const r = (s.date || "").slice(0, 10);
    r && (a[r] ?? (a[r] = [])).push(s);
  }
  return a;
}
const ye = (t) => (t ?? []).reduce((a, s) => a + (s.loadHours ?? 0), 0);
function qt(t, { maxPills: a = 3, maxRiskPills: s = 2 } = {}) {
  const r = t ?? [];
  if (r.length === 0) return { pills: [], summaries: [] };
  if (r.length <= a) return { pills: r, summaries: [] };
  const d = r.filter(Ot).slice(0, s), x = new Set(d.map((i) => i.key)), c = /* @__PURE__ */ new Map();
  for (const i of r) {
    if (x.has(i.key)) continue;
    const m = c.get(i.source) ?? { source: i.source, count: 0, amount: 0, hasAmount: !1, only: null };
    m.count += 1, m.only = m.count === 1 ? i : null, i.amount != null && (m.amount += i.amount, m.hasAmount = !0), c.set(i.source, m);
  }
  const u = [];
  for (const i of le) {
    const m = c.get(i);
    m && (m.count === 1 && m.only ? d.push(m.only) : u.push(m));
  }
  return { pills: d, summaries: u };
}
function _t(t, { compact: a = !0 } = {}) {
  const s = O[t.source], r = `${t.count} ${s ? s.plural : "öğe"}`;
  if (!t.hasAmount) return r;
  const l = a ? S.moneyCompact(t.amount) : S.money(t.amount);
  return `${r} · ${l}`;
}
function dt(t, a) {
  const s = $(a), r = (t ?? []).filter((u) => !u.isDone), l = r.filter((u) => u.date.slice(0, 10) < s && u.risk === I.OVERDUE), d = r.filter((u) => u.date.slice(0, 10) >= s), x = ct(d), c = Object.keys(x).sort().map((u) => ({
    key: u,
    date: /* @__PURE__ */ new Date(`${u}T00:00:00`),
    isToday: u === s,
    items: x[u]
  }));
  return { overdue: l, days: c };
}
function Bt(t) {
  const a = Re(Ee(t));
  return Array.from({ length: 7 }, (s, r) => M(a, r));
}
const Yt = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }), we = (t) => t ? Yt.format(new Date(t)) : "";
function he(t) {
  const a = new Date(t);
  return a.getHours() * 60 + a.getMinutes();
}
function Gt(t) {
  let a = 8, s = 18;
  for (const r of t ?? [])
    r.startTime && (a = Math.min(a, Math.floor(he(r.startTime) / 60)), s = Math.max(s, Math.ceil(he(r.endTime ?? r.startTime) / 60)));
  return { start: Math.max(0, a), end: Math.min(24, Math.max(s, a + 4)) };
}
const Xe = (t) => !!t.startTime, Je = (t) => t.getDay() === 0 || t.getDay() === 6;
function Ut(t, { today: a, capacity: s = null, horizonDays: r = 21, fallbackPerDay: l = 3 } = {}) {
  const d = $(a), x = (t ?? []).filter((h) => !h.isDone), c = x.filter((h) => h.date.slice(0, 10) < d && h.risk === I.OVERDUE), u = c.filter((h) => h.canReschedule), i = c.filter((h) => !h.canReschedule), m = {}, o = {};
  for (const h of x) {
    const n = h.date.slice(0, 10);
    n < d || (m[n] = (m[n] ?? 0) + (h.loadHours ?? 0), o[n] = (o[n] ?? 0) + 1);
  }
  const b = [];
  let f = 0;
  for (const h of u) {
    let n = null;
    for (; f < r; ) {
      const p = M(a, f);
      if (Je(p)) {
        f += 1;
        continue;
      }
      const v = $(p), w = m[v] ?? 0, E = o[v] ?? 0, N = h.loadHours ?? 0, y = s && N > s;
      if (s && !y ? w + N <= s : E < l) {
        m[v] = w + N, o[v] = E + 1, n = p;
        break;
      }
      f += 1;
    }
    if (!n) {
      let p = M(a, r);
      for (; Je(p); ) p = M(p, 1);
      n = p;
    }
    b.push({ item: h, date: n });
  }
  return { suggestions: b, fixed: i };
}
const Qt = {
  [I.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [I.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function Te({ item: t, onSelect: a, showDate: s = !1 }) {
  const r = O[t.source], l = Qt[t.risk];
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
function Ht({ items: t, today: a, onSelectItem: s, onSmartDefer: r }) {
  const { overdue: l, days: d } = dt(t, a);
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
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: l.map((x) => /* @__PURE__ */ e.jsx(Te, { item: x, onSelect: s, showDate: !0 }, x.key)) })
    ] }),
    d.map((x) => /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
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
function Wt({ dayKey: t, items: a, capacity: s, onSelectItem: r, onClose: l }) {
  const d = /* @__PURE__ */ new Date(`${t}T00:00:00`), x = ye(a), c = s && x > s, u = a.reduce((i, m) => (i[m.source] = (i[m.source] ?? 0) + 1, i), {});
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: S.dayTitle(d) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(u).length === 0 ? "Planlanmış öğe yok" : Object.entries(u).map(([i, m]) => {
          var o;
          return `${m} ${((o = O[i]) == null ? void 0 : o.plural) ?? "öğe"}`;
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
const Vt = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], Xt = {
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
function Jt({ item: t, onSelect: a, onDragStart: s, isPending: r, hasError: l }) {
  const d = O[t.source], x = Xt[t.risk], c = t.canReschedule && !t.isDone, u = Rt(() => a(t));
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: c,
      onDragStart: c ? (i) => {
        i.stopPropagation(), i.dataTransfer.effectAllowed = "move", i.dataTransfer.setData("text/plain", t.key), s(t);
      } : void 0,
      onPointerDown: (i) => {
        i.stopPropagation(), u.onPointerDown(i);
      },
      onClick: (i) => {
        i.stopPropagation(), u.onClick(i);
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
function Zt({ summary: t, onSelect: a }) {
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
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: _t(t) })
      ]
    }
  );
}
function ea({ load: t, capacity: a }) {
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
function ta({
  month: t,
  byDay: a,
  today: s,
  capacity: r,
  onSelectItem: l,
  onSelectDay: d,
  selectedDay: x,
  onDropItem: c,
  pending: u = {},
  errors: i = {},
  focusedDay: m,
  onFocusDay: o,
  onNavigate: b
}) {
  const f = ot(t), h = $(s), [n, p] = pe.useState(null), [v, w] = pe.useState(null), E = pe.useRef(null), N = m ?? x ?? h, y = (D) => {
    const T = M(/* @__PURE__ */ new Date(`${N}T00:00:00`), D);
    f.some((F) => $(F) === $(T)) || b == null || b(T), o == null || o($(T));
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
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Vt.map((D, T) => /* @__PURE__ */ e.jsx(
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
          const T = $(D), F = a[T] ?? [], { pills: X, summaries: ke } = qt(F), J = ye(F), q = D.getMonth() !== t.getMonth(), ae = T === h, te = T === x;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              role: "gridcell",
              "data-day": T,
              tabIndex: T === N ? 0 : -1,
              "aria-selected": te,
              "aria-label": `${S.dayTitle(D)}${F.length ? `, ${F.length} öğe` : ", boş"}`,
              onClick: () => {
                o == null || o(T), d(T);
              },
              onDragOver: n ? (C) => {
                C.preventDefault(), C.dataTransfer.dropEffect = "move", v !== T && w(T);
              } : void 0,
              onDragLeave: n ? () => w((C) => C === T ? null : C) : void 0,
              onDrop: n ? (C) => {
                C.preventDefault();
                const Q = n;
                p(null), w(null), Q && Q.date.slice(0, 10) !== T && c(Q, /* @__PURE__ */ new Date(`${T}T00:00:00`));
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
                  Jt,
                  {
                    item: C,
                    onSelect: l,
                    onDragStart: p,
                    isPending: !!u[C.key],
                    hasError: !!i[C.key]
                  },
                  C.key
                )),
                ke.map((C) => /* @__PURE__ */ e.jsx(
                  Zt,
                  {
                    summary: C,
                    onSelect: () => d(T)
                  },
                  `${T}-${C.source}`
                )),
                /* @__PURE__ */ e.jsx(ea, { load: J, capacity: r })
              ]
            },
            T
          );
        })
      }
    )
  ] });
}
const aa = { 1: "Google", 2: "Outlook", 3: "iCloud" };
function sa(t) {
  const a = String(t ?? "").trim().split(/\s+/).filter(Boolean);
  return a.length === 0 ? "?" : a.length === 1 ? a[0].slice(0, 2).toLocaleUpperCase("tr") : (a[0][0] + a[a.length - 1][0]).toLocaleUpperCase("tr");
}
function ra({
  sources: t,
  counts: a,
  enabled: s,
  onToggle: r,
  compact: l = !1,
  externalAccounts: d = [],
  externalLoading: x = !1,
  onOpenSync: c,
  teamOpen: u = !1,
  onToggleTeam: i,
  teamContent: m,
  teamMembers: o = [],
  riskCounts: b
}) {
  const f = (t ?? []).filter((p) => p.isAvailable);
  if (f.length === 0) return null;
  const h = new Set(f.map((p) => p.source)), n = It.map(({ key: p, sources: v }) => {
    const w = v.filter((E) => h.has(E));
    return w.length === 0 ? null : {
      key: p,
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
        n.map(({ key: p, sources: v, meta: w, isOn: E, count: N }) => w ? /* @__PURE__ */ e.jsxs(
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
          p
        ) : null),
        !l && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
          d.length === 0 && !x && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 text-[11.5px] text-text-tertiary", children: "Bağlı takvim yok." }),
          x && d.length === 0 && /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1 text-[11.5px] text-text-tertiary", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
            "senkronize ediliyor…"
          ] }),
          d.map((p) => /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: k(
                "flex items-start gap-2 rounded-md px-2 py-1.5",
                p.error && "bg-negative-50"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: k(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px]",
                      p.error ? "bg-negative-100 text-negative-700" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: k("fa", p.error ? "fa-triangle-exclamation" : "fa-calendar-days") })
                  }
                ),
                /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: aa[p.provider] ?? "Takvim" }),
                  /* @__PURE__ */ e.jsx("span", { className: k(
                    "block truncate text-[10.5px]",
                    p.error ? "text-negative-700" : "text-text-tertiary"
                  ), children: p.error ?? `${p.email} · ${p.eventCount} etkinlik` }),
                  p.error && /* @__PURE__ */ e.jsx("a", { href: "/Calendars", className: "text-[10.5px] font-semibold text-text-link hover:underline", children: "Yeniden bağla" })
                ] })
              ]
            },
            p.accountId
          )),
          !l && i && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                role: "switch",
                "aria-checked": u,
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
                      className: k("fa text-[11px]", u ? "fa-toggle-on text-accent" : "fa-toggle-off text-text-tertiary"),
                      "aria-hidden": "true"
                    }
                  )
                ]
              }
            ),
            o.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-1 px-2 pb-1", children: [
              o.slice(0, 3).map((p) => /* @__PURE__ */ e.jsxs(
                "span",
                {
                  title: p.name,
                  className: "flex items-center gap-1 rounded-full bg-neutral-subtle py-0.5 pe-2 ps-0.5 text-[10.5px] text-text-secondary",
                  children: [
                    /* @__PURE__ */ e.jsx(
                      "span",
                      {
                        className: "flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[8.5px] font-bold text-[color:var(--apya-avatar-fg)]",
                        "aria-hidden": "true",
                        children: sa(p.name)
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { className: "max-w-[86px] truncate", children: p.name })
                  ]
                },
                p.userId
              )),
              o.length > 3 && /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-medium text-text-tertiary", children: [
                "+",
                o.length - 3
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
            ].filter((p) => p.value > 0).map((p) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-2 py-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: k("h-[7px] w-[7px] shrink-0 rounded-full", p.dot), "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[11.5px] text-text-secondary", children: p.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-primary", children: p.value })
            ] }, p.key))
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
const na = { month: "Ay", week: "Hafta", day: "Gün", agenda: "Ajanda" };
function ia(t) {
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
function Ae() {
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
function la() {
  return /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: Ae,
      "aria-label": "Yeni görev",
      title: "Yeni görev",
      style: { bottom: "calc(1rem + env(safe-area-inset-bottom))" },
      className: "fixed right-4 z-fixed grid h-14 w-14 place-items-center rounded-full bg-accent text-text-inverse shadow-lg transition-colors duration-fast hover:bg-accent-600 active:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
      children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus text-[19px]", "aria-hidden": "true" })
    }
  );
}
function oa({
  title: t,
  view: a,
  onView: s,
  onPrev: r,
  onNext: l,
  onToday: d,
  overloadDays: x,
  onHelp: c,
  filterCount: u = 0,
  onClearFilters: i,
  lastSyncAt: m,
  syncError: o = !1,
  canCreateTask: b = !0,
  compact: f = !1
}) {
  const h = a !== "agenda", n = ia(m);
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
      (n || o) && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: k(
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium",
            o ? "bg-negative-50 text-negative-700" : "text-text-tertiary"
          ),
          title: o ? "Bir dış takvim senkronlanamıyor" : "Dış takvimlerin son senkron zamanı",
          children: [
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: k("h-[6px] w-[6px] rounded-full", o ? "bg-negative" : "bg-positive"),
                "aria-hidden": "true"
              }
            ),
            "Senkron",
            n ? ` · ${n}` : ""
          ]
        }
      ),
      u > 0 && i && /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: i,
          title: "Filtreleri temizle — kapalı kaynakları geri aç",
          className: "flex h-9 items-center gap-1.5 rounded-md border border-default bg-surface-base px-2.5 text-[12px] font-medium text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: [
            "Filtre",
            /* @__PURE__ */ e.jsx("span", { className: "rounded-full bg-primary-subtle px-1.5 text-[11px] font-semibold text-accent", children: u })
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
      /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(na).map(([p, v]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": a === p,
          onClick: () => s(p),
          className: k(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            a === p ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: v
        },
        p
      )) }),
      b && !f && /* @__PURE__ */ e.jsxs(z, { variant: "primary", size: "sm", onClick: Ae, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus me-1.5", "aria-hidden": "true" }),
        "Yeni görev"
      ] })
    ] })
  ] });
}
const ee = 44, ca = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], da = {
  [I.OVERDUE]: "bg-negative-50 text-negative-700",
  [I.DUE_TODAY]: "bg-warning-50 text-warning-700"
};
function ua({ load: t, capacity: a }) {
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
function xa({ days: t, byDay: a, today: s, capacity: r, onSelectItem: l, onSelectDay: d, selectedDay: x }) {
  const c = $(s), u = g.useRef(null), [i, m] = g.useState(() => {
    const N = /* @__PURE__ */ new Date();
    return N.getHours() * 60 + N.getMinutes();
  });
  g.useEffect(() => {
    const N = setInterval(() => {
      const y = /* @__PURE__ */ new Date();
      m(y.getHours() * 60 + y.getMinutes());
    }, 6e4);
    return () => clearInterval(N);
  }, []);
  const o = t.map($), b = {}, f = {};
  for (const N of o) {
    const y = a[N] ?? [];
    b[N] = y.filter(Xe), f[N] = y.filter((K) => !Xe(K));
  }
  const h = o.flatMap((N) => b[N]), { start: n, end: p } = Gt(h), v = Array.from({ length: p - n }, (N, y) => n + y), w = (p - n) * ee, E = o.includes(c) && i >= n * 60 && i <= p * 60;
  return g.useEffect(() => {
    if (!E || !u.current) return;
    const N = (i - n * 60) / 60 * ee;
    u.current.scrollTop = Math.max(0, N - 120);
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
                onClick: () => d(y),
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
                    ), children: ca[(N.getDay() + 6) % 7] }),
                    /* @__PURE__ */ e.jsx("span", { className: k(
                      "font-mono text-[13px] font-semibold tabular-nums",
                      D ? "text-accent" : "text-text-primary"
                    ), children: N.getDate() }),
                    r && K > r && /* @__PURE__ */ e.jsx("span", { className: "ms-auto rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: S.hours(K) })
                  ] }),
                  /* @__PURE__ */ e.jsx(ua, { load: K, capacity: r })
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
          o.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-[46px] flex-col gap-[3px] border-l border-subtle p-1", children: [
            f[N].slice(0, 4).map((y) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => l(y),
                title: y.title,
                className: k(
                  "flex w-full items-center gap-1 truncate rounded-[5px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                  da[y.risk] ?? "bg-neutral-subtle text-text-primary",
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
    /* @__PURE__ */ e.jsxs("div", { ref: u, className: "max-h-[520px] overflow-y-auto", children: [
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
            o.map((N) => /* @__PURE__ */ e.jsxs("div", { className: "relative border-l border-subtle", children: [
              v.map((y, K) => /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "absolute inset-x-0 border-t border-subtle",
                  style: { top: `${K * ee}px` }
                },
                y
              )),
              b[N].map((y) => {
                const K = he(y.startTime), D = y.endTime ? he(y.endTime) : K + 60, T = (K - n * 60) / 60 * ee, F = Math.max((D - K) / 60 * ee, 18);
                return /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => l(y),
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
function ma({ item: t }) {
  var m;
  const [a, s] = g.useState(""), [r, l] = g.useState(() => /* @__PURE__ */ new Set()), d = t.description ?? t.subtitle ?? "", x = V({
    queryKey: ["calendar", "projects-lookup"],
    queryFn: () => A.get("/api/app/task/projects-lookup"),
    staleTime: 10 * 6e4
  }), c = L({
    mutationFn: async () => {
      const o = new FormData();
      o.append("file", new Blob([`${t.title}

${d}`], { type: "text/plain" }), "toplanti-notlari.txt");
      const b = await fetch(`/api/ai-task-generator/parse?projectId=${a}`, {
        method: "POST",
        body: o,
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });
      if (!b.ok) throw new Error("Notlardan görev çıkarılamadı.");
      return b.json();
    },
    onSuccess: (o) => l(new Set(((o == null ? void 0 : o.suggestions) ?? []).map((b, f) => f)))
  }), u = L({
    mutationFn: () => {
      var o;
      return A.post("/api/ai-task-generator/create-tasks", {
        projectId: a,
        approvedTasks: (((o = c.data) == null ? void 0 : o.suggestions) ?? []).filter((b, f) => r.has(f))
      });
    },
    /* Olay takvimin kendi dinleyicisiyle feed ve ekip yükünü tazeler, damga Pano'yu. */
    onSuccess: () => zt({ entity: "task", action: "create" })
  }), i = ((m = c.data) == null ? void 0 : m.suggestions) ?? [];
  return /* @__PURE__ */ e.jsxs("section", { className: "border-t border-subtle px-4 py-3", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Toplantıdan görev" }),
    !d && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[11.5px] text-text-tertiary", children: "Bu etkinlikte not yok — çıkarılacak aksiyon maddesi bulunamaz." }),
    d && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs(
        "select",
        {
          value: a,
          onChange: (o) => s(o.target.value),
          "aria-label": "Görevlerin ekleneceği proje",
          className: "mt-1.5 w-full rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "Proje seçin…" }),
            (x.data ?? []).map((o) => /* @__PURE__ */ e.jsx("option", { value: o.id, children: o.name }, o.id))
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
        i.map((o, b) => /* @__PURE__ */ e.jsxs("label", { className: "flex cursor-pointer items-start gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
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
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[12px] text-text-primary", children: o.title })
        ] }, `${o.title}-${b}`)),
        /* @__PURE__ */ e.jsx(
          z,
          {
            size: "sm",
            variant: "primary",
            className: k("mt-2"),
            disabled: r.size === 0 || u.isPending || u.isSuccess,
            onClick: () => u.mutate(),
            children: u.isSuccess ? `${u.data} görev eklendi` : u.isPending ? "Ekleniyor…" : `${r.size} görev olarak ekle`
          }
        )
      ] })
    ] })
  ] });
}
const pa = {
  [I.OVERDUE]: { text: "Gecikmiş", cls: "bg-negative-50 text-negative-700" },
  [I.DUE_TODAY]: { text: "Bugün son gün", cls: "bg-warning-50 text-warning-700" }
};
function ne({ label: t, children: a }) {
  return a ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-subtle py-2.5 last:border-b-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11.5px] font-medium text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "min-w-0 text-right text-[12.5px] text-text-primary", children: a })
  ] }) : null;
}
function ba({ item: t, capacity: a, onClose: s, onReschedule: r, onComplete: l, isPending: d, error: x, onRetry: c }) {
  const [u, i] = g.useState(() => t.date.slice(0, 10)), m = O[t.source], o = pa[t.risk], b = t.date.slice(0, 10);
  g.useEffect(() => i(b), [b]);
  const f = () => {
    !u || u === b || r(t, /* @__PURE__ */ new Date(`${u}T00:00:00`));
  };
  return /* @__PURE__ */ e.jsx(oe, { open: !0, onOpenChange: (h) => {
    h || s();
  }, children: /* @__PURE__ */ e.jsxs(ce, { side: "right", title: t.title, className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md bg-neutral-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary", children: [
          m && /* @__PURE__ */ e.jsx("i", { className: k("fa text-[10px]", m.icon), "aria-hidden": "true" }),
          m == null ? void 0 : m.label
        ] }),
        o && /* @__PURE__ */ e.jsx("span", { className: k("rounded-md px-2 py-1 text-[11px] font-bold", o.cls), children: o.text }),
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
            value: u,
            onChange: (h) => i(h.target.value),
            className: "rounded-md border border-default bg-surface-base px-2 py-1 text-[12.5px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": "Son tarih"
          }
        ),
        u !== b && /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "primary", onClick: f, children: "Uygula" })
      ] }) : /* @__PURE__ */ e.jsxs("span", { className: "text-text-secondary", children: [
        S.dayTitle(/* @__PURE__ */ new Date(`${b}T00:00:00`)),
        /* @__PURE__ */ e.jsx("span", { className: "ml-1.5 text-text-tertiary", children: "· takvimden değiştirilemez" })
      ] }) }),
      /* @__PURE__ */ e.jsx(ne, { label: "Bağlam", children: t.subtitle }),
      /* @__PURE__ */ e.jsx(ne, { label: "Atanan", children: t.assigneeName }),
      /* @__PURE__ */ e.jsx(ne, { label: "Tutar", children: t.amount != null ? S.money(t.amount, t.currency) : null }),
      /* @__PURE__ */ e.jsx(ne, { label: "Gün yükü", children: t.loadHours != null ? `${S.hours(t.loadHours)}${a ? ` / ${S.hours(a)} kapasite` : ""}` : null })
    ] }),
    t.source === 7 && /* @__PURE__ */ e.jsx(ma, { item: t }),
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
const ut = ["calendar", "sync-settings"];
function fa(t) {
  return V({
    queryKey: ut,
    queryFn: () => A.get("/api/app/calendar/sync-settings"),
    enabled: t,
    staleTime: 3e4
  });
}
function ha() {
  const t = U();
  return L({
    /* ABP konvansiyonu: UpdateSyncRulesAsync → PUT (POST 405). */
    mutationFn: (a) => A.put("/api/app/calendar/sync-rules", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: ut }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
const xt = ["calendar", "sync-settings"], ga = ["calendar", "external"];
function mt() {
  return L({
    mutationFn: (t) => A.get(`/api/app/calendar/auth-url?provider=${t}`),
    /* Sağlayıcının kendi ekranına gidiliyor: SPA yönlendirmesi değil, tam sayfa. */
    onSuccess: (t) => {
      typeof t == "string" && t && (window.location.href = t);
    }
  });
}
function ya() {
  const t = U();
  return L({
    mutationFn: (a) => A.post(`/api/app/calendar/${a}/disconnect-account`, {}),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: xt }), t.invalidateQueries({ queryKey: ga });
    }
  });
}
function ka() {
  const t = U();
  return L({
    mutationFn: (a) => A.post(`/api/app/calendar/${a}/force-sync`, {}),
    /* "Son senkron" damgası ve senkron günlüğü bu çağrıyla değişir. */
    onSuccess: () => t.invalidateQueries({ queryKey: xt })
  });
}
const pt = ["calendar", "ical-feed"], Ke = ["calendar", "ical-subscriptions"];
function va(t) {
  return V({
    queryKey: pt,
    /* GetOrCreate: bağlantı yoksa ilk açılışta üretilir. */
    queryFn: () => A.post("/api/app/ical-feed/ensure", {}),
    enabled: t,
    staleTime: 1 / 0
  });
}
function ja() {
  const t = U();
  return L({
    mutationFn: () => A.post("/api/app/ical-feed/regenerate", {}),
    onSuccess: (a) => t.setQueryData(pt, a)
  });
}
function Na(t) {
  return V({
    queryKey: Ke,
    queryFn: () => A.get("/api/app/ical-subscription"),
    enabled: t,
    staleTime: 3e4
  });
}
function wa() {
  const t = U();
  return L({
    mutationFn: (a) => A.post("/api/app/ical-subscription", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Ke }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function Sa() {
  const t = U();
  return L({
    mutationFn: (a) => A.delete(`/api/app/ical-subscription/${a}`),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Ke }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function Da() {
  return L({
    mutationFn: (t) => A.post(`/api/app/ical-subscription/probe?url=${encodeURIComponent(t)}`, {})
  });
}
const Ca = {
  1: { label: "Google Calendar", icon: "fa-google", brand: "bg-[#ea4335]" },
  2: { label: "Microsoft Outlook", icon: "fa-windows", brand: "bg-[#0078d4]" },
  3: { label: "iCloud", icon: "fa-apple", brand: "bg-neutral-700" }
}, Ea = {
  0: { title: "Son değişen kazanır", desc: "İki taraf da düzenlenirse en son yapılan değişiklik uygulanır; ekranda geri alma şeridi çıkar." },
  1: { title: "APYA her zaman kazanır", desc: "Dış takvim salt-okunur ayna olur; dışarıdaki düzenleme geri alınır." }
}, Ze = {
  0: { icon: "fa-arrow-up-from-bracket", cls: "text-text-tertiary" },
  1: { icon: "fa-code-merge", cls: "text-warning-700" },
  2: { icon: "fa-triangle-exclamation", cls: "text-negative-700" }
};
function Pe(t) {
  if (!t) return "hiç";
  const a = Math.round((Date.now() - new Date(t).getTime()) / 6e4);
  return a < 1 ? "az önce" : a < 60 ? `${a} dk önce` : a < 1440 ? `${Math.round(a / 60)} sa önce` : S.dayShort(new Date(t));
}
function Ta({ account: t, onSave: a, saving: s }) {
  var h;
  const r = Ca[t.provider] ?? { label: "Takvim", icon: "fa-calendar", brand: "bg-neutral-700" }, l = ka(), d = ya(), [x, c] = g.useState(() => new Set(t.syncSources ?? [])), [u, i] = g.useState(t.conflictRule ?? 0), [m, o] = g.useState(t.isSyncEnabled);
  g.useEffect(() => {
    c(new Set(t.syncSources ?? [])), i(t.conflictRule ?? 0), o(t.isSyncEnabled);
  }, [t]);
  const b = m !== t.isSyncEnabled || u !== t.conflictRule || x.size !== (t.syncSources ?? []).length || [...x].some((n) => !(t.syncSources ?? []).includes(n)), f = (n) => c((p) => {
    const v = new Set(p);
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
          Pe(t.lastSyncTime)
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("label", { className: "flex shrink-0 items-center gap-1.5 text-[11.5px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: m,
            onChange: (n) => o(n.target.checked),
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
        const p = x.has(n);
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": p,
            onClick: () => f(n),
            className: k(
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              p ? "border-accent bg-primary-subtle text-accent" : "border-subtle bg-surface-base text-text-tertiary hover:bg-surface-hover"
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
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: Object.entries(Ea).map(([n, p]) => {
        const v = Number(n), w = u === v;
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
              /* @__PURE__ */ e.jsx("span", { className: k("block text-[12px] font-semibold", w ? "text-accent" : "text-text-primary"), children: p.title }),
              /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] leading-snug text-text-tertiary", children: p.desc })
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
              syncSources: [...x],
              syncProjectIds: t.syncProjectIds ?? [],
              conflictRule: u
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
const $a = [
  { value: 15, label: "15 dk" },
  { value: 60, label: "1 saat" },
  { value: 360, label: "6 saat" },
  { value: 1440, label: "Günlük" }
];
function Ra({ open: t }) {
  var v, w, E, N;
  const a = va(t), s = ja(), r = Na(t), l = wa(), d = Sa(), x = Da(), [c, u] = g.useState(""), [i, m] = g.useState(""), [o, b] = g.useState(60), [f, h] = g.useState(!1), n = (v = a.data) != null && v.path ? `${window.location.origin}${a.data.path}` : "", p = async () => {
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
        /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "outline", onClick: p, disabled: !n, children: f ? "Kopyalandı" : "Kopyala" })
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
              u(y.target.value), x.reset();
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
              onChange: (y) => m(y.target.value),
              placeholder: ((E = x.data) == null ? void 0 : E.suggestedName) || "Görünen ad",
              "aria-label": "Görünen ad",
              className: "min-w-0 flex-1 rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              value: o,
              onChange: (y) => b(Number(y.target.value)),
              "aria-label": "Yenileme sıklığı",
              className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
              children: $a.map((y) => /* @__PURE__ */ e.jsx("option", { value: y.value, children: y.label }, y.value))
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
              disabled: !c || l.isPending,
              onClick: () => l.mutate(
                { url: c, displayName: i, color: "accent", refreshMinutes: o },
                { onSuccess: () => {
                  u(""), m(""), x.reset();
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
          ), children: y.lastError ?? `${y.lastEventCount} etkinlik · ${Pe(y.lastFetchedAt)} çekildi` })
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
function za({ open: t, onClose: a }) {
  var x, c;
  const { data: s, isPending: r } = fa(t), l = ha(), d = mt();
  return /* @__PURE__ */ e.jsx(oe, { open: t, onOpenChange: (u) => {
    u || a();
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
        l.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "text-[11.5px] text-negative-700", children: ((x = l.error) == null ? void 0 : x.message) || "Senkron kuralları kaydedilemedi." }),
        s.accounts.map((u) => /* @__PURE__ */ e.jsx(
          Ta,
          {
            account: u,
            saving: l.isPending,
            onSave: (i) => l.mutate(i)
          },
          u.id
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
      d.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "text-[11.5px] text-negative-700", children: ((c = d.error) == null ? void 0 : c.message) || "Yetkilendirme adresi alınamadı." }),
      /* @__PURE__ */ e.jsx(Ra, { open: t }),
      /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
        /* @__PURE__ */ e.jsx("header", { className: "border-b border-subtle px-3 py-2", children: /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-semibold text-text-primary", children: "Senkron günlüğü" }) }),
        /* @__PURE__ */ e.jsx("div", { className: "px-3 py-2", children: ((s == null ? void 0 : s.log) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-2 text-[11.5px] text-text-tertiary", children: "Henüz senkron kaydı yok." }) : s.log.map((u) => {
          const i = Ze[u.kind] ?? Ze[0];
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
            /* @__PURE__ */ e.jsx("i", { className: k("fa mt-0.5 shrink-0 text-[11px]", i.icon, i.cls), "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[11.5px] leading-snug text-text-secondary", children: u.message }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: Pe(u.occurredAt) })
          ] }, u.id);
        }) })
      ] })
    ] }) })
  ] }) });
}
const bt = ["calendar", "preferences"];
function Aa() {
  return V({
    queryKey: bt,
    queryFn: () => A.get("/api/app/calendar/preferences"),
    staleTime: 5 * 6e4
  });
}
function Ka() {
  const t = U();
  return L({
    /* ABP konvansiyonu: Update* metotları PUT'a düşer. POST 405 döner ve
       ayarlar SESSİZCE kaydedilmemiş olur. */
    mutationFn: (a) => A.put("/api/app/calendar/preferences", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: bt }), t.invalidateQueries({ queryKey: ["calendar", "feed"] });
    }
  });
}
function Pa() {
  const t = U();
  return L({
    mutationFn: (a) => A.post("/api/app/calendar/bulk-reschedule", a),
    onSettled: () => t.invalidateQueries({ queryKey: ["calendar", "feed"] })
  });
}
function Ia({ open: t, items: a, today: s, capacity: r, onClose: l }) {
  const { suggestions: d, fixed: x } = g.useMemo(
    () => Ut(a, { today: s, capacity: r }),
    [a, s, r]
  ), [c, u] = g.useState(() => new Set(d.map((n) => n.item.key)));
  g.useEffect(() => {
    u(new Set(d.map((n) => n.item.key)));
  }, [d]);
  const i = Pa(), m = i.data ?? [], o = new Map(m.filter((n) => !n.succeeded).map((n) => [n.sourceId, n.error])), b = (n) => u((p) => {
    const v = new Set(p);
    return v.has(n) ? v.delete(n) : v.add(n), v;
  }), f = d.filter((n) => c.has(n.item.key)), h = () => {
    i.mutate(
      f.map((n) => ({
        source: n.item.source,
        sourceId: n.item.sourceId,
        newDate: $(n.date)
      })),
      {
        onSuccess: (n) => {
          (n ?? []).every((p) => p.succeeded) && l();
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
      d.map(({ item: n, date: p }) => {
        const v = o.get(n.sourceId);
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
                  onChange: () => b(n.key),
                  className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] font-semibold text-text-primary", children: n.title }),
                /* @__PURE__ */ e.jsxs("span", { className: "mt-0.5 flex items-center gap-1.5 text-[11px] text-text-tertiary", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "line-through", children: S.dayShort(/* @__PURE__ */ new Date(`${n.date.slice(0, 10)}T00:00:00`)) }),
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right text-[9px]", "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-accent", children: S.dayShort(p) }),
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
          var p;
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 py-1.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock mt-1 shrink-0 text-[10px] text-text-tertiary", "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] text-text-secondary", children: n.title }),
              /* @__PURE__ */ e.jsxs("span", { className: "block text-[11px] text-text-tertiary", children: [
                (p = O[n.source]) == null ? void 0 : p.label,
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
const Oa = [
  { value: 4, label: "4 sa" },
  { value: 6, label: "6 sa" },
  { value: 8, label: "8 sa" },
  { value: 0, label: "Kapalı" }
], be = ["Kaynaklar", "Dış takvim", "Kurallar"];
function Fa({ open: t, counts: a, onDone: s }) {
  var f, h;
  const [r, l] = g.useState(0), [d, x] = g.useState(() => new Set(Ce)), [c, u] = g.useState(8), i = Ka(), m = mt(), o = () => {
    i.mutate(
      {
        dailyCapacityHours: c > 0 ? c : 0,
        sources: [...d],
        setupCompleted: !0
      },
      /* onSettled DEĞİL: hata durumunda da kapanırsa ayarlar sessizce
         kaybolur ve kullanıcı kurulumu yaptığını sanır. */
      { onSuccess: s }
    );
  }, b = (n) => x((p) => {
    const v = new Set(p);
    return v.has(n) ? v.delete(n) : v.add(n), v;
  });
  return /* @__PURE__ */ e.jsx(rt, { open: t, onOpenChange: (n) => {
    n || s();
  }, children: /* @__PURE__ */ e.jsxs(nt, { className: "w-full max-w-[520px] p-0 h-auto max-h-[88dvh] tablet:min-h-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "shrink-0 border-b border-subtle px-5 py-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[18px] font-semibold tracking-tight text-text-primary", children: "Takviminizi kurun" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: "Hangi kaynakları göreceğinizi seçin, dilerseniz dış takvim bağlayın. Her ayarı sonradan değiştirebilirsiniz." }),
      /* @__PURE__ */ e.jsx("ol", { className: "mt-3 flex items-center gap-2", children: be.map((n, p) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx("span", { className: k(
          "flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold",
          p === r ? "bg-accent text-white" : p < r ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
        ), children: p + 1 }),
        /* @__PURE__ */ e.jsx("span", { className: k(
          "text-[11.5px]",
          p === r ? "font-semibold text-text-primary" : "text-text-tertiary"
        ), children: n }),
        p < be.length - 1 && /* @__PURE__ */ e.jsx("span", { className: "ms-1 text-text-tertiary", children: "·" })
      ] }, n)) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "min-h-0 overflow-y-auto px-5 py-4", children: [
      r === 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Takvimde ne görünsün?" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex flex-col gap-1.5", children: Ce.map((n) => {
          var w, E;
          const p = d.has(n), v = a == null ? void 0 : a[n];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": p,
              onClick: () => b(n),
              className: k(
                "flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                p ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: k("fa text-[12px]", (w = O[n]) == null ? void 0 : w.icon, p ? "text-accent" : "text-text-tertiary"), "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-medium text-text-primary", children: (E = O[n]) == null ? void 0 : E.label }),
                v != null && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: v })
              ]
            },
            n
          );
        }) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-[13px] font-semibold text-text-primary", children: "Günlük kapasiteniz" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex gap-1.5", children: Oa.map((n) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => u(n.value),
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
        m.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "mt-2 text-[11.5px] text-negative-700", children: ((f = m.error) == null ? void 0 : f.message) || "Yetkilendirme adresi alınamadı." })
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
      /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "ghost", onClick: o, disabled: i.isPending, children: "Şimdilik atla" }),
      r < be.length - 1 ? /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "primary", onClick: () => l((n) => n + 1), children: "Devam" }) : /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "primary", onClick: o, disabled: i.isPending, children: i.isPending ? "Kaydediliyor…" : "Bitir" })
    ] })
  ] }) });
}
const Ma = [
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
function et({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "rounded border border-strong bg-surface-raised px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-text-primary", children: t });
}
function La({ open: t, onClose: a }) {
  return /* @__PURE__ */ e.jsx(rt, { open: t, onOpenChange: (s) => {
    s || a();
  }, children: /* @__PURE__ */ e.jsxs(nt, { className: "w-full max-w-[480px] p-0", children: [
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
      Ma.map((s) => /* @__PURE__ */ e.jsxs("section", { className: "mb-4 last:mb-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: s.title }),
        s.rows.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center gap-1", children: r.keys.map((l) => /* @__PURE__ */ e.jsx(et, { children: l }, l)) }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-secondary", children: r.label })
        ] }, r.label))
      ] }, s.title)),
      /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] leading-snug text-text-tertiary", children: [
        "Takvim ızgarası tek sekme durağıdır: ",
        /* @__PURE__ */ e.jsx(et, { children: "Tab" }),
        " ile içine girin, sonra oklarla gezin. Sürükle-bırakla yapılan her taşıma buradaki kısayollarla da yapılabilir."
      ] })
    ] })
  ] }) });
}
function qa({ polite: t, assertive: a }) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("p", { role: "status", "aria-live": "polite", className: "sr-only", children: t }),
    /* @__PURE__ */ e.jsx("p", { role: "alert", "aria-live": "assertive", className: "sr-only", children: a })
  ] });
}
const _a = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
function Ba({ items: t, month: a, today: s, generatedAt: r }) {
  var b;
  const l = ot(a), d = $(s), x = {};
  for (const f of t ?? [])
    (x[b = f.date.slice(0, 10)] ?? (x[b] = [])).push(f);
  const c = Re(s), u = (t ?? []).filter((f) => {
    const h = f.date.slice(0, 10);
    return h >= $(c) && h <= $(M(c, 7));
  }), { overdue: i, days: m } = dt(u, s), o = (f) => f === I.OVERDUE ? "border-l-[3px] border-l-black" : f === I.DUE_TODAY ? "border-l-[3px] border-l-neutral-500" : "border-l-[3px] border-l-neutral-300";
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
      /* @__PURE__ */ e.jsx("div", { className: "mt-3 grid grid-cols-7", children: _a.map((f) => /* @__PURE__ */ e.jsx("div", { className: "pb-1 text-[7.5pt] font-bold uppercase tracking-wide text-neutral-500", children: f }, f)) }),
      /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-l border-t border-neutral-300", children: l.map((f) => {
        const h = $(f), n = x[h] ?? [], p = f.getMonth() !== a.getMonth();
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
                p ? "text-neutral-300" : "text-neutral-700"
              ), children: f.getDate() }),
              n.slice(0, 4).map((v) => /* @__PURE__ */ e.jsx(
                "p",
                {
                  className: k(
                    "mt-0.5 truncate ps-1 text-[7.5pt] leading-tight",
                    o(v.risk),
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
          i.map((f) => /* @__PURE__ */ e.jsx(tt, { item: f, showDate: !0 }, f.key))
        ] }),
        m.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "mb-4 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "border-b border-black pb-1 text-[9pt] font-bold uppercase tracking-wide", children: [
            S.dayTitle(f.date),
            f.isToday ? " · Bugün" : ""
          ] }),
          f.items.map((h) => /* @__PURE__ */ e.jsx(tt, { item: h }, h.key))
        ] }, f.key))
      ] })
    ] })
  ] });
}
function tt({ item: t, showDate: a = !1 }) {
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
function Ya({ rows: t, days: a, capacity: s, loading: r }) {
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
      const x = {};
      for (const c of d.days ?? []) x[c.date.slice(0, 10)] = c;
      return /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "truncate text-[11.5px] font-medium text-text-primary", children: d.name }),
          /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] tabular-nums text-text-tertiary", children: S.hours(d.totalHours) })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-0.5 flex gap-[2px]", children: (l.length ? l : (d.days ?? []).map((c) => c.date.slice(0, 10))).map((c) => {
          const u = x[c], i = (u == null ? void 0 : u.hours) ?? 0, m = s && i > s, o = s ? Math.min(i / s, 1) : i > 0 ? 1 : 0;
          return /* @__PURE__ */ e.jsx(
            "span",
            {
              title: `${c}: ${S.hours(i)}${u != null && u.itemCount ? ` · ${u.itemCount} öğe` : ""}`,
              className: "h-[6px] flex-1 overflow-hidden rounded-sm bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: k("block h-full", m ? "bg-negative" : "bg-accent"),
                  style: { width: `${o * 100}%` }
                }
              )
            },
            c
          );
        }) })
      ] }, d.userId);
    }),
    /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[10.5px] leading-snug text-text-tertiary", children: "Yalnız görebildiğiniz projelerin görevleri sayılır." })
  ] });
}
const Ga = 6e4;
function Ua({ from: t, to: a }) {
  const s = $(t), r = $(a);
  return V({
    queryKey: ["calendar", "feed", s, r],
    queryFn: () => A.get(`/api/app/calendar/feed?From=${s}&To=${r}`),
    staleTime: Ga,
    placeholderData: (l) => l
    /* ay geçişinde boş ekran yerine eski veri */
  });
}
const ft = "apya.calendar.view", $e = "apya.calendar.sources", ge = ["month", "week", "day", "agenda"];
function ht(t) {
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
function Qa() {
  const t = new URLSearchParams(window.location.search).get("view");
  if (ge.includes(t)) return t;
  const a = ht(ft);
  return ge.includes(a) ? a : null;
}
function Ha() {
  const t = ht($e);
  if (!t) return new Set(le);
  const a = t.split(",").map(Number).filter((s) => le.includes(s));
  return a.length ? new Set(a) : new Set(le);
}
function Wa({ defaultView: t = "month" } = {}) {
  const [a] = g.useState(Qa), [s, r] = g.useState(() => a ?? t), [l, d] = g.useState(Ha);
  g.useEffect(() => {
    const m = new URL(window.location.href);
    m.searchParams.get("view") !== s && (m.searchParams.set("view", s), window.history.replaceState({}, "", m));
  }, [s]);
  const x = g.useCallback((m) => {
    ge.includes(m) && (r(m), Se(ft, m));
  }, []), c = g.useCallback((m) => {
    d((o) => {
      const b = new Set(o);
      return b.has(m) ? b.delete(m) : b.add(m), Se($e, [...b].join(",")), b;
    });
  }, []), u = g.useCallback((m) => {
    a || ge.includes(m) && r((o) => o === m ? o : m);
  }, [a]), i = g.useCallback(() => {
    const m = new Set(le);
    d(m), Se($e, [...m].join(","));
  }, []);
  return { view: s, setView: x, applyResponsiveDefault: u, enabledSources: l, toggleSource: c, resetSources: i };
}
const W = ["calendar", "feed"];
function Va(t, a, s) {
  t.setQueriesData({ queryKey: W }, (r) => r != null && r.items ? {
    ...r,
    items: r.items.map((l) => l.key === a ? { ...l, date: `${s}T00:00:00` } : l)
  } : r);
}
function Xa(t, a) {
  t.setQueriesData({ queryKey: W }, (s) => s != null && s.items ? {
    ...s,
    items: s.items.map((r) => r.key === a ? { ...r, isDone: !0, risk: 0, loadHours: null } : r)
  } : s);
}
function Ja({ onOfflineFailure: t } = {}) {
  const a = U(), [s, r] = g.useState(null), [l, d] = g.useState({}), [x, c] = g.useState({}), u = g.useCallback((o) => {
    d((b) => {
      if (!b[o]) return b;
      const f = { ...b };
      return delete f[o], f;
    });
  }, []), i = L({
    mutationFn: ({ item: o, newDate: b }) => A.post("/api/app/calendar/reschedule-item", {
      source: o.source,
      sourceId: o.sourceId,
      newDate: $(b)
    }),
    onMutate: async ({ item: o, newDate: b }) => {
      await a.cancelQueries({ queryKey: W });
      const f = a.getQueriesData({ queryKey: W });
      return u(o.key), c((h) => ({ ...h, [o.key]: !0 })), Va(a, o.key, $(b)), { snapshot: f, previousDate: o.date.slice(0, 10) };
    },
    onError: (o, { item: b, newDate: f }, h) => {
      var n;
      if (typeof navigator < "u" && !navigator.onLine) {
        t == null || t({
          key: b.key,
          payload: { source: b.source, sourceId: b.sourceId, newDate: $(f) }
        });
        return;
      }
      (n = h == null ? void 0 : h.snapshot) == null || n.forEach(([p, v]) => a.setQueryData(p, v)), d((p) => ({
        ...p,
        [b.key]: (o == null ? void 0 : o.message) || "Kaydedilemedi — tarih değişmedi."
      }));
    },
    onSuccess: (o, { item: b, newDate: f }, h) => {
      Ve(), r({
        key: b.key,
        message: `“${b.title}” ${$(f)} tarihine taşındı.`,
        undo: () => i.mutate({
          item: { ...b, date: `${$(f)}T00:00:00` },
          newDate: /* @__PURE__ */ new Date(`${h.previousDate}T00:00:00`)
        })
      });
    },
    onSettled: (o, b, { item: f }) => {
      c((h) => {
        const n = { ...h };
        return delete n[f.key], n;
      }), a.invalidateQueries({ queryKey: W });
    }
  }), m = L({
    mutationFn: ({ item: o }) => A.post("/api/app/calendar/complete-item", {
      source: o.source,
      sourceId: o.sourceId
    }),
    onMutate: async ({ item: o }) => {
      await a.cancelQueries({ queryKey: W });
      const b = a.getQueriesData({ queryKey: W });
      return u(o.key), c((f) => ({ ...f, [o.key]: !0 })), Xa(a, o.key), { snapshot: b };
    },
    onError: (o, { item: b }, f) => {
      var h;
      (h = f == null ? void 0 : f.snapshot) == null || h.forEach(([n, p]) => a.setQueryData(n, p)), d((n) => ({
        ...n,
        [b.key]: (o == null ? void 0 : o.message) || "Tamamlanamadı."
      }));
    },
    onSuccess: (o, { item: b }) => {
      Ve(), r({ key: b.key, message: `“${b.title}” tamamlandı.`, undo: null });
    },
    onSettled: (o, b, { item: f }) => {
      c((h) => {
        const n = { ...h };
        return delete n[f.key], n;
      }), a.invalidateQueries({ queryKey: W });
    }
  });
  return {
    reschedule: (o, b) => i.mutate({ item: o, newDate: b }),
    complete: (o) => m.mutate({ item: o }),
    retry: (o, b) => b ? i.mutate({ item: o, newDate: b }) : m.mutate({ item: o }),
    lastAction: s,
    dismissAction: () => r(null),
    errors: l,
    clearError: u,
    pending: x
  };
}
function Za({ from: t, to: a, enabled: s = !0 }) {
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
const es = ["INPUT", "TEXTAREA", "SELECT"];
function ts({
  onView: t,
  onToday: a,
  onPrev: s,
  onNext: r,
  onDeferSelected: l,
  onUndo: d,
  onToggleHelp: x,
  enabled: c = !0
}) {
  g.useEffect(() => {
    if (!c) return;
    const u = (i) => {
      const m = i.target;
      if (!(es.includes(m == null ? void 0 : m.tagName) || m != null && m.isContentEditable)) {
        if ((i.metaKey || i.ctrlKey) && i.key.toLowerCase() === "z") {
          i.preventDefault(), d == null || d();
          return;
        }
        if (!(i.metaKey || i.ctrlKey || i.altKey)) {
          if (i.shiftKey) {
            i.key === "ArrowRight" && (i.preventDefault(), l == null || l(1)), i.key === "ArrowLeft" && (i.preventDefault(), l == null || l(-1)), i.key === "?" && (i.preventDefault(), x == null || x());
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
    return window.addEventListener("keydown", u), () => window.removeEventListener("keydown", u);
  }, [c, t, a, s, r, l, d, x]);
}
function as({ from: t, to: a, enabled: s }) {
  const r = $(t), l = $(a);
  return V({
    queryKey: ["calendar", "team-load", r, l],
    queryFn: () => A.get(`/api/app/calendar/team-load?From=${r}&To=${l}`),
    enabled: s,
    staleTime: 6e4
  });
}
const gt = () => Pt("apya.calendar.offlineQueue");
function De() {
  try {
    const t = window.localStorage.getItem(gt()), a = t ? JSON.parse(t) : [];
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}
function at(t) {
  try {
    window.localStorage.setItem(gt(), JSON.stringify(t));
  } catch {
  }
}
function ss({ onFlush: t }) {
  const [a, s] = g.useState(() => typeof navigator > "u" ? !0 : navigator.onLine), [r, l] = g.useState(() => De().length), d = g.useRef(!1), x = g.useCallback((u) => {
    const m = De().filter((o) => o.key !== u.key).concat(u);
    at(m), l(m.length);
  }, []), c = g.useCallback(async () => {
    if (d.current) return;
    const u = De();
    if (u.length !== 0) {
      d.current = !0;
      try {
        const i = [];
        for (const m of u)
          try {
            await t(m);
          } catch (o) {
            Kt(o) || i.push(m);
          }
        at(i), l(i.length);
      } finally {
        d.current = !1;
      }
    }
  }, [t]);
  return g.useEffect(() => {
    const u = () => {
      s(!0), c();
    }, i = () => s(!1);
    return window.addEventListener("online", u), window.addEventListener("offline", i), navigator.onLine && c(), () => {
      window.removeEventListener("online", u), window.removeEventListener("offline", i);
    };
  }, [c]), { isOnline: a, pendingCount: r, enqueue: x, flush: c };
}
function rs() {
  const t = g.useRef(null), [a, s] = g.useState(0);
  return g.useLayoutEffect(() => {
    const r = t.current;
    if (!r || (s(r.getBoundingClientRect().width), typeof ResizeObserver > "u")) return;
    const l = new ResizeObserver((d) => {
      for (const x of d)
        s(x.contentRect.width);
    });
    return l.observe(r), () => l.disconnect();
  }, []), [t, a];
}
function ns(t) {
  return t === 0 || t >= 1180 ? "wide" : t >= 780 ? "medium" : "narrow";
}
const is = 60;
function fe(t, a, s) {
  return a === "week" ? M(t, 7 * s) : a === "day" ? M(t, s) : new Date(t.getFullYear(), t.getMonth() + s, 1);
}
function ls() {
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Array.from({ length: 7 }, (t, a) => /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-2", children: /* @__PURE__ */ e.jsx(ie, { height: 10 }) }, a)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: Array.from({ length: ze }, (t, a) => /* @__PURE__ */ e.jsxs("div", { className: "min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0", children: [
      /* @__PURE__ */ e.jsx(ie, { height: 12, width: "40%", className: "ml-auto" }),
      a % 3 === 0 && /* @__PURE__ */ e.jsx(ie, { height: 14, className: "mt-2" })
    ] }, a)) })
  ] });
}
function os() {
  var _e, me, Be, Ye, Ge, Ue, Qe, He;
  const [t, a] = rs(), s = ns(a), r = s === "narrow", l = g.useMemo(() => Ee(/* @__PURE__ */ new Date()), []), [d, x] = g.useState(l), [c, u] = g.useState(null), [i, m] = g.useState(null), [o, b] = g.useState(!1), [f, h] = g.useState(!1), [n, p] = g.useState(!1), [v, w] = g.useState(!1), [E, N] = g.useState(null), [y, K] = g.useState(!1), { view: D, setView: T, applyResponsiveDefault: F, enabledSources: X, toggleSource: ke, resetSources: J } = Wa();
  g.useEffect(() => {
    a !== 0 && F(r ? "agenda" : "month");
  }, [a, r, F]);
  const { range: q, title: ae, weekDayList: te } = g.useMemo(() => {
    if (D === "agenda")
      return {
        range: { from: M(l, -60), to: M(l, is) },
        title: "Ajanda",
        weekDayList: null
      };
    if (D === "week") {
      const R = Bt(d);
      return {
        range: { from: R[0], to: R[6] },
        title: `${S.dayShort(R[0])} – ${S.dayShort(R[6])} ${R[6].getFullYear()}`,
        weekDayList: R
      };
    }
    if (D === "day") {
      const R = Ee(d);
      return { range: { from: R, to: R }, title: S.dayTitle(R), weekDayList: [R] };
    }
    const j = lt(d);
    return {
      range: { from: j, to: M(j, ze - 1) },
      title: S.monthTitle(d),
      weekDayList: null
    };
  }, [D, d, l]), { data: C, isPending: Q, isError: yt, refetch: kt } = Ua(q), B = Za(q), Ie = Aa(), ve = as({ from: q.from, to: q.to, enabled: y });
  At();
  const _ = ss({
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
  ), Y = g.useMemo(() => ct(H), [H]), G = (C == null ? void 0 : C.dailyCapacityHours) ?? null, Oe = g.useMemo(() => {
    const j = {};
    for (const R of (C == null ? void 0 : C.sources) ?? []) j[R.source] = R.count;
    return j;
  }, [C]), vt = g.useMemo(() => G ? Object.values(Y).filter((j) => ye(j) > G).length : 0, [Y, G]), Fe = g.useMemo(() => {
    var We;
    let j = 0, R = 0;
    for (const re of H)
      re.isDone || (re.risk === I.OVERDUE ? j++ : re.risk === I.DUE_TODAY && R++);
    const Z = (((We = B.data) == null ? void 0 : We.accounts) ?? []).filter((re) => re.error).length;
    return { overdue: j, dueToday: R, syncError: Z };
  }, [H, B.data]), Me = g.useMemo(
    () => ((C == null ? void 0 : C.sources) ?? []).filter((j) => j.isAvailable),
    [C]
  ), jt = g.useMemo(
    () => Me.filter((j) => !X.has(j.source)).length,
    [Me, X]
  ), Nt = g.useMemo(() => {
    var R;
    const j = (((R = B.data) == null ? void 0 : R.accounts) ?? []).map((Z) => Z.lastSyncTime).filter(Boolean).sort();
    return j.length ? j[j.length - 1] : null;
  }, [B.data]);
  g.useEffect(() => {
    c && !Y[c] && !Q && (c >= $(q.from) && c <= $(q.to) || u(null));
  }, [c, Y, Q, q]);
  const xe = g.useCallback((j) => m(j.key), []), Le = g.useCallback(() => {
    x(l), u($(l));
  }, [l]), P = Ja({ onOfflineFailure: _.enqueue }), je = !!((Be = (me = (_e = window.abp) == null ? void 0 : _e.auth) == null ? void 0 : me.isGranted) != null && Be.call(me, "Platform.Tasks.Create")), wt = g.useCallback((j) => {
    const R = E ?? c;
    if (R)
      for (const Z of Y[R] ?? [])
        Z.canReschedule && !Z.isDone && P.reschedule(Z, M(/* @__PURE__ */ new Date("T00:00:00"), j));
  }, [E, c, Y, P]);
  ts({
    onView: T,
    onToday: Le,
    onPrev: () => x((j) => fe(j, D, -1)),
    onNext: () => x((j) => fe(j, D, 1)),
    onDeferSelected: wt,
    onUndo: () => {
      var j, R;
      return (R = (j = P.lastAction) == null ? void 0 : j.undo) == null ? void 0 : R.call(j);
    },
    onToggleHelp: () => w((j) => !j)
  });
  const qe = ue.length > 0, St = qe && H.length === 0, Dt = c ? Y[c] ?? [] : [], se = i ? ue.find((j) => j.key === i) ?? null : null, Ne = c && /* @__PURE__ */ e.jsx(
    Wt,
    {
      dayKey: c,
      items: Dt,
      capacity: G,
      onSelectItem: xe,
      onClose: () => u(null)
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { ref: t, className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsx(
      oa,
      {
        title: ae,
        view: D,
        onView: T,
        onPrev: () => x((j) => fe(j, D, -1)),
        onNext: () => x((j) => fe(j, D, 1)),
        onToday: Le,
        overloadDays: vt,
        onHelp: () => w(!0),
        filterCount: jt,
        onClearFilters: J,
        lastSyncAt: Nt,
        syncError: Fe.syncError > 0,
        compact: r,
        canCreateTask: je
      }
    ),
    yt && /* @__PURE__ */ e.jsxs("div", { className: "rounded-card border border-negative-100 bg-negative-50 px-3 py-2.5 text-[12.5px] text-negative-700", children: [
      "Takvim yüklenemedi.",
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => kt(), className: "ml-2 font-semibold underline", children: "Yeniden dene" })
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
        ra,
        {
          sources: (C == null ? void 0 : C.sources) ?? [],
          counts: Oe,
          enabled: X,
          onToggle: ke,
          compact: s !== "wide",
          externalAccounts: ((Ye = B.data) == null ? void 0 : Ye.accounts) ?? [],
          externalLoading: B.isFetching,
          onOpenSync: () => b(!0),
          teamOpen: y,
          onToggleTeam: () => K((j) => !j),
          teamContent: y ? /* @__PURE__ */ e.jsx(
            Ya,
            {
              rows: ve.data,
              days: te,
              capacity: G,
              loading: ve.isPending
            }
          ) : null,
          teamMembers: ve.data ?? [],
          riskCounts: Fe
        }
      ) }),
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        Q ? /* @__PURE__ */ e.jsx(ls, {}) : St ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
          de,
          {
            icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-filter-circle-xmark" }),
            title: "Bu filtreyle gösterilecek öğe yok",
            description: "Kaynak rayında kapattığınız türler bu aralıktaki tüm öğeleri gizliyor.",
            action: /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "outline", onClick: J, children: "Kaynakları aç" })
          }
        ) }) : qe ? D === "month" ? /* @__PURE__ */ e.jsx(
          ta,
          {
            month: d,
            byDay: Y,
            today: l,
            capacity: G,
            selectedDay: c,
            onSelectItem: xe,
            onSelectDay: u,
            onDropItem: P.reschedule,
            focusedDay: E,
            onFocusDay: N,
            onNavigate: (j) => x(j),
            pending: P.pending,
            errors: P.errors
          }
        ) : te ? /* @__PURE__ */ e.jsx(
          xa,
          {
            days: te,
            byDay: Y,
            today: l,
            capacity: G,
            selectedDay: c,
            onSelectItem: xe,
            onSelectDay: u
          }
        ) : /* @__PURE__ */ e.jsx(
          Ht,
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
            action: je ? /* @__PURE__ */ e.jsx(z, { size: "sm", variant: "outline", onClick: Ae, children: "Görev oluştur" }) : null
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
      j || u(null);
    }, children: /* @__PURE__ */ e.jsx(ce, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: Ne }) }),
    r && c && /* @__PURE__ */ e.jsx(oe, { open: !0, onOpenChange: (j) => {
      j || u(null);
    }, children: /* @__PURE__ */ e.jsx(ce, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: Ne }) }),
    r && je && /* @__PURE__ */ e.jsx(la, {}),
    /* @__PURE__ */ e.jsx(
      Ba,
      {
        items: H,
        month: d,
        today: l,
        generatedAt: S.dayShort(l)
      }
    ),
    /* @__PURE__ */ e.jsx(La, { open: v, onClose: () => w(!1) }),
    /* @__PURE__ */ e.jsx(
      qa,
      {
        polite: ((Ge = P.lastAction) == null ? void 0 : Ge.message) ?? "",
        assertive: ((He = (Qe = (Ue = B.data) == null ? void 0 : Ue.accounts) == null ? void 0 : Qe.find((j) => j.error)) == null ? void 0 : He.error) ?? ""
      }
    ),
    /* @__PURE__ */ e.jsx(za, { open: o, onClose: () => b(!1) }),
    /* @__PURE__ */ e.jsx(
      Ia,
      {
        open: f,
        items: H,
        today: l,
        capacity: G,
        onClose: () => h(!1)
      }
    ),
    /* @__PURE__ */ e.jsx(
      Fa,
      {
        open: Ie.data ? !Ie.data.setupCompleted && !n : !1,
        counts: Oe,
        onDone: () => p(!0)
      }
    ),
    se && /* @__PURE__ */ e.jsx(
      ba,
      {
        item: se,
        capacity: G,
        onClose: () => m(null),
        onReschedule: P.reschedule,
        onComplete: P.complete,
        isPending: !!P.pending[se.key],
        error: P.errors[se.key],
        onRetry: () => P.clearError(se.key)
      }
    )
  ] });
}
const st = document.getElementById("apya-calendar-root");
st && Ct(st).render(
  /* @__PURE__ */ e.jsx(Et, { children: /* @__PURE__ */ e.jsx(Tt, { children: /* @__PURE__ */ e.jsx($t, { children: /* @__PURE__ */ e.jsx(os, {}) }) }) })
);
