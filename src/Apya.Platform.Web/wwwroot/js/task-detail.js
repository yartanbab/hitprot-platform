import { j as t, r as o, d as B, b as ke } from "./react-vendor.js";
/* empty css      */
import { a as Ne } from "./QueryProvider.js";
import { u as _, a as ie, b as X } from "./query-vendor.js";
import { D as De, l as Ce, e as M, B as C, I as P, S as z } from "./Dialog.js";
import { C as Se } from "./Combobox.js";
function Te({
  open: e,
  onRequestClose: r,
  fullscreen: a,
  title: s,
  header: i,
  footer: n,
  children: m
}) {
  return /* @__PURE__ */ t.jsx(
    De,
    {
      open: e,
      onOpenChange: (l) => {
        l || r();
      },
      children: /* @__PURE__ */ t.jsx(
        Ce,
        {
          title: s,
          fullscreen: a,
          onInteractOutside: (l) => {
            l.preventDefault(), r();
          },
          onEscapeKeyDown: (l) => {
            l.preventDefault(), r();
          },
          children: /* @__PURE__ */ t.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
            i,
            /* @__PURE__ */ t.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: m }),
            n
          ] })
        }
      )
    }
  );
}
function Ee({ isPrivate: e }) {
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
const U = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, q = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function Fe({
  task: e,
  canDelete: r,
  onClose: a,
  onDelete: s,
  onToggleFullscreen: i,
  fullscreen: n = !1
}) {
  const [m, l] = o.useState(!1), d = o.useRef(null);
  o.useEffect(() => {
    if (!m) return;
    const g = (b) => {
      d.current && !d.current.contains(b.target) && l(!1);
    }, v = (b) => {
      b.key === "Escape" && l(!1);
    };
    return document.addEventListener("mousedown", g), document.addEventListener("keydown", v), () => {
      document.removeEventListener("mousedown", g), document.removeEventListener("keydown", v);
    };
  }, [m]);
  const c = U[e == null ? void 0 : e.status] ?? U[1], u = q[e == null ? void 0 : e.priority] ?? q[2], h = () => {
    var v, b, w, T;
    const g = `${window.location.origin}/Tasks/Detail/${e.id}`;
    (v = navigator.clipboard) == null || v.writeText(g), (T = (w = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : w.info) == null || T.call(w, "Bağlantı kopyalandı."), l(!1);
  };
  return /* @__PURE__ */ t.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ t.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ t.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: e == null ? void 0 : e.title }),
      /* @__PURE__ */ t.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(M, { variant: c.variant, children: c.text }),
        /* @__PURE__ */ t.jsx(M, { variant: u.variant, children: u.text }),
        /* @__PURE__ */ t.jsx(Ee, { isPrivate: e == null ? void 0 : e.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": n ? "Küçült" : "Tam ekrana büyüt",
          onClick: i,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ t.jsx("i", { className: n ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ t.jsxs("div", { className: "relative", ref: d, children: [
        /* @__PURE__ */ t.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": m,
            onClick: () => l((g) => !g),
            className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
            children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-ellipsis", "aria-hidden": "true" })
          }
        ),
        m && /* @__PURE__ */ t.jsxs(
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
                  onClick: h,
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
                      l(!1), s();
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
          onClick: a,
          className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] })
  ] }) });
}
const Le = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : null;
function Ae({ lastSavedAt: e, isDirty: r, isSaving: a, onCancel: s, onSave: i }) {
  const n = Le(e);
  return /* @__PURE__ */ t.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: n ? `Son kayıt: ${n}` : " " }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ t.jsx(C, { variant: "secondary", onClick: s, disabled: a, children: "Vazgeç" }),
      /* @__PURE__ */ t.jsx(
        C,
        {
          variant: "primary",
          onClick: () => i == null ? void 0 : i(),
          disabled: !r || !i,
          isLoading: a,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
const ee = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Pe = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function D({ label: e, htmlFor: r, error: a, children: s }) {
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("label", { htmlFor: r, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: e }),
    s,
    a && /* @__PURE__ */ t.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: a })
  ] });
}
function Re({ value: e, onChange: r }) {
  const [a, s] = o.useState(""), i = () => {
    const n = a.trim();
    n && !e.includes(n) && r([...e, n]), s("");
  };
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: e.map((n) => /* @__PURE__ */ t.jsxs(M, { variant: "neutral", children: [
      n,
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${n} etiketini kaldır`,
          onClick: () => r(e.filter((m) => m !== n)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, n)) }),
    /* @__PURE__ */ t.jsx(
      P,
      {
        value: a,
        onChange: (n) => s(n.target.value),
        onKeyDown: (n) => {
          n.key === "Enter" || n.key === "," ? (n.preventDefault(), i()) : n.key === "Backspace" && !a && e.length && r(e.slice(0, -1));
        },
        onBlur: i,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function Be({
  values: e,
  errors: r,
  onFieldChange: a,
  assigneeOptions: s = [],
  isLoadingAssignees: i = !1
}) {
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx(D, { label: "Başlık", htmlFor: "task-title", error: r.title, children: /* @__PURE__ */ t.jsx(
      P,
      {
        id: "task-title",
        value: e.title,
        onChange: (n) => a("title", n.target.value),
        invalid: !!r.title
      }
    ) }),
    /* @__PURE__ */ t.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ t.jsx(D, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ t.jsx(
        "select",
        {
          id: "task-status",
          value: e.status,
          onChange: (n) => a("status", Number(n.target.value)),
          className: ee,
          children: Object.entries(U).map(([n, m]) => /* @__PURE__ */ t.jsx("option", { value: n, children: m.text }, n))
        }
      ) }),
      /* @__PURE__ */ t.jsx(D, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ t.jsx(
        "select",
        {
          id: "task-priority",
          value: e.priority,
          onChange: (n) => a("priority", Number(n.target.value)),
          className: ee,
          children: Object.entries(q).map(([n, m]) => /* @__PURE__ */ t.jsx("option", { value: n, children: m.text }, n))
        }
      ) })
    ] }),
    /* @__PURE__ */ t.jsx(D, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ t.jsx(
      Se,
      {
        id: "task-assignee",
        options: s,
        value: e.assigneeId,
        onChange: (n) => a("assigneeId", n),
        placeholder: i ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: i
      }
    ) }),
    /* @__PURE__ */ t.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ t.jsx(D, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: r.startDate, children: /* @__PURE__ */ t.jsx(
        P,
        {
          id: "task-start",
          type: "date",
          value: e.startDate,
          onChange: (n) => a("startDate", n.target.value),
          invalid: !!r.startDate
        }
      ) }),
      /* @__PURE__ */ t.jsx(D, { label: "Son Tarih", htmlFor: "task-due", error: r.dueDate, children: /* @__PURE__ */ t.jsx(
        P,
        {
          id: "task-due",
          type: "date",
          value: e.dueDate,
          onChange: (n) => a("dueDate", n.target.value),
          invalid: !!r.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ t.jsx(D, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ t.jsx(Re, { value: e.tagNames, onChange: (n) => a("tagNames", n) }) }),
    /* @__PURE__ */ t.jsx(D, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ t.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: e.description,
        onChange: (n) => a("description", n.target.value),
        className: Pe
      }
    ) })
  ] });
}
const te = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : "—";
function A({ label: e, value: r }) {
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("dt", { className: "text-[13px] text-text-tertiary", children: e }),
    /* @__PURE__ */ t.jsx("dd", { className: "mt-0.5 text-text-primary", children: r ?? "—" })
  ] });
}
function ze({ task: e, creatorName: r, lastModifierName: a }) {
  return /* @__PURE__ */ t.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ t.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ t.jsx(A, { label: "Oluşturan", value: r }),
      /* @__PURE__ */ t.jsx(A, { label: "Oluşturulma zamanı", value: te(e.creationTime) }),
      /* @__PURE__ */ t.jsx(A, { label: "Güncelleyen", value: a }),
      /* @__PURE__ */ t.jsx(A, { label: "Son güncelleme zamanı", value: te(e.lastModificationTime) }),
      /* @__PURE__ */ t.jsx(A, { label: "Proje", value: e.projectName })
    ] })
  ] });
}
const Ie = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", Oe = "border-brand-500 text-text-primary";
function Ge({ tabs: e, activeCode: r, onSelect: a, onOpenPicker: s, pickerOpen: i }) {
  const n = o.useRef(/* @__PURE__ */ new Map()), m = (d) => {
    var c;
    a(d.code), (c = n.current.get(d.code)) == null || c.focus();
  }, l = (d, c) => {
    d.key === "ArrowRight" ? (d.preventDefault(), m(e[(c + 1) % e.length])) : d.key === "ArrowLeft" ? (d.preventDefault(), m(e[(c - 1 + e.length) % e.length])) : d.key === "Home" ? (d.preventDefault(), m(e[0])) : d.key === "End" && (d.preventDefault(), m(e[e.length - 1]));
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ t.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: e.map((d, c) => {
      const u = d.code === r;
      return /* @__PURE__ */ t.jsxs(
        "button",
        {
          ref: (h) => {
            h ? n.current.set(d.code, h) : n.current.delete(d.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${d.code}`,
          "aria-selected": u,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: u ? 0 : -1,
          onClick: () => a(d.code),
          onKeyDown: (h) => l(h, c),
          className: `${Ie} ${u ? Oe : ""}`,
          children: [
            /* @__PURE__ */ t.jsx("i", { className: `fa ${d.icon}`, "aria-hidden": "true" }),
            d.title
          ]
        },
        d.code
      );
    }) }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        "aria-label": "Özellik ekle",
        "aria-haspopup": "dialog",
        "aria-expanded": i,
        onClick: s,
        className: "mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
        children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" })
      }
    )
  ] });
}
const Ke = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Me({ entries: e, onAdd: r, onRemove: a, busyCode: s }) {
  const [i, n] = o.useState(""), m = o.useMemo(() => {
    const l = i.trim().toLocaleLowerCase("tr-TR"), d = l ? e.filter((u) => u.title.toLocaleLowerCase("tr-TR").includes(l)) : e, c = /* @__PURE__ */ new Map();
    return d.forEach((u) => {
      const h = c.get(u.category) ?? [];
      h.push(u), c.set(u.category, h);
    }), c;
  }, [e, i]);
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ t.jsx(
          P,
          {
            autoFocus: !0,
            value: i,
            onChange: (l) => n(l.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ t.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          m.size === 0 && /* @__PURE__ */ t.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...m.entries()].map(([l, d]) => /* @__PURE__ */ t.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ t.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Ke[l] ?? l }),
            d.map((c) => /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ t.jsx("i", { className: `fa ${c.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ t.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: c.title }),
              !c.implemented && /* @__PURE__ */ t.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              c.implemented && !c.isAssigned && /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  disabled: s === c.code,
                  onClick: () => r(c.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              c.implemented && c.isAssigned && /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  disabled: s === c.code,
                  onClick: () => a(c.code),
                  className: "text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50",
                  children: "Kaldır"
                }
              )
            ] }, c.code))
          ] }, l))
        ] })
      ]
    }
  );
}
function Ue(e) {
  var a, s, i;
  const r = (i = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : i.task;
  return r ? Promise.resolve(r.get(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function qe(e) {
  return _({
    queryKey: ["task-detail", e],
    queryFn: () => Ue(e),
    enabled: !!e,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function le(e) {
  var r, a, s;
  return !!((s = (a = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.auth) == null ? void 0 : a.isGranted) != null && s.call(a, e));
}
function Ye() {
  const [e, r] = o.useState(!1), [a, s] = o.useState(!1), i = o.useRef(null), n = o.useCallback(() => r(!0), []), m = o.useCallback(() => r(!1), []);
  o.useEffect(() => {
    if (!e) return;
    const c = (u) => {
      u.preventDefault(), u.returnValue = "";
    };
    return window.addEventListener("beforeunload", c), () => window.removeEventListener("beforeunload", c);
  }, [e]);
  const l = o.useCallback((c) => {
    if (!e) {
      c == null || c();
      return;
    }
    i.current = c ?? null, s(!0);
  }, [e]), d = o.useCallback((c) => {
    const u = i.current;
    return s(!1), i.current = null, c === "discard" && (r(!1), u == null || u()), c === "save" ? u : null;
  }, []);
  return { isDirty: e, markDirty: n, markClean: m, requestClose: l, pendingClose: a, resolvePendingClose: d };
}
const _e = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, $ = "task";
function oe() {
  if (typeof window > "u") return null;
  const e = new URLSearchParams(window.location.search).get($);
  return e && _e.test(e) ? e : null;
}
function $e() {
  if (typeof window > "u") return;
  const e = new URL(window.location.href);
  e.searchParams.delete($), window.history.replaceState(null, "", e.pathname + e.search + e.hash);
}
function Ve(e, r) {
  const a = o.useRef(r);
  a.current = r, o.useEffect(() => {
    if (!e || oe() === e) return;
    const s = new URL(window.location.href);
    s.searchParams.set($, e), window.history.pushState({ apyaTask: e }, "", s.pathname + s.search + s.hash);
  }, [e]), o.useEffect(() => {
    const s = () => {
      var i;
      (i = a.current) == null || i.call(a);
    };
    return window.addEventListener("popstate", s), () => window.removeEventListener("popstate", s);
  }, []);
}
const Qe = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: []
};
function He(e) {
  return e ? {
    title: e.title ?? "",
    description: e.description ?? "",
    startDate: e.startDate ? e.startDate.slice(0, 10) : "",
    dueDate: e.dueDate ? e.dueDate.slice(0, 10) : "",
    status: e.status ?? 1,
    priority: e.priority ?? 2,
    assigneeId: e.assigneeId ?? null,
    tagNames: (e.tags ?? []).map((r) => r.name)
  } : Qe;
}
function Je(e) {
  const [r, a] = o.useState(e == null ? void 0 : e.id), s = o.useMemo(() => He(e), [e]), [i, n] = o.useState(s), [m, l] = o.useState({});
  (e == null ? void 0 : e.id) !== r && (a(e == null ? void 0 : e.id), n(s), l({}));
  const d = o.useCallback((v, b) => {
    n((w) => ({ ...w, [v]: b }));
  }, []), c = o.useMemo(
    () => JSON.stringify(i) !== JSON.stringify(s),
    [i, s]
  ), u = o.useCallback(() => {
    const v = {};
    return i.title.trim() || (v.title = "Başlık zorunlu."), i.startDate || (v.startDate = "Başlangıç tarihi zorunlu."), i.dueDate && i.startDate && i.dueDate < i.startDate && (v.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), l(v), Object.keys(v).length === 0;
  }, [i]), h = o.useCallback(() => ({
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
  }), [i, e]), g = o.useCallback(() => {
    n(s), l({});
  }, [s]);
  return { values: i, setField: d, isDirty: c, errors: m, validate: u, toUpdateDto: h, reset: g };
}
function ae(e) {
  return [e.name, e.surname].filter(Boolean).join(" ") || e.userName;
}
function Ze() {
  var r, a, s;
  const e = (s = (a = (r = window == null ? void 0 : window.apya) == null ? void 0 : r.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task;
  return e ? Promise.resolve(e.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function We() {
  var i;
  const e = _({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Ze,
    staleTime: 3e5,
    retry: !1
  }), r = ((i = e.data) == null ? void 0 : i.items) ?? [], a = r.map((n) => ({ value: n.id, label: ae(n) })), s = new Map(r.map((n) => [n.id, ae(n)]));
  return { options: a, nameById: s, isLoading: e.isLoading };
}
function Y() {
  var r, a, s;
  const e = (s = (a = (r = window == null ? void 0 : window.apya) == null ? void 0 : r.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task;
  return e || null;
}
function Xe(e) {
  const r = Y();
  return r ? Promise.resolve(r.getFeatureAssignments(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function et(e) {
  const r = ie(), a = ["task-features", e], s = _({
    queryKey: a,
    queryFn: () => Xe(e),
    enabled: !!e,
    staleTime: 3e4,
    retry: !1
  }), i = () => r.invalidateQueries({ queryKey: a }), n = X({
    mutationFn: (l) => Promise.resolve(Y().addFeature(e, l)),
    onSuccess: i
  }), m = X({
    mutationFn: (l) => Promise.resolve(Y().removeFeature(e, l)),
    onSuccess: i
  });
  return {
    assignedCodes: s.data ?? [],
    isLoading: s.isLoading,
    addFeature: n.mutateAsync,
    removeFeature: m.mutateAsync,
    mutatingCode: n.variables ?? m.variables ?? null,
    isMutating: n.isPending || m.isPending
  };
}
const ce = [
  {
    code: "general",
    title: "Genel",
    icon: "fa-circle-info",
    category: "gorev",
    isCore: !0,
    order: 0,
    permission: null,
    implemented: !0,
    component: null
  },
  {
    code: "subtasks",
    title: "Alt Görevler",
    icon: "fa-list-check",
    category: "gorev",
    isCore: !0,
    order: 1,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "files",
    title: "Dosyalar",
    icon: "fa-paperclip",
    category: "gorev",
    isCore: !0,
    order: 2,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "checklist",
    title: "Kontrol Listesi",
    icon: "fa-square-check",
    category: "gorev",
    isCore: !1,
    order: 10,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "comments",
    title: "Yorumlar",
    icon: "fa-comments",
    category: "iletisim",
    isCore: !1,
    order: 20,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "activity",
    title: "Aktiviteler",
    icon: "fa-timeline",
    category: "gecmis",
    isCore: !1,
    order: 30,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "history",
    title: "Geçmiş",
    icon: "fa-clock-rotate-left",
    category: "gecmis",
    isCore: !1,
    order: 31,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "finance",
    title: "Finans",
    icon: "fa-coins",
    category: "finans",
    isCore: !1,
    order: 40,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "dependencies",
    title: "Bağımlılıklar",
    icon: "fa-diagram-project",
    category: "ileri",
    isCore: !1,
    order: 50,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "risks",
    title: "Riskler",
    icon: "fa-triangle-exclamation",
    category: "ileri",
    isCore: !1,
    order: 51,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "approvals",
    title: "Onaylar",
    icon: "fa-stamp",
    category: "ileri",
    isCore: !1,
    order: 52,
    permission: null,
    implemented: !1,
    component: null
  },
  {
    code: "time-tracking",
    title: "Zaman Takibi",
    icon: "fa-stopwatch",
    category: "ileri",
    isCore: !1,
    order: 53,
    permission: null,
    implemented: !1,
    component: null
  }
];
function tt(e = []) {
  const r = new Set(e);
  return ce.filter((a) => a.implemented && (a.isCore || r.has(a.code))).sort((a, s) => a.order - s.order);
}
function at(e = []) {
  const r = new Set(e);
  return ce.filter((a) => !a.isCore).filter((a) => !a.permission || le(a.permission)).map((a) => ({ ...a, isAssigned: r.has(a.code) })).sort((a, s) => a.order - s.order);
}
let E = null;
const I = /* @__PURE__ */ new Set(), K = /* @__PURE__ */ new Set();
function se() {
  I.forEach((e) => e());
}
function st(e) {
  return typeof e == "string" && e ? e : e && typeof e == "object" && typeof e.id == "string" && e.id ? e.id : null;
}
const k = {
  open(e) {
    const r = st(e);
    !r || r === E || (E = r, se());
  },
  close() {
    E !== null && (E = null, se());
  },
  subscribe(e) {
    return I.add(e), () => I.delete(e);
  },
  getSnapshot() {
    return E;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(e) {
    typeof e == "function" && K.add(e);
  },
  emitResult() {
    K.forEach((e) => e());
  },
  /** Yalnız testler için. */
  reset() {
    E = null, I.clear(), K.clear();
  }
}, re = "apya.taskDetail.fullscreen";
function rt({ taskId: e, presentation: r = "modal", onClose: a }) {
  const { data: s, isLoading: i, isError: n, refetch: m } = qe(e), l = Ye(), d = Je(s), c = We(), u = et(e), [h, g] = o.useState("general"), [v, b] = o.useState(!1), w = B.useRef(null), T = o.useMemo(
    () => tt(u.assignedCodes),
    [u.assignedCodes]
  ), ue = o.useMemo(
    () => at(u.assignedCodes),
    [u.assignedCodes]
  ), N = T.find((p) => p.code === h) ?? T[0];
  B.useEffect(() => {
    N.code !== h && g(N.code);
  }, [N, h]);
  const V = N == null ? void 0 : N.component, Q = ie(), [H, me] = o.useState(
    () => {
      var p;
      return ((p = window.localStorage) == null ? void 0 : p.getItem(re)) === "1";
    }
  ), [J, Z] = o.useState(!1), F = o.useCallback(() => {
    $e(), a == null || a();
  }, [a]);
  Ve(e, F), B.useEffect(() => {
    d.isDirty ? l.markDirty() : l.markClean();
  });
  const O = o.useCallback(() => l.requestClose(F), [l, F]), pe = o.useCallback(() => {
    me((p) => {
      var x;
      const f = !p;
      return (x = window.localStorage) == null || x.setItem(re, f ? "1" : "0"), f;
    });
  }, []), fe = le("Platform.Tasks.Delete"), [xe, G] = o.useState(!1), [ye, W] = o.useState(!1), ve = o.useCallback(async () => {
    var p, f, x, j, y, L;
    W(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(e)), (x = (f = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : f.info) == null || x.call(f, "Başarıyla silindi."), G(!1), l.markClean(), F();
    } catch (S) {
      (L = (y = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : y.error) == null || L.call(y, (S == null ? void 0 : S.message) || "Görev silinemedi.");
    } finally {
      W(!1);
    }
  }, [e, l, F]), R = o.useCallback(async () => {
    var p, f, x, j, y, L;
    if (!d.validate()) return !1;
    Z(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(e, d.toUpdateDto())
      ), await Q.invalidateQueries({ queryKey: ["task-detail", e] }), k.emitResult(), (x = (f = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : f.success) == null || x.call(f, "Kaydedildi."), !0;
    } catch (S) {
      return (L = (y = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : y.error) == null || L.call(y, (S == null ? void 0 : S.message) || "Kaydedilemedi."), !1;
    } finally {
      Z(!1);
    }
  }, [e, d, l, Q]), he = o.useCallback(() => {
    R();
  }, [R]), ge = o.useCallback(async () => {
    const p = l.resolvePendingClose("save");
    await R() && (p == null || p());
  }, [l, R]), be = o.useCallback(async (p) => {
    var f, x, j;
    try {
      await u.addFeature(p), g(p), b(!1);
    } catch (y) {
      (j = (x = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : x.error) == null || j.call(x, (y == null ? void 0 : y.message) || "Özellik eklenemedi.");
    }
  }, [u]), je = o.useCallback(async (p) => {
    var f, x, j;
    try {
      await u.removeFeature(p), g((y) => y === p ? "general" : y);
    } catch (y) {
      (j = (x = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : x.error) == null || j.call(x, (y == null ? void 0 : y.message) || "Özellik kaldırılamadı.");
    }
  }, [u]);
  B.useEffect(() => {
    if (!v) return;
    const p = (x) => {
      w.current && !w.current.contains(x.target) && b(!1);
    }, f = (x) => {
      x.key === "Escape" && b(!1);
    };
    return document.addEventListener("mousedown", p), document.addEventListener("keydown", f), () => {
      document.removeEventListener("mousedown", p), document.removeEventListener("keydown", f);
    };
  }, [v]);
  const we = i ? /* @__PURE__ */ t.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ t.jsx(z, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ t.jsx(z, { className: "h-24 w-full" }),
    /* @__PURE__ */ t.jsx(z, { className: "h-24 w-full" })
  ] }) : n ? /* @__PURE__ */ t.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ t.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ t.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ t.jsx(C, { variant: "ghost", onClick: () => m(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ t.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "relative", ref: w, children: [
      /* @__PURE__ */ t.jsx(
        Ge,
        {
          tabs: T,
          activeCode: h,
          onSelect: g,
          onOpenPicker: () => b((p) => !p),
          pickerOpen: v
        }
      ),
      v && /* @__PURE__ */ t.jsx(
        Me,
        {
          entries: ue,
          busyCode: u.isMutating ? u.mutatingCode : null,
          onAdd: be,
          onRemove: je
        }
      )
    ] }),
    /* @__PURE__ */ t.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${N.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          N.code === "general" ? /* @__PURE__ */ t.jsx(
            Be,
            {
              values: d.values,
              errors: d.errors,
              onFieldChange: d.setField,
              assigneeOptions: c.options,
              isLoadingAssignees: c.isLoading
            }
          ) : /* @__PURE__ */ t.jsx(o.Suspense, { fallback: /* @__PURE__ */ t.jsx(z, { className: "h-24 w-full" }), children: V && /* @__PURE__ */ t.jsx(V, { taskId: e, task: s }) }),
          /* @__PURE__ */ t.jsx(
            ze,
            {
              task: s,
              creatorName: c.nameById.get(s.creatorId),
              lastModifierName: c.nameById.get(s.lastModifierId)
            }
          )
        ]
      }
    )
  ] });
  return /* @__PURE__ */ t.jsxs(
    Te,
    {
      open: !0,
      fullscreen: H,
      onRequestClose: O,
      title: s ? `Görev Detayı: ${s.title}` : "Görev Detayı",
      header: /* @__PURE__ */ t.jsx(
        Fe,
        {
          task: s ?? { title: "Yükleniyor…" },
          canDelete: fe,
          fullscreen: H,
          onToggleFullscreen: pe,
          onClose: O,
          onDelete: () => G(!0)
        }
      ),
      footer: /* @__PURE__ */ t.jsx(
        Ae,
        {
          lastSavedAt: s == null ? void 0 : s.lastModificationTime,
          isDirty: l.isDirty,
          isSaving: J,
          onCancel: O,
          onSave: he
        }
      ),
      children: [
        we,
        l.pendingClose && /* @__PURE__ */ t.jsx(
          it,
          {
            isSaving: J,
            onStay: () => l.resolvePendingClose("stay"),
            onDiscard: () => l.resolvePendingClose("discard"),
            onSaveAndClose: ge
          }
        ),
        xe && /* @__PURE__ */ t.jsx(
          nt,
          {
            taskTitle: (s == null ? void 0 : s.title) ?? "",
            busy: ye,
            onCancel: () => G(!1),
            onConfirm: ve
          }
        )
      ]
    }
  );
}
function nt({ taskTitle: e, busy: r, onCancel: a, onConfirm: s }) {
  const [i, n] = o.useState(""), m = i.trim() === "SİL";
  return /* @__PURE__ */ t.jsxs(
    de,
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
        /* @__PURE__ */ t.jsx(C, { variant: "secondary", onClick: a, disabled: r, children: "İptal" }),
        /* @__PURE__ */ t.jsx(
          C,
          {
            variant: "destructive",
            onClick: s,
            disabled: !m,
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
            onChange: (l) => n(l.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function de({ label: e, title: r, description: a, children: s, actions: i }) {
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      role: "alertdialog",
      "aria-modal": "true",
      "aria-label": e,
      className: "absolute inset-0 z-popover grid place-items-center bg-surface-overlay p-4",
      children: /* @__PURE__ */ t.jsxs("div", { className: "w-full max-w-md rounded-xl border border-default bg-surface-elevated p-[var(--apya-space-5)] shadow-xl", children: [
        /* @__PURE__ */ t.jsx("h3", { className: "text-base font-semibold text-text-primary", children: r }),
        /* @__PURE__ */ t.jsx("p", { className: "mt-2 text-sm text-text-secondary", children: a }),
        s,
        /* @__PURE__ */ t.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: i })
      ] })
    }
  );
}
function it({ isSaving: e, onStay: r, onDiscard: a, onSaveAndClose: s }) {
  return /* @__PURE__ */ t.jsx(
    de,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        /* @__PURE__ */ t.jsx(C, { variant: "secondary", onClick: r, disabled: e, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ t.jsx(C, { variant: "destructive", onClick: a, disabled: e, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ t.jsx(C, { variant: "primary", onClick: s, isLoading: e, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
function lt() {
  const e = o.useSyncExternalStore(
    k.subscribe,
    k.getSnapshot,
    () => null
  );
  return e ? /* @__PURE__ */ t.jsx(Ne, { children: /* @__PURE__ */ t.jsx(
    rt,
    {
      taskId: e,
      presentation: "modal",
      onClose: () => {
        k.close(), k.emitResult();
      }
    }
  ) }) : null;
}
function ot() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : window.localStorage.getItem("apya.taskDetail.v2") === "1";
  } catch {
    return !1;
  }
}
const ne = document.getElementById("task-detail-island");
if (ne && (window.apya = window.apya || {}, window.apya.taskDetailV2Enabled = ot(), window.apya.taskDetail = {
  open: (e) => k.open(e),
  close: () => k.close(),
  onResult: (e) => k.onResult(e)
}, ke(ne).render(/* @__PURE__ */ t.jsx(lt, {})), window.apya.taskDetailV2Enabled)) {
  const e = oe();
  e && k.open(e);
}
