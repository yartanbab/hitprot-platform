import { r as c, j as o, b as x } from "./react-vendor-D7YDiBbi.js";
import { t as ne, g as se, h as z, S as oe, i as ie, b as _, c as U, d as G, e as R, f as T, D as L, j as le, k as q } from "./ui-vendor-UYevF8mE.js";
import { t as de } from "./index-DgpuJ91w.js";
const W = "apya-theme", D = "system", J = c.createContext({
  preference: D,
  resolvedTheme: "light",
  setPreference: () => {
  },
  toggle: () => {
  }
});
function ce() {
  if (typeof window > "u") return D;
  try {
    const r = window.localStorage.getItem(W);
    if (r === "light" || r === "dark" || r === "system")
      return r;
  } catch {
  }
  return D;
}
function K() {
  return typeof window > "u" || !window.matchMedia ? !1 : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function B(r) {
  return r === "dark" ? "dark" : r === "light" ? "light" : K() ? "dark" : "light";
}
function I(r) {
  if (typeof document > "u") return;
  const e = document.documentElement;
  e.setAttribute("data-theme", r), r === "dark" ? e.classList.add("dark") : e.classList.remove("dark"), e.classList.remove("lpx-theme-light", "lpx-theme-dark", "lpx-theme-dim"), e.classList.add(r === "dark" ? "lpx-theme-dark" : "lpx-theme-light");
}
function Ie({ children: r, defaultPreference: e = D }) {
  const [t, a] = c.useState(() => ce() ?? e), [n, s] = c.useState(() => B(t)), d = c.useCallback((l) => {
    if (l !== "light" && l !== "dark" && l !== "system") return;
    a(l);
    try {
      window.localStorage.setItem(W, l);
    } catch {
    }
    const f = B(l);
    s(f), I(f);
  }, []);
  c.useEffect(() => {
    if (t !== "system" || typeof window > "u" || !window.matchMedia)
      return;
    const l = window.matchMedia("(prefers-color-scheme: dark)"), f = () => {
      const b = K() ? "dark" : "light";
      s(b), I(b);
    };
    return l.addEventListener("change", f), () => l.removeEventListener("change", f);
  }, [t]), c.useEffect(() => {
    I(B(t));
  }, []);
  const u = c.useCallback(() => {
    const l = ["light", "dark", "system"], f = l.indexOf(t), b = l[(f + 1) % l.length];
    d(b);
  }, [t, d]), m = c.useMemo(
    () => ({ preference: t, resolvedTheme: n, setPreference: d, toggle: u }),
    [t, n, d, u]
  );
  return /* @__PURE__ */ o.jsx(J.Provider, { value: m, children: r });
}
function Oe() {
  const r = c.useContext(J);
  if (!r)
    throw new Error("useTheme must be used inside a <ThemeProvider>.");
  return r;
}
function i(...r) {
  return ne(se(r));
}
function ze(r, e, t = "tr-TR") {
  return typeof r != "number" || !Number.isFinite(r) ? "—" : new Intl.NumberFormat(t, {
    style: "currency",
    currency: e,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(r);
}
function Pe(r, e, t = "tr-TR") {
  return typeof r != "number" || !Number.isFinite(r) ? "—" : new Intl.NumberFormat(t, {
    style: "currency",
    currency: e,
    notation: "compact",
    maximumFractionDigits: 1
  }).format(r);
}
const ue = z(
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
), $e = x.forwardRef(function({
  className: e,
  variant: t,
  size: a,
  asChild: n = !1,
  isLoading: s = !1,
  loadingText: d,
  leadingIcon: u,
  trailingIcon: m,
  disabled: l,
  children: f,
  type: b = "button",
  ...v
}, y) {
  const j = n ? oe : "button", g = l || s;
  return /* @__PURE__ */ o.jsxs(
    j,
    {
      ref: y,
      type: n ? void 0 : b,
      disabled: n ? void 0 : g,
      "aria-busy": s || void 0,
      "data-loading": s || void 0,
      className: i(ue({ variant: t, size: a }), e),
      ...v,
      children: [
        s ? /* @__PURE__ */ o.jsx(me, {}) : u,
        n ? /* @__PURE__ */ o.jsx(ie, { children: f }) : /* @__PURE__ */ o.jsx("span", { className: s ? "opacity-80" : void 0, children: s && d ? d : f }),
        !s && m
      ]
    }
  );
});
function me() {
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
const fe = {
  default: "bg-surface-raised border border-subtle shadow-sm",
  elevated: "bg-surface-elevated border border-subtle shadow-md",
  flat: "bg-surface-base border border-default shadow-none",
  interactive: i(
    "bg-surface-raised border border-subtle shadow-sm",
    "hover:shadow-md hover:border-default cursor-pointer",
    "transition-shadow duration-fast ease-standard"
  )
}, P = {
  compact: "p-3",
  comfortable: "p-4",
  spacious: "p-6"
}, N = x.forwardRef(function({ className: e, variant: t = "default", density: a, children: n, ...s }, d) {
  return /* @__PURE__ */ o.jsx(
    "div",
    {
      ref: d,
      "data-density": a,
      className: i(
        "rounded-xl overflow-hidden",
        "text-text-primary",
        fe[t],
        e
      ),
      ...s,
      children: n
    }
  );
}), be = x.forwardRef(function({ className: e, density: t = "comfortable", children: a, ...n }, s) {
  return /* @__PURE__ */ o.jsx(
    "div",
    {
      ref: s,
      className: i(
        "flex flex-col gap-1",
        "border-b border-subtle",
        P[t],
        e
      ),
      ...n,
      children: a
    }
  );
}), xe = x.forwardRef(function({ className: e, as: t = "h3", children: a, ...n }, s) {
  return /* @__PURE__ */ o.jsx(
    t,
    {
      ref: s,
      className: i(
        "text-lg font-semibold leading-tight text-text-primary",
        e
      ),
      ...n,
      children: a
    }
  );
}), pe = x.forwardRef(function({ className: e, children: t, ...a }, n) {
  return /* @__PURE__ */ o.jsx(
    "p",
    {
      ref: n,
      className: i("text-sm text-text-secondary", e),
      ...a,
      children: t
    }
  );
}), he = x.forwardRef(function({ className: e, density: t = "comfortable", children: a, ...n }, s) {
  return /* @__PURE__ */ o.jsx(
    "div",
    {
      ref: s,
      className: i(P[t], e),
      ...n,
      children: a
    }
  );
}), ve = x.forwardRef(function({ className: e, density: t = "comfortable", children: a, ...n }, s) {
  return /* @__PURE__ */ o.jsx(
    "div",
    {
      ref: s,
      className: i(
        "flex items-center justify-end gap-2",
        "border-t border-subtle bg-surface-sunken",
        P[t],
        e
      ),
      ...n,
      children: a
    }
  );
});
N.Header = be;
N.Title = xe;
N.Description = pe;
N.Body = he;
N.Footer = ve;
function Ye({ className: r, width: e, height: t, rounded: a = "md", ...n }) {
  const s = {};
  return e !== void 0 && (s.width = typeof e == "number" ? `${e}px` : e), t !== void 0 && (s.height = typeof t == "number" ? `${t}px` : t), /* @__PURE__ */ o.jsx(
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
        r
      ),
      style: s,
      ...n
    }
  );
}
const $ = z(
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
), ge = x.forwardRef(function({
  className: e,
  size: t,
  invalid: a,
  leading: n,
  trailing: s,
  type: d = "text",
  ...u
}, m) {
  const l = a ? "error" : "default";
  return !n && !s ? /* @__PURE__ */ o.jsx(
    "input",
    {
      ref: m,
      type: d,
      "aria-invalid": a || void 0,
      className: i($({ size: t, tone: l }), e),
      ...u
    }
  ) : /* @__PURE__ */ o.jsxs(
    "span",
    {
      className: i(
        $({ size: t, tone: l }),
        "inline-flex items-center gap-2 px-0",
        "focus-within:shadow-focus focus-within:border-focus",
        e
      ),
      children: [
        n && /* @__PURE__ */ o.jsx("span", { className: "flex-none pl-3 text-text-tertiary", children: n }),
        /* @__PURE__ */ o.jsx(
          "input",
          {
            ref: m,
            type: d,
            "aria-invalid": a || void 0,
            className: i(
              "flex-1 min-w-0 bg-transparent outline-none border-0 p-0",
              "text-text-primary placeholder:text-text-tertiary",
              !n && "pl-3",
              !s && "pr-3",
              "disabled:cursor-not-allowed disabled:text-text-disabled"
            ),
            ...u
          }
        ),
        s && /* @__PURE__ */ o.jsx("span", { className: "flex-none pr-3 text-text-tertiary", children: s })
      ]
    }
  );
}), Y = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CHF: "CHF"
};
function H(r) {
  if (r == null) return null;
  const e = String(r).trim();
  if (e === "" || e === "-") return null;
  const t = e.lastIndexOf(","), a = e.lastIndexOf(".");
  let n;
  t > a ? n = e.replace(/\./g, "").replace(",", ".") : a > t ? n = e.replace(/,/g, "") : n = e, n = n.replace(/[^\d.\-]/g, "");
  const s = Number(n);
  return Number.isFinite(s) ? s : null;
}
function O(r, e, t) {
  return r == null || !Number.isFinite(r) ? "" : new Intl.NumberFormat(e, {
    minimumFractionDigits: t,
    maximumFractionDigits: t,
    useGrouping: !0
  }).format(r);
}
const He = x.forwardRef(function({
  value: e,
  onValueChange: t,
  currency: a = "TRY",
  currencies: n,
  /* opsiyonel array → dropdown */
  onCurrencyChange: s,
  locale: d = "tr-TR",
  fractionDigits: u = 2,
  min: m,
  max: l,
  invalid: f,
  size: b,
  placeholder: v = "0,00",
  className: y,
  inputClassName: j,
  ...g
}, Z) {
  const [F, C] = c.useState(() => O(e, d, u)), M = c.useRef(!1);
  x.useEffect(() => {
    M.current || C(O(e, d, u));
  }, [e, d, u]);
  const A = c.useCallback((p) => {
    const h = p.target.value;
    C(h);
    const w = H(h);
    t == null || t(w);
  }, [t]), V = c.useCallback((p) => {
    M.current = !0, e != null && (C(String(e).replace(".", d.startsWith("tr") ? "," : ".")), requestAnimationFrame(() => {
      var h, w;
      return (w = (h = p.target) == null ? void 0 : h.select) == null ? void 0 : w.call(h);
    }));
  }, [e, d]), ee = c.useCallback((p) => {
    var w;
    M.current = !1;
    const h = H(F);
    t == null || t(h), C(O(h, d, u)), (w = g.onBlur) == null || w.call(g, p);
  }, [F, t, d, u, g]), te = c.useMemo(() => e == null ? !1 : m != null && e < m || l != null && e > l, [e, m, l]), re = Y[a] ?? a, ae = n && n.length > 1 && s ? /* @__PURE__ */ o.jsx(
    "select",
    {
      value: a,
      onChange: (p) => s(p.target.value),
      "aria-label": de("Common:Currency", "Para birimi"),
      className: i(
        "bg-transparent border-0 outline-none text-sm text-text-secondary",
        "pr-1 -mr-1 cursor-pointer",
        "focus-visible:outline-none"
      ),
      children: n.map((p) => /* @__PURE__ */ o.jsx("option", { value: p, children: Y[p] ?? p }, p))
    }
  ) : /* @__PURE__ */ o.jsx("span", { className: "font-medium text-text-secondary", children: re });
  return /* @__PURE__ */ o.jsx(
    ge,
    {
      ref: Z,
      inputMode: "decimal",
      type: "text",
      value: F,
      placeholder: v,
      onChange: A,
      onFocus: V,
      onBlur: ee,
      invalid: f || te,
      size: b,
      trailing: ae,
      className: i("font-tabular text-right", y),
      ...g
    }
  );
}), we = z(
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
function _e({ variant: r = "neutral", size: e, withDot: t = !1, className: a, children: n, ...s }) {
  return /* @__PURE__ */ o.jsxs("span", { className: i(we({ variant: r, size: e }), a), ...s, children: [
    t && /* @__PURE__ */ o.jsx(
      "span",
      {
        className: i("inline-block h-1.5 w-1.5 rounded-full", ye[r]),
        "aria-hidden": "true"
      }
    ),
    n
  ] });
}
const S = c.createContext(null);
function Q(r) {
  const e = c.useRef(null), t = c.useRef(!1);
  if (r && !t.current) {
    const a = document.activeElement;
    e.current = a && a !== document.body ? a : null;
  }
  return t.current = !!r, e;
}
function X(r, e) {
  if (r.defaultPrevented) return;
  const t = e == null ? void 0 : e.current;
  if (!t || !t.isConnected) return;
  const a = document.activeElement;
  a && a !== document.body || (r.preventDefault(), t.focus({ preventScroll: !0 }));
}
function k({ open: r, onOpenChange: e, children: t }) {
  const a = Q(r);
  return /* @__PURE__ */ o.jsx(L, { open: r, onOpenChange: e, children: /* @__PURE__ */ o.jsx(S.Provider, { value: a, children: t }) });
}
const je = x.forwardRef(function({ side: e, className: t, children: a, title: n, description: s, onCloseAutoFocus: d, ...u }, m) {
  const l = x.useContext(S), f = e === "bottom" ? "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom" : e === "right" ? "inset-y-0 right-0 w-full max-w-md border-l animate-sheet-right" : i(
    "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom",
    "tablet:inset-x-auto tablet:inset-y-0 tablet:right-0 tablet:left-auto tablet:bottom-auto",
    "tablet:w-full tablet:max-w-md tablet:max-h-none tablet:rounded-none tablet:border-l tablet:border-t-0",
    "tablet:animate-sheet-right"
  );
  return /* @__PURE__ */ o.jsxs(_, { children: [
    /* @__PURE__ */ o.jsx(U, { className: i(
      "fixed inset-0 z-modal-backdrop",
      "bg-surface-overlay backdrop-blur-sm",
      "animate-overlay-fade"
    ) }),
    /* @__PURE__ */ o.jsxs(
      G,
      {
        ref: m,
        className: i(
          "fixed z-modal",
          "bg-surface-base text-text-primary",
          "border-default shadow-xl",
          "flex flex-col",
          "focus-visible:outline-none",
          f,
          t
        ),
        ...u,
        onCloseAutoFocus: (b) => {
          d == null || d(b), X(b, l);
        },
        children: [
          e !== "right" && /* @__PURE__ */ o.jsx("div", { className: "tablet:hidden flex justify-center pt-2 pb-1", children: /* @__PURE__ */ o.jsx("div", { className: "h-1 w-10 rounded-full bg-neutral-300", "aria-hidden": "true" }) }),
          n && /* @__PURE__ */ o.jsx(R, { className: "sr-only", children: n }),
          s && /* @__PURE__ */ o.jsx(T, { className: "sr-only", children: s }),
          a
        ]
      }
    )
  ] });
}), Ne = le, ke = q, Ce = R, De = T;
k.Trigger = Ne;
k.Close = ke;
k.Content = je;
k.Title = Ce;
k.Description = De;
function E({ open: r, onOpenChange: e, children: t }) {
  const a = Q(r);
  return /* @__PURE__ */ o.jsx(L, { open: r, onOpenChange: e, children: /* @__PURE__ */ o.jsx(S.Provider, { value: a, children: t }) });
}
const Re = x.forwardRef(function({
  title: e,
  description: t,
  size: a = "default",
  fullscreen: n = !1,
  className: s,
  children: d,
  onOpenChange: u,
  onCloseAutoFocus: m,
  ...l
}, f) {
  const b = x.useContext(S), v = a === "compact" && !n, y = n ? i(
    "w-[calc(100vw-2*var(--apya-space-4))]",
    "h-[calc(100svh-2*var(--apya-space-4))]"
  ) : v ? i(
    "w-[calc(100vw-2*var(--apya-space-4))] max-w-md",
    "h-auto max-h-[calc(100svh-2*var(--apya-space-4))]",
    "overflow-y-auto overflow-x-hidden"
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
  return /* @__PURE__ */ o.jsxs(_, { children: [
    /* @__PURE__ */ o.jsx(
      U,
      {
        className: i(
          "fixed inset-0 z-modal-backdrop",
          "bg-surface-overlay backdrop-blur-sm",
          "animate-overlay-fade"
        )
      }
    ),
    /* @__PURE__ */ o.jsx("div", { className: "fixed inset-0 z-modal flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ o.jsxs(
      G,
      {
        ref: f,
        className: i(
          /* relative: AlertShell (silme/kaydetmeden-çık onayı) "absolute
             inset-0" ile bu paneli kaplıyor; positioning context olmazsa
             en yakın "fixed" ata olan yukarıdaki wrapper'a atlar ve tüm
             viewport'u kaplar. */
          "relative pointer-events-auto",
          "bg-surface-base text-text-primary",
          "border border-default rounded-[var(--apya-radius-xl)] shadow-xl",
          "flex flex-col",
          !v && "overflow-hidden",
          "focus-visible:outline-none",
          "animate-dialog-in",
          y,
          /* Mobil: tam ekran, köşesiz, safe-area. Modal içi footer'ın
             iOS home indicator'ın altında kalmaması için padding.
             compact'ta basılmaz: küçük pencere telefonda da kart kalır. */
          !v && "mobile:w-screen mobile:h-[100svh] mobile:max-w-none",
          !v && "mobile:rounded-none mobile:border-0",
          !v && "mobile:pb-[env(safe-area-inset-bottom)]",
          s
        ),
        ...l,
        onCloseAutoFocus: (j) => {
          m == null || m(j), X(j, b);
        },
        children: [
          e != null ? /* @__PURE__ */ o.jsx(R, { className: "sr-only", children: e }) : null,
          t ? /* @__PURE__ */ o.jsx(T, { className: "sr-only", children: t }) : null,
          d
        ]
      }
    ) })
  ] });
}), Te = q, Se = R, Ee = T;
E.Content = Re;
E.Close = Te;
E.Title = Se;
E.Description = Ee;
export {
  $e as B,
  E as D,
  ge as I,
  He as M,
  Ye as S,
  Ie as T,
  ze as a,
  k as b,
  i as c,
  je as d,
  _e as e,
  Pe as f,
  ue as g,
  Re as h,
  Oe as u
};
