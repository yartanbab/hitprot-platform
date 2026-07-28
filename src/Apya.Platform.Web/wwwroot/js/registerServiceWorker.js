import { r as u, j as s, d as k } from "./react-vendor.js";
import { Q as j, c as C } from "./query-vendor.js";
import { A as T } from "./httpClient.js";
import { c as f, t as x } from "./Sheet.js";
function N() {
  return new j({
    defaultOptions: {
      queries: {
        staleTime: 3e4,
        gcTime: 5 * 6e4,
        refetchOnWindowFocus: !0,
        refetchOnReconnect: !0,
        retry: (e, n) => n instanceof T && n.status >= 400 && n.status < 500 ? !1 : e < 2
      },
      mutations: {
        /* Mutation default'ta retry YAPMAZ — duplicate finansal işlem riski. */
        retry: !1
      }
    }
  });
}
const Q = {
  dashboard: {
    budget: () => ["dashboard", "budget"],
    cashflow: () => ["dashboard", "cashflow"],
    kpiSummary: () => ["dashboard", "kpi-summary"],
    incomeExpense: () => ["dashboard", "income-expense"],
    approvals: (e) => e ? ["dashboard", "approvals", e] : ["dashboard", "approvals"],
    approvalDetail: (e) => ["dashboard", "approval-detail", e],
    risks: () => ["dashboard", "risks"],
    aiSuggestions: (e) => e ? ["dashboard", "ai-suggestions", e] : ["dashboard", "ai-suggestions"]
  }
};
function D({ children: e }) {
  const [n] = u.useState(() => N());
  return /* @__PURE__ */ s.jsx(C, { client: n, children: e });
}
const b = u.createContext(null), g = {
  info: { ring: "border-default", icon: "text-text-secondary", accent: "bg-brand-500" },
  success: { ring: "border-positive-100", icon: "text-text-positive", accent: "bg-positive-500" },
  warning: { ring: "border-warning-100", icon: "text-text-warning", accent: "bg-warning-500" },
  error: { ring: "border-negative-100", icon: "text-text-negative", accent: "bg-negative-500" }
}, A = 4e3, E = 1e4;
let S = 0;
function W({ children: e }) {
  const [n, t] = u.useState([]), a = u.useRef(/* @__PURE__ */ new Map()), c = u.useCallback((r) => {
    const i = a.current.get(r);
    i && (clearTimeout(i), a.current.delete(r)), t((d) => d.filter((m) => m.id !== r));
  }, []), o = u.useCallback((r) => {
    const i = ++S, d = {
      id: i,
      type: r.type ?? "info",
      message: r.message ?? "",
      description: r.description,
      action: r.action,
      /* { label, onClick } */
      duration: r.duration ?? (r.action ? E : A)
    };
    if (t((m) => [...m, d]), d.duration > 0) {
      const m = setTimeout(() => c(i), d.duration);
      a.current.set(i, m);
    }
    return i;
  }, [c]);
  u.useEffect(() => () => {
    a.current.forEach(clearTimeout), a.current.clear();
  }, []);
  const l = k.useMemo(() => ({
    show: o,
    dismiss: c,
    info: (r, i = {}) => o({ ...i, type: "info", message: r }),
    success: (r, i = {}) => o({ ...i, type: "success", message: r }),
    warning: (r, i = {}) => o({ ...i, type: "warning", message: r }),
    error: (r, i = {}) => o({ ...i, type: "error", message: r })
  }), [o, c]);
  return /* @__PURE__ */ s.jsxs(b.Provider, { value: l, children: [
    e,
    /* @__PURE__ */ s.jsx(M, { items: n.slice(-3), onDismiss: c })
  ] });
}
function M({ items: e, onDismiss: n }) {
  return e.length === 0 ? null : /* @__PURE__ */ s.jsx(
    "div",
    {
      role: "region",
      "aria-label": "Bildirimler",
      className: f(
        "fixed bottom-4 right-4 z-toast",
        "flex flex-col-reverse gap-2",
        "pointer-events-none",
        /* viewport tıklamaları geçirir; tek tek toast'lar pointer-auto */
        "max-w-[calc(100vw-2rem)]"
      ),
      children: e.map((t) => /* @__PURE__ */ s.jsx(L, { item: t, onDismiss: n }, t.id))
    }
  );
}
function L({ item: e, onDismiss: n }) {
  const t = g[e.type] ?? g.info, a = e.type === "error" ? "assertive" : "polite", c = () => {
    var o, l;
    try {
      (l = (o = e.action) == null ? void 0 : o.onClick) == null || l.call(o);
    } finally {
      n(e.id);
    }
  };
  return /* @__PURE__ */ s.jsxs(
    "div",
    {
      role: e.type === "error" ? "alert" : "status",
      "aria-live": a,
      className: f(
        "pointer-events-auto",
        "flex items-stretch gap-0",
        "min-w-[280px] max-w-[420px]",
        "bg-surface-raised border rounded-md shadow-lg",
        "animate-sheet-bottom",
        t.ring
      ),
      children: [
        /* @__PURE__ */ s.jsx("span", { className: f("w-1 flex-none rounded-l-md", t.accent), "aria-hidden": "true" }),
        /* @__PURE__ */ s.jsxs("div", { className: "flex-1 min-w-0 px-3 py-2.5 flex items-start gap-2", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-0.5", children: [
            /* @__PURE__ */ s.jsx("p", { className: "text-sm font-medium text-text-primary truncate", children: e.message }),
            e.description && /* @__PURE__ */ s.jsx("p", { className: "text-xs text-text-tertiary line-clamp-2", children: e.description })
          ] }),
          e.action && /* @__PURE__ */ s.jsx(
            "button",
            {
              type: "button",
              onClick: c,
              className: f(
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
              onClick: () => n(e.id),
              "aria-label": "Bildirimi kapat",
              className: f(
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
function z() {
  const e = u.useContext(b);
  if (!e)
    throw new Error("useToast must be used within <ToastProvider>.");
  return e;
}
const h = {
  sm: { dot: "h-1 w-1", gap: "gap-0.5" },
  md: { dot: "h-1.5 w-1.5", gap: "gap-0.5" },
  lg: { dot: "h-2 w-2", gap: "gap-1" }
};
function v(e) {
  return typeof e != "number" || !Number.isFinite(e) ? 0 : e > 1 ? Math.max(0, Math.min(100, e)) / 100 : Math.max(0, Math.min(1, e));
}
function w(e) {
  return e >= 0.85 ? { dots: 5, label: x("Ai:Confidence:VeryHigh", "Çok yüksek güven") } : e >= 0.7 ? { dots: 4, label: x("Ai:Confidence:High", "Yüksek güven") } : e >= 0.5 ? { dots: 3, label: x("Ai:Confidence:Medium", "Orta güven") } : e >= 0.3 ? { dots: 2, label: x("Ai:Confidence:Low", "Düşük güven") } : { dots: 1, label: x("Ai:Confidence:VeryLow", "Çok düşük güven") };
}
function y({ score: e, label: n, size: t = "md", showLabel: a = !0, className: c }) {
  const o = v(e), l = w(o), r = h[t] ?? h.md, i = n ?? l.label, d = Math.round(o * 100);
  return /* @__PURE__ */ s.jsxs(
    "span",
    {
      className: f("inline-flex items-center gap-1 text-xs text-text-tertiary", c),
      title: `${l.label} (%${d})`,
      children: [
        /* @__PURE__ */ s.jsx("span", { className: f("inline-flex items-center", r.gap), "aria-hidden": "true", children: Array.from({ length: 5 }, (m, p) => /* @__PURE__ */ s.jsx(
          "span",
          {
            className: f(
              "inline-block rounded-full",
              r.dot,
              p < l.dots ? "bg-ai-500" : "bg-neutral-200"
            )
          },
          p
        )) }),
        a && /* @__PURE__ */ s.jsx("span", { "aria-hidden": "true", children: i }),
        /* @__PURE__ */ s.jsxs("span", { className: "sr-only", children: [
          "Güven düzeyi: ",
          l.label,
          " (%",
          d,
          ")"
        ] })
      ]
    }
  );
}
y.bandFor = w;
y.normalize = v;
function F({ onUpdate: e, onReady: n } = {}) {
  typeof window > "u" || !("serviceWorker" in navigator) || (window.addEventListener("beforeinstallprompt", (t) => {
    t.preventDefault(), window.__apyaInstallPrompt = t;
  }), window.addEventListener("load", async () => {
    try {
      const t = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      t.waiting && (e == null || e(t)), t.addEventListener("updatefound", () => {
        const a = t.installing;
        a && a.addEventListener("statechange", () => {
          a.state === "installed" && navigator.serviceWorker.controller ? e == null || e(t) : a.state === "activated" && (n == null || n(t));
        });
      }), n == null || n(t);
    } catch (t) {
      console.warn("[SW] register failed:", t == null ? void 0 : t.message);
    }
  }));
}
export {
  y as C,
  Q,
  W as T,
  D as a,
  F as r,
  z as u
};
