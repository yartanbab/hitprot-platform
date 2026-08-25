import { j as e, r as x, d as Le, b as Vt } from "./react-vendor.js";
/* empty css      */
import { a as Ue } from "./QueryProvider.js";
import { u as ie, a as le, b as xe } from "./query-vendor.js";
import { D as Qt, i as Zt, g as rt, B as ae, I as Se, S as fe } from "./Dialog.js";
import { C as Ca } from "./Combobox.js";
import { r as Ta } from "./httpClient.js";
import { R as be, T as he, P as ge, C as ye, A as Da, a as Wt, D as Sa, b as $a, c as Ea, d as Pa, e as Ia } from "./ui-vendor.js";
function Aa({
  open: t,
  onRequestClose: a,
  fullscreen: s,
  title: r,
  header: o,
  footer: i,
  children: n
}) {
  return /* @__PURE__ */ e.jsx(
    Qt,
    {
      open: t,
      onOpenChange: (l) => {
        l || a();
      },
      children: /* @__PURE__ */ e.jsx(
        Zt,
        {
          title: r,
          fullscreen: s,
          onInteractOutside: (l) => {
            l.preventDefault(), a();
          },
          onEscapeKeyDown: (l) => {
            l.preventDefault(), a();
          },
          children: /* @__PURE__ */ e.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
            o,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: n }),
            i
          ] })
        }
      )
    }
  );
}
function La({ title: t, header: a, footer: s, children: r }) {
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "flex h-full min-h-[calc(100vh-120px)] flex-col rounded-xl border border-default bg-surface-elevated shadow-sm",
      "aria-label": t,
      children: /* @__PURE__ */ e.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
        a,
        /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: r }),
        s
      ] })
    }
  );
}
function za({ isPrivate: t }) {
  return t ? /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1.5 text-[13px] text-text-secondary",
      title: "Bu görev yalnızca yetkilendirilmiş kullanıcılar tarafından görüntülenebilir.",
      children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-lock text-text-tertiary", "aria-hidden": "true" }),
        "Sınırlı erişim"
      ]
    }
  ) : null;
}
const nt = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, it = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function Ba({
  task: t,
  canDelete: a,
  onClose: s,
  onDelete: r,
  onToggleFullscreen: o,
  fullscreen: i = !1
}) {
  const [n, l] = x.useState(!1), m = x.useRef(null);
  x.useEffect(() => {
    if (!n) return;
    const f = (y) => {
      m.current && !m.current.contains(y.target) && l(!1);
    }, h = (y) => {
      y.key === "Escape" && l(!1);
    };
    return document.addEventListener("mousedown", f), document.addEventListener("keydown", h), () => {
      document.removeEventListener("mousedown", f), document.removeEventListener("keydown", h);
    };
  }, [n]);
  const d = nt[t == null ? void 0 : t.status] ?? nt[1], c = it[t == null ? void 0 : t.priority] ?? it[2], u = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), l(!1);
  }, b = () => {
    var h, y, v, w;
    const f = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (h = navigator.clipboard) == null || h.writeText(f), (w = (v = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : v.info) == null || w.call(v, "Bağlantı kopyalandı."), l(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(rt, { variant: d.variant, children: d.text }),
        /* @__PURE__ */ e.jsx(rt, { variant: c.variant, children: c.text }),
        /* @__PURE__ */ e.jsx(za, { isPrivate: t == null ? void 0 : t.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": i ? "Küçült" : "Tam ekrana büyüt",
          onClick: o,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: i ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: m, children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": n,
            onClick: () => l((f) => !f),
            className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-ellipsis", "aria-hidden": "true" })
          }
        ),
        n && /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "menu",
            className: "absolute right-0 z-popover mt-1 w-56 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated py-1 shadow-xl",
            children: [
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  role: "menuitem",
                  onClick: u,
                  className: "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-raised",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa fa-arrow-up-right-from-square w-4 text-text-tertiary", "aria-hidden": "true" }),
                    "Yeni sekmede aç"
                  ]
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  role: "menuitem",
                  onClick: b,
                  className: "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-raised",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa fa-link w-4 text-text-tertiary", "aria-hidden": "true" }),
                    "Bağlantıyı kopyala"
                  ]
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  role: "menuitem",
                  disabled: !0,
                  title: "Yakında",
                  className: "flex w-full cursor-not-allowed items-center gap-2 px-3 py-2 text-left text-sm text-text-tertiary",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa fa-copy w-4", "aria-hidden": "true" }),
                    "Çoğalt",
                    /* @__PURE__ */ e.jsx("span", { className: "ml-auto text-[11px]", children: "Yakında" })
                  ]
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  role: "menuitem",
                  disabled: !0,
                  title: "Yakında",
                  className: "flex w-full cursor-not-allowed items-center gap-2 px-3 py-2 text-left text-sm text-text-tertiary",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa fa-box-archive w-4", "aria-hidden": "true" }),
                    "Arşivle",
                    /* @__PURE__ */ e.jsx("span", { className: "ml-auto text-[11px]", children: "Yakında" })
                  ]
                }
              ),
              a && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsx("div", { className: "my-1 h-px bg-border-subtle" }),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    onClick: () => {
                      l(!1), r();
                    },
                    className: "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-negative hover:bg-surface-raised",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa fa-trash w-4", "aria-hidden": "true" }),
                      "Sil"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": "Kapat",
          onClick: s,
          className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] })
  ] }) });
}
const Ka = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function Ra({ lastSavedAt: t, isDirty: a, isSaving: s, onCancel: r, onSave: o }) {
  const i = Ka(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: i ? `Son kayıt: ${i}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(ae, { variant: "secondary", onClick: r, disabled: s, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        ae,
        {
          variant: "primary",
          onClick: () => o == null ? void 0 : o(),
          disabled: !a || !o,
          isLoading: s,
          loadingText: "Kaydediliyor…",
          children: "Kaydet"
        }
      )
    ] })
  ] }) });
}
const Ct = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", Ma = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function pe({ label: t, htmlFor: a, error: s, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: a, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    s && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: s })
  ] });
}
function Fa({ value: t, onChange: a }) {
  const [s, r] = x.useState(""), o = () => {
    const i = s.trim();
    i && !t.includes(i) && a([...t, i]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((i) => /* @__PURE__ */ e.jsxs(rt, { variant: "neutral", children: [
      i,
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${i} etiketini kaldır`,
          onClick: () => a(t.filter((n) => n !== i)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, i)) }),
    /* @__PURE__ */ e.jsx(
      Se,
      {
        value: s,
        onChange: (i) => r(i.target.value),
        onKeyDown: (i) => {
          i.key === "Enter" || i.key === "," ? (i.preventDefault(), o()) : i.key === "Backspace" && !s && t.length && a(t.slice(0, -1));
        },
        onBlur: o,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function Ga({
  values: t,
  errors: a,
  onFieldChange: s,
  assigneeOptions: r = [],
  isLoadingAssignees: o = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(pe, { label: "Başlık", htmlFor: "task-title", error: a.title, children: /* @__PURE__ */ e.jsx(
      Se,
      {
        id: "task-title",
        value: t.title,
        onChange: (i) => s("title", i.target.value),
        invalid: !!a.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(pe, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (i) => s("status", Number(i.target.value)),
          className: Ct,
          children: Object.entries(nt).map(([i, n]) => /* @__PURE__ */ e.jsx("option", { value: i, children: n.text }, i))
        }
      ) }),
      /* @__PURE__ */ e.jsx(pe, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (i) => s("priority", Number(i.target.value)),
          className: Ct,
          children: Object.entries(it).map(([i, n]) => /* @__PURE__ */ e.jsx("option", { value: i, children: n.text }, i))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(pe, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      Ca,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (i) => s("assigneeId", i),
        placeholder: o ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: o
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(pe, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: a.startDate, children: /* @__PURE__ */ e.jsx(
        Se,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (i) => s("startDate", i.target.value),
          invalid: !!a.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(pe, { label: "Son Tarih", htmlFor: "task-due", error: a.dueDate, children: /* @__PURE__ */ e.jsx(
        Se,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (i) => s("dueDate", i.target.value),
          invalid: !!a.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(pe, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(Fa, { value: t.tagNames, onChange: (i) => s("tagNames", i) }) }),
    /* @__PURE__ */ e.jsx(pe, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (i) => s("description", i.target.value),
        className: Ma
      }
    ) })
  ] });
}
const Tt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function Pe({ label: t, value: a }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: a ?? "—" })
  ] });
}
function Oa({ task: t, creatorName: a, lastModifierName: s }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(Pe, { label: "Oluşturan", value: a }),
      /* @__PURE__ */ e.jsx(Pe, { label: "Oluşturulma zamanı", value: Tt(t.creationTime) }),
      /* @__PURE__ */ e.jsx(Pe, { label: "Güncelleyen", value: s }),
      /* @__PURE__ */ e.jsx(Pe, { label: "Son güncelleme zamanı", value: Tt(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(Pe, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const qa = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", Ya = "border-brand-500 text-text-primary";
function _a({ tabs: t, activeCode: a, onSelect: s, onOpenPicker: r, pickerOpen: o }) {
  const i = x.useRef(/* @__PURE__ */ new Map()), n = (m) => {
    var d;
    s(m.code), (d = i.current.get(m.code)) == null || d.focus();
  }, l = (m, d) => {
    m.key === "ArrowRight" ? (m.preventDefault(), n(t[(d + 1) % t.length])) : m.key === "ArrowLeft" ? (m.preventDefault(), n(t[(d - 1 + t.length) % t.length])) : m.key === "Home" ? (m.preventDefault(), n(t[0])) : m.key === "End" && (m.preventDefault(), n(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((m, d) => {
      const c = m.code === a;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (u) => {
            u ? i.current.set(m.code, u) : i.current.delete(m.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${m.code}`,
          "aria-selected": c,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: c ? 0 : -1,
          onClick: () => s(m.code),
          onKeyDown: (u) => l(u, d),
          className: `${qa} ${c ? Ya : ""}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa ${m.icon}`, "aria-hidden": "true" }),
            m.title
          ]
        },
        m.code
      );
    }) }),
    /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        "aria-label": "Özellik ekle",
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        onClick: r,
        className: "mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" })
      }
    )
  ] });
}
const Ua = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function Ha({ entries: t, onAdd: a, onRemove: s, busyCode: r }) {
  const [o, i] = x.useState(""), n = x.useMemo(() => {
    const l = o.trim().toLocaleLowerCase("tr-TR"), m = l ? t.filter((c) => c.title.toLocaleLowerCase("tr-TR").includes(l)) : t, d = /* @__PURE__ */ new Map();
    return m.forEach((c) => {
      const u = d.get(c.category) ?? [];
      u.push(c), d.set(c.category, u);
    }), d;
  }, [t, o]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ e.jsx(
          Se,
          {
            autoFocus: !0,
            value: o,
            onChange: (l) => i(l.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          n.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...n.entries()].map(([l, m]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: Ua[l] ?? l }),
            m.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa ${d.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: d.title }),
              !d.implemented && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              d.implemented && !d.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === d.code,
                  onClick: () => a(d.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              d.implemented && d.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === d.code,
                  onClick: () => s(d.code),
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
function Va({ trail: t = [], current: a, onNavigate: s }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(Le.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => s == null ? void 0 : s(r.id),
          className: "hover:underline hover:text-text-primary",
          children: r.title
        }
      ),
      /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "/" })
    ] }, r.id)),
    /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary", children: a.title })
  ] });
}
function Qa(t) {
  var s, r, o;
  const a = (o = (r = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : r.tasks) == null ? void 0 : o.task;
  return a ? Promise.resolve(a.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function dt(t) {
  return ie({
    queryKey: ["task-detail", t],
    queryFn: () => Qa(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function Jt(t) {
  var a, s, r;
  return !!((r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.auth) == null ? void 0 : s.isGranted) != null && r.call(s, t));
}
function Xt() {
  const [t, a] = x.useState(!1), [s, r] = x.useState(!1), o = x.useRef(null), i = x.useCallback(() => a(!0), []), n = x.useCallback(() => a(!1), []);
  x.useEffect(() => {
    if (!t) return;
    const d = (c) => {
      c.preventDefault(), c.returnValue = "";
    };
    return window.addEventListener("beforeunload", d), () => window.removeEventListener("beforeunload", d);
  }, [t]);
  const l = x.useCallback((d) => {
    if (!t) {
      d == null || d();
      return;
    }
    o.current = d ?? null, r(!0);
  }, [t]), m = x.useCallback((d) => {
    const c = o.current;
    return r(!1), o.current = null, d === "discard" && (a(!1), c == null || c()), d === "save" ? c : null;
  }, []);
  return { isDirty: t, markDirty: i, markClean: n, requestClose: l, pendingClose: s, resolvePendingClose: m };
}
const Za = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, xt = "task";
function ea() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(xt);
  return t && Za.test(t) ? t : null;
}
function ta() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(xt), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function aa(t, a) {
  const s = x.useRef(a);
  s.current = a, x.useEffect(() => {
    if (!t || ea() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(xt, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), x.useEffect(() => {
    const r = () => {
      var o;
      (o = s.current) == null || o.call(s);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const Wa = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: [],
  isPrivate: !1,
  projectId: null,
  estimatedHours: null,
  taskType: "",
  sprint: ""
};
function Ja(t) {
  return t ? {
    title: t.title ?? "",
    description: t.description ?? "",
    startDate: t.startDate ? t.startDate.slice(0, 10) : "",
    dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
    status: t.status ?? 1,
    priority: t.priority ?? 2,
    assigneeId: t.assigneeId ?? null,
    tagNames: (t.tags ?? []).map((a) => a.name),
    isPrivate: !!t.isPrivate,
    projectId: t.projectId ?? null,
    estimatedHours: t.estimatedHours ?? null,
    taskType: t.taskType ?? "",
    sprint: t.sprint ?? ""
  } : Wa;
}
function sa(t) {
  const [a, s] = x.useState(t == null ? void 0 : t.id), r = x.useMemo(() => Ja(t), [t]), [o, i] = x.useState(r), [n, l] = x.useState({});
  (t == null ? void 0 : t.id) !== a && (s(t == null ? void 0 : t.id), i(r), l({}));
  const m = x.useCallback((f, h) => {
    i((y) => ({ ...y, [f]: h }));
  }, []), d = x.useMemo(
    () => JSON.stringify(o) !== JSON.stringify(r),
    [o, r]
  ), c = x.useCallback(() => {
    const f = {};
    return o.title.trim() || (f.title = "Başlık zorunlu."), o.startDate || (f.startDate = "Başlangıç tarihi zorunlu."), o.dueDate && o.startDate && o.dueDate < o.startDate && (f.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), l(f), Object.keys(f).length === 0;
  }, [o]), u = x.useCallback(() => ({
    title: o.title.trim(),
    description: o.description || null,
    startDate: o.startDate,
    dueDate: o.dueDate || null,
    status: o.status,
    priority: o.priority,
    assigneeId: o.assigneeId,
    boardColumnId: (t == null ? void 0 : t.boardColumnId) ?? null,
    projectId: o.projectId ?? null,
    parentTaskId: (t == null ? void 0 : t.parentTaskId) ?? null,
    isPrivate: !!o.isPrivate,
    predecessorIds: (t == null ? void 0 : t.predecessorIds) ?? [],
    tagNames: o.tagNames,
    estimatedHours: o.estimatedHours,
    taskType: o.taskType || null,
    sprint: o.sprint || null
  }), [o, t]), b = x.useCallback(() => {
    i(r), l({});
  }, [r]);
  return { values: o, setField: m, isDirty: d, errors: n, validate: c, toUpdateDto: u, reset: b };
}
function Dt(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Xa() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ra() {
  var o;
  const t = ie({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Xa,
    staleTime: 3e5,
    retry: !1
  }), a = ((o = t.data) == null ? void 0 : o.items) ?? [], s = a.map((i) => ({ value: i.id, label: Dt(i) })), r = new Map(a.map((i) => [i.id, Dt(i)]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
function lt() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function es(t) {
  const a = lt();
  return a ? Promise.resolve(a.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function na(t) {
  const a = le(), s = ["task-features", t], r = ie({
    queryKey: s,
    queryFn: () => es(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), i = xe({
    mutationFn: (l) => Promise.resolve(lt().addFeature(t, l)),
    onSuccess: o
  }), n = xe({
    mutationFn: (l) => Promise.resolve(lt().removeFeature(t, l)),
    onSuccess: o
  });
  return {
    assignedCodes: r.data ?? [],
    isLoading: r.isLoading,
    addFeature: i.mutateAsync,
    removeFeature: n.mutateAsync,
    mutatingCode: i.variables ?? n.variables ?? null,
    isMutating: i.isPending || n.isPending
  };
}
const He = {
  0: { label: "İptal", icon: "fa-ban", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  1: { label: "Yapılacak", icon: "fa-clock", bg: "bg-neutral-subtle", fg: "text-text-secondary", dot: "bg-neutral-400" },
  2: { label: "Sürüyor", icon: "fa-spinner", bg: "bg-warning-subtle", fg: "text-warning", dot: "bg-warning" },
  3: { label: "Testte", icon: "fa-flask", bg: "bg-primary-subtle", fg: "text-primary", dot: "bg-primary" },
  4: { label: "Tamamlandı", icon: "fa-circle-check", bg: "bg-success-subtle", fg: "text-success", dot: "bg-success" }
}, ot = {
  1: { label: "Düşük", icon: "fa-arrow-down", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  2: { label: "Orta", icon: "fa-minus", bg: "bg-warning-subtle", fg: "text-warning" },
  3: { label: "Yüksek", icon: "fa-arrow-up", bg: "bg-negative-subtle", fg: "text-negative" },
  4: { label: "Kritik", icon: "fa-flag", bg: "bg-negative-subtle", fg: "text-negative" }
}, ia = [1, 2, 3, 4], ts = [1, 2, 3, 4], Be = (t) => He[t] ?? He[1], la = (t) => ot[t] ?? ot[2];
function Ke(t) {
  return t ? t.trim().split(/\s+/).map((a) => a[0]).join("").slice(0, 2).toUpperCase() : "—";
}
const St = ["#4F46E5", "#0EA5E9", "#059669", "#D97706", "#DB2777", "#7C3AED"];
function Re(t) {
  if (!t) return "#9CA3AF";
  let a = 0;
  for (let s = 0; s < t.length; s++) a = a * 31 + t.charCodeAt(s) | 0;
  return St[Math.abs(a) % St.length];
}
function as(t, a = /* @__PURE__ */ new Date()) {
  if (!t) return { tone: "text-text-tertiary", hint: "" };
  const s = new Date(t);
  if (Number.isNaN(s.getTime())) return { tone: "text-text-tertiary", hint: "" };
  const r = Math.ceil((s.setHours(0, 0, 0, 0) - new Date(a).setHours(0, 0, 0, 0)) / 864e5);
  return r < 0 ? { tone: "text-negative", hint: `${Math.abs(r)} gün gecikti` } : r === 0 ? { tone: "text-warning", hint: "Bugün" } : r <= 3 ? { tone: "text-warning", hint: `${r} gün kaldı` } : { tone: "text-text-tertiary", hint: `${r} gün kaldı` };
}
const $e = "rounded-2xl border border-subtle bg-surface-base shadow-xs overflow-hidden";
function ct({ title: t, badge: a, action: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3.5 border-b border-subtle", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: t }),
      a
    ] }),
    s
  ] });
}
function ss({ children: t, tone: a = "positive" }) {
  const s = a === "positive" ? "bg-success-subtle text-success" : "bg-neutral-subtle text-text-secondary";
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-full font-mono text-[11px] font-bold ${s}`, children: t });
}
function Ve({ children: t, bg: a, fg: s }) {
  return /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center h-[22px] px-[9px] rounded-[7px] text-[10.5px] font-bold ${a} ${s}`, children: t });
}
function ze({ icon: t, title: a, description: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 px-6 py-10 text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-xl text-text-tertiary` }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: a }),
    s && /* @__PURE__ */ e.jsx("span", { className: "text-[12px] leading-[1.55] text-text-tertiary max-w-[420px]", children: s })
  ] });
}
function oa({ name: t, size: a = 24 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-white font-bold",
      style: { height: a, width: a, background: Re(t), fontSize: a * 0.4 },
      title: t || void 0,
      children: Ke(t)
    }
  );
}
const ca = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—", $t = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function rs(t) {
  return t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "0 KB";
}
function Qe(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = Math.floor(a / 3600), r = Math.floor(a % 3600 / 60);
  return !s && !r ? `${a}sn` : s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function ns(t) {
  const a = Math.max(0, Math.floor(t || 0)), s = (r) => String(r).padStart(2, "0");
  return `${s(Math.floor(a / 3600))}:${s(Math.floor(a / 60) % 60)}:${s(a % 60)}`;
}
const Ne = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  image: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  sheet: { icon: "fa-file-excel", bg: "bg-success-subtle", fg: "text-success" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  zip: { icon: "fa-file-zipper", bg: "bg-warning-subtle", fg: "text-warning" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
};
function is(t = "") {
  var s;
  const a = ((s = t.split(".").pop()) == null ? void 0 : s.toLowerCase()) ?? "";
  return a === "pdf" ? Ne.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(a) ? Ne.image : ["doc", "docx", "odt", "rtf", "txt"].includes(a) ? Ne.doc : ["xls", "xlsx", "csv", "ods"].includes(a) ? Ne.sheet : ["json", "js", "ts", "cs", "xml", "yml", "yaml", "sql"].includes(a) ? Ne.code : ["zip", "rar", "7z", "tar", "gz"].includes(a) ? Ne.zip : Ne.other;
}
function ls({ taskId: t, task: a, onOpenSubtask: s }) {
  const [r, o] = x.useState(""), [i, n] = x.useState(!1), l = le(), m = (a == null ? void 0 : a.subTasks) ?? [], d = m.filter((f) => f.status === 4).length, c = () => l.invalidateQueries({ queryKey: ["task-detail", t] }), u = async () => {
    var h, y, v;
    const f = r.trim();
    if (f) {
      n(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: f,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: a == null ? void 0 : a.projectId
        })), o(""), await c();
      } catch (w) {
        (v = (y = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : y.error) == null || v.call(y, (w == null ? void 0 : w.message) || "Alt görev eklenemedi.");
      } finally {
        n(!1);
      }
    }
  }, b = async (f, h) => {
    var y, v, w;
    f.stopPropagation();
    try {
      await Promise.resolve(window.apya.platform.tasks.task.updateStatus(h.id, h.status === 4 ? 1 : 4)), await c();
    } catch (D) {
      (w = (v = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : v.error) == null || w.call(v, (D == null ? void 0 : D.message) || "Alt görev durumu güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Alt görevler" }),
        m.length > 0 && /* @__PURE__ */ e.jsxs(ss, { children: [
          d,
          "/",
          m.length
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: u,
          disabled: i || !r.trim(),
          className: `flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${i || !r.trim() ? "bg-border-strong cursor-not-allowed" : "bg-primary hover:bg-primary-hover cursor-pointer"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            "Alt görev ekle"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
      m.map((f) => {
        const h = Be(f.status), y = f.status === 4;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            role: "button",
            tabIndex: 0,
            onClick: () => s == null ? void 0 : s(f.id, f.title),
            onKeyDown: (v) => {
              v.key === "Enter" && (s == null || s(f.id, f.title));
            },
            className: "flex items-center gap-3.5 px-4 py-3.5 border-t border-subtle first:border-t-0 hover:bg-surface-raised cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  "aria-label": `${f.title} tamamlandı işaretle`,
                  onClick: (v) => b(v, f),
                  className: `flex shrink-0 items-center justify-center h-[19px] w-[19px] p-0 rounded-md border-[1.5px] text-white cursor-pointer ${y ? "bg-success border-success" : "bg-transparent border-strong"}`,
                  children: y && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                }
              ),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: f.code }),
              /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 truncate text-[13px] font-semibold ${y ? "line-through text-text-tertiary" : "text-text-primary"}`, children: f.title }),
              /* @__PURE__ */ e.jsx(Ve, { bg: h.bg, fg: h.fg, children: h.label }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: ca(f.dueDate) }),
              /* @__PURE__ */ e.jsx(oa, { name: f.assigneeName }),
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-right shrink-0 text-[10px] text-text-tertiary" })
            ]
          },
          f.id
        );
      }),
      /* @__PURE__ */ e.jsx("div", { className: "px-4 py-3 border-t border-subtle first:border-t-0", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "text",
          value: r,
          onChange: (f) => o(f.target.value),
          onKeyDown: (f) => {
            f.key === "Enter" && u();
          },
          disabled: i,
          placeholder: "Yeni alt görev başlığı",
          className: "w-full h-9 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
        }
      ) })
    ] }),
    m.length === 0 && /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz alt görev yok." })
  ] });
}
function da() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function os(t) {
  const a = da();
  return a ? Promise.resolve(a.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function cs(t, a) {
  const s = new FormData();
  s.append("file", a);
  const r = {}, o = Ta();
  o && (r.RequestVerificationToken = o);
  const i = await fetch(`/api/tasks/attachments/upload/${t}`, {
    method: "POST",
    credentials: "include",
    headers: r,
    body: s
  });
  let n = null;
  try {
    n = await i.json();
  } catch {
  }
  if (!i.ok || (n == null ? void 0 : n.success) === !1)
    throw new Error((n == null ? void 0 : n.error) || "Dosya yüklenemedi.");
  return n;
}
function xa(t) {
  const a = le(), s = ["task-attachments", t], r = ie({
    queryKey: s,
    queryFn: () => os(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), i = xe({
    mutationFn: (l) => cs(t, l),
    onSuccess: o
  }), n = xe({
    mutationFn: (l) => Promise.resolve(da().deleteAttachment(l)),
    onSuccess: o
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: i.mutateAsync,
    remove: n.mutateAsync,
    isUploading: i.isPending
  };
}
function ds({ taskId: t }) {
  const { attachments: a, upload: s, remove: r, isUploading: o } = xa(t), i = x.useRef(null), [n, l] = x.useState(!1), m = async (c) => {
    var u, b, f, h, y, v;
    if (c)
      try {
        await s(c), (f = (b = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : b.success) == null || f.call(b, "Dosya yüklendi.");
      } catch (w) {
        (v = (y = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : y.error) == null || v.call(y, (w == null ? void 0 : w.message) || "Dosya yüklenemedi.");
      } finally {
        i.current && (i.current.value = "");
      }
  }, d = async (c, u) => {
    var b, f, h;
    try {
      await r(c);
    } catch (y) {
      (h = (f = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : f.error) == null || h.call(f, (y == null ? void 0 : y.message) || `${u} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: i,
        type: "file",
        className: "hidden",
        onChange: (c) => {
          var u;
          return m((u = c.target.files) == null ? void 0 : u[0]);
        },
        disabled: o
      }
    ),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "button",
        tabIndex: 0,
        onClick: () => {
          var c;
          return (c = i.current) == null ? void 0 : c.click();
        },
        onKeyDown: (c) => {
          var u;
          c.key === "Enter" && ((u = i.current) == null || u.click());
        },
        onDragOver: (c) => {
          c.preventDefault(), n || l(!0);
        },
        onDragLeave: () => l(!1),
        onDrop: (c) => {
          var u, b;
          c.preventDefault(), l(!1), m((b = (u = c.dataTransfer) == null ? void 0 : u.files) == null ? void 0 : b[0]);
        },
        className: `flex flex-col items-center justify-center gap-2.5 p-[34px] rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-fast ${n ? "border-focus bg-primary-subtle" : "border-strong bg-surface-base"}`,
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-[26px] ${n ? "text-primary" : "text-text-tertiary"}` }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13.5px] font-bold text-text-primary", children: o ? "Yükleniyor…" : n ? "Bırakın, yükleyelim" : "Dosyaları buraya sürükleyin veya tıklayın" }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "PNG, PDF, DOCX · max 25MB" })
        ]
      }
    ),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3", children: a.map((c) => {
      const u = is(c.fileName);
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex flex-col gap-2.5 p-3.5 rounded-[14px] border border-subtle bg-surface-base shadow-xs hover:border-focus hover:shadow-md",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[38px] w-[38px] rounded-[10px] ${u.bg} ${u.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${u.icon} text-[15px]` }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ e.jsx("div", { className: "truncate text-[12.5px] font-bold text-text-primary", title: c.fileName, children: c.fileName }),
                /* @__PURE__ */ e.jsx("div", { className: "font-mono text-[11px] text-text-tertiary", children: rs(c.fileSize) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2.5 border-t border-subtle", children: [
              /* @__PURE__ */ e.jsx("span", { className: "truncate text-[11px] text-text-tertiary", children: c.uploaderName }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-1 shrink-0", children: [
                /* @__PURE__ */ e.jsx(
                  "a",
                  {
                    href: c.downloadUrl,
                    target: "_blank",
                    rel: "noreferrer",
                    title: "İndir",
                    "aria-label": `${c.fileName} dosyasini indir`,
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-primary-subtle hover:text-primary",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-download text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Sil",
                    "aria-label": `${c.fileName} dosyasini sil`,
                    onClick: () => d(c.id, c.fileName),
                    className: "flex items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                )
              ] })
            ] })
          ]
        },
        c.id
      );
    }) })
  ] });
}
function Ye() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t || null;
}
function xs(t) {
  const a = Ye();
  return a ? Promise.resolve(a.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function ut(t) {
  const a = le(), s = ["task-checklist", t], r = ie({
    queryKey: s,
    queryFn: () => xs(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), o = () => a.invalidateQueries({ queryKey: s }), i = xe({
    mutationFn: (m) => Promise.resolve(Ye().addChecklistItem(t, m)),
    onSuccess: o
  }), n = xe({
    mutationFn: (m) => Promise.resolve(Ye().toggleChecklistItem(m)),
    onSuccess: o
  }), l = xe({
    mutationFn: (m) => Promise.resolve(Ye().deleteChecklistItem(m)),
    onSuccess: o
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: i.mutateAsync,
    toggleItem: n.mutateAsync,
    removeItem: l.mutateAsync
  };
}
function us({ taskId: t }) {
  const { items: a, addItem: s, toggleItem: r, removeItem: o } = ut(t), [i, n] = x.useState(""), l = async () => {
    var u, b, f;
    const c = i.trim();
    if (c)
      try {
        await s(c), n("");
      } catch (h) {
        (f = (b = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : b.error) == null || f.call(b, (h == null ? void 0 : h.message) || "Madde eklenemedi.");
      }
  }, m = async (c) => {
    var u, b, f;
    try {
      await r(c);
    } catch (h) {
      (f = (b = (u = window == null ? void 0 : window.abp) == null ? void 0 : u.notify) == null ? void 0 : b.error) == null || f.call(b, (h == null ? void 0 : h.message) || "Madde güncellenemedi.");
    }
  }, d = async (c, u) => {
    var b, f, h;
    try {
      await o(c);
    } catch (y) {
      (h = (f = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : f.error) == null || h.call(f, (y == null ? void 0 : y.message) || `${u} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        Se,
        {
          value: i,
          onChange: (c) => n(c.target.value),
          onKeyDown: (c) => {
            c.key === "Enter" && l();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(ae, { variant: "secondary", onClick: l, disabled: !i.trim(), children: "Ekle" })
    ] }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "space-y-1.5", children: a.map((c) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: c.isDone,
            onChange: () => m(c.id)
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: c.isDone ? "text-text-tertiary line-through" : "text-text-primary", children: c.text })
      ] }),
      /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => d(c.id, c.text), "aria-label": `${c.text} maddesini sil`, children: "Sil" })
    ] }, c.id)) })
  ] });
}
function ps({ taskId: t, task: a }) {
  const [s, r] = x.useState(""), [o, i] = x.useState(null), [n, l] = x.useState(""), [m, d] = x.useState(!1), c = le(), u = (a == null ? void 0 : a.comments) ?? [], b = async (h) => {
    var y, v, w, D, P, z;
    if (h == null || h.preventDefault(), !(!s.trim() || m)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, s.trim())
        ), r(""), c.invalidateQueries({ queryKey: ["task-detail", t] }), (w = (v = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : v.success) == null || w.call(v, "Yorum eklendi.");
      } catch (M) {
        (z = (P = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : P.error) == null || z.call(P, (M == null ? void 0 : M.message) || "Yorum eklenemedi.");
      } finally {
        d(!1);
      }
    }
  }, f = async (h) => {
    var y, v, w, D, P, z;
    if (!(!n.trim() || m)) {
      d(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(h, n.trim())
        ), l(""), i(null), c.invalidateQueries({ queryKey: ["task-detail", t] }), (w = (v = (y = window == null ? void 0 : window.abp) == null ? void 0 : y.notify) == null ? void 0 : v.success) == null || w.call(v, "Yanıt eklendi.");
      } catch (M) {
        (z = (P = (D = window == null ? void 0 : window.abp) == null ? void 0 : D.notify) == null ? void 0 : P.error) == null || z.call(P, (M == null ? void 0 : M.message) || "Yanıt eklenemedi.");
      } finally {
        d(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("form", { onSubmit: b, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
      /* @__PURE__ */ e.jsx(
        "textarea",
        {
          rows: 3,
          value: s,
          onChange: (h) => r(h.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        ae,
        {
          type: "submit",
          variant: "primary",
          disabled: !s.trim() || m,
          isLoading: m,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    u.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: u.map((h) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: h.creatorUserName || h.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: h.creationTime ? new Date(h.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: h.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        ae,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => i(o === h.id ? null : h.id),
          children: "Yanıtla"
        }
      ) }),
      o === h.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: n,
            onChange: (y) => l(y.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(ae, { variant: "ghost", size: "sm", onClick: () => i(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(ae, { variant: "primary", size: "sm", disabled: !n.trim() || m, onClick: () => f(h.id), children: "Gönder" })
        ] })
      ] }),
      h.replies && h.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: h.replies.map((y) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: y.creatorUserName || y.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: y.creationTime ? new Date(y.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: y.text })
      ] }, y.id)) })
    ] }, h.id)) })
  ] });
}
function ms({ task: t }) {
  var s;
  const a = [];
  return t != null && t.creationTime && a.push({
    id: "created",
    icon: "fa-plus",
    bg: "bg-success-subtle",
    fg: "text-success",
    actor: t.creatorUserName || t.creatorName || "Sistem / Kullanıcı",
    event: "görevi oluşturdu",
    time: $t(t.creationTime)
  }), t != null && t.lastModificationTime && a.push({
    id: "modified",
    icon: "fa-pen",
    bg: "bg-warning-subtle",
    fg: "text-warning",
    actor: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    event: "görevi güncelledi",
    time: $t(t.lastModificationTime)
  }), (s = t == null ? void 0 : t.attachments) != null && s.length && a.push({
    id: "files",
    icon: "fa-paperclip",
    bg: "bg-primary-subtle",
    fg: "text-primary",
    actor: "Sistem",
    event: `${t.attachments.length} dosya eki mevcut`,
    time: ""
  }), /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
    /* @__PURE__ */ e.jsx("h4", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Aktivite Zaman Çizelgesi" }),
    a.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[12.5px] text-text-tertiary", children: "Aktivite kaydı bulunamadı." }) }) : /* @__PURE__ */ e.jsx("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs", children: a.map((r, o) => {
      const i = o === a.length - 1;
      return /* @__PURE__ */ e.jsxs("div", { className: `flex items-start gap-3.5 ${i ? "" : "pb-[18px]"}`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center shrink-0 self-stretch", children: [
          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-7 w-7 rounded-full ${r.bg} ${r.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r.icon} text-[11px]` }) }),
          !i && /* @__PURE__ */ e.jsx("span", { className: "flex-1 w-0.5 mt-1.5 rounded-sm bg-subtle" })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 pt-1", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "text-[12.5px] leading-[1.55] text-text-secondary", children: [
            /* @__PURE__ */ e.jsx("strong", { className: "font-bold text-text-primary", children: r.actor }),
            " ",
            r.event
          ] }),
          r.time && /* @__PURE__ */ e.jsx("div", { className: "mt-[3px] font-mono text-[10.5px] text-text-tertiary", children: r.time })
        ] })
      ] }, r.id);
    }) })
  ] });
}
function fs({ task: t }) {
  const a = [
    { label: "Görev ID", value: (t == null ? void 0 : t.id) || "-" },
    { label: "Oluşturan", value: (t == null ? void 0 : t.creatorUserName) || (t == null ? void 0 : t.creatorName) || "Bilinmiyor" },
    { label: "Oluşturulma Tarihi", value: t != null && t.creationTime ? new Date(t.creationTime).toLocaleString("tr-TR") : "-" },
    { label: "Son Güncelleyen", value: (t == null ? void 0 : t.lastModifierUserName) || (t == null ? void 0 : t.lastModifierName) || "Henüz güncellenmedi" },
    { label: "Son Güncelleme Tarihi", value: t != null && t.lastModificationTime ? new Date(t.lastModificationTime).toLocaleString("tr-TR") : "-" },
    { label: "Proje ID", value: (t == null ? void 0 : t.projectId) || "Genel Projesiz Görev" }
  ];
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsx("h4", { className: "text-sm font-semibold text-text-primary", children: "Teknik Audit & Değişiklik Geçmişi" }),
    /* @__PURE__ */ e.jsx("div", { className: "rounded-lg border border-default divide-y divide-border-subtle bg-surface-elevated", children: a.map((s, r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between p-3 text-xs", children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: s.label }),
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-text-primary", children: s.value })
    ] }, r)) })
  ] });
}
function Ge(t, a) {
  const s = a || "TRY";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency: s, minimumFractionDigits: 2 }).format(t || 0);
  } catch {
    return `${(t || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ${s}`.trim();
  }
}
function Ze({ label: t, value: a, tone: s, note: r }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 p-4 rounded-[14px] border border-subtle bg-surface-base shadow-xs", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.07em] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: `font-mono text-[22px] font-bold tracking-[-.02em] ${s}`, style: { fontVariantNumeric: "tabular-nums" }, children: a }),
    r && /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
  ] });
}
function bs({ task: t }) {
  const a = (t == null ? void 0 : t.expenses) || [], s = (t == null ? void 0 : t.incomes) || [];
  if (a.length === 0 && s.length === 0)
    return /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
      /* @__PURE__ */ e.jsx(ct, { title: "Görev Finansı" }),
      /* @__PURE__ */ e.jsx(
        ze,
        {
          icon: "fa-coins",
          title: "Kayıt yok",
          description: "Bu göreve bağlı gider/gelir kaydı yok (veya finansal verileri görüntüleme yetkiniz bulunmuyor)."
        }
      )
    ] });
  const o = Array.from(new Set([...a, ...s].map((n) => n.currency || "TRY"))).map((n) => {
    const l = s.filter((d) => (d.currency || "TRY") === n).reduce((d, c) => d + (c.amount || 0), 0), m = a.filter((d) => (d.currency || "TRY") === n).reduce((d, c) => d + (c.amount || 0), 0);
    return { cur: n, inc: l, exp: m, net: l - m };
  }), i = [
    ...s.map((n) => ({ ...n, kind: "income" })),
    ...a.map((n) => ({ ...n, kind: "expense" }))
  ].sort((n, l) => new Date(l.date || 0) - new Date(n.date || 0));
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    o.map(({ cur: n, inc: l, exp: m, net: d }) => /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3", children: [
      /* @__PURE__ */ e.jsx(Ze, { label: `Toplam Gelir (${n})`, value: Ge(l, n), tone: "text-success", note: "göreve etiketli gelirler" }),
      /* @__PURE__ */ e.jsx(Ze, { label: `Toplam Gider (${n})`, value: Ge(m, n), tone: "text-warning", note: "göreve etiketli giderler" }),
      /* @__PURE__ */ e.jsx(
        Ze,
        {
          label: `Net Bakiye (${n})`,
          value: Ge(d, n),
          tone: d >= 0 ? "text-success" : "text-negative",
          note: d >= 0 ? "gelir gideri karşılıyor" : "gider gelirden fazla"
        }
      )
    ] }, n)),
    /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
      /* @__PURE__ */ e.jsx(ct, { title: "Finans kalemleri" }),
      i.map((n) => /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
          children: [
            /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-7 w-7 rounded-lg bg-neutral-subtle text-text-secondary", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${n.kind === "income" ? "fa-arrow-down" : "fa-arrow-up"} text-[11px]` }) }),
            /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] font-semibold text-text-primary", children: n.title || (n.kind === "income" ? "Gelir" : "Gider") }),
            /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: ca(n.date) }),
            n.kind === "income" ? /* @__PURE__ */ e.jsx(Ve, { bg: "bg-success-subtle", fg: "text-success", children: "Gelir" }) : /* @__PURE__ */ e.jsx(Ve, { bg: "bg-warning-subtle", fg: "text-warning", children: "Gider" }),
            /* @__PURE__ */ e.jsxs(
              "span",
              {
                className: `shrink-0 font-mono text-[12.5px] font-bold ${n.kind === "income" ? "text-success" : "text-text-primary"}`,
                style: { fontVariantNumeric: "tabular-nums" },
                children: [
                  n.kind === "income" ? "+" : "−",
                  Ge(n.amount, n.currency)
                ]
              }
            )
          ]
        },
        `${n.kind}-${n.id}`
      ))
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[11px] text-text-tertiary", children: "Kayıtlar Finans modülünden yönetilir; buraya göreve etiketlenmiş gider/gelirler yansır." })
  ] });
}
const hs = {
  0: "bg-neutral-400",
  1: "bg-text-tertiary",
  2: "bg-warning",
  3: "bg-primary",
  4: "bg-success"
};
function We(t) {
  if (!t) return null;
  const a = new Date(t);
  return Number.isNaN(a.getTime()) ? null : a;
}
const Ie = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(t) : "—";
function gs({ task: t = {} }) {
  const a = x.useMemo(() => [{ ...t, __main: !0 }, ...t.subTasks || []].map((n, l) => ({
    id: n.id || `row-${l}`,
    name: n.title || "Başlıksız görev",
    isMain: !!n.__main,
    start: We(n.startDate),
    end: We(n.dueDate) || We(n.completedDate),
    status: n.status ?? 1
  })), [t]), { min: s, span: r } = x.useMemo(() => {
    const i = a.flatMap((m) => [m.start, m.end]).filter(Boolean).map((m) => m.getTime());
    if (i.length === 0) return { min: null, span: 0 };
    const n = Math.min(...i), l = Math.max(...i);
    return { min: n, span: Math.max(1, l - n) };
  }, [a]), o = x.useMemo(() => s === null ? [] : [0, 1, 2, 3].map((i) => new Date(s + r * i / 4)), [s, r]);
  return s === null ? /* @__PURE__ */ e.jsx("div", { className: $e, children: /* @__PURE__ */ e.jsx(
    ze,
    {
      icon: "fa-bars-staggered",
      title: "Zaman çizelgesi çizilemiyor",
      description: "Görevde veya alt görevlerde başlangıç–bitiş tarihi tanımlı olmalı."
    }
  ) }) : /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs overflow-hidden", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[14px] font-bold text-text-primary", children: "Zaman çizelgesi" }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] text-text-tertiary", children: [
        Ie(new Date(s)),
        " – ",
        Ie(new Date(s + r))
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-4 gap-0 pl-[170px] mb-2 lt-860:pl-[110px]", children: o.map((i, n) => /* @__PURE__ */ e.jsx(
      "span",
      {
        className: "pl-2 border-l border-subtle text-[10.5px] font-bold uppercase tracking-[.06em] text-text-tertiary",
        children: Ie(i)
      },
      n
    )) }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1.5", children: a.map((i) => {
      const n = i.start ? i.start.getTime() : s, l = i.end ? Math.max(i.end.getTime(), n) : n, m = (n - s) / r * 100, d = Math.max(2, (l - n) / r * 100), c = Math.max(1, Math.round((l - n) / 864e5));
      return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-0 h-9", children: [
        /* @__PURE__ */ e.jsx(
          "span",
          {
            className: `w-[170px] lt-860:w-[110px] shrink-0 pr-3 truncate text-[12.5px] ${i.isMain ? "font-bold text-text-primary" : "font-semibold text-text-secondary"}`,
            title: i.name,
            children: i.name
          }
        ),
        /* @__PURE__ */ e.jsx("div", { className: "relative flex-1 h-full rounded-lg bg-neutral-subtle", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: `absolute top-[7px] bottom-[7px] flex items-center px-2.5 rounded-[7px] shadow-xs ${hs[i.status] || "bg-primary"}`,
            style: { left: `${m}%`, width: `${d}%` },
            title: `${Ie(i.start)} – ${Ie(i.end)}`,
            children: /* @__PURE__ */ e.jsxs("span", { className: "truncate text-[10.5px] font-bold text-white", children: [
              c,
              "g"
            ] })
          }
        ) })
      ] }, i.id);
    }) })
  ] });
}
function Et({ icon: t, iconTone: a, title: s, note: r, children: o }) {
  return /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-4 py-3.5 border-b border-subtle", children: [
      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t} text-[12px] ${a}` }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: s }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-tertiary", children: r })
    ] }),
    o
  ] });
}
function ys({ task: t = {} }) {
  const a = le(), s = t.predecessorIds || [], r = () => {
    var m, d, c;
    return (c = (d = (m = window == null ? void 0 : window.apya) == null ? void 0 : m.platform) == null ? void 0 : d.tasks) == null ? void 0 : c.task;
  }, { data: o = [], isLoading: i } = ie({
    queryKey: ["task-predecessors", t.id, s],
    queryFn: async () => {
      const m = r();
      return m ? Promise.all(
        s.map(
          (d) => Promise.resolve(m.get(d)).catch(() => ({ id: d, title: "(erişilemeyen görev)", status: null, code: "—" }))
        )
      ) : [];
    },
    enabled: s.length > 0,
    staleTime: 3e4,
    retry: !1
  }), n = async (m) => {
    var d, c, u, b, f, h;
    try {
      await Promise.resolve(r().update(t.id, {
        title: t.title,
        description: t.description ?? null,
        startDate: (t.startDate ?? "").slice(0, 10),
        dueDate: t.dueDate ? t.dueDate.slice(0, 10) : null,
        status: t.status,
        priority: t.priority,
        assigneeId: t.assigneeId ?? null,
        boardColumnId: t.boardColumnId ?? null,
        projectId: t.projectId ?? null,
        parentTaskId: t.parentTaskId ?? null,
        isPrivate: !!t.isPrivate,
        predecessorIds: s.filter((y) => y !== m),
        tagNames: (t.tags ?? []).map((y) => y.name),
        estimatedHours: t.estimatedHours ?? null,
        taskType: t.taskType ?? null,
        sprint: t.sprint ?? null
      })), await a.invalidateQueries({ queryKey: ["task-detail", t.id] }), (u = (c = (d = window == null ? void 0 : window.abp) == null ? void 0 : d.notify) == null ? void 0 : c.info) == null || u.call(c, "Bağlantı kaldırıldı.");
    } catch (y) {
      (h = (f = (b = window == null ? void 0 : window.abp) == null ? void 0 : b.notify) == null ? void 0 : f.error) == null || h.call(f, (y == null ? void 0 : y.message) || "Bağlantı kaldırılamadı.");
    }
  }, l = (m) => {
    var d, c, u;
    return (u = (c = (d = window == null ? void 0 : window.apya) == null ? void 0 : d.taskDetail) == null ? void 0 : c.open) == null ? void 0 : u.call(c, m);
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsx(
      Et,
      {
        icon: "fa-arrow-left-long",
        iconTone: "text-warning",
        title: "Öncül görevler",
        note: "bu görev başlamadan tamamlanmalı",
        children: s.length === 0 ? /* @__PURE__ */ e.jsx(ze, { icon: "fa-link", title: "Öncül bağımlılık yok", description: "Bu görevin tanımlı bir öncül bağımlılığı yok." }) : i ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : o.map((m) => {
          const d = m.status == null ? null : Be(m.status);
          return /* @__PURE__ */ e.jsxs(
            "div",
            {
              className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[10.5px] font-bold text-text-tertiary", children: m.code || "—" }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => l(m.id),
                    className: "flex-1 min-w-0 truncate text-left text-[12.5px] font-semibold text-text-primary hover:text-primary cursor-pointer",
                    children: m.title || "Başlıksız görev"
                  }
                ),
                d && /* @__PURE__ */ e.jsx(Ve, { bg: d.bg, fg: d.fg, children: d.label }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Bağlantıyı kaldır",
                    "aria-label": `${m.title} bağlantısını kaldır`,
                    onClick: () => n(m.id),
                    className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link-slash text-[10px]" })
                  }
                )
              ]
            },
            m.id
          );
        })
      }
    ),
    /* @__PURE__ */ e.jsx(
      Et,
      {
        icon: "fa-arrow-right-long",
        iconTone: "text-primary",
        title: "Ardıl görevler",
        note: "bu görev bitince başlar",
        children: /* @__PURE__ */ e.jsx(
          ze,
          {
            icon: "fa-diagram-project",
            title: "Ardıl görev listesi henüz yok",
            description: "Bu görevi öncül olarak gösteren görevleri bulmak ters yönlü bir sorgu gerektiriyor; karşılığı olan bir uç nokta henüz tanımlı değil."
          }
        )
      }
    )
  ] });
}
function Te() {
  var t, a, s;
  return ((s = (a = (t = window == null ? void 0 : window.apya) == null ? void 0 : t.platform) == null ? void 0 : a.tasks) == null ? void 0 : s.task) || null;
}
function vs(t) {
  const a = le(), s = ["task-timelogs", t], r = ["task-active-timelog"], o = ie({
    queryKey: s,
    queryFn: () => {
      var d;
      return Promise.resolve((d = Te()) == null ? void 0 : d.getTimeLogs(t));
    },
    enabled: !!t && !!Te(),
    staleTime: 15e3,
    retry: !1
  }), i = ie({
    queryKey: r,
    queryFn: () => {
      var d;
      return Promise.resolve((d = Te()) == null ? void 0 : d.getActiveTimeLog());
    },
    enabled: !!Te(),
    staleTime: 5e3,
    retry: !1
  }), n = () => {
    a.invalidateQueries({ queryKey: s }), a.invalidateQueries({ queryKey: r });
  }, l = xe({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = Te()) == null ? void 0 : d.startTimeTracking(t));
    },
    onSuccess: n
  }), m = xe({
    mutationFn: () => {
      var d;
      return Promise.resolve((d = Te()) == null ? void 0 : d.stopTimeTracking(t));
    },
    onSuccess: n
  });
  return {
    logs: o.data ?? [],
    isLoading: o.isLoading,
    activeLog: i.data ?? null,
    start: l.mutateAsync,
    stop: m.mutateAsync,
    isMutating: l.isPending || m.isPending
  };
}
function Pt(t) {
  return t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
}
function js({ taskId: t, task: a = {} }) {
  const s = vs(t), r = s.activeLog && s.activeLog.taskId === t ? s.activeLog : null, [o, i] = x.useState(() => Date.now());
  x.useEffect(() => {
    if (!r) return;
    const h = setInterval(() => i(Date.now()), 1e3);
    return () => clearInterval(h);
  }, [r]);
  const n = r ? Math.max(0, Math.floor((o - new Date(r.startTime).getTime()) / 1e3)) : 0, m = s.logs.reduce((h, y) => h + (y.secondsSpent || 0), 0) + n, d = (a == null ? void 0 : a.estimatedHours) ?? null, c = d ? d * 3600 : 0, u = c ? Math.min(100, Math.round(m / c * 100)) : 0, b = c ? Math.max(0, c - m) : 0, f = async () => {
    var h, y, v;
    try {
      r ? await s.stop() : await s.start();
    } catch (w) {
      (v = (y = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : y.error) == null || v.call(y, (w == null ? void 0 : w.message) || "Zaman takibi güncellenemedi.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-5 flex-wrap p-[22px] rounded-2xl border border-subtle bg-surface-base shadow-xs", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[18px]", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: f,
            disabled: s.isMutating,
            "aria-label": r ? "Sayacı durdur" : "Süre başlat",
            className: `flex shrink-0 items-center justify-center h-[58px] w-[58px] rounded-full text-white shadow-md cursor-pointer disabled:opacity-60 ${r ? "bg-negative" : "bg-success"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${s.isMutating ? "fa-circle-notch fa-spin" : r ? "fa-pause" : "fa-play"} text-[19px]` })
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px]", children: [
          /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "font-mono text-[32px] font-bold tracking-[-.03em] text-text-primary",
              style: { fontVariantNumeric: "tabular-nums" },
              children: ns(m)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-medium text-text-tertiary", children: r ? "Kayıt sürüyor" : "Sayaç duraklatıldı" })
        ] })
      ] }),
      c > 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5 min-w-[230px] flex-1 max-w-[340px]", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] font-bold text-text-secondary", children: "Tahmin kullanımı" }),
          /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
            Qe(m),
            " / ",
            d,
            "s"
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "h-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-warning", style: { width: `${u}%` } }) }),
        /* @__PURE__ */ e.jsxs("span", { className: "text-[11px] text-text-tertiary", children: [
          "Kalan tahmini süre: ",
          Qe(b)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: $e, children: [
      /* @__PURE__ */ e.jsx(ct, { title: "Zaman kayıtları" }),
      s.isLoading ? /* @__PURE__ */ e.jsx("p", { className: "m-0 px-4 py-5 text-[12.5px] text-text-tertiary", children: "Yükleniyor…" }) : s.logs.length === 0 ? /* @__PURE__ */ e.jsx(
        ze,
        {
          icon: "fa-stopwatch",
          title: "Henüz zaman kaydı yok",
          description: "Soldaki yeşil düğmeyle sayacı çalıştırın; durdurduğunuzda kayıt buraya düşer."
        }
      ) : s.logs.map((h) => {
        const y = !h.endTime;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "flex items-center gap-3.5 px-4 py-3 border-t border-subtle first:border-t-0 hover:bg-surface-raised",
            children: [
              /* @__PURE__ */ e.jsx(oa, { name: h.userName, size: 26 }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 truncate text-[12.5px] text-text-primary", children: h.note || h.userName || "Kullanıcı" }),
              /* @__PURE__ */ e.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-text-tertiary lt-860:hidden", children: [
                Pt(h.startTime),
                " → ",
                y ? "sürüyor" : Pt(h.endTime)
              ] }),
              /* @__PURE__ */ e.jsx("span", { className: "shrink-0 font-mono text-[12.5px] font-bold text-text-primary", children: y ? "Aktif" : Qe(h.secondsSpent || 0) })
            ]
          },
          h.id
        );
      })
    ] })
  ] });
}
const Me = [
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
    component: ls
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
    component: ds
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
    component: us
  },
  {
    code: "gantt",
    title: "Gantt",
    icon: "fa-bars-staggered",
    category: "gorev",
    isCore: !1,
    order: 11,
    permission: null,
    implemented: !0,
    component: gs
  },
  {
    code: "dependencies",
    title: "Bağımlılıklar",
    icon: "fa-link",
    category: "gorev",
    isCore: !1,
    order: 12,
    permission: null,
    implemented: !0,
    component: ys
  },
  {
    code: "finance",
    title: "Finans",
    icon: "fa-coins",
    category: "finans",
    isCore: !1,
    order: 13,
    permission: null,
    implemented: !0,
    component: bs
  },
  {
    code: "history",
    title: "Geçmiş",
    icon: "fa-clock-rotate-left",
    category: "gecmis",
    isCore: !1,
    order: 14,
    permission: null,
    implemented: !0,
    component: fs
  },
  {
    code: "activity",
    title: "Aktiviteler",
    icon: "fa-timeline",
    category: "gecmis",
    isCore: !1,
    order: 15,
    permission: null,
    implemented: !0,
    component: ms
  },
  {
    code: "comments",
    title: "Yorumlar",
    icon: "fa-comments",
    category: "iletisim",
    isCore: !1,
    order: 20,
    permission: null,
    implemented: !0,
    component: ps
  },
  {
    code: "risks",
    title: "Riskler",
    icon: "fa-triangle-exclamation",
    category: "gorev",
    isCore: !1,
    order: 21,
    permission: null,
    implemented: !0,
    component: null
  },
  {
    // component yok: onay akışı backend'i gelene kadar "yapım aşamasında" boş
    // durumu gösterilir (featureCatalogV3 UNBUILT_CODES).
    code: "approvals",
    title: "Onaylar",
    icon: "fa-stamp",
    category: "gorev",
    isCore: !1,
    order: 22,
    permission: null,
    implemented: !0,
    component: null
  },
  {
    code: "time-tracking",
    title: "Zaman Takibi",
    icon: "fa-stopwatch",
    category: "gorev",
    isCore: !1,
    order: 23,
    permission: null,
    implemented: !0,
    component: js
  },
  {
    code: "dashboard",
    title: "Gösterge Paneli",
    icon: "fa-chart-pie",
    category: "gorev",
    isCore: !1,
    order: 24,
    permission: null,
    implemented: !0,
    component: null
  },
  {
    code: "ai",
    title: "Yapay Zeka",
    icon: "fa-sparkles",
    category: "ileri",
    isCore: !1,
    order: 30,
    permission: null,
    // component yok: LLM entegrasyonu gelene kadar boş durum (UNBUILT_CODES).
    implemented: !0,
    component: null
  },
  {
    code: "custom-fields",
    title: "Özel Alanlar",
    icon: "fa-square-plus",
    category: "ileri",
    isCore: !1,
    order: 31,
    permission: null,
    implemented: !0,
    component: null
  },
  {
    code: "automations",
    title: "Otomasyonlar",
    icon: "fa-wand-magic-sparkles",
    category: "ileri",
    isCore: !1,
    order: 32,
    permission: null,
    // component yok: kural motoru gelene kadar boş durum (UNBUILT_CODES).
    implemented: !0,
    component: null
  },
  {
    code: "emails",
    title: "E-postalar",
    icon: "fa-envelope",
    category: "iletisim",
    isCore: !1,
    order: 33,
    permission: null,
    implemented: !0,
    component: null
  },
  {
    code: "gallery",
    title: "Dosya Galerisi",
    icon: "fa-image",
    category: "finans",
    isCore: !1,
    order: 34,
    permission: null,
    implemented: !0,
    component: null
  }
];
function ua(t = []) {
  const a = new Set(t);
  return Me.filter((s) => s.implemented && (s.isCore || a.has(s.code))).sort((s, r) => s.order - r.order);
}
function ws(t = []) {
  const a = new Set(t);
  return Me.filter((s) => !s.isCore).filter((s) => !s.permission || Jt(s.permission)).map((s) => ({ ...s, isAssigned: a.has(s.code) })).sort((s, r) => s.order - r.order);
}
let Oe = null;
const _e = /* @__PURE__ */ new Set(), Je = /* @__PURE__ */ new Set();
function It() {
  _e.forEach((t) => t());
}
function Ns(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const se = {
  open(t) {
    const a = Ns(t);
    a && (Oe = a, It());
  },
  close() {
    Oe = null, It();
  },
  subscribe(t) {
    return _e.add(t), () => _e.delete(t);
  },
  getSnapshot() {
    return Oe;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && Je.add(t);
  },
  emitResult() {
    Je.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    Oe = null, _e.clear(), Je.clear();
  }
}, At = "apya.taskDetail.fullscreen";
function pa({ taskId: t, presentation: a = "modal", onClose: s }) {
  const [r, o] = x.useState(t), [i, n] = x.useState([]), { data: l, isLoading: m, isError: d, refetch: c } = dt(r), u = Xt(), b = sa(l), f = ra(), h = na(r), [y, v] = x.useState("general"), [w, D] = x.useState(!1), P = Le.useRef(null), z = x.useMemo(
    () => ua(h.assignedCodes),
    [h.assignedCodes]
  ), M = x.useMemo(
    () => ws(h.assignedCodes),
    [h.assignedCodes]
  ), F = z.find((E) => E.code === y) ?? z[0];
  Le.useEffect(() => {
    F.code !== y && v(F.code);
  }, [F, y]);
  const Y = F == null ? void 0 : F.component, B = le(), [G, V] = x.useState(
    () => {
      var E;
      return ((E = window.localStorage) == null ? void 0 : E.getItem(At)) === "1";
    }
  ), [_, O] = x.useState(!1), Z = x.useCallback(() => {
    ta(), s == null || s();
  }, [s]);
  aa(t, Z), Le.useEffect(() => {
    b.isDirty ? u.markDirty() : u.markClean();
  });
  const W = x.useCallback(() => u.requestClose(Z), [u, Z]), X = x.useCallback(() => {
    V((E) => {
      var R;
      const A = !E;
      return (R = window.localStorage) == null || R.setItem(At, A ? "1" : "0"), A;
    });
  }, []), ee = Jt("Platform.Tasks.Delete"), [q, g] = x.useState(!1), [p, C] = x.useState(!1), k = x.useCallback(async () => {
    var E, A, R, te, J, je;
    C(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (R = (A = (E = window == null ? void 0 : window.abp) == null ? void 0 : E.notify) == null ? void 0 : A.info) == null || R.call(A, "Başarıyla silindi."), g(!1), u.markClean(), Z();
    } catch (de) {
      (je = (J = (te = window == null ? void 0 : window.abp) == null ? void 0 : te.notify) == null ? void 0 : J.error) == null || je.call(J, (de == null ? void 0 : de.message) || "Görev silinemedi.");
    } finally {
      C(!1);
    }
  }, [r, u, Z]), S = x.useCallback(async () => {
    var E, A, R, te, J, je;
    if (!b.validate()) return !1;
    O(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, b.toUpdateDto())
      ), await B.invalidateQueries({ queryKey: ["task-detail", r] }), se.emitResult(), (R = (A = (E = window == null ? void 0 : window.abp) == null ? void 0 : E.notify) == null ? void 0 : A.success) == null || R.call(A, "Kaydedildi."), !0;
    } catch (de) {
      return (je = (J = (te = window == null ? void 0 : window.abp) == null ? void 0 : te.notify) == null ? void 0 : J.error) == null || je.call(J, (de == null ? void 0 : de.message) || "Kaydedilemedi."), !1;
    } finally {
      O(!1);
    }
  }, [r, b, u, B]), H = x.useCallback(() => {
    S();
  }, [S]), oe = x.useCallback(async () => {
    const E = u.resolvePendingClose("save");
    await S() && (E == null || E());
  }, [u, S]), j = x.useCallback((E, A) => {
    u.requestClose(() => {
      n((R) => [...R, { id: r, title: (l == null ? void 0 : l.title) ?? "" }]), o(E), v("general"), u.markClean();
    });
  }, [u, r, l]), I = x.useCallback((E) => {
    u.requestClose(() => {
      n((A) => {
        const R = A.findIndex((te) => te.id === E);
        return R === -1 ? A : A.slice(0, R);
      }), o(E), v("general"), u.markClean();
    });
  }, [u]), $ = x.useCallback(async (E) => {
    var A, R, te;
    try {
      await h.addFeature(E), v(E), D(!1);
    } catch (J) {
      (te = (R = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : R.error) == null || te.call(R, (J == null ? void 0 : J.message) || "Özellik eklenemedi.");
    }
  }, [h]), K = x.useCallback(async (E) => {
    var A, R, te;
    try {
      await h.removeFeature(E), v((J) => J === E ? "general" : J);
    } catch (J) {
      (te = (R = (A = window == null ? void 0 : window.abp) == null ? void 0 : A.notify) == null ? void 0 : R.error) == null || te.call(R, (J == null ? void 0 : J.message) || "Özellik kaldırılamadı.");
    }
  }, [h]);
  Le.useEffect(() => {
    if (!w) return;
    const E = (R) => {
      P.current && !P.current.contains(R.target) && D(!1);
    }, A = (R) => {
      R.key === "Escape" && D(!1);
    };
    return document.addEventListener("mousedown", E), document.addEventListener("keydown", A), () => {
      document.removeEventListener("mousedown", E), document.removeEventListener("keydown", A);
    };
  }, [w]);
  const U = m ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(fe, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(fe, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(fe, { className: "h-24 w-full" })
  ] }) : d ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => c(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      Va,
      {
        trail: i,
        current: { id: r, title: (l == null ? void 0 : l.title) ?? "" },
        onNavigate: I
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: P, children: [
      /* @__PURE__ */ e.jsx(
        _a,
        {
          tabs: z,
          activeCode: F.code,
          onSelect: (E) => {
            v(E), D(!1);
          },
          onOpenPicker: () => D((E) => !E),
          pickerOpen: w
        }
      ),
      w && /* @__PURE__ */ e.jsx(
        Ha,
        {
          entries: M,
          busyCode: h.isMutating ? h.mutatingCode : null,
          onAdd: $,
          onRemove: K
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${F.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          F.code === "general" ? /* @__PURE__ */ e.jsx(
            Ga,
            {
              values: b.values,
              errors: b.errors,
              onFieldChange: b.setField,
              assigneeOptions: f.options,
              isLoadingAssignees: f.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(x.Suspense, { fallback: /* @__PURE__ */ e.jsx(fe, { className: "h-24 w-full" }), children: Y && /* @__PURE__ */ e.jsx(
            Y,
            {
              taskId: r,
              task: l,
              onOpenSubtask: j
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            Oa,
            {
              task: l,
              creatorName: f.nameById.get(l.creatorId),
              lastModifierName: f.nameById.get(l.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), re = a === "page" ? La : Aa;
  return /* @__PURE__ */ e.jsxs(
    re,
    {
      open: !0,
      fullscreen: G,
      onRequestClose: W,
      title: l ? `Görev Detayı: ${l.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        Ba,
        {
          task: l ?? { title: "Yükleniyor…" },
          canDelete: ee,
          fullscreen: G,
          onToggleFullscreen: X,
          onClose: W,
          onDelete: () => g(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        Ra,
        {
          lastSavedAt: l == null ? void 0 : l.lastModificationTime,
          isDirty: u.isDirty,
          isSaving: _,
          onCancel: W,
          onSave: H
        }
      ),
      children: [
        U,
        u.pendingClose && /* @__PURE__ */ e.jsx(
          Cs,
          {
            isSaving: _,
            onStay: () => u.resolvePendingClose("stay"),
            onDiscard: () => u.resolvePendingClose("discard"),
            onSaveAndClose: oe
          }
        ),
        q && /* @__PURE__ */ e.jsx(
          ks,
          {
            taskTitle: (l == null ? void 0 : l.title) ?? "",
            busy: p,
            onCancel: () => g(!1),
            onConfirm: k
          }
        )
      ]
    }
  );
}
function ks({ taskTitle: t, busy: a, onCancel: s, onConfirm: r }) {
  const [o, i] = x.useState(""), n = o.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    ma,
    {
      label: "Görev silinecek",
      title: "Görev silinecek",
      description: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("strong", { className: "text-text-primary", children: t }),
        " kalıcı olarak silinecek. Onaylamak için aşağıya ",
        /* @__PURE__ */ e.jsx("strong", { children: "SİL" }),
        " yazın."
      ] }),
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(ae, { variant: "secondary", onClick: s, disabled: a, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          ae,
          {
            variant: "destructive",
            onClick: r,
            disabled: !n,
            isLoading: a,
            loadingText: "Siliniyor…",
            children: "Evet, sil"
          }
        )
      ] }),
      children: [
        /* @__PURE__ */ e.jsx("label", { htmlFor: "delete-confirm", className: "sr-only", children: "Onay metni" }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            id: "delete-confirm",
            value: o,
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
function ma({ label: t, title: a, description: s, children: r, actions: o }) {
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      role: "alertdialog",
      "aria-modal": "true",
      "aria-label": t,
      className: "absolute inset-0 z-popover grid place-items-center bg-surface-overlay p-4",
      children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-xl border border-default bg-surface-elevated p-[var(--apya-space-5)] shadow-xl", children: [
        /* @__PURE__ */ e.jsx("h3", { className: "text-base font-semibold text-text-primary", children: a }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-sm text-text-secondary", children: s }),
        r,
        /* @__PURE__ */ e.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: o })
      ] })
    }
  );
}
function Cs({ isSaving: t, onStay: a, onDiscard: s, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    ma,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(ae, { variant: "secondary", onClick: a, disabled: t, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ e.jsx(ae, { variant: "destructive", onClick: s, disabled: t, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ e.jsx(ae, { variant: "primary", onClick: r, isLoading: t, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
function ve(t) {
  return (t == null ? void 0 : t.closest('[role="dialog"]')) ?? void 0;
}
const Ts = [
  { value: !1, icon: "fa-globe", title: "Herkese açık", desc: "Görevi, erişimi olan tüm ekip üyeleri görebilir." },
  { value: !0, icon: "fa-lock", title: "Özel görev", desc: "Görev gizli işaretlenir; yalnızca yetkili kullanıcılar erişir." }
];
function Ds({ isPrivate: t = !1, onChange: a = () => {
} }) {
  const s = !!t, [r, o] = x.useState(null);
  return /* @__PURE__ */ e.jsxs(be, { modal: !0, children: [
    /* @__PURE__ */ e.jsx(he, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
      "button",
      {
        ref: o,
        type: "button",
        className: "flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm",
        children: [
          /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${s ? "fa-lock" : "fa-globe"} text-[11px] text-text-tertiary` }),
          /* @__PURE__ */ e.jsx("span", { children: s ? "Özel görev" : "Herkese açık" }),
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
        ]
      }
    ) }),
    /* @__PURE__ */ e.jsx(ge, { container: ve(r), children: /* @__PURE__ */ e.jsxs(
      ye,
      {
        sideOffset: 8,
        align: "end",
        className: "z-50 w-[360px] rounded-2xl border border-subtle bg-surface-base p-4 shadow-float animate-in fade-in-50 zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 border-b border-subtle pb-3 mb-3", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shield-halved text-primary text-base" }),
            /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary", children: "Görünürlük" })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-2", children: Ts.map((i) => {
            const n = s === i.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => a(i.value),
                className: `flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${n ? "border-primary bg-primary-subtle/40" : "border-subtle hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${i.icon} text-base mt-0.5 ${n ? "text-primary" : "text-text-tertiary"}` }),
                  /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-semibold text-text-primary", children: i.title }),
                      n && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-xs text-primary" })
                    ] }),
                    /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5", children: i.desc })
                  ] })
                ]
              },
              String(i.value)
            );
          }) }),
          /* @__PURE__ */ e.jsx("p", { className: "text-[11px] text-text-tertiary mt-3", children: "Değişiklik “Kaydet” ile uygulanır." }),
          /* @__PURE__ */ e.jsx(Da, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
const Xe = "z-popover rounded-[13px] border border-default bg-surface-elevated p-1.5 shadow-float animate-fade-in-fast", Ss = "flex items-center gap-[11px] w-full px-[9px] py-2 rounded-[9px] text-[12.5px] font-medium text-left cursor-pointer hover:bg-surface-hover", $s = [
  { what: "Kaydet", key: "Ctrl S" },
  { what: "Yorum gönder", key: "Ctrl ↵" },
  { what: "Kapat / iptal", key: "Esc" },
  { what: "Bağlantı kopyala", key: "⌘ L" }
];
function Lt({ children: t }) {
  return /* @__PURE__ */ e.jsx(Wt, { asChild: !0, children: t });
}
function Es({ children: t }) {
  return /* @__PURE__ */ e.jsx("kbd", { className: "inline-flex items-center h-[19px] px-1.5 rounded-[5px] border border-default border-b-2 bg-neutral-subtle font-mono text-[10px] font-semibold text-text-secondary", children: t });
}
function Ps({
  task: t = {},
  presentation: a = "modal",
  onClose: s,
  isFullscreen: r,
  onToggleFullscreen: o,
  onFieldChange: i = () => {
  },
  statusValue: n,
  priorityValue: l,
  titleValue: m,
  isPrivateValue: d,
  isFavorite: c,
  onToggleFavorite: u,
  isWatched: b,
  onToggleWatch: f,
  onDuplicate: h,
  onArchive: y,
  onDelete: v,
  onOpenTransfer: w,
  onSaveAsTemplate: D,
  onConvertToSubtask: P,
  onExportPdf: z
}) {
  const [M, F] = x.useState(!1), [Y, B] = x.useState(null), [G, V] = x.useState(!1), _ = x.useRef(null), O = Be(n ?? t.status), Z = la(l ?? t.priority), W = t.code || "GRV-—", X = () => {
    var p;
    (p = navigator.clipboard) == null || p.writeText(W), F(!0), setTimeout(() => F(!1), 1800);
  }, ee = () => {
    var p, C, k, S;
    (p = navigator.clipboard) == null || p.writeText(`${window.location.origin}/Tasks?task=${t.id || ""}`), (S = (k = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : k.success) == null || S.call(k, "Görev bağlantısı panoya kopyalandı.");
  }, q = (p) => () => {
    V(!1), p == null || p();
  }, g = [
    { label: "Bağlantıyı kopyala", icon: "fa-link", kbd: "⌘L", onClick: q(ee) },
    { label: "Çoğalt", icon: "fa-copy", kbd: "⌘D", onClick: q(h) },
    { label: "Başka projeye kopyala", icon: "fa-clone", onClick: q(() => w == null ? void 0 : w("copy")) },
    { label: "Şablon olarak kaydet", icon: "fa-bookmark", onClick: q(D) },
    { label: "Taşı (başka proje)", icon: "fa-right-left", separator: !0, onClick: q(() => w == null ? void 0 : w("move")) },
    { label: "Alt göreve dönüştür", icon: "fa-diagram-project", onClick: q(P) },
    { label: b ? "Takibi bırak" : "Takip et", icon: "fa-eye", onClick: q(f) },
    { label: "Arşivle", icon: "fa-box-archive", separator: !0, onClick: q(y) },
    { label: "Yazdır", icon: "fa-print", kbd: "⌘P", onClick: q(() => window.print()) },
    { label: "PDF olarak dışa aktar", icon: "fa-file-pdf", onClick: q(z) },
    { label: "Sil", icon: "fa-trash-can", kbd: "⌫", separator: !0, danger: !0, onClick: q(v) }
  ];
  return /* @__PURE__ */ e.jsx("header", { ref: B, className: "px-6 pt-[18px] pb-4 border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px] min-w-0 flex-1", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: X,
            title: "Kodu kopyala",
            className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[11px] font-bold tracking-[.04em] cursor-pointer",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-hashtag text-[9px] opacity-70" }),
              /* @__PURE__ */ e.jsx("span", { children: W }),
              /* @__PURE__ */ e.jsx("i", { className: `${M ? "fa-solid fa-check" : "fa-regular fa-copy"} text-[9px] opacity-60` })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs(be, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(he, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold cursor-pointer ${O.bg} ${O.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-current animate-pulse" }),
                /* @__PURE__ */ e.jsx("span", { children: O.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ge, { container: ve(Y), children: /* @__PURE__ */ e.jsxs(ye, { sideOffset: 6, align: "start", className: `${Xe} w-[196px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
            ia.map((p) => {
              const C = He[p], k = (n ?? t.status) === p;
              return /* @__PURE__ */ e.jsx(Lt, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => i("status", p),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${k ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${C.dot}` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: C.label }),
                    k && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, p);
            })
          ] }) })
        ] }),
        /* @__PURE__ */ e.jsxs(be, { modal: !0, children: [
          /* @__PURE__ */ e.jsx(he, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] border border-default text-[12px] font-semibold cursor-pointer ${Z.bg} ${Z.fg}`,
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${Z.icon} text-[10px]` }),
                /* @__PURE__ */ e.jsx("span", { children: Z.label }),
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ge, { container: ve(Y), children: /* @__PURE__ */ e.jsxs(ye, { sideOffset: 6, align: "start", className: `${Xe} w-[184px]`, children: [
            /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Öncelik seç" }),
            ts.map((p) => {
              const C = ot[p], k = (l ?? t.priority) === p;
              return /* @__PURE__ */ e.jsx(Lt, { children: /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => i("priority", p),
                  className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${k ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${C.icon} text-[11px] w-[13px]` }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: C.label }),
                    k && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
                  ]
                }
              ) }, p);
            })
          ] }) })
        ] }),
        b && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 h-[26px] px-2.5 rounded-[7px] border border-subtle bg-neutral-subtle text-text-secondary text-[11.5px] font-semibold", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-eye text-[10px]" }),
          "Takip ediliyor"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
        /* @__PURE__ */ e.jsx(
          "div",
          {
            ref: _,
            contentEditable: !0,
            suppressContentEditableWarning: !0,
            spellCheck: !1,
            onBlur: (p) => i("title", p.currentTarget.textContent.trim()),
            className: "text-[24px] lt-560:text-[20px] font-extrabold tracking-[-.025em] leading-[1.2] text-text-primary px-2 -ml-2 py-[3px] rounded-[9px] border border-transparent cursor-text min-w-[60px] hover:bg-neutral-subtle hover:border-subtle focus:bg-neutral-subtle focus:border-focus focus:shadow-focus focus:outline-none",
            children: m ?? t.title ?? "Başlıksız görev"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: u,
            title: c ? "Favorilerden çıkar" : "Favorilere ekle",
            className: `flex items-center justify-center h-8 w-8 shrink-0 rounded-[9px] cursor-pointer ${c ? "bg-warning-subtle text-warning" : "text-text-tertiary hover:bg-surface-hover"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: `fa-${c ? "solid" : "regular"} fa-star text-[15px]` })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
      /* @__PURE__ */ e.jsx("div", { className: "lt-860:hidden", children: /* @__PURE__ */ e.jsx(
        Ds,
        {
          isPrivate: d ?? !!t.isPrivate,
          onChange: (p) => i("isPrivate", p)
        }
      ) }),
      /* @__PURE__ */ e.jsx("div", { className: "h-5 w-px bg-border-default mx-1" }),
      a === "modal" && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: o,
          title: r ? "Küçült" : "Tam ekran",
          className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${r ? "bg-primary-subtle text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r ? "fa-compress" : "fa-expand"} text-[12px]` })
        }
      ),
      /* @__PURE__ */ e.jsxs(be, { modal: !0, open: G, onOpenChange: V, children: [
        /* @__PURE__ */ e.jsx(he, { asChild: !0, children: /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            title: "Diğer seçenekler",
            className: `flex items-center justify-center h-8 w-8 rounded-[9px] cursor-pointer ${G ? "bg-surface-hover text-text-primary" : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis text-sm" })
          }
        ) }),
        /* @__PURE__ */ e.jsx(ge, { container: ve(Y), children: /* @__PURE__ */ e.jsxs(ye, { sideOffset: 6, align: "end", className: `${Xe} w-[244px]`, children: [
          g.map((p) => /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: p.onClick,
              className: [
                Ss,
                p.danger ? "text-negative" : "text-text-secondary",
                p.separator ? "border-t border-subtle mt-[5px]" : ""
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${p.icon} text-[11px] w-[14px] opacity-75` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: p.label }),
                p.kbd && /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: p.kbd })
              ]
            },
            p.label
          )),
          /* @__PURE__ */ e.jsxs("div", { className: "mt-1.5 pt-[9px] px-[9px] pb-[7px] border-t border-subtle", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 mb-[7px]", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-keyboard text-[11px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-extrabold uppercase tracking-[.09em] text-text-tertiary", children: "Kısayollar" })
            ] }),
            $s.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5 py-1", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] text-text-secondary", children: p.what }),
              /* @__PURE__ */ e.jsx(Es, { children: p.key })
            ] }, p.what))
          ] })
        ] }) })
      ] }),
      a === "modal" && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: s,
          title: "Kapat (Esc)",
          className: "flex items-center justify-center h-8 w-8 ml-0.5 rounded-[9px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-sm" })
        }
      )
    ] })
  ] }) });
}
const et = "z-popover rounded-[14px] border border-default bg-surface-elevated p-2 shadow-float animate-fade-in-fast", zt = "w-full h-[34px] pl-[31px] pr-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none";
function ke({ children: t }) {
  return /* @__PURE__ */ e.jsx(Wt, { asChild: !0, children: t });
}
function me({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[7px] min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-bold uppercase tracking-[.08em] text-text-tertiary select-none", children: t }),
    a
  ] });
}
function Bt({ name: t, size: a = 26 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-white font-bold",
      style: { height: a, width: a, background: Re(t), fontSize: a * 0.38 },
      children: Ke(t)
    }
  );
}
function Kt(t) {
  if (t == null) return "—";
  const a = Math.max(0, Math.round(Number(t) * 60)), s = Math.floor(a / 60), r = a % 60;
  return s ? r ? `${s}s ${r}dk` : `${s}s` : `${r}dk`;
}
function Is({
  task: t = {},
  assigneeOptions: a = [],
  projectOptions: s = [],
  onFieldChange: r = () => {
  },
  statusValue: o,
  assigneeValue: i,
  projectValue: n,
  dueDateValue: l,
  startDateValue: m,
  tagsValue: d = [],
  progressPercent: c = 0,
  progressNote: u = "",
  onOpenTransfer: b
}) {
  var ee, q;
  const [f, h] = x.useState(""), [y, v] = x.useState(""), [w, D] = x.useState(""), [P, z] = x.useState(!1), [M, F] = x.useState(null), Y = Be(o ?? t.status), B = i ?? t.assigneeId ?? null, G = n ?? t.projectId ?? null, V = ((ee = a.find((g) => g.value === B)) == null ? void 0 : ee.label) || t.assigneeName || "Atanmamış", _ = ((q = s.find((g) => g.value === G)) == null ? void 0 : q.label) || t.projectName || "Projesiz", O = as(l ?? t.dueDate), Z = a.filter(
    (g) => !f || g.label.toLowerCase().includes(f.toLowerCase())
  ), W = s.filter(
    (g) => !y || g.label.toLowerCase().includes(y.toLowerCase())
  ), X = () => {
    const g = w.trim();
    g && !d.includes(g) && r("tagNames", [...d, g]), D(""), z(!1);
  };
  return /* @__PURE__ */ e.jsx("div", { ref: F, className: "px-6 lt-860:px-4 py-[18px] border-b border-subtle bg-surface-base", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-4 lt-860:grid-cols-2 lt-560:grid-cols-1 gap-y-5 gap-x-6", children: [
    /* @__PURE__ */ e.jsx(me, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(be, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(he, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx(Bt, { name: B ? V : null }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: V }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ge, { container: ve(M), children: /* @__PURE__ */ e.jsxs(ye, { sideOffset: 6, align: "start", className: `${et} w-[264px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: f,
              onChange: (g) => h(g.target.value),
              placeholder: "Kişi ara…",
              className: zt
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[230px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(ke, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("assigneeId", null),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] text-left cursor-pointer ${B ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary font-semibold"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex h-6 w-6 items-center justify-center rounded-full bg-neutral-subtle text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-user-slash text-[9px]" }) }),
                /* @__PURE__ */ e.jsx("span", { children: "Atanmamış" })
              ]
            }
          ) }),
          a.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "px-2 py-1.5 text-[12px] text-text-tertiary", children: "Kullanıcı listesi yükleniyor…" }),
          Z.map((g) => /* @__PURE__ */ e.jsx(ke, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("assigneeId", g.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-left cursor-pointer ${B === g.value ? "bg-primary-subtle" : "hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx(Bt, { name: g.label, size: 24 }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 text-[12.5px] font-semibold text-text-primary truncate", children: g.label }),
                B === g.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, g.value))
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ e.jsxs(me, { label: "Son tarih", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
        /* @__PURE__ */ e.jsx("i", { className: `fa-regular fa-calendar text-[13px] ${O.tone}` }),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "date",
            value: (l ?? t.dueDate ?? "").slice(0, 10),
            onChange: (g) => r("dueDate", g.target.value),
            className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
          }
        )
      ] }),
      O.hint && /* @__PURE__ */ e.jsx("span", { className: `-mt-0.5 text-[10.5px] font-semibold ${O.tone}`, children: O.hint })
    ] }),
    /* @__PURE__ */ e.jsx(me, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-[9px] px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[13px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: (m ?? t.startDate ?? "").slice(0, 10),
          onChange: (g) => r("startDate", g.target.value),
          className: "bg-transparent border-0 p-0 text-text-primary text-[13px] font-semibold cursor-pointer focus:outline-none"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(me, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 pt-[5px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline justify-between", children: [
        /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: [
          "%",
          c
        ] }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-medium text-text-tertiary", children: u })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "h-1.5 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
          style: { width: `${c}%` }
        }
      ) })
    ] }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center h-8", children: /* @__PURE__ */ e.jsxs(be, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(he, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: `flex items-center gap-[7px] h-[26px] px-2.5 rounded-[7px] text-[12.5px] font-bold cursor-pointer ${Y.bg} ${Y.fg}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${Y.icon} text-[11px]` }),
            /* @__PURE__ */ e.jsx("span", { children: Y.label }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] opacity-60" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ge, { container: ve(M), children: /* @__PURE__ */ e.jsxs(ye, { sideOffset: 6, align: "start", className: `${et} w-[196px]`, children: [
        /* @__PURE__ */ e.jsx("div", { className: "px-[9px] pt-[5px] pb-[7px] text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: "Durumu değiştir" }),
        ia.map((g) => {
          const p = He[g], C = (o ?? t.status) === g;
          return /* @__PURE__ */ e.jsx(ke, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("status", g),
              className: `flex items-center gap-[9px] w-full px-[9px] py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${C ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `h-2 w-2 rounded-full ${p.dot}` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: p.label }),
                C && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px]" })
              ]
            }
          ) }, g);
        })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap min-h-8", children: [
      d.map((g) => /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "inline-flex items-center gap-1.5 h-6 px-2 rounded-[7px] border border-primary bg-primary-subtle text-primary text-[11.5px] font-bold",
          children: [
            /* @__PURE__ */ e.jsx("span", { children: g }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Etiketi kaldır",
                onClick: () => r("tagNames", d.filter((p) => p !== g)),
                className: "flex items-center p-0 border-0 bg-transparent text-current opacity-55 hover:opacity-100 hover:text-negative cursor-pointer",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
              }
            )
          ]
        },
        g
      )),
      P ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: w,
          onChange: (g) => D(g.target.value),
          onBlur: X,
          onKeyDown: (g) => {
            g.key === "Enter" && X(), g.key === "Escape" && (D(""), z(!1));
          },
          placeholder: "Etiket…",
          className: "h-6 w-24 px-2 rounded-[7px] border border-focus bg-surface-base text-text-primary text-[11.5px] shadow-focus focus:outline-none"
        }
      ) : /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          "aria-label": "Yeni etiket ekle",
          onClick: () => z(!0),
          className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-dashed border-strong bg-transparent text-text-tertiary text-[11.5px] font-semibold hover:border-focus hover:text-primary hover:bg-primary-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" }),
            "Etiket"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Proje", children: /* @__PURE__ */ e.jsxs(be, { modal: !0, children: [
      /* @__PURE__ */ e.jsx(he, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-[9px] max-w-full px-[9px] -ml-[9px] py-[5px] rounded-[9px] border border-transparent hover:bg-neutral-subtle hover:border-subtle cursor-pointer",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-[13px] text-text-tertiary" }),
            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary truncate", children: _ }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[8px] text-text-tertiary" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ge, { container: ve(M), children: /* @__PURE__ */ e.jsxs(ye, { sideOffset: 6, align: "start", className: `${et} w-[250px]`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "relative mb-[7px]", children: [
          /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[11px] top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
          /* @__PURE__ */ e.jsx(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: y,
              onChange: (g) => v(g.target.value),
              placeholder: "Proje ara…",
              className: zt
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 max-h-[210px] overflow-y-auto custom-scrollbar", children: [
          /* @__PURE__ */ e.jsx(ke, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", null),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${G ? "text-text-primary hover:bg-surface-hover" : "bg-primary-subtle text-primary"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-neutral-400" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Projesiz" })
              ]
            }
          ) }),
          W.map((g) => /* @__PURE__ */ e.jsx(ke, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => r("projectId", g.value),
              className: `flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left cursor-pointer ${G === g.value ? "bg-primary-subtle text-primary" : "text-text-primary hover:bg-surface-hover"}`,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "h-[9px] w-[9px] shrink-0 rounded-[3px] bg-primary" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: g.label }),
                G === g.value && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[10px] text-primary" })
              ]
            }
          ) }, g.value))
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-[7px] pt-[7px] border-t border-subtle", children: [
          /* @__PURE__ */ e.jsx(ke, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => b == null ? void 0 : b("move"),
              className: "flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left text-text-secondary hover:bg-surface-hover hover:text-primary cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[11px] w-[14px] opacity-70" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Başka projeye taşı…" })
              ]
            }
          ) }),
          /* @__PURE__ */ e.jsx(ke, { children: /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: () => b == null ? void 0 : b("copy"),
              className: "flex items-center gap-2.5 w-full px-2 py-[7px] rounded-[9px] text-[12.5px] font-semibold text-left text-text-secondary hover:bg-surface-hover hover:text-primary cursor-pointer",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clone text-[11px] w-[14px] opacity-70" }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1", children: "Başka projeye kopyala…" })
              ]
            }
          ) })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ e.jsx(me, { label: "Harcanan / tahmin", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[9px] h-8", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[13px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[13px] font-bold text-text-primary", children: Kt(t.spentHours ?? 0) }),
      /* @__PURE__ */ e.jsxs("span", { className: "text-[12px] text-text-tertiary", children: [
        "/ ",
        t.estimatedHours != null ? Kt(t.estimatedHours) : "—"
      ] })
    ] }) })
  ] }) });
}
function As({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: o,
  onDragEnd: i,
  onReorderTo: n,
  onReorderDrop: l,
  onOpenPicker: m,
  counts: d = {},
  isDirty: c = !1
}) {
  const [u, b] = x.useState(!1);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 px-6 border-b border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 py-2.5 flex-1 min-w-0 overflow-x-auto custom-scrollbar", children: [
      s.map((f) => {
        const h = t === f.code, y = d[f.code] || 0;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            draggable: !0,
            title: "Sürükleyerek sırayı değiştirin",
            onClick: () => a(f.code),
            onDragStart: (v) => {
              o(f.code);
              try {
                v.dataTransfer.effectAllowed = "move", v.dataTransfer.setData("text/plain", f.code);
              } catch {
              }
            },
            onDragOver: (v) => {
              v.preventDefault(), n(f.code);
            },
            onDrop: (v) => {
              v.preventDefault(), l == null || l();
            },
            onDragEnd: i,
            className: [
              "flex shrink-0 items-center gap-2 h-[34px] px-[13px] rounded-[10px]",
              "text-[12.5px] whitespace-nowrap cursor-grab active:cursor-grabbing",
              "transition-opacity duration-fast",
              h ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
              r === f.code ? "opacity-35" : "opacity-100"
            ].join(" "),
            children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${f.icon} text-[11px] opacity-85` }),
              /* @__PURE__ */ e.jsx("span", { children: f.title }),
              y > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                "rounded-full text-[10px] font-extrabold",
                h ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
              ].join(" "), children: y })
            ]
          },
          f.code
        );
      }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          title: "Özellik ekle",
          onClick: () => {
            b(!1), m();
          },
          onMouseEnter: () => b(!0),
          onMouseLeave: () => b(!1),
          className: [
            "flex shrink-0 items-center gap-[7px] h-[34px] ml-1 rounded-[10px]",
            "border border-dashed border-primary bg-primary-subtle text-primary",
            "text-[12.5px] font-bold whitespace-nowrap cursor-pointer",
            "hover:border-solid",
            "transition-[padding] duration-[160ms] ease-[cubic-bezier(.16,1,.3,1)]",
            u ? "px-[13px]" : "px-[11px]"
          ].join(" "),
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
            u && /* @__PURE__ */ e.jsx("span", { className: "animate-fade-in-fast", children: "Özellik ekle" })
          ]
        }
      )
    ] }),
    c && /* @__PURE__ */ e.jsxs("span", { className: "flex shrink-0 items-center gap-[7px] h-[26px] px-2.5 rounded-full bg-warning-subtle text-warning text-[11px] font-bold", children: [
      /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-warning animate-pulse" }),
      "Taslak"
    ] })
  ] });
}
function Ls({
  activeTab: t,
  onTabChange: a,
  orderedTabs: s = [],
  draggingCode: r,
  onDragStart: o,
  onDragEnd: i,
  onReorderTo: n,
  onReorderDrop: l,
  onOpenPicker: m,
  counts: d = {}
}) {
  return /* @__PURE__ */ e.jsxs(
    "nav",
    {
      "aria-label": "Görev özellikleri",
      className: "flex lt-860:hidden flex-col gap-[3px] w-[238px] shrink-0 py-4 px-3 border-r border-subtle bg-surface-base overflow-y-auto custom-scrollbar",
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "px-2.5 pt-1 pb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: "Özellikler" }),
        s.map((c) => {
          const u = t === c.code, b = d[c.code] || 0;
          return /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              draggable: !0,
              title: "Sürükleyerek sırayı değiştirin",
              onClick: () => a(c.code),
              onDragStart: (f) => {
                o(c.code);
                try {
                  f.dataTransfer.effectAllowed = "move", f.dataTransfer.setData("text/plain", c.code);
                } catch {
                }
              },
              onDragOver: (f) => {
                f.preventDefault(), n(c.code);
              },
              onDrop: (f) => {
                f.preventDefault(), l == null || l();
              },
              onDragEnd: i,
              className: [
                "flex shrink-0 items-center gap-[11px] h-9 px-[11px] rounded-[9px]",
                "text-[12.5px] text-left cursor-grab active:cursor-grabbing",
                "transition-opacity duration-fast",
                u ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover",
                r === c.code ? "opacity-35" : "opacity-100"
              ].join(" "),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${c.icon} text-[12px] w-[15px] opacity-85` }),
                /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate", children: c.title }),
                b > 0 && /* @__PURE__ */ e.jsx("span", { className: [
                  "flex items-center justify-center h-[17px] min-w-[17px] px-[5px]",
                  "rounded-full text-[10px] font-extrabold",
                  u ? "bg-primary text-white" : "bg-neutral-subtle text-text-tertiary"
                ].join(" "), children: b })
              ]
            },
            c.code
          );
        }),
        /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: m,
            className: "flex shrink-0 items-center gap-[11px] h-9 mt-1.5 px-[11px] rounded-[9px] border border-dashed border-primary bg-primary-subtle text-primary text-[12.5px] font-bold text-left cursor-pointer hover:border-solid",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px] w-[15px]" }),
              /* @__PURE__ */ e.jsx("span", { children: "Özellik ekle" })
            ]
          }
        )
      ]
    }
  );
}
function De({ label: t, value: a, avatarName: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 py-[9px] border-t border-subtle", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] text-text-tertiary shrink-0", children: t }),
    /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
      s && /* @__PURE__ */ e.jsx(
        "span",
        {
          className: "flex shrink-0 items-center justify-center h-[21px] w-[21px] rounded-full text-white text-[8.5px] font-bold",
          style: { background: Re(s) },
          children: Ke(s)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", title: typeof a == "string" ? a : void 0, children: a || "—" })
    ] })
  ] });
}
const Rt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "—";
function zs({ task: t = {}, nameById: a }) {
  const s = (i, n) => {
    var l;
    return i || n && ((l = a == null ? void 0 : a.get) == null ? void 0 : l.call(a, n)) || null;
  }, r = s(t.creatorName, t.creatorId), o = t.lastModificationTime ? s(t.lastModifierName, t.lastModifierId) : null;
  return /* @__PURE__ */ e.jsx("aside", { className: "flex flex-col gap-3.5 min-w-0", children: /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "mt-0 mb-1.5 text-[13.5px] font-bold text-text-primary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsx(De, { label: "Oluşturan", value: r || "Bilinmiyor", avatarName: r }),
    /* @__PURE__ */ e.jsx(De, { label: "Oluşturma tarihi", value: Rt(t.creationTime) }),
    /* @__PURE__ */ e.jsx(De, { label: "Güncelleyen", value: o || "—", avatarName: o }),
    /* @__PURE__ */ e.jsx(De, { label: "Son güncelleme", value: Rt(t.lastModificationTime) }),
    /* @__PURE__ */ e.jsx(De, { label: "Görev tipi", value: t.taskType }),
    /* @__PURE__ */ e.jsx(De, { label: "Sprint", value: t.sprint })
  ] }) });
}
const Bs = [
  { icon: "fa-bold", title: "Kalın (Ctrl+B)", cmd: "bold" },
  { icon: "fa-italic", title: "İtalik (Ctrl+I)", cmd: "italic" },
  { icon: "fa-underline", title: "Altı çizili", cmd: "underline" },
  { icon: "fa-strikethrough", title: "Üstü çizili", cmd: "strikeThrough" },
  { icon: "fa-list-ul", title: "Madde listesi", cmd: "insertUnorderedList", gap: !0 },
  { icon: "fa-list-ol", title: "Numaralı liste", cmd: "insertOrderedList" },
  { icon: "fa-heading", title: "Başlık", cmd: "formatBlock", arg: "H3", gap: !0 },
  { icon: "fa-quote-left", title: "Alıntı", cmd: "formatBlock", arg: "BLOCKQUOTE" },
  { icon: "fa-code", title: "Kod", cmd: "formatBlock", arg: "PRE" },
  { icon: "fa-link", title: "Bağlantı ekle", cmd: "link", gap: !0 },
  { icon: "fa-image", title: "Görsel ekle", cmd: "image", regular: !0 },
  { icon: "fa-table-cells", title: "Tablo ekle", cmd: "table" },
  { icon: "fa-at", title: "Kişi bahset", cmd: "mention" },
  { icon: "fa-eraser", title: "Biçimi temizle", cmd: "removeFormat", gap: !0 }
], Ks = '<table class="apya-rte-table"><tr><th>Kolon 1</th><th>Kolon 2</th></tr><tr><td>Değer</td><td>Değer</td></tr></table><p><br></p>', Rs = '<div class="apya-rte-imgph">görsel yer tutucu</div><p><br></p>';
function Ms(t) {
  return t ? /<[a-z][\s\S]*>/i.test(t) ? t : `<p>${t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}</p>` : "";
}
function Fs({ value: t, onChange: a, mentionName: s = "ekip arkadaşı" }) {
  const r = x.useRef(null), o = x.useRef(Ms(t)), [i, n] = x.useState(!1), [l, m] = x.useState("https://"), d = x.useRef(null), c = (v, w) => {
    var D, P;
    (D = r.current) == null || D.focus();
    try {
      document.execCommand(v, !1, w);
    } catch {
    }
    a == null || a(((P = r.current) == null ? void 0 : P.innerHTML) ?? "");
  }, u = () => {
    const v = window.getSelection();
    d.current = v && v.rangeCount ? v.getRangeAt(0).cloneRange() : null;
  }, b = () => {
    const v = d.current;
    if (!v) return;
    const w = window.getSelection();
    w.removeAllRanges(), w.addRange(v);
  }, f = () => {
    var w;
    const v = l.trim();
    n(!1), !(!v || v === "https://") && ((w = r.current) == null || w.focus(), b(), c("createLink", v), m("https://"));
  }, h = (v) => {
    switch (v.cmd) {
      case "link":
        u();
        return;
      case "image":
        c("insertHTML", Rs);
        return;
      case "table":
        c("insertHTML", Ks);
        return;
      case "mention":
        c("insertHTML", `<span class="apya-rte-mention">@${s}</span>&nbsp;`);
        return;
      default:
        c(v.cmd, v.arg);
    }
  }, y = "flex shrink-0 items-center justify-center h-7 w-7 rounded-[7px] border-0 bg-transparent text-text-secondary cursor-pointer hover:bg-surface-base hover:text-primary hover:shadow-xs";
  return /* @__PURE__ */ e.jsxs("div", { className: "rounded-[14px] border border-default bg-surface-base overflow-hidden shadow-xs", children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-0.5 px-2 py-1.5 border-b border-subtle bg-neutral-subtle overflow-x-auto custom-scrollbar", children: Bs.map((v) => {
      const w = /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          title: v.title,
          onMouseDown: (D) => {
            D.preventDefault(), h(v);
          },
          className: `${y} ${v.gap ? "ml-1.5" : ""}`,
          children: /* @__PURE__ */ e.jsx("i", { className: `fa-${v.regular ? "regular" : "solid"} ${v.icon} text-[12px]` })
        },
        v.cmd + v.icon
      );
      return v.cmd !== "link" ? w : /* @__PURE__ */ e.jsxs(be, { modal: !0, open: i, onOpenChange: n, children: [
        /* @__PURE__ */ e.jsx(he, { asChild: !0, children: w }),
        /* @__PURE__ */ e.jsx(ge, { container: ve(r.current), children: /* @__PURE__ */ e.jsxs(
          ye,
          {
            sideOffset: 6,
            align: "start",
            className: "z-popover w-[290px] rounded-[13px] border border-default bg-surface-elevated p-3 shadow-float animate-fade-in-fast",
            children: [
              /* @__PURE__ */ e.jsx("div", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary mb-2", children: "Bağlantı adresi" }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "url",
                    value: l,
                    onChange: (D) => m(D.target.value),
                    onKeyDown: (D) => {
                      D.key === "Enter" && f();
                    },
                    className: "flex-1 min-w-0 h-[34px] px-3 rounded-[9px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: f,
                    className: "h-[34px] px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                    children: "Ekle"
                  }
                )
              ] })
            ]
          }
        ) })
      ] }, "link");
    }) }),
    /* @__PURE__ */ e.jsx(
      "div",
      {
        ref: r,
        contentEditable: !0,
        suppressContentEditableWarning: !0,
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": "Görev açıklaması",
        "data-ph": "Bu görevin detayları nelerdir? (@kişi, #etiket)…",
        onInput: (v) => a == null ? void 0 : a(v.currentTarget.innerHTML),
        className: "apya-rte-surface min-h-[150px] p-4 text-[13.5px] leading-[1.7] text-text-primary bg-surface-base focus:outline-none",
        dangerouslySetInnerHTML: { __html: o.current }
      }
    )
  ] });
}
const Mt = "flex flex-col rounded-2xl border border-subtle bg-surface-base p-[18px] shadow-xs";
function tt({ name: t, size: a = 32 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-white font-bold",
      style: { height: a, width: a, background: Re(t), fontSize: a * 0.34 },
      children: Ke(t)
    }
  );
}
function Ft({ open: t, onClick: a }) {
  return /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      onClick: a,
      className: "flex items-center justify-center h-7 w-7 rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer",
      children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${t ? "fa-chevron-up" : "fa-chevron-down"} text-[12px]` })
    }
  );
}
const Gt = (t) => t ? new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(new Date(t)) : "";
function Gs({
  task: t = {},
  onFieldChange: a = () => {
  },
  descriptionValue: s,
  checklist: r,
  currentUserName: o = "Ben"
}) {
  const i = t == null ? void 0 : t.id, n = le(), [l, m] = x.useState(!0), [d, c] = x.useState(""), u = (r == null ? void 0 : r.items) ?? [], b = u.filter((p) => p.isDone).length, f = u.length ? Math.round(b / u.length * 100) : 0, h = async () => {
    var C, k, S;
    const p = d.trim();
    if (!(!p || !i)) {
      c("");
      try {
        await r.addItem(p);
      } catch (H) {
        (S = (k = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : k.error) == null || S.call(k, (H == null ? void 0 : H.message) || "Madde eklenemedi.");
      }
    }
  }, [y, v] = x.useState(!0), [w, D] = x.useState(""), [P, z] = x.useState(!1), [M, F] = x.useState(!1), [Y, B] = x.useState(null), [G, V] = x.useState(""), [_, O] = x.useState({}), { data: Z = [] } = ie({
    queryKey: ["task-comments", i],
    queryFn: () => {
      var p, C, k, S;
      return Promise.resolve((S = (k = (C = (p = window == null ? void 0 : window.apya) == null ? void 0 : p.platform) == null ? void 0 : C.tasks) == null ? void 0 : k.task) == null ? void 0 : S.getComments(i));
    },
    enabled: !!i,
    staleTime: 1e4
  }), W = async () => {
    await n.invalidateQueries({ queryKey: ["task-comments", i] }), await n.invalidateQueries({ queryKey: ["task-detail", i] });
  }, X = async () => {
    var C, k, S;
    const p = w.trim();
    if (!(!p || !i || M)) {
      F(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.addComment(i, p)), await W(), D("");
      } catch (H) {
        (S = (k = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : k.error) == null || S.call(k, (H == null ? void 0 : H.message) || "Yorum gönderilemedi.");
      } finally {
        F(!1);
      }
    }
  }, ee = async (p) => {
    var k, S, H;
    const C = G.trim();
    if (!(!C || !i))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.replyToComment(p, C)), await W(), V(""), B(null);
      } catch (oe) {
        (H = (S = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : S.error) == null || H.call(S, (oe == null ? void 0 : oe.message) || "Yanıt gönderilemedi.");
      }
  }, q = (p) => O((C) => {
    const k = C[p] ?? { liked: !1, count: 0 };
    return { ...C, [p]: { liked: !k.liked, count: k.count + (k.liked ? -1 : 1) } };
  }), g = !!w.trim() && !M;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-4 min-w-0", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-[9px]", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Açıklama" }),
        /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Zengin metin · WYSIWYG" })
      ] }),
      /* @__PURE__ */ e.jsx(
        Fs,
        {
          value: s ?? t.description ?? "",
          onChange: (p) => a("description", p),
          mentionName: o
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: Mt, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Kontrol listesi" }),
          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-5 px-2 rounded-full bg-neutral-subtle text-text-secondary font-mono text-[11px] font-bold", children: [
            b,
            "/",
            u.length
          ] })
        ] }),
        /* @__PURE__ */ e.jsx(Ft, { open: l, onClick: () => m((p) => !p) })
      ] }),
      l && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1 mt-3.5", children: [
        /* @__PURE__ */ e.jsx("div", { className: "h-1.5 mb-2 rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full rounded-full bg-success transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
            style: { width: `${f}%` }
          }
        ) }),
        u.map((p) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-2 py-[7px] rounded-[9px] hover:bg-surface-raised", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              "aria-label": p.isDone ? "Tamamlandı işaretini kaldır" : "Tamamlandı işaretle",
              onClick: () => r.toggleItem(p.id).catch((C) => {
                var k, S, H;
                return (H = (S = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : S.error) == null ? void 0 : H.call(S, (C == null ? void 0 : C.message) || "Durum güncellenemedi.");
              }),
              className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer transition-colors duration-fast ${p.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
              children: p.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[13px] ${p.isDone ? "line-through text-text-tertiary font-medium" : "text-text-primary font-semibold"}`, children: p.text }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              title: "Sil",
              onClick: () => r.removeItem(p.id).catch((C) => {
                var k, S, H;
                return (H = (S = (k = window == null ? void 0 : window.abp) == null ? void 0 : k.notify) == null ? void 0 : S.error) == null ? void 0 : H.call(S, (C == null ? void 0 : C.message) || "Madde silinemedi.");
              }),
              className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
              children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
            }
          )
        ] }, p.id)),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "text",
            value: d,
            onChange: (p) => c(p.target.value),
            onKeyDown: (p) => {
              p.key === "Enter" && h();
            },
            placeholder: "Yeni madde yaz ve Enter'a bas…",
            className: "h-9 mt-1.5 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: Mt, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ e.jsx("h2", { className: "text-[13.5px] font-bold text-text-primary", children: "Yorumlar & güncellemeler" }),
          /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-5 min-w-[20px] px-[7px] rounded-full bg-primary-subtle text-primary text-[11px] font-extrabold", children: Z.length })
        ] }),
        /* @__PURE__ */ e.jsx(Ft, { open: y, onClick: () => v((p) => !p) })
      ] }),
      y && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[18px] mt-4", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start", children: [
          /* @__PURE__ */ e.jsx(tt, { name: o }),
          /* @__PURE__ */ e.jsxs("div", { className: `flex-1 min-w-0 flex flex-col rounded-[13px] border overflow-hidden transition-[border-color,box-shadow] duration-fast ${P ? "border-focus bg-surface-base shadow-focus" : "border-default bg-surface-raised"}`, children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                rows: 2,
                value: w,
                onChange: (p) => D(p.target.value),
                onFocus: () => z(!0),
                onBlur: () => z(!1),
                onKeyDown: (p) => {
                  p.key === "Enter" && (p.ctrlKey || p.metaKey) && (p.preventDefault(), X());
                },
                placeholder: "Bir yorum yazın… (@bahset, Ctrl+Enter ile gönder)",
                className: "w-full p-3 border-0 bg-transparent text-text-primary text-[13px] leading-[1.6] resize-none focus:outline-none"
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-2.5 py-[7px] border-t border-subtle bg-surface-base", children: [
              /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-0.5", children: [
                { icon: "fa-solid fa-paperclip", title: "Dosya ekle", add: " [Dosya] " },
                { icon: "fa-regular fa-image", title: "Görsel ekle", add: " [Görsel] " },
                { icon: "fa-regular fa-face-smile", title: "Emoji", add: " 👍 " },
                { icon: "fa-solid fa-at", title: "Bahset", add: " @" }
              ].map((p) => /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  title: p.title,
                  onMouseDown: (C) => C.preventDefault(),
                  onClick: () => D((C) => C + p.add),
                  className: "flex items-center justify-center h-7 w-7 rounded-[7px] text-text-tertiary hover:bg-surface-hover hover:text-primary cursor-pointer",
                  children: /* @__PURE__ */ e.jsx("i", { className: `${p.icon} text-[12px]` })
                },
                p.title
              )) }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: X,
                  disabled: !g,
                  className: `flex items-center gap-[7px] h-[30px] px-3.5 rounded-[9px] text-[12px] font-bold shadow-xs ${g ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${M ? "fa-circle-notch fa-spin" : "fa-paper-plane"} text-[10px]` }),
                    "Gönder"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1", children: Z.map((p) => {
          const C = _[p.id] ?? { liked: !1, count: 0 };
          return /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[11px] items-start py-3 border-t border-subtle", children: [
            /* @__PURE__ */ e.jsx(tt, { name: p.authorName }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2.5 flex-wrap", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: p.authorName }),
                /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10.5px] text-text-tertiary", children: Gt(p.creationTime) })
              ] }),
              /* @__PURE__ */ e.jsx("p", { className: "m-0 text-[13px] leading-[1.65] text-text-secondary whitespace-pre-wrap", children: p.text }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 mt-[3px]", children: [
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => q(p.id),
                    className: `flex items-center gap-1.5 h-[26px] px-[9px] rounded-full border text-[11px] font-semibold cursor-pointer ${C.liked ? "border-primary bg-primary-subtle text-primary" : "border-default bg-transparent text-text-tertiary hover:border-focus"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-thumbs-up text-[10px]" }),
                      C.count
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      B((k) => k === p.id ? null : p.id), V("");
                    },
                    className: "flex items-center gap-1.5 h-[26px] px-[9px] rounded-full text-text-tertiary text-[11px] font-semibold hover:bg-surface-hover hover:text-primary cursor-pointer",
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-reply text-[10px]" }),
                      "Yanıtla"
                    ]
                  }
                )
              ] }),
              Y === p.id && /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2 mt-2 animate-fade-in-fast", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    autoFocus: !0,
                    type: "text",
                    value: G,
                    onChange: (k) => V(k.target.value),
                    onKeyDown: (k) => {
                      k.key === "Enter" && ee(p.id);
                    },
                    placeholder: `@${p.authorName} kullanıcısına yanıt ver…`,
                    className: "flex-1 h-8 px-3 rounded-[9px] border border-focus bg-surface-base text-text-primary text-[12px] shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => ee(p.id),
                    className: "h-8 px-3.5 rounded-[9px] bg-primary text-white text-[12px] font-bold cursor-pointer hover:bg-primary-hover",
                    children: "Yanıtla"
                  }
                )
              ] }),
              (p.replies ?? []).map((k) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] mt-2.5 pl-3 border-l-2 border-default", children: [
                /* @__PURE__ */ e.jsx(tt, { name: k.authorName, size: 24 }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: k.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: Gt(k.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-[3px] mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: k.text })
                ] })
              ] }, k.id))
            ] })
          ] }, p.id);
        }) })
      ] })
    ] })
  ] });
}
function Os({
  lastSavedAt: t,
  isDirty: a,
  isSaving: s,
  justSaved: r,
  onCancel: o,
  onSave: i
}) {
  const n = t ? new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t)) : "—", l = s ? "fa-solid fa-circle-notch fa-spin" : r ? "fa-solid fa-check" : "fa-regular fa-floppy-disk", m = s ? "Kaydediliyor…" : r ? "Kaydedildi" : "Kaydet", d = a && !s;
  return /* @__PURE__ */ e.jsxs("footer", { className: "flex items-center justify-between gap-4 px-6 lt-860:px-4 py-3.5 border-t border-subtle bg-surface-base", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3.5 min-w-0 lt-560:hidden", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] text-[11.5px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock text-[11px]" }),
        "Son kayıt: ",
        /* @__PURE__ */ e.jsx("strong", { className: "font-semibold text-text-secondary", children: n })
      ] }),
      a && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] text-[11.5px] font-semibold text-warning", children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-[7px] w-[7px] rounded-full bg-warning animate-pulse" }),
        "Kaydedilmemiş değişiklikler var"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 shrink-0", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: o,
          className: "h-9 px-4 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[13px] font-semibold hover:bg-surface-hover hover:text-text-primary cursor-pointer",
          children: "Vazgeç"
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: i,
          disabled: !d,
          className: `flex items-center gap-2 h-9 px-[22px] rounded-[10px] text-white text-[13px] font-bold shadow-sm ${d ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `${l} text-[11px]` }),
            m
          ]
        }
      )
    ] })
  ] });
}
const qs = Object.fromEntries(Me.map((t) => [t.code, t])), Ys = {
  checklist: { desc: "Alt görev ve onay kontrol listeleri", bg: "bg-success-subtle", fg: "text-success" },
  gantt: { desc: "İnteraktif zaman çizelgesi ve aşamalar", bg: "bg-primary-subtle", fg: "text-primary" },
  "time-tracking": { desc: "Canlı süre takibi, sayaç ve raporlama", bg: "bg-warning-subtle", fg: "text-warning" },
  dependencies: { desc: "Öncül ve ardıl görev bağlantıları", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  risks: { desc: "Risk matrisi ve önleyici aksiyonlar", bg: "bg-warning-subtle", fg: "text-warning" },
  approvals: { desc: "Çok adımlı yönetici onay akışları", bg: "bg-primary-subtle", fg: "text-primary" },
  dashboard: { desc: "Özel KPI ve performans widget panelleri", bg: "bg-primary-subtle", fg: "text-primary" },
  comments: { desc: "Görev yorumları ve @bahsetmeler", bg: "bg-primary-subtle", fg: "text-primary" },
  emails: { desc: "Görevle bağlantılı e-posta entegrasyonu", bg: "bg-primary-subtle", fg: "text-primary" },
  activity: { desc: "Tüm sistem olayları ve zaman akışı", bg: "bg-primary-subtle", fg: "text-primary" },
  history: { desc: "Kronolojik alan ve metin geçmişi", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  finance: { desc: "Maliyet merkezleri, bütçe ve harcamalar", bg: "bg-success-subtle", fg: "text-success" },
  gallery: { desc: "Görsel medya ve dosya önizleme", bg: "bg-neutral-subtle", fg: "text-text-secondary" },
  ai: { desc: "Akıllı görev analizi, özet ve öneriler", bg: "bg-ai-subtle", fg: "text-ai-500" },
  automations: { desc: "Durum ve eylem tetikleyici kurallar", bg: "bg-ai-subtle", fg: "text-ai-500" },
  "custom-fields": { desc: "Göreve özel form alanları tanımlayın", bg: "bg-success-subtle", fg: "text-success" }
}, _s = [
  { title: "GÖREV & PLANLAMA", codes: ["checklist", "gantt", "time-tracking", "dependencies", "risks", "approvals", "dashboard"] },
  { title: "İLETİŞİM", codes: ["comments", "emails"] },
  { title: "GEÇMİŞ & FİNANS", codes: ["activity", "history", "finance", "gallery"] },
  { title: "İLERİ ÖZELLİKLER & YAPAY ZEKA", codes: ["ai", "automations", "custom-fields"] }
], Us = /* @__PURE__ */ new Set([
  "checklist",
  "risks",
  "dashboard",
  "comments",
  "emails",
  "history",
  "gallery",
  "custom-fields",
  "approvals",
  "ai",
  "automations"
]), Hs = (t) => Us.has(t);
function fa(t) {
  const a = qs[t], s = Ys[t];
  return a ? {
    code: t,
    title: a.title,
    icon: a.icon,
    desc: (s == null ? void 0 : s.desc) ?? "",
    bg: (s == null ? void 0 : s.bg) ?? "bg-neutral-subtle",
    fg: (s == null ? void 0 : s.fg) ?? "text-text-secondary"
  } : null;
}
function Vs(t = "") {
  const a = t.trim().toLowerCase();
  return _s.map((s) => ({
    title: s.title,
    items: s.codes.map(fa).filter(Boolean).filter((r) => !a || r.title.toLowerCase().includes(a) || r.desc.toLowerCase().includes(a))
  })).filter((s) => s.items.length > 0);
}
const Ot = Me.length;
function qt({ code: t, onRemoveFeature: a, onOpenPicker: s, canRemove: r = !0 }) {
  const o = fa(t) ?? { title: t, desc: "", icon: "fa-cube", bg: "bg-neutral-subtle", fg: "text-text-secondary" };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-3 py-14 px-6 rounded-2xl border border-dashed border-strong bg-surface-base text-center", children: [
    /* @__PURE__ */ e.jsx("span", { className: `flex items-center justify-center h-14 w-14 rounded-2xl ${o.bg} ${o.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${o.icon} text-[22px]` }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-w-[420px]", children: [
      /* @__PURE__ */ e.jsx("span", { className: "text-[15px] font-extrabold tracking-[-.02em] text-text-primary", children: o.title }),
      o.desc && /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] leading-[1.6] text-text-secondary", children: o.desc }),
      /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-center gap-[7px] mt-1.5 text-[11.5px] font-semibold text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-person-digging text-[11px]" }),
        "Bu sekme yapım aşamasında."
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5 mt-1.5", children: [
      r && /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => a == null ? void 0 : a(t),
          className: "flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[12.5px] font-semibold cursor-pointer hover:bg-negative-subtle hover:border-negative hover:text-negative",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[10px]" }),
            "Bu özelliği kaldır"
          ]
        }
      ),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: s,
          className: "flex items-center gap-2 h-[34px] px-3.5 rounded-[10px] bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
          children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shapes text-[10px]" }),
            "Başka özellik ekle"
          ]
        }
      )
    ] })
  ] });
}
function pt({ open: t, onClose: a, label: s, children: r }) {
  return /* @__PURE__ */ e.jsx(
    Sa,
    {
      open: t,
      onOpenChange: (o) => {
        o || a == null || a();
      },
      children: /* @__PURE__ */ e.jsxs($a, { children: [
        /* @__PURE__ */ e.jsx(Ea, { className: "fixed inset-0", style: { pointerEvents: "none" } }),
        /* @__PURE__ */ e.jsx(Pa, { asChild: !0, "aria-describedby": void 0, children: /* @__PURE__ */ e.jsxs("div", { className: "fixed inset-0 z-modal", children: [
          /* @__PURE__ */ e.jsx(Ia, { className: "sr-only", children: s }),
          r
        ] }) })
      ] })
    }
  );
}
function Qs({
  open: t,
  onClose: a,
  assignedCodes: s = [],
  onAddFeature: r,
  onGoToTab: o
}) {
  const [i, n] = x.useState("");
  if (x.useEffect(() => {
    t || n("");
  }, [t]), !t) return null;
  const l = new Set(s), m = Vs(i), d = s.length + 3, c = (u) => {
    if (l.has(u)) {
      o == null || o(u), a == null || a();
      return;
    }
    r == null || r(u), a == null || a();
  };
  return /* @__PURE__ */ e.jsx(pt, { open: t, onClose: a, label: "Özellik ekle", children: /* @__PURE__ */ e.jsx(
    "div",
    {
      "data-apya-overlay": !0,
      className: "absolute inset-0 flex items-center justify-center p-6 bg-surface-overlay backdrop-blur-sm animate-fade-in-fast",
      onClick: a,
      role: "presentation",
      children: /* @__PURE__ */ e.jsxs(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": "Özellik ekle",
          onClick: (u) => u.stopPropagation(),
          className: "flex flex-col w-full max-w-[840px] max-h-[86vh] rounded-[22px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 px-[22px] py-5 border-b border-subtle bg-surface-raised", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-10 w-10 rounded-[13px] bg-primary text-white shadow-md", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shapes text-base" }) }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsx("h3", { className: "m-0 text-base font-extrabold tracking-[-.02em] text-text-primary", children: "Özellik ekle" }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 mb-0 text-[12px] text-text-tertiary", children: "Bir özelliğe tıklayarak görevinize yeni sekme ve fonksiyon ekleyin." })
                ] })
              ] }),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: a,
                  "aria-label": "Kapat",
                  className: "flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer",
                  children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[15px]" })
                }
              )
            ] }),
            /* @__PURE__ */ e.jsx("div", { className: "px-[22px] pt-4 pb-2", children: /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-[13px] top-1/2 -translate-y-1/2 text-[12px] text-text-tertiary" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  autoFocus: !0,
                  type: "text",
                  value: i,
                  onChange: (u) => n(u.target.value),
                  placeholder: `${Ot} özellik arasında ara (Gantt, Finans, Risk, AI…)`,
                  className: "w-full h-[42px] pl-9 pr-3.5 rounded-xl border border-default bg-neutral-subtle text-text-primary text-[13px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                }
              )
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col gap-5 px-[22px] pt-3 pb-[22px] overflow-y-auto custom-scrollbar", children: [
              m.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[11px]", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.1em] text-text-tertiary", children: u.title }),
                  /* @__PURE__ */ e.jsx("span", { className: "flex-1 h-px bg-subtle" })
                ] }),
                /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[11px]", children: u.items.map((b) => {
                  const f = l.has(b.code);
                  return /* @__PURE__ */ e.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => c(b.code),
                      className: `group flex items-start gap-3 p-3.5 rounded-[15px] border text-left cursor-pointer hover:border-focus hover:shadow-md ${f ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                      children: [
                        /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-10 w-10 rounded-xl ${b.bg} ${b.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${b.icon} text-[15px]` }) }),
                        /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-[3px] min-w-0 flex-1", children: [
                          /* @__PURE__ */ e.jsxs("span", { className: "flex items-center justify-between gap-2", children: [
                            /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary truncate", children: b.title }),
                            /* @__PURE__ */ e.jsx("span", { className: `shrink-0 text-[10.5px] font-extrabold ${f ? "text-primary" : "text-text-tertiary"}`, children: f ? "✓ Ekli" : "Ekle →" })
                          ] }),
                          /* @__PURE__ */ e.jsx("span", { className: "text-[11.5px] leading-[1.5] text-text-tertiary", children: b.desc })
                        ] })
                      ]
                    },
                    b.code
                  );
                }) })
              ] }, u.title)),
              m.length === 0 && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-2 py-12 text-center", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass text-3xl text-text-tertiary mb-2" }),
                /* @__PURE__ */ e.jsx("p", { className: "m-0 text-sm font-semibold text-text-primary", children: "Eşleşen özellik bulunamadı" }),
                /* @__PURE__ */ e.jsx("p", { className: "m-0 text-xs text-text-tertiary", children: "Lütfen farklı bir arama terimi deneyin." })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-[22px] py-3.5 border-t border-subtle bg-surface-raised text-[11.5px] text-text-tertiary", children: [
              /* @__PURE__ */ e.jsxs("span", { children: [
                "Toplam ",
                Ot,
                " modül · ",
                d,
                " tanesi bu göreve ekli"
              ] }),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: a,
                  className: "border-0 bg-transparent text-text-secondary text-[11.5px] font-bold cursor-pointer hover:text-primary",
                  children: "Kapat (ESC)"
                }
              )
            ] })
          ]
        }
      )
    }
  ) });
}
const Zs = [
  { key: "subtasks", label: "Alt görevler", countKey: "subtasks", unit: "alt görev" },
  { key: "checklist", label: "Kontrol listesi", countKey: "checklist", unit: "madde" },
  { key: "comments", label: "Yorumlar", countKey: "comments", unit: "yorum" },
  { key: "files", label: "Dosyalar", countKey: "files", unit: "dosya" },
  { key: "keepAssignee", label: "Sorumluyu koru", desc: "Aksi halde atanmamış gelir" },
  { key: "keepLinks", label: "Bağımlılıkları koru", desc: "Öncül / ardıl bağlantılar" },
  { key: "shiftDates", label: "Tarihleri bugüne kaydır", desc: "Başlangıç ve son tarih ötelenir" }
], Yt = {
  subtasks: !0,
  checklist: !0,
  comments: !1,
  files: !0,
  keepAssignee: !0,
  keepLinks: !0,
  shiftDates: !1
};
function Ws({ on: t, onClick: a, label: s }) {
  return /* @__PURE__ */ e.jsx(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": t,
      "aria-label": s,
      onClick: a,
      className: `relative shrink-0 h-[22px] w-[38px] p-0 border-0 rounded-full cursor-pointer transition-colors duration-fast ${t ? "bg-primary" : "bg-border-strong"}`,
      children: /* @__PURE__ */ e.jsx(
        "span",
        {
          className: "absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition-[left] duration-[160ms] ease-[cubic-bezier(.16,1,.3,1)]",
          style: { left: t ? 19 : 3 }
        }
      )
    }
  );
}
function Js({
  open: t,
  mode: a = "move",
  onClose: s,
  onConfirm: r,
  projectOptions: o = [],
  currentProjectId: i,
  counts: n = {},
  onCreateProject: l
}) {
  const [m, d] = x.useState(a), [c, u] = x.useState([]), [b, f] = x.useState(""), [h, y] = x.useState(""), [v, w] = x.useState(Yt), [D, P] = x.useState(!1);
  x.useEffect(() => {
    t && (d(a), u([]), f(""), y(""), w(Yt));
  }, [t, a]);
  const z = x.useMemo(
    () => o.filter((g) => g.value && g.value !== i),
    [o, i]
  ), M = z.filter((g) => !b || g.label.toLowerCase().includes(b.toLowerCase())), F = z.length > 0 && c.length === z.length;
  if (!t) return null;
  const Y = (g) => u((p) => p.includes(g) ? p.filter((C) => C !== g) : [...p, g]), B = (g) => {
    var p;
    return ((p = o.find((C) => C.value === g)) == null ? void 0 : p.label) ?? "";
  }, G = async () => {
    var p, C, k;
    const g = h.trim();
    if (!(!g || D)) {
      P(!0);
      try {
        const S = await (l == null ? void 0 : l(g));
        S && u((H) => [...H, S]), y("");
      } catch (S) {
        (k = (C = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : C.error) == null || k.call(C, (S == null ? void 0 : S.message) || "Proje oluşturulamadı.");
      } finally {
        P(!1);
      }
    }
  }, V = async () => {
    if (!(!c.length || D)) {
      P(!0);
      try {
        await (r == null ? void 0 : r({ mode: m, targetProjectIds: c, include: v }));
      } finally {
        P(!1);
      }
    }
  }, _ = m === "move", O = c.length, Z = _ ? O > 1 ? "Taşı ve kopyala" : "Taşı" : O > 1 ? `${O} projeye kopyala` : "Kopyala", W = Object.values(v).filter(Boolean).length, X = c.map(B).filter(Boolean), ee = X.length ? `${X.length > 2 ? `${X.slice(0, 2).join(", ")} +${X.length - 2}` : X.join(", ")} · ${W} seçenek açık` : `Proje seçilmedi · ${W} seçenek açık`, q = (g) => `flex items-center gap-[7px] h-[30px] px-[15px] rounded-lg border-0 text-[12.5px] font-bold cursor-pointer ${g ? "bg-surface-base text-primary shadow-xs" : "bg-transparent text-text-tertiary"}`;
  return /* @__PURE__ */ e.jsx(pt, { open: t, onClose: s, label: _ ? "Başka projeye taşı" : "Başka projelere kopyala", children: /* @__PURE__ */ e.jsx(
    "div",
    {
      "data-apya-overlay": !0,
      className: "absolute inset-0 flex items-center justify-center p-6 bg-surface-overlay backdrop-blur-sm animate-fade-in-fast",
      onClick: s,
      role: "presentation",
      children: /* @__PURE__ */ e.jsxs(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": _ ? "Başka projeye taşı" : "Başka projelere kopyala",
          onClick: (g) => g.stopPropagation(),
          className: "flex flex-col w-full max-w-[760px] max-h-[88vh] rounded-[20px] border border-default bg-surface-base shadow-xl overflow-hidden animate-dialog-in",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-4 px-[22px] pt-5 pb-4 border-b border-subtle", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center justify-center h-10 w-10 rounded-[13px] bg-primary-subtle text-primary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-tree text-base" }) }),
                /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ e.jsx("h3", { className: "m-0 text-base font-extrabold tracking-[-.02em] text-text-primary", children: _ ? "Başka projeye taşı" : "Başka projelere kopyala" }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-0.5 mb-0 text-[12px] leading-[1.5] text-text-tertiary", children: _ ? "Görev ilk seçtiğiniz projeye taşınır; birden fazla seçerseniz kalanlara kopya oluşturulur." : "Görevin kopyası seçtiğiniz her projede oluşturulur; bu görev yerinde kalır." })
                ] })
              ] }),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: s,
                  "aria-label": "Kapat",
                  className: "flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] text-text-tertiary hover:bg-surface-hover hover:text-text-primary cursor-pointer",
                  children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[15px]" })
                }
              )
            ] }),
            /* @__PURE__ */ e.jsx("div", { className: "px-[22px] pt-3.5", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 p-[3px] w-max rounded-[11px] bg-neutral-subtle", children: [
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => d("move"), className: q(_), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-right-left text-[10px]" }),
                "Taşı"
              ] }),
              /* @__PURE__ */ e.jsxs("button", { type: "button", onClick: () => d("copy"), className: q(!_), children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-clone text-[10px]" }),
                "Kopyala"
              ] })
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex-1 grid grid-cols-2 lt-860:grid-cols-1 gap-5 items-start px-[22px] pt-4 pb-5 overflow-y-auto custom-scrollbar", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px] min-w-0", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-2.5", children: [
                  /* @__PURE__ */ e.jsxs("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.08em] text-text-tertiary", children: [
                    "Hedef projeler · ",
                    O
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => u(F ? [] : z.map((g) => g.value)),
                      className: "p-0 border-0 bg-transparent text-primary text-[11px] font-bold cursor-pointer hover:underline",
                      children: F ? "Seçimi temizle" : "Tümünü seç"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-text-tertiary" }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: b,
                      onChange: (g) => f(g.target.value),
                      placeholder: "Proje ara…",
                      className: "w-full h-[38px] pl-[33px] pr-3 rounded-[10px] border border-default bg-neutral-subtle text-text-primary text-[12.5px] focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar", children: [
                  M.map((g) => {
                    const p = c.includes(g.value), C = _ && c[0] === g.value;
                    return /* @__PURE__ */ e.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => Y(g.value),
                        className: `flex items-center gap-[11px] px-3 py-[11px] rounded-[11px] border text-left cursor-pointer hover:border-focus ${p ? "border-primary bg-primary-subtle" : "border-subtle bg-surface-base"}`,
                        children: [
                          /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] rounded-[5px] border-[1.5px] text-white ${p ? "bg-primary border-primary" : "bg-transparent border-strong"}`, children: p && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" }) }),
                          /* @__PURE__ */ e.jsx("span", { className: "h-2.5 w-2.5 shrink-0 rounded-[3px] bg-primary" }),
                          /* @__PURE__ */ e.jsx("span", { className: "flex-1 min-w-0 text-[12.5px] font-semibold text-text-primary truncate", children: g.label }),
                          C && /* @__PURE__ */ e.jsx("span", { className: "flex shrink-0 items-center h-5 px-2 rounded-md bg-primary text-white text-[10px] font-extrabold", children: "TAŞINACAK" })
                        ]
                      },
                      g.value
                    );
                  }),
                  M.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "py-6 text-center text-[12px] text-text-tertiary", children: "Uygun proje bulunamadı." })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[7px] mt-1", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "text",
                      value: h,
                      onChange: (g) => y(g.target.value),
                      onKeyDown: (g) => {
                        g.key === "Enter" && (g.preventDefault(), G());
                      },
                      placeholder: "Yeni proje adı…",
                      className: "flex-1 min-w-0 h-9 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      title: "Yeni proje oluştur",
                      onClick: G,
                      disabled: !h.trim() || D,
                      className: "flex shrink-0 items-center justify-center h-9 w-9 rounded-[10px] bg-primary-subtle text-primary cursor-pointer hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-folder-plus text-[12px]" })
                    }
                  )
                ] }),
                _ && O > 1 && /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-[9px] px-3 py-[11px] rounded-[11px] border border-warning bg-warning-subtle", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-circle-info text-[12px] text-warning mt-px" }),
                  /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] leading-[1.5] text-text-secondary", children: [
                    "Taşıma tek hedefe yapılır: ",
                    /* @__PURE__ */ e.jsx("strong", { className: "font-bold text-text-primary", children: "ilk seçtiğiniz proje" }),
                    " hedef olur, kalan projelere kopya oluşturulur."
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px] min-w-0", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[10.5px] font-extrabold uppercase tracking-[.08em] text-text-tertiary", children: "Neler taşınsın?" }),
                /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: Zs.map((g) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 px-2.5 py-[9px] rounded-[10px] hover:bg-surface-raised", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-px", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary", children: g.label }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: g.countKey ? `${n[g.countKey] ?? 0} ${g.unit}` : g.desc })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    Ws,
                    {
                      on: v[g.key],
                      label: g.label,
                      onClick: () => w((p) => ({ ...p, [g.key]: !p[g.key] }))
                    }
                  )
                ] }, g.key)) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3.5 px-[22px] py-3.5 border-t border-subtle bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("span", { className: "min-w-0 truncate text-[11.5px] text-text-tertiary", children: ee }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 shrink-0", children: [
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: s,
                    className: "h-9 px-4 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[12.5px] font-semibold hover:bg-surface-hover hover:text-text-primary cursor-pointer",
                    children: "Vazgeç"
                  }
                ),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: V,
                    disabled: !O || D,
                    className: `flex items-center gap-2 h-9 px-5 rounded-[10px] text-white text-[12.5px] font-bold shadow-sm ${O && !D ? "bg-primary hover:bg-primary-hover cursor-pointer" : "bg-border-strong cursor-not-allowed"}`,
                    children: [
                      /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${D ? "fa-circle-notch fa-spin" : "fa-arrow-right"} text-[10px]` }),
                      Z
                    ]
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  ) });
}
const Xs = [
  { code: "general", title: "Genel", icon: "fa-circle-info" },
  { code: "checklist", title: "Kontrol", icon: "fa-square-check" },
  { code: "comments", title: "Yorumlar", icon: "fa-comments" },
  { code: "files", title: "Dosyalar", icon: "fa-paperclip" }
], Ae = {
  pdf: { icon: "fa-file-pdf", bg: "bg-negative-subtle", fg: "text-negative" },
  img: { icon: "fa-image", bg: "bg-primary-subtle", fg: "text-primary" },
  doc: { icon: "fa-file-word", bg: "bg-primary-subtle", fg: "text-primary" },
  code: { icon: "fa-file-code", bg: "bg-success-subtle", fg: "text-success" },
  other: { icon: "fa-file", bg: "bg-neutral-subtle", fg: "text-text-secondary" }
};
function er(t = "") {
  var s;
  const a = (s = t.split(".").pop()) == null ? void 0 : s.toLowerCase();
  return a === "pdf" ? Ae.pdf : ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(a) ? Ae.img : ["doc", "docx", "odt", "rtf"].includes(a) ? Ae.doc : ["json", "js", "ts", "cs", "xml", "yml", "yaml"].includes(a) ? Ae.code : Ae.other;
}
const tr = (t) => t ? t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / 1024 / 1024).toFixed(1)} MB` : "—", ar = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—", sr = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(new Date(t)) : "—";
function at({ name: t, size: a = 22 }) {
  return /* @__PURE__ */ e.jsx(
    "span",
    {
      className: "flex shrink-0 items-center justify-center rounded-full text-white font-bold",
      style: { height: a, width: a, background: Re(t), fontSize: a * 0.4 },
      children: Ke(t)
    }
  );
}
function qe({ label: t, children: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[10px] font-bold uppercase tracking-[.08em] text-text-tertiary", children: t }),
    a
  ] });
}
function rr({
  subtaskId: t,
  parentCode: a,
  onClose: s,
  onOpenFull: r,
  onDeleted: o,
  currentUserName: i = "Ben"
}) {
  var S, H, oe;
  const n = le(), { data: l } = dt(t), m = ut(t), d = xa(t), [c, u] = x.useState("general"), [b, f] = x.useState(""), [h, y] = x.useState(""), [v, w] = x.useState(""), D = x.useRef(null), P = x.useRef(null);
  l && P.current !== l.id && (P.current = l.id, f(l.description ?? ""));
  const { data: z = [] } = ie({
    queryKey: ["task-comments", t],
    queryFn: () => {
      var j, I, $, K;
      return Promise.resolve((K = ($ = (I = (j = window == null ? void 0 : window.apya) == null ? void 0 : j.platform) == null ? void 0 : I.tasks) == null ? void 0 : $.task) == null ? void 0 : K.getComments(t));
    },
    enabled: !!t,
    staleTime: 1e4
  });
  if (x.useEffect(() => {
    const j = (I) => {
      I.key === "Escape" && (I.stopPropagation(), s == null || s());
    };
    return window.addEventListener("keydown", j), () => window.removeEventListener("keydown", j);
  }, [s]), !l) return null;
  const M = (oe = (H = (S = window == null ? void 0 : window.apya) == null ? void 0 : S.platform) == null ? void 0 : H.tasks) == null ? void 0 : oe.task, F = Be(l.status), Y = la(l.priority), B = m.items ?? [], G = B.filter((j) => j.isDone).length, V = B.length ? Math.round(G / B.length * 100) : 0, _ = d.attachments ?? [], O = { checklist: B.length, comments: z.length, files: _.length }, Z = async () => {
    await n.invalidateQueries({ queryKey: ["task-detail", t] });
  }, W = async (j) => {
    var I, $, K;
    try {
      await Promise.resolve(M.update(l.id, {
        title: l.title,
        description: l.description ?? null,
        startDate: (l.startDate ?? "").slice(0, 10),
        dueDate: l.dueDate ? l.dueDate.slice(0, 10) : null,
        status: l.status,
        priority: l.priority,
        assigneeId: l.assigneeId ?? null,
        boardColumnId: l.boardColumnId ?? null,
        projectId: l.projectId ?? null,
        parentTaskId: l.parentTaskId ?? null,
        isPrivate: !!l.isPrivate,
        predecessorIds: l.predecessorIds ?? [],
        tagNames: (l.tags ?? []).map((U) => U.name),
        estimatedHours: l.estimatedHours ?? null,
        taskType: l.taskType ?? null,
        sprint: l.sprint ?? null,
        ...j
      })), await Z();
    } catch (U) {
      (K = ($ = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : $.error) == null || K.call($, (U == null ? void 0 : U.message) || "Alt görev güncellenemedi.");
    }
  }, X = () => W({ status: l.status >= 4 ? 1 : l.status + 1 }), ee = () => W({ priority: l.priority >= 4 ? 1 : l.priority + 1 }), q = () => {
    (l.description ?? "") !== b && W({ description: b || null });
  }, g = async () => {
    var I, $, K;
    const j = h.trim();
    if (j) {
      y("");
      try {
        await m.addItem(j);
      } catch (U) {
        (K = ($ = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : $.error) == null || K.call($, (U == null ? void 0 : U.message) || "Madde eklenemedi.");
      }
    }
  }, p = async () => {
    var I, $, K;
    const j = v.trim();
    if (j) {
      w("");
      try {
        await Promise.resolve(M.addComment(l.id, j)), await n.invalidateQueries({ queryKey: ["task-comments", t] });
      } catch (U) {
        (K = ($ = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : $.error) == null || K.call($, (U == null ? void 0 : U.message) || "Yorum gönderilemedi.");
      }
    }
  }, C = async () => {
    var j, I, $;
    if (window.confirm("Bu alt görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(M.delete(l.id)), o == null || o(l.id), s == null || s();
      } catch (K) {
        ($ = (I = (j = window == null ? void 0 : window.abp) == null ? void 0 : j.notify) == null ? void 0 : I.error) == null || $.call(I, (K == null ? void 0 : K.message) || "Alt görev silinemedi.");
      }
  }, k = "flex items-center justify-center h-[30px] w-[30px] rounded-lg text-text-tertiary cursor-pointer";
  return /* @__PURE__ */ e.jsxs(pt, { open: !0, onClose: s, label: `${l.code} alt görev detayı`, children: [
    /* @__PURE__ */ e.jsx(
      "div",
      {
        "data-apya-overlay": !0,
        className: "absolute inset-0 bg-surface-overlay animate-fade-in-fast",
        onClick: s,
        role: "presentation"
      }
    ),
    /* @__PURE__ */ e.jsxs(
      "aside",
      {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": `${l.code} alt görev detayı`,
        "data-apya-overlay": !0,
        className: "fixed top-0 right-0 bottom-0 z-modal flex flex-col w-full max-w-[520px] bg-surface-base border-l border-default shadow-xl animate-sheet-nudge",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3 px-5 pt-[18px] pb-3.5 border-b border-subtle shrink-0", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 min-w-0 text-[11.5px] text-text-tertiary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-diagram-project text-[11px]" }),
                /* @__PURE__ */ e.jsxs("span", { className: "truncate", children: [
                  a,
                  " · alt görev"
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Tam detayda aç",
                    onClick: () => r == null ? void 0 : r(l.id),
                    className: `${k} hover:bg-surface-hover hover:text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Alt görevi sil",
                    onClick: C,
                    className: `${k} hover:bg-negative-subtle hover:text-negative`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    title: "Kapat",
                    onClick: s,
                    className: `${k} hover:bg-surface-hover hover:text-text-primary`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[13px]" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[7px] flex-wrap", children: [
              /* @__PURE__ */ e.jsx("span", { className: "flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] border border-primary bg-primary-subtle text-primary font-mono text-[10.5px] font-bold tracking-[.04em]", children: l.code }),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: X,
                  title: "Durumu değiştir",
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold cursor-pointer ${F.bg} ${F.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${F.icon} text-[10px]` }),
                    F.label
                  ]
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: ee,
                  title: "Önceliği değiştir",
                  className: `flex items-center gap-1.5 h-6 px-[9px] rounded-[7px] text-[11.5px] font-bold cursor-pointer ${Y.bg} ${Y.fg}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${Y.icon} text-[10px]` }),
                    Y.label
                  ]
                }
              ),
              (l.tags ?? []).map((j) => /* @__PURE__ */ e.jsx("span", { className: "flex items-center h-6 px-[9px] rounded-[7px] border border-default bg-neutral-subtle text-text-secondary text-[11px] font-semibold", children: j.name }, j.id ?? j.name))
            ] }),
            /* @__PURE__ */ e.jsx("h2", { className: "m-0 text-[18px] font-extrabold tracking-[-.02em] leading-[1.3] text-text-primary", children: l.title }),
            /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 pt-1", children: [
              /* @__PURE__ */ e.jsx(qe, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] min-w-0", children: [
                /* @__PURE__ */ e.jsx(at, { name: l.assigneeName }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-semibold text-text-primary truncate", children: l.assigneeName || "Atanmamış" })
              ] }) }),
              /* @__PURE__ */ e.jsx(qe, { label: "Son tarih", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-[7px] h-[22px] text-[12.5px] font-semibold text-text-primary", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-[11px] text-text-tertiary" }),
                sr(l.dueDate)
              ] }) }),
              /* @__PURE__ */ e.jsx(qe, { label: "Süre", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center h-[22px] font-mono text-[12.5px] font-bold text-text-primary", children: [
                l.spentHours ?? 0,
                "s",
                /* @__PURE__ */ e.jsxs("span", { className: "font-medium text-text-tertiary", children: [
                  " / ",
                  l.estimatedHours != null ? `${l.estimatedHours}s` : "—"
                ] })
              ] }) }),
              /* @__PURE__ */ e.jsx(qe, { label: "İlerleme", children: /* @__PURE__ */ e.jsxs("span", { className: "flex flex-col gap-1.5 pt-[3px]", children: [
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[12.5px] font-bold text-text-primary", children: [
                  "%",
                  V
                ] }),
                /* @__PURE__ */ e.jsx("span", { className: "block h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("span", { className: "block h-full rounded-full bg-success", style: { width: `${V}%` } }) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1 px-5 py-2.5 border-b border-subtle shrink-0 overflow-x-auto custom-scrollbar", children: Xs.map((j) => {
            const I = c === j.code, $ = O[j.code] ?? 0;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => u(j.code),
                className: `flex shrink-0 items-center gap-[7px] h-8 px-3 rounded-[9px] text-[12.5px] whitespace-nowrap cursor-pointer ${I ? "bg-primary-subtle text-primary font-bold" : "text-text-secondary font-medium hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${j.icon} text-[11px] opacity-85` }),
                  /* @__PURE__ */ e.jsx("span", { children: j.title }),
                  $ > 0 && /* @__PURE__ */ e.jsx("span", { className: "flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-neutral-subtle text-text-tertiary text-[10px] font-extrabold", children: $ })
                ]
              },
              j.code
            );
          }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 overflow-y-auto custom-scrollbar px-5 py-[18px] bg-surface-raised", children: [
            c === "general" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Açıklama" }),
              /* @__PURE__ */ e.jsx(
                "textarea",
                {
                  rows: 7,
                  value: b,
                  onChange: (j) => f(j.target.value),
                  onBlur: q,
                  placeholder: "Bu alt görevin detayları…",
                  className: "w-full p-3 rounded-xl border border-default bg-surface-base text-text-primary text-[13px] leading-[1.65] resize-y focus:border-focus focus:shadow-focus focus:outline-none"
                }
              ),
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[9px] mt-1.5 p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-circle-info text-[12px] text-text-tertiary" }),
                /* @__PURE__ */ e.jsxs("span", { className: "text-[11.5px] leading-[1.5] text-text-secondary", children: [
                  "Alt görevler ana görevin sekme setini paylaşmaz; kontrol listesi, yorum ve dosya yeterlidir. Daha fazlası gerekiyorsa ",
                  /* @__PURE__ */ e.jsx("strong", { className: "font-bold text-text-primary", children: "Tam detayda aç" }),
                  "."
                ] })
              ] })
            ] }),
            c === "checklist" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[9px]", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: "Kontrol listesi" }),
                /* @__PURE__ */ e.jsxs("span", { className: "font-mono text-[11px] font-bold text-text-tertiary", children: [
                  G,
                  "/",
                  B.length
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "h-[5px] rounded-full bg-neutral-subtle overflow-hidden", children: /* @__PURE__ */ e.jsx("div", { className: "h-full rounded-full bg-success", style: { width: `${V}%` } }) }),
              /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-[3px] mt-1", children: [
                B.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "group flex items-center gap-[11px] px-[11px] py-[9px] rounded-[10px] border border-subtle bg-surface-base hover:border-default", children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Tamamlandı işaretle",
                      onClick: () => m.toggleItem(j.id),
                      className: `flex shrink-0 items-center justify-center h-[18px] w-[18px] p-0 rounded-[5px] border-[1.5px] text-white cursor-pointer ${j.isDone ? "bg-success border-success" : "bg-transparent border-strong"}`,
                      children: j.isDone && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-[9px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { className: `flex-1 min-w-0 text-[12.5px] font-semibold ${j.isDone ? "line-through text-text-tertiary" : "text-text-primary"}`, children: j.text }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      "aria-label": "Maddeyi sil",
                      onClick: () => m.removeItem(j.id),
                      className: "flex shrink-0 items-center justify-center h-6 w-6 rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[10px]" })
                    }
                  )
                ] }, j.id)),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "text",
                    value: h,
                    onChange: (j) => y(j.target.value),
                    onKeyDown: (j) => {
                      j.key === "Enter" && g();
                    },
                    placeholder: "Yeni madde yaz ve Enter'a bas…",
                    className: "h-9 mt-1 px-3 rounded-[10px] border border-dashed border-strong bg-transparent text-text-primary text-[12.5px] focus:border-solid focus:border-focus focus:bg-surface-base focus:shadow-focus focus:outline-none"
                  }
                )
              ] })
            ] }),
            c === "comments" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3.5", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex gap-[9px] items-start", children: [
                /* @__PURE__ */ e.jsx(at, { name: i, size: 30 }),
                /* @__PURE__ */ e.jsx(
                  "textarea",
                  {
                    rows: 2,
                    value: v,
                    onChange: (j) => w(j.target.value),
                    onKeyDown: (j) => {
                      j.key === "Enter" && !j.shiftKey && (j.preventDefault(), p());
                    },
                    placeholder: "Yorum yaz ve Enter'a bas…",
                    className: "flex-1 min-w-0 px-3 py-2.5 rounded-[11px] border border-default bg-surface-base text-text-primary text-[12.5px] leading-[1.6] resize-none focus:border-focus focus:shadow-focus focus:outline-none"
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: p,
                    "aria-label": "Yorumu gönder",
                    className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[10px] ${v.trim() ? "bg-primary text-white cursor-pointer hover:bg-primary-hover" : "bg-border-default text-text-tertiary cursor-not-allowed"}`,
                    children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paper-plane text-[11px]" })
                  }
                )
              ] }),
              z.length === 0 ? /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col items-center gap-[7px] py-7 rounded-xl border border-dashed border-default", children: [
                /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-comments text-xl text-text-tertiary" }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: "Henüz yorum yok" })
              ] }) : z.map((j) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2.5 items-start p-3 rounded-xl border border-subtle bg-surface-base", children: [
                /* @__PURE__ */ e.jsx(at, { name: j.authorName, size: 28 }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12px] font-bold text-text-primary", children: j.authorName }),
                    /* @__PURE__ */ e.jsx("span", { className: "font-mono text-[10px] text-text-tertiary", children: ar(j.creationTime) })
                  ] }),
                  /* @__PURE__ */ e.jsx("p", { className: "mt-1 mb-0 text-[12.5px] leading-[1.6] text-text-secondary whitespace-pre-wrap", children: j.text })
                ] })
              ] }, j.id))
            ] }),
            c === "files" && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2.5", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  ref: D,
                  type: "file",
                  className: "hidden",
                  onChange: (j) => {
                    var $;
                    const I = ($ = j.target.files) == null ? void 0 : $[0];
                    j.target.value = "", I && d.upload(I).catch((K) => {
                      var U, re, E;
                      return (E = (re = (U = window == null ? void 0 : window.abp) == null ? void 0 : U.notify) == null ? void 0 : re.error) == null ? void 0 : E.call(re, (K == null ? void 0 : K.message) || "Dosya yüklenemedi.");
                    });
                  }
                }
              ),
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    var j;
                    return (j = D.current) == null ? void 0 : j.click();
                  },
                  disabled: d.isUploading,
                  className: "flex flex-col items-center justify-center gap-[7px] p-6 rounded-[13px] border-2 border-dashed border-strong bg-surface-base cursor-pointer hover:border-focus hover:bg-primary-subtle disabled:opacity-60",
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${d.isUploading ? "fa-circle-notch fa-spin" : "fa-cloud-arrow-up"} text-xl text-text-tertiary` }),
                    /* @__PURE__ */ e.jsx("span", { className: "text-[12.5px] font-bold text-text-primary", children: d.isUploading ? "Yükleniyor…" : "Dosya ekle" })
                  ]
                }
              ),
              _.map((j) => {
                const I = er(j.fileName);
                return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[11px] px-3 py-[11px] rounded-xl border border-subtle bg-surface-base", children: [
                  /* @__PURE__ */ e.jsx("span", { className: `flex shrink-0 items-center justify-center h-[34px] w-[34px] rounded-[9px] ${I.bg} ${I.fg}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${I.icon} text-[13px]` }) }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ e.jsx("div", { className: "text-[12.5px] font-bold text-text-primary truncate", children: j.fileName }),
                    /* @__PURE__ */ e.jsxs("div", { className: "font-mono text-[10.5px] text-text-tertiary", children: [
                      tr(j.fileSize),
                      " · ",
                      j.uploaderName
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "a",
                    {
                      href: j.downloadUrl,
                      title: "İndir",
                      className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-primary-subtle hover:text-primary",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-download text-[11px]" })
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      title: "Sil",
                      onClick: () => d.remove(j.id).catch(($) => {
                        var K, U, re;
                        return (re = (U = (K = window == null ? void 0 : window.abp) == null ? void 0 : K.notify) == null ? void 0 : U.error) == null ? void 0 : re.call(U, ($ == null ? void 0 : $.message) || "Dosya silinemedi.");
                      }),
                      className: "flex shrink-0 items-center justify-center h-[26px] w-[26px] rounded-[7px] text-text-tertiary hover:bg-negative-subtle hover:text-negative cursor-pointer",
                      children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-trash-can text-[11px]" })
                    }
                  )
                ] }, j.id);
              })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-3 px-5 py-3 border-t border-subtle bg-surface-base shrink-0", children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => r == null ? void 0 : r(l.id),
                className: "flex items-center gap-2 h-[34px] px-3 rounded-[10px] border border-default bg-surface-base text-text-secondary text-[12.5px] font-semibold hover:bg-surface-hover hover:text-text-primary cursor-pointer",
                children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-up-right-from-square text-[10px]" }),
                  "Tam detayda aç"
                ]
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: s,
                className: "h-[34px] px-[18px] rounded-[10px] bg-primary text-white text-[12.5px] font-bold cursor-pointer hover:bg-primary-hover",
                children: "Tamam"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
