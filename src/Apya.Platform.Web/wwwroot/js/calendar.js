import { j as t, r as m, b as oe } from "./react-vendor.js";
import { c as f, B as P, d as L, e as W, S as Y, T as ie } from "./Dialog.js";
import { D as le } from "./useDeviceMode.js";
import { a as ce } from "./QueryProvider.js";
import { E as C } from "./EmptyState.js";
import { u as ue } from "./query-vendor.js";
import { a as de } from "./httpClient.js";
/* empty css      */
const S = {
  1: { key: "task", label: "Görev", plural: "görev", icon: "fa-circle-check" },
  2: { key: "invoice", label: "Fatura", plural: "fatura", icon: "fa-file-invoice" },
  3: { key: "grant", label: "Hibe", plural: "hibe", icon: "fa-award" },
  4: { key: "expense", label: "Gider", plural: "gider", icon: "fa-arrow-trend-down" },
  5: { key: "income", label: "Gelir", plural: "gelir", icon: "fa-arrow-trend-up" },
  6: { key: "cash", label: "Kasa hareketi", plural: "kasa hareketi", icon: "fa-wallet" }
}, R = [1, 2, 3, 4, 5, 6], w = { DUE_TODAY: 1, OVERDUE: 2 }, fe = (e) => e.risk === w.OVERDUE || e.risk === w.DUE_TODAY, Q = 864e5, xe = (e) => new Date(e.getFullYear(), e.getMonth(), e.getDate()), A = (e, n) => new Date(e.getFullYear(), e.getMonth(), e.getDate() + n);
function v(e) {
  const n = (s) => (s < 10 ? "0" : "") + s;
  return `${e.getFullYear()}-${n(e.getMonth() + 1)}-${n(e.getDate())}`;
}
function me(e) {
  const n = (e.getDay() + 6) % 7;
  return new Date(e.getTime() - n * Q);
}
const q = (e) => me(new Date(e.getFullYear(), e.getMonth(), 1)), K = 42;
function be(e) {
  const n = q(e);
  return Array.from({ length: K }, (s, r) => new Date(n.getTime() + r * Q));
}
const he = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }), pe = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }), ge = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }), h = {
  monthTitle: (e) => he.format(e),
  dayTitle: (e) => pe.format(e),
  dayShort: (e) => ge.format(e),
  /** Tam tutar — panel ve ajanda satırlarında. */
  money: (e, n = "TRY") => {
    try {
      return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: n || "TRY",
        maximumFractionDigits: 0
      }).format(e ?? 0);
    } catch {
      return `${e ?? 0} ${n || "TRY"}`;
    }
  },
  /** Kısa tutar — dar ay hücresinde ("₺163,4B"). */
  moneyCompact: (e, n = "TRY") => {
    try {
      return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: n || "TRY",
        notation: "compact",
        maximumFractionDigits: 1
      }).format(e ?? 0);
    } catch {
      return `${e ?? 0} ${n || "TRY"}`;
    }
  },
  hours: (e) => `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 }).format(e)} sa`
};
function J(e) {
  const n = {};
  for (const s of e ?? []) {
    const r = (s.date || "").slice(0, 10);
    r && (n[r] ?? (n[r] = [])).push(s);
  }
  return n;
}
const U = (e) => (e ?? []).reduce((n, s) => n + (s.loadHours ?? 0), 0);
function ye(e, { maxPills: n = 3, maxRiskPills: s = 2 } = {}) {
  const r = e ?? [];
  if (r.length === 0) return { pills: [], summaries: [] };
  if (r.length <= n) return { pills: r, summaries: [] };
  const c = r.filter(fe).slice(0, s), d = new Set(c.map((i) => i.key)), u = /* @__PURE__ */ new Map();
  for (const i of r) {
    if (d.has(i.key)) continue;
    const a = u.get(i.source) ?? { source: i.source, count: 0, amount: 0, hasAmount: !1, only: null };
    a.count += 1, a.only = a.count === 1 ? i : null, i.amount != null && (a.amount += i.amount, a.hasAmount = !0), u.set(i.source, a);
  }
  const l = [];
  for (const i of R) {
    const a = u.get(i);
    a && (a.count === 1 && a.only ? c.push(a.only) : l.push(a));
  }
  return { pills: c, summaries: l };
}
function ve(e, { compact: n = !0 } = {}) {
  const s = S[e.source], r = `${e.count} ${s ? s.plural : "öğe"}`;
  if (!e.hasAmount) return r;
  const o = n ? h.moneyCompact(e.amount) : h.money(e.amount);
  return `${r} · ${o}`;
}
function je(e, n) {
  const s = v(n), r = (e ?? []).filter((l) => !l.isDone), o = r.filter((l) => l.date.slice(0, 10) < s && l.risk === w.OVERDUE), c = r.filter((l) => l.date.slice(0, 10) >= s), d = J(c), u = Object.keys(d).sort().map((l) => ({
    key: l,
    date: /* @__PURE__ */ new Date(`${l}T00:00:00`),
    isToday: l === s,
    items: d[l]
  }));
  return { overdue: o, days: u };
}
const we = {
  [w.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [w.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function _({ item: e, onSelect: n, showDate: s = !1 }) {
  const r = S[e.source], o = we[e.risk];
  return /* @__PURE__ */ t.jsxs(
    "button",
    {
      type: "button",
      onClick: () => n(e),
      className: f(
        "flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left transition-colors duration-fast",
        "hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      ),
      children: [
        /* @__PURE__ */ t.jsx(
          "span",
          {
            className: "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-neutral-subtle text-[10px] text-text-tertiary",
            "aria-hidden": "true",
            children: r && /* @__PURE__ */ t.jsx("i", { className: f("fa", r.icon) })
          }
        ),
        /* @__PURE__ */ t.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ t.jsx("span", { className: f("block truncate text-[13px] font-semibold text-text-primary", e.isDone && "line-through opacity-65"), children: e.title }),
          /* @__PURE__ */ t.jsx("span", { className: "mt-0.5 block truncate text-[11.5px] text-text-tertiary", children: [
            s ? h.dayShort(/* @__PURE__ */ new Date(`${e.date.slice(0, 10)}T00:00:00`)) : null,
            e.subtitle,
            e.assigneeName,
            e.amount != null ? h.money(e.amount, e.currency) : null
          ].filter(Boolean).join(" · ") || (r ? r.label : "") })
        ] }),
        o && /* @__PURE__ */ t.jsx("span", { className: f("shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold", o.className), children: o.label })
      ]
    }
  );
}
function ke({ items: e, today: n, onSelectItem: s }) {
  const { overdue: r, days: o } = je(e, n);
  return r.length === 0 && o.length === 0 ? /* @__PURE__ */ t.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ t.jsx(
    C,
    {
      icon: /* @__PURE__ */ t.jsx("i", { className: "fa fa-mug-hot" }),
      title: "Planlanmış bir şey yok",
      description: "Son tarihli görevler, fatura vadeleri ve tarihli finans kayıtları burada öncelik sırasıyla listelenir."
    }
  ) }) : /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-4", children: [
    r.length > 0 && /* @__PURE__ */ t.jsxs("section", { className: "rounded-card border border-negative-100 bg-surface-base", children: [
      /* @__PURE__ */ t.jsxs("header", { className: "flex items-center gap-2 border-b border-negative-100 px-3 py-2", children: [
        /* @__PURE__ */ t.jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-negative-700", children: "Gecikmiş" }),
        /* @__PURE__ */ t.jsx("span", { className: "font-mono text-[11px] font-semibold tabular-nums text-negative-700", children: r.length })
      ] }),
      /* @__PURE__ */ t.jsx("div", { className: "p-1", children: r.map((c) => /* @__PURE__ */ t.jsx(_, { item: c, onSelect: s, showDate: !0 }, c.key)) })
    ] }),
    o.map((c) => /* @__PURE__ */ t.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
      /* @__PURE__ */ t.jsxs("header", { className: f(
        "flex items-center justify-between border-b border-subtle px-3 py-2",
        c.isToday && "border-b-accent"
      ), children: [
        /* @__PURE__ */ t.jsxs("span", { className: f(
          "text-[11px] font-bold uppercase tracking-wider",
          c.isToday ? "text-accent" : "text-text-tertiary"
        ), children: [
          h.dayTitle(c.date),
          c.isToday ? " · Bugün" : ""
        ] }),
        /* @__PURE__ */ t.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: c.items.length })
      ] }),
      /* @__PURE__ */ t.jsx("div", { className: "p-1", children: c.items.map((d) => /* @__PURE__ */ t.jsx(_, { item: d, onSelect: s }, d.key)) })
    ] }, c.key))
  ] });
}
function Ne({ dayKey: e, items: n, capacity: s, onSelectItem: r, onClose: o }) {
  const c = /* @__PURE__ */ new Date(`${e}T00:00:00`), d = U(n), u = s && d > s, l = n.reduce((i, a) => (i[a.source] = (i[a.source] ?? 0) + 1, i), {});
  return /* @__PURE__ */ t.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ t.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ t.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: h.dayTitle(c) }),
        /* @__PURE__ */ t.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(l).length === 0 ? "Planlanmış öğe yok" : Object.entries(l).map(([i, a]) => {
          var p;
          return `${a} ${((p = S[i]) == null ? void 0 : p.plural) ?? "öğe"}`;
        }).join(" · ") })
      ] }),
      o && /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          onClick: o,
          "aria-label": "Günü kapat",
          className: "shrink-0 rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] }),
    s && d > 0 && /* @__PURE__ */ t.jsxs("div", { className: f(
      "flex items-center justify-between border-b px-3 py-2 text-[11.5px]",
      u ? "border-negative-100 bg-negative-50 text-negative-700" : "border-subtle text-text-secondary"
    ), children: [
      /* @__PURE__ */ t.jsx("span", { className: "font-semibold", children: u ? "Kapasite aşımı" : "Gün yükü" }),
      /* @__PURE__ */ t.jsxs("span", { className: "font-mono tabular-nums", children: [
        h.hours(d),
        " / ",
        h.hours(s)
      ] })
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "flex-1 overflow-y-auto p-1", children: n.length === 0 ? /* @__PURE__ */ t.jsx(
      C,
      {
        compact: !0,
        icon: /* @__PURE__ */ t.jsx("i", { className: "fa fa-calendar-day" }),
        title: "Bu gün boş",
        description: "Bu güne düşen bir öğe yok."
      }
    ) : n.map((i) => /* @__PURE__ */ t.jsx(_, { item: i, onSelect: r }, i.key)) })
  ] });
}
const Se = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], De = {
  [w.OVERDUE]: {
    pill: "bg-negative-50 text-negative-700",
    /* çapraz tarama */
    pattern: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,.07) 3px, rgba(0,0,0,.07) 5px)"
  },
  [w.DUE_TODAY]: {
    pill: "bg-warning-50 text-warning-700",
    /* dikey çizgi */
    pattern: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,.06) 4px, rgba(0,0,0,.06) 5px)"
  }
};
function Te({ item: e, onSelect: n }) {
  const s = S[e.source], r = De[e.risk];
  return /* @__PURE__ */ t.jsxs(
    "button",
    {
      type: "button",
      onClick: (o) => {
        o.stopPropagation(), n(e);
      },
      title: e.subtitle ? `${e.title} — ${e.subtitle}` : e.title,
      style: r ? { backgroundImage: r.pattern } : void 0,
      className: f(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        r ? r.pill : "bg-neutral-subtle text-text-primary",
        e.isDone && "line-through opacity-65"
      ),
      children: [
        s && /* @__PURE__ */ t.jsx("i", { className: f("fa shrink-0 text-[9px] opacity-70", s.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsx("span", { className: "truncate", children: e.title })
      ]
    }
  );
}
function Re({ summary: e, onSelect: n }) {
  const s = S[e.source];
  return /* @__PURE__ */ t.jsxs(
    "button",
    {
      type: "button",
      onClick: (r) => {
        r.stopPropagation(), n(e.source);
      },
      className: f(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left",
        "text-[10.5px] font-medium text-text-secondary hover:bg-surface-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      ),
      children: [
        s && /* @__PURE__ */ t.jsx("i", { className: f("fa shrink-0 text-[9px] opacity-60", s.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsx("span", { className: "truncate", children: ve(e) })
      ]
    }
  );
}
function Ee({ load: e, capacity: n }) {
  if (!n || e <= 0) return null;
  const s = Math.min(e / n, 1), r = e > n;
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      className: "mt-auto flex h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle",
      title: `Gün yükü ${h.hours(e)} / kapasite ${h.hours(n)}`,
      "aria-label": `Gün yükü ${h.hours(e)}, kapasite ${h.hours(n)}`,
      children: /* @__PURE__ */ t.jsx(
        "span",
        {
          className: f("h-full", r ? "bg-negative" : "bg-accent"),
          style: { width: `${s * 100}%` }
        }
      )
    }
  );
}
function Ce({ month: e, byDay: n, today: s, capacity: r, onSelectItem: o, onSelectDay: c, selectedDay: d }) {
  const u = be(e), l = v(s);
  return /* @__PURE__ */ t.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ t.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Se.map((i, a) => /* @__PURE__ */ t.jsx(
      "div",
      {
        className: f(
          "px-2.5 py-2 text-right text-[10.5px] font-bold uppercase tracking-wider",
          a > 4 ? "text-text-tertiary opacity-70" : "text-text-tertiary"
        ),
        children: i
      },
      i
    )) }),
    /* @__PURE__ */ t.jsx("div", { className: "grid grid-cols-7", children: u.map((i) => {
      const a = v(i), p = n[a] ?? [], { pills: g, summaries: O } = ye(p), k = U(p), y = i.getMonth() !== e.getMonth(), b = a === l, D = a === d;
      return /* @__PURE__ */ t.jsxs(
        "div",
        {
          role: "gridcell",
          tabIndex: -1,
          onClick: () => c(a),
          className: f(
            "flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5",
            "transition-colors duration-fast last:border-r-0 hover:bg-surface-hover",
            y ? "bg-surface-sunken" : "bg-surface-base",
            D && "ring-2 ring-inset ring-border-focus"
          ),
          children: [
            /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between", children: [
              k > 0 && r && k > r && /* @__PURE__ */ t.jsx("span", { className: "rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: h.hours(k) }),
              /* @__PURE__ */ t.jsx(
                "span",
                {
                  className: f(
                    "ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11.5px] font-semibold leading-none tabular-nums",
                    b && "bg-accent text-white",
                    !b && y && "text-text-tertiary opacity-60",
                    !b && !y && "text-text-secondary"
                  ),
                  children: i.getDate()
                }
              )
            ] }),
            g.map((j) => /* @__PURE__ */ t.jsx(Te, { item: j, onSelect: o }, j.key)),
            O.map((j) => /* @__PURE__ */ t.jsx(
              Re,
              {
                summary: j,
                onSelect: () => c(a)
              },
              `${a}-${j.source}`
            )),
            /* @__PURE__ */ t.jsx(Ee, { load: k, capacity: r })
          ]
        },
        a
      );
    }) })
  ] });
}
function $e({ sources: e, counts: n, enabled: s, onToggle: r, compact: o = !1 }) {
  const c = (e ?? []).filter((d) => d.isAvailable);
  return c.length === 0 ? null : /* @__PURE__ */ t.jsxs(
    "nav",
    {
      "aria-label": "Takvim kaynakları",
      className: f(
        "flex flex-col gap-1 rounded-card border border-subtle bg-surface-base p-2",
        o ? "w-[60px] items-center" : "w-full"
      ),
      children: [
        !o && /* @__PURE__ */ t.jsx("p", { className: "px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Kaynaklar" }),
        c.map((d) => {
          const u = S[d.source];
          if (!u) return null;
          const l = s.has(d.source), i = n[d.source] ?? 0;
          return /* @__PURE__ */ t.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": l,
              title: o ? `${u.label} — ${i} öğe` : void 0,
              onClick: () => r(d.source),
              className: f(
                "group flex items-center rounded-md text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                o ? "relative h-11 w-11 justify-center" : "gap-2.5 px-2 py-2",
                l ? "text-text-primary" : "text-text-tertiary",
                "hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ t.jsx(
                  "span",
                  {
                    className: f(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px]",
                      l ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ t.jsx("i", { className: f("fa", u.icon) })
                  }
                ),
                o ? i > 0 && /* @__PURE__ */ t.jsx(
                  "span",
                  {
                    className: f(
                      "absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-[9.5px] font-bold leading-4",
                      l ? "bg-accent text-white" : "bg-neutral-200 text-text-tertiary"
                    ),
                    children: i
                  }
                ) : /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
                  /* @__PURE__ */ t.jsx("span", { className: f("flex-1 truncate text-[12.5px] font-medium", !l && "line-through decoration-1"), children: u.label }),
                  /* @__PURE__ */ t.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: i })
                ] })
              ]
            },
            d.source
          );
        })
      ]
    }
  );
}
const Oe = { month: "Ay", agenda: "Ajanda" };
function Fe({ month: e, view: n, onView: s, onPrev: r, onNext: o, onToday: c, overloadDays: d, compact: u }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          onClick: r,
          "aria-label": "Önceki ay",
          className: "h-9 w-9 rounded-l-md border border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-chevron-left", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          onClick: o,
          "aria-label": "Sonraki ay",
          className: "h-9 w-9 rounded-r-md border border-l-0 border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-chevron-right", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ t.jsx(P, { variant: "outline", size: "sm", onClick: c, children: "Bugün" }),
    /* @__PURE__ */ t.jsx("h2", { className: "ml-1 text-[17px] font-semibold capitalize tracking-tight text-text-primary", children: h.monthTitle(e) }),
    /* @__PURE__ */ t.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
      d > 0 && /* @__PURE__ */ t.jsxs(
        "span",
        {
          className: "rounded-md bg-negative-50 px-2 py-1 text-[11.5px] font-semibold text-negative-700",
          title: "Günlük kapasitenizi aşan gün sayısı",
          children: [
            /* @__PURE__ */ t.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
            d,
            " günde kapasite aşımı"
          ]
        }
      ),
      /* @__PURE__ */ t.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(Oe).map(([l, i]) => /* @__PURE__ */ t.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": n === l,
          onClick: () => s(l),
          className: f(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            n === l ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: u ? i.slice(0, 1) : i
        },
        l
      )) })
    ] })
  ] });
}
const Ie = 6e4;
function Me({ from: e, to: n }) {
  const s = v(e), r = v(n);
  return ue({
    queryKey: ["calendar", "feed", s, r],
    queryFn: () => de.get(`/api/app/calendar/feed?From=${s}&To=${r}`),
    staleTime: Ie,
    placeholderData: (o) => o
    /* ay geçişinde boş ekran yerine eski veri */
  });
}
const X = "apya.calendar.view", B = "apya.calendar.sources", $ = ["month", "agenda"];
function Z(e) {
  try {
    return window.localStorage.getItem(e);
  } catch {
    return null;
  }
}
function G(e, n) {
  try {
    window.localStorage.setItem(e, n);
  } catch {
  }
}
function Ye() {
  const e = new URLSearchParams(window.location.search).get("view");
  if ($.includes(e)) return e;
  const n = Z(X);
  return $.includes(n) ? n : null;
}
function Ae() {
  const e = Z(B);
  if (!e) return new Set(R);
  const n = e.split(",").map(Number).filter((s) => R.includes(s));
  return n.length ? new Set(n) : new Set(R);
}
function Ge({ defaultView: e = "month" } = {}) {
  const [n] = m.useState(Ye), [s, r] = m.useState(() => n ?? e), [o, c] = m.useState(Ae);
  m.useEffect(() => {
    const a = new URL(window.location.href);
    a.searchParams.get("view") !== s && (a.searchParams.set("view", s), window.history.replaceState({}, "", a));
  }, [s]);
  const d = m.useCallback((a) => {
    $.includes(a) && (r(a), G(X, a));
  }, []), u = m.useCallback((a) => {
    c((p) => {
      const g = new Set(p);
      return g.has(a) ? g.delete(a) : g.add(a), G(B, [...g].join(",")), g;
    });
  }, []), l = m.useCallback((a) => {
    n || $.includes(a) && r((p) => p === a ? p : a);
  }, [n]), i = m.useCallback(() => {
    const a = new Set(R);
    c(a), G(B, [...a].join(","));
  }, []);
  return { view: s, setView: d, applyResponsiveDefault: l, enabledSources: o, toggleSource: u, resetSources: i };
}
function Pe() {
  const e = m.useRef(null), [n, s] = m.useState(0);
  return m.useLayoutEffect(() => {
    const r = e.current;
    if (!r || (s(r.getBoundingClientRect().width), typeof ResizeObserver > "u")) return;
    const o = new ResizeObserver((c) => {
      for (const d of c)
        s(d.contentRect.width);
    });
    return o.observe(r), () => o.disconnect();
  }, []), [e, n];
}
function _e(e) {
  return e === 0 || e >= 1180 ? "wide" : e >= 780 ? "medium" : "narrow";
}
const Be = 60;
function Ke() {
  return /* @__PURE__ */ t.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", "aria-hidden": "true", children: [
    /* @__PURE__ */ t.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Array.from({ length: 7 }, (e, n) => /* @__PURE__ */ t.jsx("div", { className: "px-2.5 py-2", children: /* @__PURE__ */ t.jsx(Y, { height: 10 }) }, n)) }),
    /* @__PURE__ */ t.jsx("div", { className: "grid grid-cols-7", children: Array.from({ length: K }, (e, n) => /* @__PURE__ */ t.jsxs("div", { className: "min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0", children: [
      /* @__PURE__ */ t.jsx(Y, { height: 12, width: "40%", className: "ml-auto" }),
      n % 3 === 0 && /* @__PURE__ */ t.jsx(Y, { height: 14, className: "mt-2" })
    ] }, n)) })
  ] });
}
function Ue() {
  const [e, n] = Pe(), s = _e(n), r = s === "narrow", o = m.useMemo(() => xe(/* @__PURE__ */ new Date()), []), [c, d] = m.useState(() => new Date(o.getFullYear(), o.getMonth(), 1)), [u, l] = m.useState(null), { view: i, setView: a, applyResponsiveDefault: p, enabledSources: g, toggleSource: O, resetSources: k } = Ge();
  m.useEffect(() => {
    n !== 0 && p(r ? "agenda" : "month");
  }, [n, r, p]);
  const y = m.useMemo(() => {
    if (i === "agenda")
      return { from: A(o, -60), to: A(o, Be) };
    const x = q(c);
    return { from: x, to: A(x, K - 1) };
  }, [i, c, o]), { data: b, isPending: D, isError: j, refetch: ee } = Me(y), F = (b == null ? void 0 : b.items) ?? [], E = m.useMemo(
    () => F.filter((x) => g.has(x.source)),
    [F, g]
  ), N = m.useMemo(() => J(E), [E]), T = (b == null ? void 0 : b.dailyCapacityHours) ?? null, te = m.useMemo(() => {
    const x = {};
    for (const z of (b == null ? void 0 : b.sources) ?? []) x[z.source] = z.count;
    return x;
  }, [b]), ne = m.useMemo(() => T ? Object.values(N).filter((x) => U(x) > T).length : 0, [N, T]);
  m.useEffect(() => {
    u && !N[u] && !D && (u >= v(y.from) && u <= v(y.to) || l(null));
  }, [u, N, D, y]);
  const I = m.useCallback((x) => {
    x.href && (window.location.href = x.href);
  }, []), re = m.useCallback(() => {
    d(new Date(o.getFullYear(), o.getMonth(), 1)), l(v(o));
  }, [o]), V = F.length > 0, se = V && E.length === 0, ae = u ? N[u] ?? [] : [], M = u && /* @__PURE__ */ t.jsx(
    Ne,
    {
      dayKey: u,
      items: ae,
      capacity: T,
      onSelectItem: I,
      onClose: () => l(null)
    }
  );
  return /* @__PURE__ */ t.jsxs("div", { ref: e, className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ t.jsx(
      Fe,
      {
        month: c,
        view: i,
        onView: a,
        onPrev: () => d((x) => new Date(x.getFullYear(), x.getMonth() - 1, 1)),
        onNext: () => d((x) => new Date(x.getFullYear(), x.getMonth() + 1, 1)),
        onToday: re,
        overloadDays: ne,
        compact: r
      }
    ),
    j && /* @__PURE__ */ t.jsxs("div", { className: "rounded-card border border-negative-100 bg-negative-50 px-3 py-2.5 text-[12.5px] text-negative-700", children: [
      "Takvim yüklenemedi.",
      /* @__PURE__ */ t.jsx("button", { type: "button", onClick: () => ee(), className: "ml-2 font-semibold underline", children: "Yeniden dene" })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: f("flex gap-3", r ? "flex-col" : "flex-row items-start"), children: [
      !r && /* @__PURE__ */ t.jsx("div", { className: f("shrink-0", s === "wide" ? "w-[240px]" : "w-auto"), children: /* @__PURE__ */ t.jsx(
        $e,
        {
          sources: (b == null ? void 0 : b.sources) ?? [],
          counts: te,
          enabled: g,
          onToggle: O,
          compact: s !== "wide"
        }
      ) }),
      /* @__PURE__ */ t.jsx("div", { className: "min-w-0 flex-1", children: D ? /* @__PURE__ */ t.jsx(Ke, {}) : se ? /* @__PURE__ */ t.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ t.jsx(
        C,
        {
          icon: /* @__PURE__ */ t.jsx("i", { className: "fa fa-filter-circle-xmark" }),
          title: "Bu filtreyle gösterilecek öğe yok",
          description: "Kaynak rayında kapattığınız türler bu aralıktaki tüm öğeleri gizliyor.",
          action: /* @__PURE__ */ t.jsx(P, { size: "sm", variant: "outline", onClick: k, children: "Kaynakları aç" })
        }
      ) }) : V ? i === "month" ? /* @__PURE__ */ t.jsx(
        Ce,
        {
          month: c,
          byDay: N,
          today: o,
          capacity: T,
          selectedDay: u,
          onSelectItem: I,
          onSelectDay: l
        }
      ) : /* @__PURE__ */ t.jsx(ke, { items: E, today: o, onSelectItem: I }) : /* @__PURE__ */ t.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ t.jsx(
        C,
        {
          icon: /* @__PURE__ */ t.jsx("i", { className: "fa fa-calendar-plus" }),
          title: "Bu aralıkta planlanmış bir şey yok",
          description: "Son tarihi olan görevler, fatura vadeleri, hibe son tarihleri ve tarihli finans kayıtları burada birlikte görünür.",
          action: /* @__PURE__ */ t.jsx(P, { size: "sm", variant: "outline", onClick: () => {
            window.location.href = "/Tasks";
          }, children: "Görev oluştur" })
        }
      ) }) }),
      s === "wide" && u && /* @__PURE__ */ t.jsx("div", { className: "w-[340px] shrink-0 self-stretch", children: M })
    ] }),
    s === "medium" && u && /* @__PURE__ */ t.jsx(L, { open: !0, onOpenChange: (x) => {
      x || l(null);
    }, children: /* @__PURE__ */ t.jsx(W, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: M }) }),
    r && u && /* @__PURE__ */ t.jsx(L, { open: !0, onOpenChange: (x) => {
      x || l(null);
    }, children: /* @__PURE__ */ t.jsx(W, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: M }) })
  ] });
}
const H = document.getElementById("apya-calendar-root");
H && oe(H).render(
  /* @__PURE__ */ t.jsx(ie, { children: /* @__PURE__ */ t.jsx(le, { children: /* @__PURE__ */ t.jsx(ce, { children: /* @__PURE__ */ t.jsx(Ue, {}) }) }) })
);
