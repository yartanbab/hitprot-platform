import { r as f, j as n, d as h } from "./react-vendor.js";
import { Q as ee, c as te } from "./query-vendor.js";
import { A as re } from "./httpClient.js";
import { t as ne, c as se, a as F, S as ae, D as ie, b as oe, d as de, e as le, f as ce, g as ue, h as fe, i as me } from "./ui-vendor.js";
const _ = "apya-theme", k = "system", W = f.createContext({
  preference: k,
  resolvedTheme: "light",
  setPreference: () => {
  },
  toggle: () => {
  }
});
function be() {
  if (typeof window > "u") return k;
  try {
    const e = window.localStorage.getItem(_);
    if (e === "light" || e === "dark" || e === "system")
      return e;
  } catch {
  }
  return k;
}
function Y() {
  return typeof window > "u" || !window.matchMedia ? !1 : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function S(e) {
  return e === "dark" ? "dark" : e === "light" ? "light" : Y() ? "dark" : "light";
}
function M(e) {
  if (typeof document > "u") return;
  const t = document.documentElement;
  t.setAttribute("data-theme", e), e === "dark" ? t.classList.add("dark") : t.classList.remove("dark"), t.classList.remove("lpx-theme-light", "lpx-theme-dark", "lpx-theme-dim"), t.classList.add(e === "dark" ? "lpx-theme-dark" : "lpx-theme-light");
}
function Qe({ children: e, defaultPreference: t = k }) {
  const [r, a] = f.useState(() => be() ?? t), [i, s] = f.useState(() => S(r)), l = f.useCallback((c) => {
    if (c !== "light" && c !== "dark" && c !== "system") return;
    a(c);
    try {
      window.localStorage.setItem(_, c);
    } catch {
    }
    const m = S(c);
    s(m), M(m);
  }, []);
  f.useEffect(() => {
    if (r !== "system" || typeof window > "u" || !window.matchMedia)
      return;
    const c = window.matchMedia("(prefers-color-scheme: dark)"), m = () => {
      const b = Y() ? "dark" : "light";
      s(b), M(b);
    };
    return c.addEventListener("change", m), () => c.removeEventListener("change", m);
  }, [r]), f.useEffect(() => {
    M(S(r));
  }, []);
  const o = f.useCallback(() => {
    const c = ["light", "dark", "system"], m = c.indexOf(r), b = c[(m + 1) % c.length];
    l(b);
  }, [r, l]), u = f.useMemo(
    () => ({ preference: r, resolvedTheme: i, setPreference: l, toggle: o }),
    [r, i, l, o]
  );
  return /* @__PURE__ */ n.jsx(W.Provider, { value: u, children: e });
}
function xe() {
  const e = f.useContext(W);
  if (!e)
    throw new Error("useTheme must be used inside a <ThemeProvider>.");
  return e;
}
function he() {
  return new ee({
    defaultOptions: {
      queries: {
        staleTime: 3e4,
        gcTime: 5 * 6e4,
        refetchOnWindowFocus: !0,
        refetchOnReconnect: !0,
        retry: (e, t) => t instanceof re && t.status >= 400 && t.status < 500 ? !1 : e < 2
      },
      mutations: {
        /* Mutation default'ta retry YAPMAZ — duplicate finansal işlem riski. */
        retry: !1
      }
    }
  });
}
const He = {
  dashboard: {
    budget: () => ["dashboard", "budget"],
    cashflow: () => ["dashboard", "cashflow"],
    approvals: (e) => e ? ["dashboard", "approvals", e] : ["dashboard", "approvals"],
    approvalDetail: (e) => ["dashboard", "approval-detail", e],
    risks: () => ["dashboard", "risks"],
    aiSuggestions: (e) => e ? ["dashboard", "ai-suggestions", e] : ["dashboard", "ai-suggestions"]
  }
};
function $e({ children: e }) {
  const [t] = f.useState(() => he());
  return /* @__PURE__ */ n.jsx(te, { client: t, children: e });
}
function d(...e) {
  return ne(se(e));
}
function qe(e, t, r = "tr-TR") {
  return typeof e != "number" || !Number.isFinite(e) ? "—" : new Intl.NumberFormat(r, {
    style: "currency",
    currency: t,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(e);
}
function Ge(e, t, r = "tr-TR") {
  return typeof e != "number" || !Number.isFinite(e) ? "—" : new Intl.NumberFormat(r, {
    style: "currency",
    currency: t,
    notation: "compact",
    maximumFractionDigits: 1
  }).format(e);
}
function Ke(e, t = "tr-TR") {
  if (typeof e != "number" || !Number.isFinite(e))
    return { sign: "", symbol: "•", text: "—" };
  const r = Math.abs(e), a = new Intl.NumberFormat(t, {
    style: "percent",
    maximumFractionDigits: 1
  }).format(r / 100);
  return e > 0 ? { sign: "+", symbol: "▲", text: a } : e < 0 ? { sign: "−", symbol: "▼", text: a } : { sign: "", symbol: "•", text: a };
}
const Q = f.createContext(null), B = {
  info: { ring: "border-default", icon: "text-text-secondary", accent: "bg-brand-500" },
  success: { ring: "border-positive-100", icon: "text-text-positive", accent: "bg-positive-500" },
  warning: { ring: "border-warning-100", icon: "text-text-warning", accent: "bg-warning-500" },
  error: { ring: "border-negative-100", icon: "text-text-negative", accent: "bg-negative-500" }
}, ge = 4e3, pe = 1e4;
let ve = 0;
function Je({ children: e }) {
  const [t, r] = f.useState([]), a = f.useRef(/* @__PURE__ */ new Map()), i = f.useCallback((o) => {
    const u = a.current.get(o);
    u && (clearTimeout(u), a.current.delete(o)), r((c) => c.filter((m) => m.id !== o));
  }, []), s = f.useCallback((o) => {
    const u = ++ve, c = {
      id: u,
      type: o.type ?? "info",
      message: o.message ?? "",
      description: o.description,
      action: o.action,
      /* { label, onClick } */
      duration: o.duration ?? (o.action ? pe : ge)
    };
    if (r((m) => [...m, c]), c.duration > 0) {
      const m = setTimeout(() => i(u), c.duration);
      a.current.set(u, m);
    }
    return u;
  }, [i]);
  f.useEffect(() => () => {
    a.current.forEach(clearTimeout), a.current.clear();
  }, []);
  const l = h.useMemo(() => ({
    show: s,
    dismiss: i,
    info: (o, u = {}) => s({ ...u, type: "info", message: o }),
    success: (o, u = {}) => s({ ...u, type: "success", message: o }),
    warning: (o, u = {}) => s({ ...u, type: "warning", message: o }),
    error: (o, u = {}) => s({ ...u, type: "error", message: o })
  }), [s, i]);
  return /* @__PURE__ */ n.jsxs(Q.Provider, { value: l, children: [
    e,
    /* @__PURE__ */ n.jsx(we, { items: t.slice(-3), onDismiss: i })
  ] });
}
function we({ items: e, onDismiss: t }) {
  return e.length === 0 ? null : /* @__PURE__ */ n.jsx(
    "div",
    {
      role: "region",
      "aria-label": "Bildirimler",
      className: d(
        "fixed bottom-4 right-4 z-toast",
        "flex flex-col-reverse gap-2",
        "pointer-events-none",
        /* viewport tıklamaları geçirir; tek tek toast'lar pointer-auto */
        "max-w-[calc(100vw-2rem)]"
      ),
      children: e.map((r) => /* @__PURE__ */ n.jsx(ye, { item: r, onDismiss: t }, r.id))
    }
  );
}
function ye({ item: e, onDismiss: t }) {
  const r = B[e.type] ?? B.info, a = e.type === "error" ? "assertive" : "polite", i = () => {
    var s, l;
    try {
      (l = (s = e.action) == null ? void 0 : s.onClick) == null || l.call(s);
    } finally {
      t(e.id);
    }
  };
  return /* @__PURE__ */ n.jsxs(
    "div",
    {
      role: e.type === "error" ? "alert" : "status",
      "aria-live": a,
      className: d(
        "pointer-events-auto",
        "flex items-stretch gap-0",
        "min-w-[280px] max-w-[420px]",
        "bg-surface-raised border rounded-md shadow-lg",
        "animate-sheet-bottom",
        r.ring
      ),
      children: [
        /* @__PURE__ */ n.jsx("span", { className: d("w-1 flex-none rounded-l-md", r.accent), "aria-hidden": "true" }),
        /* @__PURE__ */ n.jsxs("div", { className: "flex-1 min-w-0 px-3 py-2.5 flex items-start gap-2", children: [
          /* @__PURE__ */ n.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-0.5", children: [
            /* @__PURE__ */ n.jsx("p", { className: "text-sm font-medium text-text-primary truncate", children: e.message }),
            e.description && /* @__PURE__ */ n.jsx("p", { className: "text-xs text-text-tertiary line-clamp-2", children: e.description })
          ] }),
          e.action && /* @__PURE__ */ n.jsx(
            "button",
            {
              type: "button",
              onClick: i,
              className: d(
                "flex-none text-sm font-medium text-text-link",
                "hover:underline underline-offset-2",
                "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
              ),
              children: e.action.label
            }
          ),
          /* @__PURE__ */ n.jsx(
            "button",
            {
              type: "button",
              onClick: () => t(e.id),
              "aria-label": "Bildirimi kapat",
              className: d(
                "flex-none text-text-tertiary hover:text-text-primary",
                "focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
                "h-5 w-5 inline-flex items-center justify-center"
              ),
              children: /* @__PURE__ */ n.jsx("span", { "aria-hidden": "true", children: "×" })
            }
          )
        ] })
      ]
    }
  );
}
function Ze() {
  const e = f.useContext(Q);
  if (!e)
    throw new Error("useToast must be used within <ToastProvider>.");
  return e;
}
const ke = F(
  /* Base — her variant için ortak */
  d(
    "inline-flex items-center justify-center gap-2",
    "rounded-md font-medium",
    "transition-colors duration-fast ease-standard",
    "focus-visible:outline-none focus-visible:shadow-focus",
    "disabled:opacity-50 disabled:pointer-events-none",
    "select-none whitespace-nowrap"
  ),
  {
    variants: {
      variant: {
        primary: d(
          "bg-brand-500 text-text-inverse",
          "hover:bg-brand-600 active:bg-brand-700",
          "shadow-sm"
        ),
        secondary: d(
          "bg-surface-raised text-text-primary border border-default",
          "hover:bg-surface-elevated hover:border-strong"
        ),
        ghost: d(
          "bg-transparent text-text-secondary",
          "hover:bg-surface-raised hover:text-text-primary"
        ),
        destructive: d(
          "bg-negative-500 text-text-inverse",
          "hover:bg-negative-600 active:bg-negative-700",
          "shadow-sm"
        ),
        outline: d(
          "bg-transparent text-text-primary border border-strong",
          "hover:bg-surface-raised"
        ),
        link: d(
          "bg-transparent text-text-link p-0 h-auto",
          "hover:underline underline-offset-2"
        )
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
), Xe = h.forwardRef(function({
  className: t,
  variant: r,
  size: a,
  asChild: i = !1,
  isLoading: s = !1,
  loadingText: l,
  leadingIcon: o,
  trailingIcon: u,
  disabled: c,
  children: m,
  type: b = "button",
  ...j
}, N) {
  const R = i ? ae : "button", p = c || s;
  return /* @__PURE__ */ n.jsxs(
    R,
    {
      ref: N,
      type: i ? void 0 : b,
      disabled: i ? void 0 : p,
      "aria-busy": s || void 0,
      "data-loading": s || void 0,
      className: d(ke({ variant: r, size: a }), t),
      ...j,
      children: [
        s ? /* @__PURE__ */ n.jsx(je, {}) : o,
        /* @__PURE__ */ n.jsx("span", { className: s ? "opacity-80" : void 0, children: s && l ? l : m }),
        !s && u
      ]
    }
  );
});
function je() {
  return /* @__PURE__ */ n.jsx(
    "svg",
    {
      className: "animate-spin",
      width: "14",
      height: "14",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      "aria-hidden": "true",
      children: /* @__PURE__ */ n.jsx("path", { d: "M21 12a9 9 0 1 1-6.219-8.56", strokeLinecap: "round" })
    }
  );
}
const Ne = {
  default: "bg-surface-raised border border-subtle shadow-sm",
  elevated: "bg-surface-elevated border border-subtle shadow-md",
  flat: "bg-surface-base border border-default shadow-none",
  interactive: d(
    "bg-surface-raised border border-subtle shadow-sm",
    "hover:shadow-md hover:border-default cursor-pointer",
    "transition-shadow duration-fast ease-standard"
  )
}, D = {
  compact: "p-3",
  comfortable: "p-4",
  spacious: "p-6"
}, w = h.forwardRef(function({ className: t, variant: r = "default", density: a, children: i, ...s }, l) {
  return /* @__PURE__ */ n.jsx(
    "div",
    {
      ref: l,
      "data-density": a,
      className: d(
        "rounded-xl overflow-hidden",
        "text-text-primary",
        Ne[r],
        t
      ),
      ...s,
      children: i
    }
  );
}), Te = h.forwardRef(function({ className: t, density: r = "comfortable", children: a, ...i }, s) {
  return /* @__PURE__ */ n.jsx(
    "div",
    {
      ref: s,
      className: d(
        "flex flex-col gap-1",
        "border-b border-subtle",
        D[r],
        t
      ),
      ...i,
      children: a
    }
  );
}), Ce = h.forwardRef(function({ className: t, as: r = "h3", children: a, ...i }, s) {
  return /* @__PURE__ */ n.jsx(
    r,
    {
      ref: s,
      className: d(
        "text-lg font-semibold leading-tight text-text-primary",
        t
      ),
      ...i,
      children: a
    }
  );
}), Se = h.forwardRef(function({ className: t, children: r, ...a }, i) {
  return /* @__PURE__ */ n.jsx(
    "p",
    {
      ref: i,
      className: d("text-sm text-text-secondary", t),
      ...a,
      children: r
    }
  );
}), Me = h.forwardRef(function({ className: t, density: r = "comfortable", children: a, ...i }, s) {
  return /* @__PURE__ */ n.jsx(
    "div",
    {
      ref: s,
      className: d(D[r], t),
      ...i,
      children: a
    }
  );
}), Ee = h.forwardRef(function({ className: t, density: r = "comfortable", children: a, ...i }, s) {
  return /* @__PURE__ */ n.jsx(
    "div",
    {
      ref: s,
      className: d(
        "flex items-center justify-end gap-2",
        "border-t border-subtle bg-surface-sunken",
        D[r],
        t
      ),
      ...i,
      children: a
    }
  );
});
w.Header = Te;
w.Title = Ce;
w.Description = Se;
w.Body = Me;
w.Footer = Ee;
function Ue({ className: e, width: t, height: r, rounded: a = "md", ...i }) {
  const s = {};
  return t !== void 0 && (s.width = typeof t == "number" ? `${t}px` : t), r !== void 0 && (s.height = typeof r == "number" ? `${r}px` : r), /* @__PURE__ */ n.jsx(
    "div",
    {
      "aria-busy": "true",
      "aria-live": "polite",
      className: d(
        "skeleton",
        a === "full" && "rounded-full",
        a === "sm" && "rounded-sm",
        a === "md" && "rounded-md",
        a === "lg" && "rounded-lg",
        e
      ),
      style: s,
      ...i
    }
  );
}
const A = F(
  d(
    "block w-full bg-surface-base text-text-primary",
    "rounded-md border",
    "placeholder:text-text-tertiary",
    "transition-colors duration-fast ease-standard",
    "focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus",
    "disabled:bg-surface-sunken disabled:text-text-disabled disabled:cursor-not-allowed",
    "aria-[invalid=true]:border-error"
  ),
  {
    variants: {
      size: {
        sm: "h-8 px-2 text-sm",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base"
      },
      tone: {
        default: "border-default hover:border-strong",
        error: "border-error"
      }
    },
    defaultVariants: {
      size: "md",
      tone: "default"
    }
  }
), Fe = h.forwardRef(function({
  className: t,
  size: r,
  invalid: a,
  leading: i,
  trailing: s,
  type: l = "text",
  ...o
}, u) {
  const c = a ? "error" : "default";
  return !i && !s ? /* @__PURE__ */ n.jsx(
    "input",
    {
      ref: u,
      type: l,
      "aria-invalid": a || void 0,
      className: d(A({ size: r, tone: c }), t),
      ...o
    }
  ) : /* @__PURE__ */ n.jsxs(
    "span",
    {
      className: d(
        A({ size: r, tone: c }),
        "inline-flex items-center gap-2 px-0",
        "focus-within:shadow-focus focus-within:border-focus",
        t
      ),
      children: [
        i && /* @__PURE__ */ n.jsx("span", { className: "flex-none pl-3 text-text-tertiary", children: i }),
        /* @__PURE__ */ n.jsx(
          "input",
          {
            ref: u,
            type: l,
            "aria-invalid": a || void 0,
            className: d(
              "flex-1 min-w-0 bg-transparent outline-none border-0 p-0",
              "text-text-primary placeholder:text-text-tertiary",
              !i && "pl-3",
              !s && "pr-3",
              "disabled:cursor-not-allowed disabled:text-text-disabled"
            ),
            ...o
          }
        ),
        s && /* @__PURE__ */ n.jsx("span", { className: "flex-none pr-3 text-text-tertiary", children: s })
      ]
    }
  );
}), L = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CHF: "CHF"
};
function z(e) {
  if (e == null) return null;
  const t = String(e).trim();
  if (t === "" || t === "-") return null;
  const r = t.lastIndexOf(","), a = t.lastIndexOf(".");
  let i;
  r > a ? i = t.replace(/\./g, "").replace(",", ".") : a > r ? i = t.replace(/,/g, "") : i = t, i = i.replace(/[^\d.\-]/g, "");
  const s = Number(i);
  return Number.isFinite(s) ? s : null;
}
function E(e, t, r) {
  return e == null || !Number.isFinite(e) ? "" : new Intl.NumberFormat(t, {
    minimumFractionDigits: r,
    maximumFractionDigits: r,
    useGrouping: !0
  }).format(e);
}
const Ve = h.forwardRef(function({
  value: t,
  onValueChange: r,
  currency: a = "TRY",
  currencies: i,
  /* opsiyonel array → dropdown */
  onCurrencyChange: s,
  locale: l = "tr-TR",
  fractionDigits: o = 2,
  min: u,
  max: c,
  invalid: m,
  size: b,
  placeholder: j = "0,00",
  className: N,
  inputClassName: R,
  ...p
}, G) {
  const [T, y] = f.useState(() => E(t, l, o)), C = f.useRef(!1);
  h.useEffect(() => {
    C.current || y(E(t, l, o));
  }, [t, l, o]);
  const K = f.useCallback((x) => {
    const g = x.target.value;
    y(g);
    const v = z(g);
    r == null || r(v);
  }, [r]), J = f.useCallback((x) => {
    C.current = !0, t != null && (y(String(t).replace(".", l.startsWith("tr") ? "," : ".")), requestAnimationFrame(() => {
      var g, v;
      return (v = (g = x.target) == null ? void 0 : g.select) == null ? void 0 : v.call(g);
    }));
  }, [t, l]), Z = f.useCallback((x) => {
    var v;
    C.current = !1;
    const g = z(T);
    r == null || r(g), y(E(g, l, o)), (v = p.onBlur) == null || v.call(p, x);
  }, [T, r, l, o, p]), X = f.useMemo(() => t == null ? !1 : u != null && t < u || c != null && t > c, [t, u, c]), U = L[a] ?? a, V = i && i.length > 1 && s ? /* @__PURE__ */ n.jsx(
    "select",
    {
      value: a,
      onChange: (x) => s(x.target.value),
      "aria-label": "Para birimi",
      className: d(
        "bg-transparent border-0 outline-none text-sm text-text-secondary",
        "pr-1 -mr-1 cursor-pointer",
        "focus-visible:outline-none"
      ),
      children: i.map((x) => /* @__PURE__ */ n.jsx("option", { value: x, children: L[x] ?? x }, x))
    }
  ) : /* @__PURE__ */ n.jsx("span", { className: "font-medium text-text-secondary", children: U });
  return /* @__PURE__ */ n.jsx(
    Fe,
    {
      ref: G,
      inputMode: "decimal",
      type: "text",
      value: T,
      placeholder: j,
      onChange: K,
      onFocus: J,
      onBlur: Z,
      invalid: m || X,
      size: b,
      trailing: V,
      className: d("font-tabular text-right", N),
      ...p
    }
  );
}), De = F(
  d(
    "inline-flex items-center gap-1",
    "font-medium",
    "border",
    "whitespace-nowrap"
  ),
  {
    variants: {
      variant: {
        neutral: "bg-neutral-100 text-neutral-700 border-neutral-200",
        brand: "bg-brand-50 text-brand-700 border-brand-100",
        positive: "bg-positive-50 text-positive-700 border-positive-100",
        negative: "bg-negative-50 text-negative-700 border-negative-100",
        warning: "bg-warning-50 text-warning-700 border-warning-100",
        critical: "bg-critical-50 text-critical-600 border-critical-50",
        ai: "bg-ai-50 text-ai-600 border-ai-50"
      },
      size: {
        sm: "text-xs px-2 py-0.5 rounded-sm",
        md: "text-xs px-2.5 py-1 rounded-md",
        lg: "text-sm px-3 py-1.5 rounded-md"
      }
    },
    defaultVariants: {
      variant: "neutral",
      size: "md"
    }
  }
), Ie = {
  neutral: "bg-neutral-500",
  brand: "bg-brand-500",
  positive: "bg-positive-500",
  negative: "bg-negative-500",
  warning: "bg-warning-500",
  critical: "bg-critical-500",
  ai: "bg-ai-500"
};
function et({ variant: e = "neutral", size: t, withDot: r = !1, className: a, children: i, ...s }) {
  return /* @__PURE__ */ n.jsxs("span", { className: d(De({ variant: e, size: t }), a), ...s, children: [
    r && /* @__PURE__ */ n.jsx(
      "span",
      {
        className: d("inline-block h-1.5 w-1.5 rounded-full", Ie[e]),
        "aria-hidden": "true"
      }
    ),
    i
  ] });
}
const O = {
  light: "Açık tema (Sıradaki: Koyu)",
  dark: "Koyu tema (Sıradaki: Sistem)",
  system: "Sistem teması (Sıradaki: Açık)"
};
function tt({ className: e = "" }) {
  const { preference: t, toggle: r } = xe();
  return /* @__PURE__ */ n.jsxs(
    "button",
    {
      type: "button",
      onClick: r,
      "aria-label": O[t] ?? "Tema değiştir",
      title: O[t] ?? "Tema değiştir",
      className: [
        "inline-flex items-center justify-center",
        "h-10 w-10 rounded-md",
        "bg-surface-raised text-text-secondary",
        "border border-default",
        "hover:bg-surface-elevated hover:text-text-primary",
        "focus-visible:outline-none focus-visible:shadow-focus",
        "transition-colors duration-fast ease-standard",
        e
      ].join(" "),
      children: [
        t === "light" && /* @__PURE__ */ n.jsx(Re, {}),
        t === "dark" && /* @__PURE__ */ n.jsx(Be, {}),
        t === "system" && /* @__PURE__ */ n.jsx(Ae, {})
      ]
    }
  );
}
function Re() {
  return /* @__PURE__ */ n.jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.75",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ n.jsx("circle", { cx: "12", cy: "12", r: "4" }),
        /* @__PURE__ */ n.jsx("path", { d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" })
      ]
    }
  );
}
function Be() {
  return /* @__PURE__ */ n.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.75",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: /* @__PURE__ */ n.jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" })
    }
  );
}
function Ae() {
  return /* @__PURE__ */ n.jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.75",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ n.jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }),
        /* @__PURE__ */ n.jsx("path", { d: "M8 21h8M12 17v4" })
      ]
    }
  );
}
function I({ open: e, onOpenChange: t, children: r }) {
  return /* @__PURE__ */ n.jsx(ue, { open: e, onOpenChange: t, children: r });
}
const Le = h.forwardRef(function({ side: t, className: r, children: a, title: i, description: s, ...l }, o) {
  const u = t === "bottom" ? "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom" : t === "right" ? "inset-y-0 right-0 w-full max-w-md border-l animate-sheet-right" : d(
    "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom",
    "tablet:inset-x-auto tablet:inset-y-0 tablet:right-0 tablet:left-auto tablet:bottom-auto",
    "tablet:w-full tablet:max-w-md tablet:max-h-none tablet:rounded-none tablet:border-l tablet:border-t-0",
    "tablet:animate-sheet-right"
  );
  return /* @__PURE__ */ n.jsxs(ie, { children: [
    /* @__PURE__ */ n.jsx(oe, { className: d(
      "fixed inset-0 z-modal-backdrop",
      "bg-surface-overlay backdrop-blur-sm",
      "animate-overlay-fade"
    ) }),
    /* @__PURE__ */ n.jsxs(
      de,
      {
        ref: o,
        "aria-describedby": void 0,
        className: d(
          "fixed z-modal",
          "bg-surface-base text-text-primary",
          "border-default shadow-xl",
          "flex flex-col",
          "focus-visible:outline-none",
          u,
          r
        ),
        ...l,
        children: [
          /* @__PURE__ */ n.jsx("div", { className: "tablet:hidden flex justify-center pt-2 pb-1", children: /* @__PURE__ */ n.jsx("div", { className: "h-1 w-10 rounded-full bg-neutral-300", "aria-hidden": "true" }) }),
          i && /* @__PURE__ */ n.jsx(le, { className: "sr-only", children: i }),
          s && /* @__PURE__ */ n.jsx(ce, { className: "sr-only", children: s }),
          a
        ]
      }
    )
  ] });
}), ze = fe, Oe = me;
I.Trigger = ze;
I.Close = Oe;
I.Content = Le;
const P = {
  sm: { dot: "h-1 w-1", gap: "gap-0.5" },
  md: { dot: "h-1.5 w-1.5", gap: "gap-0.5" },
  lg: { dot: "h-2 w-2", gap: "gap-1" }
};
function H(e) {
  return typeof e != "number" || !Number.isFinite(e) ? 0 : e > 1 ? Math.max(0, Math.min(100, e)) / 100 : Math.max(0, Math.min(1, e));
}
function $(e) {
  return e >= 0.85 ? { dots: 5, label: "Çok yüksek güven" } : e >= 0.7 ? { dots: 4, label: "Yüksek güven" } : e >= 0.5 ? { dots: 3, label: "Orta güven" } : e >= 0.3 ? { dots: 2, label: "Düşük güven" } : { dots: 1, label: "Çok düşük güven" };
}
function q({ score: e, label: t, size: r = "md", showLabel: a = !0, className: i }) {
  const s = H(e), l = $(s), o = P[r] ?? P.md, u = t ?? l.label, c = Math.round(s * 100);
  return /* @__PURE__ */ n.jsxs(
    "span",
    {
      className: d("inline-flex items-center gap-1 text-xs text-text-tertiary", i),
      title: `${l.label} (%${c})`,
      children: [
        /* @__PURE__ */ n.jsx("span", { className: d("inline-flex items-center", o.gap), "aria-hidden": "true", children: Array.from({ length: 5 }, (m, b) => /* @__PURE__ */ n.jsx(
          "span",
          {
            className: d(
              "inline-block rounded-full",
              o.dot,
              b < l.dots ? "bg-ai-500" : "bg-neutral-200"
            )
          },
          b
        )) }),
        a && /* @__PURE__ */ n.jsx("span", { "aria-hidden": "true", children: u }),
        /* @__PURE__ */ n.jsxs("span", { className: "sr-only", children: [
          "Güven düzeyi: ",
          l.label,
          " (%",
          c,
          ")"
        ] })
      ]
    }
  );
}
q.bandFor = $;
q.normalize = H;
function rt({ onUpdate: e, onReady: t } = {}) {
  typeof window > "u" || !("serviceWorker" in navigator) || (window.addEventListener("beforeinstallprompt", (r) => {
    r.preventDefault(), window.__apyaInstallPrompt = r;
  }), window.addEventListener("load", async () => {
    try {
      const r = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      r.waiting && (e == null || e(r)), r.addEventListener("updatefound", () => {
        const a = r.installing;
        a && a.addEventListener("statechange", () => {
          a.state === "installed" && navigator.serviceWorker.controller ? e == null || e(r) : a.state === "activated" && (t == null || t(r));
        });
      }), t == null || t(r);
    } catch (r) {
      console.warn("[SW] register failed:", r == null ? void 0 : r.message);
    }
  }));
}
export {
  Xe as B,
  w as C,
  Fe as I,
  Ve as M,
  He as Q,
  Ue as S,
  tt as T,
  Te as a,
  Ce as b,
  d as c,
  Me as d,
  et as e,
  Ke as f,
  Ge as g,
  qe as h,
  q as i,
  I as j,
  Qe as k,
  $e as l,
  Je as m,
  rt as r,
  Ze as u
};
