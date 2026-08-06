import { j as t, r as o, d as B, b as Ee } from "./react-vendor.js";
/* empty css      */
import { a as Fe } from "./QueryProvider.js";
import { u as H, a as J, b as re } from "./query-vendor.js";
import { D as Le, l as Ae, e as O, B as N, I as F, S as G } from "./Dialog.js";
import { C as Ie } from "./Combobox.js";
function Pe({
  open: e,
  onRequestClose: s,
  fullscreen: a,
  title: r,
  header: n,
  footer: i,
  children: u
}) {
  return /* @__PURE__ */ t.jsx(
    Le,
    {
      open: e,
      onOpenChange: (l) => {
        l || s();
      },
      children: /* @__PURE__ */ t.jsx(
        Ae,
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
            n,
            /* @__PURE__ */ t.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: u }),
            i
          ] })
        }
      )
    }
  );
}
function Be({ isPrivate: e }) {
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
}, V = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function Re({
  task: e,
  canDelete: s,
  onClose: a,
  onDelete: r,
  onToggleFullscreen: n,
  fullscreen: i = !1
}) {
  const [u, l] = o.useState(!1), d = o.useRef(null);
  o.useEffect(() => {
    if (!u) return;
    const m = (x) => {
      d.current && !d.current.contains(x.target) && l(!1);
    }, v = (x) => {
      x.key === "Escape" && l(!1);
    };
    return document.addEventListener("mousedown", m), document.addEventListener("keydown", v), () => {
      document.removeEventListener("mousedown", m), document.removeEventListener("keydown", v);
    };
  }, [u]);
  const c = M[e == null ? void 0 : e.status] ?? M[1], y = V[e == null ? void 0 : e.priority] ?? V[2], f = () => {
    var v, x, w, j;
    const m = `${window.location.origin}/Tasks/Detail/${e.id}`;
    (v = navigator.clipboard) == null || v.writeText(m), (j = (w = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : w.info) == null || j.call(w, "Bağlantı kopyalandı."), l(!1);
  };
  return /* @__PURE__ */ t.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ t.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ t.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: e == null ? void 0 : e.title }),
      /* @__PURE__ */ t.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(O, { variant: c.variant, children: c.text }),
        /* @__PURE__ */ t.jsx(O, { variant: y.variant, children: y.text }),
        /* @__PURE__ */ t.jsx(Be, { isPrivate: e == null ? void 0 : e.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": i ? "Küçült" : "Tam ekrana büyüt",
          onClick: n,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ t.jsx("i", { className: i ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ t.jsxs("div", { className: "relative", ref: d, children: [
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
const ze = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : null;
function Ge({ lastSavedAt: e, isDirty: s, isSaving: a, onCancel: r, onSave: n }) {
  const i = ze(e);
  return /* @__PURE__ */ t.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: i ? `Son kayıt: ${i}` : " " }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: r, disabled: a, children: "Vazgeç" }),
      /* @__PURE__ */ t.jsx(
        N,
        {
          variant: "primary",
          onClick: () => n == null ? void 0 : n(),
          disabled: !s || !n,
          isLoading: a,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
const ie = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Ke = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function T({ label: e, htmlFor: s, error: a, children: r }) {
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("label", { htmlFor: s, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: e }),
    r,
    a && /* @__PURE__ */ t.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: a })
  ] });
}
function Oe({ value: e, onChange: s }) {
  const [a, r] = o.useState(""), n = () => {
    const i = a.trim();
    i && !e.includes(i) && s([...e, i]), r("");
  };
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: e.map((i) => /* @__PURE__ */ t.jsxs(O, { variant: "neutral", children: [
      i,
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${i} etiketini kaldır`,
          onClick: () => s(e.filter((u) => u !== i)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, i)) }),
    /* @__PURE__ */ t.jsx(
      F,
      {
        value: a,
        onChange: (i) => r(i.target.value),
        onKeyDown: (i) => {
          i.key === "Enter" || i.key === "," ? (i.preventDefault(), n()) : i.key === "Backspace" && !a && e.length && s(e.slice(0, -1));
        },
        onBlur: n,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function Me({
  values: e,
  errors: s,
  onFieldChange: a,
  assigneeOptions: r = [],
  isLoadingAssignees: n = !1
}) {
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx(T, { label: "Başlık", htmlFor: "task-title", error: s.title, children: /* @__PURE__ */ t.jsx(
      F,
      {
        id: "task-title",
        value: e.title,
        onChange: (i) => a("title", i.target.value),
        invalid: !!s.title
      }
    ) }),
    /* @__PURE__ */ t.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ t.jsx(T, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ t.jsx(
        "select",
        {
          id: "task-status",
          value: e.status,
          onChange: (i) => a("status", Number(i.target.value)),
          className: ie,
          children: Object.entries(M).map(([i, u]) => /* @__PURE__ */ t.jsx("option", { value: i, children: u.text }, i))
        }
      ) }),
      /* @__PURE__ */ t.jsx(T, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ t.jsx(
        "select",
        {
          id: "task-priority",
          value: e.priority,
          onChange: (i) => a("priority", Number(i.target.value)),
          className: ie,
          children: Object.entries(V).map(([i, u]) => /* @__PURE__ */ t.jsx("option", { value: i, children: u.text }, i))
        }
      ) })
    ] }),
    /* @__PURE__ */ t.jsx(T, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ t.jsx(
      Ie,
      {
        id: "task-assignee",
        options: r,
        value: e.assigneeId,
        onChange: (i) => a("assigneeId", i),
        placeholder: n ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: n
      }
    ) }),
    /* @__PURE__ */ t.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ t.jsx(T, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: s.startDate, children: /* @__PURE__ */ t.jsx(
        F,
        {
          id: "task-start",
          type: "date",
          value: e.startDate,
          onChange: (i) => a("startDate", i.target.value),
          invalid: !!s.startDate
        }
      ) }),
      /* @__PURE__ */ t.jsx(T, { label: "Son Tarih", htmlFor: "task-due", error: s.dueDate, children: /* @__PURE__ */ t.jsx(
        F,
        {
          id: "task-due",
          type: "date",
          value: e.dueDate,
          onChange: (i) => a("dueDate", i.target.value),
          invalid: !!s.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ t.jsx(T, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ t.jsx(Oe, { value: e.tagNames, onChange: (i) => a("tagNames", i) }) }),
    /* @__PURE__ */ t.jsx(T, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ t.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: e.description,
        onChange: (i) => a("description", i.target.value),
        className: Ke
      }
    ) })
  ] });
}
const ne = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : "—";
function P({ label: e, value: s }) {
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("dt", { className: "text-[13px] text-text-tertiary", children: e }),
    /* @__PURE__ */ t.jsx("dd", { className: "mt-0.5 text-text-primary", children: s ?? "—" })
  ] });
}
function qe({ task: e, creatorName: s, lastModifierName: a }) {
  return /* @__PURE__ */ t.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ t.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ t.jsx(P, { label: "Oluşturan", value: s }),
      /* @__PURE__ */ t.jsx(P, { label: "Oluşturulma zamanı", value: ne(e.creationTime) }),
      /* @__PURE__ */ t.jsx(P, { label: "Güncelleyen", value: a }),
      /* @__PURE__ */ t.jsx(P, { label: "Son güncelleme zamanı", value: ne(e.lastModificationTime) }),
      /* @__PURE__ */ t.jsx(P, { label: "Proje", value: e.projectName })
    ] })
  ] });
}
const Ue = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", Ye = "border-brand-500 text-text-primary";
function _e({ tabs: e, activeCode: s, onSelect: a, onOpenPicker: r, pickerOpen: n }) {
  const i = o.useRef(/* @__PURE__ */ new Map()), u = (d) => {
    var c;
    a(d.code), (c = i.current.get(d.code)) == null || c.focus();
  }, l = (d, c) => {
    d.key === "ArrowRight" ? (d.preventDefault(), u(e[(c + 1) % e.length])) : d.key === "ArrowLeft" ? (d.preventDefault(), u(e[(c - 1 + e.length) % e.length])) : d.key === "Home" ? (d.preventDefault(), u(e[0])) : d.key === "End" && (d.preventDefault(), u(e[e.length - 1]));
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ t.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: e.map((d, c) => {
      const y = d.code === s;
      return /* @__PURE__ */ t.jsxs(
        "button",
        {
          ref: (f) => {
            f ? i.current.set(d.code, f) : i.current.delete(d.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${d.code}`,
          "aria-selected": y,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: y ? 0 : -1,
          onClick: () => a(d.code),
          onKeyDown: (f) => l(f, c),
          className: `${Ue} ${y ? Ye : ""}`,
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
        "aria-expanded": n,
        onClick: r,
        className: "mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
        children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" })
      }
    )
  ] });
}
const $e = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Ve({ entries: e, onAdd: s, onRemove: a, busyCode: r }) {
  const [n, i] = o.useState(""), u = o.useMemo(() => {
    const l = n.trim().toLocaleLowerCase("tr-TR"), d = l ? e.filter((y) => y.title.toLocaleLowerCase("tr-TR").includes(l)) : e, c = /* @__PURE__ */ new Map();
    return d.forEach((y) => {
      const f = c.get(y.category) ?? [];
      f.push(y), c.set(y.category, f);
    }), c;
  }, [e, n]);
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ t.jsx(
          F,
          {
            autoFocus: !0,
            value: n,
            onChange: (l) => i(l.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ t.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          u.size === 0 && /* @__PURE__ */ t.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...u.entries()].map(([l, d]) => /* @__PURE__ */ t.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ t.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: $e[l] ?? l }),
            d.map((c) => /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ t.jsx("i", { className: `fa ${c.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ t.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: c.title }),
              !c.implemented && /* @__PURE__ */ t.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              c.implemented && !c.isAssigned && /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === c.code,
                  onClick: () => s(c.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              c.implemented && c.isAssigned && /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === c.code,
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
function Qe({ trail: e = [], current: s, onNavigate: a }) {
  return e.length === 0 ? null : /* @__PURE__ */ t.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    e.map((r) => /* @__PURE__ */ t.jsxs(B.Fragment, { children: [
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
function He(e) {
  var a, r, n;
  const s = (n = (r = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : r.tasks) == null ? void 0 : n.task;
  return s ? Promise.resolve(s.get(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Je(e) {
  return H({
    queryKey: ["task-detail", e],
    queryFn: () => He(e),
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
function Ze() {
  const [e, s] = o.useState(!1), [a, r] = o.useState(!1), n = o.useRef(null), i = o.useCallback(() => s(!0), []), u = o.useCallback(() => s(!1), []);
  o.useEffect(() => {
    if (!e) return;
    const c = (y) => {
      y.preventDefault(), y.returnValue = "";
    };
    return window.addEventListener("beforeunload", c), () => window.removeEventListener("beforeunload", c);
  }, [e]);
  const l = o.useCallback((c) => {
    if (!e) {
      c == null || c();
      return;
    }
    n.current = c ?? null, r(!0);
  }, [e]), d = o.useCallback((c) => {
    const y = n.current;
    return r(!1), n.current = null, c === "discard" && (s(!1), y == null || y()), c === "save" ? y : null;
  }, []);
  return { isDirty: e, markDirty: i, markClean: u, requestClose: l, pendingClose: a, resolvePendingClose: d };
}
const We = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, Z = "task";
function me() {
  if (typeof window > "u") return null;
  const e = new URLSearchParams(window.location.search).get(Z);
  return e && We.test(e) ? e : null;
}
function Xe() {
  if (typeof window > "u") return;
  const e = new URL(window.location.href);
  e.searchParams.delete(Z), window.history.replaceState(null, "", e.pathname + e.search + e.hash);
}
function et(e, s) {
  const a = o.useRef(s);
  a.current = s, o.useEffect(() => {
    if (!e || me() === e) return;
    const r = new URL(window.location.href);
    r.searchParams.set(Z, e), window.history.pushState({ apyaTask: e }, "", r.pathname + r.search + r.hash);
  }, [e]), o.useEffect(() => {
    const r = () => {
      var n;
      (n = a.current) == null || n.call(a);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const tt = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: []
};
function at(e) {
  return e ? {
    title: e.title ?? "",
    description: e.description ?? "",
    startDate: e.startDate ? e.startDate.slice(0, 10) : "",
    dueDate: e.dueDate ? e.dueDate.slice(0, 10) : "",
    status: e.status ?? 1,
    priority: e.priority ?? 2,
    assigneeId: e.assigneeId ?? null,
    tagNames: (e.tags ?? []).map((s) => s.name)
  } : tt;
}
function st(e) {
  const [s, a] = o.useState(e == null ? void 0 : e.id), r = o.useMemo(() => at(e), [e]), [n, i] = o.useState(r), [u, l] = o.useState({});
  (e == null ? void 0 : e.id) !== s && (a(e == null ? void 0 : e.id), i(r), l({}));
  const d = o.useCallback((v, x) => {
    i((w) => ({ ...w, [v]: x }));
  }, []), c = o.useMemo(
    () => JSON.stringify(n) !== JSON.stringify(r),
    [n, r]
  ), y = o.useCallback(() => {
    const v = {};
    return n.title.trim() || (v.title = "Başlık zorunlu."), n.startDate || (v.startDate = "Başlangıç tarihi zorunlu."), n.dueDate && n.startDate && n.dueDate < n.startDate && (v.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), l(v), Object.keys(v).length === 0;
  }, [n]), f = o.useCallback(() => ({
    title: n.title.trim(),
    description: n.description || null,
    startDate: n.startDate,
    dueDate: n.dueDate || null,
    status: n.status,
    priority: n.priority,
    assigneeId: n.assigneeId,
    boardColumnId: (e == null ? void 0 : e.boardColumnId) ?? null,
    projectId: (e == null ? void 0 : e.projectId) ?? null,
    parentTaskId: (e == null ? void 0 : e.parentTaskId) ?? null,
    isPrivate: !!(e != null && e.isPrivate),
    predecessorIds: (e == null ? void 0 : e.predecessorIds) ?? [],
    tagNames: n.tagNames
  }), [n, e]), m = o.useCallback(() => {
    i(r), l({});
  }, [r]);
  return { values: n, setField: d, isDirty: c, errors: u, validate: y, toUpdateDto: f, reset: m };
}
function le(e) {
  return [e.name, e.surname].filter(Boolean).join(" ") || e.userName;
}
function rt() {
  var s, a, r;
  const e = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return e ? Promise.resolve(e.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function it() {
  var n;
  const e = H({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: rt,
    staleTime: 3e5,
    retry: !1
  }), s = ((n = e.data) == null ? void 0 : n.items) ?? [], a = s.map((i) => ({ value: i.id, label: le(i) })), r = new Map(s.map((i) => [i.id, le(i)]));
  return { options: a, nameById: r, isLoading: e.isLoading };
}
function Q() {
  var s, a, r;
  const e = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return e || null;
}
function nt(e) {
  const s = Q();
  return s ? Promise.resolve(s.getFeatureAssignments(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function lt(e) {
  const s = J(), a = ["task-features", e], r = H({
    queryKey: a,
    queryFn: () => nt(e),
    enabled: !!e,
    staleTime: 3e4,
    retry: !1
  }), n = () => s.invalidateQueries({ queryKey: a }), i = re({
    mutationFn: (l) => Promise.resolve(Q().addFeature(e, l)),
    onSuccess: n
  }), u = re({
    mutationFn: (l) => Promise.resolve(Q().removeFeature(e, l)),
    onSuccess: n
  });
  return {
    assignedCodes: r.data ?? [],
    isLoading: r.isLoading,
    addFeature: i.mutateAsync,
    removeFeature: u.mutateAsync,
    mutatingCode: i.variables ?? u.variables ?? null,
    isMutating: i.isPending || u.isPending
  };
}
function ot({ taskId: e, task: s, onOpenSubtask: a }) {
  const [r, n] = o.useState(""), [i, u] = o.useState(!1), l = J(), d = (s == null ? void 0 : s.subTasks) ?? [], c = () => l.invalidateQueries({ queryKey: ["task-detail", e] }), y = async () => {
    var v, x, w;
    const m = r.trim();
    if (m) {
      u(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: m,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: e,
          projectId: s == null ? void 0 : s.projectId
        })), n(""), await c();
      } catch (j) {
        (w = (x = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : x.error) == null || w.call(x, (j == null ? void 0 : j.message) || "Alt görev eklenemedi.");
      } finally {
        u(!1);
      }
    }
  }, f = async (m) => {
    var v, x, w;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(m)), await c();
    } catch (j) {
      (w = (x = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : x.error) == null || w.call(x, (j == null ? void 0 : j.message) || "Alt görev silinemedi.");
    }
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ t.jsx(
        F,
        {
          value: r,
          onChange: (m) => n(m.target.value),
          onKeyDown: (m) => {
            m.key === "Enter" && y();
          },
          placeholder: "Yeni alt görev başlığı",
          disabled: i
        }
      ),
      /* @__PURE__ */ t.jsx(N, { variant: "secondary", onClick: y, disabled: i || !r.trim(), children: "Alt Görev Ekle" })
    ] }),
    d.length === 0 ? /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ t.jsx("ul", { className: "divide-y divide-border-default", children: d.map((m) => {
      var v;
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
          /* @__PURE__ */ t.jsx(O, { variant: "neutral", children: ((v = M[m.status]) == null ? void 0 : v.text) ?? m.status }),
          /* @__PURE__ */ t.jsx(N, { variant: "ghost", onClick: () => f(m.id), "aria-label": `${m.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, m.id);
    }) })
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
    component: ot
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
function ct(e = []) {
  const s = new Set(e);
  return pe.filter((a) => a.implemented && (a.isCore || s.has(a.code))).sort((a, r) => a.order - r.order);
}
function dt(e = []) {
  const s = new Set(e);
  return pe.filter((a) => !a.isCore).filter((a) => !a.permission || ue(a.permission)).map((a) => ({ ...a, isAssigned: s.has(a.code) })).sort((a, r) => a.order - r.order);
}
let E = null;
const K = /* @__PURE__ */ new Set(), $ = /* @__PURE__ */ new Set();
function oe() {
  K.forEach((e) => e());
}
function ut(e) {
  return typeof e == "string" && e ? e : e && typeof e == "object" && typeof e.id == "string" && e.id ? e.id : null;
}
const D = {
  open(e) {
    const s = ut(e);
    !s || s === E || (E = s, oe());
  },
  close() {
    E !== null && (E = null, oe());
  },
  subscribe(e) {
    return K.add(e), () => K.delete(e);
  },
  getSnapshot() {
    return E;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(e) {
    typeof e == "function" && $.add(e);
  },
  emitResult() {
    $.forEach((e) => e());
  },
  /** Yalnız testler için. */
  reset() {
    E = null, K.clear(), $.clear();
  }
}, ce = "apya.taskDetail.fullscreen";
function mt({ taskId: e, presentation: s = "modal", onClose: a }) {
  const [r, n] = o.useState(e), [i, u] = o.useState([]), { data: l, isLoading: d, isError: c, refetch: y } = Je(r), f = Ze(), m = st(l), v = it(), x = lt(r), [w, j] = o.useState("general"), [R, L] = o.useState(!1), q = B.useRef(null), U = o.useMemo(
    () => ct(x.assignedCodes),
    [x.assignedCodes]
  ), xe = o.useMemo(
    () => dt(x.assignedCodes),
    [x.assignedCodes]
  ), C = U.find((p) => p.code === w) ?? U[0];
  B.useEffect(() => {
    C.code !== w && j(C.code);
  }, [C, w]);
  const W = C == null ? void 0 : C.component, X = J(), [ee, ye] = o.useState(
    () => {
      var p;
      return ((p = window.localStorage) == null ? void 0 : p.getItem(ce)) === "1";
    }
  ), [te, ae] = o.useState(!1), A = o.useCallback(() => {
    Xe(), a == null || a();
  }, [a]);
  et(e, A), B.useEffect(() => {
    m.isDirty ? f.markDirty() : f.markClean();
  });
  const Y = o.useCallback(() => f.requestClose(A), [f, A]), ve = o.useCallback(() => {
    ye((p) => {
      var g;
      const h = !p;
      return (g = window.localStorage) == null || g.setItem(ce, h ? "1" : "0"), h;
    });
  }, []), he = ue("Platform.Tasks.Delete"), [ge, _] = o.useState(!1), [be, se] = o.useState(!1), je = o.useCallback(async () => {
    var p, h, g, k, b, I;
    se(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (g = (h = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : h.info) == null || g.call(h, "Başarıyla silindi."), _(!1), f.markClean(), A();
    } catch (S) {
      (I = (b = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : b.error) == null || I.call(b, (S == null ? void 0 : S.message) || "Görev silinemedi.");
    } finally {
      se(!1);
    }
  }, [r, f, A]), z = o.useCallback(async () => {
    var p, h, g, k, b, I;
    if (!m.validate()) return !1;
    ae(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, m.toUpdateDto())
      ), await X.invalidateQueries({ queryKey: ["task-detail", r] }), D.emitResult(), (g = (h = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : h.success) == null || g.call(h, "Kaydedildi."), !0;
    } catch (S) {
      return (I = (b = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : b.error) == null || I.call(b, (S == null ? void 0 : S.message) || "Kaydedilemedi."), !1;
    } finally {
      ae(!1);
    }
  }, [r, m, f, X]), we = o.useCallback(() => {
    z();
  }, [z]), ke = o.useCallback(async () => {
    const p = f.resolvePendingClose("save");
    await z() && (p == null || p());
  }, [f, z]), Ne = o.useCallback((p, h) => {
    f.requestClose(() => {
      u((g) => [...g, { id: r, title: (l == null ? void 0 : l.title) ?? "" }]), n(p), j("general"), f.markClean();
    });
  }, [f, r, l]), Ce = o.useCallback((p) => {
    f.requestClose(() => {
      u((h) => {
        const g = h.findIndex((k) => k.id === p);
        return g === -1 ? h : h.slice(0, g);
      }), n(p), j("general"), f.markClean();
    });
  }, [f]), De = o.useCallback(async (p) => {
    var h, g, k;
    try {
      await x.addFeature(p), j(p), L(!1);
    } catch (b) {
      (k = (g = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : g.error) == null || k.call(g, (b == null ? void 0 : b.message) || "Özellik eklenemedi.");
    }
  }, [x]), Te = o.useCallback(async (p) => {
    var h, g, k;
    try {
      await x.removeFeature(p), j((b) => b === p ? "general" : b);
    } catch (b) {
      (k = (g = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : g.error) == null || k.call(g, (b == null ? void 0 : b.message) || "Özellik kaldırılamadı.");
    }
  }, [x]);
  B.useEffect(() => {
    if (!R) return;
    const p = (g) => {
      q.current && !q.current.contains(g.target) && L(!1);
    }, h = (g) => {
      g.key === "Escape" && L(!1);
    };
    return document.addEventListener("mousedown", p), document.addEventListener("keydown", h), () => {
      document.removeEventListener("mousedown", p), document.removeEventListener("keydown", h);
    };
  }, [R]);
  const Se = d ? /* @__PURE__ */ t.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ t.jsx(G, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ t.jsx(G, { className: "h-24 w-full" }),
    /* @__PURE__ */ t.jsx(G, { className: "h-24 w-full" })
  ] }) : c ? /* @__PURE__ */ t.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ t.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ t.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ t.jsx(N, { variant: "ghost", onClick: () => y(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ t.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx(
      Qe,
      {
        trail: i,
        current: { id: r, title: (l == null ? void 0 : l.title) ?? "" },
        onNavigate: Ce
      }
    ),
    /* @__PURE__ */ t.jsxs("div", { className: "relative", ref: q, children: [
      /* @__PURE__ */ t.jsx(
        _e,
        {
          tabs: U,
          activeCode: C.code,
          onSelect: (p) => {
            j(p), L(!1);
          },
          onOpenPicker: () => L((p) => !p),
          pickerOpen: R
        }
      ),
      R && /* @__PURE__ */ t.jsx(
        Ve,
        {
          entries: xe,
          busyCode: x.isMutating ? x.mutatingCode : null,
          onAdd: De,
          onRemove: Te
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
            Me,
            {
              values: m.values,
              errors: m.errors,
              onFieldChange: m.setField,
              assigneeOptions: v.options,
              isLoadingAssignees: v.isLoading
            }
          ) : /* @__PURE__ */ t.jsx(o.Suspense, { fallback: /* @__PURE__ */ t.jsx(G, { className: "h-24 w-full" }), children: W && /* @__PURE__ */ t.jsx(
            W,
            {
              taskId: r,
              task: l,
              onOpenSubtask: Ne
            }
          ) }),
          /* @__PURE__ */ t.jsx(
            qe,
            {
              task: l,
              creatorName: v.nameById.get(l.creatorId),
              lastModifierName: v.nameById.get(l.lastModifierId)
            }
          )
        ]
      }
    )
  ] });
  return /* @__PURE__ */ t.jsxs(
    Pe,
    {
      open: !0,
      fullscreen: ee,
      onRequestClose: Y,
      title: l ? `Görev Detayı: ${l.title}` : "Görev Detayı",
      header: /* @__PURE__ */ t.jsx(
        Re,
        {
          task: l ?? { title: "Yükleniyor…" },
          canDelete: he,
          fullscreen: ee,
          onToggleFullscreen: ve,
          onClose: Y,
          onDelete: () => _(!0)
        }
      ),
      footer: /* @__PURE__ */ t.jsx(
        Ge,
        {
          lastSavedAt: l == null ? void 0 : l.lastModificationTime,
          isDirty: f.isDirty,
          isSaving: te,
          onCancel: Y,
          onSave: we
        }
      ),
      children: [
        Se,
        f.pendingClose && /* @__PURE__ */ t.jsx(
          ft,
          {
            isSaving: te,
            onStay: () => f.resolvePendingClose("stay"),
            onDiscard: () => f.resolvePendingClose("discard"),
            onSaveAndClose: ke
          }
        ),
        ge && /* @__PURE__ */ t.jsx(
          pt,
          {
            taskTitle: (l == null ? void 0 : l.title) ?? "",
            busy: be,
            onCancel: () => _(!1),
            onConfirm: je
          }
        )
      ]
    }
  );
}
function pt({ taskTitle: e, busy: s, onCancel: a, onConfirm: r }) {
  const [n, i] = o.useState(""), u = n.trim() === "SİL";
  return /* @__PURE__ */ t.jsxs(
    fe,
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
            value: n,
            onChange: (l) => i(l.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function fe({ label: e, title: s, description: a, children: r, actions: n }) {
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
        /* @__PURE__ */ t.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: n })
      ] })
    }
  );
}
function ft({ isSaving: e, onStay: s, onDiscard: a, onSaveAndClose: r }) {
  return /* @__PURE__ */ t.jsx(
    fe,
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
function xt() {
  const e = o.useSyncExternalStore(
    D.subscribe,
    D.getSnapshot,
    () => null
  );
  return e ? /* @__PURE__ */ t.jsx(Fe, { children: /* @__PURE__ */ t.jsx(
    mt,
    {
      taskId: e,
      presentation: "modal",
      onClose: () => {
        D.close(), D.emitResult();
      }
    }
  ) }) : null;
}
function yt() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : window.localStorage.getItem("apya.taskDetail.v2") === "1";
  } catch {
    return !1;
  }
}
const de = document.getElementById("task-detail-island");
if (de && (window.apya = window.apya || {}, window.apya.taskDetailV2Enabled = yt(), window.apya.taskDetail = {
  open: (e) => D.open(e),
  close: () => D.close(),
  onResult: (e) => D.onResult(e)
}, Ee(de).render(/* @__PURE__ */ t.jsx(xt, {})), window.apya.taskDetailV2Enabled)) {
  const e = me();
  e && D.open(e);
}
