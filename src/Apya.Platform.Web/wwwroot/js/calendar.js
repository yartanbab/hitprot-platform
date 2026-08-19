import { j as e, d as he, r as f, b as Oe } from "./react-vendor.js";
import { c as b, B as A, d as te, e as ae, S as Q, T as Me } from "./Dialog.js";
import { D as Fe } from "./useDeviceMode.js";
import { a as ze } from "./QueryProvider.js";
import { E as H } from "./EmptyState.js";
import { u as W, a as X, b as L } from "./query-vendor.js";
import { a as I } from "./httpClient.js";
/* empty css      */
const K = {
  1: { key: "task", label: "Görev", plural: "görev", icon: "fa-circle-check" },
  2: { key: "invoice", label: "Fatura", plural: "fatura", icon: "fa-file-invoice" },
  3: { key: "grant", label: "Hibe", plural: "hibe", icon: "fa-award" },
  4: { key: "expense", label: "Gider", plural: "gider", icon: "fa-arrow-trend-down" },
  5: { key: "income", label: "Gelir", plural: "gelir", icon: "fa-arrow-trend-up" },
  6: { key: "cash", label: "Kasa hareketi", plural: "kasa hareketi", icon: "fa-wallet" },
  7: { key: "external", label: "Dış etkinlik", plural: "dış etkinlik", icon: "fa-calendar-days" }
}, V = [1, 2, 3, 4, 5, 6, 7], Pe = [1, 2, 3, 4, 5, 6], O = { DUE_TODAY: 1, OVERDUE: 2 }, _e = (t) => t.risk === O.OVERDUE || t.risk === O.DUE_TODAY, ke = 864e5, ce = (t) => new Date(t.getFullYear(), t.getMonth(), t.getDate()), G = (t, a) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + a);
function D(t) {
  const a = (s) => (s < 10 ? "0" : "") + s;
  return `${t.getFullYear()}-${a(t.getMonth() + 1)}-${a(t.getDate())}`;
}
function Ne(t) {
  const a = (t.getDay() + 6) % 7;
  return new Date(t.getTime() - a * ke);
}
const we = (t) => Ne(new Date(t.getFullYear(), t.getMonth(), 1)), xe = 42;
function Ye(t) {
  const a = we(t);
  return Array.from({ length: xe }, (s, r) => new Date(a.getTime() + r * ke));
}
const Ge = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }), Le = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }), Be = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }), w = {
  monthTitle: (t) => Ge.format(t),
  dayTitle: (t) => Le.format(t),
  dayShort: (t) => Be.format(t),
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
function Se(t) {
  const a = {};
  for (const s of t ?? []) {
    const r = (s.date || "").slice(0, 10);
    r && (a[r] ?? (a[r] = [])).push(s);
  }
  return a;
}
const ne = (t) => (t ?? []).reduce((a, s) => a + (s.loadHours ?? 0), 0);
function qe(t, { maxPills: a = 3, maxRiskPills: s = 2 } = {}) {
  const r = t ?? [];
  if (r.length === 0) return { pills: [], summaries: [] };
  if (r.length <= a) return { pills: r, summaries: [] };
  const o = r.filter(_e).slice(0, s), x = new Set(o.map((c) => c.key)), p = /* @__PURE__ */ new Map();
  for (const c of r) {
    if (x.has(c.key)) continue;
    const n = p.get(c.source) ?? { source: c.source, count: 0, amount: 0, hasAmount: !1, only: null };
    n.count += 1, n.only = n.count === 1 ? c : null, c.amount != null && (n.amount += c.amount, n.hasAmount = !0), p.set(c.source, n);
  }
  const u = [];
  for (const c of V) {
    const n = p.get(c);
    n && (n.count === 1 && n.only ? o.push(n.only) : u.push(n));
  }
  return { pills: o, summaries: u };
}
function Ue(t, { compact: a = !0 } = {}) {
  const s = K[t.source], r = `${t.count} ${s ? s.plural : "öğe"}`;
  if (!t.hasAmount) return r;
  const i = a ? w.moneyCompact(t.amount) : w.money(t.amount);
  return `${r} · ${i}`;
}
function Qe(t, a) {
  const s = D(a), r = (t ?? []).filter((u) => !u.isDone), i = r.filter((u) => u.date.slice(0, 10) < s && u.risk === O.OVERDUE), o = r.filter((u) => u.date.slice(0, 10) >= s), x = Se(o), p = Object.keys(x).sort().map((u) => ({
    key: u,
    date: /* @__PURE__ */ new Date(`${u}T00:00:00`),
    isToday: u === s,
    items: x[u]
  }));
  return { overdue: i, days: p };
}
function Ve(t) {
  const a = Ne(ce(t));
  return Array.from({ length: 7 }, (s, r) => G(a, r));
}
const He = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }), le = (t) => t ? He.format(new Date(t)) : "";
function se(t) {
  const a = new Date(t);
  return a.getHours() * 60 + a.getMinutes();
}
function We(t) {
  let a = 8, s = 18;
  for (const r of t ?? [])
    r.startTime && (a = Math.min(a, Math.floor(se(r.startTime) / 60)), s = Math.max(s, Math.ceil(se(r.endTime ?? r.startTime) / 60)));
  return { start: Math.max(0, a), end: Math.min(24, Math.max(s, a + 4)) };
}
const ge = (t) => !!t.startTime, Xe = {
  [O.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [O.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function de({ item: t, onSelect: a, showDate: s = !1 }) {
  const r = K[t.source], i = Xe[t.risk];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => a(t),
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
            children: r && /* @__PURE__ */ e.jsx("i", { className: b("fa", r.icon) })
          }
        ),
        /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("span", { className: b("block truncate text-[13px] font-semibold text-text-primary", t.isDone && "line-through opacity-65"), children: t.title }),
          /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block truncate text-[11.5px] text-text-tertiary", children: [
            s ? w.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
            t.subtitle,
            t.assigneeName,
            t.amount != null ? w.money(t.amount, t.currency) : null
          ].filter(Boolean).join(" · ") || (r ? r.label : "") })
        ] }),
        i && /* @__PURE__ */ e.jsx("span", { className: b("shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold", i.className), children: i.label })
      ]
    }
  );
}
function Je({ items: t, today: a, onSelectItem: s }) {
  const { overdue: r, days: i } = Qe(t, a);
  return r.length === 0 && i.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
    H,
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
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: r.map((o) => /* @__PURE__ */ e.jsx(de, { item: o, onSelect: s, showDate: !0 }, o.key)) })
    ] }),
    i.map((o) => /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: b(
        "flex items-center justify-between border-b border-subtle px-3 py-2",
        o.isToday && "border-b-accent"
      ), children: [
        /* @__PURE__ */ e.jsxs("span", { className: b(
          "text-[11px] font-bold uppercase tracking-wider",
          o.isToday ? "text-accent" : "text-text-tertiary"
        ), children: [
          w.dayTitle(o.date),
          o.isToday ? " · Bugün" : ""
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: o.items.length })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: o.items.map((x) => /* @__PURE__ */ e.jsx(de, { item: x, onSelect: s }, x.key)) })
    ] }, o.key))
  ] });
}
function Ze({ dayKey: t, items: a, capacity: s, onSelectItem: r, onClose: i }) {
  const o = /* @__PURE__ */ new Date(`${t}T00:00:00`), x = ne(a), p = s && x > s, u = a.reduce((c, n) => (c[n.source] = (c[n.source] ?? 0) + 1, c), {});
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: w.dayTitle(o) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(u).length === 0 ? "Planlanmış öğe yok" : Object.entries(u).map(([c, n]) => {
          var m;
          return `${n} ${((m = K[c]) == null ? void 0 : m.plural) ?? "öğe"}`;
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
    s && x > 0 && /* @__PURE__ */ e.jsxs("div", { className: b(
      "flex items-center justify-between border-b px-3 py-2 text-[11.5px]",
      p ? "border-negative-100 bg-negative-50 text-negative-700" : "border-subtle text-text-secondary"
    ), children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-semibold", children: p ? "Kapasite aşımı" : "Gün yükü" }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono tabular-nums", children: [
        w.hours(x),
        " / ",
        w.hours(s)
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "flex-1 overflow-y-auto p-1", children: a.length === 0 ? /* @__PURE__ */ e.jsx(
      H,
      {
        compact: !0,
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-day" }),
        title: "Bu gün boş",
        description: "Bu güne düşen bir öğe yok."
      }
    ) : a.map((c) => /* @__PURE__ */ e.jsx(de, { item: c, onSelect: r }, c.key)) })
  ] });
}
const et = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], tt = {
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
function at({ item: t, onSelect: a, onDragStart: s, isPending: r, hasError: i }) {
  const o = K[t.source], x = tt[t.risk], p = t.canReschedule && !t.isDone;
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: p,
      onDragStart: p ? (u) => {
        u.stopPropagation(), u.dataTransfer.effectAllowed = "move", u.dataTransfer.setData("text/plain", t.key), s(t);
      } : void 0,
      onClick: (u) => {
        u.stopPropagation(), a(t);
      },
      title: t.subtitle ? `${t.title} — ${t.subtitle}` : t.title,
      style: x ? { backgroundImage: x.pattern } : void 0,
      className: b(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        x ? x.pill : "bg-neutral-subtle text-text-primary",
        t.isDone && "line-through opacity-65",
        p && "cursor-grab active:cursor-grabbing",
        /* Hata SATIRDA kalır — toast'a kaçmaz. */
        i && "ring-1 ring-negative-500",
        r && "opacity-60"
      ),
      children: [
        r ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin shrink-0 text-[9px]", "aria-hidden": "true" }) : o && /* @__PURE__ */ e.jsx("i", { className: b("fa shrink-0 text-[9px] opacity-70", o.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: t.title }),
        i && /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation ms-auto shrink-0 text-[9px]", "aria-hidden": "true" })
      ]
    }
  );
}
function st({ summary: t, onSelect: a }) {
  const s = K[t.source];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: (r) => {
        r.stopPropagation(), a(t.source);
      },
      className: b(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left",
        "text-[10.5px] font-medium text-text-secondary hover:bg-surface-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      ),
      children: [
        s && /* @__PURE__ */ e.jsx("i", { className: b("fa shrink-0 text-[9px] opacity-60", s.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: Ue(t) })
      ]
    }
  );
}
function rt({ load: t, capacity: a }) {
  if (!a || t <= 0) return null;
  const s = Math.min(t / a, 1), r = t > a;
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "mt-auto flex h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle",
      title: `Gün yükü ${w.hours(t)} / kapasite ${w.hours(a)}`,
      "aria-label": `Gün yükü ${w.hours(t)}, kapasite ${w.hours(a)}`,
      children: /* @__PURE__ */ e.jsx(
        "span",
        {
          className: b("h-full", r ? "bg-negative" : "bg-accent"),
          style: { width: `${s * 100}%` }
        }
      )
    }
  );
}
function nt({
  month: t,
  byDay: a,
  today: s,
  capacity: r,
  onSelectItem: i,
  onSelectDay: o,
  selectedDay: x,
  onDropItem: p,
  pending: u = {},
  errors: c = {}
}) {
  const n = Ye(t), m = D(s), [l, h] = he.useState(null), [g, j] = he.useState(null);
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: et.map((T, N) => /* @__PURE__ */ e.jsx(
      "div",
      {
        className: b(
          "px-2.5 py-2 text-right text-[10.5px] font-bold uppercase tracking-wider",
          N > 4 ? "text-text-tertiary opacity-70" : "text-text-tertiary"
        ),
        children: T
      },
      T
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: n.map((T) => {
      const N = D(T), M = a[N] ?? [], { pills: C, summaries: y } = qe(M), d = ne(M), v = T.getMonth() !== t.getMonth(), $ = N === m, B = N === x;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          role: "gridcell",
          tabIndex: -1,
          onClick: () => o(N),
          onDragOver: l ? (S) => {
            S.preventDefault(), S.dataTransfer.dropEffect = "move", g !== N && j(N);
          } : void 0,
          onDragLeave: l ? () => j((S) => S === N ? null : S) : void 0,
          onDrop: l ? (S) => {
            S.preventDefault();
            const F = l;
            h(null), j(null), F && F.date.slice(0, 10) !== N && p(F, /* @__PURE__ */ new Date(`${N}T00:00:00`));
          } : void 0,
          className: b(
            "flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5",
            "transition-colors duration-fast last:border-r-0 hover:bg-surface-hover",
            v ? "bg-surface-sunken" : "bg-surface-base",
            B && "ring-2 ring-inset ring-border-focus",
            g === N && "bg-primary-subtle ring-2 ring-inset ring-accent"
          ),
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
              d > 0 && r && d > r && /* @__PURE__ */ e.jsx("span", { className: "rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: w.hours(d) }),
              /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: b(
                    "ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11.5px] font-semibold leading-none tabular-nums",
                    $ && "bg-accent text-white",
                    !$ && v && "text-text-tertiary opacity-60",
                    !$ && !v && "text-text-secondary"
                  ),
                  children: T.getDate()
                }
              )
            ] }),
            C.map((S) => /* @__PURE__ */ e.jsx(
              at,
              {
                item: S,
                onSelect: i,
                onDragStart: h,
                isPending: !!u[S.key],
                hasError: !!c[S.key]
              },
              S.key
            )),
            y.map((S) => /* @__PURE__ */ e.jsx(
              st,
              {
                summary: S,
                onSelect: () => o(N)
              },
              `${N}-${S.source}`
            )),
            /* @__PURE__ */ e.jsx(rt, { load: d, capacity: r })
          ]
        },
        N
      );
    }) })
  ] });
}
const it = { 1: "Google", 2: "Outlook", 3: "iCloud" };
function lt({
  sources: t,
  counts: a,
  enabled: s,
  onToggle: r,
  compact: i = !1,
  externalAccounts: o = [],
  externalLoading: x = !1,
  onOpenSync: p
}) {
  const u = (t ?? []).filter((c) => c.isAvailable);
  return u.length === 0 ? null : /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Takvim kaynakları",
      className: b(
        "flex flex-col gap-1 rounded-card border border-subtle bg-surface-base p-2",
        i ? "w-[60px] items-center" : "w-full"
      ),
      children: [
        !i && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Kaynaklar" }),
        u.map((c) => {
          const n = K[c.source];
          if (!n) return null;
          const m = s.has(c.source), l = a[c.source] ?? 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": m,
              title: i ? `${n.label} — ${l} öğe` : void 0,
              onClick: () => r(c.source),
              className: b(
                "group flex items-center rounded-md text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                i ? "relative h-11 w-11 justify-center" : "gap-2.5 px-2 py-2",
                m ? "text-text-primary" : "text-text-tertiary",
                "hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: b(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px]",
                      m ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: b("fa", n.icon) })
                  }
                ),
                i ? l > 0 && /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: b(
                      "absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-[9.5px] font-bold leading-4",
                      m ? "bg-accent text-white" : "bg-neutral-200 text-text-tertiary"
                    ),
                    children: l
                  }
                ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                  /* @__PURE__ */ e.jsx("span", { className: b("flex-1 truncate text-[12.5px] font-medium", !m && "line-through decoration-1"), children: n.label }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: l })
                ] })
              ]
            },
            c.source
          );
        }),
        !i && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
          o.length === 0 && !x && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 text-[11.5px] text-text-tertiary", children: "Bağlı takvim yok." }),
          x && o.length === 0 && /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1 text-[11.5px] text-text-tertiary", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
            "senkronize ediliyor…"
          ] }),
          o.map((c) => /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: b(
                "flex items-start gap-2 rounded-md px-2 py-1.5",
                c.error && "bg-negative-50"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: b(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px]",
                      c.error ? "bg-negative-100 text-negative-700" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: b("fa", c.error ? "fa-triangle-exclamation" : "fa-calendar-days") })
                  }
                ),
                /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: it[c.provider] ?? "Takvim" }),
                  /* @__PURE__ */ e.jsx("span", { className: b(
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
const ot = { month: "Ay", week: "Hafta", day: "Gün", agenda: "Ajanda" };
function ct({ title: t, view: a, onView: s, onPrev: r, onNext: i, onToday: o, overloadDays: x }) {
  const p = a !== "agenda";
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    p && /* @__PURE__ */ e.jsxs("div", { className: "flex", children: [
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
    /* @__PURE__ */ e.jsx(A, { variant: "outline", size: "sm", onClick: o, children: "Bugün" }),
    /* @__PURE__ */ e.jsx("h2", { className: "ml-1 text-[17px] font-semibold capitalize tracking-tight text-text-primary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
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
      /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(ot).map(([u, c]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": a === u,
          onClick: () => s(u),
          className: b(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            a === u ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: c
        },
        u
      )) })
    ] })
  ] });
}
const Y = 44, dt = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], ut = {
  [O.OVERDUE]: "bg-negative-50 text-negative-700",
  [O.DUE_TODAY]: "bg-warning-50 text-warning-700"
};
function xt({ load: t, capacity: a }) {
  if (!a || t <= 0) return null;
  const s = t > a;
  return /* @__PURE__ */ e.jsx("div", { className: "mt-1 h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
    "span",
    {
      className: b("block h-full", s ? "bg-negative" : "bg-accent"),
      style: { width: `${Math.min(t / a, 1) * 100}%` }
    }
  ) });
}
function mt({ days: t, byDay: a, today: s, capacity: r, onSelectItem: i, onSelectDay: o, selectedDay: x }) {
  const p = D(s), u = f.useRef(null), [c, n] = f.useState(() => {
    const y = /* @__PURE__ */ new Date();
    return y.getHours() * 60 + y.getMinutes();
  });
  f.useEffect(() => {
    const y = setInterval(() => {
      const d = /* @__PURE__ */ new Date();
      n(d.getHours() * 60 + d.getMinutes());
    }, 6e4);
    return () => clearInterval(y);
  }, []);
  const m = t.map(D), l = {}, h = {};
  for (const y of m) {
    const d = a[y] ?? [];
    l[y] = d.filter(ge), h[y] = d.filter((v) => !ge(v));
  }
  const g = m.flatMap((y) => l[y]), { start: j, end: T } = We(g), N = Array.from({ length: T - j }, (y, d) => j + d), M = (T - j) * Y, C = m.includes(p) && c >= j * 60 && c <= T * 60;
  return f.useEffect(() => {
    if (!C || !u.current) return;
    const y = (c - j * 60) / 60 * Y;
    u.current.scrollTop = Math.max(0, y - 120);
  }, [C, j]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "grid border-b border-default bg-surface-raised",
        style: { gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))` },
        children: [
          /* @__PURE__ */ e.jsx("div", {}),
          t.map((y) => {
            const d = D(y), v = ne(a[d] ?? []), $ = d === p;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => o(d),
                className: b(
                  "border-l border-subtle px-2 py-2 text-left transition-colors duration-fast hover:bg-surface-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
                  x === d && "bg-primary-subtle"
                ),
                children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "flex items-baseline gap-1.5", children: [
                    /* @__PURE__ */ e.jsx("span", { className: b(
                      "text-[10.5px] font-bold uppercase tracking-wider",
                      $ ? "text-accent" : "text-text-tertiary"
                    ), children: dt[(y.getDay() + 6) % 7] }),
                    /* @__PURE__ */ e.jsx("span", { className: b(
                      "font-mono text-[13px] font-semibold tabular-nums",
                      $ ? "text-accent" : "text-text-primary"
                    ), children: y.getDate() }),
                    r && v > r && /* @__PURE__ */ e.jsx("span", { className: "ms-auto rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: w.hours(v) })
                  ] }),
                  /* @__PURE__ */ e.jsx(xt, { load: v, capacity: r })
                ]
              },
              d
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
          m.map((y) => /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-[46px] flex-col gap-[3px] border-l border-subtle p-1", children: [
            h[y].slice(0, 4).map((d) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => i(d),
                title: d.title,
                className: b(
                  "flex w-full items-center gap-1 truncate rounded-[5px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                  ut[d.risk] ?? "bg-neutral-subtle text-text-primary",
                  d.isDone && "line-through opacity-65"
                ),
                children: [
                  K[d.source] && /* @__PURE__ */ e.jsx("i", { className: b("fa shrink-0 text-[9px] opacity-70", K[d.source].icon), "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "truncate", children: d.title })
                ]
              },
              d.key
            )),
            h[y].length > 4 && /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => o(y),
                className: "px-1.5 text-left text-[10.5px] font-medium text-text-tertiary hover:text-text-primary",
                children: [
                  "+",
                  h[y].length - 4,
                  " öğe"
                ]
              }
            )
          ] }, y))
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
            height: `${M}px`
          },
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "relative", children: N.map((y, d) => /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: "absolute right-1.5 -translate-y-1/2 font-mono text-[10px] tabular-nums text-text-tertiary",
                style: { top: `${d * Y}px` },
                children: [
                  String(y).padStart(2, "0"),
                  ":00"
                ]
              },
              y
            )) }),
            m.map((y) => /* @__PURE__ */ e.jsxs("div", { className: "relative border-l border-subtle", children: [
              N.map((d, v) => /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "absolute inset-x-0 border-t border-subtle",
                  style: { top: `${v * Y}px` }
                },
                d
              )),
              l[y].map((d) => {
                const v = se(d.startTime), $ = d.endTime ? se(d.endTime) : v + 60, B = (v - j * 60) / 60 * Y, S = Math.max(($ - v) / 60 * Y, 18);
                return /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => i(d),
                    title: `${d.title} · ${le(d.startTime)}`,
                    style: {
                      top: `${B}px`,
                      height: `${S}px`,
                      backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(0,0,0,.05) 4px, rgba(0,0,0,.05) 6px)"
                    },
                    className: b(
                      "absolute inset-x-0.5 overflow-hidden rounded-[5px] border-l-2 border-accent bg-primary-subtle",
                      "px-1.5 py-0.5 text-left text-[10.5px] leading-tight text-text-primary",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    ),
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: "block truncate font-semibold", children: d.title }),
                      /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[9.5px] text-text-tertiary", children: [
                        le(d.startTime),
                        d.endTime ? `–${le(d.endTime)}` : ""
                      ] })
                    ]
                  },
                  d.key
                );
              }),
              C && y === p && /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "pointer-events-none absolute inset-x-0 z-10 border-t-2 border-negative",
                  style: { top: `${(c - j * 60) / 60 * Y}px` },
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ e.jsx("span", { className: "absolute -left-1 -top-1 h-2 w-2 rounded-full bg-negative" })
                }
              )
            ] }, y))
          ]
        }
      ),
      g.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "border-t border-subtle px-3 py-2 text-[11.5px] text-text-tertiary", children: "Saat ızgarası dış takvim etkinliklerini gösterir. Bağlı bir takvim yoksa boş kalır." })
    ] })
  ] });
}
const pt = {
  [O.OVERDUE]: { text: "Gecikmiş", cls: "bg-negative-50 text-negative-700" },
  [O.DUE_TODAY]: { text: "Bugün son gün", cls: "bg-warning-50 text-warning-700" }
};
function U({ label: t, children: a }) {
  return a ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-subtle py-2.5 last:border-b-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11.5px] font-medium text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "min-w-0 text-right text-[12.5px] text-text-primary", children: a })
  ] }) : null;
}
function bt({ item: t, capacity: a, onClose: s, onReschedule: r, onComplete: i, isPending: o, error: x, onRetry: p }) {
  const [u, c] = f.useState(() => t.date.slice(0, 10)), n = K[t.source], m = pt[t.risk], l = t.date.slice(0, 10);
  f.useEffect(() => c(l), [l]);
  const h = () => {
    !u || u === l || r(t, /* @__PURE__ */ new Date(`${u}T00:00:00`));
  };
  return /* @__PURE__ */ e.jsx(te, { open: !0, onOpenChange: (g) => {
    g || s();
  }, children: /* @__PURE__ */ e.jsxs(ae, { side: "right", title: t.title, className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md bg-neutral-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary", children: [
          n && /* @__PURE__ */ e.jsx("i", { className: b("fa text-[10px]", n.icon), "aria-hidden": "true" }),
          n == null ? void 0 : n.label
        ] }),
        m && /* @__PURE__ */ e.jsx("span", { className: b("rounded-md px-2 py-1 text-[11px] font-bold", m.cls), children: m.text }),
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
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: p, className: "font-semibold underline", children: "Yeniden dene" })
    ] }),
    o && /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle px-4 py-2 text-[12px] text-text-tertiary", "aria-live": "polite", children: [
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
          onClick: () => r(t, G(/* @__PURE__ */ new Date(`${l}T00:00:00`), 1)),
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
            value: u,
            onChange: (g) => c(g.target.value),
            className: "rounded-md border border-default bg-surface-base px-2 py-1 text-[12.5px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": "Son tarih"
          }
        ),
        u !== l && /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "primary", onClick: h, children: "Uygula" })
      ] }) : /* @__PURE__ */ e.jsxs("span", { className: "text-text-secondary", children: [
        w.dayTitle(/* @__PURE__ */ new Date(`${l}T00:00:00`)),
        /* @__PURE__ */ e.jsx("span", { className: "ml-1.5 text-text-tertiary", children: "· takvimden değiştirilemez" })
      ] }) }),
      /* @__PURE__ */ e.jsx(U, { label: "Bağlam", children: t.subtitle }),
      /* @__PURE__ */ e.jsx(U, { label: "Atanan", children: t.assigneeName }),
      /* @__PURE__ */ e.jsx(U, { label: "Tutar", children: t.amount != null ? w.money(t.amount, t.currency) : null }),
      /* @__PURE__ */ e.jsx(U, { label: "Gün yükü", children: t.loadHours != null ? `${w.hours(t.loadHours)}${a ? ` / ${w.hours(a)} kapasite` : ""}` : null })
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
const De = ["calendar", "sync-settings"];
function ft(t) {
  return W({
    queryKey: De,
    queryFn: () => I.get("/api/app/calendar/sync-settings"),
    enabled: t,
    staleTime: 3e4
  });
}
function ht() {
  const t = X();
  return L({
    mutationFn: (a) => I.post("/api/app/calendar/sync-rules", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: De }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
const Te = ["calendar", "ical-feed"], me = ["calendar", "ical-subscriptions"];
function gt(t) {
  return W({
    queryKey: Te,
    /* GetOrCreate: bağlantı yoksa ilk açılışta üretilir. */
    queryFn: () => I.post("/api/app/ical-feed/ensure", {}),
    enabled: t,
    staleTime: 1 / 0
  });
}
function yt() {
  const t = X();
  return L({
    mutationFn: () => I.post("/api/app/ical-feed/regenerate", {}),
    onSuccess: (a) => t.setQueryData(Te, a)
  });
}
function vt(t) {
  return W({
    queryKey: me,
    queryFn: () => I.get("/api/app/ical-subscription"),
    enabled: t,
    staleTime: 3e4
  });
}
function jt() {
  const t = X();
  return L({
    mutationFn: (a) => I.post("/api/app/ical-subscription", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: me }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function kt() {
  const t = X();
  return L({
    mutationFn: (a) => I.delete(`/api/app/ical-subscription/${a}`),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: me }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function Nt() {
  return L({
    mutationFn: (t) => I.post(`/api/app/ical-subscription/probe?url=${encodeURIComponent(t)}`, {})
  });
}
const wt = {
  1: { label: "Google Calendar", icon: "fa-google", brand: "bg-[#ea4335]" },
  2: { label: "Microsoft Outlook", icon: "fa-windows", brand: "bg-[#0078d4]" },
  3: { label: "iCloud", icon: "fa-apple", brand: "bg-neutral-700" }
}, St = {
  0: { title: "Son değişen kazanır", desc: "İki taraf da düzenlenirse en son yapılan değişiklik uygulanır; ekranda geri alma şeridi çıkar." },
  1: { title: "APYA her zaman kazanır", desc: "Dış takvim salt-okunur ayna olur; dışarıdaki düzenleme geri alınır." }
}, ye = {
  0: { icon: "fa-arrow-up-from-bracket", cls: "text-text-tertiary" },
  1: { icon: "fa-code-merge", cls: "text-warning-700" },
  2: { icon: "fa-triangle-exclamation", cls: "text-negative-700" }
};
function pe(t) {
  if (!t) return "hiç";
  const a = Math.round((Date.now() - new Date(t).getTime()) / 6e4);
  return a < 1 ? "az önce" : a < 60 ? `${a} dk önce` : a < 1440 ? `${Math.round(a / 60)} sa önce` : w.dayShort(new Date(t));
}
function Dt({ account: t, onSave: a, saving: s }) {
  const r = wt[t.provider] ?? { label: "Takvim", icon: "fa-calendar", brand: "bg-neutral-700" }, [i, o] = f.useState(() => new Set(t.syncSources ?? [])), [x, p] = f.useState(t.conflictRule ?? 0), [u, c] = f.useState(t.isSyncEnabled);
  f.useEffect(() => {
    o(new Set(t.syncSources ?? [])), p(t.conflictRule ?? 0), c(t.isSyncEnabled);
  }, [t]);
  const n = u !== t.isSyncEnabled || x !== t.conflictRule || i.size !== (t.syncSources ?? []).length || [...i].some((l) => !(t.syncSources ?? []).includes(l)), m = (l) => o((h) => {
    const g = new Set(h);
    return g.has(l) ? g.delete(l) : g.add(l), g;
  });
  return /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-3 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: b("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", r.brand), "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("i", { className: b("fab", r.icon) }) }),
      /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-semibold text-text-primary", children: r.label }),
        /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[11.5px] text-text-tertiary", children: [
          t.externalEmail,
          " · son senkron ",
          pe(t.lastSyncTime)
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("label", { className: "flex shrink-0 items-center gap-1.5 text-[11.5px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: u,
            onChange: (l) => c(l.target.checked),
            className: "h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
          }
        ),
        "Açık"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Bu hesaba ne gitsin?" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Pe.map((l) => {
        var g, j;
        const h = i.has(l);
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": h,
            onClick: () => m(l),
            className: b(
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              h ? "border-accent bg-primary-subtle text-accent" : "border-subtle bg-surface-base text-text-tertiary hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: b("fa text-[10px]", (g = K[l]) == null ? void 0 : g.icon), "aria-hidden": "true" }),
              (j = K[l]) == null ? void 0 : j.label
            ]
          },
          l
        );
      }) }),
      i.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-text-tertiary", children: "Hiçbiri seçili değil — yalnız görevler gönderilir." }),
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Çakışma kuralı" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: Object.entries(St).map(([l, h]) => {
        const g = Number(l), j = x === g;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => p(g),
            className: b(
              "rounded-md border px-2.5 py-2 text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              j ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("span", { className: b("block text-[12px] font-semibold", j ? "text-accent" : "text-text-primary"), children: h.title }),
              /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] leading-snug text-text-tertiary", children: h.desc })
            ]
          },
          l
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
              isSyncEnabled: u,
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
const Tt = [
  { value: 15, label: "15 dk" },
  { value: 60, label: "1 saat" },
  { value: 360, label: "6 saat" },
  { value: 1440, label: "Günlük" }
];
function Ct({ open: t }) {
  var N, M, C, y;
  const a = gt(t), s = yt(), r = vt(t), i = jt(), o = kt(), x = Nt(), [p, u] = f.useState(""), [c, n] = f.useState(""), [m, l] = f.useState(60), [h, g] = f.useState(!1), j = (N = a.data) != null && N.path ? `${window.location.origin}${a.data.path}` : "", T = async () => {
    try {
      await navigator.clipboard.writeText(j), g(!0), setTimeout(() => g(!1), 2e3);
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
            value: j,
            "aria-label": "iCal abonelik bağlantısı",
            className: "min-w-0 flex-1 truncate rounded-md border border-default bg-surface-sunken px-2 py-1 font-mono text-[11px] text-text-secondary"
          }
        ),
        /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "outline", onClick: T, disabled: !j, children: h ? "Kopyalandı" : "Kopyala" })
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
            value: p,
            onChange: (d) => {
              u(d.target.value), x.reset();
            },
            placeholder: "https://…/basic.ics",
            "aria-label": "Takvim bağlantısı",
            className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          }
        ),
        ((M = x.data) == null ? void 0 : M.isValid) && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-positive-700", children: [
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
              value: c,
              onChange: (d) => n(d.target.value),
              placeholder: ((C = x.data) == null ? void 0 : C.suggestedName) || "Görünen ad",
              "aria-label": "Görünen ad",
              className: "min-w-0 flex-1 rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              value: m,
              onChange: (d) => l(Number(d.target.value)),
              "aria-label": "Yenileme sıklığı",
              className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
              children: Tt.map((d) => /* @__PURE__ */ e.jsx("option", { value: d.value, children: d.label }, d.value))
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(
            A,
            {
              size: "sm",
              variant: "outline",
              disabled: !p || x.isPending,
              onClick: () => x.mutate(p),
              children: x.isPending ? "Deneniyor…" : "Bağlantıyı dene"
            }
          ),
          /* @__PURE__ */ e.jsx(
            A,
            {
              size: "sm",
              variant: "primary",
              disabled: !p || i.isPending,
              onClick: () => i.mutate(
                { url: p, displayName: c, color: "accent", refreshMinutes: m },
                { onSuccess: () => {
                  u(""), n(""), x.reset();
                } }
              ),
              children: i.isPending ? "Ekleniyor…" : "Takvimi ekle"
            }
          )
        ] }),
        i.isError && /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-negative-700", children: ((y = i.error) == null ? void 0 : y.message) || "Takvim eklenemedi." }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] leading-snug text-text-tertiary", children: [
          "iCal abonelikleri ",
          /* @__PURE__ */ e.jsx("strong", { className: "font-semibold", children: "tek yönlüdür" }),
          ": etkinlikler APYA'da salt-okunur görünür, APYA öğeleri bu takvime yazılmaz. Çift yönlü senkron için Google veya Outlook hesabı bağlayın."
        ] })
      ] }),
      (r.data ?? []).length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 border-t border-subtle pt-2", children: r.data.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: d.displayName }),
          /* @__PURE__ */ e.jsx("span", { className: b(
            "block truncate text-[10.5px]",
            d.lastError ? "text-negative-700" : "text-text-tertiary"
          ), children: d.lastError ?? `${d.lastEventCount} etkinlik · ${pe(d.lastFetchedAt)} çekildi` })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => o.mutate(d.id),
            className: "shrink-0 rounded p-1 text-[11px] text-text-tertiary hover:text-negative-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": `${d.displayName} aboneliğini kaldır`,
            children: "Kaldır"
          }
        )
      ] }, d.id)) })
    ] })
  ] });
}
function Et({ open: t, onClose: a }) {
  const { data: s, isPending: r } = ft(t), i = ht();
  return /* @__PURE__ */ e.jsx(te, { open: t, onOpenChange: (o) => {
    o || a();
  }, children: /* @__PURE__ */ e.jsxs(ae, { side: "right", title: "Takvim senkronizasyonu", className: "w-full max-w-[440px] p-0", children: [
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
      /* @__PURE__ */ e.jsx(Q, { height: 92 }),
      /* @__PURE__ */ e.jsx(Q, { height: 92 })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", children: [
      ((s == null ? void 0 : s.accounts) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-4", children: /* @__PURE__ */ e.jsx(
        H,
        {
          compact: !0,
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
          title: "Bağlı hesap yok",
          description: "Google veya Outlook bağlayınca size atanan tarihli öğeler oraya etkinlik olarak yazılır.",
          action: /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "outline", onClick: () => {
            window.location.href = "/Calendars/SimulateAuth?provider=1";
          }, children: "Hesap bağla" })
        }
      ) }) : s.accounts.map((o) => /* @__PURE__ */ e.jsx(
        Dt,
        {
          account: o,
          saving: i.isPending,
          onSave: (x) => i.mutate(x)
        },
        o.id
      )),
      /* @__PURE__ */ e.jsx(Ct, { open: t }),
      /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
        /* @__PURE__ */ e.jsx("header", { className: "border-b border-subtle px-3 py-2", children: /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-semibold text-text-primary", children: "Senkron günlüğü" }) }),
        /* @__PURE__ */ e.jsx("div", { className: "px-3 py-2", children: ((s == null ? void 0 : s.log) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-2 text-[11.5px] text-text-tertiary", children: "Henüz senkron kaydı yok." }) : s.log.map((o) => {
          const x = ye[o.kind] ?? ye[0];
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
            /* @__PURE__ */ e.jsx("i", { className: b("fa mt-0.5 shrink-0 text-[11px]", x.icon, x.cls), "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[11.5px] leading-snug text-text-secondary", children: o.message }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: pe(o.occurredAt) })
          ] }, o.id);
        }) })
      ] })
    ] }) })
  ] }) });
}
const Rt = 6e4;
function $t({ from: t, to: a }) {
  const s = D(t), r = D(a);
  return W({
    queryKey: ["calendar", "feed", s, r],
    queryFn: () => I.get(`/api/app/calendar/feed?From=${s}&To=${r}`),
    staleTime: Rt,
    placeholderData: (i) => i
    /* ay geçişinde boş ekran yerine eski veri */
  });
}
const Ce = "apya.calendar.view", ue = "apya.calendar.sources", re = ["month", "week", "day", "agenda"];
function Ee(t) {
  try {
    return window.localStorage.getItem(t);
  } catch {
    return null;
  }
}
function oe(t, a) {
  try {
    window.localStorage.setItem(t, a);
  } catch {
  }
}
function It() {
  const t = new URLSearchParams(window.location.search).get("view");
  if (re.includes(t)) return t;
  const a = Ee(Ce);
  return re.includes(a) ? a : null;
}
function At() {
  const t = Ee(ue);
  if (!t) return new Set(V);
  const a = t.split(",").map(Number).filter((s) => V.includes(s));
  return a.length ? new Set(a) : new Set(V);
}
function Kt({ defaultView: t = "month" } = {}) {
  const [a] = f.useState(It), [s, r] = f.useState(() => a ?? t), [i, o] = f.useState(At);
  f.useEffect(() => {
    const n = new URL(window.location.href);
    n.searchParams.get("view") !== s && (n.searchParams.set("view", s), window.history.replaceState({}, "", n));
  }, [s]);
  const x = f.useCallback((n) => {
    re.includes(n) && (r(n), oe(Ce, n));
  }, []), p = f.useCallback((n) => {
    o((m) => {
      const l = new Set(m);
      return l.has(n) ? l.delete(n) : l.add(n), oe(ue, [...l].join(",")), l;
    });
  }, []), u = f.useCallback((n) => {
    a || re.includes(n) && r((m) => m === n ? m : n);
  }, [a]), c = f.useCallback(() => {
    const n = new Set(V);
    o(n), oe(ue, [...n].join(","));
  }, []);
  return { view: s, setView: x, applyResponsiveDefault: u, enabledSources: i, toggleSource: p, resetSources: c };
}
const z = ["calendar", "feed"];
function Ot(t, a, s) {
  t.setQueriesData({ queryKey: z }, (r) => r != null && r.items ? {
    ...r,
    items: r.items.map((i) => i.key === a ? { ...i, date: `${s}T00:00:00` } : i)
  } : r);
}
function Mt(t, a) {
  t.setQueriesData({ queryKey: z }, (s) => s != null && s.items ? {
    ...s,
    items: s.items.map((r) => r.key === a ? { ...r, isDone: !0, risk: 0, loadHours: null } : r)
  } : s);
}
function Ft() {
  const t = X(), [a, s] = f.useState(null), [r, i] = f.useState({}), [o, x] = f.useState({}), p = f.useCallback((n) => {
    i((m) => {
      if (!m[n]) return m;
      const l = { ...m };
      return delete l[n], l;
    });
  }, []), u = L({
    mutationFn: ({ item: n, newDate: m }) => I.post("/api/app/calendar/reschedule-item", {
      source: n.source,
      sourceId: n.sourceId,
      newDate: D(m)
    }),
    onMutate: async ({ item: n, newDate: m }) => {
      await t.cancelQueries({ queryKey: z });
      const l = t.getQueriesData({ queryKey: z });
      return p(n.key), x((h) => ({ ...h, [n.key]: !0 })), Ot(t, n.key, D(m)), { snapshot: l, previousDate: n.date.slice(0, 10) };
    },
    onError: (n, { item: m }, l) => {
      var h;
      (h = l == null ? void 0 : l.snapshot) == null || h.forEach(([g, j]) => t.setQueryData(g, j)), i((g) => ({
        ...g,
        [m.key]: (n == null ? void 0 : n.message) || "Kaydedilemedi — tarih değişmedi."
      }));
    },
    onSuccess: (n, { item: m, newDate: l }, h) => {
      s({
        key: m.key,
        message: `“${m.title}” ${D(l)} tarihine taşındı.`,
        undo: () => u.mutate({
          item: { ...m, date: `${D(l)}T00:00:00` },
          newDate: /* @__PURE__ */ new Date(`${h.previousDate}T00:00:00`)
        })
      });
    },
    onSettled: (n, m, { item: l }) => {
      x((h) => {
        const g = { ...h };
        return delete g[l.key], g;
      }), t.invalidateQueries({ queryKey: z });
    }
  }), c = L({
    mutationFn: ({ item: n }) => I.post("/api/app/calendar/complete-item", {
      source: n.source,
      sourceId: n.sourceId
    }),
    onMutate: async ({ item: n }) => {
      await t.cancelQueries({ queryKey: z });
      const m = t.getQueriesData({ queryKey: z });
      return p(n.key), x((l) => ({ ...l, [n.key]: !0 })), Mt(t, n.key), { snapshot: m };
    },
    onError: (n, { item: m }, l) => {
      var h;
      (h = l == null ? void 0 : l.snapshot) == null || h.forEach(([g, j]) => t.setQueryData(g, j)), i((g) => ({
        ...g,
        [m.key]: (n == null ? void 0 : n.message) || "Tamamlanamadı."
      }));
    },
    onSuccess: (n, { item: m }) => {
      s({ key: m.key, message: `“${m.title}” tamamlandı.`, undo: null });
    },
    onSettled: (n, m, { item: l }) => {
      x((h) => {
        const g = { ...h };
        return delete g[l.key], g;
      }), t.invalidateQueries({ queryKey: z });
    }
  });
  return {
    reschedule: (n, m) => u.mutate({ item: n, newDate: m }),
    complete: (n) => c.mutate({ item: n }),
    retry: (n, m) => m ? u.mutate({ item: n, newDate: m }) : c.mutate({ item: n }),
    lastAction: a,
    dismissAction: () => s(null),
    errors: r,
    clearError: p,
    pending: o
  };
}
function zt({ from: t, to: a, enabled: s = !0 }) {
  const r = D(t), i = D(a);
  return W({
    queryKey: ["calendar", "external", r, i],
    queryFn: () => I.get(`/api/app/calendar/external-events?From=${r}&To=${i}`),
    enabled: s,
    staleTime: 12e4,
    retry: !1,
    placeholderData: (o) => o
  });
}
function Pt() {
  const t = f.useRef(null), [a, s] = f.useState(0);
  return f.useLayoutEffect(() => {
    const r = t.current;
    if (!r || (s(r.getBoundingClientRect().width), typeof ResizeObserver > "u")) return;
    const i = new ResizeObserver((o) => {
      for (const x of o)
        s(x.contentRect.width);
    });
    return i.observe(r), () => i.disconnect();
  }, []), [t, a];
}
function _t(t) {
  return t === 0 || t >= 1180 ? "wide" : t >= 780 ? "medium" : "narrow";
}
const Yt = 60;
function ve(t, a, s) {
  return a === "week" ? G(t, 7 * s) : a === "day" ? G(t, s) : new Date(t.getFullYear(), t.getMonth() + s, 1);
}
function Gt() {
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Array.from({ length: 7 }, (t, a) => /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-2", children: /* @__PURE__ */ e.jsx(Q, { height: 10 }) }, a)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: Array.from({ length: xe }, (t, a) => /* @__PURE__ */ e.jsxs("div", { className: "min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0", children: [
      /* @__PURE__ */ e.jsx(Q, { height: 12, width: "40%", className: "ml-auto" }),
      a % 3 === 0 && /* @__PURE__ */ e.jsx(Q, { height: 14, className: "mt-2" })
    ] }, a)) })
  ] });
}
function Lt() {
  var fe;
  const [t, a] = Pt(), s = _t(a), r = s === "narrow", i = f.useMemo(() => ce(/* @__PURE__ */ new Date()), []), [o, x] = f.useState(() => new Date(i.getFullYear(), i.getMonth(), 1)), [p, u] = f.useState(null), [c, n] = f.useState(null), [m, l] = f.useState(!1), { view: h, setView: g, applyResponsiveDefault: j, enabledSources: T, toggleSource: N, resetSources: M } = Kt();
  f.useEffect(() => {
    a !== 0 && j(r ? "agenda" : "month");
  }, [a, r, j]);
  const { range: C, title: y, weekDayList: d } = f.useMemo(() => {
    if (h === "agenda")
      return {
        range: { from: G(i, -60), to: G(i, Yt) },
        title: "Ajanda",
        weekDayList: null
      };
    if (h === "week") {
      const R = Ve(o);
      return {
        range: { from: R[0], to: R[6] },
        title: `${w.dayShort(R[0])} – ${w.dayShort(R[6])} ${R[6].getFullYear()}`,
        weekDayList: R
      };
    }
    if (h === "day") {
      const R = ce(o);
      return { range: { from: R, to: R }, title: w.dayTitle(R), weekDayList: [R] };
    }
    const k = we(o);
    return {
      range: { from: k, to: G(k, xe - 1) },
      title: w.monthTitle(o),
      weekDayList: null
    };
  }, [h, o, i]), { data: v, isPending: $, isError: B, refetch: S } = $t(C), F = zt(C), J = f.useMemo(
    () => {
      var k;
      return [...(v == null ? void 0 : v.items) ?? [], ...((k = F.data) == null ? void 0 : k.items) ?? []];
    },
    [v, F.data]
  ), Z = f.useMemo(
    () => J.filter((k) => T.has(k.source)),
    [J, T]
  ), P = f.useMemo(() => Se(Z), [Z]), _ = (v == null ? void 0 : v.dailyCapacityHours) ?? null, Re = f.useMemo(() => {
    const k = {};
    for (const R of (v == null ? void 0 : v.sources) ?? []) k[R.source] = R.count;
    return k;
  }, [v]), $e = f.useMemo(() => _ ? Object.values(P).filter((k) => ne(k) > _).length : 0, [P, _]);
  f.useEffect(() => {
    p && !P[p] && !$ && (p >= D(C.from) && p <= D(C.to) || u(null));
  }, [p, P, $, C]);
  const ee = f.useCallback((k) => n(k.key), []), Ie = f.useCallback(() => {
    x(i), u(D(i));
  }, [i]), E = Ft(), be = J.length > 0, Ae = be && Z.length === 0, Ke = p ? P[p] ?? [] : [], q = c ? J.find((k) => k.key === c) ?? null : null, ie = p && /* @__PURE__ */ e.jsx(
    Ze,
    {
      dayKey: p,
      items: Ke,
      capacity: _,
      onSelectItem: ee,
      onClose: () => u(null)
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { ref: t, className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsx(
      ct,
      {
        title: y,
        view: h,
        onView: g,
        onPrev: () => x((k) => ve(k, h, -1)),
        onNext: () => x((k) => ve(k, h, 1)),
        onToday: Ie,
        overloadDays: $e
      }
    ),
    B && /* @__PURE__ */ e.jsxs("div", { className: "rounded-card border border-negative-100 bg-negative-50 px-3 py-2.5 text-[12.5px] text-negative-700", children: [
      "Takvim yüklenemedi.",
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => S(), className: "ml-2 font-semibold underline", children: "Yeniden dene" })
    ] }),
    E.lastAction && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "flex items-center gap-2 rounded-card border border-subtle bg-surface-raised px-3 py-2 text-[12.5px] text-text-secondary",
        role: "status",
        "aria-live": "polite",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left text-text-tertiary", "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 truncate", children: E.lastAction.message }),
          E.lastAction.undo && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                E.lastAction.undo(), E.dismissAction();
              },
              className: "font-semibold text-text-link hover:underline",
              children: "Geri al"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: E.dismissAction,
              "aria-label": "Şeridi kapat",
              className: "rounded p-1 text-text-tertiary hover:bg-surface-hover",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: b("flex gap-3", r ? "flex-col" : "flex-row items-start"), children: [
      !r && /* @__PURE__ */ e.jsx("div", { className: b("shrink-0", s === "wide" ? "w-[240px]" : "w-auto"), children: /* @__PURE__ */ e.jsx(
        lt,
        {
          sources: (v == null ? void 0 : v.sources) ?? [],
          counts: Re,
          enabled: T,
          onToggle: N,
          compact: s !== "wide",
          externalAccounts: ((fe = F.data) == null ? void 0 : fe.accounts) ?? [],
          externalLoading: F.isFetching,
          onOpenSync: () => l(!0)
        }
      ) }),
      /* @__PURE__ */ e.jsx("div", { className: "min-w-0 flex-1", children: $ ? /* @__PURE__ */ e.jsx(Gt, {}) : Ae ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
        H,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-filter-circle-xmark" }),
          title: "Bu filtreyle gösterilecek öğe yok",
          description: "Kaynak rayında kapattığınız türler bu aralıktaki tüm öğeleri gizliyor.",
          action: /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "outline", onClick: M, children: "Kaynakları aç" })
        }
      ) }) : be ? h === "month" ? /* @__PURE__ */ e.jsx(
        nt,
        {
          month: o,
          byDay: P,
          today: i,
          capacity: _,
          selectedDay: p,
          onSelectItem: ee,
          onSelectDay: u,
          onDropItem: E.reschedule,
          pending: E.pending,
          errors: E.errors
        }
      ) : d ? /* @__PURE__ */ e.jsx(
        mt,
        {
          days: d,
          byDay: P,
          today: i,
          capacity: _,
          selectedDay: p,
          onSelectItem: ee,
          onSelectDay: u
        }
      ) : /* @__PURE__ */ e.jsx(Je, { items: Z, today: i, onSelectItem: ee }) : /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
        H,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
          title: "Bu aralıkta planlanmış bir şey yok",
          description: "Son tarihi olan görevler, fatura vadeleri, hibe son tarihleri ve tarihli finans kayıtları burada birlikte görünür.",
          action: /* @__PURE__ */ e.jsx(A, { size: "sm", variant: "outline", onClick: () => {
            window.location.href = "/Tasks";
          }, children: "Görev oluştur" })
        }
      ) }) }),
      s === "wide" && p && /* @__PURE__ */ e.jsx("div", { className: "w-[340px] shrink-0 self-stretch", children: ie })
    ] }),
    s === "medium" && p && /* @__PURE__ */ e.jsx(te, { open: !0, onOpenChange: (k) => {
      k || u(null);
    }, children: /* @__PURE__ */ e.jsx(ae, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: ie }) }),
    r && p && /* @__PURE__ */ e.jsx(te, { open: !0, onOpenChange: (k) => {
      k || u(null);
    }, children: /* @__PURE__ */ e.jsx(ae, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: ie }) }),
    /* @__PURE__ */ e.jsx(Et, { open: m, onClose: () => l(!1) }),
    q && /* @__PURE__ */ e.jsx(
      bt,
      {
        item: q,
        capacity: _,
        onClose: () => n(null),
        onReschedule: E.reschedule,
        onComplete: E.complete,
        isPending: !!E.pending[q.key],
        error: E.errors[q.key],
        onRetry: () => E.clearError(q.key)
      }
    )
  ] });
}
const je = document.getElementById("apya-calendar-root");
je && Oe(je).render(
  /* @__PURE__ */ e.jsx(Me, { children: /* @__PURE__ */ e.jsx(Fe, { children: /* @__PURE__ */ e.jsx(ze, { children: /* @__PURE__ */ e.jsx(Lt, {}) }) }) })
);
