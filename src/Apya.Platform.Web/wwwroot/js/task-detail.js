import { j as t, r as o, d as I, b as Fe } from "./react-vendor.js";
/* empty css      */
import { a as Ae } from "./QueryProvider.js";
import { u as U, a as $, b as G } from "./query-vendor.js";
import { D as Pe, l as Le, e as M, B as N, I as A, S as K } from "./Dialog.js";
import { C as Be } from "./Combobox.js";
import { r as Re } from "./httpClient.js";
function Ie({
  open: e,
  onRequestClose: s,
  fullscreen: a,
  title: r,
  header: i,
  footer: n,
  children: u
}) {
  return /* @__PURE__ */ t.jsx(
    Pe,
    {
      open: e,
      onOpenChange: (l) => {
        l || s();
      },
      children: /* @__PURE__ */ t.jsx(
        Le,
        {
          title: r,
          fullscreen: a,
          onInteractOutside: (l) => {
            l.preventDefault(), s();
          },
          onEscapeKeyDown: (l) => {
            l.preventDefault(), s();
          },
          children: /* @__PURE__ */ t.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
            i,
            /* @__PURE__ */ t.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: u }),
            n
          ] })
        }
      )
    }
  );
}
function ze({ isPrivate: e }) {
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
const O = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, J = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function Ke({
  task: e,
  canDelete: s,
  onClose: a,
  onDelete: r,
  onToggleFullscreen: i,
  fullscreen: n = !1
}) {
  const [u, l] = o.useState(!1), c = o.useRef(null);
  o.useEffect(() => {
    if (!u) return;
    const m = (h) => {
      c.current && !c.current.contains(h.target) && l(!1);
    }, p = (h) => {
      h.key === "Escape" && l(!1);
    };
    return document.addEventListener("mousedown", m), document.addEventListener("keydown", p), () => {
      document.removeEventListener("mousedown", m), document.removeEventListener("keydown", p);
    };
  }, [u]);
  const d = O[e == null ? void 0 : e.status] ?? O[1], y = J[e == null ? void 0 : e.priority] ?? J[2], f = () => {
    var p, h, b, j;
    const m = `${window.location.origin}/Tasks/Detail/${e.id}`;
    (p = navigator.clipboard) == null || p.writeText(m), (j = (b = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : b.info) == null || j.call(b, "Bağlantı kopyalandı."), l(!1);
  };
  return /* @__PURE__ */ t.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ t.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ t.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: e == null ? void 0 : e.title }),
      /* @__PURE__ */ t.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(M, { variant: d.variant, children: d.text }),
        /* @__PURE__ */ t.jsx(M, { variant: y.variant, children: y.text }),
        /* @__PURE__ */ t.jsx(ze, { isPrivate: e == null ? void 0 : e.isPrivate })
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
            "aria-expanded": u,
            onClick: () => l((m) => !m),
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
                  onClick: f,
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
              s && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
                /* @__PURE__ */ t.jsx("div", { className: "my-1 h-px bg-border-subtle" }),
                /* @__PURE__ */ t.jsxs(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    onClick: () => {
                      l(!1), r();
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
const qe = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : null;
function Ge({ lastSavedAt: e, isDirty: s, isSaving: a, onCancel: r, onSave: i }) {
  const n = qe(e);
  return /* @__PURE__ */ t.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: n ? `Son kayıt: ${n}` : " " }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: r, disabled: a, children: "Vazgeç" }),
      /* @__PURE__ */ t.jsx(
        N,
        {
          variant: "primary",
          onClick: () => i == null ? void 0 : i(),
          disabled: !s || !i,
          isLoading: a,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
const ne = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Me = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function S({ label: e, htmlFor: s, error: a, children: r }) {
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("label", { htmlFor: s, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: e }),
    r,
    a && /* @__PURE__ */ t.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: a })
  ] });
}
function Oe({ value: e, onChange: s }) {
  const [a, r] = o.useState(""), i = () => {
    const n = a.trim();
    n && !e.includes(n) && s([...e, n]), r("");
  };
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: e.map((n) => /* @__PURE__ */ t.jsxs(M, { variant: "neutral", children: [
      n,
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${n} etiketini kaldır`,
          onClick: () => s(e.filter((u) => u !== n)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, n)) }),
    /* @__PURE__ */ t.jsx(
      A,
      {
        value: a,
        onChange: (n) => r(n.target.value),
        onKeyDown: (n) => {
          n.key === "Enter" || n.key === "," ? (n.preventDefault(), i()) : n.key === "Backspace" && !a && e.length && s(e.slice(0, -1));
        },
        onBlur: i,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function Ue({
  values: e,
  errors: s,
  onFieldChange: a,
  assigneeOptions: r = [],
  isLoadingAssignees: i = !1
}) {
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx(S, { label: "Başlık", htmlFor: "task-title", error: s.title, children: /* @__PURE__ */ t.jsx(
      A,
      {
        id: "task-title",
        value: e.title,
        onChange: (n) => a("title", n.target.value),
        invalid: !!s.title
      }
    ) }),
    /* @__PURE__ */ t.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ t.jsx(S, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ t.jsx(
        "select",
        {
          id: "task-status",
          value: e.status,
          onChange: (n) => a("status", Number(n.target.value)),
          className: ne,
          children: Object.entries(O).map(([n, u]) => /* @__PURE__ */ t.jsx("option", { value: n, children: u.text }, n))
        }
      ) }),
      /* @__PURE__ */ t.jsx(S, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ t.jsx(
        "select",
        {
          id: "task-priority",
          value: e.priority,
          onChange: (n) => a("priority", Number(n.target.value)),
          className: ne,
          children: Object.entries(J).map(([n, u]) => /* @__PURE__ */ t.jsx("option", { value: n, children: u.text }, n))
        }
      ) })
    ] }),
    /* @__PURE__ */ t.jsx(S, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ t.jsx(
      Be,
      {
        id: "task-assignee",
        options: r,
        value: e.assigneeId,
        onChange: (n) => a("assigneeId", n),
        placeholder: i ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: i
      }
    ) }),
    /* @__PURE__ */ t.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ t.jsx(S, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: s.startDate, children: /* @__PURE__ */ t.jsx(
        A,
        {
          id: "task-start",
          type: "date",
          value: e.startDate,
          onChange: (n) => a("startDate", n.target.value),
          invalid: !!s.startDate
        }
      ) }),
      /* @__PURE__ */ t.jsx(S, { label: "Son Tarih", htmlFor: "task-due", error: s.dueDate, children: /* @__PURE__ */ t.jsx(
        A,
        {
          id: "task-due",
          type: "date",
          value: e.dueDate,
          onChange: (n) => a("dueDate", n.target.value),
          invalid: !!s.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ t.jsx(S, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ t.jsx(Oe, { value: e.tagNames, onChange: (n) => a("tagNames", n) }) }),
    /* @__PURE__ */ t.jsx(S, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ t.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: e.description,
        onChange: (n) => a("description", n.target.value),
        className: Me
      }
    ) })
  ] });
}
const ie = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : "—";
function R({ label: e, value: s }) {
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("dt", { className: "text-[13px] text-text-tertiary", children: e }),
    /* @__PURE__ */ t.jsx("dd", { className: "mt-0.5 text-text-primary", children: s ?? "—" })
  ] });
}
function $e({ task: e, creatorName: s, lastModifierName: a }) {
  return /* @__PURE__ */ t.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ t.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ t.jsx(R, { label: "Oluşturan", value: s }),
      /* @__PURE__ */ t.jsx(R, { label: "Oluşturulma zamanı", value: ie(e.creationTime) }),
      /* @__PURE__ */ t.jsx(R, { label: "Güncelleyen", value: a }),
      /* @__PURE__ */ t.jsx(R, { label: "Son güncelleme zamanı", value: ie(e.lastModificationTime) }),
      /* @__PURE__ */ t.jsx(R, { label: "Proje", value: e.projectName })
    ] })
  ] });
}
const Ye = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", _e = "border-brand-500 text-text-primary";
function Ve({ tabs: e, activeCode: s, onSelect: a, onOpenPicker: r, pickerOpen: i }) {
  const n = o.useRef(/* @__PURE__ */ new Map()), u = (c) => {
    var d;
    a(c.code), (d = n.current.get(c.code)) == null || d.focus();
  }, l = (c, d) => {
    c.key === "ArrowRight" ? (c.preventDefault(), u(e[(d + 1) % e.length])) : c.key === "ArrowLeft" ? (c.preventDefault(), u(e[(d - 1 + e.length) % e.length])) : c.key === "Home" ? (c.preventDefault(), u(e[0])) : c.key === "End" && (c.preventDefault(), u(e[e.length - 1]));
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ t.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: e.map((c, d) => {
      const y = c.code === s;
      return /* @__PURE__ */ t.jsxs(
        "button",
        {
          ref: (f) => {
            f ? n.current.set(c.code, f) : n.current.delete(c.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${c.code}`,
          "aria-selected": y,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: y ? 0 : -1,
          onClick: () => a(c.code),
          onKeyDown: (f) => l(f, d),
          className: `${Ye} ${y ? _e : ""}`,
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
        onClick: r,
        className: "mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
        children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" })
      }
    )
  ] });
}
const Qe = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function He({ entries: e, onAdd: s, onRemove: a, busyCode: r }) {
  const [i, n] = o.useState(""), u = o.useMemo(() => {
    const l = i.trim().toLocaleLowerCase("tr-TR"), c = l ? e.filter((y) => y.title.toLocaleLowerCase("tr-TR").includes(l)) : e, d = /* @__PURE__ */ new Map();
    return c.forEach((y) => {
      const f = d.get(y.category) ?? [];
      f.push(y), d.set(y.category, f);
    }), d;
  }, [e, i]);
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ t.jsx(
          A,
          {
            autoFocus: !0,
            value: i,
            onChange: (l) => n(l.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ t.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          u.size === 0 && /* @__PURE__ */ t.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...u.entries()].map(([l, c]) => /* @__PURE__ */ t.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ t.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Qe[l] ?? l }),
            c.map((d) => /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ t.jsx("i", { className: `fa ${d.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ t.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: d.title }),
              !d.implemented && /* @__PURE__ */ t.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              d.implemented && !d.isAssigned && /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === d.code,
                  onClick: () => s(d.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              d.implemented && d.isAssigned && /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === d.code,
                  onClick: () => a(d.code),
                  className: "text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50",
                  children: "Kaldır"
                }
              )
            ] }, d.code))
          ] }, l))
        ] })
      ]
    }
  );
}
function Je({ trail: e = [], current: s, onNavigate: a }) {
  return e.length === 0 ? null : /* @__PURE__ */ t.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    e.map((r) => /* @__PURE__ */ t.jsxs(I.Fragment, { children: [
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          onClick: () => a == null ? void 0 : a(r.id),
          className: "hover:underline hover:text-text-primary",
          children: r.title
        }
      ),
      /* @__PURE__ */ t.jsx("span", { "aria-hidden": "true", children: "/" })
    ] }, r.id)),
    /* @__PURE__ */ t.jsx("span", { className: "font-medium text-text-primary", children: s.title })
  ] });
}
function Ze(e) {
  var a, r, i;
  const s = (i = (r = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : r.tasks) == null ? void 0 : i.task;
  return s ? Promise.resolve(s.get(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function We(e) {
  return U({
    queryKey: ["task-detail", e],
    queryFn: () => Ze(e),
    enabled: !!e,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function ue(e) {
  var s, a, r;
  return !!((r = (a = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.auth) == null ? void 0 : a.isGranted) != null && r.call(a, e));
}
function Xe() {
  const [e, s] = o.useState(!1), [a, r] = o.useState(!1), i = o.useRef(null), n = o.useCallback(() => s(!0), []), u = o.useCallback(() => s(!1), []);
  o.useEffect(() => {
    if (!e) return;
    const d = (y) => {
      y.preventDefault(), y.returnValue = "";
    };
    return window.addEventListener("beforeunload", d), () => window.removeEventListener("beforeunload", d);
  }, [e]);
  const l = o.useCallback((d) => {
    if (!e) {
      d == null || d();
      return;
    }
    i.current = d ?? null, r(!0);
  }, [e]), c = o.useCallback((d) => {
    const y = i.current;
    return r(!1), i.current = null, d === "discard" && (s(!1), y == null || y()), d === "save" ? y : null;
  }, []);
  return { isDirty: e, markDirty: n, markClean: u, requestClose: l, pendingClose: a, resolvePendingClose: c };
}
const et = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, W = "task";
function me() {
  if (typeof window > "u") return null;
  const e = new URLSearchParams(window.location.search).get(W);
  return e && et.test(e) ? e : null;
}
function tt() {
  if (typeof window > "u") return;
  const e = new URL(window.location.href);
  e.searchParams.delete(W), window.history.replaceState(null, "", e.pathname + e.search + e.hash);
}
function at(e, s) {
  const a = o.useRef(s);
  a.current = s, o.useEffect(() => {
    if (!e || me() === e) return;
    const r = new URL(window.location.href);
    r.searchParams.set(W, e), window.history.pushState({ apyaTask: e }, "", r.pathname + r.search + r.hash);
  }, [e]), o.useEffect(() => {
    const r = () => {
      var i;
      (i = a.current) == null || i.call(a);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const st = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: []
};
function rt(e) {
  return e ? {
    title: e.title ?? "",
    description: e.description ?? "",
    startDate: e.startDate ? e.startDate.slice(0, 10) : "",
    dueDate: e.dueDate ? e.dueDate.slice(0, 10) : "",
    status: e.status ?? 1,
    priority: e.priority ?? 2,
    assigneeId: e.assigneeId ?? null,
    tagNames: (e.tags ?? []).map((s) => s.name)
  } : st;
}
function nt(e) {
  const [s, a] = o.useState(e == null ? void 0 : e.id), r = o.useMemo(() => rt(e), [e]), [i, n] = o.useState(r), [u, l] = o.useState({});
  (e == null ? void 0 : e.id) !== s && (a(e == null ? void 0 : e.id), n(r), l({}));
  const c = o.useCallback((p, h) => {
    n((b) => ({ ...b, [p]: h }));
  }, []), d = o.useMemo(
    () => JSON.stringify(i) !== JSON.stringify(r),
    [i, r]
  ), y = o.useCallback(() => {
    const p = {};
    return i.title.trim() || (p.title = "Başlık zorunlu."), i.startDate || (p.startDate = "Başlangıç tarihi zorunlu."), i.dueDate && i.startDate && i.dueDate < i.startDate && (p.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), l(p), Object.keys(p).length === 0;
  }, [i]), f = o.useCallback(() => ({
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
  }), [i, e]), m = o.useCallback(() => {
    n(r), l({});
  }, [r]);
  return { values: i, setField: c, isDirty: d, errors: u, validate: y, toUpdateDto: f, reset: m };
}
function le(e) {
  return [e.name, e.surname].filter(Boolean).join(" ") || e.userName;
}
function it() {
  var s, a, r;
  const e = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return e ? Promise.resolve(e.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function lt() {
  var i;
  const e = U({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: it,
    staleTime: 3e5,
    retry: !1
  }), s = ((i = e.data) == null ? void 0 : i.items) ?? [], a = s.map((n) => ({ value: n.id, label: le(n) })), r = new Map(s.map((n) => [n.id, le(n)]));
  return { options: a, nameById: r, isLoading: e.isLoading };
}
function Z() {
  var s, a, r;
  const e = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return e || null;
}
function ot(e) {
  const s = Z();
  return s ? Promise.resolve(s.getFeatureAssignments(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ct(e) {
  const s = $(), a = ["task-features", e], r = U({
    queryKey: a,
    queryFn: () => ot(e),
    enabled: !!e,
    staleTime: 3e4,
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), n = G({
    mutationFn: (l) => Promise.resolve(Z().addFeature(e, l)),
    onSuccess: i
  }), u = G({
    mutationFn: (l) => Promise.resolve(Z().removeFeature(e, l)),
    onSuccess: i
  });
  return {
    assignedCodes: r.data ?? [],
    isLoading: r.isLoading,
    addFeature: n.mutateAsync,
    removeFeature: u.mutateAsync,
    mutatingCode: n.variables ?? u.variables ?? null,
    isMutating: n.isPending || u.isPending
  };
}
function dt({ taskId: e, task: s, onOpenSubtask: a }) {
  const [r, i] = o.useState(""), [n, u] = o.useState(!1), l = $(), c = (s == null ? void 0 : s.subTasks) ?? [], d = () => l.invalidateQueries({ queryKey: ["task-detail", e] }), y = async () => {
    var p, h, b;
    const m = r.trim();
    if (m) {
      u(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: m,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: e,
          projectId: s == null ? void 0 : s.projectId
        })), i(""), await d();
      } catch (j) {
        (b = (h = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : h.error) == null || b.call(h, (j == null ? void 0 : j.message) || "Alt görev eklenemedi.");
      } finally {
        u(!1);
      }
    }
  }, f = async (m) => {
    var p, h, b;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(m)), await d();
    } catch (j) {
      (b = (h = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : h.error) == null || b.call(h, (j == null ? void 0 : j.message) || "Alt görev silinemedi.");
    }
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ t.jsx(
        A,
        {
          value: r,
          onChange: (m) => i(m.target.value),
          onKeyDown: (m) => {
            m.key === "Enter" && y();
          },
          placeholder: "Yeni alt görev başlığı",
          disabled: n
        }
      ),
      /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: y, disabled: n || !r.trim(), children: "Alt Görev Ekle" })
    ] }),
    c.length === 0 ? /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ t.jsx("ul", { className: "divide-y divide-border-default", children: c.map((m) => {
      var p;
      return /* @__PURE__ */ t.jsxs("li", { className: "flex items-center justify-between py-2", children: [
        /* @__PURE__ */ t.jsx(
          "button",
          {
            type: "button",
            onClick: () => a == null ? void 0 : a(m.id, m.title),
            className: "text-left text-sm font-medium text-text-primary hover:underline",
            children: m.title
          }
        ),
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ t.jsx(M, { variant: "neutral", children: ((p = O[m.status]) == null ? void 0 : p.text) ?? m.status }),
          /* @__PURE__ */ t.jsx(N, { variant: "ghost", onClick: () => f(m.id), "aria-label": `${m.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, m.id);
    }) })
  ] });
}
function fe() {
  var s, a, r;
  const e = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return e || null;
}
function ut(e) {
  const s = fe();
  return s ? Promise.resolve(s.getAttachments(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function mt(e, s) {
  const a = new FormData();
  a.append("file", s);
  const r = {}, i = Re();
  i && (r.RequestVerificationToken = i);
  const n = await fetch(`/api/tasks/attachments/upload/${e}`, {
    method: "POST",
    credentials: "include",
    headers: r,
    body: a
  }), u = await n.json();
  if (!n.ok || (u == null ? void 0 : u.success) === !1)
    throw new Error((u == null ? void 0 : u.error) || "Dosya yüklenemedi.");
  return u;
}
function ft(e) {
  const s = $(), a = ["task-attachments", e], r = U({
    queryKey: a,
    queryFn: () => ut(e),
    enabled: !!e,
    staleTime: 3e4,
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), n = G({
    mutationFn: (l) => mt(e, l),
    onSuccess: i
  }), u = G({
    mutationFn: (l) => Promise.resolve(fe().deleteAttachment(l)),
    onSuccess: i
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: n.mutateAsync,
    remove: u.mutateAsync,
    isUploading: n.isPending
  };
}
function pt(e) {
  return `${Math.round(e / 1024)} KB`;
}
function xt({ taskId: e }) {
  const { attachments: s, upload: a, remove: r, isUploading: i } = ft(e), n = o.useRef(null), u = async (c) => {
    var y, f, m, p, h, b, j;
    const d = (y = c.target.files) == null ? void 0 : y[0];
    if (d)
      try {
        await a(d), (p = (m = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : m.success) == null || p.call(m, "Dosya yüklendi.");
      } catch (T) {
        (j = (b = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : b.error) == null || j.call(b, (T == null ? void 0 : T.message) || "Dosya yüklenemedi.");
      } finally {
        n.current && (n.current.value = "");
      }
  }, l = async (c, d) => {
    var y, f, m;
    try {
      await r(c);
    } catch (p) {
      (m = (f = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : f.error) == null || m.call(f, (p == null ? void 0 : p.message) || `${d} silinemedi.`);
    }
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ t.jsx("input", { ref: n, type: "file", onChange: u, className: "text-sm", disabled: i }),
      i && /* @__PURE__ */ t.jsx("span", { className: "text-sm text-text-tertiary", children: "Yükleniyor…" })
    ] }),
    s.length === 0 ? /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ t.jsx("ul", { className: "divide-y divide-border-default", children: s.map((c) => /* @__PURE__ */ t.jsxs("li", { className: "flex items-center justify-between py-2", children: [
      /* @__PURE__ */ t.jsxs("div", { children: [
        /* @__PURE__ */ t.jsx("a", { href: c.downloadUrl, target: "_blank", rel: "noreferrer", className: "text-sm font-medium text-text-primary hover:underline", children: c.fileName }),
        /* @__PURE__ */ t.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          pt(c.fileSize),
          " — ",
          c.uploaderName
        ] })
      ] }),
      /* @__PURE__ */ t.jsx(N, { variant: "ghost", onClick: () => l(c.id, c.fileName), "aria-label": `${c.fileName} dosyasini sil`, children: "Sil" })
    ] }, c.id)) })
  ] });
}
const pe = [
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
    implemented: !0,
    component: dt
  },
  {
    code: "files",
    title: "Dosyalar",
    icon: "fa-paperclip",
    category: "gorev",
    isCore: !0,
    order: 2,
    permission: null,
    implemented: !0,
    component: xt
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
function yt(e = []) {
  const s = new Set(e);
  return pe.filter((a) => a.implemented && (a.isCore || s.has(a.code))).sort((a, r) => a.order - r.order);
}
function ht(e = []) {
  const s = new Set(e);
  return pe.filter((a) => !a.isCore).filter((a) => !a.permission || ue(a.permission)).map((a) => ({ ...a, isAssigned: s.has(a.code) })).sort((a, r) => a.order - r.order);
}
let F = null;
const q = /* @__PURE__ */ new Set(), H = /* @__PURE__ */ new Set();
function oe() {
  q.forEach((e) => e());
}
function vt(e) {
  return typeof e == "string" && e ? e : e && typeof e == "object" && typeof e.id == "string" && e.id ? e.id : null;
}
const D = {
  open(e) {
    const s = vt(e);
    !s || s === F || (F = s, oe());
  },
  close() {
    F !== null && (F = null, oe());
  },
  subscribe(e) {
    return q.add(e), () => q.delete(e);
  },
  getSnapshot() {
    return F;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(e) {
    typeof e == "function" && H.add(e);
  },
  emitResult() {
    H.forEach((e) => e());
  },
  /** Yalnız testler için. */
  reset() {
    F = null, q.clear(), H.clear();
  }
}, ce = "apya.taskDetail.fullscreen";
function gt({ taskId: e, presentation: s = "modal", onClose: a }) {
  const [r, i] = o.useState(e), [n, u] = o.useState([]), { data: l, isLoading: c, isError: d, refetch: y } = We(r), f = Xe(), m = nt(l), p = lt(), h = ct(r), [b, j] = o.useState("general"), [T, P] = o.useState(!1), Y = I.useRef(null), _ = o.useMemo(
    () => yt(h.assignedCodes),
    [h.assignedCodes]
  ), ye = o.useMemo(
    () => ht(h.assignedCodes),
    [h.assignedCodes]
  ), C = _.find((x) => x.code === b) ?? _[0];
  I.useEffect(() => {
    C.code !== b && j(C.code);
  }, [C, b]);
  const X = C == null ? void 0 : C.component, ee = $(), [te, he] = o.useState(
    () => {
      var x;
      return ((x = window.localStorage) == null ? void 0 : x.getItem(ce)) === "1";
    }
  ), [ae, se] = o.useState(!1), L = o.useCallback(() => {
    tt(), a == null || a();
  }, [a]);
  at(e, L), I.useEffect(() => {
    m.isDirty ? f.markDirty() : f.markClean();
  });
  const V = o.useCallback(() => f.requestClose(L), [f, L]), ve = o.useCallback(() => {
    he((x) => {
      var g;
      const v = !x;
      return (g = window.localStorage) == null || g.setItem(ce, v ? "1" : "0"), v;
    });
  }, []), ge = ue("Platform.Tasks.Delete"), [be, Q] = o.useState(!1), [je, re] = o.useState(!1), we = o.useCallback(async () => {
    var x, v, g, k, w, B;
    re(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (g = (v = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : v.info) == null || g.call(v, "Başarıyla silindi."), Q(!1), f.markClean(), L();
    } catch (E) {
      (B = (w = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : w.error) == null || B.call(w, (E == null ? void 0 : E.message) || "Görev silinemedi.");
    } finally {
      re(!1);
    }
  }, [r, f, L]), z = o.useCallback(async () => {
    var x, v, g, k, w, B;
    if (!m.validate()) return !1;
    se(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, m.toUpdateDto())
      ), await ee.invalidateQueries({ queryKey: ["task-detail", r] }), D.emitResult(), (g = (v = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : v.success) == null || g.call(v, "Kaydedildi."), !0;
    } catch (E) {
      return (B = (w = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : w.error) == null || B.call(w, (E == null ? void 0 : E.message) || "Kaydedilemedi."), !1;
    } finally {
      se(!1);
    }
  }, [r, m, f, ee]), ke = o.useCallback(() => {
    z();
  }, [z]), Ne = o.useCallback(async () => {
    const x = f.resolvePendingClose("save");
    await z() && (x == null || x());
  }, [f, z]), Ce = o.useCallback((x, v) => {
    f.requestClose(() => {
      u((g) => [...g, { id: r, title: (l == null ? void 0 : l.title) ?? "" }]), i(x), j("general"), f.markClean();
    });
  }, [f, r, l]), De = o.useCallback((x) => {
    f.requestClose(() => {
      u((v) => {
        const g = v.findIndex((k) => k.id === x);
        return g === -1 ? v : v.slice(0, g);
      }), i(x), j("general"), f.markClean();
    });
  }, [f]), Te = o.useCallback(async (x) => {
    var v, g, k;
    try {
      await h.addFeature(x), j(x), P(!1);
    } catch (w) {
      (k = (g = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : g.error) == null || k.call(g, (w == null ? void 0 : w.message) || "Özellik eklenemedi.");
    }
  }, [h]), Se = o.useCallback(async (x) => {
    var v, g, k;
    try {
      await h.removeFeature(x), j((w) => w === x ? "general" : w);
    } catch (w) {
      (k = (g = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : g.error) == null || k.call(g, (w == null ? void 0 : w.message) || "Özellik kaldırılamadı.");
    }
  }, [h]);
  I.useEffect(() => {
    if (!T) return;
    const x = (g) => {
      Y.current && !Y.current.contains(g.target) && P(!1);
    }, v = (g) => {
      g.key === "Escape" && P(!1);
    };
    return document.addEventListener("mousedown", x), document.addEventListener("keydown", v), () => {
      document.removeEventListener("mousedown", x), document.removeEventListener("keydown", v);
    };
  }, [T]);
  const Ee = c ? /* @__PURE__ */ t.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ t.jsx(K, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ t.jsx(K, { className: "h-24 w-full" }),
    /* @__PURE__ */ t.jsx(K, { className: "h-24 w-full" })
  ] }) : d ? /* @__PURE__ */ t.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ t.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ t.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ t.jsx(N, { variant: "ghost", onClick: () => y(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ t.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx(
      Je,
      {
        trail: n,
        current: { id: r, title: (l == null ? void 0 : l.title) ?? "" },
        onNavigate: De
      }
    ),
    /* @__PURE__ */ t.jsxs("div", { className: "relative", ref: Y, children: [
      /* @__PURE__ */ t.jsx(
        Ve,
        {
          tabs: _,
          activeCode: C.code,
          onSelect: (x) => {
            j(x), P(!1);
          },
          onOpenPicker: () => P((x) => !x),
          pickerOpen: T
        }
      ),
      T && /* @__PURE__ */ t.jsx(
        He,
        {
          entries: ye,
          busyCode: h.isMutating ? h.mutatingCode : null,
          onAdd: Te,
          onRemove: Se
        }
      )
    ] }),
    /* @__PURE__ */ t.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${C.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          C.code === "general" ? /* @__PURE__ */ t.jsx(
            Ue,
            {
              values: m.values,
              errors: m.errors,
              onFieldChange: m.setField,
              assigneeOptions: p.options,
              isLoadingAssignees: p.isLoading
            }
          ) : /* @__PURE__ */ t.jsx(o.Suspense, { fallback: /* @__PURE__ */ t.jsx(K, { className: "h-24 w-full" }), children: X && /* @__PURE__ */ t.jsx(
            X,
            {
              taskId: r,
              task: l,
              onOpenSubtask: Ce
            }
          ) }),
          /* @__PURE__ */ t.jsx(
            $e,
            {
              task: l,
              creatorName: p.nameById.get(l.creatorId),
              lastModifierName: p.nameById.get(l.lastModifierId)
            }
          )
        ]
      }
    )
  ] });
  return /* @__PURE__ */ t.jsxs(
    Ie,
    {
      open: !0,
      fullscreen: te,
      onRequestClose: V,
      title: l ? `Görev Detayı: ${l.title}` : "Görev Detayı",
      header: /* @__PURE__ */ t.jsx(
        Ke,
        {
          task: l ?? { title: "Yükleniyor…" },
          canDelete: ge,
          fullscreen: te,
          onToggleFullscreen: ve,
          onClose: V,
          onDelete: () => Q(!0)
        }
      ),
      footer: /* @__PURE__ */ t.jsx(
        Ge,
        {
          lastSavedAt: l == null ? void 0 : l.lastModificationTime,
          isDirty: f.isDirty,
          isSaving: ae,
          onCancel: V,
          onSave: ke
        }
      ),
      children: [
        Ee,
        f.pendingClose && /* @__PURE__ */ t.jsx(
          jt,
          {
            isSaving: ae,
            onStay: () => f.resolvePendingClose("stay"),
            onDiscard: () => f.resolvePendingClose("discard"),
            onSaveAndClose: Ne
          }
        ),
        be && /* @__PURE__ */ t.jsx(
          bt,
          {
            taskTitle: (l == null ? void 0 : l.title) ?? "",
            busy: je,
            onCancel: () => Q(!1),
            onConfirm: we
          }
        )
      ]
    }
  );
}
function bt({ taskTitle: e, busy: s, onCancel: a, onConfirm: r }) {
  const [i, n] = o.useState(""), u = i.trim() === "SİL";
  return /* @__PURE__ */ t.jsxs(
    xe,
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
        /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: a, disabled: s, children: "İptal" }),
        /* @__PURE__ */ t.jsx(
          N,
          {
            variant: "destructive",
            onClick: r,
            disabled: !u,
            isLoading: s,
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
function xe({ label: e, title: s, description: a, children: r, actions: i }) {
  return /* @__PURE__ */ t.jsx(
    "div",
    {
      role: "alertdialog",
      "aria-modal": "true",
      "aria-label": e,
      className: "absolute inset-0 z-popover grid place-items-center bg-surface-overlay p-4",
      children: /* @__PURE__ */ t.jsxs("div", { className: "w-full max-w-md rounded-xl border border-default bg-surface-elevated p-[var(--apya-space-5)] shadow-xl", children: [
        /* @__PURE__ */ t.jsx("h3", { className: "text-base font-semibold text-text-primary", children: s }),
        /* @__PURE__ */ t.jsx("p", { className: "mt-2 text-sm text-text-secondary", children: a }),
        r,
        /* @__PURE__ */ t.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: i })
      ] })
    }
  );
}
function jt({ isSaving: e, onStay: s, onDiscard: a, onSaveAndClose: r }) {
  return /* @__PURE__ */ t.jsx(
    xe,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: s, disabled: e, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ t.jsx(N, { variant: "destructive", onClick: a, disabled: e, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ t.jsx(N, { variant: "primary", onClick: r, isLoading: e, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
function wt() {
  const e = o.useSyncExternalStore(
    D.subscribe,
    D.getSnapshot,
    () => null
  );
  return e ? /* @__PURE__ */ t.jsx(Ae, { children: /* @__PURE__ */ t.jsx(
    gt,
    {
      taskId: e,
      presentation: "modal",
      onClose: () => {
        D.close(), D.emitResult();
      }
    }
  ) }) : null;
}
function kt() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : window.localStorage.getItem("apya.taskDetail.v2") === "1";
  } catch {
    return !1;
  }
}
const de = document.getElementById("task-detail-island");
if (de && (window.apya = window.apya || {}, window.apya.taskDetailV2Enabled = kt(), window.apya.taskDetail = {
  open: (e) => D.open(e),
  close: () => D.close(),
  onResult: (e) => D.onResult(e)
}, Fe(de).render(/* @__PURE__ */ t.jsx(wt, {})), window.apya.taskDetailV2Enabled)) {
  const e = me();
  e && D.open(e);
}
