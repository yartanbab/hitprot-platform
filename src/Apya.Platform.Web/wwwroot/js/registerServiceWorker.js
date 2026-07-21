import { r as f, j as i, d as p } from "./react-vendor.js";
import { Q as te, c as re } from "./query-vendor.js";
import { A as ne } from "./httpClient.js";
import { t as se, c as ae, a as R, S as ie, D as oe, b as le, d as de, e as ce, f as ue, g as fe, h as me, i as be } from "./ui-vendor.js";
const Y = "apya-theme", N = "system", W = f.createContext({
  preference: N,
  resolvedTheme: "light",
  setPreference: () => {
  },
  toggle: () => {
  }
});
function xe() {
  if (typeof window > "u") return N;
  try {
    const e = window.localStorage.getItem(Y);
    if (e === "light" || e === "dark" || e === "system")
      return e;
  } catch {
  }
  return N;
}
function H() {
  return typeof window > "u" || !window.matchMedia ? !1 : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function F(e) {
  return e === "dark" ? "dark" : e === "light" ? "light" : H() ? "dark" : "light";
}
function D(e) {
  if (typeof document > "u") return;
  const t = document.documentElement;
  t.setAttribute("data-theme", e), e === "dark" ? t.classList.add("dark") : t.classList.remove("dark"), t.classList.remove("lpx-theme-light", "lpx-theme-dark", "lpx-theme-dim"), t.classList.add(e === "dark" ? "lpx-theme-dark" : "lpx-theme-light");
}
function We({ children: e, defaultPreference: t = N }) {
  const [r, n] = f.useState(() => xe() ?? t), [a, s] = f.useState(() => F(r)), d = f.useCallback((c) => {
    if (c !== "light" && c !== "dark" && c !== "system") return;
    n(c);
    try {
      window.localStorage.setItem(Y, c);
    } catch {
    }
    const m = F(c);
    s(m), D(m);
  }, []);
  f.useEffect(() => {
    if (r !== "system" || typeof window > "u" || !window.matchMedia)
      return;
    const c = window.matchMedia("(prefers-color-scheme: dark)"), m = () => {
      const b = H() ? "dark" : "light";
      s(b), D(b);
    };
    return c.addEventListener("change", m), () => c.removeEventListener("change", m);
  }, [r]), f.useEffect(() => {
    D(F(r));
  }, []);
  const o = f.useCallback(() => {
    const c = ["light", "dark", "system"], m = c.indexOf(r), b = c[(m + 1) % c.length];
    d(b);
  }, [r, d]), u = f.useMemo(
    () => ({ preference: r, resolvedTheme: a, setPreference: d, toggle: o }),
    [r, a, d, o]
  );
  return /* @__PURE__ */ i.jsx(W.Provider, { value: u, children: e });
}
function He() {
  const e = f.useContext(W);
  if (!e)
    throw new Error("useTheme must be used inside a <ThemeProvider>.");
  return e;
}
function pe() {
  return new te({
    defaultOptions: {
      queries: {
        staleTime: 3e4,
        gcTime: 5 * 6e4,
        refetchOnWindowFocus: !0,
        refetchOnReconnect: !0,
        retry: (e, t) => t instanceof ne && t.status >= 400 && t.status < 500 ? !1 : e < 2
      },
      mutations: {
        /* Mutation default'ta retry YAPMAZ — duplicate finansal işlem riski. */
        retry: !1
      }
    }
  });
}
const Qe = {
  dashboard: {
    budget: () => ["dashboard", "budget"],
    cashflow: () => ["dashboard", "cashflow"],
    kpiSummary: () => ["dashboard", "kpi-summary"],
    incomeExpense: () => ["dashboard", "income-expense"],
    approvals: (e) => e ? ["dashboard", "approvals", e] : ["dashboard", "approvals"],
    approvalDetail: (e) => ["dashboard", "approval-detail", e],
    risks: () => ["dashboard", "risks"],
    aiSuggestions: (e) => e ? ["dashboard", "ai-suggestions", e] : ["dashboard", "ai-suggestions"]
  }
};
function $e({ children: e }) {
  const [t] = f.useState(() => pe());
  return /* @__PURE__ */ i.jsx(re, { client: t, children: e });
}
function l(...e) {
  return se(ae(e));
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
  const r = Math.abs(e), n = new Intl.NumberFormat(t, {
    style: "percent",
    maximumFractionDigits: 1
  }).format(r / 100);
  return e > 0 ? { sign: "+", symbol: "▲", text: n } : e < 0 ? { sign: "−", symbol: "▼", text: n } : { sign: "", symbol: "•", text: n };
}
const Q = f.createContext(null), z = {
  info: { ring: "border-default", icon: "text-text-secondary", accent: "bg-brand-500" },
  success: { ring: "border-positive-100", icon: "text-text-positive", accent: "bg-positive-500" },
  warning: { ring: "border-warning-100", icon: "text-text-warning", accent: "bg-warning-500" },
  error: { ring: "border-negative-100", icon: "text-text-negative", accent: "bg-negative-500" }
}, ge = 4e3, he = 1e4;
let ve = 0;
function Je({ children: e }) {
  const [t, r] = f.useState([]), n = f.useRef(/* @__PURE__ */ new Map()), a = f.useCallback((o) => {
    const u = n.current.get(o);
    u && (clearTimeout(u), n.current.delete(o)), r((c) => c.filter((m) => m.id !== o));
  }, []), s = f.useCallback((o) => {
    const u = ++ve, c = {
      id: u,
      type: o.type ?? "info",
      message: o.message ?? "",
      description: o.description,
      action: o.action,
      /* { label, onClick } */
      duration: o.duration ?? (o.action ? he : ge)
    };
    if (r((m) => [...m, c]), c.duration > 0) {
      const m = setTimeout(() => a(u), c.duration);
      n.current.set(u, m);
    }
    return u;
  }, [a]);
  f.useEffect(() => () => {
    n.current.forEach(clearTimeout), n.current.clear();
  }, []);
  const d = p.useMemo(() => ({
    show: s,
    dismiss: a,
    info: (o, u = {}) => s({ ...u, type: "info", message: o }),
    success: (o, u = {}) => s({ ...u, type: "success", message: o }),
    warning: (o, u = {}) => s({ ...u, type: "warning", message: o }),
    error: (o, u = {}) => s({ ...u, type: "error", message: o })
  }), [s, a]);
  return /* @__PURE__ */ i.jsxs(Q.Provider, { value: d, children: [
    e,
    /* @__PURE__ */ i.jsx(we, { items: t.slice(-3), onDismiss: a })
  ] });
}
function we({ items: e, onDismiss: t }) {
  return e.length === 0 ? null : /* @__PURE__ */ i.jsx(
    "div",
    {
      role: "region",
      "aria-label": "Bildirimler",
      className: l(
        "fixed bottom-4 right-4 z-toast",
        "flex flex-col-reverse gap-2",
        "pointer-events-none",
        /* viewport tıklamaları geçirir; tek tek toast'lar pointer-auto */
        "max-w-[calc(100vw-2rem)]"
      ),
      children: e.map((r) => /* @__PURE__ */ i.jsx(ye, { item: r, onDismiss: t }, r.id))
    }
  );
}
function ye({ item: e, onDismiss: t }) {
  const r = z[e.type] ?? z.info, n = e.type === "error" ? "assertive" : "polite", a = () => {
    var s, d;
    try {
      (d = (s = e.action) == null ? void 0 : s.onClick) == null || d.call(s);
    } finally {
      t(e.id);
    }
  };
  return /* @__PURE__ */ i.jsxs(
    "div",
    {
      role: e.type === "error" ? "alert" : "status",
      "aria-live": n,
      className: l(
        "pointer-events-auto",
        "flex items-stretch gap-0",
        "min-w-[280px] max-w-[420px]",
        "bg-surface-raised border rounded-md shadow-lg",
        "animate-sheet-bottom",
        r.ring
      ),
      children: [
        /* @__PURE__ */ i.jsx("span", { className: l("w-1 flex-none rounded-l-md", r.accent), "aria-hidden": "true" }),
        /* @__PURE__ */ i.jsxs("div", { className: "flex-1 min-w-0 px-3 py-2.5 flex items-start gap-2", children: [
          /* @__PURE__ */ i.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-0.5", children: [
            /* @__PURE__ */ i.jsx("p", { className: "text-sm font-medium text-text-primary truncate", children: e.message }),
            e.description && /* @__PURE__ */ i.jsx("p", { className: "text-xs text-text-tertiary line-clamp-2", children: e.description })
          ] }),
          e.action && /* @__PURE__ */ i.jsx(
            "button",
            {
              type: "button",
              onClick: a,
              className: l(
                "flex-none text-sm font-medium text-text-link",
                "hover:underline underline-offset-2",
                "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
              ),
              children: e.action.label
            }
          ),
          /* @__PURE__ */ i.jsx(
            "button",
            {
              type: "button",
              onClick: () => t(e.id),
              "aria-label": "Bildirimi kapat",
              className: l(
                "flex-none text-text-tertiary hover:text-text-primary",
                "focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
                "h-5 w-5 inline-flex items-center justify-center"
              ),
              children: /* @__PURE__ */ i.jsx("span", { "aria-hidden": "true", children: "×" })
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
const je = R(
  /* Base — her variant için ortak */
  l(
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
        primary: l(
          "bg-brand-500 text-text-inverse",
          "hover:bg-brand-600 active:bg-brand-600",
          "shadow-sm"
        ),
        secondary: l(
          "bg-surface-raised text-text-primary border border-default",
          "hover:bg-surface-elevated hover:border-strong"
        ),
        ghost: l(
          "bg-transparent text-text-secondary",
          "hover:bg-surface-raised hover:text-text-primary"
        ),
        destructive: l(
          "bg-negative-500 text-text-inverse",
          "hover:bg-negative-600 active:bg-negative-700",
          "shadow-sm"
        ),
        outline: l(
          "bg-transparent text-text-primary border border-strong",
          "hover:bg-surface-raised"
        ),
        link: l(
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
), Xe = p.forwardRef(function({
  className: t,
  variant: r,
  size: n,
  asChild: a = !1,
  isLoading: s = !1,
  loadingText: d,
  leadingIcon: o,
  trailingIcon: u,
  disabled: c,
  children: m,
  type: b = "button",
  ...C
}, T) {
  const B = a ? ie : "button", h = c || s;
  return /* @__PURE__ */ i.jsxs(
    B,
    {
      ref: T,
      type: a ? void 0 : b,
      disabled: a ? void 0 : h,
      "aria-busy": s || void 0,
      "data-loading": s || void 0,
      className: l(je({ variant: r, size: n }), t),
      ...C,
      children: [
        s ? /* @__PURE__ */ i.jsx(ke, {}) : o,
        /* @__PURE__ */ i.jsx("span", { className: s ? "opacity-80" : void 0, children: s && d ? d : m }),
        !s && u
      ]
    }
  );
});
function ke() {
  return /* @__PURE__ */ i.jsx(
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
      children: /* @__PURE__ */ i.jsx("path", { d: "M21 12a9 9 0 1 1-6.219-8.56", strokeLinecap: "round" })
    }
  );
}
const Ne = {
  default: "bg-surface-raised border border-subtle shadow-sm",
  elevated: "bg-surface-elevated border border-subtle shadow-md",
  flat: "bg-surface-base border border-default shadow-none",
  interactive: l(
    "bg-surface-raised border border-subtle shadow-sm",
    "hover:shadow-md hover:border-default cursor-pointer",
    "transition-shadow duration-fast ease-standard"
  )
}, I = {
  compact: "p-3",
  comfortable: "p-4",
  spacious: "p-6"
}, y = p.forwardRef(function({ className: t, variant: r = "default", density: n, children: a, ...s }, d) {
  return /* @__PURE__ */ i.jsx(
    "div",
    {
      ref: d,
      "data-density": n,
      className: l(
        "rounded-xl overflow-hidden",
        "text-text-primary",
        Ne[r],
        t
      ),
      ...s,
      children: a
    }
  );
}), Ce = p.forwardRef(function({ className: t, density: r = "comfortable", children: n, ...a }, s) {
  return /* @__PURE__ */ i.jsx(
    "div",
    {
      ref: s,
      className: l(
        "flex flex-col gap-1",
        "border-b border-subtle",
        I[r],
        t
      ),
      ...a,
      children: n
    }
  );
}), Te = p.forwardRef(function({ className: t, as: r = "h3", children: n, ...a }, s) {
  return /* @__PURE__ */ i.jsx(
    r,
    {
      ref: s,
      className: l(
        "text-lg font-semibold leading-tight text-text-primary",
        t
      ),
      ...a,
      children: n
    }
  );
}), Se = p.forwardRef(function({ className: t, children: r, ...n }, a) {
  return /* @__PURE__ */ i.jsx(
    "p",
    {
      ref: a,
      className: l("text-sm text-text-secondary", t),
      ...n,
      children: r
    }
  );
}), Ee = p.forwardRef(function({ className: t, density: r = "comfortable", children: n, ...a }, s) {
  return /* @__PURE__ */ i.jsx(
    "div",
    {
      ref: s,
      className: l(I[r], t),
      ...a,
      children: n
    }
  );
}), Fe = p.forwardRef(function({ className: t, density: r = "comfortable", children: n, ...a }, s) {
  return /* @__PURE__ */ i.jsx(
    "div",
    {
      ref: s,
      className: l(
        "flex items-center justify-end gap-2",
        "border-t border-subtle bg-surface-sunken",
        I[r],
        t
      ),
      ...a,
      children: n
    }
  );
});
y.Header = Ce;
y.Title = Te;
y.Description = Se;
y.Body = Ee;
y.Footer = Fe;
function Ue({ className: e, width: t, height: r, rounded: n = "md", ...a }) {
  const s = {};
  return t !== void 0 && (s.width = typeof t == "number" ? `${t}px` : t), r !== void 0 && (s.height = typeof r == "number" ? `${r}px` : r), /* @__PURE__ */ i.jsx(
    "div",
    {
      "aria-busy": "true",
      "aria-live": "polite",
      className: l(
        "skeleton",
        n === "full" && "rounded-full",
        n === "sm" && "rounded-sm",
        n === "md" && "rounded-md",
        n === "lg" && "rounded-lg",
        e
      ),
      style: s,
      ...a
    }
  );
}
const P = R(
  l(
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
), De = p.forwardRef(function({
  className: t,
  size: r,
  invalid: n,
  leading: a,
  trailing: s,
  type: d = "text",
  ...o
}, u) {
  const c = n ? "error" : "default";
  return !a && !s ? /* @__PURE__ */ i.jsx(
    "input",
    {
      ref: u,
      type: d,
      "aria-invalid": n || void 0,
      className: l(P({ size: r, tone: c }), t),
      ...o
    }
  ) : /* @__PURE__ */ i.jsxs(
    "span",
    {
      className: l(
        P({ size: r, tone: c }),
        "inline-flex items-center gap-2 px-0",
        "focus-within:shadow-focus focus-within:border-focus",
        t
      ),
      children: [
        a && /* @__PURE__ */ i.jsx("span", { className: "flex-none pl-3 text-text-tertiary", children: a }),
        /* @__PURE__ */ i.jsx(
          "input",
          {
            ref: u,
            type: d,
            "aria-invalid": n || void 0,
            className: l(
              "flex-1 min-w-0 bg-transparent outline-none border-0 p-0",
              "text-text-primary placeholder:text-text-tertiary",
              !a && "pl-3",
              !s && "pr-3",
              "disabled:cursor-not-allowed disabled:text-text-disabled"
            ),
            ...o
          }
        ),
        s && /* @__PURE__ */ i.jsx("span", { className: "flex-none pr-3 text-text-tertiary", children: s })
      ]
    }
  );
});
let k = null;
function Me() {
  var t, r;
  if (k) return k;
  const e = (r = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.localization) == null ? void 0 : r.getResource;
  return typeof e == "function" && (k = e("Platform")), k;
}
function w(e, t, ...r) {
  const n = Me(), a = n ? n(e, ...r) : null;
  return a != null && a !== e ? a : Re(t ?? e, r);
}
function Re(e, t) {
  return t.length ? String(e).replace(/\{(\d+)\}/g, (r, n) => t[n] ?? r) : e;
}
function Ve() {
  var e, t, r, n;
  return ((r = (t = (e = window == null ? void 0 : window.abp) == null ? void 0 : e.localization) == null ? void 0 : t.currentCulture) == null ? void 0 : r.name) || ((n = document == null ? void 0 : document.documentElement) == null ? void 0 : n.lang) || "tr-TR";
}
const O = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CHF: "CHF"
};
function _(e) {
  if (e == null) return null;
  const t = String(e).trim();
  if (t === "" || t === "-") return null;
  const r = t.lastIndexOf(","), n = t.lastIndexOf(".");
  let a;
  r > n ? a = t.replace(/\./g, "").replace(",", ".") : n > r ? a = t.replace(/,/g, "") : a = t, a = a.replace(/[^\d.\-]/g, "");
  const s = Number(a);
  return Number.isFinite(s) ? s : null;
}
function M(e, t, r) {
  return e == null || !Number.isFinite(e) ? "" : new Intl.NumberFormat(t, {
    minimumFractionDigits: r,
    maximumFractionDigits: r,
    useGrouping: !0
  }).format(e);
}
const et = p.forwardRef(function({
  value: t,
  onValueChange: r,
  currency: n = "TRY",
  currencies: a,
  /* opsiyonel array → dropdown */
  onCurrencyChange: s,
  locale: d = "tr-TR",
  fractionDigits: o = 2,
  min: u,
  max: c,
  invalid: m,
  size: b,
  placeholder: C = "0,00",
  className: T,
  inputClassName: B,
  ...h
}, K) {
  const [S, j] = f.useState(() => M(t, d, o)), E = f.useRef(!1);
  p.useEffect(() => {
    E.current || j(M(t, d, o));
  }, [t, d, o]);
  const J = f.useCallback((x) => {
    const g = x.target.value;
    j(g);
    const v = _(g);
    r == null || r(v);
  }, [r]), Z = f.useCallback((x) => {
    E.current = !0, t != null && (j(String(t).replace(".", d.startsWith("tr") ? "," : ".")), requestAnimationFrame(() => {
      var g, v;
      return (v = (g = x.target) == null ? void 0 : g.select) == null ? void 0 : v.call(g);
    }));
  }, [t, d]), X = f.useCallback((x) => {
    var v;
    E.current = !1;
    const g = _(S);
    r == null || r(g), j(M(g, d, o)), (v = h.onBlur) == null || v.call(h, x);
  }, [S, r, d, o, h]), U = f.useMemo(() => t == null ? !1 : u != null && t < u || c != null && t > c, [t, u, c]), V = O[n] ?? n, ee = a && a.length > 1 && s ? /* @__PURE__ */ i.jsx(
    "select",
    {
      value: n,
      onChange: (x) => s(x.target.value),
      "aria-label": w("Common:Currency", "Para birimi"),
      className: l(
        "bg-transparent border-0 outline-none text-sm text-text-secondary",
        "pr-1 -mr-1 cursor-pointer",
        "focus-visible:outline-none"
      ),
      children: a.map((x) => /* @__PURE__ */ i.jsx("option", { value: x, children: O[x] ?? x }, x))
    }
  ) : /* @__PURE__ */ i.jsx("span", { className: "font-medium text-text-secondary", children: V });
  return /* @__PURE__ */ i.jsx(
    De,
    {
      ref: K,
      inputMode: "decimal",
      type: "text",
      value: S,
      placeholder: C,
      onChange: J,
      onFocus: Z,
      onBlur: X,
      invalid: m || U,
      size: b,
      trailing: ee,
      className: l("font-tabular text-right", T),
      ...h
    }
  );
}), Ie = R(
  l(
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
), Ae = {
  neutral: "bg-neutral-500",
  brand: "bg-brand-500",
  positive: "bg-positive-500",
  negative: "bg-negative-500",
  warning: "bg-warning-500",
  critical: "bg-critical-500",
  ai: "bg-ai-500"
};
function tt({ variant: e = "neutral", size: t, withDot: r = !1, className: n, children: a, ...s }) {
  return /* @__PURE__ */ i.jsxs("span", { className: l(Ie({ variant: e, size: t }), n), ...s, children: [
    r && /* @__PURE__ */ i.jsx(
      "span",
      {
        className: l("inline-block h-1.5 w-1.5 rounded-full", Ae[e]),
        "aria-hidden": "true"
      }
    ),
    a
  ] });
}
function A({ open: e, onOpenChange: t, children: r }) {
  return /* @__PURE__ */ i.jsx(fe, { open: e, onOpenChange: t, children: r });
}
const Be = p.forwardRef(function({ side: t, className: r, children: n, title: a, description: s, ...d }, o) {
  const u = t === "bottom" ? "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom" : t === "right" ? "inset-y-0 right-0 w-full max-w-md border-l animate-sheet-right" : l(
    "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom",
    "tablet:inset-x-auto tablet:inset-y-0 tablet:right-0 tablet:left-auto tablet:bottom-auto",
    "tablet:w-full tablet:max-w-md tablet:max-h-none tablet:rounded-none tablet:border-l tablet:border-t-0",
    "tablet:animate-sheet-right"
  );
  return /* @__PURE__ */ i.jsxs(oe, { children: [
    /* @__PURE__ */ i.jsx(le, { className: l(
      "fixed inset-0 z-modal-backdrop",
      "bg-surface-overlay backdrop-blur-sm",
      "animate-overlay-fade"
    ) }),
    /* @__PURE__ */ i.jsxs(
      de,
      {
        ref: o,
        "aria-describedby": void 0,
        className: l(
          "fixed z-modal",
          "bg-surface-base text-text-primary",
          "border-default shadow-xl",
          "flex flex-col",
          "focus-visible:outline-none",
          u,
          r
        ),
        ...d,
        children: [
          /* @__PURE__ */ i.jsx("div", { className: "tablet:hidden flex justify-center pt-2 pb-1", children: /* @__PURE__ */ i.jsx("div", { className: "h-1 w-10 rounded-full bg-neutral-300", "aria-hidden": "true" }) }),
          a && /* @__PURE__ */ i.jsx(ce, { className: "sr-only", children: a }),
          s && /* @__PURE__ */ i.jsx(ue, { className: "sr-only", children: s }),
          n
        ]
      }
    )
  ] });
}), ze = me, Pe = be;
A.Trigger = ze;
A.Close = Pe;
A.Content = Be;
const L = {
  sm: { dot: "h-1 w-1", gap: "gap-0.5" },
  md: { dot: "h-1.5 w-1.5", gap: "gap-0.5" },
  lg: { dot: "h-2 w-2", gap: "gap-1" }
};
function $(e) {
  return typeof e != "number" || !Number.isFinite(e) ? 0 : e > 1 ? Math.max(0, Math.min(100, e)) / 100 : Math.max(0, Math.min(1, e));
}
function q(e) {
  return e >= 0.85 ? { dots: 5, label: w("Ai:Confidence:VeryHigh", "Çok yüksek güven") } : e >= 0.7 ? { dots: 4, label: w("Ai:Confidence:High", "Yüksek güven") } : e >= 0.5 ? { dots: 3, label: w("Ai:Confidence:Medium", "Orta güven") } : e >= 0.3 ? { dots: 2, label: w("Ai:Confidence:Low", "Düşük güven") } : { dots: 1, label: w("Ai:Confidence:VeryLow", "Çok düşük güven") };
}
function G({ score: e, label: t, size: r = "md", showLabel: n = !0, className: a }) {
  const s = $(e), d = q(s), o = L[r] ?? L.md, u = t ?? d.label, c = Math.round(s * 100);
  return /* @__PURE__ */ i.jsxs(
    "span",
    {
      className: l("inline-flex items-center gap-1 text-xs text-text-tertiary", a),
      title: `${d.label} (%${c})`,
      children: [
        /* @__PURE__ */ i.jsx("span", { className: l("inline-flex items-center", o.gap), "aria-hidden": "true", children: Array.from({ length: 5 }, (m, b) => /* @__PURE__ */ i.jsx(
          "span",
          {
            className: l(
              "inline-block rounded-full",
              o.dot,
              b < d.dots ? "bg-ai-500" : "bg-neutral-200"
            )
          },
          b
        )) }),
        n && /* @__PURE__ */ i.jsx("span", { "aria-hidden": "true", children: u }),
        /* @__PURE__ */ i.jsxs("span", { className: "sr-only", children: [
          "Güven düzeyi: ",
          d.label,
          " (%",
          c,
          ")"
        ] })
      ]
    }
  );
}
G.bandFor = q;
G.normalize = $;
function rt({ onUpdate: e, onReady: t } = {}) {
  typeof window > "u" || !("serviceWorker" in navigator) || (window.addEventListener("beforeinstallprompt", (r) => {
    r.preventDefault(), window.__apyaInstallPrompt = r;
  }), window.addEventListener("load", async () => {
    try {
      const r = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      r.waiting && (e == null || e(r)), r.addEventListener("updatefound", () => {
        const n = r.installing;
        n && n.addEventListener("statechange", () => {
          n.state === "installed" && navigator.serviceWorker.controller ? e == null || e(r) : n.state === "activated" && (t == null || t(r));
        });
      }), t == null || t(r);
    } catch (r) {
      console.warn("[SW] register failed:", r == null ? void 0 : r.message);
    }
  }));
}
export {
  Xe as B,
  y as C,
  De as I,
  et as M,
  Qe as Q,
  Ue as S,
  We as T,
  Ce as a,
  Te as b,
  l as c,
  Ee as d,
  tt as e,
  Ve as f,
  Ke as g,
  Ge as h,
  qe as i,
  G as j,
  A as k,
  $e as l,
  Je as m,
  He as n,
  rt as r,
  w as t,
  Ze as u
};
