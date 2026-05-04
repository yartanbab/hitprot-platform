import { r as u, j as s, e as b } from "./react-vendor.js";
import { Q as F, c as L } from "./query-vendor.js";
import { t as I, c as R, a as C, S as B, P as _, O, C as W, T as z, D as Q, R as V, b as K, d as q } from "./ui-vendor.js";
const T = "apya-theme", g = "system", N = u.createContext({
  preference: g,
  resolvedTheme: "light",
  setPreference: () => {
  },
  toggle: () => {
  }
});
function H() {
  if (typeof window > "u") return g;
  try {
    const e = window.localStorage.getItem(T);
    if (e === "light" || e === "dark" || e === "system")
      return e;
  } catch {
  }
  return g;
}
function S() {
  return typeof window > "u" || !window.matchMedia ? !1 : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function p(e) {
  return e === "dark" ? "dark" : e === "light" ? "light" : S() ? "dark" : "light";
}
function v(e) {
  if (typeof document > "u") return;
  const t = document.documentElement;
  t.setAttribute("data-theme", e), e === "dark" ? t.classList.add("dark") : t.classList.remove("dark"), t.classList.remove("lpx-theme-light", "lpx-theme-dark", "lpx-theme-dim"), t.classList.add(e === "dark" ? "lpx-theme-dark" : "lpx-theme-light");
}
function we({ children: e, defaultPreference: t = g }) {
  const [r, a] = u.useState(() => H() ?? t), [i, n] = u.useState(() => p(r)), m = u.useCallback((c) => {
    if (c !== "light" && c !== "dark" && c !== "system") return;
    a(c);
    try {
      window.localStorage.setItem(T, c);
    } catch {
    }
    const f = p(c);
    n(f), v(f);
  }, []);
  u.useEffect(() => {
    if (r !== "system" || typeof window > "u" || !window.matchMedia)
      return;
    const c = window.matchMedia("(prefers-color-scheme: dark)"), f = () => {
      const x = S() ? "dark" : "light";
      n(x), v(x);
    };
    return c.addEventListener("change", f), () => c.removeEventListener("change", f);
  }, [r]), u.useEffect(() => {
    v(p(r));
  }, []);
  const d = u.useCallback(() => {
    const c = ["light", "dark", "system"], f = c.indexOf(r), x = c[(f + 1) % c.length];
    m(x);
  }, [r, m]), l = u.useMemo(
    () => ({ preference: r, resolvedTheme: i, setPreference: m, toggle: d }),
    [r, i, m, d]
  );
  return /* @__PURE__ */ s.jsx(N.Provider, { value: l, children: e });
}
function Y() {
  const e = u.useContext(N);
  if (!e)
    throw new Error("useTheme must be used inside a <ThemeProvider>.");
  return e;
}
class $ extends Error {
  constructor(t, { status: r, code: a, details: i, validationErrors: n } = {}) {
    super(t), this.name = "ApiError", this.status = r, this.code = a, this.details = i, this.validationErrors = n;
  }
}
function G() {
  return new F({
    defaultOptions: {
      queries: {
        staleTime: 3e4,
        gcTime: 5 * 6e4,
        refetchOnWindowFocus: !0,
        refetchOnReconnect: !0,
        retry: (e, t) => t instanceof $ && t.status >= 400 && t.status < 500 ? !1 : e < 2
      },
      mutations: {
        /* Mutation default'ta retry YAPMAZ — duplicate finansal işlem riski. */
        retry: !1
      }
    }
  });
}
const ye = {
  dashboard: {
    budget: () => ["dashboard", "budget"],
    cashflow: () => ["dashboard", "cashflow"],
    approvals: (e) => e ? ["dashboard", "approvals", e] : ["dashboard", "approvals"],
    risks: () => ["dashboard", "risks"],
    aiSuggestions: (e) => e ? ["dashboard", "ai-suggestions", e] : ["dashboard", "ai-suggestions"]
  }
};
function ke({ children: e }) {
  const [t] = u.useState(() => G());
  return /* @__PURE__ */ s.jsx(L, { client: t, children: e });
}
function o(...e) {
  return I(R(e));
}
function je(e, t, r = "tr-TR") {
  return typeof e != "number" || !Number.isFinite(e) ? "—" : new Intl.NumberFormat(r, {
    style: "currency",
    currency: t,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(e);
}
function Ce(e, t, r = "tr-TR") {
  return typeof e != "number" || !Number.isFinite(e) ? "—" : new Intl.NumberFormat(r, {
    style: "currency",
    currency: t,
    notation: "compact",
    maximumFractionDigits: 1
  }).format(e);
}
function Te(e, t = "tr-TR") {
  if (typeof e != "number" || !Number.isFinite(e))
    return { sign: "", symbol: "•", text: "—" };
  const r = Math.abs(e), a = new Intl.NumberFormat(t, {
    style: "percent",
    maximumFractionDigits: 1
  }).format(r / 100);
  return e > 0 ? { sign: "+", symbol: "▲", text: a } : e < 0 ? { sign: "−", symbol: "▼", text: a } : { sign: "", symbol: "•", text: a };
}
const E = u.createContext(null), k = {
  info: { ring: "border-default", icon: "text-text-secondary", accent: "bg-brand-500" },
  success: { ring: "border-positive-100", icon: "text-text-positive", accent: "bg-positive-500" },
  warning: { ring: "border-warning-100", icon: "text-text-warning", accent: "bg-warning-500" },
  error: { ring: "border-negative-100", icon: "text-text-negative", accent: "bg-negative-500" }
}, J = 4e3, X = 1e4;
let Z = 0;
function Ne({ children: e }) {
  const [t, r] = u.useState([]), a = u.useRef(/* @__PURE__ */ new Map()), i = u.useCallback((d) => {
    const l = a.current.get(d);
    l && (clearTimeout(l), a.current.delete(d)), r((c) => c.filter((f) => f.id !== d));
  }, []), n = u.useCallback((d) => {
    const l = ++Z, c = {
      id: l,
      type: d.type ?? "info",
      message: d.message ?? "",
      description: d.description,
      action: d.action,
      /* { label, onClick } */
      duration: d.duration ?? (d.action ? X : J)
    };
    if (r((f) => [...f, c]), c.duration > 0) {
      const f = setTimeout(() => i(l), c.duration);
      a.current.set(l, f);
    }
    return l;
  }, [i]);
  u.useEffect(() => () => {
    a.current.forEach(clearTimeout), a.current.clear();
  }, []);
  const m = b.useMemo(() => ({
    show: n,
    dismiss: i,
    info: (d, l = {}) => n({ ...l, type: "info", message: d }),
    success: (d, l = {}) => n({ ...l, type: "success", message: d }),
    warning: (d, l = {}) => n({ ...l, type: "warning", message: d }),
    error: (d, l = {}) => n({ ...l, type: "error", message: d })
  }), [n, i]);
  return /* @__PURE__ */ s.jsxs(E.Provider, { value: m, children: [
    e,
    /* @__PURE__ */ s.jsx(U, { items: t.slice(-3), onDismiss: i })
  ] });
}
function U({ items: e, onDismiss: t }) {
  return e.length === 0 ? null : /* @__PURE__ */ s.jsx(
    "div",
    {
      role: "region",
      "aria-label": "Bildirimler",
      className: o(
        "fixed bottom-4 right-4 z-toast",
        "flex flex-col-reverse gap-2",
        "pointer-events-none",
        /* viewport tıklamaları geçirir; tek tek toast'lar pointer-auto */
        "max-w-[calc(100vw-2rem)]"
      ),
      children: e.map((r) => /* @__PURE__ */ s.jsx(ee, { item: r, onDismiss: t }, r.id))
    }
  );
}
function ee({ item: e, onDismiss: t }) {
  const r = k[e.type] ?? k.info, a = e.type === "error" ? "assertive" : "polite", i = () => {
    var n, m;
    try {
      (m = (n = e.action) == null ? void 0 : n.onClick) == null || m.call(n);
    } finally {
      t(e.id);
    }
  };
  return /* @__PURE__ */ s.jsxs(
    "div",
    {
      role: e.type === "error" ? "alert" : "status",
      "aria-live": a,
      className: o(
        "pointer-events-auto",
        "flex items-stretch gap-0",
        "min-w-[280px] max-w-[420px]",
        "bg-surface-raised border rounded-md shadow-lg",
        "animate-sheet-bottom",
        r.ring
      ),
      children: [
        /* @__PURE__ */ s.jsx("span", { className: o("w-1 flex-none rounded-l-md", r.accent), "aria-hidden": "true" }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex-1 min-w-0 px-3 py-2.5 flex items-start gap-2", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-0.5", children: [
            /* @__PURE__ */ s.jsx("p", { className: "text-sm font-medium text-text-primary truncate", children: e.message }),
            e.description && /* @__PURE__ */ s.jsx("p", { className: "text-xs text-text-tertiary line-clamp-2", children: e.description })
          ] }),
          e.action && /* @__PURE__ */ s.jsx(
            "button",
            {
              type: "button",
              onClick: i,
              className: o(
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
              className: o(
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
function Se() {
  const e = u.useContext(E);
  if (!e)
    throw new Error("useToast must be used within <ToastProvider>.");
  return e;
}
const te = C(
  /* Base — her variant için ortak */
  o(
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
        primary: o(
          "bg-brand-500 text-text-inverse",
          "hover:bg-brand-600 active:bg-brand-700",
          "shadow-sm"
        ),
        secondary: o(
          "bg-surface-raised text-text-primary border border-default",
          "hover:bg-surface-elevated hover:border-strong"
        ),
        ghost: o(
          "bg-transparent text-text-secondary",
          "hover:bg-surface-raised hover:text-text-primary"
        ),
        destructive: o(
          "bg-negative-500 text-text-inverse",
          "hover:bg-negative-600 active:bg-negative-700",
          "shadow-sm"
        ),
        outline: o(
          "bg-transparent text-text-primary border border-strong",
          "hover:bg-surface-raised"
        ),
        link: o(
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
), Ee = b.forwardRef(function({
  className: t,
  variant: r,
  size: a,
  asChild: i = !1,
  isLoading: n = !1,
  loadingText: m,
  leadingIcon: d,
  trailingIcon: l,
  disabled: c,
  children: f,
  type: x = "button",
  ...M
}, D) {
  const P = i ? B : "button", A = c || n;
  return /* @__PURE__ */ s.jsxs(
    P,
    {
      ref: D,
      type: i ? void 0 : x,
      disabled: i ? void 0 : A,
      "aria-busy": n || void 0,
      "data-loading": n || void 0,
      className: o(te({ variant: r, size: a }), t),
      ...M,
      children: [
        n ? /* @__PURE__ */ s.jsx(re, {}) : d,
        /* @__PURE__ */ s.jsx("span", { className: n ? "opacity-80" : void 0, children: n && m ? m : f }),
        !n && l
      ]
    }
  );
});
function re() {
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
const se = {
  default: "bg-surface-raised border border-subtle shadow-sm",
  elevated: "bg-surface-elevated border border-subtle shadow-md",
  flat: "bg-surface-base border border-default shadow-none",
  interactive: o(
    "bg-surface-raised border border-subtle shadow-sm",
    "hover:shadow-md hover:border-default cursor-pointer",
    "transition-shadow duration-fast ease-standard"
  )
}, w = {
  compact: "p-3",
  comfortable: "p-4",
  spacious: "p-6"
}, h = b.forwardRef(function({ className: t, variant: r = "default", density: a, children: i, ...n }, m) {
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: m,
      "data-density": a,
      className: o(
        "rounded-lg overflow-hidden",
        "text-text-primary",
        se[r],
        t
      ),
      ...n,
      children: i
    }
  );
}), ne = b.forwardRef(function({ className: t, density: r = "comfortable", children: a, ...i }, n) {
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: n,
      className: o(
        "flex flex-col gap-1",
        "border-b border-subtle",
        w[r],
        t
      ),
      ...i,
      children: a
    }
  );
}), ae = b.forwardRef(function({ className: t, as: r = "h3", children: a, ...i }, n) {
  return /* @__PURE__ */ s.jsx(
    r,
    {
      ref: n,
      className: o(
        "text-lg font-semibold leading-tight text-text-primary",
        t
      ),
      ...i,
      children: a
    }
  );
}), ie = b.forwardRef(function({ className: t, children: r, ...a }, i) {
  return /* @__PURE__ */ s.jsx(
    "p",
    {
      ref: i,
      className: o("text-sm text-text-secondary", t),
      ...a,
      children: r
    }
  );
}), oe = b.forwardRef(function({ className: t, density: r = "comfortable", children: a, ...i }, n) {
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: n,
      className: o(w[r], t),
      ...i,
      children: a
    }
  );
}), de = b.forwardRef(function({ className: t, density: r = "comfortable", children: a, ...i }, n) {
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: n,
      className: o(
        "flex items-center justify-end gap-2",
        "border-t border-subtle bg-surface-sunken",
        w[r],
        t
      ),
      ...i,
      children: a
    }
  );
});
h.Header = ne;
h.Title = ae;
h.Description = ie;
h.Body = oe;
h.Footer = de;
function Me({ className: e, width: t, height: r, rounded: a = "md", ...i }) {
  const n = {};
  return t !== void 0 && (n.width = typeof t == "number" ? `${t}px` : t), r !== void 0 && (n.height = typeof r == "number" ? `${r}px` : r), /* @__PURE__ */ s.jsx(
    "div",
    {
      "aria-busy": "true",
      "aria-live": "polite",
      className: o(
        "skeleton",
        a === "full" && "rounded-full",
        a === "sm" && "rounded-sm",
        a === "md" && "rounded-md",
        a === "lg" && "rounded-lg",
        e
      ),
      style: n,
      ...i
    }
  );
}
const ce = C(
  o(
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
), le = {
  neutral: "bg-neutral-500",
  brand: "bg-brand-500",
  positive: "bg-positive-500",
  negative: "bg-negative-500",
  warning: "bg-warning-500",
  critical: "bg-critical-500",
  ai: "bg-ai-500"
};
function De({ variant: e = "neutral", size: t, withDot: r = !1, className: a, children: i, ...n }) {
  return /* @__PURE__ */ s.jsxs("span", { className: o(ce({ variant: e, size: t }), a), ...n, children: [
    r && /* @__PURE__ */ s.jsx(
      "span",
      {
        className: o("inline-block h-1.5 w-1.5 rounded-full", le[e]),
        "aria-hidden": "true"
      }
    ),
    i
  ] });
}
const j = {
  light: "Açık tema (Sıradaki: Koyu)",
  dark: "Koyu tema (Sıradaki: Sistem)",
  system: "Sistem teması (Sıradaki: Açık)"
};
function Pe({ className: e = "" }) {
  const { preference: t, toggle: r } = Y();
  return /* @__PURE__ */ s.jsxs(
    "button",
    {
      type: "button",
      onClick: r,
      "aria-label": j[t] ?? "Tema değiştir",
      title: j[t] ?? "Tema değiştir",
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
        t === "light" && /* @__PURE__ */ s.jsx(ue, {}),
        t === "dark" && /* @__PURE__ */ s.jsx(me, {}),
        t === "system" && /* @__PURE__ */ s.jsx(fe, {})
      ]
    }
  );
}
function ue() {
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
function me() {
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
function fe() {
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
function y({ open: e, onOpenChange: t, children: r }) {
  return /* @__PURE__ */ s.jsx(V, { open: e, onOpenChange: t, children: r });
}
const be = b.forwardRef(function({ side: t, className: r, children: a, title: i, description: n, ...m }, d) {
  const l = t === "bottom" ? "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom" : t === "right" ? "inset-y-0 right-0 w-full max-w-md border-l animate-sheet-right" : o(
    "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom",
    "tablet:inset-x-auto tablet:inset-y-0 tablet:right-0 tablet:left-auto tablet:bottom-auto",
    "tablet:w-full tablet:max-w-md tablet:max-h-none tablet:rounded-none tablet:border-l tablet:border-t-0",
    "tablet:animate-sheet-right"
  );
  return /* @__PURE__ */ s.jsxs(_, { children: [
    /* @__PURE__ */ s.jsx(O, { className: o(
      "fixed inset-0 z-modal-backdrop",
      "bg-surface-overlay backdrop-blur-sm",
      "animate-overlay-fade"
    ) }),
    /* @__PURE__ */ s.jsxs(
      W,
      {
        ref: d,
        "aria-describedby": void 0,
        className: o(
          "fixed z-modal",
          "bg-surface-base text-text-primary",
          "border-default shadow-xl",
          "flex flex-col",
          "focus-visible:outline-none",
          l,
          r
        ),
        ...m,
        children: [
          /* @__PURE__ */ s.jsx("div", { className: "tablet:hidden flex justify-center pt-2 pb-1", children: /* @__PURE__ */ s.jsx("div", { className: "h-1 w-10 rounded-full bg-neutral-300", "aria-hidden": "true" }) }),
          i && /* @__PURE__ */ s.jsx(z, { className: "sr-only", children: i }),
          n && /* @__PURE__ */ s.jsx(Q, { className: "sr-only", children: n }),
          a
        ]
      }
    )
  ] });
}), xe = K, he = q;
y.Trigger = xe;
y.Close = he;
y.Content = be;
function Ae({ onUpdate: e, onReady: t } = {}) {
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
  $ as A,
  De as B,
  h as C,
  ye as Q,
  Me as S,
  Pe as T,
  ne as a,
  ae as b,
  o as c,
  oe as d,
  Ce as e,
  Te as f,
  je as g,
  Ee as h,
  we as i,
  ke as j,
  Ne as k,
  y as l,
  Ae as r,
  Se as u
};
