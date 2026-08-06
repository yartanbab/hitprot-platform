import { j as t, r as l, d as je, b as we } from "./react-vendor.js";
/* empty css      */
import { a as ke } from "./QueryProvider.js";
import { u as Y, a as ne, b as W } from "./query-vendor.js";
import { D as Ne, l as De, e as K, B as N, I as L, S as R } from "./Dialog.js";
import { C as Ce } from "./Combobox.js";
function Se({
  open: e,
  onRequestClose: r,
  fullscreen: a,
  title: s,
  header: i,
  footer: n,
  children: p
}) {
  return /* @__PURE__ */ t.jsx(
    Ne,
    {
      open: e,
      onOpenChange: (o) => {
        o || r();
      },
      children: /* @__PURE__ */ t.jsx(
        De,
        {
          title: s,
          fullscreen: a,
          onInteractOutside: (o) => {
            o.preventDefault(), r();
          },
          onEscapeKeyDown: (o) => {
            o.preventDefault(), r();
          },
          children: /* @__PURE__ */ t.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
            i,
            /* @__PURE__ */ t.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: p }),
            n
          ] })
        }
      )
    }
  );
}
function Te({ isPrivate: e }) {
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
const M = {
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
function Ee({
  task: e,
  canDelete: r,
  onClose: a,
  onDelete: s,
  onToggleFullscreen: i,
  fullscreen: n = !1
}) {
  const [p, o] = l.useState(!1), c = l.useRef(null);
  l.useEffect(() => {
    if (!p) return;
    const y = (h) => {
      c.current && !c.current.contains(h.target) && o(!1);
    }, x = (h) => {
      h.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", y), document.addEventListener("keydown", x), () => {
      document.removeEventListener("mousedown", y), document.removeEventListener("keydown", x);
    };
  }, [p]);
  const d = M[e == null ? void 0 : e.status] ?? M[1], m = U[e == null ? void 0 : e.priority] ?? U[2], u = () => {
    var x, h, g, A;
    const y = `${window.location.origin}/Tasks/Detail/${e.id}`;
    (x = navigator.clipboard) == null || x.writeText(y), (A = (g = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : g.info) == null || A.call(g, "Bağlantı kopyalandı."), o(!1);
  };
  return /* @__PURE__ */ t.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ t.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ t.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: e == null ? void 0 : e.title }),
      /* @__PURE__ */ t.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(K, { variant: d.variant, children: d.text }),
        /* @__PURE__ */ t.jsx(K, { variant: m.variant, children: m.text }),
        /* @__PURE__ */ t.jsx(Te, { isPrivate: e == null ? void 0 : e.isPrivate })
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
      /* @__PURE__ */ t.jsxs("div", { className: "relative", ref: c, children: [
        /* @__PURE__ */ t.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": p,
            onClick: () => o((y) => !y),
            className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
            children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-ellipsis", "aria-hidden": "true" })
          }
        ),
        p && /* @__PURE__ */ t.jsxs(
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
                  onClick: u,
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
                      o(!1), s();
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
const Fe = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : null;
function Le({ lastSavedAt: e, isDirty: r, isSaving: a, onCancel: s, onSave: i }) {
  const n = Fe(e);
  return /* @__PURE__ */ t.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: n ? `Son kayıt: ${n}` : " " }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: s, disabled: a, children: "Vazgeç" }),
      /* @__PURE__ */ t.jsx(
        N,
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
const X = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Ae = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function k({ label: e, htmlFor: r, error: a, children: s }) {
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("label", { htmlFor: r, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: e }),
    s,
    a && /* @__PURE__ */ t.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: a })
  ] });
}
function Pe({ value: e, onChange: r }) {
  const [a, s] = l.useState(""), i = () => {
    const n = a.trim();
    n && !e.includes(n) && r([...e, n]), s("");
  };
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: e.map((n) => /* @__PURE__ */ t.jsxs(K, { variant: "neutral", children: [
      n,
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${n} etiketini kaldır`,
          onClick: () => r(e.filter((p) => p !== n)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, n)) }),
    /* @__PURE__ */ t.jsx(
      L,
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
function Re({
  values: e,
  errors: r,
  onFieldChange: a,
  assigneeOptions: s = [],
  isLoadingAssignees: i = !1
}) {
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx(k, { label: "Başlık", htmlFor: "task-title", error: r.title, children: /* @__PURE__ */ t.jsx(
      L,
      {
        id: "task-title",
        value: e.title,
        onChange: (n) => a("title", n.target.value),
        invalid: !!r.title
      }
    ) }),
    /* @__PURE__ */ t.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ t.jsx(k, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ t.jsx(
        "select",
        {
          id: "task-status",
          value: e.status,
          onChange: (n) => a("status", Number(n.target.value)),
          className: X,
          children: Object.entries(M).map(([n, p]) => /* @__PURE__ */ t.jsx("option", { value: n, children: p.text }, n))
        }
      ) }),
      /* @__PURE__ */ t.jsx(k, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ t.jsx(
        "select",
        {
          id: "task-priority",
          value: e.priority,
          onChange: (n) => a("priority", Number(n.target.value)),
          className: X,
          children: Object.entries(U).map(([n, p]) => /* @__PURE__ */ t.jsx("option", { value: n, children: p.text }, n))
        }
      ) })
    ] }),
    /* @__PURE__ */ t.jsx(k, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ t.jsx(
      Ce,
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
      /* @__PURE__ */ t.jsx(k, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: r.startDate, children: /* @__PURE__ */ t.jsx(
        L,
        {
          id: "task-start",
          type: "date",
          value: e.startDate,
          onChange: (n) => a("startDate", n.target.value),
          invalid: !!r.startDate
        }
      ) }),
      /* @__PURE__ */ t.jsx(k, { label: "Son Tarih", htmlFor: "task-due", error: r.dueDate, children: /* @__PURE__ */ t.jsx(
        L,
        {
          id: "task-due",
          type: "date",
          value: e.dueDate,
          onChange: (n) => a("dueDate", n.target.value),
          invalid: !!r.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ t.jsx(k, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ t.jsx(Pe, { value: e.tagNames, onChange: (n) => a("tagNames", n) }) }),
    /* @__PURE__ */ t.jsx(k, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ t.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: e.description,
        onChange: (n) => a("description", n.target.value),
        className: Ae
      }
    ) })
  ] });
}
const ee = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : "—";
function F({ label: e, value: r }) {
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("dt", { className: "text-[13px] text-text-tertiary", children: e }),
    /* @__PURE__ */ t.jsx("dd", { className: "mt-0.5 text-text-primary", children: r ?? "—" })
  ] });
}
function Be({ task: e, creatorName: r, lastModifierName: a }) {
  return /* @__PURE__ */ t.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ t.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ t.jsx(F, { label: "Oluşturan", value: r }),
      /* @__PURE__ */ t.jsx(F, { label: "Oluşturulma zamanı", value: ee(e.creationTime) }),
      /* @__PURE__ */ t.jsx(F, { label: "Güncelleyen", value: a }),
      /* @__PURE__ */ t.jsx(F, { label: "Son güncelleme zamanı", value: ee(e.lastModificationTime) }),
      /* @__PURE__ */ t.jsx(F, { label: "Proje", value: e.projectName })
    ] })
  ] });
}
const Ie = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", ze = "border-brand-500 text-text-primary";
function Oe({ tabs: e, activeCode: r, onSelect: a, onOpenPicker: s, pickerOpen: i }) {
  const n = l.useRef(/* @__PURE__ */ new Map()), p = (c) => {
    var d;
    a(c.code), (d = n.current.get(c.code)) == null || d.focus();
  }, o = (c, d) => {
    c.key === "ArrowRight" ? (c.preventDefault(), p(e[(d + 1) % e.length])) : c.key === "ArrowLeft" ? (c.preventDefault(), p(e[(d - 1 + e.length) % e.length])) : c.key === "Home" ? (c.preventDefault(), p(e[0])) : c.key === "End" && (c.preventDefault(), p(e[e.length - 1]));
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ t.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: e.map((c, d) => {
      const m = c.code === r;
      return /* @__PURE__ */ t.jsxs(
        "button",
        {
          ref: (u) => {
            u ? n.current.set(c.code, u) : n.current.delete(c.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${c.code}`,
          "aria-selected": m,
          "aria-controls": `task-tabpanel-${c.code}`,
          tabIndex: m ? 0 : -1,
          onClick: () => a(c.code),
          onKeyDown: (u) => o(u, d),
          className: `${Ie} ${m ? ze : ""}`,
          children: [
            /* @__PURE__ */ t.jsx("i", { className: `fa ${c.icon}`, "aria-hidden": "true" }),
            c.title
          ]
        },
        c.code
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
const Ge = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Ke({ entries: e, onAdd: r, onRemove: a, busyCode: s, onClose: i }) {
  const [n, p] = l.useState(""), o = l.useRef(null);
  l.useEffect(() => {
    const d = (u) => {
      o.current && !o.current.contains(u.target) && i();
    }, m = (u) => {
      u.key === "Escape" && i();
    };
    return document.addEventListener("mousedown", d), document.addEventListener("keydown", m), () => {
      document.removeEventListener("mousedown", d), document.removeEventListener("keydown", m);
    };
  }, [i]);
  const c = l.useMemo(() => {
    const d = n.trim().toLocaleLowerCase("tr-TR"), m = d ? e.filter((y) => y.title.toLocaleLowerCase("tr-TR").includes(d)) : e, u = /* @__PURE__ */ new Map();
    return m.forEach((y) => {
      const x = u.get(y.category) ?? [];
      x.push(y), u.set(y.category, x);
    }), u;
  }, [e, n]);
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      ref: o,
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ t.jsx(
          L,
          {
            autoFocus: !0,
            value: n,
            onChange: (d) => p(d.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ t.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          c.size === 0 && /* @__PURE__ */ t.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...c.entries()].map(([d, m]) => /* @__PURE__ */ t.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ t.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Ge[d] ?? d }),
            m.map((u) => /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ t.jsx("i", { className: `fa ${u.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ t.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: u.title }),
              !u.implemented && /* @__PURE__ */ t.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              u.implemented && !u.isAssigned && /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  disabled: s === u.code,
                  onClick: () => r(u.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              u.implemented && u.isAssigned && /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  disabled: s === u.code,
                  onClick: () => a(u.code),
                  className: "text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50",
                  children: "Kaldır"
                }
              )
            ] }, u.code))
          ] }, d))
        ] })
      ]
    }
  );
}
function Me(e) {
  var a, s, i;
  const r = (i = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : i.task;
  return r ? Promise.resolve(r.get(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ue(e) {
  return Y({
    queryKey: ["task-detail", e],
    queryFn: () => Me(e),
    enabled: !!e,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function ie(e) {
  var r, a, s;
  return !!((s = (a = (r = window == null ? void 0 : window.abp) == null ? void 0 : r.auth) == null ? void 0 : a.isGranted) != null && s.call(a, e));
}
function qe() {
  const [e, r] = l.useState(!1), [a, s] = l.useState(!1), i = l.useRef(null), n = l.useCallback(() => r(!0), []), p = l.useCallback(() => r(!1), []);
  l.useEffect(() => {
    if (!e) return;
    const d = (m) => {
      m.preventDefault(), m.returnValue = "";
    };
    return window.addEventListener("beforeunload", d), () => window.removeEventListener("beforeunload", d);
  }, [e]);
  const o = l.useCallback((d) => {
    if (!e) {
      d == null || d();
      return;
    }
    i.current = d ?? null, s(!0);
  }, [e]), c = l.useCallback((d) => {
    const m = i.current;
    return s(!1), i.current = null, d === "discard" && (r(!1), m == null || m()), d === "save" ? m : null;
  }, []);
  return { isDirty: e, markDirty: n, markClean: p, requestClose: o, pendingClose: a, resolvePendingClose: c };
}
const Ye = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, $ = "task";
function le() {
  if (typeof window > "u") return null;
  const e = new URLSearchParams(window.location.search).get($);
  return e && Ye.test(e) ? e : null;
}
function $e() {
  if (typeof window > "u") return;
  const e = new URL(window.location.href);
  e.searchParams.delete($), window.history.replaceState(null, "", e.pathname + e.search + e.hash);
}
function _e(e, r) {
  const a = l.useRef(r);
  a.current = r, l.useEffect(() => {
    if (!e || le() === e) return;
    const s = new URL(window.location.href);
    s.searchParams.set($, e), window.history.pushState({ apyaTask: e }, "", s.pathname + s.search + s.hash);
  }, [e]), l.useEffect(() => {
    const s = () => {
      var i;
      (i = a.current) == null || i.call(a);
    };
    return window.addEventListener("popstate", s), () => window.removeEventListener("popstate", s);
  }, []);
}
const Ve = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: []
};
function Qe(e) {
  return e ? {
    title: e.title ?? "",
    description: e.description ?? "",
    startDate: e.startDate ? e.startDate.slice(0, 10) : "",
    dueDate: e.dueDate ? e.dueDate.slice(0, 10) : "",
    status: e.status ?? 1,
    priority: e.priority ?? 2,
    assigneeId: e.assigneeId ?? null,
    tagNames: (e.tags ?? []).map((r) => r.name)
  } : Ve;
}
function He(e) {
  const [r, a] = l.useState(e == null ? void 0 : e.id), s = l.useMemo(() => Qe(e), [e]), [i, n] = l.useState(s), [p, o] = l.useState({});
  (e == null ? void 0 : e.id) !== r && (a(e == null ? void 0 : e.id), n(s), o({}));
  const c = l.useCallback((x, h) => {
    n((g) => ({ ...g, [x]: h }));
  }, []), d = l.useMemo(
    () => JSON.stringify(i) !== JSON.stringify(s),
    [i, s]
  ), m = l.useCallback(() => {
    const x = {};
    return i.title.trim() || (x.title = "Başlık zorunlu."), i.startDate || (x.startDate = "Başlangıç tarihi zorunlu."), i.dueDate && i.startDate && i.dueDate < i.startDate && (x.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), o(x), Object.keys(x).length === 0;
  }, [i]), u = l.useCallback(() => ({
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
  }), [i, e]), y = l.useCallback(() => {
    n(s), o({});
  }, [s]);
  return { values: i, setField: c, isDirty: d, errors: p, validate: m, toUpdateDto: u, reset: y };
}
function te(e) {
  return [e.name, e.surname].filter(Boolean).join(" ") || e.userName;
}
function Je() {
  var r, a, s;
  const e = (s = (a = (r = window == null ? void 0 : window.apya) == null ? void 0 : r.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task;
  return e ? Promise.resolve(e.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ze() {
  var i;
  const e = Y({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Je,
    staleTime: 3e5,
    retry: !1
  }), r = ((i = e.data) == null ? void 0 : i.items) ?? [], a = r.map((n) => ({ value: n.id, label: te(n) })), s = new Map(r.map((n) => [n.id, te(n)]));
  return { options: a, nameById: s, isLoading: e.isLoading };
}
function q() {
  var r, a, s;
  const e = (s = (a = (r = window == null ? void 0 : window.apya) == null ? void 0 : r.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task;
  return e || null;
}
function We(e) {
  const r = q();
  return r ? Promise.resolve(r.getFeatureAssignments(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Xe(e) {
  const r = ne(), a = ["task-features", e], s = Y({
    queryKey: a,
    queryFn: () => We(e),
    enabled: !!e,
    staleTime: 3e4,
    retry: !1
  }), i = () => r.invalidateQueries({ queryKey: a }), n = W({
    mutationFn: (o) => Promise.resolve(q().addFeature(e, o)),
    onSuccess: i
  }), p = W({
    mutationFn: (o) => Promise.resolve(q().removeFeature(e, o)),
    onSuccess: i
  });
  return {
    assignedCodes: s.data ?? [],
    isLoading: s.isLoading,
    addFeature: n.mutateAsync,
    removeFeature: p.mutateAsync,
    mutatingCode: n.variables ?? p.variables ?? null,
    isMutating: n.isPending || p.isPending
  };
}
const oe = [
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
function et(e = []) {
  const r = new Set(e);
  return oe.filter((a) => a.implemented && (a.isCore || r.has(a.code))).sort((a, s) => a.order - s.order);
}
function tt(e = []) {
  const r = new Set(e);
  return oe.filter((a) => !a.isCore).filter((a) => !a.permission || ie(a.permission)).map((a) => ({ ...a, isAssigned: r.has(a.code) })).sort((a, s) => a.order - s.order);
}
let C = null;
const B = /* @__PURE__ */ new Set(), G = /* @__PURE__ */ new Set();
function ae() {
  B.forEach((e) => e());
}
function at(e) {
  return typeof e == "string" && e ? e : e && typeof e == "object" && typeof e.id == "string" && e.id ? e.id : null;
}
const j = {
  open(e) {
    const r = at(e);
    !r || r === C || (C = r, ae());
  },
  close() {
    C !== null && (C = null, ae());
  },
  subscribe(e) {
    return B.add(e), () => B.delete(e);
  },
  getSnapshot() {
    return C;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(e) {
    typeof e == "function" && G.add(e);
  },
  emitResult() {
    G.forEach((e) => e());
  },
  /** Yalnız testler için. */
  reset() {
    C = null, B.clear(), G.clear();
  }
}, se = "apya.taskDetail.fullscreen";
function st({ taskId: e, presentation: r = "modal", onClose: a }) {
  const { data: s, isLoading: i, isError: n, refetch: p } = Ue(e), o = qe(), c = He(s), d = Ze(), m = Xe(e), [u, y] = l.useState("general"), [x, h] = l.useState(!1), g = l.useMemo(
    () => et(m.assignedCodes),
    [m.assignedCodes]
  ), A = l.useMemo(
    () => tt(m.assignedCodes),
    [m.assignedCodes]
  ), I = g.find((f) => f.code === u), _ = I == null ? void 0 : I.component, V = ne(), [Q, de] = l.useState(
    () => {
      var f;
      return ((f = window.localStorage) == null ? void 0 : f.getItem(se)) === "1";
    }
  ), [H, J] = l.useState(!1), S = l.useCallback(() => {
    $e(), a == null || a();
  }, [a]);
  _e(e, S), je.useEffect(() => {
    c.isDirty ? o.markDirty() : o.markClean();
  });
  const z = l.useCallback(() => o.requestClose(S), [o, S]), ue = l.useCallback(() => {
    de((f) => {
      var w;
      const v = !f;
      return (w = window.localStorage) == null || w.setItem(se, v ? "1" : "0"), v;
    });
  }, []), me = ie("Platform.Tasks.Delete"), [pe, O] = l.useState(!1), [fe, Z] = l.useState(!1), xe = l.useCallback(async () => {
    var f, v, w, T, b, E;
    Z(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(e)), (w = (v = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : v.info) == null || w.call(v, "Başarıyla silindi."), O(!1), o.markClean(), S();
    } catch (D) {
      (E = (b = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : b.error) == null || E.call(b, (D == null ? void 0 : D.message) || "Görev silinemedi.");
    } finally {
      Z(!1);
    }
  }, [e, o, S]), P = l.useCallback(async () => {
    var f, v, w, T, b, E;
    if (!c.validate()) return !1;
    J(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(e, c.toUpdateDto())
      ), await V.invalidateQueries({ queryKey: ["task-detail", e] }), j.emitResult(), (w = (v = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : v.success) == null || w.call(v, "Kaydedildi."), !0;
    } catch (D) {
      return (E = (b = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : b.error) == null || E.call(b, (D == null ? void 0 : D.message) || "Kaydedilemedi."), !1;
    } finally {
      J(!1);
    }
  }, [e, c, o, V]), ye = l.useCallback(() => {
    P();
  }, [P]), ve = l.useCallback(async () => {
    const f = o.resolvePendingClose("save");
    await P() && (f == null || f());
  }, [o, P]), he = l.useCallback(async (f) => {
    await m.addFeature(f), y(f), h(!1);
  }, [m]), ge = l.useCallback(async (f) => {
    await m.removeFeature(f), y((v) => v === f ? "general" : v);
  }, [m]), be = i ? /* @__PURE__ */ t.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ t.jsx(R, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ t.jsx(R, { className: "h-24 w-full" }),
    /* @__PURE__ */ t.jsx(R, { className: "h-24 w-full" })
  ] }) : n ? /* @__PURE__ */ t.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ t.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ t.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ t.jsx(N, { variant: "ghost", onClick: () => p(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ t.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ t.jsx(
        Oe,
        {
          tabs: g,
          activeCode: u,
          onSelect: y,
          onOpenPicker: () => h((f) => !f),
          pickerOpen: x
        }
      ),
      x && /* @__PURE__ */ t.jsx(
        Ke,
        {
          entries: A,
          busyCode: m.isMutating ? m.mutatingCode : null,
          onAdd: he,
          onRemove: ge,
          onClose: () => h(!1)
        }
      )
    ] }),
    /* @__PURE__ */ t.jsxs(
      "div",
      {
        role: "tabpanel",
        id: `task-tabpanel-${u}`,
        "aria-labelledby": `task-tab-${u}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          u === "general" ? /* @__PURE__ */ t.jsx(
            Re,
            {
              values: c.values,
              errors: c.errors,
              onFieldChange: c.setField,
              assigneeOptions: d.options,
              isLoadingAssignees: d.isLoading
            }
          ) : /* @__PURE__ */ t.jsx(l.Suspense, { fallback: /* @__PURE__ */ t.jsx(R, { className: "h-24 w-full" }), children: _ && /* @__PURE__ */ t.jsx(_, { taskId: e, task: s }) }),
          /* @__PURE__ */ t.jsx(
            Be,
            {
              task: s,
              creatorName: d.nameById.get(s.creatorId),
              lastModifierName: d.nameById.get(s.lastModifierId)
            }
          )
        ]
      }
    )
  ] });
  return /* @__PURE__ */ t.jsxs(
    Se,
    {
      open: !0,
      fullscreen: Q,
      onRequestClose: z,
      title: s ? `Görev Detayı: ${s.title}` : "Görev Detayı",
      header: /* @__PURE__ */ t.jsx(
        Ee,
        {
          task: s ?? { title: "Yükleniyor…" },
          canDelete: me,
          fullscreen: Q,
          onToggleFullscreen: ue,
          onClose: z,
          onDelete: () => O(!0)
        }
      ),
      footer: /* @__PURE__ */ t.jsx(
        Le,
        {
          lastSavedAt: s == null ? void 0 : s.lastModificationTime,
          isDirty: o.isDirty,
          isSaving: H,
          onCancel: z,
          onSave: ye
        }
      ),
      children: [
        be,
        o.pendingClose && /* @__PURE__ */ t.jsx(
          nt,
          {
            isSaving: H,
            onStay: () => o.resolvePendingClose("stay"),
            onDiscard: () => o.resolvePendingClose("discard"),
            onSaveAndClose: ve
          }
        ),
        pe && /* @__PURE__ */ t.jsx(
          rt,
          {
            taskTitle: (s == null ? void 0 : s.title) ?? "",
            busy: fe,
            onCancel: () => O(!1),
            onConfirm: xe
          }
        )
      ]
    }
  );
}
function rt({ taskTitle: e, busy: r, onCancel: a, onConfirm: s }) {
  const [i, n] = l.useState(""), p = i.trim() === "SİL";
  return /* @__PURE__ */ t.jsxs(
    ce,
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
        /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: a, disabled: r, children: "İptal" }),
        /* @__PURE__ */ t.jsx(
          N,
          {
            variant: "destructive",
            onClick: s,
            disabled: !p,
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
            onChange: (o) => n(o.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function ce({ label: e, title: r, description: a, children: s, actions: i }) {
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
function nt({ isSaving: e, onStay: r, onDiscard: a, onSaveAndClose: s }) {
  return /* @__PURE__ */ t.jsx(
    ce,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: r, disabled: e, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ t.jsx(N, { variant: "destructive", onClick: a, disabled: e, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ t.jsx(N, { variant: "primary", onClick: s, isLoading: e, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
function it() {
  const e = l.useSyncExternalStore(
    j.subscribe,
    j.getSnapshot,
    () => null
  );
  return e ? /* @__PURE__ */ t.jsx(ke, { children: /* @__PURE__ */ t.jsx(
    st,
    {
      taskId: e,
      presentation: "modal",
      onClose: () => {
        j.close(), j.emitResult();
      }
    }
  ) }) : null;
}
function lt() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : window.localStorage.getItem("apya.taskDetail.v2") === "1";
  } catch {
    return !1;
  }
}
const re = document.getElementById("task-detail-island");
if (re && (window.apya = window.apya || {}, window.apya.taskDetailV2Enabled = lt(), window.apya.taskDetail = {
  open: (e) => j.open(e),
  close: () => j.close(),
  onResult: (e) => j.onResult(e)
}, we(re).render(/* @__PURE__ */ t.jsx(it, {})), window.apya.taskDetailV2Enabled)) {
  const e = le();
  e && j.open(e);
}
