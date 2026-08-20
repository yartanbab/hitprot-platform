import { j as e, d as pe, r as h, b as yt } from "./react-vendor.js";
import { c as y, B as $, d as oe, e as ce, S as ie, D as Je, i as Ze, T as kt } from "./Dialog.js";
import { D as vt } from "./useDeviceMode.js";
import { a as jt } from "./QueryProvider.js";
import { E as de } from "./EmptyState.js";
import { a as R } from "./httpClient.js";
import { u as W, b as _, a as ee } from "./query-vendor.js";
/* empty css      */
const P = {
  1: { key: "task", label: "Görev", plural: "görev", icon: "fa-circle-check" },
  2: { key: "invoice", label: "Fatura", plural: "fatura", icon: "fa-file-invoice" },
  3: { key: "grant", label: "Hibe", plural: "hibe", icon: "fa-award" },
  4: { key: "expense", label: "Gider", plural: "gider", icon: "fa-arrow-trend-down" },
  5: { key: "income", label: "Gelir", plural: "gelir", icon: "fa-arrow-trend-up" },
  6: { key: "cash", label: "Kasa hareketi", plural: "kasa hareketi", icon: "fa-wallet" },
  7: { key: "external", label: "Dış etkinlik", plural: "dış etkinlik", icon: "fa-calendar-days" }
}, le = [1, 2, 3, 4, 5, 6, 7], Se = [1, 2, 3, 4, 5, 6], z = { DUE_TODAY: 1, OVERDUE: 2 }, Nt = (t) => t.risk === z.OVERDUE || t.risk === z.DUE_TODAY, et = 864e5, De = (t) => new Date(t.getFullYear(), t.getMonth(), t.getDate()), F = (t, a) => new Date(t.getFullYear(), t.getMonth(), t.getDate() + a);
function T(t) {
  const a = (s) => (s < 10 ? "0" : "") + s;
  return `${t.getFullYear()}-${a(t.getMonth() + 1)}-${a(t.getDate())}`;
}
function Ee(t) {
  const a = (t.getDay() + 6) % 7;
  return new Date(t.getTime() - a * et);
}
const tt = (t) => Ee(new Date(t.getFullYear(), t.getMonth(), 1)), $e = 42;
function at(t) {
  const a = tt(t);
  return Array.from({ length: $e }, (s, r) => new Date(a.getTime() + r * et));
}
const wt = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }), St = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }), Dt = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }), w = {
  monthTitle: (t) => wt.format(t),
  dayTitle: (t) => St.format(t),
  dayShort: (t) => Dt.format(t),
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
function st(t) {
  const a = {};
  for (const s of t ?? []) {
    const r = (s.date || "").slice(0, 10);
    r && (a[r] ?? (a[r] = [])).push(s);
  }
  return a;
}
const ge = (t) => (t ?? []).reduce((a, s) => a + (s.loadHours ?? 0), 0);
function Ct(t, { maxPills: a = 3, maxRiskPills: s = 2 } = {}) {
  const r = t ?? [];
  if (r.length === 0) return { pills: [], summaries: [] };
  if (r.length <= a) return { pills: r, summaries: [] };
  const m = r.filter(Nt).slice(0, s), p = new Set(m.map((o) => o.key)), x = /* @__PURE__ */ new Map();
  for (const o of r) {
    if (p.has(o.key)) continue;
    const f = x.get(o.source) ?? { source: o.source, count: 0, amount: 0, hasAmount: !1, only: null };
    f.count += 1, f.only = f.count === 1 ? o : null, o.amount != null && (f.amount += o.amount, f.hasAmount = !0), x.set(o.source, f);
  }
  const b = [];
  for (const o of le) {
    const f = x.get(o);
    f && (f.count === 1 && f.only ? m.push(f.only) : b.push(f));
  }
  return { pills: m, summaries: b };
}
function Tt(t, { compact: a = !0 } = {}) {
  const s = P[t.source], r = `${t.count} ${s ? s.plural : "öğe"}`;
  if (!t.hasAmount) return r;
  const i = a ? w.moneyCompact(t.amount) : w.money(t.amount);
  return `${r} · ${i}`;
}
function rt(t, a) {
  const s = T(a), r = (t ?? []).filter((b) => !b.isDone), i = r.filter((b) => b.date.slice(0, 10) < s && b.risk === z.OVERDUE), m = r.filter((b) => b.date.slice(0, 10) >= s), p = st(m), x = Object.keys(p).sort().map((b) => ({
    key: b,
    date: /* @__PURE__ */ new Date(`${b}T00:00:00`),
    isToday: b === s,
    items: p[b]
  }));
  return { overdue: i, days: x };
}
function Et(t) {
  const a = Ee(De(t));
  return Array.from({ length: 7 }, (s, r) => F(a, r));
}
const $t = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }), je = (t) => t ? $t.format(new Date(t)) : "";
function fe(t) {
  const a = new Date(t);
  return a.getHours() * 60 + a.getMinutes();
}
function Rt(t) {
  let a = 8, s = 18;
  for (const r of t ?? [])
    r.startTime && (a = Math.min(a, Math.floor(fe(r.startTime) / 60)), s = Math.max(s, Math.ceil(fe(r.endTime ?? r.startTime) / 60)));
  return { start: Math.max(0, a), end: Math.min(24, Math.max(s, a + 4)) };
}
const Ge = (t) => !!t.startTime, Ue = (t) => t.getDay() === 0 || t.getDay() === 6;
function At(t, { today: a, capacity: s = null, horizonDays: r = 21, fallbackPerDay: i = 3 } = {}) {
  const m = T(a), p = (t ?? []).filter((n) => !n.isDone), x = p.filter((n) => n.date.slice(0, 10) < m && n.risk === z.OVERDUE), b = x.filter((n) => n.canReschedule), o = x.filter((n) => !n.canReschedule), f = {}, l = {};
  for (const n of p) {
    const d = n.date.slice(0, 10);
    d < m || (f[d] = (f[d] ?? 0) + (n.loadHours ?? 0), l[d] = (l[d] ?? 0) + 1);
  }
  const u = [];
  let c = 0;
  for (const n of b) {
    let d = null;
    for (; c < r; ) {
      const v = F(a, c);
      if (Ue(v)) {
        c += 1;
        continue;
      }
      const N = T(v), I = f[N] ?? 0, K = l[N] ?? 0, j = n.loadHours ?? 0, g = s && j > s;
      if (s && !g ? I + j <= s : K < i) {
        f[N] = I + j, l[N] = K + 1, d = v;
        break;
      }
      c += 1;
    }
    if (!d) {
      let v = F(a, r);
      for (; Ue(v); ) v = F(v, 1);
      d = v;
    }
    u.push({ item: n, date: d });
  }
  return { suggestions: u, fixed: o };
}
const zt = {
  [z.OVERDUE]: { label: "Gecikmiş", className: "bg-negative-50 text-negative-700" },
  [z.DUE_TODAY]: { label: "Bugün son gün", className: "bg-warning-50 text-warning-700" }
};
function Ce({ item: t, onSelect: a, showDate: s = !1 }) {
  const r = P[t.source], i = zt[t.risk];
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
            s ? w.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
            t.subtitle,
            t.assigneeName,
            t.amount != null ? w.money(t.amount, t.currency) : null
          ].filter(Boolean).join(" · ") || (r ? r.label : "") })
        ] }),
        i && /* @__PURE__ */ e.jsx("span", { className: y("shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold", i.className), children: i.label })
      ]
    }
  );
}
function Kt({ items: t, today: a, onSelectItem: s, onSmartDefer: r }) {
  const { overdue: i, days: m } = rt(t, a);
  return i.length === 0 && m.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
    de,
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
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: i.map((p) => /* @__PURE__ */ e.jsx(Ce, { item: p, onSelect: s, showDate: !0 }, p.key)) })
    ] }),
    m.map((p) => /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
      /* @__PURE__ */ e.jsxs("header", { className: y(
        "flex items-center justify-between border-b border-subtle px-3 py-2",
        p.isToday && "border-b-accent"
      ), children: [
        /* @__PURE__ */ e.jsxs("span", { className: y(
          "text-[11px] font-bold uppercase tracking-wider",
          p.isToday ? "text-accent" : "text-text-tertiary"
        ), children: [
          w.dayTitle(p.date),
          p.isToday ? " · Bugün" : ""
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: p.items.length })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-1", children: p.items.map((x) => /* @__PURE__ */ e.jsx(Ce, { item: x, onSelect: s }, x.key)) })
    ] }, p.key))
  ] });
}
function Ot({ dayKey: t, items: a, capacity: s, onSelectItem: r, onClose: i }) {
  const m = /* @__PURE__ */ new Date(`${t}T00:00:00`), p = ge(a), x = s && p > s, b = a.reduce((o, f) => (o[f.source] = (o[f.source] ?? 0) + 1, o), {});
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex h-full flex-col overflow-hidden rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start justify-between gap-2 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "truncate text-[13px] font-semibold text-text-primary", children: w.dayTitle(m) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 truncate text-[11.5px] text-text-tertiary", children: Object.keys(b).length === 0 ? "Planlanmış öğe yok" : Object.entries(b).map(([o, f]) => {
          var l;
          return `${f} ${((l = P[o]) == null ? void 0 : l.plural) ?? "öğe"}`;
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
    s && p > 0 && /* @__PURE__ */ e.jsxs("div", { className: y(
      "flex items-center justify-between border-b px-3 py-2 text-[11.5px]",
      x ? "border-negative-100 bg-negative-50 text-negative-700" : "border-subtle text-text-secondary"
    ), children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-semibold", children: x ? "Kapasite aşımı" : "Gün yükü" }),
      /* @__PURE__ */ e.jsxs("span", { className: "font-mono tabular-nums", children: [
        w.hours(p),
        " / ",
        w.hours(s)
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
    ) : a.map((o) => /* @__PURE__ */ e.jsx(Ce, { item: o, onSelect: r }, o.key)) })
  ] });
}
const It = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], Pt = {
  [z.OVERDUE]: {
    pill: "bg-negative-50 text-negative-700",
    /* çapraz tarama */
    pattern: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,.07) 3px, rgba(0,0,0,.07) 5px)"
  },
  [z.DUE_TODAY]: {
    pill: "bg-warning-50 text-warning-700",
    /* dikey çizgi */
    pattern: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,.06) 4px, rgba(0,0,0,.06) 5px)"
  }
};
function Mt({ item: t, onSelect: a, onDragStart: s, isPending: r, hasError: i }) {
  const m = P[t.source], p = Pt[t.risk], x = t.canReschedule && !t.isDone;
  return /* @__PURE__ */ e.jsxs(
    "button",
    {
      type: "button",
      draggable: x,
      onDragStart: x ? (b) => {
        b.stopPropagation(), b.dataTransfer.effectAllowed = "move", b.dataTransfer.setData("text/plain", t.key), s(t);
      } : void 0,
      onClick: (b) => {
        b.stopPropagation(), a(t);
      },
      title: t.subtitle ? `${t.title} — ${t.subtitle}` : t.title,
      style: p ? { backgroundImage: p.pattern } : void 0,
      className: y(
        "flex w-full items-center gap-1 truncate rounded-[6px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
        p ? p.pill : "bg-neutral-subtle text-text-primary",
        t.isDone && "line-through opacity-65",
        x && "cursor-grab active:cursor-grabbing",
        /* Hata SATIRDA kalır — toast'a kaçmaz. */
        i && "ring-1 ring-negative-500",
        r && "opacity-60"
      ),
      children: [
        r ? /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin shrink-0 text-[9px]", "aria-hidden": "true" }) : m && /* @__PURE__ */ e.jsx("i", { className: y("fa shrink-0 text-[9px] opacity-70", m.icon), "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: t.title }),
        i && /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation ms-auto shrink-0 text-[9px]", "aria-hidden": "true" })
      ]
    }
  );
}
function Ft({ summary: t, onSelect: a }) {
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
        /* @__PURE__ */ e.jsx("span", { className: "truncate", children: Tt(t) })
      ]
    }
  );
}
function Lt({ load: t, capacity: a }) {
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
          className: y("h-full", r ? "bg-negative" : "bg-accent"),
          style: { width: `${s * 100}%` }
        }
      )
    }
  );
}
function _t({
  month: t,
  byDay: a,
  today: s,
  capacity: r,
  onSelectItem: i,
  onSelectDay: m,
  selectedDay: p,
  onDropItem: x,
  pending: b = {},
  errors: o = {},
  focusedDay: f,
  onFocusDay: l,
  onNavigate: u
}) {
  const c = at(t), n = T(s), [d, v] = pe.useState(null), [N, I] = pe.useState(null), K = pe.useRef(null), j = f ?? p ?? n, g = (S) => {
    const C = F(/* @__PURE__ */ new Date(`${j}T00:00:00`), S);
    c.some((M) => T(M) === T(C)) || u == null || u(C), l == null || l(T(C));
  }, O = (S) => {
    const C = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[S.key];
    if (C) {
      S.preventDefault(), g(C);
      return;
    }
    (S.key === "Enter" || S.key === " ") && (S.preventDefault(), m(j));
  };
  return pe.useEffect(() => {
    var C, M;
    const S = (C = K.current) == null ? void 0 : C.querySelector(`[data-day="${j}"]`);
    S && ((M = K.current) != null && M.contains(document.activeElement)) && S.focus();
  }, [j]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: It.map((S, C) => /* @__PURE__ */ e.jsx(
      "div",
      {
        className: y(
          "px-2.5 py-2 text-right text-[10.5px] font-bold uppercase tracking-wider",
          C > 4 ? "text-text-tertiary opacity-70" : "text-text-tertiary"
        ),
        children: S
      },
      S
    )) }),
    /* @__PURE__ */ e.jsx(
      "div",
      {
        ref: K,
        role: "grid",
        "aria-label": "Ay takvimi",
        tabIndex: 0,
        onKeyDown: O,
        className: "grid grid-cols-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
        children: c.map((S) => {
          const C = T(S), M = a[C] ?? [], { pills: V, summaries: ye } = Ct(M), X = ge(M), L = S.getMonth() !== t.getMonth(), ae = C === n, te = C === p;
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              role: "gridcell",
              "data-day": C,
              tabIndex: C === j ? 0 : -1,
              "aria-selected": te,
              "aria-label": `${w.dayTitle(S)}${M.length ? `, ${M.length} öğe` : ", boş"}`,
              onClick: () => {
                l == null || l(C), m(C);
              },
              onDragOver: d ? (D) => {
                D.preventDefault(), D.dataTransfer.dropEffect = "move", N !== C && I(C);
              } : void 0,
              onDragLeave: d ? () => I((D) => D === C ? null : D) : void 0,
              onDrop: d ? (D) => {
                D.preventDefault();
                const U = d;
                v(null), I(null), U && U.date.slice(0, 10) !== C && x(U, /* @__PURE__ */ new Date(`${C}T00:00:00`));
              } : void 0,
              className: y(
                "flex min-h-[96px] cursor-pointer flex-col gap-[3px] border-b border-r border-subtle p-1.5",
                "transition-colors duration-fast last:border-r-0 hover:bg-surface-hover",
                L ? "bg-surface-sunken" : "bg-surface-base",
                te && "ring-2 ring-inset ring-border-focus",
                N === C && "bg-primary-subtle ring-2 ring-inset ring-accent"
              ),
              children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                  X > 0 && r && X > r && /* @__PURE__ */ e.jsx("span", { className: "rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: w.hours(X) }),
                  /* @__PURE__ */ e.jsx(
                    "span",
                    {
                      className: y(
                        "ml-auto rounded-full px-1.5 py-0.5 font-mono text-[11.5px] font-semibold leading-none tabular-nums",
                        ae && "bg-accent text-white",
                        !ae && L && "text-text-tertiary opacity-60",
                        !ae && !L && "text-text-secondary"
                      ),
                      children: S.getDate()
                    }
                  )
                ] }),
                V.map((D) => /* @__PURE__ */ e.jsx(
                  Mt,
                  {
                    item: D,
                    onSelect: i,
                    onDragStart: v,
                    isPending: !!b[D.key],
                    hasError: !!o[D.key]
                  },
                  D.key
                )),
                ye.map((D) => /* @__PURE__ */ e.jsx(
                  Ft,
                  {
                    summary: D,
                    onSelect: () => m(C)
                  },
                  `${C}-${D.source}`
                )),
                /* @__PURE__ */ e.jsx(Lt, { load: X, capacity: r })
              ]
            },
            C
          );
        })
      }
    )
  ] });
}
const Bt = { 1: "Google", 2: "Outlook", 3: "iCloud" };
function qt(t) {
  const a = String(t ?? "").trim().split(/\s+/).filter(Boolean);
  return a.length === 0 ? "?" : a.length === 1 ? a[0].slice(0, 2).toLocaleUpperCase("tr") : (a[0][0] + a[a.length - 1][0]).toLocaleUpperCase("tr");
}
function Yt({
  sources: t,
  counts: a,
  enabled: s,
  onToggle: r,
  compact: i = !1,
  externalAccounts: m = [],
  externalLoading: p = !1,
  onOpenSync: x,
  teamOpen: b = !1,
  onToggleTeam: o,
  teamContent: f,
  teamMembers: l = [],
  riskCounts: u
}) {
  const c = (t ?? []).filter((n) => n.isAvailable);
  return c.length === 0 ? null : /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Takvim kaynakları",
      className: y(
        "flex flex-col gap-1 rounded-card border border-subtle bg-surface-base p-2",
        i ? "w-[60px] items-center" : "w-full"
      ),
      children: [
        !i && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 pt-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Kaynaklar" }),
        c.map((n) => {
          const d = P[n.source];
          if (!d) return null;
          const v = s.has(n.source), N = a[n.source] ?? 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": v,
              title: i ? `${d.label} — ${N} öğe` : void 0,
              onClick: () => r(n.source),
              className: y(
                "group flex items-center rounded-md text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                i ? "relative h-11 w-11 justify-center" : "gap-2.5 px-2 py-2",
                v ? "text-text-primary" : "text-text-tertiary",
                "hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: y(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px]",
                      v ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
                    ),
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ e.jsx("i", { className: y("fa", d.icon) })
                  }
                ),
                i ? N > 0 && /* @__PURE__ */ e.jsx(
                  "span",
                  {
                    className: y(
                      "absolute right-0 top-0 min-w-[16px] rounded-full px-1 text-[9.5px] font-bold leading-4",
                      v ? "bg-accent text-white" : "bg-neutral-200 text-text-tertiary"
                    ),
                    children: N
                  }
                ) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                  /* @__PURE__ */ e.jsx("span", { className: y("flex-1 truncate text-[12.5px] font-medium", !v && "line-through decoration-1"), children: d.label }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: N })
                ] })
              ]
            },
            n.source
          );
        }),
        !i && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex items-center justify-between border-t border-subtle px-2 pb-1 pt-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Dış takvimler" }),
            x && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: x,
                className: "rounded p-1 text-[11px] font-medium text-text-link hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                children: "+ Ekle"
              }
            )
          ] }),
          m.length === 0 && !p && /* @__PURE__ */ e.jsx("p", { className: "px-2 pb-1 text-[11.5px] text-text-tertiary", children: "Bağlı takvim yok." }),
          p && m.length === 0 && /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1 text-[11.5px] text-text-tertiary", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
            "senkronize ediliyor…"
          ] }),
          m.map((n) => /* @__PURE__ */ e.jsxs(
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
                  /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: Bt[n.provider] ?? "Takvim" }),
                  /* @__PURE__ */ e.jsx("span", { className: y(
                    "block truncate text-[10.5px]",
                    n.error ? "text-negative-700" : "text-text-tertiary"
                  ), children: n.error ?? `${n.email} · ${n.eventCount} etkinlik` }),
                  n.error && /* @__PURE__ */ e.jsx("a", { href: "/Calendars", className: "text-[10.5px] font-semibold text-text-link hover:underline", children: "Yeniden bağla" })
                ] })
              ]
            },
            n.accountId
          )),
          !i && o && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                role: "switch",
                "aria-checked": b,
                onClick: o,
                className: y(
                  "mt-2 flex items-center gap-2 border-t border-subtle px-2 pb-1 pt-2 text-left",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                ),
                children: [
                  /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Ekip katmanı" }),
                  /* @__PURE__ */ e.jsx(
                    "i",
                    {
                      className: y("fa text-[11px]", b ? "fa-toggle-on text-accent" : "fa-toggle-off text-text-tertiary"),
                      "aria-hidden": "true"
                    }
                  )
                ]
              }
            ),
            l.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-1 px-2 pb-1", children: [
              l.slice(0, 3).map((n) => /* @__PURE__ */ e.jsxs(
                "span",
                {
                  title: n.name,
                  className: "flex items-center gap-1 rounded-full bg-neutral-subtle py-0.5 pe-2 ps-0.5 text-[10.5px] text-text-secondary",
                  children: [
                    /* @__PURE__ */ e.jsx(
                      "span",
                      {
                        className: "flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[8.5px] font-bold text-white",
                        "aria-hidden": "true",
                        children: qt(n.name)
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { className: "max-w-[86px] truncate", children: n.name })
                  ]
                },
                n.userId
              )),
              l.length > 3 && /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-medium text-text-tertiary", children: [
                "+",
                l.length - 3
              ] })
            ] }),
            f
          ] }),
          u && (u.overdue > 0 || u.dueToday > 0 || u.syncError > 0) && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("p", { className: "mt-2 border-t border-subtle px-2 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-wider text-text-tertiary", children: "Risk" }),
            [
              { key: "overdue", label: "Gecikmiş", value: u.overdue, dot: "bg-negative" },
              { key: "dueToday", label: "Bugün son gün", value: u.dueToday, dot: "bg-warning" },
              { key: "syncError", label: "Senkron hatası", value: u.syncError, dot: "bg-negative-700" }
            ].filter((n) => n.value > 0).map((n) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-2 py-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: y("h-[7px] w-[7px] shrink-0 rounded-full", n.dot), "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[11.5px] text-text-secondary", children: n.label }),
              /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-primary", children: n.value })
            ] }, n.key))
          ] }),
          x && /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: x,
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
const Gt = { month: "Ay", week: "Hafta", day: "Gün", agenda: "Ajanda" };
function Ut(t) {
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
function Qt() {
  var a;
  const t = "/Tasks/CreateModal";
  (a = window.abp) != null && a.ModalManager ? new window.abp.ModalManager(t).open() : window.location.href = t;
}
function Ht({
  title: t,
  view: a,
  onView: s,
  onPrev: r,
  onNext: i,
  onToday: m,
  overloadDays: p,
  onHelp: x,
  filterCount: b = 0,
  onClearFilters: o,
  lastSyncAt: f,
  syncError: l = !1,
  canCreateTask: u = !0
}) {
  const c = a !== "agenda", n = Ut(f);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
    c && /* @__PURE__ */ e.jsxs("div", { className: "flex", children: [
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
    /* @__PURE__ */ e.jsx($, { variant: "outline", size: "sm", onClick: m, children: "Bugün" }),
    /* @__PURE__ */ e.jsx("h2", { className: "ml-1 text-[17px] font-semibold capitalize tracking-tight text-text-primary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
      p > 0 && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "rounded-md bg-negative-50 px-2 py-1 text-[11.5px] font-semibold text-negative-700",
          title: "Günlük kapasitenizi aşan gün sayısı",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
            p,
            " günde kapasite aşımı"
          ]
        }
      ),
      (n || l) && /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: y(
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-[11.5px] font-medium",
            l ? "bg-negative-50 text-negative-700" : "text-text-tertiary"
          ),
          title: l ? "Bir dış takvim senkronlanamıyor" : "Dış takvimlerin son senkron zamanı",
          children: [
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: y("h-[6px] w-[6px] rounded-full", l ? "bg-negative" : "bg-positive"),
                "aria-hidden": "true"
              }
            ),
            "Senkron",
            n ? ` · ${n}` : ""
          ]
        }
      ),
      b > 0 && o && /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: o,
          title: "Filtreleri temizle — kapalı kaynakları geri aç",
          className: "flex h-9 items-center gap-1.5 rounded-md border border-default bg-surface-base px-2.5 text-[12px] font-medium text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
          children: [
            "Filtre",
            /* @__PURE__ */ e.jsx("span", { className: "rounded-full bg-primary-subtle px-1.5 text-[11px] font-semibold text-accent", children: b })
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
      /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görünüm", className: "flex rounded-md border border-default bg-surface-base p-0.5", children: Object.entries(Gt).map(([d, v]) => /* @__PURE__ */ e.jsx(
        "button",
        {
          role: "tab",
          "aria-selected": a === d,
          onClick: () => s(d),
          className: y(
            "rounded-[5px] px-2.5 py-1 text-[12px] font-medium transition-colors duration-fast",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            a === d ? "bg-primary-subtle text-accent" : "text-text-secondary hover:bg-surface-hover"
          ),
          children: v
        },
        d
      )) }),
      u && /* @__PURE__ */ e.jsxs($, { variant: "primary", size: "sm", onClick: Qt, children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus me-1.5", "aria-hidden": "true" }),
        "Yeni görev"
      ] })
    ] })
  ] });
}
const Z = 44, Wt = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"], Vt = {
  [z.OVERDUE]: "bg-negative-50 text-negative-700",
  [z.DUE_TODAY]: "bg-warning-50 text-warning-700"
};
function Xt({ load: t, capacity: a }) {
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
function Jt({ days: t, byDay: a, today: s, capacity: r, onSelectItem: i, onSelectDay: m, selectedDay: p }) {
  const x = T(s), b = h.useRef(null), [o, f] = h.useState(() => {
    const j = /* @__PURE__ */ new Date();
    return j.getHours() * 60 + j.getMinutes();
  });
  h.useEffect(() => {
    const j = setInterval(() => {
      const g = /* @__PURE__ */ new Date();
      f(g.getHours() * 60 + g.getMinutes());
    }, 6e4);
    return () => clearInterval(j);
  }, []);
  const l = t.map(T), u = {}, c = {};
  for (const j of l) {
    const g = a[j] ?? [];
    u[j] = g.filter(Ge), c[j] = g.filter((O) => !Ge(O));
  }
  const n = l.flatMap((j) => u[j]), { start: d, end: v } = Rt(n), N = Array.from({ length: v - d }, (j, g) => d + g), I = (v - d) * Z, K = l.includes(x) && o >= d * 60 && o <= v * 60;
  return h.useEffect(() => {
    if (!K || !b.current) return;
    const j = (o - d * 60) / 60 * Z;
    b.current.scrollTop = Math.max(0, j - 120);
  }, [K, d]), /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "grid border-b border-default bg-surface-raised",
        style: { gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))` },
        children: [
          /* @__PURE__ */ e.jsx("div", {}),
          t.map((j) => {
            const g = T(j), O = ge(a[g] ?? []), S = g === x;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => m(g),
                className: y(
                  "border-l border-subtle px-2 py-2 text-left transition-colors duration-fast hover:bg-surface-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus",
                  p === g && "bg-primary-subtle"
                ),
                children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "flex items-baseline gap-1.5", children: [
                    /* @__PURE__ */ e.jsx("span", { className: y(
                      "text-[10.5px] font-bold uppercase tracking-wider",
                      S ? "text-accent" : "text-text-tertiary"
                    ), children: Wt[(j.getDay() + 6) % 7] }),
                    /* @__PURE__ */ e.jsx("span", { className: y(
                      "font-mono text-[13px] font-semibold tabular-nums",
                      S ? "text-accent" : "text-text-primary"
                    ), children: j.getDate() }),
                    r && O > r && /* @__PURE__ */ e.jsx("span", { className: "ms-auto rounded-sm bg-negative-50 px-1 text-[9.5px] font-bold text-negative-700", children: w.hours(O) })
                  ] }),
                  /* @__PURE__ */ e.jsx(Xt, { load: O, capacity: r })
                ]
              },
              g
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
          l.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-[46px] flex-col gap-[3px] border-l border-subtle p-1", children: [
            c[j].slice(0, 4).map((g) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => i(g),
                title: g.title,
                className: y(
                  "flex w-full items-center gap-1 truncate rounded-[5px] px-1.5 py-0.5 text-left text-[10.5px] font-semibold",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                  Vt[g.risk] ?? "bg-neutral-subtle text-text-primary",
                  g.isDone && "line-through opacity-65"
                ),
                children: [
                  P[g.source] && /* @__PURE__ */ e.jsx("i", { className: y("fa shrink-0 text-[9px] opacity-70", P[g.source].icon), "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "truncate", children: g.title })
                ]
              },
              g.key
            )),
            c[j].length > 4 && /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => m(j),
                className: "px-1.5 text-left text-[10.5px] font-medium text-text-tertiary hover:text-text-primary",
                children: [
                  "+",
                  c[j].length - 4,
                  " öğe"
                ]
              }
            )
          ] }, j))
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { ref: b, className: "max-h-[520px] overflow-y-auto", children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "relative grid",
          style: {
            gridTemplateColumns: `56px repeat(${t.length}, minmax(0, 1fr))`,
            height: `${I}px`
          },
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "relative", children: N.map((j, g) => /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: "absolute right-1.5 -translate-y-1/2 font-mono text-[10px] tabular-nums text-text-tertiary",
                style: { top: `${g * Z}px` },
                children: [
                  String(j).padStart(2, "0"),
                  ":00"
                ]
              },
              j
            )) }),
            l.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "relative border-l border-subtle", children: [
              N.map((g, O) => /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "absolute inset-x-0 border-t border-subtle",
                  style: { top: `${O * Z}px` }
                },
                g
              )),
              u[j].map((g) => {
                const O = fe(g.startTime), S = g.endTime ? fe(g.endTime) : O + 60, C = (O - d * 60) / 60 * Z, M = Math.max((S - O) / 60 * Z, 18);
                return /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => i(g),
                    title: `${g.title} · ${je(g.startTime)}`,
                    style: {
                      top: `${C}px`,
                      height: `${M}px`,
                      backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(0,0,0,.05) 4px, rgba(0,0,0,.05) 6px)"
                    },
                    className: y(
                      "absolute inset-x-0.5 overflow-hidden rounded-[5px] border-l-2 border-accent bg-primary-subtle",
                      "px-1.5 py-0.5 text-left text-[10.5px] leading-tight text-text-primary",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                    ),
                    children: [
                      /* @__PURE__ */ e.jsx("span", { className: "block truncate font-semibold", children: g.title }),
                      /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[9.5px] text-text-tertiary", children: [
                        je(g.startTime),
                        g.endTime ? `–${je(g.endTime)}` : ""
                      ] })
                    ]
                  },
                  g.key
                );
              }),
              K && j === x && /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "pointer-events-none absolute inset-x-0 z-10 border-t-2 border-negative",
                  style: { top: `${(o - d * 60) / 60 * Z}px` },
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ e.jsx("span", { className: "absolute -left-1 -top-1 h-2 w-2 rounded-full bg-negative" })
                }
              )
            ] }, j))
          ]
        }
      ),
      n.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "border-t border-subtle px-3 py-2 text-[11.5px] text-text-tertiary", children: "Saat ızgarası dış takvim etkinliklerini gösterir. Bağlı bir takvim yoksa boş kalır." })
    ] })
  ] });
}
function Zt({ item: t }) {
  var f;
  const [a, s] = h.useState(""), [r, i] = h.useState(() => /* @__PURE__ */ new Set()), m = t.description ?? t.subtitle ?? "", p = W({
    queryKey: ["calendar", "projects-lookup"],
    queryFn: () => R.get("/api/app/task/projects-lookup"),
    staleTime: 10 * 6e4
  }), x = _({
    mutationFn: async () => {
      const l = new FormData();
      l.append("file", new Blob([`${t.title}

${m}`], { type: "text/plain" }), "toplanti-notlari.txt");
      const u = await fetch(`/api/ai-task-generator/parse?projectId=${a}`, {
        method: "POST",
        body: l,
        headers: { "X-Requested-With": "XMLHttpRequest" }
      });
      if (!u.ok) throw new Error("Notlardan görev çıkarılamadı.");
      return u.json();
    },
    onSuccess: (l) => i(new Set(((l == null ? void 0 : l.suggestions) ?? []).map((u, c) => c)))
  }), b = _({
    mutationFn: () => {
      var l;
      return R.post("/api/ai-task-generator/create-tasks", {
        projectId: a,
        approvedTasks: (((l = x.data) == null ? void 0 : l.suggestions) ?? []).filter((u, c) => r.has(c))
      });
    }
  }), o = ((f = x.data) == null ? void 0 : f.suggestions) ?? [];
  return /* @__PURE__ */ e.jsxs("section", { className: "border-t border-subtle px-4 py-3", children: [
    /* @__PURE__ */ e.jsx("p", { className: "text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Toplantıdan görev" }),
    !m && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[11.5px] text-text-tertiary", children: "Bu etkinlikte not yok — çıkarılacak aksiyon maddesi bulunamaz." }),
    m && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs(
        "select",
        {
          value: a,
          onChange: (l) => s(l.target.value),
          "aria-label": "Görevlerin ekleneceği proje",
          className: "mt-1.5 w-full rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
          children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: "Proje seçin…" }),
            (p.data ?? []).map((l) => /* @__PURE__ */ e.jsx("option", { value: l.id, children: l.name }, l.id))
          ]
        }
      ),
      /* @__PURE__ */ e.jsx(
        $,
        {
          size: "sm",
          variant: "outline",
          className: "mt-2",
          disabled: !a || x.isPending,
          onClick: () => x.mutate(),
          children: x.isPending ? "Notlar okunuyor…" : "Notlardan aksiyon çıkar"
        }
      ),
      x.isError && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-negative-700", children: x.error.message }),
      o.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2", children: [
        o.map((l, u) => /* @__PURE__ */ e.jsxs("label", { className: "flex cursor-pointer items-start gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: r.has(u),
              onChange: () => i((c) => {
                const n = new Set(c);
                return n.has(u) ? n.delete(u) : n.add(u), n;
              }),
              className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[12px] text-text-primary", children: l.title })
        ] }, `${l.title}-${u}`)),
        /* @__PURE__ */ e.jsx(
          $,
          {
            size: "sm",
            variant: "primary",
            className: y("mt-2"),
            disabled: r.size === 0 || b.isPending || b.isSuccess,
            onClick: () => b.mutate(),
            children: b.isSuccess ? `${b.data} görev eklendi` : b.isPending ? "Ekleniyor…" : `${r.size} görev olarak ekle`
          }
        )
      ] })
    ] })
  ] });
}
const ea = {
  [z.OVERDUE]: { text: "Gecikmiş", cls: "bg-negative-50 text-negative-700" },
  [z.DUE_TODAY]: { text: "Bugün son gün", cls: "bg-warning-50 text-warning-700" }
};
function ne({ label: t, children: a }) {
  return a ? /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-subtle py-2.5 last:border-b-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[11.5px] font-medium text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "min-w-0 text-right text-[12.5px] text-text-primary", children: a })
  ] }) : null;
}
function ta({ item: t, capacity: a, onClose: s, onReschedule: r, onComplete: i, isPending: m, error: p, onRetry: x }) {
  const [b, o] = h.useState(() => t.date.slice(0, 10)), f = P[t.source], l = ea[t.risk], u = t.date.slice(0, 10);
  h.useEffect(() => o(u), [u]);
  const c = () => {
    !b || b === u || r(t, /* @__PURE__ */ new Date(`${b}T00:00:00`));
  };
  return /* @__PURE__ */ e.jsx(oe, { open: !0, onOpenChange: (n) => {
    n || s();
  }, children: /* @__PURE__ */ e.jsxs(ce, { side: "right", title: t.title, className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-md bg-neutral-subtle px-2 py-1 text-[11px] font-semibold text-text-secondary", children: [
          f && /* @__PURE__ */ e.jsx("i", { className: y("fa text-[10px]", f.icon), "aria-hidden": "true" }),
          f == null ? void 0 : f.label
        ] }),
        l && /* @__PURE__ */ e.jsx("span", { className: y("rounded-md px-2 py-1 text-[11px] font-bold", l.cls), children: l.text }),
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
    p && /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-negative-100 bg-negative-50 px-4 py-2.5 text-[12px] text-negative-700", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation", "aria-hidden": "true" }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: p }),
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: x, className: "font-semibold underline", children: "Yeniden dene" })
    ] }),
    m && /* @__PURE__ */ e.jsxs("div", { className: "border-b border-subtle px-4 py-2 text-[12px] text-text-tertiary", "aria-live": "polite", children: [
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
          onClick: () => r(t, F(/* @__PURE__ */ new Date(`${u}T00:00:00`), 1)),
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
            value: b,
            onChange: (n) => o(n.target.value),
            className: "rounded-md border border-default bg-surface-base px-2 py-1 text-[12.5px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": "Son tarih"
          }
        ),
        b !== u && /* @__PURE__ */ e.jsx($, { size: "sm", variant: "primary", onClick: c, children: "Uygula" })
      ] }) : /* @__PURE__ */ e.jsxs("span", { className: "text-text-secondary", children: [
        w.dayTitle(/* @__PURE__ */ new Date(`${u}T00:00:00`)),
        /* @__PURE__ */ e.jsx("span", { className: "ml-1.5 text-text-tertiary", children: "· takvimden değiştirilemez" })
      ] }) }),
      /* @__PURE__ */ e.jsx(ne, { label: "Bağlam", children: t.subtitle }),
      /* @__PURE__ */ e.jsx(ne, { label: "Atanan", children: t.assigneeName }),
      /* @__PURE__ */ e.jsx(ne, { label: "Tutar", children: t.amount != null ? w.money(t.amount, t.currency) : null }),
      /* @__PURE__ */ e.jsx(ne, { label: "Gün yükü", children: t.loadHours != null ? `${w.hours(t.loadHours)}${a ? ` / ${w.hours(a)} kapasite` : ""}` : null })
    ] }),
    t.source === 7 && /* @__PURE__ */ e.jsx(Zt, { item: t }),
    t.href && /* @__PURE__ */ e.jsx("footer", { className: "border-t border-subtle px-4 py-3", children: /* @__PURE__ */ e.jsxs(
      "a",
      {
        href: t.href,
        className: "text-[12.5px] font-medium text-text-link hover:underline",
        children: [
          f == null ? void 0 : f.label,
          " ekranında aç",
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right ms-1.5 text-[10px]", "aria-hidden": "true" })
        ]
      }
    ) })
  ] }) });
}
const nt = ["calendar", "sync-settings"];
function aa(t) {
  return W({
    queryKey: nt,
    queryFn: () => R.get("/api/app/calendar/sync-settings"),
    enabled: t,
    staleTime: 3e4
  });
}
function sa() {
  const t = ee();
  return _({
    /* ABP konvansiyonu: UpdateSyncRulesAsync → PUT (POST 405). */
    mutationFn: (a) => R.put("/api/app/calendar/sync-rules", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: nt }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
const it = ["calendar", "ical-feed"], Re = ["calendar", "ical-subscriptions"];
function ra(t) {
  return W({
    queryKey: it,
    /* GetOrCreate: bağlantı yoksa ilk açılışta üretilir. */
    queryFn: () => R.post("/api/app/ical-feed/ensure", {}),
    enabled: t,
    staleTime: 1 / 0
  });
}
function na() {
  const t = ee();
  return _({
    mutationFn: () => R.post("/api/app/ical-feed/regenerate", {}),
    onSuccess: (a) => t.setQueryData(it, a)
  });
}
function ia(t) {
  return W({
    queryKey: Re,
    queryFn: () => R.get("/api/app/ical-subscription"),
    enabled: t,
    staleTime: 3e4
  });
}
function la() {
  const t = ee();
  return _({
    mutationFn: (a) => R.post("/api/app/ical-subscription", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Re }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function oa() {
  const t = ee();
  return _({
    mutationFn: (a) => R.delete(`/api/app/ical-subscription/${a}`),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: Re }), t.invalidateQueries({ queryKey: ["calendar", "external"] });
    }
  });
}
function ca() {
  return _({
    mutationFn: (t) => R.post(`/api/app/ical-subscription/probe?url=${encodeURIComponent(t)}`, {})
  });
}
const da = {
  1: { label: "Google Calendar", icon: "fa-google", brand: "bg-[#ea4335]" },
  2: { label: "Microsoft Outlook", icon: "fa-windows", brand: "bg-[#0078d4]" },
  3: { label: "iCloud", icon: "fa-apple", brand: "bg-neutral-700" }
}, ua = {
  0: { title: "Son değişen kazanır", desc: "İki taraf da düzenlenirse en son yapılan değişiklik uygulanır; ekranda geri alma şeridi çıkar." },
  1: { title: "APYA her zaman kazanır", desc: "Dış takvim salt-okunur ayna olur; dışarıdaki düzenleme geri alınır." }
}, Qe = {
  0: { icon: "fa-arrow-up-from-bracket", cls: "text-text-tertiary" },
  1: { icon: "fa-code-merge", cls: "text-warning-700" },
  2: { icon: "fa-triangle-exclamation", cls: "text-negative-700" }
};
function Ae(t) {
  if (!t) return "hiç";
  const a = Math.round((Date.now() - new Date(t).getTime()) / 6e4);
  return a < 1 ? "az önce" : a < 60 ? `${a} dk önce` : a < 1440 ? `${Math.round(a / 60)} sa önce` : w.dayShort(new Date(t));
}
function xa({ account: t, onSave: a, saving: s }) {
  const r = da[t.provider] ?? { label: "Takvim", icon: "fa-calendar", brand: "bg-neutral-700" }, [i, m] = h.useState(() => new Set(t.syncSources ?? [])), [p, x] = h.useState(t.conflictRule ?? 0), [b, o] = h.useState(t.isSyncEnabled);
  h.useEffect(() => {
    m(new Set(t.syncSources ?? [])), x(t.conflictRule ?? 0), o(t.isSyncEnabled);
  }, [t]);
  const f = b !== t.isSyncEnabled || p !== t.conflictRule || i.size !== (t.syncSources ?? []).length || [...i].some((u) => !(t.syncSources ?? []).includes(u)), l = (u) => m((c) => {
    const n = new Set(c);
    return n.has(u) ? n.delete(u) : n.add(u), n;
  });
  return /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-center gap-3 border-b border-subtle px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("span", { className: y("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", r.brand), "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("i", { className: y("fab", r.icon) }) }),
      /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[13px] font-semibold text-text-primary", children: r.label }),
        /* @__PURE__ */ e.jsxs("span", { className: "block truncate text-[11.5px] text-text-tertiary", children: [
          t.externalEmail,
          " · son senkron ",
          Ae(t.lastSyncTime)
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("label", { className: "flex shrink-0 items-center gap-1.5 text-[11.5px] text-text-secondary", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: b,
            onChange: (u) => o(u.target.checked),
            className: "h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
          }
        ),
        "Açık"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-3 py-2.5", children: [
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Bu hesaba ne gitsin?" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-wrap gap-1.5", children: Se.map((u) => {
        var n, d;
        const c = i.has(u);
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": c,
            onClick: () => l(u),
            className: y(
              "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11.5px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              c ? "border-accent bg-primary-subtle text-accent" : "border-subtle bg-surface-base text-text-tertiary hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: y("fa text-[10px]", (n = P[u]) == null ? void 0 : n.icon), "aria-hidden": "true" }),
              (d = P[u]) == null ? void 0 : d.label
            ]
          },
          u
        );
      }) }),
      i.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "mt-1.5 text-[11px] text-text-tertiary", children: "Hiçbiri seçili değil — yalnız görevler gönderilir." }),
      /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Çakışma kuralı" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: Object.entries(ua).map(([u, c]) => {
        const n = Number(u), d = p === n;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => x(n),
            className: y(
              "rounded-md border px-2.5 py-2 text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              d ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
            ),
            children: [
              /* @__PURE__ */ e.jsx("span", { className: y("block text-[12px] font-semibold", d ? "text-accent" : "text-text-primary"), children: c.title }),
              /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] leading-snug text-text-tertiary", children: c.desc })
            ]
          },
          u
        );
      }) }),
      f && /* @__PURE__ */ e.jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(
          $,
          {
            size: "sm",
            variant: "primary",
            disabled: s,
            onClick: () => a({
              accountId: t.id,
              isSyncEnabled: b,
              syncSources: [...i],
              syncProjectIds: t.syncProjectIds ?? [],
              conflictRule: p
            }),
            children: s ? "Kaydediliyor…" : "Kuralları kaydet"
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Kaydedilmemiş değişiklik var" })
      ] })
    ] })
  ] });
}
const pa = [
  { value: 15, label: "15 dk" },
  { value: 60, label: "1 saat" },
  { value: 360, label: "6 saat" },
  { value: 1440, label: "Günlük" }
];
function ma({ open: t }) {
  var N, I, K, j;
  const a = ra(t), s = na(), r = ia(t), i = la(), m = oa(), p = ca(), [x, b] = h.useState(""), [o, f] = h.useState(""), [l, u] = h.useState(60), [c, n] = h.useState(!1), d = (N = a.data) != null && N.path ? `${window.location.origin}${a.data.path}` : "", v = async () => {
    try {
      await navigator.clipboard.writeText(d), n(!0), setTimeout(() => n(!1), 2e3);
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
        /* @__PURE__ */ e.jsx($, { size: "sm", variant: "outline", onClick: v, disabled: !d, children: c ? "Kopyalandı" : "Kopyala" })
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
            onChange: (g) => {
              b(g.target.value), p.reset();
            },
            placeholder: "https://…/basic.ics",
            "aria-label": "Takvim bağlantısı",
            className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          }
        ),
        ((I = p.data) == null ? void 0 : I.isValid) && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-positive-700", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-check me-1", "aria-hidden": "true" }),
          "Bağlantı doğrulandı · ",
          p.data.eventCount,
          " etkinlik bulundu"
        ] }),
        p.data && !p.data.isValid && /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] text-negative-700", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation me-1", "aria-hidden": "true" }),
          p.data.error
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              value: o,
              onChange: (g) => f(g.target.value),
              placeholder: ((K = p.data) == null ? void 0 : K.suggestedName) || "Görünen ad",
              "aria-label": "Görünen ad",
              className: "min-w-0 flex-1 rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "select",
            {
              value: l,
              onChange: (g) => u(Number(g.target.value)),
              "aria-label": "Yenileme sıklığı",
              className: "rounded-md border border-default bg-surface-base px-2 py-1.5 text-[12px] text-text-primary",
              children: pa.map((g) => /* @__PURE__ */ e.jsx("option", { value: g.value, children: g.label }, g.value))
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(
            $,
            {
              size: "sm",
              variant: "outline",
              disabled: !x || p.isPending,
              onClick: () => p.mutate(x),
              children: p.isPending ? "Deneniyor…" : "Bağlantıyı dene"
            }
          ),
          /* @__PURE__ */ e.jsx(
            $,
            {
              size: "sm",
              variant: "primary",
              disabled: !x || i.isPending,
              onClick: () => i.mutate(
                { url: x, displayName: o, color: "accent", refreshMinutes: l },
                { onSuccess: () => {
                  b(""), f(""), p.reset();
                } }
              ),
              children: i.isPending ? "Ekleniyor…" : "Takvimi ekle"
            }
          )
        ] }),
        i.isError && /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-negative-700", children: ((j = i.error) == null ? void 0 : j.message) || "Takvim eklenemedi." }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] leading-snug text-text-tertiary", children: [
          "iCal abonelikleri ",
          /* @__PURE__ */ e.jsx("strong", { className: "font-semibold", children: "tek yönlüdür" }),
          ": etkinlikler APYA'da salt-okunur görünür, APYA öğeleri bu takvime yazılmaz. Çift yönlü senkron için Google veya Outlook hesabı bağlayın."
        ] })
      ] }),
      (r.data ?? []).length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 border-t border-subtle pt-2", children: r.data.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12px] font-medium text-text-primary", children: g.displayName }),
          /* @__PURE__ */ e.jsx("span", { className: y(
            "block truncate text-[10.5px]",
            g.lastError ? "text-negative-700" : "text-text-tertiary"
          ), children: g.lastError ?? `${g.lastEventCount} etkinlik · ${Ae(g.lastFetchedAt)} çekildi` })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => m.mutate(g.id),
            className: "shrink-0 rounded p-1 text-[11px] text-text-tertiary hover:text-negative-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
            "aria-label": `${g.displayName} aboneliğini kaldır`,
            children: "Kaldır"
          }
        )
      ] }, g.id)) })
    ] })
  ] });
}
function ba({ open: t, onClose: a }) {
  const { data: s, isPending: r } = aa(t), i = sa();
  return /* @__PURE__ */ e.jsx(oe, { open: t, onOpenChange: (m) => {
    m || a();
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
          action: /* @__PURE__ */ e.jsx($, { size: "sm", variant: "outline", onClick: () => {
            window.location.href = "/Calendars/SimulateAuth?provider=1";
          }, children: "Hesap bağla" })
        }
      ) }) : s.accounts.map((m) => /* @__PURE__ */ e.jsx(
        xa,
        {
          account: m,
          saving: i.isPending,
          onSave: (p) => i.mutate(p)
        },
        m.id
      )),
      /* @__PURE__ */ e.jsx(ma, { open: t }),
      /* @__PURE__ */ e.jsxs("section", { className: "rounded-card border border-subtle bg-surface-base", children: [
        /* @__PURE__ */ e.jsx("header", { className: "border-b border-subtle px-3 py-2", children: /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-semibold text-text-primary", children: "Senkron günlüğü" }) }),
        /* @__PURE__ */ e.jsx("div", { className: "px-3 py-2", children: ((s == null ? void 0 : s.log) ?? []).length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "py-2 text-[11.5px] text-text-tertiary", children: "Henüz senkron kaydı yok." }) : s.log.map((m) => {
          const p = Qe[m.kind] ?? Qe[0];
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-subtle py-2 last:border-b-0", children: [
            /* @__PURE__ */ e.jsx("i", { className: y("fa mt-0.5 shrink-0 text-[11px]", p.icon, p.cls), "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsx("span", { className: "min-w-0 flex-1 text-[11.5px] leading-snug text-text-secondary", children: m.message }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 text-[10.5px] text-text-tertiary", children: Ae(m.occurredAt) })
          ] }, m.id);
        }) })
      ] })
    ] }) })
  ] }) });
}
const lt = ["calendar", "preferences"];
function fa() {
  return W({
    queryKey: lt,
    queryFn: () => R.get("/api/app/calendar/preferences"),
    staleTime: 5 * 6e4
  });
}
function ha() {
  const t = ee();
  return _({
    /* ABP konvansiyonu: Update* metotları PUT'a düşer. POST 405 döner ve
       ayarlar SESSİZCE kaydedilmemiş olur. */
    mutationFn: (a) => R.put("/api/app/calendar/preferences", a),
    onSuccess: () => {
      t.invalidateQueries({ queryKey: lt }), t.invalidateQueries({ queryKey: ["calendar", "feed"] });
    }
  });
}
function ga() {
  const t = ee();
  return _({
    mutationFn: (a) => R.post("/api/app/calendar/bulk-reschedule", a),
    onSettled: () => t.invalidateQueries({ queryKey: ["calendar", "feed"] })
  });
}
function ya({ open: t, items: a, today: s, capacity: r, onClose: i }) {
  const { suggestions: m, fixed: p } = h.useMemo(
    () => At(a, { today: s, capacity: r }),
    [a, s, r]
  ), [x, b] = h.useState(() => new Set(m.map((d) => d.item.key)));
  h.useEffect(() => {
    b(new Set(m.map((d) => d.item.key)));
  }, [m]);
  const o = ga(), f = o.data ?? [], l = new Map(f.filter((d) => !d.succeeded).map((d) => [d.sourceId, d.error])), u = (d) => b((v) => {
    const N = new Set(v);
    return N.has(d) ? N.delete(d) : N.add(d), N;
  }), c = m.filter((d) => x.has(d.item.key)), n = () => {
    o.mutate(
      c.map((d) => ({
        source: d.item.source,
        sourceId: d.item.sourceId,
        newDate: T(d.date)
      })),
      {
        onSuccess: (d) => {
          (d ?? []).every((v) => v.succeeded) && i();
        }
      }
    );
  };
  return /* @__PURE__ */ e.jsx(oe, { open: t, onOpenChange: (d) => {
    d || i();
  }, children: /* @__PURE__ */ e.jsxs(ce, { side: "right", title: "Akıllı erteleme", className: "w-full max-w-[420px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "flex items-start gap-2 border-b border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-semibold text-text-primary", children: "Akıllı erteleme" }),
        /* @__PURE__ */ e.jsxs("p", { className: "mt-0.5 text-[11.5px] leading-snug text-text-tertiary", children: [
          m.length > 0 ? `${m.length} gecikmiş öğe için boş günlere dağıtılmış tarihler önerildi.` : "Ertelenecek gecikmiş öğe yok.",
          r ? ` Günlük kapasite ${w.hours(r)}.` : ""
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
      m.map(({ item: d, date: v }) => {
        const N = l.get(d.sourceId);
        return /* @__PURE__ */ e.jsxs(
          "label",
          {
            className: y(
              "flex cursor-pointer items-start gap-2.5 border-b border-subtle py-2.5 last:border-b-0",
              N && "bg-negative-50"
            ),
            children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: x.has(d.key),
                  onChange: () => u(d.key),
                  className: "mt-1 h-3.5 w-3.5 accent-[color:var(--apya-accent-500)]"
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] font-semibold text-text-primary", children: d.title }),
                /* @__PURE__ */ e.jsxs("span", { className: "mt-0.5 flex items-center gap-1.5 text-[11px] text-text-tertiary", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "line-through", children: w.dayShort(/* @__PURE__ */ new Date(`${d.date.slice(0, 10)}T00:00:00`)) }),
                  /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-right text-[9px]", "aria-hidden": "true" }),
                  /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-accent", children: w.dayShort(v) }),
                  d.loadHours != null && /* @__PURE__ */ e.jsxs("span", { children: [
                    "· ",
                    w.hours(d.loadHours)
                  ] })
                ] }),
                N && /* @__PURE__ */ e.jsx("span", { className: "mt-0.5 block text-[11px] font-medium text-negative-700", children: N })
              ] })
            ]
          },
          d.key
        );
      }),
      p.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 border-t border-subtle pt-2", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: "Ertelenemez" }),
        p.map((d) => {
          var v;
          return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2.5 py-1.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock mt-1 shrink-0 text-[10px] text-text-tertiary", "aria-hidden": "true" }),
            /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: "block truncate text-[12.5px] text-text-secondary", children: d.title }),
              /* @__PURE__ */ e.jsxs("span", { className: "block text-[11px] text-text-tertiary", children: [
                (v = P[d.source]) == null ? void 0 : v.label,
                " — vadesi takvimden değiştirilemez"
              ] })
            ] })
          ] }, d.key);
        })
      ] })
    ] }),
    m.length > 0 && /* @__PURE__ */ e.jsxs("footer", { className: "flex items-center gap-2 border-t border-subtle px-4 py-3", children: [
      /* @__PURE__ */ e.jsx(
        $,
        {
          size: "sm",
          variant: "primary",
          disabled: c.length === 0 || o.isPending,
          onClick: n,
          children: o.isPending ? "Erteleniyor…" : `${c.length} öğeyi ertele`
        }
      ),
      /* @__PURE__ */ e.jsx($, { size: "sm", variant: "ghost", onClick: i, children: "Vazgeç" })
    ] })
  ] }) });
}
const ka = [
  { value: 4, label: "4 sa" },
  { value: 6, label: "6 sa" },
  { value: 8, label: "8 sa" },
  { value: 0, label: "Kapalı" }
], me = ["Kaynaklar", "Dış takvim", "Kurallar"];
function va({ open: t, counts: a, onDone: s }) {
  var u;
  const [r, i] = h.useState(0), [m, p] = h.useState(() => new Set(Se)), [x, b] = h.useState(8), o = ha(), f = () => {
    o.mutate(
      {
        dailyCapacityHours: x > 0 ? x : 0,
        sources: [...m],
        setupCompleted: !0
      },
      /* onSettled DEĞİL: hata durumunda da kapanırsa ayarlar sessizce
         kaybolur ve kullanıcı kurulumu yaptığını sanır. */
      { onSuccess: s }
    );
  }, l = (c) => p((n) => {
    const d = new Set(n);
    return d.has(c) ? d.delete(c) : d.add(c), d;
  });
  return /* @__PURE__ */ e.jsx(Je, { open: t, onOpenChange: (c) => {
    c || s();
  }, children: /* @__PURE__ */ e.jsxs(Ze, { className: "w-full max-w-[520px] p-0", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "border-b border-subtle px-5 py-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[18px] font-semibold tracking-tight text-text-primary", children: "Takviminizi kurun" }),
      /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[12px] leading-snug text-text-tertiary", children: "Hangi kaynakları göreceğinizi seçin, dilerseniz dış takvim bağlayın. Her ayarı sonradan değiştirebilirsiniz." }),
      /* @__PURE__ */ e.jsx("ol", { className: "mt-3 flex items-center gap-2", children: me.map((c, n) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ e.jsx("span", { className: y(
          "flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold",
          n === r ? "bg-accent text-white" : n < r ? "bg-primary-subtle text-accent" : "bg-neutral-subtle text-text-tertiary"
        ), children: n + 1 }),
        /* @__PURE__ */ e.jsx("span", { className: y(
          "text-[11.5px]",
          n === r ? "font-semibold text-text-primary" : "text-text-tertiary"
        ), children: c }),
        n < me.length - 1 && /* @__PURE__ */ e.jsx("span", { className: "ms-1 text-text-tertiary", children: "·" })
      ] }, c)) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "px-5 py-4", children: [
      r === 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-[13px] font-semibold text-text-primary", children: "Takvimde ne görünsün?" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex flex-col gap-1.5", children: Se.map((c) => {
          var v, N;
          const n = m.has(c), d = a == null ? void 0 : a[c];
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "switch",
              "aria-checked": n,
              onClick: () => l(c),
              className: y(
                "flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
                n ? "border-accent bg-primary-subtle" : "border-subtle hover:bg-surface-hover"
              ),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: y("fa text-[12px]", (v = P[c]) == null ? void 0 : v.icon, n ? "text-accent" : "text-text-tertiary"), "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-medium text-text-primary", children: (N = P[c]) == null ? void 0 : N.label }),
                d != null && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[11px] tabular-nums text-text-tertiary", children: d })
              ]
            },
            c
          );
        }) }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-4 text-[13px] font-semibold text-text-primary", children: "Günlük kapasiteniz" }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex gap-1.5", children: ka.map((c) => /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => b(c.value),
            className: y(
              "rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              x === c.value ? "border-accent bg-primary-subtle text-accent" : "border-subtle text-text-secondary hover:bg-surface-hover"
            ),
            children: c.label
          },
          c.value
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
    o.isError && /* @__PURE__ */ e.jsx("p", { role: "alert", className: "px-5 pb-3 text-[11px] text-negative-700", children: ((u = o.error) == null ? void 0 : u.message) || "Ayarlar kaydedilemedi, lütfen tekrar deneyin." }),
    /* @__PURE__ */ e.jsxs("footer", { className: "flex items-center gap-2 border-t border-subtle px-5 py-3", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary", children: [
        "Adım ",
        r + 1,
        " / ",
        me.length
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "flex-1" }),
      /* @__PURE__ */ e.jsx($, { size: "sm", variant: "ghost", onClick: f, disabled: o.isPending, children: "Şimdilik atla" }),
      r < me.length - 1 ? /* @__PURE__ */ e.jsx($, { size: "sm", variant: "primary", onClick: () => i((c) => c + 1), children: "Devam" }) : /* @__PURE__ */ e.jsx($, { size: "sm", variant: "primary", onClick: f, disabled: o.isPending, children: o.isPending ? "Kaydediliyor…" : "Bitir" })
    ] })
  ] }) });
}
const ja = [
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
function He({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "rounded border border-strong bg-surface-raised px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-text-primary", children: t });
}
function Na({ open: t, onClose: a }) {
  return /* @__PURE__ */ e.jsx(Je, { open: t, onOpenChange: (s) => {
    s || a();
  }, children: /* @__PURE__ */ e.jsxs(Ze, { className: "w-full max-w-[480px] p-0", children: [
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
      ja.map((s) => /* @__PURE__ */ e.jsxs("section", { className: "mb-4 last:mb-0", children: [
        /* @__PURE__ */ e.jsx("p", { className: "mb-1.5 text-[11px] font-bold uppercase tracking-wider text-text-tertiary", children: s.title }),
        s.rows.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle py-1.5 last:border-b-0", children: [
          /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center gap-1", children: r.keys.map((i) => /* @__PURE__ */ e.jsx(He, { children: i }, i)) }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-secondary", children: r.label })
        ] }, r.label))
      ] }, s.title)),
      /* @__PURE__ */ e.jsxs("p", { className: "text-[11px] leading-snug text-text-tertiary", children: [
        "Takvim ızgarası tek sekme durağıdır: ",
        /* @__PURE__ */ e.jsx(He, { children: "Tab" }),
        " ile içine girin, sonra oklarla gezin. Sürükle-bırakla yapılan her taşıma buradaki kısayollarla da yapılabilir."
      ] })
    ] })
  ] }) });
}
function wa({ polite: t, assertive: a }) {
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("p", { role: "status", "aria-live": "polite", className: "sr-only", children: t }),
    /* @__PURE__ */ e.jsx("p", { role: "alert", "aria-live": "assertive", className: "sr-only", children: a })
  ] });
}
const Sa = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
function Da({ items: t, month: a, today: s, generatedAt: r }) {
  var u;
  const i = at(a), m = T(s), p = {};
  for (const c of t ?? [])
    (p[u = c.date.slice(0, 10)] ?? (p[u] = [])).push(c);
  const x = Ee(s), b = (t ?? []).filter((c) => {
    const n = c.date.slice(0, 10);
    return n >= T(x) && n <= T(F(x, 7));
  }), { overdue: o, days: f } = rt(b, s), l = (c) => c === z.OVERDUE ? "border-l-[3px] border-l-black" : c === z.DUE_TODAY ? "border-l-[3px] border-l-neutral-500" : "border-l-[3px] border-l-neutral-300";
  return /* @__PURE__ */ e.jsxs("div", { className: "apya-print-root hidden print:block", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-end justify-between border-b-2 border-black pb-2", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[8pt] font-bold uppercase tracking-widest text-neutral-500", children: "APYA · Takvim" }),
          /* @__PURE__ */ e.jsx("h1", { className: "mt-1 text-[22pt] font-semibold capitalize leading-none", children: w.monthTitle(a) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "text-right text-[8pt] text-neutral-500", children: [
          /* @__PURE__ */ e.jsx("p", { children: "Risk: kalın çizgi = gecikmiş · gri çizgi = bugün son gün" }),
          /* @__PURE__ */ e.jsxs("p", { children: [
            r,
            " tarihinde oluşturuldu · Sayfa 1 / 2"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "mt-3 grid grid-cols-7", children: Sa.map((c) => /* @__PURE__ */ e.jsx("div", { className: "pb-1 text-[7.5pt] font-bold uppercase tracking-wide text-neutral-500", children: c }, c)) }),
      /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-l border-t border-neutral-300", children: i.map((c) => {
        const n = T(c), d = p[n] ?? [], v = c.getMonth() !== a.getMonth();
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: y(
              "min-h-[62px] border-b border-r border-neutral-300 p-1",
              n === m && "ring-1 ring-inset ring-black"
            ),
            children: [
              /* @__PURE__ */ e.jsx("p", { className: y(
                "text-right font-mono text-[9pt] font-semibold",
                v ? "text-neutral-300" : "text-neutral-700"
              ), children: c.getDate() }),
              d.slice(0, 4).map((N) => /* @__PURE__ */ e.jsx(
                "p",
                {
                  className: y(
                    "mt-0.5 truncate ps-1 text-[7.5pt] leading-tight",
                    l(N.risk),
                    N.risk === z.OVERDUE ? "font-semibold" : "font-normal",
                    N.isDone && "line-through"
                  ),
                  children: N.title
                },
                N.key
              )),
              d.length > 4 && /* @__PURE__ */ e.jsxs("p", { className: "mt-0.5 text-[7pt] text-neutral-500", children: [
                "+",
                d.length - 4,
                " öğe"
              ] })
            ]
          },
          n
        );
      }) })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "apya-print-page apya-print-break", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "flex items-end justify-between border-b-2 border-black pb-2", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("p", { className: "text-[8pt] font-bold uppercase tracking-widest text-neutral-500", children: "APYA · Haftalık ajanda" }),
          /* @__PURE__ */ e.jsxs("h1", { className: "mt-1 text-[22pt] font-semibold leading-none", children: [
            w.dayShort(x),
            " – ",
            w.dayShort(F(x, 6))
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
        o.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "mb-4 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "border-b-2 border-black pb-1 text-[9pt] font-bold uppercase tracking-wide", children: [
            "Gecikmiş · ",
            o.length
          ] }),
          o.map((c) => /* @__PURE__ */ e.jsx(We, { item: c, showDate: !0 }, c.key))
        ] }),
        f.map((c) => /* @__PURE__ */ e.jsxs("div", { className: "mb-4 break-inside-avoid", children: [
          /* @__PURE__ */ e.jsxs("p", { className: "border-b border-black pb-1 text-[9pt] font-bold uppercase tracking-wide", children: [
            w.dayTitle(c.date),
            c.isToday ? " · Bugün" : ""
          ] }),
          c.items.map((n) => /* @__PURE__ */ e.jsx(We, { item: n }, n.key))
        ] }, c.key))
      ] })
    ] })
  ] });
}
function We({ item: t, showDate: a = !1 }) {
  const s = P[t.source];
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-2 border-b border-neutral-200 py-1", children: [
    /* @__PURE__ */ e.jsx("span", { className: "mt-[3px] h-[9px] w-[9px] shrink-0 border border-neutral-600", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsxs("span", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ e.jsx("span", { className: y("block text-[9pt] leading-tight", t.risk === z.OVERDUE && "font-semibold"), children: t.title }),
      /* @__PURE__ */ e.jsx("span", { className: "block text-[7.5pt] text-neutral-500", children: [
        a ? w.dayShort(/* @__PURE__ */ new Date(`${t.date.slice(0, 10)}T00:00:00`)) : null,
        s == null ? void 0 : s.label,
        t.subtitle,
        t.amount != null ? w.money(t.amount, t.currency) : null
      ].filter(Boolean).join(" · ") })
    ] })
  ] });
}
function Ca({ rows: t, days: a, capacity: s, loading: r }) {
  if (r)
    return /* @__PURE__ */ e.jsxs("p", { className: "px-2 py-1.5 text-[11.5px] text-text-tertiary", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa fa-circle-notch fa-spin me-1.5", "aria-hidden": "true" }),
      "ekip yükü hesaplanıyor…"
    ] });
  if (!t || t.length === 0)
    return /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1.5 text-[11.5px] text-text-tertiary", children: "Bu aralıkta atanmış açık görev yok." });
  const i = (a ?? []).map(T);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 px-2 pb-1", children: [
    t.map((m) => {
      const p = {};
      for (const x of m.days ?? []) p[x.date.slice(0, 10)] = x;
      return /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "truncate text-[11.5px] font-medium text-text-primary", children: m.name }),
          /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] tabular-nums text-text-tertiary", children: w.hours(m.totalHours) })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "mt-0.5 flex gap-[2px]", children: (i.length ? i : (m.days ?? []).map((x) => x.date.slice(0, 10))).map((x) => {
          const b = p[x], o = (b == null ? void 0 : b.hours) ?? 0, f = s && o > s, l = s ? Math.min(o / s, 1) : o > 0 ? 1 : 0;
          return /* @__PURE__ */ e.jsx(
            "span",
            {
              title: `${x}: ${w.hours(o)}${b != null && b.itemCount ? ` · ${b.itemCount} öğe` : ""}`,
              className: "h-[6px] flex-1 overflow-hidden rounded-sm bg-neutral-subtle",
              children: /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: y("block h-full", f ? "bg-negative" : "bg-accent"),
                  style: { width: `${l * 100}%` }
                }
              )
            },
            x
          );
        }) })
      ] }, m.userId);
    }),
    /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[10.5px] leading-snug text-text-tertiary", children: "Yalnız görebildiğiniz projelerin görevleri sayılır." })
  ] });
}
const Ta = 6e4;
function Ea({ from: t, to: a }) {
  const s = T(t), r = T(a);
  return W({
    queryKey: ["calendar", "feed", s, r],
    queryFn: () => R.get(`/api/app/calendar/feed?From=${s}&To=${r}`),
    staleTime: Ta,
    placeholderData: (i) => i
    /* ay geçişinde boş ekran yerine eski veri */
  });
}
const ot = "apya.calendar.view", Te = "apya.calendar.sources", he = ["month", "week", "day", "agenda"];
function ct(t) {
  try {
    return window.localStorage.getItem(t);
  } catch {
    return null;
  }
}
function Ne(t, a) {
  try {
    window.localStorage.setItem(t, a);
  } catch {
  }
}
function $a() {
  const t = new URLSearchParams(window.location.search).get("view");
  if (he.includes(t)) return t;
  const a = ct(ot);
  return he.includes(a) ? a : null;
}
function Ra() {
  const t = ct(Te);
  if (!t) return new Set(le);
  const a = t.split(",").map(Number).filter((s) => le.includes(s));
  return a.length ? new Set(a) : new Set(le);
}
function Aa({ defaultView: t = "month" } = {}) {
  const [a] = h.useState($a), [s, r] = h.useState(() => a ?? t), [i, m] = h.useState(Ra);
  h.useEffect(() => {
    const f = new URL(window.location.href);
    f.searchParams.get("view") !== s && (f.searchParams.set("view", s), window.history.replaceState({}, "", f));
  }, [s]);
  const p = h.useCallback((f) => {
    he.includes(f) && (r(f), Ne(ot, f));
  }, []), x = h.useCallback((f) => {
    m((l) => {
      const u = new Set(l);
      return u.has(f) ? u.delete(f) : u.add(f), Ne(Te, [...u].join(",")), u;
    });
  }, []), b = h.useCallback((f) => {
    a || he.includes(f) && r((l) => l === f ? l : f);
  }, [a]), o = h.useCallback(() => {
    const f = new Set(le);
    m(f), Ne(Te, [...f].join(","));
  }, []);
  return { view: s, setView: p, applyResponsiveDefault: b, enabledSources: i, toggleSource: x, resetSources: o };
}
const H = ["calendar", "feed"];
function za(t, a, s) {
  t.setQueriesData({ queryKey: H }, (r) => r != null && r.items ? {
    ...r,
    items: r.items.map((i) => i.key === a ? { ...i, date: `${s}T00:00:00` } : i)
  } : r);
}
function Ka(t, a) {
  t.setQueriesData({ queryKey: H }, (s) => s != null && s.items ? {
    ...s,
    items: s.items.map((r) => r.key === a ? { ...r, isDone: !0, risk: 0, loadHours: null } : r)
  } : s);
}
function Oa({ onOfflineFailure: t } = {}) {
  const a = ee(), [s, r] = h.useState(null), [i, m] = h.useState({}), [p, x] = h.useState({}), b = h.useCallback((l) => {
    m((u) => {
      if (!u[l]) return u;
      const c = { ...u };
      return delete c[l], c;
    });
  }, []), o = _({
    mutationFn: ({ item: l, newDate: u }) => R.post("/api/app/calendar/reschedule-item", {
      source: l.source,
      sourceId: l.sourceId,
      newDate: T(u)
    }),
    onMutate: async ({ item: l, newDate: u }) => {
      await a.cancelQueries({ queryKey: H });
      const c = a.getQueriesData({ queryKey: H });
      return b(l.key), x((n) => ({ ...n, [l.key]: !0 })), za(a, l.key, T(u)), { snapshot: c, previousDate: l.date.slice(0, 10) };
    },
    onError: (l, { item: u, newDate: c }, n) => {
      var d;
      if (typeof navigator < "u" && !navigator.onLine) {
        t == null || t({
          key: u.key,
          payload: { source: u.source, sourceId: u.sourceId, newDate: T(c) }
        });
        return;
      }
      (d = n == null ? void 0 : n.snapshot) == null || d.forEach(([v, N]) => a.setQueryData(v, N)), m((v) => ({
        ...v,
        [u.key]: (l == null ? void 0 : l.message) || "Kaydedilemedi — tarih değişmedi."
      }));
    },
    onSuccess: (l, { item: u, newDate: c }, n) => {
      r({
        key: u.key,
        message: `“${u.title}” ${T(c)} tarihine taşındı.`,
        undo: () => o.mutate({
          item: { ...u, date: `${T(c)}T00:00:00` },
          newDate: /* @__PURE__ */ new Date(`${n.previousDate}T00:00:00`)
        })
      });
    },
    onSettled: (l, u, { item: c }) => {
      x((n) => {
        const d = { ...n };
        return delete d[c.key], d;
      }), a.invalidateQueries({ queryKey: H });
    }
  }), f = _({
    mutationFn: ({ item: l }) => R.post("/api/app/calendar/complete-item", {
      source: l.source,
      sourceId: l.sourceId
    }),
    onMutate: async ({ item: l }) => {
      await a.cancelQueries({ queryKey: H });
      const u = a.getQueriesData({ queryKey: H });
      return b(l.key), x((c) => ({ ...c, [l.key]: !0 })), Ka(a, l.key), { snapshot: u };
    },
    onError: (l, { item: u }, c) => {
      var n;
      (n = c == null ? void 0 : c.snapshot) == null || n.forEach(([d, v]) => a.setQueryData(d, v)), m((d) => ({
        ...d,
        [u.key]: (l == null ? void 0 : l.message) || "Tamamlanamadı."
      }));
    },
    onSuccess: (l, { item: u }) => {
      r({ key: u.key, message: `“${u.title}” tamamlandı.`, undo: null });
    },
    onSettled: (l, u, { item: c }) => {
      x((n) => {
        const d = { ...n };
        return delete d[c.key], d;
      }), a.invalidateQueries({ queryKey: H });
    }
  });
  return {
    reschedule: (l, u) => o.mutate({ item: l, newDate: u }),
    complete: (l) => f.mutate({ item: l }),
    retry: (l, u) => u ? o.mutate({ item: l, newDate: u }) : f.mutate({ item: l }),
    lastAction: s,
    dismissAction: () => r(null),
    errors: i,
    clearError: b,
    pending: p
  };
}
function Ia({ from: t, to: a, enabled: s = !0 }) {
  const r = T(t), i = T(a);
  return W({
    queryKey: ["calendar", "external", r, i],
    queryFn: () => R.get(`/api/app/calendar/external-events?From=${r}&To=${i}`),
    enabled: s,
    staleTime: 12e4,
    retry: !1,
    placeholderData: (m) => m
  });
}
const Pa = ["INPUT", "TEXTAREA", "SELECT"];
function Ma({
  onView: t,
  onToday: a,
  onPrev: s,
  onNext: r,
  onDeferSelected: i,
  onUndo: m,
  onToggleHelp: p,
  enabled: x = !0
}) {
  h.useEffect(() => {
    if (!x) return;
    const b = (o) => {
      const f = o.target;
      if (!(Pa.includes(f == null ? void 0 : f.tagName) || f != null && f.isContentEditable)) {
        if ((o.metaKey || o.ctrlKey) && o.key.toLowerCase() === "z") {
          o.preventDefault(), m == null || m();
          return;
        }
        if (!(o.metaKey || o.ctrlKey || o.altKey)) {
          if (o.shiftKey) {
            o.key === "ArrowRight" && (o.preventDefault(), i == null || i(1)), o.key === "ArrowLeft" && (o.preventDefault(), i == null || i(-1)), o.key === "?" && (o.preventDefault(), p == null || p());
            return;
          }
          switch (o.key) {
            case "?":
              o.preventDefault(), p == null || p();
              break;
            case "t":
            case "T":
              o.preventDefault(), a == null || a();
              break;
            case "m":
            case "M":
              o.preventDefault(), t == null || t("month");
              break;
            case "w":
            case "W":
              o.preventDefault(), t == null || t("week");
              break;
            case "d":
            case "D":
              o.preventDefault(), t == null || t("day");
              break;
            case "a":
            case "A":
              o.preventDefault(), t == null || t("agenda");
              break;
            case "PageUp":
              o.preventDefault(), s == null || s();
              break;
            case "PageDown":
              o.preventDefault(), r == null || r();
              break;
          }
        }
      }
    };
    return window.addEventListener("keydown", b), () => window.removeEventListener("keydown", b);
  }, [x, t, a, s, r, i, m, p]);
}
function Fa({ from: t, to: a, enabled: s }) {
  const r = T(t), i = T(a);
  return W({
    queryKey: ["calendar", "team-load", r, i],
    queryFn: () => R.get(`/api/app/calendar/team-load?From=${r}&To=${i}`),
    enabled: s,
    staleTime: 6e4
  });
}
const dt = "apya.calendar.offlineQueue";
function we() {
  try {
    const t = window.localStorage.getItem(dt), a = t ? JSON.parse(t) : [];
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}
function Ve(t) {
  try {
    window.localStorage.setItem(dt, JSON.stringify(t));
  } catch {
  }
}
function La({ onFlush: t }) {
  const [a, s] = h.useState(() => typeof navigator > "u" ? !0 : navigator.onLine), [r, i] = h.useState(() => we().length), m = h.useRef(!1), p = h.useCallback((b) => {
    const f = we().filter((l) => l.key !== b.key).concat(b);
    Ve(f), i(f.length);
  }, []), x = h.useCallback(async () => {
    if (m.current) return;
    const b = we();
    if (b.length !== 0) {
      m.current = !0;
      try {
        const o = [];
        for (const f of b)
          try {
            await t(f);
          } catch {
            o.push(f);
          }
        Ve(o), i(o.length);
      } finally {
        m.current = !1;
      }
    }
  }, [t]);
  return h.useEffect(() => {
    const b = () => {
      s(!0), x();
    }, o = () => s(!1);
    return window.addEventListener("online", b), window.addEventListener("offline", o), navigator.onLine && x(), () => {
      window.removeEventListener("online", b), window.removeEventListener("offline", o);
    };
  }, [x]), { isOnline: a, pendingCount: r, enqueue: p, flush: x };
}
function _a() {
  const t = h.useRef(null), [a, s] = h.useState(0);
  return h.useLayoutEffect(() => {
    const r = t.current;
    if (!r || (s(r.getBoundingClientRect().width), typeof ResizeObserver > "u")) return;
    const i = new ResizeObserver((m) => {
      for (const p of m)
        s(p.contentRect.width);
    });
    return i.observe(r), () => i.disconnect();
  }, []), [t, a];
}
function Ba(t) {
  return t === 0 || t >= 1180 ? "wide" : t >= 780 ? "medium" : "narrow";
}
const qa = 60;
function be(t, a, s) {
  return a === "week" ? F(t, 7 * s) : a === "day" ? F(t, s) : new Date(t.getFullYear(), t.getMonth() + s, 1);
}
function Ya() {
  return /* @__PURE__ */ e.jsxs("div", { className: "overflow-hidden rounded-card border border-default bg-surface-base", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7 border-b border-default bg-surface-raised", children: Array.from({ length: 7 }, (t, a) => /* @__PURE__ */ e.jsx("div", { className: "px-2.5 py-2", children: /* @__PURE__ */ e.jsx(ie, { height: 10 }) }, a)) }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-7", children: Array.from({ length: $e }, (t, a) => /* @__PURE__ */ e.jsxs("div", { className: "min-h-[96px] border-b border-r border-subtle p-1.5 last:border-r-0", children: [
      /* @__PURE__ */ e.jsx(ie, { height: 12, width: "40%", className: "ml-auto" }),
      a % 3 === 0 && /* @__PURE__ */ e.jsx(ie, { height: 14, className: "mt-2" })
    ] }, a)) })
  ] });
}
function Ga() {
  var Fe, Le, _e, Be, qe;
  const [t, a] = _a(), s = Ba(a), r = s === "narrow", i = h.useMemo(() => De(/* @__PURE__ */ new Date()), []), [m, p] = h.useState(i), [x, b] = h.useState(null), [o, f] = h.useState(null), [l, u] = h.useState(!1), [c, n] = h.useState(!1), [d, v] = h.useState(!1), [N, I] = h.useState(!1), [K, j] = h.useState(null), [g, O] = h.useState(!1), { view: S, setView: C, applyResponsiveDefault: M, enabledSources: V, toggleSource: ye, resetSources: X } = Aa();
  h.useEffect(() => {
    a !== 0 && M(r ? "agenda" : "month");
  }, [a, r, M]);
  const { range: L, title: ae, weekDayList: te } = h.useMemo(() => {
    if (S === "agenda")
      return {
        range: { from: F(i, -60), to: F(i, qa) },
        title: "Ajanda",
        weekDayList: null
      };
    if (S === "week") {
      const E = Et(m);
      return {
        range: { from: E[0], to: E[6] },
        title: `${w.dayShort(E[0])} – ${w.dayShort(E[6])} ${E[6].getFullYear()}`,
        weekDayList: E
      };
    }
    if (S === "day") {
      const E = De(m);
      return { range: { from: E, to: E }, title: w.dayTitle(E), weekDayList: [E] };
    }
    const k = tt(m);
    return {
      range: { from: k, to: F(k, $e - 1) },
      title: w.monthTitle(m),
      weekDayList: null
    };
  }, [S, m, i]), { data: D, isPending: U, isError: ut, refetch: xt } = Ea(L), q = Ia(L), ze = fa(), ke = Fa({ from: L.from, to: L.to, enabled: g }), B = La({
    onFlush: (k) => R.post("/api/app/calendar/reschedule-item", k.payload)
  }), ue = h.useMemo(
    () => {
      var k;
      return [...(D == null ? void 0 : D.items) ?? [], ...((k = q.data) == null ? void 0 : k.items) ?? []];
    },
    [D, q.data]
  ), Q = h.useMemo(
    () => ue.filter((k) => V.has(k.source)),
    [ue, V]
  ), Y = h.useMemo(() => st(Q), [Q]), G = (D == null ? void 0 : D.dailyCapacityHours) ?? null, Ke = h.useMemo(() => {
    const k = {};
    for (const E of (D == null ? void 0 : D.sources) ?? []) k[E.source] = E.count;
    return k;
  }, [D]), pt = h.useMemo(() => G ? Object.values(Y).filter((k) => ge(k) > G).length : 0, [Y, G]), Oe = h.useMemo(() => {
    var Ye;
    let k = 0, E = 0;
    for (const re of Q)
      re.isDone || (re.risk === z.OVERDUE ? k++ : re.risk === z.DUE_TODAY && E++);
    const J = (((Ye = q.data) == null ? void 0 : Ye.accounts) ?? []).filter((re) => re.error).length;
    return { overdue: k, dueToday: E, syncError: J };
  }, [Q, q.data]), Ie = h.useMemo(
    () => ((D == null ? void 0 : D.sources) ?? []).filter((k) => k.isAvailable),
    [D]
  ), mt = h.useMemo(
    () => Ie.filter((k) => !V.has(k.source)).length,
    [Ie, V]
  ), bt = h.useMemo(() => {
    var E;
    const k = (((E = q.data) == null ? void 0 : E.accounts) ?? []).map((J) => J.lastSyncTime).filter(Boolean).sort();
    return k.length ? k[k.length - 1] : null;
  }, [q.data]);
  h.useEffect(() => {
    x && !Y[x] && !U && (x >= T(L.from) && x <= T(L.to) || b(null));
  }, [x, Y, U, L]);
  const xe = h.useCallback((k) => f(k.key), []), Pe = h.useCallback(() => {
    p(i), b(T(i));
  }, [i]), A = Oa({ onOfflineFailure: B.enqueue }), ft = h.useCallback((k) => {
    const E = K ?? x;
    if (E)
      for (const J of Y[E] ?? [])
        J.canReschedule && !J.isDone && A.reschedule(J, F(/* @__PURE__ */ new Date("T00:00:00"), k));
  }, [K, x, Y, A]);
  Ma({
    onView: C,
    onToday: Pe,
    onPrev: () => p((k) => be(k, S, -1)),
    onNext: () => p((k) => be(k, S, 1)),
    onDeferSelected: ft,
    onUndo: () => {
      var k, E;
      return (E = (k = A.lastAction) == null ? void 0 : k.undo) == null ? void 0 : E.call(k);
    },
    onToggleHelp: () => I((k) => !k)
  });
  const Me = ue.length > 0, ht = Me && Q.length === 0, gt = x ? Y[x] ?? [] : [], se = o ? ue.find((k) => k.key === o) ?? null : null, ve = x && /* @__PURE__ */ e.jsx(
    Ot,
    {
      dayKey: x,
      items: gt,
      capacity: G,
      onSelectItem: xe,
      onClose: () => b(null)
    }
  );
  return /* @__PURE__ */ e.jsxs("div", { ref: t, className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ e.jsx(
      Ht,
      {
        title: ae,
        view: S,
        onView: C,
        onPrev: () => p((k) => be(k, S, -1)),
        onNext: () => p((k) => be(k, S, 1)),
        onToday: Pe,
        overloadDays: pt,
        onHelp: () => I(!0),
        filterCount: mt,
        onClearFilters: X,
        lastSyncAt: bt,
        syncError: Oe.syncError > 0
      }
    ),
    ut && /* @__PURE__ */ e.jsxs("div", { className: "rounded-card border border-negative-100 bg-negative-50 px-3 py-2.5 text-[12.5px] text-negative-700", children: [
      "Takvim yüklenemedi.",
      /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => xt(), className: "ml-2 font-semibold underline", children: "Yeniden dene" })
    ] }),
    (!B.isOnline || B.pendingCount > 0) && /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        className: "flex items-center gap-2 rounded-card border border-warning-100 bg-warning-50 px-3 py-2 text-[12.5px] text-warning-700",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: y("fa", B.isOnline ? "fa-cloud-arrow-up" : "fa-wifi"), "aria-hidden": "true" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: B.isOnline ? `${B.pendingCount} değişiklik gönderiliyor…` : `Çevrimdışısınız — ${B.pendingCount} değişiklik kuyrukta, bağlantı gelince gönderilecek.` }),
          B.isOnline && B.pendingCount > 0 && /* @__PURE__ */ e.jsx("button", { type: "button", onClick: B.flush, className: "font-semibold underline", children: "Şimdi gönder" })
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
        Yt,
        {
          sources: (D == null ? void 0 : D.sources) ?? [],
          counts: Ke,
          enabled: V,
          onToggle: ye,
          compact: s !== "wide",
          externalAccounts: ((Fe = q.data) == null ? void 0 : Fe.accounts) ?? [],
          externalLoading: q.isFetching,
          onOpenSync: () => u(!0),
          teamOpen: g,
          onToggleTeam: () => O((k) => !k),
          teamContent: g ? /* @__PURE__ */ e.jsx(
            Ca,
            {
              rows: ke.data,
              days: te,
              capacity: G,
              loading: ke.isPending
            }
          ) : null,
          teamMembers: ke.data ?? [],
          riskCounts: Oe
        }
      ) }),
      /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
        U ? /* @__PURE__ */ e.jsx(Ya, {}) : ht ? /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
          de,
          {
            icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-filter-circle-xmark" }),
            title: "Bu filtreyle gösterilecek öğe yok",
            description: "Kaynak rayında kapattığınız türler bu aralıktaki tüm öğeleri gizliyor.",
            action: /* @__PURE__ */ e.jsx($, { size: "sm", variant: "outline", onClick: X, children: "Kaynakları aç" })
          }
        ) }) : Me ? S === "month" ? /* @__PURE__ */ e.jsx(
          _t,
          {
            month: m,
            byDay: Y,
            today: i,
            capacity: G,
            selectedDay: x,
            onSelectItem: xe,
            onSelectDay: b,
            onDropItem: A.reschedule,
            focusedDay: K,
            onFocusDay: j,
            onNavigate: (k) => p(k),
            pending: A.pending,
            errors: A.errors
          }
        ) : te ? /* @__PURE__ */ e.jsx(
          Jt,
          {
            days: te,
            byDay: Y,
            today: i,
            capacity: G,
            selectedDay: x,
            onSelectItem: xe,
            onSelectDay: b
          }
        ) : /* @__PURE__ */ e.jsx(
          Kt,
          {
            items: Q,
            today: i,
            onSelectItem: xe,
            onSmartDefer: () => n(!0)
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "rounded-card border border-subtle bg-surface-base p-6", children: /* @__PURE__ */ e.jsx(
          de,
          {
            icon: /* @__PURE__ */ e.jsx("i", { className: "fa fa-calendar-plus" }),
            title: "Bu aralıkta planlanmış bir şey yok",
            description: "Son tarihi olan görevler, fatura vadeleri, hibe son tarihleri ve tarihli finans kayıtları burada birlikte görünür.",
            action: /* @__PURE__ */ e.jsx($, { size: "sm", variant: "outline", onClick: () => {
              window.location.href = "/Tasks";
            }, children: "Görev oluştur" })
          }
        ) }),
        !U && S !== "agenda" && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[10.5px] text-text-tertiary", children: [
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
      s === "wide" && x && /* @__PURE__ */ e.jsx("div", { className: "w-[340px] shrink-0 self-stretch", children: ve })
    ] }),
    s === "medium" && x && /* @__PURE__ */ e.jsx(oe, { open: !0, onOpenChange: (k) => {
      k || b(null);
    }, children: /* @__PURE__ */ e.jsx(ce, { side: "right", title: "Gün detayı", className: "w-[380px] p-0", children: ve }) }),
    r && x && /* @__PURE__ */ e.jsx(oe, { open: !0, onOpenChange: (k) => {
      k || b(null);
    }, children: /* @__PURE__ */ e.jsx(ce, { side: "bottom", title: "Gün detayı", className: "max-h-[80vh] p-0", children: ve }) }),
    /* @__PURE__ */ e.jsx(
      Da,
      {
        items: Q,
        month: m,
        today: i,
        generatedAt: w.dayShort(i)
      }
    ),
    /* @__PURE__ */ e.jsx(Na, { open: N, onClose: () => I(!1) }),
    /* @__PURE__ */ e.jsx(
      wa,
      {
        polite: ((Le = A.lastAction) == null ? void 0 : Le.message) ?? "",
        assertive: ((qe = (Be = (_e = q.data) == null ? void 0 : _e.accounts) == null ? void 0 : Be.find((k) => k.error)) == null ? void 0 : qe.error) ?? ""
      }
    ),
    /* @__PURE__ */ e.jsx(ba, { open: l, onClose: () => u(!1) }),
    /* @__PURE__ */ e.jsx(
      ya,
      {
        open: c,
        items: Q,
        today: i,
        capacity: G,
        onClose: () => n(!1)
      }
    ),
    /* @__PURE__ */ e.jsx(
      va,
      {
        open: ze.data ? !ze.data.setupCompleted && !d : !1,
        counts: Ke,
        onDone: () => v(!0)
      }
    ),
    se && /* @__PURE__ */ e.jsx(
      ta,
      {
        item: se,
        capacity: G,
        onClose: () => f(null),
        onReschedule: A.reschedule,
        onComplete: A.complete,
        isPending: !!A.pending[se.key],
        error: A.errors[se.key],
        onRetry: () => A.clearError(se.key)
      }
    )
  ] });
}
const Xe = document.getElementById("apya-calendar-root");
Xe && yt(Xe).render(
  /* @__PURE__ */ e.jsx(kt, { children: /* @__PURE__ */ e.jsx(vt, { children: /* @__PURE__ */ e.jsx(jt, { children: /* @__PURE__ */ e.jsx(Ga, {}) }) }) })
);