const ba = "apya.taskDetail.tabOrder";
function nr() {
  try {
    const t = localStorage.getItem(ba);
    if (!t) return [];
    const a = JSON.parse(t);
    return Array.isArray(a) ? a.filter((s) => typeof s == "string") : [];
  } catch {
    return [];
  }
}
function ir(t) {
  try {
    localStorage.setItem(ba, JSON.stringify(t));
  } catch {
  }
}
function lr(t) {
  const [a, s] = x.useState(nr), [r, o] = x.useState(null), i = x.useMemo(() => {
    const d = new Map(t.map((u) => [u.code, u])), c = [];
    for (const u of a) {
      const b = d.get(u);
      b && (c.push(b), d.delete(u));
    }
    for (const u of t)
      d.has(u.code) && c.push(u);
    return c;
  }, [t, a]), n = x.useCallback((d) => {
    s((c) => {
      const u = r;
      if (!u || u === d) return c;
      const b = c.length ? c.slice() : i.map((y) => y.code), f = b.indexOf(u), h = b.indexOf(d);
      return f === -1 || h === -1 ? c : (b.splice(f, 1), b.splice(h, 0, u), b);
    });
  }, [r, i]), l = x.useCallback((d) => o(d), []), m = x.useCallback(() => {
    o(null), s((d) => {
      const c = d.length ? d : i.map((u) => u.code);
      return ir(c), c;
    });
  }, [i]);
  return { orderedTabs: i, draggingCode: r, handleDragStart: l, handleDragEnd: m, reorderTo: n };
}
function or() {
  var a, s, r;
  const t = (r = (s = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : s.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getProjectsLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function cr() {
  const t = ie({
    queryKey: ["task-detail", "projects-lookup"],
    queryFn: or,
    staleTime: 3e5,
    retry: !1
  }), a = t.data ?? [], s = a.map((o) => ({ value: o.id, label: o.name })), r = new Map(a.map((o) => [o.id, o.name]));
  return { options: s, nameById: r, isLoading: t.isLoading };
}
const _t = "apya.taskDetail.fullscreen", Q = {
  ok: (t) => {
    var a, s, r;
    return (r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.notify) == null ? void 0 : s.success) == null ? void 0 : r.call(s, t);
  },
  info: (t) => {
    var a, s, r;
    return (r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.notify) == null ? void 0 : s.info) == null ? void 0 : r.call(s, t);
  },
  err: (t) => {
    var a, s, r;
    return (r = (s = (a = window == null ? void 0 : window.abp) == null ? void 0 : a.notify) == null ? void 0 : s.error) == null ? void 0 : r.call(s, t);
  }
};
function dr(t) {
  return t.toLocaleUpperCase("tr-TR").replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || `PRJ-${Date.now().toString().slice(-6)}`;
}
function ha({ taskId: t, presentation: a = "modal", onClose: s, switchToTask: r }) {
  var ht, gt, yt, vt, jt, wt, Nt, kt;
  const [o, i] = x.useState(t), { data: n, isLoading: l, isError: m, refetch: d } = dt(o), c = le(), u = Xt(), b = sa(n), f = ra(), h = cr(), y = na(o), v = ut(o), [w, D] = x.useState("general"), [P, z] = x.useState(!1), [M, F] = x.useState(!1), [Y, B] = x.useState(!1), [G, V] = x.useState(null), [_, O] = x.useState(null), [Z, W] = x.useState(!1), [X, ee] = x.useState(!1), [q, g] = x.useState(() => {
    try {
      return localStorage.getItem(_t) === "true";
    } catch {
      return !1;
    }
  });
  aa(o);
  const [p, C] = x.useState(null);
  n != null && n.id && n.id !== p && (C(n.id), W(!!n.isFavorite), ee(!!n.isWatched)), x.useEffect(() => {
    b.isDirty ? u.markDirty() : u.markClean();
  });
  const k = x.useCallback(() => {
    ta(), s == null || s();
  }, [s]), S = x.useCallback(() => u.requestClose(k), [u, k]), H = x.useCallback(() => {
    g((N) => {
      const T = !N;
      try {
        localStorage.setItem(_t, String(T));
      } catch {
      }
      return T;
    });
  }, []), oe = x.useMemo(
    () => ua(y.assignedCodes),
    [y.assignedCodes]
  ), j = lr(oe), I = x.useMemo(() => {
    var N, T, L, ne, ue;
    return {
      subtasks: ((N = n == null ? void 0 : n.subTasks) == null ? void 0 : N.length) ?? 0,
      files: ((T = n == null ? void 0 : n.attachments) == null ? void 0 : T.length) ?? 0,
      dependencies: ((L = n == null ? void 0 : n.predecessorIds) == null ? void 0 : L.length) ?? 0,
      comments: ((ne = n == null ? void 0 : n.comments) == null ? void 0 : ne.length) ?? 0,
      checklist: ((ue = v.items) == null ? void 0 : ue.length) ?? 0
    };
  }, [n, v.items]), $ = Me.find((N) => N.code === w), K = v.items ?? [], U = K.filter((N) => N.isDone).length, re = K.length ? Math.round(U / K.length * 100) : 0, E = x.useCallback(async () => {
    if (!b.validate())
      return Q.err("Zorunlu alanları kontrol edin."), !1;
    z(!0);
    try {
      return await Promise.resolve(window.apya.platform.tasks.task.update(o, b.toUpdateDto())), await c.invalidateQueries({ queryKey: ["task-detail", o] }), se.emitResult(), F(!0), setTimeout(() => F(!1), 2e3), Q.ok("Görev başarıyla güncellendi."), !0;
    } catch (N) {
      return Q.err((N == null ? void 0 : N.message) || "Kaydedilemedi."), !1;
    } finally {
      z(!1);
    }
  }, [o, b, c]);
  x.useEffect(() => {
    const N = (T) => {
      if ((T.ctrlKey || T.metaKey) && T.key.toLowerCase() === "s") {
        T.preventDefault(), b.isDirty && !P && E();
        return;
      }
      if (T.key === "Escape") {
        if (G) {
          T.stopPropagation(), V(null);
          return;
        }
        Y && (T.stopPropagation(), B(!1));
      }
    };
    return window.addEventListener("keydown", N), () => window.removeEventListener("keydown", N);
  }, [E, b.isDirty, P, G, Y]);
  const A = () => {
    var N, T, L;
    return (L = (T = (N = window == null ? void 0 : window.apya) == null ? void 0 : N.platform) == null ? void 0 : T.tasks) == null ? void 0 : L.task;
  }, R = async () => {
    var T;
    const N = !Z;
    W(N);
    try {
      await Promise.resolve((T = A()) == null ? void 0 : T.toggleFavorite(o));
    } catch (L) {
      W(!N), Q.err((L == null ? void 0 : L.message) || "Favori güncellenemedi.");
    }
  }, te = () => {
    if (!o) return;
    const N = document.createElement("a");
    N.href = `/Tasks/Detail/${o}?handler=Pdf`, N.rel = "noopener", document.body.appendChild(N), N.click(), N.remove();
  }, J = async () => {
    var T;
    const N = !X;
    ee(N);
    try {
      await Promise.resolve((T = A()) == null ? void 0 : T.toggleWatch(o)), Q.info(N ? "Görev takip ediliyor." : "Takip bırakıldı.");
    } catch (L) {
      ee(!N), Q.err((L == null ? void 0 : L.message) || "Takip durumu güncellenemedi.");
    }
  }, je = async () => {
    var N, T;
    try {
      const L = await Promise.resolve((N = A()) == null ? void 0 : N.transfer(o, {
        mode: 2,
        // Copy
        targetProjectIds: n != null && n.projectId ? [n.projectId] : [],
        include: { subtasks: !0, checklist: !0, comments: !1, files: !0, keepAssignee: !0, keepLinks: !0, shiftDates: !1 }
      }));
      await c.invalidateQueries({ queryKey: ["task-detail"] }), Q.ok("Görev çoğaltıldı.");
      const ne = (T = L == null ? void 0 : L.createdTaskIds) == null ? void 0 : T[0];
      ne && i(ne);
    } catch (L) {
      Q.err((L == null ? void 0 : L.message) || "Görev çoğaltılamadı.");
    }
  }, de = async () => {
    var N;
    try {
      await Promise.resolve((N = A()) == null ? void 0 : N.updateStatus(o, 4)), await c.invalidateQueries({ queryKey: ["task-detail", o] }), Q.info("Görev arşivlendi (Tamamlandı).");
    } catch (T) {
      Q.err((T == null ? void 0 : T.message) || "Görev arşivlenemedi.");
    }
  }, ya = async () => {
    var N;
    if (window.confirm("Bu görev ve tüm alt görevleri kalıcı olarak silinecek. Devam edilsin mi?"))
      try {
        await Promise.resolve((N = A()) == null ? void 0 : N.delete(o)), Q.info("Görev silindi."), u.markClean(), k();
      } catch (T) {
        Q.err((T == null ? void 0 : T.message) || "Görev silinemedi.");
      }
  }, va = async (N) => {
    try {
      await y.addFeature(N), D(N), Q.ok("Özellik başarıyla eklendi.");
    } catch (T) {
      Q.err((T == null ? void 0 : T.message) || "Özellik eklenemedi.");
    }
  }, mt = async (N) => {
    try {
      await y.removeFeature(N), D("general"), Q.info("Özellik görevden kaldırıldı.");
    } catch (T) {
      Q.err((T == null ? void 0 : T.message) || "Özellik kaldırılamadı.");
    }
  }, ja = async (N) => {
    var ne, ue, ce, Ce, we, Fe, Ee;
    const T = ((Ce = (ce = (ue = (ne = window == null ? void 0 : window.apya) == null ? void 0 : ne.platform) == null ? void 0 : ue.application) == null ? void 0 : ce.projects) == null ? void 0 : Ce.project) ?? ((Ee = (Fe = (we = window == null ? void 0 : window.apya) == null ? void 0 : we.platform) == null ? void 0 : Fe.projects) == null ? void 0 : Ee.project);
    if (!(T != null && T.create)) throw new Error("Proje servisi yüklenmedi.");
    const L = await Promise.resolve(T.create({
      name: N,
      code: dr(N),
      currency: "TRY"
    }));
    return await c.invalidateQueries({ queryKey: ["task-detail", "projects-lookup"] }), Q.ok(`“${N}” projesi oluşturuldu.`), (L == null ? void 0 : L.id) ?? L;
  }, wa = async ({ mode: N, targetProjectIds: T, include: L }) => {
    var ne, ue;
    try {
      const ce = await Promise.resolve((ne = A()) == null ? void 0 : ne.transfer(o, {
        mode: N === "move" ? 1 : 2,
        targetProjectIds: T,
        include: L
      }));
      await c.invalidateQueries({ queryKey: ["task-detail", o] });
      const Ce = T.map((Fe) => {
        var Ee;
        return (Ee = h.options.find((ka) => ka.value === Fe)) == null ? void 0 : Ee.label;
      }).filter(Boolean), we = ((ue = ce == null ? void 0 : ce.createdTaskIds) == null ? void 0 : ue.length) ?? 0;
      Q.ok(N === "move" ? we ? `“${Ce[0]}” projesine taşındı, ${we} projeye kopyalandı.` : `Görev “${Ce[0]}” projesine taşındı.` : we > 1 ? `${we} projeye kopyalandı.` : `Kopya “${Ce[0]}” projesinde oluşturuldu.`), V(null);
    } catch (ce) {
      Q.err((ce == null ? void 0 : ce.message) || "Transfer tamamlanamadı.");
    }
  }, Na = w === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_330px] lt-1080:grid-cols-[minmax(0,1fr)] gap-5 items-start", children: [
    /* @__PURE__ */ e.jsx(
      Gs,
      {
        task: n,
        onFieldChange: b.setField,
        descriptionValue: b.values.description,
        checklist: v,
        currentUserName: ((gt = (ht = window == null ? void 0 : window.abp) == null ? void 0 : ht.currentUser) == null ? void 0 : gt.name) || ((vt = (yt = window == null ? void 0 : window.abp) == null ? void 0 : yt.currentUser) == null ? void 0 : vt.userName) || "Ben"
      }
    ),
    /* @__PURE__ */ e.jsx("div", { className: "w-full lt-1080:grid lt-1080:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lt-1080:gap-3.5", children: /* @__PURE__ */ e.jsx(zs, { task: n, nameById: f.nameById }) })
  ] }) : Hs(w) ? /* @__PURE__ */ e.jsx(
    qt,
    {
      code: w,
      onRemoveFeature: mt,
      onOpenPicker: () => B(!0),
      canRemove: !($ != null && $.isCore)
    }
  ) : /* @__PURE__ */ e.jsx(x.Suspense, { fallback: /* @__PURE__ */ e.jsx(fe, { className: "h-48 w-full" }), children: $ != null && $.component ? /* @__PURE__ */ e.jsx(
    $.component,
    {
      taskId: o,
      task: n,
      onOpenSubtask: O
    }
  ) : /* @__PURE__ */ e.jsx(
    qt,
    {
      code: w,
      onRemoveFeature: mt,
      onOpenPicker: () => B(!0),
      canRemove: !($ != null && $.isCore)
    }
  ) }), ft = l ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(fe, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(fe, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(fe, { className: "h-64 w-full" })
  ] }) : m ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(ae, { variant: "ghost", onClick: () => d(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col flex-1 min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      Ps,
      {
        task: n,
        presentation: a,
        onClose: S,
        isFullscreen: q,
        onToggleFullscreen: H,
        onFieldChange: b.setField,
        statusValue: b.values.status,
        priorityValue: b.values.priority,
        titleValue: n == null ? void 0 : n.title,
        isPrivateValue: b.values.isPrivate,
        isFavorite: Z,
        onToggleFavorite: R,
        isWatched: X,
        onToggleWatch: J,
        onDuplicate: je,
        onArchive: de,
        onDelete: ya,
        onOpenTransfer: (N) => V({ mode: N }),
        onSaveAsTemplate: () => Q.info("Şablon olarak kaydetme yakında."),
        onConvertToSubtask: () => Q.info("Alt göreve dönüştürme yakında."),
        onExportPdf: te
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        Is,
        {
          task: n,
          assigneeOptions: f.options,
          projectOptions: h.options,
          onFieldChange: b.setField,
          statusValue: b.values.status,
          assigneeValue: b.values.assigneeId,
          projectValue: b.values.projectId,
          dueDateValue: b.values.dueDate,
          startDateValue: b.values.startDate,
          tagsValue: b.values.tagNames,
          progressPercent: re,
          progressNote: `${U}/${K.length} madde`,
          onOpenTransfer: (N) => V({ mode: N })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-stretch min-w-0", children: [
        a === "page" && /* @__PURE__ */ e.jsx(
          Ls,
          {
            activeTab: w,
            onTabChange: D,
            orderedTabs: j.orderedTabs,
            draggingCode: j.draggingCode,
            onDragStart: j.handleDragStart,
            onDragEnd: j.handleDragEnd,
            onReorderTo: j.reorderTo,
            onReorderDrop: () => Q.info("Sekme sırası güncellendi."),
            onOpenPicker: () => B(!0),
            counts: I
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-w-0 flex-1", children: [
          /* @__PURE__ */ e.jsx("div", { className: a === "page" ? "gte-861:hidden" : "", children: /* @__PURE__ */ e.jsx(
            As,
            {
              activeTab: w,
              onTabChange: D,
              orderedTabs: j.orderedTabs,
              draggingCode: j.draggingCode,
              onDragStart: j.handleDragStart,
              onDragEnd: j.handleDragEnd,
              onReorderTo: j.reorderTo,
              onReorderDrop: () => Q.info("Sekme sırası güncellendi."),
              onOpenPicker: () => B(!0),
              counts: I,
              isDirty: b.isDirty
            }
          ) }),
          /* @__PURE__ */ e.jsx("div", { className: "flex-1 min-h-[420px] px-6 py-[22px] lt-860:px-4 bg-surface-raised", children: Na })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx(
      Os,
      {
        lastSavedAt: n == null ? void 0 : n.lastModificationTime,
        isDirty: b.isDirty,
        isSaving: P,
        justSaved: M,
        onCancel: S,
        onSave: E
      }
    )
  ] }), bt = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      Qs,
      {
        open: Y,
        onClose: () => B(!1),
        assignedCodes: y.assignedCodes,
        onAddFeature: va,
        onGoToTab: D
      }
    ),
    /* @__PURE__ */ e.jsx(
      Js,
      {
        open: !!G,
        mode: (G == null ? void 0 : G.mode) ?? "move",
        onClose: () => V(null),
        onConfirm: wa,
        projectOptions: h.options,
        currentProjectId: b.values.projectId,
        counts: I,
        onCreateProject: ja
      }
    ),
    _ && /* @__PURE__ */ e.jsx(
      rr,
      {
        subtaskId: _,
        parentCode: n == null ? void 0 : n.code,
        onClose: () => O(null),
        onOpenFull: (N) => {
          O(null), (r ?? i)(N);
        },
        onDeleted: () => c.invalidateQueries({ queryKey: ["task-detail", o] }),
        currentUserName: ((wt = (jt = window == null ? void 0 : window.abp) == null ? void 0 : jt.currentUser) == null ? void 0 : wt.name) || ((kt = (Nt = window == null ? void 0 : window.abp) == null ? void 0 : Nt.currentUser) == null ? void 0 : kt.userName) || "Ben"
      }
    )
  ] });
  return a === "page" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col w-full min-h-[calc(100vh-54px)] border-y border-subtle bg-surface-base", children: ft }),
    bt
  ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(Qt, { open: !0, onOpenChange: (N) => {
      N || S();
    }, children: /* @__PURE__ */ e.jsx(
      Zt,
      {
        title: n != null && n.title ? `Görev Detayı: ${n.title}` : "Görev Detayı",
        fullscreen: q,
        className: q ? "p-0 rounded-xl border border-default shadow-xl" : "w-[min(96vw,1180px)] max-w-none p-0 rounded-[18px] border border-default shadow-xl",
        onInteractOutside: (N) => {
          var T, L;
          N.preventDefault(), !(Y || G || _) && ((L = (T = N.target) == null ? void 0 : T.closest) != null && L.call(T, "[data-apya-overlay]") || S());
        },
        onEscapeKeyDown: (N) => {
          if (Y || G || _) {
            N.preventDefault();
            return;
          }
          N.preventDefault(), S();
        },
        children: ft
      }
    ) }),
    bt
  ] });
}
function xr() {
  var a;
  const t = x.useSyncExternalStore(
    se.subscribe,
    se.getSnapshot,
    () => null
  );
  return t ? (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Ue, { children: /* @__PURE__ */ e.jsx(
    ha,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        se.close(), se.emitResult();
      }
    },
    t
  ) }) : /* @__PURE__ */ e.jsx(Ue, { children: /* @__PURE__ */ e.jsx(
    pa,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        se.close(), se.emitResult();
      }
    },
    t
  ) }) : null;
}
function ga() {
  var s;
  try {
    const r = new URLSearchParams(window.location.search).get("taskui");
    if (r === "v1" || r === "v2" || r === "v3") return r;
  } catch {
  }
  const t = document.getElementById("task-detail-island"), a = (s = t == null ? void 0 : t.dataset) == null ? void 0 : s.taskui;
  return a === "v1" || a === "v2" ? a : "v3";
}
function ur() {
  return ga() === "v2";
}
function pr() {
  return ga() === "v3";
}
window.apya = window.apya || {};
window.apya.taskDetailV3Enabled = pr();
window.apya.taskDetailV2Enabled = ur() && !window.apya.taskDetailV3Enabled;
const Ut = {
  open: (t) => {
    se.open(t);
  },
  close: () => se.close(),
  onResult: (t) => se.onResult(t)
};
typeof window.apya._taskDetailFlush == "function" ? window.apya._taskDetailFlush(Ut) : window.apya.taskDetail = Ut;
function Ht() {
  let t = document.getElementById("task-detail-island");
  if (t || (t = document.createElement("div"), t.id = "task-detail-island", document.body.appendChild(t)), t._reactRoot || (t._reactRoot = Vt(t), t._reactRoot.render(/* @__PURE__ */ e.jsx(xr, {}))), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled) {
    const a = ea();
    a && se.open(a);
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Ht) : Ht();
function mr({ taskId: t }) {
  var s;
  const a = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(Ue, { children: /* @__PURE__ */ e.jsx(
    ha,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) }) : /* @__PURE__ */ e.jsx(Ue, { children: /* @__PURE__ */ e.jsx(
    pa,
    {
      taskId: t,
      presentation: "page",
      onClose: a
    }
  ) });
}
const st = document.getElementById("task-detail-page-island");
if (st) {
  const t = st.getAttribute("data-task-id");
  t && Vt(st).render(/* @__PURE__ */ e.jsx(mr, { taskId: t }));
}
