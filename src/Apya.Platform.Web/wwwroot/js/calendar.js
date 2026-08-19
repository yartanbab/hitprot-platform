import { j as e, d as ue, r as g, b as pt } from "./react-vendor.js";
import { c as y, B as $, d as ie, e as le, S as re, D as He, i as We, T as mt } from "./Dialog.js";
import { D as bt } from "./useDeviceMode.js";
import { a as ft } from "./QueryProvider.js";
import { E as oe } from "./EmptyState.js";
import { a as R } from "./httpClient.js";
import { u as U, b as _, a as W } from "./query-vendor.js";
/* empty css      */
const P = {
  1: { key: "task", label: "Görev", plural: "görev", icon: "fa-circle-check" },
  2: { key: "invoice", label: "Fatura", plural: "fatura", icon: "fa-file-invoice" },
  3: { key: "grant", label: "Hibe", plural: "hibe", icon: "fa-award" },
  4: { key: "expense", label: "Gider", plural: "gider", icon: "fa-arrow-trend-down" },
  5: { key: "income", label: "Gelir", plural: "gelir", icon: "fa-arrow-trend-up" },
  6: { key: "cash", label: "Kasa hareketi", plural: "kasa hareketi", icon: "fa-wallet" },
  7: { key: "external", label: "Dış etkinlik", plural: "dış etkinlik", icon: "fa-calendar-days" }
}, ne = [1, 2, 3, 4, 5, 6, 7], Ne = [1, 2, 3, 4, 5, 6], K = { DUE_TODAY: 1, OVERDUE: 2 }, ht = (t) => t.risk === K.OVERDUE || t.risk === K.DUE_TODAY, Ve = 864e5, we = (t) => new Date(t.getFullYear(), t.getMonth(), t.getDate()), F = (t, a) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + a);
function C(t) {
  const a = (s) => (s < 10 ? "0" : "") + s;
  return `${t.getFullYear()}-${a(t.getMonth() + 1)}-${a(t.getDate())}`;
}
function Ce(t) {
  const a = (t.getDay() + 6) % 7;
  return new Date(t.getTime() - a * Ve);
}
const Xe = (t) => Ce(new Date(t.getFullYear(), t.getMonth(), 1)), Te = 42;
function Je(t) {
  const a = Xe(t);
  return Array.from({ length: Te }, (s, r) => new Date(a.getTime() + r * Ve));
}
const gt = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }), yt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }), kt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }), N = {
  monthTitle: (t) => gt.format(t),
  dayTitle: (t) => yt.format(t),
  dayShort: (t) => kt.format(t),
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
function Ze(t) {
  const a = {};
  for (const s of t ?? []) {
    const r = (s.date || "").slice(0, 10);
    r && (a[r] ?? (a[r] = [])).push(s);
  }
  return a;
}
const fe = (t) => (t ?? []).reduce((a, s) => a + (s.loadHours ?? 0), 0);
function vt(t, { maxPills: a = 3, maxRiskPills: s = 2 } = {}) {
  const r = t ?? [];
  if (r.length === 0) return { pills: [], summaries: [] };
  if (r.length <= a) return { pills: r, summaries: [] };
  const x = r.filter(ht).slice(0, s), d = new Set(x.map((n) => n.key)), c = /* @__PURE__ */ new Map();
  for (const n of r) {
    if (d.has(n.key)) continue;
    const u = c.get(n.source) ?? { source: n.source, count: 0, amount: 0, hasAmount: !1, only: null };
    u.count += 1, u.only = u.count === 1 ? n : null, n.amount != null && (u.amount += n.amount, u.hasAmount = !0), c.set(n.source, u);
  }
  const p = [];
  for (const n of ne) {
    const u = c.get(n);
    u && (u.count === 1 && u.only ? x.push(u.only) : p.push(u));
  }
  return { pills: x, summaries: p };
}
function jt(t, { compact: a = !0 } = {}) {
  const s = P[t.source], r = `${t.count} ${s ? s.plural : "öğe"}`;
  if (!t.hasAmount) return r;
  const l = a ? N.moneyCompact(t.amount) : N.money(t.amount);
  return `${r} · ${l}`;
}
function et(t, a) {
  const s = C(a), r = (t ?? []).filter((p) => !p.isDone), l = r.filter((p) => p.date.slice(0, 10) < s && p.risk === K.OVERDUE), x = r.filter((p) => p.date.slice(0, 10) >= s), d = Ze(x), c = Object.keys(d).sort().map((p) => ({
    key: p,
    date: /* @__PURE__ */ new Date(`${p}T00:00:00`),
    isToday: p === s,
    items: d[p]
  }));
  return { overdue: l, days: c };
}
function Nt(t) {
  const a = Ce(we(t));
  return Array.from({ length: 7 }, (s, r) => F(a, r));
}
const wt = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }), ke = (t) => t ? wt.format(new Date(t)) : "";
function me(t) {
  const a = new Date(t);
  return a.getHours() * 60 + a.getMinutes();
}
function St(t) {
  let a = 8, s = 18;
  for (const r of t ?? [])
    r.startTime && (a = Math.min(a, Math.floor(me(r.startTime) / 60)), s = Math.max(s, Math.ceil(me(r.endTime ?? r.startTime) / 60)));
  return { start: Math.max(0, a), end: Math.min(24, Math.max(s, a + 4)) };
}
const _e = (t) => !!t.startTime, qe = (t) => t.getDay() === 0 || t.getDay() === 6;
function Dt(t, { today: a, capacity: s = null, horizonDays: r = 21, fallbackPerDay: l = 3 } = {}) {
  const x = C(a), d = (t ?? []).filter((f) => !f.isDone), c = d.filter((f) => f.date.slice(0, 10) < x && f.risk === K.OVERDUE), p = c.filter((f) => f.canReschedule), n = c.filter((f) => !f.canReschedule), u = {}, o = {};
  for (const f of d) {
    const b = f.date.slice(0, 10);
    b < x || (u[b] = (u[b] ?? 0) + (f.loadHours ?? 0), o[b] = (o[b] ?? 0) + 1);
  }
  const i = [];
  let m = 0;
  for (const f of p) {
    let b = null;
    for (; m < r; ) {
      const j = F(a, m);
      if (qe(j)) {
        m += 1;
        continue;
      }
      const D = C(j), O = u[D] ?? 0, z = o[D] ?? 0, v = f.loadHours ?? 0;
      if (s ? O + v <= s : z < l) {
        u[D] = O + v, o[D] = z + 1, b = j;
        break;
      }
      m += 1;
    }
    if (!b) {
      let j = F(a, r);
      for (; qe(j); ) j = F(j, 1);
      b = j;
    }
    i.push({ item: f, date: b });
  }
  return { suggestions: i, fixed: n };
}
const Ct = {
  [K.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [K.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function Se({ item: t, onSelect: a, showDate: s = !1 }) {
  const r = P[t.source], l = Ct[t.risk];
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
            s ? N.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
            t.subtitle,
            t.assigneeName,
            t.amount != null ? N.money(t.amount, t.currency) : null
          ].filter(Boolean).join(" · ") || (r ? r.label : "") })
        ] }),
        l && /* @__PURE__ */ e.jsx("span", { className: y("shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold", l.className), children: l.label })
      ]
    }
  );
}
function Tt({ items: t, today: a, onSelectItem: s, onSmartDefer: r }) {
  const { overdue: l, days: x } = et(t, a);
  return l.length === 0 && x.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
    oe,
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
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: l.map((d) => /* @__PURE__ */ e.jsx(Se, { item: d, onSelect: s, showDate: !0 }, d.key)) })
    ] }),
    x.map((d) => /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: y(
        "flex items-center justify-between border-b border-subtle px-3 py-2",
        d.isToday && "border-b-accent"
      ), children: [
        /* @__PURE__ */ e.jsxs("span", { className: y(
          "text-[11px] font-bold uppercase tracking-wider",
          d.isToday ? "text-accent" : "text-text-tertiary"
        ), children: [
          N.dayTitle(d.date),
          d.isToday ? " · Bugün" : ""
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: d.items.length })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: d.items.map((c) => /* @__PURE__ */ e.jsx(Se, { item: c, onSelect: s }, c.key)) })
    ] }, d.key))
  ] });
}
function Et({ dayKey: t, items: a, capacity: s, onSelectItem: r, onClose: l }) {
  const x = /* @__PURE__ */ new Date(`${t}T00:00:00`), d = fe(a), c = s && d > s, p = a.reduce((n, u) => (n[u.source] = (n[u.source] ?? 0) + 1, n), {});
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: N.dayTitle(x) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(p).length === 0 ? "Planlanmış öğe yok" : Object.entries(p).map(([n, u]) => {
          var o;
          return `${u} ${((o = P[n]) == null ? void 0 : o.plural) ?? "öğe"}`;
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
    s && d > 0 && /* @__PURE__ */ e.jsxs("div", { className: y(
      "flex items-center justify-between border-b px-3 py-2 text-[11.5px]",
      c ? "border-negative-100 bg-negative-50 text-negative-700" : "border-subtle text-text-secondary"
    ), children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-semibold", children: c ? "Kapasite aşımı" : "Gün yükü" }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono tabular-nums", children: [
        N.hours(d),
        " / ",
        N.hours(s)
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "flex-1 overflow-y-auto p-1", children: a.length === 0 ? /* @__PURE__ */ e.jsx(
      oe,
      {
        compact: !0,
        icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-day" }),
        title: "Bu gün boş",
        description: "Bu güne düşen bir öğe yok."
      }
    ) : a.map((n) => /* @__PURE__ */ e.jsx(Se, { item: n, onSelect: r }, n.key)) })
  ] });
}
const $t = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], Rt = {
  [K.OVERDUE]: {
    pill: "bg-negative-50 text-negative-700",
    /* çapraz tarama */
    pattern: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,.07) 3px, rgba(0,0,0,.07) 5px)"
  },
  [K.DUE_TODAY]: {
    pill: "bg-warning-50 text-warning-700",
    /* dikey çizgi */
    pattern: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,.06) 4px, rgba(0,0,0,.06) 5px)"
  }
};
function At({ item: t, onSelect: a, onDragStart: s, isPending: r, hasError: l }) {
  const x = P[t.source], d = Rt[t.risk], c = t.canReschedule && !t.isDone;
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: c,
      onDragStart: c ? (p) => {
        p.stopPropagation(), p.dataTransfer.effectAllowed = "move", p.dataTransfer.setData("text/plain", t.key), s(t);
      } : void 0,
      onClick: (p) => {
        p.stopPropagation(), a(t);
      },
      title: t.subtitle ? `${t.title} — ${t.subtitle}` : t.title,
      style: d ? { backgroundImage: d.pattern } : void 0,
      className: y(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        d ? d.pill : "bg-neutral-subtle text-text-primary",
        t.isDone && "line-through opacity-65",
        c && "cursor-grab active:cursor-grabbing",
        /* Hata SATIRDA kalır — toast'a kaçmaz. */
        l && "ring-1 ring-negative-500",
        r && "opacity-60"
      ),
      children: [
        r ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin shrink-0 text-[9px]", "aria-hidden": "true" }) : x && /* @__PURE__ */ e.jsx("i", { className: y("fa shrink-0 text-[9px] opacity-70", x.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: t.title }),
        l && /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation ms-auto shrink-0 text-[9px]", "aria-hidden": "true" })
      ]
    }
  );
}
function zt({ summary: t, onSelect: a }) {
  const s = P[t.source];
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
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: jt(t) })
      ]
    }
  );
}
function Kt({ load: t, capacity: a }) {
  if (!a || t <= 0) return null;
  const s = Math.min(t / a, 1), r = t > a;
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "mt-auto flex h-[3px] w-full overflow-hidden rounded-full bg-neutral-subtle",
      title: `Gün yükü ${N.hours(t)} / kapasite ${N.hours(a)}`,
      "aria-label": `Gün yükü ${N.hours(t)}, kapasite ${N.hours(a)}`,
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
function Ot({
  month: t,
  byDay: a,
  today: s,
  capacity: r,
  onSelectItem: l,
  onSelectDay: x,
  selectedDay: d,
  onDropItem: c,
  pending: p = {},
  errors: n = {},
  focusedDay: u,
  onFocusDay: o,
  onNavigate: i
}) {
  const m = Je(t), f = C(s), [b, j] = ue.useState(null), [D, O] = ue.useState(null), z = ue.useRef(null), v = u ?? d ?? f, h = (w) => {
    const S = addDays(/* @__PURE__ */ new Date(`${v}T00:00:00`), w);
    m.some((M) => C(M) === C(S)) || i == null || i(S), o == null || o(C(S));
  }, I = (w) => {
    const S = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[w.key];
    if (S) {
      w.preventDefault(), h(S);
      return;
    }
    (w.key === "Enter" || w.key === " ") && (w.preventDefault(), x(v));
  };
  return ue.useEffect(() => {
    var S, M;
    const w = (S = z.current) == null ? void 0 : S.querySelector(`[data-day="${v}"]`);
    w && ((M = z.current) != null && M.contains(document.activeElement)) && w.focus();
  }, [v]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: $t.map((w, S) => /* @__PURE__ */ e.jsx(
      "div",
      {
        className: y(
          "px-2.5 py-2 text-right text-[10.5px] font-bold uppercase tracking-wider",
          S > 4 ? "text-text-tertiary opacity-70" : "text-text-tertiary"
        ),
        children: w
      },
      w
    )) }),
    /* @__PURE__ */ e.jsx(
      "div",
      {
        ref: z,
        role: "grid",
        "aria-label": "Ay takvimi",
        tabIndex: 0,
        onKeyDown: I,
        className: "grid grid-cols-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
        children: m.map((w) => {
          const S = C(w), M = a[S] ?? [], { pills: Z, summaries: he } = vt(M), V = fe(M), L = w.getMonth() !== t.getMonth(), ee = S === f, X = S === d;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              role: "gridcell",
              "data-day": S,
              tabIndex: S === v ? 0 : -1,
              "aria-selected": X,
              "aria-label": `${N.dayTitle(w)}${M.length ? `, ${M.length} öğe` : ", boş"}`,
              onClick: () => {
                o == null || o(S), x(S);
              },
              onDragOver: b ? (T) => {
                T.preventDefault(), T.dataTransfer.dropEffect = "move", D !== S && O(S);
              } : void 0,
              onDragLeave: b ? () => O((T) => T === S ? null : T) : void 0,
              onDrop: b ? (T) => {
                T.preventDefault();
                const Q = b;
                j(null), O(null), Q && Q.date.slice(0, 10) !== S && c(Q, /* @__PURE__ */ new Date(`${S}T00:00:00`));
              } : void 0,
              className: y(
                "flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5",
                "transition-colors duration-fast last:border-r-0 hover:bg-surface-hover",
                L ? "bg-surface-sunken" : "bg-surface-base",
                X && "ring-2 ring-inset ring-border-focus",
                D === S && "bg-primary-subtle ring-2 ring-inset ring-accent"
              ),
              children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                  V > 0 && r && V > r && /* @__PURE__ */ e.jsx("span", { className: "rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: N.hours(V) }),
                  /* @__PURE__ */ e.jsx(
                    "span",
                    {
                      className: y(
                        "ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11.5px] font-semibold leading-none tabular-nums",
                        ee && "bg-accent text-white",
                        !ee && L && "text-text-tertiary opacity-60",
                        !ee && !L && "text-text-secondary"
                      ),
                      children: w.getDate()
                    }
                  )
                ] }),
                Z.map((T) => /* @__PURE__ */ e.jsx(
                  At,
                  {
                    item: T,
                    onSelect: l,
                    onDragStart: j,
                    isPending: !!p[T.key],
                    hasError: !!n[T.key]
                  },
                  T.key
                )),
                he.map((T) => /* @__PURE__ */ e.jsx(
                  zt,
                  {
                    summary: T,
                    onSelect: () => x(S)
                  },
                  `${S}-${T.source}`
                )),
                /* @__PURE__ */ e.jsx(Kt, { load: V, capacity: r })
              ]
            },
            S
          );
        })
      }
    )
  ] });
}
const It = { 1: "Google", 2: "Outlook", 3: "iCloud" };
function Pt({
  sources: t,
  counts: a,
  enabled: s,
  onToggle: r,
  compact: l = !1,
  externalAccounts: x = [],
  externalLoading: d = !1,
  onOpenSync: c
}) {
  const p = (t ?? []).filter((n) => n.isAvailable);
  return p.length === 0 ? null : /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Takvim kaynakları",
      className: y(
        "flex flex-col gap-1 rounded-card border border-subtle bg-surface-base p-2",
        l ? "w-[60px] items-center" : "w-full"
      ),
      children: [
        !l && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Kaynaklar" }),
        p.map((n) => {
          const u = P[n.source];
          if (!u) return null;
          const o = s.has(n.source), i = a[n.source] ?? 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": o,
              title: l ? `${u.label} — ${i} öğe` : void 0,
              onClick: () => r(n.source),
              className: y(
                "group flex items-center rounded-md text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                l ? "relative h-11 w-11 justify-center" : "gap-2.5 px-2 py-2",
                o ? "text-text-primary" : "text-text-tertiary",
                "hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: y(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px]",
                      o ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: y("fa", u.icon) })
                  }
                ),
                l ? i > 0 && /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: y(
                      "absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-[9.5px] font-bold leading-4",
                      o ? "bg-accent text-white" : "bg-neutral-200 text-text-tertiary"
                    ),
                    children: i
                  }
                ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                  /* @__PURE__ */ e.jsx("span", { className: y("flex-1 truncate text-[12.5px] font-medium", !o && "line-through decoration-1"), children: u.label }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: i })
                ] })
              ]
            },
            n.source
          );
        }),
        !l && onToggleTeam && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": teamOpen,
              onClick: onToggleTeam,
              className: y(
                "mt-2 flex items-center gap-2 border-t border-subtle px-2 pb-1 pt-2 text-left",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              ),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Ekip katmanı" }),
                /* @__PURE__ */ e.jsx(
                  "i",
                  {
                    className: y("fa text-[11px]", teamOpen ? "fa-toggle-on text-accent" : "fa-toggle-off text-text-tertiary"),
                    "aria-hidden": "true"
                  }
                )
              ]
            }
          ),
          teamContent
        ] }),
        !l && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex items-center justify-between border-t border-subtle px-2 pb-1 pt-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Dış takvimler" }),
            c && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: c,
                className: "rounded p-1 text-[11px] font-medium text-text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                children: "Ayarlar"
              }
            )
          ] }),
          x.length === 0 && !d && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 text-[11.5px] text-text-tertiary", children: "Bağlı takvim yok." }),
          d && x.length === 0 && /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1 text-[11.5px] text-text-tertiary", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
            "senkronize ediliyor…"
          ] }),
          x.map((n) => /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: y(
                "flex items-start gap-2 rounded-md px-2 py-1.5",
                n.error && "bg-negative-50"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: y(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px]",
                      n.error ? "bg-negative-100 text-negative-700" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: y("fa", n.error ? "fa-triangle-exclamation" : "fa-calendar-days") })
                  }
                ),
                /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: It[n.provider] ?? "Takvim" }),
                  /* @__PURE__ */ e.jsx("span", { className: y(
                    "block truncate text-[10.5px]",
                    n.error ? "text-negative-700" : "text-text-tertiary"
                  ), children: n.error ?? `${n.email} · ${n.eventCount} etkinlik` }),
                  n.error && /* @__PURE__ */ e.jsx("a", { href: "/Calendars", className: "text-[10.5px] font-semibold text-text-link hover:underline", children: "Yeniden bağla" })
                ] })
              ]
            },
            n.accountId
          ))
        ] })
      ]
    }
  );
}
const Mt = { month: "Ay", week: "Hafta", day: "Gün", agenda: "Ajanda" };
function Ft({ title: t, view: a, onView: s, onPrev: r, onNext: l, onToday: x, overloadDays: d, onHelp: c }) {
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
          onClick: l,
          "aria-label": "Sonrakine git",
          className: "h-9 w-9 rounded-r-md border border-l-0 border-default bg-surface-base text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-chevron-right", "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx($, { variant: "outline", size: "sm", onClick: x, children: "Bugün" }),
    /* @__PURE__ */ e.jsx("h2", { className: "ml-1 text-[17px] font-semibold capitalize tracking-tight text-text-primary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
      d > 0 && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "rounded-md bg-negative-50 px-2 py-1 text-[11.5px] font-semibold text-negative-700",
          title: "Günlük kapasitenizi aşan gün sayısı",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
            d,
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
      c && /* @__PURE__ */ e.jsx(
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
      /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(Mt).map(([n, u]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": a === n,
          onClick: () => s(n),
          className: y(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            a === n ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: u
        },
        n
      )) })
    ] })
  ] });
}
const H = 44, Lt = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], _t = {
  [K.OVERDUE]: "bg-negative-50 text-negative-700",
  [K.DUE_TODAY]: "bg-warning-50 text-warning-700"
};
function qt({ load: t, capacity: a }) {
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
function Yt({ days: t, byDay: a, today: s, capacity: r, onSelectItem: l, onSelectDay: x, selectedDay: d }) {
  const c = C(s), p = g.useRef(null), [n, u] = g.useState(() => {
    const v = /* @__PURE__ */ new Date();
    return v.getHours() * 60 + v.getMinutes();
  });
  g.useEffect(() => {
    const v = setInterval(() => {
      const h = /* @__PURE__ */ new Date();
      u(h.getHours() * 60 + h.getMinutes());
    }, 6e4);
    return () => clearInterval(v);
  }, []);
  const o = t.map(C), i = {}, m = {};
  for (const v of o) {
    const h = a[v] ?? [];
    i[v] = h.filter(_e), m[v] = h.filter((I) => !_e(I));
  }
  const f = o.flatMap((v) => i[v]), { start: b, end: j } = St(f), D = Array.from({ length: j - b }, (v, h) => b + h), O = (j - b) * H, z = o.includes(c) && n >= b * 60 && n <= j * 60;
  return g.useEffect(() => {
    if (!z || !p.current) return;
    const v = (n - b * 60) / 60 * H;
    p.current.scrollTop = Math.max(0, v - 120);
  }, [z, b]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "grid border-b border-default bg-surface-raised",
        style: { gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))` },
        children: [
          /* @__PURE__ */ e.jsx("div", {}),
          t.map((v) => {
            const h = C(v), I = fe(a[h] ?? []), w = h === c;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => x(h),
                className: y(
                  "border-l border-subtle px-2 py-2 text-left transition-colors duration-fast hover:bg-surface-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
                  d === h && "bg-primary-subtle"
                ),
                children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "flex items-baseline gap-1.5", children: [
                    /* @__PURE__ */ e.jsx("span", { className: y(
                      "text-[10.5px] font-bold uppercase tracking-wider",
                      w ? "text-accent" : "text-text-tertiary"
                    ), children: Lt[(v.getDay() + 6) % 7] }),
                    /* @__PURE__ */ e.jsx("span", { className: y(
                      "font-mono text-[13px] font-semibold tabular-nums",
                      w ? "text-accent" : "text-text-primary"
                    ), children: v.getDate() }),
                    r && I > r && /* @__PURE__ */ e.jsx("span", { className: "ms-auto rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: N.hours(I) })
                  ] }),
                  /* @__PURE__ */ e.jsx(qt, { load: I, capacity: r })
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
          o.map((v) => /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-[46px] flex-col gap-[3px] border-l border-subtle p-1", children: [
            m[v].slice(0, 4).map((h) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => l(h),
                title: h.title,
                className: y(
                  "flex w-full items-center gap-1 truncate rounded-[5px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                  _t[h.risk] ?? "bg-neutral-subtle text-text-primary",
                  h.isDone && "line-through opacity-65"
                ),
                children: [
                  P[h.source] && /* @__PURE__ */ e.jsx("i", { className: y("fa shrink-0 text-[9px] opacity-70", P[h.source].icon), "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "truncate", children: h.title })
                ]
              },
              h.key
            )),
            m[v].length > 4 && /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => x(v),
                className: "px-1.5 text-left text-[10.5px] font-medium text-text-tertiary hover:text-text-primary",
                children: [
                  "+",
                  m[v].length - 4,
                  " öğe"
                ]
              }
            )
          ] }, v))
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { ref: p, className: "max-h-[520px] overflow-y-auto", children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "relative grid",
          style: {
            gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))`,
            height: `${O}px`
          },
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "relative", children: D.map((v, h) => /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: "absolute right-1.5 -translate-y-1/2 font-mono text-[10px] tabular-nums text-text-tertiary",
                style: { top: `${h * H}px` },
                children: [
                  String(v).padStart(2, "0"),
                  ":00"
                ]
              },
              v
            )) }),
            o.map((v) => /* @__PURE__ */ e.jsxs("div", { className: "relative border-l border-subtle", children: [
              D.map((h, I) => /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "absolute inset-x-0 border-t border-subtle",
                  style: { top: `${I * H}px` }
                },
                h
              )),
              i[v].map((h) => {
                const I = me(h.startTime), w = h.endTime ? me(h.endTime) : I + 60, S = (I - b * 60) / 60 * H, M = Math.max((w - I) / 60 * H, 18);
                return /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => l(h),
                    title: `${h.title} · ${ke(h.startTime)}`,
                    style: {
                      top: `${S}px`,
                      height: `${M}px`,
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
                        ke(h.startTime),
                        h.endTime ? `–${ke(h.endTime)}` : ""
                      ] })
                    ]
                  },
                  h.key
                );
              }),
              z && v === c && /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "pointer-events-none absolute inset-x-0 z-10 border-t-2 border-negative",
                  style: { top: `${(n - b * 60) / 60 * H}px` },
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ e.jsx("span", { className: "absolute -left-1 -top-1 h-2 w-2 rounded-full bg-negative" })
                }
              )
            ] }, v))
          ]
        }
      ),
      f.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "border-t border-subtle px-3 py-2 text-[11.5px] text-text-tertiary", children: "Saat ızgarası dış takvim etkinliklerini gösterir. Bağlı bir takvim yoksa boş kalır." })
    ] })
  ] });
}
function Bt({ item: t }) {
  var u;
  const [a, s] = g.useState(""), [r, l] = g.useState(() => /* @__PURE__ */ new Set()), x = t.description ?? t.subtitle ?? "", d = U({
    queryKey: ["calendar", "projects-lookup"],
    queryFn: () => R.get("/api/app/task/projects-lookup"),
    staleTime: 10 * 6e4
  }), c = _({
    mutationFn: async () => {
      const o = new FormData();
      o.append("file", new Blob([`${t.title}

${x}`], { type: "text/plain" }), "toplanti-notlari.txt");
      const i = await fetch(`/api/ai-task-generator/parse?projectId=${a}`, {
        method: "POST",
        body: o,
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });
      if (!i.ok) throw new Error("Notlardan görev çıkarılamadı.");
      return i.json();
    },
    onSuccess: (o) => l(new Set(((o == null ? void 0 : o.suggestions) ?? []).map((i, m) => m)))
  }), p = _({
    mutationFn: () => {
      var o;
      return R.post("/api/ai-task-generator/create-tasks", {
        projectId: a,
        approvedTasks: (((o = c.data) == null ? void 0 : o.suggestions) ?? []).filter((i, m) => r.has(m))
      });
    }
  }), n = ((u = c.data) == null ? void 0 : u.suggestions) ?? [];
  return /* @__PURE__ */ e.jsxs("section", { className: "border-t border-subtle px-4 py-3", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Toplantıdan görev" }),
    !x && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[11.5px] text-text-tertiary", children: "Bu etkinlikte not yok — çıkarılacak aksiyon maddesi bulunamaz." }),
    x && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs(
        "select",
        {
          value: a,
          onChange: (o) => s(o.target.value),
          "aria-label": "Görevlerin ekleneceği proje",
          className: "mt-1.5 w-full rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "Proje seçin…" }),
            (d.data ?? []).map((o) => /* @__PURE__ */ e.jsx("option", { value: o.id, children: o.name }, o.id))
          ]
        }
      ),
      /* @__PURE__ */ e.jsx(
        $,
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
      n.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", children: [
        n.map((o, i) => /* @__PURE__ */ e.jsxs("label", { className: "flex cursor-pointer items-start gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: r.has(i),
              onChange: () => l((m) => {
                const f = new Set(m);
                return f.has(i) ? f.delete(i) : f.add(i), f;
              }),
              className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[12px] text-text-primary", children: o.title })
        ] }, `${o.title}-${i}`)),
        /* @__PURE__ */ e.jsx(
          $,
          {
            size: "sm",
            variant: "primary",
            className: y("mt-2"),
            disabled: r.size === 0 || p.isPending || p.isSuccess,
            onClick: () => p.mutate(),
            children: p.isSuccess ? `${p.data} görev eklendi` : p.isPending ? "Ekleniyor…" : `${r.size} görev olarak ekle`
          }
        )
      ] })
    ] })
  ] });
}
const Gt = {
  [K.OVERDUE]: { text: "Gecikmiş", cls: "bg-negative-50 text-negative-700" },
  [K.DUE_TODAY]: { text: "Bugün son gün", cls: "bg-warning-50 text-warning-700" }
};
function se({ label: t, children: a }) {
  return a ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-subtle py-2.5 last:border-b-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11.5px] font-medium text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "min-w-0 text-right text-[12.5px] text-text-primary", children: a })
  ] }) : null;
}
function Ut({ item: t, capacity: a, onClose: s, onReschedule: r, onComplete: l, isPending: x, error: d, onRetry: c }) {
  const [p, n] = g.useState(() => t.date.slice(0, 10)), u = P[t.source], o = Gt[t.risk], i = t.date.slice(0, 10);
  g.useEffect(() => n(i), [i]);
  const m = () => {
    !p || p === i || r(t, /* @__PURE__ */ new Date(`${p}T00:00:00`));
  };
  return /* @__PURE__ */ e.jsx(ie, { open: !0, onOpenChange: (f) => {
    f || s();
  }, children: /* @__PURE__ */ e.jsxs(le, { side: "right", title: t.title, className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md bg-neutral-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary", children: [
          u && /* @__PURE__ */ e.jsx("i", { className: y("fa text-[10px]", u.icon), "aria-hidden": "true" }),
          u == null ? void 0 : u.label
        ] }),
        o && /* @__PURE__ */ e.jsx("span", { className: y("rounded-md px-2 py-1 text-[11px] font-bold", o.cls), children: o.text }),
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
    d && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-negative-100 bg-negative-50 px-4 py-2.5 text-[12px] text-negative-700", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: d }),
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: c, className: "font-semibold underline", children: "Yeniden dene" })
    ] }),
    x && /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle px-4 py-2 text-[12px] text-text-tertiary", "aria-live": "polite", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "kaydediliyor…"
    ] }),
    t.canReschedule && !t.isDone && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs($, { size: "sm", variant: "secondary", onClick: () => l(t), children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-check me-1.5", "aria-hidden": "true" }),
        "Tamamla"
      ] }),
      /* @__PURE__ */ e.jsx(
        $,
        {
          size: "sm",
          variant: "outline",
          onClick: () => r(t, F(/* @__PURE__ */ new Date(`${i}T00:00:00`), 1)),
          children: "+1 gün ertele"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-2", children: [
      /* @__PURE__ */ e.jsx(se, { label: "Son tarih", children: t.canReschedule ? /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "date",
            value: p,
            onChange: (f) => n(f.target.value),
            className: "rounded-md border border-default bg-surface-base px-2 py-1 text-[12.5px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": "Son tarih"
          }
        ),
        p !== i && /* @__PURE__ */ e.jsx($, { size: "sm", variant: "primary", onClick: m, children: "Uygula" })
      ] }) : /* @__PURE__ */ e.jsxs("span", { className: "text-text-secondary", children: [
        N.dayTitle(/* @__PURE__ */ new Date(`${i}T00:00:00`)),
        /* @__PURE__ */ e.jsx("span", { className: "ml-1.5 text-text-tertiary", children: "· takvimden değiştirilemez" })
      ] }) }),
      /* @__PURE__ */ e.jsx(se, { label: "Bağlam", children: t.subtitle }),
      /* @__PURE__ */ e.jsx(se, { label: "Atanan", children: t.assigneeName }),
      /* @__PURE__ */ e.jsx(se, { label: "Tutar", children: t.amount != null ? N.money(t.amount, t.currency) : null }),
      /* @__PURE__ */ e.jsx(se, { label: "Gün yükü", children: t.loadHours != null ? `${N.hours(t.loadHours)}${a ? ` / ${N.hours(a)} kapasite` : ""}` : null })
    ] }),
    t.source === 7 && /* @__PURE__ */ e.jsx(Bt, { item: t }),
    t.href && /* @__PURE__ */ e.jsx("footer", { className: "border-t border-subtle px-4 py-3", children: /* @__PURE__ */ e.jsxs(
      "a",
      {
        href: t.href,
        className: "text-[12.5px] font-medium text-text-link hover:underline",
        children: [
          u == null ? void 0 : u.label,
          " ekranında aç",
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right ms-1.5 text-[10px]", "aria-hidden": "true" })
        ]
      }
    ) })
  ] }) });
}
const tt = ["calendar", "sync-settings"];
function Qt(t) {
  return U({
    queryKey: tt,
    queryFn: () => R.get("/api/app/calendar/sync-settings"),
    enabled: t,
    staleTime: 3e4
  });
}
function Ht() {
  const t = W();
  return _({
    mutationFn: (a) => R.post("/api/app/calendar/sync-rules", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: tt }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
const at = ["calendar", "ical-feed"], Ee = ["calendar", "ical-subscriptions"];
function Wt(t) {
  return U({
    queryKey: at,
    /* GetOrCreate: bağlantı yoksa ilk açılışta üretilir. */
    queryFn: () => R.post("/api/app/ical-feed/ensure", {}),
    enabled: t,
    staleTime: 1 / 0
  });
}
function Vt() {
  const t = W();
  return _({
    mutationFn: () => R.post("/api/app/ical-feed/regenerate", {}),
    onSuccess: (a) => t.setQueryData(at, a)
  });
}
function Xt(t) {
  return U({
    queryKey: Ee,
    queryFn: () => R.get("/api/app/ical-subscription"),
    enabled: t,
    staleTime: 3e4
  });
}
function Jt() {
  const t = W();
  return _({
    mutationFn: (a) => R.post("/api/app/ical-subscription", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Ee }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function Zt() {
  const t = W();
  return _({
    mutationFn: (a) => R.delete(`/api/app/ical-subscription/${a}`),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Ee }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function ea() {
  return _({
    mutationFn: (t) => R.post(`/api/app/ical-subscription/probe?url=${encodeURIComponent(t)}`, {})
  });
}
const ta = {
  1: { label: "Google Calendar", icon: "fa-google", brand: "bg-[#ea4335]" },
  2: { label: "Microsoft Outlook", icon: "fa-windows", brand: "bg-[#0078d4]" },
  3: { label: "iCloud", icon: "fa-apple", brand: "bg-neutral-700" }
}, aa = {
  0: { title: "Son değişen kazanır", desc: "İki taraf da düzenlenirse en son yapılan değişiklik uygulanır; ekranda geri alma şeridi çıkar." },
  1: { title: "APYA her zaman kazanır", desc: "Dış takvim salt-okunur ayna olur; dışarıdaki düzenleme geri alınır." }
}, Ye = {
  0: { icon: "fa-arrow-up-from-bracket", cls: "text-text-tertiary" },
  1: { icon: "fa-code-merge", cls: "text-warning-700" },
  2: { icon: "fa-triangle-exclamation", cls: "text-negative-700" }
};
function $e(t) {
  if (!t) return "hiç";
  const a = Math.round((Date.now() - new Date(t).getTime()) / 6e4);
  return a < 1 ? "az önce" : a < 60 ? `${a} dk önce` : a < 1440 ? `${Math.round(a / 60)} sa önce` : N.dayShort(new Date(t));
}
function sa({ account: t, onSave: a, saving: s }) {
  const r = ta[t.provider] ?? { label: "Takvim", icon: "fa-calendar", brand: "bg-neutral-700" }, [l, x] = g.useState(() => new Set(t.syncSources ?? [])), [d, c] = g.useState(t.conflictRule ?? 0), [p, n] = g.useState(t.isSyncEnabled);
  g.useEffect(() => {
    x(new Set(t.syncSources ?? [])), c(t.conflictRule ?? 0), n(t.isSyncEnabled);
  }, [t]);
  const u = p !== t.isSyncEnabled || d !== t.conflictRule || l.size !== (t.syncSources ?? []).length || [...l].some((i) => !(t.syncSources ?? []).includes(i)), o = (i) => x((m) => {
    const f = new Set(m);
    return f.has(i) ? f.delete(i) : f.add(i), f;
  });
  return /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-3 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: y("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", r.brand), "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("i", { className: y("fab", r.icon) }) }),
      /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-semibold text-text-primary", children: r.label }),
        /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[11.5px] text-text-tertiary", children: [
          t.externalEmail,
          " · son senkron ",
          $e(t.lastSyncTime)
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("label", { className: "flex shrink-0 items-center gap-1.5 text-[11.5px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: p,
            onChange: (i) => n(i.target.checked),
            className: "h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
          }
        ),
        "Açık"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Bu hesaba ne gitsin?" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Ne.map((i) => {
        var f, b;
        const m = l.has(i);
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": m,
            onClick: () => o(i),
            className: y(
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              m ? "border-accent bg-primary-subtle text-accent" : "border-subtle bg-surface-base text-text-tertiary hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: y("fa text-[10px]", (f = P[i]) == null ? void 0 : f.icon), "aria-hidden": "true" }),
              (b = P[i]) == null ? void 0 : b.label
            ]
          },
          i
        );
      }) }),
      l.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-text-tertiary", children: "Hiçbiri seçili değil — yalnız görevler gönderilir." }),
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Çakışma kuralı" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: Object.entries(aa).map(([i, m]) => {
        const f = Number(i), b = d === f;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => c(f),
            className: y(
              "rounded-md border px-2.5 py-2 text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              b ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("span", { className: y("block text-[12px] font-semibold", b ? "text-accent" : "text-text-primary"), children: m.title }),
              /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] leading-snug text-text-tertiary", children: m.desc })
            ]
          },
          i
        );
      }) }),
      u && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          $,
          {
            size: "sm",
            variant: "primary",
            disabled: s,
            onClick: () => a({
              accountId: t.id,
              isSyncEnabled: p,
              syncSources: [...l],
              syncProjectIds: t.syncProjectIds ?? [],
              conflictRule: d
            }),
            children: s ? "Kaydediliyor…" : "Kuralları kaydet"
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Kaydedilmemiş değişiklik var" })
      ] })
    ] })
  ] });
}
const ra = [
  { value: 15, label: "15 dk" },
  { value: 60, label: "1 saat" },
  { value: 360, label: "6 saat" },
  { value: 1440, label: "Günlük" }
];
function na({ open: t }) {
  var D, O, z, v;
  const a = Wt(t), s = Vt(), r = Xt(t), l = Jt(), x = Zt(), d = ea(), [c, p] = g.useState(""), [n, u] = g.useState(""), [o, i] = g.useState(60), [m, f] = g.useState(!1), b = (D = a.data) != null && D.path ? `${window.location.origin}${a.data.path}` : "", j = async () => {
    try {
      await navigator.clipboard.writeText(b), f(!0), setTimeout(() => f(!1), 2e3);
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
            value: b,
            "aria-label": "iCal abonelik bağlantısı",
            className: "min-w-0 flex-1 truncate rounded-md border border-default bg-surface-sunken px-2 py-1 font-mono text-[11px] text-text-secondary"
          }
        ),
        /* @__PURE__ */ e.jsx($, { size: "sm", variant: "outline", onClick: j, disabled: !b, children: m ? "Kopyalandı" : "Kopyala" })
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
            onChange: (h) => {
              p(h.target.value), d.reset();
            },
            placeholder: "https://…/basic.ics",
            "aria-label": "Takvim bağlantısı",
            className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          }
        ),
        ((O = d.data) == null ? void 0 : O.isValid) && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-positive-700", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-check me-1", "aria-hidden": "true" }),
          "Bağlantı doğrulandı · ",
          d.data.eventCount,
          " etkinlik bulundu"
        ] }),
        d.data && !d.data.isValid && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-negative-700", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
          d.data.error
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              value: n,
              onChange: (h) => u(h.target.value),
              placeholder: ((z = d.data) == null ? void 0 : z.suggestedName) || "Görünen ad",
              "aria-label": "Görünen ad",
              className: "min-w-0 flex-1 rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              value: o,
              onChange: (h) => i(Number(h.target.value)),
              "aria-label": "Yenileme sıklığı",
              className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
              children: ra.map((h) => /* @__PURE__ */ e.jsx("option", { value: h.value, children: h.label }, h.value))
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(
            $,
            {
              size: "sm",
              variant: "outline",
              disabled: !c || d.isPending,
              onClick: () => d.mutate(c),
              children: d.isPending ? "Deneniyor…" : "Bağlantıyı dene"
            }
          ),
          /* @__PURE__ */ e.jsx(
            $,
            {
              size: "sm",
              variant: "primary",
              disabled: !c || l.isPending,
              onClick: () => l.mutate(
                { url: c, displayName: n, color: "accent", refreshMinutes: o },
                { onSuccess: () => {
                  p(""), u(""), d.reset();
                } }
              ),
              children: l.isPending ? "Ekleniyor…" : "Takvimi ekle"
            }
          )
        ] }),
        l.isError && /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-negative-700", children: ((v = l.error) == null ? void 0 : v.message) || "Takvim eklenemedi." }),
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
          ), children: h.lastError ?? `${h.lastEventCount} etkinlik · ${$e(h.lastFetchedAt)} çekildi` })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => x.mutate(h.id),
            className: "shrink-0 rounded p-1 text-[11px] text-text-tertiary hover:text-negative-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": `${h.displayName} aboneliğini kaldır`,
            children: "Kaldır"
          }
        )
      ] }, h.id)) })
    ] })
  ] });
}
function ia({ open: t, onClose: a }) {
  const { data: s, isPending: r } = Qt(t), l = Ht();
  return /* @__PURE__ */ e.jsx(ie, { open: t, onOpenChange: (x) => {
    x || a();
  }, children: /* @__PURE__ */ e.jsxs(le, { side: "right", title: "Takvim senkronizasyonu", className: "w-full max-w-[440px] p-0", children: [
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
      /* @__PURE__ */ e.jsx(re, { height: 92 }),
      /* @__PURE__ */ e.jsx(re, { height: 92 })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", children: [
      ((s == null ? void 0 : s.accounts) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-4", children: /* @__PURE__ */ e.jsx(
        oe,
        {
          compact: !0,
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
          title: "Bağlı hesap yok",
          description: "Google veya Outlook bağlayınca size atanan tarihli öğeler oraya etkinlik olarak yazılır.",
          action: /* @__PURE__ */ e.jsx($, { size: "sm", variant: "outline", onClick: () => {
            window.location.href = "/Calendars/SimulateAuth?provider=1";
          }, children: "Hesap bağla" })
        }
      ) }) : s.accounts.map((x) => /* @__PURE__ */ e.jsx(
        sa,
        {
          account: x,
          saving: l.isPending,
          onSave: (d) => l.mutate(d)
        },
        x.id
      )),
      /* @__PURE__ */ e.jsx(na, { open: t }),
      /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
        /* @__PURE__ */ e.jsx("header", { className: "border-b border-subtle px-3 py-2", children: /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-semibold text-text-primary", children: "Senkron günlüğü" }) }),
        /* @__PURE__ */ e.jsx("div", { className: "px-3 py-2", children: ((s == null ? void 0 : s.log) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-2 text-[11.5px] text-text-tertiary", children: "Henüz senkron kaydı yok." }) : s.log.map((x) => {
          const d = Ye[x.kind] ?? Ye[0];
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
            /* @__PURE__ */ e.jsx("i", { className: y("fa mt-0.5 shrink-0 text-[11px]", d.icon, d.cls), "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[11.5px] leading-snug text-text-secondary", children: x.message }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: $e(x.occurredAt) })
          ] }, x.id);
        }) })
      ] })
    ] }) })
  ] }) });
}
const st = ["calendar", "preferences"];
function la() {
  return U({
    queryKey: st,
    queryFn: () => R.get("/api/app/calendar/preferences"),
    staleTime: 5 * 6e4
  });
}
function oa() {
  const t = W();
  return _({
    mutationFn: (a) => R.post("/api/app/calendar/preferences", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: st }), t.invalidateQueries({ queryKey: ["calendar", "feed"] });
    }
  });
}
function ca() {
  const t = W();
  return _({
    mutationFn: (a) => R.post("/api/app/calendar/bulk-reschedule", a),
    onSettled: () => t.invalidateQueries({ queryKey: ["calendar", "feed"] })
  });
}
function da({ open: t, items: a, today: s, capacity: r, onClose: l }) {
  const { suggestions: x, fixed: d } = g.useMemo(
    () => Dt(a, { today: s, capacity: r }),
    [a, s, r]
  ), [c, p] = g.useState(() => new Set(x.map((b) => b.item.key))), n = ca(), u = n.data ?? [], o = new Map(u.filter((b) => !b.succeeded).map((b) => [b.sourceId, b.error])), i = (b) => p((j) => {
    const D = new Set(j);
    return D.has(b) ? D.delete(b) : D.add(b), D;
  }), m = x.filter((b) => c.has(b.item.key)), f = () => {
    n.mutate(
      m.map((b) => ({
        source: b.item.source,
        sourceId: b.item.sourceId,
        newDate: C(b.date)
      })),
      {
        onSuccess: (b) => {
          (b ?? []).every((j) => j.succeeded) && l();
        }
      }
    );
  };
  return /* @__PURE__ */ e.jsx(ie, { open: t, onOpenChange: (b) => {
    b || l();
  }, children: /* @__PURE__ */ e.jsxs(le, { side: "right", title: "Akıllı erteleme", className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-semibold text-text-primary", children: "Akıllı erteleme" }),
        /* @__PURE__ */ e.jsxs("p", { className: "mt-0.5 text-[11.5px] leading-snug text-text-tertiary", children: [
          x.length > 0 ? `${x.length} gecikmiş öğe için boş günlere dağıtılmış tarihler önerildi.` : "Ertelenecek gecikmiş öğe yok.",
          r ? ` Günlük kapasite ${N.hours(r)}.` : ""
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
      x.map(({ item: b, date: j }) => {
        const D = o.get(b.sourceId);
        return /* @__PURE__ */ e.jsxs(
          "label",
          {
            className: y(
              "flex cursor-pointer items-start gap-2.5 border-b border-subtle py-2.5 last:border-b-0",
              D && "bg-negative-50"
            ),
            children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: c.has(b.key),
                  onChange: () => i(b.key),
                  className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] font-semibold text-text-primary", children: b.title }),
                /* @__PURE__ */ e.jsxs("span", { className: "mt-0.5 flex items-center gap-1.5 text-[11px] text-text-tertiary", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "line-through", children: N.dayShort(/* @__PURE__ */ new Date(`${b.date.slice(0, 10)}T00:00:00`)) }),
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right text-[9px]", "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-accent", children: N.dayShort(j) }),
                  b.loadHours != null && /* @__PURE__ */ e.jsxs("span", { children: [
                    "· ",
                    N.hours(b.loadHours)
                  ] })
                ] }),
                D && /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] font-medium text-negative-700", children: D })
              ] })
            ]
          },
          b.key
        );
      }),
      d.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 border-t border-subtle pt-2", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Ertelenemez" }),
        d.map((b) => {
          var j;
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 py-1.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock mt-1 shrink-0 text-[10px] text-text-tertiary", "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] text-text-secondary", children: b.title }),
              /* @__PURE__ */ e.jsxs("span", { className: "block text-[11px] text-text-tertiary", children: [
                (j = P[b.source]) == null ? void 0 : j.label,
                " — vadesi takvimden değiştirilemez"
              ] })
            ] })
          ] }, b.key);
        })
      ] })
    ] }),
    x.length > 0 && /* @__PURE__ */ e.jsxs("footer", { className: "flex items-center gap-2 border-t border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsx(
        $,
        {
          size: "sm",
          variant: "primary",
          disabled: m.length === 0 || n.isPending,
          onClick: f,
          children: n.isPending ? "Erteleniyor…" : `${m.length} öğeyi ertele`
        }
      ),
      /* @__PURE__ */ e.jsx($, { size: "sm", variant: "ghost", onClick: l, children: "Vazgeç" })
    ] })
  ] }) });
}
const ua = [
  { value: 4, label: "4 sa" },
  { value: 6, label: "6 sa" },
  { value: 8, label: "8 sa" },
  { value: 0, label: "Kapalı" }
], xe = ["Kaynaklar", "Dış takvim", "Kurallar"];
function xa({ open: t, counts: a, onDone: s }) {
  const [r, l] = g.useState(0), [x, d] = g.useState(() => new Set(Ne)), [c, p] = g.useState(8), n = oa(), u = () => {
    n.mutate(
      {
        dailyCapacityHours: c > 0 ? c : 0,
        sources: [...x],
        setupCompleted: !0
      },
      { onSettled: s }
    );
  }, o = (i) => d((m) => {
    const f = new Set(m);
    return f.has(i) ? f.delete(i) : f.add(i), f;
  });
  return /* @__PURE__ */ e.jsx(He, { open: t, onOpenChange: (i) => {
    i || s();
  }, children: /* @__PURE__ */ e.jsxs(We, { className: "w-full max-w-[520px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-5 py-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[18px] font-semibold tracking-tight text-text-primary", children: "Takviminizi kurun" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: "Hangi kaynakları göreceğinizi seçin, dilerseniz dış takvim bağlayın. Her ayarı sonradan değiştirebilirsiniz." }),
      /* @__PURE__ */ e.jsx("ol", { className: "mt-3 flex items-center gap-2", children: xe.map((i, m) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx("span", { className: y(
          "flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold",
          m === r ? "bg-accent text-white" : m < r ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
        ), children: m + 1 }),
        /* @__PURE__ */ e.jsx("span", { className: y(
          "text-[11.5px]",
          m === r ? "font-semibold text-text-primary" : "text-text-tertiary"
        ), children: i }),
        m < xe.length - 1 && /* @__PURE__ */ e.jsx("span", { className: "ms-1 text-text-tertiary", children: "·" })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-5 py-4", children: [
      r === 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Takvimde ne görünsün?" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex flex-col gap-1.5", children: Ne.map((i) => {
          var b, j;
          const m = x.has(i), f = a == null ? void 0 : a[i];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": m,
              onClick: () => o(i),
              className: y(
                "flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                m ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: y("fa text-[12px]", (b = P[i]) == null ? void 0 : b.icon, m ? "text-accent" : "text-text-tertiary"), "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-medium text-text-primary", children: (j = P[i]) == null ? void 0 : j.label }),
                f != null && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: f })
              ]
            },
            i
          );
        }) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-[13px] font-semibold text-text-primary", children: "Günlük kapasiteniz" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex gap-1.5", children: ua.map((i) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => p(i.value),
            className: y(
              "rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              c === i.value ? "border-accent bg-primary-subtle text-accent" : "border-subtle text-text-secondary hover:bg-surface-hover"
            ),
            children: i.label
          },
          i.value
        )) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] leading-snug text-text-tertiary", children: "Aşım uyarıları bu değere göre hesaplanır. Kapatırsanız kapasite çubukları görünmez." })
      ] }),
      r === 1 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Dış takvim bağlayın" }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: "Google veya Outlook bağlarsanız size atanan tarihli öğeler oraya etkinlik olarak yazılır. Bu adım isteğe bağlıdır — sonradan senkron ayarlarından bağlayabilirsiniz." }),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex gap-2", children: [
          /* @__PURE__ */ e.jsxs(
            $,
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
            $,
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
        xe.length
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1" }),
      /* @__PURE__ */ e.jsx($, { size: "sm", variant: "ghost", onClick: u, disabled: n.isPending, children: "Şimdilik atla" }),
      r < xe.length - 1 ? /* @__PURE__ */ e.jsx($, { size: "sm", variant: "primary", onClick: () => l((i) => i + 1), children: "Devam" }) : /* @__PURE__ */ e.jsx($, { size: "sm", variant: "primary", onClick: u, disabled: n.isPending, children: n.isPending ? "Kaydediliyor…" : "Bitir" })
    ] })
  ] }) });
}
const pa = [
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
function Be({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "rounded border border-strong bg-surface-raised px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-text-primary", children: t });
}
function ma({ open: t, onClose: a }) {
  return /* @__PURE__ */ e.jsx(He, { open: t, onOpenChange: (s) => {
    s || a();
  }, children: /* @__PURE__ */ e.jsxs(We, { className: "w-full max-w-[480px] p-0", children: [
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
      pa.map((s) => /* @__PURE__ */ e.jsxs("section", { className: "mb-4 last:mb-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: s.title }),
        s.rows.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center gap-1", children: r.keys.map((l) => /* @__PURE__ */ e.jsx(Be, { children: l }, l)) }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-secondary", children: r.label })
        ] }, r.label))
      ] }, s.title)),
      /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] leading-snug text-text-tertiary", children: [
        "Takvim ızgarası tek sekme durağıdır: ",
        /* @__PURE__ */ e.jsx(Be, { children: "Tab" }),
        " ile içine girin, sonra oklarla gezin. Sürükle-bırakla yapılan her taşıma buradaki kısayollarla da yapılabilir."
      ] })
    ] })
  ] }) });
}
function ba({ polite: t, assertive: a }) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("p", { role: "status", "aria-live": "polite", className: "sr-only", children: t }),
    /* @__PURE__ */ e.jsx("p", { role: "alert", "aria-live": "assertive", className: "sr-only", children: a })
  ] });
}
const fa = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
function ha({ items: t, month: a, today: s, generatedAt: r }) {
  var i;
  const l = Je(a), x = C(s), d = {};
  for (const m of t ?? [])
    (d[i = m.date.slice(0, 10)] ?? (d[i] = [])).push(m);
  const c = Ce(s), p = (t ?? []).filter((m) => {
    const f = m.date.slice(0, 10);
    return f >= C(c) && f <= C(F(c, 7));
  }), { overdue: n, days: u } = et(p, s), o = (m) => m === K.OVERDUE ? "border-l-[3px] border-l-black" : m === K.DUE_TODAY ? "border-l-[3px] border-l-neutral-500" : "border-l-[3px] border-l-neutral-300";
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-print-root hidden print:block", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-end justify-between border-b-2 border-black pb-2", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[8pt] font-bold uppercase tracking-widest text-neutral-500", children: "APYA · Takvim" }),
          /* @__PURE__ */ e.jsx("h1", { className: "mt-1 text-[22pt] font-semibold capitalize leading-none", children: N.monthTitle(a) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "text-right text-[8pt] text-neutral-500", children: [
          /* @__PURE__ */ e.jsx("p", { children: "Risk: kalın çizgi = gecikmiş · gri çizgi = bugün son gün" }),
          /* @__PURE__ */ e.jsxs("p", { children: [
            r,
            " tarihinde oluşturuldu · Sayfa 1 / 2"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "mt-3 grid grid-cols-7", children: fa.map((m) => /* @__PURE__ */ e.jsx("div", { className: "pb-1 text-[7.5pt] font-bold uppercase tracking-wide text-neutral-500", children: m }, m)) }),
      /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-l border-t border-neutral-300", children: l.map((m) => {
        const f = C(m), b = d[f] ?? [], j = m.getMonth() !== a.getMonth();
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: y(
              "min-h-[62px] border-b border-r border-neutral-300 p-1",
              f === x && "ring-1 ring-inset ring-black"
            ),
            children: [
              /* @__PURE__ */ e.jsx("p", { className: y(
                "text-right font-mono text-[9pt] font-semibold",
                j ? "text-neutral-300" : "text-neutral-700"
              ), children: m.getDate() }),
              b.slice(0, 4).map((D) => /* @__PURE__ */ e.jsx(
                "p",
                {
                  className: y(
                    "mt-0.5 truncate ps-1 text-[7.5pt] leading-tight",
                    o(D.risk),
                    D.risk === K.OVERDUE ? "font-semibold" : "font-normal",
                    D.isDone && "line-through"
                  ),
                  children: D.title
                },
                D.key
              )),
              b.length > 4 && /* @__PURE__ */ e.jsxs("p", { className: "mt-0.5 text-[7pt] text-neutral-500", children: [
                "+",
                b.length - 4,
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
            N.dayShort(c),
            " – ",
            N.dayShort(F(c, 6))
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
          n.map((m) => /* @__PURE__ */ e.jsx(Ge, { item: m, showDate: !0 }, m.key))
        ] }),
        u.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "mb-4 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "border-b border-black pb-1 text-[9pt] font-bold uppercase tracking-wide", children: [
            N.dayTitle(m.date),
            m.isToday ? " · Bugün" : ""
          ] }),
          m.items.map((f) => /* @__PURE__ */ e.jsx(Ge, { item: f }, f.key))
        ] }, m.key))
      ] })
    ] })
  ] });
}
function Ge({ item: t, showDate: a = !1 }) {
  const s = P[t.source];
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-neutral-200 py-1", children: [
    /* @__PURE__ */ e.jsx("span", { className: "mt-[3px] h-[9px] w-[9px] shrink-0 border border-neutral-600", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ e.jsx("span", { className: y("block text-[9pt] leading-tight", t.risk === K.OVERDUE && "font-semibold"), children: t.title }),
      /* @__PURE__ */ e.jsx("span", { className: "block text-[7.5pt] text-neutral-500", children: [
        a ? N.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
        s == null ? void 0 : s.label,
        t.subtitle,
        t.amount != null ? N.money(t.amount, t.currency) : null
      ].filter(Boolean).join(" · ") })
    ] })
  ] });
}
function ga({ rows: t, days: a, capacity: s, loading: r }) {
  if (r)
    return /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1.5 text-[11.5px] text-text-tertiary", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "ekip yükü hesaplanıyor…"
    ] });
  if (!t || t.length === 0)
    return /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1.5 text-[11.5px] text-text-tertiary", children: "Bu aralıkta atanmış açık görev yok." });
  const l = (a ?? []).map(C);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 px-2 pb-1", children: [
    t.map((x) => {
      const d = {};
      for (const c of x.days ?? []) d[c.date.slice(0, 10)] = c;
      return /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "truncate text-[11.5px] font-medium text-text-primary", children: x.name }),
          /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] tabular-nums text-text-tertiary", children: N.hours(x.totalHours) })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-0.5 flex gap-[2px]", children: (l.length ? l : (x.days ?? []).map((c) => c.date.slice(0, 10))).map((c) => {
          const p = d[c], n = (p == null ? void 0 : p.hours) ?? 0, u = s && n > s, o = s ? Math.min(n / s, 1) : n > 0 ? 1 : 0;
          return /* @__PURE__ */ e.jsx(
            "span",
            {
              title: `${c}: ${N.hours(n)}${p != null && p.itemCount ? ` · ${p.itemCount} öğe` : ""}`,
              className: "h-[6px] flex-1 overflow-hidden rounded-sm bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: y("block h-full", u ? "bg-negative" : "bg-accent"),
                  style: { width: `${o * 100}%` }
                }
              )
            },
            c
          );
        }) })
      ] }, x.userId);
    }),
    /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[10.5px] leading-snug text-text-tertiary", children: "Yalnız görebildiğiniz projelerin görevleri sayılır." })
  ] });
}
const ya = 6e4;
function ka({ from: t, to: a }) {
  const s = C(t), r = C(a);
  return U({
    queryKey: ["calendar", "feed", s, r],
    queryFn: () => R.get(`/api/app/calendar/feed?From=${s}&To=${r}`),
    staleTime: ya,
    placeholderData: (l) => l
    /* ay geçişinde boş ekran yerine eski veri */
  });
}
const rt = "apya.calendar.view", De = "apya.calendar.sources", be = ["month", "week", "day", "agenda"];
function nt(t) {
  try {
    return window.localStorage.getItem(t);
  } catch {
    return null;
  }
}
function ve(t, a) {
  try {
    window.localStorage.setItem(t, a);
  } catch {
  }
}
function va() {
  const t = new URLSearchParams(window.location.search).get("view");
  if (be.includes(t)) return t;
  const a = nt(rt);
  return be.includes(a) ? a : null;
}
function ja() {
  const t = nt(De);
  if (!t) return new Set(ne);
  const a = t.split(",").map(Number).filter((s) => ne.includes(s));
  return a.length ? new Set(a) : new Set(ne);
}
function Na({ defaultView: t = "month" } = {}) {
  const [a] = g.useState(va), [s, r] = g.useState(() => a ?? t), [l, x] = g.useState(ja);
  g.useEffect(() => {
    const u = new URL(window.location.href);
    u.searchParams.get("view") !== s && (u.searchParams.set("view", s), window.history.replaceState({}, "", u));
  }, [s]);
  const d = g.useCallback((u) => {
    be.includes(u) && (r(u), ve(rt, u));
  }, []), c = g.useCallback((u) => {
    x((o) => {
      const i = new Set(o);
      return i.has(u) ? i.delete(u) : i.add(u), ve(De, [...i].join(",")), i;
    });
  }, []), p = g.useCallback((u) => {
    a || be.includes(u) && r((o) => o === u ? o : u);
  }, [a]), n = g.useCallback(() => {
    const u = new Set(ne);
    x(u), ve(De, [...u].join(","));
  }, []);
  return { view: s, setView: d, applyResponsiveDefault: p, enabledSources: l, toggleSource: c, resetSources: n };
}
const G = ["calendar", "feed"];
function wa(t, a, s) {
  t.setQueriesData({ queryKey: G }, (r) => r != null && r.items ? {
    ...r,
    items: r.items.map((l) => l.key === a ? { ...l, date: `${s}T00:00:00` } : l)
  } : r);
}
function Sa(t, a) {
  t.setQueriesData({ queryKey: G }, (s) => s != null && s.items ? {
    ...s,
    items: s.items.map((r) => r.key === a ? { ...r, isDone: !0, risk: 0, loadHours: null } : r)
  } : s);
}
function Da({ onOfflineFailure: t } = {}) {
  const a = W(), [s, r] = g.useState(null), [l, x] = g.useState({}), [d, c] = g.useState({}), p = g.useCallback((o) => {
    x((i) => {
      if (!i[o]) return i;
      const m = { ...i };
      return delete m[o], m;
    });
  }, []), n = _({
    mutationFn: ({ item: o, newDate: i }) => R.post("/api/app/calendar/reschedule-item", {
      source: o.source,
      sourceId: o.sourceId,
      newDate: C(i)
    }),
    onMutate: async ({ item: o, newDate: i }) => {
      await a.cancelQueries({ queryKey: G });
      const m = a.getQueriesData({ queryKey: G });
      return p(o.key), c((f) => ({ ...f, [o.key]: !0 })), wa(a, o.key, C(i)), { snapshot: m, previousDate: o.date.slice(0, 10) };
    },
    onError: (o, { item: i, newDate: m }, f) => {
      var b;
      if (typeof navigator < "u" && !navigator.onLine) {
        t == null || t({
          key: i.key,
          payload: { source: i.source, sourceId: i.sourceId, newDate: C(m) }
        });
        return;
      }
      (b = f == null ? void 0 : f.snapshot) == null || b.forEach(([j, D]) => a.setQueryData(j, D)), x((j) => ({
        ...j,
        [i.key]: (o == null ? void 0 : o.message) || "Kaydedilemedi — tarih değişmedi."
      }));
    },
    onSuccess: (o, { item: i, newDate: m }, f) => {
      r({
        key: i.key,
        message: `“${i.title}” ${C(m)} tarihine taşındı.`,
        undo: () => n.mutate({
          item: { ...i, date: `${C(m)}T00:00:00` },
          newDate: /* @__PURE__ */ new Date(`${f.previousDate}T00:00:00`)
        })
      });
    },
    onSettled: (o, i, { item: m }) => {
      c((f) => {
        const b = { ...f };
        return delete b[m.key], b;
      }), a.invalidateQueries({ queryKey: G });
    }
  }), u = _({
    mutationFn: ({ item: o }) => R.post("/api/app/calendar/complete-item", {
      source: o.source,
      sourceId: o.sourceId
    }),
    onMutate: async ({ item: o }) => {
      await a.cancelQueries({ queryKey: G });
      const i = a.getQueriesData({ queryKey: G });
      return p(o.key), c((m) => ({ ...m, [o.key]: !0 })), Sa(a, o.key), { snapshot: i };
    },
    onError: (o, { item: i }, m) => {
      var f;
      (f = m == null ? void 0 : m.snapshot) == null || f.forEach(([b, j]) => a.setQueryData(b, j)), x((b) => ({
        ...b,
        [i.key]: (o == null ? void 0 : o.message) || "Tamamlanamadı."
      }));
    },
    onSuccess: (o, { item: i }) => {
      r({ key: i.key, message: `“${i.title}” tamamlandı.`, undo: null });
    },
    onSettled: (o, i, { item: m }) => {
      c((f) => {
        const b = { ...f };
        return delete b[m.key], b;
      }), a.invalidateQueries({ queryKey: G });
    }
  });
  return {
    reschedule: (o, i) => n.mutate({ item: o, newDate: i }),
    complete: (o) => u.mutate({ item: o }),
    retry: (o, i) => i ? n.mutate({ item: o, newDate: i }) : u.mutate({ item: o }),
    lastAction: s,
    dismissAction: () => r(null),
    errors: l,
    clearError: p,
    pending: d
  };
}
function Ca({ from: t, to: a, enabled: s = !0 }) {
  const r = C(t), l = C(a);
  return U({
    queryKey: ["calendar", "external", r, l],
    queryFn: () => R.get(`/api/app/calendar/external-events?From=${r}&To=${l}`),
    enabled: s,
    staleTime: 12e4,
    retry: !1,
    placeholderData: (x) => x
  });
}
const Ta = ["INPUT", "TEXTAREA", "SELECT"];
function Ea({
  onView: t,
  onToday: a,
  onPrev: s,
  onNext: r,
  onDeferSelected: l,
  onUndo: x,
  onToggleHelp: d,
  enabled: c = !0
}) {
  g.useEffect(() => {
    if (!c) return;
    const p = (n) => {
      const u = n.target;
      if (!(Ta.includes(u == null ? void 0 : u.tagName) || u != null && u.isContentEditable)) {
        if ((n.metaKey || n.ctrlKey) && n.key.toLowerCase() === "z") {
          n.preventDefault(), x == null || x();
          return;
        }
        if (!(n.metaKey || n.ctrlKey || n.altKey)) {
          if (n.shiftKey) {
            n.key === "ArrowRight" && (n.preventDefault(), l == null || l(1)), n.key === "ArrowLeft" && (n.preventDefault(), l == null || l(-1)), n.key === "?" && (n.preventDefault(), d == null || d());
            return;
          }
          switch (n.key) {
            case "?":
              n.preventDefault(), d == null || d();
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
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [c, t, a, s, r, l, x, d]);
}
function $a({ from: t, to: a, enabled: s }) {
  const r = C(t), l = C(a);
  return U({
    queryKey: ["calendar", "team-load", r, l],
    queryFn: () => R.get(`/api/app/calendar/team-load?From=${r}&To=${l}`),
    enabled: s,
    staleTime: 6e4
  });
}
const it = "apya.calendar.offlineQueue";
function je() {
  try {
    const t = window.localStorage.getItem(it), a = t ? JSON.parse(t) : [];
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}
function Ue(t) {
  try {
    window.localStorage.setItem(it, JSON.stringify(t));
  } catch {
  }
}
function Ra({ onFlush: t }) {
  const [a, s] = g.useState(() => typeof navigator > "u" ? !0 : navigator.onLine), [r, l] = g.useState(() => je().length), x = g.useRef(!1), d = g.useCallback((p) => {
    const u = je().filter((o) => o.key !== p.key).concat(p);
    Ue(u), l(u.length);
  }, []), c = g.useCallback(async () => {
    if (x.current) return;
    const p = je();
    if (p.length !== 0) {
      x.current = !0;
      try {
        const n = [];
        for (const u of p)
          try {
            await t(u);
          } catch {
            n.push(u);
          }
        Ue(n), l(n.length);
      } finally {
        x.current = !1;
      }
    }
  }, [t]);
  return g.useEffect(() => {
    const p = () => {
      s(!0), c();
    }, n = () => s(!1);
    return window.addEventListener("online", p), window.addEventListener("offline", n), navigator.onLine && c(), () => {
      window.removeEventListener("online", p), window.removeEventListener("offline", n);
    };
  }, [c]), { isOnline: a, pendingCount: r, enqueue: d, flush: c };
}
function Aa() {
  const t = g.useRef(null), [a, s] = g.useState(0);
  return g.useLayoutEffect(() => {
    const r = t.current;
    if (!r || (s(r.getBoundingClientRect().width), typeof ResizeObserver > "u")) return;
    const l = new ResizeObserver((x) => {
      for (const d of x)
        s(d.contentRect.width);
    });
    return l.observe(r), () => l.disconnect();
  }, []), [t, a];
}
function za(t) {
  return t === 0 || t >= 1180 ? "wide" : t >= 780 ? "medium" : "narrow";
}
const Ka = 60;
function pe(t, a, s) {
  return a === "week" ? F(t, 7 * s) : a === "day" ? F(t, s) : new Date(t.getFullYear(), t.getMonth() + s, 1);
}
function Oa() {
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Array.from({ length: 7 }, (t, a) => /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-2", children: /* @__PURE__ */ e.jsx(re, { height: 10 }) }, a)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: Array.from({ length: Te }, (t, a) => /* @__PURE__ */ e.jsxs("div", { className: "min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0", children: [
      /* @__PURE__ */ e.jsx(re, { height: 12, width: "40%", className: "ml-auto" }),
      a % 3 === 0 && /* @__PURE__ */ e.jsx(re, { height: 14, className: "mt-2" })
    ] }, a)) })
  ] });
}
function Ia() {
  var Ie, Pe, Me, Fe, Le;
  const [t, a] = Aa(), s = za(a), r = s === "narrow", l = g.useMemo(() => we(/* @__PURE__ */ new Date()), []), [x, d] = g.useState(() => new Date(l.getFullYear(), l.getMonth(), 1)), [c, p] = g.useState(null), [n, u] = g.useState(null), [o, i] = g.useState(!1), [m, f] = g.useState(!1), [b, j] = g.useState(!1), [D, O] = g.useState(!1), [z, v] = g.useState(null), [h, I] = g.useState(!1), { view: w, setView: S, applyResponsiveDefault: M, enabledSources: Z, toggleSource: he, resetSources: V } = Na();
  g.useEffect(() => {
    a !== 0 && M(r ? "agenda" : "month");
  }, [a, r, M]);
  const { range: L, title: ee, weekDayList: X } = g.useMemo(() => {
    if (w === "agenda")
      return {
        range: { from: F(l, -60), to: F(l, Ka) },
        title: "Ajanda",
        weekDayList: null
      };
    if (w === "week") {
      const E = Nt(x);
      return {
        range: { from: E[0], to: E[6] },
        title: `${N.dayShort(E[0])} – ${N.dayShort(E[6])} ${E[6].getFullYear()}`,
        weekDayList: E
      };
    }
    if (w === "day") {
      const E = we(x);
      return { range: { from: E, to: E }, title: N.dayTitle(E), weekDayList: [E] };
    }
    const k = Xe(x);
    return {
      range: { from: k, to: F(k, Te - 1) },
      title: N.monthTitle(x),
      weekDayList: null
    };
  }, [w, x, l]), { data: T, isPending: Q, isError: lt, refetch: ot } = ka(L), te = Ca(L), Re = la(), Ae = $a({ from: L.from, to: L.to, enabled: h }), q = Ra({
    onFlush: (k) => R.post("/api/app/calendar/reschedule-item", k.payload)
  }), ce = g.useMemo(
    () => {
      var k;
      return [...(T == null ? void 0 : T.items) ?? [], ...((k = te.data) == null ? void 0 : k.items) ?? []];
    },
    [T, te.data]
  ), J = g.useMemo(
    () => ce.filter((k) => Z.has(k.source)),
    [ce, Z]
  ), Y = g.useMemo(() => Ze(J), [J]), B = (T == null ? void 0 : T.dailyCapacityHours) ?? null, ze = g.useMemo(() => {
    const k = {};
    for (const E of (T == null ? void 0 : T.sources) ?? []) k[E.source] = E.count;
    return k;
  }, [T]), ct = g.useMemo(() => B ? Object.values(Y).filter((k) => fe(k) > B).length : 0, [Y, B]);
  g.useEffect(() => {
    c && !Y[c] && !Q && (c >= C(L.from) && c <= C(L.to) || p(null));
  }, [c, Y, Q, L]);
  const de = g.useCallback((k) => u(k.key), []), Ke = g.useCallback(() => {
    d(l), p(C(l));
  }, [l]), A = Da({ onOfflineFailure: q.enqueue }), dt = g.useCallback((k) => {
    const E = z ?? c;
    if (E)
      for (const ye of Y[E] ?? [])
        ye.canReschedule && !ye.isDone && A.reschedule(ye, F(/* @__PURE__ */ new Date("T00:00:00"), k));
  }, [z, c, Y, A]);
  Ea({
    onView: S,
    onToday: Ke,
    onPrev: () => d((k) => pe(k, w, -1)),
    onNext: () => d((k) => pe(k, w, 1)),
    onDeferSelected: dt,
    onUndo: () => {
      var k, E;
      return (E = (k = A.lastAction) == null ? void 0 : k.undo) == null ? void 0 : E.call(k);
    },
    onToggleHelp: () => O((k) => !k)
  });
  const Oe = ce.length > 0, ut = Oe && J.length === 0, xt = c ? Y[c] ?? [] : [], ae = n ? ce.find((k) => k.key === n) ?? null : null, ge = c && /* @__PURE__ */ e.jsx(
    Et,
    {
      dayKey: c,
      items: xt,
      capacity: B,
      onSelectItem: de,
      onClose: () => p(null)
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { ref: t, className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsx(
      Ft,
      {
        title: ee,
        view: w,
        onView: S,
        onPrev: () => d((k) => pe(k, w, -1)),
        onNext: () => d((k) => pe(k, w, 1)),
        onToday: Ke,
        overloadDays: ct,
        onHelp: () => O(!0)
      }
    ),
    lt && /* @__PURE__ */ e.jsxs("div", { className: "rounded-card border border-negative-100 bg-negative-50 px-3 py-2.5 text-[12.5px] text-negative-700", children: [
      "Takvim yüklenemedi.",
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => ot(), className: "ml-2 font-semibold underline", children: "Yeniden dene" })
    ] }),
    (!q.isOnline || q.pendingCount > 0) && /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        className: "flex items-center gap-2 rounded-card border border-warning-100 bg-warning-50 px-3 py-2 text-[12.5px] text-warning-700",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: y("fa", q.isOnline ? "fa-cloud-arrow-up" : "fa-wifi"), "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: q.isOnline ? `${q.pendingCount} değişiklik gönderiliyor…` : `Çevrimdışısınız — ${q.pendingCount} değişiklik kuyrukta, bağlantı gelince gönderilecek.` }),
          q.isOnline && q.pendingCount > 0 && /* @__PURE__ */ e.jsx("button", { type: "button", onClick: q.flush, className: "font-semibold underline", children: "Şimdi gönder" })
        ]
      }
    ),
    A.lastAction && /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "flex items-center gap-2 rounded-card border border-subtle bg-surface-raised px-3 py-2 text-[12.5px] text-text-secondary",
        role: "status",
        "aria-live": "polite",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-clock-rotate-left text-text-tertiary", "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 truncate", children: A.lastAction.message }),
          A.lastAction.undo && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                A.lastAction.undo(), A.dismissAction();
              },
              className: "font-semibold text-text-link hover:underline",
              children: "Geri al"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: A.dismissAction,
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
        Pt,
        {
          sources: (T == null ? void 0 : T.sources) ?? [],
          counts: ze,
          enabled: Z,
          onToggle: he,
          compact: s !== "wide",
          externalAccounts: ((Ie = te.data) == null ? void 0 : Ie.accounts) ?? [],
          externalLoading: te.isFetching,
          onOpenSync: () => i(!0),
          teamOpen: h,
          onToggleTeam: () => I((k) => !k),
          teamContent: h ? /* @__PURE__ */ e.jsx(
            ga,
            {
              rows: Ae.data,
              days: X,
              capacity: B,
              loading: Ae.isPending
            }
          ) : null
        }
      ) }),
      /* @__PURE__ */ e.jsx("div", { className: "min-w-0 flex-1", children: Q ? /* @__PURE__ */ e.jsx(Oa, {}) : ut ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
        oe,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-filter-circle-xmark" }),
          title: "Bu filtreyle gösterilecek öğe yok",
          description: "Kaynak rayında kapattığınız türler bu aralıktaki tüm öğeleri gizliyor.",
          action: /* @__PURE__ */ e.jsx($, { size: "sm", variant: "outline", onClick: V, children: "Kaynakları aç" })
        }
      ) }) : Oe ? w === "month" ? /* @__PURE__ */ e.jsx(
        Ot,
        {
          month: x,
          byDay: Y,
          today: l,
          capacity: B,
          selectedDay: c,
          onSelectItem: de,
          onSelectDay: p,
          onDropItem: A.reschedule,
          focusedDay: z,
          onFocusDay: v,
          onNavigate: (k) => d(k),
          pending: A.pending,
          errors: A.errors
        }
      ) : X ? /* @__PURE__ */ e.jsx(
        Yt,
        {
          days: X,
          byDay: Y,
          today: l,
          capacity: B,
          selectedDay: c,
          onSelectItem: de,
          onSelectDay: p
        }
      ) : /* @__PURE__ */ e.jsx(
        Tt,
        {
          items: J,
          today: l,
          onSelectItem: de,
          onSmartDefer: () => f(!0)
        }
      ) : /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
        oe,
        {
          icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
          title: "Bu aralıkta planlanmış bir şey yok",
          description: "Son tarihi olan görevler, fatura vadeleri, hibe son tarihleri ve tarihli finans kayıtları burada birlikte görünür.",
          action: /* @__PURE__ */ e.jsx($, { size: "sm", variant: "outline", onClick: () => {
            window.location.href = "/Tasks";
          }, children: "Görev oluştur" })
        }
      ) }) }),
      s === "wide" && c && /* @__PURE__ */ e.jsx("div", { className: "w-[340px] shrink-0 self-stretch", children: ge })
    ] }),
    s === "medium" && c && /* @__PURE__ */ e.jsx(ie, { open: !0, onOpenChange: (k) => {
      k || p(null);
    }, children: /* @__PURE__ */ e.jsx(le, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: ge }) }),
    r && c && /* @__PURE__ */ e.jsx(ie, { open: !0, onOpenChange: (k) => {
      k || p(null);
    }, children: /* @__PURE__ */ e.jsx(le, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: ge }) }),
    /* @__PURE__ */ e.jsx(
      ha,
      {
        items: J,
        month: x,
        today: l,
        generatedAt: N.dayShort(l)
      }
    ),
    /* @__PURE__ */ e.jsx(ma, { open: D, onClose: () => O(!1) }),
    /* @__PURE__ */ e.jsx(
      ba,
      {
        polite: ((Pe = A.lastAction) == null ? void 0 : Pe.message) ?? "",
        assertive: ((Le = (Fe = (Me = te.data) == null ? void 0 : Me.accounts) == null ? void 0 : Fe.find((k) => k.error)) == null ? void 0 : Le.error) ?? ""
      }
    ),
    /* @__PURE__ */ e.jsx(ia, { open: o, onClose: () => i(!1) }),
    /* @__PURE__ */ e.jsx(
      da,
      {
        open: m,
        items: J,
        today: l,
        capacity: B,
        onClose: () => f(!1)
      }
    ),
    /* @__PURE__ */ e.jsx(
      xa,
      {
        open: Re.data ? !Re.data.setupCompleted && !b : !1,
        counts: ze,
        onDone: () => j(!0)
      }
    ),
    ae && /* @__PURE__ */ e.jsx(
      Ut,
      {
        item: ae,
        capacity: B,
        onClose: () => u(null),
        onReschedule: A.reschedule,
        onComplete: A.complete,
        isPending: !!A.pending[ae.key],
        error: A.errors[ae.key],
        onRetry: () => A.clearError(ae.key)
      }
    )
  ] });
}
const Qe = document.getElementById("apya-calendar-root");
Qe && pt(Qe).render(
  /* @__PURE__ */ e.jsx(mt, { children: /* @__PURE__ */ e.jsx(bt, { children: /* @__PURE__ */ e.jsx(ft, { children: /* @__PURE__ */ e.jsx(Ia, {}) }) }) })
);
