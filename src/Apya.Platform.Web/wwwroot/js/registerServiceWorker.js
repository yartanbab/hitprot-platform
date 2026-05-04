import { r as f, j as s, e as b } from "./react-vendor.js";
import { Q as X, c as Z } from "./query-vendor.js";
import { t as U, c as V, a as F, S as ee, P as te, O as re, C as se, T as ne, D as ae, R as oe, b as ie, d as de } from "./ui-vendor.js";
const _ = "apya-theme", j = "system", W = f.createContext({
  preference: j,
  resolvedTheme: "light",
  setPreference: () => {
  },
  toggle: () => {
  }
});
function le() {
  if (typeof window > "u") return j;
  try {
    const e = window.localStorage.getItem(_);
    if (e === "light" || e === "dark" || e === "system")
      return e;
  } catch {
  }
  return j;
}
function z() {
  return typeof window > "u" || !window.matchMedia ? !1 : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function S(e) {
  return e === "dark" ? "dark" : e === "light" ? "light" : z() ? "dark" : "light";
}
function E(e) {
  if (typeof document > "u") return;
  const t = document.documentElement;
  t.setAttribute("data-theme", e), e === "dark" ? t.classList.add("dark") : t.classList.remove("dark"), t.classList.remove("lpx-theme-light", "lpx-theme-dark", "lpx-theme-dim"), t.classList.add(e === "dark" ? "lpx-theme-dark" : "lpx-theme-light");
}
function Oe({ children: e, defaultPreference: t = j }) {
  const [r, a] = f.useState(() => le() ?? t), [o, n] = f.useState(() => S(r)), u = f.useCallback((l) => {
    if (l !== "light" && l !== "dark" && l !== "system") return;
    a(l);
    try {
      window.localStorage.setItem(_, l);
    } catch {
    }
    const m = S(l);
    n(m), E(m);
  }, []);
  f.useEffect(() => {
    if (r !== "system" || typeof window > "u" || !window.matchMedia)
      return;
    const l = window.matchMedia("(prefers-color-scheme: dark)"), m = () => {
      const p = z() ? "dark" : "light";
      n(p), E(p);
    };
    return l.addEventListener("change", m), () => l.removeEventListener("change", m);
  }, [r]), f.useEffect(() => {
    E(S(r));
  }, []);
  const i = f.useCallback(() => {
    const l = ["light", "dark", "system"], m = l.indexOf(r), p = l[(m + 1) % l.length];
    u(p);
  }, [r, u]), c = f.useMemo(
    () => ({ preference: r, resolvedTheme: o, setPreference: u, toggle: i }),
    [r, o, u, i]
  );
  return /* @__PURE__ */ s.jsx(W.Provider, { value: c, children: e });
}
function ce() {
  const e = f.useContext(W);
  if (!e)
    throw new Error("useTheme must be used inside a <ThemeProvider>.");
  return e;
}
class ue extends Error {
  constructor(t, { status: r, code: a, details: o, validationErrors: n } = {}) {
    super(t), this.name = "ApiError", this.status = r, this.code = a, this.details = o, this.validationErrors = n;
  }
}
function fe() {
  return new X({
    defaultOptions: {
      queries: {
        staleTime: 3e4,
        gcTime: 5 * 6e4,
        refetchOnWindowFocus: !0,
        refetchOnReconnect: !0,
        retry: (e, t) => t instanceof ue && t.status >= 400 && t.status < 500 ? !1 : e < 2
      },
      mutations: {
        /* Mutation default'ta retry YAPMAZ — duplicate finansal işlem riski. */
        retry: !1
      }
    }
  });
}
const _e = {
  dashboard: {
    budget: () => ["dashboard", "budget"],
    cashflow: () => ["dashboard", "cashflow"],
    approvals: (e) => e ? ["dashboard", "approvals", e] : ["dashboard", "approvals"],
    risks: () => ["dashboard", "risks"],
    aiSuggestions: (e) => e ? ["dashboard", "ai-suggestions", e] : ["dashboard", "ai-suggestions"]
  }
};
function We({ children: e }) {
  const [t] = f.useState(() => fe());
  return /* @__PURE__ */ s.jsx(Z, { client: t, children: e });
}
function d(...e) {
  return U(V(e));
}
function ze(e, t, r = "tr-TR") {
  return typeof e != "number" || !Number.isFinite(e) ? "—" : new Intl.NumberFormat(r, {
    style: "currency",
    currency: t,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(e);
}
function Ye(e, t, r = "tr-TR") {
  return typeof e != "number" || !Number.isFinite(e) ? "—" : new Intl.NumberFormat(r, {
    style: "currency",
    currency: t,
    notation: "compact",
    maximumFractionDigits: 1
  }).format(e);
}
function Qe(e, t = "tr-TR") {
  if (typeof e != "number" || !Number.isFinite(e))
    return { sign: "", symbol: "•", text: "—" };
  const r = Math.abs(e), a = new Intl.NumberFormat(t, {
    style: "percent",
    maximumFractionDigits: 1
  }).format(r / 100);
  return e > 0 ? { sign: "+", symbol: "▲", text: a } : e < 0 ? { sign: "−", symbol: "▼", text: a } : { sign: "", symbol: "•", text: a };
}
const Y = f.createContext(null), D = {
  info: { ring: "border-default", icon: "text-text-secondary", accent: "bg-brand-500" },
  success: { ring: "border-positive-100", icon: "text-text-positive", accent: "bg-positive-500" },
  warning: { ring: "border-warning-100", icon: "text-text-warning", accent: "bg-warning-500" },
  error: { ring: "border-negative-100", icon: "text-text-negative", accent: "bg-negative-500" }
}, me = 4e3, xe = 1e4;
let be = 0;
function He({ children: e }) {
  const [t, r] = f.useState([]), a = f.useRef(/* @__PURE__ */ new Map()), o = f.useCallback((i) => {
    const c = a.current.get(i);
    c && (clearTimeout(c), a.current.delete(i)), r((l) => l.filter((m) => m.id !== i));
  }, []), n = f.useCallback((i) => {
    const c = ++be, l = {
      id: c,
      type: i.type ?? "info",
      message: i.message ?? "",
      description: i.description,
      action: i.action,
      /* { label, onClick } */
      duration: i.duration ?? (i.action ? xe : me)
    };
    if (r((m) => [...m, l]), l.duration > 0) {
      const m = setTimeout(() => o(c), l.duration);
      a.current.set(c, m);
    }
    return c;
  }, [o]);
  f.useEffect(() => () => {
    a.current.forEach(clearTimeout), a.current.clear();
  }, []);
  const u = b.useMemo(() => ({
    show: n,
    dismiss: o,
    info: (i, c = {}) => n({ ...c, type: "info", message: i }),
    success: (i, c = {}) => n({ ...c, type: "success", message: i }),
    warning: (i, c = {}) => n({ ...c, type: "warning", message: i }),
    error: (i, c = {}) => n({ ...c, type: "error", message: i })
  }), [n, o]);
  return /* @__PURE__ */ s.jsxs(Y.Provider, { value: u, children: [
    e,
    /* @__PURE__ */ s.jsx(he, { items: t.slice(-3), onDismiss: o })
  ] });
}
function he({ items: e, onDismiss: t }) {
  return e.length === 0 ? null : /* @__PURE__ */ s.jsx(
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
      children: e.map((r) => /* @__PURE__ */ s.jsx(pe, { item: r, onDismiss: t }, r.id))
    }
  );
}
function pe({ item: e, onDismiss: t }) {
  const r = D[e.type] ?? D.info, a = e.type === "error" ? "assertive" : "polite", o = () => {
    var n, u;
    try {
      (u = (n = e.action) == null ? void 0 : n.onClick) == null || u.call(n);
    } finally {
      t(e.id);
    }
  };
  return /* @__PURE__ */ s.jsxs(
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
        /* @__PURE__ */ s.jsx("span", { className: d("w-1 flex-none rounded-l-md", r.accent), "aria-hidden": "true" }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex-1 min-w-0 px-3 py-2.5 flex items-start gap-2", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-0.5", children: [
            /* @__PURE__ */ s.jsx("p", { className: "text-sm font-medium text-text-primary truncate", children: e.message }),
            e.description && /* @__PURE__ */ s.jsx("p", { className: "text-xs text-text-tertiary line-clamp-2", children: e.description })
          ] }),
          e.action && /* @__PURE__ */ s.jsx(
            "button",
            {
              type: "button",
              onClick: o,
              className: d(
                "flex-none text-sm font-medium text-text-link",
                "hover:underline underline-offset-2",
                "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
              ),
              children: e.action.label
            }
          ),
          /* @__PURE__ */ s.jsx(
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
              children: /* @__PURE__ */ s.jsx("span", { "aria-hidden": "true", children: "×" })
            }
          )
        ] })
      ]
    }
  );
}
function qe() {
  const e = f.useContext(Y);
  if (!e)
    throw new Error("useToast must be used within <ToastProvider>.");
  return e;
}
const ge = F(
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
), Ke = b.forwardRef(function({
  className: t,
  variant: r,
  size: a,
  asChild: o = !1,
  isLoading: n = !1,
  loadingText: u,
  leadingIcon: i,
  trailingIcon: c,
  disabled: l,
  children: m,
  type: p = "button",
  ...k
}, N) {
  const I = o ? ee : "button", g = l || n;
  return /* @__PURE__ */ s.jsxs(
    I,
    {
      ref: N,
      type: o ? void 0 : p,
      disabled: o ? void 0 : g,
      "aria-busy": n || void 0,
      "data-loading": n || void 0,
      className: d(ge({ variant: r, size: a }), t),
      ...k,
      children: [
        n ? /* @__PURE__ */ s.jsx(ve, {}) : i,
        /* @__PURE__ */ s.jsx("span", { className: n ? "opacity-80" : void 0, children: n && u ? u : m }),
        !n && c
      ]
    }
  );
});
function ve() {
  return /* @__PURE__ */ s.jsx(
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
      children: /* @__PURE__ */ s.jsx("path", { d: "M21 12a9 9 0 1 1-6.219-8.56", strokeLinecap: "round" })
    }
  );
}
const we = {
  default: "bg-surface-raised border border-subtle shadow-sm",
  elevated: "bg-surface-elevated border border-subtle shadow-md",
  flat: "bg-surface-base border border-default shadow-none",
  interactive: d(
    "bg-surface-raised border border-subtle shadow-sm",
    "hover:shadow-md hover:border-default cursor-pointer",
    "transition-shadow duration-fast ease-standard"
  )
}, R = {
  compact: "p-3",
  comfortable: "p-4",
  spacious: "p-6"
}, w = b.forwardRef(function({ className: t, variant: r = "default", density: a, children: o, ...n }, u) {
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: u,
      "data-density": a,
      className: d(
        "rounded-lg overflow-hidden",
        "text-text-primary",
        we[r],
        t
      ),
      ...n,
      children: o
    }
  );
}), ye = b.forwardRef(function({ className: t, density: r = "comfortable", children: a, ...o }, n) {
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: n,
      className: d(
        "flex flex-col gap-1",
        "border-b border-subtle",
        R[r],
        t
      ),
      ...o,
      children: a
    }
  );
}), je = b.forwardRef(function({ className: t, as: r = "h3", children: a, ...o }, n) {
  return /* @__PURE__ */ s.jsx(
    r,
    {
      ref: n,
      className: d(
        "text-lg font-semibold leading-tight text-text-primary",
        t
      ),
      ...o,
      children: a
    }
  );
}), ke = b.forwardRef(function({ className: t, children: r, ...a }, o) {
  return /* @__PURE__ */ s.jsx(
    "p",
    {
      ref: o,
      className: d("text-sm text-text-secondary", t),
      ...a,
      children: r
    }
  );
}), Ne = b.forwardRef(function({ className: t, density: r = "comfortable", children: a, ...o }, n) {
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: n,
      className: d(R[r], t),
      ...o,
      children: a
    }
  );
}), Te = b.forwardRef(function({ className: t, density: r = "comfortable", children: a, ...o }, n) {
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: n,
      className: d(
        "flex items-center justify-end gap-2",
        "border-t border-subtle bg-surface-sunken",
        R[r],
        t
      ),
      ...o,
      children: a
    }
  );
});
w.Header = ye;
w.Title = je;
w.Description = ke;
w.Body = Ne;
w.Footer = Te;
function Ge({ className: e, width: t, height: r, rounded: a = "md", ...o }) {
  const n = {};
  return t !== void 0 && (n.width = typeof t == "number" ? `${t}px` : t), r !== void 0 && (n.height = typeof r == "number" ? `${r}px` : r), /* @__PURE__ */ s.jsx(
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
      style: n,
      ...o
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
), Ce = b.forwardRef(function({
  className: t,
  size: r,
  invalid: a,
  leading: o,
  trailing: n,
  type: u = "text",
  ...i
}, c) {
  const l = a ? "error" : "default";
  return !o && !n ? /* @__PURE__ */ s.jsx(
    "input",
    {
      ref: c,
      type: u,
      "aria-invalid": a || void 0,
      className: d(A({ size: r, tone: l }), t),
      ...i
    }
  ) : /* @__PURE__ */ s.jsxs(
    "span",
    {
      className: d(
        A({ size: r, tone: l }),
        "inline-flex items-center gap-2 px-0",
        "focus-within:shadow-focus focus-within:border-focus",
        t
      ),
      children: [
        o && /* @__PURE__ */ s.jsx("span", { className: "flex-none pl-3 text-text-tertiary", children: o }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            ref: c,
            type: u,
            "aria-invalid": a || void 0,
            className: d(
              "flex-1 min-w-0 bg-transparent outline-none border-0 p-0",
              "text-text-primary placeholder:text-text-tertiary",
              !o && "pl-3",
              !n && "pr-3",
              "disabled:cursor-not-allowed disabled:text-text-disabled"
            ),
            ...i
          }
        ),
        n && /* @__PURE__ */ s.jsx("span", { className: "flex-none pr-3 text-text-tertiary", children: n })
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
function P(e) {
  if (e == null) return null;
  const t = String(e).trim();
  if (t === "" || t === "-") return null;
  const r = t.lastIndexOf(","), a = t.lastIndexOf(".");
  let o;
  r > a ? o = t.replace(/\./g, "").replace(",", ".") : a > r ? o = t.replace(/,/g, "") : o = t, o = o.replace(/[^\d.\-]/g, "");
  const n = Number(o);
  return Number.isFinite(n) ? n : null;
}
function M(e, t, r) {
  return e == null || !Number.isFinite(e) ? "" : new Intl.NumberFormat(t, {
    minimumFractionDigits: r,
    maximumFractionDigits: r,
    useGrouping: !0
  }).format(e);
}
b.forwardRef(function({
  value: t,
  onValueChange: r,
  currency: a = "TRY",
  currencies: o,
  /* opsiyonel array → dropdown */
  onCurrencyChange: n,
  locale: u = "tr-TR",
  fractionDigits: i = 2,
  min: c,
  max: l,
  invalid: m,
  size: p,
  placeholder: k = "0,00",
  className: N,
  inputClassName: I,
  ...g
}, Q) {
  const [T, y] = f.useState(() => M(t, u, i)), C = f.useRef(!1);
  b.useEffect(() => {
    C.current || y(M(t, u, i));
  }, [t, u, i]);
  const H = f.useCallback((x) => {
    const h = x.target.value;
    y(h);
    const v = P(h);
    r == null || r(v);
  }, [r]), q = f.useCallback((x) => {
    C.current = !0, t != null && (y(String(t).replace(".", u.startsWith("tr") ? "," : ".")), requestAnimationFrame(() => {
      var h, v;
      return (v = (h = x.target) == null ? void 0 : h.select) == null ? void 0 : v.call(h);
    }));
  }, [t, u]), K = f.useCallback((x) => {
    var v;
    C.current = !1;
    const h = P(T);
    r == null || r(h), y(M(h, u, i)), (v = g.onBlur) == null || v.call(g, x);
  }, [T, r, u, i, g]), G = f.useMemo(() => t == null ? !1 : c != null && t < c || l != null && t > l, [t, c, l]), $ = L[a] ?? a, J = o && o.length > 1 && n ? /* @__PURE__ */ s.jsx(
    "select",
    {
      value: a,
      onChange: (x) => n(x.target.value),
      "aria-label": "Para birimi",
      className: d(
        "bg-transparent border-0 outline-none text-sm text-text-secondary",
        "pr-1 -mr-1 cursor-pointer",
        "focus-visible:outline-none"
      ),
      children: o.map((x) => /* @__PURE__ */ s.jsx("option", { value: x, children: L[x] ?? x }, x))
    }
  ) : /* @__PURE__ */ s.jsx("span", { className: "font-medium text-text-secondary", children: $ });
  return /* @__PURE__ */ s.jsx(
    Ce,
    {
      ref: Q,
      inputMode: "decimal",
      type: "text",
      value: T,
      placeholder: k,
      onChange: H,
      onFocus: q,
      onBlur: K,
      invalid: m || G,
      size: p,
      trailing: J,
      className: d("font-tabular text-right", N),
      ...g
    }
  );
});
const Se = F(
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
), Ee = {
  neutral: "bg-neutral-500",
  brand: "bg-brand-500",
  positive: "bg-positive-500",
  negative: "bg-negative-500",
  warning: "bg-warning-500",
  critical: "bg-critical-500",
  ai: "bg-ai-500"
};
function $e({ variant: e = "neutral", size: t, withDot: r = !1, className: a, children: o, ...n }) {
  return /* @__PURE__ */ s.jsxs("span", { className: d(Se({ variant: e, size: t }), a), ...n, children: [
    r && /* @__PURE__ */ s.jsx(
      "span",
      {
        className: d("inline-block h-1.5 w-1.5 rounded-full", Ee[e]),
        "aria-hidden": "true"
      }
    ),
    o
  ] });
}
const O = {
  light: "Açık tema (Sıradaki: Koyu)",
  dark: "Koyu tema (Sıradaki: Sistem)",
  system: "Sistem teması (Sıradaki: Açık)"
};
function Je({ className: e = "" }) {
  const { preference: t, toggle: r } = ce();
  return /* @__PURE__ */ s.jsxs(
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
        t === "light" && /* @__PURE__ */ s.jsx(Me, {}),
        t === "dark" && /* @__PURE__ */ s.jsx(Fe, {}),
        t === "system" && /* @__PURE__ */ s.jsx(Re, {})
      ]
    }
  );
}
function Me() {
  return /* @__PURE__ */ s.jsxs(
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
        /* @__PURE__ */ s.jsx("circle", { cx: "12", cy: "12", r: "4" }),
        /* @__PURE__ */ s.jsx("path", { d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" })
      ]
    }
  );
}
function Fe() {
  return /* @__PURE__ */ s.jsx(
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
      children: /* @__PURE__ */ s.jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" })
    }
  );
}
function Re() {
  return /* @__PURE__ */ s.jsxs(
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
        /* @__PURE__ */ s.jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }),
        /* @__PURE__ */ s.jsx("path", { d: "M8 21h8M12 17v4" })
      ]
    }
  );
}
function B({ open: e, onOpenChange: t, children: r }) {
  return /* @__PURE__ */ s.jsx(oe, { open: e, onOpenChange: t, children: r });
}
const Be = b.forwardRef(function({ side: t, className: r, children: a, title: o, description: n, ...u }, i) {
  const c = t === "bottom" ? "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom" : t === "right" ? "inset-y-0 right-0 w-full max-w-md border-l animate-sheet-right" : d(
    "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom",
    "tablet:inset-x-auto tablet:inset-y-0 tablet:right-0 tablet:left-auto tablet:bottom-auto",
    "tablet:w-full tablet:max-w-md tablet:max-h-none tablet:rounded-none tablet:border-l tablet:border-t-0",
    "tablet:animate-sheet-right"
  );
  return /* @__PURE__ */ s.jsxs(te, { children: [
    /* @__PURE__ */ s.jsx(re, { className: d(
      "fixed inset-0 z-modal-backdrop",
      "bg-surface-overlay backdrop-blur-sm",
      "animate-overlay-fade"
    ) }),
    /* @__PURE__ */ s.jsxs(
      se,
      {
        ref: i,
        "aria-describedby": void 0,
        className: d(
          "fixed z-modal",
          "bg-surface-base text-text-primary",
          "border-default shadow-xl",
          "flex flex-col",
          "focus-visible:outline-none",
          c,
          r
        ),
        ...u,
        children: [
          /* @__PURE__ */ s.jsx("div", { className: "tablet:hidden flex justify-center pt-2 pb-1", children: /* @__PURE__ */ s.jsx("div", { className: "h-1 w-10 rounded-full bg-neutral-300", "aria-hidden": "true" }) }),
          o && /* @__PURE__ */ s.jsx(ne, { className: "sr-only", children: o }),
          n && /* @__PURE__ */ s.jsx(ae, { className: "sr-only", children: n }),
          a
        ]
      }
    )
  ] });
}), Ie = ie, De = de;
B.Trigger = Ie;
B.Close = De;
B.Content = Be;
function Xe({ onUpdate: e, onReady: t } = {}) {
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
  ue as A,
  $e as B,
  w as C,
  _e as Q,
  Ge as S,
  Je as T,
  ye as a,
  je as b,
  d as c,
  Ne as d,
  Ye as e,
  Qe as f,
  ze as g,
  Ke as h,
  Oe as i,
  We as j,
  He as k,
  B as l,
  Xe as r,
  qe as u
};
