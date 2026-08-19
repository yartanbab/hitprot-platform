import { j as e, d as Ne, r as g, b as Ge } from "./react-vendor.js";
import { c as y, B as T, d as J, e as Z, S as W, D as Le, i as Ue, T as He } from "./Dialog.js";
import { D as Qe } from "./useDeviceMode.js";
import { a as Ve } from "./QueryProvider.js";
import { E as ee } from "./EmptyState.js";
import { u as L, a as G, b as M } from "./query-vendor.js";
import { a as R } from "./httpClient.js";
/* empty css      */
const A = {
  1: { key: "task", label: "Görev", plural: "görev", icon: "fa-circle-check" },
  2: { key: "invoice", label: "Fatura", plural: "fatura", icon: "fa-file-invoice" },
  3: { key: "grant", label: "Hibe", plural: "hibe", icon: "fa-award" },
  4: { key: "expense", label: "Gider", plural: "gider", icon: "fa-arrow-trend-down" },
  5: { key: "income", label: "Gelir", plural: "gelir", icon: "fa-arrow-trend-up" },
  6: { key: "cash", label: "Kasa hareketi", plural: "kasa hareketi", icon: "fa-wallet" },
  7: { key: "external", label: "Dış etkinlik", plural: "dış etkinlik", icon: "fa-calendar-days" }
}, X = [1, 2, 3, 4, 5, 6, 7], xe = [1, 2, 3, 4, 5, 6], F = { DUE_TODAY: 1, OVERDUE: 2 }, We = (t) => t.risk === F.OVERDUE || t.risk === F.DUE_TODAY, Ee = 864e5, me = (t) => new Date(t.getFullYear(), t.getMonth(), t.getDate()), P = (t, a) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + a);
function D(t) {
  const a = (r) => (r < 10 ? "0" : "") + r;
  return `${t.getFullYear()}-${a(t.getMonth() + 1)}-${a(t.getDate())}`;
}
function Re(t) {
  const a = (t.getDay() + 6) % 7;
  return new Date(t.getTime() - a * Ee);
}
const $e = (t) => Re(new Date(t.getFullYear(), t.getMonth(), 1)), fe = 42;
function Xe(t) {
  const a = $e(t);
  return Array.from({ length: fe }, (r, s) => new Date(a.getTime() + s * Ee));
}
const Je = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }), Ze = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }), et = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }), N = {
  monthTitle: (t) => Je.format(t),
  dayTitle: (t) => Ze.format(t),
  dayShort: (t) => et.format(t),
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
function ze(t) {
  const a = {};
  for (const r of t ?? []) {
    const s = (r.date || "").slice(0, 10);
    s && (a[s] ?? (a[s] = [])).push(r);
  }
  return a;
}
const le = (t) => (t ?? []).reduce((a, r) => a + (r.loadHours ?? 0), 0);
function tt(t, { maxPills: a = 3, maxRiskPills: r = 2 } = {}) {
  const s = t ?? [];
  if (s.length === 0) return { pills: [], summaries: [] };
  if (s.length <= a) return { pills: s, summaries: [] };
  const u = s.filter(We).slice(0, r), o = new Set(u.map((c) => c.key)), p = /* @__PURE__ */ new Map();
  for (const c of s) {
    if (o.has(c.key)) continue;
    const n = p.get(c.source) ?? { source: c.source, count: 0, amount: 0, hasAmount: !1, only: null };
    n.count += 1, n.only = n.count === 1 ? c : null, c.amount != null && (n.amount += c.amount, n.hasAmount = !0), p.set(c.source, n);
  }
  const x = [];
  for (const c of X) {
    const n = p.get(c);
    n && (n.count === 1 && n.only ? u.push(n.only) : x.push(n));
  }
  return { pills: u, summaries: x };
}
function at(t, { compact: a = !0 } = {}) {
  const r = A[t.source], s = `${t.count} ${r ? r.plural : "öğe"}`;
  if (!t.hasAmount) return s;
  const l = a ? N.moneyCompact(t.amount) : N.money(t.amount);
  return `${s} · ${l}`;
}
function st(t, a) {
  const r = D(a), s = (t ?? []).filter((x) => !x.isDone), l = s.filter((x) => x.date.slice(0, 10) < r && x.risk === F.OVERDUE), u = s.filter((x) => x.date.slice(0, 10) >= r), o = ze(u), p = Object.keys(o).sort().map((x) => ({
    key: x,
    date: /* @__PURE__ */ new Date(`${x}T00:00:00`),
    isToday: x === r,
    items: o[x]
  }));
  return { overdue: l, days: p };
}
function rt(t) {
  const a = Re(me(t));
  return Array.from({ length: 7 }, (r, s) => P(a, s));
}
const nt = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }), de = (t) => t ? nt.format(new Date(t)) : "";
function ne(t) {
  const a = new Date(t);
  return a.getHours() * 60 + a.getMinutes();
}
function it(t) {
  let a = 8, r = 18;
  for (const s of t ?? [])
    s.startTime && (a = Math.min(a, Math.floor(ne(s.startTime) / 60)), r = Math.max(r, Math.ceil(ne(s.endTime ?? s.startTime) / 60)));
  return { start: Math.max(0, a), end: Math.min(24, Math.max(r, a + 4)) };
}
const we = (t) => !!t.startTime, Se = (t) => t.getDay() === 0 || t.getDay() === 6;
function lt(t, { today: a, capacity: r = null, horizonDays: s = 21, fallbackPerDay: l = 3 } = {}) {
  const u = D(a), o = (t ?? []).filter((b) => !b.isDone), p = o.filter((b) => b.date.slice(0, 10) < u && b.risk === F.OVERDUE), x = p.filter((b) => b.canReschedule), c = p.filter((b) => !b.canReschedule), n = {}, m = {};
  for (const b of o) {
    const d = b.date.slice(0, 10);
    d < u || (n[d] = (n[d] ?? 0) + (b.loadHours ?? 0), m[d] = (m[d] ?? 0) + 1);
  }
  const i = [];
  let h = 0;
  for (const b of x) {
    let d = null;
    for (; h < s; ) {
      const k = P(a, h);
      if (Se(k)) {
        h += 1;
        continue;
      }
      const v = D(k), O = n[v] ?? 0, $ = m[v] ?? 0, j = b.loadHours ?? 0;
      if (r ? O + j <= r : $ < l) {
        n[v] = O + j, m[v] = $ + 1, d = k;
        break;
      }
      h += 1;
    }
    if (!d) {
      let k = P(a, s);
      for (; Se(k); ) k = P(k, 1);
      d = k;
    }
    i.push({ item: b, date: d });
  }
  return { suggestions: i, fixed: c };
}
const ot = {
  [F.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [F.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function pe({ item: t, onSelect: a, showDate: r = !1 }) {
  const s = A[t.source], l = ot[t.risk];
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
            children: s && /* @__PURE__ */ e.jsx("i", { className: y("fa", s.icon) })
          }
        ),
        /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("span", { className: y("block truncate text-[13px] font-semibold text-text-primary", t.isDone && "line-through opacity-65"), children: t.title }),
          /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block truncate text-[11.5px] text-text-tertiary", children: [
            r ? N.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
            t.subtitle,
            t.assigneeName,
            t.amount != null ? N.money(t.amount, t.currency) : null
          ].filter(Boolean).join(" · ") || (s ? s.label : "") })
        ] }),
        l && /* @__PURE__ */ e.jsx("span", { className: y("shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold", l.className), children: l.label })
      ]
    }
  );
}
function ct({ items: t, today: a, onSelectItem: r, onSmartDefer: s }) {
  const { overdue: l, days: u } = st(t, a);
  return l.length === 0 && u.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
    ee,
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
        s && /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: s,
            className: "ms-auto rounded-md px-2 py-0.5 text-[11.5px] font-semibold text-text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            children: "Akıllı ertele"
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: l.map((o) => /* @__PURE__ */ e.jsx(pe, { item: o, onSelect: r, showDate: !0 }, o.key)) })
    ] }),
    u.map((o) => /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: y(
        "flex items-center justify-between border-b border-subtle px-3 py-2",
        o.isToday && "border-b-accent"
      ), children: [
        /* @__PURE__ */ e.jsxs("span", { className: y(
          "text-[11px] font-bold uppercase tracking-wider",
          o.isToday ? "text-accent" : "text-text-tertiary"
        ), children: [
          N.dayTitle(o.date),
          o.isToday ? " · Bugün" : ""
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: o.items.length })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: o.items.map((p) => /* @__PURE__ */ e.jsx(pe, { item: p, onSelect: r }, p.key)) })
    ] }, o.key))
  ] });
}
function dt({ dayKey: t, items: a, capacity: r, onSelectItem: s, onClose: l }) {
  const u = /* @__PURE__ */ new Date(`${t}T00:00:00`), o = le(a), p = r && o > r, x = a.reduce((c, n) => (c[n.source] = (c[n.source] ?? 0) + 1, c), {});
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: N.dayTitle(u) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(x).length === 0 ? "Planlanmış öğe yok" : Object.entries(x).map(([c, n]) => {
          var m;
          return `${n} ${((m = A[c]) == null ? void 0 : m.plural) ?? "öğe"}`;
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
    r && o > 0 && /* @__PURE__ */ e.jsxs("div", { className: y(
      "flex items-center justify-between border-b px-3 py-2 text-[11.5px]",
      p ? "border-negative-100 bg-negative-50 text-negative-700" : "border-subtle text-text-secondary"
    ), children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-semibold", children: p ? "Kapasite aşımı" : "Gün yükü" }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono tabular-nums", children: [
        N.hours(o),
        " / ",
        N.hours(r)
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "flex-1 overflow-y-auto p-1", children: a.length === 0 ? /* @__PURE__ */ e.jsx(
      ee,
      {
        compact: !0,
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-day" }),
        title: "Bu gün boş",
        description: "Bu güne düşen bir öğe yok."
      }
    ) : a.map((c) => /* @__PURE__ */ e.jsx(pe, { item: c, onSelect: s }, c.key)) })
  ] });
}
const ut = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], xt = {
  [F.OVERDUE]: {
    pill: "bg-negative-50 text-negative-700",
    /* çapraz tarama */
    pattern: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,.07) 3px, rgba(0,0,0,.07) 5px)"
  },
  [F.DUE_TODAY]: {
    pill: "bg-warning-50 text-warning-700",
    /* dikey çizgi */
    pattern: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,.06) 4px, rgba(0,0,0,.06) 5px)"
  }
};
function mt({ item: t, onSelect: a, onDragStart: r, isPending: s, hasError: l }) {
  const u = A[t.source], o = xt[t.risk], p = t.canReschedule && !t.isDone;
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: p,
      onDragStart: p ? (x) => {
        x.stopPropagation(), x.dataTransfer.effectAllowed = "move", x.dataTransfer.setData("text/plain", t.key), r(t);
      } : void 0,
      onClick: (x) => {
        x.stopPropagation(), a(t);
      },
      title: t.subtitle ? `${t.title} — ${t.subtitle}` : t.title,
      style: o ? { backgroundImage: o.pattern } : void 0,
      className: y(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        o ? o.pill : "bg-neutral-subtle text-text-primary",
        t.isDone && "line-through opacity-65",
        p && "cursor-grab active:cursor-grabbing",
        /* Hata SATIRDA kalır — toast'a kaçmaz. */
        l && "ring-1 ring-negative-500",
        s && "opacity-60"
      ),
      children: [
        s ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin shrink-0 text-[9px]", "aria-hidden": "true" }) : u && /* @__PURE__ */ e.jsx("i", { className: y("fa shrink-0 text-[9px] opacity-70", u.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: t.title }),
        l && /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation ms-auto shrink-0 text-[9px]", "aria-hidden": "true" })
      ]
    }
  );
}
function pt({ summary: t, onSelect: a }) {
  const r = A[t.source];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: (s) => {
        s.stopPropagation(), a(t.source);
      },
      className: y(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left",
        "text-[10.5px] font-medium text-text-secondary hover:bg-surface-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      ),
      children: [
        r && /* @__PURE__ */ e.jsx("i", { className: y("fa shrink-0 text-[9px] opacity-60", r.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: at(t) })
      ]
    }
  );
}
function bt({ load: t, capacity: a }) {
  if (!a || t <= 0) return null;
  const r = Math.min(t / a, 1), s = t > a;
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "mt-auto flex h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle",
      title: `Gün yükü ${N.hours(t)} / kapasite ${N.hours(a)}`,
      "aria-label": `Gün yükü ${N.hours(t)}, kapasite ${N.hours(a)}`,
      children: /* @__PURE__ */ e.jsx(
        "span",
        {
          className: y("h-full", s ? "bg-negative" : "bg-accent"),
          style: { width: `${r * 100}%` }
        }
      )
    }
  );
}
function ft({
  month: t,
  byDay: a,
  today: r,
  capacity: s,
  onSelectItem: l,
  onSelectDay: u,
  selectedDay: o,
  onDropItem: p,
  pending: x = {},
  errors: c = {}
}) {
  const n = Xe(t), m = D(r), [i, h] = Ne.useState(null), [b, d] = Ne.useState(null);
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: ut.map((k, v) => /* @__PURE__ */ e.jsx(
      "div",
      {
        className: y(
          "px-2.5 py-2 text-right text-[10.5px] font-bold uppercase tracking-wider",
          v > 4 ? "text-text-tertiary opacity-70" : "text-text-tertiary"
        ),
        children: k
      },
      k
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: n.map((k) => {
      const v = D(k), O = a[v] ?? [], { pills: $, summaries: j } = tt(O), f = le(O), E = k.getMonth() !== t.getMonth(), z = v === m, U = v === o;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          role: "gridcell",
          tabIndex: -1,
          onClick: () => u(v),
          onDragOver: i ? (S) => {
            S.preventDefault(), S.dataTransfer.dropEffect = "move", b !== v && d(v);
          } : void 0,
          onDragLeave: i ? () => d((S) => S === v ? null : S) : void 0,
          onDrop: i ? (S) => {
            S.preventDefault();
            const C = i;
            h(null), d(null), C && C.date.slice(0, 10) !== v && p(C, /* @__PURE__ */ new Date(`${v}T00:00:00`));
          } : void 0,
          className: y(
            "flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5",
            "transition-colors duration-fast last:border-r-0 hover:bg-surface-hover",
            E ? "bg-surface-sunken" : "bg-surface-base",
            U && "ring-2 ring-inset ring-border-focus",
            b === v && "bg-primary-subtle ring-2 ring-inset ring-accent"
          ),
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
              f > 0 && s && f > s && /* @__PURE__ */ e.jsx("span", { className: "rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: N.hours(f) }),
              /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: y(
                    "ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11.5px] font-semibold leading-none tabular-nums",
                    z && "bg-accent text-white",
                    !z && E && "text-text-tertiary opacity-60",
                    !z && !E && "text-text-secondary"
                  ),
                  children: k.getDate()
                }
              )
            ] }),
            $.map((S) => /* @__PURE__ */ e.jsx(
              mt,
              {
                item: S,
                onSelect: l,
                onDragStart: h,
                isPending: !!x[S.key],
                hasError: !!c[S.key]
              },
              S.key
            )),
            j.map((S) => /* @__PURE__ */ e.jsx(
              pt,
              {
                summary: S,
                onSelect: () => u(v)
              },
              `${v}-${S.source}`
            )),
            /* @__PURE__ */ e.jsx(bt, { load: f, capacity: s })
          ]
        },
        v
      );
    }) })
  ] });
}
const ht = { 1: "Google", 2: "Outlook", 3: "iCloud" };
function gt({
  sources: t,
  counts: a,
  enabled: r,
  onToggle: s,
  compact: l = !1,
  externalAccounts: u = [],
  externalLoading: o = !1,
  onOpenSync: p
}) {
  const x = (t ?? []).filter((c) => c.isAvailable);
  return x.length === 0 ? null : /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Takvim kaynakları",
      className: y(
        "flex flex-col gap-1 rounded-card border border-subtle bg-surface-base p-2",
        l ? "w-[60px] items-center" : "w-full"
      ),
      children: [
        !l && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Kaynaklar" }),
        x.map((c) => {
          const n = A[c.source];
          if (!n) return null;
          const m = r.has(c.source), i = a[c.source] ?? 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": m,
              title: l ? `${n.label} — ${i} öğe` : void 0,
              onClick: () => s(c.source),
              className: y(
                "group flex items-center rounded-md text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                l ? "relative h-11 w-11 justify-center" : "gap-2.5 px-2 py-2",
                m ? "text-text-primary" : "text-text-tertiary",
                "hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: y(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px]",
                      m ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: y("fa", n.icon) })
                  }
                ),
                l ? i > 0 && /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: y(
                      "absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-[9.5px] font-bold leading-4",
                      m ? "bg-accent text-white" : "bg-neutral-200 text-text-tertiary"
                    ),
                    children: i
                  }
                ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                  /* @__PURE__ */ e.jsx("span", { className: y("flex-1 truncate text-[12.5px] font-medium", !m && "line-through decoration-1"), children: n.label }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: i })
                ] })
              ]
            },
            c.source
          );
        }),
        !l && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex items-center justify-between border-t border-subtle px-2 pb-1 pt-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Dış takvimler" }),
            p && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: p,
                className: "rounded p-1 text-[11px] font-medium text-text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                children: "Ayarlar"
              }
            )
          ] }),
          u.length === 0 && !o && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 text-[11.5px] text-text-tertiary", children: "Bağlı takvim yok." }),
          o && u.length === 0 && /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1 text-[11.5px] text-text-tertiary", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
            "senkronize ediliyor…"
          ] }),
          u.map((c) => /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: y(
                "flex items-start gap-2 rounded-md px-2 py-1.5",
                c.error && "bg-negative-50"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: y(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px]",
                      c.error ? "bg-negative-100 text-negative-700" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: y("fa", c.error ? "fa-triangle-exclamation" : "fa-calendar-days") })
                  }
                ),
                /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: ht[c.provider] ?? "Takvim" }),
                  /* @__PURE__ */ e.jsx("span", { className: y(
                    "block truncate text-[10.5px]",
                    c.error ? "text-negative-700" : "text-text-tertiary"
                  ), children: c.error ?? `${c.email} · ${c.eventCount} etkinlik` }),
                  c.error && /* @__PURE__ */ e.jsx("a", { href: "/Calendars", className: "text-[10.5px] font-semibold text-text-link hover:underline", children: "Yeniden bağla" })
                ] })
              ]
            },
            c.accountId
          ))
        ] })
      ]
    }
  );
}
const yt = { month: "Ay", week: "Hafta", day: "Gün", agenda: "Ajanda" };
function vt({ title: t, view: a, onView: r, onPrev: s, onNext: l, onToday: u, overloadDays: o }) {
  const p = a !== "agenda";
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    p && /* @__PURE__ */ e.jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: s,
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
    /* @__PURE__ */ e.jsx(T, { variant: "outline", size: "sm", onClick: u, children: "Bugün" }),
    /* @__PURE__ */ e.jsx("h2", { className: "ml-1 text-[17px] font-semibold capitalize tracking-tight text-text-primary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
      o > 0 && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "rounded-md bg-negative-50 px-2 py-1 text-[11.5px] font-semibold text-negative-700",
          title: "Günlük kapasitenizi aşan gün sayısı",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
            o,
            " günde kapasite aşımı"
          ]
        }
      ),
      /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(yt).map(([x, c]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": a === x,
          onClick: () => r(x),
          className: y(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            a === x ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: c
        },
        x
      )) })
    ] })
  ] });
}
const B = 44, jt = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], kt = {
  [F.OVERDUE]: "bg-negative-50 text-negative-700",
  [F.DUE_TODAY]: "bg-warning-50 text-warning-700"
};
function Nt({ load: t, capacity: a }) {
  if (!a || t <= 0) return null;
  const r = t > a;
  return /* @__PURE__ */ e.jsx("div", { className: "mt-1 h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
    "span",
    {
      className: y("block h-full", r ? "bg-negative" : "bg-accent"),
      style: { width: `${Math.min(t / a, 1) * 100}%` }
    }
  ) });
}
function wt({ days: t, byDay: a, today: r, capacity: s, onSelectItem: l, onSelectDay: u, selectedDay: o }) {
  const p = D(r), x = g.useRef(null), [c, n] = g.useState(() => {
    const j = /* @__PURE__ */ new Date();
    return j.getHours() * 60 + j.getMinutes();
  });
  g.useEffect(() => {
    const j = setInterval(() => {
      const f = /* @__PURE__ */ new Date();
      n(f.getHours() * 60 + f.getMinutes());
    }, 6e4);
    return () => clearInterval(j);
  }, []);
  const m = t.map(D), i = {}, h = {};
  for (const j of m) {
    const f = a[j] ?? [];
    i[j] = f.filter(we), h[j] = f.filter((E) => !we(E));
  }
  const b = m.flatMap((j) => i[j]), { start: d, end: k } = it(b), v = Array.from({ length: k - d }, (j, f) => d + f), O = (k - d) * B, $ = m.includes(p) && c >= d * 60 && c <= k * 60;
  return g.useEffect(() => {
    if (!$ || !x.current) return;
    const j = (c - d * 60) / 60 * B;
    x.current.scrollTop = Math.max(0, j - 120);
  }, [$, d]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "grid border-b border-default bg-surface-raised",
        style: { gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))` },
        children: [
          /* @__PURE__ */ e.jsx("div", {}),
          t.map((j) => {
            const f = D(j), E = le(a[f] ?? []), z = f === p;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => u(f),
                className: y(
                  "border-l border-subtle px-2 py-2 text-left transition-colors duration-fast hover:bg-surface-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
                  o === f && "bg-primary-subtle"
                ),
                children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "flex items-baseline gap-1.5", children: [
                    /* @__PURE__ */ e.jsx("span", { className: y(
                      "text-[10.5px] font-bold uppercase tracking-wider",
                      z ? "text-accent" : "text-text-tertiary"
                    ), children: jt[(j.getDay() + 6) % 7] }),
                    /* @__PURE__ */ e.jsx("span", { className: y(
                      "font-mono text-[13px] font-semibold tabular-nums",
                      z ? "text-accent" : "text-text-primary"
                    ), children: j.getDate() }),
                    s && E > s && /* @__PURE__ */ e.jsx("span", { className: "ms-auto rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: N.hours(E) })
                  ] }),
                  /* @__PURE__ */ e.jsx(Nt, { load: E, capacity: s })
                ]
              },
              f
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
          m.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-[46px] flex-col gap-[3px] border-l border-subtle p-1", children: [
            h[j].slice(0, 4).map((f) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => l(f),
                title: f.title,
                className: y(
                  "flex w-full items-center gap-1 truncate rounded-[5px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                  kt[f.risk] ?? "bg-neutral-subtle text-text-primary",
                  f.isDone && "line-through opacity-65"
                ),
                children: [
                  A[f.source] && /* @__PURE__ */ e.jsx("i", { className: y("fa shrink-0 text-[9px] opacity-70", A[f.source].icon), "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "truncate", children: f.title })
                ]
              },
              f.key
            )),
            h[j].length > 4 && /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => u(j),
                className: "px-1.5 text-left text-[10.5px] font-medium text-text-tertiary hover:text-text-primary",
                children: [
                  "+",
                  h[j].length - 4,
                  " öğe"
                ]
              }
            )
          ] }, j))
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
            height: `${O}px`
          },
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "relative", children: v.map((j, f) => /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: "absolute right-1.5 -translate-y-1/2 font-mono text-[10px] tabular-nums text-text-tertiary",
                style: { top: `${f * B}px` },
                children: [
                  String(j).padStart(2, "0"),
                  ":00"
                ]
              },
              j
            )) }),
            m.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "relative border-l border-subtle", children: [
              v.map((f, E) => /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "absolute inset-x-0 border-t border-subtle",
                  style: { top: `${E * B}px` }
                },
                f
              )),
              i[j].map((f) => {
                const E = ne(f.startTime), z = f.endTime ? ne(f.endTime) : E + 60, U = (E - d * 60) / 60 * B, S = Math.max((z - E) / 60 * B, 18);
                return /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => l(f),
                    title: `${f.title} · ${de(f.startTime)}`,
                    style: {
                      top: `${U}px`,
                      height: `${S}px`,
                      backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(0,0,0,.05) 4px, rgba(0,0,0,.05) 6px)"
                    },
                    className: y(
                      "absolute inset-x-0.5 overflow-hidden rounded-[5px] border-l-2 border-accent bg-primary-subtle",
                      "px-1.5 py-0.5 text-left text-[10.5px] leading-tight text-text-primary",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    ),
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: "block truncate font-semibold", children: f.title }),
                      /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[9.5px] text-text-tertiary", children: [
                        de(f.startTime),
                        f.endTime ? `–${de(f.endTime)}` : ""
                      ] })
                    ]
                  },
                  f.key
                );
              }),
              $ && j === p && /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "pointer-events-none absolute inset-x-0 z-10 border-t-2 border-negative",
                  style: { top: `${(c - d * 60) / 60 * B}px` },
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ e.jsx("span", { className: "absolute -left-1 -top-1 h-2 w-2 rounded-full bg-negative" })
                }
              )
            ] }, j))
          ]
        }
      ),
      b.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "border-t border-subtle px-3 py-2 text-[11.5px] text-text-tertiary", children: "Saat ızgarası dış takvim etkinliklerini gösterir. Bağlı bir takvim yoksa boş kalır." })
    ] })
  ] });
}
const St = {
  [F.OVERDUE]: { text: "Gecikmiş", cls: "bg-negative-50 text-negative-700" },
  [F.DUE_TODAY]: { text: "Bugün son gün", cls: "bg-warning-50 text-warning-700" }
};
function V({ label: t, children: a }) {
  return a ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-subtle py-2.5 last:border-b-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11.5px] font-medium text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "min-w-0 text-right text-[12.5px] text-text-primary", children: a })
  ] }) : null;
}
function Dt({ item: t, capacity: a, onClose: r, onReschedule: s, onComplete: l, isPending: u, error: o, onRetry: p }) {
  const [x, c] = g.useState(() => t.date.slice(0, 10)), n = A[t.source], m = St[t.risk], i = t.date.slice(0, 10);
  g.useEffect(() => c(i), [i]);
  const h = () => {
    !x || x === i || s(t, /* @__PURE__ */ new Date(`${x}T00:00:00`));
  };
  return /* @__PURE__ */ e.jsx(J, { open: !0, onOpenChange: (b) => {
    b || r();
  }, children: /* @__PURE__ */ e.jsxs(Z, { side: "right", title: t.title, className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md bg-neutral-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary", children: [
          n && /* @__PURE__ */ e.jsx("i", { className: y("fa text-[10px]", n.icon), "aria-hidden": "true" }),
          n == null ? void 0 : n.label
        ] }),
        m && /* @__PURE__ */ e.jsx("span", { className: y("rounded-md px-2 py-1 text-[11px] font-bold", m.cls), children: m.text }),
        t.isDone && /* @__PURE__ */ e.jsx("span", { className: "rounded-md bg-positive-50 px-2 py-1 text-[11px] font-bold text-positive-700", children: "Tamamlandı" }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: r,
            "aria-label": "Kapat",
            className: "ml-auto rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx("h3", { className: "mt-2 text-[16px] font-semibold leading-snug text-text-primary", children: t.title })
    ] }),
    o && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-negative-100 bg-negative-50 px-4 py-2.5 text-[12px] text-negative-700", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: o }),
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: p, className: "font-semibold underline", children: "Yeniden dene" })
    ] }),
    u && /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle px-4 py-2 text-[12px] text-text-tertiary", "aria-live": "polite", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "kaydediliyor…"
    ] }),
    t.canReschedule && !t.isDone && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs(T, { size: "sm", variant: "secondary", onClick: () => l(t), children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-check me-1.5", "aria-hidden": "true" }),
        "Tamamla"
      ] }),
      /* @__PURE__ */ e.jsx(
        T,
        {
          size: "sm",
          variant: "outline",
          onClick: () => s(t, P(/* @__PURE__ */ new Date(`${i}T00:00:00`), 1)),
          children: "+1 gün ertele"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-2", children: [
      /* @__PURE__ */ e.jsx(V, { label: "Son tarih", children: t.canReschedule ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "date",
            value: x,
            onChange: (b) => c(b.target.value),
            className: "rounded-md border border-default bg-surface-base px-2 py-1 text-[12.5px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": "Son tarih"
          }
        ),
        x !== i && /* @__PURE__ */ e.jsx(T, { size: "sm", variant: "primary", onClick: h, children: "Uygula" })
      ] }) : /* @__PURE__ */ e.jsxs("span", { className: "text-text-secondary", children: [
        N.dayTitle(/* @__PURE__ */ new Date(`${i}T00:00:00`)),
        /* @__PURE__ */ e.jsx("span", { className: "ml-1.5 text-text-tertiary", children: "· takvimden değiştirilemez" })
      ] }) }),
      /* @__PURE__ */ e.jsx(V, { label: "Bağlam", children: t.subtitle }),
      /* @__PURE__ */ e.jsx(V, { label: "Atanan", children: t.assigneeName }),
      /* @__PURE__ */ e.jsx(V, { label: "Tutar", children: t.amount != null ? N.money(t.amount, t.currency) : null }),
      /* @__PURE__ */ e.jsx(V, { label: "Gün yükü", children: t.loadHours != null ? `${N.hours(t.loadHours)}${a ? ` / ${N.hours(a)} kapasite` : ""}` : null })
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
const Ke = ["calendar", "sync-settings"];
function Ct(t) {
  return L({
    queryKey: Ke,
    queryFn: () => R.get("/api/app/calendar/sync-settings"),
    enabled: t,
    staleTime: 3e4
  });
}
function Tt() {
  const t = G();
  return M({
    mutationFn: (a) => R.post("/api/app/calendar/sync-rules", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Ke }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
const Ie = ["calendar", "ical-feed"], he = ["calendar", "ical-subscriptions"];
function Et(t) {
  return L({
    queryKey: Ie,
    /* GetOrCreate: bağlantı yoksa ilk açılışta üretilir. */
    queryFn: () => R.post("/api/app/ical-feed/ensure", {}),
    enabled: t,
    staleTime: 1 / 0
  });
}
function Rt() {
  const t = G();
  return M({
    mutationFn: () => R.post("/api/app/ical-feed/regenerate", {}),
    onSuccess: (a) => t.setQueryData(Ie, a)
  });
}
function $t(t) {
  return L({
    queryKey: he,
    queryFn: () => R.get("/api/app/ical-subscription"),
    enabled: t,
    staleTime: 3e4
  });
}
function zt() {
  const t = G();
  return M({
    mutationFn: (a) => R.post("/api/app/ical-subscription", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: he }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function Kt() {
  const t = G();
  return M({
    mutationFn: (a) => R.delete(`/api/app/ical-subscription/${a}`),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: he }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function It() {
  return M({
    mutationFn: (t) => R.post(`/api/app/ical-subscription/probe?url=${encodeURIComponent(t)}`, {})
  });
}
const At = {
  1: { label: "Google Calendar", icon: "fa-google", brand: "bg-[#ea4335]" },
  2: { label: "Microsoft Outlook", icon: "fa-windows", brand: "bg-[#0078d4]" },
  3: { label: "iCloud", icon: "fa-apple", brand: "bg-neutral-700" }
}, Ot = {
  0: { title: "Son değişen kazanır", desc: "İki taraf da düzenlenirse en son yapılan değişiklik uygulanır; ekranda geri alma şeridi çıkar." },
  1: { title: "APYA her zaman kazanır", desc: "Dış takvim salt-okunur ayna olur; dışarıdaki düzenleme geri alınır." }
}, De = {
  0: { icon: "fa-arrow-up-from-bracket", cls: "text-text-tertiary" },
  1: { icon: "fa-code-merge", cls: "text-warning-700" },
  2: { icon: "fa-triangle-exclamation", cls: "text-negative-700" }
};
function ge(t) {
  if (!t) return "hiç";
  const a = Math.round((Date.now() - new Date(t).getTime()) / 6e4);
  return a < 1 ? "az önce" : a < 60 ? `${a} dk önce` : a < 1440 ? `${Math.round(a / 60)} sa önce` : N.dayShort(new Date(t));
}
function Ft({ account: t, onSave: a, saving: r }) {
  const s = At[t.provider] ?? { label: "Takvim", icon: "fa-calendar", brand: "bg-neutral-700" }, [l, u] = g.useState(() => new Set(t.syncSources ?? [])), [o, p] = g.useState(t.conflictRule ?? 0), [x, c] = g.useState(t.isSyncEnabled);
  g.useEffect(() => {
    u(new Set(t.syncSources ?? [])), p(t.conflictRule ?? 0), c(t.isSyncEnabled);
  }, [t]);
  const n = x !== t.isSyncEnabled || o !== t.conflictRule || l.size !== (t.syncSources ?? []).length || [...l].some((i) => !(t.syncSources ?? []).includes(i)), m = (i) => u((h) => {
    const b = new Set(h);
    return b.has(i) ? b.delete(i) : b.add(i), b;
  });
  return /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-3 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: y("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", s.brand), "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("i", { className: y("fab", s.icon) }) }),
      /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-semibold text-text-primary", children: s.label }),
        /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[11.5px] text-text-tertiary", children: [
          t.externalEmail,
          " · son senkron ",
          ge(t.lastSyncTime)
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("label", { className: "flex shrink-0 items-center gap-1.5 text-[11.5px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: x,
            onChange: (i) => c(i.target.checked),
            className: "h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
          }
        ),
        "Açık"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Bu hesaba ne gitsin?" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: xe.map((i) => {
        var b, d;
        const h = l.has(i);
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": h,
            onClick: () => m(i),
            className: y(
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              h ? "border-accent bg-primary-subtle text-accent" : "border-subtle bg-surface-base text-text-tertiary hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: y("fa text-[10px]", (b = A[i]) == null ? void 0 : b.icon), "aria-hidden": "true" }),
              (d = A[i]) == null ? void 0 : d.label
            ]
          },
          i
        );
      }) }),
      l.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-text-tertiary", children: "Hiçbiri seçili değil — yalnız görevler gönderilir." }),
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Çakışma kuralı" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: Object.entries(Ot).map(([i, h]) => {
        const b = Number(i), d = o === b;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => p(b),
            className: y(
              "rounded-md border px-2.5 py-2 text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              d ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("span", { className: y("block text-[12px] font-semibold", d ? "text-accent" : "text-text-primary"), children: h.title }),
              /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] leading-snug text-text-tertiary", children: h.desc })
            ]
          },
          i
        );
      }) }),
      n && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          T,
          {
            size: "sm",
            variant: "primary",
            disabled: r,
            onClick: () => a({
              accountId: t.id,
              isSyncEnabled: x,
              syncSources: [...l],
              syncProjectIds: t.syncProjectIds ?? [],
              conflictRule: o
            }),
            children: r ? "Kaydediliyor…" : "Kuralları kaydet"
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Kaydedilmemiş değişiklik var" })
      ] })
    ] })
  ] });
}
const Pt = [
  { value: 15, label: "15 dk" },
  { value: 60, label: "1 saat" },
  { value: 360, label: "6 saat" },
  { value: 1440, label: "Günlük" }
];
function Mt({ open: t }) {
  var v, O, $, j;
  const a = Et(t), r = Rt(), s = $t(t), l = zt(), u = Kt(), o = It(), [p, x] = g.useState(""), [c, n] = g.useState(""), [m, i] = g.useState(60), [h, b] = g.useState(!1), d = (v = a.data) != null && v.path ? `${window.location.origin}${a.data.path}` : "", k = async () => {
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
        /* @__PURE__ */ e.jsx(T, { size: "sm", variant: "outline", onClick: k, disabled: !d, children: h ? "Kopyalandı" : "Kopyala" })
      ] }),
      /* @__PURE__ */ e.jsxs("p", { className: "mt-1.5 text-[11px] leading-snug text-text-tertiary", children: [
        "Salt-okunur bağlantı; size atanan tarihli görevleri taşır. Bağlantıyı bilen herkes bu takvimi okuyabilir —",
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => r.mutate(),
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
            value: p,
            onChange: (f) => {
              x(f.target.value), o.reset();
            },
            placeholder: "https://…/basic.ics",
            "aria-label": "Takvim bağlantısı",
            className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          }
        ),
        ((O = o.data) == null ? void 0 : O.isValid) && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-positive-700", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-check me-1", "aria-hidden": "true" }),
          "Bağlantı doğrulandı · ",
          o.data.eventCount,
          " etkinlik bulundu"
        ] }),
        o.data && !o.data.isValid && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-negative-700", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
          o.data.error
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              value: c,
              onChange: (f) => n(f.target.value),
              placeholder: (($ = o.data) == null ? void 0 : $.suggestedName) || "Görünen ad",
              "aria-label": "Görünen ad",
              className: "min-w-0 flex-1 rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              value: m,
              onChange: (f) => i(Number(f.target.value)),
              "aria-label": "Yenileme sıklığı",
              className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
              children: Pt.map((f) => /* @__PURE__ */ e.jsx("option", { value: f.value, children: f.label }, f.value))
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(
            T,
            {
              size: "sm",
              variant: "outline",
              disabled: !p || o.isPending,
              onClick: () => o.mutate(p),
              children: o.isPending ? "Deneniyor…" : "Bağlantıyı dene"
            }
          ),
          /* @__PURE__ */ e.jsx(
            T,
            {
              size: "sm",
              variant: "primary",
              disabled: !p || l.isPending,
              onClick: () => l.mutate(
                { url: p, displayName: c, color: "accent", refreshMinutes: m },
                { onSuccess: () => {
                  x(""), n(""), o.reset();
                } }
              ),
              children: l.isPending ? "Ekleniyor…" : "Takvimi ekle"
            }
          )
        ] }),
        l.isError && /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-negative-700", children: ((j = l.error) == null ? void 0 : j.message) || "Takvim eklenemedi." }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] leading-snug text-text-tertiary", children: [
          "iCal abonelikleri ",
          /* @__PURE__ */ e.jsx("strong", { className: "font-semibold", children: "tek yönlüdür" }),
          ": etkinlikler APYA'da salt-okunur görünür, APYA öğeleri bu takvime yazılmaz. Çift yönlü senkron için Google veya Outlook hesabı bağlayın."
        ] })
      ] }),
      (s.data ?? []).length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 border-t border-subtle pt-2", children: s.data.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: f.displayName }),
          /* @__PURE__ */ e.jsx("span", { className: y(
            "block truncate text-[10.5px]",
            f.lastError ? "text-negative-700" : "text-text-tertiary"
          ), children: f.lastError ?? `${f.lastEventCount} etkinlik · ${ge(f.lastFetchedAt)} çekildi` })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => u.mutate(f.id),
            className: "shrink-0 rounded p-1 text-[11px] text-text-tertiary hover:text-negative-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": `${f.displayName} aboneliğini kaldır`,
            children: "Kaldır"
          }
        )
      ] }, f.id)) })
    ] })
  ] });
}
function _t({ open: t, onClose: a }) {
  const { data: r, isPending: s } = Ct(t), l = Tt();
  return /* @__PURE__ */ e.jsx(J, { open: t, onOpenChange: (u) => {
    u || a();
  }, children: /* @__PURE__ */ e.jsxs(Z, { side: "right", title: "Takvim senkronizasyonu", className: "w-full max-w-[440px] p-0", children: [
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
    /* @__PURE__ */ e.jsx("div", { className: "flex-1 overflow-y-auto px-4 py-3", children: s ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", "aria-hidden": "true", children: [
      /* @__PURE__ */ e.jsx(W, { height: 92 }),
      /* @__PURE__ */ e.jsx(W, { height: 92 })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", children: [
      ((r == null ? void 0 : r.accounts) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-4", children: /* @__PURE__ */ e.jsx(
        ee,
        {
          compact: !0,
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
          title: "Bağlı hesap yok",
          description: "Google veya Outlook bağlayınca size atanan tarihli öğeler oraya etkinlik olarak yazılır.",
          action: /* @__PURE__ */ e.jsx(T, { size: "sm", variant: "outline", onClick: () => {
            window.location.href = "/Calendars/SimulateAuth?provider=1";
          }, children: "Hesap bağla" })
        }
      ) }) : r.accounts.map((u) => /* @__PURE__ */ e.jsx(
        Ft,
        {
          account: u,
          saving: l.isPending,
          onSave: (o) => l.mutate(o)
        },
        u.id
      )),
      /* @__PURE__ */ e.jsx(Mt, { open: t }),
      /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
        /* @__PURE__ */ e.jsx("header", { className: "border-b border-subtle px-3 py-2", children: /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-semibold text-text-primary", children: "Senkron günlüğü" }) }),
        /* @__PURE__ */ e.jsx("div", { className: "px-3 py-2", children: ((r == null ? void 0 : r.log) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-2 text-[11.5px] text-text-tertiary", children: "Henüz senkron kaydı yok." }) : r.log.map((u) => {
          const o = De[u.kind] ?? De[0];
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
            /* @__PURE__ */ e.jsx("i", { className: y("fa mt-0.5 shrink-0 text-[11px]", o.icon, o.cls), "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[11.5px] leading-snug text-text-secondary", children: u.message }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: ge(u.occurredAt) })
          ] }, u.id);
        }) })
      ] })
    ] }) })
  ] }) });
}
const Ae = ["calendar", "preferences"];
function Yt() {
  return L({
    queryKey: Ae,
    queryFn: () => R.get("/api/app/calendar/preferences"),
    staleTime: 5 * 6e4
  });
}
function qt() {
  const t = G();
  return M({
    mutationFn: (a) => R.post("/api/app/calendar/preferences", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Ae }), t.invalidateQueries({ queryKey: ["calendar", "feed"] });
    }
  });
}
function Bt() {
  const t = G();
  return M({
    mutationFn: (a) => R.post("/api/app/calendar/bulk-reschedule", a),
    onSettled: () => t.invalidateQueries({ queryKey: ["calendar", "feed"] })
  });
}
function Gt({ open: t, items: a, today: r, capacity: s, onClose: l }) {
  const { suggestions: u, fixed: o } = g.useMemo(
    () => lt(a, { today: r, capacity: s }),
    [a, r, s]
  ), [p, x] = g.useState(() => new Set(u.map((d) => d.item.key))), c = Bt(), n = c.data ?? [], m = new Map(n.filter((d) => !d.succeeded).map((d) => [d.sourceId, d.error])), i = (d) => x((k) => {
    const v = new Set(k);
    return v.has(d) ? v.delete(d) : v.add(d), v;
  }), h = u.filter((d) => p.has(d.item.key)), b = () => {
    c.mutate(
      h.map((d) => ({
        source: d.item.source,
        sourceId: d.item.sourceId,
        newDate: D(d.date)
      })),
      {
        onSuccess: (d) => {
          (d ?? []).every((k) => k.succeeded) && l();
        }
      }
    );
  };
  return /* @__PURE__ */ e.jsx(J, { open: t, onOpenChange: (d) => {
    d || l();
  }, children: /* @__PURE__ */ e.jsxs(Z, { side: "right", title: "Akıllı erteleme", className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-semibold text-text-primary", children: "Akıllı erteleme" }),
        /* @__PURE__ */ e.jsxs("p", { className: "mt-0.5 text-[11.5px] leading-snug text-text-tertiary", children: [
          u.length > 0 ? `${u.length} gecikmiş öğe için boş günlere dağıtılmış tarihler önerildi.` : "Ertelenecek gecikmiş öğe yok.",
          s ? ` Günlük kapasite ${N.hours(s)}.` : ""
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
      u.map(({ item: d, date: k }) => {
        const v = m.get(d.sourceId);
        return /* @__PURE__ */ e.jsxs(
          "label",
          {
            className: y(
              "flex cursor-pointer items-start gap-2.5 border-b border-subtle py-2.5 last:border-b-0",
              v && "bg-negative-50"
            ),
            children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: p.has(d.key),
                  onChange: () => i(d.key),
                  className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] font-semibold text-text-primary", children: d.title }),
                /* @__PURE__ */ e.jsxs("span", { className: "mt-0.5 flex items-center gap-1.5 text-[11px] text-text-tertiary", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "line-through", children: N.dayShort(/* @__PURE__ */ new Date(`${d.date.slice(0, 10)}T00:00:00`)) }),
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right text-[9px]", "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-accent", children: N.dayShort(k) }),
                  d.loadHours != null && /* @__PURE__ */ e.jsxs("span", { children: [
                    "· ",
                    N.hours(d.loadHours)
                  ] })
                ] }),
                v && /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] font-medium text-negative-700", children: v })
              ] })
            ]
          },
          d.key
        );
      }),
      o.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 border-t border-subtle pt-2", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Ertelenemez" }),
        o.map((d) => {
          var k;
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 py-1.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock mt-1 shrink-0 text-[10px] text-text-tertiary", "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] text-text-secondary", children: d.title }),
              /* @__PURE__ */ e.jsxs("span", { className: "block text-[11px] text-text-tertiary", children: [
                (k = A[d.source]) == null ? void 0 : k.label,
                " — vadesi takvimden değiştirilemez"
              ] })
            ] })
          ] }, d.key);
        })
      ] })
    ] }),
    u.length > 0 && /* @__PURE__ */ e.jsxs("footer", { className: "flex items-center gap-2 border-t border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsx(
        T,
        {
          size: "sm",
          variant: "primary",
          disabled: h.length === 0 || c.isPending,
          onClick: b,
          children: c.isPending ? "Erteleniyor…" : `${h.length} öğeyi ertele`
        }
      ),
      /* @__PURE__ */ e.jsx(T, { size: "sm", variant: "ghost", onClick: l, children: "Vazgeç" })
    ] })
  ] }) });
}
const Lt = [
  { value: 4, label: "4 sa" },
  { value: 6, label: "6 sa" },
  { value: 8, label: "8 sa" },
  { value: 0, label: "Kapalı" }
], re = ["Kaynaklar", "Dış takvim", "Kurallar"];
function Ut({ open: t, counts: a, onDone: r }) {
  const [s, l] = g.useState(0), [u, o] = g.useState(() => new Set(xe)), [p, x] = g.useState(8), c = qt(), n = () => {
    c.mutate(
      {
        dailyCapacityHours: p > 0 ? p : 0,
        sources: [...u],
        setupCompleted: !0
      },
      { onSettled: r }
    );
  }, m = (i) => o((h) => {
    const b = new Set(h);
    return b.has(i) ? b.delete(i) : b.add(i), b;
  });
  return /* @__PURE__ */ e.jsx(Le, { open: t, onOpenChange: (i) => {
    i || r();
  }, children: /* @__PURE__ */ e.jsxs(Ue, { className: "w-full max-w-[520px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-5 py-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[18px] font-semibold tracking-tight text-text-primary", children: "Takviminizi kurun" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: "Hangi kaynakları göreceğinizi seçin, dilerseniz dış takvim bağlayın. Her ayarı sonradan değiştirebilirsiniz." }),
      /* @__PURE__ */ e.jsx("ol", { className: "mt-3 flex items-center gap-2", children: re.map((i, h) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx("span", { className: y(
          "flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold",
          h === s ? "bg-accent text-white" : h < s ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
        ), children: h + 1 }),
        /* @__PURE__ */ e.jsx("span", { className: y(
          "text-[11.5px]",
          h === s ? "font-semibold text-text-primary" : "text-text-tertiary"
        ), children: i }),
        h < re.length - 1 && /* @__PURE__ */ e.jsx("span", { className: "ms-1 text-text-tertiary", children: "·" })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-5 py-4", children: [
      s === 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Takvimde ne görünsün?" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex flex-col gap-1.5", children: xe.map((i) => {
          var d, k;
          const h = u.has(i), b = a == null ? void 0 : a[i];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": h,
              onClick: () => m(i),
              className: y(
                "flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                h ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: y("fa text-[12px]", (d = A[i]) == null ? void 0 : d.icon, h ? "text-accent" : "text-text-tertiary"), "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-medium text-text-primary", children: (k = A[i]) == null ? void 0 : k.label }),
                b != null && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: b })
              ]
            },
            i
          );
        }) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-[13px] font-semibold text-text-primary", children: "Günlük kapasiteniz" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex gap-1.5", children: Lt.map((i) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => x(i.value),
            className: y(
              "rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              p === i.value ? "border-accent bg-primary-subtle text-accent" : "border-subtle text-text-secondary hover:bg-surface-hover"
            ),
            children: i.label
          },
          i.value
        )) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] leading-snug text-text-tertiary", children: "Aşım uyarıları bu değere göre hesaplanır. Kapatırsanız kapasite çubukları görünmez." })
      ] }),
      s === 1 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Dış takvim bağlayın" }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: "Google veya Outlook bağlarsanız size atanan tarihli öğeler oraya etkinlik olarak yazılır. Bu adım isteğe bağlıdır — sonradan senkron ayarlarından bağlayabilirsiniz." }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex gap-2", children: [
          /* @__PURE__ */ e.jsxs(
            T,
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
            T,
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
      s === 2 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
        s + 1,
        " / ",
        re.length
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1" }),
      /* @__PURE__ */ e.jsx(T, { size: "sm", variant: "ghost", onClick: n, disabled: c.isPending, children: "Şimdilik atla" }),
      s < re.length - 1 ? /* @__PURE__ */ e.jsx(T, { size: "sm", variant: "primary", onClick: () => l((i) => i + 1), children: "Devam" }) : /* @__PURE__ */ e.jsx(T, { size: "sm", variant: "primary", onClick: n, disabled: c.isPending, children: c.isPending ? "Kaydediliyor…" : "Bitir" })
    ] })
  ] }) });
}
const Ht = 6e4;
function Qt({ from: t, to: a }) {
  const r = D(t), s = D(a);
  return L({
    queryKey: ["calendar", "feed", r, s],
    queryFn: () => R.get(`/api/app/calendar/feed?From=${r}&To=${s}`),
    staleTime: Ht,
    placeholderData: (l) => l
    /* ay geçişinde boş ekran yerine eski veri */
  });
}
const Oe = "apya.calendar.view", be = "apya.calendar.sources", ie = ["month", "week", "day", "agenda"];
function Fe(t) {
  try {
    return window.localStorage.getItem(t);
  } catch {
    return null;
  }
}
function ue(t, a) {
  try {
    window.localStorage.setItem(t, a);
  } catch {
  }
}
function Vt() {
  const t = new URLSearchParams(window.location.search).get("view");
  if (ie.includes(t)) return t;
  const a = Fe(Oe);
  return ie.includes(a) ? a : null;
}
function Wt() {
  const t = Fe(be);
  if (!t) return new Set(X);
  const a = t.split(",").map(Number).filter((r) => X.includes(r));
  return a.length ? new Set(a) : new Set(X);
}
function Xt({ defaultView: t = "month" } = {}) {
  const [a] = g.useState(Vt), [r, s] = g.useState(() => a ?? t), [l, u] = g.useState(Wt);
  g.useEffect(() => {
    const n = new URL(window.location.href);
    n.searchParams.get("view") !== r && (n.searchParams.set("view", r), window.history.replaceState({}, "", n));
  }, [r]);
  const o = g.useCallback((n) => {
    ie.includes(n) && (s(n), ue(Oe, n));
  }, []), p = g.useCallback((n) => {
    u((m) => {
      const i = new Set(m);
      return i.has(n) ? i.delete(n) : i.add(n), ue(be, [...i].join(",")), i;
    });
  }, []), x = g.useCallback((n) => {
    a || ie.includes(n) && s((m) => m === n ? m : n);
  }, [a]), c = g.useCallback(() => {
    const n = new Set(X);
    u(n), ue(be, [...n].join(","));
  }, []);
  return { view: r, setView: o, applyResponsiveDefault: x, enabledSources: l, toggleSource: p, resetSources: c };
}
const Y = ["calendar", "feed"];
function Jt(t, a, r) {
  t.setQueriesData({ queryKey: Y }, (s) => s != null && s.items ? {
    ...s,
    items: s.items.map((l) => l.key === a ? { ...l, date: `${r}T00:00:00` } : l)
  } : s);
}
function Zt(t, a) {
  t.setQueriesData({ queryKey: Y }, (r) => r != null && r.items ? {
    ...r,
    items: r.items.map((s) => s.key === a ? { ...s, isDone: !0, risk: 0, loadHours: null } : s)
  } : r);
}
function ea() {
  const t = G(), [a, r] = g.useState(null), [s, l] = g.useState({}), [u, o] = g.useState({}), p = g.useCallback((n) => {
    l((m) => {
      if (!m[n]) return m;
      const i = { ...m };
      return delete i[n], i;
    });
  }, []), x = M({
    mutationFn: ({ item: n, newDate: m }) => R.post("/api/app/calendar/reschedule-item", {
      source: n.source,
      sourceId: n.sourceId,
      newDate: D(m)
    }),
    onMutate: async ({ item: n, newDate: m }) => {
      await t.cancelQueries({ queryKey: Y });
      const i = t.getQueriesData({ queryKey: Y });
      return p(n.key), o((h) => ({ ...h, [n.key]: !0 })), Jt(t, n.key, D(m)), { snapshot: i, previousDate: n.date.slice(0, 10) };
    },
    onError: (n, { item: m }, i) => {
      var h;
      (h = i == null ? void 0 : i.snapshot) == null || h.forEach(([b, d]) => t.setQueryData(b, d)), l((b) => ({
        ...b,
        [m.key]: (n == null ? void 0 : n.message) || "Kaydedilemedi — tarih değişmedi."
      }));
    },
    onSuccess: (n, { item: m, newDate: i }, h) => {
      r({
        key: m.key,
        message: `“${m.title}” ${D(i)} tarihine taşındı.`,
        undo: () => x.mutate({
          item: { ...m, date: `${D(i)}T00:00:00` },
          newDate: /* @__PURE__ */ new Date(`${h.previousDate}T00:00:00`)
        })
      });
    },
    onSettled: (n, m, { item: i }) => {
      o((h) => {
        const b = { ...h };
        return delete b[i.key], b;
      }), t.invalidateQueries({ queryKey: Y });
    }
  }), c = M({
    mutationFn: ({ item: n }) => R.post("/api/app/calendar/complete-item", {
      source: n.source,
      sourceId: n.sourceId
    }),
    onMutate: async ({ item: n }) => {
      await t.cancelQueries({ queryKey: Y });
      const m = t.getQueriesData({ queryKey: Y });
      return p(n.key), o((i) => ({ ...i, [n.key]: !0 })), Zt(t, n.key), { snapshot: m };
    },
    onError: (n, { item: m }, i) => {
      var h;
      (h = i == null ? void 0 : i.snapshot) == null || h.forEach(([b, d]) => t.setQueryData(b, d)), l((b) => ({
        ...b,
        [m.key]: (n == null ? void 0 : n.message) || "Tamamlanamadı."
      }));
    },
    onSuccess: (n, { item: m }) => {
      r({ key: m.key, message: `“${m.title}” tamamlandı.`, undo: null });
    },
    onSettled: (n, m, { item: i }) => {
      o((h) => {
        const b = { ...h };
        return delete b[i.key], b;
      }), t.invalidateQueries({ queryKey: Y });
    }
  });
  return {
    reschedule: (n, m) => x.mutate({ item: n, newDate: m }),
    complete: (n) => c.mutate({ item: n }),
    retry: (n, m) => m ? x.mutate({ item: n, newDate: m }) : c.mutate({ item: n }),
    lastAction: a,
    dismissAction: () => r(null),
    errors: s,
    clearError: p,
    pending: u
  };
}
function ta({ from: t, to: a, enabled: r = !0 }) {
  const s = D(t), l = D(a);
  return L({
    queryKey: ["calendar", "external", s, l],
    queryFn: () => R.get(`/api/app/calendar/external-events?From=${s}&To=${l}`),
    enabled: r,
    staleTime: 12e4,
    retry: !1,
    placeholderData: (u) => u
  });
}
function aa() {
  const t = g.useRef(null), [a, r] = g.useState(0);
  return g.useLayoutEffect(() => {
    const s = t.current;
    if (!s || (r(s.getBoundingClientRect().width), typeof ResizeObserver > "u")) return;
    const l = new ResizeObserver((u) => {
      for (const o of u)
        r(o.contentRect.width);
    });
    return l.observe(s), () => l.disconnect();
  }, []), [t, a];
}
function sa(t) {
  return t === 0 || t >= 1180 ? "wide" : t >= 780 ? "medium" : "narrow";
}
const ra = 60;
function Ce(t, a, r) {
  return a === "week" ? P(t, 7 * r) : a === "day" ? P(t, r) : new Date(t.getFullYear(), t.getMonth() + r, 1);
}
function na() {
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Array.from({ length: 7 }, (t, a) => /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-2", children: /* @__PURE__ */ e.jsx(W, { height: 10 }) }, a)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: Array.from({ length: fe }, (t, a) => /* @__PURE__ */ e.jsxs("div", { className: "min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0", children: [
      /* @__PURE__ */ e.jsx(W, { height: 12, width: "40%", className: "ml-auto" }),
      a % 3 === 0 && /* @__PURE__ */ e.jsx(W, { height: 14, className: "mt-2" })
    ] }, a)) })
  ] });
}
function ia() {
  var ke;
  const [t, a] = aa(), r = sa(a), s = r === "narrow", l = g.useMemo(() => me(/* @__PURE__ */ new Date()), []), [u, o] = g.useState(() => new Date(l.getFullYear(), l.getMonth(), 1)), [p, x] = g.useState(null), [c, n] = g.useState(null), [m, i] = g.useState(!1), [h, b] = g.useState(!1), [d, k] = g.useState(!1), { view: v, setView: O, applyResponsiveDefault: $, enabledSources: j, toggleSource: f, resetSources: E } = Xt();
  g.useEffect(() => {
    a !== 0 && $(s ? "agenda" : "month");
  }, [a, s, $]);
  const { range: z, title: U, weekDayList: S } = g.useMemo(() => {
    if (v === "agenda")
      return {
        range: { from: P(l, -60), to: P(l, ra) },
        title: "Ajanda",
        weekDayList: null
      };
    if (v === "week") {
      const I = rt(u);
      return {
        range: { from: I[0], to: I[6] },
        title: `${N.dayShort(I[0])} – ${N.dayShort(I[6])} ${I[6].getFullYear()}`,
        weekDayList: I
      };
    }
    if (v === "day") {
      const I = me(u);
      return { range: { from: I, to: I }, title: N.dayTitle(I), weekDayList: [I] };
    }
    const w = $e(u);
    return {
      range: { from: w, to: P(w, fe - 1) },
      title: N.monthTitle(u),
      weekDayList: null
    };
  }, [v, u, l]), { data: C, isPending: oe, isError: Pe, refetch: Me } = Qt(z), te = ta(z), ye = Yt(), ae = g.useMemo(
    () => {
      var w;
      return [...(C == null ? void 0 : C.items) ?? [], ...((w = te.data) == null ? void 0 : w.items) ?? []];
    },
    [C, te.data]
  ), H = g.useMemo(
    () => ae.filter((w) => j.has(w.source)),
    [ae, j]
  ), q = g.useMemo(() => ze(H), [H]), _ = (C == null ? void 0 : C.dailyCapacityHours) ?? null, ve = g.useMemo(() => {
    const w = {};
    for (const I of (C == null ? void 0 : C.sources) ?? []) w[I.source] = I.count;
    return w;
  }, [C]), _e = g.useMemo(() => _ ? Object.values(q).filter((w) => le(w) > _).length : 0, [q, _]);
  g.useEffect(() => {
    p && !q[p] && !oe && (p >= D(z.from) && p <= D(z.to) || x(null));
  }, [p, q, oe, z]);
  const se = g.useCallback((w) => n(w.key), []), Ye = g.useCallback(() => {
    o(l), x(D(l));
  }, [l]), K = ea(), je = ae.length > 0, qe = je && H.length === 0, Be = p ? q[p] ?? [] : [], Q = c ? ae.find((w) => w.key === c) ?? null : null, ce = p && /* @__PURE__ */ e.jsx(
    dt,
    {
      dayKey: p,
      items: Be,
      capacity: _,
      onSelectItem: se,
      onClose: () => x(null)
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { ref: t, className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsx(
      vt,
      {
        title: U,
        view: v,
        onView: O,
        onPrev: () => o((w) => Ce(w, v, -1)),
        onNext: () => o((w) => Ce(w, v, 1)),
        onToday: Ye,
        overloadDays: _e
      }
    ),
    Pe && /* @__PURE__ */ e.jsxs("div", { className: "rounded-card border border-negative-100 bg-negative-50 px-3 py-2.5 text-[12.5px] text-negative-700", children: [
      "Takvim yüklenemedi.",
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => Me(), className: "ml-2 font-semibold underline", children: "Yeniden dene" })
    ] }),
    K.lastAction && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "flex items-center gap-2 rounded-card border border-subtle bg-surface-raised px-3 py-2 text-[12.5px] text-text-secondary",
        role: "status",
        "aria-live": "polite",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left text-text-tertiary", "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 truncate", children: K.lastAction.message }),
          K.lastAction.undo && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                K.lastAction.undo(), K.dismissAction();
              },
              className: "font-semibold text-text-link hover:underline",
              children: "Geri al"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: K.dismissAction,
              "aria-label": "Şeridi kapat",
              className: "rounded p-1 text-text-tertiary hover:bg-surface-hover",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: y("flex gap-3", s ? "flex-col" : "flex-row items-start"), children: [
      !s && /* @__PURE__ */ e.jsx("div", { className: y("shrink-0", r === "wide" ? "w-[240px]" : "w-auto"), children: /* @__PURE__ */ e.jsx(
        gt,
        {
          sources: (C == null ? void 0 : C.sources) ?? [],
          counts: ve,
          enabled: j,
          onToggle: f,
          compact: r !== "wide",
          externalAccounts: ((ke = te.data) == null ? void 0 : ke.accounts) ?? [],
          externalLoading: te.isFetching,
          onOpenSync: () => i(!0)
        }
      ) }),
      /* @__PURE__ */ e.jsx("div", { className: "min-w-0 flex-1", children: oe ? /* @__PURE__ */ e.jsx(na, {}) : qe ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
        ee,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-filter-circle-xmark" }),
          title: "Bu filtreyle gösterilecek öğe yok",
          description: "Kaynak rayında kapattığınız türler bu aralıktaki tüm öğeleri gizliyor.",
          action: /* @__PURE__ */ e.jsx(T, { size: "sm", variant: "outline", onClick: E, children: "Kaynakları aç" })
        }
      ) }) : je ? v === "month" ? /* @__PURE__ */ e.jsx(
        ft,
        {
          month: u,
          byDay: q,
          today: l,
          capacity: _,
          selectedDay: p,
          onSelectItem: se,
          onSelectDay: x,
          onDropItem: K.reschedule,
          pending: K.pending,
          errors: K.errors
        }
      ) : S ? /* @__PURE__ */ e.jsx(
        wt,
        {
          days: S,
          byDay: q,
          today: l,
          capacity: _,
          selectedDay: p,
          onSelectItem: se,
          onSelectDay: x
        }
      ) : /* @__PURE__ */ e.jsx(
        ct,
        {
          items: H,
          today: l,
          onSelectItem: se,
          onSmartDefer: () => b(!0)
        }
      ) : /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
        ee,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
          title: "Bu aralıkta planlanmış bir şey yok",
          description: "Son tarihi olan görevler, fatura vadeleri, hibe son tarihleri ve tarihli finans kayıtları burada birlikte görünür.",
          action: /* @__PURE__ */ e.jsx(T, { size: "sm", variant: "outline", onClick: () => {
            window.location.href = "/Tasks";
          }, children: "Görev oluştur" })
        }
      ) }) }),
      r === "wide" && p && /* @__PURE__ */ e.jsx("div", { className: "w-[340px] shrink-0 self-stretch", children: ce })
    ] }),
    r === "medium" && p && /* @__PURE__ */ e.jsx(J, { open: !0, onOpenChange: (w) => {
      w || x(null);
    }, children: /* @__PURE__ */ e.jsx(Z, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: ce }) }),
    s && p && /* @__PURE__ */ e.jsx(J, { open: !0, onOpenChange: (w) => {
      w || x(null);
    }, children: /* @__PURE__ */ e.jsx(Z, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: ce }) }),
    /* @__PURE__ */ e.jsx(_t, { open: m, onClose: () => i(!1) }),
    /* @__PURE__ */ e.jsx(
      Gt,
      {
        open: h,
        items: H,
        today: l,
        capacity: _,
        onClose: () => b(!1)
      }
    ),
    /* @__PURE__ */ e.jsx(
      Ut,
      {
        open: ye.data ? !ye.data.setupCompleted && !d : !1,
        counts: ve,
        onDone: () => k(!0)
      }
    ),
    Q && /* @__PURE__ */ e.jsx(
      Dt,
      {
        item: Q,
        capacity: _,
        onClose: () => n(null),
        onReschedule: K.reschedule,
        onComplete: K.complete,
        isPending: !!K.pending[Q.key],
        error: K.errors[Q.key],
        onRetry: () => K.clearError(Q.key)
      }
    )
  ] });
}
const Te = document.getElementById("apya-calendar-root");
Te && Ge(Te).render(
  /* @__PURE__ */ e.jsx(He, { children: /* @__PURE__ */ e.jsx(Qe, { children: /* @__PURE__ */ e.jsx(Ve, { children: /* @__PURE__ */ e.jsx(ia, {}) }) }) })
);
