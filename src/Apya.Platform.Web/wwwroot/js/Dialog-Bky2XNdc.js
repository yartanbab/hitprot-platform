import { r as u, j as n, d as x } from "./react-vendor-D57GAUXd.js";
import { t as te, f as re, g as F, S as ae, h as se, b as P, c as Y, d as $, e as H, i as _, D as A, j as ne, k as U } from "./ui-vendor-DaE-uom6.js";
import { t as oe } from "./i18n-DkhYld-7.js";
const G = "apya-theme", j = "system", L = u.createContext({
  preference: j,
  resolvedTheme: "light",
  setPreference: () => {
  },
  toggle: () => {
  }
});
function ie() {
  if (typeof window > "u") return j;
  try {
    const r = window.localStorage.getItem(G);
    if (r === "light" || r === "dark" || r === "system")
      return r;
  } catch {
  }
  return j;
}
function q() {
  return typeof window > "u" || !window.matchMedia ? !1 : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function D(r) {
  return r === "dark" ? "dark" : r === "light" ? "light" : q() ? "dark" : "light";
}
function T(r) {
  if (typeof document > "u") return;
  const e = document.documentElement;
  e.setAttribute("data-theme", r), r === "dark" ? e.classList.add("dark") : e.classList.remove("dark"), e.classList.remove("lpx-theme-light", "lpx-theme-dark", "lpx-theme-dim"), e.classList.add(r === "dark" ? "lpx-theme-dark" : "lpx-theme-light");
}
function De({ children: r, defaultPreference: e = j }) {
  const [t, o] = u.useState(() => ie() ?? e), [a, s] = u.useState(() => D(t)), l = u.useCallback((d) => {
    if (d !== "light" && d !== "dark" && d !== "system") return;
    o(d);
    try {
      window.localStorage.setItem(G, d);
    } catch {
    }
    const f = D(d);
    s(f), T(f);
  }, []);
  u.useEffect(() => {
    if (t !== "system" || typeof window > "u" || !window.matchMedia)
      return;
    const d = window.matchMedia("(prefers-color-scheme: dark)"), f = () => {
      const h = q() ? "dark" : "light";
      s(h), T(h);
    };
    return d.addEventListener("change", f), () => d.removeEventListener("change", f);
  }, [t]), u.useEffect(() => {
    T(D(t));
  }, []);
  const c = u.useCallback(() => {
    const d = ["light", "dark", "system"], f = d.indexOf(t), h = d[(f + 1) % d.length];
    l(h);
  }, [t, l]), m = u.useMemo(
    () => ({ preference: t, resolvedTheme: a, setPreference: l, toggle: c }),
    [t, a, l, c]
  );
  return /* @__PURE__ */ n.jsx(L.Provider, { value: m, children: r });
}
function Te() {
  const r = u.useContext(L);
  if (!r)
    throw new Error("useTheme must be used inside a <ThemeProvider>.");
  return r;
}
function i(...r) {
  return te(re(r));
}
function Se(r, e, t = "tr-TR") {
  return typeof r != "number" || !Number.isFinite(r) ? "—" : new Intl.NumberFormat(t, {
    style: "currency",
    currency: e,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(r);
}
function Fe(r, e, t = "tr-TR") {
  return typeof r != "number" || !Number.isFinite(r) ? "—" : new Intl.NumberFormat(t, {
    style: "currency",
    currency: e,
    notation: "compact",
    maximumFractionDigits: 1
  }).format(r);
}
const de = F(
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
), Ee = x.forwardRef(function({
  className: e,
  variant: t,
  size: o,
  asChild: a = !1,
  isLoading: s = !1,
  loadingText: l,
  leadingIcon: c,
  trailingIcon: m,
  disabled: d,
  children: f,
  type: h = "button",
  ...N
}, k) {
  const B = a ? ae : "button", g = d || s;
  return /* @__PURE__ */ n.jsxs(
    B,
    {
      ref: k,
      type: a ? void 0 : h,
      disabled: a ? void 0 : g,
      "aria-busy": s || void 0,
      "data-loading": s || void 0,
      className: i(de({ variant: t, size: o }), e),
      ...N,
      children: [
        s ? /* @__PURE__ */ n.jsx(le, {}) : c,
        a ? /* @__PURE__ */ n.jsx(se, { children: f }) : /* @__PURE__ */ n.jsx("span", { className: s ? "opacity-80" : void 0, children: s && l ? l : f }),
        !s && m
      ]
    }
  );
});
function le() {
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
const ce = {
  default: "bg-surface-raised border border-subtle shadow-sm",
  elevated: "bg-surface-elevated border border-subtle shadow-md",
  flat: "bg-surface-base border border-default shadow-none",
  interactive: i(
    "bg-surface-raised border border-subtle shadow-sm",
    "hover:shadow-md hover:border-default cursor-pointer",
    "transition-shadow duration-fast ease-standard"
  )
}, E = {
  compact: "p-3",
  comfortable: "p-4",
  spacious: "p-6"
}, y = x.forwardRef(function({ className: e, variant: t = "default", density: o, children: a, ...s }, l) {
  return /* @__PURE__ */ n.jsx(
    "div",
    {
      ref: l,
      "data-density": o,
      className: i(
        "rounded-xl overflow-hidden",
        "text-text-primary",
        ce[t],
        e
      ),
      ...s,
      children: a
    }
  );
}), ue = x.forwardRef(function({ className: e, density: t = "comfortable", children: o, ...a }, s) {
  return /* @__PURE__ */ n.jsx(
    "div",
    {
      ref: s,
      className: i(
        "flex flex-col gap-1",
        "border-b border-subtle",
        E[t],
        e
      ),
      ...a,
      children: o
    }
  );
}), me = x.forwardRef(function({ className: e, as: t = "h3", children: o, ...a }, s) {
  return /* @__PURE__ */ n.jsx(
    t,
    {
      ref: s,
      className: i(
        "text-lg font-semibold leading-tight text-text-primary",
        e
      ),
      ...a,
      children: o
    }
  );
}), fe = x.forwardRef(function({ className: e, children: t, ...o }, a) {
  return /* @__PURE__ */ n.jsx(
    "p",
    {
      ref: a,
      className: i("text-sm text-text-secondary", e),
      ...o,
      children: t
    }
  );
}), be = x.forwardRef(function({ className: e, density: t = "comfortable", children: o, ...a }, s) {
  return /* @__PURE__ */ n.jsx(
    "div",
    {
      ref: s,
      className: i(E[t], e),
      ...a,
      children: o
    }
  );
}), xe = x.forwardRef(function({ className: e, density: t = "comfortable", children: o, ...a }, s) {
  return /* @__PURE__ */ n.jsx(
    "div",
    {
      ref: s,
      className: i(
        "flex items-center justify-end gap-2",
        "border-t border-subtle bg-surface-sunken",
        E[t],
        e
      ),
      ...a,
      children: o
    }
  );
});
y.Header = ue;
y.Title = me;
y.Description = fe;
y.Body = be;
y.Footer = xe;
function Me({ className: r, width: e, height: t, rounded: o = "md", ...a }) {
  const s = {};
  return e !== void 0 && (s.width = typeof e == "number" ? `${e}px` : e), t !== void 0 && (s.height = typeof t == "number" ? `${t}px` : t), /* @__PURE__ */ n.jsx(
    "div",
    {
      "aria-busy": "true",
      "aria-live": "polite",
      className: i(
        "skeleton",
        o === "full" && "rounded-full",
        o === "sm" && "rounded-sm",
        o === "md" && "rounded-md",
        o === "lg" && "rounded-lg",
        r
      ),
      style: s,
      ...a
    }
  );
}
const I = F(
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
), pe = x.forwardRef(function({
  className: e,
  size: t,
  invalid: o,
  leading: a,
  trailing: s,
  type: l = "text",
  ...c
}, m) {
  const d = o ? "error" : "default";
  return !a && !s ? /* @__PURE__ */ n.jsx(
    "input",
    {
      ref: m,
      type: l,
      "aria-invalid": o || void 0,
      className: i(I({ size: t, tone: d }), e),
      ...c
    }
  ) : /* @__PURE__ */ n.jsxs(
    "span",
    {
      className: i(
        I({ size: t, tone: d }),
        "inline-flex items-center gap-2 px-0",
        "focus-within:shadow-focus focus-within:border-focus",
        e
      ),
      children: [
        a && /* @__PURE__ */ n.jsx("span", { className: "flex-none pl-3 text-text-tertiary", children: a }),
        /* @__PURE__ */ n.jsx(
          "input",
          {
            ref: m,
            type: l,
            "aria-invalid": o || void 0,
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
        s && /* @__PURE__ */ n.jsx("span", { className: "flex-none pr-3 text-text-tertiary", children: s })
      ]
    }
  );
}), z = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CHF: "CHF"
};
function O(r) {
  if (r == null) return null;
  const e = String(r).trim();
  if (e === "" || e === "-") return null;
  const t = e.lastIndexOf(","), o = e.lastIndexOf(".");
  let a;
  t > o ? a = e.replace(/\./g, "").replace(",", ".") : o > t ? a = e.replace(/,/g, "") : a = e, a = a.replace(/[^\d.\-]/g, "");
  const s = Number(a);
  return Number.isFinite(s) ? s : null;
}
function S(r, e, t) {
  return r == null || !Number.isFinite(r) ? "" : new Intl.NumberFormat(e, {
    minimumFractionDigits: t,
    maximumFractionDigits: t,
    useGrouping: !0
  }).format(r);
}
const Be = x.forwardRef(function({
  value: e,
  onValueChange: t,
  currency: o = "TRY",
  currencies: a,
  /* opsiyonel array → dropdown */
  onCurrencyChange: s,
  locale: l = "tr-TR",
  fractionDigits: c = 2,
  min: m,
  max: d,
  invalid: f,
  size: h,
  placeholder: N = "0,00",
  className: k,
  inputClassName: B,
  ...g
}, J) {
  const [C, w] = u.useState(() => S(e, l, c)), R = u.useRef(!1);
  x.useEffect(() => {
    R.current || w(S(e, l, c));
  }, [e, l, c]);
  const K = u.useCallback((b) => {
    const p = b.target.value;
    w(p);
    const v = O(p);
    t == null || t(v);
  }, [t]), Q = u.useCallback((b) => {
    R.current = !0, e != null && (w(String(e).replace(".", l.startsWith("tr") ? "," : ".")), requestAnimationFrame(() => {
      var p, v;
      return (v = (p = b.target) == null ? void 0 : p.select) == null ? void 0 : v.call(p);
    }));
  }, [e, l]), X = u.useCallback((b) => {
    var v;
    R.current = !1;
    const p = O(C);
    t == null || t(p), w(S(p, l, c)), (v = g.onBlur) == null || v.call(g, b);
  }, [C, t, l, c, g]), Z = u.useMemo(() => e == null ? !1 : m != null && e < m || d != null && e > d, [e, m, d]), V = z[o] ?? o, ee = a && a.length > 1 && s ? /* @__PURE__ */ n.jsx(
    "select",
    {
      value: o,
      onChange: (b) => s(b.target.value),
      "aria-label": oe("Common:Currency", "Para birimi"),
      className: i(
        "bg-transparent border-0 outline-none text-sm text-text-secondary",
        "pr-1 -mr-1 cursor-pointer",
        "focus-visible:outline-none"
      ),
      children: a.map((b) => /* @__PURE__ */ n.jsx("option", { value: b, children: z[b] ?? b }, b))
    }
  ) : /* @__PURE__ */ n.jsx("span", { className: "font-medium text-text-secondary", children: V });
  return /* @__PURE__ */ n.jsx(
    pe,
    {
      ref: J,
      inputMode: "decimal",
      type: "text",
      value: C,
      placeholder: N,
      onChange: K,
      onFocus: Q,
      onBlur: X,
      invalid: f || Z,
      size: h,
      trailing: ee,
      className: i("font-tabular text-right", k),
      ...g
    }
  );
}), he = F(
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
), ge = {
  neutral: "bg-neutral-500",
  brand: "bg-brand-500",
  positive: "bg-positive-500",
  negative: "bg-negative-500",
  warning: "bg-warning-500",
  critical: "bg-critical-500",
  ai: "bg-ai-500"
};
function Ie({ variant: r = "neutral", size: e, withDot: t = !1, className: o, children: a, ...s }) {
  return /* @__PURE__ */ n.jsxs("span", { className: i(he({ variant: r, size: e }), o), ...s, children: [
    t && /* @__PURE__ */ n.jsx(
      "span",
      {
        className: i("inline-block h-1.5 w-1.5 rounded-full", ge[r]),
        "aria-hidden": "true"
      }
    ),
    a
  ] });
}
function M({ open: r, onOpenChange: e, children: t }) {
  return /* @__PURE__ */ n.jsx(A, { open: r, onOpenChange: e, children: t });
}
const ve = x.forwardRef(function({ side: e, className: t, children: o, title: a, description: s, ...l }, c) {
  const m = e === "bottom" ? "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom" : e === "right" ? "inset-y-0 right-0 w-full max-w-md border-l animate-sheet-right" : i(
    "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom",
    "tablet:inset-x-auto tablet:inset-y-0 tablet:right-0 tablet:left-auto tablet:bottom-auto",
    "tablet:w-full tablet:max-w-md tablet:max-h-none tablet:rounded-none tablet:border-l tablet:border-t-0",
    "tablet:animate-sheet-right"
  );
  return /* @__PURE__ */ n.jsxs(P, { children: [
    /* @__PURE__ */ n.jsx(Y, { className: i(
      "fixed inset-0 z-modal-backdrop",
      "bg-surface-overlay backdrop-blur-sm",
      "animate-overlay-fade"
    ) }),
    /* @__PURE__ */ n.jsxs(
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
          t
        ),
        ...l,
        children: [
          /* @__PURE__ */ n.jsx("div", { className: "tablet:hidden flex justify-center pt-2 pb-1", children: /* @__PURE__ */ n.jsx("div", { className: "h-1 w-10 rounded-full bg-neutral-300", "aria-hidden": "true" }) }),
          a && /* @__PURE__ */ n.jsx(H, { className: "sr-only", children: a }),
          s && /* @__PURE__ */ n.jsx(_, { className: "sr-only", children: s }),
          o
        ]
      }
    )
  ] });
}), ye = ne, we = U;
M.Trigger = ye;
M.Close = we;
M.Content = ve;
function W({ open: r, onOpenChange: e, children: t }) {
  return /* @__PURE__ */ n.jsx(A, { open: r, onOpenChange: e, children: t });
}
const je = x.forwardRef(function({ title: e, description: t, fullscreen: o = !1, className: a, children: s, onOpenChange: l, ...c }, m) {
  const d = o ? i(
    "w-[calc(100vw-2*var(--apya-space-4))]",
    "h-[calc(100svh-2*var(--apya-space-4))]"
  ) : i(
    "w-[min(92vw,1400px)]",
    "h-[min(88svh,940px)]",
    /* min-h VİEWPORT'A KISKAÇLANIR. Çıplak `min-h-[520px]` yatay telefonda
       (932×430 → genişlik 768'i aştığı için `tablet:` devrede) paneli 520px'e
       zorluyor, panel ortalandığı ve overflow-hidden olduğu için üstten VE
       alttan kırpılıyordu. Takvim sihirbazı bunu yerel olarak yamamıştı
       (SetupWizard.jsx `tablet:min-h-0`); kaynağı burası. */
    "tablet:min-h-[min(520px,88svh)]"
  );
  return /* @__PURE__ */ n.jsxs(P, { children: [
    /* @__PURE__ */ n.jsx(
      Y,
      {
        className: i(
          "fixed inset-0 z-modal-backdrop",
          "bg-surface-overlay backdrop-blur-sm",
          "animate-overlay-fade"
        )
      }
    ),
    /* @__PURE__ */ n.jsx("div", { className: "fixed inset-0 z-modal flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ n.jsxs(
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
          d,
          /* Mobil: tam ekran, köşesiz, safe-area. Modal içi footer'ın
             iOS home indicator'ın altında kalmaması için padding. */
          "mobile:w-screen mobile:h-[100svh] mobile:max-w-none",
          "mobile:rounded-none mobile:border-0",
          "mobile:pb-[env(safe-area-inset-bottom)]",
          a
        ),
        ...c,
        children: [
          /* @__PURE__ */ n.jsx(H, { className: "sr-only", children: e }),
          t ? /* @__PURE__ */ n.jsx(_, { className: "sr-only", children: t }) : null,
          s
        ]
      }
    ) })
  ] });
}), Ne = U;
W.Content = je;
W.Close = Ne;
export {
  Ee as B,
  W as D,
  pe as I,
  Be as M,
  Me as S,
  De as T,
  Se as a,
  M as b,
  i as c,
  ve as d,
  Ie as e,
  Fe as f,
  de as g,
  je as h,
  Te as u
};
