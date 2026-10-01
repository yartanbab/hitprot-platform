import { r as a, j as n } from "./react-vendor-D7YDiBbi.js";
import { D as b, b as k, c as h, d as j, e as w, f as R } from "./ui-vendor-UYevF8mE.js";
import { B as g } from "./Dialog-BdrRxZcw.js";
import { t as c } from "./index-DgpuJ91w.js";
function O({
  open: o,
  onStay: l,
  onDiscard: v,
  onSave: f,
  isSaving: i = !1,
  errorText: d,
  title: m,
  description: p,
  stayLabel: x,
  discardLabel: y,
  saveLabel: D,
  savingLabel: t
}) {
  const s = a.useRef(null), u = a.useRef(null);
  return /* @__PURE__ */ n.jsx(b, { open: o, onOpenChange: (e) => {
    e || l == null || l();
  }, children: /* @__PURE__ */ n.jsxs(k, { children: [
    /* @__PURE__ */ n.jsx(h, { className: "fixed inset-0 z-modal bg-surface-overlay animate-overlay-fade" }),
    /* @__PURE__ */ n.jsx("div", { className: "fixed inset-0 z-modal flex items-center justify-center p-4 pointer-events-none", children: /* @__PURE__ */ n.jsxs(
      j,
      {
        role: "alertdialog",
        "data-apya-overlay": "unsaved",
        className: "pointer-events-auto w-full max-w-lg rounded-xl border border-default bg-surface-elevated p-[var(--apya-space-5)] shadow-xl animate-dialog-in focus-visible:outline-none",
        onOpenAutoFocus: (e) => {
          var r;
          u.current = document.activeElement, e.preventDefault(), (r = s.current) == null || r.focus();
        },
        onCloseAutoFocus: (e) => {
          e.preventDefault();
          const r = u.current;
          u.current = null;
          const C = document.activeElement;
          r != null && r.isConnected && (!C || C === document.body) && r.focus();
        },
        onPointerDownOutside: (e) => e.preventDefault(),
        onInteractOutside: (e) => e.preventDefault(),
        onEscapeKeyDown: (e) => {
          i && e.preventDefault();
        },
        children: [
          /* @__PURE__ */ n.jsx(w, { className: "text-base font-semibold text-text-primary", children: m ?? c("Common:Unsaved:Title", "Kaydedilmemiş değişiklikleriniz var") }),
          /* @__PURE__ */ n.jsx(R, { className: "mt-2 text-sm text-text-secondary", children: p ?? c("Common:Unsaved:Body", "Devam ederseniz kaydetmediğiniz değişiklikler kaybolur.") }),
          d && /* @__PURE__ */ n.jsx("p", { role: "alert", className: "mt-3 text-sm text-text-negative", children: d }),
          /* @__PURE__ */ n.jsxs("div", { className: "mt-[var(--apya-space-5)] flex flex-wrap justify-end gap-2 lt-560:flex-col lt-560:items-stretch", children: [
            /* @__PURE__ */ n.jsx(g, { ref: s, variant: "secondary", onClick: l, disabled: i, children: x ?? c("Common:Unsaved:Stay", "Düzenlemeye devam et") }),
            /* @__PURE__ */ n.jsx(g, { variant: "destructive", onClick: v, disabled: i, children: y ?? c("Common:Unsaved:Discard", "Değişiklikleri at") }),
            f && /* @__PURE__ */ n.jsx(
              g,
              {
                variant: "primary",
                onClick: f,
                isLoading: i,
                loadingText: t ?? c("Common:Unsaved:Saving", "Kaydediliyor…"),
                children: D ?? c("Common:Unsaved:SaveAndClose", "Kaydet ve çık")
              }
            )
          ] })
        ]
      }
    ) })
  ] }) });
}
function P() {
  const [o, l] = a.useState(!1), [v, f] = a.useState(!1), i = a.useRef(null), d = a.useRef(!1), m = a.useRef(!1), p = a.useCallback(() => l(!0), []), x = a.useCallback(() => {
    m.current = !1, l(!1);
  }, []);
  a.useEffect(() => {
    if (!o) return;
    const t = (s) => {
      var u, e, r;
      m.current || (r = (e = (u = window.apya) == null ? void 0 : u.dirtyGuard) == null ? void 0 : e.isUnloadAllowed) != null && r.call(e) || (s.preventDefault(), s.returnValue = "");
    };
    return window.addEventListener("beforeunload", t), () => window.removeEventListener("beforeunload", t);
  }, [o]);
  const y = a.useCallback((t) => {
    if (!o) {
      t == null || t();
      return;
    }
    d.current || (d.current = !0, i.current = t ?? null, f(!0));
  }, [o]), D = a.useCallback((t) => {
    if (!d.current) return;
    d.current = !1;
    const s = i.current;
    i.current = null, f(!1), (t === "discard" || t === "saved") && (m.current = !0, l(!1), s == null || s());
  }, []);
  return { isDirty: o, markDirty: p, markClean: x, requestClose: y, pendingClose: v, resolvePendingClose: D };
}
export {
  O as U,
  P as u
};
