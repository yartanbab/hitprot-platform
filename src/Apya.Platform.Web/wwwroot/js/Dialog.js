import { r as u, j as o, d as x } from "./react-vendor.js";
import { t as re, f as ae, g as E, S as ne, h as se, b as Y, c as _, d as $, e as H, i as A, D as L, j as oe, k as U } from "./ui-vendor.js";
const G = "apya-theme", N = "system", q = u.createContext({
  preference: N,
  resolvedTheme: "light",
  setPreference: () => {
  },
  toggle: () => {
  }
});
function ie() {
  if (typeof window > "u") return N;
  try {
    const r = window.localStorage.getItem(G);
    if (r === "light" || r === "dark" || r === "system")
      return r;
  } catch {
  }
  return N;
}
function W() {
  return typeof window > "u" || !window.matchMedia ? !1 : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function T(r) {
  return r === "dark" ? "dark" : r === "light" ? "light" : W() ? "dark" : "light";
}
function S(r) {
  if (typeof document > "u") return;
  const e = document.documentElement;
  e.setAttribute("data-theme", r), r === "dark" ? e.classList.add("dark") : e.classList.remove("dark"), e.classList.remove("lpx-theme-light", "lpx-theme-dark", "lpx-theme-dim"), e.classList.add(r === "dark" ? "lpx-theme-dark" : "lpx-theme-light");
}
function Se({ children: r, defaultPreference: e = N }) {
  const [t, n] = u.useState(() => ie() ?? e), [a, s] = u.useState(() => T(t)), d = u.useCallback((l) => {
    if (l !== "light" && l !== "dark" && l !== "system") return;
    n(l);
    try {
      window.localStorage.setItem(G, l);
    } catch {
    }
    const f = T(l);
    s(f), S(f);
  }, []);
  u.useEffect(() => {
    if (t !== "system" || typeof window > "u" || !window.matchMedia)
      return;
    const l = window.matchMedia("(prefers-color-scheme: dark)"), f = () => {
      const h = W() ? "dark" : "light";
      s(h), S(h);
    };
    return l.addEventListener("change", f), () => l.removeEventListener("change", f);
  }, [t]), u.useEffect(() => {
    S(T(t));
  }, []);
  const c = u.useCallback(() => {
    const l = ["light", "dark", "system"], f = l.indexOf(t), h = l[(f + 1) % l.length];
    d(h);
  }, [t, d]), m = u.useMemo(
    () => ({ preference: t, resolvedTheme: a, setPreference: d, toggle: c }),
    [t, a, d, c]
  );
  return /* @__PURE__ */ o.jsx(q.Provider, { value: m, children: r });
}
function Fe() {
  const r = u.useContext(q);
  if (!r)
    throw new Error("useTheme must be used inside a <ThemeProvider>.");
  return r;
}
function i(...r) {
  return re(ae(r));
}
function Ee(r, e, t = "tr-TR") {
  return typeof r != "number" || !Number.isFinite(r) ? "—" : new Intl.NumberFormat(t, {
    style: "currency",
    currency: e,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(r);
}
function Me(r, e, t = "tr-TR") {
  return typeof r != "number" || !Number.isFinite(r) ? "—" : new Intl.NumberFormat(t, {
    style: "currency",
    currency: e,
    notation: "compact",
    maximumFractionDigits: 1
  }).format(r);
}
const le = E(
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
), Be = x.forwardRef(function({
  className: e,
  variant: t,
  size: n,
  asChild: a = !1,
  isLoading: s = !1,
  loadingText: d,
  leadingIcon: c,
  trailingIcon: m,
  disabled: l,
  children: f,
  type: h = "button",
  ...C
}, k) {
  const z = a ? ne : "button", g = l || s;
  return /* @__PURE__ */ o.jsxs(
    z,
    {
      ref: k,
      type: a ? void 0 : h,
      disabled: a ? void 0 : g,
      "aria-busy": s || void 0,
      "data-loading": s || void 0,
      className: i(le({ variant: t, size: n }), e),
      ...C,
      children: [
        s ? /* @__PURE__ */ o.jsx(de, {}) : c,
        a ? /* @__PURE__ */ o.jsx(se, { children: f }) : /* @__PURE__ */ o.jsx("span", { className: s ? "opacity-80" : void 0, children: s && d ? d : f }),
        !s && m
      ]
    }
  );
});
function de() {
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
const ce = {
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
}, w = x.forwardRef(function({ className: e, variant: t = "default", density: n, children: a, ...s }, d) {
  return /* @__PURE__ */ o.jsx(
    "div",
    {
      ref: d,
      "data-density": n,
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
}), ue = x.forwardRef(function({ className: e, density: t = "comfortable", children: n, ...a }, s) {
  return /* @__PURE__ */ o.jsx(
    "div",
    {
      ref: s,
      className: i(
        "flex flex-col gap-1",
        "border-b border-subtle",
        M[t],
        e
      ),
      ...a,
      children: n
    }
  );
}), me = x.forwardRef(function({ className: e, as: t = "h3", children: n, ...a }, s) {
  return /* @__PURE__ */ o.jsx(
    t,
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
}), fe = x.forwardRef(function({ className: e, children: t, ...n }, a) {
  return /* @__PURE__ */ o.jsx(
    "p",
    {
      ref: a,
      className: i("text-sm text-text-secondary", e),
      ...n,
      children: t
    }
  );
}), be = x.forwardRef(function({ className: e, density: t = "comfortable", children: n, ...a }, s) {
  return /* @__PURE__ */ o.jsx(
    "div",
    {
      ref: s,
      className: i(M[t], e),
      ...a,
      children: n
    }
  );
}), xe = x.forwardRef(function({ className: e, density: t = "comfortable", children: n, ...a }, s) {
  return /* @__PURE__ */ o.jsx(
    "div",
    {
      ref: s,
      className: i(
        "flex items-center justify-end gap-2",
        "border-t border-subtle bg-surface-sunken",
        M[t],
        e
      ),
      ...a,
      children: n
    }
  );
});
w.Header = ue;
w.Title = me;
w.Description = fe;
w.Body = be;
w.Footer = xe;
function ze({ className: r, width: e, height: t, rounded: n = "md", ...a }) {
  const s = {};
  return e !== void 0 && (s.width = typeof e == "number" ? `${e}px` : e), t !== void 0 && (s.height = typeof t == "number" ? `${t}px` : t), /* @__PURE__ */ o.jsx(
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
        r
      ),
      style: s,
      ...a
    }
  );
}
const I = E(
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
      className: i(I({ size: t, tone: l }), e),
      ...c
    }
  ) : /* @__PURE__ */ o.jsxs(
    "span",
    {
      className: i(
        I({ size: t, tone: l }),
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
function he() {
  var e, t;
  if (j) return j;
  const r = (t = (e = window == null ? void 0 : window.abp) == null ? void 0 : e.localization) == null ? void 0 : t.getResource;
  return typeof r == "function" && (j = r("Platform")), j;
}
function ge(r, e, ...t) {
  const n = he(), a = n ? n(r, ...t) : null;
  return a != null && a !== r ? a : ve(e ?? r, t);
}
function ve(r, e) {
  return e.length ? String(r).replace(/\{(\d+)\}/g, (t, n) => e[n] ?? t) : r;
}
function Ie() {
  var r, e, t, n;
  return ((t = (e = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.localization) == null ? void 0 : e.currentCulture) == null ? void 0 : t.name) || ((n = document == null ? void 0 : document.documentElement) == null ? void 0 : n.lang) || "tr-TR";
}
const O = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CHF: "CHF"
};
function P(r) {
  if (r == null) return null;
  const e = String(r).trim();
  if (e === "" || e === "-") return null;
  const t = e.lastIndexOf(","), n = e.lastIndexOf(".");
  let a;
  t > n ? a = e.replace(/\./g, "").replace(",", ".") : n > t ? a = e.replace(/,/g, "") : a = e, a = a.replace(/[^\d.\-]/g, "");
  const s = Number(a);
  return Number.isFinite(s) ? s : null;
}
function F(r, e, t) {
  return r == null || !Number.isFinite(r) ? "" : new Intl.NumberFormat(e, {
    minimumFractionDigits: t,
    maximumFractionDigits: t,
    useGrouping: !0
  }).format(r);
}
const Oe = x.forwardRef(function({
  value: e,
  onValueChange: t,
  currency: n = "TRY",
  currencies: a,
  /* opsiyonel array → dropdown */
  onCurrencyChange: s,
  locale: d = "tr-TR",
  fractionDigits: c = 2,
  min: m,
  max: l,
  invalid: f,
  size: h,
  placeholder: C = "0,00",
  className: k,
  inputClassName: z,
  ...g
}, K) {
  const [R, y] = u.useState(() => F(e, d, c)), D = u.useRef(!1);
  x.useEffect(() => {
    D.current || y(F(e, d, c));
  }, [e, d, c]);
  const Q = u.useCallback((b) => {
    const p = b.target.value;
    y(p);
    const v = P(p);
    t == null || t(v);
  }, [t]), X = u.useCallback((b) => {
    D.current = !0, e != null && (y(String(e).replace(".", d.startsWith("tr") ? "," : ".")), requestAnimationFrame(() => {
      var p, v;
      return (v = (p = b.target) == null ? void 0 : p.select) == null ? void 0 : v.call(p);
    }));
  }, [e, d]), Z = u.useCallback((b) => {
    var v;
    D.current = !1;
    const p = P(R);
    t == null || t(p), y(F(p, d, c)), (v = g.onBlur) == null || v.call(g, b);
  }, [R, t, d, c, g]), V = u.useMemo(() => e == null ? !1 : m != null && e < m || l != null && e > l, [e, m, l]), ee = O[n] ?? n, te = a && a.length > 1 && s ? /* @__PURE__ */ o.jsx(
    "select",
    {
      value: n,
      onChange: (b) => s(b.target.value),
      "aria-label": ge("Common:Currency", "Para birimi"),
      className: i(
        "bg-transparent border-0 outline-none text-sm text-text-secondary",
        "pr-1 -mr-1 cursor-pointer",
        "focus-visible:outline-none"
      ),
      children: a.map((b) => /* @__PURE__ */ o.jsx("option", { value: b, children: O[b] ?? b }, b))
    }
  ) : /* @__PURE__ */ o.jsx("span", { className: "font-medium text-text-secondary", children: ee });
  return /* @__PURE__ */ o.jsx(
    pe,
    {
      ref: K,
      inputMode: "decimal",
      type: "text",
      value: R,
      placeholder: C,
      onChange: Q,
      onFocus: X,
      onBlur: Z,
      invalid: f || V,
      size: h,
      trailing: te,
      className: i("font-tabular text-right", k),
      ...g
    }
  );
}), we = E(
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
function Pe({ variant: r = "neutral", size: e, withDot: t = !1, className: n, children: a, ...s }) {
  return /* @__PURE__ */ o.jsxs("span", { className: i(we({ variant: r, size: e }), n), ...s, children: [
    t && /* @__PURE__ */ o.jsx(
      "span",
      {
        className: i("inline-block h-1.5 w-1.5 rounded-full", ye[r]),
        "aria-hidden": "true"
      }
    ),
    a
  ] });
}
function B({ open: r, onOpenChange: e, children: t }) {
  return /* @__PURE__ */ o.jsx(L, { open: r, onOpenChange: e, children: t });
}
const je = x.forwardRef(function({ side: e, className: t, children: n, title: a, description: s, ...d }, c) {
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
          t
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
}), Ne = oe, Ce = U;
B.Trigger = Ne;
B.Close = Ce;
B.Content = je;
function J({ open: r, onOpenChange: e, children: t }) {
  return /* @__PURE__ */ o.jsx(L, { open: r, onOpenChange: e, children: t });
}
const ke = x.forwardRef(function({ title: e, description: t, fullscreen: n = !1, className: a, children: s, onOpenChange: d, ...c }, m) {
  const l = n ? i(
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
          "mobile:w-screen mobile:h-[100svh] mobile:max-w-none",
          "mobile:rounded-none mobile:border-0",
          "mobile:pb-[env(safe-area-inset-bottom)]",
          a
        ),
        ...c,
        children: [
          /* @__PURE__ */ o.jsx(H, { className: "sr-only", children: e }),
          t ? /* @__PURE__ */ o.jsx(A, { className: "sr-only", children: t }) : null,
          s
        ]
      }
    ) })
  ] });
}), Re = U;
J.Content = ke;
J.Close = Re;
export {
  Be as B,
  J as D,
  pe as I,
  Oe as M,
  ze as S,
  Se as T,
  Ie as a,
  Ee as b,
  i as c,
  B as d,
  je as e,
  Me as f,
  Pe as g,
  le as h,
  ke as i,
  ge as t,
  Fe as u
};
