import { r as c, j as s, e as m } from "./react-vendor.js";
import { Q as F, c as L } from "./query-vendor.js";
import { t as P, c as B, a as j, S as R, P as A, O as I, C as W, T as _, D as z, R as O, b as Q, d as K } from "./ui-vendor.js";
const C = "apya-theme", g = "system", T = c.createContext({
  preference: g,
  resolvedTheme: "light",
  setPreference: () => {
  },
  toggle: () => {
  }
});
function V() {
  if (typeof window > "u") return g;
  try {
    const e = window.localStorage.getItem(C);
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
function fe({ children: e, defaultPreference: t = g }) {
  const [r, a] = c.useState(() => V() ?? t), [o, n] = c.useState(() => p(r)), l = c.useCallback((d) => {
    if (d !== "light" && d !== "dark" && d !== "system") return;
    a(d);
    try {
      window.localStorage.setItem(C, d);
    } catch {
    }
    const u = p(d);
    n(u), v(u);
  }, []);
  c.useEffect(() => {
    if (r !== "system" || typeof window > "u" || !window.matchMedia)
      return;
    const d = window.matchMedia("(prefers-color-scheme: dark)"), u = () => {
      const f = S() ? "dark" : "light";
      n(f), v(f);
    };
    return d.addEventListener("change", u), () => d.removeEventListener("change", u);
  }, [r]), c.useEffect(() => {
    v(p(r));
  }, []);
  const b = c.useCallback(() => {
    const d = ["light", "dark", "system"], u = d.indexOf(r), f = d[(u + 1) % d.length];
    l(f);
  }, [r, l]), h = c.useMemo(
    () => ({ preference: r, resolvedTheme: o, setPreference: l, toggle: b }),
    [r, o, l, b]
  );
  return /* @__PURE__ */ s.jsx(T.Provider, { value: h, children: e });
}
function H() {
  const e = c.useContext(T);
  if (!e)
    throw new Error("useTheme must be used inside a <ThemeProvider>.");
  return e;
}
class q extends Error {
  constructor(t, { status: r, code: a, details: o, validationErrors: n } = {}) {
    super(t), this.name = "ApiError", this.status = r, this.code = a, this.details = o, this.validationErrors = n;
  }
}
function $() {
  return new F({
    defaultOptions: {
      queries: {
        staleTime: 3e4,
        gcTime: 5 * 6e4,
        refetchOnWindowFocus: !0,
        refetchOnReconnect: !0,
        retry: (e, t) => t instanceof q && t.status >= 400 && t.status < 500 ? !1 : e < 2
      },
      mutations: {
        /* Mutation default'ta retry YAPMAZ — duplicate finansal işlem riski. */
        retry: !1
      }
    }
  });
}
const be = {
  dashboard: {
    budget: () => ["dashboard", "budget"],
    cashflow: () => ["dashboard", "cashflow"],
    approvals: (e) => e ? ["dashboard", "approvals", e] : ["dashboard", "approvals"],
    risks: () => ["dashboard", "risks"]
  }
};
function he({ children: e }) {
  const [t] = c.useState(() => $());
  return /* @__PURE__ */ s.jsx(L, { client: t, children: e });
}
function i(...e) {
  return P(B(e));
}
function xe(e, t, r = "tr-TR") {
  return typeof e != "number" || !Number.isFinite(e) ? "—" : new Intl.NumberFormat(r, {
    style: "currency",
    currency: t,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(e);
}
function ge(e, t, r = "tr-TR") {
  return typeof e != "number" || !Number.isFinite(e) ? "—" : new Intl.NumberFormat(r, {
    style: "currency",
    currency: t,
    notation: "compact",
    maximumFractionDigits: 1
  }).format(e);
}
function pe(e, t = "tr-TR") {
  if (typeof e != "number" || !Number.isFinite(e))
    return { sign: "", symbol: "•", text: "—" };
  const r = Math.abs(e), a = new Intl.NumberFormat(t, {
    style: "percent",
    maximumFractionDigits: 1
  }).format(r / 100);
  return e > 0 ? { sign: "+", symbol: "▲", text: a } : e < 0 ? { sign: "−", symbol: "▼", text: a } : { sign: "", symbol: "•", text: a };
}
const G = j(
  /* Base — her variant için ortak */
  i(
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
        primary: i(
          "bg-brand-500 text-text-inverse",
          "hover:bg-brand-600 active:bg-brand-700",
          "shadow-sm"
        ),
        secondary: i(
          "bg-surface-raised text-text-primary border border-default",
          "hover:bg-surface-elevated hover:border-strong"
        ),
        ghost: i(
          "bg-transparent text-text-secondary",
          "hover:bg-surface-raised hover:text-text-primary"
        ),
        destructive: i(
          "bg-negative-500 text-text-inverse",
          "hover:bg-negative-600 active:bg-negative-700",
          "shadow-sm"
        ),
        outline: i(
          "bg-transparent text-text-primary border border-strong",
          "hover:bg-surface-raised"
        ),
        link: i(
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
), ve = m.forwardRef(function({
  className: t,
  variant: r,
  size: a,
  asChild: o = !1,
  isLoading: n = !1,
  loadingText: l,
  leadingIcon: b,
  trailingIcon: h,
  disabled: d,
  children: u,
  type: f = "button",
  ...N
}, E) {
  const M = o ? R : "button", D = d || n;
  return /* @__PURE__ */ s.jsxs(
    M,
    {
      ref: E,
      type: o ? void 0 : f,
      disabled: o ? void 0 : D,
      "aria-busy": n || void 0,
      "data-loading": n || void 0,
      className: i(G({ variant: r, size: a }), t),
      ...N,
      children: [
        n ? /* @__PURE__ */ s.jsx(Y, {}) : b,
        /* @__PURE__ */ s.jsx("span", { className: n ? "opacity-80" : void 0, children: n && l ? l : u }),
        !n && h
      ]
    }
  );
});
function Y() {
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
const J = {
  default: "bg-surface-raised border border-subtle shadow-sm",
  elevated: "bg-surface-elevated border border-subtle shadow-md",
  flat: "bg-surface-base border border-default shadow-none",
  interactive: i(
    "bg-surface-raised border border-subtle shadow-sm",
    "hover:shadow-md hover:border-default cursor-pointer",
    "transition-shadow duration-fast ease-standard"
  )
}, w = {
  compact: "p-3",
  comfortable: "p-4",
  spacious: "p-6"
}, x = m.forwardRef(function({ className: t, variant: r = "default", density: a, children: o, ...n }, l) {
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: l,
      "data-density": a,
      className: i(
        "rounded-lg overflow-hidden",
        "text-text-primary",
        J[r],
        t
      ),
      ...n,
      children: o
    }
  );
}), X = m.forwardRef(function({ className: t, density: r = "comfortable", children: a, ...o }, n) {
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: n,
      className: i(
        "flex flex-col gap-1",
        "border-b border-subtle",
        w[r],
        t
      ),
      ...o,
      children: a
    }
  );
}), Z = m.forwardRef(function({ className: t, as: r = "h3", children: a, ...o }, n) {
  return /* @__PURE__ */ s.jsx(
    r,
    {
      ref: n,
      className: i(
        "text-lg font-semibold leading-tight text-text-primary",
        t
      ),
      ...o,
      children: a
    }
  );
}), U = m.forwardRef(function({ className: t, children: r, ...a }, o) {
  return /* @__PURE__ */ s.jsx(
    "p",
    {
      ref: o,
      className: i("text-sm text-text-secondary", t),
      ...a,
      children: r
    }
  );
}), ee = m.forwardRef(function({ className: t, density: r = "comfortable", children: a, ...o }, n) {
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: n,
      className: i(w[r], t),
      ...o,
      children: a
    }
  );
}), te = m.forwardRef(function({ className: t, density: r = "comfortable", children: a, ...o }, n) {
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: n,
      className: i(
        "flex items-center justify-end gap-2",
        "border-t border-subtle bg-surface-sunken",
        w[r],
        t
      ),
      ...o,
      children: a
    }
  );
});
x.Header = X;
x.Title = Z;
x.Description = U;
x.Body = ee;
x.Footer = te;
function we({ className: e, width: t, height: r, rounded: a = "md", ...o }) {
  const n = {};
  return t !== void 0 && (n.width = typeof t == "number" ? `${t}px` : t), r !== void 0 && (n.height = typeof r == "number" ? `${r}px` : r), /* @__PURE__ */ s.jsx(
    "div",
    {
      "aria-busy": "true",
      "aria-live": "polite",
      className: i(
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
const re = j(
  i(
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
), se = {
  neutral: "bg-neutral-500",
  brand: "bg-brand-500",
  positive: "bg-positive-500",
  negative: "bg-negative-500",
  warning: "bg-warning-500",
  critical: "bg-critical-500",
  ai: "bg-ai-500"
};
function ye({ variant: e = "neutral", size: t, withDot: r = !1, className: a, children: o, ...n }) {
  return /* @__PURE__ */ s.jsxs("span", { className: i(re({ variant: e, size: t }), a), ...n, children: [
    r && /* @__PURE__ */ s.jsx(
      "span",
      {
        className: i("inline-block h-1.5 w-1.5 rounded-full", se[e]),
        "aria-hidden": "true"
      }
    ),
    o
  ] });
}
const k = {
  light: "Açık tema (Sıradaki: Koyu)",
  dark: "Koyu tema (Sıradaki: Sistem)",
  system: "Sistem teması (Sıradaki: Açık)"
};
function ke({ className: e = "" }) {
  const { preference: t, toggle: r } = H();
  return /* @__PURE__ */ s.jsxs(
    "button",
    {
      type: "button",
      onClick: r,
      "aria-label": k[t] ?? "Tema değiştir",
      title: k[t] ?? "Tema değiştir",
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
        t === "light" && /* @__PURE__ */ s.jsx(ae, {}),
        t === "dark" && /* @__PURE__ */ s.jsx(ne, {}),
        t === "system" && /* @__PURE__ */ s.jsx(oe, {})
      ]
    }
  );
}
function ae() {
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
function ne() {
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
function oe() {
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
  return /* @__PURE__ */ s.jsx(O, { open: e, onOpenChange: t, children: r });
}
const ie = m.forwardRef(function({ side: t, className: r, children: a, title: o, description: n, ...l }, b) {
  const h = t === "bottom" ? "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom" : t === "right" ? "inset-y-0 right-0 w-full max-w-md border-l animate-sheet-right" : i(
    "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom",
    "tablet:inset-x-auto tablet:inset-y-0 tablet:right-0 tablet:left-auto tablet:bottom-auto",
    "tablet:w-full tablet:max-w-md tablet:max-h-none tablet:rounded-none tablet:border-l tablet:border-t-0",
    "tablet:animate-sheet-right"
  );
  return /* @__PURE__ */ s.jsxs(A, { children: [
    /* @__PURE__ */ s.jsx(I, { className: i(
      "fixed inset-0 z-modal-backdrop",
      "bg-surface-overlay backdrop-blur-sm",
      "animate-overlay-fade"
    ) }),
    /* @__PURE__ */ s.jsxs(
      W,
      {
        ref: b,
        "aria-describedby": void 0,
        className: i(
          "fixed z-modal",
          "bg-surface-base text-text-primary",
          "border-default shadow-xl",
          "flex flex-col",
          "focus-visible:outline-none",
          h,
          r
        ),
        ...l,
        children: [
          /* @__PURE__ */ s.jsx("div", { className: "tablet:hidden flex justify-center pt-2 pb-1", children: /* @__PURE__ */ s.jsx("div", { className: "h-1 w-10 rounded-full bg-neutral-300", "aria-hidden": "true" }) }),
          o && /* @__PURE__ */ s.jsx(_, { className: "sr-only", children: o }),
          n && /* @__PURE__ */ s.jsx(z, { className: "sr-only", children: n }),
          a
        ]
      }
    )
  ] });
}), de = Q, le = K;
y.Trigger = de;
y.Close = le;
y.Content = ie;
function je({ onUpdate: e, onReady: t } = {}) {
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
  ye as B,
  x as C,
  be as Q,
  we as S,
  ke as T,
  X as a,
  Z as b,
  i as c,
  ee as d,
  ge as e,
  pe as f,
  xe as g,
  ve as h,
  fe as i,
  he as j,
  y as k,
  je as r
};
