import { r as f, d as j, j as r } from "./react-vendor.js";
import { c as u, t as m } from "./Dialog.js";
const b = f.createContext(null), p = {
  info: { ring: "border-default", icon: "text-text-secondary", accent: "bg-brand-500" },
  success: { ring: "border-positive-100", icon: "text-text-positive", accent: "bg-positive-500" },
  warning: { ring: "border-warning-100", icon: "text-text-warning", accent: "bg-warning-500" },
  error: { ring: "border-negative-100", icon: "text-text-negative", accent: "bg-negative-500" }
}, k = 4e3, N = 1e4;
let T = 0;
function S({ children: e }) {
  const [s, t] = f.useState([]), a = f.useRef(/* @__PURE__ */ new Map()), c = f.useCallback((n) => {
    const i = a.current.get(n);
    i && (clearTimeout(i), a.current.delete(n)), t((d) => d.filter((x) => x.id !== n));
  }, []), o = f.useCallback((n) => {
    const i = ++T, d = {
      id: i,
      type: n.type ?? "info",
      message: n.message ?? "",
      description: n.description,
      action: n.action,
      /* { label, onClick } */
      duration: n.duration ?? (n.action ? N : k)
    };
    if (t((x) => [...x, d]), d.duration > 0) {
      const x = setTimeout(() => c(i), d.duration);
      a.current.set(i, x);
    }
    return i;
  }, [c]);
  f.useEffect(() => () => {
    a.current.forEach(clearTimeout), a.current.clear();
  }, []);
  const l = j.useMemo(() => ({
    show: o,
    dismiss: c,
    info: (n, i = {}) => o({ ...i, type: "info", message: n }),
    success: (n, i = {}) => o({ ...i, type: "success", message: n }),
    warning: (n, i = {}) => o({ ...i, type: "warning", message: n }),
    error: (n, i = {}) => o({ ...i, type: "error", message: n })
  }), [o, c]);
  return /* @__PURE__ */ r.jsxs(b.Provider, { value: l, children: [
    e,
    /* @__PURE__ */ r.jsx(C, { items: s.slice(-3), onDismiss: c })
  ] });
}
function C({ items: e, onDismiss: s }) {
  return e.length === 0 ? null : /* @__PURE__ */ r.jsx(
    "div",
    {
      role: "region",
      "aria-label": "Bildirimler",
      className: u(
        "fixed bottom-4 right-4 z-toast",
        "flex flex-col-reverse gap-2",
        "pointer-events-none",
        /* viewport tıklamaları geçirir; tek tek toast'lar pointer-auto */
        "max-w-[calc(100vw-2rem)]"
      ),
      children: e.map((t) => /* @__PURE__ */ r.jsx(E, { item: t, onDismiss: s }, t.id))
    }
  );
}
function E({ item: e, onDismiss: s }) {
  const t = p[e.type] ?? p.info, a = e.type === "error" ? "assertive" : "polite", c = () => {
    var o, l;
    try {
      (l = (o = e.action) == null ? void 0 : o.onClick) == null || l.call(o);
    } finally {
      s(e.id);
    }
  };
  return /* @__PURE__ */ r.jsxs(
    "div",
    {
      role: e.type === "error" ? "alert" : "status",
      "aria-live": a,
      className: u(
        "pointer-events-auto",
        "flex items-stretch gap-0",
        "min-w-[280px] max-w-[420px]",
        "bg-surface-raised border rounded-md shadow-lg",
        "animate-sheet-bottom",
        t.ring
      ),
      children: [
        /* @__PURE__ */ r.jsx("span", { className: u("w-1 flex-none rounded-l-md", t.accent), "aria-hidden": "true" }),
        /* @__PURE__ */ r.jsxs("div", { className: "flex-1 min-w-0 px-3 py-2.5 flex items-start gap-2", children: [
          /* @__PURE__ */ r.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-0.5", children: [
            /* @__PURE__ */ r.jsx("p", { className: "text-sm font-medium text-text-primary truncate", children: e.message }),
            e.description && /* @__PURE__ */ r.jsx("p", { className: "text-xs text-text-tertiary line-clamp-2", children: e.description })
          ] }),
          e.action && /* @__PURE__ */ r.jsx(
            "button",
            {
              type: "button",
              onClick: c,
              className: u(
                "flex-none text-sm font-medium text-text-link",
                "hover:underline underline-offset-2",
                "focus-visible:outline-none focus-visible:shadow-focus rounded-sm"
              ),
              children: e.action.label
            }
          ),
          /* @__PURE__ */ r.jsx(
            "button",
            {
              type: "button",
              onClick: () => s(e.id),
              "aria-label": "Bildirimi kapat",
              className: u(
                "flex-none text-text-tertiary hover:text-text-primary",
                "focus-visible:outline-none focus-visible:shadow-focus rounded-sm",
                "h-5 w-5 inline-flex items-center justify-center"
              ),
              children: /* @__PURE__ */ r.jsx("span", { "aria-hidden": "true", children: "×" })
            }
          )
        ] })
      ]
    }
  );
}
function L() {
  const e = f.useContext(b);
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
  return e >= 0.85 ? { dots: 5, label: m("Ai:Confidence:VeryHigh", "Çok yüksek güven") } : e >= 0.7 ? { dots: 4, label: m("Ai:Confidence:High", "Yüksek güven") } : e >= 0.5 ? { dots: 3, label: m("Ai:Confidence:Medium", "Orta güven") } : e >= 0.3 ? { dots: 2, label: m("Ai:Confidence:Low", "Düşük güven") } : { dots: 1, label: m("Ai:Confidence:VeryLow", "Çok düşük güven") };
}
function y({ score: e, label: s, size: t = "md", showLabel: a = !0, className: c }) {
  const o = v(e), l = w(o), n = h[t] ?? h.md, i = s ?? l.label, d = Math.round(o * 100);
  return /* @__PURE__ */ r.jsxs(
    "span",
    {
      className: u("inline-flex items-center gap-1 text-xs text-text-tertiary", c),
      title: `${l.label} (%${d})`,
      children: [
        /* @__PURE__ */ r.jsx("span", { className: u("inline-flex items-center", n.gap), "aria-hidden": "true", children: Array.from({ length: 5 }, (x, g) => /* @__PURE__ */ r.jsx(
          "span",
          {
            className: u(
              "inline-block rounded-full",
              n.dot,
              g < l.dots ? "bg-ai-500" : "bg-neutral-200"
            )
          },
          g
        )) }),
        a && /* @__PURE__ */ r.jsx("span", { "aria-hidden": "true", children: i }),
        /* @__PURE__ */ r.jsxs("span", { className: "sr-only", children: [
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
function I({ onUpdate: e, onReady: s } = {}) {
  typeof window > "u" || !("serviceWorker" in navigator) || (window.addEventListener("beforeinstallprompt", (t) => {
    t.preventDefault(), window.__apyaInstallPrompt = t;
  }), window.addEventListener("load", async () => {
    try {
      const t = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      t.waiting && (e == null || e(t)), t.addEventListener("updatefound", () => {
        const a = t.installing;
        a && a.addEventListener("statechange", () => {
          a.state === "installed" && navigator.serviceWorker.controller ? e == null || e(t) : a.state === "activated" && (s == null || s(t));
        });
      }), s == null || s(t);
    } catch (t) {
      console.warn("[SW] register failed:", t == null ? void 0 : t.message);
    }
  }));
}
export {
  y as C,
  S as T,
  I as r,
  L as u
};
