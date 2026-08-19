import { j as e, d as pe, r as h, b as Ae } from "./react-vendor.js";
import { c as f, B as K, d as J, e as Z, S as q, T as Oe } from "./Dialog.js";
import { D as Me } from "./useDeviceMode.js";
import { a as Ke } from "./QueryProvider.js";
import { E as V } from "./EmptyState.js";
import { u as de, a as ye, b as ie } from "./query-vendor.js";
import { a as L } from "./httpClient.js";
/* empty css      */
const I = {
  1: { key: "task", label: "Görev", plural: "görev", icon: "fa-circle-check" },
  2: { key: "invoice", label: "Fatura", plural: "fatura", icon: "fa-file-invoice" },
  3: { key: "grant", label: "Hibe", plural: "hibe", icon: "fa-award" },
  4: { key: "expense", label: "Gider", plural: "gider", icon: "fa-arrow-trend-down" },
  5: { key: "income", label: "Gelir", plural: "gelir", icon: "fa-arrow-trend-up" },
  6: { key: "cash", label: "Kasa hareketi", plural: "kasa hareketi", icon: "fa-wallet" },
  7: { key: "external", label: "Dış etkinlik", plural: "dış etkinlik", icon: "fa-calendar-days" }
}, H = [1, 2, 3, 4, 5, 6, 7], ze = [1, 2, 3, 4, 5, 6], A = { DUE_TODAY: 1, OVERDUE: 2 }, Fe = (t) => t.risk === A.OVERDUE || t.risk === A.DUE_TODAY, ve = 864e5, le = (t) => new Date(t.getFullYear(), t.getMonth(), t.getDate()), P = (t, s) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + s);
function S(t) {
  const s = (r) => (r < 10 ? "0" : "") + r;
  return `${t.getFullYear()}-${s(t.getMonth() + 1)}-${s(t.getDate())}`;
}
function je(t) {
  const s = (t.getDay() + 6) % 7;
  return new Date(t.getTime() - s * ve);
}
const ke = (t) => je(new Date(t.getFullYear(), t.getMonth(), 1)), ue = 42;
function _e(t) {
  const s = ke(t);
  return Array.from({ length: ue }, (r, a) => new Date(s.getTime() + a * ve));
}
const Pe = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }), Ye = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }), Le = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }), N = {
  monthTitle: (t) => Pe.format(t),
  dayTitle: (t) => Ye.format(t),
  dayShort: (t) => Le.format(t),
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
function Ne(t) {
  const s = {};
  for (const r of t ?? []) {
    const a = (r.date || "").slice(0, 10);
    a && (s[a] ?? (s[a] = [])).push(r);
  }
  return s;
}
const se = (t) => (t ?? []).reduce((s, r) => s + (r.loadHours ?? 0), 0);
function Ge(t, { maxPills: s = 3, maxRiskPills: r = 2 } = {}) {
  const a = t ?? [];
  if (a.length === 0) return { pills: [], summaries: [] };
  if (a.length <= s) return { pills: a, summaries: [] };
  const o = a.filter(Fe).slice(0, r), x = new Set(o.map((c) => c.key)), m = /* @__PURE__ */ new Map();
  for (const c of a) {
    if (x.has(c.key)) continue;
    const n = m.get(c.source) ?? { source: c.source, count: 0, amount: 0, hasAmount: !1, only: null };
    n.count += 1, n.only = n.count === 1 ? c : null, c.amount != null && (n.amount += c.amount, n.hasAmount = !0), m.set(c.source, n);
  }
  const d = [];
  for (const c of H) {
    const n = m.get(c);
    n && (n.count === 1 && n.only ? o.push(n.only) : d.push(n));
  }
  return { pills: o, summaries: d };
}
function Be(t, { compact: s = !0 } = {}) {
  const r = I[t.source], a = `${t.count} ${r ? r.plural : "öğe"}`;
  if (!t.hasAmount) return a;
  const i = s ? N.moneyCompact(t.amount) : N.money(t.amount);
  return `${a} · ${i}`;
}
function Ue(t, s) {
  const r = S(s), a = (t ?? []).filter((d) => !d.isDone), i = a.filter((d) => d.date.slice(0, 10) < r && d.risk === A.OVERDUE), o = a.filter((d) => d.date.slice(0, 10) >= r), x = Ne(o), m = Object.keys(x).sort().map((d) => ({
    key: d,
    date: /* @__PURE__ */ new Date(`${d}T00:00:00`),
    isToday: d === r,
    items: x[d]
  }));
  return { overdue: i, days: m };
}
function qe(t) {
  const s = je(le(t));
  return Array.from({ length: 7 }, (r, a) => P(s, a));
}
const He = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }), ae = (t) => t ? He.format(new Date(t)) : "";
function ee(t) {
  const s = new Date(t);
  return s.getHours() * 60 + s.getMinutes();
}
function Ve(t) {
  let s = 8, r = 18;
  for (const a of t ?? [])
    a.startTime && (s = Math.min(s, Math.floor(ee(a.startTime) / 60)), r = Math.max(r, Math.ceil(ee(a.endTime ?? a.startTime) / 60)));
  return { start: Math.max(0, s), end: Math.min(24, Math.max(r, s + 4)) };
}
const fe = (t) => !!t.startTime, Qe = {
  [A.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [A.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function oe({ item: t, onSelect: s, showDate: r = !1 }) {
  const a = I[t.source], i = Qe[t.risk];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: () => s(t),
      className: f(
        "flex w-full items-start gap-2.5 rounded-md px-2 py-2 text-left transition-colors duration-fast",
        "hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      ),
      children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-neutral-subtle text-[10px] text-text-tertiary",
            "aria-hidden": "true",
            children: a && /* @__PURE__ */ e.jsx("i", { className: f("fa", a.icon) })
          }
        ),
        /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("span", { className: f("block truncate text-[13px] font-semibold text-text-primary", t.isDone && "line-through opacity-65"), children: t.title }),
          /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block truncate text-[11.5px] text-text-tertiary", children: [
            r ? N.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
            t.subtitle,
            t.assigneeName,
            t.amount != null ? N.money(t.amount, t.currency) : null
          ].filter(Boolean).join(" · ") || (a ? a.label : "") })
        ] }),
        i && /* @__PURE__ */ e.jsx("span", { className: f("shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold", i.className), children: i.label })
      ]
    }
  );
}
function We({ items: t, today: s, onSelectItem: r }) {
  const { overdue: a, days: i } = Ue(t, s);
  return a.length === 0 && i.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
    V,
    {
      icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-mug-hot" }),
      title: "Planlanmış bir şey yok",
      description: "Son tarihli görevler, fatura vadeleri ve tarihli finans kayıtları burada öncelik sırasıyla listelenir."
    }
  ) }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    a.length > 0 && /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-negative-100 bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-2 border-b border-negative-100 px-3 py-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-negative-700", children: "Gecikmiş" }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] font-semibold tabular-nums text-negative-700", children: a.length })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: a.map((o) => /* @__PURE__ */ e.jsx(oe, { item: o, onSelect: r, showDate: !0 }, o.key)) })
    ] }),
    i.map((o) => /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: f(
        "flex items-center justify-between border-b border-subtle px-3 py-2",
        o.isToday && "border-b-accent"
      ), children: [
        /* @__PURE__ */ e.jsxs("span", { className: f(
          "text-[11px] font-bold uppercase tracking-wider",
          o.isToday ? "text-accent" : "text-text-tertiary"
        ), children: [
          N.dayTitle(o.date),
          o.isToday ? " · Bugün" : ""
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: o.items.length })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: o.items.map((x) => /* @__PURE__ */ e.jsx(oe, { item: x, onSelect: r }, x.key)) })
    ] }, o.key))
  ] });
}
function Xe({ dayKey: t, items: s, capacity: r, onSelectItem: a, onClose: i }) {
  const o = /* @__PURE__ */ new Date(`${t}T00:00:00`), x = se(s), m = r && x > r, d = s.reduce((c, n) => (c[n.source] = (c[n.source] ?? 0) + 1, c), {});
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: N.dayTitle(o) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(d).length === 0 ? "Planlanmış öğe yok" : Object.entries(d).map(([c, n]) => {
          var u;
          return `${n} ${((u = I[c]) == null ? void 0 : u.plural) ?? "öğe"}`;
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
    r && x > 0 && /* @__PURE__ */ e.jsxs("div", { className: f(
      "flex items-center justify-between border-b px-3 py-2 text-[11.5px]",
      m ? "border-negative-100 bg-negative-50 text-negative-700" : "border-subtle text-text-secondary"
    ), children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-semibold", children: m ? "Kapasite aşımı" : "Gün yükü" }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono tabular-nums", children: [
        N.hours(x),
        " / ",
        N.hours(r)
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "flex-1 overflow-y-auto p-1", children: s.length === 0 ? /* @__PURE__ */ e.jsx(
      V,
      {
        compact: !0,
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-day" }),
        title: "Bu gün boş",
        description: "Bu güne düşen bir öğe yok."
      }
    ) : s.map((c) => /* @__PURE__ */ e.jsx(oe, { item: c, onSelect: a }, c.key)) })
  ] });
}
const Je = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], Ze = {
  [A.OVERDUE]: {
    pill: "bg-negative-50 text-negative-700",
    /* çapraz tarama */
    pattern: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,.07) 3px, rgba(0,0,0,.07) 5px)"
  },
  [A.DUE_TODAY]: {
    pill: "bg-warning-50 text-warning-700",
    /* dikey çizgi */
    pattern: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,.06) 4px, rgba(0,0,0,.06) 5px)"
  }
};
function et({ item: t, onSelect: s, onDragStart: r, isPending: a, hasError: i }) {
  const o = I[t.source], x = Ze[t.risk], m = t.canReschedule && !t.isDone;
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: m,
      onDragStart: m ? (d) => {
        d.stopPropagation(), d.dataTransfer.effectAllowed = "move", d.dataTransfer.setData("text/plain", t.key), r(t);
      } : void 0,
      onClick: (d) => {
        d.stopPropagation(), s(t);
      },
      title: t.subtitle ? `${t.title} — ${t.subtitle}` : t.title,
      style: x ? { backgroundImage: x.pattern } : void 0,
      className: f(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        x ? x.pill : "bg-neutral-subtle text-text-primary",
        t.isDone && "line-through opacity-65",
        m && "cursor-grab active:cursor-grabbing",
        /* Hata SATIRDA kalır — toast'a kaçmaz. */
        i && "ring-1 ring-negative-500",
        a && "opacity-60"
      ),
      children: [
        a ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin shrink-0 text-[9px]", "aria-hidden": "true" }) : o && /* @__PURE__ */ e.jsx("i", { className: f("fa shrink-0 text-[9px] opacity-70", o.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: t.title }),
        i && /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation ms-auto shrink-0 text-[9px]", "aria-hidden": "true" })
      ]
    }
  );
}
function tt({ summary: t, onSelect: s }) {
  const r = I[t.source];
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      onClick: (a) => {
        a.stopPropagation(), s(t.source);
      },
      className: f(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left",
        "text-[10.5px] font-medium text-text-secondary hover:bg-surface-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      ),
      children: [
        r && /* @__PURE__ */ e.jsx("i", { className: f("fa shrink-0 text-[9px] opacity-60", r.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: Be(t) })
      ]
    }
  );
}
function st({ load: t, capacity: s }) {
  if (!s || t <= 0) return null;
  const r = Math.min(t / s, 1), a = t > s;
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "mt-auto flex h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle",
      title: `Gün yükü ${N.hours(t)} / kapasite ${N.hours(s)}`,
      "aria-label": `Gün yükü ${N.hours(t)}, kapasite ${N.hours(s)}`,
      children: /* @__PURE__ */ e.jsx(
        "span",
        {
          className: f("h-full", a ? "bg-negative" : "bg-accent"),
          style: { width: `${r * 100}%` }
        }
      )
    }
  );
}
function rt({
  month: t,
  byDay: s,
  today: r,
  capacity: a,
  onSelectItem: i,
  onSelectDay: o,
  selectedDay: x,
  onDropItem: m,
  pending: d = {},
  errors: c = {}
}) {
  const n = _e(t), u = S(r), [l, b] = pe.useState(null), [g, j] = pe.useState(null);
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Je.map((T, w) => /* @__PURE__ */ e.jsx(
      "div",
      {
        className: f(
          "px-2.5 py-2 text-right text-[10.5px] font-bold uppercase tracking-wider",
          w > 4 ? "text-text-tertiary opacity-70" : "text-text-tertiary"
        ),
        children: T
      },
      T
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: n.map((T) => {
      const w = S(T), Y = s[w] ?? [], { pills: $, summaries: y } = Ge(Y), p = se(Y), v = T.getMonth() !== t.getMonth(), R = w === u, G = w === x;
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          role: "gridcell",
          tabIndex: -1,
          onClick: () => o(w),
          onDragOver: l ? (D) => {
            D.preventDefault(), D.dataTransfer.dropEffect = "move", g !== w && j(w);
          } : void 0,
          onDragLeave: l ? () => j((D) => D === w ? null : D) : void 0,
          onDrop: l ? (D) => {
            D.preventDefault();
            const O = l;
            b(null), j(null), O && O.date.slice(0, 10) !== w && m(O, /* @__PURE__ */ new Date(`${w}T00:00:00`));
          } : void 0,
          className: f(
            "flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5",
            "transition-colors duration-fast last:border-r-0 hover:bg-surface-hover",
            v ? "bg-surface-sunken" : "bg-surface-base",
            G && "ring-2 ring-inset ring-border-focus",
            g === w && "bg-primary-subtle ring-2 ring-inset ring-accent"
          ),
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
              p > 0 && a && p > a && /* @__PURE__ */ e.jsx("span", { className: "rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: N.hours(p) }),
              /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: f(
                    "ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11.5px] font-semibold leading-none tabular-nums",
                    R && "bg-accent text-white",
                    !R && v && "text-text-tertiary opacity-60",
                    !R && !v && "text-text-secondary"
                  ),
                  children: T.getDate()
                }
              )
            ] }),
            $.map((D) => /* @__PURE__ */ e.jsx(
              et,
              {
                item: D,
                onSelect: i,
                onDragStart: b,
                isPending: !!d[D.key],
                hasError: !!c[D.key]
              },
              D.key
            )),
            y.map((D) => /* @__PURE__ */ e.jsx(
              tt,
              {
                summary: D,
                onSelect: () => o(w)
              },
              `${w}-${D.source}`
            )),
            /* @__PURE__ */ e.jsx(st, { load: p, capacity: a })
          ]
        },
        w
      );
    }) })
  ] });
}
const at = { 1: "Google", 2: "Outlook", 3: "iCloud" };
function nt({
  sources: t,
  counts: s,
  enabled: r,
  onToggle: a,
  compact: i = !1,
  externalAccounts: o = [],
  externalLoading: x = !1,
  onOpenSync: m
}) {
  const d = (t ?? []).filter((c) => c.isAvailable);
  return d.length === 0 ? null : /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Takvim kaynakları",
      className: f(
        "flex flex-col gap-1 rounded-card border border-subtle bg-surface-base p-2",
        i ? "w-[60px] items-center" : "w-full"
      ),
      children: [
        !i && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Kaynaklar" }),
        d.map((c) => {
          const n = I[c.source];
          if (!n) return null;
          const u = r.has(c.source), l = s[c.source] ?? 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": u,
              title: i ? `${n.label} — ${l} öğe` : void 0,
              onClick: () => a(c.source),
              className: f(
                "group flex items-center rounded-md text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                i ? "relative h-11 w-11 justify-center" : "gap-2.5 px-2 py-2",
                u ? "text-text-primary" : "text-text-tertiary",
                "hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: f(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px]",
                      u ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: f("fa", n.icon) })
                  }
                ),
                i ? l > 0 && /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: f(
                      "absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-[9.5px] font-bold leading-4",
                      u ? "bg-accent text-white" : "bg-neutral-200 text-text-tertiary"
                    ),
                    children: l
                  }
                ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                  /* @__PURE__ */ e.jsx("span", { className: f("flex-1 truncate text-[12.5px] font-medium", !u && "line-through decoration-1"), children: n.label }),
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
            m && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: m,
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
              className: f(
                "flex items-start gap-2 rounded-md px-2 py-1.5",
                c.error && "bg-negative-50"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: f(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px]",
                      c.error ? "bg-negative-100 text-negative-700" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: f("fa", c.error ? "fa-triangle-exclamation" : "fa-calendar-days") })
                  }
                ),
                /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: at[c.provider] ?? "Takvim" }),
                  /* @__PURE__ */ e.jsx("span", { className: f(
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
const it = { month: "Ay", week: "Hafta", day: "Gün", agenda: "Ajanda" };
function lt({ title: t, view: s, onView: r, onPrev: a, onNext: i, onToday: o, overloadDays: x }) {
  const m = s !== "agenda";
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    m && /* @__PURE__ */ e.jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: a,
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
    /* @__PURE__ */ e.jsx(K, { variant: "outline", size: "sm", onClick: o, children: "Bugün" }),
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
      /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(it).map(([d, c]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": s === d,
          onClick: () => r(d),
          className: f(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            s === d ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: c
        },
        d
      )) })
    ] })
  ] });
}
const _ = 44, ot = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], ct = {
  [A.OVERDUE]: "bg-negative-50 text-negative-700",
  [A.DUE_TODAY]: "bg-warning-50 text-warning-700"
};
function dt({ load: t, capacity: s }) {
  if (!s || t <= 0) return null;
  const r = t > s;
  return /* @__PURE__ */ e.jsx("div", { className: "mt-1 h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
    "span",
    {
      className: f("block h-full", r ? "bg-negative" : "bg-accent"),
      style: { width: `${Math.min(t / s, 1) * 100}%` }
    }
  ) });
}
function ut({ days: t, byDay: s, today: r, capacity: a, onSelectItem: i, onSelectDay: o, selectedDay: x }) {
  const m = S(r), d = h.useRef(null), [c, n] = h.useState(() => {
    const y = /* @__PURE__ */ new Date();
    return y.getHours() * 60 + y.getMinutes();
  });
  h.useEffect(() => {
    const y = setInterval(() => {
      const p = /* @__PURE__ */ new Date();
      n(p.getHours() * 60 + p.getMinutes());
    }, 6e4);
    return () => clearInterval(y);
  }, []);
  const u = t.map(S), l = {}, b = {};
  for (const y of u) {
    const p = s[y] ?? [];
    l[y] = p.filter(fe), b[y] = p.filter((v) => !fe(v));
  }
  const g = u.flatMap((y) => l[y]), { start: j, end: T } = Ve(g), w = Array.from({ length: T - j }, (y, p) => j + p), Y = (T - j) * _, $ = u.includes(m) && c >= j * 60 && c <= T * 60;
  return h.useEffect(() => {
    if (!$ || !d.current) return;
    const y = (c - j * 60) / 60 * _;
    d.current.scrollTop = Math.max(0, y - 120);
  }, [$, j]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "grid border-b border-default bg-surface-raised",
        style: { gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))` },
        children: [
          /* @__PURE__ */ e.jsx("div", {}),
          t.map((y) => {
            const p = S(y), v = se(s[p] ?? []), R = p === m;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => o(p),
                className: f(
                  "border-l border-subtle px-2 py-2 text-left transition-colors duration-fast hover:bg-surface-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
                  x === p && "bg-primary-subtle"
                ),
                children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "flex items-baseline gap-1.5", children: [
                    /* @__PURE__ */ e.jsx("span", { className: f(
                      "text-[10.5px] font-bold uppercase tracking-wider",
                      R ? "text-accent" : "text-text-tertiary"
                    ), children: ot[(y.getDay() + 6) % 7] }),
                    /* @__PURE__ */ e.jsx("span", { className: f(
                      "font-mono text-[13px] font-semibold tabular-nums",
                      R ? "text-accent" : "text-text-primary"
                    ), children: y.getDate() }),
                    a && v > a && /* @__PURE__ */ e.jsx("span", { className: "ms-auto rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: N.hours(v) })
                  ] }),
                  /* @__PURE__ */ e.jsx(dt, { load: v, capacity: a })
                ]
              },
              p
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
          u.map((y) => /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-[46px] flex-col gap-[3px] border-l border-subtle p-1", children: [
            b[y].slice(0, 4).map((p) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => i(p),
                title: p.title,
                className: f(
                  "flex w-full items-center gap-1 truncate rounded-[5px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                  ct[p.risk] ?? "bg-neutral-subtle text-text-primary",
                  p.isDone && "line-through opacity-65"
                ),
                children: [
                  I[p.source] && /* @__PURE__ */ e.jsx("i", { className: f("fa shrink-0 text-[9px] opacity-70", I[p.source].icon), "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "truncate", children: p.title })
                ]
              },
              p.key
            )),
            b[y].length > 4 && /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => o(y),
                className: "px-1.5 text-left text-[10.5px] font-medium text-text-tertiary hover:text-text-primary",
                children: [
                  "+",
                  b[y].length - 4,
                  " öğe"
                ]
              }
            )
          ] }, y))
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
            height: `${Y}px`
          },
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "relative", children: w.map((y, p) => /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: "absolute right-1.5 -translate-y-1/2 font-mono text-[10px] tabular-nums text-text-tertiary",
                style: { top: `${p * _}px` },
                children: [
                  String(y).padStart(2, "0"),
                  ":00"
                ]
              },
              y
            )) }),
            u.map((y) => /* @__PURE__ */ e.jsxs("div", { className: "relative border-l border-subtle", children: [
              w.map((p, v) => /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "absolute inset-x-0 border-t border-subtle",
                  style: { top: `${v * _}px` }
                },
                p
              )),
              l[y].map((p) => {
                const v = ee(p.startTime), R = p.endTime ? ee(p.endTime) : v + 60, G = (v - j * 60) / 60 * _, D = Math.max((R - v) / 60 * _, 18);
                return /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => i(p),
                    title: `${p.title} · ${ae(p.startTime)}`,
                    style: {
                      top: `${G}px`,
                      height: `${D}px`,
                      backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(0,0,0,.05) 4px, rgba(0,0,0,.05) 6px)"
                    },
                    className: f(
                      "absolute inset-x-0.5 overflow-hidden rounded-[5px] border-l-2 border-accent bg-primary-subtle",
                      "px-1.5 py-0.5 text-left text-[10.5px] leading-tight text-text-primary",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    ),
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: "block truncate font-semibold", children: p.title }),
                      /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[9.5px] text-text-tertiary", children: [
                        ae(p.startTime),
                        p.endTime ? `–${ae(p.endTime)}` : ""
                      ] })
                    ]
                  },
                  p.key
                );
              }),
              $ && y === m && /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "pointer-events-none absolute inset-x-0 z-10 border-t-2 border-negative",
                  style: { top: `${(c - j * 60) / 60 * _}px` },
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
const xt = {
  [A.OVERDUE]: { text: "Gecikmiş", cls: "bg-negative-50 text-negative-700" },
  [A.DUE_TODAY]: { text: "Bugün son gün", cls: "bg-warning-50 text-warning-700" }
};
function U({ label: t, children: s }) {
  return s ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-subtle py-2.5 last:border-b-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11.5px] font-medium text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "min-w-0 text-right text-[12.5px] text-text-primary", children: s })
  ] }) : null;
}
function mt({ item: t, capacity: s, onClose: r, onReschedule: a, onComplete: i, isPending: o, error: x, onRetry: m }) {
  const [d, c] = h.useState(() => t.date.slice(0, 10)), n = I[t.source], u = xt[t.risk], l = t.date.slice(0, 10);
  h.useEffect(() => c(l), [l]);
  const b = () => {
    !d || d === l || a(t, /* @__PURE__ */ new Date(`${d}T00:00:00`));
  };
  return /* @__PURE__ */ e.jsx(J, { open: !0, onOpenChange: (g) => {
    g || r();
  }, children: /* @__PURE__ */ e.jsxs(Z, { side: "right", title: t.title, className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md bg-neutral-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary", children: [
          n && /* @__PURE__ */ e.jsx("i", { className: f("fa text-[10px]", n.icon), "aria-hidden": "true" }),
          n == null ? void 0 : n.label
        ] }),
        u && /* @__PURE__ */ e.jsx("span", { className: f("rounded-md px-2 py-1 text-[11px] font-bold", u.cls), children: u.text }),
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
    x && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-negative-100 bg-negative-50 px-4 py-2.5 text-[12px] text-negative-700", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: x }),
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: m, className: "font-semibold underline", children: "Yeniden dene" })
    ] }),
    o && /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle px-4 py-2 text-[12px] text-text-tertiary", "aria-live": "polite", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "kaydediliyor…"
    ] }),
    t.canReschedule && !t.isDone && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs(K, { size: "sm", variant: "secondary", onClick: () => i(t), children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-check me-1.5", "aria-hidden": "true" }),
        "Tamamla"
      ] }),
      /* @__PURE__ */ e.jsx(
        K,
        {
          size: "sm",
          variant: "outline",
          onClick: () => a(t, P(/* @__PURE__ */ new Date(`${l}T00:00:00`), 1)),
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
            value: d,
            onChange: (g) => c(g.target.value),
            className: "rounded-md border border-default bg-surface-base px-2 py-1 text-[12.5px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": "Son tarih"
          }
        ),
        d !== l && /* @__PURE__ */ e.jsx(K, { size: "sm", variant: "primary", onClick: b, children: "Uygula" })
      ] }) : /* @__PURE__ */ e.jsxs("span", { className: "text-text-secondary", children: [
        N.dayTitle(/* @__PURE__ */ new Date(`${l}T00:00:00`)),
        /* @__PURE__ */ e.jsx("span", { className: "ml-1.5 text-text-tertiary", children: "· takvimden değiştirilemez" })
      ] }) }),
      /* @__PURE__ */ e.jsx(U, { label: "Bağlam", children: t.subtitle }),
      /* @__PURE__ */ e.jsx(U, { label: "Atanan", children: t.assigneeName }),
      /* @__PURE__ */ e.jsx(U, { label: "Tutar", children: t.amount != null ? N.money(t.amount, t.currency) : null }),
      /* @__PURE__ */ e.jsx(U, { label: "Gün yükü", children: t.loadHours != null ? `${N.hours(t.loadHours)}${s ? ` / ${N.hours(s)} kapasite` : ""}` : null })
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
const we = ["calendar", "sync-settings"];
function pt(t) {
  return de({
    queryKey: we,
    queryFn: () => L.get("/api/app/calendar/sync-settings"),
    enabled: t,
    staleTime: 3e4
  });
}
function ft() {
  const t = ye();
  return ie({
    mutationFn: (s) => L.post("/api/app/calendar/sync-rules", s),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: we }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
const bt = {
  1: { label: "Google Calendar", icon: "fa-google", brand: "bg-[#ea4335]" },
  2: { label: "Microsoft Outlook", icon: "fa-windows", brand: "bg-[#0078d4]" },
  3: { label: "iCloud", icon: "fa-apple", brand: "bg-neutral-700" }
}, ht = {
  0: { title: "Son değişen kazanır", desc: "İki taraf da düzenlenirse en son yapılan değişiklik uygulanır; ekranda geri alma şeridi çıkar." },
  1: { title: "APYA her zaman kazanır", desc: "Dış takvim salt-okunur ayna olur; dışarıdaki düzenleme geri alınır." }
}, be = {
  0: { icon: "fa-arrow-up-from-bracket", cls: "text-text-tertiary" },
  1: { icon: "fa-code-merge", cls: "text-warning-700" },
  2: { icon: "fa-triangle-exclamation", cls: "text-negative-700" }
};
function De(t) {
  if (!t) return "hiç";
  const s = Math.round((Date.now() - new Date(t).getTime()) / 6e4);
  return s < 1 ? "az önce" : s < 60 ? `${s} dk önce` : s < 1440 ? `${Math.round(s / 60)} sa önce` : N.dayShort(new Date(t));
}
function gt({ account: t, onSave: s, saving: r }) {
  const a = bt[t.provider] ?? { label: "Takvim", icon: "fa-calendar", brand: "bg-neutral-700" }, [i, o] = h.useState(() => new Set(t.syncSources ?? [])), [x, m] = h.useState(t.conflictRule ?? 0), [d, c] = h.useState(t.isSyncEnabled);
  h.useEffect(() => {
    o(new Set(t.syncSources ?? [])), m(t.conflictRule ?? 0), c(t.isSyncEnabled);
  }, [t]);
  const n = d !== t.isSyncEnabled || x !== t.conflictRule || i.size !== (t.syncSources ?? []).length || [...i].some((l) => !(t.syncSources ?? []).includes(l)), u = (l) => o((b) => {
    const g = new Set(b);
    return g.has(l) ? g.delete(l) : g.add(l), g;
  });
  return /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-3 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: f("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", a.brand), "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("i", { className: f("fab", a.icon) }) }),
      /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-semibold text-text-primary", children: a.label }),
        /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[11.5px] text-text-tertiary", children: [
          t.externalEmail,
          " · son senkron ",
          De(t.lastSyncTime)
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("label", { className: "flex shrink-0 items-center gap-1.5 text-[11.5px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: d,
            onChange: (l) => c(l.target.checked),
            className: "h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
          }
        ),
        "Açık"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Bu hesaba ne gitsin?" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: ze.map((l) => {
        var g, j;
        const b = i.has(l);
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": b,
            onClick: () => u(l),
            className: f(
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              b ? "border-accent bg-primary-subtle text-accent" : "border-subtle bg-surface-base text-text-tertiary hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: f("fa text-[10px]", (g = I[l]) == null ? void 0 : g.icon), "aria-hidden": "true" }),
              (j = I[l]) == null ? void 0 : j.label
            ]
          },
          l
        );
      }) }),
      i.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-text-tertiary", children: "Hiçbiri seçili değil — yalnız görevler gönderilir." }),
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Çakışma kuralı" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: Object.entries(ht).map(([l, b]) => {
        const g = Number(l), j = x === g;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => m(g),
            className: f(
              "rounded-md border px-2.5 py-2 text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              j ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("span", { className: f("block text-[12px] font-semibold", j ? "text-accent" : "text-text-primary"), children: b.title }),
              /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] leading-snug text-text-tertiary", children: b.desc })
            ]
          },
          l
        );
      }) }),
      n && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          K,
          {
            size: "sm",
            variant: "primary",
            disabled: r,
            onClick: () => s({
              accountId: t.id,
              isSyncEnabled: d,
              syncSources: [...i],
              syncProjectIds: t.syncProjectIds ?? [],
              conflictRule: x
            }),
            children: r ? "Kaydediliyor…" : "Kuralları kaydet"
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Kaydedilmemiş değişiklik var" })
      ] })
    ] })
  ] });
}
function yt({ open: t, onClose: s }) {
  const { data: r, isPending: a } = pt(t), i = ft();
  return /* @__PURE__ */ e.jsx(J, { open: t, onOpenChange: (o) => {
    o || s();
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
          onClick: s,
          "aria-label": "Kapat",
          className: "rounded-md p-1.5 text-text-tertiary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "flex-1 overflow-y-auto px-4 py-3", children: a ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", "aria-hidden": "true", children: [
      /* @__PURE__ */ e.jsx(q, { height: 92 }),
      /* @__PURE__ */ e.jsx(q, { height: 92 })
    ] }) : ((r == null ? void 0 : r.accounts) ?? []).length === 0 ? /* @__PURE__ */ e.jsx(
      V,
      {
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
        title: "Bağlı takvim yok",
        description: "Google veya Outlook hesabı bağlayınca size atanan tarihli öğeler oraya etkinlik olarak yazılır.",
        action: /* @__PURE__ */ e.jsx(K, { size: "sm", variant: "outline", onClick: () => {
          window.location.href = "/Calendars/SimulateAuth?provider=1";
        }, children: "Hesap bağla" })
      }
    ) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", children: [
      r.accounts.map((o) => /* @__PURE__ */ e.jsx(
        gt,
        {
          account: o,
          saving: i.isPending,
          onSave: (x) => i.mutate(x)
        },
        o.id
      )),
      /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
        /* @__PURE__ */ e.jsx("header", { className: "border-b border-subtle px-3 py-2", children: /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-semibold text-text-primary", children: "Senkron günlüğü" }) }),
        /* @__PURE__ */ e.jsx("div", { className: "px-3 py-2", children: (r.log ?? []).length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-2 text-[11.5px] text-text-tertiary", children: "Henüz senkron kaydı yok." }) : r.log.map((o) => {
          const x = be[o.kind] ?? be[0];
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
            /* @__PURE__ */ e.jsx("i", { className: f("fa mt-0.5 shrink-0 text-[11px]", x.icon, x.cls), "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[11.5px] leading-snug text-text-secondary", children: o.message }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: De(o.occurredAt) })
          ] }, o.id);
        }) })
      ] })
    ] }) })
  ] }) });
}
const vt = 6e4;
function jt({ from: t, to: s }) {
  const r = S(t), a = S(s);
  return de({
    queryKey: ["calendar", "feed", r, a],
    queryFn: () => L.get(`/api/app/calendar/feed?From=${r}&To=${a}`),
    staleTime: vt,
    placeholderData: (i) => i
    /* ay geçişinde boş ekran yerine eski veri */
  });
}
const Se = "apya.calendar.view", ce = "apya.calendar.sources", te = ["month", "week", "day", "agenda"];
function Te(t) {
  try {
    return window.localStorage.getItem(t);
  } catch {
    return null;
  }
}
function ne(t, s) {
  try {
    window.localStorage.setItem(t, s);
  } catch {
  }
}
function kt() {
  const t = new URLSearchParams(window.location.search).get("view");
  if (te.includes(t)) return t;
  const s = Te(Se);
  return te.includes(s) ? s : null;
}
function Nt() {
  const t = Te(ce);
  if (!t) return new Set(H);
  const s = t.split(",").map(Number).filter((r) => H.includes(r));
  return s.length ? new Set(s) : new Set(H);
}
function wt({ defaultView: t = "month" } = {}) {
  const [s] = h.useState(kt), [r, a] = h.useState(() => s ?? t), [i, o] = h.useState(Nt);
  h.useEffect(() => {
    const n = new URL(window.location.href);
    n.searchParams.get("view") !== r && (n.searchParams.set("view", r), window.history.replaceState({}, "", n));
  }, [r]);
  const x = h.useCallback((n) => {
    te.includes(n) && (a(n), ne(Se, n));
  }, []), m = h.useCallback((n) => {
    o((u) => {
      const l = new Set(u);
      return l.has(n) ? l.delete(n) : l.add(n), ne(ce, [...l].join(",")), l;
    });
  }, []), d = h.useCallback((n) => {
    s || te.includes(n) && a((u) => u === n ? u : n);
  }, [s]), c = h.useCallback(() => {
    const n = new Set(H);
    o(n), ne(ce, [...n].join(","));
  }, []);
  return { view: r, setView: x, applyResponsiveDefault: d, enabledSources: i, toggleSource: m, resetSources: c };
}
const M = ["calendar", "feed"];
function Dt(t, s, r) {
  t.setQueriesData({ queryKey: M }, (a) => a != null && a.items ? {
    ...a,
    items: a.items.map((i) => i.key === s ? { ...i, date: `${r}T00:00:00` } : i)
  } : a);
}
function St(t, s) {
  t.setQueriesData({ queryKey: M }, (r) => r != null && r.items ? {
    ...r,
    items: r.items.map((a) => a.key === s ? { ...a, isDone: !0, risk: 0, loadHours: null } : a)
  } : r);
}
function Tt() {
  const t = ye(), [s, r] = h.useState(null), [a, i] = h.useState({}), [o, x] = h.useState({}), m = h.useCallback((n) => {
    i((u) => {
      if (!u[n]) return u;
      const l = { ...u };
      return delete l[n], l;
    });
  }, []), d = ie({
    mutationFn: ({ item: n, newDate: u }) => L.post("/api/app/calendar/reschedule-item", {
      source: n.source,
      sourceId: n.sourceId,
      newDate: S(u)
    }),
    onMutate: async ({ item: n, newDate: u }) => {
      await t.cancelQueries({ queryKey: M });
      const l = t.getQueriesData({ queryKey: M });
      return m(n.key), x((b) => ({ ...b, [n.key]: !0 })), Dt(t, n.key, S(u)), { snapshot: l, previousDate: n.date.slice(0, 10) };
    },
    onError: (n, { item: u }, l) => {
      var b;
      (b = l == null ? void 0 : l.snapshot) == null || b.forEach(([g, j]) => t.setQueryData(g, j)), i((g) => ({
        ...g,
        [u.key]: (n == null ? void 0 : n.message) || "Kaydedilemedi — tarih değişmedi."
      }));
    },
    onSuccess: (n, { item: u, newDate: l }, b) => {
      r({
        key: u.key,
        message: `“${u.title}” ${S(l)} tarihine taşındı.`,
        undo: () => d.mutate({
          item: { ...u, date: `${S(l)}T00:00:00` },
          newDate: /* @__PURE__ */ new Date(`${b.previousDate}T00:00:00`)
        })
      });
    },
    onSettled: (n, u, { item: l }) => {
      x((b) => {
        const g = { ...b };
        return delete g[l.key], g;
      }), t.invalidateQueries({ queryKey: M });
    }
  }), c = ie({
    mutationFn: ({ item: n }) => L.post("/api/app/calendar/complete-item", {
      source: n.source,
      sourceId: n.sourceId
    }),
    onMutate: async ({ item: n }) => {
      await t.cancelQueries({ queryKey: M });
      const u = t.getQueriesData({ queryKey: M });
      return m(n.key), x((l) => ({ ...l, [n.key]: !0 })), St(t, n.key), { snapshot: u };
    },
    onError: (n, { item: u }, l) => {
      var b;
      (b = l == null ? void 0 : l.snapshot) == null || b.forEach(([g, j]) => t.setQueryData(g, j)), i((g) => ({
        ...g,
        [u.key]: (n == null ? void 0 : n.message) || "Tamamlanamadı."
      }));
    },
    onSuccess: (n, { item: u }) => {
      r({ key: u.key, message: `“${u.title}” tamamlandı.`, undo: null });
    },
    onSettled: (n, u, { item: l }) => {
      x((b) => {
        const g = { ...b };
        return delete g[l.key], g;
      }), t.invalidateQueries({ queryKey: M });
    }
  });
  return {
    reschedule: (n, u) => d.mutate({ item: n, newDate: u }),
    complete: (n) => c.mutate({ item: n }),
    retry: (n, u) => u ? d.mutate({ item: n, newDate: u }) : c.mutate({ item: n }),
    lastAction: s,
    dismissAction: () => r(null),
    errors: a,
    clearError: m,
    pending: o
  };
}
function Ct({ from: t, to: s, enabled: r = !0 }) {
  const a = S(t), i = S(s);
  return de({
    queryKey: ["calendar", "external", a, i],
    queryFn: () => L.get(`/api/app/calendar/external-events?From=${a}&To=${i}`),
    enabled: r,
    staleTime: 12e4,
    retry: !1,
    placeholderData: (o) => o
  });
}
function Et() {
  const t = h.useRef(null), [s, r] = h.useState(0);
  return h.useLayoutEffect(() => {
    const a = t.current;
    if (!a || (r(a.getBoundingClientRect().width), typeof ResizeObserver > "u")) return;
    const i = new ResizeObserver((o) => {
      for (const x of o)
        r(x.contentRect.width);
    });
    return i.observe(a), () => i.disconnect();
  }, []), [t, s];
}
function Rt(t) {
  return t === 0 || t >= 1180 ? "wide" : t >= 780 ? "medium" : "narrow";
}
const $t = 60;
function he(t, s, r) {
  return s === "week" ? P(t, 7 * r) : s === "day" ? P(t, r) : new Date(t.getFullYear(), t.getMonth() + r, 1);
}
function It() {
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Array.from({ length: 7 }, (t, s) => /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-2", children: /* @__PURE__ */ e.jsx(q, { height: 10 }) }, s)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: Array.from({ length: ue }, (t, s) => /* @__PURE__ */ e.jsxs("div", { className: "min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0", children: [
      /* @__PURE__ */ e.jsx(q, { height: 12, width: "40%", className: "ml-auto" }),
      s % 3 === 0 && /* @__PURE__ */ e.jsx(q, { height: 14, className: "mt-2" })
    ] }, s)) })
  ] });
}
function At() {
  var me;
  const [t, s] = Et(), r = Rt(s), a = r === "narrow", i = h.useMemo(() => le(/* @__PURE__ */ new Date()), []), [o, x] = h.useState(() => new Date(i.getFullYear(), i.getMonth(), 1)), [m, d] = h.useState(null), [c, n] = h.useState(null), [u, l] = h.useState(!1), { view: b, setView: g, applyResponsiveDefault: j, enabledSources: T, toggleSource: w, resetSources: Y } = wt();
  h.useEffect(() => {
    s !== 0 && j(a ? "agenda" : "month");
  }, [s, a, j]);
  const { range: $, title: y, weekDayList: p } = h.useMemo(() => {
    if (b === "agenda")
      return {
        range: { from: P(i, -60), to: P(i, $t) },
        title: "Ajanda",
        weekDayList: null
      };
    if (b === "week") {
      const E = qe(o);
      return {
        range: { from: E[0], to: E[6] },
        title: `${N.dayShort(E[0])} – ${N.dayShort(E[6])} ${E[6].getFullYear()}`,
        weekDayList: E
      };
    }
    if (b === "day") {
      const E = le(o);
      return { range: { from: E, to: E }, title: N.dayTitle(E), weekDayList: [E] };
    }
    const k = ke(o);
    return {
      range: { from: k, to: P(k, ue - 1) },
      title: N.monthTitle(o),
      weekDayList: null
    };
  }, [b, o, i]), { data: v, isPending: R, isError: G, refetch: D } = jt($), O = Ct($), Q = h.useMemo(
    () => {
      var k;
      return [...(v == null ? void 0 : v.items) ?? [], ...((k = O.data) == null ? void 0 : k.items) ?? []];
    },
    [v, O.data]
  ), W = h.useMemo(
    () => Q.filter((k) => T.has(k.source)),
    [Q, T]
  ), z = h.useMemo(() => Ne(W), [W]), F = (v == null ? void 0 : v.dailyCapacityHours) ?? null, Ce = h.useMemo(() => {
    const k = {};
    for (const E of (v == null ? void 0 : v.sources) ?? []) k[E.source] = E.count;
    return k;
  }, [v]), Ee = h.useMemo(() => F ? Object.values(z).filter((k) => se(k) > F).length : 0, [z, F]);
  h.useEffect(() => {
    m && !z[m] && !R && (m >= S($.from) && m <= S($.to) || d(null));
  }, [m, z, R, $]);
  const X = h.useCallback((k) => n(k.key), []), Re = h.useCallback(() => {
    x(i), d(S(i));
  }, [i]), C = Tt(), xe = Q.length > 0, $e = xe && W.length === 0, Ie = m ? z[m] ?? [] : [], B = c ? Q.find((k) => k.key === c) ?? null : null, re = m && /* @__PURE__ */ e.jsx(
    Xe,
    {
      dayKey: m,
      items: Ie,
      capacity: F,
      onSelectItem: X,
      onClose: () => d(null)
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { ref: t, className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsx(
      lt,
      {
        title: y,
        view: b,
        onView: g,
        onPrev: () => x((k) => he(k, b, -1)),
        onNext: () => x((k) => he(k, b, 1)),
        onToday: Re,
        overloadDays: Ee
      }
    ),
    G && /* @__PURE__ */ e.jsxs("div", { className: "rounded-card border border-negative-100 bg-negative-50 px-3 py-2.5 text-[12.5px] text-negative-700", children: [
      "Takvim yüklenemedi.",
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => D(), className: "ml-2 font-semibold underline", children: "Yeniden dene" })
    ] }),
    C.lastAction && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "flex items-center gap-2 rounded-card border border-subtle bg-surface-raised px-3 py-2 text-[12.5px] text-text-secondary",
        role: "status",
        "aria-live": "polite",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left text-text-tertiary", "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 truncate", children: C.lastAction.message }),
          C.lastAction.undo && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                C.lastAction.undo(), C.dismissAction();
              },
              className: "font-semibold text-text-link hover:underline",
              children: "Geri al"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: C.dismissAction,
              "aria-label": "Şeridi kapat",
              className: "rounded p-1 text-text-tertiary hover:bg-surface-hover",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: f("flex gap-3", a ? "flex-col" : "flex-row items-start"), children: [
      !a && /* @__PURE__ */ e.jsx("div", { className: f("shrink-0", r === "wide" ? "w-[240px]" : "w-auto"), children: /* @__PURE__ */ e.jsx(
        nt,
        {
          sources: (v == null ? void 0 : v.sources) ?? [],
          counts: Ce,
          enabled: T,
          onToggle: w,
          compact: r !== "wide",
          externalAccounts: ((me = O.data) == null ? void 0 : me.accounts) ?? [],
          externalLoading: O.isFetching,
          onOpenSync: () => l(!0)
        }
      ) }),
      /* @__PURE__ */ e.jsx("div", { className: "min-w-0 flex-1", children: R ? /* @__PURE__ */ e.jsx(It, {}) : $e ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
        V,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-filter-circle-xmark" }),
          title: "Bu filtreyle gösterilecek öğe yok",
          description: "Kaynak rayında kapattığınız türler bu aralıktaki tüm öğeleri gizliyor.",
          action: /* @__PURE__ */ e.jsx(K, { size: "sm", variant: "outline", onClick: Y, children: "Kaynakları aç" })
        }
      ) }) : xe ? b === "month" ? /* @__PURE__ */ e.jsx(
        rt,
        {
          month: o,
          byDay: z,
          today: i,
          capacity: F,
          selectedDay: m,
          onSelectItem: X,
          onSelectDay: d,
          onDropItem: C.reschedule,
          pending: C.pending,
          errors: C.errors
        }
      ) : p ? /* @__PURE__ */ e.jsx(
        ut,
        {
          days: p,
          byDay: z,
          today: i,
          capacity: F,
          selectedDay: m,
          onSelectItem: X,
          onSelectDay: d
        }
      ) : /* @__PURE__ */ e.jsx(We, { items: W, today: i, onSelectItem: X }) : /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
        V,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
          title: "Bu aralıkta planlanmış bir şey yok",
          description: "Son tarihi olan görevler, fatura vadeleri, hibe son tarihleri ve tarihli finans kayıtları burada birlikte görünür.",
          action: /* @__PURE__ */ e.jsx(K, { size: "sm", variant: "outline", onClick: () => {
            window.location.href = "/Tasks";
          }, children: "Görev oluştur" })
        }
      ) }) }),
      r === "wide" && m && /* @__PURE__ */ e.jsx("div", { className: "w-[340px] shrink-0 self-stretch", children: re })
    ] }),
    r === "medium" && m && /* @__PURE__ */ e.jsx(J, { open: !0, onOpenChange: (k) => {
      k || d(null);
    }, children: /* @__PURE__ */ e.jsx(Z, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: re }) }),
    a && m && /* @__PURE__ */ e.jsx(J, { open: !0, onOpenChange: (k) => {
      k || d(null);
    }, children: /* @__PURE__ */ e.jsx(Z, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: re }) }),
    /* @__PURE__ */ e.jsx(yt, { open: u, onClose: () => l(!1) }),
    B && /* @__PURE__ */ e.jsx(
      mt,
      {
        item: B,
        capacity: F,
        onClose: () => n(null),
        onReschedule: C.reschedule,
        onComplete: C.complete,
        isPending: !!C.pending[B.key],
        error: C.errors[B.key],
        onRetry: () => C.clearError(B.key)
      }
    )
  ] });
}
const ge = document.getElementById("apya-calendar-root");
ge && Ae(ge).render(
  /* @__PURE__ */ e.jsx(Oe, { children: /* @__PURE__ */ e.jsx(Me, { children: /* @__PURE__ */ e.jsx(Ke, { children: /* @__PURE__ */ e.jsx(At, {}) }) }) })
);
