import { r as u, j as o, d as b } from "./react-vendor.js";
import { t as re, c as ne, b as E, S as ae, D as Y, d as _, e as $, f as H, g as A, h as L, i as se, j as U } from "./ui-vendor.js";
const G = "apya-theme", N = "system", q = u.createContext({
  preference: N,
  resolvedTheme: "light",
  setPreference: () => {
  },
  toggle: () => {
  }
});
function oe() {
  if (typeof window > "u") return N;
  try {
    const t = window.localStorage.getItem(G);
    if (t === "light" || t === "dark" || t === "system")
      return t;
  } catch {
  }
  return N;
}
function W() {
  return typeof window > "u" || !window.matchMedia ? !1 : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function T(t) {
  return t === "dark" ? "dark" : t === "light" ? "light" : W() ? "dark" : "light";
}
function F(t) {
  if (typeof document > "u") return;
  const e = document.documentElement;
  e.setAttribute("data-theme", t), t === "dark" ? e.classList.add("dark") : e.classList.remove("dark"), e.classList.remove("lpx-theme-light", "lpx-theme-dark", "lpx-theme-dim"), e.classList.add(t === "dark" ? "lpx-theme-dark" : "lpx-theme-light");
}
function Te({ children: t, defaultPreference: e = N }) {
  const [r, n] = u.useState(() => oe() ?? e), [a, s] = u.useState(() => T(r)), d = u.useCallback((l) => {
    if (l !== "light" && l !== "dark" && l !== "system") return;
    n(l);
    try {
      window.localStorage.setItem(G, l);
    } catch {
    }
    const x = T(l);
    s(x), F(x);
  }, []);
  u.useEffect(() => {
    if (r !== "system" || typeof window > "u" || !window.matchMedia)
      return;
    const l = window.matchMedia("(prefers-color-scheme: dark)"), x = () => {
      const h = W() ? "dark" : "light";
      s(h), F(h);
    };
    return l.addEventListener("change", x), () => l.removeEventListener("change", x);
  }, [r]), u.useEffect(() => {
    F(T(r));
  }, []);
  const c = u.useCallback(() => {
    const l = ["light", "dark", "system"], x = l.indexOf(r), h = l[(x + 1) % l.length];
    d(h);
  }, [r, d]), m = u.useMemo(
    () => ({ preference: r, resolvedTheme: a, setPreference: d, toggle: c }),
    [r, a, d, c]
  );
  return /* @__PURE__ */ o.jsx(q.Provider, { value: m, children: t });
}
function Fe() {
  const t = u.useContext(q);
  if (!t)
    throw new Error("useTheme must be used inside a <ThemeProvider>.");
  return t;
}
function i(...t) {
  return re(ne(t));
}
function Se(t, e, r = "tr-TR") {
  return typeof t != "number" || !Number.isFinite(t) ? "—" : new Intl.NumberFormat(r, {
    style: "currency",
    currency: e,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(t);
}
function Ee(t, e, r = "tr-TR") {
  return typeof t != "number" || !Number.isFinite(t) ? "—" : new Intl.NumberFormat(r, {
    style: "currency",
    currency: e,
    notation: "compact",
    maximumFractionDigits: 1
  }).format(t);
}
function Me(t, e = "tr-TR") {
  if (typeof t != "number" || !Number.isFinite(t))
    return { sign: "", symbol: "•", text: "—" };
  const r = Math.abs(t), n = new Intl.NumberFormat(e, {
    style: "percent",
    maximumFractionDigits: 1
  }).format(r / 100);
  return t > 0 ? { sign: "+", symbol: "▲", text: n } : t < 0 ? { sign: "−", symbol: "▼", text: n } : { sign: "", symbol: "•", text: n };
}
const ie = E(
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
), Be = b.forwardRef(function({
  className: e,
  variant: r,
  size: n,
  asChild: a = !1,
  isLoading: s = !1,
  loadingText: d,
  leadingIcon: c,
  trailingIcon: m,
  disabled: l,
  children: x,
  type: h = "button",
  ...C
}, k) {
  const I = a ? ae : "button", g = l || s;
  return /* @__PURE__ */ o.jsxs(
    I,
    {
      ref: k,
      type: a ? void 0 : h,
      disabled: a ? void 0 : g,
      "aria-busy": s || void 0,
      "data-loading": s || void 0,
      className: i(ie({ variant: r, size: n }), e),
      ...C,
      children: [
        s ? /* @__PURE__ */ o.jsx(le, {}) : c,
        /* @__PURE__ */ o.jsx("span", { className: s ? "opacity-80" : void 0, children: s && d ? d : x }),
        !s && m
      ]
    }
  );
});
function le() {
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
}, y = b.forwardRef(function({ className: e, variant: r = "default", density: n, children: a, ...s }, d) {
  return /* @__PURE__ */ o.jsx(
    "div",
    {
      ref: d,
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
}), ce = b.forwardRef(function({ className: e, density: r = "comfortable", children: n, ...a }, s) {
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
}), ue = b.forwardRef(function({ className: e, as: r = "h3", children: n, ...a }, s) {
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
}), me = b.forwardRef(function({ className: e, children: r, ...n }, a) {
  return /* @__PURE__ */ o.jsx(
    "p",
    {
      ref: a,
      className: i("text-sm text-text-secondary", e),
      ...n,
      children: r
    }
  );
}), fe = b.forwardRef(function({ className: e, density: r = "comfortable", children: n, ...a }, s) {
  return /* @__PURE__ */ o.jsx(
    "div",
    {
      ref: s,
      className: i(M[r], e),
      ...a,
      children: n
    }
  );
}), be = b.forwardRef(function({ className: e, density: r = "comfortable", children: n, ...a }, s) {
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
y.Header = ce;
y.Title = ue;
y.Description = me;
y.Body = fe;
y.Footer = be;
function Ie({ className: t, width: e, height: r, rounded: n = "md", ...a }) {
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
), xe = b.forwardRef(function({
  className: e,
  size: r,
  invalid: n,
  leading: a,
  trailing: s,
  type: d = "text",
  ...c
}, m) {
  const l = n ? "error" : "default";
  return !a && !s ? /* @__PURE__ */ o.jsx(
    "input",
    {
      ref: m,
      type: d,
      "aria-invalid": n || void 0,
      className: i(z({ size: r, tone: l }), e),
      ...c
    }
  ) : /* @__PURE__ */ o.jsxs(
    "span",
    {
      className: i(
        z({ size: r, tone: l }),
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
            type: d,
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
function pe() {
  var e, r;
  if (j) return j;
  const t = (r = (e = window == null ? void 0 : window.abp) == null ? void 0 : e.localization) == null ? void 0 : r.getResource;
  return typeof t == "function" && (j = t("Platform")), j;
}
function he(t, e, ...r) {
  const n = pe(), a = n ? n(t, ...r) : null;
  return a != null && a !== t ? a : ge(e ?? t, r);
}
function ge(t, e) {
  return e.length ? String(t).replace(/\{(\d+)\}/g, (r, n) => e[n] ?? r) : t;
}
function ze() {
  var t, e, r, n;
  return ((r = (e = (t = window == null ? void 0 : window.abp) == null ? void 0 : t.localization) == null ? void 0 : e.currentCulture) == null ? void 0 : r.name) || ((n = document == null ? void 0 : document.documentElement) == null ? void 0 : n.lang) || "tr-TR";
}
const O = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CHF: "CHF"
};
function P(t) {
  if (t == null) return null;
  const e = String(t).trim();
  if (e === "" || e === "-") return null;
  const r = e.lastIndexOf(","), n = e.lastIndexOf(".");
  let a;
  r > n ? a = e.replace(/\./g, "").replace(",", ".") : n > r ? a = e.replace(/,/g, "") : a = e, a = a.replace(/[^\d.\-]/g, "");
  const s = Number(a);
  return Number.isFinite(s) ? s : null;
}
function S(t, e, r) {
  return t == null || !Number.isFinite(t) ? "" : new Intl.NumberFormat(e, {
    minimumFractionDigits: r,
    maximumFractionDigits: r,
    useGrouping: !0
  }).format(t);
}
const Oe = b.forwardRef(function({
  value: e,
  onValueChange: r,
  currency: n = "TRY",
  currencies: a,
  /* opsiyonel array → dropdown */
  onCurrencyChange: s,
  locale: d = "tr-TR",
  fractionDigits: c = 2,
  min: m,
  max: l,
  invalid: x,
  size: h,
  placeholder: C = "0,00",
  className: k,
  inputClassName: I,
  ...g
}, K) {
  const [R, w] = u.useState(() => S(e, d, c)), D = u.useRef(!1);
  b.useEffect(() => {
    D.current || w(S(e, d, c));
  }, [e, d, c]);
  const Q = u.useCallback((f) => {
    const p = f.target.value;
    w(p);
    const v = P(p);
    r == null || r(v);
  }, [r]), X = u.useCallback((f) => {
    D.current = !0, e != null && (w(String(e).replace(".", d.startsWith("tr") ? "," : ".")), requestAnimationFrame(() => {
      var p, v;
      return (v = (p = f.target) == null ? void 0 : p.select) == null ? void 0 : v.call(p);
    }));
  }, [e, d]), Z = u.useCallback((f) => {
    var v;
    D.current = !1;
    const p = P(R);
    r == null || r(p), w(S(p, d, c)), (v = g.onBlur) == null || v.call(g, f);
  }, [R, r, d, c, g]), V = u.useMemo(() => e == null ? !1 : m != null && e < m || l != null && e > l, [e, m, l]), ee = O[n] ?? n, te = a && a.length > 1 && s ? /* @__PURE__ */ o.jsx(
    "select",
    {
      value: n,
      onChange: (f) => s(f.target.value),
      "aria-label": he("Common:Currency", "Para birimi"),
      className: i(
        "bg-transparent border-0 outline-none text-sm text-text-secondary",
        "pr-1 -mr-1 cursor-pointer",
        "focus-visible:outline-none"
      ),
      children: a.map((f) => /* @__PURE__ */ o.jsx("option", { value: f, children: O[f] ?? f }, f))
    }
  ) : /* @__PURE__ */ o.jsx("span", { className: "font-medium text-text-secondary", children: ee });
  return /* @__PURE__ */ o.jsx(
    xe,
    {
      ref: K,
      inputMode: "decimal",
      type: "text",
      value: R,
      placeholder: C,
      onChange: Q,
      onFocus: X,
      onBlur: Z,
      invalid: x || V,
      size: h,
      trailing: te,
      className: i("font-tabular text-right", k),
      ...g
    }
  );
}), ve = E(
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
), ye = {
  neutral: "bg-neutral-500",
  brand: "bg-brand-500",
  positive: "bg-positive-500",
  negative: "bg-negative-500",
  warning: "bg-warning-500",
  critical: "bg-critical-500",
  ai: "bg-ai-500"
};
function Pe({ variant: t = "neutral", size: e, withDot: r = !1, className: n, children: a, ...s }) {
  return /* @__PURE__ */ o.jsxs("span", { className: i(ve({ variant: t, size: e }), n), ...s, children: [
    r && /* @__PURE__ */ o.jsx(
      "span",
      {
        className: i("inline-block h-1.5 w-1.5 rounded-full", ye[t]),
        "aria-hidden": "true"
      }
    ),
    a
  ] });
}
function B({ open: t, onOpenChange: e, children: r }) {
  return /* @__PURE__ */ o.jsx(L, { open: t, onOpenChange: e, children: r });
}
const we = b.forwardRef(function({ side: e, className: r, children: n, title: a, description: s, ...d }, c) {
  const m = e === "bottom" ? "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom" : e === "right" ? "inset-y-0 right-0 w-full max-w-md border-l animate-sheet-right" : i(
    "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom",
    "tablet:inset-x-auto tablet:inset-y-0 tablet:right-0 tablet:left-auto tablet:bottom-auto",
    "tablet:w-full tablet:max-w-md tablet:max-h-none tablet:rounded-none tablet:border-l tablet:border-t-0",
    "tablet:animate-sheet-right"
  );
  return /* @__PURE__ */ o.jsxs(Y, { children: [
    /* @__PURE__ */ o.jsx(_, { className: i(
      "fixed inset-0 z-modal-backdrop",
      "bg-surface-overlay backdrop-blur-sm",
      "animate-overlay-fade"
    ) }),
    /* @__PURE__ */ o.jsxs(
      $,
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
        ...d,
        children: [
          /* @__PURE__ */ o.jsx("div", { className: "tablet:hidden flex justify-center pt-2 pb-1", children: /* @__PURE__ */ o.jsx("div", { className: "h-1 w-10 rounded-full bg-neutral-300", "aria-hidden": "true" }) }),
          a && /* @__PURE__ */ o.jsx(H, { className: "sr-only", children: a }),
          s && /* @__PURE__ */ o.jsx(A, { className: "sr-only", children: s }),
          n
        ]
      }
    )
  ] });
}), je = se, Ne = U;
B.Trigger = je;
B.Close = Ne;
B.Content = we;
function J({ open: t, onOpenChange: e, children: r }) {
  return /* @__PURE__ */ o.jsx(L, { open: t, onOpenChange: e, children: r });
}
const Ce = b.forwardRef(function({ title: e, description: r, fullscreen: n = !1, className: a, children: s, onOpenChange: d, ...c }, m) {
  const l = n ? i(
    "w-[calc(100vw-2*var(--apya-space-4))]",
    "h-[calc(100dvh-2*var(--apya-space-4))]"
  ) : i(
    "w-[min(92vw,1400px)]",
    "h-[min(88dvh,940px)]",
    "tablet:min-h-[520px]"
  );
  return /* @__PURE__ */ o.jsxs(Y, { children: [
    /* @__PURE__ */ o.jsx(
      _,
      {
        className: i(
          "fixed inset-0 z-modal-backdrop",
          "bg-surface-overlay backdrop-blur-sm",
          "animate-overlay-fade"
        )
      }
    ),
    /* @__PURE__ */ o.jsx("div", { className: "fixed inset-0 z-modal flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ o.jsxs(
      $,
      {
        ref: m,
        className: i(
          /* relative: AlertShell (silme/kaydetmeden-çık onayı) "absolute
             inset-0" ile bu paneli kaplıyor; positioning context olmazsa
             en yakın "fixed" ata olan yukarıdaki wrapper'a atlar ve tüm
             viewport'u kaplar. */
          "relative pointer-events-auto",
          "bg-surface-base text-text-primary",
          "border border-default rounded-[var(--apya-radius-xl)] shadow-xl",
          "flex flex-col overflow-hidden",
          "focus-visible:outline-none",
          "animate-dialog-in",
          l,
          /* Mobil: tam ekran, köşesiz, safe-area. Modal içi footer'ın
             iOS home indicator'ın altında kalmaması için padding. */
          "mobile:w-screen mobile:h-[100dvh] mobile:max-w-none",
          "mobile:rounded-none mobile:border-0",
          "mobile:pb-[env(safe-area-inset-bottom)]",
          a
        ),
        ...c,
        children: [
          /* @__PURE__ */ o.jsx(H, { className: "sr-only", children: e }),
          r ? /* @__PURE__ */ o.jsx(A, { className: "sr-only", children: r }) : null,
          s
        ]
      }
    ) })
  ] });
}), ke = U;
J.Content = Ce;
J.Close = ke;
export {
  Be as B,
  y as C,
  J as D,
  xe as I,
  Oe as M,
  Ie as S,
  Te as T,
  ce as a,
  ue as b,
  i as c,
  fe as d,
  Pe as e,
  ze as f,
  Me as g,
  Ee as h,
  Se as i,
  B as j,
  ie as k,
  Ce as l,
  he as t,
  Fe as u
};
