import { j as e, d as ne, r as f, b as pe } from "./react-vendor.js";
import { c as p, B as O, d as q, e as H, S as V, T as be } from "./Dialog.js";
import { D as he } from "./useDeviceMode.js";
import { a as ge } from "./QueryProvider.js";
import { E as P } from "./EmptyState.js";
import { u as ye, a as ve, b as re } from "./query-vendor.js";
import { a as W } from "./httpClient.js";
/* empty css      */
const I = {
  1: { key: "task", label: "Görev", plural: "görev", icon: "fa-circle-check" },
  2: { key: "invoice", label: "Fatura", plural: "fatura", icon: "fa-file-invoice" },
  3: { key: "grant", label: "Hibe", plural: "hibe", icon: "fa-award" },
  4: { key: "expense", label: "Gider", plural: "gider", icon: "fa-arrow-trend-down" },
  5: { key: "income", label: "Gelir", plural: "gelir", icon: "fa-arrow-trend-up" },
  6: { key: "cash", label: "Kasa hareketi", plural: "kasa hareketi", icon: "fa-wallet" }
}, _ = [1, 2, 3, 4, 5, 6], S = { DUE_TODAY: 1, OVERDUE: 2 }, je = (t) => t.risk === S.OVERDUE || t.risk === S.DUE_TODAY, oe = 864e5, ke = (t) => new Date(t.getFullYear(), t.getMonth(), t.getDate()), G = (t, s) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + s);
function w(t) {
  const s = (a) => (a < 10 ? "0" : "") + a;
  return `${t.getFullYear()}-${s(t.getMonth() + 1)}-${s(t.getDate())}`;
}
function Ne(t) {
  const s = (t.getDay() + 6) % 7;
  return new Date(t.getTime() - s * oe);
}
const ie = (t) => Ne(new Date(t.getFullYear(), t.getMonth(), 1)), Z = 42;
function we(t) {
  const s = ie(t);
  return Array.from({ length: Z }, (a, r) => new Date(s.getTime() + r * oe));
}
const De = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }), Se = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }), Te = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }), j = {
  monthTitle: (t) => De.format(t),
  dayTitle: (t) => Se.format(t),
  dayShort: (t) => Te.format(t),
  /** Tam tutar — panel ve ajanda satırlarında. */
  money: (t, s = "TRY") => {
    try {
      return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: s || "TRY",
        maximumFractionDigits: 0
      }).format(t ?? 0);
    } catch {
      return `${t ?? 0} ${s || "TRY"}`;
    }
  },
  /** Kısa tutar — dar ay hücresinde ("₺163,4B"). */
  moneyCompact: (t, s = "TRY") => {
    try {
      return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: s || "TRY",
        notation: "compact",
        maximumFractionDigits: 1
      }).format(t ?? 0);
    } catch {
      return `${t ?? 0} ${s || "TRY"}`;
    }
  },
  hours: (t) => `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 }).format(t)} sa`
};
function le(t) {
  const s = {};
  for (const a of t ?? []) {
    const r = (a.date || "").slice(0, 10);
    r && (s[r] ?? (s[r] = [])).push(a);
  }
  return s;
}
const ee = (t) => (t ?? []).reduce((s, a) => s + (a.loadHours ?? 0), 0);
function Ee(t, { maxPills: s = 3, maxRiskPills: a = 2 } = {}) {
  const r = t ?? [];
  if (r.length === 0) return { pills: [], summaries: [] };
  if (r.length <= s) return { pills: r, summaries: [] };
  const d = r.filter(je).slice(0, a), u = new Set(d.map((m) => m.key)), l = /* @__PURE__ */ new Map();
  for (const m of r) {
    if (u.has(m.key)) continue;
    const n = l.get(m.source) ?? { source: m.source, count: 0, amount: 0, hasAmount: !1, only: null };
    n.count += 1, n.only = n.count === 1 ? m : null, m.amount != null && (n.amount += m.amount, n.hasAmount = !0), l.set(m.source, n);
  }
  const i = [];
  for (const m of _) {
    const n = l.get(m);
    n && (n.count === 1 && n.only ? d.push(n.only) : i.push(n));
  }
  return { pills: d, summaries: i };
}
function Ce(t, { compact: s = !0 } = {}) {
  const a = I[t.source], r = `${t.count} ${a ? a.plural : "öğe"}`;
  if (!t.hasAmount) return r;
  const o = s ? j.moneyCompact(t.amount) : j.money(t.amount);
  return `${r} · ${o}`;
}
function Re(t, s) {
  const a = w(s), r = (t ?? []).filter((i) => !i.isDone), o = r.filter((i) => i.date.slice(0, 10) < a && i.risk === S.OVERDUE), d = r.filter((i) => i.date.slice(0, 10) >= a), u = le(d), l = Object.keys(u).sort().map((i) => ({
    key: i,
    date: /* @__PURE__ */ new Date(`${i}T00:00:00`),
    isToday: i === a,
    items: u[i]
  }));
  return { overdue: o, days: l };
}
const $e = {
  [S.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [S.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function J({ item: t, onSelect: s, showDate: a = !1 }) {
  const r = I[t.source], o = $e[t.risk];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => s(t),
      className: p(
        "flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left transition-colors duration-fast",
        "hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      ),
      children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-neutral-subtle text-[10px] text-text-tertiary",
            "aria-hidden": "true",
            children: r && /* @__PURE__ */ e.jsx("i", { className: p("fa", r.icon) })
          }
        ),
        /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("span", { className: p("block truncate text-[13px] font-semibold text-text-primary", t.isDone && "line-through opacity-65"), children: t.title }),
          /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block truncate text-[11.5px] text-text-tertiary", children: [
            a ? j.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
            t.subtitle,
            t.assigneeName,
            t.amount != null ? j.money(t.amount, t.currency) : null
          ].filter(Boolean).join(" · ") || (r ? r.label : "") })
        ] }),
        o && /* @__PURE__ */ e.jsx("span", { className: p("shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold", o.className), children: o.label })
      ]
    }
  );
}
function Ie({ items: t, today: s, onSelectItem: a }) {
  const { overdue: r, days: o } = Re(t, s);
  return r.length === 0 && o.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
    P,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-mug-hot" }),
      title: "Planlanmış bir şey yok",
      description: "Son tarihli görevler, fatura vadeleri ve tarihli finans kayıtları burada öncelik sırasıyla listelenir."
    }
  ) }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    r.length > 0 && /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-negative-100 bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 border-b border-negative-100 px-3 py-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-negative-700", children: "Gecikmiş" }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-semibold tabular-nums text-negative-700", children: r.length })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: r.map((d) => /* @__PURE__ */ e.jsx(J, { item: d, onSelect: a, showDate: !0 }, d.key)) })
    ] }),
    o.map((d) => /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: p(
        "flex items-center justify-between border-b border-subtle px-3 py-2",
        d.isToday && "border-b-accent"
      ), children: [
        /* @__PURE__ */ e.jsxs("span", { className: p(
          "text-[11px] font-bold uppercase tracking-wider",
          d.isToday ? "text-accent" : "text-text-tertiary"
        ), children: [
          j.dayTitle(d.date),
          d.isToday ? " · Bugün" : ""
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: d.items.length })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: d.items.map((u) => /* @__PURE__ */ e.jsx(J, { item: u, onSelect: a }, u.key)) })
    ] }, d.key))
  ] });
}
function Ae({ dayKey: t, items: s, capacity: a, onSelectItem: r, onClose: o }) {
  const d = /* @__PURE__ */ new Date(`${t}T00:00:00`), u = ee(s), l = a && u > a, i = s.reduce((m, n) => (m[n.source] = (m[n.source] ?? 0) + 1, m), {});
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: j.dayTitle(d) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(i).length === 0 ? "Planlanmış öğe yok" : Object.entries(i).map(([m, n]) => {
          var c;
          return `${n} ${((c = I[m]) == null ? void 0 : c.plural) ?? "öğe"}`;
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
    a && u > 0 && /* @__PURE__ */ e.jsxs("div", { className: p(
      "flex items-center justify-between border-b px-3 py-2 text-[11.5px]",
      l ? "border-negative-100 bg-negative-50 text-negative-700" : "border-subtle text-text-secondary"
    ), children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-semibold", children: l ? "Kapasite aşımı" : "Gün yükü" }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono tabular-nums", children: [
        j.hours(u),
        " / ",
        j.hours(a)
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "flex-1 overflow-y-auto p-1", children: s.length === 0 ? /* @__PURE__ */ e.jsx(
      P,
      {
        compact: !0,
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-day" }),
        title: "Bu gün boş",
        description: "Bu güne düşen bir öğe yok."
      }
    ) : s.map((m) => /* @__PURE__ */ e.jsx(J, { item: m, onSelect: r }, m.key)) })
  ] });
}
const Oe = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], Fe = {
  [S.OVERDUE]: {
    pill: "bg-negative-50 text-negative-700",
    /* çapraz tarama */
    pattern: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,.07) 3px, rgba(0,0,0,.07) 5px)"
  },
  [S.DUE_TODAY]: {
    pill: "bg-warning-50 text-warning-700",
    /* dikey çizgi */
    pattern: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,.06) 4px, rgba(0,0,0,.06) 5px)"
  }
};
function Ke({ item: t, onSelect: s, onDragStart: a, isPending: r, hasError: o }) {
  const d = I[t.source], u = Fe[t.risk], l = t.canReschedule && !t.isDone;
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: l,
      onDragStart: l ? (i) => {
        i.stopPropagation(), i.dataTransfer.effectAllowed = "move", i.dataTransfer.setData("text/plain", t.key), a(t);
      } : void 0,
      onClick: (i) => {
        i.stopPropagation(), s(t);
      },
      title: t.subtitle ? `${t.title} — ${t.subtitle}` : t.title,
      style: u ? { backgroundImage: u.pattern } : void 0,
      className: p(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        u ? u.pill : "bg-neutral-subtle text-text-primary",
        t.isDone && "line-through opacity-65",
        l && "cursor-grab active:cursor-grabbing",
        /* Hata SATIRDA kalır — toast'a kaçmaz. */
        o && "ring-1 ring-negative-500",
        r && "opacity-60"
      ),
      children: [
        r ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin shrink-0 text-[9px]", "aria-hidden": "true" }) : d && /* @__PURE__ */ e.jsx("i", { className: p("fa shrink-0 text-[9px] opacity-70", d.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: t.title }),
        o && /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation ms-auto shrink-0 text-[9px]", "aria-hidden": "true" })
      ]
    }
  );
}
function Me({ summary: t, onSelect: s }) {
  const a = I[t.source];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: (r) => {
        r.stopPropagation(), s(t.source);
      },
      className: p(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left",
        "text-[10.5px] font-medium text-text-secondary hover:bg-surface-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      ),
      children: [
        a && /* @__PURE__ */ e.jsx("i", { className: p("fa shrink-0 text-[9px] opacity-60", a.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: Ce(t) })
      ]
    }
  );
}
function Ye({ load: t, capacity: s }) {
  if (!s || t <= 0) return null;
  const a = Math.min(t / s, 1), r = t > s;
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "mt-auto flex h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle",
      title: `Gün yükü ${j.hours(t)} / kapasite ${j.hours(s)}`,
      "aria-label": `Gün yükü ${j.hours(t)}, kapasite ${j.hours(s)}`,
      children: /* @__PURE__ */ e.jsx(
        "span",
        {
          className: p("h-full", r ? "bg-negative" : "bg-accent"),
          style: { width: `${a * 100}%` }
        }
      )
    }
  );
}
function _e({
  month: t,
  byDay: s,
  today: a,
  capacity: r,
  onSelectItem: o,
  onSelectDay: d,
  selectedDay: u,
  onDropItem: l,
  pending: i = {},
  errors: m = {}
}) {
  const n = we(t), c = w(a), [x, y] = ne.useState(null), [b, D] = ne.useState(null);
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Oe.map((T, v) => /* @__PURE__ */ e.jsx(
      "div",
      {
        className: p(
          "px-2.5 py-2 text-right text-[10.5px] font-bold uppercase tracking-wider",
          v > 4 ? "text-text-tertiary opacity-70" : "text-text-tertiary"
        ),
        children: T
      },
      T
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: n.map((T) => {
      const v = w(T), k = s[v] ?? [], { pills: F, summaries: U } = Ee(k), A = ee(k), E = T.getMonth() !== t.getMonth(), C = v === c, R = v === u;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          role: "gridcell",
          tabIndex: -1,
          onClick: () => d(v),
          onDragOver: x ? (g) => {
            g.preventDefault(), g.dataTransfer.dropEffect = "move", b !== v && D(v);
          } : void 0,
          onDragLeave: x ? () => D((g) => g === v ? null : g) : void 0,
          onDrop: x ? (g) => {
            g.preventDefault();
            const K = x;
            y(null), D(null), K && K.date.slice(0, 10) !== v && l(K, /* @__PURE__ */ new Date(`${v}T00:00:00`));
          } : void 0,
          className: p(
            "flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5",
            "transition-colors duration-fast last:border-r-0 hover:bg-surface-hover",
            E ? "bg-surface-sunken" : "bg-surface-base",
            R && "ring-2 ring-inset ring-border-focus",
            b === v && "bg-primary-subtle ring-2 ring-inset ring-accent"
          ),
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
              A > 0 && r && A > r && /* @__PURE__ */ e.jsx("span", { className: "rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: j.hours(A) }),
              /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: p(
                    "ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11.5px] font-semibold leading-none tabular-nums",
                    C && "bg-accent text-white",
                    !C && E && "text-text-tertiary opacity-60",
                    !C && !E && "text-text-secondary"
                  ),
                  children: T.getDate()
                }
              )
            ] }),
            F.map((g) => /* @__PURE__ */ e.jsx(
              Ke,
              {
                item: g,
                onSelect: o,
                onDragStart: y,
                isPending: !!i[g.key],
                hasError: !!m[g.key]
              },
              g.key
            )),
            U.map((g) => /* @__PURE__ */ e.jsx(
              Me,
              {
                summary: g,
                onSelect: () => d(v)
              },
              `${v}-${g.source}`
            )),
            /* @__PURE__ */ e.jsx(Ye, { load: A, capacity: r })
          ]
        },
        v
      );
    }) })
  ] });
}
function Ge({ sources: t, counts: s, enabled: a, onToggle: r, compact: o = !1 }) {
  const d = (t ?? []).filter((u) => u.isAvailable);
  return d.length === 0 ? null : /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Takvim kaynakları",
      className: p(
        "flex flex-col gap-1 rounded-card border border-subtle bg-surface-base p-2",
        o ? "w-[60px] items-center" : "w-full"
      ),
      children: [
        !o && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Kaynaklar" }),
        d.map((u) => {
          const l = I[u.source];
          if (!l) return null;
          const i = a.has(u.source), m = s[u.source] ?? 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": i,
              title: o ? `${l.label} — ${m} öğe` : void 0,
              onClick: () => r(u.source),
              className: p(
                "group flex items-center rounded-md text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                o ? "relative h-11 w-11 justify-center" : "gap-2.5 px-2 py-2",
                i ? "text-text-primary" : "text-text-tertiary",
                "hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: p(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px]",
                      i ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: p("fa", l.icon) })
                  }
                ),
                o ? m > 0 && /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: p(
                      "absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-[9.5px] font-bold leading-4",
                      i ? "bg-accent text-white" : "bg-neutral-200 text-text-tertiary"
                    ),
                    children: m
                  }
                ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                  /* @__PURE__ */ e.jsx("span", { className: p("flex-1 truncate text-[12.5px] font-medium", !i && "line-through decoration-1"), children: l.label }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: m })
                ] })
              ]
            },
            u.source
          );
        })
      ]
    }
  );
}
const Pe = { month: "Ay", agenda: "Ajanda" };
function Be({ month: t, view: s, onView: a, onPrev: r, onNext: o, onToday: d, overloadDays: u }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: r,
          "aria-label": "Önceki ay",
          className: "h-9 w-9 rounded-l-md border border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-left", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: o,
          "aria-label": "Sonraki ay",
          className: "h-9 w-9 rounded-r-md border border-l-0 border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(O, { variant: "outline", size: "sm", onClick: d, children: "Bugün" }),
    /* @__PURE__ */ e.jsx("h2", { className: "ml-1 text-[17px] font-semibold capitalize tracking-tight text-text-primary", children: j.monthTitle(t) }),
    /* @__PURE__ */ e.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
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
      /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(Pe).map(([l, i]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": s === l,
          onClick: () => a(l),
          className: p(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            s === l ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: i
        },
        l
      )) })
    ] })
  ] });
}
const Ue = {
  [S.OVERDUE]: { text: "Gecikmiş", cls: "bg-negative-50 text-negative-700" },
  [S.DUE_TODAY]: { text: "Bugün son gün", cls: "bg-warning-50 text-warning-700" }
};
function Y({ label: t, children: s }) {
  return s ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-subtle py-2.5 last:border-b-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11.5px] font-medium text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "min-w-0 text-right text-[12.5px] text-text-primary", children: s })
  ] }) : null;
}
function ze({ item: t, capacity: s, onClose: a, onReschedule: r, onComplete: o, isPending: d, error: u, onRetry: l }) {
  const [i, m] = f.useState(() => t.date.slice(0, 10)), n = I[t.source], c = Ue[t.risk], x = t.date.slice(0, 10), y = () => {
    !i || i === x || r(t, /* @__PURE__ */ new Date(`${i}T00:00:00`));
  };
  return /* @__PURE__ */ e.jsx(q, { open: !0, onOpenChange: (b) => {
    b || a();
  }, children: /* @__PURE__ */ e.jsxs(H, { side: "right", title: t.title, className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md bg-neutral-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary", children: [
          n && /* @__PURE__ */ e.jsx("i", { className: p("fa text-[10px]", n.icon), "aria-hidden": "true" }),
          n == null ? void 0 : n.label
        ] }),
        c && /* @__PURE__ */ e.jsx("span", { className: p("rounded-md px-2 py-1 text-[11px] font-bold", c.cls), children: c.text }),
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
    u && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-negative-100 bg-negative-50 px-4 py-2.5 text-[12px] text-negative-700", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: u }),
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: l, className: "font-semibold underline", children: "Yeniden dene" })
    ] }),
    d && /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle px-4 py-2 text-[12px] text-text-tertiary", "aria-live": "polite", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "kaydediliyor…"
    ] }),
    t.canReschedule && !t.isDone && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs(O, { size: "sm", variant: "secondary", onClick: () => o(t), children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-check me-1.5", "aria-hidden": "true" }),
        "Tamamla"
      ] }),
      /* @__PURE__ */ e.jsx(
        O,
        {
          size: "sm",
          variant: "outline",
          onClick: () => r(t, G(/* @__PURE__ */ new Date(`${x}T00:00:00`), 1)),
          children: "+1 gün ertele"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-2", children: [
      /* @__PURE__ */ e.jsx(Y, { label: "Son tarih", children: t.canReschedule ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "date",
            value: i,
            onChange: (b) => m(b.target.value),
            className: "rounded-md border border-default bg-surface-base px-2 py-1 text-[12.5px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": "Son tarih"
          }
        ),
        i !== x && /* @__PURE__ */ e.jsx(O, { size: "sm", variant: "primary", onClick: y, children: "Uygula" })
      ] }) : /* @__PURE__ */ e.jsxs("span", { className: "text-text-secondary", children: [
        j.dayTitle(/* @__PURE__ */ new Date(`${x}T00:00:00`)),
        /* @__PURE__ */ e.jsx("span", { className: "ml-1.5 text-text-tertiary", children: "· takvimden değiştirilemez" })
      ] }) }),
      /* @__PURE__ */ e.jsx(Y, { label: "Bağlam", children: t.subtitle }),
      /* @__PURE__ */ e.jsx(Y, { label: "Atanan", children: t.assigneeName }),
      /* @__PURE__ */ e.jsx(Y, { label: "Tutar", children: t.amount != null ? j.money(t.amount, t.currency) : null }),
      /* @__PURE__ */ e.jsx(Y, { label: "Gün yükü", children: t.loadHours != null ? `${j.hours(t.loadHours)}${s ? ` / ${j.hours(s)} kapasite` : ""}` : null })
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
const Le = 6e4;
function Ve({ from: t, to: s }) {
  const a = w(t), r = w(s);
  return ye({
    queryKey: ["calendar", "feed", a, r],
    queryFn: () => W.get(`/api/app/calendar/feed?From=${a}&To=${r}`),
    staleTime: Le,
    placeholderData: (o) => o
    /* ay geçişinde boş ekran yerine eski veri */
  });
}
const ce = "apya.calendar.view", X = "apya.calendar.sources", B = ["month", "agenda"];
function ue(t) {
  try {
    return window.localStorage.getItem(t);
  } catch {
    return null;
  }
}
function Q(t, s) {
  try {
    window.localStorage.setItem(t, s);
  } catch {
  }
}
function Qe() {
  const t = new URLSearchParams(window.location.search).get("view");
  if (B.includes(t)) return t;
  const s = ue(ce);
  return B.includes(s) ? s : null;
}
function qe() {
  const t = ue(X);
  if (!t) return new Set(_);
  const s = t.split(",").map(Number).filter((a) => _.includes(a));
  return s.length ? new Set(s) : new Set(_);
}
function He({ defaultView: t = "month" } = {}) {
  const [s] = f.useState(Qe), [a, r] = f.useState(() => s ?? t), [o, d] = f.useState(qe);
  f.useEffect(() => {
    const n = new URL(window.location.href);
    n.searchParams.get("view") !== a && (n.searchParams.set("view", a), window.history.replaceState({}, "", n));
  }, [a]);
  const u = f.useCallback((n) => {
    B.includes(n) && (r(n), Q(ce, n));
  }, []), l = f.useCallback((n) => {
    d((c) => {
      const x = new Set(c);
      return x.has(n) ? x.delete(n) : x.add(n), Q(X, [...x].join(",")), x;
    });
  }, []), i = f.useCallback((n) => {
    s || B.includes(n) && r((c) => c === n ? c : n);
  }, [s]), m = f.useCallback(() => {
    const n = new Set(_);
    d(n), Q(X, [...n].join(","));
  }, []);
  return { view: a, setView: u, applyResponsiveDefault: i, enabledSources: o, toggleSource: l, resetSources: m };
}
const $ = ["calendar", "feed"];
function We(t, s, a) {
  t.setQueriesData({ queryKey: $ }, (r) => r != null && r.items ? {
    ...r,
    items: r.items.map((o) => o.key === s ? { ...o, date: `${a}T00:00:00` } : o)
  } : r);
}
function Je(t, s) {
  t.setQueriesData({ queryKey: $ }, (a) => a != null && a.items ? {
    ...a,
    items: a.items.map((r) => r.key === s ? { ...r, isDone: !0, risk: 0, loadHours: null } : r)
  } : a);
}
function Xe() {
  const t = ve(), [s, a] = f.useState(null), [r, o] = f.useState({}), [d, u] = f.useState({}), l = f.useCallback((n) => {
    o((c) => {
      if (!c[n]) return c;
      const x = { ...c };
      return delete x[n], x;
    });
  }, []), i = re({
    mutationFn: ({ item: n, newDate: c }) => W.post("/api/app/calendar/reschedule-item", {
      source: n.source,
      sourceId: n.sourceId,
      newDate: w(c)
    }),
    onMutate: async ({ item: n, newDate: c }) => {
      await t.cancelQueries({ queryKey: $ });
      const x = t.getQueriesData({ queryKey: $ });
      return l(n.key), u((y) => ({ ...y, [n.key]: !0 })), We(t, n.key, w(c)), { snapshot: x, previousDate: n.date.slice(0, 10) };
    },
    onError: (n, { item: c }, x) => {
      var y;
      (y = x == null ? void 0 : x.snapshot) == null || y.forEach(([b, D]) => t.setQueryData(b, D)), o((b) => ({
        ...b,
        [c.key]: (n == null ? void 0 : n.message) || "Kaydedilemedi — tarih değişmedi."
      }));
    },
    onSuccess: (n, { item: c, newDate: x }, y) => {
      a({
        key: c.key,
        message: `“${c.title}” ${w(x)} tarihine taşındı.`,
        undo: () => i.mutate({
          item: { ...c, date: `${w(x)}T00:00:00` },
          newDate: /* @__PURE__ */ new Date(`${y.previousDate}T00:00:00`)
        })
      });
    },
    onSettled: (n, c, { item: x }) => {
      u((y) => {
        const b = { ...y };
        return delete b[x.key], b;
      }), t.invalidateQueries({ queryKey: $ });
    }
  }), m = re({
    mutationFn: ({ item: n }) => W.post("/api/app/calendar/complete-item", {
      source: n.source,
      sourceId: n.sourceId
    }),
    onMutate: async ({ item: n }) => {
      await t.cancelQueries({ queryKey: $ });
      const c = t.getQueriesData({ queryKey: $ });
      return l(n.key), u((x) => ({ ...x, [n.key]: !0 })), Je(t, n.key), { snapshot: c };
    },
    onError: (n, { item: c }, x) => {
      var y;
      (y = x == null ? void 0 : x.snapshot) == null || y.forEach(([b, D]) => t.setQueryData(b, D)), o((b) => ({
        ...b,
        [c.key]: (n == null ? void 0 : n.message) || "Tamamlanamadı."
      }));
    },
    onSuccess: (n, { item: c }) => {
      a({ key: c.key, message: `“${c.title}” tamamlandı.`, undo: null });
    },
    onSettled: (n, c, { item: x }) => {
      u((y) => {
        const b = { ...y };
        return delete b[x.key], b;
      }), t.invalidateQueries({ queryKey: $ });
    }
  });
  return {
    reschedule: (n, c) => i.mutate({ item: n, newDate: c }),
    complete: (n) => m.mutate({ item: n }),
    retry: (n, c) => c ? i.mutate({ item: n, newDate: c }) : m.mutate({ item: n }),
    lastAction: s,
    dismissAction: () => a(null),
    errors: r,
    clearError: l,
    pending: d
  };
}
function Ze() {
  const t = f.useRef(null), [s, a] = f.useState(0);
  return f.useLayoutEffect(() => {
    const r = t.current;
    if (!r || (a(r.getBoundingClientRect().width), typeof ResizeObserver > "u")) return;
    const o = new ResizeObserver((d) => {
      for (const u of d)
        a(u.contentRect.width);
    });
    return o.observe(r), () => o.disconnect();
  }, []), [t, s];
}
function et(t) {
  return t === 0 || t >= 1180 ? "wide" : t >= 780 ? "medium" : "narrow";
}
const tt = 60;
function st() {
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Array.from({ length: 7 }, (t, s) => /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-2", children: /* @__PURE__ */ e.jsx(V, { height: 10 }) }, s)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: Array.from({ length: Z }, (t, s) => /* @__PURE__ */ e.jsxs("div", { className: "min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0", children: [
      /* @__PURE__ */ e.jsx(V, { height: 12, width: "40%", className: "ml-auto" }),
      s % 3 === 0 && /* @__PURE__ */ e.jsx(V, { height: 14, className: "mt-2" })
    ] }, s)) })
  ] });
}
function nt() {
  const [t, s] = Ze(), a = et(s), r = a === "narrow", o = f.useMemo(() => ke(/* @__PURE__ */ new Date()), []), [d, u] = f.useState(() => new Date(o.getFullYear(), o.getMonth(), 1)), [l, i] = f.useState(null), [m, n] = f.useState(null), { view: c, setView: x, applyResponsiveDefault: y, enabledSources: b, toggleSource: D, resetSources: T } = He();
  f.useEffect(() => {
    s !== 0 && y(r ? "agenda" : "month");
  }, [s, r, y]);
  const v = f.useMemo(() => {
    if (c === "agenda")
      return { from: G(o, -60), to: G(o, tt) };
    const h = ie(d);
    return { from: h, to: G(h, Z - 1) };
  }, [c, d, o]), { data: k, isPending: F, isError: U, refetch: A } = Ve(v), E = (k == null ? void 0 : k.items) ?? [], C = f.useMemo(
    () => E.filter((h) => b.has(h.source)),
    [E, b]
  ), R = f.useMemo(() => le(C), [C]), g = (k == null ? void 0 : k.dailyCapacityHours) ?? null, K = f.useMemo(() => {
    const h = {};
    for (const se of (k == null ? void 0 : k.sources) ?? []) h[se.source] = se.count;
    return h;
  }, [k]), de = f.useMemo(() => g ? Object.values(R).filter((h) => ee(h) > g).length : 0, [R, g]);
  f.useEffect(() => {
    l && !R[l] && !F && (l >= w(v.from) && l <= w(v.to) || i(null));
  }, [l, R, F, v]);
  const z = f.useCallback((h) => n(h.key), []), xe = f.useCallback(() => {
    u(new Date(o.getFullYear(), o.getMonth(), 1)), i(w(o));
  }, [o]), N = Xe(), te = E.length > 0, me = te && C.length === 0, fe = l ? R[l] ?? [] : [], M = m ? E.find((h) => h.key === m) ?? null : null, L = l && /* @__PURE__ */ e.jsx(
    Ae,
    {
      dayKey: l,
      items: fe,
      capacity: g,
      onSelectItem: z,
      onClose: () => i(null)
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { ref: t, className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsx(
      Be,
      {
        month: d,
        view: c,
        onView: x,
        onPrev: () => u((h) => new Date(h.getFullYear(), h.getMonth() - 1, 1)),
        onNext: () => u((h) => new Date(h.getFullYear(), h.getMonth() + 1, 1)),
        onToday: xe,
        overloadDays: de
      }
    ),
    U && /* @__PURE__ */ e.jsxs("div", { className: "rounded-card border border-negative-100 bg-negative-50 px-3 py-2.5 text-[12.5px] text-negative-700", children: [
      "Takvim yüklenemedi.",
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => A(), className: "ml-2 font-semibold underline", children: "Yeniden dene" })
    ] }),
    N.lastAction && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "flex items-center gap-2 rounded-card border border-subtle bg-surface-raised px-3 py-2 text-[12.5px] text-text-secondary",
        role: "status",
        "aria-live": "polite",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left text-text-tertiary", "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 truncate", children: N.lastAction.message }),
          N.lastAction.undo && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                N.lastAction.undo(), N.dismissAction();
              },
              className: "font-semibold text-text-link hover:underline",
              children: "Geri al"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: N.dismissAction,
              "aria-label": "Şeridi kapat",
              className: "rounded p-1 text-text-tertiary hover:bg-surface-hover",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: p("flex gap-3", r ? "flex-col" : "flex-row items-start"), children: [
      !r && /* @__PURE__ */ e.jsx("div", { className: p("shrink-0", a === "wide" ? "w-[240px]" : "w-auto"), children: /* @__PURE__ */ e.jsx(
        Ge,
        {
          sources: (k == null ? void 0 : k.sources) ?? [],
          counts: K,
          enabled: b,
          onToggle: D,
          compact: a !== "wide"
        }
      ) }),
      /* @__PURE__ */ e.jsx("div", { className: "min-w-0 flex-1", children: F ? /* @__PURE__ */ e.jsx(st, {}) : me ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
        P,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-filter-circle-xmark" }),
          title: "Bu filtreyle gösterilecek öğe yok",
          description: "Kaynak rayında kapattığınız türler bu aralıktaki tüm öğeleri gizliyor.",
          action: /* @__PURE__ */ e.jsx(O, { size: "sm", variant: "outline", onClick: T, children: "Kaynakları aç" })
        }
      ) }) : te ? c === "month" ? /* @__PURE__ */ e.jsx(
        _e,
        {
          month: d,
          byDay: R,
          today: o,
          capacity: g,
          selectedDay: l,
          onSelectItem: z,
          onSelectDay: i,
          onDropItem: N.reschedule,
          pending: N.pending,
          errors: N.errors
        }
      ) : /* @__PURE__ */ e.jsx(Ie, { items: C, today: o, onSelectItem: z }) : /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
        P,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
          title: "Bu aralıkta planlanmış bir şey yok",
          description: "Son tarihi olan görevler, fatura vadeleri, hibe son tarihleri ve tarihli finans kayıtları burada birlikte görünür.",
          action: /* @__PURE__ */ e.jsx(O, { size: "sm", variant: "outline", onClick: () => {
            window.location.href = "/Tasks";
          }, children: "Görev oluştur" })
        }
      ) }) }),
      a === "wide" && l && /* @__PURE__ */ e.jsx("div", { className: "w-[340px] shrink-0 self-stretch", children: L })
    ] }),
    a === "medium" && l && /* @__PURE__ */ e.jsx(q, { open: !0, onOpenChange: (h) => {
      h || i(null);
    }, children: /* @__PURE__ */ e.jsx(H, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: L }) }),
    r && l && /* @__PURE__ */ e.jsx(q, { open: !0, onOpenChange: (h) => {
      h || i(null);
    }, children: /* @__PURE__ */ e.jsx(H, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: L }) }),
    M && /* @__PURE__ */ e.jsx(
      ze,
      {
        item: M,
        capacity: g,
        onClose: () => n(null),
        onReschedule: N.reschedule,
        onComplete: N.complete,
        isPending: !!N.pending[M.key],
        error: N.errors[M.key],
        onRetry: () => N.clearError(M.key)
      }
    )
  ] });
}
const ae = document.getElementById("apya-calendar-root");
ae && pe(ae).render(
  /* @__PURE__ */ e.jsx(be, { children: /* @__PURE__ */ e.jsx(he, { children: /* @__PURE__ */ e.jsx(ge, { children: /* @__PURE__ */ e.jsx(nt, {}) }) }) })
);
