import { j as e, r as x, d as ee, b as Ae } from "./react-vendor.js";
/* empty css      */
import { a as de } from "./QueryProvider.js";
import { u as ie, a as J, b as H } from "./query-vendor.js";
import { D as Le, l as Fe, e as Q, B as j, I as Z, S as q } from "./Dialog.js";
import { C as it } from "./Combobox.js";
import { r as lt } from "./httpClient.js";
import { R as he, T as be, P as ye, C as ge, A as Be } from "./ui-vendor.js";
function nt({
  open: t,
  onRequestClose: s,
  fullscreen: a,
  title: r,
  header: i,
  footer: l,
  children: o
}) {
  return /* @__PURE__ */ e.jsx(
    Le,
    {
      open: t,
      onOpenChange: (d) => {
        d || s();
      },
      children: /* @__PURE__ */ e.jsx(
        Fe,
        {
          title: r,
          fullscreen: a,
          onInteractOutside: (d) => {
            d.preventDefault(), s();
          },
          onEscapeKeyDown: (d) => {
            d.preventDefault(), s();
          },
          children: /* @__PURE__ */ e.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
            i,
            /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: o }),
            l
          ] })
        }
      )
    }
  );
}
function ot({ title: t, header: s, footer: a, children: r }) {
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "flex h-full min-h-[calc(100vh-120px)] flex-col rounded-xl border border-default bg-surface-elevated shadow-sm",
      "aria-label": t,
      children: /* @__PURE__ */ e.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_1fr_auto]", children: [
        s,
        /* @__PURE__ */ e.jsx("div", { className: "min-h-0 overflow-y-auto overscroll-contain px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: r }),
        a
      ] })
    }
  );
}
function ct({ isPrivate: t }) {
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
const re = {
  0: { text: "İptal", variant: "neutral" },
  1: { text: "Yapılacak", variant: "neutral" },
  2: { text: "Sürüyor", variant: "warning" },
  3: { text: "Testte", variant: "brand" },
  4: { text: "Tamamlandı", variant: "positive" }
}, pe = {
  1: { text: "Düşük", variant: "positive" },
  2: { text: "Orta", variant: "neutral" },
  3: { text: "Yüksek", variant: "warning" },
  4: { text: "Kritik", variant: "negative" }
};
function dt({
  task: t,
  canDelete: s,
  onClose: a,
  onDelete: r,
  onToggleFullscreen: i,
  fullscreen: l = !1
}) {
  const [o, d] = x.useState(!1), c = x.useRef(null);
  x.useEffect(() => {
    if (!o) return;
    const y = (f) => {
      c.current && !c.current.contains(f.target) && d(!1);
    }, n = (f) => {
      f.key === "Escape" && d(!1);
    };
    return document.addEventListener("mousedown", y), document.addEventListener("keydown", n), () => {
      document.removeEventListener("mousedown", y), document.removeEventListener("keydown", n);
    };
  }, [o]);
  const u = re[t == null ? void 0 : t.status] ?? re[1], p = pe[t == null ? void 0 : t.priority] ?? pe[2], m = () => {
    t != null && t.id && window.open(`/Tasks/Detail/${t.id}`, "_blank"), d(!1);
  }, h = () => {
    var n, f, g, w;
    const y = `${window.location.origin}/Tasks/Detail/${t.id}`;
    (n = navigator.clipboard) == null || n.writeText(y), (w = (g = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : g.info) == null || w.call(g, "Bağlantı kopyalandı."), d(!1);
  };
  return /* @__PURE__ */ e.jsx("header", { className: "flex-none border-b border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-[13px] text-text-tertiary", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-list-check", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { children: "Görev" })
      ] }),
      /* @__PURE__ */ e.jsx("h2", { className: "mt-1 truncate text-xl font-semibold text-text-primary", children: t == null ? void 0 : t.title }),
      /* @__PURE__ */ e.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ e.jsx(Q, { variant: u.variant, children: u.text }),
        /* @__PURE__ */ e.jsx(Q, { variant: p.variant, children: p.text }),
        /* @__PURE__ */ e.jsx(ct, { isPrivate: t == null ? void 0 : t.isPrivate })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-1", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": l ? "Küçült" : "Tam ekrana büyüt",
          onClick: i,
          className: "mobile:hidden grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: l ? "fa fa-compress" : "fa fa-expand", "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: c, children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Görev işlemleri",
            "aria-haspopup": "menu",
            "aria-expanded": o,
            onClick: () => d((y) => !y),
            className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
            children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-ellipsis", "aria-hidden": "true" })
          }
        ),
        o && /* @__PURE__ */ e.jsxs(
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
                  onClick: m,
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
                  onClick: h,
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
              s && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsx("div", { className: "my-1 h-px bg-border-subtle" }),
                /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    role: "menuitem",
                    onClick: () => {
                      d(!1), r();
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
          onClick: a,
          className: "grid h-9 w-9 place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-xmark", "aria-hidden": "true" })
        }
      )
    ] })
  ] }) });
}
const xt = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : null;
function ut({ lastSavedAt: t, isDirty: s, isSaving: a, onCancel: r, onSave: i }) {
  const l = xt(t);
  return /* @__PURE__ */ e.jsx("footer", { className: "flex-none border-t border-subtle px-[var(--apya-space-5)] py-[var(--apya-space-3)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("span", { className: "truncate text-[13px] text-text-tertiary", children: l ? `Son kayıt: ${l}` : " " }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-none items-center gap-2", children: [
      /* @__PURE__ */ e.jsx(j, { variant: "secondary", onClick: r, disabled: a, children: "Vazgeç" }),
      /* @__PURE__ */ e.jsx(
        j,
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
const we = "block h-10 w-full rounded-md border border-default bg-surface-base px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus", mt = "block w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-focus";
function Y({ label: t, htmlFor: s, error: a, children: r }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("label", { htmlFor: s, className: "mb-1 block text-[13px] font-medium text-text-secondary", children: t }),
    r,
    a && /* @__PURE__ */ e.jsx("p", { className: "mt-1 text-[13px] text-text-negative", children: a })
  ] });
}
function pt({ value: t, onChange: s }) {
  const [a, r] = x.useState(""), i = () => {
    const l = a.trim();
    l && !t.includes(l) && s([...t, l]), r("");
  };
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("div", { className: "mb-1.5 flex flex-wrap gap-1.5", children: t.map((l) => /* @__PURE__ */ e.jsxs(Q, { variant: "neutral", children: [
      l,
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          "aria-label": `${l} etiketini kaldır`,
          onClick: () => s(t.filter((o) => o !== l)),
          className: "ml-1",
          children: "×"
        }
      )
    ] }, l)) }),
    /* @__PURE__ */ e.jsx(
      Z,
      {
        value: a,
        onChange: (l) => r(l.target.value),
        onKeyDown: (l) => {
          l.key === "Enter" || l.key === "," ? (l.preventDefault(), i()) : l.key === "Backspace" && !a && t.length && s(t.slice(0, -1));
        },
        onBlur: i,
        placeholder: "Etiket yazıp Enter'a basın"
      }
    )
  ] });
}
function ft({
  values: t,
  errors: s,
  onFieldChange: a,
  assigneeOptions: r = [],
  isLoadingAssignees: i = !1
}) {
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(Y, { label: "Başlık", htmlFor: "task-title", error: s.title, children: /* @__PURE__ */ e.jsx(
      Z,
      {
        id: "task-title",
        value: t.title,
        onChange: (l) => a("title", l.target.value),
        invalid: !!s.title
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(Y, { label: "Durum", htmlFor: "task-status", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-status",
          value: t.status,
          onChange: (l) => a("status", Number(l.target.value)),
          className: we,
          children: Object.entries(re).map(([l, o]) => /* @__PURE__ */ e.jsx("option", { value: l, children: o.text }, l))
        }
      ) }),
      /* @__PURE__ */ e.jsx(Y, { label: "Öncelik", htmlFor: "task-priority", children: /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "task-priority",
          value: t.priority,
          onChange: (l) => a("priority", Number(l.target.value)),
          className: we,
          children: Object.entries(pe).map(([l, o]) => /* @__PURE__ */ e.jsx("option", { value: l, children: o.text }, l))
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(Y, { label: "Atanan", htmlFor: "task-assignee", children: /* @__PURE__ */ e.jsx(
      it,
      {
        id: "task-assignee",
        options: r,
        value: t.assigneeId,
        onChange: (l) => a("assigneeId", l),
        placeholder: i ? "Yükleniyor…" : "Atanacak kişi seç",
        disabled: i
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 gap-[var(--apya-space-4)]", children: [
      /* @__PURE__ */ e.jsx(Y, { label: "Başlangıç Tarihi", htmlFor: "task-start", error: s.startDate, children: /* @__PURE__ */ e.jsx(
        Z,
        {
          id: "task-start",
          type: "date",
          value: t.startDate,
          onChange: (l) => a("startDate", l.target.value),
          invalid: !!s.startDate
        }
      ) }),
      /* @__PURE__ */ e.jsx(Y, { label: "Son Tarih", htmlFor: "task-due", error: s.dueDate, children: /* @__PURE__ */ e.jsx(
        Z,
        {
          id: "task-due",
          type: "date",
          value: t.dueDate,
          onChange: (l) => a("dueDate", l.target.value),
          invalid: !!s.dueDate
        }
      ) })
    ] }),
    /* @__PURE__ */ e.jsx(Y, { label: "Etiketler", htmlFor: "task-tags-input", children: /* @__PURE__ */ e.jsx(pt, { value: t.tagNames, onChange: (l) => a("tagNames", l) }) }),
    /* @__PURE__ */ e.jsx(Y, { label: "Açıklama", htmlFor: "task-description", children: /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: "task-description",
        rows: 5,
        value: t.description,
        onChange: (l) => a("description", l.target.value),
        className: mt
      }
    ) })
  ] });
}
const Ne = (t) => t ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(t)) : "—";
function se({ label: t, value: s }) {
  return /* @__PURE__ */ e.jsxs("div", { children: [
    /* @__PURE__ */ e.jsx("dt", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("dd", { className: "mt-0.5 text-text-primary", children: s ?? "—" })
  ] });
}
function ht({ task: t, creatorName: s, lastModifierName: a }) {
  return /* @__PURE__ */ e.jsxs("aside", { className: "space-y-[var(--apya-space-4)] rounded-[var(--apya-radius-lg)] border border-subtle bg-surface-sunken p-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx("h3", { className: "text-[13px] font-semibold text-text-secondary", children: "Detaylar" }),
    /* @__PURE__ */ e.jsxs("dl", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ e.jsx(se, { label: "Oluşturan", value: s }),
      /* @__PURE__ */ e.jsx(se, { label: "Oluşturulma zamanı", value: Ne(t.creationTime) }),
      /* @__PURE__ */ e.jsx(se, { label: "Güncelleyen", value: a }),
      /* @__PURE__ */ e.jsx(se, { label: "Son güncelleme zamanı", value: Ne(t.lastModificationTime) }),
      /* @__PURE__ */ e.jsx(se, { label: "Proje", value: t.projectName })
    ] })
  ] });
}
const bt = "group relative flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus", yt = "border-brand-500 text-text-primary";
function gt({ tabs: t, activeCode: s, onSelect: a, onOpenPicker: r, pickerOpen: i }) {
  const l = x.useRef(/* @__PURE__ */ new Map()), o = (c) => {
    var u;
    a(c.code), (u = l.current.get(c.code)) == null || u.focus();
  }, d = (c, u) => {
    c.key === "ArrowRight" ? (c.preventDefault(), o(t[(u + 1) % t.length])) : c.key === "ArrowLeft" ? (c.preventDefault(), o(t[(u - 1 + t.length) % t.length])) : c.key === "Home" ? (c.preventDefault(), o(t[0])) : c.key === "End" && (c.preventDefault(), o(t[t.length - 1]));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center border-b border-subtle", children: [
    /* @__PURE__ */ e.jsx("div", { role: "tablist", "aria-label": "Görev özellikleri", className: "flex min-w-0 flex-1 overflow-x-auto", children: t.map((c, u) => {
      const p = c.code === s;
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          ref: (m) => {
            m ? l.current.set(c.code, m) : l.current.delete(c.code);
          },
          type: "button",
          role: "tab",
          id: `task-tab-${c.code}`,
          "aria-selected": p,
          "aria-controls": "task-feature-tabpanel",
          tabIndex: p ? 0 : -1,
          onClick: () => a(c.code),
          onKeyDown: (m) => d(m, u),
          className: `${bt} ${p ? yt : ""}`,
          children: [
            /* @__PURE__ */ e.jsx("i", { className: `fa ${c.icon}`, "aria-hidden": "true" }),
            c.title
          ]
        },
        c.code
      );
    }) }),
    /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        "aria-label": "Özellik ekle",
        "aria-haspopup": "dialog",
        "aria-expanded": i,
        onClick: r,
        className: "mx-1 grid h-8 w-8 flex-none place-items-center rounded-[var(--apya-radius-md)] text-text-secondary hover:bg-surface-raised hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa fa-plus", "aria-hidden": "true" })
      }
    )
  ] });
}
const vt = {
  gorev: "Görev",
  iletisim: "İletişim",
  gecmis: "Geçmiş",
  finans: "Finans",
  ileri: "İleri Özellikler"
};
function jt({ entries: t, onAdd: s, onRemove: a, busyCode: r }) {
  const [i, l] = x.useState(""), o = x.useMemo(() => {
    const d = i.trim().toLocaleLowerCase("tr-TR"), c = d ? t.filter((p) => p.title.toLocaleLowerCase("tr-TR").includes(d)) : t, u = /* @__PURE__ */ new Map();
    return c.forEach((p) => {
      const m = u.get(p.category) ?? [];
      m.push(p), u.set(p.category, m);
    }), u;
  }, [t, i]);
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      role: "dialog",
      "aria-label": "Özellik ekle",
      className: "absolute right-0 top-full z-popover mt-1 w-72 rounded-[var(--apya-radius-lg)] border border-default bg-surface-elevated p-2 shadow-xl",
      children: [
        /* @__PURE__ */ e.jsx(
          Z,
          {
            autoFocus: !0,
            value: i,
            onChange: (d) => l(d.target.value),
            placeholder: "Özellik ara…",
            "aria-label": "Özellik ara"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "mt-2 max-h-80 overflow-y-auto", children: [
          o.size === 0 && /* @__PURE__ */ e.jsx("p", { className: "px-2 py-3 text-sm text-text-tertiary", children: "Sonuç bulunamadı." }),
          [...o.entries()].map(([d, c]) => /* @__PURE__ */ e.jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ e.jsx("p", { className: "px-2 py-1 text-[11px] font-semibold uppercase text-text-tertiary", children: vt[d] ?? d }),
            c.map((u) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-raised", children: [
              /* @__PURE__ */ e.jsx("i", { className: `fa ${u.icon} w-4 text-text-tertiary`, "aria-hidden": "true" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex-1 truncate text-sm text-text-primary", children: u.title }),
              !u.implemented && /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary", children: "Yakında" }),
              u.implemented && !u.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === u.code,
                  onClick: () => s(u.code),
                  className: "text-[13px] font-medium text-brand-700 hover:underline disabled:opacity-50",
                  children: "Ekle"
                }
              ),
              u.implemented && u.isAssigned && /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  disabled: r === u.code,
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
function wt({ trail: t = [], current: s, onNavigate: a }) {
  return t.length === 0 ? null : /* @__PURE__ */ e.jsxs("nav", { "aria-label": "Görev gezinme yolu", className: "flex items-center gap-1.5 text-sm text-text-secondary", children: [
    t.map((r) => /* @__PURE__ */ e.jsxs(ee.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => a == null ? void 0 : a(r.id),
          className: "hover:underline hover:text-text-primary",
          children: r.title
        }
      ),
      /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "/" })
    ] }, r.id)),
    /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary", children: s.title })
  ] });
}
function Nt(t) {
  var a, r, i;
  const s = (i = (r = (a = window == null ? void 0 : window.apya) == null ? void 0 : a.platform) == null ? void 0 : r.tasks) == null ? void 0 : i.task;
  return s ? Promise.resolve(s.get(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ie(t) {
  return ie({
    queryKey: ["task-detail", t],
    queryFn: () => Nt(t),
    enabled: !!t,
    staleTime: 3e4,
    /* retry:1 önceden ~1s backoff'la hata state'ini geciktiriyordu (izin/tenant
       hatalarında retry hiçbir şeyi düzeltmez, yalnız kullanıcıyı bekletir). */
    retry: !1
  });
}
function xe(t) {
  var s, a, r;
  return !!((r = (a = (s = window == null ? void 0 : window.abp) == null ? void 0 : s.auth) == null ? void 0 : a.isGranted) != null && r.call(a, t));
}
function Re() {
  const [t, s] = x.useState(!1), [a, r] = x.useState(!1), i = x.useRef(null), l = x.useCallback(() => s(!0), []), o = x.useCallback(() => s(!1), []);
  x.useEffect(() => {
    if (!t) return;
    const u = (p) => {
      p.preventDefault(), p.returnValue = "";
    };
    return window.addEventListener("beforeunload", u), () => window.removeEventListener("beforeunload", u);
  }, [t]);
  const d = x.useCallback((u) => {
    if (!t) {
      u == null || u();
      return;
    }
    i.current = u ?? null, r(!0);
  }, [t]), c = x.useCallback((u) => {
    const p = i.current;
    return r(!1), i.current = null, u === "discard" && (s(!1), p == null || p()), u === "save" ? p : null;
  }, []);
  return { isDirty: t, markDirty: l, markClean: o, requestClose: d, pendingClose: a, resolvePendingClose: c };
}
const kt = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, ve = "task";
function Pe() {
  if (typeof window > "u") return null;
  const t = new URLSearchParams(window.location.search).get(ve);
  return t && kt.test(t) ? t : null;
}
function Ge() {
  if (typeof window > "u") return;
  const t = new URL(window.location.href);
  t.searchParams.delete(ve), window.history.replaceState(null, "", t.pathname + t.search + t.hash);
}
function Ke(t, s) {
  const a = x.useRef(s);
  a.current = s, x.useEffect(() => {
    if (!t || Pe() === t) return;
    const r = new URL(window.location.href);
    r.searchParams.set(ve, t), window.history.pushState({ apyaTask: t }, "", r.pathname + r.search + r.hash);
  }, [t]), x.useEffect(() => {
    const r = () => {
      var i;
      (i = a.current) == null || i.call(a);
    };
    return window.addEventListener("popstate", r), () => window.removeEventListener("popstate", r);
  }, []);
}
const Ct = {
  title: "",
  description: "",
  startDate: "",
  dueDate: "",
  status: 1,
  priority: 2,
  assigneeId: null,
  tagNames: []
};
function Tt(t) {
  return t ? {
    title: t.title ?? "",
    description: t.description ?? "",
    startDate: t.startDate ? t.startDate.slice(0, 10) : "",
    dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
    status: t.status ?? 1,
    priority: t.priority ?? 2,
    assigneeId: t.assigneeId ?? null,
    tagNames: (t.tags ?? []).map((s) => s.name)
  } : Ct;
}
function Me(t) {
  const [s, a] = x.useState(t == null ? void 0 : t.id), r = x.useMemo(() => Tt(t), [t]), [i, l] = x.useState(r), [o, d] = x.useState({});
  (t == null ? void 0 : t.id) !== s && (a(t == null ? void 0 : t.id), l(r), d({}));
  const c = x.useCallback((y, n) => {
    l((f) => ({ ...f, [y]: n }));
  }, []), u = x.useMemo(
    () => JSON.stringify(i) !== JSON.stringify(r),
    [i, r]
  ), p = x.useCallback(() => {
    const y = {};
    return i.title.trim() || (y.title = "Başlık zorunlu."), i.startDate || (y.startDate = "Başlangıç tarihi zorunlu."), i.dueDate && i.startDate && i.dueDate < i.startDate && (y.dueDate = "Bitiş tarihi başlangıçtan önce olamaz."), d(y), Object.keys(y).length === 0;
  }, [i]), m = x.useCallback(() => ({
    title: i.title.trim(),
    description: i.description || null,
    startDate: i.startDate,
    dueDate: i.dueDate || null,
    status: i.status,
    priority: i.priority,
    assigneeId: i.assigneeId,
    boardColumnId: (t == null ? void 0 : t.boardColumnId) ?? null,
    projectId: (t == null ? void 0 : t.projectId) ?? null,
    parentTaskId: (t == null ? void 0 : t.parentTaskId) ?? null,
    isPrivate: !!(t != null && t.isPrivate),
    predecessorIds: (t == null ? void 0 : t.predecessorIds) ?? [],
    tagNames: i.tagNames
  }), [i, t]), h = x.useCallback(() => {
    l(r), d({});
  }, [r]);
  return { values: i, setField: c, isDirty: u, errors: o, validate: p, toUpdateDto: m, reset: h };
}
function ke(t) {
  return [t.name, t.surname].filter(Boolean).join(" ") || t.userName;
}
function Dt() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t ? Promise.resolve(t.getUsersLookup()) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Ye() {
  var i;
  const t = ie({
    queryKey: ["task-detail", "users-lookup"],
    queryFn: Dt,
    staleTime: 3e5,
    retry: !1
  }), s = ((i = t.data) == null ? void 0 : i.items) ?? [], a = s.map((l) => ({ value: l.id, label: ke(l) })), r = new Map(s.map((l) => [l.id, ke(l)]));
  return { options: a, nameById: r, isLoading: t.isLoading };
}
function fe() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function St(t) {
  const s = fe();
  return s ? Promise.resolve(s.getFeatureAssignments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Oe(t) {
  const s = J(), a = ["task-features", t], r = ie({
    queryKey: a,
    queryFn: () => St(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), l = H({
    mutationFn: (d) => Promise.resolve(fe().addFeature(t, d)),
    onSuccess: i
  }), o = H({
    mutationFn: (d) => Promise.resolve(fe().removeFeature(t, d)),
    onSuccess: i
  });
  return {
    assignedCodes: r.data ?? [],
    isLoading: r.isLoading,
    addFeature: l.mutateAsync,
    removeFeature: o.mutateAsync,
    mutatingCode: l.variables ?? o.variables ?? null,
    isMutating: l.isPending || o.isPending
  };
}
function Et({ taskId: t, task: s, onOpenSubtask: a }) {
  const [r, i] = x.useState(""), [l, o] = x.useState(!1), [d, c] = x.useState(null), u = J(), p = (s == null ? void 0 : s.subTasks) ?? [], m = () => u.invalidateQueries({ queryKey: ["task-detail", t] }), h = async () => {
    var f, g, w;
    const n = r.trim();
    if (n) {
      o(!0);
      try {
        await Promise.resolve(window.apya.platform.tasks.task.create({
          title: n,
          startDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          parentTaskId: t,
          projectId: s == null ? void 0 : s.projectId
        })), i(""), await m();
      } catch (C) {
        (w = (g = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : g.error) == null || w.call(g, (C == null ? void 0 : C.message) || "Alt görev eklenemedi.");
      } finally {
        o(!1);
      }
    }
  }, y = async (n) => {
    var f, g, w;
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(n)), await m();
    } catch (C) {
      (w = (g = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : g.error) == null || w.call(g, (C == null ? void 0 : C.message) || "Alt görev silinemedi.");
    } finally {
      c(null);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        Z,
        {
          value: r,
          onChange: (n) => i(n.target.value),
          onKeyDown: (n) => {
            n.key === "Enter" && h();
          },
          placeholder: "Yeni alt görev başlığı",
          disabled: l
        }
      ),
      /* @__PURE__ */ e.jsx(j, { variant: "secondary", onClick: h, disabled: l || !r.trim(), children: "Alt Görev Ekle" })
    ] }),
    p.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz alt görev yok." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: p.map((n) => {
      var f, g;
      return /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => a == null ? void 0 : a(n.id, n.title),
            className: "text-left text-sm font-medium text-text-primary hover:underline",
            children: n.title
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx(Q, { variant: ((f = re[n.status]) == null ? void 0 : f.variant) ?? "neutral", children: ((g = re[n.status]) == null ? void 0 : g.text) ?? n.status }),
          d === n.id ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary", children: "Emin misiniz?" }),
            /* @__PURE__ */ e.jsx(j, { variant: "destructive", onClick: () => y(n.id), children: "Evet, sil" }),
            /* @__PURE__ */ e.jsx(j, { variant: "ghost", onClick: () => c(null), children: "Vazgeç" })
          ] }) : /* @__PURE__ */ e.jsx(j, { variant: "ghost", onClick: () => c(n.id), "aria-label": `${n.title} alt görevini sil`, children: "Sil" })
        ] })
      ] }, n.id);
    }) })
  ] });
}
function $e() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function zt(t) {
  const s = $e();
  return s ? Promise.resolve(s.getAttachments(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
async function At(t, s) {
  const a = new FormData();
  a.append("file", s);
  const r = {}, i = lt();
  i && (r.RequestVerificationToken = i);
  const l = await fetch(`/api/tasks/attachments/upload/${t}`, {
    method: "POST",
    credentials: "include",
    headers: r,
    body: a
  });
  let o = null;
  try {
    o = await l.json();
  } catch {
  }
  if (!l.ok || (o == null ? void 0 : o.success) === !1)
    throw new Error((o == null ? void 0 : o.error) || "Dosya yüklenemedi.");
  return o;
}
function Lt(t) {
  const s = J(), a = ["task-attachments", t], r = ie({
    queryKey: a,
    queryFn: () => zt(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), l = H({
    mutationFn: (d) => At(t, d),
    onSuccess: i
  }), o = H({
    mutationFn: (d) => Promise.resolve($e().deleteAttachment(d)),
    onSuccess: i
  });
  return {
    attachments: r.data ?? [],
    isLoading: r.isLoading,
    upload: l.mutateAsync,
    remove: o.mutateAsync,
    isUploading: l.isPending
  };
}
function Ft(t) {
  return `${Math.round(t / 1024)} KB`;
}
function Bt({ taskId: t }) {
  const { attachments: s, upload: a, remove: r, isUploading: i } = Lt(t), l = x.useRef(null), o = async (c) => {
    var p, m, h, y, n, f, g;
    const u = (p = c.target.files) == null ? void 0 : p[0];
    if (u)
      try {
        await a(u), (y = (h = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : h.success) == null || y.call(h, "Dosya yüklendi.");
      } catch (w) {
        (g = (f = (n = window == null ? void 0 : window.abp) == null ? void 0 : n.notify) == null ? void 0 : f.error) == null || g.call(f, (w == null ? void 0 : w.message) || "Dosya yüklenemedi.");
      } finally {
        l.current && (l.current.value = "");
      }
  }, d = async (c, u) => {
    var p, m, h;
    try {
      await r(c);
    } catch (y) {
      (h = (m = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : m.error) == null || h.call(m, (y == null ? void 0 : y.message) || `${u} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("input", { ref: l, type: "file", onChange: o, className: "text-sm", disabled: i }),
      i && /* @__PURE__ */ e.jsx("span", { className: "text-sm text-text-tertiary", children: "Yükleniyor…" })
    ] }),
    s.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz dosya yüklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "divide-y divide-border-default", children: s.map((c) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between py-2", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("a", { href: c.downloadUrl, target: "_blank", rel: "noreferrer", className: "text-sm font-medium text-text-primary hover:underline", children: c.fileName }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-tertiary", children: [
          Ft(c.fileSize),
          " — ",
          c.uploaderName
        ] })
      ] }),
      /* @__PURE__ */ e.jsx(j, { variant: "ghost", onClick: () => d(c.id, c.fileName), "aria-label": `${c.fileName} dosyasini sil`, children: "Sil" })
    ] }, c.id)) })
  ] });
}
function oe() {
  var s, a, r;
  const t = (r = (a = (s = window == null ? void 0 : window.apya) == null ? void 0 : s.platform) == null ? void 0 : a.tasks) == null ? void 0 : r.task;
  return t || null;
}
function It(t) {
  const s = oe();
  return s ? Promise.resolve(s.getChecklistItems(t)) : Promise.reject(new Error("ABP görev servisi yüklenmedi."));
}
function Rt(t) {
  const s = J(), a = ["task-checklist", t], r = ie({
    queryKey: a,
    queryFn: () => It(t),
    enabled: !!t,
    staleTime: 3e4,
    retry: !1
  }), i = () => s.invalidateQueries({ queryKey: a }), l = H({
    mutationFn: (c) => Promise.resolve(oe().addChecklistItem(t, c)),
    onSuccess: i
  }), o = H({
    mutationFn: (c) => Promise.resolve(oe().toggleChecklistItem(c)),
    onSuccess: i
  }), d = H({
    mutationFn: (c) => Promise.resolve(oe().deleteChecklistItem(c)),
    onSuccess: i
  });
  return {
    items: r.data ?? [],
    isLoading: r.isLoading,
    addItem: l.mutateAsync,
    toggleItem: o.mutateAsync,
    removeItem: d.mutateAsync
  };
}
function Pt({ taskId: t }) {
  const { items: s, addItem: a, toggleItem: r, removeItem: i } = Rt(t), [l, o] = x.useState(""), d = async () => {
    var m, h, y;
    const p = l.trim();
    if (p)
      try {
        await a(p), o("");
      } catch (n) {
        (y = (h = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : h.error) == null || y.call(h, (n == null ? void 0 : n.message) || "Madde eklenemedi.");
      }
  }, c = async (p) => {
    var m, h, y;
    try {
      await r(p);
    } catch (n) {
      (y = (h = (m = window == null ? void 0 : window.abp) == null ? void 0 : m.notify) == null ? void 0 : h.error) == null || y.call(h, (n == null ? void 0 : n.message) || "Madde güncellenemedi.");
    }
  }, u = async (p, m) => {
    var h, y, n;
    try {
      await i(p);
    } catch (f) {
      (n = (y = (h = window == null ? void 0 : window.abp) == null ? void 0 : h.notify) == null ? void 0 : y.error) == null || n.call(y, (f == null ? void 0 : f.message) || `${m} silinemedi.`);
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ e.jsx(
        Z,
        {
          value: l,
          onChange: (p) => o(p.target.value),
          onKeyDown: (p) => {
            p.key === "Enter" && d();
          },
          placeholder: "Yeni madde"
        }
      ),
      /* @__PURE__ */ e.jsx(j, { variant: "secondary", onClick: d, disabled: !l.trim(), children: "Ekle" })
    ] }),
    s.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-tertiary", children: "Henüz madde eklenmemiş." }) : /* @__PURE__ */ e.jsx("ul", { className: "space-y-1.5", children: s.map((p) => /* @__PURE__ */ e.jsxs("li", { className: "flex items-center justify-between gap-2 py-1", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: p.isDone,
            onChange: () => c(p.id)
          }
        ),
        /* @__PURE__ */ e.jsx("span", { className: p.isDone ? "text-text-tertiary line-through" : "text-text-primary", children: p.text })
      ] }),
      /* @__PURE__ */ e.jsx(j, { variant: "ghost", onClick: () => u(p.id, p.text), "aria-label": `${p.text} maddesini sil`, children: "Sil" })
    ] }, p.id)) })
  ] });
}
function Gt({ taskId: t, task: s }) {
  const [a, r] = x.useState(""), [i, l] = x.useState(null), [o, d] = x.useState(""), [c, u] = x.useState(!1), p = J(), m = (s == null ? void 0 : s.comments) ?? [], h = async (n) => {
    var f, g, w, C, z, F;
    if (n == null || n.preventDefault(), !(!a.trim() || c)) {
      u(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.addComment(t, a.trim())
        ), r(""), p.invalidateQueries({ queryKey: ["task-detail", t] }), (w = (g = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : g.success) == null || w.call(g, "Yorum eklendi.");
      } catch (L) {
        (F = (z = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : z.error) == null || F.call(z, (L == null ? void 0 : L.message) || "Yorum eklenemedi.");
      } finally {
        u(!1);
      }
    }
  }, y = async (n) => {
    var f, g, w, C, z, F;
    if (!(!o.trim() || c)) {
      u(!0);
      try {
        await Promise.resolve(
          window.apya.platform.tasks.task.replyToComment(n, o.trim())
        ), d(""), l(null), p.invalidateQueries({ queryKey: ["task-detail", t] }), (w = (g = (f = window == null ? void 0 : window.abp) == null ? void 0 : f.notify) == null ? void 0 : g.success) == null || w.call(g, "Yanıt eklendi.");
      } catch (L) {
        (F = (z = (C = window == null ? void 0 : window.abp) == null ? void 0 : C.notify) == null ? void 0 : z.error) == null || F.call(z, (L == null ? void 0 : L.message) || "Yanıt eklenemedi.");
      } finally {
        u(!1);
      }
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("form", { onSubmit: h, className: "rounded-lg border border-default p-3 bg-surface-base", children: [
      /* @__PURE__ */ e.jsx(
        "textarea",
        {
          rows: 3,
          value: a,
          onChange: (n) => r(n.target.value),
          placeholder: "Bir yorum veya güncelleme yazın...",
          className: "w-full resize-none rounded-md border border-subtle bg-surface-elevated p-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-focus"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ e.jsx(
        j,
        {
          type: "submit",
          variant: "primary",
          disabled: !a.trim() || c,
          isLoading: c,
          children: "Yorum Gönder"
        }
      ) })
    ] }),
    m.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Henüz yorum yapılmamış. İlk yorumu siz yazın!" }) : /* @__PURE__ */ e.jsx("div", { className: "space-y-3", children: m.map((n) => /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-subtle p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-secondary", children: [
        /* @__PURE__ */ e.jsx("span", { className: "font-semibold text-text-primary", children: n.creatorUserName || n.creatorName || "Kullanıcı" }),
        /* @__PURE__ */ e.jsx("span", { children: n.creationTime ? new Date(n.creationTime).toLocaleString("tr-TR") : "" })
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-sm text-text-primary whitespace-pre-wrap", children: n.text }),
      /* @__PURE__ */ e.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ e.jsx(
        j,
        {
          variant: "ghost",
          size: "sm",
          onClick: () => l(i === n.id ? null : n.id),
          children: "Yanıtla"
        }
      ) }),
      i === n.id && /* @__PURE__ */ e.jsxs("div", { className: "mt-2 pl-4 border-l-2 border-border-default space-y-2", children: [
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            rows: 2,
            value: o,
            onChange: (f) => d(f.target.value),
            placeholder: "Yanıtınızı yazın...",
            className: "w-full resize-none rounded-md border border-subtle bg-surface-base p-2 text-xs text-text-primary focus-visible:outline-none"
          }
        ),
        /* @__PURE__ */ e.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ e.jsx(j, { variant: "ghost", size: "sm", onClick: () => l(null), children: "İptal" }),
          /* @__PURE__ */ e.jsx(j, { variant: "primary", size: "sm", disabled: !o.trim() || c, onClick: () => y(n.id), children: "Gönder" })
        ] })
      ] }),
      n.replies && n.replies.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "mt-3 pl-4 border-l-2 border-border-subtle space-y-2", children: n.replies.map((f) => /* @__PURE__ */ e.jsxs("div", { className: "rounded bg-surface-base p-2 space-y-1", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between text-xs text-text-tertiary", children: [
          /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: f.creatorUserName || f.creatorName || "Kullanıcı" }),
          /* @__PURE__ */ e.jsx("span", { children: f.creationTime ? new Date(f.creationTime).toLocaleString("tr-TR") : "" })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-primary", children: f.text })
      ] }, f.id)) })
    ] }, n.id)) })
  ] });
}
function Kt({ task: t }) {
  const s = [];
  return t != null && t.creationTime && s.push({
    id: "created",
    type: "create",
    icon: "fa-plus",
    title: "Görev oluşturuldu",
    user: t.creatorUserName || t.creatorName || "Sistem / Kullanıcı",
    time: new Date(t.creationTime).toLocaleString("tr-TR")
  }), t != null && t.lastModificationTime && s.push({
    id: "modified",
    type: "update",
    icon: "fa-pen",
    title: "Görev güncellendi",
    user: t.lastModifierUserName || t.lastModifierName || "Kullanıcı",
    time: new Date(t.lastModificationTime).toLocaleString("tr-TR")
  }), t != null && t.attachments && t.attachments.length > 0 && s.push({
    id: "files",
    type: "file",
    icon: "fa-paperclip",
    title: `${t.attachments.length} dosya eki mevcut`,
    user: "Sistem",
    time: ""
  }), /* @__PURE__ */ e.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx("h4", { className: "text-sm font-semibold text-text-primary", children: "Aktivite Zaman Çizelgesi" }),
    s.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Aktivite kaydı bulunamadı." }) : /* @__PURE__ */ e.jsx("div", { className: "relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-subtle", children: s.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "relative flex items-start justify-between gap-3 text-xs", children: [
      /* @__PURE__ */ e.jsx("span", { className: "absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full bg-surface-raised text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: `fa ${a.icon} text-[10px]`, "aria-hidden": "true" }) }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("p", { className: "font-medium text-text-primary", children: a.title }),
        a.user && /* @__PURE__ */ e.jsxs("span", { className: "text-text-tertiary", children: [
          "Yapan: ",
          a.user
        ] })
      ] }),
      a.time && /* @__PURE__ */ e.jsx("span", { className: "text-text-tertiary whitespace-nowrap", children: a.time })
    ] }, a.id)) })
  ] });
}
function Mt({ task: t }) {
  const s = [
    { label: "Görev ID", value: (t == null ? void 0 : t.id) || "-" },
    { label: "Oluşturan", value: (t == null ? void 0 : t.creatorUserName) || (t == null ? void 0 : t.creatorName) || "Bilinmiyor" },
    { label: "Oluşturulma Tarihi", value: t != null && t.creationTime ? new Date(t.creationTime).toLocaleString("tr-TR") : "-" },
    { label: "Son Güncelleyen", value: (t == null ? void 0 : t.lastModifierUserName) || (t == null ? void 0 : t.lastModifierName) || "Henüz güncellenmedi" },
    { label: "Son Güncelleme Tarihi", value: t != null && t.lastModificationTime ? new Date(t.lastModificationTime).toLocaleString("tr-TR") : "-" },
    { label: "Proje ID", value: (t == null ? void 0 : t.projectId) || "Genel Projesiz Görev" }
  ];
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsx("h4", { className: "text-sm font-semibold text-text-primary", children: "Teknik Audit & Değişiklik Geçmişi" }),
    /* @__PURE__ */ e.jsx("div", { className: "rounded-lg border border-default divide-y divide-border-subtle bg-surface-elevated", children: s.map((a, r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between p-3 text-xs", children: [
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-secondary", children: a.label }),
      /* @__PURE__ */ e.jsx("span", { className: "font-mono text-text-primary", children: a.value })
    ] }, r)) })
  ] });
}
function Yt({ task: t }) {
  var u;
  const s = typeof window < "u" && !!((u = window == null ? void 0 : window.abp) != null && u.auth), a = s ? xe("Platform.Expenses.Default") : !0, r = s ? xe("Platform.Incomes.Default") : !0;
  if (!a && !r)
    return /* @__PURE__ */ e.jsx("div", { className: "py-8 text-center text-sm text-text-tertiary", children: "Finansal verileri görüntüleme yetkiniz bulunmuyor." });
  const i = (t == null ? void 0 : t.expenses) || [], l = (t == null ? void 0 : t.incomes) || [], o = i.reduce((p, m) => p + (m.amount || 0), 0), d = l.reduce((p, m) => p + (m.amount || 0), 0), c = d - o;
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated", children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Toplam Gelir" }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-base font-semibold text-text-positive", children: [
          d.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
          " ₺"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated", children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Toplam Gider" }),
        /* @__PURE__ */ e.jsxs("p", { className: "text-base font-semibold text-text-negative", children: [
          o.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
          " ₺"
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated", children: [
        /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Net Bakiye" }),
        /* @__PURE__ */ e.jsxs("p", { className: `text-base font-semibold ${c >= 0 ? "text-text-positive" : "text-text-negative"}`, children: [
          c.toLocaleString("tr-TR", { minimumFractionDigits: 2 }),
          " ₺"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "rounded-lg border border-subtle p-3 bg-surface-base text-xs text-text-secondary", children: /* @__PURE__ */ e.jsx("p", { children: "Göreve bağlı detaylı harcama veya fatura ekleme işlemleri Finans Modülü üzerinden senkronize yönetilmektedir." }) })
  ] });
}
function ne({ task: t }) {
  const s = (t == null ? void 0 : t.predecessorIds) || [];
  return /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("h4", { className: "text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-diagram-project text-text-tertiary", "aria-hidden": "true" }),
        "Öncül Görev Bağımlılıkları (",
        s.length,
        ")"
      ] }),
      s.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Bu görevin başlamasını engelleyen öncül bir görev tanımlanmamış." }) : /* @__PURE__ */ e.jsxs("p", { className: "text-xs text-text-secondary", children: [
        s.length,
        " adet bağlı öncül görev tanımlı."
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-lg border border-default p-3 bg-surface-elevated space-y-2", children: [
      /* @__PURE__ */ e.jsxs("h4", { className: "text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-2", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa fa-stopwatch text-text-tertiary", "aria-hidden": "true" }),
        "Zaman Takibi (Time Logs)"
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "text-xs text-text-tertiary", children: "Zaman sayacı ve iş yükü logları aktiftir." })
    ] })
  ] });
}
const qe = [
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
    component: Et
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
    component: Bt
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
    component: Pt
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
    component: Gt
  },
  {
    code: "activity",
    title: "Aktiviteler",
    icon: "fa-timeline",
    category: "gecmis",
    isCore: !1,
    order: 30,
    permission: null,
    implemented: !0,
    component: Kt
  },
  {
    code: "history",
    title: "Geçmiş",
    icon: "fa-clock-rotate-left",
    category: "gecmis",
    isCore: !1,
    order: 31,
    permission: null,
    implemented: !0,
    component: Mt
  },
  {
    code: "finance",
    title: "Finans",
    icon: "fa-coins",
    category: "finans",
    isCore: !1,
    order: 40,
    permission: null,
    implemented: !0,
    component: Yt
  },
  {
    code: "dependencies",
    title: "Bağımlılıklar",
    icon: "fa-diagram-project",
    category: "ileri",
    isCore: !1,
    order: 50,
    permission: null,
    implemented: !0,
    component: ne
  },
  {
    code: "risks",
    title: "Riskler",
    icon: "fa-triangle-exclamation",
    category: "ileri",
    isCore: !1,
    order: 51,
    permission: null,
    implemented: !0,
    component: ne
  },
  {
    code: "approvals",
    title: "Onaylar",
    icon: "fa-stamp",
    category: "ileri",
    isCore: !1,
    order: 52,
    permission: null,
    implemented: !0,
    component: ne
  },
  {
    code: "time-tracking",
    title: "Zaman Takibi",
    icon: "fa-stopwatch",
    category: "ileri",
    isCore: !1,
    order: 53,
    permission: null,
    implemented: !0,
    component: ne
  }
];
function Ue(t = []) {
  const s = new Set(t);
  return qe.filter((a) => a.implemented && (a.isCore || s.has(a.code))).sort((a, r) => a.order - r.order);
}
function Ot(t = []) {
  const s = new Set(t);
  return qe.filter((a) => !a.isCore).filter((a) => !a.permission || xe(a.permission)).map((a) => ({ ...a, isAssigned: s.has(a.code) })).sort((a, r) => a.order - r.order);
}
let X = null;
const ce = /* @__PURE__ */ new Set(), ue = /* @__PURE__ */ new Set();
function Ce() {
  ce.forEach((t) => t());
}
function $t(t) {
  return typeof t == "string" && t ? t : t && typeof t == "object" && typeof t.id == "string" && t.id ? t.id : null;
}
const R = {
  open(t) {
    const s = $t(t);
    !s || s === X || (X = s, Ce());
  },
  close() {
    X !== null && (X = null, Ce());
  },
  subscribe(t) {
    return ce.add(t), () => ce.delete(t);
  },
  getSnapshot() {
    return X;
  },
  /** abp.ModalManager.onResult sözleşmesi — kanban/datatable tazelemesi için. */
  onResult(t) {
    typeof t == "function" && ue.add(t);
  },
  emitResult() {
    ue.forEach((t) => t());
  },
  /** Yalnız testler için. */
  reset() {
    X = null, ce.clear(), ue.clear();
  }
}, Te = "apya.taskDetail.fullscreen";
function Ve({ taskId: t, presentation: s = "modal", onClose: a }) {
  const [r, i] = x.useState(t), [l, o] = x.useState([]), { data: d, isLoading: c, isError: u, refetch: p } = Ie(r), m = Re(), h = Me(d), y = Ye(), n = Oe(r), [f, g] = x.useState("general"), [w, C] = x.useState(!1), z = ee.useRef(null), F = x.useMemo(
    () => Ue(n.assignedCodes),
    [n.assignedCodes]
  ), L = x.useMemo(
    () => Ot(n.assignedCodes),
    [n.assignedCodes]
  ), A = F.find((v) => v.code === f) ?? F[0];
  ee.useEffect(() => {
    A.code !== f && g(A.code);
  }, [A, f]);
  const W = A == null ? void 0 : A.component, b = J(), [D, S] = x.useState(
    () => {
      var v;
      return ((v = window.localStorage) == null ? void 0 : v.getItem(Te)) === "1";
    }
  ), [U, te] = x.useState(!1), T = x.useCallback(() => {
    Ge(), a == null || a();
  }, [a]);
  Ke(t, T), ee.useEffect(() => {
    h.isDirty ? m.markDirty() : m.markClean();
  });
  const B = x.useCallback(() => m.requestClose(T), [m, T]), G = x.useCallback(() => {
    S((v) => {
      var k;
      const N = !v;
      return (k = window.localStorage) == null || k.setItem(Te, N ? "1" : "0"), N;
    });
  }, []), V = xe("Platform.Tasks.Delete"), [P, K] = x.useState(!1), [M, je] = x.useState(!1), Ze = x.useCallback(async () => {
    var v, N, k, I, E, ae;
    je(!0);
    try {
      await Promise.resolve(window.apya.platform.tasks.task.delete(r)), (k = (N = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : N.info) == null || k.call(N, "Başarıyla silindi."), K(!1), m.markClean(), T();
    } catch (_) {
      (ae = (E = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : E.error) == null || ae.call(E, (_ == null ? void 0 : _.message) || "Görev silinemedi.");
    } finally {
      je(!1);
    }
  }, [r, m, T]), le = x.useCallback(async () => {
    var v, N, k, I, E, ae;
    if (!h.validate()) return !1;
    te(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(r, h.toUpdateDto())
      ), await b.invalidateQueries({ queryKey: ["task-detail", r] }), R.emitResult(), (k = (N = (v = window == null ? void 0 : window.abp) == null ? void 0 : v.notify) == null ? void 0 : N.success) == null || k.call(N, "Kaydedildi."), !0;
    } catch (_) {
      return (ae = (E = (I = window == null ? void 0 : window.abp) == null ? void 0 : I.notify) == null ? void 0 : E.error) == null || ae.call(E, (_ == null ? void 0 : _.message) || "Kaydedilemedi."), !1;
    } finally {
      te(!1);
    }
  }, [r, h, m, b]), Je = x.useCallback(() => {
    le();
  }, [le]), We = x.useCallback(async () => {
    const v = m.resolvePendingClose("save");
    await le() && (v == null || v());
  }, [m, le]), Xe = x.useCallback((v, N) => {
    m.requestClose(() => {
      o((k) => [...k, { id: r, title: (d == null ? void 0 : d.title) ?? "" }]), i(v), g("general"), m.markClean();
    });
  }, [m, r, d]), et = x.useCallback((v) => {
    m.requestClose(() => {
      o((N) => {
        const k = N.findIndex((I) => I.id === v);
        return k === -1 ? N : N.slice(0, k);
      }), i(v), g("general"), m.markClean();
    });
  }, [m]), tt = x.useCallback(async (v) => {
    var N, k, I;
    try {
      await n.addFeature(v), g(v), C(!1);
    } catch (E) {
      (I = (k = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : k.error) == null || I.call(k, (E == null ? void 0 : E.message) || "Özellik eklenemedi.");
    }
  }, [n]), at = x.useCallback(async (v) => {
    var N, k, I;
    try {
      await n.removeFeature(v), g((E) => E === v ? "general" : E);
    } catch (E) {
      (I = (k = (N = window == null ? void 0 : window.abp) == null ? void 0 : N.notify) == null ? void 0 : k.error) == null || I.call(k, (E == null ? void 0 : E.message) || "Özellik kaldırılamadı.");
    }
  }, [n]);
  ee.useEffect(() => {
    if (!w) return;
    const v = (k) => {
      z.current && !z.current.contains(k.target) && C(!1);
    }, N = (k) => {
      k.key === "Escape" && C(!1);
    };
    return document.addEventListener("mousedown", v), document.addEventListener("keydown", N), () => {
      document.removeEventListener("mousedown", v), document.removeEventListener("keydown", N);
    };
  }, [w]);
  const st = c ? /* @__PURE__ */ e.jsxs("div", { "aria-label": "Görev yükleniyor", "aria-busy": "true", className: "space-y-3", children: [
    /* @__PURE__ */ e.jsx(q, { className: "h-6 w-1/3" }),
    /* @__PURE__ */ e.jsx(q, { className: "h-24 w-full" }),
    /* @__PURE__ */ e.jsx(q, { className: "h-24 w-full" })
  ] }) : u ? /* @__PURE__ */ e.jsxs("div", { className: "grid place-items-center gap-3 py-[var(--apya-space-12)] text-center", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa fa-triangle-exclamation text-2xl text-text-tertiary", "aria-hidden": "true" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary", children: "Görev yüklenemedi. Erişim yetkiniz olmayabilir." }),
    /* @__PURE__ */ e.jsx(j, { variant: "ghost", onClick: () => p(), children: "Tekrar dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex min-h-0 flex-col gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsx(
      wt,
      {
        trail: l,
        current: { id: r, title: (d == null ? void 0 : d.title) ?? "" },
        onNavigate: et
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "relative", ref: z, children: [
      /* @__PURE__ */ e.jsx(
        gt,
        {
          tabs: F,
          activeCode: A.code,
          onSelect: (v) => {
            g(v), C(!1);
          },
          onOpenPicker: () => C((v) => !v),
          pickerOpen: w
        }
      ),
      w && /* @__PURE__ */ e.jsx(
        jt,
        {
          entries: L,
          busyCode: n.isMutating ? n.mutatingCode : null,
          onAdd: tt,
          onRemove: at
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        role: "tabpanel",
        id: "task-feature-tabpanel",
        "aria-labelledby": `task-tab-${A.code}`,
        className: "grid gap-[var(--apya-space-5)] tablet:grid-cols-[2fr_1fr]",
        children: [
          A.code === "general" ? /* @__PURE__ */ e.jsx(
            ft,
            {
              values: h.values,
              errors: h.errors,
              onFieldChange: h.setField,
              assigneeOptions: y.options,
              isLoadingAssignees: y.isLoading
            }
          ) : /* @__PURE__ */ e.jsx(x.Suspense, { fallback: /* @__PURE__ */ e.jsx(q, { className: "h-24 w-full" }), children: W && /* @__PURE__ */ e.jsx(
            W,
            {
              taskId: r,
              task: d,
              onOpenSubtask: Xe
            }
          ) }),
          /* @__PURE__ */ e.jsx(
            ht,
            {
              task: d,
              creatorName: y.nameById.get(d.creatorId),
              lastModifierName: y.nameById.get(d.lastModifierId)
            }
          )
        ]
      }
    )
  ] }), rt = s === "page" ? ot : nt;
  return /* @__PURE__ */ e.jsxs(
    rt,
    {
      open: !0,
      fullscreen: D,
      onRequestClose: B,
      title: d ? `Görev Detayı: ${d.title}` : "Görev Detayı",
      header: /* @__PURE__ */ e.jsx(
        dt,
        {
          task: d ?? { title: "Yükleniyor…" },
          canDelete: V,
          fullscreen: D,
          onToggleFullscreen: G,
          onClose: B,
          onDelete: () => K(!0)
        }
      ),
      footer: /* @__PURE__ */ e.jsx(
        ut,
        {
          lastSavedAt: d == null ? void 0 : d.lastModificationTime,
          isDirty: m.isDirty,
          isSaving: U,
          onCancel: B,
          onSave: Je
        }
      ),
      children: [
        st,
        m.pendingClose && /* @__PURE__ */ e.jsx(
          Ut,
          {
            isSaving: U,
            onStay: () => m.resolvePendingClose("stay"),
            onDiscard: () => m.resolvePendingClose("discard"),
            onSaveAndClose: We
          }
        ),
        P && /* @__PURE__ */ e.jsx(
          qt,
          {
            taskTitle: (d == null ? void 0 : d.title) ?? "",
            busy: M,
            onCancel: () => K(!1),
            onConfirm: Ze
          }
        )
      ]
    }
  );
}
function qt({ taskTitle: t, busy: s, onCancel: a, onConfirm: r }) {
  const [i, l] = x.useState(""), o = i.trim() === "SİL";
  return /* @__PURE__ */ e.jsxs(
    _e,
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
        /* @__PURE__ */ e.jsx(j, { variant: "secondary", onClick: a, disabled: s, children: "İptal" }),
        /* @__PURE__ */ e.jsx(
          j,
          {
            variant: "destructive",
            onClick: r,
            disabled: !o,
            isLoading: s,
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
            value: i,
            onChange: (d) => l(d.target.value),
            placeholder: "SİL",
            autoComplete: "off",
            className: "mt-[var(--apya-space-4)] w-full rounded-md border border-default bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:border-border-focus focus-visible:outline-none focus-visible:shadow-focus"
          }
        )
      ]
    }
  );
}
function _e({ label: t, title: s, description: a, children: r, actions: i }) {
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      role: "alertdialog",
      "aria-modal": "true",
      "aria-label": t,
      className: "absolute inset-0 z-popover grid place-items-center bg-surface-overlay p-4",
      children: /* @__PURE__ */ e.jsxs("div", { className: "w-full max-w-md rounded-xl border border-default bg-surface-elevated p-[var(--apya-space-5)] shadow-xl", children: [
        /* @__PURE__ */ e.jsx("h3", { className: "text-base font-semibold text-text-primary", children: s }),
        /* @__PURE__ */ e.jsx("p", { className: "mt-2 text-sm text-text-secondary", children: a }),
        r,
        /* @__PURE__ */ e.jsx("div", { className: "mt-[var(--apya-space-5)] flex justify-end gap-2", children: i })
      ] })
    }
  );
}
function Ut({ isSaving: t, onStay: s, onDiscard: a, onSaveAndClose: r }) {
  return /* @__PURE__ */ e.jsx(
    _e,
    {
      label: "Kaydedilmemiş değişiklikler",
      title: "Kaydedilmemiş değişiklikleriniz var.",
      description: "Çıkarsanız yaptığınız değişiklikler kaybolur.",
      actions: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx(j, { variant: "secondary", onClick: s, disabled: t, children: "Düzenlemeye devam et" }),
        /* @__PURE__ */ e.jsx(j, { variant: "destructive", onClick: a, disabled: t, children: "Değişiklikleri iptal et" }),
        /* @__PURE__ */ e.jsx(j, { variant: "primary", onClick: r, isLoading: t, loadingText: "Kaydediliyor…", children: "Kaydet ve çık" })
      ] })
    }
  );
}
function Vt() {
  return /* @__PURE__ */ e.jsxs(he, { children: [
    /* @__PURE__ */ e.jsx(be, { asChild: !0, children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-[var(--apya-radius-full)] bg-surface-base border border-subtle text-[13px] font-medium text-text-secondary cursor-pointer hover:bg-surface-hover hover:border-default transition-all shadow-sm", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-lock text-[11px] text-text-tertiary" }),
      /* @__PURE__ */ e.jsx("span", { children: "Sınırlı erişim" }),
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[10px] ml-0.5 text-text-tertiary" })
    ] }) }),
    /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
      ge,
      {
        sideOffset: 8,
        align: "end",
        className: "z-50 w-[620px] rounded-2xl border border-subtle bg-surface-base p-6 shadow-float animate-in fade-in-50 zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6", children: [
            /* @__PURE__ */ e.jsx("div", { className: "flex items-center justify-between border-b border-subtle pb-3", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shield-halved text-primary text-base" }),
              /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "GİZLİLİK & YETKİ GÖSTERİMİ" })
            ] }) }),
            /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 items-start", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-xl bg-surface-sunken border border-subtle", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-lock text-primary text-base mt-0.5" }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-semibold text-text-primary", children: "Sınırlı erişim" }),
                    /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5", children: "Bu görev yalnızca yetkilendirilmiş kullanıcılar tarafından görüntülenebilir." })
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-xl border border-subtle hover:bg-surface-hover transition-colors", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-eye-slash text-text-tertiary text-base mt-0.5" }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-semibold text-text-primary", children: "Özel görev" }),
                    /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5", children: "Bu görev gizli olarak işaretlenmiştir." })
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-xl border border-subtle hover:bg-surface-hover transition-colors", children: [
                  /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-shield-cat text-text-tertiary text-base mt-0.5" }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("h4", { className: "text-[13px] font-semibold text-text-primary", children: "Hassas içerik" }),
                    /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary mt-0.5", children: "Bu görev hassas bilgiler içermektedir." })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "p-4 rounded-xl border border-subtle bg-surface-sunken flex flex-col gap-4", children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-bold text-text-tertiary uppercase tracking-wider mb-2", children: "Yetkili Kullanıcılar" }),
                  /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ e.jsx("img", { src: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64", alt: "Yakup", className: "h-7 w-7 rounded-full border-2 border-surface-base" }),
                    /* @__PURE__ */ e.jsx("img", { src: "https://ui-avatars.com/api/?name=Elif+A&background=ec4899&color=fff&size=64", alt: "Elif", className: "h-7 w-7 rounded-full border-2 border-surface-base" }),
                    /* @__PURE__ */ e.jsx("img", { src: "https://ui-avatars.com/api/?name=Mehmet+K&background=10b981&color=fff&size=64", alt: "Mehmet", className: "h-7 w-7 rounded-full border-2 border-surface-base" }),
                    /* @__PURE__ */ e.jsx("span", { className: "flex h-7 w-7 items-center justify-center rounded-full bg-surface-base border border-subtle text-[11px] font-bold text-text-secondary", children: "+5" })
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("h4", { className: "text-[12px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5", children: "Erişim Düzeyi" }),
                  /* @__PURE__ */ e.jsxs("select", { className: "w-full h-9 px-3 rounded-lg border border-subtle bg-surface-base text-[13px] font-medium text-text-primary focus:outline-none focus:border-primary", children: [
                    /* @__PURE__ */ e.jsx("option", { value: "limited", children: "Sınırlı" }),
                    /* @__PURE__ */ e.jsx("option", { value: "team", children: "Tüm Ekip" }),
                    /* @__PURE__ */ e.jsx("option", { value: "public", children: "Herkes" })
                  ] })
                ] }),
                /* @__PURE__ */ e.jsx(
                  j,
                  {
                    variant: "outline",
                    size: "sm",
                    className: "w-full mt-2 font-semibold text-primary border-primary/30 hover:bg-primary/5",
                    children: "Yetkileri Yönet"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx(Be, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
function _t({
  task: t,
  onClose: s,
  onToggleFullscreen: a,
  isFullscreen: r,
  presentation: i = "modal"
}) {
  var m;
  const [l, o] = x.useState(!1), d = [
    { id: 1, label: "Tamamlandı", color: "success" },
    { id: 2, label: "Devam Ediyor", color: "primary" },
    { id: 3, label: "Beklemede", color: "warning" }
  ], c = [
    { id: 1, label: "Kritik", color: "negative" },
    { id: 2, label: "Yüksek", color: "warning" },
    { id: 3, label: "Normal", color: "neutral" }
  ], u = d.find((h) => h.id === t.status) || d[0], p = c.find((h) => h.id === t.priority) || c[0];
  return /* @__PURE__ */ e.jsx("header", { className: "flex flex-col gap-[var(--apya-space-4)] border-b border-subtle p-[var(--apya-space-6)] pb-[var(--apya-space-4)]", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-start justify-between gap-[var(--apya-space-4)]", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ e.jsxs(Q, { variant: "primary", className: "font-mono text-xs tracking-wider bg-primary-subtle text-primary", children: [
          "#",
          ((m = t.id) == null ? void 0 : m.substring(0, 8).toUpperCase()) || "OTL-2507"
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsxs(Q, { variant: "success", className: "cursor-pointer hover:bg-success-hover transition-colors font-medium text-xs py-1 px-2.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-circle-check mr-1.5" }),
            u.label,
            " ",
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down ml-1 text-[10px]" })
          ] }),
          /* @__PURE__ */ e.jsxs(Q, { variant: "negative", className: "cursor-pointer hover:bg-negative-hover transition-colors font-medium text-xs py-1 px-2.5", children: [
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-flag mr-1.5" }),
            p.label,
            " ",
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down ml-1 text-[10px]" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3 group mt-1", children: [
        /* @__PURE__ */ e.jsx("h1", { className: "text-[22px] font-semibold text-text-primary group-hover:text-primary transition-colors cursor-text", children: t.title || "İsimsiz Görev" }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            onClick: () => o(!l),
            className: `flex h-8 w-8 items-center justify-center rounded-full transition-colors ${l ? "text-warning hover:bg-warning-subtle" : "text-text-tertiary hover:bg-surface-hover hover:text-text-secondary"}`,
            children: /* @__PURE__ */ e.jsx("i", { className: l ? "fa-solid fa-star text-lg" : "fa-regular fa-star text-lg" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-[var(--apya-space-3)]", children: [
      /* @__PURE__ */ e.jsx(Vt, {}),
      /* @__PURE__ */ e.jsx("div", { className: "h-6 w-px bg-subtle mx-1" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1", children: [
        i === "modal" && /* @__PURE__ */ e.jsx(
          j,
          {
            variant: "ghost",
            size: "sm",
            icon: r ? "fa-compress" : "fa-expand",
            onClick: a,
            "aria-label": "Tam ekran",
            className: "h-9 w-9 p-0 rounded-[var(--apya-radius-md)] hover:bg-surface-hover"
          }
        ),
        /* @__PURE__ */ e.jsx(
          j,
          {
            variant: "ghost",
            size: "sm",
            icon: "fa-ellipsis",
            "aria-label": "Aksiyonlar",
            className: "h-9 w-9 p-0 rounded-[var(--apya-radius-md)] hover:bg-surface-hover"
          }
        ),
        i === "modal" && /* @__PURE__ */ e.jsx(
          j,
          {
            variant: "ghost",
            size: "sm",
            icon: "fa-xmark",
            onClick: s,
            "aria-label": "Kapat",
            className: "h-9 w-9 p-0 rounded-[var(--apya-radius-md)] hover:bg-negative-subtle hover:text-negative transition-colors"
          }
        )
      ] })
    ] })
  ] }) });
}
function O({ label: t, children: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-1.5 min-w-0", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[11px] font-bold text-text-tertiary uppercase tracking-wider select-none", children: t }),
    /* @__PURE__ */ e.jsx("div", { className: "flex items-center text-[13px] text-text-primary h-8 min-w-0", children: s })
  ] });
}
function Ht({
  task: t = {},
  assigneeOptions: s = [],
  onFieldChange: a = () => {
  }
}) {
  const [r, i] = x.useState(
    Array.isArray(t.tags) && t.tags.length > 0 ? t.tags : ["Konaklama", "Anlaşma"]
  ), [l, o] = x.useState(""), [d, c] = x.useState(!1), u = (n) => {
    if (n.key === "Enter" || n.type === "blur") {
      const f = l.trim();
      if (f && !r.includes(f)) {
        const g = [...r, f];
        i(g), a("tags", g);
      }
      o(""), c(!1);
    }
  }, p = (n) => {
    const f = r.filter((g) => g !== n);
    i(f), a("tags", f);
  }, m = (n) => {
    if (!n) return "—";
    const f = new Date(n);
    return isNaN(f.getTime()) ? n : f.toISOString().split("T")[0];
  }, h = t.assigneeName || "Yakup B.", y = `https://ui-avatars.com/api/?name=${encodeURIComponent(h)}&background=6366f1&color=fff&size=64`;
  return /* @__PURE__ */ e.jsx("div", { className: "px-[var(--apya-space-6)] py-[var(--apya-space-5)] bg-surface-base border-b border-subtle", children: /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-y-[var(--apya-space-5)] gap-x-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsx(O, { label: "Sorumlu", children: /* @__PURE__ */ e.jsxs(he, { children: [
      /* @__PURE__ */ e.jsx(be, { asChild: !0, children: /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group focus-visible:outline-none focus-visible:shadow-focus",
          children: [
            /* @__PURE__ */ e.jsx("img", { src: y, alt: h, className: "h-6 w-6 rounded-full border border-subtle shrink-0 object-cover" }),
            /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary text-[13px] group-hover:text-primary transition-colors", children: h }),
            /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-chevron-down text-[9px] text-text-tertiary ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity" })
          ]
        }
      ) }),
      /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
        ge,
        {
          sideOffset: 6,
          align: "start",
          className: "z-50 w-56 rounded-xl border border-subtle bg-surface-base p-2 shadow-float animate-in fade-in-50 zoom-in-95",
          children: [
            /* @__PURE__ */ e.jsx("div", { className: "text-[11px] font-bold text-text-tertiary uppercase tracking-wider px-2 py-1 mb-1", children: "Kişi Ata" }),
            /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-1 max-h-48 overflow-y-auto custom-scrollbar", children: ["Yakup B.", "Elif A.", "Mehmet K.", "Ayşe D."].map((n) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                onClick: () => a("assigneeName", n),
                className: `flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] text-left transition-colors ${h === n ? "bg-primary-subtle text-primary font-semibold" : "text-text-primary hover:bg-surface-hover"}`,
                children: [
                  /* @__PURE__ */ e.jsx("img", { src: `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=6366f1&color=fff&size=64`, alt: n, className: "h-5 w-5 rounded-full" }),
                  /* @__PURE__ */ e.jsx("span", { children: n })
                ]
              },
              n
            )) })
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ e.jsx(O, { label: "Son Tarih", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors group relative", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: m(t.dueDate),
          onChange: (n) => a("dueDate", n.target.value),
          className: "bg-transparent text-text-primary text-[13px] font-medium focus:outline-none cursor-pointer"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(O, { label: "Başlangıç", children: /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors group relative", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-calendar text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "date",
          value: m(t.startDate),
          onChange: (n) => a("startDate", n.target.value),
          className: "bg-transparent text-text-primary text-[13px] font-medium focus:outline-none cursor-pointer"
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(O, { label: "Öncelik", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 text-[13px] font-medium", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 text-negative bg-negative-subtle px-2.5 py-0.5 rounded-md font-semibold", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-flag text-xs" }),
      /* @__PURE__ */ e.jsx("span", { children: "Kritik" })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(O, { label: "Durum", children: /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 text-[13px] font-medium", children: /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 text-success bg-success-subtle px-2.5 py-0.5 rounded-md font-semibold", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-circle-check text-xs" }),
      /* @__PURE__ */ e.jsx("span", { children: "Tamamlandı" })
    ] }) }) }),
    /* @__PURE__ */ e.jsx(O, { label: "Etiketler", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
      r.map((n) => /* @__PURE__ */ e.jsxs(
        "span",
        {
          className: "group inline-flex items-center gap-1 bg-primary-subtle text-primary text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors",
          children: [
            /* @__PURE__ */ e.jsx("span", { children: n }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                onClick: () => p(n),
                className: "opacity-0 group-hover:opacity-100 hover:text-negative transition-opacity ml-0.5",
                "aria-label": "Etiketi kaldır",
                children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-xmark text-[9px]" })
              }
            )
          ]
        },
        n
      )),
      d ? /* @__PURE__ */ e.jsx(
        "input",
        {
          autoFocus: !0,
          type: "text",
          value: l,
          onChange: (n) => o(n.target.value),
          onKeyDown: u,
          onBlur: u,
          placeholder: "Etiket...",
          className: "h-6 w-16 px-1.5 text-[11px] rounded border border-primary bg-surface-base focus:outline-none"
        }
      ) : /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => c(!0),
          className: "flex items-center justify-center h-5 w-5 rounded-full bg-surface-sunken border border-subtle text-text-tertiary hover:bg-surface-hover hover:text-text-primary hover:border-primary transition-all",
          "aria-label": "Yeni etiket ekle",
          children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[9px]" })
        }
      )
    ] }) }),
    /* @__PURE__ */ e.jsx(O, { label: "Proje", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-folder-open text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary group-hover:text-primary transition-colors text-[13px] truncate max-w-[140px]", children: t.projectName || "Otel Projesi" })
    ] }) }),
    /* @__PURE__ */ e.jsx(O, { label: "Maliyet Merkezi", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 cursor-pointer hover:bg-surface-hover px-2 py-1 -ml-2 rounded-lg transition-colors w-max group", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-bullseye text-text-tertiary group-hover:text-primary transition-colors text-sm" }),
      /* @__PURE__ */ e.jsx("span", { className: "font-medium text-text-primary group-hover:text-primary transition-colors text-[13px]", children: "Merkez" })
    ] }) })
  ] }) });
}
const Qt = [
  {
    title: "GÖREV",
    items: [
      { code: "table", title: "Tablo", desc: "Veri tabloları oluşturun", icon: "fa-table-cells", color: "bg-primary-subtle text-primary" },
      { code: "gantt", title: "Gantt", desc: "Zaman çizelgesi görünümü", icon: "fa-bars-staggered", color: "bg-indigo-100 text-indigo-600" },
      { code: "timeline", title: "Zaman Çizelgesi", desc: "Timeline görünümü", icon: "fa-timeline", color: "bg-negative-subtle text-negative" },
      { code: "dashboard", title: "Gösterge Paneli", desc: "KPI ve widget panelleri", icon: "fa-chart-pie", color: "bg-primary-subtle text-primary" },
      { code: "time-tracking", title: "Zaman Takibi", desc: "Süre takibi ve raporlama", icon: "fa-stopwatch", color: "bg-warning-subtle text-warning" },
      { code: "forms", title: "Formlar", desc: "Özel formlar oluşturun", icon: "fa-clipboard-list", color: "bg-primary-subtle text-primary" },
      { code: "checklist", title: "Kontrol Listesi", desc: "Görev kontrol listeleri", icon: "fa-square-check", color: "bg-success-subtle text-success" },
      { code: "risks", title: "Riskler", desc: "Risk yönetimi", icon: "fa-triangle-exclamation", color: "bg-warning-subtle text-warning" },
      { code: "approvals", title: "Onaylar", desc: "Onay süreçleri", icon: "fa-stamp", color: "bg-primary-subtle text-primary" },
      { code: "dependencies", title: "İlişkili Görevler", desc: "Bağlantılı görevler", icon: "fa-link", color: "bg-surface-sunken text-text-secondary border border-subtle" }
    ]
  },
  {
    title: "İLETİŞİM",
    items: [
      { code: "emails", title: "E-postalar", desc: "E-posta entegrasyonu", icon: "fa-envelope", color: "bg-indigo-100 text-indigo-600" }
    ]
  },
  {
    title: "GEÇMİŞ",
    items: [
      { code: "activity", title: "Aktiviteler", desc: "Aktivite akışı", icon: "fa-file-lines", color: "bg-primary-subtle text-primary" }
    ]
  },
  {
    title: "FİNANS",
    items: [
      { code: "finance", title: "Finans", desc: "Bütçe ve maliyetler", icon: "fa-coins", color: "bg-success-subtle text-success" },
      { code: "gallery", title: "Dosya Galerisi", desc: "Görsel dosya yönetimi", icon: "fa-image", color: "bg-indigo-100 text-indigo-600" }
    ]
  },
  {
    title: "İLERİ ÖZELLİKLER",
    items: [
      { code: "custom-fields", title: "Özel Alanlar", desc: "Özel alanlar ekleyin", icon: "fa-square-plus", color: "bg-success-subtle text-success" },
      { code: "automations", title: "Otomasyonlar", desc: "Otomatik işlemler", icon: "fa-wand-magic-sparkles", color: "bg-indigo-100 text-indigo-600" },
      { code: "ai", title: "Yapay Zeka", desc: "AI analiz ve öneriler", icon: "fa-sparkles", color: "bg-indigo-100 text-indigo-600" }
    ]
  }
];
function He({ assignedCodes: t = [] }) {
  const s = (a) => t.includes(a);
  return /* @__PURE__ */ e.jsxs(he, { children: [
    /* @__PURE__ */ e.jsx(be, { asChild: !0, children: /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        className: "flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-text-tertiary text-text-tertiary hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:shadow-focus",
        "aria-label": "Özellik ekle",
        children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[14px]" })
      }
    ) }),
    /* @__PURE__ */ e.jsx(ye, { children: /* @__PURE__ */ e.jsxs(
      ge,
      {
        sideOffset: 8,
        align: "end",
        className: "z-50 w-[800px] rounded-xl border border-subtle bg-surface-base p-6 shadow-float will-change-[transform,opacity] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between pb-2 border-b border-subtle", children: [
              /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary tracking-wide", children: "ÖZELLİK EKLEME SİSTEMİ" }),
              /* @__PURE__ */ e.jsx("p", { className: "text-[12px] text-text-tertiary", children: "+ ikonuna tıklayınca açılan menü ile göreve yeni özellikler/sekme eklenir." })
            ] }),
            Qt.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-3", children: [
              /* @__PURE__ */ e.jsx("h4", { className: "text-[11px] font-bold text-text-tertiary tracking-widest uppercase pl-1", children: a.title }),
              /* @__PURE__ */ e.jsx("div", { className: "grid grid-cols-2 gap-3", children: a.items.map((r) => /* @__PURE__ */ e.jsxs(
                "div",
                {
                  className: `
                                                group flex items-start gap-4 rounded-xl border p-3 transition-all cursor-pointer
                                                ${s(r.code) ? "border-subtle bg-surface-sunken opacity-60 cursor-default" : "border-subtle bg-surface-base hover:border-primary hover:shadow-sm"}
                                            `,
                  children: [
                    /* @__PURE__ */ e.jsx("div", { className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${r.color}`, children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid ${r.icon} text-[16px]` }) }),
                    /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-0.5 mt-0.5", children: [
                      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: r.title }),
                        s(r.code) && /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-check text-success text-[12px]" })
                      ] }),
                      /* @__PURE__ */ e.jsx("span", { className: "text-[12px] text-text-tertiary", children: r.desc })
                    ] })
                  ]
                },
                r.code
              )) })
            ] }, a.title))
          ] }),
          /* @__PURE__ */ e.jsx(Be, { className: "fill-surface-base stroke-subtle" })
        ]
      }
    ) })
  ] });
}
function Zt({ activeTab: t, onTabChange: s, visibleTabs: a }) {
  const r = (i) => i === "subtasks" ? 4 : i === "files" ? 8 : i === "dependencies" ? 2 : i === "comments" ? 4 : null;
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle bg-surface-base px-[var(--apya-space-6)]", children: [
    /* @__PURE__ */ e.jsx("nav", { className: "flex items-center gap-6", "aria-label": "Görev sekmeleri", children: a.map((i) => {
      const l = t === i.code, o = r(i.code);
      return /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => s(i.code),
          className: `
                                relative flex items-center gap-2 py-3.5 text-[13px] font-medium transition-colors
                                ${l ? "text-primary" : "text-text-secondary hover:text-text-primary"}
                            `,
          children: [
            i.title,
            o !== null && /* @__PURE__ */ e.jsx("span", { className: `
                                    flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold
                                    ${l ? "bg-primary-subtle text-primary" : "bg-surface-sunken text-text-tertiary border border-subtle"}
                                `, children: o }),
            l && /* @__PURE__ */ e.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" })
          ]
        },
        i.code
      );
    }) }),
    /* @__PURE__ */ e.jsx("div", { className: "py-2", children: /* @__PURE__ */ e.jsx(He, { assignedCodes: a.map((i) => i.code) }) })
  ] });
}
function $({ label: t, value: s }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-start py-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary text-right font-medium max-w-[150px] truncate", title: typeof s == "string" ? s : "", children: s ?? "—" })
  ] });
}
function De({ label: t, name: s, avatar: a }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex justify-between items-center py-2.5", children: [
    /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-tertiary", children: t }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ e.jsx("img", { src: a, alt: s, className: "w-5 h-5 rounded-full border border-subtle object-cover" }),
      /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-primary font-semibold", children: s })
    ] })
  ] });
}
function Jt({ task: t = {}, onDelete: s = () => {
} }) {
  const [a, r] = x.useState(!1), i = (c) => c ? new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(c)) : "25.06.2026 14:30", l = () => {
    var u, p, m, h;
    const c = `${window.location.origin}/Tasks?task=${t.id || ""}`;
    (u = navigator.clipboard) == null || u.writeText(c), (h = (m = (p = window == null ? void 0 : window.abp) == null ? void 0 : p.notify) == null ? void 0 : m.success) == null || h.call(m, "Görev bağlantısı panoya kopyalandı!");
  }, o = () => {
    var c, u, p;
    (p = (u = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : u.info) == null || p.call(u, "Görev başarıyla çoğaltıldı.");
  }, d = () => {
    var c, u, p;
    (p = (u = (c = window == null ? void 0 : window.abp) == null ? void 0 : c.notify) == null ? void 0 : u.info) == null || p.call(u, "Görev arşive kaldırıldı.");
  };
  return /* @__PURE__ */ e.jsxs("aside", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs flex flex-col", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary mb-2", children: "Detaylar" }),
      /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col divide-y divide-subtle/50", children: [
        /* @__PURE__ */ e.jsx(
          De,
          {
            label: "Oluşturan",
            name: "Yakup B.",
            avatar: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64"
          }
        ),
        /* @__PURE__ */ e.jsx($, { label: "Oluşturma Tarihi", value: i(t.creationTime) }),
        /* @__PURE__ */ e.jsx(
          De,
          {
            label: "Güncelleyen",
            name: "Yakup B.",
            avatar: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64"
          }
        ),
        /* @__PURE__ */ e.jsx($, { label: "Son Güncelleme", value: i(t.lastModificationTime) }),
        /* @__PURE__ */ e.jsx($, { label: "Oluşturma Paneli", value: "25.06.2026 14:30" }),
        /* @__PURE__ */ e.jsx($, { label: "Tahmini Süre", value: "15 gün" }),
        /* @__PURE__ */ e.jsx($, { label: "Gerçekleşen Süre", value: "12 gün" }),
        a && /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col divide-y divide-subtle/50 animate-in fade-in-50", children: [
          /* @__PURE__ */ e.jsx($, { label: "Özel Alanlar", value: "Vize, Otel" }),
          /* @__PURE__ */ e.jsx($, { label: "Kategori", value: "Operasyon" }),
          /* @__PURE__ */ e.jsx($, { label: "SLA Seviyesi", value: "Standart (48s)" })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          onClick: () => r(!a),
          className: "mt-3 text-[13px] font-semibold text-primary hover:text-primary-hover flex items-center justify-center gap-1.5 transition-colors py-1 rounded-lg hover:bg-primary-subtle",
          children: [
            /* @__PURE__ */ e.jsx("span", { children: a ? "Daha az alan göster" : "Daha fazla alan göster" }),
            /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-down text-[10px] transition-transform ${a ? "rotate-180" : ""}` })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs flex flex-col gap-2.5", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "text-[14px] font-bold text-text-primary mb-1", children: "Hızlı işlemler" }),
      /* @__PURE__ */ e.jsx(
        j,
        {
          type: "button",
          variant: "outline",
          onClick: l,
          className: "w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]",
          icon: "fa-link",
          children: "Bağlantıyı kopyala"
        }
      ),
      /* @__PURE__ */ e.jsx(
        j,
        {
          type: "button",
          variant: "outline",
          onClick: o,
          className: "w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]",
          icon: "fa-copy",
          children: "Çoğalt"
        }
      ),
      /* @__PURE__ */ e.jsx(
        j,
        {
          type: "button",
          variant: "outline",
          onClick: d,
          className: "w-full justify-start text-text-secondary hover:text-text-primary h-10 border-subtle bg-surface-sunken/40 hover:bg-surface-hover font-medium rounded-xl text-[13px]",
          icon: "fa-box-archive",
          children: "Arşivle"
        }
      ),
      /* @__PURE__ */ e.jsx(
        j,
        {
          type: "button",
          variant: "outline",
          onClick: s,
          className: "w-full justify-start text-negative hover:bg-negative-subtle hover:border-negative/40 h-10 border-negative/20 font-semibold rounded-xl text-[13px] transition-colors mt-1",
          icon: "fa-trash-can",
          children: "Sil"
        }
      )
    ] })
  ] });
}
function Wt({ onAction: t = () => {
} }) {
  return /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-0.5 border-b border-subtle bg-surface-sunken/40 px-2 py-1.5 rounded-t-xl overflow-x-auto custom-scrollbar", children: [
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("bold"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Kalın (Ctrl+B)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-bold text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("italic"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "İtalik (Ctrl+I)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-italic text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("underline"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Altı Çizili (Ctrl+U)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-underline text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("strikethrough"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Üstü Çizili", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-strikethrough text-xs" }) }),
    /* @__PURE__ */ e.jsx("div", { className: "h-4 w-px bg-subtle mx-1 shrink-0" }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("bullet"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Madde İşaretli Liste", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-list-ul text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("numbered"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Numaralı Liste", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-list-ol text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("align-left"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Sola Hizala", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-align-left text-xs" }) }),
    /* @__PURE__ */ e.jsx("div", { className: "h-4 w-px bg-subtle mx-1 shrink-0" }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("link"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Bağlantı Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-link text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("image"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Görsel Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-image text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("table"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Tablo Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-table-cells text-xs" }) }),
    /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => t("mention"), className: "h-7 w-7 rounded flex items-center justify-center text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors", title: "Kişi Bahset (@)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-at text-xs" }) })
  ] });
}
function Xt({ task: t = {}, onFieldChange: s = () => {
} }) {
  const [a, r] = x.useState(
    t.description || "Önce medine sonra mekke 60 kişilik detaylar dosyada belirtilmiş ve otel rezervasyonları yapılmıştır."
  ), [i, l] = x.useState([
    { id: 1, text: "Otel listesi oluşturuldu", done: !0 },
    { id: 2, text: "Fiyat teklifleri alındı", done: !0 },
    { id: 3, text: "Sözleşme taslağı hazırlandı", done: !0 },
    { id: 4, text: "Sözleşme imzalandı", done: !0 }
  ]), [o, d] = x.useState(!0), [c, u] = x.useState(""), [p, m] = x.useState(!1), h = (b) => {
    l((D) => D.map(
      (S) => S.id === b ? { ...S, done: !S.done } : S
    ));
  }, y = (b) => {
    if (b.key === "Enter" || b.type === "blur") {
      const D = c.trim();
      D && l((S) => [...S, { id: Date.now(), text: D, done: !1 }]), u(""), m(!1);
    }
  }, n = (b) => {
    l((D) => D.filter((S) => S.id !== b));
  }, f = i.filter((b) => b.done).length, [g, w] = x.useState([
    {
      id: 1,
      author: "Elif A.",
      avatar: "https://ui-avatars.com/api/?name=Elif+A&background=ec4899&color=fff&size=64",
      date: "10.07.2026 09:30",
      text: "@Yakup B. Sözleşme dosyası güncellendi, kontrol eder misiniz?",
      likes: 2,
      hasLiked: !1
    }
  ]), [C, z] = x.useState(""), [F, L] = x.useState(!0), A = (b) => {
    b.preventDefault();
    const D = C.trim();
    if (!D) return;
    const S = {
      id: Date.now(),
      author: "Yakup B.",
      avatar: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64",
      date: "Şimdi",
      text: D,
      likes: 0,
      hasLiked: !1
    };
    w([S, ...g]), z("");
  }, W = (b) => {
    w((D) => D.map((S) => {
      if (S.id === b) {
        const U = !S.hasLiked;
        return {
          ...S,
          hasLiked: U,
          likes: U ? S.likes + 1 : S.likes - 1
        };
      }
      return S;
    }));
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col gap-2.5", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary", children: "Açıklama" }),
      /* @__PURE__ */ e.jsxs("div", { className: "rounded-xl border border-subtle bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all overflow-hidden shadow-xs", children: [
        /* @__PURE__ */ e.jsx(Wt, {}),
        /* @__PURE__ */ e.jsx(
          "textarea",
          {
            className: "w-full min-h-[110px] p-4 text-[14px] leading-relaxed text-text-primary bg-transparent focus:outline-none resize-y",
            value: a,
            onChange: (b) => {
              r(b.target.value), s("description", b.target.value);
            },
            placeholder: "Bu görevin detayları nelerdir? (@kişi, #etiket)..."
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs transition-all", children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          onClick: () => d(!o),
          className: "flex items-center justify-between cursor-pointer select-none group",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors", children: "Kontrol Listesi" }),
              i.length > 0 && /* @__PURE__ */ e.jsxs("span", { className: "text-xs font-semibold text-text-tertiary bg-surface-sunken px-2 py-0.5 rounded-full", children: [
                f,
                "/",
                i.length
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary group-hover:text-text-primary transition-colors", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-up transition-transform duration-200 ${o ? "" : "rotate-180"}` }) })
          ]
        }
      ),
      o && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-2.5 animate-in fade-in-50", children: [
        i.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden mb-1", children: /* @__PURE__ */ e.jsx(
          "div",
          {
            className: "h-full bg-success transition-all duration-300",
            style: { width: `${f / i.length * 100}%` }
          }
        ) }),
        i.map((b) => /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-surface-hover/70 transition-colors",
            children: [
              /* @__PURE__ */ e.jsxs("label", { className: "flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: b.done,
                    onChange: () => h(b.id),
                    className: "h-4 w-4 rounded border-subtle text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { className: `text-[13px] transition-all truncate ${b.done ? "line-through text-text-tertiary font-normal" : "text-text-primary font-medium"}`, children: b.text })
              ] }),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => n(b.id),
                  className: "opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-negative transition-all p-1",
                  title: "Maddeyi Sil",
                  children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-trash-can text-xs" })
                }
              )
            ]
          },
          b.id
        )),
        p ? /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ e.jsx(
          "input",
          {
            autoFocus: !0,
            type: "text",
            value: c,
            onChange: (b) => u(b.target.value),
            onKeyDown: y,
            onBlur: y,
            placeholder: "Yeni kontrol maddesi yazıp Enter'a basın...",
            className: "w-full h-9 px-3 text-[13px] rounded-lg border border-primary bg-surface-base focus:outline-none"
          }
        ) }) : /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            onClick: () => m(!0),
            className: "flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-hover transition-colors mt-1 px-2 py-1 w-max rounded-lg hover:bg-primary-subtle",
            children: [
              /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-plus text-[11px]" }),
              /* @__PURE__ */ e.jsx("span", { children: "Yeni madde ekle" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "flex flex-col rounded-2xl border border-subtle bg-surface-base p-5 shadow-xs transition-all", children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          onClick: () => L(!F),
          className: "flex items-center justify-between cursor-pointer select-none group",
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ e.jsx("h2", { className: "text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors", children: "Yorumlar & Güncellemeler" }),
              /* @__PURE__ */ e.jsx("span", { className: "flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-primary-subtle text-primary text-[11px] font-bold", children: g.length })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary group-hover:text-text-primary transition-colors", children: /* @__PURE__ */ e.jsx("i", { className: `fa-solid fa-chevron-up transition-transform duration-200 ${F ? "" : "rotate-180"}` }) })
          ]
        }
      ),
      F && /* @__PURE__ */ e.jsxs("div", { className: "mt-4 flex flex-col gap-5 animate-in fade-in-50", children: [
        /* @__PURE__ */ e.jsxs("form", { onSubmit: A, className: "flex gap-3 items-start", children: [
          /* @__PURE__ */ e.jsx(
            "img",
            {
              src: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64",
              alt: "Yakup",
              className: "h-8 w-8 rounded-full border border-subtle mt-1 shrink-0"
            }
          ),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col rounded-xl border border-subtle bg-surface-sunken/40 focus-within:bg-surface-base focus-within:border-primary focus-within:shadow-focus transition-all overflow-hidden", children: [
            /* @__PURE__ */ e.jsx(
              "textarea",
              {
                value: C,
                onChange: (b) => z(b.target.value),
                placeholder: "Bir yorum yazın... (@bahset, #görev)",
                rows: 2,
                className: "w-full p-3 text-[13px] bg-transparent focus:outline-none resize-none text-text-primary",
                onKeyDown: (b) => {
                  b.key === "Enter" && (b.ctrlKey || b.metaKey) && A(b);
                }
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-t border-subtle/50 bg-surface-base", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-1 text-text-tertiary", children: [
                /* @__PURE__ */ e.jsx("button", { type: "button", className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Dosya Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-paperclip text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Resim Ekle", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-image text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Emoji", children: /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-face-smile text-xs" }) }),
                /* @__PURE__ */ e.jsx("button", { type: "button", className: "h-7 w-7 rounded flex items-center justify-center hover:text-text-primary hover:bg-surface-hover transition-colors", title: "Bahset (@)", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-at text-xs" }) })
              ] }),
              /* @__PURE__ */ e.jsx(
                j,
                {
                  type: "submit",
                  size: "sm",
                  disabled: !C.trim(),
                  className: "bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 h-8 rounded-lg shadow-sm",
                  icon: "fa-paper-plane",
                  children: "Gönder"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-4 divide-y divide-subtle/50", children: g.map((b) => /* @__PURE__ */ e.jsxs("div", { className: "flex gap-3 pt-3 items-start first:pt-0", children: [
          /* @__PURE__ */ e.jsx("img", { src: b.avatar, alt: b.author, className: "h-8 w-8 rounded-full border border-subtle shrink-0" }),
          /* @__PURE__ */ e.jsxs("div", { className: "flex-1 flex flex-col gap-1", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-bold text-text-primary", children: b.author }),
                /* @__PURE__ */ e.jsx("span", { className: "text-[11px] text-text-tertiary font-mono", children: b.date })
              ] }),
              /* @__PURE__ */ e.jsx("button", { type: "button", className: "text-text-tertiary hover:text-text-primary text-xs p-1", title: "İşlemler", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-ellipsis" }) })
            ] }),
            /* @__PURE__ */ e.jsx("p", { className: "text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap", children: b.text.split(" ").map((D, S) => D.startsWith("@") ? /* @__PURE__ */ e.jsxs("span", { className: "font-semibold text-primary bg-primary-subtle px-1 py-0.5 rounded mr-1", children: [
              D,
              " "
            ] }, S) : D + " ") }),
            /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-4 mt-1", children: [
              /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => W(b.id),
                  className: `flex items-center gap-1.5 text-xs font-medium transition-colors ${b.hasLiked ? "text-primary" : "text-text-tertiary hover:text-text-primary"}`,
                  children: [
                    /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-thumbs-up" }),
                    /* @__PURE__ */ e.jsx("span", { children: b.likes > 0 ? b.likes : "Beğen" })
                  ]
                }
              ),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "text-xs font-medium text-text-tertiary hover:text-text-primary transition-colors",
                  children: "Yanıtla"
                }
              )
            ] })
          ] })
        ] }, b.id)) })
      ] })
    ] })
  ] });
}
function ea({
  lastSavedAt: t,
  isDirty: s,
  isSaving: a,
  onCancel: r,
  onSave: i
}) {
  const l = t ? new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(t)) : "10.07.2026 09:45";
  return /* @__PURE__ */ e.jsxs("footer", { className: "flex items-center justify-between border-t border-subtle bg-surface-base px-6 py-4 mt-auto", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2 text-xs text-text-tertiary", children: [
      /* @__PURE__ */ e.jsx("i", { className: "fa-regular fa-clock" }),
      /* @__PURE__ */ e.jsxs("span", { children: [
        "Son kayıt: ",
        /* @__PURE__ */ e.jsx("strong", { className: "font-medium text-text-secondary", children: l })
      ] }),
      s && /* @__PURE__ */ e.jsxs("span", { className: "flex items-center gap-1.5 text-warning font-medium ml-2", children: [
        /* @__PURE__ */ e.jsx("span", { className: "h-2 w-2 rounded-full bg-warning animate-pulse" }),
        "Kaydedilmemiş değişiklikler var"
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ e.jsx(
        j,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          onClick: r,
          className: "text-text-secondary hover:bg-surface-hover px-4",
          children: "Vazgeç"
        }
      ),
      /* @__PURE__ */ e.jsx(
        j,
        {
          type: "button",
          variant: "primary",
          size: "sm",
          onClick: i,
          disabled: !s || a,
          isLoading: a,
          loadingText: "Kaydediliyor…",
          className: "bg-primary hover:bg-primary-hover text-white px-6 font-medium shadow-sm transition-all rounded-lg",
          children: "Kaydet"
        }
      )
    ] })
  ] });
}
const Se = [
  {
    id: 1,
    user: "Yakup B.",
    avatar: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64",
    type: "field",
    category: "field",
    text: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      "Görev durumu ",
      /* @__PURE__ */ e.jsx("strong", { children: "Tamamlandı" }),
      " olarak değiştirildi"
    ] }),
    date: "10.07.2026 09:45"
  },
  {
    id: 2,
    user: "Elif A.",
    avatar: "https://ui-avatars.com/api/?name=Elif+A&background=ec4899&color=fff&size=64",
    type: "file",
    category: "files",
    text: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      "Dosya eklendi: ",
      /* @__PURE__ */ e.jsx("strong", { className: "text-primary cursor-pointer hover:underline", children: "Sözleşme_v2.pdf" })
    ] }),
    date: "10.07.2026 09:30"
  },
  {
    id: 3,
    user: "Yakup B.",
    avatar: "https://ui-avatars.com/api/?name=Yakup+B&background=6366f1&color=fff&size=64",
    type: "field",
    category: "field",
    text: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      "Son tarih ",
      /* @__PURE__ */ e.jsx("strong", { children: "12.07.2026" }),
      "'dan ",
      /* @__PURE__ */ e.jsx("strong", { children: "10.07.2026" }),
      " olarak değiştirildi"
    ] }),
    date: "09.07.2026 16:20"
  },
  {
    id: 4,
    user: "Mehmet K.",
    avatar: "https://ui-avatars.com/api/?name=Mehmet+K&background=10b981&color=fff&size=64",
    type: "comment",
    category: "comments",
    text: /* @__PURE__ */ e.jsx(e.Fragment, { children: "Yorum yaptı" }),
    date: "09.07.2026 11:10"
  },
  {
    id: 5,
    user: "Sistem",
    avatar: "",
    type: "system",
    category: "system",
    text: /* @__PURE__ */ e.jsx(e.Fragment, { children: "Görev oluşturuldu" }),
    date: "25.06.2026 14:30"
  }
];
function ta() {
  const [t, s] = x.useState("all"), a = t === "all" ? Se : Se.filter((r) => r.category === t);
  return /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col gap-6 rounded-2xl border border-subtle bg-surface-base p-6", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle pb-4", children: [
      /* @__PURE__ */ e.jsx("h3", { className: "text-[15px] font-bold text-text-primary", children: "AKTİVİTE & GEÇMİŞ TAKİBİ" }),
      /* @__PURE__ */ e.jsx("div", { className: "flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1", children: [
        { id: "all", label: "Tümü" },
        { id: "field", label: "Alan Değişiklikleri" },
        { id: "comments", label: "Yorumlar" },
        { id: "files", label: "Dosyalar" },
        { id: "system", label: "Sistem" },
        { id: "finance", label: "Finans" }
      ].map((r) => /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          onClick: () => s(r.id),
          className: `px-3 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${t === r.id ? "bg-primary text-white shadow-sm" : "bg-surface-sunken text-text-secondary hover:bg-surface-hover hover:text-text-primary"}`,
          children: r.label
        },
        r.id
      )) })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "flex flex-col divide-y divide-subtle/50", children: a.map((r) => /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between py-3.5 hover:bg-surface-hover/50 px-2 rounded-lg transition-colors", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-3", children: [
        r.avatar ? /* @__PURE__ */ e.jsx("img", { src: r.avatar, alt: r.user, className: "h-8 w-8 rounded-full border border-subtle" }) : /* @__PURE__ */ e.jsx("div", { className: "h-8 w-8 rounded-full bg-surface-sunken border border-subtle flex items-center justify-center text-text-tertiary", children: /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-server text-xs" }) }),
        /* @__PURE__ */ e.jsx("div", { className: "flex flex-col gap-0.5", children: /* @__PURE__ */ e.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ e.jsx("span", { className: "text-[13px] font-semibold text-text-primary", children: r.user }),
          /* @__PURE__ */ e.jsx("span", { className: "text-[13px] text-text-secondary", children: r.text })
        ] }) })
      ] }),
      /* @__PURE__ */ e.jsx("span", { className: "text-xs text-text-tertiary font-mono", children: r.date })
    ] }, r.id)) })
  ] });
}
const Ee = "apya.taskDetail.fullscreen";
function Qe({
  taskId: t,
  presentation: s = "modal",
  onClose: a,
  switchToTask: r
}) {
  const [i, l] = x.useState(t), { data: o, isLoading: d, isError: c, refetch: u } = Ie(i), p = J(), m = Re(), h = Me(o), y = Ye(), n = Oe(i), [f, g] = x.useState("general"), [w, C] = x.useState(
    () => {
      var T;
      return ((T = window.localStorage) == null ? void 0 : T.getItem(Ee)) === "1";
    }
  ), [z, F] = x.useState(!1), L = x.useCallback(() => {
    Ge(), a == null || a();
  }, [a]);
  Ke(t, L), ee.useEffect(() => {
    h.isDirty ? m.markDirty() : m.markClean();
  });
  const A = x.useCallback(() => m.requestClose(L), [m, L]), W = x.useCallback(() => {
    C((T) => {
      var G;
      const B = !T;
      return (G = window.localStorage) == null || G.setItem(Ee, B ? "1" : "0"), B;
    });
  }, []), b = x.useMemo(
    () => Ue(n.assignedCodes),
    [n.assignedCodes]
  ), D = b.find((T) => T.code === f) || b[0], S = x.useCallback(async () => {
    var T, B, G, V, P, K;
    if (!h.validate()) return !1;
    F(!0);
    try {
      return await Promise.resolve(
        window.apya.platform.tasks.task.update(i, h.toUpdateDto())
      ), await p.invalidateQueries({ queryKey: ["task-detail", i] }), R.emitResult(), (G = (B = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : B.success) == null || G.call(B, "Görev başarıyla güncellendi."), !0;
    } catch (M) {
      return (K = (P = (V = window == null ? void 0 : window.abp) == null ? void 0 : V.notify) == null ? void 0 : P.error) == null || K.call(P, (M == null ? void 0 : M.message) || "Kaydedilemedi."), !1;
    } finally {
      F(!1);
    }
  }, [i, h, p]), U = x.useCallback(async () => {
    var T, B, G, V, P, K;
    if (window.confirm("Bu görevi silmek istediğinize emin misiniz?"))
      try {
        await Promise.resolve(window.apya.platform.tasks.task.delete(i)), (G = (B = (T = window == null ? void 0 : window.abp) == null ? void 0 : T.notify) == null ? void 0 : B.info) == null || G.call(B, "Görev silindi."), m.markClean(), L();
      } catch (M) {
        (K = (P = (V = window == null ? void 0 : window.abp) == null ? void 0 : V.notify) == null ? void 0 : P.error) == null || K.call(P, (M == null ? void 0 : M.message) || "Görev silinemedi.");
      }
  }, [i, m, L]), te = d ? /* @__PURE__ */ e.jsxs("div", { className: "p-8 space-y-4", children: [
    /* @__PURE__ */ e.jsx(q, { className: "h-8 w-1/3" }),
    /* @__PURE__ */ e.jsx(q, { className: "h-20 w-full" }),
    /* @__PURE__ */ e.jsx(q, { className: "h-64 w-full" })
  ] }) : c ? /* @__PURE__ */ e.jsxs("div", { className: "p-12 text-center flex flex-col items-center gap-3", children: [
    /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-triangle-exclamation text-3xl text-warning" }),
    /* @__PURE__ */ e.jsx("p", { className: "text-text-secondary font-medium", children: "Görev detayları yüklenemedi." }),
    /* @__PURE__ */ e.jsx(j, { variant: "ghost", onClick: () => u(), children: "Tekrar Dene" })
  ] }) : /* @__PURE__ */ e.jsxs("div", { className: "flex flex-col min-h-0 bg-surface-base", children: [
    /* @__PURE__ */ e.jsx(
      _t,
      {
        task: o,
        onClose: A,
        isFullscreen: w,
        onToggleFullscreen: W,
        presentation: s
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "overflow-y-auto max-h-[85vh] custom-scrollbar", children: [
      /* @__PURE__ */ e.jsx(
        Ht,
        {
          task: o,
          assigneeOptions: y.options,
          onFieldChange: h.setField
        }
      ),
      /* @__PURE__ */ e.jsxs("div", { className: "flex items-center justify-between border-b border-subtle px-6 bg-surface-base", children: [
        /* @__PURE__ */ e.jsx(
          Zt,
          {
            activeTab: f,
            onTabChange: g,
            visibleTabs: b
          }
        ),
        /* @__PURE__ */ e.jsx("div", { className: "py-2", children: /* @__PURE__ */ e.jsx(He, { assignedCodes: n.assignedCodes }) })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "p-6", children: f === "general" ? /* @__PURE__ */ e.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start", children: [
        /* @__PURE__ */ e.jsx("div", { className: "min-w-0 space-y-6", children: /* @__PURE__ */ e.jsx(
          Xt,
          {
            task: o,
            onFieldChange: h.setField
          }
        ) }),
        /* @__PURE__ */ e.jsx("div", { className: "w-full shrink-0", children: /* @__PURE__ */ e.jsx(
          Jt,
          {
            task: o,
            onDelete: U
          }
        ) })
      ] }) : f === "history" || f === "activity" ? /* @__PURE__ */ e.jsx(ta, {}) : /* @__PURE__ */ e.jsx(x.Suspense, { fallback: /* @__PURE__ */ e.jsx(q, { className: "h-48 w-full" }), children: D != null && D.component ? /* @__PURE__ */ e.jsx(
        D.component,
        {
          taskId: i,
          task: o,
          onOpenSubtask: r
        }
      ) : /* @__PURE__ */ e.jsxs("div", { className: "text-center py-12 text-text-tertiary border border-dashed border-subtle rounded-xl", children: [
        /* @__PURE__ */ e.jsx("i", { className: "fa-solid fa-person-digging text-4xl mb-4 opacity-50" }),
        /* @__PURE__ */ e.jsx("p", { children: "Bu sekme yapım aşamasında." })
      ] }) }) })
    ] }),
    /* @__PURE__ */ e.jsx(
      ea,
      {
        lastSavedAt: o == null ? void 0 : o.lastModificationTime,
        isDirty: m.isDirty,
        isSaving: z,
        onCancel: A,
        onSave: S
      }
    )
  ] });
  return s === "page" ? /* @__PURE__ */ e.jsx("div", { className: "w-full max-w-6xl mx-auto my-6 rounded-2xl border border-subtle bg-surface-base shadow-sm overflow-hidden", children: te }) : /* @__PURE__ */ e.jsx(
    Le,
    {
      open: !0,
      onOpenChange: (T) => {
        T || A();
      },
      children: /* @__PURE__ */ e.jsx(
        Fe,
        {
          title: o != null && o.title ? `Görev Detayı: ${o.title}` : "Görev Detayı",
          fullscreen: w,
          className: "max-w-6xl p-0 overflow-hidden rounded-2xl border border-subtle shadow-2xl bg-surface-base",
          onInteractOutside: (T) => {
            T.preventDefault(), A();
          },
          onEscapeKeyDown: (T) => {
            T.preventDefault(), A();
          },
          children: te
        }
      )
    }
  );
}
function aa() {
  var s;
  const t = x.useSyncExternalStore(
    R.subscribe,
    R.getSnapshot,
    () => null
  );
  return t ? (s = window.apya) != null && s.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(de, { children: /* @__PURE__ */ e.jsx(
    Qe,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        R.close(), R.emitResult();
      }
    }
  ) }) : /* @__PURE__ */ e.jsx(de, { children: /* @__PURE__ */ e.jsx(
    Ve,
    {
      taskId: t,
      presentation: "modal",
      onClose: () => {
        R.close(), R.emitResult();
      }
    }
  ) }) : null;
}
function sa() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v2" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : !(window.localStorage.getItem("apya.taskDetail.v2") === "0");
  } catch {
    return !0;
  }
}
function ra() {
  try {
    return new URLSearchParams(window.location.search).get("taskui") === "v3" ? !0 : new URLSearchParams(window.location.search).get("taskui") === "v2" || new URLSearchParams(window.location.search).get("taskui") === "v1" ? !1 : window.localStorage.getItem("apya.taskDetail.v3") === "1" || !0;
  } catch {
    return !0;
  }
}
const ze = document.getElementById("task-detail-island");
if (ze && (window.apya = window.apya || {}, window.apya.taskDetailV3Enabled = ra(), window.apya.taskDetailV2Enabled = sa() && !window.apya.taskDetailV3Enabled, window.apya.taskDetail = {
  open: (t) => R.open(t),
  close: () => R.close(),
  onResult: (t) => R.onResult(t)
}, Ae(ze).render(/* @__PURE__ */ e.jsx(aa, {})), window.apya.taskDetailV2Enabled || window.apya.taskDetailV3Enabled)) {
  const t = Pe();
  t && R.open(t);
}
function ia({ taskId: t }) {
  var a;
  const s = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = "/Tasks";
  };
  return (a = window.apya) != null && a.taskDetailV3Enabled ? /* @__PURE__ */ e.jsx(de, { children: /* @__PURE__ */ e.jsx(
    Qe,
    {
      taskId: t,
      presentation: "page",
      onClose: s
    }
  ) }) : /* @__PURE__ */ e.jsx(de, { children: /* @__PURE__ */ e.jsx(
    Ve,
    {
      taskId: t,
      presentation: "page",
      onClose: s
    }
  ) });
}
const me = document.getElementById("task-detail-page-island");
if (me) {
  const t = me.getAttribute("data-task-id");
  t && Ae(me).render(/* @__PURE__ */ e.jsx(ia, { taskId: t }));
}
