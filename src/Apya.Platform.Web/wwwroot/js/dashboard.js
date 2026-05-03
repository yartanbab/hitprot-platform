import { r as f, j as t, d as p, b as oe } from "./react-vendor.js";
import { Q as le, a as ce, u as C, b as P, c as O } from "./query-vendor.js";
import { H as $, a as de, L as ue } from "./signalr-vendor.js";
import { r as B } from "./grid-vendor.js";
import { t as me, c as fe, a as q, S as xe } from "./ui-vendor.js";
/* empty css      */
const Y = "apya-theme", E = "system", Q = f.createContext({
  preference: E,
  resolvedTheme: "light",
  setPreference: () => {
  },
  toggle: () => {
  }
});
function he() {
  if (typeof window > "u") return E;
  try {
    const e = window.localStorage.getItem(Y);
    if (e === "light" || e === "dark" || e === "system")
      return e;
  } catch {
  }
  return E;
}
function V() {
  return typeof window > "u" || !window.matchMedia ? !1 : window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function D(e) {
  return e === "dark" ? "dark" : e === "light" ? "light" : V() ? "dark" : "light";
}
function L(e) {
  if (typeof document > "u") return;
  const a = document.documentElement;
  a.setAttribute("data-theme", e), e === "dark" ? a.classList.add("dark") : a.classList.remove("dark");
}
function pe({ children: e, defaultPreference: a = E }) {
  const [r, s] = f.useState(() => he() ?? a), [i, n] = f.useState(() => D(r)), c = f.useCallback((l) => {
    if (l !== "light" && l !== "dark" && l !== "system") return;
    s(l);
    try {
      window.localStorage.setItem(Y, l);
    } catch {
    }
    const o = D(l);
    n(o), L(o);
  }, []);
  f.useEffect(() => {
    if (r !== "system" || typeof window > "u" || !window.matchMedia)
      return;
    const l = window.matchMedia("(prefers-color-scheme: dark)"), o = () => {
      const h = V() ? "dark" : "light";
      n(h), L(h);
    };
    return l.addEventListener("change", o), () => l.removeEventListener("change", o);
  }, [r]), f.useEffect(() => {
    L(D(r));
  }, []);
  const d = f.useCallback(() => {
    const l = ["light", "dark", "system"], o = l.indexOf(r), h = l[(o + 1) % l.length];
    c(h);
  }, [r, c]), m = f.useMemo(
    () => ({ preference: r, resolvedTheme: i, setPreference: c, toggle: d }),
    [r, i, c, d]
  );
  return /* @__PURE__ */ t.jsx(Q.Provider, { value: m, children: e });
}
function ge() {
  const e = f.useContext(Q);
  if (!e)
    throw new Error("useTheme must be used inside a <ThemeProvider>.");
  return e;
}
class be extends Error {
  constructor(a, { status: r, code: s, details: i, validationErrors: n } = {}) {
    super(a), this.name = "ApiError", this.status = r, this.code = s, this.details = i, this.validationErrors = n;
  }
}
function ye() {
  return new le({
    defaultOptions: {
      queries: {
        staleTime: 3e4,
        gcTime: 5 * 6e4,
        refetchOnWindowFocus: !0,
        refetchOnReconnect: !0,
        retry: (e, a) => a instanceof be && a.status >= 400 && a.status < 500 ? !1 : e < 2
      },
      mutations: {
        /* Mutation default'ta retry YAPMAZ — duplicate finansal işlem riski. */
        retry: !1
      }
    }
  });
}
const x = {
  dashboard: {
    budget: () => ["dashboard", "budget"],
    cashflow: () => ["dashboard", "cashflow"],
    approvals: (e) => e ? ["dashboard", "approvals", e] : ["dashboard", "approvals"],
    risks: () => ["dashboard", "risks"]
  }
};
function ve({ children: e }) {
  const [a] = f.useState(() => ye());
  return /* @__PURE__ */ t.jsx(ce, { client: a, children: e });
}
const J = f.createContext({
  connection: null,
  state: $.Disconnected
});
function we({ hubUrl: e = "/signalr-hubs/notifications", children: a, enabled: r = !0 }) {
  const [s, i] = f.useState($.Disconnected), n = f.useRef(null);
  f.useEffect(() => {
    if (!r || typeof window > "u") return;
    const d = new de().withUrl(e, { withCredentials: !0 }).withAutomaticReconnect([0, 2e3, 5e3, 1e4, 3e4]).configureLogging(ue.Warning).build();
    n.current = d, i(d.state);
    const m = () => i(d.state);
    return d.onreconnecting(m), d.onreconnected(m), d.onclose(m), d.start().then(m).catch((l) => {
      console.warn("[SignalR] connect failed:", l == null ? void 0 : l.message), m();
    }), () => {
      d.stop().catch(() => {
      }), n.current = null;
    };
  }, [e, r]);
  const c = f.useMemo(() => ({
    get connection() {
      return n.current;
    },
    state: s
  }), [s]);
  return /* @__PURE__ */ t.jsx(J.Provider, { value: c, children: a });
}
function je() {
  return f.useContext(J);
}
const ke = {
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
}, Ne = {
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
}, Se = {
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
}, _ = {
  cfo: ke,
  pm: Ne,
  field: Se
}, Z = {
  cfo: "CFO / Finansman",
  pm: "Proje Yöneticisi",
  field: "Saha Kullanıcısı"
}, Ae = {
  desktop: 1280,
  tablet: 768,
  mobile: 0
}, Re = {
  desktop: 12,
  tablet: 8,
  mobile: 1
}, Ee = 64, Ce = [12, 12], X = "apya-dashboard-persona", z = "apya-dashboard-layout-overrides";
function De() {
  if (typeof window > "u") return "cfo";
  try {
    const e = window.localStorage.getItem(X);
    if (e && _[e]) return e;
  } catch {
  }
  return "cfo";
}
function Le(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(X, e);
    } catch {
    }
}
function _e(e) {
  if (typeof window > "u") return null;
  try {
    const a = window.localStorage.getItem(`${z}-${e}`);
    return a ? JSON.parse(a) : null;
  } catch {
    return null;
  }
}
function Me(e, a) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.setItem(
        `${z}-${e}`,
        JSON.stringify(a)
      );
    } catch {
    }
}
function Te(e) {
  if (!(typeof window > "u"))
    try {
      window.localStorage.removeItem(`${z}-${e}`);
    } catch {
    }
}
function u(...e) {
  return me(fe(e));
}
function Pe(e, a, r = "tr-TR") {
  return typeof e != "number" || !Number.isFinite(e) ? "—" : new Intl.NumberFormat(r, {
    style: "currency",
    currency: a,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(e);
}
function M(e, a, r = "tr-TR") {
  return typeof e != "number" || !Number.isFinite(e) ? "—" : new Intl.NumberFormat(r, {
    style: "currency",
    currency: a,
    notation: "compact",
    maximumFractionDigits: 1
  }).format(e);
}
function U(e, a = "tr-TR") {
  if (typeof e != "number" || !Number.isFinite(e))
    return { sign: "", symbol: "•", text: "—" };
  const r = Math.abs(e), s = new Intl.NumberFormat(a, {
    style: "percent",
    maximumFractionDigits: 1
  }).format(r / 100);
  return e > 0 ? { sign: "+", symbol: "▲", text: s } : e < 0 ? { sign: "−", symbol: "▼", text: s } : { sign: "", symbol: "•", text: s };
}
const ze = q(
  /* Base — her variant için ortak */
  u(
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
        primary: u(
          "bg-brand-500 text-text-inverse",
          "hover:bg-brand-600 active:bg-brand-700",
          "shadow-sm"
        ),
        secondary: u(
          "bg-surface-raised text-text-primary border border-default",
          "hover:bg-surface-elevated hover:border-strong"
        ),
        ghost: u(
          "bg-transparent text-text-secondary",
          "hover:bg-surface-raised hover:text-text-primary"
        ),
        destructive: u(
          "bg-negative-500 text-text-inverse",
          "hover:bg-negative-600 active:bg-negative-700",
          "shadow-sm"
        ),
        outline: u(
          "bg-transparent text-text-primary border border-strong",
          "hover:bg-surface-raised"
        ),
        link: u(
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
), w = p.forwardRef(function({
  className: a,
  variant: r,
  size: s,
  asChild: i = !1,
  isLoading: n = !1,
  loadingText: c,
  leadingIcon: d,
  trailingIcon: m,
  disabled: l,
  children: o,
  type: h = "button",
  ...v
}, g) {
  const S = i ? xe : "button", A = l || n;
  return /* @__PURE__ */ t.jsxs(
    S,
    {
      ref: g,
      type: i ? void 0 : h,
      disabled: i ? void 0 : A,
      "aria-busy": n || void 0,
      "data-loading": n || void 0,
      className: u(ze({ variant: r, size: s }), a),
      ...v,
      children: [
        n ? /* @__PURE__ */ t.jsx(Ie, {}) : d,
        /* @__PURE__ */ t.jsx("span", { className: n ? "opacity-80" : void 0, children: n && c ? c : o }),
        !n && m
      ]
    }
  );
});
function Ie() {
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
const Be = {
  default: "bg-surface-raised border border-subtle shadow-sm",
  elevated: "bg-surface-elevated border border-subtle shadow-md",
  flat: "bg-surface-base border border-default shadow-none",
  interactive: u(
    "bg-surface-raised border border-subtle shadow-sm",
    "hover:shadow-md hover:border-default cursor-pointer",
    "transition-shadow duration-fast ease-standard"
  )
}, I = {
  compact: "p-3",
  comfortable: "p-4",
  spacious: "p-6"
}, k = p.forwardRef(function({ className: a, variant: r = "default", density: s, children: i, ...n }, c) {
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      ref: c,
      "data-density": s,
      className: u(
        "rounded-lg overflow-hidden",
        "text-text-primary",
        Be[r],
        a
      ),
      ...n,
      children: i
    }
  );
}), ee = p.forwardRef(function({ className: a, density: r = "comfortable", children: s, ...i }, n) {
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      ref: n,
      className: u(
        "flex flex-col gap-1",
        "border-b border-subtle",
        I[r],
        a
      ),
      ...i,
      children: s
    }
  );
}), te = p.forwardRef(function({ className: a, as: r = "h3", children: s, ...i }, n) {
  return /* @__PURE__ */ t.jsx(
    r,
    {
      ref: n,
      className: u(
        "text-lg font-semibold leading-tight text-text-primary",
        a
      ),
      ...i,
      children: s
    }
  );
}), He = p.forwardRef(function({ className: a, children: r, ...s }, i) {
  return /* @__PURE__ */ t.jsx(
    "p",
    {
      ref: i,
      className: u("text-sm text-text-secondary", a),
      ...s,
      children: r
    }
  );
}), ae = p.forwardRef(function({ className: a, density: r = "comfortable", children: s, ...i }, n) {
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      ref: n,
      className: u(I[r], a),
      ...i,
      children: s
    }
  );
}), We = p.forwardRef(function({ className: a, density: r = "comfortable", children: s, ...i }, n) {
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      ref: n,
      className: u(
        "flex items-center justify-end gap-2",
        "border-t border-subtle bg-surface-sunken",
        I[r],
        a
      ),
      ...i,
      children: s
    }
  );
});
k.Header = ee;
k.Title = te;
k.Description = He;
k.Body = ae;
k.Footer = We;
function R({ className: e, width: a, height: r, rounded: s = "md", ...i }) {
  const n = {};
  return a !== void 0 && (n.width = typeof a == "number" ? `${a}px` : a), r !== void 0 && (n.height = typeof r == "number" ? `${r}px` : r), /* @__PURE__ */ t.jsx(
    "div",
    {
      "aria-busy": "true",
      "aria-live": "polite",
      className: u(
        "skeleton",
        s === "full" && "rounded-full",
        s === "sm" && "rounded-sm",
        s === "md" && "rounded-md",
        s === "lg" && "rounded-lg",
        e
      ),
      style: n,
      ...i
    }
  );
}
const Fe = q(
  u(
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
), Ke = {
  neutral: "bg-neutral-500",
  brand: "bg-brand-500",
  positive: "bg-positive-500",
  negative: "bg-negative-500",
  warning: "bg-warning-500",
  critical: "bg-critical-500",
  ai: "bg-ai-500"
};
function N({ variant: e = "neutral", size: a, withDot: r = !1, className: s, children: i, ...n }) {
  return /* @__PURE__ */ t.jsxs("span", { className: u(Fe({ variant: e, size: a }), s), ...n, children: [
    r && /* @__PURE__ */ t.jsx(
      "span",
      {
        className: u("inline-block h-1.5 w-1.5 rounded-full", Ke[e]),
        "aria-hidden": "true"
      }
    ),
    i
  ] });
}
const H = {
  light: "Açık tema (Sıradaki: Koyu)",
  dark: "Koyu tema (Sıradaki: Sistem)",
  system: "Sistem teması (Sıradaki: Açık)"
};
function Ge({ className: e = "" }) {
  const { preference: a, toggle: r } = ge();
  return /* @__PURE__ */ t.jsxs(
    "button",
    {
      type: "button",
      onClick: r,
      "aria-label": H[a] ?? "Tema değiştir",
      title: H[a] ?? "Tema değiştir",
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
        a === "light" && /* @__PURE__ */ t.jsx(Oe, {}),
        a === "dark" && /* @__PURE__ */ t.jsx($e, {}),
        a === "system" && /* @__PURE__ */ t.jsx(qe, {})
      ]
    }
  );
}
function Oe() {
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
function $e() {
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
function qe() {
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
const re = {
  /* react-grid-layout drag handle'ı için class — yalnızca header'dan sürüklenir,
     body'den sürüklendiğinde widget içindeki interactive element'leri tetiklemez. */
  DRAG_HANDLE_CLASS: "widget-drag-handle"
};
function j({
  title: e,
  subtitle: a,
  badge: r,
  actions: s,
  /* sağ üstteki action button'lar */
  isLoading: i = !1,
  isError: n = !1,
  errorMessage: c,
  onRetry: d,
  isEmpty: m = !1,
  emptyMessage: l = "Görüntülenecek veri yok.",
  density: o = "compact",
  children: h,
  className: v
}) {
  return /* @__PURE__ */ t.jsxs(k, { variant: "default", className: u("h-full flex flex-col", v), children: [
    /* @__PURE__ */ t.jsxs(
      ee,
      {
        density: o,
        className: u(
          /* Header drag-handle olur — sadece BURASI sürüklenir */
          re.DRAG_HANDLE_CLASS,
          "cursor-grab active:cursor-grabbing select-none",
          "flex-row items-center justify-between flex-none"
        ),
        children: [
          /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0 flex-1", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ t.jsx(te, { className: "text-sm font-semibold truncate", children: e }),
              r
            ] }),
            a && /* @__PURE__ */ t.jsx("p", { className: "text-xs text-text-tertiary truncate", children: a })
          ] }),
          s && /* Action button'ların onClick'leri drag'i tetiklemesin diye stopPropagation */
          /* @__PURE__ */ t.jsx(
            "div",
            {
              className: "flex items-center gap-1 flex-none",
              onMouseDown: (g) => g.stopPropagation(),
              onTouchStart: (g) => g.stopPropagation(),
              children: s
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ t.jsxs(ae, { density: o, className: "flex-1 overflow-auto", children: [
      n && /* @__PURE__ */ t.jsx(Qe, { message: c, onRetry: d }),
      !n && i && /* @__PURE__ */ t.jsx(Ye, { density: o }),
      !n && !i && m && /* @__PURE__ */ t.jsx(Ve, { message: l }),
      !n && !i && !m && h
    ] })
  ] });
}
function Ye({ density: e }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3", "aria-busy": "true", children: [
    /* @__PURE__ */ t.jsx(R, { height: e === "spacious" ? 48 : 32, className: "w-1/3" }),
    /* @__PURE__ */ t.jsx(R, { height: 16 }),
    /* @__PURE__ */ t.jsx(R, { height: 16, className: "w-5/6" }),
    /* @__PURE__ */ t.jsx(R, { height: 16, className: "w-3/4" })
  ] });
}
function Qe({ message: e, onRetry: a }) {
  return /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col items-center justify-center text-center gap-2 py-4", children: [
    /* @__PURE__ */ t.jsx(N, { variant: "negative", withDot: !0, children: "Yüklenemedi" }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-secondary max-w-xs", children: e || "Veri alınırken bir hata oluştu." }),
    a && /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: a,
        className: u(
          "text-sm text-text-link underline-offset-2 hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: "Tekrar dene"
      }
    )
  ] });
}
function Ve({ message: e }) {
  return /* @__PURE__ */ t.jsx("div", { className: "flex flex-col items-center justify-center text-center gap-1 py-6", children: /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: e }) });
}
j.DRAG_HANDLE_CLASS = re.DRAG_HANDLE_CLASS;
const W = 250, Je = 450;
function b(e = W + Math.random() * (Je - W)) {
  return new Promise((a) => setTimeout(a, e));
}
const y = {
  async budgetSummary() {
    return await b(), {
      spent: 1847500,
      budget: 24e5,
      currency: "TRY",
      deltaPct: -8.4,
      breakdown: [
        { project: "KOSGEB Ar-Ge", spent: 72e4, budget: 9e5, ratio: 0.8 },
        { project: "TÜBİTAK 1501", spent: 54e4, budget: 8e5, ratio: 0.68 },
        { project: "Dijitalleşme Hibesi", spent: 387500, budget: 45e4, ratio: 0.86 },
        { project: "İhracat Geliştirme", spent: 2e5, budget: 25e4, ratio: 0.8 }
      ]
    };
  },
  async cashFlow() {
    return await b(), {
      currency: "TRY",
      netCurrent: 487300,
      deltaPct: 12.4,
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
  },
  async pendingApprovals() {
    return await b(), [
      { id: "inv-001", type: "invoice", title: "TÜBİTAK 1501 — Eylül faturası", requester: "Ahmet Yıldız", amount: 12450, currency: "TRY", ageHours: 4 },
      { id: "exp-002", type: "expense", title: "Yazılım lisansı — JetBrains All", requester: "Mehmet Kaya", amount: 8240, currency: "TRY", ageHours: 18 },
      { id: "po-003", type: "po", title: "Bulut hosting (Q3 yenileme)", requester: "Zeynep Aksoy", amount: 24900, currency: "TRY", ageHours: 36 },
      { id: "inv-004", type: "invoice", title: "KOSGEB danışmanlık — Ağustos", requester: "Selin Aydın", amount: 6800, currency: "TRY", ageHours: 52 }
    ];
  },
  async approveItem(e) {
    if (await b(600), Math.random() < 0.05) {
      const a = new Error("Bu kayıt başka bir kullanıcı tarafından onaylanmış.");
      throw a.status = 409, a;
    }
    return { id: e.id, status: "approved" };
  },
  async rejectItem(e) {
    return await b(400), { id: e.id, status: "rejected" };
  },
  async riskAlerts() {
    return await b(), [
      {
        id: "r-001",
        severity: "critical",
        confidence: 92,
        confidenceLabel: "Yüksek",
        title: "KOSGEB Ar-Ge projesi 14 gün içinde teslim — kritik yol kaymış",
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
        confidence: 74,
        confidenceLabel: "Orta",
        title: "Dijitalleşme bütçesi %86 — kalan 2 ay yetmeyebilir",
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
        confidence: 88,
        confidenceLabel: "Yüksek",
        title: "Yeni hibe çağrısı: TÜBİTAK 1505 firma profilinizle %88 uyumlu",
        reasons: [
          "NACE sektörü uyumlu",
          "Çalışan sayısı eşleşiyor",
          "Önceki başarılı projeniz 1501 → 1505 kombinasyonu yaygın"
        ],
        suggestedAction: "Çağrıyı incele"
      }
    ];
  },
  async dismissRisk(e) {
    return await b(300), { id: e.id, dismissed: !0 };
  },
  async acceptRisk(e) {
    return await b(500), { id: e.id, accepted: !0 };
  }
}, Ze = () => y.budgetSummary();
function Xe() {
  return C({
    queryKey: x.dashboard.budget(),
    queryFn: Ze
  });
}
function Ue() {
  const { data: e, isLoading: a, isError: r, refetch: s } = Xe(), i = () => s(), n = e ? e.spent / e.budget * 100 : 0, c = F(n), d = e ? U(e.deltaPct) : null;
  return /* @__PURE__ */ t.jsx(
    j,
    {
      title: "Bütçe Sağlığı",
      subtitle: "Tüm aktif projeler — bu ay",
      badge: /* @__PURE__ */ t.jsx(N, { variant: c.badgeVariant, size: "sm", withDot: !0, children: c.label }),
      isLoading: a,
      isError: r,
      onRetry: i,
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-3 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-baseline gap-2 font-tabular", children: [
          /* @__PURE__ */ t.jsx("span", { className: "text-3xl font-semibold tracking-tight", children: M(e.spent, e.currency) }),
          /* @__PURE__ */ t.jsxs("span", { className: "text-sm text-text-tertiary", children: [
            "/ ",
            M(e.budget, e.currency)
          ] })
        ] }),
        d && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1.5 text-xs", children: [
          /* @__PURE__ */ t.jsxs("span", { className: u(
            "inline-flex items-center gap-1 font-medium font-tabular",
            /* delta < 0 = harcama düşmüş = pozitif sinyal */
            e.deltaPct < 0 ? "text-text-positive" : "text-text-negative"
          ), children: [
            d.symbol,
            " ",
            d.text
          ] }),
          /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: "geçen aya göre" })
        ] }),
        /* @__PURE__ */ t.jsx(et, { value: n, variant: c.barVariant }),
        /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-1.5 mt-1 overflow-y-auto", children: e.breakdown.map((m) => /* @__PURE__ */ t.jsxs(
          "li",
          {
            className: "flex items-center justify-between text-xs gap-3",
            children: [
              /* @__PURE__ */ t.jsx("span", { className: "truncate text-text-secondary", children: m.project }),
              /* @__PURE__ */ t.jsxs("span", { className: u(
                "font-tabular font-medium",
                F(m.ratio * 100).textVariant
              ), children: [
                Math.round(m.ratio * 100),
                "%"
              ] })
            ]
          },
          m.project
        )) })
      ] })
    }
  );
}
function F(e) {
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
function et({ value: e, variant: a = "positive" }) {
  const r = {
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
          className: u(
            r,
            "h-full rounded-full transition-all duration-slow ease-standard"
          ),
          style: { width: `${Math.min(e, 100)}%` }
        }
      )
    }
  );
}
const tt = () => y.cashFlow();
function at() {
  return C({
    queryKey: x.dashboard.cashflow(),
    queryFn: tt
  });
}
function rt() {
  const { data: e, isLoading: a, isError: r, refetch: s } = at(), i = () => s(), n = e ? U(e.deltaPct) : null, c = e ? e.deltaPct >= 0 : !0;
  return /* @__PURE__ */ t.jsx(
    j,
    {
      title: "Nakit Akışı",
      subtitle: "Son 30 gün",
      isLoading: a,
      isError: r,
      onRetry: i,
      children: e && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-4 h-full", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 flex-none", children: [
          /* @__PURE__ */ t.jsx("div", { className: "text-2xl font-semibold tracking-tight font-tabular", children: M(e.netCurrent, e.currency) }),
          n && /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 text-xs", children: [
            /* @__PURE__ */ t.jsxs("span", { className: u(
              "inline-flex items-center gap-1 font-medium font-tabular",
              c ? "text-text-positive" : "text-text-negative"
            ), children: [
              n.symbol,
              " ",
              n.text
            ] }),
            /* @__PURE__ */ t.jsx("span", { className: "text-text-tertiary", children: "vs önceki dönem" })
          ] })
        ] }),
        /* @__PURE__ */ t.jsx("div", { className: "flex-1 min-w-0 h-full max-h-16", children: /* @__PURE__ */ t.jsx(st, { series: e.series, variant: c ? "positive" : "negative" }) })
      ] })
    }
  );
}
function st({ series: e, variant: a = "positive" }) {
  const s = `cashflow-grad-${f.useId().replace(/:/g, "")}`;
  if (!e || e.length < 2) return null;
  const i = 100, n = 40, c = Math.min(...e), m = Math.max(...e) - c || 1, o = e.map((g, S) => {
    const A = S / (e.length - 1) * i, ie = n - (g - c) / m * n;
    return [A, ie];
  }).map(([g, S], A) => `${A === 0 ? "M" : "L"} ${g.toFixed(2)} ${S.toFixed(2)}`).join(" "), h = `${o} L ${i} ${n} L 0 ${n} Z`, v = a === "positive" ? "var(--apya-positive-500)" : "var(--apya-negative-500)";
  return /* @__PURE__ */ t.jsxs(
    "svg",
    {
      viewBox: `0 0 ${i} ${n}`,
      preserveAspectRatio: "none",
      className: "w-full h-full",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ t.jsx("defs", { children: /* @__PURE__ */ t.jsxs("linearGradient", { id: s, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ t.jsx("stop", { offset: "0%", stopColor: v, stopOpacity: "0.25" }),
          /* @__PURE__ */ t.jsx("stop", { offset: "100%", stopColor: v, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ t.jsx("path", { d: h, fill: `url(#${s})` }),
        /* @__PURE__ */ t.jsx(
          "path",
          {
            d: o,
            fill: "none",
            stroke: v,
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
const nt = () => y.pendingApprovals();
function it() {
  return C({
    queryKey: x.dashboard.approvals(),
    queryFn: nt
  });
}
function se(e) {
  const a = P();
  return O({
    mutationFn: e,
    onMutate: async (r) => {
      await a.cancelQueries({ queryKey: x.dashboard.approvals() });
      const s = a.getQueryData(x.dashboard.approvals());
      return a.setQueryData(
        x.dashboard.approvals(),
        (i = []) => i.filter((n) => n.id !== r.id)
      ), { previous: s, item: r };
    },
    onError: (r, s, i) => {
      i != null && i.previous && a.setQueryData(x.dashboard.approvals(), i.previous);
    },
    onSettled: () => {
      a.invalidateQueries({ queryKey: x.dashboard.approvals() }), a.invalidateQueries({ queryKey: x.dashboard.budget() }), a.invalidateQueries({ queryKey: x.dashboard.cashflow() });
    }
  });
}
function ot() {
  return se((e) => y.approveItem(e));
}
function lt() {
  return se((e) => y.rejectItem(e));
}
const K = {
  invoice: { label: "Fatura", variant: "brand" },
  expense: { label: "Masraf", variant: "neutral" },
  po: { label: "Sipariş", variant: "ai" }
};
function ct() {
  const { data: e, isLoading: a, isError: r, refetch: s } = it(), i = ot(), n = lt(), c = () => s(), d = (o) => i.mutateAsync(o).catch(() => {
  }), m = (o) => n.mutateAsync(o).catch(() => {
  }), l = (e == null ? void 0 : e.length) ?? 0;
  return /* @__PURE__ */ t.jsx(
    j,
    {
      title: "Onay Bekleyenler",
      subtitle: l > 0 ? `${l} kalem inceleme bekliyor` : void 0,
      badge: l > 0 && /* @__PURE__ */ t.jsx(N, { variant: "warning", size: "sm", withDot: !0, children: l }),
      isLoading: a,
      isError: r,
      onRetry: c,
      isEmpty: !a && !r && l === 0,
      emptyMessage: "🎉 Bekleyen onay yok.",
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: e == null ? void 0 : e.map((o) => /* @__PURE__ */ t.jsx(
        dt,
        {
          item: o,
          onApprove: d,
          onReject: m
        },
        o.id
      )) })
    }
  );
}
function dt({ item: e, onApprove: a, onReject: r }) {
  const [s, i] = p.useState(null), n = K[e.type] ?? K.expense, c = ut(e.ageHours), d = async (m, l) => {
    if (!s) {
      i(m);
      try {
        await (l == null ? void 0 : l(e));
      } finally {
        i(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsxs("li", { className: u(
    "flex items-center gap-3 p-2.5 rounded-md",
    "bg-surface-base border border-subtle",
    "transition-opacity duration-fast",
    s && "opacity-60"
  ), children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-col gap-1 min-w-0 flex-1", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(N, { variant: n.variant, size: "sm", children: n.label }),
        /* @__PURE__ */ t.jsxs("span", { className: "text-xs text-text-tertiary truncate", children: [
          e.requester,
          " · ",
          c
        ] })
      ] }),
      /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary truncate", children: e.title })
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "font-tabular font-semibold text-sm text-text-primary flex-none", children: Pe(e.amount, e.currency) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-1 flex-none", children: [
      /* @__PURE__ */ t.jsx(
        w,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => d("reject", r),
          isLoading: s === "reject",
          "aria-label": `${e.title} reddet`,
          className: "text-text-negative hover:bg-negative-50 hover:text-negative-700",
          children: "Reddet"
        }
      ),
      /* @__PURE__ */ t.jsx(
        w,
        {
          size: "sm",
          variant: "primary",
          onClick: () => d("approve", a),
          isLoading: s === "approve",
          "aria-label": `${e.title} onayla`,
          children: "Onayla"
        }
      )
    ] })
  ] });
}
function ut(e) {
  return e < 1 ? "az önce" : e < 24 ? `${Math.round(e)} sa önce` : `${Math.floor(e / 24)} gün önce`;
}
const mt = () => y.riskAlerts();
function ft() {
  return C({
    queryKey: x.dashboard.risks(),
    queryFn: mt
  });
}
function ne(e) {
  const a = P();
  return O({
    mutationFn: e,
    onMutate: async (r) => {
      await a.cancelQueries({ queryKey: x.dashboard.risks() });
      const s = a.getQueryData(x.dashboard.risks());
      return a.setQueryData(
        x.dashboard.risks(),
        (i = []) => i.filter((n) => n.id !== r.id)
      ), { previous: s };
    },
    onError: (r, s, i) => {
      i != null && i.previous && a.setQueryData(x.dashboard.risks(), i.previous);
    },
    onSettled: () => {
      a.invalidateQueries({ queryKey: x.dashboard.risks() });
    }
  });
}
function xt() {
  return ne((e) => y.dismissRisk(e));
}
function ht() {
  return ne((e) => y.acceptRisk(e));
}
const T = {
  critical: { label: "Kritik", variant: "critical", priority: 0 },
  actionable: { label: "Eyleme açık", variant: "warning", priority: 1 },
  info: { label: "Bilgi", variant: "ai", priority: 2 }
};
function pt() {
  const { data: e, isLoading: a, isError: r, refetch: s } = ft(), i = xt(), n = ht(), c = () => s(), d = (o) => i.mutateAsync(o).catch(() => {
  }), m = (o) => n.mutateAsync(o).catch(() => {
  }), l = p.useMemo(
    () => [...e ?? []].sort(
      (o, h) => T[o.severity].priority - T[h.severity].priority
    ),
    [e]
  );
  return /* @__PURE__ */ t.jsx(
    j,
    {
      title: "Risk Uyarıları",
      subtitle: "AI öneri motoru",
      badge: /* @__PURE__ */ t.jsx(N, { variant: "ai", size: "sm", withDot: !0, children: "AI" }),
      isLoading: a,
      isError: r,
      onRetry: c,
      isEmpty: !a && !r && l.length === 0,
      emptyMessage: "Şu an risk yok — AI motoru tarama tamamladı.",
      children: /* @__PURE__ */ t.jsx("ul", { className: "flex flex-col gap-2 h-full overflow-y-auto", children: l.map((o) => /* @__PURE__ */ t.jsx(
        gt,
        {
          risk: o,
          onAccept: m,
          onDismiss: d
        },
        o.id
      )) })
    }
  );
}
function gt({ risk: e, onAccept: a, onDismiss: r }) {
  const [s, i] = p.useState(!1), [n, c] = p.useState(null), d = T[e.severity], m = async (l, o) => {
    if (!n) {
      c(l);
      try {
        await (o == null ? void 0 : o(e));
      } finally {
        c(null);
      }
    }
  };
  return /* @__PURE__ */ t.jsx("li", { className: u(
    "rounded-md border bg-surface-base",
    "transition-opacity duration-fast",
    e.severity === "critical" && "border-critical-50 bg-critical-50",
    e.severity === "actionable" && "border-warning-100",
    e.severity === "info" && "border-subtle",
    n && "opacity-60"
  ), children: /* @__PURE__ */ t.jsxs("div", { className: "p-2.5 flex flex-col gap-2", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ t.jsx(N, { variant: d.variant, size: "sm", withDot: !0, children: d.label }),
      /* @__PURE__ */ t.jsx(bt, { score: e.confidence, label: e.confidenceLabel })
    ] }),
    /* @__PURE__ */ t.jsx("p", { className: "text-sm font-medium text-text-primary leading-snug", children: e.title }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        onClick: () => i((l) => !l),
        "aria-expanded": s,
        className: u(
          "self-start text-xs text-text-link hover:underline",
          "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
        ),
        children: s ? "Açıklamayı gizle" : "Neden bu öneri?"
      }
    ),
    s && /* @__PURE__ */ t.jsx("ul", { className: "text-xs text-text-secondary list-disc pl-5 space-y-1", children: e.reasons.map((l, o) => /* @__PURE__ */ t.jsx("li", { children: l }, o)) }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-end gap-1 mt-1", children: [
      /* @__PURE__ */ t.jsx(
        w,
        {
          size: "sm",
          variant: "ghost",
          onClick: () => m("dismiss", r),
          isLoading: n === "dismiss",
          children: "Şimdi değil"
        }
      ),
      /* @__PURE__ */ t.jsx(
        w,
        {
          size: "sm",
          variant: e.severity === "critical" ? "destructive" : "primary",
          onClick: () => m("accept", a),
          isLoading: n === "accept",
          children: e.suggestedAction
        }
      )
    ] })
  ] }) });
}
function bt({ score: e, label: a }) {
  const r = Math.max(0, Math.min(5, Math.round(e / 100 * 5)));
  return /* @__PURE__ */ t.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1 text-xs text-text-tertiary",
      title: `Güven: %${e}`,
      children: [
        /* @__PURE__ */ t.jsxs("span", { className: "font-tabular tracking-wider", "aria-hidden": "true", children: [
          "●".repeat(r),
          /* @__PURE__ */ t.jsx("span", { className: "text-text-disabled", children: "○".repeat(5 - r) })
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
const yt = B.WidthProvider(B.Responsive), vt = {
  "budget-health": Ue,
  "cash-flow": rt,
  "pending-approvals": ct,
  "risk-alerts": pt
};
function wt() {
  const [e, a] = f.useState(() => De()), [r, s] = f.useState(!1), i = f.useMemo(() => {
    const o = _[e] ?? _.cfo, h = _e(e);
    return h ? { ...o, ...h } : o;
  }, [e]), n = f.useCallback((o) => {
    a(o), Le(o);
  }, []), c = f.useCallback(
    (o, h) => {
      r && Me(e, h);
    },
    [r, e]
  ), d = f.useCallback(() => {
    Te(e), a(e);
  }, [e]), l = (i.desktop ?? []).map((o) => o.i);
  return /* @__PURE__ */ t.jsxs("div", { className: "min-h-screen bg-surface-base text-text-primary", children: [
    /* @__PURE__ */ t.jsx(
      jt,
      {
        persona: e,
        onPersonaChange: n,
        editMode: r,
        onEditModeToggle: () => s((o) => !o),
        onReset: d
      }
    ),
    /* @__PURE__ */ t.jsx("main", { className: "px-4 py-4 mobile:px-2 mobile:py-2", children: /* @__PURE__ */ t.jsx(
      yt,
      {
        className: u("apya-bento", r && "apya-bento--edit"),
        layouts: i,
        breakpoints: Ae,
        cols: Re,
        rowHeight: Ee,
        margin: Ce,
        isDraggable: r,
        isResizable: r,
        draggableHandle: `.${j.DRAG_HANDLE_CLASS}`,
        onLayoutChange: c,
        compactType: "vertical",
        preventCollision: !1,
        children: l.map((o) => {
          const h = vt[o];
          return h ? /* @__PURE__ */ t.jsx("div", { className: "apya-bento-item", children: /* @__PURE__ */ t.jsx(h, {}) }, o) : /* @__PURE__ */ t.jsx("div", { children: /* @__PURE__ */ t.jsx(j, { title: `Bilinmeyen widget: ${o}` }) }, o);
        })
      }
    ) }),
    r && /* @__PURE__ */ t.jsxs(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        className: u(
          "fixed bottom-4 left-1/2 -translate-x-1/2 z-toast",
          "bg-surface-inverse text-text-inverse text-sm",
          "px-4 py-2 rounded-md shadow-lg",
          "flex items-center gap-3"
        ),
        children: [
          /* @__PURE__ */ t.jsx("span", { children: "Düzenleme modu — widget'ları sürükleyip yeniden boyutlandırabilirsin" }),
          /* @__PURE__ */ t.jsx(
            w,
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
function jt({ persona: e, onPersonaChange: a, editMode: r, onEditModeToggle: s, onReset: i }) {
  return /* @__PURE__ */ t.jsxs("header", { className: u(
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
        Z[e],
        " görünümü"
      ] })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 flex-none", children: [
      /* @__PURE__ */ t.jsx(kt, { value: e, onChange: a }),
      r ? /* @__PURE__ */ t.jsx(
        w,
        {
          size: "sm",
          variant: "secondary",
          onClick: i,
          title: "Layout'u persona varsayılanına döndür",
          children: "Sıfırla"
        }
      ) : null,
      /* @__PURE__ */ t.jsx(
        w,
        {
          size: "sm",
          variant: r ? "primary" : "secondary",
          onClick: s,
          children: r ? "Tamamla" : "Düzenle"
        }
      ),
      /* @__PURE__ */ t.jsx(Ge, {})
    ] })
  ] });
}
function kt({ value: e, onChange: a }) {
  return /* @__PURE__ */ t.jsxs("label", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ t.jsx("span", { className: "sr-only", children: "Persona seç" }),
    /* @__PURE__ */ t.jsx(
      "select",
      {
        value: e,
        onChange: (r) => a(r.target.value),
        className: u(
          "h-10 px-3 text-sm rounded-md",
          "bg-surface-base text-text-primary",
          "border border-default",
          "hover:border-strong",
          "focus-visible:outline-none focus-visible:shadow-focus",
          "transition-colors duration-fast"
        ),
        children: Object.entries(Z).map(([r, s]) => /* @__PURE__ */ t.jsx("option", { value: r, children: s }, r))
      }
    )
  ] });
}
function Nt(e) {
  const { connection: a, state: r } = je(), s = P();
  f.useEffect(() => {
    if (!a || !(e != null && e.length)) return;
    const i = e.map(([n, c]) => {
      const d = () => {
        c.forEach((m) => {
          s.invalidateQueries({ queryKey: m });
        });
      };
      return a.on(n, d), [n, d];
    });
    return () => {
      i.forEach(([n, c]) => {
        a.off(n, c);
      });
    };
  }, [a, r, s]);
}
function St() {
  const e = f.useMemo(() => [
    ["JournalEntryPosted", [x.dashboard.budget(), x.dashboard.cashflow()]],
    ["ApprovalDecided", [x.dashboard.approvals(), x.dashboard.budget(), x.dashboard.cashflow()]],
    ["RiskDetected", [x.dashboard.risks()]],
    ["RiskDismissed", [x.dashboard.risks()]]
  ], []);
  return Nt(e), null;
}
function At({ onUpdate: e, onReady: a } = {}) {
  typeof window > "u" || !("serviceWorker" in navigator) || (window.addEventListener("beforeinstallprompt", (r) => {
    r.preventDefault(), window.__apyaInstallPrompt = r;
  }), window.addEventListener("load", async () => {
    try {
      const r = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      r.waiting && (e == null || e(r)), r.addEventListener("updatefound", () => {
        const s = r.installing;
        s && s.addEventListener("statechange", () => {
          s.state === "installed" && navigator.serviceWorker.controller ? e == null || e(r) : s.state === "activated" && (a == null || a(r));
        });
      }), a == null || a(r);
    } catch (r) {
      console.warn("[SW] register failed:", r == null ? void 0 : r.message);
    }
  }));
}
At();
const G = document.getElementById("apya-dashboard-root");
G && oe(G).render(
  /* @__PURE__ */ t.jsx(pe, { children: /* @__PURE__ */ t.jsx(ve, { children: /* @__PURE__ */ t.jsxs(we, { children: [
    /* @__PURE__ */ t.jsx(St, {}),
    /* @__PURE__ */ t.jsx(wt, {})
  ] }) }) })
);
