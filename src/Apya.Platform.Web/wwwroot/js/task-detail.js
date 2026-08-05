import { j as t, r as l, b as V } from "./react-vendor.js";
/* empty css      */
import { a as $ } from "./QueryProvider.js";
import { D as q, l as M, e as G, B as w, S as T } from "./Dialog.js";
import { u as H } from "./query-vendor.js";
function Q({
  open: e,
  onRequestClose: r,
  fullscreen: n,
  title: a,
  header: s,
  footer: d,
  children: u
}) {
  return /* @__PURE__ */ t.jsx(
    q,
    {
      open: e,
      onOpenChange: (i) => {
        i || r();
      },
      children: /* @__PURE__ */ t.jsx(
        M,
        {
          title: a,
          fullscreen: n,
          onInteractOutside: (i) => {
            i.preventDefault(), r();
          },
          onEscapeKeyDown: (i) => {
            i.preventDefault(), r();
          },
          children: /* @__PURE__ */ t.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
            s,
            /* @__PURE__ */ t.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: u }),
            d
          ] })
        }
      )
    }
  );
}
function J({ isPrivate: e }) {
  return e ? /* @__PURE__ */ t.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1.5 text-[13px] text-text-secondary",
      title: "Bu görev yalnızca yetkilendirilmiş kullanıcılar tarafından görüntülenebilir.",
      children: [
        /* @__PURE__ */ t.jsx("i", { className: "fa fa-lock text-text-tertiary", "aria-hidden": "true" }),
        "Sınırlı erişim"
      ]
    }
  ) : null;
}
const z = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, B = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function W({
  task: e,
  canDelete: r,
  onClose: n,
  onDelete: a,
  onToggleFullscreen: s,
  fullscreen: d = !1
}) {
  const [u, i] = l.useState(!1), f = l.useRef(null);
  l.useEffect(() => {
    if (!u) return;
    const m = (x) => {
      f.current && !f.current.contains(x.target) && i(!1);
    }, h = (x) => {
      x.key === "Escape" && i(!1);
    };
    return document.addEventListener("mousedown", m), document.addEventListener("keydown", h), () => {
      document.removeEventListener("mousedown", m), document.removeEventListener("keydown", h);
    };
  }, [u]);
  const c = z[e == null ? void 0 : e.status] ?? z[1], o = B[e == null ? void 0 : e.priority] ?? B[2], j = () => {
    var h, x, p, N;
    const m = `${window.location.origin}/Tasks/Detail/${e.id}`;
    (h = navigator.clipboard) == null || h.writeText(m), (N = (p = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : p.info) == null || N.call(p, "Bağlantı kopyalandı."), i(!1);
  };
  return /* @__PURE__ */ t.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ t.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ t.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: e == null ? void 0 : e.title }),
      /* @__PURE__ */ t.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(G, { variant: c.variant, children: c.text }),
        /* @__PURE__ */ t.jsx(G, { variant: o.variant, children: o.text }),
        /* @__PURE__ */ t.jsx(J, { isPrivate: e == null ? void 0 : e.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": d ? "Küçült" : "Tam ekrana büyüt",
          onClick: s,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ t.jsx("i", { className: d ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ t.jsxs("div", { className: "relative", ref: f, children: [
        /* @__PURE__ */ t.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": u,
            onClick: () => i((m) => !m),
            className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
            children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-ellipsis", "aria-hidden": "true" })
          }
        ),
        u && /* @__PURE__ */ t.jsxs(
          "div",
          {
            role: "menu",
            className: "absolute right-0 z-popover mt-1 w-56 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated py-1 shadow-xl",
            children: [
              /* @__PURE__ */ t.jsxs(
                "button",
                {
                  type: "button",
                  role: "menuitem",
                  onClick: j,
                  className: "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-raised",
                  children: [
                    /* @__PURE__ */ t.jsx("i", { className: "fa fa-link w-4 text-text-tertiary", "aria-hidden": "true" }),
                    "Bağlantıyı kopyala"
                  ]
                }
              ),
              /* @__PURE__ */ t.jsxs(
                "button",
                {
                  type: "button",
                  role: "menuitem",
                  disabled: !0,
                  title: "Yakında",
                  className: "flex w-full cursor-not-allowed items-center gap-2 px-3 py-2 text-left text-sm text-text-tertiary",
                  children: [
                    /* @__PURE__ */ t.jsx("i", { className: "fa fa-copy w-4", "aria-hidden": "true" }),
                    "Çoğalt",
                    /* @__PURE__ */ t.jsx("span", { className: "ml-auto text-[11px]", children: "Yakında" })
                  ]
                }
              ),
              /* @__PURE__ */ t.jsxs(
                "button",
                {
                  type: "button",
                  role: "menuitem",
                  disabled: !0,
                  title: "Yakında",
                  className: "flex w-full cursor-not-allowed items-center gap-2 px-3 py-2 text-left text-sm text-text-tertiary",
                  children: [
                    /* @__PURE__ */ t.jsx("i", { className: "fa fa-box-archive w-4", "aria-hidden": "true" }),
                    "Arşivle",
                    /* @__PURE__ */ t.jsx("span", { className: "ml-auto text-[11px]", children: "Yakında" })
                  ]
                }
              ),
              r && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
                /* @__PURE__ */ t.jsx("div", { className: "my-1 h-px bg-border-subtle" }),
                /* @__PURE__ */ t.jsxs(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    onClick: () => {
                      i(!1), a();
                    },
                    className: "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-negative hover:bg-surface-raised",
                    children: [
                      /* @__PURE__ */ t.jsx("i", { className: "fa fa-trash w-4", "aria-hidden": "true" }),
                      "Sil"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": "Kapat",
          onClick: n,
          className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] })
  ] }) });
}
const X = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : null;
function Z({ lastSavedAt: e, isDirty: r, isSaving: n, onCancel: a, onSave: s }) {
  const d = X(e);
  return /* @__PURE__ */ t.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: d ? `Son kayıt: ${d}` : " " }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ t.jsx(w, { variant: "secondary", onClick: a, disabled: n, children: "Vazgeç" }),
      /* @__PURE__ */ t.jsx(
        w,
        {
          variant: "primary",
          onClick: () => s == null ? void 0 : s(),
          disabled: !r || !s,
          isLoading: n,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
function ee(e) {
  var n, a, s;
  const r = (s = (a = (n = window == null ? void 0 : window.apya) == null ? void 0 : n.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task;
  return r ? Promise.resolve(r.get(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function te(e) {
  return H({
    queryKey: ["task-detail", e],
    queryFn: () => ee(e),
    enabled: !!e,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function ae(e) {
  var r, n, a;
  return !!((a = (n = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.auth) == null ? void 0 : n.isGranted) != null && a.call(n, e));
}
function re() {
  const [e, r] = l.useState(!1), [n, a] = l.useState(!1), s = l.useRef(null), d = l.useCallback(() => r(!0), []), u = l.useCallback(() => r(!1), []);
  l.useEffect(() => {
    if (!e) return;
    const c = (o) => {
      o.preventDefault(), o.returnValue = "";
    };
    return window.addEventListener("beforeunload", c), () => window.removeEventListener("beforeunload", c);
  }, [e]);
  const i = l.useCallback((c) => {
    if (!e) {
      c == null || c();
      return;
    }
    s.current = c ?? null, a(!0);
  }, [e]), f = l.useCallback((c) => {
    const o = s.current;
    return a(!1), s.current = null, c === "discard" && (r(!1), o == null || o()), c === "save" ? o : null;
  }, []);
  return { isDirty: e, markDirty: d, markClean: u, requestClose: i, pendingClose: n, resolvePendingClose: f };
}
const ne = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, L = "task";
function Y() {
  if (typeof window > "u") return null;
  const e = new URLSearchParams(window.location.search).get(L);
  return e && ne.test(e) ? e : null;
}
function se() {
  if (typeof window > "u") return;
  const e = new URL(window.location.href);
  e.searchParams.delete(L), window.history.replaceState(null, "", e.pathname + e.search + e.hash);
}
function ie(e, r) {
  const n = l.useRef(r);
  n.current = r, l.useEffect(() => {
    if (!e || Y() === e) return;
    const a = new URL(window.location.href);
    a.searchParams.set(L, e), window.history.pushState({ apyaTask: e }, "", a.pathname + a.search + a.hash);
  }, [e]), l.useEffect(() => {
    const a = () => {
      var s;
      (s = n.current) == null || s.call(n);
    };
    return window.addEventListener("popstate", a), () => window.removeEventListener("popstate", a);
  }, []);
}
const U = "apya.taskDetail.fullscreen";
function le({ taskId: e, presentation: r = "modal", onClose: n }) {
  const { data: a, isLoading: s, isError: d, refetch: u } = te(e), i = re(), [f, c] = l.useState(
    () => {
      var v;
      return ((v = window.localStorage) == null ? void 0 : v.getItem(U)) === "1";
    }
  ), o = l.useCallback(() => {
    se(), n == null || n();
  }, [n]);
  ie(e, o);
  const j = l.useCallback(() => i.requestClose(o), [i, o]), m = l.useCallback(() => {
    c((v) => {
      var k;
      const b = !v;
      return (k = window.localStorage) == null || k.setItem(U, b ? "1" : "0"), b;
    });
  }, []), h = ae("Platform.Tasks.Delete"), [x, p] = l.useState(!1), [N, R] = l.useState(!1), I = l.useCallback(async () => {
    var v, b, k, P, D, F;
    R(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(e)), (k = (b = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : b.info) == null || k.call(b, "Başarıyla silindi."), p(!1), i.markClean(), o();
    } catch (E) {
      (F = (D = (P = window == null ? void 0 : window.abp) == null ? void 0 : P.notify) == null ? void 0 : D.error) == null || F.call(D, (E == null ? void 0 : E.message) || "Görev silinemedi.");
    } finally {
      R(!1);
    }
  }, [e, i, o]), _ = s ? /* @__PURE__ */ t.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ t.jsx(T, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ t.jsx(T, { className: "h-24 w-full" }),
    /* @__PURE__ */ t.jsx(T, { className: "h-24 w-full" })
  ] }) : d ? /* @__PURE__ */ t.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ t.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ t.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ t.jsx(w, { variant: "ghost", onClick: () => u(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ t.jsx("p", { className: "text-text-tertiary", children: "Genel sekmesi Faz 2'de eklenecek." });
  return /* @__PURE__ */ t.jsxs(
    Q,
    {
      open: !0,
      fullscreen: f,
      onRequestClose: j,
      title: a ? `Görev Detayı: ${a.title}` : "Görev Detayı",
      header: /* @__PURE__ */ t.jsx(
        W,
        {
          task: a ?? { title: "Yükleniyor…" },
          canDelete: h,
          fullscreen: f,
          onToggleFullscreen: m,
          onClose: j,
          onDelete: () => p(!0)
        }
      ),
      footer: /* @__PURE__ */ t.jsx(
        Z,
        {
          lastSavedAt: a == null ? void 0 : a.lastModificationTime,
          isDirty: i.isDirty,
          isSaving: !1,
          onCancel: j
        }
      ),
      children: [
        _,
        i.pendingClose && /* @__PURE__ */ t.jsx(
          ce,
          {
            onStay: () => i.resolvePendingClose("stay"),
            onDiscard: () => i.resolvePendingClose("discard")
          }
        ),
        x && /* @__PURE__ */ t.jsx(
          oe,
          {
            taskTitle: (a == null ? void 0 : a.title) ?? "",
            busy: N,
            onCancel: () => p(!1),
            onConfirm: I
          }
        )
      ]
    }
  );
}
function oe({ taskTitle: e, busy: r, onCancel: n, onConfirm: a }) {
  const [s, d] = l.useState(""), u = s.trim() === "SİL";
  return /* @__PURE__ */ t.jsxs(
    A,
    {
      label: "Görev silinecek",
      title: "Görev silinecek",
      description: /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        /* @__PURE__ */ t.jsx("strong", { className: "text-text-primary", children: e }),
        " kalıcı olarak silinecek. Onaylamak için aşağıya ",
        /* @__PURE__ */ t.jsx("strong", { children: "SİL" }),
        " yazın."
      ] }),
      actions: /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        /* @__PURE__ */ t.jsx(w, { variant: "secondary", onClick: n, disabled: r, children: "İptal" }),
        /* @__PURE__ */ t.jsx(
          w,
          {
            variant: "destructive",
            onClick: a,
            disabled: !u,
            isLoading: r,
            loadingText: "Siliniyor…",
            children: "Evet, sil"
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ t.jsx("label", { htmlFor: "delete-confirm", className: "sr-only", children: "Onay metni" }),
        /* @__PURE__ */ t.jsx(
          "input",
          {
            id: "delete-confirm",
            value: s,
            onChange: (i) => d(i.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function A({ label: e, title: r, description: n, children: a, actions: s }) {
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      role: "alertdialog",
      "aria-modal": "true",
      "aria-label": e,
      className: "absolute inset-0 z-popover grid place-items-center bg-surface-overlay p-4",
      children: /* @__PURE__ */ t.jsxs("div", { className: "w-full max-w-md rounded-xl border border-default bg-surface-elevated p-[var(--apya-space-5)] shadow-xl", children: [
        /* @__PURE__ */ t.jsx("h3", { className: "text-base font-semibold text-text-primary", children: r }),
        /* @__PURE__ */ t.jsx("p", { className: "mt-2 text-sm text-text-secondary", children: n }),
        a,
        /* @__PURE__ */ t.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: s })
      ] })
    }
  );
}
function ce({ onStay: e, onDiscard: r }) {
  return /* @__PURE__ */ t.jsx(
    A,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        /* @__PURE__ */ t.jsx(w, { variant: "secondary", onClick: e, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ t.jsx(w, { variant: "destructive", onClick: r, children: "Değişiklikleri iptal et" })
      ] })
    }
  );
}
let g = null;
const S = /* @__PURE__ */ new Set(), C = /* @__PURE__ */ new Set();
function K() {
  S.forEach((e) => e());
}
function de(e) {
  return typeof e == "string" && e ? e : e && typeof e == "object" && typeof e.id == "string" && e.id ? e.id : null;
}
const y = {
  open(e) {
    const r = de(e);
    !r || r === g || (g = r, K());
  },
  close() {
    g !== null && (g = null, K());
  },
  subscribe(e) {
    return S.add(e), () => S.delete(e);
  },
  getSnapshot() {
    return g;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(e) {
    typeof e == "function" && C.add(e);
  },
  emitResult() {
    C.forEach((e) => e());
  },
  /** Yalnız testler için. */
  reset() {
    g = null, S.clear(), C.clear();
  }
};
function ue() {
  const e = l.useSyncExternalStore(
    y.subscribe,
    y.getSnapshot,
    () => null
  );
  return e ? /* @__PURE__ */ t.jsx($, { children: /* @__PURE__ */ t.jsx(
    le,
    {
      taskId: e,
      presentation: "modal",
      onClose: () => {
        y.close(), y.emitResult();
      }
    }
  ) }) : null;
}
function fe() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : window.localStorage.getItem("apya.taskDetail.v2") === "1";
  } catch {
    return !1;
  }
}
const O = document.getElementById("task-detail-island");
if (O && (window.apya = window.apya || {}, window.apya.taskDetailV2Enabled = fe(), window.apya.taskDetail = {
  open: (e) => y.open(e),
  close: () => y.close(),
  onResult: (e) => y.onResult(e)
}, V(O).render(/* @__PURE__ */ t.jsx(ue, {})), window.apya.taskDetailV2Enabled)) {
  const e = Y();
  e && y.open(e);
}
