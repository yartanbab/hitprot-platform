import { r as f, j as t, d as h, b as J } from "./react-vendor.js";
import { r as L } from "./grid-vendor.js";
import { t as Z, c as Q, a as I, S as X } from "./ui-vendor.js";
/* empty css      */
const H = "apya-theme", S = "system", O = f.createContext({
  preference: S,
  resolvedTheme: "light",
  setPreference: () => {
  },
  toggle: () => {
  }
});
function ee() {
  if (typeof window > "u") return S;
  try {
    const e = window.localStorage.getItem(H);
    if (e === "light" || e === "dark" || e === "system")
      return e;
  } catch {
  }
  return S;
}
function G() {
  return typeof window > "u" || !window.matchMedia ? !1 : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function C(e) {
  return e === "dark" ? "dark" : e === "light" ? "light" : G() ? "dark" : "light";
}
function R(e) {
  if (typeof document > "u") return;
  const a = document.documentElement;
  a.setAttribute("data-theme", e), e === "dark" ? a.classList.add("dark") : a.classList.remove("dark");
}
function te({ children: e, defaultPreference: a = S }) {
  const [n, s] = f.useState(() => ee() ?? a), [i, r] = f.useState(() => C(n)), l = f.useCallback((d) => {
    if (d !== "light" && d !== "dark" && d !== "system") return;
    s(d);
    try {
      window.localStorage.setItem(H, d);
    } catch {
    }
    const o = C(d);
    r(o), R(o);
  }, []);
  f.useEffect(() => {
    if (n !== "system" || typeof window > "u" || !window.matchMedia)
      return;
    const d = window.matchMedia("(prefers-color-scheme: dark)"), o = () => {
      const x = G() ? "dark" : "light";
      r(x), R(x);
    };
    return d.addEventListener("change", o), () => d.removeEventListener("change", o);
  }, [n]), f.useEffect(() => {
    R(C(n));
  }, []);
  const u = f.useCallback(() => {
    const d = ["light", "dark", "system"], o = d.indexOf(n), x = d[(o + 1) % d.length];
    l(x);
  }, [n, l]), m = f.useMemo(
    () => ({ preference: n, resolvedTheme: i, setPreference: l, toggle: u }),
    [n, i, l, u]
  );
  return /* @__PURE__ */ t.jsx(O.Provider, { value: m, children: e });
}
function ae() {
  const e = f.useContext(O);
  if (!e)
    throw new Error("useTheme must be used inside a <ThemeProvider>.");
  return e;
}
const ne = {
  desktop: [
    { i: "budget-health", x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "cash-flow", x: 6, y: 0, w: 6, h: 2, minW: 4, minH: 2 },
    { i: "risk-alerts", x: 6, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "pending-approvals", x: 0, y: 4, w: 6, h: 4, minW: 4, minH: 3 }
  ],
  tablet: [
    { i: "budget-health", x: 0, y: 0, w: 8, h: 4, minW: 4, minH: 3 },
    { i: "cash-flow", x: 0, y: 4, w: 8, h: 2, minW: 4, minH: 2 },
    { i: "risk-alerts", x: 0, y: 6, w: 8, h: 4, minW: 4, minH: 3 },
    { i: "pending-approvals", x: 0, y: 10, w: 8, h: 4, minW: 4, minH: 3 }
  ],
  mobile: [
    { i: "budget-health", x: 0, y: 0, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "cash-flow", x: 0, y: 4, w: 1, h: 2, isResizable: !1, isDraggable: !1 },
    { i: "risk-alerts", x: 0, y: 6, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "pending-approvals", x: 0, y: 10, w: 1, h: 4, isResizable: !1, isDraggable: !1 }
  ]
}, re = {
  desktop: [
    { i: "risk-alerts", x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "pending-approvals", x: 6, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "budget-health", x: 0, y: 4, w: 6, h: 3, minW: 4, minH: 3 },
    { i: "cash-flow", x: 6, y: 4, w: 6, h: 3, minW: 4, minH: 2 }
  ],
  tablet: [
    { i: "risk-alerts", x: 0, y: 0, w: 8, h: 4 },
    { i: "pending-approvals", x: 0, y: 4, w: 8, h: 4 },
    { i: "budget-health", x: 0, y: 8, w: 8, h: 3 },
    { i: "cash-flow", x: 0, y: 11, w: 8, h: 2 }
  ],
  mobile: [
    { i: "risk-alerts", x: 0, y: 0, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "pending-approvals", x: 0, y: 4, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "budget-health", x: 0, y: 8, w: 1, h: 4, isResizable: !1, isDraggable: !1 },
    { i: "cash-flow", x: 0, y: 12, w: 1, h: 2, isResizable: !1, isDraggable: !1 }
  ]
}, se = {
  desktop: [
    /* Saha personası desktop'ta da erişebilsin diye basit layout */
    { i: "pending-approvals", x: 0, y: 0, w: 8, h: 4 },
    { i: "risk-alerts", x: 8, y: 0, w: 4, h: 4 }
  ],
  tablet: [
    { i: "pending-approvals", x: 0, y: 0, w: 8, h: 4 },
    { i: "risk-alerts", x: 0, y: 4, w: 8, h: 3 }
  ],
  mobile: [
    { i: "pending-approvals", x: 0, y: 0, w: 1, h: 5, isResizable: !1, isDraggable: !1 },
    { i: "risk-alerts", x: 0, y: 5, w: 1, h: 4, isResizable: !1, isDraggable: !1 }
  ]
}, A = {
  cfo: ne,
  pm: re,
  field: se
}, $ = {
  cfo: "CFO / Finansman",
  pm: "Proje Yöneticisi",
  field: "Saha Kullanıcısı"
}, ie = {
  desktop: 1280,
  tablet: 768,
  mobile: 0
}, oe = {
  desktop: 12,
  tablet: 8,
  mobile: 1
}, le = 64, ce = [12, 12], W = "apya-dashboard-persona", E = "apya-dashboard-layout-overrides";
function de() {
  if (typeof window > "u") return "cfo";
  try {
    const e = window.localStorage.getItem(W);
    if (e && A[e]) return e;
  } catch {
  }
  return "cfo";
}
function ue(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(W, e);
    } catch {
    }
}
function xe(e) {
  if (typeof window > "u") return null;
  try {
    const a = window.localStorage.getItem(`${E}-${e}`);
    return a ? JSON.parse(a) : null;
  } catch {
    return null;
  }
}
function me(e, a) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(
        `${E}-${e}`,
        JSON.stringify(a)
      );
    } catch {
    }
}
function fe(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.removeItem(`${E}-${e}`);
    } catch {
    }
}
function c(...e) {
  return Z(Q(e));
}
function he(e, a, n = "tr-TR") {
  return typeof e != "number" || !Number.isFinite(e) ? "—" : new Intl.NumberFormat(n, {
    style: "currency",
    currency: a,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(e);
}
function T(e, a, n = "tr-TR") {
  return typeof e != "number" || !Number.isFinite(e) ? "—" : new Intl.NumberFormat(n, {
    style: "currency",
    currency: a,
    notation: "compact",
    maximumFractionDigits: 1
  }).format(e);
}
function K(e, a = "tr-TR") {
  if (typeof e != "number" || !Number.isFinite(e))
    return { sign: "", symbol: "•", text: "—" };
  const n = Math.abs(e), s = new Intl.NumberFormat(a, {
    style: "percent",
    maximumFractionDigits: 1
  }).format(n / 100);
  return e > 0 ? { sign: "+", symbol: "▲", text: s } : e < 0 ? { sign: "−", symbol: "▼", text: s } : { sign: "", symbol: "•", text: s };
}
const pe = I(
  /* Base — her variant için ortak */
  c(
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
        primary: c(
          "bg-brand-500 text-text-inverse",
          "hover:bg-brand-600 active:bg-brand-700",
          "shadow-sm"
        ),
        secondary: c(
          "bg-surface-raised text-text-primary border border-default",
          "hover:bg-surface-elevated hover:border-strong"
        ),
        ghost: c(
          "bg-transparent text-text-secondary",
          "hover:bg-surface-raised hover:text-text-primary"
        ),
        destructive: c(
          "bg-negative-500 text-text-inverse",
          "hover:bg-negative-600 active:bg-negative-700",
          "shadow-sm"
        ),
        outline: c(
          "bg-transparent text-text-primary border border-strong",
          "hover:bg-surface-raised"
        ),
        link: c(
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
), b = h.forwardRef(function({
  className: a,
  variant: n,
  size: s,
  asChild: i = !1,
  isLoading: r = !1,
  loadingText: l,
  leadingIcon: u,
  trailingIcon: m,
  disabled: d,
  children: o,
  type: x = "button",
  ...g
}, p) {
  const j = i ? X : "button", k = d || r;
  return /* @__PURE__ */ t.jsxs(
    j,
    {
      ref: p,
      type: i ? void 0 : x,
      disabled: i ? void 0 : k,
      "aria-busy": r || void 0,
      "data-loading": r || void 0,
      className: c(pe({ variant: n, size: s }), a),
      ...g,
      children: [
        r ? /* @__PURE__ */ t.jsx(ge, {}) : u,
        /* @__PURE__ */ t.jsx("span", { className: r ? "opacity-80" : void 0, children: r && l ? l : o }),
        !r && m
      ]
    }
  );
});
function ge() {
  return /* @__PURE__ */ t.jsx(
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
      children: /* @__PURE__ */ t.jsx("path", { d: "M21 12a9 9 0 1 1-6.219-8.56", strokeLinecap: "round" })
    }
  );
}
const be = {
  default: "bg-surface-raised border border-subtle shadow-sm",
  elevated: "bg-surface-elevated border border-subtle shadow-md",
  flat: "bg-surface-base border border-default shadow-none",
  interactive: c(
    "bg-surface-raised border border-subtle shadow-sm",
    "hover:shadow-md hover:border-default cursor-pointer",
    "transition-shadow duration-fast ease-standard"
  )
}, M = {
  compact: "p-3",
  comfortable: "p-4",
  spacious: "p-6"
}, v = h.forwardRef(function({ className: a, variant: n = "default", density: s, children: i, ...r }, l) {
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      ref: l,
      "data-density": s,
      className: c(
        "rounded-lg overflow-hidden",
        "text-text-primary",
        be[n],
        a
      ),
      ...r,
      children: i
    }
  );
}), F = h.forwardRef(function({ className: a, density: n = "comfortable", children: s, ...i }, r) {
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      ref: r,
      className: c(
        "flex flex-col gap-1",
        "border-b border-subtle",
        M[n],
        a
      ),
      ...i,
      children: s
    }
  );
}), Y = h.forwardRef(function({ className: a, as: n = "h3", children: s, ...i }, r) {
  return /* @__PURE__ */ t.jsx(
    n,
    {
      ref: r,
      className: c(
        "text-lg font-semibold leading-tight text-text-primary",
        a
      ),
      ...i,
      children: s
    }
  );
}), ye = h.forwardRef(function({ className: a, children: n, ...s }, i) {
  return /* @__PURE__ */ t.jsx(
    "p",
    {
      ref: i,
      className: c("text-sm text-text-secondary", a),
      ...s,
      children: n
    }
  );
}), V = h.forwardRef(function({ className: a, density: n = "comfortable", children: s, ...i }, r) {
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      ref: r,
      className: c(M[n], a),
      ...i,
      children: s
    }
  );
}), ve = h.forwardRef(function({ className: a, density: n = "comfortable", children: s, ...i }, r) {
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      ref: r,
      className: c(
        "flex items-center justify-end gap-2",
        "border-t border-subtle bg-surface-sunken",
        M[n],
        a
      ),
      ...i,
      children: s
    }
  );
});
v.Header = F;
v.Title = Y;
v.Description = ye;
v.Body = V;
v.Footer = ve;
function N({ className: e, width: a, height: n, rounded: s = "md", ...i }) {
  const r = {};
  return a !== void 0 && (r.width = typeof a == "number" ? `${a}px` : a), n !== void 0 && (r.height = typeof n == "number" ? `${n}px` : n), /* @__PURE__ */ t.jsx(
    "div",
    {
      "aria-busy": "true",
      "aria-live": "polite",
      className: c(
        "skeleton",
        s === "full" && "rounded-full",
        s === "sm" && "rounded-sm",
        s === "md" && "rounded-md",
        s === "lg" && "rounded-lg",
        e
      ),
      style: r,
      ...i
    }
  );
}
const we = I(
  c(
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
), je = {
  neutral: "bg-neutral-500",
  brand: "bg-brand-500",
  positive: "bg-positive-500",
  negative: "bg-negative-500",
  warning: "bg-warning-500",
  critical: "bg-critical-500",
  ai: "bg-ai-500"
};
function w({ variant: e = "neutral", size: a, withDot: n = !1, className: s, children: i, ...r }) {
  return /* @__PURE__ */ t.jsxs("span", { className: c(we({ variant: e, size: a }), s), ...r, children: [
    n && /* @__PURE__ */ t.jsx(
      "span",
      {
        className: c("inline-block h-1.5 w-1.5 rounded-full", je[e]),
        "aria-hidden": "true"
      }
    ),
    i
  ] });
}
const z = {
  light: "Açık tema (Sıradaki: Koyu)",
  dark: "Koyu tema (Sıradaki: Sistem)",
  system: "Sistem teması (Sıradaki: Açık)"
};
function ke({ className: e = "" }) {
  const { preference: a, toggle: n } = ae();
  return /* @__PURE__ */ t.jsxs(
    "button",
    {
      type: "button",
      onClick: n,
      "aria-label": z[a] ?? "Tema değiştir",
      title: z[a] ?? "Tema değiştir",
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
        a === "light" && /* @__PURE__ */ t.jsx(Ne, {}),
        a === "dark" && /* @__PURE__ */ t.jsx(Se, {}),
        a === "system" && /* @__PURE__ */ t.jsx(Ce, {})
      ]
    }
  );
}
function Ne() {
  return /* @__PURE__ */ t.jsxs(
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
        /* @__PURE__ */ t.jsx("circle", { cx: "12", cy: "12", r: "4" }),
        /* @__PURE__ */ t.jsx("path", { d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" })
      ]
    }
  );
}
function Se() {
  return /* @__PURE__ */ t.jsx(
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
      children: /* @__PURE__ */ t.jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" })
    }
  );
}
function Ce() {
  return /* @__PURE__ */ t.jsxs(
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
        /* @__PURE__ */ t.jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }),
        /* @__PURE__ */ t.jsx("path", { d: "M8 21h8M12 17v4" })
      ]
    }
  );
}
const q = {
  /* react-grid-layout drag handle'ı için class — yalnızca header'dan sürüklenir,
     body'den sürüklendiğinde widget içindeki interactive element'leri tetiklemez. */
  DRAG_HANDLE_CLASS: "widget-drag-handle"
};
function y({
  title: e,
  subtitle: a,
  badge: n,
  actions: s,
  /* sağ üstteki action button'lar */
  isLoading: i = !1,
  isError: r = !1,
  errorMessage: l,
  onRetry: u,
  isEmpty: m = !1,
  emptyMessage: d = "Görüntülenecek veri yok.",
  density: o = "compact",
  children: x,
  className: g
}) {
  return /* @__PURE__ */ t.jsxs(v, { variant: "default", className: c("h-full flex flex-col", g), children: [
    /* @__PURE__ */ t.jsxs(
      F,
      {
        density: o,
        className: c(
          /* Header drag-handle olur — sadece BURASI sürüklenir */
          q.DRAG_HANDLE_CLASS,
          "cursor-grab active:cursor-grabbing select-none",
          "flex-row items-center justify-between flex-none"
        ),
        children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0 flex-1", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ t.jsx(Y, { className: "text-sm font-semibold truncate", children: e }),
              n
            ] }),
            a && /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary truncate", children: a })
          ] }),
          s && /* Action button'ların onClick'leri drag'i tetiklemesin diye stopPropagation */
          /* @__PURE__ */ t.jsx(
            "div",
            {
              className: "flex items-center gap-1 flex-none",
              onMouseDown: (p) => p.stopPropagation(),
              onTouchStart: (p) => p.stopPropagation(),
              children: s
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ t.jsxs(V, { density: o, className: "flex-1 overflow-auto", children: [
      r && /* @__PURE__ */ t.jsx(Ae, { message: l, onRetry: u }),
      !r && i && /* @__PURE__ */ t.jsx(Re, { density: o }),
      !r && !i && m && /* @__PURE__ */ t.jsx(Te, { message: d }),
      !r && !i && !m && x
    ] })
  ] });
}
function Re({ density: e }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3", "aria-busy": "true", children: [
    /* @__PURE__ */ t.jsx(N, { height: e === "spacious" ? 48 : 32, className: "w-1/3" }),
    /* @__PURE__ */ t.jsx(N, { height: 16 }),
    /* @__PURE__ */ t.jsx(N, { height: 16, className: "w-5/6" }),
    /* @__PURE__ */ t.jsx(N, { height: 16, className: "w-3/4" })
  ] });
}
function Ae({ message: e, onRetry: a }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col items-center justify-center text-center gap-2 py-4", children: [
    /* @__PURE__ */ t.jsx(w, { variant: "negative", withDot: !0, children: "Yüklenemedi" }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-secondary max-w-xs", children: e || "Veri alınırken bir hata oluştu." }),
    a && /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: a,
        className: c(
          "text-sm text-text-link underline-offset-2 hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: "Tekrar dene"
      }
    )
  ] });
}
function Te({ message: e }) {
  return /* @__PURE__ */ t.jsx("div", { className: "flex flex-col items-center justify-center text-center gap-1 py-6", children: /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: e }) });
}
y.DRAG_HANDLE_CLASS = q.DRAG_HANDLE_CLASS;
const De = {
  spent: 1847500,
  budget: 24e5,
  currency: "TRY",
  deltaPct: -8.4,
  /* önceki aya göre düşmüş — pozitif sinyal */
  breakdown: [
    { project: "KOSGEB Ar-Ge", spent: 72e4, budget: 9e5, ratio: 0.8 },
    { project: "TÜBİTAK 1501", spent: 54e4, budget: 8e5, ratio: 0.68 },
    { project: "Dijitalleşme Hibesi", spent: 387500, budget: 45e4, ratio: 0.86 },
    { project: "İhracat Geliştirme", spent: 2e5, budget: 25e4, ratio: 0.8 }
  ]
};
function Ee({ data: e = De, isLoading: a, isError: n, onRetry: s }) {
  const i = e ? e.spent / e.budget * 100 : 0, r = P(i), l = e ? K(e.deltaPct) : null;
  return /* @__PURE__ */ t.jsx(
    y,
    {
      title: "Bütçe Sağlığı",
      subtitle: "Tüm aktif projeler — bu ay",
      badge: /* @__PURE__ */ t.jsx(w, { variant: r.badgeVariant, size: "sm", withDot: !0, children: r.label }),
      isLoading: a,
      isError: n,
      onRetry: s,
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-baseline gap-2 font-tabular", children: [
          /* @__PURE__ */ t.jsx("span", { className: "text-3xl font-semibold tracking-tight", children: T(e.spent, e.currency) }),
          /* @__PURE__ */ t.jsxs("span", { className: "text-sm text-text-tertiary", children: [
            "/ ",
            T(e.budget, e.currency)
          ] })
        ] }),
        l && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1.5 text-xs", children: [
          /* @__PURE__ */ t.jsxs("span", { className: c(
            "inline-flex items-center gap-1 font-medium font-tabular",
            /* delta < 0 = harcama düşmüş = pozitif sinyal */
            e.deltaPct < 0 ? "text-text-positive" : "text-text-negative"
          ), children: [
            l.symbol,
            " ",
            l.text
          ] }),
          /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: "geçen aya göre" })
        ] }),
        /* @__PURE__ */ t.jsx(Me, { value: i, variant: r.barVariant }),
        /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-1.5 mt-1 overflow-y-auto", children: e.breakdown.map((u) => /* @__PURE__ */ t.jsxs(
          "li",
          {
            className: "flex items-center justify-between text-xs gap-3",
            children: [
              /* @__PURE__ */ t.jsx("span", { className: "truncate text-text-secondary", children: u.project }),
              /* @__PURE__ */ t.jsxs("span", { className: c(
                "font-tabular font-medium",
                P(u.ratio * 100).textVariant
              ), children: [
                Math.round(u.ratio * 100),
                "%"
              ] })
            ]
          },
          u.project
        )) })
      ] })
    }
  );
}
function P(e) {
  return e >= 90 ? {
    label: "Kritik",
    badgeVariant: "critical",
    barVariant: "critical",
    textVariant: "text-text-negative"
  } : e >= 70 ? {
    label: "Dikkat",
    badgeVariant: "warning",
    barVariant: "warning",
    textVariant: "text-text-warning"
  } : {
    label: "Sağlıklı",
    badgeVariant: "positive",
    barVariant: "positive",
    textVariant: "text-text-positive"
  };
}
function Me({ value: e, variant: a = "positive" }) {
  const n = {
    positive: "bg-positive-500",
    warning: "bg-warning-500",
    critical: "bg-negative-500"
  }[a];
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      role: "progressbar",
      "aria-valuenow": Math.round(e),
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      className: "w-full h-1.5 rounded-full bg-surface-sunken overflow-hidden",
      children: /* @__PURE__ */ t.jsx(
        "div",
        {
          className: c(
            n,
            "h-full rounded-full transition-all duration-slow ease-standard"
          ),
          style: { width: `${Math.min(e, 100)}%` }
        }
      )
    }
  );
}
const Le = {
  currency: "TRY",
  netCurrent: 487300,
  deltaPct: 12.4,
  /* 30 günlük seri — son 30 gün, 0 = en eski */
  series: [
    320,
    312,
    305,
    318,
    332,
    340,
    355,
    348,
    360,
    372,
    380,
    365,
    390,
    410,
    405,
    420,
    435,
    425,
    440,
    455,
    448,
    462,
    470,
    458,
    472,
    480,
    475,
    482,
    487,
    487
  ]
};
function ze({ data: e = Le, isLoading: a, isError: n, onRetry: s }) {
  const i = e ? K(e.deltaPct) : null, r = e ? e.deltaPct >= 0 : !0;
  return /* @__PURE__ */ t.jsx(
    y,
    {
      title: "Nakit Akışı",
      subtitle: "Son 30 gün",
      isLoading: a,
      isError: n,
      onRetry: s,
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-4 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 flex-none", children: [
          /* @__PURE__ */ t.jsx("div", { className: "text-2xl font-semibold tracking-tight font-tabular", children: T(e.netCurrent, e.currency) }),
          i && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 text-xs", children: [
            /* @__PURE__ */ t.jsxs("span", { className: c(
              "inline-flex items-center gap-1 font-medium font-tabular",
              r ? "text-text-positive" : "text-text-negative"
            ), children: [
              i.symbol,
              " ",
              i.text
            ] }),
            /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: "vs önceki dönem" })
          ] })
        ] }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx(Pe, { series: e.series, variant: r ? "positive" : "negative" }) })
      ] })
    }
  );
}
function Pe({ series: e, variant: a = "positive" }) {
  const s = `cashflow-grad-${f.useId().replace(/:/g, "")}`;
  if (!e || e.length < 2) return null;
  const i = 100, r = 40, l = Math.min(...e), m = Math.max(...e) - l || 1, o = e.map((p, j) => {
    const k = j / (e.length - 1) * i, U = r - (p - l) / m * r;
    return [k, U];
  }).map(([p, j], k) => `${k === 0 ? "M" : "L"} ${p.toFixed(2)} ${j.toFixed(2)}`).join(" "), x = `${o} L ${i} ${r} L 0 ${r} Z`, g = a === "positive" ? "var(--apya-positive-500)" : "var(--apya-negative-500)";
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      viewBox: `0 0 ${i} ${r}`,
      preserveAspectRatio: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ t.jsx("defs", { children: /* @__PURE__ */ t.jsxs("linearGradient", { id: s, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ t.jsx("stop", { offset: "0%", stopColor: g, stopOpacity: "0.25" }),
          /* @__PURE__ */ t.jsx("stop", { offset: "100%", stopColor: g, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ t.jsx("path", { d: x, fill: `url(#${s})` }),
        /* @__PURE__ */ t.jsx(
          "path",
          {
            d: o,
            fill: "none",
            stroke: g,
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            vectorEffect: "non-scaling-stroke"
          }
        )
      ]
    }
  );
}
const _e = [
  {
    id: "inv-001",
    type: "invoice",
    title: "TÜBİTAK 1501 — Eylül faturası",
    requester: "Ahmet Yıldız",
    amount: 12450,
    currency: "TRY",
    ageHours: 4
  },
  {
    id: "exp-002",
    type: "expense",
    title: "Yazılım lisansı — JetBrains All",
    requester: "Mehmet Kaya",
    amount: 8240,
    currency: "TRY",
    ageHours: 18
  },
  {
    id: "po-003",
    type: "po",
    title: "Bulut hosting (Q3 yenileme)",
    requester: "Zeynep Aksoy",
    amount: 24900,
    currency: "TRY",
    ageHours: 36
  },
  {
    id: "inv-004",
    type: "invoice",
    title: "KOSGEB danışmanlık — Ağustos",
    requester: "Selin Aydın",
    amount: 6800,
    currency: "TRY",
    ageHours: 52
  }
], _ = {
  invoice: { label: "Fatura", variant: "brand" },
  expense: { label: "Masraf", variant: "neutral" },
  po: { label: "Sipariş", variant: "ai" }
};
function Be({
  items: e = _e,
  isLoading: a,
  isError: n,
  onRetry: s,
  onApprove: i,
  onReject: r
}) {
  const l = (e == null ? void 0 : e.length) ?? 0;
  return /* @__PURE__ */ t.jsx(
    y,
    {
      title: "Onay Bekleyenler",
      subtitle: l > 0 ? `${l} kalem inceleme bekliyor` : void 0,
      badge: l > 0 && /* @__PURE__ */ t.jsx(w, { variant: "warning", size: "sm", withDot: !0, children: l }),
      isLoading: a,
      isError: n,
      onRetry: s,
      isEmpty: !a && !n && l === 0,
      emptyMessage: "🎉 Bekleyen onay yok.",
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: e == null ? void 0 : e.map((u) => /* @__PURE__ */ t.jsx(
        Ie,
        {
          item: u,
          onApprove: i,
          onReject: r
        },
        u.id
      )) })
    }
  );
}
function Ie({ item: e, onApprove: a, onReject: n }) {
  const [s, i] = h.useState(null), r = _[e.type] ?? _.expense, l = He(e.ageHours), u = async (m, d) => {
    if (!s) {
      i(m);
      try {
        await (d == null ? void 0 : d(e));
      } finally {
        i(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsxs("li", { className: c(
    "flex items-center gap-3 p-2.5 rounded-md",
    "bg-surface-base border border-subtle",
    "transition-opacity duration-fast",
    s && "opacity-60"
  ), children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 min-w-0 flex-1", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(w, { variant: r.variant, size: "sm", children: r.label }),
        /* @__PURE__ */ t.jsxs("span", { className: "text-xs text-text-tertiary truncate", children: [
          e.requester,
          " · ",
          l
        ] })
      ] }),
      /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary truncate", children: e.title })
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "font-tabular font-semibold text-sm text-text-primary flex-none", children: he(e.amount, e.currency) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 flex-none", children: [
      /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => u("reject", n),
          isLoading: s === "reject",
          "aria-label": `${e.title} reddet`,
          className: "text-text-negative hover:bg-negative-50 hover:text-negative-700",
          children: "Reddet"
        }
      ),
      /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: "primary",
          onClick: () => u("approve", a),
          isLoading: s === "approve",
          "aria-label": `${e.title} onayla`,
          children: "Onayla"
        }
      )
    ] })
  ] });
}
function He(e) {
  return e < 1 ? "az önce" : e < 24 ? `${Math.round(e)} sa önce` : `${Math.floor(e / 24)} gün önce`;
}
const Oe = [
  {
    id: "r-001",
    severity: "critical",
    title: "KOSGEB Ar-Ge projesi 14 gün içinde teslim — kritik yol kaymış",
    confidence: 92,
    confidenceLabel: "Yüksek",
    reasons: [
      "Görev T-142 son 5 gündür hareketsiz",
      "Bağımlı 3 görev gecikmeli",
      "Geçmiş projelerde benzer örüntü %78 gecikme ile sonuçlandı"
    ],
    suggestedAction: "Kritik yolu yeniden planla"
  },
  {
    id: "r-002",
    severity: "actionable",
    title: "Dijitalleşme bütçesi %86 — kalan 2 ay yetmeyebilir",
    confidence: 74,
    confidenceLabel: "Orta",
    reasons: [
      "Aylık ortalama harcama hızı 187K ₺",
      "Kalan bütçe 63K ₺",
      "Önceki dönemde benzer hızda %22 aşım yaşanmış"
    ],
    suggestedAction: "Bütçe revizyonu öner"
  },
  {
    id: "r-003",
    severity: "info",
    title: "Yeni hibe çağrısı: TÜBİTAK 1505 firma profilinizle %88 uyumlu",
    confidence: 88,
    confidenceLabel: "Yüksek",
    reasons: [
      "NACE sektörü uyumlu",
      "Çalışan sayısı eşleşiyor",
      "Önceki başarılı projeniz 1501 → 1505 kombinasyonu yaygın"
    ],
    suggestedAction: "Çağrıyı incele"
  }
], D = {
  critical: { label: "Kritik", variant: "critical", priority: 0 },
  actionable: { label: "Eyleme açık", variant: "warning", priority: 1 },
  info: { label: "Bilgi", variant: "ai", priority: 2 }
};
function Ge({
  risks: e = Oe,
  isLoading: a,
  isError: n,
  onRetry: s,
  onAccept: i,
  onDismiss: r
}) {
  const l = h.useMemo(
    () => [...e ?? []].sort(
      (u, m) => D[u.severity].priority - D[m.severity].priority
    ),
    [e]
  );
  return /* @__PURE__ */ t.jsx(
    y,
    {
      title: "Risk Uyarıları",
      subtitle: "AI öneri motoru",
      badge: /* @__PURE__ */ t.jsx(w, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
      isLoading: a,
      isError: n,
      onRetry: s,
      isEmpty: !a && !n && l.length === 0,
      emptyMessage: "Şu an risk yok — AI motoru tarama tamamladı.",
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: l.map((u) => /* @__PURE__ */ t.jsx(
        $e,
        {
          risk: u,
          onAccept: i,
          onDismiss: r
        },
        u.id
      )) })
    }
  );
}
function $e({ risk: e, onAccept: a, onDismiss: n }) {
  const [s, i] = h.useState(!1), [r, l] = h.useState(null), u = D[e.severity], m = async (d, o) => {
    if (!r) {
      l(d);
      try {
        await (o == null ? void 0 : o(e));
      } finally {
        l(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsx("li", { className: c(
    "rounded-md border bg-surface-base",
    "transition-opacity duration-fast",
    e.severity === "critical" && "border-critical-50 bg-critical-50",
    e.severity === "actionable" && "border-warning-100",
    e.severity === "info" && "border-subtle",
    r && "opacity-60"
  ), children: /* @__PURE__ */ t.jsxs("div", { className: "p-2.5 flex flex-col gap-2", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t.jsx(w, { variant: u.variant, size: "sm", withDot: !0, children: u.label }),
      /* @__PURE__ */ t.jsx(We, { score: e.confidence, label: e.confidenceLabel })
    ] }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug", children: e.title }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: () => i((d) => !d),
        "aria-expanded": s,
        className: c(
          "self-start text-xs text-text-link hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: s ? "Açıklamayı gizle" : "Neden bu öneri?"
      }
    ),
    s && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: e.reasons.map((d, o) => /* @__PURE__ */ t.jsx("li", { children: d }, o)) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
      /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => m("dismiss", n),
          isLoading: r === "dismiss",
          children: "Şimdi değil"
        }
      ),
      /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: e.severity === "critical" ? "destructive" : "primary",
          onClick: () => m("accept", a),
          isLoading: r === "accept",
          children: e.suggestedAction
        }
      )
    ] })
  ] }) });
}
function We({ score: e, label: a }) {
  const n = Math.max(0, Math.min(5, Math.round(e / 100 * 5)));
  return /* @__PURE__ */ t.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1 text-xs text-text-tertiary",
      title: `Güven: %${e}`,
      children: [
        /* @__PURE__ */ t.jsxs("span", { className: "font-tabular tracking-wider", "aria-hidden": "true", children: [
          "●".repeat(n),
          /* @__PURE__ */ t.jsx("span", { className: "text-text-disabled", children: "○".repeat(5 - n) })
        ] }),
        /* @__PURE__ */ t.jsxs("span", { className: "sr-only", children: [
          "Güven düzeyi: ",
          a,
          " (%",
          e,
          ")"
        ] }),
        /* @__PURE__ */ t.jsx("span", { "aria-hidden": "true", children: a })
      ]
    }
  );
}
const Ke = L.WidthProvider(L.Responsive), Fe = {
  "budget-health": Ee,
  "cash-flow": ze,
  "pending-approvals": Be,
  "risk-alerts": Ge
};
function Ye() {
  const [e, a] = f.useState(() => de()), [n, s] = f.useState(!1), i = f.useMemo(() => {
    const o = A[e] ?? A.cfo, x = xe(e);
    return x ? { ...o, ...x } : o;
  }, [e]), r = f.useCallback((o) => {
    a(o), ue(o);
  }, []), l = f.useCallback(
    (o, x) => {
      n && me(e, x);
    },
    [n, e]
  ), u = f.useCallback(() => {
    fe(e), a(e);
  }, [e]), d = (i.desktop ?? []).map((o) => o.i);
  return /* @__PURE__ */ t.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ t.jsx(
      Ve,
      {
        persona: e,
        onPersonaChange: r,
        editMode: n,
        onEditModeToggle: () => s((o) => !o),
        onReset: u
      }
    ),
    /* @__PURE__ */ t.jsx("main", { className: "px-4 py-4 mobile:px-2 mobile:py-2", children: /* @__PURE__ */ t.jsx(
      Ke,
      {
        className: c("apya-bento", n && "apya-bento--edit"),
        layouts: i,
        breakpoints: ie,
        cols: oe,
        rowHeight: le,
        margin: ce,
        isDraggable: n,
        isResizable: n,
        draggableHandle: `.${y.DRAG_HANDLE_CLASS}`,
        onLayoutChange: l,
        compactType: "vertical",
        preventCollision: !1,
        children: d.map((o) => {
          const x = Fe[o];
          return x ? /* @__PURE__ */ t.jsx("div", { className: "apya-bento-item", children: /* @__PURE__ */ t.jsx(x, {}) }, o) : /* @__PURE__ */ t.jsx("div", { children: /* @__PURE__ */ t.jsx(y, { title: `Bilinmeyen widget: ${o}` }) }, o);
        })
      }
    ) }),
    n && /* @__PURE__ */ t.jsxs(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        className: c(
          "fixed bottom-4 left-1/2 -translate-x-1/2 z-toast",
          "bg-surface-inverse text-text-inverse text-sm",
          "px-4 py-2 rounded-md shadow-lg",
          "flex items-center gap-3"
        ),
        children: [
          /* @__PURE__ */ t.jsx("span", { children: "Düzenleme modu — widget'ları sürükleyip yeniden boyutlandırabilirsin" }),
          /* @__PURE__ */ t.jsx(
            b,
            {
              variant: "ghost",
              size: "sm",
              className: "text-text-inverse hover:bg-white/10",
              onClick: () => s(!1),
              children: "Bitir"
            }
          )
        ]
      }
    )
  ] });
}
function Ve({ persona: e, onPersonaChange: a, editMode: n, onEditModeToggle: s, onReset: i }) {
  return /* @__PURE__ */ t.jsxs("header", { className: c(
    "sticky top-0 z-sticky",
    "bg-surface-raised/95 backdrop-blur-sm",
    "border-b border-default",
    "px-4 py-3",
    "flex items-center justify-between gap-4",
    "mobile:px-2 mobile:py-2"
  ), children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0", children: [
      /* @__PURE__ */ t.jsx("h1", { className: "text-base font-semibold text-text-primary truncate", children: "Genel Bakış" }),
      /* @__PURE__ */ t.jsxs("p", { className: "text-xs text-text-tertiary truncate mobile:hidden", children: [
        $[e],
        " görünümü"
      ] })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      /* @__PURE__ */ t.jsx(qe, { value: e, onChange: a }),
      n ? /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: "secondary",
          onClick: i,
          title: "Layout'u persona varsayılanına döndür",
          children: "Sıfırla"
        }
      ) : null,
      /* @__PURE__ */ t.jsx(
        b,
        {
          size: "sm",
          variant: n ? "primary" : "secondary",
          onClick: s,
          children: n ? "Tamamla" : "Düzenle"
        }
      ),
      /* @__PURE__ */ t.jsx(ke, {})
    ] })
  ] });
}
function qe({ value: e, onChange: a }) {
  return /* @__PURE__ */ t.jsxs("label", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ t.jsx("span", { className: "sr-only", children: "Persona seç" }),
    /* @__PURE__ */ t.jsx(
      "select",
      {
        value: e,
        onChange: (n) => a(n.target.value),
        className: c(
          "h-10 px-3 text-sm rounded-md",
          "bg-surface-base text-text-primary",
          "border border-default",
          "hover:border-strong",
          "focus-visible:outline-none focus-visible:shadow-focus",
          "transition-colors duration-fast"
        ),
        children: Object.entries($).map(([n, s]) => /* @__PURE__ */ t.jsx("option", { value: n, children: s }, n))
      }
    )
  ] });
}
const B = document.getElementById("apya-dashboard-root");
B && J(B).render(
  /* @__PURE__ */ t.jsx(te, { children: /* @__PURE__ */ t.jsx(Ye, {}) })
);
