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
  const u = r.filter(ht).slice(0, s), d = new Set(u.map((l) => l.key)), c = /* @__PURE__ */ new Map();
  for (const l of r) {
    if (d.has(l.key)) continue;
    const b = c.get(l.source) ?? { source: l.source, count: 0, amount: 0, hasAmount: !1, only: null };
    b.count += 1, b.only = b.count === 1 ? l : null, l.amount != null && (b.amount += l.amount, b.hasAmount = !0), c.set(l.source, b);
  }
  const x = [];
  for (const l of ne) {
    const b = c.get(l);
    b && (b.count === 1 && b.only ? u.push(b.only) : x.push(b));
  }
  return { pills: u, summaries: x };
}
function jt(t, { compact: a = !0 } = {}) {
  const s = P[t.source], r = `${t.count} ${s ? s.plural : "öğe"}`;
  if (!t.hasAmount) return r;
  const i = a ? N.moneyCompact(t.amount) : N.money(t.amount);
  return `${r} · ${i}`;
}
function et(t, a) {
  const s = C(a), r = (t ?? []).filter((x) => !x.isDone), i = r.filter((x) => x.date.slice(0, 10) < s && x.risk === K.OVERDUE), u = r.filter((x) => x.date.slice(0, 10) >= s), d = Ze(u), c = Object.keys(d).sort().map((x) => ({
    key: x,
    date: /* @__PURE__ */ new Date(`${x}T00:00:00`),
    isToday: x === s,
    items: d[x]
  }));
  return { overdue: i, days: c };
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
function Dt(t, { today: a, capacity: s = null, horizonDays: r = 21, fallbackPerDay: i = 3 } = {}) {
  const u = C(a), d = (t ?? []).filter((f) => !f.isDone), c = d.filter((f) => f.date.slice(0, 10) < u && f.risk === K.OVERDUE), x = c.filter((f) => f.canReschedule), l = c.filter((f) => !f.canReschedule), b = {}, o = {};
  for (const f of d) {
    const m = f.date.slice(0, 10);
    m < u || (b[m] = (b[m] ?? 0) + (f.loadHours ?? 0), o[m] = (o[m] ?? 0) + 1);
  }
  const n = [];
  let p = 0;
  for (const f of x) {
    let m = null;
    for (; p < r; ) {
      const j = F(a, p);
      if (qe(j)) {
        p += 1;
        continue;
      }
      const D = C(j), O = b[D] ?? 0, z = o[D] ?? 0, v = f.loadHours ?? 0;
      if (s ? O + v <= s : z < i) {
        b[D] = O + v, o[D] = z + 1, m = j;
        break;
      }
      p += 1;
    }
    if (!m) {
      let j = F(a, r);
      for (; qe(j); ) j = F(j, 1);
      m = j;
    }
    n.push({ item: f, date: m });
  }
  return { suggestions: n, fixed: l };
}
const Ct = {
  [K.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [K.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function Se({ item: t, onSelect: a, showDate: s = !1 }) {
  const r = P[t.source], i = Ct[t.risk];
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
        i && /* @__PURE__ */ e.jsx("span", { className: y("shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold", i.className), children: i.label })
      ]
    }
  );
}
function Tt({ items: t, today: a, onSelectItem: s, onSmartDefer: r }) {
  const { overdue: i, days: u } = et(t, a);
  return i.length === 0 && u.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
    oe,
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
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: i.map((d) => /* @__PURE__ */ e.jsx(Se, { item: d, onSelect: s, showDate: !0 }, d.key)) })
    ] }),
    u.map((d) => /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
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
function Et({ dayKey: t, items: a, capacity: s, onSelectItem: r, onClose: i }) {
  const u = /* @__PURE__ */ new Date(`${t}T00:00:00`), d = fe(a), c = s && d > s, x = a.reduce((l, b) => (l[b.source] = (l[b.source] ?? 0) + 1, l), {});
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: N.dayTitle(u) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(x).length === 0 ? "Planlanmış öğe yok" : Object.entries(x).map(([l, b]) => {
          var o;
          return `${b} ${((o = P[l]) == null ? void 0 : o.plural) ?? "öğe"}`;
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
    ) : a.map((l) => /* @__PURE__ */ e.jsx(Se, { item: l, onSelect: r }, l.key)) })
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
function At({ item: t, onSelect: a, onDragStart: s, isPending: r, hasError: i }) {
  const u = P[t.source], d = Rt[t.risk], c = t.canReschedule && !t.isDone;
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: c,
      onDragStart: c ? (x) => {
        x.stopPropagation(), x.dataTransfer.effectAllowed = "move", x.dataTransfer.setData("text/plain", t.key), s(t);
      } : void 0,
      onClick: (x) => {
        x.stopPropagation(), a(t);
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
        i && "ring-1 ring-negative-500",
        r && "opacity-60"
      ),
      children: [
        r ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin shrink-0 text-[9px]", "aria-hidden": "true" }) : u && /* @__PURE__ */ e.jsx("i", { className: y("fa shrink-0 text-[9px] opacity-70", u.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: t.title }),
        i && /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation ms-auto shrink-0 text-[9px]", "aria-hidden": "true" })
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
  onSelectItem: i,
  onSelectDay: u,
  selectedDay: d,
  onDropItem: c,
  pending: x = {},
  errors: l = {},
  focusedDay: b,
  onFocusDay: o,
  onNavigate: n
}) {
  const p = Je(t), f = C(s), [m, j] = ue.useState(null), [D, O] = ue.useState(null), z = ue.useRef(null), v = b ?? d ?? f, h = (w) => {
    const S = F(/* @__PURE__ */ new Date(`${v}T00:00:00`), w);
    p.some((M) => C(M) === C(S)) || n == null || n(S), o == null || o(C(S));
  }, I = (w) => {
    const S = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[w.key];
    if (S) {
      w.preventDefault(), h(S);
      return;
    }
    (w.key === "Enter" || w.key === " ") && (w.preventDefault(), u(v));
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
        children: p.map((w) => {
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
                o == null || o(S), u(S);
              },
              onDragOver: m ? (T) => {
                T.preventDefault(), T.dataTransfer.dropEffect = "move", D !== S && O(S);
              } : void 0,
              onDragLeave: m ? () => O((T) => T === S ? null : T) : void 0,
              onDrop: m ? (T) => {
                T.preventDefault();
                const Q = m;
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
                    onSelect: i,
                    onDragStart: j,
                    isPending: !!x[T.key],
                    hasError: !!l[T.key]
                  },
                  T.key
                )),
                he.map((T) => /* @__PURE__ */ e.jsx(
                  zt,
                  {
                    summary: T,
                    onSelect: () => u(S)
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
  compact: i = !1,
  externalAccounts: u = [],
  externalLoading: d = !1,
  onOpenSync: c,
  teamOpen: x = !1,
  onToggleTeam: l,
  teamContent: b
}) {
  const o = (t ?? []).filter((n) => n.isAvailable);
  return o.length === 0 ? null : /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Takvim kaynakları",
      className: y(
        "flex flex-col gap-1 rounded-card border border-subtle bg-surface-base p-2",
        i ? "w-[60px] items-center" : "w-full"
      ),
      children: [
        !i && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Kaynaklar" }),
        o.map((n) => {
          const p = P[n.source];
          if (!p) return null;
          const f = s.has(n.source), m = a[n.source] ?? 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": f,
              title: i ? `${p.label} — ${m} öğe` : void 0,
              onClick: () => r(n.source),
              className: y(
                "group flex items-center rounded-md text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                i ? "relative h-11 w-11 justify-center" : "gap-2.5 px-2 py-2",
                f ? "text-text-primary" : "text-text-tertiary",
                "hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: y(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px]",
                      f ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: y("fa", p.icon) })
                  }
                ),
                i ? m > 0 && /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: y(
                      "absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-[9.5px] font-bold leading-4",
                      f ? "bg-accent text-white" : "bg-neutral-200 text-text-tertiary"
                    ),
                    children: m
                  }
                ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                  /* @__PURE__ */ e.jsx("span", { className: y("flex-1 truncate text-[12.5px] font-medium", !f && "line-through decoration-1"), children: p.label }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: m })
                ] })
              ]
            },
            n.source
          );
        }),
        !i && l && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": x,
              onClick: l,
              className: y(
                "mt-2 flex items-center gap-2 border-t border-subtle px-2 pb-1 pt-2 text-left",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              ),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Ekip katmanı" }),
                /* @__PURE__ */ e.jsx(
                  "i",
                  {
                    className: y("fa text-[11px]", x ? "fa-toggle-on text-accent" : "fa-toggle-off text-text-tertiary"),
                    "aria-hidden": "true"
                  }
                )
              ]
            }
          ),
          b
        ] }),
        !i && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
          u.length === 0 && !d && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 text-[11.5px] text-text-tertiary", children: "Bağlı takvim yok." }),
          d && u.length === 0 && /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1 text-[11.5px] text-text-tertiary", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
            "senkronize ediliyor…"
          ] }),
          u.map((n) => /* @__PURE__ */ e.jsxs(
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
function Ft({ title: t, view: a, onView: s, onPrev: r, onNext: i, onToday: u, overloadDays: d, onHelp: c }) {
  const x = a !== "agenda";
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    x && /* @__PURE__ */ e.jsxs("div", { className: "flex", children: [
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
    /* @__PURE__ */ e.jsx($, { variant: "outline", size: "sm", onClick: u, children: "Bugün" }),
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
      /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(Mt).map(([l, b]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": a === l,
          onClick: () => s(l),
          className: y(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            a === l ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: b
        },
        l
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
function Bt({ days: t, byDay: a, today: s, capacity: r, onSelectItem: i, onSelectDay: u, selectedDay: d }) {
  const c = C(s), x = g.useRef(null), [l, b] = g.useState(() => {
    const v = /* @__PURE__ */ new Date();
    return v.getHours() * 60 + v.getMinutes();
  });
  g.useEffect(() => {
    const v = setInterval(() => {
      const h = /* @__PURE__ */ new Date();
      b(h.getHours() * 60 + h.getMinutes());
    }, 6e4);
    return () => clearInterval(v);
  }, []);
  const o = t.map(C), n = {}, p = {};
  for (const v of o) {
    const h = a[v] ?? [];
    n[v] = h.filter(_e), p[v] = h.filter((I) => !_e(I));
  }
  const f = o.flatMap((v) => n[v]), { start: m, end: j } = St(f), D = Array.from({ length: j - m }, (v, h) => m + h), O = (j - m) * H, z = o.includes(c) && l >= m * 60 && l <= j * 60;
  return g.useEffect(() => {
    if (!z || !x.current) return;
    const v = (l - m * 60) / 60 * H;
    x.current.scrollTop = Math.max(0, v - 120);
  }, [z, m]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
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
                onClick: () => u(h),
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
            p[v].slice(0, 4).map((h) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => i(h),
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
            p[v].length > 4 && /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => u(v),
                className: "px-1.5 text-left text-[10.5px] font-medium text-text-tertiary hover:text-text-primary",
                children: [
                  "+",
                  p[v].length - 4,
                  " öğe"
                ]
              }
            )
          ] }, v))
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
              n[v].map((h) => {
                const I = me(h.startTime), w = h.endTime ? me(h.endTime) : I + 60, S = (I - m * 60) / 60 * H, M = Math.max((w - I) / 60 * H, 18);
                return /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => i(h),
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
                  style: { top: `${(l - m * 60) / 60 * H}px` },
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
function Yt({ item: t }) {
  var b;
  const [a, s] = g.useState(""), [r, i] = g.useState(() => /* @__PURE__ */ new Set()), u = t.description ?? t.subtitle ?? "", d = U({
    queryKey: ["calendar", "projects-lookup"],
    queryFn: () => R.get("/api/app/task/projects-lookup"),
    staleTime: 10 * 6e4
  }), c = _({
    mutationFn: async () => {
      const o = new FormData();
      o.append("file", new Blob([`${t.title}

${u}`], { type: "text/plain" }), "toplanti-notlari.txt");
      const n = await fetch(`/api/ai-task-generator/parse?projectId=${a}`, {
        method: "POST",
        body: o,
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });
      if (!n.ok) throw new Error("Notlardan görev çıkarılamadı.");
      return n.json();
    },
    onSuccess: (o) => i(new Set(((o == null ? void 0 : o.suggestions) ?? []).map((n, p) => p)))
  }), x = _({
    mutationFn: () => {
      var o;
      return R.post("/api/ai-task-generator/create-tasks", {
        projectId: a,
        approvedTasks: (((o = c.data) == null ? void 0 : o.suggestions) ?? []).filter((n, p) => r.has(p))
      });
    }
  }), l = ((b = c.data) == null ? void 0 : b.suggestions) ?? [];
  return /* @__PURE__ */ e.jsxs("section", { className: "border-t border-subtle px-4 py-3", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Toplantıdan görev" }),
    !u && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[11.5px] text-text-tertiary", children: "Bu etkinlikte not yok — çıkarılacak aksiyon maddesi bulunamaz." }),
    u && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
      l.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", children: [
        l.map((o, n) => /* @__PURE__ */ e.jsxs("label", { className: "flex cursor-pointer items-start gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: r.has(n),
              onChange: () => i((p) => {
                const f = new Set(p);
                return f.has(n) ? f.delete(n) : f.add(n), f;
              }),
              className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[12px] text-text-primary", children: o.title })
        ] }, `${o.title}-${n}`)),
        /* @__PURE__ */ e.jsx(
          $,
          {
            size: "sm",
            variant: "primary",
            className: y("mt-2"),
            disabled: r.size === 0 || x.isPending || x.isSuccess,
            onClick: () => x.mutate(),
            children: x.isSuccess ? `${x.data} görev eklendi` : x.isPending ? "Ekleniyor…" : `${r.size} görev olarak ekle`
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
function Ut({ item: t, capacity: a, onClose: s, onReschedule: r, onComplete: i, isPending: u, error: d, onRetry: c }) {
  const [x, l] = g.useState(() => t.date.slice(0, 10)), b = P[t.source], o = Gt[t.risk], n = t.date.slice(0, 10);
  g.useEffect(() => l(n), [n]);
  const p = () => {
    !x || x === n || r(t, /* @__PURE__ */ new Date(`${x}T00:00:00`));
  };
  return /* @__PURE__ */ e.jsx(ie, { open: !0, onOpenChange: (f) => {
    f || s();
  }, children: /* @__PURE__ */ e.jsxs(le, { side: "right", title: t.title, className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md bg-neutral-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary", children: [
          b && /* @__PURE__ */ e.jsx("i", { className: y("fa text-[10px]", b.icon), "aria-hidden": "true" }),
          b == null ? void 0 : b.label
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
    u && /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle px-4 py-2 text-[12px] text-text-tertiary", "aria-live": "polite", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "kaydediliyor…"
    ] }),
    t.canReschedule && !t.isDone && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs($, { size: "sm", variant: "secondary", onClick: () => i(t), children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-check me-1.5", "aria-hidden": "true" }),
        "Tamamla"
      ] }),
      /* @__PURE__ */ e.jsx(
        $,
        {
          size: "sm",
          variant: "outline",
          onClick: () => r(t, F(/* @__PURE__ */ new Date(`${n}T00:00:00`), 1)),
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
            value: x,
            onChange: (f) => l(f.target.value),
            className: "rounded-md border border-default bg-surface-base px-2 py-1 text-[12.5px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": "Son tarih"
          }
        ),
        x !== n && /* @__PURE__ */ e.jsx($, { size: "sm", variant: "primary", onClick: p, children: "Uygula" })
      ] }) : /* @__PURE__ */ e.jsxs("span", { className: "text-text-secondary", children: [
        N.dayTitle(/* @__PURE__ */ new Date(`${n}T00:00:00`)),
        /* @__PURE__ */ e.jsx("span", { className: "ml-1.5 text-text-tertiary", children: "· takvimden değiştirilemez" })
      ] }) }),
      /* @__PURE__ */ e.jsx(se, { label: "Bağlam", children: t.subtitle }),
      /* @__PURE__ */ e.jsx(se, { label: "Atanan", children: t.assigneeName }),
      /* @__PURE__ */ e.jsx(se, { label: "Tutar", children: t.amount != null ? N.money(t.amount, t.currency) : null }),
      /* @__PURE__ */ e.jsx(se, { label: "Gün yükü", children: t.loadHours != null ? `${N.hours(t.loadHours)}${a ? ` / ${N.hours(a)} kapasite` : ""}` : null })
    ] }),
    t.source === 7 && /* @__PURE__ */ e.jsx(Yt, { item: t }),
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
    /* ABP konvansiyonu: UpdateSyncRulesAsync → PUT (POST 405). */
    mutationFn: (a) => R.put("/api/app/calendar/sync-rules", a),
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
}, Be = {
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
  const r = ta[t.provider] ?? { label: "Takvim", icon: "fa-calendar", brand: "bg-neutral-700" }, [i, u] = g.useState(() => new Set(t.syncSources ?? [])), [d, c] = g.useState(t.conflictRule ?? 0), [x, l] = g.useState(t.isSyncEnabled);
  g.useEffect(() => {
    u(new Set(t.syncSources ?? [])), c(t.conflictRule ?? 0), l(t.isSyncEnabled);
  }, [t]);
  const b = x !== t.isSyncEnabled || d !== t.conflictRule || i.size !== (t.syncSources ?? []).length || [...i].some((n) => !(t.syncSources ?? []).includes(n)), o = (n) => u((p) => {
    const f = new Set(p);
    return f.has(n) ? f.delete(n) : f.add(n), f;
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
            checked: x,
            onChange: (n) => l(n.target.checked),
            className: "h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
          }
        ),
        "Açık"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Bu hesaba ne gitsin?" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Ne.map((n) => {
        var f, m;
        const p = i.has(n);
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": p,
            onClick: () => o(n),
            className: y(
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              p ? "border-accent bg-primary-subtle text-accent" : "border-subtle bg-surface-base text-text-tertiary hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: y("fa text-[10px]", (f = P[n]) == null ? void 0 : f.icon), "aria-hidden": "true" }),
              (m = P[n]) == null ? void 0 : m.label
            ]
          },
          n
        );
      }) }),
      i.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-text-tertiary", children: "Hiçbiri seçili değil — yalnız görevler gönderilir." }),
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Çakışma kuralı" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: Object.entries(aa).map(([n, p]) => {
        const f = Number(n), m = d === f;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => c(f),
            className: y(
              "rounded-md border px-2.5 py-2 text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              m ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("span", { className: y("block text-[12px] font-semibold", m ? "text-accent" : "text-text-primary"), children: p.title }),
              /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] leading-snug text-text-tertiary", children: p.desc })
            ]
          },
          n
        );
      }) }),
      b && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          $,
          {
            size: "sm",
            variant: "primary",
            disabled: s,
            onClick: () => a({
              accountId: t.id,
              isSyncEnabled: x,
              syncSources: [...i],
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
  const a = Wt(t), s = Vt(), r = Xt(t), i = Jt(), u = Zt(), d = ea(), [c, x] = g.useState(""), [l, b] = g.useState(""), [o, n] = g.useState(60), [p, f] = g.useState(!1), m = (D = a.data) != null && D.path ? `${window.location.origin}${a.data.path}` : "", j = async () => {
    try {
      await navigator.clipboard.writeText(m), f(!0), setTimeout(() => f(!1), 2e3);
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
            value: m,
            "aria-label": "iCal abonelik bağlantısı",
            className: "min-w-0 flex-1 truncate rounded-md border border-default bg-surface-sunken px-2 py-1 font-mono text-[11px] text-text-secondary"
          }
        ),
        /* @__PURE__ */ e.jsx($, { size: "sm", variant: "outline", onClick: j, disabled: !m, children: p ? "Kopyalandı" : "Kopyala" })
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
              x(h.target.value), d.reset();
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
              value: l,
              onChange: (h) => b(h.target.value),
              placeholder: ((z = d.data) == null ? void 0 : z.suggestedName) || "Görünen ad",
              "aria-label": "Görünen ad",
              className: "min-w-0 flex-1 rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              value: o,
              onChange: (h) => n(Number(h.target.value)),
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
              disabled: !c || i.isPending,
              onClick: () => i.mutate(
                { url: c, displayName: l, color: "accent", refreshMinutes: o },
                { onSuccess: () => {
                  x(""), b(""), d.reset();
                } }
              ),
              children: i.isPending ? "Ekleniyor…" : "Takvimi ekle"
            }
          )
        ] }),
        i.isError && /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-negative-700", children: ((v = i.error) == null ? void 0 : v.message) || "Takvim eklenemedi." }),
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
function ia({ open: t, onClose: a }) {
  const { data: s, isPending: r } = Qt(t), i = Ht();
  return /* @__PURE__ */ e.jsx(ie, { open: t, onOpenChange: (u) => {
    u || a();
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
      ) }) : s.accounts.map((u) => /* @__PURE__ */ e.jsx(
        sa,
        {
          account: u,
          saving: i.isPending,
          onSave: (d) => i.mutate(d)
        },
        u.id
      )),
      /* @__PURE__ */ e.jsx(na, { open: t }),
      /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
        /* @__PURE__ */ e.jsx("header", { className: "border-b border-subtle px-3 py-2", children: /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-semibold text-text-primary", children: "Senkron günlüğü" }) }),
        /* @__PURE__ */ e.jsx("div", { className: "px-3 py-2", children: ((s == null ? void 0 : s.log) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-2 text-[11.5px] text-text-tertiary", children: "Henüz senkron kaydı yok." }) : s.log.map((u) => {
          const d = Be[u.kind] ?? Be[0];
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
            /* @__PURE__ */ e.jsx("i", { className: y("fa mt-0.5 shrink-0 text-[11px]", d.icon, d.cls), "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[11.5px] leading-snug text-text-secondary", children: u.message }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: $e(u.occurredAt) })
          ] }, u.id);
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
    /* ABP konvansiyonu: Update* metotları PUT'a düşer. POST 405 döner ve
       ayarlar SESSİZCE kaydedilmemiş olur. */
    mutationFn: (a) => R.put("/api/app/calendar/preferences", a),
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
function da({ open: t, items: a, today: s, capacity: r, onClose: i }) {
  const { suggestions: u, fixed: d } = g.useMemo(
    () => Dt(a, { today: s, capacity: r }),
    [a, s, r]
  ), [c, x] = g.useState(() => new Set(u.map((m) => m.item.key))), l = ca(), b = l.data ?? [], o = new Map(b.filter((m) => !m.succeeded).map((m) => [m.sourceId, m.error])), n = (m) => x((j) => {
    const D = new Set(j);
    return D.has(m) ? D.delete(m) : D.add(m), D;
  }), p = u.filter((m) => c.has(m.item.key)), f = () => {
    l.mutate(
      p.map((m) => ({
        source: m.item.source,
        sourceId: m.item.sourceId,
        newDate: C(m.date)
      })),
      {
        onSuccess: (m) => {
          (m ?? []).every((j) => j.succeeded) && i();
        }
      }
    );
  };
  return /* @__PURE__ */ e.jsx(ie, { open: t, onOpenChange: (m) => {
    m || i();
  }, children: /* @__PURE__ */ e.jsxs(le, { side: "right", title: "Akıllı erteleme", className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-semibold text-text-primary", children: "Akıllı erteleme" }),
        /* @__PURE__ */ e.jsxs("p", { className: "mt-0.5 text-[11.5px] leading-snug text-text-tertiary", children: [
          u.length > 0 ? `${u.length} gecikmiş öğe için boş günlere dağıtılmış tarihler önerildi.` : "Ertelenecek gecikmiş öğe yok.",
          r ? ` Günlük kapasite ${N.hours(r)}.` : ""
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
      u.map(({ item: m, date: j }) => {
        const D = o.get(m.sourceId);
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
                  checked: c.has(m.key),
                  onChange: () => n(m.key),
                  className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] font-semibold text-text-primary", children: m.title }),
                /* @__PURE__ */ e.jsxs("span", { className: "mt-0.5 flex items-center gap-1.5 text-[11px] text-text-tertiary", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "line-through", children: N.dayShort(/* @__PURE__ */ new Date(`${m.date.slice(0, 10)}T00:00:00`)) }),
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right text-[9px]", "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-accent", children: N.dayShort(j) }),
                  m.loadHours != null && /* @__PURE__ */ e.jsxs("span", { children: [
                    "· ",
                    N.hours(m.loadHours)
                  ] })
                ] }),
                D && /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] font-medium text-negative-700", children: D })
              ] })
            ]
          },
          m.key
        );
      }),
      d.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 border-t border-subtle pt-2", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Ertelenemez" }),
        d.map((m) => {
          var j;
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 py-1.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock mt-1 shrink-0 text-[10px] text-text-tertiary", "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] text-text-secondary", children: m.title }),
              /* @__PURE__ */ e.jsxs("span", { className: "block text-[11px] text-text-tertiary", children: [
                (j = P[m.source]) == null ? void 0 : j.label,
                " — vadesi takvimden değiştirilemez"
              ] })
            ] })
          ] }, m.key);
        })
      ] })
    ] }),
    u.length > 0 && /* @__PURE__ */ e.jsxs("footer", { className: "flex items-center gap-2 border-t border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsx(
        $,
        {
          size: "sm",
          variant: "primary",
          disabled: p.length === 0 || l.isPending,
          onClick: f,
          children: l.isPending ? "Erteleniyor…" : `${p.length} öğeyi ertele`
        }
      ),
      /* @__PURE__ */ e.jsx($, { size: "sm", variant: "ghost", onClick: i, children: "Vazgeç" })
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
  const [r, i] = g.useState(0), [u, d] = g.useState(() => new Set(Ne)), [c, x] = g.useState(8), l = oa(), b = () => {
    l.mutate(
      {
        dailyCapacityHours: c > 0 ? c : 0,
        sources: [...u],
        setupCompleted: !0
      },
      { onSettled: s }
    );
  }, o = (n) => d((p) => {
    const f = new Set(p);
    return f.has(n) ? f.delete(n) : f.add(n), f;
  });
  return /* @__PURE__ */ e.jsx(He, { open: t, onOpenChange: (n) => {
    n || s();
  }, children: /* @__PURE__ */ e.jsxs(We, { className: "w-full max-w-[520px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-5 py-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[18px] font-semibold tracking-tight text-text-primary", children: "Takviminizi kurun" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: "Hangi kaynakları göreceğinizi seçin, dilerseniz dış takvim bağlayın. Her ayarı sonradan değiştirebilirsiniz." }),
      /* @__PURE__ */ e.jsx("ol", { className: "mt-3 flex items-center gap-2", children: xe.map((n, p) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx("span", { className: y(
          "flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold",
          p === r ? "bg-accent text-white" : p < r ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
        ), children: p + 1 }),
        /* @__PURE__ */ e.jsx("span", { className: y(
          "text-[11.5px]",
          p === r ? "font-semibold text-text-primary" : "text-text-tertiary"
        ), children: n }),
        p < xe.length - 1 && /* @__PURE__ */ e.jsx("span", { className: "ms-1 text-text-tertiary", children: "·" })
      ] }, n)) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-5 py-4", children: [
      r === 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Takvimde ne görünsün?" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex flex-col gap-1.5", children: Ne.map((n) => {
          var m, j;
          const p = u.has(n), f = a == null ? void 0 : a[n];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": p,
              onClick: () => o(n),
              className: y(
                "flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                p ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: y("fa text-[12px]", (m = P[n]) == null ? void 0 : m.icon, p ? "text-accent" : "text-text-tertiary"), "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-medium text-text-primary", children: (j = P[n]) == null ? void 0 : j.label }),
                f != null && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: f })
              ]
            },
            n
          );
        }) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-[13px] font-semibold text-text-primary", children: "Günlük kapasiteniz" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex gap-1.5", children: ua.map((n) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => x(n.value),
            className: y(
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
      /* @__PURE__ */ e.jsx($, { size: "sm", variant: "ghost", onClick: b, disabled: l.isPending, children: "Şimdilik atla" }),
      r < xe.length - 1 ? /* @__PURE__ */ e.jsx($, { size: "sm", variant: "primary", onClick: () => i((n) => n + 1), children: "Devam" }) : /* @__PURE__ */ e.jsx($, { size: "sm", variant: "primary", onClick: b, disabled: l.isPending, children: l.isPending ? "Kaydediliyor…" : "Bitir" })
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
function Ye({ children: t }) {
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
          /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center gap-1", children: r.keys.map((i) => /* @__PURE__ */ e.jsx(Ye, { children: i }, i)) }),
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
function ba({ polite: t, assertive: a }) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("p", { role: "status", "aria-live": "polite", className: "sr-only", children: t }),
    /* @__PURE__ */ e.jsx("p", { role: "alert", "aria-live": "assertive", className: "sr-only", children: a })
  ] });
}
const fa = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
function ha({ items: t, month: a, today: s, generatedAt: r }) {
  var n;
  const i = Je(a), u = C(s), d = {};
  for (const p of t ?? [])
    (d[n = p.date.slice(0, 10)] ?? (d[n] = [])).push(p);
  const c = Ce(s), x = (t ?? []).filter((p) => {
    const f = p.date.slice(0, 10);
    return f >= C(c) && f <= C(F(c, 7));
  }), { overdue: l, days: b } = et(x, s), o = (p) => p === K.OVERDUE ? "border-l-[3px] border-l-black" : p === K.DUE_TODAY ? "border-l-[3px] border-l-neutral-500" : "border-l-[3px] border-l-neutral-300";
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
      /* @__PURE__ */ e.jsx("div", { className: "mt-3 grid grid-cols-7", children: fa.map((p) => /* @__PURE__ */ e.jsx("div", { className: "pb-1 text-[7.5pt] font-bold uppercase tracking-wide text-neutral-500", children: p }, p)) }),
      /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-l border-t border-neutral-300", children: i.map((p) => {
        const f = C(p), m = d[f] ?? [], j = p.getMonth() !== a.getMonth();
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: y(
              "min-h-[62px] border-b border-r border-neutral-300 p-1",
              f === u && "ring-1 ring-inset ring-black"
            ),
            children: [
              /* @__PURE__ */ e.jsx("p", { className: y(
                "text-right font-mono text-[9pt] font-semibold",
                j ? "text-neutral-300" : "text-neutral-700"
              ), children: p.getDate() }),
              m.slice(0, 4).map((D) => /* @__PURE__ */ e.jsx(
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
              m.length > 4 && /* @__PURE__ */ e.jsxs("p", { className: "mt-0.5 text-[7pt] text-neutral-500", children: [
                "+",
                m.length - 4,
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
        l.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-4 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "border-b-2 border-black pb-1 text-[9pt] font-bold uppercase tracking-wide", children: [
            "Gecikmiş · ",
            l.length
          ] }),
          l.map((p) => /* @__PURE__ */ e.jsx(Ge, { item: p, showDate: !0 }, p.key))
        ] }),
        b.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "mb-4 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "border-b border-black pb-1 text-[9pt] font-bold uppercase tracking-wide", children: [
            N.dayTitle(p.date),
            p.isToday ? " · Bugün" : ""
          ] }),
          p.items.map((f) => /* @__PURE__ */ e.jsx(Ge, { item: f }, f.key))
        ] }, p.key))
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
  const i = (a ?? []).map(C);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 px-2 pb-1", children: [
    t.map((u) => {
      const d = {};
      for (const c of u.days ?? []) d[c.date.slice(0, 10)] = c;
      return /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "truncate text-[11.5px] font-medium text-text-primary", children: u.name }),
          /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] tabular-nums text-text-tertiary", children: N.hours(u.totalHours) })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-0.5 flex gap-[2px]", children: (i.length ? i : (u.days ?? []).map((c) => c.date.slice(0, 10))).map((c) => {
          const x = d[c], l = (x == null ? void 0 : x.hours) ?? 0, b = s && l > s, o = s ? Math.min(l / s, 1) : l > 0 ? 1 : 0;
          return /* @__PURE__ */ e.jsx(
            "span",
            {
              title: `${c}: ${N.hours(l)}${x != null && x.itemCount ? ` · ${x.itemCount} öğe` : ""}`,
              className: "h-[6px] flex-1 overflow-hidden rounded-sm bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: y("block h-full", b ? "bg-negative" : "bg-accent"),
                  style: { width: `${o * 100}%` }
                }
              )
            },
            c
          );
        }) })
      ] }, u.userId);
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
    placeholderData: (i) => i
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
  const [a] = g.useState(va), [s, r] = g.useState(() => a ?? t), [i, u] = g.useState(ja);
  g.useEffect(() => {
    const b = new URL(window.location.href);
    b.searchParams.get("view") !== s && (b.searchParams.set("view", s), window.history.replaceState({}, "", b));
  }, [s]);
  const d = g.useCallback((b) => {
    be.includes(b) && (r(b), ve(rt, b));
  }, []), c = g.useCallback((b) => {
    u((o) => {
      const n = new Set(o);
      return n.has(b) ? n.delete(b) : n.add(b), ve(De, [...n].join(",")), n;
    });
  }, []), x = g.useCallback((b) => {
    a || be.includes(b) && r((o) => o === b ? o : b);
  }, [a]), l = g.useCallback(() => {
    const b = new Set(ne);
    u(b), ve(De, [...b].join(","));
  }, []);
  return { view: s, setView: d, applyResponsiveDefault: x, enabledSources: i, toggleSource: c, resetSources: l };
}
const G = ["calendar", "feed"];
function wa(t, a, s) {
  t.setQueriesData({ queryKey: G }, (r) => r != null && r.items ? {
    ...r,
    items: r.items.map((i) => i.key === a ? { ...i, date: `${s}T00:00:00` } : i)
  } : r);
}
function Sa(t, a) {
  t.setQueriesData({ queryKey: G }, (s) => s != null && s.items ? {
    ...s,
    items: s.items.map((r) => r.key === a ? { ...r, isDone: !0, risk: 0, loadHours: null } : r)
  } : s);
}
function Da({ onOfflineFailure: t } = {}) {
  const a = W(), [s, r] = g.useState(null), [i, u] = g.useState({}), [d, c] = g.useState({}), x = g.useCallback((o) => {
    u((n) => {
      if (!n[o]) return n;
      const p = { ...n };
      return delete p[o], p;
    });
  }, []), l = _({
    mutationFn: ({ item: o, newDate: n }) => R.post("/api/app/calendar/reschedule-item", {
      source: o.source,
      sourceId: o.sourceId,
      newDate: C(n)
    }),
    onMutate: async ({ item: o, newDate: n }) => {
      await a.cancelQueries({ queryKey: G });
      const p = a.getQueriesData({ queryKey: G });
      return x(o.key), c((f) => ({ ...f, [o.key]: !0 })), wa(a, o.key, C(n)), { snapshot: p, previousDate: o.date.slice(0, 10) };
    },
    onError: (o, { item: n, newDate: p }, f) => {
      var m;
      if (typeof navigator < "u" && !navigator.onLine) {
        t == null || t({
          key: n.key,
          payload: { source: n.source, sourceId: n.sourceId, newDate: C(p) }
        });
        return;
      }
      (m = f == null ? void 0 : f.snapshot) == null || m.forEach(([j, D]) => a.setQueryData(j, D)), u((j) => ({
        ...j,
        [n.key]: (o == null ? void 0 : o.message) || "Kaydedilemedi — tarih değişmedi."
      }));
    },
    onSuccess: (o, { item: n, newDate: p }, f) => {
      r({
        key: n.key,
        message: `“${n.title}” ${C(p)} tarihine taşındı.`,
        undo: () => l.mutate({
          item: { ...n, date: `${C(p)}T00:00:00` },
          newDate: /* @__PURE__ */ new Date(`${f.previousDate}T00:00:00`)
        })
      });
    },
    onSettled: (o, n, { item: p }) => {
      c((f) => {
        const m = { ...f };
        return delete m[p.key], m;
      }), a.invalidateQueries({ queryKey: G });
    }
  }), b = _({
    mutationFn: ({ item: o }) => R.post("/api/app/calendar/complete-item", {
      source: o.source,
      sourceId: o.sourceId
    }),
    onMutate: async ({ item: o }) => {
      await a.cancelQueries({ queryKey: G });
      const n = a.getQueriesData({ queryKey: G });
      return x(o.key), c((p) => ({ ...p, [o.key]: !0 })), Sa(a, o.key), { snapshot: n };
    },
    onError: (o, { item: n }, p) => {
      var f;
      (f = p == null ? void 0 : p.snapshot) == null || f.forEach(([m, j]) => a.setQueryData(m, j)), u((m) => ({
        ...m,
        [n.key]: (o == null ? void 0 : o.message) || "Tamamlanamadı."
      }));
    },
    onSuccess: (o, { item: n }) => {
      r({ key: n.key, message: `“${n.title}” tamamlandı.`, undo: null });
    },
    onSettled: (o, n, { item: p }) => {
      c((f) => {
        const m = { ...f };
        return delete m[p.key], m;
      }), a.invalidateQueries({ queryKey: G });
    }
  });
  return {
    reschedule: (o, n) => l.mutate({ item: o, newDate: n }),
    complete: (o) => b.mutate({ item: o }),
    retry: (o, n) => n ? l.mutate({ item: o, newDate: n }) : b.mutate({ item: o }),
    lastAction: s,
    dismissAction: () => r(null),
    errors: i,
    clearError: x,
    pending: d
  };
}
function Ca({ from: t, to: a, enabled: s = !0 }) {
  const r = C(t), i = C(a);
  return U({
    queryKey: ["calendar", "external", r, i],
    queryFn: () => R.get(`/api/app/calendar/external-events?From=${r}&To=${i}`),
    enabled: s,
    staleTime: 12e4,
    retry: !1,
    placeholderData: (u) => u
  });
}
const Ta = ["INPUT", "TEXTAREA", "SELECT"];
function Ea({
  onView: t,
  onToday: a,
  onPrev: s,
  onNext: r,
  onDeferSelected: i,
  onUndo: u,
  onToggleHelp: d,
  enabled: c = !0
}) {
  g.useEffect(() => {
    if (!c) return;
    const x = (l) => {
      const b = l.target;
      if (!(Ta.includes(b == null ? void 0 : b.tagName) || b != null && b.isContentEditable)) {
        if ((l.metaKey || l.ctrlKey) && l.key.toLowerCase() === "z") {
          l.preventDefault(), u == null || u();
          return;
        }
        if (!(l.metaKey || l.ctrlKey || l.altKey)) {
          if (l.shiftKey) {
            l.key === "ArrowRight" && (l.preventDefault(), i == null || i(1)), l.key === "ArrowLeft" && (l.preventDefault(), i == null || i(-1)), l.key === "?" && (l.preventDefault(), d == null || d());
            return;
          }
          switch (l.key) {
            case "?":
              l.preventDefault(), d == null || d();
              break;
            case "t":
            case "T":
              l.preventDefault(), a == null || a();
              break;
            case "m":
            case "M":
              l.preventDefault(), t == null || t("month");
              break;
            case "w":
            case "W":
              l.preventDefault(), t == null || t("week");
              break;
            case "d":
            case "D":
              l.preventDefault(), t == null || t("day");
              break;
            case "a":
            case "A":
              l.preventDefault(), t == null || t("agenda");
              break;
            case "PageUp":
              l.preventDefault(), s == null || s();
              break;
            case "PageDown":
              l.preventDefault(), r == null || r();
              break;
          }
        }
      }
    };
    return window.addEventListener("keydown", x), () => window.removeEventListener("keydown", x);
  }, [c, t, a, s, r, i, u, d]);
}
function $a({ from: t, to: a, enabled: s }) {
  const r = C(t), i = C(a);
  return U({
    queryKey: ["calendar", "team-load", r, i],
    queryFn: () => R.get(`/api/app/calendar/team-load?From=${r}&To=${i}`),
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
  const [a, s] = g.useState(() => typeof navigator > "u" ? !0 : navigator.onLine), [r, i] = g.useState(() => je().length), u = g.useRef(!1), d = g.useCallback((x) => {
    const b = je().filter((o) => o.key !== x.key).concat(x);
    Ue(b), i(b.length);
  }, []), c = g.useCallback(async () => {
    if (u.current) return;
    const x = je();
    if (x.length !== 0) {
      u.current = !0;
      try {
        const l = [];
        for (const b of x)
          try {
            await t(b);
          } catch {
            l.push(b);
          }
        Ue(l), i(l.length);
      } finally {
        u.current = !1;
      }
    }
  }, [t]);
  return g.useEffect(() => {
    const x = () => {
      s(!0), c();
    }, l = () => s(!1);
    return window.addEventListener("online", x), window.addEventListener("offline", l), navigator.onLine && c(), () => {
      window.removeEventListener("online", x), window.removeEventListener("offline", l);
    };
  }, [c]), { isOnline: a, pendingCount: r, enqueue: d, flush: c };
}
function Aa() {
  const t = g.useRef(null), [a, s] = g.useState(0);
  return g.useLayoutEffect(() => {
    const r = t.current;
    if (!r || (s(r.getBoundingClientRect().width), typeof ResizeObserver > "u")) return;
    const i = new ResizeObserver((u) => {
      for (const d of u)
        s(d.contentRect.width);
    });
    return i.observe(r), () => i.disconnect();
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
  const [t, a] = Aa(), s = za(a), r = s === "narrow", i = g.useMemo(() => we(/* @__PURE__ */ new Date()), []), [u, d] = g.useState(i), [c, x] = g.useState(null), [l, b] = g.useState(null), [o, n] = g.useState(!1), [p, f] = g.useState(!1), [m, j] = g.useState(!1), [D, O] = g.useState(!1), [z, v] = g.useState(null), [h, I] = g.useState(!1), { view: w, setView: S, applyResponsiveDefault: M, enabledSources: Z, toggleSource: he, resetSources: V } = Na();
  g.useEffect(() => {
    a !== 0 && M(r ? "agenda" : "month");
  }, [a, r, M]);
  const { range: L, title: ee, weekDayList: X } = g.useMemo(() => {
    if (w === "agenda")
      return {
        range: { from: F(i, -60), to: F(i, Ka) },
        title: "Ajanda",
        weekDayList: null
      };
    if (w === "week") {
      const E = Nt(u);
      return {
        range: { from: E[0], to: E[6] },
        title: `${N.dayShort(E[0])} – ${N.dayShort(E[6])} ${E[6].getFullYear()}`,
        weekDayList: E
      };
    }
    if (w === "day") {
      const E = we(u);
      return { range: { from: E, to: E }, title: N.dayTitle(E), weekDayList: [E] };
    }
    const k = Xe(u);
    return {
      range: { from: k, to: F(k, Te - 1) },
      title: N.monthTitle(u),
      weekDayList: null
    };
  }, [w, u, i]), { data: T, isPending: Q, isError: lt, refetch: ot } = ka(L), te = Ca(L), Re = la(), Ae = $a({ from: L.from, to: L.to, enabled: h }), q = Ra({
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
  ), B = g.useMemo(() => Ze(J), [J]), Y = (T == null ? void 0 : T.dailyCapacityHours) ?? null, ze = g.useMemo(() => {
    const k = {};
    for (const E of (T == null ? void 0 : T.sources) ?? []) k[E.source] = E.count;
    return k;
  }, [T]), ct = g.useMemo(() => Y ? Object.values(B).filter((k) => fe(k) > Y).length : 0, [B, Y]);
  g.useEffect(() => {
    c && !B[c] && !Q && (c >= C(L.from) && c <= C(L.to) || x(null));
  }, [c, B, Q, L]);
  const de = g.useCallback((k) => b(k.key), []), Ke = g.useCallback(() => {
    d(i), x(C(i));
  }, [i]), A = Da({ onOfflineFailure: q.enqueue }), dt = g.useCallback((k) => {
    const E = z ?? c;
    if (E)
      for (const ye of B[E] ?? [])
        ye.canReschedule && !ye.isDone && A.reschedule(ye, F(/* @__PURE__ */ new Date("T00:00:00"), k));
  }, [z, c, B, A]);
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
  const Oe = ce.length > 0, ut = Oe && J.length === 0, xt = c ? B[c] ?? [] : [], ae = l ? ce.find((k) => k.key === l) ?? null : null, ge = c && /* @__PURE__ */ e.jsx(
    Et,
    {
      dayKey: c,
      items: xt,
      capacity: Y,
      onSelectItem: de,
      onClose: () => x(null)
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
          onOpenSync: () => n(!0),
          teamOpen: h,
          onToggleTeam: () => I((k) => !k),
          teamContent: h ? /* @__PURE__ */ e.jsx(
            ga,
            {
              rows: Ae.data,
              days: X,
              capacity: Y,
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
          month: u,
          byDay: B,
          today: i,
          capacity: Y,
          selectedDay: c,
          onSelectItem: de,
          onSelectDay: x,
          onDropItem: A.reschedule,
          focusedDay: z,
          onFocusDay: v,
          onNavigate: (k) => d(k),
          pending: A.pending,
          errors: A.errors
        }
      ) : X ? /* @__PURE__ */ e.jsx(
        Bt,
        {
          days: X,
          byDay: B,
          today: i,
          capacity: Y,
          selectedDay: c,
          onSelectItem: de,
          onSelectDay: x
        }
      ) : /* @__PURE__ */ e.jsx(
        Tt,
        {
          items: J,
          today: i,
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
      k || x(null);
    }, children: /* @__PURE__ */ e.jsx(le, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: ge }) }),
    r && c && /* @__PURE__ */ e.jsx(ie, { open: !0, onOpenChange: (k) => {
      k || x(null);
    }, children: /* @__PURE__ */ e.jsx(le, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: ge }) }),
    /* @__PURE__ */ e.jsx(
      ha,
      {
        items: J,
        month: u,
        today: i,
        generatedAt: N.dayShort(i)
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
    /* @__PURE__ */ e.jsx(ia, { open: o, onClose: () => n(!1) }),
    /* @__PURE__ */ e.jsx(
      da,
      {
        open: p,
        items: J,
        today: i,
        capacity: Y,
        onClose: () => f(!1)
      }
    ),
    /* @__PURE__ */ e.jsx(
      xa,
      {
        open: Re.data ? !Re.data.setupCompleted && !m : !1,
        counts: ze,
        onDone: () => j(!0)
      }
    ),
    ae && /* @__PURE__ */ e.jsx(
      Ut,
      {
        item: ae,
        capacity: Y,
        onClose: () => b(null),
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
