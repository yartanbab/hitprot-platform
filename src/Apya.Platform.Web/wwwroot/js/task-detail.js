import { j as t, r as l, d as ne, b as ie } from "./react-vendor.js";
/* empty css      */
import { a as le } from "./QueryProvider.js";
import { u as Q, a as oe } from "./query-vendor.js";
import { D as ce, l as de, e as z, B as N, I as B, S as R } from "./Dialog.js";
import { C as ue } from "./Combobox.js";
function me({
  open: e,
  onRequestClose: r,
  fullscreen: n,
  title: a,
  header: i,
  footer: s,
  children: c
}) {
  return /* @__PURE__ */ t.jsx(
    ce,
    {
      open: e,
      onOpenChange: (o) => {
        o || r();
      },
      children: /* @__PURE__ */ t.jsx(
        de,
        {
          title: a,
          fullscreen: n,
          onInteractOutside: (o) => {
            o.preventDefault(), r();
          },
          onEscapeKeyDown: (o) => {
            o.preventDefault(), r();
          },
          children: /* @__PURE__ */ t.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
            i,
            /* @__PURE__ */ t.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: c }),
            s
          ] })
        }
      )
    }
  );
}
function xe({ isPrivate: e }) {
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
const K = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, U = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function pe({
  task: e,
  canDelete: r,
  onClose: n,
  onDelete: a,
  onToggleFullscreen: i,
  fullscreen: s = !1
}) {
  const [c, o] = l.useState(!1), m = l.useRef(null);
  l.useEffect(() => {
    if (!c) return;
    const v = (h) => {
      m.current && !m.current.contains(h.target) && o(!1);
    }, u = (h) => {
      h.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", v), document.addEventListener("keydown", u), () => {
      document.removeEventListener("mousedown", v), document.removeEventListener("keydown", u);
    };
  }, [c]);
  const d = K[e == null ? void 0 : e.status] ?? K[1], x = U[e == null ? void 0 : e.priority] ?? U[2], k = () => {
    var u, h, y, C;
    const v = `${window.location.origin}/Tasks/Detail/${e.id}`;
    (u = navigator.clipboard) == null || u.writeText(v), (C = (y = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : y.info) == null || C.call(y, "Bağlantı kopyalandı."), o(!1);
  };
  return /* @__PURE__ */ t.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ t.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ t.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: e == null ? void 0 : e.title }),
      /* @__PURE__ */ t.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(z, { variant: d.variant, children: d.text }),
        /* @__PURE__ */ t.jsx(z, { variant: x.variant, children: x.text }),
        /* @__PURE__ */ t.jsx(xe, { isPrivate: e == null ? void 0 : e.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": s ? "Küçült" : "Tam ekrana büyüt",
          onClick: i,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ t.jsx("i", { className: s ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ t.jsxs("div", { className: "relative", ref: m, children: [
        /* @__PURE__ */ t.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": c,
            onClick: () => o((v) => !v),
            className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
            children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-ellipsis", "aria-hidden": "true" })
          }
        ),
        c && /* @__PURE__ */ t.jsxs(
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
                  onClick: k,
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
                      o(!1), a();
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
const fe = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : null;
function ye({ lastSavedAt: e, isDirty: r, isSaving: n, onCancel: a, onSave: i }) {
  const s = fe(e);
  return /* @__PURE__ */ t.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: s ? `Son kayıt: ${s}` : " " }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: a, disabled: n, children: "Vazgeç" }),
      /* @__PURE__ */ t.jsx(
        N,
        {
          variant: "primary",
          onClick: () => i == null ? void 0 : i(),
          disabled: !r || !i,
          isLoading: n,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
const M = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", he = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function w({ label: e, htmlFor: r, error: n, children: a }) {
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("label", { htmlFor: r, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: e }),
    a,
    n && /* @__PURE__ */ t.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: n })
  ] });
}
function ve({ value: e, onChange: r }) {
  const [n, a] = l.useState(""), i = () => {
    const s = n.trim();
    s && !e.includes(s) && r([...e, s]), a("");
  };
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: e.map((s) => /* @__PURE__ */ t.jsxs(z, { variant: "neutral", children: [
      s,
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${s} etiketini kaldır`,
          onClick: () => r(e.filter((c) => c !== s)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, s)) }),
    /* @__PURE__ */ t.jsx(
      B,
      {
        value: n,
        onChange: (s) => a(s.target.value),
        onKeyDown: (s) => {
          s.key === "Enter" || s.key === "," ? (s.preventDefault(), i()) : s.key === "Backspace" && !n && e.length && r(e.slice(0, -1));
        },
        onBlur: i,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function be({
  values: e,
  errors: r,
  onFieldChange: n,
  assigneeOptions: a = [],
  isLoadingAssignees: i = !1
}) {
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx(w, { label: "Başlık", htmlFor: "task-title", error: r.title, children: /* @__PURE__ */ t.jsx(
      B,
      {
        id: "task-title",
        value: e.title,
        onChange: (s) => n("title", s.target.value),
        invalid: !!r.title
      }
    ) }),
    /* @__PURE__ */ t.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ t.jsx(w, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ t.jsx(
        "select",
        {
          id: "task-status",
          value: e.status,
          onChange: (s) => n("status", Number(s.target.value)),
          className: M,
          children: Object.entries(K).map(([s, c]) => /* @__PURE__ */ t.jsx("option", { value: s, children: c.text }, s))
        }
      ) }),
      /* @__PURE__ */ t.jsx(w, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ t.jsx(
        "select",
        {
          id: "task-priority",
          value: e.priority,
          onChange: (s) => n("priority", Number(s.target.value)),
          className: M,
          children: Object.entries(U).map(([s, c]) => /* @__PURE__ */ t.jsx("option", { value: s, children: c.text }, s))
        }
      ) })
    ] }),
    /* @__PURE__ */ t.jsx(w, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ t.jsx(
      ue,
      {
        id: "task-assignee",
        options: a,
        value: e.assigneeId,
        onChange: (s) => n("assigneeId", s),
        placeholder: i ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: i
      }
    ) }),
    /* @__PURE__ */ t.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ t.jsx(w, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: r.startDate, children: /* @__PURE__ */ t.jsx(
        B,
        {
          id: "task-start",
          type: "date",
          value: e.startDate,
          onChange: (s) => n("startDate", s.target.value),
          invalid: !!r.startDate
        }
      ) }),
      /* @__PURE__ */ t.jsx(w, { label: "Son Tarih", htmlFor: "task-due", error: r.dueDate, children: /* @__PURE__ */ t.jsx(
        B,
        {
          id: "task-due",
          type: "date",
          value: e.dueDate,
          onChange: (s) => n("dueDate", s.target.value),
          invalid: !!r.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ t.jsx(w, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ t.jsx(ve, { value: e.tagNames, onChange: (s) => n("tagNames", s) }) }),
    /* @__PURE__ */ t.jsx(w, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ t.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: e.description,
        onChange: (s) => n("description", s.target.value),
        className: he
      }
    ) })
  ] });
}
const Y = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : "—";
function I({ label: e, value: r }) {
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("dt", { className: "text-[13px] text-text-tertiary", children: e }),
    /* @__PURE__ */ t.jsx("dd", { className: "mt-0.5 text-text-primary", children: r ?? "—" })
  ] });
}
function ge({ task: e, creatorName: r, lastModifierName: n }) {
  return /* @__PURE__ */ t.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ t.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ t.jsx(I, { label: "Oluşturan", value: r }),
      /* @__PURE__ */ t.jsx(I, { label: "Oluşturulma zamanı", value: Y(e.creationTime) }),
      /* @__PURE__ */ t.jsx(I, { label: "Güncelleyen", value: n }),
      /* @__PURE__ */ t.jsx(I, { label: "Son güncelleme zamanı", value: Y(e.lastModificationTime) }),
      /* @__PURE__ */ t.jsx(I, { label: "Proje", value: e.projectName })
    ] })
  ] });
}
function je(e) {
  var n, a, i;
  const r = (i = (a = (n = window == null ? void 0 : window.apya) == null ? void 0 : n.platform) == null ? void 0 : a.tasks) == null ? void 0 : i.task;
  return r ? Promise.resolve(r.get(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function we(e) {
  return Q({
    queryKey: ["task-detail", e],
    queryFn: () => je(e),
    enabled: !!e,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function Ne(e) {
  var r, n, a;
  return !!((a = (n = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.auth) == null ? void 0 : n.isGranted) != null && a.call(n, e));
}
function De() {
  const [e, r] = l.useState(!1), [n, a] = l.useState(!1), i = l.useRef(null), s = l.useCallback(() => r(!0), []), c = l.useCallback(() => r(!1), []);
  l.useEffect(() => {
    if (!e) return;
    const d = (x) => {
      x.preventDefault(), x.returnValue = "";
    };
    return window.addEventListener("beforeunload", d), () => window.removeEventListener("beforeunload", d);
  }, [e]);
  const o = l.useCallback((d) => {
    if (!e) {
      d == null || d();
      return;
    }
    i.current = d ?? null, a(!0);
  }, [e]), m = l.useCallback((d) => {
    const x = i.current;
    return a(!1), i.current = null, d === "discard" && (r(!1), x == null || x()), d === "save" ? x : null;
  }, []);
  return { isDirty: e, markDirty: s, markClean: c, requestClose: o, pendingClose: n, resolvePendingClose: m };
}
const ke = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, A = "task";
function H() {
  if (typeof window > "u") return null;
  const e = new URLSearchParams(window.location.search).get(A);
  return e && ke.test(e) ? e : null;
}
function Ce() {
  if (typeof window > "u") return;
  const e = new URL(window.location.href);
  e.searchParams.delete(A), window.history.replaceState(null, "", e.pathname + e.search + e.hash);
}
function Te(e, r) {
  const n = l.useRef(r);
  n.current = r, l.useEffect(() => {
    if (!e || H() === e) return;
    const a = new URL(window.location.href);
    a.searchParams.set(A, e), window.history.pushState({ apyaTask: e }, "", a.pathname + a.search + a.hash);
  }, [e]), l.useEffect(() => {
    const a = () => {
      var i;
      (i = n.current) == null || i.call(n);
    };
    return window.addEventListener("popstate", a), () => window.removeEventListener("popstate", a);
  }, []);
}
const Se = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: []
};
function Ee(e) {
  return e ? {
    title: e.title ?? "",
    description: e.description ?? "",
    startDate: e.startDate ? e.startDate.slice(0, 10) : "",
    dueDate: e.dueDate ? e.dueDate.slice(0, 10) : "",
    status: e.status ?? 1,
    priority: e.priority ?? 2,
    assigneeId: e.assigneeId ?? null,
    tagNames: (e.tags ?? []).map((r) => r.name)
  } : Se;
}
function Ie(e) {
  const [r, n] = l.useState(e == null ? void 0 : e.id), a = l.useMemo(() => Ee(e), [e]), [i, s] = l.useState(a), [c, o] = l.useState({});
  (e == null ? void 0 : e.id) !== r && (n(e == null ? void 0 : e.id), s(a), o({}));
  const m = l.useCallback((u, h) => {
    s((y) => ({ ...y, [u]: h }));
  }, []), d = l.useMemo(
    () => JSON.stringify(i) !== JSON.stringify(a),
    [i, a]
  ), x = l.useCallback(() => {
    const u = {};
    return i.title.trim() || (u.title = "Başlık zorunlu."), i.startDate || (u.startDate = "Başlangıç tarihi zorunlu."), i.dueDate && i.startDate && i.dueDate < i.startDate && (u.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), o(u), Object.keys(u).length === 0;
  }, [i]), k = l.useCallback(() => ({
    title: i.title.trim(),
    description: i.description || null,
    startDate: i.startDate,
    dueDate: i.dueDate || null,
    status: i.status,
    priority: i.priority,
    assigneeId: i.assigneeId,
    boardColumnId: (e == null ? void 0 : e.boardColumnId) ?? null,
    projectId: (e == null ? void 0 : e.projectId) ?? null,
    parentTaskId: (e == null ? void 0 : e.parentTaskId) ?? null,
    isPrivate: !!(e != null && e.isPrivate),
    predecessorIds: (e == null ? void 0 : e.predecessorIds) ?? [],
    tagNames: i.tagNames
  }), [i, e]), v = l.useCallback(() => {
    s(a), o({});
  }, [a]);
  return { values: i, setField: m, isDirty: d, errors: c, validate: x, toUpdateDto: k, reset: v };
}
function q(e) {
  return [e.name, e.surname].filter(Boolean).join(" ") || e.userName;
}
function Le() {
  var r, n, a;
  const e = (a = (n = (r = window == null ? void 0 : window.apya) == null ? void 0 : r.platform) == null ? void 0 : n.tasks) == null ? void 0 : a.task;
  return e ? Promise.resolve(e.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Be() {
  var i;
  const e = Q({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Le,
    staleTime: 3e5,
    retry: !1
  }), r = ((i = e.data) == null ? void 0 : i.items) ?? [], n = r.map((s) => ({ value: s.id, label: q(s) })), a = new Map(r.map((s) => [s.id, q(s)]));
  return { options: n, nameById: a, isLoading: e.isLoading };
}
let T = null;
const P = /* @__PURE__ */ new Set(), O = /* @__PURE__ */ new Set();
function _() {
  P.forEach((e) => e());
}
function Pe(e) {
  return typeof e == "string" && e ? e : e && typeof e == "object" && typeof e.id == "string" && e.id ? e.id : null;
}
const g = {
  open(e) {
    const r = Pe(e);
    !r || r === T || (T = r, _());
  },
  close() {
    T !== null && (T = null, _());
  },
  subscribe(e) {
    return P.add(e), () => P.delete(e);
  },
  getSnapshot() {
    return T;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(e) {
    typeof e == "function" && O.add(e);
  },
  emitResult() {
    O.forEach((e) => e());
  },
  /** Yalnız testler için. */
  reset() {
    T = null, P.clear(), O.clear();
  }
}, V = "apya.taskDetail.fullscreen";
function Fe({ taskId: e, presentation: r = "modal", onClose: n }) {
  const { data: a, isLoading: i, isError: s, refetch: c } = we(e), o = De(), m = Ie(a), d = Be(), x = oe(), [k, v] = l.useState(
    () => {
      var p;
      return ((p = window.localStorage) == null ? void 0 : p.getItem(V)) === "1";
    }
  ), [u, h] = l.useState(!1), y = l.useCallback(() => {
    Ce(), n == null || n();
  }, [n]);
  Te(e, y), ne.useEffect(() => {
    m.isDirty ? o.markDirty() : o.markClean();
  });
  const C = l.useCallback(() => o.requestClose(y), [o, y]), W = l.useCallback(() => {
    v((p) => {
      var j;
      const f = !p;
      return (j = window.localStorage) == null || j.setItem(V, f ? "1" : "0"), f;
    });
  }, []), X = Ne("Platform.Tasks.Delete"), [Z, F] = l.useState(!1), [ee, G] = l.useState(!1), te = l.useCallback(async () => {
    var p, f, j, S, b, E;
    G(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(e)), (j = (f = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : f.info) == null || j.call(f, "Başarıyla silindi."), F(!1), o.markClean(), y();
    } catch (D) {
      (E = (b = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : b.error) == null || E.call(b, (D == null ? void 0 : D.message) || "Görev silinemedi.");
    } finally {
      G(!1);
    }
  }, [e, o, y]), L = l.useCallback(async () => {
    var p, f, j, S, b, E;
    if (!m.validate()) return !1;
    h(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(e, m.toUpdateDto())
      ), await x.invalidateQueries({ queryKey: ["task-detail", e] }), g.emitResult(), (j = (f = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : f.success) == null || j.call(f, "Kaydedildi."), !0;
    } catch (D) {
      return (E = (b = (S = window == null ? void 0 : window.abp) == null ? void 0 : S.notify) == null ? void 0 : b.error) == null || E.call(b, (D == null ? void 0 : D.message) || "Kaydedilemedi."), !1;
    } finally {
      h(!1);
    }
  }, [e, m, o, x]), ae = l.useCallback(() => {
    L();
  }, [L]), se = l.useCallback(async () => {
    const p = o.resolvePendingClose("save");
    await L() && (p == null || p());
  }, [o, L]), re = i ? /* @__PURE__ */ t.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ t.jsx(R, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ t.jsx(R, { className: "h-24 w-full" }),
    /* @__PURE__ */ t.jsx(R, { className: "h-24 w-full" })
  ] }) : s ? /* @__PURE__ */ t.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ t.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ t.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ t.jsx(N, { variant: "ghost", onClick: () => c(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ t.jsxs("div", { className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]", children: [
    /* @__PURE__ */ t.jsx(
      be,
      {
        values: m.values,
        errors: m.errors,
        onFieldChange: m.setField,
        assigneeOptions: d.options,
        isLoadingAssignees: d.isLoading
      }
    ),
    /* @__PURE__ */ t.jsx(
      ge,
      {
        task: a,
        creatorName: d.nameById.get(a.creatorId),
        lastModifierName: d.nameById.get(a.lastModifierId)
      }
    )
  ] });
  return /* @__PURE__ */ t.jsxs(
    me,
    {
      open: !0,
      fullscreen: k,
      onRequestClose: C,
      title: a ? `Görev Detayı: ${a.title}` : "Görev Detayı",
      header: /* @__PURE__ */ t.jsx(
        pe,
        {
          task: a ?? { title: "Yükleniyor…" },
          canDelete: X,
          fullscreen: k,
          onToggleFullscreen: W,
          onClose: C,
          onDelete: () => F(!0)
        }
      ),
      footer: /* @__PURE__ */ t.jsx(
        ye,
        {
          lastSavedAt: a == null ? void 0 : a.lastModificationTime,
          isDirty: o.isDirty,
          isSaving: u,
          onCancel: C,
          onSave: ae
        }
      ),
      children: [
        re,
        o.pendingClose && /* @__PURE__ */ t.jsx(
          Oe,
          {
            isSaving: u,
            onStay: () => o.resolvePendingClose("stay"),
            onDiscard: () => o.resolvePendingClose("discard"),
            onSaveAndClose: se
          }
        ),
        Z && /* @__PURE__ */ t.jsx(
          Re,
          {
            taskTitle: (a == null ? void 0 : a.title) ?? "",
            busy: ee,
            onCancel: () => F(!1),
            onConfirm: te
          }
        )
      ]
    }
  );
}
function Re({ taskTitle: e, busy: r, onCancel: n, onConfirm: a }) {
  const [i, s] = l.useState(""), c = i.trim() === "SİL";
  return /* @__PURE__ */ t.jsxs(
    J,
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
        /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: n, disabled: r, children: "İptal" }),
        /* @__PURE__ */ t.jsx(
          N,
          {
            variant: "destructive",
            onClick: a,
            disabled: !c,
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
            value: i,
            onChange: (o) => s(o.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function J({ label: e, title: r, description: n, children: a, actions: i }) {
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
        /* @__PURE__ */ t.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: i })
      ] })
    }
  );
}
function Oe({ isSaving: e, onStay: r, onDiscard: n, onSaveAndClose: a }) {
  return /* @__PURE__ */ t.jsx(
    J,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: r, disabled: e, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ t.jsx(N, { variant: "destructive", onClick: n, disabled: e, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ t.jsx(N, { variant: "primary", onClick: a, isLoading: e, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
function ze() {
  const e = l.useSyncExternalStore(
    g.subscribe,
    g.getSnapshot,
    () => null
  );
  return e ? /* @__PURE__ */ t.jsx(le, { children: /* @__PURE__ */ t.jsx(
    Fe,
    {
      taskId: e,
      presentation: "modal",
      onClose: () => {
        g.close(), g.emitResult();
      }
    }
  ) }) : null;
}
function Ke() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : window.localStorage.getItem("apya.taskDetail.v2") === "1";
  } catch {
    return !1;
  }
}
const $ = document.getElementById("task-detail-island");
if ($ && (window.apya = window.apya || {}, window.apya.taskDetailV2Enabled = Ke(), window.apya.taskDetail = {
  open: (e) => g.open(e),
  close: () => g.close(),
  onResult: (e) => g.onResult(e)
}, ie($).render(/* @__PURE__ */ t.jsx(ze, {})), window.apya.taskDetailV2Enabled)) {
  const e = H();
  e && g.open(e);
}
