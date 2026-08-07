import { j as t, r as c, d as z, b as Ae } from "./react-vendor.js";
/* empty css      */
import { a as Pe } from "./QueryProvider.js";
import { u as K, a as M, b as A } from "./query-vendor.js";
import { D as Le, l as Ie, e as Y, B as k, I as P, S as O } from "./Dialog.js";
import { C as Be } from "./Combobox.js";
import { r as Re } from "./httpClient.js";
function ze({
  open: e,
  onRequestClose: s,
  fullscreen: a,
  title: n,
  header: r,
  footer: i,
  children: d
}) {
  return /* @__PURE__ */ t.jsx(
    Le,
    {
      open: e,
      onOpenChange: (l) => {
        l || s();
      },
      children: /* @__PURE__ */ t.jsx(
        Ie,
        {
          title: n,
          fullscreen: a,
          onInteractOutside: (l) => {
            l.preventDefault(), s();
          },
          onEscapeKeyDown: (l) => {
            l.preventDefault(), s();
          },
          children: /* @__PURE__ */ t.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
            r,
            /* @__PURE__ */ t.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: d }),
            i
          ] })
        }
      )
    }
  );
}
function qe({ isPrivate: e }) {
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
const q = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, W = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function Ke({
  task: e,
  canDelete: s,
  onClose: a,
  onDelete: n,
  onToggleFullscreen: r,
  fullscreen: i = !1
}) {
  const [d, l] = c.useState(!1), o = c.useRef(null);
  c.useEffect(() => {
    if (!d) return;
    const x = (u) => {
      o.current && !o.current.contains(u.target) && l(!1);
    }, y = (u) => {
      u.key === "Escape" && l(!1);
    };
    return document.addEventListener("mousedown", x), document.addEventListener("keydown", y), () => {
      document.removeEventListener("mousedown", x), document.removeEventListener("keydown", y);
    };
  }, [d]);
  const f = q[e == null ? void 0 : e.status] ?? q[1], m = W[e == null ? void 0 : e.priority] ?? W[2], p = () => {
    var y, u, v, j;
    const x = `${window.location.origin}/Tasks/Detail/${e.id}`;
    (y = navigator.clipboard) == null || y.writeText(x), (j = (v = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : v.info) == null || j.call(v, "Bağlantı kopyalandı."), l(!1);
  };
  return /* @__PURE__ */ t.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ t.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ t.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ t.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: e == null ? void 0 : e.title }),
      /* @__PURE__ */ t.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ t.jsx(Y, { variant: f.variant, children: f.text }),
        /* @__PURE__ */ t.jsx(Y, { variant: m.variant, children: m.text }),
        /* @__PURE__ */ t.jsx(qe, { isPrivate: e == null ? void 0 : e.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": i ? "Küçült" : "Tam ekrana büyüt",
          onClick: r,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ t.jsx("i", { className: i ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ t.jsxs("div", { className: "relative", ref: o, children: [
        /* @__PURE__ */ t.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": d,
            onClick: () => l((x) => !x),
            className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
            children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-ellipsis", "aria-hidden": "true" })
          }
        ),
        d && /* @__PURE__ */ t.jsxs(
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
                  onClick: p,
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
                      l(!1), n();
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
const Me = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : null;
function Ge({ lastSavedAt: e, isDirty: s, isSaving: a, onCancel: n, onSave: r }) {
  const i = Me(e);
  return /* @__PURE__ */ t.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ t.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: i ? `Son kayıt: ${i}` : " " }),
    /* @__PURE__ */ t.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ t.jsx(k, { variant: "secondary", onClick: n, disabled: a, children: "Vazgeç" }),
      /* @__PURE__ */ t.jsx(
        k,
        {
          variant: "primary",
          onClick: () => r == null ? void 0 : r(),
          disabled: !s || !r,
          isLoading: a,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
const le = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Oe = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function E({ label: e, htmlFor: s, error: a, children: n }) {
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("label", { htmlFor: s, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: e }),
    n,
    a && /* @__PURE__ */ t.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: a })
  ] });
}
function Ue({ value: e, onChange: s }) {
  const [a, n] = c.useState(""), r = () => {
    const i = a.trim();
    i && !e.includes(i) && s([...e, i]), n("");
  };
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: e.map((i) => /* @__PURE__ */ t.jsxs(Y, { variant: "neutral", children: [
      i,
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${i} etiketini kaldır`,
          onClick: () => s(e.filter((d) => d !== i)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, i)) }),
    /* @__PURE__ */ t.jsx(
      P,
      {
        value: a,
        onChange: (i) => n(i.target.value),
        onKeyDown: (i) => {
          i.key === "Enter" || i.key === "," ? (i.preventDefault(), r()) : i.key === "Backspace" && !a && e.length && s(e.slice(0, -1));
        },
        onBlur: r,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function $e({
  values: e,
  errors: s,
  onFieldChange: a,
  assigneeOptions: n = [],
  isLoadingAssignees: r = !1
}) {
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx(E, { label: "Başlık", htmlFor: "task-title", error: s.title, children: /* @__PURE__ */ t.jsx(
      P,
      {
        id: "task-title",
        value: e.title,
        onChange: (i) => a("title", i.target.value),
        invalid: !!s.title
      }
    ) }),
    /* @__PURE__ */ t.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ t.jsx(E, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ t.jsx(
        "select",
        {
          id: "task-status",
          value: e.status,
          onChange: (i) => a("status", Number(i.target.value)),
          className: le,
          children: Object.entries(q).map(([i, d]) => /* @__PURE__ */ t.jsx("option", { value: i, children: d.text }, i))
        }
      ) }),
      /* @__PURE__ */ t.jsx(E, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ t.jsx(
        "select",
        {
          id: "task-priority",
          value: e.priority,
          onChange: (i) => a("priority", Number(i.target.value)),
          className: le,
          children: Object.entries(W).map(([i, d]) => /* @__PURE__ */ t.jsx("option", { value: i, children: d.text }, i))
        }
      ) })
    ] }),
    /* @__PURE__ */ t.jsx(E, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ t.jsx(
      Be,
      {
        id: "task-assignee",
        options: n,
        value: e.assigneeId,
        onChange: (i) => a("assigneeId", i),
        placeholder: r ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: r
      }
    ) }),
    /* @__PURE__ */ t.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ t.jsx(E, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: s.startDate, children: /* @__PURE__ */ t.jsx(
        P,
        {
          id: "task-start",
          type: "date",
          value: e.startDate,
          onChange: (i) => a("startDate", i.target.value),
          invalid: !!s.startDate
        }
      ) }),
      /* @__PURE__ */ t.jsx(E, { label: "Son Tarih", htmlFor: "task-due", error: s.dueDate, children: /* @__PURE__ */ t.jsx(
        P,
        {
          id: "task-due",
          type: "date",
          value: e.dueDate,
          onChange: (i) => a("dueDate", i.target.value),
          invalid: !!s.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ t.jsx(E, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ t.jsx(Ue, { value: e.tagNames, onChange: (i) => a("tagNames", i) }) }),
    /* @__PURE__ */ t.jsx(E, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ t.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: e.description,
        onChange: (i) => a("description", i.target.value),
        className: Oe
      }
    ) })
  ] });
}
const oe = (e) => e ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(e)) : "—";
function R({ label: e, value: s }) {
  return /* @__PURE__ */ t.jsxs("div", { children: [
    /* @__PURE__ */ t.jsx("dt", { className: "text-[13px] text-text-tertiary", children: e }),
    /* @__PURE__ */ t.jsx("dd", { className: "mt-0.5 text-text-primary", children: s ?? "—" })
  ] });
}
function Ye({ task: e, creatorName: s, lastModifierName: a }) {
  return /* @__PURE__ */ t.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ t.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ t.jsx(R, { label: "Oluşturan", value: s }),
      /* @__PURE__ */ t.jsx(R, { label: "Oluşturulma zamanı", value: oe(e.creationTime) }),
      /* @__PURE__ */ t.jsx(R, { label: "Güncelleyen", value: a }),
      /* @__PURE__ */ t.jsx(R, { label: "Son güncelleme zamanı", value: oe(e.lastModificationTime) }),
      /* @__PURE__ */ t.jsx(R, { label: "Proje", value: e.projectName })
    ] })
  ] });
}
const _e = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", Ve = "border-brand-500 text-text-primary";
function Qe({ tabs: e, activeCode: s, onSelect: a, onOpenPicker: n, pickerOpen: r }) {
  const i = c.useRef(/* @__PURE__ */ new Map()), d = (o) => {
    var f;
    a(o.code), (f = i.current.get(o.code)) == null || f.focus();
  }, l = (o, f) => {
    o.key === "ArrowRight" ? (o.preventDefault(), d(e[(f + 1) % e.length])) : o.key === "ArrowLeft" ? (o.preventDefault(), d(e[(f - 1 + e.length) % e.length])) : o.key === "Home" ? (o.preventDefault(), d(e[0])) : o.key === "End" && (o.preventDefault(), d(e[e.length - 1]));
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ t.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: e.map((o, f) => {
      const m = o.code === s;
      return /* @__PURE__ */ t.jsxs(
        "button",
        {
          ref: (p) => {
            p ? i.current.set(o.code, p) : i.current.delete(o.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${o.code}`,
          "aria-selected": m,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: m ? 0 : -1,
          onClick: () => a(o.code),
          onKeyDown: (p) => l(p, f),
          className: `${_e} ${m ? Ve : ""}`,
          children: [
            /* @__PURE__ */ t.jsx("i", { className: `fa ${o.icon}`, "aria-hidden": "true" }),
            o.title
          ]
        },
        o.code
      );
    }) }),
    /* @__PURE__ */ t.jsx(
      "button",
      {
        type: "button",
        "aria-label": "Özellik ekle",
        "aria-haspopup": "dialog",
        "aria-expanded": r,
        onClick: n,
        className: "mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
        children: /* @__PURE__ */ t.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" })
      }
    )
  ] });
}
const He = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Je({ entries: e, onAdd: s, onRemove: a, busyCode: n }) {
  const [r, i] = c.useState(""), d = c.useMemo(() => {
    const l = r.trim().toLocaleLowerCase("tr-TR"), o = l ? e.filter((m) => m.title.toLocaleLowerCase("tr-TR").includes(l)) : e, f = /* @__PURE__ */ new Map();
    return o.forEach((m) => {
      const p = f.get(m.category) ?? [];
      p.push(m), f.set(m.category, p);
    }), f;
  }, [e, r]);
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
            value: r,
            onChange: (l) => i(l.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ t.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          d.size === 0 && /* @__PURE__ */ t.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...d.entries()].map(([l, o]) => /* @__PURE__ */ t.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ t.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: He[l] ?? l }),
            o.map((f) => /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ t.jsx("i", { className: `fa ${f.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ t.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: f.title }),
              !f.implemented && /* @__PURE__ */ t.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              f.implemented && !f.isAssigned && /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  disabled: n === f.code,
                  onClick: () => s(f.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              f.implemented && f.isAssigned && /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  disabled: n === f.code,
                  onClick: () => a(f.code),
                  className: "text-[13px] font-medium text-text-negative hover:underline disabled:opacity-50",
                  children: "Kaldır"
                }
              )
            ] }, f.code))
          ] }, l))
        ] })
      ]
    }
  );
}
function Ze({ trail: e = [], current: s, onNavigate: a }) {
  return e.length === 0 ? null : /* @__PURE__ */ t.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    e.map((n) => /* @__PURE__ */ t.jsxs(z.Fragment, { children: [
      /* @__PURE__ */ t.jsx(
        "button",
        {
          type: "button",
          onClick: () => a == null ? void 0 : a(n.id),
          className: "hover:underline hover:text-text-primary",
          children: n.title
        }
      ),
      /* @__PURE__ */ t.jsx("span", { "aria-hidden": "true", children: "/" })
    ] }, n.id)),
    /* @__PURE__ */ t.jsx("span", { className: "font-medium text-text-primary", children: s.title })
  ] });
}
function We(e) {
  var a, n, r;
  const s = (r = (n = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : n.tasks) == null ? void 0 : r.task;
  return s ? Promise.resolve(s.get(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Xe(e) {
  return K({
    queryKey: ["task-detail", e],
    queryFn: () => We(e),
    enabled: !!e,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function me(e) {
  var s, a, n;
  return !!((n = (a = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.auth) == null ? void 0 : a.isGranted) != null && n.call(a, e));
}
function et() {
  const [e, s] = c.useState(!1), [a, n] = c.useState(!1), r = c.useRef(null), i = c.useCallback(() => s(!0), []), d = c.useCallback(() => s(!1), []);
  c.useEffect(() => {
    if (!e) return;
    const f = (m) => {
      m.preventDefault(), m.returnValue = "";
    };
    return window.addEventListener("beforeunload", f), () => window.removeEventListener("beforeunload", f);
  }, [e]);
  const l = c.useCallback((f) => {
    if (!e) {
      f == null || f();
      return;
    }
    r.current = f ?? null, n(!0);
  }, [e]), o = c.useCallback((f) => {
    const m = r.current;
    return n(!1), r.current = null, f === "discard" && (s(!1), m == null || m()), f === "save" ? m : null;
  }, []);
  return { isDirty: e, markDirty: i, markClean: d, requestClose: l, pendingClose: a, resolvePendingClose: o };
}
const tt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, ee = "task";
function fe() {
  if (typeof window > "u") return null;
  const e = new URLSearchParams(window.location.search).get(ee);
  return e && tt.test(e) ? e : null;
}
function at() {
  if (typeof window > "u") return;
  const e = new URL(window.location.href);
  e.searchParams.delete(ee), window.history.replaceState(null, "", e.pathname + e.search + e.hash);
}
function st(e, s) {
  const a = c.useRef(s);
  a.current = s, c.useEffect(() => {
    if (!e || fe() === e) return;
    const n = new URL(window.location.href);
    n.searchParams.set(ee, e), window.history.pushState({ apyaTask: e }, "", n.pathname + n.search + n.hash);
  }, [e]), c.useEffect(() => {
    const n = () => {
      var r;
      (r = a.current) == null || r.call(a);
    };
    return window.addEventListener("popstate", n), () => window.removeEventListener("popstate", n);
  }, []);
}
const nt = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: []
};
function it(e) {
  return e ? {
    title: e.title ?? "",
    description: e.description ?? "",
    startDate: e.startDate ? e.startDate.slice(0, 10) : "",
    dueDate: e.dueDate ? e.dueDate.slice(0, 10) : "",
    status: e.status ?? 1,
    priority: e.priority ?? 2,
    assigneeId: e.assigneeId ?? null,
    tagNames: (e.tags ?? []).map((s) => s.name)
  } : nt;
}
function rt(e) {
  const [s, a] = c.useState(e == null ? void 0 : e.id), n = c.useMemo(() => it(e), [e]), [r, i] = c.useState(n), [d, l] = c.useState({});
  (e == null ? void 0 : e.id) !== s && (a(e == null ? void 0 : e.id), i(n), l({}));
  const o = c.useCallback((y, u) => {
    i((v) => ({ ...v, [y]: u }));
  }, []), f = c.useMemo(
    () => JSON.stringify(r) !== JSON.stringify(n),
    [r, n]
  ), m = c.useCallback(() => {
    const y = {};
    return r.title.trim() || (y.title = "Başlık zorunlu."), r.startDate || (y.startDate = "Başlangıç tarihi zorunlu."), r.dueDate && r.startDate && r.dueDate < r.startDate && (y.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), l(y), Object.keys(y).length === 0;
  }, [r]), p = c.useCallback(() => ({
    title: r.title.trim(),
    description: r.description || null,
    startDate: r.startDate,
    dueDate: r.dueDate || null,
    status: r.status,
    priority: r.priority,
    assigneeId: r.assigneeId,
    boardColumnId: (e == null ? void 0 : e.boardColumnId) ?? null,
    projectId: (e == null ? void 0 : e.projectId) ?? null,
    parentTaskId: (e == null ? void 0 : e.parentTaskId) ?? null,
    isPrivate: !!(e != null && e.isPrivate),
    predecessorIds: (e == null ? void 0 : e.predecessorIds) ?? [],
    tagNames: r.tagNames
  }), [r, e]), x = c.useCallback(() => {
    i(n), l({});
  }, [n]);
  return { values: r, setField: o, isDirty: f, errors: d, validate: m, toUpdateDto: p, reset: x };
}
function ce(e) {
  return [e.name, e.surname].filter(Boolean).join(" ") || e.userName;
}
function lt() {
  var s, a, n;
  const e = (n = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : n.task;
  return e ? Promise.resolve(e.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ot() {
  var r;
  const e = K({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: lt,
    staleTime: 3e5,
    retry: !1
  }), s = ((r = e.data) == null ? void 0 : r.items) ?? [], a = s.map((i) => ({ value: i.id, label: ce(i) })), n = new Map(s.map((i) => [i.id, ce(i)]));
  return { options: a, nameById: n, isLoading: e.isLoading };
}
function X() {
  var s, a, n;
  const e = (n = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : n.task;
  return e || null;
}
function ct(e) {
  const s = X();
  return s ? Promise.resolve(s.getFeatureAssignments(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function dt(e) {
  const s = M(), a = ["task-features", e], n = K({
    queryKey: a,
    queryFn: () => ct(e),
    enabled: !!e,
    staleTime: 3e4,
    retry: !1
  }), r = () => s.invalidateQueries({ queryKey: a }), i = A({
    mutationFn: (l) => Promise.resolve(X().addFeature(e, l)),
    onSuccess: r
  }), d = A({
    mutationFn: (l) => Promise.resolve(X().removeFeature(e, l)),
    onSuccess: r
  });
  return {
    assignedCodes: n.data ?? [],
    isLoading: n.isLoading,
    addFeature: i.mutateAsync,
    removeFeature: d.mutateAsync,
    mutatingCode: i.variables ?? d.variables ?? null,
    isMutating: i.isPending || d.isPending
  };
}
function ut({ taskId: e, task: s, onOpenSubtask: a }) {
  const [n, r] = c.useState(""), [i, d] = c.useState(!1), [l, o] = c.useState(null), f = M(), m = (s == null ? void 0 : s.subTasks) ?? [], p = () => f.invalidateQueries({ queryKey: ["task-detail", e] }), x = async () => {
    var v, j, N;
    const u = n.trim();
    if (u) {
      d(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: u,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: e,
          projectId: s == null ? void 0 : s.projectId
        })), r(""), await p();
      } catch (C) {
        (N = (j = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : j.error) == null || N.call(j, (C == null ? void 0 : C.message) || "Alt görev eklenemedi.");
      } finally {
        d(!1);
      }
    }
  }, y = async (u) => {
    var v, j, N;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(u)), await p();
    } catch (C) {
      (N = (j = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : j.error) == null || N.call(j, (C == null ? void 0 : C.message) || "Alt görev silinemedi.");
    } finally {
      o(null);
    }
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ t.jsx(
        P,
        {
          value: n,
          onChange: (u) => r(u.target.value),
          onKeyDown: (u) => {
            u.key === "Enter" && x();
          },
          placeholder: "Yeni alt görev başlığı",
          disabled: i
        }
      ),
      /* @__PURE__ */ t.jsx(k, { variant: "secondary", onClick: x, disabled: i || !n.trim(), children: "Alt Görev Ekle" })
    ] }),
    m.length === 0 ? /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ t.jsx("ul", { className: "divide-y divide-border-default", children: m.map((u) => {
      var v, j;
      return /* @__PURE__ */ t.jsxs("li", { className: "flex items-center justify-between py-2", children: [
        /* @__PURE__ */ t.jsx(
          "button",
          {
            type: "button",
            onClick: () => a == null ? void 0 : a(u.id, u.title),
            className: "text-left text-sm font-medium text-text-primary hover:underline",
            children: u.title
          }
        ),
        /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ t.jsx(Y, { variant: ((v = q[u.status]) == null ? void 0 : v.variant) ?? "neutral", children: ((j = q[u.status]) == null ? void 0 : j.text) ?? u.status }),
          l === u.id ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx("span", { className: "text-xs text-text-tertiary", children: "Emin misiniz?" }),
            /* @__PURE__ */ t.jsx(k, { variant: "destructive", onClick: () => y(u.id), children: "Evet, sil" }),
            /* @__PURE__ */ t.jsx(k, { variant: "ghost", onClick: () => o(null), children: "Vazgeç" })
          ] }) : /* @__PURE__ */ t.jsx(k, { variant: "ghost", onClick: () => o(u.id), "aria-label": `${u.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, u.id);
    }) })
  ] });
}
function pe() {
  var s, a, n;
  const e = (n = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : n.task;
  return e || null;
}
function mt(e) {
  const s = pe();
  return s ? Promise.resolve(s.getAttachments(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function ft(e, s) {
  const a = new FormData();
  a.append("file", s);
  const n = {}, r = Re();
  r && (n.RequestVerificationToken = r);
  const i = await fetch(`/api/tasks/attachments/upload/${e}`, {
    method: "POST",
    credentials: "include",
    headers: n,
    body: a
  });
  let d = null;
  try {
    d = await i.json();
  } catch {
  }
  if (!i.ok || (d == null ? void 0 : d.success) === !1)
    throw new Error((d == null ? void 0 : d.error) || "Dosya yüklenemedi.");
  return d;
}
function pt(e) {
  const s = M(), a = ["task-attachments", e], n = K({
    queryKey: a,
    queryFn: () => mt(e),
    enabled: !!e,
    staleTime: 3e4,
    retry: !1
  }), r = () => s.invalidateQueries({ queryKey: a }), i = A({
    mutationFn: (l) => ft(e, l),
    onSuccess: r
  }), d = A({
    mutationFn: (l) => Promise.resolve(pe().deleteAttachment(l)),
    onSuccess: r
  });
  return {
    attachments: n.data ?? [],
    isLoading: n.isLoading,
    upload: i.mutateAsync,
    remove: d.mutateAsync,
    isUploading: i.isPending
  };
}
function xt(e) {
  return `${Math.round(e / 1024)} KB`;
}
function yt({ taskId: e }) {
  const { attachments: s, upload: a, remove: n, isUploading: r } = pt(e), i = c.useRef(null), d = async (o) => {
    var m, p, x, y, u, v, j;
    const f = (m = o.target.files) == null ? void 0 : m[0];
    if (f)
      try {
        await a(f), (y = (x = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : x.success) == null || y.call(x, "Dosya yüklendi.");
      } catch (N) {
        (j = (v = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : v.error) == null || j.call(v, (N == null ? void 0 : N.message) || "Dosya yüklenemedi.");
      } finally {
        i.current && (i.current.value = "");
      }
  }, l = async (o, f) => {
    var m, p, x;
    try {
      await n(o);
    } catch (y) {
      (x = (p = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : p.error) == null || x.call(p, (y == null ? void 0 : y.message) || `${f} silinemedi.`);
    }
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ t.jsx("input", { ref: i, type: "file", onChange: d, className: "text-sm", disabled: r }),
      r && /* @__PURE__ */ t.jsx("span", { className: "text-sm text-text-tertiary", children: "Yükleniyor…" })
    ] }),
    s.length === 0 ? /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ t.jsx("ul", { className: "divide-y divide-border-default", children: s.map((o) => /* @__PURE__ */ t.jsxs("li", { className: "flex items-center justify-between py-2", children: [
      /* @__PURE__ */ t.jsxs("div", { children: [
        /* @__PURE__ */ t.jsx("a", { href: o.downloadUrl, target: "_blank", rel: "noreferrer", className: "text-sm font-medium text-text-primary hover:underline", children: o.fileName }),
        /* @__PURE__ */ t.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          xt(o.fileSize),
          " — ",
          o.uploaderName
        ] })
      ] }),
      /* @__PURE__ */ t.jsx(k, { variant: "ghost", onClick: () => l(o.id, o.fileName), "aria-label": `${o.fileName} dosyasini sil`, children: "Sil" })
    ] }, o.id)) })
  ] });
}
function U() {
  var s, a, n;
  const e = (n = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : n.task;
  return e || null;
}
function ht(e) {
  const s = U();
  return s ? Promise.resolve(s.getChecklistItems(e)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function vt(e) {
  const s = M(), a = ["task-checklist", e], n = K({
    queryKey: a,
    queryFn: () => ht(e),
    enabled: !!e,
    staleTime: 3e4,
    retry: !1
  }), r = () => s.invalidateQueries({ queryKey: a }), i = A({
    mutationFn: (o) => Promise.resolve(U().addChecklistItem(e, o)),
    onSuccess: r
  }), d = A({
    mutationFn: (o) => Promise.resolve(U().toggleChecklistItem(o)),
    onSuccess: r
  }), l = A({
    mutationFn: (o) => Promise.resolve(U().deleteChecklistItem(o)),
    onSuccess: r
  });
  return {
    items: n.data ?? [],
    isLoading: n.isLoading,
    addItem: i.mutateAsync,
    toggleItem: d.mutateAsync,
    removeItem: l.mutateAsync
  };
}
function gt({ taskId: e }) {
  const { items: s, addItem: a, toggleItem: n, removeItem: r } = vt(e), [i, d] = c.useState(""), l = async () => {
    var p, x, y;
    const m = i.trim();
    if (m)
      try {
        await a(m), d("");
      } catch (u) {
        (y = (x = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : x.error) == null || y.call(x, (u == null ? void 0 : u.message) || "Madde eklenemedi.");
      }
  }, o = async (m) => {
    var p, x, y;
    try {
      await n(m);
    } catch (u) {
      (y = (x = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : x.error) == null || y.call(x, (u == null ? void 0 : u.message) || "Madde güncellenemedi.");
    }
  }, f = async (m, p) => {
    var x, y, u;
    try {
      await r(m);
    } catch (v) {
      (u = (y = (x = window == null ? void 0 : window.abp) == null ? void 0 : x.notify) == null ? void 0 : y.error) == null || u.call(y, (v == null ? void 0 : v.message) || `${p} silinemedi.`);
    }
  };
  return /* @__PURE__ */ t.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ t.jsx(
        P,
        {
          value: i,
          onChange: (m) => d(m.target.value),
          onKeyDown: (m) => {
            m.key === "Enter" && l();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ t.jsx(k, { variant: "secondary", onClick: l, disabled: !i.trim(), children: "Ekle" })
    ] }),
    s.length === 0 ? /* @__PURE__ */ t.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ t.jsx("ul", { className: "space-y-1.5", children: s.map((m) => /* @__PURE__ */ t.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
      /* @__PURE__ */ t.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ t.jsx(
          "input",
          {
            type: "checkbox",
            checked: m.isDone,
            onChange: () => o(m.id)
          }
        ),
        /* @__PURE__ */ t.jsx("span", { className: m.isDone ? "text-text-tertiary line-through" : "text-text-primary", children: m.text })
      ] }),
      /* @__PURE__ */ t.jsx(k, { variant: "ghost", onClick: () => f(m.id, m.text), "aria-label": `${m.text} maddesini sil`, children: "Sil" })
    ] }, m.id)) })
  ] });
}
const xe = [
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
    component: ut
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
    component: yt
  },
  {
    code: "checklist",
    title: "Kontrol Listesi",
    icon: "fa-square-check",
    category: "gorev",
    isCore: !1,
    order: 10,
    permission: null,
    implemented: !0,
    component: gt
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
function bt(e = []) {
  const s = new Set(e);
  return xe.filter((a) => a.implemented && (a.isCore || s.has(a.code))).sort((a, n) => a.order - n.order);
}
function jt(e = []) {
  const s = new Set(e);
  return xe.filter((a) => !a.isCore).filter((a) => !a.permission || me(a.permission)).map((a) => ({ ...a, isAssigned: s.has(a.code) })).sort((a, n) => a.order - n.order);
}
let L = null;
const $ = /* @__PURE__ */ new Set(), J = /* @__PURE__ */ new Set();
function de() {
  $.forEach((e) => e());
}
function wt(e) {
  return typeof e == "string" && e ? e : e && typeof e == "object" && typeof e.id == "string" && e.id ? e.id : null;
}
const S = {
  open(e) {
    const s = wt(e);
    !s || s === L || (L = s, de());
  },
  close() {
    L !== null && (L = null, de());
  },
  subscribe(e) {
    return $.add(e), () => $.delete(e);
  },
  getSnapshot() {
    return L;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(e) {
    typeof e == "function" && J.add(e);
  },
  emitResult() {
    J.forEach((e) => e());
  },
  /** Yalnız testler için. */
  reset() {
    L = null, $.clear(), J.clear();
  }
}, ue = "apya.taskDetail.fullscreen";
function kt({ taskId: e, presentation: s = "modal", onClose: a }) {
  const [n, r] = c.useState(e), [i, d] = c.useState([]), { data: l, isLoading: o, isError: f, refetch: m } = Xe(n), p = et(), x = rt(l), y = ot(), u = dt(n), [v, j] = c.useState("general"), [N, C] = c.useState(!1), _ = z.useRef(null), V = c.useMemo(
    () => bt(u.assignedCodes),
    [u.assignedCodes]
  ), he = c.useMemo(
    () => jt(u.assignedCodes),
    [u.assignedCodes]
  ), T = V.find((h) => h.code === v) ?? V[0];
  z.useEffect(() => {
    T.code !== v && j(T.code);
  }, [T, v]);
  const te = T == null ? void 0 : T.component, ae = M(), [se, ve] = c.useState(
    () => {
      var h;
      return ((h = window.localStorage) == null ? void 0 : h.getItem(ue)) === "1";
    }
  ), [ne, ie] = c.useState(!1), I = c.useCallback(() => {
    at(), a == null || a();
  }, [a]);
  st(e, I), z.useEffect(() => {
    x.isDirty ? p.markDirty() : p.markClean();
  });
  const Q = c.useCallback(() => p.requestClose(I), [p, I]), ge = c.useCallback(() => {
    ve((h) => {
      var b;
      const g = !h;
      return (b = window.localStorage) == null || b.setItem(ue, g ? "1" : "0"), g;
    });
  }, []), be = me("Platform.Tasks.Delete"), [je, H] = c.useState(!1), [we, re] = c.useState(!1), ke = c.useCallback(async () => {
    var h, g, b, D, w, B;
    re(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(n)), (b = (g = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : g.info) == null || b.call(g, "Başarıyla silindi."), H(!1), p.markClean(), I();
    } catch (F) {
      (B = (w = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : w.error) == null || B.call(w, (F == null ? void 0 : F.message) || "Görev silinemedi.");
    } finally {
      re(!1);
    }
  }, [n, p, I]), G = c.useCallback(async () => {
    var h, g, b, D, w, B;
    if (!x.validate()) return !1;
    ie(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(n, x.toUpdateDto())
      ), await ae.invalidateQueries({ queryKey: ["task-detail", n] }), S.emitResult(), (b = (g = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : g.success) == null || b.call(g, "Kaydedildi."), !0;
    } catch (F) {
      return (B = (w = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : w.error) == null || B.call(w, (F == null ? void 0 : F.message) || "Kaydedilemedi."), !1;
    } finally {
      ie(!1);
    }
  }, [n, x, p, ae]), Ne = c.useCallback(() => {
    G();
  }, [G]), Ce = c.useCallback(async () => {
    const h = p.resolvePendingClose("save");
    await G() && (h == null || h());
  }, [p, G]), De = c.useCallback((h, g) => {
    p.requestClose(() => {
      d((b) => [...b, { id: n, title: (l == null ? void 0 : l.title) ?? "" }]), r(h), j("general"), p.markClean();
    });
  }, [p, n, l]), Te = c.useCallback((h) => {
    p.requestClose(() => {
      d((g) => {
        const b = g.findIndex((D) => D.id === h);
        return b === -1 ? g : g.slice(0, b);
      }), r(h), j("general"), p.markClean();
    });
  }, [p]), Se = c.useCallback(async (h) => {
    var g, b, D;
    try {
      await u.addFeature(h), j(h), C(!1);
    } catch (w) {
      (D = (b = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : b.error) == null || D.call(b, (w == null ? void 0 : w.message) || "Özellik eklenemedi.");
    }
  }, [u]), Ee = c.useCallback(async (h) => {
    var g, b, D;
    try {
      await u.removeFeature(h), j((w) => w === h ? "general" : w);
    } catch (w) {
      (D = (b = (g = window == null ? void 0 : window.abp) == null ? void 0 : g.notify) == null ? void 0 : b.error) == null || D.call(b, (w == null ? void 0 : w.message) || "Özellik kaldırılamadı.");
    }
  }, [u]);
  z.useEffect(() => {
    if (!N) return;
    const h = (b) => {
      _.current && !_.current.contains(b.target) && C(!1);
    }, g = (b) => {
      b.key === "Escape" && C(!1);
    };
    return document.addEventListener("mousedown", h), document.addEventListener("keydown", g), () => {
      document.removeEventListener("mousedown", h), document.removeEventListener("keydown", g);
    };
  }, [N]);
  const Fe = o ? /* @__PURE__ */ t.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ t.jsx(O, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ t.jsx(O, { className: "h-24 w-full" }),
    /* @__PURE__ */ t.jsx(O, { className: "h-24 w-full" })
  ] }) : f ? /* @__PURE__ */ t.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ t.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ t.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ t.jsx(k, { variant: "ghost", onClick: () => m(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ t.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ t.jsx(
      Ze,
      {
        trail: i,
        current: { id: n, title: (l == null ? void 0 : l.title) ?? "" },
        onNavigate: Te
      }
    ),
    /* @__PURE__ */ t.jsxs("div", { className: "relative", ref: _, children: [
      /* @__PURE__ */ t.jsx(
        Qe,
        {
          tabs: V,
          activeCode: T.code,
          onSelect: (h) => {
            j(h), C(!1);
          },
          onOpenPicker: () => C((h) => !h),
          pickerOpen: N
        }
      ),
      N && /* @__PURE__ */ t.jsx(
        Je,
        {
          entries: he,
          busyCode: u.isMutating ? u.mutatingCode : null,
          onAdd: Se,
          onRemove: Ee
        }
      )
    ] }),
    /* @__PURE__ */ t.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${T.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          T.code === "general" ? /* @__PURE__ */ t.jsx(
            $e,
            {
              values: x.values,
              errors: x.errors,
              onFieldChange: x.setField,
              assigneeOptions: y.options,
              isLoadingAssignees: y.isLoading
            }
          ) : /* @__PURE__ */ t.jsx(c.Suspense, { fallback: /* @__PURE__ */ t.jsx(O, { className: "h-24 w-full" }), children: te && /* @__PURE__ */ t.jsx(
            te,
            {
              taskId: n,
              task: l,
              onOpenSubtask: De
            }
          ) }),
          /* @__PURE__ */ t.jsx(
            Ye,
            {
              task: l,
              creatorName: y.nameById.get(l.creatorId),
              lastModifierName: y.nameById.get(l.lastModifierId)
            }
          )
        ]
      }
    )
  ] });
  return /* @__PURE__ */ t.jsxs(
    ze,
    {
      open: !0,
      fullscreen: se,
      onRequestClose: Q,
      title: l ? `Görev Detayı: ${l.title}` : "Görev Detayı",
      header: /* @__PURE__ */ t.jsx(
        Ke,
        {
          task: l ?? { title: "Yükleniyor…" },
          canDelete: be,
          fullscreen: se,
          onToggleFullscreen: ge,
          onClose: Q,
          onDelete: () => H(!0)
        }
      ),
      footer: /* @__PURE__ */ t.jsx(
        Ge,
        {
          lastSavedAt: l == null ? void 0 : l.lastModificationTime,
          isDirty: p.isDirty,
          isSaving: ne,
          onCancel: Q,
          onSave: Ne
        }
      ),
      children: [
        Fe,
        p.pendingClose && /* @__PURE__ */ t.jsx(
          Ct,
          {
            isSaving: ne,
            onStay: () => p.resolvePendingClose("stay"),
            onDiscard: () => p.resolvePendingClose("discard"),
            onSaveAndClose: Ce
          }
        ),
        je && /* @__PURE__ */ t.jsx(
          Nt,
          {
            taskTitle: (l == null ? void 0 : l.title) ?? "",
            busy: we,
            onCancel: () => H(!1),
            onConfirm: ke
          }
        )
      ]
    }
  );
}
function Nt({ taskTitle: e, busy: s, onCancel: a, onConfirm: n }) {
  const [r, i] = c.useState(""), d = r.trim() === "SİL";
  return /* @__PURE__ */ t.jsxs(
    ye,
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
        /* @__PURE__ */ t.jsx(k, { variant: "secondary", onClick: a, disabled: s, children: "İptal" }),
        /* @__PURE__ */ t.jsx(
          k,
          {
            variant: "destructive",
            onClick: n,
            disabled: !d,
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
            value: r,
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
function ye({ label: e, title: s, description: a, children: n, actions: r }) {
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
        n,
        /* @__PURE__ */ t.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: r })
      ] })
    }
  );
}
function Ct({ isSaving: e, onStay: s, onDiscard: a, onSaveAndClose: n }) {
  return /* @__PURE__ */ t.jsx(
    ye,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        /* @__PURE__ */ t.jsx(k, { variant: "secondary", onClick: s, disabled: e, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ t.jsx(k, { variant: "destructive", onClick: a, disabled: e, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ t.jsx(k, { variant: "primary", onClick: n, isLoading: e, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
function Dt() {
  const e = c.useSyncExternalStore(
    S.subscribe,
    S.getSnapshot,
    () => null
  );
  return e ? /* @__PURE__ */ t.jsx(Pe, { children: /* @__PURE__ */ t.jsx(
    kt,
    {
      taskId: e,
      presentation: "modal",
      onClose: () => {
        S.close(), S.emitResult();
      }
    }
  ) }) : null;
}
function Tt(e) {
  var s;
  try {
    const a = new URLSearchParams(window.location.search).get("taskui");
    if (a === "v2") return !0;
    if (a === "v1") return !1;
  } catch {
  }
  return ((s = e == null ? void 0 : e.dataset) == null ? void 0 : s.taskui) !== "v1";
}
const Z = document.getElementById("task-detail-island");
if (Z && (window.apya = window.apya || {}, window.apya.taskDetailV2Enabled = Tt(Z), window.apya.taskDetail = {
  open: (e) => S.open(e),
  close: () => S.close(),
  onResult: (e) => S.onResult(e)
}, Ae(Z).render(/* @__PURE__ */ t.jsx(Dt, {})), window.apya.taskDetailV2Enabled)) {
  const e = fe();
  e && S.open(e);
}
