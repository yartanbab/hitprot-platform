import { r as c, j as s, b as x } from "./react-vendor-D7YDiBbi.js";
import { t as ne, g as se, h as z, S as oe, i as ie, b as _, c as U, d as G, e as R, f as T, D as L, j as de, k as q } from "./ui-vendor-UYevF8mE.js";
import { t as le } from "./index-DgpuJ91w.js";
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
  const [t, a] = c.useState(() => ce() ?? e), [n, o] = c.useState(() => B(t)), l = c.useCallback((d) => {
    if (d !== "light" && d !== "dark" && d !== "system") return;
    a(d);
    try {
      window.localStorage.setItem(W, d);
    } catch {
    }
    const f = B(d);
    o(f), I(f);
  }, []);
  c.useEffect(() => {
    if (t !== "system" || typeof window > "u" || !window.matchMedia)
      return;
    const d = window.matchMedia("(prefers-color-scheme: dark)"), f = () => {
      const b = K() ? "dark" : "light";
      o(b), I(b);
    };
    return d.addEventListener("change", f), () => d.removeEventListener("change", f);
  }, [t]), c.useEffect(() => {
    I(B(t));
  }, []);
  const u = c.useCallback(() => {
    const d = ["light", "dark", "system"], f = d.indexOf(t), b = d[(f + 1) % d.length];
    l(b);
  }, [t, l]), m = c.useMemo(
    () => ({ preference: t, resolvedTheme: n, setPreference: l, toggle: u }),
    [t, n, l, u]
  );
  return /* @__PURE__ */ s.jsx(J.Provider, { value: m, children: r });
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
), Ye = x.forwardRef(function({
  className: e,
  variant: t,
  size: a,
  asChild: n = !1,
  isLoading: o = !1,
  loadingText: l,
  leadingIcon: u,
  trailingIcon: m,
  disabled: d,
  children: f,
  type: b = "button",
  ...g
}, y) {
  const j = n ? oe : "button", v = d || o;
  return /* @__PURE__ */ s.jsxs(
    j,
    {
      ref: y,
      type: n ? void 0 : b,
      disabled: n ? void 0 : v,
      "aria-busy": o || void 0,
      "data-loading": o || void 0,
      className: i(ue({ variant: t, size: a }), e),
      ...g,
      children: [
        o ? /* @__PURE__ */ s.jsx(me, {}) : u,
        n ? /* @__PURE__ */ s.jsx(ie, { children: f }) : /* @__PURE__ */ s.jsx("span", { className: o ? "opacity-80" : void 0, children: o && l ? l : f }),
        !o && m
      ]
    }
  );
});
function me() {
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
}, N = x.forwardRef(function({ className: e, variant: t = "default", density: a, children: n, ...o }, l) {
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: l,
      "data-density": a,
      className: i(
        "rounded-xl overflow-hidden",
        "text-text-primary",
        fe[t],
        e
      ),
      ...o,
      children: n
    }
  );
}), be = x.forwardRef(function({ className: e, density: t = "comfortable", children: a, ...n }, o) {
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: o,
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
}), xe = x.forwardRef(function({ className: e, as: t = "h3", children: a, ...n }, o) {
  return /* @__PURE__ */ s.jsx(
    t,
    {
      ref: o,
      className: i(
        "text-lg font-semibold leading-tight text-text-primary",
        e
      ),
      ...n,
      children: a
    }
  );
}), he = x.forwardRef(function({ className: e, children: t, ...a }, n) {
  return /* @__PURE__ */ s.jsx(
    "p",
    {
      ref: n,
      className: i("text-sm text-text-secondary", e),
      ...a,
      children: t
    }
  );
}), pe = x.forwardRef(function({ className: e, density: t = "comfortable", children: a, ...n }, o) {
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: o,
      className: i(P[t], e),
      ...n,
      children: a
    }
  );
}), ge = x.forwardRef(function({ className: e, density: t = "comfortable", children: a, ...n }, o) {
  return /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: o,
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
N.Description = he;
N.Body = pe;
N.Footer = ge;
const Y = z(
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
), ve = x.forwardRef(function({
  className: e,
  size: t,
  invalid: a,
  leading: n,
  trailing: o,
  type: l = "text",
  ...u
}, m) {
  const d = a ? "error" : "default";
  return !n && !o ? /* @__PURE__ */ s.jsx(
    "input",
    {
      ref: m,
      type: l,
      "aria-invalid": a || void 0,
      className: i(Y({ size: t, tone: d }), e),
      ...u
    }
  ) : /* @__PURE__ */ s.jsxs(
    "span",
    {
      className: i(
        Y({ size: t, tone: d }),
        "inline-flex items-center gap-2 px-0",
        "focus-within:shadow-focus focus-within:border-focus",
        e
      ),
      children: [
        n && /* @__PURE__ */ s.jsx("span", { className: "flex-none pl-3 text-text-tertiary", children: n }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            ref: m,
            type: l,
            "aria-invalid": a || void 0,
            className: i(
              "flex-1 min-w-0 bg-transparent outline-none border-0 p-0",
              "text-text-primary placeholder:text-text-tertiary",
              !n && "pl-3",
              !o && "pr-3",
              "disabled:cursor-not-allowed disabled:text-text-disabled"
            ),
            ...u
          }
        ),
        o && /* @__PURE__ */ s.jsx("span", { className: "flex-none pr-3 text-text-tertiary", children: o })
      ]
    }
  );
}), $ = {
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
  const o = Number(n);
  return Number.isFinite(o) ? o : null;
}
function O(r, e, t) {
  return r == null || !Number.isFinite(r) ? "" : new Intl.NumberFormat(e, {
    minimumFractionDigits: t,
    maximumFractionDigits: t,
    useGrouping: !0
  }).format(r);
}
const $e = x.forwardRef(function({
  value: e,
  onValueChange: t,
  currency: a = "TRY",
  currencies: n,
  /* opsiyonel array → dropdown */
  onCurrencyChange: o,
  locale: l = "tr-TR",
  fractionDigits: u = 2,
  min: m,
  max: d,
  invalid: f,
  size: b,
  placeholder: g = "0,00",
  className: y,
  inputClassName: j,
  ...v
}, Z) {
  const [F, k] = c.useState(() => O(e, l, u)), M = c.useRef(!1);
  x.useEffect(() => {
    M.current || k(O(e, l, u));
  }, [e, l, u]);
  const A = c.useCallback((h) => {
    const p = h.target.value;
    k(p);
    const w = H(p);
    t == null || t(w);
  }, [t]), V = c.useCallback((h) => {
    M.current = !0, e != null && (k(String(e).replace(".", l.startsWith("tr") ? "," : ".")), requestAnimationFrame(() => {
      var p, w;
      return (w = (p = h.target) == null ? void 0 : p.select) == null ? void 0 : w.call(p);
    }));
  }, [e, l]), ee = c.useCallback((h) => {
    var w;
    M.current = !1;
    const p = H(F);
    t == null || t(p), k(O(p, l, u)), (w = v.onBlur) == null || w.call(v, h);
  }, [F, t, l, u, v]), te = c.useMemo(() => e == null ? !1 : m != null && e < m || d != null && e > d, [e, m, d]), re = $[a] ?? a, ae = n && n.length > 1 && o ? /* @__PURE__ */ s.jsx(
    "select",
    {
      value: a,
      onChange: (h) => o(h.target.value),
      "aria-label": le("Common:Currency", "Para birimi"),
      className: i(
        "bg-transparent border-0 outline-none text-sm text-text-secondary",
        "pr-1 -mr-1 cursor-pointer",
        "focus-visible:outline-none"
      ),
      children: n.map((h) => /* @__PURE__ */ s.jsx("option", { value: h, children: $[h] ?? h }, h))
    }
  ) : /* @__PURE__ */ s.jsx("span", { className: "font-medium text-text-secondary", children: re });
  return /* @__PURE__ */ s.jsx(
    ve,
    {
      ref: Z,
      inputMode: "decimal",
      type: "text",
      value: F,
      placeholder: g,
      onChange: A,
      onFocus: V,
      onBlur: ee,
      invalid: f || te,
      size: b,
      trailing: ae,
      className: i("font-tabular text-right", y),
      ...v
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
function He({ variant: r = "neutral", size: e, withDot: t = !1, className: a, children: n, ...o }) {
  return /* @__PURE__ */ s.jsxs("span", { className: i(we({ variant: r, size: e }), a), ...o, children: [
    t && /* @__PURE__ */ s.jsx(
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
function C({ open: r, onOpenChange: e, children: t }) {
  const a = Q(r);
  return /* @__PURE__ */ s.jsx(L, { open: r, onOpenChange: e, children: /* @__PURE__ */ s.jsx(S.Provider, { value: a, children: t }) });
}
const je = x.forwardRef(function({ side: e, className: t, children: a, title: n, description: o, onCloseAutoFocus: l, ...u }, m) {
  const d = x.useContext(S), f = e === "bottom" ? "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom" : e === "right" ? "inset-y-0 right-0 w-full max-w-md border-l animate-sheet-right" : i(
    "inset-x-0 bottom-0 max-h-[90vh] rounded-t-xl border-t animate-sheet-bottom",
    "tablet:inset-x-auto tablet:inset-y-0 tablet:right-0 tablet:left-auto tablet:bottom-auto",
    "tablet:w-full tablet:max-w-md tablet:max-h-none tablet:rounded-none tablet:border-l tablet:border-t-0",
    "tablet:animate-sheet-right"
  );
  return /* @__PURE__ */ s.jsxs(_, { children: [
    /* @__PURE__ */ s.jsx(U, { className: i(
      "fixed inset-0 z-modal-backdrop",
      "bg-surface-overlay backdrop-blur-sm",
      "animate-overlay-fade"
    ) }),
    /* @__PURE__ */ s.jsxs(
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
          l == null || l(b), X(b, d);
        },
        children: [
          e !== "right" && /* @__PURE__ */ s.jsx("div", { className: "tablet:hidden flex justify-center pt-2 pb-1", children: /* @__PURE__ */ s.jsx("div", { className: "h-1 w-10 rounded-full bg-neutral-300", "aria-hidden": "true" }) }),
          n && /* @__PURE__ */ s.jsx(R, { className: "sr-only", children: n }),
          o && /* @__PURE__ */ s.jsx(T, { className: "sr-only", children: o }),
          a
        ]
      }
    )
  ] });
}), Ne = de, Ce = q, ke = R, De = T;
C.Trigger = Ne;
C.Close = Ce;
C.Content = je;
C.Title = ke;
C.Description = De;
function E({ open: r, onOpenChange: e, children: t }) {
  const a = Q(r);
  return /* @__PURE__ */ s.jsx(L, { open: r, onOpenChange: e, children: /* @__PURE__ */ s.jsx(S.Provider, { value: a, children: t }) });
}
const Re = x.forwardRef(function({
  title: e,
  description: t,
  size: a = "default",
  fullscreen: n = !1,
  className: o,
  children: l,
  onOpenChange: u,
  onCloseAutoFocus: m,
  ...d
}, f) {
  const b = x.useContext(S), g = a === "compact" && !n, y = n ? i(
    "w-[calc(100vw-2*var(--apya-space-4))]",
    "h-[calc(100svh-2*var(--apya-space-4))]"
  ) : g ? i(
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
  return /* @__PURE__ */ s.jsxs(_, { children: [
    /* @__PURE__ */ s.jsx(
      U,
      {
        className: i(
          "fixed inset-0 z-modal-backdrop",
          "bg-surface-overlay backdrop-blur-sm",
          "animate-overlay-fade"
        )
      }
    ),
    /* @__PURE__ */ s.jsx("div", { className: "fixed inset-0 z-modal flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ s.jsxs(
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
          !g && "overflow-hidden",
          "focus-visible:outline-none",
          "animate-dialog-in",
          y,
          /* Mobil: tam ekran, köşesiz, safe-area. Modal içi footer'ın
             iOS home indicator'ın altında kalmaması için padding.
             compact'ta basılmaz: küçük pencere telefonda da kart kalır. */
          !g && "mobile:w-screen mobile:h-[100svh] mobile:max-w-none",
          !g && "mobile:rounded-none mobile:border-0",
          !g && "mobile:pb-[env(safe-area-inset-bottom)]",
          o
        ),
        ...d,
        onCloseAutoFocus: (j) => {
          m == null || m(j), X(j, b);
        },
        children: [
          e != null ? /* @__PURE__ */ s.jsx(R, { className: "sr-only", children: e }) : null,
          t ? /* @__PURE__ */ s.jsx(T, { className: "sr-only", children: t }) : null,
          l
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
  Ye as B,
  E as D,
  ve as I,
  $e as M,
  C as S,
  Ie as T,
  ze as a,
  je as b,
  i as c,
  He as d,
  ue as e,
  Pe as f,
  Re as g,
  Oe as u
};
