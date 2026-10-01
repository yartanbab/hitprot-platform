import { r as l, b as g, j as s } from "./react-vendor-D7YDiBbi.js";
import { c as f } from "./Dialog-BEQtx1HL.js";
const p = l.createContext(null), m = {
  info: { ring: "border-default", icon: "text-text-secondary", accent: "bg-brand-500" },
  success: { ring: "border-positive-100", icon: "text-text-positive", accent: "bg-positive-500" },
  warning: { ring: "border-warning-100", icon: "text-text-warning", accent: "bg-warning-500" },
  error: { ring: "border-negative-100", icon: "text-text-negative", accent: "bg-negative-500" }
}, v = 4e3, w = 1e4;
let h = 0;
const b = ["pointerdown", "mousedown", "touchstart", "focusin"], y = (e) => e.stopPropagation();
function T(e) {
  e && b.forEach((n) => e.addEventListener(n, y, { passive: !0 }));
}
function C({ children: e }) {
  const [n, t] = l.useState([]), a = l.useRef(/* @__PURE__ */ new Map()), c = l.useCallback((r) => {
    const i = a.current.get(r);
    i && (clearTimeout(i), a.current.delete(r)), t((u) => u.filter((d) => d.id !== r));
  }, []), o = l.useCallback((r) => {
    const i = ++h, u = {
      id: i,
      type: r.type ?? "info",
      message: r.message ?? "",
      description: r.description,
      action: r.action,
      /* { label, onClick } */
      duration: r.duration ?? (r.action ? w : v)
    };
    if (t((d) => [...d, u]), u.duration > 0) {
      const d = setTimeout(() => c(i), u.duration);
      a.current.set(i, d);
    }
    return i;
  }, [c]);
  l.useEffect(() => () => {
    a.current.forEach(clearTimeout), a.current.clear();
  }, []);
  const x = g.useMemo(() => ({
    show: o,
    dismiss: c,
    info: (r, i = {}) => o({ ...i, type: "info", message: r }),
    success: (r, i = {}) => o({ ...i, type: "success", message: r }),
    warning: (r, i = {}) => o({ ...i, type: "warning", message: r }),
    error: (r, i = {}) => o({ ...i, type: "error", message: r })
  }), [o, c]);
  return /* @__PURE__ */ s.jsxs(p.Provider, { value: x, children: [
    e,
    /* @__PURE__ */ s.jsx(j, { items: n.slice(-3), onDismiss: c })
  ] });
}
function j({ items: e, onDismiss: n }) {
  return e.length === 0 ? null : /* @__PURE__ */ s.jsx(
    "div",
    {
      ref: T,
      "data-apya-overlay": "toast",
      role: "region",
      "aria-label": "Bildirimler",
      className: f(
        "fixed bottom-4 right-4 z-toast",
        "flex flex-col-reverse gap-2",
        "pointer-events-none",
        /* viewport tıklamaları geçirir; tek tek toast'lar pointer-auto */
        "max-w-[calc(100vw-2rem)]"
      ),
      children: e.map((t) => /* @__PURE__ */ s.jsx(E, { item: t, onDismiss: n }, t.id))
    }
  );
}
function E({ item: e, onDismiss: n }) {
  const t = m[e.type] ?? m.info, a = e.type === "error" ? "assertive" : "polite", c = () => {
    var o, x;
    try {
      (x = (o = e.action) == null ? void 0 : o.onClick) == null || x.call(o);
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
function L() {
  const e = l.useContext(p);
  if (!e)
    throw new Error("useToast must be used within <ToastProvider>.");
  return e;
}
function S({ onUpdate: e, onReady: n } = {}) {
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
  C as T,
  S as r,
  L as u
};
