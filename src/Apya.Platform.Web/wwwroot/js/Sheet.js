import { r as u, j as o, d as x } from "./react-vendor.js";
import { t as J, c as K, a as E, S as Q, D as X, b as Z, d as V, e as ee, f as te, g as re, h as ne, i as ae } from "./ui-vendor.js";
const Y = "apya-theme", N = "system", _ = u.createContext({
  preference: N,
  resolvedTheme: "light",
  setPreference: () => {
  },
  toggle: () => {
  }
});
function se() {
  if (typeof window > "u") return N;
  try {
    const t = window.localStorage.getItem(Y);
    if (t === "light" || t === "dark" || t === "system")
      return t;
  } catch {
  }
  return N;
}
function H() {
  return typeof window > "u" || !window.matchMedia ? !1 : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function F(t) {
  return t === "dark" ? "dark" : t === "light" ? "light" : H() ? "dark" : "light";
}
function S(t) {
  if (typeof document > "u") return;
  const e = document.documentElement;
  e.setAttribute("data-theme", t), t === "dark" ? e.classList.add("dark") : e.classList.remove("dark"), e.classList.remove("lpx-theme-light", "lpx-theme-dark", "lpx-theme-dim"), e.classList.add(t === "dark" ? "lpx-theme-dark" : "lpx-theme-light");
}
function Ce({ children: t, defaultPreference: e = N }) {
  const [r, n] = u.useState(() => se() ?? e), [a, s] = u.useState(() => F(r)), l = u.useCallback((d) => {
    if (d !== "light" && d !== "dark" && d !== "system") return;
    n(d);
    try {
      window.localStorage.setItem(Y, d);
    } catch {
    }
    const b = F(d);
    s(b), S(b);
  }, []);
  u.useEffect(() => {
    if (r !== "system" || typeof window > "u" || !window.matchMedia)
      return;
    const d = window.matchMedia("(prefers-color-scheme: dark)"), b = () => {
      const h = H() ? "dark" : "light";
      s(h), S(h);
    };
    return d.addEventListener("change", b), () => d.removeEventListener("change", b);
  }, [r]), u.useEffect(() => {
    S(F(r));
  }, []);
  const c = u.useCallback(() => {
    const d = ["light", "dark", "system"], b = d.indexOf(r), h = d[(b + 1) % d.length];
    l(h);
  }, [r, l]), m = u.useMemo(
    () => ({ preference: r, resolvedTheme: a, setPreference: l, toggle: c }),
    [r, a, l, c]
  );
  return /* @__PURE__ */ o.jsx(_.Provider, { value: m, children: t });
}
function Re() {
  const t = u.useContext(_);
  if (!t)
    throw new Error("useTheme must be used inside a <ThemeProvider>.");
  return t;
}
function i(...t) {
  return J(K(t));
}
function Te(t, e, r = "tr-TR") {
  return typeof t != "number" || !Number.isFinite(t) ? "—" : new Intl.NumberFormat(r, {
    style: "currency",
    currency: e,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(t);
}
function Fe(t, e, r = "tr-TR") {
  return typeof t != "number" || !Number.isFinite(t) ? "—" : new Intl.NumberFormat(r, {
    style: "currency",
    currency: e,
    notation: "compact",
    maximumFractionDigits: 1
  }).format(t);
}
function Se(t, e = "tr-TR") {
  if (typeof t != "number" || !Number.isFinite(t))
    return { sign: "", symbol: "•", text: "—" };
  const r = Math.abs(t), n = new Intl.NumberFormat(e, {
    style: "percent",
    maximumFractionDigits: 1
  }).format(r / 100);
  return t > 0 ? { sign: "+", symbol: "▲", text: n } : t < 0 ? { sign: "−", symbol: "▼", text: n } : { sign: "", symbol: "•", text: n };
}
const oe = E(
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
          "hover:bg-brand-600 active:bg-brand-600",
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
), De = x.forwardRef(function({
  className: e,
  variant: r,
  size: n,
  asChild: a = !1,
  isLoading: s = !1,
  loadingText: l,
  leadingIcon: c,
  trailingIcon: m,
  disabled: d,
  children: b,
  type: h = "button",
  ...k
}, C) {
  const I = a ? Q : "button", g = d || s;
  return /* @__PURE__ */ o.jsxs(
    I,
    {
      ref: C,
      type: a ? void 0 : h,
      disabled: a ? void 0 : g,
      "aria-busy": s || void 0,
      "data-loading": s || void 0,
      className: i(oe({ variant: r, size: n }), e),
      ...k,
      children: [
        s ? /* @__PURE__ */ o.jsx(ie, {}) : c,
        /* @__PURE__ */ o.jsx("span", { className: s ? "opacity-80" : void 0, children: s && l ? l : b }),
        !s && m
      ]
    }
  );
});
function ie() {
  return /* @__PURE__ */ o.jsx(
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
      children: /* @__PURE__ */ o.jsx("path", { d: "M21 12a9 9 0 1 1-6.219-8.56", strokeLinecap: "round" })
    }
  );
}
const de = {
  default: "bg-surface-raised border border-subtle shadow-sm",
  elevated: "bg-surface-elevated border border-subtle shadow-md",
  flat: "bg-surface-base border border-default shadow-none",
  interactive: i(
    "bg-surface-raised border border-subtle shadow-sm",
    "hover:shadow-md hover:border-default cursor-pointer",
    "transition-shadow duration-fast ease-standard"
  )
}, M = {
  compact: "p-3",
  comfortable: "p-4",
  spacious: "p-6"
}, y = x.forwardRef(function({ className: e, variant: r = "default", density: n, children: a, ...s }, l) {
  return /* @__PURE__ */ o.jsx(
    "div",
    {
      ref: l,
      "data-density": n,
      className: i(
        "rounded-xl overflow-hidden",
        "text-text-primary",
        de[r],
        e
      ),
      ...s,
      children: a
    }
  );
}), le = x.forwardRef(function({ className: e, density: r = "comfortable", children: n, ...a }, s) {
  return /* @__PURE__ */ o.jsx(
    "div",
    {
      ref: s,
      className: i(
        "flex flex-col gap-1",
        "border-b border-subtle",
        M[r],
        e
      ),
      ...a,
      children: n
    }
  );
}), ce = x.forwardRef(function({ className: e, as: r = "h3", children: n, ...a }, s) {
  return /* @__PURE__ */ o.jsx(
    r,
    {
      ref: s,
      className: i(
        "text-lg font-semibold leading-tight text-text-primary",
        e
      ),
      ...a,
      children: n
    }
  );
}), ue = x.forwardRef(function({ className: e, children: r, ...n }, a) {
  return /* @__PURE__ */ o.jsx(
    "p",
    {
      ref: a,
      className: i("text-sm text-text-secondary", e),
      ...n,
      children: r
    }
  );
}), me = x.forwardRef(function({ className: e, density: r = "comfortable", children: n, ...a }, s) {
  return /* @__PURE__ */ o.jsx(
    "div",
    {
      ref: s,
      className: i(M[r], e),
      ...a,
      children: n
    }
  );
}), fe = x.forwardRef(function({ className: e, density: r = "comfortable", children: n, ...a }, s) {
  return /* @__PURE__ */ o.jsx(
    "div",
    {
      ref: s,
      className: i(
        "flex items-center justify-end gap-2",
        "border-t border-subtle bg-surface-sunken",
        M[r],
        e
      ),
      ...a,
      children: n
    }
  );
});
y.Header = le;
y.Title = ce;
y.Description = ue;
y.Body = me;
y.Footer = fe;
function Ee({ className: t, width: e, height: r, rounded: n = "md", ...a }) {
  const s = {};
  return e !== void 0 && (s.width = typeof e == "number" ? `${e}px` : e), r !== void 0 && (s.height = typeof r == "number" ? `${r}px` : r), /* @__PURE__ */ o.jsx(
    "div",
    {
      "aria-busy": "true",
      "aria-live": "polite",
      className: i(
        "skeleton",
        n === "full" && "rounded-full",
        n === "sm" && "rounded-sm",
        n === "md" && "rounded-md",
        n === "lg" && "rounded-lg",
        t
      ),
      style: s,
      ...a
    }
  );
}
const z = E(
  i(
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
), be = x.forwardRef(function({
  className: e,
  size: r,
  invalid: n,
  leading: a,
  trailing: s,
  type: l = "text",
  ...c
}, m) {
  const d = n ? "error" : "default";
  return !a && !s ? /* @__PURE__ */ o.jsx(
    "input",
    {
      ref: m,
      type: l,
      "aria-invalid": n || void 0,
      className: i(z({ size: r, tone: d }), e),
      ...c
    }
  ) : /* @__PURE__ */ o.jsxs(
    "span",
    {
      className: i(
        z({ size: r, tone: d }),
        "inline-flex items-center gap-2 px-0",
        "focus-within:shadow-focus focus-within:border-focus",
        e
      ),
      children: [
        a && /* @__PURE__ */ o.jsx("span", { className: "flex-none pl-3 text-text-tertiary", children: a }),
        /* @__PURE__ */ o.jsx(
          "input",
          {
            ref: m,
            type: l,
            "aria-invalid": n || void 0,
            className: i(
              "flex-1 min-w-0 bg-transparent outline-none border-0 p-0",
              "text-text-primary placeholder:text-text-tertiary",
              !a && "pl-3",
              !s && "pr-3",
              "disabled:cursor-not-allowed disabled:text-text-disabled"
            ),
            ...c
          }
        ),
        s && /* @__PURE__ */ o.jsx("span", { className: "flex-none pr-3 text-text-tertiary", children: s })
      ]
    }
  );
});
let j = null;
function xe() {
  var e, r;
  if (j) return j;
  const t = (r = (e = window == null ? void 0 : window.abp) == null ? void 0 : e.localization) == null ? void 0 : r.getResource;
  return typeof t == "function" && (j = t("Platform")), j;
}
function pe(t, e, ...r) {
  const n = xe(), a = n ? n(t, ...r) : null;
  return a != null && a !== t ? a : he(e ?? t, r);
}
function he(t, e) {
  return e.length ? String(t).replace(/\{(\d+)\}/g, (r, n) => e[n] ?? r) : t;
}
function Me() {
  var t, e, r, n;
  return ((r = (e = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.localization) == null ? void 0 : e.currentCulture) == null ? void 0 : r.name) || ((n = document == null ? void 0 : document.documentElement) == null ? void 0 : n.lang) || "tr-TR";
}
const P = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CHF: "CHF"
};
function O(t) {
  if (t == null) return null;
  const e = String(t).trim();
  if (e === "" || e === "-") return null;
  const r = e.lastIndexOf(","), n = e.lastIndexOf(".");
  let a;
  r > n ? a = e.replace(/\./g, "").replace(",", ".") : n > r ? a = e.replace(/,/g, "") : a = e, a = a.replace(/[^\d.\-]/g, "");
  const s = Number(a);
  return Number.isFinite(s) ? s : null;
}
function D(t, e, r) {
  return t == null || !Number.isFinite(t) ? "" : new Intl.NumberFormat(e, {
    minimumFractionDigits: r,
    maximumFractionDigits: r,
    useGrouping: !0
  }).format(t);
}
const Be = x.forwardRef(function({
  value: e,
  onValueChange: r,
  currency: n = "TRY",
  currencies: a,
  /* opsiyonel array → dropdown */
  onCurrencyChange: s,
  locale: l = "tr-TR",
  fractionDigits: c = 2,
  min: m,
  max: d,
  invalid: b,
  size: h,
  placeholder: k = "0,00",
  className: C,
  inputClassName: I,
  ...g
}, A) {
  const [R, w] = u.useState(() => D(e, l, c)), T = u.useRef(!1);
  x.useEffect(() => {
    T.current || w(D(e, l, c));
  }, [e, l, c]);
  const L = u.useCallback((f) => {
    const p = f.target.value;
    w(p);
    const v = O(p);
    r == null || r(v);
  }, [r]), U = u.useCallback((f) => {
    T.current = !0, e != null && (w(String(e).replace(".", l.startsWith("tr") ? "," : ".")), requestAnimationFrame(() => {
      var p, v;
      return (v = (p = f.target) == null ? void 0 : p.select) == null ? void 0 : v.call(p);
    }));
  }, [e, l]), G = u.useCallback((f) => {
    var v;
    T.current = !1;
    const p = O(R);
    r == null || r(p), w(D(p, l, c)), (v = g.onBlur) == null || v.call(g, f);
  }, [R, r, l, c, g]), $ = u.useMemo(() => e == null ? !1 : m != null && e < m || d != null && e > d, [e, m, d]), q = P[n] ?? n, W = a && a.length > 1 && s ? /* @__PURE__ */ o.jsx(
    "select",
    {
      value: n,
      onChange: (f) => s(f.target.value),
      "aria-label": pe("Common:Currency", "Para birimi"),
      className: i(
        "bg-transparent border-0 outline-none text-sm text-text-secondary",
        "pr-1 -mr-1 cursor-pointer",
        "focus-visible:outline-none"
      ),
      children: a.map((f) => /* @__PURE__ */ o.jsx("option", { value: f, children: P[f] ?? f }, f))
    }
  ) : /* @__PURE__ */ o.jsx("span", { className: "font-medium text-text-secondary", children: q });
  return /* @__PURE__ */ o.jsx(
    be,
    {
      ref: A,
      inputMode: "decimal",
      type: "text",
      value: R,
      placeholder: k,
      onChange: L,
      onFocus: U,
      onBlur: G,
      invalid: b || $,
      size: h,
      trailing: W,
      className: i("font-tabular text-right", C),
      ...g
    }
  );
}), ge = E(
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
), ve = {
  neutral: "bg-neutral-500",
  brand: "bg-brand-500",
  positive: "bg-positive-500",
  negative: "bg-negative-500",
  warning: "bg-warning-500",
  critical: "bg-critical-500",
  ai: "bg-ai-500"
};
function Ie({ variant: t = "neutral", size: e, withDot: r = !1, className: n, children: a, ...s }) {
  return /* @__PURE__ */ o.jsxs("span", { className: i(ge({ variant: t, size: e }), n), ...s, children: [
    r && /* @__PURE__ */ o.jsx(
      "span",
      {
        className: i("inline-block h-1.5 w-1.5 rounded-full", ve[t]),
        "aria-hidden": "true"
      }
    ),
    a
  ] });
}
function B({ open: t, onOpenChange: e, children: r }) {
  return /* @__PURE__ */ o.jsx(re, { open: t, onOpenChange: e, children: r });
}
const ye = x.forwardRef(function({ side: e, className: r, children: n, title: a, description: s, ...l }, c) {
  const m = e === "bottom" ? "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom" : e === "right" ? "inset-y-0 right-0 w-full max-w-md border-l animate-sheet-right" : i(
    "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom",
    "tablet:inset-x-auto tablet:inset-y-0 tablet:right-0 tablet:left-auto tablet:bottom-auto",
    "tablet:w-full tablet:max-w-md tablet:max-h-none tablet:rounded-none tablet:border-l tablet:border-t-0",
    "tablet:animate-sheet-right"
  );
  return /* @__PURE__ */ o.jsxs(X, { children: [
    /* @__PURE__ */ o.jsx(Z, { className: i(
      "fixed inset-0 z-modal-backdrop",
      "bg-surface-overlay backdrop-blur-sm",
      "animate-overlay-fade"
    ) }),
    /* @__PURE__ */ o.jsxs(
      V,
      {
        ref: c,
        "aria-describedby": void 0,
        className: i(
          "fixed z-modal",
          "bg-surface-base text-text-primary",
          "border-default shadow-xl",
          "flex flex-col",
          "focus-visible:outline-none",
          m,
          r
        ),
        ...l,
        children: [
          /* @__PURE__ */ o.jsx("div", { className: "tablet:hidden flex justify-center pt-2 pb-1", children: /* @__PURE__ */ o.jsx("div", { className: "h-1 w-10 rounded-full bg-neutral-300", "aria-hidden": "true" }) }),
          a && /* @__PURE__ */ o.jsx(ee, { className: "sr-only", children: a }),
          s && /* @__PURE__ */ o.jsx(te, { className: "sr-only", children: s }),
          n
        ]
      }
    )
  ] });
}), we = ne, je = ae;
B.Trigger = we;
B.Close = je;
B.Content = ye;
export {
  De as B,
  y as C,
  be as I,
  Be as M,
  Ee as S,
  Ce as T,
  le as a,
  ce as b,
  i as c,
  me as d,
  Ie as e,
  Me as f,
  Se as g,
  Fe as h,
  Te as i,
  B as j,
  oe as k,
  pe as t,
  Re as u
};
