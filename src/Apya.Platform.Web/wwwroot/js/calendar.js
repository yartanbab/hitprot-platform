import { j as e, d as de, r as h, b as Se } from "./react-vendor.js";
import { c as b, B as G, d as re, e as se, S as Z, T as Ee } from "./Dialog.js";
import { D as Ce } from "./useDeviceMode.js";
import { a as $e } from "./QueryProvider.js";
import { E as H } from "./EmptyState.js";
import { u as fe, a as Re, b as ue } from "./query-vendor.js";
import { a as Q } from "./httpClient.js";
/* empty css      */
const M = {
  1: { key: "task", label: "Görev", plural: "görev", icon: "fa-circle-check" },
  2: { key: "invoice", label: "Fatura", plural: "fatura", icon: "fa-file-invoice" },
  3: { key: "grant", label: "Hibe", plural: "hibe", icon: "fa-award" },
  4: { key: "expense", label: "Gider", plural: "gider", icon: "fa-arrow-trend-down" },
  5: { key: "income", label: "Gelir", plural: "gelir", icon: "fa-arrow-trend-up" },
  6: { key: "cash", label: "Kasa hareketi", plural: "kasa hareketi", icon: "fa-wallet" },
  7: { key: "external", label: "Dış etkinlik", plural: "dış etkinlik", icon: "fa-calendar-days" }
}, z = [1, 2, 3, 4, 5, 6, 7], $ = { DUE_TODAY: 1, OVERDUE: 2 }, Me = (t) => t.risk === $.OVERDUE || t.risk === $.DUE_TODAY, be = 864e5, ne = (t) => new Date(t.getFullYear(), t.getMonth(), t.getDate()), L = (t, r) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + r);
function T(t) {
  const r = (a) => (a < 10 ? "0" : "") + a;
  return `${t.getFullYear()}-${r(t.getMonth() + 1)}-${r(t.getDate())}`;
}
function he(t) {
  const r = (t.getDay() + 6) % 7;
  return new Date(t.getTime() - r * be);
}
const ge = (t) => he(new Date(t.getFullYear(), t.getMonth(), 1)), le = 42;
function Ie(t) {
  const r = ge(t);
  return Array.from({ length: le }, (a, n) => new Date(r.getTime() + n * be));
}
const Ae = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }), Oe = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }), Ke = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }), N = {
  monthTitle: (t) => Ae.format(t),
  dayTitle: (t) => Oe.format(t),
  dayShort: (t) => Ke.format(t),
  /** Tam tutar — panel ve ajanda satırlarında. */
  money: (t, r = "TRY") => {
    try {
      return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: r || "TRY",
        maximumFractionDigits: 0
      }).format(t ?? 0);
    } catch {
      return `${t ?? 0} ${r || "TRY"}`;
    }
  },
  /** Kısa tutar — dar ay hücresinde ("₺163,4B"). */
  moneyCompact: (t, r = "TRY") => {
    try {
      return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: r || "TRY",
        notation: "compact",
        maximumFractionDigits: 1
      }).format(t ?? 0);
    } catch {
      return `${t ?? 0} ${r || "TRY"}`;
    }
  },
  hours: (t) => `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 }).format(t)} sa`
};
function ye(t) {
  const r = {};
  for (const a of t ?? []) {
    const n = (a.date || "").slice(0, 10);
    n && (r[n] ?? (r[n] = [])).push(a);
  }
  return r;
}
const X = (t) => (t ?? []).reduce((r, a) => r + (a.loadHours ?? 0), 0);
function Fe(t, { maxPills: r = 3, maxRiskPills: a = 2 } = {}) {
  const n = t ?? [];
  if (n.length === 0) return { pills: [], summaries: [] };
  if (n.length <= r) return { pills: n, summaries: [] };
  const c = n.filter(Me).slice(0, a), f = new Set(c.map((m) => m.key)), x = /* @__PURE__ */ new Map();
  for (const m of n) {
    if (f.has(m.key)) continue;
    const s = x.get(m.source) ?? { source: m.source, count: 0, amount: 0, hasAmount: !1, only: null };
    s.count += 1, s.only = s.count === 1 ? m : null, m.amount != null && (s.amount += m.amount, s.hasAmount = !0), x.set(m.source, s);
  }
  const i = [];
  for (const m of z) {
    const s = x.get(m);
    s && (s.count === 1 && s.only ? c.push(s.only) : i.push(s));
  }
  return { pills: c, summaries: i };
}
function _e(t, { compact: r = !0 } = {}) {
  const a = M[t.source], n = `${t.count} ${a ? a.plural : "öğe"}`;
  if (!t.hasAmount) return n;
  const l = r ? N.moneyCompact(t.amount) : N.money(t.amount);
  return `${n} · ${l}`;
}
function Ye(t, r) {
  const a = T(r), n = (t ?? []).filter((i) => !i.isDone), l = n.filter((i) => i.date.slice(0, 10) < a && i.risk === $.OVERDUE), c = n.filter((i) => i.date.slice(0, 10) >= a), f = ye(c), x = Object.keys(f).sort().map((i) => ({
    key: i,
    date: /* @__PURE__ */ new Date(`${i}T00:00:00`),
    isToday: i === a,
    items: f[i]
  }));
  return { overdue: l, days: x };
}
function Le(t) {
  const r = he(ne(t));
  return Array.from({ length: 7 }, (a, n) => L(r, n));
}
const Pe = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }), ee = (t) => t ? Pe.format(new Date(t)) : "";
function q(t) {
  const r = new Date(t);
  return r.getHours() * 60 + r.getMinutes();
}
function Ge(t) {
  let r = 8, a = 18;
  for (const n of t ?? [])
    n.startTime && (r = Math.min(r, Math.floor(q(n.startTime) / 60)), a = Math.max(a, Math.ceil(q(n.endTime ?? n.startTime) / 60)));
  return { start: Math.max(0, r), end: Math.min(24, Math.max(a, r + 4)) };
}
const xe = (t) => !!t.startTime, Be = {
  [$.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [$.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function ae({ item: t, onSelect: r, showDate: a = !1 }) {
  const n = M[t.source], l = Be[t.risk];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => r(t),
      className: b(
        "flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left transition-colors duration-fast",
        "hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      ),
      children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-neutral-subtle text-[10px] text-text-tertiary",
            "aria-hidden": "true",
            children: n && /* @__PURE__ */ e.jsx("i", { className: b("fa", n.icon) })
          }
        ),
        /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("span", { className: b("block truncate text-[13px] font-semibold text-text-primary", t.isDone && "line-through opacity-65"), children: t.title }),
          /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block truncate text-[11.5px] text-text-tertiary", children: [
            a ? N.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
            t.subtitle,
            t.assigneeName,
            t.amount != null ? N.money(t.amount, t.currency) : null
          ].filter(Boolean).join(" · ") || (n ? n.label : "") })
        ] }),
        l && /* @__PURE__ */ e.jsx("span", { className: b("shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold", l.className), children: l.label })
      ]
    }
  );
}
function Ue({ items: t, today: r, onSelectItem: a }) {
  const { overdue: n, days: l } = Ye(t, r);
  return n.length === 0 && l.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
    H,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-mug-hot" }),
      title: "Planlanmış bir şey yok",
      description: "Son tarihli görevler, fatura vadeleri ve tarihli finans kayıtları burada öncelik sırasıyla listelenir."
    }
  ) }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    n.length > 0 && /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-negative-100 bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 border-b border-negative-100 px-3 py-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-negative-700", children: "Gecikmiş" }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-semibold tabular-nums text-negative-700", children: n.length })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: n.map((c) => /* @__PURE__ */ e.jsx(ae, { item: c, onSelect: a, showDate: !0 }, c.key)) })
    ] }),
    l.map((c) => /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: b(
        "flex items-center justify-between border-b border-subtle px-3 py-2",
        c.isToday && "border-b-accent"
      ), children: [
        /* @__PURE__ */ e.jsxs("span", { className: b(
          "text-[11px] font-bold uppercase tracking-wider",
          c.isToday ? "text-accent" : "text-text-tertiary"
        ), children: [
          N.dayTitle(c.date),
          c.isToday ? " · Bugün" : ""
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: c.items.length })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: c.items.map((f) => /* @__PURE__ */ e.jsx(ae, { item: f, onSelect: a }, f.key)) })
    ] }, c.key))
  ] });
}
function ze({ dayKey: t, items: r, capacity: a, onSelectItem: n, onClose: l }) {
  const c = /* @__PURE__ */ new Date(`${t}T00:00:00`), f = X(r), x = a && f > a, i = r.reduce((m, s) => (m[s.source] = (m[s.source] ?? 0) + 1, m), {});
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: N.dayTitle(c) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(i).length === 0 ? "Planlanmış öğe yok" : Object.entries(i).map(([m, s]) => {
          var o;
          return `${s} ${((o = M[m]) == null ? void 0 : o.plural) ?? "öğe"}`;
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
    a && f > 0 && /* @__PURE__ */ e.jsxs("div", { className: b(
      "flex items-center justify-between border-b px-3 py-2 text-[11.5px]",
      x ? "border-negative-100 bg-negative-50 text-negative-700" : "border-subtle text-text-secondary"
    ), children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-semibold", children: x ? "Kapasite aşımı" : "Gün yükü" }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono tabular-nums", children: [
        N.hours(f),
        " / ",
        N.hours(a)
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "flex-1 overflow-y-auto p-1", children: r.length === 0 ? /* @__PURE__ */ e.jsx(
      H,
      {
        compact: !0,
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-day" }),
        title: "Bu gün boş",
        description: "Bu güne düşen bir öğe yok."
      }
    ) : r.map((m) => /* @__PURE__ */ e.jsx(ae, { item: m, onSelect: n }, m.key)) })
  ] });
}
const Ve = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], He = {
  [$.OVERDUE]: {
    pill: "bg-negative-50 text-negative-700",
    /* çapraz tarama */
    pattern: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,.07) 3px, rgba(0,0,0,.07) 5px)"
  },
  [$.DUE_TODAY]: {
    pill: "bg-warning-50 text-warning-700",
    /* dikey çizgi */
    pattern: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,.06) 4px, rgba(0,0,0,.06) 5px)"
  }
};
function Qe({ item: t, onSelect: r, onDragStart: a, isPending: n, hasError: l }) {
  const c = M[t.source], f = He[t.risk], x = t.canReschedule && !t.isDone;
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: x,
      onDragStart: x ? (i) => {
        i.stopPropagation(), i.dataTransfer.effectAllowed = "move", i.dataTransfer.setData("text/plain", t.key), a(t);
      } : void 0,
      onClick: (i) => {
        i.stopPropagation(), r(t);
      },
      title: t.subtitle ? `${t.title} — ${t.subtitle}` : t.title,
      style: f ? { backgroundImage: f.pattern } : void 0,
      className: b(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        f ? f.pill : "bg-neutral-subtle text-text-primary",
        t.isDone && "line-through opacity-65",
        x && "cursor-grab active:cursor-grabbing",
        /* Hata SATIRDA kalır — toast'a kaçmaz. */
        l && "ring-1 ring-negative-500",
        n && "opacity-60"
      ),
      children: [
        n ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin shrink-0 text-[9px]", "aria-hidden": "true" }) : c && /* @__PURE__ */ e.jsx("i", { className: b("fa shrink-0 text-[9px] opacity-70", c.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: t.title }),
        l && /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation ms-auto shrink-0 text-[9px]", "aria-hidden": "true" })
      ]
    }
  );
}
function qe({ summary: t, onSelect: r }) {
  const a = M[t.source];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: (n) => {
        n.stopPropagation(), r(t.source);
      },
      className: b(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left",
        "text-[10.5px] font-medium text-text-secondary hover:bg-surface-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      ),
      children: [
        a && /* @__PURE__ */ e.jsx("i", { className: b("fa shrink-0 text-[9px] opacity-60", a.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: _e(t) })
      ]
    }
  );
}
function We({ load: t, capacity: r }) {
  if (!r || t <= 0) return null;
  const a = Math.min(t / r, 1), n = t > r;
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "mt-auto flex h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle",
      title: `Gün yükü ${N.hours(t)} / kapasite ${N.hours(r)}`,
      "aria-label": `Gün yükü ${N.hours(t)}, kapasite ${N.hours(r)}`,
      children: /* @__PURE__ */ e.jsx(
        "span",
        {
          className: b("h-full", n ? "bg-negative" : "bg-accent"),
          style: { width: `${a * 100}%` }
        }
      )
    }
  );
}
function Xe({
  month: t,
  byDay: r,
  today: a,
  capacity: n,
  onSelectItem: l,
  onSelectDay: c,
  selectedDay: f,
  onDropItem: x,
  pending: i = {},
  errors: m = {}
}) {
  const s = Ie(t), o = T(a), [p, y] = de.useState(null), [g, w] = de.useState(null);
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Ve.map((C, j) => /* @__PURE__ */ e.jsx(
      "div",
      {
        className: b(
          "px-2.5 py-2 text-right text-[10.5px] font-bold uppercase tracking-wider",
          j > 4 ? "text-text-tertiary opacity-70" : "text-text-tertiary"
        ),
        children: C
      },
      C
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: s.map((C) => {
      const j = T(C), P = r[j] ?? [], { pills: I, summaries: d } = Fe(P), u = X(P), D = C.getMonth() !== t.getMonth(), R = j === o, A = j === f;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          role: "gridcell",
          tabIndex: -1,
          onClick: () => c(j),
          onDragOver: p ? (k) => {
            k.preventDefault(), k.dataTransfer.dropEffect = "move", g !== j && w(j);
          } : void 0,
          onDragLeave: p ? () => w((k) => k === j ? null : k) : void 0,
          onDrop: p ? (k) => {
            k.preventDefault();
            const O = p;
            y(null), w(null), O && O.date.slice(0, 10) !== j && x(O, /* @__PURE__ */ new Date(`${j}T00:00:00`));
          } : void 0,
          className: b(
            "flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5",
            "transition-colors duration-fast last:border-r-0 hover:bg-surface-hover",
            D ? "bg-surface-sunken" : "bg-surface-base",
            A && "ring-2 ring-inset ring-border-focus",
            g === j && "bg-primary-subtle ring-2 ring-inset ring-accent"
          ),
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
              u > 0 && n && u > n && /* @__PURE__ */ e.jsx("span", { className: "rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: N.hours(u) }),
              /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: b(
                    "ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11.5px] font-semibold leading-none tabular-nums",
                    R && "bg-accent text-white",
                    !R && D && "text-text-tertiary opacity-60",
                    !R && !D && "text-text-secondary"
                  ),
                  children: C.getDate()
                }
              )
            ] }),
            I.map((k) => /* @__PURE__ */ e.jsx(
              Qe,
              {
                item: k,
                onSelect: l,
                onDragStart: y,
                isPending: !!i[k.key],
                hasError: !!m[k.key]
              },
              k.key
            )),
            d.map((k) => /* @__PURE__ */ e.jsx(
              qe,
              {
                summary: k,
                onSelect: () => c(j)
              },
              `${j}-${k.source}`
            )),
            /* @__PURE__ */ e.jsx(We, { load: u, capacity: n })
          ]
        },
        j
      );
    }) })
  ] });
}
const Je = { 1: "Google", 2: "Outlook", 3: "iCloud" };
function Ze({
  sources: t,
  counts: r,
  enabled: a,
  onToggle: n,
  compact: l = !1,
  externalAccounts: c = [],
  externalLoading: f = !1
}) {
  const x = (t ?? []).filter((i) => i.isAvailable);
  return x.length === 0 ? null : /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Takvim kaynakları",
      className: b(
        "flex flex-col gap-1 rounded-card border border-subtle bg-surface-base p-2",
        l ? "w-[60px] items-center" : "w-full"
      ),
      children: [
        !l && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Kaynaklar" }),
        x.map((i) => {
          const m = M[i.source];
          if (!m) return null;
          const s = a.has(i.source), o = r[i.source] ?? 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": s,
              title: l ? `${m.label} — ${o} öğe` : void 0,
              onClick: () => n(i.source),
              className: b(
                "group flex items-center rounded-md text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                l ? "relative h-11 w-11 justify-center" : "gap-2.5 px-2 py-2",
                s ? "text-text-primary" : "text-text-tertiary",
                "hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: b(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px]",
                      s ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: b("fa", m.icon) })
                  }
                ),
                l ? o > 0 && /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: b(
                      "absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-[9.5px] font-bold leading-4",
                      s ? "bg-accent text-white" : "bg-neutral-200 text-text-tertiary"
                    ),
                    children: o
                  }
                ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                  /* @__PURE__ */ e.jsx("span", { className: b("flex-1 truncate text-[12.5px] font-medium", !s && "line-through decoration-1"), children: m.label }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: o })
                ] })
              ]
            },
            i.source
          );
        }),
        (c.length > 0 || f) && !l && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx("p", { className: "mt-2 border-t border-subtle px-2 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Dış takvimler" }),
          f && c.length === 0 && /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1 text-[11.5px] text-text-tertiary", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
            "senkronize ediliyor…"
          ] }),
          c.map((i) => /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: b(
                "flex items-start gap-2 rounded-md px-2 py-1.5",
                i.error && "bg-negative-50"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: b(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px]",
                      i.error ? "bg-negative-100 text-negative-700" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: b("fa", i.error ? "fa-triangle-exclamation" : "fa-calendar-days") })
                  }
                ),
                /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: Je[i.provider] ?? "Takvim" }),
                  /* @__PURE__ */ e.jsx("span", { className: b(
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
const et = { month: "Ay", week: "Hafta", day: "Gün", agenda: "Ajanda" };
function tt({ title: t, view: r, onView: a, onPrev: n, onNext: l, onToday: c, overloadDays: f }) {
  const x = r !== "agenda";
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    x && /* @__PURE__ */ e.jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: n,
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
    /* @__PURE__ */ e.jsx(G, { variant: "outline", size: "sm", onClick: c, children: "Bugün" }),
    /* @__PURE__ */ e.jsx("h2", { className: "ml-1 text-[17px] font-semibold capitalize tracking-tight text-text-primary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
      f > 0 && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "rounded-md bg-negative-50 px-2 py-1 text-[11.5px] font-semibold text-negative-700",
          title: "Günlük kapasitenizi aşan gün sayısı",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
            f,
            " günde kapasite aşımı"
          ]
        }
      ),
      /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(et).map(([i, m]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": r === i,
          onClick: () => a(i),
          className: b(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            r === i ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: m
        },
        i
      )) })
    ] })
  ] });
}
const Y = 44, rt = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], st = {
  [$.OVERDUE]: "bg-negative-50 text-negative-700",
  [$.DUE_TODAY]: "bg-warning-50 text-warning-700"
};
function nt({ load: t, capacity: r }) {
  if (!r || t <= 0) return null;
  const a = t > r;
  return /* @__PURE__ */ e.jsx("div", { className: "mt-1 h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
    "span",
    {
      className: b("block h-full", a ? "bg-negative" : "bg-accent"),
      style: { width: `${Math.min(t / r, 1) * 100}%` }
    }
  ) });
}
function at({ days: t, byDay: r, today: a, capacity: n, onSelectItem: l, onSelectDay: c, selectedDay: f }) {
  const x = T(a), i = h.useRef(null), [m, s] = h.useState(() => {
    const d = /* @__PURE__ */ new Date();
    return d.getHours() * 60 + d.getMinutes();
  });
  h.useEffect(() => {
    const d = setInterval(() => {
      const u = /* @__PURE__ */ new Date();
      s(u.getHours() * 60 + u.getMinutes());
    }, 6e4);
    return () => clearInterval(d);
  }, []);
  const o = t.map(T), p = {}, y = {};
  for (const d of o) {
    const u = r[d] ?? [];
    p[d] = u.filter(xe), y[d] = u.filter((D) => !xe(D));
  }
  const g = o.flatMap((d) => p[d]), { start: w, end: C } = Ge(g), j = Array.from({ length: C - w }, (d, u) => w + u), P = (C - w) * Y, I = o.includes(x) && m >= w * 60 && m <= C * 60;
  return h.useEffect(() => {
    if (!I || !i.current) return;
    const d = (m - w * 60) / 60 * Y;
    i.current.scrollTop = Math.max(0, d - 120);
  }, [I, w]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "grid border-b border-default bg-surface-raised",
        style: { gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))` },
        children: [
          /* @__PURE__ */ e.jsx("div", {}),
          t.map((d) => {
            const u = T(d), D = X(r[u] ?? []), R = u === x;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => c(u),
                className: b(
                  "border-l border-subtle px-2 py-2 text-left transition-colors duration-fast hover:bg-surface-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
                  f === u && "bg-primary-subtle"
                ),
                children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "flex items-baseline gap-1.5", children: [
                    /* @__PURE__ */ e.jsx("span", { className: b(
                      "text-[10.5px] font-bold uppercase tracking-wider",
                      R ? "text-accent" : "text-text-tertiary"
                    ), children: rt[(d.getDay() + 6) % 7] }),
                    /* @__PURE__ */ e.jsx("span", { className: b(
                      "font-mono text-[13px] font-semibold tabular-nums",
                      R ? "text-accent" : "text-text-primary"
                    ), children: d.getDate() }),
                    n && D > n && /* @__PURE__ */ e.jsx("span", { className: "ms-auto rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: N.hours(D) })
                  ] }),
                  /* @__PURE__ */ e.jsx(nt, { load: D, capacity: n })
                ]
              },
              u
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
          o.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-[46px] flex-col gap-[3px] border-l border-subtle p-1", children: [
            y[d].slice(0, 4).map((u) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => l(u),
                title: u.title,
                className: b(
                  "flex w-full items-center gap-1 truncate rounded-[5px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                  st[u.risk] ?? "bg-neutral-subtle text-text-primary",
                  u.isDone && "line-through opacity-65"
                ),
                children: [
                  M[u.source] && /* @__PURE__ */ e.jsx("i", { className: b("fa shrink-0 text-[9px] opacity-70", M[u.source].icon), "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "truncate", children: u.title })
                ]
              },
              u.key
            )),
            y[d].length > 4 && /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => c(d),
                className: "px-1.5 text-left text-[10.5px] font-medium text-text-tertiary hover:text-text-primary",
                children: [
                  "+",
                  y[d].length - 4,
                  " öğe"
                ]
              }
            )
          ] }, d))
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { ref: i, className: "max-h-[520px] overflow-y-auto", children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "relative grid",
          style: {
            gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))`,
            height: `${P}px`
          },
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "relative", children: j.map((d, u) => /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: "absolute right-1.5 -translate-y-1/2 font-mono text-[10px] tabular-nums text-text-tertiary",
                style: { top: `${u * Y}px` },
                children: [
                  String(d).padStart(2, "0"),
                  ":00"
                ]
              },
              d
            )) }),
            o.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "relative border-l border-subtle", children: [
              j.map((u, D) => /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "absolute inset-x-0 border-t border-subtle",
                  style: { top: `${D * Y}px` }
                },
                u
              )),
              p[d].map((u) => {
                const D = q(u.startTime), R = u.endTime ? q(u.endTime) : D + 60, A = (D - w * 60) / 60 * Y, k = Math.max((R - D) / 60 * Y, 18);
                return /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => l(u),
                    title: `${u.title} · ${ee(u.startTime)}`,
                    style: {
                      top: `${A}px`,
                      height: `${k}px`,
                      backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(0,0,0,.05) 4px, rgba(0,0,0,.05) 6px)"
                    },
                    className: b(
                      "absolute inset-x-0.5 overflow-hidden rounded-[5px] border-l-2 border-accent bg-primary-subtle",
                      "px-1.5 py-0.5 text-left text-[10.5px] leading-tight text-text-primary",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    ),
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: "block truncate font-semibold", children: u.title }),
                      /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[9.5px] text-text-tertiary", children: [
                        ee(u.startTime),
                        u.endTime ? `–${ee(u.endTime)}` : ""
                      ] })
                    ]
                  },
                  u.key
                );
              }),
              I && d === x && /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "pointer-events-none absolute inset-x-0 z-10 border-t-2 border-negative",
                  style: { top: `${(m - w * 60) / 60 * Y}px` },
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ e.jsx("span", { className: "absolute -left-1 -top-1 h-2 w-2 rounded-full bg-negative" })
                }
              )
            ] }, d))
          ]
        }
      ),
      g.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "border-t border-subtle px-3 py-2 text-[11.5px] text-text-tertiary", children: "Saat ızgarası dış takvim etkinliklerini gösterir. Bağlı bir takvim yoksa boş kalır." })
    ] })
  ] });
}
const it = {
  [$.OVERDUE]: { text: "Gecikmiş", cls: "bg-negative-50 text-negative-700" },
  [$.DUE_TODAY]: { text: "Bugün son gün", cls: "bg-warning-50 text-warning-700" }
};
function U({ label: t, children: r }) {
  return r ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-subtle py-2.5 last:border-b-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11.5px] font-medium text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "min-w-0 text-right text-[12.5px] text-text-primary", children: r })
  ] }) : null;
}
function lt({ item: t, capacity: r, onClose: a, onReschedule: n, onComplete: l, isPending: c, error: f, onRetry: x }) {
  const [i, m] = h.useState(() => t.date.slice(0, 10)), s = M[t.source], o = it[t.risk], p = t.date.slice(0, 10);
  h.useEffect(() => m(p), [p]);
  const y = () => {
    !i || i === p || n(t, /* @__PURE__ */ new Date(`${i}T00:00:00`));
  };
  return /* @__PURE__ */ e.jsx(re, { open: !0, onOpenChange: (g) => {
    g || a();
  }, children: /* @__PURE__ */ e.jsxs(se, { side: "right", title: t.title, className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md bg-neutral-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary", children: [
          s && /* @__PURE__ */ e.jsx("i", { className: b("fa text-[10px]", s.icon), "aria-hidden": "true" }),
          s == null ? void 0 : s.label
        ] }),
        o && /* @__PURE__ */ e.jsx("span", { className: b("rounded-md px-2 py-1 text-[11px] font-bold", o.cls), children: o.text }),
        t.isDone && /* @__PURE__ */ e.jsx("span", { className: "rounded-md bg-positive-50 px-2 py-1 text-[11px] font-bold text-positive-700", children: "Tamamlandı" }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: a,
            "aria-label": "Kapat",
            className: "ml-auto rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx("h3", { className: "mt-2 text-[16px] font-semibold leading-snug text-text-primary", children: t.title })
    ] }),
    f && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-negative-100 bg-negative-50 px-4 py-2.5 text-[12px] text-negative-700", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: f }),
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: x, className: "font-semibold underline", children: "Yeniden dene" })
    ] }),
    c && /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle px-4 py-2 text-[12px] text-text-tertiary", "aria-live": "polite", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "kaydediliyor…"
    ] }),
    t.canReschedule && !t.isDone && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs(G, { size: "sm", variant: "secondary", onClick: () => l(t), children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-check me-1.5", "aria-hidden": "true" }),
        "Tamamla"
      ] }),
      /* @__PURE__ */ e.jsx(
        G,
        {
          size: "sm",
          variant: "outline",
          onClick: () => n(t, L(/* @__PURE__ */ new Date(`${p}T00:00:00`), 1)),
          children: "+1 gün ertele"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-2", children: [
      /* @__PURE__ */ e.jsx(U, { label: "Son tarih", children: t.canReschedule ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "date",
            value: i,
            onChange: (g) => m(g.target.value),
            className: "rounded-md border border-default bg-surface-base px-2 py-1 text-[12.5px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": "Son tarih"
          }
        ),
        i !== p && /* @__PURE__ */ e.jsx(G, { size: "sm", variant: "primary", onClick: y, children: "Uygula" })
      ] }) : /* @__PURE__ */ e.jsxs("span", { className: "text-text-secondary", children: [
        N.dayTitle(/* @__PURE__ */ new Date(`${p}T00:00:00`)),
        /* @__PURE__ */ e.jsx("span", { className: "ml-1.5 text-text-tertiary", children: "· takvimden değiştirilemez" })
      ] }) }),
      /* @__PURE__ */ e.jsx(U, { label: "Bağlam", children: t.subtitle }),
      /* @__PURE__ */ e.jsx(U, { label: "Atanan", children: t.assigneeName }),
      /* @__PURE__ */ e.jsx(U, { label: "Tutar", children: t.amount != null ? N.money(t.amount, t.currency) : null }),
      /* @__PURE__ */ e.jsx(U, { label: "Gün yükü", children: t.loadHours != null ? `${N.hours(t.loadHours)}${r ? ` / ${N.hours(r)} kapasite` : ""}` : null })
    ] }),
    t.href && /* @__PURE__ */ e.jsx("footer", { className: "border-t border-subtle px-4 py-3", children: /* @__PURE__ */ e.jsxs(
      "a",
      {
        href: t.href,
        className: "text-[12.5px] font-medium text-text-link hover:underline",
        children: [
          s == null ? void 0 : s.label,
          " ekranında aç",
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right ms-1.5 text-[10px]", "aria-hidden": "true" })
        ]
      }
    ) })
  ] }) });
}
const ot = 6e4;
function ct({ from: t, to: r }) {
  const a = T(t), n = T(r);
  return fe({
    queryKey: ["calendar", "feed", a, n],
    queryFn: () => Q.get(`/api/app/calendar/feed?From=${a}&To=${n}`),
    staleTime: ot,
    placeholderData: (l) => l
    /* ay geçişinde boş ekran yerine eski veri */
  });
}
const ve = "apya.calendar.view", ie = "apya.calendar.sources", W = ["month", "week", "day", "agenda"];
function je(t) {
  try {
    return window.localStorage.getItem(t);
  } catch {
    return null;
  }
}
function te(t, r) {
  try {
    window.localStorage.setItem(t, r);
  } catch {
  }
}
function dt() {
  const t = new URLSearchParams(window.location.search).get("view");
  if (W.includes(t)) return t;
  const r = je(ve);
  return W.includes(r) ? r : null;
}
function ut() {
  const t = je(ie);
  if (!t) return new Set(z);
  const r = t.split(",").map(Number).filter((a) => z.includes(a));
  return r.length ? new Set(r) : new Set(z);
}
function xt({ defaultView: t = "month" } = {}) {
  const [r] = h.useState(dt), [a, n] = h.useState(() => r ?? t), [l, c] = h.useState(ut);
  h.useEffect(() => {
    const s = new URL(window.location.href);
    s.searchParams.get("view") !== a && (s.searchParams.set("view", a), window.history.replaceState({}, "", s));
  }, [a]);
  const f = h.useCallback((s) => {
    W.includes(s) && (n(s), te(ve, s));
  }, []), x = h.useCallback((s) => {
    c((o) => {
      const p = new Set(o);
      return p.has(s) ? p.delete(s) : p.add(s), te(ie, [...p].join(",")), p;
    });
  }, []), i = h.useCallback((s) => {
    r || W.includes(s) && n((o) => o === s ? o : s);
  }, [r]), m = h.useCallback(() => {
    const s = new Set(z);
    c(s), te(ie, [...s].join(","));
  }, []);
  return { view: a, setView: f, applyResponsiveDefault: i, enabledSources: l, toggleSource: x, resetSources: m };
}
const K = ["calendar", "feed"];
function mt(t, r, a) {
  t.setQueriesData({ queryKey: K }, (n) => n != null && n.items ? {
    ...n,
    items: n.items.map((l) => l.key === r ? { ...l, date: `${a}T00:00:00` } : l)
  } : n);
}
function pt(t, r) {
  t.setQueriesData({ queryKey: K }, (a) => a != null && a.items ? {
    ...a,
    items: a.items.map((n) => n.key === r ? { ...n, isDone: !0, risk: 0, loadHours: null } : n)
  } : a);
}
function ft() {
  const t = Re(), [r, a] = h.useState(null), [n, l] = h.useState({}), [c, f] = h.useState({}), x = h.useCallback((s) => {
    l((o) => {
      if (!o[s]) return o;
      const p = { ...o };
      return delete p[s], p;
    });
  }, []), i = ue({
    mutationFn: ({ item: s, newDate: o }) => Q.post("/api/app/calendar/reschedule-item", {
      source: s.source,
      sourceId: s.sourceId,
      newDate: T(o)
    }),
    onMutate: async ({ item: s, newDate: o }) => {
      await t.cancelQueries({ queryKey: K });
      const p = t.getQueriesData({ queryKey: K });
      return x(s.key), f((y) => ({ ...y, [s.key]: !0 })), mt(t, s.key, T(o)), { snapshot: p, previousDate: s.date.slice(0, 10) };
    },
    onError: (s, { item: o }, p) => {
      var y;
      (y = p == null ? void 0 : p.snapshot) == null || y.forEach(([g, w]) => t.setQueryData(g, w)), l((g) => ({
        ...g,
        [o.key]: (s == null ? void 0 : s.message) || "Kaydedilemedi — tarih değişmedi."
      }));
    },
    onSuccess: (s, { item: o, newDate: p }, y) => {
      a({
        key: o.key,
        message: `“${o.title}” ${T(p)} tarihine taşındı.`,
        undo: () => i.mutate({
          item: { ...o, date: `${T(p)}T00:00:00` },
          newDate: /* @__PURE__ */ new Date(`${y.previousDate}T00:00:00`)
        })
      });
    },
    onSettled: (s, o, { item: p }) => {
      f((y) => {
        const g = { ...y };
        return delete g[p.key], g;
      }), t.invalidateQueries({ queryKey: K });
    }
  }), m = ue({
    mutationFn: ({ item: s }) => Q.post("/api/app/calendar/complete-item", {
      source: s.source,
      sourceId: s.sourceId
    }),
    onMutate: async ({ item: s }) => {
      await t.cancelQueries({ queryKey: K });
      const o = t.getQueriesData({ queryKey: K });
      return x(s.key), f((p) => ({ ...p, [s.key]: !0 })), pt(t, s.key), { snapshot: o };
    },
    onError: (s, { item: o }, p) => {
      var y;
      (y = p == null ? void 0 : p.snapshot) == null || y.forEach(([g, w]) => t.setQueryData(g, w)), l((g) => ({
        ...g,
        [o.key]: (s == null ? void 0 : s.message) || "Tamamlanamadı."
      }));
    },
    onSuccess: (s, { item: o }) => {
      a({ key: o.key, message: `“${o.title}” tamamlandı.`, undo: null });
    },
    onSettled: (s, o, { item: p }) => {
      f((y) => {
        const g = { ...y };
        return delete g[p.key], g;
      }), t.invalidateQueries({ queryKey: K });
    }
  });
  return {
    reschedule: (s, o) => i.mutate({ item: s, newDate: o }),
    complete: (s) => m.mutate({ item: s }),
    retry: (s, o) => o ? i.mutate({ item: s, newDate: o }) : m.mutate({ item: s }),
    lastAction: r,
    dismissAction: () => a(null),
    errors: n,
    clearError: x,
    pending: c
  };
}
function bt({ from: t, to: r, enabled: a = !0 }) {
  const n = T(t), l = T(r);
  return fe({
    queryKey: ["calendar", "external", n, l],
    queryFn: () => Q.get(`/api/app/calendar/external-events?From=${n}&To=${l}`),
    enabled: a,
    staleTime: 12e4,
    retry: !1,
    placeholderData: (c) => c
  });
}
function ht() {
  const t = h.useRef(null), [r, a] = h.useState(0);
  return h.useLayoutEffect(() => {
    const n = t.current;
    if (!n || (a(n.getBoundingClientRect().width), typeof ResizeObserver > "u")) return;
    const l = new ResizeObserver((c) => {
      for (const f of c)
        a(f.contentRect.width);
    });
    return l.observe(n), () => l.disconnect();
  }, []), [t, r];
}
function gt(t) {
  return t === 0 || t >= 1180 ? "wide" : t >= 780 ? "medium" : "narrow";
}
const yt = 60;
function me(t, r, a) {
  return r === "week" ? L(t, 7 * a) : r === "day" ? L(t, a) : new Date(t.getFullYear(), t.getMonth() + a, 1);
}
function vt() {
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Array.from({ length: 7 }, (t, r) => /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-2", children: /* @__PURE__ */ e.jsx(Z, { height: 10 }) }, r)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: Array.from({ length: le }, (t, r) => /* @__PURE__ */ e.jsxs("div", { className: "min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0", children: [
      /* @__PURE__ */ e.jsx(Z, { height: 12, width: "40%", className: "ml-auto" }),
      r % 3 === 0 && /* @__PURE__ */ e.jsx(Z, { height: 14, className: "mt-2" })
    ] }, r)) })
  ] });
}
function jt() {
  var ce;
  const [t, r] = ht(), a = gt(r), n = a === "narrow", l = h.useMemo(() => ne(/* @__PURE__ */ new Date()), []), [c, f] = h.useState(() => new Date(l.getFullYear(), l.getMonth(), 1)), [x, i] = h.useState(null), [m, s] = h.useState(null), { view: o, setView: p, applyResponsiveDefault: y, enabledSources: g, toggleSource: w, resetSources: C } = xt();
  h.useEffect(() => {
    r !== 0 && y(n ? "agenda" : "month");
  }, [r, n, y]);
  const { range: j, title: P, weekDayList: I } = h.useMemo(() => {
    if (o === "agenda")
      return {
        range: { from: L(l, -60), to: L(l, yt) },
        title: "Ajanda",
        weekDayList: null
      };
    if (o === "week") {
      const E = Le(c);
      return {
        range: { from: E[0], to: E[6] },
        title: `${N.dayShort(E[0])} – ${N.dayShort(E[6])} ${E[6].getFullYear()}`,
        weekDayList: E
      };
    }
    if (o === "day") {
      const E = ne(c);
      return { range: { from: E, to: E }, title: N.dayTitle(E), weekDayList: [E] };
    }
    const v = ge(c);
    return {
      range: { from: v, to: L(v, le - 1) },
      title: N.monthTitle(c),
      weekDayList: null
    };
  }, [o, c, l]), { data: d, isPending: u, isError: D, refetch: R } = ct(j), A = bt(j), k = h.useMemo(
    () => {
      var v;
      return [...(d == null ? void 0 : d.items) ?? [], ...((v = A.data) == null ? void 0 : v.items) ?? []];
    },
    [d, A.data]
  ), O = h.useMemo(
    () => k.filter((v) => g.has(v.source)),
    [k, g]
  ), F = h.useMemo(() => ye(O), [O]), _ = (d == null ? void 0 : d.dailyCapacityHours) ?? null, ke = h.useMemo(() => {
    const v = {};
    for (const E of (d == null ? void 0 : d.sources) ?? []) v[E.source] = E.count;
    return v;
  }, [d]), Ne = h.useMemo(() => _ ? Object.values(F).filter((v) => X(v) > _).length : 0, [F, _]);
  h.useEffect(() => {
    x && !F[x] && !u && (x >= T(j.from) && x <= T(j.to) || i(null));
  }, [x, F, u, j]);
  const V = h.useCallback((v) => s(v.key), []), we = h.useCallback(() => {
    f(l), i(T(l));
  }, [l]), S = ft(), oe = k.length > 0, De = oe && O.length === 0, Te = x ? F[x] ?? [] : [], B = m ? k.find((v) => v.key === m) ?? null : null, J = x && /* @__PURE__ */ e.jsx(
    ze,
    {
      dayKey: x,
      items: Te,
      capacity: _,
      onSelectItem: V,
      onClose: () => i(null)
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { ref: t, className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsx(
      tt,
      {
        title: P,
        view: o,
        onView: p,
        onPrev: () => f((v) => me(v, o, -1)),
        onNext: () => f((v) => me(v, o, 1)),
        onToday: we,
        overloadDays: Ne
      }
    ),
    D && /* @__PURE__ */ e.jsxs("div", { className: "rounded-card border border-negative-100 bg-negative-50 px-3 py-2.5 text-[12.5px] text-negative-700", children: [
      "Takvim yüklenemedi.",
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => R(), className: "ml-2 font-semibold underline", children: "Yeniden dene" })
    ] }),
    S.lastAction && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "flex items-center gap-2 rounded-card border border-subtle bg-surface-raised px-3 py-2 text-[12.5px] text-text-secondary",
        role: "status",
        "aria-live": "polite",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left text-text-tertiary", "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 truncate", children: S.lastAction.message }),
          S.lastAction.undo && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                S.lastAction.undo(), S.dismissAction();
              },
              className: "font-semibold text-text-link hover:underline",
              children: "Geri al"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: S.dismissAction,
              "aria-label": "Şeridi kapat",
              className: "rounded p-1 text-text-tertiary hover:bg-surface-hover",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: b("flex gap-3", n ? "flex-col" : "flex-row items-start"), children: [
      !n && /* @__PURE__ */ e.jsx("div", { className: b("shrink-0", a === "wide" ? "w-[240px]" : "w-auto"), children: /* @__PURE__ */ e.jsx(
        Ze,
        {
          sources: (d == null ? void 0 : d.sources) ?? [],
          counts: ke,
          enabled: g,
          onToggle: w,
          compact: a !== "wide",
          externalAccounts: ((ce = A.data) == null ? void 0 : ce.accounts) ?? [],
          externalLoading: A.isFetching
        }
      ) }),
      /* @__PURE__ */ e.jsx("div", { className: "min-w-0 flex-1", children: u ? /* @__PURE__ */ e.jsx(vt, {}) : De ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
        H,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-filter-circle-xmark" }),
          title: "Bu filtreyle gösterilecek öğe yok",
          description: "Kaynak rayında kapattığınız türler bu aralıktaki tüm öğeleri gizliyor.",
          action: /* @__PURE__ */ e.jsx(G, { size: "sm", variant: "outline", onClick: C, children: "Kaynakları aç" })
        }
      ) }) : oe ? o === "month" ? /* @__PURE__ */ e.jsx(
        Xe,
        {
          month: c,
          byDay: F,
          today: l,
          capacity: _,
          selectedDay: x,
          onSelectItem: V,
          onSelectDay: i,
          onDropItem: S.reschedule,
          pending: S.pending,
          errors: S.errors
        }
      ) : I ? /* @__PURE__ */ e.jsx(
        at,
        {
          days: I,
          byDay: F,
          today: l,
          capacity: _,
          selectedDay: x,
          onSelectItem: V,
          onSelectDay: i
        }
      ) : /* @__PURE__ */ e.jsx(Ue, { items: O, today: l, onSelectItem: V }) : /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
        H,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
          title: "Bu aralıkta planlanmış bir şey yok",
          description: "Son tarihi olan görevler, fatura vadeleri, hibe son tarihleri ve tarihli finans kayıtları burada birlikte görünür.",
          action: /* @__PURE__ */ e.jsx(G, { size: "sm", variant: "outline", onClick: () => {
            window.location.href = "/Tasks";
          }, children: "Görev oluştur" })
        }
      ) }) }),
      a === "wide" && x && /* @__PURE__ */ e.jsx("div", { className: "w-[340px] shrink-0 self-stretch", children: J })
    ] }),
    a === "medium" && x && /* @__PURE__ */ e.jsx(re, { open: !0, onOpenChange: (v) => {
      v || i(null);
    }, children: /* @__PURE__ */ e.jsx(se, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: J }) }),
    n && x && /* @__PURE__ */ e.jsx(re, { open: !0, onOpenChange: (v) => {
      v || i(null);
    }, children: /* @__PURE__ */ e.jsx(se, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: J }) }),
    B && /* @__PURE__ */ e.jsx(
      lt,
      {
        item: B,
        capacity: _,
        onClose: () => s(null),
        onReschedule: S.reschedule,
        onComplete: S.complete,
        isPending: !!S.pending[B.key],
        error: S.errors[B.key],
        onRetry: () => S.clearError(B.key)
      }
    )
  ] });
}
const pe = document.getElementById("apya-calendar-root");
pe && Se(pe).render(
  /* @__PURE__ */ e.jsx(Ee, { children: /* @__PURE__ */ e.jsx(Ce, { children: /* @__PURE__ */ e.jsx($e, { children: /* @__PURE__ */ e.jsx(jt, {}) }) }) })
);
